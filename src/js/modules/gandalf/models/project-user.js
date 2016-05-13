'use strict';

angular.module('ng-gandalf').factory('ProjectUser', function ($gandalf) {

  function ProjectUser(data) {
    var obj = data || {};
    this._id = obj._id;
    this.id = obj.user_id;
    this.role = obj.role;
    this.scope = obj.scope;

    this.email = obj.email;
    this.username = obj.username;

  }

  ProjectUser.prototype.update = function () {
    return $gandalf.admin.updateProjectUser(this.toJSON());
  };
  ProjectUser.prototype.remove = function () {
    return $gandalf.admin.removeProjectUser(this.id);
  };

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
