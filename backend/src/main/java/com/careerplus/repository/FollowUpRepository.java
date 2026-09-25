package com.careerplus.repository;

import com.careerplus.model.FollowUp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FollowUpRepository extends JpaRepository<FollowUp, Long> {
    List<FollowUp> findByUserIdAndCompletedFalseOrderByFollowUpDateAsc(Long userId);
    List<FollowUp> findByApplicationIdOrderByCreatedAtDesc(Long applicationId);
}
