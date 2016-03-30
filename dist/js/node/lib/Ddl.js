/* Ddl.js */

(function(cxt) {
  "use strict";

  var Querable = require("./Querable.js").Querable,
      Table = require("./Table.js").Table,
      ERROR = require("../param/ERROR.js").ERROR;


  /**
  * @public
  * @class
  * @arguments Querable
  */
  var Ddl = function Ddl() {
    Querable.apply(this, arguments);
    this._set_create_table = false;
    this._set_drop_table = false;
    this._set_create_index = false;
    this._set_drop_index = false;
    this._table_name = "";
    this._index_name = "";
    this._option = {};
  };

  /* inherit */
  Ddl.prototype = Object.create(Querable.prototype, {
    constructor: {
      value: Ddl,
      enumerable: true,
      writable: false,
      configurable: true
    }
  });

  /**
  * @public
  * @funciton
  * @param {String} name - table name
  * @param {Object} opt - create table option
  * @returns {Ddl}
  */
  Ddl.prototype.create_table =
  Ddl.prototype.createTable = function create_table(name, opt) {
    if(this._set_create_table || this._set_drop_table || this._set_create_index || this._set_drop_index) {
      throw ERROR.invalid_description("create_table");
    }
    if(this._check_arguments && (arguments.length < 1 || arguments.length > 2)) {
      throw ERROR.invalid_argument("create_table");
    }

    this._set_create_table = true;
    this._table_name = name;
    this._option = opt;

    return this;
  };

  /**
  * @public
  * @funciton
  * @param {String} name - table name
  * @returns {Ddl}
  */
  Ddl.prototype.drop_table =
  Ddl.prototype.dropTable = function drop_table(name) {
    if(this._set_create_table || this._set_drop_table || this._set_create_index || this._set_drop_index) {
      throw ERROR.invalid_description("drop_table");
    }
    if(this._check_arguments && arguments.length !== 1) {
      throw ERROR.invalid_argument("drop_table");
    }

    this._set_drop_table = true;
    this._table_name = name;

    return this;
  };

  /**
  * @public
  * @function
  * @param {String} table_name - table name
  * @param {String} idx_name - index name
  * @param {Object} opt - create index option
  * @returns {Ddl}
  */
  Ddl.prototype.create_index =
  Ddl.prototype.createIndex = function create_index(table_name, idx_name, opt) {
    if(this._set_create_table || this._set_drop_table || this._set_create_index || this._set_drop_index) {
      throw ERROR.invalid_description("create_index");
    }
    if(this._check_arguments && arguments.length !== 3) {
      throw ERROR.invalid_argument("create_index");
    }

    this._set_create_index = true;
    this._table_name = table_name;
    this._index_name = idx_name;
    this._option = opt;

    return this;
  };

  /**
  * @public
  * @function
  * @param {String} table_name - table name
  * @param {String} idx_name - index name
  * @retusn {Ddl}
  */
  Ddl.prototype.drop_index =
  Ddl.prototype.dropIndex = function drop_index(table_name, idx_name) {
    if(this._set_create_table || this._set_drop_table || this._set_create_index || this._set_drop_index) {
      throw ERROR.invalid_description("drop_index");
    }
    if(this._check_arguments && arguments.length !== 2) {
      throw ERROR.invalid_argument("create_index");
    }

    this._set_drop_index = true;
    this._table_name = table_name;
    this._index_name = idx_name;

    return this;
  };

  /**
  * @private
  * @function
  * @returns {Boolean}
  */
  Ddl.prototype._isRunnable = function _isRunnable() {
    return this._set_create_table || this._set_drop_table || this._set_create_index || this._set_drop_index;
  };

  /**
  * @public
  * @function
  * @param {Function} func - callback function
  *   arguments[0] is idb operation result
  *   arguments[1] is function for _exec fulfilled
  *   arguments[2] is function for _exec rejected
  * @param {Function} end - _exec fulfilled
  * @param {Function} error - _exec rejected
  * @retuns {void}
  */
  Ddl.prototype.exec = function exec(func, end, error) {
    if(!this._isRunnable()) {
      throw ERROR.invalid_description("exec");
    }

    var that = this,
        sli2 = this._sli2_object,
        _end = typeof end === "function" ? end : function() {},
        _error = typeof error === "function" ? error : function() {};

    if(sli2 === void 0 || sli2 === null) {
      throw ERROR.querable_is_not_initialized;
    }

    var _exec_fulfill = function() {
          _end();
        },
        _exec_reject = function(at) {
          return function(err) {
            _error(ERROR.ddl_exec_error(at + " / " + err.message));
          };
        },
        _reject = function() {},
        _func = typeof func === "function" ? func : _exec_fulfill;

    // ##############################
    // *** Create Table Query ***
    // ##############################
    if(this._set_create_table) {
      _reject = _exec_reject("create_table");

      if(sli2.tables[this._table_name]) {
        _reject(ERROR.table_already_exist(this._table_name));

      } else {
        var table = new Table(this._table_name, null, sli2);

        table.create(
          this._option,
          function() {
            var handler = "";

            sli2.tables[that._table_name] = table;

            if(sli2.isUpgrading()) {
              handler = sli2.constructor.DEFAULT_UPGRADING_HANDLER;

            } else if(sli2.isTransacting()) {
              _reject(ERROR.cannot_execute("create_table in transacting"));
            }

            table.open(sli2.transactio, handler);
            _func(table, _exec_fulfill, _reject);
            if(!handler) {
              table.close(handler);
            }
          },
          _reject
        );
      }

    // ##############################
    // *** Drop Table Query ***
    // ##############################
    } else if(this._set_drop_table) {
      _reject = _exec_reject("drop_table");

      if(!sli2.tables[this._table_name]) {
        _reject(ERROR.table_not_exist(this._table_name));

      } else {
        sli2.tables[this._table_name].drop(
          function() {
            _func(null, _exec_fulfill, _reject);
          },
          _reject
        );
      }


    // ##############################
    // *** Create Index Query ***
    // ##############################
    } else if(this._set_create_index) {
      _reject = _exec_reject("create_index");

      if(!sli2.tables[this._table_name]) {
        _reject(ERROR.table_not_exist(this._table_name));

      } else {
        sli2.tables[this._table_name].createIndex(
          this._index_name, this._option,
          function() {
            _func(null, _exec_fulfill, _reject);
          },
          _reject
        );
      }

    // ##############################
    // *** Drop Index Query ***
    // ##############################
    } else if(this._set_drop_index) {
      _reject = _exec_reject("drop_index");

      if(!sli2.tables[this._table_name]) {
        _reject(ERROR.table_not_exist(this._table_name));

      } else {
        sli2.tables[this._table_name].dropIndex(
          this._index_name,
          function() {
            _func(null, _exec_fulfill, _reject);
          },
          _reject
        );
      }

    }
  };


  cxt.Ddl = Ddl;

}(this));
