package com.careerplus.app.controller;

import com.careerplus.app.model.Resume;
import com.careerplus.app.repository.ResumeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private ResumeRepository resumeRepository;

    @GetMapping("/resumes")
    public ResponseEntity<List<Resume>> getResumes() {
        List<Resume> resumes = resumeRepository.findAll();
        return ResponseEntity.ok(resumes);
    }

    @PostMapping("/resumes")
    public ResponseEntity<Resume> addResume(@RequestBody Resume resume) {
        Resume saved = resumeRepository.save(resume);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @DeleteMapping("/resumes/{id}")
    public ResponseEntity<Void> deleteResume(@PathVariable Long id) {
        if (!resumeRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        resumeRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
