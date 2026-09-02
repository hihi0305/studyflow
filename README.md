# StudyFlow

StudyFlow is a web-based academic planning application designed to help college students organize courses, assignments, exams, and projects while identifying academic tasks that may require immediate attention.

## Problem

College students often manage multiple deadlines across several courses. Traditional calendars and task lists can show what needs to be completed, but they provide limited support for evaluating workload, progress, and which task should receive attention first.

## Proposed Solution

StudyFlow combines course and academic task management with deadline, estimated work hours, user-defined priority, and progress information in a centralized dashboard.

The application will help students organize their academic responsibilities and identify tasks that may require immediate attention. In a later milestone, StudyFlow will calculate and display Task Attention Levels based on factors such as due date, estimated work hours, user-defined priority, and progress.

## Planned Core Features

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

## Proposed Technology Stack

- Frontend: React
- Backend: Node.js with Express
- Database: PostgreSQL
- API Style: REST/JSON
- Authentication: Secure password hashing and token- or session-based authentication, with the final mechanism to be confirmed during design
- Version Control: Git and GitHub
- Testing: Automated frontend/backend testing tools appropriate to the chosen implementation
- CI/CD: GitHub Actions or an equivalent service
- Containerization: Docker
- Deployment: A publicly accessible cloud-hosting platform suitable for the final architecture

## Development Approach

StudyFlow will be developed incrementally across the course milestones. Each development milestone will contain a runnable version of the application and will build on the functionality completed in the previous milestone.

- **Milestone 0:** Planning, requirements, architecture, and prioritized backlog
- **Milestone 1:** Working end-to-end MVP
- **Milestone 2:** Task Attention Level logic, testing, security, and quality improvements
- **Milestone 3:** Deployment, CI/CD, containerization, documentation, and final release

Development will follow one-week sprints, with prioritized backlog items selected and reviewed throughout the project.

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

The prioritized product backlog will be maintained in the shared GitHub repository. GitHub Issues may be used to track implementation tasks, defects, and milestone-related work.

See [`docs/BACKLOG.md`](docs/BACKLOG.md) for the current prioritized product backlog.

### Branching and Pull Request Strategy

The `main` branch will represent stable integrated project work.

Significant features will be developed on short-lived feature branches, such as:

```text
main
├─ feature/authentication
├─ feature/course-management
└─ feature/task-dashboard