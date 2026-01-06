FROM eclipse-temurin:17-jre

WORKDIR /meter-reading-service

COPY target/meter-reading-service-*.jar app.jar

EXPOSE 8033

CMD ["java", "-jar", "app.jar"]