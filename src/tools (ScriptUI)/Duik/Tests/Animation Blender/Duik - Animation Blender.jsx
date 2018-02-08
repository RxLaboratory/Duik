/*

DUIK ANIMATION BLENDER
Copyright (c) 2015 Nicolas Dufresne
DESCRIPTION

*/

//encapsulate the script in a function to avoid global variables
(function (thisObj) {
     
    //================
    var version = '0.1';
    //================
   
    // ================ ADD FUNCTIONS HERE =============
    {
		function refresh()
		{
			//list comps
			var items = app.project.items;
			//previous selection
			var currentAnimComp = getAnimCompName();
			var currentCtrlComp = null;
			if (ctrlComp.selection) currentCtrlComp = ctrlComp.selection.text;
			
			//update list
			animationCompList.removeAll();
			ctrlComp.removeAll();
			for (var i = 1;i<=app.project.numItems;i++)
			{
				if (app.project.item(i) instanceof CompItem) 
				{
					animationCompList.add('item',app.project.item(i).name);
					ctrlComp.add('item',app.project.item(i).name);
				}
			}
			
			//restore selection
			if (currentAnimComp) 
			{
				for (var i = 0;i <animationCompList.items.length;i++)
				{
					if (animationCompList.items[i].text == currentAnimComp) animationCompList.selection = i;
				}
				
				//list animations
				getAnimations();
			}
			if (currentCtrlComp) 
			{
				for (var i = 0;i <ctrlComp.items.length;i++)
				{
					if (ctrlComp.items[i].text == currentCtrlComp) ctrlComp.selection = i;
				}
			}
			
		}
		
		function getAnimCompName()
		{
			var currentAnimComp = null;
			if (animationCompList.selection) currentAnimComp = animationCompList.selection.text;
			return currentAnimComp;
		}
		
		function getAnimComp()
		{
			var name = getAnimCompName();
			if (!name) return null;
			for (var i = 1; i<=app.project.numItems;i++)
			{
				if (app.project.item(i).name == name && app.project.item(i) instanceof CompItem) return app.project.item(i);
			}
			return null;
		}
		
		function getAnimations()
		{
			var currentAnimComp = getAnimComp();
			if (!currentAnimComp) return;
			list.removeAll();
			//look for anim layer
			for (var i = 1;i <= currentAnimComp.numLayers;i++)
			{
				var layer = currentAnimComp.layer(i);
				if (layer.name == '#Animation Blender')
				{
					var markers = layer.property('Marker');
					for (var j = 1;j<= markers.numKeys;j++ )
					{
						var marker = markers.keyValue(j);
						list.add('item',marker.comment);
					}
				}
			}
		}
		
		function currentAnimCompChanged()
		{
			getAnimations();
		}
		
		function currentCtrlCompChanged()
		{
			//get comp by name
			var comp = null;
			if (!ctrlComp.selection) return;
			for (var i = 1;i<=app.project.numItems;i++)
			{
				if (app.project.item(i).name == ctrlComp.selection.text && app.project.item(i) instanceof CompItem)
				{
					comp = app.project.item(i);
					break;
				}
			}
			
			//list layers
			if (comp)
			{
				for (var i = 1;i<comp.numLayers;i++)
				{
					ctrlLayer.add('item',comp.layer(i).index + " - " + comp.layer(i).name);
				}
			}
		}
		
		function addButtonClicked()
		{
			if (!list.selection) return;
			var marker = list.selection.text;
			var comp = app.project.activeItem;
			if (!comp instanceof CompItem)
			{
				alert("No active composition");
				return;
			}
			if (!comp.selectedLayers.length)
			{
				alert("Please select controller layer");
				return;
			}
			var layer = comp.selectedLayers[0];
			var mv = new MarkerValue(marker);
			layer.property("Marker").setValueAtTime(comp.time, mv);
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
        mainPalette.spacing = 4;
    }
    //__________________________


    // ============ ADD UI CONTENT HERE =================
    {
		var headerGroup1 = mainPalette.add('group');
        headerGroup1.alignChildren = ['fill','fill'];
        headerGroup1.orientation = 'row';
        headerGroup1.margins = 0;
        headerGroup1.spacing = 2;
		headerGroup1.alignment = ['fill','top'];
		headerGroup1.add('statictext',undefined,'Duik Anim Blender Prototype');
		var refreshButton = headerGroup1.add('button',undefined,"R");
		refreshButton.alignment = ['right','top'];
		refreshButton.onClick = refresh;
		
		var headerGroup2 = mainPalette.add('group');
        headerGroup2.alignChildren = ['fill','fill'];
        headerGroup2.orientation = 'row';
        headerGroup2.margins = 0;
        headerGroup2.spacing = 2;
		headerGroup2.alignment = ['fill','top'];
		var animationCompList = headerGroup2.add('dropdownlist',undefined);
		animationCompList.alignment = ['fill','fill'];
		animationCompList.onChange = currentAnimCompChanged;
		var pickButton = headerGroup2.add('button',undefined,"P");
		pickButton.alignment = ['right','fill'];
		
		var sep2 = mainPalette.add('group');
		sep2.margins = 5;
		sep2.alignment = ['fill','top'];
		var separator2 = sep2.add('panel',undefined);
		separator2.alignment = ['fill','center'];
		separator2.height = 0;
		
		
        var content = mainPalette.add('group');
        content.alignChildren = ['fill','fill'];
        content.orientation = 'stack';
        content.margins = 0;
        content.spacing = 2;

		var homePanel = content.add('group');
		homePanel.orientation = 'column';
		homePanel.margins = 0;
        homePanel.spacing = 2;
		var setupPanel = content.add('group');
		setupPanel.orientation = 'column';
		setupPanel.margins = 0;
        setupPanel.spacing = 2;
		setupPanel.hide();
		
		var footerGroup = mainPalette.add('group');
        footerGroup.alignChildren = ['fill','fill'];
        footerGroup.orientation = 'row';
        footerGroup.margins = 0;
        footerGroup.spacing = 2;
		footerGroup.alignment = ['fill','bottom'];
		footerGroup.add('statictext',undefined,'www.duduf.net');
		var refreshButton = footerGroup.add('statictext',undefined,"v" + version);
		refreshButton.alignment = ['right','fill'];
		
		//home
		var setupGroup = homePanel.add('group');
		setupGroup.alignment = ['fill','top'];
        var setupButton = setupGroup.add('button',undefined,"Setup");
		setupButton.alignment = ['fill','fill'];
		setupButton.onClick = function ()
		{
			homePanel.hide();
			setupPanel.show();
		}
		
		var list = homePanel.add('treeview',undefined);
		list.alignment = ['fill','fill'];
		
		var addButton = homePanel.add('button',undefined,"Add");
		addButton.alignment = ['right','bottom'];
		addButton.onClick = addButtonClicked;
		
		//setup
		var ctrlGroup = setupPanel.add('group');
		ctrlGroup.margins = 0;
        ctrlGroup.spacing = 2;
		ctrlGroup.alignment = ['fill','top'];
		ctrlGroup.alignChildren = ['fill','fill'];
		var ctrlLabel = ctrlGroup.add('statictext',undefined,'Controller:');
		ctrlLabel.alignment = ['left','fill'];
		var ctrlComp = ctrlGroup.add('dropdownlist',undefined,['--------------------']);
		ctrlComp.onChange = currentCtrlCompChanged;
		var ctrlLayer = ctrlGroup.add('dropdownlist',undefined,['--------------------']);
		var ctrlPicker = ctrlGroup.add('button',undefined,"P");
		ctrlPicker.alignment = ['right','fill'];
		
		var validGroup = setupPanel.add('group');
		validGroup.margins = 0;
        validGroup.spacing = 2;
		validGroup.alignment = ['fill','top'];
		validGroup.alignChildren = ['fill','fill'];
		var setupValidButton = validGroup.add('button',undefined,"Setup Animation Composition");
		
		var sep = setupPanel.add('group');
		sep.margins = 5;
		sep.alignment = ['fill','top'];
		var separator1 = sep.add('panel',undefined);
		separator1.alignment = ['fill','center'];
		separator1.height = 0;
		
		var animationGroup = setupPanel.add('group');
		animationGroup.margins = 0;
        animationGroup.spacing = 2;
		animationGroup.alignment = ['fill','top'];
		animationGroup.alignChildren = ['fill','fill'];
		var animationName = animationGroup.add('edittext',undefined,"New animation...");
		var animationCreateButton = animationGroup.add('button',undefined,"Create");
		animationCreateButton.alignment = ['right','fill'];
		
		var animationWorkArea = setupPanel.add('checkbox',undefined,"Use work area");
		animationWorkArea.alignment = ['left','top'];
		animationWorkArea.value = true;
		
		var durationGroup = setupPanel.add('group');
		durationGroup.margins = 0;
        durationGroup.spacing = 2;
		durationGroup.alignment = ['fill','top'];
		durationGroup.alignChildren = ['fill','fill'];
		durationGroup.enabled = false;
		var durationLabel = durationGroup.add('statictext',undefined,"Duration:");
		durationLabel.alignment = ['left','fill'];
		var durationEdit = durationGroup.add('edittext',undefined,'100');
		
		var sep3 = setupPanel.add('group');
		sep3.margins = 5;
		sep3.alignment = ['fill','top'];
		var separator3	= sep3.add('panel',undefined);
		separator3.alignment = ['fill','center'];
		separator3.height = 0;
		
		var backButton = setupPanel.add('button',undefined,"Back");
		backButton.alignment = ['left','top'];
		backButton.onClick = function ()
		{
			homePanel.show();
			setupPanel.hide();
		}
		
		
		refresh();
		
		
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