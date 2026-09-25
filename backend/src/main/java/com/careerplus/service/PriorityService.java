package com.careerplus.service;

import com.careerplus.model.Application;
import com.careerplus.model.PriorityLevel;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Service
public class PriorityService {

    /**
     * Priority Engine Algorithm
     * Computes priority score (0 - 100) and assigns PriorityLevel (HIGH, MEDIUM, LOW)
     */
    public void calculateAndAssignPriority(Application app) {
        double score = 0.0;

        // 1. Days Since Applied Urgency
        LocalDate appliedDate = app.getAppliedDate() != null ? app.getAppliedDate() : LocalDate.now();
        long daysApplied = ChronoUnit.DAYS.between(appliedDate, LocalDate.now());
        score += Math.min(daysApplied * 2.5, 30.0);

        // 2. Status Weight
        String status = app.getStatus() != null ? app.getStatus().toLowerCase() : "applied";
        int statusWeight = 20;
        switch (status) {
            case "interviewing":
                statusWeight = 40;
                break;
            case "applied":
                statusWeight = 20;
                break;
            case "offered":
                statusWeight = 10;
                break;
            case "rejected":
                statusWeight = 0;
                break;
        }
        app.setStatusWeight(statusWeight);
        score += statusWeight;

        // 3. Interview Date Proximity (+35 pts if interview within 3 days)
        if (app.getInterviewDate() != null) {
            long daysUntilInterview = ChronoUnit.DAYS.between(LocalDate.now(), app.getInterviewDate());
            if (daysUntilInterview >= 0 && daysUntilInterview <= 3) {
                score += 35.0;
            }
        }

        // 4. Inactivity Warning (+25 pts if > 7 days since last update)
        LocalDateTime lastUpdate = app.getUpdatedAt() != null ? app.getUpdatedAt() : app.getCreatedAt();
        if (lastUpdate != null) {
            long daysInactive = ChronoUnit.DAYS.between(lastUpdate, LocalDateTime.now());
            if (daysInactive >= 7) {
                score += 25.0;
            }
        }

        // Cap score between 0 and 100
        double finalScore = Math.min(Math.max(score, 0.0), 100.0);
        app.setPriorityScore(finalScore);

        // Assign Classification Level
        if (finalScore >= 70.0) {
            app.setPriorityLevel(PriorityLevel.HIGH);
        } else if (finalScore >= 40.0) {
            app.setPriorityLevel(PriorityLevel.MEDIUM);
        } else {
            app.setPriorityLevel(PriorityLevel.LOW);
        }
    }
}
