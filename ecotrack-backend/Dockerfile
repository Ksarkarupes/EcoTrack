FROM openjdk:21-jdk-slim

WORKDIR /app

COPY target/ecotrack-backend-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-Djava.net.preferIPv4Stack=true", "-jar", "app.jar"]