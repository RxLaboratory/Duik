/**
 * Layers related tools.
 * @namespace
 * @category Duik
 */
Duik.Layer = {};

// Low-level
Duik.Layer.sanitizing = false;

/**
 * The list of layer functions
 */
Duik.CmdLib['Layer'] = [];

/**
 * The types of layers used by Duik
 * @enum {string}
 */
Duik.Layer.Type = {
    NONE: DuAELayer.Type.NONE,
    BONE: 'B',
    PIN: 'P',
    CONTROLLER: 'C',
    CONTROLLER_BG: 'CBg',
    ZERO: 'Z',
    IK: 'IK',
    NULL: DuAELayer.Type.NULL,
    LOCATOR: 'Loc',
    EFFECTOR: 'Efctr',
    AUDIO: 'Aud',
    MOTION_TRAIL: 'Trail',
    CEL: 'Cel',
    X_SHEET: 'X-Sheet',
    ART: 'Art',
    SOLID: DuAELayer.Type.SOLID,
    ADJUSTMENT: DuAELayer.Type.ADJUSTMENT
}

/**
 * The regular expressions used to validate names
 * @enum {RegExp}
 */
Duik.Layer.NameRegExp = {
    DUIK_NAME: /^([^<>|\[\]]+)?(?:\s*[<|])?\s*([^<>|\[\]]+)?(?:\s*[|]\s*)?([^<>|\[\]]+)\s*(?:\s*[>])?\s*\[?([a-zA-Z.]+)?\]?\s*(\d*)$/,
    SIMPLE: /^([^<>|\[\]\-_\/\\]+)\s*(?:[|\-_\/\\])\s*([^<>|\[\]]+)$/,
    LOCATION:/\[(.*)\]/,
    MAIN_NAME:/<\s*([^<>\[\]]+)\s*>/
}

/**
 * Checks if a string is one of the prefixes used to identify layer types in their names
 * @param {string} prefix The string to check
 * @return {bool} True if the string is one of the predefined prefixes.
 */
Duik.Layer.isTypePrefix = function( prefix ) {
    for (var typ in Duik.Layer.Type) {
        if (!Duik.Layer.Type.hasOwnProperty(typ)) continue;
        if (prefix == Duik.Layer.Type[typ]) return true;
        if (prefix.toLowerCase() == Duik.Layer.Type[typ].toLowerCase()) return true;
    }
    return false;
}

/**
 * Checks if the layer is one of the types created by duik.
 * @param {Layer} layer - The layer to check
 * @param {Duik.Layer.Type} layerType - The type of layer
 * @return {Boolean}
 */
Duik.Layer.isType = function(layer, layerType) {
    return DuAELayer.isType(layer, layerType);
}

/**
 * Gets the type of the layer
 * @param {Layer} [layer] The layer. If omitted, will check the first selected layer of the current comp
 * @returns {Duik.Layer.Type} The type
 */
Duik.Layer.type = function(layer) {
    return DuAELayer.type(layer);
}

/**
 * Sets the type of the layer
 * @param {Duik.Layer.Type} type The type
 * @param {Layer[]|LayerCollection|DuList.<Layer>|Layer} [layers=DuAEComp.getSelectedLayers()] The layer. If omitted, will use all selected layers in the comp
 */
Duik.Layer.setType = function(type, layers) {

    layers = def(layers, DuAEComp.getSelectedLayers());
    layers = new DuList(layers);
    if (layers.length() == 0) return;

    for (var i = 0, n = layers.length(); i < n; i++) {
        var layer = layers.at(i);

        Duik.Layer.updateTypeName(layer, type);
        Duik.Layer.updateTypeMeta(layer, type);
    }
}

/**
 * Gets all layers of the specified type
 * @param {Duik.Layer.Type} type The type
 * @param {Boolean} [selectedOnly=true] Whether to get only the selected layers or all of them
 * @param {CompItem} [comp=DuAEProject.getActiveComp()] The comp
 * @param {bool} [notSelectedOnly=false] Get only the not selected layers
 * @returns {Layer[]} The layers of the specified type.
 */
Duik.Layer.get = function(type, selectedOnly, comp, notSelectedOnly) {
    comp = def(comp, DuAEProject.getActiveComp());
    selectedOnly = def(selectedOnly, true);
    notSelectedOnly = def(notSelectedOnly, false);
    if (!comp) return [];

    var layers = [];
    if (selectedOnly) layers = comp.selectedLayers;
    else layers = comp.layers;

    if (layers.length == 0) return [];

    layers = new DuList(layers);
    var bones = [];
    layers.do(function(layer) {
        if (layer.selected && notSelectedOnly) return;
        
        if (Duik.Layer.isType(layer, type)) bones.push(layer);
        else if (type == Duik.Layer.Type.CONTROLLER && Duik.Layer.isType(layer, Duik.Layer.Type.CONTROLLER_BG)) bones.push(layer);
    });
    return bones;
}

