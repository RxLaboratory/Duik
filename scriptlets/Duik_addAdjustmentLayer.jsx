(function(){
    #include "DuAEF_Duik_api.jsxinc"
    DuAEF.init( "Add Adjustement Layer", "1.0.0", "RxLaboratory" );
    DuAEF.enterRunTime();

    // Creates a new "Adjustment Shape Layer" in the comp. 
    // See: http://duik.rxlab.io/DuAEComp.html#.addSolid
    DuAEComp.addAdjustmentLayer();
})();