package com.careerplus.dto;

import com.careerplus.model.AuthProvider;
import java.time.LocalDateTime;

public class AuthResponse {

    private boolean success;
    private String message;
    private String token;
    private Long userId;
    private String fullName;
    private String email;
    private String profilePicture;
    private AuthProvider authProvider;
    private LocalDateTime createdAt;
    private LocalDateTime lastLogin;

    public AuthResponse() {
    }

    public AuthResponse(boolean success, String message, String token, Long userId, String fullName, String email, String profilePicture, AuthProvider authProvider, LocalDateTime createdAt, LocalDateTime lastLogin) {
        this.success = success;
        this.message = message;
        this.token = token;
        this.userId = userId;
        this.fullName = fullName;
        this.email = email;
        this.profilePicture = profilePicture;
        this.authProvider = authProvider;
        this.createdAt = createdAt;
        this.lastLogin = lastLogin;
    }

    public static AuthResponse success(String message, String token, Long userId, String fullName, String email, String profilePicture, AuthProvider authProvider, LocalDateTime createdAt, LocalDateTime lastLogin) {
        return new AuthResponse(true, message, token, userId, fullName, email, profilePicture, authProvider, createdAt, lastLogin);
    }

    public static AuthResponse success(String message) {
        AuthResponse res = new AuthResponse();
        res.setSuccess(true);
        res.setMessage(message);
        return res;
    }

    public static AuthResponse error(String message) {
        AuthResponse res = new AuthResponse();
        res.setSuccess(false);
        res.setMessage(message);
        return res;
    }

    // Getters and Setters
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }

    public AuthProvider getAuthProvider() {
        return authProvider;
    }

    public void setAuthProvider(AuthProvider authProvider) {
        this.authProvider = authProvider;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getLastLogin() {
        return lastLogin;
    }

    public void setLastLogin(LocalDateTime lastLogin) {
        this.lastLogin = lastLogin;
    }
}
