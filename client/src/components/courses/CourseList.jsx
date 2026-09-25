import { useState, useEffect } from "react";
import { courseApi } from "../../services/courseApi";
import { CourseCard } from "./CourseCard";
import { CourseFormModal } from "./CourseFormModal";

export function CourseList() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load courses on component mount
  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await courseApi.getCourses();
      // Handle response arrays or nested payload objects (e.g., data.courses)
      setCourses(Array.isArray(data) ? data : data.courses || []);
    } catch (err) {
      setError(err.message || "Could not load courses.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingCourse(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (course) => {
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCourse(null);
  };

  const handleSubmitCourse = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingCourse) {
        // Update existing course
        const id = editingCourse.id || editingCourse.course_id;
        await courseApi.updateCourse(id, formData);
      } else {
        // Create new course
        await courseApi.createCourse(formData);
      }
      handleCloseModal();
      await loadCourses(); // Refresh course list
    } catch (err) {
      alert(err.message || "Failed to save course.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCourse = async (course) => {
    const id = course.id || course.course_id;
    const name = course.course_name || course.courseName || "this course";

    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      await courseApi.deleteCourse(id);
      await loadCourses(); // Refresh course list
    } catch (err) {
      alert(err.message || "Failed to delete course.");
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Courses</h1>
          <p className="text-sm text-gray-600">
            Manage your enrolled courses to organize upcoming tasks and deadlines.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenCreate}
          className="flex min-h-[44px] items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 shadow-sm"
        >
          + Add Course
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mt-6 rounded-md bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="mt-12 text-center text-gray-500">
          Loading your courses...
        </div>
      ) : courses.length === 0 ? (
        /* Empty State */
        <div className="mt-12 rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900">No courses yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by adding your first course for this semester.
          </p>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="mt-4 inline-flex min-h-[44px] items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            + Add Your First Course
          </button>
        </div>
      ) : (
        /* Course Grid */
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course, idx) => (
            <CourseCard
              key={course.id || course.course_id || idx}
              course={course}
              onEdit={handleOpenEdit}
              onDelete={handleDeleteCourse}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Form Modal */}
      <CourseFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitCourse}
        initialData={editingCourse}
        isLoading={isSubmitting}
      />
    </div>
  );
}
