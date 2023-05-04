(function() {

    
    #include "OpenAnimation/oa.jsxinc"
    #include "OpenAnimation/oa_ae.jsxinc"

    app.beginUndoGroup("OA Test");

    var p = app.project.activeItem.layer(1).transform.position;

    var group = OAProperty.fromAEProperty(p);
    //alert(group.toJson());
    
    var p2 = app.project.activeItem.layer(2).transform.position; 
    group.toAEProperty(p2);

    app.endUndoGroup();

})();