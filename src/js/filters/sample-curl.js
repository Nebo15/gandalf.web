'use strict';

angular.module('app').filter('sampleCurl', function (APP) {
  return function (fields) {
    var example = {};
    fields.forEach(function (item) {
      if (typeof item.value !== 'undefined' ) {
        example[item.key] = item.value;
        return;
      }

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
