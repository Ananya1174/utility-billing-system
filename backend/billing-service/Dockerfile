FROM eclipse-temurin:17-jre

WORKDIR /billing-service

COPY target/billing-service-*.jar app.jar

EXPOSE 8034

CMD ["java", "-jar", "app.jar"]