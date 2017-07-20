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

        function autoFix()
        {
            var comp = app.project.activeItem;
            if (!comp) return;
            if (!(comp instanceof CompItem)) return;

            var layers = comp.selectedLayers;
            if (!layers.length) return;

            app.beginUndoGroup("Auto-Fix");

            for (var i=0;i<layers.length;i++) {
                var layer = layers[i];
                var props = layer.selectedProperties;
                if (!props.length) continue;

                for (var j=0;j<props.length;j++) {
                    var prop = props[j];
                    if (!prop.isSpatial) continue;
                    if (!prop.canVaryOverTime) continue;

                    var keyIndices = prop.selectedKeys;
                    if (keyIndices.length < 2) continue;

                    for (var k=0;k<keyIndices.length-1;k++) {
                        var key = keyIndices[k];
                        var nextKey = keyIndices[k+1]
                        //get this key value
                        var keyValue = prop.valueAtTime(prop.keyTime(key),true);
                        //get next key value
                        var nextKeyValue = prop.valueAtTime(prop.keyTime(key+1),true);

                        //compare and set
                        if (prop.propertyValueType == PropertyValueType.ThreeD_SPATIAL)
                        {
                            if (keyValue[0] == nextKeyValue[0] && keyValue[1] == nextKeyValue[1] && keyValue[2] == nextKeyValue[2])
                            {
                                prop.setSpatialTangentsAtKey(key,prop.keyInSpatialTangent(key),[0,0,0]);
                                prop.setSpatialTangentsAtKey(nextKey,[0,0,0],prop.keyOutSpatialTangent(nextKey));
                            }
                        }
                        else if (prop.propertyValueType == PropertyValueType.TwoD_SPATIAL)
                        {
                            if (keyValue[0] == nextKeyValue[0] && keyValue[1] == nextKeyValue[1])
                            {
                                prop.setSpatialTangentsAtKey(key,prop.keyInSpatialTangent(key),[0,0]);
                                prop.setSpatialTangentsAtKey(nextKey,[0,0],prop.keyOutSpatialTangent(nextKey));
                            }
                        }
                    } // for keys
                } // for props
            } // for layers
            app.endUndoGroup();
        } // function autoFix()



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

        var autoFixButton = mainPalette.add('button',undefined,'Auto-Fix');
        autoFixButton.onClick = autoFix;
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
