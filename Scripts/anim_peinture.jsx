
//  début de groupe d'annulation
			app.beginUndoGroup("Anim peinture");
            
            var deb = app.project.activeItem.workAreaStart;

for (x=0;x<app.project.activeItem.selectedLayers.length;x++)
{

var layer = app.project.activeItem.selectedLayers[x];
var peinture = layer.effect(1).name;



//ajouter le curseur et ses clefs
curseur = layer.Effects.addProperty("ADBE Slider Control");
curseur.name = "Anim peinture in";
curseur(1).setValueAtTime(deb,0);
curseur(1).setValueAtTime(deb+1,25);
curseurD = layer.Effects.addProperty("ADBE Slider Control");
curseurD.name = "Anim peinture out";
curseurD(1).setValueAtTime(deb+1,0);
curseurD(1).setValueAtTime(deb+2,25);

//ajouter le curseur diametre
curseur = layer.Effects.addProperty("ADBE Slider Control");
curseur.name = "Diametre";

//compter les coups de pinceaux
var nbre = layer.effect(1).property(2).numProperties;
var dureeI = 1/nbre;
//ajouter les clefs
for (i=1;i<=nbre;i++)
{
    var prop = layer.effect(1).property(2).property(i).property(4).property(2);
    prop.setValueAtTime(1-dureeI*(i-1),100);
    prop.setValueAtTime(1-dureeI*i,0);
    prop.expression = "valueAtTime((thisLayer.effect(\"Anim peinture in\")(1)-thisComp.displayStartTime/thisComp.frameDuration)*thisComp.frameDuration)";
    var propD = layer.effect(1).property(2).property(i).property(4).property(1);
    propD.setValueAtTime(1-dureeI*(i-1),100);
    propD.setValueAtTime(1-dureeI*(i),0);
    propD.expression = "valueAtTime((thisLayer.effect(\"Anim peinture out\")(1)-thisComp.displayStartTime/thisComp.frameDuration)*thisComp.frameDuration)";
     var diam = layer.effect(1).property(2).property(i).property(4).property(4);
    diam.expression = "effect(\"Diametre\")(1) + value;";
}

}
	//fin du groupe d'annulation
			
			app.endUndoGroup();