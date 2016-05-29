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
