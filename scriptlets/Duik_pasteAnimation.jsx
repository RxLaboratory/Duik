(function(){
    #include "Duik_api.jsxinc";

    // The script name must be "Duik" to get the default Duik settings
    // Inherit the version from the API
    DuAEF.init( "Duik", Duik.apiVersion, "RxLaboratory" );
    DuAEF.enterRunTime();

    Duik.Animation.paste();
})();