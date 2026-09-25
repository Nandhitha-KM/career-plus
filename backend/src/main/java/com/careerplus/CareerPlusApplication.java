package com.careerplus;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CareerPlusApplication {

    public static void main(String[] args) {
        SpringApplication.run(CareerPlusApplication.class, args);
        System.out.println("==================================================");
        System.out.println(" Career Plus Spring Boot Server is running on port 8080");
        System.out.println(" SQLite Database: career_plus.db");
        System.out.println("==================================================");
    }
}
