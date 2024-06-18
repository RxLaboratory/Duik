(function(){
    #include "Duik_api.jsxinc";

    // The script name must be "Duik" to get the default Duik settings
    // Inherit the version from the API
    DuAEF.init( "Duik", "%version%", "RxLaboratory" );
    DuAEF.enterRunTime();

    var comp = DuAEProject.getActiveComp();
    if (!comp) return;
    var layers = comp.selectedLayers;

    DuAE.beginUndoGroup( i18n._("Null") );

    // Creates a new "Null Shape Layer" in the comp. 
    // See: http://duik.rxlab.io/DuAEComp.html#.addNull
    if (layers.length == 0) {
        DuAEComp.addNull();
    }
    else {
        for (var i = 0, ni = layers.length; i < ni; i++) {
            DuAEComp.addNull(undefined, undefined, layers[i]);
        }
    }

    DuAE.endUndoGroup();
})();