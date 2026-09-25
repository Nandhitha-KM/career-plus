# 💻 Career Plus — Programming & Code Deep-Dive Guide

> **Target Audience**: Technical Judges, Code Reviewers, and Viva Examiners  
> **Key Code Technologies**: Java 17, Spring Boot 3.2, Spring Cloud Gateway, React.js 18 Hooks, Jackson JSON, Spring Data JPA  

---

## ☕ 1. Spring Boot & Java Backend Code Questions

### Q1: *"What key Spring Boot annotations did you use in your controllers and what do they do?"*
- **How to Answer**:
  > *"We used core Spring MVC and REST annotations:
  > - `@RestController`: Combines `@Controller` and `@ResponseBody`, marking the class as a RESTful endpoint returning JSON responses.
  > - `@RequestMapping("/api/applications")`: Defines the base URI path for all endpoints inside the controller.
  > - `@Autowired`: Performs Dependency Injection (DI) to automatically inject Spring Beans like `ApplicationRepository` and `PriorityService`.
  > - `@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping`: Map HTTP methods to specific Java handler methods.
  > - `@PathVariable`: Binds URI template variables (e.g. `{id}`) to method parameter variables.
  > - `@RequestBody`: Deserializes incoming HTTP JSON request bodies into Java POJO entities."*

---

### Q2: *"How did you prevent path matching collisions between `GET /{id}` and `/actions/today`?"*
- **How to Answer / Show Code**:
  > *"In Spring MVC `@RequestMapping("/api/applications")`, a route like `@GetMapping("/{id}")` takes `{id}` as a wildcard parameter. When the frontend requested `/api/applications/actions/today`, Spring tried to parse the string `'actions'` into a `Long id`, triggering a type conversion failure (404 / 400).
  > 
  > We solved this by applying **Regex Path Matching**:
  > ```java
  > @GetMapping("/{id:[0-9]+}")
  > public ResponseEntity<Application> getApplicationById(@PathVariable Long id) { ... }
  > ```
  > This restricts `{id}` strictly to numeric digits (`0-9`), allowing `/actions/today` and `/analytics/insights` to route cleanly to their dedicated methods!"*

---

### Q3: *"How did you fix Jackson JSON deserialization errors (`HttpMessageNotReadableException`) when the client sends string IDs or extra fields?"*
- **How to Answer / Show Code**:
  > *"When the React frontend generated client-side string IDs (e.g. `'job-1787727786433'`), Jackson failed to map them into Java's `Long id` field.
  > 
  > We resolved this using two Jackson annotations in `Application.java`:
  > 1. `@JsonIgnoreProperties(ignoreUnknown = true)`: Instructs Jackson to ignore unmapped fields in client JSON.
  > 2. Custom `@JsonSetter("id")`:
  > ```java
  > @JsonSetter("id")
  > public void handleId(Object idObj) {
  >     if (idObj instanceof Number) {
  >         this.id = ((Number) idObj).longValue();
  >     } else {
  >         this.id = null; // Forces SQLite JPA to auto-increment numeric ID
  >     }
  > }
  > ```
  > This safely converts string IDs to `null`, allowing SQLite JPA auto-increment (`1, 2, 3...`) to assign primary keys without any bad request crashes."*

---

### Q4: *"How does Spring Data JPA interact with the SQLite database without writing SQL queries?"*
- **How to Answer**:
  > *"We defined Repository interfaces extending Spring Data JPA's `JpaRepository<Application, Long>`:
  > ```java
  > public interface ApplicationRepository extends JpaRepository<Application, Long> {
  >     List<Application> findByUserId(Long userId);
  > }
  > ```
  > Hibernate automatically generates SQL queries (`SELECT * FROM applications WHERE user_id = ?`) behind the scenes based on method name conventions!"*

---

## 🚪 2. Spring Cloud Gateway Code Questions

### Q5: *"How does Spring Cloud Gateway route traffic to downstream microservices?"*
- **How to Answer / Show Code**:
  > *"Inside Gateway `application.properties`, we defined path predicates and target URIs:
  > ```properties
  > server.port=8080
  > 
  > # Route 1: Auth Microservice (Port 8081)
  > spring.cloud.gateway.routes[0].id=auth-service
  > spring.cloud.gateway.routes[0].uri=http://localhost:8081
  > spring.cloud.gateway.routes[0].predicates[0]=Path=/api/auth/**
  > 
  > # Route 2: Application Microservice (Port 8082)
  > spring.cloud.gateway.routes[1].id=application-service
  > spring.cloud.gateway.routes[1].uri=http://localhost:8082
  > spring.cloud.gateway.routes[1].predicates[0]=Path=/api/**
  > ```
  > Netty inspects incoming URI paths and proxies HTTP requests to the target microservice port."*

---

