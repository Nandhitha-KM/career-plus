# 📽️ Career Plus — Job & Internship Application Tracker
## Complete Presentation Slide Deck (10 Slides)

---

### 📌 Slide 1: Title Slide
- **Project Title**: Career Plus — Job & Internship Application Tracker
- **Subtitle**: Microservice-based Web Platform for Engineering Candidates
- **Presenter**: Sangavi S
- **Architecture**: Distributed Spring Boot Microservices with Spring Cloud API Gateway & React.js Frontend
- **Ports & Database**:
  - API Gateway: `Port 8080` (Netty Reactive Engine)
  - Auth Service: `Port 8081` (`auth_service.db`)
  - Application Service: `Port 8082` (`application_service.db`)

---

### 📌 Slide 2: Problem Statement & Motivation
- **Disorganized Job Search**: Engineering candidates apply to 50+ roles across LinkedIn, Indeed, and company portals using manual Excel sheets, resulting in lost records.
- **Missed Recruiter Follow-ups**: Over 65% of candidates fail to follow up with recruiters after 7 days of inactivity, missing critical hiring steps.
- **Lack of Analytics & Pipeline Visibility**: Candidates lack real-time conversion rate data, offer probabilities, and pipeline stage visualizers.

---

### 📌 Slide 3: Proposed Solution & Feature Matrix
1. **Interactive Kanban Board**: Visual drag-and-drop column tracking (`Applied` → `Interviewing` → `Offered` → `Rejected`).
2. **5-Step Application Wizard**: Rapid application registration with automated resume attachment, recruiter contacts, and CTC bands without review friction.
3. **Recruiter Follow-up Workspace**: Yellow spotlight cards highlighting inactive applications ($>7$ days).
4. **Today's Actions List & Popups**: Urgency-grouped task management with instant popup modal windows for follow-ups and interview preparation.
5. **Real-time Analytics & Funnel**: Conversion metrics, offer win rates, and stage distribution charts.

---

### 📌 Slide 4: System Architecture & Gateway Topology
- **Central Gateway Pattern**: `http://localhost:8080` acts as a single point of entry protecting downstream microservices.
- **Microservices Breakdown**:
  - **Auth Microservice (`Port 8081`)**: Handles `/api/auth/**` (Signup, Login, Password Reset, Google OAuth 2.0, JWT generation).
  - **Application Microservice (`Port 8082`)**: Handles `/api/applications/**`, `/api/actions/**`, `/api/analytics/**`, and `/api/users/**` (CRUD, Priority Engine, Resumes).
- **Frontend Layer**: React.js 18 with Tailwind CSS running on `http://localhost:3000` / `3001`.

---

### 📌 Slide 5: 5-Step Sequential Application Wizard
- **Step 1: Job Details** (Company Name, Job Title, Location, Work Mode, Employment Type).
- **Step 2: Recruiter Info** (HR Name, Email, Phone, CTC Offer Band).
- **Step 3: Resume Selection** (Choose profile resume or upload local PDF/DOCX).
- **Step 4: Interview Schedule** (Date, Time, Round, Video Format).
- **Step 5: Notes & Finish** (Required skills, custom notes → Auto Save & Display on Board).
- **Frictionless Improvement**: Bypassed Step 6 Review so clicking "Finish & Save Application" on Step 5 automatically saves to SQLite and displays the card on the dashboard immediately.

---

### 📌 Slide 6: Today's Actions & Interactive Detail Popups
- **Group 1: High Priority Follow-ups**: Spotlight cards for overdue recruiter responses.
- **Group 2: Upcoming Interviews**: Interview schedule cards with preparation notes.
- **Interactive Action Popups**: Clicking **🚀 Follow Up** or **📅 Prep Notes** opens an instant detail popup window displaying recruiter contact numbers, email drafts, attached resume names, and preparation notes.

---

### 📌 Slide 7: Real-Time Analytics & Pipeline Conversion Funnel
- **Active Pipeline Rate**: Visualizes active applications ($100\%$ for applied jobs).
- **Applied Stage Share**: Tracks applications pending recruiter response.
- **Interview Conversion Rate**: Measures percentage of applications advancing to technical rounds.
- **Offer Win Rate**: Measures offer success percentages across total submissions.

---

### 📌 Slide 8: Technical Engineering Challenges & Resolutions
1. **Deduplicated CORS Preflight Filter**: Added `@Order(Ordered.HIGHEST_PRECEDENCE)` `CorsWebFilter` in API Gateway to approve all preflight `OPTIONS` calls with `200 OK` instantly.
2. **Flexible JSON Deserializer & String IDs**: Created custom `@JsonSetter("id")` in `Application.java` catching client string IDs (`job-1787727786433`) and date strings without `400 Bad Request` crashes.
3. **Regex Path Mapping**: Configured `@GetMapping("/{id:[0-9]+}")` to prevent wildcard `{id}` matching against `/actions/today` and `/analytics/insights` routes.

---

### 📌 Slide 9: Minimalist & Clean Dashboard Aesthetic
- **Polished Candidate Header**: Displaying `Welcome, sangavi s` and `Job & Internship Application Tracker`.
- **Decluttered UI**: Removed technical badges (`Spring Boot REST API Integrated`, `Port 8080 Connected`) for a candidate-facing aesthetic.

---

### 📌 Slide 10: Conclusion & Future Roadmap
- **Conclusion**: Career Plus successfully provides a robust, scalable, and intuitive application tracker empowering engineering candidates to organize job searches and boost interview success rates.
- **Future Roadmap**:
  - AI Resume ATS Keyword Matcher
  - Automated 1-Click Email Dispatcher
  - Native iOS & Android React Native App
