/*


Duik

copyright

blabla credits

blabla licence
*/

//gets the Duik functions
#include libduik.jsxinc

/**
 * The whole script is encapsulated to avoid global variables
 * @property {object}	obj		- The 'this' of the script itself, either a ScriptUI Panel or undefined
 */
(function (obj) {
	
	
	// ============================= UI ===============================================
	
	/**
	 * Constructs and shows the User Interface
	 * @property {object}	thisObj			- The 'this' of the script itself, either a ScriptUI Panel or undefined
	 */
	function UI(thisObj)
	{	
		// The folder containing Icons
		imgFolder = Folder.userData.absoluteURI + "/Duduf/Duik/";
		
		var mainPanel = Duik.ui.createUI(thisObj,"Duik 16");
		
		//imageButton Test
		var enabledButton = Duik.ui.addImageButton(mainPanel,'Test',imgFolder + 'btn_notes.png','',imgFolder + 'btn_calc.png');
		enabledButton.onClick = function () { alert(Duik.aeVersion); };
		
		//imageCheckBox Test
		var testCheckBox = Duik.ui.addImageCheckBox(mainPanel,'Test',imgFolder + 'btn_notes.png','test !',imgFolder + 'btn_calc.png');
		
		Duik.ui.showUI(mainPanel);
	}

	// Create UI
	UI(obj);
	
})(this);
