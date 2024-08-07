﻿/**
    * Some (localized) bone names
    * @enum {string[]}
*/
OCO.BoneName = {};

OCO.aeInit = function() {
    OCO.BoneName[OCO.Bone.CLAVICLE] = [
        i18n._p("anatomy", "clavicle"),
        i18n._p("anatomy", "shoulder"),
        i18n._p("anatomy", "shoulder blade"),
        i18n._p("anatomy", "scapula")
        ];
    OCO.BoneName[OCO.Bone.HUMERUS] = [
        i18n._p("anatomy", "humerus"),
        i18n._p("anatomy", "arm")
        ];
    OCO.BoneName[OCO.Bone.RADIUS] = [
        i18n._p("anatomy", "radius"), /// TRANSLATORS: the bone in the forearm, next to the ulna
        i18n._p("anatomy", "ulna"),
        i18n._p("anatomy", "forearm")
        ];
    OCO.BoneName[OCO.Bone.CARPUS] = [
        i18n._p("anatomy", "carpus"),
        i18n._p("anatomy", "hand")
        ];
    OCO.BoneName[OCO.Bone.FINGER] = [
        i18n._p("anatomy", "finger"),
        i18n._p("anatomy", "fingers"),
        i18n._p("anatomy", "claws"),
        i18n._p("anatomy", "claw"),
        i18n._p("anatomy", "hoof")
        ];
    OCO.BoneName[OCO.Bone.HEEL] = [
        i18n._p("anatomy", "heel")
        ];
    OCO.BoneName[OCO.Bone.FEMUR] = [
        i18n._p("anatomy", "femur"),
        i18n._p("anatomy", "thigh"),
        i18n._p("anatomy", "leg")
        ];
    OCO.BoneName[OCO.Bone.TIBIA] = [
        i18n._p("anatomy", "tibia"),
        i18n._p("anatomy", "shin"),
        i18n._p("anatomy", "calf"),
        i18n._p("anatomy", "fibula")
        ];
    OCO.BoneName[OCO.Bone.TARSUS] = [
        i18n._p("anatomy", "tarsus"),
        i18n._p("anatomy", "foot")
        ];
    OCO.BoneName[OCO.Bone.TOE] = [
        i18n._p("anatomy", "toe"),
        i18n._p("anatomy", "toes")
        ];
    OCO.BoneName[OCO.Bone.HIPS] = [
        i18n._p("anatomy", "hips")
        ];
    OCO.BoneName[OCO.Bone.SPINE] = [
        i18n._p("anatomy", "spine")
        ];
    OCO.BoneName[OCO.Bone.SNAKE_SPINE_ROOT] = OCO.BoneName[OCO.Bone.SPINE];
    OCO.BoneName[OCO.Bone.SNAKE_SPINE_MID] = OCO.BoneName[OCO.Bone.SPINE];
    OCO.BoneName[OCO.Bone.SNAKE_SPINE_END] = OCO.BoneName[OCO.Bone.SPINE];
    OCO.BoneName[OCO.Bone.FISH_SPINE_ROOT] = OCO.BoneName[OCO.Bone.SPINE];
    OCO.BoneName[OCO.Bone.FISH_SPINE_MID] = OCO.BoneName[OCO.Bone.SPINE];
    OCO.BoneName[OCO.Bone.FISH_SPINE_END] = OCO.BoneName[OCO.Bone.SPINE];
    OCO.BoneName[OCO.Bone.TORSO] = [
        i18n._p("anatomy", "torso"),
        i18n._p("anatomy", "lungs"),
        i18n._p("anatomy", "body"),
        i18n._p("anatomy", "chest"),
        i18n._p("anatomy", "ribs"),
        i18n._p("anatomy", "rib")
        ];
    OCO.BoneName[OCO.Bone.NECK] = [
        i18n._p("anatomy", "neck")
        ];
    OCO.BoneName[OCO.Bone.SKULL] = [
        i18n._p("anatomy", "skull"),
        i18n._p("anatomy", "head")
        ];
    OCO.BoneName[OCO.Bone.TAIL] = [
        i18n._p("anatomy", "tail")
        ];
    OCO.BoneName[OCO.Bone.TAIL_ROOT] = OCO.BoneName[OCO.Bone.TAIL];
    OCO.BoneName[OCO.Bone.TAIL_MID] = OCO.BoneName[OCO.Bone.TAIL];
    OCO.BoneName[OCO.Bone.TAIL_END] = OCO.BoneName[OCO.Bone.TAIL];
    OCO.BoneName[OCO.Bone.FEATHER] = [
        i18n._p("anatomy", "feather")
        ];
    OCO.BoneName[OCO.Bone.HAIR] = [
        i18n._p("anatomy", "hair"),
        i18n._p("anatomy", "strand")
        ];
    OCO.BoneName[OCO.Bone.HAIR_ROOT] = OCO.BoneName[OCO.Bone.HAIR];
    OCO.BoneName[OCO.Bone.HAIR_MID] = OCO.BoneName[OCO.Bone.HAIR];
    OCO.BoneName[OCO.Bone.HAIR_END] = OCO.BoneName[OCO.Bone.HAIR];
    OCO.BoneName[OCO.Bone.FIN] = [
        i18n._p("anatomy", "fin")
        ];
    OCO.BoneName[OCO.Bone.FIN_FISHBONE] = [
        i18n._p("anatomy", "fish bone"),
        i18n._p("anatomy", "fishbone")
        ];
}
DuESF.initMethods.push(OCO.aeInit);

