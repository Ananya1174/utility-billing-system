# Utility Billing System – Full Stack Application

A full-stack **Utility Billing System** designed to manage consumers, bills, payments, and admin operations in a secure and scalable way.  
The system follows a **microservices architecture** with a modern Angular frontend and Spring Boot backend services.
---
## Features
- Consumer registration and management
- Bill generation and bill history
- Secure payment processing
- Role-based access (Admin / Consumer)
- Microservices communication using Eureka
- Clean UI with Angular
- Centralized service discovery
---
## Tech Stack
### Frontend
- Angular
- TypeScript
- HTML, CSS
- Bootstrap / Custom Styling
### Backend
- Java 17
- Spring Boot
- Spring Security
- Spring Data JPA
- Spring Cloud Eureka
- OpenFeign (Inter-service communication)
### Database
- MySQL
### Tools
- Node.js
- Angular CLI
- Maven
- Git
---

## Project Structure

```

utility-billing-system/
│
├── frontend/                 # Angular Application
│
├── backend/
│   ├── service-registry/     
│   ├── config-service/           
│   ├── auth-service/    
│   ├── notification-service/      
│   ├── consumer-service/      
│   ├── meter-reading-service/
│   ├── billing-service/
│   ├── paymnet-service/
│   ├── api-gateway/
│   
│
└── README.md

````

---

##  Port Numbers 

| Service Name          | Port  |
|-----------------------|-------|
| Angular Frontend      | 4200  |
| Service Registry      | 8761  |
| Config Service        | 8888  |
| Auth Service          | 8030  |
| Notification Service  | 8036  |
| Consumer Service      | 8032  |
| Meter-Reading Service | 8033  |
| Billing Service       | 8034  |
| Payment Service       | 8035  |
| Api-Gateway           | 8031  |
| MongoDB               | 27017 |

> ⚠️ Make sure these ports are **free** before starting the application.

---

## Prerequisites (Install These First)

### Install Java
- Java Version: **Java 17**
```bash
java -version
````

### Install Node.js

* Required Version: **Node 20.19+**

```bash
node -v
npm -v
```

### Install Angular CLI

```bash
npm install -g @angular/cli
```

### Install MongoDB Compass

* Connect to localhost:27017 
* Or use cmd 
```bash 
mongod
```
* Note down **username** and **password**

### Install Maven

```bash
mvn -v
```

---

3. Update **application.yml / application.properties** in each backend service:

```properties
spring.data.mongodb.uri=mongodb://localhost:27017/
```

---

## Backend Setup (Spring Boot)

### Step 1: Start Service Registry

```bash
cd backend/service-
mvn clean install
mvn spring-boot:run
```

Open Eureka Dashboard:

```
http://localhost:8761
```

---

### Step 2: Start Backend Services (One by One)

#### Config Service

```bash
cd backend/config-service
mvn spring-boot:run
```

#### Auth Service

```bash
cd backend/auth-service
mvn spring-boot:run
```

#### Notification Service

```bash
cd backend/notification-service
mvn spring-boot:run
```

#### Consumer Service

```bash
cd backend/consumer-service
mvn spring-boot:run
```

#### Meter-Reading Service

```bash
cd backend/meter-reading-service
mvn spring-boot:run
```

#### Billing Service

```bash
cd backend/billing-service
mvn spring-boot:run
```

#### Payment Service

```bash
cd backend/payment-service
mvn spring-boot:run
```

#### Api-Gateway Service

```bash
cd backend/api-gateway
mvn spring-boot:run
```

Verify all services appear in **Eureka Dashboard**

---

## Frontend Setup (Angular)

### Step 1: Install Dependencies

```bash
cd frontend/utility-billing-system
npm install
```

### Step 2: Run Angular App

```bash
ng serve
```

✔ Open in browser:

```
http://localhost:4200
```

---

## Common Issues & Fixes

### Port Already in Use

```bash
lsof -i :PORT_NUMBER
kill -9 PID
```

### Node Version Issue

```bash
nvm use 20.19.0
```

### Angular Build Error

```bash
rm -rf node_modules
npm install
```

---

## Build for Production

### Frontend

```bash
ng build
```

### Backend

```bash
mvn clean package
```

---