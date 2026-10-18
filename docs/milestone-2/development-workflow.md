## Development Workflow

The general Milestone 2 workflow is:

1. Create or identify a GitHub Issue for the work unit
2. Update the local `main` branch
3. Create a short-lived branch for the scoped work
4. Implement the feature, fix, testing, security, or documentation work
5. Perform relevant local verification
6. Create descriptive commits
7. Push the branch and open a Pull Request
8. Request peer review
9. Address review feedback when necessary
10. Re-test affected functionality
11. Merge into `main`
12. Update or close the related Issue

## Branching Conventions

New branches should normally be created from the latest `main` branch.

Common branch prefixes include:

- `feature/` for new application features
- `fix/` for focused bug fixes
- `test/` for testing-related work
- `docs/` for documentation work
- `security/` for security-specific implementation work when appropriate

Examples used during Milestone 2 include:

- `feature/m2-task-attention`
- `feature/m2-password-validation`
- `docs/m2-threat-model`
- `docs/m2-qa-plan`
- `docs/m2-owasp-review`

Branches should remain focused on one related work unit whenever practical.

## Commit Conventions

Commits should represent one meaningful change whenever practical and use concise, descriptive messages.

Common commit prefixes include:

- `feat:` for new functionality
- `fix:` for bug fixes
- `test:` for automated testing changes
- `docs:` for documentation changes
- `refactor:` for internal restructuring without an intended behavior change
- `chore:` for maintenance work when appropriate

Examples from Milestone 2 include:

- `feat: add task attention level calculation`
- `test: add task attention level unit tests`
- `docs: add threat model verification evidence links`
- `docs: add Milestone 2 QA plan`
- `docs: add OWASP Top 10 review`

Unrelated changes should not be combined into the same commit when they can reasonably be separated.

## Pull Request Conventions

Significant Milestone 2 changes should be integrated through Pull Requests rather than directly into `main`.

Pull Requests should include, when applicable:

- Purpose of the change
- Summary of the implementation
- Related GitHub Issue
- Relevant testing or verification results
- Remaining limitations or follow-up work
- Peer-review request

## Peer Review

The team uses cross-review whenever practical.

- Eunjoo reviews Errin's frontend work
- Errin reviews Eunjoo's backend, testing, security, and documentation work

Peer review may include code or documentation inspection, automated test execution, local manual testing, requested corrections, re-testing, and final approval.

Review comments and approvals are preserved as Milestone 2 peer-review evidence.

## Merge Expectations

A Pull Request should normally be merged only after:

- The scoped work is complete
- Relevant verification has passed
- Requested changes have been addressed
- Peer review is complete

After merge:

- The local `main` branch is updated
- Related Issue checklists are updated
- The related Issue is closed when all acceptance criteria are satisfied
- Unrelated follow-up work is tracked separately

## Scope Discipline

Each Issue, branch, and Pull Request should remain focused on its defined work unit.

Unrelated features, UI changes, security changes, or refactors should not be added unless the scope is explicitly updated.

## Evidence Preservation

Important development and verification evidence is preserved through:

- GitHub Issues
- Issue comments
- Pull Request descriptions
- Review comments
- Approval comments
- Verification results
- Closing comments

Sensitive information such as passwords, authentication tokens, database credentials, and secret keys should not be preserved in submitted evidence.
