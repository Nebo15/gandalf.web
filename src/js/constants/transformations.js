
angular.module('app').constant('TRANSFORMATIONS', {
  matchingType: {},
  decisionType: {}
}).config(function(TRANSFORMATIONS, APP) {

  var changeDecisionType = {};
  changeDecisionType[APP.decisionTypes.string] = {
    transformFn: function (val) {
      return '' + val;
    }
  };
  changeDecisionType[APP.decisionTypes.numeric] = {
    transformFn: function (val) {
      val = Number(val);
      return isNaN(val) ? 0 : val;
    }
  };
  changeDecisionType[APP.decisionTypes.alphaNumeric] = {
    transformFn: function (val) {
      var reg = /[a-zA-Z0-9_-]+/gmi;
      return ('' + val).match(reg).join('')
    }
  };
  changeDecisionType[APP.decisionTypes.json] = {
    transformFn: function (val) {
      return JSON.parse(JSON.stringify(val));
    }
  };

  TRANSFORMATIONS.decisionType = changeDecisionType;

}).config(function (TRANSFORMATIONS, APP) {
  var changeMatchingType = {};
  changeMatchingType[APP.matchingTypes.all] = {
    decisionType: APP.decisionTypes.numeric,
    transformFn: function (val) {
      val = Number(val);
      return isNaN(val) ? 0 : val;
    }
  };
  changeMatchingType[APP.matchingTypes.first] = {
    decisionType: APP.decisionTypes.alphaNumeric,
    transformFn: function (val) {
      return '' + val;
    }
  };

  TRANSFORMATIONS.matchingType = changeMatchingType;
})
