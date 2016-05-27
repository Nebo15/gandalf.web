angular.module('app').filter('maxLength', function () {

  return function (source, options) {
    if (!source || !angular.isDefined(options)) return source;

    var maxLength = +options;
    console.log(source, maxLength);
    return (source || '').substr(0, maxLength) + ((source || '').length > maxLength ? '...' : '');
  };
});
