FROM node:18-alpine
WORKDIR /app
# Install production dependencies only
COPY package*.json ./
RUN npm ci --only=production
# Copy source code
COPY . .
# Use non-root user for security
USER node
EXPOSE 5000
CMD ["node", "src/server.js"]
