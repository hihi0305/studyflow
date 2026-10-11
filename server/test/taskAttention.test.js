const test = require("node:test");
const assert = require("node:assert/strict");

const {
  calculateTaskAttention,
} = require("../src/utils/taskAttention");

const referenceDate = new Date("2026-10-10T12:00:00");

test("returns High attention for an urgent high-priority task", () => {
  const task = {
    dueDate: "2026-10-11T12:00:00",
    priority: "High",
    progress: 0,
    estimatedHours: 4,
    status: "In Progress",
  };

  const result = calculateTaskAttention(task, referenceDate);

  assert.deepEqual(result, {
    attentionLevel: "High",
    attentionScore: 11,
  });
});

test("returns Medium attention for a moderately urgent task", () => {
  const task = {
    dueDate: "2026-10-15T12:00:00",
    priority: "Medium",
    progress: 40,
    estimatedHours: 2,
    status: "In Progress",
  };

  const result = calculateTaskAttention(task, referenceDate);

  assert.deepEqual(result, {
    attentionLevel: "Medium",
    attentionScore: 6,
  });
});

test("returns Low attention for a low-priority task with substantial progress", () => {
  const task = {
    dueDate: "2026-10-20T12:00:00",
    priority: "Low",
    progress: 80,
    estimatedHours: 2,
    status: "In Progress",
  };

  const result = calculateTaskAttention(task, referenceDate);

  assert.deepEqual(result, {
    attentionLevel: "Low",
    attentionScore: 2,
  });
});

test("returns null for a completed task", () => {
  const task = {
    dueDate: "2026-10-11T12:00:00",
    priority: "High",
    progress: 100,
    estimatedHours: 8,
    status: "Completed",
  };

  const result = calculateTaskAttention(task, referenceDate);

  assert.equal(result, null);
});

test("treats an overdue active task as highly urgent", () => {
  const task = {
    dueDate: "2026-10-08T12:00:00",
    priority: "High",
    progress: 10,
    estimatedHours: 6,
    status: "In Progress",
  };

  const result = calculateTaskAttention(task, referenceDate);

  assert.deepEqual(result, {
    attentionLevel: "High",
    attentionScore: 12,
  });
});

test("handles lowercase priority values", () => {
  const task = {
    dueDate: "2026-10-20T12:00:00",
    priority: "medium",
    progress: 80,
    estimatedHours: 2,
    status: "In Progress",
  };

  const result = calculateTaskAttention(task, referenceDate);

  assert.deepEqual(result, {
    attentionLevel: "Low",
    attentionScore: 3,
  });
});

test("handles missing optional priority and estimated hours", () => {
  const task = {
    dueDate: "2026-10-20T12:00:00",
    priority: null,
    progress: 80,
    estimatedHours: null,
    status: "In Progress",
  };

  const result = calculateTaskAttention(task, referenceDate);

  assert.deepEqual(result, {
    attentionLevel: "Low",
    attentionScore: 1,
  });
});

test("returns null when no task is provided", () => {
  const result = calculateTaskAttention(null, referenceDate);

  assert.equal(result, null);
});
