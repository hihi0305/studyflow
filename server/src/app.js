const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "StudyFlow API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);

module.exports = app;
