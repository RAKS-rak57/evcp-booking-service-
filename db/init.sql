-- Initial schema for the EVCP Booking & Station Service

CREATE TABLE IF NOT EXISTS stations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    connector_type VARCHAR(30) NOT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS connectors (
    id SERIAL PRIMARY KEY,
    station_id INTEGER REFERENCES stations(id),
    status VARCHAR(20) DEFAULT 'AVAILABLE'
);

CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    station_id INTEGER REFERENCES stations(id),
    connector_id INTEGER REFERENCES connectors(id),
    status VARCHAR(20) DEFAULT 'RESERVED',
    start_time TIMESTAMP DEFAULT NOW(),
    hold_expires_at TIMESTAMP
);

-- Sample seed data for local testing
INSERT INTO stations (name, latitude, longitude, connector_type)
VALUES
    ('Anna Nagar Charging Hub', 13.0850, 80.2101, 'CCS2'),
    ('OMR Tech Park Station', 12.9716, 80.2431, 'Type2');

INSERT INTO connectors (station_id, status) VALUES (1, 'AVAILABLE'), (1, 'AVAILABLE'), (2, 'AVAILABLE');
