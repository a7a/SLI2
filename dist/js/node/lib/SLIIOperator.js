/* SLIIOperator.js */

(function(cxt) {
  "use strict";

  var ERROR = require("../param/Error.js").ERROR,
      setFunction = require("./setFunction.js").setFunction;

  /**
  * @public
  * @class
  */
  var SLIIOperator = function SLIIOperator(slii) {
    this._slii_object = slii;
    this._closed = false;
  };

  /**
  * @public
  * @function
  * @returns {void}
  */
  SLIIOperator.prototype.close = function close() {
    this._slii_object = null;
    this._closed = true;
  };

  /**
  * @public
  * @function
  * @param {IDBObjectStore} store -
  * @param {Object|Object[]} data -
  * @param {Function} success - callback on successed
  * @param {Function} error - callback on errored
  * @return {void}
  */
  SLIIOperator.prototype.add = function add(store, data, success, error) {
    if(this._closed) {
      throw ERROR.closed;
    }

    var req = null,
        _data = [],
        num = 0,
        _success = typeof success === "function" ? success : function() {},
        _error = typeof error === "function" ? error : function() {};

    if(Array.isArray(data)) {
      for(var i = 0, l = data.length; i < l; i = i + 1) {
        _data[i] = data[i];
      }
    } else {
      _data[0] = data;
    }

    var loop = function loop() {
      req = store.add(_data.shift());
      req.onsuccess = function() {
        num = num + 1;

        if(_data.length > 0) {
          loop();
        } else {
          _success(num);
        }
      };
      req.onerror = function(e) {
        var _err = e.target.error;
        _error("add: " + _err.name + ": " + _err.message);
      };
    };
    loop();
  };

  /**
  * @public
  * @function
  * @param {IDBObjectStore} store -
  * @param {Object|Object[]} data -
  * @param {Function} success - callback on successed
  * @param {Function} error - callback on errored
  * @return {void}
  */
  SLIIOperator.prototype.put = function put(store, data, success, error) {
    if(this._closed) {
      throw ERROR.closed;
    }

    var req = null,
        _data = [],
        num = 0,
        _success = typeof success === "function" ? success : function() {},
        _error = typeof error === "function" ? error : function() {};

    if(Array.isArray(data)) {
      for(var i = 0, l = data.length; i < l; i = i + 1) {
        _data[i] = data[i];
      }
    } else {
      _data[0] = data;
    }

    var loop = function loop() {
      req = store.put(_data.shift());
      req.onsuccess = function() {
        num = num + 1;

        if(_data.length > 0) {
          loop();
        } else {
          _success(num);
        }
      };
      req.onerror = function(e) {
        var _err = e.target.error;
        _error("put: " + _err.name + ": " + _err.message);
      };
    };
    loop();
  };

  /**
  * @public
  * @function
  * @param {IDBObjectStore} store -
  * @param {String} alias -
  * @param {Function} success - callback on successed
  * @param {Function} error - callback on errored
  * @returns {void}
  */
  SLIIOperator.prototype.selectAll = function selectAll(store, alias, success, error) {
    if(this._closed) {
      throw ERROR.closed;
    }

    var ret = [],
        req = store.openCursor(),
        _success = typeof success === "function" ? success : function() {},
        _error = typeof error === "function" ? error : function() {};

    if(alias) {
      req.onsuccess = function(e) {
        var cursor = e.target.result;

        if(cursor) {
          var data = {};
          data[alias] = cursor.value;
          ret[ret.length] = data;
          cursor.continue();
        } else {
          _success(ret);
        }
      };
      req.onerror = function(e) {
        var _err = e.target.error;
        _error(ERROR.indexed_operation("selectAll: " + _err.name + ": " + _err.message));
      };

    } else {
      req.onsuccess = function(e) {
        var cursor = e.target.result;

        if(cursor) {
          ret[ret.length] = cursor.value;
          cursor.continue();
        } else {
          _success(ret);
        }
      };
      req.onerror = function(e) {
        var _err = e.target.error;
        _error(ERROR.indexed_operation("selectAll: " + _err.name + ": " + _err.message));
      };
    }
  };

  /**
  * @public
  * @function
  * @param {Mixed(IDBStore|IDBIndex)[]} stores -
  * @param {IDBKeyRange[]} key_ranges -
  * @param {Function[]} filters
  * @param {String} table_name - before data prefix
  * @param {Strng} alias - after data prefix
  * @param {Function} success - callback on successed
  * @param {Function} error - callback on errored
  * @returns {void}
  */
  SLIIOperator.prototype.selectForStoresAndKeyRangesAndFilters = function selectForStoresAndKeyRangesAndFilters(
    stores, key_ranges, filters, table_name, alias, success, error
  ) {
    if(this._closed) {
      throw ERROR.closed;
    }

    var ret = [],
        _stores = [],
        _key_ranges = [],
        _filters = [],
        _success = typeof success === "function" ? success : function() {},
        _error = typeof error === "function" ? error : function() {},
        primaryKeys = [];

    for(var i = 0, l = stores.length; i < l; i = i + 1) {
      _stores[i] = stores[i];
      _key_ranges[i] = key_ranges[i];
      _filters[i] = filters[i];
    }

    var loop = function() {
      if(_stores.length > 0) {
        var store = _stores.shift(),
            key_range = _key_ranges.shift(),
            filter = _filters.shift(),
            req = store.openCursor(key_range);

        var set_function = setFunction.setWithNoTableNameAndNoAlias;
        if(table_name !== "" && alias !== "") {
          set_function = setFunction.setWithTableNameAndAlias;
        } else if(table_name !== "" && alias === "") {
          set_function = setFunction.setWithTableName;
        } else if(table_name === "" && alias !== "") {
          set_function = setFunction.setWithAlias;
        }

        req.onsuccess = function (e) {
          var cursor = e.target.result;

          if(cursor) {
            var pk = cursor.primaryKey + "";

            if(!~primaryKeys.indexOf(pk) && set_function(cursor.value, ret, filter, table_name, alias)) {
              primaryKeys[primaryKeys.length] = pk;
            }

            cursor.continue();

          } else {
            loop();
          }
        };
        req.onerror = function(err) {
          var _err = err.target.error;
          _error(
            ERROR.indexed_operation("selectForStoreAndKeyRangesAndFilter: " + _err.name + ": " + _err.message)
          );
        };

      } else {
        _success(ret);
      }
    };
    loop();
  };

  /**
  * @public
  * @function
  * @param {IDBObjectStore} store -
  * @param {Function} success - callback on successed
  * @param {Function} error - callback on errored
  * @returns {void}
  */
  SLIIOperator.prototype.deleteAll = function deleteAll(store, success, error) {
    if(this._closed) {
      throw ERROR.closed;
    }

    var _success = typeof success === "function" ? success : function() {},
        _error = typeof error === "function" ? error : function() {},
        req = store.openCursor(),
        num = 0;

    req.onsuccess = function(e) {
      var cursor = e.target.result;

      if(cursor) {
        cursor.delete();
        num = num + 1;
        cursor.continue();
      } else {
        _success(num);
      }
    };
    req.onerror = function(err) {
      var _err = err.target.error;
      _error(ERROR.indexed_operation("deleteAll: " + _err.name + ": " + _err.message));
    };
  };

  /**
  * @public
  * @function
  * @param {Mixed(IDBStore|IDBIndex)[]} stores -
  * @param {IDBKeyRange[]} key_ranges -
  * @param {Function[]} filters
  * @param {Function} success - callback on successed
  * @param {Function} error - callback on errored
  * @returns {void}
  */
  SLIIOperator.prototype.deleteForStoresAndKeyRangesAndFilters = function deleteForStoresAndKeyRangesAndFilters(
    stores, key_ranges, filters, success, error
  ) {
    if(this._closed) {
      throw ERROR.closed;
    }

    var _success = typeof success === "function" ? success : function() {},
        _error = typeof error === "function" ? error : function() {},
        num = 0,
        _stores = [],
        _key_ranges = [],
        _filters = [];

    for(var i = 0, l = stores.length; i < l; i = i + 1) {
      _stores[i] = stores[i];
      _key_ranges[i] = key_ranges[i];
      _filters[i] = filters[i];
    }

    var loop = function loop() {
      if(_stores.length > 0) {
        var store = _stores.shift(),
            key_range = _key_ranges.shift(),
            filter = _filters.shift(),
            req = store.openCursor(key_range);

        req.onsuccess = function (e) {
          var cursor = e.target.result;

          if(cursor) {
            if(filter(cursor.value)) {
              cursor.delete();
              num = num + 1;
            }
            cursor.continue();
          } else {
            loop();
          }
        };
        req.onerror = function(err) {
          var _err = err.target.error;
          _error(
            ERROR.indexed_operation("deleteForStoreAndKeyRangesAndFilter: " + _err.name + ": " + _err.message)
          );
        };

      } else {
        _success(num);
      }
    };
    loop();
  };

  /**
  * @public
  * @function
  * @param {IDBObjectStore} store -
  * @param {Object} data -
  * @param {Function} success - callback on successed
  * @param {Function} error - callback on errored
  * @returns {void}
  */
  SLIIOperator.prototype.updateAll = function updateAll(store, data, success, error) {
    if(this._closed) {
      throw ERROR.closed;
    }

    var req = store.openCursor(),
        num = 0,
        _success = typeof success === "function" ? success : function() {},
        _error = typeof error === "function" ? error : function() {};

    req.onsuccess = function(e) {
      var cursor = e.target.result;

      if(cursor) {
        var new_data = cursor.value;
        for(var i in data) {
          new_data[i] = data[i];
        }

        cursor.update(new_data);
        num = num + 1;
        cursor.continue();
      } else {
        _success(num);
      }
    };
    req.onerror = function(err) {
      var _err = err.target.error;
      _error(ERROR.indexed_operation("updateAll: " + _err.name + ": " + _err.message));
    };
  };

  /**
  * @public
  * @function
  * @param {Mixed(IDBStore|IDBIndex)[]} stores -
  * @param {IDBKeyRange[]} key_ranges -
  * @param {Function[]} filters
  * @param {Object} data -
  * @param {Function} success - callback on successed
  * @param {Function} error - callback on errored
  * @returns {void}
  */
  SLIIOperator.prototype.updateForStoresAndKeyRangesAndFilters = function updateForStoresAndKeyRangesAndFilters(
    stores, key_ranges, filters, data, success, error
  ) {
    if(this._closed) {
      throw ERROR.closed;
    }

    var num = 0,
        _stores = [],
        _key_ranges = [],
        _filters = [],
        _success = typeof success === "function" ? success : function() {},
        _error = typeof error === "function" ? error : function() {};

    for(var i = 0, l = stores.length; i < l; i = i + 1) {
      _stores[i] = stores[i];
      _key_ranges[i] = key_ranges[i];
      _filters[i] = filters[i];
    }

    var loop = function loop() {
      if(_key_ranges.length > 0) {
        var store = _stores.shift(),
            key_range = _key_ranges.shift(),
            filter = _filters.shift(),
            req = store.openCursor(key_range);

        req.onsuccess = function(e) {
          var cursor = e.target.result;

          if(cursor) {
            if(filter(cursor.value)) {
              var new_data = cursor.value;
              for(var j in data) {
                new_data[j] = data[j];
              }

              cursor.update(new_data);
              num = num + 1;
            }
            cursor.continue();

          } else {
            loop();
          }
        };
        req.onerror = function(err) {
          var _err = err.target.error;
          _error(
            ERROR.indexed_operation("updateForStoreAndKeyRangesAndFilter: " + _err.name + ": " + _err.message)
          );
        };

      } else {
        _success(num);
      }
    };
    loop();
  };


  cxt.SLIIOperator = SLIIOperator;

})(this);
