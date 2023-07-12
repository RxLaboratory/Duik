(function() {

    #include "../src/inc/api_all.jsx"

    var props = DuAEComp.getSelectedProps();
    var propList = new DuList(props);
    propList.do(function(p) { alert(p.name);} );

    var props = app.project.activeItem.layer(1).selectedProperties;
    var propList = new DuList(props);
    propList.do(function(p) { alert(p.name);} );

})();