/**
 * Creates an OCO doc from the given composition.
 * @param {string} [name] The name of the character. If omitted, will use the comp name.
 * @param {CompItem} [comp=DuAEProject.getActiveComp()] The composition
 * @param {Layer[]} [layers=Duik.Bone.get(false)] The layers to include as bones in the doc
 * @param {float} [characterTop] The max Y coordinate of the character, in px in the comp
 * @param {float[]} [characterCenterOfMass] The coordinates of center of mass of the character, in px in the comp
 * @param {float} [ground] The Y coordinate of the ground, in px in the comp
 * @param {float} [height=185] The height of the character, in cm
 * @return {DoOCODoc} The new doc
 */
OCODoc.fromComp = function( name, comp, layers, characterTop, characterCenterOfMass, ground, height )
{
    comp = def(comp, DuAEProject.getActiveComp());
    height = def(height, 185);

    if (!comp) return new OCODoc( name );

    if (typeof name === 'undefined')
    {
        var compStr = localize("$$$/AE/BEE/LStr/0005=composition");
        if (comp.name.toLowerCase().indexOf(compStr) == 0) name = "";
        else if (comp.name.toLowerCase().indexOf('comp') == 0) name = "";
        else name = comp.name;
    }

    layers = def(layers, Duik.Bone.get(false, comp));
   
    var doc = new OCODoc( name );
    doc.resolution = [comp.width, comp.height];

    // Set the default params

    doc.height = height;

    if (layers.length == 0) {
        // Coordinates
        var top = def(characterTop, comp.height * .3 );
        var center = def(characterCenterOfMass, [comp.width/2, comp.height*.51]);
        var bottom = def(ground, comp.height*.8);
        
        // the height in px, divided by the height in cm
        doc.pixelsPerCm = (bottom-top) / height;
        // Vertical of the center of mass
        doc.world = [center[0], bottom];
        // Empty, no width
        doc.width = 0;
        // Max Y coordinate
        doc.centerOfMass = doc.fromPixels( center );

        return doc;
    }

    var bottom = def(ground, 0); // The lowest leg tip Y coordinate if we find it.
    var top = def(characterTop, comp.height); // The highest point
    var characterName = ""; // The first character name we find
    var bounds = [comp.width,comp.height,0,0]; // The bounds left, top, right, bottom, needed to find the center of mass

    // Collect limbs
    var limbs = Duik.Bone.getLimbs(layers);

    if (limbs.length == 0) return doc;
    
    // Get the character name and find the lowest foot
    function findNameAndBounds(limbArray)
    {
        for (var i = 0, ni = limbArray.length; i < ni; i++)
        {
            var bone = limbArray[i];

            if (characterName == "") characterName = Duik.Layer.groupName(bone);

            var pos = DuAELayer.getWorldPos(bone);

            // Find a leg tip
            var limbType = DuAETag.getValue( bone, DuAETag.Key.DUIK_LIMB, DuAETag.Type.STRING );
            if (limbType == OCO.Limb.LEG)
            {
                var boneType = DuAETag.getValue( bone, DuAETag.Key.DUIK_BONE_TYPE, DuAETag.Type.STRING );
                if (boneType == OCO.Bone.TIP)
                {
                    if (pos[1] > bottom) bottom = pos[1];
                }
            }
            if (pos[1] < top) top = pos[1];
            if (pos[0] < bounds[0]) bounds[0] = pos[0];
            else if (pos[0] > bounds[2]) bounds[2] = pos[0];
            if (pos[1] < bounds[1]) bounds[1] = pos[1];
            else if (pos[1] > bounds[3]) bounds[3] = pos[1];
            
            // Try with children limbs
            for (var j = 0, nj = bone.childLimbs.length; j < nj; j++)
            {
                findNameAndBounds( bone.childLimbs[j] );
            }
        }
    }

    for (var i = 0, ni = limbs.length; i < ni; i++)
    {
        findNameAndBounds( limbs[i] );
    }

    if (characterName == "") characterName = name;

    // Complete doc params
    if (bottom == 0) bottom = bounds [2];
    var center = ([bounds[0], bounds[1]] + [bounds[2], bounds[3]]) / 2;
    center = def(characterCenterOfMass, center);

    doc.pixelsPerCm = (bottom-top) / height;
    doc.world = [center[0], bottom];
    doc.centerOfMass = doc.fromPixels( center );
    doc.width = (bounds[2] - bounds[0]) / doc.pixelsPerCm;
    doc.name = characterName;

    // Add limbs to the doc
    function createLimb( limbArray, parent )
    {
        if (limbArray.length == 0) return;
        var rootBone = limbArray[0];

        var limb = DuAETag.getValue( rootBone, DuAETag.Key.DUIK_LIMB, DuAETag.Type.STRING );
        var side = Duik.Layer.side(rootBone);
        var location = Duik.Layer.location(rootBone);
        var limbType = DuAETag.getValue( rootBone, DuAETag.Key.DUIK_LIMB_TYPE, DuAETag.Type.STRING );

        // Create the limb
        l = parent.newLimb(limb, side, location, limbType);

        // Create bones
        var newBones = [];
        for (var i = 0, ni = limbArray.length; i < ni; i++)
        {
            var bLayer = limbArray[i];
            var bone = OCOBone.fromComp( bLayer, doc );
            newBones.push(bone);
        }

        // Sort & create child limbs
        for (var i = 0, ni = newBones.length; i < ni; i++)
        {
            var bone = newBones[i];
            var bLayer = bone.layer;

            // Push the bone to its parent children list
            var found = false;
            for (var j = 0, nj = newBones.length; j < nj; j++)
            {
                var nBone =  newBones[j];
                var nLayer = nBone.layer;
                if (bLayer.parent == nLayer)
                {
                    found = true;
                    nBone.children.push(bone);
                    break;
                }
            }
            if (!found) l.armature.push(bone);

            // Create children limbs
            for (var j = 0, nj = bLayer.childLimbs.length; j < nj; j++)
            {
                createLimb( bLayer.childLimbs[j], bone);
            }
        }
    }

    for (var i = 0, ni = limbs.length; i < ni; i++)
    {
        createLimb(limbs[i], doc);
    }

    // Normalize z indices
    doc.normalizeZIndices();

    return doc;
}

