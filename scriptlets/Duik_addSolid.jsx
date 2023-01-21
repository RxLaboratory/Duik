(function(){
    #include "Duik_api.jsxinc"
    
    // The script name must be "Duik" to get the default Duik settings
    // Inherit the version from the API
    DuAEF.init( "Duik", Duik.apiVersion, "RxLaboratory" );
    DuAEF.enterRunTime();

    DuAE.beginUndoGroup( i18n._("Solid") );

    // Creates a new "Solid Shape Layer" in the comp. 
    // See: http://duik.rxlab.io/DuAEComp.html#.addSolid
    DuAEComp.addSolid();

    DuAE.endUndoGroup();
})();