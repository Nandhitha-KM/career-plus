package com.careerplus.controller;

import com.careerplus.model.Resume;
import com.careerplus.model.User;
import com.careerplus.repository.ResumeRepository;
import com.careerplus.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private ResumeRepository resumeRepository;

    @Autowired
    private UserRepository userRepository;

    private Long getUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() != null) {
            String email = auth.getPrincipal().toString();
            User user = userRepository.findByEmail(email).orElse(null);
            if (user != null) return user.getId();
        }
        return 1L; // Fallback
    }

    @GetMapping("/resumes")
    public ResponseEntity<List<Resume>> getUserResumes() {
        List<Resume> resumes = resumeRepository.findByUserIdOrderByCreatedAtDesc(getUserId());
        return ResponseEntity.ok(resumes);
    }

    @PostMapping("/resumes")
    public ResponseEntity<Resume> createResume(@RequestBody Map<String, String> body) {
        String title = body.get("title");
        String fileName = body.get("fileName");
        String fileSize = body.get("fileSize");

        if (title == null || title.trim().isEmpty()) {
            title = "My Resume";
        }
        if (fileName == null || fileName.trim().isEmpty()) {
            fileName = title.replaceAll("\\s+", "_").toLowerCase() + ".pdf";
        }

        Resume resume = new Resume(getUserId(), title.trim(), fileName.trim(), fileSize != null ? fileSize : "1.2 MB");
        Resume saved = resumeRepository.save(resume);

        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @DeleteMapping("/resumes/{id}")
    public ResponseEntity<Map<String, Object>> deleteResume(@PathVariable Long id) {
        if (!resumeRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        resumeRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "Resume deleted successfully."));
    }
}
