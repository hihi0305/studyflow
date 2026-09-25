import { useState, useEffect } from "react";

export function CourseFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isLoading = false,
}) {
  const [courseCode, setCourseCode] = useState("");
  const [courseName, setCourseName] = useState("");
  const [semester, setSemester] = useState("");
  const [error, setError] = useState("");

  // Synchronize state when editing an existing course or opening/closing
  useEffect(() => {
    if (initialData) {
      setCourseCode(initialData.course_code || initialData.courseCode || "");
      setCourseName(initialData.course_name || initialData.courseName || "");
      setSemester(initialData.semester || "");
    } else {
      setCourseCode("");
      setCourseName("");
      setSemester("");
    }
    setError("");
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!courseCode.trim() || !courseName.trim() || !semester.trim()) {
      setError("Please complete all required fields.");
      return;
    }

    onSubmit({
      course_code: courseCode.trim(),
      course_name: courseName.trim(),
      semester: semester.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="text-xl font-bold text-gray-900">
            {initialData ? "Edit Course" : "Add New Course"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center text-gray-400 hover:text-gray-600 text-lg font-bold"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        {/* Validation Error Alert */}
        {error && (
          <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Course Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. CS 415"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              className="mt-1 min-h-[44px] w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Course Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Software Design and Development"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              className="mt-1 min-h-[44px] w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Semester <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Fall 2026"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="mt-1 min-h-[44px] w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="min-h-[44px] rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {isLoading ? "Saving..." : initialData ? "Save Changes" : "Create Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
