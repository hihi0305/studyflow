import { useState, useEffect } from "react";
import { taskService } from "../../services/taskService";
import { TaskCard } from "./TaskCard";
import { TaskFormModal } from "./TaskFormModal";
import { calculateTaskAttention } from "../../utils/taskAttention";

export function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourseNumber, setSelectedCourseNumber] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [selectedAttentionLevel, setSelectedAttentionLevel] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await taskService.getTasks();
      const list = Array.isArray(data) ? data : data?.tasks || [];
      setTasks(list);
    } catch (err) {
      setError(err.message || "Failed to load tasks.");
    } finally {
      setIsLoading(false);
    }
  };

  // Dynamically extract unique course numbers from loaded tasks (excluding empty/null)
  const availableCourseNumbers = Array.from(
    new Set(
      (Array.isArray(tasks) ? tasks : [])
        .map((t) => t.courseNumber || t.course_number || t.course_code || t.course?.courseNumber || t.course)
        .filter(Boolean)
    )
  );

  // Check if any tasks exist without an associated course
  const hasTasksWithoutCourse = (Array.isArray(tasks) ? tasks : []).some((t) => {
    const rawCourse = t.courseNumber || t.course_number || t.course_code || t.course?.courseNumber || t.course;
    return !rawCourse;
  });

  // Multi-criteria defensive filtering
  const filteredTasks = Array.isArray(tasks)
    ? tasks.filter((task) => {
        if (!task) return false;

        // 1. Search Query (Title, Description, Course Number, Task Type, User Priority)
        const query = (searchQuery || "").toLowerCase().trim();
        const title = String(task.title || task.name || "").toLowerCase();
        const description = String(task.description || "").toLowerCase();
        const courseNumber = String(
          task.courseNumber || task.course_number || task.course_code || task.course || ""
        ).toLowerCase();
        const taskType = String(task.task_type || task.taskType || "").toLowerCase();
        const priority = String(task.priority || "").toLowerCase();

        const matchesSearch =
          !query ||
          title.includes(query) ||
          description.includes(query) ||
          courseNumber.includes(query) ||
          taskType.includes(query) ||
          priority.includes(query);

        // 2. Course Number Filter (Supports "No Course")
        const rawTaskCourse =
          task.courseNumber || task.course_number || task.course_code || task.course?.courseNumber || task.course || "";
        
        let matchesCourseNumber = true;
        if (selectedCourseNumber === "NO_COURSE") {
          matchesCourseNumber = !rawTaskCourse; // Matches tasks where course is missing or empty
        } else if (selectedCourseNumber) {
          matchesCourseNumber = rawTaskCourse === selectedCourseNumber;
        }

        // 3. Status Filter
        const matchesStatus = !selectedStatus || task.status === selectedStatus;

        // 4. User Priority Filter (User-defined)
        const matchesPriority =
          !selectedPriority || task.priority === selectedPriority;

        // 5. Task Attention Level Filter (Dynamically calculated via taskAttention.js)
        const attentionResult = calculateTaskAttention(task);
        const calculatedAttentionLevel = attentionResult?.attentionLevel || "";
        const matchesAttention =
          !selectedAttentionLevel || calculatedAttentionLevel === selectedAttentionLevel;

        return (
          matchesSearch &&
          matchesCourseNumber &&
          matchesStatus &&
          matchesPriority &&
          matchesAttention
        );
      })
    : [];

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCourseNumber("");
    setSelectedStatus("");
    setSelectedPriority("");
    setSelectedAttentionLevel("");
  };

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedCourseNumber !== "" ||
    selectedStatus !== "" ||
    selectedPriority !== "" ||
    selectedAttentionLevel !== "";

  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleSubmitTask = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingTask) {
        const id = editingTask.id || editingTask.task_id;
        await taskService.updateTask(id, formData);
      } else {
        await taskService.createTask(formData);
      }
      await fetchTasks();
      handleCloseModal();
    } catch (err) {
      alert(err.message || "Failed to save task.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTask = (task) => {
    setTaskToDelete(task);
  };

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;

    const id = taskToDelete.id || taskToDelete.task_id;

    try {
      await taskService.deleteTask(id);
      setTaskToDelete(null);
      await fetchTasks();
    } catch (err) {
      alert(err.message || "Failed to delete task.");
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Academic Tasks</h1>
          <p className="text-sm text-gray-600">
            Manage your assignments, exams, projects, and deadlines.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 min-h-[44px]"
        >
          + Add Task
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {/* Search & Filter Toolbar */}
      {!isLoading && tasks.length > 0 && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
          {/* Top Row: Search Bar Input */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks by name, course number, type, or description..."
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 text-sm font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Bottom Row: 4 Filter Dropdowns Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {/* Filter 1: Course Number (with "No Course" option) */}
            <div>
              <label htmlFor="filter-course-number" className="block text-xs font-semibold text-gray-600 mb-1">
                Course Number
              </label>
              <select
                id="filter-course-number"
                value={selectedCourseNumber}
                onChange={(e) => setSelectedCourseNumber(e.target.value)}
                className="w-full py-1.5 px-2 border border-gray-300 rounded-md text-xs bg-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Course Numbers</option>
                {hasTasksWithoutCourse && (
                  <option value="NO_COURSE">No Course</option>
                )}
                {availableCourseNumbers.map((cNum) => (
                  <option key={cNum} value={cNum}>
                    {cNum}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter 2: Status */}
            <div>
              <label htmlFor="filter-status" className="block text-xs font-semibold text-gray-600 mb-1">
                Status
              </label>
              <select
                id="filter-status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full py-1.5 px-2 border border-gray-300 rounded-md text-xs bg-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Statuses</option>
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {/* Filter 3: User Priority (Explicit Label) */}
            <div>
              <label htmlFor="filter-user-priority" className="block text-xs font-semibold text-gray-600 mb-1">
                User Priority
              </label>
              <select
                id="filter-user-priority"
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="w-full py-1.5 px-2 border border-gray-300 rounded-md text-xs bg-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All User Priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {/* Filter 4: Task Attention Level (Explicit Label & Dynamic Calculation) */}
            <div>
              <label htmlFor="filter-task-attention-level" className="block text-xs font-semibold text-gray-600 mb-1">
                Task Attention Level
              </label>
              <select
                id="filter-task-attention-level"
                value={selectedAttentionLevel}
                onChange={(e) => setSelectedAttentionLevel(e.target.value)}
                className="w-full py-1.5 px-2 border border-gray-300 rounded-md text-xs bg-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Task Attention Levels</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          {/* Active Filter Summary & Reset Button */}
          {hasActiveFilters && (
            <div className="flex items-center justify-between pt-2 border-t border-gray-200 text-xs">
              <span className="text-gray-500">
                Showing <strong className="text-gray-800">{filteredTasks.length}</strong> of{" "}
                <strong className="text-gray-800">{tasks.length}</strong> tasks
              </span>
              <button
                type="button"
                onClick={handleResetFilters}
                className="font-semibold text-indigo-600 hover:text-indigo-800 underline"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Main Content Area */}
      {isLoading ? (
        <div className="py-12 text-center text-gray-500">
          <p className="text-base font-medium">Loading tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <h3 className="text-lg font-medium text-gray-900">No tasks added yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating your first assignment or exam.
          </p>
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 min-h-[44px]"
          >
            + Add Task
          </button>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center bg-gray-50">
          <h3 className="text-sm font-medium text-gray-900">No tasks match your active search or filters</h3>
          <p className="mt-1 text-xs text-gray-500">Try adjusting your search keywords or clearing filter dropdowns.</p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="mt-3 text-xs font-semibold text-indigo-600 hover:text-indigo-800 underline"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id || task.task_id}
              task={task}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Task Modal */}
      <TaskFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitTask}
        initialData={editingTask}
        isLoading={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      {taskToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="border-b pb-3">
              <h2 className="text-xl font-bold text-gray-900">Delete Task</h2>
            </div>
            <p className="mt-4 text-sm text-gray-700">
              Are you sure you want to delete <strong>{taskToDelete.title}</strong>?
            </p>
            <div className="mt-6 flex justify-end gap-3 border-t pt-4">
              <button
                type="button"
                onClick={() => setTaskToDelete(null)}
                className="min-h-[44px] w-full sm:w-auto rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteTask}
                className="min-h-[44px] rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Delete Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}