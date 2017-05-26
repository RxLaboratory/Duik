{
function lak_velocity(thisObj){

// FUNCTION


function autoClean(prop, bool){
    //alert(prop.influence);
    
    if(bool == true && prop.influence > 16.6 && prop.influence < 16.7){
        return 0 ;
    }else{
        return prop.speed;
    }
    
}
function infl(velocityIn,velocityOut,vitesseIn,vitesseOut) {
    app.beginUndoGroup("lk_velocity");  
    for (i=0;i<app.project.activeItem.selectedLayers.length;i++) {
        for (j=0;j<app.project.activeItem.selectedLayers[i].selectedProperties.length;j++) {
            if (app.project.activeItem.selectedLayers[i].selectedProperties[j].canVaryOverTime) {
                for (k=0;k<app.project.activeItem.selectedLayers[i].selectedProperties[j].selectedKeys.length;k++) {
                    var prop = app.project.activeItem.selectedLayers[i].selectedProperties[j]; 
                    //alert(prop.keyInTemporalEase(prop.selectedKeys[k])[0].speed);
                    if (!prop.isSpatial && prop.value.length == 3) {
                        var easeIn1 =  new KeyframeEase(vitesseIn, velocityIn);
                        var easeIn2 =  new KeyframeEase(vitesseIn, velocityIn);
                        var easeIn3 =  new KeyframeEase(vitesseIn, velocityIn);
                        var easeOut1 =new KeyframeEase(vitesseOut,velocityOut);
                        var easeOut2 = new KeyframeEase(vitesseOut,velocityOut);
                        var easeOut3 = new KeyframeEase(vitesseOut,velocityOut);
                        prop.setTemporalEaseAtKey(prop.selectedKeys[k],[easeIn1,easeIn2,easeIn3],[easeOut1,easeOut2,easeOut3]);
                        }
                    else if (!prop.isSpatial && prop.value.length == 2) {
                        var easeIn1 =  new KeyframeEase(vitesseIn, velocityIn);
                        var easeIn2 =  new KeyframeEase(vitesseIn, velocityIn);
                        var easeOut1 =new KeyframeEase(vitesseOut,velocityOut);
                        var easeOut2 = new KeyframeEase(vitesseOut,velocityOut);
                        prop.setTemporalEaseAtKey(prop.selectedKeys[k],[easeIn1,easeIn2],[easeOut1,easeOut2]);
                        }
                    else {

                        var easeIn =  new KeyframeEase(vitesseIn, velocityIn);
                        var easeOut = new KeyframeEase(vitesseOut,velocityOut);

                        prop.setTemporalEaseAtKey(prop.selectedKeys[k],[easeIn],[easeOut]);

                        }
                    }
                }
            }
    } 
    app.endUndoGroup();  
}
function velo(velocityIn,velocityOut,bool) {
    app.beginUndoGroup("lk_velocity"); 
    for (i=0;i<app.project.activeItem.selectedLayers.length;i++) {
        for (j=0;j<app.project.activeItem.selectedLayers[i].selectedProperties.length;j++) {
            if (app.project.activeItem.selectedLayers[i].selectedProperties[j].canVaryOverTime) {
                for (k=0;k<app.project.activeItem.selectedLayers[i].selectedProperties[j].selectedKeys.length;k++) {
                    var prop = app.project.activeItem.selectedLayers[i].selectedProperties[j]; 
                    if (!prop.isSpatial && prop.value.length == 3) {
                        var easeIn1 =  new KeyframeEase(prop.keyInTemporalEase(prop.selectedKeys[k])[0].speed, velocityIn);
                        var easeIn2 =  new KeyframeEase(prop.keyInTemporalEase(prop.selectedKeys[k])[1].speed, velocityIn);
                        var easeIn3 =  new KeyframeEase(prop.keyInTemporalEase(prop.selectedKeys[k])[2].speed, velocityIn);
                        var easeOut1 =new KeyframeEase(prop.keyOutTemporalEase(prop.selectedKeys[k])[0].speed,velocityOut);
                        var easeOut2 = new KeyframeEase(prop.keyOutTemporalEase(prop.selectedKeys[k])[1].speed,velocityOut);
                        var easeOut3 = new KeyframeEase(prop.keyOutTemporalEase(prop.selectedKeys[k])[2].speed,velocityOut);
                        prop.setTemporalEaseAtKey(prop.selectedKeys[k],[easeIn1,easeIn2,easeIn3],[easeOut1,easeOut2,easeOut3]);
                        }
                    else if (!prop.isSpatial && prop.value.length == 2) {
                        var easeIn1 =  new KeyframeEase(prop.keyInTemporalEase(prop.selectedKeys[k])[0].speed, velocityIn);
                        var easeIn2 =  new KeyframeEase(prop.keyInTemporalEase(prop.selectedKeys[k])[1].speed, velocityIn);
                         var easeOut1 =new KeyframeEase(prop.keyOutTemporalEase(prop.selectedKeys[k])[0].speed,velocityOut);
                        var easeOut2 = new KeyframeEase(prop.keyOutTemporalEase(prop.selectedKeys[k])[1].speed,velocityOut);
                        prop.setTemporalEaseAtKey(prop.selectedKeys[k],[easeIn1,easeIn2],[easeOut1,easeOut2]);
                        }
                    else {

                        var easeIn =  new KeyframeEase(autoClean(prop.keyInTemporalEase(prop.selectedKeys[k])[0],bool),velocityIn);
                        var easeOut =new KeyframeEase(autoClean(prop.keyInTemporalEase(prop.selectedKeys[k])[0],bool),velocityOut);
                        prop.setTemporalEaseAtKey(prop.selectedKeys[k],[easeIn],[easeOut]);

                        }
                    }
                }
            }
    }  
    app.endUndoGroup(); 
}
function matchSpeed(sens) {
    app.beginUndoGroup("lk_velocity"); 
    for (i=0;i<app.project.activeItem.selectedLayers.length;i++) {
        for (j=0;j<app.project.activeItem.selectedLayers[i].selectedProperties.length;j++) {
            if (app.project.activeItem.selectedLayers[i].selectedProperties[j].canVaryOverTime) {
                for (k=0;k<app.project.activeItem.selectedLayers[i].selectedProperties[j].selectedKeys.length;k++) {
                    var prop = app.project.activeItem.selectedLayers[i].selectedProperties[j]; 
                    if (!prop.isSpatial && prop.value.length == 3) {
                        
                        if(sens == "in"){
                            var easeIn1 =  new KeyframeEase(prop.keyInTemporalEase(prop.selectedKeys[k])[0].speed, prop.keyInTemporalEase(prop.selectedKeys[k])[0].influence);
                            var easeIn2 =  new KeyframeEase(prop.keyInTemporalEase(prop.selectedKeys[k])[1].speed, prop.keyInTemporalEase(prop.selectedKeys[k])[1].influence);
                            var easeIn3 =  new KeyframeEase(prop.keyInTemporalEase(prop.selectedKeys[k])[2].speed, prop.keyInTemporalEase(prop.selectedKeys[k])[2].influence);
                            var easeOut1 = new KeyframeEase(prop.keyInTemporalEase(prop.selectedKeys[k])[0].speed,prop.keyOutTemporalEase(prop.selectedKeys[k])[0].influence);
                            var easeOut2 = new KeyframeEase(prop.keyInTemporalEase(prop.selectedKeys[k])[1].speed,prop.keyOutTemporalEase(prop.selectedKeys[k])[1].influence);
                            var easeOut3 = new KeyframeEase(prop.keyInTemporalEase(prop.selectedKeys[k])[2].speed,prop.keyOutTemporalEase(prop.selectedKeys[k])[2].influence);
                            
                        }else{
                            
                            var easeIn1 =  new KeyframeEase(prop.keyOutTemporalEase(prop.selectedKeys[k])[0].speed, prop.keyInTemporalEase(prop.selectedKeys[k])[0].influence);
                            var easeIn2 =  new KeyframeEase(prop.keyOutTemporalEase(prop.selectedKeys[k])[1].speed, prop.keyInTemporalEase(prop.selectedKeys[k])[1].influence);
                            var easeIn3 =  new KeyframeEase(prop.keyOutTemporalEase(prop.selectedKeys[k])[2].speed, prop.keyInTemporalEase(prop.selectedKeys[k])[2].influence);
                            var easeOut1 =new KeyframeEase(prop.keyOutTemporalEase(prop.selectedKeys[k])[0].speed,prop.keyOutTemporalEase(prop.selectedKeys[k])[0].influence);
                            var easeOut2 = new KeyframeEase(prop.keyOutTemporalEase(prop.selectedKeys[k])[1].speed,prop.keyOutTemporalEase(prop.selectedKeys[k])[1].influence);
                            var easeOut3 = new KeyframeEase(prop.keyOutTemporalEase(prop.selectedKeys[k])[2].speed,prop.keyOutTemporalEase(prop.selectedKeys[k])[2].influence);
                        }
                        prop.setTemporalEaseAtKey(prop.selectedKeys[k],[easeIn1,easeIn2,easeIn3],[easeOut1,easeOut2,easeOut3]);

                        }
                    else if (!prop.isSpatial && prop.value.length == 2) {  
                        if(sens == "in"){
                            var easeIn1 =  new KeyframeEase(prop.keyInTemporalEase(prop.selectedKeys[k])[0].speed, prop.keyInTemporalEase(prop.selectedKeys[k])[0].influence);
                            var easeIn2 =  new KeyframeEase(prop.keyInTemporalEase(prop.selectedKeys[k])[1].speed, prop.keyInTemporalEase(prop.selectedKeys[k])[1].influence);
                            var easeOut1 = new KeyframeEase(prop.keyInTemporalEase(prop.selectedKeys[k])[0].speed,prop.keyOutTemporalEase(prop.selectedKeys[k])[0].influence);
                            var easeOut2 = new KeyframeEase(prop.keyInTemporalEase(prop.selectedKeys[k])[1].speed,prop.keyOutTemporalEase(prop.selectedKeys[k])[1].influence);

                            
                        }else{
                            
                            var easeIn1 =  new KeyframeEase(prop.keyOutTemporalEase(prop.selectedKeys[k])[0].speed, prop.keyInTemporalEase(prop.selectedKeys[k])[0].influence);
                            var easeIn2 =  new KeyframeEase(prop.keyOutTemporalEase(prop.selectedKeys[k])[1].speed, prop.keyInTemporalEase(prop.selectedKeys[k])[1].influence);
                            var easeOut1 =new KeyframeEase(prop.keyOutTemporalEase(prop.selectedKeys[k])[0].speed,prop.keyOutTemporalEase(prop.selectedKeys[k])[0].influence);
                            var easeOut2 = new KeyframeEase(prop.keyOutTemporalEase(prop.selectedKeys[k])[1].speed,prop.keyOutTemporalEase(prop.selectedKeys[k])[1].influence);

                        }
                        prop.setTemporalEaseAtKey(prop.selectedKeys[k],[easeIn1,easeIn2],[easeOut1,easeOut2]);
                        }
                    else {
                        if(sens == "in"){
                            var easeIn =  new KeyframeEase(prop.keyInTemporalEase(prop.selectedKeys[k])[0].speed, prop.keyInTemporalEase(prop.selectedKeys[k])[0].influence);
                            var easeOut = new KeyframeEase(prop.keyInTemporalEase(prop.selectedKeys[k])[0].speed,prop.keyOutTemporalEase(prop.selectedKeys[k])[0].influence);

                            
                        }else{
                            
                            var easeIn =  new KeyframeEase(prop.keyOutTemporalEase(prop.selectedKeys[k])[0].speed, prop.keyInTemporalEase(prop.selectedKeys[k])[0].influence);
                            var easeOut =new KeyframeEase(prop.keyOutTemporalEase(prop.selectedKeys[k])[0].speed,prop.keyOutTemporalEase(prop.selectedKeys[k])[0].influence);

                        }
                        prop.setTemporalEaseAtKey(prop.selectedKeys[k],[easeIn],[easeOut]);

                        }
                    }
                }
            }
    }  
    app.endUndoGroup();
}
function reverseSpeed() {
     app.beginUndoGroup("lk_velocity"); 
   
    for (i=0;i<app.project.activeItem.selectedLayers.length;i++) {
        for (j=0;j<app.project.activeItem.selectedLayers[i].selectedProperties.length;j++) {
            if (app.project.activeItem.selectedLayers[i].selectedProperties[j].canVaryOverTime) {
                for (k=0;k<app.project.activeItem.selectedLayers[i].selectedProperties[j].selectedKeys.length;k++) {
                    var prop = app.project.activeItem.selectedLayers[i].selectedProperties[j]; 
                    if (!prop.isSpatial && prop.value.length == 3) {
                        

                            var easeIn1 =  new KeyframeEase(prop.keyOutTemporalEase(prop.selectedKeys[k])[0].speed*-1, prop.keyInTemporalEase(prop.selectedKeys[k])[0].influence);
                            var easeIn2 =  new KeyframeEase(prop.keyOutTemporalEase(prop.selectedKeys[k])[1].speed*-1, prop.keyInTemporalEase(prop.selectedKeys[k])[1].influence);
                            var easeIn3 =  new KeyframeEase(prop.keyOutTemporalEase(prop.selectedKeys[k])[2].speed*-1, prop.keyInTemporalEase(prop.selectedKeys[k])[2].influence);
                            var easeOut1 = new KeyframeEase(prop.keyInTemporalEase(prop.selectedKeys[k])[0].speed*-1,prop.keyOutTemporalEase(prop.selectedKeys[k])[0].influence);
                            var easeOut2 = new KeyframeEase(prop.keyInTemporalEase(prop.selectedKeys[k])[1].speed*-1,prop.keyOutTemporalEase(prop.selectedKeys[k])[1].influence);
                            var easeOut3 = new KeyframeEase(prop.keyInTemporalEase(prop.selectedKeys[k])[2].speed*-1,prop.keyOutTemporalEase(prop.selectedKeys[k])[2].influence);
                            

                        prop.setTemporalEaseAtKey(prop.selectedKeys[k],[easeIn1,easeIn2,easeIn3],[easeOut1,easeOut2,easeOut3]);

                        }
                    else if (!prop.isSpatial && prop.value.length == 2) {  

                            var easeIn1 =  new KeyframeEase(prop.keyOutTemporalEase(prop.selectedKeys[k])[0].speed*-1, prop.keyInTemporalEase(prop.selectedKeys[k])[0].influence);
                            var easeIn2 =  new KeyframeEase(prop.keyOutTemporalEase(prop.selectedKeys[k])[1].speed*-1, prop.keyInTemporalEase(prop.selectedKeys[k])[1].influence);
                            var easeOut1 = new KeyframeEase(prop.keyInTemporalEase(prop.selectedKeys[k])[0].speed*-1,prop.keyOutTemporalEase(prop.selectedKeys[k])[0].influence);
                            var easeOut2 = new KeyframeEase(prop.keyInTemporalEase(prop.selectedKeys[k])[1].speed*-1,prop.keyOutTemporalEase(prop.selectedKeys[k])[1].influence);

                            

                        prop.setTemporalEaseAtKey(prop.selectedKeys[k],[easeIn1,easeIn2],[easeOut1,easeOut2]);
                        }
                    else {
            
                            var easeIn =  new KeyframeEase(prop.keyOutTemporalEase(prop.selectedKeys[k])[0].speed*-1, prop.keyInTemporalEase(prop.selectedKeys[k])[0].influence);
                            var easeOut = new KeyframeEase(prop.keyInTemporalEase(prop.selectedKeys[k])[0].speed*-1,prop.keyOutTemporalEase(prop.selectedKeys[k])[0].influence);

                            
                        
                        prop.setTemporalEaseAtKey(prop.selectedKeys[k],[easeIn],[easeOut]);

                        }
                    }
                }
            }
    }     
        app.endUndoGroup();

}
function stopSpeed() {
         app.beginUndoGroup("lk_velocity"); 

    for (i=0;i<app.project.activeItem.selectedLayers.length;i++) {
        for (j=0;j<app.project.activeItem.selectedLayers[i].selectedProperties.length;j++) {
            if (app.project.activeItem.selectedLayers[i].selectedProperties[j].canVaryOverTime) {
                for (k=0;k<app.project.activeItem.selectedLayers[i].selectedProperties[j].selectedKeys.length;k++) {
                    var prop = app.project.activeItem.selectedLayers[i].selectedProperties[j]; 
                    if (!prop.isSpatial && prop.value.length == 3) {
                        

                            var easeIn1 =  new KeyframeEase(0, prop.keyInTemporalEase(prop.selectedKeys[k])[0].influence);
                            var easeIn2 =  new KeyframeEase(0, prop.keyInTemporalEase(prop.selectedKeys[k])[1].influence);
                            var easeIn3 =  new KeyframeEase(0, prop.keyInTemporalEase(prop.selectedKeys[k])[2].influence);
                            var easeOut1 = new KeyframeEase(0,prop.keyOutTemporalEase(prop.selectedKeys[k])[0].influence);
                            var easeOut2 = new KeyframeEase(0,prop.keyOutTemporalEase(prop.selectedKeys[k])[1].influence);
                            var easeOut3 = new KeyframeEase(0,prop.keyOutTemporalEase(prop.selectedKeys[k])[2].influence);
                            

                        prop.setTemporalEaseAtKey(prop.selectedKeys[k],[easeIn1,easeIn2,easeIn3],[easeOut1,easeOut2,easeOut3]);

                        }
                    else if (!prop.isSpatial && prop.value.length == 2) {  

                            var easeIn1 =  new KeyframeEase(0, prop.keyInTemporalEase(prop.selectedKeys[k])[0].influence);
                            var easeIn2 =  new KeyframeEase(0, prop.keyInTemporalEase(prop.selectedKeys[k])[1].influence);
                            var easeOut1 = new KeyframeEase(0,prop.keyOutTemporalEase(prop.selectedKeys[k])[0].influence);
                            var easeOut2 = new KeyframeEase(0,prop.keyOutTemporalEase(prop.selectedKeys[k])[1].influence);

                            

                        prop.setTemporalEaseAtKey(prop.selectedKeys[k],[easeIn1,easeIn2],[easeOut1,easeOut2]);
                        }
                    else {
            
                            var easeIn =  new KeyframeEase(0, prop.keyInTemporalEase(prop.selectedKeys[k])[0].influence);
                            var easeOut = new KeyframeEase(0,prop.keyOutTemporalEase(prop.selectedKeys[k])[0].influence);

                            
                        
                        prop.setTemporalEaseAtKey(prop.selectedKeys[k],[easeIn],[easeOut]);

                        }
                    }
                }
            }
    }   
    app.endUndoGroup();
    
}
function infls(prop,key,velocityIn,velocityOut,vitesseIn,vitesseOut) {
    
                    if (!prop.isSpatial && prop.value.length == 3) {
                        var easeIn1 =  new KeyframeEase(vitesseIn, velocityIn);
                        var easeIn2 =  new KeyframeEase(vitesseIn, velocityIn);
                        var easeIn3 =  new KeyframeEase(vitesseIn, velocityIn);
                        var easeOut1 =new KeyframeEase(vitesseOut,velocityOut);
                        var easeOut2 = new KeyframeEase(vitesseOut,velocityOut);
                        var easeOut3 = new KeyframeEase(vitesseOut,velocityOut);
                        prop.setTemporalEaseAtKey(key,[easeIn1,easeIn2,easeIn3],[easeOut1,easeOut2,easeOut3]);
                        }
                    else if (!prop.isSpatial && prop.value.length == 2) {
                        var easeIn1 =  new KeyframeEase(vitesseIn, velocityIn);
                        var easeIn2 =  new KeyframeEase(vitesseIn, velocityIn);
                        var easeOut1 =new KeyframeEase(vitesseOut,velocityOut);
                        var easeOut2 = new KeyframeEase(vitesseOut,velocityOut);
                        prop.setTemporalEaseAtKey(key,[easeIn1,easeIn2],[easeOut1,easeOut2]);
                        }
                    else {

                        var easeIn =  new KeyframeEase(vitesseIn, velocityIn);
                        var easeOut = new KeyframeEase(vitesseOut,velocityOut);

                        prop.setTemporalEaseAtKey(key,[easeIn],[easeOut]);
                    
                    }
    
}



// UI
    function lak_velocityUi(thisObj){
        var myPanel =(thisObj instanceof Panel) ? thisObj : new Window("palette","lk_velocity",undefined, {resizeable:true});
       
 // UI DESIGN
 
 {
    
        res ="group{orientation:'column',alignment:['fill','fill'],\
                    lBtn3: Group{orientation:'row',alignment:['fill','top'],alignChildren :['fill','fill'],\
                        trois: StaticText {text:'|30|',maximumSize:[40,28]},\
                        cinq: StaticText {text:'|50|',maximumSize:[40,28]},\
                        sept: StaticText {text:'|70|',maximumSize:[40,28]},\
                        cent: StaticText {text:'|100|',maximumSize:[40,28]},\
                     },\
                    Velocity: Group{orientation:'row',alignment:['fill','top'],alignChildren :['fill','fill'],\
                        In: Slider {value:100,minvalue:0,maxvalue:100},\
                        lock: Checkbox {value:true ,maximumSize:[20,20]},\
                        Out:Slider {value:0,minvalue:0,maxvalue:100},\
                        clean: Checkbox {value:true, maximumSize:[20,20],helpTip:'Clean speed if this key is linear'},\
                     },\
                    OptVelocity: Group{orientation:'row',alignment:['fill','top'], \
                        staticVelocityIn: StaticText{text:'I',alignment:['left','top']},\
                        VelocityIn: EditText{text:'0',characters:3,alignment:['fill','top'],helpTip:'Influence In'},\
                        btnInToOut: Button{text:'<',maximumSize:[22,22],minimumSize:[22,22],alignment:['fill','top']},\
                        btnOutToIn: Button{text:'>',maximumSize:[22,22],minimumSize:[22,22],alignment:['fill','top']},\
                        VelocityOut: EditText{text:'0',characters:3,alignment:['fill','top'],helpTip:'Influence Out'},\
                    },\
                    OptSpeed: Group{orientation:'row',alignment:['fill','top'], \
                        staticSpeed: StaticText{text:'S',alignment:['left','top']},\
                        SpeedIn: EditText{text:'0',characters:3,alignment:['fill','top'],helpTip:'Speed In'},\
                        btnInToOut: Button{text:'<',maximumSize:[22,22],minimumSize:[22,22],alignment:['fill','top']},\
                        btnOutToIn: Button{text:'>',maximumSize:[22,22],minimumSize:[22,22],alignment:['fill','top']},\
                        SpeedOut: EditText{text:'0',characters:3,alignment:['fill','top'],helpTip:'Speed Out'},\
                    },\
                    lBtn: Group{orientation:'row',alignment:['center','top'],\
                        btnCopy: Button{text:'Copy',maximumSize:[55,28]},\
                        btnReverse: Button {text:'<->',maximumSize:[40,28]},\
                        btnApply: Button{text:'Apply',maximumSize:[55,28]},\
                     },\
                    lBtn2: Group{orientation:'row',alignment:['center','top'],\
                        btnMatchIn: Button {text:'<-',maximumSize:[40,28],helpTip:'Match speed In to Out'},\
                        btnReverse: Button {text:'<->',maximumSize:[28,28],helpTip:'reverse speed'},\
                        btnMatchOut: Button {text:'->',maximumSize:[40,28],helpTip:'Match speed Out to In'},\
                        btnStop: Button {text:'X',maximumSize:[28,28],helpTip:'Clean speed'},\
                     },\
                }";

 }              myPanel.grp = myPanel.add(res);

// Btn ACTIONS 


////////////////
function copyV() {


    if (app.project.activeItem.selectedLayers[0].selectedProperties[app.project.activeItem.selectedLayers[0].selectedProperties.length-1].selectedKeys[0] !== undefined){
    var prop = app.project.activeItem.selectedLayers[0].selectedProperties[app.project.activeItem.selectedLayers[0].selectedProperties.length-1];
    }else if(app.project.activeItem.selectedLayers[0].selectedProperties[1].selectedKeys[0] !== undefined){
            var prop = app.project.activeItem.selectedLayers[0].selectedProperties[1]; 
    }else{
            alert("can't copy this selection, please select just one key");
            return;
    }
    var speedIn = prop.keyInTemporalEase(prop.selectedKeys[0])[0].speed;
    var speedOut = prop.keyOutTemporalEase(prop.selectedKeys[0])[0].speed;
    var influenceIn = prop.keyInTemporalEase(prop.selectedKeys[0])[0].influence; 
    var influenceOut = prop.keyOutTemporalEase(prop.selectedKeys[0])[0].influence;

    
    myPanel.grp.OptSpeed.SpeedIn.text=speedIn;
    myPanel.grp.OptSpeed.SpeedOut.text= speedOut;
    myPanel.grp.OptVelocity.VelocityIn.text=influenceIn;
    myPanel.grp.OptVelocity.VelocityOut.text= influenceOut;
    
    

    }
        
/*function matchSpeed(sens){
    var props = app.project.activeItem.selectedLayers[0].selectedProperties;
    
    for(var i in props){
        var propKeys =  props[i].selectedKeys;
        if(propKeys !== undefined){
            
           
            for(var j in propKeys){
                if(sens=="in"){
    //                props[i].keyInTemporalEase(props[i].selectedKeys[j])[j].speed =  props[i].keyOutTemporalEase(props[i].selectedKeys[j])[j].speed;
    //                alert(props[i].keyOutTemporalEase(propKeys[j]).speed);
                    if(!isNaN(j))infls(props[i],propKeys[j],props[i].keyInTemporalEase(propKeys[j])[0].influence,props[i].keyOutTemporalEase(propKeys[j])[0].influence,props[i].keyOutTemporalEase(propKeys[j])[0].speed,props[i].keyOutTemporalEase(propKeys[j])[0].speed);
                }else{
                    if(!isNaN(j))infls(props[i],propKeys[j],props[i].keyInTemporalEase(propKeys[j])[0].influence,props[i].keyOutTemporalEase(propKeys[j])[0].influence,props[i].keyInTemporalEase(propKeys[j])[0].speed,props[i].keyInTemporalEase(propKeys[j])[0].speed);
                }
            }
        }
    }
    
}*/

/*function reverseSpeed(){
    var props = app.project.activeItem.selectedLayers[0].selectedProperties;
    
    for(var i in props){
        var propKeys =  props[i].selectedKeys;
        if(propKeys !== undefined){
            
           
            for(var j in propKeys){
                
                    if(!isNaN(j))infls(props[i],propKeys[j],props[i].keyInTemporalEase(propKeys[j])[0].influence,props[i].keyOutTemporalEase(propKeys[j])[0].influence,props[i].keyInTemporalEase(propKeys[j])[0].speed*-1,props[i].keyOutTemporalEase(propKeys[j])[0].speed*-1);



            }
        }
    }
    
}*/
function reverser() {
    var tempInS = myPanel.grp.OptSpeed.SpeedIn.text;
    var tempInI= myPanel.grp.OptVelocity.VelocityIn.text;
    

    
    myPanel.grp.OptSpeed.SpeedIn.text=myPanel.grp.OptSpeed.SpeedOut.text;
    myPanel.grp.OptSpeed.SpeedOut.text= tempInS;
    myPanel.grp.OptVelocity.VelocityIn.text=myPanel.grp.OptVelocity.VelocityOut.text;
    myPanel.grp.OptVelocity.VelocityOut.text= tempInI;
    
    

    }
        
//////////////
function create(){
    var speedIn= myPanel.grp.OptSpeed.SpeedIn.text;
    var speedOut= myPanel.grp.OptSpeed.SpeedOut.text;
    
    var velocityIn= myPanel.grp.OptVelocity.VelocityIn.text;
    if (velocityIn <0.2){ velocityIn =0.1;}
    if (velocityIn > 100){ velocityIn =100;}
    var velocityOut= myPanel.grp.OptVelocity.VelocityOut.text;
    if (velocityOut < 0.2){ velocityOut =0.1;}
    if (velocityOut > 100){ velocityOut =100;}
        
        infl(velocityIn,velocityOut,speedIn,speedOut);
    }
        
function createVelo(){
    var speedIn= myPanel.grp.OptSpeed.SpeedIn.text;
    var speedOut= myPanel.grp.OptSpeed.SpeedOut.text;
    
    var velocityIn= myPanel.grp.OptVelocity.VelocityIn.text;
    if (velocityIn <0.2){ velocityIn =0.1;}
    if (velocityIn > 100){ velocityIn =100;}
    var velocityOut= myPanel.grp.OptVelocity.VelocityOut.text;
    if (velocityOut < 0.2){ velocityOut =0.1;}
    if (velocityOut > 100){ velocityOut =100;}
        
        velo(velocityIn,velocityOut,myPanel.grp.Velocity.clean.value);
    }
function createCmd(val){

    
    var velocityIn= val;
    var velocityOut= val;

        
        velo(velocityIn,velocityOut);
    }


///// >100


myPanel.grp.OptVelocity.VelocityIn.onChanging = function (){
    if (this.text>100 ){this.text = 100;}
    if (this.text<0 || isNaN(this.text) ){this.text = 0;}
    }
myPanel.grp.OptVelocity.VelocityOut.onChanging = function (){
    if (this.text>100 ){this.text = 100;}
    if (this.text<0 || isNaN(this.text) ){this.text = 0;}
    }
myPanel.grp.OptSpeed.SpeedIn.onChanging = function (){
    if (isNaN(this.text) ){this.text = 0;}
    }
myPanel.grp.OptSpeed.SpeedOut.onChanging = function (){
    if (isNaN(this.text) ){this.text = 0;}
    }
    
 /////////////////RESET
 

 
 function rstVal(){
         myPanel.grp.OptSpeed.SpeedIn.text=0;
        myPanel.grp.OptSpeed.SpeedOut.text= 0;
        myPanel.grp.OptVelocity.VelocityIn.text=0;
        myPanel.grp.OptVelocity.VelocityOut.text=0;
     }
 

        myPanel.grp.lBtn.btnApply.onClick=create;

        myPanel.grp.lBtn.btnCopy.onClick=copyV;
        myPanel.grp.lBtn.btnReverse.onClick=reverser;
        
        myPanel.grp.lBtn2.btnMatchIn.onClick=function(){matchSpeed("out")};
        myPanel.grp.lBtn2.btnMatchOut.onClick=function(){matchSpeed("in")};
        myPanel.grp.lBtn2.btnReverse.onClick=reverseSpeed;
        myPanel.grp.lBtn2.btnStop.onClick=stopSpeed;
        
        myPanel.grp.lBtn3.trois.addEventListener( 'click', function(){createCmd(30)} ) ;
        myPanel.grp.lBtn3.cinq.addEventListener( 'click', function(){createCmd(50)} ) ;
        myPanel.grp.lBtn3.sept.addEventListener( 'click', function(){createCmd(70)} ) ;
        myPanel.grp.lBtn3.cent.addEventListener( 'click', function(){createCmd(100)} ) ;
        
        
        //interface slider
        myPanel.grp.Velocity.In.onChanging = function(){
            if(myPanel.grp.Velocity.lock.value == true){
                myPanel.grp.Velocity.Out.value = 100 - this.value;
                myPanel.grp.OptVelocity.VelocityOut.text = 100-Math.round(this.value);
            }
            myPanel.grp.OptVelocity.VelocityIn.text =  100-Math.round(this.value);
            
        };
        
        
        myPanel.grp.Velocity.Out.onChanging = function(){
            if(myPanel.grp.Velocity.lock.value == true){
                myPanel.grp.Velocity.In.value = 100 - this.value;
                myPanel.grp.OptVelocity.VelocityIn.text =  Math.round(this.value);
            } 
            myPanel.grp.OptVelocity.VelocityOut.text = Math.round(this.value);
        };
        
        myPanel.grp.Velocity.In.onChange = createVelo;
        myPanel.grp.Velocity.Out.onChange = createVelo;



        /// matching
        
        myPanel.grp.OptSpeed.btnInToOut.onClick = function(){
            myPanel.grp.OptSpeed.SpeedIn.text=myPanel.grp.OptSpeed.SpeedOut.text;
        }
        myPanel.grp.OptSpeed.btnOutToIn.onClick = function(){
            myPanel.grp.OptSpeed.SpeedOut.text=myPanel.grp.OptSpeed.SpeedIn.text;
        }
        myPanel.grp.OptVelocity.btnInToOut.onClick = function(){
            myPanel.grp.OptVelocity.VelocityIn.text=myPanel.grp.OptVelocity.VelocityOut.text;
        }
        myPanel.grp.OptVelocity.btnOutToIn.onClick = function(){
            myPanel.grp.OptVelocity.VelocityOut.text=myPanel.grp.OptVelocity.VelocityIn.text;
        }

    
 //REDESSINE PALETTE Au Redim
 
myPanel.layout.layout(true);
myPanel.layout.resize();
myPanel.onResizing = myPanel.onResize = function () {this.layout.resize();}
return myPanel;
        
}


    var scriptPanel = lak_velocityUi(thisObj);
   
    
    if((scriptPanel != null) && (scriptPanel instanceof Window)) {
        scriptPanel.center();
        scriptPanel.show();
    }

} 

lak_velocity(this);
}    