/**
 * Creates the limbs and armatures in the comp
 * @param {CompItem} [comp] The composition to use. If omitted, creates a new composition.
 * @param {float} [duration=60.0] The duration of the new comp, in seconds.
 * @param {frameRate} [float=24.0] The frame rate of the new comp.
 * @return {Layer[]} The new layers
 */
OCODoc.prototype.toComp = function( comp, duration, frameRate )
{
    duration = def(duration, 60);
    frameRate = def(frameRate, 24);

    if (typeof comp === 'undefined') comp = app.project.items.addComp( this.name, this.resolution[0], this.resolution[1], 1.0, duration, frameRate);
    if (!comp) return;

    DuScriptUI.progressBar.stg(i18n._("Building OCO character:") + " " + this.name); /// TRANSLATORS: OCO Means "Open Cut-Out" format, but let's keep OCO in all languages, as ".oco" is the corresponding file extension.
    DuScriptUI.progressBar.addMax(this.numBones()+1);

    // Normalize z indices
    this.normalizeZIndices();

    var layers = [];
    // For each limb
    for(var i = 0, n = this.limbs.length; i < n; i++)
    {
        layers = layers.concat( this.limbs[i].toComp( this, comp ) );
    }

    // Move according to the z-index
    DuScriptUI.progressBar.stg(i18n._("Sorting bones..."));
    var allBones = this.getBones();
    for(var i = allBones.length - 1; i >= 0; i--)
    {
        allBones[i].layer.moveToBeginning();
    }

    return layers;
}

