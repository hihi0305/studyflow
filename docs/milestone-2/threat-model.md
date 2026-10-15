# StudyFlow Milestone 2 Threat Model

## 1. Purpose and Scope

This threat model identifies security-relevant assets, trust boundaries, attack surfaces, threats, and existing protections in the StudyFlow Milestone 2 application.

The analysis focuses on the current StudyFlow architecture and implemented functionality, including user registration and login, JWT-based authentication, Course management, Academic Task management, user-specific data access, and PostgreSQL persistence.

The purpose of this document is to identify realistic security risks within the current project scope and connect those risks to implemented controls and verification activities. It is not intended to represent a complete production security assessment.

## 2. System Overview

StudyFlow uses a client-server architecture consisting of:

- A React frontend that provides the user interface
- An Express backend that exposes application API endpoints
- A PostgreSQL database that stores users, Courses, and Academic Tasks
- JWT-based authentication for protected application requests
- bcrypt-based password hashing for stored user credentials

Users interact with the React frontend to register, log in, and manage academic information. The frontend communicates with the Express API, and the backend performs authentication, authorization, business logic, and database operations.

Milestone 2 also introduces stronger password validation as an additional security control.

## 3. Assets

The primary assets that require protection are:

### 3.1 User Accounts

User account identities and authentication access must be protected from unauthorized use.

### 3.2 Passwords and Password Hashes

Plaintext passwords must not be stored in the database. Stored password hashes must remain protected from unauthorized disclosure.

### 3.3 Authentication Tokens

JWT access tokens represent authenticated sessions and must not be accepted if they are missing, invalid, or otherwise unauthorized.

### 3.4 Course Data

Each user's Course records must remain accessible only to the appropriate authenticated user.

### 3.5 Academic Task Data

Academic Tasks contain user-specific information including course association, due date, priority, estimated hours, progress, and status. This data must remain isolated between users.

### 3.6 Database Integrity

Application data should not be modified through unauthorized requests or malformed database queries.

### 3.7 Application Secrets and Configuration

Sensitive configuration values, including the JWT secret and database credentials, must not be exposed to application users or committed as public application data.

## 4. Trust Boundaries

### 4.1 User / Browser → React Frontend

Input originating from the user cannot automatically be considered trusted. Form data must be validated before it is relied upon by the application.

### 4.2 React Frontend → Express API

Requests reaching the backend cannot be trusted only because they originated from the StudyFlow frontend. An attacker may send API requests directly without using the frontend.

Therefore, security-sensitive validation and authentication must also be enforced by the backend.

### 4.3 Express API → PostgreSQL Database

The backend is responsible for translating application requests into database operations. Database queries must be constructed safely and must enforce user-specific data access.

### 4.4 Authenticated Identity → User-Owned Resources

Authentication identifies the requesting user, but authorization must additionally ensure that the authenticated user can access only their own Courses and Academic Tasks.

## 5. Attack Surfaces

The primary StudyFlow attack surfaces include:

- User registration endpoint
- Login endpoint
- JWT-protected API endpoints
- Course CRUD endpoints
- Academic Task CRUD endpoints
- User-supplied form and API data
- Authentication-token processing
- Database queries
- Environment and configuration values

## 6. Threat Analysis

| Threat | Asset Affected | Attack Surface | Potential Impact | Existing Mitigation | Verification / Remaining Work |
|---|---|---|---|---|---|
| Unauthenticated API access | Course and Academic Task data | Protected API routes | An unauthenticated user could access or modify private academic data | Course and Task routers apply JWT authentication middleware before protected route handling | Requests without a token and with an invalid token returned HTTP 401 |
| Cross-user Course access | Course data | Course GET, PUT, and DELETE endpoints | One authenticated user could read, modify, or delete another user's Course data | Course queries are restricted using the authenticated `req.userId`; update and delete operations require both the resource ID and matching user ID | Cross-user Course update attempt returned HTTP 404 |
| Cross-user Task access | Academic Task data | Task GET, PUT, and DELETE endpoints | One user could view or modify another user's tasks | Task retrieval is filtered by `t.user_id`; update and delete operations require both task ID and authenticated user ID | Cross-user Task update and delete attempts returned HTTP 404 |
| Unauthorized Course association | Course and Task data | Task create/update endpoints | A user could attempt to associate a task with another user's Course | Tasks may exist without a Course, but when a Course ID is provided, `userOwnsCourse()` verifies that the Course belongs to the authenticated user | Cross-user Course association attempt returned HTTP 400 |
| Weak password registration | User account | Registration endpoint | Weak credentials could make an account easier to compromise | Milestone 2 adds backend password-strength validation before password hashing and account creation; passwords are stored using bcrypt hashes | Weak-password API tests completed; frontend validation and final end-to-end verification remain |
| Password disclosure in storage | Password credentials | Registration/database | Plaintext passwords could be exposed if stored directly | StudyFlow hashes passwords with bcrypt before inserting user records into the database | Review registration implementation and verify login still succeeds using bcrypt comparison |
| Invalid or expired JWT | Authentication session | Authorization header | Forged, malformed, or expired tokens could be used to impersonate a user | The authentication middleware verifies JWTs using `jwt.verify()` and returns HTTP 401 when verification fails | Test missing, invalid, and expired tokens |
| SQL injection | Database integrity and confidentiality | User-controlled API inputs | Crafted input could alter the intended SQL query or expose application data | Current Course and Task database operations use PostgreSQL parameter placeholders such as `$1`, `$2`, and parameter arrays rather than concatenating user input into SQL strings | Review remaining database routes for consistent parameterized-query usage |
| Malformed task input | Academic Task integrity | Task create/update endpoints | Invalid progress, status, due date, hours, or Course IDs could create inconsistent application data | Backend validation checks required title, due date, progress range, valid status values, estimated hours, and Course ownership | Add representative invalid-input verification to Milestone 2 security testing |
| Malformed Course input | Course data integrity | Course create/update endpoints | Invalid Course values or resource IDs could create or modify invalid data | Backend verifies non-empty Course numbers and valid positive integer Course IDs | Verify invalid IDs and empty Course numbers are rejected |
| Exposure of application secrets | JWT signing secret and database credentials | Environment/configuration | Disclosure could allow database access or token forgery | Database connection information is read from `DATABASE_URL`, and JWT verification uses `JWT_SECRET` from environment configuration | Verify documentation and repository configuration do not expose actual secret values |
| Excessive internal error disclosure | Application/server information | API error handling | Detailed implementation information could assist an attacker | Current API responses generally return generic user-facing error messages while detailed errors are logged server-side | Review remaining routes for consistent error handling |

