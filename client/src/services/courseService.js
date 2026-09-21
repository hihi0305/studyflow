const API_BASE_URL = '/api/courses';

const getHeaders = (token) => ({
    'Content-Type' : 'application/json',
    ...(token && {Authorization : `Bearer ${token}`}),
});

export const courseService = {
    async getCourses(token) {
        const res = await fetch(API_BASE_URL, {headers: getHeaders(token)});
        const data = await res.json();
        if (!res.ok) throw new Error(data.error?.message || 'Falied to fetch courses');
        return data.courses || data;
    },

    async createCourse(courseData, token) {
        const res = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: getHeaders(token),
            body: JSON.stringify(courseData),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error?.message || 'Failed to create course')
        return data;
    },

    async updateCourse(id, courseData, token) {
        const res = await fetch(`API_BASE_URL/${id}`, {
            method: 'PUT',
            headers: getHeaders(token),
            body: JSON.stringify(courseData),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error?.message || 'Failed to update course')
        return data;
    },

    async deleteCourse(id, token) {
        const res = await fetch(`API_BASE_URL/${id}`, {
            method: 'DELETE',
            headers: getHeaders(token),
        });
        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.error?.message || 'Failed to delete course');
        }
        return true;
    },
    
}