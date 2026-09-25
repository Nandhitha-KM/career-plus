package com.careerplus.app.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSetter;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "applications")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "job_title")
    private String jobTitle;

    @Column(name = "company_name")
    private String companyName;

    @Column(name = "job_url")
    private String jobUrl;

    @Column(name = "application_type")
    private String applicationType;

    @Column(name = "offered_salary")
    private String offeredSalary;

    private String location;

    @Column(name = "work_mode")
    private String workMode;

    @Column(name = "recruiter_name")
    private String recruiterName;

    @Column(name = "recruiter_email")
    private String recruiterEmail;

    @Column(name = "recruiter_phone")
    private String recruiterPhone;

    @Column(name = "resume_name")
    private String resumeName;

    @Column(name = "interview_round")
    private String interviewRound;

    @Column(name = "interview_date")
    private String interviewDate;

    @Column(name = "interviewing_date")
    private String interviewingDate;

    @Column(name = "offered_date")
    private String offeredDate;

    @Column(name = "rejected_date")
    private String rejectedDate;

    @Column(name = "last_status_change_date")
    private String lastStatusChangeDate;

    @Column(name = "skills_required")
    private String skillsRequired;

    @Column(columnDefinition = "TEXT")
    private String notes;

    private String status = "applied";

    @Enumerated(EnumType.STRING)
    @Column(name = "priority_level")
    private PriorityLevel priorityLevel = PriorityLevel.MEDIUM;

    @Column(name = "priority_score")
    private Integer priorityScore = 50;

    @Column(name = "applied_date")
    private String appliedDate;

    @Column(name = "reminder_date")
    private String reminderDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Application() {}

    @JsonProperty("id")
    public Long getId() { return id; }

    @JsonSetter("id")
    public void setId(Object idObj) {
        if (idObj instanceof Number) {
            this.id = ((Number) idObj).longValue();
        } else if (idObj instanceof String) {
            try {
                this.id = Long.parseLong((String) idObj);
            } catch (NumberFormatException e) {
                this.id = null;
            }
        } else {
            this.id = null;
        }
    }

    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }

    public String getTitle() { return jobTitle; }
    public void setTitle(String title) { if (title != null && !title.trim().isEmpty()) this.jobTitle = title; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getCompany() { return companyName; }
    public void setCompany(String company) { if (company != null && !company.trim().isEmpty()) this.companyName = company; }

    public String getJobUrl() { return jobUrl; }
    public void setJobUrl(String jobUrl) { this.jobUrl = jobUrl; }

    public String getApplicationType() { return applicationType; }
    public void setApplicationType(String applicationType) { this.applicationType = applicationType; }

    public String getOfferedSalary() { return offeredSalary; }
    public void setOfferedSalary(String offeredSalary) { this.offeredSalary = offeredSalary; }

    public String getSalary() { return offeredSalary; }
    public void setSalary(String salary) { if (salary != null && !salary.trim().isEmpty()) this.offeredSalary = salary; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getWorkMode() { return workMode; }
    public void setWorkMode(String workMode) { this.workMode = workMode; }

    public String getRecruiterName() { return recruiterName; }
    public void setRecruiterName(String recruiterName) { this.recruiterName = recruiterName; }

    public String getRecruiterEmail() { return recruiterEmail; }
    public void setRecruiterEmail(String recruiterEmail) { this.recruiterEmail = recruiterEmail; }

    public String getRecruiterPhone() { return recruiterPhone; }
    public void setRecruiterPhone(String recruiterPhone) { this.recruiterPhone = recruiterPhone; }

    public String getResumeName() { return resumeName; }
    public void setResumeName(String resumeName) { this.resumeName = resumeName; }

    public String getInterviewRound() { return interviewRound; }
    public void setInterviewRound(String interviewRound) { this.interviewRound = interviewRound; }

    public String getInterviewDate() { return interviewDate; }
    public void setInterviewDate(String interviewDate) { this.interviewDate = interviewDate; }

    public String getInterviewingDate() { return interviewingDate; }
    public void setInterviewingDate(String interviewingDate) { this.interviewingDate = interviewingDate; }

    public String getOfferedDate() { return offeredDate; }
    public void setOfferedDate(String offeredDate) { this.offeredDate = offeredDate; }

    public String getRejectedDate() { return rejectedDate; }
    public void setRejectedDate(String rejectedDate) { this.rejectedDate = rejectedDate; }

    public String getLastStatusChangeDate() { return lastStatusChangeDate; }
    public void setLastStatusChangeDate(String lastStatusChangeDate) { this.lastStatusChangeDate = lastStatusChangeDate; }

    public String getSkillsRequired() { return skillsRequired; }
    public void setSkillsRequired(String skillsRequired) { this.skillsRequired = skillsRequired; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public PriorityLevel getPriorityLevel() { return priorityLevel; }
    public void setPriorityLevel(PriorityLevel priorityLevel) { this.priorityLevel = priorityLevel; }

    public Integer getPriorityScore() { return priorityScore; }
    public void setPriorityScore(Integer priorityScore) { this.priorityScore = priorityScore; }

    public String getAppliedDate() { return appliedDate; }
    public void setAppliedDate(String appliedDate) { this.appliedDate = appliedDate; }

    public String getReminderDate() { return reminderDate; }
    public void setReminderDate(String reminderDate) { this.reminderDate = reminderDate; }

    public String getFollowUpDate() { return reminderDate; }
    public void setFollowUpDate(String followUpDate) { if (followUpDate != null && !followUpDate.trim().isEmpty()) this.reminderDate = followUpDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
