'use strict';

angular.module('ng-gandalf').factory('Project', function ($gandalf, ProjectUser, ProjectConsumer) {

  function Project (options) {

    var obj = options || {};

    this.id = obj._id;
    this.title = obj.title;
    this.description = obj.description;
    this.consumers = obj.consumers || null;

    this.settings = obj.settings;
    if (Array.isArray(this.settings)) {
      this.settings = {}; // hotfix for backend error
    }

    this.users = (obj.users || []).map(function(item) {
      return new ProjectUser(item);
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
      self.extend(resp.data);
      return self;
    });
  };
  Project.prototype.removeUser = function (user) {
    var self = this;
    return $gandalf.admin.removeProjectUser(user.id).then(function (resp) {
      self.extend(resp.data);
      return self;
    });
  };
  Project.prototype.updateUser = function (user) {
    var self = this;
    return $gandalf.admin.updateProjectUser({
      user_id: user.id,
      role: (user.role == 'admin') ? undefined : this.role,
      scope: user.scope
    }).then(function (resp) {
      self.extend(resp.data);
      return self;
    })
  };

  // Consumers

  Project.prototype.fetchConsumers = function () {
    var self = this;

    return $gandalf.admin.getProjectConsumers().then(function (response) {
      self.consumers = response.data.map(function (consumer) {
        return new ProjectConsumer(consumer);
      });

      return self;
    });
  };

  Project.prototype.addConsumer = function (consumer) {
    var self = this;
    return $gandalf.admin.addProjectConsumer({
      description: consumer.description,
      scope: consumer.scope
    }).then(function (resp) {
      self.consumers = resp.data.map(function (consumer) {
        return new ProjectConsumer(consumer);
      });

      return self;
    });
  };
  Project.prototype.removeConsumer = function (consumer) {
    var self = this;
    return $gandalf.admin.removeProjectConsumer(consumer.clientId).then(function (resp) {
      self.consumers = resp.data.map(function (consumer) {
        return new ProjectConsumer(consumer);
      });

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
      self.consumers = resp.data.map(function (consumer) {
        return new ProjectConsumer(consumer);
      });

      return self;
    })
  };

  // Project

  Project.prototype.create = function () {
    var self = this;
    return $gandalf.admin.createProject({
      title: this.title,
      description: this.description
    }).then(function (resp) {
      self.extend(resp.data);
      return self;
    });
  };
  Project.prototype.update = function (source) {
    var self = this;
    var updateObj = source || this;

    return $gandalf.admin.updateProject({
      title: updateObj.title,
      description: updateObj.description,
      settings: updateObj.settings
    }).then(function (resp) {
      self.extend(resp.data);
      return self;
    });
  };
  Project.prototype.delete = function () {
    return $gandalf.admin.deleteProject();
  };

  Project.prototype.extend = function (data) {
    return this.constructor(_.assignIn(data, {consumers: this.consumers}));
  };

  Project.prototype.getExportURL = function () {
    return $gandalf.admin.exportProject();
  };


  Project.prototype.toJSON = function () {
    return {
      _id: this.id,
      title: this.title,
      description: this.description,
      users: JSON.parse(JSON.stringify(this.users)),
      consumers: JSON.parse(JSON.stringify(this.consumers)),
      settings: this.settings
    };
  };

  return Project;

});
