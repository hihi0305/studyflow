# Milestone 1 Git Commit Work Division

## Purpose

This document records the initial Git commit and development work division plan for StudyFlow Milestone 1.

The original planning spreadsheet is preserved in this repository. This Markdown version is maintained so that the planning content and future revisions can be reviewed directly through GitHub history.

The assignments below represent the initial planning stage. Actual contributions will be documented through GitHub Issues, commits, Pull Requests, reviews, and completed project artifacts.

## Development Work Division

| Development Area | Eunjoo Jung | Errin James | Shared |
|---|---|---|---|
| Project Setup | Backend/server setup, DB configuration | Frontend/client setup | Repository structure and integration decisions |
| Authentication | User model, registration API, login API, auth middleware | Registration page, login page, logout controls, frontend errors | End-to-end authentication verification |
| Course Management | Course model, CRUD API, ownership validation | Course list, create/edit/delete UI | Integration and bug fixing |
| Task Management | Task model, CRUD API, validation, course association | Task form, edit/delete UI, task fields | Integration and workflow verification |
| Progress / Status | Backend progress/status logic | Progress/status controls and display | End-to-end verification |
| Dashboard | Dashboard API/query/data handling | Dashboard layout, task display, responsive UI | Integration and final behavior checks |
| Database | PostgreSQL schema, migrations, relationships | Review and frontend data requirements | Schema review |
| API Contract | Define/update REST endpoints | Verify frontend requirements | Agree on request/response structure |
| Backend Testing | API/auth/database tests | Review when needed | Integration test planning |
| Frontend Testing | Support if API mocks/data needed | UI/component/interaction tests | End-to-end test cases |
| Bug Fixes | Backend/data/API fixes | Frontend/UI fixes | Integration bugs |
| Documentation | Backend/database/API documentation | Frontend/UI documentation | README, milestone report, final setup instructions |
| Screenshots / Evidence | Backend/API evidence where needed | UI screenshots | Final report evidence |
| Pull Request Review | Review Errin's PRs | Review Eunjoo's PRs | Major integration decisions |
| Final Integration | Backend fixes and verification | Frontend fixes and verification | Final runnable MVP |
| Milestone Tag / Final Check | Participate | Participate | Confirm final commit and `milestone-1` tag |

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
