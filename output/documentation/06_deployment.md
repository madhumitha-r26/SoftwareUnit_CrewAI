The Docker-based deployment for the Enterprise Task Management System (TMS) has been successfully configured under `deployment/`. This setup ensures a repeatable, production-ready environment with service orchestration, persistent data, and health monitoring.

### Deployment Architecture Summary
- **Frontend**: Multi-stage build. React is compiled into static assets and served via **Nginx**. Nginx is configured as a reverse proxy to forward `/api` requests to the backend, solving CORS issues.
- **Backend**: Node.js environment optimized for production. It includes a **Health Check** that monitors the `/api/tasks/stats` endpoint to ensure the service is operational.
- **Database**: MongoDB 6.0 with a **Named Volume** (`mongo-data`) to ensure that all task and user data persists across container restarts and updates.
- **Orchestration**: `docker-compose` manages the lifecycle, using `service_healthy` conditions to ensure the backend only starts once MongoDB is fully initialized.

### Files Created
| File | Path | Purpose |
| :--- | :--- | :--- |
| `Dockerfile` | `deployment/frontend/Dockerfile` | Multi-stage React $\rightarrow$ Nginx build. |
| `nginx.conf` | `deployment/frontend/nginx.conf` | Nginx config for SPA routing and API proxying. |
| `Dockerfile` | `deployment/backend/Dockerfile` | Node.js runtime with health checks. |
| `docker-compose.yml`| `deployment/docker-compose.yml` | Service orchestration, networking, and persistence. |
| `README.md` | `deployment/README.md` | Operational instructions and access points. |

### Run Instructions

1. **Launch the Application**:
   ```bash
   cd deployment
   docker-compose up -d --build
   ```

2. **Verify Health**:
   ```bash
   docker compose ps
   ```

3. **Access Services**:
   - **Web UI**: `http://localhost`
   - **API**: `http://localhost:5000/api`

4. **Cleanup**:
   ```bash
   # Stop containers
   docker compose down
   
   # Stop and wipe all persistent data
   docker compose down -v
   ```