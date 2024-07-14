(function(){
    #include "Duik_api.jsxinc";

    // The script name must be "Duik" to get the default Duik settings
    // Inherit the version from the API
    DuAEF.init( "Duik", "%version%", "RxLaboratory" );
    DuAEF.enterRunTime();

    Duik.Animation.paste();
})();