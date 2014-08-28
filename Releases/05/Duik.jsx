
/*
	

Duik
Copyright (c) 2008, 2009 Nicolas Dufresne
http://ik.duduf.fr
http://www.duduf.com



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
	
	
	
	
	


function IKtools(thisObj){

//===============================================
//LES FONCTIONS
//===============================================


//FONCTION QUAND ON CLIQUE SUR CREER
function ik(){
	if (boutonbones.selection == 0) {onebone();}
	if (boutonbones.selection == 1) {twobones();}
	if (boutonbones.selection == 2) {pretwoplusbones.show();}
	}

//FONCTION QUI APPLIQUE UN IK SUR UN SEUL BONE
function onebone(){

//vérifions qu'il n'y a bien que deux calques de sélectionnés
if (app.project.activeItem.selectedLayers.length == 2) {

//récupérer le bone
var bonename = app.project.activeItem.selectedLayers[0].name;
var bone = app.project.activeItem.layer(bonename);
//récupérer le controleur
var controleurname = app.project.activeItem.selectedLayers[1].name;
var controleur = app.project.activeItem.layer(controleurname);

			//  début de groupe d'annulation
			app.beginUndoGroup("IK " + controleurname);

//créer un zéro
var zero = app.project.activeItem.layers.addNull();
//garder de coté le parent actuel du controleur
var controleurparent = controleur.parent;
//déparenter le controleur, pour pouvoir récupérer ses infos de position
controleur.parent = null;
//placer le zéro sur le controleur
zero.position.setValue(controleur.position.value);
zero.name = "IK_zero_" + bonename;
//reparenter le controleur
controleur.parent = controleurparent;

//récupérer le parent du bone
var parent = bone.parent;

//défaire les liens
bone.parent = null;
zero.parent = null;

//établir les bonnes parentées
bone.parent = zero;
zero.parent = parent;

//verrouiller et masquer le zéro
zero.moveToEnd();
zero.guideLayer = true;
zero.locked = true;
zero.enabled = false;


//=========================================================
//EXPRESSION A INSERER
var expression = "bone = thisLayer\n" +
"controleur = thisComp.layer(\"" + controleurname + "\");\n" +
"zero = thisComp.layer(\"" + zero.name + "\");\n" +
"function positionworld(thelayer){\n" +
"return thelayer.toWorld(thelayer.anchorPoint);\n" +
"}\n" +
"function oriente(a, b, P) {\n" +
"return ((b[0]-a[0])*(P[1]-a[1]) - (P[0]-a[0])*(b[1]-a[1]) );\n" +
"}\n" +
"A = positionworld(bone);\n" +
"B = positionworld(zero);\n" +
"E = positionworld(controleur);\n" +
"a = length(B,E);\n" +
"b = length(E,A);\n" +
"c = length(A,B);\n" +
"cosalpha = (a*a - b*b - c*c)/(-2*b*c);\n" +
"if (oriente(A,B,E)>0) {\n" +
"radiansToDegrees(Math.acos(cosalpha))\n" +
"} else {\n" +
"-radiansToDegrees(Math.acos(cosalpha))\n" +
"}"
//=========================================================

bone.transform.rotation.expression = expression;


			//fin du groupe d'annulation			
			app.endUndoGroup();
	
} else {
	alert ("Il faut d'abord sélectionner le bone, puis le controleur, dans l'ordre.","Attention !",true);
	}

}


//FONCTION QUI APPLIQUE UN IK SUR DEUX BONES
function twobones(){

//vérifions qu'il y a 3 layers sélectionnés
if (app.project.activeItem.selectedLayers.length == 3) {

//récupérer le bone du bout
var boneboutname = app.project.activeItem.selectedLayers[0].name;
var bonebout = app.project.activeItem.layer(boneboutname);
//récupérer le bone racine
var boneracinename = app.project.activeItem.selectedLayers[1].name;
var boneracine = app.project.activeItem.layer(boneracinename);
//récupérer le controleur
var controleurname = app.project.activeItem.selectedLayers[2].name;
var controleur = app.project.activeItem.layer(controleurname);

//vérifions que les parentées sont bonnes
	if (bonebout.parent == boneracine) {

//  début de groupe d'annulation
			app.beginUndoGroup("IK " + controleurname);
			
//Ajoutons une case a cocher sur le controleur pour choisir le sens de l'IK
coude = controleur.Effects.addProperty("ADBE Checkbox Control");
coude.name = "Orientation IK" + boneracinename.slice(-15);

//créer un zéro
var zero = app.project.activeItem.layers.addNull();
var controleurparent = controleur.parent;
controleur.parent = null;
zero.position.setValue(controleur.position.value);
zero.name = "IK_zero" + boneboutname.slice(-24);
controleur.parent = controleurparent;

//lier le zéro au bone du bout
zero.parent = bonebout;

//verrouiller et masquer le zéro
zero.moveToEnd();
zero.guideLayer = true;
zero.locked = true;
zero.enabled = false;


//=========================================================
//EXPRESSION A INSERER SUR LE BONE BOUT
var expressionbout = "boneracine = \"" + boneracinename + "\";\n" + 
"bonebout = \"" + boneboutname + "\";\n" + 
"zero = \"" + zero.name + "\";\n" + 
"controleur = \"" + controleurname + "\";\n" + 
"if (thisComp.layer(controleur).effect(\"" + coude.name + "\")(1) == 1) {cw = true}else{cw=false}\n" +
"function getWorldPos(theLayerName){\n" + 
"  L = thisComp.layer(theLayerName);\n" + 
"  return L.toWorld(L.anchorPoint);\n" + 
"}\n" + 
"function oriente(a, b, P) {\n" +
"return ((b[0]-a[0])*(P[1]-a[1]) - (P[0]-a[0])*(b[1]-a[1]) );\n" +
"}\n" +
"A = getWorldPos(boneracine);\n" + 
"B = getWorldPos(bonebout);\n" + 
"C = getWorldPos(zero);\n" + 
"E = getWorldPos(controleur);\n" + 
"a = length(B,C);\n" + 
"b = length(E,A);\n" + 
"c = length(A,B);\n" + 
"x = (b*b + c*c - a*a )/(2*b);\n" + 
"alpha = Math.acos(clamp(x/c,-1,1));\n" + 
"y = b - x;\n" + 
"  gamma = Math.acos(clamp(y/a,-1,1));\n" + 
"result = (cw ? 1 : -1)*radiansToDegrees(gamma + alpha);" +
"  V1 = B - A;\n" + 
"  adj1 = radiansToDegrees(Math.atan2(V1[1],V1[0]));\n" + 
"  V2 = C - B;\n" + 
"  adj2 = radiansToDegrees(Math.atan2(V2[1],V2[0]));\n" + 
"  result +  adj1 - adj2 + value;"
//=========================================================

bonebout.transform.rotation.expression = expressionbout;

//=========================================================
//EXPRESSION A INSERER SUR LE BONE RACINE
var expressionracine = "boneracine = \"" + boneracinename + "\";\n" + 
"bonebout = \"" + boneboutname + "\";\n" + 
"zero = \"" + zero.name + "\";\n" + 
"controleur = \"" + controleurname + "\";\n" + 
"if (thisComp.layer(controleur).effect(\"" + coude.name + "\")(1) == 1) {cw = true}else{cw=false}\n" +
"function getWorldPos(theLayerName){\n" + 
"  L = thisComp.layer(theLayerName);\n" + 
"  return L.toWorld(L.anchorPoint);\n" + 
"}\n" + 
"function oriente(a, b, P) {\n" +
"return ((b[0]-a[0])*(P[1]-a[1]) - (P[0]-a[0])*(b[1]-a[1]) );\n" +
"}\n" +
"A = getWorldPos(boneracine);\n" + 
"B = getWorldPos(bonebout);\n" + 
"C = getWorldPos(zero);\n" + 
"E = getWorldPos(controleur);\n" + 
"a = length(B,C);\n" + 
"b = length(E,A);\n" + 
"c = length(A,B);\n" + 
"x = (b*b + c*c - a*a )/(2*b);\n" + 
"alpha = Math.acos(clamp(x/c,-1,1));\n" + 
"D = E - A;\n" + 
"delta = Math.atan2(D[1],D[0]);\n" + 
"result = radiansToDegrees(delta - (cw ? 1 : -1)*alpha);\n" +
"V = B - A;\n" + 
"adj1 = radiansToDegrees(Math.atan2(V[1],V[0]));\n" + 
"result - adj1 + value;"
//=======================================================

boneracine.transform.rotation.expression = expressionracine;


			//fin du groupe d'annulation
			
			app.endUndoGroup();
			
			
} else { alert("Il faut bien sélectionner d'abord le bone du bout, puis celui de la racine, puis le contrôleur, dans cet ordre précis","Attention !",true); }
} else { alert("Vous devez d'abord sélectionner les bones et le contrôleur","Attention !",true); }


	}



//FONCTION QUI APPLIQUE UN IK SUR DEUX + UN BONES
function twoplusbones(){

pretwoplusbones.close();

//vérifions qu'il y a 4 layers sélectionnés
if (app.project.activeItem.selectedLayers.length == 4) {


//récupérer la main
var mainname = app.project.activeItem.selectedLayers[0].name;
var main = app.project.activeItem.layer(mainname);
//récupérer le bone du bout
var boneboutname = app.project.activeItem.selectedLayers[1].name;
var bonebout = app.project.activeItem.layer(boneboutname);
//récupérer le bone racine
var boneracinename = app.project.activeItem.selectedLayers[2].name;
var boneracine = app.project.activeItem.layer(boneracinename);
//récupérer le controleur
var controleurname = app.project.activeItem.selectedLayers[3].name;
var controleur = app.project.activeItem.layer(controleurname);

//vérifions que les parentées sont bonnes
	if (bonebout.parent == boneracine) { 
		if (main.parent == bonebout) {
			


			//  début de groupe d'annulation
			app.beginUndoGroup("IK " + controleurname);
			
			//une case a cocher pour choisir le sens de l'IK sur le controleur
			coude = controleur.Effects.addProperty("ADBE Checkbox Control");
			coude.name = "Orientation IK" + mainname.slice(-15);
			
			
//=========================================================
//EXPRESSION A INSERER SUR LE BONE BOUT
var expressionbout ="boneracine = \"" + boneracinename + "\";\n" + 
"bonebout = \"" + boneboutname + "\";\n" + 
"zero = \"" + mainname + "\";\n" + 
"controleur = \"" + controleurname + "\";\n" + 
"if (thisComp.layer(controleur).effect(\"" + coude.name + "\")(1) == 1) {cw = true}else{cw=false}\n" +
"function getWorldPos(theLayerName){\n" + 
"  L = thisComp.layer(theLayerName);\n" + 
"  return L.toWorld(L.anchorPoint);\n" + 
"}\n" + 
"function oriente(a, b, P) {\n" +
"return ((b[0]-a[0])*(P[1]-a[1]) - (P[0]-a[0])*(b[1]-a[1]) );\n" +
"}\n" +
"A = getWorldPos(boneracine);\n" + 
"B = getWorldPos(bonebout);\n" + 
"C = getWorldPos(zero);\n" + 
"E = getWorldPos(controleur);\n" + 
"a = length(B,C);\n" + 
"b = length(E,A);\n" + 
"c = length(A,B);\n" + 
"x = (b*b + c*c - a*a )/(2*b);\n" + 
"alpha = Math.acos(clamp(x/c,-1,1));\n" + 
"y = b - x;\n" + 
"  gamma = Math.acos(clamp(y/a,-1,1));\n" + 
"result = (cw ? 1 : -1)*radiansToDegrees(gamma + alpha);" +
"  V1 = B - A;\n" + 
"  adj1 = radiansToDegrees(Math.atan2(V1[1],V1[0]));\n" + 
"  V2 = C - B;\n" + 
"  adj2 = radiansToDegrees(Math.atan2(V2[1],V2[0]));\n" + 
"  result +  adj1 - adj2 + value;"
//=========================================================

bonebout.transform.rotation.expression = expressionbout;

//=========================================================
//EXPRESSION A INSERER SUR LE BONE RACINE
var expressionracine = "boneracine = \"" + boneracinename + "\";\n" + 
"bonebout = \"" + boneboutname + "\";\n" + 
"zero = \"" + mainname + "\";\n" + 
"controleur = \"" + controleurname + "\";\n" + 
"if (thisComp.layer(controleur).effect(\"" + coude.name + "\")(1) == 1) {cw = true}else{cw=false}\n" +
"function getWorldPos(theLayerName){\n" + 
"  L = thisComp.layer(theLayerName);\n" + 
"  return L.toWorld(L.anchorPoint);\n" + 
"}\n" + 
"function oriente(a, b, P) {\n" +
"return ((b[0]-a[0])*(P[1]-a[1]) - (P[0]-a[0])*(b[1]-a[1]) );\n" +
"}\n" +
"A = getWorldPos(boneracine);\n" + 
"B = getWorldPos(bonebout);\n" + 
"C = getWorldPos(zero);\n" + 
"E = getWorldPos(controleur);\n" + 
"a = length(B,C);\n" + 
"b = length(E,A);\n" + 
"c = length(A,B);\n" + 
"x = (b*b + c*c - a*a )/(2*b);\n" + 
"alpha = Math.acos(clamp(x/c,-1,1));\n" + 
"D = E - A;\n" + 
"delta = Math.atan2(D[1],D[0]);\n" + 
"result = radiansToDegrees(delta - (cw ? 1 : -1)*alpha);\n" +
"V = B - A;\n" + 
"adj1 = radiansToDegrees(Math.atan2(V[1],V[0]));\n" + 
"result - adj1 + value;"
//=======================================================

boneracine.transform.rotation.expression = expressionracine;

main.transform.rotation.expression = "value + thisComp.layer(\"" + controleurname + "\").transform.rotation";
			
			//fin du groupe d'annulation
			app.endUndoGroup();


if (! boutonpasgoal.value) {

//  début de groupe d'annulation
app.beginUndoGroup("IK Goal " + mainname);

	goal(main);

//fin du groupe d'annulation
app.endUndoGroup();
}
				
			
} else { alert("Il faut bien sélectionner d'abord le bone du bout, puis celui de la racine, puis le contrôleur, dans cet ordre précis","Attention !",true); }
} else { alert("Il faut bien sélectionner d'abord le bone du bout, puis celui de la racine, puis le contrôleur, dans cet ordre précis","Attention !",true); }
} else { alert("Vous devez d'abord sélectionner les bones et le contrôleur","Attention !",true); }

	}


//FONCTION QUI CREE UN IK GOAL
function goal(layer){



var goalrot = layer.Rotation.value;
var parentrot = layer.parent.Rotation.value;
var transformeffect = layer.Effects.addProperty("ADBE Geometry2");
transformeffect.property(1).expression = "anchorPoint";
transformeffect.property(2).expression = "anchorPoint";
transformeffect.property(8).expression = "v = toWorldVec([1,0,0]);\n" + "-radiansToDegrees(Math.atan2(v[1],v[0])) + thisLayer.transform.rotation";
transformeffect.name = "IK_Goal";


}

//FONCTION QUI GOAL LE CALQUE ACTIF
function pregoal(){

if (app.project.activeItem.selectedLayers.length == 1) {	
if (app.project.activeItem.selectedLayers[0].parent != null){
	//  début de groupe d'annulation
app.beginUndoGroup("IK Goal " + app.project.activeItem.selectedLayers[0].name);
goal(app.project.activeItem.selectedLayers[0]);

//fin du groupe d'annulation
app.endUndoGroup();

}else{alert("Le calque sélectionné n'a pas de parent !","Attention !",true);}
}else{alert("Il faut d'abord sélectionner le calque","Attention !",true);}
}
//FONCTION POUR CREER UN CONTROLEUR
function controleur(){
 
//vérifions qu'il n'y a qu'un calque sélectionné 
 if (app.project.activeItem.selectedLayers.length == 1) {
	 
	 	//  début de groupe d'annulation
		app.beginUndoGroup("Controleur " + app.project.activeItem.selectedLayers[0].name);
		
		//le calque où placer le contrôleur et sa postion
		var bone = app.project.activeItem.selectedLayers[0];



		var boneparent = bone.parent;
		bone.parent = null;
		var boneposition = bone.transform.position.value;
		bone.parent = boneparent;

	
		//le controleur
		var controleur = app.project.activeItem.layers.addNull();
		controleur.transform.position.setValue(boneposition);
		controleur.name = "C_" + bone.name.slice(-28);
		
		//fin du groupe d'annulation
app.endUndoGroup();
	 
	 } else {alert("Vous devez d'abord sélectionner le calque où placer le contrôleur");}
	 
	 }


//FONCTION CONF WIGGLE POSITION
function wiggleconfpos(){
	
if (positiontous.value){positionX.enabled = false ; positionY.enabled = false ; positionZ.enabled = false;}
else{positionX.enabled = true ; positionY.enabled = true ; positionZ.enabled = true;}
	
	}

//FONCTION CONF WIGGLE ROTATION
function wiggleconfrot(){
	
if (rotationtous.value){rotationX.enabled = false ; rotationY.enabled = false ; rotationZ.enabled = false;}
else{rotationX.enabled = true ; rotationY.enabled = true ; rotationZ.enabled = true;}
	
	}

//FONCTION CONF WIGGLE ECHELLE
function wiggleconfscale(){
	
if (echelletous.value){echelleX.enabled = false ; echelleY.enabled = false ; }
else{echelleX.enabled = true ; echelleY.enabled = true ;}
	
	}


//FONCTION WIGGLE OK
function wigglevalid(){

//vérifions qu'il n'y a qu'un calque sélectionné
if (app.project.activeItem.selectedLayers.length == 1){
	
			//  début de groupe d'annulation
			app.beginUndoGroup("Wiggle");
			
//le calque sélectionné
var calque = app.project.activeItem.selectedLayers[0];
var calquetridi = calque.threeDLayer;

if (positiontous.value){
	amp = calque.Effects.addProperty("ADBE Slider Control");
	amp.name = "Pos Amplitude";
	freq = calque.Effects.addProperty("ADBE Slider Control");
	freq.name = "Pos Frequence";
	calque.transform.position.expression = "wiggle(effect(\"Pos Frequence\")(1),effect(\"Pos Amplitude\")(1))";
	} else {
		if (calquetridi && positionX.value && positionY.value && positionZ.value){
				amp = calque.Effects.addProperty("ADBE Slider Control");
				amp.name = "Pos X Amplitude";
				amp = calque.Effects.addProperty("ADBE Slider Control");
				amp.name = "Pos Y Amplitude";
				amp = calque.Effects.addProperty("ADBE Slider Control");
				amp.name = "Pos Z Amplitude";
				freq = calque.Effects.addProperty("ADBE Slider Control");
				freq.name = "Pos X Frequence";
				freq = calque.Effects.addProperty("ADBE Slider Control");
				freq.name = "Pos Y Frequence";
				freq = calque.Effects.addProperty("ADBE Slider Control");
				freq.name = "Pos Z Frequence";
				calque.transform.position.expression = "X=wiggle(effect(\"Pos X Frequence\")(1),effect(\"Pos X Amplitude\")(1));\n" + "Y=wiggle(effect(\"Pos Y Frequence\")(1),effect(\"Pos Y Amplitude\")(1));\n" + "Z=wiggle(effect(\"Pos Z Frequence\")(1),effect(\"Pos Z Amplitude\")(1));\n" +  "[X[0],Y[1],Z[2]]";
			}
		if (positionX.value && positionY.value && !positionZ.value){
				amp = calque.Effects.addProperty("ADBE Slider Control");
				amp.name = "Pos X Amplitude";
				amp = calque.Effects.addProperty("ADBE Slider Control");
				amp.name = "Pos Y Amplitude";
				freq = calque.Effects.addProperty("ADBE Slider Control");
				freq.name = "Pos X Frequence";
				freq = calque.Effects.addProperty("ADBE Slider Control");
				freq.name = "Pos Y Frequence";
				if (calquetridi){calque.transform.position.expression = "X=wiggle(effect(\"Pos X Frequence\")(1),effect(\"Pos X Amplitude\")(1));\n" + "Y=wiggle(effect(\"Pos Y Frequence\")(1),effect(\"Pos Y Amplitude\")(1));\n" + "[X[0],Y[1],transform.position[2]]";}
				else {calque.transform.position.expression = "X=wiggle(effect(\"Pos X Frequence\")(1),effect(\"Pos X Amplitude\")(1));\n" + "Y=wiggle(effect(\"Pos Y Frequence\")(1),effect(\"Pos Y Amplitude\")(1));\n" + "[X[0],Y[1]]";}
			}
		if (calquetridi && positionX.value && !positionY.value && positionZ.value){
				amp = calque.Effects.addProperty("ADBE Slider Control");
				amp.name = "Pos X Amplitude";
				amp = calque.Effects.addProperty("ADBE Slider Control");
				amp.name = "Pos Z Amplitude";
				freq = calque.Effects.addProperty("ADBE Slider Control");
				freq.name = "Pos X Frequence";
				freq = calque.Effects.addProperty("ADBE Slider Control");
				freq.name = "Pos Z Frequence";
				calque.transform.position.expression = "X=wiggle(effect(\"Pos X Frequence\")(1),effect(\"Pos X Amplitude\")(1));\n" + "Z=wiggle(effect(\"Pos Z Frequence\")(1),effect(\"Pos Z Amplitude\")(1));\n" + "[X[0],transform.position[1],Z[2]]";
			}
		if (calquetridi && !positionX.value && positionY.value && positionZ.value) {
			amp = calque.Effects.addProperty("ADBE Slider Control");
				amp.name = "Pos Y Amplitude";
				amp = calque.Effects.addProperty("ADBE Slider Control");
				amp.name = "Pos Z Amplitude";
				freq = calque.Effects.addProperty("ADBE Slider Control");
				freq.name = "Pos Y Frequence";
				freq = calque.Effects.addProperty("ADBE Slider Control");
				freq.name = "Pos Z Frequence";
				calque.transform.position.expression = "Y=wiggle(effect(\"Pos Y Frequence\")(1),effect(\"Pos Y Amplitude\")(1));\n" + "Z=wiggle(effect(\"Pos Z Frequence\")(1),effect(\"Pos Z Amplitude\")(1));\n" + "[transform.position[0],Y[1],Z[2]]";
			}
		if (positionX.value && !positionY.value && !positionZ.value){
				amp = calque.Effects.addProperty("ADBE Slider Control");
				amp.name = "Pos X Amplitude";
				freq = calque.Effects.addProperty("ADBE Slider Control");
				freq.name = "Pos X Frequence";
				if (calquetridi){calque.transform.position.expression = "X=wiggle(effect(\"Pos X Frequence\")(1),effect(\"Pos X Amplitude\")(1));\n" + "[X[0],transform.position[1],transform.position[2]]";}
				else {calque.transform.position.expression = "X=wiggle(effect(\"Pos X Frequence\")(1),effect(\"Pos X Amplitude\")(1));\n" + "[X[0],transform.position[1]]";}
				}
		if (!positionX.value && positionY.value && !positionZ.value){
				amp = calque.Effects.addProperty("ADBE Slider Control");
				amp.name = "Pos Y Amplitude";
				freq = calque.Effects.addProperty("ADBE Slider Control");
				freq.name = "Pos Y Frequence";
				if (calquetridi){calque.transform.position.expression = "Y=wiggle(effect(\"Pos Y Frequence\")(1),effect(\"Pos Y Amplitude\")(1));\n" + "[transform.position[0],Y[1],transform.position[2]]";}
				else{calque.transform.position.expression = "Y=wiggle(effect(\"Pos Y Frequence\")(1),effect(\"Pos Y Amplitude\")(1));\n" + "[transform.position[0],Y[1]]";}
			}
		if (calquetridi && !positionX.value && !positionY.value && positionZ.value){
				amp = calque.Effects.addProperty("ADBE Slider Control");
				amp.name = "Pos Z Amplitude";
				freq = calque.Effects.addProperty("ADBE Slider Control");
				freq.name = "Pos Z Frequence";
				calque.transform.position.expression = "Z=wiggle(effect(\"Pos Z Frequence\")(1),effect(\"Pos Z Amplitude\")(1));\n" + "[transform.position[0],transform.position[1],Z[2]]";
			}
		if (!calquetridi && positionZ.value) {alert("Le calque sélectionné n'est pas un calque 3D, impossible d'y ajouter un wiggle sur l'axe Z","Attention !");}
	}

if (echelletous.value){
	amp = calque.Effects.addProperty("ADBE Slider Control");
	amp.name = "Ech Amplitude";
	freq = calque.Effects.addProperty("ADBE Slider Control");
	freq.name = "Ech Frequence";
	calque.transform.scale.expression = "wiggle(effect(\"Ech Frequence\")(1),effect(\"Ech Amplitude\")(1))";
	}else{
		if (echelleX.value){
			amp = calque.Effects.addProperty("ADBE Slider Control");
			amp.name = "Ech X Amplitude";
			freq = calque.Effects.addProperty("ADBE Slider Control");
			freq.name = "Ech X Frequence";
			calque.transform.scale.expression = "X=wiggle(effect(\"Ech X Frequence\")(1),effect(\"Ech X Amplitude\")(1));\n" + "[X[0],transform.scale[1]]";
			}
		if (echelleY.value){
			amp = calque.Effects.addProperty("ADBE Slider Control");
			amp.name = "Ech Y Amplitude";
			freq = calque.Effects.addProperty("ADBE Slider Control");
			freq.name = "Ech Y Frequence";
			calque.transform.scale.expression = "Y=wiggle(effect(\"Ech Y Frequence\")(1),effect(\"Ech Y Amplitude\")(1));\n" + "[transform.scale[0],Y[1]]";
			}
	}

if (rotationtous.value){
	amp = calque.Effects.addProperty("ADBE Slider Control");
	amp.name = "Rot Amplitude";
	freq = calque.Effects.addProperty("ADBE Slider Control");
	freq.name = "Rot Frequence";
	if(calquetridi){calque.transform.orientation.expression = "wiggle(effect(\"Rot Frequence\")(1),effect(\"Rot Amplitude\")(1))";}
	else{calque.transform.rotation.expression = "wiggle(effect(\"Rot Frequence\")(1),effect(\"Rot Amplitude\")(1))";}
	} else {
		if (rotationX.value && rotationY.value && rotationZ.value){
				calque.threeDLayer = true;
				amp = calque.Effects.addProperty("ADBE Slider Control");
				amp.name = "Rot X Amplitude";
				amp = calque.Effects.addProperty("ADBE Slider Control");
				amp.name = "Rot Y Amplitude";
				amp = calque.Effects.addProperty("ADBE Slider Control");
				amp.name = "Rot Z Amplitude";
				freq = calque.Effects.addProperty("ADBE Slider Control");
				freq.name = "Rot X Frequence";
				freq = calque.Effects.addProperty("ADBE Slider Control");
				freq.name = "Rot Y Frequence";
				freq = calque.Effects.addProperty("ADBE Slider Control");
				freq.name = "Rot Z Frequence";
				calque.transform.orientation.expression = "X=wiggle(effect(\"Rot X Frequence\")(1),effect(\"Rot X Amplitude\")(1));\n" + "Y=wiggle(effect(\"Rot Y Frequence\")(1),effect(\"Rot Y Amplitude\")(1));\n" + "Z=wiggle(effect(\"Rot Z Frequence\")(1),effect(\"Rot Z Amplitude\")(1));\n" +  "[Y[0],X[1],Z[2]]";
			}
		if (rotationX.value && rotationY.value && !rotationZ.value){
				calque.threeDLayer = true;
				amp = calque.Effects.addProperty("ADBE Slider Control");
				amp.name = "Rot X Amplitude";
				amp = calque.Effects.addProperty("ADBE Slider Control");
				amp.name = "Rot Y Amplitude";
				freq = calque.Effects.addProperty("ADBE Slider Control");
				freq.name = "Rot X Frequence";
				freq = calque.Effects.addProperty("ADBE Slider Control");
				freq.name = "Rot Y Frequence";
				calque.transform.orientation.expression = "X=wiggle(effect(\"Rot X Frequence\")(1),effect(\"Rot X Amplitude\")(1));\n" + "Y=wiggle(effect(\"Rot Y Frequence\")(1),effect(\"Rot Y Amplitude\")(1));\n" + "[Y[0],X[1],transform.orientation[2]]";
			}
		if (rotationX.value && !rotationY.value && rotationZ.value){
				calque.threeDLayer = true;
				amp = calque.Effects.addProperty("ADBE Slider Control");
				amp.name = "Rot X Amplitude";
				amp = calque.Effects.addProperty("ADBE Slider Control");
				amp.name = "Rot Z Amplitude";
				freq = calque.Effects.addProperty("ADBE Slider Control");
				freq.name = "Rot X Frequence";
				freq = calque.Effects.addProperty("ADBE Slider Control");
				freq.name = "Rot Z Frequence";
				calque.transform.orientation.expression = "X=wiggle(effect(\"Rot X Frequence\")(1),effect(\"Rot X Amplitude\")(1));\n" + "Z=wiggle(effect(\"Rot Z Frequence\")(1),effect(\"Rot Z Amplitude\")(1));\n" + "[transform.orientation[0],X[1],Z[2]]";
			}
		if (!rotationX.value && rotationY.value && rotationZ.value) {
			calque.threeDLayer = true;
			amp = calque.Effects.addProperty("ADBE Slider Control");
				amp.name = "Rot Y Amplitude";
				amp = calque.Effects.addProperty("ADBE Slider Control");
				amp.name = "Rot Z Amplitude";
				freq = calque.Effects.addProperty("ADBE Slider Control");
				freq.name = "Rot Y Frequence";
				freq = calque.Effects.addProperty("ADBE Slider Control");
				freq.name = "Rot Z Frequence";
				calque.transform.orientation.expression = "Y=wiggle(effect(\"Rot Y Frequence\")(1),effect(\"Rot Y Amplitude\")(1));\n" + "Z=wiggle(effect(\"Rot Z Frequence\")(1),effect(\"Rot Z Amplitude\")(1));\n" + "[Y[0],transform.orientation[1],Z[2]]";
			}
		if (rotationX.value && !rotationY.value && !rotationZ.value){
			calque.threeDLayer = true;
				amp = calque.Effects.addProperty("ADBE Slider Control");
				amp.name = "Rot X Amplitude";
				freq = calque.Effects.addProperty("ADBE Slider Control");
				freq.name = "Rot X Frequence";
				calque.transform.orientation.expression = "X=wiggle(effect(\"Rot X Frequence\")(1),effect(\"Rot X Amplitude\")(1));\n" + "[transform.orientation[0],X[1],transform.orientation[2]]";
				}
		if (!rotationX.value && rotationY.value && !rotationZ.value){
			calque.threeDLayer = true;
				amp = calque.Effects.addProperty("ADBE Slider Control");
				amp.name = "Rot Y Amplitude";
				freq = calque.Effects.addProperty("ADBE Slider Control");
				freq.name = "Rot Y Frequence";
				calque.transform.orientation.expression = "Y=wiggle(effect(\"Rot Y Frequence\")(1),effect(\"Rot Y Amplitude\")(1));\n" + "[Y[0],transform.orientation[1],transform.orientation[2]]";
			}
		if (!rotationX.value && !rotationY.value && rotationZ.value){
			calque.threeDLayer = true;
				amp = calque.Effects.addProperty("ADBE Slider Control");
				amp.name = "Rot Z Amplitude";
				freq = calque.Effects.addProperty("ADBE Slider Control");
				freq.name = "Rot Z Frequence";
				calque.transform.orientation.expression = "Z=wiggle(effect(\"Rot Z Frequence\")(1),effect(\"Rot Z Amplitude\")(1));\n" + "[transform.orientation[0],transform.orientation[1],Z[2]]";
			}
	}





if (opacitebouton.value){
			amp = calque.Effects.addProperty("ADBE Slider Control");
			amp.name = "Opa Amplitude";
			freq = calque.Effects.addProperty("ADBE Slider Control");
			freq.name = "Opa Frequence";
			calque.transform.opacity.expression = "wiggle(effect(\"Opa Frequence\")(1),effect(\"Opa Amplitude\")(1))";
	}

			//fin du groupe d'annulation			
			app.endUndoGroup();

} else { alert("Veuillez sélectionner le calque où appliquer le wiggle"); }

fenetrewiggle.close();
}



//FONCTION WIGGLE
function wiggle(){
	fenetrewiggle.show();
	}
//FONCTION POUR AJOUTER UN BONE
function bone(){
	// Vérifions si il n'y a qu'un calque sélectionné
if (app.project.activeItem.selectedLayers.length == 1){

		//  début de groupe d'annulation
		app.beginUndoGroup("Bone");

//le calque sélectionné
var calque = app.project.activeItem.selectedLayers[0] ;
// les effets sélectionnés
var coins = app.project.activeItem.selectedLayers[0].selectedProperties ;

var okaytogo = false;

// vérifions si c'est la position ou le coin qui est sélectionné
if (coins.length == 4){
	
	var coinpos = coins.pop();
	var coin = coins.pop();
	if (coinpos instanceof Property && coinpos.value instanceof Array && coinpos.value.length ==2){okaytogo = true;}

}else{
	
		if (coins.length == 3){
			
		var coin = coins.pop();
		var coinpos = coin.position;
		if (coinpos instanceof Property && coinpos.value instanceof Array && coinpos.value.length ==2){okaytogo = true;}
		}

}
	

if (okaytogo){
//la position du coin
var position = coinpos.value;
//créer le bone
var bone = app.project.activeItem.layers.addSolid([1,0,0],"B_" + coin.name,20,20,1);
//mettre le bone à cette position
bone.position.setValue(position);
//nom du bone
bone.name = "B_" + coin.name;
//mettre l'expression dans le coin
coinpos.expression = "thisComp.layer(\"" + bone.name + "\").toWorld(thisComp.layer(\"" + bone.name + "\").anchorPoint)";

} else {alert("veuillez sélectionner le coin où créer un Bone","Attention");}
	
//fin du groupe d'annulation
app.endUndoGroup();


}else{alert("veuillez sélectionner le coin où créer un Bone","Attention");}
}

//FONCTION POUR AFFICHER DE L'AIDE
function help(){
alert("Si vous avez besoin d'aide, rendez-vous sur le site\n\n" + "http://ik.duduf.fr\n\n" + "Rubrique Aide et FAQ,\nou envoyez un message à duduf@duduf.com");
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
	//refaire les parents
	calqueroue.parent = parentroue;
	calquemesure.parent = parentmesure;

} else { alert("Il faut avoir sélectionné deux calques pour mesurer la distance entre deux calques !","Attention",true); }

	}

//FONCTION QUI RECUPERE LE RAYON ENTRE PAR L'UTILISATEUR
function rayon(){
	OA = rayonbouton.text;
	}

//FONCTION QUI CREE UNE ROUE
function roue() {

			//  début de groupe d'annulation
			app.beginUndoGroup("Roue");

			var isnumber = OA/OA;

			if (isnumber == 1) {
				
var calqueroue = app.project.activeItem.selectedLayers[0];
var rouestring =  "O = thisLayer.toWorld(thisLayer.anchorPoint);\n" + "R = " + OA + ";\n" + "value + radiansToDegrees(O[0]/R)";
calqueroue.transform.rotation.expression = rouestring;

			//  fin de groupe d'annulation
			app.endUndoGroup();

rayonfenetre.close();

				} else { alert ("Rayon Invalide","Veuillez indiquer le rayon de la roue",true); }
	}



//FONCTION TARGET CAM
function controlcam() {
	//vérifier qu'il n'y a qu'un calque sélectionné
if (app.project.activeItem.selectedLayers.length == 1){
	//vérifier que c'est une caméra
	if (app.project.activeItem.selectedLayers[0] instanceof CameraLayer) {

//début du groupe d'annulation
app.beginUndoGroup("Control Camera");


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
else { alert ("Veuillez sélectionner la caméra","Le calque sélectionné n'est pas une caméra",true); }
}

else { alert ("Veuillez sélectionner la caméra","Pas de caméra sélectionnée",true); }
	
	
	
	}

//===========================================
//UI
//===========================================


		//fenètre de la roue
		//on a besoin d'une variable globale...
		var OA = 0;
		var rayonfenetre = new Window ("palette", "Rayon ?", [300,300,450,355]);
		//champ de saisie
		var rayonbouton = rayonfenetre.add ("edittext", [5,5,95,25]);
		rayonbouton.onChange = rayon;
		rayonbouton.helpTip = "Le rayon de la roue, en pixels";
		//bouton mesurer
		var mesurebouton = rayonfenetre.add("button",[100,5,145,25],"Mesure");
		mesurebouton.value = false;
		mesurebouton.helpTip = "Mesurer avec un autre objet";
		mesurebouton.onClick = mesurer;
		//bouton OK
		var rayonok = rayonfenetre.add("button",[5,30,145,50],"OK");
		rayonok.onClick = roue;


		// la fenetre du wiggle
		var fenetrewiggle = new Window("palette","Wiggle");
		fenetrewiggle.bounds = [300,300,480,470];
		// position
		var positioncadre = fenetrewiggle.add("panel",[5,5,175,38],"Position");
		//separer ou toutes
		var positiontous = positioncadre.add("checkbox",[0,0,75,25],"Tous les axes");
		positiontous.value = true;
		positiontous.onClick = wiggleconfpos;
		//x y z
		var positionX = positioncadre.add("checkbox",[80,0,105,25],"X");
		var positionY = positioncadre.add("checkbox",[110,0,135,25],"Y");
		var positionZ = positioncadre.add("checkbox",[140,0,165,25],"Z");
		positionX.enabled = false;
		positionY.enabled = false;
		positionZ.enabled = false;
		// échelle
		var echellecadre = fenetrewiggle.add("panel",[5,43,175,76],"Echelle");
		var echelletous = echellecadre.add("checkbox",[5,0,80,25],"Tous les axes");
		echelletous.onClick = wiggleconfscale;
		//x y
		var echelleX = echellecadre.add("checkbox",[110,0,135,25],"X");
		var echelleY = echellecadre.add("checkbox",[140,0,165,25],"Y");	
		// rotation
		var rotationcadre = fenetrewiggle.add("panel",[5,81,175,114],"Rotation");
		//separer ou toutes
		var rotationtous = rotationcadre.add("checkbox",[0,0,75,25],"Tous les axes");
		rotationtous.value = false;
		rotationtous.onClick = wiggleconfrot;
		//x y z
		var rotationX = rotationcadre.add("checkbox",[80,0,105,25],"X");
		var rotationY = rotationcadre.add("checkbox",[110,0,135,25],"Y");
		var rotationZ = rotationcadre.add("checkbox",[140,0,165,25],"Z");
		// opacité
		var opacitebouton = fenetrewiggle.add("checkbox",[10,119,125,135],"Opacité");
		//ok
		var wiggleok = fenetrewiggle.add("button",[5,140,50,165],"OK");
		wiggleok.onClick = wigglevalid;


		// la fenetre d'options d'IK sur deux + un bones
		//
		var pretwoplusbones = new Window("palette","Options");
		pretwoplusbones.bounds = [300,300,510,380];
		//un joli cadre
		var goalpanel = pretwoplusbones.add("panel",[5,5,200,50],"IK Goal");
		//les boutons pour choisir
		var boutongoal = goalpanel.add("radiobutton",[5,5,95,45],"Goal");
		var boutonpasgoal = goalpanel.add("radiobutton",[100,5,195,45],"Suivre");
		boutongoal.value = true;
		//bouton ok
		var boutonokplus = pretwoplusbones.add("button",[150,55,200,75],"OK");
		boutonokplus.onClick = twoplusbones;

		// la palette IK_Tools
		//
		var palette = (thisObj instanceof Panel) ? thisObj : new Window("palette","IK_Tools");
		palette.bounds = [300,300,600,600];
		palette.add ("statictext", [5,   5,105, 25],  "DuDuF IK Tools v5");
		var boutonhelp = palette.add ("button",[110,5,125,20],"?");
		boutonhelp.onClick = help;
		
		var panocre = palette.add("panel",[5,30,125,165],"Expressions");
		//bouton pour créer l'IK
		var boutonik = panocre.add("button",[5,10,115,30], "Créer un IK");
		boutonik.onClick = ik;
		//bouton pour choisir le nombre de bones
		panocre.add ("statictext",[25,35,55,50],"Bones :");
		var boutonbones = panocre.add("dropdownlist",[60,30,115,50],["1","2","2+1"]);
		boutonbones.selection = 0;
		boutonbones.helpTip = "1 = Un bone et un contrôleur\n" + "2 = Deux bones (bras+avant bras) et un contrôleur à l'extrémité (main)\n" + "2 + 1 = Deux bones et une extrémité (bras + avant bras + main) et un contrôleur à l'extrémité";	
		//bouton pour créer un goal
		var boutongoal = panocre.add("button",[5,55,115,75],"IK Goal");
		boutongoal.onClick = pregoal;
		boutongoal.helpTip = "Le calque sélectionné gardera son orientation, malgré les transformations de son parent";
		//bouton wiggle
		var boutonwiggle = panocre.add("button",[5,80,115,100],"Wiggle");
		boutonwiggle.onClick = wiggle;
		boutonwiggle.helpTip = "Place une expression \"wiggle\" (tremblement) dans une propriété du calque sélectionné";
		//bouton roue
		var boutonroue = panocre.add("button",[5,105,115,125],"Roue");
		boutonroue.onClick = creroue;
		boutonroue.helpTip = "Automatise la rotation d'une roue lors du déplacement du calque";
		
		var panoobj = palette.add("panel",[5,170,125,235],"Objets");
		//bouton pour ajouter un controleur
		var boutoncontroleur = panoobj.add("button",[5,10,115,30],"Controleur");
		boutoncontroleur.onClick = controleur;
		boutoncontroleur.helpTip = "Ajoute un objet null au pivot du calque sélectionné";
		//bouton pour créer des bones
		var boutonbone = panoobj.add("button",[5,35,115,55],"Bone");
		boutonbone.onClick = bone;
		boutonbone.helpTip = "Crée un bone sur un coin de marionnette";
		
		var panocam = palette.add("panel",[5,240,125,280],"Cameras");
		//bouton pour créer une target cam
		var boutontcam = panocam.add("button",[5,10,115,30],"Control Camera");
		boutontcam.onClick = controlcam;
		boutontcam.helpTip = "Crée des contrôleurs pour une caméra";
	}

IKtools(this);