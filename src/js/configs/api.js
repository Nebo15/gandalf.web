angular.module('app').config(function ($gandalfProvider, ENV) {
  $gandalfProvider.setEndpoint(ENV.api.endpoint);
  $gandalfProvider.setAuthorization(ENV.api.apiKey, ENV.api.apiSecret);
});
