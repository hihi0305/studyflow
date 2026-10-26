import { useState, useEffect } from 'react';
import { dashboardService } from '../services/dashboardService';
import { calculateTaskAttention } from '../utils/taskAttention';

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

  // Sort weight: High TAL (4) -> Medium TAL (3) -> Low TAL (2) -> Completed (1)
  const getAttentionSortRank = (task) => {
    if (task.status === 'Completed') return 1;
    const attention = calculateTaskAttention(task);
    switch (attention?.attentionLevel) {
      case 'High':
        return 4;
      case 'Medium':
        return 3;
      case 'Low':
        return 2;
      default:
        return 0;
    }
  };

  // Border coloring helper based on teammate feedback
  const getAttentionBorderClass = (task) => {
    if (task.status === 'Completed') {
      return 'border-2 border-emerald-500';
    }
    const attention = calculateTaskAttention(task);
    switch (attention?.attentionLevel?.toLowerCase()) {
      case 'high':
        return 'border-2 border-red-500';
      case 'medium':
        return 'border-2 border-amber-400';
      case 'low':
        return 'border-2 border-blue-400';
      default:
        return 'border-2 border-gray-200';
    }
  };

  const getAttentionBadgeClass = (level, isCompleted) => {
    if (isCompleted) {
      return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
    switch (level?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'medium':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getUserPriorityBadgeClass = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-50 text-red-700 border-red-200";
      case "low":
        return "bg-green-50 text-green-700 border-green-200";
      case "medium":
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

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
  const rawTasks = summary?.tasks ?? [];

  const sortedTasks = [...rawTasks].sort(
    (a, b) => getAttentionSortRank(b) - getAttentionSortRank(a)
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Academic Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your enrolled courses and upcoming task deadlines.
        </p>
      </div>

      {/* Summary Stat Cards */}
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

      {/* Your Tasks Section */}
      <div className="rounded-lg bg-white shadow-sm border border-gray-200">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Your Tasks</h2>
        </div>

        <div className="p-6">
          {sortedTasks.length > 0 ? (
            <ul className="space-y-3">
              {sortedTasks.map((task) => {
                const courseNumber = task.courseNumber || 'No Course';
                const progressVal = task.progress ?? (task.status === 'Completed' ? 100 : 0);
                const isCompleted = task.status === 'Completed';
                const attention = calculateTaskAttention(task);
                const attentionLevel = isCompleted
                  ? 'Completed'
                  : attention?.attentionLevel || 'Low';

                const borderClass = getAttentionBorderClass(task);

                return (
                  <li
                    key={task.id || task._id}
                    className={`flex flex-col gap-3 p-4 rounded-lg bg-white shadow-sm transition-all sm:flex-row sm:items-center sm:justify-between ${borderClass}`}
                  >
                    {/* Left: Course & Title & Due Date */}
                    <div className="min-w-0 flex flex-col items-start gap-1.5">
                      <span className="inline-flex items-center rounded bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 border border-indigo-100">
                        {courseNumber}
                      </span>
                      <p className="text-base font-semibold text-gray-900">{task.title}</p>
                      {task.dueDate && (
                        <p className="text-xs text-gray-500">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    {/* Middle: Badges */}
                    <div className="flex flex-wrap sm:flex-col items-start sm:items-center gap-1.5 shrink-0">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getUserPriorityBadgeClass(
                          task.priority
                        )}`}
                      >
                        User Priority: {task.priority || 'Medium'}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getAttentionBadgeClass(
                          attentionLevel,
                          isCompleted
                        )}`}
                      >
                        Task Attention: {attentionLevel}
                      </span>
                    </div>

                    {/* Right: Status, Progress % & Visual Progress Bar */}
                    <div className="flex flex-col items-start sm:items-end text-left sm:text-right gap-1.5 shrink-0 min-w-[130px]">
                      <span
                        className={`inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          isCompleted
                            ? 'bg-green-100 text-green-800 border border-green-200'
                            : 'bg-gray-100 text-gray-700 border border-gray-200'
                        }`}
                      >
                        {task.status}
                      </span>

                      <p className="text-xs text-gray-500">
                        Progress: <span className="font-semibold text-gray-800">{progressVal}%</span>
                      </p>

                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 border border-gray-200/60 mt-0.5">
                        <div
                          className={`h-full transition-all duration-300 ${
                            isCompleted || progressVal === 100 ? 'bg-emerald-500' : 'bg-indigo-600'
                          }`}
                          style={{ width: `${Math.min(100, Math.max(0, progressVal))}%` }}
                        />
                      </div>
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