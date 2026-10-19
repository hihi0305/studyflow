## StudyFlow OWASP Review

### A01: Broken Access Control

**Relevance:** High

StudyFlow stores user-specific Course and Academic Task data. Unauthorized access to another user's resources would be a significant security issue.

**Existing Controls:**
- JWT authentication on protected routes
- User-specific database filtering using the authenticated user ID
- Course update/delete operations require both Course ID and authenticated user ID
- Task update/delete operations require both Task ID and authenticated user ID
- Course ownership is verified before associating a Course with a Task

**Verification:**
- Cross-user Course update attempt was rejected
- Cross-user Course delete attempt was rejected
- Cross-user Task update attempt was rejected
- Cross-user Task delete attempt was rejected
- Cross-user Course association was rejected

**Remaining Risk / Limitation:**
- Authorization checks should continue to be preserved as additional endpoints or features are added

---

### A02: Security Misconfiguration

**Relevance:** Moderate

StudyFlow depends on environment configuration for database access and JWT signing.

**Existing Controls:**
- Database connection uses `DATABASE_URL`
- JWT authentication uses `JWT_SECRET`
- Secrets are not intentionally hard-coded into reviewed application logic

**Verification / Remaining Work:**
- Review repository and setup documentation to ensure actual secret values are not committed
- Document required environment variables without exposing real credentials
- Continue using environment-based configuration for sensitive values

---

### A03: Software Supply Chain Failures

**Relevance:** Limited but applicable

StudyFlow depends on third-party Node.js packages and package-management infrastructure.

**Existing Controls / Current Practice:**
- Dependencies are declared through project package files
- Installed dependencies can be reproduced from the repository configuration

**Remaining Risk / Limitation:**
- Milestone 2 does not include a comprehensive software-supply-chain security program
- Dependency versions and known vulnerabilities should be reviewed as part of ongoing maintenance

---

### A04: Cryptographic Failures

**Relevance:** High

StudyFlow handles user passwords and authentication tokens.

**Existing Controls:**
- Plaintext passwords are not stored
- Passwords are hashed using bcrypt before account creation
- Login uses bcrypt comparison
- JWT signing uses a configured secret rather than storing authentication state as plaintext credentials

**Verification:**
- Valid registration and login were regression-tested after stronger password validation was added

**Remaining Risk / Limitation:**
- Production transport security and secret-management infrastructure are outside the current local-development milestone scope

---

### A05: Injection

**Relevance:** High

StudyFlow processes user-controlled values in PostgreSQL operations.

**Existing Controls:**
- Reviewed Course and Academic Task queries use PostgreSQL parameterized queries
- User input is passed through parameter arrays rather than directly concatenated into SQL strings

**Verification / Remaining Work:**
- Reviewed Course and Task routes use parameter placeholders
- Remaining database routes should continue to use the same pattern

---

### A06: Insecure Design

**Relevance:** High

Security problems can result from architectural decisions even when individual code statements are technically correct.

**Existing Controls:**
- Milestone 2 threat model identifies assets, trust boundaries, attack surfaces, threats, and mitigations
- Security-sensitive validation is enforced by the backend
- Authorization is separated from authentication
- Task Attention Level and other business logic are separated into reusable logic where appropriate
- QA and security verification are performed incrementally

**Verification:**
- Threat model was documented and peer reviewed
- Authentication, authorization, ownership, and validation controls were directly tested

**Remaining Risk / Limitation:**
- The threat model represents the current milestone scope and should be updated if the architecture changes

---

### A07: Authentication Failures

**Relevance:** High

StudyFlow provides registration, login, JWT-based authenticated access, and password handling.

**Existing Controls:**
- Passwords are hashed with bcrypt
- Invalid login attempts return authentication errors
- Protected routes require valid JWT authentication
- Milestone 2 introduces stronger backend password requirements
- Frontend communicates the same password requirements to users

**Verification:**
- Missing token returned HTTP 401
- Invalid token returned HTTP 401
- Valid authenticated request succeeded
- Weak password was rejected
- Valid registration and login succeeded

**Remaining Risk / Limitation:**
- Advanced production controls such as MFA, account lockout, and centralized session management are outside the current project scope

---

### A08: Software or Data Integrity Failures

**Relevance:** Moderate

StudyFlow relies on trusted application code, dependencies, and stored application data.

**Existing Controls:**
- User data modifications are restricted through authenticated and authorized API operations
- Validation is applied before important data updates

**Remaining Risk / Limitation:**
- Milestone 2 does not implement code signing, artifact signing, or a complete trusted deployment pipeline
- CI/CD integrity controls are deferred to later project work

---

### A09: Security Logging & Alerting Failures

**Relevance:** Moderate

Security-related failures should be observable enough to support troubleshooting and incident awareness.

**Existing Controls:**
- Server-side application errors are logged during backend failures
- User-facing API responses generally avoid exposing detailed internal implementation errors

**Remaining Risk / Limitation:**
- StudyFlow does not currently implement centralized security logging, alerting, or production monitoring
- These capabilities would be important in a production deployment

---

### A10: Mishandling of Exceptional Conditions

**Relevance:** High

StudyFlow receives malformed requests, invalid identifiers, invalid authentication tokens, and unexpected user input.

**Existing Controls:**
- Invalid Course IDs are rejected
- Missing Task titles are rejected
- Invalid due dates are rejected
- Progress outside 0–100 is rejected
- Invalid Task statuses are rejected
- Negative estimated hours are rejected
- Missing and invalid authentication tokens return controlled HTTP responses
- Backend routes use structured error responses

**Verification:**
Representative invalid-input and authentication tests were completed during Milestone 2 security verification.

**Remaining Risk / Limitation:**
- Error handling should remain consistent as new endpoints and features are introduced

## Overall Findings

The most directly relevant OWASP Top 10 categories for the current StudyFlow implementation are:

- A01 Broken Access Control
- A04 Cryptographic Failures
- A05 Injection
- A06 Insecure Design
- A07 Authentication Failures
- A10 Mishandling of Exceptional Conditions

A02, A03, A08, and A09 are also applicable, but several of their production-level controls extend beyond the current Milestone 2 scope.

The review does not claim complete OWASP Top 10 compliance. It documents how the current StudyFlow implementation relates to the OWASP risk categories and identifies remaining limitations that would require additional production security work.

## Evidence

Relevant evidence includes:

- StudyFlow Milestone 2 Threat Model
- Authentication, Authorization, and Input Validation verification issue
- Stronger Password Validation Issue #36
- Backend Password Validation PR #37
- Frontend Password Validation PR #43
- Milestone 2 QA Plan
