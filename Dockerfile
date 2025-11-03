# Build stage
FROM node:18.20.4-alpine AS build

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
    add_header Content-Security-Policy "default-src '\''self'\''; script-src '\''self'\'' '\''unsafe-inline'\'' '\''unsafe-eval'\''; style-src '\''self'\'' '\''unsafe-inline'\'' https://fonts.googleapis.com; font-src '\''self'\'' https://fonts.gstatic.com; img-src '\''self'\'' data: https:; connect-src '\''self'\'' https://js.stripe.com https://api.stripe.com; frame-src https://js.stripe.com;" always; \
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always; \
    add_header Cross-Origin-Embedder-Policy "require-corp" always; \
    add_header Cross-Origin-Opener-Policy "same-origin" always; \
    add_header Cross-Origin-Resource-Policy "same-origin" always; \
    server_tokens off; \
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