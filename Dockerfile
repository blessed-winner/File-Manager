# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy configuration files
COPY package*.json ./
COPY tsconfig*.json ./

# Install all dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Copy only the production dependencies and the built dist folder
COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist

# Use a non-root user for security
USER node

EXPOSE 3000

CMD ["node", "dist/main"]