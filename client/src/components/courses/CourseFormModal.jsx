import { useEffect, useState } from "react";

export function CourseFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isLoading = false,
}) {
  const [courseNumber, setCourseNumber] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      setCourseNumber(initialData.courseNumber || "");
    } else {
      setCourseNumber("");
    }

    setError("");
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const value = courseNumber.trim();

    if (!value) {
      setError("Course number is required.");
      return;
    }

    onSubmit({
      courseNumber: value,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="text-xl font-bold text-gray-900">
            {initialData ? "Edit Course" : "Add New Course"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center text-lg font-bold text-gray-400 hover:text-gray-600"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Course Number <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              placeholder="e.g. CS 415"
              value={courseNumber}
              onChange={(e) => {
                setCourseNumber(e.target.value);
                if (error) setError("");
              }}
              className="mt-1 min-h-[44px] w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-3 border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="min-h-[44px] rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="min-h-[44px] rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {isLoading
                ? "Saving..."
                : initialData
                ? "Save Changes"
                : "Create Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}