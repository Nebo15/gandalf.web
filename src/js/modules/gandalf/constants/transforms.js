(function () {

  function anyToString (val) {
    return typeof val !== 'undefined' ? ('' + val) : '';
  }
  function anyToNumber (val) {
    val = Number(val);
    return isNaN(val) ? 0 : val;
  }
  function anyToJSON (val) {

    return JSON.stringify(angular.isDefined(val) ? val : {});
  }

  angular.module('ng-gandalf').constant('GANDALF_TRANSFORMS', {
    matchingType: {
      scoring: {
        decisionType: 'numeric',
        transformFn: anyToNumber
      },
      decision: {
        decisionType: 'alpha_num',
        transformFn: anyToString
      }
    },
    decisionType: {
      string: {
        transformFn: anyToString
      },
      numeric: {
        transformFn: anyToNumber
      },
      alpha_num: {
        transformFn: function (val) {
          var reg = /[a-zA-Z0-9_-]+/gmi;
          return (('' + val).match(reg) || []).join('')
        }
      },
      json: {
        transformFn: anyToJSON
      }
    }
  });

})();
