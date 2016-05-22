!function(e){"use strict";var t=require("./lib/idbInit.js").idbInit,n=require("./lib/Dml.js").Dml,o=require("./lib/Ddl.js").Ddl,i=require("./lib/DatabaseDefinition.js").DatabaseDefinition,r=require("./lib/Table.js").Table,s=require("./lib/Tasker.js").Tasker,a=require("./param/Error.js").ERROR,_=function(e,t){this._name=e,this.db=null,this.transaction=null,this._version=0,this._upgrade_enable=!0,this._mode="",this._use_idb=!1,this._opened=!1,this._closed=!1,this._upgrading=!1,this._transacting=!1,this.tables={},this._idb_objects=null,this._tasker=new s,this._tasker.auto_run=!0,t?t.mode&&this.setMode(t.mode):this.useIndexedDB()};_.USE_IDB="idb",_.NO_IDB="no_idb",_.READ_WRITE="readwrite",_.READ_ONLY="readonly",_.DEFAULT_UPGRADING_HANDLER="sli2_upgrade",_.DEFAULT_TRANSACTION_HANDLER="sli2_transaction",_.prototype.useIndexedDB=function(){if(this._idb_objects=t(),null===this._idb_objects)throw a.idb_objects_not_exists;this._mode===_.NO_IDB&&(this._opened=!1),this._mode=_.USE_IDB,this._use_idb=!0},_.prototype.setMode=function(e){e===_.USE_IDB?this.useIndexedDB():e===_.NO_IDB&&(this._mode=_.NO_IDB,this._idb_objects=null,this._use_idb=!1,this._opened=!0,this._closed=!1)},_.createDatabaseDefinition=function(){return new i},_.prototype.deleteDatabase=function(e,t){var n=this;return new Promise(function(o,i){if(n._mode===_.NO_IDB)return void i(a.mode_is_no_idb);if(!n._use_idb)return void i(a.idb_objects_not_used);var r=n._idb_objects.indexedDB.deleteDatabase(e||n._name);r.onsuccess=function(){o()},r.onerror=function(){i()},r.onblocked="function"==typeof t?t:function(){console.log("deletedatabase blocking")}})},_.prototype._initTables=function(){for(var e=this.db,t=0,n=e.objectStoreNames.length;n>t;t+=1){var o=e.objectStoreNames[t],i=new r(o,null,this);this.tables[o]=i}},_.prototype._openTables=function(e,t,n){var o=n||this.tables;for(var i in o)this.tables[i].open(e,t)},_.prototype._closeTables=function(e,t){var n=t||this.tables;for(var o in n)this.tables[o].close(e)},_.prototype._destroyTables=function(){for(var e in this.tables)this.tables[e].destroy()},_.prototype._initInOpen=function(e){this.db=e,0===this._version&&(this._version=e.version),this._opened=!0,this._closed=!1},_.prototype.isUpgrading=function(){return this._upgrading},_.prototype.isTransacting=function(){return this._transacting},_.prototype.open=function(e){var t=this,n=null,o=[],r=[],s={},d=0,u=0;return new Promise(function(c,l){var p=null;return t._mode===_.NO_IDB?void l(a.mode_is_no_idb):t._opened?void l(a.already_open):t._use_idb?void(e instanceof i?new Promise(function(i,_){return o=e.getVersionMapStartWithVersion(1),t.db&&t.db.close(),o?(r=o.seq,s=o.map,n=t._idb_objects.indexedDB.open(t._name),n.onupgradeneeded=function(e){for(t._initInOpen(e.target.result),t.transaction=this.transaction,t._upgrading=!0,t._initTables(),t._openTables(this.transaction,"version_change"),t._tasker.auto_run=!1,d=0,u=r.length;!p&&u>d;d+=1){var n=s[r[d]];"function"==typeof n?n(t):p=a.no_definition(r[d])}t._tasker.addTask(null,function(e){t._version=r[d-1],t.transaction=null,t._upgrading=!1,t.db=null,t._tasker.auto_run=!0,e()}).runQueue()},n.onsuccess=function(e){t._initInOpen(e.target.result),p?_(p):(t._destroyTables(),t._initTables(),i())},n.onerror=function(e){_(e.target.error)},void 0):void _(a.no_version_map(1))}).then(function(){return new Promise(function(i,_){if(t.db.close(),e.isLatestVersion(t._version))n=t._idb_objects.indexedDB.open(t._name,t._version),n.onsuccess=function(e){t._initInOpen(e.target.result),i()},n.onerror=function(e){_(e.target.error)};else{o=e.getVersionMapStartWithVersion(t._version+1);var c=e.getLatestVersionForVersion(t._version);o?(r=o.seq,s=o.map,n=t._idb_objects.indexedDB.open(t._name,c),n.onupgradeneeded=function(e){for(t._initInOpen(e.target.result),t.transaction=this.transaction,t._upgrading=!0,t._initTables(),t._openTables(this.transaction,"version_change"),t._tasker.auto_run=!1,d=0,u=r.length;!p&&u>d;d+=1){var n=s[r[d]];"function"==typeof n?n(t):p=a.no_definition(r[d])}t._tasker.addTask(null,function(e){t._version=r[d-1],t.transaction=null,t._upgrading=!1,t.db=null,t._tasker.auto_run=!0,e()}).runQueue()},n.onsuccess=function(e){t._initInOpen(e.target.result),p?_(p):(t._destroyTables(),t._initTables(),i())},n.onerror=function(e){_(e.target.error)}):p=a.no_version_map(t._version)}})}).then(function(){t._upgrade_enable=!1,c(t.db)})["catch"](function(e){l(e)}):(t._upgrade_enable=!0,t.db&&t.db.close(),n=t._idb_objects.indexedDB.open(t._name),n.onsuccess=function(e){t._initInOpen(e.target.result),t._initTables(),c(t.db)},n.onerror=function(e){l(e.target.error)})):void l(a.idb_objects_not_used)})},_.prototype.close=function(){var e=this;return new Promise(function(t){e._tasker.addTask(null,function(n){e.db&&e.db.close(),e._name=null,e.db=null,e.transaction=null,e._version=0,e._upgrade_enable=!0,e._mode=null,e._upgrading=!1,e._transacting=!1,e._opened=!1,e._closed=!0,e._tasker.terminate(),e._destroyTables(),e.tables={},t(),n()})})},_.prototype.destroy=function(){var e=this;return this.close().then(function(){e._use_idb=!1,e._idb_objects=null,e.tables=null})},_.prototype.getCurrentVersion=function(){return this._version},_.prototype.getNewVersion=function(){if(this._mode===_.NO_IDB)throw a.mode_is_no_idb;if(!this._opened)throw a.not_open;if(this._closed)throw a.closed;return this._version=this._version+1,this._version},_.prototype.begin_transaction=_.prototype.beginTransaction=function(e,t,n){var o=this;return new Promise(function(i,r){var s=[],d={},u=0,c=0,l=function(){o.transaction=null,o._transacting=!1;try{o._closeTables("sli2_transaction",d)}catch(e){r(e)}};if(Array.isArray(e)?s=e:s[0]=e,o._mode===_.NO_IDB)r(a.mode_is_no_idb);else if(o._opened){if(o._closed)r(a.closed);else if(!o._transacting){for(o._transacting=!0,u=0,c=s.length;c>u;u+=1){var p=s[u];if(!o.tables[p])return void r(a.table_not_exist(p));d[p]=o.tables[p]}var h=o.db.transaction(s,t);h.oncomplete=function(){l(),i()},h.onabort=function(){o._tasker.terminate(),l(),r(a.transaction_abort("transaction"))},o.transaction=h;try{o._openTables(h,"sli2_transaction",d)}catch(b){r(b)}}}else r(a.not_open);if("function"==typeof n)try{o._tasker.auto_run=!1,n(),o._tasker.addTask(null,function(){o._tasker.auto_run=!0}).runQueue()}catch(f){o.rollback(),l(),r(f)}})},_.prototype.upgrade=function(e,t){var n=this;return new Promise(function(o,i){var r="function"==typeof e?e:function(){},s="function"==typeof t?t:function(){};if(n._mode===_.NO_IDB)i(a.mode_is_no_idb);else if(n._upgrade_enable)if(n._opened)if(n._closed)i(a.closed);else if(n._upgrading)try{r(n.db,n.transaction),s(),o()}catch(d){i(d)}else{n._upgrading=!0,n.db.close();var u=n._idb_objects.indexedDB.open(n._name,n.getNewVersion());u.onupgradeneeded=function(e){var t=e.target.result,o=this.transaction;o.onabort=function(){i(a.transaction_abort("upgrade"))},n.db=t,n.transaction=o,n._openTables(o,"sli2_upgrade");try{n._tasker.auto_run=!1,r(t,o),n._tasker.addTask(null,function(){n._tasker.auto_run=!0}).runQueue()}catch(e){i(e)}},u.onsuccess=function(e){n._upgrading=!1,n._upgrading===!1&&(n.db=e.target.result),n.transaction=null,n._closeTables("sli2_upgrade"),s(),o()},u.onerror=function(e){i(a.upgrade_error(e.target.error))}}else i(a.not_open);else i(a.update_unable)})},_.prototype.addTask=function(e,t){if(this._closed)throw a.closed;return this._tasker.addTask(e,t)},_.prototype.runQueue=function(){if(this._closed)throw a.closed;return this._tasker.runQueue()},_.prototype.create_table=_.prototype.createTable=function(e,t){var n=t?t:{autoIncrement:!0};if(this._mode===_.NO_IDB)throw a.mode_is_no_idb;if(!this._upgrade_enable)throw a.update_unable;if(!this._opened)throw a.not_open;if(this._closed)throw a.closed;var i=new o(this);return i.createTable(e,n)},_.prototype.drop_table=_.prototype.dropTable=function(e){if(this._mode===_.NO_IDB)throw a.mode_is_no_idb;if(!this._upgrade_enable)throw a.update_unable;if(!this._opened)throw a.not_open;if(this._closed)throw a.closed;var t=new o(this);return t.dropTable(e)},_.prototype.create_index=_.prototype.createIndex=function(e,t,n){if(this._mode===_.NO_IDB)throw a.mode_is_no_idb;if(!this._upgrade_enable)throw a.update_unable;if(!this._opened)throw a.not_open;if(this._closed)throw a.closed;if(!n)throw a.no_option("createIndex");var i=new o(this);return i.createIndex(e,t,n)},_.prototype.drop_index=_.prototype.dropIndex=function(e,t){if(this._mode===_.NO_IDB)throw a.mode_is_no_idb;if(!this._opened)throw a.not_open;if(!this._upgrade_enable)throw a.update_unable;if(this._closed)throw a.closed;var n=new o(this);return n.dropIndex(e,t)},_.prototype.select=function(e){if(!this._opened)throw a.not_open;if(this._closed)throw a.closed;var t=new n(this);return t.select(e)},_.prototype.insert_into=_.prototype.insertInto=function(e,t){if(this._mode===_.NO_IDB)throw a.mode_is_no_idb;if(!this._opened)throw a.not_open;if(this._closed)throw a.closed;var o=new n(this);return o.insert_into(e,t)},_.prototype.delete_from=_.prototype.deleteFrom=function(e){if(this._mode===_.NO_IDB)throw a.mode_is_no_idb;if(!this._opened)throw a.not_open;if(this._closed)throw a.closed;var t=new n(this);return t.delete_from(e)},_.prototype.update=function(e){if(this._mode===_.NO_IDB)throw a.mode_is_no_idb;if(!this._opened)throw a.not_open;if(this._closed)throw a.closed;var t=new n(this);return t.update(e)},_.prototype.rollback=function(){if(this._mode===_.NO_IDB)throw a.mode_is_no_idb;if(!this._opened)throw a.not_open;if(this._closed)throw a.closed;if(!this.transaction)throw a.no_transaction;this.transaction.abort(),this._tasker.terminate(),this._tasker.auto_run=!0},e.SLI2=_}((0,eval)("this").window||this);