# Changelog

All notable changes to StudyFlow are documented in this file.

## Milestone 3 — In Progress

### Added

- Added Docker containerization for the React frontend, Express backend, and PostgreSQL database.
- Added Docker Compose configuration for reproducible local application setup.
- Added multi-stage frontend Docker build with Nginx serving production assets and proxying `/api` requests.
- Added backend Docker configuration and PostgreSQL 18 database initialization with persistent storage.
- Added GitHub Actions continuous integration for backend and frontend validation.
- Added automated backend and frontend ESLint checks.
- Added backend code coverage reporting to the CI workflow.
- Added Dashboard API integration tests for summary behavior and user-specific data isolation.
- Deployed the React frontend, Express backend, and PostgreSQL 18 database to Render.
- Configured the frontend production API URL and backend CORS support for public hosting.
- Configured a Render Static Site rewrite rule to support direct navigation to React Router routes.
- Added a GitHub Actions continuous deployment workflow to trigger Render deployments after successful CI on `main` (pending PR merge and end-to-end verification).
- Added a Milestone 3 Risk Register covering deployment, security, database reliability, and maintenance risks (pending PR merge).

### Changed

- Improved frontend React components to comply with ESLint and React Hooks rules.
- Improved asynchronous data loading and form-state initialization while preserving existing Course and Academic Task functionality.
- Expanded Docker setup instructions and environment configuration guidance in the README.
- Improved the Windows TA Setup and Verification Guide with Docker execution and separate PostgreSQL test database instructions.

### Fixed

- Resolved frontend linting issues involving unused variables, React Hooks dependencies, and state management.
- Addressed the local integration-test configuration issue identified during independent Windows verification by documenting the required `.env.test` file and `studyflow_test` database.

### Testing

- Verified the Docker Compose environment with frontend, backend, and PostgreSQL services.
- Verified API health checks, database initialization, and data persistence across container recreation.
- Verified GitHub Actions **Backend Tests** and **Frontend Build** jobs successfully.
- Verified the backend regression suite with 17 passing tests and zero failures.
- Increased Dashboard source-file line coverage from 20.63% to 90.48% through additional integration testing.
- Completed six Course-management and nine Academic Task frontend regression checks successfully.
- Confirmed independent team-member verification of the Docker environment and local backend tests.
- Verified the public backend health endpoint and all four PostgreSQL migrations.
- Verified registration, login, Course and Academic Task operations, and Dashboard updates in the hosted application.
- Confirmed data persistence after logout and login.
- Verified automatic progress normalization to 100% when a task is marked Completed.
- Confirmed zero known vulnerabilities in frontend and backend production dependencies using `npm audit --omit=dev`.
- Created a PostgreSQL backup and successfully restored it to an isolated PostgreSQL 18.7 Docker database.
- Verified the restored database schema, constraints, and record counts.

### Documentation

- Added Docker setup and troubleshooting guidance to the README.
- Expanded Windows TA verification instructions for Milestone 3.
- Documented CI verification commands, test database configuration, and environment-variable requirements.

### Remaining Milestone 3 Work

- Complete PR reviews and merge the production deployment configuration, CD workflow, and final documentation.
- Align Render frontend and backend deployment branches with `main`.
- Verify that successful GitHub Actions CI triggers Render deployments.
- Configure and verify required CI status checks and Pull Request review protection.
- Collect final deployment metrics and regression evidence.
- Finalize README, TA verification instructions, and demonstration evidence.
- Create the `milestone-3` tag and `v1.0` GitHub Release.
- Complete the final paper, demonstration, and contribution statements.

## Milestone 2

### Added

- Added Task Attention Level calculation and backend API integration
- Added Task Attention Level unit tests
- Added stronger backend password validation
- Added frontend password-requirement checklist and validation
- Added Milestone 2 threat model
- Added Milestone 2 QA plan
- Added OWASP Top 10 review
- Added Milestone 2 development workflow documentation
- Added Task Attention Level visualization to Dashboard and Academic Task cards
- Added task search and filtering by Course, Status, User Priority, and Task Attention Level

### Changed

- Improved Dashboard task information visibility
- Updated StudyFlow logo navigation to route correctly to the Dashboard
- Strengthened registration password requirements
- Improved task progress visualization on the Dashboard and Academic Tasks page
- Added attention-based Dashboard ordering: High → Medium → Low → Completed

### Fixed

- Fixed missing Course information on Dashboard task cards
- Fixed missing user-defined priority display on Dashboard task cards
- Fixed missing progress display on Dashboard task cards
- Fixed incorrect StudyFlow logo navigation behavior
- Fixed inconsistent Task Attention Level results between the Dashboard and Academic Tasks page by including estimated hours in Dashboard task data

### Security

- Enforced password requirements on the backend before account creation
- Verified authentication behavior for missing, invalid, and valid tokens
- Verified Course authorization and user-specific data isolation
- Verified Academic Task authorization and user-specific data isolation
- Verified Course ownership before Task association
- Verified representative backend input-validation failures
- Preserved before-and-after password-security evidence

### Testing

- Added automated Task Attention Level unit tests
- Added automated password-validation tests
- Added initial coverage measurement and coverage target
- Completed authentication, authorization, and input-validation security verification
- Added reusable Milestone 2 QA checklist
- Added API-level integration testing for the main StudyFlow user flows
- Verified authentication, Course CRUD, Academic Task CRUD, Course association, Task Attention Level API data, progress/status normalization, and user-specific data isolation
- Verified the complete backend regression suite with 17 tests passing and 0 failures
- Generated backend coverage after integration testing; `passwordValidation.js` and `taskAttention.js` retained 100% line, branch, and function coverage
- Completed cross-viewport verification at 1440 × 900, 1024 × 768, and 390 × 844
- Verified navigation, Dashboard, Academic Tasks, Courses, authentication forms, task creation, progress indicators, and responsive layouts across representative viewport sizes
- Verified that no critical unintended horizontal overflow or overlapping UI elements were observed

### Documentation

- Added Task Attention Level documentation
- Added threat model documentation
- Added QA plan documentation
- Added OWASP Top 10 review documentation
- Added branching, commit, PR, review, and merge workflow documentation
- Updated Milestone 2 README and Windows TA setup/verification documentation

### Outstanding Items Recorded at the End of Milestone 2

- Academic Task page attention-based ordering improvement
- Optional additional cross-browser / cross-platform verification
- Final regression testing after remaining frontend ordering work
- Demo preparation
- Final contribution statements
- Second Milestone 2 checkpoint release
- Final `milestone-2` release tag
