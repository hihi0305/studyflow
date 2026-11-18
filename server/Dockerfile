# Dockerfile for Express REST API Server
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

# Run database migrations and start server
CMD ["npm", "start"]