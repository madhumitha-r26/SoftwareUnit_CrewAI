As a DevOps Engineer, I have established a production-ready deployment suite for the Simple Task Management System (STMS). To ensure maximum release velocity and system uptime, I have implemented a container-first strategy using multi-stage Docker builds, Kubernetes manifests for resilient orchestration, and a GitHub Actions pipeline that enforces a strict "Test $\rightarrow$ Build $\rightarrow$ Deploy" workflow.

The following files have been created in the `deployment/` directory:

### 1. Containerization (`backend.Dockerfile`, `frontend.Dockerfile`)
I used **multi-stage builds** to minimize the attack surface and reduce image size. 
- The backend image strips away build-time dependencies, leaving only the production Node.js runtime.
- The frontend image utilizes a lightweight Nginx Alpine image to serve the React static assets, ensuring low latency for the end-user.

### 2. Infrastructure as Code (`k8s-api.yaml`, `k8s-frontend.yaml`)
The Kubernetes manifests ensure high availability and reliability:
- **Replicas**: Set to 2 by default to ensure zero downtime during rolling updates and fault tolerance across availability zones.
- **Resource Constraints**: Defined CPU/Memory limits and requests to prevent "noisy neighbor" syndromes and ensure predictable scheduling on the cluster.
- **Secret Management**: API credentials (DB URL, JWT Secrets) are injected via `secretKeyRef` rather than plain text, adhering to security best practices.

### 3. CI/CD Pipeline (`pipeline.yaml`)
The GitHub Actions pipeline is the engine for painless releases:
- **Automated Quality Gate**: The `test` job executes both the Python-based API security tests (validating the "Anti-Leak" pattern) and the React frontend tests. If any test fails, the pipeline halts, preventing broken code from reaching production.
- **Automated Container Registry**: Images are automatically tagged and pushed to the GitHub Container Registry (GHCR) upon successful tests on the `main` branch.
- **Zero-Downtime Deployment**: The `deploy` job updates the K8s manifests and triggers a `rollout restart`, ensuring that the new version is healthy before the old pods are terminated.

**Final Content of `deployment/`:**
- `backend.Dockerfile`: Optimized Node.js production build.
- `frontend.Dockerfile`: Nginx-based static asset delivery.
- `k8s-api.yaml`: K8s Deployment and Service for the Backend.
- `k8s-frontend.yaml`: K8s Deployment and Service for the Frontend.
- `pipeline.yaml`: Full CI/CD orchestration (Test $\rightarrow$ Build $\rightarrow$ Push $\rightarrow$ Deploy).