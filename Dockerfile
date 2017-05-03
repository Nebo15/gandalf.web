FROM nebo15/alpine-node:6.9.5

ENV DEBUG false
ENV PORT 8080
ENV NODE_ENV production

COPY package.json /tmp/package.json
RUN cd /tmp && npm install --production || { exit 1; } && mkdir -p /opt/app && cp -a /tmp/node_modules /opt/app/

WORKDIR /opt/app
COPY . /opt/app

CMD ["pm2-docker", "pm2.process.yml"]

# # --------
#
# FROM nebo15/alpine-node:6.9.5
#
# EXPOSE 8080
# ENV NODE_ENV production
# ENV PORT 8080
#
# COPY --from=build-env /opt/app /usr/local/bin/service
#
# WORKDIR /opt/app
#
# COPY ./server.js /opt/app
# COPY ./www /opt/app/www
#
# CMD node server.js
