/*
	Duik - Duduf IK Tools

	Copyright (c) 2008 - 2017 Nicolas Dufresne, Rainbox Productions

	https://rainboxprod.coop

	__Contributors:__

		Nicolas Dufresne - Lead developer
		Kevin Masson - Developer

	__Translations:__

		eZioPan – Simplified Chinese
		Ana Arce – Spanish
		Adam Szczepański – Polish

	__Thanks to:__

		Dan Ebberts - Writing the first IK Expressions
		Eric Epstein - making the IK's work with 3D Layers
		Kevin Schires – Including images in the script
		Matias Poggini – Bezier IK feature
		Eric Epstein - Making the IK's work with 3D Layers
		Assia Chioukh and Quentin Saint-Georges – User Guides composition
		Motion Cafe – Ideas and feedback
		Fous d’anim – Ideas and feedback
		All 258 Duik 15 indiegogo backers for making this libDuik possible!

	__Duik makes use of:__

		• x2js
		Copyright (c) 2011-2013 Abdulla Abdurakhmanov
		Original sources are available at https://code.google.com/p/x2js/
		Licensed under the Apache License, Version 2.0

		• json2
		See http://www.JSON.org/js.html
		Public Domain

		• seedRandom
		Copyright (c) David Bau
		Licensed under the MIT license

		• FFMpeg
		See http://ffmpeg.org

		• DuFFMpeg
		Copyright (c) 2017 Nicolas Dufresne and Rainbox Productions
		Sources available at https://github.com/Rainbox-dev/DuFFMpeg
		Licensed under the GNU General Public License v3

	This file is part of Duik.

		Duik is free software: you can redistribute it and/or modify
		it under the terms of the GNU General Public License as published by
		the Free Software Foundation, either version 3 of the License, or
		(at your option) any later version.

		Duik is distributed in the hope that it will be useful,
		but WITHOUT ANY WARRANTY; without even the implied warranty of
		MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
		GNU General Public License for more details.

		You should have received a copy of the GNU General Public License
		along with Duik. If not, see <http://www.gnu.org/licenses/>.

*/

