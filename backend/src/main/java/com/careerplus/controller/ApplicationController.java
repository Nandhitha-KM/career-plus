package com.careerplus.controller;

import com.careerplus.model.Application;
import com.careerplus.model.Note;
import com.careerplus.model.User;
import com.careerplus.repository.ApplicationRepository;
import com.careerplus.repository.NoteRepository;
import com.careerplus.repository.UserRepository;
import com.careerplus.service.PriorityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "*")
public class ApplicationController {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private PriorityService priorityService;

    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() != null) {
            String email = auth.getPrincipal().toString();
            return userRepository.findByEmail(email).orElse(null);
        }
        return null;
    }

    @GetMapping
    public ResponseEntity<List<Application>> getAllApplications() {
        User user = getAuthenticatedUser();
        Long userId = user != null ? user.getId() : 1L;

        List<Application> apps = applicationRepository.findAll();
        apps.forEach(priorityService::calculateAndAssignPriority);

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

    @PostMapping
    public ResponseEntity<Application> createApplication(@RequestBody Application app) {
        User user = getAuthenticatedUser();
        if (user == null) {
            user = userRepository.findAll().stream().findFirst().orElse(null);
        }
        app.setUser(user);
        if (app.getJobTitle() == null || app.getJobTitle().trim().isEmpty()) {
            app.setJobTitle("Untitled Role");
        }
        if (app.getCompanyName() == null || app.getCompanyName().trim().isEmpty()) {
            app.setCompanyName("Company");
        }
        if (app.getStatus() == null || app.getStatus().trim().isEmpty()) {
            app.setStatus("applied");
        }

        priorityService.calculateAndAssignPriority(app);
        Application saved = applicationRepository.save(app);

        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id:[0-9]+}")
    public ResponseEntity<Application> updateApplication(@PathVariable Long id, @RequestBody Application request) {
        Optional<Application> optionalApp = applicationRepository.findById(id);
        if (optionalApp.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Application app = optionalApp.get();
        if (request.getCompanyName() != null) app.setCompanyName(request.getCompanyName());
        if (request.getCompanyWebsite() != null) app.setCompanyWebsite(request.getCompanyWebsite());
        if (request.getJobTitle() != null) app.setJobTitle(request.getJobTitle());
        if (request.getApplicationType() != null) app.setApplicationType(request.getApplicationType());
        if (request.getLocation() != null) app.setLocation(request.getLocation());
        if (request.getWorkMode() != null) app.setWorkMode(request.getWorkMode());
        if (request.getAppliedDate() != null) app.setAppliedDate(request.getAppliedDate());
        if (request.getStatus() != null && !request.getStatus().trim().isEmpty()) {
            app.setStatus(request.getStatus().trim().toLowerCase());
        }
        if (request.getApplicationSource() != null) app.setApplicationSource(request.getApplicationSource());
        if (request.getRecruiterName() != null) app.setRecruiterName(request.getRecruiterName());
        if (request.getRecruiterEmail() != null) app.setRecruiterEmail(request.getRecruiterEmail());
        if (request.getRecruiterPhone() != null) app.setRecruiterPhone(request.getRecruiterPhone());
        if (request.getOfferedSalary() != null) app.setOfferedSalary(request.getOfferedSalary());
        if (request.getInterviewDate() != null) app.setInterviewDate(request.getInterviewDate());
        if (request.getInterviewTime() != null) app.setInterviewTime(request.getInterviewTime());
        if (request.getInterviewRound() != null) app.setInterviewRound(request.getInterviewRound());
        if (request.getInterviewType() != null) app.setInterviewType(request.getInterviewType());
        if (request.getSkillsRequired() != null) app.setSkillsRequired(request.getSkillsRequired());
        if (request.getNotes() != null) app.setNotes(request.getNotes());
        if (request.getFollowUpDate() != null) app.setFollowUpDate(request.getFollowUpDate());
        if (request.getReminderDate() != null) app.setReminderDate(request.getReminderDate());
        if (request.getResumeName() != null) app.setResumeName(request.getResumeName());

        priorityService.calculateAndAssignPriority(app);
        Application updated = applicationRepository.save(app);

        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id:[0-9]+}")
    public ResponseEntity<Map<String, Object>> deleteApplication(@PathVariable Long id) {
        if (!applicationRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        applicationRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "Application deleted successfully."));
    }

    @GetMapping("/{id:[0-9]+}/notes")
    public ResponseEntity<List<Note>> getNotes(@PathVariable Long id) {
        List<Note> notes = noteRepository.findByApplicationIdOrderByCreatedAtDesc(id);
        return ResponseEntity.ok(notes);
    }

    @PostMapping("/{id:[0-9]+}/notes")
    public ResponseEntity<Note> addNote(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Optional<Application> optionalApp = applicationRepository.findById(id);
        if (optionalApp.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        String noteText = body.get("noteText");
        User user = getAuthenticatedUser();
        Long userId = user != null ? user.getId() : 1L;

        Note note = new Note(optionalApp.get(), userId, noteText);
        Note savedNote = noteRepository.save(note);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedNote);
    }
}
