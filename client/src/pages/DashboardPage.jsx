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
    return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Academic Dashboard</h1>

      {/* Key MVP Metric Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
          <p className="text-sm font-medium text-gray-500">Enrolled Courses</p>
          <p className="mt-2 text-3xl font-bold text-indigo-600">
            {summary?.courseCount ?? summary?.courses?.length ?? 0}
          </p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
          <p className="text-sm font-medium text-gray-500">Total Tasks</p>
          <p className="mt-2 text-3xl font-bold text-indigo-600">
            {summary?.taskCount ?? summary?.tasks?.length ?? 0}
          </p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
          <p className="text-sm font-medium text-gray-500">Completed Tasks</p>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {summary?.completedTaskCount ?? 0}
          </p>
        </div>
      </div>

      {/* Simple Upcoming Tasks List */}
      <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Tasks</h2>
        {summary?.upcomingTasks && summary.upcomingTasks.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {summary.upcomingTasks.map((task) => (
              <li key={task.id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-800">{task.title}</p>
                  {task.dueDate && (
                    <p className="text-xs text-gray-500">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-md ${
                    task.completed
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {task.completed ? 'Completed' : 'Pending'}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No upcoming tasks found.</p>
        )}
      </div>
    </div>
  );
}
