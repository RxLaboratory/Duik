var calques = app.project.activeItem.selectedLayers;
var start = 155*app.project.activeItem.frameDuration;
var stop = 180*app.project.activeItem.frameDuration;


function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

app.beginUndoGroup("Random");

for (i in calques)
{
    var rand = getRandom(start,stop);
    calques[i].startTime = rand;
}

app.endUndoGroup();