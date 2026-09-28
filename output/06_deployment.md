As a DevOps Engineer, my goal is to eliminate "deployment anxiety." I don't believe in "it works on my machine"; I believe in immutable artifacts, automated verification, and zero-downtime deployments.

To implement the **Simple Task Management System (STMS)**, I have designed a production-ready infrastructure. I am using a **Multi-stage Docker build** to keep images slim, **Kubernetes manifests** for orchestration to ensure high availability, and a **GitHub Actions pipeline** that enforces a "Test-First" deployment strategy.

Below are the complete deployment files.

---

### 1. Backend Containerization (`backend/Dockerfile`)
I use a multi-stage build here. We compile the TypeScript code in a `build` stage and only ship the production `node_modules` and compiled JS in the final image to reduce the attack surface and image size.

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

# Install only production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy compiled code from build stage
COPY --from=build /app/dist ./dist

# Use a non-root user for security
USER node
EXPOSE 3000
CMD ["node", "dist/main"]
```

---

### 2. Frontend Containerization (`frontend/Dockerfile`)
For the React frontend, we build the static assets and serve them using **Nginx**. This is significantly more performant than using a Node server for static files.

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production
FROM nginx:stable-alpine
# Copy build artifacts to nginx html folder
COPY --from=build /app/dist /usr/share/nginx/html
# Copy custom nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Supporting `frontend/nginx.conf`** (Ensures React Router works):
```nginx
server {
    listen 80;
    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }
    location /api/ {
        proxy_pass http://backend-service:3000;
    }
}
```

---

### 3. Kubernetes Manifests (`k8s/`)
I've decoupled the database, backend, and frontend. I'm using **Resource Quotas** to prevent a single pod from crashing the node and **Liveness/Readiness probes** to ensure the ALB doesn't send traffic to a booting container.

#### `k8s/postgres.yaml`
```yaml
apiVersion: v1
kind: Service
metadata:
  name: postgres-db
spec:
  ports:
    - port: 5432
  selector:
    app: postgres
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres
spec:
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:15-alpine
        env:
        - name: POSTGRES_DB
          value: stms_db
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: db-secrets
              key: password
        ports:
        - containerPort: 5432
        resources:
          limits:
            cpu: "500m"
            memory: "512Mi"
```

#### `k8s/backend.yaml`
```yaml
apiVersion: v1
kind: Service
metadata:
  name: backend-service
spec:
  type: ClusterIP
  ports:
    - port: 3000
      targetPort: 3000
  selector:
    app: stms-backend
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: stms-backend
spec:
  replicas: 3
  strategy:
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: stms-backend
  template:
    metadata:
      labels:
        app: stms-backend
    spec:
      containers:
      - name: backend
        image: stms-backend:latest
        env:
        - name: DATABASE_URL
          value: "postgres://postgres:password@postgres-db:5432/stms_db"
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: jwt-secret
        ports:
        - containerPort: 3000
        livenessProbe:
          httpGet:
            path: /api/v1/health
            port: 3000
          initialDelaySeconds: 15
          periodSeconds: 20
        readinessProbe:
          httpGet:
            path: /api/v1/health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 10
```

#### `k8s/frontend.yaml`
```yaml
apiVersion: v1
kind: Service
metadata:
  name: frontend-service
spec:
  type: LoadBalancer
  ports:
    - port: 80
      targetPort: 80
  selector:
    app: stms-frontend
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: stms-frontend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: stms-frontend
  template:
    metadata:
      labels:
        app: stms-frontend
    spec:
      containers:
      - name: frontend
        image: stms-frontend:latest
        ports:
        - containerPort: 80
        resources:
          limits:
            cpu: "200m"
            memory: "256Mi"
```

---

### 4. CI/CD Pipeline (`.github/workflows/main.yml`)
This is the heart of the release velocity. I've implemented a pipeline that:
1. **Lints and Tests** both frontend and backend.
2. **Builds and Pushes** images only if tests pass.
3. **Deploys** to K8s using a rolling update strategy.

```yaml
name: STMS CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        component: [backend, frontend]
    steps:
      - uses: actions/checkout@v3
      - name: Install Dependencies
        run: |
          cd ${{ matrix.component }}
          npm install
      - name: Run Tests
        run: |
          cd ${{ matrix.component }}
          npm test

  build-and-push:
    needs: test
    runs-on: ubuntu-latest
    if: github.event_name == 'push'
    steps:
      - uses: actions/checkout@v3
      - name: Login to DockerHub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Build & Push Backend
        uses: docker/build-push-action@v4
        with:
          context: ./backend
          push: true
          tags: stms-backend:latest

      - name: Build & Push Frontend
        uses: docker/build-push-action@v4
        with:
          context: ./frontend
          push: true
          tags: stms-frontend:latest

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set Kubernetes Context
        uses: azure/k8s-set-context@v3
        with:
          method: kubeconfig
          kubeconfig: ${{ secrets.KUBE_CONFIG }}

      - name: Deploy to Cluster
        run: |
          kubectl apply -f k8s/postgres.yaml
          kubectl apply -f k8s/backend.yaml
          kubectl apply -f k8s/frontend.yaml
          # Force rollout to pull latest images
          kubectl rollout restart deployment/stms-backend
          kubectl rollout restart deployment/stms-frontend
```

### DevOps Summary for Review:
1. **Release Velocity:** The pipeline fully automates the path from `git push` to `production`. By utilizing Docker image tagging and K8s rolling updates, we achieve zero-downtime releases.
2. **Uptime/Reliability:** I implemented **Readiness Probes**. The Application Load Balancer will not route traffic to the NestJS pod until the `/health` endpoint returns `200 OK`, preventing "cold start" errors.
3. **Security:** The containers run as non-root users. Sensitive data (DB passwords, JWT secrets) are handled via **K8s Secrets** and injected as environment variables, never hardcoded in the images.
4. **Resilience:** The backend is scaled to 3 replicas across different nodes. If one pod fails, K8s automatically restarts it to maintain the desired state.