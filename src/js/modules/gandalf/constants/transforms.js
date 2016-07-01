
angular.module('ng-gandalf').constant('GANDALF_TRANSFORMS', {
  matchingType: {
    scoring: {
      decisionType: 'numeric',
      transformFn: function (val) {
        val = Number(val);
        return isNaN(val) ? 0 : val;
      }
    },
    decision: {
      decisionType: 'alpha_num',
      transformFn: function (val) {
        return '' + (val || '');
      }
    }
  },
  decisionType: {
    string: {
      transformFn: function (val) {
        return '' + (val || '');
      }
    },
    numeric: {
      transformFn: function (val) {
        val = Number(val);
        return isNaN(val) ? 0 : val;
      }
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
