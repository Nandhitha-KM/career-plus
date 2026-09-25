package com.careerplus.auth.dto;

public class AuthResponse {
    private boolean success;
    private String message;
    private String token;
    private Long userId;
    private String email;
    private String fullName;
    private String profilePicture;

    public AuthResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public AuthResponse(boolean success, String message, String token, Long userId, String email, String fullName, String profilePicture) {
        this.success = success;
        this.message = message;
        this.token = token;
        this.userId = userId;
        this.email = email;
        this.fullName = fullName;
        this.profilePicture = profilePicture;
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getProfilePicture() { return profilePicture; }
    public void setProfilePicture(String profilePicture) { this.profilePicture = profilePicture; }
}
