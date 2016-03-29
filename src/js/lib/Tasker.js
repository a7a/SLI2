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
