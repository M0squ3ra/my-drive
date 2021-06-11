# My Drive

My Drive is a simple file storage service comprised of a Spring Boot-based backend for managing files, a REST API for communicating with the backend, and a user-friendly web application.
Feel free to use this code in your projects.

## Requirements 
- Postgresql
- Node Package Manager (npm)
- Maven (mvn)

## Setup
- Create a Postgresql user and a database
- Go to the application.properties file modify the lines 2,3 and 4 with your username, password and the url of the database. The first lines should look like this:
```
#Database
spring.datasource.url=jdbc:postgresql://localhost:5432/mydrive
spring.datasource.username=postgres
spring.datasource.password=password
```
- Install node modules:
```bash
cd app
npm install 
```

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

The WebApp is running on http://localhost:3000. The login page is in http://localhost:3000/auth/login
