/*
Duik - Duduf IK Tools
Copyright (c) 2008 - 2016 Nicolas Dufresne
http://ik.duduf.fr
http://ik.duduf.com

Many thanks to :
Dan Ebberts - Writing the first IK Expressions
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


(function (thisObj)
{
//=========================
var version = '15.11';
var developper = false;
//=========================

//=================================
//========= LOAD TRANSLATIONS =====
//=================================
#include 'Duik_translations.jsxinc'

//=================================
//======== DUIK PALETTE ===========
//=================================
var palette = (thisObj instanceof Panel) ? thisObj : new Window('palette','Duik',undefined, {resizeable:true});
palette.orientation = 'stack';
palette.alignChildren = ['fill','fill'];

//=================================
//======== APP.SETTINGS ===========
//=================================
{
if (!app.settings.haveSetting('duik', 'lang')){app.settings.saveSetting('duik','lang','en');}
if (!app.settings.haveSetting('duik','version')){app.settings.saveSetting('duik','version','oui');}
if (!app.settings.haveSetting('duik','expertMode')){app.settings.saveSetting('duik','expertMode','false');}
if (!app.settings.haveSetting('duik', 'notes')){app.settings.saveSetting('duik','notes','');}
if (!app.settings.haveSetting('duik', 'pano')){app.settings.saveSetting('duik','pano','0');}
if (!app.settings.haveSetting('duik', 'stretch')){app.settings.saveSetting('duik','stretch','true');}
if (!app.settings.haveSetting('duik', 'ikfk')){app.settings.saveSetting('duik','ikfk','true');}
if (!app.settings.haveSetting('duik', 'dropDownSelector')){app.settings.saveSetting('duik','dropDownSelector','false');}
if (!app.settings.haveSetting('duik', 'interactiveUpdate')){app.settings.saveSetting('duik','interactiveUpdate','false');}
if (!app.settings.haveSetting('duik', 'interpolationPresets')){app.settings.saveSetting('duik','interpolationPresets','[\'Presets\',\'0 - 33/33\',\'0 - 50/50\',\'0 - 80/80\',\'0 - 25/75\',\'0 - 15/85\']');}
if (!app.settings.haveSetting('duik', 'interpolationSliders')){app.settings.saveSetting('duik','interpolationSliders','true');}
//Set language
Dutranslator.setLanguage(app.settings.getSetting('duik', 'lang'));
}

//=================================
//== DUIK NEEDS TO WRITE FILES ====
//=================================
{
if (app.preferences.getPrefAsLong('Main Pref Section','Pref_SCRIPTING_FILE_NETWORK_SECURITY') != 1)
{
function dialog_preferences_general()
{
//	Valide au moins depuis CS4,
app.executeCommand(2359);
}

var wfGroup = palette.add('group');
wfGroup.orientation = 'column';
wfGroup.alignChildren = ['fill','fill'];
var versionBox = wfGroup.add('statictext',undefined,'Duik v' + version);
versionBox.alignment = ['center','top'];
var warningBox = wfGroup.add('statictext',undefined,'temp',{multiline:true});
warningBox.text = '----- ' + tr("INSTALLATION") + ' ---\n' + tr("Duik needs to be allowed to write files to display its buttons, and to access the network to check for updates.") + '\n------------------------------\n\n' + tr("Please, check the box called 'Allow Scripts to write files...' in the general preferences of After Effects.");
warningBox.minimumSize = [150,150];
warningBox.alignment = ['center','top'];
var prefButton = wfGroup.add('button',undefined,tr("Open General Preferences"));
prefButton.onClick = function ()
{
dialog_preferences_general();
if (app.preferences.getPrefAsLong('Main Pref Section','Pref_SCRIPTING_FILE_NETWORK_SECURITY') == 1)
{
wfGroup.hide();
preloadDuik();
}
}
prefButton.alignment =  ['center','top'];
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
	var reply = '';
	//socket
	conn = new Socket;
	// se connecter a duduf.com
	if (conn.open ('rainboxprod.net:80'))
	{
		// recuperer la version actuelle
		//check AE Version
		var reV = /^(\d+\.?\d*)/i;
		var v = app.version.match(reV);
		delete reV;
		var userAgent = 'User-Agent: Duik/' + version + ' (' + $.os + ')' + ' AE/' + v[0];
		if (conn.writeln('GET /duik/version.txt  HTTP/1.0\n' + userAgent + '\nHost: rainboxprod.net\n'))
			reply = conn.read(1000);
		conn.close();
		delete v;
		//chercher la version dans la reponse du serveur :
		var reponse = reply.lastIndexOf('version',reply.length);
		if(reponse != -1)
		{
			newVersion = reply.slice(reponse+8,reply.length+1);
			if (showAlert && version != newVersion) alert(tr("A new version of Duik is available,\ngo to http://rainboxprod.coop to download it"));
			return newVersion;
		}
	}
}

function preloadDuik ()
{
	if (app.settings.getSetting('duik','version') == 'oui' && !developper)
	{
		var newV = checkForUpdate(version,false);
		if ( version == newV || newV == undefined)
		{
		loadDuik();
		}
		else
		{
		var updGroup = palette.add('group');
		updGroup.orientation = 'column';
		updGroup.alignChildren = ['center','top'];
		var updVersionBox = updGroup.add('statictext',undefined,tr("Duik current version: ") + version);
		var updNewVersionBox = updGroup.add('statictext',undefined,'temp',{multiline:true});
		updNewVersionBox.text = '- ' + tr("UPDATE AVAILABLE -\n\nA new version of Duik is available!\nVersion: ") + newV + tr("\n\nGo to http://rainboxprod.coop to download it.");
		var updButton = updGroup.add('button',undefined,tr("Launch Duik"));
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
	if (developper) if (typeof Duik === 'object') delete Duik;
#include 'libduik.jsxinc'
//if pseudo effects are not installed
if (Duik.usePresets && !developper)
{
//PALETTE
{
var installGroup = palette.add('group');
installGroup.orientation = 'column';
installGroup.alignChildren = ['fill','fill'];
var versionBox = installGroup.add('statictext',undefined,'Duik v' + version);
versionBox.alignment = ['center','top'];
var paletteContent = installGroup.add('group');
paletteContent.orientation = 'stack';
paletteContent.alignChildren = ['fill','fill'];
//INSTALL COMPLETE GROUP
var icGroup = paletteContent.add('group',undefined);
icGroup.orientation = 'column';
icGroup.alignChildren = ['fill','fill'];
var icText = icGroup.add('statictext',undefined,'',{multiline:true});
icText.minimumSize = [150,60];
icText.alignment = ['center','top'];
icText.text = '-- ' + tr("INSTALLATION COMPLETE") + ' --\n\n' + tr("After Effects must be restarted\n\nto complete the installation of Duik\n\nMay the god(s?) of animation be with you!\n\n") + '-----------------------------';
icGroup.visible = false;
//MANUAL INSTALL
var mmGroup = paletteContent.add('group',undefined);
mmGroup.orientation = 'column';
mmGroup.alignChildren = ['fill','fill'];
var mmTexts = mmGroup.add('group');
mmTexts.orientation = 'stack';
mmTexts.alignment = ['center','top'];
var mmText = mmTexts.add('statictext',undefined,'',{multiline:true});
mmText.alignment = ['center','top'];
mmText.text = tr("It seems Duik can not automatically install the pseudo effects it needs.\n\nThe easiest way to fix this is by restarting After Effects with administrator privileges,\n\nor you can manually install the pseudo effects needed by Duik: click on the 'Next' button below.");
var mmText2 = mmTexts.add('statictext',undefined,'',{multiline:true});
mmText2.alignment = ['center','top'];
mmText2.text = '• 1 - ' + tr("Open the file 'presetEffects.xml':\nRight click on\nApplications/Adobe After Effects/Adobe After Effects.app,\nSelect 'Show package contents', go to\nContents/Resources/PresetEffects.xml.");
if ($.os.toLowerCase().indexOf('win') >= 0) mmText2.text = '• 1 - ' + tr("Open the file 'presetEffects.xml' :\nC:\\Program Files\\Adobe\\Adobe After Effects\\Support Files\\PresetEffects.xml.");
mmText2.visible = false;
var mmText3 = mmTexts.add('statictext',undefined,'',{multiline:true});
mmText3.alignment = ['center','top'];
mmText3.text = '• 2 - ' + tr("Copy the content of the box below,\nhit Cmd+A\nto select all the text,\nthen Cmd+C to copy it.");
if ($.os.toLowerCase().indexOf('win') >= 0) mmText3.text = '• 2 - ' + tr("Copy the content of the box below,\nhit Ctrl+A\nto select all the text,\nthen Ctrl+C to copy it.");
mmText3.visible = false;
var mmText4 = mmTexts.add('statictext',undefined,'',{multiline:true});
mmText4.alignment = ['center','top'];
mmText4.text = '• 3 - ' + tr("Paste this text in the file 'presetEffects.xml'\njust BEFORE the last line: '</effects>'.");
mmText4.visible = false;
var mmNavButtons = mmGroup.add('group');
mmNavButtons.orientation = 'row';
mmNavButtons.alignment = ['center','top'];
var mmPrevButton = mmNavButtons.add('button',undefined,tr("Previous"));
mmPrevButton.alignment = ['left','top'];
mmPrevButton.enabled = false;
var mmNextButton = mmNavButtons.add('button',undefined,tr("Next"));
mmNextButton.alignment = ['right','top'];
mmContinueButton = mmGroup.add('button',undefined,tr("Finish installation now!"));
mmContinueButton.alignment = ['center','bottom'];
var mmXmlBox = mmGroup.add('edittext',undefined,'test',{multiline:true});
mmXmlBox.text = Duik.setup.presetEffects;
mmGroup.visible = false;
//CANNOT INSTALL
var ciGroup = paletteContent.add('group',undefined);
ciGroup.orientation = 'column';
ciGroup.alignChildren = ['fill','fill'];
var ciText = ciGroup.add('statictext',undefined,'',{multiline:true});
ciText.minimumSize = [150,60];
ciText.alignment = ['center','top'];
ciText.text = '---- ' + tr("ERROR") + ' ----\n\n' + tr("Oops!\nSomething is wrong, Duik can not find pseudo effects.\n\nGo to http://rainboxprod.coop to get help.") + '\n\n-----------------------------';
ciGroup.visible = false;
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
else if ($.os.toLowerCase().indexOf('mac') >= 0)
{
mmGroup.visible = true;
}
//if win
else
{
mmGroup.visible = true;
}

// On definit le layout et on redessine la fenetre quand elle est resizee
palette.layout.layout(true);
palette.layout.resize();
palette.onResizing = palette.onResize = function () { this.layout.resize(); };
return palette;

}
Duik.settings.load();
}

Duik.ui.showProgressPanel(2,tr("Duik - Loading icons"));

//=================================
//======== LOAD ICONS =============
//=================================
{
function checkFile(name, content)
{
var file = new File(name);
var fileContent = '';
if (file.exists)
{
file.encoding = 'BINARY';
if (file.open('r', 'TEXT', '????'))
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
file.encoding = 'BINARY';
if (file.open('w'))
{
success = file.write(content);

file.close();
}
}
return success;
}

#include 'Duik_images.jsxinc'

var duFolder = new Folder(Folder.userData.fsName + '/Duduf');
if (!duFolder.exists) duFolder.create();
var imgFolder = new Folder(duFolder.fsName + '/DuIK').fsName;
for (var k in scriptMng.files)
{
if (scriptMng.files.hasOwnProperty(k))
{
if (!checkFile(imgFolder + k, scriptMng.files[k]))
{
alert(tr("Error writing file: ") + k);
}
}
}
}

Duik.ui.updateProgressPanel(1,tr("Duik - Loading functions"));

//===============================================
//============ FUNCTIONS ========================
//===============================================
{
//TODO renommer les fonctions (onButtonBonesClick() par exemple), et clarifier le code
//=================== UTILS =========================

//FONCTION CARRE
function carre(nombre) {
return nombre*nombre;
}

//FUNCTION TO GET CURRENT COMP OR ALERT IF NO CURRENT CompItem
function getCurrentComp() {
var comp = app.project.activeItem;
if (comp instanceof CompItem) return comp;
else
{
alert(tr("Active composition not found.\nPlease select a composition or activate the composition panel."));
return null;
}
}

//FUNCTION TO GET CURRENT Layers
function getCurrentLayers() {
var comp = getCurrentComp();
if (!comp) return null;
var layers = comp.selectedLayers;
if (!layers.length)
{
alert(tr("No selected layer.\nPlease select a layer/property."));
return null;
}
return layers;
}

//FUNCTION TO GET ALL Layers
function getLayers() {
var comp = getCurrentComp();
if (!comp) return null;
var layrs = comp.layers;
layers = Duik.utils.convertCollectionToArray(layrs);
if (!layers.length)
{
alert(tr("No layer in this comp.\nPlease select a composition with layers."));
return null;
}
return layers;
}

//FUNCTION TO GET CURRENT Items
function getCurrentItems() {
var items = app.project.selection;
if (!items.length)
{
alert(tr("No selected item.\nPlease select an item."));
return null;
}
return items;
}

//FUNCTION TO GET CURRENT Props
function getCurrentProps() {
var layers = getCurrentLayers()
if (!layers) return null;
var props = layers[0].selectedProperties;
if (!props.length)
{
alert(tr("No selected property.\nPlease select a property."));
return null;
}
return props;
}

//FUNCTION TO GET CURRENT Prop
function getCurrentProp(canSetExpression) {
if (canSetExpression == undefined) canSetExpression = true;
var props = getCurrentProps();
if (!props) return null;
var prop = props.pop();
if (canSetExpression && !prop.canSetExpression)
{
alert(tr("Selected property cannot get any expression, it cannot be rigged, sorry."));
return null;
}

return prop;
}

//====================== AUTORIG ======================

{
var autorig = {};
autorig.RFL = {};
autorig.RFL.shoulder = null;
autorig.RFL.humerus = null;
autorig.RFL.radius = null;
autorig.RFL.carpus = null;
autorig.RFL.claws = null;
autorig.RFL.tip = null;
autorig.RFL.heel = null;
autorig.LFL = {};
autorig.LFL.shoulder = null;
autorig.LFL.humerus = null;
autorig.LFL.radius = null;
autorig.LFL.carpus = null;
autorig.LFL.claws = null;
autorig.LFL.tip = null;
autorig.LFL.heel = null;
autorig.RBL = {};
autorig.RBL.femur = null;
autorig.RBL.tibia = null;
autorig.RBL.tarsus = null;
autorig.RBL.claws = null;
autorig.RBL.tip = null;
autorig.RBL.heel = null;
autorig.LBL = {};
autorig.LBL.femur = null;
autorig.LBL.tibia = null;
autorig.LBL.tarsus = null;
autorig.LBL.claws = null;
autorig.LBL.tip = null;
autorig.LBL.heel = null;
autorig.spine = {};
autorig.spine.head = null;
autorig.spine.spine = null;
autorig.spine.neck = null;
autorig.spine.hips = null;
autorig.tail = {};
autorig.tail.hips = null;
autorig.tail.tail = null;



// FRONT LEG
{
function populateFrontLeg(searchPrefix) {

var compo = app.project.activeItem;
if (!(compo instanceof CompItem)) return;

Duik.utils.checkNames();

//1 - parcourir tous les calques et les ranger

var layers = [];

//si rien de selectionne, on charge les calques de toute la compo
if (compo.selectedLayers.length == 0) layers = compo.layers;
else layers = compo.selectedLayers;

var shoulder = Duik.utils.getLayerByNames(layers,[searchPrefix + tr("shoulder blade"),searchPrefix + tr("blade"),searchPrefix + tr("clavicle"),searchPrefix + tr("shoulder")]);
var humerus = Duik.utils.getLayerByNames(layers,[searchPrefix + tr("humerus"),searchPrefix + tr("arm"),searchPrefix  +tr("shoulder")]);
var radius = Duik.utils.getLayerByNames(layers,[searchPrefix + tr("ulna"),searchPrefix + tr("radius"),searchPrefix  + tr("forearm"),searchPrefix + tr("elbow")]);
var carpus = Duik.utils.getLayerByNames(layers,[searchPrefix + tr("carpus"),searchPrefix + tr("palm"),searchPrefix + tr("hand")]);
var claws = Duik.utils.getLayerByNames(layers,[searchPrefix + tr("claws"),searchPrefix + tr("hoof"),searchPrefix + tr("finger")]);
var tip = Duik.utils.getLayerByNames(layers,[searchPrefix + tr("tip"),searchPrefix + tr("tiptoe")]);
var heel = Duik.utils.getLayerByNames(layers,[searchPrefix + tr("heel"),searchPrefix + tr("back"),searchPrefix + tr("contact"),searchPrefix + tr("palm")]);

searchPrefix = searchPrefix.replace('_',' ');

if (!shoulder) shoulder = Duik.utils.getLayerByNames(layers,[searchPrefix + tr("femur"),searchPrefix + tr("thigh")]);
if (!humerus) humerus = Duik.utils.getLayerByNames(layers,[searchPrefix + tr("tibia"),searchPrefix + tr("fibula"),searchPrefix + tr("calf"),searchPrefix + tr("knee")]);
if (!radius) radius = Duik.utils.getLayerByNames(layers,[searchPrefix + tr("ulna"),searchPrefix + tr("radius"),searchPrefix  + tr("forearm"),searchPrefix + tr("elbow")]);
if (!carpus) carpus = Duik.utils.getLayerByNames(layers,[searchPrefix + tr("carpus"),searchPrefix + tr("palm"),searchPrefix + tr("hand")]);
if (!claws) claws = Duik.utils.getLayerByNames(layers,[searchPrefix + tr("claws"),searchPrefix + tr("hoof"),searchPrefix + tr("finger")]);
if (!tip) tip = Duik.utils.getLayerByNames(layers,[searchPrefix + tr("tip"),searchPrefix + tr("tiptoe")]);
if (!heel) heel = Duik.utils.getLayerByNames(layers,[searchPrefix + tr("heel"),searchPrefix + tr("back"),searchPrefix + tr("contact"),searchPrefix + tr("palm")]);

//get layer list
var layersList = Duik.utils.getLayersReadableList(layers);
layersList.unshift(tr("None"));

//ajouter les listes de calques
frontLegShoulderButton.removeAll();
frontLegHumerusButton.removeAll();
frontLegRadiusButton.removeAll();
frontLegCarpusButton.removeAll();
frontLegClawsButton.removeAll();
frontLegTipButton.removeAll();
frontLegHeelButton.removeAll();

for (i = 0;i<layersList.length;i++) {
frontLegShoulderButton.add('item',layersList[i]);
frontLegHumerusButton.add('item',layersList[i]);
frontLegRadiusButton.add('item',layersList[i]);
frontLegCarpusButton.add('item',layersList[i]);
frontLegClawsButton.add('item',layersList[i]);
frontLegTipButton.add('item',layersList[i]);
frontLegHeelButton.add('item',layersList[i]);
}

//preselectionner
if (shoulder) frontLegShoulderButton.selection = Duik.js.arrayIndexOf(layersList,shoulder.index + ' - ' + shoulder.name);
if (humerus) frontLegHumerusButton.selection = Duik.js.arrayIndexOf(layersList,humerus.index + ' - ' + humerus.name);
if (radius) frontLegRadiusButton.selection = Duik.js.arrayIndexOf(layersList,radius.index + ' - ' + radius.name);
if (carpus) frontLegCarpusButton.selection = Duik.js.arrayIndexOf(layersList,carpus.index + ' - ' + carpus.name);
if (claws) frontLegClawsButton.selection = Duik.js.arrayIndexOf(layersList,claws.index + ' - ' + claws.name);
if (tip) frontLegTipButton.selection = Duik.js.arrayIndexOf(layersList,tip.index + ' - ' + tip.name);
if (heel) frontLegHeelButton.selection = Duik.js.arrayIndexOf(layersList,heel.index + ' - ' + heel.name);

frontLegDialog.layout.layout(true);
frontLegDialog.layout.resize();
}

function getFrontLegSelection() {
var compo = app.project.activeItem;
if (!(compo instanceof CompItem)) return false;
var shoulder, humerus, radius, carpus, tip, heel;

if (frontLegShoulderButton.selection == null) frontLegShoulderButton.selection = 0;
if (frontLegHumerusButton.selection == null) frontLegHumerusButton.selection = 0;
if (frontLegRadiusButton.selection == null) frontLegRadiusButton.selection = 0;
if (frontLegCarpusButton.selection == null) frontLegCarpusButton.selection = 0;
if (frontLegClawsButton.selection == null) frontLegClawsButton.selection = 0;
if (frontLegTipButton.selection == null) frontLegTipButton.selection = 0;
if (frontLegHeelButton.selection == null) frontLegHeelButton.selection = 0;

frontLegShoulderButton.selection.index == 0 ? shoulder = null : shoulder = compo.layers[frontLegShoulderButton.selection.text.split(' - ')[0]];
frontLegHumerusButton.selection.index == 0 ? humerus = null : humerus = compo.layers[frontLegHumerusButton.selection.text.split(' - ')[0]];
frontLegRadiusButton.selection.index == 0 ? radius = null : radius = compo.layers[frontLegRadiusButton.selection.text.split(' - ')[0]];
frontLegCarpusButton.selection.index == 0 ? carpus = null : carpus = compo.layers[frontLegCarpusButton.selection.text.split(' - ')[0]];
frontLegClawsButton.selection.index == 0 ? claws = null : claws = compo.layers[frontLegClawsButton.selection.text.split(' - ')[0]];
frontLegTipButton.selection.index == 0 ? tip = null : tip = compo.layers[frontLegTipButton.selection.text.split(' - ')[0]];
frontLegHeelButton.selection.index == 0 ? heel = null : heel = compo.layers[frontLegHeelButton.selection.text.split(' - ')[0]];

//verifier qu'il n'y a pas deux calques assignes au meme element
var indexUtilises = [];
if (shoulder) indexUtilises.push(shoulder.index);
if (humerus) indexUtilises.push(humerus.index);
if (radius) indexUtilises.push(radius.index);
if (carpus) indexUtilises.push(carpus.index);
if (claws) indexUtilises.push(claws.index);
if (tip && (autorigDigitigradeButton.value || autorigPlantigradeButton.value)) indexUtilises.push(tip.index);
if (heel && autorigPlantigradeButton.value) indexUtilises.push(heel.index);

//verif duplicates de l'array
if (Duik.js.arrayHasDuplicates(indexUtilises)) {
var dup = Duik.js.arrayGetDuplicates(indexUtilises);
var dupNames = [];
for (var i = 0 ; i< dup.length;i++)
{
dupNames.push(dup[i] + ' - ' + compo.layer(dup[i]).name);
}
alert (tr("Be careful not to assign twice the same layer\n\nLayers assigned twice:\n\n") + dupNames.join('\n')) ;
return false;
}

//verifier qu'il ne manque rien d'indispensable (mains)
var calquesManquants = [];
if (!carpus) calquesManquants.push(tr("Carpus"));
if (claws && !humerus) calquesManquants.push(tr("Humerus"));
if (claws && !radius) calquesManquants.push(tr("Radius"));

if (!shoulder && !humerus && !radius && !carpus && !claws && !tip && !heel) calquesManquants = [];

if (calquesManquants.length > 0) { alert (tr("Those layers are needed:\n\n") + calquesManquants.join('\n')); return false; }

//verifier si 3D
var tridi = false;
if (shoulder) if (shoulder.threeDLayer) tridi = true;
if (humerus) if (humerus.threeDLayer) tridi = true;
if (radius) if (radius.threeDLayer) tridi = true;
if (carpus) if (carpus.threeDLayer) tridi = true;
if (claws) if (claws.threeDLayer) tridi = true;
if (tip) if (tip.threeDLayer) tridi = true;
if (heel) if (heel.threeDLayer) tridi = true;


if (tridi) { alert (tr("The autorig does not work with 3D Layers")); return false; }

frontLegDialog.shoulder = shoulder;
frontLegDialog.humerus = humerus;
frontLegDialog.radius = radius;
frontLegDialog.carpus = carpus;
frontLegDialog.claws = claws;
frontLegDialog.tip = tip;
frontLegDialog.heel = heel;

return true;
}

function frontLegShow() {

var compo = app.project.activeItem;
if (!(compo instanceof CompItem)) return;

frontLegDigiImage.visible = autorigDigitigradeButton.value;
frontLegPlantiImage.visible = autorigPlantigradeButton.value;
frontLegUnguImage.visible = autorigUngulateButton.value;

if (autorigDigitigradeButton.value)
{
frontLegTipGroup.visible = true;
frontLegHeelGroup.visible = false;
frontLegNullsLabel.visible = true;
}
if (autorigPlantigradeButton.value)
{
frontLegTipGroup.visible = true;
frontLegHeelGroup.visible = true;
frontLegNullsLabel.visible = true;
}
if (autorigUngulateButton.value)
{
frontLegTipGroup.visible = false;
frontLegHeelGroup.visible = false;
frontLegNullsLabel.visible = false;
}


var searchPrefix = '';

if (frontLegDialog.right) {
frontLegTypeLabel.text = tr("Right Arm / Front leg");
textColor(frontLegTypeLabel,col.trueRed);
frontLegNext.show();
frontLegPrev.show();
frontLegOK.hide();
searchPrefix = tr("R_");
}
else if (frontLegDialog.left) {
frontLegTypeLabel.text = tr("Left Arm / Front leg");
textColor(frontLegTypeLabel,col.trueGreen);
frontLegNext.show();
frontLegPrev.show();
frontLegOK.hide();
searchPrefix = tr("L_");
}
else {
frontLegTypeLabel.hide();
frontLegNext.hide();
frontLegPrev.hide();
frontLegOK.show();$
}

frontLegDialog.shoulder = null;
frontLegDialog.humerus = null;
frontLegDialog.radius = null;
frontLegDialog.carpus = null;
frontLegDialog.claws = null;
frontLegDialog.tip = null;
frontLegDialog.heel = null;

populateFrontLeg(searchPrefix);

frontLegDialog.show();

}

function frontLegOKClicked() {
if (autorigDigitigradeButton.value)
{
//get the user selection of layers
if (getFrontLegSelection())
{
app.beginUndoGroup(tr("Duik - Front Leg Autorig"));
Duik.autorig.vertebrate.digitigrade.frontLeg(frontLegDialog.shoulder,frontLegDialog.humerus,frontLegDialog.radius,frontLegDialog.carpus,frontLegDialog.claws,frontLegDialog.tip);
app.endUndoGroup();
frontLegDialog.hide();
}
}
else if (autorigPlantigradeButton.value)
{
//get the user selection of layers
if (getFrontLegSelection())
{
app.beginUndoGroup(tr("Duik - Front Leg Autorig"));
Duik.autorig.vertebrate.plantigrade.frontLeg(frontLegDialog.shoulder,frontLegDialog.humerus,frontLegDialog.radius,frontLegDialog.carpus,frontLegDialog.claws,frontLegDialog.tip,frontLegDialog.heel);
app.endUndoGroup();
frontLegDialog.hide();
}
}
else if (autorigUngulateButton.value)
{
//get the user selection of layers
if (getFrontLegSelection())
{
app.beginUndoGroup(tr("Duik - Front Leg Autorig"));
Duik.autorig.vertebrate.ungulate.frontLeg(frontLegDialog.shoulder,frontLegDialog.humerus,frontLegDialog.radius,frontLegDialog.carpus,frontLegDialog.claws);
app.endUndoGroup();
frontLegDialog.hide();
}
}
}

function frontLegNextClicked(){

if (!getFrontLegSelection()) return;

if (frontLegDialog.left)
{
frontLegDialog.hide();
autorig.LFL.shoulder = frontLegDialog.shoulder;
autorig.LFL.humerus = frontLegDialog.humerus;
autorig.LFL.radius = frontLegDialog.radius;
autorig.LFL.carpus = frontLegDialog.carpus;
autorig.LFL.claws = frontLegDialog.claws;
autorig.LFL.tip = frontLegDialog.tip;
autorig.LFL.heel = frontLegDialog.heel;
frontLegDialog.left = false;
frontLegDialog.right = true;
frontLegShow();
}
else if (frontLegDialog.right)
{
frontLegDialog.hide();
autorig.RFL.shoulder = frontLegDialog.shoulder;
autorig.RFL.humerus = frontLegDialog.humerus;
autorig.RFL.radius = frontLegDialog.radius;
autorig.RFL.carpus = frontLegDialog.carpus;
autorig.RFL.claws = frontLegDialog.claws;
autorig.RFL.tip = frontLegDialog.tip;
autorig.RFL.heel = frontLegDialog.heel;
spineDialog.fullCharacter = true;
spineShow();
}
}

function frontLegPrevClicked(){

if (frontLegDialog.left)
{
frontLegDialog.hide();
backLegDialog.left = false;
backLegDialog.right = true;
backLegShow();
}
if (frontLegDialog.right)
{
frontLegDialog.hide();
frontLegDialog.left = true;
frontLegDialog.right = false;
frontLegShow();
}
}

}

// BACK LEG
{
function populateBackLeg(searchPrefix) {

var compo = app.project.activeItem;
if (!(compo instanceof CompItem)) return;


Duik.utils.checkNames();

//1 - parcourir tous les calques et les ranger

var layers = [];

//si rien de selectionne, on charge les calques de toute la compo
if (compo.selectedLayers.length == 0) layers = compo.layers;
else layers = compo.selectedLayers;

var femur = Duik.utils.getLayerByNames(layers,[searchPrefix + tr("femur"),searchPrefix + tr("thigh")]);
var tibia = Duik.utils.getLayerByNames(layers,[searchPrefix + tr("tibia"),searchPrefix + tr("fibula"),searchPrefix + tr("calf"),searchPrefix + tr("knee")]);
var tarsus = Duik.utils.getLayerByNames(layers,[searchPrefix + tr("tarsus"),searchPrefix + tr("foot")]);
var claws = Duik.utils.getLayerByNames(layers,[searchPrefix + tr("claws"),searchPrefix + tr("hoof"),searchPrefix + tr("toes")]);
var tip = Duik.utils.getLayerByNames(layers,[searchPrefix + tr("tip"),searchPrefix + tr("tiptoe")]);
var heel = Duik.utils.getLayerByNames(layers,[searchPrefix + tr("heel"),searchPrefix + tr("back"),searchPrefix + tr("contact"),searchPrefix + tr("palm")]);

searchPrefix = searchPrefix.replace('_',' ');

if (!femur) femur = Duik.utils.getLayerByNames(layers,[searchPrefix + tr("femur"),searchPrefix + tr("thigh")]);
if (!tibia) tibia = Duik.utils.getLayerByNames(layers,[searchPrefix + tr("tibia"),searchPrefix + tr("fibula"),searchPrefix + tr("calf"),searchPrefix + tr("knee")]);
if (!tarsus) tarsus = Duik.utils.getLayerByNames(layers,[searchPrefix + tr("tarsus"),searchPrefix + tr("foot")]);
if (!claws) claws = Duik.utils.getLayerByNames(layers,[searchPrefix + tr("claws"),searchPrefix + tr("hoof"),searchPrefix + tr("toes")]);
if (!tip) tip = Duik.utils.getLayerByNames(layers,[searchPrefix + tr("tip"),searchPrefix + tr("tiptoe")]);
if (!heel) heel = Duik.utils.getLayerByNames(layers,[searchPrefix + tr("heel"),searchPrefix + tr("back"),searchPrefix + tr("contact"),searchPrefix + tr("palm")]);

//get layer list
var layersList = Duik.utils.getLayersReadableList(layers);
layersList.unshift(tr("None"));

//ajouter les listes de calques
backLegFemurButton.removeAll();
backLegTibiaButton.removeAll();
backLegTarsusButton.removeAll();
backLegClawsButton.removeAll();
backLegTipButton.removeAll();
backLegHeelButton.removeAll();

for (i = 0;i<layersList.length;i++) {
backLegFemurButton.add('item',layersList[i]);
backLegTibiaButton.add('item',layersList[i]);
backLegTarsusButton.add('item',layersList[i]);
backLegClawsButton.add('item',layersList[i]);
backLegTipButton.add('item',layersList[i]);
backLegHeelButton.add('item',layersList[i]);
}

//preselectionner
if (femur) backLegFemurButton.selection = Duik.js.arrayIndexOf(layersList,femur.index + ' - ' + femur.name);
if (tibia) backLegTibiaButton.selection = Duik.js.arrayIndexOf(layersList,tibia.index + ' - ' + tibia.name);
if (tarsus) backLegTarsusButton.selection = Duik.js.arrayIndexOf(layersList,tarsus.index + ' - ' + tarsus.name);
if (claws) backLegClawsButton.selection = Duik.js.arrayIndexOf(layersList,claws.index + ' - ' + claws.name);
if (tip) backLegTipButton.selection = Duik.js.arrayIndexOf(layersList,tip.index + ' - ' + tip.name);
if (heel) backLegHeelButton.selection = Duik.js.arrayIndexOf(layersList,heel.index + ' - ' + heel.name);

backLegDialog.layout.layout(true);
backLegDialog.layout.resize();
}

function getBackLegSelection() {
var compo = app.project.activeItem;
if (!(compo instanceof CompItem)) return false;
if (backLegFemurButton.selection == null) backLegFemurButton.selection = 0;
if (backLegTibiaButton.selection == null) backLegTibiaButton.selection = 0;
if (backLegTarsusButton.selection == null) backLegTarsusButton.selection = 0;
if (backLegClawsButton.selection == null) backLegClawsButton.selection = 0;
if (backLegTipButton.selection == null) backLegTipButton.selection = 0;
if (backLegHeelButton.selection == null) backLegHeelButton.selection = 0;

backLegFemurButton.selection.index == 0 ? femur = null : femur = compo.layers[backLegFemurButton.selection.text.split(' - ')[0]];
backLegTibiaButton.selection.index == 0 ? tibia = null : tibia = compo.layers[backLegTibiaButton.selection.text.split(' - ')[0]];
backLegTarsusButton.selection.index == 0 ? tarsus = null : tarsus = compo.layers[backLegTarsusButton.selection.text.split(' - ')[0]];
backLegClawsButton.selection.index == 0 ? claws = null : claws = compo.layers[backLegClawsButton.selection.text.split(' - ')[0]];
backLegTipButton.selection.index == 0 ? tip = null : tip = compo.layers[backLegTipButton.selection.text.split(' - ')[0]];
backLegHeelButton.selection.index == 0 ? heel = null : heel = compo.layers[backLegHeelButton.selection.text.split(' - ')[0]];

//verifier qu'il n'y a pas deux calques assignes au meme element
var indexUtilises = [];
if (femur) indexUtilises.push(femur.index);
if (tibia) indexUtilises.push(tibia.index);
if (tarsus) indexUtilises.push(tarsus.index);
if (claws) indexUtilises.push(claws.index);
if (tip && (autorigDigitigradeButton.value || autorigPlantigradeButton.value)) indexUtilises.push(tip.index);
if (heel && autorigPlantigradeButton.value) indexUtilises.push(heel.index);

//verif duplicates de l'array
if (Duik.js.arrayHasDuplicates(indexUtilises)) {
var dup = Duik.js.arrayGetDuplicates(indexUtilises);
var dupNames = [];
for (var i = 0 ; i< dup.length;i++)
{
dupNames.push(dup[i] + ' - ' + compo.layer(dup[i]).name);
}
alert (tr("Be careful not to assign twice the same layer\n\nLayers assigned twice:\n\n") + dupNames.join('\n')) ;
return false;
}

//verifier qu'il ne manque rien d'indispensable (mains)
var calquesManquants = [];
if (!tarsus) calquesManquants.push(tr("Tarsus"));
if (claws && !femur) calquesManquants.push(tr("Femur"));
if (claws && !tibia) calquesManquants.push(tr("Tibia"));

if (!femur && !tibia && !tarsus && !claws && !tip && !heel)	calquesManquants = [];

if (calquesManquants.length > 0) { alert (tr("Those layers are needed:\n\n") + calquesManquants.join('\n')); return false; }

//verifier si 3D
var tridi = false;
if (femur) if (femur.threeDLayer) tridi = true;
if (tibia) if (tibia.threeDLayer) tridi = true;
if (tarsus) if (tarsus.threeDLayer) tridi = true;
if (claws) if (claws.threeDLayer) tridi = true;
if (tip) if (tip.threeDLayer) tridi = true;
if (heel) if (heel.threeDLayer) tridi = true;


if (tridi) { alert (tr("The autorig does not work with 3D Layers")); return false; }

backLegDialog.femur = femur;
backLegDialog.tibia = tibia;
backLegDialog.tarsus = tarsus;
backLegDialog.claws = claws;
backLegDialog.tip = tip;
backLegDialog.heel = heel;


return true;
}

function backLegShow() {

var compo = app.project.activeItem;
if (!(compo instanceof CompItem)) return;

backLegDigiImage.visible = autorigDigitigradeButton.value;
backLegPlantiImage.visible = autorigPlantigradeButton.value;
backLegUnguImage.visible = autorigUngulateButton.value;
if (autorigDigitigradeButton.value)
{
backLegTipGroup.visible = true;
backLegHeelGroup.visible = false;
backLegNullsLabel.visible = true;
}
if (autorigPlantigradeButton.value)
{
backLegTipGroup.visible = true;
backLegHeelGroup.visible = true;
backLegNullsLabel.visible = true;
}
if (autorigUngulateButton.value)
{
backLegTipGroup.visible = false;
backLegHeelGroup.visible = false;
backLegNullsLabel.visible = false;
}

var searchPrefix = '';

if (backLegDialog.right) {
backLegTypeLabel.text = tr("Right leg");
textColor(backLegTypeLabel,col.trueRed);
backLegNext.show();
backLegPrev.show();
backLegOK.hide();
searchPrefix = tr("R_");
}
else if (backLegDialog.left) {
backLegTypeLabel.text = tr("Left leg");
textColor(backLegTypeLabel,col.trueGreen);
backLegNext.show();
backLegPrev.hide();
backLegOK.hide();
searchPrefix = tr("L_");
}
else {
backLegTypeLabel.hide();
backLegNext.hide();
backLegPrev.hide();
backLegOK.show();
}

backLegDialog.femur = null;
backLegDialog.tibia = null;
backLegDialog.tarsus = null;
backLegDialog.claws = null;
backLegDialog.tip = null;
backLegDialog.heel = null;

populateBackLeg(searchPrefix);

backLegDialog.show();
}

function backLegOKClicked() {

if (!getBackLegSelection()) return;

if (autorigDigitigradeButton.value)
{
//get the user selection of layers
app.beginUndoGroup(tr("Duik - Back Leg Autorig"));
Duik.autorig.vertebrate.digitigrade.backLeg(backLegDialog.femur,backLegDialog.tibia,backLegDialog.tarsus,backLegDialog.claws,backLegDialog.tip);
app.endUndoGroup();
}
else if (autorigPlantigradeButton.value)
{
app.beginUndoGroup(tr("Duik - Back Leg Autorig"));
Duik.autorig.vertebrate.plantigrade.backLeg(backLegDialog.femur,backLegDialog.tibia,backLegDialog.tarsus,backLegDialog.claws,backLegDialog.tip,backLegDialog.heel);
app.endUndoGroup();
}
else if (autorigUngulateButton.value)
{
//get the user selection of layers
app.beginUndoGroup(tr("Duik - Back Leg Autorig"));
Duik.autorig.vertebrate.ungulate.backLeg(backLegDialog.femur,backLegDialog.tibia,backLegDialog.tarsus,backLegDialog.claws);
app.endUndoGroup();
}

backLegDialog.hide();
}

function backLegNextClicked(){

if (!getBackLegSelection()) return;

if (backLegDialog.left)
{
backLegDialog.hide();
autorig.LBL.femur = backLegDialog.femur;
autorig.LBL.tibia = backLegDialog.tibia;
autorig.LBL.tarsus = backLegDialog.tarsus;
autorig.LBL.claws = backLegDialog.claws;
autorig.LBL.tip = backLegDialog.tip;
autorig.LBL.heel = backLegDialog.heel;
backLegDialog.left = false;
backLegDialog.right = true;
backLegShow();
}
else if (backLegDialog.right)
{
backLegDialog.hide();
autorig.RBL.femur = backLegDialog.femur;
autorig.RBL.tibia = backLegDialog.tibia;
autorig.RBL.tarsus = backLegDialog.tarsus;
autorig.RBL.claws = backLegDialog.claws;
autorig.RBL.tip = backLegDialog.tip;
autorig.RBL.heel = backLegDialog.heel;
frontLegDialog.right = false;
frontLegDialog.left = true;
frontLegShow();
}

}

function backLegPrevClicked(){
if (backLegDialog.right)
{
backLegDialog.hide();
backLegDialog.left = true;
backLegDialog.right = false;
backLegShow();
}
}

}

// SPINE
{
function populateSpine() {

var compo = app.project.activeItem;
if (!(compo instanceof CompItem)) return;

Duik.utils.checkNames();

//1 - parcourir tous les calques et les ranger

var layers = [];

//si rien de selectionne, on charge les calques de toute la compo
if (compo.selectedLayers.length == 0) layers = compo.layers;
else layers = compo.selectedLayers;

var head = Duik.utils.getLayerByNames(layers,[tr("head")]);
var hips = Duik.utils.getLayerByNames(layers,[tr("hips"),tr("pelvis"),tr("abdomen")]);
var spine = Duik.utils.getLayersByNames(layers,[tr("spine"),tr("torso"),tr("chest"),tr("thorax")]);
var neck = Duik.utils.getLayersByNames(layers,[tr("neck")]);

//get layer list
var layersList = Duik.utils.getLayersReadableList(layers);
layersList.unshift(tr("None"));

//ajouter les listes de calques
spineHeadButton.removeAll();
spineNeckFromButton.removeAll();
spineNeckToButton.removeAll();
spineSpineFromButton.removeAll();
spineSpineToButton.removeAll();
spineHipsButton.removeAll();

for (i = 0;i<layersList.length;i++) {
spineHeadButton.add('item',layersList[i]);
spineNeckFromButton.add('item',layersList[i]);
spineNeckToButton.add('item',layersList[i]);
spineSpineFromButton.add('item',layersList[i]);
spineSpineToButton.add('item',layersList[i]);
spineHipsButton.add('item',layersList[i]);
}

//preselectionner
if (head) spineHeadButton.selection = Duik.js.arrayIndexOf(layersList,head.index + ' - ' + head.name);
if (spine.length) {
if (hips) spine = Duik.utils.sortByDistance(spine,hips);
spineSpineFromButton.selection = Duik.js.arrayIndexOf(layersList,spine[spine.length-1].index + ' - ' + spine[spine.length-1].name);
spineSpineToButton.selection = Duik.js.arrayIndexOf(layersList,spine[0].index + ' - ' + spine[0].name);
}
if (neck.length) {
if (hips) neck = Duik.utils.sortByDistance(neck,hips);
else if (spine.length) neck = Duik.utils.sortByDistance(neck,spine[0]);
spineNeckFromButton.selection = Duik.js.arrayIndexOf(layersList,neck[neck.length-1].index + ' - ' + neck[neck.length-1].name);
spineNeckToButton.selection = Duik.js.arrayIndexOf(layersList,neck[0].index + ' - ' + neck[0].name);
}
if (hips) spineHipsButton.selection = Duik.js.arrayIndexOf(layersList,hips.index + ' - ' + hips.name);

spineDialog.layout.layout(true);
spineDialog.layout.resize();

}

function getSpineSelection() {
var compo = app.project.activeItem;
if (!(compo instanceof CompItem)) return false;

if (spineHeadButton.selection == null) spineHeadButton.selection = 0;
if (spineNeckFromButton.selection == null) spineNeckFromButton.selection = 0;
if (spineNeckToButton.selection == null) spineNeckToButton.selection = 0;
if (spineSpineFromButton.selection == null) spineSpineFromButton.selection = 0;
if (spineSpineToButton.selection == null) spineSpineToButton.selection = 0;
if (spineHipsButton.selection == null) spineHipsButton.selection = 0;

spineHeadButton.selection.index == 0 ? head = null : head = compo.layers[spineHeadButton.selection.text.split(' - ')[0]];
var neckFirst = null;
var neckLast = null;
spineNeckFromButton.selection.index == 0 ? neckFirst = null : neckFirst = compo.layers[spineNeckFromButton.selection.text.split(' - ')[0]];
spineNeckToButton.selection.index == 0 ? neckLast = null : neckLast = compo.layers[spineNeckToButton.selection.text.split(' - ')[0]];
var spineFirst = null;
var spineLast = null;
spineSpineFromButton.selection.index == 0 ? spineFirst = null : spineFirst = compo.layers[spineSpineFromButton.selection.text.split(' - ')[0]];
spineSpineToButton.selection.index == 0 ? spineLast = null : spineLast = compo.layers[spineSpineToButton.selection.text.split(' - ')[0]];
spineHipsButton.selection.index == 0 ? hips = null : hips = compo.layers[spineHipsButton.selection.text.split(' - ')[0]];

//neck array
var neck = [];
if (neckFirst && neckLast)
{
if (neckFirst.index <= neckLast.index) for (var i = neckFirst.index; i <= neckLast.index ; i++)
{
neck.push(compo.layers[i]);
}
else for (var i = neckFirst.index; i >= neckLast.index ; i--)
{
neck.push(compo.layers[i]);
}
}
else if (neckFirst)
{
neck = [compo.layers[neckFirst]];
}
else if (neckLast)
{
neck = [compo.layers[neckLast]];
}

//spine array
spine = [];
if (spineFirst && spineLast)
{
if (spineFirst.index <= spineLast.index) for (var i = spineFirst.index; i <= spineLast.index ; i++)
{
spine.push(compo.layers[i]);
}
else for (var i = spineFirst.index; i >= spineLast.index ; i--)
{
spine.push(compo.layers[i]);
}
}
else if (spineFirst)
{
spine = [compo.layers[spineFirst]];
}
else if (spineLast)
{
spine = [compo.layers[spineLast]];
}


//verifier qu'il n'y a pas deux calques assignes au meme element
var indexUtilises = [];
if (head) indexUtilises.push(head.index);
if (neck.length) for (var i = 0 ; i < neck.length;i++) indexUtilises.push(neck[i].index);
if (spine.length) for (var i = 0 ; i < spine.length;i++) indexUtilises.push(spine[i].index);
if (hips) indexUtilises.push(hips.index);

//verif duplicates de l'array
if (Duik.js.arrayHasDuplicates(indexUtilises)) {
var dup = Duik.js.arrayGetDuplicates(indexUtilises);
var dupNames = [];
for (var i = 0 ; i< dup.length;i++)
{
dupNames.push(dup[i] + ' - ' + compo.layer(dup[i]).name);
}
alert (tr("Be careful not to assign twice the same layer\n\nLayers assigned twice:\n\n") + dupNames.join('\n')) ;
return false;
}

//verifier qu'il ne manque rien d'indispensable (tete, et spine ou hips)
var calquesManquants = [];
if (!head) calquesManquants.push(tr("Head"));
if (!spine.length && !hips) calquesManquants.push(tr("Spine and/or Hips"));

if (!head && !neck.length && !spine.length && !hips) calquesManquants = [];

if (calquesManquants.length > 0) { alert (tr("Those layers are needed:\n\n") + calquesManquants.join('\n')); return false; }

//verifier si 3D
var tridi = false;
if (head) if (head.threeDLayer) tridi = true;
if (hips) if (hips.threeDLayer) tridi = true;
if (neck.length) for (var i = 0;i< neck.length;i++) if (neck[i].threeDLayer) tridi = true;
if (spine.length) for (var i = 0;i< spine.length;i++) if (spine[i].threeDLayer) tridi = true;

if (tridi) { alert (tr("The autorig does not work with 3D Layers")); return false; }

spineDialog.head = head;
spineDialog.hips = hips;
spineDialog.spine = spine;
spineDialog.neck = neck;

return true;
}

function spineShow() {

var compo = app.project.activeItem;
if (!(compo instanceof CompItem)) return;

if (spineDialog.fullCharacter) {
spineNext.show();
spinePrev.show();
spineOK.hide();
}
else {
spineNext.hide();
spinePrev.hide();
spineOK.show();
}

spineDialog.head = null;
spineDialog.hips = null;
spineDialog.spine = null;
spineDialog.neck = null;

populateSpine();

spineDialog.show();

}

function spineOKClicked() {
if (getSpineSelection())
{
app.beginUndoGroup(tr("Duik - Spine Autorig"));
Duik.autorig.vertebrate.spine(spineDialog.hips,spineDialog.spine,spineDialog.neck,spineDialog.head);
app.endUndoGroup();
spineDialog.hide();
}
}

function spineNextClicked() {
if (getSpineSelection())
{
spineDialog.hide();
autorig.spine.head = spineDialog.head;
autorig.spine.spine = spineDialog.spine;
autorig.spine.neck = spineDialog.neck;
autorig.spine.hips = spineDialog.hips;
tailDialog.fullCharacter = true;
tailShow();
}
}

function spinePrevClicked() {
spineDialog.hide();
frontLegDialog.left = false;
frontLegDialog.right = true;
frontLegShow();
}

}

// TAIL
{
function populateTail() {

var compo = app.project.activeItem;
if (!(compo instanceof CompItem)) return;

Duik.utils.checkNames();

//1 - parcourir tous les calques et les ranger

var layers = [];

//si rien de selectionne, on charge les calques de toute la compo
if (compo.selectedLayers.length == 0) layers = compo.layers;
else layers = compo.selectedLayers;

var hips = Duik.utils.getLayerByNames(layers,[tr("hips"),tr("pelvis"),tr("abdomen")]);
var tail = Duik.utils.getLayersByNames(layers,[tr("tail")]);

//get layer list
var layersList = Duik.utils.getLayersReadableList(layers);
layersList.unshift(tr("None"));

//ajouter les listes de calques
tailHipsButton.removeAll();
tailTailFromButton.removeAll();
tailTailToButton.removeAll();

for (i = 0;i<layersList.length;i++) {
tailHipsButton.add('item',layersList[i]);
tailTailFromButton.add('item',layersList[i]);
tailTailToButton.add('item',layersList[i]);
}

//preselectionner
if (hips) tailHipsButton.selection = Duik.js.arrayIndexOf(layersList,hips.index + ' - ' + hips.name);
if (tail.length) {
tail = Duik.utils.sortByDistance(tail,hips);
tailTailFromButton.selection = Duik.js.arrayIndexOf(layersList,tail[0].index + ' - ' + tail[0].name);
tailTailToButton.selection = Duik.js.arrayIndexOf(layersList,tail[tail.length-1].index + ' - ' + tail[tail.length-1].name);
}

}

function getTailSelection() {
var compo = app.project.activeItem;
if (!(compo instanceof CompItem)) return false;

if (tailHipsButton.selection == null) tailHipsButton.selection = 0;
if (tailTailFromButton.selection == null) tailTailFromButton.selection = 0;
if (tailTailToButton.selection == null) tailTailToButton.selection = 0;

tailHipsButton.selection.index == 0 ? hips = null : hips = compo.layers[tailHipsButton.selection.text.split(' - ')[0]];
var tailFirst = null;
var tailLast = null;
tailTailFromButton.selection.index == 0 ? tailFirst = null : tailFirst = compo.layers[tailTailFromButton.selection.text.split(' - ')[0]];
tailTailToButton.selection.index == 0 ? tailLast = null : tailLast = compo.layers[tailTailToButton.selection.text.split(' - ')[0]];

//tail array
tail = [];
if (tailFirst && tailLast)
{
if (tailFirst.index <= tailLast.index) for (var i = tailFirst.index; i <= tailLast.index ; i++)
{
tail.push(compo.layers[i]);
}
else for (var i = tailFirst.index; i >= tailLast.index ; i--)
{
tail.push(compo.layers[i]);
}
}
else if (tailFirst)
{
tail = [compo.layers[tailFirst]];
}
else if (tailLast)
{
tail = [compo.layers[tailLast]];
}


//verifier qu'il n'y a pas deux calques assignes au meme element
var indexUtilises = [];
if (hips) indexUtilises.push(hips.index);
if (tail.length) for (var i =0;i<tail.length;i++) indexUtilises.push(tail[i].index);

//verif duplicates de l'array
if (Duik.js.arrayHasDuplicates(indexUtilises)) {
var dup = Duik.js.arrayGetDuplicates(indexUtilises);
var dupNames = [];
for (var i = 0 ; i< dup.length;i++)
{
dupNames.push(dup[i] + ' - ' + compo.layer(dup[i]).name);
}
alert (tr("Be careful not to assign twice the same layer\n\nLayers assigned twice:\n\n") + dupNames.join('\n')) ;
return false;
}

//verifier qu'il ne manque rien d'indispensable (tete, et spine ou hips)
var calquesManquants = [];
if (!hips) calquesManquants.push(tr("Hips"));
if (!tail.length) calquesManquants.push(tr("Tail(s)"));

if (!hips && !tail.length) calquesManquants = [];

if (calquesManquants.length > 0) { alert (tr("Those layers are needed:\n\n") + calquesManquants.join('\n')); return false; }

//verifier si 3D
var tridi = false;
if (hips) if (hips.threeDLayer) tridi = true;
if (tail.length) for (var i=0;i<tail.length;i++) if (tail[i].threeDLayer) tridi = true;

if (tridi) { alert (tr("The autorig does not work with 3D Layers")); return false; }

tailDialog.tail = tail;
tailDialog.hips = hips;


return true;
}

function tailShow() {
var compo = app.project.activeItem;
if (!(compo instanceof CompItem)) return;

if (tailDialog.fullCharacter) {
tailPrev.show();
}
else {
tailPrev.hide();
}


tailDialog.tail = null;
tailDialog.hips = null;

populateTail();

tailDialog.layout.layout(true);
tailDialog.layout.resize();
tailDialog.show();

}

function tailOKClicked() {
if (tailDialog.fullCharacter)
{
if (getTailSelection())
{
tailDialog.hide();
autorig.tail = {};
autorig.tail.hips = tailDialog.hips;
autorig.tail.tail = tailDialog.tail;
launchAutorig();
}
}
else
{
//get the user selection of layers
if (getTailSelection())
{
app.beginUndoGroup(tr("Duik - Tail Autorig"));
Duik.autorig.vertebrate.tail(tailDialog.hips,tailDialog.tail,tailCubicButton.value);
app.endUndoGroup();
tailDialog.hide();
}
}
}

function tailPrevClicked() {
tailDialog.hide();
spineDialog.fullCharacter = true;
spineShow();
}
}

function launchAutorig() {

app.beginUndoGroup(tr("Duik - Autorig"));

//get autorig tools
var rigging;

if (autorigPlantigradeButton.value) rigging = Duik.autorig.vertebrate.plantigrade;
else if (autorigDigitigradeButton.value) rigging = Duik.autorig.vertebrate.digitigrade;
else if (autorigUngulateButton.value) rigging = Duik.autorig.vertebrate.ungulate;

//parent legs
if (autorig.spine.hips)
{
if (autorig.LBL.femur) autorig.LBL.femur.parent = autorig.spine.hips;
else if (autorig.LBL.tibia) autorig.LBL.femur.tibia = autorig.spine.hips;
else if (autorig.LBL.tarsus) autorig.LBL.femur.tarsus = autorig.spine.hips;

if (autorig.RBL.femur) autorig.RBL.femur.parent = autorig.spine.hips;
else if (autorig.RBL.tibia) autorig.RBL.femur.tibia = autorig.spine.hips;
else if (autorig.RBL.tarsus) autorig.RBL.femur.tarsus = autorig.spine.hips;
}
else if (autorig.spine.spine)
{
if (autorig.spine.spine.length)
{
if (autorig.LBL.femur) autorig.LBL.femur.parent = autorig.spine.spine[autorig.spine.spine.length-1];
else if (autorig.LBL.tibia) autorig.LBL.femur.tibia = autorig.spine.spine[autorig.spine.spine.length-1];
else if (autorig.LBL.tarsus) autorig.LBL.femur.tarsus = autorig.spine.spine[autorig.spine.spine.length-1];

if (autorig.RBL.femur) autorig.RBL.femur.parent = autorig.spine.spine[autorig.spine.spine.length-1];
else if (autorig.RBL.tibia) autorig.RBL.femur.tibia = autorig.spine.spine[autorig.spine.spine.length-1];
else if (autorig.RBL.tarsus) autorig.RBL.femur.tarsus = autorig.spine.spine[autorig.spine.spine.length-1];
}
}

//left leg
var leftLegCtrl = rigging.backLeg(autorig.LBL.femur,autorig.LBL.tibia,autorig.LBL.tarsus,autorig.LBL.claws,autorig.LBL.tip,autorig.LBL.heel);

//right leg
var rightLegCtrl = rigging.backLeg(autorig.RBL.femur,autorig.RBL.tibia,autorig.RBL.tarsus,autorig.RBL.claws,autorig.RBL.tip,autorig.RBL.heel);

//parent arms
if (autorig.spine.spine)
{
if (autorig.spine.spine.length)
{
if (autorig.LFL.shoulder) autorig.LFL.shoulder.parent = autorig.spine.spine[0];
else if (autorig.LFL.humerus) autorig.LFL.humerus.parent = autorig.spine.spine[0];
else if (autorig.LFL.radius) autorig.LFL.radius.parent = autorig.spine.spine[0];
else if (autorig.LFL.carpus) autorig.LFL.carpus.parent = autorig.spine.spine[0];

if (autorig.RFL.shoulder) autorig.RFL.shoulder.parent = autorig.spine.spine[0];
else if (autorig.RFL.humerus) autorig.RFL.humerus.parent = autorig.spine.spine[0];
else if (autorig.RFL.radius) autorig.RFL.radius.parent = autorig.spine.spine[0];
else if (autorig.RFL.carpus) autorig.RFL.carpus.parent = autorig.spine.spine[0];
}
else if (autorig.spine.hips)
{
if (autorig.LFL.shoulder) autorig.LFL.shoulder.parent = autorig.spine.hips;
else if (autorig.LFL.humerus) autorig.LFL.humerus.parent = autorig.spine.hips;
else if (autorig.LFL.radius) autorig.LFL.radius.parent = autorig.spine.hips;
else if (autorig.LFL.carpus) autorig.LFL.carpus.parent = autorig.spine.hips;

if (autorig.RFL.shoulder) autorig.RFL.shoulder.parent = autorig.spine.hips;
else if (autorig.RFL.humerus) autorig.RFL.humerus.parent = autorig.spine.hips;
else if (autorig.RFL.radius) autorig.RFL.radius.parent = autorig.spine.hips;
else if (autorig.RFL.carpus) autorig.RFL.carpus.parent = autorig.spine.hips;
}
}

//left arm
var leftArmCtrl = rigging.frontLeg(autorig.LFL.shoulder,autorig.LFL.humerus,autorig.LFL.radius,autorig.LFL.carpus,autorig.LFL.claws,autorig.LFL.tip,autorig.LFL.heel);

//right arm
var rightArmCtrl = rigging.frontLeg(autorig.RFL.shoulder,autorig.RFL.humerus,autorig.RFL.radius,autorig.RFL.carpus,autorig.RFL.claws,autorig.RFL.tip,autorig.RFL.heel);

//spine
var spineCtrls = rigging.spine(autorig.spine.hips,autorig.spine.spine,autorig.spine.neck,autorig.spine.head);

//tail
var tailCtrls = rigging.tail(autorig.tail.hips,autorig.tail.tail,tailCubicButton.value);

//parent tail ctrls
if (tailCtrls && spineCtrls)
{
if (tailCtrls.length && spineCtrls.length)
{
for (var i=0;i<tailCtrls.length;i++)
{
tailCtrls[i].layer.parent = spineCtrls[0].layer;
}
}
}

//clean
autorig.RFL.shoulder = null;
autorig.RFL.humerus = null;
autorig.RFL.radius = null;
autorig.RFL.carpus = null;
autorig.RFL.claws = null;
autorig.RFL.tip = null;
autorig.RFL.heel = null;
autorig.LFL.shoulder = null;
autorig.LFL.humerus = null;
autorig.LFL.radius = null;
autorig.LFL.carpus = null;
autorig.LFL.claws = null;
autorig.LFL.tip = null;
autorig.LFL.heel = null;
autorig.RBL.femur = null;
autorig.RBL.tibia = null;
autorig.RBL.tarsus = null;
autorig.RBL.claws = null;
autorig.RBL.tip = null;
autorig.RBL.heel = null;
autorig.LBL.femur = null;
autorig.LBL.tibia = null;
autorig.LBL.tarsus = null;
autorig.LBL.claws = null;
autorig.LBL.tip = null;
autorig.LBL.heel = null;
autorig.spine.head = null;
autorig.spine.spine = null;
autorig.spine.neck = null;
autorig.spine.hips = null;
autorig.tail.hips = null;
autorig.tail.tail = null;

delete rigging;

app.endUndoGroup();
}

}

//========== RIGGING ================================

//FONCTION QUAND ON CLIQUE SUR CREER IK
function ik(){

var calques = getCurrentLayers()
if (!calques) return null;

if (calques.length < 2 || calques.length > 5)
{
alert(tr("Select the bones and the controller before creating IK"));
return;
}

panoik.hide();
ikPanel.show();

//prepIK
app.beginUndoGroup(tr("Duik - prepare IK"));
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
}
else if (ikRig.type == 3 && ikRig.goal != null)
{
ikType1Group.hide();
ikType2Group.hide();
ikType3Group.hide();
ikType4Group.show();
ik3DGroup.hide();
}

ikCreateButton.onClick = function() {
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
app.beginUndoGroup(tr("Duik - IK"));
ikRig.create();
app.endUndoGroup();
ikPanel.hide();
panoik.show();
}
}

//BEZIER IK
function bikCreateButtonClicked() {
var comp = getCurrentComp();
if (!comp) return null;

if (comp.selectedLayers.length < 3)
{
alert(tr("Select the bones and the controller before creating IK"));
return;
}
app.beginUndoGroup(tr("Duik - Bezier IK"));
var numCtrls = 1;
if (bikCubicButton.value) numCtrls = 2;
Duik.bezierIK(comp.selectedLayers,numCtrls);
app.endUndoGroup();
bezierIkPanel.hide();
panoik.show();
}

//FONCTION QUAND ON CLIQUE SUR GOAL
function pregoal(){
var layers = getCurrentLayers()
if (!layers) return null;
if (layers.length == 1) {
//groupe d'annulation
app.beginUndoGroup(tr("Duik - IK Goal"));
Duik.goal(layers[0],undefined);
//groupe d'annulation
app.endUndoGroup();
}
else if (layers.length == 2) {
//groupe d'annulation
app.beginUndoGroup(tr("Duik - IK Goal"));
Duik.goal(layers[0],layers[1]);
//groupe d'annulation
app.endUndoGroup();
}
else{alert(tr("Select the layer before applying IK Goal"),tr("Attention"),true);}
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
//  debut de groupe d'annulation
app.beginUndoGroup(tr("Duik - ") + tr("Controllers"));
Duik.addControllers(app.project.activeItem.selectedLayers);
app.endUndoGroup();
}
}
function controleur(){
var comp = getCurrentComp();
if (!comp) return null;
//  debut de groupe d'annulation
app.beginUndoGroup(tr("Duik - ") + tr("Controllers"));

var newControllers = Duik.addControllers(app.project.activeItem.selectedLayers,ctrlAutoLockButton.value,ctrlRotationButton.value,ctrlXPositionButton.value,ctrlYPositionButton.value,ctrlScaleButton.value);
if (ctrlShapeList.selection == 1)
{
for (var i=0;i<newControllers.length;i++)
{
newControllers[i].arc = true;
newControllers[i].update();
}
}
else if (ctrlShapeList.selection == 2)
{
for (var i=0;i<newControllers.length;i++)
{
newControllers[i].eye = true;
newControllers[i].update();
}
}
else if (ctrlShapeList.selection == 3)
{
for (var i=0;i<newControllers.length;i++)
{
newControllers[i].camera = true;
newControllers[i].update();
}
}

//fin du groupe d'annulation
app.endUndoGroup();

}
function ctrlUnlockButtonClicked() {
var controllers = Duik.utils.getControllers(app.project.activeItem.selectedLayers);
app.beginUndoGroup(tr("Duik - Unlock Controllers"));
for (var i = 0 ; i < controllers.length ; i++)
{
controllers[i].unlock();
}
app.endUndoGroup();
}
function ctrlLockButtonClicked() {
var controllers = Duik.utils.getControllers(app.project.activeItem.selectedLayers);
app.beginUndoGroup(tr("Duik - Lock Controllers"));
for (var i = 0 ; i < controllers.length ; i++)
{
controllers[i].lock();
}
app.endUndoGroup();
}
function ctrlUpdateButtonClicked() {
var comp = getCurrentComp();
if (!comp) return;
var controllers = Duik.utils.getControllers(comp.selectedLayers);
app.beginUndoGroup(tr("Duik - Update Controllers"));
for (var i = 0 ; i < controllers.length ; i++)
{
controllers[i].type = Duik.layerTypes.VECTOR;

controllers[i].color = Duik.settings.controllerColor;

controllers[i].xPosition = ctrlXPositionButton.value;
controllers[i].yPosition = ctrlYPositionButton.value;
controllers[i].rotation = ctrlRotationButton.value;
controllers[i].scale = ctrlScaleButton.value;
controllers[i].arc = ctrlShapeList.selection == 1;
controllers[i].eye = ctrlShapeList.selection == 2;
controllers[i].camera = ctrlShapeList.selection == 3;

if (ctrlSizeAutoList.selection.index == 3) controllers[i].size = Duik.settings.controllerSize;
else controllers[i].size = 0;

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
app.beginUndoGroup(tr("Duik - Unhide Controllers"));
for (var i = 0 ; i < controllers.length ; i++)
{
controllers[i].layer.enabled = true;
}
app.endUndoGroup();
}
function ctrlHideButtonClicked(){
var controllers = Duik.utils.getControllers(app.project.activeItem.selectedLayers);
app.beginUndoGroup(tr("Duik - Unhide Controllers"));
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

app.beginUndoGroup(tr("Reset Ctrl. Transform."));

for (var i=0;i<ctrls.length;i++)
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

var comp = getCurrentComp();
if (!comp) return;


//  debut de groupe d'annulation
app.beginUndoGroup(tr("Duik - Bone"));

//le(s) calque(s) selectionne(s)
var calques = comp.selectedLayers ;
if (calques.length ==0) { alert(tr("Select a pin to create a bone"),tr("Attention")); return; }

try { Duik.addBones(calques); }
catch(e) { alert(e); }

//fin du groupe d'annulation
app.endUndoGroup();


}

//FONCTION DU BOUTON POUR MESURER
function mesure() {

resultat = mesurer();
if (resultat == 0) {
resultattexte.text = tr("The layers are at the same place.");
}
else if (resultat/resultat == 1) {
resultattexte.text = tr("Distance = \n") + resultat + tr(" pixels") + '.';
}

}

//FONCTION ZERO
function zero(){

var layers = getCurrentLayers()
if (!layers) return null;



//  debut de groupe d'annulation
app.beginUndoGroup(tr("Duik - Zero"));

Duik.addZeros(layers);

//  fin de groupe d'annulation
app.endUndoGroup();

}

//FONCTION RENOMMER
function rename() {

if (renameLayersButton.value)
{
var layers = getCurrentLayers()
if (!layers) return null;

var prefixe = '';
prefixtexte.value ? prefixe = prefix.text : prefixe = '';
var suffixe = '';
suffixtexte.value ? suffixe = suffix.text : suffixe = '';

app.beginUndoGroup(tr("Duik - Rename"));

for (var i=0;i<layers.length;i++)
{
//keeping old name
var oldName = layers[i].name;
var newName = '';
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

Duik.utils.renameLayer(layers[i],newName,renameInExpressionsButton.value,renameInExpressionsCurrentCompButton.value);
}

renameRemFirstDValue.text = '0';
renameRemLastDValue.text = '0';

app.endUndoGroup();

}
else if (renamePinsButton.value)
{
var prefixe = '';
prefixtexte.value ? prefixe = prefix.text : prefixe = '';
var suffixe = '';
suffixtexte.value ? suffixe = suffix.text : suffixe = '';

app.beginUndoGroup(tr("Duik - Rename"));

var layers = getCurrentLayers()
if (!layers) return null;

var num = parseInt(numero.text);

for (var i=0;i<layers.length;i++) {
//chercher les puppet pins
// les proprietes selectionnees
var props = layers[i].selectedProperties;
var coins = [];
//lister les puppet pins
if (props.length > 0)
{
for (var j=0;j<props.length;j++)
{
if (props[j].matchName == 'ADBE FreePin3 PosPin Atom') coins.push(props[j]);
}
}
if (coins.length == 0) coins = Duik.utils.getPuppetPins(layers[i]('Effects'));
if (coins.length == 0) continue;
//rename
for (var j = 0;j<coins.length;j++)
{
//keeping old name
var oldName = coins[j].name;
var newName = '';
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

renameRemFirstDValue.text = '0';
renameRemLastDValue.text = '0';

app.endUndoGroup();
app.endSuppressDialogs(false);
}
else if (renameItemsButton.value)
{
var prefixe = '';
prefixtexte.value ? prefixe = prefix.text : prefixe = '';
var suffixe = '';
suffixtexte.value ? suffixe = suffix.text : suffixe = '';

app.beginUndoGroup(tr("Duik - Rename"));

var items = getCurrentItems()
if (!items) return null;

for (var i=0;i<items.length;i++) {
//keeping old name
var oldName = items[i].name;
var newName = '';
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

renameRemFirstDValue.text = '0';
renameRemLastDValue.text = '0';

app.endUndoGroup();
}
}

//FONCTION ROT MORPH
function rotmorph()
{
//Prendre l'effet
var effet = getCurrentProp(true);
if (!effet) return;

//  debut de groupe d'annulation
app.beginUndoGroup(tr("Duik - Rotation Morph"));

Duik.rotationMorph(app.project.activeItem.selectedLayers[0],effet);

app.endUndoGroup();
}

//SEARCH AND REPLACE
function replaceInExpr()
{
if (rieOldEdit.text == rieNewEdit.text) return;

if (rieExpressionsButton.value)
{
if (rieCurrentCompButton.value)
{
if (rieAllLayersButton.value)
{
var layers = getLayers();
if (!layers) return;
app.beginUndoGroup(tr("Duik - Replace in Expressions"));
Duik.utils.replaceInLayersExpressions(layers,rieOldEdit.text,rieNewEdit.text,rieCaseSensitive.value);
app.endUndoGroup();
}
else
{
var layers = getCurrentLayers();
if (!layers) return;
app.beginUndoGroup(tr("Duik - Replace in Expressions"));
Duik.utils.replaceInLayersExpressions(layers,rieOldEdit.text,rieNewEdit.text,rieCaseSensitive.value);
app.endUndoGroup();
}
}
else
{
for(var i = 1; i<=app.project.items.length ; i++)
{
app.beginUndoGroup(tr("Duik - Replace in Expressions"));
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
layers = getLayers();
}
else
{
layers = getCurrentLayers();
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
if (!layers) return;
if (layers.length == 0) return;

//go!
app.beginUndoGroup(tr("Duik - Search and replace"));
for(var i = 0 ; i < layers.length ; i++)
{
var l = layers[i];
var oldName = l.name;
var newName = Duik.js.replaceAll(l.name,rieOldEdit.text,rieNewEdit.text,rieCaseSensitive.value);
Duik.utils.renameLayer(l,newName,rieUpdateExpressionsButton.value,rieExpressionsCurrentCompButton.value);
}
app.endUndoGroup();
}
else if (rieItemsButton.value)
{
var items = [];
if (rieItemSelectedButton.value)
{
items = getCurrentItems();
}
else
{
items = Duik.utils.convertCollectionToArray(app.project.items);
}
if (!items) return;
if (items.length == 0 ) return;

app.beginUndoGroup(tr("Duik - Search and Replace"));
for (var i = 0 ; i < items.length ; i++)
{
var item = items[i];
var oldName = item.name;
var newName = oldName;
if ((item instanceof CompItem && rieCompItemButton.value) || (item instanceof FootageItem && rieFootageItemButton.value) || (item instanceof FolderItem && rieFolderItemButton.value))
{
newName = Duik.js.replaceAll(newName,rieOldEdit.text,rieNewEdit.text,rieCaseSensitive.value);
Duik.utils.renameItem(item,newName,rieUpdateExpressionsButton.value)
}
}
app.endUndoGroup();
}
}

//LOCK PROPERTY
function lockButtonClicked() {
//Prendre l'effet
var effet = getCurrentProp(true);
if (!effet) return;

//  debut de groupe d'annulation
app.beginUndoGroup(tr("Duik - Lock"));


Duik.lockProperty(effet);

app.endUndoGroup();
}

//LIST
function listButtonClicked() {
var prop = getCurrentProp(true);
if (!prop) return;

//  debut de groupe d'annulation
app.beginUndoGroup(tr("Duik - List"));
Duik.list(prop);
app.endUndoGroup();
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
irRigButton.add('item',i + ' ' + app.project.item(i).name);
}
}
}
function irOKButtonClicked(){
if (irRigButton.selection == null) return;
var comp = getCurrentComp();
if (!comp) return;
if (irNameText.text == '') alert(tr("You must specify a (unique) name for this instance of the rig"));

irPanel.hide();
panointerpo.show();

//gets the rig comp
var index = parseInt(irRigButton.selection.text.substring(0,irRigButton.selection.text.indexOf(' ')));

app.beginUndoGroup(tr("Import rig: ") + irNameText.text);
Duik.importRigInComp(app.project.activeItem,app.project.item(index),irNameText.text);
app.endUndoGroup();
}

function irDuplicateButtonClicked(){
if (irRigButton.selection == null) return;
if (irNameText.text == '') alert(tr("You must specify a (unique) name for this instance of the rig"));

irPanel.hide();
panointerpo.show();

//gets the rig comp
var index = parseInt(irRigButton.selection.text.substring(0,irRigButton.selection.text.indexOf(' ')));

app.beginUndoGroup(tr("Duplicate rig: ") + irNameText.text);
Duik.duplicateRig(app.project.item(index),irNameText.text);
app.endUndoGroup();

}

//FONCTION WIGGLE OK
function wiggleOKButtonClicked(){

//verifions qu'il n'y a qu'un calque selectionne
if (app.project.activeItem.selectedLayers[0].selectedProperties.length > 0)
{

//  debut de groupe d'annulation
app.beginUndoGroup(tr("Duik - Wiggle"));

//le calque
var calque = app.project.activeItem.selectedLayers[0];
//la prop
var prop = calque.selectedProperties.pop();
Duik.wiggle(calque,prop,wiggleSeparate.value);

//fin du groupe d'annulation
app.endUndoGroup();

} else { alert(tr("Select the property where to apply the \"wiggle\" function")); }
}

//FONCTION WIGGLE
function wiggle(){
//regarder le nombre d'axes dans la propriete selectionnee
var prop =  app.project.activeItem.selectedLayers[0].selectedProperties[app.project.activeItem.selectedLayers[0].selectedProperties.length-1];
if (prop == undefined) return;
var dim = prop.propertyValueType ;

app.beginUndoGroup(tr("Duik - Wiggle"));

if (dim == PropertyValueType.ThreeD_SPATIAL || dim == PropertyValueType.ThreeD || dim == PropertyValueType.TwoD_SPATIAL || dim == PropertyValueType.TwoD)
{
panoanimation.hide();
wigglePanel.show();
}
else
{
Duik.wiggle(app.project.activeItem.selectedLayers[0],prop);
}

app.endUndoGroup();
}

//FONCTION QUI MESURE LE RAYON D'UNE ROUE
function mesurer() {

//verifions qu'il y a deux calques selectionnes
if (app.project.activeItem.selectedLayers.length == 2){

var dist = Duik.utils.getDistance(app.project.activeItem.selectedLayers[0],app.project.activeItem.selectedLayers[1]);
rayonbouton.text = dist;
return dist;

} else { alert(tr("Select two layers to measure distance from one layer to another!"),tr("Attention"),true); }

}

//FONCTION QUI CREE UNE ROUE
function roue() {
OA = parseFloat(rayonbouton.text);

if (OA != 0 && OA != NaN) {

//  debut de groupe d'annulation
app.beginUndoGroup(tr("Wheel"));

Duik.wheel(app.project.activeItem.selectedLayers[0],OA,roueC.value);

//  fin de groupe d'annulation
app.endUndoGroup();

} else { alert (tr("Invalid Radius"),tr("What is the radius of the wheel?"),true); }
}

//FONCTION LENTILLE
function lentille() {

//les calques selectionnes :
var calques = app.project.activeItem.selectedLayers;

//verifions qu'il y a plusieurs calques selectionnes
if (calques.length > 1){

//  debut de groupe d'annulation
app.beginUndoGroup(tr("Lens Controller"));

Duik.lensFlare(calques);


//fin du groupe d'annulation
app.endUndoGroup();

} else {
alert(tr("Select all the layers of the lens flare, beginning by the center"));
}


}

//FONCTION LIEN DE DISTANCE
function distanceLink() {

//verifions qu'il n'y a bien que deux calques de selectionnes
if (app.project.activeItem.selectedLayers.length == 2) {


//recuperer le nom du calque de reference
var calqueRef = app.project.activeItem.selectedLayers[1];

//recuperer le calque de destination
var calque = app.project.activeItem.selectedLayers[0];

//Prendre l'effet
var effet = app.project.activeItem.selectedLayers[0].selectedProperties.pop();

//  debut de groupe d'annulation
app.beginUndoGroup(tr("Distance Link"));

Duik.distanceLink(calque,effet,calqueRef);

//fin du groupe d'annulation
app.endUndoGroup();

}
}

//Spring
function boutonspringClicked() {
var comp = app.project.activeItem;
if (!(comp instanceof CompItem)) return;
if (!comp.selectedLayers.length) return;
var layer = comp.selectedLayers[0];
var prop = layer.selectedProperties.pop();
if (prop.matchName != 'ADBE Position')
{
//  debut de groupe d'annulation
app.beginUndoGroup(tr("Spring"));

Duik.spring(prop);

//fin du groupe d'annulation
app.endUndoGroup();
}
else
{
panoanimation.hide();
springPanel.show();
}
}

function springok() {

//  debut de groupe d'annulation
app.beginUndoGroup(tr("Spring"));

var ef = app.project.activeItem.selectedLayers[0].selectedProperties.pop();
Duik.spring(ef,!boutonLightSpring.value);

//fin du groupe d'annulation
app.endUndoGroup();

}

//FONCTION OSCILLATION
function oscillation() {
// Verifions si il n'y a qu'un calque selectionne
if (app.project.activeItem.selectedLayers.length == 1){

var calque = app.project.activeItem.selectedLayers[0];

if (calque.selectedProperties.length != 0){

//Prendre l'effet
var effet = app.project.activeItem.selectedLayers[0].selectedProperties.pop();
//on verifie sin on peut mettre une expression, sinon inutile de continuer
if(effet.canSetExpression) {

//  debut de groupe d'annulation
app.beginUndoGroup(tr("Oscillation"));

Duik.swing(calque,effet);
//fin du groupe d'annulation
app.endUndoGroup();

}else{alert(tr("Cannot create expression on this effect"),tr("Impossible spring"));}
}else{alert(tr("Select the effect where you want to create the spring"),tr("No effect selected"));}
}else{alert(tr("Select the effect where you want to create the spring"),tr("No layer selected"));}


}

//FONCTIONS EXPOSITION
function exposureAnalyzeButtonClicked() {
var comp = app.project.activeItem;
if (!(comp instanceof CompItem)) return;
var reLayer = /(\d+) - /i;
var ltest = exposureLayerList.selection.text.match(reLayer);
var layer = comp.layer(parseInt(ltest[1]));
var expo = Duik.utils.getFootageExposure(layer,parseFloat(exposureDetectionPrecisionEdit.text),parseFloat(exposureToleranceEdit.text),exposureRButton.value,exposureGButton.value,exposureBButton.value,exposureAButton.value);
exposureAnalyzeLabel.text = tr("Analyzed") + ' - ' + layer.name;
}

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

function exposureLayerRefreshButtonClicked() {
var comp = app.project.activeItem;
if (!(comp instanceof CompItem)) return;
exposureLayerList.removeAll();
for (var i = 1; i <= comp.numLayers;i++)
{
exposureLayerList.add('item',comp.layer(i).index + ' - ' + comp.layer(i).name);
}
}

function exposureOKButtonClicked() {
if (app.project.activeItem == null) return;
if (app.project.activeItem.selectedLayers.length == 0) return;

app.beginUndoGroup(tr("Duik Auto-Exposure"));
if (adaptativeExposureButton.value)
{
Duik.adaptativeExposure(app.project.activeItem.selectedLayers,parseInt(precisionEdit.text),parseInt(lowerExposureEdit.text),parseInt(upperExposureEdit.text),exposureSyncButton.value,exposureSyncLayerButton.value);
}
else if (evenExposureButton.value)
{
var layer = app.project.activeItem.selectedLayers[0];
var effet = layer.selectedProperties.pop();
Duik.fixedExposure(layer,effet);
}
else
{
Duik.setExposure(app.project.activeItem.selectedLayers);
}
app.endUndoGroup();

}

//FONCTION PATH FOLLOW
function pathFollow() {
// Verifions si il n'y a qu'un calque selectionne
if (app.project.activeItem.selectedLayers.length == 1)
{
//  debut de groupe d'annulation
app.beginUndoGroup(tr("Path Follow"));
Duik.pathFollow(app.project.activeItem.selectedLayers[0]);
app.endUndoGroup();
}
else
{
alert(tr("No layer selected"));
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
app.beginUndoGroup(tr("Duik - Paint Rigging"));
Duik.rigPaint(layers);
app.endUndoGroup();
}

//PAINT GROUP
function paintGroupButtonClicked() {
if (!(app.project.activeItem instanceof CompItem)) return;
if (app.project.activeItem.selectedLayers.length == 0) return;
app.beginUndoGroup(tr("Duik - Paint group"));
Duik.groupPaint(app.project.activeItem.selectedLayers[0].selectedProperties);
app.endUndoGroup();
}

//BLINK
function blinkButtonClicked() {
// Verifions si il n'y a qu'un calque selectionne
if (app.project.activeItem.selectedLayers.length == 1){

var calque = app.project.activeItem.selectedLayers[0];

if (calque.selectedProperties.length != 0){

//Prendre l'effet
var effet = app.project.activeItem.selectedLayers[0].selectedProperties.pop();
//on verifie sin on peut mettre une expression, sinon inutile de continuer
if(effet.canSetExpression) {

//  debut de groupe d'annulation
app.beginUndoGroup(tr("Duik - Blink"));

Duik.blink(calque,effet);
//fin du groupe d'annulation
app.endUndoGroup();

}else{alert(tr("Cannot create expression on this effect"),tr("Impossible spring"));}
}else{alert(tr("Select the effect where you want to create the spring"),tr("No effect selected"));}
}else{alert(tr("Select the effect where you want to create the spring"),tr("No layer selected"));}
}


//TIME REMAP
function timeRemapButtonClicked() {
if (app.project.activeItem == null) return;
var layers = app.project.activeItem.selectedLayers;
app.beginUndoGroup(tr("Duik - Time remap"));
var loop = 'none';
if (timeRemapLoopInButton.value && timeRemapLoopButton.value) loop = 'in';
else if (timeRemapLoopOutButton.value && timeRemapLoopButton.value) loop = 'out';
Duik.timeRemap(layers,loop);
app.endUndoGroup();
}

//MOVE AWAY
function moveAwayButtonClicked()
{
if (!(app.project.activeItem instanceof CompItem)) return;

app.beginUndoGroup(tr("Duik - Move away"));

for (var i =0; i < app.project.activeItem.selectedLayers.length ; i++)
{
Duik.moveAway( app.project.activeItem.selectedLayers[i]);
}

app.endUndoGroup();
}

//RANDOMIZE
function randOKButtonClicked()
{
	if (!(app.project.activeItem instanceof CompItem)) return;

	app.beginUndoGroup(tr("Duik - Randomize"));

	var xmin = parseFloat(randMinXValueEdit.text);
	var xmax = parseFloat(randMaxXValueEdit.text);
	var ymin = parseFloat(randMinYValueEdit.text);
	var ymax = parseFloat(randMaxYValueEdit.text);
	var zmin = parseFloat(randMinZValueEdit.text);
	var zmax = parseFloat(randMaxZValueEdit.text);

	if (randPropertiesButton.value)
	{
	for (var i = 0;i<app.project.activeItem.selectedLayers.length;i++)
	{
	var layer = app.project.activeItem.selectedLayers[i];
	Duik.randomizeProperties(layer.selectedProperties,randFromValueButton.value,xmin,xmax,ymin,ymax,zmin,zmax);
	}
	}
	else if (randStartTimeButton.value)
	{
		Duik.randomizeStartTimes(app.project.activeItem.selectedLayers,randFromValueButton.value,xmin,xmax);
	}
	else if (randInPointButton.value)
	{
	Duik.randomizeInPoints(app.project.activeItem.selectedLayers,randFromValueButton.value,xmin,xmax);
	}
	else if (randOutPointButton.value)
	{
	Duik.randomizeOutPoints(app.project.activeItem.selectedLayers,randFromValueButton.value,xmin,xmax);
	}
	else if (randKeyValueButton.value)
	{
	for (var i = 0;i<app.project.activeItem.selectedLayers.length;i++)
	{
	var layer = app.project.activeItem.selectedLayers[i];
	Duik.randomizeSelectedKeys(layer.selectedProperties,randFromValueButton.value,xmin,xmax,ymin,ymax,zmin,zmax);
	}
	}
	else if (randKeyTimeButton.value)
	{
	Duik.randomizeSelectedKeyTimes(app.project.activeItem.selectedLayers,randFromValueButton.value,xmin,xmax);
	}

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
if (comp.layer(i).name.indexOf(tr("Cel")) >= 0)
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

app.beginUndoGroup(tr("Duik - New celluloid"));

var singleLayer = celSingleLayerButton.value;

if (singleLayer == undefined) singleLayer = true;

if (layer == null)
{
//create solid
layer = comp.layers.addSolid([0,0,0], tr("Cel") + ' 1', comp.width, comp.height, comp.pixelAspect , comp.duration);
}
else if (!singleLayer)
{
//look for other cells
var maxCelNumber = 0;
var re = /Cel (\d+)/i;
for (var i = 1 ; i <= comp.layers.length ; i++)
{
var thisCelNumber = 0;
var test = comp.layer(i).name.match(re);
if (test) thisCelNumber = parseInt(test[1]);
if (thisCelNumber > maxCelNumber) maxCelNumber = thisCelNumber;
}
var celNumber = maxCelNumber+1;
layer = comp.layers.addSolid([0,0,0], tr("Cel") + ' ' + celNumber, comp.width, comp.height, comp.pixelAspect , comp.duration);
}

var first = true;
for (var i = 1 ; i <= layer.Effects.numProperties ; i++)
{
if (layer.effect(i).matchName == 'ADBE Paint')
{
first = false;
break;
}
}

var paint = layer.Effects.addProperty('ADBE Paint');

if (first) paint.property('ADBE Paint On Transparent').setValue(true);

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
if (comp.layer(i).name.indexOf(tr("Cel")) >= 0)
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


app.beginUndoGroup(tr("Duik - Update Onion Skin"));
var inOpacity = 0;
var outOpacity = 0;
if (celOnionInOpacityButton.value) inOpacity = parseInt(celOnionInOpacityEdit.text);
if (celOnionOutOpacityButton.value) outOpacity = parseInt(celOnionOutOpacityEdit.text);
var os = new OnionSkin();
os.activated = celOnionButton.value;
os.duration = parseInt(celOnionDurationEdit.text);
os.exposure = parseInt(celExposureEdit.text);
os.outOpacity = outOpacity;
os.inOpacity = inOpacity;
Duik.onionSkin(layer,os);
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

function celOnionGetButtonClicked()
{
var comp = app.project.activeItem;
if (comp == null) return;
if (!(comp instanceof CompItem)) return;

var layer = null;
if (comp.selectedLayers.length == 0)
{
for (var i = 1 ; i <= comp.layers.length ; i++)
{
if (comp.layer(i).name.indexOf(tr("Cel")) >= 0)
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

var os = Duik.getOnionSkin(layer);

celOnionButton.value = os.activated;
if (os.activated)
{
celOnionDurationEdit.text = os.duration
if (os.outOpacity > 0)
{
celOnionOutOpacityEdit.text = os.outOpacity;
celOnionOutOpacitySlider.value = os.outOpacity;
celOnionOutOpacityButton.value = true;
}
else
{
celOnionOutOpacityButton.value = false;
}
if (os.inOpacity > 0)
{
celOnionInOpacityEdit.text = os.inOpacity;
celOnionInOpacitySlider.value = os.inOpacity;
celOnionInOpacityButton.value = true;
}
else
{
celOnionInOpacityButton.value = false;
}
}

celOnionInOpacitySlider.enabled = celOnionInOpacityButton.value;
celOnionInOpacityEdit.enabled = celOnionInOpacityButton.value;

celOnionOutOpacitySlider.enabled = celOnionOutOpacityButton.value;
celOnionOutOpacityEdit.enabled = celOnionOutOpacityButton.value;

celOnionDurationEdit.enabled = celOnionButton.value;
celOnionDurationLabel.enabled = celOnionButton.value;
celOnionInOpacityGroup.enabled = celOnionButton.value;
celOnionOutOpacityGroup.enabled = celOnionButton.value;
celOnionUpdateButton.enabled = celOnionButton.value;
}

//COPY AND PASTE ANIM
function copyAnim() {
var layers = app.project.activeItem.selectedLayers;
if (layers.length == 0)
{
alert(tr("Please select the layers from which you want to save animation"));
return;
}

var selected = false; // est ce qu'il y a des clefs selectionnees (ou est ce qu'on fait sur toute l'anim)
var startTime = 86339; // instant de debut de l'anim a sauvegarder
var endTime = app.project.activeItem.workAreaDuration + app.project.activeItem.workAreaStart;

//if there are selected keys
for (var i = 0; i < layers.length ; i++)
{
selected = Duik.utils.hasSelectedKeys(layers[i]);
if (selected) break;
selected = Duik.utils.hasSelectedKeys(layers[i].transform); //faut recommencer sur les transformations, c'est pas des proprietes comme les autres pour after... #StupidAFX
if (selected) break;
}


// 2 - chercher l'instant de la premiere clef dans le temps, si ya des clefs selectionnees
if (selected)
{
for (var i = 0; i < layers.length ; i++)
{
var testTime = Duik.utils.getFirstKeyTime(layers[i]);
if (testTime < startTime) startTime = testTime;
testTime = Duik.utils.getFirstKeyTime(layers[i].transform); //faut recommencer sur les transformations, c'est pas des proprietes comme les autres pour after... #StupidAFX
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
app.beginUndoGroup(tr("Duik - Paste Anim"));
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
if (totalPasted != Duik.copiedAnim.length) alert(tr("Pasted animation on ") + totalPasted + ' ' + tr("layers") + '.\n\n' + (Duik.copiedAnim.length-totalPasted) + " layers not found.");
}
//=============== INTERPOLATION =====================

//FONCTION MORPHER
function morpher() {

//  debut de groupe d'annulation
app.beginUndoGroup(tr("Create a morpher"));

Duik.morpher(app.project.activeItem.selectedLayers);

//fin du groupe d'annulation
app.endUndoGroup();


}

//=============== CAMERAS ===========================

//FONCTION TARGET CAM
function controlcam() {

if (!(app.project.activeItem instanceof CompItem)) return;
//verifier qu'il n'y a qu'un calque selectionne
if (app.project.activeItem.selectedLayers.length != 1) alert (tr("Select the camera"),tr("No camera selected"),true);
//verifier que c'est une camera
if (!(app.project.activeItem.selectedLayers[0] instanceof CameraLayer)) alert (tr("Select the camera"),tr("Selected layer is not a camera"),true);


//debut du groupe d'annulation
app.beginUndoGroup(tr("Camera Controller"));

//recuperer la camera
var camera = app.project.activeItem.selectedLayers[0];

//creer le target
var targetCtrl = Duik.addController(undefined,false,false,true,true);
var target = targetCtrl.layer;
target.name = camera.name + tr(" target");
target.threeDLayer = true;
target.position.setValue(camera.transform.pointOfInterest.value);

//creer la cam
var camCtrl = Duik.addController(undefined,false,false,true,true);
var cam = camCtrl.layer;
cam.name = camera.name + tr(" position");
cam.threeDLayer = true;
cam.position.setValue(camera.transform.position.value);

//creer celui tout en haut
var controleurCtrl = Duik.addController();
controleurCtrl.camera = true;
controleurCtrl.update();
var controleur = controleurCtrl.layer;
controleur.name = tr("Control_") + camera.name;
controleur.threeDLayer = true;
controleur.position.setValue(camera.transform.position.value);

cam.parent = controleur;
target.parent = controleur;

//definir les expressions
camera.position.expression = 'thisComp.layer(\'' + cam.name + '\').toWorld(thisComp.layer(\'' + cam.name + '\').transform.anchorPoint)';
camera.pointOfInterest.expression = 'thisComp.layer(\'' + target.name + '\').toWorld(thisComp.layer(\'' + target.name + '\').transform.anchorPoint)';
camera.orientation.expression = 'value + thisComp.layer(\'' + cam.name + '\').transform.orientation';
camera.xRotation.expression = 'value + thisComp.layer(\'' + cam.name + '\').transform.xRotation';
camera.yRotation.expression = 'value + thisComp.layer(\'' + cam.name + '\').transform.yRotation';
camera.rotation.expression = 'value + thisComp.layer(\'' + cam.name + '\').transform.rotation';

//bloquer la camera
camera.locked = true;

//fin du groupe d'annulation
app.endUndoGroup();






}

//FONCTION MULTIPLAN
function multiplan()
{
//debut du groupe d'annulation
app.beginUndoGroup(tr("Duik - Multiplane"));
var comp = app.project.activeItem;
var layers = [];
if (comp instanceof CompItem)
{
layers = comp.selectedLayers;
layers = Duik.utils.sortLayersByIndex(layers);
}

Duik.multiplane(parseInt(nombre.text));

if (layers.length == parseInt(nombre.text))
{
for (var i = 0 ; i<layers.length;i++)
{
layers[i].parent = comp.layer(i+1);
}
}

//fin du groupe d'annulation
app.endUndoGroup();
}

//SCALE Z-LINK
function scaleZLinkButtonClicked()
{
if (app.project.activeItem == null) return;
app.beginUndoGroup(tr("Duik - Scale Z-Link"));
Duik.scaleZLink(app.project.activeItem.selectedLayers);
app.endUndoGroup();
}

//TVPAINT CAMERA
function tvpCamOKButtonClicked () {
var comp = app.project.activeItem;
if (!(comp instanceof CompItem)) return;
app.beginUndoGroup(tr("Duik - Import TVPaint Camera"));
//request file
var camFile = File.openDialog(tr("Choose the camera file you want to import"),'TVP cam:*.cpt,All files:*.*',false);
if (!camFile) return;
var cam = Duik.bridge.tvPaint.loadCamFile(camFile);
if (tvpCamNullButton.value)
{
cam.createNull(comp,tvpCamLinkButton.value,tvpCamAnchorPointButton.value);
}
else if (tvpCamLayerButton.value)
{
if (comp.selectedLayers.length)
{
var layer = comp.selectedLayers[0];
cam.applyToLayer(layer,tvpCamLinkButton.value,tvpCamAnchorPointButton.value);
}
}
else
{
cam.precompose(comp,tvpCamAnchorPointButton.value);
}

}

//============= SETTINGS ============================

//FONCTION POUR CHOISIR LA LANGUE
function choixLangue() {
if (boutonlangue.selection.index == 0)
{
Dutranslator.setLanguage('en');
app.settings.saveSetting('duik','lang','en');
}
for (var i = 0 ; i < Dutranslator.languages.length ; i++)
{
if (Dutranslator.languages[i][1] == boutonlangue.selection.text)
{
Dutranslator.setLanguage(Dutranslator.languages[i][0]);
app.settings.saveSetting('duik','lang',Dutranslator.languages[i][0]);
break;
}
}
}

//FONCTIONS CALC
function calc() {

resultatcalc1.text = resultatcalc2.text;

if (eval(textecalc.text) != null)
{
textecalc.text.length < 15 ? resultatcalc2.text = textecalc.text + ' = ' + eval(textecalc.text) : resultatcalc2.text = '(...) = ' + eval(textecalc.text) ;
textecalc.text = eval(textecalc.text);
}
else
resultatcalc2.text ='error';
}

//============= INTERPOLATIONS ======================
function lineaire() {

	if (!(app.project.activeItem instanceof CompItem)) return;
	var comp = app.project.activeItem;
	if (comp.selectedLayers.length == 0) return;
	var layers = comp.selectedLayers;

	app.beginUndoGroup('Duik - ' + tr("Linear Interpolation"));
	
	//if no selected keys, add key on selected properties
	if (!Duik.utils.layersHaveSelectedKeys(layers))
	{
		for (var i=0;i<layers.length;i++)
		{
			for (var j=0;j<layers[i].selectedProperties.length;j++)
			{
				var prop = layers[i].selectedProperties[j];
				if (prop.canVaryOverTime)
				{
					var key = prop.addKey(comp.time);
					prop.setInterpolationTypeAtKey(key,KeyframeInterpolationType.LINEAR);
				}
			}
		}
		app.endUndoGroup();
		return;
	}

	//for layers
	for (var i=0;i<layers.length;i++)
	{
		//for props
		for (var j=0;j<layers[i].selectedProperties.length;j++)
		{
			var prop = app.project.activeItem.selectedLayers[i].selectedProperties[j];
			if (prop.canVaryOverTime)
			{
				//for keys
				for (var k=0;k<prop.selectedKeys.length;k++)
				{
					prop.setInterpolationTypeAtKey(prop.selectedKeys[k],KeyframeInterpolationType.LINEAR);
					if (prop.isSpatial) try { prop.setRovingAtKey(prop.selectedKeys[k],false); } catch(e){} //prop.isSpatial is true on shapes? try/catch as a workaround
				}
			}
		}
	}
	
	app.endUndoGroup();
}

function lissageA() {

	var inVal = parseInt(interpoInEdit.text);
	if (!inVal) inVal = 33;
	easeIn = new KeyframeEase(0,inVal);
	var outVal = parseInt(interpoOutEdit.text);
	if (!outVal) outVal = 33;
	easeOut = new KeyframeEase(0,outVal);

	if (!(app.project.activeItem instanceof CompItem)) return;
	var comp = app.project.activeItem;
	if (comp.selectedLayers.length == 0) return;
	var layers = comp.selectedLayers;
	
	app.beginUndoGroup('Duik - ' + tr("Ease In"));

	//if no selected keys, add key on selected properties
	if (!Duik.utils.layersHaveSelectedKeys(layers))
	{
		for (var i=0;i<layers.length;i++)
		{
			for (var j=0;j<layers[i].selectedProperties.length;j++)
			{
				var prop = layers[i].selectedProperties[j];
				if (prop.canVaryOverTime)
				{
					var key = prop.addKey(comp.time);
					//influences
					if (!prop.isSpatial && prop.value.length == 3) { prop.setTemporalEaseAtKey(key,[easeIn,easeIn,easeIn],[easeOut,easeOut,easeOut]); }
					else if (!prop.isSpatial && prop.value.length == 2) { prop.setTemporalEaseAtKey(key,[easeIn,easeIn],[easeOut,easeOut]); }
					else { prop.setTemporalEaseAtKey(key,[easeIn],[easeOut]); }

					//type
					prop.setInterpolationTypeAtKey(key,KeyframeInterpolationType.BEZIER,KeyframeInterpolationType.LINEAR);
				}

			}
		}
		app.endUndoGroup();
		return;
	}


	//for layers
	for (var i=0;i<layers.length;i++)
	{
		//for props
		for (var j=0;j<layers[i].selectedProperties.length;j++)
		{
			var prop = app.project.activeItem.selectedLayers[i].selectedProperties[j];
			if (prop.canVaryOverTime)
			{
				//for keys
				for (var k=0;k<prop.selectedKeys.length;k++)
				{
					//influences
					if (!prop.isSpatial && prop.value.length == 3) { prop.setTemporalEaseAtKey(prop.selectedKeys[k],[easeIn,easeIn,easeIn],[easeOut,easeOut,easeOut]); }
					else if (!prop.isSpatial && prop.value.length == 2) { prop.setTemporalEaseAtKey(prop.selectedKeys[k],[easeIn,easeIn],[easeOut,easeOut]); }
					else { prop.setTemporalEaseAtKey(prop.selectedKeys[k],[easeIn],[easeOut]); }

					//type
					prop.setInterpolationTypeAtKey(prop.selectedKeys[k],KeyframeInterpolationType.BEZIER,KeyframeInterpolationType.LINEAR);

					//not roving
				if (prop.isSpatial) try { prop.setRovingAtKey(prop.selectedKeys[k],false); } catch(e){}
				}
			}
		}
	}
	app.endUndoGroup();
}

function lissageE() {

	var inVal = parseInt(interpoInEdit.text);
	if (!inVal) inVal = 33;
	easeIn = new KeyframeEase(0,inVal);
	var outVal = parseInt(interpoOutEdit.text);
	if (!outVal) outVal = 33;
	easeOut = new KeyframeEase(0,outVal);


	if (!(app.project.activeItem instanceof CompItem)) return;
	var comp = app.project.activeItem;
	if (comp.selectedLayers.length == 0) return;
	var layers = comp.selectedLayers;
	
	app.beginUndoGroup('Duik - ' + tr("Ease Out"));

	//if no selected keys, add key on selected properties
	if (!Duik.utils.layersHaveSelectedKeys(layers))
	{
		for (var i=0;i<layers.length;i++)
		{
			for (var j=0;j<layers[i].selectedProperties.length;j++)
			{
				var prop = layers[i].selectedProperties[j];
				if (prop.canVaryOverTime)
				{
					var key = prop.addKey(comp.time);
					//influences
					if (!prop.isSpatial && prop.value.length == 3) { prop.setTemporalEaseAtKey(key,[easeIn,easeIn,easeIn],[easeOut,easeOut,easeOut]); }
					else if (!prop.isSpatial && prop.value.length == 2) { prop.setTemporalEaseAtKey(key,[easeIn,easeIn],[easeOut,easeOut]); }
					else { prop.setTemporalEaseAtKey(key,[easeIn],[easeOut]); }

					//type
					prop.setInterpolationTypeAtKey(key,KeyframeInterpolationType.LINEAR,KeyframeInterpolationType.BEZIER);
				}
			}
		}
		app.endUndoGroup();
		return;
	}


	//for layers
	for (var i=0;i<layers.length;i++)
	{
	//for props
	for (var j=0;j<layers[i].selectedProperties.length;j++)
	{
	var prop = app.project.activeItem.selectedLayers[i].selectedProperties[j];
	if (prop.canVaryOverTime)
	{
	//for keys
	for (var k=0;k<prop.selectedKeys.length;k++)
	{
	//influences
	if (!prop.isSpatial && prop.value.length == 3) { prop.setTemporalEaseAtKey(prop.selectedKeys[k],[easeIn,easeIn,easeIn],[easeOut,easeOut,easeOut]); }
	else if (!prop.isSpatial && prop.value.length == 2) { prop.setTemporalEaseAtKey(prop.selectedKeys[k],[easeIn,easeIn],[easeOut,easeOut]); }
	else { prop.setTemporalEaseAtKey(prop.selectedKeys[k],[easeIn],[easeOut]); }

	//type
	prop.setInterpolationTypeAtKey(prop.selectedKeys[k],KeyframeInterpolationType.LINEAR,KeyframeInterpolationType.BEZIER);

	//not roving
	if (prop.isSpatial) try { prop.setRovingAtKey(prop.selectedKeys[k],false); } catch(e){}
	}
	}
	}
	}
	app.endUndoGroup();
}

function lissage() {

	var inVal = parseInt(interpoInEdit.text);
	if (!inVal) inVal = 33;
	easeIn = new KeyframeEase(0,inVal);
	var outVal = parseInt(interpoOutEdit.text);
	if (!outVal) outVal = 33;
	easeOut = new KeyframeEase(0,outVal);

	if (!(app.project.activeItem instanceof CompItem)) return;
	var comp = app.project.activeItem;
	if (comp.selectedLayers.length == 0) return;
	var layers = comp.selectedLayers;

	app.beginUndoGroup('Duik - ' + tr("Easy Ease"));

	//if no selected keys, add key on selected properties
	if (!Duik.utils.layersHaveSelectedKeys(layers))
	{
		for (var i=0;i<layers.length;i++)
		{
			for (var j=0;j<layers[i].selectedProperties.length;j++)
			{
				var prop = layers[i].selectedProperties[j];
				if (prop.canVaryOverTime)
				{
					var key = prop.addKey(comp.time);
					prop.setInterpolationTypeAtKey(key,KeyframeInterpolationType.BEZIER);
					prop.setTemporalContinuousAtKey(key, false);

					//influences
					if (!prop.isSpatial && prop.value.length == 3) { prop.setTemporalEaseAtKey(key,[easeIn,easeIn,easeIn],[easeOut,easeOut,easeOut]); }
					else if (!prop.isSpatial && prop.value.length == 2) { prop.setTemporalEaseAtKey(key,[easeIn,easeIn],[easeOut,easeOut]); }
					else { prop.setTemporalEaseAtKey(key,[easeIn],[easeOut]); }
				}
			}
		}
		app.endUndoGroup();
		return;
	}


	//for layers
	for (var i=0;i<layers.length;i++)
	{
	//for props
	for (var j=0;j<layers[i].selectedProperties.length;j++)
	{
	var prop = app.project.activeItem.selectedLayers[i].selectedProperties[j];
	if (prop.canVaryOverTime)
	{
	//for keys
	for (var k=0;k<prop.selectedKeys.length;k++)
	{
	prop.setInterpolationTypeAtKey(prop.selectedKeys[k],KeyframeInterpolationType.BEZIER);
	prop.setTemporalContinuousAtKey(prop.selectedKeys[k], false);

	//influences
	if (!prop.isSpatial && prop.value.length == 3) { prop.setTemporalEaseAtKey(prop.selectedKeys[k],[easeIn,easeIn,easeIn],[easeOut,easeOut,easeOut]); }
	else if (!prop.isSpatial && prop.value.length == 2) { prop.setTemporalEaseAtKey(prop.selectedKeys[k],[easeIn,easeIn],[easeOut,easeOut]); }
	else { prop.setTemporalEaseAtKey(prop.selectedKeys[k],[easeIn],[easeOut]); }

	if (prop.isSpatial) try { prop.setRovingAtKey(prop.selectedKeys[k],false); } catch(e){}
	}
	}
	}
	}
	app.endUndoGroup();
}

function continu() {

	if (!(app.project.activeItem instanceof CompItem)) return;
	var comp = app.project.activeItem;
	if (comp.selectedLayers.length == 0) return;
	var layers = comp.selectedLayers;

	app.beginUndoGroup('Duik - ' + tr("Auto Bezier"));

	//if no selected keys, add key on selected properties
	if (!Duik.utils.layersHaveSelectedKeys(layers))
	{
		for (var i=0;i<layers.length;i++)
		{
			for (var j=0;j<layers[i].selectedProperties.length;j++)
			{
				var prop = layers[i].selectedProperties[j];
				if (prop.canVaryOverTime)
				{
					var key = prop.addKey(comp.time);
					prop.setInterpolationTypeAtKey(key,KeyframeInterpolationType.BEZIER);
					prop.setTemporalContinuousAtKey(key, true);
					prop.setTemporalAutoBezierAtKey(key, true);
				}
			}
		}
		app.endUndoGroup();
		return;
	}


	//for layers
	for (var i=0;i<layers.length;i++)
	{
	//for props
	for (var j=0;j<layers[i].selectedProperties.length;j++)
	{
	var prop = app.project.activeItem.selectedLayers[i].selectedProperties[j];
	if (prop.canVaryOverTime)
	{
	//for keys
	for (var k=0;k<prop.selectedKeys.length;k++)
	{
	prop.setInterpolationTypeAtKey(prop.selectedKeys[k],KeyframeInterpolationType.BEZIER);
	prop.setTemporalContinuousAtKey(prop.selectedKeys[k], true);
	prop.setTemporalAutoBezierAtKey(prop.selectedKeys[k], true);
	if (prop.isSpatial) try { prop.setRovingAtKey(prop.selectedKeys[k],false); } catch(e){}
	}
	}
	}
	}
	app.endUndoGroup();
}

function maintien() {

	if (!(app.project.activeItem instanceof CompItem)) return;
	var comp = app.project.activeItem;
	if (comp.selectedLayers.length == 0) return;
	var layers = comp.selectedLayers;

	app.beginUndoGroup('Duik - ' + tr("Hold"));

	//if no selected keys, add key on selected properties
	if (!Duik.utils.layersHaveSelectedKeys(layers))
	{
		for (var i=0;i<layers.length;i++)
		{
			for (var j=0;j<layers[i].selectedProperties.length;j++)
			{
				var prop = layers[i].selectedProperties[j];
				if (prop.canVaryOverTime)
				{
					var key = prop.addKey(comp.time);
					prop.setInterpolationTypeAtKey(key,KeyframeInterpolationType.HOLD);
				}
			}
		}
		app.endUndoGroup();
		return;
	}


	//for layers
	for (var i=0;i<layers.length;i++)
	{
	//for props
	for (var j=0;j<layers[i].selectedProperties.length;j++)
	{
	var prop = app.project.activeItem.selectedLayers[i].selectedProperties[j];
	if (prop.canVaryOverTime)
	{
	//for keys
	for (var k=0;k<prop.selectedKeys.length;k++)
	{
	prop.setInterpolationTypeAtKey(prop.selectedKeys[k],KeyframeInterpolationType.HOLD);
	if (prop.isSpatial) try { prop.setRovingAtKey(prop.selectedKeys[k],false); } catch(e){}
	}
	}
	}
	}
	app.endUndoGroup();
}

function infl() {

if (! (app.project.activeItem instanceof CompItem)) return;

var inVal = parseInt(interpoInEdit.text);
var outVal = parseInt(interpoOutEdit.text);
var speedVal = parseFloat(interpoSpeedEdit.text);

if (boutonEloignement.value && !outVal) return;
if (boutonApproche.value && !inVal) return;

app.beginUndoGroup(tr("Duik - Interpolation"));

for (var i=0;i<app.project.activeItem.selectedLayers.length;i++) {
for (var j=0;j<app.project.activeItem.selectedLayers[i].selectedProperties.length;j++) {
if (app.project.activeItem.selectedLayers[i].selectedProperties[j].canVaryOverTime) {
for (var k=0;k<app.project.activeItem.selectedLayers[i].selectedProperties[j].selectedKeys.length;k++) {
var prop = app.project.activeItem.selectedLayers[i].selectedProperties[j];
if (!prop.isSpatial && prop.value.length == 3) {
var easeIn1 =  new KeyframeEase(interpoSpeedButton.value ? speedVal : prop.keyInTemporalEase(prop.selectedKeys[k])[0].speed,boutonApproche.value ? inVal : prop.keyInTemporalEase(prop.selectedKeys[k])[0].influence);
var easeIn2 =  new KeyframeEase(interpoSpeedButton.value ? speedVal : prop.keyInTemporalEase(prop.selectedKeys[k])[1].speed,boutonApproche.value ? inVal : prop.keyInTemporalEase(prop.selectedKeys[k])[1].influence);
var easeIn3 =  new KeyframeEase(interpoSpeedButton.value ? speedVal : prop.keyInTemporalEase(prop.selectedKeys[k])[2].speed,boutonApproche.value ? inVal : prop.keyInTemporalEase(prop.selectedKeys[k])[2].influence);
var easeOut1 = new KeyframeEase(interpoSpeedButton.value ? speedVal : prop.keyOutTemporalEase(prop.selectedKeys[k])[0].speed,boutonEloignement.value ? outVal : prop.keyOutTemporalEase(prop.selectedKeys[k])[0].influence);
var easeOut2 = new KeyframeEase(interpoSpeedButton.value ? speedVal : prop.keyOutTemporalEase(prop.selectedKeys[k])[1].speed,boutonEloignement.value ? outVal : prop.keyOutTemporalEase(prop.selectedKeys[k])[1].influence);
var easeOut3 = new KeyframeEase(interpoSpeedButton.value ? speedVal : prop.keyOutTemporalEase(prop.selectedKeys[k])[2].speed,boutonEloignement.value ? outVal : prop.keyOutTemporalEase(prop.selectedKeys[k])[2].influence);
prop.setTemporalEaseAtKey(prop.selectedKeys[k],[easeIn1,easeIn2,easeIn3],[easeOut1,easeOut2,easeOut3]);
}
else if (!prop.isSpatial && prop.value.length == 2) {
var easeIn1 =  new KeyframeEase(interpoSpeedButton.value ? speedVal : prop.keyInTemporalEase(prop.selectedKeys[k])[0].speed,boutonApproche.value ? inVal : prop.keyInTemporalEase(prop.selectedKeys[k])[0].influence);
var easeIn2 =  new KeyframeEase(interpoSpeedButton.value ? speedVal : prop.keyInTemporalEase(prop.selectedKeys[k])[1].speed,boutonApproche.value ? inVal : prop.keyInTemporalEase(prop.selectedKeys[k])[1].influence);
var easeOut1 = new KeyframeEase(interpoSpeedButton.value ? speedVal : prop.keyOutTemporalEase(prop.selectedKeys[k])[0].speed,boutonEloignement.value ? outVal : prop.keyOutTemporalEase(prop.selectedKeys[k])[0].influence);
var easeOut2 = new KeyframeEase(interpoSpeedButton.value ? speedVal : prop.keyOutTemporalEase(prop.selectedKeys[k])[1].speed,boutonEloignement.value ? outVal : prop.keyOutTemporalEase(prop.selectedKeys[k])[1].influence);
prop.setTemporalEaseAtKey(prop.selectedKeys[k],[easeIn1,easeIn2],[easeOut1,easeOut2]);
}
else {
var easeIn =  new KeyframeEase(interpoSpeedButton.value ? speedVal : prop.keyInTemporalEase(prop.selectedKeys[k])[0].speed,boutonApproche.value ? inVal : prop.keyInTemporalEase(prop.selectedKeys[k])[0].influence);
var easeOut = new KeyframeEase(interpoSpeedButton.value ? speedVal : prop.keyOutTemporalEase(prop.selectedKeys[k])[0].speed,boutonEloignement.value ? outVal : prop.keyOutTemporalEase(prop.selectedKeys[k])[0].influence);
prop.setTemporalEaseAtKey(prop.selectedKeys[k],[easeIn],[easeOut]);
}
}
}
}
}
app.endUndoGroup();
}

function interpoPresetsListChanged() {
if (interpoPresetsList.selection == null) return;
if (interpoPresetsList.selection.index == 0) return;
var preset = interpoPresetsList.selection.text;
var rePreset = /(\d+) \- (\d+)\/(\d+)/i;
var vals = preset.match(rePreset);
if (vals == null) return;
if (vals.length != 4) return;
interpoSpeedSlider.value = parseInt(vals[1]);
interpoSpeedEdit.text = vals[1];
interpoInSlider.value = parseInt(vals[2]);
interpoInEdit.text = vals[2];
interpoOutSlider.value = parseInt(vals[3]);
interpoOutEdit.text = vals[3];
if (interpoInSlider.value != interpoOutSlider.value)
{
interpoLockInfluencesButton.value = false;
boutonApproche.enabled = true;
groupeInterpoOut.visible = true;
}
infl();
}

function interpoPresetsAddButtonClicked(){
var presets = [];
for (var i = 1 ; i < interpoPresetsList.items.length ; i++)
{
presets.push(interpoPresetsList.items[i].text);
}
presets.push(interpoSpeedEdit.text + ' - ' + interpoInEdit.text + '/' + interpoOutEdit.text);
presets.sort();
presets.unshift('Presets');
interpoPresetsList.removeAll();
for (var i=0;i<presets.length;i++)
{
interpoPresetsList.add('item',presets[i]);
}
app.settings.saveSetting('duik','interpolationPresets',presets.toSource());
interpoPresetsList.selection = 0;
}

function interpoPresetsRemoveButtonClicked(){
if (interpoPresetsList.selection == null) return;
if (interpoPresetsList.selection.index == 0) return;
interpoPresetsList.remove(interpoPresetsList.selection);
var presets = [];
for (var i = 0 ; i < interpoPresetsList.items.length ; i++)
{
presets.push(interpoPresetsList.items[i].text);
}
app.settings.saveSetting('duik','interpolationPresets',presets.toSource());
interpoPresetsList.selection = 0;
}

function interpoGetInflButtonClicked(){
var comp = app.project.activeItem;
if (! (comp instanceof CompItem)) return;
if (comp.selectedLayers.length == 0) return;
var layer = comp.selectedLayers[0];
if (layer.selectedProperties.length == 0) return;
for (var j=0;j<layer.selectedProperties.length;j++)
{
if (layer.selectedProperties[j].selectedKeys.length == 0) continue;
var prop = layer.selectedProperties[j];
var speed = prop.keyInTemporalEase(prop.selectedKeys[0])[0].speed;
var easeIn = prop.keyInTemporalEase(prop.selectedKeys[0])[0].influence;
var easeOut = prop.keyOutTemporalEase(prop.selectedKeys[0])[0].influence;
break;
}
interpoInEdit.text = easeIn;
interpoOutEdit.text = easeOut;
interpoSpeedEdit.text = speed;
interpoInSlider.value = easeIn;
interpoOutSlider.value = easeOut;
interpoSpeedSlider.value = speed;
if (interpoInSlider.value != interpoOutSlider.value)
{
interpoLockInfluencesButton.value = false;
boutonApproche.enabled = true;
groupeInterpoOut.enabled = true;
}

}

function roving () {

	if (!(app.project.activeItem instanceof CompItem)) return;
	var comp = app.project.activeItem;
	if (comp.selectedLayers.length == 0) return;
	var layers = comp.selectedLayers;

	app.beginUndoGroup('Duik - ' + tr("Roving"));

	//if no selected keys, add key on selected properties
	if (!Duik.utils.layersHaveSelectedKeys(layers))
	{
		for (var i=0;i<layers.length;i++)
		{
			for (var j=0;j<layers[i].selectedProperties.length;j++)
			{
				var prop = layers[i].selectedProperties[j];
				if (prop.propertyValueType == PropertyValueType.ThreeD_SPATIAL || prop.propertyValueType == PropertyValueType.TwoD_SPATIAL)
				{
					var key = prop.addKey(comp.time);
					prop.setRovingAtKey(key,true);
				}
			}
		}
		app.endUndoGroup();
		return;
	}


	//for layers
	for (var i=0;i<layers.length;i++)
	{
	//for props
	for (var j=0;j<layers[i].selectedProperties.length;j++)
	{
	var prop = app.project.activeItem.selectedLayers[i].selectedProperties[j];
	if (prop.canVaryOverTime)
	{
	if (prop.propertyValueType == PropertyValueType.ThreeD_SPATIAL || prop.propertyValueType == PropertyValueType.TwoD_SPATIAL)
	{
	//for keys
	for (var k=0;k<prop.selectedKeys.length;k++)
	{
	prop.setRovingAtKey(prop.selectedKeys[k],true);
	}
	}
	}
	}
	}
	app.endUndoGroup();
}

function interpoSpatialLBezButtonClicked() {
if (!(app.project.activeItem instanceof CompItem)) return;

for (var i=0;i<app.project.activeItem.selectedLayers.length;i++) {
for (var j=0;j<app.project.activeItem.selectedLayers[i].selectedProperties.length;j++) {
if (app.project.activeItem.selectedLayers[i].selectedProperties[j].canVaryOverTime) {
for (var k=0;k<app.project.activeItem.selectedLayers[i].selectedProperties[j].selectedKeys.length;k++) {
var prop = app.project.activeItem.selectedLayers[i].selectedProperties[j];
if (prop.isSpatial)
{
prop.setSpatialAutoBezierAtKey(prop.selectedKeys[k],true);
}
}
}
}
}
}

function interpoSpatialLinButtonClicked() {
if (!(app.project.activeItem instanceof CompItem)) return;

for (var i=0;i<app.project.activeItem.selectedLayers.length;i++) {
for (var j=0;j<app.project.activeItem.selectedLayers[i].selectedProperties.length;j++) {
if (app.project.activeItem.selectedLayers[i].selectedProperties[j].canVaryOverTime) {
for (var k=0;k<app.project.activeItem.selectedLayers[i].selectedProperties[j].selectedKeys.length;k++) {
var prop = app.project.activeItem.selectedLayers[i].selectedProperties[j];
if (prop.isSpatial)
{
prop.setSpatialContinuousAtKey(prop.selectedKeys[k],false);
prop.setSpatialAutoBezierAtKey(prop.selectedKeys[k],false);
if (prop.propertyValueType == PropertyValueType.ThreeD_SPATIAL)
{
prop.setSpatialTangentsAtKey(prop.selectedKeys[k],[0,0,0],[0,0,0]);
}
else if (prop.propertyValueType == PropertyValueType.TwoD_SPATIAL)
{
prop.setSpatialTangentsAtKey(prop.selectedKeys[k],[0,0],[0,0]);
}
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
//TODO renommer les elements d'UI

Duik.ui.updateProgressPanel(2,tr("Duik - Creating UI"));

//folders and needed variables
var dossierIcones = Folder.userData.absoluteURI  + '/Duduf/DuIK/';
var animationSaved = [];
var controllersFromRiggingPanel = true;

var expertMode = eval(app.settings.getSetting('duik','expertMode'));

//une fonction pour ajouter les boutons plus rapidement :
function addIconButton(conteneur,image,text){
var bouton = conteneur.add('iconbutton',undefined,dossierIcones + image);
//bouton.size = [108,22];
if (!expertMode) bouton.text = text;
return bouton;
}
function addIconRadioButton(conteneur,image,text){
if (expertMode) text = '';
var g = addVGroup(conteneur);
g.alignChildren = ['center','fill'];
g.add('image',undefined,dossierIcones + image);
g.button = g.add('radiobutton',undefined,text);
return g;
}
function addIconCheckbox(conteneur,image,text){
if (expertMode) text = '';
var g = addHGroup(conteneur);
g.alignChildren = ['left','center'];
g.button = g.add('checkbox',undefined,text);
g.img = g.add('image',undefined,dossierIcones + image);
return g;
}
function addButton(conteneur,texte){
var bouton = conteneur.add('button',undefined,texte);
//bouton.size = [108,18];
return bouton;
}
//quatre fonctions pour ajouter les panneaux plus rapidement :
function addVPanel(conteneur){
var groupe = conteneur.add('group');
groupe.orientation = 'column';
groupe.alignChildren = ['fill','fill'];
groupe.spacing = 2;
groupe.margins = 1;
//expertMode ? groupe.alignment = ['left','top'] : groupe.alignment = ['center','top'];
groupe.alignment = ['fill','fill'];
return groupe;
}
function addHPanel(conteneur){
var groupe = conteneur.add('group');
groupe.orientation = 'row';
groupe.alignChildren = ['fill','fill'];
groupe.spacing = 2;
groupe.margins = 1;
//expertMode ? groupe.alignment = ['left','top'] : groupe.alignment = ['center','top'];
groupe.alignment = ['fill','fill'];
return groupe;
}
function addHGroup(conteneur){
var groupe = conteneur.add('group');
//expertMode ? groupe.alignChildren = ['left','fill'] : groupe.alignChildren = ['fill','fill'];
groupe.alignChildren = ['fill','fill'];
groupe.orientation = 'row';
groupe.spacing = 2;
groupe.margins = 0;
return groupe;
}
function addVGroup(conteneur){
var groupe = conteneur.add('group');
groupe.alignChildren = ['fill','fill'];
groupe.orientation = 'column';
groupe.spacing = 2;
groupe.margins = 0;
return groupe;
}
function addBox(conteneur,nom){
var box = conteneur.add('panel',undefined,nom);
box.alignChildren =['fill','top'];
box.spacing = 2;
box.margins = 10;
return box;
}
//fonction pour ajouter des separateurs
function addSeparator(conteneur,name) {
conteneur = addHGroup(conteneur);
conteneur.margins = 5;
if (name.length > 0)
{
var textName = conteneur.add('statictext',undefined,name);
textName.alignment = ['left','fill'];
}
var separator1 = conteneur.add('panel',undefined);
separator1.alignment = ['fill','center'];
separator1.height = 0;
}
//fonction pour les boites de dialogue
function createDialog(titre,hasokbutton,okfonction){
var f = new Window ('palette',titre,undefined,{closeButton:true,resizeable:false});
f.spacing = 2;
f.margins = 5;
f.alignChildren = ['fill','top'];
f.groupe = f.add('group');
f.groupe.alignChildren = ['fill','top'];
var fgroupeBoutons = addHGroup(f);
fgroupeBoutons.alignment = ['fill','bottom'];
fgroupeBoutons.margins = 10;
if (hasokbutton)
{
var fcancel = addButton(fgroupeBoutons,tr("Cancel"));
fcancel.onClick = function() { f.hide(); };
fcancel.alignment = ['left','bottom'];
var fok = addButton(fgroupeBoutons,tr("OK"));
fok.alignment = ['right','bottom'];
if (okfonction != undefined) fok.onClick = function() {f.hide(); okfonction();}
}
else
{
var fcancel = addButton(fgroupeBoutons,tr("Close"));
fcancel.onClick = function() { f.hide(); };
}

return f;
}
//fonction pour changer la couleur d'un texte
function textColor(text,color) {
var g = text.graphics;
var textPen = g.newPen(g.PenType.SOLID_COLOR,color,1);
g.foregroundColor = textPen;
}

//colors
{
var col = {};
col.orange = [223/254,145/254,62/254,1];
col.lightOrange = [223/254,187/254,62/254,1];
col.yellow = [221/254,223/254,62/254,1];
col.blue = [62/254,130/254,223/254,1];
col.purple = [149/254,62/254,223/254,1];
col.red = [1,68/254,68/254,1];
col.trueRed = [1,0,0,1];
col.trueGreen = [0,1,0,1];
}



// la fenetre de la calculatrice
{

var fenetrecalc = createDialog(tr("Calculator"),false);
fenetrecalc.groupe.orientation = 'column';
fenetrecalc.groupe.spacing = 0;
var resultatcalc1 = fenetrecalc.groupe.add('statictext',undefined,'');
var resultatcalc2 = fenetrecalc.groupe.add('statictext',undefined,'');
var textecalc = fenetrecalc.groupe.add ('edittext', undefined);
textecalc.enabled = false;
var ligneCalc1 = addHGroup(fenetrecalc.groupe);
ligneCalc1.spacing = 0;
ligneCalc1.alignChildren = ['fill','center'];
var calcErase = addButton(ligneCalc1,'<-');
calcErase.onClick = function() {textecalc.text = textecalc.text.substr(0,textecalc.text.length-1);};
var calcCancel = addButton(ligneCalc1,'CE');
calcCancel.onClick = function() {textecalc.text = '';};
var calcO = addButton(ligneCalc1,'(');
calcO.onClick = function() { textecalc.text += '(';};
var calcC = addButton(ligneCalc1,')');
calcC.onClick = function() { textecalc.text += ')';};
var ligneCalc2 = addHGroup(fenetrecalc.groupe);
ligneCalc2.spacing = 0;
ligneCalc2.alignChildren = ['fill','center'];
var calc7 = addButton(ligneCalc2,'7');
calc7.onClick = function() { textecalc.text += '7';};
var calc8 = addButton(ligneCalc2,'8');
calc8.onClick = function() { textecalc.text += '8';};
var calc9 = addButton(ligneCalc2,'9');
calc9.onClick = function() { textecalc.text += '9';};
var calcDiv = addButton(ligneCalc2,'/');
calcDiv.onClick = function() { textecalc.text += '/';};
var ligneCalc3 = addHGroup(fenetrecalc.groupe);
ligneCalc3.spacing = 0;
ligneCalc3.alignChildren = ['fill','center'];
var calc4 = addButton(ligneCalc3,'4');
calc4.onClick = function() { textecalc.text += '4';};
var calc5 = addButton(ligneCalc3,'5');
calc5.onClick = function() { textecalc.text += '5';};
var calc6 = addButton(ligneCalc3,'6');
calc6.onClick = function() { textecalc.text += '6';};
var calcMult = addButton(ligneCalc3,'X');
calcMult.onClick = function() { textecalc.text += '*';};
var ligneCalc4 = addHGroup(fenetrecalc.groupe);
ligneCalc4.spacing = 0;
ligneCalc4.alignChildren = ['fill','center'];
var calc1 = addButton(ligneCalc4,'1');
calc1.onClick = function() { textecalc.text += '1';};
var calc2 = addButton(ligneCalc4,'2');
calc2.onClick = function() { textecalc.text += '2';};
var calc3 = addButton(ligneCalc4,'3');
calc3.onClick = function() { textecalc.text += '3';};
var calcMin = addButton(ligneCalc4,'-');
calcMin.onClick = function() { textecalc.text += '-';};
var ligneCalc5 = addHGroup(fenetrecalc.groupe);
ligneCalc5.spacing = 0;
ligneCalc5.alignChildren = ['fill','center'];
var calc0 = addButton(ligneCalc5,'0');
calc0.onClick = function() { textecalc.text += '0';};
var calcPoint = addButton(ligneCalc5,'.');
calcPoint.onClick = function() { textecalc.text += '.';};
var calcEquals = addButton(ligneCalc5,'=');
calcEquals.onClick = calc;
var calcAdd = addButton(ligneCalc5,'+');
calcAdd.onClick = function() { textecalc.text += '+';};

fenetrecalc.layout.layout(true);
fenetrecalc.layout.resize();

function calcKeyDown(e)
{
if (e.keyName == '0') calc0.onClick();
else if (e.keyName == '1') calc1.onClick();
else if (e.keyName == '2') calc2.onClick();
else if (e.keyName == '3') calc3.onClick();
else if (e.keyName == '4') calc4.onClick();
else if (e.keyName == '5') calc5.onClick();
else if (e.keyName == '6') calc6.onClick();
else if (e.keyName == '7') calc7.onClick();
else if (e.keyName == '8') calc8.onClick();
else if (e.keyName == '9') calc9.onClick();
else if (e.keyName == 'Backspace') calcErase.onClick();
else if (e.keyName == 'Delete') calcCancel.onClick();
else if (e.keyName == 'Divide') calcDiv.onClick();
else if (e.keyName == 'Multiply') calcMult.onClick();
else if (e.keyName == 'Minus') calcMin.onClick();
else if (e.keyName == 'Plus') calcAdd.onClick();
else if (e.keyName == 'Enter') calcEquals.onClick();
else if (e.keyName == 'Decimal') calcPoint.onClick();
else if (e.keyName == 'Comma') calcPoint.onClick();
else if (e.keyName == 'Period') calcPoint.onClick();

}

fenetrecalc.addEventListener('keydown',calcKeyDown);



}

// la fenetre du bloc notes
{
var fenetrenotes = createDialog(tr("Notes"),false,undefined,true);
fenetrenotes.groupe.orientation = 'column';
fenetrenotes.groupe.alignment = ['fill','fill'];
fenetrenotes.groupe.alignChildren = ['fill','fill'];
var textenotes = fenetrenotes.groupe.add ('edittext', undefined,'',{multiline: true});
textenotes.helpTip = tr("New line : CTRL + Enter");
var charCounter = fenetrenotes.groupe.add ('statictext', undefined,'0');
charCounter.alignment = ['fill','bottom'];
//recup le texte sauvegarde
var texteRecup = '';
try { texteRecup = app.settings.getSetting('duik','notes'); }
catch(err) { alert(err); }
textenotes.text = texteRecup;
charCounter.text = textenotes.text.length + ' / 1500';

//fonction quand texte modifie
textenotes.onChanging = function ()
{
if (textenotes.text.length > 1500)
{
textenotes.text = textenotes.text.substring(0,1500);
}
charCounter.text = textenotes.text.length + ' / 1500';
app.settings.saveSetting('duik','notes',textenotes.text);
};
fenetrenotes.size = [300,300];

}



//------------
// MAIN PANEL
//------------
{
	var mainGroup = palette.add('group');
	mainGroup.orientation = 'column';
	mainGroup.alignment = ['fill','fill'];
	mainGroup.alignChildren = ['fill','fill'];

	//HEADER

	//BUTTONS ON THE RIGHT
	var entete = mainGroup.add('group');
	entete.alignChildren = ['left','center'];
	entete.alignment = ['fill','top'];
	entete.spacing = 2;
	entete.margins = 0;
	var boutonNotes = entete.add('iconbutton',undefined,dossierIcones + 'btn_notes.png');
	boutonNotes.size = [22,22];
	boutonNotes.helpTip = tr("Simple notepad, with auto-save.");
	boutonNotes.onClick = function () { if (fenetrenotes.visible) fenetrenotes.hide(); else fenetrenotes.show(); };
	var boutonCalc = entete.add('iconbutton',undefined,dossierIcones + 'btn_calc.png');
	boutonCalc.size = [22,22];
	boutonCalc.helpTip = tr("Calculator");
	boutonCalc.onClick = function () { if (fenetrecalc.visible) fenetrecalc.hide(); else fenetrecalc.show(); };

	//PANEL NAME
	if (!expertMode)
	{
	var selectorText = entete.add('statictext',undefined,'');
	selectorText.alignment = ['center','center'];
	selectorText.size = [75,22];
	}

	//SELECTOR BUTTONS
	var selectorGroup = addVGroup(entete);
	selectorGroup.orientation = 'stack';
	selectorGroup.alignment = ['right','center'];
	var selectorButtons = addHGroup(selectorGroup);
	selectorButtons.alignChildren = ['fill','center'];
	var riggingPanelButton = addIconButton(selectorButtons,'sel_rigging.png','');
	riggingPanelButton.size = [22,22];
	riggingPanelButton.helpTip = tr("Rigging");
	var automationPanelButton = addIconButton(selectorButtons,'sel_animation.png','');
	automationPanelButton.size = [22,22];
	automationPanelButton.helpTip = tr("Automation");
	var animationPanelButton = addIconButton(selectorButtons,'sel_interpo.png','');
	animationPanelButton.size = [22,22];
	animationPanelButton.helpTip = tr("Animation");
	var camerasPanelButton = addIconButton(selectorButtons,'sel_camera.png','');
	camerasPanelButton.size = [22,22];
	camerasPanelButton.helpTip = tr("Cameras");
	var settingsPanelButton = addIconButton(selectorButtons,'sel_settings.png','');
	settingsPanelButton.size = [22,22];
	settingsPanelButton.helpTip = tr("Settings");
	var helpPanelButton = addIconButton(selectorButtons,'sel_help.png','');
	helpPanelButton.size = [22,22];
	helpPanelButton.helpTip = tr("Help!");
	//LIST
	var selecteur = selectorGroup.add('dropdownlist',undefined,[tr("Rigging"),tr("Automation"),tr("Animation"),tr("Cameras"),tr("Settings"),tr("Help")]);
	selecteur.alignment = ['right','center'];
	selecteur.helpTip = tr("Tool boxes");
	selecteur.items[0].image = ScriptUI.newImage(dossierIcones + 'sel_rigging.png');
	if (expertMode) selecteur.items[0].text = '';
	selecteur.items[1].image = ScriptUI.newImage(dossierIcones + 'sel_animation.png');
	if (expertMode) selecteur.items[1].text = '';
	selecteur.items[2].image = ScriptUI.newImage(dossierIcones + 'sel_interpo.png');
	if (expertMode) selecteur.items[2].text = '';
	selecteur.items[3].image = ScriptUI.newImage(dossierIcones + 'sel_camera.png');
	if (expertMode) selecteur.items[3].text = '';
	selecteur.items[4].image = ScriptUI.newImage(dossierIcones + 'sel_settings.png');
	if (expertMode) selecteur.items[4].text = '';
	selecteur.items[5].image = ScriptUI.newImage(dossierIcones + 'sel_help.png');
	if (expertMode) selecteur.items[5].text = '';
	if (!eval(app.settings.getSetting('duik', 'dropDownSelector'))) selecteur.hide();
	else selectorButtons.hide();


	//les panneaux
	var panos = mainGroup.add('group');
	panos.orientation = 'stack';
	panos.alignChildren = ['fill','fill'];
	panos.maximumSize = [500,500];
	if (!expertMode) panos.minimumSize = [250,250];
	else panos.minimumSize = [100,100];

	var bottomGroup = addHGroup(mainGroup);
	bottomGroup.alignment = ['fill','bottom'];
	if (!expertMode)
	{
	var duikURL = bottomGroup.add ('statictext',undefined,'www.rainboxprod.coop');
	duikURL.alignment = ['left','bottom'];
	}
	bottomGroup.add('image',undefined,dossierIcones + 'small_logo.png');
	var duikText = bottomGroup.add ('statictext',undefined,'Duik ' + version);
	duikText.alignment = ['right','bottom'];
	
	//Dev tools
	if (developper) {
		mainGroup.add('statictext',undefined,'/!\\ Developper version /!\\');
		/*var reloadLibDuikButton = mainGroup.add('button',undefined,'libDuik reload');
		reloadLibDuikButton.onClick = function(){
			if (typeof Duik === 'object') delete Duik;
			#include 'libduik.jsxinc'
			alert('libDuik reloaded');
		};*/
	}

}

