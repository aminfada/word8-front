FROM node:10.15.2-alpine AS builder
COPY . .
RUN npm i verbose
RUN npm run build

FROM nginx:mainline
RUN rm -rf /usr/share/nginx
COPY --from=builder build /var/www/site-data/
COPY nginx.conf /etc/nginx