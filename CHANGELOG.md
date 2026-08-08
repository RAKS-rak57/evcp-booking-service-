# Changelog

## [1.0.0] - Release Branch

### Added
- Express application scaffold with `/health` endpoint
- PostgreSQL and Redis connection configuration
- Station search endpoint (`GET /api/stations`) with radius-based lookup
- Real-time availability endpoint with Redis caching (`GET /api/stations/:id/availability`)
- Slot reservation endpoint with 15-minute hold window (`POST /api/bookings`)
- Booking status lookup (`GET /api/bookings/:id`)
- Request logging and rate-limiting middleware
- Dockerfile (non-root user, container health check)
- docker-compose.yml with booking-api, PostgreSQL, and Redis services
- Database initialization script with seed data
- Unit tests for booking hold-window logic

### Notes
This release corresponds to Sprint 1 of the Agile Sprint Planning workshop (CO1-AT2):
US1 (Search Nearby Stations), US2 (Real-time Availability), and US3 (Reserve Charging Slot).
