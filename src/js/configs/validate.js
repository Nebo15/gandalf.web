"use strict";

angular.module('app').config(function($validateProvider) {

  $validateProvider.add('alphadashed', /^[a-zA-Z0-9_-]+$/);

});
