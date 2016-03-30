/* Querable.js */

(function(cxt) {
  "use strict";

  var ERROR = require("../param/ERROR.js").ERROR;


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
