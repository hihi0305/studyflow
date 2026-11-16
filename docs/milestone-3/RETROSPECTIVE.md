# StudyFlow — Semester Retrospective

**Course:** CS 415/515 Software Design & Development  
**Team Name:** StudyFlow Engineering Team  
**Release Version:** v1.0.0  

---

## 1. Executive Summary
Throughout the semester, our team built **StudyFlow**, a full-stack containerized web application designed to help students track academic deadlines and prioritize work using a custom **Task Attention Level (TAL)** algorithm. Through disciplined SCM policies, continuous integration, automated testing, and agile iteration, we successfully delivered a production-ready application (`v1.0.0`).

---

## 2. What Went Well (Successes)

1. **Disciplined Branching & PR Governance:**
   * Enforcing pull request approvals and automated GitHub Actions CI checks prevented breaking changes from entering `main`.
2. **Algorithmic UI Innovation (Task Attention Level):**
   * Translating academic deadline urgency into explicit color-coded borders and visual badges (`User Priority: X`, `Task Attention: X`) significantly improved task clarity.
3. **Containerized Consistency:**
   * Transitioning to a multi-container Docker setup (`docker-compose.yml`) eliminated "works on my machine" discrepancies across team members' environments.

---

## 3. Challenges & Lessons Learned

1. **Asynchronous Container Initialization:**
   * *Challenge:* Express backend containers occasionally booted faster than PostgreSQL initialized, resulting in connection drop errors during early local testing.
   * *Lesson:* Solved by incorporating PostgreSQL health checks (`pg_isready`) and setting `condition: service_healthy` in Docker Compose.
2. **Date & Timezone Calculations:**
   * *Challenge:* Client-side vs. server-side date parsing caused subtle offsets in deadline calculations near midnight.
   * *Lesson:* Standardized all dates to UTC ISO-8601 strings across database queries, REST API responses, and client utilities.
3. **AI Assistance Disclosure & Verification:**
   * *Challenge:* AI-generated code occasionally suggested out-of-date CommonJS syntax or incompatible import paths for Vite.
   * *Lesson:* Human code reviews remain essential—AI accelerated initial prototyping, but developer verification was crucial for module compatibility and accessibility compliance.

---

## 4. Team Recommendations for Future Maintenance

* Maintain strict unit test coverage targets (> 80%) for algorithm-heavy utility scripts like `taskAttention.js`.
* Expand automated E2E testing (Playwright or Cypress) to cover multi-step student user flows.
* Implement database connection pooling monitoring as active user counts grow.