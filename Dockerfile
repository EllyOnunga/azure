# Use a lightweight Nginx image
FROM nginx:stable-alpine

# Metadata
LABEL maintainer="Azure Bay Team"
LABEL description="Static production build for Azure Bay website"

# Copy static files to the Nginx serving directory
# We copy only the necessary directories and files
COPY . /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Healthcheck to ensure Nginx is running
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
