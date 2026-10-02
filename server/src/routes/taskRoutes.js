const express = require("express");
const pool = require("../db");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authenticateToken);

const VALID_STATUSES = ["Not Started", "In Progress", "Completed"];

function normalizeTaskState(progress, status) {
  let normalizedProgress = progress;
  let normalizedStatus = status;

  if (normalizedStatus === "Completed") {
    normalizedProgress = 100;
  } else if (normalizedProgress === 100) {
    normalizedStatus = "Completed";
  }

  return {
    progress: normalizedProgress,
    status: normalizedStatus,
  };
}

function validateProgress(progress) {
  return (
    Number.isInteger(progress) &&
    progress >= 0 &&
    progress <= 100
  );
}

async function userOwnsCourse(courseId, userId) {
  if (courseId === null || courseId === undefined) {
    return true;
  }

  const result = await pool.query(
    `
      SELECT id
      FROM courses
      WHERE id = $1
        AND user_id = $2
    `,
    [courseId, userId]
  );

  return result.rows.length > 0;
}

// GET /api/tasks
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `
        SELECT
          id,
          course_id AS "courseId",
          title,
          description,
          due_date AS "dueDate",
          task_type AS "taskType",
          priority,
          estimated_hours AS "estimatedHours",
          progress,
          status,
          created_at AS "createdAt",
          updated_at AS "updatedAt"
        FROM academic_tasks
        WHERE user_id = $1
        ORDER BY due_date ASC
      `,
      [req.userId]
    );

    return res.status(200).json({
      tasks: result.rows,
    });
  } catch (error) {
    console.error("Get tasks error:", error);

    return res.status(500).json({
      error: { message: "Unable to retrieve tasks." },
    });
  }
});

// POST /api/tasks
router.post("/", async (req, res) => {
  try {
    const {
      courseId = null,
      title,
      description = null,
      dueDate,
      taskType = null,
      priority = null,
      estimatedHours = null,
      progress = 0,
      status = "Not Started",
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        error: { message: "Task title is required." },
      });
    }

    if (!dueDate || Number.isNaN(Date.parse(dueDate))) {
      return res.status(400).json({
        error: { message: "A valid due date is required." },
      });
    }

    if (!validateProgress(progress)) {
      return res.status(400).json({
        error: { message: "Progress must be an integer from 0 to 100." },
      });
    }

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        error: {
          message:
            "Status must be Not Started, In Progress, or Completed.",
        },
      });
    }

    if (
      estimatedHours !== null &&
      (Number.isNaN(Number(estimatedHours)) ||
        Number(estimatedHours) < 0)
    ) {
      return res.status(400).json({
        error: { message: "Estimated hours cannot be negative." },
      });
    }

    if (courseId !== null) {
      const numericCourseId = Number(courseId);

      if (
        !Number.isInteger(numericCourseId) ||
        numericCourseId <= 0
      ) {
        return res.status(400).json({
          error: { message: "Invalid course ID." },
        });
      }

      const ownsCourse = await userOwnsCourse(
        numericCourseId,
        req.userId
      );

      if (!ownsCourse) {
        return res.status(400).json({
          error: {
            message:
              "Task can only be associated with one of your courses.",
          },
        });
      }
    }

    const normalized = normalizeTaskState(progress, status);

    const result = await pool.query(
      `
        INSERT INTO academic_tasks (
          user_id,
          course_id,
          title,
          description,
          due_date,
          task_type,
          priority,
          estimated_hours,
          progress,
          status
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING
          id,
          course_id AS "courseId",
          title,
          description,
          due_date AS "dueDate",
          task_type AS "taskType",
          priority,
          estimated_hours AS "estimatedHours",
          progress,
          status,
          created_at AS "createdAt",
          updated_at AS "updatedAt"
      `,
      [
        req.userId,
        courseId,
        title.trim(),
        description,
        dueDate,
        taskType,
        priority,
        estimatedHours,
        normalized.progress,
        normalized.status,
      ]
    );

    return res.status(201).json({
      task: result.rows[0],
    });
  } catch (error) {
    console.error("Create task error:", error);

    return res.status(500).json({
      error: { message: "Unable to create task." },
    });
  }
});

