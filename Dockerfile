FROM nebo15/alpine-node:6.9.5

ENV DEBUG=false \
    PORT=8080 \
    NODE_ENV=production

COPY package.json /tmp/package.json
RUN set -xe;
    cd /tmp && \
    npm install --production && \
    mkdir -p /opt/app && \
    cp -a /tmp/node_modules /opt/app/

WORKDIR /opt/app

COPY . /opt/app

CMD ["pm2-docker", "pm2.process.yml"]
