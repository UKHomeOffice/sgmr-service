FROM quay.io/ukhomeofficedigital/cop-node:12-alpine as builder

ARG SGMR_DATA_API_BASE_URL=https://api.fake.build.com
ARG ENVIRONMENT=fake-environment

RUN apk update && apk upgrade

RUN mkdir -p /src
WORKDIR /src

COPY package*.json ./
RUN npm ci
COPY . /src

RUN npm run build

# Now build the final image based on Nginx

FROM alpine:3.7

ENV NGINX_CONFIG_FILE=/etc/nginx/nginx.conf \
    SGMR_DATA_API_BASE_URL=https://api.fake.build.com \
    ENVIRONMENT=fake-environment

RUN apk upgrade --no-cache && \
    apk add --no-cache nginx bash nginx-mod-http-lua && \
    install -d -g nginx -o nginx /run/nginx && \
    chown -R nginx:nginx /etc/nginx /var/log/nginx

COPY --from=builder /src/dist/ /usr/share/nginx/html
COPY /index.html /usr/share/nginx/html/index.html
COPY /nginx/nginx.conf /etc/nginx/nginx.conf
COPY --chown=100 /nginx/run.sh /run.sh

RUN chmod 700 /run.sh
RUN chown nginx /usr/share/nginx/html

# UID for nginx user
USER 100

EXPOSE 8080

CMD ["/run.sh"]