/**
 * Creates the limb and armatures in the comp
 * @param {OCODoc} doc The doc containing the limb.
 * @param {CompItem} [comp=DuAEProject.getActiveComp()] The composition to use.
 * @param {Layer} [parentLayer=null] The parent layer of the bone.
 * @param {int} [limbId] A Unique identifier for this armature. If omitted, a new one will be assigned.
 * @return {Layer[]} The new layers
 */
OCOLimb.prototype.toComp = function( doc, comp, parentLayer, limbId )
{
    comp = def(comp, DuAEProject.getActiveComp());
    if (!comp) return;

    DuScriptUI.progressBar.hit(undefined, "Creating limb: " + this.limb);

    parentLayer = def(parentLayer, null);
    limbId = def(limbId, new Date().getTime() );

    var layers = [];
    var boneIndex = 0;
    for (var i = 0, n = this.armature.length; i < n; i++)
    {
        layers = layers.concat( this.armature[i].toComp( doc, this, comp, parentLayer, limbId, boneIndex ) );
    }
    return layers;
}

/**
 * Creates a new chain of bones located on the vertices of the path.
 * @param {OCODoc} doc The doc containing the limb.
 * @param {string} name The name of the bones (will increment if needed)
 * @param {PropertyGroup|DuAEProperty} pathProp The path property (either an "ADBE Vector Shape - Group" or an "ADBE Mask Atom")
 * @returns {OCOBone} The root bone of the new chain
 */
OCOLimb.prototype.armatureFromPath = function( doc, name, pathProp )
{
    pathProp = new DuAEProperty(pathProp);
    var vertices = pathProp.verticesToComp( );

    var b = null;
    var root = null;
    var names = [];

    // Create for each vertex
    for(var i = 0, n = vertices.length; i < n; i++)
    {
        var vertex = vertices[i];
        var boneName = DuString.generateUnique(name, names);
        var bone = new OCOBone( boneName );
        names.push(boneName);
        var coord = doc.fromPixels( vertex );
        bone.x = coord[0];
        bone.y = coord[1];
        if (b != null)
        {
            bone.attached = true;
            b.children.push( bone );
            b = bone;
        }
        else
        {
            this.armature.push( bone );
            root = bone;
            b = bone;
        }
    }

    return root;
}

/**
 * Moves the armature of the limb to the vertices of the path.
 * @param {OCODoc} doc The doc containing the limb.
 * @param {PropertyGroup|DuAEProperty} pathProp The path property (either an "ADBE Vector Shape - Group" or an "ADBE Mask Atom")
 */
OCOLimb.prototype.moveArmatureToPath = function( doc, pathProp )
{
    if (this.armature.length == 0) return;

    pathProp = new DuAEProperty(pathProp);
    var vertices = pathProp.verticesToComp( );

    var b = null;

    // For each vertex
    for(var i = 0, n = vertices.length; i < n; i++)
    {
        var vertex = vertices[i];

        if (b == null) b = this.armature[0];
        else 
        {
            if (b.children.length == 0) return;
            b = b.children[0];
        }

        var coord = doc.fromPixels( vertex );
        b.x = coord[0];
        b.y = coord[1];
    }
}

