package com.careerplus.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ApplicationServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(ApplicationServiceApplication.class, args);
        System.out.println("=========================================================");
        System.out.println("💼 Career Plus Application Service Running on Port 8082");
        System.out.println("=========================================================");
    }
}
