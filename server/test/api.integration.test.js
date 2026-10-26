const path = require("path");

// Load the integration-test environment before importing the app/database.
require("dotenv").config({
  path: path.join(__dirname, "..", ".env.test"),
});

const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");

const app = require("../src/app");
const pool = require("../src/db");

const uniqueId = `${Date.now()}-${process.pid}`;

const userA = {
  name: "Integration User A",
  email: `integration-a-${uniqueId}@example.com`,
  password: "ValidPass1!",
};

const userB = {
  name: "Integration User B",
  email: `integration-b-${uniqueId}@example.com`,
  password: "ValidPass1!",
};

function auth(token) {
  return {
    Authorization: `Bearer ${token}`,
  };
}

function dateDaysFromNow(days) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

async function cleanupTestUsers() {
  const result = await pool.query(
    `
      SELECT id
      FROM users
      WHERE email = ANY($1::text[])
    `,
    [[userA.email, userB.email]]
  );

  const userIds = result.rows.map((row) => row.id);

  if (userIds.length === 0) {
    return;
  }

  await pool.query(
    `
      DELETE FROM academic_tasks
      WHERE user_id = ANY($1::int[])
    `,
    [userIds]
  );

  await pool.query(
    `
      DELETE FROM courses
      WHERE user_id = ANY($1::int[])
    `,
    [userIds]
  );

  await pool.query(
    `
      DELETE FROM users
      WHERE id = ANY($1::int[])
    `,
    [userIds]
  );
}

