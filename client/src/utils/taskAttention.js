export function calculateTaskAttention(task, referenceDate = new Date()) {
    if (!task || task.status === "Completed") {
      return null;
    }
  
    let score = 0;
  
    // 1. Due-date score
    const rawDate = task.dueDate || task.due_date;
    const dueDate = new Date(rawDate);
  
    if (!Number.isNaN(dueDate.getTime())) {
      const now = referenceDate;
  
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const due = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
  
      const millisecondsPerDay = 1000 * 60 * 60 * 24;
      const daysUntilDue = Math.ceil((due - today) / millisecondsPerDay);
  
      if (daysUntilDue <= 1) {
        score += 4;
      } else if (daysUntilDue <= 3) {
        score += 3;
      } else if (daysUntilDue <= 7) {
        score += 2;
      } else {
        score += 1;
      }
    }
  
    // 2. User-defined priority score
    switch (task.priority?.toLowerCase()) {
      case "high":
        score += 3;
        break;
      case "medium":
        score += 2;
        break;
      case "low":
        score += 1;
        break;
      default:
        break;
    }
  
    // 3. Progress score
    const progress = Number(task.progress);
    if (!Number.isNaN(progress)) {
      if (progress <= 25) {
        score += 3;
      } else if (progress <= 50) {
        score += 2;
      } else if (progress <= 75) {
        score += 1;
      }
    }
  
    // 4. Estimated-hours score
    const rawHours = task.estimatedHours ?? task.estimated_hours;
    const estimatedHours = Number(rawHours);
    if (!Number.isNaN(estimatedHours)) {
      if (estimatedHours >= 6) {
        score += 2;
      } else if (estimatedHours >= 3) {
        score += 1;
      }
    }
  
    let attentionLevel;
    if (score >= 9) {
      attentionLevel = "High";
    } else if (score >= 5) {
      attentionLevel = "Medium";
    } else {
      attentionLevel = "Low";
    }
  
    return {
      attentionLevel,
      attentionScore: score,
    };
  }
  
  // Color Styling Map: High=Red, Medium=Yellow, Low=Blue
  export function getAttentionStyles(attentionLevel) {
    switch (attentionLevel) {
      case "High":
        return {
          badgeClass: "bg-red-100 text-red-800 border-red-300",
          borderClass: "border-l-4 border-l-red-500",
          dotClass: "bg-red-500",
          label: "High Attention",
        };
      case "Medium":
        return {
          badgeClass: "bg-yellow-100 text-yellow-800 border-yellow-300",
          borderClass: "border-l-4 border-l-yellow-500",
          dotClass: "bg-yellow-500",
          label: "Medium Attention",
        };
      case "Low":
        return {
          badgeClass: "bg-blue-100 text-blue-800 border-blue-300",
          borderClass: "border-l-4 border-l-blue-500",
          dotClass: "bg-blue-500",
          label: "Low Attention",
        };
      default:
        return {
          badgeClass: "bg-gray-100 text-gray-600 border-gray-200",
          borderClass: "border-l-4 border-l-gray-300",
          dotClass: "bg-gray-400",
          label: "Completed",
        };
    }
  }