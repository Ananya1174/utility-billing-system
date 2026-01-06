FROM eclipse-temurin:17-jre

WORKDIR /payment-service

COPY target/payment-service-*.jar app.jar

EXPOSE 8035

CMD ["java", "-jar", "app.jar"]