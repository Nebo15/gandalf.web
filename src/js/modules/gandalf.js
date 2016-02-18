'use strict';

angular.module('ng-gandalf', []).provider('$gandalf', function () {

  var config = {
    apiEnpoint: '/api/v1/'
  };

  return {
    setEndpoint: function (endpoint) {
      config.apiEnpoint = endpoint;
    },
    $get: function ($httpParamSerializer, $http, $log, $q, $filter) {

      function $request(opts, data) {

        var endpoint = opts.endpoint,
          method = opts.method || 'get',
          params = opts.params || {};

        if (angular.isUndefined(endpoint)) {
          throw Error('undefined request enpoint');
        }

        endpoint = config.apiEnpoint + endpoint;
        endpoint += '?' + $httpParamSerializer(params);

        var headers = {
          'Content-type': 'application/json'
        };
        if (config.token) {
          headers['Authorization'] = 'Bearer ' + config.token;
        }

        return $http({
          method: method,
          url: endpoint,
          headers: headers,
          data: data || null
        }).then(function (resp) {
          $log.debug('$request: response', resp);
          return resp.data;
        });
      }

      $request.get = function (url, options) {
        var config = angular.extend({
          endpoint: url,
          method: 'get'
        }, options);

        return $request(config);
      };

      var self = {};

      self.decisions = function () {
        return $request.get('decisions');
      };
      self.decisionById = function (id) {
        return self.decisions().then(function (resp) {
          resp.data = resp.data[0];
          return resp;
        })
      };

      self.historyById = function (historyId) {
        return $request.get('scoring/'+historyId);
      };
      self.history = function (count, page) {
        return $request.get('scoring');
      };

      self.update = function (decisionTableObj) {
        return $q.when(decisionTableObj);
      };
      return self;

    }
  };

}).factory('DecisionField', function () {

  function DecisionField (obj) {
    var options = obj ? angular.copy(obj) : {};

    this.alias = options.alias;
    this.type = options.type;
    this.title = options.title;

    this.source = options.source;

    this.defaultValue = options.defaultValue;
  }

  return DecisionField;
}).factory('DecisionRule', function () {

  function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }

  function Rule (obj) {
    var options = obj ? angular.copy(obj) : {};

    this.id = options.id || guid();
    this.priority = options.priority;
    this.decision = options.decision;
    this.description = options.description;
    this.conditions = (options.conditions || []).map(function (item) {
      return new RuleCondition(item);
    });
  }
  Rule.prototype.addCondition = function (field) {
    this.conditions.push(new RuleCondition({
      name: field.name
    }))
  };
  Rule.prototype.edit = function () {
    this.isEditing = true;
  };
  Rule.prototype.save = function () {
    this.isEditing = false;
  };

  Rule.fromFields = function (fields, options) {
    var rule = new Rule(options);
    fields.forEach(function (item) {
      rule.addCondition(item);
    });
    return rule;
  };

  function RuleCondition (obj) {
    var options = obj ? angular.copy(obj) : {};

    this.field_alias = options.field_alias;
    this.condition = options.condition;
    this.value = options.value;
    this.matched = options.matched === true;
  }
  return Rule;
}).factory('DecisionTable', function ($gandalf, $q, DecisionField, DecisionRule) {

  function DecisionTable (id, data) {
    console.log('decision table', arguments);
    this.id = id;
    this.fields = [];
    this.rules = [];
    this.defaultResult = null;

    if (data) this.parse(data);
  }

  DecisionTable.prototype.fetch = function () {
    return $gandalf.decisionById(this.id).then(function (resp) {
      return this.parse(resp.data);
    }.bind(this))
  };

  DecisionTable.prototype.addField = function (field) {
    this.fields.push(field);
    this.rules.forEach(function (item) {
      item.addCondition(field);
    });
  };

  DecisionTable.prototype.addRule = function (rule) {
    this.rules.push(rule);
  };
  DecisionTable.prototype.deleteRule = function (rule) {
    this.rules = this.rules.filter(function (item) {
      return item.id !== rule.id;
    })
  };

  DecisionTable.prototype.save = function () {
    return $gandalf.update(angular.toJson(this)); //placeholder
  };

  DecisionTable.prototype.parse = function (data) {

    this.id = data._id;

    this.fields = data.fields.map(function (item) {
      return new DecisionField(item);
    });
    this.rules = data.rules.map(function (item) {
      return new DecisionRule(item);
    });

    this.defaultResult = data.default_decision;

    return this;
  };

  DecisionTable.current = function () {
    return new DecisionTable().fetch();
  };

  return DecisionTable;

}).factory('DecisionHistory', function ($gandalf, DecisionTable) {

  function DecisionHistory () {

    this.decision = null;
    this.request = null;
    this.createdAt = null;
    this.updatedAt = null;

    DecisionTable.apply(this, arguments);
  }
  DecisionHistory.prototype = DecisionTable.prototype;

  var parseFn = DecisionTable.prototype.parse;
  DecisionHistory.prototype.parse = function (data) {
    parseFn.call(this, data);

    this.decision = data.final_decision;
    this.request = data.request;
    this.createdAt = new Date(data.created_at);
    this.updatedAt = new Date(data.updated_at);

    return this;
  };

  DecisionHistory.find = function (size, page) {
    var self = this;
    return $gandalf.history(size, page).then(function (resp) {
      resp.data = resp.data.map(function (item) {
        return new self(item._id, item);
      });
      return resp;
    });
  };

  DecisionHistory.prototype.fetch = function () {
    return $gandalf.historyById(this.id).then(function (resp) {
      return this.parse(resp.data);
    }.bind(this))
  };

  return DecisionHistory;

});