## 7. Existing Security Controls

### 7.1 JWT Authentication

Protected Course and Academic Task routes use a shared authentication middleware.

The middleware requires an `Authorization` header using the Bearer token format. The JWT is verified using the server's configured JWT secret. If the token is missing, invalid, or expired, the request is rejected with HTTP 401.

After successful verification, the authenticated user's identifier is stored in `req.userId` and is used by protected routes when accessing user-specific resources.

### 7.2 Resource Ownership and User Data Isolation

Authentication alone is not sufficient to protect StudyFlow data. Course and Academic Task operations also restrict database access using the authenticated user ID.

Course retrieval selects records only when `user_id` matches `req.userId`. Course update and delete operations similarly require both the requested Course ID and the authenticated user's ID.

Academic Task retrieval is filtered by the authenticated user's ID. Task update and delete operations also require the task to belong to the authenticated user.

When a task includes a Course association, StudyFlow verifies that the selected Course belongs to the current authenticated user before allowing the task to be created or updated. Tasks without an associated Course remain valid.

These checks reduce the risk of one authenticated user accessing or modifying another user's academic records.

### 7.3 Parameterized Database Queries

StudyFlow uses PostgreSQL parameterized queries for the reviewed Course and Academic Task operations.

User-controlled values are passed separately through parameter arrays using placeholders such as `$1`, `$2`, and `$3` rather than being directly concatenated into SQL strings.

This design reduces the risk of SQL injection through the reviewed database operations.

### 7.4 Password Protection

StudyFlow does not store plaintext passwords. Registration hashes passwords using bcrypt before account creation, and login verifies credentials using bcrypt comparison.

Milestone 2 strengthens this control by adding backend password validation requiring:

- At least 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

The password-strength requirements are enforced by the backend before password hashing and account creation, preventing direct API requests from bypassing the security rule.

### 7.5 Backend Input Validation

The backend performs validation independently of the frontend.

Examples include:

- Required Course number validation
- Positive integer Course ID validation
- Required task title
- Valid task due date
- Progress limited to integers from 0 through 100
- Restricted task status values
- Non-negative estimated work hours
- Verification that referenced Courses belong to the authenticated user

Backend enforcement is important because a malicious or modified client can bypass normal frontend validation.

### 7.6 Environment-Based Configuration

The PostgreSQL connection uses `DATABASE_URL` from the application environment rather than a hard-coded database connection string in the reviewed database module.

JWT authentication similarly relies on the server's configured `JWT_SECRET`.

The threat model does not assume that environment configuration alone guarantees secrecy. Repository and setup documentation should also be reviewed to ensure real secret values are not exposed.

## 8. Remaining Risks and Planned Verification

The following security verification has already been completed:

- Protected endpoint request without authentication was rejected with HTTP 401.
- Invalid authentication token was rejected with HTTP 401.
- Cross-user Course update attempt was rejected with HTTP 404.
- Cross-user Academic Task update attempt was rejected with HTTP 404.
- Cross-user Academic Task delete attempt was rejected with HTTP 404.
- Attempt to associate a task with another user's Course was rejected with HTTP 400.
- Weak-password registration was rejected by the backend.
- A valid password was accepted and the new account successfully logged in.

Remaining Milestone 2 security work includes:

1. Preserve sanitized evidence for the completed authentication and authorization tests.
2. Add representative invalid-input verification where useful.
3. Complete the relevant OWASP Top 10 review.
4. Review environment/setup documentation to ensure real secret values are not exposed.
5. Complete frontend password-validation integration and final end-to-end verification.

## 9. Conclusion

The StudyFlow Milestone 2 threat model identifies authentication, authorization, user-data isolation, credential security, input handling, SQL query safety, token handling, and configuration secrecy as the primary security concerns for the current application.

The reviewed implementation already includes several protections, including JWT authentication, user-specific database filtering, Course ownership verification, parameterized PostgreSQL queries, bcrypt password hashing, backend input validation, and Milestone 2 stronger password requirements.

The remaining Milestone 2 security work will focus on verifying these controls through direct security tests, completing the relevant OWASP Top 10 review, preserving before-and-after security evidence, and documenting any remaining risks.

## Verification Evidence

- Stronger Password Validation: [Issue #36](https://github.com/hihi0305/studyflow/issues/36)
- Password Validation Implementation and Automated Tests: [PR #37](https://github.com/hihi0305/studyflow/pull/37)
- Threat Model Tracking: [Issue #38](https://github.com/hihi0305/studyflow/issues/38)
- Threat Model Peer Review: [PR #39](https://github.com/hihi0305/studyflow/pull/39)
