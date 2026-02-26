# Use a lightweight Nginx image
FROM nginx:stable-alpine

# Metadata
LABEL maintainer="Azure Bay Team"
LABEL description="Static production build for Azure Bay website"

# Install additional tools for health checking
RUN apk add --no-cache \
    curl \
    bash \
    > /dev/null 2>&1

# Copy static files to the Nginx serving directory
COPY . /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create nginx directories for logs
RUN mkdir -p /var/log/nginx /var/cache/nginx/client_temp

# Set proper permissions
RUN chmod -R 755 /usr/share/nginx/html && \
    chmod -R 755 /var/log/nginx

# Expose port 80
EXPOSE 80

# Healthcheck with comprehensive testing
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost/ || curl -f http://localhost/index.html || exit 1

# Set Nginx to run as non-root user
# Use existing nginx user/group or create if not exists
RUN if ! getent group nginx > /dev/null 2>&1; then \
        addgroup -g 101 -S nginx; \
    fi && \
    if ! id nginx > /dev/null 2>&1; then \
        adduser -S nginx -G nginx; \
    fi && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d && \
    chown -R nginx:nginx /usr/share/nginx/html && \
    chown nginx:nginx /var/run

USER nginx

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