test("StudyFlow main API integration flow", async () => {
  let tokenA;
  let tokenB;
  let courseId;
  let taskId;

  try {
    // Make repeated local test runs safe.
    await cleanupTestUsers();

    // ------------------------------------------------------------
    // 1. Authentication integration flow
    // ------------------------------------------------------------

    let response = await request(app)
      .post("/api/auth/register")
      .send(userA);

    assert.equal(response.status, 201);
    assert.equal(response.body.user.email, userA.email);

    response = await request(app)
      .post("/api/auth/register")
      .send(userB);

    assert.equal(response.status, 201);
    assert.equal(response.body.user.email, userB.email);

    response = await request(app)
      .post("/api/auth/login")
      .send({
        email: userA.email,
        password: userA.password,
      });

    assert.equal(response.status, 200);
    assert.ok(response.body.accessToken);
    assert.equal(response.body.user.email, userA.email);
    tokenA = response.body.accessToken;

    response = await request(app)
      .post("/api/auth/login")
      .send({
        email: userB.email,
        password: userB.password,
      });

    assert.equal(response.status, 200);
    assert.ok(response.body.accessToken);
    tokenB = response.body.accessToken;

    response = await request(app)
      .get("/api/auth/me")
      .set(auth(tokenA));

    assert.equal(response.status, 200);
    assert.equal(response.body.user.email, userA.email);

    // Protected route without a token should be rejected.
    response = await request(app)
      .get("/api/courses");

    assert.equal(response.status, 401);

    // ------------------------------------------------------------
    // 2. Course create/read/update flow
    // ------------------------------------------------------------

    response = await request(app)
      .post("/api/courses")
      .set(auth(tokenA))
      .send({
        courseNumber: "CS 415 INTEGRATION",
      });

    assert.equal(response.status, 201);
    assert.equal(
      response.body.course.courseNumber,
      "CS 415 INTEGRATION"
    );

    courseId = response.body.course.id;
    assert.ok(courseId);

    response = await request(app)
      .get("/api/courses")
      .set(auth(tokenA));

    assert.equal(response.status, 200);
    assert.ok(
      response.body.courses.some(
        (course) => course.id === courseId
      )
    );

    response = await request(app)
      .put(`/api/courses/${courseId}`)
      .set(auth(tokenA))
      .send({
        courseNumber: "CS 415 UPDATED",
      });

    assert.equal(response.status, 200);
    assert.equal(
      response.body.course.courseNumber,
      "CS 415 UPDATED"
    );

    // ------------------------------------------------------------
    // 3. User-specific Course isolation
    // ------------------------------------------------------------

    response = await request(app)
      .get("/api/courses")
      .set(auth(tokenB));

    assert.equal(response.status, 200);
    assert.equal(
      response.body.courses.some(
        (course) => course.id === courseId
      ),
      false
    );

    response = await request(app)
      .put(`/api/courses/${courseId}`)
      .set(auth(tokenB))
      .send({
        courseNumber: "UNAUTHORIZED UPDATE",
      });

    assert.equal(response.status, 404);

    // ------------------------------------------------------------
    // 4. Academic Task create + Course association + TAL
    // ------------------------------------------------------------

    response = await request(app)
      .post("/api/tasks")
      .set(auth(tokenA))
      .send({
        courseId,
        title: "Integration High TAL Task",
        description: "Integration test task",
        dueDate: dateDaysFromNow(1),
        taskType: "Assignment",
        priority: "High",
        estimatedHours: 6,
        progress: 0,
        status: "Not Started",
      });

    assert.equal(response.status, 201);

    taskId = response.body.task.id;
    assert.ok(taskId);

    assert.equal(response.body.task.courseId, courseId);
    assert.equal(
      response.body.task.title,
      "Integration High TAL Task"
    );

    assert.equal(response.body.task.status, "Not Started");
    assert.equal(response.body.task.progress, 0);

    // High priority + near due date + large estimated work +
    // low progress should produce a High Task Attention Level.
    assert.equal(response.body.task.attentionLevel, "High");
    assert.ok(
      Number.isInteger(response.body.task.attentionScore) ||
        typeof response.body.task.attentionScore === "number"
    );

    // ------------------------------------------------------------
    // 5. Task read flow + TAL through API
    // ------------------------------------------------------------

    response = await request(app)
      .get("/api/tasks")
      .set(auth(tokenA));

    assert.equal(response.status, 200);

    const createdTask = response.body.tasks.find(
      (task) => task.id === taskId
    );

    assert.ok(createdTask);
    assert.equal(createdTask.courseId, courseId);
    assert.equal(createdTask.courseNumber, "CS 415 UPDATED");
    assert.equal(createdTask.attentionLevel, "High");

    // ------------------------------------------------------------
    // 6. User-specific Task isolation
    // ------------------------------------------------------------

    response = await request(app)
      .get("/api/tasks")
      .set(auth(tokenB));

    assert.equal(response.status, 200);
    assert.equal(
      response.body.tasks.some((task) => task.id === taskId),
      false
    );

    response = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set(auth(tokenB))
      .send({
        title: "Unauthorized Task Update",
      });

    assert.equal(response.status, 404);

    response = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set(auth(tokenB));

    assert.equal(response.status, 404);

    // User B must not be able to create a task using User A's course.
    response = await request(app)
      .post("/api/tasks")
      .set(auth(tokenB))
      .send({
        courseId,
        title: "Unauthorized Course Association",
        dueDate: dateDaysFromNow(3),
        priority: "Medium",
        estimatedHours: 2,
        progress: 0,
        status: "Not Started",
      });

    assert.equal(response.status, 400);
    assert.equal(
      response.body.error.message,
      "Task can only be associated with one of your courses."
    );

    // ------------------------------------------------------------
    // 7. Progress/status normalization
    // ------------------------------------------------------------

    response = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set(auth(tokenA))
      .send({
        progress: 50,
        status: "Not Started",
      });

    assert.equal(response.status, 200);

    // 1–99% progress cannot remain Not Started.
    assert.equal(response.body.task.progress, 50);
    assert.equal(response.body.task.status, "In Progress");

    response = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set(auth(tokenA))
      .send({
        progress: 100,
        status: "In Progress",
      });

    assert.equal(response.status, 200);

    // 100% progress normalizes to Completed.
    assert.equal(response.body.task.progress, 100);
    assert.equal(response.body.task.status, "Completed");

    // Completed tasks do not receive an active TAL.
    assert.equal(response.body.task.attentionLevel, null);
    assert.equal(response.body.task.attentionScore, null);

    // ------------------------------------------------------------
    // 8. Academic Task delete flow
    // ------------------------------------------------------------

    response = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set(auth(tokenA));

    assert.equal(response.status, 204);
    taskId = null;

    response = await request(app)
      .get("/api/tasks")
      .set(auth(tokenA));

    assert.equal(response.status, 200);
    assert.equal(
      response.body.tasks.some(
        (task) =>
          task.title === "Integration High TAL Task"
      ),
      false
    );

    // ------------------------------------------------------------
    // 9. Course delete flow
    // ------------------------------------------------------------

    response = await request(app)
      .delete(`/api/courses/${courseId}`)
      .set(auth(tokenA));

    assert.equal(response.status, 204);
    courseId = null;

    response = await request(app)
      .get("/api/courses")
      .set(auth(tokenA));

    assert.equal(response.status, 200);
    assert.equal(
      response.body.courses.some(
        (course) => course.courseNumber === "CS 415 UPDATED"
      ),
      false
    );
  } finally {
    // Cleanup protects the test database even if an assertion fails.
    await cleanupTestUsers();
    await pool.end();
  }
});
