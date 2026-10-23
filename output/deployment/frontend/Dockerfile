# Multi-stage build for React Frontend
# Stage 1: Build
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production Serve with Nginx
FROM nginx:stable-alpine
# Copy build files from stage 1
COPY --from=build /app/build /usr/share/nginx/html
# Copy custom nginx config to handle React routing
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
