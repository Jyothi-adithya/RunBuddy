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
- Configure backend environment variables (do not commit secrets):
	- `SPRING_DATASOURCE_URL`
	- `SPRING_DATASOURCE_USERNAME`
	- `SPRING_DATASOURCE_PASSWORD`
	- `JWT_SECRET`
	- `GOOGLE_MAPS_API_KEY`
	- `FIREBASE_SERVER_KEY`

Frontend:

- Create `frontend/.env` (not committed)
- Add required environment variables (do not commit secrets):
	- `REACT_APP_API_BASE_URL`
	- `REACT_APP_GOOGLE_MAPS_API_KEY`
	- `REACT_APP_FIREBASE_CONFIG`
	- `REACT_APP_FIREBASE_API_KEY`

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