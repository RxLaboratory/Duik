/*
 
SCRIPT NAME
Copyright (c) 2011
DESCRIPTION
 
*/
 
//encapsulate the script in a function to avoid global variables
(function (thisObj) {
	
	#include 'libduik.jsxinc'
      
    //================
    var version = '00';
    //================
    
    // ================ ADD FUNCTIONS HERE =============
	{
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
		// ------- UI ACTIONS --------
		function masterPickButtonClicked()
		{
			var prop = getCurrentProp();
			var type = prop.propertyValueType;
			masterXButton.enabled = false;
			masterYButton.enabled = false;
			masterZButton.enabled = false;
			masterXButton.text = "X";
			masterYButton.text = "Y";
			masterZButton.text = "Z";
			if (type == PropertyValueType.ThreeD_SPATIAL || type == PropertyValueType.ThreeD || type == PropertyValueType.COLOR)
			{
				masterXButton.enabled = true;
				masterYButton.enabled = true;
				masterZButton.enabled = true;
				if (type == PropertyValueType.COLOR)
				{
					masterXButton.text = "R";
					masterYButton.text = "V";
					masterZButton.text = "B";
				}
			}
			else if (type == PropertyValueType.TwoD_SPATIAL || type == PropertyValueType.TwoD)
			{
				masterXButton.enabled = true;
				masterYButton.enabled = true;
			}
			else if (type == PropertyValueType.OneD)
			{
				masterXButton.value = true;
			}
			else
			{
				alert("This property cannot be used as a controller.");
				return;
			}
			masterEdit.text = Duik.utils.getExpressionLink(prop);
		}
		
		function updateExpressionButtonClicked()
		{
			var ctrlValue = masterEdit.text;
			if (masterYButton.enabled)
			{
				if (masterXButton.value) ctrlValue += "[0]";
				else if (masterYButton.value) ctrlValue += "[1]";
				else if (masterZButton.value) ctrlValue += "[2]";
			}
			
			connectionGroup.enabled = false;
			expressionGroup.enabled = true;
			
			var min = parseFloat(masterMinText.text);
			if (isNaN(min)) min = 0;
			var max = parseFloat(masterMaxText.text);
			if (isNaN(max)) max = 100;
			
			
			var expr = "var ctrlValue = ";
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
			
			expressionEditor.text = expr;
		}
		
		function applyButtonClicked()
		{
			var comp = app.project.activeItem;
			if (!(comp instanceof CompItem)) return;
			if (!comp.selectedLayers.length) return;
			var layer = comp.selectedLayers[0];
			if (!layer.selectedProperties.length) return;
			var props = layer.selectedProperties;
			for (var i = 0 ; i< props.length;i++)
			{
				var prop = props[i];
				if (prop.canSetExpression) prop.expression = expressionEditor.text;
			}
		}
		
		function reinitButtonClicked()
		{
			expressionEditor.text = "Expression";
			expressionGroup.enabled = false;
			connectionGroup.enabled = true;
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
        content.orientation = 'column';
        content.margins = 0;
        content.spacing = 2;
		
		var connectionGroup = content.add('group');
		connectionGroup.alignChildren = ['fill','fill'];
        connectionGroup.orientation = 'column';
        connectionGroup.margins = 0;
        connectionGroup.spacing = 2;
		
		var masterGroup = connectionGroup.add('group');
		masterGroup.alignment = ['fill','top'];
		masterGroup.alignChildren = ['fill','fill'];
        masterGroup.orientation = 'row';
        masterGroup.margins = 0;
        masterGroup.spacing = 2;
		
		var masterEdit = masterGroup.add('edittext',undefined,"Control value...");
		masterEdit.onActivate = function(){if (masterEdit.text == "Control value...") masterEdit.text = '';};
		
		var masterPickButton = masterGroup.add('button',undefined,"P");
		masterPickButton.alignment = ['right','fill'];
		masterPickButton.maximumSize = [25,25];
		masterPickButton.helpTip = "Pick current property";
		masterPickButton.onClick = masterPickButtonClicked;
		/*var masterSelectButton = masterGroup.add('button',undefined,"S");
		masterSelectButton.alignment = ['right','fill'];
		masterSelectButton.maximumSize = [25,25];*/
		
		var optionsGroup = connectionGroup.add('group');
		optionsGroup.alignment = ['fill','top'];
		optionsGroup.alignChildren = ['fill','center'];
        optionsGroup.orientation = 'row';
        optionsGroup.margins = 0;
        optionsGroup.spacing = 2;
		
		var masterXButton = optionsGroup.add('radioButton',undefined,"X");
		masterXButton.value = true;
		var masterYButton = optionsGroup.add('radioButton',undefined,"Y");
		var masterZButton = optionsGroup.add('radioButton',undefined,"Z");
		masterXButton.enabled = false;
		masterYButton.enabled = false;
		masterZButton.enabled = false;
		
		var masterMinText = optionsGroup.add('edittext',undefined,"Min Value");
		masterMinText.onActivate = function(){if (masterMinText.text == "Min Value") masterMinText.text = '';};
		var masterMaxText = optionsGroup.add('edittext',undefined,"Max Value");
		masterMaxText.onActivate = function(){if (masterMaxText.text == "Max Value") masterMaxText.text = '';};
		
		var updateExpressionButton = connectionGroup.add('button',undefined,"Generate Expression");
		updateExpressionButton.alignment = ['fill','top'];
		updateExpressionButton.onClick = updateExpressionButtonClicked;
			
		var expressionGroup = content.add('group');
		expressionGroup.alignment = ['fill','fill'];
		expressionGroup.alignChildren = ['fill','fill'];
        expressionGroup.orientation = 'column';
        expressionGroup.margins = 0;
        expressionGroup.spacing = 2;
		expressionGroup.enabled = false;
		
		var expressionEditor = expressionGroup.add('edittext',undefined,"Expression",{multiline:true});
		
		var bottomGroup = expressionGroup.add('group');
		bottomGroup.alignment = ['fill','bottom'];
		bottomGroup.alignChildren = ['fill','fill'];
        bottomGroup.orientation = 'row';
        bottomGroup.margins = 0;
        bottomGroup.spacing = 2;
		
		var reinitButton = bottomGroup.add('button',undefined,"Reinit");
		reinitButton.onClick = reinitButtonClicked;
		
		var applyButton = bottomGroup.add('button',undefined,"Connect");
		applyButton.onClick = applyButtonClicked;
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