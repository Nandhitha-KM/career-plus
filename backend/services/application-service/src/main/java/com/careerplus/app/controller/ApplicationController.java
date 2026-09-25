package com.careerplus.app.controller;

import com.careerplus.app.model.Application;
import com.careerplus.app.repository.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    @Autowired
    private ApplicationRepository applicationRepository;

    @GetMapping
    public ResponseEntity<List<Application>> getAllApplications() {
        List<Application> apps = applicationRepository.findAll();
        return ResponseEntity.ok(apps);
    }

    @GetMapping("/actions/today")
    public ResponseEntity<Map<String, Object>> getTodaysActions() {
        List<Application> allApps = applicationRepository.findAll();
        
        List<Application> interviewsToday = allApps.stream()
                .filter(app -> "interviewing".equalsIgnoreCase(app.getStatus()))
                .collect(Collectors.toList());

        List<Application> followUpsDue = allApps.stream()
                .filter(app -> "applied".equalsIgnoreCase(app.getStatus()))
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("interviewsTodayCount", interviewsToday.size());
        response.put("followUpsDueCount", followUpsDue.size());
        response.put("interviews", interviewsToday);
        response.put("followUps", followUpsDue);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/analytics/insights")
    public ResponseEntity<Map<String, Object>> getAnalyticsInsights() {
        List<Application> apps = applicationRepository.findAll();

        long total = apps.size();
        long applied = apps.stream().filter(a -> "applied".equalsIgnoreCase(a.getStatus())).count();
        long interviewing = apps.stream().filter(a -> "interviewing".equalsIgnoreCase(a.getStatus())).count();
        long offered = apps.stream().filter(a -> "offered".equalsIgnoreCase(a.getStatus())).count();
        long rejected = apps.stream().filter(a -> "rejected".equalsIgnoreCase(a.getStatus())).count();

        double interviewRate = total > 0 ? (double) interviewing / total * 100 : 0.0;
        double offerRate = interviewing > 0 ? (double) offered / interviewing * 100 : 0.0;
        double winRate = total > 0 ? (double) offered / total * 100 : 0.0;

        Map<String, Object> insights = new HashMap<>();
        insights.put("totalApplications", total);
        insights.put("appliedCount", applied);
        insights.put("interviewingCount", interviewing);
        insights.put("offeredCount", offered);
        insights.put("rejectedCount", rejected);
        insights.put("interviewRatePercent", Math.round(interviewRate * 10.0) / 10.0);
        insights.put("offerRatePercent", Math.round(offerRate * 10.0) / 10.0);
        insights.put("winRatePercent", Math.round(winRate * 10.0) / 10.0);

        return ResponseEntity.ok(insights);
    }

    @GetMapping("/{id:[0-9]+}")
    public ResponseEntity<Application> getApplicationById(@PathVariable Long id) {
        Optional<Application> app = applicationRepository.findById(id);
        return app.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Application> createApplication(@RequestBody Application application) {
        if (application.getJobTitle() == null || application.getJobTitle().trim().isEmpty()) {
            application.setJobTitle("Untitled Role");
        }
        if (application.getCompanyName() == null || application.getCompanyName().trim().isEmpty()) {
            application.setCompanyName("Company");
        }
        if (application.getStatus() == null || application.getStatus().trim().isEmpty()) {
            application.setStatus("applied");
        }
        Application saved = applicationRepository.save(application);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id:[0-9]+}")
    public ResponseEntity<Application> updateApplication(@PathVariable Long id, @RequestBody Application updatedApp) {
        Optional<Application> existingOpt = applicationRepository.findById(id);
        if (existingOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Application app = existingOpt.get();
        if (updatedApp.getJobTitle() != null) app.setJobTitle(updatedApp.getJobTitle());
        if (updatedApp.getCompanyName() != null) app.setCompanyName(updatedApp.getCompanyName());
        if (updatedApp.getStatus() != null) app.setStatus(updatedApp.getStatus());
        if (updatedApp.getOfferedSalary() != null) app.setOfferedSalary(updatedApp.getOfferedSalary());
        if (updatedApp.getNotes() != null) app.setNotes(updatedApp.getNotes());
        if (updatedApp.getInterviewRound() != null) app.setInterviewRound(updatedApp.getInterviewRound());
        if (updatedApp.getResumeName() != null) app.setResumeName(updatedApp.getResumeName());
        if (updatedApp.getRecruiterName() != null) app.setRecruiterName(updatedApp.getRecruiterName());
        if (updatedApp.getRecruiterEmail() != null) app.setRecruiterEmail(updatedApp.getRecruiterEmail());
        if (updatedApp.getReminderDate() != null) app.setReminderDate(updatedApp.getReminderDate());

        Application saved = applicationRepository.save(app);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id:[0-9]+}")
    public ResponseEntity<Void> deleteApplication(@PathVariable Long id) {
        if (!applicationRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        applicationRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
