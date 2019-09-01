/**
 * @author NHN Ent. FE Development Team <dl_javascript@nhnent.com>
 * @fileoverview mixin
 */
'use strict';

(function(tui) {
    /**
     * This provides methods used for event handling. It's not meant to
     * be used directly.
     * @mixin
     */
    tui.Eventful = {
        /**
         * Register a handler function to be called whenever this event is fired.
         * @param {string} eventName - Name of the event.
         * @param {function(Object)} handler - The handler to call.
         */
        on: function(eventName, handler) {
            // code...
        },

        /**
         * Fire an event, causing all handlers for that event name to run.
         * @param {string} eventName - Name of the event.
         * @param {Object} eventData - The data provided to each handler.
         */
        fire: function(eventName, eventData) {
            // code...
        }
    };

    /**
     * @constructor FormButton
     * @mixes tui.Eventful
     */
    var FormButton = function() {
        // code...
    };
    FormButton.prototype.press = function() {
        this.fire('press', {});
    };

    mix(Eventful).into(FormButton.prototype);

})(window.tui = window.tui || {});
