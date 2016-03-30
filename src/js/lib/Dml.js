/* Dml.js */

(function(cxt) {
  "use strict";

  var global = (0, eval)("this"),
      ERROR = require("../param/ERROR.js").ERROR,
      Querable = require("./Querable.js").Querable,
      Kriteria = require("Kriteria").Kriteria || global.Kriteria,
      SelectionAggregator = require("./SelectionAggregator.js").SelectionAggregator,
      arraySortWithObjectElement =
        require("./arraySortWithObjectElement.js").arraySortWithObjectElement,
      arrayUniqueMerge = require("./arrayUniqueMerge.js").arrayUniqueMerge,
      setFunction = require("./setFunction.js").setFunction,
      async = require("async"),
      clone = require("clone");


  /**
  * @public
  * @class
  * @arguments Querable
  */
  var Dml = function Dml(/*sli2*/) {
    Querable.apply(this, arguments);
    //this._sli2_object = sli2;
    this._check_arguments = true;
    this._set_select = false;
    this._set_from = false;
    this._set_as = false;
    this._set_insert = false;
    this._set_delete = false;
    this._set_update = false;
    this._set_set = false;
    this._set_join = false;
    this._set_where = false;
    this._set_group_by = false;
    this._set_having = false;
    this._set_order_by = false;
    this._set_limit = false;
    this._limit_num = 0;
    this._set_offet = false;
    this._ready_offset = false;
    this._offset_num = 0;
    this._selection = null;
    this._select_table = "";
    this._table_alias = "";
    this._select_input_query = null;
    this._select_input_array = null;
    this._insert_table = "";
    this._insert_columns = [];
    this._delete_table = "";
    this._update_table = "";
    this._update_data = "";
    this._joins = [];
    this._where = null;
    this._groupings = [];
    this._having = null;
    this._orderings = [];
    this._insert_array_values = [];
    this._insert_object_values = [];
    this._union_queries = [];
    this._union_all_queries = [];
    this._must_be_select = false;
  };

  /* inherit */
  Dml.prototype = Object.create(Querable.prototype, {
    constructor: {
      value: Dml,
      enumerable: true,
      writable: false,
      configurable: true
    }
  });

  /**
  * @public
  * @function
  * @returns {Boolean}
  */
  Dml.prototype.isSelectQuery = function isSelectQuery() {
    return !!(!this._set_insert && this._set_select && this._set_from);
  };

  /**
  * @public
  * @function
  * @returns {Boolean}
  */
  Dml.prototype.isInsertQuery = function isInsertQuery() {
    return !!(this._set_insert);
  };

  /**
  * @public
  * @function
  * @returns {Boolean}
  */
  Dml.prototype.isDeleteQuery = function isDeleteQuery() {
    return !!(this._set_delete);
  };

  /**
  * @public
  * @function
  * @returns {Boolean}
  */
  Dml.prototype.isUpdateQuery = function isUpdateQuery() {
    return !!(this._set_update);
  };

  /**
  * @public
  * @function
  * @param {Boolean}
  * @returns {void}
  */
  Dml.prototype.forceSelectQuery = function forceSelectQuery(flg) {
    this._must_be_select = flg;
  };

  /**
  * @public
  * @function
  * @param {Dml} querable -
  * @param {String} type - 'union' or 'union_all'
  * @returns {void}
  */
  Dml.prototype.addUnions = function addUnions(querable, type) {
    var unions = querable.getUnions(type),
        new_unions = [];

    for(var i = 0, l = unions.length; i < l; i = i + 1) {
      new_unions[new_unions.length] = unions[i];
    }
    new_unions[new_unions.length] = querable;

    if(type === "union") {
      this._union_queries = new_unions;
    } else if(type === "union_all") {
      this._union_all_queries = new_unions;
    }

    querable.clearUnions(type);
  };

  /**
  * @public
  * @function
  * @param {String} type - 'union' or 'union_all'
  * @returns {Dml[]}
  */
  Dml.prototype.getUnions = function getUnions(type) {
    if(type === "union") {
      return this._union_queries;
    } else if(type === "union_all") {
      return this._union_all_queries;
    } else {
      return [];
    }
  };

  /**
  * @public
  * @function
  * @params {String} type - 'union' or 'union_all'
  * @returns {void}
  */
  Dml.prototype.clearUnions = function clearUnions(type) {
    if(type === "union") {
      this._union_queries = [];
    } else if(type === "union_all") {
      this._union_all_queries = [];
    }
  };

  /**
  * @public
  * @function
  * @returns {String}
  */
  Dml.prototype.getTableName = function getTableName() {
    if(this.isInsertQuery()) {
      return this._insert_table;

    } else if(this._select_input_query) {
      return this._table_alias || "";

    } else if(this.isSelectQuery()) {
      return this._table_alias || this._select_table || "";

    } else if(this.isDeleteQuery()) {
      return this._delete_table;

    } else if(this.isUpdateQuery()) {
      return this._update_table;

    } else {
      return "";
    }
  };

  /**
  * @public
  * @function
  * @returns {String[]}
  */
  Dml.prototype.getTableNames = function getTableNames() {
    var table_names = [];

    if(this._select_table) {
      table_names[table_names.length] = this._select_table;
    }
    if(this._table_alias) {
      table_names[table_names.length] = this._table_alias;
    }

    for(var i = 0, l = this._joins.length; i < l; i = i + 1) {
      var alias = this._joins[i][3];

      if(alias) {
        table_names[table_names.length] = alias;
      }
    }

    return table_names;
  };

  /**
  * @public
  * @function
  * @param {Mixed(Function|undefined)} selection - table columun select function
  * @returns {Dml}
  * @description
  *   select table columns. when argument is undefined, get all columns.
  */
  Dml.prototype.select = function select(selection) {
    if(!(!this._set_select && !this._set_values && !this._set_delete && !this._set_update)) {
      throw ERROR.invalid_description("select");
    }
    if(this._check_arguments && arguments.length !== 0 && arguments.length !== 1 &&
       typeof selection !== "function" && selection !== void 0) {
      throw ERROR.invalid_argument("select");
    }

    this._set_select = true;
    this._selection = selection;

    return this;
  };

  /**
  * @public
  * @function
  * @param {Mixed(String|Dml|Object[]|Object)*} arguments - select target
  * @returns {Dml}
  * @description
  *   USAGE:
  *   select().from("table_name")
  *   select().from(select().from("table_name"))
  *   select().from([data1, data2, data3...])
  *   select().from({ "table_name1": "alias1", "table_name2": "alias2"... })
  */
  Dml.prototype.from = function from() {
    if(!(this._set_select && !this._set_from && !this._set_join && !this._set_where &&
        !this._set_group_by && !this._set_having && !this._set_order_by && !this._set_limit)) {
      throw ERROR.invalid_description("from");
    }
    if(this._check_arguments && arguments.length === 0) {
      throw ERROR.invalid_argument("from");
    }

    this._set_from = true;

    for(var i = 0, l = arguments.length; i < l; i = i + 1) {
      var arg = arguments[i];

      if(typeof arg === "string" || arg instanceof String) {
        // select * from "table"
        if(i === 0) {
          this._select_table = arg;
        } else {
          this.join(arg);
        }

      } else if(arg instanceof Dml) {
        // select * from (select * ...)
        if(arg.isSelectQuery()) {
          if(i === 0) {
            this._select_input_query = arg;
          } else {
            this.join(arg);
          }
        } else {
          throw ERROR.invalid_argument("from");
        }

      } else if(Array.isArray(arg)) {
        // select * from [data1, data2, data3...]
        if(i === 0) {
          this._select_input_array = arg;
          this._table_alias = "left";
        } else {
          this.join(arg);
        }

      } else {
        // select * from { "table": "alias" }
        for(var key in arg) {
          if(i === 0) {
            this._select_table = key;
            this.as(arg[key]);
          } else {
            this.join(key).as(arg[key]);
          }
        }
      }
    }

    return this;
  };

  /**
  * @public
  * @function
  * @param {String} alias - table name alias
  * @returns {Dml}
  */
  Dml.prototype.as = function as(alias) {
    if(!(this._set_select && (this._set_from || this._set_join) && !this._set_as && !this._set_where &&
        !this._set_group_by && !this._set_having && !this._set_order_by && !this._set_limit)) {
      throw ERROR.invalid_description("as");
    }
    if(this._check_arguments &&
        !(typeof alias === "string" || alias instanceof String && alias !== "")) {
      throw ERROR.invalid_argument("as");
    }

    this._set_as = true;

    if(this._set_join) {
      if(this._joins[this._joins.length - 1]) {
        this._joins[this._joins.length - 1][3] = alias;
      }
    } else {
      this._table_alias = alias;
    }

    return this;
  };

  /**
  * @public
  * @function
  * @param {String} table - insert target table
  * @param {Mixed(String[]|undefined)} columns - insert target columns
  * @returns {Dml}
  */
  Dml.prototype.insert_into =
  Dml.prototype.insertInto = function insert_into(table, columns) {
    if(!(!this._must_be_select && !this._set_select && !this._set_insert &&
        !this._set_delete && !this._set_update)) {
      throw ERROR.invalid_description("insert_into");
    }
    if(this._check_arguments && arguments.length !== 1 && arguments.length !== 2) {
      throw ERROR.invalid_argument("insert_into");
    }

    this._set_insert = true;
    this._insert_table = table;
    if(Array.isArray(columns) && columns.length > 0) {
      this._insert_columns = columns;
    }

    return this;
  };

  /**
  * @public
  * @function
  * @param {String} table - delete target table
  * @returns {Dml}
  */
  Dml.prototype.delete_from =
  Dml.prototype.deleteFrom = function delete_from(table) {
    if(!(!this._must_be_select && !this._set_select && !this._set_insert &&
        !this._set_delete && !this._set_update)) {
      throw ERROR.invalid_description("delete_from");
    }
    if(this._check_arguments && arguments.length !== 1) {
      throw ERROR.invalid_argument("delete_from");
    }

    this._set_delete = true;
    this._delete_table = table;

    return this;
  };

  /**
  * @public
  * @function
  * @param {String} table - update target table
  * @returns {Dml}
  */
  Dml.prototype.update = function update(table) {
    if(!(!this._must_be_select && !this._set_select && !this._set_insert &&
        !this._set_delete && !this._set_update)) {
      throw ERROR.invalid_description("update");
    }
    if(this._check_arguments && arguments.length !== 1) {
      throw ERROR.invalid_argument("update");
    }

    this._set_update = true;
    this._update_table = table;

    return this;
  };

  /**
  * @public
  * @function
  * @param {Object} data - update data
  * @returns {Dml}
  */
  Dml.prototype.set = function set(data) {
    if(!(this._set_update)) {
      throw ERROR.invalid_argument("set");
    }
    if(this._check_arguments && arguments.length !== 1) {
      throw ERROR.invalid_argument("set");
    }

    this._set_set = true;
    this._update_data = data;

    return this;
  };

  /**
  * @public
  * @function
  * @param {Mixed(Dml|String|Object[])} join_target - joins data
  * @param {Mixed(Kriteria|Function)} kriteria - join condition
  * @param {String} type - 'inner', 'left', 'right'
  * @returns {Dml}
  */
  Dml.prototype.join = function join(join_target, kriteria, type) {
    if(!(this._set_select && this._set_from && !this._set_where && !this._set_group_by &&
        !this._set_having && !this._set_order_by && !this._set_limit)) {
      throw ERROR.invalid_description("join");
    }
    if(this._check_arguments && (arguments.length === 0 || arguments.length > 3)) {
      throw ERROR.invalid_argument("join");
    }

    var kri = null,
        _type = type || "inner";

    if(arguments.length >= 2) {
      if(typeof kriteria === "function") {
        kri = new Kriteria();
        kriteria(kri);
      } else if(kriteria instanceof Kriteria){
        kri = kriteria;
      }
    }

    this._set_join = true;
    this._set_as = false;

    var idx = this._joins.length;

    if(join_target instanceof Dml) {
      /*
        0: querable
        1: kriteria
        2: join object = null
        3: alias = ""
        4: type
      */
      this._joins[idx] = [join_target, kri, null, "", _type];

    } else if(typeof join_target === "string" || join_target instanceof String) {
      // join_taget is table_name
      // create select-query from join_target
      this._joins[idx] = [
        new Dml(this._sli2_object).select().from(join_target), kri, null, join_target, _type
      ];

    } else if(Array.isArray(join_target)) {
      /*
        0: querable = null
        1: kriteria
        2: join object
        3: alias = ""
        4: type
      */
      this._joins[idx] = [null, kri, join_target, "right_" + (idx + 1), _type];

    } else if(this._check_arguments) {
      throw ERROR.invalid_argument("join");
    }

    return this;
  };

  /**
  * @public
  * @function
  * @param {Mixed(Dml|Object[])} join_target - joins data
  * @param {Mixed(Kriteria|Function)} kriteria - join condition
  * @returns {Dml}
  */
  Dml.prototype.inner_join =
  Dml.prototype.innerJoin = function inner_join(join_target, kriteria) {
    return this.join(join_target, kriteria, "inner");
  };

  /**
  * @public
  * @function
  * @param {Mixed(Dml|Object[])} join_target - joins data
  * @param {Mixed(Kriteria|Function)} kriteria - join condition
  * @returns {Dml}
  */
  Dml.prototype.left_join =
  Dml.prototype.leftJoin = function left_join(join_target, kriteria) {
    return this.join(join_target, kriteria, "left");
  };

  /**
  * @public
  * @function
  * @param {Mixed(Dml|Object[])} join_target - joins data
  * @param {Mixed(Kriteria|Function)} kriteria - join condition
  * @returns {Dml}
  */
  Dml.prototype.right_join =
  Dml.prototype.rightJoin = function right_join(join_target, kriteria) {
    return this.join(join_target, kriteria, "right");
  };

  /**
  * @public
  * @function
  * @param {Mixed(Kriteria|Function)} kriteria - ope  rating condition
  * @returns {Dml}
  */
  Dml.prototype.where = function where(kriteria) {
    if(!((this._set_select && this._set_from || this._set_delete ||
        this._set_update && this._set_set) &&
        !this._set_where && !this._set_group_by && !this._set_having && !this._set_order_by &&
        !this._set_limit)) {
      throw ERROR.invalid_description("where");
    }
    if(this._check_arguments && arguments.length !== 1) {
      throw ERROR.invalid_argument("where");
    }

    var kri = null;

    if(typeof kriteria === "function") {
      kri = new Kriteria();
      kriteria(kri);
    } else {
      kri = kriteria;
    }

    this._set_where = true;
    this._where = kri;

    return this;
  };

  /**
  * @public
  * @function
  * @param {Mixed(...String|String[])} - grouping target names
  * @returns {Dml}
  */
  Dml.prototype.group_by =
  Dml.prototype.groupBy = function group_by() {
    if(!(this._set_select && this._set_from && !this._set_group_by &&
        !this._set_order_by && !this._set_having && !this._set_limit)) {
      throw ERROR.invalid_description("group_by");
    }
    if(this._check_arguments &&
       (arguments.length === 0 || Array.isArray(arguments[0]) && arguments[0].length === 0)) {
      throw ERROR.invalid_argument("group_by");
    }

    var i = 0, l = 0;

    this._set_group_by = true;

    this._groupings = [];
    if(Array.isArray(arguments[0])) {
      for(i = 0, l = arguments[0].length; i < l; i = i + 1) {
        this._groupings[this._groupings.length] = arguments[0][i];
      }
    } else {
      for(i = 0, l = arguments.length; i < l; i = i + 1) {
        this._groupings[this._groupings.length] = arguments[i];
      }
    }

    return this;
  };

  /**
  * @public
  * @function
  * @param {Mixed(Kriteria|Function)} kriteria - criteria condition after group_by
  * @returns {Dml}
  */
  Dml.prototype.having = function having(kriteria) {
    if(!(this._set_select && this._set_from && this._set_group_by &&
        !this._set_order_by && !this._set_having && !this._set_limit)) {
      throw ERROR.invalid_description("having");
    }
    if(this._check_arguments && arguments.length !== 1) {
      throw ERROR.invalid_argument("having");
    }

    var kri = null;

    if(typeof kriteria === "function") {
      kri = new Kriteria();
      kriteria(kri);
    } else {
      kri = kriteria;
    }

    this._set_having = true;
    this._having = kri;

    return this;
  };

  /**
  * @public
  * @function
  * @returns {Dml}
  */
  Dml.prototype.union = function union() {
    if(!(this.isSelectQuery() && !this._set_order_by && !this._set_limit)
       || this._union_all_queries.length > 0) {
      throw ERROR.invalid_description("union");
    }

    var new_querable = new Dml(this._sli2_object);
    new_querable.forceSelectQuery(true);
    new_querable.addUnions(this, "union");

    return new_querable;
  };

  /**
  * @public
  * @function
  * @returns {Dml}
  */
  Dml.prototype.union_all =
  Dml.prototype.unionAll = function union_all() {
    if(!(this.isSelectQuery() && !this._set_order_by && !this._set_limit)
       || this._union_queries.length > 0) {
      throw ERROR.invalid_description("union_all");
    }

    var new_querable = new Dml(this._sli2_object);
    new_querable.forceSelectQuery(true);
    new_querable.addUnions(this, "union_all");

    return new_querable;
  };

  /**
  * @public
  * @function
  * @param {Mixed(...String|String[]|Object[])} - ordering target names
  * @returns {Dml}
  */
  Dml.prototype.order_by =
  Dml.prototype.orderBy = function order_by() {
    if(!(this._set_select && this._set_from && !this._set_order_by && !this._set_limit)) {
      throw ERROR.invalid_description("order_by");
    }
    if(this._check_arguments &&
       (arguments.length === 0 || Array.isArray(arguments[0]) && arguments[0].length === 0)) {
      throw ERROR.invalid_argument("order_by");
    }

    var i = 0, l = 0;

    this._set_order_by = true;

    this._orderings = [];
    if(Array.isArray(arguments[0])) {
      for(i = 0, l = arguments[0].length; i < l; i = i + 1) {
        this._orderings[this._orderings.length] = arguments[0][i];
      }
    } else {
      for(i = 0, l = arguments.length; i < l; i = i + 1) {
        this._orderings[this._orderings.length] = arguments[i];
      }
    }

    return this;
  };

  /**
  * @public
  * @finction
  * @param {Number} n - 'limit'(when argument number is 1) or 'offset'(when argument number is 2)
  * @param {Number} m - 'limit'(when argument number is 2)
  * @returns {Dml}
  */
  Dml.prototype.limit = function limit(n, m) {
    if(!(this._set_select && this._set_from && !this._set_limit)) {
      throw ERROR.invalid_description("limit");
    }
    if(this._check_arguments &&
       arguments.length === 0 || arguments.length > 2 ||
       (arguments.length > 0 && (Number.isNaN(+arguments[0]) || arguments[0] < 0)) ||
       (arguments.length > 1 && (Number.isNaN(+arguments[1]) || arguments[1] < 0))) {
      throw ERROR.invalid_argument("limit");
    }

    this._set_limit = true;

    if(arguments.length === 1) {
      this._limit_num = n|0;

    } else if(arguments.length === 2) {
      this._offset_num = n|0;
      this._limit_num = m|0;
    }

    return this;
  };

  /**
  * @public
  * @function
  * @param {Number} n - offset number
  * @returns {Dml}
  */
  Dml.prototype.offset = function offset(n) {
    if(!(this._set_limit && !this._set_offet)) {
      throw ERROR.invalid_description("offset");
    }
    if(this._check_arguments && arguments.length === 1 &&
       (Number.isNaN(+arguments[0]) || arguments[0] < 0)) {
      throw ERROR.invalid_argument("offset");
    }

    this._set_offet = true;

    this._offset_num = n;

    return this;
  };
  /**
  * @public
  * @function
  * @param {Mixed(...String|Array)} - data for inserted
  * @returns {Dml}
  */
  Dml.prototype.values = function values() {
    if(!(this._set_insert && !this._set_values)) {
      throw ERROR.invalid_description("values");
    }
    if(this._check_arguments &&
       (arguments.length === 0 || Array.isArray(arguments[0]) && arguments[0].length === 0)) {
      throw ERROR.invalid_argument("values");
    }

    var has_literal = false,
        i = 0, l = 0;

    this._set_values = true;
    this._insert_array_values = [];
    this._insert_object_values = [];

    for(i = 0, l = arguments.length; i < l; i = i + 1) {
      var arg = arguments[i];

      if(Array.isArray(arg)) {
        this._insert_array_values[this._insert_array_values.length] = arg;

      } else if(arg.constructor === Object) {
        this._insert_object_values[this._insert_object_values.length] = arg;

      } else {
        has_literal = true;
        break;
      }
    }

    if(has_literal) {
      this._insert_array_values = [[]];
      this._insert_object_values = [];

      for(i = 0, l = arguments.length; i < l; i = i + 1) {
        this._insert_array_values[0][i] = arguments[i];
      }
    }

    return this;
  };

  /**
  * @private
  * @function
  * @returns {Boolean}
  */
  Dml.prototype._isRunnable = function _isRunnable() {
    return this._set_select && this._set_from || this._set_insert ||
           this._set_delete || this._set_update && this._set_set;
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
  Dml.prototype.exec = function exec(func, end, error) {
    if(!this._isRunnable()) {
      throw ERROR.invalid_description("exec");
    }

    var that = this,
        sli2 = this._sli2_object,
        _end = typeof end === "function" ? end : function() {},
        _error = typeof error === "function" ? error : function() {},
        union_rows = [],
        i = 0, l = 0,
        j = 0, l2 = 0,
        k = 0, l3 = 0;

    if(sli2 === void 0 || sli2 === null) {
      throw ERROR.querable_is_not_initialized;
    }

    var _exec_fulfill = function() {
          _end();
        },
        _exec_reject = function(at) {
          return function(err) {
            _error(ERROR.dml_exec_error(at + " / " + err.message));
          };
        },
        _reject = function() {},
        _func = typeof func === "function" ? func : _exec_fulfill;

    // ##############################
    // *** Insert Query ***
    // ##############################
    if(that.isInsertQuery()) {
      _reject = _exec_reject("insert_into");

      if(!sli2.tables[that._insert_table]) {
        _reject(ERROR.table_not_exist(that._insert_table));
        return;
      }

      //_func = typeof func === "function" ? func : _exec_fulfill;

      if(that._insert_array_values.length > 0 || that._insert_object_values.length > 0) {
        var insert_data = [];

        if(that._insert_array_values.length > 0) {
          if(that._insert_columns.length > 0) {
            for(i = 0, l = that._insert_array_values.length; i < l; i = i + 1) {
              insert_data[i] = {};

              for(j = 0, l2 = that._insert_columns.length; j < l2; j = j + 1) {
                insert_data[i][that._insert_columns[j]] = that._insert_array_values[i][j];
              }
            }

          } else {
            // TODO
            // tableからschemaを取得する
            _reject(new Error("unsupported command."));
          }
        }

        if(that._insert_object_values.length > 0) {
          for(i = 0, l = that._insert_object_values.length; i < l; i = i + 1) {
            insert_data[insert_data.length] = that._insert_object_values[i];
          }
        }

        sli2.tables[that._insert_table].add(
          insert_data,
          function(num) {
            _func(num, _exec_fulfill, _reject);
          }, _reject
        );

      } else if(that._set_select) {
        // TODO
        _reject(new Error("unsupported command."));

      } else {
        _reject(ERROR.invalid_description("insert_into"));
      }

    // ##############################
    // *** Delete Query ***
    // ##############################
    } else if(that.isDeleteQuery()) {
      _reject = _exec_reject("delete_from");

      if(!sli2.tables[that._delete_table]) {
        _reject(ERROR.table_not_exist(that._delete_table));
        return;
      }

      if(that._where) {
        sli2.tables[that._delete_table].removeForQuery(
          that._where,
          function(num) {
            _func(num, _exec_fulfill, _reject);
          }, _reject
        );

      } else {
        sli2.tables[that._delete_table].removeAll(
          function(num) {
            _func(num, _exec_fulfill, _reject);
          }, _reject
        );
      }

    // ##############################
    // *** Update Query ***
    // ##############################
    } else if(that.isUpdateQuery()) {
      if(!sli2.tables[that._update_table]) {
        _reject(ERROR.table_not_exist(that._update_table));
        return;
      }

      if(that._where) {
        sli2.tables[that._update_table].updateForQuery(
          that._where,
          that._update_data,
          function(num) {
            _func(num, _exec_fulfill, _reject);
          }, _reject
        );

      } else {
        sli2.tables[that._update_table].updateAll(
          that._update_data,
          function(num) {
            _func(num, _exec_fulfill, _reject);
          }, _reject
        );
      }


    // ##############################
    // *** Select Query ***
    // ##############################
    } else if(that.isSelectQuery()) {
      _reject = _exec_reject("select");

      // TODO:
      var table_names = [],
          splited_where = {},
          extract_where = null,
          join_alias_where = null,
          join_no_alias_where = null,
          key = "";

      // *** split where clause ***
      if(this._where) {
        table_names = this.getTableNames();
        splited_where = this._where.splitByKeyPrefixes(table_names);

        if(splited_where) {
          if(splited_where[this._select_table] && splited_where[this._table_alias]) {
            _reject(ERROR.kriteria_prefix_conflict(this._select_table, this._table_alias));
          }

          var tmp_cri = new Kriteria(),
              merge_count = 0;

          if(splited_where[that._select_table] || splited_where[that._table_alias]) {
            extract_where = splited_where[that._select_table] || splited_where[that._table_alias];

            for(key in splited_where) {
              if(splited_where[key] && key !== that._select_table && key !== that._table_alias) {
                if(key === "else") {
                  join_no_alias_where = splited_where[key];
                } else {
                  // other alias data
                  merge_count = merge_count + 1;
                  tmp_cri = tmp_cri.merge(splited_where[key]);
                }
              }
            }

            if(merge_count > 0) {
              join_alias_where = tmp_cri;
            }

          } else {
            extract_where = splited_where.else;

            for(key in splited_where) {
              if(splited_where[key]) {
                if(key === "else") {
                  join_no_alias_where = splited_where[key];
                } else {
                  // other alias data
                  merge_count = merge_count + 1;
                  tmp_cri = tmp_cri.merge(splited_where[key]);
                }
              }
            }

            if(merge_count > 0) {
              join_alias_where = tmp_cri;
            }
          }

        } else {
          join_no_alias_where = this._where;
        }

      }

      // **** select ****
      new Promise(function(fulfill1, reject1) {
        if(that._select_table) {
          if(!sli2.tables[that._select_table]) {
            _reject(ERROR.table_not_exist(that._select_table));
            return;
          }

          // **** get data ****

          if(splited_where[that._select_table]) {
            // select ... from table where ...
            sli2.tables[that._select_table].selectForQuery(
              extract_where,//.removePrefixes([that._select_table || that._table_alias]),
              splited_where[that._select_table] ? that._select_table : that._tablea_alias,
              that._table_alias || (that._joins.length > 0 ? that._select_table : ""),
              function(rows) {
                _exec_fulfill();
                fulfill1(rows);
              }, reject1
            );

          } else {
            // select ... from table
            sli2.tables[that._select_table].selectAll(
              that._joins.length > 0 ? that._table_alias || that._select_table : that._table_alias,
              function(rows) {
                _exec_fulfill();
                fulfill1(rows);
              }, reject1
            );
          }

        } else if(that._select_input_query) {
          // select .. from (select ... from ...)
          that._select_input_query.run(function(rows, fulfill2/*, reject2*/) {
            var ret = [];

            if(that._table_alias) {
              for(i = 0, l = rows.length; i < l; i = i + 1) {
                ret[i] = {};
                ret[i][that._table_alias] = rows[i];
              }

            } else {
              ret = rows;
            }

            _exec_fulfill();
            fulfill1(ret);
            fulfill2();
          });

        } else if(that._select_input_array) {
          // select ... from object[]
          var selected_array = [];

          if(extract_where) {
            var set_function = null;
            if(that._joins.length === 0) {
              if(splited_where[that._table_alias] && splited_where.else) {
                set_function = setFunction.setWithNoJoinAndAliasWhere;
              } else if(splited_where[that._table_alias] && !splited_where.else) {
                set_function = setFunction.setWithNoJoinAndAliasWhere;
              } else if(!splited_where[that._table_alias] && splited_where.else) {
                set_function = setFunction.setWithNoJoinAndNoAliasWhere;
              }
            } else {
              if(splited_where[that._table_alias] && splited_where.else) {
                set_function = setFunction.setWithHasJoinAndAliasWhere;
              } else if(splited_where[that._table_alias] && !splited_where.else) {
                set_function = setFunction.setWithHasJoinAndAliasWhere;
              } else if(!splited_where[that._table_alias] && splited_where.else) {
                set_function = setFunction.setWithHasJoinAndNoAliasWhere;
              }
            }

            if(set_function === null) {
              selected_array = that._select_input_array;
            } else {
              for(i = 0, l = that._select_input_array.length; i < l; i = i + 1) {
                set_function(that._select_input_array[i], selected_array, extract_where, that._table_alias);
              }
            }

          } else {
            if(that._joins.length === 0) {
              selected_array = that._select_input_array;

            } else {
              for(i = 0, l = that._select_input_array.length; i < l; i = i + 1) {
                var data = {};
                data[that._table_alias] = that._select_input_array[i];

                selected_array[selected_array.length] = data;
              }
            }
          }

          _exec_fulfill();
          fulfill1(selected_array);

        } else {
          reject1(ERROR.invalid_description("select"));
        }

      })
      .then(function(rows1) {
        // **** join ****

        return new Promise(function(fulfill2, reject2) {
          var joined_rows = [];

          if(that._joins.length === 0) {
            fulfill2(rows1);

          } else {
            var loop_rows = rows1,
                join_num = 0;

            async.eachSeries(that._joins, function(join, next) {
              var querable = join[0],
                  cri = join[1],
                  join_obj = join[2],
                  join_table_alias = join[3],
                  join_type = join[4],
                  join_data = {},
                  match_count = 0,
                  main_loop = [],
                  sub_loop = [],
                  left_table = "",
                  right_table = "",
                  keys = [];

              joined_rows = [];
              join_num = join_num + 1;

              new Promise(function(fulfill3, reject3) {
                if(querable && querable.isSelectQuery) {
                  querable.run(function(rows2, fulfill4) {
                    fulfill4();
                    fulfill3([rows2, join_table_alias || ""]);
                  });
                } else if(join_obj) {
                  fulfill3([join_obj, join_table_alias ]);
                } else {
                  reject3(ERROR.reqire_select_query);
                }
              })
              .then(function(args) {
                var rows2 = args[0],
                    right_table_name = args[1];

                if(join_type === "inner") {
                  for(i = 0, l = loop_rows.length; i < l; i = i + 1) {
                    for(j = 0, l2 = rows2.length; j < l2; j = j + 1) {
                      join_data = clone(loop_rows[i]);
                      if(right_table_name) {
                        join_data[right_table_name] = rows2[j];
                      } else {
                        keys = Object.keys(rows2[1]);
                        for(k = 0, l3 = keys.length; k < l3; k = k + 1) {
                          key = keys[k];
                          join_data[key] = rows2[j][key];
                        }
                      }

                      if(!cri || cri.match(join_data)) {
                        joined_rows[joined_rows.length] = clone(join_data);
                      }
                    }
                  }

                  loop_rows = joined_rows; // memo: need clone?

                } else if(join_type === "left" || join_type === "right") {
                  if(join_type === "left") {
                    main_loop = loop_rows; // memo: need clone?
                    sub_loop = rows2;
                    left_table = "";
                    right_table = right_table_name;
                  } else { // join_type === "right"
                    main_loop = rows2;
                    sub_loop = loop_rows; // memo: need clone?
                    left_table = right_table_name;
                    right_table = "";
                  }

                  for(i = 0, l = main_loop.length; i < l; i = i + 1) {
                    match_count = 0;

                    for(j = 0, l2 = sub_loop.length; j < l2; j = j + 1) {
                      join_data = {};
                      if(left_table) {
                        join_data[left_table] = clone(main_loop[i]);
                      } else {
                        join_data = clone(main_loop[i]);
                      }
                      if(right_table) {
                        join_data[right_table] = clone(sub_loop[j]);
                      } else {
                        keys = Object.keys(sub_loop[j]);
                        for(k = 0, l3 = keys.length; k < l3; k = k + 1) {
                          key = keys[k];
                          join_data[key] = sub_loop[j][key];
                        }
                      }

                      if(!cri || cri.match(join_data)) {
                        joined_rows[joined_rows.length] = clone(join_data);
                        match_count = match_count + 1;
                      }
                    }

                    if(match_count === 0) {
                      join_data = {};
                      if(left_table) {
                        join_data[left_table] = main_loop[i];
                      } else {
                        join_data = main_loop[i];
                      }
                      joined_rows[joined_rows.length] = clone(join_data);
                    }
                  }

                  loop_rows = joined_rows; // memo: need clone?
                  main_loop = [];
                  sub_loop = [];
                }

                next();
              })
              .catch(function(e) {
                reject2(e);
              });

            }, function() {
              loop_rows = [];
              fulfill2(joined_rows);
            });
          }

        })
        .then(function(rows) {
          // 'where' have conditions of sub-queires prefix.

          var ret = [];

          if(join_alias_where) {
            for(i = 0, l = rows.length; i < l; i = i + 1) {
              if(join_alias_where.match(rows[i])) {
                ret[ret.length] = rows[i];
              }
            }

            return ret;

          } else {
            return rows;
          }
        })
        .then(function(rows) {
          // **** group by ****

          var agg = SelectionAggregator.createAggregationOperator(that._groupings);

          if(that._selection) {
            for(i = 0, l = rows.length; i < l; i = i + 1) {
              that._selection(agg, rows[i]);
              agg.aggregate();
            }

            return agg.getResult();

          } else if(that._groupings.length > 0) {
            var all_selection = function($, _) {
              for(key in _) {
                $(_[key]).as(key);
              }
            };

            for(i = 0, l = rows.length; i < l; i = i + 1) {
              all_selection(agg, rows[i]);
              agg.aggregate();
            }

            return agg.getResult();

          } else {
            return rows;
          }

        })
        .then(function(rows) {
          // 'where' have conditions of no prefix.
          // ex. described conditions of sub-queries with alias

          var ret = [];

          if(join_no_alias_where) {
            for(i = 0, l = rows.length; i < l; i = i + 1) {
              if(join_no_alias_where.match(rows[i])) {
                ret[ret.length] = rows[i];
              }
            }

            return ret;

          } else {
            return rows;
          }
        })
        .then(function(rows) {
          // **** having ****

          var ret = [];

          if(that._having) {
            for(i = 0, l = rows.length; i < l; i = i + 1) {
              if(that._having.match(rows[i])) {
                ret[ret.length] = rows[i];
              }
            }
          } else {
            ret = rows;
          }

          return ret;

        })
        .then(function(rows) {
          // TODO: use intro-select

          // **** order by ****
          if(that._orderings.length > 0) {
            rows = arraySortWithObjectElement(rows, that._orderings);
          }

          // **** limit offset ****
          if(that._limit_num > 0) {
            var tmp_rows = [];

            for(i = 0 + that._offset_num, l = that._limit_num + that._offset_num; i < l; i = i + 1) {
              if(l > rows.length) {
                break;
              }
              tmp_rows[tmp_rows.length] = rows[i];
            }
            rows = tmp_rows;
            tmp_rows = [];
          }

          return rows;

        })
        .then(function(rows) {
          // **** union or union_all ****
          return new Promise(function(fulfill1, reject1) {
            if(that._union_queries.length > 0) {
              async.eachSeries(that._union_queries, function(union_query, next) {
                union_query.run(function(rows2) {
                  union_rows = arrayUniqueMerge(union_rows, rows2);

                  next();
                })
                .catch(function(err) {
                  reject1(err);
                });

              }, function() {
                union_rows = arrayUniqueMerge(union_rows, rows);

                fulfill1(union_rows);
              });

            } else if(that._union_all_queries.length > 0) {
              async.eachSeries(that._union_all_queries, function(union_query, next) {
                union_query.run(function(rows2) {
                  for(i = 0, l = rows2.length; i < l; i = i + 1) {
                    union_rows[union_rows.length] = rows2[i];
                  }

                  next();
                })
                .catch(function(err) {
                  reject1(err);
                });

              }, function() {
                for(i = 0, l = rows.length; i < l; i = i + 1) {
                  union_rows[union_rows.length] = rows[i];
                }

                fulfill1(union_rows);
              });

            } else {
              fulfill1(rows);
            }
          });

        })
        .then(function(rows) {
          _func(rows, function() {}, _exec_reject("select - run process"));
        })
        .catch(_exec_reject("select - promise"));
      })
      .catch(function(err) {
        _reject(err);
      });
    }
  };


  cxt.Dml = Dml;

})(this);
