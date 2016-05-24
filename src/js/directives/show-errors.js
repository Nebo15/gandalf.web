
angular.module('app').directive('showErrors', function() {
  return {
    restrict: 'A',
    require:  '^form',
    link: function (scope, el, attrs, formCtrl) {
      // find the text box element, which has the 'name' attribute
      var inputEl   = el[0].querySelector("[name]");
      // convert the native text box element to an angular element
      var inputNgEl = angular.element(inputEl);
      // get the name on the text box so we know the property to check
      // on the form controller
      var inputName = inputNgEl.attr('name');

      // only apply the has-error class after the user leaves the text box
      var input = formCtrl[inputName];
      if (!input) return;
      scope.$watch(function () {
        return input.$invalid;
      }, function () {
        el.toggleClass('has-error', input.$invalid && input.$dirty);
      });
    }
  }
});
