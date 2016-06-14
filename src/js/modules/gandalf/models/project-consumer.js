'use strict';

angular.module('ng-gandalf').factory('ProjectConsumer', function ($gandalf) {

  function ProjectConsumer(data) {
    var obj = data || {};
    this.id = obj._id;
    this.clientId = obj.client_id;
    this.clientSecret = obj.client_secret;
    this.description = obj.description;
    this.scope = obj.scope;
  }

  ProjectConsumer.prototype.toJSON = function () {

    return {
      _id: this.id,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      description: this.description,
      scope: this.scope
    };
  };

  return ProjectConsumer;
});
