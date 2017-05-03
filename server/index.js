require('dotenv').config({ silent: true });

var Express = require('express');
var path = require('path');
var fs = require('fs');
var merge = require('lodash/merge');
var proxy = require('proxy-middleware');
var ejs = require('ejs');

var config = require('./config');

var server = new Express();

server.set('port', config.PORT);
server.engine('html', require('ejs').renderFile);

server.set('view engine', 'ejs');
server.set('views', path.resolve(__dirname, '../www'));

server.locals.CONFIG = escape(JSON.stringify(config));

server.use(config.API_PROXY_PATH, proxy(config.API_ENDPOINT));

server.get('/', function (req, res) {
  res.render('index.html');
});
server.use(Express.static(path.resolve(__dirname, '../www')));

server.get('/404', function (req, res) {
  res.render('404.html');
});

server.listen(server.get('port'), function (err) {
  if (err) {
    console.log('error while starting server', err);
  }
  console.log('Gandalf is started to listen at localhost:' + server.get('port'));
});
