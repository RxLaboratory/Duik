/**
 * The whole script is encapsulated to avoid global variables
 * @property {object}	obj		- The 'this' of the script itself, either a ScriptUI Panel or undefined
 */
(function (obj) {

	#include libduik.jsxinc

	// ============================= INIT =============================================
	var version = "1.1";

	// ============================= UI ===============================================

	var  myPal = null;
	obj instanceof Panel ? myPal = obj : myPal = new Window('palette',"TVPaint Import",undefined, {resizeable:true});

	if (myPal == null) throw "Failed to create User Interface.";

	// Margins and alignment
	myPal.alignChildren = ['fill','top'];
	myPal.margins = 5;
	myPal.spacing = 2;

	//Button
	var btnImport = myPal.add('button',undefined,"Import");
	btnImport.onClick = function ()
	{
		tvpFile = File.openDialog("Select clipinfo.txt",'txt files:*.txt',false);
		if (!tvpFile) return;
		Duik.bridge.tvPaint.importClip(tvpFile);
	}

	//Help
	var labelImport = myPal.add('statictext',undefined,"Select the 'clipinfo.txt' file from the TVPaint export to import the corresponding clip in After Effects",{multiline:true});
	labelImport.alignment = ['fill','fill'];

	//version
	myPal.add('statictext',undefined,"v" + version);

	myPal.layout.layout(true);
	myPal.layout.resize();
	myPal.onResizing = myPal.onResize = function () {this.layout.resize();}

	// If it's a Window, it needs to be shown
	if (myPal instanceof Window)
	{
		//ui.center();
		myPal.show();
	}
})(this);