/**
 * Selects all the layers of the given type (and deselects others)
 * @param {Duik.Layer.Type} type The type
 * @param {CompItem} [comp=DuAEProject.getActiveComp()] The comp
 */
Duik.Layer.select = function(type, comp) {
    comp = def(comp, DuAEProject.getActiveComp());
    if (!comp) return;

    for (var i = 1, n = comp.numLayers; i <= n; i++) {
        var layer = comp.layer(i);
        if (layer.locked) continue;
        layer.selected = Duik.Layer.isType(layer, type);
    }
}

/**
 * Show/hides all the layers of the given type
 * @param {Duik.Layer.Type} type The type
 * @param {CompItem} [comp=DuAEProject.getActiveComp()] The comp
 * @param {bool} [notSelectedOnly=false] Hides only the layers which are not selected
 */
Duik.Layer.toggleVisibility = function(type, comp, notSelectedOnly) {
    notSelectedOnly = def(notSelectedOnly, false);
    var layers = Duik.Layer.get(type, false, comp, notSelectedOnly);
    if (layers.length == 0) return;
    var enabled = !layers[0].enabled;
    for (var i = 0, n = layers.length; i < n; i++) {
        layers[i].enabled = enabled;
    }
}

/**
 * Checks the side of the layer
 * @param {Layer} [layer] The layer. If omitted, will check the first selected bone of the current comp
 * @returns {OCO.Side}
 */
Duik.Layer.side = function(layer) {
    layer = def(layer, DuAEComp.getActiveLayer());
    if (!layer) return OCO.Side.NONE;

    if (DuGR.inGroups(layer, [ i18n._("Left")])) return OCO.Side.LEFT;
    if (DuGR.inGroups(layer, [ i18n._("Right")])) return OCO.Side.RIGHT;
    return OCO.Side.NONE;
}

/**
 * Sets the side of the layer
 * @param {OCO.Side} side The side
 * @param {Layer[]|LayerCollection|DuList.<Layer>|Layer} [layers=DuAEComp.getSelectedLayers()] The layer. If omitted, will use all selected layers in the comp
 */
Duik.Layer.setSide = function(side, layers) {
    layers = def(layers, DuAEComp.getSelectedLayers());
    layers = new DuList(layers);
    if (layers.length() == 0) return;

    for (var i = 0, n = layers.length(); i < n; i++) {
        var layer = layers.at(i);
        Duik.Layer.updateSideMeta(layer, side);
        Duik.Layer.updateSideName(layer, side);
    }
}

/**
 * Checks the location of the layer
 * @param {Layer} [layer=DuAEComp.getActiveLayer] The layer. If omitted, will check the first selected bone of the current comp
 * @returns {OCO.Location}
 */
Duik.Layer.location = function(layer) {
    layer = def(layer, DuAEComp.getActiveLayer());
    if (!layer) return OCO.Location.NONE;

    if (DuGR.inGroups(layer, [ i18n._("Front")])) return OCO.Location.FRONT;
    if (DuGR.inGroups(layer, [ i18n._("Back")])) return OCO.Location.BACK;
    if (DuGR.inGroups(layer, [ i18n._("Middle")])) return OCO.Location.MIDDLE;
    if (DuGR.inGroups(layer, [ i18n._("Under")])) return OCO.Location.UNDER;
    if (DuGR.inGroups(layer, [ i18n._("Above")])) return OCO.Location.ABOVE;
    if (DuGR.inGroups(layer, [ i18n._("Tail")])) return OCO.Location.TAIL;
    return OCO.Side.NONE;
}

/**
 * Sets the location of the layer
 * @param {OCO.Side} side The side
 * @param {Layer[]|LayerCollection|DuList.<Layer>|Layer} [layers=DuAEComp.getSelectedLayers()] The layer. If omitted, will use all selected layers in the comp
 */
Duik.Layer.setLocation = function(location, layers) {
    layers = def(layers, DuAEComp.getSelectedLayers());
    layers = new DuList(layers);
    if (layers.length() == 0) return;

    for (var i = 0, n = layers.length(); i < n; i++) {
        var layer = layers.at(i);
        Duik.Layer.updateLocationMeta(layer, location);
        Duik.Layer.updateLocationName(layer, location);
    }
}

/**
 * Checks the character name this layer belongs to
 * @param {Layer} [layer=DuAEComp.getActiveLayer] The layer. If omitted, will check the first selected bone of the current comp
 * @returns {strng}
 */
Duik.Layer.groupName = function(layer) {
    layer = def(layer, DuAEComp.getActiveLayer());
    if (!layer) return '';

    // Split
    var name = layer.name;
    var match = name.match( Duik.Layer.NameRegExp.MAIN_NAME );
    if (!match) return '';
    if (!match[1]) return '';

    var group = match[1].split("|");
    if (group.length < 2) return '';
    group = DuString.trim(group[0]);

    // Must be in the corresponding group
    if (!DuGR.inGroups(layer, [group])) return '';
    return group;
}

