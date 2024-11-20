(function() {

    #include "../inc/api_all.jsxinc"
    DuAEF.init("Duik tests", "RxLaboratory", "0.0.0");

    var thisFile = new File($.fileName);
    var repoPath = thisFile.parent.parent.absoluteURI;

    app.project.close(CloseOptions.PROMPT_TO_SAVE_CHANGES)
    var comp = app.project.items.addComp("duik_presets", 500, 500, 1, 1/24, 24);
    var f = new Folder(repoPath + "/inc/presets");
    var pfs = f.getFiles("*.ffx");

    for (var i = 0, ni = pfs.length; i < ni; i++)
    {
        var l = comp.layers.addShape();
        DuAELayer.applyPreset(l, pfs[i]);
        l.name = pfs[i].name;
    }

    app.project.save( new File(repoPath + "/inc/presets/all_presets.aet") );

})();


