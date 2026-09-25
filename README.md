<div align="center">
  <h1>🚀 Career Plus</h1>
  <p><strong>A comprehensive, full-stack career and job application management platform.</strong></p>

  <!-- Badges -->
  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Spring_Boot-F2F4F9?style=for-the-badge&logo=spring-boot" alt="Spring Boot" />
    <img src="https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java" />
    <img src="https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite" />
  </p>
</div>

<br />

## 📑 Table of Contents
- [About the Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation & Setup](#installation--setup)
  - [Environment Variables](#environment-variables)
- [Usage](#-usage)
- [License](#-license)

---

## 📖 About the Project

**Career Plus** is a modern, high-performance application built to streamline the job hunt process. Instead of losing track of applications in spreadsheets, Career Plus offers a centralized dashboard to track job statuses, manage resumes, track follow-ups, and get smart analytics on your application success rates.

---

## ✨ Key Features

- **📊 Kanban Application Tracking**: Intuitive drag-and-drop board to track the lifecycle of your job applications.
- **🤖 AI Role Matcher**: Leverage smart tools to match your resume against potential job descriptions.
- **📈 Advanced Analytics**: View visual breakdowns of your job search progress, interview conversion rates, and more.
- **🚨 Priority Engine**: Smart prioritization algorithms that highlight urgent tasks or upcoming interviews.
- **📝 Follow-Up & Notes System**: Integrated note-taking capabilities tied directly to specific job applications.
- **🔐 Secure Authentication**: JWT-based security integrated with Firebase and a robust Spring Boot backend.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React.js (via Vite)
- **Styling**: Tailwind CSS
- **Integrations**: Firebase (Auth/Firestore)

### Backend
- **Framework**: Spring Boot (Java 17+)
- **Database**: SQLite (Development) / Easily scalable to PostgreSQL/MySQL
- **Security**: Spring Security & JWT Token Verification

---

## 🏗 Project Architecture

The repository is structured as a monorepo containing two decoupled micro-services:

```text
career-plus/
├── backend/                  # Java/Spring Boot API Server
│   ├── src/main/java/        # Controllers, Services, Repositories, Security Config
│   └── src/main/resources/   # application.properties
└── frontend/                 # React/Vite Client
    ├── src/components/       # Reusable UI components
    ├── src/pages/            # Main application views
    └── src/services/         # API integration and Firebase config
```

---

## 🚀 Getting Started

Follow these instructions to set up the project locally for development and testing.

### Prerequisites

Ensure you have the following installed on your local machine:
- **Node.js** (v16.0 or higher)
- **npm** or **yarn**
- **Java JDK** (v17 or higher)
- **Maven** (Optional, project includes `mvnw` wrapper)

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Nandhitha-KM/career-plus.git
   cd career-plus
   ```

2. **Setup the Backend**
   ```bash
   cd backend
   # Start the Spring Boot server
   ./mvnw spring-boot:run
   ```
   *The backend server will run on `http://localhost:8080`*

3. **Setup the Frontend**
   ```bash
   # Open a new terminal window
   cd frontend
   npm install
   # Start the Vite development server
   npm run dev
   ```
   *The frontend client will run on `http://localhost:5173`*

---

## 🔐 Environment Variables

For security reasons, API keys and secrets are not committed to version control. You must create `.env` files locally in both the `frontend` and `backend` directories.

### Backend (`/backend/.env`)
Create a `.env` file at the root of the `backend` folder:
| Variable | Description |
| :--- | :--- |
| `JWT_SECRET` | A secure, randomly generated string used to sign JWT tokens. |

### Frontend (`/frontend/.env`)
Create a `.env` file at the root of the `frontend` folder:
| Variable | Description |
| :--- | :--- |
| `VITE_FIREBASE_API_KEY` | Your Firebase Web API Key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Authentication Domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase App ID |

---

## 💻 Usage

Once both servers are running, navigate to `http://localhost:5173` in your browser. 
1. **Register** a new account.
2. **Add a job application** to populate your Kanban board.
3. Track your progress through the **Analytics** tab.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

<br />
<div align="center">
  <i>Built with passion to empower job seekers everywhere.</i>
</div>
