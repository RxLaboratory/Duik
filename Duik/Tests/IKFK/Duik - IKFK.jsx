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
		function evalExpressionLink(link)
		{
			link = link.replace('thisComp','app.project.activeItem');
			return eval(link);
		}
		
		function getController()
		{
			//get controller
			var comp = app.project.activeItem;
			if ((!comp instanceof CompItem)) return null;
			if (!comp.selectedLayers.length) return null;
			
			//get the controller
			return comp.selectedLayers[0];
		}
		
		function getIKEffect(ctrl)
		{
			//get the IK effect
			var ikEffect = ctrl.effect(Duik.effects.Two_Layer_IK);
			if (!ikEffect) ikEffect = ctrl.effect(Duik.effects.Three_Layer_IK);
			if (!ikEffect) return null;
			return ikEffect;
		}
		
		function IK2FK()
		{
			var comp = app.project.activeItem;
			var ctrl = getController();
			if (!ctrl) return;
			
			var ikEffect = getIKEffect(ctrl);
			if (!ikEffect) return;
			
			//find the zero/goal
			var end = null;
			for (var i = 1;i<comp.numLayers;i++)
			{
				var layer = comp.layer(i);
				if (layer.effect(Duik.uiStrings.ikEnd))
				{
					rotExpression = layer.transform.rotation.expression;
					rotLines = rotExpression.split("\n");
					for (var j = 0;j< rotLines.length;j++)
					{
						var line = rotLines[j];
						if (!line.indexOf('controller = ') == 0) continue;
						line = line.replace('controller = ','')
						var ctrlTest = evalExpressionLink(line);
						
						if (ctrlTest.index == ctrl.index)
						{
							end = layer;
							break;
						}
					}
					if (end) break;
				}
			}
			
			//add nul, get world pos
			var tempLayer = comp.layers.addNull();
			tempLayer.transform.position.expression = "thisComp.layer('" + end.name + "').toWorld(thisComp.layer('" + end.name + "').effect('" + Duik.uiStrings.ikEnd + "')(1));"
			
			//set controller position
			ctrl.transform.position.setValueAtTime(comp.time,tempLayer.transform.position.value);
			
			tempLayer.remove();
		}
		
		function FK2IK()
		{
			var comp = app.project.activeItem;
			var ctrl = getController();
			if (!ctrl) return;

			var ikEffect = getIKEffect(ctrl);
			if (!ikEffect) return;
			
			var type = 'Duik.twoLayerIK';
			var threeLayer = false;
			if (ikEffect.matchName == Duik.effects.Three_Layer_IK)
			{
				type = 'Duik.threeLayerIK';
				threeLayer = true;
			}
			
			//get upper, middle, lower rot value
			var layer1,layer2,layer3;
			for (var i = 1 ; i < comp.numLayers ; i++)
			{
				var layer = comp.layer(i);
				var rotExpr = layer.transform.rotation.expression;
				if (rotExpr.indexOf(type) >= 0)
				{
					var rotLines = rotExpr.split("\n");
					var ctrlTest;
					var found = false;
					for (var j = 0;j< rotLines.length;j++)
					{
						var line = rotLines[j];
						if (line.indexOf('controller = ') == 0)
						{
							line = line.replace('controller = ','')
							ctrlTest = evalExpressionLink(line);
						}
						else if (line.indexOf('layer1 = ') == 0)
						{
							line = line.replace('layer1 = ','')
							layer1 = evalExpressionLink(line);
						}
						else if (line.indexOf('layer2 = ') == 0)
						{
							line = line.replace('layer2 = ','')
							layer2 = evalExpressionLink(line);
						}
						else if (line.indexOf('layer3 = ') == 0)
						{
							line = line.replace('layer3 = ','')
							layer3 = evalExpressionLink(line);
						}				
						
						if (ctrlTest) if (ctrlTest.index != ctrl.index)
						{
							layer1 = null;
							layer2 = null;
							layer3 = null;
							break;
						}
						else
						{
							if ((layer3 && threeLayer) || !threeLayer)
								if (layer1 && layer2)
								{
									found = true;
									break;
								}
						}
					}
					if (found) break;
				}
			}
			
			
			
			//set IK effect rot values
			ikEffect(4).setValueAtTime(comp.time,layer1.transform.rotation.value);
			ikEffect(5).setValueAtTime(comp.time,layer2.transform.rotation.value);
			if (threeLayer) ikEffect(6).setValueAtTime(comp.time,layer3.transform.rotation.value);
		}
		
		function switchIKFK()
		{
			
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
        var content = mainPalette.add('group');
        content.alignChildren = ['fill','fill'];
        content.orientation = 'column';
        content.margins = 0;
        content.spacing = 2;
        var buttonFK2IK = content.add('button',undefined,'FK -> IK');
        buttonFK2IK.onClick = FK2IK;
		var buttonIK2FK = content.add('button',undefined,'IK -> FK');
        buttonIK2FK.onClick = IK2FK;
		var buttonSwitch = content.add('button',undefined,'Switch');
        buttonSwitch.onClick = switchIKFK;
		buttonSwitch.enabled = false;
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
