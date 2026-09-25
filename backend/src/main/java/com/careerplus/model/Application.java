package com.careerplus.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSetter;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "applications")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = true)
    private User user;

    @Column(name = "company_name")
    private String companyName;

    @Column(name = "company_website")
    private String companyWebsite;

    @Column(name = "job_title")
    private String jobTitle;

    @Column(name = "application_type")
    private String applicationType; // Full-time, Part-time, Internship, Contract

    @Column(name = "location")
    private String location;

    @Column(name = "work_mode")
    private String workMode; // Remote, Hybrid, On-site

    @Column(name = "applied_date")
    private String appliedDate;

    @Column(name = "status")
    private String status = "applied"; // applied, interviewing, offered, rejected

    @Column(name = "status_weight")
    private Integer statusWeight = 1;

    @Column(name = "application_source")
    private String applicationSource; // LinkedIn, Company Website, Indeed, Referral, College Placement, Other

    @Column(name = "recruiter_name")
    private String recruiterName;

    @Column(name = "recruiter_email")
    private String recruiterEmail;

    @Column(name = "recruiter_phone")
    private String recruiterPhone;

    @Column(name = "offered_salary")
    private String offeredSalary;

    @Column(name = "interview_date")
    private String interviewDate;

    @Column(name = "interview_time")
    private String interviewTime;

    @Column(name = "interview_round")
    private String interviewRound; // Manually typed text input field

    @Column(name = "interview_type")
    private String interviewType; // Online, Offline, Phone

    @Column(name = "skills_required", length = 1000)
    private String skillsRequired;

    @Column(name = "notes", length = 2000)
    private String notes;

    @Column(name = "follow_up_date")
    private String followUpDate;

    @Column(name = "reminder_date")
    private String reminderDate;

    @Column(name = "resume_name")
    private String resumeName;

    @Column(name = "priority_score")
    private Double priorityScore = 50.0;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority_level")
    private PriorityLevel priorityLevel = PriorityLevel.MEDIUM;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Application() {
    }

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.updatedAt == null) {
            this.updatedAt = LocalDateTime.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    @JsonProperty("id")
    public Long getId() {
        return id;
    }

    @JsonSetter("id")
    public void setId(Object idObj) {
        if (idObj instanceof Number) {
            this.id = ((Number) idObj).longValue();
        } else if (idObj instanceof String) {
            try {
                this.id = Long.parseLong((String) idObj);
            } catch (NumberFormatException e) {
                this.id = null; // Cleanly ignore string IDs like "job-1787727786433"
            }
        } else {
            this.id = null;
        }
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    // Frontend Compatibility Alias
    public String getCompany() { return companyName; }
    public void setCompany(String company) { if (company != null && !company.trim().isEmpty()) this.companyName = company; }

    public String getCompanyWebsite() {
        return companyWebsite;
    }

    public void setCompanyWebsite(String companyWebsite) {
        this.companyWebsite = companyWebsite;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    // Frontend Compatibility Alias
    public String getTitle() { return jobTitle; }
    public void setTitle(String title) { if (title != null && !title.trim().isEmpty()) this.jobTitle = title; }

    public String getApplicationType() {
        return applicationType;
    }

    public void setApplicationType(String applicationType) {
        this.applicationType = applicationType;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getWorkMode() {
        return workMode;
    }

    public void setWorkMode(String workMode) {
        this.workMode = workMode;
    }

    public String getAppliedDate() {
        return appliedDate;
    }

    public void setAppliedDate(String appliedDate) {
        this.appliedDate = appliedDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getStatusWeight() {
        return statusWeight;
    }

    public void setStatusWeight(Integer statusWeight) {
        this.statusWeight = statusWeight;
    }

    public String getApplicationSource() {
        return applicationSource;
    }

    public void setApplicationSource(String applicationSource) {
        this.applicationSource = applicationSource;
    }

    public String getRecruiterName() {
        return recruiterName;
    }

    public void setRecruiterName(String recruiterName) {
        this.recruiterName = recruiterName;
    }

    public String getRecruiterEmail() {
        return recruiterEmail;
    }

    public void setRecruiterEmail(String recruiterEmail) {
        this.recruiterEmail = recruiterEmail;
    }

    public String getRecruiterPhone() {
        return recruiterPhone;
    }

    public void setRecruiterPhone(String recruiterPhone) {
        this.recruiterPhone = recruiterPhone;
    }

    public String getOfferedSalary() {
        return offeredSalary;
    }

    public void setOfferedSalary(String offeredSalary) {
        this.offeredSalary = offeredSalary;
    }

    // Frontend Compatibility Alias
    public String getSalary() { return offeredSalary; }
    public void setSalary(String salary) { if (salary != null && !salary.trim().isEmpty()) this.offeredSalary = salary; }

    public String getInterviewDate() {
        return interviewDate;
    }

    public void setInterviewDate(String interviewDate) {
        this.interviewDate = interviewDate;
    }

    public String getInterviewTime() {
        return interviewTime;
    }

    public void setInterviewTime(String interviewTime) {
        this.interviewTime = interviewTime;
    }

    public String getInterviewRound() {
        return interviewRound;
    }

    public void setInterviewRound(String interviewRound) {
        this.interviewRound = interviewRound;
    }

    public String getInterviewType() {
        return interviewType;
    }

    public void setInterviewType(String interviewType) {
        this.interviewType = interviewType;
    }

    public String getSkillsRequired() {
        return skillsRequired;
    }

    public void setSkillsRequired(String skillsRequired) {
        this.skillsRequired = skillsRequired;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getFollowUpDate() {
        return followUpDate;
    }

    public void setFollowUpDate(String followUpDate) {
        this.followUpDate = followUpDate;
    }

    public String getReminderDate() {
        return reminderDate != null ? reminderDate : followUpDate;
    }

    public void setReminderDate(String reminderDate) {
        this.reminderDate = reminderDate;
        if (this.followUpDate == null) {
            this.followUpDate = reminderDate;
        }
    }

    public String getResumeName() {
        return resumeName;
    }

    public void setResumeName(String resumeName) {
        this.resumeName = resumeName;
    }

    public Double getPriorityScore() {
        return priorityScore;
    }

    public void setPriorityScore(Double priorityScore) {
        this.priorityScore = priorityScore;
    }

    public PriorityLevel getPriorityLevel() {
        return priorityLevel;
    }

    public void setPriorityLevel(PriorityLevel priorityLevel) {
        this.priorityLevel = priorityLevel;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
