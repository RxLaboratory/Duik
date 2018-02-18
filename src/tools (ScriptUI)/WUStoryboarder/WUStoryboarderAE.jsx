/**
 * @overview Wonderunit Storyboarder project importer for Adobe After EFfects.
 * @author Nicolas Dufresne and contributors
 * @copyright 2018 Nicolas Dufresne
 * @version 0.1
 * @name WUStoryboarderAE
 * @license GPL-3.0 <br />
 * WUStoryboarderAE is free software: you can redistribute it and/or modify<br />
 * it under the terms of the GNU General Public License as published by<br />
 * the Free Software Foundation, either version 3 of the License, or<br />
 * (at your option) any later version.<br />
 *<br />
 * WUStoryboarderAE is distributed in the hope that it will be useful,<br />
 * but WITHOUT ANY WARRANTY; without even the implied warranty of<br />
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the<br />
 * GNU General Public License for more details.<br />
 *<br />
 * You should have received a copy of the GNU General Public License<br />
 * along with WUStoryboarderAE. If not, see {@link http://www.gnu.org/licenses/}.
 */

(function(thisObj)
{
	#include "DuAEF.jsxinc"

	var version = "0.1";

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
