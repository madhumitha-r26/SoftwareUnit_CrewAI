# Build Stage for Dockerized Backend
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build # Assuming a build step for TypeScript/NestJS

# Production Stage
FROM node:18-alpine
WORKDIR /app
COPY --from=build /app/package*.json ./
RUN npm install --only=production
COPY --from=build /app/dist ./dist 

EXPOSE 3000
CMD ["node", "dist/server.js"]
