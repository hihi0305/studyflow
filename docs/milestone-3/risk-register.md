# StudyFlow Milestone 3 — Risk Register

**Project:** StudyFlow
**Milestone:** 3 — Deployment, CI/CD, and Final Release
**Last Updated:** November 28, 2026
**Owner:** StudyFlow Development Team

## 1. Purpose

This risk register identifies technical and operational risks that may affect StudyFlow's deployment, reliability, security, and final release. It records observed issues, mitigation actions, remaining work, and current risk status.

Likelihood and impact are assessed qualitatively as Low, Medium, or High. Risk status reflects the project's progress as of November 28, 2026.

## 2. Risk Register

| ID | Risk | Likelihood | Impact | Mitigation / Response | Status |
|---|---|---|---|---|---|
| R-01 | Render free PostgreSQL expiration may make the deployed application unavailable. | High | High | The free database is scheduled to expire on December 25, 2026. Complete the final demonstration before expiration and plan for database renewal or migration if continued hosting is required. | Open |
| R-02 | Database data may be lost if backups are unavailable or cannot be restored. | Medium | High | Created a PostgreSQL custom-format backup using `pg_dump` and successfully restored it to an isolated PostgreSQL 18.7 Docker database. Verified the restored tables, constraints, and record counts. Continue taking secure backups and periodically testing restoration. | Mitigated / Monitoring |
| R-03 | Deployment may fail or publish code that has not passed automated checks. | Medium | High | Use GitHub Actions to run backend tests, lint, coverage, and frontend build checks. Trigger Render deployment only after successful CI on `main`. Align both Render services with `main` and verify the complete CD process. | In Progress |
| R-04 | Changes may be merged without required CI results or independent review. | Medium | High | Configure GitHub branch protection to require successful CI checks and one reviewer approval. Test that failing checks block merging and that an approved, passing PR can be merged. | Open |
| R-05 | Vulnerabilities in development dependencies may affect local development or future builds. | Medium | Medium | Review npm audit reports, avoid unnecessary breaking upgrades, and track dependency updates. On November 28, both frontend and backend production-dependency audits reported zero known vulnerabilities, while development-dependency findings remained. | Monitoring |
| R-06 | Incorrect environment variables, CORS settings, or API URLs may prevent frontend–backend communication. | Medium | High | Store secrets in Render and GitHub settings, configure the production API URL, and validate registration, login, course management, and task management through the public site. | Mitigated |
| R-07 | Client-side routes may return Not Found when accessed directly. | Medium | Medium | Configure the Render Static Site rewrite rule from `/*` to `/index.html`. Verify that direct access to protected routes redirects unauthenticated users to login. | Mitigated |
| R-08 | Differences between local and hosted environments may cause inconsistent behavior. | Medium | Medium | Maintain Docker Compose setup instructions, run automated CI checks, document Windows setup procedures, and perform end-to-end checks on the hosted application. | Mitigated / Monitoring |
| R-09 | Exposed credentials or deployment hooks could allow unauthorized access or deployment. | Low | High | Store database credentials, JWT secrets, and Render deploy hooks in environment settings or GitHub Actions secrets. Do not commit or share secret values. Rotate credentials if exposure is suspected. | Monitoring |

## 3. Verification Evidence

The following activities were completed during Milestone 3:

- Deployed PostgreSQL, the Express backend, and the React frontend to Render.
- Applied all four database migrations and verified the resulting database schema.
- Confirmed that the public backend health endpoint responds successfully.
- Verified registration, login, and JWT issuance through the deployed backend.
- Verified frontend login and protected Dashboard access.
- Created Course and Academic Task records through the public application.
- Confirmed that application data persisted after logout and login.
- Verified task updates, automatic progress normalization on completion, and Dashboard statistics.
- Successfully deleted test Course and Task records.
- Verified that frontend and backend production-dependency audits returned zero known vulnerabilities.
- Created a GitHub Actions CD workflow and opened a Pull Request for review.
- Created a production PostgreSQL backup on November 28, 2026, using `pg_dump`.
- Verified the backup archive using `pg_restore --list`.
- Successfully restored the backup to an isolated PostgreSQL 18.7 Docker database.
- Confirmed that the restored database contained all three application tables and that record counts matched the expected test data: 1 user, 0 courses, and 0 academic tasks.
- Removed the temporary restore container after verification while retaining the original backup file outside the Git repository.


These checks demonstrate that the core hosted application is operational and that the database backup can be restored successfully. Branch-protection verification and validation of the complete automated deployment pipeline are still pending.

## 4. Remaining Mitigation Actions

Before the final release, the team should:

1. Merge the reviewed production deployment configuration and CD workflow.
2. Align Render's backend and frontend deployment branches with `main`.
3. Verify that successful CI triggers the intended Render deployments.
4. Configure and test required GitHub branch protection rules.
5. Document the verified backup and restore commands for future maintenance and repeat the procedure periodically.
6. Record unresolved development-dependency vulnerabilities and future maintenance recommendations.
7. Recheck the public application after the final deployment.

## 5. Maintenance and Review

The team will review this register when deployment settings change, new vulnerabilities are identified, a major defect occurs, or a release decision is made.

Each unresolved risk should remain visible in the project documentation until its mitigation has been implemented and verified. Risks should not be marked as resolved solely because a proposed solution has been documented.
