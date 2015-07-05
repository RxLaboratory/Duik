function plantigradeBackLeg(femur,tibia,tarsus,claws,tiptoe,heel) {
    
    //checks
    if (claws && !femur) return null;
    if (claws && !tibia) return null;
    if ( !tarsus) return null;    
    
    //unparent
    if (tibia && femur) tibia.parent = null;
    if (tarsus && (tibia || femur)) tarsus.parent = null;
    if (claws) claws.parent = null;
    if (tiptoe) tiptoe.parent = null;
    if (heel) heel.parent = null;
    

    
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
    
    //checks
    if (claws && !femur) return null;
    if (claws && !tibia) return null;
    if ( !tarsus) return null;    
    
    //unparent
    if (tibia && femur) tibia.parent = null;
    if (tarsus && (tibia || femur)) tarsus.parent = null;
    if (claws) claws.parent = null;
    if (tiptoe) tiptoe.parent = null;
    
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
    //checks
    if (claws && !femur) return null;
    if (claws && !tibia) return null;
    if ( !tarsus) return null;    
    
    //unparent
    if (tibia && femur) tibia.parent = null;
    if (tarsus && (tibia || femur)) tarsus.parent = null;
    if (claws) claws.parent = null;

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
   
    //checks
    if (claws && !humerus) return null;
    if (claws && !radius) return null;
    if ( !carpus) return null;
    
    
    //unparent
    if (radius && humerus) radius.parent = null;
    if (carpus && (humerus || tibia)) carpus.parent = null;
    if (claws) claws.parent = null;
    if (tiptoe) tiptoe.parent = null;
    if (palm) palm.parent = null;
       
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
   
    //checks
    if (claws && !humerus) return null;
    if (claws && !radius) return null;
    if ( !carpus) return null;
   
    //unparent
    if (radius && humerus) radius.parent = null;
    if (carpus && (humerus || tibia)) carpus.parent = null;
    if (claws) claws.parent = null;
    if (tiptoe) tiptoe.parent = null;
    
   
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
   
    //checks
    if (claws && !humerus) return null;
    if (claws && !radius) return null;
    if ( !carpus) return null;
   
    //unparent
    if (radius && humerus) radius.parent = null;
    if (carpus && (humerus || tibia)) carpus.parent = null;
    if (claws) claws.parent = null;

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
        if (humerus && radius) Duik.autoIK([carpus,radius,humerus,ctrl.layer]);
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


function spine(hips,back,neck,head) {
    if (!head) return null;
    if (!hips && !back) return null;
    
    //unparent
    var hipsParent = null;
    if (hips) { 
        hipsParent = hips.parent;
        hips.parent = null;
        }
    if (back) for (var i in back) back[i].parent = null;
    if (neck) for (var i in neck) neck[i].parent = null;
    if (head) head.parent = null;
    
    var controllers = [];
    
    //controllers
    var hipsCtrl = null;
    var bigHipsCtrl = null;
    var shoulderCtrl = null;
    var headCtrl = null;
    if (hips) {
        bigHipsCtrl = Duik.addController(hips,true,true,true,true,false);
        hipsCtrl = Duik.addController(bigHipsCtrl.layer,true,true,true,true,false);
        bigHipsCtrl.size = bigHipsCtrl.size*1.5;
        bigHipsCtrl.color = bigHipsCtrl.color *0.5;
        bigHipsCtrl.update();

        }
    else if (back) {
        bigHipsCtrl = Duik.addController(back[back.length-1],true,true,true,true,false);
        hipsCtrl = Duik.addController(bigHipsCtrl.layer,true,true,true,true,false);
        bigHipsCtrl.size = bigHipsCtrl.size*1.5;
        bigHipsCtrl.color = bigHipsCtrl.color *0.5;
        bigHipsCtrl.update();
        }
    controllers.push(bigHipsCtrl);
    controllers.push(hipsCtrl);
    if (neck) {
        shoulderCtrl = Duik.addController(neck[neck.length-1],true,true,true,true,false);
        shoulderCtrl.layer.name = "C_Shoulders";
        controllers.push(shoulderCtrl);
        }
    headCtrl = Duik.addController(head,false,true,false,false,false);
    controllers.push(headCtrl);

    //parent
    //bones
    if (hips) {
        hips.parent = hipsCtrl.layer;
        }
    if (back) {
        if (!hips) back[back.length-1].parent = hipsCtrl.layer;
        else back[back.length-1].parent = hips;
        }
    if (neck) {
        if (back) neck[neck.length-1].parent = back[0];
        else neck[neck.length-1].parent = hips;
        for (var i = 0;i<neck.length-1;i++) {
            neck[i].parent = neck[i+1];
            }
        }
    if (head) {
        if (neck) head.parent = neck[0];
        else if (back) head.parent = back[0];
        else if (hips) head.parent = hips;
        }
    //controllers
    bigHipsCtrl.layer.parent = hipsParent;
    hipsCtrl.layer.parent = bigHipsCtrl.layer;
    if (shoulderCtrl) {
        shoulderCtrl.layer.parent = bigHipsCtrl.layer;
        headCtrl.layer.parent = shoulderCtrl.layer;
        }
    else {
        headCtrl.layer.parent = bigHipsCtrl.layer;
        }
    headCtrl.lock();
    
    //IK
    if (hips && !back) {
        if (shoulderCtrl) Duik.autoIK([hips,shoulderCtrl.layer]);
        else Duik.autoIK([hips,headCtrl.layer]);
        }
    else if (back.length == 1) {
        if (shoulderCtrl) Duik.autoIK([back[0],shoulderCtrl.layer]);
        else Duik.autoIK([back[0],headCtrl.layer]);
        }
    else {
        var bezLayers = back;
        if (shoulderCtrl) bezLayers.push(shoulderCtrl.layer);
        else bezLayers.push(headCtrl.layer);
        bezLayers.push(hipsCtrl.layer);
        var backCurveCtrl = Duik.bezierIK(bezLayers);
        backCurveCtrl.layer.parent = bigHipsCtrl.layer;
        controllers.push(backCurveCtrl);
        delete bezLayers;
        }
    
    //controls
    //neck
    if (neck) {
        var goalCtrl;
        var goalCtrlLayerName = "";
        if (shoulderCtrl) {
            goalCtrl = shoulderCtrl.layer.effect.addProperty("ADBE Checkbox Control");
            goalCtrlLayerName = shoulderCtrl.layer.name;
            }
        else {
            goalCtrl = headCtrl.layer.effect.addProperty("ADBE Checkbox Control");
            goalCtrlLayerName = headCtrl.layer.name;
            }
        goalCtrl.name = neck[neck.length-1].name + " goal";
        goalCtrl(1).setValue(1);
        
        for (var i in neck) {
            var l = neck[i];
            var torsoName = "";
            var torsoRot = 0;
            if (back) {
                torsoName = back[0].name;
                torsoRot = back[0].transform.rotation.value;
                }
            else {
                torsoName = hips.name;
                torsoRot = hips.transform.rotation.value;
                }
            l.transform.rotation.expression = "//Duik.neck\n" + 
                                                            "var goal = thisComp.layer(\"" + goalCtrlLayerName + "\").effect(\"" + goalCtrl.name + "\")(1) == 1;\n" + 
                                                            "var torso = thisComp.layer(\"" + torsoName + "\").rotation;\n" + 
                                                            "var ctrl = thisComp.layer(\"" + shoulderCtrl.layer.name + "\").rotation;\n" + 
                                                            "var numNeckLayers = " + neck.length + ";\n" + 
                                                            "var result = value;\n" + 
                                                            "result = result + ctrl/numNeckLayers;\n" + 
                                                            "goal ? result-torso/numNeckLayers+" + torsoRot + "/numNeckLayers : result;";
            }
        }
    
    //head
    Duik.goal(head,headCtrl.layer);
    
    
    }

app.beginUndoGroup("autorigTest");

var layers = Duik.utils.convertCollectionToArray(app.project.activeItem.layers);
spine(layers[7],[layers[4],layers[5],layers[6]],[layers[1],layers[2],layers[3]],layers[0]);

app.endUndoGroup();