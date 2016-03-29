/* SLII.js */

(function(cxt) {
  "use strict";

  var idbInit = require("./lib/idbInit.js").idbInit,
      Dml = require("./lib/Dml.js").Dml,
      Ddl = require("./lib/Ddl.js").Ddl,
      DatabaseDefinition = require("./lib/DatabaseDefinition.js").DatabaseDefinition,
      Table = require("./lib/Table.js").Table,
      Tasker = require("./lib/Tasker.js").Tasker,
      ERROR = require("./param/ERROR.js").ERROR;

  /**
  * @public
  * @class
  * @param {String} name - database name
  * @param {Object} opt - option
  *   opt.mode {String} -
  */
  var SLII = function SLII(name, opt) {
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
  SLII.USE_IDB = "idb";
  SLII.NO_IDB = "no_idb";
  SLII.READ_WRITE = "readwrite";
  SLII.READ_ONLY = "readonly";
  SLII.DEFAULT_UPGRADING_HANDLER = "slii_upgrade";
  SLII.DEFAULT_TRANSACTION_HANDLER = "slii_transaction";

  /**
  * @public
  * @function
  * @returns {void}
  */
  SLII.prototype.useIndexedDB = function useIndexedDB() {
    this._idb_objects = idbInit();

    if(this._idb_objects === null) {
      throw ERROR.idb_objects_not_exists;

    } else {
      if(this._mode === SLII.NO_IDB) {
        this._opened = false;
      }
      this._mode = SLII.USE_IDB;
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
  SLII.prototype.setMode = function setMode(mode) {
    if(mode === SLII.USE_IDB) {
      this.useIndexedDB();

    } else if(mode === SLII.NO_IDB) {
      this._mode = SLII.NO_IDB;
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
  SLII.createDatabaseDefinition = function createDatabaseDefinition() {
    return new DatabaseDefinition();
  };

  /**
  * @public
  * @funciton
  * @param {String} name - database name
  * @param {Function} block_proc - request blocking process
  * @returns {Promise}
  */
  SLII.prototype.deleteDatabase = function deleteDatabase(name, block_proc) {
    var that = this;

    return new Promise(function(fulfill, reject) {
      if(that._mode === SLII.NO_IDB) {
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
  SLII.prototype._initTables = function _initTables() {
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
  SLII.prototype._openTables = function _openTables(tra, handling, tables) {
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
  SLII.prototype._closeTables = function _closeTables(handling, tables) {
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
  SLII.prototype._destroyTables = function _destroyTables() {
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
  SLII.prototype._initInOpen = function _initInOpen(db) {
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
  SLII.prototype.isUpgrading = function isUpgrading() {
    return this._upgrading;
  };

  /**
  * @public
  * @funciton
  * @returns {Boolean}
  */
  SLII.prototype.isTransacting = function isTransacting() {
    return this._transacting;
  };

  /**
  * @public
  * @function
  * @param {DatabaseDefinition} db_def
  * @returns {Promise}
  */
  SLII.prototype.open = function open(db_def) {
    var that = this,
        req = null,
        version_map = [],
        seq = [],
        map = {},
        i = 0, l = 0;

    return new Promise(function(fulfill, reject) {
      var error = null;

      if(that._mode === SLII.NO_IDB) {
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
  SLII.prototype.close = function close() {
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
  SLII.prototype.destroy = function destroy() {
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
  SLII.prototype.getCurrentVersion = function getCurrentVersion() {
    return this._version;
  };

  /**
  * @public
  * @function
  * @returns {Number}
  */
  SLII.prototype.getNewVersion = function getNewVersion() {
    if(this._mode === SLII.NO_IDB) {
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
  SLII.prototype.begin_transaction =
  SLII.prototype.beginTransaction = function beginTransaction(table_names, type, func) {
    var that = this;

    return new Promise(function(fulfill, reject) {
      var _table_names = [],
          _tables = {},
          i = 0, l = 0;

      var destroy = function() {
        that.transaction = null;
        that._transacting = false;

        try {
          that._closeTables("slii_transaction", _tables);

        } catch(err) {
          reject(err);
        }
      };

      if(Array.isArray(table_names)) {
        _table_names = table_names;
      } else {
        _table_names[0] = table_names;
      }

      if(that._mode === SLII.NO_IDB) {
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
          that._openTables(tra, "slii_transaction", _tables);

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
  SLII.prototype.upgrade = function upgrade(exec, end) {
    var that = this;

    return new Promise(function(fulfill, reject) {
      var _exec = typeof exec === "function" ? exec : function() {},
          _end = typeof end === "function" ? end : function() {};

      if(that._mode === SLII.NO_IDB) {
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
          that._openTables(tra, "slii_upgrade");

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
          that._closeTables("slii_upgrade");

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
  SLII.prototype.addTask = function addTask(obj, func) {
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
  SLII.prototype.runQueue = function runQueue() {
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
  SLII.prototype.create_table =
  SLII.prototype.createTable = function createTable(name, opt) {
    var _opt = opt ? opt : { autoIncrement: true };

    if(this._mode === SLII.NO_IDB) {
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
  SLII.prototype.drop_table =
  SLII.prototype.dropTable = function dropTable(name) {
    if(this._mode === SLII.NO_IDB) {
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
  SLII.prototype.create_index =
  SLII.prototype.createIndex = function createIndex(table_name, idx_name, opt) {
    if(this._mode === SLII.NO_IDB) {
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
  SLII.prototype.drop_index =
  SLII.prototype.dropIndex = function dropIndex(table_name, idx_name) {
    if(this._mode === SLII.NO_IDB) {
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
  SLII.prototype.select = function select(selection) {
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
  SLII.prototype.insert_into =
  SLII.prototype.insertInto = function insert_into(table, columns) {
    if(this._mode === SLII.NO_IDB) {
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
  SLII.prototype.delete_from =
  SLII.prototype.deleteFrom = function delete_from(table) {
    if(this._mode === SLII.NO_IDB) {
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
  SLII.prototype.update = function update(table) {
    if(this._mode === SLII.NO_IDB) {
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
  SLII.prototype.rollback = function rollback() {
    if(this._mode === SLII.NO_IDB) {
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


  cxt.SLII = SLII;

})((0, eval)("this").window || this);
