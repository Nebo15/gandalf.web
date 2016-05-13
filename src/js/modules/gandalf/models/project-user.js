'use strict';

angular.module('ng-gandalf').factory('ProjectUser', function () {

  function ProjectUser(data) {
    var obj = data || {};
    this._id = obj._id;
    this.id = obj.user_id;
    this.role = obj.role;
    this.scope = obj.scope;

    this.email = obj.email;
    this.username = obj.username;

  }

  ProjectUser.prototype.toJSON = function () {

    return {
      _id: this._id,
      user_id: this.id,
      role: this.role,
      scope: this.scope
    };
  };

  return ProjectUser;
});
