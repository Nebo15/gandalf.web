'use strict';

angular.module('app').filter('sampleCurl', function (APP) {
  return function (table) {
    var example = {};
    table.fields.forEach(function (item) {
      switch (item.type) {
        case APP.types.number:
          example[item.alias] = 100;
          break;
        case APP.types.string:
          example[item.alias] = 'sample';
          break;
        case APP.types.bool:
          example[item.alias] = true;
          break;
        default:
          example[item.alias] = 'sample';
          break;
      }
    });

    return JSON.stringify(example);
  };
});
