/*
Duik - Duduf IK Tools
Copyright (c) 2008 - 2014 Nicolas Dufresne
http://ik.duduf.fr
http://ik.duduf.com

Many thanks to :
Kevin Schires - including the images needed by Duik directly in the Script
Eric Epstein - making the IK's work with 3D Layers
Zeg - designing the buttons

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


function fnDuIK(thisObj)
{
	//=========================
	var version = "15.alpha09";
	//=========================

	//=================================
	//========= LOAD TRANSLATIONS =====
	//=================================
	#include "Duik_translations.jsxinc"

	//=================================
	//======== DUIK PALETTE ===========
	//=================================
	var palette = (thisObj instanceof Panel) ? thisObj : new Window("palette","Duik",undefined, {resizeable:true});
	palette.orientation = "stack";
	palette.alignChildren = ["fill","fill"];
	
	//=================================
	//== DUIK NEEDS TO WRITE FILES ====
	//=================================
	{
		if (app.preferences.getPrefAsLong("Main Pref Section","Pref_SCRIPTING_FILE_NETWORK_SECURITY") != 1)
		{		
			function dialog_preferences_general()
			{
				//	Valide au moins depuis CS4,
				app.executeCommand(2359);
			}

			var wfGroup = palette.add("group");
			wfGroup.orientation = "column";
			wfGroup.alignChildren = ["fill","fill"];
			var versionBox = wfGroup.add("statictext",undefined,"Duik v" + version);
			versionBox.alignment = ["center","top"];
			var warningBox = wfGroup.add("statictext",undefined,"temp",{multiline:true});
			warningBox.text = "----- INSTALLATION ---\nDuik needs to be allowed to write files to display its buttons, and to access the network to check for updates.\n------------------------------\n\nPlease, check the box called 'Allow Scripts to write files...' in the general preferences of After Effects.";
			warningBox.minimumSize = [150,150];
			warningBox.alignment = ["center","top"];
			var prefButton = wfGroup.add("button",undefined,"Open General Preferences");
			prefButton.onClick = function ()
			{
				dialog_preferences_general();
				if (app.preferences.getPrefAsLong("Main Pref Section","Pref_SCRIPTING_FILE_NETWORK_SECURITY") == 1)
				{
					wfGroup.hide();
					preloadDuik();
				}
			}
			prefButton.alignment =  ["center","top"];
		}
		else
		{
			preloadDuik();
		}
	}
	
	//=================================
	//======== APP.SETTINGS ===========
	//=================================
	{
		if (! app.settings.haveSetting("duik", "lang")){app.settings.saveSetting("duik","lang","ENGLISH");}
		if (! app.settings.haveSetting("duik", "version")){app.settings.saveSetting("duik","version","oui");}
		if (! app.settings.haveSetting("duik", "notes")){app.settings.saveSetting("duik","notes","");}
		if (! app.settings.haveSetting("duik", "pano")){app.settings.saveSetting("duik","pano","0");}
		if (! app.settings.haveSetting("duik", "stretch")){app.settings.saveSetting("duik","stretch","true");}
		if (! app.settings.haveSetting("duik", "ikfk")){app.settings.saveSetting("duik","ikfk","true");}
	}
	
	//=================================
	//====== CHECK FOR UPDATES ========
	//=================================
	function checkForUpdate(version,showAlert)
	{
		var reply = "";
		//socket
		conn = new Socket;
		// se connecter à duduf.com
		if (conn.open ("www.duduf.com:80"))
		{
			// récupérer la version actuelle
			if (conn.writeln ("GET /downloads/duik/version.txt  HTTP/1.0\nHost: duduf.com\n"))
				reply = conn.read(1000);
			conn.close();
			//chercher la version dans la réponse du serveur :
			var reponse = reply.lastIndexOf("version",reply.length);
			if(reponse != -1)
			{
				newVersion = reply.slice(reponse+8,reply.length+1);
				if (showAlert && version != newVersion) alert(getMessage(2));
				return newVersion;
			}
		}
	}
	
	function preloadDuik ()
	{
		if (app.settings.getSetting("duik", "version") == "oui")
		{
			var newV = checkForUpdate(version,false);
			if ( version == newV || newV == undefined)
			{
				loadDuik();
			}
			else
			{
				var updGroup = palette.add("group");
				updGroup.orientation = "column";
				updGroup.alignChildren = ["center","top"];
				var updVersionBox = updGroup.add("statictext",undefined,"Duik current version: " + version);
				var updNewVersionBox = updGroup.add("statictext",undefined,"temp",{multiline:true});
				updNewVersionBox.text = "- UPDATE AVAILABLE -\n\nA new version of Duik is available!\nVersion: " + newV + "\n\nGo to http://duik.duduf.net to download it.";
				var updButton = updGroup.add("button",undefined,"Launch Duik");
				updButton.onClick = function ()
				{
					updGroup.hide();
					loadDuik();
				}
			}
		}
		else
		{
			loadDuik();
		}
	}
	
	function loadDuik()
	{
		//=================================
		//========== LOAD libDuik =========
		//=================================
		{
			#include "libduik.jsxinc"
			//if pseudo effects are not installed
			if (Duik.usePresets)
			{
				//PALETTE
				{
					var installGroup = palette.add("group");
					installGroup.orientation = "column";
					installGroup.alignChildren = ["fill","fill"];
					var versionBox = installGroup.add("statictext",undefined,"Duik v" + version);
					versionBox.alignment = ["center","top"];
					var paletteContent = installGroup.add("group");
					paletteContent.orientation = "stack";
					paletteContent.alignChildren = ["fill","fill"];
					//INSTALL COMPLETE GROUP
					var icGroup = paletteContent.add("group",undefined);
					icGroup.orientation = "column";
					icGroup.alignChildren = ["fill","fill"];
					var icText = icGroup.add("statictext",undefined,"",{multiline:true});
					icText.minimumSize = [150,60];
					icText.alignment = ["center","top"];
					icText.text = "-- INSTALLATION COMPLETE --\n\nAfter Effects must be restarted\r\nto complete the installation of Duik\n\nMay the god(s?) of animation be with you!\n\n-----------------------------";
					icGroup.visible = false;
					//MAC SET PERMISSIONS GROUP
					var mspGroup = paletteContent.add("group",undefined);
					mspGroup.orientation = "column";
					mspGroup.alignment = ["fill","fill"];
					mspGroup.alignChildren = ["fill","fill"];
					mspTitle = mspGroup.add("statictext",undefined,"temp",{multiline:true});
					mspTitle.alignment = ["center","top"];
					mspTitle.text = "You have to set permissions to presetEffects.xml to complete the installation of Duik";
					var mspTexts = mspGroup.add("group");
					mspTexts.orientation = "stack";
					mspTexts.alignment = ["center","top"];
					var mspText = mspTexts.add("statictext",undefined,"temp",{multiline:true});
					mspText.text = "• 1 - Right click on\n/Applications/Adobe After Effects/Adobe After Effects.app,\nSelect 'Show package contents'.";
					mspText.alignment = ["center","top"];
					var mspText2 = mspTexts.add("statictext",undefined,"temp",{multiline:true});
					mspText2.text = "• 2 - Right Click on\nContents/Resources/PresetEffects.xml,\nSelect 'Get Info'.";
					mspText2.alignment = ["center","top"];
					mspText2.visible = false;
					var mspText3 = mspTexts.add("statictext",undefined,"temp",{multiline:true});
					mspText3.text = "• 3 - At the bottom right of the window, unlock the access by clicking on the locker and entering your admin password.";
					mspText3.alignment = ["center","top"];
					mspText3.visible = false;
					var mspText4 = mspTexts.add("statictext",undefined,"temp",{multiline:true});
					mspText4.text = "• 4 - Finally, set 'Read & Write' access for 'Admin' and 'Everyone'.";
					mspText4.alignment = ["center","top"];
					mspText4.visible = false;
					var mspNavButtons = mspGroup.add("group");
					mspNavButtons.orientation = "row";
					mspNavButtons.alignment = ["center","top"];
					var mspPrevButton = mspNavButtons.add("button",undefined,"Previous");
					mspPrevButton.alignment = ["left","top"];
					mspPrevButton.enabled = false;
					var mspNextButton = mspNavButtons.add("button",undefined,"Next");
					mspNextButton.alignment = ["right","top"];
					mspContinueButton = mspGroup.add("button",undefined,"Continue installation...");
					mspContinueButton.alignment = ["center","top"];
					mspContinueButton.enabled = false;
					var mspTut = mspGroup.add("statictext",undefined,"",{multiline:true});
					mspTut.text = "• You can also watch this short tutorial by LLoyd Alvarez about how to set permissions to presetEffects.xml:\nhttp://youtu.be/HAkkmDYSVmg";		
					mspTut.alignment = ["center","top"];
					mspGroup.visible = false;
					//MANUAL INSTALL
					var mmGroup = paletteContent.add("group",undefined);
					mmGroup.orientation = "column";
					mmGroup.alignChildren = ["fill","fill"];
					var mmTexts = mmGroup.add("group");
					mmTexts.orientation = "stack";
					mmTexts.alignment = ["center","top"];
					var mmText = mmTexts.add("statictext",undefined,"",{multiline:true});
					mmText.alignment = ["center","top"];
					mmText.text = "It seems Duik can not automatically install the pseudo effects it needs.\n\nYou will have to manually install the pseudo effects needed by Duik.";
					var mmText2 = mmTexts.add("statictext",undefined,"",{multiline:true});
					mmText2.alignment = ["center","top"];
					mmText2.text = "• 1 - Open the file 'presetEffects.xml':\nRight click on\nApplications/Adobe After Effects/Adope After Effects.app,\nSelect 'Show package contents', go to\nContents/Resources/PresetEffects.xml.";
					if ($.os.toLowerCase().indexOf("win") >= 0) mmText2.text = "• 1 - Open the file 'presetEffects.xml' :\nC:\\Program Files\\Adobe\\Adobe After Effects\\Support Files\\PresetEffects.xml.";
					mmText2.visible = false;
					var mmText3 = mmTexts.add("statictext",undefined,"",{multiline:true});
					mmText3.alignment = ["center","top"];
					mmText3.text = "• 2 - Copy the content of the box below,\nhit Cmd+A\nto select all the text,\nthen Cmd+C to copy it.";
					if ($.os.toLowerCase().indexOf("win") >= 0) mmText3.text = "• 2 - Copy the content of the box below,\nhit Ctrl+A\nto select all the text,\nthen Ctrl+C to copy it.";
					mmText3.visible = false;
					var mmText4 = mmTexts.add("statictext",undefined,"",{multiline:true});
					mmText4.alignment = ["center","top"];
					mmText4.text = "• 3 - Paste this text in the file 'presetEffects.xml'\njust BEFORE the last line: '</effects>'.";
					mmText4.visible = false;
					var mmNavButtons = mmGroup.add("group");
					mmNavButtons.orientation = "row";
					mmNavButtons.alignment = ["center","top"];
					var mmPrevButton = mmNavButtons.add("button",undefined,"Previous");
					mmPrevButton.alignment = ["left","top"];
					mmPrevButton.enabled = false;
					var mmNextButton = mmNavButtons.add("button",undefined,"Next");
					mmNextButton.alignment = ["right","top"];
					mmContinueButton = mmGroup.add("button",undefined,"Finish installation now!");
					mmContinueButton.alignment = ["center","bottom"];
					var mmXmlBox = mmGroup.add("edittext",undefined,"test",{multiline:true});
					mmXmlBox.text = Duik.setup.presetEffects;
					mmGroup.visible = false;
					//CANNOT INSTALL
					var ciGroup = paletteContent.add("group",undefined);
					ciGroup.orientation = "column";
					ciGroup.alignChildren = ["fill","fill"];
					var ciText = ciGroup.add("statictext",undefined,"",{multiline:true});
					ciText.minimumSize = [150,60];
					ciText.alignment = ["center","top"];
					ciText.text = "---- ERROR ----\n\nOops!\nSomething is wrong, Duik can not find pseudo effects.\n\nGo to http://www.duduf.net to get help.\n\n-----------------------------";
					ciGroup.visible = false;
				}
				
				mspNextButton.onClick = function ()
				{
					if (mspText.visible)
					{
						mspText.visible = false;
						mspText2.visible = true;
						mspText3.visible = false;
						mspText4.visible = false;
						mspPrevButton.enabled = true;
					}
					else if (mspText2.visible)
					{
						mspText.visible = false;
						mspText2.visible = false;
						mspText3.visible = true;
						mspText4.visible = false;
					}
					else if (mspText3.visible)
					{
						mspText.visible = false;
						mspText2.visible = false;
						mspText3.visible = false;
						mspText4.visible = true;
						mspContinueButton.enabled = true;
						mspNextButton.enabled = false;
					}
				}
				
				mspPrevButton.onClick = function ()
				{
					if (mspText2.visible)
					{
						mspText.visible = true;
						mspText2.visible = false;
						mspText3.visible = false;
						mspText4.visible = false;
						mspPrevButton.enabled = false;
					}
					else if (mspText3.visible)
					{
						mspText.visible = false;
						mspText2.visible = true;
						mspText3.visible = false;
						mspText4.visible = false;
					}
					else if (mspText4.visible)
					{
						mspText.visible = false;
						mspText2.visible = false;
						mspText3.visible = true;
						mspText4.visible = false;
						mspContinueButton.enabled = false;
						mspNextButton.enabled = true;
					}
				}
				
				mmNextButton.onClick = function ()
				{
					if (mmText.visible)
					{
						mmText.visible = false;
						mmText2.visible = true;
						mmText3.visible = false;
						mmText4.visible = false;
						mmPrevButton.enabled = true;
					}
					else if (mmText2.visible)
					{
						mmText.visible = false;
						mmText2.visible = false;
						mmText3.visible = true;
						mmText4.visible = false;
					}
					else if (mmText3.visible)
					{
						mmText.visible = false;
						mmText2.visible = false;
						mmText3.visible = false;
						mmText4.visible = true;
						mmContinueButton.enabled = true;
						mmNextButton.enabled = false;
					}
				}
				
				mmPrevButton.onClick = function ()
				{
					if (mmText2.visible)
					{
						mmText.visible = true;
						mmText2.visible = false;
						mmText3.visible = false;
						mmText4.visible = false;
						mmPrevButton.enabled = false;
					}
					else if (mmText3.visible)
					{
						mmText.visible = false;
						mmText2.visible = true;
						mmText3.visible = false;
						mmText4.visible = false;
					}
					else if (mmText4.visible)
					{
						mmText.visible = false;
						mmText2.visible = false;
						mmText3.visible = true;
						mmText4.visible = false;
						mmContinueButton.enabled = false;
						mmNextButton.enabled = true;
					}
				}
				
				mspContinueButton.onClick = function ()
				{
					mspGroup.hide();
					Duik.setup.installPseudoEffects();
					//if the version is ok, After Effects just need to be restarted
					if (Duik.presetEffectsInstalledVersion == Duik.versionNumber)
					{
						icGroup.show();
					}
					else
					{
						mmGroup.show();
					}
				};
				
				mmContinueButton.onClick = function ()
				{
					mmGroup.hide();
					Duik.setup.checkPresetEffectsVersion();
					if (Duik.presetEffectsInstalledVersion == Duik.versionNumber)
					{
						icGroup.show();
					}
					else
					{
						ciGroup.show();
					}
				};
				
				//if the version is ok, After Effects just needs to be restarted
				Duik.setup.checkPresetEffectsVersion();
				if (Duik.presetEffectsInstalledVersion == Duik.versionNumber)
				{
					icGroup.visible = true;
				}
				//if mac os
				else if ($.os.toLowerCase().indexOf("mac") >= 0) 
				{
					mspGroup.visible = true;
				}
				//if win
				else
				{
					mmGroup.visible = true;
				}
				
				// On définit le layout et on redessine la fenètre quand elle est resizée
				palette.layout.layout(true);
				palette.layout.resize();
				palette.onResizing = palette.onResize = function () { this.layout.resize(); };
				return palette;
				
			}
			Duik.settings.load();
		}
	
		//=================================
		//======== LOAD ICONS =============
		//=================================
		{
			function checkFile(name, content)
			{
				var file = new File(name);
				var fileContent = "";
				if (file.exists)
				{
					file.encoding = "BINARY"; 
					if (file.open("r", "TEXT", "????"))
					{
						fileContent = file.read();

						file.close(); 
					}
				}
				else
				{
					var folder = new Folder(file.path);
					if (!folder.exists)
					{
						folder.create();
					}
				}
				var success = fileContent == content;
				if (!success)
				{
					file.encoding = "BINARY"; 
					if (file.open("w"))
					{
						success = file.write(content);

						file.close(); 
					}
				}
				return success;
			}
			
			#include "Duik_images.jsxinc"

			var imgFolder = new Folder(Folder.userData.fsName + "/DuIK").fsName;
			for (var k in scriptMng.files)
			{
				if (scriptMng.files.hasOwnProperty(k))
				{
					if (!checkFile(imgFolder + k, scriptMng.files[k]))
					{
						alert("Error writing file: " + k);
					}
				}
			}
		}

		//===============================================
		//============ FUNCTIONS ========================
		//===============================================
		{
			
			//TODO renommer les fonctions (onButtonBonesClick() par exemple), et clarifier le code	
			//=================== UTILS =========================

			//UTILE : TROUVE L'INDEX D'UNE STRING DANS UN ARRAY DE STRINGS
			function arrayIndexOf(array,string){
				for (i = 0;i<array.length;i++)
				{
					if (array[i] == string) return i;
				}
				return -1;
			}

			//UTILE : TROUVE LES DUPLICATA DANS UN ARRAY
			function arrayIsDuplicates(array) {
				for (i = 0;i<array.length-1;i++) {
					for (j=i+1;j<array.length;j++) {
						if (array[i] == array[j]) return true;
					}
				}
				return false;
			}

			//FONCTION CARRE
			function carre(nombre) {
				return Math.pow(nombre,2);
				}

			//====================== AUTORIG ======================

			//FONCTION QUAND ON CLIQUE SUR AUTORIG --- TODO à mettre dans libduik
			function autorig() {

				Duik.utils.checkNames();

				var compo = app.project.activeItem;

				//1 - parcourir tous les calques et les ranger
				var piedG,molletG,cuisseG,piedD,molletD,cuisseD,corps,mainG,avantBrasG,brasG,mainD,avantBrasD,brasD,tete,cou,bassin;
				var calques = [];
				var calquesNoms = ["Aucun"];
				
				//si rien de sélectionné, on charge les calques de toute la compo
				if (compo.selectedLayers.length == 0) {
					for (i = 1;i<=compo.layers.length;i++) {
						if (compo.layers[i].name.toLowerCase().indexOf(getMessage(156).toLowerCase()) >= 0 ) piedG = compo.layers[i];
						if (compo.layers[i].name.toLowerCase().indexOf(getMessage(159).toLowerCase()) >= 0 ) piedD = compo.layers[i];
						if (compo.layers[i].name.toLowerCase().indexOf(getMessage(155).toLowerCase()) >= 0 ) molletG = compo.layers[i];
						if (compo.layers[i].name.toLowerCase().indexOf(getMessage(158).toLowerCase()) >= 0 ) molletD = compo.layers[i];
						if (compo.layers[i].name.toLowerCase().indexOf(getMessage(154).toLowerCase()) >= 0 ) cuisseG = compo.layers[i];
						if (compo.layers[i].name.toLowerCase().indexOf(getMessage(157).toLowerCase()) >= 0 ) cuisseD = compo.layers[i];
						if (compo.layers[i].name.toLowerCase().indexOf(getMessage(146).toLowerCase()) >= 0 ) corps = compo.layers[i];
						if (compo.layers[i].name.toLowerCase().indexOf(getMessage(147).toLowerCase()) >= 0 ) bassin = compo.layers[i];
						if (compo.layers[i].name.toLowerCase().indexOf(getMessage(150).toLowerCase()) >= 0 ) mainG = compo.layers[i];
						if (compo.layers[i].name.toLowerCase().indexOf(getMessage(153).toLowerCase()) >= 0 ) mainD = compo.layers[i];
						if (compo.layers[i].name.toLowerCase().indexOf(getMessage(149).toLowerCase()) >= 0 ) avantBrasG = compo.layers[i];
						if (compo.layers[i].name.toLowerCase().indexOf(getMessage(152).toLowerCase()) >= 0 ) avantBrasD = compo.layers[i];
						if (compo.layers[i].name.toLowerCase().indexOf(getMessage(148).toLowerCase()) >= 0 ) brasG = compo.layers[i];
						if (compo.layers[i].name.toLowerCase().indexOf(getMessage(151).toLowerCase()) >= 0 ) brasD = compo.layers[i];
						if (compo.layers[i].name.toLowerCase().indexOf(getMessage(144).toLowerCase()) >= 0 ) tete = compo.layers[i];
						if (compo.layers[i].name.toLowerCase().indexOf(getMessage(145).toLowerCase()) >= 0 ) cou = compo.layers[i];
						calques.push(compo.layers[i]);
						calquesNoms.push(i + " - " + compo.layers[i].name);
					}
				}
				else //sinon que la sélection
				{
					for (i = 0;i<compo.selectedLayers.length;i++) {
						if (compo.selectedLayers[i].name.toLowerCase().indexOf(getMessage(156).toLowerCase()) >= 0 ) piedG = compo.selectedLayers[i];
						if (compo.selectedLayers[i].name.toLowerCase().indexOf(getMessage(159).toLowerCase()) >= 0 ) piedD = compo.selectedLayers[i];
						if (compo.selectedLayers[i].name.toLowerCase().indexOf(getMessage(155).toLowerCase()) >= 0 ) molletG = compo.selectedLayers[i];
						if (compo.selectedLayers[i].name.toLowerCase().indexOf(getMessage(158).toLowerCase()) >= 0 ) molletD = compo.selectedLayers[i];
						if (compo.selectedLayers[i].name.toLowerCase().indexOf(getMessage(154).toLowerCase()) >= 0 ) cuisseG = compo.selectedLayers[i];
						if (compo.selectedLayers[i].name.toLowerCase().indexOf(getMessage(157).toLowerCase()) >= 0 ) cuisseD = compo.selectedLayers[i];
						if (compo.selectedLayers[i].name.toLowerCase().indexOf(getMessage(146).toLowerCase()) >= 0 ) corps = compo.selectedLayers[i];
						if (compo.selectedLayers[i].name.toLowerCase().indexOf(getMessage(147).toLowerCase()) >= 0 ) bassin = compo.selectedLayers[i];
						if (compo.selectedLayers[i].name.toLowerCase().indexOf(getMessage(150).toLowerCase()) >= 0 ) mainG = compo.selectedLayers[i];
						if (compo.selectedLayers[i].name.toLowerCase().indexOf(getMessage(153).toLowerCase()) >= 0 ) mainD = compo.selectedLayers[i];
						if (compo.selectedLayers[i].name.toLowerCase().indexOf(getMessage(149).toLowerCase()) >= 0 ) avantBrasG = compo.selectedLayers[i];
						if (compo.selectedLayers[i].name.toLowerCase().indexOf(getMessage(152).toLowerCase()) >= 0 ) avantBrasD = compo.selectedLayers[i];
						if (compo.selectedLayers[i].name.toLowerCase().indexOf(getMessage(148).toLowerCase()) >= 0 ) brasG = compo.selectedLayers[i];
						if (compo.selectedLayers[i].name.toLowerCase().indexOf(getMessage(151).toLowerCase()) >= 0 ) brasD = compo.selectedLayers[i];
						if (compo.selectedLayers[i].name.toLowerCase().indexOf(getMessage(144).toLowerCase()) >= 0 ) tete = compo.selectedLayers[i];
						if (compo.selectedLayers[i].name.toLowerCase().indexOf(getMessage(145).toLowerCase()) >= 0 ) cou = compo.selectedLayers[i];
						calques.push(compo.selectedLayers[i]);
						calquesNoms.push(compo.selectedLayers[i].index + " - " + compo.selectedLayers[i].name);
					}
				}

				//2 - afficher une fenetre pour pouvoir préciser qui est qui, et options
				
				//ajouter les listes de calques
				teteBouton.removeAll();
				couBouton.removeAll();
				corpsBouton.removeAll();
				bassinBouton.removeAll();
				brasGBouton.removeAll();
				avantBrasGBouton.removeAll();
				mainGBouton.removeAll();
				brasDBouton.removeAll();
				avantBrasDBouton.removeAll();
				mainDBouton.removeAll();
				cuisseGBouton.removeAll();
				molletGBouton.removeAll();
				piedGBouton.removeAll();
				cuisseDBouton.removeAll();
				molletDBouton.removeAll();
				piedDBouton.removeAll();
				for (i = 0;i<calquesNoms.length;i++) {
					teteBouton.add("item",calquesNoms[i]);
					couBouton.add("item",calquesNoms[i]);
					corpsBouton.add("item",calquesNoms[i]);
					bassinBouton.add("item",calquesNoms[i]);
					brasGBouton.add("item",calquesNoms[i]);
					avantBrasGBouton.add("item",calquesNoms[i]);
					mainGBouton.add("item",calquesNoms[i]);
					brasDBouton.add("item",calquesNoms[i]);
					avantBrasDBouton.add("item",calquesNoms[i]);
					mainDBouton.add("item",calquesNoms[i]);
					cuisseGBouton.add("item",calquesNoms[i]);
					molletGBouton.add("item",calquesNoms[i]);
					piedGBouton.add("item",calquesNoms[i]);
					cuisseDBouton.add("item",calquesNoms[i]);
					molletDBouton.add("item",calquesNoms[i]);
					piedDBouton.add("item",calquesNoms[i]);
				}
				
				//préselectionner
				if (tete != undefined) teteBouton.selection = arrayIndexOf(calquesNoms,tete.index + " - " + tete.name);
				if (cou != undefined) couBouton.selection = arrayIndexOf(calquesNoms,cou.index + " - " + cou.name);
				if (corps != undefined) corpsBouton.selection = arrayIndexOf(calquesNoms,corps.index + " - " + corps.name);
				if (bassin != undefined) bassinBouton.selection = arrayIndexOf(calquesNoms,bassin.index + " - " + bassin.name);
				if (brasG != undefined) brasGBouton.selection = arrayIndexOf(calquesNoms,brasG.index + " - " + brasG.name);
				if (avantBrasG != undefined) avantBrasGBouton.selection = arrayIndexOf(calquesNoms,avantBrasG.index + " - " + avantBrasG.name);
				if (mainG != undefined) mainGBouton.selection = arrayIndexOf(calquesNoms,mainG.index + " - " + mainG.name);
				if (brasD != undefined) brasDBouton.selection = arrayIndexOf(calquesNoms,brasD.index + " - " + brasD.name);
				if (avantBrasD != undefined) avantBrasDBouton.selection = arrayIndexOf(calquesNoms,avantBrasD.index + " - " + avantBrasD.name);
				if (mainD != undefined) mainDBouton.selection = arrayIndexOf(calquesNoms,mainD.index + " - " + mainD.name);
				if (cuisseG != undefined) cuisseGBouton.selection = arrayIndexOf(calquesNoms,cuisseG.index + " - " + cuisseG.name);
				if (molletG != undefined) molletGBouton.selection = arrayIndexOf(calquesNoms,molletG.index + " - " + molletG.name);
				if (piedG != undefined) piedGBouton.selection = arrayIndexOf(calquesNoms,piedG.index + " - " + piedG.name);
				if (cuisseD != undefined) cuisseDBouton.selection = arrayIndexOf(calquesNoms,cuisseD.index + " - " + cuisseD.name);
				if (molletD != undefined) molletDBouton.selection = arrayIndexOf(calquesNoms,molletD.index + " - " + molletD.name);
				if (piedD != undefined) piedDBouton.selection = arrayIndexOf(calquesNoms,piedD.index + " - " + piedD.name);

				fenetreAutorig.layout.layout(true);
				fenetreAutorig.layout.resize();
				fenetreAutorig.show();
			}

			//FONCTION LANCE L'AUTORIG --- TODO à mettre dans libduik
			function startAutoRig() {

				var compo = app.project.activeItem;
				var piedG,molletG,cuisseG,piedD,molletD,cuisseD,corps,mainG,avantBrasG,brasG,mainD,avantBrasD,brasD,tete,cou,bassin;
				
				//réassigner les calques en fonction des choix utilisateur
				
				if (piedGBouton.selection == null) piedGBouton.selection = 0;
				if (molletGBouton.selection == null) molletGBouton.selection = 0;
				if (cuisseGBouton.selection == null) cuisseGBouton.selection = 0;
				if (piedDBouton.selection == null) piedDBouton.selection = 0;
				if (molletDBouton.selection == null) molletDBouton.selection = 0;
				if (cuisseDBouton.selection == null) cuisseDBouton.selection = 0;
				if (corpsBouton.selection == null) corpsBouton.selection = 0;
				if (mainGBouton.selection == null) mainGBouton.selection = 0;
				if (avantBrasGBouton.selection == null) avantBrasGBouton.selection = 0;
				if (brasGBouton.selection == null) brasGBouton.selection = 0;
				if (mainDBouton.selection == null) mainDBouton.selection = 0;
				if (avantBrasDBouton.selection == null) avantBrasDBouton.selection = 0;
				if (brasDBouton.selection == null) brasDBouton.selection = 0;
				if (teteBouton.selection == null) teteBouton.selection = 0;
				if (couBouton.selection == null) couBouton.selection = 0;
				if (bassinBouton.selection == null) bassinBouton.selection = 0;
				
				piedGBouton.selection.index == 0 ? piedG = undefined : piedG = compo.layers[piedGBouton.selection.text.split(" - ")[0]];
				molletGBouton.selection.index == 0 ? molletG = undefined : molletG = compo.layers[molletGBouton.selection.text.split(" - ")[0]];
				cuisseGBouton.selection.index == 0 ? cuisseG = undefined : cuisseG = compo.layers[cuisseGBouton.selection.text.split(" - ")[0]];
				piedDBouton.selection.index == 0 ? piedD = undefined : piedD = compo.layers[piedDBouton.selection.text.split(" - ")[0]];
				molletDBouton.selection.index == 0 ? molletD = undefined : molletD = compo.layers[molletDBouton.selection.text.split(" - ")[0]];
				cuisseDBouton.selection.index == 0 ? cuisseD = undefined : cuisseD = compo.layers[cuisseDBouton.selection.text.split(" - ")[0]];
				corpsBouton.selection.index == 0 ? corps = undefined : corps = compo.layers[corpsBouton.selection.text.split(" - ")[0]];
				mainGBouton.selection.index == 0 ? mainG = undefined : mainG = compo.layers[mainGBouton.selection.text.split(" - ")[0]];
				avantBrasGBouton.selection.index == 0 ? avantBrasG = undefined : avantBrasG = compo.layers[avantBrasGBouton.selection.text.split(" - ")[0]];
				brasGBouton.selection.index == 0 ? brasG = undefined : brasG = compo.layers[brasGBouton.selection.text.split(" - ")[0]];
				mainDBouton.selection.index == 0 ? mainD = undefined : mainD = compo.layers[mainDBouton.selection.text.split(" - ")[0]];
				avantBrasDBouton.selection.index == 0 ? avantBrasD = undefined : avantBrasD = compo.layers[avantBrasDBouton.selection.text.split(" - ")[0]];
				brasDBouton.selection.index == 0 ? brasD = undefined : brasD = compo.layers[brasDBouton.selection.text.split(" - ")[0]];
				teteBouton.selection.index == 0 ? tete = undefined : tete = compo.layers[teteBouton.selection.text.split(" - ")[0]];
				couBouton.selection.index == 0 ? cou = undefined : cou = compo.layers[couBouton.selection.text.split(" - ")[0]];
				bassinBouton.selection.index == 0 ? bassin = undefined : bassin = compo.layers[bassinBouton.selection.text.split(" - ")[0]];
				
				//vérifier qu'il n'y a pas deux calques assignés au meme élément
				var indexUtilises = [];
				if (piedG != undefined) indexUtilises.push(piedG.index);
				if (molletG != undefined) indexUtilises.push(molletG.index);
				if (cuisseG != undefined) indexUtilises.push(cuisseG.index);
				if (piedD != undefined) indexUtilises.push(piedD.index);
				if (molletD != undefined) indexUtilises.push(molletD.index);
				if (cuisseD != undefined) indexUtilises.push(cuisseD.index);
				if (corps != undefined) indexUtilises.push(corps.index);
				if (mainG != undefined) indexUtilises.push(mainG.index);
				if (avantBrasG != undefined) indexUtilises.push(avantBrasG.index);
				if (brasG != undefined) indexUtilises.push(brasG.index);
				if (mainD != undefined) indexUtilises.push(mainD.index);
				if (avantBrasD != undefined) indexUtilises.push(avantBrasD.index);
				if (brasD != undefined) indexUtilises.push(brasD.index);
				if (tete != undefined) indexUtilises.push(tete.index);
				if (cou != undefined) indexUtilises.push(cou.index);
				if (bassin != undefined) indexUtilises.push(bassin.index);
				
				//verif duplicates de l'array
				if (arrayIsDuplicates(indexUtilises)) { alert ("Attention à ne pas assigner deux fois le même calque") ; fenetreAutorig.show(); return; }
				
				//vérifier qu'il ne manque rien d'indispensable (mains, pieds, corps)
				var calquesManquants = [];
				if (mainG == undefined && (avantBrasG != undefined || brasG != undefined)) calquesManquants.push("Main Gauche");
				if (mainD == undefined && (avantBrasD != undefined || brasD != undefined)) calquesManquants.push("Main Droite");
				if (piedG == undefined && (cuisseG != undefined || molletG != undefined)) calquesManquants.push("Pied Gauche");
				if (piedD == undefined && (cuisseD != undefined || molletD != undefined)) calquesManquants.push("Pied Gauche");
				if (corps == undefined) calquesManquants.push("Corps");
				

				if (calquesManquants.length > 0) { alert ("Il manque des calques indispensables :\n\n" + calquesManquants.join("\n")); fenetreAutorig.show(); return; }
				
				//vérifier si 3D
				var tridi = false;
				if (mainG != undefined) if (mainG.threeDLayer) tridi = true;
				if (avantBrasG != undefined) if (avantBrasG.threeDLayer) tridi = true;
				if (brasG != undefined) if (brasG.threeDLayer) tridi = true;
				if (mainD != undefined) if (mainD.threeDLayer) tridi = true;
				if (avantBrasD != undefined) if (avantBrasD.threeDLayer) tridi = true;
				if (brasD != undefined) if (brasD.threeDLayer) tridi = true;
				if (piedG != undefined) if (piedG.threeDLayer) tridi = true;
				if (molletG != undefined) if (molletG.threeDLayer) tridi = true;
				if (cuisseG != undefined) if (cuisseG.threeDLayer) tridi = true;
				if (piedD != undefined) if (piedD.threeDLayer) tridi = true;
				if (molletD != undefined) if (molletD.threeDLayer) tridi = true;
				if (cuisseD != undefined) if (cuisseD.threeDLayer) tridi = true;
				if (corps != undefined) if (corps.threeDLayer) tridi = true;
				if (tete != undefined) if (tete.threeDLayer) tridi = true;
				if (cou != undefined) if (cou.threeDLayer) tridi = true;
				if (bassin != undefined) if (bassin.threeDLayer) tridi = true;
				
				if (tridi) { alert ("L'Auto-Rig ne fonctionne pas encore avec des calques 3D"); return ; }
				
				//groupe d'annulation
				app.beginUndoGroup("Duik - Autorig");
				
				//tout délinker au cas où...
				if (mainG != undefined) mainG.parent = null;
				if (avantBrasG != undefined) avantBrasG.parent = null;
				if (brasG != undefined) brasG.parent = null;
				if (mainD != undefined) mainD.parent = null;
				if (avantBrasD != undefined) avantBrasD.parent = null;
				if (brasD != undefined) brasD.parent = null;
				if (piedG != undefined) piedG.parent = null;
				if (molletG != undefined) molletG.parent = null;
				if (cuisseG != undefined) cuisseG.parent = null;
				if (piedD != undefined) piedD.parent = null;
				if (molletD != undefined) molletD.parent = null;
				if (cuisseD != undefined) cuisseD.parent = null;
				if (corps != undefined) corps.parent = null;
				if (tete != undefined) tete.parent = null;
				if (cou != undefined) cou.parent = null;
				if (bassin != undefined) bassin.parent = null;
				
				//ajouter les controleurs
				//le master
				var Cmaster = compo.layers.addNull();
				Cmaster.source.width = eval(boutonCtrlSize.text);
				Cmaster.source.height = eval(boutonCtrlSize.text);
				Cmaster.anchorPoint.setValue([Cmaster.source.width/2,Cmaster.source.height/2]);
				Cmaster.transform.position.setValue([compo.width/2,compo.height]);
				Cmaster.name = "C_" + getMessage(177);
				
				var CpiedG,CpiedD,Ccorps,Ccorps2,CmainG,CmainD,Ctete,Cepaules,Cdos,Ccou;
				//mains
				if (mainG != undefined) CmainG = Duik.addController(mainG);
				if (mainD != undefined) CmainD = Duik.addController(mainD);
				//corps
				bassin != undefined ? Ccorps = Duik.addController(bassin) : Ccorps = Duik.addController(corps);
				Ccorps2 = Duik.addController(Ccorps);
				Ccorps2.source.width = eval(boutonCtrlSize.text)*0.8;
				Ccorps2.source.height = eval(boutonCtrlSize.text)*0.8;
				//pieds
				if (piedD != undefined) CpiedD = Duik.addController(piedD);
				if (piedG != undefined) CpiedG = Duik.addController(piedG);
				//tete
				if (tete != undefined) Ctete = Duik.addController(tete);
				//épaules
				if (autorigIKdos.value) {
					//les positions des épaules, pour placer le controleur à mi chemin entre les deux
					var posEpauleG,posEpauleD,posCou,posTete;
					if (brasG != undefined) posEpauleG = brasG.transform.position.value;
					else if (avantBrasG != undefined) posEpauleG = avantBrasG.position.value;
					else if (mainG != undefined) posEpauleG = mainG.position.value;
					if (brasD != undefined) posEpauleD = brasD.transform.position.value;
					else if (avantBrasD != undefined) posEpauleD = avantBrasD.position.value;
					else if (mainD != undefined) posEpauleD = mainD.position.value;

					var posEpaules = [compo.width/2,0];
					if (posEpauleG != undefined && posEpauleD != undefined) posEpaules = [(posEpauleG[0] + posEpauleD[0])/2,(posEpauleG[1] + posEpauleD[1])/2];
					else if (posEpauleG != undefined) posEpaules = posEpauleG;
					else if (posEpauleD != undefined) posEpaules = posEpauleD;
					else if (cou != undefined) posEpaules = cou.transform.position.value;
					else if (tete != undefined) posEpaules = tete.transform.position.value;
					var Cepaules = app.project.activeItem.layers.addNull();
					Cepaules.source.width = eval(boutonCtrlSize.text)*0.8;
					Cepaules.source.height = eval(boutonCtrlSize.text)*0.8;
					Cepaules.anchorPoint.setValue([Cepaules.source.width/2,Cepaules.source.height/2]);
					Cepaules.transform.position.setValue(posEpaules);
					Cepaules.name = "C_" + getMessage(178);

				}
				//dos (si bassin et pas d'épaule)
				if (bassin != undefined && !autorigIKdos.value) Cdos = Duik.addController(corps);
				//cou (si pas d'ik dedans)
				if (!autorigIKcou.value && cou != undefined) Ccou = Duik.addController(cou);
				
				//les liens de parentés
				//bras G
				if (mainG != undefined){
					if (avantBrasG != undefined) mainG.parent = avantBrasG;
					else if (brasG != undefined) mainG.parent = brasG;
					else mainG.parent = corps;
					}
				if (avantBrasG != undefined) {
					if (brasG != undefined) avantBrasG.parent = brasG;
					else avantBrasG.parent = corps;
					}
				if (brasG != undefined) brasG.parent = corps;
				//bras D
				if (mainD != undefined){
					if (avantBrasD != undefined) mainD.parent = avantBrasD;
					else if (brasD != undefined) mainD.parent = brasD;
					else mainD.parent = corps;
					}
				if (avantBrasD != undefined) {
					if (brasD != undefined) avantBrasD.parent = brasD;
					else avantBrasD.parent = corps;
					}
				if (brasD != undefined) brasD.parent = corps;
				//jambe G
				if (piedG != undefined){
					if (molletG != undefined) piedG.parent = molletG;
					else if (cuisseG != undefined) piedG.parent = cuisseG;
					else if (bassin != undefined) piedG.parent = bassin;
					else piedG.parent = corps;
					}
				if (molletG != undefined) {
					if (cuisseG != undefined) molletG.parent = cuisseG;
					else if (bassin != undefined) molletG.parent = bassin;
					else molletG.parent = corps;
					}
				if (cuisseG != undefined) {
					if (bassin != undefined) cuisseG.parent = bassin;
					else cuisseG.parent = corps;
					}
				//jambe D
				if (piedD != undefined){
					if (molletD != undefined) piedD.parent = molletD;
					else if (cuisseD != undefined) piedD.parent = cuisseD;
					else if (bassin != undefined) piedD.parent = bassin;
					else piedD.parent = corps;
					}
				if (molletD != undefined) {
					if (cuisseD != undefined) molletD.parent = cuisseD;
					else if (bassin != undefined) molletD.parent = bassin;
					else molletD.parent = corps;
					}
				if (cuisseD != undefined) {
					if (bassin != undefined) cuisseD.parent = bassin;
					else cuisseD.parent = corps;
					}
				//tete
				if (tete != undefined) cou != undefined ? tete.parent = cou : tete.parent = corps;
				//cou
				if (cou != undefined) cou.parent = corps;	
				//corps
				bassin != undefined ? corps.parent = bassin : corps.parent = Ccorps2;
				//bassin
				if (bassin != undefined) bassin.parent = Ccorps2;
				//controleurs
				if (CpiedG != undefined) CpiedG.parent = Cmaster;
				if (CpiedD != undefined) CpiedD.parent = Cmaster;
				Ccorps2.parent = Ccorps;
				Ccorps.parent = Cmaster;
				if (CmainG != undefined) CmainG.parent = Ccorps;
				if (CmainD != undefined) CmainD.parent = Ccorps;
				if (Ctete != undefined) { if (Ccou != undefined) Ctete.parent = Ccou; else if (Cepaules != undefined)  Ctete.parent = Cepaules ; else if (Cdos != undefined) Ctete.parent = Cdos; else Ctete.parent = Ccorps2; }
				if (Cepaules != undefined) Cepaules.parent = Ccorps;
				if (Cdos != undefined) Cdos.parent = Ccorps2;
				if (Ccou != undefined) { if (Cepaules != undefined) Ccou.parent = Cepaules; else if (Cdos != undefined) Ccou.parent = Cdos; else Ccou.parent = Ccorps2; }
					
				
				//les options d'ik
				boutonStretch.value = autorigStretch.value;
				boutonFK.value = autorigFK.value;
				
				//les IK
				//bras G
				if (mainG != undefined)
				{
					if (avantBrasG != undefined && brasG != undefined)
					{
						Duik.IK(CmainG,brasG,avantBrasG,undefined,mainG,false,tridi,false);
					}
					else if (avantBrasG != undefined)
					{
						
						Duik.IK(avantBrasG,CmainG);
						Duik.goal(mainG,CmainG);
					}
					else if (brasG != undefined)
					{
						Duik.IK(brasG,CmainG);
						Duik.goal(mainG,CmainG);
					}
					else
					{
						Duik.goal(mainG,CmainG);
					}
				}
				//bras D
				if (mainD != undefined)
				{
					if (avantBrasD != undefined && brasD != undefined) Duik.IK(CmainD,brasD,avantBrasD,undefined,mainD,false,tridi,false);
					else if (avantBrasD != undefined) {
						Duik.IK(avantBrasD,CmainD);
						Duik.goal(mainD,CmainD);
						}
					else if (brasD != undefined) {
						Duik.IK(brasD,CmainD);
						Duik.goal(mainD,CmainD);
						}
					else Duik.goal(mainD,CmainD);
				}
				//jambe D
				if (piedD != undefined)
				{
					if (molletD != undefined && cuisseD != undefined) Duik.IK(CpiedD,cuisseD,molletD,undefined,piedD,false,tridi,false);
					else if (molletD != undefined) {
						Duik.IK(molletD,CpiedD);
						Duik.goal(piedD,CpiedD);
						}
					else if (cuisseD != undefined) {
						Duik.IK(cuisseD,CpiedD);
						Duik.goal(piedD,CpiedD);
						}
					else Duik.goal(piedD,CpiedD);
				}
				//jambe G
				if (piedG != undefined)
				{
					if (molletG != undefined && cuisseG != undefined) Duik.IK(CpiedG,cuisseG,molletG,undefined,piedG,false,tridi,false);
					else if (molletG != undefined) {
						Duik.IK(molletG,CpiedG);
						Duik.goal(piedG,CpiedG);
						}
					else if (cuisseG != undefined) {
						Duik.IK(cuisseG,CpiedG);
						Duik.goal(piedG,CpiedG);
						}
					else Duik.goal(piedG,CpiedG);
				}
				//dos
				if (autorigIKdos.value) {
					Duik.IK(corps,Cepaules);
				}
				//cou
				if (autorigIKcou.value && cou != undefined) {
					Duik.IK(cou,Ctete);
				}
				
				
				//les FK
				//dos
				if (!autorigIKdos.value && Cdos != undefined) {
					corps.transform.rotation.expression = "thisComp.layer('" + Cdos.name + "').transform.rotation + value";
					Cdos.transform.position.expression = "[" + Cdos.transform.position.value[0] + "," + Cdos.transform.position.value[1] + "]";
				}
				//cou
				if (!autorigIKcou.value && Ccou != undefined && cou != undefined) {
					cou.transform.rotation.expression = "thisComp.layer('" + Ccou.name + "').transform.rotation + value";
					Ccou.transform.position.expression = "[" + Ccou.transform.position.value[0] + "," + Ccou.transform.position.value[1] + "]";
				}
				//tete
				if (tete != undefined) {
					tete.transform.rotation.expression = "thisComp.layer('" + Ctete.name + "').transform.rotation + value";
					if (!autorigIKcou.value || cou == undefined) Ctete.transform.position.expression = "[" + Ctete.transform.position.value[0] + "," + Ctete.transform.position.value[1] + "]";
				}
				
				//les goals
				//tete
				if (tete != undefined) {
					Duik.goal(tete,Ctete);
				}
				
				//groupe d'annulation
				app.endUndoGroup();

			}

			//========== RIGGING ================================

			//FONCTION QUAND ON CLIQUE SUR CREER IK --- TODO vérif auto parentage/calques sélectionnés (à mettre dans libDuik)
			function ik(){
				var calques = app.project.activeItem.selectedLayers;
				
				//if num layers selected is not correct
				if (calques.length < 2 || calques.length > 4) {
					alert(getMessage(7));
					return;
				} //if calques.length == 2 || calques.length == 3 || calques.length == 4
				
				var calquetridi = false;
				var ncalquetridi = 0;
				for (i=0;i<calques.length;i++){
					if (calques[i].threeDLayer) {ncalquetridi = i+1;}
					}
					
				if (ncalquetridi != 0 && ncalquetridi != calques.length) {
					alert(getMessage(6));
					return;
				}//if ncalquetridi == 0 || ncalquetridi == calques.length
				
				if (ncalquetridi == calques.length) {
					boutonFront.enabled = true;
					boutonRight.enabled = true;
					calquetridi = true;
					}//if ncalquetridi == calques.length
				else {
					boutonFront.enabled = false;
					boutonRight.enabled = false;
					}//else if ncalquetridi == calques.length
					
				if (calques.length == 2) {
					//groupe d'annulation
					app.beginUndoGroup("Duik - IK");
					calquetridi ? alert(getMessage(5)) : Duik.IK(app.project.activeItem.selectedLayers[1],app.project.activeItem.selectedLayers[0]);
					//groupe d'annulation
					app.endUndoGroup();
					}//if calques.length == 2
				else if (calques.length == 3) {
					boutonStretch.value = false;
					boutonStretch.enabled = false;
					fenetreik.show();
				} //if calques.length == 3
				else if (calques.length == 4) {
					boutonStretch.enabled = true;
					boutonStretch.value = eval(app.settings.getSetting("duik", "stretch"));
					boutonFK.value = eval(app.settings.getSetting("duik", "ikfk"));
					fenetreik.show();
				} //if calques.length == 4
			}

			//FONCTION QUI LANCE LA CREATION D'IK AVEC LES OPTIONS
			function goik(){
				//groupe d'annulation
				app.beginUndoGroup("Duik - IK");
				var calques = app.project.activeItem.selectedLayers;
				var calquetridi = calques[0].threeDLayer;
				if (calques.length == 3)
				{
					Duik.IK(app.project.activeItem.selectedLayers[2],app.project.activeItem.selectedLayers[1],app.project.activeItem.selectedLayers[0],undefined,undefined,boutonCW.value,calquetridi,boutonFront.value);
				}
				else if (calques.length == 4)
				{
					Duik.IK(app.project.activeItem.selectedLayers[3],app.project.activeItem.selectedLayers[2],app.project.activeItem.selectedLayers[1],undefined,app.project.activeItem.selectedLayers[0],boutonCW.value,calquetridi,boutonFront.value,);
				}
				//groupe d'annulation
				app.endUndoGroup();
			}

			//FONCTION QUAND ON CLIQUE SUR GOAL
			function pregoal(){

			if (app.project.activeItem.selectedLayers.length == 1) {
				//groupe d'annulation
				app.beginUndoGroup("Duik - Goal");
				Duik.goal(app.project.activeItem.selectedLayers[0],undefined);
				//groupe d'annulation
				app.endUndoGroup();
			}
			else if (app.project.activeItem.selectedLayers.length == 2) {
				//groupe d'annulation
				app.beginUndoGroup("Duik - Goal");
				Duik.goal(app.project.activeItem.selectedLayers[0],app.project.activeItem.selectedLayers[1]);
				//groupe d'annulation
				app.endUndoGroup();
			}
			else{alert(getMessage(10),"Attention",true);}
			}

			//FONCTION QUAND ON CLIQUE SUR CREER UN CONTROLEUR
			function controleur(){

				//vérifions qu'il n'y a qu'un calque sélectionné 
				 if (app.project.activeItem.selectedLayers.length > 0) {
						//  début de groupe d'annulation
						app.beginUndoGroup("Duik - " + getMessage(116));
						Duik.addControllers(app.project.activeItem.selectedLayers);
						//fin du groupe d'annulation
						app.endUndoGroup();
					} else { alert(getMessage(11)); }

			}
			 
			//FONCTION POUR AJOUTER UN (DES) BONE(S)
			function bone(){
					
				//  début de groupe d'annulation
				app.beginUndoGroup("Duik - Bone");

				//le(s) calque(s) sélectionné(s)
				var calques = app.project.activeItem.selectedLayers ;
				if (calques.length ==0) { alert(getMessage(13),"Attention"); return; }
				
				Duik.addBones(calques);

				//fin du groupe d'annulation
				app.endUndoGroup();


			}
			 
			//FONCTION DU BOUTON POUR MESURER
			function mesure() {
					
					resultat = mesurer();
							if (resultat == 0) {
					resultattexte.text = getMessage(16);
					mesurefenetre.show();
					}
					else if (resultat/resultat == 1) {
					resultattexte.text = getMessage(17) + resultat + " pixels.";
					mesurefenetre.show();
					}

				}

			//FONCTION ZERO
			function zero(){
				
			//vérifions qu'il y a 1 layer sélectionnés
			if (app.project.activeItem.selectedLayers.length > 0) {	
				
						//  début de groupe d'annulation
						app.beginUndoGroup("Duik - Zero");	
				
						Duik.addZeros(app.project.activeItem.selectedLayers);


				
						//  fin de groupe d'annulation
						app.endUndoGroup();
				
				
				
			} else { alert(getMessage(50),"Attention",true); }

				}

			//FONCTION RENOMMER
			function rename() {

			if (app.project.activeItem.selectedLayers.length > 0) {
				
					var prefixe = "";
					prefixtexte.value ? prefixe = prefix.text : prefixe = "";
					var nom = "";
					nametexte.value ? nom = name.text : nom = "";
					var suffixe = "";
					suffixtexte.value ? suffixe = suffix.text : suffixe = "";
					
					if (!(!suffixtexte.value && !nametexte.value && !prefixtexte.value && !numerotexte.value)) {
						
						for (i=0;i<app.project.activeItem.selectedLayers.length;i++) {
						nametexte.value ? nom = nom : nom = app.project.activeItem.selectedLayers[i].name;
						if (!numerotexte.value)
						app.project.activeItem.selectedLayers[i].name = prefixe + nom + suffixe;
						else {
							var numbering = eval(numero.text) + i;
							app.project.activeItem.selectedLayers[i].name = prefixe + nom + suffixe + numbering;
							}
						}
						
					}
				
				} else { alert(getMessage(51),"Attention",true); }
				
				
				}

			//FONCTION ROT MORPH
			function rotmorph()
			{
			// Vérifions si il n'y a qu'un calque sélectionné
			if (app.project.activeItem.selectedLayers.length == 1)
			{

				var calque = app.project.activeItem.selectedLayers[0];

				if (calque.selectedProperties.length != 0)
				{
					//Prendre l'effet
					var effet = app.project.activeItem.selectedLayers[0].selectedProperties.pop();
					//on vérifie si on peut mettre une expression, sinon inutile de continuer
					if(!effet.canSetExpression) { return; }
					
					//  début de groupe d'annulation
					app.beginUndoGroup("Duik - Rotation Morph");
					

					Duik.rotationMorph(app.project.activeItem.selectedLayers[0],effet);

					app.endUndoGroup();

					}

				}
			}
			
			//REPLACE IN EXPRESSIONS UI
			function onRieButtonClicked()
			{
				rieWindow.show();
			}
			
			//REPLACE IN EXPRESSIONS
			function replaceInExpr()
			{
				if (rieOldEdit.text == rieNewEdit.text) return;
				
				if (rieCurrentCompButton.value)
				{
					if (rieAllLayersButton.value)
					{
						app.beginUndoGroup("Duik - Replace in Expressions");
						Duik.replaceInLayersExpressions(app.project.activeItem.layers,rieOldEdit.text,rieNewEdit.text);
						app.endUndoGroup();
					}
					else if (app.project.activeItem.selectedLayers.length > 0)
					{
						app.beginUndoGroup("Duik - Replace in Expressions");
						Duik.replaceInLayersExpressions(app.project.activeItem.selectedLayers,rieOldEdit.text,rieNewEdit.text);
						app.endUndoGroup();
					}
				}
				else
				{
					for(var i = 1; i<=app.project.items.length ; i++)
					{
						app.beginUndoGroup("Duik - Replace in Expressions");
						var item = app.project.item(i);
						if (item instanceof CompItem)
						{
							Duik.replaceInLayersExpressions(item.layers,rieOldEdit.text,rieNewEdit.text);
						}
						app.endUndoGroup();
					}
				}
			}
			
			//=============== ANIMATION =========================

			//FONCTION WIGGLE OK
			function wiggleDimensions(){

				//vérifions qu'il n'y a qu'un calque sélectionné
				if (app.project.activeItem.selectedLayers[0].selectedProperties.length > 0)
				{
					
					//  début de groupe d'annulation
					app.beginUndoGroup("Duik - Wiggle");
					
					//le calque
					var calque = app.project.activeItem.selectedLayers[0];
					//la prop
					var prop = calque.selectedProperties.pop();
					Duik.wiggle(calque,prop,wiggleSeparate.value);
					
					//fin du groupe d'annulation
					app.endUndoGroup();
					
				} else { alert(getMessage(12)); }

				fenetrewiggle.close();
			}

			//FONCTION WIGGLE
			function wiggle(){
				//regarder le nombre d'axes dans la propriété sélectionnée
				var prop =  app.project.activeItem.selectedLayers[0].selectedProperties[app.project.activeItem.selectedLayers[0].selectedProperties.length-1];
				var dim = prop.propertyValueType ;
				if (dim == PropertyValueType.ThreeD_SPATIAL || dim == PropertyValueType.ThreeD || dim == PropertyValueType.TwoD_SPATIAL || dim == PropertyValueType.TwoD)
				{
					fenetrewiggle.show();
				}
				else
				{
					Duik.wiggle(app.project.activeItem.selectedLayers[0],prop);
				}
			}

			//FONCTION ROUE
			function creroue(){
				rayonfenetre.show();
				}

			//FONCTION QUI MESURE LE RAYON D'UNE ROUE
			function mesurer() {
				
			//vérifions qu'il y a deux calques sélectionnés
				if (app.project.activeItem.selectedLayers.length == 2){

				var dist = Duik.utils.getDistance(app.project.activeItem.selectedLayers[0],app.project.activeItem.selectedLayers[1]);
				rayonbouton.text = dist;
				return dist;

			} else { alert(getMessage(15),"Attention",true); }

				}

			//FONCTION QUI CREE UNE ROUE
			function roue() {
						OA = parseFloat(rayonbouton.text);	

						if (OA != 0 && OA != NaN) {
							
						//  début de groupe d'annulation
						app.beginUndoGroup(getMessage(18));
							
						Duik.wheel(app.project.activeItem.selectedLayers[0],OA,roueC.value);
						
						//  fin de groupe d'annulation
						app.endUndoGroup();

						} else { alert (getMessage(19),getMessage(20),true); }
						
						rayonfenetre.hide();
				}
				
			//FONCTION LENTILLE
			function lentille() {

			//les calques sélectionnés :
			var calques = app.project.activeItem.selectedLayers;
						
						//vérifions qu'il y a plusieurs calques sélectionnés
						if (calques.length > 1){

						//  début de groupe d'annulation
						app.beginUndoGroup(getMessage(29));
				
						Duik.lensFlare(calques);
						
						
						//fin du groupe d'annulation			
						app.endUndoGroup();

						} else {
							alert(getMessage(33));
							}
						
						
			}

			//FONCTION LIEN DE DISTANCE
			function distanceLink() {
							
			//vérifions qu'il n'y a bien que deux calques de sélectionnés
			if (app.project.activeItem.selectedLayers.length == 2) {
				
						
			//récupérer le nom du calque de référence
			var calqueRef = app.project.activeItem.selectedLayers[1];
				
			//récupérer le calque de destination
			var calque = app.project.activeItem.selectedLayers[0];

			//Prendre l'effet
			var effet = app.project.activeItem.selectedLayers[0].selectedProperties.pop();

				//  début de groupe d'annulation
				app.beginUndoGroup(getMessage(34));

				Duik.distanceLink(calque,effet,calqueRef);
				
				//fin du groupe d'annulation
				app.endUndoGroup();
				
				}
			}

			//FONCTION SPRING
			function spring() {
				// Vérifions si il y a des calques sélectionnés
				if (app.project.activeItem.selectedLayers.length < 1){ alert(getMessage(47),getMessage(49)); return;}
					
				var calque = app.project.activeItem.selectedLayers[0];

				//vérifier si il y a des propriétés sélectionnées
				if (calque.selectedProperties.length == 0){ alert(getMessage(47),getMessage(48)); return;}

				//regarder si on a des trucs en position
				var pos = false;
				for (i = 0;i < calque.selectedProperties.length ; i++)
				{
					if (calque.selectedProperties[i].matchName == "ADBE Position")
					{
						pos = true;
						break;
					}
				}
				if (pos) fenetrespring.show();
				else
				{
					boutonLightSpring.value = true;
					springok();
				}
			}

			function springok() {
				
			//  début de groupe d'annulation
			app.beginUndoGroup(getMessage(42));

			var ef = app.project.activeItem.selectedLayers[0].selectedProperties.pop();
			Duik.spring(ef,ef = app.project.activeItem.selectedLayers[0],!boutonLightSpring.value);

			//fin du groupe d'annulation
			app.endUndoGroup();

			}

			//FONCTION OSCILLATION
			function oscillation() {
					// Vérifions si il n'y a qu'un calque sélectionné
			if (app.project.activeItem.selectedLayers.length == 1){
				
			var calque = app.project.activeItem.selectedLayers[0];

			if (calque.selectedProperties.length != 0){
				
				//Prendre l'effet
			var effet = app.project.activeItem.selectedLayers[0].selectedProperties.pop();
			//on vérifie sin on peut mettre une expression, sinon inutile de continuer
			if(effet.canSetExpression) {
				
			//  début de groupe d'annulation
			app.beginUndoGroup(getMessage(52));
				
			Duik.swing(calque,effet);
			//fin du groupe d'annulation
			app.endUndoGroup();

			}else{alert(getMessage(38),getMessage(46));}
			}else{alert(getMessage(47),getMessage(48));}
			}else{alert(getMessage(47),getMessage(49));}


				}

			//FONCTIONS EXPOSITION
			function exposure() {
				fenetreexposure.show();
			}

			function exposureSelect() {
				
				lowerExposureGroup.enabled = adaptativeExposureButton.value;
				upperExposureGroup.enabled = adaptativeExposureButton.value;
				precisionGroup.enabled = adaptativeExposureButton.value;
			}

			function detectExposurePrecision() {
				var layer = app.project.activeItem.selectedLayers[0];
				var prop = layer.selectedProperties[layer.selectedProperties.length-1];
				var speed = Duik.utils.getAverageSpeed(layer,prop);
				var exp = (parseInt(lowerExposureEdit.text) + parseInt(upperExposureEdit.text)) /2
				if (speed > 0) precisionEdit.text = parseInt(1/(speed/10000)/exp);
				else precisionEdit.text = 0;
			}

			function nframes() {
				var layer = app.project.activeItem.selectedLayers[0];
				var prop = app.project.activeItem.selectedLayers[0].selectedProperties.pop();
				
				app.beginUndoGroup("Duik Auto-Exposure");
				Duik.exposure(layer,prop,adaptativeExposureButton.value,parseInt(precisionEdit.text),parseInt(lowerExposureEdit.text),parseInt(upperExposureEdit.text));
				app.endUndoGroup();
				
				fenetreexposure.close();

				}

			//FONCTION PATH FOLLOW
			function pathFollow() {
				// Vérifions si il n'y a qu'un calque sélectionné
				if (app.project.activeItem.selectedLayers.length == 1)
				{
					//  début de groupe d'annulation
					app.beginUndoGroup(getMessage(61));
					Duik.pathFollow(app.project.activeItem.selectedLayers[0]);
					app.endUndoGroup();	
				}
				else
				{
					alert(getMessage(49));
				}
			}	
			
			//COPY AND PASTE ANIM
			function copyAnim() {
				var layers = app.project.activeItem.selectedLayers;
				if (layers.length == 0)
				{
					alert("Please select the layers from which you want to save animation");
					return;
				}
				
				var selected = false; // est ce qu'il y a des clefs sélectionnées (ou est ce qu'on fait sur toute l'anim)
				var startTime = 86339; // instant de début de l'anim à sauvegarder
				var endTime = app.project.activeItem.workAreaDuration + app.project.activeItem.workAreaStart;
				
				//if there are selected keys
				for (var i = 0; i < layers.length ; i++)
				{
					selected = Duik.utils.hasSelectedKeys(layers[i]);
					if (selected) break;
					selected = Duik.utils.hasSelectedKeys(layers[i].transform); //faut recommencer sur les transformations, c'est pas des propriétés comme les autres pour after... #StupidAFX
					if (selected) break;
				}

				
				// 2 - chercher l'instant de la première clef dans le temps, si ya des clefs sélectionnées
				if (selected)
				{
					for (var i = 0; i < layers.length ; i++)
					{
						var testTime = Duik.utils.getFirstKeyTime(layers[i]);
						if (testTime < startTime) startTime = testTime;
						testTime = Duik.utils.getFirstKeyTime(layers[i].transform); //faut recommencer sur les transformations, c'est pas des propriétés comme les autres pour after... #StupidAFX
						if (testTime < startTime) startTime = testTime;
					}
				}
				else
				{
					startTime = app.project.activeItem.workAreaStart;
				}
				
				Duik.copyAnim(layers,selected,startTime,endTime);
			}
			
			function pasteAnim(animation) {
				app.beginUndoGroup("Duik - Paste Anim");
				var totalPasted = Duik.pasteAnim(app.project.activeItem.layers,Duik.copiedAnim,app.project.activeItem.time);
				app.endUndoGroup();
				if (totalPasted != Duik.copiedAnim.length) alert("Pasted animation on " + totalPasted + " layers.\n\n" + (Duik.copiedAnim.length-totalPasted) + " layers not found.");
			}
			//=============== INTERPOLATION =====================

			//FONCTION MORPHER
			function morpher() {

			//  début de groupe d'annulation
			app.beginUndoGroup(getMessage(28));

			Duik.morpher(app.project.activeItem.selectedLayers);

			//fin du groupe d'annulation
			app.endUndoGroup();


			}

			//=============== CAMERAS ===========================

			//FONCTION TARGET CAM
			function controlcam() {
				//vérifier qu'il n'y a qu'un calque sélectionné
			if (app.project.activeItem.selectedLayers.length == 1){
				//vérifier que c'est une caméra
				if (app.project.activeItem.selectedLayers[0] instanceof CameraLayer) {

			//début du groupe d'annulation
			app.beginUndoGroup(getMessage(21));


			//récupérer la caméra
			var camera = app.project.activeItem.selectedLayers[0];

			//créer le target
			var target = app.project.activeItem.layers.addNull();
			target.name = camera.name + " target";
			target.threeDLayer = true;
			target.position.setValue(camera.transform.pointOfInterest.value);

			//créer la cam
			var cam = app.project.activeItem.layers.addNull();
			cam.name = camera.name + " position";
			cam.threeDLayer = true;
			cam.position.setValue(camera.transform.position.value);

			//créer celui tout en haut
			var controleur = app.project.activeItem.layers.addNull();
			controleur.name = "Control_" + camera.name;
			controleur.threeDLayer = true;

			cam.parent = controleur;
			target.parent = controleur;

			//définir les expressions
			camera.position.expression = "thisComp.layer(\"" + cam.name + "\").toWorld(thisComp.layer(\"" + cam.name + "\").transform.anchorPoint)";
			camera.pointOfInterest.expression = "thisComp.layer(\"" + target.name + "\").toWorld(thisComp.layer(\"" + target.name + "\").transform.anchorPoint)";
			camera.orientation.expression = "value + thisComp.layer(\"" + cam.name + "\").transform.orientation";
			camera.xRotation.expression = "value + thisComp.layer(\"" + cam.name + "\").transform.xRotation";
			camera.yRotation.expression = "value + thisComp.layer(\"" + cam.name + "\").transform.yRotation";
			camera.rotation.expression = "value + thisComp.layer(\"" + cam.name + "\").transform.rotation";

			//bloquer la camera
			camera.locked = true;

			//fin du groupe d'annulation
			app.endUndoGroup();

			}
			else { alert (getMessage(22),getMessage(23),true); }
			}

			else { alert (getMessage(22),getMessage(24),true); }
				
				
				
				}

			//FONCTION MULTIPLAN
			function multiplan()
			{
				//début du groupe d'annulation
				app.beginUndoGroup("Multi Plan");
				Duik.multiplane(parseInt(nombre.text),pos.value,sca.value);
				//fin du groupe d'annulation
				app.endUndoGroup();
				fenetremultiplan.hide();
			}	
			
			//============= SETTINGS ============================

			//FONCTION POUR AFFICHER DE L'AIDE
			function help(){
			//alert(getMessage(14));
			alert("This is a test version, if you encounter any problem,\nplease notify it by email to duduf@duduf.com");
			}

			//FONCTION POUR CHOISIR LA LANGUE
			function choixLangue() {
				if (boutonlangue.selection == 0) app.settings.saveSetting("duik","lang","FRENCH");
				if (boutonlangue.selection == 1) app.settings.saveSetting("duik","lang","ENGLISH");
				if (boutonlangue.selection == 2) app.settings.saveSetting("duik","lang","SPANISH");
				if (boutonlangue.selection == 3) app.settings.saveSetting("duik","lang","GERMAN");
				if (boutonlangue.selection == 4) app.settings.saveSetting("duik","lang","BAHASA");
				if (boutonlangue.selection == 5) app.settings.saveSetting("duik","lang","PORTUGUESE");
				}

			//FONCTIONS CALC
			function calc() {

				resultatcalc1.text = resultatcalc2.text;
				
				if (eval(textecalc.text) != null)
				{
					textecalc.text.length < 15 ? resultatcalc2.text = textecalc.text + " = " + eval(textecalc.text) : resultatcalc2.text = "(...) = " + eval(textecalc.text) ;
					textecalc.text = eval(textecalc.text);
				}
				else 
					resultatcalc2.text ="error";
			}	

			//============= INTERPOLATIONS ======================
			function lineaire() {

			for (i=0;i<app.project.activeItem.selectedLayers.length;i++) {
				for (j=0;j<app.project.activeItem.selectedLayers[i].selectedProperties.length;j++) {
					if (app.project.activeItem.selectedLayers[i].selectedProperties[j].canVaryOverTime) {
						for (k=0;k<app.project.activeItem.selectedLayers[i].selectedProperties[j].selectedKeys.length;k++) {
							var prop = app.project.activeItem.selectedLayers[i].selectedProperties[j];
							prop.setInterpolationTypeAtKey(prop.selectedKeys[k],KeyframeInterpolationType.LINEAR);

							}
						}
					}
				}
			}

			function lissageA() {

			for (i=0;i<app.project.activeItem.selectedLayers.length;i++) {
				for (j=0;j<app.project.activeItem.selectedLayers[i].selectedProperties.length;j++) {
					if (app.project.activeItem.selectedLayers[i].selectedProperties[j].canVaryOverTime) {
						for (k=0;k<app.project.activeItem.selectedLayers[i].selectedProperties[j].selectedKeys.length;k++) {
							var prop = app.project.activeItem.selectedLayers[i].selectedProperties[j];
							prop.setInterpolationTypeAtKey(prop.selectedKeys[k],KeyframeInterpolationType.BEZIER,KeyframeInterpolationType.LINEAR);

							}
						}
					}
				}
			}

			function lissageE() {
				
			for (i=0;i<app.project.activeItem.selectedLayers.length;i++) {
				for (j=0;j<app.project.activeItem.selectedLayers[i].selectedProperties.length;j++) {
					if (app.project.activeItem.selectedLayers[i].selectedProperties[j].canVaryOverTime) {
						for (k=0;k<app.project.activeItem.selectedLayers[i].selectedProperties[j].selectedKeys.length;k++) {
							var prop = app.project.activeItem.selectedLayers[i].selectedProperties[j];
							prop.setInterpolationTypeAtKey(prop.selectedKeys[k],KeyframeInterpolationType.LINEAR,KeyframeInterpolationType.BEZIER);

							}
						}
					}
				}
			}

			function lissage() {

			for (i=0;i<app.project.activeItem.selectedLayers.length;i++) {
				for (j=0;j<app.project.activeItem.selectedLayers[i].selectedProperties.length;j++) {
					if (app.project.activeItem.selectedLayers[i].selectedProperties[j].canVaryOverTime) {
						for (k=0;k<app.project.activeItem.selectedLayers[i].selectedProperties[j].selectedKeys.length;k++) {
							var prop = app.project.activeItem.selectedLayers[i].selectedProperties[j];
							prop.setInterpolationTypeAtKey(prop.selectedKeys[k],KeyframeInterpolationType.BEZIER);
							prop.setTemporalContinuousAtKey(prop.selectedKeys[k], false);
							var easeIn = new KeyframeEase(0,100/3);
							if (!prop.isSpatial && prop.value.length == 3) { prop.setTemporalEaseAtKey(prop.selectedKeys[k],[easeIn,easeIn,easeIn]); }
							else if (!prop.isSpatial && prop.value.length == 2) { prop.setTemporalEaseAtKey(prop.selectedKeys[k],[easeIn,easeIn]); }
							else { prop.setTemporalEaseAtKey(prop.selectedKeys[k],[easeIn]); }
							}
						}
					}
				}
			}

			function continu() {
				
			for (i=0;i<app.project.activeItem.selectedLayers.length;i++) {
				for (j=0;j<app.project.activeItem.selectedLayers[i].selectedProperties.length;j++) {
					if (app.project.activeItem.selectedLayers[i].selectedProperties[j].canVaryOverTime) {
						for (k=0;k<app.project.activeItem.selectedLayers[i].selectedProperties[j].selectedKeys.length;k++) {
							var prop = app.project.activeItem.selectedLayers[i].selectedProperties[j];
							prop.setInterpolationTypeAtKey(prop.selectedKeys[k],KeyframeInterpolationType.BEZIER);
							prop.setTemporalContinuousAtKey(prop.selectedKeys[k], true);
							prop.setTemporalAutoBezierAtKey(prop.selectedKeys[k], true);
							}
						}
					}
				}
			}

			function maintien() {
				
			for (i=0;i<app.project.activeItem.selectedLayers.length;i++) {
				for (j=0;j<app.project.activeItem.selectedLayers[i].selectedProperties.length;j++) {
					if (app.project.activeItem.selectedLayers[i].selectedProperties[j].canVaryOverTime) {
						for (k=0;k<app.project.activeItem.selectedLayers[i].selectedProperties[j].selectedKeys.length;k++) {
							var prop = app.project.activeItem.selectedLayers[i].selectedProperties[j];
							prop.setInterpolationTypeAtKey(prop.selectedKeys[k],KeyframeInterpolationType.HOLD);

							}
						}
					}
				}
			}

			function infl(valeur) {
				
			for (i=0;i<app.project.activeItem.selectedLayers.length;i++) {
				for (j=0;j<app.project.activeItem.selectedLayers[i].selectedProperties.length;j++) {
					if (app.project.activeItem.selectedLayers[i].selectedProperties[j].canVaryOverTime) {
						for (k=0;k<app.project.activeItem.selectedLayers[i].selectedProperties[j].selectedKeys.length;k++) {
							var prop = app.project.activeItem.selectedLayers[i].selectedProperties[j]; 
							if (!prop.isSpatial && prop.value.length == 3) {
								var easeIn1 =  new KeyframeEase(prop.keyInTemporalEase(prop.selectedKeys[k])[0].speed,boutonApproche.value ? valeur : prop.keyInTemporalEase(prop.selectedKeys[k])[0].influence);
								var easeIn2 =  new KeyframeEase(prop.keyInTemporalEase(prop.selectedKeys[k])[1].speed,boutonApproche.value ? valeur : prop.keyInTemporalEase(prop.selectedKeys[k])[1].influence);
								var easeIn3 =  new KeyframeEase(prop.keyInTemporalEase(prop.selectedKeys[k])[2].speed,boutonApproche.value ? valeur : prop.keyInTemporalEase(prop.selectedKeys[k])[2].influence);
								var easeOut1 = new KeyframeEase(prop.keyOutTemporalEase(prop.selectedKeys[k])[0].speed,boutonEloignement.value ? valeur : prop.keyOutTemporalEase(prop.selectedKeys[k])[0].influence);
								var easeOut2 = new KeyframeEase(prop.keyOutTemporalEase(prop.selectedKeys[k])[1].speed,boutonEloignement.value ? valeur : prop.keyOutTemporalEase(prop.selectedKeys[k])[1].influence);
								var easeOut3 = new KeyframeEase(prop.keyOutTemporalEase(prop.selectedKeys[k])[2].speed,boutonEloignement.value ? valeur : prop.keyOutTemporalEase(prop.selectedKeys[k])[2].influence);
								prop.setTemporalEaseAtKey(prop.selectedKeys[k],[easeIn1,easeIn2,easeIn3],[easeOut1,easeOut2,easeOut3]);
								}
							else if (!prop.isSpatial && prop.value.length == 2) {
								var easeIn1 =  new KeyframeEase(prop.keyInTemporalEase(prop.selectedKeys[k])[0].speed,boutonApproche.value ? valeur : prop.keyInTemporalEase(prop.selectedKeys[k])[0].influence);
								var easeIn2 =  new KeyframeEase(prop.keyInTemporalEase(prop.selectedKeys[k])[1].speed,boutonApproche.value ? valeur : prop.keyInTemporalEase(prop.selectedKeys[k])[1].influence);
								var easeOut1 = new KeyframeEase(prop.keyOutTemporalEase(prop.selectedKeys[k])[0].speed,boutonEloignement.value ? valeur : prop.keyOutTemporalEase(prop.selectedKeys[k])[0].influence);
								var easeOut2 = new KeyframeEase(prop.keyOutTemporalEase(prop.selectedKeys[k])[1].speed,boutonEloignement.value ? valeur : prop.keyOutTemporalEase(prop.selectedKeys[k])[1].influence);
								prop.setTemporalEaseAtKey(prop.selectedKeys[k],[easeIn1,easeIn2],[easeOut1,easeOut2]);
								}
							else {
								var easeIn =  new KeyframeEase(prop.keyInTemporalEase(prop.selectedKeys[k])[0].speed,boutonApproche.value ? valeur : prop.keyInTemporalEase(prop.selectedKeys[k])[0].influence);
								var easeOut = new KeyframeEase(prop.keyOutTemporalEase(prop.selectedKeys[k])[0].speed,boutonEloignement.value ? valeur : prop.keyOutTemporalEase(prop.selectedKeys[k])[0].influence);
								prop.setTemporalEaseAtKey(prop.selectedKeys[k],[easeIn],[easeOut]);
								}
							}
						}
					}
				}     
			}
			
		}


		//===============================================
		//================ UI ===========================
		//===============================================
		{
		//TODO renommer les éléments d'UI
			
		var dossierIcones = Folder.userData.absoluteURI  + "/DuIK/";
		//dossierIcones = "C:/Users/perso/Documents/03_DEVELOPPEMENT/AE Scripts/DuDuF IK Tools/Duik Icons/";
		var animationSaved = [];

		//une fonction pour ajouter les boutons plus rapidement :
		function addIconButton(conteneur,image,text){
			var bouton = conteneur.add("iconbutton",undefined,image);
			//bouton.size = [108,22];
			bouton.text = text;
			return bouton;
		}
		function addButton(conteneur,texte){
			var bouton = conteneur.add("button",undefined,texte);
			//bouton.size = [108,18];
			return bouton;
		}
		//quatre fonctions pour ajouter les panneaux plus rapidement :
		function addVPanel(conteneur){
			var groupe = conteneur.add("group");
			groupe.orientation = "column";
			groupe.alignChildren = ["fill","fill"];
			groupe.alignment = ["fill","top"];
			groupe.spacing = 2;
			groupe.margins = 1;
			groupe.alignment = ["center","top"];
			return groupe;
		}
		function addHPanel(conteneur){
			var groupe = conteneur.add("group");
			groupe.orientation = "row";
			groupe.alignChildren = ["fill","fill"];
			groupe.alignment = ["fill","top"];
			groupe.spacing = 2;
			groupe.margins = 1;
			groupe.alignment = ["center","top"];
			return groupe;
		}
		function addHGroup(conteneur){
			var groupe = conteneur.add("group");
			groupe.alignChildren = ["fill","fill"];
			groupe.orientation = "row";
			groupe.spacing = 2;
			groupe.margins = 0;
			return groupe;
		}
		function addVGroup(conteneur){
			var groupe = conteneur.add("group");
			groupe.alignChildren = ["fill","fill"];
			groupe.orientation = "column";
			groupe.spacing = 2;
			groupe.margins = 0;
			return groupe;
		}
		//fonction pour ajouter des séparateurs
		function addSeparator(conteneur,name) {
			conteneur = addHGroup(conteneur);
			conteneur.margins = 5;
			if (name.length > 0)
			{
				var textName = conteneur.add("statictext",undefined,name);
				textName.alignment = ["left","fill"];
			}
			var separator1 = conteneur.add("panel",undefined);
			separator1.alignment = ["fill","center"];
			separator1.height = 0;
		}
		//fonction pour les boites de dialogue
		function createDialog(titre,hasokbutton,okfonction){
			var f = new Window ("palette",titre,undefined,{closeButton:false,resizeable:false});
			f.spacing = 2;
			f.margins = 5;
			f.alignChildren = ["fill","top"];
			f.groupe = f.add("group");
			f.groupe.alignChildren = ["fill","top"];
			var fgroupeBoutons = addHGroup(f);
			fgroupeBoutons.alignment = ["fill","bottom"];
			fgroupeBoutons.margins = 10;
			if (hasokbutton)
			{
				var fcancel = addButton(fgroupeBoutons,"Annuler");
				fcancel.onClick = function() { f.hide(); };
				fcancel.alignment = ["left","bottom"];
				var fok = addButton(fgroupeBoutons,"OK");
				fok.alignment = ["right","bottom"];
				if (okfonction != undefined) fok.onClick = function() {f.hide(); okfonction();}
			}
			else
			{
				var fcancel = addButton(fgroupeBoutons,"Fermer");
				fcancel.onClick = function() { f.hide(); };
			}
			
			return f;
		}

				//replace in expressions
				{
					var rieWindow = new Window ("palette","Replace in expressions",undefined,{closeButton:false,resizeable:true});
					rieWindow.spacing = 2;
					rieWindow.margins = 5;
					rieWindow.alignChildren = ["fill","top"];
					rieWindow.minimumSize = [300,100];
					var rieOldGroup = addHGroup(rieWindow);
					var rieOldText = rieOldGroup.add("statictext",undefined,"Old:");
					rieOldText.alignment = ["left","top"];
					var rieOldEdit = rieOldGroup.add("edittext",undefined,"");
					var rieNewGroup = addHGroup(rieWindow);
					var rieNewText = rieNewGroup.add("statictext",undefined,"New:");
					rieNewText.alignment = ["left","top"];
					var rieNewEdit = rieNewGroup.add("edittext",undefined,"");
					var rieCompGroup = addHGroup(rieWindow);
					rieCompGroup.alignment = ["center","top"];
					var rieCurrentCompButton = rieCompGroup.add("radiobutton",undefined,"Active comp");
					var rieAllCompsButton = rieCompGroup.add("radiobutton",undefined,"All comps");
					rieCurrentCompButton.onClick = function () {
						rieLayerGroup.enabled = rieCurrentCompButton.value;
					}
					rieAllCompsButton.onClick = function () {
						rieLayerGroup.enabled = rieCurrentCompButton.value;
					}
					rieCurrentCompButton.value = true;
					var rieLayerGroup = addHGroup(rieWindow);
					rieLayerGroup.alignment = ["center","top"];
					var rieSelectedLayersButton = rieLayerGroup.add("radiobutton",undefined,"Selected layers");
					var rieAllLayersButton = rieLayerGroup.add("radiobutton",undefined,"All layers");
					rieAllLayersButton.value = true;
					var rieOKButton = rieWindow.add("button",undefined,"Replace in expressions");
					rieOKButton.onClick = replaceInExpr;
					var rieCancelButton = rieWindow.add("button",undefined,"Close");
					rieCancelButton.onClick = function () { rieWindow.hide();};
					rieWindow.layout.layout(true);
					rieWindow.layout.resize();
					rieWindow.onResizing = rieWindow.onResize = function () { rieWindow.layout.resize(); }
				}
				//l'expo
				{
					var fenetreexposure = createDialog(getMessage(123),true,nframes);
					fenetreexposure.groupe.orientation = "column";
					var evenExposureButton = fenetreexposure.groupe.add("radiobutton",undefined,"Fixed");
					evenExposureButton.onClick = exposureSelect;
					var adaptativeExposureButton = fenetreexposure.groupe.add("radiobutton",undefined,"Adaptative");
					adaptativeExposureButton.value = true;
					adaptativeExposureButton.onClick = exposureSelect;
					var lowerExposureGroup = addHGroup(fenetreexposure.groupe);
					lowerExposureGroup.add("statictext",undefined,"Lower exp. limit: ");
					var lowerExposureEdit = lowerExposureGroup.add("edittext",undefined,"1");
					var upperExposureGroup = addHGroup(fenetreexposure.groupe);
					upperExposureGroup.add("statictext",undefined,"Upper exp. limit: ");
					var upperExposureEdit = upperExposureGroup.add("edittext",undefined,"4");
					var precisionGroup = addHGroup(fenetreexposure.groupe);
					precisionGroup.add("statictext",undefined,"Precision: ");
					var precisionEdit = precisionGroup.add("edittext",undefined,"1000");
					var precisionButton = precisionGroup.add("button",undefined,"Detect");
					precisionButton.onClick = detectExposurePrecision;
				}
				//les options de création de spring
				{
					var fenetrespring = createDialog(getMessage(126),true,springok);
					fenetrespring.groupe.orientation = "column";
					fenetrespring.groupe.add("statictext",undefined,getMessage(181));
					fenetrespring.groupe.add("statictext",undefined,getMessage(182));
					fenetrespring.groupe.add("statictext",undefined,"----------");
					//boutons léger ou simulation
					var boutonLightSpring = fenetrespring.groupe.add("radiobutton",undefined,getMessage(179));
					fenetrespring.groupe.add("statictext",undefined,getMessage(183));
					boutonLightSpring.value = false;
					fenetrespring.groupe.add("statictext",undefined,"----------");
					var boutonSimulatedSpring = fenetrespring.groupe.add("radiobutton",undefined,getMessage(180));
					fenetrespring.groupe.add("statictext",undefined,getMessage(184));
					fenetrespring.groupe.add("statictext",undefined,getMessage(185));
					fenetrespring.groupe.add("statictext",undefined,"----------");
					boutonLightSpring.onClick = function () { boutonSimulatedSpring.value = !boutonLightSpring.value;};
					boutonSimulatedSpring.onClick = function () { boutonLightSpring.value = !boutonSimulatedSpring.value;};
					boutonSimulatedSpring.value = true;
				}
				//la fenetre Autorig
				{
					var fenetreAutorig = createDialog(getMessage(142),true,startAutoRig);
					
					//BOUTONS DES CALQUES
					var autorigGroupeCalques = fenetreAutorig.groupe.add("group"); //contient les calques : des groupes en row de text + dropdownlist
					autorigGroupeCalques.orientation = "column";
					autorigGroupeCalques.spacing = 2;
					autorigGroupeCalques.alignChildren = "fill";
					var texte0 = autorigGroupeCalques.add("statictext",undefined,getMessage(143));
					texte0.alignment = ["left","top"];
					//tete
					var autorigGroupe1 = autorigGroupeCalques.add("group");
					autorigGroupe1.alignChildren = ["left","center"];
					autorigGroupe1.add("statictext",undefined,getMessage(144));
					var teteBouton = autorigGroupe1.add("dropdownlist");
					teteBouton.alignment = ["right","center"];
					//cou
					var autorigGroupe2 = autorigGroupeCalques.add("group");
					autorigGroupe2.add("statictext",undefined,getMessage(145));
					var couBouton = autorigGroupe2.add("dropdownlist");
					couBouton.alignment = ["right","center"];
					//corps
					var autorigGroupe3 = autorigGroupeCalques.add("group");
					autorigGroupe3.add("statictext",undefined,getMessage(146));
					var corpsBouton = autorigGroupe3.add("dropdownlist");
					corpsBouton.alignment = ["right","center"];
					//bassin
					var autorigGroupe4 = autorigGroupeCalques.add("group");
					var texte4 = autorigGroupe4.add("statictext",undefined,getMessage(147));
					var bassinBouton = autorigGroupe4.add("dropdownlist");
					bassinBouton.alignment = ["right","center"];
					//bras g
					var autorigGroupe5 = autorigGroupeCalques.add("group");
					autorigGroupe5.add("statictext",undefined,getMessage(148));
					var brasGBouton = autorigGroupe5.add("dropdownlist");
					brasGBouton.alignment = ["right","center"];
					//avant bras g
					var autorigGroupe6 = autorigGroupeCalques.add("group");
					autorigGroupe6.add("statictext",undefined,getMessage(149));
					var avantBrasGBouton = autorigGroupe6.add("dropdownlist");
					avantBrasGBouton.alignment = ["right","center"];
					//main g
					var autorigGroupe7 = autorigGroupeCalques.add("group");
					autorigGroupe7.add("statictext",undefined,getMessage(150));
					var mainGBouton = autorigGroupe7.add("dropdownlist");
					mainGBouton.alignment = ["right","center"];
					//bras d
					var autorigGroupe8 = autorigGroupeCalques.add("group");
					autorigGroupe8.add("statictext",undefined,getMessage(151));
					var brasDBouton = autorigGroupe8.add("dropdownlist");
					brasDBouton.alignment = ["right","center"];
					//avant bras d
					var autorigGroupe9 = autorigGroupeCalques.add("group");
					autorigGroupe9.add("statictext",undefined,getMessage(152));
					var avantBrasDBouton = autorigGroupe9.add("dropdownlist");
					avantBrasDBouton.alignment = ["right","center"];
					//main d
					var autorigGroupe10 = autorigGroupeCalques.add("group");
					autorigGroupe10.add("statictext",undefined,getMessage(153));
					var mainDBouton = autorigGroupe10.add("dropdownlist");
					mainDBouton.alignment = ["right","center"];
					//cuisse g
					var autorigGroupe11 = autorigGroupeCalques.add("group");
					autorigGroupe11.add("statictext",undefined,getMessage(154));
					var cuisseGBouton = autorigGroupe11.add("dropdownlist");
					cuisseGBouton.alignment = ["right","center"];
					//mollet g
					var autorigGroupe12 = autorigGroupeCalques.add("group");
					autorigGroupe12.add("statictext",undefined,getMessage(155));
					var molletGBouton = autorigGroupe12.add("dropdownlist");
					molletGBouton.alignment = ["right","center"];
					//pied g
					var autorigGroupe13 = autorigGroupeCalques.add("group");
					autorigGroupe13.add("statictext",undefined,getMessage(156));
					var piedGBouton = autorigGroupe13.add("dropdownlist");
					piedGBouton.alignment = ["right","center"];
					//cuisse d
					var autorigGroupe14 = autorigGroupeCalques.add("group");
					autorigGroupe14.add("statictext",undefined,getMessage(157));
					var cuisseDBouton = autorigGroupe14.add("dropdownlist");
					cuisseDBouton.alignment = ["right","center"];
					//mollet d
					var autorigGroupe15 = autorigGroupeCalques.add("group");
					autorigGroupe15.add("statictext",undefined,getMessage(158));
					var molletDBouton = autorigGroupe15.add("dropdownlist");
					molletDBouton.alignment = ["right","center"];
					//pied d
					var autorigGroupe16 = autorigGroupeCalques.add("group");
					autorigGroupe16.add("statictext",undefined,getMessage(159));
					var piedDBouton = autorigGroupe16.add("dropdownlist");
					piedDBouton.alignment = ["right","center"];
					
					//OPTIONS
					var autorigGroupeOptions = fenetreAutorig.groupe.add("group");
					autorigGroupeOptions.orientation = "column";
					autorigGroupeOptions.alignChildren = ["left","top"];
					autorigGroupeOptions.alignment = ["fill","top"];
					autorigGroupeOptions.add("statictext",undefined,getMessage(160));
					var autorigIKdos = autorigGroupeOptions.add("checkbox",undefined,getMessage(161));
					autorigIKdos.value = true;
					var autorigIKcou = autorigGroupeOptions.add("checkbox",undefined,getMessage(162));
					autorigIKcou.value = true;
					var autorigStretch = autorigGroupeOptions.add("checkbox",undefined,getMessage(163));
					autorigStretch.value = true;
					var autorigFK = autorigGroupeOptions.add("checkbox",undefined,getMessage(164));
					autorigFK.value = true;
								
				}
				
				//fenètre de résultat de mesure
				{
					var mesurefenetre = createDialog(getMessage(62),false);
					var resultattexte = mesurefenetre.groupe.add("statictext",undefined,"Distance = " + "" + " pixels");
				}

				//fenètre de la roue
				{
				//on a besoin d'une variable globale...
				var OA = 0;
				var rayonfenetre = createDialog(getMessage(63),true,roue);
				rayonfenetre.groupe.orientation = "column";
				var rayonGroupeRayon = addHGroup(rayonfenetre.groupe);
				//champ de saisie
				var rayonbouton = rayonGroupeRayon.add ("edittext", undefined);
				rayonbouton.size = ["100","20"];
				rayonbouton.helpTip = getMessage(64);
				rayonfenetre.groupe.add("statictext",undefined,getMessage(176));
				//bouton mesurer
				var mesurebouton = rayonGroupeRayon.add("button",undefined,getMessage(106));
				mesurebouton.value = false;
				mesurebouton.helpTip = getMessage(65);
				mesurebouton.onClick = mesurer;
				//boutons type de déplacement
				var rayonGroupeType = addHGroup(rayonfenetre.groupe);
				var roueH = rayonGroupeType.add("radiobutton",undefined,getMessage(174));
				var roueC = rayonGroupeType.add("radiobutton",undefined,getMessage(175));
				roueH.value = true;
				}
				
				// la fenetre du wiggle
				{
					var fenetrewiggle = createDialog("Wiggle",true,wiggleDimensions);
					fenetrewiggle.groupe.orientation = "row";
					//separer ou toutes
					var wiggleSeparate = fenetrewiggle.groupe.add("radiobutton",undefined,"Separate Dimensions");
					var wiggleTous = fenetrewiggle.groupe.add("radiobutton",undefined,"All Dimensions");
					wiggleTous.value = true;

				}
				
				// la fenetre de la calculatrice
				{
					 
					var fenetrecalc = createDialog(getMessage(73),false);
					fenetrecalc.groupe.orientation = "column";
					fenetrecalc.groupe.spacing = 0;
					var resultatcalc1 = fenetrecalc.groupe.add("statictext",undefined,"");
					var resultatcalc2 = fenetrecalc.groupe.add("statictext",undefined,"");
					var textecalc = fenetrecalc.groupe.add ("edittext", undefined);
					var ligneCalc1 = addHGroup(fenetrecalc.groupe);
					ligneCalc1.spacing = 0;
					ligneCalc1.alignChildren = ["fill","center"];
					var calcErase = addButton(ligneCalc1,"<-");
					calcErase.onClick = function() {textecalc.text = textecalc.text.substr(0,textecalc.text.length-1);};
					var calcCancel = addButton(ligneCalc1,"CE");
					calcCancel.onClick = function() {textecalc.text = "";};
					var calcO = addButton(ligneCalc1,"(");
					calcO.onClick = function() { textecalc.text += "(";};
					var calcC = addButton(ligneCalc1,")");
					calcC.onClick = function() { textecalc.text += ")";};
					var ligneCalc2 = addHGroup(fenetrecalc.groupe);
					ligneCalc2.spacing = 0;
					ligneCalc2.alignChildren = ["fill","center"];
					var calc7 = addButton(ligneCalc2,"7");
					calc7.onClick = function() { textecalc.text += "7";};
					var calc8 = addButton(ligneCalc2,"8");
					calc8.onClick = function() { textecalc.text += "8";};
					var calc9 = addButton(ligneCalc2,"9");
					calc9.onClick = function() { textecalc.text += "9";};
					var calcDiv = addButton(ligneCalc2,"/");
					calcDiv.onClick = function() { textecalc.text += "/";};
					var ligneCalc3 = addHGroup(fenetrecalc.groupe);
					ligneCalc3.spacing = 0;
					ligneCalc3.alignChildren = ["fill","center"];
					var calc4 = addButton(ligneCalc3,"4");
					calc4.onClick = function() { textecalc.text += "4";};
					var calc5 = addButton(ligneCalc3,"5");
					calc5.onClick = function() { textecalc.text += "5";};
					var calc6 = addButton(ligneCalc3,"6");
					calc6.onClick = function() { textecalc.text += "6";};
					var calcMult = addButton(ligneCalc3,"X");
					calcMult.onClick = function() { textecalc.text += "*";};
					var ligneCalc4 = addHGroup(fenetrecalc.groupe);
					ligneCalc4.spacing = 0;
					ligneCalc4.alignChildren = ["fill","center"];
					var calc1 = addButton(ligneCalc4,"1");
					calc1.onClick = function() { textecalc.text += "1";};
					var calc2 = addButton(ligneCalc4,"2");
					calc2.onClick = function() { textecalc.text += "2";};
					var calc3 = addButton(ligneCalc4,"3");
					calc3.onClick = function() { textecalc.text += "3";};
					var calcMin = addButton(ligneCalc4,"-");
					calcMin.onClick = function() { textecalc.text += "-";};
					var ligneCalc5 = addHGroup(fenetrecalc.groupe);
					ligneCalc5.spacing = 0;
					ligneCalc5.alignChildren = ["fill","center"];
					var calc0 = addButton(ligneCalc5,"0");
					calc0.onClick = function() { textecalc.text += "0";};
					var calcPoint = addButton(ligneCalc5,".");
					calcPoint.onClick = function() { textecalc.text += ".";};
					var calcEquals = addButton(ligneCalc5,"=");
					calcEquals.onClick = calc;
					var calcAdd = addButton(ligneCalc5,"+");
					calcAdd.onClick = function() { textecalc.text += "+";};

					fenetrecalc.layout.layout(true);
					fenetrecalc.layout.resize();

				}
				
				// la fenetre du bloc notes
				{
					var fenetrenotes = createDialog(getMessage(74),false,undefined,true);
					fenetrenotes.groupe.orientation = "column";
					fenetrenotes.groupe.alignment = ["fill","fill"];
					fenetrenotes.groupe.alignChildren = ["fill","fill"];
					var textenotes = fenetrenotes.groupe.add ("edittext", undefined,"",{multiline: true});
					textenotes.helpTip = getMessage(104);
					var charCounter = fenetrenotes.groupe.add ("statictext", undefined,"0");
					charCounter.alignment = ["fill","bottom"];
					//récup le texte sauvegardé
					var texteRecup = "";
					try { texteRecup = app.settings.getSetting("duik","notes"); }
					catch(err) { alert(err); }
					textenotes.text = texteRecup;
					charCounter.text = textenotes.text.length + " / 1500";
					
					//fonction quand texte modifié
					textenotes.onChanging = function ()
					{
						if (textenotes.text.length > 1500)
						{
							textenotes.text = textenotes.text.substring(0,1500);
						}
						charCounter.text = textenotes.text.length + " / 1500";
						app.settings.saveSetting("duik","notes",textenotes.text);
					};
					fenetrenotes.size = [300,300];
					
				}
				
				// la fenetre du rename
				{
				var fenetrerename = createDialog("Rename layers",true,rename);
				fenetrerename.size = [300,200];
				fenetrerename.groupe.orientation = "column";
				//prefix
				var groupePrefix = addHGroup(fenetrerename.groupe);
				groupePrefix.alignChildren = ["fill","center"];
				var prefixtexte = groupePrefix.add("checkbox",undefined,getMessage(107));
				prefixtexte.alignment = ["left","center"];
				var prefix = groupePrefix.add("edittext",undefined);
				prefix.enabled = false;
				prefixtexte.onClick = function() {
					prefix.enabled = prefixtexte.value;
					}
				//nom
				var groupeNom = addHGroup(fenetrerename.groupe);
				groupeNom.alignChildren = ["fill","center"];
				var nametexte = groupeNom.add("checkbox",undefined,getMessage(108));
				nametexte.alignment = ["left","center"];
				var name = groupeNom.add("edittext",undefined);
				name.enabled = false;
					nametexte.onClick = function() {
					name.enabled = nametexte.value;
					}
				//suffix
				var groupeSuffix = addHGroup(fenetrerename.groupe);
				groupeSuffix.alignChildren = ["fill","center"];
				var suffixtexte = groupeSuffix.add("checkbox",undefined,getMessage(109));
				suffixtexte.alignment = ["left","center"];
				var suffix = groupeSuffix.add("edittext",undefined);
				suffix.enabled = false;
				suffixtexte.onClick = function() {
					suffix.enabled = suffixtexte.value;
					}
				//numéros
				var groupeNumeros = addHGroup(fenetrerename.groupe);
				groupeNumeros.alignChildren = ["fill","center"];
				var numerotexte = groupeNumeros.add("checkbox",undefined,getMessage(110));
				numerotexte.alignment = ["left","center"];
				var numero = groupeNumeros.add("edittext",undefined);
				numero.enabled = false;
				numerotexte.onClick = function() {
					numerotexte.value ? numero.enabled = true : numero.enabled = false ;
					}
				
				
				}
				
				//la fenetre d'option de création d'IK
				{
					var fenetreik = createDialog("Options d'IK",true,goik);
					fenetreik.groupe.orientation = "column";
					//boutons front et right view
					var groupeik3d = fenetreik.groupe.add("panel",undefined,"3D");
					groupeik3d.orientation = "row";
					groupeik3d.alignChildren = ["fill","center"];
					var boutonFront = groupeik3d.add("radiobutton",undefined,getMessage(80));
					var boutonRight = groupeik3d.add("radiobutton",undefined,getMessage(81));
					boutonFront.value = true;
					//boutons orientation
					var groupeikorient = fenetreik.groupe.add("panel",undefined,"Orientation");
					groupeikorient.orientation = "row";
					groupeikorient.alignChildren = ["fill","center"];
					var boutonCW = groupeikorient.add("radiobutton",undefined,">");
					var boutonCCW = groupeikorient.add("radiobutton",undefined,"<");
					boutonCW.value = true;
					//bouton FK
					var boutonFK = fenetreik.groupe.add("checkbox",undefined,"Controleur FK sur IK");
					boutonFK.value = true;
					//bouton Stretch
					var boutonStretch = fenetreik.groupe.add("checkbox",undefined,"Controleurs de Stretch");
					boutonStretch.value = true;	
				}
				
				//la fenetre d'option de multiplan
				{
					var fenetremultiplan = createDialog(getMessage(188),true,multiplan);
					fenetremultiplan.groupe.orientation = "column";
					
					var nombreGroupe = fenetremultiplan.groupe.add("group");
					nombreGroupe.add("statictext",undefined,"Nombre de calques :");
					var nombre = nombreGroupe.add("edittext",undefined,"03");
					var pos = fenetremultiplan.groupe.add("checkbox",undefined,"Position");
					pos.value = true;
					var sca = fenetremultiplan.groupe.add("checkbox",undefined,"Scale");
				}
			
				// la palette IK_Tools
				{
				var mainGroup = palette.add("group");
				mainGroup.orientation = "column";
				mainGroup.alignChildren = ["fill","fill"];
				//entete
				var entete = mainGroup.add("group");
				entete.alignChildren = ["left","center"];
				entete.alignment = ["fill","top"];
				entete.spacing = 2;
				entete.margins = 0;
				var textVersion = entete.add ("statictext", undefined,  "Duik v" + version);
				var boutonhelp = entete.add ("button",undefined,"?");
				boutonhelp.size = [18,18];
				boutonhelp.onClick = help;
				var boutonNotes = entete.add("iconbutton",undefined,dossierIcones + "btn_notes.png");
				boutonNotes.size = [22,22];
				boutonNotes.alignment = ["right","center"];
				boutonNotes.onClick = function () { if (fenetrenotes.visible) fenetrenotes.hide(); else fenetrenotes.show(); };
				var boutonCalc = entete.add("iconbutton",undefined,dossierIcones + "btn_calc.png");
				boutonCalc.size = [22,22];
				boutonCalc.alignment = ["right","center"];
				boutonCalc.onClick = function () { if (fenetrecalc.visible) fenetrecalc.hide(); else fenetrecalc.show(); };
				var selecteur = entete.add("dropdownlist",undefined,[getMessage(136),getMessage(69),getMessage(70),getMessage(72),getMessage(75)]);
				selecteur.alignment = ["right","center"];
				//les panneaux
				var panos = mainGroup.add("group");
				panos.orientation = "stack";
				panos.alignChildren = ["fill","fill"];
				// ----- Les différents panneaux
				var panoik = addVPanel(panos);
				var panoanimation = addHPanel(panos);
				panoanimation.visible = false;
				var panointerpo =  addVPanel(panos);
				panointerpo.visible = false;
				var panocam = addVPanel(panos);
				panocam.visible = false;
				var panosettings = addVPanel(panos);
				panosettings.visible = false;

				selecteur.onChange = function() {
					if (selecteur.selection == 0){
						panoik.visible = true;
						panoanimation.visible = false;
						panointerpo.visible = false;
						panocam.visible = false;
						panosettings.visible = false;
						app.settings.saveSetting("duik","pano","0");
						}
					else if (selecteur.selection == 1){
					panoik.visible = false;
					panoanimation.visible = true;
					panointerpo.visible = false;
					panocam.visible = false;
					panosettings.visible = false;
					app.settings.saveSetting("duik","pano","1");
					}
					else if (selecteur.selection == 2){
					panoik.visible = false;
					panoanimation.visible = false;
					panointerpo.visible = true;
					panocam.visible = false;
					panosettings.visible = false;
					app.settings.saveSetting("duik","pano","2");
					}
					else if (selecteur.selection == 3){
					panoik.visible = false;
					panoanimation.visible = false;
					panointerpo.visible = false;
					panocam.visible = true;
					panosettings.visible = false;
					app.settings.saveSetting("duik","pano","3");
					}
					else if (selecteur.selection == 4){
					panoik.visible = false;
					panoanimation.visible = false;
					panointerpo.visible = false;
					panocam.visible = false;
					panosettings.visible = true;
					  app.settings.saveSetting("duik","pano","4");
					}
				}
				selecteur.selection = eval(app.settings.getSetting("duik","pano"));
				
				// PANNEAU SETTINGS -----------------------------------------------------------
				{
				var settingsDropdown = panosettings.add("dropdownlist",undefined,["General","Bones","Controllers","Copy/Paste Animation"]);
				var settingsGroup = panosettings.add("group");
				settingsGroup.orientation = "stack";
				
				var generalGroup = addVGroup(settingsGroup);
				var bonesGroup = addVGroup(settingsGroup);
				var controllersGroup = addVGroup(settingsGroup);
				var copyPasteAnimGroup = addVGroup(settingsGroup);
				
				settingsDropdown.onChange = function() {
					if (settingsDropdown.selection == 0) {
						generalGroup.visible = true;
						bonesGroup.visible = false;
						controllersGroup.visible = false;
						copyPasteAnimGroup.visible = false;
					}
					else if (settingsDropdown.selection == 1) {
						generalGroup.visible = false;
						bonesGroup.visible = true;
						controllersGroup.visible = false;
						copyPasteAnimGroup.visible = false;
					}
					else if (settingsDropdown.selection == 2) {
						generalGroup.visible = false;
						bonesGroup.visible = false;
						controllersGroup.visible = true;
						copyPasteAnimGroup.visible = false;
					}
					else if (settingsDropdown.selection == 3) {
						generalGroup.visible = false;
						bonesGroup.visible = false;
						controllersGroup.visible = false;
						copyPasteAnimGroup.visible = true;
					}
				}
				settingsDropdown.selection = 0;
				
				
				//boutons francais anglais
				var groupeLangues = generalGroup.add("group");
				groupeLangues.alignment = ["left","center"];
				groupeLangues.add("statictext",undefined,getMessage(76));
				var boutonlangue = groupeLangues.add("dropdownlist",undefined,["Français","English","Español","Deutsch","Bahasa","Português"]);
				if (app.settings.getSetting("duik", "lang") == "FRENCH") boutonlangue.selection = 0;
				if (app.settings.getSetting("duik", "lang") == "ENGLISH") boutonlangue.selection = 1;
				if (app.settings.getSetting("duik", "lang") == "SPANISH") boutonlangue.selection = 2;
				if (app.settings.getSetting("duik", "lang") == "GERMAN") boutonlangue.selection = 3;
				if (app.settings.getSetting("duik", "lang") == "BAHASA") boutonlangue.selection = 4;
				if (app.settings.getSetting("duik", "lang") == "PORTUGUESE") boutonlangue.selection = 5;
				boutonlangue.onChange = choixLangue;
				//mises a jour
				var boutonVMAJ = generalGroup.add("checkbox",undefined,getMessage(77));
				if (app.settings.getSetting("duik", "version") == "oui") {boutonVMAJ.value = true; }
				boutonVMAJ.onClick = function() {
					if (boutonVMAJ.value) {app.settings.saveSetting("duik","version","oui");} else {app.settings.saveSetting("duik","version","non");}
					}
				var boutonMAJ = generalGroup.add("button",undefined,getMessage(113));
				boutonMAJ.onClick = function() {
					if (version == checkForUpdate(version,true)) { alert(getMessage(78)); };
					}
				
				
				
				//boutons options bones et controleurs
				//type de bones
				var groupeBoneType = addHGroup(bonesGroup);
				groupeBoneType.add("statictext",undefined,getMessage(165));
				var boutonBoneType = groupeBoneType.add("dropdownlist",undefined,[getMessage(166),getMessage(167)]);
				boutonBoneType.selection = Duik.settings.boneType;
				boutonBoneType.onChange = function() {
					boutonBoneColor.enabled = boutonBoneType.selection == 0;
					Duik.settings.boneType = boutonBoneType.selection.index;
					Duik.settings.save();
					};
				//taille des bones
				var groupeBoneSize = addHGroup(bonesGroup);
				var groupeBoneSizeAuto = addHGroup(bonesGroup);
				groupeBoneSize.add("statictext",undefined,getMessage(168));
				var boutonBoneSize = groupeBoneSize.add("edittext",undefined,app.settings.getSetting("duik", "boneSize"));
				boutonBoneSize.onChange = function() {
					Duik.settings.boneSize = parseInt(boutonBoneSize.text);
					Duik.settings.save();
					};
				boutonBoneSize.text = Duik.settings.boneSize
				//taille auto des bones
				var boutonBoneSizeAuto = groupeBoneSizeAuto.add("checkbox",undefined,getMessage(170));
				boutonBoneSizeAuto.onClick = function() {
					boutonBoneSize.enabled = !boutonBoneSizeAuto.value;
					boutonBoneSizeAutoValue.enabled = boutonBoneSizeAuto.value;
					Duik.settings.boneSizeAuto = boutonBoneSizeAuto.value;
					Duik.settings.save();
					};
				boutonBoneSizeAuto.value = Duik.settings.boneSizeAuto;
				boutonBoneSizeAuto.alignment = ["fill","bottom"];
				//size hint des bones
				var boutonBoneSizeAutoValue = groupeBoneSizeAuto.add("dropdownlist",undefined,[getMessage(171),getMessage(172),getMessage(173)]);
				boutonBoneSizeAutoValue.selection = Duik.settings.boneSizeHint;
				boutonBoneSizeAutoValue.onChange = function () {
					Duik.settings.boneSizeHint = boutonBoneSizeAutoValue.selection.index;
					Duik.settings.save();
					};
				boutonBoneSize.enabled = !boutonBoneSizeAuto.value ;
				boutonBoneSizeAutoValue.enabled = boutonBoneSizeAuto.value ;
				//bone color
				var groupeBoneColor = addHGroup(bonesGroup);
				groupeBoneColor.add("statictext",undefined,getMessage(187));
				var boutonBoneColorSharp = groupeBoneColor.add("statictext",undefined,"#");
				boutonBoneColorSharp.alignment = ["right","fill"];
				var boutonBoneColor = groupeBoneColor.add("edittext",undefined,"FF0000");
				boutonBoneColor.onChange = function() {
					Duik.settings.boneColor = boutonBoneColor.text;
					Duik.settings.save();
					};
				boutonBoneColor.text = Duik.settings.boneColor;
				boutonBoneColor.enabled = boutonBoneType.selection == 0;
				

				
				//taille des controleurs
				var groupeCtrlSize = addHGroup(controllersGroup);
				var groupeCtrlSizeAuto = addHGroup(controllersGroup);
				groupeCtrlSize.add("statictext",undefined,getMessage(169));
				var boutonCtrlSize = groupeCtrlSize.add("edittext",undefined,app.settings.getSetting("duik", "ctrlSize"));
				boutonCtrlSize.onChange = function() {
					Duik.settings.controllerSize = parseInt(boutonCtrlSize.text);
					Duik.settings.save();
					};
				boutonCtrlSize.text = Duik.settings.controllerSize;
				//taille auto controleurs
				var boutonCtrlSizeAuto = groupeCtrlSizeAuto.add("checkbox",undefined,getMessage(170));
				boutonCtrlSizeAuto.onClick = function() {
					boutonCtrlSize.enabled = !boutonCtrlSizeAuto.value;
					boutonCtrlSizeAutoValue.enabled = boutonCtrlSizeAuto.value;
					Duik.settings.controllerSizeAuto = boutonCtrlSizeAuto.value;
					Duik.settings.save();
					};
				boutonCtrlSizeAuto.value = Duik.settings.controllerSizeAuto;
				boutonCtrlSizeAuto.alignment = ["fill","bottom"];
				//size hint controllers
				var boutonCtrlSizeAutoValue = groupeCtrlSizeAuto.add("dropdownlist",undefined,[getMessage(171),getMessage(172),getMessage(173)]);
				boutonCtrlSizeAutoValue.selection = Duik.settings.controllerSizeHint;
				boutonCtrlSizeAutoValue.onChange = function () {
					Duik.settings.controllerSizeHint = boutonCtrlSizeAutoValue.selection.index;
					Duik.settings.save();
					};
				boutonCtrlSize.enabled = !boutonCtrlSizeAuto.value ;
				boutonCtrlSizeAutoValue.enabled = boutonCtrlSizeAuto.value ;
				
				
				
				var pauiNamesButton = copyPasteAnimGroup.add("radiobutton",undefined,"Use layer names");
				var pauiIndexesButton = copyPasteAnimGroup.add("radiobutton",undefined,"Use layer indexes");
				pauiIndexesButton.value = Duik.settings.pasteAnimUseIndexes;
				pauiNamesButton.value = !Duik.settings.pasteAnimUseIndexes;
				pauiIndexesButton.onClick = function () {
					Duik.settings.pasteAnimUseIndexes = pauiIndexesButton.value;
					Duik.settings.save();
				};
				pauiNamesButton.onClick = function () {
					Duik.settings.pasteAnimUseIndexes = pauiIndexesButton.value;
					Duik.settings.save();
				};
				
				
				
				
				}
				
				// PANNEAU RIGGING -----------------------------------------------------------
				{
				//bouton autorig
				var boutonautorig = addIconButton(panoik,dossierIcones + "btn_autorig.png",getMessage(142));
				boutonautorig.onClick = autorig;
				//boutonautorig.helpTip = "tip à écrire";
				var groupeik = addHGroup(panoik);
				var groupeikG = addVGroup(groupeik);
				var groupeikD = addVGroup(groupeik);
				//bouton pour créer l'IK
				var boutonik = addIconButton(groupeikG,dossierIcones + "btn_creer.png",getMessage(114));
				boutonik.onClick = ik;
				//bouton pour créer un goal
				var boutongoal = addIconButton(groupeikD,dossierIcones + "btn_goal.png",getMessage(115));
				boutongoal.onClick = pregoal;
				boutongoal.helpTip = getMessage(79);
				//bouton controleur
				var boutoncontroleur2 = addIconButton(groupeikG,dossierIcones + "btn_controleur.png",getMessage(116));
				boutoncontroleur2.onClick = controleur;
				boutoncontroleur2.helpTip = getMessage(82);
				//bouton bone
				var boutonbone2 = addIconButton(groupeikD,dossierIcones + "btn_bones.png",getMessage(117));
				boutonbone2.onClick = bone;
				boutonbone2.helpTip = getMessage(83);
				//bouton zero
				var boutonzero2 = addIconButton(groupeikG,dossierIcones + "btn_zero.png",getMessage(118));
				boutonzero2.onClick = zero;
				boutonzero2.helpTip = getMessage(84);
				//bouton rotmorph
				var boutonrotmorph = addIconButton(groupeikD,dossierIcones + "btn_rotmorph.png",getMessage(119));
				boutonrotmorph.onClick = rotmorph;
				boutonrotmorph.helpTip = getMessage(120);
				//bouton renommer
				var boutonrename2 = addIconButton(groupeikG,dossierIcones + "btn_renommer.png",getMessage(111));
				boutonrename2.onClick = function() {fenetrerename.show();}
				boutonrename2.helpTip = getMessage(85);
				//bouton mesurer
				var boutonmesurer = addIconButton(groupeikD,dossierIcones + "btn_mesurer.png",getMessage(106));
				boutonmesurer.onClick = mesure;
				boutonmesurer.helpTip = getMessage(100);
				//replace in expressions button
				var rieButton = addButton(groupeikG,"Replace in Expr.");
				rieButton.onClick = onRieButtonClicked;
				rieButton.helpTip = "Search and replace text in expressions";
				//placeholder
				addButton(groupeikD,"");
				}
				
				// PANNEAU INTERPOLATION -----------------------------------------------------------
				{
				var groupeInterpoClefs = addHGroup(panointerpo);
				groupeInterpoClefs.alignChildren = ["right","top"];
				var interpoClefsTexte = groupeInterpoClefs.add("statictext",undefined,"Type de clefs :");
				interpoClefsTexte.alignment = ["left","top"];
				var boutonLineaire = groupeInterpoClefs.add("iconbutton",undefined,dossierIcones + "interpo_lineaire.png");
				boutonLineaire.size = [13,12];
				boutonLineaire.onClick = lineaire;
				boutonLineaire.helpTip = "Interpolation Linéaire";
				var boutonLissageA = groupeInterpoClefs.add("iconbutton",undefined,dossierIcones + "interpo_lissagea.png");
				boutonLissageA.size = [13,12];
				boutonLissageA.onClick = lissageA;
				boutonLissageA.helpTip = "Lissage à l'approche";
				var boutonLissageE = groupeInterpoClefs.add("iconbutton",undefined,dossierIcones + "interpo_lissagee.png");
				boutonLissageE.size = [13,12];
				boutonLissageE.onClick = lissageE;
				boutonLissageE.helpTip = "Lissage à l'éloignement";
				var boutonLissage = groupeInterpoClefs.add("iconbutton",undefined,dossierIcones + "interpo_bezier.png");
				boutonLissage.size = [13,12];
				boutonLissage.onClick = lissage;
				boutonLissage.helpTip = "Amorti";
				var boutonContinu = groupeInterpoClefs.add("iconbutton",undefined,dossierIcones + "interpo_continu.png");
				boutonContinu.size = [13,12];
				boutonContinu.onClick = continu;
				boutonContinu.helpTip = "Vitesse continue (Bézier Auto)";
				var boutonMaintien = groupeInterpoClefs.add("iconbutton",undefined,dossierIcones + "interpo_maintien.png");
				boutonMaintien.size = [13,12];
				boutonMaintien.onClick = maintien;
				boutonMaintien.helpTip = "Maintien";
				
				var groupeInterpo = addHGroup(panointerpo);
				groupeInterpo.spacing = 2;
				var bouton0 = groupeInterpo.add("button",undefined,"0");
				bouton0.onClick = function() {texteInfluence.text = 1;infl(1);};
				bouton0.helpTip = "Influence à 1%";
				bouton0.size = [30,22];
				var bouton10 = groupeInterpo.add("button",undefined,"10");
				bouton10.onClick = function() {texteInfluence.text = 10;infl(10);};
				bouton10.helpTip = "Influence à 10%";
				bouton10.size = [30,22];
				var bouton25 = groupeInterpo.add("button",undefined,"25");
				bouton25.onClick = function() {texteInfluence.text = 25;infl(25);};
				bouton25.helpTip = "Influence à 25%";
				bouton25.size = [30,22];
				var bouton50 = groupeInterpo.add("button",undefined,"50");
				bouton50.onClick = function() {texteInfluence.text = 50;infl(50);};
				bouton50.helpTip = "Influence à 50%";
				bouton50.size = [30,22];
				var bouton75 = groupeInterpo.add("button",undefined,"75");
				bouton75.onClick = function() {texteInfluence.text = 75;infl(75);};
				bouton75.helpTip = "Influence à 75%";
				bouton75.size = [30,22];
				var bouton90 = groupeInterpo.add("button",undefined,"90");
				bouton90.onClick = function() {texteInfluence.text = 90;infl(90);};
				bouton90.helpTip = "Influence à 90%";
				bouton90.size = [30,22];
				var bouton100 = groupeInterpo.add("button",undefined,"100");
				bouton100.onClick = function() {texteInfluence.text = 100;infl(100);};
				bouton100.helpTip = "Influence à 100%";
				bouton100.size = [30,22];
				var texteInfluence = groupeInterpo.add("edittext",undefined,"-");
				texteInfluence.size = [40,22];
				texteInfluence.onChange = function() {infl(eval(texteInfluence.text));};

				var groupeInterpoInOut = addHGroup(panointerpo);
				var boutonApproche = groupeInterpoInOut.add("checkbox",undefined,getMessage(86));
				var boutonEloignement = groupeInterpoInOut.add("checkbox",undefined,getMessage(87));
				boutonApproche.value = true;
				boutonEloignement.value = true;
				boutonApproche.helpTip = getMessage(88);
				boutonEloignement.helpTip = getMessage(89);
				boutonApproche.onClick = function() { if (boutonApproche.value == false) boutonEloignement.value = true; };
				boutonEloignement.onClick = function() { if (boutonEloignement.value == false) boutonApproche.value = true; };
				
				var groupeInterpoMorph = addHGroup(panointerpo);
				var boutonMoprher = addIconButton(groupeInterpoMorph,dossierIcones + "btn_morph.png","Morpher");
				boutonMoprher.onClick = morpher;
				boutonMoprher.helpTip = getMessage(90);
				var boutonMKey = groupeInterpoMorph.add("checkbox",undefined,getMessage(91));
				boutonMKey.value = true;
				boutonMKey.alignment = ["fill","bottom"];
				}
				
				// PANNEAU ANIMATION -----------------------------------------------
				{
				var groupeAnimationG = addVGroup(panoanimation);
				var groupeAnimationD = addVGroup(panoanimation);
				//bouton wiggle
				var boutonwiggle = addIconButton(groupeAnimationG,dossierIcones + "btn_wiggle.png",getMessage(121));
				boutonwiggle.onClick = wiggle;
				boutonwiggle.helpTip = getMessage(92);
				//bouton oscillation
				var boutonosc = addIconButton(groupeAnimationD,dossierIcones + "btn_osc.png",getMessage(122));
				boutonosc.onClick = oscillation;
				boutonosc.helpTip = getMessage(93);
				//bouton nframes
				var boutonnframes = addIconButton(groupeAnimationG,dossierIcones + "btn_expo.png",getMessage(123));
				boutonnframes.onClick = exposure;
				boutonnframes.helpTip = getMessage(94);
				//bouton path follow
				var boutonpathfollow = addIconButton(groupeAnimationD,dossierIcones + "btn_pf.png",getMessage(124));
				boutonpathfollow.onClick = pathFollow;
				boutonpathfollow.helpTip = getMessage(95);
				 //bouton roue
				var boutonroue = addIconButton(groupeAnimationG,dossierIcones + "btn_roue.png",getMessage(125));
				boutonroue.onClick = creroue;
				boutonroue.helpTip = getMessage(96);
				//bouton spring
				var boutonspring = addIconButton(groupeAnimationD,dossierIcones + "btn_rebond.png",getMessage(126));
				boutonspring.onClick = spring;
				boutonspring.helpTip = getMessage(97);
				//bouton lien de distance
				var boutondistance = addIconButton(groupeAnimationG,dossierIcones + "btn_lien-de-distance.png",getMessage(127));
				boutondistance.onClick = distanceLink;
				boutondistance.helpTip = getMessage(98);
				//bouton lentille
				var boutonlentille = addIconButton(groupeAnimationD,dossierIcones + "/btn_lentille.png",getMessage(128));
				boutonlentille.onClick = lentille;
				boutonlentille.helpTip = getMessage(99);
				//bouton Copy ANIM
				var boutonCopyAnim = addIconButton(groupeAnimationG,dossierIcones + "/btn_copy.png",getMessage(129));
				boutonCopyAnim.onClick = function ca() { animationSaved = copyAnim() };
				boutonCopyAnim.helpTip = getMessage(131);
				//bouton Paste ANIM
				var boutonPasteAnim = addIconButton(groupeAnimationD,dossierIcones + "/btn_paste.png",getMessage(130));
				boutonPasteAnim.onClick = function pa() { pasteAnim(animationSaved) };
				boutonPasteAnim.helpTip = getMessage(132);
				}
			
				//PANNEAU CAMERAS -------------------------------------------
				{
					panocam.orientation = "row";
					var groupCameraG = addVGroup(panocam);
					var groupCameraD = addVGroup(panocam);
					//bouton pour créer une target cam
					var boutontcam = addIconButton(groupCameraG,dossierIcones + "btn_controleur-cam.png",getMessage(134));
					boutontcam.onClick = controlcam;
					boutontcam.helpTip = getMessage(102);
					//bouton pour multiplan 2D
					var boutontcam2d = addIconButton(groupCameraG,dossierIcones + "btn_controleur-cam.png",getMessage(188));
					boutontcam2d.onClick = function () { fenetremultiplan.show() ;};
					boutontcam2d.helpTip = "HelpTip";
					
				}
			
				// On définit le layout et on redessine la fenètre quand elle est resizée
				palette.layout.layout(true);
				palette.layout.resize();
				palette.onResizing = palette.onResize = function () { this.layout.resize(); }
				
				
				}
		}
	}
	
	
	// On définit le layout et on redessine la fenètre quand elle est resizée
	palette.layout.layout(true);
	palette.layout.resize();
	palette.onResizing = palette.onResize = function () { this.layout.resize(); };
	return palette;

}


fnDuIK(this);

