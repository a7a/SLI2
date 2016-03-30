(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
!function(t){"use strict";var n=require("./lib/getProperty.js").getProperty,e=require("./lib/matchPrefix.js").matchPrefix,i=require("./lib/Condition.js").Condition,r=require("./lib/evaluation.js").evaluation,o=function(){this._conditionAnd=[],this._conditionOr=[],this._not_flg=!1};o._name_="Kriteria",o.prototype.getConditionAnd=function(){return this._conditionAnd},o.prototype.getConditionOr=function(){return this._conditionOr},o._JS_OPERATOR={eq:"===",ne:"!==",lt:"<",le:"<=",gt:">",ge:">="},o.prototype.addAnd=function(t){this._conditionAnd[this._conditionAnd.length]=t},o.prototype.addOr=function(t){this._conditionOr[this._conditionOr.length]=t},o.prototype.and=function(t){var n=typeof t,e=null;if("string"===n||t instanceof String||"number"===n||t instanceof Number)return r("and",t,this);if(t instanceof o)return e=t,this.addAnd(new i("","",[],"",e)),this;if("function"==typeof t)return e=new o,t(e),this.addAnd(new i("","",[],"",e)),this;throw new Error("invalid type of argument. ("+n+")")},o.prototype.or=function(t){var n=typeof t,e=null;if("string"===n||t instanceof String||"number"===n||t instanceof Number)return r("or",t,this);if(t instanceof o)return e=t,this.addOr(new i("","",[],"",e)),this;if("function"==typeof t)return e=new o,t(e),this.addOr(new i("","",[],"",e)),this;throw new Error("invalid type of argument. ("+n+")")},o.prototype.not=function(){return this._not_flg=!this._not_flg,this},o.parse=function(t){var n=new o,e="";for(e in t.and)n.addAnd(t.and[e]);for(e in t.or)n.andOr(t.or[e]);return t.not&&n.not(),n},o.prototype.match=function(t){var e=0,i=0,r=0,s=0,a="",l="",f=[],h="",c=null,d=[],_=!1,u=null,g=null;for(e=0,i=this._conditionAnd.length;i>e;e+=1)if(u=this._conditionAnd[e],u.criteria instanceof o){if(_=u.criteria.match(t),!_)break}else{if(a=u.left_key,l=u.operator,f=u.right_key,h=u.key_type,c=n(t,a),"value"===h)d=f;else if("key"===h)if(g=n(t,f[0]),Array.isArray(g))if("match"===l||"not_match"===l)for(d=[],r=0,s=g.length;s>r;r+=1)null===g[r]||void 0===g[r]||""===g[r]?d[r]=g[r]:d[r]=new RegExp(g[r]);else d=g;else d="match"===l||"not_match"===l?null===g||void 0===g||""===g?g:[new RegExp(g)]:[g];if(_=void 0===d||~d.indexOf(void 0)||void 0===c?!1:this._compare(c,l,d),!_)break}if(_)return!!(!0^this._not_flg);for(e=0,i=this._conditionOr.length;i>e;e+=1)if(u=this._conditionOr[e],u.criteria instanceof o){if(_=u.criteria.match(t))return!!(!0^this._not_flg)}else{if(a=u.left_key,l=u.operator,f=u.right_key,h=u.key_type,c=n(t,a),"value"===h)d=f;else if("key"===h)if(g=n(t,f[0]),Array.isArray(g))if("match"===l||"not_match"===l)for(d=[],r=0,s=g.length;s>r;r+=1)null===g[r]||void 0===g[r]||""===g[r]?d[r]=g[r]:d[r]=new RegExp(g[r]);else d=g;else d="match"===l||"not_match"===l?null===g||void 0===g||""!==g?g:[new RegExp(g)]:[g];if(_=void 0===d||~d.indexOf(void 0)||void 0===c?!1:this._compare(c,l,d))return!!(!0^this._not_flg)}return!!(!1^this._not_flg)},o.prototype._compare=function(t,n,e){var i=!1;switch(n){case"eq":i=e[0]===t;break;case"ne":i=e[0]!==t;break;case"lt":i=e[0]>t;break;case"le":i=e[0]>=t;break;case"gt":i=e[0]<t;break;case"ge":i=e[0]<=t;break;case"in":i=!!~e.indexOf(t);break;case"not_in":i=!~e.indexOf(t);break;case"between":i=e[0]<=t&&e[1]>=t;break;case"not_between":i=e[0]>t||e[1]<t;break;case"match":i=null===e[0]?null===t||void 0===t?!0:!1:null===t?!1:""===e[0]?""===t?!0:!1:e[0].test(t);break;case"not_match":i=null===e[0]?null===t||void 0===t?!1:!0:null===t?!0:""===e[0]?""===t?!1:!0:!e[0].test(t)}return i},o.prototype.matcher=function(){return new Function("$","return "+this._createMatchingExpression())},o.prototype._createMatchingExpression=function(){var t=0,n=0,e=[],i=[],r="",s="",a=null,l="";for(t=0,n=this._conditionAnd.length;n>t;t+=1)a=this._conditionAnd[t],a.criteria instanceof o?e[e.length]="("+a.criteria._createMatchingExpression()+")":e[e.length]=this._createExpression(a);for(t=0,n=this._conditionOr.length;n>t;t+=1)a=this._conditionOr[t],a.criteria instanceof o?i[i.length]="("+a.criteria._createMatchingExpression()+")":i[i.length]=this._createExpression(a);return r=e.join(" && "),s=i.join(" || "),r&&s?l=r+" || "+s+" ":s?r||(l=s):l=r,this._not_flg&&(l="!("+l+")"),l},o.prototype._createExpression=function(t){return"("+this._createJsExpressionOfKeyIsNotUndefined(t.left_key)+" && "+("key"===t.key_type?this._createJsExpressionOfKeyIsNotUndefined(t.right_key[0])+" && ":"")+this._createJsExpression(t)+")"},o.prototype._createJsExpression=function(t){var n="$."+t.left_key,e=t.operator,i=t.right_key,r=t.key_type,s=o._JS_OPERATOR[e];return s?n+" "+s+" "+this._toStringExpressionFromValue(i[0],r):"in"===e?"value"===r?"!!~"+this._toStringExpressionFromArray(i)+".indexOf("+n+")":"(Array.isArray($."+i[0]+") ? !!~$."+i[0]+".indexOf("+n+"): $."+i[0]+" === "+n+")":"not_in"===e?"value"===r?"!~"+this._toStringExpressionFromArray(i)+".indexOf("+n+")":"(Array.isArray($."+i[0]+") ? !~$."+i[0]+".indexOf("+n+"): $."+i[0]+" !== "+n+")":"between"===e?n+" >= "+this._toStringExpressionFromValue(i[0],r)+" && "+n+" <= "+this._toStringExpressionFromValue(i[1],r):"not_between"===e?n+" < "+this._toStringExpressionFromValue(i[0],r)+" || "+n+" > "+this._toStringExpressionFromValue(i[1],r):"match"===e?void 0===i[0]?!1:null===i[0]?"("+n+" === null ? true : false)":""===i[0]?"("+n+" === '' ? true : false)":"("+i[0]+".test("+n+"))":"not_match"===e?void 0===i[0]?!1:null===i[0]?"("+n+" === null ? false : true)":""===i[0]?"("+n+" === '' ? false : true)":"(!"+i[0]+".test("+n+"))":null},o.prototype._createJsExpressionOfKeyIsNotUndefined=function(t){for(var n=t.split("."),e=[],i=[],r=0,o=n.length;o>r;r+=1)e[e.length]=n[r],i[i.length]="$."+e.join(".")+" !== void 0";return i.join(" && ")},o.prototype._createJSExpressionOfKeyIsUndefined=function(t){for(var n=t.split("."),e=[],i=[],r=0,o=n.length;o>r;r+=1)e[e.length]=n[r],i[i.length]="$."+e.join(".")+" === void 0",i[i.length]="$."+e.join(".")+" === null";return i.join(" || ")},o.prototype._toStringExpressionFromArray=function(t){for(var n=[],e=0,i=t.length;i>e;e+=1)n[n.length]=this._toStringExpressionFromValue(t[e],"value");return"["+n.join(", ")+"]"},o.prototype._toStringExpressionFromValue=function(t,n){return"value"===n&&("string"==typeof t||t instanceof String)?'"'+t+'"':"key"===n?"$."+t:t+""},o.prototype.splitByKeyPrefixes=function(t){if(!Array.isArray(t)||0===t.length)return null;var n={},i=null,r=null,s=[],a="",l="",f="",h=!0,c=!0,d=!0,_="",u=0,g=0,p=0,y=0;for(u=0,g=t.length;g>u;u+=1)n[t[u]]=new o;for(n["else"]=new o,u=0,g=this._conditionAnd.length;g>u;u+=1)if(i=this._conditionAnd[u],i.criteria instanceof o){r=i.criteria.splitByKeyPrefixes(t);for(_ in r)null!==r[_]&&n[_].and(r[_])}else{for(s=[],a=i.left_key,l=i.right_key[0],f=i.key_type,d=!1,p=0,y=t.length;y>p;p+=1)if(s[s.length]=t[p],h=e(a,s),"key"===f&&(c=e(l,s)),"value"===f&&h||"key"===f&&h&&c){n[t[p]].addAnd(i),d=!0;break}d||n["else"].addAnd(i)}for(u=0,g=this._conditionOr.length;g>u;u+=1)if(i=this._conditionOr[u],i.criteria instanceof o){r=i.criteria.splitByKeyPrefixes(t);for(_ in r)null!==r[_]&&n[_].or(r[_])}else{for(s=[],a=i.left_key,l=i.right_key[0],f=i.key_type,d=!1,p=0,y=t.length;y>p;p+=1)if(s[s.length]=t[p],h=e(a,s),"key"===f&&(c=e(l,s)),"value"===f&&h||"key"===f&&h&&c){n[t[p]].addOr(i),d=!0;break}d||n["else"].addOr(i)}for(_ in n)n[_].getConditionAnd().length>0||n[_].getConditionOr().length>0?n[_]._not_flg=this._not_flg:n[_]=null;return n},o.prototype.merge=function(t,n){var e=new o,i=t.getConditionAnd(),r=t.getConditionOr(),s=null,a=!1,l=0,f=0,h=0,c=0;if(this._not_flg!==t._not_flg)throw new Error("Kriteria#merge - collision to not flag.");for(l=0,f=this._conditionAnd.length;f>l;l+=1)e.addAnd(this._conditionAnd[l]);for(l=0,f=this._conditionOr.length;f>l;l+=1)e.addOr(this._conditionOr[l]);if(n){for(l=0,f=i.length;f>l;l+=1){for(s=i[l],a=!1,h=0,c=this._conditionAnd.length;c>h;h+=1)if(0===s.compareTo(this._conditionAnd[h])){a=!0;break}a||e.addAnd(s)}for(l=0,f=r.length;f>l;l+=1){for(s=r[l],a=!1,h=0,c=this._conditionOr.length;c>h;h+=1)if(0===s.compareTo(this._conditionOr[h])){a=!0;break}a||e.addOr(s)}}else{for(l=0,f=i.length;f>l;l+=1)e.addAnd(i[l]);for(l=0,f=r.length;f>l;l+=1)e.addOr(r[l])}return e},o.prototype.compareTo=function(t){var n=function(t,n){return t.compareTo(n)},e=t.getConditionAnd(),i=t.getConditionOr(),r=null,o=null,s=!0,a=0,l=0,f=0,h=0;if(this._conditionAnd.sort(n),e.sort(n),this._conditionOr.sort(n),i.sort(n),this._not_flg&&!t._not_flg)return-1;if(!this._not_flg&&t._not_flg)return 1;for(a=this._conditionAnd.length,l=e.length,h=a>l?a:l,f=0;h>f;f+=1){if(r=this._conditionAnd[f],o=e[f],!r)return-1;if(!o)return 1;if(s=r.compareTo(o),0!==s)return s}for(a=this._conditionOr.length,l=i.length,h=a>l?a:l,f=0;h>f;f+=1){if(r=this._conditionOr[f],o=i[f],!r)return-1;if(!o)return 1;if(s=r.compareTo(o),0!==s)return s}return 0},o.prototype.removePrefixes=function(t){var n=null,e=null,i=0,r=0;if(null===t||void 0===t||!Array.isArray(t)||0===t.length)return this;for(n=new RegExp("^("+t.join("|")+")."),i=0,r=this._conditionAnd.length;r>i;i+=1)e=this._conditionAnd[i],e.criteria instanceof o?e.criteria.removePrefixes(t):(e.left_key=e.left_key.replace(n,""),"key"===e.key_type&&(e.right_key[0]=e.right_key[0].replace(n,"")));for(i=0,r=this._conditionOr.length;r>i;i+=1)e=this._conditionOr[i],e.criteria instanceof o?e.criteria.removePrefixes(t):(e.left_key=e.left_key.replace(n,""),"key"===e.key_type&&(e.right_key[0]=e.right_key[0].replace(n,"")));return this},t.Kriteria=o}((0,eval)("this").window||this);
},{"./lib/Condition.js":2,"./lib/evaluation.js":3,"./lib/getProperty.js":4,"./lib/matchPrefix.js":5}],2:[function(require,module,exports){
!function(e){"use strict";var t=function(e,t,r,i,h){this.left_key=e,this.operator=t,this.right_key=Array.isArray(r)||void 0===r||null===r?r:[r],this.key_type=i,this.criteria=h};t.prototype.clone=function(){return new t(this.left_key,this.operator,this.right_key.concat(),this.key_type,this.criteria)},t.prototype.not=function(){switch(this.operator){case"eq":this.operator="ne";break;case"ne":this.operator="eq";break;case"lt":this.operator="ge";break;case"le":this.operator="gt";break;case"gt":this.operator="le";break;case"ge":this.operator="lt";break;case"in":this.operator="not_in";break;case"not_in":this.operator="in";break;case"between":this.operator="not_between";break;case"not_between":this.operator="between";break;case"match":this.operator="not_match";break;case"not_match":this.operator="match"}return this},t.prototype.normalize=function(){var e=[],r=0,i=0;if("value"===this.key_type)switch(this.operator){case"in":for(r=0,i=this.right_key.length;i>r;r+=1)e[e.length]=new t(this.left_key,"eq",[this.right_key[r]],this.key_type,null);break;case"not_in":for(r=0,i=this.right_key.length;i>r;r+=1)e[e.length]=new t(this.left_key,"ne",[this.right_key[r]],this.key_type,null);break;case"between":e[e.length]=new t(this.left_key,"ge",[this.right_key[0]],this.key_type,null),e[e.length]=new t(this.left_key,"le",[this.right_key[1]],this.key_type,null);break;case"not_between":e[e.length]=new t(this.left_key,"lt",[this.right_key[0]],this.key_type,null),e[e.length]=new t(this.left_key,"gt",[this.right_key[1]],this.key_type,null);break;default:e[e.length]=this.clone()}else e[e.length]=this.clone();return e},t.prototype.compareTo=function(e){if(this.criteria&&!e.criteria)return 1;if(!this.criteria&&e.criteria)return-1;if(this.criteria&&e.criteria)return this.criteria.compareTo(e.criteria);if(this.left_key>e.left_key)return 1;if(this.left_key<e.left_key)return-1;if(this.operator>e.operator)return 1;if(this.operator<e.operator)return-1;if(this.key_type>e.key_type)return 1;if(this.key_type<e.key_type)return-1;for(var t=0,r=this.right_key.length;r>t;t+=1){if(this.right_key[t]>e.right_key[t])return 1;if(this.right_key[t]<e.right_key[t])return-1}return 0},e.Condition=t}(this);
},{}],3:[function(require,module,exports){
!function(e){"use strict";var n=require("./Condition.js").Condition,t=function(e,n,t){return{eq:{key:function(r){return u(t,e,"eq",n,"key",[r]),t},value:function(r){return u(t,e,"eq",n,"value",[r]),t}},ne:{key:function(r){return u(t,e,"ne",n,"key",[r]),t},value:function(r){return u(t,e,"ne",n,"value",[r]),t}},lt:{key:function(r){return u(t,e,"lt",n,"key",[r]),t},value:function(r){return u(t,e,"lt",n,"value",[r]),t}},le:{key:function(r){return u(t,e,"le",n,"key",[r]),t},value:function(r){return u(t,e,"le",n,"value",[r]),t}},gt:{key:function(r){return u(t,e,"gt",n,"key",[r]),t},value:function(r){return u(t,e,"gt",n,"value",[r]),t}},ge:{key:function(r){return u(t,e,"ge",n,"key",[r]),t},value:function(r){return u(t,e,"ge",n,"value",[r]),t}},"in":{key:function(){return u(t,e,"in",n,"key",[].slice.apply(arguments)),t},value:function(){return u(t,e,"in",n,"value",[].slice.apply(arguments)),t}},not_in:{key:function(){return u(t,e,"not_in",n,"key",[].slice.apply(arguments)),t},value:function(){return u(t,e,"not_in",n,"value",[].slice.apply(arguments)),t}},between:function(r,i){return u(t,e,"between",n,"value",[r,i]),t},not_between:function(r,i){return u(t,e,"not_between",n,"value",[r,i]),t},match:function(r){var i=r instanceof RegExp?r:null===r?null:void 0===r?void 0:""===r?"":new RegExp(r);return u(t,e,"match",n,"value",[i]),t},not_match:function(r){var i=r instanceof RegExp?r:null===r?null:void 0===r?void 0:""===r?"":new RegExp(r);return u(t,e,"not_match",n,"value",[i]),t}}},u=function(e,t,u,r,i,o){if("and"===t.toLowerCase())e.addAnd(new n(r,u,o,i,null));else{if("or"!==t.toLowerCase())throw new Error("invalid type: "+t+"(at key_name:"+r+", key_type: "+i+", operator:"+u+")");e.addOr(new n(r,u,o,i,null))}};e.evaluation=t}(this);
},{"./Condition.js":2}],4:[function(require,module,exports){
!function(t){"use strict";var n=function(t,n){for(var r=n.split("."),e=t,i=0,f=r.length;f>i;i+=1){if("string"==typeof e||e instanceof String||"number"==typeof e||e instanceof Number)return;if(!(r[i]in e))return;e=e[r[i]]}return e};t.getProperty=n}(this);
},{}],5:[function(require,module,exports){
!function(r){"use strict";var t=function(r,t){if(0===t.length)return!0;for(var n=0,e=t.length;e>n;n+=1)if(0===r.indexOf(t[n]+"."))return!0;return!1};r.matchPrefix=t}(this);
},{}],6:[function(require,module,exports){
(function (process,global){
/*!
 * async
 * https://github.com/caolan/async
 *
 * Copyright 2010-2014 Caolan McMahon
 * Released under the MIT license
 */
(function () {

    var async = {};
    function noop() {}
    function identity(v) {
        return v;
    }
    function toBool(v) {
        return !!v;
    }
    function notId(v) {
        return !v;
    }

    // global on the server, window in the browser
    var previous_async;

    // Establish the root object, `window` (`self`) in the browser, `global`
    // on the server, or `this` in some virtual machines. We use `self`
    // instead of `window` for `WebWorker` support.
    var root = typeof self === 'object' && self.self === self && self ||
            typeof global === 'object' && global.global === global && global ||
            this;

    if (root != null) {
        previous_async = root.async;
    }

    async.noConflict = function () {
        root.async = previous_async;
        return async;
    };

    function only_once(fn) {
        return function() {
            if (fn === null) throw new Error("Callback was already called.");
            fn.apply(this, arguments);
            fn = null;
        };
    }

    function _once(fn) {
        return function() {
            if (fn === null) return;
            fn.apply(this, arguments);
            fn = null;
        };
    }

    //// cross-browser compatiblity functions ////

    var _toString = Object.prototype.toString;

    var _isArray = Array.isArray || function (obj) {
        return _toString.call(obj) === '[object Array]';
    };

    // Ported from underscore.js isObject
    var _isObject = function(obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
    };

    function _isArrayLike(arr) {
        return _isArray(arr) || (
            // has a positive integer length property
            typeof arr.length === "number" &&
            arr.length >= 0 &&
            arr.length % 1 === 0
        );
    }

    function _arrayEach(arr, iterator) {
        var index = -1,
            length = arr.length;

        while (++index < length) {
            iterator(arr[index], index, arr);
        }
    }

    function _map(arr, iterator) {
        var index = -1,
            length = arr.length,
            result = Array(length);

        while (++index < length) {
            result[index] = iterator(arr[index], index, arr);
        }
        return result;
    }

    function _range(count) {
        return _map(Array(count), function (v, i) { return i; });
    }

    function _reduce(arr, iterator, memo) {
        _arrayEach(arr, function (x, i, a) {
            memo = iterator(memo, x, i, a);
        });
        return memo;
    }

    function _forEachOf(object, iterator) {
        _arrayEach(_keys(object), function (key) {
            iterator(object[key], key);
        });
    }

    function _indexOf(arr, item) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] === item) return i;
        }
        return -1;
    }

    var _keys = Object.keys || function (obj) {
        var keys = [];
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                keys.push(k);
            }
        }
        return keys;
    };

    function _keyIterator(coll) {
        var i = -1;
        var len;
        var keys;
        if (_isArrayLike(coll)) {
            len = coll.length;
            return function next() {
                i++;
                return i < len ? i : null;
            };
        } else {
            keys = _keys(coll);
            len = keys.length;
            return function next() {
                i++;
                return i < len ? keys[i] : null;
            };
        }
    }

    // Similar to ES6's rest param (http://ariya.ofilabs.com/2013/03/es6-and-rest-parameter.html)
    // This accumulates the arguments passed into an array, after a given index.
    // From underscore.js (https://github.com/jashkenas/underscore/pull/2140).
    function _restParam(func, startIndex) {
        startIndex = startIndex == null ? func.length - 1 : +startIndex;
        return function() {
            var length = Math.max(arguments.length - startIndex, 0);
            var rest = Array(length);
            for (var index = 0; index < length; index++) {
                rest[index] = arguments[index + startIndex];
            }
            switch (startIndex) {
                case 0: return func.call(this, rest);
                case 1: return func.call(this, arguments[0], rest);
            }
            // Currently unused but handle cases outside of the switch statement:
            // var args = Array(startIndex + 1);
            // for (index = 0; index < startIndex; index++) {
            //     args[index] = arguments[index];
            // }
            // args[startIndex] = rest;
            // return func.apply(this, args);
        };
    }

    function _withoutIndex(iterator) {
        return function (value, index, callback) {
            return iterator(value, callback);
        };
    }

    //// exported async module functions ////

    //// nextTick implementation with browser-compatible fallback ////

    // capture the global reference to guard against fakeTimer mocks
    var _setImmediate = typeof setImmediate === 'function' && setImmediate;

    var _delay = _setImmediate ? function(fn) {
        // not a direct alias for IE10 compatibility
        _setImmediate(fn);
    } : function(fn) {
        setTimeout(fn, 0);
    };

    if (typeof process === 'object' && typeof process.nextTick === 'function') {
        async.nextTick = process.nextTick;
    } else {
        async.nextTick = _delay;
    }
    async.setImmediate = _setImmediate ? _delay : async.nextTick;


    async.forEach =
    async.each = function (arr, iterator, callback) {
        return async.eachOf(arr, _withoutIndex(iterator), callback);
    };

    async.forEachSeries =
    async.eachSeries = function (arr, iterator, callback) {
        return async.eachOfSeries(arr, _withoutIndex(iterator), callback);
    };


    async.forEachLimit =
    async.eachLimit = function (arr, limit, iterator, callback) {
        return _eachOfLimit(limit)(arr, _withoutIndex(iterator), callback);
    };

    async.forEachOf =
    async.eachOf = function (object, iterator, callback) {
        callback = _once(callback || noop);
        object = object || [];

        var iter = _keyIterator(object);
        var key, completed = 0;

        while ((key = iter()) != null) {
            completed += 1;
            iterator(object[key], key, only_once(done));
        }

        if (completed === 0) callback(null);

        function done(err) {
            completed--;
            if (err) {
                callback(err);
            }
            // Check key is null in case iterator isn't exhausted
            // and done resolved synchronously.
            else if (key === null && completed <= 0) {
                callback(null);
            }
        }
    };

    async.forEachOfSeries =
    async.eachOfSeries = function (obj, iterator, callback) {
        callback = _once(callback || noop);
        obj = obj || [];
        var nextKey = _keyIterator(obj);
        var key = nextKey();
        function iterate() {
            var sync = true;
            if (key === null) {
                return callback(null);
            }
            iterator(obj[key], key, only_once(function (err) {
                if (err) {
                    callback(err);
                }
                else {
                    key = nextKey();
                    if (key === null) {
                        return callback(null);
                    } else {
                        if (sync) {
                            async.setImmediate(iterate);
                        } else {
                            iterate();
                        }
                    }
                }
            }));
            sync = false;
        }
        iterate();
    };



    async.forEachOfLimit =
    async.eachOfLimit = function (obj, limit, iterator, callback) {
        _eachOfLimit(limit)(obj, iterator, callback);
    };

    function _eachOfLimit(limit) {

        return function (obj, iterator, callback) {
            callback = _once(callback || noop);
            obj = obj || [];
            var nextKey = _keyIterator(obj);
            if (limit <= 0) {
                return callback(null);
            }
            var done = false;
            var running = 0;
            var errored = false;

            (function replenish () {
                if (done && running <= 0) {
                    return callback(null);
                }

                while (running < limit && !errored) {
                    var key = nextKey();
                    if (key === null) {
                        done = true;
                        if (running <= 0) {
                            callback(null);
                        }
                        return;
                    }
                    running += 1;
                    iterator(obj[key], key, only_once(function (err) {
                        running -= 1;
                        if (err) {
                            callback(err);
                            errored = true;
                        }
                        else {
                            replenish();
                        }
                    }));
                }
            })();
        };
    }


    function doParallel(fn) {
        return function (obj, iterator, callback) {
            return fn(async.eachOf, obj, iterator, callback);
        };
    }
    function doParallelLimit(fn) {
        return function (obj, limit, iterator, callback) {
            return fn(_eachOfLimit(limit), obj, iterator, callback);
        };
    }
    function doSeries(fn) {
        return function (obj, iterator, callback) {
            return fn(async.eachOfSeries, obj, iterator, callback);
        };
    }

    function _asyncMap(eachfn, arr, iterator, callback) {
        callback = _once(callback || noop);
        arr = arr || [];
        var results = _isArrayLike(arr) ? [] : {};
        eachfn(arr, function (value, index, callback) {
            iterator(value, function (err, v) {
                results[index] = v;
                callback(err);
            });
        }, function (err) {
            callback(err, results);
        });
    }

    async.map = doParallel(_asyncMap);
    async.mapSeries = doSeries(_asyncMap);
    async.mapLimit = doParallelLimit(_asyncMap);

    // reduce only has a series version, as doing reduce in parallel won't
    // work in many situations.
    async.inject =
    async.foldl =
    async.reduce = function (arr, memo, iterator, callback) {
        async.eachOfSeries(arr, function (x, i, callback) {
            iterator(memo, x, function (err, v) {
                memo = v;
                callback(err);
            });
        }, function (err) {
            callback(err, memo);
        });
    };

    async.foldr =
    async.reduceRight = function (arr, memo, iterator, callback) {
        var reversed = _map(arr, identity).reverse();
        async.reduce(reversed, memo, iterator, callback);
    };

    async.transform = function (arr, memo, iterator, callback) {
        if (arguments.length === 3) {
            callback = iterator;
            iterator = memo;
            memo = _isArray(arr) ? [] : {};
        }

        async.eachOf(arr, function(v, k, cb) {
            iterator(memo, v, k, cb);
        }, function(err) {
            callback(err, memo);
        });
    };

    function _filter(eachfn, arr, iterator, callback) {
        var results = [];
        eachfn(arr, function (x, index, callback) {
            iterator(x, function (v) {
                if (v) {
                    results.push({index: index, value: x});
                }
                callback();
            });
        }, function () {
            callback(_map(results.sort(function (a, b) {
                return a.index - b.index;
            }), function (x) {
                return x.value;
            }));
        });
    }

    async.select =
    async.filter = doParallel(_filter);

    async.selectLimit =
    async.filterLimit = doParallelLimit(_filter);

    async.selectSeries =
    async.filterSeries = doSeries(_filter);

    function _reject(eachfn, arr, iterator, callback) {
        _filter(eachfn, arr, function(value, cb) {
            iterator(value, function(v) {
                cb(!v);
            });
        }, callback);
    }
    async.reject = doParallel(_reject);
    async.rejectLimit = doParallelLimit(_reject);
    async.rejectSeries = doSeries(_reject);

    function _createTester(eachfn, check, getResult) {
        return function(arr, limit, iterator, cb) {
            function done() {
                if (cb) cb(getResult(false, void 0));
            }
            function iteratee(x, _, callback) {
                if (!cb) return callback();
                iterator(x, function (v) {
                    if (cb && check(v)) {
                        cb(getResult(true, x));
                        cb = iterator = false;
                    }
                    callback();
                });
            }
            if (arguments.length > 3) {
                eachfn(arr, limit, iteratee, done);
            } else {
                cb = iterator;
                iterator = limit;
                eachfn(arr, iteratee, done);
            }
        };
    }

    async.any =
    async.some = _createTester(async.eachOf, toBool, identity);

    async.someLimit = _createTester(async.eachOfLimit, toBool, identity);

    async.all =
    async.every = _createTester(async.eachOf, notId, notId);

    async.everyLimit = _createTester(async.eachOfLimit, notId, notId);

    function _findGetResult(v, x) {
        return x;
    }
    async.detect = _createTester(async.eachOf, identity, _findGetResult);
    async.detectSeries = _createTester(async.eachOfSeries, identity, _findGetResult);
    async.detectLimit = _createTester(async.eachOfLimit, identity, _findGetResult);

    async.sortBy = function (arr, iterator, callback) {
        async.map(arr, function (x, callback) {
            iterator(x, function (err, criteria) {
                if (err) {
                    callback(err);
                }
                else {
                    callback(null, {value: x, criteria: criteria});
                }
            });
        }, function (err, results) {
            if (err) {
                return callback(err);
            }
            else {
                callback(null, _map(results.sort(comparator), function (x) {
                    return x.value;
                }));
            }

        });

        function comparator(left, right) {
            var a = left.criteria, b = right.criteria;
            return a < b ? -1 : a > b ? 1 : 0;
        }
    };

    async.auto = function (tasks, concurrency, callback) {
        if (typeof arguments[1] === 'function') {
            // concurrency is optional, shift the args.
            callback = concurrency;
            concurrency = null;
        }
        callback = _once(callback || noop);
        var keys = _keys(tasks);
        var remainingTasks = keys.length;
        if (!remainingTasks) {
            return callback(null);
        }
        if (!concurrency) {
            concurrency = remainingTasks;
        }

        var results = {};
        var runningTasks = 0;

        var hasError = false;

        var listeners = [];
        function addListener(fn) {
            listeners.unshift(fn);
        }
        function removeListener(fn) {
            var idx = _indexOf(listeners, fn);
            if (idx >= 0) listeners.splice(idx, 1);
        }
        function taskComplete() {
            remainingTasks--;
            _arrayEach(listeners.slice(0), function (fn) {
                fn();
            });
        }

        addListener(function () {
            if (!remainingTasks) {
                callback(null, results);
            }
        });

        _arrayEach(keys, function (k) {
            if (hasError) return;
            var task = _isArray(tasks[k]) ? tasks[k]: [tasks[k]];
            var taskCallback = _restParam(function(err, args) {
                runningTasks--;
                if (args.length <= 1) {
                    args = args[0];
                }
                if (err) {
                    var safeResults = {};
                    _forEachOf(results, function(val, rkey) {
                        safeResults[rkey] = val;
                    });
                    safeResults[k] = args;
                    hasError = true;

                    callback(err, safeResults);
                }
                else {
                    results[k] = args;
                    async.setImmediate(taskComplete);
                }
            });
            var requires = task.slice(0, task.length - 1);
            // prevent dead-locks
            var len = requires.length;
            var dep;
            while (len--) {
                if (!(dep = tasks[requires[len]])) {
                    throw new Error('Has nonexistent dependency in ' + requires.join(', '));
                }
                if (_isArray(dep) && _indexOf(dep, k) >= 0) {
                    throw new Error('Has cyclic dependencies');
                }
            }
            function ready() {
                return runningTasks < concurrency && _reduce(requires, function (a, x) {
                    return (a && results.hasOwnProperty(x));
                }, true) && !results.hasOwnProperty(k);
            }
            if (ready()) {
                runningTasks++;
                task[task.length - 1](taskCallback, results);
            }
            else {
                addListener(listener);
            }
            function listener() {
                if (ready()) {
                    runningTasks++;
                    removeListener(listener);
                    task[task.length - 1](taskCallback, results);
                }
            }
        });
    };



    async.retry = function(times, task, callback) {
        var DEFAULT_TIMES = 5;
        var DEFAULT_INTERVAL = 0;

        var attempts = [];

        var opts = {
            times: DEFAULT_TIMES,
            interval: DEFAULT_INTERVAL
        };

        function parseTimes(acc, t){
            if(typeof t === 'number'){
                acc.times = parseInt(t, 10) || DEFAULT_TIMES;
            } else if(typeof t === 'object'){
                acc.times = parseInt(t.times, 10) || DEFAULT_TIMES;
                acc.interval = parseInt(t.interval, 10) || DEFAULT_INTERVAL;
            } else {
                throw new Error('Unsupported argument type for \'times\': ' + typeof t);
            }
        }

        var length = arguments.length;
        if (length < 1 || length > 3) {
            throw new Error('Invalid arguments - must be either (task), (task, callback), (times, task) or (times, task, callback)');
        } else if (length <= 2 && typeof times === 'function') {
            callback = task;
            task = times;
        }
        if (typeof times !== 'function') {
            parseTimes(opts, times);
        }
        opts.callback = callback;
        opts.task = task;

        function wrappedTask(wrappedCallback, wrappedResults) {
            function retryAttempt(task, finalAttempt) {
                return function(seriesCallback) {
                    task(function(err, result){
                        seriesCallback(!err || finalAttempt, {err: err, result: result});
                    }, wrappedResults);
                };
            }

            function retryInterval(interval){
                return function(seriesCallback){
                    setTimeout(function(){
                        seriesCallback(null);
                    }, interval);
                };
            }

            while (opts.times) {

                var finalAttempt = !(opts.times-=1);
                attempts.push(retryAttempt(opts.task, finalAttempt));
                if(!finalAttempt && opts.interval > 0){
                    attempts.push(retryInterval(opts.interval));
                }
            }

            async.series(attempts, function(done, data){
                data = data[data.length - 1];
                (wrappedCallback || opts.callback)(data.err, data.result);
            });
        }

        // If a callback is passed, run this as a controll flow
        return opts.callback ? wrappedTask() : wrappedTask;
    };

    async.waterfall = function (tasks, callback) {
        callback = _once(callback || noop);
        if (!_isArray(tasks)) {
            var err = new Error('First argument to waterfall must be an array of functions');
            return callback(err);
        }
        if (!tasks.length) {
            return callback();
        }
        function wrapIterator(iterator) {
            return _restParam(function (err, args) {
                if (err) {
                    callback.apply(null, [err].concat(args));
                }
                else {
                    var next = iterator.next();
                    if (next) {
                        args.push(wrapIterator(next));
                    }
                    else {
                        args.push(callback);
                    }
                    ensureAsync(iterator).apply(null, args);
                }
            });
        }
        wrapIterator(async.iterator(tasks))();
    };

    function _parallel(eachfn, tasks, callback) {
        callback = callback || noop;
        var results = _isArrayLike(tasks) ? [] : {};

        eachfn(tasks, function (task, key, callback) {
            task(_restParam(function (err, args) {
                if (args.length <= 1) {
                    args = args[0];
                }
                results[key] = args;
                callback(err);
            }));
        }, function (err) {
            callback(err, results);
        });
    }

    async.parallel = function (tasks, callback) {
        _parallel(async.eachOf, tasks, callback);
    };

    async.parallelLimit = function(tasks, limit, callback) {
        _parallel(_eachOfLimit(limit), tasks, callback);
    };

    async.series = function(tasks, callback) {
        _parallel(async.eachOfSeries, tasks, callback);
    };

    async.iterator = function (tasks) {
        function makeCallback(index) {
            function fn() {
                if (tasks.length) {
                    tasks[index].apply(null, arguments);
                }
                return fn.next();
            }
            fn.next = function () {
                return (index < tasks.length - 1) ? makeCallback(index + 1): null;
            };
            return fn;
        }
        return makeCallback(0);
    };

    async.apply = _restParam(function (fn, args) {
        return _restParam(function (callArgs) {
            return fn.apply(
                null, args.concat(callArgs)
            );
        });
    });

    function _concat(eachfn, arr, fn, callback) {
        var result = [];
        eachfn(arr, function (x, index, cb) {
            fn(x, function (err, y) {
                result = result.concat(y || []);
                cb(err);
            });
        }, function (err) {
            callback(err, result);
        });
    }
    async.concat = doParallel(_concat);
    async.concatSeries = doSeries(_concat);

    async.whilst = function (test, iterator, callback) {
        callback = callback || noop;
        if (test()) {
            var next = _restParam(function(err, args) {
                if (err) {
                    callback(err);
                } else if (test.apply(this, args)) {
                    iterator(next);
                } else {
                    callback.apply(null, [null].concat(args));
                }
            });
            iterator(next);
        } else {
            callback(null);
        }
    };

    async.doWhilst = function (iterator, test, callback) {
        var calls = 0;
        return async.whilst(function() {
            return ++calls <= 1 || test.apply(this, arguments);
        }, iterator, callback);
    };

    async.until = function (test, iterator, callback) {
        return async.whilst(function() {
            return !test.apply(this, arguments);
        }, iterator, callback);
    };

    async.doUntil = function (iterator, test, callback) {
        return async.doWhilst(iterator, function() {
            return !test.apply(this, arguments);
        }, callback);
    };

    async.during = function (test, iterator, callback) {
        callback = callback || noop;

        var next = _restParam(function(err, args) {
            if (err) {
                callback(err);
            } else {
                args.push(check);
                test.apply(this, args);
            }
        });

        var check = function(err, truth) {
            if (err) {
                callback(err);
            } else if (truth) {
                iterator(next);
            } else {
                callback(null);
            }
        };

        test(check);
    };

    async.doDuring = function (iterator, test, callback) {
        var calls = 0;
        async.during(function(next) {
            if (calls++ < 1) {
                next(null, true);
            } else {
                test.apply(this, arguments);
            }
        }, iterator, callback);
    };

    function _queue(worker, concurrency, payload) {
        if (concurrency == null) {
            concurrency = 1;
        }
        else if(concurrency === 0) {
            throw new Error('Concurrency must not be zero');
        }
        function _insert(q, data, pos, callback) {
            if (callback != null && typeof callback !== "function") {
                throw new Error("task callback must be a function");
            }
            q.started = true;
            if (!_isArray(data)) {
                data = [data];
            }
            if(data.length === 0 && q.idle()) {
                // call drain immediately if there are no tasks
                return async.setImmediate(function() {
                    q.drain();
                });
            }
            _arrayEach(data, function(task) {
                var item = {
                    data: task,
                    callback: callback || noop
                };

                if (pos) {
                    q.tasks.unshift(item);
                } else {
                    q.tasks.push(item);
                }

                if (q.tasks.length === q.concurrency) {
                    q.saturated();
                }
            });
            async.setImmediate(q.process);
        }
        function _next(q, tasks) {
            return function(){
                workers -= 1;

                var removed = false;
                var args = arguments;
                _arrayEach(tasks, function (task) {
                    _arrayEach(workersList, function (worker, index) {
                        if (worker === task && !removed) {
                            workersList.splice(index, 1);
                            removed = true;
                        }
                    });

                    task.callback.apply(task, args);
                });
                if (q.tasks.length + workers === 0) {
                    q.drain();
                }
                q.process();
            };
        }

        var workers = 0;
        var workersList = [];
        var q = {
            tasks: [],
            concurrency: concurrency,
            payload: payload,
            saturated: noop,
            empty: noop,
            drain: noop,
            started: false,
            paused: false,
            push: function (data, callback) {
                _insert(q, data, false, callback);
            },
            kill: function () {
                q.drain = noop;
                q.tasks = [];
            },
            unshift: function (data, callback) {
                _insert(q, data, true, callback);
            },
            process: function () {
                while(!q.paused && workers < q.concurrency && q.tasks.length){

                    var tasks = q.payload ?
                        q.tasks.splice(0, q.payload) :
                        q.tasks.splice(0, q.tasks.length);

                    var data = _map(tasks, function (task) {
                        return task.data;
                    });

                    if (q.tasks.length === 0) {
                        q.empty();
                    }
                    workers += 1;
                    workersList.push(tasks[0]);
                    var cb = only_once(_next(q, tasks));
                    worker(data, cb);
                }
            },
            length: function () {
                return q.tasks.length;
            },
            running: function () {
                return workers;
            },
            workersList: function () {
                return workersList;
            },
            idle: function() {
                return q.tasks.length + workers === 0;
            },
            pause: function () {
                q.paused = true;
            },
            resume: function () {
                if (q.paused === false) { return; }
                q.paused = false;
                var resumeCount = Math.min(q.concurrency, q.tasks.length);
                // Need to call q.process once per concurrent
                // worker to preserve full concurrency after pause
                for (var w = 1; w <= resumeCount; w++) {
                    async.setImmediate(q.process);
                }
            }
        };
        return q;
    }

    async.queue = function (worker, concurrency) {
        var q = _queue(function (items, cb) {
            worker(items[0], cb);
        }, concurrency, 1);

        return q;
    };

    async.priorityQueue = function (worker, concurrency) {

        function _compareTasks(a, b){
            return a.priority - b.priority;
        }

        function _binarySearch(sequence, item, compare) {
            var beg = -1,
                end = sequence.length - 1;
            while (beg < end) {
                var mid = beg + ((end - beg + 1) >>> 1);
                if (compare(item, sequence[mid]) >= 0) {
                    beg = mid;
                } else {
                    end = mid - 1;
                }
            }
            return beg;
        }

        function _insert(q, data, priority, callback) {
            if (callback != null && typeof callback !== "function") {
                throw new Error("task callback must be a function");
            }
            q.started = true;
            if (!_isArray(data)) {
                data = [data];
            }
            if(data.length === 0) {
                // call drain immediately if there are no tasks
                return async.setImmediate(function() {
                    q.drain();
                });
            }
            _arrayEach(data, function(task) {
                var item = {
                    data: task,
                    priority: priority,
                    callback: typeof callback === 'function' ? callback : noop
                };

                q.tasks.splice(_binarySearch(q.tasks, item, _compareTasks) + 1, 0, item);

                if (q.tasks.length === q.concurrency) {
                    q.saturated();
                }
                async.setImmediate(q.process);
            });
        }

        // Start with a normal queue
        var q = async.queue(worker, concurrency);

        // Override push to accept second parameter representing priority
        q.push = function (data, priority, callback) {
            _insert(q, data, priority, callback);
        };

        // Remove unshift function
        delete q.unshift;

        return q;
    };

    async.cargo = function (worker, payload) {
        return _queue(worker, 1, payload);
    };

    function _console_fn(name) {
        return _restParam(function (fn, args) {
            fn.apply(null, args.concat([_restParam(function (err, args) {
                if (typeof console === 'object') {
                    if (err) {
                        if (console.error) {
                            console.error(err);
                        }
                    }
                    else if (console[name]) {
                        _arrayEach(args, function (x) {
                            console[name](x);
                        });
                    }
                }
            })]));
        });
    }
    async.log = _console_fn('log');
    async.dir = _console_fn('dir');
    /*async.info = _console_fn('info');
    async.warn = _console_fn('warn');
    async.error = _console_fn('error');*/

    async.memoize = function (fn, hasher) {
        var memo = {};
        var queues = {};
        var has = Object.prototype.hasOwnProperty;
        hasher = hasher || identity;
        var memoized = _restParam(function memoized(args) {
            var callback = args.pop();
            var key = hasher.apply(null, args);
            if (has.call(memo, key)) {   
                async.setImmediate(function () {
                    callback.apply(null, memo[key]);
                });
            }
            else if (has.call(queues, key)) {
                queues[key].push(callback);
            }
            else {
                queues[key] = [callback];
                fn.apply(null, args.concat([_restParam(function (args) {
                    memo[key] = args;
                    var q = queues[key];
                    delete queues[key];
                    for (var i = 0, l = q.length; i < l; i++) {
                        q[i].apply(null, args);
                    }
                })]));
            }
        });
        memoized.memo = memo;
        memoized.unmemoized = fn;
        return memoized;
    };

    async.unmemoize = function (fn) {
        return function () {
            return (fn.unmemoized || fn).apply(null, arguments);
        };
    };

    function _times(mapper) {
        return function (count, iterator, callback) {
            mapper(_range(count), iterator, callback);
        };
    }

    async.times = _times(async.map);
    async.timesSeries = _times(async.mapSeries);
    async.timesLimit = function (count, limit, iterator, callback) {
        return async.mapLimit(_range(count), limit, iterator, callback);
    };

    async.seq = function (/* functions... */) {
        var fns = arguments;
        return _restParam(function (args) {
            var that = this;

            var callback = args[args.length - 1];
            if (typeof callback == 'function') {
                args.pop();
            } else {
                callback = noop;
            }

            async.reduce(fns, args, function (newargs, fn, cb) {
                fn.apply(that, newargs.concat([_restParam(function (err, nextargs) {
                    cb(err, nextargs);
                })]));
            },
            function (err, results) {
                callback.apply(that, [err].concat(results));
            });
        });
    };

    async.compose = function (/* functions... */) {
        return async.seq.apply(null, Array.prototype.reverse.call(arguments));
    };


    function _applyEach(eachfn) {
        return _restParam(function(fns, args) {
            var go = _restParam(function(args) {
                var that = this;
                var callback = args.pop();
                return eachfn(fns, function (fn, _, cb) {
                    fn.apply(that, args.concat([cb]));
                },
                callback);
            });
            if (args.length) {
                return go.apply(this, args);
            }
            else {
                return go;
            }
        });
    }

    async.applyEach = _applyEach(async.eachOf);
    async.applyEachSeries = _applyEach(async.eachOfSeries);


    async.forever = function (fn, callback) {
        var done = only_once(callback || noop);
        var task = ensureAsync(fn);
        function next(err) {
            if (err) {
                return done(err);
            }
            task(next);
        }
        next();
    };

    function ensureAsync(fn) {
        return _restParam(function (args) {
            var callback = args.pop();
            args.push(function () {
                var innerArgs = arguments;
                if (sync) {
                    async.setImmediate(function () {
                        callback.apply(null, innerArgs);
                    });
                } else {
                    callback.apply(null, innerArgs);
                }
            });
            var sync = true;
            fn.apply(this, args);
            sync = false;
        });
    }

    async.ensureAsync = ensureAsync;

    async.constant = _restParam(function(values) {
        var args = [null].concat(values);
        return function (callback) {
            return callback.apply(this, args);
        };
    });

    async.wrapSync =
    async.asyncify = function asyncify(func) {
        return _restParam(function (args) {
            var callback = args.pop();
            var result;
            try {
                result = func.apply(this, args);
            } catch (e) {
                return callback(e);
            }
            // if result is Promise object
            if (_isObject(result) && typeof result.then === "function") {
                result.then(function(value) {
                    callback(null, value);
                })["catch"](function(err) {
                    callback(err.message ? err : new Error(err));
                });
            } else {
                callback(null, result);
            }
        });
    };

    // Node.js
    if (typeof module === 'object' && module.exports) {
        module.exports = async;
    }
    // AMD / RequireJS
    else if (typeof define === 'function' && define.amd) {
        define([], function () {
            return async;
        });
    }
    // included directly via <script> tag
    else {
        root.async = async;
    }

}());

}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"+7ZJp0":17}],7:[function(require,module,exports){
(function (Buffer){
var clone = (function() {
'use strict';

/**
 * Clones (copies) an Object using deep copying.
 *
 * This function supports circular references by default, but if you are certain
 * there are no circular references in your object, you can save some CPU time
 * by calling clone(obj, false).
 *
 * Caution: if `circular` is false and `parent` contains circular references,
 * your program may enter an infinite loop and crash.
 *
 * @param `parent` - the object to be cloned
 * @param `circular` - set to true if the object to be cloned may contain
 *    circular references. (optional - true by default)
 * @param `depth` - set to a number if the object is only to be cloned to
 *    a particular depth. (optional - defaults to Infinity)
 * @param `prototype` - sets the prototype to be used when cloning an object.
 *    (optional - defaults to parent prototype).
*/
function clone(parent, circular, depth, prototype) {
  var filter;
  if (typeof circular === 'object') {
    depth = circular.depth;
    prototype = circular.prototype;
    filter = circular.filter;
    circular = circular.circular
  }
  // maintain two arrays for circular references, where corresponding parents
  // and children have the same index
  var allParents = [];
  var allChildren = [];

  var useBuffer = typeof Buffer != 'undefined';

  if (typeof circular == 'undefined')
    circular = true;

  if (typeof depth == 'undefined')
    depth = Infinity;

  // recurse this function so we don't reset allParents and allChildren
  function _clone(parent, depth) {
    // cloning null always returns null
    if (parent === null)
      return null;

    if (depth == 0)
      return parent;

    var child;
    var proto;
    if (typeof parent != 'object') {
      return parent;
    }

    if (clone.__isArray(parent)) {
      child = [];
    } else if (clone.__isRegExp(parent)) {
      child = new RegExp(parent.source, __getRegExpFlags(parent));
      if (parent.lastIndex) child.lastIndex = parent.lastIndex;
    } else if (clone.__isDate(parent)) {
      child = new Date(parent.getTime());
    } else if (useBuffer && Buffer.isBuffer(parent)) {
      child = new Buffer(parent.length);
      parent.copy(child);
      return child;
    } else {
      if (typeof prototype == 'undefined') {
        proto = Object.getPrototypeOf(parent);
        child = Object.create(proto);
      }
      else {
        child = Object.create(prototype);
        proto = prototype;
      }
    }

    if (circular) {
      var index = allParents.indexOf(parent);

      if (index != -1) {
        return allChildren[index];
      }
      allParents.push(parent);
      allChildren.push(child);
    }

    for (var i in parent) {
      var attrs;
      if (proto) {
        attrs = Object.getOwnPropertyDescriptor(proto, i);
      }

      if (attrs && attrs.set == null) {
        continue;
      }
      child[i] = _clone(parent[i], depth - 1);
    }

    return child;
  }

  return _clone(parent, depth);
}

/**
 * Simple flat clone using prototype, accepts only objects, usefull for property
 * override on FLAT configuration object (no nested props).
 *
 * USE WITH CAUTION! This may not behave as you wish if you do not know how this
 * works.
 */
clone.clonePrototype = function clonePrototype(parent) {
  if (parent === null)
    return null;

  var c = function () {};
  c.prototype = parent;
  return new c();
};

// private utility functions

function __objToStr(o) {
  return Object.prototype.toString.call(o);
};
clone.__objToStr = __objToStr;

function __isDate(o) {
  return typeof o === 'object' && __objToStr(o) === '[object Date]';
};
clone.__isDate = __isDate;

function __isArray(o) {
  return typeof o === 'object' && __objToStr(o) === '[object Array]';
};
clone.__isArray = __isArray;

function __isRegExp(o) {
  return typeof o === 'object' && __objToStr(o) === '[object RegExp]';
};
clone.__isRegExp = __isRegExp;

function __getRegExpFlags(re) {
  var flags = '';
  if (re.global) flags += 'g';
  if (re.ignoreCase) flags += 'i';
  if (re.multiline) flags += 'm';
  return flags;
};
clone.__getRegExpFlags = __getRegExpFlags;

return clone;
})();

if (typeof module === 'object' && module.exports) {
  module.exports = clone;
}

}).call(this,require("buffer").Buffer)
},{"buffer":14}],8:[function(require,module,exports){
!function(e){"use strict";var r=require("./lib/createQueryParameterFromConditionsAndIndices.js").createQueryParameterFromConditionsAndIndices,t=require("./lib/analyzeConditionsFromCriteria.js").analyzeConditionsFromCriteria,a=require("./lib/createIndicesFromObjectStore.js").createIndicesFromObjectStore,o=function(e,o,i){return r(t(e,!1),a(o),i&&i.priority?i.priority:[])},i=function(e,r){var t=r||(0,eval)("this").IDBKeyRange,a=null;if(!t)throw new Error("IDBKeyRange is not available.");if(!e.method)return null;switch(e.method[0]){case"only":a=1===e.value1.length?t[e.method[0]](e.value1[0]):t[e.method[0]](e.value1);break;case"upperBound":a=1===e.value1.length?t[e.method[0]](e.value1[0],e.method[1]):t[e.method[0]](e.value1,e.method[1]);break;case"lowerBound":a=1===e.value2.length?t[e.method[0]](e.value2[0],e.method[1]):t[e.method[0]](e.value2,e.method[1]);break;case"bound":a=1===e.value1.length?t[e.method[0]](e.value1[0],e.value2[0],e.method[1],e.method[2]):t[e.method[0]](e.value1,e.value2,e.method[1],e.method[2])}return a};e.criteria2IDBQuery={createQueryParameter:o,createIDBKeyRange:i}}((0,eval)("this").window||this);
},{"./lib/analyzeConditionsFromCriteria.js":11,"./lib/createIndicesFromObjectStore.js":12,"./lib/createQueryParameterFromConditionsAndIndices.js":13}],9:[function(require,module,exports){
!function(t){"use strict";var i=function(){this._keys=[],this._priority_keys=[]};i.prototype.init=function(t,i){for(var r=0,e=t.length;e>r;r+=1)this.set(t[r]);Array.isArray(i)?this._priority_keys=i:""!==i&&null!==i&&void 0!==i&&(this._priority_keys=[i])},i.prototype.set=function(t){this._keys[this._keys.length]={};var i=this._keys.length-1;if(null===t.keyPath)this._keys[i]=[];else if(Array.isArray(t.keyPath))for(var r=0,e=t.keyPath.length;e>r;r+=1)this._keys[i][t.keyPath[r]]=0;else this._keys[i][t.keyPath]=0},i.prototype.calc=function(t){for(var i=0,r=this._keys.length;r>i;i+=1)void 0!==this._keys[i][t]&&(this._keys[i][t]=1)},i.prototype.clone=function(){var t=new i;t._keys=[],t._priority_keys=[];for(var r=0,e=this._keys.length;e>r;r+=1){t._keys[r]||(t._keys[r]={});for(var s in this._keys[r])t._keys[r][s]=0}for(r=0,e=this._priority_keys.length;e>r;r+=1)t._priority_keys[r]=this._priority_keys[r];return t},i.prototype.getResult=function(){for(var t=[],i=0,r=this._keys.length;r>i;i+=1){var e=0,s=0,y=0;for(var n in this._keys[i])e+=1,s+=this._keys[i][n],~this._priority_keys.indexOf(n)&&(y+=1);0!==e&&e===s&&(t[t.length]={index:i,match_num:s,priority_num:y})}return t.sort(function(t,i){return t.priority_num<i.priority_num?1:t.priority_num>i.priority_num?-1:t.match_num<i.match_num?1:t.match_num>i.match_num?-1:0}),t},t.IndexAggregator=i}(this);
},{}],10:[function(require,module,exports){
!function(t){"use strict";var n=function(){this.keys=[],this.conditions=[]};n.prototype.addKeysFromCondition=function(t){"value"!==t.key_type||~this.keys.indexOf(t.left_key)||(this.keys[this.keys.length]=t.left_key)},n.prototype.addCondition=function(t,n){this.addKeysFromCondition(t),n?this.conditions=this.conditions.concat(t.clone().not().normalize()):this.conditions=this.conditions.concat(t.clone().normalize())},n.prototype.merge=function(t){var n=0,o=0;for(n=0,o=t.keys.length;o>n;n+=1)~this.keys.indexOf(t.keys[n])||(this.keys[this.keys.length]=t.keys[n]);for(n=0,o=t.conditions.length;o>n;n+=1)this.conditions[this.conditions.length]=t.conditions[n].clone();return this},n.prototype.clone=function(){var t=new n;t.keys=this.keys.concat();for(var o=0,i=this.conditions.length;i>o;o+=1)t.conditions[o]=this.conditions[o].clone();return t},n.prototype.not=function(){for(var t=[],o=0,i=this.conditions.length;i>o;o+=1){var e=new n;e.addCondition(this.conditions[o],!0),t[t.length]=e}return t},t.Query=n}(this);
},{}],11:[function(require,module,exports){
!function(n){"use strict";var t=require("kriteria").Kriteria||(0,eval)("this").Kriteria,e=require("./Query.js").Query,r=function a(n,r){var c=[],l=[],d=!!(n._not_flg^r),g=null,f=[],h=[],u=null,C=0,s=0;if(d?(c=n.getConditionOr(),l=n.getConditionAnd()):(c=n.getConditionAnd(),l=n.getConditionOr()),c.length>0){for(u=new e,C=0,s=c.length;s>C;C+=1)g=c[C],g.criteria instanceof t?h=o(h,a(g.criteria,d)):!d&&("in"===g.operator||"not_between"===g.operator)||d&&("not_in"===g.operator||"between"===g.operator)?h=o(h,i(g,d)):u.addCondition(g,d);f=f.concat(o([u],h))}if(l.length>0)for(C=0,s=l.length;s>C;C+=1)g=l[C],g.criteria instanceof t?f=f.concat(a(g.criteria,d)):!d&&("in"===g.operator||"not_between"===g.operator)||d&&("not_in"===g.operator||"between"===g.operator)?f=f.concat(i(g,d)):(u=new e,u.addCondition(g,d),f=f.concat([u]));return f},o=function(n,t){var e=[];if(n.length>0&&t.length)for(var r=0,o=n.length;o>r;r+=1)for(var i=0,a=t.length;a>i;i+=1)e[e.length]=n[r].clone().merge(t[i]);else e=0===n.length?t.concat():n.concat();return e},i=function(n,t){for(var r=n.normalize(),o=[],i=0,a=r.length;a>i;i+=1){var c=new e;t?c.addCondition(r[i].not()):c.addCondition(r[i]),o[o.length]=c}return o};n.analyzeConditionsFromCriteria=r}(this);
},{"./Query.js":10,"kriteria":18}],12:[function(require,module,exports){
!function(e){"use strict";var n=function(e){for(var n=[e],t=0,r=e.indexNames.length;r>t;t=t+1|0)n[n.length]=e.index(e.indexNames[t]);return n};e.createIndicesFromObjectStore=n}(this);
},{}],13:[function(require,module,exports){
!function(e){"use strict";var t=require("kriteria").Kriteria||(0,eval)("this").Kriteria,a=require("./IndexAggregator.js").IndexAggregator,l=function(e,l,h){var d=new a,g=0,k=0,o=0,y=0,v=0,p=0,f="",u=[];for(d.init(l,h),g=0,k=e.length;k>g;g+=1){var x=e[g],c=d.clone(),s={store:l[0],method:null,keypath:null,value1:null,value2:null,filter:t.parse({and:x.conditions}).matcher()},m=n(c,x);if(0===m.length)u[u.length]=s;else{var b=[],q=[[],[]],w=[],B=[],A=0;for(o=0,y=m.length;y>o;o+=1){var I=m[o].index,K=[];for(A=l[I],b=[],q=[[],[]],B=[],w=[],v=0,p=x.conditions.length;p>v;v+=1){var P=x.conditions[v],j=A.keyPath.indexOf(P.left_key);~j&&i(P,j,K)}for(f in K)_(K[f],f,{method:w,value:q,method_level:B,target_keypath:b});if(!r(w))break}if(o===m.length&&(b=[],q=[[],[]],B=[],w=[]),w.length>0){var C=[],F=0;for(v=0,p=w.length;p>v;v+=1)void 0!==w[v]&&B[v]>F&&(C=w[v].concat(),F=B[v]);u[u.length]={store:A,method:C,keypath:b,value1:q[0],value2:q[1],filter:t.parse({and:x.conditions}).matcher()}}else u[u.length]=s}}return u},n=function(e,t){for(var a=0,l=t.keys.length;l>a;a+=1)for(var n=0,i=t.conditions.length;i>n;n+=1){var _=t.conditions[n].operator;t.conditions[n].left_key===t.keys[a]&&"value"===t.conditions[n].key_type&&"ne"!==_&&"match"!==_&&"not_match"!==_&&e.calc(t.keys[a])}return e.getResult()},i=function(e,t,a){var l=e.left_key;switch(a[l]||(a[l]={keypath_index:t,val1:null,val2:null,flg_eq:!1,flg_lt:!1,flg_le:!1,flg_gt:!1,flg_ge:!1}),e.operator){case"eq":a[l].flg_eq=!0,a[l].flg_lt=!1,a[l].flg_le=!1,a[l].flg_gt=!1,a[l].flg_ge=!1,a[l].val1=e.right_key[0],a[l].val2=e.right_key[0];break;case"ne":break;case"lt":a[l].flg_eq||(a[l].flg_lt=!0,(null===a[l].val2||a[l].val2>e.right_key[0])&&(a[l].val2=e.right_key[0]));break;case"le":a[l].flg_eq||(a[l].flg_le=!0,a[l].flg_lt=!1,(null===a[l].val2||a[l].val2>e.right_key[0])&&(a[l].val2=e.right_key[0]));break;case"gt":a[l].flg_eq||(a[l].flg_gt=!0,(null===a[l].val1||a[l].val1<e.right_key[0])&&(a[l].val1=e.right_key[0]));break;case"ge":a[l].flg_eq||(a[l].flg_ge=!0,a[l].flg_gt=!1,(null===a[l].val1||a[l].val1<e.right_key[0])&&(a[l].val1=e.right_key[0]));break;case"match":case"not_match":}},_=function(e,t,a){var l=a.method,n=a.value,i=a.method_level,_=a.target_keypath;e.keypath_index>=0&&(void 0===i[e.keypath_index]&&(i[e.keypath_index]=0),e.flg_ge?e.flg_le?(l[e.keypath_index]=["bound",!1,!1],n[0][e.keypath_index]=e.val1,n[1][e.keypath_index]=e.val2,i[e.keypath_index]=2):e.flg_lt?(l[e.keypath_index]=["bound",!0,!1],n[0][e.keypath_index]=e.val1,n[1][e.keypath_index]=e.val2,i[e.keypath_index]=2):i[e.keypath_index]<=1&&(l[e.keypath_index]=["lowerBound",!1],n[1][e.keypath_index]=e.val1,i[e.keypath_index]=3):e.flg_gt?e.flg_le?(l[e.keypath_index]=["bound",!1,!0],n[0][e.keypath_index]=e.val1,n[1][e.keypath_index]=e.val2,i[e.keypath_index]=2):e.flg_lt?(l[e.keypath_index]=["bound",!0,!0],n[0][e.keypath_index]=e.val1,n[1][e.keypath_index]=e.val2,i[e.keypath_index]=2):i[e.keypath_index]<=1&&(l[e.keypath_index]=["lowerBound",!0],n[1][e.keypath_index]=e.val1,i[e.keypath_index]=3):e.flg_le?(l[e.keypath_index]=["upperBound",!1],n[0][e.keypath_index]=e.val2,i[e.keypath_index]=3):e.flg_lt?(l[e.keypath_index]=["upperBound",!0],n[0][e.keypath_index]=e.val2,i[e.keypath_index]=3):e.flg_eq&&(l[e.keypath_index]=["only"],n[0][e.keypath_index]=e.val1,n[1][e.keypath_index]=e.val2,i[e.keypath_index]=1),_[e.keypath_index]=t)},r=function(e){for(var t=!1,a=!1,l=0,n=e.length;n>l;l+=1)switch(e[l][0]){case"lowerBound":t=!0;break;case"upperBound":a=!0}return t&&a?!0:!1};e.createQueryParameterFromConditionsAndIndices=l}(this);
},{"./IndexAggregator.js":9,"kriteria":18}],14:[function(require,module,exports){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = Buffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192

/**
 * If `Buffer._useTypedArrays`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (compatible down to IE6)
 */
Buffer._useTypedArrays = (function () {
  // Detect if browser supports Typed Arrays. Supported browsers are IE 10+, Firefox 4+,
  // Chrome 7+, Safari 5.1+, Opera 11.6+, iOS 4.2+. If the browser does not support adding
  // properties to `Uint8Array` instances, then that's the same as no `Uint8Array` support
  // because we need to be able to add all the node Buffer API methods. This is an issue
  // in Firefox 4-29. Now fixed: https://bugzilla.mozilla.org/show_bug.cgi?id=695438
  try {
    var buf = new ArrayBuffer(0)
    var arr = new Uint8Array(buf)
    arr.foo = function () { return 42 }
    return 42 === arr.foo() &&
        typeof arr.subarray === 'function' // Chrome 9-10 lack `subarray`
  } catch (e) {
    return false
  }
})()

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (subject, encoding, noZero) {
  if (!(this instanceof Buffer))
    return new Buffer(subject, encoding, noZero)

  var type = typeof subject

  // Workaround: node's base64 implementation allows for non-padded strings
  // while base64-js does not.
  if (encoding === 'base64' && type === 'string') {
    subject = stringtrim(subject)
    while (subject.length % 4 !== 0) {
      subject = subject + '='
    }
  }

  // Find the length
  var length
  if (type === 'number')
    length = coerce(subject)
  else if (type === 'string')
    length = Buffer.byteLength(subject, encoding)
  else if (type === 'object')
    length = coerce(subject.length) // assume that object is array-like
  else
    throw new Error('First argument needs to be a number, array or string.')

  var buf
  if (Buffer._useTypedArrays) {
    // Preferred: Return an augmented `Uint8Array` instance for best performance
    buf = Buffer._augment(new Uint8Array(length))
  } else {
    // Fallback: Return THIS instance of Buffer (created by `new`)
    buf = this
    buf.length = length
    buf._isBuffer = true
  }

  var i
  if (Buffer._useTypedArrays && typeof subject.byteLength === 'number') {
    // Speed optimization -- use set if we're copying from a typed array
    buf._set(subject)
  } else if (isArrayish(subject)) {
    // Treat array-ish objects as a byte array
    for (i = 0; i < length; i++) {
      if (Buffer.isBuffer(subject))
        buf[i] = subject.readUInt8(i)
      else
        buf[i] = subject[i]
    }
  } else if (type === 'string') {
    buf.write(subject, 0, encoding)
  } else if (type === 'number' && !Buffer._useTypedArrays && !noZero) {
    for (i = 0; i < length; i++) {
      buf[i] = 0
    }
  }

  return buf
}

// STATIC METHODS
// ==============

Buffer.isEncoding = function (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.isBuffer = function (b) {
  return !!(b !== null && b !== undefined && b._isBuffer)
}

Buffer.byteLength = function (str, encoding) {
  var ret
  str = str + ''
  switch (encoding || 'utf8') {
    case 'hex':
      ret = str.length / 2
      break
    case 'utf8':
    case 'utf-8':
      ret = utf8ToBytes(str).length
      break
    case 'ascii':
    case 'binary':
    case 'raw':
      ret = str.length
      break
    case 'base64':
      ret = base64ToBytes(str).length
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = str.length * 2
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.concat = function (list, totalLength) {
  assert(isArray(list), 'Usage: Buffer.concat(list, [totalLength])\n' +
      'list should be an Array.')

  if (list.length === 0) {
    return new Buffer(0)
  } else if (list.length === 1) {
    return list[0]
  }

  var i
  if (typeof totalLength !== 'number') {
    totalLength = 0
    for (i = 0; i < list.length; i++) {
      totalLength += list[i].length
    }
  }

  var buf = new Buffer(totalLength)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

// BUFFER INSTANCE METHODS
// =======================

function _hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  assert(strLen % 2 === 0, 'Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16)
    assert(!isNaN(byte), 'Invalid hex string')
    buf[offset + i] = byte
  }
  Buffer._charsWritten = i * 2
  return i
}

function _utf8Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf8ToBytes(string), buf, offset, length)
  return charsWritten
}

function _asciiWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(asciiToBytes(string), buf, offset, length)
  return charsWritten
}

function _binaryWrite (buf, string, offset, length) {
  return _asciiWrite(buf, string, offset, length)
}

function _base64Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(base64ToBytes(string), buf, offset, length)
  return charsWritten
}

function _utf16leWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf16leToBytes(string), buf, offset, length)
  return charsWritten
}

