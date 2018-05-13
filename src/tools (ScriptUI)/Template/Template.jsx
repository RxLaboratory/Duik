/*
This is a Script/ScriptUI Template using the Duduf After Effects Framework (DuAEF).
The script can be launched both from ScriptUI Panels or the File/Scripts/Run Script... menu.
*/

//encapsulate the script in a function to avoid global variables
(function (thisObj) {

	//================
	var version = '0.0.0';
	var scriptName = "The Script Name";
	//================
	#include DuAEF.jsxinc

	// ================ FUNCTIONS =============
	//MAIN


	//UI EVENTS


	// _______ UI SETUP _______
	var ui = DuAEF.DuScriptUI.createUI(thisObj,scriptName);

	// ============ UI CONTENT =================


	//Show UI
	DuAEF.DuScriptUI.showUI(ui);

})(this);
