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
	var version = '16.0.1-Alpha-10';
	//=========================
	#include DuAEF.jsxinc
	#include Duik16_shared.jsxinc


	//============= INIT ==============

	#include Duik16_init.jsxinc

	//============= ICONS =============

	#include 'Duik16_w14icons.jsxinc'
	#include 'Duik16_w18icons.jsxinc'
	#include 'Duik16_w25icons.jsxinc'
	#include 'Duik16_w32icons.jsxinc'
	#include 'Duik16_illustrations.jsxinc'

	debugLog.checkTimer("Icons created");

	//========== MODULES =============

	#include Duik16_notes.jsxinc
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

		//reinit panels
		initRiggingUI();
		initAnimationUI();
		initIOUI();
		initCameraUI();

		ui_riggingGroup.visible = panel == 5;
		ui_riggingButton.setChecked(ui_riggingGroup.visible);
		ui_animationMainGroup.visible = panel == 4;
		ui_animationButton.setChecked(ui_animationMainGroup.visible);
		ui_cameraGroup.visible = panel == 3;
		ui_cameraButton.setChecked(ui_cameraGroup.visible);
		ui_ioGroup.visible = panel == 2;
		ui_ioButton.setChecked(ui_ioGroup.visible);
		ui_settingsGroup.visible = panel == 1;
		ui_settingsButton.setChecked(ui_settingsGroup.visible);

		//save settings
		if (panel != 1 && panel != 0) settings.data.currentPanel = panel;
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

	//HELP
	#include Duik16_helpStrings.jsxinc

	debugLog.checkTimer("Building UI");

	//main palette
	var ui_palette = DuAEF.DuScriptUI.createUI(obj,'Duik Bassel');

	//layout
	var ui_topGroup = DuAEF.DuScriptUI.addGroup(ui_palette);
	DuAEF.DuScriptUI.setBackgroundColor(ui_topGroup,DuAEF.DuJS.Color.Colors.VERY_DARK_GREY);
	//DuAEF.DuScriptUI.addSeparator(ui_palette);
	var ui_mainGroup = DuAEF.DuScriptUI.addGroup(ui_palette,'stack');
	ui_mainGroup.alignment = ['fill','top'];
	var ui_bottomGroup = DuAEF.DuScriptUI.addGroup(ui_palette);
	ui_bottomGroup.alignment = ['fill','bottom'];

	//=== TOP LEFT TOOLS ===

	var ui_notesButton = DuAEF.DuScriptUI.addImageButton(ui_topGroup,'',DuAEF.DuBinary.toFile(w18_notes_l),"Simple notepad, with auto-save.",DuAEF.DuBinary.toFile(w18_notes_r));
	var ui_calcButton = DuAEF.DuScriptUI.addImageButton(ui_topGroup,'',DuAEF.DuBinary.toFile(w18_smallcalc_l),"Calculator",DuAEF.DuBinary.toFile(w18_smallcalc_r));

	//=== TOP RIGHT TOOLS ===

	var ui_tabsGroup = DuAEF.DuScriptUI.addGroup(ui_topGroup,'row');
	ui_tabsGroup.alignment = ['right','center'];
	var ui_riggingButton = DuAEF.DuScriptUI.addImageCheckBox(ui_tabsGroup,'',DuAEF.DuBinary.toFile(w18_rig_l),"Rigging",DuAEF.DuBinary.toFile(w18_rig_r));
	var ui_animationButton = DuAEF.DuScriptUI.addImageCheckBox(ui_tabsGroup,'',DuAEF.DuBinary.toFile(w18_kbez_l),"Animation",DuAEF.DuBinary.toFile(w18_kbez_r));
	var ui_cameraButton = DuAEF.DuScriptUI.addImageCheckBox(ui_tabsGroup,'',DuAEF.DuBinary.toFile(w18_camera_l),"Camera",DuAEF.DuBinary.toFile(w18_camera_r));
	var ui_ioButton = DuAEF.DuScriptUI.addImageCheckBox(ui_tabsGroup,'',DuAEF.DuBinary.toFile(w18_io_l),"I/O Tools",DuAEF.DuBinary.toFile(w18_io_r));
	var ui_settingsButton = DuAEF.DuScriptUI.addImageCheckBox(ui_tabsGroup,'',DuAEF.DuBinary.toFile(w18_settings_l),"Settings",DuAEF.DuBinary.toFile(w18_settings_r));
	var ui_helpButton = DuAEF.DuScriptUI.addImageButton(ui_tabsGroup,'',DuAEF.DuBinary.toFile(w18_help_l),"Help | About",DuAEF.DuBinary.toFile(w18_help_r));
	ui_helpButton.setHelp('Duik Bassel (v' + version + ')',helpHelp,'https://github.com/Rainbox-dev/DuAEF_Duik/wiki/Duik-User-Guide');

	//=== BOTTOM ===

	var ui_rainboxURL = ui_bottomGroup.add ('statictext',undefined,'rainboxprod.coop');
	ui_rainboxURL.alignment = ['left','bottom'];
	if (settings.data.debug)
	{
		var refreshButton = ui_bottomGroup.add('button',undefined,'R');
		refreshButton.alignment = ['right','bottom'];
		refreshButton.maximumSize = [20, 20];
		refreshButton.onClick = function () { ui_palette.refreshUI( thisScriptFile ); };
	}

	//=== PANELS ===

	#include Duik16_rigging.jsxinc
	#include Duik16_animation.jsxinc
	#include Duik16_camera.jsxinc
	#include Duik16_io.jsxinc
	#include Duik16_settings.jsxinc

	//=== HELP PANEL ===
	DuAEF.DuScriptUI.helpPanel.text = 'Duik Bassel ' + "help";

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
	ui_helpButton.onClick = function(){ DuAEF.DuScriptUI.helpPanel.show(); };

	//bottom
	ui_rainboxURL.addEventListener('mousedown',ui_bottomGroup_clicked,true);

	//=== INIT ===
	setCurrentPanel();
	debugLog.checkTimer("Showing UI");
	DuAEF.DuScriptUI.showUI(ui_palette);

	debugLog.checkTimer("Duik successfully loaded.");
})(this);
