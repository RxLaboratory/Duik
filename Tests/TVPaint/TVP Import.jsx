#include libduik.jsxinc

/**
 * The whole script is encapsulated to avoid global variables
 * @property {object}	obj		- The 'this' of the script itself, either a ScriptUI Panel or undefined
 */
(function (obj) {
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
	var labelImport = myPal.add('statictext',undefined,"Select the \"clipinfo.txt\" file from the TVPaint export to import the corresponding clip in After Effects",{multiline:true});
	labelImport.alignment = ['fill','fill'];

	//version
	//the method to display webpage when clicked
	function labelClicked()
	{
		if (!Duik.allowedToWriteFiles) return;
		if(Duik.mac) system.callSystem('open https://rainboxprod.coop');
		else system.callSystem('explorer https://rainboxprod.coop');
	}

	var versionGroup = myPal.add('group');
	versionGroup.orientation = 'column';
	versionGroup.margins = 0;
	versionGroup.spacing = 2;
	versionGroup.alignChildren = ['fill','bottom'];
	var tvpVersionLabel = versionGroup.add('statictext',undefined,"TVP Import v" + version);
	tvpVersionLabel.addEventListener('mousdown',labelClicked,true);
	var duikVersionLabel = versionGroup.add('statictext',undefined,"libDuik v" + Duik.versionNumber);
	duikVersionLabel.addEventListener('mousdown',labelClicked,true);
	var urlLabel = versionGroup.add('statictext',undefined,"https://rainboxprod.coop");

	versionGroup.alignment = ['fill','bottom'];
	versionGroup.addEventListener('mousedown',labelClicked,true);

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
