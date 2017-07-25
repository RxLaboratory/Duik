/*

SCRIPT NAME
Copyright (c) 2011
DESCRIPTION

*/

//encapsulate the script in a function to avoid global variables
(function (thisObj) {

	#include "libduik.jsxinc"

    //================
    var version = '00';
    //================

    // ================ ADD FUNCTIONS HERE =============
	{
        function linkButtonClicked()
        {
            //get comp
            var comp = app.project.activeItem;
            if (!comp) return;
            if (!(comp instanceof CompItem)) return;

            //get layers
            var layers = comp.selectedLayers;
            if (!layers.length) return;

            var shapes = [];

            for (var i = 0 ; i < layers.length ; i++)
            {
                var layer = layers[i];
                //get path
                var props = layer.selectedProperties;
                //if there are selected properties, find paths amongst them
                if (props.length)
                {
                    while (props.length)
                    {
                        var prop = props.pop();
                        //if it's a path
                        if (prop.matchName == "ADBE Mask Shape" || prop.matchName == "ADBE Vector Shape")
                        {
                            shapes.push(prop);
                            //skip the next one
                            props.pop();
                        }
                        //if it's a mask
                        else if (prop.matchName == "ADBE Mask Atom")
                        {
                            shapes.push(prop.property("ADBE Mask Shape"));
                        }
                        //if it's a shape
                        else if (prop.matchName == "ADBE Vector Shape - Group")
                        {
                            shapes.push(prop.property("ADBE Vector Shape"));
                            //skip the next one
                            props.pop();
                        }
                    }
                } //else, search for masks or shapes
                else
                {

                }
            } // for layers

            if (!shapes.length) return;

            //build
            for (var i = 0; i< shapes.length ; i++)
            {
                var shape = shapes[i];
                var path = shape.value;
                var layer = Duik.utils.getPropertyLayer(shape);
                //vertices
                for (var v = 0 ; v < path.vertices.length ; v++)
                {
                    //add null
                    var nullLayer = app.project.activeItem.layers.addNull();
                    nullLayer.name = "L_" + layer.name + " - " + shape.parentProperty.name + " " + v;
                    nullLayer.source.width = 20;
                    nullLayer.source.height = 20;
                    nullLayer.transform.anchorPoint.setValue([nullLayer.source.width/2,nullLayer.source.height/2]);
                    var shapeLink = Duik.utils.getExpressionLink(shape,true);

                    if (!(layer instanceof ShapeLayer))
					{
						nullLayer.position.expression = "thisComp.layer(\"" + layer.name + "\").toWorld(" + shapeLink + ".points()[" + v + "])";
					}
					else
					{
                        //TODO Test shape layer
						nullLayer.position.setValue(position.value);
					}
                }
                //TODO Tangents
            }

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
        var linkButton = mainPalette.add('button',undefined,'Link to path');
        linkButton.onClick = linkButtonClicked;
        var tangentButton = mainPalette.add('checkbox',undefined,'Tangents');

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
