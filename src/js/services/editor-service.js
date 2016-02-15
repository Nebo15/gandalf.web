'use strict';

angular.module('app').service('EditorService', function ($sessionStorage, $gandlaf) {

  var storage = $sessionStorage.$default({
    'rules': [],
    'conditions': []
  });

  this.fetch = function () {
    return $gandlaf.get().then(function (resp) {
      storage.conditions = resp.fields;
      storage.rules = resp.rules;
      return storage;
    });
  };
  this.get = function () {
    return storage;
  };


});