### Q6: *"How did you handle CORS preflight `OPTIONS` requests in the API Gateway?"*
- **How to Answer / Show Code**:
  > *"We created a reactive `CorsConfig.java` returning a WebFilter bean with `@Order(Ordered.HIGHEST_PRECEDENCE)`:
  > ```java
  > @Configuration
  > public class CorsConfig {
  >     @Bean
  >     @Order(Ordered.HIGHEST_PRECEDENCE)
  >     public WebFilter corsFilter() {
  >         return (ServerWebExchange exchange, WebFilterChain chain) -> {
  >             ServerHttpRequest request = exchange.getRequest();
  >             if (CorsUtils.isCorsRequest(request)) {
  >                 ServerHttpResponse response = exchange.getResponse();
  >                 HttpHeaders headers = response.getHeaders();
  >                 headers.add("Access-Control-Allow-Origin", "*");
  >                 headers.add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  >                 headers.add("Access-Control-Allow-Headers", "*");
  >                 if (request.getMethod() == HttpMethod.OPTIONS) {
  >                     response.setStatusCode(HttpStatus.OK);
  >                     return Mono.empty(); // Returns 200 OK immediately for OPTIONS
  >                 }
  >             }
  >             return chain.filter(exchange);
  >         };
  >     }
  > }
  > ```"*

---

## ⚛️ 3. React.js & Frontend Code Questions

### Q7: *"What React Hooks did you use and how do they manage component lifecycle and state?"*
- **How to Answer**:
  > *"We used core React 18 hooks:
  > - `useState`: Tracks local component state (e.g. `currentStep` in wizard, `activeTab`, `selectedJob` drawer data, `jobs` array).
  > - `useEffect`: Handles side effects:
  >   - Fetching applications on initial render (`getKanbanApplications()`).
  >   - Pre-populating form fields when editing a job.
  >   - Syncing resume options from candidate profile."*

---

### Q8: *"How is data passed between components in React?"*
- **How to Answer**:
  > *"Data flows downwards via **Props** (Unidirectional Data Flow):
  > - `App.jsx` holds top-level `jobs` state and passes it to child components (`KanbanBoard`, `TodaysActionsView`, `AnalyticsView`).
  > - Child components trigger state changes in `App.jsx` via callback functions passed as props (e.g. `onAddJob={handleOpenAddModal}`, `onSelectJob={(job) => setSelectedJob(job)}`)."*

---

### Q9: *"How is the REST API layer structured in your React application?"*
- **How to Answer / Show Code**:
  > *"We centralized all API requests inside `src/services/api.js`:
  > ```javascript
  > const API_BASE_URL = 'http://localhost:8080/api';
  > 
  > export const apiService = {
  >   async getKanbanApplications() {
  >     const response = await fetch(`${API_BASE_URL}/applications`, {
  >       headers: getAuthHeaders(),
  >     });
  >     return await response.json();
  >   },
  >   async createApplication(data) {
  >     const { id, ...cleanData } = data; // Strips client string ID
  >     const response = await fetch(`${API_BASE_URL}/applications`, {
  >       method: 'POST',
  >       headers: getAuthHeaders(),
  >       body: JSON.stringify(cleanData),
  >     });
  >     return await response.json();
  >   }
  > };
  > ```"*

---

## 🔐 4. Security & JWT Code Questions

### Q10: *"How is password hashing and JWT token generation handled?"*
- **How to Answer**:
  > *"In Auth Microservice (Port 8081):
  > 1. Candidate passwords are encrypted using `BCryptPasswordEncoder.encode(rawPassword)`.
  > 2. Upon successful authentication, `JwtTokenProvider.java` generates a JWT token:
  > ```java
  > String token = Jwts.builder()
  >     .setSubject(user.getEmail())
  >     .setIssuedAt(new Date())
  >     .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 24 hours
  >     .signWith(SignatureAlgorithm.HS512, jwtSecret)
  >     .compact();
  > ```"*

---

## 💡 Quick Code Cheat Sheet for Judges

| Problem | Code Solution | File Location |
| :--- | :--- | :--- |
| **CORS OPTIONS Preflight** | `WebFilter` returning `HttpStatus.OK` at highest precedence | `api-gateway/.../CorsConfig.java` |
| **String ID Deserialization** | `@JsonSetter("id")` converting string IDs to `null` | `application-service/.../Application.java` |
| **Regex Path Matching** | `@GetMapping("/{id:[0-9]+}")` | `application-service/.../ApplicationController.java` |
| **JWT Header Parsing** | `headers['Authorization'] = 'Bearer ' + token` | `frontend/src/services/api.js` |
| **JPA Entity Definition** | `@Entity` `@Table(name="applications")` `@Id` `@GeneratedValue` | `application-service/.../Application.java` |
