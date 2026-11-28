# StudyFlow Milestone 3
## Windows Setup and Verification Guide for TA

This guide provides instructions for setting up, running, and verifying the StudyFlow application on Windows.

Docker Compose is the recommended setup method for Milestone 3 because it runs the frontend, backend, and PostgreSQL database together without requiring separate local installations of Node.js or PostgreSQL.

A manual Windows setup method is also provided for development, testing, and troubleshooting.

The manual Windows setup was previously verified using:

- Node.js v20.20.2
- npm 10.8.2
- PostgreSQL 18.6

The application consists of:

- React frontend
- Node.js / Express backend
- PostgreSQL database


## Docker Quick Start (Recommended for Milestone 3)

Docker Compose is the recommended method for running StudyFlow locally. It starts the React frontend, Express backend, and PostgreSQL 18 database without requiring separate local installations of Node.js or PostgreSQL.

### Prerequisites

Install Git for Windows and Docker Desktop with Docker Compose.

Make sure Docker Desktop is running before executing the commands below.

### Clone the Repository

Open Windows Command Prompt and run:

```cmd
git clone https://github.com/hihi0305/studyflow.git
cd studyflow
```

### Configure Environment Variables

Create a local environment file from the repository template:

```cmd
copy .env.example .env
notepad .env
```

Replace the placeholder values for `POSTGRES_PASSWORD` and `JWT_SECRET` with two different, securely generated secrets.

Do not commit `.env` to Git or share its contents.

### Build and Start StudyFlow

From the project root, run:

```cmd
docker compose up -d --build
```

Docker Compose builds and starts the frontend, backend, and PostgreSQL services.

On first initialization of a new PostgreSQL data volume, the four SQL migration files are executed automatically in filename order.

### Verify the Application

Check the running services:

```cmd
docker compose ps
```

PostgreSQL should report a healthy status.

Verify the backend through the Nginx reverse proxy:

```cmd
curl.exe http://localhost:8080/api/health
```

**PowerShell note:** On Windows PowerShell 5.1, `curl` is an alias for `Invoke-WebRequest`, which may display a security warning about script execution. Use `curl.exe` to invoke the actual curl executable and avoid this warning. This command also works in Windows Command Prompt.

Expected response:

```json
{"status":"ok","message":"StudyFlow API is running"}
```

Open the frontend in a web browser:

http://localhost:8080

Register a new account, log in, create a Course and an Academic Task, and confirm that the Dashboard displays the saved information.

### Stop and Restart

Stop the application while preserving database data:

```cmd
docker compose down
```

Restart the existing containers:

```cmd
docker compose up -d
```

The PostgreSQL named volume preserves application data across ordinary container recreation.

**Warning:** Do not run `docker compose down -v` unless you intentionally want to delete the database volume and its stored data.

### Alternative: Manual Windows Setup

The following sections describe how to install Node.js and PostgreSQL separately and run StudyFlow directly on Windows. This method is useful for development, automated testing, and troubleshooting.


## 1. Install Required Software

### 1.1 Install Git for Windows

Install Git for Windows using the standard Windows installer.

After installation, open Command Prompt and verify:

```cmd
git --version
```

A Git version number should be displayed.


### 1.2 Install Node.js

Install Node.js v20.20.2 for Windows.

npm is installed automatically with Node.js.

After installation, open a new Command Prompt and verify:

```cmd
node -v
npm -v
```

Expected verified versions:

```text
v20.20.2
10.8.2
```


### 1.3 Install PostgreSQL

Install PostgreSQL 18.6 for Windows.

During installation:

- Keep the PostgreSQL command-line tools installed.
- The default PostgreSQL user is normally `postgres`.
- Create and remember the password for the `postgres` user.
- Keep the default port `5432` unless another port is required.

After installation, verify PostgreSQL from Command Prompt:

```cmd
"C:\Program Files\PostgreSQL\18\bin\psql.exe" --version
```

The installed PostgreSQL version should be displayed.

If PostgreSQL was installed in a different location, adjust the path accordingly.


## 2. Clone the StudyFlow Repository

Open Command Prompt.

Move to a location where the project should be stored. For example:

```cmd
cd %USERPROFILE%\Desktop
```

Clone the repository using the GitHub repository URL provided with the submission:

```cmd
git clone <repository-url>
```

Enter the project directory:

```cmd
cd studyflow
```

The project should contain:

```text
studyflow
├── client
├── server
│   └── migrations
├── docs
└── README.md
```


## 3. Create the PostgreSQL Database

From Command Prompt, run:

```cmd
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -p 5432 -c "CREATE DATABASE studyflow;"
```

Enter the PostgreSQL password created during installation when prompted.

If the database is created successfully, PostgreSQL should report:

```text
CREATE DATABASE
```


## 4. Configure the Backend Environment

From the StudyFlow repository root:

```cmd
cd server
```

Create a local `.env` file from the provided `.env.example`:

```cmd
copy .env.example .env
```

Open the file:

```cmd
notepad .env
```

Configure it as follows:

```env
PORT=4000
DATABASE_URL=postgresql://postgres:YOUR_POSTGRES_PASSWORD@localhost:5432/studyflow
JWT_SECRET=replace_with_a_private_local_secret
```

Replace:

```text
YOUR_POSTGRES_PASSWORD
```

with the PostgreSQL password created during installation.

If the PostgreSQL password contains reserved URL characters such as `@`, `:`, `/`, or `#`, those characters may need to be URL-encoded in `DATABASE_URL`.

Save and close the file.


## 5. Install Backend Dependencies

While still inside the `server` directory, run:

```cmd
npm install
```

This installs the backend dependencies defined in `server/package.json`.


## 6. Apply Database Migrations

From the `server` directory, apply the migration files in this exact order:

```cmd
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -p 5432 -d studyflow -f migrations\001_create_users.sql
```

```cmd
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -p 5432 -d studyflow -f migrations\002_create_courses.sql
```

```cmd
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -p 5432 -d studyflow -f migrations\003_create_academic_tasks.sql
```

```cmd
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -p 5432 -d studyflow -f migrations\004_rename_course_name_to_course_number.sql
```

Enter the PostgreSQL password when prompted.

The migrations create the tables required for:

- users
- courses
- academic tasks

and align the Course schema with the final `courseNumber` model.

No additional database migration is required for the current Milestone 2 Task Attention Level and password-validation changes because these features do not modify the database schema.


## 7. Start the Backend

From the `server` directory:

```cmd
npm run dev
```

Keep this Command Prompt window open.

The backend uses port `4000` when the provided environment configuration is used.

The backend may also be started with:

```cmd
npm start
```


## 8. Run Backend Automated Tests

StudyFlow uses a separate PostgreSQL test database for backend integration testing. Do not run integration tests against the regular `studyflow` development database because the tests may create or delete records.

### 8.1 Create the Test Database

Open Command Prompt and run:

```cmd
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -p 5432 -c "CREATE DATABASE studyflow_test;"
```

Enter your PostgreSQL password when prompted.

### 8.2 Apply Test Database Migrations

Navigate to the `server` directory and apply the four migrations in order:

```cmd
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -p 5432 -d studyflow_test -v ON_ERROR_STOP=1 -f migrations\001_create_users.sql
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -p 5432 -d studyflow_test -v ON_ERROR_STOP=1 -f migrations\002_create_courses.sql
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -p 5432 -d studyflow_test -v ON_ERROR_STOP=1 -f migrations\003_create_academic_tasks.sql
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -p 5432 -d studyflow_test -v ON_ERROR_STOP=1 -f migrations\004_rename_course_name_to_course_number.sql
```

Each migration should complete successfully before proceeding to the next.

### 8.3 Configure the Test Environment

Create a separate `server/.env.test` file:

```cmd
notepad .env.test
```

Add the following settings:

```dotenv
DATABASE_URL=postgresql://postgres:YOUR_POSTGRES_PASSWORD@localhost:5432/studyflow_test
JWT_SECRET=replace_with_a_private_test_secret
```

Replace the placeholder password with the actual local PostgreSQL password. If the password contains reserved URL characters, URL-encode those characters in the database connection string.

Keep `.env.test` private and do not commit it to Git.

### 8.4 Run Automated Tests and Coverage

From the `server` directory, run:

```cmd
set "DATABASE_URL="
npm run lint
npm test
npm run test:coverage
```

Clearing `DATABASE_URL` in the current Command Prompt prevents an existing shell variable from overriding the test connection configured in `.env.test`.

The backend test suite includes API integration tests, password-validation tests, and Task Attention Level unit tests.

During Milestone 3 local verification, all 17 automated tests passed with zero failures. The coverage report is printed in the terminal.

A passing test run should report zero failures. Coverage percentages may change as source code and tests are updated.

If a PostgreSQL authentication error occurs, verify the test database, `.env.test` file, password, port, and connection string before rerunning the tests.


## 9. Install and Start the Frontend

Open a second Command Prompt window.

Navigate to the StudyFlow client directory:

```cmd
cd %USERPROFILE%\Desktop\studyflow\client
```

