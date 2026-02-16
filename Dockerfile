# Build Stage 1: Frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install
COPY frontend/ ./frontend/
RUN cd frontend && npm run build

# Build Stage 2: Backend & Final Image
FROM node:20-alpine
WORKDIR /usr/src/app

# Copy backend dependencies
COPY backend/package*.json ./
RUN npm install --production

# Copy backend source
COPY backend/ ./

# Copy frontend build from Stage 1
COPY --from=frontend-build /app/frontend/dist ./dist

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

# Start command
CMD ["npm", "start"]
