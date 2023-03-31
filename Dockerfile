FROM node:12.22.12-alpine AS builder
COPY . .
RUN npm install
RUN npm run build

FROM nginx:mainline
RUN rm -rf /usr/share/nginx
COPY --from=builder build /var/www/site-data/
COPY nginx.conf /etc/nginx
