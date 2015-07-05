function plantigradeBackLeg(femur,tibia,tarsus,claws,tiptoe,heel) {
    
    //unparent
    if (femur) femur.parent = null;
    if (tibia) tibia.parent = null;
    if (tarsus) tarsus.parent = null;
    if (claws) claws.parent = null;
    if (tiptoe) tiptoe.parent = null;
    if (heel) heel.parent = null;
    
    //checks
    if (claws && !femur) return null;
    if (claws && !tibia) return null;
    if ( !tarsus) return null;
    
    //add nulls and controllers
    var clawsNull, footNull;
    if (claws)
    {
        //claws
        clawsNull = Duik.utils.addNullOnLayer(claws);
        clawsNull.name = "IK " + claws.name
        
        var footSize = claws.transform.position.value[0] - tarsus.transform.position.value[0];
        //tiptoe
        if (!tiptoe)
        {
            tiptoe = Duik.utils.addNullOnLayer(claws);
            tiptoe.name = "IK tiptoe " + claws.name
            tiptoe.transform.position.setValue([clawsNull.transform.position.value[0] + footSize,clawsNull.transform.position.value[1]]);
        }
    
        if (!heel)
        {
            heel = Duik.utils.addNullOnLayer(claws);
            heel.name = "IK heel " + tarsus.name
            heel.transform.position.setValue([tarsus.transform.position.value[0],clawsNull.transform.position.value[1]]);
        }
        
        //foot
        footNull = Duik.utils.addNullOnLayer(tarsus);
        footNull.name = "IK  " + tarsus.name;
        
        if (footSize > 0) clockwise = true;
    }
   //Controller
    var ctrl = Duik.addController(tarsus,true,true,true,true,false);
     Duik.addZero(ctrl.layer);
    
    //parent
    if (claws) claws.parent = tarsus;
    if (tibia) {
        tarsus.parent = tibia;
        if (femur) tibia.parent = femur;
        }
   else if (femur) tarsus.parent = femur;
   if (claws) {
       footNull.parent = clawsNull;
       clawsNull.parent = tiptoe;
       tiptoe.parent = heel;
       heel.parent = ctrl.layer;
   }


    
    //IKs
    if (claws) {
        //claws
        Duik.autoIK([claws,tiptoe]);
        //leg
        Duik.autoIK([tarsus,tibia,femur,footNull]);
        //foot
        Duik.autoIK([tarsus,clawsNull]);
        }
    else {
        if (femur && tibia) Duik.autoIK([tarsus,tibia,femur,ctrl.layer]);
        else if (tibia) Duik.autoIK([tarsus,tibia,ctrl.layer]);
        else if (femur) Duik.autoIK([tarsus,femur,ctrl.layer]);
        }
    
    //Controls
    if (claws) {
        //add an IK effect on the controller
        var ikCtrl = Duik.utils.addEffect(ctrl.layer,"DUIK_Two_Layer_IK");
        //the effect on the null of the foot
        var ikEffect = footNull.effect("PSEUDO/DUIK_Two_Layer_IK");
        ikCtrl.name = ikEffect.name;
        //link the properties
        Duik.utils.linkProperties(ikEffect,ikCtrl);
        
        //tiptoe, heel and footroll
        var footCtrl = Duik.utils.addEffect(ctrl.layer,"DUIK_Foot_Roll");
        footCtrl.name = tarsus.name + " Foot roll";
        tiptoe.transform.rotation.expression = "//Duik.footRoll\nthisComp.layer(\"" + ctrl.layer.name + "\").effect(\"" + footCtrl.name + "\")(1);";
        heel.transform.rotation.expression = "//Duik.footRoll\n" + 
                                                                "var ctrl = thisComp.layer(\"" + ctrl.layer.name + "\").effect(\"" + footCtrl.name + "\")(2);\n" + 
                                                                "var roll = thisComp.layer(\"" + ctrl.layer.name + "\").effect(\"" + footCtrl.name + "\")(3);\n" + 
                                                                "roll > 0 ? roll+ctrl : ctrl;";
        clawsNull.transform.rotation.expression = "//Duik.footRoll\n" + 
                                                                    "var ctrl = thisComp.layer(\"" + ctrl.layer.name + "\").effect(\"" + footCtrl.name + "\")(3);\n" + 
                                                                    "ctrl < 0 ? ctrl : 0;";
        }
    
    //hide and lock
    if (claws){
        tiptoe.enabled = false;
        tiptoe.shy = true;
        tiptoe.locked = true;
        heel.enabled = false;
        heel.shy = true;
        heel.locked = true;
        clawsNull.enabled = false;
        clawsNull.shy = true;
        clawsNull.locked = true;
        footNull.enabled = false;
        footNull.shy = true;
        footNull.locked = true;
        }
    
    //select controller
    Duik.utils.deselectLayers();
    ctrl.layer.selected = true;
    return ctrl;
}