/**
 * Sets the character name of the bone layer
 * @param {string} characterName The character name.
 * @param {Layer[]|LayerCollection|DuList.<Layer>|Layer} [layers=DuAEComp.getSelectedLayers()] The layer. If omitted, will use all selected layers in the comp
 */
Duik.Layer.setGroupName = function(newGroup, layers) {
    layers = def(layers, DuAEComp.getSelectedLayers());
    layers = new DuList(layers);
    if (layers.length() == 0) return;

    layers.do( function(layer) {
        Duik.Layer.updateGroupMeta(layer, newGroup);
        Duik.Layer.udpateGroupName(layer, newGroup);
    });
}

/**
 * Checks the limb name this layer belongs to
 * @param {Layer} [layer=DuAEComp.getActiveLayer] The layer. If omitted, will check the first selected bone of the current comp
 * @returns {DuColor}
 */
Duik.Layer.name = function(layer) {

    layer = def(layer, DuAEComp.getActiveLayer());
    if (!layer) return '';

    // Split
    var name = layer.name;
    var match = name.match( Duik.Layer.NameRegExp.MAIN_NAME );
    if (!match) return name;
    if (!match[1]) return '';

    var n = match[1].split("|");
    if (n.length < 2) return DuString.trim( n[0] );
    return DuString.trim( n[1] );
}

/**
 * Sets the limb name of the bone layer
 * @param {string} limbName The limb name.
 * @param {Layer[]|LayerCollection|DuList.<Layer>|Layer} [layers=DuAEComp.getSelectedLayers()] The layer. If omitted, will use all selected layers in the comp
 */
Duik.Layer.setName = function(newName, layers) {
    layers = def(layers, DuAEComp.getSelectedLayers());
    layers = new DuList(layers);
    if (layers.length() == 0) return;

    layers.do( function(layer) {

        Duik.Layer.updateNameMeta(layer, newName);
        Duik.Layer.udpateNameName(layer, newName);
    });
}

/**
 * Copies the attributes from a layer to another layer.
 * @param {Layer|Layer[]|LayerCollection|DuList.<Layer>} to The layer to set up
 * @param {Layer} from The source layer
 * @param {Duik.Layer.Type} type The type of the layer to set up
 */
Duik.Layer.copyAttributes = function(to, from, type) {
    to = new DuList(to);
    var side = Duik.Layer.side(from);
    var location = Duik.Layer.location(from);
    var characterName = Duik.Layer.groupName(from);
    var limbName = Duik.Layer.name(from);
    type = def(type, Duik.Layer.Type.NONE);

    for (var i = 0, n = to.length(); i < n; i++) {
        var layer = to.at(i);
        Duik.Layer.setAttributes(layer, type, limbName, side, location, characterName);
    }
}

/**
 * Sets all the attributes of the layer at once; this is the fastest method to set multiple attributes.
 * @param {Layer|Layer[]|LayerCollection|DuList.<Layer>} layer The layer to set up
 * @param {Duik.Layer.Type} type The type
 * @param {string} [name] The name of the limb/layer
 * @param {OCO.Side} [side=OCO.Side.NONE] The side
 * @param {OCO.Location} [location=OCO.Location.NONE] The location
 * @param {string} [groupName=""] The name of the character
 */
Duik.Layer.setAttributes = function(layer, type, name, side, location, groupName) {
    layer = new DuList(layer);
    
    name = def(name, '');
    side = def(side, OCO.Side.NONE);
    location = def(location, OCO.Location.NONE);
    groupName = def(groupName, '');
    
    for (var i = 0, n = layer.length(); i < n; i++) {
        var l = layer.at(i);

        // Get the name
        var newName = name;
        if (newName == '') newName = Duik.Layer.name(l);
        if (newName == '') newName = l.name;

        // Update the metadata
        Duik.Layer.updateTypeMeta(l, type);
        Duik.Layer.updateSideMeta(l, side);
        Duik.Layer.updateLocationMeta(l, location);
        Duik.Layer.updateGroupMeta(l, groupName);
        Duik.Layer.updateNameMeta(l, newName);

        // Rename the layer
        Duik.Layer.rename(l, type, groupName, newName, side, location);
    }
}

Duik.CmdLib['Layer']["Auto-Rename"] = "Duik.Layer.sanitize()";
/**
 * Sets default name to a layer so it can be correctly managed by Duik, and sets the groups, tags & other metadata
 * @param {Layer|LayerCollection|Layer[]|DuList.<Layer>} [layers] The layer(s). If omitted, will check the selected layers, or all layers, of the comp
 * @returns {string[]} Parts used in the name: [type, group, name, location, side]
 */
