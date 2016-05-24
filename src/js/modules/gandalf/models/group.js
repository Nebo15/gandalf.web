angular.module('ng-gandalf').factory('DecisionGroup', function ($gandalf, DecisionTable) {

  function DecisionGroup (id, data) {
    this.id = id;

    if (data) this.parse(data);
  }

  DecisionGroup.prototype = Object.create({}, {
    _modelTable: {
      value: DecisionTable
    }
  });

  DecisionGroup.prototype.fetch = function () {
    return $gandalf.admin.getGroupById(this.id).then(function (resp) {
      return this.parse(resp.data);
    }.bind(this))
  };

  DecisionGroup.prototype.update = function (obj) {

    var updateObj = obj || this.toJSON();

    var self = this;
    return $gandalf.admin.updateGroupById(this.id, updateObj).then(function (resp) {
      self.parse(resp.data);
      return self;
    })
  };

  DecisionGroup.prototype.create = function () {
    return $gandalf.admin.createGroup(this).then(function (obj) {
      this.id = obj.data._id;
      return this;
    }.bind(this));
  };

  DecisionGroup.prototype.delete = function () {
    return $gandalf.admin.deleteGroupById(this.id);
  };


  // tables
  DecisionGroup.prototype.addTable = function (table) {


    return $gan
  };

  DecisionGroup.prototype.parse = function (data) {

    this.id = data._id;

    this.tables = (data.tables || []).map(function (item) {
      return new this._modelTable(null, item);
    }.bind(this));

    this.title = data.title;
    this.description = data.description;
    this.probability = data.probability;

    return this;
  };
  DecisionGroup.prototype.toJSON = function () {
    return {
      _id: this.id,
      tables: JSON.parse(JSON.stringify(this.tables)),
      title: this.title,
      description: this.description,
      probability: this.probability
    };
  };

  DecisionGroup.find = function (size, page, filter) {

    var self = this;
    return $gandalf.admin.getGroups(size, page, filter).then(function (resp) {
      resp.data = resp.data.map(function (item) {
        return new self (null, item);
      });
      return resp;
    })
  };

  DecisionGroup.byId = function (id) {
    var table = new this(id);
    return table.fetch();
  };

  return DecisionGroup;

});