function digitigradeBackLeg(femur,tibia,tarsus,claws,tiptoe) {
    
    //unparent
    if (femur) femur.parent = null;
    if (tibia) tibia.parent = null;
    if (tarsus) tarsus.parent = null;
    if (claws) claws.parent = null;
    if (tiptoe) tiptoe.parent = null;
    
    //checks
    if (claws && !femur) return null;
    if (claws && !tibia) return null;
    if ( !tarsus) return null;
    
    //add nulls and controllers
    var clawsNull, footNull;
    if (claws)
    {
        //claws
        clawsNull = Duik.utils.addNullOnLayer(claws);
        clawsNull.name = "IK " + claws.name
        
        var footSize = claws.transform.position.value[0] - tarsus.transform.position.value[0];
        //tiptoe
        if (!tiptoe)
        {
            tiptoe = Duik.utils.addNullOnLayer(claws);
            tiptoe.name = "IK tiptoe " + claws.name
            tiptoe.transform.position.setValue([clawsNull.transform.position.value[0] + footSize,clawsNull.transform.position.value[1]]);
        }
            
        //foot
        footNull = Duik.utils.addNullOnLayer(tarsus);
        footNull.name = "IK  " + tarsus.name;
        
        if (footSize > 0) clockwise = true;
    }
   //Controller
    var ctrl = Duik.addController(tarsus,true,true,true,true,false);
     Duik.addZero(ctrl.layer);
    
    //parent
    if (claws) claws.parent = tarsus;
    if (tibia) {
        tarsus.parent = tibia;
        if (femur) tibia.parent = femur;
        }
   else if (femur) tarsus.parent = femur;
   if (claws) {
       footNull.parent = clawsNull;
       clawsNull.parent = tiptoe;
       tiptoe.parent = ctrl.layer
   }


    
    //IKs
    if (claws) {
        //claws
        Duik.autoIK([claws,tiptoe]);
        //leg
        Duik.autoIK([tarsus,tibia,femur,footNull]);
        //foot
        Duik.autoIK([tarsus,clawsNull]);
        }
    else {
        if (femur && tibia) Duik.autoIK([tarsus,tibia,femur,ctrl.layer]);
        else if (tibia) Duik.autoIK([tarsus,tibia,ctrl.layer]);
        else if (femur) Duik.autoIK([tarsus,femur,ctrl.layer]);
        }
    
    //Controls
    if (claws) {
        //add an IK effect on the controller
        var ikCtrl = Duik.utils.addEffect(ctrl.layer,"DUIK_Two_Layer_IK");
        //the effect on the null of the foot
        var ikEffect = footNull.effect("PSEUDO/DUIK_Two_Layer_IK");
        ikCtrl.name = ikEffect.name;
        //link the properties
        Duik.utils.linkProperties(ikEffect,ikCtrl);
        
        //tiptoe, heel and footroll
        var footCtrl = Duik.utils.addEffect(ctrl.layer,"DUIK_Foot_Roll");
        footCtrl.name = tarsus.name + " Foot roll";
        tiptoe.transform.rotation.expression = "//Duik.footRoll\nthisComp.layer(\"" + ctrl.layer.name + "\").effect(\"" + footCtrl.name + "\")(1);";
        clawsNull.transform.rotation.expression = "//Duik.footRoll\n" + 
                                                                    "var ctrl = thisComp.layer(\"" + ctrl.layer.name + "\").effect(\"" + footCtrl.name + "\")(3);\n" + 
                                                                     "var tiptoe = thisComp.layer(\"" + ctrl.layer.name + "\").effect(\"" + footCtrl.name + "\")(1);\n" + 
                                                                    "ctrl-tiptoe;";
       tiptoe.effect("PSEUDO/DUIK_One_Layer_IK")(3).expression = "//Duik.footRoll\nthisComp.layer(\"" + ctrl.layer.name + "\").effect(\"" + footCtrl.name + "\")(2);";
        }
    
    //hide and lock
    if (claws){
        tiptoe.enabled = false;
        tiptoe.shy = true;
        tiptoe.locked = true;
        clawsNull.enabled = false;
        clawsNull.shy = true;
        clawsNull.locked = true;
        footNull.enabled = false;
        footNull.shy = true;
        footNull.locked = true;
        }
    
    //select controller
    Duik.utils.deselectLayers();
    ctrl.layer.selected = true;
    return ctrl;
}


