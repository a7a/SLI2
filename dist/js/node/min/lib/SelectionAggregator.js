!function(t){"use strict";var e=function(t){this._key_targets=t||[],this._pos=-1,this._names=[],this._values=[],this._result_keys=[],this._result_values=[]};e.isValue=function(t){return"string"==typeof t||t instanceof String||"number"==typeof t||t instanceof Number||null===t||void 0===t},e.hasAction=function(t,n){var u=e.actions[t];return!(!u||"function"!=typeof u[n])},e.prototype.setValue=function(t){this._values[this._pos]=t},e.prototype.setName=function(t){this._names[this._pos]=t},e.prototype.next=function(){this._pos=this._pos+1},e.prototype.getKey=function(){for(var t="",e=0,n=this._key_targets.length;n>e;e+=1){var u=this._key_targets[e],s=this._names.indexOf(u);t=~s?t+"_"+this._values[s]:t+"_"+this._values[u]}return t},e.prototype.getCurrentValue=function(t){var e=this.getPos(this.getKey(t));return this._result_values[e]?this._result_values[e][t]||null:null},e.prototype.getPos=function(t){var e=this._result_keys.indexOf(t);return~e||(e=this._result_values.length),e},e.prototype.aggretate=function(){var t=this.getKey(),n=this.getPos(t);""!==t&&(this._result_keys[n]=t),this._result_values[n]||(this._result_values[n]={});for(var u=0,s=this._values.length;s>u;u+=1){var a=this._names[u]||u,r=this._values[u];if(e.isValue(r))this._result_values[n][a]=r;else{var i=Object.keys(r)[0];e.hasAction(i,"aggregate")&&(this._result_values[n][a]=e.actions[i].aggregate(this,a,r[i]))}}this._names=[],this._values=[],this._pos=-1},e.prototype.getResult=function(){for(var t=this,n=[],u=0,s=t._result_values.length;s>u;u+=1){var a={},r=t._result_values[u];for(var i in r)e.isValue(r[i])?a[i]=r[i]:e.hasAction(r[i].type,"getResult")?a[i]=e.actions[r[i].type].getResult(r[i]):a[i]=null;n[n.length]=a}return n},e.actions={},e.addPlugin=function(t,n){n&&(e.actions[t]={},e.actions[t].init=e.createInit(t),"function"==typeof n.aggregate&&(e.actions[t].aggregate=n.aggregate),"function"==typeof n.getResult&&(e.actions[t].getResult=n.getResult))},e.createInit=function(t){return function(e){var n={};return n[t]=e,this._agg.next(),this._agg.setValue(n),this}},e.loadPluginsTo=function(t){for(var n in e.actions)e.hasAction(n,"init")&&(t[n]=e.actions[n].init)},e.addPlugin("min",{aggregate:function(t,e,n){var u=t.getCurrentValue(e)||Number.MAX_SAFE_INTEGER;return u>n?n:u},getResult:null}),e.addPlugin("max",{aggregate:function(t,e,n){var u=t.getCurrentValue(e)||0;return n>u?n:u},getResult:null}),e.addPlugin("avg",{aggregate:function(t,e,n){var u=t.getCurrentValue(e)||{type:"avg",count:0,value:0};return u.count=u.count+1,u.value=u.value+n,u},getResult:function(t){return t.value/t.count}}),e.addPlugin("sum",{aggregate:function(t,e,n){var u=t.getCurrentValue(e)||0;return u+n},getResult:null}),e.addPlugin("count",{aggregate:function(t,e){var n=t.getCurrentValue(e)||0;return n+1},getResult:null}),e.createAggregationOperator=function(t){var n=new e(t),u=function s(t){return n.next(),n.setValue(t),s};return u._agg=n,u.as=function(t){return this._agg.setName(t),u},u.aggregate=function(){this._agg.aggretate()},u.getResult=function(){return this._agg.getResult()},e.loadPluginsTo(u),u.debug=function(){return n},u},t.SelectionAggregator=e}(this);