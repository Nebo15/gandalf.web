'use strict';

angular.module('ng-gandalf').factory('Project', function ($gandalf) {

  function Project (options) {

    var obj = options || {};

    this.id = obj._id;
    this.title = obj.title;
    this.users = obj.users;
    this.consumers = obj.consumers;

  }

  Project.find = function () {
    return $gandalf.admin.getProjects().then(function (resp) {
      return resp.data.map(function (item) {
        return new Project(item);
      });
    });
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
  Project.prototype.addUser = function () {

  };

  Project.prototype.toJSON = function () {
    return {
      _id: this.id,
      title: this.title,
      users: this.users,
      consumers: this.consumers
    };
  };

  return Project;

});
