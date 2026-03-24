# 🏫 Campus Lost & Found

A web application for managing lost and found items on campus.

## Prerequisites

- **Java 17 or higher** — [Download here](https://www.oracle.com/java/technologies/downloads/)

> That's it! No database setup needed — the app uses an in-memory H2 database.

## How to Run

### Windows
```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

### Mac / Linux
```bash
cd backend
chmod +x mvnw
./mvnw spring-boot:run
```

### If you get a `JAVA_HOME` error
Set it before running:

**Windows (PowerShell):**
```powershell
$env:JAVA_HOME = 'C:\Program Files\Java\jdk-21'   # adjust to your Java path
.\mvnw.cmd spring-boot:run
```

**Mac/Linux:**
```bash
export JAVA_HOME=/usr/lib/jvm/java-21   # adjust to your Java path
./mvnw spring-boot:run
```

## Open the App

Once you see `Started LostAndFoundApplication`, open your browser and go to:

### 👉 **http://localhost:8080**

## Features

- 📋 Report lost or found items
- 🔍 Browse and search items by category, status, or keyword
- 📊 Dashboard with stats
- 🗄️ H2 console for debugging: http://localhost:8080/h2-console

## Tech Stack

| Layer    | Technology               |
|----------|--------------------------|
| Backend  | Spring Boot 3.2, Java 17 |
| Frontend | HTML, CSS, JavaScript    |
| Database | H2 (in-memory)           |
