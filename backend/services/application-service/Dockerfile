FROM maven:3.9.6-eclipse-temurin-21-jammy AS builder
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=builder /app/services/application-service/target/*.jar app.jar
RUN mkdir -p /app/data
EXPOSE 8082
ENTRYPOINT ["java", "-Xmx256m", "-jar", "app.jar"]
