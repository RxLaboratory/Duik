(function() {

    #include "inc/api_all.jsxinc"
    DuAEF.init("Duik tests", "RxLaboratory", "0.0.0");

    var comp = app.project.activeItem;
    var l = comp.layer(6);
    var a = comp.layer(5);
    var b = comp.layer(7);
    alert( DuAELayer.angleFromLayers(l, a, b) );
})();