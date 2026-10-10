function calculateTaskAttention(task) {
  if (!task || task.status === "Completed") {
    return null;
  }

  let score = 0;

  // Due-date score
  const dueDate = new Date(task.dueDate);

  if (!Number.isNaN(dueDate.getTime())) {
    const now = new Date();

    // Compare calendar days rather than exact hours.
    const today = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    const due = new Date(
      dueDate.getFullYear(),
      dueDate.getMonth(),
      dueDate.getDate()
    );

    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const daysUntilDue = Math.ceil(
      (due - today) / millisecondsPerDay
    );

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

  // User-defined priority score
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

  // Progress score
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

  // Estimated-hours score
  const estimatedHours = Number(task.estimatedHours);

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

module.exports = {
  calculateTaskAttention,
};
