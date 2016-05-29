/* Table.js */

(function(cxt) {
  "use strict";

  var global = (0, eval)("this"),
      criteria2IDBQuery = require("criteria2IDBQuery").criteria2IDBQuery || global.criteria2IDBQuery,
      SLI2Operator = require("./SLI2Operator.js").SLI2Operator,
      ERROR = require("../param/Error.js").ERROR;

  /**
  * @public
  * @class
  */
  var Table = function Table(name, opt, sli2) {
    this._name = name;
    this._sli2_object = sli2;
    this.transaction = null;
    this.store = null;
    if(opt) {
      sli2.db.createObjectStore(name, opt);
    }
    this._handling = null;
  };

  /**
  * @public
  * @function
  * @param {IDBTransaction} transaction -
  * @param {String} handling_name -
  * @returns {void}
  */
  Table.prototype.open = function open(transaction, handling_name) {
    if(this.transaction || (this._handling !== null && this._handling !== (handling_name || ""))) {
      throw ERROR.table_already_opened(this._name, this._handling);
    }
    if(this._handling === handling_name) {
      return;
    }

    var tra = transaction ||
        this._sli2_object.transaction ||
        this._sli2_object.db.transaction(this._name, "readwrite");

    this.transaction = tra;
    this.store = tra.objectStore(this._name);
    this._handling = handling_name || "";
  };

  /**
  * @public
  * @function
  * @param {IDBTransaction} tra -
  * @param {String} handling_name -
  * @returns {Boolean}
  */
  Table.prototype.tryOpen = function tryOpen(tra, handling_name) {
    if(!this.transaction && (this._handling === null || this._handling === handling_name)) {
      this.open(tra, handling_name);

      return true;

    } else {
      return false;
    }
  };

  /**
  * @public
  * @function
  * @param {String} handling_name -
  * @returns {void}
  */
  Table.prototype.close = function close(handling_name) {
    if(!this.transaction || this._handling !== (handling_name || "")) {
      throw ERROR.table_cannot_close(this._name, this._handling, handling_name);
    }

    this.transaction = null;
    this.store = null;
    this._handling = null;
  };

  /**
  * @public
  * @function
  * @param {String} handling_name -
  * @returns {Boolean}
  */
  Table.prototype.tryClose = function tryClose(handling_name) {
    if(this.transaction && this._handling === (handling_name || "")) {
      this.close(handling_name);

      return true;

    } else {
      return false;
    }
  };

  /**
  * @public
  * @function
  * @return {void}
  */
  Table.prototype.destroy = function destroy() {
    this._name = null;
    this._sli2_object = null;
    this.transaction = null;
    this.store = null;
    this._handling = "";
  };

  /**
  * @public
  * @function
  * @param {String} type - readwrite or readonly
  * @param {Function} func - transaction process
  * @param {Function} success - callback on process successed
  * @param {Funciton} error - callback on process errored
  * @return {void}
  */
  Table.prototype.beginTransaction = function beginTransaction(type, func, success, error) {
    var that = this,
        _success = typeof success === "function" ? success : function() {},
        _error = typeof error === "function" ? error : function() {};

    if(!this.transaction && this._handling) {
      _error(ERROR.invalid_state("beginTransaction"));
      return;
    }

    if(!this.transaction) {
      this.open(null, "table_transaction");

      func.call(this, function(_ret) {
        that.close("table_transaction");
        _success(_ret);

      }, function (err) {
        that.close("table_transaction");
        _error(err);
      });

    } else {
      func.call(this, function(_ret) {
        _success(_ret);
      }, _error);

    }
  };

  /**
  * @public
  * @function
  * @param {Object} opt - create table option
  * @param {Function} success -
  * @param {Function} error -
  * @returns {void}
  */
  Table.prototype.create = function create(opt, success, error) {
    var table_name = this._name,
        sli2 = this._sli2_object,
        _success = typeof success === "function" ? success : function() {},
        _error = typeof error === "function" ? error : function() {};

    sli2.upgrade(function(db) {
      if(db.objectStoreNames.contains(table_name)) {
        _error(ERROR.table_already_exist(table_name));

      } else {
        sli2.db.createObjectStore(table_name, opt);
      }
    }, _success);
  };

  /**
  * @public
  * @function
  * @param {Function} success -
  * @param {Function} error -
  * @returnd {void}
  */
  Table.prototype.drop = function drop(success, error) {
    var table_name = this._name,
        sli2 = this._sli2_object,
        _success = typeof success === "function" ? success : function() {},
        _error = typeof error === "function" ? error : function() {};

    sli2.upgrade(function(db) {
      if(!db.objectStoreNames.contains(table_name)) {
        _error(ERROR.table_not_exist(table_name));

      } else {
        delete sli2.tables[table_name];
        sli2.db.deleteObjectStore(table_name);
      }
    }, _success);
  };

  /**
  * @public
  * @function
  * @param {String} idx_name - index name
  * @param {Object} idx_opt - index option(keyPath etc)
  * @param {Function} success -
  * @param {Function} error -
  * @returns {void}
  */
  Table.prototype.createIndex = function createIndex(idx_name, idx_opt, success, error) {
    var that = this,
        table_name = this._name,
        sli2 = this._sli2_object,
        _success = typeof success === "function" ? success : function() {},
        _error = typeof error === "function" ? error : function() {};

    sli2.upgrade(function(db) {
      var transaction = that.transaction || sli2.db.transaction(table_name),
          store = that.store || transaction.objectStore(table_name);

      if(!db.objectStoreNames.contains(table_name)) {
        _error(ERROR.table_not_exist(table_name));

      } else if(store.indexNames.contains(idx_name)) {
        _error(ERROR.index_already_exist(idx_name));

      } else {
        return store.createIndex(idx_name, idx_opt);
      }
    }, _success);
  };

  /**
  * @public
  * @function
  * @param {String} idx_name - index name
  * @param {Function} success -
  * @returns {void}
  */
  Table.prototype.dropIndex = function dropIndex(idx_name, success) {
    var that = this,
        table_name = this._name,
        sli2 = this._sli2_object,
        _success = typeof success === "function" ? success : function() {};

    sli2.upgrade(function() {
      var store = that.store,
          //transaction = that.transaction || sli2.transaction;
          transaction = that.transaction;

      if(store) {
        return store.deleteIndex(idx_name);

      } else if(transaction) {
        return transaction.objectStore(table_name).deleteIndex(idx_name);

      } else {
        return sli2.db.transaction(table_name).objectStore(table_name).deleteIndex(idx_name);
      }
    }, _success);
  };

  /**
  * @public
  * @function
  * @param {String} alias -
  * @param {Funciton} success - callback on process succesed
  * @param {Function} error - callback on process errored
  * @returns {void}
  */
  Table.prototype.selectAll = function selectAll(alias, success, error) {
    var sli2_ope = new SLI2Operator(this._sli2_object);

    var _success = typeof success === "function" ? success : function() {},
        _error = typeof error === "function" ? error : function() {};

    this.beginTransaction("readwrite", function(fulfill, reject) {
      sli2_ope.selectAll(this.store, alias, function(rows) {
        sli2_ope.close();
        fulfill(rows);
      }, reject);
    }, _success, _error);
  };

  /**
  * @public
  * @function
  * @param {Kriteria} where -
  * @param {String} table_name -
  * @param {String} alias -
  * @param {Funciton} success - callback on process succesed
  * @param {Function} error - callback on process errored
  * @returns {void}
  */
  Table.prototype.selectForQuery = function selectForQuery(where, table_name, alias, success, error) {
    var that = this,
        sli2_ope = new SLI2Operator(this._sli2_object);

    var _success = typeof success === "function" ? success : function() {},
        _error = typeof error === "function" ? error : function() {};

    this.beginTransaction("readwrite", function(fulfill, reject) {
      var query_param = criteria2IDBQuery.createQueryParameter(where, this.store);

      var stores = [],
          key_ranges = [],
          filters = [];

      for(var i = 0, l = query_param.length; i < l; i = i + 1) {
        stores[stores.length] = query_param[i].store;
        filters[filters.length] = query_param[i].filter;
        key_ranges[key_ranges.length] = criteria2IDBQuery.createIDBKeyRange(
          query_param[i], that._sli2_object._idb_objects.IDBKeyRange
        );
      }

      sli2_ope.selectForStoresAndKeyRangesAndFilters(
        stores, key_ranges, filters, table_name, alias,
        function(rows) {
          sli2_ope.close();
          fulfill(rows);
        },
        reject
      );

    }, _success, _error);
  };

  /**
  * @public
  * @function
  * @param {Mixed(Object|Array<Object>)} data -
  * @param {Funciton} success - callback on process succesed
  * @param {Function} error - callback on process errored
  * @returns {void}
  */
  Table.prototype.add = function add(data, success, error) {
    var sli2_ope = new SLI2Operator(this._sli2_object);

    var _success = typeof success === "function" ? success : function() {},
        _error = typeof error === "function" ? error : function() {};

    this.beginTransaction("readwrite", function(fulfill, reject) {
      sli2_ope.add(this.store, data, function(num) {
        sli2_ope.close();
        fulfill(num);
      }, reject);
    }, _success, _error);
  };

  /**
  * @public
  * @function
  * @param {Mixed(Object|Array<Object>)} data -
  * @param {Funciton} success - callback on process succesed
  * @param {Function} error - callback on process errored
  * @returns {void}
  */
  Table.prototype.put = function put(data, success, error) {
    var sli2_ope = new SLI2Operator(this._sli2_object);

    var _success = typeof success === "function" ? success : function() {},
        _error = typeof error === "function" ? error : function() {};

    this.beginTransaction("readwrite", function(fulfill, reject) {
      sli2_ope.put(this.store, data, function(num) {
        sli2_ope.close();
        fulfill(num);
      }, reject);
    }, _success, _error);
  };

  /**
  * @public
  * @function
  * @param {IDBObjectStore} store -
  * @param {Function} success -
  * @param {Function} error -
  * @returns {void}
  */
  Table.prototype.removeAll = function removeAll(success, error) {
    var sli2_ope = new SLI2Operator(this._sli2_object);

    var _success = typeof success === "function" ? success : function() {},
        _error = typeof error === "function" ? error : function() {};

    this.beginTransaction("readwrite", function(fulfill, reject) {
      sli2_ope.deleteAll(this.store, function(num) {
        sli2_ope.close();
        fulfill(num);
      }, reject);
    }, _success, _error);
  };

  /**
  * @public
  * @function
  * @param {Kriteria} where -
  * @param {Function} success -
  * @param {Function} error -
  * @returns {void}
  */
  Table.prototype.removeForQuery = function removeForQuery(where, success, error) {
    var that = this,
        sli2_ope = new SLI2Operator(this._sli2_object);

    var _success = typeof success === "function" ? success : function() {},
        _error = typeof error === "function" ? error : function() {};

    this.beginTransaction("readwrite", function(fulfill, reject) {
      var query_param = criteria2IDBQuery.createQueryParameter(where, this.store);

      var stores = [],
          key_ranges = [],
          filters = [];

      for(var i = 0, l = query_param.length; i < l; i = i + 1) {
        stores[stores.length] = query_param[i].store;
        filters[filters.length] = query_param[i].filter;
        key_ranges[key_ranges.length] = criteria2IDBQuery.createIDBKeyRange(
          query_param[i], that._sli2_object._idb_objects.IDBKeyRange
        );
      }

      sli2_ope.deleteForStoresAndKeyRangesAndFilters(
        stores, key_ranges, filters,
        function(num) {
          sli2_ope.close();
          fulfill(num);
        },
        reject
      );

    }, _success, _error);
  };

  /**
  * @public
  * @function
  * @param {IDBObjectStore} store -
  * @param {Object} data -
  * @param {Function} success -
  * @param {Function} error -
  * @returns {void}
  */
  Table.prototype.updateAll = function updateAll(data, success, error) {
    var sli2_ope = new SLI2Operator(this._sli2_object);

    var _success = typeof success === "function" ? success : function() {},
        _error = typeof error === "function" ? error : function() {};

    this.beginTransaction("readwrite", function(fulfill, reject) {
      sli2_ope.updateAll(this.store, data, function(num) {
        sli2_ope.close();
        fulfill(num);
      }, reject);
    }, _success, _error);
  };

  /**
  * @public
  * @function
  * @param {Kriteria} where -
  * @param {Object} data -
  * @param {Function} success -
  * @param {Function} error -
  * @returns {void}
  */
  Table.prototype.updateForQuery = function updateForQuery(where, data, success, error) {
    var that = this,
        sli2_ope = new SLI2Operator(this._sli2_object);

    var _success = typeof success === "function" ? success : function() {},
        _error = typeof error === "function" ? error : function() {};

    this.beginTransaction("readwrite", function(fulfill, reject) {
      var query_param = criteria2IDBQuery.createQueryParameter(where, this.store);

      var stores = [],
          key_ranges = [],
          filters = [];

      for(var i = 0, l = query_param.length; i < l; i = i + 1) {
        stores[stores.length] = query_param[i].store;
        filters[filters.length] = query_param[i].filter;
        key_ranges[key_ranges.length] = criteria2IDBQuery.createIDBKeyRange(
          query_param[i], that._sli2_object._idb_objects.IDBKeyRange
        );
      }

      sli2_ope.updateForStoresAndKeyRangesAndFilters(
        stores, key_ranges, filters, data,
        function(num) {
          sli2_ope.close();
          fulfill(num);
        },
        reject
      );

    }, _success, _error);
  };

  /**
  * @public
  * @function
  * @returns {void}
  */
  Table.prototype.rollback = function rollback() {
    if(this.transaction) {
      this.transaction.abort();
    } else {
      throw ERROR.no_transaction(this._name);
    }
  };


  cxt.Table = Table;

})(this);
