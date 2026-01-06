FROM eclipse-temurin:17-jre

WORKDIR /consumer-service

COPY target/consumer-service-*.jar app.jar

EXPOSE 8032

CMD ["java", "-jar", "app.jar"]