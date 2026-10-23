import { calculateTaskAttention } from "../../utils/taskAttention";

// Border styling: High TAL (red), Medium TAL (yellow/amber), Low TAL (blue), Completed (green)
const getAttentionBorderClass = (task) => {
  if (task.status === "Completed") {
    return "border-2 border-emerald-500";
  }

  const attention = calculateTaskAttention(task);
  const level = attention?.attentionLevel?.toLowerCase();

  switch (level) {
    case "high":
      return "border-2 border-red-500";
    case "medium":
      return "border-2 border-amber-400";
    case "low":
      return "border-2 border-blue-400";
    default:
      return "border-2 border-emerald-500";
  }
};

// Task Attention badge color helper
const getAttentionBadgeClass = (level, isCompleted) => {
  if (isCompleted) {
    return "bg-emerald-100 text-emerald-800 border-emerald-300";
  }
  switch (level?.toLowerCase()) {
    case "high":
      return "bg-red-100 text-red-800 border-red-300";
    case "medium":
      return "bg-amber-100 text-amber-800 border-amber-300";
    case "low":
      return "bg-blue-100 text-blue-800 border-blue-300";
    default:
      return "bg-gray-100 text-gray-700 border-gray-300";
  }
};

// User Priority badge color helper
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

export function TaskCard({ task, onEdit, onDelete }) {
  const {
    id,
    title,
    description,
    course,
    courseNumber,
    due_date,
    dueDate,
    task_type,
    taskType,
    priority = "Medium",
    estimated_hours,
    estimatedHours,
    progress = 0,
    status = "Not Started",
  } = task;

  const displayCourseNumber = courseNumber || course?.courseNumber || "";
  const displayDueDate = due_date || dueDate;
  const displayTaskType = task_type || taskType || "Assignment";
  const displayHours = estimated_hours || estimatedHours;

  const isCompleted = status === "Completed";
  const attention = calculateTaskAttention(task);
  const attentionLevel = isCompleted
    ? "Completed"
    : attention?.attentionLevel || "Low";

  const borderClass = getAttentionBorderClass(task);

  const formatDate = (dateStr) => {
    if (!dateStr) return "No due date";
    const date = new Date(dateStr);
    return isNaN(date.getTime())
      ? dateStr
      : date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
  };

  const getStatusBadge = (s) => {
    switch (s?.toLowerCase()) {
      case "completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "in progress":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "not started":
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div
      className={`flex flex-col justify-between rounded-lg bg-white p-5 shadow-sm transition-all hover:shadow-md ${borderClass}`}
    >
      <div>
        {/* Top Header: Title & Badges */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <span className="inline-block rounded px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 mb-1">
              {displayTaskType}
            </span>
            <h3 className="line-clamp-2 text-lg font-bold leading-snug text-gray-900">
              {title}
            </h3>
          </div>

          {/* Badges displayed for every card (Dashboard & Tasks page) */}
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <span
              className={`whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getUserPriorityBadgeClass(
                priority
              )}`}
            >
              User Priority: {priority}
            </span>
            <span
              className={`whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getAttentionBadgeClass(
                attentionLevel,
                isCompleted
              )}`}
            >
              Task Attention: {attentionLevel}
            </span>
          </div>
        </div>

        {/* Course & Metadata Info */}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600">
          {displayCourseNumber && (
            <span className="font-semibold text-gray-800">
              📖 {displayCourseNumber}
            </span>
          )}
          <span>📅 Due: {formatDate(displayDueDate)}</span>
          {displayHours && <span>⏱️ {displayHours} hrs</span>}
        </div>

        {/* Optional Description */}
        {description && (
          <p className="mt-3 text-sm text-gray-600 line-clamp-2">{description}</p>
        )}

        {/* Progress Bar & Status */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs font-medium text-gray-700 mb-1">
            <span
              className={`rounded px-2 py-0.5 text-xs border ${getStatusBadge(
                status
              )}`}
            >
              {status}
            </span>
            <span>{progress}% Completed</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className={`h-full transition-all duration-300 ${
                isCompleted || progress === 100
                  ? "bg-emerald-500"
                  : "bg-indigo-600"
              }`}
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer Action Buttons */}
      {(onEdit || onDelete) && (
        <div className="mt-5 flex items-center justify-end gap-2 border-t border-gray-100 pt-3">
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(task)}
              className="rounded-md px-3 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 min-h-[44px]"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(task)}
              className="rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 min-h-[44px]"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}