function ungulateBackLeg(femur,tibia,tarsus,claws) {
    
    //unparent
    if (femur) femur.parent = null;
    if (tibia) tibia.parent = null;
    if (tarsus) tarsus.parent = null;
    if (claws) claws.parent = null;
    
    //checks
    if (claws && !femur) return null;
    if (claws && !tibia) return null;
    if ( !tarsus) return null;
    
   //Controller
   var ctrl;
    if (claws)  ctrl = Duik.addController(claws,true,true,true,true,false);
    else ctrl = Duik.addController(tarsus,true,true,true,true,false);
     Duik.addZero(ctrl.layer);
    
    //parent
    if (claws) claws.parent = tarsus;
    if (tibia) {
        tarsus.parent = tibia;
        if (femur) tibia.parent = femur;
        }
   else if (femur) tarsus.parent = femur;
    
    //IKs
    if (claws) {
        //claws
        Duik.autoIK([claws,tarsus,tibia,ctrl.layer]);
        //leg
        Duik.autoIK([femur,ctrl.layer]);
        }
    else {
        if (femur && tibia) Duik.autoIK([tarsus,tibia,femur,ctrl.layer],clockwise);
        else if (tibia) Duik.autoIK([tarsus,tibia,ctrl.layer]);
        else if (femur) Duik.autoIK([tarsus,femur,ctrl.layer]);
        }
            
    //select controller
    Duik.utils.deselectLayers();
    ctrl.layer.selected = true;
    return ctrl;
}

