/**
 * @author NHN Ent. FE Development Team <dl_javascript@nhnent.com>
 * @fileoverview Base class
 */
'use strict';

tui = tui || {};

(function (ns) {
    /**
     * Create Base instance
     * @class tui.component.Base
     * @param {object} data - data
     * @param {object} data.foo - foo
     * @param {string} data.bar - 'bar'
     */
    var Base = function (data) {
        /**
         * Base data
         * @type {object}
         */
        this.data = data || {};
    };

    /**
     * @alias tui.component.Base.staticMethod
     */
    Base.staticMethod = function() {}

    Object.assign(Base.prototype, /** @lends tui.component.Base.prototype */ {

        /**
         * Private method
         * @private
         */
        _privateMethod: function() {
            // ...code
        },

        /**
         * Base log2
         * @param {string} str - string for log
         * @example
         * base.log('hello world'); // "LOG1: hello world"
         */
        log: function(str) {
            console.log('LOG1: ' + str);
        },

        /**
         * Base log2
         * @example
         * base.log2(); // "LOG2"
         */
        log2: function() {
            console.log('LOG2')
        },

        /**
         * Set datum
         * @param {string} id - Id for datum
         * @param {*} datum - Datum
         * @example
         * base.setDatum('a', 'hello world');
         */
        setDatum: function(id, datum) {
            this.data[id] = datum;
        },

        /**
         * Base get
         * @param {string} id - Id for datum
         * @returns {?object} datum
         * @example
         * base.setDatum('a', 'hello world');
         * console.log(base.getDatum('a')); // "hello world";
         */
        getDatum: function(id) {
            return data[id];
        }
    });

    /**
     * BaseChild Class
     * @extends tui.component.Base
     * @class tui.component.BaseChild
     */
    var BaseChild = function() {
        Base.call(this);

        /**
         * BaseChild data
         * @type {{name: string, a: string}}
         */
        this.data = {
            name: 'BaseChild',
            a: 'b'
        };

        /**
         * Private data
         * @type {object}
         * @private
         */
        this._privateData = {}
    };
    BaseChild.prototype = Object.create(Base.prototype);
    Object.assign(BaseChild.prototype, /** @lends tui.component.BaseChild.prototype */ {
        constructor: BaseChild,

        /**
         * BaseChild log2
         * @param {string} str - string for log
         * @example
         * base.log('hello world'); // "BaseChild - LOG1: hello world"
         */
        log: function(str) {
            console.log('BaseChild - LOG1: ' + str);
        },

        /**
         * Returns the sum of a and b
         * @param {Number} a
         * @param {Number} b
         * @param {Boolean} retArr If set to true, the function will return an array
         * @returns {Number|Array} Sum of a and b or an array that contains a, b and the sum of a and b.
         */
        sum: function(a, b, retArr) {
            if (retArr) {
                return [a, b, a + b];
            }
            return a + b;
        }
    });

    /**
     * @event tui.component.BaseChild#foo
     * @example
     * baseChild.on('foo', function() {
     *     console.log('fire "foo"');
     * });
     */

    ns.Base = Base;
    ns.BaseChild = BaseChild;
})(tui.component || (tui.component = {}));


/**
 * @classdesc Toaster singleton.
 * @class
 * @hideconstructor
 */
var Toaster = (function() {
    var instance = null;

    function Toaster() {}

    /**
     * Toast an item.
     *
     * @alias toast
     * @memberof Toaster
     * @instance
     * @param {BreadyThing} item - The item to toast.
     * @return {Toast} A toasted bready thing.
     */
    Toaster.prototype.toast = function(item) {};

    return {
        /**
         * Get the Toaster instance.
         *
         * @alias Toaster.getInstance
         * @returns {Toaster} The Toaster instance.
         */
        getInstance: function() {
            if (instance === null) {
                instance = new Toaster();
                delete instance.constructor;
            }

            return instance;
        }
    };
})();
