(function(cxt) {
  "use strict";

  var ng_count = 0;

  var getValue = function getValue(name) {
    if(name === "ng_count") {
      return ng_count;
    } else {
      return null;
    }
  };

  var write = function write(x) {
    document.getElementById("result").innerHTML = x
      + "<br>"
      + document.getElementById("result").innerHTML;
  };

  var test = function test(name, proc) {
    var ret = "",
        result = false;

    ret += name + " start<br>";

    return new Promise(function(fulfill) {
      proc(function(result) {
        if(!result) {
          ng_count++;
        }
        ret += result ? "OK" : "NG";
        ret += "<br>";

        ret += name + " end<br>";

        write(ret);

        fulfill();
      });
    });
  };

  var match_array = function match_array(arr1, arr2) {
    if(arr1.length !== arr2.length) {
      return false;
    }

    for(var i = 0, l = arr1.length; i < l; i = i + 1) {
      if(arr1[i] !== arr2[i]) {
        return false;
      }
    }

    return true;
  };

  var match_object = function match_object(obj1, obj2) {
    var keys1 = Object.keys(obj1),
        keys2 = Object.keys(obj2);

    if(keys1.length !== keys2.length) {
      return false;
    }

    for(var i = 0, l = keys1.length; i < l; i = i +1) {
      var key = keys1[i];

      if(obj1[key] !== obj2[key]) {
        return false;
      }
    }

    return true;
  };


  cxt.getValue = getValue;
  cxt.write = write;
  cxt.test = test;
  cxt.match_array = match_array;
  cxt.match_object = match_object;

}((0,eval)("this")))
