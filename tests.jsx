(function() {

    
    #include "OpenAnimation/oa.jsxinc"
    #include "OpenAnimation/oa_ae.jsxinc"

    app.beginUndoGroup("OA Test");

    var p = app.project.activeItem.layer(1).transform.rotation;

    var group = OAProperty.fromAEProperty(p);
    group = group.bake();
    //alert(group.toJson());

    //group.toFile('X:/test.oa.json');
    
    var p2 = app.project.activeItem.layer(2).transform.rotation; 
    group.toAEProperty(p2);

    app.endUndoGroup();

})();