# StudyFlow

StudyFlow is a web-based academic planning application designed to help college students organize courses, assignments, exams, and projects while identifying academic tasks that may require immediate attention.

## Live Deployment

StudyFlow is publicly hosted on Render.

- **Frontend:** https://studyflow-nhpt.onrender.com
- **Backend Health Check:** https://studyflow-api-m8ij.onrender.com/api/health
- **Hosting:** Render Static Site (React), Render Web Service (Express), and Render PostgreSQL 18

To verify the deployed application, open the frontend URL, register a new account, log in, create a Course and an Academic Task, and confirm that the Dashboard reflects the saved information.

**Note:** Render's free services may take additional time to respond after inactivity. The free PostgreSQL instance is currently scheduled to expire on December 25, 2026.

## Problem

College students often manage multiple deadlines across several courses. Traditional calendars and task lists can show what needs to be completed, but they provide limited support for evaluating workload, progress, and which task should receive attention first.

## Solution

StudyFlow combines course and academic task management with deadline, estimated work hours, user-defined priority, and progress information in a centralized dashboard.

StudyFlow builds on its Milestone 1 end-to-end MVP and Milestone 2 feature enhancements, including Task Attention Level calculation, task search and filtering, improved Dashboard presentation, stronger password validation, and expanded testing. Milestone 3 further improves the application's reproducibility and code quality through Docker containerization, automated linting, integration testing, code coverage reporting, and GitHub Actions continuous integration.

StudyFlow now evaluates active academic tasks using due date, estimated work hours, user-defined priority, and progress to calculate a Task Attention Level. This helps users distinguish between tasks that require high, medium, or low attention while preserving the original course, task, progress, and status-management workflow.

## Core Features

### Core MVP Features

- User registration and authentication
- Course creation, editing, and deletion
- Academic task creation, editing, and deletion
- Task type selection
- Due-date tracking
- User-defined priority
- Estimated work hours
- Task progress and status tracking
- Centralized academic dashboard
- Persistent database storage
- User-specific data access
- Task Attention Level calculation
- Task Attention Level visualization
- Task search and filtering
- Improved task progress visualization
- Attention-based Dashboard task ordering
- Stronger registration password validation
- Automated backend testing and coverage verification
- Security controls for authentication, authorization, ownership, and input validation

### Planned Later Features

- Workload-based task recommendations
- Calendar or timeline view
- Academic workload analytics
- Reminder notifications
- AI-assisted task decomposition

## Technology Stack

- Frontend: React
- Backend: Node.js with Express
- Database: PostgreSQL
- API Style: REST/JSON
- Authentication: bcrypt password hashing with JWT-based authentication
- Version Control: Git and GitHub

## Development Approach

StudyFlow is developed incrementally across the course milestones. Each development milestone builds on the functionality completed in the previous milestone.

- **Milestone 0:** Planning, requirements, architecture, and prioritized backlog
- **Milestone 1:** Working end-to-end MVP
- **Milestone 2:** Task Attention Level logic, testing, security, and quality improvements
- **Milestone 3:** Deployment, CI/CD, containerization, documentation, and final release

Development uses short iterative work cycles, with prioritized backlog items selected and reviewed throughout the project.

## Definition of Done

A backlog item is considered Done when:

- [ ] The agreed acceptance criteria are satisfied.
- [ ] The implementation runs successfully.
- [ ] Relevant automated tests have been added or updated when applicable.
- [ ] Existing tests continue to pass.
- [ ] The code has been reviewed when appropriate.
- [ ] Documentation is updated if setup, behavior, or interfaces changed.
- [ ] No known critical defects prevent the feature from being demonstrated.
- [ ] The completed work has been integrated into the appropriate shared branch.

## Development Process

### Backlog and Issue Tracking

The prioritized product backlog is maintained in the shared GitHub repository. GitHub Issues are used to track implementation tasks, defects, documentation, verification, and milestone-related work.

See [`docs/BACKLOG.md`](docs/BACKLOG.md) for the current prioritized product backlog.

### Branching and Pull Request Strategy

The `main` branch represents stable integrated project work.

Significant features are normally developed on short-lived feature branches, such as:

```text
main
├─ feature/authentication
├─ feature/course-management
└─ feature/task-dashboard
```
## Project Documentation

- [Milestone 1 Final Report](docs/milestone-1/Milestone_1_Build.pdf)
- [Windows TA Setup and Verification Guide](docs/TA_WINDOWS_SETUP.md)
- [Task Attention Level Documentation](docs/milestone-2/task-attention-level.md)
- [Threat Model](docs/milestone-2/threat-model.md)
- [Milestone 2 QA Plan](docs/milestone-2/qa-plan.md)
- [OWASP Top 10 Review](docs/milestone-2/owasp-top-10-review.md)
- [Development Workflow](docs/milestone-2/development-workflow.md)
- [Changelog](CHANGELOG.md)

## Project Setup

For a complete Windows installation and verification walkthrough, see the [Windows TA Setup and Verification Guide](docs/TA_WINDOWS_SETUP.md).

### Required Software

The manual Windows setup was previously verified using:

- Node.js v20.20.2
- npm 10.8.2
- PostgreSQL 18.6

### Docker Quick Start (Recommended)

Docker Compose provides a reproducible local environment with three services: a React frontend served by Nginx, an Express backend, and PostgreSQL 18.

**Requirements:** Docker Desktop with Docker Compose.

From the project root, copy `.env.example` to `.env` and replace the placeholder values with two different, securely generated secrets.

```dotenv
POSTGRES_PASSWORD=<strong-random-password>
JWT_SECRET=<long-random-secret>
```

Use different randomly generated values for each variable. Do not commit the `.env` file or share its contents.

Build and start the application:

```bash
docker compose up -d --build
```

Open the application at **http://localhost:8080**.

The frontend is served by Nginx, which forwards `/api` requests to the internal Express backend on port 4000. PostgreSQL runs in a separate container without publishing its database port to the host.

On first initialization of a new PostgreSQL data volume, the four SQL migrations in `server/migrations` run in filename order. They are not automatically reapplied to an existing volume.

Verify the running services:

```bash
docker compose ps
curl.exe http://localhost:8080/api/health
```

The health endpoint should return `{"status":"ok","message":"StudyFlow API is running"}`. PostgreSQL should report a healthy status.

To stop and remove the containers while preserving database data:

```bash
docker compose down
```

To restart:

```bash
docker compose up -d
```

The PostgreSQL named volume preserves user, Course, and Academic Task data across container recreation. Avoid `docker compose down -v` unless intentionally deleting the database volume and its data.

For backend regression tests, use the separately configured test database and run `npm test` from the `server` directory as documented below.

### Backend

For manual backend execution, install the dependencies, configure the environment, and apply the database migrations before starting the server.

From the project root, navigate to the server directory:

```cmd
cd server
npm install
```

Create `server/.env` from `server/.env.example`:

```cmd
copy .env.example .env
notepad .env
```

Configure `PORT`, `DATABASE_URL`, and `JWT_SECRET` for your local PostgreSQL instance.

This file is separate from the repository-root `.env` used by Docker Compose. Do not commit `.env` files or authentication secrets to Git.

Create the studyflow PostgreSQL database and apply the migrations in order:

1. `001_create_users.sql`
2. `002_create_courses.sql`
3. `003_create_academic_tasks.sql`
4. `004_rename_course_name_to_course_number.sql`

For the complete PostgreSQL database creation and migration commands, see the [Windows TA Setup and Verification Guide](docs/TA_WINDOWS_SETUP.md).

No additional database migration is required for the existing Task Attention Level or password-validation functionality because these features do not modify the database schema.

After configuring the environment and applying the migrations, start the backend:

```cmd
npm run dev
```

Run the backend automated tests from a separate Command Prompt opened in the `server` directory. These tests require the separate `studyflow_test` database and `server/.env.test` configuration described in the TA guide.

```cmd
set "DATABASE_URL="
npm test
```

Generate the backend test coverage report:

```cmd
npm run test:coverage
```

### Frontend

Install the frontend dependencies and start the development server:

```bash
cd client
npm install
npm run dev
```

A production frontend build can be generated with:

```bash
npm run build
```

### Continuous Integration (Milestone 3)

StudyFlow uses GitHub Actions to automatically validate code changes through backend and frontend checks.

The CI workflow runs on Pull Requests targeting `main` and includes:

- **Backend Tests:** PostgreSQL integration testing, backend ESLint, automated tests, and code coverage reporting.
- **Frontend Build:** Frontend ESLint and Vite production build verification.

To run the backend checks locally, open a terminal in the `server` directory:

```bash
npm run lint
npm run test:coverage
```

To run the frontend checks locally, open a terminal in the `client` directory:

```bash
npm run lint
npm run build
```

The backend integration tests require a separate PostgreSQL test database and a correctly configured `server/.env.test` file. See the Windows TA Setup and Verification Guide for detailed test environment setup instructions.

GitHub Actions results are available in the repository's Actions tab and on the corresponding Pull Requests.

The workflow is configured to execute automatically. Mandatory status-check enforcement through GitHub branch protection will be configured and verified before the final release.

### Verification

No seed script or shared demonstration account is required for the current StudyFlow application. A tester can register a new account and create sample Course and Academic Task data through the application.

Recommended manual verification steps (for testers and TAs):

`Register → Login → Create Course → Create Academic Task → Verify Task Attention Level → Search / Filter Tasks → Update Progress / Status → View Dashboard → Logout → Login Again → Verify Persisted Data`

Additional Milestone 2 verification includes:

- Strong password validation during registration
- Automated Task Attention Level and password-validation tests
- API-level integration testing for the main user flows
- Backend regression testing
- Backend test coverage verification
- Authentication and authorization controls
- User-specific Course and Academic Task ownership
- Input validation
- Task Attention Level calculation
- Progress and status normalization
- Cross-viewport verification at desktop, medium-width, and mobile viewport sizes
- Task Attention Level visualization on the Dashboard and Academic Tasks page
- Consistent Task Attention Level results across Dashboard and Academic Tasks
- Attention-based Dashboard ordering
- Task search and filtering
- Improved progress visualization
