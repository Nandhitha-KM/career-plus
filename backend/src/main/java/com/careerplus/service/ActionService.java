package com.careerplus.service;

import com.careerplus.model.Application;
import com.careerplus.model.PriorityLevel;
import com.careerplus.repository.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ActionService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private PriorityService priorityService;

    /**
     * Today's Actions Engine
     * Fetches all user applications, calculates priority scores, and groups into action lists
     */
    public Map<String, Object> getTodaysActions(Long userId) {
        List<Application> allApps = applicationRepository.findByUserIdOrderByCreatedAtDesc(userId);

        List<Application> followUpHighPriority = new ArrayList<>();
        List<Application> prepareForInterview = new ArrayList<>();
        List<Application> noActionRequired = new ArrayList<>();

        for (Application app : allApps) {
            priorityService.calculateAndAssignPriority(app);

            if (app.getPriorityLevel() == PriorityLevel.HIGH || "applied".equalsIgnoreCase(app.getStatus())) {
                followUpHighPriority.add(app);
            } else if ("interviewing".equalsIgnoreCase(app.getStatus()) || app.getInterviewDate() != null) {
                prepareForInterview.add(app);
            } else {
                noActionRequired.add(app);
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("highPriorityFollowUps", followUpHighPriority);
        response.put("interviewPrepList", prepareForInterview);
        response.put("noActionList", noActionRequired);
        response.put("totalActionCount", followUpHighPriority.size() + prepareForInterview.size());

        return response;
    }
}
