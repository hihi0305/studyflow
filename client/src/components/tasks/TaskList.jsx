import { useState, useEffect } from "react";
import { taskService } from "../../services/taskService";
import { TaskCard } from "./TaskCard";
import { TaskFormModal } from "./TaskFormModal";

export function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Fetch tasks when component mounts
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await taskService.getTasks();
      const list = Array.isArray(data) ? data : data.tasks || [];
      setTasks(list);
    } catch (err) {
      setError(err.message || "Failed to load tasks.");
    } finally {
      setIsLoading(false);
    }
  };

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

      {/* Loading State */}
      {isLoading ? (
        <div className="py-12 text-center text-gray-500">
          <p className="text-base font-medium">Loading tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        /* Empty State */
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
      ) : (
        /* Task Cards Grid */
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
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
			  <h2 className="text-xl font-bold text-gray-900">
				Delete Task
			  </h2>
			</div>

			<p className="mt-4 text-sm text-gray-700">
			  Are you sure you want to delete{" "}
			  <strong>{taskToDelete.title}</strong>?
			</p>

			<div className="mt-6 flex justify-end gap-3 border-t pt-4">
			  <button
				type="button"
				onClick={() => setTaskToDelete(null)}
				className="min-h-[44px] rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
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
