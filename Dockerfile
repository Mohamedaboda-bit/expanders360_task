# Build stage
FROM node:20-alpine as builder

# Create app directory
WORKDIR /usr/src/app

# Install build essentials
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev dependencies)
RUN npm install --legacy-peer-deps

# Copy the rest of the application
COPY . .

# Debug and build
RUN echo "Starting build process..." && \
    echo "Listing workspace contents:" && \
    ls -la && \
    echo "TypeScript version:" && \
    ./node_modules/.bin/tsc --version && \
    echo "NestJS CLI version:" && \
    ./node_modules/.bin/nest --version && \
    echo "Building project..." && \
    npm run build && \
    echo "Build completed, checking dist folder:" && \
    ls -la dist/ || echo "dist folder not found" && \
    if [ ! -f "dist/src/main.js" ]; then \
      echo "Build failed - dist/src/main.js not found" && \
      exit 1; \
    fi

# Production stage
FROM node:20-alpine

WORKDIR /usr/src/app

# Copy package files and TypeScript configuration
COPY package*.json ./
COPY tsconfig*.json ./
COPY typeorm.config.ts ./

# Install dependencies including those needed for migrations
RUN npm install --legacy-peer-deps

# Copy built application, migrations, seeders, and entities from builder stage
COPY --from=builder /usr/src/app/dist ./dist
COPY src/migrations ./src/migrations
COPY src/seeders ./src/seeders
COPY src/entities ./src/entities

# Copy startup script
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

# Expose port
EXPOSE 3000

# Switch to non-root user for security
USER node

# Start the server using the startup script
CMD ["./docker-entrypoint.sh"]
