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


function fnDuIK(wnd)
{

	//================
	var version = "15.alpha04";
	//================

//===============================================
//PREFERENCES
//===============================================
{
if (! app.settings.haveSetting("duik", "lang")){app.settings.saveSetting("duik","lang","ENGLISH");}
if (! app.settings.haveSetting("duik", "version")){app.settings.saveSetting("duik","version","oui");}
if (! app.settings.haveSetting("duik", "morpherKey")){app.settings.saveSetting("duik","morpherKey","oui");}
if (! app.settings.haveSetting("duik", "notes")){app.settings.saveSetting("duik","notes","");}
if (! app.settings.haveSetting("duik", "pano")){app.settings.saveSetting("duik","pano","0");}
if (! app.settings.haveSetting("duik", "stretch")){app.settings.saveSetting("duik","stretch","true");}
if (! app.settings.haveSetting("duik", "ikfk")){app.settings.saveSetting("duik","ikfk","true");}
if (! app.settings.haveSetting("duik", "boneType")){app.settings.saveSetting("duik","boneType","1");}
if (! app.settings.haveSetting("duik", "boneSize")){app.settings.saveSetting("duik","boneSize","20");}
if (! app.settings.haveSetting("duik", "ctrlSize")){app.settings.saveSetting("duik","ctrlSize","100");}
if (! app.settings.haveSetting("duik", "ctrlSizeAuto")){app.settings.saveSetting("duik","ctrlSizeAuto","true");}
if (! app.settings.haveSetting("duik", "boneSizeAuto")){app.settings.saveSetting("duik","boneSizeAuto","true");}
if (! app.settings.haveSetting("duik", "boneSizeAutoValue")){app.settings.saveSetting("duik","boneSizeAutoValue","1");}
if (! app.settings.haveSetting("duik", "ctrlSizeAutoValue")){app.settings.saveSetting("duik","ctrlSizeAutoValue","1");}
if (! app.settings.haveSetting("duik", "boneColor")){app.settings.saveSetting("duik","boneColor","FF0000");}
}


//===============================================
//TRADUCTIONS
//===============================================
#include "Duik_translations.jsxinc"

//===============================================
//CHARGEMENT DES IMAGES
//===============================================
{
//	>> Utils
function dialog_preferences_general()
{
	//	Valide au moins depuis CS4,
	app.executeCommand(2359);
}

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
//	<< Utils

//	On va devoir écrire les fichiers d'image, donc ça ne sert à rien de continuer si on ne peux pas:
if (app.preferences.getPrefAsLong("Main Pref Section","Pref_SCRIPTING_FILE_NETWORK_SECURITY") != 1)
{
	alert(getMessage(1), "DuIK");

	//	Ouvre les préférences générales pour laisser l'utilisateur autoriser les scripts
	dialog_preferences_general();

	//	Seconds chance ...
	if (app.preferences.getPrefAsLong("Main Pref Section","Pref_SCRIPTING_FILE_NETWORK_SECURITY") != 1)
	{
		//	rien à faire ...
		return;
	}
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

//=========================== IMAGES CHARGEES, debut du script ==================
}

//================================
//CHARGEMENT DE libDuik
//================================
#include "libduik.jsxinc"


//======= FONCTION PRINCIPALE
function IKtools(thisObj){


//===============================================
//LES FONCTIONS
//===============================================
{

//FONCTION POUR CHERCHER UNE MISE A JOUR
function MAJ(version){
var reply = "";
//socket
conn = new Socket;
// se connecter à duduf.com
if (conn.open ("www.duduf.com:80")) {
// récupérer la version actuelle
if(conn.writeln ("GET /downloads/duik/version.txt  HTTP/1.0\nHost: duduf.com\n"))
reply = conn.read(1000);
conn.close();
//chercher la version dans la réponse du serveur :
var reponse = reply.lastIndexOf("version",reply.length);
if(reponse != -1){
newVersion = reply.slice(reponse+8,reply.length+1);
if (version == newVersion) {return true} else {alert(getMessage(2));}
}
}
}

//UTILE : TROUVE L'INDEX D'UNE STRING DANS UN ARRAY DE STRINGS
function arrayIndexOf(array,string) {
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

//FONCTION QUAND ON CLIQUE SUR AUTORIG
function autorig() {

	verifNoms();

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
			Duik.addIK(CmainG,brasG,avantBrasG,undefined,mainG,false,tridi,false);
		}
		else if (avantBrasG != undefined)
		{
			
			Duik.addIK(avantBrasG,CmainG);
			Duik.addGoal(mainG,CmainG);
		}
		else if (brasG != undefined)
		{
			Duik.addIK(brasG,CmainG);
			Duik.addGoal(mainG,CmainG);
		}
		else
		{
			Duik.addGoal(mainG,CmainG);
		}
	}
	//bras D
	if (mainD != undefined)
	{
		if (avantBrasD != undefined && brasD != undefined) Duik.addIK(CmainD,brasD,avantBrasD,undefined,mainD,false,tridi,false);
		else if (avantBrasD != undefined) {
			Duik.addIK(avantBrasD,CmainD);
			Duik.addGoal(mainD,CmainD);
			}
		else if (brasD != undefined) {
			Duik.addIK(brasD,CmainD);
			Duik.addGoal(mainD,CmainD);
			}
		else Duik.addGoal(mainD,CmainD);
	}
	//jambe D
	if (piedD != undefined)
	{
		if (molletD != undefined && cuisseD != undefined) Duik.addIK(CpiedD,cuisseD,molletD,undefined,piedD,false,tridi,false);
		else if (molletD != undefined) {
			Duik.addIK(molletD,CpiedD);
			Duik.addGoal(piedD,CpiedD);
			}
		else if (cuisseD != undefined) {
			Duik.addIK(cuisseD,CpiedD);
			Duik.addGoal(piedD,CpiedD);
			}
		else Duik.addGoal(piedD,CpiedD);
	}
	//jambe G
	if (piedG != undefined)
	{
		if (molletG != undefined && cuisseG != undefined) Duik.addIK(CpiedG,cuisseG,molletG,undefined,piedG,false,tridi,false);
		else if (molletG != undefined) {
			Duik.addIK(molletG,CpiedG);
			Duik.addGoal(piedG,CpiedG);
			}
		else if (cuisseG != undefined) {
			Duik.addIK(cuisseG,CpiedG);
			Duik.addGoal(piedG,CpiedG);
			}
		else Duik.addGoal(piedG,CpiedG);
	}
	//dos
	if (autorigIKdos.value) {
		Duik.addIK(corps,Cepaules);
	}
	//cou
	if (autorigIKcou.value && cou != undefined) {
		Duik.addIK(cou,Ctete);
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
		Duik.addGoal(tete,Ctete);
	}
	
	//groupe d'annulation
	app.endUndoGroup();

}

//FONCTION QUAND ON CLIQUE SUR CREER IK
function ik(){
	var calques = app.project.activeItem.selectedLayers;
	
	if (calques.length != 2 && calques.length != 3 && calques.length != 4) {
		alert(getMessage(7));
		return;
	} //if calques.length == 2 || calques.length == 3 || calques.length == 4
	
	verifNoms();	
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
		calquetridi ? alert(getMessage(5)) : Duik.addIK(app.project.activeItem.selectedLayers[1],app.project.activeItem.selectedLayers[0]);
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
		Duik.addIK(app.project.activeItem.selectedLayers[2],app.project.activeItem.selectedLayers[1],app.project.activeItem.selectedLayers[0],undefined,undefined,boutonCW.value,calquetridi,boutonFront.value);
	}
	else if (calques.length == 4)
	{
		Duik.addIK(app.project.activeItem.selectedLayers[3],app.project.activeItem.selectedLayers[2],app.project.activeItem.selectedLayers[1],undefined,app.project.activeItem.selectedLayers[0],boutonCW.value,calquetridi,boutonFront.value,);
	}
	//groupe d'annulation
	app.endUndoGroup();
}

//FONCTION QUAND ON CLIQUE SUR GOAL
function pregoal(){

if (app.project.activeItem.selectedLayers.length == 1) {
	//groupe d'annulation
	app.beginUndoGroup("Duik - Goal");
	verifNoms();
	Duik.addGoal(app.project.activeItem.selectedLayers[0],undefined);
	//groupe d'annulation
	app.endUndoGroup();
}
else if (app.project.activeItem.selectedLayers.length == 2) {
	//groupe d'annulation
	app.beginUndoGroup("Duik - Goal");
	verifNoms();
	Duik.addGoal(app.project.activeItem.selectedLayers[0],app.project.activeItem.selectedLayers[1]);
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
			var layers = app.project.activeItem.selectedLayers;
			Duik.addControllers(layers);
			//fin du groupe d'annulation
			app.endUndoGroup();
		} else { alert(getMessage(11)); }

}
	 
//FONCTION CONF WIGGLE POSITION
function wiggleconf3D(){
	if (wiggle3Dtous.value){wiggle3DX.enabled = false ; wiggle3DY.enabled = false ; wiggle3DZ.enabled = false;}
	else{wiggle3DX.enabled = true ; wiggle3DY.enabled = true ; wiggle3DZ.enabled = true;}
}
function wiggleconf2D(){
	if (wiggle2Dtous.value){wiggle2DX.enabled = false ; wiggle2DY.enabled = false;}
	else{wiggle2DX.enabled = true ; wiggle2DY.enabled = true;}
}

//FONCTION WIGGLE OK
function wiggle3D(){

	//vérifions qu'il n'y a qu'un calque sélectionné
	if (app.project.activeItem.selectedLayers[0].selectedProperties.length > 0)
	{
		
		//  début de groupe d'annulation
		app.beginUndoGroup("Duik - Wiggle");
		//le calque
		var calque = app.project.activeItem.selectedLayers[0];
		//la prop
		var prop = calque.selectedProperties.pop();
		Duik.addWiggle(calque,prop,wiggle3Dtous.value,wiggle3DX.value,wiggle3DY.value,wiggle3DZ.value);
		//fin du groupe d'annulation			
		app.endUndoGroup();

	} else { alert(getMessage(12)); }

	fenetrewiggle3D.close();
}
function wiggle2D(){

	//vérifions qu'il n'y a qu'un calque sélectionné
	if (app.project.activeItem.selectedLayers[0].selectedProperties.length > 0)
	{
		//  début de groupe d'annulation
		app.beginUndoGroup("Duik - Wiggle");
		//le calque
		var calque = app.project.activeItem.selectedLayers[0];
		//la prop
		var prop = calque.selectedProperties.pop();
		Duik.addWiggle(calque,prop,wiggle2Dtous.value,wiggle2DX.value,wiggle2DY.value);
		//fin du groupe d'annulation			
		app.endUndoGroup();

	} else { alert(getMessage(12)); }

	fenetrewiggle2D.close();
}

//FONCTION WIGGLE
function wiggle(){
	//regarder le nombre d'axes dans la propriété sélectionnée
	var prop =  app.project.activeItem.selectedLayers[0].selectedProperties[app.project.activeItem.selectedLayers[0].selectedProperties.length-1];
	if (prop.propertyValueType == PropertyValueType.ThreeD_SPATIAL || prop.propertyValueType == PropertyValueType.ThreeD)
	{
		//if this is a position and the layer is not 3D, AFX uses a 3D value in the position (with 0 as Z position), but the expression must return a 2D value.......
		if (!prop.parentProperty.isEffect && prop.name.toLowerCase() == "position" && !app.project.activeItem.selectedLayers[0].threeDLayer)
		{
			fenetrewiggle2D.show();
		}
		else
		{
			fenetrewiggle3D.show();
		}
	}
	else if (prop.propertyValueType == PropertyValueType.TwoD_SPATIAL || prop.propertyValueType == PropertyValueType.TwoD)
	{
		fenetrewiggle2D.show();
	}
	else
	{
		Duik.addWiggle(app.project.activeItem.selectedLayers[0],prop);
	}
}

//FONCTION RECURSIVE QUI RECUPERE TOUS LES PUPPET PINS D'UN CALQUE
function getPuppetPins(prop) {
	var coins = [];
	if (prop != null)
	{
		if (prop.matchName == "ADBE FreePin3 PosPin Atom")
		{
			coins.push(prop);
		}
		else if (prop.numProperties > 0)
		{
			//contournement de bug...
			//d'abord recup les propriétés dans un tableau avant de les parcourir
			//sinon l'incrément fonctionne pas dans la boucle, allez savoir pourquoi

			var proprietes = [];
			for (p=1;p<=prop.numProperties;p++)
			{
				proprietes.push(prop.property(p));
			}

			for (pi in proprietes)
			{
				var newCoins = getPuppetPins(proprietes[pi]);
				if (newCoins.length > 0)
				{
					coins = coins.concat(newCoins);
				}
			}
		}
	}
    
    return coins;
}	
	
//FONCTION POUR AJOUTER UN (DES) BONE(S)
function bone(){
	
	verifNoms();
	
	//  début de groupe d'annulation
	app.beginUndoGroup("Duik - Bone");

	//le(s) calque(s) sélectionné(s)
	var calques = app.project.activeItem.selectedLayers ;
	if (calques.length ==0) { alert(getMessage(13),"Attention"); return; }
	
	for (i=0;i<calques.length;i++)
	{
		var calque = calques[i];
		// les propriétés sélectionnées
		var props = calque.selectedProperties;
		var coins = [];
		//lister les puppet pins
		if (props.length > 0)
		{
			for (j=0;j<props.length;j++)
			{
				if (props[j].matchName == "ADBE FreePin3 PosPin Atom") coins.push(props[j]);
			}
		}
		//si il n'y a pas de coins sélectionnés, on les prend tous
		if (coins.length == 0) coins = getPuppetPins(calque("Effects"));
		if (coins.length == 0) { alert(getMessage(13),"Attention"); return; }
		
		for (j=0;j<coins.length;j++)
		{
			var coin = coins[j];
			//la position du coin
			var position = coin.position.value;
			//créer le bone
			var bone;
			//sa taillevar
			boneTaille = eval(boutonBoneSize.text);
			if (boutonBoneSizeAuto.value) {
				boneTaille = app.project.activeItem.width/2 + app.project.activeItem.height/2;
				if (boutonBoneSizeAutoValue.selection.index == 0) boneTaille = Math.floor(boneTaille/60);
				if (boutonBoneSizeAutoValue.selection.index == 1) boneTaille = Math.floor(boneTaille/40);
				if (boutonBoneSizeAutoValue.selection.index == 2) boneTaille = Math.floor(boneTaille/20);
			}
			if (boutonBoneType.selection.index == 1)
			{
				bone = app.project.activeItem.layers.addNull();
				bone.name = "B_" + coin.name;
				bone.source.width = boneTaille;
				bone.source.height = boneTaille;
				bone.transform.anchorPoint.setValue([bone.source.width/2,bone.source.height/2]);
			}
			else
			{
				var colorString = app.settings.getSetting("duik","boneColor");
				var red = parseInt(colorString.substr(0,2),16)/255.0;
				var green = parseInt(colorString.substr(2,2),16)/255.0;
				var blue = parseInt(colorString.substr(4,2),16)/255.0;
				bone = app.project.activeItem.layers.addSolid([red,green,blue],"B_" + coin.name,boneTaille,boneTaille,app.project.activeItem.pixelAspect);
			}
			//mettre le bone à la position du coin : utiliser une expression pour avoir la position en mode world du coin
			var filet = coin.propertyGroup().propertyGroup();
			var marionnette = filet.propertyGroup().propertyGroup().propertyGroup();
			if (calque instanceof ShapeLayer)
			{
				bone.position.expression = "thisComp.layer(\"" + calque.name + "\").effect(\"" + marionnette.name + "\").arap.mesh(\"" + filet.name + "\").deform(\"" + coin.name + "\").position";
			}
			else
			{
				bone.position.expression = "thisComp.layer(\"" + calque.name + "\").toWorld(thisComp.layer(\"" + calque.name + "\").effect(\"" + marionnette.name + "\").arap.mesh(\"" + filet.name + "\").deform(\"" + coin.name + "\").position)";
			}
			bone.position.setValue(bone.position.value);
			bone.position.expression = "";
			//nom du bone
			bone.name = "B_" + coin.name;
			bone.guideLayer = true;
			//mettre l'expression dans le coin
			if (calque instanceof ShapeLayer)
			{
				coin.position.expression = "bonePos = thisComp.layer(\"" + bone.name + "\").toWorld(thisComp.layer(\"" + bone.name + "\").anchorPoint)";
			}
			else
			{
				coin.position.expression = "bonePos = thisComp.layer(\"" + bone.name + "\").toWorld(thisComp.layer(\"" + bone.name + "\").anchorPoint);\nfromWorld(bonePos)";
			}
		}
	}

	//fin du groupe d'annulation
	app.endUndoGroup();


}

//FONCTION POUR AFFICHER DE L'AIDE
function help(){
alert(getMessage(14));
//alert(traduction(["This is a beta version, if you encounter any problem,\nplease notify it by email to duduf@duduf.com","Ceci est une version béta, si vous rencontrez le moindre problème,\nenvoyez un message à duduf@duduf.com"]));
}

//FONCTION ROUE
function creroue(){

	rayonfenetre.show();
	
	}

//FONCTION CARRE
function carre(nombre) {
	return Math.pow(nombre,2);
	}

//FONCTION QUI MESURE LE RAYON D'UNE ROUE
function mesurer() {
	
//vérifions qu'il y a deux calques sélectionnés
	if (app.project.activeItem.selectedLayers.length == 2){


	var calqueroue = app.project.activeItem.selectedLayers[0];
	var calquemesure = app.project.activeItem.selectedLayers[1];
	//récupérer les parents
	var parentroue = calqueroue.parent;
	var parentmesure = calquemesure.parent;	
	//défaire les parents pour mesurer les positions
	calqueroue.parent = null;
	calquemesure.parent = null;
	var O = calqueroue.transform.position.value;
	var A = calquemesure.transform.position.value;
	OA = Math.sqrt( carre(O[0]-A[0]) + carre(O[1]-A[1]) );
	rayonbouton.text = Math.round(OA);
	return Math.round(OA);
	//refaire les parents
	calqueroue.parent = parentroue;
	calquemesure.parent = parentmesure;

} else { alert(getMessage(15),"Attention",true); }

	}

//FONCTION DU BOUTON POUR MESURER
function mesure() {
		
		resultat = mesurer();
		if (resultat/resultat == 1) {
		resultattexte.text = getMessage(17) + resultat + " pixels.";
		mesurefenetre.show();
		}
		if (resultat == 0) {
		resultattexte.text = getMessage(16);
		mesurefenetre.show();
		}
		}
		
//FONCTION QUI RECUPERE LE RAYON ENTRE PAR L'UTILISATEUR
function rayon(){
	OA = rayonbouton.text;
	}

//FONCTION QUI CREE UNE ROUE
function roue() {

			//  début de groupe d'annulation
			app.beginUndoGroup(getMessage(18));

			var isnumber = OA/OA;

			if (isnumber == 1) {
				
			var calqueroue = app.project.activeItem.selectedLayers[0];
			var curseur = calqueroue.Effects.addProperty("ADBE Slider Control");
			curseur.name = getMessage(105);
			curseur(1).setValue(OA);
			var curseurReverse = calqueroue.Effects.addProperty("ADBE Checkbox Control");
			curseurReverse.name = getMessage(186);

			if (roueH.value) calqueroue.transform.rotation.expression = "O = thisLayer.toWorld(thisLayer.anchorPoint);\n" + 
																		"R = thisLayer.effect('" + getMessage(105) + "')(1);\n" + 
																		"Rev = thisLayer.effect('" + getMessage(186) + "')(1);\n" + 
																		"result = 0;\n" +
																		"R > 0 ? result = radiansToDegrees(O[0]/R) : result = 0 ;" +
																		"Rev == 1 ? value - result : value + result;";
			else calqueroue.transform.rotation.expression = "R = thisLayer.effect('" + getMessage(105) + "')(1);\n" + 
															"Rev = thisLayer.effect('" + getMessage(186) + "')(1);\n" + 
															"var precision = 1;\n" + 
															"function pos(frame)\n" + 
															"{\n" + 
															"return thisLayer.toWorld(thisLayer.anchorPoint,framesToTime(frame));\n" + 
															"}\n" + 
															"function roue()\n" + 
															"{\n" + 
															"if (R<=0) return value;\n" + 
															"var distance = 0;\n" + 
															"var start = thisLayer.inPoint > thisComp.displayStartTime ? timeToFrames(thisLayer.inPoint) : timeToFrames(thisComp.displayStartTime) ;\n" + 
															"var end = time < thisLayer.outPoint ? timeToFrames(time) : timeToFrames(thisLayer.outPoint);\n" + 
															"for(i=start;i<end;i+=precision)\n" + 
															"{\n" + 
															"if (pos(i+precision)[0] - pos(i)[0] > 0) distance += length(pos(i+precision),pos(i));\n" + 
															"else distance -= length(pos(i+precision),pos(i));\n" + 
															"}\n" + 
															"return radiansToDegrees(distance/R) ;\n" + 
															"}\n" + 
															"Rev == 1 ? value - roue() : value + roue();";
			
			//  fin de groupe d'annulation
			app.endUndoGroup();

			rayonfenetre.hide();

				} else { alert (getMessage(19),getMessage(20),true); }
	}

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

//FONCTION CAM RELIEF
function camrelief() {
	//vérifier qu'il n'y a qu'un calque sélectionné
if (app.project.activeItem.selectedLayers.length == 1){
	//vérifier que c'est une caméra
	if (app.project.activeItem.selectedLayers[0] instanceof CameraLayer) {

//début du groupe d'annulation
app.beginUndoGroup(getMessage(25));


//récupérer la caméra
var camera = app.project.activeItem.selectedLayers[0];

//créer le target
var target = app.project.activeItem.layers.addNull();
target.name = camera.name + " target";
target.threeDLayer = true;
target.position.setValue(camera.transform.pointOfInterest.value);
//ajouter le controleur convergence caméras
var convergence = target.Effects.addProperty("ADBE Angle Control");
convergence.name = getMessage(26);

//créer la cam
var cam = app.project.activeItem.layers.addNull();
cam.name = camera.name + " position";
cam.threeDLayer = true;
cam.position.setValue(camera.transform.position.value);
//ajouter le controleur écartement caméras
var ecart = cam.Effects.addProperty("ADBE Slider Control");
ecart.name = getMessage(27);


//créer les cam droite et gauche
var camdroite = camera.duplicate();
var camgauche = camera.duplicate();
camdroite.name = camera.name + " droite";
camgauche.name = camera.name + " gauche";

//définir les expressions
camera.position.expression = "thisComp.layer(\"" + cam.name + "\").toWorld(thisComp.layer(\"" + cam.name + "\").transform.anchorPoint)";
camera.pointOfInterest.expression = "thisComp.layer(\"" + target.name + "\").toWorld(thisComp.layer(\"" + target.name + "\").transform.anchorPoint)";
camera.orientation.expression = "value + thisComp.layer(\"" + cam.name + "\").transform.orientation";
camera.xRotation.expression = "value + thisComp.layer(\"" + cam.name + "\").transform.xRotation";
camera.yRotation.expression = "value + thisComp.layer(\"" + cam.name + "\").transform.yRotation";
camera.rotation.expression = "value + thisComp.layer(\"" + cam.name + "\").transform.rotation";

camdroite.position.expression = "[thisComp.layer(\"" + camera.name + "\").transform.position[0]+thisComp.layer(\"" + cam.name + "\").effect(\"" + ecart.name + "\")(1),thisComp.layer(\"" + camera.name + "\").transform.position[1],thisComp.layer(\"" + camera.name + "\").transform.position[2]]";
camdroite.pointOfInterest.expression = "thisComp.layer(\"" + target.name + "\").toWorld(thisComp.layer(\"" + target.name + "\").transform.anchorPoint)";
camdroite.orientation.expression = "thisComp.layer(\"" + camera.name + "\").transform.orientation";
camdroite.xRotation.expression = "thisComp.layer(\"" + camera.name + "\").transform.xRotation";
camdroite.yRotation.expression = "thisComp.layer(\"" + camera.name + "\").transform.yRotation-thisComp.layer(\"" + target.name + "\").effect(\"" + convergence.name + "\")(1)";
camdroite.rotation.expression = "thisComp.layer(\"" + camera.name + "\").transform.rotation";
camdroite.zoom.expression = "thisComp.layer(\"" + camera.name + "\").cameraOption.zoom";
camdroite.focusDistance.expression = "thisComp.layer(\"" + camera.name + "\").cameraOption.focusDistance";
camdroite.aperture.expression = "thisComp.layer(\"" + camera.name + "\").cameraOption.aperture";
camdroite.blurLevel.expression = "thisComp.layer(\"" + camera.name + "\").cameraOption.blurLevel";

camgauche.position.expression = "[thisComp.layer(\"" + camera.name + "\").transform.position[0]-thisComp.layer(\"" + cam.name + "\").effect(\"" + ecart.name + "\")(1),thisComp.layer(\"" + camera.name + "\").transform.position[1],thisComp.layer(\"" + camera.name + "\").transform.position[2]]";
camgauche.pointOfInterest.expression = "thisComp.layer(\"" + target.name + "\").toWorld(thisComp.layer(\"" + target.name + "\").transform.anchorPoint)";
camgauche.orientation.expression = "thisComp.layer(\"" + camera.name + "\").transform.orientation";
camgauche.xRotation.expression = "thisComp.layer(\"" + camera.name + "\").transform.xRotation";
camgauche.yRotation.expression = "thisComp.layer(\"" + camera.name + "\").transform.yRotation+thisComp.layer(\"" + target.name + "\").effect(\"" + convergence.name + "\")(1)";
camgauche.rotation.expression = "thisComp.layer(\"" + camera.name + "\").transform.rotation";
camgauche.zoom.expression = "thisComp.layer(\"" + camera.name + "\").cameraOption.zoom";
camgauche.focusDistance.expression = "thisComp.layer(\"" + camera.name + "\").cameraOption.focusDistance";
camgauche.aperture.expression = "thisComp.layer(\"" + camera.name + "\").cameraOption.aperture";
camgauche.blurLevel.expression = "thisComp.layer(\"" + camera.name + "\").cameraOption.blurLevel";


//bloquer la camera
camera.locked = true;

//fin du groupe d'annulation
app.endUndoGroup();

}
else { alert (getMessage(22),getMessage(23),true); }
}

else { alert (getMessage(22),getMessage(24),true); }
	
	
	
	}

//FONCTION MORPHER
function morpher() {

verifNoms();

//  début de groupe d'annulation
app.beginUndoGroup(getMessage(28));


	//récupérer la sélection d'effets du premier calque, puisqu'elle sera perdue à la création de la glissière..... (voir avec adobe si vous trouvez ca pas pratique)
	var selection = [];
    effets =  app.project.activeItem.selectedLayers[0].selectedProperties;
    for (j=0;j<effets.length;j++) {
         if (effets[j].canSetExpression && effets[j].parentProperty.isEffect) {
                 var layerIndex = app.project.activeItem.selectedLayers[0].index;
                 var effetIndex =  effets[j].propertyIndex;
                 var effetParentName = effets[j].parentProperty.name;
                selection.push([layerIndex,effetParentName,effetIndex]);
                delete effetIndex;
                delete effetParentName;
                } 
            }



//créer le curseur
var morpher = app.project.activeItem.selectedLayers[0].Effects.addProperty("ADBE Slider Control");
morpher.name = "Morpher";

//boucle pour appliquer le morpher sur la sélection perdue
for (i=0;i<selection.length;i++) {
    var effet = app.project.activeItem.layer(selection[i][0]).effect(selection[i][1])(selection[i][2]);
    effet.expression = "valueAtTime((thisComp.layer(\"" +  app.project.activeItem.selectedLayers[0].name +"\").effect(\"Morpher\")(1)-thisComp.displayStartTime/thisComp.frameDuration)*thisComp.frameDuration)";
    //la boucle pour créer automatiquement des clefs sur le morpher :
            if (boutonMKey.value) {
                //nombre de clefs
                var nbreClefs = effet.numKeys;
                //durée d'image de la compo
                var ips = app.project.activeItem.frameDuration;
                var temps = 0;
                var prop = effet;
               for (k=1;k<=nbreClefs;k++){                 
                    //récupère l'instant de la clef
                    temps = prop.keyTime(k);
                    //crée une image clef sur le morpher
                    morpher(1).setValueAtTime(temps,temps/ips);
                    }
                delete temps;
                delete prop;
                delete ips;
                delete nbreClefs;   
         }
    }

//boucle pour appliquer le morpher partout
for (i=0;i<app.project.activeItem.selectedLayers.length;i++) {
    for (j=0;j<app.project.activeItem.selectedLayers[i].selectedProperties.length;j++) {
        var effet = app.project.activeItem.selectedLayers[i].selectedProperties[j];
         if (effet.canSetExpression && effet.parentProperty.name != "Morpher") {
              effet.expression = "valueAtTime((thisComp.layer(\"" + app.project.activeItem.selectedLayers[0].name +"\").effect(\"Morpher\")(1)-thisComp.displayStartTime/thisComp.frameDuration)*thisComp.frameDuration)";
              //la boucle pour créer automatiquement des clefs sur le morpher :
            if (boutonMKey.value) {
                //nombre de clefs
                var nbreClefs = effet.numKeys;
                //durée d'image de la compo
                var ips = app.project.activeItem.frameDuration;
                var temps = 0;
                var prop = effet;
               for (k=1;k<=nbreClefs;k++){                 
                    //récupère l'instant de la clef
                    temps = prop.keyTime(k);
                    //crée une image clef sur le morpher
                    morpher(1).setValueAtTime(temps,temps/ips);
                    }
                delete temps;
                delete prop;
                delete ips;
                delete nbreClefs;   
         }
     }
    }
}

delete morpher;
//fin du groupe d'annulation
app.endUndoGroup();


}

//FONCTION LENTILLE
function lentille() {

//les calques sélectionnés :
var calques = app.project.activeItem.selectedLayers
			
			//vérifions qu'il y a plusieurs calques sélectionnés
			if (calques.length > 1){
			verifNoms();

			//  début de groupe d'annulation
			app.beginUndoGroup(getMessage(29));
	
			//sortir le premier calque, le centre, et ajouter les contrôleurs
			var centre = calques.shift();
			var nomcentre = centre.name;
			var controleurintensite = centre.Effects.addProperty("ADBE Slider Control");
			controleurintensite.name  = getMessage(30);
			controleurintensite(1).setValue(100);
			var controleurtaille = centre.Effects.addProperty("ADBE Slider Control");
			controleurtaille.name  = getMessage(31);
			controleurtaille(1).setValue(100);

			//l'expression de position
			var positionexpression = "calqueCentre = thisComp.layer(\"" + nomcentre + "\");\n\n" +
"function positionAbs(calque) {\n" +
"return calque.toWorld(calque.anchorPoint)\n" +
"}\n\n" +
"n=effect(\"" + getMessage(32) + "\")(1);\n\n" +
"X = thisComp.width - positionAbs(calqueCentre)[0];\n" +
"Y = thisComp.height - positionAbs(calqueCentre)[1];\n\n" +
"if ( n<100 ) {\n\n" +
"i=n/100;\n" +
"j=1-i;\n\n" +
"value + ( (  [X,Y]*(i/j) + positionAbs(calqueCentre) )*j\n\n )" +
"}\n\n" +
"else {value + [X,Y] }";

		//l'expression d'opacité
		var opaciteexpression = "n=thisComp.layer(\"" + centre.name  + "\").effect(\"" + getMessage(30) + "\")(1);\n" + "value*n/100";
			
		//l'expression d'échelle
		var tailleexpression = "n=thisComp.layer(\"" + nomcentre  + "\").effect(\"" + controleurtaille.name + "\")(1);\n" + "value*n/100";
			
		//appliquer les expressions sur le centre
		centre.transform.opacity.expression = opaciteexpression;
		centre.transform.scale.expression = tailleexpression;

			//la boucle d'application des expressions et contrôleurs
			var nombrecalques = calques.length;
			for (i = 0; i < nombrecalques; i++){
			calque = calques[i];
			calque.position.setValue([0,0]);
			//le controleur de la distance
			controleurposition = calque.Effects.addProperty("ADBE Slider Control");
			controleurposition.name = getMessage(32);
			controleurposition(1).setValue(100/nombrecalques*(i+1));
			
			//appliquer les expressions
			calque.transform.position.expression = positionexpression;
			calque.transform.opacity.expression = opaciteexpression;
			calque.transform.scale.expression = tailleexpression;
			
			//fin de la boucle
			}
			
			
			
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
	
verifNoms();
			
//récupérer le nom du calque de référence
var calqueRef = app.project.activeItem.selectedLayers[0];

	
//récupérer le calque de destination
var calque = app.project.activeItem.selectedLayers[1];

//récupérer l'effet
//la sélection est perdue lors de la création de la glissière, il faut donc contourner le problème en récupérant tout le chemin de l'effet pour pouvoir le récupérer après...
//Prendre l'effet
var effet = app.project.activeItem.selectedLayers[1].selectedProperties.pop();
//on vérifie sin on peut mettre une expression, sinon inutile de continuer
if(effet.canSetExpression) {
//  début de groupe d'annulation
app.beginUndoGroup(getMessage(34));


//Le problème ne se pose que si on est sur un effet
if (effet.parentProperty.isEffect){
//index de l'effet
var effetIndex = effet.propertyIndex;
//regarder la profondeur
var effetProfondeur = effet.propertyDepth;
//Récupérer le nom de l'effet
var effetParentName = effet.parentProperty.name;
//les curseurs
var distMinCurseur = calque.Effects.addProperty("ADBE Slider Control");
distMinCurseur.name = getMessage(35);
var distMaxCurseur = calque.Effects.addProperty("ADBE Slider Control");
distMaxCurseur.name = getMessage(36);
var falloffCurseur = calque.Effects.addProperty("ADBE Slider Control");
falloffCurseur.name = getMessage(37);
falloffCurseur(1).setValue(10);
	//l'expression à insérer si la ref est pas une cam
var distanceExpression = "calqueRef = thisComp.layer(\"" + calqueRef.name + "\");\n\n" + 
"function positionAbs(calque) {\n" + 
"return calque.toWorld(calque.anchorPoint);\n" + 
"}\n\n" + 
"distance = length(positionAbs(calqueRef),positionAbs(thisLayer));\n\n" + 
"distMin=Math.abs(effect(\"" + getMessage(35) + "\")(1));\n" + 
"distMax=Math.abs(effect(\"" + getMessage(36) + "\")(1));\n" + 
"falloff=effect(\"" + getMessage(37) + "\")(1);\n\n" + 
"if (distMax>=distMin && falloff!=0){\n" + 
"if (distance <= distMax && distance >=distMin) {value}\n" + 
"if (distance > distMax && distMax!=0) {value + distance/falloff-distMax/falloff}\n" + 
"if (distance < distMin){value + distMin/falloff-distance/falloff}\n" + 
"if (distMax==0){value + distance/falloff}\n" + 
"}else {value}";

	//l'expression à insérer si la ref est une cam
var distanceExpressionCam = "calqueRef = thisComp.layer(\"" + calqueRef.name + "\");\n\n" + 
"function positionAbs(calque) {\n" + 
"return calque.toWorld(calque.anchorPoint);\n" + 
"}\n\n" + 
"distance = length(calqueRef.position,positionAbs(thisLayer));\n\n" + 
"distMin=Math.abs(effect(\"" + getMessage(35) + "\")(1));\n" + 
"distMax=Math.abs(effect(\"" + getMessage(36) + "\")(1));\n" + 
"falloff=effect(\"" + getMessage(37) + "\")(1);\n\n" + 
"if (distMax>=distMin && falloff!=0){\n" + 
"if (distance <= distMax && distance >=distMin) {value}\n" + 
"if (distance > distMax && distMax!=0) {value + distance/falloff-distMax/falloff}\n" + 
"if (distance < distMin){value + distMin/falloff-distance/falloff}\n" + 
"if (distMax==0){value + distance/falloff}\n" + 
"}else {value}";

effet = app.project.activeItem.selectedLayers[1].effect(effetParentName)(effetIndex);

if (calqueRef instanceof CameraLayer) {effet.expression = distanceExpressionCam;}
else {effet.expression = distanceExpression;}
//sinon on le fait à l'ancienne
}else{
//les curseurs
var distMinCurseur = calque.Effects.addProperty("ADBE Slider Control");
var minname = effet.name + getMessage(35);
distMinCurseur.name = minname;
var distMaxCurseur = calque.Effects.addProperty("ADBE Slider Control");
var maxname = effet.name + getMessage(36);
distMaxCurseur.name = maxname;
var falloffCurseur = calque.Effects.addProperty("ADBE Slider Control");
var falloffname = effet.name + getMessage(37);
falloffCurseur.name = falloffname;
falloffCurseur(1).setValue(10);
	//l'expression à insérer si la ref est pas une cam
var distanceExpression = "calqueRef = thisComp.layer(\"" + calqueRef.name + "\");\n\n" + 
"function positionAbs(calque) {\n" + 
"return calque.toWorld(calque.anchorPoint);\n" + 
"}\n\n" + 
"distance = length(positionAbs(calqueRef),positionAbs(thisLayer));\n\n" + 
"distMin=Math.abs(effect(\"" + minname + "\")(1));\n" +
"distMax=Math.abs(effect(\"" + maxname + "\")(1));\n" + 
"falloff=effect(\"" + falloffname + "\")(1);\n\n" + 
"if (distMax>=distMin && falloff!=0){\n" + 
"if (distance <= distMax && distance >=distMin) {value}\n" + 
"if (distance > distMax && distMax!=0) {value + distance/falloff-distMax/falloff}\n" + 
"if (distance < distMin){value + distMin/falloff-distance/falloff}\n" + 
"if (distMax==0){value + distance/falloff}\n" + 
"}else {value}";

	//l'expression à insérer si la ref est une cam
var distanceExpressionCam = "calqueRef = thisComp.layer(\"" + calqueRef.name + "\");\n\n" + 
"function positionAbs(calque) {\n" + 
"return calque.toWorld(calque.anchorPoint);\n" + 
"}\n\n" + 
"distance = length(calqueRef.position,positionAbs(thisLayer));\n\n" + 
"distMin=Math.abs(effect(\"" + minname + "\")(1));\n" + 
"distMax=Math.abs(effect(\"" + maxname + "\")(1));\n" + 
"falloff=effect(\"" + falloffname + "\")(1);\n\n" + 
"if (distMax>=distMin && falloff!=0){\n" + 
"if (distance <= distMax && distance >=distMin) {value}\n" + 
"if (distance > distMax && distMax!=0) {value + distance/falloff-distMax/falloff}\n" + 
"if (distance < distMin){value + distMin/falloff-distance/falloff}\n" + 
"if (distMax==0){value + distance/falloff}\n" + 
"}else {value}";

if (calqueRef instanceof CameraLayer) {effet.expression = distanceExpressionCam;}
else {effet.expression = distanceExpression;}
}
	
	//fin du groupe d'annulation
	app.endUndoGroup();
	
	
	
	}else{alert(getMessage(38),getMessage(39));}
	} else {alert (getMessage(40),"Attention",true);}
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

//FONCTION POUR VERIFIER QU'IL NYA PAS DEUX CALQUES PORTANT LE MEME NOM DANS LA COMP // changer pour utiliser des numéros (regarder le dernier caractère et incrémenter
function verifNoms() {
		
var calques = app.project.activeItem.layers;
var nbrecalques = app.project.activeItem.numLayers;
var renamed = false;

	if (nbrecalques > 1){
	
		for (i = 1;i<=nbrecalques;i++)
		{
			for (j=1;j<=nbrecalques;j++)
			{
				if(i!=j && calques[i].name == calques[j].name)
				{
					var l = calques[j].locked;
					if (l) calques[j].locked = false;
					calques[j].name = calques[j].name + "_" ;
					if (l) calques[j].locked = true;
					renamed = true;
				}
			}
		}

	}
			//on enlève l'alerte, plus chiante qu'autre chose...
			//if (renamed) alert(getMessage(41));
			
			
			return true;
}

//FONCTION SPRING
function spring()
{
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
	
	var calque = app.project.activeItem.selectedLayers[0];
//chercher si on a des effests à une seule dimension pour savoir si on doit créer la case rebond
//faire un tableau des effets à récup aussi parce qu'on perd la sélection en ajoutant les curseurs
//et meme si on la garde dans un tableau ca foire...
var rebond = false;
var effets = [];
for (i = 0;i < calque.selectedProperties.length ; i++)
{
	var ef = app.project.activeItem.selectedLayers[0].selectedProperties[i];
	if (ef.canSetExpression && ef.propertyValueType == PropertyValueType.OneD)
	{
		rebond = true;
	}
	if (ef.canSetExpression && ef.parentProperty.isEffect)
	{
		var effetIndex = ef.propertyIndex;
		var effetParentName = ef.parentProperty.name;
		effets.push([effetParentName,effetIndex]);
	}
}

//  début de groupe d'annulation
app.beginUndoGroup(getMessage(42));

//ajouter les curseurs et cases
var elasticite = calque.Effects.addProperty("ADBE Slider Control");
elasticite.name = getMessage(43);
elasticite(1).setValue(5);
var attenuation = calque.Effects.addProperty("ADBE Slider Control");
attenuation.name = getMessage(44);
attenuation(1).setValue(5);
if (rebond)
{
	var rebond = calque.Effects.addProperty("ADBE Checkbox Control");
	rebond.name = getMessage(45);
}

//=============================================
//expressions a insérer
var expressionspringOneD = 	"amorti = effect(\"" + getMessage(44) + "\")(1);\n" + 
							"freq = effect(\"" + getMessage(43) + "\")(1);\n\n" + 
							"rebond = effect(\"" + getMessage(45) + "\")(1);\n\n" + 
							"if (numKeys > 1 && freq != 0 ){\n" + 
							"if (nearestKey(time).index == 1) { value }\n" + 
							"else {\n\n" + 
							"if (length(velocity) == 0) {\n\n" + 
							"tempsClefProx = nearestKey(time).time;\n\n" + 
							"if ( tempsClefProx <= time ) { tempsDebut = tempsClefProx }\n" + 
							"else { tempsDebut = key(nearestKey(time).index-1).time }\n\n" + 
							"temps = time - tempsDebut;\n\n" + 
							"spring = velocityAtTime(tempsDebut-thisComp.frameDuration) * ( .15/freq * Math.sin(freq * temps * 2 * Math.PI) / Math.exp( temps * amorti ) );\n\n" + 
							"if (rebond == 0) valueAtTime(tempsDebut) + spring;\n\n" + 
							"if (rebond == 1 &&  valueAtTime(tempsDebut-thisComp.frameDuration) >  valueAtTime(tempsDebut)) valueAtTime(tempsDebut) + Math.abs(spring);\n\n" + 
							"if (rebond == 1 &&  valueAtTime(tempsDebut-thisComp.frameDuration) <  valueAtTime(tempsDebut)) valueAtTime(tempsDebut) - Math.abs(spring);\n\n" + 
							"}\n" + 
							"else { value }\n" + 
							"}\n" + 
							"}\n" + 
							"else { value }";

var expressionspringMutiD = 	"amorti = effect(\"" + getMessage(44) + "\")(1);\n" + 
								"freq = effect(\"" + getMessage(43) + "\")(1);\n\n" + 
								"rebond = 0;\n\n" + 
								"if (numKeys > 1 && freq != 0 ){\n" + 
								"if (nearestKey(time).index == 1) { value }\n" + 
								"else {\n\n" + 
								"if (length(velocity) == 0) {\n\n" + 
								"tempsClefProx = nearestKey(time).time;\n\n" + 
								"if ( tempsClefProx <= time ) { tempsDebut = tempsClefProx }\n" + 
								"else { tempsDebut = key(nearestKey(time).index-1).time }\n\n" + 
								"temps = time - tempsDebut;\n\n" + 
								"spring = velocityAtTime(tempsDebut-thisComp.frameDuration) * ( .15/freq * Math.sin(freq * temps * 2 * Math.PI) / Math.exp( temps * amorti ) );\n\n" + 
								"if (rebond == 0) valueAtTime(tempsDebut) + spring;\n\n" + 
								"if (rebond == 1 &&  valueAtTime(tempsDebut-thisComp.frameDuration) >  valueAtTime(tempsDebut)) valueAtTime(tempsDebut) + Math.abs(spring);\n\n" + 
								"if (rebond == 1 &&  valueAtTime(tempsDebut-thisComp.frameDuration) <  valueAtTime(tempsDebut)) valueAtTime(tempsDebut) - Math.abs(spring);\n\n" + 
								"}\n" + 
								"else { value }\n" + 
								"}\n" + 
								"}\n" + 
								"else { value }";
var expressionspringPos = 	"amorti = effect(\"" + getMessage(44) + "\")(1);\n" + 
							"freq = effect(\"" + getMessage(43) + "\")(1);\n" + 
							"if (amorti == 0) amorti = 0.1;\n" + 
							"if (freq == 0) freq = 0.1;\n" + 
							"retard = freq/amorti;\n" + 
							"poids = 1/amorti/10;\n" + 
							"precision = thisComp.frameDuration;\n" + 
							"function worldVelocity(temps) {\n" + 
							"worldVelocityX = (thisLayer.toWorld(thisLayer.anchorPoint,temps)[0]-thisLayer.toWorld(thisLayer.anchorPoint,temps-.01)[0])*100;\n" + 
							"worldVelocityY = (thisLayer.toWorld(thisLayer.anchorPoint,temps)[1]-thisLayer.toWorld(thisLayer.anchorPoint,temps-.01)[1])*100;\n" + 
							"return [worldVelocityX,worldVelocityY];\n" + 
							"}\n" + 
							"function worldSpeed(temps) {\n" + 
							"return length(worldVelocity(temps));\n" + 
							"}\n" + 
							"tempsDebut = 0;\n" + 
							"tempsRedemarrage = 0;\n" + 
							"stop = false;\n" + 
							"arrete = false;\n" + 
							"for (i=timeToFrames(time);i>=0;i--) {\n" + 
							"var instant = framesToTime(i);\n" + 
							"var instantSuivant = instant-precision;\n" + 
							"if (worldSpeed(instant) == 0 ) {\n" + 
							"if (tempsRedemarrage == 0) tempsRedemarrage = instant;\n" + 
							"if (worldSpeed(instantSuivant) !=0 ) {\n" + 
							"tempsDebut = instantSuivant;\n" + 
							"break;\n" + 
							"}\n" + 
							"}\n" + 
							"}\n" + 
							"temps = time-tempsDebut;\n" + 
							"frameRedemarre = timeToFrames( time-tempsRedemarrage);\n" + 
							"valeur = value\n" + 
							"if ( frameRedemarre <= retard)\n" + 
							"valeur = value - worldVelocity(time)*poids*(frameRedemarre/retard);\n" + 
							"else\n" + 
							"valeur = value - worldVelocity(time)*poids;\n" + 
							"if (worldSpeed(time) == 0) {\n" + 
							"spring = worldVelocity(tempsDebut) * ( .15/freq * Math.sin(freq * temps * 2 * Math.PI) / Math.exp( temps * amorti ) );\n" + 
							"valeur + spring;\n" + 
							"}else{ valeur; }\n";
//=============================================

//boucle sur ce qui reste de sélectionné
for (i = 0;i < calque.selectedProperties.length ; i++)
{
	var effet = calque.selectedProperties[i];
	//on vérifie si on peut mettre une expression, sinon inutile de continuer
	if(!effet.canSetExpression) { continue; }
	if (effet.matchName == "ADBE Position" && boutonSimulatedSpring.value)	effet.expression = expressionspringPos;
	else if (effet.propertyValueType == PropertyValueType.OneD) effet.expression = expressionspringOneD;
	else effet.expression = expressionspringMutiD;
}
//boucle sur les effets
for (i = 0;i < effets.length ; i++)
{
	var effet = app.project.activeItem.selectedLayers[0].effect(effets[i][0])(effets[i][1]);;
	//on vérifie si on peut mettre une expression, sinon inutile de continuer
	if(!effet.canSetExpression) { continue; }
	if (effet.propertyValueType == PropertyValueType.OneD) effet.expression = expressionspringOneD;
	else effet.expression = expressionspringMutiD;
}

//fin du groupe d'annulation
app.endUndoGroup();

}

//FONCTION ZERO
function zero(){
	
//vérifions qu'il y a 1 layer sélectionnés
if (app.project.activeItem.selectedLayers.length > 0) {	
	
	verifNoms();
			//  début de groupe d'annulation
			app.beginUndoGroup("Duik - Zero");	
	
	var calques = app.project.activeItem.selectedLayers;

	for (i = 0 ; i < calques.length ; i++)
	{
		var calque = calques[i];
		//créer un zéro
		var zero = app.project.activeItem.layers.addNull();
		var calqueparent = calque.parent;
		calque.parent = null;
		zero.position.setValue(calque.position.value);
		zero.rotation.setValue(calque.rotation.value);
		zero.name = "Zero_" + calque.name.slice(-24);
		calque.parent = zero;

		//lier le zéro au bone du bout
		zero.parent = calqueparent;

		//verrouiller et masquer le zéro
		zero.moveToEnd();
		zero.guideLayer = true;
		zero.locked = true;
		zero.shy = true;
		zero.enabled = false;
	}
	
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

//FONCTIONS INTERPOLATIONS
{
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
	
//TODO vérifier le nombre de dimensions

if (effet.parentProperty.isEffect){
	var effetIndex = effet.propertyIndex;
	var effetProfondeur = effet.propertyDepth;
	var effetParentName = effet.parentProperty.name;
	var amplitude = calque.Effects.addProperty("ADBE Slider Control");
	amplitude.name = getMessage(53);
	amplitude(1).setValue(1);
	var frequence = calque.Effects.addProperty("ADBE Slider Control");
	frequence.name = getMessage(54);
	frequence(1).setValue(1);
    var decalage = calque.Effects.addProperty("ADBE Slider Control");
	decalage.name = getMessage(55);
	var amorti = calque.Effects.addProperty("ADBE Slider Control");
	amorti.name = getMessage(56);
	
	effet = app.project.activeItem.selectedLayers[0].effect(effetParentName)(effetIndex);
	//=============================================
	//expression a insérer
	var expressionosc = "amp = effect('" + getMessage(53) + "')(1);\n" +
"freq = effect('" + getMessage(54) + "')(1)*2*Math.PI;\n" +
"decalage = framesToTime(effect('" + getMessage(55) + "')(1));\n" +
"amorti = Math.abs(effect('" + getMessage(56) + "')(1));\n\n" +
"sin = Math.sin(time*freq+decalage);\n\n" +
"for(i=0;i<amorti;i++) {\n" +
"sin = Math.sin(sin);\n" +
"}\n" +
"sin*amp+value;";
	//=============================================

effet.expression = expressionosc;

} else {
	
	var amplitude = calque.Effects.addProperty("ADBE Slider Control");
	amplitude.name = getMessage(53);
	amplitude(1).setValue(1);
	var frequence = calque.Effects.addProperty("ADBE Slider Control");
	frequence.name = getMessage(54);
	frequence(1).setValue(1);
    var decalage = calque.Effects.addProperty("ADBE Slider Control");
	decalage.name = getMessage(55);
	var amorti = calque.Effects.addProperty("ADBE Slider Control");
	amorti.name = getMessage(56);
	//=============================================
	//expression a insérer
	var expressionosc = "amp = effect('" + getMessage(53) + "')(1);\n" +
"freq = effect('" + getMessage(54) + "')(1)*2*Math.PI;\n" +
"decalage = framesToTime(effect('" + getMessage(55) + "')(1));\n" +
"amorti = Math.abs(effect('" + getMessage(56) + "')(1));\n\n" +
"sin = Math.sin(time*freq+decalage);\n\n" +
"for(i=0;i<amorti;i++) {\n" +
"sin = Math.sin(sin);\n" +
"}\n" +
"sin*amp+value;";
	//=============================================

effet.expression = expressionosc;

}
//fin du groupe d'annulation
app.endUndoGroup();	

}else{alert(getMessage(38),getMessage(46));}
}else{alert(getMessage(47),getMessage(48));}
}else{alert(getMessage(47),getMessage(49));}


	}

function exposure() {
	fenetreexposure.show();
}

function detectExposurePrecision() {
	var layer = app.project.activeItem.selectedLayers[0];
	var prop = layer.selectedProperties[layer.selectedProperties.length-1];
	var speed = Duik.utils.getAverageSpeed(layer,prop);
	var exp = (parseInt(lowerExposureEdit.text) + parseInt(upperExposureEdit.text)) /2
	precisionEdit.text = parseInt(1/(speed/10000)/exp);
}

//FONCTION EXPOSITION DE LANIM
function nframes() {
	var layer = app.project.activeItem.selectedLayers[0];
	var prop = app.project.activeItem.selectedLayers[0].selectedProperties.pop();
	
	app.beginUndoGroup("Duik Auto-Exposure");
	Duik.exposureControls(layer,prop,true,parseInt(precisionEdit.text),parseInt(lowerExposureEdit.text),parseInt(upperExposureEdit.text));
	app.endUndoGroup();
	
	fenetreexposure.close();
/*
// Vérifions si il n'y a qu'un calque sélectionné
if (app.project.activeItem.selectedLayers.length == 1){
	
var calque = app.project.activeItem.selectedLayers[0];

if (calque.selectedProperties.length != 0){
	
	//Prendre l'effet
var effet = app.project.activeItem.selectedLayers[0].selectedProperties.pop();
//on vérifie sin on peut mettre une expression, sinon inutile de continuer
if(effet.canSetExpression) {
	
//  début de groupe d'annulation
app.beginUndoGroup(getMessage(57));

if (effet.parentProperty.isEffect){
	var effetIndex = effet.propertyIndex;
	var effetProfondeur = effet.propertyDepth;
	var effetParentName = effet.parentProperty.name;
	var expo = calque.Effects.addProperty("ADBE Slider Control");
	expo.name = getMessage(58);
	expo(1).setValue(1);
	
	effet = app.project.activeItem.selectedLayers[0].effect(effetParentName)(effetIndex);
	//=============================================
	//expression a insérer
	var expressionexpo = "expo = effect(\"" + getMessage(58) + "\")(1);\n" +
"expo == 0 ? expo = 1 : Math.abs(expo);\n" +
"timef = timeToFrames(time);\n" +
"valueAtTime(framesToTime( timef - timef%expo ))";
	//=============================================

effet.expression = expressionexpo;

} else {
	
	var expo = calque.Effects.addProperty("ADBE Slider Control");
	expo.name = getMessage(58);
	expo(1).setValue(1);
	//=============================================
	//expression a insérer
	//expression a insérer
	var expressionexpo = "expo = effect(\"" + getMessage(58) + "\")(1);\n" +
"expo == 0 ? expo = 1 : Math.abs(expo);\n" +
"timef = timeToFrames(time);\n" +
"valueAtTime(framesToTime( timef - timef%expo ))";
	//=============================================

effet.expression = expressionexpo;

}
//fin du groupe d'annulation
app.endUndoGroup();	

}else{alert(getMessage(38),getMessage(59));}
}else{alert(getMessage(60),getMessage(48));}
}else{alert(getMessage(60),getMessage(48));}
*/

	}

//FONCTION PATH FOLLOW
function pathFollow() {
    
    		// Vérifions si il n'y a qu'un calque sélectionné
if (app.project.activeItem.selectedLayers.length == 1){
	
var calque = app.project.activeItem.selectedLayers[0];
	
//  début de groupe d'annulation
app.beginUndoGroup(getMessage(61));
	
	//expression a insérer
	var expressionpf = "ff = framesToTime(1);\r\n" + 
"pos = thisLayer.position;\r\n" + 
"A = pos.valueAtTime(time-ff);\r\n" + 
"B =  pos.valueAtTime(time+ff);\r\n\r\n" + 
"if (pos.key(1).time > time){\r\n" + 
"A = pos.key(1).value;\r\n" + 
"B =pos.valueAtTime(pos.key(1).time+ff);\r\n" + 
"}\r\n\r\n" + 
"if (thisLayer.position.key(thisLayer.position.numKeys).time < time){\r\n" + 
"A = pos.valueAtTime(pos.key(pos.numKeys).time-ff);\r\n" + 
"B = pos.key(pos.numKeys).value;\r\n" + 
"}\r\n\r\n" + 
"angle = lookAt(A,B);\r\n" + 
"angle[0] > 0 ? angle[0]+angle[1]+value : angle[0]-angle[1]+value;\r\n";
	//=============================================

calque.transform.rotation.expression = expressionpf;

app.endUndoGroup();	

}else{alert(getMessage(49));}


    }

//FONCTIONS COPY ANIM
{
//renvoie un tableau descriptif de clef pour la clef à l'index "index" de la propriété "prop". startTime applique un offset sur l'instant de la clef
function getKey(prop, index,startTime)
{
                var clef = [];
                var time = prop.keyTime(index) - startTime;
                var value = prop.keyValue(index);
                var inInterpolationType = prop.keyInInterpolationType(index);
                var outInterpolationType = prop.keyOutInterpolationType(index);
                var spatial = [];
                if ( prop.propertyValueType == PropertyValueType.ThreeD_SPATIAL || prop.propertyValueType == PropertyValueType.TwoD_SPATIAL )
                {
                    spatial.push(true);
                    spatial.push(prop.keyInSpatialTangent(index));
                    spatial.push(prop.keyOutSpatialTangent(index));
                    spatial.push(prop.keySpatialContinuous(index));
                    spatial.push(prop.keySpatialAutoBezier(index));
                    spatial.push(prop.keyRoving(index));
                }
                else spatial.push(false);
                var keyInTemporalEase = prop.keyInTemporalEase(index);
                var keyOutTemporalEase = prop.keyOutTemporalEase(index);
                var keyTemporalContinuous = prop.keyTemporalContinuous(index);
                var keyTemporalAutoBezier = prop.keyTemporalAutoBezier(index);
                clef.push(time, value, inInterpolationType, outInterpolationType, spatial, keyInTemporalEase, keyOutTemporalEase, keyTemporalContinuous, keyTemporalAutoBezier);
    
                return clef;
}

// récupère toutes les anims d'un propertyGroup (recursif)
function getPropertyAnims(prop,startTime,selected,endTime)
{
    var valeurs = [];
    if (prop.propertyType == PropertyType.PROPERTY)
    {
        var cles = getPropertyBaseAnim(prop,startTime,selected,endTime);
        if (cles.length > 1) valeurs.push(cles);
    }
    else if (prop.numProperties > 0)
    {
        for (pi = 1;pi <= prop.numProperties;pi++)
        {
            var newValeurs = getPropertyAnims(prop.property(pi),startTime,selected,endTime);
            if (newValeurs.length > 0)
            {
                valeurs = valeurs.concat(newValeurs);
            }
        }
    }
    return valeurs;
}

// renvoie l'anim d'une propriété sous forme de tableau de clefs (avec le nom de la prop d'abord, et uniquement ce nom si on doit prendre les clefs selectionnées mais qu'il n'y en a pas de selectionnées)
function getPropertyBaseAnim(prop,startTime,selected,endTime)
{
    var cles = [prop.name];
    
    if (prop.elided) return cles;
    
    if (prop.isTimeVarying)
    {
        if (selected)
        {
            for (j = 0; j < prop.selectedKeys ; j++)
            {
                cles.push(getKey(prop,prop.selectedKeys[j],startTime));
            }
        }
        else if (prop.numKeys > 0) //!selected
        {
            for (j = 0; j < prop.numKeys ; j++)
            {
                var index = j+1;
                var time = prop.keyTime(index);
                if (time >= startTime && time <= endTime) cles.push(getKey(prop,index,startTime));
            }
        } 
    }
    else if (!selected) //pas d'anim, prendre juste la valeur
    {
        cles.push([0,prop.valueAtTime(startTime,true)]);
    }
    return cles;
}

// renvoie l'instant de la clef la plus tot dans toutes les propriétés (parmi les clefs sélectionnées)
function getFirstKeyTime(prop)
{
    var firstKeyTime = 86339;
    
    if (prop.propertyType == PropertyType.PROPERTY)
    {
        if (prop.selectedKeys.length > 0)
        {
            firstKeyTime = prop.keyTime(prop.selectedKeys[0]);
        }
    }
    else if (prop.numProperties > 0)
    {
        for (pi = 1;pi <= prop.numProperties;pi++)
        {
            testKeyTime = getFirstKeyTime(prop.property(pi));
            if (testKeyTime < firstKeyTime) firstKeyTime = testKeyTime;
        }
    }

    return firstKeyTime;
}

// regarde si ya des clefs sélectionnées dans les calques sélectionnés
function isKeySelected(prop)
{
    var selected = false;
    
    if (prop.propertyType == PropertyType.PROPERTY)
    {
        if (prop.selectedKeys.length >0)
        {
            selected = true;
        }
    }
    else if (prop.numProperties > 0)
    {
        for (pi = 1;pi <= prop.numProperties;pi++)
        {
            selected = isKeySelected(prop.property(pi));
            if (selected) break;
        }
    }
    
    return selected;
}

// sauvegarde l'anim, soit des clefs sélectionnées si il y en a, sinon toute l'anim dans la zone de travail, renvoie sous forme de tableau
//TODO : uniquement les clefs sélectionnées foire, à corriger, mis en stand by ici
function copyAnim()
{
    var layers = app.project.activeItem.selectedLayers;
    if (layers.length == 0)
    {
        alert("Please select the layers from which you want to save animation");
		return;
    }
    
    var selected = false; // est ce qu'il y a des clefs sélectionnées (ou est ce qu'on fait sur toute l'anim)
    var startTime = 86339; // instant de début de l'anim à sauvegarder
    var endTime = app.project.activeItem.workAreaDuration + app.project.activeItem.workAreaStart;
    var layersSaved = []; // tableau de résultats
    
    // 1 - voir si il y a des clefs sélectionnées //TODO : fait foirer ! (boucle infinie quelque part)
    /*for (i = 0; i < layers.length ; i++)
    {
        selected = isKeySelected(layers[i]);
        if (selected) break;
        selected = isKeySelected(layers[i].transform); //faut recommencer sur les transformations, c'est pas des propriétés comme les autres pour after... #StupidAFX
        if (selected) break;
    }*/
    
    // 2 - chercher l'instant de la première clef dans le temps, si ya des clefs sélectionnées
    if (selected)
    {
        for (i = 0; i < layers.length ; i++)
        {
            var testTime = getFirstKeyTime(layers[i]);
            if (testTime < startTime) startTime = testTime;
            testTime = getFirstKeyTime(layers[i].transform); //faut recommencer sur les transformations, c'est pas des propriétés comme les autres pour after... #StupidAFX
            if (testTime < startTime) startTime = testTime;
        }
    }
    else
    {
        startTime = app.project.activeItem.workAreaStart;
    }
  
    //parcourir tous les calques sélectionnés à la recherche des anims à sauvegarder
    for (i = 0; i < layers.length ; i++)
    {
        var layer = [];
        var l = layers[i];
        layer.push(l.name);
		

        // 1 - sauver l'anim des transformations
        var transform = [];
        transform.push("transform");
        transform = transform.concat(getPropertyAnims(l.transform,startTime,selected,endTime));
        if (transform.length >1) layer.push(transform);

        // 2 - les masques //TODO coince si plusieurs masques ?
        for (j=1;j<=l("Masks").numProperties;j++)
        {
            var masque = ["masks",l("Masks")(j).name];
            masque = masque.concat(getPropertyAnims(l("Masks")(j),startTime,selected,endTime));
            if (masque.length >1) layer.push(masque);
        }

        // 3 - les effets
        for (j=1;j<=l("Effects").numProperties;j++)
        {
            var effet = ["effects",l("Effects")(j).name];
            effet = effet.concat(getPropertyAnims(l("Effects")(j),startTime,selected,endTime));
            if (effet.length >1) layer.push(effet);
        }
        
        if (layer.length > 1) layersSaved.push(layer);
		
    }
	
	alert("Animation copied !\n\nNumber of layers : " + layersSaved.length);
	return layersSaved;
}

}

//FONCTIONS PASTE ANIM
{
// applique le tableau d'anim
function pasteAnim(animation)
{
	app.beginUndoGroup("Duik - Paste Anim");
	var totalPasted = 0;
	for (li = 1;li <= app.project.activeItem.numLayers;li++)
	{
		var l = app.project.activeItem.layer(li);
		var load = [];
		//parcourir les animations sauvées pour trouver celle qui matche le calque
		for (si = 0; si < animation.length ; si++)
		{
			if (animation[si][0] == l.name)
			{
				load = animation[si];
				break;
			}
		}
		
		//obligés de faire trois fois la boucle, sinon ne fait pas toutes les itérations... //TODO trouver où est le bug
		if (load.length > 1) //transform
		{
			totalPasted++;
			
			for (i = 1;i < load.length;i) //i est itéré manuellement à la fin, sinon des fois ça bloque....... BUG ADOBE ?
			{
				var prop = load[i];
				var type = prop[0];

				if (type == "transform" && prop.length > 1)
				{
					for (j = 1;j< prop.length; j++)
					{
						loadClefs(l.transform,prop[j]);
					}
					break;
				}
				i++;
			}
		}
		if (load.length > 1) //masks
		{
			for (i = 1;i < load.length;i) //i est itéré manuellement à la fin, sinon des fois ça bloque....... BUG ADOBE ?
			{
				var prop = load[i];
				var type = prop[0];
				
				if (type == "masks" && prop.length > 2)
				{
					for (j = 2;j< prop.length; j++)
					{
						if (l("Masks").numProperties > 0 )
						{
							var exists = false;
							for (k = 1;k<=l("Masks").numProperties;k++)
							{
								if (l("Masks")(k).name == prop[1])
								{
									exists = true;
									break;
								}
							}
							if (exists)
							{
								loadClefs(l("Masks")(prop[1]),prop[j]);
							}
						}
					}
				}
				i++;
			}
		}
		if (load.length > 1) //effects
		{
			for (i = 1;i < load.length;i) //i est itéré manuellement à la fin, sinon des fois ça bloque....... BUG ADOBE ?
			{
			
				var prop = load[i];
				var type = prop[0];
				
				if (type == "effects" && prop.length > 2)
				{
					for (j = 2;j< prop.length; j++)
					{
						//vérifier que l'effet existe
						if (l("Effects").numProperties > 0 )
						{
							var exists = false;
							for (k = 1;k<=l("Effects").numProperties;k++)
							{
								if (l("Effects")(k).name == prop[1])
								{
									exists = true;
									break;
								}
							}
							if (exists)
							{
								loadClefs(l("Effects")(prop[1]),prop[j]);
							}
						}
						
					}
				}
				i++;
			}
			
		}
	}
	app.endUndoGroup();
	
	if (totalPasted != animation.length) alert("Pasted animation on " + totalPasted + " layers.\n\n" + (animation.length-totalPasted) + " layers not found.");
	else alert("Pasted animation on " + totalPasted + " layers.");
}

//charge les clefs
function loadClefs(prop,clefs)
{
    if (clefs.length < 1) return true;
    
    var name = clefs[0];
    	
    //trouver la propriété portant ce nom dans la prop demandée
    if (prop.propertyType == PropertyType.PROPERTY && prop.name == name)
    {
        for (iclef = 1; iclef < clefs.length;iclef++)
        {
            loadClef(prop,clefs [iclef]);
        }
        return true;
    }
    else if (prop.numProperties != undefined)
		if (prop.numProperties > 0)
		{
			for (pi = 1;pi <= prop.numProperties;pi++)
			{
				if (loadClefs(prop.property(pi),clefs)) return true;
			}
		}
    return false;
}

//charge une clef sur la prop
function loadClef(prop,clef)
{
     //     0        1                        2                                  3                          4                   5                                      6                                              7                                        8
     //  time, value, inInterpolationType, outInterpolationType, spatial, keyInTemporalEase, keyOutTemporalEase, keyTemporalContinuous, keyTemporalAutoBezier
     
     //spatial.push(true);
     //spatial.push(prop.keyInSpatialTangent(index));
     //spatial.push(prop.keyOutSpatialTangent(index));
     //spatial.push(prop.keySpatialContinuous(index));
    //spatial.push(prop.keySpatialAutoBezier(index));
    //spatial.push(prop.keyRoving(index));
    
    if (clef.length < 2 || prop.elided) return;
    
    var time = app.project.activeItem.workAreaStart+clef[0];
    try //au cas où on est sur du XPosition alors que le calque est 2D, par exemple
    {
        if (clef.length == 2 )
        {
            prop.setValue(clef[1]);
            return;
        }
        else prop.setValueAtTime(time,clef[1]); 
 
        var index = prop.nearestKeyIndex(time);
        if (clef[4][0] && (prop.propertyValueType == PropertyValueType.ThreeD_SPATIAL || prop.propertyValueType == PropertyValueType.TwoD_SPATIAL))
        {
            prop.setSpatialContinuousAtKey(index,clef[4][3]);
            prop.setSpatialAutoBezierAtKey(index,clef[4][4]);
            prop.setRovingAtKey(index,clef[4][5]);
            prop.setSpatialTangentsAtKey(index,clef[4][1],clef[4][2]);
        }
        prop.setTemporalEaseAtKey(index,clef[5],clef[6]);
        prop.setTemporalContinuousAtKey(index,clef[7]);
        prop.setTemporalAutoBezierAtKey(index,clef[8]);
        prop.setInterpolationTypeAtKey(index,clef[2],clef[3]);
        
    }
    catch (err)
    {}
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
		verifNoms();
		//Prendre l'effet
		var effet = app.project.activeItem.selectedLayers[0].selectedProperties.pop();
		//on vérifie si on peut mettre une expression, sinon inutile de continuer
		if(!effet.canSetExpression) { return; }
		
		//  début de groupe d'annulation
		app.beginUndoGroup("Duik - Rotation Morph");
		

		if (effet.parentProperty.isEffect)
		{
			var effetIndex = effet.propertyIndex;
			var effetParentName = effet.parentProperty.name;
			var layerSelection = calque.Effects.addProperty("ADBE Layer Control");
			layerSelection.name = "RM " + effetParentName + " Ref";
			var min = calque.Effects.addProperty("ADBE Angle Control");
			min.name = "RM " + effetParentName + " Min";
			min(1).setValue(0);
			var max = calque.Effects.addProperty("ADBE Angle Control");
			max.name = "RM " + effetParentName + " Max";
			max(1).setValue(90);

			effet = app.project.activeItem.selectedLayers[0].effect(effetParentName)(effetIndex);
			//=============================================
			//expression a insérer
			var expressionrm = "if (numKeys > 1)\r\n" + 
								"{\r\n" + 
								"r = thisLayer.effect('" + "RM " + effetParentName + " Ref" + "')(1).transform.rotation;\r\n" + 
								"n = timeToFrames(key(numKeys).time);\r\n" + 
								"Min =  thisLayer.effect('" + "RM " + effetParentName + " Min" + "')(1);\r\n" + 
								"Max = thisLayer.effect('" + "RM " + effetParentName + " Max" + "')(1);\r\n" + 
								"div =  (Max - Min) / n;\r\n" + 
								"val = 0;\r\n" + 
								"if (div != 0) val = r/div - (Min/div);\r\n" + 
								"valueAtTime(framesToTime(val));\r\n" + 
								"} else value;";
			//=============================================
			effet.expression = expressionrm;

		}
		else 
		{
			var effetParentName = effet.parentProperty.name;
			var layerSelection = calque.Effects.addProperty("ADBE Layer Control");
			layerSelection.name = "RM " + effetParentName + " Ref";
			var min = calque.Effects.addProperty("ADBE Angle Control");
			min.name = "RM " + effetParentName + " Min";
			min(1).setValue(0);
			var max = calque.Effects.addProperty("ADBE Angle Control");
			max.name = "RM " + effetParentName + " Max";
			max(1).setValue(90);
			//=============================================
			//expression a insérer
			var expressionrm = "if (numKeys > 1)\r\n" + 
								"{\r\n" + 
								"r = thisLayer.effect('" + "RM " + effetParentName + " Ref" + "')(1).transform.rotation;\r\n" + 
								"n = timeToFrames(key(numKeys).time);\r\n" + 
								"Min =  thisLayer.effect('" + "RM " + effetParentName + " Min" + "')(1);\r\n" + 
								"Max = thisLayer.effect('" + "RM " + effetParentName + " Max" + "')(1);\r\n" + 
								"div =  (Max - Min) / n;\r\n" + 
								"val = 0;\r\n" + 
								"if (div != 0) val = r/div - (Min/div);\r\n" + 
								"valueAtTime(framesToTime(val));\r\n" + 
								"} else value;";
			//=============================================

			effet.expression = expressionrm;
			
		}

		app.endUndoGroup();

		}

	}
}

//FONCTION MULTIPLAN
function multiplan()
{
	//début du groupe d'annulation
	app.beginUndoGroup("Multi Plan");

	//le nombre de couches
	nbre = eval(nombre.text);
	//la couche caméra
	camNbre = Math.ceil(nbre/2);


	if (pos.value && !sca.value)
	{
		//créer un zéro
		var zero = app.project.activeItem.layers.addNull();
		zero.name = "Zero_multiplan";
		//verrouiller et masquer le zéro
		zero.moveToEnd();
		zero.guideLayer = true;
		zero.locked = true;
		zero.shy = true;
		zero.enabled = false;

		for (i=1;i<=nbre;i++)
		{
			var numero = "L00";
			i < 10 ? numero = "L0" + i : numero = "L" + i ;
			//créer les nuls et leurs zéros
			var calque = app.project.activeItem.layers.addNull() ;
			calque.parent = zero;
			if (i == camNbre) 
			{
				calque.name = numero + " cam";
			}
			else
			{
				calque.name = numero;
				calque.locked = true;
			}
			delete calque;
		}
	
		delete zero;

		//ajouter les expressions et curseurs
		for (i=1;i<=nbre;i++)
		{
			//si on n'est pas sur le calque cam (dont on différencie le numéro si il est pair ou impair)
			if (i != camNbre-nbre%2+1 )
			{
				var calque = app.project.activeItem.layer(i);
				var curseur = calque.Effects.addProperty("ADBE Slider Control");
				curseur.name = "influence position";
				(i<camNbre+1) ? curseur(1).setValue(Math.abs(i-camNbre-2)-nbre%2) : curseur(1).setValue((1/camNbre)*Math.abs(i-nbre-1)) ;
				delete curseur;
				calque.transform.position.expression = "thisComp.layer(\"L0" + camNbre + " cam\").position * effect(\"influence position\")(1)";
			}
		}
   }

	if (!pos.value && sca.value)
	{
		//créer un zéro
		var zero = app.project.activeItem.layers.addNull();
		zero.name = "Zero_multiplan";
		//verrouiller et masquer le zéro
		zero.moveToEnd();
		zero.guideLayer = true;
		zero.locked = true;
		zero.shy = true;
		zero.enabled = false;

		for (i=1;i<=nbre;i++)
		{
			var numero = "L00";
			i < 10 ? numero = "L0" + i : numero = "L" + i ;
			//créer les nuls et leurs zéros
			var calque = app.project.activeItem.layers.addNull() ;
			calque.parent = zero;
			if (i == camNbre) 
			{
				calque.name = numero + " cam";
			}
			else
			{
				calque.name = numero;
				calque.locked = true;
			}
			delete calque;
		}
		
		delete zero;

		//ajouter les expressions et curseurs
		for (i=1;i<=nbre;i++)
		{
			//si on n'est pas sur le calque cam (dont on différencie le numéro si il est pair ou impair)
			if (i != camNbre-nbre%2+1 )
			{
				var calque = app.project.activeItem.layer(i);
				var curseur = calque.Effects.addProperty("ADBE Slider Control");
				curseur.name = "influence echelle";
				(i<camNbre+1) ? curseur(1).setValue(Math.abs(i-camNbre-2)-nbre%2) : curseur(1).setValue((1/camNbre)*Math.abs(i-nbre-1)) ;
				delete curseur;
				calque.transform.scale.expression = "thisComp.layer(\"L0" + camNbre + " cam\").scale * effect(\"influence echelle\")(1) - [100,100]* effect(\"influence echelle\")(1) + [100,100]";
			}
		}
	}

	if (pos.value && sca.value)
	{
		//créer un zéro
		var zero = app.project.activeItem.layers.addNull();
		zero.name = "Zero_multiplan";
		//verrouiller et masquer le zéro
		zero.moveToEnd();
		zero.guideLayer = true;
		zero.locked = true;
		zero.shy = true;
		zero.enabled = false;

		for (i=1;i<=nbre;i++)
		{
			var numero = "L00";
			i < 10 ? numero = "L0" + i : numero = "L" + i ;
			//créer les nuls et leurs zéros position
			var calque = app.project.activeItem.layers.addNull() ;
			calque.parent = zero;
			if (i == camNbre) 
			{
				calque.name = numero + " cam position";
			}
			else
			{
				calque.name = numero;
				calque.locked = true;
			}
			delete calque;
		}

		//ajouter les expressions et curseurs position
		for (i=1;i<=nbre;i++)
		{
			//si on n'est pas sur le calque cam (dont on différencie le numéro si il est pair ou impair)
			if (i != camNbre-nbre%2+1 )
			{
				var calque = app.project.activeItem.layer(i);
				var curseur = calque.Effects.addProperty("ADBE Slider Control");
				curseur.name = "influence position";
				(i<camNbre+1) ? curseur(1).setValue(Math.abs(i-camNbre-2)-nbre%2) : curseur(1).setValue((1/camNbre)*Math.abs(i-nbre-1)) ;
				delete curseur;
				calque.transform.position.expression = "thisComp.layer(\"L0" + camNbre + " cam position\").position * effect(\"influence position\")(1)";
			}
		}
		
		for (i=1;i<=nbre;i++)
		{
			var numero = "L00";
			i < 10 ? numero = "L0" + i : numero = "L" + i ;
			//créer les nuls et leurs zéros scale
			var calque = app.project.activeItem.layers.addNull() ;
			calque.parent = zero;
			if (i == camNbre) 
			{
				calque.name = numero + " cam scale";
			}
			else
			{
				calque.name = numero;
				calque.locked = true;
			}
			delete calque;
		}
		
		//ajouter les expressions et curseurs scale
		for (i=1;i<=nbre;i++)
		{
			//si on n'est pas sur le calque cam (dont on différencie le numéro si il est pair ou impair)
			if (i != camNbre-nbre%2+1 )
			{
				var calque = app.project.activeItem.layer(i);
				var curseur = calque.Effects.addProperty("ADBE Slider Control");
				curseur.name = "influence echelle";
				(i<camNbre+1) ? curseur(1).setValue(Math.abs(i-camNbre-2)-nbre%2) : curseur(1).setValue((1/camNbre)*Math.abs(i-nbre-1)) ;
				delete curseur;
				calque.transform.scale.expression = "thisComp.layer(\"L0" + camNbre + " cam scale\").scale * effect(\"influence echelle\")(1) - [100,100]* effect(\"influence echelle\")(1) + [100,100]";
			}
		}

		delete zero;

		//relinker les positions aux échelles
		for (i=1;i<=nbre;i++)
		{
			app.project.activeItem.layer(nbre + i).locked = false;
			app.project.activeItem.layer(nbre + i).parent = app.project.activeItem.layer(i);
			if (app.project.activeItem.layer(nbre + i).name.indexOf("cam") < 0) app.project.activeItem.layer(nbre + i).locked = true;
		}

	}
	//fin du groupe d'annulation
	app.endUndoGroup();
    
    fenetremultiplan.hide();

}

}
//===========================================
//UI
//===========================================
{
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

		//l'expo
		{
			var fenetreexposure = createDialog(getMessage(123),true,nframes);
			fenetreexposure.groupe.orientation = "column";
			var evenExposureButton = fenetreexposure.groupe.add("radiobutton",undefined,"Even");
			var adaptativeExposureButton = fenetreexposure.groupe.add("radiobutton",undefined,"Adaptative");
			adaptativeExposureButton.value = true;
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
		rayonbouton.onChange = rayon;
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

		// la fenetre du wiggle 3D
		{
			var fenetrewiggle3D = createDialog("Wiggle",true,wiggle3D);
			fenetrewiggle3D.groupe.orientation = "row";
			//separer ou toutes
			var wiggle3Dtous = fenetrewiggle3D.groupe.add("checkbox",undefined,getMessage(66));
			wiggle3Dtous.value = true;
			wiggle3Dtous.onClick = wiggleconf3D;
			//x y z
			var wiggle3DX = fenetrewiggle3D.groupe.add("checkbox",undefined,"X");
			var wiggle3DY = fenetrewiggle3D.groupe.add("checkbox",undefined,"Y");
			var wiggle3DZ = fenetrewiggle3D.groupe.add("checkbox",undefined,"Z");
			wiggle3DX.enabled = false;
			wiggle3DY.enabled = false;
			wiggle3DZ.enabled = false;
		}
		
		// la fenetre du wiggle 2D
		{
			var fenetrewiggle2D = createDialog("Wiggle",true,wiggle2D);
			fenetrewiggle2D.groupe.orientation = "row";
			//separer ou toutes
			var wiggle2Dtous = fenetrewiggle2D.groupe.add("checkbox",undefined,getMessage(66));
			wiggle2Dtous.value = true;
			wiggle2Dtous.onClick = wiggleconf2D;
			//x y z
			var wiggle2DX = fenetrewiggle2D.groupe.add("checkbox",undefined,"X");
			var wiggle2DY = fenetrewiggle2D.groupe.add("checkbox",undefined,"Y");
			wiggle2DX.enabled = false;
			wiggle2DY.enabled = false;
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
		var palette = (thisObj instanceof Panel) ? thisObj : new Window("palette","Duik",undefined, {resizeable:true});
		palette.alignChildren = ["fill","fill"];
		//entete
		var entete = palette.add("group");
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
		var panos = palette.add("group");
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
						if (selecteur.selection == 1){
				panoik.visible = false;
				panoanimation.visible = true;
				panointerpo.visible = false;
				panocam.visible = false;
				panosettings.visible = false;
                app.settings.saveSetting("duik","pano","1");
				}
						if (selecteur.selection == 2){
				panoik.visible = false;
				panoanimation.visible = false;
				panointerpo.visible = true;
				panocam.visible = false;
				panosettings.visible = false;
                app.settings.saveSetting("duik","pano","2");
				}
						if (selecteur.selection == 3){
				panoik.visible = false;
				panoanimation.visible = false;
				panointerpo.visible = false;
				panocam.visible = true;
				panosettings.visible = false;
                app.settings.saveSetting("duik","pano","3");
				}
						if (selecteur.selection == 4){
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
		//boutons francais anglais
		var groupeLangues = panosettings.add("group");
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
		var boutonVMAJ = panosettings.add("checkbox",undefined,getMessage(77));
		if (app.settings.getSetting("duik", "version") == "oui") {boutonVMAJ.value = true; }
		boutonVMAJ.onClick = function() {
			if (boutonVMAJ.value) {app.settings.saveSetting("duik","version","oui");} else {app.settings.saveSetting("duik","version","non");}
			}
		var boutonMAJ = panosettings.add("button",undefined,getMessage(113));
		boutonMAJ.onClick = function() {
			if (MAJ(version)) { alert(getMessage(78)); };
			}
		
		addSeparator(panosettings,getMessage(117));
		
		//boutons options bones et controleurs
		//type de bones
		var groupeBoneType = addHGroup(panosettings);
		groupeBoneType.add("statictext",undefined,getMessage(165));
		var boutonBoneType = groupeBoneType.add("dropdownlist",undefined,[getMessage(166),getMessage(167)]);
		boutonBoneType.selection = eval(app.settings.getSetting("duik", "boneType"));
		boutonBoneType.onChange = function() {
			app.settings.saveSetting("duik", "boneType",boutonBoneType.selection.index);
			boutonBoneColor.enabled = boutonBoneType.selection == 0;
			};
		//taille des bones
		var groupeBoneSize = addHGroup(panosettings);
		var groupeBoneSizeAuto = addHGroup(panosettings);
		groupeBoneSize.add("statictext",undefined,getMessage(168));
		var boutonBoneSize = groupeBoneSize.add("edittext",undefined,app.settings.getSetting("duik", "boneSize"));
		boutonBoneSize.onChange = function() { app.settings.saveSetting("duik", "boneSize",boutonBoneSize.text); };
		boutonBoneSize.text = app.settings.getSetting("duik","boneSize");
		var boutonBoneSizeAuto = groupeBoneSizeAuto.add("checkbox",undefined,getMessage(170));
		boutonBoneSizeAuto.onClick = function() {
			app.settings.saveSetting("duik", "boneSizeAuto",boutonBoneSizeAuto.value);
			boutonBoneSize.enabled = !boutonBoneSizeAuto.value;
			boutonBoneSizeAutoValue.enabled = boutonBoneSizeAuto.value;
			};
		boutonBoneSizeAuto.value = eval(app.settings.getSetting("duik", "boneSizeAuto"));
		boutonBoneSizeAuto.alignment = ["fill","bottom"];
		var boutonBoneSizeAutoValue = groupeBoneSizeAuto.add("dropdownlist",undefined,[getMessage(171),getMessage(172),getMessage(173)]);
		boutonBoneSizeAutoValue.selection = eval(app.settings.getSetting("duik", "boneSizeAutoValue"));
		boutonBoneSizeAutoValue.onChange = function () {app.settings.saveSetting("duik", "boneSizeAutoValue",boutonBoneSizeAutoValue.selection.index)};
		boutonBoneSize.enabled = !boutonBoneSizeAuto.value ;
		boutonBoneSizeAutoValue.enabled = boutonBoneSizeAuto.value ;
		var groupeBoneColor = addHGroup(panosettings);
		groupeBoneColor.add("statictext",undefined,getMessage(187));
		var boutonBoneColorSharp = groupeBoneColor.add("statictext",undefined,"#");
		boutonBoneColorSharp.alignment = ["right","fill"];
		var boutonBoneColor = groupeBoneColor.add("edittext",undefined,"FF0000");
		boutonBoneColor.onChange = function() { app.settings.saveSetting("duik", "boneColor",boutonBoneColor.text); };
		boutonBoneColor.text = app.settings.getSetting("duik","boneColor");
		boutonBoneColor.enabled = boutonBoneType.selection == 0;
		
		addSeparator(panosettings,getMessage(116));
		
		//taille des controleurs
		var groupeCtrlSize = addHGroup(panosettings);
		var groupeCtrlSizeAuto = addHGroup(panosettings);
		groupeCtrlSize.add("statictext",undefined,getMessage(169));
		var boutonCtrlSize = groupeCtrlSize.add("edittext",undefined,app.settings.getSetting("duik", "ctrlSize"));
		boutonCtrlSize.onChange = function() { app.settings.saveSetting("duik", "ctrlSize",boutonCtrlSize.text); };
		boutonCtrlSize.text = app.settings.getSetting("duik","ctrlSize");
		var boutonCtrlSizeAuto = groupeCtrlSizeAuto.add("checkbox",undefined,getMessage(170));
		boutonCtrlSizeAuto.onClick = function() { app.settings.saveSetting("duik", "ctrlSizeAuto",boutonCtrlSizeAuto.value); boutonCtrlSize.enabled = !boutonCtrlSizeAuto.value; boutonCtrlSizeAutoValue.enabled = boutonCtrlSizeAuto.value;};
		boutonCtrlSizeAuto.value = eval(app.settings.getSetting("duik", "ctrlSizeAuto"));
		boutonCtrlSizeAuto.alignment = ["fill","bottom"];
		var boutonCtrlSizeAutoValue = groupeCtrlSizeAuto.add("dropdownlist",undefined,[getMessage(171),getMessage(172),getMessage(173)]);
		boutonCtrlSizeAutoValue.selection = eval(app.settings.getSetting("duik", "ctrlSizeAutoValue"));
		boutonCtrlSizeAutoValue.onChange = function () {app.settings.saveSetting("duik", "ctrlSizeAutoValue",boutonBoneSizeAutoValue.selection.index)};
		boutonCtrlSize.enabled = !boutonCtrlSizeAuto.value ;
		boutonCtrlSizeAutoValue.enabled = boutonCtrlSizeAuto.value ;
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
		//bouton liens
		//var boutonliens = addIconButton(groupeG,dossierIcones + "btn_liens.png",getMessage(133));
		//boutonliens.onClick = liens; //TODO nouvel outil liens
		//boutonliens.helpTip = traduction(["Show parent links in a simple tree view","Voir les liens de parentés dans une arborescence simple","Show parent links in a simple tree view"]);
		//bouton renommer
		var boutonrename2 = addIconButton(groupeikG,dossierIcones + "btn_renommer.png",getMessage(111));
		boutonrename2.onClick = function() {fenetrerename.show();}
		boutonrename2.helpTip = getMessage(85);
		//bouton mesurer
		var boutonmesurer = addIconButton(groupeikD,dossierIcones + "btn_mesurer.png",getMessage(106));
		boutonmesurer.onClick = mesure;
		boutonmesurer.helpTip = getMessage(100);
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
			//bouton pour créer une cam relief
			var boutontcamrelief = addIconButton(groupCameraG,dossierIcones + "btn_3d.png",getMessage(135));
			boutontcamrelief.onClick = camrelief;
			boutontcamrelief.helpTip = getMessage(103);
			//bouton pour multiplan 2D
			var boutontcam2d = addIconButton(groupCameraD,dossierIcones + "btn_controleur-cam.png",getMessage(188));
			boutontcam2d.onClick = function () { fenetremultiplan.show() ;};
			boutontcam2d.helpTip = "HelpTip";
			
		}
	
        // On définit le layout et on redessine la fenètre quand elle est resizée
        palette.layout.layout(true);
        palette.layout.resize();
        palette.onResizing = palette.onResize = function () {this.layout.resize();}
		
		
		}

		if (app.settings.getSetting("duik", "version") == "oui" && app.preferences.getPrefAsLong("Main Pref Section","Pref_SCRIPTING_FILE_NETWORK_SECURITY") == 1) MAJ(version);
		return palette;
}


}

var laPalette = IKtools(wnd);
if (laPalette != null && laPalette instanceof Window) {      
        laPalette.show();
    }



}


fnDuIK(this);

