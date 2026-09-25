# Career Plus

Career Plus is a full-stack application designed to help users track job applications, manage their career progression, and stay on top of priorities.

## Project Structure

This repository contains two main components:
- **frontend/**: The user interface, built with React and Vite.
- **backend/**: The server and API, built with Java and Spring Boot.

## Prerequisites
- Node.js (v16+)
- Java (JDK 17+)
- Maven

## Setup & Environment Variables

This project uses environment variables to secure sensitive information like API keys and database credentials. **Do not commit these files to version control.**

### Backend (`/backend`)
Create a `.env` file in the `backend/` directory or set the environment variables in your system:
```env
# Example backend environment variables
JWT_SECRET=your_super_secret_jwt_key_here
```

### Frontend (`/frontend`)
Create a `.env` file in the `frontend/` directory:
```env
# Example frontend environment variables (Vite requires the VITE_ prefix)
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Running the Application Locally

**Start the Backend:**
```bash
cd backend
./mvnw spring-boot:run
```

**Start the Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## License
MIT License
