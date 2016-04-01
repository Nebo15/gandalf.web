'use strict';

angular.module('ng-gandalf').factory('DecisionTableChangelog', function ($gandalf) {

  function DecisionTableChangelog (data) {
    var options = angular.extend({}, data);

    this.id = options._id;
    this.author = options.author;
    this.model = options.model;
    this.createdAt = new Date(options.created_at);
    this.updatedAt = new Date(options.updated_at);
  }

  DecisionTableChangelog.prototype.rollback = function () {
    return $gandalf.admin.rollbackTableToChangelog(this.model._id, this.id);
  };

  return DecisionTableChangelog;

});
