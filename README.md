# 🌱 EcoTrack — Carbon Footprint Tracker

EcoTrack is a full-stack application that helps users track, analyze, and reduce their carbon footprint through intelligent insights and real-time analytics.

---

## 🚀 Features

### 🔐 Authentication

* JWT-based login & registration
* Secure token refresh flow

### 📊 Carbon Tracking

* Log emissions across categories:

    * Transport
    * Diet
    * Energy
    * Waste
* Activity-based emission calculation (India-specific)

### 📈 Analytics Dashboard

* Monthly carbon summary
* Category-wise breakdown
* Weekly trends (time-series)
* Threshold-based alerts

### 🤖 AI Insights

* Personalized sustainability insights
* Powered by local LLM via Ollama

### 🛠 Record Management

* Full history with pagination
* Update/Delete records

---

## 🧱 Tech Stack

### Backend

* Java + Spring Boot
* Spring Security + JWT
* PostgreSQL (Docker)
* Flyway (DB migrations)

### Frontend

* Next.js (App Router)
* Tailwind CSS
* Axios
* Recharts

### AI

* Ollama (local models: Mistral / DeepSeek)

---

## 🏗 Architecture

```text
Frontend (Next.js)
        ↓
Backend (Spring Boot REST APIs)
        ↓
PostgreSQL (Docker)
        ↓
Ollama (Local AI)
```

---

## ⚙️ Environment Setup

### Backend `.env`

```
DB_NAME=
DB_USER=
DB_PASSWORD=
DB_PORT=
JWT_SECRET=
JWT_EXPIRATION=
REFRESH_EXPIRATION=
```

---

## 🐳 Run Backend

```bash
docker run -d \
  --name ecotrack-db \
  -e POSTGRES_DB=ecotrack \
  -e POSTGRES_USER=youruser \
  -e POSTGRES_PASSWORD=yourpass \
  -p 5432:5432 postgres:15-alpine
```

```bash
./mvnw spring-boot:run
```

---

## 💻 Run Frontend

```bash
cd ecotrack-frontend
npm install
npm run dev
```

---

## 🔌 API Overview

### Auth

* `POST /auth/register`
* `POST /auth/login`
* `POST /auth/refresh`

### User

* `POST /user/build`

### Records

* `POST /record/enter`
* `PUT /record/update`
* `DELETE /record/delete`
* `GET /record/gettop`
* `GET /record/history`

### Analytics

* `GET /analytics/summary`
* `GET /analytics/breakdown`
* `GET /analytics/trends/weekly`
* `GET /analytics/alert`
* `GET /analytics/insights`

---

## 🔐 Security

* BCrypt password hashing
* Stateless JWT authentication
* Role-ready architecture

---

## 📌 Future Improvements

* Real-time alerts (WebSockets)
* Carbon offset suggestions
* Multi-user group tracking
* Mobile app (Flutter)

---

## 👨‍💻 Author

**Koustav Sarkar**
MCA @ NIT Raipur

---
