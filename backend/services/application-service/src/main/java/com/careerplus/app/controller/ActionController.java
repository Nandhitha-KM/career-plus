package com.careerplus.app.controller;

import com.careerplus.app.model.Application;
import com.careerplus.app.repository.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/actions")
public class ActionController {

    @Autowired
    private ApplicationRepository applicationRepository;

    @GetMapping("/today")
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
}