//------------
// PANELS GROUP
//------------
{
var panoik = addVPanel(panos);
var panoanimation = addVPanel(panos);
panoanimation.visible = false;
var panointerpo =  addVPanel(panos);
panointerpo.visible = false;
var panocam = addVPanel(panos);
panocam.visible = false;
var panosettings = addVPanel(panos);
panosettings.visible = false;
var helpPanel = addVPanel(panos);
helpPanel.visible = false;

var ctrlPanel = addVPanel(panos);
ctrlPanel.visible = false;
ctrlPanel.alignChildren = ['fill','top'];
var ikPanel = addVPanel(panos);
ikPanel.visible = false;
ikPanel.alignChildren = ['fill','top'];
var bezierIkPanel = addVPanel(panos);
bezierIkPanel.visible = false;
bezierIkPanel.alignChildren = ['fill','top'];
var renamePanel = addVPanel(panos);
renamePanel.visible = false;
renamePanel.alignChildren = ['fill','top'];
var riePanel = addVPanel(panos);
riePanel.visible = false;
riePanel.alignChildren = ['fill','top'];
var measurePanel = addVPanel(panos);
measurePanel.visible = false;
measurePanel.alignChildren = ['fill','top'];
var timeRemapPanel = addVPanel(panos);
timeRemapPanel.visible = false;
timeRemapPanel.alignChildren = ['fill','top'];
var exposurePanel = addVPanel(panos);
exposurePanel.visible = false;
exposurePanel.alignChildren = ['fill','top'];
var celPanel = addVPanel(panos);
celPanel.visible = false;
celPanel.alignChildren = ['fill','top'];
var wigglePanel = addVPanel(panos);
wigglePanel.visible = false;
wigglePanel.alignChildren = ['fill','top'];
var irPanel = addVPanel(panos);
irPanel.visible = false;
irPanel.alignChildren = ['fill','top'];
var randPanel = addVPanel(panos);
randPanel.visible = false;
randPanel.alignChildren = ['fill','top'];
var multiplanePanel = addVPanel(panos);
multiplanePanel.visible = false;
multiplanePanel.alignChildren = ['fill','top'];
var wheelPanel = addVPanel(panos);
wheelPanel.visible = false;
wheelPanel.alignChildren = ['fill','top'];
var springPanel = addVPanel(panos);
springPanel.visible = false;
springPanel.alignChildren = ['fill','top'];
var tvpCamPanel = addVPanel(panos);
tvpCamPanel.visible = false;
tvpCamPanel.alignChildren = ['fill','top'];
var autorigPanel = addVPanel(panos);
autorigPanel.visible = false;
autorigPanel.alignChildren = ['fill','top'];


function displayPanel() {
ctrlPanel.hide();
ikPanel.hide();
bezierIkPanel.hide();
renamePanel.hide();
riePanel.hide();
measurePanel.hide();
timeRemapPanel.hide();
exposurePanel.hide();
celPanel.hide();
wigglePanel.hide();
irPanel.hide();
randPanel.hide();
multiplanePanel.hide();
wheelPanel.hide();
springPanel.hide();
tvpCamPanel.hide();
autorigPanel.hide();
if (selecteur.selection == 0){
panoik.visible = true;
panoanimation.visible = false;
panointerpo.visible = false;
panocam.visible = false;
panosettings.visible = false;
helpPanel.visible = false;
app.settings.saveSetting('duik','pano','0');
if (!expertMode) selectorText.text = tr("Rigging");
}
else if (selecteur.selection == 1){
panoik.visible = false;
panoanimation.visible = true;
panointerpo.visible = false;
panocam.visible = false;
panosettings.visible = false;
helpPanel.visible = false;
app.settings.saveSetting('duik','pano','1');
if (!expertMode) selectorText.text = tr("Automation");
}
else if (selecteur.selection == 2){
panoik.visible = false;
panoanimation.visible = false;
panointerpo.visible = true;
panocam.visible = false;
panosettings.visible = false;
helpPanel.visible = false;
app.settings.saveSetting('duik','pano','2');
if (!expertMode) selectorText.text = tr("Animation");
}
else if (selecteur.selection == 3){
panoik.visible = false;
panoanimation.visible = false;
panointerpo.visible = false;
panocam.visible = true;
panosettings.visible = false;
helpPanel.visible = false;
app.settings.saveSetting('duik','pano','3');
if (!expertMode) selectorText.text = tr("Cameras");
}
else if (selecteur.selection == 4){
panoik.visible = false;
panoanimation.visible = false;
panointerpo.visible = false;
panocam.visible = false;
panosettings.visible = true;
helpPanel.visible = false;
app.settings.saveSetting('duik','pano','4');
if (!expertMode) selectorText.text = tr("Settings");
}
else if (selecteur.selection == 5){
panoik.visible = false;
panoanimation.visible = false;
panointerpo.visible = false;
panocam.visible = false;
panosettings.visible = false;
helpPanel.visible = true;
app.settings.saveSetting('duik','pano','5');
if (!expertMode) selectorText.text = tr("Help / About");
}
}

riggingPanelButton.onClick = function () { selecteur.selection = 0 ; displayPanel(); };
automationPanelButton.onClick = function () { selecteur.selection = 1 ; displayPanel(); };
animationPanelButton.onClick = function () { selecteur.selection = 2 ; displayPanel(); };
camerasPanelButton.onClick = function () { selecteur.selection = 3 ; displayPanel(); };
settingsPanelButton.onClick = function () { selecteur.selection = 4 ; displayPanel(); };
helpPanelButton.onClick = function () { selecteur.selection = 5 ; displayPanel(); };

selecteur.onChange = displayPanel;
selecteur.selection = eval(app.settings.getSetting('duik','pano'));
}

