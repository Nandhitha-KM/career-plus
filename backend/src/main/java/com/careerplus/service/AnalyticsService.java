package com.careerplus.service;

import com.careerplus.model.Application;
import com.careerplus.repository.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AnalyticsService {

    @Autowired
    private ApplicationRepository applicationRepository;

    /**
     * Analytics & Insights Engine
     * Calculates conversion rates (Applied -> Interview -> Offer) and pipeline statistics
     */
    public Map<String, Object> getAnalytics(Long userId) {
        List<Application> apps = applicationRepository.findByUserIdOrderByCreatedAtDesc(userId);

        long total = apps.size();
        long appliedCount = apps.stream().filter(a -> "applied".equalsIgnoreCase(a.getStatus())).count();
        long interviewingCount = apps.stream().filter(a -> "interviewing".equalsIgnoreCase(a.getStatus())).count();
        long offeredCount = apps.stream().filter(a -> "offered".equalsIgnoreCase(a.getStatus())).count();
        long rejectedCount = apps.stream().filter(a -> "rejected".equalsIgnoreCase(a.getStatus())).count();

        long totalInterviews = interviewingCount + offeredCount;
        double appliedToInterviewRate = total > 0 ? ((double) totalInterviews / total) * 100.0 : 0.0;
        double interviewToOfferRate = totalInterviews > 0 ? ((double) offeredCount / totalInterviews) * 100.0 : 0.0;
        double overallSuccessRate = total > 0 ? ((double) offeredCount / total) * 100.0 : 0.0;

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalApplications", total);
        stats.put("appliedCount", appliedCount);
        stats.put("interviewingCount", interviewingCount);
        stats.put("offeredCount", offeredCount);
        stats.put("rejectedCount", rejectedCount);
        stats.put("appliedToInterviewRate", Math.round(appliedToInterviewRate * 10.0) / 10.0);
        stats.put("interviewToOfferRate", Math.round(interviewToOfferRate * 10.0) / 10.0);
        stats.put("overallSuccessRate", Math.round(overallSuccessRate * 10.0) / 10.0);

        return stats;
    }
}
