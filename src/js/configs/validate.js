"use strict";

angular.module('app').config(function($validateProvider) {

  $validateProvider.add('alphadashed', /^[a-zA-Z0-9_-]+$/);

  $validateProvider.add('email', /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i);
  $validateProvider.add('json', function (value) {
    try {
      JSON.parse(value);
      return true;
    } catch (e) {
      return false;
    }
  });
});