Duik.Layer.sanitize = function(layers) {
    layers = def(layers, DuAEComp.getSelectedLayers());
    layers = new DuList(layers);
    if (layers.length() == 0) {
        var comp = DuAEProject.getActiveComp();
        if (!comp) return;
        layers = new DuList(comp.layers);
    }
    if (layers.length() == 0) return;

    layers.do(function(layer) {
        // Sanitize the name
        var parts = Duik.Layer.sanitizeName(layer);
        // Updates the metadata
        Duik.Layer.updateTypeMeta(layer, parts[0]);
        Duik.Layer.updateGroupMeta(layer, parts[1]);
        Duik.Layer.updateNameMeta(layer, parts[2]);
        var loc = Duik.Layer.locationFromName(parts[3]);
        Duik.Layer.updateLocationMeta(layer, loc);
        var side = Duik.Layer.sideFromName(parts[4]);
        Duik.Layer.updateSideMeta(layer, side);
    });
}

Duik.CmdLib['Layer']["Edit Mode"] = "Duik.Layer.unlink()";
/**
 * Toggles the edit mode on selected layers
 * @param {Layer[]|LayerCollection|DuList.<Layer>|Layer} [layers=DuAEComp.getSelectedLayers()] The layer. If omitted, will use all selected layers in the comp
 */
Duik.Layer.unlink = function(layers) {
    layers = def(layers, DuAEComp.getSelectedLayers());
    layers = new DuList(layers);
    if (layers.length() == 0) return;

    DuAE.beginUndoGroup( i18n._("Toggle edit mode"));
    DuAEProject.setProgressMode(true);

    for (var i = 0, n = layers.length(); i < n; i++) {
        DuAELayer.toggleEditMode(layers.at(i));
    }

    DuAEProject.setProgressMode(false);
    DuAE.endUndoGroup();
}

// === LOW LEVEL ===

