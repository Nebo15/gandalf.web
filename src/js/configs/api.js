angular.module('app').config(function ($gandalfProvider, ENV) {
  $gandalfProvider.setEndpoint(ENV.api.proxyPath);
  $gandalfProvider.init(ENV.api.clientId, ENV.api.clientSecret);
});
