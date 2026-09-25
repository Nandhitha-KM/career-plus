# ❓ All Possible Questions & Winning Answers for Your Architecture Slide

This guide covers **every possible question** judges can ask when looking at your **System Architecture Diagram** slide!

---

## 🎨 1. Questions on FRONTEND (React.js, Vite, State, Storage)

### Q1: *"Why did you use Vite with React instead of traditional Create React App (CRA)?"*
- **Winning Answer**:
  > *"Vite provides **Lightning-Fast HMR (Hot Module Replacement)** and instant server startup using native ES Modules. Unlike CRA which pre-bundles the entire app, Vite only compiles the code requested by the browser, making development and production builds significantly faster."*

---

### Q2: *"Why did you store the JWT Token in `localStorage` instead of HTTP-only Cookies?"*
- **Winning Answer**:
  > *"Storing the JWT in `localStorage` allows our frontend `apiService.js` to easily access the token and attach it as a Bearer header (`Authorization: Bearer <token>`) for cross-origin REST requests across our microservices architecture. It also persists user session across browser tab restarts."*

---

### Q3: *"How does Context API differ from `useState` in your frontend?"*
- **Winning Answer**:
  > *"We use `useState` for local component state (like modal steps or toggle states), while **Context API** acts as a global state provider for application-wide data like the authenticated candidate profile (`currentUser`), avoiding prop-drilling across deep component trees."*

---

## 🔐 2. Questions on AUTHENTICATION & SECURITY (JWT, BCrypt, OAuth)

### Q4: *"Why do you use BCrypt Password Encoding? Why not MD5 or SHA-256?"*
- **Winning Answer**:
  > *"MD5 and SHA-256 are fast hash algorithms susceptible to brute-force and rainbow table attacks. **BCrypt** includes a **Salt** (random string) and a **Work Factor (Cost Factor)**, making it intentionally computationally slow and highly resistant to password cracking."*

---

### Q5: *"Explain the JWT authentication flow step-by-step from your diagram."*
- **Winning Answer**:
  > *"1. Candidate submits credentials on Login Page.  
  > 2. Spring Security authenticates the user and verifies BCrypt hash.  
  > 3. Backend generates a signed **JWT Token** containing candidate ID and expiration time.  
  > 4. Token is sent to React and saved in `localStorage`.  
  > 5. For every subsequent request, React sends `Authorization: Bearer <JWT_Token>`.  
  > 6. Backend's `JwtAuthenticationFilter` intercepts, validates the signature, and grants access."*

---

### Q6: *"How does Google Authentication (OAuth 2.0) integrate with your JWT system?"*
- **Winning Answer**:
  > *"When the user logs in via Google, Google authenticates the candidate and returns an OAuth ID token. Our backend verifies this token with Google's servers, extracts the user's email, and issues our own system JWT token so the user experiences seamless access."*

---

## 💼 3. Questions on BACKEND (Controller, Service, Repository, Entity)

### Q7: *"Can you explain the 4 layers in your Spring Boot Backend box?"*
- **Winning Answer**:
  > *"We follow **Layered Architecture**:
  > 1. **Controller Layer**: REST Controllers (`@RestController`) that expose API endpoints and parse incoming JSON HTTP requests.
  > 2. **Service Layer**: Holds business rules, such as calculating priority scores or computing 7-day inactivity alerts.
  > 3. **Repository Layer**: Interfaces extending `JpaRepository` that execute database operations.
  > 4. **Entity Layer**: Java classes annotated with `@Entity` mapped directly to SQLite database tables."*

---

### Q8: *"What is Dependency Injection (@Autowired) in Spring Boot and why did you use it?"*
- **Winning Answer**:
  > *"Dependency Injection means the Spring Framework manages class instantiation automatically. Instead of manually creating objects (`new ApplicationRepository()`), `@Autowired` injects pre-configured singleton beans, reducing tight coupling and making unit testing easier."*

---

### Q9: *"What is the difference between `@Controller` and `@RestController`?"*
- **Winning Answer**:
  > *"`@Controller` returns HTML views (JSP/Thymeleaf), whereas `@RestController` automatically serializes Java return objects into **JSON payloads** using Jackson serializer, which is perfect for REST APIs."*

---

## 💾 4. Questions on DATABASE & FILE STORAGE (SQLite, JPA, Hibernate)

### Q10: *"Why SQLite instead of PostgreSQL or MySQL?"*
- **Winning Answer**:
  > *"SQLite is an embedded, zero-configuration relational database engine that stores data in a single persistent file (`.db`). For our project scale, it provides fast SQL query execution, zero external server overhead, and 100% data persistence."*

---

### Q11: *"What role does Hibernate play between Spring Data JPA and SQLite?"*
- **Winning Answer**:
  > *"Spring Data JPA is the specification (interfaces), while **Hibernate is the underlying ORM (Object-Relational Mapping) implementation**. Hibernate translates Java method calls (`repository.save(application)`) into SQL queries (`INSERT INTO applications...`) for SQLite."*

---

### Q12: *"How are resume files stored and accessed?"*
- **Winning Answer**:
  > *"Resume files (.pdf, .docx) are saved to **Local File Storage** on the server filesystem, while their metadata (file name, file size, upload timestamp, and relative file path) is stored inside the SQLite database table."*

---

## 🔄 5. Questions on REST API & DATA FLOW (Bottom Bar)

### Q13: *"Why REST API with JSON instead of GraphQL or WebSockets?"*
- **Winning Answer**:
  > *"REST with JSON is the industry standard for HTTP client-server architectures. It provides stateless operations, uniform URI endpoints, lightweight JSON payload parsing, and high cacheability."*

---

### Q14: *"Walk us through the full flow when a user clicks 'Add Application'."*
- **Winning Answer**:
  > *"1. User submits form on React UI.  
  > 2. `apiService.js` sends `POST http://localhost:8080/api/applications` with JSON.  
  > 3. Controller parses JSON $\rightarrow$ Service calculates priority $\rightarrow$ Repository saves to SQLite.  
  > 4. SQLite returns saved entity $\rightarrow$ Controller responds with `HTTP 201 Created`.  
  > 5. React updates state and renders the card on the Kanban Board!"*

---

## 🏆 Summary Cheat Sheet

| Component | Technical Keyword | One-Line Explanation |
| :--- | :--- | :--- |
| **Vite** | Native ES Modules | Fast HMR & instant development builds |
| **BCrypt** | Salt + Work Factor | Secure password hashing algorithm |
| **JWT** | Stateless Token | Encoded authorization token sent in Bearer header |
| **JPA / Hibernate** | ORM Abstraction | Maps Java Entities to SQL database tables |
| **SQLite** | Single-file SQL Engine | Zero-config persistent relational database |
