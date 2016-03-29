/* SelectionAggregator.js */

(function(cxt) {
  "use strict";

  /**
  * @public
  * @class
  */
  var SelectionAggregator = function SelectionAggregator(key_targets) {
    this._key_targets = key_targets || [];
    this._pos = -1;
    this._names = [];
    this._values = [];
    this._result_keys = [];
    this._result_values = [];
  };

  /**
  * @public
  * @static
  * @function
  * @param {any} value -
  * @returns {Boolean}
  */
  SelectionAggregator.isValue = function isValue(value) {
    return typeof value === "string" || value instanceof String ||
           typeof value === "number" || value instanceof Number ||
           value === null || value === void 0 ? true : false;
  };

  /**
  * @publuc
  * @static
  * @function
  * @param {String} type - action type
  * @param {String} meth - action method name
  * @returns {Boolean}
  */
  SelectionAggregator.hasAction = function hasAction(type, meth) {
    var action = SelectionAggregator.actions[type];

    return action && typeof action[meth] === "function" ? true : false;
  };

  /**
  * @public
  * @function
  * @param {*} value -
  * @returns {void}
  */
  SelectionAggregator.prototype.setValue = function setValue(value) {
    this._values[this._pos] = value;
  };

  /**
  * @public
  * @function
  * @param {String} name -
  * @returns {void}
  */
  SelectionAggregator.prototype.setName = function setName(name) {
    this._names[this._pos] = name;
  };

  /**
  * @public
  * @function
  * @returns {void}
  */
  SelectionAggregator.prototype.next = function next() {
    this._pos = this._pos + 1;
  };

  /**
  * @public
  * @function
  * @returns {String}
  */
  SelectionAggregator.prototype.getKey = function getKey() {
    var key_str = "";

    for(var i = 0, l = this._key_targets.length; i < l; i = i + 1) {
      var target = this._key_targets[i],
          pos = this._names.indexOf(target);

      if(~pos) { // found
        key_str = key_str + "_" + this._values[pos];
      } else {
        key_str = key_str + "_" + this._values[target];
      }
    }

    return key_str;
  };

  /**
  * @public
  * @function
  * @param {String} name -
  * @returns {*}
  */
  SelectionAggregator.prototype.getCurrentValue = function getCurrentValue(name) {
    var pos = this.getPos(this.getKey(name));

    return this._result_values[pos] ? this._result_values[pos][name] || null : null;
  };

  /**
  * @public
  * @function
  * @param {Mixed(String|Number)} key -
  * @returns {Number}
  */
  SelectionAggregator.prototype.getPos = function(key) {
    var pos = this._result_keys.indexOf(key);

    if(!~pos) { // not found
      pos = this._result_values.length;
    }

    return pos;
  };

  /**
  * @public
  * @function
  * @returns {void}
  */
  SelectionAggregator.prototype.aggretate = function aggregate() {
    var key = this.getKey(),
        pos = this.getPos(key);

    if(key !== "") {
      this._result_keys[pos] = key;
    }

    if(!this._result_values[pos]) {
      this._result_values[pos] = {};
    }

    for(var i = 0, l = this._values.length; i < l; i = i + 1) {
      var name = this._names[i] || i,
          value = this._values[i];

      if(SelectionAggregator.isValue(value)) {
        this._result_values[pos][name] = value;
      } else {
        var action_name = Object.keys(value)[0];

        if(SelectionAggregator.hasAction(action_name, "aggregate")) {
          this._result_values[pos][name] =
            SelectionAggregator.actions[action_name].aggregate(this, name, value[action_name]);
        }
      }
    }

    this._names = [];
    this._values = [];
    this._pos = -1;
  };

  /**
  * @public
  * @function
  * @returns {*}
  */
  SelectionAggregator.prototype.getResult = function getResult() {
    var that = this,
        ret = [];

    for(var i = 0, l = that._result_values.length; i < l; i = i + 1) {
      var data = {},
          result = that._result_values[i];

      for(var j in result) {
        if(SelectionAggregator.isValue(result[j])) {
          data[j] = result[j];
        } else if(SelectionAggregator.hasAction(result[j].type, "getResult")) {
          data[j] = SelectionAggregator.actions[result[j].type].getResult(result[j]);
        } else {
          data[j] = null;
        }
      }

      ret[ret.length] = data;
    }

    return ret;
  };

  /**
  * @namespace
  */
  SelectionAggregator.actions = {};

  /**
  * @public
  * @static
  * @function
  * @param {String} name -
  * @param {Object} funcs -
  * @returns {void}
  */
  SelectionAggregator.addPlugin = function addPlugin(name, funcs) {
    if(funcs) {
      SelectionAggregator.actions[name] = {};

      SelectionAggregator.actions[name].init = SelectionAggregator.createInit(name);

      if(typeof funcs.aggregate === "function") {
        SelectionAggregator.actions[name].aggregate = funcs.aggregate;
      }
      if(typeof funcs.getResult === "function") {
        SelectionAggregator.actions[name].getResult = funcs.getResult;
      }
    }
  };

  /**
  * @public
  * @static
  * @function
  * @param {String} name - function name
  * @returns {AggregationOperator}
  */
  SelectionAggregator.createInit = function createInit(name) {
    return function init(value) {
      var set_value = {};
      set_value[name] = value;
      this._agg.next();
      this._agg.setValue(set_value);

      return this;
    };
  };

  /**
  * @public
  * @static
  * @function
  * @param {Object} obj - plugin definition
  * @returns {void}
  */
  SelectionAggregator.loadPluginsTo = function loadPluginsTo(obj) {
    for(var type in SelectionAggregator.actions) {
      if(SelectionAggregator.hasAction(type, "init")) {
        obj[type] = SelectionAggregator.actions[type].init;
      }
    }
  };

  /* define min function */
  SelectionAggregator.addPlugin("min", {
    aggregate: function(agg, name, value) {
      var min_value = agg.getCurrentValue(name) || Number.MAX_SAFE_INTEGER;

      return min_value > value ? value : min_value;
    },
    getResult: null
  });

  /* define max function */
  SelectionAggregator.addPlugin("max", {
    aggregate: function(agg, name, value) {
      var max_value = agg.getCurrentValue(name) || 0;

      return max_value < value ? value : max_value;
    },
    getResult: null
  });

  /* define avg function */
  SelectionAggregator.addPlugin("avg", {
    aggregate: function(agg, name, value) {
      var curr_value = agg.getCurrentValue(name) || { type: "avg", count: 0, value: 0 };

      curr_value.count = curr_value.count + 1;
      curr_value.value = curr_value.value + value;

      return curr_value;
    },
    getResult: function(data) {
      return data.value / data.count;
    }
  });

  /* define sum function */
  SelectionAggregator.addPlugin("sum", {
    aggregate: function(agg, name, value) {
      var curr_value = agg.getCurrentValue(name) || 0;

      return curr_value + value;
    },
    getResult: null
  });

  /* define count function */
  SelectionAggregator.addPlugin("count", {
    aggregate: function(agg, name/*, value*/) {
      var curr_value = agg.getCurrentValue(name) || 0;

      return curr_value + 1;
    },
    getResult: null
  });

  /**
  * @public
  * @static
  * @function
  * @param {String[]} key_targets - aggregation key names
  * @returns {AggregationOperator}
  */
  SelectionAggregator.createAggregationOperator = function createAggregationOperator(key_targets) {
    var _agg = new SelectionAggregator(key_targets);

    var AggregationOperator = function AggregationOperator(value) {
      _agg.next();
      _agg.setValue(value);

      return AggregationOperator;
    };
    AggregationOperator._agg = _agg;

    AggregationOperator.as = function as(name) {
      this._agg.setName(name);

      return AggregationOperator;
    };

    AggregationOperator.aggregate = function aggregate() {
      this._agg.aggretate();
    };

    AggregationOperator.getResult = function getResult() {
      return this._agg.getResult();
    };

    SelectionAggregator.loadPluginsTo(AggregationOperator);

    AggregationOperator.debug = function() {
      return _agg;
    };

    return AggregationOperator;
  };


  cxt.SelectionAggregator = SelectionAggregator;

})(this);
