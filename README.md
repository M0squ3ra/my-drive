# My Drive

My Drive is a simple file storage service comprised of a Spring Boot-based backend for managing files, a REST API for communicating with the backend, and a user-friendly web application.
Feel free to use this code in your projects.

## Requirements 
- Postgresql
- npm

## Setup
Create a Postgresql user, go to the application.properties file and put your username on the spring.datasource.username line and your password on the spring.datasource.password line.

## Usage

Start Backend
```bash
cd api
mvn spring-boot:run 
```

Start WebApp
```bash
cd app
npm start
```

The WebApp is running on http://localhost:3000