//--------------
// SUB PANELS
//--------------

// HELP
{
helpPanel.alignment = ['fill','top'];
helpPanel.alignChildren = ['fill','top'];
helpPanel.add('image',undefined,dossierIcones + 'logo.png');
var helpURL = helpPanel.add('statictext',undefined,'www.rainboxprod.coop');
helpURL.alignment = ['center','top'];
var helpTestGroup = addVPanel(helpPanel);
helpTestGroup.margins = 10;
/*helpTestGroup.add('statictext',undefined,tr("Warning, this is a version for testing purposes only!"));
helpTestGroup.add('statictext',undefined,tr("It may or may not be shipped with a lot of bugs."));
helpTestGroup.add('statictext',undefined,tr("A form is available at http://duiktest.duduf.net"));
helpTestGroup.add('statictext',undefined,tr("to report bugs or make suggestions!"));*/
var helpLinksGroup = addVPanel(helpPanel);
helpLinksGroup.margins = 10;
helpLinksGroup.add('statictext',undefined,tr("If you need help using Duik,"));
helpLinksGroup.add('statictext',undefined,tr("those resources can be useful:"));
/*helpTrainingURL = helpLinksGroup.add('statictext',undefined,'• ' + tr("Duduf Training, documents and tutorials:"));
helpTrainingURL = helpLinksGroup.add('statictext',undefined,'www.duduf.training');*/
helpForumURL = helpLinksGroup.add('statictext',undefined,'• ' + tr("Rainbox Forum, where you can ask your questions:"));
helpForumURL = helpLinksGroup.add('statictext',undefined,'forum.rainboxprod.coop');
var helpLicenseGroup = addVPanel(helpPanel);
helpLicenseGroup.margins = 10;
helpLicenseGroup.add('statictext',undefined,tr("License: Duik is free software,"));
helpLicenseGroup.add('statictext',undefined,tr("released under the GNU-GPL v3"));
var helpCreditsGroup = addVPanel(helpPanel);
helpCreditsGroup.margins = 10;
helpCreditsGroup.add('statictext',undefined,tr("Credits:"));
helpCreditsGroup.add('statictext',undefined,tr("Nicolas Dufresne - Lead developper") );
helpCreditsGroup.add('statictext',undefined,tr("Kevin Schires - Including images in the script") );
helpCreditsGroup.add('statictext',undefined,tr("Eric Epstein - IK with 3D Layers"));
helpCreditsGroup.add('statictext',undefined,tr("Zeg - UI designer"));
}

