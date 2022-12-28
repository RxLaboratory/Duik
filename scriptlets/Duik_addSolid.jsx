(function(){
    #include "Duik_api.jsxinc"
    DuAEF.init( "Add Solid", "1.0.0", "RxLaboratory" );
    DuAEF.enterRunTime();

    DuAE.beginUndoGroup( i18n._("Solid") );

    // Creates a new "Solid Shape Layer" in the comp. 
    // See: http://duik.rxlab.io/DuAEComp.html#.addSolid
    DuAEComp.addSolid();

    DuAE.endUndoGroup();
})();