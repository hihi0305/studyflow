const express = require("express");
const pool = require("../db");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authenticateToken);

// GET /api/dashboard
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `
        SELECT
          t.id,
          t.title,
          t.due_date AS "dueDate",
          t.priority,
          t.progress,
          t.status,
          t.course_id AS "courseId",
          c.course_number AS "courseName"
        FROM academic_tasks t
        LEFT JOIN courses c
          ON t.course_id = c.id
          AND c.user_id = $1
        WHERE t.user_id = $1
        ORDER BY
          CASE WHEN t.status = 'Completed' THEN 1 ELSE 0 END,
          t.due_date ASC
      `,
      [req.userId]
    );

    const tasks = result.rows;

    const totalTasks = tasks.length;

    const completedTasks = tasks.filter(
      (task) => task.status === "Completed"
    ).length;

    const activeTasks = totalTasks - completedTasks;

    return res.status(200).json({
      summary: {
        totalTasks,
        activeTasks,
        completedTasks,
      },
      tasks,
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    return res.status(500).json({
      error: { message: "Unable to retrieve dashboard data." },
    });
  }
});

module.exports = router;