// Sets default name to a layer so it can be correctly managed by Duik.
// returns {string[]} Parts used in the name: [type, group, name, location, side]
Duik.Layer.sanitizeName = function(layer) {
    layer = def(layer, DuAEComp.getActiveLayer());
    if (!layer) return ['','','','',''];

    var oldName = layer.name;

    // Name : " Type < Group | Name > [Location] number"

    // We need to get: the type, the group, the name, the location, the side, and maybe a number
    var typeStr = '';
    var groupStr = '';
    var nameStr = '';
    var locStr = '';
    var sideStr = '';

    // Match to see what we get!
    var n = layer.name;
    var match = n.match(Duik.Layer.NameRegExp.SIMPLE);

    // returns the type prefix or an empty string
    function getType(testStr) {
        var testStrL = testStr.toLowerCase();
        
        var t = "";

        if (Duik.Layer.isTypePrefix(testStr)) t = testStr;
        // Try with common prefixes
        else if (testStrL == "c" || testStrL == "ctrl" || testStrL == "controller") t = Duik.Layer.Type.CONTROLLER;
        else if (testStrL == "cbg" || testStrL == "bgc") t = Duik.Layer.Type.CONTROLLER_BG;
        else if (testStrL == "b" || testStrL == "bone") t = Duik.Layer.Type.BONE;
        else if (testStrL == "pin") t = Duik.Layer.Type.PIN;
        else if (testStrL == "zero") t = Duik.Layer.Type.ZERO;
        else if (testStrL == "ik") t = Duik.Layer.Type.IK;
        else if (testStrL == "null") t = Duik.Layer.Type.NULL;
        else if (testStrL == "loc" || testStrL == "locator") t = Duik.Layer.Type.LOCATOR;
        else if (testStrL == "effctr" || testStrL == "fctr" || testStrL == "effector") t = Duik.Layer.Type.EFFECTOR;
        else if (testStrL == "aud" || testStrL == "audio") t = Duik.Layer.Type.AUDIO;
        else if (testStrL == "mt" || testStrL == "trail") t = Duik.Layer.Type.MOTION_TRAIL;
        else if (testStrL == "sol" || testStrL == "solid") t = Duik.Layer.Type.SOLID;
        else if (testStrL == "fx" || testStrL == "adj" || testStrL == "adjustment") t = Duik.Layer.Type.ADJUSTMENT;

        return t;
    }

    // Returns the parts of the array joined without location (which may be the name)
    // and sets locStr and sideStr
    function checkLoc(locArray) {
        var leftSuffix = Duik.Layer.sideName(OCO.Side.LEFT);
        var rightSuffix = Duik.Layer.sideName(OCO.Side.RIGHT);
        var frontSuffix = Duik.Layer.locationName(OCO.Location.FRONT);
        var backSuffix = Duik.Layer.locationName(OCO.Location.BACK);
        var tailSuffix = Duik.Layer.locationName(OCO.Location.TAIL);
        var midSuffix = Duik.Layer.locationName(OCO.Location.MIDDLE);
        var aboveSuffix = Duik.Layer.locationName(OCO.Location.ABOVE);
        var underSuffix = Duik.Layer.locationName(OCO.Location.UNDER);

        var leftSuffixTest = leftSuffix.toLowerCase();
        var rightSuffixTest = rightSuffix.toLowerCase();
        var frontSuffixTest = frontSuffix.toLowerCase();
        var backSuffixTest = backSuffix.toLowerCase();
        var tailSuffixTest = tailSuffix.toLowerCase();
        var midSuffixTest = midSuffix.toLowerCase();
        var aboveSuffixTest = aboveSuffix.toLowerCase();
        var underSuffixTest = underSuffix.toLowerCase();

        var foundSide = false;
        var foundLoc = false;

        for (var i = locArray.length-1; i >= 0; i--) {
            var test = locArray[i].toLowerCase();
            if (!foundSide) {
                if (test == leftSuffixTest) { 
                    sideStr = leftSuffix;
                    locArray.splice(i, 1);
                    continue;
                }
                if (test == rightSuffixTest) { 
                    sideStr = rightSuffix;
                    locArray.splice(i, 1);
                    continue;
                }
            }
            if (!foundLoc) {
                if (test == frontSuffixTest) { 
                    locStr = frontSuffix;
                    locArray.splice(i, 1);
                    continue;
                }
                if (test == backSuffixTest) { 
                    locStr = backSuffix;
                    locArray.splice(i, 1);
                    continue;
                }
                if (test == tailSuffixTest) { 
                    locStr = tailSuffix;
                    locArray.splice(i, 1);
                    continue;
                }
                if (test == midSuffixTest) { 
                    locStr = midSuffix;
                    locArray.splice(i, 1);
                    continue;
                }
                if (test == aboveSuffixTest) { 
                    locStr = aboveSuffix;
                    locArray.splice(i, 1);
                    continue;
                }
                if (test == underSuffixTest) { 
                    locStr = underSuffix;
                    locArray.splice(i, 1);
                    continue;
                }
            }
            if (foundSide && foundLoc) break;
        }

        return locArray.join(" ");
    }

    // It's a simple name
    if (match) {
        // Check the first part
        var g1 = DuString.trim( match[1] );
        var g2 = DuString.trim( match[2] );

        // g1 may be the type
        typeStr = getType(g1);
        // In this case, check the second part
        if (typeStr != "") {
            match = g2.match(Duik.Layer.NameRegExp.SIMPLE);
            g1 = DuString.trim( match[1] );
            g2 = DuString.trim( match[2] ); 
        }
        
        if (g2 == "") nameStr = g1;
        else {
            // g2 may contain the side/location
            g2 = checkLoc( DuString.split(g2, ["_","-", ".", " ", "|"]) );
            if (g2 == "") nameStr = g1;
            else {
                nameStr = g2;
                if (typeStr == "") groupStr = g1;
            }
        }
    }
    else {
        // Try with Duik name
        match = n.match(Duik.Layer.NameRegExp.DUIK_NAME)
        if (match) {
            var g1 = DuString.trim( match[1] );
            var g2 = DuString.trim( match[2] );
            var g3 = DuString.trim( match[3] );

            sideLocStr = DuString.trim( match[4] );
            numStr = DuString.trim( match[5] );

            sideLocArr = sideLocStr.split('.');
            if (sideLocArr.length > 1) {
                locStr = sideLocArr[0];
                sideStr = sideLocArr[1];
            }
            else {
                var sideTest = sideLocArr[0];
                if (Duik.Layer.isSideName(sideTest)) sideStr = sideTest;
                else locStr = sideTest;
            }

            if (g3 != "") {
                typeStr = g1;
                groupStr = g2;
                nameStr = g3;
            }
            else if (g2 != "") {
                typeStr = g1;
                nameStr = g2;
            }
            else {
                nameStr = g1;
            }
        }
        else {
            nameStr = n;
        }
    }

    // Remove number from Name
    nameStr = DuString.trimNumbers(nameStr);

    // Check the location

    if (locStr == "" && sideStr == "") {
        var nameArr = DuString.split(nameStr, ["_","-", ".", " ", "|"]);
        var nameStr = checkLoc(nameArr);
    }

    // Check the type
    if (typeStr == "") {
        var nameArr = DuString.split(nameStr, ["_","-", ".", " ", "|"]);
        for (var i = nameArr.length-1; i >= 0; i--) {
            var t = getType(nameArr[i]);
            if (t != "") {
                typeStr = t;
                nameArr.splice(i, 1);
                break;
            }
        }
        nameStr = nameArr.join(" ");
    }

    // A bit of cleaning
    nameStr = Duik.Layer.cleanName(nameStr);
    groupStr = Duik.Layer.cleanName(groupStr);

    // Build the new Name
    var newName = typeStr;
    if (newName != "") newName += " ";
    newName += "< ";
    if (groupStr) newName += groupStr + " | ";
    newName += nameStr + " >";

    var sideLocStr = '';
    if (locStr != '') {
        sideLocStr = locStr;
        if (sideStr != '') sideLocStr += '.';
    }
    sideLocStr += sideStr;
    if (sideLocStr != '') newName += ' [' + sideLocStr + ']';

    DuAELayer.rename(layer, newName);

    return [typeStr,groupStr,nameStr,locStr,sideStr];
}

