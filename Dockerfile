FROM mhart/alpine-node:6.9.1

EXPOSE 8080

ADD package.json /tmp/package.json
RUN cd /tmp && npm install --production
RUN mkdir -p /opt/app && cp -a /tmp/node_modules /opt/app/

WORKDIR /opt/app

COPY ./server.js /opt/app
COPY ./www /opt/app/www

CMD node server.js
