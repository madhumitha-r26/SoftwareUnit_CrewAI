# Build stage for React frontend
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage using Nginx
FROM nginx:stable-alpine
# Copy build files from previous stage
COPY --from=build /app/build /usr/share/nginx/html
# Copy custom nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
