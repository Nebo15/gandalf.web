angular.module('ng-gandalf').factory('DecisionTable', function ($gandalf, $q, _, DecisionField, DecisionRule, DecisionVariant,
                                                                DecisionTableChangelog, CONDITION_TYPES, gandalfUtils) {

  function DecisionTable(id, data) {
    this.id = id;
    this.fields = [];
    this.variants = [];
    this.matchingType = 'first';

    if (data) this.parse(data);
  }

  DecisionTable.prototype = Object.create({}, {
    _modelField: {
      value: DecisionField
    },
    _modelVariant: {
      value: DecisionVariant
    }
  });

  DecisionTable.prototype.clear = function () {
    this.variants.forEach(function (item) {
      item.clear();
    });

    this.fields.filter(function (item) {
      return item.isDeleted;
    }).forEach(function (field) {
      this.deleteField(field);
    }.bind(this));
  };

  DecisionTable.prototype.fetch = function () {
    return $gandalf.admin.getTableById(this.id).then(function (resp) {
      return this.parse(resp.data);
    }.bind(this))
  };

  DecisionTable.prototype.addField = function (field) {
    this.fields.push(field);
    this.getVariantsRules().forEach(function (item) {
      item.addCondition(field);
    });
  };
  DecisionTable.prototype.deleteField = function (field) {
    var fieldIdx = this.fields.indexOf(field);
    this.fields = this.fields.filter(function (item) {
      return item !== field;
    });
    this.getVariantsRules().forEach(function (item) {
      item.removeConditionByIndex(fieldIdx);
    })
  };

  DecisionTable.prototype.numberOfFields = function () {
    return this.fields.filter(function (item) {
      return !item.isDeleted;
    })
  };

  DecisionTable.prototype.findConditionsByField = function (field) {

    var conditions = this.getVariantsRules().map(function (item) {
      return item.conditions;
    });

    return _.flattenDeep(conditions).filter(function (condition) {
      return condition.fieldKey === field.key;
    });
  };

  DecisionTable.prototype.getVariantsRules = function () {
    return _.flattenDeep(this.variants.map(function (variant) {
      return variant.rules;
    }));
  };

  DecisionTable.prototype.save = function () {
    this.clear();

    var self = this;
    return $gandalf.admin.updateTableById(this.id, this).then(function (resp) {
      self.parse(resp.data);
      return self;
    });
  };
  DecisionTable.prototype.create = function () {
    this.clear();

    var self = this;
    return $gandalf.admin.createTable(this.toJSON()).then(function (obj) {
      self.parse(obj.data);
      return self;
    });
  };

  DecisionTable.prototype.delete = function () {
    return $gandalf.admin.deleteTableById(this.id);
  };

  DecisionTable.prototype.getChangelogs = function () {
    return $gandalf.admin.getTableChangelogs(this.id).then(function (item) {
      return item.data.map(function (item) {
        return new DecisionTableChangelog(item);
      });
    });
  };

  // Variants

  DecisionTable.prototype.getVariant = function (id) {
    return _.find(this.variants, {
      id: id
    });
  };

  DecisionTable.prototype.createVariant = function (parentVariantId) {
    var variantJSON = ((parentVariantId && this.getVariant(parentVariantId)) || this.variants[0]).toJSON();
    variantJSON.id = variantJSON._id = undefined;
    variantJSON.probability = 0;

    return new this._modelVariant(variantJSON);
  };

  DecisionTable.prototype.deleteVariant = function (variantId) {
    this.variants.some(function (variant) {
      if (variant.id === variantId) {
        this.variants[0].probability += variant.probability;
        this.variants.splice(this.variants.indexOf(variant), 1);
        return true;
      }
    }, this);
  };

  DecisionTable.prototype.parse = function (data) {

    this.id = data._id;

    this.title = data.title;
    this.description = data.description;

    var self = this;
    this.fields = (data.fields || []).map(function (item) {
      return new self._modelField(item);
    });

    this.variants = (data.variants || []).map(function (item) {
      return new self._modelVariant(item);
    });

    this.matchingType = data.matching_type || 'first';
    this.variantsProbability = data.variants_probability || 'first';

    return this;
  };

  DecisionTable.prototype.toJSON = function () {
    return {
      _id: this.id,
      fields: JSON.parse(JSON.stringify(this.fields)),
      variants: JSON.parse(JSON.stringify(this.variants)),
      title: this.title,
      description: this.description,
      matching_type: this.matchingType,
      variants_probability: this.variantsProbability
    };
  };

  DecisionTable.prototype.getDecisionVariants = function () {

    var variants = this.getVariantsRules().map(function (rule) {
      return rule.than;
    }) || [];

    this.variants.forEach(function (item) {
      if (item.defaultDecision) {
        variants.push(item.defaultDecision);
      }
    });

    return _.uniq(variants);
  };

  DecisionTable.prototype.copy = function () {
    return $gandalf.admin.copyTableById(this.id).then(function (resp) {
      return new DecisionTable(null, resp.data);
    });
  };

  DecisionTable.prototype.getHash = function () {
    return gandalfUtils.stringHash(JSON.stringify(this.toJSON()));
  };

  DecisionTable.find = function (size, page, filter) {

    var self = this;
    return $gandalf.admin.getTables(size, page, filter).then(function (resp) {
      resp.data = resp.data.map(function (item) {
        return new self(null, item);
      });
      return resp;
    })
  };

  DecisionTable.byId = function (id) {
    var table = new this(id);
    return table.fetch();
  };

  return DecisionTable;

});