// Low-level undocumented
// Returns the part to use in a layer name with side and location 
Duik.Layer.sideLocName = function(side, location) {

    var n = '';
    if (location == OCO.Location.NONE && side == OCO.Side.NONE) return n;

    if (location != OCO.Location.NONE) {
        n = Duik.Layer.locationName(location);
        if (side != OCO.Side.NONE) n += '.';
    }

    if (side != OCO.Side.NONE) n += Duik.Layer.sideName(side);

    return n;
}

// Returns the suffix to be used in a layer name
Duik.Layer.sideName = function (side) {
    if (side == OCO.Side.NONE) return '';
    if (side == OCO.Side.LEFT) return i18n._p('layer name', "L"); /// TRANSLATORS: Short for Left, must be short enough to be used as a tag in layer names
    if (side == OCO.Side.RIGHT) return i18n._p('layer name', "R"); /// TRANSLATORS: Short for Right, must be short enough to be used as a tag in layer names
    return '';
}

// Checks if the string represents a side name suffix
Duik.Layer.isSideName = function(str) {
    if (str == Duik.Layer.sideName(OCO.Side.LEFT)) return true;
    if (str == Duik.Layer.sideName(OCO.Side.RIGHT)) return true;
    return false;
}

// Returns the suffix to be used in a layer name
Duik.Layer.locationName = function(location) {
    if (location == OCO.Location.NONE) return '';
    if (location == OCO.Location.FRONT) return i18n._p('layer name', "Fr"); /// TRANSLATORS: Short for Front, must be short enough to be used as a tag in layer names
    if (location == OCO.Location.BACK) return i18n._p('layer name', "Bk"); /// TRANSLATORS: Short for Back, must be short enough to be used as a tag in layer names
    if (location == OCO.Location.TAIL) return i18n._p('layer name', "Tl"); /// TRANSLATORS: Short for Tail, must be short enough to be used as a tag in layer names
    if (location == OCO.Location.MIDDLE) return i18n._p('layer name', "Md"); /// TRANSLATORS: Short for Middle, must be short enough to be used as a tag in layer names
    if (location == OCO.Location.ABOVE) return i18n._p('layer name', "Ab"); /// TRANSLATORS: Short for Above, must be short enough to be used as a tag in layer names
    if (location == OCO.Location.UNDER) return i18n._p('layer name', "Un"); /// TRANSLATORS: Short for Under, must be short enough to be used as a tag in layer names
    return '';
}

Duik.Layer.locationFromName = function(str) {
    if (str == Duik.Layer.locationName(OCO.Location.FRONT)) return OCO.Location.FRONT;
    if (str == Duik.Layer.locationName(OCO.Location.BACK)) return OCO.Location.BACK;
    if (str == Duik.Layer.locationName(OCO.Location.TAIL)) return OCO.Location.TAIL;
    if (str == Duik.Layer.locationName(OCO.Location.MIDDLE)) return OCO.Location.MIDDLE;
    if (str == Duik.Layer.locationName(OCO.Location.ABOVE)) return OCO.Location.ABOVE;
    if (str == Duik.Layer.locationName(OCO.Location.UNDER)) return OCO.Location.UNDER;
    return OCO.Location.NONE;
}

Duik.Layer.sideFromName = function(str) {
    if (str == Duik.Layer.sideName(OCO.Side.LEFT)) return OCO.Side.LEFT;
    if (str == Duik.Layer.sideName(OCO.Side.RIGHT)) return OCO.Side.RIGHT;
    return OCO.Side.None;
}

// Generates the name for a layer using all attributes
Duik.Layer.generateName = function(type, group, name, side, location) {
    type = def(type, "");
    group = def(group, "");
    side = def(side, OCO.Side.NONE);
    location = def(location, OCO.Location.NONE);
    var newName = type;
    if (newName != "") newName += " ";
    newName += "< ";
    if (group != "") newName += group + " | ";
    newName += name + " >";
    var locStr = Duik.Layer.sideLocName(side, location);
    if (locStr != "") newName += " [" + locStr + "]";
    return newName;
}

// Renames the layer using all attributes
Duik.Layer.rename = function(layer, type, group, name, side, location) {

    DuAELayer.rename(
        layer,
        Duik.Layer.generateName(
            type,
            group,
            name,
            side,
            location
        )
    );

}

