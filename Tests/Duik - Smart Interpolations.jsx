/*

SCRIPT NAME
Copyright (c) 2011
DESCRIPTION

*/

//encapsulate the script in a function to avoid global variables
(function (thisObj) {
     
    //================
    var version = '00';
    //================
   
    // ================ ADD FUNCTIONS HERE =============
    {
		//FUNCTION TO GET CURRENT COMP OR ALERT IF NO CURRENT CompItem
		function getCurrentComp() {
		var comp = app.project.activeItem;
		if (comp instanceof CompItem) return comp;
		else
		{
		alert(tr("Active composition not found.\nPlease select a composition or activate the composition panel."));
		return null;
		}
		}

		//FUNCTION TO GET CURRENT Layers
		function getCurrentLayers() {
		var comp = getCurrentComp();
		if (!comp) return null;
		var layers = comp.selectedLayers;
		if (!layers.length)
		{
		alert(tr("No selected layer.\nPlease select a layer/property."));
		return null;
		}
		return layers;
		}

		//FUNCTION TO GET ALL Layers
		function getLayers() {
		var comp = getCurrentComp();
		if (!comp) return null;
		var layrs = comp.layers;
		layers = Duik.utils.convertCollectionToArray(layrs);
		if (!layers.length)
		{
		alert(tr("No layer in this comp.\nPlease select a composition with layers."));
		return null;
		}
		return layers;
		}

		//FUNCTION TO GET CURRENT Items
		function getCurrentItems() {
		var items = app.project.selection;
		if (!items.length)
		{
		alert(tr("No selected item.\nPlease select an item."));
		return null;
		}
		return items;
		}

		//FUNCTION TO GET CURRENT Props
		function getCurrentProps() {
		var layers = getCurrentLayers()
		if (!layers) return null;
		var props = layers[0].selectedProperties;
		if (!props.length)
		{
		alert(tr("No selected property.\nPlease select a property."));
		return null;
		}
		return props;
		}

		//FUNCTION TO GET CURRENT Prop
		function getCurrentProp(canSetExpression) {
		if (canSetExpression == undefined) canSetExpression = true;
		var props = getCurrentProps();
		if (!props) return null;
		var prop = props.pop();
		if (canSetExpression && !prop.canSetExpression)
		{
		alert(tr("Selected property cannot get any expression, it cannot be rigged, sorry."));
		return null;
		}

		return prop;
		}

		function smooth()
		{
			var comp = getCurrentComp();
			var layers = getCurrentLayers();
			
			app.beginUndoGroup("Smooth!");
			
			//set all keys to linear
			for (var i=0;i<layers.length;i++) {
				for (var j=0;j<layers[i].selectedProperties.length;j++) {
					if (layers[i].selectedProperties[j].canVaryOverTime) {
						for (var k=0;k<layers[i].selectedProperties[j].selectedKeys.length;k++) {
							var prop = layers[i].selectedProperties[j];
							prop.setInterpolationTypeAtKey(prop.selectedKeys[k],KeyframeInterpolationType.LINEAR);
							if (prop.isSpatial) prop.setRovingAtKey(prop.selectedKeys[k],false);
						}
					}
				}
			}
			
			//smooth!
			for (var i=0;i<layers.length;i++) {
				for (var j=0;j<layers[i].selectedProperties.length;j++) {
					if (layers[i].selectedProperties[j].canVaryOverTime) {
						for (var k=0;k<layers[i].selectedProperties[j].selectedKeys.length;k++) {
							var prop = layers[i].selectedProperties[j];
							var key = prop.selectedKeys[k];
							var easeIn = [];
							var easeOut = [];
							for (var l = 0;l<prop.keyInTemporalEase(key).length;l++)
							{
								var speedIn = prop.keyInTemporalEase(key)[l].speed;
								var speedOut = prop.keyOutTemporalEase(key)[l].speed;
								var speed = 0;
								
								if ( Math.abs(speedIn) <= Math.abs(speedOut) ) speed = speedIn else speed = speedOut;
								if (( speedIn > 0 && speedOut < 0 ) || ( speedIn < 0 && speedOut > 0 )) speed = 0;
								if (key == prop.numKeys) speed = 0;
								if (key == 1) speed = 0;
								
								easeIn.push(new KeyframeEase(speed,33));
								easeOut.push(new KeyframeEase(speed, 33));
								
							}
							prop.setTemporalEaseAtKey(key,easeIn,easeOut);
							if (key == prop.numKeys && !easeEnd.value)
							{
								prop.setInterpolationTypeAtKey(prop.selectedKeys[k],KeyframeInterpolationType.LINEAR);
								if (prop.isSpatial) prop.setRovingAtKey(prop.selectedKeys[k],false);
							}
							if (key == 1 && !easeStart.value)
							{
								prop.setInterpolationTypeAtKey(prop.selectedKeys[k],KeyframeInterpolationType.LINEAR);
								if (prop.isSpatial) prop.setRovingAtKey(prop.selectedKeys[k],false);
							}
						}
					}
				}
			}
				
			
			//fixes
			if (extra.value)
			for (var i=0;i<layers.length;i++) {
				for (var j=0;j<layers[i].selectedProperties.length;j++) {
					if (layers[i].selectedProperties[j].canVaryOverTime) {
						for (var k=layers[i].selectedProperties[j].selectedKeys.length-1;k>=0;k--) {
							var prop = layers[i].selectedProperties[j];
							var key = prop.selectedKeys[k];
							var easeIn = [];
							var easeOut = [];
							if (key < prop.numKeys && key > 1)
							{
								for (var l = 0;l<prop.keyInTemporalEase(key).length;l++)
								{
									var nextSpeed = prop.keyInTemporalEase(key+1)[l].speed;
									var speed = prop.keyOutTemporalEase(key)[l].speed;
									var defaultSpeed = ( prop.valueAtTime(prop.keyTime(key+1),true)-prop.valueAtTime(prop.keyTime(key),true) ) / (prop.keyTime(key+1) - prop.keyTime(key));

									var nextAbsSpeed = Math.abs(nextSpeed);
									var absSpeed = Math.abs(speed);
									
									var nextDif = nextSpeed - defaultSpeed;
									var dif = speed - defaultSpeed;
									
									if (speed != 0)
									{
										if (nextAbsSpeed < absSpeed)
										{
											var fix = (1-nextAbsSpeed/absSpeed)*absSpeed;
										}
										else if (nextAbsSpeed != 0)
										{
											var fix = (1-absSpeed/nextAbsSpeed)*absSpeed;
										}
										
										if (-nextDif > dif) speed += fix;
										else speed -= fix;
										
									}

									

									easeIn.push(new KeyframeEase(speed,33));
									easeOut.push(new KeyframeEase(speed, 33));
								}
								prop.setTemporalEaseAtKey(key,easeIn,easeOut);
							}
						}
					}
				}
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
        var content = mainPalette.add('group');
        content.alignChildren = ['fill','top'];
        content.orientation = 'column';
        content.margins = 0;
        content.spacing = 2;
		
		
		var bouton = content.add('button',undefined,"Smooth!")
		bouton.onClick = smooth;
		var smoothingGroup = content.add('group');
		smoothingGroup.orientation = 'row';
		smoothingGroup.margins = 0;
        smoothingGroup.spacing = 0;

		var extra = content.add('checkbox',undefined,"Smoother");
		extra.onClick = smooth;
		extra.value = true;
		var easeStart = content.add('checkbox',undefined,"Ease Start");
		easeStart.onClick = smooth;
		var easeEnd = content.add('checkbox',undefined,"Ease End");
		easeEnd.onClick = smooth;

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