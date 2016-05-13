'use strict';

angular.module('ng-gandalf').factory('Project', function ($gandalf, ProjectUser) {

  function Project (options) {

    var obj = options || {};

    this.id = obj._id;
    this.title = obj.title;
    this.users = (obj.users || []).map(function(item) {
      return new ProjectUser(item);
    });
    this.consumers = obj.consumers;

  }

  Project.find = function () {
    return $gandalf.admin.getProjects().then(function (resp) {
      return resp.data.map(function (item) {
        return new Project(item);
      });
    });
  };


  Project.prototype.addUser = function (user) {
    var self = this;
    return $gandalf.admin.addProjectUser(user).then(function (resp) {
      self.constructor(resp.data);
      return self;
    });
  };
  Project.prototype.removeUser = function (user) {
    var self = this;
    return $gandalf.admin.removeProjectUser(user.id).then(function (resp) {
      self.constructor(resp.data);
      return self;
    });
  };
  Project.prototype.updateUser = function (user) {
    var self = this;
    return $gandalf.admin.updateProjectUser(user.toJSON()).then(function (resp) {
      self.constructor(resp.data);
      return self;
    })
  };

  Project.prototype.create = function () {
    var self = this;
    return $gandalf.admin.createProject({
      title: this.title
    }).then(function (resp) {
      self.constructor(resp.data);
      return self;
    });
  };

  Project.prototype.toJSON = function () {
    return {
      _id: this.id,
      title: this.title,
      users: JSON.parse(JSON.stringify(this.users)),
      consumers: this.consumers
    };
  };

  return Project;

});