Buffer.prototype.write = function (string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length
      length = undefined
    }
  } else {  // legacy
    var swap = encoding
    encoding = offset
    offset = length
    length = swap
  }

  offset = Number(offset) || 0
  var remaining = this.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase()

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexWrite(this, string, offset, length)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Write(this, string, offset, length)
      break
    case 'ascii':
      ret = _asciiWrite(this, string, offset, length)
      break
    case 'binary':
      ret = _binaryWrite(this, string, offset, length)
      break
    case 'base64':
      ret = _base64Write(this, string, offset, length)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leWrite(this, string, offset, length)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toString = function (encoding, start, end) {
  var self = this

  encoding = String(encoding || 'utf8').toLowerCase()
  start = Number(start) || 0
  end = (end !== undefined)
    ? Number(end)
    : end = self.length

  // Fastpath empty strings
  if (end === start)
    return ''

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexSlice(self, start, end)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Slice(self, start, end)
      break
    case 'ascii':
      ret = _asciiSlice(self, start, end)
      break
    case 'binary':
      ret = _binarySlice(self, start, end)
      break
    case 'base64':
      ret = _base64Slice(self, start, end)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leSlice(self, start, end)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toJSON = function () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function (target, target_start, start, end) {
  var source = this

  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (!target_start) target_start = 0

  // Copy 0 bytes; we're done
  if (end === start) return
  if (target.length === 0 || source.length === 0) return

  // Fatal error conditions
  assert(end >= start, 'sourceEnd < sourceStart')
  assert(target_start >= 0 && target_start < target.length,
      'targetStart out of bounds')
  assert(start >= 0 && start < source.length, 'sourceStart out of bounds')
  assert(end >= 0 && end <= source.length, 'sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length)
    end = this.length
  if (target.length - target_start < end - start)
    end = target.length - target_start + start

  var len = end - start

  if (len < 100 || !Buffer._useTypedArrays) {
    for (var i = 0; i < len; i++)
      target[i + target_start] = this[i + start]
  } else {
    target._set(this.subarray(start, start + len), target_start)
  }
}

function _base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function _utf8Slice (buf, start, end) {
  var res = ''
  var tmp = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    if (buf[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i])
      tmp = ''
    } else {
      tmp += '%' + buf[i].toString(16)
    }
  }

  return res + decodeUtf8Char(tmp)
}

