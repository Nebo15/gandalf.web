'use strict';

angular.module('app').filter('sampleCurl', function (APP) {
  return function (table) {
    var example = {};
    table.fields.forEach(function (item) {
      switch (item.type) {
        case APP.types.number:
          example[item.key] = 100;
          break;
        case APP.types.string:
          example[item.key] = 'sample';
          break;
        case APP.types.bool:
          example[item.key] = true;
          break;
        default:
          example[item.key] = 'sample';
          break;
      }
    });

    return JSON.stringify(example);
  };
});
