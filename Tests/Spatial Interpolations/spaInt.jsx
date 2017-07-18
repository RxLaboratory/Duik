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
        function linear()
        {
            if (!(app.project.activeItem instanceof CompItem)) return;

            app.beginUndoGroup("Linear");

    		for (var i=0;i<app.project.activeItem.selectedLayers.length;i++) {
        		for (var j=0;j<app.project.activeItem.selectedLayers[i].selectedProperties.length;j++) {
            		if (app.project.activeItem.selectedLayers[i].selectedProperties[j].canVaryOverTime) {
                		for (var k=0;k<app.project.activeItem.selectedLayers[i].selectedProperties[j].selectedKeys.length;k++) {
                    		var prop = app.project.activeItem.selectedLayers[i].selectedProperties[j];
                        	if (prop.isSpatial) {
                        		prop.setSpatialContinuousAtKey(prop.selectedKeys[k],false);
                        		prop.setSpatialAutoBezierAtKey(prop.selectedKeys[k],false);
                        		if (prop.propertyValueType == PropertyValueType.ThreeD_SPATIAL)
                        		{
                        		    prop.setSpatialTangentsAtKey(prop.selectedKeys[k],[0,0,0],[0,0,0]);
                        		}
                        		else if (prop.propertyValueType == PropertyValueType.TwoD_SPATIAL)
                        		{
                        		    prop.setSpatialTangentsAtKey(prop.selectedKeys[k],[0,0],[0,0]);
                        		}
                    		}
                		}
            		}
        		}
    		}

            app.endUndoGroup();

        }

        function bezier()
        {
            if (!(app.project.activeItem instanceof CompItem)) return;

            app.beginUndoGroup("Bezier");

    		for (var i=0;i<app.project.activeItem.selectedLayers.length;i++) {
        		for (var j=0;j<app.project.activeItem.selectedLayers[i].selectedProperties.length;j++) {
            		if (app.project.activeItem.selectedLayers[i].selectedProperties[j].canVaryOverTime) {
                		for (var k=0;k<app.project.activeItem.selectedLayers[i].selectedProperties[j].selectedKeys.length;k++) {
                    		var prop = app.project.activeItem.selectedLayers[i].selectedProperties[j];
                    		if (prop.isSpatial)
                    		{
                    		          prop.setSpatialAutoBezierAtKey(prop.selectedKeys[k],true);
                    		}
                		}
            		}
        		}
    		}

            app.endUndoGroup();
        }

        function lienarBezier()
        {
            if (!(app.project.activeItem instanceof CompItem)) return;

            app.beginUndoGroup("Linear / Bezier");

            for (var i=0;i<app.project.activeItem.selectedLayers.length;i++) {
                for (var j=0;j<app.project.activeItem.selectedLayers[i].selectedProperties.length;j++) {
                    if (app.project.activeItem.selectedLayers[i].selectedProperties[j].canVaryOverTime) {
                        for (var k=0;k<app.project.activeItem.selectedLayers[i].selectedProperties[j].selectedKeys.length;k++) {
                            var prop = app.project.activeItem.selectedLayers[i].selectedProperties[j];
                            if (prop.isSpatial) {
                                prop.setSpatialContinuousAtKey(prop.selectedKeys[k],false);
                                prop.setSpatialAutoBezierAtKey(prop.selectedKeys[k],false);
                                var keyIndex = prop.selectedKeys[k];
                                if (prop.propertyValueType == PropertyValueType.ThreeD_SPATIAL)
                                {
                                    if (prop.keyOutSpatialTangent(keyIndex)[0] == 0 && prop.keyOutSpatialTangent(keyIndex)[1] == 0 && prop.keyOutSpatialTangent(keyIndex)[2] == 0)
                                    {
                                        prop.setSpatialAutoBezierAtKey(prop.selectedKeys[k],true);
                                    }
                                    prop.setSpatialTangentsAtKey(keyIndex,[0,0,0],prop.keyOutSpatialTangent(keyIndex));
                                }
                                else if (prop.propertyValueType == PropertyValueType.TwoD_SPATIAL)
                                {
                                    if (prop.keyOutSpatialTangent(keyIndex)[0] == 0 && prop.keyOutSpatialTangent(keyIndex)[1] == 0)
                                    {
                                        prop.setSpatialAutoBezierAtKey(prop.selectedKeys[k],true);
                                    }
                                    prop.setSpatialTangentsAtKey(keyIndex,[0,0],prop.keyOutSpatialTangent(keyIndex));
                                }
                            }
                        }
                    }
                }
            }

            app.endUndoGroup();
        }

        function bezierLinear()
        {
            if (!(app.project.activeItem instanceof CompItem)) return;

            app.beginUndoGroup("Bezier / Linear");

            for (var i=0;i<app.project.activeItem.selectedLayers.length;i++) {
                for (var j=0;j<app.project.activeItem.selectedLayers[i].selectedProperties.length;j++) {
                    if (app.project.activeItem.selectedLayers[i].selectedProperties[j].canVaryOverTime) {
                        for (var k=0;k<app.project.activeItem.selectedLayers[i].selectedProperties[j].selectedKeys.length;k++) {
                            var prop = app.project.activeItem.selectedLayers[i].selectedProperties[j];
                            if (prop.isSpatial) {
                                prop.setSpatialContinuousAtKey(prop.selectedKeys[k],false);
                                prop.setSpatialAutoBezierAtKey(prop.selectedKeys[k],false);
                                var keyIndex = prop.selectedKeys[k];
                                if (prop.propertyValueType == PropertyValueType.ThreeD_SPATIAL)
                                {
                                    if (prop.keyInSpatialTangent(keyIndex)[0] == 0 && prop.keyInSpatialTangent(keyIndex)[1] == 0 && prop.keyInSpatialTangent(keyIndex)[2] == 0)
                                    {
                                        prop.setSpatialAutoBezierAtKey(prop.selectedKeys[k],true);
                                    }
                                    prop.setSpatialTangentsAtKey(keyIndex,prop.keyInSpatialTangent(keyIndex),[0,0,0]);
                                }
                                else if (prop.propertyValueType == PropertyValueType.TwoD_SPATIAL)
                                {
                                    if (prop.keyInSpatialTangent(keyIndex)[0] == 0 && prop.keyInSpatialTangent(keyIndex)[1] == 0)
                                    {
                                        prop.setSpatialAutoBezierAtKey(prop.selectedKeys[k],true);
                                    }
                                    prop.setSpatialTangentsAtKey(keyIndex,prop.keyInSpatialTangent(keyIndex),[0,0]);
                                }
                            }
                        }
                    }
                }
            }
        }

        app.endUndoGroup();
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
        mainPalette.orientation = 'column';
    }
    //__________________________


    // ============ ADD UI CONTENT HERE =================
    {
        mainPalette.add('statictext',undefined,"Spatial Interpolation")
        var line1 = mainPalette.add('group');
        var linButton = line1.add('button',undefined,'Linear');
        linButton.onClick = linear;
        var bezButton = line1.add('button',undefined,'Bezier');
        bezButton.onClick = bezier;

        var line2 = mainPalette.add('group');
        var linBezButton = line2.add('button',undefined,'Lin/Bez');
        linBezButton.onClick = lienarBezier;
        var bezLinButton = line2.add('button',undefined,'Bez/Lin');
        bezLinButton.onClick = bezierLinear;
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
