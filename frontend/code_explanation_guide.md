# 💻 Career Plus — Complete Code Explanation Guide

This guide explains **every main code file** in your project in simple, easy-to-understand terms. Use this to explain your code to judges when they ask you to open your IDE or show specific files!

---

## 🎨 1. Frontend Code Walkthrough (React.js)

### 📄 File 1: `src/App.jsx` (Main Workspace & Central State)
- **What it does**: This is the main parent component of your application.
- **Key Code**:
  - `const [jobs, setJobs] = useState([]);`: Stores the array of all job applications.
  - `const [activeTab, setActiveTab] = useState('kanban');`: Tracks which tab is open (`kanban`, `actions`, `priority`, `reminders`, `analytics`).
  - `const [selectedJob, setSelectedJob] = useState(null);`: Holds the job card currently opened in the Detail Drawer.
  - `useEffect(() => { loadApplications(); }, []);`: Automatically calls `apiService.getKanbanApplications()` when the app loads to fetch all jobs from the backend.

---

### 📄 File 2: `src/services/api.js` (REST API Communication Engine)
- **What it does**: Handles all HTTP network calls between React and API Gateway (`http://localhost:8080/api`).
- **Key Code**:
  ```javascript
  const API_BASE_URL = 'http://localhost:8080/api';
  
  // 1. Fetch all applications (Kanban, Today's Actions, Analytics)
  async getKanbanApplications() {
    const response = await fetch(`${API_BASE_URL}/applications`, {
      headers: getAuthHeaders(),
    });
    return await response.json();
  }

  // 2. Create Application (Strips client-side string ID)
  async createApplication(applicationData) {
    const { id, ...cleanData } = applicationData; // Strips 'job-123'
    const response = await fetch(`${API_BASE_URL}/applications`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(cleanData),
    });
    return await response.json();
  }
  ```

---

### 📄 File 3: `src/components/AddApplicationModal.jsx` (5-Step Wizard)
- **What it does**: The popup modal where candidates add a new job application.
- **Key Code**:
  - `const [currentStep, setCurrentStep] = useState(1);`: Step state from 1 to 5.
  - **Step 1**: Job Details (Company Name & Job Title validation).
  - **Step 2**: Recruiter Info & Salary Band.
  - **Step 3**: Resume selection or PDF upload.
  - **Step 4**: Interview schedule date and video format.
  - **Step 5**: Skills & Notes.
  - `handleSubmit()`: Called on Step 5. It constructs `jobPayload`, calls `onAddJob(jobPayload)` to save via REST API, resets form fields, closes modal, and renders card on the board!

---

### 📄 File 4: `src/components/KanbanBoard.jsx` (Pipeline Columns)
- **What it does**: Displays job applications in 4 pipeline columns.
- **Key Code**:
  - Filters `jobs` prop into 4 categories:
    - `applied`: Jobs in Applied stage.
    - `interviewing`: Jobs in Interview stage.
    - `offered`: Jobs with job offers.
    - `rejected`: Archived applications.
  - Clicking any card calls `onSelectJob(job)` to open `ApplicationDetailModal.jsx`.

---

### 📄 File 5: `src/components/TodaysActionsView.jsx` (Action Popups)
- **What it does**: Displays pending tasks grouped into **High Priority Follow-ups** and **Upcoming Interviews**.
- **Key Code**:
  - Clicking **`Follow Up`** or **`Prep Notes`** calls `handleOpenAction(type, job)`.
  - Opens `activeActionModal` popup showing recruiter name, email, phone, interview dates, and prep notes.

---

### 📄 File 6: `src/components/FollowUpNotesView.jsx` (>7-Day Inactivity Alerts)
- **What it does**: Displays jobs that need recruiter follow-up.
- **Key Code**:
  - `calculateDaysInactive(appliedDate)`: Subtracts applied timestamp from current date.
  - If `inactivityDays >= 7`, the card is highlighted in **yellow** with a `> 7-Day Inactivity Alert` badge.

---

### 📄 File 7: `src/components/AnalyticsView.jsx` (Metrics & Progress Bars)
- **What it does**: Computes conversion metrics and pipeline progress bars.
- **Key Code**:
  - `activeRate = (activeCount / total) * 100` (e.g. 1 job applied out of 1 shows 100% Active Pipeline Rate).
  - `appliedRate`, `interviewRate`, `offerRate`.
  - Renders progress bars using Tailwind CSS inline style widths (`style={{ width: '${appliedRate}%' }}`).

---

## 🚪 2. API Gateway Code Walkthrough (Port 8080)

