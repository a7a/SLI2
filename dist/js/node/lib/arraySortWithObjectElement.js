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

