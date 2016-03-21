/*

SCRIPT NAME
Copyright (c) 2011
DESCRIPTION

*/ 

#include "libduik.jsxinc"

//encapsulate the script in a function to avoid global variables
(function (thisObj) {
	 
    //================
    var version = '00';
    //================
	
	// ================ ADD FUNCTIONS HERE =============
	{
		function boneClicked()
		{
			var comp = app.project.activeItem;
			if (!(comp instanceof CompItem)) return;
			app.beginUndoGroup("Duik - Bones");
			if (comp.selectedLayers.length)	addBones(comp.selectedLayers);
			else
			{
				num = parseInt(count.text);
				var spacing = comp.width/(num+1);
				var prevBone = null;
				var color = Duik.utils.randomColor();
				
				for (var i = 0 ; i < num ; i++)
				{
					var bone = addBone(comp,undefined,color);
					bone.name = "Bone " + (i+1);
					if (prevBone)
					{
						bone.parent = prevBone;
						bone.transform.position.setValue([spacing,0]);
					}
					else
					{
						bone.transform.position.setValue([spacing,comp.height/2]);
					}
					prevBone = bone;
				}
			}
			app.endUndoGroup();
		}
		
		function addBone(comp,size,color)
		{
			if (!size)
			{
				if (Duik.settings.boneSizeAuto)
				{
					size = app.project.activeItem.height/2 + app.project.activeItem.height/2;

					if (Duik.settings.boneSizeHint == Duik.sizes.SMALL) size = Math.floor(size/14);
					else if (Duik.settings.boneSizeHint == Duik.sizes.MEDIUM) size = Math.floor(size/10);
					else if (Duik.settings.boneSizeHint == Duik.sizes.BIG) size = Math.floor(size/6);
				}
				else size = 100;
				
			}
			
			if (!color)
			{
				color = [1,3.764,3.764,1];
			}
			
			//======= NEW ======= CREATE BONE USING SHAPE LAYER =======
			var bone = comp.layers.addShape();
			//size effect
			var sizeEffect = bone.Effects.addProperty('ADBE Slider Control');
			sizeEffect.name = "Display Size";
			sizeEffect(1).setValue(size);
			//bone group
			var boneGroup = bone("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
			boneGroup.name = "Bone";
			boneGroup("ADBE Vector Transform Group")("ADBE Vector Scale").expression = "//Duik.bone\nvar s = effect('Display Size')(1);\n[s,s];";
			//target group
			var targetGroup = boneGroup("ADBE Vectors Group").addProperty("ADBE Vector Group");
			targetGroup.name = "Target";
			var targetGroupContent = targetGroup.property("ADBE Vectors Group");
			var ellipse = targetGroupContent.addProperty("ADBE Vector Shape - Ellipse");
			ellipse("ADBE Vector Ellipse Size").setValue([15,15]);
			var ellipse2 = targetGroupContent.addProperty("ADBE Vector Shape - Ellipse");
			ellipse2("ADBE Vector Ellipse Size").setValue([1,1]);
			var targetStroke = targetGroupContent.addProperty("ADBE Vector Graphic - Stroke");
			targetStroke("ADBE Vector Stroke Color").setValue([0.1,0.1,0.1,1]);
			targetStroke("ADBE Vector Stroke Width").setValue(2);
			//end group
			var endGroup = boneGroup("ADBE Vectors Group").addProperty("ADBE Vector Group");
			endGroup.name = "End";
			var endGroupContent = endGroup.property("ADBE Vectors Group");
			var rectangle = endGroupContent.addProperty("ADBE Vector Shape - Rect");
			rectangle("ADBE Vector Rect Size").setValue([24.5,24.5]);
			endFill = endGroupContent.addProperty("ADBE Vector Graphic - Fill");
			endFill("ADBE Vector Fill Color").setValue(color);
			endGroup.property("ADBE Vector Transform Group").property("ADBE Vector Rotation").setValue(45);
			//stretchbone group
			var stretchBoneGroup = boneGroup("ADBE Vectors Group").addProperty("ADBE Vector Group");
			stretchBoneGroup.name = "Stretch Bone";
			var stretchBoneContent = stretchBoneGroup.property("ADBE Vectors Group");
			var star = stretchBoneContent.addProperty("ADBE Vector Shape - Star");
			star("ADBE Vector Star Type").setValue(2);
			star("ADBE Vector Star Points").setValue(3);
			star("ADBE Vector Star Outer Radius").setValue(20);
			stretchBoneFill = stretchBoneContent.addProperty("ADBE Vector Graphic - Fill");
			stretchBoneFill("ADBE Vector Fill Color").setValue(color);
			stretchBoneGroup.property("ADBE Vector Transform Group").property("ADBE Vector Anchor").setValue([0,10]);
			
			var scaExpr = "//Duik.bone\n" + 
							"var X = 100;\n" + 
							"var Y = 60;\n" + 
							"var child = null;\n" + 
							"if (index > 1) if (thisComp.layer(index-1).hasParent) if (thisComp.layer(index-1).parent.index == index) child = thisComp.layer(index-1);\n" + 
							"if (index < thisComp.numLayers) if (thisComp.layer(index+1).hasParent) if (thisComp.layer(index+1).parent.index == index) child = thisComp.layer(index+1);\n" + 
							"if (!child)\n" + 
							"{\n" + 
							"for (var i = thisComp.numLayers  ; i > 0 ; i--)\n" + 
							"{\n" + 
							"if (thisComp.layer(i).hasParent) if (thisComp.layer(i).parent.index == thisLayer.index)\n" + 
							"{\n" + 
							"child = thisComp.layer(i);\n" + 
							"break;\n" + 
							"}\n" + 
							"}\n" + 
							"}\n" + 
							"if (child)\n" + 
							"{\n" + 
							"var A = child.toWorld(child.anchorPoint);\n" + 
							"var B = thisLayer.toWorld(thisLayer.anchorPoint);\n" + 
							"var dist = length(A,B);\n" + 
							"Y = dist/30*100;\n" + 
							"}\n" + 
							"[X,Y*100/content('Bone').transform.scale[1]];";

			stretchBoneGroup.property("ADBE Vector Transform Group").property("ADBE Vector Scale").expression = scaExpr;


			
			var rotExpr = "//Duik.bone\n" + 
						"var R = 45;\n" + 
						"var child = null;\n" + 
						"if (index > 1) if (thisComp.layer(index-1).hasParent) if (thisComp.layer(index-1).parent.index == index) child = thisComp.layer(index-1);\n" + 
						"if (index < thisComp.numLayers) if (thisComp.layer(index+1).hasParent) if (thisComp.layer(index+1).parent.index == index) child = thisComp.layer(index+1);\n" + 
						"if (!child)\n" + 
						"{\n" + 
						"for (var i = thisComp.numLayers  ; i > 0 ; i--)\n" + 
						"{\n" + 
						"if (thisComp.layer(i).hasParent) if (thisComp.layer(i).parent.index == thisLayer.index)\n" + 
						"{\n" + 
						"child = thisComp.layer(i);\n" + 
						"break;\n" + 
						"}\n" + 
						"}\n" + 
						"}\n" + 
						"if (child)\n" + 
						"{\n" + 
						"C = child.toWorld(child.anchorPoint);\n" + 
						"O =  thisLayer.toWorld(thisLayer.anchorPoint);\n" + 
						"angle = lookAt(C,O);\n" + 
						"angle[0] > 0 ? R = angle[0]+angle[1] : R = angle[0]-angle[1];\n" + 
						"if (angle[1]==-90 || angle[1]==90) result-=90;\n" + 
						"if (R != 90) R = R + 90 - thisLayer.rotation;\n" + 
						"var l = thisLayer;\n" + 
						"while (l.hasParent)\n" + 
						"{\n" + 
						"l = l.parent;\n" + 
						"R = R-l.rotation;\n" + 
						"}\n" + 
						"}\n" + 
						"R;";
						
			boneGroup.property("ADBE Vector Transform Group").property("ADBE Vector Rotation").expression = rotExpr;
			
			//group
			Duik.utils.addLayerToDuGroup(bone,Duik.uiStrings.bones);
			
			return bone;
		}
		
		function addBones(layers,placement)
		{
			if (placement == undefined) placement = Duik.settings.bonePlacement;
			var createdBones = [];
			
			if (layers.length == 0)
			{
				return createdBones;
			}

			//check names
			Duik.utils.checkNames(layers[0].containingComp);

			for (var i=0;i<layers.length;i++)
			{
				var calque = Duik.utils.getItem(layers,i);
				// les proprietes selectionnees
				var props = calque.selectedProperties;
				var coins = [];
				//get puppet pins
				if (props.length > 0)
				{
					for (var j=0;j<props.length;j++)
					{
						if (props[j].matchName == "ADBE FreePin3 PosPin Atom") coins.push(props[j]);
					}
				}
				//if no pins were found, use every selected spatial properties
				if (!coins.length && props.length > 0)
				{
					for (var j=0;j<props.length;j++)
					{
						if (props[j].propertyType == PropertyType.PROPERTY)
						{
							if (props[j].propertyValueType == PropertyValueType.TwoD_SPATIAL || props[j].propertyValueType == PropertyValueType.ThreeD_SPATIAL)
							{
								if (props[j].canSetExpression) coins.push(props[j]);
							}
						}
					}
				}
				//si il n'y a pas de coins selectionnes, on les prend tous
				if (!coins.length) coins = Duik.utils.getPuppetPins(calque("Effects"));
				//si on a vraiment rien trouve, on laisse tomber
				if (!coins.length) throw "Please select a spatial property to link it to a bone.\nYou cannot link a non-spatial property to a bone\nIt must have two or three dimensions.";

				//create bones
				var color = Duik.utils.randomColor();
				for (var j=0;j<coins.length;j++)
				{
					var coin = coins[j];

					var position;

					if (coin.matchName == "ADBE FreePin3 PosPin Atom")
					{
						position = coin.position;
					}
					else
					{
						position = coin;
					}
					
					//sa taille
					boneTaille = Duik.settings.boneSize;
					if (Duik.settings.boneSizeAuto)
					{
						if (calque instanceof ShapeLayer)
						{
							boneTaille = app.project.activeItem.height/2 + app.project.activeItem.height/2;
						}
						else
						{
							var calqueParent = calque.parent;
							calque.parent = null;
							var calqueEchelle = calque.transform.scale.value;
							calque.parent = calqueParent;
							boneTaille = calque.source.width*Math.abs(calqueEchelle[0])/130 + calque.source.height*Math.abs(calqueEchelle[1])/130;
						}

						if (Duik.settings.boneSizeHint == Duik.sizes.SMALL) boneTaille = Math.floor(boneTaille/14);
						else if (Duik.settings.boneSizeHint == Duik.sizes.MEDIUM) boneTaille = Math.floor(boneTaille/10);
						else if (Duik.settings.boneSizeHint == Duik.sizes.BIG) boneTaille = Math.floor(boneTaille/6);
					}
					
					//add bone
					var bone = addBone(calque.containingComp,boneTaille,color);
					
					if (placement == Duik.placement.OVER_LAYER) bone.moveBefore(calque);
					else if (placement == Duik.placement.UNDER_LAYER) bone.moveAfter(calque);
					else if (placement == Duik.placement.BOTTOM) bone.moveToEnd();


					createdBones.push(bone);

					//mettre le bone a la position du coin : utiliser une expression pour avoir la position en mode world du coin
					Duik.utils.pickWhip(bone.position,position);
					if (!(calque instanceof ShapeLayer))
					{
					bone.position.expression = "thisComp.layer(\"" + calque.name + "\").toWorld(" + bone.position.expression + ")";
					}

					bone.position.setValue(bone.position.value);
					bone.position.expression = "";
					//nom du bone
					if (coin.matchName == "ADBE FreePin3 PosPin Atom")
					{
					bone.name = "B_" + coin.name;
					}
					else
					{
					var name = "B_" + coin.name + "_" + coin.parentProperty.name;
					if (name.length > 32) name = name.substr(0,32);
					bone.name = name;
					}

					bone.guideLayer = true;
					//mettre l'expression dans le coin
					if (calque instanceof ShapeLayer)
					{
					position.expression = "bonePos = thisComp.layer(\"" + bone.name + "\").toWorld(thisComp.layer(\"" + bone.name + "\").anchorPoint)";
					}
					else
					{
					position.expression = "bonePos = thisComp.layer(\"" + bone.name + "\").toWorld(thisComp.layer(\"" + bone.name + "\").anchorPoint);\nfromWorld(bonePos)";
					}
				}//for coins
			}//for layers
			
			//linking
			for (var i = 0 ; i < createdBones.length-1 ; i++)
			{
				createdBones[i].parent = createdBones[i+1];
			}
			return createdBones;
		}
	}
	//==================================================
	
	// _______ UI SETUP _______
	{
		// if the script is a Panel, (launched from the 'Window' menu), use it,
		// else (launched via 'File/Scripts/Run script...') create a new window
		// store it in the variable mainPalette
		var mainPalette = thisObj instanceof Panel ? thisObj : new Window('palette','myScriptName',undefined, {resizeable:true});

		//stop if there's no window
		if (mainPalette == null) return;
		   
		// set margins and alignment
		mainPalette.alignChildren = ['fill','fill'];
		mainPalette.margins = 5;
		mainPalette.spacing = 2;
		mainPalette.orientation = 'row';
	}
	//__________________________


	// ============ ADD UI CONTENT HERE =================
	{
		var bone = mainPalette.add('button',undefined,"Bones");
		bone.onClick = boneClicked;
		var count = mainPalette.add('edittext',undefined,'3');
		count.alignment = ['right','fill'];
		count.minimumSize = [25,25];
	}
	// ==================================================
    
	//__________ SHOW UI ___________
	{
		// Set layout, and resize it on resize of the Panel/Window
		mainPalette.layout.layout(true);
		mainPalette.layout.resize();
		mainPalette.onResizing = mainPalette.onResize = function () {mainPalette.layout.resize();}
		//if the script is not a Panel (launched from 'File/Scripts/Run script...') we need to show it
		if (!(mainPalette instanceof Panel)) mainPalette.show();
	}
	//______________________________
	
})(this);