function plantigradeFrontLeg(shoulder,humerus,radius,carpus,claws,tiptoe,palm) {
    
    //unparent
    if (shoulder) shoulder.parent = null;
    if (humerus)humerus.parent = null;
    if (radius) radius.parent = null;
    if (carpus) carpus.parent = null;
    if (claws) claws.parent = null;
    if (tiptoe) tiptoe.parent = null;
    if (palm) palm.parent = null;
    
    //checks
    if (claws && !humerus) return null;
    if (claws && !radius) return null;
    if ( !carpus) return null;
    
    //add nulls and controllers
    var clawsNull, handNull;
    if (claws)
    {
        //claws
        clawsNull = Duik.utils.addNullOnLayer(claws);
        clawsNull.name = "IK " + claws.name
        
        var handSize = claws.transform.position.value[0] - carpus.transform.position.value[0];
        //tiptoe
        if (!tiptoe)
        {
            tiptoe = Duik.utils.addNullOnLayer(claws);
            tiptoe.name = "IK tiptoe " + claws.name
            tiptoe.transform.position.setValue([clawsNull.transform.position.value[0] + handSize,clawsNull.transform.position.value[1]]);
        }
    
        if (!palm)
        {
            palm = Duik.utils.addNullOnLayer(claws);
            palm.name = "IK heel " + carpus.name
            palm.transform.position.setValue([carpus.transform.position.value[0],clawsNull.transform.position.value[1]]);
        }
        
        //foot
        handNull = Duik.utils.addNullOnLayer(carpus);
        handNull.name = "IK  " + carpus.name;
        
        if (handSize < 0) clockwise = true;
    }
   //Controller
    var ctrl = Duik.addController(carpus,true,true,true,true,false);
    Duik.addZero(ctrl.layer);
    
    //parent
    if (claws) claws.parent = carpus;
    if (radius) {
        carpus.parent = radius;
        if (humerus) radius.parent = humerus;
        }
   else if (humerus) carpus.parent = humerus;
   if (claws) {
       handNull.parent = clawsNull;
       clawsNull.parent = tiptoe;
       tiptoe.parent = palm;
       palm.parent = ctrl.layer;
   }
    if (shoulder) {
        if (humerus) humerus.parent = shoulder;
        else if (radius) radius.parent = shoulder;
        else carpus.parent = shoulder;
        }


    
    //IKs
    if (claws) {
        //claws
        Duik.autoIK([claws,tiptoe]);
        //leg
        Duik.autoIK([carpus,radius,humerus,handNull]);
        //foot
        Duik.autoIK([carpus,clawsNull]);
        }
    else {
        if (humerus && radius) Duik.autoIK([carpus,radius,humerus,ctrl.layer]);
        else if (radius) Duik.autoIK([carpus,radius,ctrl.layer]);
        else if (humerus) Duik.autoIK([carpus,humerus,ctrl.layer]);
        }
    if (shoulder) {
       
        Duik.addZero(shoulder);
        Duik.autoIK([shoulder,ctrl.layer]); 
        var ikShoulderCtrl = ctrl.layer.effect("PSEUDO/DUIK_One_Layer_IK");
        ikShoulderCtrl(1).setValue(50);
        ikShoulderCtrl(3).setValue(-shoulder.transform.rotation.value);
        }
    
    //Controls
    if (claws) {
        //add an IK effect on the controller
        var ikCtrl = Duik.utils.addEffect(ctrl.layer,"DUIK_Two_Layer_IK");
        //the effect on the null of the foot
        var ikEffect = handNull.effect("PSEUDO/DUIK_Two_Layer_IK");
        ikCtrl.name = ikEffect.name;
        //link the properties
        Duik.utils.linkProperties(ikEffect,ikCtrl);
        
        //tiptoe, heel and footroll
        var handCtrl = Duik.utils.addEffect(ctrl.layer,"DUIK_Foot_Roll");
        handCtrl.name = carpus.name + " Foot roll";
        tiptoe.transform.rotation.expression = "//Duik.footRoll\nthisComp.layer(\"" + ctrl.layer.name + "\").effect(\"" + handCtrl.name + "\")(1);";
        palm.transform.rotation.expression = "//Duik.footRoll\n" + 
                                                                "var ctrl = thisComp.layer(\"" + ctrl.layer.name + "\").effect(\"" + handCtrl.name + "\")(2);\n" + 
                                                                "var roll = thisComp.layer(\"" + ctrl.layer.name + "\").effect(\"" + handCtrl.name + "\")(3);\n" + 
                                                                "roll > 0 ? roll+ctrl : ctrl;";
        clawsNull.transform.rotation.expression = "//Duik.footRoll\n" + 
                                                                    "var ctrl = thisComp.layer(\"" + ctrl.layer.name + "\").effect(\"" + handCtrl.name + "\")(3);\n" + 
                                                                    "ctrl < 0 ? ctrl : 0;";
        }
    if (shoulder) {
         var shoulderCtrl = ctrl.layer.effect.addProperty("ADBE Slider Control");
         shoulderCtrl.name = shoulder.name + " auto-position %";
         shoulderCtrl(1).setValue(10);

        //get Ctrl position
        var parent = ctrl.layer.parent;
         ctrl.layer.parent = null;
         var posC = ctrl.layer.transform.position.value;
         ctrl.layer.parent = parent;
         
         //get shoulder position
         parent = shoulder.parent;
         shoulder.parent = null;
         var posS = shoulder.transform.position.value;
         shoulder.parent = parent;
         
         delete parent;
         
         var pos = posS-posC;
         
         shoulder.transform.position.expression = "//Duik.shoulder\n" + 
                                                                    "var w = thisComp.layer(\"" + ctrl.layer.name + "\").effect(\"" + shoulderCtrl.name + "\")(1);\n" + 
                                                                    "var z = thisLayer.parent.toWorld(thisLayer.parent.anchorPoint);\n" + 
                                                                    "var p = thisComp.layer(\"" + ctrl.layer.name + "\").toWorld(thisComp.layer(\"" + ctrl.layer.name + "\").anchorPoint);\n" +
                                                                    "((p-z)+" + pos.toSource() + ")* w/100 + value;";
        }
    
    //hide and lock
    if (claws){
        tiptoe.enabled = false;
        tiptoe.shy = true;
        tiptoe.locked = true;
        palm.enabled = false;
        palm.shy = true;
        palm.locked = true;
        clawsNull.enabled = false;
        clawsNull.shy = true;
        clawsNull.locked = true;
        handNull.enabled = false;
        handNull.shy = true;
        handNull.locked = true;
        }
    
    //select controller
    Duik.utils.deselectLayers();
    ctrl.layer.selected = true;
    return ctrl;
}

