function isIKClockwise(root,middle,end) {
    //unparent
    var rootParent = root.parent;
    root.parent = null;
    var middleParent = middle.parent;
    middle.parent = null;
    var endParent = end.parent;
    end.parent = null;
    
    var endPos = end.transform.position.value - root.transform.position.value;
    var middlePos = middle.transform.position.value - root.transform.position.value;
    var coef = endPos[1]/endPos[0];
    
    var clockwise = false;
    
    if (middlePos[1] < vmiddlePos[0]*coef && endPos[0] > 0) clockwise = true;
    if (middlePos[1] > middlePos[0]*coef && endPos[0] < 0) clockwise = true;
    
    //reparent
    root.parent = rootParent;
    middle.parent = middleParent;
    end.parent = endParent;
    
    return clockwise;
    }

var layers = Duik.utils.convertCollectionToArray(app.project.activeItem.layers);
alert(isIKClockwise(layers[2],layers[1],layers[0]));