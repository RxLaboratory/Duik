(function() {

    var aeUI = {};

    aeUI.bgColors = {
        DARKEST: [.11328125, .11328125, .11328125, 1],
        DARK: [.1953125, .1953125, .1953125, 1],
        LIGHT: [.96875, .96875, .96875, 1]
    };

    aeUI.textColors = {
        DARK: [1,1,1,1],
        DARK_REDUCED: [.6953125,.6953125,.6953125,1],
        LIGHT: [0,0,0,1],
        LIGHT_REDUCED: [.42578125, .42578125, .42578125, 1]
    }

    aeUI.brightnessLimits = {
        DARK: .16,
        LIGHT: .5
    };

    /**
     * Checks if the "use reduced contrast" appearance option is enabled.
     * @returns {Boolean}
     */
    aeUI.useReducedContrast = function() {
        if (app.preferences.havePref(
            "Main Pref Section v2",
            "Use Reduced Contrast",
            PREFType.PREF_Type_MACHINE_INDEPENDENT
        )) {
            return app.preferences.getPrefAsBool(
                "Main Pref Section v2",
                "Use Reduced Contrast",
                PREFType.PREF_Type_MACHINE_INDEPENDENT
                );
            }

        return false;
    }

    /**
     * Gets the current Brightness appearance option.
     * @returns {Number} A value in [0.0 ... 1.0].  
     * In 24.4.0:
     * - Darkest is `<= 0.16`. The corresponding backgound color is [.11328125, .11328125, .11328125, 1]
     * - Dark is `> 0.16`. The corresponding backgound color is [.1953125, .1953125, .1953125, 1]
     * - Light is `> 0.5`.  The corresponding backgound color is [.96875, .96875, .96875, 1]
     */
    aeUI.brightness = function() {
        if (app.preferences.havePref(
            "Main Pref Section v2",
            "User Interface Brightness (4) [0.0..1.0]",
            PREFType.PREF_Type_MACHINE_INDEPENDENT
        )) {
            return app.preferences.getPrefAsFloat(
                "Main Pref Section v2",
                "User Interface Brightness (4) [0.0..1.0]",
                PREFType.PREF_Type_MACHINE_INDEPENDENT
                );
        }
        return 0.2;
    }

    aeUI.isDarkest = function() {
        return aeUI.brightness() <= aeUI.brightnessLimits.DARK;
    }

    aeUI.isDark = function() {
        return DuAEUI.brightness() > DuAEUI.brightnessLimits.DARK &&
               DuAEUI.brightness() <= DuAEUI.brightnessLimits.LIGHT;
    }

    aeUI.isLight = function() {
        return aeUI.brightness() > aeUI.brightnessLimits.LIGHT;
    }

    aeUI.bgColor = function() {
        if (aeUI.isDarkest()) return aeUI.bgColors.DARKEST;
        if (aeUI.isDark()) return aeUI.bgColors.DARK;
        if (aeUI.isLight()) return aeUI.bgColors.LIGHT;
    }

    aeUI.textColor = function() {
        // Dark
        if (aeUI.brightness() <= aeUI.brightnessLimits.DARK) {
            if (aeUI.useReducedContrast()) return aeUI.textColors.DARK_REDUCED;
            return aeUI.textColors.DARK;
        }
        // Light
        if (aeUI.useReducedContrast()) return aeUI.textColors.LIGHT_REDUCED;
        return aeUI.textColors.LIGHT;
    }

    alert(aeUI.bgColor());
    alert(aeUI.textColor());

})();