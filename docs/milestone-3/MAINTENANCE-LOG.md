# StudyFlow — Software Maintenance & Support Plan

**Project Name:** StudyFlow (Academic Task & Course Management)  
**Document Version:** 1.0.0  
**Maintained By:** CS 415/515 Development Team  
**Repository:** https://github.com/hihi0305/studyflow  

---

## 1. Overview & Objectives

This Maintenance & Support Plan defines how the StudyFlow application will be supported, updated, and maintained following its initial release (`v1.0.0`). The goal is to preserve system reliability, security, and performance while establishing clear procedures for bug fixes, dependency updates, and feature enhancements.

---

## 2. Maintenance Categories & Scope

StudyFlow organizes maintenance activities into the four standard software engineering categories:

### 2.1 Corrective Maintenance (Defect & Bug Remediation)
* **Definition:** Fixing defects, runtime errors, or incorrect calculations discovered after release.
* **Examples in StudyFlow:**
  * Resolving edge-case errors in Task Attention Level (TAL) calculations (`taskAttention.js`).
  * Fixing API response errors or broken database query handlers.
  * Correcting UI rendering or state synchronization glitches between client and server.
* **Process:** Any reported bug is logged in `docs/quality/DEFECT-LOG.md`, assigned a priority level, and resolved on a dedicated `fix/` branch following the project's SCM Policy (`docs/process/SCM-POLICY.md`).

### 2.2 Adaptive Maintenance (Environment & Platform Updates)
* **Definition:** Updating the application to maintain compatibility with evolving external environments, runtime engines, and platforms.
* **Examples in StudyFlow:**
  * Upgrading Node.js runtime versions (enforced via `engines` in `server/package.json`).
  * Updating PostgreSQL database drivers (`@prisma/adapter-pg` / Prisma ORM releases).
  * Adjusting environment variables or Docker configuration for new deployment hosts (e.g., Render, Railway, Fly.io).

### 2.3 Perfective Maintenance (Performance & Usability Enhancements)
* **Definition:** Improving application performance, UI/UX accessibility, or user experience without altering core requirements.
* **Examples in StudyFlow:**
  * Optimizing SQL queries and database indexes on high-frequency fields (`user_id`, `status`, `due_date`).
  * Polishing Tailwind CSS layout responsiveness and WCAG 2.1 AA accessibility standards.
  * Enhancing dashboard loading times using caching or optimized REST DTO responses.

### 2.4 Preventive Maintenance (Debt Reduction & Security Audits)
* **Definition:** Proactive code cleanup and security hardening to prevent future system degradation or vulnerabilities.
* **Examples in StudyFlow:**
  * Executing automated dependency security audits (`npm audit --audit-level=high`) in the GitHub Actions CI pipeline.
  * Refactoring duplicated code modules to maintain high cohesion and low coupling.
  * Keeping documentation (`README.md`, setup guides, and API contracts) synchronized with the codebase.

---

## 3. Operations, Health Checks & Observability

### 3.1 Health Check Endpoints
* **API Health Route:** `GET /api/health`
* **Response Contract:** `{"status": "ok", "service": "studyflow-api"}`
* **Container Health:** Docker Compose verifies container health using `pg_isready` for PostgreSQL and HTTP health calls for the server process before marking services as healthy.

### 3.2 Error Handling & Logging
* **Server Logging:** Structured logging via `pino` (`src/lib/logger.js`) records security-relevant events (e.g., failed login attempts, unauthorized access).
* **Production Error Masking:** Detailed error stack traces are logged internally for developers but masked in production HTTP responses to prevent information disclosure (OWASP A05).

---

## 4. Support & Issue Tracking Protocol

* **Issue Reporting:** All bug reports, feature requests, and maintenance tasks are tracked via GitHub Issues.
* **Issue Triaging:** Each issue must include:
  1. Detailed steps to reproduce
  2. Expected vs. actual behavior
  3. Environment details (Node.js version, browser, OS)
* **Backlog Integration:** Triaged issues are categorized as `Backlog`, `In Progress`, or `Done` in `docs/BACKLOG.md`.

---

## 5. Deployment & Rollback Strategy

### 5.1 Release Management
* All release versions are tagged in Git using Semantic Versioning (`v1.0.0`) on the `main` branch after passing all CI checks (linting, unit, integration, and E2E tests).

### 5.2 Rollback Protocol
In the event of a critical post-deployment failure:
1. Identify the last stable Git release tag (e.g., `git checkout v1.0.0`).
2. Redeploy the known stable container image built by the CI pipeline (`ghcr.io`).
3. Document the failure and root cause in `docs/quality/DEFECT-LOG.md`.