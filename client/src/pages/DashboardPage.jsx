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
            <ul className="space-y-3">
              {tasks.map((task) => {
                const courseName = task.course?.name || task.courseName || 'General';
                const progressVal = task.progress ?? (task.status === 'Completed' ? 100 : 0)
                const getPriorityCardClass = (priority) => {
                  switch (priority?.toLowerCase()) {
                    case 'high':
                      return 'bg-red-50/80 border-red-200 hover:bg-red-50';
                    case 'medium':
                      return 'bg-amber-50/80 border-amber-200 hover:bg-amber-50';
                    case 'low':
                      return 'bg-blue-50/80 border-blue-200 hover:bg-blue-50';
                    default:
                      return 'bg-gray-50/80 border-gray-200 hover:bg-gray-50';
                  }
                };
                return (
                  <li 
                    key={task.id || task._id} 
                    className={`flex flex-col gap-3 p-4 rounded-lg border transition-colors sm:flex-row sm:items-center sm:justify-between ${getPriorityCardClass(task.priority)}`}
                  >
                    <div className="min-w-0 flex flex-col items-start gap-2">
                      <span className='inline-flex items-center rounded bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700 border border-indigo-100'>
                          {courseName}
                      </span>
                      <p className="text-sm font-medium text-gray-900">{task.title}</p>
                      {task.dueDate && (
                        <p className="text-xs text-gray-500">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className='flex flex-col items-start sm:items-end text-left sm:text-right gap-2 shrink-0'>
                      <span
                        className={`inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          task.status === "Completed"
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {task.status}
                      </span>

                      <p className="text-xs text-gray-500">
                        Progress: <span className="font-medium text-gray-700">{progressVal}%</span>
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No upcoming tasks found.</p>
          )}
        </div>
      </div>
    </div>
  );
}