function _asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++)
    ret += String.fromCharCode(buf[i])
  return ret
}

function _binarySlice (buf, start, end) {
  return _asciiSlice(buf, start, end)
}

function _hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function _utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i+1] * 256)
  }
  return res
}

Buffer.prototype.slice = function (start, end) {
  var len = this.length
  start = clamp(start, len, 0)
  end = clamp(end, len, len)

  if (Buffer._useTypedArrays) {
    return Buffer._augment(this.subarray(start, end))
  } else {
    var sliceLen = end - start
    var newBuf = new Buffer(sliceLen, undefined, true)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
    return newBuf
  }
}

// `get` will be removed in Node 0.13+
Buffer.prototype.get = function (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

// `set` will be removed in Node 0.13+
Buffer.prototype.set = function (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.')
  return this.writeUInt8(v, offset)
}

Buffer.prototype.readUInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  return this[offset]
}

function _readUInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    val = buf[offset]
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
  } else {
    val = buf[offset] << 8
    if (offset + 1 < len)
      val |= buf[offset + 1]
  }
  return val
}

Buffer.prototype.readUInt16LE = function (offset, noAssert) {
  return _readUInt16(this, offset, true, noAssert)
}

Buffer.prototype.readUInt16BE = function (offset, noAssert) {
  return _readUInt16(this, offset, false, noAssert)
}

