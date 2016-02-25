angular.module('ng-gandalf').factory('DecisionHistory', function ($gandalf, DecisionTable) {

  function DecisionHistory () {

    this.decision = null;
    this.request = null;
    this.createdAt = null;
    this.updatedAt = null;

    DecisionTable.apply(this, arguments);
  }
  DecisionHistory.prototype = Object.create(DecisionTable.prototype);
  DecisionHistory.prototype.constructor = DecisionHistory;


  var parseFn = DecisionTable.prototype.parse;
  DecisionHistory.prototype.parse = function (data) {
    parseFn.call(this, data);

    this.decision = data.final_decision;
    this.request = data.request;
    this.createdAt = new Date(data.created_at);
    this.updatedAt = new Date(data.updated_at);

    return this;
  };

  DecisionHistory.prototype.fetch = function () {
    return $gandalf.historyById(this.id).then(function (resp) {
      return this.parse(resp.data);
    }.bind(this))
  };
  DecisionHistory.prototype.toJSON = function () {
    var res = DecisionTable.prototype.toJSON.call(this);
    res.final_decision = this.decision;
    res.request = this.request;
    res.created_at = this.createdAt;
    res.updated_at = this.updatedAt;

    return res;
  };

  DecisionHistory.find = function (tableId, size, page) {
    var self = this;
    return $gandalf.history(tableId, size, page).then(function (resp) {
      resp.data = resp.data.map(function (item) {
        return new self(item._id, item);
      });
      return resp;
    });
  };


  return DecisionHistory;

});
