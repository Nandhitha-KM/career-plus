# 💼 Career Plus — Job & Internship Application Tracker

[![React](https://img.shields.io/badge/Frontend-React%2018-blue.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38bdf8.svg)](https://tailwindcss.com/)
[![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot%203.2-green.svg)](https://spring.io/projects/spring-boot)
[![Spring Cloud Gateway](https://img.shields.io/badge/Gateway-Spring%20Cloud%20Gateway-brightgreen.svg)](https://spring.io/projects/spring-cloud-gateway)
[![SQLite](https://img.shields.io/badge/Database-SQLite-003B57.svg)](https://www.sqlite.org/)
[![License](https://img.shields.io/badge/License-MIT-amber.svg)](LICENSE)

An enterprise-grade, microservice-powered job and internship application tracking platform built for software engineering candidates and job seekers. Features an interactive drag-and-drop Kanban board, intelligent priority engine, automated 5-step application wizard, recruiter follow-up workspace, and real-time analytics.

---

## 🌟 Key Features

- 📂 **Interactive Kanban Board**: Visualize and manage job applications across pipeline stages (`Applied` → `Interviewing` → `Offered` → `Rejected`).
- ⚡ **5-Step Sequential Wizard**: Rapid application registration with company details, CTC bands, recruiter contacts, and resume selection.
- 🔔 **Recruiter Follow-up Workspace**: Spotlight cards highlighting inactive applications ($>7$ days) with distinct attention styling.
- 📅 **Today's Actions List**: Urgency-grouped task management with instant popups for follow-ups and interview preparation notes.
- 📊 **Analytics & Conversion Funnel**: Real-time pipeline metrics, conversion rates, and offer win rate visualization.
- 🔐 **Persistent JWT & Google OAuth 2.0**: Seamless authentication with persistent candidate sessions across browser refreshes.
- 🏛️ **Microservice Architecture**: Scalable, decoupled Spring Boot services unified behind a central Spring Cloud API Gateway.

---

## 🏛️ System Architecture

```text
               React Frontend (Port 3000 / 3001)
                               │
                               ▼
                 API Gateway (Port 8080)
                 "Central Single Entry Point"
                               │
        ┌──────────────────────┴──────────────────────┐
        │ FORWARDS INTERNALLY TO:                     │ FORWARDS INTERNALLY TO:
        ▼                                             ▼
┌─────────────────────────┐                 ┌─────────────────────────┐
│  Auth Service           │                 │  Application Service    │
│  Port 8081              │                 │  Port 8082              │
│  - Signup & Login       │                 │  - Applications & Cards │
│  - Password Reset       │                 │  - Today's Actions      │
│  - Google OAuth 2.0     │                 │  - Priority Engine      │
│  - SQLite (auth.db)     │                 │  - Analytics Insights   │
└─────────────────────────┘                 │  - SQLite (app.db)      │
                                            └─────────────────────────┘
```

---

## 🛠️ Technology Stack

### **Frontend**
- **Framework**: React.js 18 (Vite)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Native Fetch API with `apiService.js` abstraction

### **Backend (Microservices)**
- **Framework**: Java 17/25, Spring Boot 3.2.3
- **Gateway**: Spring Cloud Gateway 4.1.0 (Reactive Netty)
- **Security**: Spring Security, JWT (JSON Web Tokens), BCrypt Password Encoder
- **Database**: SQLite Relational Engine via Spring Data JPA & Hibernate
- **Build Tool**: Apache Maven

---

## 📂 Project Directory Structure

```text
Career-plus/
├── frontend/ (React App - Port 3000 / 3001)
│   ├── src/
│   │   ├── components/
│   │   │   ├── AddApplicationModal.jsx    # 5-Step Application Wizard
│   │   │   ├── AnalyticsView.jsx          # Conversion Funnel & Stat Cards
│   │   │   ├── ApplicationDetailModal.jsx # Card Details Drawer
│   │   │   ├── FollowUpNotesView.jsx      # Inactive Recruiter Alerts
│   │   │   ├── KanbanBoard.jsx            # Drag-and-Drop Pipeline Columns
│   │   │   ├── NavigationTabs.jsx         # 5-Module Tab Bar
│   │   │   └── TodaysActionsView.jsx      # Action Items & Prep Popups
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx            # Product Hero & Features Showcase
│   │   │   ├── LoginPage.jsx              # Candidate Login & Google OAuth
│   │   │   └── SignUpPage.jsx             # Candidate Registration
│   │   ├── services/
│   │   │   └── api.js                     # REST API Abstraction Layer
│   │   └── App.jsx                        # Main Application Workspace
│   └── package.json
│
└── backend/ (Spring Boot Microservices)
    ├── services/
    │   ├── api-gateway/ (Port 8080)
    │   │   ├── src/main/java/com/careerplus/gateway/
    │   │   │   ├── config/CorsConfig.java # Preflight CORS Interceptor
    │   │   │   └── ApiGatewayApplication.java
    │   │   └── src/main/resources/application.properties
    │   │
    │   ├── auth-service/ (Port 8081)
    │   │   ├── src/main/java/com/careerplus/auth/
    │   │   │   ├── controller/AuthController.java
    │   │   │   ├── model/User.java
    │   │   │   └── security/JwtTokenProvider.java
    │   │   └── src/main/resources/application.properties
    │   │
    │   └── application-service/ (Port 8082)
    │       ├── src/main/java/com/careerplus/app/
    │       │   ├── controller/ApplicationController.java
    │       │   ├── model/Application.java
    │       │   └── repository/ApplicationRepository.java
    │       └── src/main/resources/application.properties
    └── pom.xml
```

---

## 📡 REST API Documentation

All frontend requests route through **API Gateway (`http://localhost:8080`)**:

| Method | Endpoint | Microservice Destination | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Auth Service (**8081**) | Register new candidate account |
| `POST` | `/api/auth/login` | Auth Service (**8081**) | Authenticate candidate & issue JWT |
| `POST` | `/api/auth/google` | Auth Service (**8081**) | Authenticate via Google OAuth 2.0 |
| `GET` | `/api/applications` | Application Service (**8082**) | Fetch all job applications |
| `POST` | `/api/applications` | Application Service (**8082**) | Create new job application |
| `PUT` | `/api/applications/{id}` | Application Service (**8082**) | Update existing job application |
| `DELETE`| `/api/applications/{id}` | Application Service (**8082**) | Delete job application |
| `GET` | `/api/applications/actions/today` | Application Service (**8082**) | Fetch today's pending actions |
| `GET` | `/api/applications/analytics/insights` | Application Service (**8082**) | Fetch analytics pipeline metrics |
| `GET` | `/api/users/resumes` | Application Service (**8082**) | Fetch user profile resumes |

---

## 🚀 Getting Started & Setup Guide

### **Prerequisites**
- **Java**: JDK 17 or higher
- **Node.js**: v18.x or higher
- **IDE**: Spring Tools for Eclipse (STS) or IntelliJ IDEA

---

### **1. Launch Backend Microservices (STS / Eclipse)**

1. Open **Spring Tools for Eclipse (STS)**.
2. Import `backend` as existing Maven projects.
3. In **Boot Dashboard** (bottom left), start the 3 microservices in order:
   - Right-click **`auth-service`** $\rightarrow$ **Start ▶️** *(Port 8081)*
   - Right-click **`application-service`** $\rightarrow$ **Start ▶️** *(Port 8082)*
   - Right-click **`api-gateway`** $\rightarrow$ **Start ▶️** *(Port 8080)*

---

### **2. Launch Frontend Dev Server**

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

Open **`http://localhost:3000`** in your browser.

---

## 🛡️ Technical Engineering Highlights

- **Deduplicated CORS Engine**: Custom `@Order(Ordered.HIGHEST_PRECEDENCE)` reactive `CorsWebFilter` in API Gateway catching preflight `OPTIONS` calls and returning `200 OK` instantly.
- **Flexible JSON Deserializer**: Custom `@JsonSetter` in `Application.java` handling client-side string IDs (`job-1787727786433`) and date strings without `400 Bad Request` crashes.
- **Persistent Session State**: `localStorage` JWT token initialization ensuring candidates stay logged in across refreshes and tab navigations.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for details.

Developed with ❤️ for software engineering candidates and job seekers.
