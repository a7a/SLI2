/* DatabaseDefinition */

(function(cxt) {
  "use strict";

  var ERROR = require("../param/Error.js").ERROR;

  /**
  * @public
  * @class
  */
  var DatabaseDefinition = function DatabaseDefinition() {
    this._version_maps = [];
    this._version_procs = {};
  };

  /**
  * @public
  * @function
  * @param {Number} version -
  * @param {Function} proc -
  * @returns {void}
  */
  DatabaseDefinition.prototype.setVersion = function setVersion(version, proc) {
    var _version = +version;

    if(Number.isNaN(_version) || _version <= 0) {
      throw ERROR.invalid_version_number(version);
    }
    if(typeof proc !== "function") {
      throw ERROR.is_not_function("arguments[2]:proc");
    }

    this._version_procs[_version] = proc;
  };

  /**
  * @public
  * @function
  * @param {any[]} -
  * @returns {void}
  */
  DatabaseDefinition.prototype.defineVersionMap = function defineVersionMap() {
    this._version_maps = [];

    for(var i = 0, l = arguments.length; i < l; i = i + 1) {
      if(!Array.isArray(arguments[i])) {
        throw ERROR.is_not_array("arguments[" + i + "] of defineVersionMap");
      }

      for(var j = 0, l2 = arguments[i].length; j < l2; j = j + 1) {
        var version = arguments[i][j],
            _version = +version;

        if(Number.isNaN(_version) || _version <= 0) {
          throw ERROR.invalid_version_number(version);
        }

        this._version_maps[this._version_maps.length] = arguments[i];
      }
    }
  };

  /**
  * @public
  * @function
  * @param {Number} n -
  * @returns {Boolean}
  */
  DatabaseDefinition.prototype.isLatestVersion = function isLatestVersion(n) {
    var _version_maps = this._version_maps;

    if(_version_maps.length > 0) {
      // has version map
      for(var i = 0, l = _version_maps.length; i < l; i = i + 1) {
        var _version_map = _version_maps[i];

        if(_version_map[_version_map.length - 1] === n) {
          return true;
        }
      }

      return false;

    } else {
      // no version map
      return this.getLatestVersionOfDefinition() === n ? true : false;
    }
  };

  /**
  * @public
  * @function
  * @param {Number} n -
  * @return {Object}
  */
  DatabaseDefinition.prototype.getVersionMapStartWithVersion = function getVersionMapStartWithVersion(n) {
    var _version_maps = this._version_maps,
        ret = { seq: [], map: {} };

    if(_version_maps.length > 0) {
      // has version map
      for(var i = 0, l = _version_maps.length; i < l; i = i + 1) {
        var _version_map = _version_maps[i],
            index = _version_map.indexOf(n);

        if(!!~index) {
          for(var j = index, l2 = _version_map.length; j < l2; j = j + 1) {
            var map_index = _version_map[j];

            ret.map[map_index] = this._version_procs[map_index];
            ret.seq[ret.seq.length] = map_index;
          }

          ret.seq.sort();

          return ret;
        }
      }

      return null;

    } else {
      // no version map
      for(var k in this._version_procs) {
        var _k = +k;

        if(n <= _k) {
          ret.map[k] = this._version_procs[k];
          ret.seq[ret.seq.length] = _k;
        }
      }

      ret.seq.sort();

      return ret;
    }
  };

  /**
  * @public
  * @function
  * @returns {Number}
  */
  DatabaseDefinition.prototype.getLatestVersionOfDefinition = function getLatestVersionOfDefinition() {
    var latest_version = 0;

    for(var k in this._version_procs) {
      var _k = +k;

      if(latest_version < _k) {
        latest_version = _k;
      }
    }

    return latest_version;
  };

  /**
  * @public
  * @function
  * @param {Number} n -
  * @returns {Number}
  */
  DatabaseDefinition.prototype.getLatestVersionForVersion = function getLatestVersionForVersion(n) {
    var _version_maps = this._version_maps;

    if(_version_maps.length > 0) {
      // has version map
      for(var i = 0, l = _version_maps.length; i < l; i = i + 1) {
        var _version_map = _version_maps[i];

        if(!!~_version_map.indexOf(n)) {
          return _version_map[_version_map.length - 1];
        }
      }

      return null;

    } else {
      // no version map
      return this.existVersionInDefinition(n) || n === 1 ? this.getLatestVersionOfDefinition() : null;
    }

  };

  /**
  * @public
  * @function
  * @param {Number} n -
  * @returns {Boolean}
  */
  DatabaseDefinition.prototype.existVersionInDefinition = function existVersionInDefinition(n) {
    var ret = false,
        _n = +n;

    for(var k in this._version_procs) {
      if(+k === _n) {
        ret = true;
        break;
      }
    }

    return ret;
  };

  cxt.DatabaseDefinition = DatabaseDefinition;

}(this));
