'use strict';

angular.module('ng-gandalf').factory('Project', function ($gandalf, ProjectUser, ProjectConsumer) {

  function Project (options) {

    var obj = options || {};

    this.id = obj._id;
    this.title = obj.title;
    this.users = (obj.users || []).map(function(item) {
      return new ProjectUser(item);
    });
    this.consumers = (obj.consumers || []).map(function (item) {
      return new ProjectConsumer(item);
    });

  }

  Project.find = function () {
    return $gandalf.admin.getProjects().then(function (resp) {
      return resp.data.map(function (item) {
        return new Project(item);
      });
    });
  };

  // Users
  Project.prototype.addUser = function (user) {
    var self = this;
    return $gandalf.admin.addProjectUser({
      user_id: user.id,
      role: user.role,
      scope: user.scope
    }).then(function (resp) {
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
    return $gandalf.admin.updateProjectUser({
      user_id: user.id,
      role: user.role,
      scope: user.scope
    }).then(function (resp) {
      self.constructor(resp.data);
      return self;
    })
  };

  // Consumers
  Project.prototype.addConsumer = function (consumer) {
    var self = this;
    return $gandalf.admin.addProjectConsumer({
      description: consumer.description,
      scope: consumer.scope
    }).then(function (resp) {
      self.constructor(resp.data);
      return self;
    });
  };
  Project.prototype.removeConsumer = function (consumer) {
    var self = this;
    return $gandalf.admin.removeProjectConsumer(consumer.clientId).then(function (resp) {
      self.constructor(resp.data);
      return self;
    });
  };
  Project.prototype.updateConsumer = function (consumer) {
    var self = this;
    return $gandalf.admin.updateProjectConsumer({
      client_id: consumer.clientId,
      description: consumer.description,
      scope: consumer.scope
    }).then(function (resp) {
      self.constructor(resp.data);
      return self;
    })
  };

  // Project

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
      consumers: JSON.parse(JSON.stringify(this.consumers))
    };
  };

  return Project;

});
