angular.module('app').config(function ($gandalfProvider, ENV) {
  $gandalfProvider.setEndpoint(ENV.api.endpoint);
});
