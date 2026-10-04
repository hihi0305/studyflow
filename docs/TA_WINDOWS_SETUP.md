# StudyFlow Milestone 1
## Windows Setup and Verification Guide for TA

This guide assumes that Git, Node.js, npm, and PostgreSQL are not yet installed.

StudyFlow Milestone 1 was developed and verified using:

- Node.js v20.20.2
- npm 10.8.2
- PostgreSQL 18.6

The application consists of:

- React frontend
- Node.js / Express backend
- PostgreSQL database


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


## 8. Install and Start the Frontend

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


## 9. Seed Data and Demonstration Account

No database seed script is required for Milestone 1.

No shared demonstration account is required.

Create a new user through the StudyFlow registration page and create sample Course and Academic Task data through the application.


## 10. TA Verification Workflow

Verify the Milestone 1 MVP using the following workflow:

1. Register a new user account.
2. Log in with the new account.
3. Confirm that authenticated pages are accessible.
4. Confirm that protected pages cannot be accessed after logout.
5. Create a Course, for example `CS 415`.
6. Edit the Course and confirm that the updated course number is displayed.
7. Create an Academic Task with:
   - title
   - due date
   - task type
   - priority
   - estimated hours
   - progress
   - status
8. Optionally associate the Academic Task with the Course.
9. Edit the Academic Task and update its progress and status.
10. Set progress between 1% and 99% while the task is still Not Started and confirm that the task is normalized to In Progress.
11. Mark the task as Completed and confirm that progress is normalized to 100%.
12. Open the Dashboard and confirm that Total, Active, and Completed task summaries reflect the saved data.
13. Refresh the browser and confirm that the data persists.
14. Log out.
15. Log in again and confirm that the saved Course and Academic Task data is still available.
16. Delete the Academic Task and Course and confirm that the interface updates correctly.


## 11. Expected Milestone 1 Behavior

The following functionality should operate successfully:

- User registration
- Login and logout
- Protected routes
- User-specific data ownership
- Course CRUD
- Academic Task CRUD
- Optional Course association
- Task progress and status synchronization
- Completed task normalization to 100%
- Dashboard summary updates
- PostgreSQL persistence
- Persistence after refresh and re-login
- Responsive browser interface


## 12. Common Windows Setup Problems

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