/**
 * Moves the armature of the limb to the puppet pins.
 * @param {OCODoc} doc The doc containing the limb.
 * @param {Property[]|DuAEProperty[]} pins The puppet pins
 */
OCOLimb.prototype.moveArmatureToPuppetPins = function( doc, pins )
{
    if (this.armature.length == 0) return;

    var b = null;

    // Create for each pin
    for (var i = 0, n = pins.length; i < n; i++)
    {
        if (b == null) b = this.armature[0];
        else 
        {
            if (b.children.length == 0) return;
            b = b.children[0];
        }

        var pin = new DuAEProperty( pins[i] );
        var pinProp = pin.getProperty();

        if ( pinProp.matchName == "ADBE FreePin3 PosPin Atom" )
        {
            pinProp = pinProp.property( "ADBE FreePin3 PosPin Position" );
        }

        var pinPos = DuAELayer.getWorldPos( pin.layer, pinProp.value );
        if( pin.layer instanceof ShapeLayer ) pinPos = pinProp.value;
        pinPos = doc.fromPixels( pinPos );
        b.x = pinPos[0];
        b.y = pinPos[1];
    }
}

/**
 * Creates a new chain of bones located on the puppet pins.
 * @param {OCODoc} doc The doc containing the limb.
 * @param {string} name The name of the bones (will increment if needed)
 * @param {Property[]|DuAEProperty[]} pins The puppet pins
 * @returns {OCOBone} The root bone of the new chain
 */
OCOLimb.prototype.armatureFromPuppetPins = function( doc, name, pins )
{
    var b = null;
    var root = null;
    var names = [];

    // Create for each pin
    for (var i = 0, n = pins.length; i < n; i++)
    {
        var boneName = DuString.generateUnique(name, names);
        var bone = new OCOBone( boneName );
        names.push(boneName);

        var pin = new DuAEProperty( pins[i] );
        var pinProp = pin.getProperty();

        if ( pinProp.matchName == "ADBE FreePin3 PosPin Atom" )
        {
            pinProp = pinProp.property( "ADBE FreePin3 PosPin Position" );
        }

        var pinPos = DuAELayer.getWorldPos( pin.layer, pinProp.value );
        if( pin.layer instanceof ShapeLayer ) pinPos = pinProp.value;
        pinPos = doc.fromPixels( pinPos );
        bone.x = pinPos[0];
        bone.y = pinPos[1];

        if (b != null)
        {
            bone.attached = true;
            b.children.push( bone );
            b = bone;
        }
        else
        {
            this.armature.push( bone );
            root = bone;
            b = bone;
        }
    }

    return root;
}

/**
 * Moves the armature of the limb to the layers.
 * @param {OCODoc} doc The doc containing the limb.
 * @param {Layer[]|LayerCollection} layers The layers
 */
OCOLimb.prototype.moveArmatureToLayers = function( doc, layers )
{
    var b = null;

    var it = new DuList(layers);

    // Check if there are layers at the same location
    // To prevent moving structures if there are mulitple anchor points at the same place
    var moveLayers = true;
    var layer;
    while (layer = it.next()) {
        var pos = DuAELayer.getWorldPos( layer );
        pos = new DuList( pos );
        for (var i = it.current + 1, n = it.length(); i < n; i++)
        {
            var layer2 = it.at(i);
            var pos2 = DuAELayer.getWorldPos( layer2 );     
            if ( pos.equals( pos2, undefined, 0 ) ) return;
        }
    }

    // For each anchor point
    it.reinitIterator();
    while (layer = it.next()) {

        if (b == null) b = this.armature[0];
        else 
        {
            if (b.children.length == 0) return;
            b = b.children[0];
        }
        
        var pos = DuAELayer.getWorldPos( layer );
        pos = doc.fromPixels(pos);

        b.translateTo( pos[0], pos[1] );
    };
}

/**
 * Creates a new chain of bones located on the layer anchor points.
 * @param {OCODoc} doc The doc containing the limb.
 * @param {string} name The name of the bones (will increment if needed)
 * @param {Layer[]|LayerCollection} layers The layers
 * @returns {OCOBone} The root bone of the new chain
 */
