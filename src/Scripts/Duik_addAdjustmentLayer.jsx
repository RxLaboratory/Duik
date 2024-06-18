(function(){
    #include "Duik_api.jsxinc"

    // The script name must be "Duik" to get the default Duik settings
    // %version% is replaced by our build script
    DuAEF.init( "Duik", "%version%", "RxLaboratory" );
    DuAEF.enterRunTime();

    DuAE.beginUndoGroup( i18n._("Adjustment layer") );

    // Creates a new "Adjustment Shape Layer" in the comp. 
    // See: http://duik.rxlab.io/DuAEComp.html#.addSolid
    DuAEComp.addAdjustmentLayer();

    DuAE.endUndoGroup();
})();