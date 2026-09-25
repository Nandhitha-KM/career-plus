package com.careerplus.controller;

import com.careerplus.model.Application;
import com.careerplus.repository.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {

    @Autowired
    private ApplicationRepository applicationRepository;

    @GetMapping("/insights")
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
}
