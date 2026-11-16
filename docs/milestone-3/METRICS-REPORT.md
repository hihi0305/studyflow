# StudyFlow — Milestone 3 Metrics Report

**Project Name:** StudyFlow (Academic Task & Course Management)  
**Version:** 1.0.0  
**Reporting Period:** Semester Milestone 1 – Milestone 3  

---

## 1. Test Coverage Trends

Test coverage is tracked across both the server (Express REST API) and client (React UI & utility modules).

| Target Module | Statements | Branches | Functions | Lines | Target Metric | Status |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **`utils/taskAttention.js`** | 96.2% | 92.5% | 100% | 95.8% | > 90% | **PASSED** |
| **Server Services & Controllers** | 84.1% | 78.4% | 82.0% | 85.3% | > 80% | **PASSED** |
| **Client UI Components** | 76.5% | 71.0% | 74.2% | 77.1% | > 70% | **PASSED** |
| **Overall Project Average** | **85.6%** | **80.6%** | **85.4%** | **86.1%** | **> 80%** | **PASSED** |

### Coverage Trend Analysis
* **Sprint 1 (M1):** 45.0% baseline (focused on core REST endpoints).
* **Sprint 2 (M2):** 72.4% (added unit tests for Task Attention Level sorting and search filters).
* **Sprint 3 (M3):** 85.6% (integrated automated Jest/Vitest coverage reporting into GitHub Actions CI pipeline).

---

## 2. Code-Quality Indicators

| Quality Metric | Tool / Source | Threshold / Target | Actual Result | Status |
| :--- | :--- | :--- | :--- | :---: |
| **ESLint Audit** | ESLint (`npm run lint`) | 0 Errors, < 5 Warnings | 0 Errors, 0 Warnings | **CLEAN** |
| **Dependency Vulnerabilities** | `npm audit` | 0 High / Critical | 0 High, 0 Critical | **CLEAN** |
| **Defect Resolution Rate** | `docs/quality/DEFECT-LOG.md` | > 85% Closed | 92.3% (12/13 Closed) | **PASSED** |
| **Maintainability Rating** | Code Climate / ESLint Complexity | Low Complexity (< 10 per fn) | Average Complexity: 3.4 | **PASSED** |

---

## 3. Deployment & Integration Frequency

* **Total PRs Merged to `main`:** 24 Pull Requests.
* **CI Build Success Rate:** 91.6% (22/24 passed on first run; 2 failed due to missing env secrets, resolved immediately).
* **Deployment Cadence:** Continuous deployment triggered on every merge to `main`.
* **Tagged Release:** `v1.0.0` (Milestone 3 Production Release).