import { useState, useEffect } from "react";
import { courseService } from "../../services/courseService";

export function TaskFormModal({ isOpen, onClose, onSubmit, initialData = null, isLoading = false }) {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    course_id: "",
    due_date: "",
    task_type: "Assignment",
    priority: "Medium",
    estimated_hours: 1,
    progress: 0,
    status: "Not Started",
  });
  const [error, setError] = useState("");

  // Load courses for the dropdown when the modal opens
  useEffect(() => {
    if (isOpen) {
      loadCourses();
    }
  }, [isOpen]);

  // Populate form if initialData is provided (edit mode), or reset to defaults
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        course_id: initialData.course_id || initialData.courseId || "",
        due_date: (initialData.dueDate || initialData.due_date)?.substring(0, 10) || "",
        task_type: initialData.task_type || initialData.taskType || "Assignment",
        priority: initialData.priority || "Medium",
        estimated_hours: initialData.estimated_hours || initialData.estimatedHours || 1,
        progress: initialData.progress ?? 0,
        status: initialData.status || "Not Started",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        course_id: "",
        due_date: "",
        task_type: "Assignment",
        priority: "Medium",
        estimated_hours: 1,
        progress: 0,
        status: "Not Started",
      });
    }
    setError("");
  }, [initialData, isOpen]);

  const loadCourses = async () => {
    try {
      const data = await courseService.getCourses();
      const courseList = Array.isArray(data) ? data : data.courses || [];
      setCourses(courseList);

      // Default to the first available course if adding a new task
      if (!initialData && courseList.length > 0 && !formData.course_id) {
        setFormData((prev) => ({
          ...prev,
          course_id: courseList[0].id,
        }));
      }
    } catch (err) {
      console.error("Failed to load courses for task form:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (name === "progress") {
      const numericProgress = Number(value);

      let nextStatus = prev.status;

      if (numericProgress === 100) {
        nextStatus = "Completed";
      } else if (
        numericProgress > 0 &&
        numericProgress < 100 &&
        prev.status === "Not Started"
      ) {
        nextStatus = "In Progress";
      } else if (
        numericProgress < 100 &&
        prev.status === "Completed"
      ) {
        nextStatus = numericProgress === 0 ? "Not Started" : "In Progress";
      }

      return {
        ...prev,
        progress: numericProgress,
        status: nextStatus,
      };
    }

    if (name === "status") {
      return {
        ...prev,
        status: value,
        progress: value === "Completed" ? 100 : prev.progress,
      };
    }

    return {
      ...prev,
      [name]: name === "estimated_hours" ? Number(value) : value,
    };
  });
};

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError("Task title is required.");
      return;
    }
    if (!formData.due_date) {
      setError("Due date is required.");
      return;
    }

	const payload = {
    title: formData.title.trim(),
    description: formData.description.trim(),
    courseId: formData.course_id
      ? Number(formData.course_id)
      : null,
    dueDate: formData.due_date,
    taskType: formData.task_type,
    priority: formData.priority,
    estimatedHours: formData.estimated_hours
      ? Number(formData.estimated_hours)
      : null,
    progress: Number(formData.progress),
    status: formData.status,
  };

    onSubmit(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-3 sm:items-center sm:p-4">
      <div className="my-3 w-full max-w-lg rounded-lg bg-white p-4 shadow-xl sm:my-0 sm:p-6 max-h-[calc(100vh-1.5rem)] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="text-xl font-bold text-gray-900">
            {initialData ? "Edit Task" : "Add New Task"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 font-bold text-lg px-2"
          >
            ✕
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Task Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Task Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Midterm Project Proposal"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none min-h-[44px]"
              required
            />
          </div>

          {/* Course Selection & Task Type */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Course
              </label>
              <select
                name="course_id"
                value={formData.course_id}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none min-h-[44px]"
              >
                <option value="">-- Select Course --</option>
                {courses.map((course) => {
                  const id = course.id;
                  const label = course.courseNumber;
                  return (
                    <option key={id} value={id}>
                      {label}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Type
              </label>
              <select
                name="task_type"
                value={formData.task_type}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none min-h-[44px]"
              >
                <option value="Assignment">Assignment</option>
                <option value="Exam">Exam</option>
                <option value="Project">Project</option>
                <option value="Quiz">Quiz</option>
                <option value="Reading">Reading</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Due Date & Status */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Due Date *
              </label>
              <input
                type="date"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none min-h-[44px]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none min-h-[44px]"
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Priority & Estimated Hours */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none min-h-[44px]"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Estimated Hours
              </label>
              <input
                type="number"
                name="estimated_hours"
                min="0.5"
                step="0.5"
                value={formData.estimated_hours}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none min-h-[44px]"
              />
            </div>
          </div>

          {/* Progress Slider (0% - 100%) */}
          <div>
            <div className="flex justify-between text-sm font-medium text-gray-700">
              <label>Progress</label>
              <span>{formData.progress}%</span>
            </div>
            <input
              type="range"
              name="progress"
              min="0"
              max="100"
              step="5"
              value={formData.progress}
              onChange={handleChange}
              className="mt-2 w-full accent-indigo-600"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description (Optional)
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Add key notes, requirements, or links..."
              className="mt-1 w-full rounded-md border border-gray-300 p-3 text-sm focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col-reverse gap-3 border-t pt-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] w-full rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="min-h-[44px] w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 sm:w-auto"
            >
              {isLoading ? "Saving..." : initialData ? "Update Task" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}