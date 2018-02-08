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
        function separate()
        {
            var comp = app.project.activeItem;
            if (!comp) return;
            if (!comp instanceof CompItem) return;
            if (!comp.selectedLayers) return;
            var layer = comp.selectedLayers[0];
            if (!layer.selectedProperties) return;
            var prop = layer.selectedProperties.pop();
            app.beginUndoGroup("Separate Dimensions");

            //TODO get animation

            if ( prop.propertyValueType == PropertyValueType.TwoD || prop.propertyValueType == PropertyValueType.TwoD_SPATIAL )
            {
                var x = prop.value[0];
                var y = prop.value[1];
                var xProp = layer.effect.addProperty("ADBE Slider Control");
                xProp.name = "X";
                xProp(1).setValue(x);
                var yProp = layer.effect.addProperty("ADBE Slider Control");
                yProp.name = "Y";
                xProp(1).setValue(y);
                prop.expression = '[effect("X").value,effect("Y").value]';
            }
            if ( prop.propertyValueType == PropertyValueType.ThreeD || prop.propertyValueType == PropertyValueType.ThreeD_SPATIAL )
            {
                var x = prop.value[0];
                var y = prop.value[1];
                var z = prop.value[2];
                var xProp = layer.effect.addProperty("ADBE Slider Control");
                xProp.name = "X";
                xProp(1).setValue(x);
                var yProp = layer.effect.addProperty("ADBE Slider Control");
                yProp.name = "Y";
                yProp(1).setValue(y);
                var zProp = layer.effect.addProperty("ADBE Slider Control");
                zProp.name = "Z";
                zProp(1).setValue(z);

                prop.expression = '[effect("X")(1).value,effect("Y")(1).value,effect("Z")(1).value]';
            }
            app.endUndoGroup();
        }
    }
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
    }
    //__________________________


    // ============ ADD UI CONTENT HERE =================
    {
        var sepButton = mainPalette.add('button',undefined,'Separate');
        sepButton.onClick = separate;
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