(function(obj)
{
	//=========================
	var version = '16.0.0-Alpha-1';
	//=========================

	#include DuAEF.jsxinc

	//=========== SETTINGS ===========
	//get file
	var settingsFile;
	if (app.settings.haveSetting("Duik","settingsFile")) settingsFile = new File(app.settings.getSetting("Duik","settingsFile"));
	var settings = new DuSettings("Duik",settingsFile);
	//TODO get the version of Duik, update settings if changed
	settings.data.duikVersion = version;
	//set settings if new
	if (settings.data.expert == undefined) settings.data.expert = false;


	//========== MODULES =============
	//Notes
	#include Duik16_notes.jsxinc
	//Calculator
	#include Duik16_calc.jsxinc

	//=========== FUNCTIONS ==========
	function setCurrentPanel(panel)
	{
		if (panel == undefined)
		{
			//get setting
			panel = settings.data.currentPanel;
			if (panel == undefined) panel = 1;
		}

		ui_riggingGroup.visible = panel == 5;
		ui_riggingButton.setChecked(ui_riggingGroup.visible);
		ui_animationGroup.visible = panel == 4;
		ui_animationButton.setChecked(ui_animationGroup.visible);
		ui_cameraGroup.visible = panel == 3;
		ui_cameraButton.setChecked(ui_cameraGroup.visible);
		ui_ioGroup.visible = panel == 2;
		ui_ioButton.setChecked(ui_ioGroup.visible);
		ui_settingsGroup.visible = panel == 1;
		ui_settingsButton.setChecked(ui_settingsGroup.visible);
		ui_helpGroup.visible = panel == 0;
		ui_helpButton.setChecked(ui_helpGroup.visible);

		//save settings
		settings.data.currentPanel = panel;
		settings.save();
	}

	//=========== EVENTS =============

	//TOOLS
	function ui_notesButton_clicked()
	{
		if(!notes_ui_palette.visible) DuAEF.DuScriptUI.showUI(notes_ui_palette);
		else notes_ui_palette.hide();
	}

	function ui_calcButton_clicked()
	{
		if(!calc_ui_palette.visible) DuAEF.DuScriptUI.showUI(calc_ui_palette);
		else calc_ui_palette.hide();
	}

	function ui_bottomGroup_clicked()
	{
		if (!DuAEF.DuAE.App.hasFilesAndNetworkAccess) return;
		if(DuAEF.mac) system.callSystem('open https://rainboxprod.coop');
		else system.callSystem('explorer https://rainboxprod.coop');
	}

	//=========== UI =============

	//main palette
	var ui_palette = DuAEF.DuScriptUI.createUI(obj,'Duik 16');

	//layout
	var ui_topGroup = DuAEF.DuScriptUI.addGroup(ui_palette);
	DuAEF.DuScriptUI.addSeparator(ui_palette);
	var ui_mainGroup = DuAEF.DuScriptUI.addGroup(ui_palette,'stack');
	ui_mainGroup.alignment = ['fill','top'];
	var ui_bottomGroup = DuAEF.DuScriptUI.addGroup(ui_palette);
	ui_bottomGroup.alignment = ['fill','bottom'];

	//=== TOP LEFT TOOLS ===

	var ui_notesButton = DuAEF.DuScriptUI.addImageButton(ui_topGroup,'','E:/DEV SRC/RainboxUI/Icons/18w/notes_l.png',"Simple notepad, with auto-save.",'E:/DEV SRC/RainboxUI/Icons/18w/notes_r.png');
	var ui_calcButton = DuAEF.DuScriptUI.addImageButton(ui_topGroup,'','E:/DEV SRC/RainboxUI/Icons/18w/smallcalc_l.png',"Calculator",'E:/DEV SRC/RainboxUI/Icons/18w/smallcalc_r.png');

	//=== TOP RIGHT TOOLS ===

	var ui_tabsGroup = DuAEF.DuScriptUI.addGroup(ui_topGroup,'row');
	ui_tabsGroup.alignment = ['right','center'];
	var ui_riggingButton = DuAEF.DuScriptUI.addImageCheckBox(ui_tabsGroup,'','E:/DEV SRC/RainboxUI/Icons/18w/rig_l.png',"Rigging",'E:/DEV SRC/RainboxUI/Icons/18w/rig_r.png');
	var ui_animationButton = DuAEF.DuScriptUI.addImageCheckBox(ui_tabsGroup,'','E:/DEV SRC/RainboxUI/Icons/18w/kbez_l.png',"Animation",'E:/DEV SRC/RainboxUI/Icons/18w/kbez_r.png');
	var ui_cameraButton = DuAEF.DuScriptUI.addImageCheckBox(ui_tabsGroup,'','E:/DEV SRC/RainboxUI/Icons/18w/camera_l.png',"Camera",'E:/DEV SRC/RainboxUI/Icons/18w/camera_r.png');
	var ui_ioButton = DuAEF.DuScriptUI.addImageCheckBox(ui_tabsGroup,'','E:/DEV SRC/RainboxUI/Icons/18w/io_l.png',"I/O Tools",'E:/DEV SRC/RainboxUI/Icons/18w/io_r.png');
	var ui_settingsButton = DuAEF.DuScriptUI.addImageCheckBox(ui_tabsGroup,'','E:/DEV SRC/RainboxUI/Icons/18w/settings_l.png',"Settings",'E:/DEV SRC/RainboxUI/Icons/18w/settings_r.png');
	var ui_helpButton = DuAEF.DuScriptUI.addImageCheckBox(ui_tabsGroup,'','E:/DEV SRC/RainboxUI/Icons/18w/help_l.png',"Help | About",'E:/DEV SRC/RainboxUI/Icons/18w/help_r.png');

	//=== BOTTOM ===

	var ui_rainboxURL = ui_bottomGroup.add ('statictext',undefined,'rainboxprod.coop');
	ui_rainboxURL.alignment = ['left','bottom'];

	//=== PANELS ===
	#include Duik16_rigging.jsxinc
	#include Duik16_animation.jsxinc
	#include Duik16_camera.jsxinc
	#include Duik16_io.jsxinc
	#include Duik16_settings.jsxinc
	#include Duik16_help.jsxinc

	//=== CONNECT EVENTS ===

	//top left tools
	ui_notesButton.onClick = ui_notesButton_clicked;
	ui_calcButton.onClick = ui_calcButton_clicked;
	//tabs
	ui_riggingButton.onClick = function(){setCurrentPanel(5)};
	ui_animationButton.onClick = function(){setCurrentPanel(4)};
	ui_cameraButton.onClick = function(){setCurrentPanel(3)};
	ui_ioButton.onClick = function(){setCurrentPanel(2)};
	ui_settingsButton.onClick = function(){setCurrentPanel(1)};
	ui_helpButton.onClick = function(){setCurrentPanel(0)};

	//bottom
	ui_bottomGroup.addEventListener('mousedown',ui_bottomGroup_clicked,true);

	//=== INIT ===
	setCurrentPanel();
	DuAEF.DuScriptUI.showUI(ui_palette);

})(this);
