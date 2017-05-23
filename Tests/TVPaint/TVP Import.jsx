/*
	TVP Import
	Copyright (c) 2017 Rainbox Productions
	https://rainboxprod.coop

	Based on MJ_TVPAINT_IMPORT_1.0.3.jsx by Mads Juul
	https://forum.tvpaint.com/viewtopic.php?f=11&t=6978

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with this program. If not, see <http://www.gnu.org/licenses/>.
*/


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
	tvpVersionLabel.addEventListener('mousedown',labelClicked,true);
	var duikVersionLabel = versionGroup.add('statictext',undefined,"libDuik v" + Duik.versionNumber);
	duikVersionLabel.addEventListener('mousedown',labelClicked,true);
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