### 📄 File 8: `application.properties` (Route Configuration)
- **What it does**: Maps incoming URL paths to target microservices.
- **Key Code**:
  ```properties
  server.port=8080
  
  # Route 1: Auth Microservice (Port 8081)
  spring.cloud.gateway.routes[0].id=auth-service
  spring.cloud.gateway.routes[0].uri=http://localhost:8081
  spring.cloud.gateway.routes[0].predicates[0]=Path=/api/auth/**
  
  # Route 2: Application Microservice (Port 8082)
  spring.cloud.gateway.routes[1].id=application-service
  spring.cloud.gateway.routes[1].uri=http://localhost:8082
  spring.cloud.gateway.routes[1].predicates[0]=Path=/api/**
  ```

---

### 📄 File 9: `CorsConfig.java` (CORS Preflight Interceptor)
- **What it does**: Fixes Cross-Origin Resource Sharing (CORS) errors between React and Spring Boot.
- **Key Code**:
  ```java
  @Bean
  @Order(Ordered.HIGHEST_PRECEDENCE)
  public WebFilter corsFilter() {
      return (ServerWebExchange exchange, WebFilterChain chain) -> {
          ServerHttpRequest request = exchange.getRequest();
          if (CorsUtils.isCorsRequest(request)) {
              ServerHttpResponse response = exchange.getResponse();
              HttpHeaders headers = response.getHeaders();
              headers.add("Access-Control-Allow-Origin", "*");
              headers.add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
              if (request.getMethod() == HttpMethod.OPTIONS) {
                  response.setStatusCode(HttpStatus.OK);
                  return Mono.empty(); // Returns 200 OK immediately for OPTIONS
              }
          }
          return chain.filter(exchange);
      };
  }
  ```

---

## 💼 3. Application Microservice Code Walkthrough (Port 8082)

### 📄 File 10: `ApplicationController.java` (REST Endpoints)
- **What it does**: Handles all REST API requests for applications, actions, and analytics.
- **Key Code**:
  - `@GetMapping`: Returns list of all applications from SQLite.
  - `@PostMapping`: Saves new `Application` entity to SQLite.
  - `@PutMapping("/{id:[0-9]+}")`: Updates existing job details.
  - `@DeleteMapping("/{id:[0-9]+}")`: Deletes job application by numeric ID.
  - `@GetMapping("/actions/today")`: Calculates pending interviews and follow-ups.
  - `@GetMapping("/analytics/insights")`: Computes conversion rates.

---

### 📄 File 11: `Application.java` (JPA Entity & Model)
- **What it does**: Defines the database schema mapped to SQLite database table `applications`.
- **Key Code**:
  ```java
  @Entity
  @Table(name = "applications")
  @JsonIgnoreProperties(ignoreUnknown = true)
  public class Application {
      @Id
      @GeneratedValue(strategy = GenerationType.IDENTITY)
      private Long id;

      private String jobTitle;
      private String companyName;
      private String status;
      private String location;
      private String offeredSalary;
      private String recruiterName;
      private String recruiterEmail;
      
      // Custom JsonSetter to convert client-side string IDs to null
      @JsonSetter("id")
      public void handleId(Object idObj) {
          if (idObj instanceof Number) {
              this.id = ((Number) idObj).longValue();
          } else {
              this.id = null; // SQLite auto-increments primary key (1, 2, 3...)
          }
      }
  }
  ```

---

## 🔐 4. Auth Microservice Code Walkthrough (Port 8081)

### 📄 File 12: `AuthController.java` & `JwtTokenProvider.java`
- **What it does**: Handles user registration, BCrypt password hashing, and JWT token issuance.
- **Key Code**:
  - `BCryptPasswordEncoder.encode(password)`: Encrypts raw user passwords.
  - `Jwts.builder().setSubject(email)...signWith(...)`: Generates a secure JWT token returned to React upon login.
  - User records are stored in SQLite database `auth_service.db`.

---

## 💡 Summary Table for Judges

| Component | Technology | File Name | Main Function |
| :--- | :--- | :--- | :--- |
| **Main UI Workspace** | React.js | `App.jsx` | State management & tab switching |
| **API Client** | JS Fetch API | `api.js` | Sends HTTP requests to Gateway 8080 |
| **5-Step Wizard** | React.js | `AddApplicationModal.jsx` | 5-step form & auto-save |
| **Gateway Routing** | Spring Cloud Gateway | `application.properties` | Routes `/api/**` to 8081/8082 |
| **CORS Preflight** | Spring WebFilter | `CorsConfig.java` | Returns 200 OK for `OPTIONS` |
| **REST Controller** | Spring Boot | `ApplicationController.java` | Handles CRUD & Analytics REST APIs |
| **Database Entity** | Spring Data JPA | `Application.java` | Mapped to SQLite `applications` table |
