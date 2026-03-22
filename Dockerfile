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

# Add default nginx server configuration
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    \
    # Security headers \
    add_header X-Frame-Options "SAMEORIGIN" always; \
    add_header X-Content-Type-Options "nosniff" always; \
    add_header X-XSS-Protection "1; mode=block" always; \
    add_header Referrer-Policy "strict-origin-when-cross-origin" always; \
    \
    # Angular routing support \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    \
    # Cache static assets \
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ { \
        expires 1y; \
        add_header Cache-Control "public, immutable"; \
    } \
    \
    # Service worker \
    location /ngsw.json { \
        expires off; \
        add_header Cache-Control "no-cache"; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
