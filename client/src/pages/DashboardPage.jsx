import { useState, useEffect } from 'react';
import { dashboardService } from '../services/dashboardService';

export function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await dashboardService.getDashboardSummary();
        setSummary(data);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard summary');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm font-medium text-gray-500">Loading academic dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-md bg-red-50 p-4 border border-red-200">
          <p className="text-sm font-medium text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  const totalTasks = summary?.summary?.totalTasks ?? 0;
  const activeTasks = summary?.summary?.activeTasks ?? 0;
  const completedTasks = summary?.summary?.completedTasks ?? 0;
  const tasks = summary?.tasks ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Academic Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your enrolled courses and upcoming task deadlines.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="overflow-hidden rounded-lg bg-white p-6 shadow-sm border border-gray-200">
          <dt className="truncate text-sm font-medium text-gray-500">Active Tasks</dt>
          <dd className="mt-2 text-3xl font-bold tracking-tight text-indigo-600">
            {activeTasks}
          </dd>
        </div>

        <div className="overflow-hidden rounded-lg bg-white p-6 shadow-sm border border-gray-200">
          <dt className="truncate text-sm font-medium text-gray-500">Total Tasks</dt>
          <dd className="mt-2 text-3xl font-bold tracking-tight text-indigo-600">
            {totalTasks}
          </dd>
        </div>

        <div className="overflow-hidden rounded-lg bg-white p-6 shadow-sm border border-gray-200">
          <dt className="truncate text-sm font-medium text-gray-500">Completed Tasks</dt>
          <dd className="mt-2 text-3xl font-bold tracking-tight text-green-600">
            {completedTasks}
          </dd>
        </div>
      </div>

      <div className="rounded-lg bg-white shadow-sm border border-gray-200">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Your Tasks</h2>
        </div>

        <div className="p-6">
          {tasks.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {tasks.map((task) => (
                <li key={task.id || task._id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{task.title}</p>
                    {task.dueDate && (
                      <p className="text-xs text-gray-500">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      task.status === "Completed"
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {task.status}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No upcoming tasks found.</p>
          )}
        </div>
      </div>
    </div>
  );
}