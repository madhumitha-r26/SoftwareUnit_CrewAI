FROM node:18-alpine
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --production

# Copy source code
COPY . .

# The app runs on 5000
EXPOSE 5000

# Healthcheck to ensure Node.js is responsive
HEALTHCHECK --interval=30s --timeout=3s \
  CMD node -e "require('http').get('http://localhost:5000/api/tasks/stats', (res) => res.statusCode === 200 ? process.exit(0) : process.exit(1))"

CMD ["npm", "start"]
