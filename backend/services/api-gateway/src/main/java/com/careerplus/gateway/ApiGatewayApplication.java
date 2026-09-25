package com.careerplus.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ApiGatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
        System.out.println("=====================================================================");
        System.out.println("🌐 Career Plus API Gateway Microservice Running on Port 8080");
        System.out.println("   --> Routing /api/auth/** to Auth Service (Port 8081)");
        System.out.println("   --> Routing /api/applications/** to Application Service (Port 8082)");
        System.out.println("=====================================================================");
    }
}
