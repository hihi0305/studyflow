import { useState, useEffect } from "react";
import { taskService } from "../../services/taskService";
import { TaskCard } from "./TaskCard";
import { TaskFormModal } from "./TaskFormModal";

export function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

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

  // Safe filter logic to avoid white screen crashes
  const filteredTasks = Array.isArray(tasks)
    ? tasks.filter((task) => {
        if (!task) return false;
        const query = (searchQuery || "").toLowerCase().trim();
        if (!query) return true;
        const taskName = String(task.title || task.name || "");
        return taskName.toLowerCase().includes(query);
      })
    : [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Academic Tasks</h1>
          <p className="text-sm text-gray-600">
            Manage your assignments, exams, projects, and deadlines.
          </p>
        </div>
        <button
          type="button"
          onClick={() => { setEditingTask(null); setIsModalOpen(true); }}
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

      {/* Search Bar Input */}
      {!isLoading && tasks.length > 0 && (
        <div className="mb-6 space-y-1">
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
              placeholder="Search tasks by name..."
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
        </div>
      )}

      {/* Main Task List Display */}
      {isLoading ? (
        <div className="py-12 text-center text-gray-500">
          <p className="text-base font-medium">Loading tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <h3 className="text-lg font-medium text-gray-900">No tasks added yet</h3>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center bg-gray-50">
          <h3 className="text-sm font-medium text-gray-900">No tasks found matching "{searchQuery}"</h3>
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="mt-3 text-xs font-semibold text-indigo-600 hover:text-indigo-800 underline"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id || task.task_id}
              task={task}
              onEdit={(t) => { setEditingTask(t); setIsModalOpen(true); }}
              onDelete={(t) => setTaskToDelete(t)}
            />
          ))}
        </div>
      )}
    </div>
  );
}