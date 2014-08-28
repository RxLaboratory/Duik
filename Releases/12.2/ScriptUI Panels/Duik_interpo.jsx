/*
	

Duik
Copyright (c) 2008 - 2011 Nicolas Dufresne
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






function traduction(Tableau) {
	if (app.settings.getSetting("duik", "lang") == Language.FRENCH) return Tableau[1];
	else if (app.settings.getSetting("duik", "lang") == Language.ENGLISH) return Tableau[0];
	else if (app.settings.getSetting("duik", "lang") == Language.SPANISH) return Tableau[2];
	else return Tableau[0];
	}

function Interpo(thisObj){

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
         if (effet.canSetExpression) {
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


var dossierIcones = Folder.current.parent.absoluteURI  + "/Duik Icons/";


//fenètre outil interpo
	{
		var interpoFenetre = (thisObj instanceof Panel) ? thisObj : new Window("palette","Interpolations");
		panneauInterpo = interpoFenetre.add("panel",[2,2,220,44],traduction(["Keyframes","Types de clefs","Keyframes"]));
		var boutonLineaire = panneauInterpo.add("iconbutton",[5,8,25,28],dossierIcones + "fr/interpo_lineaire.png");
        boutonLineaire.onClick = lineaire;
        boutonLineaire.helpTip = "Interpolation Linéaire";
		var boutonLissageA = panneauInterpo.add("iconbutton",[30,8,50,28],dossierIcones + "fr/interpo_lissagea.png");
        boutonLissageA.onClick = lissageA;
        boutonLissageA.helpTip = "Lissage à l'approche";
		var boutonLissageE = panneauInterpo.add("iconbutton",[55,8,75,28],dossierIcones + "fr/interpo_lissagee.png");
        boutonLissageE.onClick = lissageE;
        boutonLissageE.helpTip = "Lissage à l'éloignement";
		var boutonLissage = panneauInterpo.add("iconbutton",[80,8,100,28],dossierIcones + "fr/interpo_bezier.png");
        boutonLissage.onClick = lissage;
        boutonLissage.helpTip = "Amorti";
		var boutonContinu = panneauInterpo.add("iconbutton",[105,8,125,28],dossierIcones + "fr/interpo_continu.png");
        boutonContinu.onClick = continu;
        boutonContinu.helpTip = "Vitesse continue (Bézier Auto)";
		var boutonMaintien = panneauInterpo.add("iconbutton",[130,8,150,28],dossierIcones + "fr/interpo_maintien.png");
        boutonMaintien.onClick = maintien;
        boutonMaintien.helpTip = "Maintien";
		panneauInfluence = interpoFenetre.add("panel",[2,46,220,113],traduction(["Influences","Influences","Influences"]));
		var bouton0 = panneauInfluence.add("iconbutton",[5,8,25,28],dossierIcones + "fr/interpo_0.png");
        bouton0.onClick = function() {texteInfluence.text = 1;infl(1);};
        bouton0.helpTip = "Influence à 1%";
		var bouton10 = panneauInfluence.add("iconbutton",[30,8,50,28],dossierIcones + "fr/interpo_10.png");
        bouton10.onClick = function() {texteInfluence.text = 10;infl(10);};
        bouton10.helpTip = "Influence à 10%";
		var bouton25 = panneauInfluence.add("iconbutton",[55,8,75,28],dossierIcones + "fr/interpo_25.png");
        bouton25.onClick = function() {texteInfluence.text = 25;infl(25);};
        bouton25.helpTip = "Influence à 25%";
		var bouton50 = panneauInfluence.add("iconbutton",[80,8,100,28],dossierIcones + "fr/interpo_50.png");
        bouton50.onClick = function() {texteInfluence.text = 50;infl(50);};
        bouton50.helpTip = "Influence à 50%";
		var bouton75 = panneauInfluence.add("iconbutton",[105,8,125,28],dossierIcones + "fr/interpo_75.png");
        bouton75.onClick = function() {texteInfluence.text = 75;infl(75);};
        bouton75.helpTip = "Influence à 75%";
		var bouton90 = panneauInfluence.add("iconbutton",[130,8,150,28],dossierIcones + "fr/interpo_90.png");
        bouton90.onClick = function() {texteInfluence.text = 90;infl(90);};
        bouton90.helpTip = "Influence à 90%";
		var bouton100 = panneauInfluence.add("iconbutton",[155,8,175,28],dossierIcones + "fr/interpo_100.png");
        bouton100.onClick = function() {texteInfluence.text = 100;infl(100);};
        bouton100.helpTip = "Influence à 100%";
		var texteInfluence = panneauInfluence.add("edittext",[180,8,210,28],"-");
        texteInfluence.onChange = function() {infl(eval(texteInfluence.text));};
		var boutonApproche = panneauInfluence.add("checkbox",[5,33,100,58],traduction(["In","Approche","In"]));
		var boutonEloignement = panneauInfluence.add("checkbox",[105,33,210,58],traduction(["Out","Eloignement","Out"]));
		boutonApproche.value = true;
		boutonEloignement.value = true;
        boutonApproche.helpTip = traduction(["Ease In influence","Appliquer l'influence à l'approche","Ease In influence"]);
        boutonEloignement.helpTip = traduction(["Ease Out influence","Appliquer l'influence à l'éloignement","Ease Out influence"]);
		boutonApproche.onClick = function() { if (boutonApproche.value == false) boutonEloignement.value = true; };
		boutonEloignement.onClick = function() { if (boutonEloignement.value == false) boutonApproche.value = true; };
		panneauMorpher = interpoFenetre.add("panel",[2,118,220,163],"Morpher");
		var boutonMoprher = panneauMorpher.add("iconbutton",[5,8,60,28],dossierIcones + "fr/interpo_morph.png");
        boutonMoprher.onClick = morpher;
        boutonMoprher.helpTip = traduction(["Create Morpher","Appliquer le Morpher","Create Morpher"]);
		var boutonMKey = panneauMorpher.add("checkbox",[65,8,150,28],traduction(["Create Keyframes","Créer les clefs","Create Keyframes"]));
        boutonMKey.value = true;
		}


		
		
		
		
}		
		var folderTest = new Folder(Folder.current.parent.absoluteURI  + "/Duik Icons/");
		if (folderTest.exists)  Interpo(this);
		else alert( traduction(["\"Duik Icons\" folder is missing in \"" + Folder.current.parent.fsName + "/Scripts/" + "\r\n\r\nYou can find this folder in the zip archive you've downloaded from Duik's website","Il manque le dossier des icônes \"Duik Icons\" dans \"" + Folder.current.parent.fsName + "\\Scripts\"" + "\r\n\r\nVous trouverez ce dossier dans l'archive que vous avez téléchargée sur le site de Duik","\"Duik Icons\" folder is missing in \"" + Folder.current.parent.fsName + "\\Scripts\"" + "\r\n\r\nYou can find this folder in the zip archive you've downloaded from Duik's website"]));