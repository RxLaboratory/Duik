(function() {

    #include "inc/api_all.jsxinc"
    DuAEF.init("Duik tests", "RxLaboratory", "0.0.0");

    var comp = DuAEProject.getActiveComp();
    var f = new Folder("D:\\RxLab\\src\\RxOT\\After-Effects\\Duik\\inc\\presets");
    var pfs = f.getFiles("*.ffx");
    alert(pfs);
    for (var i = 0, ni = pfs.length; i < ni; i++)
    {
        var l = comp.layers.addShape();
        DuAELayer.applyPreset(l, pfs[i]);
        l.name = pfs[i].name;
    }

})();


