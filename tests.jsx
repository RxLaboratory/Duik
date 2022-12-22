(function() {

    #include "inc/api_all.jsxinc"
    DuAEF.init("Duik tests", "RxLaboratory", "0.0.0");

    var comp = app.project.activeItem;
    var b1 = comp.layer(24);
    var ctrl1 = comp.layer(8);
    var b2 = comp.layer(10);
    var ctrl2 = comp.layer(7);

    var ctrls = [ctrl1, ctrl2];

    var t = Duik.Controller.getCreate( b1, Duik.Layer.Type.FOOT, ctrls );
    alert(t.name);
    t = Duik.Controller.getCreate( b2, Duik.Layer.Type.FOOT, ctrls );
    alert(t.name);
})();