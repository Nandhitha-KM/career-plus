# 🎤 Career Plus — Architecture Slide Presentation Script (Word-for-Word)

> **Slide Title**: SOLUTION DESIGN — System architecture at a glance  
> **Presenter**: Sangavi S  
> **Goal**: Explain this architecture diagram confidently and clearly to hackathon judges.

---

## 🎯 1. How to Start Speaking (The Opening Hook - 15 Seconds)

> *"Thank you! Now moving on to the **System Architecture of Career Plus**.
>
> As shown in this diagram, our platform follows an enterprise-grade, 4-tier decoupled architecture separating the **React Frontend**, **Authentication Layer**, **Spring Boot Backend**, and **SQLite Database**."*

---

## 🏛️ 2. Section-by-Section Explanation (Word-for-Word Script)

### 🔹 Part A: The Frontend Layer (Left Box)
> *"Starting with the **Frontend Layer**:
> - We built a responsive Single Page Application using **React.js 18**, bundled with **Vite** and styled using **Tailwind CSS**.
> - For state management, we use React's **Context API**, `useState`, and `useEffect` hooks to manage candidate states cleanly.
> - The client stores user sessions and JWT tokens in **`localStorage`**.
> - The UI includes 8 key modules: Dashboard, Kanban Board, Applications, Calendar, Resumes, Analytics, Notes & Follow-ups, and Profile Settings."*

---

### 🔹 Part B: Authentication & External Services (Bottom Left & Middle)
> *"Moving to **Authentication & Security**:
> - When a user logs in or registers, **Spring Security** validates the credentials using **BCrypt Password Hashing**.
> - Upon successful login, a signed **JWT (JSON Web Token)** is generated and returned to the client.
> - For all subsequent API requests, the client attaches this JWT token in HTTP headers, which passes through our custom `JwtAuthenticationFilter`.
> - We also integrated **Google OAuth 2.0** for 1-click social login via External Services."*

---

### 🔹 Part C: The Backend Layer (Middle Box)
> *"In the **Spring Boot Backend**, we strictly follow the **Layered Architecture Pattern**:
> 1. **Controller Layer**: Handles incoming HTTP/HTTPS REST requests and returns JSON payloads.
> 2. **Service Layer**: Contains our core business logic, such as the **Priority Engine** calculations and inactivity rules.
> 3. **Repository Layer**: Built with **Spring Data JPA**, executing CRUD database operations without manual SQL queries.
> 4. **Entity Layer**: Defines Java JPA domain models mapped to database tables for Users, Applications, Resumes, Notes, and Follow-ups."*

---

### 🔹 Part D: Database & File Storage (Right Box)
> *"For data persistence:
> - We use **SQLite** as our relational database engine managed via **Hibernate ORM**. It provides lightweight, zero-config, single-file persistent storage.
> - Candidate resume attachments (.pdf, .docx) are handled safely via **Local File Storage**."*

---

### 🔹 Part E: End-to-End Data Flow (Bottom Bar - Summary)
> *"To summarize the entire flow from left to right:
> **User interacts with UI** $\rightarrow$ **Frontend sends REST API request** $\rightarrow$ **Spring Boot Backend processes business logic** $\rightarrow$ **Data is stored/fetched from SQLite** $\rightarrow$ **JSON response is returned to update the React UI in real time!**"*

---

## ❓ 3. Top 3 Questions Judges Will Ask on THIS Slide & Easy Answers

### Q1: *"Why did you choose Layered Architecture (Controller-Service-Repository) in Spring Boot?"*
- **Easy Answer**:  
  > *"Because it ensures **Separation of Concerns**. Controllers only handle HTTP requests, Services handle business logic, and Repositories handle database calls. This makes the code modular, easy to test, and easy to maintain."*

---

### Q2: *"Where and how is the JWT token stored and used?"*
- **Easy Answer**:  
  > *"The JWT token is stored in browser `localStorage`. On every REST API call, React attaches `Authorization: Bearer <JWT_Token>` in the HTTP headers, which Spring Security's `JwtAuthenticationFilter` validates before granting access."*

---

### Q3: *"Why did you use SQLite and Spring Data JPA together?"*
- **Easy Answer**:  
  > *"SQLite provides a lightweight, persistent single-file database. Spring Data JPA acts as an abstraction layer using Hibernate, allowing us to perform CRUD operations cleanly without writing raw SQL strings."*

---

## ⚡ Quick Cheat Sheet Cards (Keep in Mind)

| Layer | Technology | Key Role |
| :--- | :--- | :--- |
| **Frontend** | React 18 + Tailwind | Renders UI, handles state via `useState`/`useEffect` |
| **Auth** | Spring Security + JWT + BCrypt | Secures API endpoints & authenticates candidates |
| **Backend** | Spring Boot (Controller/Service/Repo) | Processes business logic & REST JSON APIs |
| **Database** | SQLite + Hibernate JPA | Persists user data & application records |
