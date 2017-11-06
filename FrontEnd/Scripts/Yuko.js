/*
 * Copyright (c) 2015 RyougiChan. All rights reserved.
 *  
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"), 
 * to deal in the Software without restriction, including without limitation 
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the 
 * Software is furnished to do so, subject to the following conditions:
 *  
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *  
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
 * DEALINGS IN THE SOFTWARE.
 * 
 */

(function (win) {
    'use strict';

    var global = win;

    if (!global.Yuko) {
        global.Yuko = global.Yuko = global.yuko = Object();
    }

    Yuko.polyfill = (function () {
        // String.prototype.endsWith polyfill
        /*! http://mths.be/endswith v0.2.0 by @mathias */
        if (!String.prototype.endsWith) {
            (function () {
                'use strict'; // needed to support `apply`/`call` with `undefined`/`null`
                var defineProperty = (function () {
                    // IE 8 only supports `Object.defineProperty` on DOM elements
                    try {
                        var object = {};
                        var $defineProperty = Object.defineProperty;
                        var result = $defineProperty(object, object, object) && $defineProperty;
                    } catch (error) { }
                    return result;
                }());
                var toString = {}.toString;
                var endsWith = function (search) {
                    if (this == null) {
                        throw TypeError();
                    }
                    var string = String(this);
                    if (search && toString.call(search) == '[object RegExp]') {
                        throw TypeError();
                    }
                    var stringLength = string.length;
                    var searchString = String(search);
                    var searchLength = searchString.length;
                    var pos = stringLength;
                    if (arguments.length > 1) {
                        var position = arguments[1];
                        if (position !== undefined) {
                            // `ToInteger`
                            pos = position ? Number(position) : 0;
                            if (pos != pos) { // better `isNaN`
                                pos = 0;
                            }
                        }
                    }
                    var end = Math.min(Math.max(pos, 0), stringLength);
                    var start = end - searchLength;
                    if (start < 0) {
                        return false;
                    }
                    var index = -1;
                    while (++index < searchLength) {
                        if (string.charCodeAt(start + index) != searchString.charCodeAt(index)) {
                            return false;
                        }
                    }
                    return true;
                };
                if (defineProperty) {
                    defineProperty(String.prototype, 'endsWith', {
                        'value': endsWith,
                        'configurable': true,
                        'writable': true
                    });
                } else {
                    String.prototype.endsWith = endsWith;
                }
            }());
        }

        // Array.prototype.map polyfill
        if (!Array.prototype.map) {
            Array.prototype.map = function (callback) {
                var T, A, k;
                if (this == null) {
                    throw new TypeError('this is null or not defined');
                }
                var O = Object(this);
                var len = O.length >>> 0;
                if (typeof callback !== 'function') {
                    throw new TypeError(callback + ' is not a function');
                }
                if (arguments.length > 1) {
                    T = arguments[1];
                }
                A = new Array(len);
                k = 0;
                while (k < len) {

                    var kValue, mappedValue;
                    if (k in O) {
                        kValue = O[k];
                        mappedValue = callback.call(T, kValue, k, O);
                        A[k] = mappedValue;
                    }
                    k++;
                }
                return A;
            };
        }
    })();

    Yuko.utility = (function () {
        /**
         * Calculation for cubic equation : y = a * x * x * x + b * x * x + c * x + d
         * 
         * @param {number} a Cubic equation parameter a
         * @param {number} b Cubic equation parameter b
         * @param {number} c Cubic equation parameter b
         * @param {number} d Cubic equation parameter d
         * @param {number} x Cubic equation variable x
         * @returns {number} Return the calculated result when all parameters are given
         */
        function calcCubicEquation(a, b, c, d, x) {
            return a * x * x * x + b * x * x + c * x + d;
        };

        /**
         * Calculation for quadratic equation : y = a * x * x + b * x + c
         * 
         * @param {number} a Quadratic equation parameter a
         * @param {number} b Quadratic equation parameter b
         * @param {number} c Quadratic equation parameter c
         * @param {number} x Quadratic equation variable x
         * @returns {number} Return the zero point of a quadratic equation in array (if x is not given).
         *                  Or return the value of y (if x is given).
         *                  Return undefined when the solutions of equations don't exist or when there are something wrong with parameters.
         */
        function calcQuadraticEquation(a, b, c, x) {
            return isNaN(a) ? undefined : a == 0 ? undefined : isNaN(b) ? [0, 0] : isNaN(c) ? [0, (-b / a)] : isNaN(x) ? (b * b - 4 * a * c) < 0 ? undefined : [((-b - Math.sqrt(b * b - 4 * a * c)) / (2 * a)), (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a)] : a * x * x + b * x + c;
        };

        /**
         * Gaussian elimination to calculate parameter inmultivariate equation
         * 
         * @param {Array} arr Matrix x in array
         * @param {Array} b Matrix y in array
         * @returns Resurn result in array
         */
        function gaussianElimination(arr, b) {
            // Lower Upper Solver
            var lusolve = function (A, b, update) {
                var lu = ludcmp(A, update);
                if (lu === undefined) return; // Singular Matrix!
                return lubksb(lu, b, update);
            }

            // Lower Upper Decomposition
            var ludcmp = function (A, update) {
                // A is a matrix that we want to decompose into Lower and Upper matrices.
                var d = true,
                    n = A.length,
                    idx = new Array(n), // Output vector with row permutations from partial pivoting
                    vv = new Array(n);  // Scaling information

                for (var i = 0; i < n; i++) {
                    var max = 0;
                    for (var j = 0; j < n; j++) {
                        var temp = Math.abs(A[i][j]);
                        if (temp > max) max = temp;
                    }
                    if (max == 0) return; // Singular Matrix!
                    vv[i] = 1 / max; // Scaling
                }

                if (!update) { // make a copy of A
                    var Acpy = new Array(n);
                    for (var i = 0; i < n; i++) {
                        var Ai = A[i],
                            Acpyi = new Array(Ai.length);
                        for (j = 0; j < Ai.length; j += 1) Acpyi[j] = Ai[j];
                        Acpy[i] = Acpyi;
                    }
                    A = Acpy;
                }

                var tiny = 1e-20 // in case pivot element is zero
                for (var i = 0; ; i++) {
                    for (var j = 0; j < i; j++) {
                        var sum = A[j][i];
                        for (var k = 0; k < j; k++) sum -= A[j][k] * A[k][i];
                        A[j][i] = sum;
                    }
                    var jmax = 0,
                        max = 0;
                    for (var j = i; j < n; j++) {
                        var sum = A[j][i];
                        for (var k = 0; k < i; k++) sum -= A[j][k] * A[k][i];
                        A[j][i] = sum;
                        var temp = vv[j] * Math.abs(sum);
                        if (temp >= max) {
                            max = temp;
                            jmax = j;
                        }
                    }
                    if (i <= jmax) {
                        for (var j = 0; j < n; j++) {
                            var temp = A[jmax][j];
                            A[jmax][j] = A[i][j];
                            A[i][j] = temp;
                        }
                        d = !d;
                        vv[jmax] = vv[i];
                    }
                    idx[i] = jmax;
                    if (i == n - 1) break;
                    var temp = A[i][i];
                    if (temp == 0) A[i][i] = temp = tiny;
                    temp = 1 / temp;
                    for (var j = i + 1; j < n; j++) A[j][i] *= temp;
                }
                return { A: A, idx: idx, d: d }
            }

            // Lower Upper Back Substitution
            var lubksb = function (lu, b, update) {
                // solves the set of n linear equations A*x = b.
                // lu is the object containing A, idx and d as determined by the routine ludcmp.
                var A = lu.A,
                    idx = lu.idx,
                    n = idx.length;

                if (!update) { // make a copy of b
                    var bcpy = new Array(n);
                    for (var i = 0; i < b.length; i += 1) bcpy[i] = b[i];
                    b = bcpy;
                }

                for (var ii = -1, i = 0; i < n; i++) {
                    var ix = idx[i],
                        sum = b[ix];
                    b[ix] = b[i];
                    if (ii > -1)
                        for (var j = ii; j < i; j++) sum -= A[i][j] * b[j];
                    else if (sum)
                        ii = i;
                    b[i] = sum;
                }
                for (var i = n - 1; i >= 0; i--) {
                    var sum = b[i];
                    for (var j = i + 1; j < n; j++) sum -= A[i][j] * b[j];
                    b[i] = sum / A[i][i];
                }
                return b; // solution vector x
            }

            return lusolve(
                arr, b
            )
        }

        /**
         * Calculation of cubic bezier curve points value.
         * 
         * @param {Array} ps four value with four points, mapping to x or y.
         * @param {number} t timespan
         * @returns return 0 if @param(ps) is not instance of Array or @param(ps) count less than 4, 
         *          else return calculation result according to given formula.
         */
        function calccubicBezierPoint(ps, t) {
            if (!(ps instanceof Array)) return 0;
            if (ps.length < 4) return 0;
            if (ps.length > 4) ps = ps.slice(0, 4);
            return parseFloat((Math.pow(1 - t, 3) * ps[0] + 3 * t * Math.pow(1 - t, 2) * ps[1] + 3 * (1 - t) * Math.pow(t, 2) * ps[2] + Math.pow(t, 3) * ps[3]).toLocaleString());
        }

        /**
         * Calculation of cubic bezier function f(x) = a * x * x * x + b * x *x + c * x + d.
         * 
         * @param {string} bp Cubic bezier adjust point format in 'cubic-bezier(.17,.67,.78,.31)' or 'cubic-bezier(.17,.67,.78,.31,.17,.67,.78,.31)'
         * @param {number} x Progress
         * @property obsolete
         *///TOFIX: ERROR calculation result is wrong
        function cubicBezierFunction(bp, x) {
            var calcFp = function (ps, t) {
                return parseFloat((Math.pow(1 - t, 3) * ps[0] + 3 * t * Math.pow(1 - t, 2) * ps[1] + 3 * (1 - t) * Math.pow(t, 2) * ps[2] + Math.pow(t, 3) * ps[3]).toLocaleString());
            }
            var bpInArray = bp.substring(bp.indexOf('(') + 1, bp.indexOf(')')).split(',').map(function (i) { return parseFloat(i) }),
                // Cubic Bézier curves points
                ps = bpInArray.length < 4 ? [0, 0, 0, 0, 1, 1, 1, 1]
                    : bpInArray.length >= 4 && bpInArray.length < 8 ? [].concat([0, 0], bpInArray.slice(0, 4), [1.0, 1.0])
                        : bpInArray.length > 8 ? bpInArray.slice(0, 8) : bpInArray,
                // parameters to calculate a, b, c, d
                ft1 = 0.1,
                ft2 = 0.8,
                fpx1 = calcFp([ps[0], ps[2], ps[4], ps[6]], ft1),
                fpy1 = calcFp([ps[1], ps[3], ps[5], ps[7]], ft1),
                fpx2 = calcFp([ps[0], ps[2], ps[4], ps[6]], ft2),
                fpy2 = calcFp([ps[1], ps[3], ps[5], ps[7]], ft2),
                // Coefficient of cubic equation
                // TOFIX: ERROR there may be a wrong logic, calculation result of a,b,c,d seems wrong.
                // ERROR: four points on line cannot give only one bezier curve, two points on line and two control points needed instead.
                cs = gaussianElimination([
                    [0, 0, 0, 1],
                    [Math.pow(fpx1, 3), Math.pow(fpx1, 2), fpx1, 1],
                    [Math.pow(fpx2, 3), Math.pow(fpx2, 2), fpx2, 1],
                    [1, 1, 1, 1]
                ], [0, fpy1, fpy2, 1]),
                a = cs[0], b = cs[1], c = cs[2], d = cs[3];

            return parseFloat((a * Math.pow(x, 3) + b * Math.pow(x, 2) + c * x + d).toLocaleString());
        }



        /**
         * Elements must implement biggerThan() or greaterThan(), or otherwise can be compared via 'greater than' sign
         * 
         * @param {Array} array 
         * @param {number} value 
         * @returns {number} Return the index of the first element that is greater than the given value in an array.
         *                  Return -1 if there exists no element greater than the given value.
         */
        function firstGreaterThan(array, value) {
            var length = array.length;
            if (array[0].biggerThan) {
                for (var i = 0; i < length; i++) {
                    if (array[i].biggerThan(value)) {
                        return i;
                    }
                }
                return -1;
            } else if (array[0].greaterThan) {
                for (var i = 0; i < length; i++) {
                    if (array[i].greaterThan(value)) {
                        return i;
                    }
                }
                return -1;
            } else {
                for (var i = 0; i < length; i++) {
                    if (array[i] > value) {
                        return i;
                    }
                }
                return -1;
            }
        };

        /**
         * Get CSS property of 'font-size' with window.document.body
         * 
         */
        var fontSizeInPx = getComputedSizeInPx(win.document.body, 'font-size');

        /**
         * Get element computed style.
         * 
         * @param {Element} ele Target element.
         * @param {String} prop Target property.
         * @returns Return a computed style.
         */
        function getStyle(ele, prop) {
            var propVal = window.getComputedStyle ? window.getComputedStyle(ele, null)[prop] : ele.currentStyle[prop];
            var safariBugFix = {
                "left": ele.offsetLeft,
                "top": ele.offsetTop,
                "right": document.documentElement.clientWidth - ele.offsetLeft - ele.offsetWidth,
                "bottom": document.documentElement.clientHeight - ele.offsetTop - ele.offsetWidth
            }
            return safariBugFix[prop] || propVal;
        }

        /**
         * Get computed size in px of an element.
         * 
         * @param {Element} ele An element with document or window or otherwise.
         * @param {string} type A CSS property that wanna to get.
         * @return {number} Return computed size in px of the element {@param ele}
         */
        function getComputedSizeInPx(ele, type) {
            window.getComputedStyle = window.getComputedStyle || (
                window.getComputedStyle = function (e, t) {
                    return this.el = e,
                        this.getPropertyValue = function (t) {
                            var n = /(\-([a-z]){1})/g;
                            return t == 'float' && (t = 'styleFloat'),
                                n.test(t) && (t = t.replace(n, function () {
                                    return arguments[2].toUpperCase()
                                })),
                                e.currentStyle[t] ? e.currentStyle[t] : null
                        }, this
                });

            if (ele instanceof Element)
                return parseInt((window.getComputedStyle(ele, null).getPropertyValue(type)), 10);
            return;
        };

        /**
         * Get browser type
         * 
         * @returns Return type of browser: Firefox|Chrome|IE|Opera|Safari|Edge|Unknown
         */
        function getBrowserType() {
            var userAgent = navigator.userAgent,
                isOpera = userAgent.indexOf("Opera") > -1,
                isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera,
                isEdge = userAgent.indexOf("Windows NT 6.1; Trident/7.0;") > -1 && !isIE,
                isFirefox = userAgent.indexOf("Firefox") > -1,
                isSafari = userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") == -1,
                isChrome = userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1;
            return isFirefox ? "Firefox" : isOpera ? "Opera" : isSafari ? "Safari" : isChrome ? "Chrome" : isIE ? "IE" : isEdge ? "Edge" : "Unknown";
        }

        /**
         * Create a copy of obj
         * 
         * @param {{}} obj The object to make a copy
         * @returns return a copy of obj if it's really Object
         *          return obj itself if obj is null or it's not a Object
         */
        function cloneObject(obj) {
            var copy;

            // Handle the 3 simple types, and null or undefined
            if (null == obj || 'object' != typeof obj) return obj;

            // Handle Date
            if (obj instanceof Date) {
                copy = new Date();
                copy.setTime(obj.getTime());
                return copy;
            }

            // Handle Array
            if (obj instanceof Array) {
                copy = [];
                for (var i = 0, len = obj.length; i < len; i++) {
                    copy[i] = cloneObject(obj[i]);
                }
                return copy;
            }

            // Handle Object
            if (obj instanceof Object) {
                copy = {};
                for (var attr in obj) {
                    if (obj.hasOwnProperty(attr)) copy[attr] = cloneObject(obj[attr]);
                }
                return copy;
            }

            throw new Error('Unable to copy obj! Its type is not supported.');
        }

        /**
         * Set bounding rectangle for a element
         **      If rectArr is not a Array or rectArr's length is 0, do noting
         **      If rectArr's length is 1 and item in rectArr is not undefined, set only width
         **      If rectArr's length is 2 and item in rectArr is not undefined, set width and height
         **      If rectArr's length is 3 and item in rectArr is not undefined, set width, height and left
         **      Default: set width, height, left and top for target

         * @param {Element} target The element to set bounding rectangle
         * @param {[(undefined|string),(undefined|string),(undefined|string),(undefined|string)]} rectArr A <strong>number</strong> string array ([width?, height?, left?, top?]) represented the bound rectangle of target
         */
        function setBoundingRectangle(target, rectArr) {
            if (!target) return;
            if (!(rectArr instanceof Array) || rectArr.length === 0) return;
            if (rectArr.length > 4) rectArr = rectArr.slice(0, 3);
            switch (rectArr.length) {
                case 1:
                    if (rectArr[0]) target.style.width = rectArr[0].endsWith('%') ? rectArr[0] : rectArr[0] + 'px';
                    break;
                case 2:
                    if (rectArr[0]) target.style.width = rectArr[0].endsWith('%') ? rectArr[0] : rectArr[0] + 'px';
                    if (rectArr[1]) target.style.top = rectArr[1].endsWith('%') ? rectArr[1] : rectArr[1] + 'px';
                    break;
                case 3:
                    if (rectArr[0]) target.style.width = rectArr[0].endsWith('%') ? rectArr[0] : rectArr[0] + 'px';
                    if (rectArr[1]) target.style.height = rectArr[1].endsWith('%') ? rectArr[1] : rectArr[1] + 'px';
                    if (rectArr[2]) target.style.top = rectArr[2].endsWith('%') ? rectArr[2] : rectArr[2] + 'px';
                    break;
                default:
                    if (rectArr[0]) target.style.width = rectArr[0].endsWith('%') ? rectArr[0] : rectArr[0] + 'px';
                    if (rectArr[1]) target.style.height = rectArr[1].endsWith('%') ? rectArr[1] : rectArr[1] + 'px';
                    if (rectArr[2]) target.style.top = rectArr[2].endsWith('%') ? rectArr[2] : rectArr[2] + 'px';
                    if (rectArr[3]) target.style.left = rectArr[3].endsWith('%') ? rectArr[3] : rectArr[3] + 'px';
                    break;
            }
        }

        /**
         * A detection for CSS3 style property in current browser
         * 
         * @param {string} cssProp CSS3 style property in string
         * @returns return true if the browser support the css style property, return false otherwise
         */
        function isBrowserSupportProp(cssProp) {
            var root = document.documentElement;
            if (cssProp in root.style) {
                return true;
            }
            return false;
        }

        /**
         * Polyfill for requestAnimationFrame
         * 
         * @returns browser polyfill requestAnimationFrame
         */
        function requestAnimFrame() {
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function (callback) {
                    window.setTimeout(callback, 1000 / 60);
                }
        }

        /**
         * Round a number to a specific scale
         * 
         * @param {number} number The number to be rounded
         * @param {number} scale The scale to round to
         * @return {number} Return the {@param number} rounded result
         */
        function roundTo(number, scale) {
            if (isNaN(scale)) {
                return;
            }
            var factor = Math.pow(10, Math.floor(scale));
            return Math.round(factor * number) / factor;
        }

        /**
         * Get first parent element that first CSS property position is relative
         * 
         * @param {any} ele The element to get  first parent element that first CSS property position is relative
         * @returns first parent element that first CSS property position is relative if there existe one, else return document.documentElement
         */
        function getFirstRelativeParent(ele) {
            if (ele === document.documentElement) return ele;
            return getStyle(ele.parentNode, 'position') === 'relative' ? ele.parentNode : getFirstRelativeParent(ele.parentNode);
        }

        /**
         * Add a event listener for a element
         * 
         * @param {Element} target The element to attach listener
         * @param {string} type A string representing the event type to listen for
         * @param {*} listener The object which receives a notification. This must be an object implementing the EventListener interface, or a JavaScript function
         */
        function addEvent(target, type, listener, useCapture) {
            if (target == null || typeof (target) == 'undefined') return;
            if (target.addEventListener) {
                target.addEventListener(type, listener, useCapture || false);
            } else if (target.attachEvent) {
                target.attachEvent('on' + type, listener);
            } else {
                target['on' + type] = listener;
            }
        }

        /**
         * Remove a event listener for a element.
         * 
         * @param {Element} target target The element to attach listener.
         * @param {string} type The type name of the event.
         */
        function removeEvent(target, type) {
            if (!target || !type || !listener) return;
            if (target.removeEventListener) {
                target.removeEventListener(type, listener);
            } else {
                target.detachEvent("on" + type, listener);
            }
        }

        /**
         * Create an event object.
         *
         * @param {string} eventType The type name of the event.
         * @param {boolean} bubbles Whether the event should bubble up the DOM.
         * @param {boolean} cancelable Whether the event can be canceled.
         * @returns {!Event}
         */
        function createEvent(eventType, bubbles, cancelable) {
            if ('CustomEvent' in window && typeof window.CustomEvent === 'function') {
                return new CustomEvent(eventType, {
                    bubbles: bubbles,
                    cancelable: cancelable
                });
            } else {
                var evt = document.createEvent('Events');
                evt.initEvent(eventType, bubbles, cancelable);
                return evt;
            }
        }

        /**
         * Dispatches an Event at the specified EventTarget
         * 
         * @param {Element} target is used to initialize the Event.target and determine which event listeners to invoke.
         * @param {Event} event is the Event object to be dispatched.
         */
        function dispatchEvent(target, type, event) {
            if (target.dispatchEvent) {
                return target.dispatchEvent(event);
            }
            if (target.fireEvent) {
                return target.fireEvent('on' + type, event)
            }
        }

        /**
         * Create a specific animaion
         * 
         * @param {Element} ele The element to execute animation.
         * @param {{properties: ({}), duration?: (string|number), easing?: (string), easings?: ([string]), start?: (Function), complete? : (Function)}} options Parameters to initial animation.
         *   properties=: An object of CSS properties and values that the animation will move toward.
         *   duration=: A string or number determining how long the animation will run. default: 400.
         *   easing=: A string indicating which easing function to use for the transition. default: 'linear'.
         *   easings=: A series strings in array indicating which easing function to use for the transition. default: [].
         *   start=? A function to call when the animation on an element begins.
         *   complete=? A function to call once the animation is complete.
         *   cycle=? If the animate is cycle.
         * @returns Return while there are something not match.
         */
        function animate(ele, options) {
            if (!options || !options.properties || !(options.properties instanceof Object)) return;
            // Initial parameters
            var props = options.properties,
                duration = options.duration === 'fast' ? 300 : options.duration === 'normal' ? 900 : options.duration === 'slow' ? 1500 : options.duration || 400,
                easing = options.easing || 'linear',
                easings = options.easings || [],
                start = options.start || function () { },
                complete = options.complete || function () { },
                cycle = options.cycle || false;

            start();

            var mainEntry = (function () {
                // Initial parameters
                var count = 0, progressNum = 0, tsNum = 0, t = 0, timespan = 0, index = 0, time = 0,
                    zeroGapIndex = [], origin = [], target = [], keyframes = [], x = [], xs = [], y = [], ys = [], animTypes = [], psList = [], propInArray = [],trueTimeframes = [], trueKeyFrames = [], indexs = [],
                    animType, style, bpInArray, ps,
                    supportProps = {
                        backgroundPosition: 'backgroundPosition', borderWidth: 'borderWidth', borderBottomWidth: 'borderBottomWidth', borderLeftWidth: 'borderLeftWidth', borderRightWidth: 'borderRightWidth', borderTopWidth: 'borderTopWidth', borderSpacing: 'borderSpacing', margin: 'margin', marginBottom: 'marginBottom', marginLeft: 'marginLeft', marginRight: 'marginRight', marginTop: 'marginTop', outlineWidth: 'outlineWidth', padding: 'padding', paddingBottom: 'paddingBottom', paddingLeft: 'paddingLeft', paddingRight: 'paddingRight', paddingTop: 'paddingTop', height: 'height', width: 'width', maxHeight: 'maxHeight', maxWidth: 'maxWidth', minHeight: 'minHeight', minWidth: 'minWidth', font: 'font', fontSize: 'fontSize', bottom: 'bottom', left: 'left', right: 'right', top: 'top', letterSpacing: 'letterSpacing', wordSpacing: 'wordSpacing', lineHeight: 'lineHeight', textIndent: 'textIndent', opacity: 'opacity', clip: 'clip'
                    },
                    anim = {
                        'ease': 'cubic-bezier(.25,.1,.25,1)',
                        'linear': 'cubic-bezier(0,0,1,1)',
                        'ease-in': 'cubic-bezier(.42,0,1,1)',
                        'ease-out': 'cubic-bezier(0,0,.58,1)',
                        'ease-in-out': 'cubic-bezier(.42,0,.58,1)',
                        'cubic-bezier': easing
                    };

                for (var p in props) {
                    propInArray.push(p);
                    props[p] += '';
                    if (!(p in supportProps)) continue;
                    style = getStyle(ele, p);
                    if (p !== 'clip') origin.push(parseFloat(style));
                    if (props[p].indexOf('%') > -1) {
                        if (/.*height|.*top/i.test(p)) {
                            target.push(parseFloat(props[p]) / 100 * document.documentElement.clientHeight);
                        } else if (p === 'margin' || p === 'padding') {
                            var propVals = props[p].split(' ');
                            if (propVals.length === 1) {
                                props[p + 'Top'] = props[p + 'Bottom'] = parseFloat(propVals[0]) / 100 * document.documentElement.clientHeight;
                                props[p + 'Left'] = props[p + 'Right'] = parseFloat(propVals[0]) / 100 * document.documentElement.clientWidth;
                            }
                            if (propVals.length === 2) {
                                props[p + 'Top'] = props[p + 'Bottom'] = parseFloat(propVals[0]) / 100 * document.documentElement.clientHeight;
                                props[p + 'Left'] = props[p + 'Right'] = parseFloat(propVals[1]) / 100 * document.documentElement.clientWidth;
                            }
                            if (propVals.length === 3) {
                                props[p + 'Top'] = parseFloat(propVals[0]) / 100 * document.documentElement.clientHeight;
                                props[p + 'Bottom'] = parseFloat(propVals[2]) / 100 * document.documentElement.clientHeight;
                                props[p + 'Left'] = props[p + 'Right'] = parseFloat(propVals[1]) / 100 * document.documentElement.clientWidth;
                            }
                            if (propVals.length >= 4) {
                                props[p + 'Top'] = parseFloat(propVals[0]) / 100 * document.documentElement.clientHeight;
                                props[p + 'Bottom'] = parseFloat(propVals[2]) / 100 * document.documentElement.clientHeight;
                                props[p + 'Left'] = parseFloat(propVals[3]) / 100 * document.documentElement.clientWidth;
                                props[p + 'Right'] = parseFloat(propVals[1]) / 100 * document.documentElement.clientWidth;
                            }
                            origin.push(parseFloat(getStyle(ele, p + '-top')));
                            origin.push(parseFloat(getStyle(ele, p + '-bottom')));
                            origin.push(parseFloat(getStyle(ele, p + '-left')));
                            origin.push(parseFloat(getStyle(ele, p + '-right')));
                            target.push(props[p + 'Top']);
                            target.push(props[p + 'Bottom']);
                            target.push(props[p + 'Left']);
                            target.push(props[p + 'Right']);
                            delete props[p];
                            count += 3;
                        } else {
                            var firstRelativeParent = getFirstRelativeParent(ele);
                            target.push(parseFloat(props[p]) / 100 * parseFloat(getStyle(firstRelativeParent, 'width')));
                        }
                    } else {
                        if (p !== 'clip') target.push(parseFloat(props[p]));
                    }
                    if (p === 'clip') {
                        // console.log('A');
                        if (getStyle(ele, 'position') !== 'absolute' || !(/rect\((-?\d+px[,|\s]{1}\s*){3}-?\d+px\)/g.test(props[p]))) return;
                        // console.log('B');
                        var propVals = props[p].replace(/,/g, ' ').replace(/\s+/g, ' ').replace('rect(', '').replace(')', '').split(' ');
                        // var oClip = getStyle(ele, 'clip') === 'auto' ? [getStyle(ele, 'top'), getStyle(ele, 'width'), getStyle(ele, 'height'), getStyle(ele, 'left')] : getStyle(ele, 'clip').replace(/,/g, '').replace(/\s+/g, ' ').replace('rect(', '').replace(')', '').split(' ');
                        var oClip = getStyle(ele, 'clip') === 'auto' ? [0, getStyle(ele, 'width') + 10, getStyle(ele, 'height') + 10, 0] : getStyle(ele, 'clip').replace(/,/g, '').replace(/\s+/g, ' ').replace('rect(', '').replace(')', '').split(' ');
                        origin.push(parseFloat(oClip[0]));
                        origin.push(parseFloat(oClip[1]));
                        origin.push(parseFloat(oClip[2]));
                        origin.push(parseFloat(oClip[3]));
                        target.push(parseFloat(propVals[0]));
                        target.push(parseFloat(propVals[1]));
                        target.push(parseFloat(propVals[2]));
                        target.push(parseFloat(propVals[3]));
                    }
                    count++;
                }

                if ('clip' in props) count = count + 3;

                if (easings.length === 0) {
                    animType = anim[easing] ? anim[easing] : /cubic-bezier\([\d|,|\.]+\)/g.test(easing) ? anim['cubic-bezier'] : anim['linear'];
                    animTypes.push(animType);
                } else {
                    for (var i = 0; i < easings.length; i++) {
                        animType = anim[easings[i]] ? anim[easings[i]] : /cubic-bezier\([\d|,|\.]+\)/g.test(easings[i]) ? easings[i] : anim['linear'];
                        animTypes.push(animType);
                    }
                }

                // Calculation of cubic-bezier curve points list.
                var calcCBPoints = (function () {
                    tsNum = duration * 60 / 1000;
                    timespan = 1 / tsNum;
                    for (var i = 0; i < animTypes.length; i++) {
                        bpInArray = animTypes[i].substring(animTypes[i].indexOf('(') + 1, animTypes[i].indexOf(')')).split(',').map(function (i) { return parseFloat(i) });
                        // Cubic Bézier curves points
                        ps = bpInArray.length < 4 ? [0, 0, 0, 0, 1, 1, 1, 1]
                            : bpInArray.length >= 4 && bpInArray.length < 8 ? [].concat([0, 0], bpInArray.slice(0, 4), [1.0, 1.0]) : bpInArray.length > 8 ? bpInArray.slice(0, 8) : bpInArray;
                        if (propInArray[i] == 'margin' || propInArray[i] == 'padding' || propInArray[i] == 'clip') {
                            var x = 0;
                            while (x < 4) {
                                psList.push(ps);
                            x++;
                            }
                        } else {
                            psList.push(ps);
                        }
                    }

                    for (var k = 0; k < count; k++) {
                        t = 0; x = []; y = [];
                        for (var i = 0; i < tsNum; i++) {
                            if (psList[k]) {
                                x.push(calccubicBezierPoint([psList[k][0], psList[k][2], psList[k][4], psList[k][6]], t));
                                y.push(calccubicBezierPoint([psList[k][1], psList[k][3], psList[k][5], psList[k][7]], t));
                            } else {
                                x.push(calccubicBezierPoint([0, 0, 1, 1], t));
                                y.push(calccubicBezierPoint([0, 0, 1, 1], t));
                            }
                            t += timespan;
                        }
                        xs.push(x);
                        ys.push(y);
                    }
                })();

                // Calculation of linear time keyframe.
                for (var i = 0; i < count; i++) {
                    var tempKeyFrames = [], tempKeyFrame = origin[i], per = 0, gap = target[i] - origin[i];
                    for (var j = 0; j < tsNum; j++) {
                        tempKeyFrames.push(tempKeyFrame);
                        // cubic-bezier curve's x is not in linear state. so the calculation result of tempKeyFrame cannot be used immediately.
                        tempKeyFrame = origin[i] + ys[i][j] * gap;
                    }

                    tempKeyFrames.push(target[i]);
                    keyframes.push(tempKeyFrames);
                }

                // Fix 0 gap
                for (var i = 0; i < keyframes.length; i++) {
                    if (keyframes[i].length !== 1) {
                        if (progressNum < keyframes[i].length) progressNum = keyframes[i].length;
                    } else {
                        zeroGapIndex.push(i);
                    }
                }
                if (progressNum !== 0) {
                    for (var i = 0; i < progressNum - 1; i++) {
                        for (var j = 0; j < zeroGapIndex.length; j++) {
                            keyframes[zeroGapIndex[j]].push(keyframes[zeroGapIndex[j]][0]);
                        }
                    }
                }

                var requestAnimFrame =
                    window.requestAnimationFrame ||
                    window.webkitRequestAnimationFrame ||
                    window.mozRequestAnimationFrame ||
                    window.oRequestAnimationFrame ||
                    window.msRequestAnimationFrame ||
                    function (callback) {
                        window.setTimeout(callback, 1000 / 60);
                    };

                // time mapping : timespan to cubic-bezier time
                var timeKeyframeCorrection = (function () {
                    for (var k = 0; k < xs.length; k++) {
                        var trueTimeframe = xs[k].map(function (i) {
                            return i * duration;
                        });
                        trueTimeframes.push(trueTimeframe);
                    }

                    for (var i = 0; i < trueTimeframes.length; i++) {
                        time = 0;
                        var tempIndex = [];
                        var times = [];
                        for (; time < duration; time += 1000 / 60) {
                            times.push(time);
                            if (time > duration) {
                                time = duration;
                            }
                            for (var k = 0; k < trueTimeframes[i].length; k++) {
                                if (time <= trueTimeframes[i][k]) {
                                    tempIndex.push(k);
                                    break;
                                }
                            }
                        }
                        tempIndex.push(trueTimeframes[0].length);
                        indexs.push(tempIndex);
                    }

                })();

                var go = function () {
                    var pi = 0, ti = 0;
                    for (var prop in props) {
                        ti = indexs[pi][index];
                        if (prop === 'clip') {
                            ele.style[prop] = 'rect(' + keyframes[pi][ti] + 'px, ' + keyframes[pi + 1][ti] + 'px, ' + keyframes[pi + 2][ti] + 'px, ' + keyframes[pi + 3][ti] + 'px' + ')';
                            pi += 4;
                            continue;
                        }
                        prop === 'opacity' ? ele.style[prop] = keyframes[pi][ti] : ele.style[prop] = keyframes[pi][ti] + 'px';
                        pi++;
                    }
                    index++;

                    if (index !== indexs[pi - 1].length) {
                        requestAnimFrame(go);
                    } else {
                        complete();
                        setTimeout(function () {
                            if (cycle) {
                                for (var p in props) {
                                    ele.style[p] = props[p];
                                }
                                index = 0;
                                requestAnimFrame(go);
                            }
                        }, 500);
                    };
                }
                requestAnimFrame(go);
            })();
        }

        return {
            calcCubicEquation: calcCubicEquation,
            calcQuadraticEquation: calcQuadraticEquation,
            firstGreaterThan: firstGreaterThan,
            fontSizeInPx: fontSizeInPx,
            getStyle: getStyle,
            getComputedSizeInPx: getComputedSizeInPx,
            setBoundingRectangle: setBoundingRectangle,
            roundTo: roundTo,
            addEvent: addEvent,
            cloneObject: cloneObject,
            isBrowserSupportProp: isBrowserSupportProp,
            requestAnimFrame: requestAnimFrame,
            cubicBezierFunction: cubicBezierFunction,
            gaussianElimination: gaussianElimination,
            getBrowserType: getBrowserType,
            animate: animate
        }
    })();

    // Default style for Yuko's layout
    Yuko.style = (function () {
        // Initial Yuko Fragment Style
        function initFragStyle() {
            // Document element
            var header = document.getElementsByTagName('header').item(0);
            var footer = document.getElementsByTagName('footer').item(0);
            var main = document.getElementsByTagName('main').item(0);
            var firstYukoContent = document.querySelectorAll('.yuko-content').item(0);
            // Element property
            var headerHeight = Yuko.utility.getComputedSizeInPx(header, 'height');
            var firstPageHeight = Yuko.utility.getComputedSizeInPx(firstYukoContent, 'height');

            // Default footer style
            if (footer) footer.style.top = (firstPageHeight < document.body.clientHeight - headerHeight ? document.body.clientHeight - headerHeight : firstPageHeight + headerHeight).toString() + 'px';
            // Default main style
            if (main) main.style.height = (document.body.clientHeight - 112) + 'px';
        }

        // Initial Carousel Style
        function initCarouselStyle() {
            // Carousel Container
            var carouselContainer = document.getElementById('yuko-carousel-container');
            // Carousel Parameter
            var carouselContainerHeight, carouselTitleHeight, carouselHeight;
            // If there should be a Caeousel
            if (carouselContainer) {
                var carouselTitle = document.getElementById('yuko-carousel-title');
                var carousel = document.getElementById('yuko-carousel');
                var carouselList = document.querySelectorAll('.yuko-carousel-item');

                carouselContainerHeight = Yuko.utility.getComputedSizeInPx(carouselContainer, 'height');
                carouselTitleHeight = Yuko.utility.getComputedSizeInPx(carouselTitle, 'height');
                carouselHeight = Yuko.utility.getComputedSizeInPx(carousel, 'height');

                if (carouselHeight !== carouselContainerHeight - carouselTitleHeight)
                    carousel.style.height = (carouselContainerHeight - carouselTitleHeight) + 'px';
            }
        }

        // Initial CarouselV2 Style
        function initCarouselV2Style() {

        }

        return {
            initFragStyle: initFragStyle,
            initCarouselStyle: initCarouselStyle,
            initCarouselV2Style: initCarouselV2Style
        }
    })();

    Yuko.event = (function () {

        /**
         * Bind page and drawer list item
         * @param {Element} drawer The drawer container
         * @param {Function} drawerContainer Yuko.widget.navigationDrawer(drawer, hamburger, options) function
         * @param {Function} pageContainer Yuko.widget.pageContainer(container, option, onPageContainerReady, onAnimationComplete) function
         */
        function bindDrawerNavItemToPage(drawer, drawerContainer, pageContainer) {
            var drawerList = document.querySelectorAll('#' + drawer.id + ' li');
            for (var i = 0; i < drawerList.length; i++) {
                drawerList[i].addEventListener('touchend', (function (i) {
                    return function () {
                        // Switch main page to show
                        pageContainer.slideTo(i);
                    }
                })(i));
            }
        }

        return {
            bindDrawerNavItemToPage: bindDrawerNavItemToPage
        }

    })();

    // Yuko's effect
    Yuko.effect = (function () {
        /**
         * Create a ripple effect
         * @param {Event} event The DOM Event which was triggered
         * @return {Boolean} Return true all the time
         */
        function rippleEffect(event) {
            event.stopPropagation();
            // var target = event.target;
            var rect = this.getBoundingClientRect();
            var ripple = this.querySelector('.ripple');
            if (!ripple) {
                ripple = document.createElement('span');
                ripple.className = 'ripple';
                ripple.style.height = ripple.style.width = Math.max(rect.width, rect.height) + 'px';
                this.appendChild(ripple);
            }
            ripple.classList.remove('show');
            var top = (event instanceof MouseEvent ? event.clientY - rect.top - ripple.offsetHeight / 2 - document.body.scrollTop : event.changedTouches[0].pageY - rect.top - ripple.offsetHeight / 2 - document.body.scrollTop);
            var left = (event instanceof MouseEvent ? event.clientX - rect.left - ripple.offsetWidth / 2 - document.body.scrollLeft : event.changedTouches[0].pageX - rect.left - ripple.offsetWidth / 2 - document.body.scrollLeft);
            ripple.style.top = top + 'px';
            ripple.style.left = left + 'px';
            ripple.classList.add('show');
            return true;
        }

        return {
            rippleEffect: rippleEffect
        }
    })();

    // Yuko's widget
    Yuko.widget = (function () {

        /**
         * Make the drawer a touch sensitive android like navigation drawer
         * @param {Element} drawer The Element to be manipulated
         * @param {Element} hamburger A hamburger button to trigger the drawer
         * @param {{timespan : (number|undefined), mask : (Boolean|undefined), animationType : (string|undefined)}=} options
         *         timespan=: Time span of animation in milliseconds. Default: 300.
         *         mask=: Indicate whether there is a mask for drawer.
         *         animationType=: The functional relationship between time and position. optional:'none','linear','quadratic'
         */
        function navigationDrawer(drawer, hamburger, options) {
            // Load parameters
            var button, options;
            switch (arguments.length) {
                case 0:
                case 1:
                    return;
                case 2:
                    if (arguments[1] instanceof Element) {
                        button = arguments[1];
                    } else {
                        options = arguments[1];
                    }
                    break;
                case 3:
                    button = arguments[1];
                    options = arguments[2];
                    break;
                default:
                    return;
            }

            // Initial drawer option
            var width = Math.floor(Yuko.utility.getComputedSizeInPx(drawer, 'width'));
            var timeSpan = options.timeSpan ? options.timeSpan : 300;
            var animationType = options.animationType ? options.animationType : 'linear';
            var mask = options.mask ? true : false;

            /**
             * Curried function for position calculation (time as variable)
             * @param {number} progress A timespan
             */
            var curriedTimeFunction = (function () {
                switch (options.animationType) {
                    case 'linear':
                        var a = width / timeSpan;
                        var b = -width;
                        return function (progress) {
                            return a * progress + b;
                        };
                        break;
                    case 'quadratic':
                        var a = -width / (timeSpan * timeSpan);
                        var b = 2 * width / timeSpan;
                        var c = -width;
                        return function (progress) {
                            return Yuko.utility.calcQuadraticEquation(a, b, c, progress);
                        };
                        break;
                    default:
                        break;
                }
            })();

            /**
             * Curried function for time calculation (position as variable)
             * @param {number} left CSS property of left with drawer
             */
            var curriedPositionFunction = (function () {
                switch (options.animationType) {
                    case 'linear':
                        var a = timeSpan / width;
                        var b = timeSpan;
                        return function (left) {
                            return a * left + b;
                        };
                        break;
                    case 'quadratic':
                        return function (left) {
                            return timeSpan * (1 - Math.sqrt(-left / width));
                        };
                        break;
                    default:
                        break;
                }
            })();

            // Save position for each progress
            var keyTimeFrames = [];
            for (var i = 0; i <= timeSpan; i++) {
                keyTimeFrames.push(curriedTimeFunction(i));
            }
            for (var i = 0; i < 16; i++) {
                keyTimeFrames.push(curriedTimeFunction(timeSpan));
            }

            // Save progress for each position
            var keyPositionFrames = [];
            for (var i = -width; i <= 0; i++) {
                keyPositionFrames.push(curriedPositionFunction(i));
            }
            for (var i = 0; i < 16; i++) {
                keyPositionFrames.push(curriedPositionFunction(0));
            }

            // Public variables for event handlers
            var startPoint;
            var startTime;
            var currentPoint;
            var endPoint;
            var endTime;
            var distance;
            var menuDisplayed = false;
            var thereShouldBeAnAnimation = false;
            var positionIndex;
            var drawerList = document.querySelectorAll('#' + drawer.id + ' li');
            var pageList = document.querySelectorAll('.yuko-content');
            var footer = document.getElementsByTagName('footer').item(0);
            var hamburgerLeft, hamburgerTop, hamburgerRight, hamburgerBottom;
            if (hamburger) {
                hamburgerLeft = hamburger.offsetLeft;
                hamburgerTop = hamburger.offsetTop;
                hamburgerRight = hamburgerLeft + hamburger.offsetWidth;
                hamburgerBottom = hamburgerTop + hamburger.offsetHeight;
            }

            // Initial swipe events
            var onWindowTouchStart = function (e) {
                startPoint = e.changedTouches[0];
                startTime = new Date().getTime();
            };

            var onWindowTouchMove = function (e) {
                currentPoint = e.changedTouches[0];

                if (menuDisplayed) {
                    currentPoint = e.changedTouches[0];
                    if (currentPoint.clientX <= width) {
                        distance = currentPoint.clientX - (startPoint.clientX <= width ? startPoint.clientX : width);
                        drawer.style.left = (distance < 0 ? distance : 0) + 'px';
                    }
                    thereShouldBeAnAnimation = true;
                    e.stopImmediatePropagation();
                } else if (startPoint.clientX < 16) {
                    distance = currentPoint.clientX - startPoint.clientX;
                    drawer.style.left = (distance < 0 ? -width : distance > width ? 0 : distance - width) + 'px';
                    thereShouldBeAnAnimation = true;
                    e.stopImmediatePropagation();
                }
                // Mask
                if (mask) {
                    drawer.parentNode.style.background = 'rgba(0,0,0,' + (1 - Math.abs(Math.round(drawer.offsetLeft)) / Math.round(drawer.offsetWidth)) * 0.6 + ')';
                }
            };

            var onWindowTouchEnd = function (e) {
                endPoint = e.changedTouches[0];
                endTime = new Date().getTime();

                if (menuDisplayed && startPoint.clientX > width && endPoint.clientX > width && (endTime - startTime < 1000)) {
                    showMenu(false);
                }

                if (thereShouldBeAnAnimation) {
                    showMenu(Yuko.utility.getComputedSizeInPx(drawer, 'left') > ((menuDisplayed ? -0.382 : -0.618) * width));
                }
                thereShouldBeAnAnimation = false;
            };

            var onHamburgerTouchEnd = function (e) {
                endPoint = e.changedTouches[0];
                // Show menu and stopImmediatePropagation if hamburger button is clicked
                if (endPoint.clientX <= hamburgerRight && endPoint.clientX >= hamburgerLeft && endPoint.clientY <= hamburgerBottom && endPoint.clientY >= hamburgerTop) {
                    showMenu(true);
                    e.stopImmediatePropagation();
                }
            };

            var attachTouchEvents = function (boolean) {
                if (boolean) {
                    win.addEventListener('touchstart', onWindowTouchStart, true);
                    win.addEventListener('touchmove', onWindowTouchMove, true);
                    win.addEventListener('touchend', onWindowTouchEnd, true);
                    if (hamburger) {
                        hamburger.addEventListener('touchend', onHamburgerTouchEnd, false);
                    }
                } else {
                    win.removeEventListener('touchstart', onWindowTouchStart);
                    win.removeEventListener('touchmove', onWindowTouchMove);
                    win.removeEventListener('touchend', onWindowTouchEnd);
                    if (hamburger) {
                        hamburger.removeEventListener('touchend', onHamburgerTouchEnd);
                    }
                }

            };
            attachTouchEvents(true);
            // Change style for drawer list and add effect to it
            for (var i = 0; i < drawerList.length; i++) {
                drawerList[i].addEventListener('touchstart', (function () {
                    return function () {
                        for (var j = 0; j < drawerList.length; j++) {
                            drawerList[j].className = 'yuko-nav-item';
                        }
                    }
                })());
                drawerList[i].addEventListener('touchend', (function (i) {
                    return function () {
                        // Change style of nav list item
                        drawerList[i].className = 'yuko-nav-item item-selected'
                        // Adjust position of footer
                        footer.style.top = (pageList[i].offsetHeight < document.body.clientHeight - 56 ? document.body.clientHeight - 56 : pageList[i].offsetHeight + 56) + 'px';
                        // Adjust height of main
                        document.getElementsByTagName('main').item(0).style.height = pageList[i].offsetHeight + 'px';
                        showMenu(false);
                    }
                })(i));
                drawerList[i].addEventListener('touchstart', Yuko.effect.rippleEffect, false);
            }
            /**
             * Show or hide the drawer
             * @param {Boolean} boolean 
             */
            var showMenu = function (boolean) {
                var currentPosition = 0;
                var startProgress = 0;
                var start = null;

                var showProcess = function (timestamp) {
                    if (!start) {
                        start = timestamp;
                    }
                    positionIndex = Math.floor(startProgress + timestamp - start);
                    if (mask) {
                        drawer.parentNode.style.background = 'rgba(0,0,0,' + (1 - Math.abs(keyTimeFrames[positionIndex] / drawer.offsetWidth)) * 0.6 + ')';
                    }
                    drawer.style.left = keyTimeFrames[positionIndex] + 'px';

                    if (positionIndex < timeSpan) {
                        win.requestAnimationFrame(showProcess);
                    } else {
                        drawer.parentNode.style.position = 'fixed';
                        drawer.style.left = 0;
                        menuDisplayed = true;
                        attachTouchEvents(true);
                    }
                };

                var hideProcess = function (timestamp) {
                    if (!start) {
                        start = timestamp;
                    }
                    positionIndex = Math.floor(startProgress - timestamp + start);
                    if (mask) {
                        drawer.parentNode.style.background = 'rgba(0,0,0,' + (1 - Math.abs(keyTimeFrames[positionIndex] / drawer.offsetWidth)) * 0.6 + ')';
                    }
                    drawer.style.left = keyTimeFrames[positionIndex] + 'px';

                    if (positionIndex > 0) {
                        win.requestAnimationFrame(hideProcess);
                    } else {
                        drawer.parentNode.style.position = '';
                        drawer.style.left = -width + 'px';
                        menuDisplayed = false;
                        attachTouchEvents(true);
                    }
                };

                currentPosition = Math.floor(Yuko.utility.getComputedSizeInPx(drawer, 'left')) + width;
                startProgress = Math.floor(keyPositionFrames[currentPosition]);

                if (boolean) {
                    attachTouchEvents(false);
                    win.requestAnimationFrame(showProcess);
                } else {
                    attachTouchEvents(false);
                    win.requestAnimationFrame(hideProcess);
                }
            };

            return {
                show: function () {
                    showMenu(true);
                },
                close: function () {
                    showMenu(false);
                }
            };
        }

        /**
         * Make the provided block element to be a page container
         * @param {Element} container The container for main content
         * @param {{allowSwipe : (Boolean|undefined), timeSpan : (number|undefined), animationType : (string|undefined), swipeScale : (number|undefined)}=} option 
         *          allowSwipe=: Is the container allowed swipe to switch the display content.
         *          timeSpan=: Time span of animation in milliseconds. Default: 300.
         *          animationType=: The functional relationship between time and position. optional:'none','linear','quadratic' .
         *          swipeScale=: Switch limtation position
         * @param {Function} onPageContainerReady A callback when the page container is in ready state
         * @param {Boolean} onAnimationComplete A judgement of whether the animation is completed or not
         */
        function pageContainer(container, option, onPageContainerReady, onAnimationComplete) {
            container.classList.add('yuko-page-container');
            var width = win.document.body.offsetWidth;
            container.style.width = width + 'px';
            var allowSwipe = option.allowSwipe ? true : false;
            var timeSpan = option.timeSpan ? option.timeSpan : 300;
            var animationType = option.animationType ? option.animationType : 'linear';
            var swipeScale = option.swipeScale ? option.swipeScale : 0.5;

            var pageList = [];
            for (var i = 0; i < container.children.length; i++) {
                if (container.children[i].getAttribute('data-role') == 'yuko-page') {
                    pageList.push(container.children[i]);
                }
            }

            var currentPage = 0;
            var currentLeft = 0;
            var lastLeft = currentLeft;
            var pageCount = pageList.length;
            var isAnimating = false;

            // Position of each page
            var page;
            for (var i = 0; i < pageCount; i++) {
                page = pageList[i];
                page.classList.add('yuko-page');
                page.style.left = page.getAttribute('data-page-id') * width + 'px';
            }

            var curriedTimeFunction = (function () {
                switch (animationType) {
                    case 'linear':
                        var a = 2 * width / (timeSpan * timeSpan);
                        var b = 2 * width / timeSpan;
                        return function (progress) {
                            return progress < 0.5 * timeSpan ? a * progress * progress : b * progress - a * progress * progress;
                        };
                        break;
                    case 'quadratic':
                        var a = -2 * width / (timeSpan * timeSpan * timeSpan);
                        var b = 3 * width / (timeSpan * timeSpan);
                        return function (progress) {
                            return Yuko.utility.calcCubicEquation(a, b, 0, 0, progress);
                        };
                        break;
                    default:
                        break;
                }
            })();

            // Save position for each progress
            var keyTimeFrames = [];
            for (var i = 0; i <= timeSpan; i++) {
                keyTimeFrames.push(Yuko.utility.roundTo(curriedTimeFunction(i), 0));
            }

            // Save progress for each position
            var keyPositionFrames = [];
            for (var i = 0, counter = 0; i <= width; i++) {
                keyPositionFrames.push(Yuko.utility.firstGreaterThan(keyTimeFrames, i - 1));
            }

            var touchStartPointValid = false;
            var startPoint;
            var currentPoint;
            var endPoint;
            var distance;

            // Touch event
            var onPageContainerTouchStart = function (e) {
                if (e.changedTouches[0].clientX > 16 && e.changedTouches[0].clientX < width - 16) {
                    touchStartPointValid = true;
                    startPoint = e.changedTouches[0];
                    lastLeft = currentLeft;
                } else {
                    touchStartPointValid = false;
                    startPoint = null;
                }
            };

            var onPageContainerTouchMove = function (e) {
                if (touchStartPointValid) {
                    currentPoint = e.changedTouches[0];
                    distance = currentPoint.clientX - startPoint.clientX;
                    if ((currentPage != 0 && distance > 0) || (currentPage != pageCount - 1 && distance < 0)) {
                        for (var i = 0; i < pageCount; i++) {
                            pageList[i].style.left = lastLeft + width * i + 'px';
                        }
                    } else {
                    }
                }
            };

            var onPageContainerTouchEnd = function (e) {
                if (touchStartPointValid) {
                    endPoint = e.changedTouches[0];
                    if (distance == 0) {
                        return;
                    }
                    var scale = distance / width;
                    var indexChange = 0;
                    if ((scale < -swipeScale) || (scale > 0 && scale < swipeScale)) {
                        var currentPosition = (distance > 0 ? 0 : width) + Math.floor(distance);
                        var currentProgress = keyPositionFrames[currentPosition];
                        var keyFrames = [];
                        if (distance > 0) {
                            indexChange = 0;
                            for (var i = currentProgress; i >= 0; i--) {
                                keyFrames.push(currentLeft + keyTimeFrames[i]);
                            }
                            for (var i = 0; i < 16; i++) {
                                keyFrames.push(currentLeft);
                            }
                        } else {
                            for (var i = currentProgress; i >= 0; i--) {
                                keyFrames.push(currentLeft + keyTimeFrames[i] - width);
                            }
                            for (var i = 0; i < 16; i++) {
                                keyFrames.push(currentLeft - width);
                            }
                            indexChange = 1;
                        }
                        slide(keyFrames, currentProgress, indexChange);
                    } else {
                        var currentPosition = (distance > 0 ? 0 : width) + Math.floor(distance);
                        var currentProgress = keyPositionFrames[currentPosition];
                        var keyFrames = [];
                        if (distance > 0) {
                            for (var i = currentProgress; i <= timeSpan; i++) {
                                keyFrames.push(currentLeft + keyTimeFrames[i]);
                            }
                            for (var i = 0; i < 16; i++) {
                                keyFrames.push(currentLeft + width);
                            }
                            indexChange = -1;
                        } else {
                            for (var i = currentProgress; i <= timeSpan; i++) {
                                keyFrames.push(currentLeft + keyTimeFrames[i] - width);
                            }
                            for (var i = 0; i < 16; i++) {
                                keyFrames.push(currentLeft);
                            }
                            indexChange = 0;
                        }
                        slide(keyFrames, timeSpan - currentProgress + 1, indexChange);
                    }
                }
            };

            var attachSwipeEvent = function (boolean) {
                if (boolean) {
                    container.addEventListener('touchstart', onPageContainerTouchStart);
                    container.addEventListener('touchmove', onPageContainerTouchMove);
                    container.addEventListener('touchend', onPageContainerTouchEnd);
                } else {
                    container.removeEventListener('touchstart', onPageContainerTouchStart);
                    container.removeEventListener('touchmove', onPageContainerTouchMove);
                    container.removeEventListener('touchend', onPageContainerTouchEnd);
                }
            }
            if (allowSwipe) {
                attachSwipeEvent(true)
            }


            var slide = function (keyFrames, progressCount, indexChange) {
                if (isAnimating) {
                    return;
                }
                var start = null;
                var positionIndex = 0;

                // Detach slide event here
                if (allowSwipe) {
                    attachSwipeEvent(false);
                }

                isAnimating = true;

                var slideProcess = function (timestamp) {
                    if (!start) {
                        start = timestamp;
                    }
                    positionIndex = Math.floor(timestamp - start);
                    for (var i = 0; i < pageCount; i++) {
                        pageList[i].style.left = keyFrames[positionIndex] + width * i + 'px';
                    }
                    if (positionIndex < progressCount) {
                        win.requestAnimationFrame(slideProcess);
                    } else {
                        for (var i = 0; i < pageCount; i++) {
                            pageList[i].style.left = keyFrames[progressCount + 1] + width * i + 'px';
                        }
                        currentLeft = keyFrames[progressCount + 1];
                        currentPage += indexChange;
                        container.setAttribute('data-page-index', currentPage);
                        isAnimating = false;
                        if (allowSwipe) {
                            attachSwipeEvent(true);
                        }
                        // if (onAnimationComplete) {
                        //     onAnimationComplete(currentPage);
                        // }
                    }
                };

                win.requestAnimationFrame(slideProcess);
            };

            /**
             * Slide to a specific page
             * @param {string|number} page The page to slide to
             *          'next': Slide to the next page (if it exists)
             *          'previous': Slide to the previous page (if it exists)
             *          number: Slide to the numberth page (start at 0)
             */
            var slideTo = function (page) {
                var keyFrames = [];
                var progressCount = 0;
                if (page == 'next') {
                    if (currentPage == 0) {
                        return;
                    }
                    keyFrames = [];
                    for (var i = 0; i < keyTimeFrames.length; i++) {
                        keyFrames.push(keyTimeFrames[i] + currentLeft);
                    }
                    progressCount = timeSpan;
                    slide(keyFrames, progressCount, 1);
                } else if (page == 'previous') {
                    if (currentPage == pageCount - 1) {
                        return;
                    }
                    keyFrames = [];
                    for (var i = 0; i < keyTimeFrames.length; i++) {
                        keyFrames.push(currentLeft - keyTimeFrames[i])
                    }
                    progressCount = timeSpan;
                    slide(keyFrames, progressCount, -1);
                } else {
                    var index;
                    // Return if paramater is not a valid value
                    if (isNaN(index = parseInt(page)) || index < 0 || index > pageCount - 1) {
                        return;
                    }

                    var indexChange = index - currentPage;
                    keyFrames = [];
                    for (var i = 0; i < keyTimeFrames.length; i++) {
                        keyFrames.push(currentLeft - keyTimeFrames[i] * indexChange);
                    }
                    for (var i = 0; i < 16; i++) {
                        keyFrames.push(currentLeft - width * indexChange);
                    }
                    progressCount = timeSpan;
                    slide(keyFrames, progressCount, indexChange);
                }

                return currentPage;
            };

            onPageContainerReady();

            return {
                currentPage: function () {
                    return currentPage;
                },
                slideTo: slideTo
            }
        };

        /**
         * Make a list's items to be Carousel items
         * @param {NodeList|HTMLCollection} carouselList Carousel items' collection
         * @param {Element} preButton A button to switch to Carousel's previous display order
         * @param {Element} nextButton A button to switch to Carousel's next display order
         * @param {{positions : ([number]|undefined), duration : number}=} options Parameters to initial Carousel
         *          positions=: The position list of carousel items.
         *                      If the number of carousel items are a even number, there should be four Array items in positions,
         *                          for example --- [['100%', '100%', '0', '0'], 
         *                                          ['80%', '80%', '10%', '-12.5%'], 
         *                                          ['60%', '60%', '20%', '20%'], 
         *                                          ['80%', '80%', '10%', '32.5%']] --- 
         *                      If the number of carousel items are a even number, there should be five Array items in positions,
         *                          for example --- [['100%', '100%', '0', '0'], 
         *                                          ['80%', '80%', '10%', '-12.5%'], 
         *                                          ['60%', '60%', '20%', '12.5%'],
         *                                          ['60%', '60%', '20%', '32.5%'], 
         *                                          ['80%', '80%', '10%', '32.5%']] --- 
         *          duration=: Animation excution time in second.
         * @return Return null if carouselList is undefined or carouselList's length is less than 2
         */
        function carousel(carouselList, preButton, nextButton, options) {

            if (!carouselList || carouselList.length < 2) return;

            var len = carouselList.length, duration = options.duration || .3;
            var nextItemList = [], positionValues = [];
            // Item position span
            var positionProgress = [];
            var prePositionSpan = null, nextPositionSpan = null, positionProgressCopy = null, tempPositionSpan = null;
            for (var i = 0; i < carouselList.length; i++) {
                positionProgress.push([]);
            }
            // Position data in number
            var position = {
                evenNumberItem: [
                    ['100%', '100%', '0', '0'],
                    ['80%', '80%', '10%', '-12.5%'],
                    ['60%', '60%', '20%', '20%'],
                    ['80%', '80%', '10%', '32.5%']
                ],
                oddNumberItem: [
                    ['100%', '100%', '0', '0'],
                    ['80%', '80%', '10%', '-12.5%'],
                    ['60%', '60%', '20%', '12.5%'],
                    ['60%', '60%', '20%', '32.5%'],
                    ['80%', '80%', '10%', '32.5%']
                ]
            }
            /**
             * Validation of options
             * @param {*} options
             * @returns Return true only if options is a instance of Object
             *          and options.positions is formatted in [..[]]
             *          and options.durantion is a number
             */
            var optionsValidation = function (options) {
                if (!(options instanceof Object) || !(options.positions instanceof Array) || !(typeof (options.duration) === 'number')) return false;
                if (options.positions && options.positions instanceof Array) {
                    for (var i = 0; i < options.positions.length; i++)
                        if (!(options.positions[i] instanceof Array)) return false;
                }
                if (carousel.length % 2 === 0) {
                    if (options.positions.length !== 4) return false;
                }
                else {
                    if (options.positions.length !== 5) return false;
                }
                return true;
            }
            if (optionsValidation(options)) {
                if (options.positions.length % 2 === 0)
                    position.evenNumberItem = options.positions;
                else
                    position.oddNumberItem = options.positions;
                duration = options.duration;
            } else {
                console.log('Invalid parameter {options}');
            }

            window.requestAnimFrame = (function () {
                return window.requestAnimationFrame ||
                    window.webkitRequestAnimationFrame ||
                    window.mozRequestAnimationFrame ||
                    window.oRequestAnimationFrame ||
                    window.msRequestAnimationFrame ||
                    function (callback) {
                        window.setTimeout(callback, 1000 / 60);
                    };
            })();
            // Position data in number
            // If the browser has not support CSS3 transition property
            if (!Yuko.utility.isBrowserSupportProp('transition')) {
                for (var attr in position) {
                    for (var i = 0; i < position[attr].length; i++) {
                        for (var j = 0; j < position[attr][i].length; j++) {
                            (parseInt(position[attr][i][j]) == 0 || position[attr][i][j] == '0%') ? position[attr][i][j] = 0 : position[attr][i][j] = parseFloat(position[attr][i][j].substring(0, position[attr][i][j].length - 1));
                        }
                    }
                }
            }

            var cssTransitionPolyfill = function (carouselList, option, duration, event) {
                // console.log(position);
                // Make a copy for position data
                var positionCopy = Yuko.utility.cloneObject(position);

                var refreshTime = duration * 60;
                var pos = null, posCopy = null, posCopyTemp = null, dataZero = null;
                var next = 0;
                /**
                 * Load data for every progress
                 * @param {number} count position object's length
                 */
                var fillPositionData = function (count) {
                    for (var j = 0; j < count; j++) {
                        j < count - 1 ? next = j + 1 : next = 0;

                        if (count % 2 !== 0) {
                            if (count === 3) {
                                pos = [
                                    position.oddNumberItem[0],
                                    position.oddNumberItem[1],
                                    position.oddNumberItem[5]
                                ];
                                if (posCopy === null) {
                                    posCopy = [
                                        positionCopy.oddNumberItem[0],
                                        positionCopy.oddNumberItem[1],
                                        positionCopy.oddNumberItem[5]
                                    ];
                                }
                            }
                            if (count === 5) {
                                pos = position.oddNumberItem;
                                if (posCopy === null) {
                                    posCopy = positionCopy.oddNumberItem;
                                }
                            }
                            if (count > 5) {
                                var overflowItem = [];
                                for (var i = 0; i < count - 5; i++) {
                                    overflowItem.push([40, 40, 30, 30]);
                                }
                                pos = [].concat(position.oddNumberItem.slice(0, 3), overflowItem, position.oddNumberItem.slice(-2));
                                if (posCopy === null) {
                                    posCopy = [].concat(positionCopy.oddNumberItem.slice(0, 3), overflowItem, positionCopy.oddNumberItem.slice(-2));
                                }
                            }
                        } else {
                            if (count === 2) {
                                pos = [
                                    position.evenNumberItem[0],
                                    position.evenNumberItem[3]
                                ];
                                if (posCopy === null) {
                                    posCopy = [
                                        positionCopy.evenNumberItem[0],
                                        positionCopy.evenNumberItem[3]
                                    ];
                                }
                            }
                            if (count === 4) {
                                pos = position.evenNumberItem;
                                if (posCopy === null) {
                                    posCopy = positionCopy.evenNumberItem;
                                }
                            }
                            if (count > 4) {
                                var overflowItem = [];
                                for (var i = 0; i < count - 4; i++) {
                                    overflowItem.push([60, 60, 20, 20]);
                                }
                                pos = [].concat(position.evenNumberItem.slice(0, 3), overflowItem, position.evenNumberItem.slice(-1));
                                if (posCopy === null) {
                                    posCopy = [].concat(positionCopy.evenNumberItem.slice(0, 3), overflowItem, positionCopy.evenNumberItem.slice(-1));
                                }
                            }
                        }

                        // posCopyTemp = Yuko.utility.cloneObject(pos);
                        // posCopy = positionCopy.oddNumberItem;

                        for (var k = 0; k < 4; k++) {
                            // ERROR In IE9, there is a unexpected action with pos
                            posCopy[j][k] += ((pos[next][k] - pos[j][k]) / refreshTime);
                        }
                        var data = [];
                        for (var m = 0; m < 4; m++) {
                            data.push(posCopy[j][m].toLocaleString() === '-0' ? '0' : posCopy[j][m].toLocaleString() + '%');
                        }
                        dataZero = [].concat(pos);
                        positionProgress[j].push(data);
                    }
                }

                for (var i = 0; i < refreshTime; i++) {
                    fillPositionData(carouselList.length);
                }
                for (var p = 0; p < dataZero.length; p++) {
                    for (var q = 0; q < 4; q++) {
                        if (!(dataZero[p][q] + '').endsWith('%'))
                            dataZero[p][q] += '%';
                    }
                }
                // console.log([].concat(positionProgressOdd.slice(-1), positionProgressOdd.slice(0, positionProgressOdd.length - 1)));
                // console.log(positionProgressEven);
                if (prePositionSpan === null) {
                    prePositionSpan = [].concat(positionProgress.slice(-1), positionProgress.slice(0, positionProgress.length - 1));
                    prePositionSpan.push(-1);
                }
                if (positionProgressCopy === null) positionProgressCopy = [].concat(positionProgress);
                if (tempPositionSpan === null) {
                    tempPositionSpan = [];
                    for (var i = 0; i < positionProgress.length; i++) {
                        positionProgressCopy[i].unshift(dataZero[i]);
                        tempPositionSpan.push([].concat(positionProgressCopy[i]).reverse());
                    }
                }
                if (nextPositionSpan === null) {
                    nextPositionSpan = tempPositionSpan;
                    nextPositionSpan.push(1);
                }
                return event.target === preButton ? prePositionSpan : nextPositionSpan;
            }

            if (!carouselList || len < 2) return;

            // Attach click event to button
            var sortedPositionValues = null;
            Yuko.utility.addEvent(nextButton, 'click', function (event) {
                if (sortedPositionValues === null || sortedPositionValues[sortedPositionValues.length - 1] !== 1)
                    sortedPositionValues = cssTransitionPolyfill(carouselList, {}, duration, event);
                changeCoordinate(event, duration);
            });
            Yuko.utility.addEvent(preButton, 'click', function (event) {
                if (sortedPositionValues === null || sortedPositionValues[sortedPositionValues.length - 1] !== -1)
                    sortedPositionValues = cssTransitionPolyfill(carouselList, {}, duration, event);
                changeCoordinate(event, duration);
            });

            /**
             * Change Coordination of carousel list item
             * @param {Event} event The DOM Event which was triggered
             */
            var changeCoordinate = function (event, duration) {

                var visualPageIndex = window.parseInt(document.querySelector('#yuko-carousel-list > ul').getAttribute('data-page-index'));
                // Reset visualPageIndex where it is overflow(more than carouselList.length or less than 0)
                if (event.target === nextButton) {
                    visualPageIndex++;
                    if (visualPageIndex === len) {
                        visualPageIndex = 0;
                    }
                }
                if (event.target === preButton) {
                    visualPageIndex--;
                    if (visualPageIndex === -1) {
                        visualPageIndex = len - 1;
                    }
                }
                // The next display order list
                nextItemList = [];
                for (var i = visualPageIndex; i < len; i++) {
                    nextItemList.push(carouselList[i]);
                }
                for (var i = 0; i < visualPageIndex; i++) {
                    nextItemList.push(carouselList[i]);
                }

                // console.log(nextItemList);

                if (len % 2 !== 0) {
                    if (len === 3) {
                        positionValues = [
                            position.oddNumberItem[0],
                            position.oddNumberItem[1],
                            position.oddNumberItem[5]
                        ];
                    }
                    if (len === 5) {
                        positionValues = position.oddNumberItem;
                    }
                    if (len > 5) {
                        var overflowItem = [];
                        for (var i = 0; i < len - 5; i++) {
                            overflowItem.push(['40%', '40%', '30%', '30%']);
                        }
                        positionValues = [].concat(position.oddNumberItem.slice(0, 3), overflowItem, position.oddNumberItem.slice(-2));
                    }
                } else {
                    if (len === 2) {
                        positionValues = [
                            position.evenNumberItem[0],
                            position.evenNumberItem[3]
                        ];
                    }
                    if (len === 4) {
                        positionValues = position.evenNumberItem;
                    }
                    if (len > 4) {
                        var overflowItem = [];
                        for (var i = 0; i < len - 4; i++) {
                            overflowItem.push(['60%', '60%', '20%', '20%']);
                        }
                        positionValues = [].concat(position.evenNumberItem.slice(0, 3), overflowItem, position.evenNumberItem.slice(-1));
                    }
                }
                nextItemList[len - 2].style.zIndex = (20 - len) + '';
                nextItemList[len - 1].style.zIndex = (21 - len) + '';

                var refreshTime = duration * 60;

                /*
                function animate(i, f) {
                    function load(flag) {
                        window.requestAnimFrame(function () {
                            return (function () {
                                console.log('flag = ' + flag + '   i = ' + i);
                                console.log(sortedPositionValues[i][flag]);
                                Yuko.utility.setBoundingRectangle(nextItemList[i], sortedPositionValues[i][flag]);
                            })();
                        });
                    };

                    for (var flag = 0; flag < f; flag++) {
                        load(flag);
                    }
                };
                */

                // console.log('len = ' + len);
                for (var i = 0; i < len; i++) {
                    if (i < len - 2) {
                        nextItemList[i].style.zIndex = (19 - i) + '';
                    }
                    if (Yuko.utility.isBrowserSupportProp('transition')) {
                        // console.log(positionValues[i]);
                        Yuko.utility.setBoundingRectangle(nextItemList[i], positionValues[i]);
                    }
                    else {
                        //CSS transition is not support
                        (function (i) {
                            var flag = 0;
                            var animate = function () {
                                if (flag < refreshTime) {
                                    flag++;
                                    // console.log(flag);
                                    // console.log(sortedPositionValues[i][flag]);
                                    Yuko.utility.setBoundingRectangle(nextItemList[i], sortedPositionValues[i][flag]);
                                    window.requestAnimFrame(animate);
                                }
                            }
                            window.requestAnimFrame(animate);
                        })(i);
                        // animate(i, refreshTime);
                    }
                }

                document.querySelector('#yuko-carousel-list > ul').setAttribute('data-page-index', visualPageIndex + '');
            }

            // cssTransitionPolyfill(position.oddNumberItem, {}, .1);
        }

        /**
         * Make a list's items to be Carousel items
         * @param {NodeList|HTMLCollection} carouselList Carousel items' collection
         * @param {string} type Type of carousel
         * @param {{size : ([number,number]), isResizable, hasButton : (Boolean), hasBottomBar : (Boolean), duration : (number)}=} options Parameters to initial Carousel
         *          size=: Size(width,height) of carousel.
         *          isResizable=: If allow resize.
         *          isAuto=: If allow auto play.
         *          hasButton=: If there should be previous/next button.
         *          hasBottomBar=: If there should be a bottom navigation bar.
         *          duration=: Duration to switch carousel item.
         * @return Return null if carouselList is undefined or carouselList's length is less than 2
         */// TODO: Add isAuto; Using Yuko.util.animate rather than CSS3 transition.
        function carouselV2(carouselList, type, options) {
            if (!carouselList || carouselList.length < 2) return;
            // Public parameter
            var len = carouselList.length,
                docWidth = document.documentElement.clientWidth,
                docHeight = document.documentElement.clientHeight,
                carouselContainer = document.querySelector('.yuko-carousel-v2-container'),
                carousel = document.querySelector('.yuko-carousel-v2'),
                width = carouselContainer.offsetWidth, height = carouselContainer.offsetHeight,
                duration, iconList, preButton, nextButton, isResizable = false, isAuto;

            if (options) {
                if (options.duration) duration = options.duration;
                if (options.hasBottomBar) {
                    iconList = document.querySelectorAll('.yuko-carousel-v2-bar > li');
                    iconList[0].parentNode.style.display = 'block';
                };
                if (options.hasButton) {
                    preButton = document.querySelector('.yuko-carousel-v2-pre');
                    nextButton = document.querySelector('.yuko-carousel-v2-next');
                    preButton.style.display = 'block';
                    nextButton.style.display = 'block';
                }
                if (options.isResizable) isResizable = true;
                if (options.size) {
                    width = options.size[0] > docWidth ? docWidth : options.size[0];
                    height = options.size[0] > docWidth ? docWidth * options.size[1] / options.size[0] : options.size[1];
                }
            }

            // Reset carousel style
            carouselContainer.style.width = width + 'px';
            carouselContainer.style.height = height + 'px';
            carousel.style.width = width * carouselList.length + 'px';
            for (var i = 0; i < carouselList.length; i++) {
                carouselList[i].style.width = width + 'px';
                carouselList[i].style.height = height + 'px';
            }
            if (isResizable) {
                // Resizable
                // Add resize event
                yuko.utility.addEvent(window, 'resize', function (event) {
                    var resetWidth = document.documentElement.clientWidth * width / docWidth,
                        resetHeight = resetWidth * height / width;
                    carouselContainer.style.width = resetWidth + 'px';
                    carouselContainer.style.height = resetHeight + 'px';
                    carousel.style.width = resetWidth * carouselList.length + 'px';
                    for (var i = carouselList.length - 1; i >= 0; i--) {
                        carouselList[i].style.width = resetWidth + 'px';
                        carouselList[i].style.height = resetHeight + 'px';
                    }
                });
            }

            //Change carousel item by icon in bottom
            var changeLocation = function (index, marginLeft) {
                yuko.utility.addEvent(iconList[index], 'mouseover', function () {
                    carousel.style.marginLeft = marginLeft;
                    for (var i = carouselList.length - 1; i >= 0; i--) {
                        iconList[i].classList.remove('on');
                    };
                    iconList[index].classList.add('on');
                });
            }

            // Listener
            var buttonClickListener = function (event) {
                var curMargin = parseFloat(carousel.style.marginLeft);
                var curIndex = Math.abs(curMargin / 100);
                var nextIndex;
                if (event.target === preButton) {
                    nextIndex = curIndex !== 0 ? curIndex - 1 : carouselList.length - 1;
                }
                if (event.target === nextButton) {
                    nextIndex = curIndex !== carouselList.length - 1 ? curIndex + 1 : 0;
                }
                carousel.style.marginLeft = -nextIndex * 100 + '%';
                iconList[curIndex].classList.remove('on');
                iconList[nextIndex].classList.add('on');
            }
            if (options.hasButton) {
                Yuko.utility.addEvent(preButton, 'click', buttonClickListener);
                Yuko.utility.addEvent(nextButton, 'click', buttonClickListener);
            }

            // Carousel type - 'default'
            var defaultType = function () {
                // Initial list style
                carousel.style.marginLeft = '0%';
                for (var i = carouselList.length - 1; i >= 0; i--) {
                    carouselList[i].style.height = (docWidth * height / width).toString() + 'px';
                };

                if (iconList) {
                    for (var j = 0; j < carouselList.length; j++) changeLocation(j, (-j * 100).toString() + '%');
                }

                //Change carousel item auto with 10s deday
                setInterval(function () {
                    var curMargin = parseFloat(carousel.style.marginLeft);
                    var curIndex = Math.abs(curMargin / 100);

                    var ChangeSliderAuto = function () {
                        carousel.style.marginLeft = (-(curIndex + 1) * 100).toString() + '%';
                        if (iconList) {
                            iconList[curIndex].classList.remove('on');
                            iconList[curIndex + 1].classList.add('on');
                        }
                    }
                    if (curIndex != carouselList.length - 1) {
                        ChangeSliderAuto();
                    }
                    else {
                        carousel.style.marginLeft = '0%';
                        if (iconList) {
                            iconList[iconList.length - 1].classList.remove('on');
                            iconList[0].classList.add('on');
                        }
                    }
                }, 2000);
            }

            var carouselType = {
                'default': defaultType
            }

            switch (type) {
                default:
                    carouselType['default']();
                    break;
            }
        }

        return {
            navigationDrawer: navigationDrawer,
            pageContainer: pageContainer,
            carousel: carousel,
            carouselV2: carouselV2
        };

    })();

    Yuko.init = (function () {
        // Fragment style
        Yuko.style.initFragStyle();
        // Carousel style
        Yuko.style.initCarouselStyle();
        // CarouselV2 style
        Yuko.style.initCarouselV2Style();
        // When a resize event happen
        Yuko.utility.addEvent(win, 'resize', function () {
            // Fragment style
            Yuko.style.initFragStyle();
            // Carousel style
            Yuko.style.initCarouselStyle();
            // CarouselV2 style
            Yuko.style.initCarouselV2Style();
        });
    })();

})(window);