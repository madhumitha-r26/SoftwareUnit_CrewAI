The Docker-based deployment for the Secure Authentication Module has been successfully created under the `deployment` directory. This setup provides a professional, reproducible environment with optimized containers, a reverse proxy for the frontend, and persistent storage for the database.

### Deployment Summary

#### 1. Frontend (`deployment/frontend`)
- **Multi-stage Build**: Uses a Node.js build stage to compile the React app and a lightweight Nginx Alpine stage to serve the static assets.
- **Nginx Configuration**: includes a custom `nginx.conf` that handles Single Page Application (SPA) routing (redirecting all 404s to `index.html`) and acts as a reverse proxy, forwarding `/api/` requests to the backend container.

#### 2. Backend (`deployment/backend`)
- **Security-Hardened**: Uses a Node.js Alpine image and switches to a non-root `node` user to minimize the attack surface.
- **Optimized**: Uses `npm ci --only=production` to ensure only necessary dependencies are installed in the production image.

#### 3. Orchestration (`deployment/docker-compose.yml`)
- **Service Discovery**: Services communicate via the internal Docker bridge network (e.g., backend connects to `mongodb:27017`).
- **Health Checks**: 
    - **MongoDB**: Ensures the database is ready to accept connections before the backend starts.
    - **Backend**: Monitors the `/api/auth/refresh` endpoint to ensure the API is healthy.
- **Persistence**: A named volume `mongo-data` is used to ensure user records persist across container restarts and updates.
- **Environment Management**: Supports variable substitution for `JWT_SECRET` and `REFRESH_SECRET` via a `.env` file.

### Final File Structure
```text
deployment/
├── docker-compose.yml
├── README.md
├── frontend/
│   ├── Dockerfile
│   └── nginx.conf
└── backend/
    └── Dockerfile
```

### How to Run
1. Ensure you have the source code in `./frontend` and `./backend` relative to the deployment folder.
2. Execute:
   ```bash
   cd deployment
   docker-compose up --build -d
   ```
3. Access the app at `http://localhost`.