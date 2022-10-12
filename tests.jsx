(function() {

    #include "inc/api_all.jsxinc"



    var win = new Window('palette', '', [0,0,360,86]);
    var stage = win.add( 'statictext', { x:20, y:15, width:320, height:16 }, "Working");

    alert(stage.parent.parent);

})();


