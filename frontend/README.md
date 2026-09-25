# 🚀 Career Plus — Job & Internship Application Tracker

**🌍 Live Project URL:** [http://35.222.239.2](http://35.222.239.2)

Career Plus is a full-stack, enterprise-grade web application designed to help engineering candidates organize, track, and analyze their job search process. Built with a Microservice Architecture, it replaces messy Excel sheets with a visual Kanban board, automated reminders, and real-time analytics.

---

## 🌟 Key Features
- **Interactive Kanban Board**: Visual drag-and-drop column tracking (`Applied` → `Interviewing` → `Offered` → `Rejected`).
- **Urgency Task Management**: "Today's Actions" highlighting inactive applications (>7 days) to prevent missed follow-ups.
- **Real-Time Analytics**: Conversion metrics, offer win rates, and stage distribution charts.
- **Secure Authentication**: BCrypt password hashing and JWT-based session management.
- **1-Click Google Login**: Integrated Google OAuth 2.0.

---

## 🏗️ System Architecture

This project is built using a decoupled **Microservices Architecture**:
- **Frontend Layer**: React.js 18, Vite, and Tailwind CSS.
- **API Gateway (Port 8080)**: Central Spring Cloud Gateway that routes and balances downstream traffic.
- **Auth Microservice (Port 8081)**: Manages user registration, login, JWT issuance, and OAuth.
- **Application Microservice (Port 8082)**: Manages core business logic, application CRUD, and priority engine calculations.
- **Database Layer**: Isolated SQLite databases per microservice (`auth_service.db` and `application_service.db`).

---

## ☁️ Cloud Deployment (Google Cloud & Docker)

This entire application is 100% containerized and deployed on a **Google Cloud Platform (GCP) Virtual Machine**.

- **Reverse Proxy**: The React frontend is served statically via Nginx on standard HTTP port 80.
- **Orchestration**: All services (Nginx, API Gateway, Auth Service, Application Service) are orchestrated using `docker-compose`.
- **Live URL**: [http://35.222.239.2](http://35.222.239.2)

### 🚀 How to Run in Production (GCP)
1. Upload the `fullstack-deploy.zip` file to your Ubuntu server.
2. Unzip the project:
   ```bash
   unzip fullstack-deploy.zip -d career-plus
   cd career-plus
   ```
3. Run Docker Compose:
   ```bash
   docker compose up -d --build
   ```
4. Access the live site at `http://35.222.239.2`

---

## 💻 Local Development Setup

If you want to run the project locally on your machine for development:

### Prerequisites
- Node.js (v18+)
- Java (JDK 21)
- Maven

### Frontend Setup
```bash
npm install
npm run dev
```
*(The frontend will start on `http://localhost:3000` or `3001`)*

### Backend Setup
Since it is a Maven Multi-Module project, you can build all services at once from the root of the backend directory:
```bash
mvn clean install
```
Then, manually run the generated `.jar` files or start them via your IDE (IntelliJ / Eclipse).

---

## 🛠️ Technology Stack
- **Frontend**: React.js, Tailwind CSS, Vite, Nginx
- **Backend**: Java 21, Spring Boot, Spring Security, Spring Cloud Gateway
- **Database**: SQLite
- **DevOps**: Docker, Docker Compose, Google Cloud Platform (GCP) Ubuntu VM

---

*Built with ❤️ for the Cognizant Hackathon.*
