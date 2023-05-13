(function() {

    
    #include "OpenAnimation/oa.jsxinc"
    #include "OpenAnimation/oa_ae.jsxinc"

    app.beginUndoGroup("OA Test");

    var p = app.project.activeItem.layer(1).transform.scale;

    var group = OAProperty.fromAEProperty(p);
    //alert(group.toJson());

    //group.toFile('X:/test.oa.json');
    
    var p2 = app.project.activeItem.layer(2).transform.scale; 
    group.toAEProperty(p2);

    app.endUndoGroup();

})();