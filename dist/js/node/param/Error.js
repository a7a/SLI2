/* ERROR.js */

(function(cxt) {
  "use strict";

  var ERROR = {
    not_open:
      new Error("SLII is not open."),
    already_open:
      new Error("SLII is already opened."),
    closed:
      new Error("SLII is already closed."),
    no_version_map: function(version) {
      return new Error("SLII has no version-map (" + version + ")");
    },
    no_definition: function(version) {
      return new Error("SLII has no version-definition (" + version + ")");
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
        return new Error("SLII has no transaction('" + name + "')");
      } else {
        return new Error("SLII has no transaction.");
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
    idb_objects_not_used: new Error("IDB objects not used(not exec SLII#useIndexedDB)."),
    mode_is_no_idb: new Error("SLII mode is 'no_idb'."),
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
    querable_is_not_initialized: new Error("Dml is not initialized (no SLII object)."),
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
