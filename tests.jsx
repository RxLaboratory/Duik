(function() {

    #include "inc/api_all.jsxinc"
    DuAEF.init("Duik tests", "RxLaboratory", "0.0.0");

    var limb = "shins";
    var result = OCOBone.getNameSynonyms( limb, true );
    alert( result.score );
})();