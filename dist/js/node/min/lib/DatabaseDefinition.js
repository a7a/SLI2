!function(r){"use strict";var i=require("../param/Error.js").ERROR,t=function(){this._version_maps=[],this._version_procs={}};t.prototype.setVersion=function(r,t){var n=+r;if(Number.isNaN(n)||0>=n)throw i.invalid_version_number(r);if("function"!=typeof t)throw i.is_not_function("arguments[2]:proc");this._version_procs[n]=t},t.prototype.defineVersionMap=function(){this._version_maps=[];for(var r=0,t=arguments.length;t>r;r+=1){if(!Array.isArray(arguments[r]))throw i.is_not_array("arguments["+r+"] of defineVersionMap");for(var n=0,e=arguments[r].length;e>n;n+=1){var s=arguments[r][n],o=+s;if(Number.isNaN(o)||0>=o)throw i.invalid_version_number(s);this._version_maps[this._version_maps.length]=arguments[r]}}},t.prototype.isLatestVersion=function(r){var i=this._version_maps;if(i.length>0){for(var t=0,n=i.length;n>t;t+=1){var e=i[t];if(e[e.length-1]===r)return!0}return!1}return this.getLatestVersionOfDefinition()===r},t.prototype.getVersionMapStartWithVersion=function(r){var i=this._version_maps,t={seq:[],map:{}};if(i.length>0){for(var n=0,e=i.length;e>n;n+=1){var s=i[n],o=s.indexOf(r);if(~o){for(var a=o,f=s.length;f>a;a+=1){var v=s[a];t.map[v]=this._version_procs[v],t.seq[t.seq.length]=v}return t.seq.sort(),t}}return null}for(var h in this._version_procs){var p=+h;p>=r&&(t.map[h]=this._version_procs[h],t.seq[t.seq.length]=p)}return t.seq.sort(),t},t.prototype.getLatestVersionOfDefinition=function(){var r=0;for(var i in this._version_procs){var t=+i;t>r&&(r=t)}return r},t.prototype.getLatestVersionForVersion=function(r){var i=this._version_maps;if(i.length>0){for(var t=0,n=i.length;n>t;t+=1){var e=i[t];if(~e.indexOf(r))return e[e.length-1]}return null}return this.existVersionInDefinition(r)||1===r?this.getLatestVersionOfDefinition():null},t.prototype.existVersionInDefinition=function(r){var i=!1,t=+r;for(var n in this._version_procs)if(+n===t){i=!0;break}return i},r.DatabaseDefinition=t}(this);