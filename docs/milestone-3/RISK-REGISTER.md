# StudyFlow — Risk Register & Mitigation Strategy

**Project Name:** StudyFlow (Academic Task & Course Management)  
**Version:** 1.0.0  
**Last Updated:** November 2026  

---

## 1. Risk Evaluation Matrix

| Risk ID | Risk Category | Description | Likelihood | Impact | Risk Score | Mitigation Strategy | Contingency Plan | Owner |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- | :--- | :--- |
| **RSK-01** | Technical / Infrastructure | PostgreSQL container startup race condition causing backend connection drops on `docker compose up`. | Medium | High | **High** | Implement `wait-for-it.sh` or Docker Compose `depends_on` with `condition: service_healthy` check. | Fallback to manual retry loop in Express database connection module (`knex`/`pg`). | DevOps Lead |

| **RSK-02** | Technical / Logic | Timezone parsing mismatch in `taskAttention.js` causing incorrect Task Attention Level (TAL) calculation near midnight. | Medium | Medium | **Medium** | Standardize all due dates to UTC ISO-8601 strings in database and parse using standardized Date methods. | Fallback to server-side TAL calculation endpoint if client date calculation produces `NaN`. | Frontend Lead |

| **RSK-03** | Process / CI/CD | GitHub Actions pipeline timeout or failure due to missing environment variables during PR checks. | Low | High | **Medium** | Store required test keys in Repository Secrets; use `.env.example` templates in CI scripts. | Bypass PR check only with explicit reviewer override and document defect in `DEFECT-LOG.md`. | QA Lead |

| **RSK-04** | Security | Vulnerabilities detected in third-party npm packages (`npm audit` high/critical severity). | Medium | High | **High** | Run automated `npm audit` in CI pipeline; pin major package versions. | Apply immediate patch via `npm audit fix` or replace vulnerable dependency with lightweight alternative. | Security Lead |

| **RSK-05** | Operational / Deployment | Free-tier host platform (e.g., Render/Railway) sleeping or failing deployment during live grading demo. | Low | Critical | **High** | Pre-warm live deployment endpoints 15 minutes before demonstration; verify health checks (`/api/health`). | Switch immediately to local containerized setup (`docker compose up`) as verified backup. | Team Lead |

---

## 2. Risk Monitoring Protocol

* **Review Frequency:** Weekly during sprint planning and prior to tagging release versions.
* **Escalation Trigger:** Any risk scoring **High** or **Critical** that remains unmitigated within 48 hours of detection must be flagged as a blocking issue on the project board.