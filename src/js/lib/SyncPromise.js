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
