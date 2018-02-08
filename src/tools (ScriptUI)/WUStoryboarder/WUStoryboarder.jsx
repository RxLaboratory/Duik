(function(thisObj)
{
	#include "libs/JSON.jsxinc"
	#include "libs/DuAEFLib.jsxinc"
	#include "libs/DuAECoreLib.jsxinc"
	#include "libs/DuJSLib.jsxinc"
	#include "libs/DuScriptUILib.jsxinc"
	#include "libs/DuWUStoryboarderLib.jsxinc"

	var version = "0.1-Beta-1";

	//====== EVENTS ===============

	function fileButton_clicked()
	{
		//select file
		var file = File.openDialog("Select the .storyboarder file.","Storyboarder:*.storyboarder,JSON:*.json,All files:*.*",false);
		if (!file) return;

		app.beginUndoGroup("Import Storyboarder file");

		DuAEF.WUStoryboarder.import(file,overlayButton.value,precompButton.value);

		app.endUndoGroup();
	}

	//========= UI ================

	var palette = DuAEF.DuScriptUI.createUI(thisObj,"WUStoryboarder");

	var fileButton = palette.add('button',undefined,"Select .storyboarder file...");
	var overlayButton = palette.add('checkbox',undefined,"Overlay text information");
	var precompButton = palette.add('checkbox',undefined,"Precompose shots");
	var versionText = palette.add('statictext',undefined,'v' + version);
	versionText.alignment = ['right','bottom'];
	precompButton.value = true;

	//=========== CONNECT EVENTS ==========
	fileButton.onClick = fileButton_clicked;

	DuAEF.DuScriptUI.showUI(palette);

})(this);
