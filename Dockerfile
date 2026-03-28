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

# Add default nginx server configuration with enhanced security headers
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    \
    # Hide nginx version \
    server_tokens off; \
    \
    # Security headers \
    add_header X-Frame-Options "DENY" always; \
    add_header X-Content-Type-Options "nosniff" always; \
    add_header X-XSS-Protection "1; mode=block" always; \
    add_header Referrer-Policy "no-referrer" always; \
    add_header Content-Security-Policy "default-src '"'"'self'"'"'; script-src '"'"'self'"'"' '"'"'unsafe-inline'"'"'; style-src '"'"'self'"'"' '"'"'unsafe-inline'"'"'; img-src '"'"'self'"'"' data: https:; font-src '"'"'self'"'"' data:; connect-src '"'"'self'"'"' https://*; frame-ancestors '"'"'none'"'"';" always; \
    add_header Cross-Origin-Embedder-Policy "require-corp" always; \
    add_header Cross-Origin-Opener-Policy "same-origin" always; \
    add_header Cross-Origin-Resource-Policy "same-origin" always; \
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()" always; \
    \
    # Angular routing support \
    location / { \
        try_files $uri $uri/ /index.html; \
        add_header Cache-Control "no-store, no-cache, must-revalidate, max-age=0" always; \
        add_header Pragma "no-cache" always; \
    } \
    \
    # Cache static assets (immutable content) \
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ { \
        expires 1y; \
        add_header Cache-Control "public, immutable"; \
    } \
    \
    # Service worker - no cache \
    location /ngsw.json { \
        expires off; \
        add_header Cache-Control "no-store, no-cache, must-revalidate"; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
