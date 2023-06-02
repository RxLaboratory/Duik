// First, create an anonymous function.
// This is very important to make sure we don't leak anything
// to the global space and won't break anything by mistake.
(function(){

    // Here we include the Duik API
    #include "DuAEF_Duik_api.jsxinc"

    // Running the init() method of DuAEF is required to setup everything properly.
    DuAEF.init( "Auto-Parent", "1.0.0", "RxLaboratory" );

    // There's no User Interface, which would have to be built here.
    // Let's go right to the execution.

    // This method has to be run once before any other method from the API.
    DuAEF.enterRunTime();

    // Run the Auto-Parent method
    // See: http://duik.rxlab.io/Duik.Constraint.html#.autoParent
    Duik.Constraint.autoParent();

// Close the anonymous function.
})();