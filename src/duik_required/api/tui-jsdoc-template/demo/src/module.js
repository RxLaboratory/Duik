/**
 * @author NHN Ent. FE Development Team <dl_javascript@nhnent.com>
 * @fileoverview Module
 */
'use strict';

/**
 * The following example shows the namepaths that are used for symbols in a module. The first symbol is a module-private, or "inner," variable--it can be only accessed within the module. The second symbol is a static function that is exported by the module.
 * @module myModule
 */

/** will be module:myModule~foo */
var foo = 1;

/** will be module:myModule.bar */
var bar = function() {};

/**
 * In the following example, the Book class is documented as a static member, "module:bookshelf.Book", with one instance member, "module:bookshelf.Book#title".
 * Defining exported symbols as a member of 'this'
 * @module bookshelf
 */
/** @class */
this.Book = function (title) {
    /** The title. */
    this.title = title;
};

/**
 * In the following example, the two functions have the namepaths "module:color/mixer.blend" and "module:color/mixer.darken".
 * Defining exported symbols as a member of 'module.exports' or 'exports'
 * @module color/mixer
 */
module.exports = {
    /** Blend two colours together. */
    blend: function (color1, color2) {}
};
/** Darkens a color. */
exports.darken = function (color, shade) {};
