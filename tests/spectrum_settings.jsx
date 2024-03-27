(function() {
    alert(
        app.preferences.getPrefAsString( "Main Pref Section v2", "User Interface Appearance Custom Data", PREFType.PREF_Type_MACHINE_SPECIFIC )
    );
    alert(
        app.preferences.getPrefAsString( "Main Pref Section v2", "User Interface Inverted Text Color", PREFType.PREF_Type_MACHINE_SPECIFIC )
    );
    alert(
        app.preferences.getPrefAsString( "Main Pref Section v2", "User Interface Inverted Text Color (Inactive)", PREFType.PREF_Type_MACHINE_SPECIFIC )
    );
    alert(
        app.preferences.getPrefAsString( "Main Pref Section v2", "User Interface Max Darkness Percent", PREFType.PREF_Type_MACHINE_SPECIFIC )
    );
    alert(
        app.preferences.getPrefAsString( "Main Pref Section v2", "User Interface Max Lightness Percent", PREFType.PREF_Type_MACHINE_SPECIFIC )
    );
})();