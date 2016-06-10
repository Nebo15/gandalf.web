angular.module('app').controller('TablesTrafficListController', function ($scope, table) {
  var tableHash = table.getHash();

  $scope.saved = true;
  $scope.table = table;
  $scope.allTraffic = 100;

  function sumVariants() {
    var filterIndexes = Array.prototype.slice.call(arguments);

    return table.variants.reduce(function (num, variant, index) {
      if (~filterIndexes.indexOf(index)) {
        return num;
      }

      return num += variant.probability;
    }, 0);
  }

  $scope.$watch('table', function () {
    $scope.saved = (tableHash === table.getHash());
  }, true);

  $scope.$watch('table.variants', function () {
    var sum = sumVariants(0);
    $scope.allTraffic = 100 - (isNaN(sum) ? 0 : sum);
  }, true);

  $scope.max = function (currentIndex) {
    return 100 - sumVariants(0, currentIndex);
  };

  $scope.submit = function (form) {
    $scope.error = null;

    if (form.$invalid || $scope.saved) return;

    table.variants[0].probability = $scope.allTraffic;

    table.save().then(function () {
      $scope.saved = true;

      tableHash = table.getHash();
    }).then(null, function (err) {
      $scope.error = err;
    });
  }
});
