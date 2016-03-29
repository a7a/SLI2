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
