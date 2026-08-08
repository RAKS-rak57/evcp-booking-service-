# ---- Base image ----
# Slim Node.js LTS image keeps the final image small and reduces attack surface
FROM node:20-alpine AS base

# Set working directory inside the container
WORKDIR /usr/src/app

# ---- Dependency installation (cached layer) ----
# Copy only package files first so npm install is cached unless dependencies change
COPY package*.json ./
RUN npm install --omit=dev

# ---- Application source ----
COPY src ./src
COPY .env.example ./.env.example

# Create a non-root user and switch to it for security
RUN addgroup -S evcp && adduser -S evcp -G evcp
USER evcp

# Document the port the service listens on
EXPOSE 3000

# Container-level health check hitting the /health endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Start the service
CMD ["node", "src/server.js"]