function _readUInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    if (offset + 2 < len)
      val = buf[offset + 2] << 16
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
    val |= buf[offset]
    if (offset + 3 < len)
      val = val + (buf[offset + 3] << 24 >>> 0)
  } else {
    if (offset + 1 < len)
      val = buf[offset + 1] << 16
    if (offset + 2 < len)
      val |= buf[offset + 2] << 8
    if (offset + 3 < len)
      val |= buf[offset + 3]
    val = val + (buf[offset] << 24 >>> 0)
  }
  return val
}

Buffer.prototype.readUInt32LE = function (offset, noAssert) {
  return _readUInt32(this, offset, true, noAssert)
}

Buffer.prototype.readUInt32BE = function (offset, noAssert) {
  return _readUInt32(this, offset, false, noAssert)
}

Buffer.prototype.readInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null,
        'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  var neg = this[offset] & 0x80
  if (neg)
    return (0xff - this[offset] + 1) * -1
  else
    return this[offset]
}

function _readInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt16(buf, offset, littleEndian, true)
  var neg = val & 0x8000
  if (neg)
    return (0xffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt16LE = function (offset, noAssert) {
  return _readInt16(this, offset, true, noAssert)
}

Buffer.prototype.readInt16BE = function (offset, noAssert) {
  return _readInt16(this, offset, false, noAssert)
}

function _readInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt32(buf, offset, littleEndian, true)
  var neg = val & 0x80000000
  if (neg)
    return (0xffffffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt32LE = function (offset, noAssert) {
  return _readInt32(this, offset, true, noAssert)
}

Buffer.prototype.readInt32BE = function (offset, noAssert) {
  return _readInt32(this, offset, false, noAssert)
}

function _readFloat (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 23, 4)
}

Buffer.prototype.readFloatLE = function (offset, noAssert) {
  return _readFloat(this, offset, true, noAssert)
}

Buffer.prototype.readFloatBE = function (offset, noAssert) {
  return _readFloat(this, offset, false, noAssert)
}

function _readDouble (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 7 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 52, 8)
}

Buffer.prototype.readDoubleLE = function (offset, noAssert) {
  return _readDouble(this, offset, true, noAssert)
}

Buffer.prototype.readDoubleBE = function (offset, noAssert) {
  return _readDouble(this, offset, false, noAssert)
}

Buffer.prototype.writeUInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'trying to write beyond buffer length')
    verifuint(value, 0xff)
  }

  if (offset >= this.length) return

  this[offset] = value
}

function _writeUInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 2); i < j; i++) {
    buf[offset + i] =
        (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
            (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt16BE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, false, noAssert)
}

function _writeUInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffffffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 4); i < j; i++) {
    buf[offset + i] =
        (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt32BE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, false, noAssert)
}

Buffer.prototype.writeInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7f, -0x80)
  }

  if (offset >= this.length)
    return

  if (value >= 0)
    this.writeUInt8(value, offset, noAssert)
  else
    this.writeUInt8(0xff + value + 1, offset, noAssert)
}

function _writeInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fff, -0x8000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt16(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt16(buf, 0xffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt16LE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt16BE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, false, noAssert)
}

function _writeInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fffffff, -0x80000000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt32(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt32(buf, 0xffffffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt32LE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt32BE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, false, noAssert)
}

function _writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 23, 4)
}

Buffer.prototype.writeFloatLE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, false, noAssert)
}

function _writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 7 < buf.length,
        'Trying to write beyond buffer length')
    verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 52, 8)
}

Buffer.prototype.writeDoubleLE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, false, noAssert)
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (typeof value === 'string') {
    value = value.charCodeAt(0)
  }

  assert(typeof value === 'number' && !isNaN(value), 'value is not a number')
  assert(end >= start, 'end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  assert(start >= 0 && start < this.length, 'start out of bounds')
  assert(end >= 0 && end <= this.length, 'end out of bounds')

  for (var i = start; i < end; i++) {
    this[i] = value
  }
}

Buffer.prototype.inspect = function () {
  var out = []
  var len = this.length
  for (var i = 0; i < len; i++) {
    out[i] = toHex(this[i])
    if (i === exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...'
      break
    }
  }
  return '<Buffer ' + out.join(' ') + '>'
}

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function () {
  if (typeof Uint8Array !== 'undefined') {
    if (Buffer._useTypedArrays) {
      return (new Buffer(this)).buffer
    } else {
      var buf = new Uint8Array(this.length)
      for (var i = 0, len = buf.length; i < len; i += 1)
        buf[i] = this[i]
      return buf.buffer
    }
  } else {
    throw new Error('Buffer.toArrayBuffer not supported in this browser')
  }
}

// HELPER FUNCTIONS
// ================

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

var BP = Buffer.prototype

/**
 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
 */
Buffer._augment = function (arr) {
  arr._isBuffer = true

  // save reference to original Uint8Array get/set methods before overwriting
  arr._get = arr.get
  arr._set = arr.set

  // deprecated, will be removed in node 0.13+
  arr.get = BP.get
  arr.set = BP.set

  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BP.toArrayBuffer

  return arr
}

// slice(start, end)
function clamp (index, len, defaultValue) {
  if (typeof index !== 'number') return defaultValue
  index = ~~index;  // Coerce to integer.
  if (index >= len) return len
  if (index >= 0) return index
  index += len
  if (index >= 0) return index
  return 0
}

function coerce (length) {
  // Coerce length to a number (possibly NaN), round up
  // in case it's fractional (e.g. 123.456) then do a
  // double negate to coerce a NaN to 0. Easy, right?
  length = ~~Math.ceil(+length)
  return length < 0 ? 0 : length
}

function isArray (subject) {
  return (Array.isArray || function (subject) {
    return Object.prototype.toString.call(subject) === '[object Array]'
  })(subject)
}

function isArrayish (subject) {
  return isArray(subject) || Buffer.isBuffer(subject) ||
      subject && typeof subject === 'object' &&
      typeof subject.length === 'number'
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    var b = str.charCodeAt(i)
    if (b <= 0x7F)
      byteArray.push(str.charCodeAt(i))
    else {
      var start = i
      if (b >= 0xD800 && b <= 0xDFFF) i++
      var h = encodeURIComponent(str.slice(start, i+1)).substr(1).split('%')
      for (var j = 0; j < h.length; j++)
        byteArray.push(parseInt(h[j], 16))
    }
  }
  return byteArray
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(str)
}

function blitBuffer (src, dst, offset, length) {
  var pos
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length))
      break
    dst[i + offset] = src[i]
  }
  return i
}

function decodeUtf8Char (str) {
  try {
    return decodeURIComponent(str)
  } catch (err) {
    return String.fromCharCode(0xFFFD) // UTF 8 invalid char
  }
}

/*
 * We have to make sure that the value is a valid integer. This means that it
 * is non-negative. It has no fractional component and that it does not
 * exceed the maximum allowed value.
 */
