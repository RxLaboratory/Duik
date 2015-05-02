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
	var version = "15.alpha13";
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
	
	// PROGRESS BAR
	{
		var progressPanel = new Window("window","Progress",undefined,{borderless:true});
		progressPanel.size=[300,50];
		progressPanel.alignChildren = ["fill","top"];
		var progressGroup = progressPanel.add("group");
		progressGroup.alignChildren = ["fill","fill"];
		progressGroup.orientation = "column";
		progressGroup.spacing = 2;
		progressGroup.margins = 0;
		var progressBar = progressGroup.add("progressbar",undefined);
		var progressStatus = progressGroup.add("statictext",undefined,"-----------idle----------");
	}
	
	progressPanel.show();
	progressBar.maxValue = 5;
	progressBar.value = 0;
	progressStatus.text = "Loading Duik";
	progressPanel.update();
	
	//=================================
	//======== APP.SETTINGS ===========
	//=================================
	{
		if (!app.settings.haveSetting("duik", "lang")){app.settings.saveSetting("duik","lang","ENGLISH");}
		if (!app.settings.haveSetting("duik","version")){app.settings.saveSetting("duik","version","oui");}
		if (!app.settings.haveSetting("duik","expertMode")){app.settings.saveSetting("duik","expertMode","false");}
		if (!app.settings.haveSetting("duik", "notes")){app.settings.saveSetting("duik","notes","");}
		if (!app.settings.haveSetting("duik", "pano")){app.settings.saveSetting("duik","pano","0");}
		if (!app.settings.haveSetting("duik", "stretch")){app.settings.saveSetting("duik","stretch","true");}
		if (!app.settings.haveSetting("duik", "ikfk")){app.settings.saveSetting("duik","ikfk","true");}
		if (!app.settings.haveSetting("duik", "dropDownSelector")){app.settings.saveSetting("duik","dropDownSelector","false");}
	}
	
	
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
			
			progressPanel.hide();

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
		progressPanel.show();
		progressBar.value = 1;
		progressStatus.text = "Duik - checking for new Updates";
		progressPanel.update();
		
		if (app.settings.getSetting("duik","version") == "oui")
		{
			var newV = checkForUpdate(version,false);
			if ( version == newV || newV == undefined)
			{
				loadDuik();
			}
			else
			{
				progressPanel.hide();
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
		progressPanel.show();
		progressBar.value = 2;
		progressStatus.text = "Duik - Waking up libDuik";
		progressPanel.update();
		
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
					/*//MAC SET PERMISSIONS GROUP
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
					mspGroup.visible = false;*/
					//MANUAL INSTALL
					var mmGroup = paletteContent.add("group",undefined);
					mmGroup.orientation = "column";
					mmGroup.alignChildren = ["fill","fill"];
					var mmTexts = mmGroup.add("group");
					mmTexts.orientation = "stack";
					mmTexts.alignment = ["center","top"];
					var mmText = mmTexts.add("statictext",undefined,"",{multiline:true});
					mmText.alignment = ["center","top"];
					mmText.text = "It seems Duik can not automatically install the pseudo effects it needs.\n\nThe easiest way to fix this is by restarting After Effects with administrator privileges,\n\nor you can manually install the pseudo effects needed by Duik: click on the 'Next' button below.";
					var mmText2 = mmTexts.add("statictext",undefined,"",{multiline:true});
					mmText2.alignment = ["center","top"];
					mmText2.text = "• 1 - Open the file 'presetEffects.xml':\nRight click on\nApplications/Adobe After Effects/Adobe After Effects.app,\nSelect 'Show package contents', go to\nContents/Resources/PresetEffects.xml.";
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
				
				/*mspNextButton.onClick = function ()
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
				}*/
				
				/*mspPrevButton.onClick = function ()
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
				}*/
				
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
				
				/*mspContinueButton.onClick = function ()
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
				};*/
				
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
					//mspGroup.visible = true;
					mmGroup.visible = true;
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
	
		progressPanel.show();
		progressBar.value = 3;
		progressStatus.text = "Duik - Loading icons";
		progressPanel.update();
	
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

		progressPanel.show();
		progressBar.value = 4;
		progressStatus.text = "Duik - Loading functions";
		progressPanel.update();
		
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

			//FONCTION QUAND ON CLIQUE SUR AUTORIG
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

			//FONCTION LANCE L'AUTORIG
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
						Duik.autoIK([mainG,avantBrasG,brasG,CmainG],false,false);
					}
					else if (avantBrasG != undefined)
					{
						
						Duik.autoIK([avantBrasG,CmainG]);
						Duik.goal(mainG,CmainG);
					}
					else if (brasG != undefined)
					{
						Duik.autoIK([brasG,CmainG]);
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
					if (avantBrasD != undefined && brasD != undefined)
					{
						Duik.autoIK([mainD,avantBrasD,brasD,CmainD],false,false);
					}
					else if (avantBrasD != undefined) {
						Duik.autoIK([avantBrasD,CmainD]);
						Duik.goal(mainD,CmainD);
						}
					else if (brasD != undefined) {
						Duik.autoIK([brasD,CmainD]);
						Duik.goal(mainD,CmainD);
						}
					else Duik.goal(mainD,CmainD);
				}
				//jambe D
				if (piedD != undefined)
				{
					if (molletD != undefined && cuisseD != undefined)
					{
						Duik.autoIK([piedD,molletD,cuisseD,CpiedD],false,false);
					}
					else if (molletD != undefined) {
						Duik.autoIK([molletD,CpiedD]);
						Duik.goal(piedD,CpiedD);
						}
					else if (cuisseD != undefined) {
						Duik.autoIK([cuisseD,CpiedD]);
						Duik.goal(piedD,CpiedD);
						}
					else Duik.goal(piedD,CpiedD);
				}
				//jambe G
				if (piedG != undefined)
				{
					if (molletG != undefined && cuisseG != undefined)
					{
						Duik.autoIK([piedG,molletG,cuisseG,CpiedG],false,false);
					}
					else if (molletG != undefined) {
						Duik.autoIK([molletG,CpiedG]);
						Duik.goal(piedG,CpiedG);
						}
					else if (cuisseG != undefined) {
						Duik.autoIK([cuisseG,CpiedG]);
						Duik.goal(piedG,CpiedG);
						}
					else Duik.goal(piedG,CpiedG);
				}
				//dos
				if (autorigIKdos.value) {
					Duik.autoIK([corps,Cepaules]);
				}
				//cou
				if (autorigIKcou.value && cou != undefined) {
					Duik.autoIK([cou,Ctete]);
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

			//FONCTION QUAND ON CLIQUE SUR CREER IK
			function ik(){
				
				var okToGo = app.project.activeItem != null;
				var calques;
				
				if (okToGo)
				{
					calques = app.project.activeItem.selectedLayers;
					//if num layers selected is not correct
					if (calques.length < 2 || calques.length > 5) {
						okToGo = false;
					}
				}
				if (!okToGo)
				{
					alert(getMessage(7));
					return;
				}
				
				
				panoik.hide();
				ikPanel.show();
				
				//prepIK
				app.beginUndoGroup("Duik - prepare IK");
				var ikRig = Duik.utils.prepIK(calques);
				app.endUndoGroup();
				if (ikRig.type == 0) return;
			
				if (ikRig.type == 1 && ikRig.goal == null)
				{
					ikType1Group.show();
					ikType2Group.hide();
					ikType3Group.hide();
					ikType4Group.hide();
					ik3DGroup.hide();
					ikCWButton.hide();
				}
				else if (ikRig.type == 1 && ikRig.goal != null)
				{
					ikType1Group.hide();
					ikType2Group.show();
					ikType3Group.hide();
					ikType4Group.hide();
					ik1GoalButton.value = true;
					ik2LayerButton.value = false;
					ik3DGroup.enabled = false;
					if (ikRig.threeD)
					{
						ik3DGroup.show();
						ikFrontFacingButton.value = ikRig.frontFacing;
						ikRightFacingButton.value = !ikRig.frontFacing;
					}
					else
					{
						ik3DGroup.hide();
					}
					ikCWButton.show();
					ikCWButton.enabled = false;
				}
				else if (ikRig.type == 2 && ikRig.goal == null)
				{
					ikType1Group.hide();
					ikType2Group.show();
					ikType3Group.hide();
					ikType4Group.hide();
					ik1GoalButton.value = false;
					ik2LayerButton.value = true;
					ik3DGroup.enabled = true;
					if (ikRig.threeD)
					{
						ik3DGroup.show();
						ikFrontFacingButton.value = ikRig.frontFacing;
						ikRightFacingButton.value = !ikRig.frontFacing;
					}
					else
					{
						ik3DGroup.hide();
					}
					ikCWButton.show();
					ikCWButton.enabled = true;
				}
				else if (ikRig.type == 2 && ikRig.goal != null)
				{
					ikType1Group.hide();
					ikType2Group.hide();
					ikType3Group.show();
					ikType4Group.hide();
					ik3LayerButton.value = false;
					ik2GoalButton.value = true;
					ik3DGroup.enabled = true;
					if (ikRig.threeD)
					{
						ik3DGroup.show();
						ikFrontFacingButton.value = ikRig.frontFacing;
						ikRightFacingButton.value = !ikRig.frontFacing;
					}
					else
					{
						ik3DGroup.hide();
					}
					ikCWButton.show();
					ikCWButton.enabled = true;
				}
				else if (ikRig.type == 3 && ikRig.goal == null)
				{
					ikType1Group.hide();
					ikType2Group.hide();
					ikType3Group.show();
					ikType4Group.hide();
					ik3LayerButton.value = true;
					ik2GoalButton.value = false;
					ik3DGroup.enabled = false;
					if (ikRig.threeD)
					{
						ik3DGroup.show();
						ikFrontFacingButton.value = ikRig.frontFacing;
						ikRightFacingButton.value = !ikRig.frontFacing;
					}
					else
					{
						ik3DGroup.hide();
					}
					ikCWButton.show();
					ikCWButton.enabled = true;
				}
				else if (ikRig.type == 3 && ikRig.goal != null)
				{
					ikType1Group.hide();
					ikType2Group.hide();
					ikType3Group.hide();
					ikType4Group.show();
					ik3DGroup.hide();
					ikCWButton.show();
					ikCWButton.enabled = true;
				}
			
				ikCreateButton.onClick = function() {
					ikRig.clockWise = ikCWButton.value;
					ikRig.frontFacing = ikFrontFacingButton.value;
					if (ikType2Group.visible)
					{
						if (ik2LayerButton.value && ikRig.type == 1)
						{
							ikRig.layer2 = ikRig.goal;
							ikRig.goal = null;
							ikRig.type = 2;
						}
						else if (ik1GoalButton.value && ikRig.type == 2)
						{
							ikRig.goal = ikRig.layer2;
							ikRig.layer2 = null;
							ikRig.type = 1;
						}
					}
					if (ikType3Group.visible)
					{
						if (ik3LayerButton.value && ikRig.type == 2)
						{
							ikRig.layer3 = ikRig.goal;
							ikRig.goal = null;
							ikRig.type = 3;
						}
						else if (ik2GoalButton.value && ikRig.type == 3)
						{
							ikRig.goal = ikRig.layer3;
							ikRig.layer3 = null;
							ikRig.type = 2;
						}
					}
					app.beginUndoGroup("Duik - IK");
					ikRig.create(); 
					app.endUndoGroup();
					ikPanel.hide();
					panoik.show();
				}
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
			function controllerButtonClicked(){
				if (Duik.settings.controllerType == Duik.layerTypes.VECTOR)
				{
					ctrlPanel.show();
					panoik.hide();
					panointerpo.hide();
				}
				else
				{
					//  début de groupe d'annulation
					app.beginUndoGroup("Duik - " + getMessage(116));
					Duik.addControllers(app.project.activeItem.selectedLayers);
					app.endUndoGroup();
				}
			}
			function controleur(){
				if (!(app.project.activeItem instanceof CompItem)) return;
				//  début de groupe d'annulation
				app.beginUndoGroup("Duik - " + getMessage(116));
				var color;
				if (ctrlColorList.selection == 0) color = [1,0,0,1];
				else if (ctrlColorList.selection == 1) color = [0,1,0,1];
				else if (ctrlColorList.selection == 2) color = [0,0,1,1];
				else if (ctrlColorList.selection == 3) color = [0,1,1,1];
				else if (ctrlColorList.selection == 4) color = [1,0,1,1];
				else if (ctrlColorList.selection == 5) color = [1,1,0,1];
				else if (ctrlColorList.selection == 6) color = [1,1,1,1];
				else if (ctrlColorList.selection == 7) color = [0.75,0.75,0.75,1];
				else if (ctrlColorList.selection == 8) color = [0.25,0.25,0.25,1];
				else if (ctrlColorList.selection == 9) color = [0,0,0,1];
				else color = [1,1,1,1];
				var newControllers = Duik.addControllers(app.project.activeItem.selectedLayers,undefined,color,ctrlAutoLockButton.value,ctrlRotationButton.value,ctrlXPositionButton.value,ctrlYPositionButton.value,ctrlScaleButton.value);
				if (ctrlArcButton.value)
				{
					for (var i in newControllers)
					{
						newControllers[i].arc = true;
						newControllers[i].update();
					}
				}
				if (ctrlEyeButton.value)
				{
					for (var i in newControllers)
					{
						newControllers[i].eye = true;
						newControllers[i].update();
					}
				}
				
				//fin du groupe d'annulation
				app.endUndoGroup();

			}
			function ctrlUnlockButtonClicked() {
				var controllers = Duik.utils.getControllers(app.project.activeItem.selectedLayers);
				app.beginUndoGroup("Duik - Unlock Controllers");
				for (var i = 0 ; i < controllers.length ; i++)
				{
					controllers[i].unlock();
				}
				app.endUndoGroup();
			}
			function ctrlLockButtonClicked() {
				var controllers = Duik.utils.getControllers(app.project.activeItem.selectedLayers);
				app.beginUndoGroup("Duik - Lock Controllers");
				for (var i = 0 ; i < controllers.length ; i++)
				{
					controllers[i].lock();
				}
				app.endUndoGroup();
			}
			function ctrlUpdateButtonClicked() {
				var controllers = Duik.utils.getControllers(app.project.activeItem.selectedLayers);
				app.beginUndoGroup("Duik - Update Controllers");
				for (var i = 0 ; i < controllers.length ; i++)
				{
					controllers[i].type = Duik.layerTypes.VECTOR;
					
					if (ctrlColorList.selection == 0) controllers[i].color = [1,0,0,1];
					else if (ctrlColorList.selection == 1) controllers[i].color = [0,1,0,1];
					else if (ctrlColorList.selection == 2) controllers[i].color = [0,0,1,1];
					else if (ctrlColorList.selection == 3) controllers[i].color = [0,1,1,1];
					else if (ctrlColorList.selection == 4) controllers[i].color = [1,0,1,1];
					else if (ctrlColorList.selection == 5) controllers[i].color = [1,1,0,1];
					else if (ctrlColorList.selection == 6) controllers[i].color = [1,1,1,1];
					else if (ctrlColorList.selection == 7) controllers[i].color = [0.75,0.75,0.75,1];
					else if (ctrlColorList.selection == 8) controllers[i].color = [0.25,0.25,0.25,1];
					else if (ctrlColorList.selection == 9) controllers[i].color = [0,0,0,1];
					else controllers[i].color = [1,1,1,1];
					
					controllers[i].xPosition = ctrlXPositionButton.value;
					controllers[i].yPosition = ctrlYPositionButton.value;
					controllers[i].rotation = ctrlRotationButton.value;
					controllers[i].scale = ctrlScaleButton.value;
					controllers[i].arc = ctrlArcButton.value;
					controllers[i].eye = ctrlEyeButton.value;

					controllers[i].update();
					
					controllers[i].unlock();
					
					if (ctrlAutoLockButton.value)
					{
						controllers[i].lock();
					}
				}
				app.endUndoGroup();
			}
			function ctrlUnhideButtonClicked(){
				var controllers = Duik.utils.getControllers(app.project.activeItem.selectedLayers);
				app.beginUndoGroup("Duik - Unhide Controllers");
				for (var i = 0 ; i < controllers.length ; i++)
				{
					controllers[i].layer.enabled = true;
				}
				app.endUndoGroup();
			}
			function ctrlHideButtonClicked(){
				var controllers = Duik.utils.getControllers(app.project.activeItem.selectedLayers);
				app.beginUndoGroup("Duik - Unhide Controllers");
				for (var i = 0 ; i < controllers.length ; i++)
				{
					controllers[i].layer.enabled = false;
				}
				app.endUndoGroup();
			}
			function ctrlResetButtonClicked(){
				if (!(app.project.activeItem instanceof CompItem)) return;
				var ctrls = app.project.activeItem.selectedLayers;
				if (ctrls.length == 0) ctrls = Duik.utils.getControllers(app.project.activeItem.layers);
				else ctrls = Duik.utils.getControllers(ctrls);
				
				app.beginUndoGroup("Reset Ctrl. Transform.");
				
				for (var i in ctrls)
				{
					var c = ctrls[i].layer;
					if (c.parent == null) c.transform.position.setValue([c.containingComp.width/2,c.containingComp.height/2,0]);
					else c.transform.position.setValue([0,0,0]);
					c.transform.scale.setValue([100,100,100]);
					c.transform.rotation.setValue(0);
					c.transform.opacity.setValue(100);
				}
				
				app.endUndoGroup();
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
							resultattexte.text = "The layers are at the same place.";
					}
					else if (resultat/resultat == 1) {
							resultattexte.text = "Distance = \n" + resultat + " pixels.";
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

				if (renameLayersButton.value)
				{
					if (!(app.project.activeItem instanceof CompItem)) return;
					
					var prefixe = "";
					prefixtexte.value ? prefixe = prefix.text : prefixe = "";
					var suffixe = "";
					suffixtexte.value ? suffixe = suffix.text : suffixe = "";
					
					app.beginUndoGroup("Duik - Rename");
					
					var layers = app.project.activeItem.selectedLayers;
					if (layers.length == 0) return;
					
					for (var i=0;i<layers.length;i++)
					{
						//keeping old name
						var oldName = layers[i].name;
						var newName = "";
						//rename
						if (nametexte.value)
						{
							newName = name.text;
						}
						else
						{
							newName = oldName;
							var removeFirst = parseInt(renameRemFirstDValue.text);
							var removeLast = parseInt(renameRemLastDValue.text);
							if (removeFirst > 0)
							{
								newName = newName.substr(removeFirst);
							}
							if (removeLast > 0)
							{
								newName = newName.substring(0,newName.length-removeLast);
							}
						}
						var newName = prefixe + newName + suffixe;
						if (numerotexte.value)
						{
							newName += parseInt(numero.text) + i;
						}
						
						Duik.utils.renameLayer(layers[i],newName,renameInExpressionsButton.value);
					}
						
					renameRemFirstDValue.text = "0";
					renameRemLastDValue.text = "0";
					
					app.endUndoGroup();

				}
				else if (renamePinsButton.value)
				{
					var prefixe = "";
					prefixtexte.value ? prefixe = prefix.text : prefixe = "";
					var suffixe = "";
					suffixtexte.value ? suffixe = suffix.text : suffixe = "";
					
					app.beginUndoGroup("Duik - Rename");
					
					var layers = app.project.activeItem.selectedLayers;
					if (layers.length == 0) return;
					
					var num = parseInt(numero.text);
					
					for (var i=0;i<layers.length;i++) {
						//chercher les puppet pins
						// les propriétés sélectionnées
						var props = layers[i].selectedProperties;
						var coins = [];
						//lister les puppet pins
						if (props.length > 0)
						{
							for (var j=0;j<props.length;j++)
							{
								if (props[j].matchName == "ADBE FreePin3 PosPin Atom") coins.push(props[j]);
							}
						}
						if (coins.length == 0) coins = Duik.utils.getPuppetPins(layers[i]("Effects"));
						if (coins.length == 0) continue;
						//rename
						for (var j = 0;j<coins.length;j++)
						{
							//keeping old name
							var oldName = coins[j].name;
							var newName = "";
							//rename
							if (nametexte.value)
							{
								newName = name.text;
							}
							else
							{
								newName = oldName;
								var removeFirst = parseInt(renameRemFirstDValue.text);
								var removeLast = parseInt(renameRemLastDValue.text);
								if (removeFirst > 0)
								{
									newName = newName.substr(removeFirst);
								}
								if (removeLast > 0)
								{
									newName = newName.substring(0,newName.length-removeLast);
								}
							}
							var newName = prefixe + newName + suffixe;
							if (numerotexte.value)
							{
								newName += num;
								num++;
							}
							coins[j].name = newName;
						}
					}
						
					renameRemFirstDValue.text = "0";
					renameRemLastDValue.text = "0";
					
					app.endUndoGroup();
					app.endSuppressDialogs(false);
				}
				else if (renameItemsButton.value)
				{
					var prefixe = "";
					prefixtexte.value ? prefixe = prefix.text : prefixe = "";
					var suffixe = "";
					suffixtexte.value ? suffixe = suffix.text : suffixe = "";
					
					app.beginUndoGroup("Duik - Rename");
					
					var items = app.project.selection;
					if (items.length == 0) return;
					
					for (var i=0;i<items.length;i++) {
						//keeping old name
						var oldName = items[i].name;
						var newName = "";
						//rename
						if (nametexte.value)
						{
							newName = name.text;
						}
						else
						{
							newName = oldName;
							var removeFirst = parseInt(renameRemFirstDValue.text);
							var removeLast = parseInt(renameRemLastDValue.text);
							if (removeFirst > 0)
							{
								newName = newName.substr(removeFirst);
							}
							if (removeLast > 0)
							{
								newName = newName.substring(0,newName.length-removeLast);
							}
						}
						var newName = prefixe + newName + suffixe;
						if (numerotexte.value)
						{
							newName += parseInt(numero.text) + i;
						}
						
						Duik.utils.renameItem(items[i],newName,renameInExpressionsButton.value);
					}
					
					renameRemFirstDValue.text = "0";
					renameRemLastDValue.text = "0";
					
					app.endUndoGroup();
				}
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
					
			//SEARCH AND REPLACE
			function replaceInExpr()
			{
				if (rieNewEdit.text.indexOf(rieOldEdit.text) >= 0)
				{
					alert("Sorry, Search text cannot be contained in new text.\nThis may be fixed in a future update of Duik.");
					return;
				}
				
				if (rieOldEdit.text == rieNewEdit.text) return;
				
				if (rieExpressionsButton.value)
				{
					if (rieCurrentCompButton.value)
					{
						if (rieAllLayersButton.value)
						{
							app.beginUndoGroup("Duik - Replace in Expressions");
							Duik.utils.replaceInLayersExpressions(app.project.activeItem.layers,rieOldEdit.text,rieNewEdit.text);
							app.endUndoGroup();
						}
						else if (app.project.activeItem.selectedLayers.length > 0)
						{
							app.beginUndoGroup("Duik - Replace in Expressions");
							Duik.utils.replaceInLayersExpressions(app.project.activeItem.selectedLayers,rieOldEdit.text,rieNewEdit.text);
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
								Duik.utils.replaceInLayersExpressions(item.layers,rieOldEdit.text,rieNewEdit.text);
							}
							app.endUndoGroup();
						}
					}
				}
				else if (rieLayersButton.value)
				{
					//get layers
					var layers = [];
					if (rieCurrentCompButton.value)
					{
						if (rieAllLayersButton.value)
						{
							layers = Duik.utils.convertCollectionToArray(app.project.activeItem.layers);
						}
						else
						{
							layers = app.project.activeItem.selectedLayers;
						}
					}
					else
					{
						for(var i = 1; i<=app.project.items.length ; i++)
						{
							if (app.project.item(i) instanceof CompItem)
							{
								var ls = Duik.utils.convertCollectionToArray(app.project.item(i).layers);
								layers = layers.concat(ls);
							}
						}
					}
					if (layers.length == 0) return;
					
					//go!
					app.beginUndoGroup("Duik - Search and replace");
					for(var i in layers)
					{
						var l = layers[i];
						var oldName = l.name;
						while (l.name.indexOf(rieOldEdit.text) > 0)
						{
							l.name = l.name.replace(rieOldEdit.text,rieNewEdit.text);
						}
						var newName = l.name;
						//update expressions
						var compName = l.containingComp.name;
						if (rieUpdateExpressionsButton.value)
						{
							app.beginSuppressDialogs();
							//layer comp
							//double quotes
							var old = "layer(\"" + oldName + "\"";
							var newExpr = "layer(\"" + newName + "\"";
							Duik.utils.replaceInLayersExpressions(l.containingComp.layers,old,newExpr);
							//single quotes
							var old = "layer('" + oldName + "'";
							var newExpr = "layer('" + newName + "'";
							Duik.utils.replaceInLayersExpressions(l.containingComp.layers,old,newExpr);
							//other items
							for (var j = 1;j<=app.project.items.length;j++)
							{
								var comp = app.project.item(j);
								if (comp instanceof CompItem)
								{
									//double quotes
									var old = "comp(\"" + compName + "\").layer(\"" + oldName + "\"";
									var newExpr = "comp(\"" + compName + "\").layer(\"" + newName + "\"";
									Duik.utils.replaceInLayersExpressions(comp.layers,old,newExpr);
									//single quotes
									var old = "comp('" + compName + "').layer('" + oldName + "'";
									var newExpr = "comp('" + compName + "').layer('" + newName + "'";
									Duik.utils.replaceInLayersExpressions(comp.layers,old,newExpr);
								}
							}
							app.endSuppressDialogs(false);
						}
					}
					app.endUndoGroup();
				}
				else if (rieItemsButton.value)
				{
					var items = [];
					if (rieItemSelectedButton.value)
					{
						items = app.project.selection;
					}
					else
					{
						items = Duik.utils.convertCollectionToArray(app.project.items);
					}
					if (items.length == 0 ) return;
					
					app.beginUndoGroup("Duik - Search and Replace");
					for (var i = 0 ; i < items.length ; i++)
					{
						var item = items[i];
						var oldName = item.name;
						var newName = oldName;
						if ((item instanceof CompItem && rieCompItemButton.value) || (item instanceof FootageItem && rieFootageItemButton.value) || (item instanceof FolderItem && rieFolderItemButton.value))
						{
							while (newName.indexOf(rieOldEdit.text) >= 0)
							{
								newName = newName.replace(rieOldEdit.text,rieNewEdit.text);
							}
							item.name = newName;
							if (rieUpdateExpressionsButton.value && item instanceof CompItem)
							{
								app.beginSuppressDialogs();
								//other items
								for (var j = 1;j<=app.project.items.length;j++)
								{
									var comp = app.project.item(j);
									if (comp instanceof CompItem)
									{
										//double quotes
										var old = "comp(\"" + oldName + "\"";
										var newExpr = "comp(\"" + newName + "\"";
										Duik.utils.replaceInLayersExpressions(comp.layers,old,newExpr);
										//single quotes
										var old = "comp('" + oldName + "'";
										var newExpr = "comp('" + newName + "'";
										Duik.utils.replaceInLayersExpressions(comp.layers,old,newExpr);
									}
								}
								app.endSuppressDialogs(false);
							}
						}
					}
					app.endUndoGroup();
				}
			}
			
			function lockButtonClicked() {
				// Vérifions si il n'y a qu'un calque sélectionné
				if (app.project.activeItem.selectedLayers.length == 1)
				{
					//Prendre l'effet
					var effet = app.project.activeItem.selectedLayers[0].selectedProperties.pop();
					//on vérifie si on peut mettre une expression, sinon inutile de continuer
					if(!effet.canSetExpression) { return; }
					
					//  début de groupe d'annulation
					app.beginUndoGroup("Duik - Lock");
					

					Duik.lockProperty(effet);

					app.endUndoGroup();
				}
			}
			
			//=============== ANIMATION =========================

			//IMPORT RIG
			function irRigRefreshButtonClicked(){
				//list all comps of the project
				irRigButton.removeAll();
				for (var i = 1 ; i < app.project.numItems;i++)
				{
					if (app.project.item(i) instanceof CompItem)
					{
						irRigButton.add("item",i + " " + app.project.item(i).name);
					}
				}
			}
			function irOKButtonClicked(){
				if (irRigButton.selection == null) return;
				if (!(app.project.activeItem instanceof CompItem)) return;
				if (irNameText.text == "") alert("You must specify a (unique) name for this instance of the rig");
				
				irPanel.hide();
				panointerpo.show();
				
				//gets the rig comp
				var index = parseInt(irRigButton.selection.text.substring(0,irRigButton.selection.text.indexOf(" ")));
				
				app.beginUndoGroup("Import rig: " + irNameText.text);
				Duik.importRigInComp(app.project.activeItem,app.project.item(index),irNameText.text,progressBar,progressStatus,progressPanel);
				app.endUndoGroup();
								
			}
			
			//FONCTION WIGGLE OK
			function wiggleOKButtonClicked(){

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
			}

			//FONCTION WIGGLE
			function wiggle(){
				//regarder le nombre d'axes dans la propriété sélectionnée
				var prop =  app.project.activeItem.selectedLayers[0].selectedProperties[app.project.activeItem.selectedLayers[0].selectedProperties.length-1];
                    if (prop == undefined) return;
				var dim = prop.propertyValueType ;
				if (dim == PropertyValueType.ThreeD_SPATIAL || dim == PropertyValueType.ThreeD || dim == PropertyValueType.TwoD_SPATIAL || dim == PropertyValueType.TwoD)
				{
					panoanimation.hide();
					wigglePanel.show();
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
			function detectExposurePrecision() {
				var layers = app.project.activeItem.selectedLayers;
				var speed = Duik.utils.getAverageSpeeds(layers);
				var exp = (parseInt(lowerExposureEdit.text) + parseInt(upperExposureEdit.text)) /2
				if (speed > 0)
				{
					var p = parseInt(1/(speed/10000)/exp);
					precisionEdit.text = p;
					exposurePrecisionSlider.value = p;
				}
				else
				{
					precisionEdit.text = 0;
					exposurePrecisionSlider.value = 0;
				}
			}

			function exposureOKButtonClicked() {
				if (app.project.activeItem == null) return;
				if (app.project.activeItem.selectedLayers.length == 0) return;
				
				app.beginUndoGroup("Duik Auto-Exposure");
				if (adaptativeExposureButton.value)
				{
					Duik.adaptativeExposure(app.project.activeItem.selectedLayers,parseInt(precisionEdit.text),parseInt(lowerExposureEdit.text),parseInt(upperExposureEdit.text),exposureSyncButton.value,exposureSyncLayerButton.value);
				}
				else
				{
					var layer = app.project.activeItem.selectedLayers[0];
					var effet = layer.selectedProperties.pop();
					Duik.fixedExposure(layer,effet);
				}
				app.endUndoGroup();
				
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
			
			//PAINT RIGGING
			function paintRigButtonClicked() {
				var layers;
				if (app.project.activeItem.selectedLayers.length == 0)
				{
					layers = app.project.activeItem.layers;
				}
				else
				{
					layers = app.project.activeItem.selectedLayers;
				}
				app.beginUndoGroup("Duik - Paint Rigging");
				Duik.rigPaint(layers);
				app.endUndoGroup();
			}
			
			function blinkButtonClicked() {
				// Vérifions si il n'y a qu'un calque sélectionné
				if (app.project.activeItem.selectedLayers.length == 1){
					
				var calque = app.project.activeItem.selectedLayers[0];

				if (calque.selectedProperties.length != 0){
					
				//Prendre l'effet
				var effet = app.project.activeItem.selectedLayers[0].selectedProperties.pop();
				//on vérifie sin on peut mettre une expression, sinon inutile de continuer
				if(effet.canSetExpression) {
					
				//  début de groupe d'annulation
				app.beginUndoGroup("Duik - Blink");
					
				Duik.blink(calque,effet);
				//fin du groupe d'annulation
				app.endUndoGroup();

				}else{alert(getMessage(38),getMessage(46));}
				}else{alert(getMessage(47),getMessage(48));}
				}else{alert(getMessage(47),getMessage(49));}
			}
			
			function timeRemapButtonClicked() {
				if (app.project.activeItem == null) return;
				var layers = app.project.activeItem.selectedLayers;
				app.beginUndoGroup("Duik - Time remap");
				var loop = "none";
				if (timeRemapLoopInButton.value && timeRemapLoopButton.value) loop = "in";
				else if (timeRemapLoopOutButton.value && timeRemapLoopButton.value) loop = "out";
				Duik.timeRemap(layers,loop);
				app.endUndoGroup();
			}
			
			//CEL Animation
			function celCreateCelButtonClicked() {
				var comp = app.project.activeItem;
				if (comp == null) return;
				if (!(comp instanceof CompItem)) return;
				
				var layer = null;
				if (comp.selectedLayers.length == 0)
				{
					for (var i = 1 ; i <= comp.layers.length ; i++)
					{
						if (comp.layer(i).name.indexOf("Cel") >= 0)
						{
							layer = comp.layer(i);
							break;
						}
					}
				}
				else
				{
					layer = comp.selectedLayers[0];
				}
				
				app.beginUndoGroup("Duik - New celluloid");
				
				var singleLayer = celSingleLayerButton.value;
				
				if (singleLayer == undefined) singleLayer = true;
				
				if (!singleLayer || layer == null)
				{
					//create solid
					layer = comp.layers.addSolid([0,0,0], "Cel 1", comp.width, comp.height, comp.pixelAspect , comp.duration);
				}

				var first = true;
				for (var i = 1 ; i <= layer.Effects.numProperties ; i++)
				{
					if (layer.effect(i).matchName == "ADBE Paint")
					{
						first = false;
						break;
					}
				}

				var paint = layer.Effects.addProperty("ADBE Paint");
				
				if (first) paint.property("ADBE Paint On Transparent").setValue(true);
				
				app.endUndoGroup();
			}
			
			function celOnionUpdateButtonClicked() {
				var comp = app.project.activeItem;
				if (comp == null) return;
				if (!(comp instanceof CompItem)) return;
				
				var layer = null;
				if (comp.selectedLayers.length == 0)
				{
					for (var i = 1 ; i <= comp.layers.length ; i++)
					{
						if (comp.layer(i).name.indexOf("Cel") >= 0)
						{
							layer = comp.layer(i);
							break;
						}
					}
				}
				else
				{
					layer = comp.selectedLayers[0];
				}
				
				
				app.beginUndoGroup("Duik - Update Onion Skin");
				Duik.onionSkin(layer,celOnionButton.value,parseInt(celOnionDurationEdit.text));
				app.endUndoGroup();
			}
			
			function celPreviousButtonClicked() {
				var comp = app.project.activeItem;
				if (comp == null) return;
				if (!(comp instanceof CompItem)) return;
				comp.time = comp.time - comp.frameDuration*parseInt(celExposureEdit.text);
				celOnionUpdateButtonClicked();
			}
			
			function celNextButtonClicked() {
				var comp = app.project.activeItem;
				if (comp == null) return;
				if (!(comp instanceof CompItem)) return;
				comp.time = comp.time + comp.frameDuration*parseInt(celExposureEdit.text);
				celOnionUpdateButtonClicked();
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
				var totalPasted = 0;
				if (Duik.settings.getLayersMethod == Duik.getLayers.SELECTION_INDEX)
				{
					totalPasted = Duik.pasteAnim(app.project.activeItem.selectedLayers,Duik.copiedAnim,app.project.activeItem.time,Duik.settings.getLayersMethod);
				}
				else
				{
					totalPasted = Duik.pasteAnim(app.project.activeItem.layers,Duik.copiedAnim,app.project.activeItem.time,Duik.settings.getLayersMethod);
				}
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
			
			function scaleZLinkButtonClicked()
			{
				if (app.project.activeItem == null) return;
				app.beginUndoGroup("Duik - Scale Z-Link");
				Duik.scaleZLink(app.project.activeItem.selectedLayers);
				app.endUndoGroup();
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
			
			if (! (app.project.activeItem instanceof CompItem)) return;
			
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
			
			function roving () {
				for (i=0;i<app.project.activeItem.selectedLayers.length;i++) {
					for (j=0;j<app.project.activeItem.selectedLayers[i].selectedProperties.length;j++) {
						if (app.project.activeItem.selectedLayers[i].selectedProperties[j].canVaryOverTime) {
							for (k=0;k<app.project.activeItem.selectedLayers[i].selectedProperties[j].selectedKeys.length;k++) {
								var prop = app.project.activeItem.selectedLayers[i].selectedProperties[j];
								if (prop.propertyValueType == PropertyValueType.ThreeD_SPATIAL || prop.propertyValueType == PropertyValueType.TwoD_SPATIAL)
								{
									prop.setRovingAtKey(prop.selectedKeys[k],true);
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
		
		//folders and needed variables
		var dossierIcones = Folder.userData.absoluteURI  + "/DuIK/";
		var animationSaved = [];
		var controllersFromRiggingPanel = true;
		
		var expertMode = eval(app.settings.getSetting("duik","expertMode"));

		//une fonction pour ajouter les boutons plus rapidement :
		function addIconButton(conteneur,image,text){
			var bouton = conteneur.add("iconbutton",undefined,dossierIcones + image);
			//bouton.size = [108,22];
			if (!expertMode) bouton.text = text;
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
			groupe.spacing = 2;
			groupe.margins = 1;
			//expertMode ? groupe.alignment = ["left","top"] : groupe.alignment = ["center","top"];
			groupe.alignment = ["center","top"];
			return groupe;
		}
		function addHPanel(conteneur){
			var groupe = conteneur.add("group");
			groupe.orientation = "row";
			groupe.alignChildren = ["fill","fill"];
			groupe.spacing = 2;
			groupe.margins = 1;
			//expertMode ? groupe.alignment = ["left","top"] : groupe.alignment = ["center","top"];
			groupe.alignment = ["center","top"];
			return groupe;
		}
		function addHGroup(conteneur){
			var groupe = conteneur.add("group");
			//expertMode ? groupe.alignChildren = ["left","fill"] : groupe.alignChildren = ["fill","fill"];
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
			var f = new Window ("palette",titre,undefined,{closeButton:true,resizeable:false});
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

		
		progressPanel.show();
		progressBar.value = 5;
		progressStatus.text = "Duik - Creating UI";
		progressPanel.update();
		
				//TODO update to new UI
		
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
	
		//------------
		// MAIN PANEL
		//------------
		{
			var mainGroup = palette.add("group");
			mainGroup.orientation = "column";
			mainGroup.alignment = ["fill","fill"];
			mainGroup.alignChildren = ["fill","fill"];
			
			//HEADER
			
			//BUTTONS ON THE RIGHT
			var entete = mainGroup.add("group");
			entete.alignChildren = ["left","center"];
			entete.alignment = ["fill","top"];
			entete.spacing = 2;
			entete.margins = 0;
			var boutonhelp = entete.add ("button",undefined,"?");
			boutonhelp.size = [22,22];
			boutonhelp.onClick = help;
			var boutonNotes = entete.add("iconbutton",undefined,dossierIcones + "btn_notes.png");
			boutonNotes.size = [22,22];
			boutonNotes.helpTip = "Simple notepad, with auto-save.";
			boutonNotes.onClick = function () { if (fenetrenotes.visible) fenetrenotes.hide(); else fenetrenotes.show(); };
			var boutonCalc = entete.add("iconbutton",undefined,dossierIcones + "btn_calc.png");
			boutonCalc.size = [22,22];
			boutonCalc.helpTip = "Calculator";
			boutonCalc.onClick = function () { if (fenetrecalc.visible) fenetrecalc.hide(); else fenetrecalc.show(); };
			
			//PANEL NAME
			if (!expertMode)
			{
				var selectorText = entete.add("statictext",undefined,"");
				selectorText.alignment = ["center","center"];
				selectorText.size = [75,22];
			}
			
			//SELECTOR BUTTONS
			var selectorGroup = addVGroup(entete);
			selectorGroup.orientation = "stack";
			selectorGroup.alignment = ["right","center"];
			var selectorButtons = addHGroup(selectorGroup);
			selectorButtons.alignChildren = ["fill","center"];
			var riggingPanelButton = addIconButton(selectorButtons,"sel_rigging.png","");
			riggingPanelButton.size = [22,22];
			var automationPanelButton = addIconButton(selectorButtons,"sel_animation.png","");
			automationPanelButton.size = [22,22];
			var animationPanelButton = addIconButton(selectorButtons,"sel_interpo.png","");
			animationPanelButton.size = [22,22];
			var camerasPanelButton = addIconButton(selectorButtons,"sel_camera.png","");
			camerasPanelButton.size = [22,22];
			var settingsPanelButton = addIconButton(selectorButtons,"sel_settings.png","");
			settingsPanelButton.size = [22,22];
			//LIST
			var selecteur = selectorGroup.add("dropdownlist",undefined,[getMessage(136),"Automation","Animation",getMessage(72),getMessage(75)]);
			selecteur.alignment = ["right","center"];
			selecteur.helpTip = "Panels";
			selecteur.items[0].image = ScriptUI.newImage(dossierIcones + "sel_rigging.png");
			if (expertMode) selecteur.items[0].text = "";
			selecteur.items[1].image = ScriptUI.newImage(dossierIcones + "sel_animation.png");
			if (expertMode) selecteur.items[1].text = "";
			selecteur.items[2].image = ScriptUI.newImage(dossierIcones + "sel_interpo.png");
			if (expertMode) selecteur.items[2].text = "";
			selecteur.items[3].image = ScriptUI.newImage(dossierIcones + "sel_camera.png");
			if (expertMode) selecteur.items[3].text = "";
			selecteur.items[4].image = ScriptUI.newImage(dossierIcones + "sel_settings.png");
			if (expertMode) selecteur.items[4].text = "";
			if (!eval(app.settings.getSetting("duik", "dropDownSelector"))) selecteur.hide();
			else selectorButtons.hide();
			//les panneaux
			var panos = mainGroup.add("group");
			panos.orientation = "stack";
			panos.alignChildren = ["fill","fill"];
			
			var duikText = mainGroup.add ("statictext",undefined,"www.duduf.net - Duik " + version);
			duikText.alignment = ["right","bottom"];
		}
		
		//------------
		// PANELS
		//------------
		var panoik = addVPanel(panos);
		var panoanimation = addVPanel(panos);
		panoanimation.visible = false;
		var panointerpo =  addVPanel(panos);
		panointerpo.visible = false;
		var panocam = addVPanel(panos);
		panocam.visible = false;
		var panosettings = addVPanel(panos);
		panosettings.visible = false;
		var ctrlPanel = addVPanel(panos);
		ctrlPanel.visible = false;
		var ikPanel = addVPanel(panos);
		ikPanel.visible = false;
		var renamePanel = addVPanel(panos);
		renamePanel.visible = false;
		var riePanel = addVPanel(panos);
		riePanel.visible = false;
		var measurePanel = addVPanel(panos);
		measurePanel.visible = false;
		var timeRemapPanel = addVPanel(panos);
		timeRemapPanel.visible = false;
		var exposurePanel = addVPanel(panos);
		exposurePanel.visible = false;
		var celPanel = addVPanel(panos);
		celPanel.visible = false;
		var wigglePanel = addVPanel(panos);
		wigglePanel.visible = false;
		var irPanel = addVPanel(panos);
		irPanel.visible = false;
		
		function displayPanel() {
			ctrlPanel.hide();
			ikPanel.hide();
			renamePanel.hide();
			riePanel.hide();
			measurePanel.hide();
			timeRemapPanel.hide();
			exposurePanel.hide();
			celPanel.hide();
			wigglePanel.hide();
			irPanel.hide();
			if (selecteur.selection == 0){
				panoik.visible = true;
				panoanimation.visible = false;
				panointerpo.visible = false;
				panocam.visible = false;
				panosettings.visible = false;
				app.settings.saveSetting("duik","pano","0");
				if (!expertMode) selectorText.text = "Rigging";
			}
			else if (selecteur.selection == 1){
				panoik.visible = false;
				panoanimation.visible = true;
				panointerpo.visible = false;
				panocam.visible = false;
				panosettings.visible = false;
				app.settings.saveSetting("duik","pano","1");
				if (!expertMode) selectorText.text = "Automation";
			}
			else if (selecteur.selection == 2){
				panoik.visible = false;
				panoanimation.visible = false;
				panointerpo.visible = true;
				panocam.visible = false;
				panosettings.visible = false;
				app.settings.saveSetting("duik","pano","2");
				if (!expertMode) selectorText.text = "Animation";
			}
			else if (selecteur.selection == 3){
				panoik.visible = false;
				panoanimation.visible = false;
				panointerpo.visible = false;
				panocam.visible = true;
				panosettings.visible = false;
				app.settings.saveSetting("duik","pano","3");
				if (!expertMode) selectorText.text = "Cameras";
			}
			else if (selecteur.selection == 4){
				panoik.visible = false;
				panoanimation.visible = false;
				panointerpo.visible = false;
				panocam.visible = false;
				panosettings.visible = true;
				app.settings.saveSetting("duik","pano","4");
				if (!expertMode) selectorText.text = "Settings";
			}
		}

		riggingPanelButton.onClick = function () { selecteur.selection = 0 ; displayPanel(); };
		automationPanelButton.onClick = function () { selecteur.selection = 1 ; displayPanel(); };
		animationPanelButton.onClick = function () { selecteur.selection = 2 ; displayPanel(); };
		camerasPanelButton.onClick = function () { selecteur.selection = 3 ; displayPanel(); };
		settingsPanelButton.onClick = function () { selecteur.selection = 4 ; displayPanel(); };
		
		selecteur.onChange = displayPanel;
		selecteur.selection = eval(app.settings.getSetting("duik","pano"));
		
		//--------------
		// SUB PANELS
		//--------------
		
		// SETTINGS
		{
		var settingsDropdown = panosettings.add("dropdownlist",undefined,["User Interface","Updates","Bones","Controllers","Copy/Paste Animation"]);
		addSeparator(panosettings,"");
		var settingsGroup = panosettings.add("group");
		settingsGroup.orientation = "stack";
		
		var uiGroup = addVGroup(settingsGroup);
		var updatesGroup = addVGroup(settingsGroup);
		var bonesGroup = addVGroup(settingsGroup);
		var controllersGroup = addVGroup(settingsGroup);
		var copyPasteAnimGroup = addVGroup(settingsGroup);
		
		settingsDropdown.onChange = function() {
			if (settingsDropdown.selection == 0) {
				uiGroup.visible = true;
				updatesGroup.visible = false;
				bonesGroup.visible = false;
				controllersGroup.visible = false;
				copyPasteAnimGroup.visible = false;
			}
			else if (settingsDropdown.selection == 1) {
				uiGroup.visible = false;
				updatesGroup.visible = true;
				bonesGroup.visible = false;
				controllersGroup.visible = false;
				copyPasteAnimGroup.visible = false;
			}
			else if (settingsDropdown.selection == 2) {
				uiGroup.visible = false;
				updatesGroup.visible = false;
				bonesGroup.visible = true;
				controllersGroup.visible = false;
				copyPasteAnimGroup.visible = false;
			}
			else if (settingsDropdown.selection == 3) {
				uiGroup.visible = false;
				updatesGroup.visible = false;
				bonesGroup.visible = false;
				controllersGroup.visible = true;
				copyPasteAnimGroup.visible = false;
			}
			else if (settingsDropdown.selection == 4) {
				uiGroup.visible = false;
				updatesGroup.visible = false;
				bonesGroup.visible = false;
				controllersGroup.visible = false;
				copyPasteAnimGroup.visible = true;
			}
		}
		settingsDropdown.selection = 0;
		
		
		//UI
		var groupeLangues = uiGroup.add("group");
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
		addSeparator(uiGroup,"");
		uiGroup.add("statictext",undefined,"Panel selector:");
		var dropDownSelectorButton = uiGroup.add("radiobutton",undefined,"Use dropdown");
		dropDownSelectorButton.value = eval(app.settings.getSetting("duik", "dropDownSelector"));
		dropDownSelectorButton.onClick = function(){
				app.settings.saveSetting("duik","dropDownSelector",dropDownSelectorButton.value);
				if (dropDownSelectorButton.value)
				{
					selecteur.show();
					selectorButtons.hide();
				}
				else
				{
					selecteur.hide();
					selectorButtons.show();
				}
			};
		var buttonsSelectorButton = uiGroup.add("radiobutton",undefined,"Use buttons");
		buttonsSelectorButton.value = eval(app.settings.getSetting("duik", "dropDownSelector"));
		buttonsSelectorButton.value = !eval(app.settings.getSetting("duik", "dropDownSelector"));
		buttonsSelectorButton.onClick = function(){
				app.settings.saveSetting("duik","dropDownSelector",dropDownSelectorButton.value);
				if (dropDownSelectorButton.value)
				{
					selecteur.show();
					selectorButtons.hide();
				}
				else
				{
					selecteur.hide();
					selectorButtons.show();
				}
			};
		addSeparator(uiGroup,"");
		var expertModeButton = uiGroup.add("checkbox",undefined,"Expert Mode");
		expertModeButton.value = eval(app.settings.getSetting("duik", "expertMode"));
		expertModeButton.onClick = function(){app.settings.saveSetting("duik","expertMode",expertModeButton.value)};
		
		//Updates
		var boutonVMAJ = updatesGroup.add("checkbox",undefined,getMessage(77));
		if (app.settings.getSetting("duik", "version") == "oui") {boutonVMAJ.value = true; }
		boutonVMAJ.onClick = function() {
			if (boutonVMAJ.value) {app.settings.saveSetting("duik","version","oui");} else {app.settings.saveSetting("duik","version","non");}
			}
		var boutonMAJ = updatesGroup.add("button",undefined,getMessage(113));
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
		

		//controller types
		var groupeCtrlType = addHGroup(controllersGroup);
		groupeCtrlType.add("statictext",undefined,"Controllers type");
		var boutonCtrlType = groupeCtrlType.add("dropdownlist",undefined,["Null","Icon"]);
		boutonCtrlType.selection = Duik.settings.controllerType-1;
		boutonCtrlType.onChange = function() {
			Duik.settings.controllerType = boutonCtrlType.selection.index+1;
			Duik.settings.save();
			};
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
		var pauiSelectionButton = copyPasteAnimGroup.add("radiobutton",undefined,"Use selection order");
		if (Duik.settings.getLayersMethod == Duik.getLayers.INDEX)
		{
			pauiIndexesButton.value = true;
			pauiNamesButton.value = false;
			pauiSelectionButton.value = false;
		}
		else if (Duik.settings.getLayersMethod == Duik.getLayers.SELECTION_INDEX)
		{
			pauiIndexesButton.value = false;
			pauiNamesButton.value = false;
			pauiSelectionButton.value = true;
		}
		else
		{
			pauiIndexesButton.value = false;
			pauiNamesButton.value = true;
			pauiSelectionButton.value = false;
		}

		function pauiClicked ()
		{
			if (pauiIndexesButton.value)
			{
				Duik.settings.getLayersMethod = Duik.getLayers.INDEX;
			}
			else if (pauiNamesButton.value)
			{
				Duik.settings.getLayersMethod = Duik.getLayers.NAME;
			}
			else if (pauiSelectionButton.value)
			{
				Duik.settings.getLayersMethod = Duik.getLayers.SELECTION_INDEX;
			}
			Duik.settings.save();
		}
		
		pauiIndexesButton.onClick = pauiClicked;
		pauiNamesButton.onClick = pauiClicked;
		pauiSelectionButton.onClick = pauiClicked;
			Duik.settings.pasteAnimUseIndexes = pauiIndexesButton.value;
			Duik.settings.save();
		};
		
		// RIGGING
		{
			//bouton autorig
			var boutonautorig = addIconButton(panoik,"btn_autorig.png",getMessage(142)) ;
			boutonautorig.onClick = autorig;
			boutonautorig.helpTip = "Autorig";
			//boutonautorig.helpTip = "tip à écrire";
			var groupeik = addHGroup(panoik);
			var groupeikG = addVGroup(groupeik);
			var groupeikD = addVGroup(groupeik);
			//bouton pour créer l'IK
			var boutonik = addIconButton(groupeikG,"btn_creer.png",getMessage(114));
			boutonik.onClick = ik;
			boutonik.helpTip = "IK";
			//bouton pour créer un goal
			var boutongoal = addIconButton(groupeikD,"btn_goal.png",getMessage(115));
			boutongoal.onClick = pregoal;
			boutongoal.helpTip = getMessage(79);
			//bouton controleur
			var controllerButton =  addIconButton(groupeikG,"btn_controleur.png",getMessage(116));
			controllerButton.onClick = function () { controllersFromRiggingPanel = true; controllerButtonClicked(); };
			controllerButton.helpTip = "Controller";
			//bouton bone
			var boutonbone2 = addIconButton(groupeikD,"btn_bones.png",getMessage(117));
			boutonbone2.onClick = bone;
			boutonbone2.helpTip = getMessage(83);
			//bouton zero
			var boutonzero2 = addIconButton(groupeikG,"btn_zero.png",getMessage(118));
			boutonzero2.onClick = zero;
			boutonzero2.helpTip = getMessage(84);
			//bouton rotmorph
			var boutonrotmorph = addIconButton(groupeikD,"btn_rotmorph.png",getMessage(119));
			boutonrotmorph.onClick = rotmorph;
			boutonrotmorph.helpTip = getMessage(120);
			//bouton renommer
			var boutonrename = addIconButton(groupeikG,"btn_renommer.png",getMessage(111));
			boutonrename.onClick = function() { panoik.hide(); renamePanel.show();}
			boutonrename.helpTip = getMessage(85);
			//bouton mesurer
			var boutonmesurer = addIconButton(groupeikD,"btn_mesurer.png",getMessage(106));
			boutonmesurer.onClick = function () {mesure();panoik.hide();measurePanel.show();};
			boutonmesurer.helpTip = getMessage(100);
			//replace in expressions button
			var rieButton = addIconButton(groupeikG,"btn_replaceinexpr.png","Search and Replace");
			rieButton.onClick = function () { panoik.hide(); riePanel.show();}
			rieButton.helpTip = "Search and replace text in expressions";
			//lock button
			var lockButton = addIconButton(groupeikD,"ctrl_lock.png","Lock property");
			lockButton.onClick = lockButtonClicked;
			lockButton.helpTip = "Locks the selected property";
		}
		
		// ANIMATION
		{
			addSeparator(panointerpo,"Interpolation");
			
			// INTERPOLATIONS
			{
				var groupeInterpoClefs = addHGroup(panointerpo);
				//groupeInterpoClefs.alignChildren = ["right","top"];
				var rovingButton = groupeInterpoClefs.add("iconbutton",undefined,dossierIcones + "interpo_roving.png");
				rovingButton.size = [20,20];
				rovingButton.onClick = roving;
				rovingButton.helpTip = "Roving key";
				var boutonLineaire = groupeInterpoClefs.add("iconbutton",undefined,dossierIcones + "interpo_lineaire.png");
				boutonLineaire.size = [20,20];
				boutonLineaire.onClick = lineaire;
				boutonLineaire.helpTip = "Interpolation Linéaire";
				var boutonLissageA = groupeInterpoClefs.add("iconbutton",undefined,dossierIcones + "interpo_lissagea.png");
				boutonLissageA.size = [20,20];
				boutonLissageA.onClick = lissageA;
				boutonLissageA.helpTip = "Lissage à l'approche";
				var boutonLissageE = groupeInterpoClefs.add("iconbutton",undefined,dossierIcones + "interpo_lissagee.png");
				boutonLissageE.size = [20,20];
				boutonLissageE.onClick = lissageE;
				boutonLissageE.helpTip = "Lissage à l'éloignement";
				var boutonLissage = groupeInterpoClefs.add("iconbutton",undefined,dossierIcones + "interpo_bezier.png");
				boutonLissage.size = [20,20];
				boutonLissage.onClick = lissage;
				boutonLissage.helpTip = "Amorti";
				var boutonContinu = groupeInterpoClefs.add("iconbutton",undefined,dossierIcones + "interpo_continu.png");
				boutonContinu.size = [20,20];
				boutonContinu.onClick = continu;
				boutonContinu.helpTip = "Vitesse continue (Bézier Auto)";
				var boutonMaintien = groupeInterpoClefs.add("iconbutton",undefined,dossierIcones + "interpo_maintien.png");
				boutonMaintien.size = [20,20];
				boutonMaintien.onClick = maintien;
				boutonMaintien.helpTip = "Maintien";
				
				var groupeInterpo1 = addHGroup(panointerpo);
				groupeInterpo1.spacing = 2;
				var groupeInterpo2 = addHGroup(panointerpo);
				groupeInterpo2.spacing = 2;
				var groupeInterpo3 = addHGroup(panointerpo);
				groupeInterpo3.spacing = 2;
				var bouton0 = groupeInterpo1.add("button",undefined,"0");
				bouton0.onClick = function() {texteInfluence.text = 1;infl(1);};
				bouton0.helpTip = "Influence à 1%";
				bouton0.size = [30,22];
				var bouton10 = groupeInterpo1.add("button",undefined,"10");
				bouton10.onClick = function() {texteInfluence.text = 10;infl(10);};
				bouton10.helpTip = "Influence à 10%";
				bouton10.size = [30,22];
				var bouton25 = groupeInterpo1.add("button",undefined,"25");
				bouton25.onClick = function() {texteInfluence.text = 25;infl(25);};
				bouton25.helpTip = "Influence à 25%";
				bouton25.size = [30,22];
				var bouton50 = groupeInterpo2.add("button",undefined,"50");
				bouton50.onClick = function() {texteInfluence.text = 50;infl(50);};
				bouton50.helpTip = "Influence à 50%";
				bouton50.size = [30,22];
				var bouton75 = groupeInterpo2.add("button",undefined,"75");
				bouton75.onClick = function() {texteInfluence.text = 75;infl(75);};
				bouton75.helpTip = "Influence à 75%";
				bouton75.size = [30,22];
				var bouton90 = groupeInterpo2.add("button",undefined,"90");
				bouton90.onClick = function() {texteInfluence.text = 90;infl(90);};
				bouton90.helpTip = "Influence à 90%";
				bouton90.size = [30,22];
				var bouton100 = groupeInterpo3.add("button",undefined,"100");
				bouton100.onClick = function() {texteInfluence.text = 100;infl(100);};
				bouton100.helpTip = "Influence à 100%";
				bouton100.size = [30,22];
				var texteInfluence = groupeInterpo3.add("edittext",undefined,"-");
				texteInfluence.size = [40,22];
				texteInfluence.onChange = function() {infl(parseFloat(texteInfluence.text));};
				var boutonInfluence = addIconButton(groupeInterpo3,"btn_valid.png","");
				boutonInfluence.size = [30,22];
				boutonInfluence.onClick = function() {infl(parseFloat(texteInfluence.text));};

				var groupeInterpoInOut = addHGroup(panointerpo);
				var boutonApproche = groupeInterpoInOut.add("checkbox",undefined,getMessage(86));
				var boutonEloignement = groupeInterpoInOut.add("checkbox",undefined,getMessage(87));
				boutonApproche.value = true;
				boutonEloignement.value = true;
				boutonApproche.helpTip = getMessage(88);
				boutonEloignement.helpTip = getMessage(89);
				boutonApproche.onClick = function() { if (boutonApproche.value == false) boutonEloignement.value = true; };
				boutonEloignement.onClick = function() { if (boutonEloignement.value == false) boutonApproche.value = true; };
				
				var morpherGroup = addHGroup(panointerpo);
				var boutonMoprher = addIconButton(morpherGroup,"btn_morph.png","Morpher");
				boutonMoprher.onClick = morpher;
				boutonMoprher.helpTip = getMessage(90);
				var boutonMKey = morpherGroup.add("checkbox",undefined,"Keyframes");
				boutonMKey.value = true;
				boutonMKey.alignment = ["fill","bottom"];
			}
			
			addSeparator(panointerpo,"Tools");
			
			// TOOLS
			{
				var importRigButton = addIconButton(panointerpo,"/btn_importrig.png","Import rig in comp");
				importRigButton.onClick = function () { panointerpo.hide(); irRigRefreshButtonClicked(); irPanel.show(); };
				importRigButton.helpTip = "Automatically imports a rig in the active comp, transfering the controllers and taking care of duplicates.";
				
				animationToolsGroup = addHGroup(panointerpo);
			
				var animationToolsGroupL = addVGroup(animationToolsGroup);
				var animationToolsGroupR = addVGroup(animationToolsGroup);
				
				//bouton Copy ANIM
				var boutonCopyAnim = addIconButton(animationToolsGroupL,"/btn_copy.png",getMessage(129));
				boutonCopyAnim.onClick = function ca() { animationSaved = copyAnim() };
				boutonCopyAnim.helpTip = getMessage(131);
				//bouton Paste ANIM
				var boutonPasteAnim = addIconButton(animationToolsGroupR,"/btn_paste.png",getMessage(130));
				boutonPasteAnim.onClick = function pa() { pasteAnim(animationSaved) };
				boutonPasteAnim.helpTip = getMessage(132);
				//Cel
				var celButton = addIconButton(animationToolsGroupL,"btn_cel.png","Cel animation");
				celButton.helpTip = "Cel animation tools";
				celButton.onClick = function () { panointerpo.hide(); celPanel.show(); } ;
				//controllers
				var controllerButton2 =  addIconButton(animationToolsGroupR,"btn_controleur.png",getMessage(116));
				controllerButton2.onClick = function () { controllersFromRiggingPanel = false; controllerButtonClicked(); };
				controllerButton2.helpTip = "Controllers";
			}
			
		}
		
		// AUTOMATION
		{	
			animationMainGroup = addHGroup(panoanimation);
			
			var groupeAnimationG = addVGroup(animationMainGroup);
			var groupeAnimationD = addVGroup(animationMainGroup);
			//bouton wiggle
			var boutonwiggle = addIconButton(groupeAnimationG,"btn_wiggle.png",getMessage(121));
			boutonwiggle.onClick = wiggle;
			boutonwiggle.helpTip = getMessage(92);
			//bouton oscillation
			var boutonosc = addIconButton(groupeAnimationD,"btn_osc.png","Swing");
			boutonosc.onClick = oscillation;
			boutonosc.helpTip = getMessage(93);
			//bouton nframes
			var boutonnframes = addIconButton(groupeAnimationG,"btn_expo.png","Exposure");
			boutonnframes.onClick = function () { panoanimation.hide(); exposurePanel.show(); } ;
			boutonnframes.helpTip = getMessage(94);
			//bouton path follow
			var boutonpathfollow = addIconButton(groupeAnimationD,"btn_pf.png",getMessage(124));
			boutonpathfollow.onClick = pathFollow;
			boutonpathfollow.helpTip = getMessage(95);
			 //bouton roue
			var boutonroue = addIconButton(groupeAnimationG,"btn_roue.png",getMessage(125));
			boutonroue.onClick = creroue;
			boutonroue.helpTip = getMessage(96);
			//bouton spring
			var boutonspring = addIconButton(groupeAnimationD,"btn_rebond.png",getMessage(126));
			boutonspring.onClick = spring;
			boutonspring.helpTip = getMessage(97);
			//bouton lien de distance
			var boutondistance = addIconButton(groupeAnimationG,"btn_lien-de-distance.png",getMessage(127));
			boutondistance.onClick = distanceLink;
			boutondistance.helpTip = getMessage(98);
			//bouton lentille
			var boutonlentille = addIconButton(groupeAnimationD,"/btn_lentille.png",getMessage(128));
			boutonlentille.onClick = lentille;
			boutonlentille.helpTip = getMessage(99);
			//Paint Rig button
			var paintRigButton = addIconButton(groupeAnimationG,"/btn_paint.png","Paint rigging");
			paintRigButton.onClick = paintRigButtonClicked;
			paintRigButton.helpTip = "Rig the paint effects to be able to animate all strokes as if there was only one.";
			//Blink
			var blinkButton = addIconButton(groupeAnimationD,"/btn_blink.png","Blink");
			blinkButton.onClick = blinkButtonClicked;
			blinkButton.helpTip = "Makes the property blink.";
			//Timeremap
			var timeRemapButton = addIconButton(groupeAnimationG,"btn_timeremap.png","Time remap");
			timeRemapButton.onClick = function () { panoanimation.hide(); timeRemapPanel.show(); } ;
			//timeRemapButton.onClick = paintRigButtonClicked;
			timeRemapButton.helpTip = "Time remapping tools.";
			//Placeholder
			addButton(groupeAnimationD,"");
		}
		
		// CAMERAS
		{
			panocam.orientation = "row";
			var groupCameraG = addVGroup(panocam);
			var groupCameraD = addVGroup(panocam);
			//bouton pour créer une target cam
			var boutontcam = addIconButton(groupCameraG,"btn_controleur-cam.png",getMessage(134));
			boutontcam.onClick = controlcam;
			boutontcam.helpTip = getMessage(102);
			//bouton pour multiplan 2D
			var boutontcam2d = addIconButton(groupCameraG,"btn_2dmultiplane.png",getMessage(188));
			boutontcam2d.onClick = function () { fenetremultiplan.show() ;};
			boutontcam2d.helpTip = "Creates multiplane controllers to use as a 2D camera";
			//scale Z-link button
			var scaleZLinkButton = addIconButton(groupCameraG,"btn_scalezlink.png","Scale Z-Link");
			scaleZLinkButton.onClick = scaleZLinkButtonClicked;
			scaleZLinkButton.helpTip = "Links the distance of the layer from the camera to its scale, so its apparent size won't change.";
			
		}
		
		//---------------
		// DIALOGS
		//---------------

		//CONTROLLERS PANEL
		{
			var ctrlMainGroup = addHGroup(ctrlPanel);
			ctrlMainGroup.spacing = 15;
			ctrlMainGroup.alignChildren = ["fill","top"];
			var ctrlShapeGroup = addVGroup(ctrlMainGroup);
			ctrlShapeGroup.alignChildren = ["fill","top"];
			var ctrlRotationGroup = addHGroup(ctrlShapeGroup);
			var ctrlRotationButton = ctrlRotationGroup.add("checkbox",undefined,"");
			ctrlRotationButton.value = true;
			ctrlRotationButton.helpTip = "Rotation";
			ctrlRotationButton.alignment = ["left","bottom"];
			ctrlRotationGroup.add("image",undefined,dossierIcones + "ctrl_rot.png");
			var ctrlXPositionGroup = addHGroup(ctrlShapeGroup);
			var ctrlXPositionButton = ctrlXPositionGroup.add("checkbox",undefined,"");
			ctrlXPositionButton.value = true;
			ctrlXPositionButton.helpTip = "X position";
			ctrlXPositionButton.alignment = ["left","bottom"];
			ctrlXPositionGroup.add("image",undefined,dossierIcones + "ctrl_xpos.png");
			var ctrlYPositionGroup = addHGroup(ctrlShapeGroup);
			var ctrlYPositionButton = ctrlYPositionGroup.add("checkbox",undefined,"");
			ctrlYPositionButton.value = true;
			ctrlYPositionButton.helpTip = "Y position";
			ctrlYPositionButton.alignment = ["left","bottom"];
			ctrlYPositionGroup.add("image",undefined,dossierIcones + "ctrl_ypos.png");
			var ctrlScaleGroup = addHGroup(ctrlShapeGroup);
			var ctrlScaleButton = ctrlScaleGroup.add("checkbox",undefined,"");
			ctrlScaleButton.alignment = ["left","bottom"];
			ctrlScaleButton.helpTip = "Scale";
			ctrlScaleGroup.add("image",undefined,dossierIcones + "ctrl_sca.png");
			var ctrlArcGroup = addHGroup(ctrlShapeGroup);
			var ctrlArcButton = ctrlArcGroup.add("checkbox",undefined,"");
			ctrlArcButton.helpTip = "Arc";
			ctrlArcButton.onClick = function () {
				ctrlRotationButton.enabled = !ctrlArcButton.value;
				ctrlXPositionButton.enabled = !ctrlArcButton.value;
				ctrlYPositionButton.enabled = !ctrlArcButton.value;
				ctrlScaleButton.enabled = !ctrlArcButton.value;
				ctrlEyeButton.enabled = !ctrlArcButton.value;
			}
			ctrlArcButton.alignment = ["left","bottom"];
			ctrlArcGroup.add("image",undefined,dossierIcones + "ctrl_arc.png");
			var ctrlEyeGroup = addHGroup(ctrlShapeGroup);
			var ctrlEyeButton = ctrlEyeGroup.add("checkbox",undefined,"");
			ctrlEyeButton.helpTip = "Eye";
			ctrlEyeButton.onClick = function () {
				ctrlRotationButton.enabled = !ctrlEyeButton.value;
				ctrlXPositionButton.enabled = !ctrlEyeButton.value;
				ctrlYPositionButton.enabled = !ctrlEyeButton.value;
				ctrlScaleButton.enabled = !ctrlEyeButton.value;
				ctrlArcButton.enabled = !ctrlEyeButton.value;
			}
			ctrlEyeButton.alignment = ["left","bottom"];
			ctrlEyeGroup.add("image",undefined,dossierIcones + "ctrl_eye.png");
			
			var ctrlSettingsGroup = addVGroup(ctrlMainGroup);
			ctrlSettingsGroup.alignChildren = ["fill","top"];
			//taille des controleurs
			var ctrlSizeGroup = addHGroup(ctrlSettingsGroup);
			var ctrlSizeAutoGroup = addHGroup(ctrlSettingsGroup);
			if (!expertMode) ctrlSizeGroup.add("statictext",undefined,getMessage(169));
			var ctrlSizeEdit = ctrlSizeGroup.add("edittext",undefined,app.settings.getSetting("duik", "ctrlSize"));
			ctrlSizeEdit.helpTip = "Size";
			ctrlSizeEdit.onChange = function() {
				Duik.settings.controllerSize = parseInt(ctrlSizeEdit.text);
				Duik.settings.save();
				};
			ctrlSizeEdit.text = Duik.settings.controllerSize;
			//taille auto controleurs
			var ctrlSizeAutoButton = ctrlSizeAutoGroup.add("checkbox",undefined,expertMode ? "" : getMessage(170));
			ctrlSizeAutoButton.helpTip = "Auto-size";
			ctrlSizeAutoButton.alignment = ["left","bottom"];
			ctrlSizeAutoButton.onClick = function() {
				ctrlSizeEdit.enabled = !ctrlSizeAutoButton.value;
				ctrlSizeAutoList.enabled = ctrlSizeAutoButton.value;
				Duik.settings.controllerSizeAuto = ctrlSizeAutoButton.value;
				Duik.settings.save();
				};
			ctrlSizeAutoButton.value = Duik.settings.controllerSizeAuto;
			//size hint controllers
			var ctrlSizeAutoList = ctrlSizeAutoGroup.add("dropdownlist",undefined,[getMessage(171),getMessage(172),getMessage(173)]);
			ctrlSizeAutoList.selection = Duik.settings.controllerSizeHint;
			ctrlSizeAutoList.helpTip = "Auto-size";
			ctrlSizeAutoList.onChange = function () {
				Duik.settings.controllerSizeHint = ctrlSizeAutoList.selection.index;
				Duik.settings.save();
				};
			ctrlSizeEdit.enabled = !ctrlSizeAutoButton.value ;
			ctrlSizeAutoList.enabled = ctrlSizeAutoButton.value ;
			//color
			var ctrlColorGroup = addHGroup(ctrlSettingsGroup);
			if (!expertMode) ctrlColorGroup.add("statictext",undefined,"Color");
			var ctrlColorList = ctrlColorGroup.add("dropdownlist",undefined,["Red","Green","Blue","Cyan","Magenta","Yellow","White","Light Grey","Dark Grey","Black"]);
			ctrlColorList.selection = 6;
			ctrlColorList.helpTip = "Color";
			//autolock
			var ctrlAutoLockButton = ctrlSettingsGroup.add("checkbox",undefined,"Auto Lock");
			ctrlAutoLockButton.alignment = ["fill","bottom"];
			ctrlAutoLockButton.helpTip = "Warning! When controllers are locked,\nthey should be unlocked before parenting.";
			if (!expertMode)
			{
				var ctrlAutoLockText = ctrlPanel.add("statictext",undefined,"Warning! When controllers are locked,\nthey should be unlocked before parenting.",{multiline:true});
				ctrlAutoLockText.visible = false;
				ctrlAutoLockButton.onClick = function () { ctrlAutoLockText.visible = ctrlAutoLockButton.value ; } ;
			}
			//lock buttons
			var ctrlLockButtonsGroup = addHGroup(ctrlPanel);
			var ctrlUnlockButton = addIconButton(ctrlLockButtonsGroup,"ctrl_unlock.png","");
			ctrlUnlockButton.helpTip =  "Unlock selected controllers\n(all controllers if none selected)";
			ctrlUnlockButton.onClick = ctrlUnlockButtonClicked;
			var ctrlLockButton = addIconButton(ctrlLockButtonsGroup,"ctrl_lock.png","");
			ctrlLockButton.helpTip =  "Lock selected controllers\n(all controllers if none selected)";
			ctrlLockButton.onClick = ctrlLockButtonClicked;
			//hide buttons
			var ctrlUnhideButton = addIconButton(ctrlLockButtonsGroup,"ctrl_unhide.png","");
			ctrlUnhideButton.helpTip =  "Unhide selected controllers\n(all controllers if none selected)";
			ctrlUnhideButton.onClick = ctrlUnhideButtonClicked;
			var ctrlHideButton = addIconButton(ctrlLockButtonsGroup,"ctrl_hide.png","");
			ctrlHideButton.helpTip =  "Hide selected controllers\n(all controllers if none selected)";
			ctrlHideButton.onClick = ctrlHideButtonClicked;
			//reset button
			var ctrlResetButton = addIconButton(ctrlLockButtonsGroup,"ctrl_zero.png","");
			ctrlResetButton.helpTip =  "Reset selected controllers transformations";
			ctrlResetButton.onClick = ctrlResetButtonClicked;
			//buttons
			var ctrlButtonsGroup = addHGroup(ctrlPanel);
			var ctrlCloseButton = addIconButton(ctrlButtonsGroup,"btn_cancel.png","Back");
			ctrlCloseButton.alignment = ["left","top"];
			ctrlCloseButton.helpTip = "Back";
			ctrlCloseButton.onClick = function () { ctrlPanel.hide() ; controllersFromRiggingPanel ? panoik.show() : panointerpo.show(); };
			var ctrlUpdateButton = addIconButton(ctrlButtonsGroup,"btn_update.png","Update");
			ctrlUpdateButton.alignment = ["right","top"];
			ctrlUpdateButton.helpTip = "Update";
			ctrlUpdateButton.onClick = function () { ctrlUpdateButtonClicked(); ctrlPanel.hide() ; controllersFromRiggingPanel ? panoik.show() : panointerpo.show(); };
			var ctrlCreateButton = addIconButton(ctrlButtonsGroup,"btn_valid.png","Create");
			ctrlCreateButton.alignment = ["right","top"];
			ctrlCreateButton.helpTip = "Create";
			ctrlCreateButton.onClick = function () { controleur(); ctrlPanel.hide() ; controllersFromRiggingPanel ? panoik.show() : panointerpo.show(); };
		}
		//IK PANEL
		{					
			var ikTypeGroup = ikPanel.add("group");
			ikTypeGroup.orientation = "stack";
			var ikType4Group = addHGroup(ikTypeGroup);
			ikType4Group.visible = false;
			var ikType3Group = addHGroup(ikTypeGroup);
			ikType3Group.visible = false;
			var ikType2Group = addHGroup(ikTypeGroup);
			ikType2Group.visible = false;
			var ikType1Group = addHGroup(ikTypeGroup);
			ikType1Group.visible = false;
			
			if (!expertMode)
			{
				var ik3GoalGroup = addVGroup(ikType4Group);
				ik3GoalGroup.alignChildren = ["center","top"];
				ik3GoalGroup.add("image",undefined,dossierIcones + "btn_3layerikgoal.png");
			}
			expertMode ? ikType4Group.add("statictext",undefined,"3+1") : ik3GoalGroup.add("statictext",undefined,"3-Layer IK & Goal");
			
			if (!expertMode)
			{
				var ik3LayerGroup = addVGroup(ikType3Group);
				ik3LayerGroup.alignChildren = ["center","top"];
				ik3LayerGroup.add("image",undefined,dossierIcones + "btn_3layerik.png");
			}
			var ik3LayerButton = expertMode ? ikType3Group.add("radiobutton",undefined,"3") : ik3LayerGroup.add("radiobutton",undefined,"3-Layer IK");
			if (!expertMode)
			{
				var ik2GoalGroup = addVGroup(ikType3Group);
				ik2GoalGroup.alignChildren = ["center","top"];
				ik2GoalGroup.add("image",undefined,dossierIcones + "btn_2layerikgoal.png");
			}
			var ik2GoalButton = expertMode ? ikType3Group.add("radiobutton",undefined,"2+1") : ik2GoalGroup.add("radiobutton",undefined,"2-Layer IK & Goal");

			if (!expertMode)
			{
				var ik1GoalGroup = addVGroup(ikType2Group);
				ik1GoalGroup.alignChildren = ["center","top"];
				ik1GoalGroup.add("image",undefined,dossierIcones + "btn_1layerikgoal.png");
			}
			var ik1GoalButton = expertMode ? ikType2Group.add("radiobutton",undefined,"1+1") : ik1GoalGroup.add("radiobutton",undefined,"1-Layer IK & Goal");
			if (!expertMode)
			{
				var ik2LayerGroup = addVGroup(ikType2Group);
				ik2LayerGroup.alignChildren = ["center","top"];
				ik2LayerGroup.add("image",undefined,dossierIcones + "btn_2layerik.png");
			}
			var ik2LayerButton = expertMode ?  ikType2Group.add("radiobutton",undefined,"2") : ik2LayerGroup.add("radiobutton",undefined,"2-Layer IK");
			
			if (!expertMode)
			{
				var ik1LayerGroup = addVGroup(ikType1Group);
				ik1LayerGroup.alignChildren = ["center","top"];
				ik1LayerGroup.add("image",undefined,dossierIcones + "btn_1layerik.png");
			}
			expertMode ? ikType1Group.add("statictext",undefined,"1") : ik1LayerGroup.add("statictext",undefined,"1-Layer IK (LookAt)");
			
			addSeparator(ikPanel,"");
			
			var ikSettingsGroup = addHGroup(ikPanel);
			
			var ikCWButton = ikSettingsGroup.add("checkbox",undefined,"Clockwise");
			ikCWButton.visible = false;
								
			var ik3DGroup = addVGroup(ikSettingsGroup);
			ik3DGroup.visible = false;
			var ikFrontFacingButton = ik3DGroup.add("radiobutton",undefined,"Front/Back view");
			var ikRightFacingButton = ik3DGroup.add("radiobutton",undefined,"Left/Right view");
			
			ik3LayerButton.onClick = function () { ik2GoalButton.value = false; ik3DGroup.enabled = false;  ikCWButton.enabled = true;};
			ik2GoalButton.onClick = function () { ik3LayerButton.value = false; ik3DGroup.enabled = true; ikCWButton.enabled = true;};
			
			ik2LayerButton.onClick = function () { ik1GoalButton.value = false; ik3DGroup.enabled = true; ikCWButton.enabled = true;};
			ik1GoalButton.onClick = function () { ik2LayerButton.value = false; ik3DGroup.enabled = false; ikCWButton.enabled = false; };
			
			var ikButtonsGroup = addHGroup(ikPanel);
			var ikCancelButton = addIconButton(ikButtonsGroup,"btn_cancel.png","Cancel");
			ikCancelButton.onClick = function () { ikPanel.hide();panoik.show(); };
			var ikCreateButton = addIconButton(ikButtonsGroup,"btn_valid.png","Create");
			
			
		}
		//RENAME PANEL
		{
			var renameTypeGroup = addHGroup(renamePanel);
			function renameTypeSelect() {
				if (renameLayersButton.value || renameItemsButton.value)
				{
					renameInExpressionsButton.enabled = true;
				}
				else
				{
					renameInExpressionsButton.enabled = false;
				}
			}
			var renameLayersButton = renameTypeGroup.add("radiobutton",undefined,"Layers");
			renameLayersButton.value = true;
			renameLayersButton.onClick = renameTypeSelect;
			var renamePinsButton = renameTypeGroup.add("radiobutton",undefined,"Pins");
			renamePinsButton.onClick = renameTypeSelect;
			var renameItemsButton = renameTypeGroup.add("radiobutton",undefined,"Project Items");
			renameItemsButton.onClick = renameTypeSelect;

			addSeparator(renamePanel,"");
			//nom
			var groupeNom = addHGroup(renamePanel);
			groupeNom.alignChildren = ["fill","center"];
			var nametexte = groupeNom.add("checkbox",undefined,getMessage(108));
			nametexte.alignment = ["left","center"];
			var name = groupeNom.add("edittext",undefined);
			name.enabled = false;
				nametexte.onClick = function() {
				name.enabled = nametexte.value;
				}
			//prefix
			renamePanel.alignChildren = ["fill","top"];
			var groupePrefix = addHGroup(renamePanel);
			groupePrefix.alignChildren = ["fill","center"];
			var prefixtexte = groupePrefix.add("checkbox",undefined,getMessage(107));
			prefixtexte.alignment = ["left","center"];
			var prefix = groupePrefix.add("edittext",undefined);
			prefix.enabled = false;
			prefixtexte.onClick = function() {
				prefix.enabled = prefixtexte.value;
				}
			//suffix
			var groupeSuffix = addHGroup(renamePanel);
			groupeSuffix.alignChildren = ["fill","center"];
			var suffixtexte = groupeSuffix.add("checkbox",undefined,getMessage(109));
			suffixtexte.alignment = ["left","center"];
			var suffix = groupeSuffix.add("edittext",undefined);
			suffix.enabled = false;
			suffixtexte.onClick = function() {
				suffix.enabled = suffixtexte.value;
				}
			//remove first digits
			var renameRemFirstDGroup = addHGroup(renamePanel);
			renameRemFirstDGroup.add("statictext",undefined,"Remove first");
			var renameRemFirstDValue = renameRemFirstDGroup.add("edittext",undefined,"0");
			renameRemFirstDGroup.add("statictext",undefined,"digits.");
			//remove last digits
			var renameRemLastDGroup = addHGroup(renamePanel);
			renameRemLastDGroup.add("statictext",undefined,"Remove last");
			var renameRemLastDValue = renameRemLastDGroup.add("edittext",undefined,"0");
			renameRemLastDGroup.add("statictext",undefined,"digits.");
			//numéros
			var groupeNumeros = addHGroup(renamePanel);
			groupeNumeros.alignChildren = ["fill","center"];
			var numerotexte = groupeNumeros.add("checkbox",undefined,getMessage(110));
			numerotexte.alignment = ["left","center"];
			var numero = groupeNumeros.add("edittext",undefined,"1");
			numero.enabled = false;
			numerotexte.onClick = function() {
				numerotexte.value ? numero.enabled = true : numero.enabled = false ;
				}
			addSeparator(renamePanel,"");
			//in expressions too
			var renameInExpressionsButton = renamePanel.add("checkbox",undefined,"Update expressions");
			renameInExpressionsButton.value = true;
			//buttons
			var renameButtonsGroup = addHGroup(renamePanel);
			var renameCloseButton = addIconButton(renameButtonsGroup,"btn_cancel.png","Back");
			renameCloseButton.alignment = ["left","top"];
			renameCloseButton.onClick = function () { renamePanel.hide() ; panoik.show(); };
			var renameCreateButton = addIconButton(renameButtonsGroup,"btn_valid.png","Rename");
			renameCreateButton.alignment = ["right","top"];
			renameCreateButton.onClick = rename;
		}
		//SEARCH AND REPLACE PANEL
		{
			var rieTypeGroup = addHGroup(riePanel);
			var rieExpressionsButton = rieTypeGroup.add("radiobutton",undefined,"Expressions");
			rieExpressionsButton.value = true;
			function rieTypeSelect() {
				if (rieExpressionsButton.value)
				{
					rieOptionsGroup.show();
					rieItemGroup.hide();
					rieUpdateExpressionsButton.enabled = false;
				}
				else if (rieLayersButton.value)
				{
					rieOptionsGroup.show();
					rieItemGroup.hide();
					rieUpdateExpressionsButton.enabled = true;
				}
				else
				{
					rieOptionsGroup.hide();
					rieItemGroup.show();
					rieUpdateExpressionsButton.enabled = rieCompItemButton.value;
				}
			}
			rieExpressionsButton.onClick = rieTypeSelect;
			var rieLayersButton = rieTypeGroup.add("radiobutton",undefined,"Layers");
			rieLayersButton.onClick = rieTypeSelect;
			var rieItemsButton = rieTypeGroup.add("radiobutton",undefined,expertMode ? "Items" : "Project Items");
			rieItemsButton.onClick = rieTypeSelect;
			//options
			var rieMainOptionsGroup = addHGroup(riePanel);
			rieMainOptionsGroup.orientation = "stack";
			var rieItemGroup = addVGroup(rieMainOptionsGroup);
			var rieItemTypeGroup = addHGroup(rieItemGroup);
			var rieCompItemButton = rieItemTypeGroup.add("checkbox",undefined,"Comps");
			rieCompItemButton.value = true;
			rieCompItemButton.onClick = function() { rieUpdateExpressionsButton.enabled = rieCompItemButton.value; } ;
			var rieFootageItemButton = rieItemTypeGroup.add("checkbox",undefined,"Footage");
			rieFootageItemButton.value = true;
			var rieFolderItemButton = rieItemTypeGroup.add("checkbox",undefined,"Folders");
			rieFolderItemButton.value = true;
			var rieItemSelectionGroup = addHGroup(rieItemGroup);
			var rieItemSelectedButton = rieItemSelectionGroup.add("radiobutton",undefined,"Selected Items");
			var rieItemAllButton = rieItemSelectionGroup.add("radiobutton",undefined,"All Items");
			rieItemAllButton.value = true;
			rieItemGroup.hide();
			
			var rieOptionsGroup = addVGroup(rieMainOptionsGroup);
			var rieCompGroup = addHGroup(rieOptionsGroup);
			var rieCurrentCompButton = rieCompGroup.add("radiobutton",undefined,expertMode ? "Active" : "Active comp");
			var rieAllCompsButton = rieCompGroup.add("radiobutton",undefined,"All comps");
			rieCurrentCompButton.onClick = function () {
				rieLayerGroup.enabled = rieCurrentCompButton.value;
			}
			rieAllCompsButton.onClick = function () {
				rieLayerGroup.enabled = rieCurrentCompButton.value;
			}
			rieCurrentCompButton.value = true;
			var rieLayerGroup = addHGroup(rieOptionsGroup);
			var rieSelectedLayersButton = rieLayerGroup.add("radiobutton",undefined,expertMode ? "Selected" : "Selected layers");
			var rieAllLayersButton = rieLayerGroup.add("radiobutton",undefined,"All layers");
			rieAllLayersButton.value = true;
			
			addSeparator(riePanel,"");
			var rieOldGroup = addHGroup(riePanel);
			var rieOldText = rieOldGroup.add("statictext",undefined,"Search");
			rieOldText.alignment = ["left","top"];
			var rieOldEdit = rieOldGroup.add("edittext",undefined,"");
			rieOldEdit.alignment = ["fill","fill"];
			var rieNewGroup = addHGroup(riePanel);
			var rieNewText = rieNewGroup.add("statictext",undefined,"Replace");
			rieNewText.alignment = ["left","top"];
			var rieNewEdit = rieNewGroup.add("edittext",undefined,"");
			rieNewEdit.alignment = ["fill","fill"];	
			
			addSeparator(riePanel,"");
			var rieUpdateExpressionsButton = riePanel.add("checkbox",undefined,"Update expressions");
			rieUpdateExpressionsButton.enabled = false;
			rieUpdateExpressionsButton.value = true;
			var rieButtonsGroup = addHGroup(riePanel);
			var rieCancelButton = addIconButton(rieButtonsGroup,"btn_cancel.png","Back");
			rieCancelButton.onClick = function () { riePanel.hide();panoik.show();};
			var rieOKButton = addIconButton(rieButtonsGroup,"btn_valid.png","Replace");
			rieOKButton.onClick = replaceInExpr;
		}
		//MEASUREMENT RESULT
		{
			var resultattexte = measurePanel.add("statictext",undefined,"Distance = \n" + "      " + " pixels",{multiline:true});
			resultattexte.size = [100,50];
			var measureCancelButton = addIconButton(measurePanel,"btn_cancel.png","Back");
			measureCancelButton.onClick = function () { measurePanel.hide();panoik.show();};
		}
		//TIME REMAP PANEL
		{
			var timeRemapLoopButton = timeRemapPanel.add("checkbox",undefined,"Loop");
			var timeRemapLoopOutButton = timeRemapPanel.add("radiobutton",undefined,"Loop out");
			timeRemapLoopOutButton.enabled = false;
			timeRemapLoopOutButton.helpTip = "Time remap with loopOut()";
			timeRemapLoopOutButton.value = true;
			var timeRemapLoopInButton = timeRemapPanel.add("radiobutton",undefined,"Loop in");
			timeRemapLoopInButton.enabled = false;
			timeRemapLoopInButton.helpTip = "Time remap with loopIn()";
			timeRemapLoopButton.onClick = function() {
				timeRemapLoopOutButton.enabled = timeRemapLoopButton.value;
				timeRemapLoopInButton.enabled = timeRemapLoopButton.value;
				};
			var timeRemapButtonsGroup = addHGroup(timeRemapPanel);
			var timeRemapCancelButton = addIconButton(timeRemapButtonsGroup,"btn_cancel.png","Back");
			timeRemapCancelButton.onClick = function () { timeRemapPanel.hide();panoanimation.show();};
			var timeRemapButton = addIconButton(timeRemapButtonsGroup,"btn_valid.png","Time Remap");
			timeRemapButton.onClick = function () { timeRemapButtonClicked();timeRemapPanel.hide();panoanimation.show();};
			timeRemapButton.helpTip = "Smart time remap";
			
		}
		//EXPOSURE PANEL
		{
			function exposureSelect() {
				lowerExposureGroup.enabled = adaptativeExposureButton.value;
				upperExposureGroup.enabled = adaptativeExposureButton.value;
				precisionGroup.enabled = adaptativeExposureButton.value;
				exposureSyncGroup.enabled = adaptativeExposureButton.value;
			}
			var exposureTypeGroup = addHGroup(exposurePanel);
			var evenExposureButton = exposureTypeGroup.add("radiobutton",undefined,"Fixed");
			evenExposureButton.onClick = exposureSelect;
			var adaptativeExposureButton = exposureTypeGroup.add("radiobutton",undefined,"Adaptative");
			adaptativeExposureButton.value = true;
			adaptativeExposureButton.onClick = exposureSelect;
			addSeparator(exposurePanel,"");
			var lowerExposureGroup = addHGroup(exposurePanel);
			lowerExposureGroup.add("statictext",undefined,"Lower exp. limit: ");
			var lowerExposureEdit = lowerExposureGroup.add("edittext",undefined,"1");
			var upperExposureGroup = addHGroup(exposurePanel);
			upperExposureGroup.add("statictext",undefined,"Upper exp. limit: ");
			var upperExposureEdit = upperExposureGroup.add("edittext",undefined,"4");
			var precisionGroup = addHGroup(exposurePanel);
			precisionGroup.add("statictext",undefined,"Precision: ");
			var precisionEdit = precisionGroup.add("edittext",undefined,"500");
			precisionEdit.onChange = function () { exposurePrecisionSlider.value = precisionEdit.text };
			var precisionButton = precisionGroup.add("button",undefined,"Detect");
			precisionButton.onClick = detectExposurePrecision;
			var exposurePrecisionSlider = exposurePanel.add("slider",undefined,500,0,1000);
			exposurePrecisionSlider.onChanging = function () {precisionEdit.text = Math.floor(exposurePrecisionSlider.value);};
			addSeparator(exposurePanel,"");
			var exposureSyncGroup = addHGroup(exposurePanel);
			var exposureSyncButton = exposureSyncGroup.add("checkbox",undefined,"Sync");
			exposureSyncButton.value = true;
			var exposureSyncLayerButton = exposureSyncGroup.add("radiobutton",undefined,"By layer");
			var exposureSyncAllButton = exposureSyncGroup.add("radiobutton",undefined,"All");
			exposureSyncAllButton.value = true;
			exposureSyncButton.onClick = function () {
				exposureSyncLayerButton.enabled = exposureSyncButton.value;
				exposureSyncAllButton.enabled = exposureSyncButton.value;
			}
			var exposureButtonsGroup = addHGroup(exposurePanel);
			var exposureCancelButton = addIconButton(exposureButtonsGroup,"btn_cancel.png","Back");
			exposureCancelButton.onClick = function () { exposurePanel.hide();panoanimation.show();};
			exposureCancelButton.helpTip = "Back";
			var exposureOKButton = addIconButton(exposureButtonsGroup,"btn_valid.png","Exposure");
			exposureOKButton.onClick = function () { exposureOKButtonClicked();exposurePanel.hide();panoanimation.show();};
			exposureOKButton.helpTip = "Set animation exposure";
		}
		//CEL PANEL
		{
			var celCreateCelGroup = addHGroup(celPanel);
			var celSingleLayerButton = celCreateCelGroup.add("checkbox",undefined,"Single Layer");
			celSingleLayerButton.helpTip = "If enabled, creates cels as new paint effects on a single layer";
			celSingleLayerButton.alignment = ["left","bottom"];
			var celCreateCelButton = addButton(celCreateCelGroup,"New Cel.");
			celCreateCelButton.helpTip = "Creates a new animation cel.";
			celCreateCelButton.onClick = celCreateCelButtonClicked;
			var celOnionGroup = addHGroup(celPanel);
			var celOnionButton = celOnionGroup.add("checkbox",undefined,"Onion skin");
			celOnionButton.helpTip = "Activates onion skin";
			celOnionButton.alignment = ["left","bottom"];
			celOnionButton.onClick = celOnionUpdateButtonClicked;
			var celOnionDurationEdit = celOnionGroup.add("edittext",undefined,"5");
			celOnionDurationEdit.helpTip = "Onion skin duration (frames)";
			celOnionDurationEdit.onChange = celOnionUpdateButtonClicked;
			var celOnionUpdateButton = addButton(celPanel,"Update Onion Skin");
			celOnionUpdateButton.onClick = celOnionUpdateButtonClicked;
			var celNavButtonsGroup = addHGroup(celPanel);
			var celPreviousButton = addIconButton(celNavButtonsGroup,"btn_prev.png","");
			celPreviousButton.helpTip = "Previous frame";
			celPreviousButton.onClick = celPreviousButtonClicked;
			var celExposureEdit = celNavButtonsGroup.add("edittext",undefined,"02");
			celExposureEdit.helpTip = "Exposure";
			var celNextButton = addIconButton(celNavButtonsGroup,"btn_next.png","");
			celNextButton.helpTip = "Next frame";
			celNextButton.onClick = celNextButtonClicked;
			var celCancelButton = addIconButton(celPanel,"btn_cancel.png","Back");
			celCancelButton.onClick = function () { celPanel.hide();panointerpo.show();};
			celCancelButton.helpTip = "Back";
		}
		//WIGGLE PANEL
		{
			var wiggleSeparateGroup = addHGroup(wigglePanel);
			//separer ou toutes
			var wiggleSeparate = wiggleSeparateGroup.add("radiobutton",undefined,"Separate Dimensions");
			var wiggleTous = wiggleSeparateGroup.add("radiobutton",undefined,"All Dimensions");
			wiggleTous.value = true;
			var wiggleButtonsGroup = addHGroup(wigglePanel);
			var wiggleCancelButton = addIconButton(wiggleButtonsGroup,"btn_cancel.png","Cancel");
			wiggleCancelButton.onClick = function () { wigglePanel.hide();panoanimation.show();};
			wiggleCancelButton.helpTip = "Back";
			var wiggleOKButton = addIconButton(wiggleButtonsGroup,"btn_valid.png","Wiggle");
			wiggleOKButton.onClick = function () { wiggleOKButtonClicked();wigglePanel.hide();panoanimation.show();};
			wiggleOKButton.helpTip = "Set animation exposure";
			
		}
		//IMPORT RIG PANEL
		{
			irPanel.add("statictext",undefined,"Rigged composition to import:");
			var irRigGroup = addHGroup(irPanel);
			var irRigButton = irRigGroup.add("dropdownlist",undefined);
			irRigButton.alignment = ["fill","fill"];
			var irRigRefreshButton = addIconButton(irRigGroup,"btn_refresh.png","");
			irRigRefreshButton.alignment = ["right","fill"];
			irRigRefreshButton.onClick = irRigRefreshButtonClicked;
			irPanel.add("statictext",undefined,"Name of this instance:");
			irNameText = irPanel.add("edittext",undefined,"Must be unique!");
			var irButtonsGroup = addHGroup(irPanel);
			var irCancelButton = addIconButton(irButtonsGroup,"btn_cancel.png","Cancel");
			irCancelButton.onClick = function () { irPanel.hide();panointerpo.show();};
			irCancelButton.helpTip = "Cancel";
			var irOKButton = addIconButton(irButtonsGroup,"btn_valid.png","Import");
			irOKButton.onClick = function () { irOKButtonClicked();};
			irOKButton.helpTip = "Import selected rig";
		}
		
		
		// On définit le layout et on redessine la fenètre quand elle est resizée
		palette.layout.layout(true);
		palette.layout.resize();
		palette.onResizing = palette.onResize = function () { this.layout.resize(); }
		
		progressPanel.hide();
		
		}
	}
	
	// On définit le layout et on redessine la fenètre quand elle est resizée
	palette.layout.layout(true);
	palette.layout.resize();
	palette.onResizing = palette.onResize = function () { this.layout.resize(); }
	
	progressPanel.hide();
	
	return palette;
	

}


fnDuIK(this);