// Sets all the metadata for the given type. Does not update the layer name.
Duik.Layer.updateTypeMeta = function(layer, type) {

    // In case this is an AE type (null, adjustment, solid)...
    // Let DuAEF handle this
    DuAELayer.setType(type, layer);
        
    // Remove known groups
    DuAETag.removeGroup(layer, i18n._("Controller"));
    DuAETag.removeGroup(layer, i18n._("Bone"));
    DuAETag.removeGroup(layer, i18n._("Pin"));
    DuAETag.removeGroup(layer, i18n._("Zero"));
    DuAETag.removeGroup(layer, i18n._("Locator"));
    DuAETag.removeGroup(layer, i18n._("Effector"));
    DuAETag.removeGroup(layer, i18n._("Audio spectrum"));
    DuAETag.removeGroup(layer, i18n._("Motion trail"));
    DuAETag.removeGroup(layer, i18n._("Celluloid"));
    DuAETag.removeGroup(layer, i18n._("X-Sheet"));

    if (type == Duik.Layer.Type.BONE) {
        DuAETag.addGroup(layer, i18n._("Bone"));
        layer.label = 7;
        layer.guideLayer = true;
        layer.quality = LayerQuality.DRAFT;
    } else if (type == Duik.Layer.Type.PIN) {
        layer.guideLayer = true;
        DuAETag.addGroup(layer, i18n._("Pin"));
    } else if (type == Duik.Layer.Type.CONTROLLER) {
        DuAETag.addGroup(layer, i18n._("Controller"));
        layer.guideLayer = true;
        layer.label = 9;
        var ctrlMode = OCO.config.get('after effects/controller layer type', Duik.Controller.LayerMode.SHAPE);
        if (ctrlMode == Duik.Controller.LayerMode.DRAFT_SHAPE) layer.quality = LayerQuality.DRAFT;
    } else if (type == Duik.Layer.Type.CONTROLLER_BG) {
        DuAETag.addGroup(layer, i18n._("Controller"));
        layer.guideLayer = true;
        if (Duik.Controller.draft) ctrl.quality = LayerQuality.DRAFT;
    } else if (type == Duik.Layer.Type.ZERO) {
        DuAETag.addGroup(layer, i18n._("Zero"));
        layer.guideLayer = true;
    } else if (type == Duik.Layer.Type.IK) {
        layer.guideLayer = true;
    } else if (type == Duik.Layer.Type.LOCATOR) {
        layer.guideLayer = true;
        DuAETag.addGroup(layer, i18n._("Locator"));
    } else if (type == Duik.Layer.Type.EFFECTOR) {
        DuAETag.addGroup(layer, i18n._("Effector"));
        layer.guideLayer = true;
        layer.label = 9;
    } else if (type == Duik.Layer.Type.AUDIO) {
        DuAETag.addGroup(layer, i18n._("Audio spectrum"));
        layer.guideLayer = true;
        layer.label = 9;
    } else if (type == Duik.Layer.Type.MOTION_TRAIL) {
        DuAETag.addGroup(layer, i18n._("Motion trail"));
    } else if (type == Duik.Layer.Type.CEL) {
        DuAETag.addGroup(layer, i18n._("Celluloid"));
    } else if (type == Duik.Layer.Type.X_SHEET) {
        DuAETag.addGroup(layer, i18n._("X-Sheet"));
    }
}

// Updates the type prefix in the layer name
Duik.Layer.updateTypeName = function(layer, type) {
    Duik.Layer.sanitizeName(layer);
    var name = layer.name;

    var nameArr = name.split("<");
    nameArr[0] = type + " ";
    name = nameArr.join("<");
    return DuAELayer.rename(layer, name);
}

// Sets all the metadata for the given side. Does not update the layer name.
Duik.Layer.updateSideMeta = function(layer, side) {

    // Remove known groups
    DuAETag.removeGroup(layer, i18n._("Left"));
    DuAETag.removeGroup(layer, i18n._("Right"));

    // Add new
    if (side == OCO.Side.RIGHT) DuAETag.addGroup(layer, i18n._("Right"));
    else if (side == OCO.Side.LEFT) DuAETag.addGroup(layer, i18n._("Left"));
}

// Updates the side suffix in the layer name
Duik.Layer.updateSideName = function(layer, side) {

    Duik.Layer.sanitizeName(layer);
    var name = layer.name;

    // Update name

    var match = layer.name.match(Duik.Layer.NameRegExp.LOCATION);
    var sideSuffix = Duik.Layer.sideName(side);

    if (match) {

        var suffix = '';
        var suffixArr = match[1].split('.');

        var locSuffix = suffixArr[0];
        if (Duik.Layer.isSideName(locSuffix)) locSuffix = '';

        if (locSuffix != '') {
            suffix = locSuffix;
            if (sideSuffix != '') suffix += '.';
        }
        suffix += sideSuffix;

        if (suffix != '') suffix = '[' + suffix + ']';
        name = name.replace( '[' + match[1] + ']', suffix);
    }
    else if (sideSuffix != '') {
        name = DuString.trimNumbers(name);
        name += " [" + sideSuffix + "]";
    }

    return DuAELayer.rename(layer, name);
}