function verifuint (value, max) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value >= 0, 'specified a negative value for writing an unsigned value')
  assert(value <= max, 'value is larger than maximum value for type')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifsint (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifIEEE754 (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
}

function assert (test, message) {
  if (!test) throw new Error(message || 'Failed assertion')
}

},{"base64-js":15,"ieee754":16}],15:[function(require,module,exports){
var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

	var PLUS   = '+'.charCodeAt(0)
	var SLASH  = '/'.charCodeAt(0)
	var NUMBER = '0'.charCodeAt(0)
	var LOWER  = 'a'.charCodeAt(0)
	var UPPER  = 'A'.charCodeAt(0)
	var PLUS_URL_SAFE = '-'.charCodeAt(0)
	var SLASH_URL_SAFE = '_'.charCodeAt(0)

	function decode (elt) {
		var code = elt.charCodeAt(0)
		if (code === PLUS ||
		    code === PLUS_URL_SAFE)
			return 62 // '+'
		if (code === SLASH ||
		    code === SLASH_URL_SAFE)
			return 63 // '/'
		if (code < NUMBER)
			return -1 //no match
		if (code < NUMBER + 10)
			return code - NUMBER + 26 + 26
		if (code < UPPER + 26)
			return code - UPPER
		if (code < LOWER + 26)
			return code - LOWER + 26
	}

	function b64ToByteArray (b64) {
		var i, j, l, tmp, placeHolders, arr

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4')
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		var len = b64.length
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(b64.length * 3 / 4 - placeHolders)

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length

		var L = 0

		function push (v) {
			arr[L++] = v
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
			push((tmp & 0xFF0000) >> 16)
			push((tmp & 0xFF00) >> 8)
			push(tmp & 0xFF)
		}

		if (placeHolders === 2) {
			tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
			push(tmp & 0xFF)
		} else if (placeHolders === 1) {
			tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
			push((tmp >> 8) & 0xFF)
			push(tmp & 0xFF)
		}

		return arr
	}

	function uint8ToBase64 (uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length

		function encode (num) {
			return lookup.charAt(num)
		}

		function tripletToBase64 (num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
		}

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
			output += tripletToBase64(temp)
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1]
				output += encode(temp >> 2)
				output += encode((temp << 4) & 0x3F)
				output += '=='
				break
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
				output += encode(temp >> 10)
				output += encode((temp >> 4) & 0x3F)
				output += encode((temp << 2) & 0x3F)
				output += '='
				break
		}

		return output
	}

	exports.toByteArray = b64ToByteArray
	exports.fromByteArray = uint8ToBase64
}(typeof exports === 'undefined' ? (this.base64js = {}) : exports))

},{}],16:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],17:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],18:[function(require,module,exports){
module.exports=require(1)
},{"./lib/Condition.js":19,"./lib/evaluation.js":20,"./lib/getProperty.js":21,"./lib/matchPrefix.js":22}],19:[function(require,module,exports){
module.exports=require(2)
},{}],20:[function(require,module,exports){
module.exports=require(3)
},{"./Condition.js":19}],21:[function(require,module,exports){
module.exports=require(4)
},{}],22:[function(require,module,exports){
module.exports=require(5)
},{}],23:[function(require,module,exports){
/* SLI2.js */

(function(cxt) {
  "use strict";

  var idbInit = require("./lib/idbInit.js").idbInit,
      Dml = require("./lib/Dml.js").Dml,
      Ddl = require("./lib/Ddl.js").Ddl,
      DatabaseDefinition = require("./lib/DatabaseDefinition.js").DatabaseDefinition,
      Table = require("./lib/Table.js").Table,
      Tasker = require("./lib/Tasker.js").Tasker,
      ERROR = require("./param/ERROR.js").ERROR;

  /**
  * @public
  * @class
  * @param {String} name - database name
  * @param {Object} opt - option
  *   opt.mode {String} -
  */
  var SLI2 = function SLI2(name, opt) {
    this._name = name;
    this.db = null;
    this.transaction = null;
    this._version = 0;
    this._upgrade_enable = true;
    this._mode = "";
    this._use_idb = false;
    this._opened = false;
    this._closed = false;
    this._upgrading = false;
    this._transacting = false;
    this.tables = {};
    this._idb_objects = null;
    this._tasker = new Tasker();

    this._tasker.auto_run = true;

    if(opt) {
      if(opt.mode) {
        this.setMode(opt.mode);
      }
    } else {
      this.useIndexedDB();
    }
  };

  /** constants */
  SLI2.USE_IDB = "idb";
  SLI2.NO_IDB = "no_idb";
  SLI2.READ_WRITE = "readwrite";
  SLI2.READ_ONLY = "readonly";
  SLI2.DEFAULT_UPGRADING_HANDLER = "sli2_upgrade";
  SLI2.DEFAULT_TRANSACTION_HANDLER = "sli2_transaction";

  /**
  * @public
  * @function
  * @returns {void}
  */
  SLI2.prototype.useIndexedDB = function useIndexedDB() {
    this._idb_objects = idbInit();

    if(this._idb_objects === null) {
      throw ERROR.idb_objects_not_exists;

    } else {
      if(this._mode === SLI2.NO_IDB) {
        this._opened = false;
      }
      this._mode = SLI2.USE_IDB;
      this._use_idb = true;
    }
  };

  /**
  * @public
  * @function
  * @param {String} mode -
  *   "idb" is available indexedDB
  *   "no_idb" is not available indexedDB(usable select method only)
  * @returns {void}
  */
  SLI2.prototype.setMode = function setMode(mode) {
    if(mode === SLI2.USE_IDB) {
      this.useIndexedDB();

    } else if(mode === SLI2.NO_IDB) {
      this._mode = SLI2.NO_IDB;
      this._idb_objects = null;
      this._use_idb = false;
      this._opened = true;
      this._closed = false;
    }
  };

  /**
  * @public
  * @static
  * @function
  * @returns {DatabaseDefinition}
  */
  SLI2.createDatabaseDefinition = function createDatabaseDefinition() {
    return new DatabaseDefinition();
  };

  /**
  * @public
  * @funciton
  * @param {String} name - database name
  * @param {Function} block_proc - request blocking process
  * @returns {Promise}
  */
  SLI2.prototype.deleteDatabase = function deleteDatabase(name, block_proc) {
    var that = this;

    return new Promise(function(fulfill, reject) {
      if(that._mode === SLI2.NO_IDB) {
        reject(ERROR.mode_is_no_idb);
        return;

      } else if(!that._use_idb) {
        reject(ERROR.idb_objects_not_used);
        return;

      } else {
        var req = that._idb_objects.indexedDB.deleteDatabase(name || that._name);
        req.onsuccess = function() {
          fulfill();
        };
        req.onerror = function() {
          reject();
        };
        req.onblocked = typeof block_proc === "function" ? block_proc : function() {
          console.log("deletedatabase blocking");
        };
      }
    });
  };

  /**
  * @private
  * @function
  * @returns {void}
  */
  SLI2.prototype._initTables = function _initTables() {
    var db = this.db;

    for(var i = 0, l = db.objectStoreNames.length; i < l; i = i + 1) {
      var table_name = db.objectStoreNames[i],
          table = new Table(table_name, null, this);

      this.tables[table_name] = table;
    }
  };

  /**
  * @private
  * @function
  * @returns {void}
  */
  SLI2.prototype._openTables = function _openTables(tra, handling, tables) {
    var _tables = tables || this.tables;

    for(var table_name in _tables) {
      this.tables[table_name].open(tra, handling);
    }
  };

  /**
  * @private
  * @function
  * @returns {void}
  */
  SLI2.prototype._closeTables = function _closeTables(handling, tables) {
    var _tables = tables || this.tables;

    for(var table_name in _tables) {
      this.tables[table_name].close(handling);
    }
  };

  /**
  * @private
  * @function
  * @return {void}
  */
  SLI2.prototype._destroyTables = function _destroyTables() {
    for(var table_name in this.tables) {
      this.tables[table_name].destroy();
    }
  };

  /**
  * @private
  * @funciton
  * @param {IDBDatabase} db -
  * @returns {void}
  */
  SLI2.prototype._initInOpen = function _initInOpen(db) {
    this.db = db;
    if(this._version === 0) {
      this._version = db.version;
    }
    this._opened = true;
    this._closed = false;
  };

  /**
  * @public
  * @function
  * @returns {Boolean}
  */
  SLI2.prototype.isUpgrading = function isUpgrading() {
    return this._upgrading;
  };

  /**
  * @public
  * @funciton
  * @returns {Boolean}
  */
  SLI2.prototype.isTransacting = function isTransacting() {
    return this._transacting;
  };

  /**
  * @public
  * @function
  * @param {DatabaseDefinition} db_def
  * @returns {Promise}
  */
  SLI2.prototype.open = function open(db_def) {
    var that = this,
        req = null,
        version_map = [],
        seq = [],
        map = {},
        i = 0, l = 0;

    return new Promise(function(fulfill, reject) {
      var error = null;

      if(that._mode === SLI2.NO_IDB) {
        reject(ERROR.mode_is_no_idb);
        return;

      } else if(that._opened) {
        reject(ERROR.already_open);
        return;

      } else if(!that._use_idb) {
        reject(ERROR.idb_objects_not_used);
        return;
      }

      // Managed by DatabaseDefinition
      if(db_def instanceof DatabaseDefinition) {
        new Promise(function(fulfill2, reject2) {
          version_map = db_def.getVersionMapStartWithVersion(1);

          if(that.db) {
            that.db.close();
          }
          if(!version_map) {
            reject2(ERROR.no_version_map(1));
            return;

          } else {
            // open current version
            seq = version_map.seq;
            map = version_map.map;

            req = that._idb_objects.indexedDB.open(that._name);

            req.onupgradeneeded = function(e) {
              // current version is '0'
              that._initInOpen(e.target.result);
              that.transaction = this.transaction;
              that._upgrading = true;
              that._initTables();
              that._openTables(this.transaction, "version_change");

//              this.transaction.onabort = function onabort() {
//                console.log("Upgrade transaction abort");
//              };
//              this.transaction.oncomplete = function oncomplete() {
//                console.log("Upgrade transaction complete");
//              };
//              this.transaction.onerror = function onerror() {
//                console.log("Upgrade transaction error");
//              };

              that._tasker.auto_run = false;

              for(i = 0, l = seq.length; !error && i < l; i = i + 1) {
                var definition = map[seq[i]];

                if(typeof definition === "function") {
                  definition(that);
                } else {
                  error = ERROR.no_definition(seq[i]);
                }
              }
              that._tasker.addTask(null, function(done) {
                that._version = seq[i - 1];
                that.transaction = null;
                that._upgrading = false;
                that.db = null;
                that._tasker.auto_run = true;

                done();
              })
              .runQueue();

            };
            req.onsuccess = function(e) {
              // current version is not '0'
              that._initInOpen(e.target.result);

              if(!error) {
                that._destroyTables();
                that._initTables();

                fulfill2();

              } else {
                reject2(error);
              }
            };
            req.onerror = function(e) {
              reject2(e.target.error);
            };
          }
        })
        .then(function() {
          return new Promise(function(fulfill2, reject2) {
            that.db.close();

            if(db_def.isLatestVersion(that._version)) {
              // start with version '0' or no upgrade

              req = that._idb_objects.indexedDB.open(that._name, that._version);

              req.onsuccess = function(e) {
                that._initInOpen(e.target.result);

                fulfill2();
              };
              req.onerror = function(e) {
                reject2(e.target.error);
              };

            } else {
              // current version is not '0' and need a upgrade
              version_map = db_def.getVersionMapStartWithVersion(that._version + 1);
              var latest_version = db_def.getLatestVersionForVersion(that._version);

              if(!version_map) {
                error = ERROR.no_version_map(that._version);

              } else {
                seq = version_map.seq;
                map = version_map.map;

                req = that._idb_objects.indexedDB.open(that._name, latest_version);

                req.onupgradeneeded = function(e) {
                  that._initInOpen(e.target.result);
                  that.transaction = this.transaction;
                  that._upgrading = true;
                  that._initTables();
                  that._openTables(this.transaction, "version_change");

                  that._tasker.auto_run = false;

                  for(i = 0, l = seq.length; !error && i < l; i = i + 1) {
                    var definition = map[seq[i]];

                    if(typeof definition === "function") {
                      definition(that);
                    } else {
                      error = ERROR.no_definition(seq[i]);
                    }
                  }
                  that._tasker.addTask(null, function(done) {
                    that._version = seq[i - 1];
                    that.transaction = null;
                    that._upgrading = false;
                    that.db = null;
                    that._tasker.auto_run = true;

                    done();
                  })
                  .runQueue();

                };
                req.onsuccess = function(e) {
                  that._initInOpen(e.target.result);

                  if(!error) {
                    that._destroyTables();
                    that._initTables();
                    fulfill2();

                  } else {
                    reject2(error);
                  }
                };
                req.onerror = function(e) {
                  reject2(e.target.error);
                };
              }
            }
          });
        })
        .then(function() {
          that._upgrade_enable = false;
          fulfill(that.db);
        })
        .catch(function(e) {
          reject(e);
        });

      } else {
        // no DatabaseDefinition
        that._upgrade_enable = true;

        if(that.db) {
          that.db.close();
        }

        req = that._idb_objects.indexedDB.open(that._name);

        req.onsuccess = function(e) {
          that._initInOpen(e.target.result);
          that._initTables();

          fulfill(that.db);
        };
        req.onerror = function(e) {
          reject(e.target.error);
        };
      }
    });
  };

  /**
  * @public
  * @function
  * @retuns {Promise}
  */
  SLI2.prototype.close = function close() {
    var that = this;

    return new Promise(function(fulfill) {
      that._tasker.addTask(null, function(done) {
        if(that.db) {
          that.db.close();
        }

        that._name = null;
        that.db = null;
        that.transaction = null;
        that._version = 0;
        that._upgrade_enable = true;
        that._mode = null;
        that._upgrading = false;
        that._transacting = false;
        that._opened = false;
        that._closed = true;
        that._tasker.terminate();

        that._destroyTables();

        that.tables = {};

        fulfill();
        done();
      });
    });
  };

  /**
  * @public
  * @function
  * @returns {Promise}
  */
  SLI2.prototype.destroy = function destroy() {
    var that = this;

    return this.close()
    .then(function() {
      that._use_idb = false;
      that._idb_objects = null;
      that.tables = null;
    });
  };

  /**
  * @public
  * @function
  * @returns {Number}
  */
  SLI2.prototype.getCurrentVersion = function getCurrentVersion() {
    return this._version;
  };

  /**
  * @public
  * @function
  * @returns {Number}
  */
  SLI2.prototype.getNewVersion = function getNewVersion() {
    if(this._mode === SLI2.NO_IDB) {
      throw ERROR.mode_is_no_idb;

    } else if(!this._opened) {
      throw ERROR.not_open;

    } else if(this._closed) {
      throw ERROR.closed;
    }

    this._version = this._version + 1;

    return this._version;
  };

  /**
  * @public
  * @function
  * @param {Mixed(String|String[])} tables - table names
  * @param {Stirng} type - readonly, readwrite, upgrade
  * @param {Function} func - transaction process
  * @returns {Promise}
  */
  SLI2.prototype.begin_transaction =
  SLI2.prototype.beginTransaction = function beginTransaction(table_names, type, func) {
    var that = this;

    return new Promise(function(fulfill, reject) {
      var _table_names = [],
          _tables = {},
          i = 0, l = 0;

      var destroy = function() {
        that.transaction = null;
        that._transacting = false;

        try {
          that._closeTables("sli2_transaction", _tables);

        } catch(err) {
          reject(err);
        }
      };

      if(Array.isArray(table_names)) {
        _table_names = table_names;
      } else {
        _table_names[0] = table_names;
      }

      if(that._mode === SLI2.NO_IDB) {
        reject(ERROR.mode_is_no_idb);

      } else if(!that._opened) {
        reject(ERROR.not_open);

      } else if(that._closed) {
        reject(ERROR.closed);

      } else if(!that._transacting) {
        that._transacting = true;

        // check table exist
        for(i = 0, l = _table_names.length; i < l; i = i + 1) {
          var table_name = _table_names[i];

          if(!that.tables[table_name]) {
            reject(ERROR.table_not_exist(table_name));
            return;
          } else {
            _tables[table_name] = that.tables[table_name];
          }
        }

        // get transaction
        var tra = that.db.transaction(_table_names, type);

        // set transaction
        tra.oncomplete = function() {
          destroy();
          fulfill();
        };
        tra.onabort = function() {
          that._tasker.terminate();
          destroy();
          reject(ERROR.transaction_abort("transaction"));
        };
        that.transaction = tra;

        try {
          that._openTables(tra, "sli2_transaction", _tables);

        } catch(err) {
          reject(err);
        }
      }

      if(typeof func === "function") {
        try {
          that._tasker.auto_run = false;

          func();

          that._tasker.addTask(null, function() {
            that._tasker.auto_run = true;
          })
          .runQueue();

        } catch(e) {
          that.rollback();
          destroy();
          reject(e);
        }
      }

    });
  };

  /**
  * @public
  * @function
  * @param {Function} exec - upgrade process
  * @param {Function} end - callback to process end
  * @returns {Promise}
  */
  SLI2.prototype.upgrade = function upgrade(exec, end) {
    var that = this;

    return new Promise(function(fulfill, reject) {
      var _exec = typeof exec === "function" ? exec : function() {},
          _end = typeof end === "function" ? end : function() {};

      if(that._mode === SLI2.NO_IDB) {
        reject(ERROR.mode_is_no_idb);

      } else if(!that._upgrade_enable) {
        reject(ERROR.update_unable);

      } else if(!that._opened) {
        reject(ERROR.not_open);

      } else if(that._closed) {
        reject(ERROR.closed);

      } else if(!that._upgrading) {
        that._upgrading = true;

        that.db.close();

        var req = that._idb_objects.indexedDB.open(that._name, that.getNewVersion());

        req.onupgradeneeded = function(e) {
          var db = e.target.result,
              tra = this.transaction;

          tra.onabort = function() {
            reject(ERROR.transaction_abort("upgrade"));
          };
          that.db = db;
          that.transaction = tra;
          that._openTables(tra, "sli2_upgrade");

          try {
            that._tasker.auto_run = false;

            _exec(db, tra);

            that._tasker.addTask(null, function() {
              that._tasker.auto_run = true;
            })
            .runQueue();
          } catch(e) {
            reject(e);
          }
        };
        req.onsuccess = function(e) {
          that._upgrading = false;
          if(that._upgrading === false) {
            that.db = e.target.result;
          }
          that.transaction = null;
          that._closeTables("sli2_upgrade");

          _end();
          fulfill();
        };
        req.onerror = function(e) {
          reject(ERROR.upgrade_error(e.target.error));
        };

      } else {
        try {
          _exec(that.db, that.transaction);
          _end();
          fulfill();
        } catch(e) {
          reject(e);
        }
      }

    });
  };

  /**
  * @public
  * @function
  * @params {Object} obj - object having the 'exec' method
  * @params {Function} func - callback function
  * @returns {void}
  */
  SLI2.prototype.addTask = function addTask(obj, func) {
    if(this._closed) {
      throw ERROR.closed;
    }

    return this._tasker.addTask(obj, func);
  };

  /**
  * @public
  * @function
  * @returns {void}
  * @description
  *   run process from task queue
  */
  SLI2.prototype.runQueue = function runQueue() {
    if(this._closed) {
      throw ERROR.closed;
    }

    return this._tasker.runQueue();
  };

  /**
  * @public
  * @funciton
  * @param {Stirng} name -
  * @param {Object} opt -
  * @retuns {Ddl}
  */
  SLI2.prototype.create_table =
  SLI2.prototype.createTable = function createTable(name, opt) {
    var _opt = opt ? opt : { autoIncrement: true };

    if(this._mode === SLI2.NO_IDB) {
      throw ERROR.mode_is_no_idb;

    } else if(!this._upgrade_enable) {
      throw ERROR.update_unable;

    } else if(!this._opened) {
      throw ERROR.not_open;

    } else if(this._closed) {
      throw ERROR.closed;

    }

    var ddl = new Ddl(this);

    return ddl.createTable(name, _opt);
  };

  /**
  * @public
  * @funciton
  * @param {String} name -
  * @returns {Ddl}
  */
  SLI2.prototype.drop_table =
  SLI2.prototype.dropTable = function dropTable(name) {
    if(this._mode === SLI2.NO_IDB) {
      throw ERROR.mode_is_no_idb;

    } else if(!this._upgrade_enable) {
      throw ERROR.update_unable;

    } else if(!this._opened) {
      throw ERROR.not_open;

    } else if(this._closed) {
      throw ERROR.closed;
    }

    var ddl = new Ddl(this);

    return ddl.dropTable(name);
  };

  /**
  * @public
  * @funciton
  * @param {String} table_name - target table name
  * @param {String} idx_name - target index name
  * @param {Object} opt - createIndex option
  * @returns {Ddl}
  */
  SLI2.prototype.create_index =
  SLI2.prototype.createIndex = function createIndex(table_name, idx_name, opt) {
    if(this._mode === SLI2.NO_IDB) {
      throw ERROR.mode_is_no_idb;

    } else if(!this._upgrade_enable) {
      throw ERROR.update_unable;

    } else if(!this._opened) {
      throw ERROR.not_open;

    } else if(this._closed) {
      throw ERROR.closed;

    } else if(!opt) {
      throw ERROR.no_option("createIndex");
    }

    var ddl = new Ddl(this);

    return ddl.createIndex(table_name, idx_name, opt);
  };

  /**
  * @public
  * @funciton
  * @param {String} table_name - target table name
  * @param {String} idx_name - target index name
  * @returns {Promise}
  */
  SLI2.prototype.drop_index =
  SLI2.prototype.dropIndex = function dropIndex(table_name, idx_name) {
    if(this._mode === SLI2.NO_IDB) {
      throw ERROR.mode_is_no_idb;

    } else if(!this._opened) {
      throw ERROR.not_open;

    } else if(!this._upgrade_enable) {
      throw ERROR.update_unable;

    } else if(this._closed) {
      throw ERROR.closed;
    }

    var ddl = new Ddl(this);

    return ddl.dropIndex(table_name, idx_name);
  };

  /**
  * @public
  * @function
  * @param {Function} selection
  * @returns {Dml}
  */
  SLI2.prototype.select = function select(selection) {
    if(!this._opened) {
      throw ERROR.not_open;

    } else if(this._closed) {
      throw ERROR.closed;
    }

    var dml = new Dml(this);

    return dml.select(selection);
  };

  /**
  * @public
  * @function
  * @param {String} table - insert target table
  * @param {Array} columns - insert target columns
  * @returns {Dml}
  */
  SLI2.prototype.insert_into =
  SLI2.prototype.insertInto = function insert_into(table, columns) {
    if(this._mode === SLI2.NO_IDB) {
      throw ERROR.mode_is_no_idb;

    } else if(!this._opened) {
      throw ERROR.not_open;

    } else if(this._closed) {
      throw ERROR.closed;
    }

    var dml = new Dml(this);

    return dml.insert_into(table, columns);
  };

  /**
  * @public
  * @function
  * @param {String} table - delete target table
  * @returns {Dml}
  */
  SLI2.prototype.delete_from =
  SLI2.prototype.deleteFrom = function delete_from(table) {
    if(this._mode === SLI2.NO_IDB) {
      throw ERROR.mode_is_no_idb;

    } else if(!this._opened) {
      throw ERROR.not_open;

    } else if(this._closed) {
      throw ERROR.closed;
    }

    var dml = new Dml(this);

    return dml.delete_from(table);
  };

  /**
  * @public
  * @function
  * @param {String} table - update target table
  * @returns {Dml}
  */
  SLI2.prototype.update = function update(table) {
    if(this._mode === SLI2.NO_IDB) {
      throw ERROR.mode_is_no_idb;

    } else if(!this._opened) {
      throw ERROR.not_open;

    } else if(this._closed) {
      throw ERROR.closed;
    }

    var dml = new Dml(this);

    return dml.update(table);
  };

  /**
  * @public
  * @function
  * @returns {void}
  */
  SLI2.prototype.rollback = function rollback() {
    if(this._mode === SLI2.NO_IDB) {
      throw ERROR.mode_is_no_idb;

    } else if(!this._opened) {
      throw ERROR.not_open;

    } else if(this._closed) {
      throw ERROR.closed;
    }

    if(this.transaction) {
      this.transaction.abort();
      this._tasker.terminate();
      this._tasker.auto_run = true;
    } else {
      throw ERROR.no_transaction;
    }
  };


  cxt.SLI2 = SLI2;

})((0, eval)("this").window || this);

},{"./lib/DatabaseDefinition.js":24,"./lib/Ddl.js":25,"./lib/Dml.js":26,"./lib/Table.js":30,"./lib/Tasker.js":31,"./lib/idbInit.js":34,"./param/ERROR.js":36}],24:[function(require,module,exports){
/* DatabaseDefinition */

(function(cxt) {
  "use strict";

  var ERROR = require("../param/ERROR.js").ERROR;

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

},{"../param/ERROR.js":36}],25:[function(require,module,exports){
/* Ddl.js */

(function(cxt) {
  "use strict";

  var Querable = require("./Querable.js").Querable,
      Table = require("./Table.js").Table,
      ERROR = require("../param/ERROR.js").ERROR;


  /**
  * @public
  * @class
  * @arguments Querable
  */
  var Ddl = function Ddl() {
    Querable.apply(this, arguments);
    this._set_create_table = false;
    this._set_drop_table = false;
    this._set_create_index = false;
    this._set_drop_index = false;
    this._table_name = "";
    this._index_name = "";
    this._option = {};
  };

  /* inherit */
  Ddl.prototype = Object.create(Querable.prototype, {
    constructor: {
      value: Ddl,
      enumerable: true,
      writable: false,
      configurable: true
    }
  });

  /**
  * @public
  * @funciton
  * @param {String} name - table name
  * @param {Object} opt - create table option
  * @returns {Ddl}
  */
  Ddl.prototype.create_table =
  Ddl.prototype.createTable = function create_table(name, opt) {
    if(this._set_create_table || this._set_drop_table || this._set_create_index || this._set_drop_index) {
      throw ERROR.invalid_description("create_table");
    }
    if(this._check_arguments && (arguments.length < 1 || arguments.length > 2)) {
      throw ERROR.invalid_argument("create_table");
    }

    this._set_create_table = true;
    this._table_name = name;
    this._option = opt;

    return this;
  };

  /**
  * @public
  * @funciton
  * @param {String} name - table name
  * @returns {Ddl}
  */
  Ddl.prototype.drop_table =
  Ddl.prototype.dropTable = function drop_table(name) {
    if(this._set_create_table || this._set_drop_table || this._set_create_index || this._set_drop_index) {
      throw ERROR.invalid_description("drop_table");
    }
    if(this._check_arguments && arguments.length !== 1) {
      throw ERROR.invalid_argument("drop_table");
    }

    this._set_drop_table = true;
    this._table_name = name;

    return this;
  };

  /**
  * @public
  * @function
  * @param {String} table_name - table name
  * @param {String} idx_name - index name
  * @param {Object} opt - create index option
  * @returns {Ddl}
  */
  Ddl.prototype.create_index =
  Ddl.prototype.createIndex = function create_index(table_name, idx_name, opt) {
    if(this._set_create_table || this._set_drop_table || this._set_create_index || this._set_drop_index) {
      throw ERROR.invalid_description("create_index");
    }
    if(this._check_arguments && arguments.length !== 3) {
      throw ERROR.invalid_argument("create_index");
    }

    this._set_create_index = true;
    this._table_name = table_name;
    this._index_name = idx_name;
    this._option = opt;

    return this;
  };

  /**
  * @public
  * @function
  * @param {String} table_name - table name
  * @param {String} idx_name - index name
  * @retusn {Ddl}
  */
  Ddl.prototype.drop_index =
  Ddl.prototype.dropIndex = function drop_index(table_name, idx_name) {
    if(this._set_create_table || this._set_drop_table || this._set_create_index || this._set_drop_index) {
      throw ERROR.invalid_description("drop_index");
    }
    if(this._check_arguments && arguments.length !== 2) {
      throw ERROR.invalid_argument("create_index");
    }

    this._set_drop_index = true;
    this._table_name = table_name;
    this._index_name = idx_name;

    return this;
  };

  /**
  * @private
  * @function
  * @returns {Boolean}
  */
  Ddl.prototype._isRunnable = function _isRunnable() {
    return this._set_create_table || this._set_drop_table || this._set_create_index || this._set_drop_index;
  };

  /**
  * @public
  * @function
  * @param {Function} func - callback function
  *   arguments[0] is idb operation result
  *   arguments[1] is function for _exec fulfilled
  *   arguments[2] is function for _exec rejected
  * @param {Function} end - _exec fulfilled
  * @param {Function} error - _exec rejected
  * @retuns {void}
  */
  Ddl.prototype.exec = function exec(func, end, error) {
    if(!this._isRunnable()) {
      throw ERROR.invalid_description("exec");
    }

    var that = this,
        sli2 = this._sli2_object,
        _end = typeof end === "function" ? end : function() {},
        _error = typeof error === "function" ? error : function() {};

    if(sli2 === void 0 || sli2 === null) {
      throw ERROR.querable_is_not_initialized;
    }

    var _exec_fulfill = function() {
          _end();
        },
        _exec_reject = function(at) {
          return function(err) {
            _error(ERROR.ddl_exec_error(at + " / " + err.message));
          };
        },
        _reject = function() {},
        _func = typeof func === "function" ? func : _exec_fulfill;

    // ##############################
    // *** Create Table Query ***
    // ##############################
    if(this._set_create_table) {
      _reject = _exec_reject("create_table");

      if(sli2.tables[this._table_name]) {
        _reject(ERROR.table_already_exist(this._table_name));

      } else {
        var table = new Table(this._table_name, null, sli2);

        table.create(
          this._option,
          function() {
            var handler = "";

            sli2.tables[that._table_name] = table;

            if(sli2.isUpgrading()) {
              handler = sli2.constructor.DEFAULT_UPGRADING_HANDLER;

            } else if(sli2.isTransacting()) {
              _reject(ERROR.cannot_execute("create_table in transacting"));
            }

            table.open(sli2.transactio, handler);
            _func(table, _exec_fulfill, _reject);
            if(!handler) {
              table.close(handler);
            }
          },
          _reject
        );
      }

    // ##############################
    // *** Drop Table Query ***
    // ##############################
    } else if(this._set_drop_table) {
      _reject = _exec_reject("drop_table");

      if(!sli2.tables[this._table_name]) {
        _reject(ERROR.table_not_exist(this._table_name));

      } else {
        sli2.tables[this._table_name].drop(
          function() {
            _func(null, _exec_fulfill, _reject);
          },
          _reject
        );
      }


    // ##############################
    // *** Create Index Query ***
    // ##############################
    } else if(this._set_create_index) {
      _reject = _exec_reject("create_index");

      if(!sli2.tables[this._table_name]) {
        _reject(ERROR.table_not_exist(this._table_name));

      } else {
        sli2.tables[this._table_name].createIndex(
          this._index_name, this._option,
          function() {
            _func(null, _exec_fulfill, _reject);
          },
          _reject
        );
      }

    // ##############################
    // *** Drop Index Query ***
    // ##############################
    } else if(this._set_drop_index) {
      _reject = _exec_reject("drop_index");

      if(!sli2.tables[this._table_name]) {
        _reject(ERROR.table_not_exist(this._table_name));

      } else {
        sli2.tables[this._table_name].dropIndex(
          this._index_name,
          function() {
            _func(null, _exec_fulfill, _reject);
          },
          _reject
        );
      }

    }
  };


  cxt.Ddl = Ddl;

}(this));

},{"../param/ERROR.js":36,"./Querable.js":27,"./Table.js":30}],26:[function(require,module,exports){
/* Dml.js */

(function(cxt) {
  "use strict";

  var global = (0, eval)("this"),
      ERROR = require("../param/ERROR.js").ERROR,
      Querable = require("./Querable.js").Querable,
      Kriteria = require("Kriteria").Kriteria || global.Kriteria,
      SelectionAggregator = require("./SelectionAggregator.js").SelectionAggregator,
      arraySortWithObjectElement =
        require("./arraySortWithObjectElement.js").arraySortWithObjectElement,
      arrayUniqueMerge = require("./arrayUniqueMerge.js").arrayUniqueMerge,
      setFunction = require("./setFunction.js").setFunction,
      async = require("async"),
      clone = require("clone");


  /**
  * @public
  * @class
  * @arguments Querable
  */
  var Dml = function Dml(/*sli2*/) {
    Querable.apply(this, arguments);
    //this._sli2_object = sli2;
    this._check_arguments = true;
    this._set_select = false;
    this._set_from = false;
    this._set_as = false;
    this._set_insert = false;
    this._set_delete = false;
    this._set_update = false;
    this._set_set = false;
    this._set_join = false;
    this._set_where = false;
    this._set_group_by = false;
    this._set_having = false;
    this._set_order_by = false;
    this._set_limit = false;
    this._limit_num = 0;
    this._set_offet = false;
    this._ready_offset = false;
    this._offset_num = 0;
    this._selection = null;
    this._select_table = "";
    this._table_alias = "";
    this._select_input_query = null;
    this._select_input_array = null;
    this._insert_table = "";
    this._insert_columns = [];
    this._delete_table = "";
    this._update_table = "";
    this._update_data = "";
    this._joins = [];
    this._where = null;
    this._groupings = [];
    this._having = null;
    this._orderings = [];
    this._insert_array_values = [];
    this._insert_object_values = [];
    this._union_queries = [];
    this._union_all_queries = [];
    this._must_be_select = false;
  };

  /* inherit */
  Dml.prototype = Object.create(Querable.prototype, {
    constructor: {
      value: Dml,
      enumerable: true,
      writable: false,
      configurable: true
    }
  });

  /**
  * @public
  * @function
  * @returns {Boolean}
  */
  Dml.prototype.isSelectQuery = function isSelectQuery() {
    return !!(!this._set_insert && this._set_select && this._set_from);
  };

  /**
  * @public
  * @function
  * @returns {Boolean}
  */
  Dml.prototype.isInsertQuery = function isInsertQuery() {
    return !!(this._set_insert);
  };

  /**
  * @public
  * @function
  * @returns {Boolean}
  */
  Dml.prototype.isDeleteQuery = function isDeleteQuery() {
    return !!(this._set_delete);
  };

  /**
  * @public
  * @function
  * @returns {Boolean}
  */
  Dml.prototype.isUpdateQuery = function isUpdateQuery() {
    return !!(this._set_update);
  };

  /**
  * @public
  * @function
  * @param {Boolean}
  * @returns {void}
  */
  Dml.prototype.forceSelectQuery = function forceSelectQuery(flg) {
    this._must_be_select = flg;
  };

  /**
  * @public
  * @function
  * @param {Dml} querable -
  * @param {String} type - 'union' or 'union_all'
  * @returns {void}
  */
  Dml.prototype.addUnions = function addUnions(querable, type) {
    var unions = querable.getUnions(type),
        new_unions = [];

    for(var i = 0, l = unions.length; i < l; i = i + 1) {
      new_unions[new_unions.length] = unions[i];
    }
    new_unions[new_unions.length] = querable;

    if(type === "union") {
      this._union_queries = new_unions;
    } else if(type === "union_all") {
      this._union_all_queries = new_unions;
    }

    querable.clearUnions(type);
  };

  /**
  * @public
  * @function
  * @param {String} type - 'union' or 'union_all'
  * @returns {Dml[]}
  */
  Dml.prototype.getUnions = function getUnions(type) {
    if(type === "union") {
      return this._union_queries;
    } else if(type === "union_all") {
      return this._union_all_queries;
    } else {
      return [];
    }
  };

  /**
  * @public
  * @function
  * @params {String} type - 'union' or 'union_all'
  * @returns {void}
  */
  Dml.prototype.clearUnions = function clearUnions(type) {
    if(type === "union") {
      this._union_queries = [];
    } else if(type === "union_all") {
      this._union_all_queries = [];
    }
  };

  /**
  * @public
  * @function
  * @returns {String}
  */
  Dml.prototype.getTableName = function getTableName() {
    if(this.isInsertQuery()) {
      return this._insert_table;

    } else if(this._select_input_query) {
      return this._table_alias || "";

    } else if(this.isSelectQuery()) {
      return this._table_alias || this._select_table || "";

    } else if(this.isDeleteQuery()) {
      return this._delete_table;

    } else if(this.isUpdateQuery()) {
      return this._update_table;

    } else {
      return "";
    }
  };

  /**
  * @public
  * @function
  * @returns {String[]}
  */
  Dml.prototype.getTableNames = function getTableNames() {
    var table_names = [];

    if(this._select_table) {
      table_names[table_names.length] = this._select_table;
    }
    if(this._table_alias) {
      table_names[table_names.length] = this._table_alias;
    }

    for(var i = 0, l = this._joins.length; i < l; i = i + 1) {
      var alias = this._joins[i][3];

      if(alias) {
        table_names[table_names.length] = alias;
      }
    }

    return table_names;
  };

  /**
  * @public
  * @function
  * @param {Mixed(Function|undefined)} selection - table columun select function
  * @returns {Dml}
  * @description
  *   select table columns. when argument is undefined, get all columns.
  */
  Dml.prototype.select = function select(selection) {
    if(!(!this._set_select && !this._set_values && !this._set_delete && !this._set_update)) {
      throw ERROR.invalid_description("select");
    }
    if(this._check_arguments && arguments.length !== 0 && arguments.length !== 1 &&
       typeof selection !== "function" && selection !== void 0) {
      throw ERROR.invalid_argument("select");
    }

    this._set_select = true;
    this._selection = selection;

    return this;
  };

  /**
  * @public
  * @function
  * @param {Mixed(String|Dml|Object[]|Object)*} arguments - select target
  * @returns {Dml}
  * @description
  *   USAGE:
  *   select().from("table_name")
  *   select().from(select().from("table_name"))
  *   select().from([data1, data2, data3...])
  *   select().from({ "table_name1": "alias1", "table_name2": "alias2"... })
  */
  Dml.prototype.from = function from() {
    if(!(this._set_select && !this._set_from && !this._set_join && !this._set_where &&
        !this._set_group_by && !this._set_having && !this._set_order_by && !this._set_limit)) {
      throw ERROR.invalid_description("from");
    }
    if(this._check_arguments && arguments.length === 0) {
      throw ERROR.invalid_argument("from");
    }

    this._set_from = true;

    for(var i = 0, l = arguments.length; i < l; i = i + 1) {
      var arg = arguments[i];

      if(typeof arg === "string" || arg instanceof String) {
        // select * from "table"
        if(i === 0) {
          this._select_table = arg;
        } else {
          this.join(arg);
        }

      } else if(arg instanceof Dml) {
        // select * from (select * ...)
        if(arg.isSelectQuery()) {
          if(i === 0) {
            this._select_input_query = arg;
          } else {
            this.join(arg);
          }
        } else {
          throw ERROR.invalid_argument("from");
        }

      } else if(Array.isArray(arg)) {
        // select * from [data1, data2, data3...]
        if(i === 0) {
          this._select_input_array = arg;
          this._table_alias = "left";
        } else {
          this.join(arg);
        }

      } else {
        // select * from { "table": "alias" }
        for(var key in arg) {
          if(i === 0) {
            this._select_table = key;
            this.as(arg[key]);
          } else {
            this.join(key).as(arg[key]);
          }
        }
      }
    }

    return this;
  };

  /**
  * @public
  * @function
  * @param {String} alias - table name alias
  * @returns {Dml}
  */
  Dml.prototype.as = function as(alias) {
    if(!(this._set_select && (this._set_from || this._set_join) && !this._set_as && !this._set_where &&
        !this._set_group_by && !this._set_having && !this._set_order_by && !this._set_limit)) {
      throw ERROR.invalid_description("as");
    }
    if(this._check_arguments &&
        !(typeof alias === "string" || alias instanceof String && alias !== "")) {
      throw ERROR.invalid_argument("as");
    }

    this._set_as = true;

    if(this._set_join) {
      if(this._joins[this._joins.length - 1]) {
        this._joins[this._joins.length - 1][3] = alias;
      }
    } else {
      this._table_alias = alias;
    }

    return this;
  };

  /**
  * @public
  * @function
  * @param {String} table - insert target table
  * @param {Mixed(String[]|undefined)} columns - insert target columns
  * @returns {Dml}
  */
  Dml.prototype.insert_into =
  Dml.prototype.insertInto = function insert_into(table, columns) {
    if(!(!this._must_be_select && !this._set_select && !this._set_insert &&
        !this._set_delete && !this._set_update)) {
      throw ERROR.invalid_description("insert_into");
    }
    if(this._check_arguments && arguments.length !== 1 && arguments.length !== 2) {
      throw ERROR.invalid_argument("insert_into");
    }

    this._set_insert = true;
    this._insert_table = table;
    if(Array.isArray(columns) && columns.length > 0) {
      this._insert_columns = columns;
    }

    return this;
  };

  /**
  * @public
  * @function
  * @param {String} table - delete target table
  * @returns {Dml}
  */
  Dml.prototype.delete_from =
  Dml.prototype.deleteFrom = function delete_from(table) {
    if(!(!this._must_be_select && !this._set_select && !this._set_insert &&
        !this._set_delete && !this._set_update)) {
      throw ERROR.invalid_description("delete_from");
    }
    if(this._check_arguments && arguments.length !== 1) {
      throw ERROR.invalid_argument("delete_from");
    }

    this._set_delete = true;
    this._delete_table = table;

    return this;
  };

  /**
  * @public
  * @function
  * @param {String} table - update target table
  * @returns {Dml}
  */
  Dml.prototype.update = function update(table) {
    if(!(!this._must_be_select && !this._set_select && !this._set_insert &&
        !this._set_delete && !this._set_update)) {
      throw ERROR.invalid_description("update");
    }
    if(this._check_arguments && arguments.length !== 1) {
      throw ERROR.invalid_argument("update");
    }

    this._set_update = true;
    this._update_table = table;

    return this;
  };

  /**
  * @public
  * @function
  * @param {Object} data - update data
  * @returns {Dml}
  */
  Dml.prototype.set = function set(data) {
    if(!(this._set_update)) {
      throw ERROR.invalid_argument("set");
    }
    if(this._check_arguments && arguments.length !== 1) {
      throw ERROR.invalid_argument("set");
    }

    this._set_set = true;
    this._update_data = data;

    return this;
  };

  /**
  * @public
  * @function
  * @param {Mixed(Dml|String|Object[])} join_target - joins data
  * @param {Mixed(Kriteria|Function)} kriteria - join condition
  * @param {String} type - 'inner', 'left', 'right'
  * @returns {Dml}
  */
  Dml.prototype.join = function join(join_target, kriteria, type) {
    if(!(this._set_select && this._set_from && !this._set_where && !this._set_group_by &&
        !this._set_having && !this._set_order_by && !this._set_limit)) {
      throw ERROR.invalid_description("join");
    }
    if(this._check_arguments && (arguments.length === 0 || arguments.length > 3)) {
      throw ERROR.invalid_argument("join");
    }

    var kri = null,
        _type = type || "inner";

    if(arguments.length >= 2) {
      if(typeof kriteria === "function") {
        kri = new Kriteria();
        kriteria(kri);
      } else if(kriteria instanceof Kriteria){
        kri = kriteria;
      }
    }

    this._set_join = true;
    this._set_as = false;

    var idx = this._joins.length;

    if(join_target instanceof Dml) {
      /*
        0: querable
        1: kriteria
        2: join object = null
        3: alias = ""
        4: type
      */
      this._joins[idx] = [join_target, kri, null, "", _type];

    } else if(typeof join_target === "string" || join_target instanceof String) {
      // join_taget is table_name
      // create select-query from join_target
      this._joins[idx] = [
        new Dml(this._sli2_object).select().from(join_target), kri, null, join_target, _type
      ];

    } else if(Array.isArray(join_target)) {
      /*
        0: querable = null
        1: kriteria
        2: join object
        3: alias = ""
        4: type
      */
      this._joins[idx] = [null, kri, join_target, "right_" + (idx + 1), _type];

    } else if(this._check_arguments) {
      throw ERROR.invalid_argument("join");
    }

    return this;
  };

  /**
  * @public
  * @function
  * @param {Mixed(Dml|Object[])} join_target - joins data
  * @param {Mixed(Kriteria|Function)} kriteria - join condition
  * @returns {Dml}
  */
  Dml.prototype.inner_join =
  Dml.prototype.innerJoin = function inner_join(join_target, kriteria) {
    return this.join(join_target, kriteria, "inner");
  };

  /**
  * @public
  * @function
  * @param {Mixed(Dml|Object[])} join_target - joins data
  * @param {Mixed(Kriteria|Function)} kriteria - join condition
  * @returns {Dml}
  */
  Dml.prototype.left_join =
  Dml.prototype.leftJoin = function left_join(join_target, kriteria) {
    return this.join(join_target, kriteria, "left");
  };

  /**
  * @public
  * @function
  * @param {Mixed(Dml|Object[])} join_target - joins data
  * @param {Mixed(Kriteria|Function)} kriteria - join condition
  * @returns {Dml}
  */
  Dml.prototype.right_join =
  Dml.prototype.rightJoin = function right_join(join_target, kriteria) {
    return this.join(join_target, kriteria, "right");
  };

  /**
  * @public
  * @function
  * @param {Mixed(Kriteria|Function)} kriteria - ope  rating condition
  * @returns {Dml}
  */
  Dml.prototype.where = function where(kriteria) {
    if(!((this._set_select && this._set_from || this._set_delete ||
        this._set_update && this._set_set) &&
        !this._set_where && !this._set_group_by && !this._set_having && !this._set_order_by &&
        !this._set_limit)) {
      throw ERROR.invalid_description("where");
    }
    if(this._check_arguments && arguments.length !== 1) {
      throw ERROR.invalid_argument("where");
    }

    var kri = null;

    if(typeof kriteria === "function") {
      kri = new Kriteria();
      kriteria(kri);
    } else {
      kri = kriteria;
    }

    this._set_where = true;
    this._where = kri;

    return this;
  };

  /**
  * @public
  * @function
  * @param {Mixed(...String|String[])} - grouping target names
  * @returns {Dml}
  */
  Dml.prototype.group_by =
  Dml.prototype.groupBy = function group_by() {
    if(!(this._set_select && this._set_from && !this._set_group_by &&
        !this._set_order_by && !this._set_having && !this._set_limit)) {
      throw ERROR.invalid_description("group_by");
    }
    if(this._check_arguments &&
       (arguments.length === 0 || Array.isArray(arguments[0]) && arguments[0].length === 0)) {
      throw ERROR.invalid_argument("group_by");
    }

    var i = 0, l = 0;

    this._set_group_by = true;

    this._groupings = [];
    if(Array.isArray(arguments[0])) {
      for(i = 0, l = arguments[0].length; i < l; i = i + 1) {
        this._groupings[this._groupings.length] = arguments[0][i];
      }
    } else {
      for(i = 0, l = arguments.length; i < l; i = i + 1) {
        this._groupings[this._groupings.length] = arguments[i];
      }
    }

    return this;
  };

  /**
  * @public
  * @function
  * @param {Mixed(Kriteria|Function)} kriteria - criteria condition after group_by
  * @returns {Dml}
  */
  Dml.prototype.having = function having(kriteria) {
    if(!(this._set_select && this._set_from && this._set_group_by &&
        !this._set_order_by && !this._set_having && !this._set_limit)) {
      throw ERROR.invalid_description("having");
    }
    if(this._check_arguments && arguments.length !== 1) {
      throw ERROR.invalid_argument("having");
    }

    var kri = null;

    if(typeof kriteria === "function") {
      kri = new Kriteria();
      kriteria(kri);
    } else {
      kri = kriteria;
    }

    this._set_having = true;
    this._having = kri;

    return this;
  };

  /**
  * @public
  * @function
  * @returns {Dml}
  */
  Dml.prototype.union = function union() {
    if(!(this.isSelectQuery() && !this._set_order_by && !this._set_limit)
       || this._union_all_queries.length > 0) {
      throw ERROR.invalid_description("union");
    }

    var new_querable = new Dml(this._sli2_object);
    new_querable.forceSelectQuery(true);
    new_querable.addUnions(this, "union");

    return new_querable;
  };

  /**
  * @public
  * @function
  * @returns {Dml}
  */
  Dml.prototype.union_all =
  Dml.prototype.unionAll = function union_all() {
    if(!(this.isSelectQuery() && !this._set_order_by && !this._set_limit)
       || this._union_queries.length > 0) {
      throw ERROR.invalid_description("union_all");
    }

    var new_querable = new Dml(this._sli2_object);
    new_querable.forceSelectQuery(true);
    new_querable.addUnions(this, "union_all");

    return new_querable;
  };

  /**
  * @public
  * @function
  * @param {Mixed(...String|String[]|Object[])} - ordering target names
  * @returns {Dml}
  */
  Dml.prototype.order_by =
  Dml.prototype.orderBy = function order_by() {
    if(!(this._set_select && this._set_from && !this._set_order_by && !this._set_limit)) {
      throw ERROR.invalid_description("order_by");
    }
    if(this._check_arguments &&
       (arguments.length === 0 || Array.isArray(arguments[0]) && arguments[0].length === 0)) {
      throw ERROR.invalid_argument("order_by");
    }

    var i = 0, l = 0;

    this._set_order_by = true;

    this._orderings = [];
    if(Array.isArray(arguments[0])) {
      for(i = 0, l = arguments[0].length; i < l; i = i + 1) {
        this._orderings[this._orderings.length] = arguments[0][i];
      }
    } else {
      for(i = 0, l = arguments.length; i < l; i = i + 1) {
        this._orderings[this._orderings.length] = arguments[i];
      }
    }

    return this;
  };

  /**
  * @public
  * @finction
  * @param {Number} n - 'limit'(when argument number is 1) or 'offset'(when argument number is 2)
  * @param {Number} m - 'limit'(when argument number is 2)
  * @returns {Dml}
  */
  Dml.prototype.limit = function limit(n, m) {
    if(!(this._set_select && this._set_from && !this._set_limit)) {
      throw ERROR.invalid_description("limit");
    }
    if(this._check_arguments &&
       arguments.length === 0 || arguments.length > 2 ||
       (arguments.length > 0 && (Number.isNaN(+arguments[0]) || arguments[0] < 0)) ||
       (arguments.length > 1 && (Number.isNaN(+arguments[1]) || arguments[1] < 0))) {
      throw ERROR.invalid_argument("limit");
    }

    this._set_limit = true;

    if(arguments.length === 1) {
      this._limit_num = n|0;

    } else if(arguments.length === 2) {
      this._offset_num = n|0;
      this._limit_num = m|0;
    }

    return this;
  };

  /**
  * @public
  * @function
  * @param {Number} n - offset number
  * @returns {Dml}
  */
  Dml.prototype.offset = function offset(n) {
    if(!(this._set_limit && !this._set_offet)) {
      throw ERROR.invalid_description("offset");
    }
    if(this._check_arguments && arguments.length === 1 &&
       (Number.isNaN(+arguments[0]) || arguments[0] < 0)) {
      throw ERROR.invalid_argument("offset");
    }

    this._set_offet = true;

    this._offset_num = n;

    return this;
  };
  /**
  * @public
  * @function
  * @param {Mixed(...String|Array)} - data for inserted
  * @returns {Dml}
  */
  Dml.prototype.values = function values() {
    if(!(this._set_insert && !this._set_values)) {
      throw ERROR.invalid_description("values");
    }
    if(this._check_arguments &&
       (arguments.length === 0 || Array.isArray(arguments[0]) && arguments[0].length === 0)) {
      throw ERROR.invalid_argument("values");
    }

    var has_literal = false,
        i = 0, l = 0;

    this._set_values = true;
    this._insert_array_values = [];
    this._insert_object_values = [];

    for(i = 0, l = arguments.length; i < l; i = i + 1) {
      var arg = arguments[i];

      if(Array.isArray(arg)) {
        this._insert_array_values[this._insert_array_values.length] = arg;

      } else if(arg.constructor === Object) {
        this._insert_object_values[this._insert_object_values.length] = arg;

      } else {
        has_literal = true;
        break;
      }
    }

    if(has_literal) {
      this._insert_array_values = [[]];
      this._insert_object_values = [];

      for(i = 0, l = arguments.length; i < l; i = i + 1) {
        this._insert_array_values[0][i] = arguments[i];
      }
    }

    return this;
  };

  /**
  * @private
  * @function
  * @returns {Boolean}
  */
  Dml.prototype._isRunnable = function _isRunnable() {
    return this._set_select && this._set_from || this._set_insert ||
           this._set_delete || this._set_update && this._set_set;
  };

  /**
  * @public
  * @function
  * @param {Function} func - callback function
  *   arguments[0] is idb operation result
  *   arguments[1] is function for _exec fulfilled
  *   arguments[2] is function for _exec rejected
  * @param {Function} end - _exec fulfilled
  * @param {Function} error - _exec rejected
  * @retuns {void}
  */
  Dml.prototype.exec = function exec(func, end, error) {
    if(!this._isRunnable()) {
      throw ERROR.invalid_description("exec");
    }

    var that = this,
        sli2 = this._sli2_object,
        _end = typeof end === "function" ? end : function() {},
        _error = typeof error === "function" ? error : function() {},
        union_rows = [],
        i = 0, l = 0,
        j = 0, l2 = 0,
        k = 0, l3 = 0;

    if(sli2 === void 0 || sli2 === null) {
      throw ERROR.querable_is_not_initialized;
    }

    var _exec_fulfill = function() {
          _end();
        },
        _exec_reject = function(at) {
          return function(err) {
            _error(ERROR.dml_exec_error(at + " / " + err.message));
          };
        },
        _reject = function() {},
        _func = typeof func === "function" ? func : _exec_fulfill;

    // ##############################
    // *** Insert Query ***
    // ##############################
    if(that.isInsertQuery()) {
      _reject = _exec_reject("insert_into");

      if(!sli2.tables[that._insert_table]) {
        _reject(ERROR.table_not_exist(that._insert_table));
        return;
      }

      //_func = typeof func === "function" ? func : _exec_fulfill;

      if(that._insert_array_values.length > 0 || that._insert_object_values.length > 0) {
        var insert_data = [];

        if(that._insert_array_values.length > 0) {
          if(that._insert_columns.length > 0) {
            for(i = 0, l = that._insert_array_values.length; i < l; i = i + 1) {
              insert_data[i] = {};

              for(j = 0, l2 = that._insert_columns.length; j < l2; j = j + 1) {
                insert_data[i][that._insert_columns[j]] = that._insert_array_values[i][j];
              }
            }

          } else {
            // TODO
            // tableからschemaを取得する
            _reject(new Error("unsupported command."));
          }
        }

        if(that._insert_object_values.length > 0) {
          for(i = 0, l = that._insert_object_values.length; i < l; i = i + 1) {
            insert_data[insert_data.length] = that._insert_object_values[i];
          }
        }

        sli2.tables[that._insert_table].add(
          insert_data,
          function(num) {
            _func(num, _exec_fulfill, _reject);
          }, _reject
        );

      } else if(that._set_select) {
        // TODO
        _reject(new Error("unsupported command."));

      } else {
        _reject(ERROR.invalid_description("insert_into"));
      }

    // ##############################
    // *** Delete Query ***
    // ##############################
    } else if(that.isDeleteQuery()) {
      _reject = _exec_reject("delete_from");

      if(!sli2.tables[that._delete_table]) {
        _reject(ERROR.table_not_exist(that._delete_table));
        return;
      }

      if(that._where) {
        sli2.tables[that._delete_table].removeForQuery(
          that._where,
          function(num) {
            _func(num, _exec_fulfill, _reject);
          }, _reject
        );

      } else {
        sli2.tables[that._delete_table].removeAll(
          function(num) {
            _func(num, _exec_fulfill, _reject);
          }, _reject
        );
      }

    // ##############################
    // *** Update Query ***
    // ##############################
    } else if(that.isUpdateQuery()) {
      if(!sli2.tables[that._update_table]) {
        _reject(ERROR.table_not_exist(that._update_table));
        return;
      }

      if(that._where) {
        sli2.tables[that._update_table].updateForQuery(
          that._where,
          that._update_data,
          function(num) {
            _func(num, _exec_fulfill, _reject);
          }, _reject
        );

      } else {
        sli2.tables[that._update_table].updateAll(
          that._update_data,
          function(num) {
            _func(num, _exec_fulfill, _reject);
          }, _reject
        );
      }


    // ##############################
    // *** Select Query ***
    // ##############################
    } else if(that.isSelectQuery()) {
      _reject = _exec_reject("select");

      // TODO:
      var table_names = [],
          splited_where = {},
          extract_where = null,
          join_alias_where = null,
          join_no_alias_where = null,
          key = "";

      // *** split where clause ***
      if(this._where) {
        table_names = this.getTableNames();
        splited_where = this._where.splitByKeyPrefixes(table_names);

        if(splited_where) {
          if(splited_where[this._select_table] && splited_where[this._table_alias]) {
            _reject(ERROR.kriteria_prefix_conflict(this._select_table, this._table_alias));
          }

          var tmp_cri = new Kriteria(),
              merge_count = 0;

          if(splited_where[that._select_table] || splited_where[that._table_alias]) {
            extract_where = splited_where[that._select_table] || splited_where[that._table_alias];

            for(key in splited_where) {
              if(splited_where[key] && key !== that._select_table && key !== that._table_alias) {
                if(key === "else") {
                  join_no_alias_where = splited_where[key];
                } else {
                  // other alias data
                  merge_count = merge_count + 1;
                  tmp_cri = tmp_cri.merge(splited_where[key]);
                }
              }
            }

            if(merge_count > 0) {
              join_alias_where = tmp_cri;
            }

          } else {
            extract_where = splited_where.else;

            for(key in splited_where) {
              if(splited_where[key]) {
                if(key === "else") {
                  join_no_alias_where = splited_where[key];
                } else {
                  // other alias data
                  merge_count = merge_count + 1;
                  tmp_cri = tmp_cri.merge(splited_where[key]);
                }
              }
            }

            if(merge_count > 0) {
              join_alias_where = tmp_cri;
            }
          }

        } else {
          join_no_alias_where = this._where;
        }

      }

      // **** select ****
      new Promise(function(fulfill1, reject1) {
        if(that._select_table) {
          if(!sli2.tables[that._select_table]) {
            _reject(ERROR.table_not_exist(that._select_table));
            return;
          }

          // **** get data ****

          if(splited_where[that._select_table]) {
            // select ... from table where ...
            sli2.tables[that._select_table].selectForQuery(
              extract_where,//.removePrefixes([that._select_table || that._table_alias]),
              splited_where[that._select_table] ? that._select_table : that._tablea_alias,
              that._table_alias || (that._joins.length > 0 ? that._select_table : ""),
              function(rows) {
                _exec_fulfill();
                fulfill1(rows);
              }, reject1
            );

          } else {
            // select ... from table
            sli2.tables[that._select_table].selectAll(
              that._joins.length > 0 ? that._table_alias || that._select_table : that._table_alias,
              function(rows) {
                _exec_fulfill();
                fulfill1(rows);
              }, reject1
            );
          }

        } else if(that._select_input_query) {
          // select .. from (select ... from ...)
          that._select_input_query.run(function(rows, fulfill2/*, reject2*/) {
            var ret = [];

            if(that._table_alias) {
              for(i = 0, l = rows.length; i < l; i = i + 1) {
                ret[i] = {};
                ret[i][that._table_alias] = rows[i];
              }

            } else {
              ret = rows;
            }

            _exec_fulfill();
            fulfill1(ret);
            fulfill2();
          });

        } else if(that._select_input_array) {
          // select ... from object[]
          var selected_array = [];

          if(extract_where) {
            var set_function = null;
            if(that._joins.length === 0) {
              if(splited_where[that._table_alias] && splited_where.else) {
                set_function = setFunction.setWithNoJoinAndAliasWhere;
              } else if(splited_where[that._table_alias] && !splited_where.else) {
                set_function = setFunction.setWithNoJoinAndAliasWhere;
              } else if(!splited_where[that._table_alias] && splited_where.else) {
                set_function = setFunction.setWithNoJoinAndNoAliasWhere;
              }
            } else {
              if(splited_where[that._table_alias] && splited_where.else) {
                set_function = setFunction.setWithHasJoinAndAliasWhere;
              } else if(splited_where[that._table_alias] && !splited_where.else) {
                set_function = setFunction.setWithHasJoinAndAliasWhere;
              } else if(!splited_where[that._table_alias] && splited_where.else) {
                set_function = setFunction.setWithHasJoinAndNoAliasWhere;
              }
            }

            if(set_function === null) {
              selected_array = that._select_input_array;
            } else {
              for(i = 0, l = that._select_input_array.length; i < l; i = i + 1) {
                set_function(that._select_input_array[i], selected_array, extract_where, that._table_alias);
              }
            }

          } else {
            if(that._joins.length === 0) {
              selected_array = that._select_input_array;

            } else {
              for(i = 0, l = that._select_input_array.length; i < l; i = i + 1) {
                var data = {};
                data[that._table_alias] = that._select_input_array[i];

                selected_array[selected_array.length] = data;
              }
            }
          }

          _exec_fulfill();
          fulfill1(selected_array);

        } else {
          reject1(ERROR.invalid_description("select"));
        }

      })
      .then(function(rows1) {
        // **** join ****

        return new Promise(function(fulfill2, reject2) {
          var joined_rows = [];

          if(that._joins.length === 0) {
            fulfill2(rows1);

          } else {
            var loop_rows = rows1,
                join_num = 0;

            async.eachSeries(that._joins, function(join, next) {
              var querable = join[0],
                  cri = join[1],
                  join_obj = join[2],
                  join_table_alias = join[3],
                  join_type = join[4],
                  join_data = {},
                  match_count = 0,
                  main_loop = [],
                  sub_loop = [],
                  left_table = "",
                  right_table = "",
                  keys = [];

              joined_rows = [];
              join_num = join_num + 1;

              new Promise(function(fulfill3, reject3) {
                if(querable && querable.isSelectQuery) {
                  querable.run(function(rows2, fulfill4) {
                    fulfill4();
                    fulfill3([rows2, join_table_alias || ""]);
                  });
                } else if(join_obj) {
                  fulfill3([join_obj, join_table_alias ]);
                } else {
                  reject3(ERROR.reqire_select_query);
                }
              })
              .then(function(args) {
                var rows2 = args[0],
                    right_table_name = args[1];

                if(join_type === "inner") {
                  for(i = 0, l = loop_rows.length; i < l; i = i + 1) {
                    for(j = 0, l2 = rows2.length; j < l2; j = j + 1) {
                      join_data = clone(loop_rows[i]);
                      if(right_table_name) {
                        join_data[right_table_name] = rows2[j];
                      } else {
                        keys = Object.keys(rows2[1]);
                        for(k = 0, l3 = keys.length; k < l3; k = k + 1) {
                          key = keys[k];
                          join_data[key] = rows2[j][key];
                        }
                      }

                      if(!cri || cri.match(join_data)) {
                        joined_rows[joined_rows.length] = clone(join_data);
                      }
                    }
                  }

                  loop_rows = joined_rows; // memo: need clone?

                } else if(join_type === "left" || join_type === "right") {
                  if(join_type === "left") {
                    main_loop = loop_rows; // memo: need clone?
                    sub_loop = rows2;
                    left_table = "";
                    right_table = right_table_name;
                  } else { // join_type === "right"
                    main_loop = rows2;
                    sub_loop = loop_rows; // memo: need clone?
                    left_table = right_table_name;
                    right_table = "";
                  }

                  for(i = 0, l = main_loop.length; i < l; i = i + 1) {
                    match_count = 0;

                    for(j = 0, l2 = sub_loop.length; j < l2; j = j + 1) {
                      join_data = {};
                      if(left_table) {
                        join_data[left_table] = clone(main_loop[i]);
                      } else {
                        join_data = clone(main_loop[i]);
                      }
                      if(right_table) {
                        join_data[right_table] = clone(sub_loop[j]);
                      } else {
                        keys = Object.keys(sub_loop[j]);
                        for(k = 0, l3 = keys.length; k < l3; k = k + 1) {
                          key = keys[k];
                          join_data[key] = sub_loop[j][key];
                        }
                      }

                      if(!cri || cri.match(join_data)) {
                        joined_rows[joined_rows.length] = clone(join_data);
                        match_count = match_count + 1;
                      }
                    }

                    if(match_count === 0) {
                      join_data = {};
                      if(left_table) {
                        join_data[left_table] = main_loop[i];
                      } else {
                        join_data = main_loop[i];
                      }
                      joined_rows[joined_rows.length] = clone(join_data);
                    }
                  }

                  loop_rows = joined_rows; // memo: need clone?
                  main_loop = [];
                  sub_loop = [];
                }

                next();
              })
              .catch(function(e) {
                reject2(e);
              });

            }, function() {
              loop_rows = [];
              fulfill2(joined_rows);
            });
          }

        })
        .then(function(rows) {
          // 'where' have conditions of sub-queires prefix.

          var ret = [];

          if(join_alias_where) {
            for(i = 0, l = rows.length; i < l; i = i + 1) {
              if(join_alias_where.match(rows[i])) {
                ret[ret.length] = rows[i];
              }
            }

            return ret;

          } else {
            return rows;
          }
        })
        .then(function(rows) {
          // **** group by ****

          var agg = SelectionAggregator.createAggregationOperator(that._groupings);

          if(that._selection) {
            for(i = 0, l = rows.length; i < l; i = i + 1) {
              that._selection(agg, rows[i]);
              agg.aggregate();
            }

            return agg.getResult();

          } else if(that._groupings.length > 0) {
            var all_selection = function($, _) {
              for(key in _) {
                $(_[key]).as(key);
              }
            };

            for(i = 0, l = rows.length; i < l; i = i + 1) {
              all_selection(agg, rows[i]);
              agg.aggregate();
            }

            return agg.getResult();

          } else {
            return rows;
          }

        })
        .then(function(rows) {
          // 'where' have conditions of no prefix.
          // ex. described conditions of sub-queries with alias

          var ret = [];

          if(join_no_alias_where) {
            for(i = 0, l = rows.length; i < l; i = i + 1) {
              if(join_no_alias_where.match(rows[i])) {
                ret[ret.length] = rows[i];
              }
            }

            return ret;

          } else {
            return rows;
          }
        })
        .then(function(rows) {
          // **** having ****

          var ret = [];

          if(that._having) {
            for(i = 0, l = rows.length; i < l; i = i + 1) {
              if(that._having.match(rows[i])) {
                ret[ret.length] = rows[i];
              }
            }
          } else {
            ret = rows;
          }

          return ret;

        })
        .then(function(rows) {
          // TODO: use intro-select

          // **** order by ****
          if(that._orderings.length > 0) {
            rows = arraySortWithObjectElement(rows, that._orderings);
          }

          // **** limit offset ****
          if(that._limit_num > 0) {
            var tmp_rows = [];

            for(i = 0 + that._offset_num, l = that._limit_num + that._offset_num; i < l; i = i + 1) {
              if(l > rows.length) {
                break;
              }
              tmp_rows[tmp_rows.length] = rows[i];
            }
            rows = tmp_rows;
            tmp_rows = [];
          }

          return rows;

        })
        .then(function(rows) {
          // **** union or union_all ****
          return new Promise(function(fulfill1, reject1) {
            if(that._union_queries.length > 0) {
              async.eachSeries(that._union_queries, function(union_query, next) {
                union_query.run(function(rows2) {
                  union_rows = arrayUniqueMerge(union_rows, rows2);

                  next();
                })
                .catch(function(err) {
                  reject1(err);
                });

              }, function() {
                union_rows = arrayUniqueMerge(union_rows, rows);

                fulfill1(union_rows);
              });

            } else if(that._union_all_queries.length > 0) {
              async.eachSeries(that._union_all_queries, function(union_query, next) {
                union_query.run(function(rows2) {
                  for(i = 0, l = rows2.length; i < l; i = i + 1) {
                    union_rows[union_rows.length] = rows2[i];
                  }

                  next();
                })
                .catch(function(err) {
                  reject1(err);
                });

              }, function() {
                for(i = 0, l = rows.length; i < l; i = i + 1) {
                  union_rows[union_rows.length] = rows[i];
                }

                fulfill1(union_rows);
              });

            } else {
              fulfill1(rows);
            }
          });

        })
        .then(function(rows) {
          _func(rows, function() {}, _exec_reject("select - run process"));
        })
        .catch(_exec_reject("select - promise"));
      })
      .catch(function(err) {
        _reject(err);
      });
    }
  };


  cxt.Dml = Dml;

})(this);

},{"../param/ERROR.js":36,"./Querable.js":27,"./SelectionAggregator.js":29,"./arraySortWithObjectElement.js":32,"./arrayUniqueMerge.js":33,"./setFunction.js":35,"Kriteria":1,"async":6,"clone":7}],27:[function(require,module,exports){
/* Querable.js */

(function(cxt) {
  "use strict";

  var ERROR = require("../param/ERROR.js").ERROR;


  /**
  * @public
  * @class
  */
  var Querable = function Querable(sli2) {
    this._sli2_object = sli2;
  };

  /**
  * @private
  * @function
  * @returns {Boolean}
  */
  Querable.prototype._isRunnable = function _isRunnable() {
    return true;
  };

  /**
  * @public
  * @funciton
  * @param {Function} func - callback from Querable#_exec
  * @returns {Promise}
  */
  Querable.prototype.run = function run(func) {
    if(!this._isRunnable()) {
      throw ERROR.invalid_description("run");
    }

    var that = this,
        sli2 = this._sli2_object;

    if(sli2 === void 0 || sli2 === null) {
      throw ERROR.querable_is_not_initialized;
    }

    return new Promise(function(fulfill/*, reject*/) {
      sli2.addTask(that, function(idb_result, exec_fulfill, exec_reject) {
        if(typeof func === "function") {
          func(
            idb_result,
            function() { fulfill(); exec_fulfill(); },
            exec_reject
          );

        } else {
          fulfill();
          exec_fulfill();
        }
      });

    });
  };

  /**
  * @public
  * @function
  * @param {Function} func - callback function
  *   arguments[0] is idb operation result
  *   arguments[1] is function for _exec fulfilled
  *   arguments[2] is function for _exec rejected
  * @param {Function} end - exec fulfilled
  * @param {Function} error - exec rejected
  * @retuns {void}
  */
  Querable.prototype.exec = function exec(func, end, error) {
    var _func = typeof func === "function" ? func : function() {},
        _end = typeof end === "function" ? end : function() {},
        _error = typeof error === "function" ? error : function() {};

    _func(null, _end, _error);
  };


  cxt.Querable = Querable;

})(this);

},{"../param/ERROR.js":36}],28:[function(require,module,exports){
/* SLI2Operator.js */

(function(cxt) {
  "use strict";

  var ERROR = require("../param/Error.js").ERROR,
      setFunction = require("./setFunction.js").setFunction;

  /**
  * @public
  * @class
  */
  var SLI2Operator = function SLI2Operator(sli2) {
    this._sli2_object = sli2;
    this._closed = false;
  };

  /**
  * @public
  * @function
  * @returns {void}
  */
  SLI2Operator.prototype.close = function close() {
    this._sli2_object = null;
    this._closed = true;
  };

  /**
  * @public
  * @function
  * @param {IDBObjectStore} store -
  * @param {Object|Object[]} data -
  * @param {Function} success - callback on successed
  * @param {Function} error - callback on errored
  * @return {void}
  */
  SLI2Operator.prototype.add = function add(store, data, success, error) {
    if(this._closed) {
      throw ERROR.closed;
    }

    var req = null,
        _data = [],
        num = 0,
        _success = typeof success === "function" ? success : function() {},
        _error = typeof error === "function" ? error : function() {};

    if(Array.isArray(data)) {
      for(var i = 0, l = data.length; i < l; i = i + 1) {
        _data[i] = data[i];
      }
    } else {
      _data[0] = data;
    }

    var loop = function loop() {
      req = store.add(_data.shift());
      req.onsuccess = function() {
        num = num + 1;

        if(_data.length > 0) {
          loop();
        } else {
          _success(num);
        }
      };
      req.onerror = function(e) {
        var _err = e.target.error;
        _error("add: " + _err.name + ": " + _err.message);
      };
    };
    loop();
  };

  /**
  * @public
  * @function
  * @param {IDBObjectStore} store -
  * @param {Object|Object[]} data -
  * @param {Function} success - callback on successed
  * @param {Function} error - callback on errored
  * @return {void}
  */
  SLI2Operator.prototype.put = function put(store, data, success, error) {
    if(this._closed) {
      throw ERROR.closed;
    }

    var req = null,
        _data = [],
        num = 0,
        _success = typeof success === "function" ? success : function() {},
        _error = typeof error === "function" ? error : function() {};

    if(Array.isArray(data)) {
      for(var i = 0, l = data.length; i < l; i = i + 1) {
        _data[i] = data[i];
      }
    } else {
      _data[0] = data;
    }

    var loop = function loop() {
      req = store.put(_data.shift());
      req.onsuccess = function() {
        num = num + 1;

        if(_data.length > 0) {
          loop();
        } else {
          _success(num);
        }
      };
      req.onerror = function(e) {
        var _err = e.target.error;
        _error("put: " + _err.name + ": " + _err.message);
      };
    };
    loop();
  };

  /**
  * @public
  * @function
  * @param {IDBObjectStore} store -
  * @param {String} alias -
  * @param {Function} success - callback on successed
  * @param {Function} error - callback on errored
  * @returns {void}
  */
  SLI2Operator.prototype.selectAll = function selectAll(store, alias, success, error) {
    if(this._closed) {
      throw ERROR.closed;
    }

    var ret = [],
        req = store.openCursor(),
        _success = typeof success === "function" ? success : function() {},
        _error = typeof error === "function" ? error : function() {};

    if(alias) {
      req.onsuccess = function(e) {
        var cursor = e.target.result;

        if(cursor) {
          var data = {};
          data[alias] = cursor.value;
          ret[ret.length] = data;
          cursor.continue();
        } else {
          _success(ret);
        }
      };
      req.onerror = function(e) {
        var _err = e.target.error;
        _error(ERROR.indexed_operation("selectAll: " + _err.name + ": " + _err.message));
      };

    } else {
      req.onsuccess = function(e) {
        var cursor = e.target.result;

        if(cursor) {
          ret[ret.length] = cursor.value;
          cursor.continue();
        } else {
          _success(ret);
        }
      };
      req.onerror = function(e) {
        var _err = e.target.error;
        _error(ERROR.indexed_operation("selectAll: " + _err.name + ": " + _err.message));
      };
    }
  };

  /**
  * @public
  * @function
  * @param {Mixed(IDBStore|IDBIndex)[]} stores -
  * @param {IDBKeyRange[]} key_ranges -
  * @param {Function[]} filters
  * @param {String} table_name - before data prefix
  * @param {Strng} alias - after data prefix
  * @param {Function} success - callback on successed
  * @param {Function} error - callback on errored
  * @returns {void}
  */
  SLI2Operator.prototype.selectForStoresAndKeyRangesAndFilters = function selectForStoresAndKeyRangesAndFilters(
    stores, key_ranges, filters, table_name, alias, success, error
  ) {
    if(this._closed) {
      throw ERROR.closed;
    }

    var ret = [],
        _stores = [],
        _key_ranges = [],
        _filters = [],
        _success = typeof success === "function" ? success : function() {},
        _error = typeof error === "function" ? error : function() {},
        primaryKeys = [];

    for(var i = 0, l = stores.length; i < l; i = i + 1) {
      _stores[i] = stores[i];
      _key_ranges[i] = key_ranges[i];
      _filters[i] = filters[i];
    }

    var loop = function() {
      if(_stores.length > 0) {
        var store = _stores.shift(),
            key_range = _key_ranges.shift(),
            filter = _filters.shift(),
            req = store.openCursor(key_range);

        var set_function = setFunction.setWithNoTableNameAndNoAlias;
        if(table_name !== "" && alias !== "") {
          set_function = setFunction.setWithTableNameAndAlias;
        } else if(table_name !== "" && alias === "") {
          set_function = setFunction.setWithTableName;
        } else if(table_name === "" && alias !== "") {
          set_function = setFunction.setWithAlias;
        }

        req.onsuccess = function (e) {
          var cursor = e.target.result;

          if(cursor) {
            var pk = cursor.primaryKey + "";

            if(!~primaryKeys.indexOf(pk) && set_function(cursor.value, ret, filter, table_name, alias)) {
              primaryKeys[primaryKeys.length] = pk;
            }

            cursor.continue();

          } else {
            loop();
          }
        };
        req.onerror = function(err) {
          var _err = err.target.error;
          _error(
            ERROR.indexed_operation("selectForStoreAndKeyRangesAndFilter: " + _err.name + ": " + _err.message)
          );
        };

      } else {
        _success(ret);
      }
    };
    loop();
  };

  /**
  * @public
  * @function
  * @param {IDBObjectStore} store -
  * @param {Function} success - callback on successed
  * @param {Function} error - callback on errored
  * @returns {void}
  */
  SLI2Operator.prototype.deleteAll = function deleteAll(store, success, error) {
    if(this._closed) {
      throw ERROR.closed;
    }

    var _success = typeof success === "function" ? success : function() {},
        _error = typeof error === "function" ? error : function() {},
        req = store.openCursor(),
        num = 0;

    req.onsuccess = function(e) {
      var cursor = e.target.result;

      if(cursor) {
        cursor.delete();
        num = num + 1;
        cursor.continue();
      } else {
        _success(num);
      }
    };
    req.onerror = function(err) {
      var _err = err.target.error;
      _error(ERROR.indexed_operation("deleteAll: " + _err.name + ": " + _err.message));
    };
  };

  /**
  * @public
  * @function
  * @param {Mixed(IDBStore|IDBIndex)[]} stores -
  * @param {IDBKeyRange[]} key_ranges -
  * @param {Function[]} filters
  * @param {Function} success - callback on successed
  * @param {Function} error - callback on errored
  * @returns {void}
  */
  SLI2Operator.prototype.deleteForStoresAndKeyRangesAndFilters = function deleteForStoresAndKeyRangesAndFilters(
    stores, key_ranges, filters, success, error
  ) {
    if(this._closed) {
      throw ERROR.closed;
    }

    var _success = typeof success === "function" ? success : function() {},
        _error = typeof error === "function" ? error : function() {},
        num = 0,
        _stores = [],
        _key_ranges = [],
        _filters = [];

    for(var i = 0, l = stores.length; i < l; i = i + 1) {
      _stores[i] = stores[i];
      _key_ranges[i] = key_ranges[i];
      _filters[i] = filters[i];
    }

    var loop = function loop() {
      if(_stores.length > 0) {
        var store = _stores.shift(),
            key_range = _key_ranges.shift(),
            filter = _filters.shift(),
            req = store.openCursor(key_range);

        req.onsuccess = function (e) {
          var cursor = e.target.result;

          if(cursor) {
            if(filter(cursor.value)) {
              cursor.delete();
              num = num + 1;
            }
            cursor.continue();
          } else {
            loop();
          }
        };
        req.onerror = function(err) {
          var _err = err.target.error;
          _error(
            ERROR.indexed_operation("deleteForStoreAndKeyRangesAndFilter: " + _err.name + ": " + _err.message)
          );
        };

      } else {
        _success(num);
      }
    };
    loop();
  };

  /**
  * @public
  * @function
  * @param {IDBObjectStore} store -
  * @param {Object} data -
  * @param {Function} success - callback on successed
  * @param {Function} error - callback on errored
  * @returns {void}
  */
  SLI2Operator.prototype.updateAll = function updateAll(store, data, success, error) {
    if(this._closed) {
      throw ERROR.closed;
    }

    var req = store.openCursor(),
        num = 0,
        _success = typeof success === "function" ? success : function() {},
        _error = typeof error === "function" ? error : function() {};

    req.onsuccess = function(e) {
      var cursor = e.target.result;

      if(cursor) {
        var new_data = cursor.value;
        for(var i in data) {
          new_data[i] = data[i];
        }

        cursor.update(new_data);
        num = num + 1;
        cursor.continue();
      } else {
        _success(num);
      }
    };
    req.onerror = function(err) {
      var _err = err.target.error;
      _error(ERROR.indexed_operation("updateAll: " + _err.name + ": " + _err.message));
    };
  };

  /**
  * @public
  * @function
  * @param {Mixed(IDBStore|IDBIndex)[]} stores -
  * @param {IDBKeyRange[]} key_ranges -
  * @param {Function[]} filters
  * @param {Object} data -
  * @param {Function} success - callback on successed
  * @param {Function} error - callback on errored
  * @returns {void}
  */
  SLI2Operator.prototype.updateForStoresAndKeyRangesAndFilters = function updateForStoresAndKeyRangesAndFilters(
    stores, key_ranges, filters, data, success, error
  ) {
    if(this._closed) {
      throw ERROR.closed;
    }

    var num = 0,
        _stores = [],
        _key_ranges = [],
        _filters = [],
        _success = typeof success === "function" ? success : function() {},
        _error = typeof error === "function" ? error : function() {};

    for(var i = 0, l = stores.length; i < l; i = i + 1) {
      _stores[i] = stores[i];
      _key_ranges[i] = key_ranges[i];
      _filters[i] = filters[i];
    }

    var loop = function loop() {
      if(_key_ranges.length > 0) {
        var store = _stores.shift(),
            key_range = _key_ranges.shift(),
            filter = _filters.shift(),
            req = store.openCursor(key_range);

        req.onsuccess = function(e) {
          var cursor = e.target.result;

          if(cursor) {
            if(filter(cursor.value)) {
              var new_data = cursor.value;
              for(var j in data) {
                new_data[j] = data[j];
              }

              cursor.update(new_data);
              num = num + 1;
            }
            cursor.continue();

          } else {
            loop();
          }
        };
        req.onerror = function(err) {
          var _err = err.target.error;
          _error(
            ERROR.indexed_operation("updateForStoreAndKeyRangesAndFilter: " + _err.name + ": " + _err.message)
          );
        };

      } else {
        _success(num);
      }
    };
    loop();
  };


  cxt.SLI2Operator = SLI2Operator;

})(this);

},{"../param/Error.js":37,"./setFunction.js":35}],29:[function(require,module,exports){
/* SelectionAggregator.js */

(function(cxt) {
  "use strict";

  /**
  * @public
  * @class
  */
  var SelectionAggregator = function SelectionAggregator(key_targets) {
    this._key_targets = key_targets || [];
    this._pos = -1;
    this._names = [];
    this._values = [];
    this._result_keys = [];
    this._result_values = [];
  };

  /**
  * @public
  * @static
  * @function
  * @param {any} value -
  * @returns {Boolean}
  */
  SelectionAggregator.isValue = function isValue(value) {
    return typeof value === "string" || value instanceof String ||
           typeof value === "number" || value instanceof Number ||
           value === null || value === void 0 ? true : false;
  };

  /**
  * @publuc
  * @static
  * @function
  * @param {String} type - action type
  * @param {String} meth - action method name
  * @returns {Boolean}
  */
  SelectionAggregator.hasAction = function hasAction(type, meth) {
    var action = SelectionAggregator.actions[type];

    return action && typeof action[meth] === "function" ? true : false;
  };

  /**
  * @public
  * @function
  * @param {*} value -
  * @returns {void}
  */
  SelectionAggregator.prototype.setValue = function setValue(value) {
    this._values[this._pos] = value;
  };

  /**
  * @public
  * @function
  * @param {String} name -
  * @returns {void}
  */
  SelectionAggregator.prototype.setName = function setName(name) {
    this._names[this._pos] = name;
  };

  /**
  * @public
  * @function
  * @returns {void}
  */
  SelectionAggregator.prototype.next = function next() {
    this._pos = this._pos + 1;
  };

  /**
  * @public
  * @function
  * @returns {String}
  */
  SelectionAggregator.prototype.getKey = function getKey() {
    var key_str = "";

    for(var i = 0, l = this._key_targets.length; i < l; i = i + 1) {
      var target = this._key_targets[i],
          pos = this._names.indexOf(target);

      if(~pos) { // found
        key_str = key_str + "_" + this._values[pos];
      } else {
        key_str = key_str + "_" + this._values[target];
      }
    }

    return key_str;
  };

  /**
  * @public
  * @function
  * @param {String} name -
  * @returns {*}
  */
  SelectionAggregator.prototype.getCurrentValue = function getCurrentValue(name) {
    var pos = this.getPos(this.getKey(name));

    return this._result_values[pos] ? this._result_values[pos][name] || null : null;
  };

  /**
  * @public
  * @function
  * @param {Mixed(String|Number)} key -
  * @returns {Number}
  */
  SelectionAggregator.prototype.getPos = function(key) {
    var pos = this._result_keys.indexOf(key);

    if(!~pos) { // not found
      pos = this._result_values.length;
    }

    return pos;
  };

  /**
  * @public
  * @function
  * @returns {void}
  */
  SelectionAggregator.prototype.aggretate = function aggregate() {
    var key = this.getKey(),
        pos = this.getPos(key);

    if(key !== "") {
      this._result_keys[pos] = key;
    }

    if(!this._result_values[pos]) {
      this._result_values[pos] = {};
    }

    for(var i = 0, l = this._values.length; i < l; i = i + 1) {
      var name = this._names[i] || i,
          value = this._values[i];

      if(SelectionAggregator.isValue(value)) {
        this._result_values[pos][name] = value;
      } else {
        var action_name = Object.keys(value)[0];

        if(SelectionAggregator.hasAction(action_name, "aggregate")) {
          this._result_values[pos][name] =
            SelectionAggregator.actions[action_name].aggregate(this, name, value[action_name]);
        }
      }
    }

    this._names = [];
    this._values = [];
    this._pos = -1;
  };

  /**
  * @public
  * @function
  * @returns {*}
  */
  SelectionAggregator.prototype.getResult = function getResult() {
    var that = this,
        ret = [];

    for(var i = 0, l = that._result_values.length; i < l; i = i + 1) {
      var data = {},
          result = that._result_values[i];

      for(var j in result) {
        if(SelectionAggregator.isValue(result[j])) {
          data[j] = result[j];
        } else if(SelectionAggregator.hasAction(result[j].type, "getResult")) {
          data[j] = SelectionAggregator.actions[result[j].type].getResult(result[j]);
        } else {
          data[j] = null;
        }
      }

      ret[ret.length] = data;
    }

    return ret;
  };

  /**
  * @namespace
  */
  SelectionAggregator.actions = {};

  /**
  * @public
  * @static
  * @function
  * @param {String} name -
  * @param {Object} funcs -
  * @returns {void}
  */
  SelectionAggregator.addPlugin = function addPlugin(name, funcs) {
    if(funcs) {
      SelectionAggregator.actions[name] = {};

      SelectionAggregator.actions[name].init = SelectionAggregator.createInit(name);

      if(typeof funcs.aggregate === "function") {
        SelectionAggregator.actions[name].aggregate = funcs.aggregate;
      }
      if(typeof funcs.getResult === "function") {
        SelectionAggregator.actions[name].getResult = funcs.getResult;
      }
    }
  };

  /**
  * @public
  * @static
  * @function
  * @param {String} name - function name
  * @returns {AggregationOperator}
  */
  SelectionAggregator.createInit = function createInit(name) {
    return function init(value) {
      var set_value = {};
      set_value[name] = value;
      this._agg.next();
      this._agg.setValue(set_value);

      return this;
    };
  };

  /**
  * @public
  * @static
  * @function
  * @param {Object} obj - plugin definition
  * @returns {void}
  */
  SelectionAggregator.loadPluginsTo = function loadPluginsTo(obj) {
    for(var type in SelectionAggregator.actions) {
      if(SelectionAggregator.hasAction(type, "init")) {
        obj[type] = SelectionAggregator.actions[type].init;
      }
    }
  };

  /* define min function */
  SelectionAggregator.addPlugin("min", {
    aggregate: function(agg, name, value) {
      var min_value = agg.getCurrentValue(name) || Number.MAX_SAFE_INTEGER;

      return min_value > value ? value : min_value;
    },
    getResult: null
  });

  /* define max function */
  SelectionAggregator.addPlugin("max", {
    aggregate: function(agg, name, value) {
      var max_value = agg.getCurrentValue(name) || 0;

      return max_value < value ? value : max_value;
    },
    getResult: null
  });

  /* define avg function */
  SelectionAggregator.addPlugin("avg", {
    aggregate: function(agg, name, value) {
      var curr_value = agg.getCurrentValue(name) || { type: "avg", count: 0, value: 0 };

      curr_value.count = curr_value.count + 1;
      curr_value.value = curr_value.value + value;

      return curr_value;
    },
    getResult: function(data) {
      return data.value / data.count;
    }
  });

  /* define sum function */
  SelectionAggregator.addPlugin("sum", {
    aggregate: function(agg, name, value) {
      var curr_value = agg.getCurrentValue(name) || 0;

      return curr_value + value;
    },
    getResult: null
  });

  /* define count function */
  SelectionAggregator.addPlugin("count", {
    aggregate: function(agg, name/*, value*/) {
      var curr_value = agg.getCurrentValue(name) || 0;

      return curr_value + 1;
    },
    getResult: null
  });

  /**
  * @public
  * @static
  * @function
  * @param {String[]} key_targets - aggregation key names
  * @returns {AggregationOperator}
  */
  SelectionAggregator.createAggregationOperator = function createAggregationOperator(key_targets) {
    var _agg = new SelectionAggregator(key_targets);

    var AggregationOperator = function AggregationOperator(value) {
      _agg.next();
      _agg.setValue(value);

      return AggregationOperator;
    };
    AggregationOperator._agg = _agg;

    AggregationOperator.as = function as(name) {
      this._agg.setName(name);

      return AggregationOperator;
    };

    AggregationOperator.aggregate = function aggregate() {
      this._agg.aggretate();
    };

    AggregationOperator.getResult = function getResult() {
      return this._agg.getResult();
    };

    SelectionAggregator.loadPluginsTo(AggregationOperator);

    AggregationOperator.debug = function() {
      return _agg;
    };

    return AggregationOperator;
  };


  cxt.SelectionAggregator = SelectionAggregator;

})(this);

},{}],30:[function(require,module,exports){
/* Table.js */

(function(cxt) {
  "use strict";

  var global = (0, eval)("this"),
      criteria2IDBQuery = require("criteria2IDBQuery").criteria2IDBQuery || global.criteria2IDBQuery,
      SLI2Operator = require("./SLI2Operator.js").SLI2Operator,
      ERROR = require("../param/ERROR.js").ERROR;

  /**
  * @public
  * @class
  */
  var Table = function Table(name, opt, sli2) {
    this._name = name;
    this._sli2_object = sli2;
    this.transaction = null;
    this.store = null;
    if(opt) {
      sli2.db.createObjectStore(name, opt);
    }
    this._handling = null;
  };

  /**
  * @public
  * @function
  * @param {IDBTransaction} transaction -
  * @param {String} handling_name -
  * @returns {void}
  */
  Table.prototype.open = function open(transaction, handling_name) {
    if(this.transaction || (this._handling !== null && this._handling !== (handling_name || ""))) {
      throw ERROR.table_already_opened(this._name, this._handling);
    }
    if(this._handling === handling_name) {
      return;
    }

    var tra = transaction ||
        this._sli2_object.transaction ||
        this._sli2_object.db.transaction(this._name, "readwrite");

    this.transaction = tra;
    this.store = tra.objectStore(this._name);
    this._handling = handling_name || "";
  };

  /**
  * @public
  * @function
  * @param {IDBTransaction} tra -
  * @param {String} handling_name -
  * @returns {Boolean}
  */
  Table.prototype.tryOpen = function tryOpen(tra, handling_name) {
    if(!this.transaction && (this._handling === null || this._handling === handling_name)) {
      this.open(tra, handling_name);

      return true;

    } else {
      return false;
    }
  };

  /**
  * @public
  * @function
  * @param {String} handling_name -
  * @returns {void}
  */
  Table.prototype.close = function close(handling_name) {
    if(!this.transaction || this._handling !== (handling_name || "")) {
      throw ERROR.table_cannot_close(this._name, this._handling, handling_name);
    }

    this.transaction = null;
    this.store = null;
    this._handling = null;
  };

  /**
  * @public
  * @function
  * @param {String} handling_name -
  * @returns {Boolean}
  */
  Table.prototype.tryClose = function tryClose(handling_name) {
    if(this.transaction && this._handling === (handling_name || "")) {
      this.close(handling_name);

      return true;

    } else {
      return false;
    }
  };

  /**
  * @public
  * @function
  * @return {void}
  */
  Table.prototype.destroy = function destroy() {
    this._name = null;
    this._sli2_object = null;
    this.transaction = null;
    this.store = null;
    this._handling = "";
  };

  /**
  * @public
  * @function
  * @param {String} type - readwrite or readonly
  * @param {Function} func - transaction process
  * @param {Function} success - callback on process successed
  * @param {Funciton} error - callback on process errored
  * @return {Promise}
  */
  Table.prototype.beginTransaction = function beginTransaction(type, func, success, error) {
    var that = this,
        _success = typeof success === "function" ? success : function() {},
        _error = typeof error === "function" ? error : function() {};

    if(!this.transaction && this._handling) {
      _error(ERROR.invalid_state("beginTransaction"));
      return;
    }

    if(!this.transaction) {
      this.open(null, "table_transaction");

      func.call(this, function(_ret) {
        that.close("table_transaction");
        _success(_ret);

      }, function (err) {
        that.close("table_transaction");
        _error(err);
      });

    } else {
      func.call(this, function(_ret) {
        _success(_ret);
      }, _error);

    }
  };

  /**
  * @public
  * @function
  * @param {Object} opt - create table option
  * @param {Function} success -
  * @param {Function} error -
  * @returns {void}
  */
  Table.prototype.create = function create(opt, success, error) {
    var table_name = this._name,
        sli2 = this._sli2_object,
        _success = typeof success === "function" ? success : function() {},
        _error = typeof error === "function" ? error : function() {};

    sli2.upgrade(function(db) {
      if(db.objectStoreNames.contains(table_name)) {
        _error(ERROR.table_already_exist(table_name));

      } else {
        sli2.db.createObjectStore(table_name, opt);
      }
    }, _success);
  };

  /**
  * @public
  * @function
  * @param {Function} success -
  * @param {Function} error -
  * @returnd {void}
  */
  Table.prototype.drop = function drop(success, error) {
    var table_name = this._name,
        sli2 = this._sli2_object,
        _success = typeof success === "function" ? success : function() {},
        _error = typeof error === "function" ? error : function() {};

    sli2.upgrade(function(db) {
      if(!db.objectStoreNames.contains(table_name)) {
        _error(ERROR.table_not_exist(table_name));

      } else {
        delete sli2.tables[table_name];
        sli2.db.deleteObjectStore(table_name);
      }
    }, _success);
  };

  /**
  * @public
  * @function
  * @param {String} idx_name - index name
  * @param {Object} idx_opt - index option(keyPath etc)
  * @param {Function} success -
  * @param {Function} error -
  * @returns {void}
  */
  Table.prototype.createIndex = function createIndex(idx_name, idx_opt, success, error) {
    var that = this,
        table_name = this._name,
        sli2 = this._sli2_object,
        _success = typeof success === "function" ? success : function() {},
        _error = typeof error === "function" ? error : function() {};

    sli2.upgrade(function(db) {
      var transaction = that.transaction || sli2.db.transaction(table_name),
          store = that.store || transaction.objectStore(table_name);

      if(!db.objectStoreNames.contains(table_name)) {
        _error(ERROR.table_not_exist(table_name));

      } else if(store.indexNames.contains(idx_name)) {
        _error(ERROR.index_already_exist(idx_name));

      } else {
        return store.createIndex(idx_name, idx_opt);
      }
    }, _success);
  };

  /**
  * @public
  * @function
  * @param {String} idx_name - index name
  * @param {Function} success -
  * @returns {void}
  */
  Table.prototype.dropIndex = function dropIndex(idx_name, success) {
    var that = this,
        table_name = this._name,
        sli2 = this._sli2_object,
        _success = typeof success === "function" ? success : function() {};

    sli2.upgrade(function() {
      var store = that.store,
          //transaction = that.transaction || sli2.transaction;
          transaction = that.transaction;

      if(store) {
        return store.deleteIndex(idx_name);

      } else if(transaction) {
        return transaction.objectStore(table_name).deleteIndex(idx_name);

      } else {
        return sli2.db.transaction(table_name).objectStore(table_name).deleteIndex(idx_name);
      }
    }, _success);
  };

  /**
  * @public
  * @function
  * @param {String} alias -
  * @param {Funciton} success - callback on process succesed
  * @param {Function} error - callback on process errored
  * @returns {void}
  */
  Table.prototype.selectAll = function selectAll(alias, success, error) {
    var sli2_ope = new SLI2Operator(this._sli2_object);

    var _success = typeof success === "function" ? success : function() {},
        _error = typeof error === "function" ? error : function() {};

    this.beginTransaction("readwrite", function(fulfill, reject) {
      sli2_ope.selectAll(this.store, alias, function(rows) {
        sli2_ope.close();
        fulfill(rows);
      }, reject);
    }, _success, _error);
  };

  /**
  * @public
  * @function
  * @param {Kriteria} where -
  * @param {String} table_name -
  * @param {String} alias -
  * @param {Funciton} success - callback on process succesed
  * @param {Function} error - callback on process errored
  * @returns {void}
  */
  Table.prototype.selectForQuery = function selectForQuery(where, table_name, alias, success, error) {
    var that = this,
        sli2_ope = new SLI2Operator(this._sli2_object);

    var _success = typeof success === "function" ? success : function() {},
        _error = typeof error === "function" ? error : function() {};

    this.beginTransaction("readwrite", function(fulfill, reject) {
      var query_param = criteria2IDBQuery.createQueryParameter(where, this.store);

      var stores = [],
          key_ranges = [],
          filters = [];

      for(var i = 0, l = query_param.length; i < l; i = i + 1) {
        stores[stores.length] = query_param[i].store;
        filters[filters.length] = query_param[i].filter;
        key_ranges[key_ranges.length] = criteria2IDBQuery.createIDBKeyRange(
          query_param[i], that._sli2_object._idb_objects.IDBKeyRange
        );
      }

      sli2_ope.selectForStoresAndKeyRangesAndFilters(
        stores, key_ranges, filters, table_name, alias,
        function(rows) {
          sli2_ope.close();
          fulfill(rows);
        },
        reject
      );

    }, _success, _error);
  };

  /**
  * @public
  * @function
  * @param {Mixed(Object|Array<Object>)} data -
  * @param {Funciton} success - callback on process succesed
  * @param {Function} error - callback on process errored
  * @returns {void}
  */
  Table.prototype.add = function add(data, success, error) {
    var sli2_ope = new SLI2Operator(this._sli2_object);

    var _success = typeof success === "function" ? success : function() {},
        _error = typeof error === "function" ? error : function() {};

    this.beginTransaction("readwrite", function(fulfill, reject) {
      sli2_ope.add(this.store, data, function(num) {
        sli2_ope.close();
        fulfill(num);
      }, reject);
    }, _success, _error);
  };

  /**
  * @public
  * @function
  * @param {Mixed(Object|Array<Object>)} data -
  * @param {Funciton} success - callback on process succesed
  * @param {Function} error - callback on process errored
  * @returns {void}
  */
  Table.prototype.put = function put(data, success, error) {
    var sli2_ope = new SLI2Operator(this._sli2_object);

    var _success = typeof success === "function" ? success : function() {},
        _error = typeof error === "function" ? error : function() {};

    this.beginTransaction("readwrite", function(fulfill, reject) {
      sli2_ope.put(this.store, data, function(num) {
        sli2_ope.close();
        fulfill(num);
      }, reject);
    }, _success, _error);
  };

  /**
  * @public
  * @function
  * @param {IDBObjectStore} store -
  * @param {Function} success -
  * @param {Function} error -
  * @returns {void}
  */
  Table.prototype.removeAll = function removeAll(success, error) {
    var sli2_ope = new SLI2Operator(this._sli2_object);

    var _success = typeof success === "function" ? success : function() {},
        _error = typeof error === "function" ? error : function() {};

    this.beginTransaction("readwrite", function(fulfill, reject) {
      sli2_ope.deleteAll(this.store, function(num) {
        sli2_ope.close();
        fulfill(num);
      }, reject);
    }, _success, _error);
  };

  /**
  * @public
  * @function
  * @param {Kriteria} where -
  * @param {Function} success -
  * @param {Function} error -
  * @returns {void}
  */
  Table.prototype.removeForQuery = function removeForQuery(where, success, error) {
    var that = this,
        sli2_ope = new SLI2Operator(this._sli2_object);

    var _success = typeof success === "function" ? success : function() {},
        _error = typeof error === "function" ? error : function() {};

    this.beginTransaction("readwrite", function(fulfill, reject) {
      var query_param = criteria2IDBQuery.createQueryParameter(where, this.store);

      var stores = [],
          key_ranges = [],
          filters = [];

      for(var i = 0, l = query_param.length; i < l; i = i + 1) {
        stores[stores.length] = query_param[i].store;
        filters[filters.length] = query_param[i].filter;
        key_ranges[key_ranges.length] = criteria2IDBQuery.createIDBKeyRange(
          query_param[i], that._sli2_object._idb_objects.IDBKeyRange
        );
      }

      sli2_ope.deleteForStoresAndKeyRangesAndFilters(
        stores, key_ranges, filters,
        function(num) {
          sli2_ope.close();
          fulfill(num);
        },
        reject
      );

    }, _success, _error);
  };

  /**
  * @public
  * @function
  * @param {IDBObjectStore} store -
  * @param {Object} data -
  * @param {Function} success -
  * @param {Function} error -
  * @returns {void}
  */
  Table.prototype.updateAll = function updateAll(data, success, error) {
    var sli2_ope = new SLI2Operator(this._sli2_object);

    var _success = typeof success === "function" ? success : function() {},
        _error = typeof error === "function" ? error : function() {};

    this.beginTransaction("readwrite", function(fulfill, reject) {
      sli2_ope.updateAll(this.store, data, function(num) {
        sli2_ope.close();
        fulfill(num);
      }, reject);
    }, _success, _error);
  };

  /**
  * @public
  * @function
  * @param {Kriteria} where -
  * @param {Object} data -
  * @param {Function} success -
  * @param {Function} error -
  * @returns {void}
  */
  Table.prototype.updateForQuery = function updateForQuery(where, data, success, error) {
    var that = this,
        sli2_ope = new SLI2Operator(this._sli2_object);

    var _success = typeof success === "function" ? success : function() {},
        _error = typeof error === "function" ? error : function() {};

    this.beginTransaction("readwrite", function(fulfill, reject) {
      var query_param = criteria2IDBQuery.createQueryParameter(where, this.store);

      var stores = [],
          key_ranges = [],
          filters = [];

      for(var i = 0, l = query_param.length; i < l; i = i + 1) {
        stores[stores.length] = query_param[i].store;
        filters[filters.length] = query_param[i].filter;
        key_ranges[key_ranges.length] = criteria2IDBQuery.createIDBKeyRange(
          query_param[i], that._sli2_object._idb_objects.IDBKeyRange
        );
      }

      sli2_ope.updateForStoresAndKeyRangesAndFilters(
        stores, key_ranges, filters, data,
        function(num) {
          sli2_ope.close();
          fulfill(num);
        },
        reject
      );

    }, _success, _error);
  };

  /**
  * @public
  * @function
  * @returns {void}
  */
  Table.prototype.rollback = function rollback() {
    if(this.transaction) {
      this.transaction.abort();
    } else {
      throw ERROR.no_transaction(this._name);
    }
  };


  cxt.Table = Table;

})(this);

},{"../param/ERROR.js":36,"./SLI2Operator.js":28,"criteria2IDBQuery":8}],31:[function(require,module,exports){
/* Tasker.js */
(function(cxt) {
  "use strict";

  /**
  * @public
  * @class
  */
  var Tasker = function Tasker() {
    this._running = false;
    this._stop = false;
    this.auto_run = false;
    this._task_queue = [];
  };

  /**
  * @public
  * @function
  * @param {Object} obj -
  * @param {Function} func -
  * @returns {Tasker}
  */
  Tasker.prototype.addTask = function addTask(obj, func) {
    this._task_queue[this._task_queue.length] = [obj, func];

    if(this.auto_run) {
      this.runQueue();
    }

    return this;
  };

  /**
  * @public
  * @function
  * @returns {Tasker}
  */
  Tasker.prototype.runQueue = function runQueue() {
    var that = this;

    var _next = function() {
      if(that._running && that._task_queue.length > 0) {
        loop();
      }
    };
    var _error = function(err) {
      throw err;
    };

    if(!this._runnign && !this._stop) {
      var loop = function() {
        if(that._running && !that._stop && that._task_queue.length > 0) {
          var task = that._task_queue.shift(),
              obj = task[0],
              func = task[1];

          if(obj && typeof obj.exec === "function") {
            obj.exec(func, _next, _error);
          } else {
            func(_next, _error);
          }

        } else {
          that._running = false;
        }
      };

      this._running = true;
      loop();
    }

    return this;
  };

  /**
  * @public
  * @function
  * @returns {void}
  */
  Tasker.prototype.terminate = function terminate() {
    this._running = false;
    this._task_queue = [];
  };

  /**
  * @public
  * @function
  * @returns {void}
  */
  Tasker.prototype.stop = function stop() {
    this._running = false;
    this._stop = true;
  };

  /**
  * @public
  * @function
  * @returns {void}
  */
  Tasker.prototype.resume = function resume() {
    this._runing = true;
    this._stop = false;
    this.runQueue();
  };


  cxt.Tasker = Tasker;

}(this));

},{}],32:[function(require,module,exports){
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


},{}],33:[function(require,module,exports){
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

},{}],34:[function(require,module,exports){
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

},{}],35:[function(require,module,exports){
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

},{}],36:[function(require,module,exports){
/* ERROR.js */

(function(cxt) {
  "use strict";

  var ERROR = {
    not_open:
      new Error("SLI2 is not open."),
    already_open:
      new Error("SLI2 is already opened."),
    closed:
      new Error("SLI2 is already closed."),
    no_version_map: function(version) {
      return new Error("SLI2 has no version-map (" + version + ")");
    },
    no_definition: function(version) {
      return new Error("SLI2 has no version-definition (" + version + ")");
    },
    upgrade_error: function(err) {
      return new Error("Upgrade error: " + err.name + ": " + err.message + ".");
    },
    transaction_abort: function(meth) {
      return new Error("Transaction abort at '" + meth + "'.");
    },
    transaction_error: function(err) {
      return new Error("Transaction error: " + err.name + ": " + err.message + ".");
    },
    transaction_already_exist:
      new Error("Transaction already exist."),
    no_transaction: function(name) {
      if(name) {
        return new Error("SLI2 has no transaction('" + name + "')");
      } else {
        return new Error("SLI2 has no transaction.");
      }
    },
    table_already_exist: function(name) {
      return new Error("Table '" + name + "' is already exist.");
    },
    table_not_exist: function(name) {
      return new Error("Table '" + name + "' is not exist.");
    },
    table_already_opened: function(name, handling) {
      return new Error("Table '" + name + "' is already opened from '" + handling + "'.");
    },
    table_cannot_close: function(name, handling1, handling2) {
      return new Error(
        "Table '" + name + "' can not close from '" + handling2 + "'. (handling '" + handling1 + "')"
      );
    },
    index_already_exist: function(name) {
      return new Error("Index '" + name + "' is already exist.");
    },
    index_not_exist: function(name) {
      return new Error("Index '" + name + "' is not exist.");
    },
    no_option: function(meth) {
      return new Error("No options as '" + meth + "'");
    },
    idb_objects_not_exists: new Error("IDB objects not exists."),
    idb_objects_not_used: new Error("IDB objects not used(not exec SLI2#useIndexedDB)."),
    mode_is_no_idb: new Error("SLI2 mode is 'no_idb'."),
    upgrade_unable: new Error("Upgrade unable (upgrading only on DatabaseDefinition)"),

    invalid_description: function(meth) {
      return new Error("Invalid description: " + meth);
    },
    invalid_argument: function(meth) {
      return new Error("Invalid argument: " + meth);
    },
    invalid_state: function(meth) {
      return new Error("Invalid state: " + meth);
    },
    querable_is_not_initialized: new Error("Dml is not initialized (no SLI2 object)."),
    require_select_query: new Error("Joined qauery must be select query."),
    kriteria_prefix_conflict: function(prefix1, prefix2) {
      return new Error("Kriteria Error: key prefix conflict '" + prefix1 + "', '" + prefix2 + "'.");
    },
    dml_exec_error: function(at) {
      return new Error("Dml#exec error at: " + at);
    },
    ddl_exec_error: function(at) {
      return new Error("Ddl#exec error at: " + at);
    },
    cannot_execute: function(mess) {
      return new Error("Can not execute " + mess);
    },

    indexed_operation: function(meth) {
      return new Error("Indexed operation error at '" + meth + "'.");
    },

    invalid_version_number: function(n) {
      return new Error("Invalid version number: " + n);
    },
    is_not_array: function(x) {
      return new Error(x + " is not array");
    },
    is_not_function: function(x) {
      return new Error(x + " is not function");
    }
  };

  cxt.ERROR = ERROR;

})(this);

},{}],37:[function(require,module,exports){
module.exports=require(36)
},{}]},{},[23])