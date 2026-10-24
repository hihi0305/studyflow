# Changelog

All notable changes to StudyFlow are documented in this file.

## Milestone 2 — In Progress

### Added

- Added Task Attention Level calculation and backend API integration
- Added Task Attention Level unit tests
- Added stronger backend password validation
- Added frontend password-requirement checklist and validation
- Added Milestone 2 threat model
- Added Milestone 2 QA plan
- Added OWASP Top 10 review
- Added Milestone 2 development workflow documentation

### Changed

- Improved Dashboard task information visibility
- Updated StudyFlow logo navigation to route correctly to the Dashboard
- Strengthened registration password requirements

### Fixed

- Fixed missing Course information on Dashboard task cards
- Fixed missing user-defined priority display on Dashboard task cards
- Fixed missing progress display on Dashboard task cards
- Fixed incorrect StudyFlow logo navigation behavior

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

### Remaining Milestone 2 Work

- Task Attention Level frontend visualization integration
- Search and filtering integration
- Improved progress visualization integration
- Optional additional cross-browser / cross-platform verification
- Final README and setup/verification synchronization after frontend integration
- Final regression testing
- Demo preparation
- Final contribution statements
- Second Milestone 2 checkpoint release
- Final `milestone-2` release tag
