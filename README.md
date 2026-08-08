# EVCP Booking & Station Service

Station discovery and charging-slot reservation microservice for the **Smart EV Charging
Network Management Platform (EVCP)** — the same platform analyzed in the CO1/CO2
assessments (Case Study, Agile Sprint Planning, Requirement Analysis, Architecture Design).

This service implements the **Station & Booking Service** identified in the platform's
microservices architecture (see `docs/architecture.png`), responsible for:

- Searching nearby charging stations
- Checking real-time slot availability (cached via Redis)
- Reserving a charging slot with a 15-minute hold window

## Tech Stack
- **Node.js + Express** — REST API layer
- **PostgreSQL** — transactional storage for stations and bookings
- **Redis** — caching layer for live availability lookups

## Project Structure
```
evcp-booking-service/
├── src/
│   ├── server.js           # App entry point
│   ├── config/
│   │   └── db.js           # PostgreSQL + Redis connection setup
│   ├── models/
│   │   └── booking.model.js
│   ├── routes/
│   │   ├── stations.routes.js
│   │   └── bookings.routes.js
│   └── middleware/
│       └── errorHandler.js
├── tests/
│   └── bookings.test.js
├── Dockerfile
├── docker-compose.yml
├── .env.example
└── package.json
```

## Running Locally
```bash
npm install
cp .env.example .env
npm run dev
```

## Running with Docker
```bash
docker-compose up --build
```

The API will be available at `http://localhost:3000`.

## API Endpoints
| Method | Endpoint                        | Description                        |
|--------|----------------------------------|-------------------------------------|
| GET    | `/api/stations?lat=&lng=&radius=` | Search nearby stations              |
| GET    | `/api/stations/:id/availability`  | Get real-time slot availability     |
| POST   | `/api/bookings`                   | Reserve a charging slot             |
| GET    | `/api/bookings/:id`                | Get booking status                  |
| GET    | `/health`                          | Service health check                |
