# ESCOMVoting

ESCOMVoting is an end-to-end electronic voting platform with anonymous ballot signing, public urn verification, and weighted election results.

The project is split into:
- `escomvoting`: frontend app (React + TypeScript + Vite)
- `escomvoting-backend`: backend API (Spring Boot + PostgreSQL + Flyway)
- `testing`: sample data files (for example, user import CSV)

## What It Does

- Authenticated voting flow for students, professors, and admins.
- Blind-signature based ballot issuance and anonymous vote submission.
- Public urn inspection page with per-ballot signature verification.
- Public election history and paginated public results.
- Admin tools to create elections, manage lifecycle, and import users.
- Weighted tally support by voter groups.

## Tech Stack

Frontend:
- React 19
- TypeScript
- Vite (dev server on port `44100`)
- React Router
- Framer Motion

Backend:
- Java 21
- Spring Boot 4
- Spring Security + JWT
- Spring Data JPA + Flyway
- PostgreSQL
- Bouncy Castle for cryptography

## Local Development

### 1. Start PostgreSQL

From repository root:

```bash
docker compose up -d
```

This starts PostgreSQL with:
- DB: `escomvoting`
- User: `escom`
- Password: `escom`
- Port: `5432`

### 2. Configure backend environment

Create backend env file from template:

```bash
cp escomvoting-backend/.env.example escomvoting-backend/.env
```

Generate secure secrets and place them in `escomvoting-backend/.env`:

```bash
openssl rand -hex 32
```

Required variables:
- `APP_JWT_SECRET`
- `APP_CRYPTO_ELECTION_KEY_SECRET`
- `APP_DB_URL`
- `APP_DB_USERNAME`
- `APP_DB_PASSWORD`

### 3. Run backend

```bash
cd escomvoting-backend
./gradlew bootRun
```

Backend runs on:
- `http://localhost:8080`

### 4. Run frontend

In a second terminal:

```bash
cd escomvoting
npm install
npm run dev
```

Frontend runs on:
- `http://localhost:44100`

## Default Admin Bootstrap

On backend startup, an admin user is auto-created if missing (configured in `application.properties`):
- Institutional ID: `ADMIN-0001`
- Email: `admin@escom.ipn.mx`
- Password: `Admin1234!`

Change these defaults before production use.

## Main Public Pages

- `/` home page
- `/past-elections` past closed/tallied elections (paginated)
- `/elections/:id/results` public election results (paginated)
- `/elections/:id/urn` public urn viewer

## Main Authenticated Areas

- `/login` authentication
- `/elections` voter elections list
- `/elections/:id` vote detail and vote flow
- `/admin` admin dashboard
- `/admin/elections` admin election management
- `/admin/users` admin user management

## Useful Commands

Frontend (`escomvoting`):

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

Backend (`escomvoting-backend`):

```bash
./gradlew bootRun
./gradlew test
./gradlew build
```

## Sample Data

A sample CSV for user import is available at:
- `testing/users.csv`

## Notes

- Database schema is versioned with Flyway migrations under `escomvoting-backend/src/main/resources/db/migration`.
- CORS is configured for frontend dev origin `http://localhost:44100`.
- Keep `.env` secrets out of version control.