If the repository was cloned somewhere else, adjust the path.

Install frontend dependencies:

```cmd
npm install
```

Start the frontend:

```cmd
npm run dev
```

Vite will display a local browser address in the terminal.

Open the `Local` address shown by Vite in a web browser.

Keep both the backend and frontend Command Prompt windows running.


### 9.1 Frontend Code Quality Verification

Milestone 3 introduces frontend ESLint and automated production build verification as part of the GitHub Actions CI pipeline.

From the `client` directory, run:

```cmd
npm run lint
npm run build
```

Both commands should complete successfully without errors.

The lint command checks JavaScript and React Hooks rules. The build command verifies that Vite can produce the production frontend assets.

These checks also run automatically in GitHub Actions for Pull Requests targeting `main`.


## 10. Seed Data and Demonstration Account

No database seed script is required for the current StudyFlow application.

No shared demonstration account is required.

Create a new user through the StudyFlow registration page and create sample Course and Academic Task data through the application.


## 11. TA Verification Workflow

Verify the core StudyFlow functionality using the following steps:

1. Register a new user account.
2. Confirm that weak passwords that do not satisfy the password requirements are rejected.
3. Register successfully using a password that satisfies all displayed password requirements.
4. Log in with the new account.
5. Confirm that authenticated pages are accessible.
6. Confirm that protected pages cannot be accessed after logout.
7. Create a Course, for example `CS 415`.
8. Edit the Course and confirm that the updated course number is displayed.
9. Create an Academic Task with:
   - title
   - due date
   - task type
   - priority
   - estimated hours
   - progress
   - status
10. Optionally associate the Academic Task with the Course.
11. Confirm that the active task displays its calculated Task Attention Level.
12. Edit the Academic Task and update its progress and status.
13. Set progress between 1% and 99% while the task is still Not Started and confirm that the task is normalized to In Progress.
14. Mark the task as Completed and confirm that progress is normalized to 100%.
15. Open the Dashboard and confirm that Total, Active, and Completed task summaries reflect the saved data.
16. Refresh the browser and confirm that the data persists.
17. Log out.
18. Log in again and confirm that the saved Course and Academic Task data is still available.
19. Run the backend automated tests with `npm test`.
20. Generate the backend coverage report with `npm run test:coverage`.
21. Confirm that the application remains usable at representative desktop, medium-width, and mobile browser viewport sizes.
22. Delete the Academic Task and Course and confirm that the interface updates correctly.


## 12. Expected Application Behavior

The following functionality should operate successfully:

- User registration
- Strong password validation
- Login and logout
- Protected routes
- User-specific data ownership
- Course CRUD
- Academic Task CRUD
- Optional Course association
- Task progress and status synchronization
- Completed task normalization to 100%
- Dashboard summary updates
- Task Attention Level calculation
- Backend automated unit and integration tests
- Backend coverage generation
- Authentication, authorization, and input-validation controls
- PostgreSQL persistence
- Persistence after refresh and re-login
- Responsive browser interface across representative viewport sizes
- Task Attention Level visualization
- Consistent Task Attention Level results across Dashboard and Academic Tasks
- Attention-based Dashboard ordering
- Task search and filtering
- Improved task progress visualization


## 13. Common Windows Setup Problems

### Backend tests fail to run

Confirm that:

- Backend dependencies were installed with `npm install`.
- The command is being run from the `server` directory.
- The installed Node.js version matches the verified project version.


### `git` is not recognized

Close and reopen Command Prompt after installing Git.

Then run:

```cmd
git --version
```


### `node` or `npm` is not recognized

Close and reopen Command Prompt after installing Node.js.

Then run:

```cmd
node -v
npm -v
```


### `psql` is not recognized

Use the full PostgreSQL path:

```cmd
"C:\Program Files\PostgreSQL\18\bin\psql.exe"
```

If PostgreSQL was installed in another directory, adjust the path.


### Database connection fails

Confirm that:

- PostgreSQL is running.
- The username is `postgres`, unless changed during installation.
- The password in `DATABASE_URL` matches the PostgreSQL password.
- The port is `5432`, unless another port was selected.
- The `studyflow` database exists.


### Backend cannot start

Confirm that:

- `server/.env` exists.
- `PORT` is defined.
- `DATABASE_URL` is correct.
- `JWT_SECRET` is defined.
- `npm install` completed successfully.
- All four migrations were applied.


### Frontend cannot connect to backend

Confirm that:

- The backend terminal is still running.
- The backend started without an error.
- The frontend terminal is also running.
- The `.env` configuration is correct.
