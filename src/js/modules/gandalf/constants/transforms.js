(function () {

  function toString (val) {
    return typeof val !== 'undefined' ? ('' + val) : '';
  }
  function toNumber (val) {
    val = Number(val);
    return isNaN(val) ? 0 : val;
  }

  angular.module('ng-gandalf').constant('GANDALF_TRANSFORMS', {
    matchingType: {
      scoring: {
        decisionType: 'numeric',
        transformFn: toNumber
      },
      decision: {
        decisionType: 'alpha_num',
        transformFn: toString
      }
    },
    decisionType: {
      string: {
        transformFn: toString
      },
      numeric: {
        transformFn: toNumber
      },
      alpha_num: {
        transformFn: function (val) {
          var reg = /[a-zA-Z0-9_-]+/gmi;
          return (('' + val).match(reg) || []).join('')
        }
      },
      json: {
        transformFn: function (val) {
          return JSON.parse(JSON.stringify(val));
        }
      }
    }
  });

})();
