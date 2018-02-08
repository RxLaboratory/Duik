/*
 
SCRIPT NAME
Copyright (c) 2011
DESCRIPTION
 
*/
 
//encapsulate the script in a function to avoid global variables
(function (thisObj) {
	
	// load libduik
	#include 'libduik.jsxinc'
      
    //================
    var version = '00';
    //================
    
    // ================ ADD FUNCTIONS HERE =============
	{
		/** The master property, null if none has been picked yet */
		var masterProp = null;
		
		/**
		 * Gets the selected property
		 *
		 * @return {Property} The selected property
		 */
		function getCurrentProp()
		{
			var comp = app.project.activeItem;
			if (!(comp instanceof CompItem)) return;
			if (!comp.selectedLayers.length) return;
			var layer = comp.selectedLayers[0];
			if (!layer.selectedProperties.length) return;
			var prop = layer.selectedProperties[layer.selectedProperties.length -1];
			return prop;
		}
		
		/**
		 * Generates the expression needed to connect the slave properties
		 *
		 * @param {bool} thisComp - 	Wether to use "thisComp" instead of "comp('name')" at the beginning of the expression, default is false
		 *
		 * @return {string} The expression
		 */
		function generateExpression(thisComp)
		{
			// if master prop has not been picked, stop here
			if (!masterProp) return;
			
			// the expression
			var expr = "";
			
			// generates the link to the master property
			var ctrlValue = Duik.utils.getExpressionLink(masterProp);
			
			// replace comp('name') by thisComp
			if (thisComp) {
				//TODO WARNING This won't work if comp name includes a .
				//needs to use regexp here to find comp("name") and remove it
				//this regexp: (comp *\(.+\)) to find comp()
				ctrlValue = "thisComp" + ctrlValue.substr(ctrlValue.indexOf("."));
			}
			
			// gets the selected axis
			if (masterValueYButton.enabled) {
				if (masterValueXButton.value) ctrlValue += "[0]";
				else if (masterValueYButton.value) ctrlValue += "[1]";
				else if (masterValueZButton.value) ctrlValue += "[2]";
			}
			
			var min = parseFloat(masterValueMinText.text);
			if (isNaN(min)) min = 0;
			var max = parseFloat(masterValueMaxText.text);
			if (isNaN(max)) max = 100;
			
			
			expr = "var ctrlValue = ";
			expr += ctrlValue + ";\n";
			expr += "var ctrlMin = " + min + ";\n";
			expr += "var ctrlMax = " + max + ";\n";
			expr += "if (numKeys >= 2)\n";
			expr += "{\n";
			expr += "var t = 0;\n";
			expr += "var beginTime = key(1).time;\n";
			expr += "var endTime = key(numKeys).time;\n";
			expr += "if (ctrlMin > ctrlMax)\n";
			expr += "{\n";
			expr += "t = linear(ctrlValue, ctrlMin, ctrlMax, endTime, beginTime);\n";
			expr += "}\n";
			expr += "else\n";
			expr += "{\n";
			expr += "t = linear(ctrlValue, ctrlMin, ctrlMax, beginTime, endTime);\n";
			expr += "}\n";
			expr += "valueAtTime(t);\n";
			expr += "}\n";
			expr += "else value;\n";
			
			return expr;
		}
		
		function opacityConnect(expr)
		{
			if (!expr) expr = '';
			var comp = app.project.activeItem;
			if (!(comp instanceof CompItem)) return;
			if (!comp.selectedLayers.length) return;
			app.beginUndoGroup("Duik - Opacity Sequence");
			for (var i = 0 ; i < comp.selectedLayers.length ; i++)
			{
				var t = i*comp.frameDuration;
				var endTime = (comp.selectedLayers.length-1)*comp.frameDuration;
				var layer = comp.selectedLayers[i];
				layer.transform.opacity.setValueAtTime(0,0);
				layer.transform.opacity.setValueAtTime(endTime,0);
				layer.transform.opacity.setValueAtTime(t,100);
				if (i < comp.selectedLayers.length -1 ) layer.transform.opacity.setValueAtTime(t+comp.frameDuration,0);
				for (var keyIndex = 1;keyIndex <= layer.transform.opacity.numKeys;keyIndex++)
				{
					layer.transform.opacity.setInterpolationTypeAtKey(keyIndex,KeyframeInterpolationType.HOLD,KeyframeInterpolationType.HOLD);
				}
				layer.transform.opacity.expression = expr;
			}
			app.endUndoGroup();
		}
		
		// ------- UI ACTIONS --------
		function valueButtonClicked()
		{
			mainGroup.hide();
			valueGroup.show();
		}
		
		function cancelValueButtonClicked()
		{
			mainGroup.show();
			valueGroup.hide();
		}
		
		function masterPickButtonClicked()
		{
			masterProp = getCurrentProp();
			var type = masterProp.propertyValueType;
			masterValueXButton.enabled = false;
			masterValueYButton.enabled = false;
			masterValueZButton.enabled = false;
			masterValueXButton.text = "X";
			masterValueYButton.text = "Y";
			masterValueZButton.text = "Z";
			if (type == PropertyValueType.ThreeD_SPATIAL || type == PropertyValueType.ThreeD || type == PropertyValueType.COLOR)
			{
				masterValueXButton.enabled = true;
				masterValueYButton.enabled = true;
				masterValueZButton.enabled = true;
				if (type == PropertyValueType.COLOR)
				{
					masterValueXButton.text = "R";
					masterValueYButton.text = "V";
					masterValueZButton.text = "B";
				}
			}
			else if (type == PropertyValueType.TwoD_SPATIAL || type == PropertyValueType.TwoD)
			{
				masterValueXButton.enabled = true;
				masterValueYButton.enabled = true;
			}
			else if (type == PropertyValueType.OneD)
			{
				masterValueXButton.value = true;
			}
			else
			{
				alert("This property cannot be used as a controller.");
				return;
			}
			
			//TODO replace with a user friendly text, like "comp name | layer name | Property name"
			masterEdit.text = Duik.utils.getExpressionLink(masterProp);
		}

		function opacityValueButtonClicked()
		{
			var expr = generateExpression();
			opacityConnect(expr);
		}
		
		/**
		 * Connects the selected properties (if any) to the master property using an expression
		 */
		function applyButtonClicked()
		{
			// if master property has not been picked, nothing to do
			if (!masterProp) return;
			
			// if there's no selected layer, nothing to do
			var comp = app.project.activeItem;
			if (!(comp instanceof CompItem)) return;
			if (!comp.selectedLayers.length) return;
			var layers = comp.selectedLayers;
			
			// check if the current comp is the same than the comp containing the masterProperty
			var masterComp = Duik.utils.getPropertyComp(masterProp);
			var thisComp = masterComp === comp;
			
			// generate the expression
			var expr = generateExpression(thisComp);
			
			// apply expression in each selected property
			for (var l = 0;l<comp.selectedLayers.length;l++)
			{
				var layer = comp.selectedLayers[l];
				var props = layer.selectedProperties;
				for (var i = 0 ; i< props.length;i++)
				{
					var prop = props[i];
					if (prop.canSetExpression) prop.expression = expr;
				}
			}
			
		}
		
		function opacitySeqButtonClicked()
		{
			opacityConnect();
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
		function addHGroup(conteneur)
		{
			var groupe = conteneur.add('group');
			//expertMode ? groupe.alignChildren = ['left','fill'] : groupe.alignChildren = ['fill','fill'];
			groupe.alignChildren = ['fill','fill'];
			groupe.orientation = 'row';
			groupe.spacing = 2;
			groupe.margins = 0;
			return groupe;
		}
		
        var content = mainPalette.add('group');
        content.alignChildren = ['fill','top'];
        content.orientation = 'stack';
        content.margins = 0;
        content.spacing = 2;
		
		// ----------- MAIN -----------
		
		var mainGroup = content.add('group');
		mainGroup.alignment = ['fill','top'];
		mainGroup.alignChildren = ['fill','fill'];
        mainGroup.orientation = 'column';
        mainGroup.margins = 0;
        mainGroup.spacing = 2;
		
		mainGroup.add('statictext',undefined,"Master type:");
		var valueButton = mainGroup.add('button',undefined,"Property Value");
		valueButton.onClick = valueButtonClicked;
		var distanceButton = mainGroup.add('button',undefined,"Distance between layers");
		var velocityButton = mainGroup.add('button',undefined,"Property Velocity");
		
		mainGroup.add('statictext',undefined,"Tools:");
		var opacitySeqButton = mainGroup.add('button',undefined,"Opacity Sequence");
		opacitySeqButton.onClick = opacitySeqButtonClicked;
		
		// -------- VALUE ------------
		
		var valueGroup = content.add('group');
		valueGroup.alignment = ['fill','top'];
		valueGroup.alignChildren = ['fill','fill'];
        valueGroup.orientation = 'column';
        valueGroup.margins = 0;
        valueGroup.spacing = 2;
		
		var masterValueGroup = valueGroup.add('group');
		masterValueGroup.alignment = ['fill','top'];
		masterValueGroup.alignChildren = ['fill','fill'];
        masterValueGroup.orientation = 'row';
        masterValueGroup.margins = 0;
        masterValueGroup.spacing = 2;
		
		var masterEdit = masterValueGroup.add('edittext',undefined,"Control value...");
		masterEdit.onActivate = function(){if (masterEdit.text == "Control value...") masterEdit.text = '';};
		
		var masterPickButton = masterValueGroup.add('button',undefined,"P");
		masterPickButton.alignment = ['right','fill'];
		masterPickButton.maximumSize = [25,25];
		masterPickButton.helpTip = "Pick current property";
		masterPickButton.onClick = masterPickButtonClicked;
		/*var masterSelectButton = masterValueGroup.add('button',undefined,"S");
		masterSelectButton.alignment = ['right','fill'];
		masterSelectButton.maximumSize = [25,25];*/
		
		var optionsValueGroup = valueGroup.add('group');
		optionsValueGroup.alignment = ['fill','top'];
		optionsValueGroup.alignChildren = ['fill','center'];
        optionsValueGroup.orientation = 'row';
        optionsValueGroup.margins = 0;
        optionsValueGroup.spacing = 2;
		
		var masterValueXButton = optionsValueGroup.add('radioButton',undefined,"X");
		masterValueXButton.value = true;
		var masterValueYButton = optionsValueGroup.add('radioButton',undefined,"Y");
		var masterValueZButton = optionsValueGroup.add('radioButton',undefined,"Z");
		masterValueXButton.enabled = false;
		masterValueYButton.enabled = false;
		masterValueZButton.enabled = false;
		
		var masterValueMinText = optionsValueGroup.add('edittext',undefined,"Min Value");
		masterValueMinText.onActivate = function(){if (masterValueMinText.text == "Min Value") masterValueMinText.text = '';};
		var masterValueMaxText = optionsValueGroup.add('edittext',undefined,"Max Value");
		masterValueMaxText.onActivate = function(){if (masterValueMaxText.text == "Max Value") masterValueMaxText.text = '';};
	
		
		var applyValueButton = valueGroup.add('button',undefined,"Connect to selected properties");
		applyValueButton.onClick = applyButtonClicked;
		var opacityValueButton = valueGroup.add('button',undefined,"Connect to opacities");
		opacityValueButton.onClick = opacityValueButtonClicked;
		var cancelValueButton = valueGroup.add('button',undefined,"< Back");
		cancelValueButton.onClick = cancelValueButtonClicked;
		
		valueGroup.hide();
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



/*(function ()
{
	
	function getProperties(propGroup,node)
	{
		for (var i = 1;i<=propGroup.numProperties;i++)
		{
			var prop = propGroup.property(i);
			if (prop.elided) continue;
			
			if (prop instanceof PropertyGroup)
			{
				if (prop.numProperties == 0) continue;
				var newItem = node.add("node",prop.name);
				getProperties(prop,newItem);
			}
			else
			{
				if (!prop.canSetExpression) continue;
				node.add("item",prop.name);
			}
		}
	}

	function getChildren(parentLayer,layers,node)
	{
		for (var i = 0 ; i < layers.length;i++)
		{
			var child = layers[i];
			if (child.parent != parentLayer) continue;
			layers.splice(i,1);
			i--;
			var childNode = node.add('node',"Layer " + child.index + " - " + child.name);
			var propNode = childNode.add('node',"Properties");
			getProperties(child,propNode);
			getChildren(child,layers,childNode);
		}
	}
	function populate()
	{
		for (var i = 1; i<= app.project.numItems;i++)
		{
			var item = app.project.item(i);
			if (item instanceof CompItem)
			{
				var node = liste.add('node',"Comp " + i + ' - ' + item.name);
				var childrenLayers = [];
				var ancestorsLayers = [];
				for (var j = 1;j<=item.numLayers;j++)
				{
					var layer = item.layer(j);
					if (layer.parent) 
					{
						childrenLayers.push(layer);
						continue;
					}
					else
					{
						ancestorsLayers.push(layer);
					}
				}
				
				for (var j = 0 ; j < ancestorsLayers.length;j++)
				{
					var layer = ancestorsLayers[j];
					var layerNode = node.add('node',"Layer " + layer.index + " - " + layer.name);
					var propNode = layerNode.add('node',"Properties");
					getProperties(layer,propNode);
					getChildren(layer,childrenLayers,layerNode);
				}
			}
		}
	}
	
	var fenetre = new Window("palette","Selecteur",undefined,{resizeable:true});
	fenetre.alignChildren = ['fill','fill'];
	fenetre.margins = 0;
	var liste = fenetre.add("treeview",undefined);
	
	populate();
	
	fenetre.layout.layout(true);
    fenetre.layout.resize();
    fenetre.onResizing = fenetre.onResize = function () {fenetre.layout.resize();}
	fenetre.show();
}());
*/
