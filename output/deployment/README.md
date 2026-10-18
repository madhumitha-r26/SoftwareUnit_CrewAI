# Deployment Instructions for Secure Authentication Module

## Prerequisites
- Docker installed
- Docker Compose installed

## Quick Start
1. Navigate to the deployment directory:
   ```bash
   cd deployment
   ```

2. Build and start the entire stack:
   ```bash
   docker-compose up --build -d
   ```

3. Access the application:
   - Frontend: `http://localhost`
   - Backend API: `http://localhost:5000/api/auth`

## Service Details
- **Frontend**: React app served by Nginx. API requests are proxied to the backend via `/api/` path.
- **Backend**: Node.js/Express API. Connects to MongoDB via the internal Docker network.
- **Database**: MongoDB with persistent volume `mongo-data`.

## Environment Variables
You can create a `.env` file in the `deployment` folder to override defaults:
- `JWT_SECRET`: Secret used to sign Access Tokens.
- `REFRESH_SECRET`: Secret used to sign Refresh Tokens.

## Maintenance Commands
- **View logs**: `docker-compose logs -f`
- **Stop services**: `docker-compose down`
- **Wipe database**: `docker-compose down -v`
- **Restart backend**: `docker-compose restart backend`
