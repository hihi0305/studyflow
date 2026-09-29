import { taskService } from "./taskService";
import { courseService } from "./courseService";

export const dashboardService = {
    async getDashboardSummary() {
        const tasks = await taskService.getTasks();
        const courses = await courseService.getCourses();
        
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(
            (t) => t.progress === 100 && t.status !== "Completed"
        ).length;

        const pendingTasks = tasks.filter(
            (t) => t.progress < 100 && t.status !== "Completed"
        );

        const hoursRemaining = pendingTasks.reduce((acc, t) => {
            const remainingRatio = (100 - (t.progress || 0)) / 100;
            return acc + (t.estimated_hours || 0) * remainingRatio;
        }, 0);

        const categorizedTasks = pendingTasks.map((task) => {
            const dueDate = new Date(task.due_date);
            const today = new Date();
            const diffTime = dueDate - today;
            const daysUntilDue = Math.ceil(diffTime / (1000 * 60 *60 * 24));

            let attentionLevel = "Normal";
            if (daysUntilDue <= 3 && task.progress < 50) {
                attentionLevel = "Critical";
            }
            else if (task.priority == "High" && task.progress < 30) {
                attentionLevel = "Critical";
            }

            else if (daysUntilDue <= 7 && task.progress < 75) {
                attentionLevel = "Warning";
            }

            return {
                ...task,
                daysUntilDue,
                attentionLevel,
            };
        });

        const criticalTasks = categorizedTasks.filter(
            (t) => t.attentionLevel == "Critical"
        );

        const warningTasks = categorizedTasks.filter(
            (t) => t.attentionLevel === "Warning"
        );

        return {
            summary: {
                totalTasks,
                completedTasks,
                pendingTasksCount: pendingTasks.length,
                hoursRemaining: Math.round(hoursRemaining * 10) / 10,
                criticalCount: criticalTasks.length,
                warningCount: warningTasks.length,
                totalCourses: courses.length,
            },
            attentionTasks: categorizedTasks.sort((a, b) => {
                const priorityOrder = { Critical: 1, Warning: 2, Normal: 3};
                return (
                    priorityOrder[a.attentionLevel] - priorityOrder[b.attentionLevel] || a.daysUntilDue - b.daysUntilDue
                );
            }),
            courses,
        };
    },
};