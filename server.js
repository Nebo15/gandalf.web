require('dotenv').config({ silent: true });

var Express = require('express');
var path = require('path');
var fs = require('fs');
var merge = require('lodash/merge');
var proxy = require('proxy-middleware');

var server = new Express();
server.set('port', process.env.PORT || 8080);
server.get('/', function (req, res) {
  res.sendFile(path.resolve(__dirname, './www/index.html'));
});
server.get('/404', function (req, res) {
  res.sendFile(path.resolve(__dirname, './www/404.html'));
});

var env = {
  DEBUG: process.env.DEBUG,
  API_HOSTNAME: process.env.API_HOSTNAME,
  API_CLIENTID: process.env.API_CLIENTID,
  API_CLIENTSECRET: process.env.API_CLIENTSECRET,
  PROVIDERS_BUGSNAG_APIKEY: process.env.PROVIDERS_BUGSNAG_APIKEY,
  PROVIDERS_BUGSNAG_STAGE: process.env.PROVIDERS_BUGSNAG_STAGE,
}

const configJsFileContent = 'window.env = "' + escape(JSON.stringify(env)) + '";';

server.use('/js/config.js', function (req, res) {
  res.setHeader('Content-type', 'application/javascript');
  res.send(configJsFileContent);
});

server.use('/api', proxy(env.API_HOSTNAME));
server.use(Express.static(path.resolve(__dirname, './www')));
server.use(function (req, res) {
  res.sendFile(path.resolve(__dirname, './www/404.html'));
});

server.listen(server.get('port'), function (err) {
  if (err) {
    console.log('error while starting server', err);
  }
  console.log('Gandalf is started to listen at localhost:' + server.get('port'));
});
