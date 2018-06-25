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
	var version = '16.0.0-RC1';
	//=========================

	#include DuAEF.jsxinc
	#include Duik16_shared.jsxinc

	//============= INIT ==============

	//UI
	//main palette
	var ui_mainPalette = DuAEF.DuScriptUI.createUI(obj,'Duik Bassel', ['fill','fill']);
	ui_mainPalette.contents.orientation = 'stack';

	//this file
	var thisScriptFile = new File($.fileName);

	//INIT
	#include Duik16_init.jsxinc

	//CREATE UI
	#include Duik16_mainUI.jsxinc

})(this);
