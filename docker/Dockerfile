# Headstone Design Lab: a static single-page app served by nginx.
# Build from the folder that contains app/ and docker/:
#   docker build -f docker/Dockerfile -t headstone-design-lab .
FROM nginx:1.27-alpine
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY app/ /usr/share/nginx/html/
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1