OCOLimb.prototype.armatureFromLayers = function( doc, name, layers )
{
    var b = null;
    var root = null;
    var names = [];

    var it = new DuList(layers);

    // Check if there are layers at the same location
    // To prevent moving structures if there are mulitple anchor points at the same place
    var moveLayers = true;
    var layer;
    while (layer = it.next()) {
        var pos = DuAELayer.getWorldPos( layer );
        pos = new DuList( pos );
        for (var i = it.current + 1, n = it.length(); i < n; i++)
        {
            var layer2 = it.at(i);
            var pos2 = DuAELayer.getWorldPos( layer2 );     
            if ( pos.equals( pos2, undefined, 0 ) )
            {
                moveLayers = false;
                break;
            }
        }
        if ( !moveLayers ) break;
    }

    // Create for each anchor point
    var num = it.length();
    var boneLength = 100.0 / (num-1);
    var x = -50;
    it.reinitIterator();
    while (layer = it.next()) {
        var boneName = DuString.generateUnique(name, names);
        var bone = new OCOBone( boneName );
        names.push(boneName);
        
        if (moveLayers)
        {
            var pos = DuAELayer.getWorldPos( layer );
            pos = doc.fromPixels(pos);

            bone.x = pos[0];
            bone.y = pos[1];
        }
        else 
        {
            bone.x = x;
            bone.y = 100;
            x += boneLength;
        }

        if (b != null)
        {
            bone.attached = true;
            b.children.push( bone );
            b = bone;
        }
        else
        {
            this.armature.push( bone );
            root = bone;
            b = bone;
        }
    };

    return root;
}

/**
 * Gets the After Effects layers representing this limb
 * @return {Layer[]} May be an empty array if this limb has not been created in After Effects yet
 */
OCOLimb.prototype.getLayers = function()
{
    var layers = [];
    for (var i = 0, ni = this.armature.length; i < ni; i++)
    {
        var bone = this.armature[i];
        layers = layers.concat(bone.getLayers());
    }
    return layers;
}

/**
 * Creates the limbs and armatures in the comp
 * @param {OCODoc} doc The doc containing the bone.
 * @param {OCOLimb} limb The limb containing the bone.
 * @param {CompItem} [comp=DuAEProject.getActiveComp()] The composition to use.
 * @param {Layer} [parentLayer=null] The parent layer of the bone.
 * @param {int} [limbId] A Unique identifier for this armature. If omitted, a new one will be assigned.
 * @param {int} [boneIndex = 0] The index of the bone in the chain.
 * @return {Layer[]} The new layers
 */
