angular.module('app').config(function ($gandalfProvider, ENV) {
  $gandalfProvider.setEndpoint('/api/');
  $gandalfProvider.init(ENV.api.clientId, ENV.api.clientSecret);
});
