# Build stage
FROM node:22.12.0-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
# Skip prepare script to avoid husky installation
RUN npm ci --ignore-scripts

# Copy source code
COPY . .

# Build the application
RUN npm run build:uat

# Production stage
FROM nginx:alpine

# Apply security updates for runtime OS packages to remediate image CVEs.
RUN apk update && apk upgrade --no-cache libexpat zlib

# Copy built application
COPY --from=build /app/dist/hiking-rental-store-web /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