OCOBone.prototype.toComp = function( doc, limb, comp, parentLayer, limbId, boneIndex )
{
    comp = def(comp, DuAEProject.getActiveComp());
    if (!comp) return;

    DuScriptUI.progressBar.hit(undefined, "Creating bone: " + this.name);

    parentLayer = def(parentLayer, null);
    limbId = def(limbId, new Date().getTime() );
    boneIndex = def(boneIndex, 0);

    var layers = [];

    // Create the layer for this one
    var boneLayer = comp.layers.addShape();
    layers.push(boneLayer);
    // Store the layer object
    this.layer = boneLayer;

    // Tag & Attributes
    Duik.Layer.setAttributes( boneLayer, Duik.Layer.Type.BONE, this.name, limb.side, limb.location, doc.name );
    var tag = DuAETag.get( boneLayer );
    DuAETag.setValue( boneLayer, DuAETag.Key.DUIK_BONE_TYPE, this.type, tag );
    DuAETag.setValue( boneLayer, DuAETag.Key.DUIK_LIMB_TYPE, limb.type, tag );
    DuAETag.setValue( boneLayer, DuAETag.Key.DUIK_LIMB, limb.limb, tag );
    DuAETag.setValue( boneLayer, DuAETag.Key.DUIK_LIMB_ID, limbId, tag );
    DuAETag.setValue( boneLayer, DuAETag.Key.DUIK_ATTACHED_BONE, this.attached, tag );
    DuAETag.setValue( boneLayer, DuAETag.Key.DUIK_BONE_INDEX, boneIndex, tag );
    DuAETag.setValue( boneLayer, DuAETag.Key.DUIK_RIGGED, false, tag );

    // Parent & position
    boneLayer.transform.position.setValue( doc.toPixels( [this.x, this.y] ) );
    boneLayer.transform.scale.expression = '[100,100];';
    boneLayer.parent = parentLayer;

    // Add the bone preset
    boneLayerType = OCO.config.get('after effects/bone layer type', 'full');

    var preset;
    if (boneLayerType == 'light') preset = preset_bone_light.toFile();
    else preset = preset_bone.toFile();

    DuAELayer.applyPreset( boneLayer, preset );

    // Set the envelop size & offset
    if (boneLayerType == 'full')
    {
        var eSize = this.envelop.width;
        if (eSize < 0) eSize = this.length() / 3;
        eSize = doc.toPixels(eSize);
        Duik.Bone.setEnvelopSize( eSize, boneLayer );
        Duik.Bone.setEnvelopOffset( doc.toPixels(this.envelop.offset), boneLayer );
        Duik.Bone.setEnvelopEnabled( false, boneLayer );
    }
    

    // And set the color
    if ( this.type == OCO.Bone.CLAVICLE ||
        this.type == OCO.Bone.HIPS
        )
        Duik.Bone.setColor( DuColor.Color.RAINBOX_RED, [boneLayer] );
    else if ( this.type == OCO.Bone.HUMERUS || 
        this.type == OCO.Bone.FEMUR ||
        this.type == OCO.Bone.SPINE ||
        this.type == OCO.Bone.TAIL_ROOT ||
        this.type == OCO.Bone.SNAKE_SPINE_ROOT || 
        this.type == OCO.Bone.FISH_SPINE_ROOT || 
        this.type == OCO.Bone.FIN ||
        this.type == OCO.Bone.HAIR_ROOT
        )
        Duik.Bone.setColor( DuColor.Color.ORANGE, [boneLayer] );
    else if ( this.type == OCO.Bone.TORSO)
        Duik.Bone.setColor( DuColor.Color.YELLOW_ORANGE, [boneLayer] );
    else if ( this.type == OCO.Bone.RADIUS ||
        this.type == OCO.Bone.TIBIA ||
        this.type == OCO.Bone.NECK ||
        this.type == OCO.Bone.TAIL_MID ||
        this.type == OCO.Bone.SNAKE_SPINE_MID ||
        this.type == OCO.Bone.FISH_SPINE_MID ||
        this.type == OCO.Bone.HAIR_MID
        )
        Duik.Bone.setColor( DuColor.Color.YELLOW, [boneLayer] );
    else if ( this.type == OCO.Bone.CARPUS ||
        this.type == OCO.Bone.TARSUS ||
        this.type == OCO.Bone.SKULL ||
        this.type == OCO.Bone.TAIL_END ||
        this.type == OCO.Bone.SNAKE_SPINE_END ||
        this.type == OCO.Bone.FISH_SPINE_END ||
        this.type == OCO.Bone.HAIR_END
        )
        Duik.Bone.setColor( DuColor.Color.LIGHT_BLUE, [boneLayer] );
    else if ( this.type == OCO.Bone.FINGER ||
        this.type == OCO.Bone.TIP ||
        this.type == OCO.Bone.SKULL_TIP ||
        this.type == OCO.Bone.TOE ||
        this.type == OCO.Bone.FEATHER || 
        this.type == OCO.Bone.FIN_FISHBONE
        )
        Duik.Bone.setColor( DuColor.Color.LIGHT_PURPLE, [boneLayer] );
    else if ( this.type == OCO.Bone.HEEL )
        Duik.Bone.setColor( DuColor.Color.GREEN, [boneLayer] );
    
    // Child bones
    for(var i = 0, n = this.children.length; i < n; i++)
    {
        boneIndex++;
        layers = layers.concat( this.children[i].toComp(doc, limb, comp, boneLayer, limbId, boneIndex) );
    }

    // Child limbs
    for(var i = 0, n = this.limbs.length; i < n; i++)
    {
        boneIndex++;
        layers = layers.concat( this.limbs[i].toComp(doc, comp, boneLayer, undefined, boneIndex) );
    }

    return layers;
}

