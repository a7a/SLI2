/* setFunction.js */

(function(cxt) {
  "use strict";

  var setFunction = {
    // for SLI2Operator
    setWithTableNameAndAlias: function setWithTableNameAndAlias(_data, _out, _filter, _table_name, _alias) {
      var data_with_table_name = {};
      data_with_table_name[_table_name] = _data;

      if(_filter(data_with_table_name)) {
        var data_with_alias = {};
        data_with_alias[_alias] = _data;
        _out[_out.length] = data_with_alias;

        return true;
      }

      return false;
    },
    setWithTableName: function setWithTableName(_data, _out, _filter, _table_name) {
      var data_with_table_name = {};
      data_with_table_name[_table_name] = _data;

      if(_filter(data_with_table_name)) {
        _out[_out.length] = _data;

        return true;
      }

      return false;
    },
    setWithAlias: function setWithAlias(_data, _out, _filter, _table_name, _alias) {
      if(_filter(_data)) {
        var data_with_alias = {};
        data_with_alias[_alias] = _data;
        _out[_out.length] = data_with_alias;

        return true;
      }

      return false;
    },
    setWithNoTableNameAndNoAlias: function setWithNoTableNameAndNoAlias(_data, _out, _filter) {
      if(_filter(_data)) {
        _out[_out.length] = _data;

        return true;
      }

      return false;
    },
    // for Dml
    setWithNoJoinAndAliasWhere: function setWithNoJoinAndAliasWhere(_data, _out, _where, _alias) {
      var data_with_alias = {};
      data_with_alias[_alias] = _data;

      if(_where.match(data_with_alias)) {
        _out[_out.length] = _data;

        return true;
      }

      return false;
    },
    setWithHasJoinAndAliasWhere: function setWithHasJoinAndAliasWhere(_data, _out, _where, _alias) {
      var data_with_alias = {};
      data_with_alias[_alias] = _data;

      if(_where.match(data_with_alias)) {
        _out[_out.length] = data_with_alias;

        return true;
      }

      return false;
    },
    setWithNoJoinAndNoAliasWhere: function setWithNoJoinAndNoAliasWhere(_data, _out, _where) {
      if(_where.match(_data)) {
        _out[_out.length] = _data;

        return true;
      }

      return false;
    },
    setWithHasJoinAndNoAliasWhere: function setWithHasJoinAndNoAliasWhere(_data, _out, _where, _alias) {
      if(_where.match(_data)) {
        var data_with_alias = {};
        data_with_alias[_alias] = _data;

        _out[_out.length] = data_with_alias;

        return true;
      }

      return false;
    },
    setWithNoJoinAndNoWhere: function setWithNoJoinAndNoWhere(_data, _out) {
      _out[_out.length] = _data;

      return true;
    },
    setWithHasJoinAndNoWhere: function setWithHasJoinAndNoWhere(_data, _out, _where, _alias) {
      var data_with_alias = {};
      data_with_alias[_alias] = _data;

      _out[_out.length] = data_with_alias;

      return true;
    }
  };


  cxt.setFunction = setFunction;

}(this));
