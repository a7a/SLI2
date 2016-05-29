!function(t){"use strict";var e=(0,eval)("this"),i=require("../param/Error.js").ERROR,s=require("./Querable.js").Querable,_=require("Kriteria").Kriteria||e.Kriteria,n=require("./SelectionAggregator.js").SelectionAggregator,r=require("./arraySortWithObjectElement.js").arraySortWithObjectElement,l=require("./arrayUniqueMerge.js").arrayUniqueMerge,o=require("./setFunction.js").setFunction,h=require("./asyncLoop.js").asyncLoop,a=require("./SyncPromise.js").SyncPromise,u=require("clone"),c=function(){s.apply(this,arguments),this._check_arguments=!0,this._set_select=!1,this._set_from=!1,this._set_as=!1,this._set_insert=!1,this._set_delete=!1,this._set_update=!1,this._set_set=!1,this._set_join=!1,this._set_where=!1,this._set_group_by=!1,this._set_having=!1,this._set_order_by=!1,this._set_limit=!1,this._limit_num=0,this._set_offet=!1,this._ready_offset=!1,this._offset_num=0,this._selection=null,this._select_table="",this._table_alias="",this._select_input_query=null,this._select_input_array=null,this._insert_table="",this._insert_columns=[],this._delete_table="",this._update_table="",this._update_data="",this._joins=[],this._where=null,this._groupings=[],this._having=null,this._orderings=[],this._insert_array_values=[],this._insert_object_values=[],this._union_queries=[],this._union_all_queries=[],this._must_be_select=!1};c.prototype=Object.create(s.prototype,{constructor:{value:c,enumerable:!0,writable:!1,configurable:!0}}),c.prototype.isSelectQuery=function(){return!(this._set_insert||!this._set_select||!this._set_from)},c.prototype.isInsertQuery=function(){return!!this._set_insert},c.prototype.isDeleteQuery=function(){return!!this._set_delete},c.prototype.isUpdateQuery=function(){return!!this._set_update},c.prototype.forceSelectQuery=function(t){this._must_be_select=t},c.prototype.addUnions=function(t,e){for(var i=t.getUnions(e),s=[],_=0,n=i.length;n>_;_+=1)s[s.length]=i[_];s[s.length]=t,"union"===e?this._union_queries=s:"union_all"===e&&(this._union_all_queries=s),t.clearUnions(e)},c.prototype.getUnions=function(t){return"union"===t?this._union_queries:"union_all"===t?this._union_all_queries:[]},c.prototype.clearUnions=function(t){"union"===t?this._union_queries=[]:"union_all"===t&&(this._union_all_queries=[])},c.prototype.getTableName=function(){return this.isInsertQuery()?this._insert_table:this._select_input_query?this._table_alias||"":this.isSelectQuery()?this._table_alias||this._select_table||"":this.isDeleteQuery()?this._delete_table:this.isUpdateQuery()?this._update_table:""},c.prototype.getTableNames=function(){var t=[];this._select_table&&(t[t.length]=this._select_table),this._table_alias&&(t[t.length]=this._table_alias);for(var e=0,i=this._joins.length;i>e;e+=1){var s=this._joins[e][3];s&&(t[t.length]=s)}return t},c.prototype.select=function(t){if(this._set_select||this._set_values||this._set_delete||this._set_update)throw i.invalid_description("select");if(this._check_arguments&&0!==arguments.length&&1!==arguments.length&&"function"!=typeof t&&void 0!==t)throw i.invalid_argument("select");return this._set_select=!0,this._selection=t,this},c.prototype.from=function(){if(!this._set_select||this._set_from||this._set_join||this._set_where||this._set_group_by||this._set_having||this._set_order_by||this._set_limit)throw i.invalid_description("from");if(this._check_arguments&&0===arguments.length)throw i.invalid_argument("from");this._set_from=!0;for(var t=0,e=arguments.length;e>t;t+=1){var s=arguments[t];if("string"==typeof s||s instanceof String)0===t?this._select_table=s:this.join(s);else if(s instanceof c){if(!s.isSelectQuery())throw i.invalid_argument("from");0===t?this._select_input_query=s:this.join(s)}else if(Array.isArray(s))0===t?(this._select_input_array=s,this._table_alias="left"):this.join(s);else for(var _ in s)0===t?(this._select_table=_,this.as(s[_])):this.join(_).as(s[_])}return this},c.prototype.as=function(t){if(!this._set_select||!this._set_from&&!this._set_join||this._set_as||this._set_where||this._set_group_by||this._set_having||this._set_order_by||this._set_limit)throw i.invalid_description("as");if(this._check_arguments&&!("string"==typeof t||t instanceof String&&""!==t))throw i.invalid_argument("as");return this._set_as=!0,this._set_join?this._joins[this._joins.length-1]&&(this._joins[this._joins.length-1][3]=t):this._table_alias=t,this},c.prototype.insert_into=c.prototype.insertInto=function(t,e){if(this._must_be_select||this._set_select||this._set_insert||this._set_delete||this._set_update)throw i.invalid_description("insert_into");if(this._check_arguments&&1!==arguments.length&&2!==arguments.length)throw i.invalid_argument("insert_into");return this._set_insert=!0,this._insert_table=t,Array.isArray(e)&&e.length>0&&(this._insert_columns=e),this},c.prototype.delete_from=c.prototype.deleteFrom=function(t){if(this._must_be_select||this._set_select||this._set_insert||this._set_delete||this._set_update)throw i.invalid_description("delete_from");if(this._check_arguments&&1!==arguments.length)throw i.invalid_argument("delete_from");return this._set_delete=!0,this._delete_table=t,this},c.prototype.update=function(t){if(this._must_be_select||this._set_select||this._set_insert||this._set_delete||this._set_update)throw i.invalid_description("update");if(this._check_arguments&&1!==arguments.length)throw i.invalid_argument("update");return this._set_update=!0,this._update_table=t,this},c.prototype.set=function(t){if(!this._set_update)throw i.invalid_argument("set");if(this._check_arguments&&1!==arguments.length)throw i.invalid_argument("set");return this._set_set=!0,this._update_data=t,this},c.prototype.join=function(t,e,s){if(!this._set_select||!this._set_from||this._set_where||this._set_group_by||this._set_having||this._set_order_by||this._set_limit)throw i.invalid_description("join");if(this._check_arguments&&(0===arguments.length||arguments.length>3))throw i.invalid_argument("join");var n=null,r=s||"inner";arguments.length>=2&&("function"==typeof e?(n=new _,e(n)):e instanceof _&&(n=e)),this._set_join=!0,this._set_as=!1;var l=this._joins.length;if(t instanceof c)this._joins[l]=[t,n,null,"",r];else if("string"==typeof t||t instanceof String)this._joins[l]=[new c(this._sli2_object).select().from(t),n,null,t,r];else if(Array.isArray(t))this._joins[l]=[null,n,t,"right_"+(l+1),r];else if(this._check_arguments)throw i.invalid_argument("join");return this},c.prototype.inner_join=c.prototype.innerJoin=function(t,e){return this.join(t,e,"inner")},c.prototype.left_join=c.prototype.leftJoin=function(t,e){return this.join(t,e,"left")},c.prototype.right_join=c.prototype.rightJoin=function(t,e){return this.join(t,e,"right")},c.prototype.where=function(t){if(!(this._set_select&&this._set_from||this._set_delete||this._set_update&&this._set_set)||this._set_where||this._set_group_by||this._set_having||this._set_order_by||this._set_limit)throw i.invalid_description("where");if(this._check_arguments&&1!==arguments.length)throw i.invalid_argument("where");var e=null;return"function"==typeof t?(e=new _,t(e)):e=t,this._set_where=!0,this._where=e,this},c.prototype.group_by=c.prototype.groupBy=function(){if(!this._set_select||!this._set_from||this._set_group_by||this._set_order_by||this._set_having||this._set_limit)throw i.invalid_description("group_by");if(this._check_arguments&&(0===arguments.length||Array.isArray(arguments[0])&&0===arguments[0].length))throw i.invalid_argument("group_by");var t=0,e=0;if(this._set_group_by=!0,this._groupings=[],Array.isArray(arguments[0]))for(t=0,e=arguments[0].length;e>t;t+=1)this._groupings[this._groupings.length]=arguments[0][t];else for(t=0,e=arguments.length;e>t;t+=1)this._groupings[this._groupings.length]=arguments[t];return this},c.prototype.having=function(t){if(!(this._set_select&&this._set_from&&this._set_group_by)||this._set_order_by||this._set_having||this._set_limit)throw i.invalid_description("having");if(this._check_arguments&&1!==arguments.length)throw i.invalid_argument("having");var e=null;return"function"==typeof t?(e=new _,t(e)):e=t,this._set_having=!0,this._having=e,this},c.prototype.union=function(){if(!this.isSelectQuery()||this._set_order_by||this._set_limit||this._union_all_queries.length>0)throw i.invalid_description("union");var t=new c(this._sli2_object);return t.forceSelectQuery(!0),t.addUnions(this,"union"),t},c.prototype.union_all=c.prototype.unionAll=function(){if(!this.isSelectQuery()||this._set_order_by||this._set_limit||this._union_queries.length>0)throw i.invalid_description("union_all");var t=new c(this._sli2_object);return t.forceSelectQuery(!0),t.addUnions(this,"union_all"),t},c.prototype.order_by=c.prototype.orderBy=function(){if(!this._set_select||!this._set_from||this._set_order_by||this._set_limit)throw i.invalid_description("order_by");if(this._check_arguments&&(0===arguments.length||Array.isArray(arguments[0])&&0===arguments[0].length))throw i.invalid_argument("order_by");var t=0,e=0;if(this._set_order_by=!0,this._orderings=[],Array.isArray(arguments[0]))for(t=0,e=arguments[0].length;e>t;t+=1)this._orderings[this._orderings.length]=arguments[0][t];else for(t=0,e=arguments.length;e>t;t+=1)this._orderings[this._orderings.length]=arguments[t];return this},c.prototype.limit=function(t,e){if(!this._set_select||!this._set_from||this._set_limit)throw i.invalid_description("limit");if(this._check_arguments&&0===arguments.length||arguments.length>2||arguments.length>0&&(Number.isNaN(+arguments[0])||arguments[0]<0)||arguments.length>1&&(Number.isNaN(+arguments[1])||arguments[1]<0))throw i.invalid_argument("limit");return this._set_limit=!0,1===arguments.length?this._limit_num=0|t:2===arguments.length&&(this._offset_num=0|t,this._limit_num=0|e),this},c.prototype.offset=function(t){if(!this._set_limit||this._set_offet)throw i.invalid_description("offset");if(this._check_arguments&&1===arguments.length&&(Number.isNaN(+arguments[0])||arguments[0]<0))throw i.invalid_argument("offset");return this._set_offet=!0,this._offset_num=t,this},c.prototype.values=function(){if(!this._set_insert||this._set_values)throw i.invalid_description("values");if(this._check_arguments&&(0===arguments.length||Array.isArray(arguments[0])&&0===arguments[0].length))throw i.invalid_argument("values");var t=!1,e=0,s=0;for(this._set_values=!0,this._insert_array_values=[],this._insert_object_values=[],e=0,s=arguments.length;s>e;e+=1){var _=arguments[e];if(Array.isArray(_))this._insert_array_values[this._insert_array_values.length]=_;else{if(_.constructor!==Object){t=!0;break}this._insert_object_values[this._insert_object_values.length]=_}}if(t)for(this._insert_array_values=[[]],this._insert_object_values=[],e=0,s=arguments.length;s>e;e+=1)this._insert_array_values[0][e]=arguments[e];return this},c.prototype._isRunnable=function(){return this._set_select&&this._set_from||this._set_insert||this._set_delete||this._set_update&&this._set_set},c.prototype.exec=function(t,e,s){if(!this._isRunnable())throw i.invalid_description("exec");var c=this,f=this._sli2_object,g="function"==typeof e?e:function(){},p="function"==typeof s?s:function(){},d=[],y=0,b=0,m=0,v=0,w=0,j=0;if(void 0===f||null===f)throw i.querable_is_not_initialized;var A=function(){g()},q=function(t){return function(e){p(i.dml_exec_error(t+" / "+e.message))}},Q=function(){},k="function"==typeof t?t:A;if(c.isInsertQuery()){if(Q=q("insert_into"),!f.tables[c._insert_table])return void Q(i.table_not_exist(c._insert_table));if(c._insert_array_values.length>0||c._insert_object_values.length>0){var S=[];if(c._insert_array_values.length>0)if(c._insert_columns.length>0)for(y=0,b=c._insert_array_values.length;b>y;y+=1)for(S[y]={},m=0,v=c._insert_columns.length;v>m;m+=1)S[y][c._insert_columns[m]]=c._insert_array_values[y][m];else Q(new Error("unsupported command."));if(c._insert_object_values.length>0)for(y=0,b=c._insert_object_values.length;b>y;y+=1)S[S.length]=c._insert_object_values[y];f.tables[c._insert_table].add(S,function(t){k(t,A,Q)},Q)}else Q(c._set_select?new Error("unsupported command."):i.invalid_description("insert_into"))}else if(c.isDeleteQuery()){if(Q=q("delete_from"),!f.tables[c._delete_table])return void Q(i.table_not_exist(c._delete_table));c._where?f.tables[c._delete_table].removeForQuery(c._where,function(t){k(t,A,Q)},Q):f.tables[c._delete_table].removeAll(function(t){k(t,A,Q)},Q)}else if(c.isUpdateQuery()){if(!f.tables[c._update_table])return void Q(i.table_not_exist(c._update_table));c._where?f.tables[c._update_table].updateForQuery(c._where,c._update_data,function(t){k(t,A,Q)},Q):f.tables[c._update_table].updateAll(c._update_data,function(t){k(t,A,Q)},Q)}else if(c.isSelectQuery()){Q=q("select");var N=[],W={},U=null,x=null,J=null,O="";if(this._where)if(N=this.getTableNames(),W=this._where.splitByKeyPrefixes(N)){W[this._select_table]&&W[this._table_alias]&&Q(i.kriteria_prefix_conflict(this._select_table,this._table_alias));var R=new _,E=0;if(W[c._select_table]||W[c._table_alias]){U=W[c._select_table]||W[c._table_alias];for(O in W)W[O]&&O!==c._select_table&&O!==c._table_alias&&("else"===O?J=W[O]:(E+=1,R=R.merge(W[O])));E>0&&(x=R)}else{U=W["else"];for(O in W)W[O]&&("else"===O?J=W[O]:(E+=1,R=R.merge(W[O])));E>0&&(x=R)}}else J=this._where;new a(function(t,e){if(c._select_table){if(!f.tables[c._select_table])return void Q(i.table_not_exist(c._select_table));W[c._select_table]?f.tables[c._select_table].selectForQuery(U,W[c._select_table]?c._select_table:c._tablea_alias,c._table_alias||(c._joins.length>0?c._select_table:""),function(e){A(),t(e)},e):f.tables[c._select_table].selectAll(c._joins.length>0?c._table_alias||c._select_table:c._table_alias,function(e){A(),t(e)},e)}else if(c._select_input_query)c._select_input_query.run(function(e,i){var s=[];if(c._table_alias)for(y=0,b=e.length;b>y;y+=1)s[y]={},s[y][c._table_alias]=e[y];else s=e;A(),t(s),i()});else if(c._select_input_array){var s=[];if(U){var _=null;if(0===c._joins.length?W[c._table_alias]&&W["else"]?_=o.setWithNoJoinAndAliasWhere:W[c._table_alias]&&!W["else"]?_=o.setWithNoJoinAndAliasWhere:!W[c._table_alias]&&W["else"]&&(_=o.setWithNoJoinAndNoAliasWhere):W[c._table_alias]&&W["else"]?_=o.setWithHasJoinAndAliasWhere:W[c._table_alias]&&!W["else"]?_=o.setWithHasJoinAndAliasWhere:!W[c._table_alias]&&W["else"]&&(_=o.setWithHasJoinAndNoAliasWhere),null===_)s=c._select_input_array;else for(y=0,b=c._select_input_array.length;b>y;y+=1)_(c._select_input_array[y],s,U,c._table_alias)}else if(0===c._joins.length)s=c._select_input_array;else for(y=0,b=c._select_input_array.length;b>y;y+=1){var n={};n[c._table_alias]=c._select_input_array[y],s[s.length]=n}A(),t(s)}else e(i.invalid_description("select"))}).then(function(t){return new a(function(e,s){var _=[];if(0===c._joins.length)e(t);else{var n=t,r=0;h(c._joins,function(t,e){var l=t[0],o=t[1],h=t[2],c=t[3],f=t[4],g={},p=0,d=[],A=[],q="",Q="",k=[];_=[],r+=1,new a(function(t,e){l&&l.isSelectQuery?l.run(function(e,i){i(),t([e,c||""])}):h?t([h,c]):e(i.reqire_select_query)}).then(function(t){var i=t[0],s=t[1];if("inner"===f){for(y=0,b=n.length;b>y;y+=1)for(m=0,v=i.length;v>m;m+=1){if(g=u(n[y]),s)g[s]=i[m];else for(k=Object.keys(i[1]),w=0,j=k.length;j>w;w+=1)O=k[w],g[O]=i[m][O];o&&!o.match(g)||(_[_.length]=u(g))}n=_}else if("left"===f||"right"===f){for("left"===f?(d=n,A=i,q="",Q=s):(d=i,A=n,q=s,Q=""),y=0,b=d.length;b>y;y+=1){for(p=0,m=0,v=A.length;v>m;m+=1){if(g={},q?g[q]=u(d[y]):g=u(d[y]),Q)g[Q]=u(A[m]);else for(k=Object.keys(A[m]),w=0,j=k.length;j>w;w+=1)O=k[w],g[O]=A[m][O];o&&!o.match(g)||(_[_.length]=u(g),p+=1)}0===p&&(g={},q?g[q]=d[y]:g=d[y],_[_.length]=u(g))}n=_,d=[],A=[]}e()})["catch"](function(t){s(t)})}).then(function(){n=[],e(_)})}}).then(function(t){var e=[];if(x){for(y=0,b=t.length;b>y;y+=1)x.match(t[y])&&(e[e.length]=t[y]);return e}return t}).then(function(t){var e=n.createAggregationOperator(c._groupings);if(c._selection){for(y=0,b=t.length;b>y;y+=1)c._selection(e,t[y]),e.aggregate();return e.getResult()}if(c._groupings.length>0){var i=function(t,e){for(O in e)t(e[O]).as(O)};for(y=0,b=t.length;b>y;y+=1)i(e,t[y]),e.aggregate();return e.getResult()}return t}).then(function(t){var e=[];if(J){for(y=0,b=t.length;b>y;y+=1)J.match(t[y])&&(e[e.length]=t[y]);return e}return t}).then(function(t){var e=[];if(c._having)for(y=0,b=t.length;b>y;y+=1)c._having.match(t[y])&&(e[e.length]=t[y]);else e=t;return e}).then(function(t){if(c._orderings.length>0&&(t=r(t,c._orderings)),c._limit_num>0){var e=[];for(y=0+c._offset_num,b=c._limit_num+c._offset_num;b>y&&!(b>t.length);y+=1)e[e.length]=t[y];t=e,e=[]}return t}).then(function(t){return new a(function(e,i){c._union_queries.length>0?h(c._union_queries,function(t,e){t.run(function(t){d=l(d,t),e()})["catch"](function(t){i(t)})}).then(function(){d=l(d,t),e(d)}):c._union_all_queries.length>0?h(c._union_all_queries,function(t,e){t.run(function(t){for(y=0,b=t.length;b>y;y+=1)d[d.length]=t[y];e()})["catch"](function(t){i(t)})}).then(function(){for(y=0,b=t.length;b>y;y+=1)d[d.length]=t[y];e(d)}):e(t)})}).then(function(t){k(t,function(){},q("select - run process"))})["catch"](q("select - promise"))})["catch"](function(t){Q(t)})}},t.Dml=c}(this);