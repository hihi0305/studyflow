const express = require("express");
const pool = require("../db");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authenticateToken);

// GET /api/courses
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `
        SELECT
		  id,
		  course_number AS "courseNumber",
		  created_at AS "createdAt",
		  updated_at AS "updatedAt"
		FROM courses
		WHERE user_id = $1
		ORDER BY created_at DESC
      `,
      [req.userId]
    );

    return res.status(200).json({
      courses: result.rows,
    });
  } catch (error) {
    console.error("Get courses error:", error);

    return res.status(500).json({
      error: { message: "Unable to retrieve courses." },
    });
  }
});

// POST /api/courses
router.post("/", async (req, res) => {
  try {
    const { courseNumber } = req.body;

    if (!courseNumber || !courseNumber.trim()) {
      return res.status(400).json({
        error: { message: "Course Number is required." },
      });
    }

    const result = await pool.query(
      `
        INSERT INTO courses (user_id, course_number)
		VALUES ($1, $2)
		RETURNING
		  id,
		  course_number AS "courseNumber",
		  created_at AS "createdAt",
		  updated_at AS "updatedAt"
      `,
      [req.userId, courseNumber.trim()]
    );

    return res.status(201).json({
      course: result.rows[0],
    });
  } catch (error) {
    console.error("Create course error:", error);

    return res.status(500).json({
      error: { message: "Unable to create course." },
    });
  }
});

// PUT /api/courses/:id
router.put("/:id", async (req, res) => {
  try {
    const courseId = Number(req.params.id);
    const { courseNumber } = req.body;

    if (!Number.isInteger(courseId) || courseId <= 0) {
      return res.status(400).json({
        error: { message: "Invalid course ID." },
      });
    }

    if (!courseNumber || !courseNumber.trim()) {
      return res.status(400).json({
        error: { message: "Course Number is required." },
      });
    }

    const result = await pool.query(
      `
        UPDATE courses
		SET course_number = $1,
			updated_at = CURRENT_TIMESTAMP
		WHERE id = $2
		  AND user_id = $3
		RETURNING
		  id,
		  course_number AS "courseNumber",
		  created_at AS "createdAt",
		  updated_at AS "updatedAt"
      `,
      [courseNumber.trim(), courseId, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: { message: "Course not found." },
      });
    }

    return res.status(200).json({
      course: result.rows[0],
    });
  } catch (error) {
    console.error("Update course error:", error);

    return res.status(500).json({
      error: { message: "Unable to update course." },
    });
  }
});

// DELETE /api/courses/:id
router.delete("/:id", async (req, res) => {
  try {
    const courseId = Number(req.params.id);

    if (!Number.isInteger(courseId) || courseId <= 0) {
      return res.status(400).json({
        error: { message: "Invalid course ID." },
      });
    }

    const result = await pool.query(
      `
        DELETE FROM courses
        WHERE id = $1
          AND user_id = $2
        RETURNING id
      `,
      [courseId, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: { message: "Course not found." },
      });
    }

    return res.status(204).send();
  } catch (error) {
    console.error("Delete course error:", error);

    return res.status(500).json({
      error: { message: "Unable to delete course." },
    });
  }
});

module.exports = router;
