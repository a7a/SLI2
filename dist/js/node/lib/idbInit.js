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
