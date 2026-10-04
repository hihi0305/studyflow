# StudyFlow

StudyFlow is a web-based academic planning application designed to help college students organize courses, assignments, exams, and projects while identifying academic tasks that may require immediate attention.

## Problem

College students often manage multiple deadlines across several courses. Traditional calendars and task lists can show what needs to be completed, but they provide limited support for evaluating workload, progress, and which task should receive attention first.

## Solution

StudyFlow combines course and academic task management with deadline, estimated work hours, user-defined priority, and progress information in a centralized dashboard.

The Milestone 1 application helps students organize their academic responsibilities through authenticated course and academic task management, progress and status tracking, persistent storage, and a centralized dashboard. In a later milestone, StudyFlow may add Task Attention Levels based on factors such as due date, estimated work hours, user-defined priority, and progress.

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

### Planned Later Features

- Task Attention Level calculation and display
- Search and filtering
- Improved progress visualization
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

## Milestone 1 Setup

### Required Software

The Milestone 1 version of StudyFlow was developed and verified using:

- Node.js v20.20.2
- npm 10.8.2
- PostgreSQL 18.6

### Backend

```bash
cd server
npm install
npm run dev
```

Create a local `.env` file based on `.env.example` and configure `PORT`, `DATABASE_URL`, and `JWT_SECRET`.

Apply the database migrations in order:

1. `001_create_users.sql`
2. `002_create_courses.sql`
3. `003_create_academic_tasks.sql`
4. `004_rename_course_name_to_course_number.sql`

### Frontend

```bash
cd client
npm install
npm run dev
```

A production frontend build can be generated with `npm run build`.

### Verification

No seed script or demonstration account is required for Milestone 1. A tester can register a new account and create sample Course and Academic Task data through the application.

Basic verification flow:

`Register → Login → Create Course → Create Academic Task → Update Progress / Status → View Dashboard → Logout → Login Again → Verify Persisted Data`

See the Milestone 1 report for the complete design, implementation, and verification documentation.