// PUT /api/tasks/:id
router.put("/:id", async (req, res) => {
  try {
    const taskId = Number(req.params.id);

    if (!Number.isInteger(taskId) || taskId <= 0) {
      return res.status(400).json({
        error: { message: "Invalid task ID." },
      });
    }

    const existingResult = await pool.query(
      `
        SELECT *
        FROM academic_tasks
        WHERE id = $1
          AND user_id = $2
      `,
      [taskId, req.userId]
    );

    if (existingResult.rows.length === 0) {
      return res.status(404).json({
        error: { message: "Task not found." },
      });
    }

    const existing = existingResult.rows[0];

    const title =
      req.body.title !== undefined
        ? req.body.title
        : existing.title;

    const description =
      req.body.description !== undefined
        ? req.body.description
        : existing.description;

    const dueDate =
      req.body.dueDate !== undefined
        ? req.body.dueDate
        : existing.due_date;

    const taskType =
      req.body.taskType !== undefined
        ? req.body.taskType
        : existing.task_type;

    const priority =
      req.body.priority !== undefined
        ? req.body.priority
        : existing.priority;

    const estimatedHours =
      req.body.estimatedHours !== undefined
        ? req.body.estimatedHours
        : existing.estimated_hours;

    const courseId =
      req.body.courseId !== undefined
        ? req.body.courseId
        : existing.course_id;

    const progress =
      req.body.progress !== undefined
        ? req.body.progress
        : existing.progress;

    const status =
      req.body.status !== undefined
        ? req.body.status
        : existing.status;

    if (!title || !String(title).trim()) {
      return res.status(400).json({
        error: { message: "Task title is required." },
      });
    }

    if (!dueDate || Number.isNaN(Date.parse(dueDate))) {
      return res.status(400).json({
        error: { message: "A valid due date is required." },
      });
    }

    if (!validateProgress(progress)) {
      return res.status(400).json({
        error: { message: "Progress must be an integer from 0 to 100." },
      });
    }

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        error: {
          message:
            "Status must be Not Started, In Progress, or Completed.",
        },
      });
    }

    if (
      estimatedHours !== null &&
      (Number.isNaN(Number(estimatedHours)) ||
        Number(estimatedHours) < 0)
    ) {
      return res.status(400).json({
        error: { message: "Estimated hours cannot be negative." },
      });
    }

    if (courseId !== null) {
      const numericCourseId = Number(courseId);

      if (
        !Number.isInteger(numericCourseId) ||
        numericCourseId <= 0
      ) {
        return res.status(400).json({
          error: { message: "Invalid course ID." },
        });
      }

      const ownsCourse = await userOwnsCourse(
        numericCourseId,
        req.userId
      );

      if (!ownsCourse) {
        return res.status(400).json({
          error: {
            message:
              "Task can only be associated with one of your courses.",
          },
        });
      }
    }

    const normalized = normalizeTaskState(progress, status);

    const result = await pool.query(
      `
        UPDATE academic_tasks
        SET course_id = $1,
            title = $2,
            description = $3,
            due_date = $4,
            task_type = $5,
            priority = $6,
            estimated_hours = $7,
            progress = $8,
            status = $9,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $10
          AND user_id = $11
        RETURNING
          id,
          course_id AS "courseId",
          title,
          description,
          due_date AS "dueDate",
          task_type AS "taskType",
          priority,
          estimated_hours AS "estimatedHours",
          progress,
          status,
          created_at AS "createdAt",
          updated_at AS "updatedAt"
      `,
      [
        courseId,
        String(title).trim(),
        description,
        dueDate,
        taskType,
        priority,
        estimatedHours,
        normalized.progress,
        normalized.status,
        taskId,
        req.userId,
      ]
    );

    return res.status(200).json({
      task: result.rows[0],
    });
  } catch (error) {
    console.error("Update task error:", error);

    return res.status(500).json({
      error: { message: "Unable to update task." },
    });
  }
});

// DELETE /api/tasks/:id
router.delete("/:id", async (req, res) => {
  try {
    const taskId = Number(req.params.id);

    if (!Number.isInteger(taskId) || taskId <= 0) {
      return res.status(400).json({
        error: { message: "Invalid task ID." },
      });
    }

    const result = await pool.query(
      `
        DELETE FROM academic_tasks
        WHERE id = $1
          AND user_id = $2
        RETURNING id
      `,
      [taskId, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: { message: "Task not found." },
      });
    }

    return res.status(204).send();
  } catch (error) {
    console.error("Delete task error:", error);

    return res.status(500).json({
      error: { message: "Unable to delete task." },
    });
  }
});

module.exports = router;
