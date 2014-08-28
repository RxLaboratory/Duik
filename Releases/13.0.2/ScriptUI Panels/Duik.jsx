/*
	

Duik
Copyright (c) 2008 - 2012 Nicolas Dufresne
http://ik.duduf.fr
http://ik.duduf.com



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
	
	//================
	var version = "13.0.2";
	//================


if (! app.settings.haveSetting("duik", "lang")){app.settings.saveSetting("duik","lang",app.language);}
if (! app.settings.haveSetting("duik", "version")){app.settings.saveSetting("duik","version","oui");}
if (! app.settings.haveSetting("duik", "morpherKey")){app.settings.saveSetting("duik","morpherKey","oui");}
if (! app.settings.haveSetting("duik", "notes")){app.settings.saveSetting("duik","notes","");}
if (! app.settings.haveSetting("duik", "pano")){app.settings.saveSetting("duik","pano","0");}


function traduction(Tableau) {
	if (app.settings.getSetting("duik", "lang") == Language.FRENCH) return Tableau[1];
	else if (app.settings.getSetting("duik", "lang") == Language.ENGLISH) return Tableau[0];
	else if (app.settings.getSetting("duik", "lang") == Language.SPANISH) return Tableau[2];
	else return Tableau[0];
	}

function IKtools(thisObj){

//===============================================
//LES FONCTIONS
//===============================================


//FONCTION POUR CHERCHER UNE MISE A JOUR
function MAJ(version){
var reply = "";
//socket
conn = new Socket;
// se connecter à duduf.com
if (conn.open ("www.duduf.com:80")) {
// récupérer la version actuelle
if(conn.writeln ("GET /ressources/duik/version.txt  HTTP/1.0\nHost: duduf.com\n"))
reply = conn.read(1000);
conn.close();
//chercher la version dans la réponse du serveur :
var reponse = reply.lastIndexOf("version",reply.length);
if(reponse != -1){
newVersion = reply.slice(reponse+8,reply.length+1);
if (version == newVersion) {return true} else {alert(traduction(["A new version of Duik ( "+ newVersion +" ) is available,\ngo to http://ik.duduf.com to download it","Une nouvelle version de Duik ( "+ newVersion +" ) est disponible,\nrendez-vous sur http://ik.duduf.net pour la télécharger","A new version of Duik ( "+ newVersion +" ) is available,\ngo to http://ik.duduf.com to download it"]));}
}else {alert(traduction(["Cannot check for updates of Duik,\nImpossible to get version number,\nPlease try again later.","Vérification impossible des mises à jour de Duik,\nImpossible de récupérer le numéro de version,\nVeuillez réessayer plus tard.","Cannot check for updates of Duik,\nImpossible to get version number,\nPlease try again later."]),"Attention",true);}
} else {alert(traduction(["Cannot check for updates of Duik,\nImpossible to connect www.duduf.com","Vérification impossible des mises à jour de Duik,\nConnexion impossible à www.duduf.com","Cannot check for updates of Duik,\nImpossible to connect www.duduf.com"]),"Attention",true);}
}


//FONCTION QUAND ON CLIQUE SUR CREER
function ik(){
	if (verifNoms()) {
		var calques = app.project.activeItem.selectedLayers;
	if (calques.length == 2 || calques.length == 3 || calques.length == 4) {
		var calquetridi = false;
		var ncalquetridi = 0;
	for (i=0;i<calques.length;i++){
		if (calques[i].threeDLayer) {ncalquetridi = i+1;}
		}
	if (ncalquetridi == 0 || ncalquetridi == calques.length) {
	if (ncalquetridi == calques.length) calquetridi = true;
	if (calques.length == 2) { calquetridi ? alert(traduction(["IK on one bone (LookAt) is not available on 3D Layers (yet)","Les IK sur un seul bone (LookAt) ne sont pas (encore) possible sur les calques 3D","IK on one bone (LookAt) is not available on 3D Layers (yet)"])) : onebone();}
	if (calques.length == 3) {twobones(calquetridi,boutonFront.value);}
	if (calques.length == 4) {twoplusbones(calquetridi,boutonFront.value);}
	} else {alert(traduction(["Make sure ALL the layers are 3D Layers or 2D layers, not both","Vérifiez que TOUS les calques soient 2D ou 3D, pas les deux","Make sure ALL the layers are 3D Layers or 2D layers, not both"]));}
	} else{alert(traduction(["Select the bones and the controller before creating IK","Veuillez sélectionner les bones et le contrôleur avant de créer un IK","Selecciona los 'bones' y el controlador antes de crear un 'IK'"]));}
	} else{alert(traduction(["Make sure there are no layers that share the same name!","Vérifiez qu'il n'y a pas deux calques portant le même nom !","Make sure there are no layers that share the same name!"]));}
	}

//FONCTION QUI APPLIQUE UN IK SUR UN SEUL BONE (LOOKAT)
function onebone(){

	//récupérer le bone
	var bonename = app.project.activeItem.selectedLayers[0].name;
	var bone = app.project.activeItem.selectedLayers[0];
	var origine = bone.transform.rotation.value;
	//récupérer le controleur
	var controleurname = app.project.activeItem.selectedLayers[1].name;
	var controleur = app.project.activeItem.selectedLayers[1];

				//  début de groupe d'annulation
				app.beginUndoGroup("LookAt " + bonename);

	//=========================================================
	//EXPRESSION A INSERER
	var expression = "C = thisComp.layer(\"" + controleurname + "\").toWorld(thisComp.layer(\"" + controleurname + "\").anchorPoint);\r\n" +
	"O =  thisLayer.toWorld(thisLayer.anchorPoint);\r\n" +
	"angle = lookAt(C,O);\r\n" +
	"angle[0] > 0 ? angle[0]+angle[1]+value : angle[0]-angle[1]+value;"
	//=========================================================

	bone.transform.rotation.expression = expression;

	//modifier la valeur pour éviter l'offset
	nouvelle = bone.transform.rotation.value;
	bone.transform.rotation.setValue(origine - nouvelle);
	
			//fin du groupe d'annulation			
			app.endUndoGroup();

}


//FONCTION QUI APPLIQUE UN IK SUR DEUX BONES
function twobones(tridi,front){

//récupérer le bone du bout
var boneboutname = app.project.activeItem.selectedLayers[0].name;
var bonebout = app.project.activeItem.selectedLayers[0];
//récupérer le bone racine
var boneracinename = app.project.activeItem.selectedLayers[1].name;
var boneracine = app.project.activeItem.selectedLayers[1];
//récupérer le controleur
var controleurname = app.project.activeItem.selectedLayers[2].name;
var controleur = app.project.activeItem.selectedLayers[2];

//vérifions que les parentées sont bonnes
	if (bonebout.parent == boneracine) {

//  début de groupe d'annulation
			app.beginUndoGroup("IK " + controleurname);
			
//Ajoutons une case a cocher sur le controleur pour choisir le sens de l'IK
coude = controleur.Effects.addProperty("ADBE Checkbox Control");
coude.name = "IK Orientation" + boneracinename.slice(-15);
if (tridi) {
	direction = controleur.Effects.addProperty("ADBE Angle Control");
	direction.name = "IK Direction " +  boneracinename.slice(-15);
	}
		
//créer un zéro
var zerobout = app.project.activeItem.layers.addNull();
zerobout.threeDLayer = true;
var controleurparent = controleur.parent;
controleur.parent = null;
zerobout.position.setValue(controleur.position.value);
zerobout.name = "IK_zero " + boneboutname.slice(-24);
controleur.parent = controleurparent;

//lier le zéro au bone du bout
zerobout.parent = bonebout;

//verrouiller et masquer le zéro
zerobout.moveToEnd();
zerobout.guideLayer = true;
zerobout.locked = true;
zerobout.enabled = false;
zerobout.shy = true;


//=========================================================
//EXPRESSION A INSERER SUR LE BONE BOUT
var expressionbout = "boneracine = \"" + boneracinename + "\";\n" + 
"bonebout = \"" + boneboutname + "\";\n" + 
"zero = \"" + "IK_zero " + boneboutname.slice(-24) + "\";\n" + 
"controleur = \"" + controleurname + "\";\n" + 
"if (thisComp.layer(controleur).effect(\"" + "IK Orientation" + boneracinename.slice(-15) + "\")(1) == 1) {cw = true}else{cw=false}\n" +
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

tridi ? bonebout.transform.zRotation.expression = expressionbout : bonebout.transform.rotation.expression = expressionbout;

//=========================================================
//EXPRESSION A INSERER SUR LE BONE RACINE
var expressionracine = "boneracine = \"" + boneracinename + "\";\n" + 
"bonebout = \"" + boneboutname + "\";\n" + 
"zero = \"" + "IK_zero " + boneboutname.slice(-24) + "\";\n" + 
"controleur = \"" + controleurname + "\";\n" + 
"if (thisComp.layer(controleur).effect(\"" + "IK Orientation" + boneracinename.slice(-15) + "\")(1) == 1) {cw = true}else{cw=false}\n" +
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

tridi ? boneracine.transform.zRotation.expression = expressionracine : boneracine.transform.rotation.expression = expressionracine;

if (tridi) {
	//si 3D : le zéro de la jambe pour l'orientation
	//créer un zéro
	var zero = app.project.activeItem.layers.addNull();
	zero.threeDLayer = true;
	var calqueparent = boneracine.parent;
	boneracine.parent = null;
	zero.position.setValue(boneracine.position.value);
	zero.name = "Zero_" + boneracine.name.slice(-24);
	//verrouiller et masquer le zéro
	zero.moveToEnd();
	zero.guideLayer = true;
	zero.shy = true;


	if (front) {
		var expressionzero = "controleur =thisComp.layer(\"" + controleurname + "\");\n\n" + 
		"C = controleur.toWorld(controleur.anchorPoint);\n" +
		"Cx = C[0];\n" +
		"Cy = C[1];\n" +
		"Cz = C[2];\n" +
		"L =  thisLayer.toWorld(thisLayer.anchorPoint);\n" +
		"Lx = L[0];\n" +
		"Ly = L[1];\n" +
		"Lz = L[2];" +
		"angle = lookAt([Cz,Cy,Cx],[Lz,Ly,Lx]);\n" +
		"[-angle[1]+90,-angle[0],value[2]]\n"
		} else {
		var expressionzero = "controleur =thisComp.layer(\"" + controleurname + "\");\n\n" + 
		"C = controleur.toWorld(controleur.anchorPoint);\n" +
		"L =  thisLayer.toWorld(thisLayer.anchorPoint);\n" +
		"angle = lookAt(C,L);\n" +
		"[angle[0],angle[1],value[2]]\n"
		}
		zero.transform.orientation.expression = expressionzero;
		zero.transform.xRotation.expression = "thisComp.layer(\"" + controleurname + "\").effect(\"IK Direction " +  boneracinename.slice(-15) + "\")(1)";

		boneracine.parent = zero;
		//lier le zéro au bone du bout
		zero.parent = calqueparent;
		zero.enabled = false;
		zero.locked = true;


}


			//fin du groupe d'annulation
			
			app.endUndoGroup();
			
			
} else { alert(traduction(["First, select the bone of the end, second, the root, then the controller, in this exact order","Il faut bien sélectionner d'abord le bone du bout, puis celui de la racine, puis le contrôleur, dans cet ordre précis","Primero, selecciona el 'bone' final, después la 'raiz', y finalmente el controlador, en este orden exacto"]),"Attention",true); }

	}



//FONCTION QUI APPLIQUE UN IK SUR DEUX + UN BONES
function twoplusbones(tridi,front){

//récupérer la main
var mainname = app.project.activeItem.selectedLayers[0].name;
var main = app.project.activeItem.selectedLayers[0];
//récupérer le bone du bout
var boneboutname = app.project.activeItem.selectedLayers[1].name;
var bonebout = app.project.activeItem.selectedLayers[1];
//récupérer le bone racine
var boneracinename = app.project.activeItem.selectedLayers[2].name;
var boneracine = app.project.activeItem.selectedLayers[2];
//récupérer le controleur
var controleurname = app.project.activeItem.selectedLayers[3].name;
var controleur = app.project.activeItem.selectedLayers[3];

//vérifions que les parentées sont bonnes
	if (bonebout.parent == boneracine) { 
		if (main.parent == bonebout) {
			
			//  début de groupe d'annulation
			app.beginUndoGroup("IK " + controleurname);
			
			//une case a cocher pour choisir le sens de l'IK sur le controleur
			coude = controleur.Effects.addProperty("ADBE Checkbox Control");
			coude.name = "IK Orientation " + mainname.slice(-15);
			//un paramètre angle pour la direction en cas de 3D
			if (tridi) {
			direction = controleur.Effects.addProperty("ADBE Angle Control");
			direction.name = "IK Direction " + mainname.slice(-15);
			}
			
//=========================================================
//EXPRESSION A INSERER SUR LE BONE BOUT
var expressionBout = "boneracine = \"" + boneracinename + "\";\n" +
"bonebout = \"" + boneboutname + "\";\n" +
"zero = \"" + mainname + "\";\n"+
"controleur = \"" + controleurname + "\";\n"+
"if (thisComp.layer(controleur).effect(\"" + "IK Orientation " + mainname.slice(-15) + "\")(1) == 1) {cw = true}else{cw=false}\n"+
"function getWorldPos(theLayerName){\n"+
"  L = thisComp.layer(theLayerName);\n"+
"  return L.toWorld(L.anchorPoint);\n" + "}\n"+
"function oriente(a, b, P) {\n"+
"return ((b[0]-a[0])*(P[1]-a[1]) - (P[0]-a[0])*(b[1]-a[1]) );\n"+
"}\n" +"A = getWorldPos(boneracine);\n"+
"B = getWorldPos(bonebout);\n"+
"C = getWorldPos(zero);\n" +
"E = getWorldPos(controleur);\n"+
"a = length(B,C);\n"+
"b = length(E,A);\n" + "c = length(A,B);\n"+
"x = (b*b + c*c - a*a )/(2*b);\n"+
"alpha = Math.acos(clamp(x/c,-1,1));\n"+
"y = b - x;\n"+
"  gamma = Math.acos(clamp(y/a,-1,1));\n"+
"result = (cw ? 1 : -1)*radiansToDegrees(gamma + alpha);"+
"  V1 = B - A;\n" +
"  adj1 = radiansToDegrees(Math.atan2(V1[1],V1[0]));\n"+
"  V2 = C - B;\n"+
"  adj2 = radiansToDegrees(Math.atan2(V2[1],V2[0]));\n" +
"  result +  adj1 - adj2 + value;"
//=========================================================

tridi ? bonebout.transform.zRotation.expression = expressionBout : bonebout.transform.rotation.expression = expressionBout;

//=========================================================
//EXPRESSION A INSERER SUR LE BONE RACINE
var expressionracine = "boneracine = \"" + boneracinename + "\";\n" + 
"bonebout = \"" + boneboutname + "\";\n" + 
"zero = \"" + mainname + "\";\n" + 
"controleur = \"" + controleurname + "\";\n" + 
"if (thisComp.layer(controleur).effect(\"" + "IK Orientation " + mainname.slice(-15) + "\")(1) == 1) {cw = true}else{cw=false}\n" +
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

tridi ? boneracine.transform.zRotation.expression = expressionracine : boneracine.transform.rotation.expression = expressionracine;

if (tridi) {
	main.transform.xRotation.expression = "value + thisComp.layer(\"" + controleurname + "\").transform.xRotation";
	front ? main.transform.yRotation.expression = "value + thisComp.layer(\"" + controleurname + "\").transform.yRotation" : main.transform.yRotation.expression = "value + thisComp.layer(\"" + controleurname + "\").transform.yRotation + 90" ;
	main.transform.zRotation.expression = "value + thisComp.layer(\"" + controleurname + "\").transform.zRotation";
	main.transform.orientation.expression = "value + thisComp.layer(\"" + controleurname + "\").transform.orientation";
	} else {
	main.transform.rotation.expression = "value + thisComp.layer(\"" + controleurname + "\").transform.rotation";
	}

if (tridi) {
	//si 3D : le zéro de la jambe pour l'orientation
	//créer un zéro
	var zero = app.project.activeItem.layers.addNull();
	zero.threeDLayer = true;
	var calqueparent = boneracine.parent;
	boneracine.parent = null;
	zero.position.setValue(boneracine.position.value);
	zero.name = "Zero_" + boneracine.name.slice(-24);
	//verrouiller et masquer le zéro
	zero.moveToEnd();
	zero.guideLayer = true;
	zero.shy = true;

	if (front) {
		var expressionzero = "controleur =thisComp.layer(\"" + controleurname + "\");\n\n" + 
		"C = controleur.toWorld(controleur.anchorPoint);\n" +
		"Cx = C[0];\n" +
		"Cy = C[1];\n" +
		"Cz = C[2];\n" +
		"L =  thisLayer.toWorld(thisLayer.anchorPoint);\n" +
		"Lx = L[0];\n" +
		"Ly = L[1];\n" +
		"Lz = L[2];" +
		"angle = lookAt([Cz,Cy,Cx],[Lz,Ly,Lx]);\n" +
		"[-angle[1]+90,-angle[0],value[2]]\n"
		} else {
		var expressionzero = "controleur =thisComp.layer(\"" + controleurname + "\");\n\n" + 
		"C = controleur.toWorld(controleur.anchorPoint);\n" +
		"L =  thisLayer.toWorld(thisLayer.anchorPoint);\n" +
		"angle = lookAt(C,L);\n" +
		"[angle[0],angle[1],value[2]]\n"
		}
		zero.transform.orientation.expression = expressionzero;
		zero.transform.xRotation.expression = "thisComp.layer(\"" + controleurname + "\").effect(\"IK Direction " + mainname.slice(-15) + "\")(1)";

		boneracine.parent = zero;
		//lier le zéro au bone du bout
		zero.parent = calqueparent;
		zero.enabled = false;
		zero.locked = true;

}

	//IK Goal
	//dupliquer le Layer
	var goal = main.duplicate();
	goal.name = main.name + " goal";
	goal.parent = null;
	goal.transform.position.expression = "thisComp.layer(\"" + mainname + "\").toWorld(thisComp.layer(\"" + mainname + "\").anchorPoint)";
	main.enabled = false;
	
	
			//fin du groupe d'annulation
			app.endUndoGroup();

			
} else { alert(traduction(["First, select the bone of the end, second, the root, then the controller, in this exact order","Il faut bien sélectionner d'abord le bone du bout, puis celui de la racine, puis le contrôleur, dans cet ordre précis","Primero, selecciona el 'bone' final, después la 'raiz', y finalmente el controlador, en este orden exacto"]),"Attention",true); }
} else { alert(traduction(["First, select the bone of the end, second, the root, then the controller, in this exact order","Il faut bien sélectionner d'abord le bone du bout, puis celui de la racine, puis le contrôleur, dans cet ordre précis","Primero, selecciona el 'bone' final, después la 'raiz', y finalmente el controlador, en este orden exacto"]),"Attention",true); }

	}



//FONCTION QUI GOAL LE CALQUE ACTIF
function pregoal(){

if (app.project.activeItem.selectedLayers.length == 1) {	

	//  début de groupe d'annulation
app.beginUndoGroup("IK Goal " + app.project.activeItem.selectedLayers[0].name);

//dupliquer le Layer
var layer = app.project.activeItem.selectedLayers[0]
var goal = layer.duplicate();
goal.name = layer.name + " goal";
goal.parent = null;
goal.transform.position.expression = "thisComp.layer(\"" + layer.name + "\").toWorld(thisComp.layer(\"" + layer.name + "\").anchorPoint)";
layer.enabled = false;

//fin du groupe d'annulation
app.endUndoGroup();

}else{alert(traduction(["Select the layer before applying IK Goal","Il faut d'abord sélectionner le calque","Selecciona una capa antes de aplicar 'IK Goal'"]),"Attention",true);}
}


//FONCTION POUR CREER UN CONTROLEUR
function controleur(){
	
	if (verifNoms()) {
 
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
	 
	 } else {alert(traduction(["Select a layer before creating a controller","Vous devez d'abord sélectionner le calque où placer le contrôleur","Selecciona una capa antes de crear un controlador"]));}
	 	} else{alert(traduction(["Make sure there are no layers that share the same name!","Vérifiez qu'il n'y a pas deux calques portant le même nom !","Make sure there are no layers that share the same name!"]));}

	 
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
	freq.name = "Pos Frequency";
	calque.transform.position.expression = "wiggle(effect(\"Pos Frequency\")(1),effect(\"Pos Amplitude\")(1))";
	} else {
		if (calquetridi && positionX.value && positionY.value && positionZ.value){
				amp = calque.Effects.addProperty("ADBE Slider Control");
				amp.name = "XPos Amplitude";
				amp = calque.Effects.addProperty("ADBE Slider Control");
				amp.name = "YPos Amplitude";
				amp = calque.Effects.addProperty("ADBE Slider Control");
				amp.name = "ZPos Amplitude";
				freq = calque.Effects.addProperty("ADBE Slider Control");
				freq.name = "XPos Frequency";
				freq = calque.Effects.addProperty("ADBE Slider Control");
				freq.name = "YPos Frequency";
				freq = calque.Effects.addProperty("ADBE Slider Control");
				freq.name = "ZPos Frequency";
				calque.transform.position.expression = "X=wiggle(effect(\"XPos Frequency\")(1),effect(\"XPos Amplitude\")(1));\n" + "Y=wiggle(effect(\"YPos Frequency\")(1),effect(\"YPos Amplitude\")(1));\n" + "Z=wiggle(effect(\"ZPos Frequency\")(1),effect(\"ZPos sAmplitude\")(1));\n" +  "[X[0],Y[1],Z[2]]";
			}
		if (positionX.value && positionY.value && !positionZ.value){
				amp = calque.Effects.addProperty("ADBE Slider Control");
				amp.name = "XPos Amplitude";
				amp = calque.Effects.addProperty("ADBE Slider Control");
				amp.name = "YPos Amplitude";
				freq = calque.Effects.addProperty("ADBE Slider Control");
				freq.name = "XPos Frequency";
				freq = calque.Effects.addProperty("ADBE Slider Control");
				freq.name = "YPos Frequency";
				if (calquetridi){calque.transform.position.expression = "X=wiggle(effect(\"XPos Frequency\")(1),effect(\"XPos Amplitude\")(1));\n" + "Y=wiggle(effect(\"YPos Frequency\")(1),effect(\"YPos Amplitude\")(1));\n" + "[X[0],Y[1],transform.position[2]]";}
				else {calque.transform.position.expression = "X=wiggle(effect(\"XPos Frequency\")(1),effect(\"XPos Amplitude\")(1));\n" + "Y=wiggle(effect(\"YPos Frequency\")(1),effect(\"YPos Amplitude\")(1));\n" + "[X[0],Y[1]]";}
			}
		if (calquetridi && positionX.value && !positionY.value && positionZ.value){
				amp = calque.Effects.addProperty("ADBE Slider Control");
				amp.name = "XPos Amplitude";
				amp = calque.Effects.addProperty("ADBE Slider Control");
				amp.name = "ZPos Amplitude";
				freq = calque.Effects.addProperty("ADBE Slider Control");
				freq.name = "XPos Frequency";
				freq = calque.Effects.addProperty("ADBE Slider Control");
				freq.name = "ZPos Frequency";
				calque.transform.position.expression = "X=wiggle(effect(\"XPos Frequency\")(1),effect(\"XPos Amplitude\")(1));\n" + "Z=wiggle(effect(\"ZPos Frequency\")(1),effect(\"ZPos Amplitude\")(1));\n" + "[X[0],transform.position[1],Z[2]]";
			}
		if (calquetridi && !positionX.value && positionY.value && positionZ.value) {
			amp = calque.Effects.addProperty("ADBE Slider Control");
				amp.name = "YPos Amplitude";
				amp = calque.Effects.addProperty("ADBE Slider Control");
				amp.name = "ZPos Amplitude";
				freq = calque.Effects.addProperty("ADBE Slider Control");
				freq.name = "YPos Frequency";
				freq = calque.Effects.addProperty("ADBE Slider Control");
				freq.name = "ZPos Frequency";
				calque.transform.position.expression = "Y=wiggle(effect(\"YPos Frequency\")(1),effect(\"YPos Amplitude\")(1));\n" + "Z=wiggle(effect(\"ZPos Frequency\")(1),effect(\"ZPos Amplitude\")(1));\n" + "[transform.position[0],Y[1],Z[2]]";
			}
		if (positionX.value && !positionY.value && !positionZ.value){
				amp = calque.Effects.addProperty("ADBE Slider Control");
				amp.name = "XPos Amplitude";
				freq = calque.Effects.addProperty("ADBE Slider Control");
				freq.name = "XPos Frequency";
				if (calquetridi){calque.transform.position.expression = "X=wiggle(effect(\"XPos Frequency\")(1),effect(\"XPos Amplitude\")(1));\n" + "[X[0],transform.position[1],transform.position[2]]";}
				else {calque.transform.position.expression = "X=wiggle(effect(\"XPos Frequency\")(1),effect(\"XPos Amplitude\")(1));\n" + "[X[0],transform.position[1]]";}
				}
		if (!positionX.value && positionY.value && !positionZ.value){
				amp = calque.Effects.addProperty("ADBE Slider Control");
				amp.name = "YPos Amplitude";
				freq = calque.Effects.addProperty("ADBE Slider Control");
				freq.name = "YPos Frequency";
				if (calquetridi){calque.transform.position.expression = "Y=wiggle(effect(\"YPos Frequency\")(1),effect(\"YPos Amplitude\")(1));\n" + "[transform.position[0],Y[1],transform.position[2]]";}
				else{calque.transform.position.expression = "Y=wiggle(effect(\"YPos Frequency\")(1),effect(\"YPos Amplitude\")(1));\n" + "[transform.position[0],Y[1]]";}
			}
		if (calquetridi && !positionX.value && !positionY.value && positionZ.value){
				amp = calque.Effects.addProperty("ADBE Slider Control");
				amp.name = "ZPos Amplitude";
				freq = calque.Effects.addProperty("ADBE Slider Control");
				freq.name = "ZPos Frequency";
				calque.transform.position.expression = "Z=wiggle(effect(\"ZPos Frequency\")(1),effect(\"ZPos Amplitude\")(1));\n" + "[transform.position[0],transform.position[1],Z[2]]";
			}
		if (!calquetridi && positionZ.value) {alert("Le calque sélectionné n'est pas un calque 3D, impossible d'y ajouter un wiggle sur l'axe Z","Attention !");}
	}

if (echelletous.value){
	amp = calque.Effects.addProperty("ADBE Slider Control");
	amp.name = "Scale Amplitude";
	freq = calque.Effects.addProperty("ADBE Slider Control");
	freq.name = "Scale Frequency";
	calque.transform.scale.expression = "wiggle(effect(\"Scale Frequency\")(1),effect(\"Scale Amplitude\")(1))";
	}else{
		if (echelleX.value){
			amp = calque.Effects.addProperty("ADBE Slider Control");
			amp.name = "Scale X Amplitude";
			freq = calque.Effects.addProperty("ADBE Slider Control");
			freq.name = "Scale X Frequency";
			calque.transform.scale.expression = "X=wiggle(effect(\"Scale X Frequency\")(1),effect(\"Scale X Amplitude\")(1));\n" + "[X[0],transform.scale[1]]";
			}
		if (echelleY.value){
			amp = calque.Effects.addProperty("ADBE Slider Control");
			amp.name = "Scale Y Amplitude";
			freq = calque.Effects.addProperty("ADBE Slider Control");
			freq.name = "Scale Y Frequency";
			calque.transform.scale.expression = "Y=wiggle(effect(\"Scale Y Frequency\")(1),effect(\"Scale Y Amplitude\")(1));\n" + "[transform.scale[0],Y[1]]";
			}
	}

if (rotationtous.value){
	amp = calque.Effects.addProperty("ADBE Slider Control");
	amp.name = "Rot Amplitude";
	freq = calque.Effects.addProperty("ADBE Slider Control");
	freq.name = "Rot Frequency";
	if(calquetridi){calque.transform.orientation.expression = "wiggle(effect(\"Rot Frequency\")(1),effect(\"Rot Amplitude\")(1))";}
	else{calque.transform.rotation.expression = "wiggle(effect(\"Rot Frequency\")(1),effect(\"Rot Amplitude\")(1))";}
	} else {
		if (rotationX.value && rotationY.value && rotationZ.value){
				calque.threeDLayer = true;
				amp = calque.Effects.addProperty("ADBE Slider Control");
				amp.name = "XRot Amplitude";
				amp = calque.Effects.addProperty("ADBE Slider Control");
				amp.name = "YRot Amplitude";
				amp = calque.Effects.addProperty("ADBE Slider Control");
				amp.name = "ZRot Amplitude";
				freq = calque.Effects.addProperty("ADBE Slider Control");
				freq.name = "XRot Frequency";
				freq = calque.Effects.addProperty("ADBE Slider Control");
				freq.name = "YRot Frequency";
				freq = calque.Effects.addProperty("ADBE Slider Control");
				freq.name = "ZRot Frequency";
				calque.transform.orientation.expression = "X=wiggle(effect(\"XRot Frequency\")(1),effect(\"XRot Amplitude\")(1));\n" + "Y=wiggle(effect(\"YRot Frequency\")(1),effect(\"YRot Amplitude\")(1));\n" + "Z=wiggle(effect(\"ZRot Frequency\")(1),effect(\"ZRot Amplitude\")(1));\n" +  "[Y[0],X[1],Z[2]]";
			}
		if (rotationX.value && rotationY.value && !rotationZ.value){
				calque.threeDLayer = true;
				amp = calque.Effects.addProperty("ADBE Slider Control");
				amp.name = "XRot Amplitude";
				amp = calque.Effects.addProperty("ADBE Slider Control");
				amp.name = "YRot Amplitude";
				freq = calque.Effects.addProperty("ADBE Slider Control");
				freq.name = "XRot Frequency";
				freq = calque.Effects.addProperty("ADBE Slider Control");
				freq.name = "YRot Frequency";
				calque.transform.orientation.expression = "X=wiggle(effect(\"XRot Frequency\")(1),effect(\"XRot Amplitude\")(1));\n" + "Y=wiggle(effect(\"YRot Frequency\")(1),effect(\"YRot Amplitude\")(1));\n" + "[Y[0],X[1],transform.orientation[2]]";
			}
		if (rotationX.value && !rotationY.value && rotationZ.value){
				calque.threeDLayer = true;
				amp = calque.Effects.addProperty("ADBE Slider Control");
				amp.name = "XRot Amplitude";
				amp = calque.Effects.addProperty("ADBE Slider Control");
				amp.name = "ZRot Amplitude";
				freq = calque.Effects.addProperty("ADBE Slider Control");
				freq.name = "XRot Frequency";
				freq = calque.Effects.addProperty("ADBE Slider Control");
				freq.name = "ZRot Frequency";
				calque.transform.orientation.expression = "X=wiggle(effect(\"XRot Frequency\")(1),effect(\"XRot Amplitude\")(1));\n" + "Z=wiggle(effect(\"ZRot Frequency\")(1),effect(\"ZRot Amplitude\")(1));\n" + "[transform.orientation[0],X[1],Z[2]]";
			}
		if (!rotationX.value && rotationY.value && rotationZ.value) {
			calque.threeDLayer = true;
			amp = calque.Effects.addProperty("ADBE Slider Control");
				amp.name = "YRot Amplitude";
				amp = calque.Effects.addProperty("ADBE Slider Control");
				amp.name = "ZRot Amplitude";
				freq = calque.Effects.addProperty("ADBE Slider Control");
				freq.name = "YRot Frequency";
				freq = calque.Effects.addProperty("ADBE Slider Control");
				freq.name = "ZRot Frequency";
				calque.transform.orientation.expression = "Y=wiggle(effect(\"YRot Frequency\")(1),effect(\"YRot Amplitude\")(1));\n" + "Z=wiggle(effect(\"ZRot Frequency\")(1),effect(\"ZRot Amplitude\")(1));\n" + "[Y[0],transform.orientation[1],Z[2]]";
			}
		if (rotationX.value && !rotationY.value && !rotationZ.value){
			calque.threeDLayer = true;
				amp = calque.Effects.addProperty("ADBE Slider Control");
				amp.name = "XRot Amplitude";
				freq = calque.Effects.addProperty("ADBE Slider Control");
				freq.name = "XRot Frequency";
				calque.transform.orientation.expression = "X=wiggle(effect(\"XRot Frequency\")(1),effect(\"XRot Amplitude\")(1));\n" + "[transform.orientation[0],X[1],transform.orientation[2]]";
				}
		if (!rotationX.value && rotationY.value && !rotationZ.value){
			calque.threeDLayer = true;
				amp = calque.Effects.addProperty("ADBE Slider Control");
				amp.name = "YRot Amplitude";
				freq = calque.Effects.addProperty("ADBE Slider Control");
				freq.name = "YRot Frequency";
				calque.transform.orientation.expression = "Y=wiggle(effect(\"YRot Frequency\")(1),effect(\"YRot Amplitude\")(1));\n" + "[Y[0],transform.orientation[1],transform.orientation[2]]";
			}
		if (!rotationX.value && !rotationY.value && rotationZ.value){
			calque.threeDLayer = true;
				amp = calque.Effects.addProperty("ADBE Slider Control");
				amp.name = "ZRot Amplitude";
				freq = calque.Effects.addProperty("ADBE Slider Control");
				freq.name = "ZRot Frequency";
				calque.transform.orientation.expression = "Z=wiggle(effect(\"ZRot Frequency\")(1),effect(\"ZRot Amplitude\")(1));\n" + "[transform.orientation[0],transform.orientation[1],Z[2]]";
			}
	}





if (opacitebouton.value){
			amp = calque.Effects.addProperty("ADBE Slider Control");
			amp.name = "Opa Amplitude";
			freq = calque.Effects.addProperty("ADBE Slider Control");
			freq.name = "Opa Frequency";
			calque.transform.opacity.expression = "wiggle(effect(\"Opa Frequency\")(1),effect(\"Opa Amplitude\")(1))";
	}

			//fin du groupe d'annulation			
			app.endUndoGroup();

} else { alert(traduction(["Select the layer where to apply the \"wiggle\" function","Veuillez sélectionner le calque où appliquer le wiggle","Selecciona la capa dónde aplicar la función \"wiggle\""])); }

fenetrewiggle.close();
}



//FONCTION WIGGLE
function wiggle(){
	fenetrewiggle.show();
	}
//FONCTION POUR AJOUTER UN BONE
function bone(){
	
		if (verifNoms()) {
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
//mettre le bone à la position du coin : utiliser une expression pour avoir la position en mode world du coin
var filet = coins.pop();
var marionnette = coins.pop();
bone.position.expression = "thisComp.layer('" + calque.name + "').toWorld(thisComp.layer('" + calque.name + "').effect('" + marionnette.name + "').arap.mesh('" + filet.name + "').deform('" + coin.name + "').position)";
bone.position.setValue(bone.position.value);
bone.position.expression = "";
//nom du bone
bone.name = "B_" + coin.name;
bone.guideLayer = true;
//mettre l'expression dans le coin
coinpos.expression = "bonePos = thisComp.layer(\"" + bone.name + "\").toWorld(thisComp.layer(\"" + bone.name + "\").anchorPoint);\nfromWorld(bonePos)";

} else {alert(traduction(["Select a corner to create a bone","veuillez sélectionner le coin où créer un Bone","Selecciona un corner para crear un 'bone'"]),"Attention");}
	
//fin du groupe d'annulation
app.endUndoGroup();


}else{alert(traduction(["Select a corner to create a bone","veuillez sélectionner le coin où créer un Bone","Selecciona un corner para crear un 'bone'"]),"Attention");}
} else{alert(traduction(["Make sure there are no layers that share the same name!","Vérifiez qu'il n'y a pas deux calques portant le même nom !","Make sure there are no layers that share the same name!"]));}
}

//FONCTION POUR AFFICHER DE L'AIDE
function help(){
alert(traduction(["If you need help, go to \n\nhttp://ik.duduf.com\n\n\nor send an email to duduf@duduf.com\n\nUI Designed by Zeg\n\n3D IK made with the help of Eric Epstein","Si vous avez besoin d'aide, rendez-vous sur le site\n\nhttp://ik.duduf.net\n\nRubrique Aide et FAQ,\nou envoyez un message à duduf@duduf.com\n\nDesign Interface utilisateur : Zeg\n\nIK en 3D avec l'aide de : Eric Epstein","Si necesitas ayuda, visita \n\n" + "http://ik.duduf.fr\n\no envía un e-mail a duduf@duduf.com\n\nTraducido por McManus."]));
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

} else { alert(traduction(["Select two layers to measure distance from one layer to another!","Il faut avoir sélectionné deux calques pour mesurer la distance entre deux calques !","Selecciona dos capas para medir la distancia entre una y otra"]),"Attention",true); }

	}

//FONCTION DU BOUTON POUR MESURER
function mesure() {
		
		resultat = mesurer();
		if (resultat/resultat == 1) {
		resultattexte.text = traduction (["Distance is ","La distance est de ","Distance is "]) + resultat + " pixels.";
		mesurefenetre.show();
		}
		if (resultat == 0) {
		resultattexte.text = traduction(["The two layers are at the same place.","Les deux calques sont superposés.","The two layers are at the same place."]);
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
			app.beginUndoGroup(traduction(["Wheel","Roue","Rueda"]));

			var isnumber = OA/OA;

			if (isnumber == 1) {
				
var calqueroue = app.project.activeItem.selectedLayers[0];
var rouestring =  "O = thisLayer.toWorld(thisLayer.anchorPoint);\n" + "R = " + OA + ";\n" + "value + radiansToDegrees(O[0]/R)";
calqueroue.transform.rotation.expression = rouestring;

			//  fin de groupe d'annulation
			app.endUndoGroup();

rayonfenetre.close();

				} else { alert (traduction(["Invalid Radius","Rayon Invalide","Radio inválido"]),traduction(["What is the radius of the wheel?","Veuillez indiquer le rayon de la roue","Cuál es el radio de la rueda?"]),true); }
	}



//FONCTION TARGET CAM
function controlcam() {
	//vérifier qu'il n'y a qu'un calque sélectionné
if (app.project.activeItem.selectedLayers.length == 1){
	//vérifier que c'est une caméra
	if (app.project.activeItem.selectedLayers[0] instanceof CameraLayer) {

//début du groupe d'annulation
app.beginUndoGroup(traduction(["Camera Controller","Control Camera","Controlador de Cámaras"]));


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
else { alert (traduction(["Select the camera","Veuillez sélectionner la caméra","Selecciona una cámara",]),traduction(["Selected layer is not a camera","Le calque sélectionné n'est pas une caméra","La capa selecciona no es una cámara!"]),true); }
}

else { alert (traduction(["Select the camera","Veuillez sélectionner la caméra","Selecciona una cámara"]),traduction(["No camera selected","Pas de caméra sélectionnée","No se ha seleccionado ninguna cámara!"]),true); }
	
	
	
	}

//FONCTION CAM RELIEF
function camrelief() {
	//vérifier qu'il n'y a qu'un calque sélectionné
if (app.project.activeItem.selectedLayers.length == 1){
	//vérifier que c'est une caméra
	if (app.project.activeItem.selectedLayers[0] instanceof CameraLayer) {

//début du groupe d'annulation
app.beginUndoGroup(traduction(["3DCam","Camera Relief","Cámaras 3D"]));


//récupérer la caméra
var camera = app.project.activeItem.selectedLayers[0];

//créer le target
var target = app.project.activeItem.layers.addNull();
target.name = camera.name + " target";
target.threeDLayer = true;
target.position.setValue(camera.transform.pointOfInterest.value);
//ajouter le controleur convergence caméras
var convergence = target.Effects.addProperty("ADBE Angle Control");
convergence.name = traduction(["Cameras Convergence","Convergence Cameras","Convergencia de Cámaras"]);

//créer la cam
var cam = app.project.activeItem.layers.addNull();
cam.name = camera.name + " position";
cam.threeDLayer = true;
cam.position.setValue(camera.transform.position.value);
//ajouter le controleur écartement caméras
var ecart = cam.Effects.addProperty("ADBE Slider Control");
ecart.name = traduction(["Cameras Distance","Ecartement Cameras","Distancia entre Cámaras"]);


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
else { alert (traduction(["Select the camera","Veuillez sélectionner la caméra","Selecciona una cámara"]),traduction(["Selected layer is not a camera","Le calque sélectionné n'est pas une caméra","La capa selecciona no es una cámara!"]),true); }
}

else { alert (traduction(["Select the camera","Veuillez sélectionner la caméra","Selecciona una cámara"]),traduction(["No camera selected","Pas de caméra sélectionnée","No se ha seleccionado ninguna cámara!"]),true); }
	
	
	
	}

//FONCTION MORPHER
function morpher() {

				if (verifNoms()) {

//  début de groupe d'annulation
app.beginUndoGroup(traduction(["Create a morpher","Créer un Morph","Crear un Morph"]));


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

}else{alert(traduction(["Make sure there are no layers that share the same name!","Vérifiez qu'il n'y a pas deux calques portant le même nom !","Make sure there are no layers that share the same name!"]));}
}





//FONCTION LENTILLE
function lentille() {

//les calques sélectionnés :
var calques = app.project.activeItem.selectedLayers
			
			//vérifions qu'il y a plusieurs calques sélectionnés
			if (calques.length > 1){

				if (verifNoms()) {
				

			//  début de groupe d'annulation
			app.beginUndoGroup(traduction(["Lens Controller","Duik - Lentille","Controlador Lente"]));

			
			
			//sortir le premier calque, le centre, et ajouter les contrôleurs
			var centre = calques.shift();
			var nomcentre = centre.name;
			var controleurintensite = centre.Effects.addProperty("ADBE Slider Control");
			controleurintensite.name  =traduction(["Intensity","Intensite","Intensidad"]);
			controleurintensite(1).setValue(100);
			var controleurtaille = centre.Effects.addProperty("ADBE Slider Control");
			controleurtaille.name  =traduction(["Scale","Taille","Escala"]);
			controleurtaille(1).setValue(100);

			//l'expression de position
			var positionexpression = "calqueCentre = thisComp.layer(\"" + nomcentre + "\");\n\n" +
"function positionAbs(calque) {\n" +
"return calque.toWorld(calque.anchorPoint)\n" +
"}\n\n" +
"n=effect(\"" + traduction(["Distance from the center","Distance au centre","Distancia desde el centro"]) + "\")(1);\n\n" +
"X = thisComp.width - positionAbs(calqueCentre)[0];\n" +
"Y = thisComp.height - positionAbs(calqueCentre)[1];\n\n" +
"if ( n<100 ) {\n\n" +
"i=n/100;\n" +
"j=1-i;\n\n" +
"value + ( (  [X,Y]*(i/j) + positionAbs(calqueCentre) )*j\n\n )" +
"}\n\n" +
"else {value + [X,Y] }";

		//l'expression d'opacité
		var opaciteexpression = "n=thisComp.layer(\"" + centre.name  + "\").effect(\"" + traduction(["Intensity","Intensite","Intensidad"]) + "\")(1);\n" + "value*n/100";
			
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
			controleurposition.name = traduction(["Distance from the center","Distance au centre","Distancia desde el centro"]);
			controleurposition(1).setValue(100/nombrecalques*(i+1));
			
			//appliquer les expressions
			calque.transform.position.expression = positionexpression;
			calque.transform.opacity.expression = opaciteexpression;
			calque.transform.scale.expression = tailleexpression;
			
			//fin de la boucle
			}
			
			
			
			//fin du groupe d'annulation			
			app.endUndoGroup();
			} else{
				alert(traduction(["Make sure there are no layers that share the same name!","Vérifiez qu'il n'y a pas deux calques portant le même nom !","Make sure there are no layers that share the same name!"]));
				}
			} else {
				alert(traduction(["Select all the layers of the lens flare, beginning by the center","Veuillez sélectionner tous les calques servant à l'effet de lentille, en commençant par le centre","Selecciona todas la capas del destello de lente, empezando por el centro"]));
				}
			
			
}

//FONCTION LIEN DE DISTANCE
function distanceLink() {
				
if (verifNoms()) {
//vérifions qu'il n'y a bien que deux calques de sélectionnés
if (app.project.activeItem.selectedLayers.length == 2) {
	

			
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
app.beginUndoGroup(traduction(["Distance Link","Lien de distance","Distance Link"]));


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
distMinCurseur.name = traduction([" Min Distance"," Distance Min"," Min Distance"]);
var distMaxCurseur = calque.Effects.addProperty("ADBE Slider Control");
distMaxCurseur.name = traduction([" Max Distance"," Distance Max"," Max Distance"]);
var falloffCurseur = calque.Effects.addProperty("ADBE Slider Control");
falloffCurseur.name = traduction([" Falloff"," Distance Atténuation"," Falloff"]);
falloffCurseur(1).setValue(10);
	//l'expression à insérer si la ref est pas une cam
var distanceExpression = "calqueRef = thisComp.layer(\"" + calqueRef.name + "\");\n\n" + 
"function positionAbs(calque) {\n" + 
"return calque.toWorld(calque.anchorPoint);\n" + 
"}\n\n" + 
"distance = length(positionAbs(calqueRef),positionAbs(thisLayer));\n\n" + 
"distMin=Math.abs(effect(\"" + traduction([" Min Distance"," Distance Min"," Min Distance"]) + "\")(1));\n" + 
"distMax=Math.abs(effect(\"" + traduction([" Max Distance"," Distance Max"," Max Distance"]) + "\")(1));\n" + 
"falloff=effect(\"" + traduction([" Falloff"," Distance Atténuation"," Falloff"]) + "\")(1);\n\n" + 
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
"distMin=Math.abs(effect(\"" + traduction([" Min Distance"," Distance Min"," Min Distance"]) + "\")(1));\n" + 
"distMax=Math.abs(effect(\"" + traduction([" Max Distance"," Distance Max"," Max Distance"]) + "\")(1));\n" + 
"falloff=effect(\"" + traduction([" Falloff"," Distance Atténuation"," Falloff"]) + "\")(1);\n\n" + 
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
var minname = effet.name + traduction([" Min Distance"," Distance Min"," Min Distance"]);
distMinCurseur.name = minname;
var distMaxCurseur = calque.Effects.addProperty("ADBE Slider Control");
var maxname = effet.name + traduction([" Max Distance"," Distance Max"," Max Distance"])
distMaxCurseur.name = maxname;
var falloffCurseur = calque.Effects.addProperty("ADBE Slider Control");
var falloffname = effet.name + traduction([" Falloff"," Distance Atténuation"," Falloff"])
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
	
	
	
	}else{alert(traduction(["Cannot create expression on this effect","On ne peut pas créer d'expression sur cet effet","Cannot create expression on this effect"]),traduction(["Impossible distance link","Lien de distance impossible","Impossible distance link"]));}
	} else {alert (traduction(["Select the reference layer first, then the effect","Il faut d'abord sélectionner le calque de référence, puis l'effet, dans l'ordre.","Select the reference layer first, then the effect"]),"Attention",true);}
	} else{alert(traduction(["Make sure there are no layers that share the same name!","Vérifiez qu'il n'y a pas deux calques portant le même nom !","Make sure there are no layers that share the same name!"]));}
	}



//FONCTION POUR CHOISIR LA LANGUE
function choixLangue() {
	if (boutonlangue.selection == 0) app.settings.saveSetting("duik","lang",Language.FRENCH);
	if (boutonlangue.selection == 1) app.settings.saveSetting("duik","lang",Language.ENGLISH);
	if (boutonlangue.selection == 2) app.settings.saveSetting("duik","lang",Language.SPANISH);
	}

//FONCTION POUR VERIFIER QU'IL NYA PAS DEUX CALQUES PORTANT LE MEME NOM DANS LA COMP
function verifNoms() {
	
var calques = app.project.activeItem.layers;
var nbrecalques = app.project.activeItem.numLayers;
var renamed = false;

	if (nbrecalques > 1){
				for (i=1; i<=nbrecalques; i++) {
					for(j=i+1;j<=nbrecalques;j++){
						if(calques[i].name == calques[j].name) {
							calques[j].name = calques[j].name + "_" ;
							renamed = true;
							}
						}
					}
	}
			if (renamed) alert(traduction(["Some layers have been renamed","Des calques ont dû être renommés","Some layers have been renamed"]));
			return true;
}


//FONCTION SPRING
function spring() {
	
	
	// Vérifions si il n'y a qu'un calque sélectionné
if (app.project.activeItem.selectedLayers.length == 1){
	
var calque = app.project.activeItem.selectedLayers[0];

if (calque.selectedProperties.length != 0){
	
	//Prendre l'effet
var effet = app.project.activeItem.selectedLayers[0].selectedProperties.pop();
//on vérifie sin on peut mettre une expression, sinon inutile de continuer
if(effet.canSetExpression) {
	
//  début de groupe d'annulation
app.beginUndoGroup(traduction(["Spring","Rebond","Spring"]));


if (effet.parentProperty.isEffect){
	var effetIndex = effet.propertyIndex;
	var effetProfondeur = effet.propertyDepth;
	var effetParentName = effet.parentProperty.name;
	var elasticite = calque.Effects.addProperty("ADBE Slider Control");
	elasticite.name = traduction(["Elasticity","Elasticité","Elasticity"]);
	elasticite(1).setValue(5);
	var attenuation = calque.Effects.addProperty("ADBE Slider Control");
	attenuation.name = traduction(["Damping","Atténuation","Damping"]);
	attenuation(1).setValue(5);
    var rebond = calque.Effects.addProperty("ADBE Checkbox Control");
	rebond.name = traduction(["Bounce","Rebond","Bounce"]);
	effet = app.project.activeItem.selectedLayers[0].effect(effetParentName)(effetIndex);
	//=============================================
	//expression a insérer
	var expressionspring = "amorti = effect(\"" + traduction(["Damping","Atténuation","Damping"]) + "\")(1);\n" + 
"freq = effect(\"" + traduction(["Elasticity","Elasticité","Elasticity"]) + "\")(1);\n\n" + 
"rebond = effect(\"" + traduction(["Bounce","Rebond","Bounce"]) + "\")(1);\n\n" + 
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
	//=============================================

effet.expression = expressionspring;

} else {
	
var elasticite = calque.Effects.addProperty("ADBE Slider Control");
elasticite.name = traduction(["Elasticity","Elasticité","Elasticity"]);
elasticite(1).setValue(5);
var attenuation = calque.Effects.addProperty("ADBE Slider Control");
attenuation.name = traduction(["Damping","Atténuation","Damping"]);
attenuation(1).setValue(5);
var rebond = calque.Effects.addProperty("ADBE Checkbox Control");
rebond.name = traduction(["Bounce","Rebond","Bounce"]);
	//=============================================
	//expression a insérer
var expressionspring = "amorti = effect(\"" + traduction(["Damping","Atténuation","Damping"]) + "\")(1);\n" + 
"freq = effect(\"" +  traduction(["Elasticity","Elasticité","Elasticity"]) + "\")(1);\n\n" + 
"rebond = effect(\"" + traduction(["Bounce","Rebond","Bounce"]) + "\")(1);\n\n" + 
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
	//=============================================

effet.expression = expressionspring;

}

//fin du groupe d'annulation
app.endUndoGroup();	

}else{alert(traduction(["Cannot create expressions on this effect","On ne peut pas créer d'expression sur cet effet","Cannot create expressions on this effect"]),traduction(["Impossible spring","Spring impossible","Impossible spring"]));}
}else{alert(traduction(["Select the effect where you want to create the spring","Veuillez sélectionner un effet où appliquer le rebond","Select the effect where you want to create the spring"]),traduction(["No effect selected","Pas d'effet sélectionné","No effect selected"]));}
}else{alert(traduction(["Select the effect where you want to create the spring","Veuillez sélectionner un effet où appliquer le rebond","Select the effect where you want to create the spring"]),traduction(["No layer selected","Pas de calque sélectionné","No effect selected"]));}

}


//FONCTION ZERO
function zero(){
	
//vérifions qu'il y a 1 layer sélectionnés
if (app.project.activeItem.selectedLayers.length == 1) {	
	
	
			//  début de groupe d'annulation
			app.beginUndoGroup("ZERO");	
	
	var calque = app.project.activeItem.selectedLayers[0];

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
	
				//  fin de groupe d'annulation
			app.endUndoGroup();
	
	
	
} else { alert(traduction(["Select a layer to apply Zero","Sélectionnez un calque pour appliquer le Zero","Select a layer to apply Zero"]),"Attention",true); }


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
	
	} else { alert(traduction(["Select layers to rename","Sélectionnez les calques à renommer","Select layers to rename"]),"Attention",true); }
	
	
	}

//FONCTION LIENS
function liens() {

if (listeCompos.items.length >0) listeCompos.removeAll();
if (listeCompos2.items.length >0) listeCompos2.removeAll();

for(i=1;i<=app.project.items.length;i++) {
	if (app.project.items[i] instanceof CompItem) {
		listeCompos.add("item",app.project.items[i].name).compo = app.project.items[i];
		listeCompos2.add("item",app.project.items[i].name).compo = app.project.items[i];
		if (app.project.activeItem == app.project.items[i]) {
			listeCompos.selection = listeCompos.items[listeCompos.items.length-1];
			listeCompos2.selection = listeCompos2.items[listeCompos2.items.length-1];
			}
		}
	}

liensAffiche(app.project.activeItem,1);
liensAffiche(app.project.activeItem,2);

fenetreliens.show();
}

function liensAffiche(compo,cote) {

cote == 1 ? arbre = tree : arbre = tree2;

arbre.removeAll();


if(compo.layers.length >0) {

for (i=1;i<=compo.layers.length;i++) {
	compo.layers[i].node  = null;
	compo.layers[i].rang = 0;
	compo.layers[i].children = [];
	}

//lister les enfants
for (i=1;i<=compo.layers.length;i++) {
	if (compo.layers[i].parent != null ) compo.layers[i].parent.children.push([compo.layers[i].index]);
	}

//faire les rangs
var rr = 0;
for (i=1;i<=compo.layers.length;i++) {
	
var layer = compo.layers[i];

	var r = 0;
	layertest = layer;
	while (layertest.parent != null) {
		layertest = layertest.parent;
		r++
		}
	layer.rang = r;
	if (r>rr) rr=r;
	}

//créer les nodes
for (j=0;j<=rr;j++) {
for (i=1;i<=compo.layers.length;i++) {

var layer = compo.layers[i];

if (layer.rang == j) {
	if (j==0 && layer.children.length >0) layer.node = arbre.add("node",layer.index + " " + layer.name);
	if (j==0 && layer.children.length ==0 ) layer.node = arbre.add("item",layer.index + " " + layer.name);
	if (j>0 && layer.children.length >0) layer.node = layer.parent.node.add("node",layer.index + " " + layer.name);
	if (j>0 && layer.children.length ==0) layer.node = layer.parent.node.add("item",layer.index + " " + layer.name);
	}	
}
}

}

}

//FONCTIONS LIENS OK ET ANNULER
var calqueLier = 0;

function lier() {
	
	if (tree.selection != null) calqueLier = eval(tree.selection.text.substr(0,1));
     if (tree2.selection != null) listeCompos.selection.compo.layer(calqueLier).parent = listeCompos2.selection.compo.layer(eval(tree2.selection.text.substr(0,1)));
	 liensAffiche (listeCompos.selection.compo,1);
	 liensAffiche (listeCompos2.selection.compo,2);
	 
	}

//FONCTIONS WIRES
var calqueWire = 0;
calqueWire.wire = null;
var calqueWire2 = 0;
calqueWire2.wire = null;

function choixWire(cote) {
	if (cote == 1)  { calqueWire = listeCompos.selection.compo.layer(eval(tree.selection.text.substr(0,1))); }
	if (cote == 2)  { calqueWire2 = listeCompos2.selection.compo.layer(eval(tree2.selection.text.substr(0,1))); }
	
	for(i=0;i<fenetreWires.children;i++) fenetreWires.remove(i);
	fenetreWires.bounds = [0,0,0,0];
	
	if ( (cote == 1 && calqueWire.threeDLayer) || (cote == 2 && calqueWire2.threeDLayer) )  {
	fenetreWires.bounds = [450,400,652,562];
	var boutonAnchor = fenetreWires.add("button",[2,2,200,20],traduction(["Anchor Point","Point d'ancrage","Anchor Point"]));
	boutonAnchor.onClick = function() {
		cote == 1 ? calqueWire.wire = "anchorPoint" : calqueWire2.wire = "anchorPoint";
		fenetreWires.hide();
		};
	var boutonPosition = fenetreWires.add("button",[2,22,200,40],traduction(["Position","Position","Position"]));
	boutonPosition.onClick = function() {
		cote == 1 ? calqueWire.wire = "position" : calqueWire2.wire = "position";
		fenetreWires.hide();
		};
	var boutonEchelle = fenetreWires.add("button",[2,42,200,60],traduction(["Scale","Echelle","Scale"]));
	boutonEchelle.onClick = function() {
		cote == 1 ? calqueWire.wire = "scale" : calqueWire2.wire = "scale";
		fenetreWires.hide();
		};
	var boutonOrientation = fenetreWires.add("button",[2,62,200,80],traduction(["Orientation","Orientation","Orientation"]));
	boutonOrientation.onClick = function() {
		cote == 1 ? calqueWire.wire = "orientation" : calqueWire2.wire = "orientation";
		fenetreWires.hide();
		};
	var boutonRotationX = fenetreWires.add("button",[2,82,200,100],traduction(["X Rotation","Rotation X","X Rotation"]));
	boutonRotationX.onClick = function() {
		cote == 1 ? calqueWire.wire = "transform.xRotation" : calqueWire2.wire = "transform.xRotation";
		fenetreWires.hide();
		};
	var boutonRotationY = fenetreWires.add("button",[2,102,200,120],traduction(["Y Rotation","Rotation Y","Y Rotation"]));
	boutonRotationY.onClick = function() {
		cote == 1 ? calqueWire.wire = "transform.yRotation" : calqueWire2.wire = "transform.yRotation";
		fenetreWires.hide();
		};
	var boutonRotationZ = fenetreWires.add("button",[2,122,200,140],traduction(["Z Rotation","Rotation Z","Z Rotation"]));
	boutonRotationZ.onClick = function() {
		cote == 1 ? calqueWire.wire = "transform.zRotation" : calqueWire2.wire = "transform.zRotation";
		fenetreWires.hide();
		};
	var boutonOpacite = fenetreWires.add("button",[2,142,200,160],traduction(["Opacity","Opacité","Opacity"]));
	boutonOpacite.onClick = function() {
		cote == 1 ? calqueWire.wire = "opacity" : calqueWire2.wire = "opacity";
		fenetreWires.hide();
		};
	} else {
	fenetreWires.bounds = [450,400,652,502];
	var boutonAnchor = fenetreWires.add("button",[2,2,200,20],traduction(["Anchor Point","Point d'ancrage","Anchor Point"]));
	boutonAnchor.onClick = function() {
		cote == 1 ? calqueWire.wire = "anchorPoint" : calqueWire2.wire = "anchorPoint";
		fenetreWires.hide();
		};
	var boutonPosition = fenetreWires.add("button",[2,22,200,40],traduction(["Position","Position","Position"]));
	boutonPosition.onClick = function() {
		cote == 1 ? calqueWire.wire = "position" : calqueWire2.wire = "position";
		fenetreWires.hide();
		};
	var boutonEchelle = fenetreWires.add("button",[2,42,200,60],traduction(["Scale","Echelle","Scale"]));
	boutonEchelle.onClick = function() {
		cote == 1 ? calqueWire.wire = "scale" : calqueWire2.wire = "scale";
		fenetreWires.hide();
		};
	var boutonRotation = fenetreWires.add("button",[2,62,200,80],traduction(["Rotation","Rotation","Rotation"]));
	boutonRotation.onClick = function() {
		cote == 1 ? calqueWire.wire = "rotation" : calqueWire2.wire = "rotation";
		fenetreWires.hide();
		};
	var boutonOpacite = fenetreWires.add("button",[2,82,200,100],traduction(["Opacity","Opacité","Opacity"]));
	boutonOpacite.onClick = function() {
		cote == 1 ? calqueWire.wire = "opacity" : calqueWire2.wire = "opacity";
		fenetreWires.hide();
		};
	}
	
	fenetreWires.show();
	if (calqueWire.wire != null && calqueWire2.wire != null) {
		boutonDroite.enabled = true;
		boutonGauche.enabled = true;
		aideLiens.text = traduction(["Now choose the direction of the link by checking '>' or '<'.","Choisissez maintenant le sens du lien en cliquant sur '<' ou '>'.","Now choose the direction of the link by checking '>' or '<'."]);
        treeOk.text = tree.selection.text + " -- " + calqueWire.wire;
        treeOk2.text = tree2.selection.text + " -- " + calqueWire2.wire;
		wire();
		} else {
		if (calqueWire.wire != null){
			aideLiens.text = traduction(["Now, select a property in the right side.","Maintenant, choisissez une propriété de la zone de droite","Now, select a property in the right side."]);
            treeOk.text = tree.selection.text + " -- " + calqueWire.wire;
			}
		if (calqueWire2.wire != null){
			aideLiens.text = traduction(["Now, select a property in the left side.","Maintenant, choisissez une propriété de la zone de gauche","Now, select a property in the left side."]);
            treeOk2.text = tree2.selection.text + " -- " + calqueWire2.wire;
			}
		}
	}



function wire() {
	if (boutonGauche.value) {
		texteWire.text = "value + comp('" + listeCompos.selection.compo.name + "').layer('" + calqueWire.name + "')." + calqueWire.wire + " - [" + eval("calqueWire." + calqueWire.wire).value.toString() + "]";
		aideLiens.text = traduction(["Finally, click 'Exp' when you are done.","Finallement, cliquez sur 'Exp' quand vous êtes prèts","Finally, click 'Exp' when you are done."]);
		}
	if (boutonDroite.value) {
		texteWire.text = "value + comp('" + listeCompos2.selection.compo.name + "').layer('" + calqueWire2.name + "')." + calqueWire2.wire + " - [" + eval("calqueWire2." + calqueWire2.wire).value.toString() + "]";
		aideLiens.text = traduction(["Finally, click 'Exp' when you are done.","Finallement, cliquez sur 'Exp' quand vous êtes prèts","Finally, click 'Exp' when you are done."]);
		}
	}

function wireOK() {
	if (boutonGauche.value) eval("calqueWire2." + calqueWire2.wire).expression = texteWire.text;
	if (boutonDroite.value) eval("calqueWire." + calqueWire.wire).expression = texteWire.text;
	calqueWire = 0;
	calqueWire.wire = null;
	calqueWire2 = 0;
	calqueWire2.wire = null;
	boutonDroite.enabled = false;
	boutonGauche.enabled = false;
	boutonDroite.value = false;
	boutonGauche.value = false;
	boutonWireOK.enabled = false;
     treeOk.text = traduction(["Select property to link with expressions...","Sélectionner la propriété à lier en expression...","Select property to link with expressions..."]);
     treeOk2.text = traduction(["Select property to link with expressions...","Sélectionner la propriété à lier en expression...","Select property to link with expressions..."]);
	aideLiens.text = traduction(["Choose a property you want to link, or use a standard 'child/parent' link by clicking on 'Parent'.","Choisissez une propriété à lier, ou utilisez un lien 'parent/enfant' standard en cliquant sur 'Parent'.","Choose a property you want to link, or use a standard 'child/parent' link by clicking on 'Parent'."])
	}

//FONCTION CALC
function calc() {
	
	resultatcalc1.text = resultatcalc2.text;
	
	if (eval(textecalc.text) != null)	
		textecalc.text.length < 15 ? resultatcalc2.text = textecalc.text + " = " + eval(textecalc.text) : resultatcalc2.text = "(...) = " + eval(textecalc.text) ;
	else 
		resultatcalc2.text ="error";

}

//FONCTIONS INTERPOLATIONS

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
app.beginUndoGroup(traduction(["Oscillation","Oscillation","Oscillation"]));
	
//TODO vérifier le nombre de dimensions

if (effet.parentProperty.isEffect){
	var effetIndex = effet.propertyIndex;
	var effetProfondeur = effet.propertyDepth;
	var effetParentName = effet.parentProperty.name;
	var amplitude = calque.Effects.addProperty("ADBE Slider Control");
	amplitude.name = traduction(["Amplitude","Amplitude","Amplitude"]);
	amplitude(1).setValue(1);
	var frequence = calque.Effects.addProperty("ADBE Slider Control");
	frequence.name = traduction(["Frequence","Fréquence","Frequence"]);
	frequence(1).setValue(1);
    var decalage = calque.Effects.addProperty("ADBE Slider Control");
	decalage.name = traduction(["Offset","Decalage","Offset"]);
	var amorti = calque.Effects.addProperty("ADBE Slider Control");
	amorti.name = traduction(["FallOff","Amorti","FallOff"]);
	
	effet = app.project.activeItem.selectedLayers[0].effect(effetParentName)(effetIndex);
	//=============================================
	//expression a insérer
	var expressionosc = "amp = effect('" + traduction(["Amplitude","Amplitude","Amplitude"]) + "')(1);\n" +
"freq = effect('" + traduction(["Frequence","Fréquence","Frequence"]) + "')(1)*2*Math.PI;\n" +
"decalage = framesToTime(effect('" + traduction(["Offset","Decalage","Offset"]) + "')(1));\n" +
"amorti = Math.abs(effect('" + traduction(["FallOff","Amorti","FallOff"]) + "')(1));\n\n" +
"sin = Math.sin(time*freq+decalage);\n\n" +
"for(i=0;i<amorti;i++) {\n" +
"sin = Math.sin(sin);\n" +
"}\n" +
"sin*amp+value;";
	//=============================================

effet.expression = expressionosc;

} else {
	
	var amplitude = calque.Effects.addProperty("ADBE Slider Control");
	amplitude.name = traduction(["Amplitude","Amplitude","Amplitude"]);
	amplitude(1).setValue(1);
	var frequence = calque.Effects.addProperty("ADBE Slider Control");
	frequence.name = traduction(["Frequence","Fréquence","Frequence"]);
	frequence(1).setValue(1);
    var decalage = calque.Effects.addProperty("ADBE Slider Control");
	decalage.name = traduction(["Offset","Decalage","Offset"]);
	var amorti = calque.Effects.addProperty("ADBE Slider Control");
	amorti.name = traduction(["FallOff","Amorti","FallOff"]);
	//=============================================
	//expression a insérer
	var expressionosc = "amp = effect('" + traduction(["Amplitude","Amplitude","Amplitude"]) + "')(1);\n" +
"freq = effect('" + traduction(["Frequence","Fréquence","Frequence"]) + "')(1)*2*Math.PI;\n" +
"decalage = framesToTime(effect('" + traduction(["Offset","Decalage","Offset"]) + "')(1));\n" +
"amorti = Math.abs(effect('" + traduction(["FallOff","Amorti","FallOff"]) + "')(1));\n\n" +
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

}else{alert(traduction(["Cannot create expressions on this effect","On ne peut pas créer d'expression sur cet effet","Cannot create expressions on this effect"]),traduction(["Impossible spring","Spring impossible","Impossible spring"]));}
}else{alert(traduction(["Select the effect where you want to create the spring","Veuillez sélectionner un effet où appliquer le rebond","Select the effect where you want to create the spring"]),traduction(["No effect selected","Pas d'effet sélectionné","No effect selected"]));}
}else{alert(traduction(["Select the effect where you want to create the spring","Veuillez sélectionner un effet où appliquer le rebond","Select the effect where you want to create the spring"]),traduction(["No layer selected","Pas de calque sélectionné","No effect selected"]));}


	}


//FONCTION EXPOSITION DE LANIM
function nframes() {
    	// Vérifions si il n'y a qu'un calque sélectionné
if (app.project.activeItem.selectedLayers.length == 1){
	
var calque = app.project.activeItem.selectedLayers[0];

if (calque.selectedProperties.length != 0){
	
	//Prendre l'effet
var effet = app.project.activeItem.selectedLayers[0].selectedProperties.pop();
//on vérifie sin on peut mettre une expression, sinon inutile de continuer
if(effet.canSetExpression) {
	
//  début de groupe d'annulation
app.beginUndoGroup(traduction(["Animation Exposure","Expo d'anim","Animation Exposure"]));

if (effet.parentProperty.isEffect){
	var effetIndex = effet.propertyIndex;
	var effetProfondeur = effet.propertyDepth;
	var effetParentName = effet.parentProperty.name;
	var expo = calque.Effects.addProperty("ADBE Slider Control");
	expo.name = traduction(["Anim Exposure","Expo d'anim","Anim Exposure"]);
	expo(1).setValue(1);
	
	effet = app.project.activeItem.selectedLayers[0].effect(effetParentName)(effetIndex);
	//=============================================
	//expression a insérer
	var expressionexpo = "expo = effect(\"" + traduction(["Anim Exposure","Expo d'anim","Anim Exposure"]) + "\")(1);\n" +
"expo == 0 ? expo = 1 : Math.abs(expo);\n" +
"timef = timeToFrames(time);\n" +
"valueAtTime(framesToTime( timef - timef%expo ))";
	//=============================================

effet.expression = expressionexpo;

} else {
	
	var expo = calque.Effects.addProperty("ADBE Slider Control");
	expo.name = traduction(["Anim Exposure","Expo d'anim","Anim Exposure"]);
	expo(1).setValue(1);
	//=============================================
	//expression a insérer
	//expression a insérer
	var expressionexpo = "expo = effect(\"" + traduction(["Anim Exposure","Expo d'anim","Anim Exposure"]) + "\")(1);\n" +
"expo == 0 ? expo = 1 : Math.abs(expo);\n" +
"timef = timeToFrames(time);\n" +
"valueAtTime(framesToTime( timef - timef%expo ))";
	//=============================================

effet.expression = expressionexpo;

}
//fin du groupe d'annulation
app.endUndoGroup();	

}else{alert(traduction(["Cannot create expressions on this effect","On ne peut pas créer d'expression sur cet effet","Cannot create expressions on this effect"]),traduction(["Impossible spring","Spring impossible","Impossible spring"]));}
}else{alert(traduction(["Select the effect where you want to create the spring","Veuillez sélectionner un effet où appliquer le rebond","Select the effect where you want to create the spring"]),traduction(["No effect selected","Pas d'effet sélectionné","No effect selected"]));}
}else{alert(traduction(["Select the effect where you want to create the spring","Veuillez sélectionner un effet où appliquer le rebond","Select the effect where you want to create the spring"]),traduction(["No layer selected","Pas de calque sélectionné","No effect selected"]));}


	}

//FONCTION PATH FOLLOW
function pathFollow() {
    
    		// Vérifions si il n'y a qu'un calque sélectionné
if (app.project.activeItem.selectedLayers.length == 1){
	
var calque = app.project.activeItem.selectedLayers[0];
	
//  début de groupe d'annulation
app.beginUndoGroup(traduction(["Path Follow","Suivi de trajectoire","Path Follow"]));
	
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

}else{alert(traduction(["No layer selected","Pas de calque sélectionné","No effect selected"]));}


    }

//===========================================
//UI
//===========================================
var duik = new File($.fileName);
var dossierIcones = duik.parent.parent.absoluteURI  + "/Duik Icons/";

//fenètre des liens
		{
		var fenetreliens = new Window("palette","Organigramme");
		fenetreliens.bounds = [300,300,924,662];
		var boutonLiens = fenetreliens.add("button",[302,202,342,220],traduction(["Parent","Parent","Parent"]));
		boutonLiens.onClick = lier;
		var boutonDelie =  fenetreliens.add("button",[302,222,342,240],traduction(["X","X","X"]));
		boutonDelie.onClick = function() { listeCompos.selection.compo.layer(eval(tree.selection.text.substr(0,1))).parent = null; liensAffiche (listeCompos.selection.compo,1); liensAffiche (listeCompos2.selection.compo,2); }
		var listeCompos = fenetreliens.add("dropdownlist",[0,0,300,20]);
		listeCompos.onChange = function() { 
			if (listeCompos.selection != null) liensAffiche (listeCompos.selection.compo,1);
			};
		var listeCompos2 = fenetreliens.add("dropdownlist",[344,0,624,20]);
		listeCompos2.onChange = function() {
			if (listeCompos2.selection != null) liensAffiche (listeCompos2.selection.compo,2);
			};
		var tree = fenetreliens.add("treeview",[0,22,300,300]);
		tree.onDoubleClick = function() { choixWire(1); }
		var tree2 = fenetreliens.add("treeview",[344,22,624,300]);
		tree2.onDoubleClick = function() {  choixWire(2); }
        var treeOk =  fenetreliens.add("button",[0,302,300,320],traduction(["Select property to link with expressions...","Sélectionner la propriété à lier en expression...","Select property to link with expressions..."]));
        treeOk.onClick =  function() {  choixWire(1); }
        var treeOk2 =  fenetreliens.add("button",[344,302,624,320],traduction(["Select property to link with expressions...","Sélectionner la propriété à lier en expression...","Select property to link with expressions..."]));
        treeOk2.onClick =  function() {  choixWire(2); }
		var aideLiens = fenetreliens.add("statictext",[2,322,624,340],traduction(["Choose a property you want to link, or use a standard 'child/parent' link by clicking on 'Parent'.","Choisissez une propriété à lier, ou utilisez un lien 'parent/enfant' standard en cliquant sur 'Parent'.","Choose a property you want to link, or use a standard 'child/parent' link by clicking on 'Parent'."]));
		var boutonDroite = fenetreliens.add("radiobutton",[302,102,342,120],"<");
		boutonDroite.enabled = false;
		boutonDroite.onClick = function() { wire(); boutonWireOK.enabled = true; };
		var boutonGauche = fenetreliens.add("radiobutton",[302,122,342,140],">");
		boutonGauche.enabled = false;
		boutonGauche.onClick = function() { wire(); boutonWireOK.enabled = true; };
		var boutonWireOK = fenetreliens.add("button",[302,142,342,160],traduction(["Exp","Exp","Exp"]));
		boutonWireOK.enabled = false;
		boutonWireOK.onClick = wireOK;
		var texteWire = fenetreliens.add("edittext",[2,342,624,360],"");
		}

//fenètre des Wires
	{
	var fenetreWires = new Window("dialog","Wires");
	}

		// la fenetre du rename
		{
		var fenetrerename = new Window("palette",traduction(["Rename","Renommer","Rename"]));
		fenetrerename.bounds = [300,300,600,435];
		//prefix
		var prefixtexte = fenetrerename.add("checkbox",[5,5,60,25],traduction(["Prefix","Préfixe","Prefix"]));
		var prefix = fenetrerename.add("edittext",[65,5,295,25]);
		prefix.enabled = false;
		prefixtexte.onClick = function() {
			prefixtexte.value ? prefix.enabled = true : prefix.enabled = false ;
			}
		//nom
		var nametexte = fenetrerename.add("checkbox",[5,30,60,50],traduction(["Name","Nom","Name"]));
		var name = fenetrerename.add("edittext",[65,30,295,50]);
		name.enabled = false;
			nametexte.onClick = function() {
			nametexte.value ? name.enabled = true : name.enabled = false ;
			}
		//suffix
		var suffixtexte = fenetrerename.add("checkbox",[5,55,60,75],traduction(["Suffix","Suffixe","Suffix"]));
		var suffix = fenetrerename.add("edittext",[65,55,295,75]);
		suffix.enabled = false;
			suffixtexte.onClick = function() {
			suffixtexte.value ? suffix.enabled = true : suffix.enabled = false ;
			}
		//numéros
		var numerotexte = fenetrerename.add("checkbox",[5,80,200,100],traduction(["Number from","Numéroter à partir de :","Number from"]));
		var numero = fenetrerename.add("edittext",[205,80,295,100]);
		numero.enabled = false;
			numerotexte.onClick = function() {
			numerotexte.value ? numero.enabled = true : numero.enabled = false ;
			}
		//ok
		var renameok = fenetrerename.add("button",[5,105,295,125],"OK");
		renameok.onClick = rename;
		}



		//fenètre de résultat de mesure
		{
		var mesurefenetre = new Window ("palette", traduction(["Result","Résultat","Result"]), [300,300,500,330]);
		var resultattexte = mesurefenetre.add("statictext",[5,5,190,25],"Distance = " + "" + " pixels");
		}

		//fenètre de la roue
		{
		//on a besoin d'une variable globale...
		var OA = 0;
		var rayonfenetre = new Window ("palette", traduction(["Radius?","Rayon ?","Radius?"]), [300,300,450,355]);
		//champ de saisie
		var rayonbouton = rayonfenetre.add ("edittext", [5,5,95,25]);
		rayonbouton.onChange = rayon;
		rayonbouton.helpTip = traduction(["Radius of the wheel, pixels","Le rayon de la roue, en pixels","Radio de la rueda, en pixels"]);
		//bouton mesurer
		var mesurebouton = rayonfenetre.add("button",[100,5,145,25],"Mesure");
		mesurebouton.value = false;
		mesurebouton.helpTip = traduction(["Measure with another object","Mesurer avec un autre objet","Medir con otro objeto"]);
		mesurebouton.onClick = mesurer;
		//bouton OK
		var rayonok = rayonfenetre.add("button",[5,30,145,50],"OK");
		rayonok.onClick = roue;
		}


		// la fenetre du wiggle
		{
		var fenetrewiggle = new Window("palette","Wiggle");
		fenetrewiggle.bounds = [300,300,480,470];
		// position
		var positioncadre = fenetrewiggle.add("panel",[5,5,175,38],"Position");
		//separer ou toutes
		var positiontous = positioncadre.add("checkbox",[0,0,75,25],traduction(["All axes","Tous les axes","Todos los ejes"]));
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
		var echellecadre = fenetrewiggle.add("panel",[5,43,175,76],traduction(["Scale","Echelle","Escala"]));
		var echelletous = echellecadre.add("checkbox",[5,0,80,25],traduction(["All axes","Tous les axes","Todos los ejes"]));
		echelletous.onClick = wiggleconfscale;
		//x y
		var echelleX = echellecadre.add("checkbox",[110,0,135,25],"X");
		var echelleY = echellecadre.add("checkbox",[140,0,165,25],"Y");	
		// rotation
		var rotationcadre = fenetrewiggle.add("panel",[5,81,175,114],"Rotation");
		//separer ou toutes
		var rotationtous = rotationcadre.add("checkbox",[0,0,75,25],traduction(["All axes","Tous les axes","Todos los ejes"]));
		rotationtous.value = false;
		rotationtous.onClick = wiggleconfrot;
		//x y z
		var rotationX = rotationcadre.add("checkbox",[80,0,105,25],"X");
		var rotationY = rotationcadre.add("checkbox",[110,0,135,25],"Y");
		var rotationZ = rotationcadre.add("checkbox",[140,0,165,25],"Z");
		// opacité
		var opacitebouton = fenetrewiggle.add("checkbox",[10,119,125,135],traduction(["Opacity","Opacité","Opacidad"]));
		//ok
		var wiggleok = fenetrewiggle.add("button",[5,140,50,165],"OK");
		wiggleok.onClick = wigglevalid;
		}
		


		// la palette IK_Tools
		{
		//
		
		
		var palette = (thisObj instanceof Panel) ? thisObj : new Window("palette","Duduf IK Tools");
		palette.bounds = [300,300,534,420];
		palette.add ("statictext", [10,   8,95, 25],  "Duik v" + version);
		var boutonhelp = palette.add ("iconbutton",[97,8,112,23],dossierIcones + "fr/help.png");
		boutonhelp.onClick = help;
		// ----- Les différents panneaux
		var panoik = palette.add("panel",[5,31,229,115]);
		var panoanimation = palette.add("panel",[5,31,229,115]);
		panoanimation.visible = false;
		var panointerpo =  palette.add("panel",[5,31,229,115]);
		panointerpo.visible = false;
		var panoobjets = palette.add("panel",[5,31,229,115]);
		panoobjets.visible = false;
		var panocam = palette.add("panel",[5,31,229,115]);
		panocam.visible = false;
		var panocalc = palette.add("panel",[5,31,229,115]);
		panocalc.visible = false;
        var panonotes = palette.add("panel",[5,31,229,115]);
		panonotes.visible = false;
		var panosettings = palette.add("panel",[5,31,229,115]);
		panosettings.visible = false;
		var selecteur = palette.add("dropdownlist",[114,5,229,25],traduction([["IK","Animation","Interpolation","Objects & Tools","Cameras","Calculator","Notes","Settings"],["IK","Animation","Interpolation","Objets & Outils","Cameras","Calculatrice","Notes","Préférences"],["IK","Animació ","Interpolation","Objetos & Tools","Cámara","Calculator","Notes","Settings"]]));
		selecteur.onChange = function() {
			if (selecteur.selection == 0){
				panoik.visible = true;
				panoanimation.visible = false;
				panointerpo.visible = false;
				panoobjets.visible = false;
				panocam.visible = false;
				panocalc.visible = false;
                  panonotes.visible = false;
				panosettings.visible = false;
                  app.settings.saveSetting("duik","pano","0");
				}
						if (selecteur.selection == 1){
				panoik.visible = false;
				panoanimation.visible = true;
				panointerpo.visible = false;
				panoobjets.visible = false;
				panocam.visible = false;
				panocalc.visible = false;
                  panonotes.visible = false;
				panosettings.visible = false;
                  app.settings.saveSetting("duik","pano","1");
				}
						if (selecteur.selection == 2){
				panoik.visible = false;
				panoanimation.visible = false;
				panointerpo.visible = true;
				panoobjets.visible = false;
				panocam.visible = false;
				panocalc.visible = false;
                  panonotes.visible = false;
				panosettings.visible = false;
                  app.settings.saveSetting("duik","pano","2");
				}
						if (selecteur.selection == 3){
				panoik.visible = false;
				panoanimation.visible = false;
				panointerpo.visible = false;
				panoobjets.visible = true;
				panocam.visible = false;
				panocalc.visible = false;
                  panonotes.visible = false;
				panosettings.visible = false;
                  app.settings.saveSetting("duik","pano","3");
				}
						if (selecteur.selection == 4){
				panoik.visible = false;
				panoanimation.visible = false;
				panointerpo.visible = false;
				panoobjets.visible = false;
				panocam.visible = true;
				panocalc.visible = false;
                  panonotes.visible = false;
				panosettings.visible = false;
                  app.settings.saveSetting("duik","pano","4");
				}
						if (selecteur.selection == 5){
				panoik.visible = false;
				panoanimation.visible = false;
				panointerpo.visible = false;
				panoobjets.visible = false;
				panocam.visible = false;
				panocalc.visible = true;
                  panonotes.visible = false;
				panosettings.visible = false;
                  app.settings.saveSetting("duik","pano","5");
				}
                            if (selecteur.selection == 6){
				panoik.visible = false;
				panoanimation.visible = false;
				panointerpo.visible = false;
				panoobjets.visible = false;
				panocam.visible = false;
				panocalc.visible = false;
                  panonotes.visible = true;
				panosettings.visible = false;
                  app.settings.saveSetting("duik","pano","6");
				}
                            if (selecteur.selection == 7){
				panoik.visible = false;
				panoanimation.visible = false;
				panointerpo.visible = false;
				panoobjets.visible = false;
				panocam.visible = false;
				panocalc.visible = false;
                  panonotes.visible = false;
				panosettings.visible = true;
				}
			}
        selecteur.selection = eval(app.settings.getSetting("duik","pano"));
		
		// PANNEAU SETTINGS -----------------------------------------------------------
		{
		//boutons francais anglais
		panosettings.add("statictext",[2,2,60,20],traduction(["Language :","Langue :","Language :"]));
		var boutonlangue = panosettings.add("dropdownlist",[65,2,130,20],["Français","English","Español"]);
		if (app.settings.getSetting("duik", "lang") == Language.FRENCH) boutonlangue.selection = 0;
		if (app.settings.getSetting("duik", "lang") == Language.ENGLISH) boutonlangue.selection = 1;
		if (app.settings.getSetting("duik", "lang") == Language.SPANISH) boutonlangue.selection = 2;
		boutonlangue.onChange = choixLangue;
		//mises a jour
		var boutonVMAJ = panosettings.add("checkbox",[2,22,220,40],traduction(["Check for update at startup","Vérifier les mises à jour au démarrage","Check for update at startup"]));
		if (app.settings.getSetting("duik", "version") == "oui") {boutonVMAJ.value = true; }
		boutonVMAJ.onClick = function() {
			if (boutonVMAJ.value) {app.settings.saveSetting("duik","version","oui");} else {app.settings.saveSetting("duik","version","non");}
			}
		var boutonMAJ = panosettings.add("iconbutton",[2,42,220,60],traduction([dossierIcones + "en/maj.png",dossierIcones + "fr/maj.png",dossierIcones + "en/maj.png"]));
		boutonMAJ.onClick = function() {
			if (MAJ(version)) { alert(traduction(["Duik is up-to-date","Duik est à jour","Duik is up-to-date"])); };
			}
		}
		
		// PANNEAU IK -----------------------------------------------------------
		{
		//bouton pour créer l'IK
		var boutonik = panoik.add("iconbutton",[2,2,110,20], traduction([dossierIcones + "en/ik_creer.png",dossierIcones + "fr/ik_creer.png",dossierIcones + "es/ik_creer.png"]));
		boutonik.onClick = ik;
		//bouton pour créer un goal
		var boutongoal = panoik.add("iconbutton",[112,2,220,20],traduction([dossierIcones + "en/ik_goal.png",dossierIcones + "fr/ik_goal.png",dossierIcones + "es/ik_goal.png"]));
		boutongoal.onClick = pregoal;
		boutongoal.helpTip = traduction(["Selected layer will keep its orientation, despite the transformations of its parent","Le calque sélectionné gardera son orientation, malgré les transformations de son parent","La capa seleccionada guardará su orientación, a pesar de las transformaciones de sus emparentados"]);
		//boutons front et right view
		panoik.add("statictext",[2,25,15,40],"3D");
		var boutonFront = panoik.add("radiobutton",[17,22,110,40],traduction(["Front view","Vue devant","Front view"]));
		var boutonRight = panoik.add("radiobutton",[112,22,220,40],traduction(["Right view","Vue droite","Left view"]));
		boutonFront.value = true;
		//bouton controleur
		var boutoncontroleur2 = panoik.add("iconbutton",[2,42,110,60],traduction([dossierIcones + "en/obj_control.png",dossierIcones + "fr/obj_control.png",dossierIcones + "es/obj_control.png"]));
		boutoncontroleur2.onClick = controleur;
		boutoncontroleur2.helpTip = traduction(["Creates a null object at the anchor point of the selected layer","Ajoute un objet null au pivot du calque sélectionné","Crea un Objeto Null en el punto de anclaje de la capa seleccionada"]);
		//bouton bone
		var boutonbone2 = panoik.add("iconbutton",[112,42,220,60],dossierIcones + "fr/obj_bones.png");
		boutonbone2.onClick = bone;
		boutonbone2.helpTip = traduction(["Creates a bone on a corner of a puppet","Crée un bone sur un coin de marionnette","Crea un 'bone' en una esquina de una marioneta"]);
		//bouton zero
		var boutonzero2 = panoik.add("iconbutton",[2,62,110,80],traduction ([dossierIcones + "en/obj_zero.png",dossierIcones + "fr/obj_zero.png",dossierIcones + "en/obj_zero.png"]));
		boutonzero2.onClick = zero;
		boutonzero2.helpTip = traduction(["Creates a \"Zero\" object on a layer","Crée un objet zéro sur un calque","Creates a \"Zero\" object on a layer"]);
		//bouton renommer
		var boutonrename2 = panoik.add("iconbutton",[112,62,220,80],traduction ([dossierIcones + "en/obj_renommer.png",dossierIcones + "fr/obj_renommer.png",dossierIcones + "en/obj_renommer.png"]));
		boutonrename2.onClick = function() {fenetrerename.show();}
		boutonrename2.helpTip = traduction(["Rename layers","Renommer des calques","Rename layers"]);
		}
		
		// PANNEAU INTERPOLATION -----------------------------------------------------------
		{
		panointerpo.add("statictext",[2,2,80,16],"Type de clefs :");
		var boutonLineaire = panointerpo.add("iconbutton",[82,2,94,14],dossierIcones + "fr/interpo_lineaire.png");
        boutonLineaire.onClick = lineaire;
        boutonLineaire.helpTip = "Interpolation Linéaire";
		var boutonLissageA = panointerpo.add("iconbutton",[96,2,108,14],dossierIcones + "fr/interpo_lissagea.png");
        boutonLissageA.onClick = lissageA;
        boutonLissageA.helpTip = "Lissage à l'approche";
		var boutonLissageE = panointerpo.add("iconbutton",[110,2,122,14],dossierIcones + "fr/interpo_lissagee.png");
        boutonLissageE.onClick = lissageE;
        boutonLissageE.helpTip = "Lissage à l'éloignement";
		var boutonLissage = panointerpo.add("iconbutton",[124,2,136,14],dossierIcones + "fr/interpo_bezier.png");
        boutonLissage.onClick = lissage;
        boutonLissage.helpTip = "Amorti";
		var boutonContinu = panointerpo.add("iconbutton",[138,2,150,14],dossierIcones + "fr/interpo_continu.png");
        boutonContinu.onClick = continu;
        boutonContinu.helpTip = "Vitesse continue (Bézier Auto)";
		var boutonMaintien = panointerpo.add("iconbutton",[152,2,164,14],dossierIcones + "fr/interpo_maintien.png");
        boutonMaintien.onClick = maintien;
        boutonMaintien.helpTip = "Maintien";
		
		var bouton0 = panointerpo.add("iconbutton",[2,18,22,38],dossierIcones + "fr/interpo_0.png");
        bouton0.onClick = function() {texteInfluence.text = 1;infl(1);};
        bouton0.helpTip = "Influence à 1%";
		var bouton10 = panointerpo.add("iconbutton",[24,18,44,38],dossierIcones + "fr/interpo_10.png");
        bouton10.onClick = function() {texteInfluence.text = 10;infl(10);};
        bouton10.helpTip = "Influence à 10%";
		var bouton25 = panointerpo.add("iconbutton",[46,18,66,38],dossierIcones + "fr/interpo_25.png");
        bouton25.onClick = function() {texteInfluence.text = 25;infl(25);};
        bouton25.helpTip = "Influence à 25%";
		var bouton50 = panointerpo.add("iconbutton",[68,18,88,38],dossierIcones + "fr/interpo_50.png");
        bouton50.onClick = function() {texteInfluence.text = 50;infl(50);};
        bouton50.helpTip = "Influence à 50%";
		var bouton75 = panointerpo.add("iconbutton",[90,18,110,38],dossierIcones + "fr/interpo_75.png");
        bouton75.onClick = function() {texteInfluence.text = 75;infl(75);};
        bouton75.helpTip = "Influence à 75%";
		var bouton90 = panointerpo.add("iconbutton",[112,18,132,38],dossierIcones + "fr/interpo_90.png");
        bouton90.onClick = function() {texteInfluence.text = 90;infl(90);};
        bouton90.helpTip = "Influence à 90%";
		var bouton100 = panointerpo.add("iconbutton",[134,18,154,38],dossierIcones + "fr/interpo_100.png");
        bouton100.onClick = function() {texteInfluence.text = 100;infl(100);};
        bouton100.helpTip = "Influence à 100%";
		var texteInfluence = panointerpo.add("edittext",[156,18,200,38],"-");
        texteInfluence.onChange = function() {infl(eval(texteInfluence.text));};
		var boutonApproche = panointerpo.add("checkbox",[2,40,110,58],traduction(["In","Approche","In"]));
		var boutonEloignement = panointerpo.add("checkbox",[112,40,220,58],traduction(["Out","Eloignement","Out"]));
		boutonApproche.value = true;
		boutonEloignement.value = true;
        boutonApproche.helpTip = traduction(["Ease In influence","Appliquer l'influence à l'approche","Ease In influence"]);
        boutonEloignement.helpTip = traduction(["Ease Out influence","Appliquer l'influence à l'éloignement","Ease Out influence"]);
		boutonApproche.onClick = function() { if (boutonApproche.value == false) boutonEloignement.value = true; };
		boutonEloignement.onClick = function() { if (boutonEloignement.value == false) boutonApproche.value = true; };
		
		var boutonMoprher = panointerpo.add("iconbutton",[5,60,60,80],dossierIcones + "fr/interpo_morph.png");
        boutonMoprher.onClick = morpher;
        boutonMoprher.helpTip = traduction(["Create Morpher","Appliquer le Morpher","Create Morpher"]);
		var boutonMKey = panointerpo.add("checkbox",[65,60,150,80],traduction(["Create Keyframes","Créer les clefs","Create Keyframes"]));
        boutonMKey.value = true;
		}
		
		// PANNEAU ANIMATION -----------------------------------------------
		{
		//bouton wiggle
 		var boutonwiggle = panoanimation.add("iconbutton",[2,2,110,20],dossierIcones + "fr/anim_wiggle.png");
		boutonwiggle.onClick = wiggle;
		boutonwiggle.helpTip = traduction(["Create a wiggle function in a property of the selected layer","Place une expression \"wiggle\" (tremblement) dans une propriété du calque sélectionné","Crear una función wiggle en una propiedad de la capa seleccionada"]);
		//bouton oscillation
		var boutonosc = panoanimation.add("iconbutton",[112,2,220,20],dossierIcones + "fr/anim_osc.png");
		boutonosc.onClick = oscillation;
		boutonosc.helpTip = traduction(["Create an oscillation on the selected property","Crée une oscillation sur la propriété sélectionnée","Create an oscillation on the selected property"]);
		//bouton nframes
		var boutonnframes = panoanimation.add("iconbutton",[2,22,110,40],traduction([dossierIcones + "en/anim_expo.png",dossierIcones + "fr/anim_expo.png",dossierIcones + "en/anim_expo.png"]));
		boutonnframes.onClick = nframes;
		boutonnframes.helpTip = traduction(["Changes the exposure of the animation on the selected property","Change l'exposition de l'anim de la propriété sélectionnée","Changes the exposure of the animation on the selected property"]);
		//bouton path follow
		var boutonpathfollow = panoanimation.add("iconbutton",[112,22,220,40],traduction([dossierIcones + "en/anim_pf.png",dossierIcones + "fr/anim_pf.png",dossierIcones + "en/anim_pf.png"]));
		boutonpathfollow.onClick = pathFollow;
		boutonpathfollow.helpTip = traduction(["Auto orientation of the layer along its path","Orientation auto du calque sur sa trajectoire","Auto orientation of the layer along its path"]);
         //bouton roue
		var boutonroue = panoanimation.add("iconbutton",[2,42,110,60],traduction([dossierIcones + "en/anim_roue.png",dossierIcones + "fr/anim_roue.png",dossierIcones + "es/anim_roue.png"]));
		boutonroue.onClick = creroue;
		boutonroue.helpTip = traduction(["Automates the rotation of a wheel while moving the layer","Automatise la rotation d'une roue lors du déplacement du calque", "Automatiza la rotación de una rueda cuaando movemos la capa"]);
		//bouton spring
		var boutonspring = panoanimation.add("iconbutton",[112,42,220,60],traduction([dossierIcones + "en/anim_reb.png",dossierIcones + "fr/anim_reb.png",dossierIcones + "en/anim_reb.png"]));
		boutonspring.onClick = spring;
		boutonspring.helpTip = traduction(["The property will automatically bounce like a spring","La propriété aura un rebond automatique, comme un ressort","The property will automatically bounce like a spring"]);
        //bouton lien de distance
		var boutondistance = panoanimation.add("iconbutton",[2,62,110,80],traduction([dossierIcones + "en/anim_lien.png",dossierIcones + "fr/anim_lien.png",dossierIcones + "en/anim_lien.png"]));
		boutondistance.onClick = distanceLink;
		boutondistance.helpTip = traduction(["Links an effect with the distance with another layer","Lie un effet à la distance par rapport à un autre calque","Links an effect with the distance with another layer"]);
		//bouton lentille
		var boutonlentille = panoanimation.add("iconbutton",[112,62,220,80],traduction([dossierIcones + "en/anim_lentille.png",dossierIcones + "fr/anim_lentille.png",dossierIcones + "es/anim_lentille.png"]));
		boutonlentille.onClick = lentille;
		boutonlentille.helpTip = traduction(["Creates a lens flare with selected layers","Crée une lumière parasite avec les calques sélectionnés","Crea un destello de lente con las capas seleccionadas"]);
		}
		
		
		
		
		//PANNEAU OBJETS ET OUTILS -------------------------------------------
		{
		//bouton pour ajouter un controleur
		var boutoncontroleur = panoobjets.add("iconbutton",[2,2,110,20],traduction([dossierIcones + "en/obj_control.png",dossierIcones + "fr/obj_control.png",dossierIcones + "en/obj_control.png"]));
		boutoncontroleur.onClick = controleur;
		boutoncontroleur.helpTip = traduction(["Creates a null object at the anchor point of the selected layer","Ajoute un objet null au pivot du calque sélectionné","Crea un Objeto Null en el punto de anclaje de la capa seleccionada"]);
		//bouton pour créer des bones
		var boutonbone = panoobjets.add("iconbutton",[112,2,220,20],dossierIcones + "fr/obj_bones.png");
		boutonbone.onClick = bone;
		boutonbone.helpTip = traduction(["Creates a bone on a corner of a puppet","Crée un bone sur un coin de marionnette","Crea un 'bone' en una esquina de una marioneta"]);
		//bouton zero
		var boutonzero = panoobjets.add("iconbutton",[112,22,220,40],traduction ([dossierIcones + "en/obj_zero.png",dossierIcones + "fr/obj_zero.png",dossierIcones + "en/obj_zero.png"]));
		boutonzero.onClick = zero;
		boutonzero.helpTip = traduction(["Creates a \"Zero\" object on a layer","Crée un objet zéro sur un calque","Creates a \"Zero\" object on a layer"]);
		//bouton mesurer
		var boutonmesurer = panoobjets.add("iconbutton",[2,22,110,40],traduction ([dossierIcones + "en/obj_mesurer.png",dossierIcones + "fr/obj_mesurer.png",dossierIcones + "en/obj_mesurer.png"]));
		boutonmesurer.onClick = mesure;
		boutonmesurer.helpTip = traduction(["Measure distance between two layers","Mesure la distance entre deux calques","Measure distance between two layers"]);
		//bouton renommer
		var boutonrename = panoobjets.add("iconbutton",[2,42,110,60],traduction ([dossierIcones + "en/obj_renommer.png",dossierIcones + "fr/obj_renommer.png",dossierIcones + "en/obj_renommer.png"]));
		boutonrename.onClick = function() {fenetrerename.show();}
		boutonrename.helpTip = traduction(["Rename layers","Renommer des calques","Rename layers"]);
		//bouton liens
		var boutonliens = panoobjets.add("iconbutton",[112,42,220,60],traduction([dossierIcones + "en/obj_liens.png",dossierIcones + "fr/obj_liens.png",dossierIcones + "en/obj_liens.png"]));
		boutonliens.onClick = liens;
		boutonliens.helpTip = traduction(["Show parent links in a simple tree view","Voir les liens de parentés dans une arborescence simple","Show parent links in a simple tree view"]);	
		}
	
		//PANNEAU CAMERAS -------------------------------------------
		{
 		//bouton pour créer une target cam
		var boutontcam = panocam.add("iconbutton",[2,2,110,20],traduction([dossierIcones + "en/cam_ctrl.png",dossierIcones + "fr/cam_ctrl.png",dossierIcones + "es/cam_ctrl.png"]));
		boutontcam.onClick = controlcam;
		boutontcam.helpTip = traduction(["Creates animation controllers for a camera","Crée des contrôleurs pour une caméra","Crea controladores de animación para una cámara"]);
		//bouton pour créer une cam relief
		var boutontcamrelief = panocam.add("iconbutton",[112,2,220,20],traduction([dossierIcones + "en/cam_3d.png",dossierIcones + "fr/cam_3d.png",dossierIcones + "es/cam_3d.png"]));
		boutontcamrelief.onClick = camrelief;
		boutontcamrelief.helpTip = traduction(["Create controllers for a 3D Camera","Crée des contrôleurs pour une caméra relief","Crea controladores para una cámara 3D"]);
		}
	
        //calculatrice
		var textecalc = panocalc.add ("edittext", [2,2,220,25]);
		textecalc.onChange = calc;
		var resultatcalc1 = panocalc.add("statictext",[2,30,220,50],"");
		var resultatcalc2 = panocalc.add("statictext",[2,52,220,70],"0");
        
        //bloc notes
        var textenotes = panonotes.add ("edittext", [2,2,220,78],"",{multiline: true});
        textenotes.helpTip = traduction(["New line : CTRL + Enter","Pour aller à la ligne : CTRL + entrée","New line : CTRL + Enter"]);
        textenotes.text = app.settings.getSetting("duik","notes");
        textenotes.onChange = function () { app.settings.saveSetting("duik","notes",textenotes.text); };

        
		}


		if (app.settings.getSetting("duik", "version") == "oui" && app.preferences.getPrefAsLong("Main Pref Section","Pref_SCRIPTING_FILE_NETWORK_SECURITY") == 1) MAJ(version);
		return palette;
	}

	
	
	var duikTest = new File($.fileName);
	var folderTest = new Folder(duikTest.parent.parent.absoluteURI  + "/Duik Icons/");


    var laPalette = null;
    
	if (folderTest.exists) {
		if (app.preferences.getPrefAsLong("Main Pref Section","Pref_SCRIPTING_FILE_NETWORK_SECURITY") == 1)  laPalette = IKtools(this);
		else {
			app.settings.saveSetting("duik","version","non");
			laPalette = IKtools(this);
			}
	} else alert( traduction(["\"Duik Icons\" folder is missing in \"" + duikTest.parent.parent.fsName + "\r\n\r\nYou can find this folder in the zip archive you've downloaded from Duik's website","Il manque le dossier des icônes \"Duik Icons\" dans \"" + duikTest.parent.parent.fsName + "\r\n\r\nVous trouverez ce dossier dans l'archive que vous avez téléchargée sur le site de Duik","\"Duik Icons\" folder is missing in \"" + duikTest.parent.parent.fsName + "\r\n\r\nYou can find this folder in the zip archive you've downloaded from Duik's website"]));

        if (laPalette != null && laPalette instanceof Window) {      
        laPalette.show();
    }

