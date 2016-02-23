'use strict';

angular.module('ng-gandalf', []).provider('$gandalf', function () {

  var config = {
    apiEnpoint: '/api/v1/',
    authorization: null
  };

  return {
    setEndpoint: function (endpoint) {
      config.apiEnpoint = endpoint;
    },
    setAuthorization: function (apiKey, apiSecret) {
      config.authorization = [apiKey, apiSecret].join(':');
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
        if (config.authorization) {
          headers['Authorization'] = config.authorization;
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
        return $request.get('admin/tables');
      };
      self.decisionById = function (id) {
        return $request.get('admin/tables/'+id);
      };
      self.createDecision = function (obj) {
        return $request({
          endpoint: 'admin/tables/',
          method: 'post'
        }, {
          table: obj
        });
      };
      self.updateDecisionById = function (id, obj) {
        return $request({
          endpoint: 'admin/tables/'+id,
          method: 'put'
        }, {
          table: obj
        });
      };
      self.deleteDecisionById= function (id) {
        return $request({
          endpoint: 'admin/tables/'+id,
          method: 'delete'
        });
      };

      self.history = function (count, page) {
        return $request.get('admin/decisions');
      };
      self.historyById = function (historyId) {
        return $request.get('admin/decisions/'+historyId);
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

    this.alias = options.key;
    this.type = options.type;
    this.title = options.title;

    this.source = options.source;

    this.defaultValue = options.defaultValue;
  }

  DecisionField.prototype.toJSON = function () {
    return {
      key: this.alias,
      type: this.type,
      title: this.title,
      source: this.source
    };
  };

  return DecisionField;
}).factory('DecisionRule', function (DecisionRuleCondition) {

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
    this.decision = options.than;
    this.description = options.description;
    this.conditions = (options.conditions || []).map(function (item) {
      return new DecisionRuleCondition(item);
    });
  }
  Rule.prototype.addCondition = function (field) {
    this.conditions.push(DecisionRuleCondition.fromField(field))
  };
  Rule.prototype.edit = function () {
    this.isEditing = true;
  };
  Rule.prototype.save = function () {
    this.isEditing = false;
  };

  Rule.prototype.toJSON = function () {
    return {
      id: this.id,
      priority: this.priority,
      than: this.decision,
      description: this.description || "",
      conditions: JSON.parse(JSON.stringify(this.conditions))
    };
  };

  Rule.fromFields = function (fields, options) {
    var rule = new Rule(options);
    fields.forEach(function (item) {
      rule.addCondition(item);
    });
    return rule;
  };

  return Rule;

}).factory('DecisionRuleCondition', function () {

  function RuleCondition (obj) {
    var options = obj ? angular.copy(obj) : {};

    this.field_alias = options.field_key;
    this.condition = options.condition || '$eq';
    this.value = options.value;
    this.matched = options.matched === true;
  }
  RuleCondition.prototype.toJSON = function () {
    return {
      field_key: this.field_alias,
      condition: this.condition || '',
      value: this.value || '',
      matched: this.matched
    };
  };
  RuleCondition.fromField = function (field) {
    var cond = new RuleCondition();
    cond.field_alias = field.alias;
    return cond;
  };

  return RuleCondition;
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
    return $gandalf.updateDecisionById(this.id, this);
  };
  DecisionTable.prototype.create = function () {
    return $gandalf.createDecision(this).then(function (obj) {
      this.id = obj.data._id;
      return this;
    }.bind(this));
  };

  DecisionTable.prototype.parse = function (data) {

    this.id = data._id;

    this.fields = (data.fields || []).map(function (item) {
      return new DecisionField(item);
    });
    this.rules = (data.rules || []).map(function (item) {
      return new DecisionRule(item);
    });

    this.defaultResult = data.default_decision;
    this.title = data.title;
    this.description = data.description;

    return this;
  };
  DecisionTable.prototype.toJSON = function () {
    return {
      _id: this.id,
      fields: JSON.parse(JSON.stringify(this.fields)),
      rules: JSON.parse(JSON.stringify(this.rules)),
      default_decision: this.defaultResult,
      title: this.title,
      description: this.description
    };
  };

  DecisionTable.find = function () {
    return $gandalf.decisions().then(function (resp) {
      return resp.data.map(function (item) {
        return new DecisionTable (null, item);
      });
    })
  };
  DecisionTable.byId = function (id) {
    var table = new DecisionTable(id);
    return table.fetch();
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

  DecisionHistory.find = function (size, page) {
    var self = this;
    return $gandalf.history(size, page).then(function (resp) {
      resp.data = resp.data.map(function (item) {
        return new self(item._id, item);
      });
      return resp;
    });
  };


  return DecisionHistory;

});
