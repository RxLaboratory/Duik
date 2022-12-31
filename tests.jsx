(function() {

    #include "inc/api_all.jsxinc"
    DuAEF.init("Duik tests", "RxLaboratory", "0.0.0");

    var comp = DuAEProject.getActiveComp();
    if (!comp) return;

    DuAE.beginUndoGroup("Sanitize names");

    /*
    for (var i = 1, ni = comp.numLayers; i <= ni; i++) {
        Duik.Layer.sanitizeName( comp.layer(i) );
    }
    */

    for (var i = 0, ni = comp.selectedLayers.length; i < ni; i++) {
        Duik.Layer.setGroupName( "TEST", comp.selectedLayers[i]);
    }

     DuAE.endUndoGroup();
})();