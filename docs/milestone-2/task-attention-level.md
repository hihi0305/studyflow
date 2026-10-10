# Task Attention Level Calculation

## Purpose

Task Attention Level (TAL) helps StudyFlow users identify which active academic tasks require greater attention.

TAL is implemented as a deterministic rule-based score using existing task data. The calculation uses due date, user-defined priority, progress, estimated work hours, and task status.

Completed tasks are excluded from active Task Attention Level calculation.

## Factors and Scores

### Due Date

- Overdue or due within 1 day: +4
- Due within 3 days: +3
- Due within 7 days: +2
- Due more than 7 days away: +1

### User-Defined Priority

- High: +3
- Medium: +2
- Low: +1

### Progress

- 0–25%: +3
- 26–50%: +2
- 51–75%: +1
- 76–99%: +0

### Estimated Work Hours

- 6 or more hours: +2
- 3–5.99 hours: +1
- Less than 3 hours: +0

## Attention Level Thresholds

- High Attention: 9 or more points
- Medium Attention: 5–8 points
- Low Attention: 0–4 points

## Completed Tasks

If a task has the status `Completed`, the Task Attention Level is not calculated.

The API returns:

- `attentionLevel: null`
- `attentionScore: null`

for completed tasks.

## Implementation

The calculation is implemented in:

`server/src/utils/taskAttention.js`

The utility is used by the Task API so that Task Attention Level is returned as a derived value rather than stored in the database.

The API response includes:

- `attentionLevel`
- `attentionScore`

No database migration is required.

## Verification

Representative manual cases were verified for High, Medium, and Low Attention, as well as Completed-task handling.

Automated unit tests cover:

- High Attention calculation
- Medium Attention calculation
- Low Attention calculation
- Completed-task exclusion
- Overdue active tasks
- Lowercase priority values
- Missing optional priority and estimated-hours values
- Null task input

Current automated test result:

- Tests: 8
- Passed: 8
- Failed: 0

Coverage for `server/src/utils/taskAttention.js`:

- Line coverage: 97.00%
- Branch coverage: 93.75%
- Function coverage: 100.00%

The current coverage target for this core business-logic utility is at least 90% line and branch coverage.