// SETTINGS
{
panosettings.alignment = ['fill','top'];
panosettings.alignChildren = ['fill','top'];
var settingsDropdown = panosettings.add('dropdownlist',undefined,[tr("General"),tr("Rigging"),tr("Animation")]);
var settingsGroup = addVPanel(panosettings);
settingsGroup.orientation = 'stack';
settingsGroup.alignChildren = ['center','top'];

var settingsgeneralGroup = addVGroup(settingsGroup);
var settingsRiggingGroup = addVGroup(settingsGroup);
var settingsAnimationGroup = addVGroup(settingsGroup);

settingsDropdown.onChange = function() {
if (settingsDropdown.selection == 0) {
settingsgeneralGroup.visible = true;
settingsRiggingGroup.visible = false;
settingsAnimationGroup.visible = false;
}
else if (settingsDropdown.selection == 1) {
settingsgeneralGroup.visible = false;
settingsRiggingGroup.visible = true;
settingsAnimationGroup.visible = false;
}
else if (settingsDropdown.selection == 2) {
settingsgeneralGroup.visible = false;
settingsRiggingGroup.visible = false;
settingsAnimationGroup.visible = true;
}
}
settingsDropdown.selection = 0;


//GENERAL
var settingsUIGroup = addBox(settingsgeneralGroup,tr("UI"));

//language
var groupeLangues = settingsUIGroup.add('group');
groupeLangues.alignment = ['left','center'];
groupeLangues.add('statictext',undefined,tr("Language :"));

var availableLanguages = [tr("English")];
for (var i = 0 ; i < Dutranslator.languages.length ; i++)
{
availableLanguages.push(Dutranslator.languages[i][1]);
}
var boutonlangue = groupeLangues.add('dropdownlist',undefined,availableLanguages);
boutonlangue.selection = 0;
for (var i = 0 ; i < Dutranslator.languages.length ; i++)
{
if (Dutranslator.languages[i][0] == Dutranslator.current)
{
boutonlangue.selection = i+1;
break;
}
}
boutonlangue.onChange = choixLangue;

addSeparator(settingsUIGroup,'');
settingsUIGroup.add('statictext',undefined,tr("Panel selector:"));
var dropDownSelectorButton = settingsUIGroup.add('radiobutton',undefined,tr("Use dropdown"));
dropDownSelectorButton.value = eval(app.settings.getSetting('duik', 'dropDownSelector'));
dropDownSelectorButton.onClick = function(){
app.settings.saveSetting('duik','dropDownSelector',dropDownSelectorButton.value);
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
var buttonsSelectorButton = settingsUIGroup.add('radiobutton',undefined,tr("Use buttons"));
buttonsSelectorButton.value = eval(app.settings.getSetting('duik', 'dropDownSelector'));
buttonsSelectorButton.value = !eval(app.settings.getSetting('duik', 'dropDownSelector'));
buttonsSelectorButton.onClick = function(){
app.settings.saveSetting('duik','dropDownSelector',dropDownSelectorButton.value);
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
addSeparator(settingsUIGroup,'');
var expertModeButton = settingsUIGroup.add('checkbox',undefined,tr("Expert Mode"));
expertModeButton.value = eval(app.settings.getSetting('duik', 'expertMode'));
expertModeButton.onClick = function(){app.settings.saveSetting('duik','expertMode',expertModeButton.value)};
var settingsUpdatesGroup = addBox(settingsgeneralGroup,tr("Updates"));
var boutonVMAJ = settingsUpdatesGroup.add('checkbox',undefined,tr("Check for update at startup"));
if (app.settings.getSetting('duik', 'version') == 'oui') {boutonVMAJ.value = true; }
boutonVMAJ.onClick = function() {
if (boutonVMAJ.value) {app.settings.saveSetting('duik','version','oui');} else {app.settings.saveSetting('duik','version','non');}
}
var boutonMAJ = settingsUpdatesGroup.add('button',undefined,tr("Check for updates"));
boutonMAJ.onClick = function() {
if (version == checkForUpdate(version,true)) { alert(tr("Duik is up-to-date")); };
}

//boutons options bones et controleurs
var settingsBonesGroup = addBox(settingsRiggingGroup,tr("Bones"));
//type de bones
var groupeBoneType = addHGroup(settingsBonesGroup);
groupeBoneType.add('statictext',undefined,tr("Type :"));
var boutonBoneType = groupeBoneType.add('dropdownlist',undefined,[tr("Solid"),tr("Null")]);
boutonBoneType.selection = Duik.settings.boneType;
boutonBoneType.onChange = function() {
boutonBoneColor.enabled = boutonBoneType.selection == 0;
Duik.settings.boneType = boutonBoneType.selection.index;
Duik.settings.save();
};
//taille des bones
var groupeBoneSize = addHGroup(settingsBonesGroup);
var groupeBoneSizeAuto = addHGroup(settingsBonesGroup);
groupeBoneSize.add('statictext',undefined,tr("Size :"));
var boutonBoneSize = groupeBoneSize.add('edittext',undefined,app.settings.getSetting('duik', 'boneSize'));
boutonBoneSize.onChange = function() {
Duik.settings.boneSize = parseInt(boutonBoneSize.text);
Duik.settings.save();
};
boutonBoneSize.text = Duik.settings.boneSize
//taille auto des bones
var boutonBoneSizeAuto = groupeBoneSizeAuto.add('checkbox',undefined,tr("Auto size"));
boutonBoneSizeAuto.onClick = function() {
boutonBoneSize.enabled = !boutonBoneSizeAuto.value;
boutonBoneSizeAutoValue.enabled = boutonBoneSizeAuto.value;
Duik.settings.boneSizeAuto = boutonBoneSizeAuto.value;
Duik.settings.save();
};
boutonBoneSizeAuto.value = Duik.settings.boneSizeAuto;
boutonBoneSizeAuto.alignment = ['fill','bottom'];
//size hint des bones
var boutonBoneSizeAutoValue = groupeBoneSizeAuto.add('dropdownlist',undefined,[tr("Small"),tr("Medium"),tr("Big")]);
boutonBoneSizeAutoValue.selection = Duik.settings.boneSizeHint;
boutonBoneSizeAutoValue.onChange = function () {
Duik.settings.boneSizeHint = boutonBoneSizeAutoValue.selection.index;
Duik.settings.save();
};
boutonBoneSize.enabled = !boutonBoneSizeAuto.value ;
boutonBoneSizeAutoValue.enabled = boutonBoneSizeAuto.value ;
//bone color
var groupeBoneColor = addHGroup(settingsBonesGroup);
groupeBoneColor.add('statictext',undefined,tr("Color:"));
var boutonBoneColorSharp = groupeBoneColor.add('statictext',undefined,'#');
boutonBoneColorSharp.alignment = ['right','fill'];
var boutonBoneColor = groupeBoneColor.add('edittext',undefined,'FF0000');
boutonBoneColor.onChange = function() {
Duik.settings.boneColor = boutonBoneColor.text;
Duik.settings.save();
};
boutonBoneColor.text = Duik.settings.boneColor;
boutonBoneColor.enabled = boutonBoneType.selection == 0;
var groupeBoneLocation = addHGroup(settingsBonesGroup);
groupeBoneLocation.add('statictext',undefined,tr("Placement"))
var boutonBonePlacement = groupeBoneLocation.add('dropdownlist',undefined,[tr("Top"),tr("Bottom"),tr("Over layer"),tr("Under layer")]);
boutonBonePlacement.selection = Duik.settings.bonePlacement;
boutonBonePlacement.onChange = function() {
Duik.settings.bonePlacement = boutonBonePlacement.selection.index;
Duik.settings.save();
};

var settingsCtrlGroup = addBox(settingsRiggingGroup,tr("Controllers"));
//controller types
var groupeCtrlType = addHGroup(settingsCtrlGroup);
groupeCtrlType.add('statictext',undefined,tr("Type"));
var boutonCtrlType = groupeCtrlType.add('dropdownlist',undefined,[tr("Null"),tr("Icon")]);
boutonCtrlType.selection = Duik.settings.controllerType-1;
boutonCtrlType.onChange = function() {
Duik.settings.controllerType = boutonCtrlType.selection.index+1;
Duik.settings.save();
};
var groupeCtrlLocation = addHGroup(settingsCtrlGroup);
groupeCtrlLocation.add('statictext',undefined,tr("Placement"));
var boutonCtrlPlacement = groupeCtrlLocation.add('dropdownlist',undefined,[tr("Top"),tr("Bottom"),tr("Over layer"),tr("Under layer")]);
boutonCtrlPlacement.selection = Duik.settings.ctrlPlacement;
boutonCtrlPlacement.onChange = function() {
Duik.settings.ctrlPlacement = boutonCtrlPlacement.selection.index;
Duik.settings.save();
};

//Interpolations
var settingsInterpolationsGroup = addBox(settingsAnimationGroup,tr("Interpolations"));
var settingsInteractiveUpdateButton = settingsInterpolationsGroup.add('checkbox',undefined,tr("Interactive update"));
settingsInteractiveUpdateButton.helpTip = tr("Warning, interactive update can create a LOT of history items (Undos) and could easily fill up your entire history.");
settingsInteractiveUpdateButton.value = eval(app.settings.getSetting('duik','interactiveUpdate'));
settingsInteractiveUpdateButton.onClick = function () {
if (settingsInteractiveUpdateButton.value)
{
if (confirm(tr("Are you sure you want to activate interactive update?\n\nInteractive update can create a LOT of history items (Undos) and could easily fill up your entire history."),true,tr("Interactive update")))
{
app.settings.saveSetting('duik','interactiveUpdate','true');
}
else
{
settingsInteractiveUpdateButton.value = false;
}
}
else
{
app.settings.saveSetting('duik','interactiveUpdate','false');
}
}
var settingsInterpolationSliders = settingsInterpolationsGroup.add('radiobutton',undefined,tr("Use sliders"));
var settingsInterpolationButtons = settingsInterpolationsGroup.add('radiobutton',undefined,tr("Use buttons"));
function settingsInterpolationControlType() {
app.settings.saveSetting('duik','interpolationSliders',settingsInterpolationSliders.value);
settingsInteractiveUpdateButton.enabled = settingsInterpolationSliders.value;
alert(tr("Duik must be restarted to apply changes."))
}
settingsInterpolationSliders.onClick = settingsInterpolationButtons.onClick = settingsInterpolationControlType;

settingsInterpolationSliders.value = eval(app.settings.getSetting('duik','interpolationSliders'));
settingsInterpolationButtons.value = !eval(app.settings.getSetting('duik','interpolationSliders'));
settingsInteractiveUpdateButton.enabled = settingsInterpolationSliders.value;

//copy paste animation
var settingsPaGroup = addBox(settingsAnimationGroup,tr("Copy/paste"));
var pauiNamesButton = settingsPaGroup.add('radiobutton',undefined,tr("Use layer names"));
var pauiIndexesButton = settingsPaGroup.add('radiobutton',undefined,tr("Use layer indexes"));
var pauiSelectionButton = settingsPaGroup.add('radiobutton',undefined,tr("Use selection order"));
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
var boutonautorig = addIconButton(panoik,'btn_autorig.png',tr("Auto-Rig")) ;
boutonautorig.onClick = function () {panoik.hide();autorigPanel.show();};
boutonautorig.helpTip = tr("Autorig");
//boutonautorig.helpTip = 'tip a ecrire';
var groupeik = addHGroup(panoik);
var groupeikG = addVGroup(groupeik);
var groupeikD = addVGroup(groupeik);
//bouton pour creer l'IK
var boutonik = addIconButton(groupeikG,'btn_creer.png',tr("IK"));
boutonik.onClick = ik;
boutonik.helpTip = tr("IK");
//bouton pour creer un goal
var boutongoal = addIconButton(groupeikD,'btn_goal.png',tr("IK Goal"));
boutongoal.onClick = pregoal;
boutongoal.helpTip = tr("Selected layer will keep its orientation, despite the transformations of its parent");
//bezier IK button
var bezierIKButton = addIconButton(groupeikG,'btn_bezier.png',tr("Bezier IK"));
bezierIKButton.onClick = function() { panoik.hide(); bezierIkPanel.show();}
bezierIKButton.helpTip = tr("Move layers as a Bezier curve");
//bouton rotmorph
var boutonrotmorph = addIconButton(groupeikD,'btn_rotmorph.png',tr("Rot Morph"));
boutonrotmorph.onClick = rotmorph;
boutonrotmorph.helpTip = tr("'Morphs' the property based on a layer rotation");
//bouton controleur
var controllerButton =  addIconButton(groupeikG,'btn_controleur.png',tr("Controllers"));
controllerButton.onClick = function () { controllersFromRiggingPanel = true; controllerButtonClicked(); };
controllerButton.helpTip = tr("Controller");
//bouton bone
var boutonbone2 = addIconButton(groupeikD,'btn_bones.png',tr("Bones"));
boutonbone2.onClick = bone;
boutonbone2.helpTip = tr("Creates a bone on a point of an effect");
//bouton zero
var boutonzero2 = addIconButton(groupeikG,'btn_zero.png',tr("Zero"));
boutonzero2.onClick = zero;
boutonzero2.helpTip = tr("Creates a \"Zero\" object on a layer");
//list button
var listButton = addIconButton(groupeikD,'btn_list.png',tr("List"));
listButton.onClick = listButtonClicked;
listButton.helpTip = tr("Adds an animation list on the property");
//bouton renommer
var boutonrename = addIconButton(groupeikG,'btn_renommer.png',tr("Rename"));
boutonrename.onClick = function() { panoik.hide(); renamePanel.show();}
boutonrename.helpTip = tr("Rename layers");
//bouton mesurer
var boutonmesurer = addIconButton(groupeikD,'btn_mesurer.png',tr("Measure"));
boutonmesurer.onClick = function () {mesure();panoik.hide();measurePanel.show();};
boutonmesurer.helpTip = tr("Measure distance between two layers");
//replace in expressions button
var rieButton = addIconButton(groupeikG,'btn_replaceinexpr.png',tr("Replace"));
rieButton.onClick = function () { panoik.hide(); riePanel.show();}
rieButton.helpTip = tr("Search and replace text in expressions");
//lock button
var lockButton = addIconButton(groupeikD,'ctrl_lock.png',tr("Lock property"));
lockButton.onClick = lockButtonClicked;
lockButton.helpTip = tr("Locks the selected property");
}

// ANIMATION
{
// INTERPOLATIONS
{
//addSeparator(panointerpo,'Interpolation type');

//Interpolation types
var groupeInterpoClefs = addHGroup(panointerpo);
var rovingButton = groupeInterpoClefs.add('iconbutton',undefined,dossierIcones + 'interpo_roving.png');
rovingButton.size = [20,20];
rovingButton.onClick = roving;
rovingButton.helpTip = tr("Roving");
var boutonLineaire = groupeInterpoClefs.add('iconbutton',undefined,dossierIcones + 'interpo_lineaire.png');
boutonLineaire.size = [20,20];
boutonLineaire.onClick = lineaire;
boutonLineaire.helpTip = tr("Linear Interpolation");
var boutonLissageA = groupeInterpoClefs.add('iconbutton',undefined,dossierIcones + 'interpo_lissagea.png');
boutonLissageA.size = [20,20];
boutonLissageA.onClick = lissageA;
boutonLissageA.helpTip = tr("Ease In");
var boutonLissageE = groupeInterpoClefs.add('iconbutton',undefined,dossierIcones + 'interpo_lissagee.png');
boutonLissageE.size = [20,20];
boutonLissageE.onClick = lissageE;
boutonLissageE.helpTip = tr("Ease Out");
var boutonLissage = groupeInterpoClefs.add('iconbutton',undefined,dossierIcones + 'interpo_bezier.png');
boutonLissage.size = [20,20];
boutonLissage.onClick = lissage;
boutonLissage.helpTip = tr("Easy Ease");
var boutonContinu = groupeInterpoClefs.add('iconbutton',undefined,dossierIcones + 'interpo_continu.png');
boutonContinu.size = [20,20];
boutonContinu.onClick = continu;
boutonContinu.helpTip = tr("Auto Bezier");
var boutonMaintien = groupeInterpoClefs.add('iconbutton',undefined,dossierIcones + 'interpo_maintien.png');
boutonMaintien.size = [20,20];
boutonMaintien.onClick = maintien;
boutonMaintien.helpTip = tr("Hold");

//presets
var interpoPresetsGroup = addHGroup(panointerpo);
var interpoPresetsList = interpoPresetsGroup.add('dropdownlist',undefined,eval(app.settings.getSetting('duik', 'interpolationPresets')));
interpoPresetsList.selection = 0;
interpoPresetsList.onChange = interpoPresetsListChanged;
var interpoPresetsAddButton = addIconButton(interpoPresetsGroup,'btn_add.png','');
interpoPresetsAddButton.alignment = ['right','fill'];
interpoPresetsAddButton.onClick = interpoPresetsAddButtonClicked;
var interpoPresetsRemoveButton = addIconButton(interpoPresetsGroup,'btn_remove.png','');
interpoPresetsRemoveButton.alignment = ['right','fill'];
interpoPresetsRemoveButton.onClick = interpoPresetsRemoveButtonClicked;

//speed
var interpoSpeedGroup = addHGroup(panointerpo);
var interpoSpeedButtonGroupe = addIconCheckbox(interpoSpeedGroup,'btn_interpo_speed.png','');
var interpoSpeedButton = interpoSpeedButtonGroupe.button;
interpoSpeedButtonGroupe.alignment = ['left','center'];
interpoSpeedButton.helpTip = tr("Speed");
interpoSpeedButtonGroupe.size = [40,10];
interpoSpeedButton.onClick = function ()
{
interpoSpeedSlider.enabled = interpoSpeedButton.value;
interpoSpeedEdit.enabled = interpoSpeedButton.value;
}
var interpoSpeedSlider = interpoSpeedGroup.add('slider',undefined,0,-1000,1000);
interpoSpeedSlider.alignment = ['fill','center'];
interpoSpeedSlider.onChanging = function ()
{
var val = Math.round(interpoSpeedSlider.value);
interpoSpeedEdit.text = val;
if (settingsInteractiveUpdateButton.value) infl();
}
interpoSpeedSlider.onChange = function ()
{
interpoPresetsList.selection = 0;
infl();
}
var interpoSpeedEdit = interpoSpeedGroup.add('edittext',undefined,'0');
interpoSpeedEdit.minimumSize = [30,10];
interpoSpeedEdit.alignment = ['right','fill'];
interpoSpeedEdit.onChanging = function () {
var val = parseInt(interpoSpeedEdit.text);
if (!val) return;
interpoSpeedSlider.value = val;
interpoPresetsList.selection = 0;
infl();
}
interpoSpeedEdit.onChange = infl;

interpoSpeedSlider.enabled = false;
interpoSpeedEdit.enabled = false;

//interpolation influences
//addSeparator(panointerpo,'Interpolation influence');

var interpoInGroup = addHGroup(panointerpo);
var boutonApprocheGroupe = addIconCheckbox(interpoInGroup,'btn_interpo_lis.png','');
boutonApproche = boutonApprocheGroupe.button;
boutonApproche.helpTip = tr("Ease In influence");
boutonApprocheGroupe.alignment = ['left','center'];
boutonApprocheGroupe.size = [40,10];
boutonApproche.value = true;
boutonApproche.enabled = false;
boutonApproche.onClick = function ()
{
interpoInSlider.enabled = boutonApproche.value;
interpoInEdit.enabled = boutonApproche.value;
}
var interpoInSliderGroup = addHGroup(interpoInGroup);
interpoInSliderGroup.orientation = 'stack';
var interpoInSlider = interpoInSliderGroup.add('slider',undefined,33,1,100);
interpoInSlider.alignment = ['fill','center'];
interpoInSlider.onChanging = function ()
{
var val = Math.round(interpoInSlider.value);
interpoInEdit.text = val;
if (interpoLockInfluencesButton.value)
{
interpoOutSlider.value = val;
interpoOutEdit.text = val;
}
if (settingsInteractiveUpdateButton.value) infl();
}
interpoInSlider.onChange = function ()
{
interpoPresetsList.selection = 0;
infl();
}
var interpoInSliderButtonsGroup = addHGroup(interpoInSliderGroup);
var interpoIn1 = interpoInSliderButtonsGroup.add('button',undefined,"1");
interpoIn1.onClick = function ()
{
interpoPresetsList.selection = 0;
interpoInEdit.text = "1";
if (interpoLockInfluencesButton.value)
{
interpoOutEdit.text = "1";
}
infl();
}
var interpoIn10 = interpoInSliderButtonsGroup.add('button',undefined,"10");
interpoIn10.onClick = function ()
{
interpoPresetsList.selection = 0;
interpoInEdit.text = "10";
if (interpoLockInfluencesButton.value)
{
interpoOutEdit.text = "10";
}
infl();
}
var interpoIn25 = interpoInSliderButtonsGroup.add('button',undefined,"25");
interpoIn25.onClick = function ()
{
interpoPresetsList.selection = 0;
interpoInEdit.text = "25";
if (interpoLockInfluencesButton.value)
{
interpoOutEdit.text = "25";
}
infl();
}
var interpoIn50 = interpoInSliderButtonsGroup.add('button',undefined,"50");
interpoIn50.onClick = function ()
{
interpoPresetsList.selection = 0;
interpoInEdit.text = "50";
if (interpoLockInfluencesButton.value)
{
interpoOutEdit.text = "50";
}
infl();
}
var interpoIn75 = interpoInSliderButtonsGroup.add('button',undefined,"75");
interpoIn75.onClick = function ()
{
interpoPresetsList.selection = 0;
interpoInEdit.text = "75";
if (interpoLockInfluencesButton.value)
{
interpoOutEdit.text = "75";
}
infl();
}
var interpoIn90 = interpoInSliderButtonsGroup.add('button',undefined,"90");
interpoIn90.onClick = function ()
{
interpoPresetsList.selection = 0;
interpoInEdit.text = "90";
if (interpoLockInfluencesButton.value)
{
interpoOutEdit.text = "90";
}
infl();
}
var interpoIn100 = interpoInSliderButtonsGroup.add('button',undefined,"100");
interpoIn100.onClick = function ()
{
interpoPresetsList.selection = 0;
interpoInEdit.text = "100";
if (interpoLockInfluencesButton.value)
{
interpoOutEdit.text = "100";
}
infl();
}
if (eval(app.settings.getSetting('duik','interpolationSliders'))) interpoInSliderButtonsGroup.hide();
else interpoInSlider.hide();

var interpoInEdit = interpoInGroup.add('edittext',undefined,'33');
interpoInEdit.minimumSize = [30,10];
interpoInEdit.alignment = ['right','fill'];
interpoInEdit.onChanging = function () {
var val = parseInt(interpoInEdit.text);
if (!val) return;
interpoInSlider.value = val;
if (interpoLockInfluencesButton.value)
{
interpoOutSlider.value = val;
interpoOutEdit.text = val;
}
interpoPresetsList.selection = 0;
infl();
}

var groupeInterpoOut = addHGroup(panointerpo);
groupeInterpoOut.visible = false;
var boutonEloignementGroupe = addIconCheckbox(groupeInterpoOut,'btn_interpo_out.png','');
boutonEloignement = boutonEloignementGroupe.button,
boutonEloignement.helpTip = tr("Ease Out influence");
boutonEloignementGroupe.alignment = ['left','center'];
boutonEloignementGroupe.size = [40,10];
boutonEloignement.value = true;
boutonEloignement.onClick = function ()
{
interpoOutSlider.enabled = boutonEloignement.value;
interpoOutEdit.enabled = boutonEloignement.value;
}
var interpoOutSliderGroup = addHGroup(groupeInterpoOut);
interpoOutSliderGroup.orientation = 'stack';
var interpoOutSlider = interpoOutSliderGroup.add('slider',undefined,33,1,100);
interpoOutSlider.alignment = ['fill','center'];
interpoOutSlider.onChanging = function()
{
var val = Math.round(interpoOutSlider.value);
interpoOutEdit.text = val;
if (settingsInteractiveUpdateButton.value) infl();
}
interpoOutSlider.onChange = function ()
{
interpoPresetsList.selection = 0;
infl();
}
var interpoOutSliderButtonsGroup = addHGroup(interpoOutSliderGroup);
var interpoOut1 = interpoOutSliderButtonsGroup.add('button',undefined,"1");
interpoOut1.onClick = function ()
{
interpoPresetsList.selection = 0;
interpoOutEdit.text = "1";
infl();
}
var interpoOut10 = interpoOutSliderButtonsGroup.add('button',undefined,"10");
interpoOut10.onClick = function ()
{
interpoPresetsList.selection = 0;
interpoOutEdit.text = "10";
infl();
}
var interpoOut25 = interpoOutSliderButtonsGroup.add('button',undefined,"25");
interpoOut25.onClick = function ()
{
interpoPresetsList.selection = 0;
interpoOutEdit.text = "25";
infl();
}
var interpoOut50 = interpoOutSliderButtonsGroup.add('button',undefined,"50");
interpoOut50.onClick = function ()
{
interpoPresetsList.selection = 0;
interpoOutEdit.text = "50";
infl();
}
var interpoOut75 = interpoOutSliderButtonsGroup.add('button',undefined,"75");
interpoOut75.onClick = function ()
{
interpoPresetsList.selection = 0;
interpoOutEdit.text = "75";
infl();
}
var interpoOut90 = interpoOutSliderButtonsGroup.add('button',undefined,"90");
interpoOut90.onClick = function ()
{
interpoPresetsList.selection = 0;
interpoOutEdit.text = "90";
infl();
}
var interpoOut100 = interpoOutSliderButtonsGroup.add('button',undefined,"100");
interpoOut100.onClick = function ()
{
interpoPresetsList.selection = 0;
interpoOutEdit.text = "100";
infl();
}
if (eval(app.settings.getSetting('duik','interpolationSliders'))) interpoOutSliderButtonsGroup.hide();
else interpoOutSlider.hide();

var interpoOutEdit = groupeInterpoOut.add('edittext',undefined,'33');
interpoOutEdit.alignment = ['right','fill'];
interpoOutEdit.minimumSize = [30,10];
interpoOutEdit.onChanging = function () {
var val = parseInt(interpoOutEdit.text);
if (!val) return;
interpoOutSlider.value = val;
interpoPresetsList.selection = 0;
infl();
}


var interoInfluTopGroup = addHGroup(panointerpo);
interpoLockInfluencesButtonGroup = addIconCheckbox(interoInfluTopGroup,'btn_interpo_lock.png','');
interpoLockInfluencesButton = interpoLockInfluencesButtonGroup.button;
interpoLockInfluencesButton.alignment = ['left','bottom'];
interpoLockInfluencesButton.value = true;
interpoLockInfluencesButton.onClick = function ()
{
if (interpoLockInfluencesButton.value)
{
boutonApproche.value = true;
boutonApproche.enabled = false;
boutonEloignement.value = true;
interpoInSlider.enabled = true;
interpoInEdit.enabled = true;
groupeInterpoOut.visible = false;
interpoOutSlider.value = parseInt(interpoInEdit.text);
interpoOutEdit.text = parseInt(interpoInEdit.text);$
boutonApprocheGroupe.img.image = ScriptUI.newImage(dossierIcones + 'btn_interpo_lis.png');
interpoLockInfluencesButtonGroup.img.image = ScriptUI.newImage(dossierIcones + 'btn_interpo_lock.png');
}
else
{
boutonApproche.enabled = true;
groupeInterpoOut.visible = true;
boutonApprocheGroupe.img.image = ScriptUI.newImage(dossierIcones + 'btn_interpo_in.png');
interpoLockInfluencesButtonGroup.img.image = ScriptUI.newImage(dossierIcones + 'btn_interpo_unlock.png');
}
}
var interpoGetInflButton = addIconButton(interoInfluTopGroup,'btn_getkey.png',tr("Get"));
interpoGetInflButton.size = [30,22];
interpoGetInflButton.onClick = interpoGetInflButtonClicked;
var boutonInfluence = addIconButton(interoInfluTopGroup,'btn_valid.png',tr("Set"));
boutonInfluence.size = [30,22];
boutonInfluence.onClick = infl;

//spatial interpolation
addSeparator(panointerpo,tr("Spatial interpolation"));
var interpoSpatialGroup = addHGroup(panointerpo);
var interpoSpatialLinButton = addIconButton(interpoSpatialGroup,'btn_spatiallin.png',tr("Linear"));
interpoSpatialLinButton.onClick = interpoSpatialLinButtonClicked;
var interpoSpatialLBezButton = addIconButton(interpoSpatialGroup,'btn_spatialbez.png',tr("Bezier"));
interpoSpatialLBezButton.onClick = interpoSpatialLBezButtonClicked;

}

addSeparator(panointerpo,tr("Tools"));

// TOOLS
{

var morpherGroup = addHGroup(panointerpo);
var boutonMoprher = addIconButton(morpherGroup,'btn_morph.png',tr("Morpher"));
boutonMoprher.onClick = morpher;
boutonMoprher.helpTip = tr("Create Morpher");
var boutonMKey = morpherGroup.add('checkbox',undefined,tr("Keyframes"));
boutonMKey.value = true;
boutonMKey.alignment = ['fill','center'];

animationToolsGroup = addHGroup(panointerpo);

var animationToolsGroupL = addVGroup(animationToolsGroup);
var animationToolsGroupR = addVGroup(animationToolsGroup);


//bouton Copy ANIM
var boutonCopyAnim = addIconButton(animationToolsGroupL,'/btn_copy.png',tr("Copy anim"));
boutonCopyAnim.onClick = function ca() { animationSaved = copyAnim() };
boutonCopyAnim.helpTip = tr("Copy animation from selected layers");
//bouton Paste ANIM
var boutonPasteAnim = addIconButton(animationToolsGroupR,'/btn_paste.png',tr("Paste anim"));
boutonPasteAnim.onClick = function pa() { pasteAnim(animationSaved) };
boutonPasteAnim.helpTip = tr("Automatically paste animation in the comp (using layer names)");
//Cel
var celButton = addIconButton(animationToolsGroupL,'btn_cel.png',tr("Cel animation"));
celButton.helpTip = tr("Cel animation tools");
celButton.onClick = function () { panointerpo.hide(); celPanel.show(); } ;
//controllers
var controllerButton2 =  addIconButton(animationToolsGroupR,'btn_controleur.png',tr("Controllers"));
controllerButton2.onClick = function () { controllersFromRiggingPanel = false; controllerButtonClicked(); };
controllerButton2.helpTip = tr("Controllers");

var importRigButton = addIconButton(panointerpo,'/btn_importrig.png',tr("Import rig in comp"));
importRigButton.onClick = function () { panointerpo.hide(); irRigRefreshButtonClicked(); irPanel.show(); };
importRigButton.helpTip = tr("Automatically imports a rig in the active comp, transfering the controllers and taking care of duplicates.");

}

}

// AUTOMATION
{
animationMainGroup = addHGroup(panoanimation);

var groupeAnimationG = addVGroup(animationMainGroup);
var groupeAnimationD = addVGroup(animationMainGroup);
//bouton wiggle
var boutonwiggle = addIconButton(groupeAnimationG,'btn_wiggle.png',tr("Wiggle"));
boutonwiggle.onClick = wiggle;
boutonwiggle.helpTip = tr("Create a wiggle function in a property of the selected layer");
//bouton swing
var boutonosc = addIconButton(groupeAnimationD,'btn_osc.png',tr("Swing"));
boutonosc.onClick = oscillation;
boutonosc.helpTip = tr("Create an oscillation on the selected property");
//bouton spring
var boutonspring = addIconButton(groupeAnimationG,'btn_rebond.png',tr("Spring"));
boutonspring.onClick = boutonspringClicked;
boutonspring.helpTip = tr("The property will automatically bounce like a spring");
//Blink
var blinkButton = addIconButton(groupeAnimationD,'/btn_blink.png',tr("Blink"));
blinkButton.onClick = blinkButtonClicked;
blinkButton.helpTip = tr("Makes the property blink.");

//bouton path follow
var boutonpathfollow = addIconButton(groupeAnimationG,'btn_pf.png',tr("Orient to path"));
boutonpathfollow.onClick = pathFollow;
boutonpathfollow.helpTip = tr("Auto orientation of the layer along its path");
//bouton roue
var boutonroue = addIconButton(groupeAnimationD,'btn_roue.png',tr("Wheel"));
boutonroue.onClick = function () { panoanimation.hide(); wheelPanel.show(); };
boutonroue.helpTip = tr("Automates the rotation of a wheel while moving the layer");
//bouton lentille
var boutonlentille = addIconButton(groupeAnimationG,'/btn_lentille.png',tr("Lens"));
boutonlentille.onClick = lentille;
boutonlentille.helpTip = tr("Creates a lens flare with selected layers");
//MoveAway
var moveAwayButton = addIconButton(groupeAnimationD,'btn_moveaway.png',tr("Move away"));
moveAwayButton.onClick = moveAwayButtonClicked ;
moveAwayButton.helpTip = tr("A simple controller to move away a layer from its parent");
//bouton lien de distance
var boutondistance = addIconButton(groupeAnimationG,'btn_lien-de-distance.png',tr("Dist. link"));
boutondistance.onClick = distanceLink;
boutondistance.helpTip = tr("Links an effect with the distance with another layer");

//bouton exposure
var boutonnframes = addIconButton(groupeAnimationD,'btn_expo.png',tr("Exposure"));
boutonnframes.onClick = function () { panoanimation.hide(); exposurePanel.show(); } ;
boutonnframes.helpTip = tr("Changes the exposure of the animation on the selected property");

//Paint Rig button
var paintRigButton = addIconButton(groupeAnimationG,'/btn_paint.png',tr("Paint rigging"));
paintRigButton.onClick = paintRigButtonClicked;
paintRigButton.helpTip = tr("Rig the paint effects to be able to animate all strokes as if there was only one.");

//Paint Group
var paintGroupButton = addIconButton(groupeAnimationD,'btn_paintgroup.png',tr("Paint group"));
paintGroupButton.onClick = paintGroupButtonClicked ;
paintGroupButton.helpTip = tr("Rig the paint effects to be able to animate selected strokes as if there was only one.");

//randomize
var randButton = addIconButton(groupeAnimationG,'btn_rand.png',tr("Randomize"));
randButton.onClick = function () { panoanimation.hide(); randPanel.show(); } ;
randButton.helpTip = tr("Randomize properties and layers.");

//Timeremap
var timeRemapButton = addIconButton(groupeAnimationD,'btn_timeremap.png',tr("Time remap"));
timeRemapButton.onClick = function () { panoanimation.hide(); timeRemapPanel.show(); } ;
timeRemapButton.helpTip = tr("Time remapping tools.");
}

// CAMERAS
{
panocam.orientation = 'row';
var groupCameraG = addVGroup(panocam);
var groupCameraD = addVGroup(panocam);
//bouton pour creer une target cam
var boutontcam = addIconButton(groupCameraG,'btn_controleur-cam.png',tr("Control Cam"));
boutontcam.onClick = controlcam;
boutontcam.helpTip = tr("Creates animation controllers for a camera");
//scale Z-link button
var scaleZLinkButton = addIconButton(groupCameraD,'btn_scalezlink.png',tr("Scale Z-Link"));
scaleZLinkButton.onClick = scaleZLinkButtonClicked;
scaleZLinkButton.helpTip = tr("Links the distance of the layer from the camera to its scale, so its apparent size won't change.");
//bouton pour multiplan 2D
var boutontcam2d = addIconButton(groupCameraG,'btn_2dmultiplane.png',tr("2D Multiplane"));
boutontcam2d.onClick = function () {
panocam.hide() ;
//get number of layers
var comp = app.project.activeItem;
if (comp instanceof CompItem)
{
var numLayers = comp.selectedLayers.length;
if (numLayers) {
nombre.text = numLayers;
multiplaneSlider.value = numLayers;
}
}
multiplanePanel.show();
};
boutontcam2d.helpTip = tr("Creates multiplane controllers to use as a 2D camera");
//TVP Cam
var tvpCamButton = addIconButton(groupCameraD,'btn_tvpcam.png',tr("Import TVPaint Cam"));
tvpCamButton.onClick = function () {panocam.hide();tvpCamPanel.show();};
tvpCamButton.helpTip = tr("Imports a camera from TVPaint.");
}

//---------------
// DIALOGS
//---------------

//CONTROLLERS PANEL
{
var ctrlMainGroup = addHGroup(ctrlPanel);
ctrlMainGroup.spacing = 15;
var ctrlShapeGroup = addVGroup(ctrlMainGroup);
ctrlShapeGroup.alignChildren = ['fill','top'];
var ctrlShapeList = ctrlShapeGroup.add('dropdownlist',undefined,['','','','']);
ctrlShapeList.items[0].image = ScriptUI.newImage(dossierIcones + 'ctrl_transform.png');
ctrlShapeList.items[1].image = ScriptUI.newImage(dossierIcones + 'ctrl_arc.png');
ctrlShapeList.items[2].image = ScriptUI.newImage(dossierIcones + 'ctrl_eye.png');
ctrlShapeList.items[3].image = ScriptUI.newImage(dossierIcones + 'ctrl_cam.png');
ctrlShapeList.selection = 0;
var ctrlRotationGroup = addHGroup(ctrlShapeGroup);
var ctrlRotationButton = ctrlRotationGroup.add('checkbox',undefined,'');
ctrlRotationButton.value = true;
ctrlRotationButton.helpTip = tr("Rotation");
ctrlRotationButton.alignment = ['left','bottom'];
var ctrlRotationImage = ctrlRotationGroup.add('image',undefined,dossierIcones + 'ctrl_rot.png');
var ctrlXPositionGroup = addHGroup(ctrlShapeGroup);
var ctrlXPositionButton = ctrlXPositionGroup.add('checkbox',undefined,'');
ctrlXPositionButton.value = true;
ctrlXPositionButton.helpTip = tr("X position");
ctrlXPositionButton.alignment = ['left','bottom'];
var ctrlXPositionImage = ctrlXPositionGroup.add('image',undefined,dossierIcones + 'ctrl_xpos.png');
var ctrlYPositionGroup = addHGroup(ctrlShapeGroup);
var ctrlYPositionButton = ctrlYPositionGroup.add('checkbox',undefined,'');
ctrlYPositionButton.value = true;
ctrlYPositionButton.helpTip = tr("Y position");
ctrlYPositionButton.alignment = ['left','bottom'];
var ctrlYPositionImage = ctrlYPositionGroup.add('image',undefined,dossierIcones + 'ctrl_ypos.png');
var ctrlScaleGroup = addHGroup(ctrlShapeGroup);
var ctrlScaleButton = ctrlScaleGroup.add('checkbox',undefined,'');
ctrlScaleButton.alignment = ['left','bottom'];
ctrlScaleButton.helpTip = tr("Scale");
var ctrlScaleImage = ctrlScaleGroup.add('image',undefined,dossierIcones + 'ctrl_sca.png');


ctrlShapeList.onChange = function ()
{
var sel = ctrlShapeList.selection == 0;
if (sel)
{
ctrlRotationGroup.enabled = sel;
ctrlRotationImage.image = ScriptUI.newImage(dossierIcones + 'ctrl_rot.png');
ctrlXPositionGroup.enabled = sel;
ctrlXPositionImage.image = ScriptUI.newImage(dossierIcones + 'ctrl_xpos.png');
ctrlYPositionGroup.enabled = sel;
ctrlYPositionImage.image = ScriptUI.newImage(dossierIcones + 'ctrl_ypos.png');
ctrlScaleGroup.enabled = sel;
ctrlScaleImage.image = ScriptUI.newImage(dossierIcones + 'ctrl_sca.png');
}
else
{
ctrlRotationGroup.enabled = sel;
ctrlRotationImage.image = ScriptUI.newImage(dossierIcones + 'ctrl_rot_d.png');
ctrlXPositionGroup.enabled = sel;
ctrlXPositionImage.image = ScriptUI.newImage(dossierIcones + 'ctrl_xpos_d.png');
ctrlYPositionGroup.enabled = sel;
ctrlYPositionImage.image = ScriptUI.newImage(dossierIcones + 'ctrl_ypos_d.png');
ctrlScaleGroup.enabled = sel;
ctrlScaleImage.image = ScriptUI.newImage(dossierIcones + 'ctrl_sca_d.png');
}
}

var ctrlSettingsGroup = addVGroup(ctrlMainGroup);
ctrlSettingsGroup.alignChildren = ['fill','top'];

//size hint controllers
var ctrlSizeAutoGroup = addHGroup(ctrlSettingsGroup);
if (!expertMode) ctrlSizeAutoGroup.add('statictext',undefined,tr("Size"));
var ctrlSizeAutoList = ctrlSizeAutoGroup.add('dropdownlist',undefined,[tr("Small"),tr("Medium"),tr("Big"),tr("Custom")]);
ctrlSizeAutoList.selection = Duik.settings.controllerSizeHint;
if (!Duik.settings.controllerSizeAuto) ctrlSizeAutoList.selection = 3;
ctrlSizeAutoList.helpTip = tr("Auto-size");

//custom size
var ctrlSizeGroup = addHGroup(ctrlSettingsGroup);
if (!expertMode) ctrlSizeGroup.add('statictext',undefined,tr("Custom size"));
var ctrlSizeEdit = ctrlSizeGroup.add('edittext',undefined,app.settings.getSetting('duik', 'ctrlSize'));
ctrlSizeEdit.helpTip = tr("Custom size");
ctrlSizeEdit.text = Duik.settings.controllerSize;
ctrlSizeEdit.enabled = !Duik.settings.controllerSizeAuto ;

ctrlSizeEdit.onChange = function() {
Duik.settings.controllerSize = parseInt(ctrlSizeEdit.text);
Duik.settings.save();
};

ctrlSizeAutoList.onChange = function () {
if (ctrlSizeAutoList.selection.index < 3)
{
Duik.settings.controllerSizeAuto = true;
ctrlSizeEdit.enabled = false;
Duik.settings.controllerSizeHint = ctrlSizeAutoList.selection.index;
}
else
{
Duik.settings.controllerSizeAuto = false;
ctrlSizeEdit.enabled = true;
}
Duik.settings.save();
};

//color
var ctrlColorGroup = addHGroup(ctrlSettingsGroup);
if (!expertMode) ctrlColorGroup.add('statictext',undefined,tr("Color"));
var ctrlColorList = ctrlColorGroup.add('dropdownlist',undefined,[tr("Red"),tr("Green"),tr("Blue"),tr("Cyan"),tr("Magenta"),tr("Yellow"),tr("White"),tr("Light Gray"),tr("Dark Gray"),tr("Black"),tr("Custom")]);
ctrlColorList.helpTip = tr("Color");

if (Duik.settings.controllerColor.toSource() == Duik.colors.RED.toSource()) ctrlColorList.selection = 0;
else if (Duik.settings.controllerColor.toSource() == Duik.colors.GREEN.toSource()) ctrlColorList.selection = 1;
else if (Duik.settings.controllerColor.toSource() == Duik.colors.BLUE.toSource()) ctrlColorList.selection = 2;
else if (Duik.settings.controllerColor.toSource() == Duik.colors.CYAN.toSource()) ctrlColorList.selection = 3;
else if (Duik.settings.controllerColor.toSource() == Duik.colors.MAGENTA.toSource()) ctrlColorList.selection = 4;
else if (Duik.settings.controllerColor.toSource() == Duik.colors.YELLOW.toSource()) ctrlColorList.selection = 5;
else if (Duik.settings.controllerColor.toSource() == Duik.colors.WHITE.toSource()) ctrlColorList.selection = 6;
else if (Duik.settings.controllerColor.toSource() == Duik.colors.LIGHT_GRAY.toSource()) ctrlColorList.selection = 7;
else if (Duik.settings.controllerColor.toSource() == Duik.colors.DARK_GRAY.toSource()) ctrlColorList.selection = 8;
else if (Duik.settings.controllerColor.toSource() == Duik.colors.BLACK.toSource()) ctrlColorList.selection = 9;
else ctrlColorList.selection = 10;

var ctrlCustomColorGroup = addHGroup(ctrlSettingsGroup);
if (!expertMode) ctrlCustomColorGroup.add('statictext',undefined,tr("Custom color"));
var ctrlCustomColorSharp = ctrlCustomColorGroup.add('statictext',undefined,'#');
ctrlCustomColorSharp.alignment = ['left','fill'];
var ctrlCustomColorEdit = ctrlCustomColorGroup.add('edittext',undefined,Duik.utils.rvbColorToHex(Duik.settings.controllerColor));

ctrlColorList.onChange = function () {
if (ctrlColorList.selection == 0) Duik.settings.controllerColor = Duik.colors.RED;
else if (ctrlColorList.selection == 1) Duik.settings.controllerColor = Duik.colors.GREEN;
else if (ctrlColorList.selection == 2) Duik.settings.controllerColor = Duik.colors.BLUE;
else if (ctrlColorList.selection == 3) Duik.settings.controllerColor = Duik.colors.CYAN;
else if (ctrlColorList.selection == 4) Duik.settings.controllerColor = Duik.colors.MAGENTA;
else if (ctrlColorList.selection == 5) Duik.settings.controllerColor = Duik.colors.YELLOW;
else if (ctrlColorList.selection == 6) Duik.settings.controllerColor = Duik.colors.WHITE;
else if (ctrlColorList.selection == 7) Duik.settings.controllerColor = Duik.colors.LIGHT_GRAY;
else if (ctrlColorList.selection == 8) Duik.settings.controllerColor = Duik.colors.DARK_GRAY;
else if (ctrlColorList.selection == 9) Duik.settings.controllerColor = Duik.colors.BLACK;
else if (ctrlColorList.selection == 10) Duik.settings.controllerColor = Duik.utils.hexColorToRVB(ctrlCustomColorEdit.text);
else Duik.settings.controllerColor = Duik.colors.WHITE;
Duik.settings.save();

if (ctrlColorList.selection == 10) ctrlCustomColorEdit.enabled = true;
else ctrlCustomColorEdit.enabled = false;
}

ctrlCustomColorEdit.onChange = function () {
Duik.settings.controllerColor = Duik.utils.hexColorToRVB(ctrlCustomColorEdit.text);
Duik.settings.save();
}

if (ctrlColorList.selection == 10) ctrlCustomColorEdit.enabled = true;
else ctrlCustomColorEdit.enabled = false;


//autolock
var ctrlAutoLockButton = ctrlSettingsGroup.add('checkbox',undefined,tr("Auto Lock"));
ctrlAutoLockButton.alignment = ['fill','bottom'];
ctrlAutoLockButton.helpTip = tr("Warning! When controllers are locked,\nthey should be unlocked before parenting.");
if (!expertMode)
{
var ctrlAutoLockText = ctrlPanel.add('statictext',undefined,tr("Warning! When controllers are locked,\nthey should be unlocked before parenting."),{multiline:true});
ctrlAutoLockText.visible = false;
ctrlAutoLockButton.onClick = function () { ctrlAutoLockText.visible = ctrlAutoLockButton.value ; } ;
}

//lock buttons
var ctrlLockButtonsGroup = addHGroup(ctrlPanel);
var ctrlUnlockButton = addIconButton(ctrlLockButtonsGroup,'ctrl_unlock.png','');
ctrlUnlockButton.helpTip =  tr("Unlock selected controllers\n(all controllers if none selected)");
ctrlUnlockButton.onClick = ctrlUnlockButtonClicked;
var ctrlLockButton = addIconButton(ctrlLockButtonsGroup,'ctrl_lock.png','');
ctrlLockButton.helpTip =  tr("Lock selected controllers\n(all controllers if none selected)");
ctrlLockButton.onClick = ctrlLockButtonClicked;
//hide buttons
var ctrlUnhideButton = addIconButton(ctrlLockButtonsGroup,'ctrl_unhide.png','');
ctrlUnhideButton.helpTip =  tr("Unhide selected controllers\n(all controllers if none selected)");
ctrlUnhideButton.onClick = ctrlUnhideButtonClicked;
var ctrlHideButton = addIconButton(ctrlLockButtonsGroup,'ctrl_hide.png','');
ctrlHideButton.helpTip =  tr("Hide selected controllers\n(all controllers if none selected)");
ctrlHideButton.onClick = ctrlHideButtonClicked;
//reset button
var ctrlResetButton = addIconButton(ctrlLockButtonsGroup,'ctrl_zero.png','');
ctrlResetButton.helpTip =  tr("Reset selected controllers transformations");
ctrlResetButton.onClick = ctrlResetButtonClicked;
//buttons
var ctrlButtonsGroup = addHGroup(ctrlPanel);
var ctrlCloseButton = addIconButton(ctrlButtonsGroup,'btn_cancel.png',tr("Back"));
ctrlCloseButton.alignment = ['fill','top'];
ctrlCloseButton.helpTip = tr("Back");
ctrlCloseButton.onClick = function () { ctrlPanel.hide() ; controllersFromRiggingPanel ? panoik.show() : panointerpo.show(); };
var ctrlUpdateButton = addIconButton(ctrlButtonsGroup,'btn_update.png',tr("Update"));
ctrlUpdateButton.alignment = ['fill','top'];
ctrlUpdateButton.helpTip = tr("Update");
ctrlUpdateButton.onClick = function () { ctrlUpdateButtonClicked(); ctrlPanel.hide() ; controllersFromRiggingPanel ? panoik.show() : panointerpo.show(); };
var ctrlCreateButton = addIconButton(ctrlButtonsGroup,'btn_valid.png',tr("Create"));
ctrlCreateButton.alignment = ['fill','top'];
ctrlCreateButton.helpTip = tr("Create");
ctrlCreateButton.onClick = function () { controleur(); ctrlPanel.hide() ; controllersFromRiggingPanel ? panoik.show() : panointerpo.show(); };
}
//IK PANEL
{
var ikTypeGroup = ikPanel.add('group');
ikTypeGroup.orientation = 'stack';
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
ik3GoalGroup.alignChildren = ['center','top'];
ik3GoalGroup.add('image',undefined,dossierIcones + 'btn_3layerikgoal.png');
}
expertMode ? ikType4Group.add('statictext',undefined,'3+1') : ik3GoalGroup.add('statictext',undefined,tr("3-Layer IK & Goal"));

if (!expertMode)
{
var ik3LayerGroup = addVGroup(ikType3Group);
ik3LayerGroup.alignChildren = ['center','top'];
ik3LayerGroup.add('image',undefined,dossierIcones + 'btn_3layerik.png');
}
var ik3LayerButton = expertMode ? ikType3Group.add('radiobutton',undefined,'3') : ik3LayerGroup.add('radiobutton',undefined,tr("3-Layer IK"));
if (!expertMode)
{
var ik2GoalGroup = addVGroup(ikType3Group);
ik2GoalGroup.alignChildren = ['center','top'];
ik2GoalGroup.add('image',undefined,dossierIcones + 'btn_2layerikgoal.png');
}
var ik2GoalButton = expertMode ? ikType3Group.add('radiobutton',undefined,'2+1') : ik2GoalGroup.add('radiobutton',undefined,tr("2-Layer IK & Goal"));

if (!expertMode)
{
var ik1GoalGroup = addVGroup(ikType2Group);
ik1GoalGroup.alignChildren = ['center','top'];
ik1GoalGroup.add('image',undefined,dossierIcones + 'btn_1layerikgoal.png');
}
var ik1GoalButton = expertMode ? ikType2Group.add('radiobutton',undefined,'1+1') : ik1GoalGroup.add('radiobutton',undefined,tr("1-Layer IK & Goal"));
if (!expertMode)
{
var ik2LayerGroup = addVGroup(ikType2Group);
ik2LayerGroup.alignChildren = ['center','top'];
ik2LayerGroup.add('image',undefined,dossierIcones + 'btn_2layerik.png');
}
var ik2LayerButton = expertMode ?  ikType2Group.add('radiobutton',undefined,'2') : ik2LayerGroup.add('radiobutton',undefined,tr("2-Layer IK"));

if (!expertMode)
{
var ik1LayerGroup = addVGroup(ikType1Group);
ik1LayerGroup.alignChildren = ['center','top'];
ik1LayerGroup.add('image',undefined,dossierIcones + 'btn_1layerik.png');
}
expertMode ? ikType1Group.add('statictext',undefined,'1') : ik1LayerGroup.add('statictext',undefined,tr("1-Layer IK (LookAt)"));

addSeparator(ikPanel,'');

var ikSettingsGroup = addHGroup(ikPanel);

//var ikCWButton = ikSettingsGroup.add('checkbox',undefined,'Clockwise');
//ikCWButton.visible = false;

var ik3DGroup = addVGroup(ikSettingsGroup);
ik3DGroup.visible = false;
var ikFrontFacingButton = ik3DGroup.add('radiobutton',undefined,tr("Front/Back view"));
var ikRightFacingButton = ik3DGroup.add('radiobutton',undefined,tr("Left/Right view"));

ik3LayerButton.onClick = function () { ik2GoalButton.value = false; ik3DGroup.enabled = false;};
ik2GoalButton.onClick = function () { ik3LayerButton.value = false; ik3DGroup.enabled = true;};

ik2LayerButton.onClick = function () { ik1GoalButton.value = false; ik3DGroup.enabled = true;};
ik1GoalButton.onClick = function () { ik2LayerButton.value = false; ik3DGroup.enabled = false;};

var ikButtonsGroup = addHGroup(ikPanel);
var ikCancelButton = addIconButton(ikButtonsGroup,'btn_cancel.png',tr("Cancel"));
ikCancelButton.onClick = function () { ikPanel.hide();panoik.show(); };
var ikCreateButton = addIconButton(ikButtonsGroup,'btn_valid.png',tr("Create"));


}
//BEZIER IK PANEL
{
var bikTypeGroup = addHGroup(bezierIkPanel);

if (!expertMode)
{
var bikSimpleGroup = addVGroup(bikTypeGroup);
bikSimpleGroup.alignChildren = ['center','top'];
bikSimpleGroup.add('image',undefined,dossierIcones + 'btn_bezierik1.png');
}
var bikSimpleButton = expertMode ? bikTypeGroup.add('radiobutton',undefined,tr("Sim.")) : bikSimpleGroup.add('radiobutton',undefined,tr("Simple"));
if (!expertMode)
{
var bikCubicGroup = addVGroup(bikTypeGroup);
bikCubicGroup.alignChildren = ['center','top'];
bikCubicGroup.add('image',undefined,dossierIcones + 'btn_bezierik2.png');
}
var bikCubicButton = expertMode ?  bikTypeGroup.add('radiobutton',undefined,tr("Cub.")) : bikCubicGroup.add('radiobutton',undefined,tr("Cubic"));

bikCubicButton.onClick = function () {bikSimpleButton.value = false;};
bikSimpleButton.onClick = function () {bikCubicButton.value = false;};

bikSimpleButton.value = true;

var bikButtonsGroup = addHGroup(bezierIkPanel);
var bikCancelButton = addIconButton(bikButtonsGroup,'btn_cancel.png',tr("Cancel"));
bikCancelButton.onClick = function () { bezierIkPanel.hide();panoik.show(); };
var bikCreateButton = addIconButton(bikButtonsGroup,'btn_valid.png',tr("Create"));
bikCreateButton.onClick = bikCreateButtonClicked;
}
//RENAME PANEL
{
var renameTypeGroup = addHGroup(renamePanel);
function renameTypeSelect() {
if (renameItemsButton.value)
{
renameExpressionsGroup.enabled = false;
renameInExpressionsButton.enabled = true;
renameInExpressionsCurrentCompButton.value = false;
}
else if (renameLayersButton.value)
{
renameInExpressionsButton.enabled = true;
renameExpressionsGroup.enabled = renameInExpressionsButton.value;
renameInExpressionsCurrentCompButton.value = true;
}
else
{
renameInExpressionsButton.enabled = false;
renameExpressionsGroup.enabled = false;
}

}
var renameLayersButton = renameTypeGroup.add('radiobutton',undefined,tr("Layers"));
renameLayersButton.value = true;
renameLayersButton.onClick = renameTypeSelect;
var renamePinsButton = renameTypeGroup.add('radiobutton',undefined,tr("Pins"));
renamePinsButton.onClick = renameTypeSelect;
var renameItemsButton = renameTypeGroup.add('radiobutton',undefined,tr("Project Items"));
renameItemsButton.onClick = renameTypeSelect;

addSeparator(renamePanel,'');
//nom
var groupeNom = addHGroup(renamePanel);
groupeNom.alignChildren = ['fill','center'];
var nametexte = groupeNom.add('checkbox',undefined,tr("Name"));
nametexte.alignment = ['left','center'];
var name = groupeNom.add('edittext',undefined);
name.enabled = false;
nametexte.onClick = function() {
name.enabled = nametexte.value;
}
//prefix
renamePanel.alignChildren = ['fill','top'];
var groupePrefix = addHGroup(renamePanel);
groupePrefix.alignChildren = ['fill','center'];
var prefixtexte = groupePrefix.add('checkbox',undefined,tr("Prefix"));
prefixtexte.alignment = ['left','center'];
var prefix = groupePrefix.add('edittext',undefined);
prefix.enabled = false;
prefixtexte.onClick = function() {
prefix.enabled = prefixtexte.value;
}
//suffix
var groupeSuffix = addHGroup(renamePanel);
groupeSuffix.alignChildren = ['fill','center'];
var suffixtexte = groupeSuffix.add('checkbox',undefined,tr("Suffix"));
suffixtexte.alignment = ['left','center'];
var suffix = groupeSuffix.add('edittext',undefined);
suffix.enabled = false;
suffixtexte.onClick = function() {
suffix.enabled = suffixtexte.value;
}
//remove first digits
var renameRemFirstDGroup = addHGroup(renamePanel);
renameRemFirstDGroup.add('statictext',undefined,tr("Remove first"));
var renameRemFirstDValue = renameRemFirstDGroup.add('edittext',undefined,'0');
renameRemFirstDGroup.add('statictext',undefined,tr("digits."));
//remove last digits
var renameRemLastDGroup = addHGroup(renamePanel);
renameRemLastDGroup.add('statictext',undefined,tr("Remove last"));
var renameRemLastDValue = renameRemLastDGroup.add('edittext',undefined,'0');
renameRemLastDGroup.add('statictext',undefined,tr("digits."));
//numeros
var groupeNumeros = addHGroup(renamePanel);
groupeNumeros.alignChildren = ['fill','center'];
var numerotexte = groupeNumeros.add('checkbox',undefined,tr("Number from"));
numerotexte.alignment = ['left','center'];
var numero = groupeNumeros.add('edittext',undefined,'1');
numero.enabled = false;
numerotexte.onClick = function() {
numerotexte.value ? numero.enabled = true : numero.enabled = false ;
}
addSeparator(renamePanel,'');
//in expressions too
var renameInExpressionsButton = renamePanel.add('checkbox',undefined,tr("Update expressions"));
renameInExpressionsButton.value = true;
var renameExpressionsGroup = addHGroup(renamePanel);
var renameInExpressionsCurrentCompButton = renameExpressionsGroup.add('radiobutton',undefined,tr("Current comp"));
renameInExpressionsCurrentCompButton.value = true;
renameExpressionsGroup.add('radiobutton',undefined,tr("Project"));
renameInExpressionsButton.onClick = function(){renameExpressionsGroup.enabled =renameInExpressionsButton.value };
//buttons
var renameButtonsGroup = addHGroup(renamePanel);
var renameCloseButton = addIconButton(renameButtonsGroup,'btn_cancel.png',tr("Back"));
renameCloseButton.alignment = ['fill','top'];
renameCloseButton.onClick = function () { renamePanel.hide() ; panoik.show(); };
var renameCreateButton = addIconButton(renameButtonsGroup,'btn_valid.png',tr("Rename"));
renameCreateButton.alignment = ['fill','top'];
renameCreateButton.onClick = rename;
}
//SEARCH AND REPLACE PANEL
{
var rieTypeGroup = addHGroup(riePanel);
function rieTypeSelect() {
if (renameItemsButton.value)
{
renameExpressionsGroup.enabled = false;
renameInExpressionsButton.enabled = true;
renameInExpressionsCurrentCompButton.value = false;
}
else if (renameLayersButton.value)
{
renameInExpressionsButton.enabled = true;
renameExpressionsGroup.enabled = renameInExpressionsButton.value;
renameInExpressionsCurrentCompButton.value = true;
}
else
{
renameInExpressionsButton.enabled = false;
renameExpressionsGroup.enabled = false;
}

}
var rieExpressionsButton = rieTypeGroup.add('radiobutton',undefined,tr("Expressions"));
rieExpressionsButton.value = true;
function rieTypeSelect() {
if (rieExpressionsButton.value)
{
rieOptionsGroup.show();
rieItemGroup.hide();
rieUpdateExpressionsButton.enabled = false;
rieExpressionsGroup.enabled = false;
}
else if (rieLayersButton.value)
{
rieOptionsGroup.show();
rieItemGroup.hide();
rieUpdateExpressionsButton.enabled = true;
rieExpressionsGroup.enabled = true;
rieExpressionsCurrentCompButton.value = true;
}
else
{
rieOptionsGroup.hide();
rieItemGroup.show();
rieUpdateExpressionsButton.enabled = rieCompItemButton.value;
rieExpressionsGroup.enabled = false;
rieExpressionsCurrentCompButton.value = false;
}
}
rieExpressionsButton.onClick = rieTypeSelect;
var rieLayersButton = rieTypeGroup.add('radiobutton',undefined,tr("Layers"));
rieLayersButton.onClick = rieTypeSelect;
var rieItemsButton = rieTypeGroup.add('radiobutton',undefined,expertMode ? tr("Items") : tr("Project Items"));
rieItemsButton.onClick = rieTypeSelect;
//options
var rieMainOptionsGroup = addHGroup(riePanel);
rieMainOptionsGroup.orientation = 'stack';
var rieItemGroup = addVGroup(rieMainOptionsGroup);
var rieItemTypeGroup = addHGroup(rieItemGroup);
var rieCompItemButton = rieItemTypeGroup.add('checkbox',undefined,tr("Comps"));
rieCompItemButton.value = true;
rieCompItemButton.onClick = function() { rieUpdateExpressionsButton.enabled = rieCompItemButton.value; } ;
var rieFootageItemButton = rieItemTypeGroup.add('checkbox',undefined,tr("Footage"));
rieFootageItemButton.value = true;
var rieFolderItemButton = rieItemTypeGroup.add('checkbox',undefined,tr("Folders"));
rieFolderItemButton.value = true;
var rieItemSelectionGroup = addHGroup(rieItemGroup);
var rieItemSelectedButton = rieItemSelectionGroup.add('radiobutton',undefined,tr("Selected Items"));
var rieItemAllButton = rieItemSelectionGroup.add('radiobutton',undefined,tr("All Items"));
rieItemAllButton.value = true;
rieItemGroup.hide();

var rieOptionsGroup = addVGroup(rieMainOptionsGroup);
var rieCompGroup = addHGroup(rieOptionsGroup);
var rieCurrentCompButton = rieCompGroup.add('radiobutton',undefined,expertMode ? tr("Active") : tr("Active comp"));
var rieAllCompsButton = rieCompGroup.add('radiobutton',undefined,tr("All comps"));
rieCurrentCompButton.onClick = function () {
rieLayerGroup.enabled = rieCurrentCompButton.value;
}
rieAllCompsButton.onClick = function () {
rieLayerGroup.enabled = rieCurrentCompButton.value;
}
rieCurrentCompButton.value = true;
var rieLayerGroup = addHGroup(rieOptionsGroup);
var rieSelectedLayersButton = rieLayerGroup.add('radiobutton',undefined,expertMode ? tr("Selected") : tr("Selected layers"));
var rieAllLayersButton = rieLayerGroup.add('radiobutton',undefined,tr("All layers"));
rieAllLayersButton.value = true;

addSeparator(riePanel,'');
var rieOldGroup = addHGroup(riePanel);
var rieOldText = rieOldGroup.add('statictext',undefined,tr("Search"));
rieOldText.alignment = ['left','top'];
var rieOldEdit = rieOldGroup.add('edittext',undefined,'');
rieOldEdit.alignment = ['fill','fill'];
var rieCaseSensitive = riePanel.add('checkbox',undefined,tr("Case sensitive"));
rieCaseSensitive.value = true;
var rieNewGroup = addHGroup(riePanel);
var rieNewText = rieNewGroup.add('statictext',undefined,tr("Replace"));
rieNewText.alignment = ['left','top'];
var rieNewEdit = rieNewGroup.add('edittext',undefined,'');
rieNewEdit.alignment = ['fill','fill'];

addSeparator(riePanel,'');
var rieUpdateExpressionsButton = riePanel.add('checkbox',undefined,tr("Update expressions"));
rieUpdateExpressionsButton.enabled = false;
rieUpdateExpressionsButton.value = true;
var rieExpressionsGroup = addHGroup(riePanel);
var rieExpressionsCurrentCompButton = rieExpressionsGroup.add('radiobutton',undefined,tr("Current comp"));
rieExpressionsCurrentCompButton.value = true;
rieExpressionsGroup.add('radiobutton',undefined,tr("Project"));
rieUpdateExpressionsButton.onClick = function(){rieExpressionsGroup.enabled =rieUpdateExpressionsButton.value };
rieExpressionsGroup.enabled = false;
var rieButtonsGroup = addHGroup(riePanel);
var rieCancelButton = addIconButton(rieButtonsGroup,'btn_cancel.png',tr("Back"));
rieCancelButton.onClick = function () { riePanel.hide();panoik.show();};
var rieOKButton = addIconButton(rieButtonsGroup,'btn_valid.png',tr("Replace"));
rieOKButton.onClick = replaceInExpr;
}
//MEASUREMENT RESULT
{
var resultattexte = measurePanel.add('statictext',undefined,tr("Distance = \n") + '      ' + tr(" pixels"),{multiline:true});
resultattexte.size = [100,50];
var measureCancelButton = addIconButton(measurePanel,'btn_cancel.png',tr("Back"));
measureCancelButton.onClick = function () { measurePanel.hide();panoik.show();};
}
//TIME REMAP PANEL
{
var timeRemapLoopButton = timeRemapPanel.add('checkbox',undefined,tr("Loop"));
var timeRemapLoopOutButton = timeRemapPanel.add('radiobutton',undefined,tr("Loop out"));
timeRemapLoopOutButton.enabled = false;
timeRemapLoopOutButton.helpTip = tr("Time remap with loopOut()");
timeRemapLoopOutButton.value = true;
var timeRemapLoopInButton = timeRemapPanel.add('radiobutton',undefined,tr("Loop in"));
timeRemapLoopInButton.enabled = false;
timeRemapLoopInButton.helpTip = tr("Time remap with loopIn()");
timeRemapLoopButton.onClick = function() {
timeRemapLoopOutButton.enabled = timeRemapLoopButton.value;
timeRemapLoopInButton.enabled = timeRemapLoopButton.value;
};
var timeRemapButtonsGroup = addHGroup(timeRemapPanel);
var timeRemapCancelButton = addIconButton(timeRemapButtonsGroup,'btn_cancel.png',tr("Back"));
timeRemapCancelButton.onClick = function () { timeRemapPanel.hide();panoanimation.show();};
var timeRemapButton = addIconButton(timeRemapButtonsGroup,'btn_valid.png',tr("Time Remap"));
timeRemapButton.onClick = function () { timeRemapButtonClicked();timeRemapPanel.hide();panoanimation.show();};
timeRemapButton.helpTip = tr("Smart time remap");

}
//EXPOSURE PANEL
{
function exposureSelect() {
lowerExposureGroup.enabled = adaptativeExposureButton.value;
upperExposureGroup.enabled = adaptativeExposureButton.value;
precisionGroup.enabled = adaptativeExposureButton.value;
exposureSyncGroup.enabled = adaptativeExposureButton.value;
exposurePrecisionSlider.enabled = adaptativeExposureButton.value;
exposureAnalyzeButton.enabled = exposureFromFootageButton.value;
exposureAnalyzeLabel.enabled = exposureFromFootageButton.value;
exposureChannelsGroup.enabled = exposureFromFootageButton.value;
exposureToleranceGroup.enabled = exposureFromFootageButton.value;
exposureDetectionPrecisionGroup.enabled = exposureFromFootageButton.value;
exposureLayerGroup.enabled = exposureFromFootageButton.value;
}

//FIXED
var evenExposureButton = exposurePanel.add('radiobutton',undefined,tr("Fixed"));
evenExposureButton.onClick = function () {
exposureFromFootageButton.value = false;
adaptativeExposureButton.value = false;
exposureSelect();
}

addSeparator(exposurePanel,'');

//ADAPTATIVE
var adaptativeExposureButton = exposurePanel.add('radiobutton',undefined,tr("Adaptative"));
adaptativeExposureButton.value = true;
adaptativeExposureButton.onClick = function () {
exposureFromFootageButton.value = false;
evenExposureButton.value = false;
exposureSelect();
}

var lowerExposureGroup = addHGroup(exposurePanel);
lowerExposureGroup.add('statictext',undefined,tr("Lower exp. limit: "));
var lowerExposureEdit = lowerExposureGroup.add('edittext',undefined,'1');
var upperExposureGroup = addHGroup(exposurePanel);
upperExposureGroup.add('statictext',undefined,tr("Upper exp. limit: "));
var upperExposureEdit = upperExposureGroup.add('edittext',undefined,'4');
var precisionGroup = addHGroup(exposurePanel);
precisionGroup.add('statictext',undefined,tr("Precision: "));
var precisionEdit = precisionGroup.add('edittext',undefined,'500');
precisionEdit.onChange = function () { exposurePrecisionSlider.value = precisionEdit.text };
var precisionButton = precisionGroup.add('button',undefined,tr("Detect"));
precisionButton.onClick = detectExposurePrecision;
var exposurePrecisionSlider = exposurePanel.add('slider',undefined,500,0,1000);
exposurePrecisionSlider.onChanging = function () {precisionEdit.text = Math.floor(exposurePrecisionSlider.value);};
var exposureSyncGroup = addHGroup(exposurePanel);
var exposureSyncButton = exposureSyncGroup.add('checkbox',undefined,tr("Sync"));
exposureSyncButton.value = true;
var exposureSyncLayerButton = exposureSyncGroup.add('radiobutton',undefined,tr("By layer"));
var exposureSyncAllButton = exposureSyncGroup.add('radiobutton',undefined,tr("All"));
exposureSyncAllButton.value = true;
exposureSyncButton.onClick = function () {
exposureSyncLayerButton.enabled = exposureSyncButton.value;
exposureSyncAllButton.enabled = exposureSyncButton.value;
}

addSeparator(exposurePanel,'');

//FROM FOOTAGE
var exposureFromFootageButton = exposurePanel.add('radiobutton',undefined,tr("From Footage"));
exposureFromFootageButton.value = false;
exposureFromFootageButton.onClick = function () {
adaptativeExposureButton.value = false;
evenExposureButton.value = false;
exposureSelect();
exposureLayerRefreshButtonClicked();
}

var exposureLayerGroup = addHGroup(exposurePanel);
if (!expertMode) {
var exposureLayerLabel = exposureLayerGroup.add('statictext',undefined,tr("Layer:"));
exposureLayerLabel.alignment = ['left','fill'];
}
var exposureLayerList = exposureLayerGroup.add('dropdownlist');
var exposureLayerRefreshButton = addIconButton(exposureLayerGroup,'btn_refresh.png','');
exposureLayerRefreshButton.alignment = ['right','fill'];
exposureLayerRefreshButton.onClick = exposureLayerRefreshButtonClicked;

var exposureDetectionPrecisionGroup = addHGroup(exposurePanel);
var exposureDetectionPrecisionLabel = exposureDetectionPrecisionGroup.add('statictext',undefined,tr("Accuracy"));
exposureDetectionPrecisionLabel.helpTip = tr("Lower accuracy can speed up analysis");
exposureDetectionPrecisionLabel.alignment = ['left','center'];
exposureDetectionPrecisionLabel.minimumSize = [40,10];
var exposureDetectionPrecisionSlider = exposureDetectionPrecisionGroup.add('slider',undefined,50,0,100);
exposureDetectionPrecisionSlider.helpTip = tr("Lower accuracy can speed up analysis");
exposureDetectionPrecisionSlider.alignment = ['fill','center'];
exposureDetectionPrecisionSlider.onChanging = function ()
{
var val = Math.round(exposureDetectionPrecisionSlider.value);
exposureDetectionPrecisionEdit.text = val;
}
var exposureDetectionPrecisionEdit = exposureDetectionPrecisionGroup.add('edittext',undefined,'50');
exposureDetectionPrecisionEdit.helpTip = tr("Lower accuracy can speed up analysis");
exposureDetectionPrecisionEdit.minimumSize = [30,10];
exposureDetectionPrecisionEdit.alignment = ['right','fill'];

var exposureToleranceGroup = addHGroup(exposurePanel);
var exposureToleranceLabel = exposureToleranceGroup.add('statictext',undefined,tr("Tolerance"));
exposureToleranceLabel.helpTip = tr("Higher tolerance will result in higher exposure");
exposureToleranceLabel.alignment = ['left','center'];
exposureToleranceLabel.minimumSize = [40,10];
var exposureToleranceSlider = exposureToleranceGroup.add('slider',undefined,10,0,100);
exposureToleranceSlider.helpTip = tr("Higher tolerance will result in higher exposure");
exposureToleranceSlider.alignment = ['fill','center'];
exposureToleranceSlider.onChanging = function ()
{
var val = Math.round(exposureToleranceSlider.value);
exposureToleranceEdit.text = val;
}
var exposureToleranceEdit = exposureToleranceGroup.add('edittext',undefined,'10');
exposureToleranceEdit.helpTip = tr("Higher tolerance will result in higher exposure");
exposureToleranceEdit.minimumSize = [30,10];
exposureToleranceEdit.alignment = ['right','fill'];

var exposureChannelsGroup = addHGroup(exposurePanel);
var exposureRButton = exposureChannelsGroup.add('checkbox',undefined,tr("R"));
exposureRButton.value = true;
var exposureGButton = exposureChannelsGroup.add('checkbox',undefined,tr("G"));
exposureGButton.value = true;
var exposureBButton = exposureChannelsGroup.add('checkbox',undefined,tr("B"));
exposureBButton.value = true;
var exposureAButton = exposureChannelsGroup.add('checkbox',undefined,tr("A"));

var exposureAnalyzeButton = addButton(exposurePanel,tr("Analyze"));
exposureAnalyzeButton.onClick = exposureAnalyzeButtonClicked;
var exposureAnalyzeLabel = exposurePanel.add('statictext',undefined,tr("Analyze layer to detect exposure"));

addSeparator(exposurePanel,'');

exposureSelect();

var exposureButtonsGroup = addHGroup(exposurePanel);
var exposureCancelButton = addIconButton(exposureButtonsGroup,'btn_cancel.png',tr("Back"));
exposureCancelButton.onClick = function () { exposurePanel.hide();panoanimation.show();};
exposureCancelButton.helpTip = tr("Back");
var exposureOKButton = addIconButton(exposureButtonsGroup,'btn_valid.png',tr("Exposure"));
exposureOKButton.onClick = function () { exposureOKButtonClicked();exposurePanel.hide();panoanimation.show();};
exposureOKButton.helpTip = tr("Set animation exposure");
}
//CEL PANEL
{
var celCreateCelGroup = addHGroup(celPanel);
var celSingleLayerButton = celCreateCelGroup.add('checkbox',undefined,tr("Single Layer"));
celSingleLayerButton.helpTip = tr("If enabled, creates cels as new paint effects on a single layer");
celSingleLayerButton.alignment = ['left','bottom'];
var celCreateCelButton = addButton(celCreateCelGroup,tr("New Cel."));
celCreateCelButton.helpTip = tr("Creates a new animation cel.");
celCreateCelButton.onClick = celCreateCelButtonClicked;

addSeparator(celPanel,'');

var celOnionGroup = addHGroup(celPanel);
var celOnionButton = celOnionGroup.add('checkbox',undefined,tr("Onion skin"));
celOnionButton.helpTip = tr("Activates onion skin");
celOnionButton.alignment = ['left','bottom'];
var celOnionDurationEdit = celOnionGroup.add('edittext',undefined,'05');
celOnionDurationEdit.helpTip = tr("Onion skin duration (frames)");
celOnionDurationEdit.onChange = celOnionUpdateButtonClicked;
celOnionDurationEdit.alignment = ['left','fill'];
var celOnionDurationLabel = celOnionGroup.add('statictext',undefined,'frames');
celOnionDurationLabel.alignment = ['left','fill'];

var celOnionInOpacityGroup = addHGroup(celPanel);
var celOnionInOpacityButton = celOnionInOpacityGroup.add('checkbox',undefined,tr("In Opacity"));
celOnionInOpacityButton.alignment = ['left','bottom'];
var celOnionInOpacitySlider = celOnionInOpacityGroup.add('slider',undefined,50,1,100);
celOnionInOpacitySlider.alignment = ['fill','center'];
var celOnionInOpacityEdit = celOnionInOpacityGroup.add('edittext',undefined,'050');
celOnionInOpacityEdit.alignment = ['right','fill'];
celOnionInOpacitySlider.onChanging = function() { celOnionInOpacityEdit.text = parseInt(celOnionInOpacitySlider.value); };
celOnionInOpacitySlider.onChange = celOnionUpdateButtonClicked;
celOnionInOpacityEdit.onChange = function() { celOnionInOpacitySlider.value = parseInt(celOnionInOpacityEdit.text); celOnionUpdateButtonClicked(); };
celOnionInOpacityButton.onClick = function() {
celOnionButton.value = false;
celOnionUpdateButtonClicked();
celOnionInOpacitySlider.enabled = celOnionInOpacityButton.value;
celOnionInOpacityEdit.enabled = celOnionInOpacityButton.value;
if (!celOnionInOpacityButton.value && !celOnionOutOpacityButton.value )
{
celOnionOutOpacityButton.value = true;
celOnionOutOpacitySlider.enabled = true;
celOnionOutOpacityEdit.enabled = true;
}
celOnionButton.value = true;
celOnionUpdateButtonClicked();
};

celOnionInOpacitySlider.enabled = false;
celOnionInOpacityEdit.enabled = false;

var celOnionOutOpacityGroup = addHGroup(celPanel);
var celOnionOutOpacityButton = celOnionOutOpacityGroup.add('checkbox',undefined,tr("Out Opacity"));
celOnionOutOpacityButton.alignment = ['left','bottom'];
var celOnionOutOpacitySlider = celOnionOutOpacityGroup.add('slider',undefined,50,1,100);
celOnionOutOpacitySlider.alignment = ['fill','center'];
var celOnionOutOpacityEdit = celOnionOutOpacityGroup.add('edittext',undefined,'050');
celOnionOutOpacityEdit.alignment = ['right','fill'];
celOnionOutOpacitySlider.onChanging = function() { celOnionOutOpacityEdit.text = parseInt(celOnionOutOpacitySlider.value);};
celOnionOutOpacitySlider.onChange = celOnionUpdateButtonClicked;
celOnionOutOpacityEdit.onChange = function() { celOnionOutOpacitySlider.value = parseInt(celOnionOutOpacityEdit.text); celOnionUpdateButtonClicked(); };
celOnionOutOpacityButton.onClick = function() {
celOnionButton.value = false;
celOnionUpdateButtonClicked();
celOnionOutOpacitySlider.enabled = celOnionOutOpacityButton.value;
celOnionOutOpacityEdit.enabled = celOnionOutOpacityButton.value;
if (!celOnionInOpacityButton.value && !celOnionOutOpacityButton.value )
{
celOnionInOpacityButton.value = true;
celOnionInOpacitySlider.enabled = true;
celOnionInOpacityEdit.enabled = true;
}
celOnionButton.value = true;
celOnionUpdateButtonClicked();
};

celOnionOutOpacityButton.value = true;

var celOnionUpdateGroup = addHGroup(celPanel);
var celOnionGetButton = addIconButton(celOnionUpdateGroup,'btn_getonion.png',tr("Get current Onion Skin"));
celOnionGetButton.onClick = celOnionGetButtonClicked;
var celOnionUpdateButton = addIconButton(celOnionUpdateGroup,'btn_onion.png',tr("Apply Onion Skin"));
celOnionUpdateButton.onClick = celOnionUpdateButtonClicked;

celOnionButton.onClick = function() {
celOnionDurationEdit.enabled = celOnionButton.value;
celOnionDurationLabel.enabled = celOnionButton.value;
celOnionInOpacityGroup.enabled = celOnionButton.value;
celOnionOutOpacityGroup.enabled = celOnionButton.value;
celOnionUpdateButton.enabled = celOnionButton.value;

celOnionUpdateButtonClicked();
}

celOnionButton.value = true;


addSeparator(celPanel,'');

var celNavButtonsGroup = addHGroup(celPanel);
var celPreviousButton = addIconButton(celNavButtonsGroup,'btn_prev.png','');
celPreviousButton.helpTip = tr("Previous frame");
celPreviousButton.onClick = celPreviousButtonClicked;
var celExposureEdit = celNavButtonsGroup.add('edittext',undefined,'02');
celExposureEdit.helpTip = tr("Exposure");
var celNextButton = addIconButton(celNavButtonsGroup,'btn_next.png','');
celNextButton.helpTip = tr("Next frame");
celNextButton.onClick = celNextButtonClicked;
var celCancelButton = addIconButton(celPanel,'btn_cancel.png',tr("Back"));
celCancelButton.onClick = function () { celPanel.hide();panointerpo.show();};
celCancelButton.helpTip = tr("Back");
}
//WIGGLE PANEL
{
var wiggleSeparateGroup = addHGroup(wigglePanel);
//separer ou toutes
var wiggleSeparate = wiggleSeparateGroup.add('radiobutton',undefined,tr("Separate Dimensions"));
var wiggleTous = wiggleSeparateGroup.add('radiobutton',undefined,tr("All Dimensions"));
wiggleTous.value = true;
var wiggleButtonsGroup = addHGroup(wigglePanel);
var wiggleCancelButton = addIconButton(wiggleButtonsGroup,'btn_cancel.png',tr("Cancel"));
wiggleCancelButton.onClick = function () { wigglePanel.hide();panoanimation.show();};
wiggleCancelButton.helpTip = tr("Back");
var wiggleOKButton = addIconButton(wiggleButtonsGroup,'btn_valid.png',tr("Wiggle"));
wiggleOKButton.onClick = function () { wiggleOKButtonClicked();wigglePanel.hide();panoanimation.show();};
wiggleOKButton.helpTip = tr("Set animation exposure");

}
//IMPORT RIG PANEL
{
irPanel.add('statictext',undefined,tr("Rigged composition to import:"));
var irRigGroup = addHGroup(irPanel);
var irRigButton = irRigGroup.add('dropdownlist',undefined);
irRigButton.alignment = ['fill','fill'];
var irRigRefreshButton = addIconButton(irRigGroup,'btn_refresh.png','');
irRigRefreshButton.alignment = ['right','fill'];
irRigRefreshButton.onClick = irRigRefreshButtonClicked;
irPanel.add('statictext',undefined,tr("Name of this instance:"));
irNameText = irPanel.add('edittext',undefined,tr("Must be unique!"));
var irButtonsGroup = addHGroup(irPanel);
var irCancelButton = addIconButton(irButtonsGroup,'btn_cancel.png',tr("Cancel"));
irCancelButton.onClick = function () { irPanel.hide();panointerpo.show();};
irCancelButton.helpTip = tr("Cancel");
var irDuplicateButton = addIconButton(irButtonsGroup,'btn_duplicateRig.png',tr("Duplicate"));
irDuplicateButton.onClick = function () { irDuplicateButtonClicked();};
irDuplicateButton.helpTip = tr("Duplicate selected rig");
var irOKButton = addIconButton(irButtonsGroup,'btn_valid.png',tr("Import"));
irOKButton.onClick = function () { irOKButtonClicked();};
irOKButton.helpTip = tr("Import selected rig");
}
//RANDOMIZE PANEL
{
var randPropertiesButton = randPanel.add('checkbox',undefined,tr("Selected properties"));
randPanel.add('statictext',undefined,tr("Layers"));
var randStartTimeButton = randPanel.add('checkbox',undefined,tr("Start times"));
var randInPointButton = randPanel.add('checkbox',undefined,tr("In points"));
var randOutPointButton = randPanel.add('checkbox',undefined,tr("Out points"));
randPanel.add('statictext',undefined,tr("Selected keyframes"));
var randKeyTimeButton = randPanel.add('checkbox',undefined,tr("Times"));
var randKeyValueButton = randPanel.add('checkbox',undefined,tr("Values"));
randPropertiesButton.value = true;

randPropertiesButton.onClick = function () {
if (randPropertiesButton.value)
{
randStartTimeButton.value = false;
randInPointButton.value = false;
randOutPointButton.value = false;
randKeyTimeButton.value = false;
randKeyValueButton.value = false;
}
}

function randNothingChecked() {
if (!randStartTimeButton.value && !randInPointButton.value && !randOutPointButton.value && !randKeyTimeButton.value && !randKeyValueButton.value)
{
randPropertiesButton.value = true;
return true;
}
else return false;
}

randInPointButton.onClick = function () {
if (randNothingChecked()) return;
randKeyTimeButton.value = false;
randKeyValueButton.value = false;
randPropertiesButton.value = false;
}
randOutPointButton.onClick = function () {
if (randNothingChecked()) return;
randKeyTimeButton.value = false;
randKeyValueButton.value = false;
randPropertiesButton.value = false;
}
randStartTimeButton.onClick = function () {
if (randNothingChecked()) return;
randKeyTimeButton.value = false;
randKeyValueButton.value = false;
randPropertiesButton.value = false;
}
randKeyTimeButton.onClick = function () {
if (randNothingChecked()) return;
randStartTimeButton.value = false;
randInPointButton.value = false;
randOutPointButton.value = false;
randPropertiesButton.value = false;
}
randKeyValueButton.onClick = function () {
if (randNothingChecked()) return;
randStartTimeButton.value = false;
randInPointButton.value = false;
randOutPointButton.value = false;
randPropertiesButton.value = false;
}

var randValuesGroup = addHGroup(randPanel);
var randXValueGroup = addVGroup(randValuesGroup);
var randXLabel = randXValueGroup.add('statictext',undefined,'X');
randXLabel.alignment = ['center','center'];
var randMaxXValueEdit = randXValueGroup.add('edittext',undefined,tr("Max"));
var randMaxXSlider = randXValueGroup.add('slider',undefined,0,-100,100);
randMaxXSlider.onChanging = function () {randMaxXValueEdit.text = Math.round(randMaxXSlider.value);};
var randMinXValueEdit = randXValueGroup.add('edittext',undefined,tr("Min"));
var randMinXSlider = randXValueGroup.add('slider',undefined,0,-100,100);
randMinXSlider.onChanging = function () {randMinXValueEdit.text = Math.round(randMinXSlider.value);};
var randYValueGroup = addVGroup(randValuesGroup);
var randYLabel = randYValueGroup.add('statictext',undefined,'Y');
randYLabel.alignment = ['center','center'];
var randMaxYValueEdit = randYValueGroup.add('edittext',undefined,tr("Max"));
var randMaxYSlider = randYValueGroup.add('slider',undefined,0,-100,100);
randMaxYSlider.onChanging = function () {randMaxYValueEdit.text = Math.round(randMaxYSlider.value);};
var randMinYValueEdit = randYValueGroup.add('edittext',undefined,tr("Min"));
var randMinYSlider = randYValueGroup.add('slider',undefined,0,-100,100);
randMinYSlider.onChanging = function () {randMinYValueEdit.text = Math.round(randMinYSlider.value);};
var randZValueGroup = addVGroup(randValuesGroup);
var randZLabel = randZValueGroup.add('statictext',undefined,'Z');
randZLabel.alignment = ['center','center'];
var randMaxZValueEdit = randZValueGroup.add('edittext',undefined,tr("Max"));
var randMaxZSlider = randZValueGroup.add('slider',undefined,0,-100,100);
randMaxZSlider.onChanging = function () {randMaxZValueEdit.text = Math.round(randMaxZSlider.value);};
var randMinZValueEdit = randZValueGroup.add('edittext',undefined,tr("Min"));
var randMinZSlider = randZValueGroup.add('slider',undefined,0,-100,100);
randMinZSlider.onChanging = function () {randMinZValueEdit.text = Math.round(randMinZSlider.value);};

var randFromValueButton = randPanel.add('checkbox',undefined,tr("From current value"));
randFromValueButton.value = true;

var randButtonsGroup = addHGroup(randPanel);
var randCancelButton = addIconButton(randButtonsGroup,'btn_cancel.png',tr("Cancel"));
randCancelButton.onClick = function () { randPanel.hide();panoanimation.show();};
randCancelButton.helpTip = tr("Cancel");
var randOKButton = addIconButton(randButtonsGroup,'btn_valid.png',tr("Randomize"));
randOKButton.onClick = function () { randOKButtonClicked();};
randOKButton.helpTip = tr("Randomize properties and layers");
}
//MULTIPLANE PANEL
{
var nombreGroupe = addHGroup(multiplanePanel);
nombreGroupe.add('statictext',undefined,tr("Layers:"));
var nombre = nombreGroupe.add('edittext',undefined,'05');
var multiplaneSlider = multiplanePanel.add('slider',undefined,5,1,10);
multiplaneSlider.onChanging = function () {
nombre.text = Math.round(multiplaneSlider.value);
}
nombre.onChanging = function () {
multiplaneSlider.value = parseInt(nombre.text);
}

var multiplaneButtonsGroup = addHGroup(multiplanePanel);
var multiplaneCancelButton = addIconButton(multiplaneButtonsGroup,'btn_cancel.png',tr("Cancel"));
multiplaneCancelButton.onClick = function () { multiplanePanel.hide();panocam.show();};
multiplaneCancelButton.helpTip = tr("Cancel");
var multiplaneOKButton = addIconButton(multiplaneButtonsGroup,'btn_valid.png',tr("Multiplane"));
multiplaneOKButton.onClick = function () { multiplan(); multiplanePanel.hide(); panocam.show()};
multiplaneOKButton.helpTip = tr("Creates a 2D multiplane camera rig");
}
//WHEEL PANEL
{
//on a besoin d'une variable globale...
var OA = 0;
var rayonGroupeRayon = addHGroup(wheelPanel);
//champ de saisie
rayonGroupeRayon.add('statictext',undefined,tr("Radius:"));
var rayonbouton = rayonGroupeRayon.add ('edittext', undefined);
rayonbouton.size = ['100','20'];
rayonbouton.helpTip = tr("Radius of the wheel, pixels");
wheelPanel.add('statictext',undefined,tr("Movement:"));
//bouton mesurer
var mesurebouton = rayonGroupeRayon.add('button',undefined,tr("Measure"));
mesurebouton.value = false;
mesurebouton.helpTip = tr("Measure with another object");
mesurebouton.onClick = mesurer;
//boutons type de deplacement
var rayonGroupeType = addHGroup(wheelPanel);
var roueH = rayonGroupeType.add('radiobutton',undefined,tr("Horizontal"));
var roueC = rayonGroupeType.add('radiobutton',undefined,tr("Curved"));
roueH.value = true;

var wheelButtonsGroup = addHGroup(wheelPanel);
var wheelCancelButton = addIconButton(wheelButtonsGroup,'btn_cancel.png',tr("Cancel"));
wheelCancelButton.onClick = function () { wheelPanel.hide();panoanimation.show();};
wheelCancelButton.helpTip = tr("Cancel");
var wheelOKButton = addIconButton(wheelButtonsGroup,'btn_valid.png',tr("Wheel"));
wheelOKButton.onClick = function () { roue(); wheelPanel.hide(); panoanimation.show()};
wheelOKButton.helpTip = tr("Wheel");
}
//SPRING PANEL
{
springPanel.add('statictext',undefined,tr("When the Spring is used on the position property of a layer,"),{multiline:true});
springPanel.add('statictext',undefined,tr("there are two ways to compute it:"),{multiline:true});
addSeparator(springPanel,'');
//boutons leger ou simulation
var boutonLightSpring = springPanel.add('radiobutton',undefined,tr("Without simulation - Light"));
springPanel.add('statictext',undefined,tr("Needs an animation on the layer itself to work."),{multiline:true});
boutonLightSpring.value = false;
addSeparator(springPanel,'');
var boutonSimulatedSpring = springPanel.add('radiobutton',undefined,tr("Simulated - Heavy computing"));
springPanel.add('statictext',undefined,tr("Works even if there is no animation on the layer, using the movement of the parent layers."),{multiline:true});
springPanel.add('statictext',undefined,tr("Resulting animation may be smoother too."),{multiline:true});
addSeparator(springPanel,'');
boutonLightSpring.onClick = function () { boutonSimulatedSpring.value = !boutonLightSpring.value;};
boutonSimulatedSpring.onClick = function () { boutonLightSpring.value = !boutonSimulatedSpring.value;};
boutonSimulatedSpring.value = true;

var springButtonsGroup = addHGroup(springPanel);
var springCancelButton = addIconButton(springButtonsGroup,'btn_cancel.png',tr("Cancel"));
springCancelButton.onClick = function () { springPanel.hide();panoanimation.show();};
springCancelButton.helpTip = tr("Cancel");
var springOKButton = addIconButton(springButtonsGroup,'btn_valid.png',tr("Spring"));
springOKButton.onClick = function () { springok(); springPanel.hide(); panoanimation.show()};
springOKButton.helpTip = tr("Spring");
}
//TVPAINT CAM PANEL
{
var tvpCamNullGroup = addHGroup(tvpCamPanel);
var tvpCamNullButton = tvpCamPanel.add('radiobutton',undefined,tr("Use a Null Object"));
var tvpCamPrecompButton = tvpCamPanel.add('radiobutton',undefined,tr("Precompose layers"));
var tvpCamLayerButton = tvpCamPanel.add('radiobutton',undefined,tr("Use selected layer"));
var tvpCamLinkButton = tvpCamPanel.add('checkbox',undefined,tr("Auto-parent layers"));

tvpCamNullButton.onClick = function () {
tvpCamLinkButton.enabled = true;
};
tvpCamPrecompButton.onClick = function () {
tvpCamLinkButton.enabled = false;
};
tvpCamLayerButton.onClick = function () {
tvpCamLinkButton.enabled = true;
};

tvpCamNullButton.value = true;
tvpCamLinkButton.value = true;

addSeparator(tvpCamPanel,'');

var tvpCamMoveGroup = addHGroup(tvpCamPanel);
var tvpCamPositionButton = tvpCamMoveGroup.add('radiobutton',undefined,tr("Animate position"));
var tvpCamAnchorPointButton = tvpCamMoveGroup.add('radiobutton',undefined,tr("Animate anchor point"));
tvpCamPositionButton.value = true;

var tvpCamButtonsGroup = addHGroup(tvpCamPanel);
var tvpCamCancelButton = addIconButton(tvpCamButtonsGroup,'btn_cancel.png',tr("Cancel"));
tvpCamCancelButton.onClick = function () { tvpCamPanel.hide();panocam.show();};
tvpCamCancelButton.helpTip = tr("Cancel");
var tvpCamOKButton = addIconButton(tvpCamButtonsGroup,'btn_valid.png',tr("Import TVP Cam"));
tvpCamOKButton.onClick = function () { tvpCamOKButtonClicked(); tvpCamPanel.hide(); panocam.show()};
tvpCamOKButton.helpTip = tr("Imports TVPaint camera.");
}
//AUTORIG PANEL
{
autorigPanel.alignment = ['fill','fill'];
autorigPanel.alignChildren = ['fill','fill'];

var autorigTypeGroup = addHGroup(autorigPanel);
autorigTypeGroup.alignment = ['fill','top'];
autorigTypeGroup.alignChildren = ['fill','top'];
var autorigUngulateGroup = addIconRadioButton(autorigTypeGroup,'autorig_ungu.png',tr("Ungulate"));
var autorigUngulateButton = autorigUngulateGroup.button;
autorigUngulateButton.helpTip = tr("Horses, cattles, girafes, pigs, deers, camels, hippopotamuses...");
var autorigDigitigradeGroup = addIconRadioButton(autorigTypeGroup,'autorig_digi.png',tr("Digitigrade"));
var autorigDigitigradeButton = autorigDigitigradeGroup.button;
autorigDigitigradeButton.helpTip = tr("Dogs, cats, dinosaurs, walking birds...");
var autorigPlantigradeGroup = addIconRadioButton(autorigTypeGroup,'autorig_planti.png',tr("Plantigrade"));
var autorigPlantigradeButton = autorigPlantigradeGroup.button;
autorigPlantigradeButton.helpTip = tr("Bears, humans and primates, rabbits...");

autorigUngulateButton.onClick = function () { autorigDigitigradeButton.value = false; autorigPlantigradeButton.value = false; };
autorigDigitigradeButton.onClick = function () { autorigUngulateButton.value = false; autorigPlantigradeButton.value = false; };
autorigPlantigradeButton.onClick = function () { autorigUngulateButton.value = false; autorigDigitigradeButton.value = false; };
autorigPlantigradeButton.value = true;

var autorigCharacterButton = addIconButton(autorigPanel,'btn_autorig.png',tr("Full character"));
autorigCharacterButton.onClick = function () {
backLegDialog.right = false;
backLegDialog.left = true;
backLegShow();
};

var autorigLimbsGroup = addHGroup(autorigPanel);
var autorigLeftGroup = addVGroup(autorigLimbsGroup);
var autorigRightGroup = addVGroup(autorigLimbsGroup);

var autorigFrontLegButton = addIconButton(autorigLeftGroup,'btn_frontleg.png',tr("Front leg / Arm"));
autorigFrontLegButton.onClick = function () {
frontLegDialog.right = false;
frontLegDialog.left = false;
frontLegShow();
}
var autorigBackLegButton = addIconButton(autorigRightGroup,'btn_backleg.png',tr("Back leg"));
autorigBackLegButton.onClick = function () {
backLegDialog.right = false;
backLegDialog.left = false;
backLegShow();
};
var autorigSpineButton = addIconButton(autorigLeftGroup,'btn_spine.png',tr("Spine - Neck - Head"));
autorigSpineButton.onClick = function () {
spineDialog.fullCharacter = false;
spineShow();
};
var autorigTailButton = addIconButton(autorigRightGroup,'btn_tail.png',tr("Tail"));
autorigTailButton.onClick = function () {
tailDialog.fullCharacter = false;
tailShow();
};

var autorigCancelButton = addIconButton(autorigPanel,'btn_cancel.png',tr("Cancel"));
autorigCancelButton.onClick = function () { autorigPanel.hide();panoik.show();};
autorigCancelButton.helpTip = tr("Cancel");
autorigCancelButton.alignment = ['fill','bottom'];

//FRONT LEG WINDOW
{
var frontLegDialog = new Window ('palette',tr("Front Leg Autorig"),undefined,{closeButton:false,resizeable:true});
frontLegDialog.spacing = 2;
frontLegDialog.margins = 5;
frontLegDialog.alignChildren = ['fill','top'];
frontLegDialog.groupe = frontLegDialog.add('group');
frontLegDialog.groupe.alignChildren = ['fill','top'];

frontLegDialog.shoulder = null;
frontLegDialog.humerus = null;
frontLegDialog.radius = null;
frontLegDialog.carpus = null;
frontLegDialog.claws = null;
frontLegDialog.tip = null;
frontLegDialog.heel = null;

frontLegDialog.right = false;
frontLegDialog.left = false;

//IMAGES
var frontLegImageGroup = frontLegDialog.groupe.add('group');
frontLegImageGroup.orientation = 'stack';
var frontLegDigiImage = frontLegImageGroup.add('image',undefined,dossierIcones + 'legs_front_digi.png');
var frontLegPlantiImage = frontLegImageGroup.add('image',undefined,dossierIcones + 'legs_front_planti.png');
var frontLegUnguImage = frontLegImageGroup.add('image',undefined,dossierIcones + 'legs_front_ungu.png');

//BOUTONS DES CALQUES
var frontLegLayersGroup = addVGroup(frontLegDialog.groupe); //contient les calques : des groupes en row de text + dropdownlist*
frontLegLayersGroup.alignment = ['fill','center'];


var frontLegTypeLabel = frontLegLayersGroup.add('statictext',undefined,tr("Right Leg"));
frontLegTypeLabel.alignment = ['fill','top'];

//layers

var frontLegLayersLabel = frontLegLayersGroup.add('statictext',undefined,tr("Layers :"));
frontLegLayersLabel.alignment = ['left','top'];

var frontLegGroup1 = addHGroup(frontLegLayersGroup);
var text = frontLegGroup1.add('statictext',undefined,tr("Shoulder blade, clavicle"));
textColor(text,col.orange);
var frontLegShoulderButton = frontLegGroup1.add('dropdownlist');
frontLegShoulderButton.alignment = ['right','center'];

var frontLegGroup2 = addHGroup(frontLegLayersGroup);
text = frontLegGroup2.add('statictext',undefined,tr("Arm, humerus, shoulder"));
textColor(text,col.lightOrange);
var frontLegHumerusButton = frontLegGroup2.add('dropdownlist');
frontLegHumerusButton.alignment = ['right','center'];

var frontLegGroup3 = addHGroup(frontLegLayersGroup);
text = frontLegGroup3.add('statictext',undefined,tr("Ulna, radius, forearm, elbow"));
textColor(text,col.yellow);
var frontLegRadiusButton = frontLegGroup3.add('dropdownlist');
frontLegRadiusButton.alignment = ['right','center'];

var frontLegGroup4 = addHGroup(frontLegLayersGroup);
text = frontLegGroup4.add('statictext',undefined,tr("Carpus, palm, hand"));
textColor(text,col.blue);
var frontLegCarpusButton = frontLegGroup4.add('dropdownlist');
frontLegCarpusButton.alignment = ['right','center'];

var frontLegGroup5 = addHGroup(frontLegLayersGroup);
text = frontLegGroup5.add('statictext',undefined,tr("Claws, hoof, fingers"));
textColor(text,col.purple);
var frontLegClawsButton = frontLegGroup5.add('dropdownlist');
frontLegClawsButton.alignment = ['right','center'];

//Null Objects

var frontLegNullsLabel = frontLegLayersGroup.add('statictext',undefined,tr("Null Objects:"));
frontLegNullsLabel.alignment = ['left','top'];

var frontLegTipGroup = addHGroup(frontLegLayersGroup);
var text = frontLegTipGroup.add('statictext',undefined,tr("Tip, tiptoe"));
textColor(text,col.red);
var frontLegTipButton = frontLegTipGroup.add('dropdownlist');
frontLegTipButton.alignment = ['right','center'];

var frontLegHeelGroup = addHGroup(frontLegLayersGroup);
var text = frontLegHeelGroup.add('statictext',undefined,tr("Heel, back, contact, palm"));
textColor(text,col.red);
var frontLegHeelButton = frontLegHeelGroup.add('dropdownlist');
frontLegHeelButton.alignment = ['right','center'];

var frontLegEmptyButton = addIconButton(frontLegLayersGroup,'btn_remove.png',tr("Remove All"));
frontLegEmptyButton.onClick = function () {
frontLegShoulderButton.selection = 0;
frontLegHumerusButton.selection = 0;
frontLegRadiusButton.selection = 0;
frontLegCarpusButton.selection = 0;
frontLegClawsButton.selection = 0;
frontLegTipButton.selection = 0;
frontLegHeelButton.selection = 0;
}

var frontLegButtonsGroup = addHGroup(frontLegDialog);
frontLegButtonsGroup.alignment = ['fill','bottom'];
frontLegButtonsGroup.margins = 10;
var frontLegCancel = addIconButton(frontLegButtonsGroup,'btn_cancel.png',tr("Cancel"));
frontLegCancel.onClick = function() { frontLegDialog.hide(); };
var frontLegPrev = addIconButton(frontLegButtonsGroup,'btn_prev.png',tr("Previous"));
frontLegPrev.onClick = frontLegPrevClicked;
var frontLegNext = addIconButton(frontLegButtonsGroup,'btn_next.png',tr("Next"));
frontLegNext.onClick = frontLegNextClicked;
var frontLegOK = addIconButton(frontLegButtonsGroup,'btn_valid.png',tr("OK"));
frontLegOK.onClick = frontLegOKClicked;
}

//BACK LEG WINDOW
{
var backLegDialog = new Window ('palette',tr("Back Leg Autorig"),undefined,{closeButton:false,resizeable:true});
backLegDialog.spacing = 2;
backLegDialog.margins = 5;
backLegDialog.alignChildren = ['fill','top'];
backLegDialog.groupe = backLegDialog.add('group');
backLegDialog.groupe.alignChildren = ['fill','top'];

backLegDialog.femur = null;
backLegDialog.tibia = null;
backLegDialog.tarsus = null;
backLegDialog.claws = null;
backLegDialog.tip = null;
backLegDialog.heel = null;

backLegDialog.right = false;
backLegDialog.left = false;

//IMAGES
var backLegImageGroup = backLegDialog.groupe.add('group');
backLegImageGroup.orientation = 'stack';
var backLegDigiImage = backLegImageGroup.add('image',undefined,dossierIcones + 'legs_back_digi.png');
var backLegPlantiImage = backLegImageGroup.add('image',undefined,dossierIcones + 'legs_back_planti.png');
var backLegUnguImage = backLegImageGroup.add('image',undefined,dossierIcones + 'legs_back_ungu.png');

//BOUTONS DES CALQUES
var backLegLayersGroup = addVGroup(backLegDialog.groupe); //contient les calques : des groupes en row de text + dropdownlist*
backLegLayersGroup.alignment = ['fill','center'];

var backLegTypeLabel = backLegLayersGroup.add('statictext',undefined,tr("Right Leg"));
backLegTypeLabel.alignment = ['fill','top'];

var backLegLabel = backLegLayersGroup.add('statictext',undefined,tr("Layers :"));
backLegLabel.alignment = ['left','top'];
//tete

var backLegGroup2 = addHGroup(backLegLayersGroup);
text = backLegGroup2.add('statictext',undefined,tr("Femur, thigh"));
textColor(text,col.lightOrange);
var backLegFemurButton = backLegGroup2.add('dropdownlist');
backLegFemurButton.alignment = ['right','center'];

var backLegGroup3 = addHGroup(backLegLayersGroup);
text = backLegGroup3.add('statictext',undefined,tr("Tibia, fibula, calf, knee"));
textColor(text,col.yellow);
var backLegTibiaButton = backLegGroup3.add('dropdownlist');
backLegTibiaButton.alignment = ['right','center'];

var backLegGroup4 = addHGroup(backLegLayersGroup);
text = backLegGroup4.add('statictext',undefined,tr("Tarsus, foot"));
textColor(text,col.blue);
var backLegTarsusButton = backLegGroup4.add('dropdownlist');
backLegTarsusButton.alignment = ['right','center'];

var backLegGroup5 = addHGroup(backLegLayersGroup);
text = backLegGroup5.add('statictext',undefined,tr("Claws, hoof, toes"));
textColor(text,col.purple);
var backLegClawsButton = backLegGroup5.add('dropdownlist');
backLegClawsButton.alignment = ['right','center'];


//Null Objects

var backLegNullsLabel = backLegLayersGroup.add('statictext',undefined,tr("Null Objects:"));
backLegNullsLabel.alignment = ['left','top'];

var backLegTipGroup = addHGroup(backLegLayersGroup);
var text = backLegTipGroup.add('statictext',undefined,tr("Tip, tiptoe"));
textColor(text,col.red);
var backLegTipButton = backLegTipGroup.add('dropdownlist');
backLegTipButton.alignment = ['right','center'];

var backLegHeelGroup = addHGroup(backLegLayersGroup);
var text = backLegHeelGroup.add('statictext',undefined,tr("Heel, back, contact, palm"));
textColor(text,col.red);
var backLegHeelButton = backLegHeelGroup.add('dropdownlist');
backLegHeelButton.alignment = ['right','center'];

var backLegEmptyButton = addIconButton(backLegLayersGroup,'btn_remove.png',tr("Remove All"));
backLegEmptyButton.onClick = function () {
backLegFemurButton.selection = 0;
backLegTibiaButton.selection = 0;
backLegTarsusButton.selection = 0;
backLegClawsButton.selection = 0;
backLegTipButton.selection = 0;
backLegHeelButton.selection = 0;
}


var backLegButtonsGroup = addHGroup(backLegDialog);
backLegButtonsGroup.alignment = ['fill','bottom'];
backLegButtonsGroup.margins = 10;
var backLegCancel = addIconButton(backLegButtonsGroup,'btn_cancel.png',tr("Cancel"));
backLegCancel.onClick = function() { backLegDialog.hide(); };
var backLegPrev = addIconButton(backLegButtonsGroup,'btn_prev.png',tr("Previous"));
backLegPrev.onClick = backLegPrevClicked;
var backLegNext = addIconButton(backLegButtonsGroup,'btn_next.png',tr("Next"));
backLegNext.onClick = backLegNextClicked;
var backLegOK = addIconButton(backLegButtonsGroup,'btn_valid.png',tr("OK"));
backLegOK.onClick = backLegOKClicked;
}

//SPINE WINDOW
{
var spineDialog = new Window ('palette',tr("Spine Autorig"),undefined,{closeButton:false,resizeable:true});
spineDialog.spacing = 2;
spineDialog.margins = 5;
spineDialog.alignChildren = ['fill','top'];
spineDialog.groupe = spineDialog.add('group');
spineDialog.groupe.alignChildren = ['fill','top'];

//IMAGES
spineDialog.groupe.add('image',undefined,dossierIcones + 'spine.png');

spineDialog.head = null;
spineDialog.neck = [];
spineDialog.spine = [];
spineDialog.hips = null;

spineDialog.fullCharacter = false;


//BOUTONS DES CALQUES
var spineLayersGroup = addVGroup(spineDialog.groupe); //contient les calques : des groupes en row de text + dropdownlist*
spineLayersGroup.alignment = ['fill','center'];
var spineLabel = spineLayersGroup.add('statictext',undefined,tr("Layers :"));
spineLabel.alignment = ['left','top'];
//buttons
var spineGroup1 = addHGroup(spineLayersGroup);
var text = spineGroup1.add('statictext',undefined,tr("Head"));
textColor(text,col.orange);
var spineHeadButton = spineGroup1.add('dropdownlist');
spineHeadButton.alignment = ['right','center'];

var text = spineLayersGroup.add('statictext',undefined,tr("Neck"));
textColor(text,col.yellow);
var spineNeckFromGroup = addHGroup(spineLayersGroup);
spineNeckFromGroup.add('statictext',undefined,tr("From"));
var spineNeckFromButton = spineNeckFromGroup.add('dropdownlist');
spineNeckFromButton.alignment = ['right','center'];
var spineNeckToGroup = addHGroup(spineLayersGroup);
spineNeckToGroup.add('statictext',undefined,tr("To"));
var spineNeckToButton = spineNeckToGroup.add('dropdownlist');
spineNeckToButton.alignment = ['right','center'];

var text = spineLayersGroup.add('statictext',undefined,tr("Spine, torso, chest, thorax"));
textColor(text,col.blue);
var spineSpineFromGroup = addHGroup(spineLayersGroup);
spineSpineFromGroup.add('statictext',undefined,tr("From"));
var spineSpineFromButton = spineSpineFromGroup.add('dropdownlist');
spineSpineFromButton.alignment = ['right','center'];
var spineSpineToGroup = addHGroup(spineLayersGroup);
spineSpineToGroup.add('statictext',undefined,tr("To"));
var spineSpineToButton = spineSpineToGroup.add('dropdownlist');
spineSpineToButton.alignment = ['right','center'];

var spineGroup2 = addHGroup(spineLayersGroup);
var text = spineGroup2.add('statictext',undefined,tr("Hips, pelvis, abdomen"));
textColor(text,col.purple);
var spineHipsButton = spineGroup2.add('dropdownlist');
spineHipsButton.alignment = ['right','center'];

var spineEmptyButton = addIconButton(spineLayersGroup,'btn_remove.png',tr("Remove All"));
spineEmptyButton.onClick = function () {
spineHeadButton.selection = 0;
spineNeckFromGroup.selection = 0;
spineNeckToGroup.selection = 0;
spineSpineFromGroup.selection = 0;
spineSpineToGroup.selection = 0;
spineHipsButton.selection = 0;
}

var spineButtonsGroup = addHGroup(spineDialog);
spineButtonsGroup.alignment = ['fill','bottom'];
spineButtonsGroup.margins = 10;
var spineCancel = addIconButton(spineButtonsGroup,'btn_cancel.png',tr("Cancel"));
spineCancel.onClick = function() { spineDialog.hide(); };
spineCancel.alignment = ['left','bottom'];
var spinePrev = addIconButton(spineButtonsGroup,'btn_prev.png',tr("Previous"));
spinePrev.onClick = spinePrevClicked;
var spineNext = addIconButton(spineButtonsGroup,'btn_next.png',tr("Next"));
spineNext.onClick = spineNextClicked;
var spineOK = addIconButton(spineButtonsGroup,'btn_valid.png',tr("OK"));
spineOK.onClick = spineOKClicked;
spineOK.alignment = ['right','bottom'];

}

//TAIL WINDOW
{
var tailDialog = new Window ('palette',tr("Tail Autorig"),undefined,{closeButton:false,resizeable:true});
tailDialog.spacing = 2;
tailDialog.margins = 5;
tailDialog.alignChildren = ['fill','top'];
tailDialog.groupe = tailDialog.add('group');
tailDialog.groupe.alignChildren = ['fill','top'];

tailDialog.hips = null;
tailDialog.tail = null;

tailDialog.fullCharacter = false;

//IMAGES
tailDialog.groupe.add('image',undefined,dossierIcones + 'tail.png');

//BOUTONS DES CALQUES
var tailLayersGroup = addVGroup(tailDialog.groupe); //contient les calques : des groupes en row de text + dropdownlist*
tailLayersGroup.alignment = ['fill','center'];
var tailLabel = tailLayersGroup.add('statictext',undefined,tr("Layers :"));
tailLabel.alignment = ['left','top'];
//buttons
var tailGroup1 = addHGroup(tailLayersGroup);
var text = tailGroup1.add('statictext',undefined,tr("Hips, pelvis, abdomen"));
textColor(text,col.purple);
var tailHipsButton = tailGroup1.add('dropdownlist');
tailHipsButton.alignment = ['right','center'];

var text = tailLayersGroup.add('statictext',undefined,tr("Tail"));
textColor(text,col.yellow);
var tailTailFromGroup = addHGroup(tailLayersGroup);
tailTailFromGroup.add('statictext',undefined,tr("From"));
var tailTailFromButton = tailTailFromGroup.add('dropdownlist');
tailTailFromButton.alignment = ['right','center'];
var tailTailToGroup = addHGroup(tailLayersGroup);
tailTailToGroup.add('statictext',undefined,tr("To"));
var tailTailToButton = tailTailToGroup.add('dropdownlist');
tailTailToButton.alignment = ['right','center'];

var tailOptionsLabel = tailLayersGroup.add('statictext',undefined,tr("Options:"));
tailOptionsLabel.alignment = ['left','top'];

var tailGroup2 = addHGroup(tailLayersGroup);
var tailSimpleButton = tailGroup2.add('radiobutton',undefined,tr("Simple"));
var tailCubicButton = tailGroup2.add('radiobutton',undefined,tr("Two curves"));
tailSimpleButton.value = true;

var tailEmptyButton = addIconButton(tailLayersGroup,'btn_remove.png',tr("Remove All"));
tailEmptyButton.onClick = function () {
tailHipsButton.selection = 0;
tailTailFromButton.selection = 0;
tailTailToGroup.selection = 0;
}

var tailButtonsGroup = addHGroup(tailDialog);
tailButtonsGroup.alignment = ['fill','bottom'];
tailButtonsGroup.margins = 10;
var tailCancel = addIconButton(tailButtonsGroup,'btn_cancel.png',tr("Cancel"));
tailCancel.onClick = function() { tailDialog.hide(); };
var tailPrev = addIconButton(tailButtonsGroup,'btn_prev.png',tr("Previous"));
tailPrev.onClick = tailPrevClicked;
var tailOK = addIconButton(tailButtonsGroup,'btn_valid.png',tr("OK"));
tailOK.onClick = tailOKClicked;
}


}

// On definit le layout et on redessine la fenetre quand elle est resizee
palette.layout.layout(true);
palette.layout.resize();
palette.onResizing = palette.onResize = function () { this.layout.resize(); }
if (!(thisObj instanceof Panel)) palette.show();

Duik.ui.hideProgressPanel();
}
}

// On definit le layout et on redessine la fenetre quand elle est resizee
palette.layout.layout(true);
palette.layout.resize();
palette.onResizing = palette.onResize = function () { this.layout.resize(); }
if (!(thisObj instanceof Panel)) palette.show();


})(this);




