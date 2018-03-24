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
	var version = '16.0.1-Alpha-7';
	//=========================
	#include DuAEF.jsxinc
	#include Duik16_shared.jsxinc

	//=========== SETTINGS ===========

	var settingsFile;
	if (app.settings.haveSetting("Duik","settingsFile")) settingsFile = new File(app.settings.getSetting("Duik","settingsFile"));
	var settings = new DuSettings("Duik",settingsFile);
	//TODO get the version of Duik, update settings if changed
	settings.data.duikVersion = version;
	//set settings if new
	if (settings.data.uiMode == undefined) settings.data.uiMode = 0;
	if (settings.data.debug == undefined) settings.data.debug = false;
	DuAEF.debug = settings.data.debug;

	//create Debug log
	var settingsPath = settings.file.path;
	var debugLog = new DebugLog(settingsPath + '/Duik_debug_log.txt');
	debugLog.startTimer("Loading Duik");

	//this file
	var thisScriptFile = new File($.fileName);


	//============= ICONS =============

	#include 'icons/w14_plus_r.jsxinc'
	#include 'icons/w14_plus_m.jsxinc'
	#include 'icons/w14_edit_r.jsxinc'
	#include 'icons/w14_edit_m.jsxinc'
	#include 'icons/w14_check_r.jsxinc'
	#include 'icons/w14_cancel_l.jsxinc'
	#include 'icons/w14_check_g.jsxinc'
	#include 'icons/w14_check_l.jsxinc'
	#include 'icons/w18_keyeyedropper_r.jsxinc'
	#include 'icons/w18_keyeyedropper_l.jsxinc'
	#include 'icons/w14_chain_r.jsxinc'
	#include 'icons/w14_unchained_l.jsxinc'
	#include 'icons/w14_chain_l.jsxinc'
	#include 'icons/w14_switch_r.jsxinc'
	#include 'icons/w14_switch_l.jsxinc'

	#include 'icons/w18_help_r.jsxinc'
	#include 'icons/w18_help_l.jsxinc'
	#include 'icons/w18_settings_r.jsxinc'
	#include 'icons/w18_settings_l.jsxinc'
	#include 'icons/w18_io_r.jsxinc'
	#include 'icons/w18_io_l.jsxinc'
	#include 'icons/w18_camera_r.jsxinc'
	#include 'icons/w18_camera_l.jsxinc'
	#include 'icons/w18_kbez_r.jsxinc'
	#include 'icons/w18_kbez_l.jsxinc'
	#include 'icons/w18_rig_r.jsxinc'
	#include 'icons/w18_rig_l.jsxinc'
	#include 'icons/w18_smallcalc_r.jsxinc'
	#include 'icons/w18_smallcalc_l.jsxinc'
	#include 'icons/w18_notes_r.jsxinc'
	#include 'icons/w18_notes_l.jsxinc'
	#include 'icons/w18_bezierik_r.jsxinc'
	#include 'icons/w18_bezierik_l.jsxinc'
	#include 'icons/w18_random_r.jsxinc'
	#include 'icons/w18_random_l.jsxinc'
	#include 'icons/w18_check_g.jsxinc'
	#include 'icons/w18_check_m.jsxinc'
	#include 'icons/w18_close_r.jsxinc'
	#include 'icons/w18_close_l.jsxinc'
	#include 'icons/w18_save_r.jsxinc'
	#include 'icons/w18_save_l.jsxinc'
	#include 'icons/w18_zero_r.jsxinc'
	#include 'icons/w18_zero_l.jsxinc'
	#include 'icons/w18_list_r.jsxinc'
	#include 'icons/w18_list_l.jsxinc'
	#include 'icons/w18_randomkeytime_r.jsxinc'
	#include 'icons/w18_randomkeytime_l.jsxinc'
	#include 'icons/w18_randomlayerout_r.jsxinc'
	#include 'icons/w18_randomlayerout_l.jsxinc'
	#include 'icons/w18_randomlayerin_r.jsxinc'
	#include 'icons/w18_randomlayerin_l.jsxinc'
	#include 'icons/w18_randomlayerindex_r.jsxinc'
	#include 'icons/w18_randomlayerindex_l.jsxinc'
	#include 'icons/w18_randomlayerstarttime_r.jsxinc'
	#include 'icons/w18_randomlayerstarttime_l.jsxinc'
	#include 'icons/w18_randomize_r.jsxinc'
	#include 'icons/w18_randomize_l.jsxinc'
	#include 'icons/w18_bezierik_r.jsxinc'
	#include 'icons/w18_bezierik_l.jsxinc'
	#include 'icons/w18_ik_r.jsxinc'
	#include 'icons/w18_ik_l.jsxinc'
	#include 'icons/w18_curvebezlin_r.jsxinc'
	#include 'icons/w18_curvebezlin_l.jsxinc'
	#include 'icons/w18_curvelinbez_r.jsxinc'
	#include 'icons/w18_curvelinbez_l.jsxinc'
	#include 'icons/w18_curvebez_r.jsxinc'
	#include 'icons/w18_curvebez_l.jsxinc'
	#include 'icons/w18_curvelin_r.jsxinc'
	#include 'icons/w18_curvelin_l.jsxinc'
	#include 'icons/w18_check_r.jsxinc'
	#include 'icons/w18_simpleminus_r.jsxinc'
	#include 'icons/w18_simpleminus_l.jsxinc'
	#include 'icons/w18_simpleplus_r.jsxinc'
	#include 'icons/w18_simpleplus_l.jsxinc'
	#include 'icons/w18_khold_r.jsxinc'
	#include 'icons/w18_khold_l.jsxinc'
	#include 'icons/w18_kauto_r.jsxinc'
	#include 'icons/w18_kauto_l.jsxinc'
	#include 'icons/w18_koutbez_r.jsxinc'
	#include 'icons/w18_koutbez_l.jsxinc'
	#include 'icons/w18_kinbez_r.jsxinc'
	#include 'icons/w18_kinbez_l.jsxinc'
	#include 'icons/w18_klin_r.jsxinc'
	#include 'icons/w18_klin_l.jsxinc'
	#include 'icons/w18_kroving_r.jsxinc'
	#include 'icons/w18_kroving_l.jsxinc'
	#include 'icons/w18_pos_l.png.jsxinc'
	#include 'icons/w18_pos_r.png.jsxinc'
	#include 'icons/w18_rotation_l.png.jsxinc'
	#include 'icons/w18_rotation_r.png.jsxinc'
	#include 'icons/w18_scale_l.png.jsxinc'
	#include 'icons/w18_scale_r.png.jsxinc'
	#include 'icons/w18_opacity_l.png.jsxinc'
	#include 'icons/w18_opacity_r.png.jsxinc'
	#include 'icons/w18_mask_l.png.jsxinc'
	#include 'icons/w18_mask_r.png.jsxinc'
	#include 'icons/w18_fx_l.png.jsxinc'
	#include 'icons/w18_fx_r.png.jsxinc'
	#include 'icons/w18_shape_l.png.jsxinc'
	#include 'icons/w18_shape_r.png.jsxinc'
	#include 'icons/w18_allproperties_l.png.jsxinc'
	#include 'icons/w18_allproperties_r.png.jsxinc'

	#include 'icons/w25_plantigrade_r.jsxinc'
	#include 'icons/w25_plantigrade_l.jsxinc'
	#include 'icons/w25_ungulate_r.jsxinc'
	#include 'icons/w25_ungulate_l.jsxinc'
	#include 'icons/w25_digitigrade_r.jsxinc'
	#include 'icons/w25_digitigrade_l.jsxinc'
	#include 'icons/w25_filledhand_r.jsxinc'
	#include 'icons/w25_filledhand_l.jsxinc'
	#include 'icons/w25_check_r.jsxinc'
	#include 'icons/w25_check_g.jsxinc'
	#include 'icons/w25_back_r.jsxinc'
	#include 'icons/w25_back_m.jsxinc'
	#include 'icons/w25_structurehide_r.jsxinc'
	#include 'icons/w25_structureshow_l.jsxinc'
	#include 'icons/w25_structureedit_r.jsxinc'
	#include 'icons/w25_structureedit_l.jsxinc'
	#include 'icons/w25_structureget_r.jsxinc'
	#include 'icons/w25_structureget_l.jsxinc'
	#include 'icons/w25_selectedelement_r.jsxinc'
	#include 'icons/w25_selectedelement_l.jsxinc'
	#include 'icons/w25_selectedchildren_r.jsxinc'
	#include 'icons/w25_selectedchildren_l.jsxinc'
	#include 'icons/w25_selectedchain_r.jsxinc'
	#include 'icons/w25_selectedchain_l.jsxinc'
	#include 'icons/w25_allstructures_r.jsxinc'
	#include 'icons/w25_allstructures_l.jsxinc'
	#include 'icons/w25_code_r.jsxinc'
	#include 'icons/w25_code_l.jsxinc'
	#include 'icons/w25_beer_r.png.jsxinc'
	#include 'icons/w25_beer_l.png.jsxinc'
	#include 'icons/w25_cofee_l.png.jsxinc'
	#include 'icons/w25_cofee_r.png.jsxinc'
	#include 'icons/w25_language_m.jsxinc'
	#include 'icons/w25_tools_r.jsxinc'
	#include 'icons/w25_tools_l.jsxinc'
	#include 'icons/w25_vulcanhand_r.jsxinc'
	#include 'icons/w25_automation_r.jsxinc'
	#include 'icons/w25_automation_l.jsxinc'
	#include 'icons/w25_constraint_r.jsxinc'
	#include 'icons/w25_constraint_l.jsxinc'
	#include 'icons/w25_rig_r.jsxinc'
	#include 'icons/w25_rig_l.jsxinc'
	#include 'icons/w25_audition_r.jsxinc'
	#include 'icons/w25_audition_l.jsxinc'
	#include 'icons/w25_exportrig_r.jsxinc'
	#include 'icons/w25_exportrig_l.jsxinc'
	#include 'icons/w25_exportanim_r.jsxinc'
	#include 'icons/w25_exportanim_l.jsxinc'
	#include 'icons/w25_tvpcam_r.jsxinc'
	#include 'icons/w25_tvpcam_l.jsxinc'
	#include 'icons/w25_tvpclip_r.jsxinc'
	#include 'icons/w25_tvpclip_l.jsxinc'
	#include 'icons/w25_importrig_r.jsxinc'
	#include 'icons/w25_importrig_l.jsxinc'
	#include 'icons/w25_importanim_r.jsxinc'
	#include 'icons/w25_importanim_l.jsxinc'
	#include 'icons/w25_head_r.jsxinc'
	#include 'icons/w25_head_l.jsxinc'
	#include 'icons/w25_angle_r.jsxinc'
	#include 'icons/w25_angle_l.jsxinc'
	#include 'icons/w25_doubleslider_r.jsxinc'
	#include 'icons/w25_doubleslider_l.jsxinc'
	#include 'icons/w25_slider_r.jsxinc'
	#include 'icons/w25_slider_l.jsxinc'
	#include 'icons/w25_filmcam_r.jsxinc'
	#include 'icons/w25_filmcam_l.jsxinc'
	#include 'icons/w25_eye_r.jsxinc'
	#include 'icons/w25_eye_l.jsxinc'
	#include 'icons/w25_transform_r.jsxinc'
	#include 'icons/w25_transform_l.jsxinc'
	#include 'icons/w25_pos_r.jsxinc'
	#include 'icons/w25_pos_l.jsxinc'
	#include 'icons/w25_ypos_r.jsxinc'
	#include 'icons/w25_ypos_l.jsxinc'
	#include 'icons/w25_xpos_r.jsxinc'
	#include 'icons/w25_xpos_l.jsxinc'
	#include 'icons/w25_rotation_r.jsxinc'
	#include 'icons/w25_rotation_l.jsxinc'
	#include 'icons/w25_hidehand_r.jsxinc'
	#include 'icons/w25_showhand_l.jsxinc'
	#include 'icons/w25_handeyedropper_r.jsxinc'
	#include 'icons/w25_handeyedropper_l.jsxinc'
	#include 'icons/w25_check_l.jsxinc'
	#include 'icons/w25_orientationconstraint_r.jsxinc'
	#include 'icons/w25_orientationconstraint_l.jsxinc'
	#include 'icons/w25_positionconstraint_r.jsxinc'
	#include 'icons/w25_positionconstraint_l.jsxinc'
	#include 'icons/w25_pathconstraint_r.jsxinc'
	#include 'icons/w25_pathconstraint_l.jsxinc'
	#include 'icons/w25_parent_r.jsxinc'
	#include 'icons/w25_parent_l.jsxinc'
	#include 'icons/w25_skin_r.jsxinc'
	#include 'icons/w25_skin_l.jsxinc'
	#include 'icons/w25_bezierik_r.jsxinc'
	#include 'icons/w25_bezierik_l.jsxinc'
	#include 'icons/w25_ik_r.jsxinc'
	#include 'icons/w25_ik_l.jsxinc'
	#include 'icons/w25_cancel_r.jsxinc'
	#include 'icons/w25_cancel_m.jsxinc'
	#include 'icons/w25_paintrig_r.jsxinc'
	#include 'icons/w25_paintrig_l.jsxinc'
	#include 'icons/w25_moveaway_r.jsxinc'
	#include 'icons/w25_moveaway_l.jsxinc'
	#include 'icons/w25_blink_r.jsxinc'
	#include 'icons/w25_blink_l.jsxinc'
	#include 'icons/w25_spring_r.jsxinc'
	#include 'icons/w25_spring_l.jsxinc'
	#include 'icons/w25_effector_r.jsxinc'
	#include 'icons/w25_effector_l.jsxinc'
	#include 'icons/w25_proceduralwalk_r.jsxinc'
	#include 'icons/w25_proceduralwalk_l.jsxinc'
	#include 'icons/w25_randomize_r.jsxinc'
	#include 'icons/w25_randomize_l.jsxinc'
	#include 'icons/w25_wheel_r.jsxinc'
	#include 'icons/w25_wheel_l.jsxinc'
	#include 'icons/w25_swing_r.jsxinc'
	#include 'icons/w25_swing_l.jsxinc'
	#include 'icons/w25_wiggle_r.jsxinc'
	#include 'icons/w25_wiggle_l.jsxinc'
	#include 'icons/w25_list_r.jsxinc'
	#include 'icons/w25_list_l.jsxinc'
	#include 'icons/w25_aelayers_l.png.jsxinc'
	#include 'icons/w25_aelayers_r.png.jsxinc'
	#include 'icons/w25_pin_l.png.jsxinc'
	#include 'icons/w25_pin_r.png.jsxinc'
	#include 'icons/w25_items_l.png.jsxinc'
	#include 'icons/w25_items_r.png.jsxinc'
	#include 'icons/w25_comp_l.png.jsxinc'
	#include 'icons/w25_comp_r.png.jsxinc'
	#include 'icons/w25_project_r.png.jsxinc'
	#include 'icons/w25_project_l.png.jsxinc'
	#include 'icons/w25_text_l.png.jsxinc'
	#include 'icons/w25_text_r.png.jsxinc'
	#include 'icons/w25_footage_l.png.jsxinc'
	#include 'icons/w25_footage_r.png.jsxinc'
	#include 'icons/w25_folder_l.png.jsxinc'
	#include 'icons/w25_folder_r.png.jsxinc'
	#include 'icons/w25_allitems_l.png.jsxinc'
	#include 'icons/w25_allitems_r.png.jsxinc'
	#include 'icons/w25_selecteditems_r.png.jsxinc'
	#include 'icons/w25_selecteditems_l.png.jsxinc'
	#include 'icons/w25_casesensitive_l.png.jsxinc'
	#include 'icons/w25_caseinsensitive_r.png.jsxinc'
	#include 'icons/w25_casesensitive_r.png.jsxinc'
	#include 'icons/w25_caseinsensitive_l.png.jsxinc'
	#include 'icons/w25_alllayers_l.png.jsxinc'
	#include 'icons/w25_alllayers_r.png.jsxinc'
	#include 'icons/w25_onion_r.jsxinc'
	#include 'icons/w25_onion_l.jsxinc'
	#include 'icons/w25_newcel_r.jsxinc'
	#include 'icons/w25_newcel_l.jsxinc'
	#include 'icons/w25_singlelayer_l.jsxinc'
	#include 'icons/w25_singlelayer_r.jsxinc'
	#include 'icons/w25_layers_l.png.jsxinc'
	#include 'icons/w25_layers_r.png.jsxinc'
	#include 'icons/w25_cel_r.jsxinc'
	#include 'icons/w25_cel_l.jsxinc'
	#include 'icons/w25_timeremap_r.jsxinc'
	#include 'icons/w25_timeremap_l.jsxinc'
	#include 'icons/w25_exposure_r.jsxinc'
	#include 'icons/w25_exposure_l.jsxinc'
	#include 'icons/w25_anim_r.jsxinc'
	#include 'icons/w25_anim_l.jsxinc'
	#include 'icons/w25_paste_r.jsxinc'
	#include 'icons/w25_paste_l.jsxinc'
	#include 'icons/w25_copy_r.jsxinc'
	#include 'icons/w25_copy_l.jsxinc'
	#include 'icons/w25_magic_r.jsxinc'
	#include 'icons/w25_magic_l.jsxinc'
	#include 'icons/w25_easeend_r.jsxinc'
	#include 'icons/w25_easeend_l.jsxinc'
	#include 'icons/w25_linend_l.jsxinc'
	#include 'icons/w25_easestart_r.jsxinc'
	#include 'icons/w25_easestart_l.jsxinc'
	#include 'icons/w25_linstart_l.jsxinc'
	#include 'icons/w25_selectkey_r.jsxinc'
	#include 'icons/w25_selectkey_l.jsxinc'
	#include 'icons/w25_selectedlayers_r.png.jsxinc'
	#include 'icons/w25_selectedlayers_l.png.jsxinc'
	#include 'icons/w25_time_r.png.jsxinc'
	#include 'icons/w25_time_l.png.jsxinc'
	#include 'icons/w25_timerange_l.png.jsxinc'
	#include 'icons/w25_timerange_r.png.jsxinc'
	#include 'icons/w25_update_r.png.jsxinc'
	#include 'icons/w25_update_l.png.jsxinc'
	#include 'icons/w25_eyedropper_r.png.jsxinc'
	#include 'icons/w25_eyedropper_l.png.jsxinc'
	#include 'icons/w25_opacity_l.png.jsxinc'
	#include 'icons/w25_opacity_r.png.jsxinc'
	#include 'icons/w25_allproperties_l.png.jsxinc'
	#include 'icons/w25_allproperties_r.png.jsxinc'
	#include 'icons/w25_animtools_r.png.jsxinc'
	#include 'icons/w25_animtools_l.png.jsxinc'
	#include 'icons/w25_broom_l.png.jsxinc'
	#include 'icons/w25_broom_r.png.jsxinc'
	#include 'icons/w25_storyboard_r.png.jsxinc'
	#include 'icons/w25_storyboard_l.png.jsxinc'
	#include 'icons/w25_import_l.png.jsxinc'
	#include 'icons/w25_import_r.png.jsxinc'
	#include 'icons/w25_exportfile_l.png.jsxinc'
	#include 'icons/w25_exportfile_r.png.jsxinc'
	#include 'icons/w25_updatecode_r.png.jsxinc'
	#include 'icons/w25_updatecode_l.png.jsxinc'
	#include 'icons/w25_parenttocam_l.png.jsxinc'
	#include 'icons/w25_parenttocam_r.png.jsxinc'
	#include 'icons/w25_absolute_l.png.jsxinc'
	#include 'icons/w25_absolute_r.png.jsxinc'
	#include 'icons/w25_hips_r.png.jsxinc'
	#include 'icons/w25_hips_l.png.jsxinc'
	#include 'icons/w25_body_r.png.jsxinc'
	#include 'icons/w25_body_l.png.jsxinc'
	#include 'icons/w25_shoulders_r.png.jsxinc'
	#include 'icons/w25_shoulders_l.png.jsxinc'
	#include 'icons/w25_foxtail_l.png.jsxinc'
	#include 'icons/w25_foxtail_r.png.jsxinc'
	#include 'icons/w25_fk_r.png.jsxinc'
	#include 'icons/w25_fk_l.png.jsxinc'
	#include 'icons/w25_babybottle_l.png.jsxinc'
	#include 'icons/w25_babybottle_r.png.jsxinc'
	#include 'icons/w25_ikfk_r.png.jsxinc'
	#include 'icons/w25_ikfk_l.png.jsxinc'
	#include 'icons/w25_ik2fk_r.png.jsxinc'
	#include 'icons/w25_ik2fk_l.png.jsxinc'
	#include 'icons/w25_fk2ik_r.png.jsxinc'
	#include 'icons/w25_fk2ik_l.png.jsxinc'


	#include 'icons/w32_autorig_r.jsxinc'
	#include 'icons/w32_autorig_l.jsxinc'
	#include 'icons/w32_bone_r.jsxinc'
	#include 'icons/w32_bone_l.jsxinc'
	#include 'icons/w32_tail_r.jsxinc'
	#include 'icons/w32_tail_l.jsxinc'
	#include 'icons/w32_spine_r.jsxinc'
	#include 'icons/w32_spine_l.jsxinc'
	#include 'icons/w32_leg_r.jsxinc'
	#include 'icons/w32_leg_l.jsxinc'
	#include 'icons/w32_arm_r.jsxinc'
	#include 'icons/w32_arm_l.jsxinc'
	#include 'icons/w32_measure_r.jsxinc'
	#include 'icons/w32_measure_l.jsxinc'
	#include 'icons/w32_searchreplace_r.jsxinc'
	#include 'icons/w32_searchreplace_l.jsxinc'
	#include 'icons/w32_rename_r.jsxinc'
	#include 'icons/w32_rename_l.jsxinc'
	#include 'icons/w32_settingsfile_r.jsxinc'
	#include 'icons/w32_settingsfile_l.jsxinc'
	#include 'icons/w32_pickproperty_r.jsxinc'
	#include 'icons/w32_pickproperty_l.jsxinc'
	#include 'icons/w32_pickpath_r.jsxinc'
	#include 'icons/w32_pickpath_l.jsxinc'
	#include 'icons/w32_target_r.jsxinc'
	#include 'icons/w32_target_l.jsxinc'
	#include 'icons/w32_constraint_r.jsxinc'
	#include 'icons/w32_constraint_l.jsxinc'
	#include 'icons/w32_tvpcam_r.jsxinc'
	#include 'icons/w32_tvpcam_l.jsxinc'
	#include 'icons/w32_2dcamera_r.jsxinc'
	#include 'icons/w32_2dcamera_l.jsxinc'
	#include 'icons/w32_zlink_r.jsxinc'
	#include 'icons/w32_zlink_l.jsxinc'
	#include 'icons/w32_camerarig_r.jsxinc'
	#include 'icons/w32_camerarig_l.jsxinc'
	#include 'icons/w32_individualcontrol_r.png.jsxinc'
	#include 'icons/w32_individualcontrol_l.png.jsxinc'
	#include 'icons/w32_batchcontrol_l.png.jsxinc'
	#include 'icons/w32_batchcontrol_r.png.jsxinc'
	#include 'icons/w32_separatedimensions_l.png.jsxinc'
	#include 'icons/w32_separatedimensions_r.png.jsxinc'
	#include 'icons/w32_collapsedimensions_l.png.jsxinc'
	#include 'icons/w32_collapsedimensions_r.png.jsxinc'
	#include 'icons/w32_nextframe_r.jsxinc'
	#include 'icons/w32_nextframe_l.jsxinc'
	#include 'icons/w32_previousframe_r.jsxinc'
	#include 'icons/w32_previousframe_l.jsxinc'
	#include 'icons/w32_loopout_r.jsxinc'
	#include 'icons/w32_loopout_l.jsxinc'
	#include 'icons/w32_loopin_r.jsxinc'
	#include 'icons/w32_loopin_l.jsxinc'
	#include 'icons/w32_detectexposure_r.jsxinc'
	#include 'icons/w32_detectexposure_l.jsxinc'
	#include 'icons/w32_selectedlayers_r.png.jsxinc'
	#include 'icons/w32_selectedlayers_l.png.jsxinc'
	#include 'icons/w32_alllayers_l.png.jsxinc'
	#include 'icons/w32_alllayers_r.png.jsxinc'
	#include 'icons/w32_layerindex_r.png.jsxinc'
	#include 'icons/w32_layerindex_l.png.jsxinc'
	#include 'icons/w32_layername_l.png.jsxinc'
	#include 'icons/w32_layername_r.png.jsxinc'
	#include 'icons/w32_addlayer_r.png.jsxinc'
	#include 'icons/w32_addlayer_l.png.jsxinc'
	#include 'icons/w32_selectlayer_l.png.jsxinc'
	#include 'icons/w32_selectlayer_r.png.jsxinc'
	#include 'icons/w32_noprecomp_l.png.jsxinc'
	#include 'icons/w32_noprecomp_r.png.jsxinc'
	#include 'icons/w32_overlaytext_l.png.jsxinc'
	#include 'icons/w32_overlaytext_r.png.jsxinc'
	#include 'icons/w32_precompshots_l.png.jsxinc'
	#include 'icons/w32_precompshots_r.png.jsxinc'
	#include 'icons/w32_textbelow_l.png.jsxinc'
	#include 'icons/w32_textbelow_r.png.jsxinc'
	#include 'icons/w32_linkcameralayers_r.png.jsxinc'
	#include 'icons/w32_linkcameralayers_l.png.jsxinc'
	#include 'icons/w32_numlayers_r.png.jsxinc'
	#include 'icons/w32_numlayers_l.png.jsxinc'
	#include 'icons/w32_createcam_l.png.jsxinc'
	#include 'icons/w32_createcam_r.png.jsxinc'
	#include 'icons/w32_precompose_l.png.jsxinc'
	#include 'icons/w32_precompose_r.png.jsxinc'
	#include 'icons/w32_selectcam_l.png.jsxinc'
	#include 'icons/w32_selectcam_r.png.jsxinc'
	#include 'icons/w32_moveanchor_l.png.jsxinc'
	#include 'icons/w32_moveanchor_r.png.jsxinc'
	#include 'icons/w32_pos_l.png.jsxinc'
	#include 'icons/w32_pos_r.png.jsxinc'
	#include 'icons/w32_randomize_r.png.jsxinc'
	#include 'icons/w32_randomize_l.png.jsxinc'
	#include 'icons/w32_klin_r.png.jsxinc'
	#include 'icons/w32_klin_l.png.jsxinc'
	#include 'icons/w32_aelayers_r.png.jsxinc'
	#include 'icons/w32_aelayers_l.png.jsxinc'

	#include 'icons/illustrations_tail.jsxinc'
	#include 'icons/illustrations_spine.jsxinc'
	#include 'icons/illustrations_unguleg.jsxinc'
	#include 'icons/illustrations_digitileg.jsxinc'
	#include 'icons/illustrations_plantileg.jsxinc'
	#include 'icons/illustrations_plantifrontleg.jsxinc'
	#include 'icons/illustrations_unguarm.jsxinc'
	#include 'icons/illustrations_digitiarm.jsxinc'
	#include 'icons/illustrations_plantiarm.jsxinc'

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
		ui_helpGroup.visible = panel == 0;
		ui_helpButton.setChecked(ui_helpGroup.visible);

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

	debugLog.checkTimer("Building UI");

	//main palette
	var ui_palette = DuAEF.DuScriptUI.createUI(obj,'Duik 16');

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
	var ui_helpButton = DuAEF.DuScriptUI.addImageCheckBox(ui_tabsGroup,'',DuAEF.DuBinary.toFile(w18_help_l),"Help | About",DuAEF.DuBinary.toFile(w18_help_r));

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
	ui_rainboxURL.addEventListener('mousedown',ui_bottomGroup_clicked,true);

	//=== INIT ===
	setCurrentPanel();
	debugLog.checkTimer("Showing UI");
	DuAEF.DuScriptUI.showUI(ui_palette);

	debugLog.checkTimer("Duik successfully loaded.");

})(this);