// Sets all the metadata for the given location. Does not update the layer name.
Duik.Layer.updateLocationMeta = function(layer, location) {

    // Remove known groups
    DuAETag.removeGroup(layer, i18n._("Front"));
    DuAETag.removeGroup(layer, i18n._("Back"));
    DuAETag.removeGroup(layer, i18n._("Tail"));
    DuAETag.removeGroup(layer, i18n._("Middle"));
    DuAETag.removeGroup(layer, i18n._("Above"));
    DuAETag.removeGroup(layer, i18n._("Under"));
    
    // Add new
    if (location == OCO.Location.FRONT)
        DuAETag.addGroup(layer, i18n._("Front"));
    else if (location == OCO.Location.BACK)
        DuAETag.addGroup(layer, i18n._("Back"));
    else if (location == OCO.Location.TAIL)
        DuAETag.addGroup(layer, i18n._("Tail"));
    else if (location == OCO.Location.MIDDLE)
        DuAETag.addGroup(layer, i18n._("Middle"));
    else if (location == OCO.Location.ABOVE)
        DuAETag.addGroup(layer, i18n._("Above"));
    else if (location == OCO.Location.UNDER)
        DuAETag.addGroup(layer, i18n._("Under"));     
}

Duik.Layer.updateLocationName = function(layer, location) {
    Duik.Layer.sanitizeName(layer);
    var name = layer.name;

    var match = name.match(Duik.Layer.NameRegExp.LOCATION);
    var locSuffix = Duik.Layer.locationName(location);

    if (match) {

        var suffix = '';
        var suffixArr = match[1].split('.');

        var sideSuffix = '';
        if (suffixArr.length > 1) sideSuffix = suffixArr[1];
        else if (Duik.Layer.isSideName(suffixArr[0])) sideSuffix = suffixArr[0];

        if (locSuffix != '') {
            suffix = locSuffix;
            if (sideSuffix != '') suffix += '.';
        }
        suffix += sideSuffix;

        if (suffix != '') suffix = '[' + suffix + ']';
        name = name.replace( '[' + match[1] + ']', suffix);
    }
    else if (locSuffix != '') {
        name = DuString.trimNumbers(name);
        name += " [" + locSuffix + "]";
    }

    return DuAELayer.rename(layer, name);

}

// Sets all the metadata for the given group name. Does not update the layer name.
Duik.Layer.updateGroupMeta = function(layer, group) {

    var oldGroup = Duik.Layer.groupName(layer);
    if (oldGroup != '') DuAETag.removeGroup(layer,oldGroup);
    if (group != '-' && group != '') DuAETag.addGroup(layer, group);
}

// Updates the group name part of the layer name
Duik.Layer.udpateGroupName = function(layer, group) {
    Duik.Layer.sanitizeName(layer);
    var name = layer.name;

    var nArr = [];
    if (group != "") nArr = [group];
    var match = name.match( Duik.Layer.NameRegExp.MAIN_NAME );
    if (match && match[1]) {
        var n = match[1].split("|");
        if (n.length < 2) nArr.push( DuString.trim(n[0]) );
        else nArr.push( DuString.trim(n[1]) );

        n = nArr.join(" | ")  + " ";
        name = name.replace( match[1], n);
        return DuAELayer.rename(layer, name);
    }
}

// Sets all the metadata for the given name. Does not update the layer name.
Duik.Layer.updateNameMeta = function(layer, group) {
    // Nothing to do for now
}

// Updates the name part of the layer name
Duik.Layer.udpateNameName = function(layer, newName) {
    Duik.Layer.sanitizeName(layer);
    var name = layer.name;

    var match = name.match( Duik.Layer.NameRegExp.MAIN_NAME );
    var nArr = [];
    if (match && match[1]) {
        var n = match[1].split("|");
        if ( n.length > 1 ) nArr.push( DuString.trim(n[0]) );
        nArr.push( newName );
        n = nArr.join(" | ") + " ";
        name = name.replace( match[1], n);
        return DuAELayer.rename(layer, name);
    }

}

// Removes forbidden characters from the (group) name
Duik.Layer.cleanName = function(str) {
    str = DuString.replace(str, " >", "");
    str = DuString.replace(str, "< ", "");
    str = DuString.replace(str, "<", "-");
    str = DuString.replace(str, ">", "-");
    str = DuString.replace(str, "|", "-");
    str = DuString.replace(str, "[", "-");
    str = DuString.replace(str, "]", "-");
    str = DuString.replace(str, "  ", " ");
    str = DuString.trim(str);
    return str;
}