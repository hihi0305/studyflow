export function CourseCard({ course, onEdit, onDelete }) {
  const courseNumber = course.courseNumber || "N/A";

  return (
    <div className="flex flex-col justify-between rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div>
        <div className="flex items-center justify-between">
          <span className="rounded bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
            {courseNumber}
          </span>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-end gap-2 border-t pt-3">
        <button
          type="button"
          onClick={() => onEdit(course)}
          className="flex min-h-[44px] items-center rounded-md px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={() => onDelete(course)}
          className="flex min-h-[44px] items-center rounded-md px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Delete
        </button>
      </div>
    </div>
  );
}