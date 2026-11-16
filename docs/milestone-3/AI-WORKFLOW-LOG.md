# StudyFlow — Disclosed AI-Assisted Workflow Log

**Requirement:** Milestone 3 Disclosed AI Feature / Refactor  
**Feature Refactored:** Dynamic Task Attention Level (TAL) Sorting & UI Card Border Refactor  

---

## 1. Prompting Record & Iteration Log

| Iteration | Prompt / Question Asked to AI | AI Output Summary | Action Taken | Rationale & Modification Details |
| :---: | :--- | :--- | :---: | :--- |
| **01** | *"How do we update `TaskList.jsx` and `DashboardPage.jsx` to sort tasks by Task Attention Level so active tasks appear first?"* | Provided a `getAttentionSortRank` ranking helper function (High=4, Medium=3, Low=2, Completed=1) and `.sort()` invocation. | **Accepted (Unmodified)** | The rank weight logic cleanly separated active tasks from completed tasks without breaking existing filter predicates. |

| **02** | *"Instead of coloring the entire task card background, use Task Attention Level colors on the card border."* | Provided dynamic Tailwind border classes (`border-red-500`, `border-amber-400`, `border-blue-400`, `border-emerald-500`). | **Accepted with Edits** | Modified yellow border class from `border-yellow-500` to `border-amber-400` to improve contrast on white backgrounds. |

| **03** | *"Add explicit badges for User Priority and Task Attention Level side-by-side on each card."* | Generated badge components labeled `User Priority: X` and `Task Attention: X`. | **Accepted (Unmodified)** | Explicit labels resolved user ambiguity since both metrics use High/Medium/Low scales. |

| **04** | *"Import `taskAttention.js` using CommonJS `require()` in `TaskList.jsx`."* | Suggested using `require('../../utils/taskAttention')` inside the React client component. | **Rejected** | Vite client bundle failed with import errors. Replaced with ES Module syntax: `import { calculateTaskAttention } from '../../utils/taskAttention';`. |

---

## 2. Summary of Key Learnings & Engineering Judgments

1. **AI Strengths:** AI accelerated UI styling adjustments and algorithm ranking helpers.
2. **Human Interventions:** Corrected module resolution errors (ESM vs CommonJS) and adjusted color contrast for accessibility compliance (WCAG standards).