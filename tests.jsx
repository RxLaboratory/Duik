(function() {

    #include "inc/api_all.jsxinc"
    DuAEF.init("Duik tests", "RxLaboratory", "0.0.0");

    var b64 = DuFile.toBase64( "D:/RxLab/src/RxOT/After-Effects/Duik/inc/icons/w16/w16_hominoid.png" );
    DuFile.write( "X:/icon.txt", b64 );

    b64 = DuFile.read( "X:/icon.txt" );
    DuFile.fromBase64( b64, "X:/icon.png")

})();


