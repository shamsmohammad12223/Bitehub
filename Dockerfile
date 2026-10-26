FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /workspace
COPY pom.xml .
COPY src ./src
RUN mvn -B -DskipTests package

FROM eclipse-temurin:17-jre

WORKDIR /app
COPY --from=build /workspace/target/bitehub-1.0.0.jar ./app.jar

EXPOSE 10000
ENTRYPOINT ["sh", "-c", "exec java -jar /app/app.jar --spring.datasource.url=jdbc:postgresql://${DB_HOST}:${DB_PORT}/${DB_NAME} --spring.datasource.driver-class-name=org.postgresql.Driver"]
