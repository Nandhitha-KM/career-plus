package com.careerplus.auth.controller;

import com.careerplus.auth.dto.*;
import com.careerplus.auth.model.AuthProvider;
import com.careerplus.auth.model.User;
import com.careerplus.auth.repository.UserRepository;
import com.careerplus.auth.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> registerUser(@RequestBody SignUpRequest signUpRequest) {
        if (signUpRequest.getEmail() == null || signUpRequest.getEmail().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new AuthResponse(false, "Email is required"));
        }

        String email = signUpRequest.getEmail().toLowerCase().trim();

        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new AuthResponse(false, "USER_ALREADY_EXISTS"));
        }

        User user = new User(email, passwordEncoder.encode(signUpRequest.getPassword()), signUpRequest.getFullName());
        User savedUser = userRepository.save(user);

        String token = tokenProvider.generateToken(savedUser.getEmail(), savedUser.getId());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new AuthResponse(true, "User registered successfully", token, savedUser.getId(), savedUser.getEmail(), savedUser.getFullName(), null));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> authenticateUser(@RequestBody LoginRequest loginRequest) {
        if (loginRequest.getEmail() == null || loginRequest.getEmail().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new AuthResponse(false, "Email is required"));
        }

        String email = loginRequest.getEmail().toLowerCase().trim();
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new AuthResponse(false, "USER_NOT_FOUND"));
        }

        User user = userOptional.get();

        if (user.getPassword() == null || !passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponse(false, "INVALID_PASSWORD"));
        }

        String token = tokenProvider.generateToken(user.getEmail(), user.getId());

        return ResponseEntity.ok(new AuthResponse(true, "Login successful", token, user.getId(), user.getEmail(), user.getFullName(), user.getProfilePicture()));
    }

    @PostMapping("/google")
    public ResponseEntity<AuthResponse> googleAuth(@RequestBody GoogleAuthRequest googleRequest) {
        if (googleRequest.getEmail() == null || googleRequest.getEmail().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new AuthResponse(false, "Email is required"));
        }

        String email = googleRequest.getEmail().toLowerCase().trim();
        Optional<User> userOptional = userRepository.findByEmail(email);

        User user;
        if (userOptional.isPresent()) {
            user = userOptional.get();
            if (googleRequest.getFullName() != null) user.setFullName(googleRequest.getFullName());
            if (googleRequest.getImageUrl() != null) user.setProfilePicture(googleRequest.getImageUrl());
            if (googleRequest.getGoogleId() != null) user.setGoogleId(googleRequest.getGoogleId());
            user.setAuthProvider(AuthProvider.GOOGLE);
            userRepository.save(user);
        } else {
            user = new User();
            user.setEmail(email);
            user.setFullName(googleRequest.getFullName() != null ? googleRequest.getFullName() : "Google Candidate");
            user.setProfilePicture(googleRequest.getImageUrl());
            user.setGoogleId(googleRequest.getGoogleId());
            user.setAuthProvider(AuthProvider.GOOGLE);
            user = userRepository.save(user);
        }

        String token = tokenProvider.generateToken(user.getEmail(), user.getId());

        return ResponseEntity.ok(new AuthResponse(true, "Google authentication successful", token, user.getId(), user.getEmail(), user.getFullName(), user.getProfilePicture()));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<AuthResponse> resetPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String newPassword = request.get("newPassword");

        if (email == null || newPassword == null || newPassword.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new AuthResponse(false, "Email and new password are required"));
        }

        Optional<User> userOptional = userRepository.findByEmail(email.toLowerCase().trim());
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new AuthResponse(false, "USER_NOT_FOUND"));
        }

        User user = userOptional.get();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return ResponseEntity.ok(new AuthResponse(true, "Password reset successfully"));
    }
}
