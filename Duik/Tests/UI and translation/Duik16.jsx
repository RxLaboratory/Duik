/*


Duik

copyright

blabla credits

blabla licence
*/

if (Duik) delete Duik;
//gets the Duik functions
#include libduik.jsxinc

/**
 * The whole script is encapsulated to avoid global variables
 * @property {object}	obj		- The 'this' of the script itself, either a ScriptUI Panel or undefined
 */
(function (obj) {
	
	
	// ============================= UI ===============================================
	/**
	 * This block contains the UI initialization
	 */
	{	
		// The folder containing Icons
		imgFolder = Folder.userData.absoluteURI + "/Duduf/Duik/";
		
		var mainPanel = Duik.ui.createUI(obj,"Duik 16");
		
		//imageButton Test
		var enabledButton = Duik.ui.addImageButton(mainPanel,'Test',imgFolder + 'btn_notes.png','',imgFolder + 'btn_calc.png');
		enabledButton.onClick = function () { alert(Duik.aeVersion); };
		
		//imageCheckBox Test
		var testCheckBox = Duik.ui.addImageCheckBox(mainPanel,'Test',imgFolder + 'ctrl_unlock.png','test !',imgFolder + 'ctrl_lock.png');
		
		//imageRadioButton Test
		var testRadio1 = Duik.ui.addImageRadioButton(mainPanel,'Test',imgFolder + 'ctrl_unlock.png','test !',imgFolder + 'ctrl_lock.png');
		var testRadio2 = Duik.ui.addImageRadioButton(mainPanel,'Test2',imgFolder + 'ctrl_unlock.png','test !',imgFolder + 'ctrl_lock.png');
		testRadio1.onClick = function () { testRadio2.setChecked(!testRadio1.checked); };
		testRadio2.onClick = function () { testRadio1.setChecked(!testRadio2.checked); };
		
		Duik.ui.showUI(mainPanel);
	}
	
})(this);
