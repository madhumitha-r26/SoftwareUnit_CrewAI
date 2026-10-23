# ==============================================================================
# Enterprise Task Management System (TMS) - Deployment Instructions
# ==============================================================================
# 
# This directory contains the production-ready Docker configuration for the 
# TMS stack (React, Node.js, MongoDB).
#
# ------------------------------------------------------------------------------
# 1. PREREQUISITES
# ------------------------------------------------------------------------------
# - Docker installed (v20.10+)
# - Docker Compose installed (v2.0+)
#
# ------------------------------------------------------------------------------
# 2. QUICK START
# ------------------------------------------------------------------------------
# To launch the entire system in detached mode:
#
#   docker-compose up -d --build
#
# This command will:
#   a) Build the frontend image (with Nginx stage)
#   b) Build the backend image
#   c) Pull and start MongoDB 6.0
#   d) Establish a persistent volume for MongoDB data
#   e) Wire the network so frontend -> backend -> mongo
#
# ------------------------------------------------------------------------------
# 3. SERVICE ACCESS
# ------------------------------------------------------------------------------
# - Frontend UI: http://localhost
# - Backend API: http://localhost:5000/api
# - MongoDB: localhost:27017
#
# ------------------------------------------------------------------------------
# 4. OPERATIONAL COMMANDS
# ------------------------------------------------------------------------------
# Check logs for the backend:
#   docker compose logs -f backend
#
# View health status of containers:
#   docker compose ps
#
# Stop and remove all containers and networks:
#   docker compose down
#
# Wipe data (including MongoDB volumes):
#   docker compose down -v
#
# ------------------------------------------------------------------------------
# 5. CONFIGURATION NOTES
# ------------------------------------------------------------------------------
# - Environment variables are managed in docker-compose.yml for simplicity.
# - MongoDB data is persisted in the 'mongo-data' volume, surviving restarts.
# - The Frontend uses Nginx as a reverse proxy to forward /api requests to 
#   the backend, eliminating CORS issues in production.
# ==============================================================================
