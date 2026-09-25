export function CourseCars({ course, onEdit, onDelete }) {
    const code = course.course_code || course.courseCode || "N/A";
    const name = course.course_name || course.courseName || "Untitled Course";
    const semester = course.semester || "Semester not specified";

    return (
        <div className="flex flex-col justify-between rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
            {/* Top Header + Metadata */}
            <div>
                <div className="flex items-center justify-between">
                    <span className="rounded bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                        {code}
                    </span>
                </div>
                <h3 className="nt-3 text-lg font-boold text-gray-900 line-clamp-2">
                    {name}
                </h3>
            </div>

            {/* Action Buttons */}
            <div className="mt-5 flex items-center justify-end gap-2 border-t pt-3">
                <button
                    type="button"
                    onClick={() => onEdit(course)}
                    className="flex min-h-[44px] items-center rounded-md px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <Edit></Edit>
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
    )
}