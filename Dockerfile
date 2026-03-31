# Stage 1: Build the React Frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend-react
COPY frontend-react/package*.json ./
RUN npm install
COPY frontend-react/ ./
RUN npm run build

# Stage 2: Build the Spring Boot Backend
FROM maven:3.9.6-eclipse-temurin-21 AS backend-build
WORKDIR /app
# Copy the backend source
COPY backend/ ./backend/
# Copy the built frontend into Spring Boot's static resources
RUN mkdir -p backend/src/main/resources/static && rm -rf backend/src/main/resources/static/* || true
COPY --from=frontend-build /app/frontend-react/dist/ ./backend/src/main/resources/static/
# Build the Spring Boot app
WORKDIR /app/backend
RUN mvn clean package -DskipTests

# Stage 3: Run the Application
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=backend-build /app/backend/target/*.jar app.jar
EXPOSE 8080
ENV PORT=8080
ENTRYPOINT ["sh", "-c", "java -jar app.jar --server.port=${PORT}"]