function digitigradeFrontLeg(shoulder,humerus,radius,carpus,claws,tiptoe) {
    
    //unparent
    if (shoulder) shoulder.parent = null;
    if (humerus)humerus.parent = null;
    if (radius) radius.parent = null;
    if (carpus) carpus.parent = null;
    if (claws) claws.parent = null;
    if (tiptoe) tiptoe.parent = null;
    
    //checks
    if (claws && !humerus) return null;
    if (claws && !radius) return null;
    if ( !carpus) return null;
    
    //add nulls and controllers
    var clawsNull, handNull;
    if (claws)
    {
        //claws
        clawsNull = Duik.utils.addNullOnLayer(claws);
        clawsNull.name = "IK " + claws.name
        
        var handSize = claws.transform.position.value[0] - carpus.transform.position.value[0];
        //tiptoe
        if (!tiptoe)
        {
            tiptoe = Duik.utils.addNullOnLayer(claws);
            tiptoe.name = "IK tiptoe " + claws.name
            tiptoe.transform.position.setValue([clawsNull.transform.position.value[0] + handSize,clawsNull.transform.position.value[1]]);
        }
            
        //foot
        handNull = Duik.utils.addNullOnLayer(carpus);
        handNull.name = "IK  " + carpus.name;
        
        if (handSize < 0) clockwise = true;
    }
   //Controller
    var ctrl = Duik.addController(carpus,true,true,true,true,false);
    Duik.addZero(ctrl.layer);
    
    //parent
    if (claws) claws.parent = carpus;
    if (radius) {
        carpus.parent = radius;
        if (humerus) radius.parent = humerus;
        }
   else if (humerus) carpus.parent = humerus;
   if (claws) {
       handNull.parent = clawsNull;
       clawsNull.parent = tiptoe;
       tiptoe.parent =  ctrl.layer;
   }
    if (shoulder) {
        if (humerus) humerus.parent = shoulder;
        else if (radius) radius.parent = shoulder;
        else carpus.parent = shoulder;
        }


    
    //IKs
    if (claws) {
        //claws
        Duik.autoIK([claws,tiptoe]);
        //leg
        Duik.autoIK([carpus,radius,humerus,handNull]);
        //foot
        Duik.autoIK([carpus,clawsNull]);
        }
    else {
        if (humerus && radius) Duik.autoIK([carpus,radius,humerus,ctrl.layer]);
        else if (radius) Duik.autoIK([carpus,radius,ctrl.layer]);
        else if (humerus) Duik.autoIK([carpus,humerus,ctrl.layer]);
        }
    if (shoulder) {
       
        Duik.addZero(shoulder);
        Duik.autoIK([shoulder,ctrl.layer]); 
        var ikShoulderCtrl = ctrl.layer.effect("PSEUDO/DUIK_One_Layer_IK");
        ikShoulderCtrl(1).setValue(50);
        ikShoulderCtrl(3).setValue(-shoulder.transform.rotation.value);
        }
    
    //Controls
    if (claws) {
        //add an IK effect on the controller
        var ikCtrl = Duik.utils.addEffect(ctrl.layer,"DUIK_Two_Layer_IK");
        //the effect on the null of the foot
        var ikEffect = handNull.effect("PSEUDO/DUIK_Two_Layer_IK");
        ikCtrl.name = ikEffect.name;
        //link the properties
        Duik.utils.linkProperties(ikEffect,ikCtrl);
        
        //tiptoe, heel and footroll
        var handCtrl = Duik.utils.addEffect(ctrl.layer,"DUIK_Foot_Roll");
        handCtrl.name = carpus.name + " Foot roll";
        tiptoe.transform.rotation.expression = "//Duik.footRoll\nthisComp.layer(\"" + ctrl.layer.name + "\").effect(\"" + handCtrl.name + "\")(1);";
        clawsNull.transform.rotation.expression = "//Duik.footRoll\n" + 
                                                                    "var ctrl = thisComp.layer(\"" + ctrl.layer.name + "\").effect(\"" + handCtrl.name + "\")(3);\n" + 
                                                                     "var tiptoe = thisComp.layer(\"" + ctrl.layer.name + "\").effect(\"" + handCtrl.name + "\")(1);\n" + 
                                                                    "ctrl-tiptoe;";
       tiptoe.effect("PSEUDO/DUIK_One_Layer_IK")(3).expression = "//Duik.footRoll\nthisComp.layer(\"" + ctrl.layer.name + "\").effect(\"" + handCtrl.name + "\")(2);";
        }
    if (shoulder) {
         var shoulderCtrl = ctrl.layer.effect.addProperty("ADBE Slider Control");
         shoulderCtrl.name = shoulder.name + " auto-position %";
         shoulderCtrl(1).setValue(10);

        //get Ctrl position
        var parent = ctrl.layer.parent;
         ctrl.layer.parent = null;
         var posC = ctrl.layer.transform.position.value;
         ctrl.layer.parent = parent;
         
         //get shoulder position
         parent = shoulder.parent;
         shoulder.parent = null;
         var posS = shoulder.transform.position.value;
         shoulder.parent = parent;
         
         delete parent;
         
         var pos = posS-posC;
         
         shoulder.transform.position.expression = "//Duik.shoulder\n" + 
                                                                    "var w = thisComp.layer(\"" + ctrl.layer.name + "\").effect(\"" + shoulderCtrl.name + "\")(1);\n" + 
                                                                    "var z = thisLayer.parent.toWorld(thisLayer.parent.anchorPoint);\n" + 
                                                                    "var p = thisComp.layer(\"" + ctrl.layer.name + "\").toWorld(thisComp.layer(\"" + ctrl.layer.name + "\").anchorPoint);\n" +
                                                                    "((p-z)+" + pos.toSource() + ")* w/100 + value;";
        }
    
    //hide and lock
    if (claws){
        tiptoe.enabled = false;
        tiptoe.shy = true;
        tiptoe.locked = true;
        clawsNull.enabled = false;
        clawsNull.shy = true;
        clawsNull.locked = true;
        handNull.enabled = false;
        handNull.shy = true;
        handNull.locked = true;
        }
    
    //select controller
    Duik.utils.deselectLayers();
    ctrl.layer.selected = true;
    return ctrl;
}



