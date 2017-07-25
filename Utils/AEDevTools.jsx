/*

SCRIPT NAME
Copyright (c) 2011
DESCRIPTION

*/

//encapsulate the script in a function to avoid global variables
(function (thisObj) {

	//#include "libduik.jsxinc"

    //================
    var version = '00';
    //================

    // ================ ADD FUNCTIONS HERE =============
	{
        function matchNameButtonClicked()
        {
            var comp = app.project.activeItem;
            if (!comp) return;
            if (!(comp instanceof CompItem)) return;
            var layers = comp.selectedLayers;
            if(!layers.length) return;
            var layer = layers[0];
            var props = layer.selectedProperties;
            if (!props.length) return;
            var prop = props.pop();
            alert(prop.matchName);
        }

    } //FUNCTIONS

    //==================================================

    // _______ UI SETUP _______
    {
        // if the script is a Panel, (launched from the 'Window' menu), use it,
        // else (launched via 'File/Scripts/Run script...') create a new window
        // store it in the variable mainPalette
        var mainPalette = thisObj instanceof Panel ? thisObj : new Window('palette','myScriptName',undefined, {resizeable:true});

        //stop if there's no window
        if (mainPalette == null) return;

        // set margins and alignment
        mainPalette.alignChildren = ['fill','fill'];
        mainPalette.margins = 5;
        mainPalette.spacing = 2;
        mainPalette.orientation = 'column';
    }
    //__________________________


    // ============ ADD UI CONTENT HERE =================
    {
        var matchNameButton = mainPalette.add('button',undefined,'Prop MatchName');
        matchNameButton.onClick = matchNameButtonClicked;

    }
    // ==================================================

    //__________ SHOW UI ___________
    {
        // Set layout, and resize it on resize of the Panel/Window
        mainPalette.layout.layout(true);
        mainPalette.layout.resize();
        mainPalette.onResizing = mainPalette.onResize = function () {mainPalette.layout.resize();}
        //if the script is not a Panel (launched from 'File/Scripts/Run script...') we need to show it
        if (!(mainPalette instanceof Panel)) mainPalette.show();
    }
    //______________________________

})(this);
