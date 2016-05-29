(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* SLI2.js */

(function(cxt, global) {
  "use strict";

  var idbInit = require("./lib/idbInit.js").idbInit,
      Dml = require("./lib/Dml.js").Dml,
      Ddl = require("./lib/Ddl.js").Ddl,
      DatabaseDefinition = require("./lib/DatabaseDefinition.js").DatabaseDefinition,
      Table = require("./lib/Table.js").Table,
      Tasker = require("./lib/Tasker.js").Tasker,
      ERROR = require("./param/Error.js").ERROR;

  /**
  * @public
  * @class
  * @param {String} name - database name
  * @param {Object} opt - option
  *   opt.mode {String} -
  */
  var SLI2 = function SLI2(name, opt) {
    this._name = name;
    this.db = null;
    this.transaction = null;
    this._version = 0;
    this._upgrade_enable = true;
    this._mode = "";
    this._use_idb = false;
    this._opened = false;
    this._closed = false;
    this._upgrading = false;
    this._transacting = false;
    this.tables = {};
    this._idb_objects = null;
    this._tasker = new Tasker();

    this._tasker.auto_run = true;

    if(opt) {
      if(opt.mode) {
        this.setMode(opt.mode);
      }
    } else {
      this.useIndexedDB();
    }
  };

  /** constants */
  SLI2.USE_IDB = "idb";
  SLI2.NO_IDB = "no_idb";
  SLI2.READ_WRITE = "readwrite";
  SLI2.READ_ONLY = "readonly";
  SLI2.DEFAULT_UPGRADING_HANDLER = "sli2_upgrade";
  SLI2.DEFAULT_TRANSACTION_HANDLER = "sli2_transaction";

  /**
  * @public
  * @function
  * @returns {void}
  */
  SLI2.prototype.useIndexedDB = function useIndexedDB() {
    this._idb_objects = idbInit();

    if(this._idb_objects === null) {
      throw ERROR.idb_objects_not_exists;

    } else {
      if(this._mode === SLI2.NO_IDB) {
        this._opened = false;
      }
      this._mode = SLI2.USE_IDB;
      this._use_idb = true;
    }
  };

  /**
  * @public
  * @function
  * @param {String} mode -
  *   "idb" is available indexedDB
  *   "no_idb" is not available indexedDB(usable select method only)
  * @returns {void}
  */
  SLI2.prototype.setMode = function setMode(mode) {
    if(mode === SLI2.USE_IDB) {
      this.useIndexedDB();

    } else if(mode === SLI2.NO_IDB) {
      this._mode = SLI2.NO_IDB;
      this._idb_objects = null;
      this._use_idb = false;
      this._opened = true;
      this._closed = false;
    }
  };

  /**
  * @public
  * @static
  * @function
  * @returns {DatabaseDefinition}
  */
  SLI2.createDatabaseDefinition = function createDatabaseDefinition() {
    return new DatabaseDefinition();
  };

  /**
  * @public
  * @funciton
  * @param {String} name - database name
  * @param {Function} block_proc - request blocking process
  * @returns {Promise}
  */
  SLI2.prototype.deleteDatabase = function deleteDatabase(name, block_proc) {
    var that = this;

    return new Promise(function(fulfill, reject) {
      if(that._mode === SLI2.NO_IDB) {
        reject(ERROR.mode_is_no_idb);
        return;

      } else if(!that._use_idb) {
        reject(ERROR.idb_objects_not_used);
        return;

      } else {
        var req = that._idb_objects.indexedDB.deleteDatabase(name || that._name);
        req.onsuccess = function() {
          fulfill();
        };
        req.onerror = function() {
          reject();
        };
        req.onblocked = typeof block_proc === "function" ? block_proc : function() {
          console.log("deletedatabase blocking");
        };
      }
    });
  };

  /**
  * @private
  * @function
  * @returns {void}
  */
  SLI2.prototype._initTables = function _initTables() {
    var db = this.db;

    for(var i = 0, l = db.objectStoreNames.length; i < l; i = i + 1) {
      var table_name = db.objectStoreNames[i],
          table = new Table(table_name, null, this);

      this.tables[table_name] = table;
    }
  };

  /**
  * @private
  * @function
  * @returns {void}
  */
  SLI2.prototype._openTables = function _openTables(tra, handling, tables) {
    var _tables = tables || this.tables;

    for(var table_name in _tables) {
      this.tables[table_name].open(tra, handling);
    }
  };

  /**
  * @private
  * @function
  * @returns {void}
  */
  SLI2.prototype._closeTables = function _closeTables(handling, tables) {
    var _tables = tables || this.tables;

    for(var table_name in _tables) {
      this.tables[table_name].close(handling);
    }
  };

  /**
  * @private
  * @function
  * @return {void}
  */
  SLI2.prototype._destroyTables = function _destroyTables() {
    for(var table_name in this.tables) {
      this.tables[table_name].destroy();
    }
  };

  /**
  * @private
  * @funciton
  * @param {IDBDatabase} db -
  * @returns {void}
  */
  SLI2.prototype._initInOpen = function _initInOpen(db) {
    this.db = db;
    if(this._version === 0) {
      this._version = db.version;
    }
    this._opened = true;
    this._closed = false;
  };

  /**
  * @public
  * @function
  * @returns {Boolean}
  */
  SLI2.prototype.isUpgrading = function isUpgrading() {
    return this._upgrading;
  };

  /**
  * @public
  * @funciton
  * @returns {Boolean}
  */
  SLI2.prototype.isTransacting = function isTransacting() {
    return this._transacting;
  };

  /**
  * @public
  * @function
  * @param {DatabaseDefinition} db_def
  * @returns {Promise}
  */
  SLI2.prototype.open = function open(db_def) {
    var that = this,
        req = null,
        version_map = [],
        seq = [],
        map = {},
        i = 0, l = 0;

    return new Promise(function(fulfill, reject) {
      var error = null;

      if(that._mode === SLI2.NO_IDB) {
        reject(ERROR.mode_is_no_idb);
        return;

      } else if(that._opened) {
        reject(ERROR.already_open);
        return;

      } else if(!that._use_idb) {
        reject(ERROR.idb_objects_not_used);
        return;
      }

      // Managed by DatabaseDefinition
      if(db_def instanceof DatabaseDefinition) {
        new Promise(function(fulfill2, reject2) {
          version_map = db_def.getVersionMapStartWithVersion(1);

          if(that.db) {
            that.db.close();
          }
          if(!version_map) {
            reject2(ERROR.no_version_map(1));
            return;

          } else {
            // open current version
            seq = version_map.seq;
            map = version_map.map;

            req = that._idb_objects.indexedDB.open(that._name);

            req.onupgradeneeded = function(e) {
              // current version is '0'
              that._initInOpen(e.target.result);
              that.transaction = this.transaction;
              that._upgrading = true;
              that._initTables();
              that._openTables(this.transaction, "version_change");

//              this.transaction.onabort = function onabort() {
//                console.log("Upgrade transaction abort");
//              };
//              this.transaction.oncomplete = function oncomplete() {
//                console.log("Upgrade transaction complete");
//              };
//              this.transaction.onerror = function onerror() {
//                console.log("Upgrade transaction error");
//              };

              that._tasker.auto_run = false;

              for(i = 0, l = seq.length; !error && i < l; i = i + 1) {
                var definition = map[seq[i]];

                if(typeof definition === "function") {
                  definition(that);
                } else {
                  error = ERROR.no_definition(seq[i]);
                }
              }
              that._tasker.addTask(null, function(done) {
                that._version = seq[i - 1];
                that.transaction = null;
                that._upgrading = false;
                that.db = null;
                that._tasker.auto_run = true;

                done();
              })
              .runQueue();

            };
            req.onsuccess = function(e) {
              // current version is not '0'
              that._initInOpen(e.target.result);

              if(!error) {
                that._destroyTables();
                that._initTables();

                fulfill2();

              } else {
                reject2(error);
              }
            };
            req.onerror = function(e) {
              reject2(e.target.error);
            };
          }
        })
        .then(function() {
          return new Promise(function(fulfill2, reject2) {
            that.db.close();

            if(db_def.isLatestVersion(that._version)) {
              // start with version '0' or no upgrade

              req = that._idb_objects.indexedDB.open(that._name, that._version);

              req.onsuccess = function(e) {
                that._initInOpen(e.target.result);

                fulfill2();
              };
              req.onerror = function(e) {
                reject2(e.target.error);
              };

            } else {
              // current version is not '0' and need a upgrade
              version_map = db_def.getVersionMapStartWithVersion(that._version + 1);
              var latest_version = db_def.getLatestVersionForVersion(that._version);

              if(!version_map) {
                error = ERROR.no_version_map(that._version);

              } else {
                seq = version_map.seq;
                map = version_map.map;

                req = that._idb_objects.indexedDB.open(that._name, latest_version);

                req.onupgradeneeded = function(e) {
                  that._initInOpen(e.target.result);
                  that.transaction = this.transaction;
                  that._upgrading = true;
                  that._initTables();
                  that._openTables(this.transaction, "version_change");

                  that._tasker.auto_run = false;

                  for(i = 0, l = seq.length; !error && i < l; i = i + 1) {
                    var definition = map[seq[i]];

                    if(typeof definition === "function") {
                      definition(that);
                    } else {
                      error = ERROR.no_definition(seq[i]);
                    }
                  }
                  that._tasker.addTask(null, function(done) {
                    that._version = seq[i - 1];
                    that.transaction = null;
                    that._upgrading = false;
                    that.db = null;
                    that._tasker.auto_run = true;

                    done();
                  })
                  .runQueue();

                };
                req.onsuccess = function(e) {
                  that._initInOpen(e.target.result);

                  if(!error) {
                    that._destroyTables();
                    that._initTables();
                    fulfill2();

                  } else {
                    reject2(error);
                  }
                };
                req.onerror = function(e) {
                  reject2(e.target.error);
                };
              }
            }
          });
        })
        .then(function() {
          that._upgrade_enable = false;
          fulfill(that.db);
        })
        .catch(function(e) {
          reject(e);
        });

      } else {
        // no DatabaseDefinition
        that._upgrade_enable = true;

        if(that.db) {
          that.db.close();
        }

        req = that._idb_objects.indexedDB.open(that._name);

        req.onsuccess = function(e) {
          that._initInOpen(e.target.result);
          that._initTables();

          fulfill(that.db);
        };
        req.onerror = function(e) {
          reject(e.target.error);
        };
      }
    });
  };

  /**
  * @public
  * @function
  * @retuns {Promise}
  */
  SLI2.prototype.close = function close() {
    var that = this;

    return new Promise(function(fulfill) {
      that._tasker.addTask(null, function(done) {
        if(that.db) {
          that.db.close();
        }

        that._name = null;
        that.db = null;
        that.transaction = null;
        that._version = 0;
        that._upgrade_enable = true;
        that._mode = null;
        that._upgrading = false;
        that._transacting = false;
        that._opened = false;
        that._closed = true;
        that._tasker.terminate();

        that._destroyTables();

        that.tables = {};

        fulfill();
        done();
      });
    });
  };

  /**
  * @public
  * @function
  * @returns {Promise}
  */
  SLI2.prototype.destroy = function destroy() {
    var that = this;

    return this.close()
    .then(function() {
      that._use_idb = false;
      that._idb_objects = null;
      that.tables = null;
    });
  };

  /**
  * @public
  * @function
  * @returns {Number}
  */
  SLI2.prototype.getCurrentVersion = function getCurrentVersion() {
    return this._version;
  };

  /**
  * @public
  * @function
  * @returns {Number}
  */
  SLI2.prototype.getNewVersion = function getNewVersion() {
    if(this._mode === SLI2.NO_IDB) {
      throw ERROR.mode_is_no_idb;

    } else if(!this._opened) {
      throw ERROR.not_open;

    } else if(this._closed) {
      throw ERROR.closed;
    }

    this._version = this._version + 1;

    return this._version;
  };

  /**
  * @public
  * @function
  * @param {Mixed(String|String[])} tables - table names
  * @param {Stirng} type - readonly, readwrite, upgrade
  * @param {Function} func - transaction process
  * @returns {Promise}
  */
  SLI2.prototype.begin_transaction =
  SLI2.prototype.beginTransaction = function beginTransaction(table_names, type, func) {
    var that = this;

    return new Promise(function(fulfill, reject) {
      var _table_names = [],
          _tables = {},
          i = 0, l = 0;

      var destroy = function() {
        that.transaction = null;
        that._transacting = false;

        try {
          that._closeTables("sli2_transaction", _tables);

        } catch(err) {
          reject(err);
        }
      };

      if(Array.isArray(table_names)) {
        _table_names = table_names;
      } else {
        _table_names[0] = table_names;
      }

      if(that._mode === SLI2.NO_IDB) {
        reject(ERROR.mode_is_no_idb);

      } else if(!that._opened) {
        reject(ERROR.not_open);

      } else if(that._closed) {
        reject(ERROR.closed);

      } else if(!that._transacting) {
        that._transacting = true;

        // check table exist
        for(i = 0, l = _table_names.length; i < l; i = i + 1) {
          var table_name = _table_names[i];

          if(!that.tables[table_name]) {
            reject(ERROR.table_not_exist(table_name));
            return;
          } else {
            _tables[table_name] = that.tables[table_name];
          }
        }

        // get transaction
        var tra = that.db.transaction(_table_names, type);

        // set transaction
        tra.oncomplete = function() {
          destroy();
          fulfill();
        };
        tra.onabort = function() {
          that._tasker.terminate();
          destroy();
          reject(ERROR.transaction_abort("transaction"));
        };
        that.transaction = tra;

        try {
          that._openTables(tra, "sli2_transaction", _tables);

        } catch(err) {
          reject(err);
        }
      }

      if(typeof func === "function") {
        try {
          that._tasker.auto_run = false;

          func();

          that._tasker.addTask(null, function() {
            that._tasker.auto_run = true;
          })
          .runQueue();

        } catch(e) {
          that.rollback();
          destroy();
          reject(e);
        }
      }

    });
  };

  /**
  * @public
  * @function
  * @param {Function} exec - upgrade process
  * @param {Function} end - callback to process end
  * @returns {Promise}
  */
  SLI2.prototype.upgrade = function upgrade(exec, end) {
    var that = this;

    return new Promise(function(fulfill, reject) {
      var _exec = typeof exec === "function" ? exec : function() {},
          _end = typeof end === "function" ? end : function() {};

      if(that._mode === SLI2.NO_IDB) {
        reject(ERROR.mode_is_no_idb);

      } else if(!that._upgrade_enable) {
        reject(ERROR.update_unable);

      } else if(!that._opened) {
        reject(ERROR.not_open);

      } else if(that._closed) {
        reject(ERROR.closed);

      } else if(!that._upgrading) {
        that._upgrading = true;

        that.db.close();

        var req = that._idb_objects.indexedDB.open(that._name, that.getNewVersion());

        req.onupgradeneeded = function(e) {
          var db = e.target.result,
              tra = this.transaction;

          tra.onabort = function() {
            reject(ERROR.transaction_abort("upgrade"));
          };
          that.db = db;
          that.transaction = tra;
          that._openTables(tra, "sli2_upgrade");

          try {
            that._tasker.auto_run = false;

            _exec(db, tra);

            that._tasker.addTask(null, function() {
              that._tasker.auto_run = true;
            })
            .runQueue();
          } catch(e) {
            reject(e);
          }
        };
        req.onsuccess = function(e) {
          that._upgrading = false;
          if(that._upgrading === false) {
            that.db = e.target.result;
          }
          that.transaction = null;
          that._closeTables("sli2_upgrade");

          _end();
          fulfill();
        };
        req.onerror = function(e) {
          reject(ERROR.upgrade_error(e.target.error));
        };

      } else {
        try {
          _exec(that.db, that.transaction);
          _end();
          fulfill();
        } catch(e) {
          reject(e);
        }
      }

    });
  };

  /**
  * @public
  * @function
  * @params {Object} obj - object having the 'exec' method
  * @params {Function} func - callback function
  * @returns {void}
  */
  SLI2.prototype.addTask = function addTask(obj, func) {
    if(this._closed) {
      throw ERROR.closed;
    }

    return this._tasker.addTask(obj, func);
  };

  /**
  * @public
  * @function
  * @returns {void}
  * @description
  *   run process from task queue
  */
  SLI2.prototype.runQueue = function runQueue() {
    if(this._closed) {
      throw ERROR.closed;
    }

    return this._tasker.runQueue();
  };

  /**
  * @public
  * @funciton
  * @param {Stirng} name -
  * @param {Object} opt -
  * @retuns {Ddl}
  */
  SLI2.prototype.create_table =
  SLI2.prototype.createTable = function createTable(name, opt) {
    var _opt = opt ? opt : { autoIncrement: true };

    if(this._mode === SLI2.NO_IDB) {
      throw ERROR.mode_is_no_idb;

    } else if(!this._upgrade_enable) {
      throw ERROR.update_unable;

    } else if(!this._opened) {
      throw ERROR.not_open;

    } else if(this._closed) {
      throw ERROR.closed;

    }

    var ddl = new Ddl(this);

    return ddl.createTable(name, _opt);
  };

  /**
  * @public
  * @funciton
  * @param {String} name -
  * @returns {Ddl}
  */
  SLI2.prototype.drop_table =
  SLI2.prototype.dropTable = function dropTable(name) {
    if(this._mode === SLI2.NO_IDB) {
      throw ERROR.mode_is_no_idb;

    } else if(!this._upgrade_enable) {
      throw ERROR.update_unable;

    } else if(!this._opened) {
      throw ERROR.not_open;

    } else if(this._closed) {
      throw ERROR.closed;
    }

    var ddl = new Ddl(this);

    return ddl.dropTable(name);
  };

  /**
  * @public
  * @funciton
  * @param {String} table_name - target table name
  * @param {String} idx_name - target index name
  * @param {Object} opt - createIndex option
  * @returns {Ddl}
  */
  SLI2.prototype.create_index =
  SLI2.prototype.createIndex = function createIndex(table_name, idx_name, opt) {
    if(this._mode === SLI2.NO_IDB) {
      throw ERROR.mode_is_no_idb;

    } else if(!this._upgrade_enable) {
      throw ERROR.update_unable;

    } else if(!this._opened) {
      throw ERROR.not_open;

    } else if(this._closed) {
      throw ERROR.closed;

    } else if(!opt) {
      throw ERROR.no_option("createIndex");
    }

    var ddl = new Ddl(this);

    return ddl.createIndex(table_name, idx_name, opt);
  };

  /**
  * @public
  * @funciton
  * @param {String} table_name - target table name
  * @param {String} idx_name - target index name
  * @returns {Promise}
  */
  SLI2.prototype.drop_index =
  SLI2.prototype.dropIndex = function dropIndex(table_name, idx_name) {
    if(this._mode === SLI2.NO_IDB) {
      throw ERROR.mode_is_no_idb;

    } else if(!this._opened) {
      throw ERROR.not_open;

    } else if(!this._upgrade_enable) {
      throw ERROR.update_unable;

    } else if(this._closed) {
      throw ERROR.closed;
    }

    var ddl = new Ddl(this);

    return ddl.dropIndex(table_name, idx_name);
  };

  /**
  * @public
  * @function
  * @param {Function} selection
  * @returns {Dml}
  */
  SLI2.prototype.select = function select(selection) {
    if(!this._opened) {
      throw ERROR.not_open;

    } else if(this._closed) {
      throw ERROR.closed;
    }

    var dml = new Dml(this);

    return dml.select(selection);
  };

  /**
  * @public
  * @function
  * @param {String} table - insert target table
  * @param {Array} columns - insert target columns
  * @returns {Dml}
  */
  SLI2.prototype.insert_into =
  SLI2.prototype.insertInto = function insert_into(table, columns) {
    if(this._mode === SLI2.NO_IDB) {
      throw ERROR.mode_is_no_idb;

    } else if(!this._opened) {
      throw ERROR.not_open;

    } else if(this._closed) {
      throw ERROR.closed;
    }

    var dml = new Dml(this);

    return dml.insert_into(table, columns);
  };

  /**
  * @public
  * @function
  * @param {String} table - delete target table
  * @returns {Dml}
  */
  SLI2.prototype.delete_from =
  SLI2.prototype.deleteFrom = function delete_from(table) {
    if(this._mode === SLI2.NO_IDB) {
      throw ERROR.mode_is_no_idb;

    } else if(!this._opened) {
      throw ERROR.not_open;

    } else if(this._closed) {
      throw ERROR.closed;
    }

    var dml = new Dml(this);

    return dml.delete_from(table);
  };

  /**
  * @public
  * @function
  * @param {String} table - update target table
  * @returns {Dml}
  */
  SLI2.prototype.update = function update(table) {
    if(this._mode === SLI2.NO_IDB) {
      throw ERROR.mode_is_no_idb;

    } else if(!this._opened) {
      throw ERROR.not_open;

    } else if(this._closed) {
      throw ERROR.closed;
    }

    var dml = new Dml(this);

    return dml.update(table);
  };

  /**
  * @public
  * @function
  * @returns {void}
  */
  SLI2.prototype.rollback = function rollback() {
    if(this._mode === SLI2.NO_IDB) {
      throw ERROR.mode_is_no_idb;

    } else if(!this._opened) {
      throw ERROR.not_open;

    } else if(this._closed) {
      throw ERROR.closed;
    }

    if(this.transaction) {
      this.transaction.abort();
      this._tasker.terminate();
      this._tasker.auto_run = true;
    } else {
      throw ERROR.no_transaction;
    }
  };


  cxt.SLI2 = SLI2;
  global.SLI2 = SLI2;

}(this, (0, eval)("this").window || this));

},{"./lib/DatabaseDefinition.js":2,"./lib/Ddl.js":3,"./lib/Dml.js":4,"./lib/Table.js":9,"./lib/Tasker.js":10,"./lib/idbInit.js":14,"./param/Error.js":16}],2:[function(require,module,exports){
/* DatabaseDefinition */

(function(cxt) {
  "use strict";

  var ERROR = require("../param/Error.js").ERROR;

  /**
  * @public
  * @class
  */
  var DatabaseDefinition = function DatabaseDefinition() {
    this._version_maps = [];
    this._version_procs = {};
  };

  /**
  * @public
  * @function
  * @param {Number} version -
  * @param {Function} proc -
  * @returns {void}
  */
  DatabaseDefinition.prototype.setVersion = function setVersion(version, proc) {
    var _version = +version;

    if(Number.isNaN(_version) || _version <= 0) {
      throw ERROR.invalid_version_number(version);
    }
    if(typeof proc !== "function") {
      throw ERROR.is_not_function("arguments[2]:proc");
    }

    this._version_procs[_version] = proc;
  };

  /**
  * @public
  * @function
  * @param {any[]} -
  * @returns {void}
  */
  DatabaseDefinition.prototype.defineVersionMap = function defineVersionMap() {
    this._version_maps = [];

    for(var i = 0, l = arguments.length; i < l; i = i + 1) {
      if(!Array.isArray(arguments[i])) {
        throw ERROR.is_not_array("arguments[" + i + "] of defineVersionMap");
      }

      for(var j = 0, l2 = arguments[i].length; j < l2; j = j + 1) {
        var version = arguments[i][j],
            _version = +version;

        if(Number.isNaN(_version) || _version <= 0) {
          throw ERROR.invalid_version_number(version);
        }

        this._version_maps[this._version_maps.length] = arguments[i];
      }
    }
  };

  /**
  * @public
  * @function
  * @param {Number} n -
  * @returns {Boolean}
  */
  DatabaseDefinition.prototype.isLatestVersion = function isLatestVersion(n) {
    var _version_maps = this._version_maps;

    if(_version_maps.length > 0) {
      // has version map
      for(var i = 0, l = _version_maps.length; i < l; i = i + 1) {
        var _version_map = _version_maps[i];

        if(_version_map[_version_map.length - 1] === n) {
          return true;
        }
      }

      return false;

    } else {
      // no version map
      return this.getLatestVersionOfDefinition() === n ? true : false;
    }
  };

  /**
  * @public
  * @function
  * @param {Number} n -
  * @return {Object}
  */
  DatabaseDefinition.prototype.getVersionMapStartWithVersion = function getVersionMapStartWithVersion(n) {
    var _version_maps = this._version_maps,
        ret = { seq: [], map: {} };

    if(_version_maps.length > 0) {
      // has version map
      for(var i = 0, l = _version_maps.length; i < l; i = i + 1) {
        var _version_map = _version_maps[i],
            index = _version_map.indexOf(n);

        if(!!~index) {
          for(var j = index, l2 = _version_map.length; j < l2; j = j + 1) {
            var map_index = _version_map[j];

            ret.map[map_index] = this._version_procs[map_index];
            ret.seq[ret.seq.length] = map_index;
          }

          ret.seq.sort();

          return ret;
        }
      }

      return null;

    } else {
      // no version map
      for(var k in this._version_procs) {
        var _k = +k;

        if(n <= _k) {
          ret.map[k] = this._version_procs[k];
          ret.seq[ret.seq.length] = _k;
        }
      }

      ret.seq.sort();

      return ret;
    }
  };

  /**
  * @public
  * @function
  * @returns {Number}
  */
  DatabaseDefinition.prototype.getLatestVersionOfDefinition = function getLatestVersionOfDefinition() {
    var latest_version = 0;

    for(var k in this._version_procs) {
      var _k = +k;

      if(latest_version < _k) {
        latest_version = _k;
      }
    }

    return latest_version;
  };

  /**
  * @public
  * @function
  * @param {Number} n -
  * @returns {Number}
  */
  DatabaseDefinition.prototype.getLatestVersionForVersion = function getLatestVersionForVersion(n) {
    var _version_maps = this._version_maps;

    if(_version_maps.length > 0) {
      // has version map
      for(var i = 0, l = _version_maps.length; i < l; i = i + 1) {
        var _version_map = _version_maps[i];

        if(!!~_version_map.indexOf(n)) {
          return _version_map[_version_map.length - 1];
        }
      }

      return null;

    } else {
      // no version map
      return this.existVersionInDefinition(n) || n === 1 ? this.getLatestVersionOfDefinition() : null;
    }

  };

  /**
  * @public
  * @function
  * @param {Number} n -
  * @returns {Boolean}
  */
  DatabaseDefinition.prototype.existVersionInDefinition = function existVersionInDefinition(n) {
    var ret = false,
        _n = +n;

    for(var k in this._version_procs) {
      if(+k === _n) {
        ret = true;
        break;
      }
    }

    return ret;
  };

  cxt.DatabaseDefinition = DatabaseDefinition;

}(this));

},{"../param/Error.js":16}],3:[function(require,module,exports){
/* Ddl.js */

(function(cxt) {
  "use strict";

  var Querable = require("./Querable.js").Querable,
      Table = require("./Table.js").Table,
      ERROR = require("../param/Error.js").ERROR;


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

},{"../param/Error.js":16,"./Querable.js":5,"./Table.js":9}],4:[function(require,module,exports){
/* Dml.js */

(function(cxt) {
  "use strict";

  var global = (0, eval)("this"),
      ERROR = require("../param/Error.js").ERROR,
      Querable = require("./Querable.js").Querable,
      Kriteria = require("Kriteria").Kriteria || global.Kriteria,
      SelectionAggregator = require("./SelectionAggregator.js").SelectionAggregator,
      arraySortWithObjectElement =
        require("./arraySortWithObjectElement.js").arraySortWithObjectElement,
      arrayUniqueMerge = require("./arrayUniqueMerge.js").arrayUniqueMerge,
      setFunction = require("./setFunction.js").setFunction,
      async = require("./asyncLoop.js").asyncLoop,
      SyncPromise = require("./SyncPromise.js").SyncPromise,
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
      new SyncPromise(function(fulfill1, reject1) {
        if(that._select_table) {
          if(!sli2.tables[that._select_table]) {
            _reject(ERROR.table_not_exist(that._select_table));
            return;
          }

          // **** get data ****

          if(splited_where[that._select_table] || splited_where[that._table_alias]) {
            // select ... from table where ...
            sli2.tables[that._select_table].selectForQuery(
              // where
              extract_where,
              // table_name
              splited_where[that._select_table] ? that._select_table : that._table_alias,
              // alias
              that._table_alias || (that._joins.length > 0 ? that._select_table : ""),
              // success
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

        return new SyncPromise(function(fulfill2, reject2) {
          var joined_rows = [];

          if(that._joins.length === 0) {
            fulfill2(rows1);

          } else {
            var loop_rows = rows1,
                join_num = 0;

            async(that._joins, function(join, next) {
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

              new SyncPromise(function(fulfill3, reject3) {
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

            })
            .then(function() {
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
          return new SyncPromise(function(fulfill1, reject1) {
            if(that._union_queries.length > 0) {
              async(that._union_queries, function(union_query, next) {
                union_query.run(function(rows2) {
                  union_rows = arrayUniqueMerge(union_rows, rows2);

                  next();
                })
                .catch(function(err) {
                  reject1(err);
                });

              })
              .then(function() {
                union_rows = arrayUniqueMerge(union_rows, rows);

                fulfill1(union_rows);
              });

            } else if(that._union_all_queries.length > 0) {
              async(that._union_all_queries, function(union_query, next) {
                union_query.run(function(rows2) {
                  for(i = 0, l = rows2.length; i < l; i = i + 1) {
                    union_rows[union_rows.length] = rows2[i];
                  }

                  next();
                })
                .catch(function(err) {
                  reject1(err);
                });

              })
              .then(function() {
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

},{"../param/Error.js":16,"./Querable.js":5,"./SelectionAggregator.js":7,"./SyncPromise.js":8,"./arraySortWithObjectElement.js":11,"./arrayUniqueMerge.js":12,"./asyncLoop.js":13,"./setFunction.js":15,"Kriteria":17,"clone":26}],5:[function(require,module,exports){
/* Querable.js */

(function(cxt) {
  "use strict";

  var ERROR = require("../param/Error.js").ERROR;


  /**
  * @public
  * @class
  */
  var Querable = function Querable(sli2) {
    this._sli2_object = sli2;
  };

  /**
  * @private
  * @function
  * @returns {Boolean}
  */
  Querable.prototype._isRunnable = function _isRunnable() {
    return true;
  };

  /**
  * @public
  * @funciton
  * @param {Function} func - callback from Querable#_exec
  * @returns {Promise}
  */
  Querable.prototype.run = function run(func) {
    if(!this._isRunnable()) {
      throw ERROR.invalid_description("run");
    }

    var that = this,
        sli2 = this._sli2_object;

    if(sli2 === void 0 || sli2 === null) {
      throw ERROR.querable_is_not_initialized;
    }

    return new Promise(function(fulfill/*, reject*/) {
      sli2.addTask(that, function(idb_result, exec_fulfill, exec_reject) {
        if(typeof func === "function") {
          func(
            idb_result,
            function() { fulfill(); exec_fulfill(); },
            exec_reject
          );

        } else {
          fulfill();
          exec_fulfill();
        }
      });

    });
  };

  /**
  * @public
  * @function
  * @param {Function} func - callback function
  *   arguments[0] is idb operation result
  *   arguments[1] is function for _exec fulfilled
  *   arguments[2] is function for _exec rejected
  * @param {Function} end - exec fulfilled
  * @param {Function} error - exec rejected
  * @retuns {void}
  */
  Querable.prototype.exec = function exec(func, end, error) {
    var _func = typeof func === "function" ? func : function() {},
        _end = typeof end === "function" ? end : function() {},
        _error = typeof error === "function" ? error : function() {};

    _func(null, _end, _error);
  };


  cxt.Querable = Querable;

})(this);

},{"../param/Error.js":16}],6:[function(require,module,exports){
/* SLI2Operator.js */

(function(cxt) {
  "use strict";

  var ERROR = require("../param/Error.js").ERROR,
      setFunction = require("./setFunction.js").setFunction;

  /**
  * @public
  * @class
  */
  var SLI2Operator = function SLI2Operator(sli2) {
    this._sli2_object = sli2;
    this._closed = false;
  };

  /**
  * @public
  * @function
  * @returns {void}
  */
  SLI2Operator.prototype.close = function close() {
    this._sli2_object = null;
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
  SLI2Operator.prototype.add = function add(store, data, success, error) {
    if(this._closed) {
      throw ERROR.closed;
    }

    var req = null,
        _data = [],
        results = [],
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
      req.onsuccess = function(e) {
        results[results.length] = e.target.result;

        if(_data.length > 0) {
          loop();
        } else {
          _success(results);
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
  SLI2Operator.prototype.put = function put(store, data, success, error) {
    if(this._closed) {
      throw ERROR.closed;
    }

    var req = null,
        _data = [],
        results = [],
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
      req.onsuccess = function(e) {
        results[results.length] = e.target.result;

        if(_data.length > 0) {
          loop();
        } else {
          _success(results);
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
  SLI2Operator.prototype.selectAll = function selectAll(store, alias, success, error) {
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
  SLI2Operator.prototype.selectForStoresAndKeyRangesAndFilters = function selectForStoresAndKeyRangesAndFilters(
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
  SLI2Operator.prototype.deleteAll = function deleteAll(store, success, error) {
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
  SLI2Operator.prototype.deleteForStoresAndKeyRangesAndFilters = function deleteForStoresAndKeyRangesAndFilters(
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
  SLI2Operator.prototype.updateAll = function updateAll(store, data, success, error) {
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
  SLI2Operator.prototype.updateForStoresAndKeyRangesAndFilters = function updateForStoresAndKeyRangesAndFilters(
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


  cxt.SLI2Operator = SLI2Operator;

})(this);

},{"../param/Error.js":16,"./setFunction.js":15}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
(function(cxt, global) {
  "use strict";

  var STATE_PENDING = 0,
      STATE_RESOLVED = 1,
      STATE_REJECTED = 2;

  var isPromise = function isPromise(obj) {
    return obj && typeof obj.then === "function";
  };

  /**
   * @public
   * @class
   */
  var SyncPromise = function SyncPromise(proc) {
    this._state = STATE_PENDING;
    this._on_resolve = null;
    this._on_reject = null;
    this._ret = null;

    if(typeof proc !== "function") {
      throw new Error("TypeError: argument[0] of SyncPromise.constructor must be function.");
    }

    try {
      proc(this._resolver.bind(this), this._rejector.bind(this));

    } catch(e) {
      this._state = STATE_REJECTED;

      this._ret = e;
    }
  };

  /**
   * @public
   * @function
   * @param {any} ret -
   * @returns {void}
   */
  SyncPromise.prototype._resolver = function _resolver(ret) {
    var that = this;

    if(this._state === STATE_PENDING) {
      if(isPromise(ret)) {
        return ret
        .then(function(ret2) {
          that._ret = ret2;

          if(typeof that._on_resolve === "function") {
            that._on_resolve(ret2);
          }
        })
        .catch(function(err) {
          that._ret = err;

          if(typeof that._on_reject === "function") {
            that._on_reject(err);
          }
        });
      }

      this._state = STATE_RESOLVED;
      that._ret = ret;

      if(typeof this._on_resolve === "function") {
        this._on_resolve(this._ret);
      }
    }
  };

  /**
   * @public
   * @function
   * @param {any} ret -
   * @returns {void}
   */
  SyncPromise.prototype._rejector = function _rejector(ret) {
    var that = this;

    if(this._state === STATE_PENDING) {
      if(isPromise(ret)) {
        return ret
        .then(function(ret2) {
          that._ret = ret2;

          if(typeof that._on_reject === "function") {
            that._on_reject(that._ret);
          }
        })
        .catch(function(err) {
          that._ret = err;

          if(typeof that._on_reject === "function") {
            that._on_reject(err);
          }
        });
      }

      this._state = STATE_REJECTED;
      this._ret = ret;

      if(typeof this._on_reject === "function") {
        this._on_reject(this._ret);
      }
    }
  };

  /**
   * @public
   * @function
   * @param {Function} proc -
   * @returns {SyncPromise}
   */
  SyncPromise.prototype.then = function then(proc) {
    var that = this,
        ret = null;

    if(typeof proc !== "function") {
      throw new Error("TypeError: argument[0] of SyncPromise#then must be function.");
    }

    if(this._state === STATE_RESOLVED) {
      try {
        ret = proc(this._ret);

        if(ret && typeof ret.then === "function") {
          return ret;

        } else {
          return new SyncPromise(function(fulfill) {
            fulfill(ret);
          });
        }

      } catch(e) {
        return new SyncPromise(function(fulfill, reject) {
          reject(e);
        });
      }

    } else if(this._state === STATE_REJECTED) {
      return new SyncPromise(function(fulfill, reject) {
        reject(that._ret);
      });

    } else {
      return new SyncPromise(function(fulfill, reject) {
        that._on_resolve = function(val) {
          try {
            var ret2 = proc(val);

            if(isPromise(ret2)) {
              ret2.then(function(ret3) {
                fulfill(ret3);
              });

            } else {
              fulfill(ret2);
            }

          } catch(e) {
            reject(e);
          }
        };
        that._on_reject = function(val) {
          reject(val);
        };
      });
    }
  };

  /**
   * @public
   * @function
   * @param {Function} proc -
   * @returns {SyncPromise}
   */
  SyncPromise.prototype.catch = function (proc) {
    var that = this,
        ret = null;

    if(typeof proc !== "function") {
      throw new Error("TypeError: argument[0] of SyncPromise#catch must be function.");
    }

    if(this._state === STATE_RESOLVED) {
      return new SyncPromise(function(fulfill) {
        fulfill(that._ret);
      });

    } else if(this._state === STATE_REJECTED) {
      try {
        ret = proc(this._ret);

        if(ret && typeof ret.then === "function") {
          return ret;

        } else {
          return new SyncPromise(function(fulfill) {
            fulfill(ret);
          });
        }

      } catch(e) {
        return new SyncPromise(function(fulfill, reject) {
          reject(e);
        });
      }

    } else {
      return new SyncPromise(function(fulfill, reject) {
        that._on_reject = function(val) {
          try {
            var ret2 = proc(val);

            if(isPromise(ret2)) {
              ret2.then(function(ret3) {
                that._ret = ret3;
              });

            } else {
              fulfill(ret2);
            }

          } catch(e) {
            reject(e);
          }
        };
        that._on_resolve = function(val) {
          fulfill(val);
        };
      });
    }
  };

  /**
   * @public
   * @statis
   * @function
   * @param {any[]} -
   * @return {SyncPromise}
   */
  SyncPromise.all = function all() {
    if(!Array.isArray(arguments[0])) {
      throw new Error("TypeError:");
    }

    var procs = arguments[0].concat(),
        ret = [];

    return new SyncPromise(function(fulfill, reject) {
      var loop = function loop() {
        try {
          if(procs.length === 0) {
            fulfill(ret);
          }

          var proc = procs.shift();

          if(typeof proc.then === "function") {
            proc
            .then(function(r) {
              ret[ret.length] = r;
              loop();
            })
            .catch(function(err) {
              reject(err);
            });

          } else {
            ret[ret.length] = proc;
            loop();
          }

        } catch(e) {
          reject(e);
        }
      };

      loop();
    });
  };


  cxt.SyncPromise = SyncPromise;
  global.SyncPromise = SyncPromise;

}(this, (0, eval)("this")));

},{}],9:[function(require,module,exports){
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

},{"../param/Error.js":16,"./SLI2Operator.js":6,"criteria2IDBQuery":27}],10:[function(require,module,exports){
/* Tasker.js */
(function(cxt) {
  "use strict";

  /**
  * @public
  * @class
  */
  var Tasker = function Tasker() {
    this._running = false;
    this._stop = false;
    this.auto_run = false;
    this._task_queue = [];
  };

  /**
  * @public
  * @function
  * @param {Object} obj -
  * @param {Function} func -
  * @returns {Tasker}
  */
  Tasker.prototype.addTask = function addTask(obj, func) {
    this._task_queue[this._task_queue.length] = [obj, func];

    if(this.auto_run) {
      this.runQueue();
    }

    return this;
  };

  /**
  * @public
  * @function
  * @returns {Tasker}
  */
  Tasker.prototype.runQueue = function runQueue() {
    var that = this;

    var _next = function() {
      if(that._running && that._task_queue.length > 0) {
        loop();
      }
    };
    var _error = function(err) {
      throw err;
    };

    if(!this._runnign && !this._stop) {
      var loop = function() {
        if(that._running && !that._stop && that._task_queue.length > 0) {
          var task = that._task_queue.shift(),
              obj = task[0],
              func = task[1];

          if(obj && typeof obj.exec === "function") {
            obj.exec(func, _next, _error);
          } else {
            func(_next, _error);
          }

        } else {
          that._running = false;
        }
      };

      this._running = true;
      loop();
    }

    return this;
  };

  /**
  * @public
  * @function
  * @returns {void}
  */
  Tasker.prototype.terminate = function terminate() {
    this._running = false;
    this._task_queue = [];
  };

  /**
  * @public
  * @function
  * @returns {void}
  */
  Tasker.prototype.stop = function stop() {
    this._running = false;
    this._stop = true;
  };

  /**
  * @public
  * @function
  * @returns {void}
  */
  Tasker.prototype.resume = function resume() {
    this._runing = true;
    this._stop = false;
    this.runQueue();
  };


  cxt.Tasker = Tasker;

}(this));

},{}],11:[function(require,module,exports){
/* arraySortWithObjectElement.js */

(function (cxt) {
  "use strict";

  var arraySortWithObjectElement = function arraySortWithObjectElement(obj_arr, keys) {
    return obj_arr.sort(function(a, b) {
      if(!Array.isArray(keys)) {
        keys = [keys];
      }

      for(var i = 0, l = keys.length; i < l; i = i + 1) {
        var key = keys[i],
            res = key.constructor === Object ?
              _sortForKeyOrderObject(a, b, key) : _sortForKeyString(a, b, key);

        if(res !== 0) {
          return res;
        }
      }

      return 0;
    });
  };

  var _sortForKeyString = function _sortForKeyString(a, b, key) {
    return _compare(a, b, [key], "desc");
  };

  var _sortForKeyOrderObject = function _sortForKeyOrderObject(a, b, keys) {
    for(var key in keys) {
      var order = keys[key].toLowerCase();

      if(order !== "desc" && order !== "asc") {
        throw new Error("order error: desc or asc.");
      }

      var res = _compare(a, b, Array.isArray(key) ? key : [key], order);
      if(res !== 0) {
        return res;
      }
    }

    return 0;
  };

  var _compare = function _compare(a, b, keys, order) {
    for(var i = 0, l = keys.length; i < l; i = i + 1) {
      var key = keys[i];

      if(a[key] < b[key]) {
        return order === "desc" ? -1 : 1;
      } else if(a[key] > b[key]) {
        return order === "desc" ? 1 : -1;
      }
    }

    return 0;
  };

  cxt.arraySortWithObjectElement = arraySortWithObjectElement;

})(this);


},{}],12:[function(require,module,exports){
/* arrayUniqueMerge.js */

(function(cxt){
  "use strict";

  var arrayUniqueMerge = function arrayUniqueMerge(arr1, arr2) {
    var unique_rows = arr1.concat();

    if(arr1.length === 0) {
      return arr2;
    }

    for(var i = 0, l = arr2.length; i < l; i = i + 1) {
      var match = false;

      for(var j = 0, l2 = unique_rows.length; j < l2; j = j + 1) {
        if(match_object(unique_rows[j], arr2[i])) {
          match = true;
          break;
        }
      }

      if(!match) {
        unique_rows[unique_rows.length] = arr2[i];
      }
    }

    return unique_rows;
  };

  var match_object = function match_object(obj1, obj2) {
    var keys1 = Object.keys(obj1).sort(),
        keys2 = Object.keys(obj2).sort();

    if(keys1.length !== keys2.length) {
      return false;
    }

    for(var i = 0, l = keys1.length; i < l; i = i + 1) {
      var key1 = keys1[i],
          key2 = keys2[i];

      if(key1 !== key2) {
        return false;
      }

      if(obj1[key1].constructor === Object && obj2[key2].constructor === Object) {
        if(!match_object(obj1[key1], obj2[key2])) {
          return false;
        }
      } else if(obj1[key1] !== obj2[key2]) {
        return false;
      }
    }

    return true;
  };


  cxt.arrayUniqueMerge = arrayUniqueMerge;

})(this);

},{}],13:[function(require,module,exports){
/* asyncLoop.js */

(function(cxt) {
  'use strict';

  var SyncPromise = require("./SyncPromise.js").SyncPromise;

  /**
  * @public
  * @function
  * @param {Array} arr
  * @param {Function} each
  * @param {Function} end
  * @returns {Promise}
  * @description
  */
  var asyncLoop = function(arr, each) {
    var _arr = [];

    for(var i = 0, l = arr.length; i < l; i = i + 1) {
      _arr[i] = arr[i];
    }

    return new SyncPromise(function(fulfill, reject) {
      var loop = function loop() {
        try {
          if(_arr.length > 0) {
            var data = _arr.shift();

            each(data, function() {
              loop();
           });
          } else {
            fulfill();
          }

        } catch(e) {
          reject(e);
        }
      };
      loop();
    });
  };


  cxt.asyncLoop = asyncLoop;

})(this);

},{"./SyncPromise.js":8}],14:[function(require,module,exports){
/* idbInit.js */

(function(cxt) {
  "use strict";

  /**
  * @public
  * @function
  * @returns {void}
  * @description
  *   initialize indexedDB objects
  */
  var idbInit = function idbInit() {
    var global = (0, eval)("this"),
        ret = {},
        objects = [
          "indexedDB", "IDBDatabase", "IDBFactory", "IDBEnvironment", "IDBIndex", "IDBObjectStore",
          "IDBOpenDBRequest", "IDBRequest", "IDBTransaction", "IDBKeyRange", "IDBCursor"
        ],
        prefix = ["webkit", "moz", "ms"];

    var x = 0, y = 0, l2 = 0, l3 = 0;

    for(x = 0, l2 = objects.length; x < l2; x += 1) {
      var object = objects[x];

      if(global[object]) {
        ret[object] = global[object];

      } else {
        for(y = 0, l3 = prefix.length; y < l3; y += 1) {
          var prefixed_object = global[prefix[y] + object.substr(0, 1).toUpperCase() +
                                object.substr(1, object.length - 1)];

          if(prefixed_object) {
            ret[object] = prefixed_object;
          }
        }
      }
    }

    if(Object.keys(ret).length === 0) {
      return null;
    } else {
      return ret;
    }
  };

  cxt.idbInit = idbInit;

})(this);

},{}],15:[function(require,module,exports){
/* setFunction.js */

(function(cxt) {
  "use strict";

  var setFunction = {
    // for SLI2Operator
    setWithTableNameAndAlias: function setWithTableNameAndAlias(_data, _out, _filter, _table_name, _alias) {
      var data_with_table_name = {};
      data_with_table_name[_table_name] = _data;

      if(_filter(data_with_table_name)) {
        var data_with_alias = {};
        data_with_alias[_alias] = _data;
        _out[_out.length] = data_with_alias;

        return true;
      }

      return false;
    },
    setWithTableName: function setWithTableName(_data, _out, _filter, _table_name) {
      var data_with_table_name = {};
      data_with_table_name[_table_name] = _data;

      if(_filter(data_with_table_name)) {
        _out[_out.length] = _data;

        return true;
      }

      return false;
    },
    setWithAlias: function setWithAlias(_data, _out, _filter, _table_name, _alias) {
      if(_filter(_data)) {
        var data_with_alias = {};
        data_with_alias[_alias] = _data;
        _out[_out.length] = data_with_alias;

        return true;
      }

      return false;
    },
    setWithNoTableNameAndNoAlias: function setWithNoTableNameAndNoAlias(_data, _out, _filter) {
      if(_filter(_data)) {
        _out[_out.length] = _data;

        return true;
      }

      return false;
    },
    // for Dml
    setWithNoJoinAndAliasWhere: function setWithNoJoinAndAliasWhere(_data, _out, _where, _alias) {
      var data_with_alias = {};
      data_with_alias[_alias] = _data;

      if(_where.match(data_with_alias)) {
        _out[_out.length] = _data;

        return true;
      }

      return false;
    },
    setWithHasJoinAndAliasWhere: function setWithHasJoinAndAliasWhere(_data, _out, _where, _alias) {
      var data_with_alias = {};
      data_with_alias[_alias] = _data;

      if(_where.match(data_with_alias)) {
        _out[_out.length] = data_with_alias;

        return true;
      }

      return false;
    },
    setWithNoJoinAndNoAliasWhere: function setWithNoJoinAndNoAliasWhere(_data, _out, _where) {
      if(_where.match(_data)) {
        _out[_out.length] = _data;

        return true;
      }

      return false;
    },
    setWithHasJoinAndNoAliasWhere: function setWithHasJoinAndNoAliasWhere(_data, _out, _where, _alias) {
      if(_where.match(_data)) {
        var data_with_alias = {};
        data_with_alias[_alias] = _data;

        _out[_out.length] = data_with_alias;

        return true;
      }

      return false;
    },
    setWithNoJoinAndNoWhere: function setWithNoJoinAndNoWhere(_data, _out) {
      _out[_out.length] = _data;

      return true;
    },
    setWithHasJoinAndNoWhere: function setWithHasJoinAndNoWhere(_data, _out, _where, _alias) {
      var data_with_alias = {};
      data_with_alias[_alias] = _data;

      _out[_out.length] = data_with_alias;

      return true;
    }
  };


  cxt.setFunction = setFunction;

}(this));

},{}],16:[function(require,module,exports){
/* ERROR.js */

(function(cxt) {
  "use strict";

  var ERROR = {
    not_open:
      new Error("SLI2 is not open."),
    already_open:
      new Error("SLI2 is already opened."),
    closed:
      new Error("SLI2 is already closed."),
    no_version_map: function(version) {
      return new Error("SLI2 has no version-map (" + version + ")");
    },
    no_definition: function(version) {
      return new Error("SLI2 has no version-definition (" + version + ")");
    },
    upgrade_error: function(err) {
      return new Error("Upgrade error: " + err.name + ": " + err.message + ".");
    },
    transaction_abort: function(meth) {
      return new Error("Transaction abort at '" + meth + "'.");
    },
    transaction_error: function(err) {
      return new Error("Transaction error: " + err.name + ": " + err.message + ".");
    },
    transaction_already_exist:
      new Error("Transaction already exist."),
    no_transaction: function(name) {
      if(name) {
        return new Error("SLI2 has no transaction('" + name + "')");
      } else {
        return new Error("SLI2 has no transaction.");
      }
    },
    table_already_exist: function(name) {
      return new Error("Table '" + name + "' is already exist.");
    },
    table_not_exist: function(name) {
      return new Error("Table '" + name + "' is not exist.");
    },
    table_already_opened: function(name, handling) {
      return new Error("Table '" + name + "' is already opened from '" + handling + "'.");
    },
    table_cannot_close: function(name, handling1, handling2) {
      return new Error(
        "Table '" + name + "' can not close from '" + handling2 + "'. (handling '" + handling1 + "')"
      );
    },
    index_already_exist: function(name) {
      return new Error("Index '" + name + "' is already exist.");
    },
    index_not_exist: function(name) {
      return new Error("Index '" + name + "' is not exist.");
    },
    no_option: function(meth) {
      return new Error("No options as '" + meth + "'");
    },
    idb_objects_not_exists: new Error("IDB objects not exists."),
    idb_objects_not_used: new Error("IDB objects not used(not exec SLI2#useIndexedDB)."),
    mode_is_no_idb: new Error("SLI2 mode is 'no_idb'."),
    upgrade_unable: new Error("Upgrade unable (upgrading only on DatabaseDefinition)"),

    invalid_description: function(meth) {
      return new Error("Invalid description: " + meth);
    },
    invalid_argument: function(meth) {
      return new Error("Invalid argument: " + meth);
    },
    invalid_state: function(meth) {
      return new Error("Invalid state: " + meth);
    },
    querable_is_not_initialized: new Error("Dml is not initialized (no SLI2 object)."),
    require_select_query: new Error("Joined qauery must be select query."),
    kriteria_prefix_conflict: function(prefix1, prefix2) {
      return new Error("Kriteria Error: key prefix conflict '" + prefix1 + "', '" + prefix2 + "'.");
    },
    dml_exec_error: function(at) {
      return new Error("Dml#exec error at: " + at);
    },
    ddl_exec_error: function(at) {
      return new Error("Ddl#exec error at: " + at);
    },
    cannot_execute: function(mess) {
      return new Error("Can not execute " + mess);
    },

    indexed_operation: function(meth) {
      return new Error("Indexed operation error at '" + meth + "'.");
    },

    invalid_version_number: function(n) {
      return new Error("Invalid version number: " + n);
    },
    is_not_array: function(x) {
      return new Error(x + " is not array");
    },
    is_not_function: function(x) {
      return new Error(x + " is not function");
    }
  };

  cxt.ERROR = ERROR;

})(this);

},{}],17:[function(require,module,exports){
/* Kriteria.js */

(function(cxt, global) {
  "use strict";

  var getProperty = require("./lib/getProperty.js").getProperty,
      matchPrefix = require("./lib/matchPrefix.js").matchPrefix,
      Condition = require("./lib/Condition.js").Condition,
      evaluation = require("./lib/evaluation.js").evaluation;

  /**
  * @public
  * @class
  */
  var Kriteria = function Kriteria() {
    this._conditionAnd = [];
    this._conditionOr = [];
    this._not_flg = false;
  };
  Kriteria._name_ = "Kriteria";

  /**
  * @public
  * @function
  * @returns {Condition[]}
  */
  Kriteria.prototype.getConditionAnd = function getConditionAnd() {
    return this._conditionAnd;
  };

  /**
  * @public
  * @function
  * @returns {Condition[]}
  */
  Kriteria.prototype.getConditionOr = function getConditionAOr() {
    return this._conditionOr;
  };

  /**
  * @private
  * @property
  * @description
  */
  Kriteria._JS_OPERATOR = {
    eq: "===",
    ne: "!==",
    lt: "<",
    le: "<=",
    gt: ">",
    ge: ">="
  };

  /**
  * @public
  * @function
  * @param {Condition} condition -
  * @returns {void}
  * @description
  */
  Kriteria.prototype.addAnd = function addAnd(condition) {
    this._conditionAnd[this._conditionAnd.length] = condition;
  };

  /**
  * @public
  * @function
  * @param {Condition} condition -
  * @returns {void}
  * @description
  */
  Kriteria.prototype.addOr = function addOr(condition) {
    this._conditionOr[this._conditionOr.length] = condition;
  };

  /**
  * @public
  * @function
  * @param {Mixed(String|Kriteria|Function)} key - key name or Kriteria instance or Kriteria reqired function
  * @returns {Function} evaluation || {Kriteria}
  * @description
  */
  Kriteria.prototype.and = function and(key) {
    var key_type = typeof key,
        cri = null;

    if(
      key_type === "string" ||
      key instanceof String ||
      key_type === "number" ||
      key instanceof Number
    ) {
      return evaluation("and", key, this);

    } else if(key instanceof Kriteria) {
      cri = key;
      this.addAnd(new Condition("", "", [], "", cri));

      return this;

    } else if(typeof key === "function") {
      cri = new Kriteria();
      key(cri);
      this.addAnd(new Condition("", "", [], "", cri));

      return this;

    } else {
      throw new Error("invalid type of argument. (" + key_type + ")");
    }
  };

  /**
  * @public
  * @function
  * @param {Mixed(String|Kriteria|Function)} key - key name or Kriteria instance or Kriteria reqired function
  * @returns {Mixed(Function|Kriteria)}
  * @description
  */
  Kriteria.prototype.or = function or(key) {
    var key_type = typeof key,
        cri = null;

    if(key_type === "string" ||
       key instanceof String ||
       key_type === "number" ||
       key instanceof Number
      ) {
      return evaluation("or", key, this);

    } else if(key instanceof Kriteria) {
      cri = key;
      this.addOr(new Condition("", "", [], "", cri));

      return this;

    } else if(typeof key === "function") {
      cri = new Kriteria();
      key(cri);
      this.addOr(new Condition("", "", [], "", cri));

      return this;

    } else {
      throw new Error("invalid type of argument. (" + key_type + ")");
    }
  };

  /**
  * @public
  * @function
  * @returns {Kriteria}
  * @description
  */
  Kriteria.prototype.not = function not() {
    this._not_flg = !this._not_flg;

    return this;
  };

  /**
  * @public
  * @static
  * @function
  * @param {Object} conditions -
  *   {Condition[]} conditions.and -
  *   {Condition[]} conditions.or -
  * @returns {Kriteria}
  * @description
  */
  Kriteria.parse = function parse(conditions) {
    var ret = new Kriteria(),
        i = "";

    for(i in conditions.and) {
      ret.addAnd(conditions.and[i]);
    }
    for(i in conditions.or) {
      ret.andOr(conditions.or[i]);
    }
    if(conditions.not) {
      ret.not();
    }

    return ret;
  };

  /**
  * @public
  * @function
  * @param {Object} data -
  * @returns {Boolean}
  * @description
  */
  Kriteria.prototype.match = function match(data) {
    var i = 0, l = 0,
        j = 0, l2 = 0,
        left_key = "",
        operator = "",
        right_key = [],
        key_type = "",
        left_value = null,
        right_value = [],
        result = false,
        condition = null,
        tmp_right_value = null;

    for(i = 0, l = this._conditionAnd.length; i < l; i = i + 1) {
      condition = this._conditionAnd[i];

      if(condition.criteria instanceof Kriteria) {
        result = condition.criteria.match(data);

        // and条件は1つでもfalseがあったら、結果はfalse
        if(!result) {
          break;
        }

      } else {
        left_key = condition.left_key;
        operator = condition.operator;
        right_key = condition.right_key;
        key_type = condition.key_type;
        left_value = getProperty(data, left_key);

        if(key_type === "value") {
          right_value = right_key;

        } else if(key_type === "key") {
          tmp_right_value = getProperty(data, right_key[0]);

          if(Array.isArray(tmp_right_value)) {
            if(operator === "match" || operator === "not_match") {
              right_value = [];

              for(j = 0, l2 = tmp_right_value.length; j < l2; j = j + 1) {
                if(tmp_right_value[j] === null
                   || tmp_right_value[j] === void 0
                   || tmp_right_value[j] === "") {
                  right_value[j] = tmp_right_value[j];

                } else {
                  right_value[j] = new RegExp(tmp_right_value[j]);
                }
              }

            } else {
              right_value = tmp_right_value;
            }

          } else {
            if(operator === "match" || operator === "not_match") {
              if(tmp_right_value === null
                 || tmp_right_value === void 0
                 || tmp_right_value === "") {
                right_value = tmp_right_value;

              } else {
                right_value = [new RegExp(tmp_right_value)];
              }

            } else {
              right_value = [tmp_right_value];
            }
          }
        }

        if(
          right_value === void 0
          || !!~right_value.indexOf(void 0)
          || left_value === void 0
        ) {
          // valueがundefinedの場合はfalse
          result = false;

        } else {
          // 上記以外は比較演算
          result = this._compare(left_value, operator, right_value);
        }

        // and条件は1つでもfalseがあったら、結果はfalse
        if(!result) {
          break;
        }
      }
    }

    // and条件ですべて一致した場合
    if(result) {
      return !!(true ^ this._not_flg);
    }

    for(i = 0, l = this._conditionOr.length; i < l; i = i + 1) {
      condition = this._conditionOr[i];

      if(condition.criteria instanceof Kriteria) {
        result = condition.criteria.match(data);
        if(result) {
          return !!(true ^ this._not_flg);
        }

      } else {
        left_key = condition.left_key;
        operator = condition.operator;
        right_key = condition.right_key;
        key_type = condition.key_type;
        left_value = getProperty(data, left_key);

        if(key_type === "value") {
          right_value = right_key;

        } else if(key_type === "key") {
          tmp_right_value = getProperty(data, right_key[0]);

          if(Array.isArray(tmp_right_value)) {
            if(operator === "match" || operator === "not_match") {
              right_value = [];

              for(j = 0, l2 = tmp_right_value.length; j < l2; j = j + 1) {
                if(tmp_right_value[j] === null
                   || tmp_right_value[j] === void 0
                   || tmp_right_value[j] === "") {
                  right_value[j] = tmp_right_value[j];

                } else {
                  right_value[j] = new RegExp(tmp_right_value[j]);
                }
              }

            } else {
              right_value = tmp_right_value;
            }
          } else {
            if(operator === "match" || operator === "not_match") {
              if(tmp_right_value === null
                 || tmp_right_value === void 0
                 || tmp_right_value !== "") {
                right_value = tmp_right_value;

              } else {
                right_value = [new RegExp(tmp_right_value)];
              }

            } else {
              right_value = [tmp_right_value];
            }
          }
        }

        if(
          right_value === void 0
          || !!~right_value.indexOf(void 0)
          || left_value === void 0
        ) {
          // valueがundefinedの場合はfalse
          result = false;

        } else {
          // 上記以外は比較演算
          result = this._compare(left_value, operator, right_value);
        }

        // or条件は1つでもtrueがあったら、結果はtrue
        if(result) {
          return !!(true ^ this._not_flg);
        }
      }
    }

    // 上記以外はfalse
    return !!(false ^ this._not_flg);
  };

  /**
  * @private
  * @function
  * @param {Mixed(String|Number)} value1 -
  * @param {String} operator -
  * @param {Array} value2 -
  * @returns {Boolean}
  * @description
  */
  Kriteria.prototype._compare = function _compare(value1, operator, value2) {
    var result = false;

    switch(operator) {
      case "eq":
        result = (value2[0] === value1);
        break;

      case "ne":
        result = (value2[0] !== value1);
        break;

      case "lt":
        result = (value2[0] > value1);
        break;

      case "le":
        result = (value2[0] >= value1);
        break;

      case "gt":
        result = (value2[0] < value1);
        break;

      case "ge":
        result = (value2[0] <= value1);
        break;

      case "in":
        result = !!~value2.indexOf(value1);
        break;

      case "not_in":
        result = !~value2.indexOf(value1);
        break;

      case "between":
        result = (value2[0] <= value1 && value2[1] >= value1);
        break;

      case "not_between":
        result = (value2[0] > value1 || value2[1] < value1);
        break;

      case "match":
        if(value2[0] === null) {
          if(value1 === null || value1 === void 0) {
            result = true;
          } else {
            result = false;
          }

        } else if(value1 === null) {
          result = false;

        } else if(value2[0] === "") {
          result = value1 === "" ? true : false;

        } else {
          result = value2[0].test(value1);
        }
        break;

      case "not_match":
        if(value2[0] === null) {
          if(value1 === null || value1 === void 0) {
            result = false;
          } else {
            result = true;
          }

        } else if(value1 === null) {
          result = true;

        } else if(value2[0] === "") {
          result = value1 === "" ? false : true;

        } else {
          result = !value2[0].test(value1);
        }
        break;
    }

    return result;
  };

  /**
  * @public
  * @function
  * @returns {Function}
  * @description
  */
  Kriteria.prototype.matcher = function matcher() {
    /* eslint no-new-func: 0 */
    return new Function("$", "return " + this._createMatchingExpression());
  };

  /**
  * @private
  * @function
  * @returns {String}
  * @description
  */
  Kriteria.prototype._createMatchingExpression = function _createMatchingExpression() {
    var i = 0, l = 0,
        expAnd = [],
        expOr = [],
        retAnd = "",
        retOr = "",
        condition = null,
        ret = "";

    for(i = 0, l = this._conditionAnd.length; i < l; i = i + 1) {
      condition = this._conditionAnd[i];

      if(condition.criteria instanceof Kriteria) {
        expAnd[expAnd.length] = "(" + condition.criteria._createMatchingExpression() + ")";

      } else {
        expAnd[expAnd.length] = this._createExpression(condition);
      }
    }

    for(i = 0, l = this._conditionOr.length; i < l; i = i + 1) {
      condition = this._conditionOr[i];

      if(condition.criteria instanceof Kriteria) {
        expOr[expOr.length] = "(" + condition.criteria._createMatchingExpression() + ")";

      } else {
        expOr[expOr.length] = this._createExpression(condition);
      }
    }

    retAnd = expAnd.join(" && ");
    retOr = expOr.join(" || ");

    if(retAnd && retOr) {
      ret = retAnd + " || " + retOr + " ";
    } else if(!retOr) {
      ret = retAnd;
    } else if(!retAnd) {
      ret = retOr;
    }

    if(this._not_flg) {
      ret = "!(" + ret + ")";
    }

    return ret;
  };

  /**
  * @private
  * @function
  * @param {Condition} condition -
  * @returns {String}
  * @description
  */
  Kriteria.prototype._createExpression = function _createExpression(condition) {
    return "(" +
      this._createJsExpressionOfKeyIsNotUndefined(condition.left_key) +
      " && " +
      (
        condition.key_type === "key" ?
          this._createJsExpressionOfKeyIsNotUndefined(condition.right_key[0]) + " && " :
          ""
      ) +
      this._createJsExpression(condition) +
      ")";
  };

  /**
  * @private
  * @function
  * @param {Condition}
  * @returns {String}
  * @description
  */
  Kriteria.prototype._createJsExpression = function _createJsExpression(condition) {
    var left_key = "$." + condition.left_key,
        operator = condition.operator,
        right_key = condition.right_key,
        key_type = condition.key_type,
        _operator = Kriteria._JS_OPERATOR[operator];

    if(_operator) {
      /* 演算子が eq, ne, lt, le, gt, ge のいずれか
           [left_key] [operator] "[right_key]"
           [left_key] [operator] $.[right_key]
      */
      return left_key + " " + _operator + " " +
             this._toStringExpressionFromValue(right_key[0], key_type);

    } else if(operator === "in") {
      /* in 演算子
           !!~[[right_key]].indexOf([left_key])
           (Array.isArray($.[right_key]) ? !!~$.[right_key].indexOf([left_key]) : $.[right_key] === [left_key])
      */
      if(key_type === "value") {
        return "!!~" + this._toStringExpressionFromArray(right_key) + ".indexOf(" + left_key + ")";

      } else {
        return "(Array.isArray($." + right_key[0] + ") ? " +
               "!!~$." + right_key[0] + ".indexOf(" + left_key + "): " +
               "$." + right_key[0] + " === " + left_key + ")";
      }

    } else if(operator === "not_in") {
      /* not_in 演算子
      */
      if(key_type === "value") {
        return "!~" + this._toStringExpressionFromArray(right_key) + ".indexOf(" + left_key + ")";

      } else {
        return "(Array.isArray($." + right_key[0] + ") ? " +
               "!~$." + right_key[0] + ".indexOf(" + left_key + "): " +
               "$." + right_key[0] + " !== " + left_key + ")";
      }

    } else if(operator === "between") {
      /* between 演算子
      */
      return left_key + " >= " + this._toStringExpressionFromValue(right_key[0], key_type) +
             " && " +
             left_key + " <= " + this._toStringExpressionFromValue(right_key[1], key_type);

    } else if(operator === "not_between") {
      /* not_between 演算子
      */
      return left_key + " < " + this._toStringExpressionFromValue(right_key[0], key_type) +
             " || " +
             left_key + " > " + this._toStringExpressionFromValue(right_key[1], key_type);

    } else if(operator === "match") {
      /* match 演算子
      */
      if(right_key[0] === void 0) {
        return false;

      } else if(right_key[0] === null) {
        return "(" + left_key + " === null ? true : false)";

      } else if(right_key[0] === "") {
        return "(" + left_key + " === '' ? true : false)";

      } else {
        //return "(" + left_key + " !== null && " + right_key[0] + ".test(" + left_key + "))";
        return "(" + right_key[0] + ".test(" + left_key + "))";
      }

    } else if(operator === "not_match") {
      /* not_match 演算子
      */
      if(right_key[0] === void 0) {
        return false;

      } else if(right_key[0] === null) {
        return "(" + left_key + " === null ? false : true)";

      } else if(right_key[0] === "") {
        return "(" + left_key + " === '' ? false : true)";

      } else {
        //return "(" + left_key + " !== null && !" + right_key[0] + ".test(" + left_key + "))";
        return "(!" + right_key[0] + ".test(" + left_key + "))";
      }

    } else {
      return null;
    }
  };

  /**
  * @private
  * @function
  * @param {String} key -
  * @returns {String}
  * @description
  */
  Kriteria.prototype._createJsExpressionOfKeyIsNotUndefined =
    function _createJsExpressionOfKeyIsNotUndefined(key) {
    var keys = key.split("."),
        work_keys = [],
        ret = [];

    for(var i = 0, l = keys.length; i < l; i = i + 1) {
      work_keys[work_keys.length] = keys[i];
      ret[ret.length] = "$." + work_keys.join(".") + " !== void 0";
    }

    return ret.join(" && ");
  };

  /**
  * @private
  * @function
  * @param {String} key -
  * @returns {String}
  * @description
  */
  Kriteria.prototype._createJSExpressionOfKeyIsUndefined =
    function _createJSExpressionOfKeyIsUndefined(key) {
    var keys = key.split("."),
        work_keys = [],
        ret = [];

    for(var i = 0, l = keys.length; i < l; i = i + 1) {
      work_keys[work_keys.length] = keys[i];
      ret[ret.length] = "$." + work_keys.join(".") + " === void 0";
      ret[ret.length] = "$." + work_keys.join(".") + " === null";
    }

    return ret.join(" || ");
  };

  /**
  * @private
  * @function
  * @param {Array} arr -
  * @returns {String}
  * @description
  */
  Kriteria.prototype._toStringExpressionFromArray = function _toStringExpressionFromArray(arr) {
    var ret = [];

    for(var i = 0, l = arr.length; i < l; i = i + 1) {
      ret[ret.length] = this._toStringExpressionFromValue(arr[i], "value");
    }

    return "[" + ret.join(", ") + "]";
  };

  /**
  * @private
  * @function
  * @param {Mixed(String|Number)} value -
  * @param {String} type -
  * @returns {String}
  * @description
  */
  Kriteria.prototype._toStringExpressionFromValue =
    function _toStringExpressionFromValue(value, type) {
    if(type === "value" && (typeof value === "string" || value instanceof String)) {
      return '"' + value + '"';
    } else if(type === "key") {
      return "$." + value;
    } else {
      return value + '';
    }
  };

  /**
  * @public
  * @function
  * @param {String[]} prefixes -
  * @returns {Object.<Kriteria>}
  */
  Kriteria.prototype.splitByKeyPrefixes = function splitByKeyPrefixes(prefixes) {
    if(!Array.isArray(prefixes) || prefixes.length === 0) {
      return null;
    }

    var ret = {},
        condition = null,
        splited_criteria = null,
        matchPrefixes = [],
        left_key = "",
        right_key = "",
        key_type = "",
        match1 = true,
        match2 = true,
        added = true,
        key = "",
        i = 0, l = 0,
        j = 0, l2 = 0;

    for(i = 0, l = prefixes.length; i < l; i = i + 1) {
      ret[prefixes[i]] = new Kriteria();
    }
    ret.else = new Kriteria();

    for(i = 0, l = this._conditionAnd.length; i < l; i = i + 1) {
      condition = this._conditionAnd[i];

      if(condition.criteria instanceof Kriteria) {
        splited_criteria = condition.criteria.splitByKeyPrefixes(prefixes);

        for(key in splited_criteria) {
          if(splited_criteria[key] !== null) {
            ret[key].and(splited_criteria[key]);
          }
        }

      } else {
        matchPrefixes = [];
        left_key = condition.left_key;
        right_key = condition.right_key[0];
        key_type = condition.key_type;
        added = false;

        for(j = 0, l2 = prefixes.length; j < l2; j = j + 1) {
          matchPrefixes[matchPrefixes.length] = prefixes[j];

          match1 = matchPrefix(left_key, matchPrefixes);
          if(key_type === "key") {
            match2 = matchPrefix(right_key, matchPrefixes);
          }

          if(
            (key_type === "value" && match1) ||
            (key_type === "key" && match1 && match2)
          ) {
            ret[prefixes[j]].addAnd(condition);
            added = true;
            break;
          }
        }

        if(!added) {
          ret.else.addAnd(condition);
        }
      }
    }

    for(i = 0, l = this._conditionOr.length; i < l; i = i + 1) {
      condition = this._conditionOr[i];

      if(condition.criteria instanceof Kriteria) {
        splited_criteria = condition.criteria.splitByKeyPrefixes(prefixes);

        for(key in splited_criteria) {
          if(splited_criteria[key] !== null) {
            ret[key].or(splited_criteria[key]);
          }
        }

      } else {
        matchPrefixes = [];
        left_key = condition.left_key;
        right_key = condition.right_key[0];
        key_type = condition.key_type;
        added = false;

        for(j = 0, l2 = prefixes.length; j < l2; j = j + 1) {
          matchPrefixes[matchPrefixes.length] = prefixes[j];

          match1 = matchPrefix(left_key, matchPrefixes);
          if(key_type === "key") {
            match2 = matchPrefix(right_key, matchPrefixes);
          }

          if(
            (key_type === "value" && match1) ||
            (key_type === "key" && match1 && match2)
          ) {
            ret[prefixes[j]].addOr(condition);
            added = true;
            break;
          }
        }

        if(!added) {
          ret.else.addOr(condition);
        }
      }
    }

    for(key in ret) {
      if(ret[key].getConditionAnd().length > 0 || ret[key].getConditionOr().length > 0) {
        ret[key]._not_flg = this._not_flg;
      } else {
        ret[key] = null;
      }
    }
    return ret;
  };

  /**
  * @public
  * @function
  * @param {Kriteria} kri -
  * @param {Boolean} unique -
  * @returns {Kriteria}
  */
  Kriteria.prototype.merge = function merge(kri, unique) {
    var new_kriteria = new Kriteria(),
        kri_cond_and = kri.getConditionAnd(),
        kri_cond_or = kri.getConditionOr(),
        cond1 = null,
        match = false,
        i = 0, l = 0,
        j = 0, l2 = 0;

    if(this._not_flg !== kri._not_flg) {
      throw new Error("Kriteria#merge - collision to not flag.");
    }

    for(i = 0, l = this._conditionAnd.length; i < l; i = i + 1) {
      new_kriteria.addAnd(this._conditionAnd[i]);
    }

    for(i = 0, l = this._conditionOr.length; i < l; i = i + 1) {
      new_kriteria.addOr(this._conditionOr[i]);
    }

    if(!unique) {
      for(i = 0, l = kri_cond_and.length; i < l; i = i + 1) {
        new_kriteria.addAnd(kri_cond_and[i]);
      }

      for(i = 0, l = kri_cond_or.length; i < l; i = i + 1) {
        new_kriteria.addOr(kri_cond_or[i]);
      }

    } else {
      for(i = 0, l = kri_cond_and.length; i < l; i = i + 1) {
        cond1 = kri_cond_and[i];
        match = false;

        for(j = 0, l2 = this._conditionAnd.length; j < l2; j = j + 1) {
          if(cond1.compareTo(this._conditionAnd[j]) === 0) {
            match = true;
            break;
          }
        }

        if(!match) {
          new_kriteria.addAnd(cond1);
        }
      }

      for(i = 0, l = kri_cond_or.length; i < l; i = i + 1) {
        cond1 = kri_cond_or[i];
        match = false;

        for(j = 0, l2 = this._conditionOr.length; j < l2; j = j + 1) {
          if(cond1.compareTo(this._conditionOr[j]) === 0) {
            match = true;
            break;
          }
        }

        if(!match) {
          new_kriteria.addOr(cond1);
        }
      }
    }

    return new_kriteria;
  };

  /**
  * @public
  * @function
  * @param {Kriteria} kri -
  * @returns {Number}
  *    0 - equal
  *    1 - greater
  *   -1 - less
  */
  Kriteria.prototype.compareTo = function compareTo(kri) {
    var sort_func = function(a, b) {
          return a.compareTo(b);
        },
        kri_cond_and = kri.getConditionAnd(),
        kri_cond_or = kri.getConditionOr(),
        cond1 = null,
        cond2 = null,
        compared = true,
        len1 = 0, len2 = 0,
        i = 0, l = 0;

    this._conditionAnd.sort(sort_func);
    kri_cond_and.sort(sort_func);
    this._conditionOr.sort(sort_func);
    kri_cond_or.sort(sort_func);

    if(this._not_flg && !kri._not_flg) {
      return -1;
    } else if(!this._not_flg && kri._not_flg) {
      return 1;
    }

    len1 = this._conditionAnd.length;
    len2 = kri_cond_and.length;
    l = len1 > len2 ? len1 : len2;
    for(i = 0; i < l; i = i + 1) {
      cond1 = this._conditionAnd[i];
      cond2 = kri_cond_and[i];

      if(!cond1) {
        return -1;
      } else if(!cond2) {
        return 1;
      }

      compared = cond1.compareTo(cond2);

      if(compared !== 0) {
        return compared;
      }
    }

    len1 = this._conditionOr.length;
    len2 = kri_cond_or.length;
    l = len1 > len2 ? len1 : len2;
    for(i = 0; i < l; i = i + 1) {
      cond1 = this._conditionOr[i];
      cond2 = kri_cond_or[i];

      if(!cond1) {
        return -1;
      } else if(!cond2) {
        return 1;
      }

      compared = cond1.compareTo(cond2);

      if(compared !== 0) {
        return compared;
      }
    }

    return 0;
  };

  /**
  * @public
  * @function
  * @param {String[]} prefixes -
  * @returns {Kriteria}
  */
  Kriteria.prototype.removePrefixes = function removePrefixes(prefixes) {
    var rex = null,
        condition = null,
        i = 0, l = 0;

    if(prefixes === null || prefixes === void 0 || !Array.isArray(prefixes) || prefixes.length === 0) {
      return this;
    }

    rex = new RegExp("^(" + prefixes.join("|") + ").");

    for(i = 0, l = this._conditionAnd.length; i < l; i = i + 1) {
      condition = this._conditionAnd[i];

      if(condition.criteria instanceof Kriteria) {
        condition.criteria.removePrefixes(prefixes);

      } else {
        condition.left_key = condition.left_key.replace(rex, "");
        if(condition.key_type === "key") {
          condition.right_key[0] = condition.right_key[0].replace(rex, "");
        }
      }
    }

    for(i = 0, l = this._conditionOr.length; i < l; i = i + 1) {
      condition = this._conditionOr[i];

      if(condition.criteria instanceof Kriteria) {
        condition.criteria.removePrefixes(prefixes);

      } else {
        condition.left_key = condition.left_key.replace(rex, "");
        if(condition.key_type === "key") {
          condition.right_key[0] = condition.right_key[0].replace(rex, "");
        }
      }
    }

    return this;
  };


  cxt.Kriteria = Kriteria;
  global.Kriteria = Kriteria;

}(this, (0, eval)("this").window || this));

},{"./lib/Condition.js":18,"./lib/evaluation.js":19,"./lib/getProperty.js":20,"./lib/matchPrefix.js":21}],18:[function(require,module,exports){
/* Condition.js */

(function (cxt) {
  "use strict";

  /**
  * @public
  * @class
  * @param {String} left_key -
  * @param {String} operator -
  * @param {Mixed(Array<any>|any)} right_key -
  * @param {String} key_type -
  * @param {Kriteria} criteria
  * @description
  */
  var Condition = function Condition(left_key, operator, right_key, key_type, criteria) {
    this.left_key = left_key;
    this.operator = operator;
    this.right_key = (Array.isArray(right_key) || right_key === void 0 || right_key === null) ?
      right_key : [right_key];
    this.key_type = key_type;
    this.criteria = criteria;
  };

  /**
  * @public
  * @function
  * @returns {Condition}
  * @description
  */
  Condition.prototype.clone = function clone() {
    return new Condition(this.left_key, this.operator, this.right_key.concat(), this.key_type, this.criteria);
  };

  /**
  * @public
  * @function
  * @returns {Conditons}
  * @description
  */
  Condition.prototype.not = function not() {
    switch(this.operator) {
      case "eq":
        this.operator = "ne";
        break;

      case "ne":
        this.operator = "eq";
        break;

      case "lt":
        this.operator = "ge";
        break;

      case "le":
        this.operator = "gt";
        break;

      case "gt":
        this.operator = "le";
        break;

      case "ge":
        this.operator = "lt";
        break;

      case "in":
        this.operator = "not_in";
        break;

      case "not_in":
        this.operator = "in";
        break;

      case "between":
        this.operator = "not_between";
        break;

      case "not_between":
        this.operator = "between";
        break;

      case "match":
        this.operator = "not_match";
        break;

      case "not_match":
        this.operator = "match";
        break;

    }

    return this;
  };

  /**
  * @public
  * @function
  * @returns Array<Condition>
  */
  Condition.prototype.normalize = function normalize() {
    var ret = [],
        i = 0, l = 0;

    if(this.key_type === "value") {
      switch(this.operator) {
        case "in":
          for(i = 0, l = this.right_key.length; i < l; i = i + 1) {
            ret[ret.length] = new Condition(
              this.left_key, "eq", [this.right_key[i]], this.key_type, null)
            ;
          }
          break;

        case "not_in":
          for(i = 0, l = this.right_key.length; i < l; i = i + 1) {
            ret[ret.length] = new Condition(
              this.left_key, "ne", [this.right_key[i]], this.key_type, null
            );
          }
          break;

        case "between":
          ret[ret.length] = new Condition(
            this.left_key, "ge", [this.right_key[0]], this.key_type, null
          );
          ret[ret.length] = new Condition(
            this.left_key, "le", [this.right_key[1]], this.key_type, null
          );
          break;

        case "not_between":
          ret[ret.length] = new Condition(
            this.left_key, "lt", [this.right_key[0]], this.key_type, null
          );
          ret[ret.length] = new Condition(
            this.left_key, "gt", [this.right_key[1]], this.key_type, null
          );
          break;

        default:
          ret[ret.length] = this.clone();
          break;
      }

    } else {
      ret[ret.length] = this.clone();
    }

    return ret;
  };

  /**
  * @public
  * @function
  * @param {Condition} cond -
  * @returns {Number}
  *    0 - equal
  *    1 - greater
  *   -1 - less
  */
  Condition.prototype.compareTo = function compareTo(cond) {
    if(this.criteria && !cond.criteria) {
      return 1;

    } else if(!this.criteria && cond.criteria) {
      return -1;

    } else if(this.criteria && cond.criteria) {
      return this.criteria.compareTo(cond.criteria);

    } else if(this.left_key > cond.left_key) {
      return 1;

    } else if(this.left_key < cond.left_key) {
      return -1;

    } else if(this.operator > cond.operator) {
      return 1;

    } else if(this.operator < cond.operator) {
      return -1;

    } else if(this.key_type > cond.key_type) {
      return 1;

    } else if(this.key_type < cond.key_type) {
      return -1;

    } else {
      for(var i = 0, l = this.right_key.length; i < l; i = i + 1) {
        if(this.right_key[i] > cond.right_key[i]) {
          return 1;
        } else if(this.right_key[i] < cond.right_key[i]) {
          return -1;
        }
      }

      return 0;
    }
  };

  cxt.Condition = Condition;

})(this);

},{}],19:[function(require,module,exports){
/* evaluation.js */

(function (cxt){
  "use strict";

  var Condition = require('./Condition.js').Condition;

  /**
  * @public
  * @function
  * @param {String} type -
  * @param {String} left_key -
  * @param {Kriteria} criteria -
  * @returns {Object<[eq|ne|lt|le|gt|ge|in|not_in].[key|value]>|between}
  * @description
  */
  var evaluation = function evaluation(type, left_key, criteria) {
    return {
      eq: {
        key: function(value) {
          _setToCriteria(criteria, type, "eq", left_key, "key", [value]);
          return criteria;
        },
        value: function(value) {
          _setToCriteria(criteria, type, "eq", left_key, "value", [value]);
          return criteria;
        }
      },
      ne: {
        key: function(value) {
          _setToCriteria(criteria, type, "ne", left_key, "key", [value]);
          return criteria;
        },
        value: function(value) {
          _setToCriteria(criteria, type, "ne", left_key, "value", [value]);
          return criteria;
        }
      },
      lt: {
        key: function(value) {
          _setToCriteria(criteria, type, "lt", left_key, "key", [value]);
          return criteria;
        },
        value: function(value) {
          _setToCriteria(criteria, type, "lt", left_key, "value", [value]);
          return criteria;
        }
      },
      le: {
        key: function(value) {
          _setToCriteria(criteria, type, "le", left_key, "key", [value]);
          return criteria;
        },
        value: function(value) {
          _setToCriteria(criteria, type, "le", left_key, "value", [value]);
          return criteria;
        }
      },
      gt: {
        key: function(value) {
          _setToCriteria(criteria, type, "gt", left_key, "key", [value]);
          return criteria;
        },
        value: function(value) {
          _setToCriteria(criteria, type, "gt", left_key, "value", [value]);
          return criteria;
        }
      },
      ge: {
        key: function(value) {
          _setToCriteria(criteria, type, "ge", left_key, "key", [value]);
          return criteria;
        },
        value: function(value) {
          _setToCriteria(criteria, type, "ge", left_key, "value", [value]);
          return criteria;
        }
      },
      in: {
        key: function() {
          _setToCriteria(criteria, type, "in", left_key, "key", [arguments[0]]);
          return criteria;
        },
        value: function() {
          _setToCriteria(
            criteria,
            type,
            "in",
            left_key,
            "value",
            Array.isArray(arguments[0]) ? arguments[0] : [].slice.apply(arguments)
          );
          return criteria;
        }
      },
      not_in: {
        key: function() {
          _setToCriteria(criteria, type, "not_in", left_key, "key", [arguments[0]]);
          return criteria;
        },
        value: function() {
          _setToCriteria(
            criteria,
            type,
            "not_in",
            left_key,
            "value",
            Array.isArray(arguments[0]) ? arguments[0] : [].slice.apply(arguments)
          );
          return criteria;
        }
      },
      between: function(value1, value2) {
        _setToCriteria(criteria, type, "between", left_key, "value", [value1, value2]);
        return criteria;
      },
      not_between: function(value1, value2) {
        _setToCriteria(criteria, type, "not_between", left_key, "value", [value1, value2]);
        return criteria;
      },
      match: function(value) {
        var _value = value instanceof RegExp ? value :
                     value === null ? null :
                     value === void 0 ? void 0 :
                     value === "" ? "" : new RegExp(value);
        _setToCriteria(criteria, type, "match", left_key, "value", [_value]);
        return criteria;
      },
      not_match: function(value) {
        var _value = value instanceof RegExp ? value :
                     value === null ? null :
                     value === void 0 ? void 0 :
                     value === "" ? "" : new RegExp(value);
        _setToCriteria(criteria, type, "not_match", left_key, "value", [_value]);
        return criteria;
      }
    };
  };

  /**
  * @private
  * @function
  * @param {Kriteria} criteria -
  * @param {String} type -
  * @param {String} operator -
  * @param {String} key_name -
  * @param {Array<String>} values -
  * @returns {void}
  * @description
  */
  var _setToCriteria = function _setToCriteria(criteria, type, operator, key_name, key_type, values) {
    if(type.toLowerCase() === "and") {
      criteria.addAnd(new Condition(key_name, operator, values, key_type, null));

    } else if(type.toLowerCase() === "or") {
      criteria.addOr(new Condition(key_name, operator, values, key_type, null));

    } else {
      throw new Error(
        "invalid type: " + type +
        "(at key_name:" + key_name + ", key_type: " + key_type + ", operator:" + operator + ")"
      );
    }
  };


  cxt.evaluation = evaluation;

})(this);

},{"./Condition.js":18}],20:[function(require,module,exports){
/* getProperty.js */

(function (cxt) {
  'use strict';

  var getProperty = function getProperty(obj, key) {
    var keys = key.split('.'),
        ret = obj;

    for(var i = 0, l = keys.length; i < l; i += 1) {
      if(
        typeof ret === "string" ||
        ret instanceof String ||
        typeof ret === "number" ||
        ret instanceof Number
      ) {
        return void 0;

      } else if(keys[i] in ret) {
        ret = ret[keys[i]];

      } else {
        return void 0;
      }
    }

    return ret;
  };

  cxt.getProperty = getProperty;

})(this);

},{}],21:[function(require,module,exports){
/* matchPrefix.js */

(function(cxt) {
  "use strict";

  /**
  * @public
  * @function
  * @param {String} str -
  * @param {String[]} prefixes -
  * @returns {Boolean}
  */
  var matchPrefix = function matchPrefix(str, prefixes) {
    if(prefixes.length === 0) {
      return true;
    }

    for(var i = 0, l = prefixes.length; i < l; i = i + 1) {
      if(str.indexOf(prefixes[i] + ".") === 0) {
        return true;
      }
    }

    return false;
  };


  cxt.matchPrefix = matchPrefix;

}(this));

},{}],22:[function(require,module,exports){
(function (global){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('isarray')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.foo = function () { return 42 }
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; i++) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  that.write(string, encoding)
  return that
}

function fromArrayLike (that, array) {
  var length = checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; i++) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'binary':
      // Deprecated
      case 'raw':
      case 'raws':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'binary':
        return binarySlice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

function arrayIndexOf (arr, val, byteOffset, encoding) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var foundIndex = -1
  for (var i = 0; byteOffset + i < arrLength; i++) {
    if (read(arr, byteOffset + i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
      if (foundIndex === -1) foundIndex = i
      if (i - foundIndex + 1 === valLength) return (byteOffset + foundIndex) * indexSize
    } else {
      if (foundIndex !== -1) i -= i - foundIndex
      foundIndex = -1
    }
  }
  return -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset >>= 0

  if (this.length === 0) return -1
  if (byteOffset >= this.length) return -1

  // Negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0)

  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  if (Buffer.isBuffer(val)) {
    // special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(this, val, byteOffset, encoding)
  }
  if (typeof val === 'number') {
    if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
      return Uint8Array.prototype.indexOf.call(this, val, byteOffset)
    }
    return arrayIndexOf(this, [ val ], byteOffset, encoding)
  }

  throw new TypeError('val must be string, number or Buffer')
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new Error('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function binaryWrite (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'binary':
        return binaryWrite(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function binarySlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; i--) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; i++) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; i++) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; i++) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; i++) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"base64-js":23,"ieee754":24,"isarray":25}],23:[function(require,module,exports){
'use strict'

exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

function init () {
  var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  for (var i = 0, len = code.length; i < len; ++i) {
    lookup[i] = code[i]
    revLookup[code.charCodeAt(i)] = i
  }

  revLookup['-'.charCodeAt(0)] = 62
  revLookup['_'.charCodeAt(0)] = 63
}

init()

function toByteArray (b64) {
  var i, j, l, tmp, placeHolders, arr
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  placeHolders = b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0

  // base64 is 4/3 + up to two characters of the original data
  arr = new Arr(len * 3 / 4 - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}

},{}],24:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],25:[function(require,module,exports){
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],26:[function(require,module,exports){
(function (Buffer){
var clone = (function() {
'use strict';

/**
 * Clones (copies) an Object using deep copying.
 *
 * This function supports circular references by default, but if you are certain
 * there are no circular references in your object, you can save some CPU time
 * by calling clone(obj, false).
 *
 * Caution: if `circular` is false and `parent` contains circular references,
 * your program may enter an infinite loop and crash.
 *
 * @param `parent` - the object to be cloned
 * @param `circular` - set to true if the object to be cloned may contain
 *    circular references. (optional - true by default)
 * @param `depth` - set to a number if the object is only to be cloned to
 *    a particular depth. (optional - defaults to Infinity)
 * @param `prototype` - sets the prototype to be used when cloning an object.
 *    (optional - defaults to parent prototype).
*/
function clone(parent, circular, depth, prototype) {
  var filter;
  if (typeof circular === 'object') {
    depth = circular.depth;
    prototype = circular.prototype;
    filter = circular.filter;
    circular = circular.circular
  }
  // maintain two arrays for circular references, where corresponding parents
  // and children have the same index
  var allParents = [];
  var allChildren = [];

  var useBuffer = typeof Buffer != 'undefined';

  if (typeof circular == 'undefined')
    circular = true;

  if (typeof depth == 'undefined')
    depth = Infinity;

  // recurse this function so we don't reset allParents and allChildren
  function _clone(parent, depth) {
    // cloning null always returns null
    if (parent === null)
      return null;

    if (depth == 0)
      return parent;

    var child;
    var proto;
    if (typeof parent != 'object') {
      return parent;
    }

    if (clone.__isArray(parent)) {
      child = [];
    } else if (clone.__isRegExp(parent)) {
      child = new RegExp(parent.source, __getRegExpFlags(parent));
      if (parent.lastIndex) child.lastIndex = parent.lastIndex;
    } else if (clone.__isDate(parent)) {
      child = new Date(parent.getTime());
    } else if (useBuffer && Buffer.isBuffer(parent)) {
      child = new Buffer(parent.length);
      parent.copy(child);
      return child;
    } else {
      if (typeof prototype == 'undefined') {
        proto = Object.getPrototypeOf(parent);
        child = Object.create(proto);
      }
      else {
        child = Object.create(prototype);
        proto = prototype;
      }
    }

    if (circular) {
      var index = allParents.indexOf(parent);

      if (index != -1) {
        return allChildren[index];
      }
      allParents.push(parent);
      allChildren.push(child);
    }

    for (var i in parent) {
      var attrs;
      if (proto) {
        attrs = Object.getOwnPropertyDescriptor(proto, i);
      }

      if (attrs && attrs.set == null) {
        continue;
      }
      child[i] = _clone(parent[i], depth - 1);
    }

    return child;
  }

  return _clone(parent, depth);
}

/**
 * Simple flat clone using prototype, accepts only objects, usefull for property
 * override on FLAT configuration object (no nested props).
 *
 * USE WITH CAUTION! This may not behave as you wish if you do not know how this
 * works.
 */
clone.clonePrototype = function clonePrototype(parent) {
  if (parent === null)
    return null;

  var c = function () {};
  c.prototype = parent;
  return new c();
};

// private utility functions

function __objToStr(o) {
  return Object.prototype.toString.call(o);
};
clone.__objToStr = __objToStr;

function __isDate(o) {
  return typeof o === 'object' && __objToStr(o) === '[object Date]';
};
clone.__isDate = __isDate;

function __isArray(o) {
  return typeof o === 'object' && __objToStr(o) === '[object Array]';
};
clone.__isArray = __isArray;

function __isRegExp(o) {
  return typeof o === 'object' && __objToStr(o) === '[object RegExp]';
};
clone.__isRegExp = __isRegExp;

function __getRegExpFlags(re) {
  var flags = '';
  if (re.global) flags += 'g';
  if (re.ignoreCase) flags += 'i';
  if (re.multiline) flags += 'm';
  return flags;
};
clone.__getRegExpFlags = __getRegExpFlags;

return clone;
})();

if (typeof module === 'object' && module.exports) {
  module.exports = clone;
}

}).call(this,require("buffer").Buffer)
},{"buffer":22}],27:[function(require,module,exports){
!function(e){"use strict";var r=require("./lib/createQueryParameterFromConditionsAndIndices.js").createQueryParameterFromConditionsAndIndices,t=require("./lib/analyzeConditionsFromCriteria.js").analyzeConditionsFromCriteria,a=require("./lib/createIndicesFromObjectStore.js").createIndicesFromObjectStore,o=function(e,o,i){return r(t(e,!1),a(o),i&&i.priority?i.priority:[])},i=function(e,r){var t=r||(0,eval)("this").IDBKeyRange,a=null;if(!t)throw new Error("IDBKeyRange is not available.");if(!e.method)return null;switch(e.method[0]){case"only":a=1===e.value1.length?t[e.method[0]](e.value1[0]):t[e.method[0]](e.value1);break;case"upperBound":a=1===e.value1.length?t[e.method[0]](e.value1[0],e.method[1]):t[e.method[0]](e.value1,e.method[1]);break;case"lowerBound":a=1===e.value2.length?t[e.method[0]](e.value2[0],e.method[1]):t[e.method[0]](e.value2,e.method[1]);break;case"bound":a=1===e.value1.length?t[e.method[0]](e.value1[0],e.value2[0],e.method[1],e.method[2]):t[e.method[0]](e.value1,e.value2,e.method[1],e.method[2])}return a};e.criteria2IDBQuery={createQueryParameter:o,createIDBKeyRange:i}}((0,eval)("this").window||this);
},{"./lib/analyzeConditionsFromCriteria.js":30,"./lib/createIndicesFromObjectStore.js":31,"./lib/createQueryParameterFromConditionsAndIndices.js":32}],28:[function(require,module,exports){
!function(t){"use strict";var i=function(){this._keys=[],this._priority_keys=[]};i.prototype.init=function(t,i){for(var r=0,e=t.length;e>r;r+=1)this.set(t[r]);Array.isArray(i)?this._priority_keys=i:""!==i&&null!==i&&void 0!==i&&(this._priority_keys=[i])},i.prototype.set=function(t){this._keys[this._keys.length]={};var i=this._keys.length-1;if(null===t.keyPath)this._keys[i]=[];else if(Array.isArray(t.keyPath))for(var r=0,e=t.keyPath.length;e>r;r+=1)this._keys[i][t.keyPath[r]]=0;else this._keys[i][t.keyPath]=0},i.prototype.calc=function(t){for(var i=0,r=this._keys.length;r>i;i+=1)void 0!==this._keys[i][t]&&(this._keys[i][t]=1)},i.prototype.clone=function(){var t=new i;t._keys=[],t._priority_keys=[];for(var r=0,e=this._keys.length;e>r;r+=1){t._keys[r]||(t._keys[r]={});for(var s in this._keys[r])t._keys[r][s]=0}for(r=0,e=this._priority_keys.length;e>r;r+=1)t._priority_keys[r]=this._priority_keys[r];return t},i.prototype.getResult=function(){for(var t=[],i=0,r=this._keys.length;r>i;i+=1){var e=0,s=0,y=0;for(var n in this._keys[i])e+=1,s+=this._keys[i][n],~this._priority_keys.indexOf(n)&&(y+=1);0!==e&&e===s&&(t[t.length]={index:i,match_num:s,priority_num:y})}return t.sort(function(t,i){return t.priority_num<i.priority_num?1:t.priority_num>i.priority_num?-1:t.match_num<i.match_num?1:t.match_num>i.match_num?-1:0}),t},t.IndexAggregator=i}(this);
},{}],29:[function(require,module,exports){
!function(t){"use strict";var n=function(){this.keys=[],this.conditions=[]};n.prototype.addKeysFromCondition=function(t){"value"!==t.key_type||~this.keys.indexOf(t.left_key)||(this.keys[this.keys.length]=t.left_key)},n.prototype.addCondition=function(t,n){this.addKeysFromCondition(t),n?this.conditions=this.conditions.concat(t.clone().not().normalize()):this.conditions=this.conditions.concat(t.clone().normalize())},n.prototype.merge=function(t){var n=0,o=0;for(n=0,o=t.keys.length;o>n;n+=1)~this.keys.indexOf(t.keys[n])||(this.keys[this.keys.length]=t.keys[n]);for(n=0,o=t.conditions.length;o>n;n+=1)this.conditions[this.conditions.length]=t.conditions[n].clone();return this},n.prototype.clone=function(){var t=new n;t.keys=this.keys.concat();for(var o=0,i=this.conditions.length;i>o;o+=1)t.conditions[o]=this.conditions[o].clone();return t},n.prototype.not=function(){for(var t=[],o=0,i=this.conditions.length;i>o;o+=1){var e=new n;e.addCondition(this.conditions[o],!0),t[t.length]=e}return t},t.Query=n}(this);
},{}],30:[function(require,module,exports){
!function(n){"use strict";var t=require("kriteria").Kriteria||(0,eval)("this").Kriteria,e=require("./Query.js").Query,r=function a(n,r){var c=[],l=[],d=!!(n._not_flg^r),g=null,f=[],h=[],u=null,C=0,s=0;if(d?(c=n.getConditionOr(),l=n.getConditionAnd()):(c=n.getConditionAnd(),l=n.getConditionOr()),c.length>0){for(u=new e,C=0,s=c.length;s>C;C+=1)g=c[C],g.criteria instanceof t?h=o(h,a(g.criteria,d)):!d&&("in"===g.operator||"not_between"===g.operator)||d&&("not_in"===g.operator||"between"===g.operator)?h=o(h,i(g,d)):u.addCondition(g,d);f=f.concat(o([u],h))}if(l.length>0)for(C=0,s=l.length;s>C;C+=1)g=l[C],g.criteria instanceof t?f=f.concat(a(g.criteria,d)):!d&&("in"===g.operator||"not_between"===g.operator)||d&&("not_in"===g.operator||"between"===g.operator)?f=f.concat(i(g,d)):(u=new e,u.addCondition(g,d),f=f.concat([u]));return f},o=function(n,t){var e=[];if(n.length>0&&t.length)for(var r=0,o=n.length;o>r;r+=1)for(var i=0,a=t.length;a>i;i+=1)e[e.length]=n[r].clone().merge(t[i]);else e=0===n.length?t.concat():n.concat();return e},i=function(n,t){for(var r=n.normalize(),o=[],i=0,a=r.length;a>i;i+=1){var c=new e;t?c.addCondition(r[i].not()):c.addCondition(r[i]),o[o.length]=c}return o};n.analyzeConditionsFromCriteria=r}(this);
},{"./Query.js":29,"kriteria":33}],31:[function(require,module,exports){
!function(e){"use strict";var n=function(e){for(var n=[e],t=0,r=e.indexNames.length;r>t;t=t+1|0)n[n.length]=e.index(e.indexNames[t]);return n};e.createIndicesFromObjectStore=n}(this);
},{}],32:[function(require,module,exports){
!function(e){"use strict";var t=require("kriteria").Kriteria||(0,eval)("this").Kriteria,a=require("./IndexAggregator.js").IndexAggregator,l=function(e,l,h){var d=new a,g=0,k=0,o=0,y=0,v=0,p=0,f="",u=[];for(d.init(l,h),g=0,k=e.length;k>g;g+=1){var x=e[g],c=d.clone(),s={store:l[0],method:null,keypath:null,value1:null,value2:null,filter:t.parse({and:x.conditions}).matcher()},m=n(c,x);if(0===m.length)u[u.length]=s;else{var b=[],q=[[],[]],w=[],B=[],A=0;for(o=0,y=m.length;y>o;o+=1){var I=m[o].index,K=[];for(A=l[I],b=[],q=[[],[]],B=[],w=[],v=0,p=x.conditions.length;p>v;v+=1){var P=x.conditions[v],j=A.keyPath.indexOf(P.left_key);~j&&i(P,j,K)}for(f in K)_(K[f],f,{method:w,value:q,method_level:B,target_keypath:b});if(!r(w))break}if(o===m.length&&(b=[],q=[[],[]],B=[],w=[]),w.length>0){var C=[],F=0;for(v=0,p=w.length;p>v;v+=1)void 0!==w[v]&&B[v]>F&&(C=w[v].concat(),F=B[v]);u[u.length]={store:A,method:C,keypath:b,value1:q[0],value2:q[1],filter:t.parse({and:x.conditions}).matcher()}}else u[u.length]=s}}return u},n=function(e,t){for(var a=0,l=t.keys.length;l>a;a+=1)for(var n=0,i=t.conditions.length;i>n;n+=1){var _=t.conditions[n].operator;t.conditions[n].left_key===t.keys[a]&&"value"===t.conditions[n].key_type&&"ne"!==_&&"match"!==_&&"not_match"!==_&&e.calc(t.keys[a])}return e.getResult()},i=function(e,t,a){var l=e.left_key;switch(a[l]||(a[l]={keypath_index:t,val1:null,val2:null,flg_eq:!1,flg_lt:!1,flg_le:!1,flg_gt:!1,flg_ge:!1}),e.operator){case"eq":a[l].flg_eq=!0,a[l].flg_lt=!1,a[l].flg_le=!1,a[l].flg_gt=!1,a[l].flg_ge=!1,a[l].val1=e.right_key[0],a[l].val2=e.right_key[0];break;case"ne":break;case"lt":a[l].flg_eq||(a[l].flg_lt=!0,(null===a[l].val2||a[l].val2>e.right_key[0])&&(a[l].val2=e.right_key[0]));break;case"le":a[l].flg_eq||(a[l].flg_le=!0,a[l].flg_lt=!1,(null===a[l].val2||a[l].val2>e.right_key[0])&&(a[l].val2=e.right_key[0]));break;case"gt":a[l].flg_eq||(a[l].flg_gt=!0,(null===a[l].val1||a[l].val1<e.right_key[0])&&(a[l].val1=e.right_key[0]));break;case"ge":a[l].flg_eq||(a[l].flg_ge=!0,a[l].flg_gt=!1,(null===a[l].val1||a[l].val1<e.right_key[0])&&(a[l].val1=e.right_key[0]));break;case"match":case"not_match":}},_=function(e,t,a){var l=a.method,n=a.value,i=a.method_level,_=a.target_keypath;e.keypath_index>=0&&(void 0===i[e.keypath_index]&&(i[e.keypath_index]=0),e.flg_ge?e.flg_le?(l[e.keypath_index]=["bound",!1,!1],n[0][e.keypath_index]=e.val1,n[1][e.keypath_index]=e.val2,i[e.keypath_index]=2):e.flg_lt?(l[e.keypath_index]=["bound",!0,!1],n[0][e.keypath_index]=e.val1,n[1][e.keypath_index]=e.val2,i[e.keypath_index]=2):i[e.keypath_index]<=1&&(l[e.keypath_index]=["lowerBound",!1],n[1][e.keypath_index]=e.val1,i[e.keypath_index]=3):e.flg_gt?e.flg_le?(l[e.keypath_index]=["bound",!1,!0],n[0][e.keypath_index]=e.val1,n[1][e.keypath_index]=e.val2,i[e.keypath_index]=2):e.flg_lt?(l[e.keypath_index]=["bound",!0,!0],n[0][e.keypath_index]=e.val1,n[1][e.keypath_index]=e.val2,i[e.keypath_index]=2):i[e.keypath_index]<=1&&(l[e.keypath_index]=["lowerBound",!0],n[1][e.keypath_index]=e.val1,i[e.keypath_index]=3):e.flg_le?(l[e.keypath_index]=["upperBound",!1],n[0][e.keypath_index]=e.val2,i[e.keypath_index]=3):e.flg_lt?(l[e.keypath_index]=["upperBound",!0],n[0][e.keypath_index]=e.val2,i[e.keypath_index]=3):e.flg_eq&&(l[e.keypath_index]=["only"],n[0][e.keypath_index]=e.val1,n[1][e.keypath_index]=e.val2,i[e.keypath_index]=1),_[e.keypath_index]=t)},r=function(e){for(var t=!1,a=!1,l=0,n=e.length;n>l;l+=1)switch(e[l][0]){case"lowerBound":t=!0;break;case"upperBound":a=!0}return t&&a?!0:!1};e.createQueryParameterFromConditionsAndIndices=l}(this);
},{"./IndexAggregator.js":28,"kriteria":33}],33:[function(require,module,exports){
arguments[4][17][0].apply(exports,arguments)
},{"./lib/Condition.js":34,"./lib/evaluation.js":35,"./lib/getProperty.js":36,"./lib/matchPrefix.js":37,"dup":17}],34:[function(require,module,exports){
arguments[4][18][0].apply(exports,arguments)
},{"dup":18}],35:[function(require,module,exports){
arguments[4][19][0].apply(exports,arguments)
},{"./Condition.js":34,"dup":19}],36:[function(require,module,exports){
arguments[4][20][0].apply(exports,arguments)
},{"dup":20}],37:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21}]},{},[1]);
