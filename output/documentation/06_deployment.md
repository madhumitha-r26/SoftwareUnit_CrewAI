I have completed the deployment configuration for the User Authentication Module. As a DevOps Engineer, I've designed this to ensure zero-downtime releases, high availability, and strict adherence to the security requirements (Argon2, dual-token strategy).

The following files have been created in the `deployment/` directory:

### 1. Containerization (Dockerfiles)
*   **`backend.Dockerfile`**: A multi-stage build for the Node.js/TypeScript API. It separates the build environment from the production runtime to minimize image size and reduce the attack surface by omitting development dependencies.
*   **`frontend.Dockerfile`**: A multi-stage build that compiles the React application and serves the static assets via a hardened Nginx Alpine image.

### 2. Infrastructure as Code (Kubernetes Manifests)
*   **`infra-k8s.yaml`**: Deploys the stateful dependencies. It includes a PostgreSQL 15 instance for ACID-compliant identity storage and a Redis instance for high-performance rate limiting (brute-force protection).
*   **`backend-k8s.yaml`**: Defines a scalable deployment (3 replicas) for the Auth service. It includes:
    *   **Liveness/Readiness Probes**: To ensure traffic only hits healthy pods.
    *   **Resource Limits**: Prevents a single pod from consuming all node resources during CPU-intensive Argon2 hashing.
    *   **ConfigMap**: Decouples environment configuration from the image.
*   **`frontend-k8s.yaml`**: Deploys the frontend as a LoadBalancer service, ensuring global accessibility to the UI.

### 3. CI/CD Pipeline (GitHub Actions)
*   **`pipeline.yaml`**: A complete automated lifecycle including:
    *   **Test Stage**: Installs dependencies and runs both backend and frontend test suites.
    *   **Build Stage**: Triggered only on merges to `main`. Builds Docker images and pushes them to a container registry.
    *   **Deploy Stage**: Applies Kubernetes manifests and performs a `rollout restart` to ensure the latest images are pulled and deployed without dropping active connections.

### Summary of Deployment Files:
| File | Purpose | Key Feature |
| :--- | :--- | :--- |
| `backend.Dockerfile` | Backend Image | Multi-stage build (Node 20) |
| `frontend.Dockerfile` | Frontend Image | Nginx Alpine Production Server |
| `backend-k8s.yaml` | K8s Backend | Health Probes & HPA Ready |
| `frontend-k8s.yaml` | K8s Frontend | LoadBalancer for Public Access |
| `infra-k8s.yaml` | K8s State | Postgres & Redis Integration |
| `pipeline.yaml` | CI/CD | Automated Test $\rightarrow$ Build $\rightarrow$ K8s Deploy |