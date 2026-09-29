import { useState, useEffect } from "react";
import { dashboardService } from "../services/dashboardService";

export function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const summaryData = await dashboardService.getDashboardSummary();
        setData(summaryData);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-gray-500 font-medium">Loading dashboard overview...</div>
      </div>
    );
  }

  const { summary, attentionTasks } = data || {};

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Academic Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of workload, upcoming deadlines, and Task Attention Levels.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Active Tasks
          </div>
          <div className="mt-2 text-3xl font-bold text-gray-900">{summary?.pendingTasksCount || 0}</div>
          <p className="mt-1 text-xs text-gray-500">Out of {summary?.totalTasks || 0} total tasks</p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Workload Remaining
          </div>
          <div className="mt-2 text-3xl font-bold text-indigo-600">
            {summary?.hoursRemaining || 0} <span className="text-lg font-normal text-gray-600">hrs</span>
          </div>
          <p className="mt-1 text-xs text-gray-500">Estimated effort needed</p>
        </div>

        <div className="rounded-lg border border-red-200 bg-red-50/50 p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-red-700">
            Critical Attention
          </div>
          <div className="mt-2 text-3xl font-bold text-red-600">{summary?.criticalCount || 0}</div>
          <p className="mt-1 text-xs text-red-600">High priority or urgent tasks</p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Completed
          </div>
          <div className="mt-2 text-3xl font-bold text-green-600">{summary?.completedTasks || 0}</div>
          <p className="mt-1 text-xs text-gray-500">Finished assignments</p>
        </div>
      </div>

      {/* Attention Levels Table */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-bold text-gray-900">Task Attention Levels</h2>
          <p className="text-xs text-gray-500">
            Tasks prioritized dynamically by remaining effort and due dates.
          </p>
        </div>

        <div className="divide-y divide-gray-200">
          {attentionTasks && attentionTasks.length > 0 ? (
            attentionTasks.map((task) => (
              <div
                key={task.id}
                className="flex flex-col gap-4 p-6 transition-colors hover:bg-gray-50/50 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block rounded px-2 py-0.5 text-xs font-bold ${
                        task.attentionLevel === "Critical"
                          ? "border border-red-200 bg-red-100 text-red-800"
                          : task.attentionLevel === "Warning"
                          ? "border border-amber-200 bg-amber-100 text-amber-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {task.attentionLevel}
                    </span>
                    <span className="text-xs font-medium text-gray-500">
                      {task.course?.course_code || "General"}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">{task.title}</h3>
                  <p className="text-xs text-gray-500">
                    Due in {task.daysUntilDue > 0 ? `${task.daysUntilDue} days` : "Today"} ({task.due_date})
                  </p>
                </div>

                <div className="w-full space-y-1.5 sm:w-64">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Progress</span>
                    <span className="font-medium">{task.progress}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100">
                    <div
                      className={`h-2 rounded-full ${
                        task.attentionLevel === "Critical"
                          ? "bg-red-500"
                          : task.attentionLevel === "Warning"
                          ? "bg-amber-500"
                          : "bg-indigo-600"
                      }`}
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                  <div className="text-right text-xs text-gray-400">
                    Est. {task.estimated_hours} hrs total
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-sm text-gray-500">
              No active tasks found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}