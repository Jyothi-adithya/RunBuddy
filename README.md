# RunBuddy

RunBuddy is a full-stack app for finding and managing running partners. It includes a Spring Boot backend, a React frontend, and MySQL scripts for schema and seed data.

## Tech stack

- Backend: Java, Spring Boot, Maven
- Frontend: React, Tailwind
- Database: MySQL
- Auth/Notifications: Firebase

## Project structure

- backend/ - Spring Boot API
- frontend/ - React app
- database/ - MySQL schema and seed scripts

## Prerequisites

- Java 17+
- Maven
- Node.js 18+ and npm
- MySQL 8+

## Environment setup

Backend:

- Create `backend/src/main/resources/firebase-service-account.json`
- Update `backend/src/main/resources/application.properties` for DB and Firebase settings

Frontend:

- Copy `frontend/.env.example` to `frontend/.env`
- Update environment variables as needed

## Run locally

Backend:

```bash
cd backend
mvn spring-boot:run
```

Frontend:

```bash
cd frontend
npm install
npm start
```

## Database

Use these scripts to create and seed the database:

- `database/schema_mysql.sql`
- `database/seed_mysql.sql`

## Tests

Backend:

```bash
cd backend
mvn test
```

Frontend:

```bash
cd frontend
npm test
```