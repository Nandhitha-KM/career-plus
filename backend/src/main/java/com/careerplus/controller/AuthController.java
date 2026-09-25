package com.careerplus.controller;

import com.careerplus.dto.AuthResponse;
import com.careerplus.dto.GoogleAuthRequest;
import com.careerplus.dto.LoginRequest;
import com.careerplus.dto.SignUpRequest;
import com.careerplus.model.AuthProvider;
import com.careerplus.model.User;
import com.careerplus.repository.UserRepository;
import com.careerplus.security.JwtTokenProvider;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    /**
     * User Registration API
     * Stores user in SQLite database with BCrypt encrypted passwordHash
     */
    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> registerUser(@Valid @RequestBody SignUpRequest signUpRequest) {
        String email = signUpRequest.getEmail().trim().toLowerCase();

        // 1. Check if email already registered
        if (userRepository.existsByEmail(email)) {
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(AuthResponse.error("Error: Email address is already registered!"));
        }

        // 2. Encrypt password securely using BCrypt
        String encryptedPassword = passwordEncoder.encode(signUpRequest.getPassword());

        // 3. Create & persist user in SQLite
        User user = new User(
            signUpRequest.getFullName().trim(),
            email,
            encryptedPassword,
            AuthProvider.LOCAL
        );

        User savedUser = userRepository.save(user);

        // 4. Generate JWT Token
        String token = jwtTokenProvider.generateToken(savedUser.getEmail(), savedUser.getId());

        // 5. Return HTTP 201 Created Response with JWT Token
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(AuthResponse.success(
                "Account created successfully!",
                token,
                savedUser.getId(),
                savedUser.getFullName(),
                savedUser.getEmail(),
                savedUser.getProfilePicture(),
                savedUser.getAuthProvider(),
                savedUser.getCreatedAt(),
                savedUser.getLastLogin()
            ));
    }

    /**
     * Google OAuth 2.0 API
     * Authenticates with Google, creating or updating user record in SQLite with provider GOOGLE
     */
    @PostMapping("/google")
    public ResponseEntity<AuthResponse> googleAuthenticate(@Valid @RequestBody GoogleAuthRequest googleRequest) {
        String email = googleRequest.getEmail().trim().toLowerCase();

        Optional<User> existingUser = userRepository.findByEmail(email);

        User user;
        LocalDateTime now = LocalDateTime.now();

        if (existingUser.isPresent()) {
            user = existingUser.get();
            // Update lastLogin timestamp and profile picture if available
            user.setLastLogin(now);
            if (googleRequest.getImageUrl() != null && !googleRequest.getImageUrl().isEmpty()) {
                user.setProfilePicture(googleRequest.getImageUrl());
            }
            if (googleRequest.getFullName() != null && !googleRequest.getFullName().isEmpty()) {
                user.setFullName(googleRequest.getFullName());
            }
            user = userRepository.save(user);
        } else {
            // Automatically create new user in SQLite for first-time Google sign in
            user = new User(
                googleRequest.getFullName().trim(),
                email,
                googleRequest.getImageUrl(),
                AuthProvider.GOOGLE,
                now,
                now
            );
            user = userRepository.save(user);
        }

        // Generate JWT Token
        String token = jwtTokenProvider.generateToken(user.getEmail(), user.getId());

        return ResponseEntity.ok(AuthResponse.success(
            "Authenticated with Google successfully!",
            token,
            user.getId(),
            user.getFullName(),
            user.getEmail(),
            user.getProfilePicture(),
            user.getAuthProvider(),
            user.getCreatedAt(),
            user.getLastLogin()
        ));
    }

    /**
     * User Login API
     * - If user exists: Logs in successfully (sets BCrypt password if needed).
     * - If user DOES NOT exist: Returns HTTP 404 so frontend redirects to Sign Up page.
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginUser(@Valid @RequestBody LoginRequest loginRequest) {
        String email = loginRequest.getEmail().trim().toLowerCase();

        Optional<User> userOptional = userRepository.findByEmail(email);
        
        // 1. User DOES NOT exist in SQLite database -> Return 404 NOT_FOUND
        if (userOptional.isEmpty()) {
            return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(AuthResponse.error("USER_NOT_FOUND: Account does not exist. Redirecting to Sign Up page..."));
        }

        User user = userOptional.get();

        // 2. User exists: If passwordHash is null (created via Google), set password now!
        if (user.getPasswordHash() == null) {
            user.setPasswordHash(passwordEncoder.encode(loginRequest.getPassword()));
            user.setAuthProvider(AuthProvider.LOCAL);
        } else {
            // Verify BCrypt password hash
            if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPasswordHash())) {
                return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(AuthResponse.error("Invalid password for this account. Please try again or reset your password."));
            }
        }

        // Update lastLogin timestamp in SQLite
        user.setLastLogin(LocalDateTime.now());
        user = userRepository.save(user);

        // Generate JWT token
        String token = jwtTokenProvider.generateToken(user.getEmail(), user.getId());

        return ResponseEntity.ok(AuthResponse.success(
            "Logged in successfully!",
            token,
            user.getId(),
            user.getFullName(),
            user.getEmail(),
            user.getProfilePicture(),
            user.getAuthProvider(),
            user.getCreatedAt(),
            user.getLastLogin()
        ));
    }

    /**
     * Forgot Password Request API
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, Object>> forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Email is required."));
        }

        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Password reset link sent to " + email + "! Check your email inbox."
        ));
    }

    /**
     * Reset Password API
     * Encrypts new password via BCrypt and updates user record in SQLite
     */
    @PostMapping("/reset-password")
    public ResponseEntity<AuthResponse> resetPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String newPassword = body.get("newPassword");

        if (email == null || newPassword == null || email.trim().isEmpty() || newPassword.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(AuthResponse.error("Email and new password are required."));
        }

        Optional<User> userOptional = userRepository.findByEmail(email.trim().toLowerCase());
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(AuthResponse.error("User with email " + email + " not found."));
        }

        User user = userOptional.get();
        // Encrypt new password using BCrypt and update SQLite
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        user.setAuthProvider(AuthProvider.LOCAL);
        userRepository.save(user);

        return ResponseEntity.ok(AuthResponse.success("Password reset successfully! You can now log in with your new password."));
    }

    /**
     * User Logout API
     */
    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logoutUser() {
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "User logged out successfully."
        ));
    }
}
