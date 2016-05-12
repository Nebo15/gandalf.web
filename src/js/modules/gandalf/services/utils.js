
angular.module('ng-gandalf').service('utils', function () {

  this.orNull = function (val) {
    return typeof val !== 'undefined' ? val : null;
  };

  this.guid = function () {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }
;
});
