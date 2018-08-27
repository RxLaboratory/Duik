(function () {

    var bpm = 60;
    
    #include "E:/DEV SRC/DuAEF/src/DuAEF.jsxinc"
    
    //get comp
    var comp = DuAEF.DuAE.Project.getActiveComp();
    if (!comp) return;
        
    app.beginUndoGroup("KanaBeat");
    
    //add null 
    var nullLayer = comp.layers.addNull();
    nullLayer.name = "KanaBeat - " + bpm + 'bpm';
    nullLayer.enabled = false;
    
    //add markers 
    var beatDuration = 60/bpm;
    var numMarkers = parseInt(comp.duration / beatDuration);
    
    for (var i = 0; i <= numMarkers; i++)
    {
        var marker = new MarkerValue('');
        if ( i % 4 == 0 ) marker.comment = "•";
        nullLayer.property('ADBE Marker').setValueAtTime(i * beatDuration,marker);
        }
    
         app.endUndoGroup();
    
    })();