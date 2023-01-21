(function(){
    #include "Duik_api.jsxinc"

    // The script name must be "Duik" to get the default Duik settings
    // Inherit the version from the API
    DuAEF.init( "Duik", "{duikVersion}", "RxLaboratory" );
    DuAEF.enterRunTime();

    // Run the Auto-Parent method
    // See: http://duik.rxlab.io/Duik.Constraint.html#.autoParent
    Duik.Constraint.autoParent();
})();