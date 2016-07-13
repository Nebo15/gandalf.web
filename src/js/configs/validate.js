"use strict";

angular.module('app').config(function($validateProvider) {

  $validateProvider.add('alphadashed', /^[a-zA-Z0-9_-]+$/);
  $validateProvider.add('json', function (value) {
    try {
      JSON.parse(value);
      return true;
    } catch (e) {
      return false;
    }
  });
});