function ungulateFrontLeg(shoulder,humerus,radius,carpus,claws) {
    
    //unparent
     if (shoulder) shoulder.parent = null;
    if (humerus) humerus.parent = null;
    if (radius) radius.parent = null;
    if (carpus) carpus.parent = null;
    if (claws) claws.parent = null;
    
    //checks
    if (claws && !humerus) return null;
    if (claws && !radius) return null;
    if ( !carpus) return null;
    
   //Controller
   var ctrl;
    if (claws)  ctrl = Duik.addController(claws,true,true,true,true,false);
    else ctrl = Duik.addController(carpus,true,true,true,true,false);
     Duik.addZero(ctrl.layer);
    
    //parent
    if (claws) claws.parent = carpus;
    if (radius) {
        carpus.parent = radius;
        if (humerus) radius.parent = humerus;
        }
   else if (humerus) radius.parent = humerus;
    if (shoulder) {
        if (humerus) humerus.parent = shoulder;
        else if (radius) radius.parent = shoulder;
        else carpus.parent = shoulder;
        }

    
    //IKs
    if (claws) {
        //claws
        Duik.autoIK([claws,carpus,radius,ctrl.layer]);
        //leg
        Duik.autoIK([humerus,ctrl.layer]);
        }
    else {
        if (humerus && radius) Duik.autoIK([carpus,radius,humerus,ctrl.layer],clockwise);
        else if (radius) Duik.autoIK([carpus,radius,ctrl.layer]);
        else if (humerus) Duik.autoIK([carpus,humerus,ctrl.layer]);
        }
     if (shoulder) {
       
        Duik.addZero(shoulder);
        Duik.autoIK([shoulder,ctrl.layer]); 
        var ikShoulderCtrl = ctrl.layer.effect(Duik.uiStrings.ik + " "  + shoulder.name);
        ikShoulderCtrl(1).setValue(50);
        ikShoulderCtrl(3).setValue(-shoulder.transform.rotation.value);
        }
    
    //Controls
    if (shoulder) {
     var shoulderCtrl = ctrl.layer.effect.addProperty("ADBE Slider Control");
     shoulderCtrl.name = shoulder.name + " auto-position %";
     shoulderCtrl(1).setValue(10);

    //get Ctrl position
    var parent = ctrl.layer.parent;
     ctrl.layer.parent = null;
     var posC = ctrl.layer.transform.position.value;
     ctrl.layer.parent = parent;
     
     //get shoulder position
     parent = shoulder.parent;
     shoulder.parent = null;
     var posS = shoulder.transform.position.value;
     shoulder.parent = parent;
     
     delete parent;
     
     var pos = posS-posC;
     
     shoulder.transform.position.expression = "//Duik.shoulder\n" + 
                                                                "var w = thisComp.layer(\"" + ctrl.layer.name + "\").effect(\"" + shoulderCtrl.name + "\")(1);\n" + 
                                                                "var z = thisLayer.parent.toWorld(thisLayer.parent.anchorPoint);\n" + 
                                                                "var p = thisComp.layer(\"" + ctrl.layer.name + "\").toWorld(thisComp.layer(\"" + ctrl.layer.name + "\").anchorPoint);\n" +
                                                                "((p-z)+" + pos.toSource() + ")* w/100 + value;";
    }
            
    //select controller
    Duik.utils.deselectLayers();
    ctrl.layer.selected = true;
    return ctrl;
}

app.beginUndoGroup("autorigTest");

var layers = Duik.utils.convertCollectionToArray(app.project.activeItem.layers);
ungulateFrontLeg(layers[4],layers[3],layers[2],layers[1],layers[0]);

app.endUndoGroup();