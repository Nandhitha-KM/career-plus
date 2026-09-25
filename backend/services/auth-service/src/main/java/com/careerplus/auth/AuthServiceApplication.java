package com.careerplus.auth;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AuthServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(AuthServiceApplication.class, args);
        System.out.println("=================================================");
        System.out.println("🔒 Career Plus Auth Service Running on Port 8081");
        System.out.println("=================================================");
    }
}
