# StudyFlow Milestone 2 Quality Assurance Plan

## 1. Purpose

This Quality Assurance plan defines how StudyFlow Milestone 2 functionality will be verified throughout development and before final submission.

The goal is to preserve the verified Milestone 1 workflow while confirming that new Milestone 2 features, testing improvements, security controls, and user-interface changes work correctly without introducing regressions.

QA activities are performed incrementally during development rather than only at the end of the milestone.

## 2. QA Goals

The Milestone 2 QA process should:

- Preserve the verified Milestone 1 workflow
- Verify all new Milestone 2 features
- Detect regressions after frontend and backend changes
- Confirm important user flows work end-to-end
- Verify security-sensitive behavior
- Preserve repeatable testing evidence
- Support final Milestone 2 verification and demonstration

## 3. Application Startup

Verify:

- Backend starts successfully
- Frontend starts successfully
- Database connection succeeds
- Application loads without blocking errors

## 4. Authentication

Verify:

- User registration works
- Valid login works
- Invalid login is rejected
- Logout works
- Protected routes require authentication
- Authenticated session behavior remains functional

## 5. Course Management

Verify:

- Course can be created
- Existing Courses load correctly
- Course can be edited
- Course can be deleted
- One user cannot access another user's Course data

## 6. Academic Task Management

Verify:

- Task can be created
- Existing tasks load correctly
- Task can be edited
- Task can be deleted
- Task data persists correctly
- One user cannot access another user's Task data

## 7. Dashboard and Progress

Verify:

- Dashboard loads the authenticated user's task data
- Task title displays correctly
- Associated Course displays correctly
- Tasks without a Course display correctly
- Due date displays correctly
- User-defined priority displays correctly
- Progress displays correctly
- Status displays correctly
- Progress can be updated
- Completed status results in 100% progress
- Dashboard reflects saved updates

## 8. Task Attention Level (TAL)

Verify:

- TAL calculation is returned for active tasks
- High Attention case is correct
- Medium Attention case is correct
- Low Attention case is correct
- Completed tasks are excluded from active TAL calculation
- Frontend TAL visualization matches the backend TAL result

## 9. Search and Filtering

Verify:

- Search returns expected matching tasks
- Non-matching tasks are excluded
- Supported filters behave correctly
- Search/filter state does not modify stored task data
- Clearing search/filter restores the expected task list

## 10. Improved Progress Visualization

Verify:

- Progress visualization matches stored progress
- 0% progress displays correctly
- Intermediate progress displays correctly
- 100% progress displays correctly
- Completed tasks display consistently
- Visualization remains readable at supported viewport sizes

## 11. Stronger Password Validation

Verify:

- Password requirements are clearly shown to the user
- Password shorter than the required length is rejected
- Password without an uppercase letter is rejected
- Password without a lowercase letter is rejected
- Password without a number is rejected
- Password without a special character is rejected
- Valid password is accepted
- Frontend validation matches backend validation
- Confirm-password validation remains functional
- Registration and login continue to work after the security change

## 12. Automated Testing

Verify:

- Unit tests run successfully
- Coverage command runs successfully
- Coverage results are preserved
- Coverage target is documented and justified
- Integration tests run successfully when added

## 13. Security Verification

Verify:

- Missing authentication token is rejected
- Invalid authentication token is rejected
- Cross-user Course access is blocked
- Cross-user Task access is blocked
- Unauthorized Course association is blocked
- Representative malformed input is rejected
- Stronger password validation is observable and testable

## 14. Cross-Viewport / Cross-Platform Verification

Verify:

- Desktop layout remains usable
- Mobile-width layout remains usable
- Dashboard remains readable
- TAL visualization remains readable
- Search/filter controls remain usable
- Progress visualization remains usable

## 15. Regression Verification

After significant Milestone 2 changes, re-check:

- Registration/login workflow
- Course CRUD
- Academic Task CRUD
- Data persistence
- User-data isolation
- Dashboard behavior
- Progress/status behavior
- Completed -> 100% normalization

A complete regression pass will also be performed before final Milestone 2 submission.

## 16. Evidence Preservation

Where applicable, preserve:

- GitHub Issue comments
- Pull Request review comments
- Automated test output
- Coverage output
- API responses
- Before-and-after screenshots
- Desktop/mobile screenshots
- Final verification checklist
- Relevant Issue, commit, and Pull Request references

## 17. QA Usage During Milestone 2

This QA plan is intended to be used throughout Milestone 2.

Individual feature work may use only the checklist areas relevant to that feature. After implementation or integration changes, the team should perform appropriate targeted regression testing.

Before final submission, the complete Milestone 2 workflow will be verified using this plan and the results will be recorded as final QA evidence.
