(function() {

    #include "inc/api_all.jsxinc"
    DuAEF.init("Duik tests", "RxLaboratory", "0.0.0");

    var doc = OCODoc.fromComp();
    doc.toFile("X:\testChara.oco");

    var doc = OCODoc.fromFile("X:/testChara.oco");
    doc.toComp();


})();


