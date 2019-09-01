/**
 * @author NHN Ent. FE Development Team <dl_javascript@nhnent.com>
 * @fileoverview Externals & Type definition & borrow
 */

/* Externals */
/**
 * The built in string object.
 * @external String
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String|String}
 */

/**
 * Create a ROT13-encoded version of the string. Added by the `foo` package.
 * @function external:String#rot13
 * @example
 * var greeting = new String('hello world');
 * console.log( greeting.rot13() ); // uryyb jbeyq
 */

/**
 * The jQuery plugin namespace.
 * @external "jQuery.fn"
 * @see {@link http://learn.jquery.com/plugins/|jQuery Plugins}
 */

/**
 * A jQuery plugin to make stars fly around your home page.
 * @function external:"jQuery.fn".starfairy
 */

/* Type Definition */
/**
 * Foo type definitions
 * @typedef {object} Foo
 * @prop {string} a - 'a'
 * @prop {string} b - 'b'
 * @prop {string} c - 'c'
 */

/* Function for borrow (namespace.js)*/
/**
 * Remove whitespace from around a string.
 * @param {string} str
 */
function trstr(str) {}

/**
 * Use the @global tag to specify that a symbol should be documented as global.
 * Document an inner variable as a global
 */
(function() {
    /** @global */
    var foo = 'hello foo';

    this.foo = foo;
}).apply(window);
