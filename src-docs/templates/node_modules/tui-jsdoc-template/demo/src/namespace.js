/**
 * @author NHN Ent. FE Development Team <dl_javascript@nhnent.com>
 * @fileoverview Namespace
 */
'use strict';

/**
 * __Using the @namespace tag with an object__
 * My namespace.
 * @namespace
 */
var MyNamespace = {
    /** documented as MyNamespace.foo */
    foo: function() {},
    /** documented as MyNamespace.bar */
    bar: 1
};

/**
 * A function in MyNamespace (MyNamespace.myFunction).
 * @function myFunction
 * @memberof MyNamespace
 */

 /**
  * Typedef on MyNamespace
  * @typedef {object}myTypeDef
  * @prop {string} a - Typedef prop "a"
  * @prop {string} b - Typedef prop "b" 
  * @memberof MyNamespace
  */

/**
 * Tui namespace
 * @namespace tui
 * @example
 * var foo = new tui.component.Foo();
 * var bar = new tui.component.Bar();
 *
 * tui.util.defineNamespace('myNamespace', {});
 * tui.util.extend({}, {a: 'a', b: 'b'});
 *
 * mix(tui.Eventful).into(FormButton.prototype);
 */
(function(tui) {
    /**
     * Tui Component Namespace
     * @namespace
     */
    tui.component = tui.component || {};

    /**
     * @namespace
     * @borrows trstr as trim
     */
    tui.util = {
        trim: trstr
    };
})(window.tui = window.tui || {});