/**
 * Gets the After Effects child layers of this bone (including it)
 * @return {Layer[]} May be an empty array if this bone has not been created in After Effects yet
 */
OCOBone.prototype.getLayers = function()
{
    var layers = [];
    if (this.layer) layers.push(this.layer);
    for (var i = 0, ni = this.children.length; i < ni; i++)
    {
        var bone = this.children[i];
        layers = layers.concat(bone.getLayers());
    }
    return layers;
}

/**
 * Creates a bone using a layer from a comp
 * @param {Layer} layer the layer
 * @param {OCODoc} doc the doc which will be containing the bone. Needed for coordinates.
 * @return {OCOBone} the bone
 */
OCOBone.fromComp = function ( layer, doc )
{
    // Check the name
    var boneName = Duik.Layer.name( layer );
    if (boneName == '') boneName = 'Limb';
    var bone = new OCOBone(boneName);

    // Store the layer object
    bone.layer = layer;

    // The coordinates
    var pos = DuAELayer.getWorldPos( layer );
    pos = doc.fromPixels( pos );
    bone.x = pos[0];
    bone.y = pos[1];
    bone.zIndex = layer.index;
    bone.envelop.width = doc.fromPixels( Duik.Bone.envelopSize( layer ) );
    bone.envelop.offset = doc.fromPixels( Duik.Bone.envelopOffset( layer ) );

    bone.attached = DuAETag.getValue( layer, DuAETag.Key.DUIK_ATTACHED_BONE, DuAETag.Type.BOOL );
    bone.type = DuAETag.getValue( layer, DuAETag.Key.DUIK_BONE_TYPE, DuAETag.Type.STRING );

    return bone;
}

/**
 * Gets the (localized) synonyms of this name
 * @param {string} name The name to look for
 * @param {boolean} [fuzzy=true] Performs a fuzzy search
 * @return {string[]} The synonyms. A 'score' property is added to the object to be used in case of fuzzy search.
 */
OCOBone.getNameSynonyms = function( name, fuzzy )
{
    fuzzy  = def( fuzzy, true );

    // Dicts are lower case
    name = name.toLowerCase();

    var foundDict = [];
    var score = 32000;

    for (k in OCO.BoneName) {
        if (!OCO.BoneName.hasOwnProperty(k)) continue;
        for (var i = 0, ni = OCO.BoneName[k].length; i < ni; i++)
        {
            var synonym = OCO.BoneName[k][i];
            if (!fuzzy && name == synonym) {
                foundDict = OCO.BoneName[k];
                foundDict.score = 1;
                return foundDict;
            }
            else if (fuzzy) {
                var s = DuString.match(synonym, name);
                if (s <= 0) continue;
                if (s >= score) continue;
                if (s < score) {
                    score = s;
                    foundDict = OCO.BoneName[k];
                    break;
                }
            }
        }
    }

    if (foundDict.length == 0) {
        foundDict.score = 0;
        return foundDict;
    }

    foundDict.score = score;
    return foundDict;
}

/**
 * Gets the internal bone id according to the (localized) given name, using the synonyms dictionnary
 * @param {string} name The name to look for
 * @param {boolean} [fuzzy=true] Performs a fuzzy search
 * @return {OCO.Bone} The bone id
 */
OCOBone.getBoneId = function (name, fuzzy)
{
    fuzzy  = def( fuzzy, true );

    // Dicts are lower case
    name = name.toLowerCase();

    var id = "";
    var score = 32000;

    for (k in OCO.BoneName) {
        if (!OCO.BoneName.hasOwnProperty(k)) continue;
        for (var i = 0, ni = OCO.BoneName[k].length; i < ni; i++)
        {
            var synonym = OCO.BoneName[k][i];
            if (!fuzzy && name == synonym) return k;
            else if (fuzzy) {
                var s = DuString.match(synonym, name);
                if (s <= 0) continue;
                if (s >= score) continue;
                if (s < score) {
                    score = s;
                    id = k;
                    break;
                }
            }
        }
    }

    if (id == "") return OCO.Bone.CUSTOM;

    return id;
}