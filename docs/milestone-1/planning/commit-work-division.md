# Milestone 1 Git Commit Work Division

## Purpose

This document records the initial Git commit and development work division plan for StudyFlow Milestone 1.

The original planning spreadsheet is preserved in this repository. This Markdown version is maintained so that the planning content and future revisions can be reviewed directly through GitHub history.

The assignments below represent the initial planning stage. Actual contributions will be documented through GitHub Issues, commits, Pull Requests, reviews, and completed project artifacts.

## Milestone 1 Scope Clarification

The Milestone 1 implementation plan focuses on the required working end-to-end MVP and repository reproducibility requirements.

The core implementation scope remains:

- User registration and authentication
- Course CRUD
- Academic Task CRUD
- Progress and status tracking
- Basic dashboard
- Persistent PostgreSQL storage
- User-specific data access
- Frontend/backend integration
- Testing and bug fixing
- Setup, run, and verification documentation

The following features are deferred beyond Milestone 1 and are not part of the current implementation commitment:

- Task Attention Level
- Advanced search and filtering
- Workload analytics or recommendations
- Calendar or timeline features
- Notifications
- External integrations
- AI-assisted features

## Development Work Division

| Development Area | Eunjoo Jung | Errin James | Shared |
|---|---|---|---|
| Project Setup | Backend/server setup, DB configuration | Frontend/client setup | Repository structure and integration decisions |
| Authentication | User model, registration API, login API, auth middleware | Registration page, login page, logout controls, frontend errors | End-to-end authentication verification |
| Course Management | Course model, CRUD API, ownership validation | Course list, create/edit/delete UI | Integration and bug fixing |
| Task Management | Task model, CRUD API, validation, course association | Task form, edit/delete UI, task fields | Integration and workflow verification |
| Progress / Status | Backend progress/status logic | Progress/status controls and display | End-to-end verification |
| Dashboard | Provide user-specific task data and required dashboard API/query support | Implement the basic dashboard layout and display active task information, progress, and status | Integrate and verify the basic dashboard workflow |
| Database | Define PostgreSQL schema, relationships, migrations, and seed/sample-data support when applicable | Review frontend data requirements | Verify schema, migration, and sample-data requirements for local setup |
| API Contract | Define/update REST endpoints | Verify frontend requirements | Agree on request/response structure |
| Backend Testing | API/auth/database tests | Review when needed | Integration test planning |
| Frontend Testing | Support if API mocks/data needed | UI/component/interaction tests | End-to-end test cases |
| Bug Fixes | Backend/data/API fixes | Frontend/UI fixes | Integration bugs |
| Documentation | Document backend/database setup, environment variables, migrations, and API requirements | Document frontend setup and usage requirements | Maintain README/setup instructions, required software and versions, dependency installation, safe `.env.example`, and verification instructions |
| Screenshots / Evidence | Backend/API evidence where needed | UI screenshots | Final report evidence |
| Pull Request Review | Review Errin's PRs | Review Eunjoo's PRs | Major integration decisions |
| Final Integration | Resolve backend/database integration issues | Resolve frontend integration issues | Verify the complete MVP from a clean local setup and confirm the main end-to-end workflow |
| Milestone Tag / Final Check | Verify backend/database readiness | Verify frontend readiness | Confirm the exact submitted M1 version, repository setup instructions, TA verification steps, and create the `milestone-1` tag |

## Shared Work Clarification

“Shared” does not mean that both team members create the same commit together.

It means that both members participate in reviewing, verifying, discussing, or making decisions about that task. The actual Git commit should be made by the team member who performed the corresponding work, using their own GitHub account.

## Commit Practice

Based on the Milestone 0 feedback, both team members should make multiple small, meaningful commits during each milestone rather than committing all work at once.

This will help demonstrate balanced contribution and follow standard industry Git practices.

## Contribution Tracking

This work division is a planning document only. It does not by itself establish completed contribution.

Actual Milestone 1 contributions will be tracked using:

- GitHub Issues for task requests, assignments, decisions, and progress updates
- Individual Git commits made by the person who performed the work
- Pull Requests for review and integration
- Pull Request reviews and comments
- Repository artifacts for completed implementation, documentation, design, and testing work

If the work division changes during Milestone 1, the change will be documented when it occurs through GitHub rather than rewriting the project history.
