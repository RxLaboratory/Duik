/**
 * Bone and armatures related tools.
 * @namespace
 * @category Duik
 */
Duik.Bone = {};

/**
 * The list of bone functions
 * @namespace
 */
Duik.CmdLib['Bone'] = [];

Duik.CmdLib['Bone']["Arm"] = "Duik.Bone.arm()";
/**
 * Creates a new arm.
 * @param {string} [characterName] The name of the character
 * @param {OCO.LimbType} [type=OCO.LimbType.HOMINOID] The type of limb
 * @param {OCO.Side} [side=OCO.Side.LEFT] The side
 * @param {Boolean} [shoulder=false] Whether to create a shoulder
 * @param {Boolean} [arm=true]  Whether to create an arm / humerus
 * @param {Boolean} [forearm=true]  Whether to create a forearm
 * @param {Boolean} [hand=true]  Whether to create a hand
 * @param {Boolean} [claws=false]  Whether to add claws
 * @param {OCO.Location} [location=OCO.Location.FRONT]  The location of the arm
 * @param {boolean} [forceLink=false] - whether link the selected layers/properties to the new armature
 */
Duik.Bone.arm = function ( characterName, type, side, shoulder, arm, forearm, hand, claws, location, forceLink )
{
    // get current comp
    var comp = DuAEProject.getActiveComp();
    if (!comp) return;

    type = def(type, OCO.LimbType.HOMINOID);
    side = def(side, OCO.Side.LEFT);
    location = def(location, OCO.Location.FRONT);
    forceLink = def( forceLink, false);
    characterName = def( characterName, '' );

    shoulder = def( shoulder, false );
    arm = def( arm, true );
    forearm = def( forearm, true );
    hand = def( hand, true );
    claws = def( claws, false );

    DuAE.beginUndoGroup( i18n._("Arm"), false);
    DuAEProject.setProgressMode(true);

    function limbCreator( doc )
    {
        return doc.newArm( type, side, shoulder, arm, forearm, hand, claws, undefined, location );
    }

    var bones = Duik.Bone.createLimb( comp, limbCreator, characterName, forceLink );

    DuAEProject.setProgressMode(false);
    DuAE.endUndoGroup( i18n._("Arm"), false);

    return bones;
}

// Low-level undocumented function
// Creates a limb on the selection, optionally linking the items
Duik.Bone.createLimb = function ( comp, limbCreator, characterName, forceLink )
{
    comp = def(comp,DuAEProject.getActiveComp());
    if (!comp) return [];
 
    // Links
    var linkPath = DuESF.scriptSettings.get("armatureLinkPaths", false);
    if (forceLink) linkPath = !linkPath;
    var linkPuppetPins = DuESF.scriptSettings.get("armatureLinkPuppetPins", false);
    if (forceLink) linkPuppetPins = !linkPuppetPins;
    var linkLayers = DuESF.scriptSettings.get("armatureLinkLayers", false);
    if (forceLink) linkLayers = !linkLayers;

    var layers = DuAEComp.getSelectedLayers();

    // if we have a shape layer selected and its path, and only a path, we're going to remove it after creation.  
    var layerToRemove = null;
    if (layers.length == 1 && !linkPath)
    {
        var l = layers[0];
        if (DuAEShapeLayer.isSingleShape(l)) layerToRemove = l;
    }

    // If there's no selected layer, just create
    if( layers.length == 0 )
    {
        var doc = OCODoc.fromComp( characterName, comp, [] );
        var limb = limbCreator( doc );
        var boneLayers = doc.toComp( comp );
        DuAELayer.moveInsideComp( boneLayers[0] );
        return boneLayers;
    }

    // For each selected layer
    var it = new DuList( layers );
    var ok = false;
    it.do( function( layer )
    {
        if (characterName == "")
            characterName = Duik.Layer.groupName(layer);

        //get paths
        var props = DuAELayer.getSelectedProps( layer, DuAEProperty.isPathProperty );

        if ( props.length > 0 )
        {
            // Create a limb for each path
            for (var i = 0, n = props.length; i < n; i++)
            {
                var path = props[i];

                var pathProp = new DuAEProperty( path ).pathProperty();
                pathProp = pathProp.getProperty();
                // don't rig twice the same (we may get either the prop or the group)
                if (DuString.startsWith(
                    pathProp.expression,
                    '// Duik auto-rig')) {
                        pathProp.expression = pathProp.expression.replace('// Duik auto-rig\n', '');
                        continue;
                    }

                // create the OCODoc
                var doc = OCODoc.fromComp( characterName, comp, [] );
                var limb = limbCreator( doc );
                limb.moveArmatureToPath( doc, path );
                // create
                var boneLayers = doc.toComp( comp );
                DuAELayer.moveInsideComp( boneLayers[0] );
                // link
                if (linkPath)
                    Duik.Pin.linkPathToLayers( path, boneLayers );

                // don't rig twice the same (we may get either the prop or the group)
                pathProp.expression = '// Duik auto-rig\n' + pathProp.expression;

                ok = true;
            }
            if (layerToRemove) layerToRemove.remove();
            return boneLayers;
        }

        //puppet pins
        props = DuAELayer.getSelectedProps( layer, "ADBE FreePin3 PosPin Atom" );
        if ( props.length > 0 )
        {
            // Create a limb for all selected pins
            // create the OCODoc
            var doc = OCODoc.fromComp( characterName, comp, [] );
            var limb = limbCreator( doc );
            limb.moveArmatureToPuppetPins( doc, props );
            // create
            var boneLayers = doc.toComp( comp );
            DuAELayer.moveInsideComp( boneLayers[0] );
            // link
            if (linkPuppetPins) Duik.Pin.linkPuppetPinsToLayers( props, boneLayers );
            ok = true;
            return boneLayers;
        }

        //puppet effect
        props = DuAELayer.getSelectedProps( layer, "ADBE FreePin3" );
        if ( props.length > 0 )
        {
            // Get pins from each effect
            for(var i = 0, n = props.length; i < n; i++)
            {
                var pins = [];

                var meshGroup = props[i].property( "ADBE FreePin3 ARAP Group" ).property( "ADBE FreePin3 Mesh Group" );
                for ( var j = 1, numProps = meshGroup.numProperties; j <= numProps; j++ )
                {
                    var mesh = meshGroup( j );
                    var pinsGroup = mesh.property( "ADBE FreePin3 PosPins" );
                    for ( var k = 1, numPins = pinsGroup.numProperties; k <= numPins; k++ )
                    {
                        var pin = pinsGroup.property( k );
                        var test = new DuAEProperty( pin.property( "ADBE FreePin3 PosPin Position" ) );
                        if ( test.riggable() ) pins.push( new DuAEProperty( pin ) );
                    }
                }

                if (pins.length == 0) continue;

                // Create a limb for all pins
                // create the OCODoc
                var doc = OCODoc.fromComp( characterName, comp, [] );
                var limb = limbCreator( doc );
                limb.moveArmatureToPuppetPins( doc, pins );
                // create
                var boneLayers = doc.toComp( comp );
                DuAELayer.moveInsideComp( boneLayers[0] );
                // link
                if (linkPuppetPins) Duik.Pin.linkPuppetPinsToLayers( pins, boneLayers );
                ok = true;
            }
            return boneLayers;
        }
    });

    // anchor points
    if(!ok)
    {
        var layer = it.at(0);
        var side = Duik.Layer.side(layer);
        
        // Create a limb for all layers
        // create the OCODoc
        var doc = OCODoc.fromComp( characterName, comp, [] );
        var limb = limbCreator( doc );
        limb.moveArmatureToLayers( doc, layers );
        // create
        var boneLayers = doc.toComp( comp );
        DuAELayer.moveInsideComp( boneLayers[0] );
        // link
        if (linkLayers) Duik.Bone.linkLayers( layers, boneLayers );
        return boneLayers;
    }
}

Duik.CmdLib['Bone']["Custom_Limb"] = "Duik.Bone.customLimb()";
/**
 * Creates a custom limb.
 * @param {int} [num=2] - The number of bones in case nothing is selected in the comp. Otherwize, a bone is created for each selected path vertex/puppet pin/layer.
 * @param {string} [name='Limb'] - The name of the limb
 * @param {string} [characterName] The name of the character
 * @param {OCO.Side} [side=OCO.Side.NONE] - The side of the limb
 * @param {OCO.Location} [location=OCO.Location.NONE] - The location of the limb
 * @param {boolean} [forceLink=false] - whether to link the selected layers/properties to the new armature
 */
Duik.Bone.customLimb = function ( num, name, characterName, side, location, forceLink )
{
    // get current comp
    var comp = DuAEProject.getActiveComp();
    if (!comp) return;

    num = def( num, 2);
    forceLink = def( forceLink, false);
    name = def( name, i18n._('Limb'));
    if (name == '') name = i18n._('Limb');
    characterName = def( characterName, '');
    side = def( side, OCO.Side.NONE);
    location = def( location, OCO.Location.NONE);

    DuAE.beginUndoGroup( i18n._("Limb"), false);
    DuAEProject.setProgressMode(true);

    var layers = comp.selectedLayers;

    function limbCreator( doc )
    {
        var limb = doc.newLimb( OCO.Limb.CUSTOM, side, location );
        limb.newArmature( name, num );
        return limb;
    }

    var bones = Duik.Bone.createLimb( comp, limbCreator, characterName, forceLink );

    DuAEProject.setProgressMode(false);
    DuAE.endUndoGroup( i18n._("Limb"));

    return bones;
}

Duik.CmdLib['Bone']["Leg"] = "Duik.Bone.leg()";
/**
 * Creates a new arm.
 * @param {string} [characterName] The name of the character
 * @param {OCO.LimbType} [type=OCO.LimbType.HOMINOID] The type of limb
 * @param {OCO.Side} [side=OCO.Side.LEFT] The side
 * @param {Boolean} [thigh=true]  Whether to create a thigh
 * @param {Boolean} [calf=true]  Whether to create a calf
 * @param {Boolean} [foot=true]  Whether to create a foot
 * @param {Boolean} [claws=false]  Whether to add claws
 * @param {Boolean} [location=OCO.Location.BACK]  The location of the leg
 * @param {boolean} [forceLink=false] - whether link the selected layers/properties to the new armature
 */
Duik.Bone.leg = function ( characterName, type, side, thigh, calf, foot, claws, location, forceLink )
{
    // get current comp
    var comp = DuAEProject.getActiveComp();
    if (!comp) return;

    type = def(type, OCO.LimbType.HOMINOID);
    side = def(side, OCO.Side.LEFT);
    location = def(location, OCO.Location.BACK);
    forceLink = def( forceLink, false);
    characterName = def( characterName, '' );

    thigh = def( thigh, true );
    calf = def( calf, true );
    foot = def( foot, true );
    claws = def( claws, false );

    DuAE.beginUndoGroup( i18n._("Leg"), false);
    DuAEProject.setProgressMode(true);

    function limbCreator( doc )
    {
        return doc.newLeg( type, side, thigh, calf, foot, claws, undefined, location );
    }

    var bones = Duik.Bone.createLimb( comp, limbCreator, characterName, forceLink );

    DuAEProject.setProgressMode(false);
    DuAE.endUndoGroup( i18n._("Leg"));

    return bones;
}

Duik.CmdLib['Bone']["Spine"] = "Duik.Bone.spine()";
/**
 * Creates a new spine.
 * @param {string} [characterName] The name of the character
 * @param {Boolean} [head=true]  Whether to create a head
 * @param {int} [neck=1] Number of neck bones
 * @param {int} [spine=2] Number of spine bones
 * @param {Boolean} [hips=true]  Whether to create hips
 * @param {boolean} [forceLink=false] - whether link the selected layers/properties to the new armature
 */
Duik.Bone.spine = function( characterName, head, neck, spine, hips, forceLink )
{
    // get current comp
    var comp = DuAEProject.getActiveComp();
    if (!comp) return;

    forceLink = def( forceLink, false);
    characterName = def( characterName, '' );

    head = def( head, true );
    neck = def( neck, 1 );
    spine = def( spine, 2 );
    hips = def( hips, true );

    DuAE.beginUndoGroup( i18n._("Spine"), false);
    DuAEProject.setProgressMode(true);

    function limbCreator( doc )
    {
        return doc.newSpine( head, neck, spine, hips );
    }

    var bones = Duik.Bone.createLimb( comp, limbCreator, characterName, forceLink );

    DuAEProject.setProgressMode(false);
    DuAE.endUndoGroup( i18n._("Spine"));

    return bones;
}

Duik.CmdLib['Bone']["Tail"] = "Duik.Bone.tail()";
/**
 * Creates a new tail.
 * @param {string} [characterName] The name of the character
 * @param {int} [num=3] Number of tail bones
 * @param {boolean} [forceLink=false] - whether link the selected layers/properties to the new armature
 */
Duik.Bone.tail = function ( characterName, num, forceLink )
{
    // get current comp
    var comp = DuAEProject.getActiveComp();
    if (!comp) return;

    forceLink = def( forceLink, false);
    characterName = def( characterName, '' );

    num = def( num, 3 );

    DuAE.beginUndoGroup( i18n._("Tail"), false);
    DuAEProject.setProgressMode(true);

    function limbCreator( doc )
    {
        return doc.newTail( num );
    }

    var bones = Duik.Bone.createLimb( comp, limbCreator, characterName, forceLink );

    DuAEProject.setProgressMode(false);
    DuAE.endUndoGroup( i18n._("Tail"));

    return bones;
}

Duik.CmdLib['Bone']["Hair"] = "Duik.Bone.hair()";
/**
 * Creates a new hair strand.
 * @param {string} [characterName] The name of the character
 * @param {int} [num=3] Number of hair bones
 * @param {boolean} [forceLink=false] - whether link the selected layers/properties to the new armature
 */
Duik.Bone.hair = function ( characterName, num, forceLink )
{
    // get current comp
    var comp = DuAEProject.getActiveComp();
    if (!comp) return;

    forceLink = def( forceLink, false);
    characterName = def( characterName, '' );

    num = def( num, 3 );

    DuAE.beginUndoGroup( i18n._("Hair"), false);
    DuAEProject.setProgressMode(true);

    function limbCreator( doc )
    {
        return doc.newHairStrand( num );
    }

    var bones = Duik.Bone.createLimb( comp, limbCreator, characterName, forceLink );

    DuAEProject.setProgressMode(false);
    DuAE.endUndoGroup( i18n._("Hair"));

    return bones;
}

Duik.CmdLib['Bone']["Wing"] = "Duik.Bone.wing()";
/**
 * Creates a new wing.
 * @param {string} [characterName] The name of the character
 * @param {OCO.Side} [side=OCO.Side.LEFT] The side
 * @param {Boolean} [arm=true]  Whether to create an arm / humerus
 * @param {Boolean} [forearm=true]  Whether to create a forearm
 * @param {Boolean} [hand=true]  Whether to create a hand
 * @param {int} [feathers=5]  Number of feathers
 * @param {boolean} [forceLink=false] - whether link the selected layers/properties to the new armature
 */
Duik.Bone.wing = function ( characterName, side, arm, forearm, hand, feathers, forceLink )
{
    // get current comp
    var comp = DuAEProject.getActiveComp();
    if (!comp) return;

    forceLink = def( forceLink, false);
    characterName = def( characterName, '' );
    side = def(side, OCO.Side.LEFT);

    arm = def( arm, true );
    forearm = def( forearm, true );
    hand = def( hand, true );
    feathers = def( feathers, 5 );

    DuAE.beginUndoGroup( i18n._("Wing"), false);
    DuAEProject.setProgressMode(true);

    function limbCreator( doc )
    {
        return doc.newWing( side, arm, forearm, hand, feathers );
    }

    var bones = Duik.Bone.createLimb( comp, limbCreator, characterName, forceLink );

    DuAEProject.setProgressMode(false);
    DuAE.endUndoGroup( i18n._("Wing"));

    return bones;
}

Duik.CmdLib['Bone']["Snake_spine"] = "Duik.Bone.snakeSpine()";
/**
 * Creates a new snake / worm spine.
 * @param {string} [characterName] The name of the character
 * @param {Boolean} [head=true]  Whether to create a head
 * @param {int} [spine=5] Number of spine bones
 * @param {boolean} [forceLink=false] - whether link the selected layers/properties to the new armature
 */
Duik.Bone.snakeSpine = function ( characterName, head, spine, forceLink )
{
    // get current comp
    var comp = DuAEProject.getActiveComp();
    if (!comp) return;

    forceLink = def( forceLink, false);
    characterName = def( characterName, '' );

    head = def( head, true );
    spine = def( spine, 5 );

    DuAE.beginUndoGroup("Create snake / worm spine");
    DuAEProject.setProgressMode(true);

    function limbCreator( doc )
    {
        return doc.newSnakeSpine( head, spine );
    }

    Duik.Bone.createLimb( comp, limbCreator, characterName, forceLink );

    DuAEProject.setProgressMode(false);
    DuAE.endUndoGroup();
}

Duik.CmdLib['Bone']["Fin"] = "Duik.Bone.fin()";
/**
 * Creates a new fin.
 * @param {string} [characterName] The name of the character
 * @param {OCO.Side} [side=OCO.Side.LEFT] The side
 * @param {int} [fishbones=true]  Number of fishbones to create
 * @param {boolean} [forceLink=false] - whether link the selected layers/properties to the new armature
 */
Duik.Bone.fin = function ( characterName, side, fishbones, forceLink )
{
    // get current comp
    var comp = DuAEProject.getActiveComp();
    if (!comp) return;

    forceLink = def( forceLink, false);
    characterName = def( characterName, '' );
    side = def(side, OCO.Side.LEFT);

    fishbones = def( fishbones, 5 );

    DuAE.beginUndoGroup( i18n._("Fin"), false);
    DuAEProject.setProgressMode(true);

    function limbCreator( doc )
    {
        return doc.newFin( side, fishbones );
    }

    var bones = Duik.Bone.createLimb( comp, limbCreator, characterName, forceLink );

    DuAEProject.setProgressMode(false);
    DuAE.endUndoGroup( i18n._("Fin"));

    return bones;
}

Duik.CmdLib['Bone']["Fish_spine"] = "Duik.Bone.fishSpine()";
/**
 * Creates a new fish spine.
 * @param {string} [characterName] The name of the character
 * @param {Boolean} [head=true]  Whether to create a head
 * @param {int} [spine=3] Number of spine bones
 * @param {boolean} [forceLink=false] - whether link the selected layers/properties to the new armature
 */
Duik.Bone.fishSpine = function ( characterName, head, spine, forceLink )
{
    // get current comp
    var comp = DuAEProject.getActiveComp();
    if (!comp) return;

    forceLink = def( forceLink, false);
    characterName = def( characterName, '' );

    head = def( head, true );
    spine = def( spine, 3 );

    DuAE.beginUndoGroup( i18n._("Spine"), false);
    DuAEProject.setProgressMode(true);

    function limbCreator( doc )
    {
        return doc.newFishSpine( head, spine );
    }

    var bones = Duik.Bone.createLimb( comp, limbCreator, characterName, forceLink );

    DuAEProject.setProgressMode(false);
    DuAE.endUndoGroup( i18n._("Spine"));

    return bones;
}

/**
 * Parents the given layers to the given bones.<br />
 * The two lists do not need to have the same number of layers, 
 * additionnal/missing layers will be ignored.
 * @param {Layer[]|LayerCollection|DuList} layers
 * @param {Layer[]|LayerCollection|DuList} boneLayers
 */
Duik.Bone.linkLayers = function(layers, boneLayers)
{
    layers = new DuList(layers);
    boneLayers = new DuList(boneLayers);

    for(var i = 0, n = layers.length(); i < n; i++)
    {
        // Finished, we don't have any more layer to link!
        if (boneLayers.length() == i) return;

        layers.at(i).parent = boneLayers.at(i);
    }
}

Duik.CmdLib['Bone']["Select"] = "Duik.Bone.select()";
/**
 * Selects all the bones in the comp (and deselects any other layer)
 * @param {CompItem} [comp=DuAEProject.getActiveComp()] The comp
 */
Duik.Bone.select = function( comp )
{
    Duik.Layer.select( Duik.Layer.Type.BONE, comp ); 
}

Duik.CmdLib['Bone']["Show_Hide"] = "Duik.Bone.toggleVisibility()";
/**
 * Show/hides all the bones
 * @param {CompItem} [comp=DuAEProject.getActiveComp()] The comp
 * @param {bool} [notSelectedOnly=false] Hides only the bones which are not selected
 */
Duik.Bone.toggleVisibility = function( comp, notSelectedOnly )
{
    notSelectedOnly = def(notSelectedOnly, false);
    Duik.Layer.toggleVisibility( Duik.Layer.Type.BONE, comp, notSelectedOnly );
}

Duik.CmdLib['Bone']["Duplicate"] = "Duik.Bone.duplicate()";
/**
 * Duplicates the selected bones, updates the hierarchy and display
 * @param {CompItem} [comp=DuAEProject.getActiveComp()] The comp
 * @returns {Layer[]} The new bones
 */
Duik.Bone.duplicate = function( comp )
{
    comp = def( comp, DuAEProject.getActiveComp() );
    if (!comp) return;

    var layers = Duik.Bone.get( true, comp );
    if (layers.length == 0) return;

    // Sort bones by limb/armature
    var armatures = [];
    for(var i = 0, n = layers.length; i < n; i++)
    {
        var layer = layers[i];
        var id = DuAETag.getValue( layer, DuAETag.Key.DUIK_LIMB_ID, DuAETag.Type.INT );
        if (id == null) id = -1;
        if (isNaN(id)) id = -1;
        // Search in armatures
        var found = false;
        for(var j = 0, na = armatures.length; j < na; j++)
        {
            var aid = armatures[j].id;
            if (aid == id)
            {
                armatures[j].push(layer);
                found = true;
                break;
            }
        }
        if (found) continue;
        // new armature
        var a = [layer];
        a.id = id;
        armatures.push(a);
    }

    var newArmatures = [];
    var autorigIds = [];

    DuAE.beginUndoGroup("Duplicate bones");
    DuAEProject.setProgressMode(true);

    for (var i = 0, n = armatures.length; i < n; i++)
    {
        //unselect all layers in the comp
        DuAEComp.unselectLayers( comp );
        //select the bones of the armature, then duplicate
        DuAEComp.selectLayers( armatures[i] );
        comp.openInViewer();
        DuAE.duplicate();
        //get topmost element
        var topIndex = comp.numLayers;
        var it = new DuList( armatures[i] );
        while ( boneLayer = it.next() )
        {
            if ( boneLayer.index < topIndex ) topIndex = boneLayer.index;
            if ( topIndex == 1 ) break;
        };

        var oldLayers = DuAELayer.sortByIndex( armatures[i] ).reverse();
        oldLayers = new DuList( oldLayers );
        var newLayers = DuAELayer.sortByIndex( comp.selectedLayers ).reverse();

        //adjustments
        function layerInArray ( layer, index )
        {
            return layer.index == index;
        }

        var id = new Date().getTime();

        // Set display link and Id
        new DuList( newLayers ).do( function( layer )
        {
            layer.moveBefore( comp.layer( topIndex ) );
            //set display link
            var pE = Duik.PseudoEffect.BONE_DATA;
            var targetIndex = pE.props['Armature']['Target'].index;
            var effect = layer.effect( pE.matchName );
            if (effect)
            {
                var oldLinkIndex = oldLayers.indexOf( effect( targetIndex ).value, layerInArray );
                if ( oldLinkIndex >= 0 )
                {
                    effect( targetIndex ).setValue( newLayers[ oldLinkIndex ].index );
                }
            }
            
            //set new id
            DuAETag.setValue( layer, DuAETag.Key.DUIK_LIMB_ID, id );
        } );

        if (newLayers.length == 0) continue;

        //adjust autorig id
        var autorigId = DuAETag.getValue( newLayers[0], DuAETag.Key.DUIK_AUTORIG_ID, DuAETag.Type.INT );
        if (autorigId == null) continue;
        var newAutorigId = -1;

        for (var j = 0, num = autorigIds.length; j < num; j++)
        {
            if (autorigIds[j][0] == autorigId) newAutorigId = autorigIds[j][1];
        }

        if (newAutorigId == -1)
        {
            newAutorigId = new Date().getTime();
            autorigIds.push([autorigId,newAutorigId]);
        }

        for (var j = 0, num = oldLayers.length; j < num; j++)
        {
            DuAETag.setValue( oldLayers[j], DuAETag.Key.DUIK_AUTORIG_ID, newAutorigId );
        }

        newArmatures.push(newLayers);
    }

    // Select new bones
    for (var i = 0, n = newArmatures.length; i < n; i++)
        for (var j = 0, nb = newArmatures[i].length; j < nb; j++)
            newArmatures[i][j].selected = true;

    DuAEProject.setProgressMode(false);
    DuAE.endUndoGroup();
}

Duik.CmdLib['Bone']["Edit_mode"] = "Duik.Bone.unlink()";
/**
 * Toggles the edit mode on selected bones
 * @param {CompItem} [comp=DuAEProject.getActiveComp()] The comp
 */
Duik.Bone.unlink = function( comp )
{
    comp = def( comp, DuAEProject.getActiveComp() );
    if (!comp) return;

    var layers = Duik.Bone.get( true, comp );
    if (layers.length == 0) return;

    DuAE.beginUndoGroup("Toggle bone edit mode");
    DuAEProject.setProgressMode(true);

    for(var i = 0, n = layers.length; i < n; i++)
    {
        DuAELayer.toggleEditMode( layers[i] );
    }

    DuAEProject.setProgressMode(false);
    DuAE.endUndoGroup();
}

Duik.CmdLib['Bone']["Bake_Armature_Data"] = "Duik.Bone.bakeArmatureData();";
/**
 * Bakes the "Armature" part of the Bone Data effect
 @param {Layer[]|DuList.<Layer>|Layer} [layers] - The layers to bake; will use selected layers from the current comp if omitted.
 */
Duik.Bone.bakeArmatureData = function( layers )
{
    layers = def(layers, DuAEComp.unselectLayers() );
    layers = new DuList(layers);
    if( layers.isEmpty() ) return;

    DuAE.beginUndoGroup( i18n._("Bake armature data"), false);

    // Progress
    DuScriptUI.progressBar.addMax( layers.length() + 1 );
    DuScriptUI.progressBar.hit(1, DuString.args( i18n._('Baking armature data...') ));

    var boneDataPE = Duik.PseudoEffect.BONE_DATA;
    var n = layers.length();
    layers.do(function(layer)
    {
        var i = layers.current + 1;
        DuScriptUI.progressBar.hit(1, i18n._('Baking armature data: %1', [ i + '/' + n ] ));
        // Set the bone data to the child index
        var boneEffect = layer.effect(boneDataPE.matchName);
        if ( !boneEffect ) return;

        var targetIndex = boneDataPE.props["Armature"]["Target"].index;
        var childIndex = boneDataPE.props["Armature"]["Child index"].index;
        var parentIndex = boneDataPE.props["Armature"]["Parent index"].index;

        if ( boneEffect( targetIndex ).value == 0 ) {

            childValue = boneEffect( childIndex ).value;
            parentValue = boneEffect( parentIndex ).value;

            boneEffect( targetIndex ).setValue( childValue );
        }
    });

    DuAE.endUndoGroup( i18n._("Bake armature data"));
}

Duik.CmdLib['Bone']["Bake"] = "Duik.Bone.bake()";
Duik.CmdLib['Bone']["Bake_Keep_envelops"] = "Duik.Bone.bake( false )";
/**
 * Bakes the appearance of the selected bones to improve performance by removing appearance-only expressions and effects.
 * @param {Boolean} [bakeBones=true] - Set to false to keep the bone display
 * @param {Boolean} [bakeEnvelop=true] - Set to false to keep the envelop settings
 * @param {Boolean} [bakeNoodles=true] - Set to false to keep all noodles even if they're hidden
 * @param {Layer[]|DuList.<Layer>|Layer} [layers] - The layers to bake; will use selected layers from the current comp if omitted.
 * @param {Boolean} [reselectLayers=true] - Set to false to not reselect the bones after the baking process
 */
Duik.Bone.bake = function ( bakeBones, bakeEnvelop, bakeNoodles, layers )
{
    layers = def(layers, DuAEComp.unselectLayers() );
    layers = new DuList(layers);
    if( layers.isEmpty() ) return;

    bakeBones = def(bakeBones, true);
    bakeEnvelop = def(bakeEnvelop, true);
    bakeNoodles = def(bakeNoodles, true);

    DuAE.beginUndoGroup( i18n._("Bake bones"), false);

    // Progress
    DuScriptUI.progressBar.addMax( layers.length() + 1 );

    DuScriptUI.progressBar.hit(1, i18n._('Resetting bone transform...'));

    // Keep the child info in the bone effect
    Duik.Bone.bakeArmatureData( layers );

    // First, set all rotation to 0!
    // 1- unparent all
    var parents = [];
    layers.do(function(layer)
    {
        if ( Duik.Bone.isRigged(layer)) return;
        layer.locked = false;
        parents.push(layer.parent);
        layer.parent = null;
    });
    // 1B - Unpaernt remaining children
    layers.do(function(layer)
    {
        if ( Duik.Bone.isRigged(layer)) return;
        layer.children = DuAELayer.getChildren( layer );
        // Unparent children
        for (var i = 0, ni = layer.children.length; i < ni; i++)
        {
            var child = layer.children[i];
            child.wasLocked = child.locked;
            child.locked = false;
            child.parent = null;
        }
    });
    // 2- set rotations to 0
    layers.do(function(layer)
    {
        if ( Duik.Bone.isRigged(layer)) return;
        layer.transform.rotation.setValue(0);
    });
    // 3- reparent
    layers.do(function(layer)
    {
        if ( Duik.Bone.isRigged(layer)) return;
        layer.parent = parents[ layers.current ];
        // Reparent children
        for (var i = 0, ni = layer.children.length; i < ni; i++)
        {
            var child = layer.children[i];
            layer.children[i].parent = layer;
            child.locked = child.wasLocked;
        }
    });

    var pe = Duik.PseudoEffect.BONE;
    var peDataLight = Duik.PseudoEffect.BONE_DATA_LIGHT;
    var peE = Duik.PseudoEffect.BONE_ENVELOP;
    var peN = Duik.PseudoEffect.BONE_NOODLE;

    var n = layers.length();
    var i = 1;

    layers.do(function(layer)
    {
        DuScriptUI.progressBar.hit(1, i18n._('Baking bone: %1', [ i + '/' + n ] ));
        i++;
        // Nothing to do if this is not a shape
        if( !layer instanceof ShapeLayer) return;
        // or a bone
        if ( !Duik.Layer.isType( layer, Duik.Layer.Type.BONE ) ) return;

        function isBoneExpression( exp )
        {
            return exp.indexOf( DuAEExpression.Id.BONE ) == 0;
        }

        function isBoneEnvelopExpression( exp )
        {
            return exp.indexOf( DuAEExpression.Id.BONE_ENVELOP ) == 0;
        }

        function isBoneNoodleExpression( exp )
        {
            return exp.indexOf( DuAEExpression.Id.BONE_NOODLE ) == 0;
        }
        
        // remove expressions
        if (bakeBones) {
            var boneGroup = layer("ADBE Root Vectors Group").property('Bone');
            if (boneGroup)
            {
                var subGroup = boneGroup.content("Target");
                if (subGroup)
                {
                    var groupInfo = new DuAEProperty( subGroup );
                    groupInfo.removeExpression( isBoneExpression );
                }
                var subGroup = boneGroup.content("Display");
                if (subGroup)
                {
                    var groupInfo = new DuAEProperty( subGroup );
                    groupInfo.removeExpression( isBoneExpression );
                }
            }
            // remove transform
            var transform = new DuAEProperty( boneGroup.transform );
            transform.removeExpression( isBoneExpression );

            // remove effect
            var effect = layer.effect(pe.matchName);
            if (effect) effect.remove();

            effect = layer.effect(peDataLight.matchName);
            if (effect) effect.remove();
        }
        
        // Same for envelop
        if (bakeEnvelop) {
            var envelopGroup = layer("ADBE Root Vectors Group").property('Envelop');
            if (envelopGroup)
            {
                var groupInfo = new DuAEProperty( envelopGroup );
                groupInfo.removeExpression( isBoneEnvelopExpression );

                // remove transform
                var transform = new DuAEProperty( envelopGroup.transform );
                transform.removeExpression( isBoneEnvelopExpression );
            }

            // remove effect
            var effect = layer.effect(peE.matchName);
            if (effect) effect.remove();
        }

        // And noodles      
        if (bakeNoodles) {
            var effect = layer.effect(peN.matchName);
            var bake = false;
            if (!effect) bake = true;
            if (!bake && !effect.active) bake = true;

            if (bake) {
                var noodleGroup = layer("ADBE Root Vectors Group").property('Noodle');
                if (noodleGroup) noodleGroup.remove();

                // remove effect
                var effect = layer.effect(peN.matchName);
                if (effect) effect.remove();
            }            
        }        

        
    });

    DuAEComp.selectLayers(layers);

    DuAE.endUndoGroup( i18n._("Bake bones"));
}

Duik.CmdLib['Bone']["Auto_Parent"] = "Duik.Bone.autoParent()";
Duik.CmdLib['Bone']["Auto_Parent_By_Name"] = "Duik.Bone.autoParent(undefined, undefined, true)";
/**
 * Automatically (tries to) links the artwork layers to their corresponding bones.<br />
 * Finds the bones using the anchor point coordinates of the artworks, or their names
 * @param {Layer[]|DuList.<Layer>|LayerCollection} [layers] The artwork layers. If bones is omitted, it may also contain the bones.
 * @param {Layer[]|DuList.<Layer>|LayerCollection} [bones] The bones to parent to. If omitted, will try to find them in layers, or in the comp if there's no bone in layers.
 * @param {bool} [useNames=false] If true, will use layer names instead of locations to find the corresponding bone.
 */
Duik.Bone.autoParent = function( layers, bones, useNames ) {
    layers = def(layers,DuAEComp.getSelectedLayers() );
    layers = new DuList(layers);
    if (layers.length() == 0) {
        var comp = DuAEProject.getActiveComp();
        if (!comp) return;
        layers = new DuList(comp.layers);
        if (layers.length() == 0) return;
    }
    var comp = layers.first().containingComp;

    bones = def(bones, []);
    bones = new DuList(bones);
    if (bones.length() == 0) {
        // Find them in layers
        var layer;
        layers.goToEnd();
        while (layer = layers.previous()) {
            if (Duik.Layer.isType(layer, Duik.Layer.Type.BONE)) {
                bones.push(layer);
                layers.remove( layers.current );
            }
        }
        // Get in the comp
        // Get selected first
        if (bones.length() == 0) bones = new DuList( Duik.Bone.get(true, comp) );
        // or all of them
        if (bones.length() == 0) bones = new DuList( Duik.Bone.get(false, comp) );
        // Still no bone, can't do
        if (bones.length() == 0) return;
    }

    useNames = def(useNames, false);

    DuAE.beginUndoGroup( i18n._("Link art"), false);

    DuScriptUI.progressBar.addMax( layers.length() );

    if (useNames) {
        // For each layer, check if the name is "duik managed" to get the limb name, or the layer name
        // Remove (and keep) any "Bk", "Fr", "L", "R" parts...
        // Check correspondance using fuzzy string comparison
        layers.do(function(layer) {
            DuScriptUI.progressBar.hit(1, i18n._("Trying to parent layer '%1'", layer.name) );
            // Ignore locked layers
            if (layer.locked) return;
            // Don't parent if already parented
            if (layer.parent) return;
            // Check type
            var type = Duik.Layer.type( layer );
            // Parent only these types:
            if (type != Duik.Layer.Type.NONE &&
                type != Duik.Layer.Type.PIN && 
                type != Duik.Layer.Type.ART ) return;
            // Sanitize
            Duik.Layer.sanitize(layer);
            // Get the limbname
            var limbName = Duik.Layer.name(layer);
            // And the character
            var characterName = Duik.Layer.groupName(layer);
            // Search a corresponding bone
            var score = 32000;
            var b = null;

            // ** USE THE BONE LIMB NAME FIRST **

            // First, all perfect matches of the limbname
            var foundBones = [];
            bones.do(function(bone) {
                var bLimbName = Duik.Layer.name(bone);
                if (bLimbName.toLowerCase() == limbName.toLowerCase()) foundBones.push(bone);
            });

            // Try again with exact synonyms of the limbname
            if (foundBones.length == 0) {
                var synonyms = OCOBone.getNameSynonyms( limbName, false );
                var s = 32000;
                for (var i = 0, ni = synonyms.length; i < ni; i++) {
                    var synonym = synonyms[i];
                    bones.do(function(bone) {
                        var bLimbName = Duik.Layer.name(bone);
                        if (bLimbName.toLowerCase() == synonym) foundBones.push(bone);
                    });
                }
            }

            // Then, partial matches
            if (foundBones.length == 0) {
                // Using synonyms of the limbname
                bones.do(function(bone) {
                    var bLimbName = Duik.Layer.name(bone);
                    var synonyms = OCOBone.getNameSynonyms( limbName, true );
                    if (synonyms.score <= 0) return;
                    if (synonyms.score > score) return;
                    // Get the best score for all synonyms
                    for (var i = 0, ni = synonyms.length; i < ni; i++) {
                        var synonym = synonyms[i];
                        var s = DuString.match(bLimbName, synonym);
                        if (s <= 0) continue;
                        if (s > score) continue;
                        if (s == score) {
                            foundBones.push(bone);
                            continue;
                        }
                        if (s < score) {
                            score = s;
                            foundBones = [bone];
                            continue;
                        }
                    }
                });
            }

            // ** TRY WITH THE BONE TYPE **

            if (foundBones.length == 0) {
                // Using synonyms of the limbname
                bones.do(function(bone) {
                    var bType = Duik.Bone.type(bone);
                    var boneSynonyms = [];
                    if (OCO.BoneName.hasOwnProperty(bType))
                        boneSynonyms = OCO.BoneName[bType];
                    else
                        return;
                    if (!boneSynonyms.length) return;

                    var synonyms = OCOBone.getNameSynonyms( limbName, true );
                    if (synonyms.score <= 0) return;
                    if (synonyms.score > score) return;

                    for (var bs = 0, nbs = boneSynonyms.length; bs < nbs; bs++) {
                        var bLimbName = boneSynonyms[bs];
                        // Get the best score for all synonyms
                        for (var i = 0, ni = synonyms.length; i < ni; i++) {
                            var synonym = synonyms[i];
                            var s = DuString.match(bLimbName, synonym);
                            if (s <= 0) continue;
                            if (s > score) continue;
                            if (s == score) {
                                foundBones.push(bone);
                                continue;
                            }
                            if (s < score) {
                                score = s;
                                foundBones = [bone];
                                continue;
                            }
                        }
                    }
                });
            }

            // Nothing, can't parent
            if (foundBones.length == 0) return;
            // Multiple, check side and location
            if (foundBones.length > 1) {
                // The side
                var side = Duik.Layer.side(layer);
                // The location
                var loc = Duik.Layer.location(layer);

                score = 0;
                var cache = foundBones;
                foundBones = [];
                for(var i = 0, ni = cache.length; i < ni; i++) {
                    var bone = cache[i];
                    var bSide = Duik.Layer.side(bone);
                    var bLocation = Duik.Layer.location(bone);
                    var s = 0;
                    if (bSide == side) s++;
                    if (bLocation == loc) s++;
                    if (s < score) continue;
                    if (s == score) {
                        foundBones.push(bone);
                        continue;
                    }
                    foundBones = [bone];
                    score = s;
                }
            }

            // Still multiple, check character
            if (foundBones.length > 1) {
                var characterName = Duik.Layer.groupName(layer);
                score = 32000;
                var filteredBones = [];
                for(var i = 0, ni = foundBones.length; i < ni; i++) {
                    var bone = foundBones[i];
                    var bCharacterName = Duik.Layer.groupName(bone);
                    var s = DuString.match(bCharacterName, characterName);
                    if (s > score) continue;
                    if ((s == 0 && score == 32000) || (s != 0 && s == score))
                    {
                        filteredBones.push(bone);
                        continue;
                    }
                    if (s < score) {
                        score = s;
                        filteredBones = [bone];
                        continue;
                    }
                }
                foundBones = filteredBones;
            }

            // Still multiple, get the closest
            if (foundBones.length > 1)
            {
                score = 32000;
                for (var i = 0, ni = foundBones.length; i < ni; i++) {
                    var bone = foundBones[i];
                    var s = DuAELayer.getDistance(layer, bone);
                    if (s > score) continue;
                    if (s == 0) {
                        b = bone;
                        break;
                    }
                    if (s < score) {
                        score = s;
                        b = bone;
                        continue;
                    }
                }
            }
            else b = foundBones[0];

            layer.parent = b;
            // We can now make sure the character name is the same
            Duik.Layer.setGroupName( 
                Duik.Layer.groupName(b),
                layer
            );
        });
    }
    else {
        // First, for each bone, get range
        // (improves performance, better than scanning for each layer)
        bones.do(function(bone) {
            bone.envelopSize = Duik.Bone.envelopSize(bone);
        });

        // Parent
        layers.do(function(layer) {
            // Ignore locked layers
            if (layer.locked) return;
            // Don't parent if already parented
            if (layer.parent) return;
            // Check type
            var type = Duik.Layer.type( layer );
            // Parent only these types:
            if (type != Duik.Layer.Type.NONE &&
                type != Duik.Layer.Type.PIN && 
                type != Duik.Layer.Type.ART ) return;
            // Find the closest bone & parent
            var b = null;
            var d = 32000;
            bones.do(function(bone) {
                var dist = DuAELayer.getDistance(layer, bone);
                if (dist <= bone.envelopSize && dist < d) {
                    b = bone;
                    d = dist;
                }
            });
            if (b) {
                layer.parent = b;
                // We can now make sure the character name is the same
                Duik.Layer.setGroupName( 
                    Duik.Layer.groupName(b),
                    layer
                );
            }
        });
    }

    DuAE.endUndoGroup( i18n._("Link art"));
}

/**
 * Tags the layers as rigged
 * @param {Layer[]|DuList.<Layer>|Layer} bones The bones to set
 * @param {bool} [rigged=true] The value
 */
Duik.Bone.setRigged = function( bones, rigged ) {
    bones = new DuList(bones);
    rigged = def(rigged, true);

    bones.do(function(bone) {
        DuAETag.setValue( bone, DuAETag.DUIK_RIGGED, rigged );
    });
}

/**
 * Checks if the bone has already been rigged
 * @param {Layer} bone The bone to check
 * @return {bool} true if it's been rigged
 */
Duik.Bone.isRigged = function( bone ) {
    return DuAETag.getValue( bone, DuAETag.DUIK_RIGGED, DuAETag.Type.BOOL );
}

/**
 * Rotates the chain so that the bones form a straight line.<br/>
 * The bones must be parented together.
 * @param {ShapeLayer[]|DuList.<ShapeLayer>} bones The bones to align
 * @return {float[]} The list of the original rotations (before alignment)
 */
Duik.Bone.align = function( bones ) {
    bones = new DuList(bones);
    
    // Keep current rotation values
    var originalRotations = [];
    bones.do(function(bone) {
        originalRotations.push( bone.transform.rotation.value );
    });

    // Sort
    bones = DuAELayer.sortByParent( bones );

    // Set new rotations
    for(var i = 1, ni = bones.length; i < ni; i++)
    {
        var b = bones[i];
        // Get parent
        var pO = Duik.Bone.getOrientation( bones[i-1] );
        var o = Duik.Bone.getOrientation( b );
        b.transform.rotation.setValue( pO - o );
    }

    return originalRotations;
}

/**
 * Gets the bone orientation value
 * @param {ShapeLayer} bone The bone
 * @return {float} The orientation
 */
Duik.Bone.getOrientation = function( bone ) {
    var content = bone.property("ADBE Root Vectors Group");
    if (!content) return 0;
    content = content.property("Bone");
    if (!content) return 0;
    return content.property('ADBE Vector Transform Group').property('ADBE Vector Rotation').value;
}

/**
 * Gets the bones in the comp
 * @param {Boolean} [selectedOnly=true] Whether to get only the selected layers or all of them
 * @param {CompItem} [comp=DuAEProject.getActiveComp()] The comp
 * @returns {ShapeLayer[]} The bones
 */
Duik.Bone.get = function ( selectedOnly, comp )
{
    return Duik.Layer.get( Duik.Layer.Type.BONE, selectedOnly, comp );
}

/**
 * Returns the bones sorted by limbs they belong to
 * @param {Layer[]} [layers=Duik.Bone.get(false)] The layers to include as bones in the doc
 * @return {ShapeLayer[][]} the limbs
 */
Duik.Bone.getLimbs = function( layers )
{
    var bones = def(layers, Duik.Bone.get( false ) );

    var limbs = [];
    // A function to add layers to the list of limbs
    function addToLimb( layer, armatureId )
    {
        // look for existing limb
        var limb = null;
        for (var i = 0, n = limbs.length; i < n; i++)
        {
            if( limbs[i].id == armatureId )
            {
                limb = limbs[i];
                break;
            }
        }
        // create 
        if (limb == null)
        {
            limb = [];
            limb.id = armatureId;
            limbs.push(limb);
        }

        // Used to store child limbs later
        layer.childLimbs = [];
        // add to the limb
        limb.push( layer );
    }

    for (var i = 0, n = bones.length; i < n; i++)
    {
        var bone = bones[i];
        var armatureId = DuAETag.getValue( bone, DuAETag.Key.DUIK_LIMB_ID, DuAETag.Type.INT );
        addToLimb(bone, armatureId);
    }

    // Sort bones by parenting
    for (var i = 0, n = limbs.length; i < n; i++)
    {
        limbs[i] = DuAELayer.sortByParent( limbs[i] );
    }

    // Parent limbs
    for (var i = limbs.length - 1; i >= 0; i--)
    {
        var l = limbs[i];
        var b = l[0];
        if (b.parent == null) continue;
        // Find the parent
        for (var j = 0, nj = limbs.length; j < nj; j++)
        {
            var found = false;
            for (var k = 0, nk = limbs[j].length; k < nk; k++)
            {
                if ( b.parent == limbs[j][k] )
                {
                    // Add to the list of children for this bone
                    limbs[j][k].childLimbs.push(l);
                    // Remove from the list
                    limbs.splice(i, 1);
                    found = true;
                    break;
                }
            }
            if (found) break;
        }
    }

    return limbs;
}

/**
 * Sets the side of the layer
 * @param {OCO.Side} side The side
 * @param {Layer[]} [layers=Duik.Bone.get()] The layer. If omitted, will use all selected layers in the comp
 */
Duik.Bone.setSide = function( side, layers )
{
    layers = def( layers, Duik.Bone.get() );
    Duik.Layer.setSide( side, layers );
}

/**
 * Sets the location of the layer
 * @param {OCO.Side} side The side
 * @param {Layer[]} [layers=DuAEComp.getSelectedLayers()] The layers. If omitted, will use all selected layers in the comp
 */
Duik.Bone.setLocation = function( location, layers )
{
    layers = def( layers, Duik.Bone.get() );
    Duik.Layer.setLocation( location, layers );
}

/**
 * Checks the color of the bone layer
 * @param {Layer} [layer=DuAEComp.getActiveLayer] The layer. If omitted, will check the first selected bone of the current comp
 * @returns {DuColor}
 */
Duik.Bone.color = function( layer )
{
    layer = def(layer, DuAEComp.getActiveLayer());
    if (!layer) return new DuColor();

    if ( !Duik.Layer.isType(layer, Duik.Layer.Type.BONE) ) return new DuColor();

    var colorIndex = Duik.PseudoEffect.BONE.props['Color'].index;

    var effect = layer.effect( Duik.PseudoEffect.BONE.matchName );
    if (effect) return new DuColor( effect( colorIndex ).value );

    var content = DuAEShapeLayer.getVectorGroupContents(
        layer,
        'Bone/Display'
    );
    if (!content) return new DuColor();
    return new DuColor(
        content.property("ADBE Vector Graphic - Fill").property("ADBE Vector Fill Color").value
    );
}

/**
 * Sets the color of the bone layers
 * @param {DuColor|null} [color] The color. If omitted or null, will assign a random color for each bone.
 * @param {Layer|LayerCollection|Layer[]|DuList.<Layer>} [layers=DuAEComp.getSelectedLayers()] The layers. If omitted, will use all selected layers in the comp
 */
Duik.Bone.setColor = function( color, layers )
{
    layers = def(layers, DuAEComp.getSelectedLayers());
    layers = new DuList(layers);
    if (layers.length() == 0) return;

    for(var i = 0, n = layers.length(); i < n; i++)
    {
        var layer = layers.at(i);

        if ( !Duik.Layer.isType(layer, Duik.Layer.Type.BONE) ) continue;

        var colorIndex = Duik.PseudoEffect.BONE.props['Color'].index;
        var c = [0,0,0,0];
        if (typeof color === 'undefined' || color == null) c = DuColor.random().floatRGBA();
        else c = color.floatRGBA();

        var effect = layer.effect( Duik.PseudoEffect.BONE.matchName );
        if (effect) effect( colorIndex ).setValue( c );
        else {
            var content = DuAEShapeLayer.getVectorGroupContents(
                layer,
                'Bone/Display'
            );
            if (!content) continue;
            content.property("ADBE Vector Graphic - Fill").property("ADBE Vector Fill Color").setValue( c );
        }
        
    }
}

/**
 * Checks the size of the bone layer
 * @param {Layer} [layer=DuAEComp.getActiveLayer] The layer. If omitted, will check the first selected bone of the current comp
 * @returns {float}
 */
Duik.Bone.size = function( layer )
{
    layer = def(layer, DuAEComp.getActiveLayer());
    if (!layer) return 100;

    if ( !Duik.Layer.isType(layer, Duik.Layer.Type.BONE) ) return 100;

    var sizeIndex = Duik.PseudoEffect.BONE.props['Size'].index;

    var effect = layer.effect( Duik.PseudoEffect.BONE.matchName );
    if (!effect) return 100;

    return effect( sizeIndex ).value;
}

/**
 * Gets the type of bone
 * @param {Layer} [layer=DuAEComp.getActiveLayer] The layer. If omitted, will check the first selected bone of the current comp
 * @returns {OCO.Bone} The type
 */
Duik.Bone.type = function( layer )
{
    layer = def(layer, DuAEComp.getActiveLayer());
    if (!layer) return "";

    var bType = DuAETag.getValue( layer, DuAETag.Key.DUIK_BONE_TYPE, DuAETag.Type.STRING );
    if (bType == "") return OCO.Bone.CUSTOM;
    return bType;
}

/**
 * Checks if the bone layer has a visible envelop
 * @param {Layer} [layer=DuAEComp.getActiveLayer] The layer. If omitted, will check the first selected bone of the current comp
 * @returns {bool}
 */
Duik.Bone.hasEnvelop = function( layer )
{
    layer = def(layer, DuAEComp.getActiveLayer());
    if (!layer) return 0;

    if ( !Duik.Layer.isType(layer, Duik.Layer.Type.BONE) ) return 0;

    var effect = layer.effect( Duik.PseudoEffect.BONE_ENVELOP.matchName );
    if (effect) return effect.enabled;

    // Get from the shape layer content
    var content = layer.property('ADBE Root Vectors Group');
    if (!content) return false;
    content = content.property('Envelop');
    if (!content) return false;
    var v = content.property('ADBE Vector Transform Group').property('ADBE Vector Group Opacity').value;
    return v != 0;
}

/**
 * Toggles the envelop
 * @param {bool} [enabled=true]
 * @param {Layer|LayerCollection|Layer[]|DuList.<Layer>} [layers=DuAEComp.getSelectedLayers()] The layers. If omitted, will use all selected layers in the comp
 */
Duik.Bone.setEnvelopEnabled = function( enabled, layers )
{
    layers = def(layers, DuAEComp.getSelectedLayers());
    layers = new DuList(layers);
    if (layers.length() == 0) return;

    enabled = def(enabled, true);

    layers.do(function(layer) {
        if ( !Duik.Layer.isType(layer, Duik.Layer.Type.BONE) ) return;

        var effect = layer.effect( Duik.PseudoEffect.BONE_ENVELOP.matchName );
        if (effect) effect.enabled = enabled;
        else {
            // Get from the shape layer content
            var content = layer.property('ADBE Root Vectors Group');
            if (!content) return;
            content = content.property('Envelop');
            if (!content) return;
            var v = content.property('ADBE Vector Transform Group').property('ADBE Vector Group Opacity');
            if (enabled) v.setValue(100);
            else v.setValue(0);
        }
    });    
}

/**
 * Checks the size of the envelop of the bone layer
 * @param {Layer} [layer=DuAEComp.getActiveLayer] The layer. If omitted, will check the first selected bone of the current comp
 * @returns {float}
 */
Duik.Bone.envelopSize = function( layer )
{
    layer = def(layer, DuAEComp.getActiveLayer());
    if (!layer) return 0;

    if ( !Duik.Layer.isType(layer, Duik.Layer.Type.BONE) ) return 0;

    //if (!Duik.Bone.hasEnvelop(layer)) return 0;

    var sizeIndex = Duik.PseudoEffect.BONE_ENVELOP.props['Size'].index;

    var effect = layer.effect( Duik.PseudoEffect.BONE_ENVELOP.matchName );
    if (!effect) {
        // Get from the shape layer content
        var content = layer.property('ADBE Root Vectors Group');
        if (!content) return 10;
        content = content.property('Envelop');
        if (!content) return 10;
        content = content.property('ADBE Vectors Group').property('root');
        var v = content.property('ADBE Vector Transform Group').property('ADBE Vector Scale').value;
        if (v[0] != 0) return Math.abs(v[0]);
        if (v[1] != 0) return Math.abs(v[1]);
        return 10;
    }
    return effect( sizeIndex ).value;
}

/**
 * Sets the size of the envelop of the bone layer
 * @param {float} size The new size
 * @param {Layer|LayerCollection|Layer[]|DuList.<Layer>} [layers=DuAEComp.getSelectedLayers()] The layers. If omitted, will use all selected layers in the comp
 */
Duik.Bone.setEnvelopSize = function( size, layers )
{
    layers = def(layers, DuAEComp.getSelectedLayers());
    layers = new DuList(layers);
    if (layers.length() == 0) return;

    layers.do(function(layer)
    {
        if ( !Duik.Layer.isType(layer, Duik.Layer.Type.BONE) ) return;

        var sizeIndex = Duik.PseudoEffect.BONE_ENVELOP.props['Size'].index;

        var effect = layer.effect( Duik.PseudoEffect.BONE_ENVELOP.matchName );
        if (!effect) {
            // Get from the shape layer content
            var content = layer.property('ADBE Root Vectors Group');
            if (!content) return;
            content = content.property('Envelop');
            if (!content) return;
            content = content.property('ADBE Vectors Group').property('root');
            var v = content.property('ADBE Vector Transform Group').property('ADBE Vector Scale');
            v.setValue([size, size]);
            return;
        }
        effect( sizeIndex ).setValue(size);
    });   
}

/**
 * Checks the offset of the envelop of the bone layer
 * @param {Layer} [layer=DuAEComp.getActiveLayer] The layer. If omitted, will check the first selected bone of the current comp
 * @returns {float}
 */
Duik.Bone.envelopOffset = function( layer )
{
    layer = def(layer, DuAEComp.getActiveLayer());
    if (!layer) return 0;

    if ( !Duik.Layer.isType(layer, Duik.Layer.Type.BONE) ) return 0;

    if (!Duik.Bone.hasEnvelop(layer)) return 0;

    var offsetIndex = Duik.PseudoEffect.BONE_ENVELOP.props['Offset'].index;

    var effect = layer.effect( Duik.PseudoEffect.BONE_ENVELOP.matchName );
    if (!effect) {
        // Get from the shape layer content
        var content = layer.property('ADBE Root Vectors Group');
        if (!content) return 0;
        content = content.property('Envelop');
        if (!content) return 0;
        content = content.property('ADBE Vectors Group').property('root');
        var p = content.property('ADBE Vector Transform Group').property('ADBE Vector Position').value;
        return -p[0];
    }
    return effect( offsetIndex ).value;
}

/**
 * Sets the offset of the envelop of the bone layer
 * @param {float} offset The offset
 * @param {Layer|LayerCollection|Layer[]|DuList.<Layer>} [layers=DuAEComp.getSelectedLayers()] The layers. If omitted, will use all selected layers in the comp
 */
Duik.Bone.setEnvelopOffset = function( offset, layers )
{
    layers = def(layers, DuAEComp.getSelectedLayers());
    layers = new DuList(layers);
    if (layers.length() == 0) return;

    layers.do(function(layer)
    {
        if ( !Duik.Layer.isType(layer, Duik.Layer.Type.BONE) ) return;

        var offsetIndex = Duik.PseudoEffect.BONE_ENVELOP.props['Offset'].index;

        var effect = layer.effect( Duik.PseudoEffect.BONE_ENVELOP.matchName );
        if (!effect) {
            // Get from the shape layer content
            var content = layer.property('ADBE Root Vectors Group');
            if (!content) return;
            content = content.property('Envelop');
            if (!content) return;
            content = content.property('ADBE Vectors Group').property('root');
            var p = content.property('ADBE Vector Transform Group').property('ADBE Vector Position');
            p.setValue([-offset, p.value[0]]);
            return;
        }
        effect( offsetIndex ).setValue(offset);
    });
}

/**
 * Checks the opacity of the envelop of the bone layer
 * @param {Layer} [layer=DuAEComp.getActiveLayer] The layer. If omitted, will check the first selected bone of the current comp
 * @returns {float}
 */
Duik.Bone.envelopOpacity = function( layer )
{
    layer = def(layer, DuAEComp.getActiveLayer());
    if (!layer) return 0;

    if ( !Duik.Layer.isType(layer, Duik.Layer.Type.BONE) ) return 0;

    if (!Duik.Bone.hasEnvelop(layer)) return 0;

    var opacityIndex = Duik.PseudoEffect.BONE_ENVELOP.props['Fill']['Opacity'].index;

    var effect = layer.effect( Duik.PseudoEffect.BONE_ENVELOP.matchName );
    if (!effect) {
        // Get from the shape layer content
        var content = layer.property('ADBE Root Vectors Group');
        if (!content) return 0;
        content = content.property('Envelop');
        if (!content) return 0;
        content = content.property('ADBE Vectors Group').property('Shape');
        if (!content) return 0;
        content = content.property('ADBE Vector Graphic - Fill');
        if (!content) return 0;
        return content.property('ADBE Vector Fill Opacity').value;
    }
    return effect( opacityIndex ).value;
}

/**
 * Sets the opacity of the envelop of the bone layer
 * @param {float} opacity The opacity
 * @param {Layer|LayerCollection|Layer[]|DuList.<Layer>} [layers=DuAEComp.getSelectedLayers()] The layers. If omitted, will use all selected layers in the comp
 */
Duik.Bone.setEnvelopOpacity = function( opacity, layers )
{
    layers = def(layers, DuAEComp.getSelectedLayers());
    layers = new DuList(layers);
    if (layers.length() == 0) return;

    layers.do(function(layer)
    {
        if ( !Duik.Layer.isType(layer, Duik.Layer.Type.BONE) ) return;

        var opacityIndex = Duik.PseudoEffect.BONE_ENVELOP.props['Fill']['Opacity'].index;

        var effect = layer.effect( Duik.PseudoEffect.BONE_ENVELOP.matchName );
        if (!effect) {
            // Get from the shape layer content
            // Get from the shape layer content
            var content = layer.property('ADBE Root Vectors Group');
            if (!content) return 0;
            content = content.property('Envelop');
            if (!content) return 0;
            content = content.property('ADBE Vectors Group').property('Shape');
            var p = content.property('ADBE Vector Graphic - Fill').property('ADBE Vector Fill Opacity');
            p.setValue( opacity );
            return;
        }
        effect( opacityIndex ).setValue( opacity );
    });
}

/**
 * Checks the color of the envelop of the bone layer
 * @param {Layer} [layer=DuAEComp.getActiveLayer] The layer. If omitted, will check the first selected bone of the current comp
 * @returns {DuColor}
 */
Duik.Bone.envelopColor = function( layer )
{
    layer = def(layer, DuAEComp.getActiveLayer());
    if (!layer) return new DuColor( );

    if ( !Duik.Layer.isType(layer, Duik.Layer.Type.BONE) ) return new DuColor( );

    if (!Duik.Bone.hasEnvelop(layer)) return new DuColor( );

    var colorIndex = Duik.PseudoEffect.BONE_ENVELOP.props['Fill']['Color'].index;

    var effect = layer.effect( Duik.PseudoEffect.BONE_ENVELOP.matchName );
    if (!effect) {
        // Get from the shape layer content
        var content = layer.property('ADBE Root Vectors Group');
        if (!content) return 0;
        content = content.property('Envelop');
        if (!content) return 0;
        content = content.property('ADBE Vectors Group').property('Shape');
        var c = content.property('ADBE Vector Graphic - Fill').property('ADBE Vector Fill Color').value;
        return new DuColor( c );
    }
    return new DuColor( effect( colorIndex ).value );
}

/**
 * Sets the color of the envelop of the bone layer
 * @param {DuColor} color The color.
 * @param {Layer|LayerCollection|Layer[]|DuList.<Layer>} [layers=DuAEComp.getSelectedLayers()] The layers. If omitted, will use all selected layers in the comp
 */
Duik.Bone.setEnvelopColor = function( color, layers )
{
    layers = def(layers, DuAEComp.getSelectedLayers());
    layers = new DuList(layers);
    if (layers.length() == 0) return;

    layers.do(function(layer)
    {

        if ( !Duik.Layer.isType(layer, Duik.Layer.Type.BONE) ) return;

        var colorIndex = Duik.PseudoEffect.BONE_ENVELOP.props['Fill']['Color'].index;

        var effect = layer.effect( Duik.PseudoEffect.BONE_ENVELOP.matchName );
        if (!effect) {
            // Get from the shape layer content
            // Get from the shape layer content
            var content = layer.property('ADBE Root Vectors Group');
            if (!content) return 0;
            content = content.property('Envelop');
            if (!content) return 0;
            content = content.property('ADBE Vectors Group').property('Shape');
            var p = content.property('ADBE Vector Graphic - Fill').property('ADBE Vector Fill Color');
            p.setValue( color.floatRGBA() );
            return;
        }
        effect( colorIndex ).setValue( color.floatRGBA() );

    });
}

/**
 * Checks the stroke size of the envelop of the bone layer
 * @param {Layer} [layer=DuAEComp.getActiveLayer] The layer. If omitted, will check the first selected bone of the current comp
 * @returns {float}
 */
Duik.Bone.envelopStrokeSize = function( layer )
{
    layer = def(layer, DuAEComp.getActiveLayer());
    if (!layer) return 0;

    if ( !Duik.Layer.isType(layer, Duik.Layer.Type.BONE) ) return 0;

    if (!Duik.Bone.hasEnvelop(layer)) return 0;

    var strokeSizeIndex = Duik.PseudoEffect.BONE_ENVELOP.props['Stroke']['Size'].index;

    var effect = layer.effect( Duik.PseudoEffect.BONE_ENVELOP.matchName );
    if (!effect) {
        // Get from the shape layer content
        var content = layer.property('ADBE Root Vectors Group');
        if (!content) return 0;
        content = content.property('Envelop');
        if (!content) return 0;
        content = content.property('ADBE Vectors Group').property('Shape');
        return content.property('ADBE Vector Graphic - Stroke').property('ADBE Vector Stroke Width').value;
    }
    return effect( strokeSizeIndex ).value;
}

/**
 * Sets the stroke size of the envelop of the bone layer
 * @param {float} color The color
 * @param {Layer|LayerCollection|Layer[]|DuList.<Layer>} [layers=DuAEComp.getSelectedLayers()] The layers. If omitted, will use all selected layers in the comp
 */
Duik.Bone.setEnvelopStrokeSize = function( size, layers )
{
    layers = def(layers, DuAEComp.getSelectedLayers());
    layers = new DuList(layers);
    if (layers.length() == 0) return;

    layers.do(function(layer)
    {
        if ( !Duik.Layer.isType(layer, Duik.Layer.Type.BONE) ) return;

        var strokeSizeIndex = Duik.PseudoEffect.BONE_ENVELOP.props['Stroke']['Size'].index;

        var effect = layer.effect( Duik.PseudoEffect.BONE_ENVELOP.matchName );
        if (!effect) {
            // Get from the shape layer content
            // Get from the shape layer content
            var content = layer.property('ADBE Root Vectors Group');
            if (!content) return 0;
            content = content.property('Envelop');
            if (!content) return 0;
            content = content.property('ADBE Vectors Group').property('Shape');
            var p = content.property('ADBE Vector Graphic - Stroke').property('ADBE Vector Stroke Width');
            p.setValue( size );
            return;
        }
        effect( strokeSizeIndex ).setValue( size );

    });
}

/**
 * Checks the stroke color of the envelop of the bone layer
 * @param {Layer} [layer=DuAEComp.getActiveLayer] The layer. If omitted, will check the first selected bone of the current comp
 * @returns {DuColor}
 */
Duik.Bone.envelopStrokeColor = function( layer )
{
    layer = def(layer, DuAEComp.getActiveLayer());
    if (!layer) return new DuColor( );

    if ( !Duik.Layer.isType(layer, Duik.Layer.Type.BONE) ) return new DuColor( );

    if (!Duik.Bone.hasEnvelop(layer)) return new DuColor( );

    var strokeColorIndex = Duik.PseudoEffect.BONE_ENVELOP.props['Stroke']['Color'].index;

    var effect = layer.effect( Duik.PseudoEffect.BONE_ENVELOP.matchName );
    if (!effect) {
        // Get from the shape layer content
        var content = layer.property('ADBE Root Vectors Group');
        if (!content) return 0;
        content = content.property('Envelop');
        if (!content) return 0;
        content = content.property('ADBE Vectors Group').property('Shape');
        var c = content.property('ADBE Vector Graphic - Stroke').property('ADBE Vector Stroke Color').value;
        return new DuColor( c );
    }
    return new DuColor( effect( strokeColorIndex ).value );
}

/**
 * Sets the stroke color of the envelop of the bone layer
 * @param {DuColor} color The color.
 * @param {Layer|LayerCollection|Layer[]|DuList.<Layer>} [layers=DuAEComp.getSelectedLayers()] The layers. If omitted, will use all selected layers in the comp
 */
Duik.Bone.setEnvelopStrokeColor = function( color, layers )
{
    layers = def(layers, DuAEComp.getSelectedLayers());
    layers = new DuList(layers);
    if (layers.length() == 0) return;

    layers.do(function(layer)
    {
        if ( !Duik.Layer.isType(layer, Duik.Layer.Type.BONE) ) return;

        var strokeColorIndex = Duik.PseudoEffect.BONE_ENVELOP.props['Stroke']['Color'].index;

        var effect = layer.effect( Duik.PseudoEffect.BONE_ENVELOP.matchName );
        if (!effect) {
            // Get from the shape layer content
            // Get from the shape layer content
            var content = layer.property('ADBE Root Vectors Group');
            if (!content) return 0;
            content = content.property('Envelop');
            if (!content) return 0;
            content = content.property('ADBE Vectors Group').property('Shape');
            var p = content.property('ADBE Vector Graphic - Stroke').property('ADBE Vector Stroke Color');
            p.setValue( color.floatRGBA() );
            return;
        }
        effect( strokeColorIndex ).setValue( color.floatRGBA() );

    });
}

Duik.Bone.hasNoodle = function( layer )
{
    layer = def(layer, DuAEComp.getActiveLayer());
    if (!layer) return 0;

    if ( !Duik.Layer.isType(layer, Duik.Layer.Type.BONE) ) return 0;

    var effect = layer.effect( Duik.PseudoEffect.BONE_NOODLE.matchName );
    if (effect) return effect.enabled;

    // Get from the shape layer content
    var content = layer.property('ADBE Root Vectors Group');
    if (!content) return false;
    content = content.property('Noodle');
    if (!content) return false;
    var v = content.property('ADBE Vector Transform Group').property('ADBE Vector Group Opacity').value;
    return v != 0;
}

/**
 * Checks the color of the noodle of the bone layer
 * @param {Layer} [layer=DuAEComp.getActiveLayer] The layer. If omitted, will check the first selected bone of the current comp
 * @returns {DuColor}
 */
Duik.Bone.noodleColor = function( layer )
{
    layer = def(layer, DuAEComp.getActiveLayer());
    if (!layer) return new DuColor( );

    if ( !Duik.Layer.isType(layer, Duik.Layer.Type.BONE) ) return new DuColor( );

    if (!Duik.Bone.hasEnvelop(layer)) return new DuColor( );

    var colorIndex = Duik.PseudoEffect.BONE_NOODLE.props['Color'].index;

    var effect = layer.effect( Duik.PseudoEffect.BONE_NOODLE.matchName );
    if (!effect) {
        // Get from the shape layer content
        var content = layer.property('ADBE Root Vectors Group');
        if (!content) return 0;
        content = content.property('Noodle');
        if (!content) return 0;
        content = content.property('ADBE Vectors Group');
        var c = content.property('ADBE Vector Graphic - Stroke').property('ADBE Vector Stroke Color').value;
        return new DuColor( c );
    }
    return new DuColor( effect( colorIndex ).value );
}

/**
 * Sets the stroke color of the envelop of the bone layer
 * @param {DuColor} color The color.
 * @param {Layer|LayerCollection|Layer[]|DuList.<Layer>} [layers=DuAEComp.getSelectedLayers()] The layers. If omitted, will use all selected layers in the comp
 */
Duik.Bone.setNoodleColor = function( color, layers )
{
    layers = def(layers, DuAEComp.getSelectedLayers());
    layers = new DuList(layers);
    if (layers.length() == 0) return;

    layers.do(function(layer)
    {
        if ( !Duik.Layer.isType(layer, Duik.Layer.Type.BONE) ) return;

        var colorIndex = Duik.PseudoEffect.BONE_NOODLE.props['Color'].index;

        var effect = layer.effect( Duik.PseudoEffect.BONE_NOODLE.matchName );
        if (!effect) {
            // Get from the shape layer content
            // Get from the shape layer content
            var content = layer.property('ADBE Root Vectors Group');
            if (!content) return 0;
            content = content.property('Noodle');
            if (!content) return 0;
            content = content.property('ADBE Vectors Group');
            var p = content.property('ADBE Vector Graphic - Stroke').property('ADBE Vector Stroke Color');
            p.setValue( color.floatRGBA() );
            return;
        }
        effect( colorIndex ).setValue( color.floatRGBA() );

    });
}

/**
 * Toggles the noodle
 * @param {bool} [enabled=true]
 * @param {Layer} [layers] The layers. If omitted, will use all selected bones
 */
Duik.Bone.setNoodleEnabled = function ( enabled, layers )
{
    layers = def(layers, DuAEComp.getSelectedLayers());
    layers = new DuList(layers);
    if (layers.length() == 0) return;

    enabled = def(enabled, true);

    layers.do(function(layer)
    {
        if ( !Duik.Layer.isType(layer, Duik.Layer.Type.BONE) ) return;

        var effect = layer.effect( Duik.PseudoEffect.BONE_NOODLE.matchName );
        if (effect) effect.enabled = enabled;
        else {
            // Get from the shape layer content
            var content = layer.property('ADBE Root Vectors Group');
            if (!content) return;
            content = content.property('Noodle');
            if (!content) return;
            var v = content.property('ADBE Vector Transform Group').property('ADBE Vector Group Opacity');
            if (enabled) v.setValue(100);
            else v.setValue(0);
        }
    });
}

/**
 * Sets the size of the bone layer
 * @param {float} size The size in %.
 * @param {Layer} [layer=DuAEComp.getSelectedLayers()] The layers. If omitted, will use all selected layers in the comp
 */
Duik.Bone.setSize = function( size, layers )
{
    layers = def(layers, DuAEComp.getSelectedLayers());
    if (layers.length == 0) return;

    for(var i = 0, n = layers.length; i < n; i++)
    {
        var layer = layers[i];

        if ( !Duik.Layer.isType(layer, Duik.Layer.Type.BONE) ) continue;

        var sizeIndex = Duik.PseudoEffect.BONE.props['Size'].index;
        var effect = layer.effect( Duik.PseudoEffect.BONE.matchName );
        if (!effect) continue;
        effect( sizeIndex ).setValue( size );
    }
}

/**
 * Checks the opacity of the bone layer
 * @param {Layer} [layer=DuAEComp.getActiveLayer] The layer. If omitted, will check the first selected bone of the current comp
 * @returns {DuColor}
 */
Duik.Bone.opacity = function( layer )
{
    layer = def(layer, DuAEComp.getActiveLayer());
    if (!layer) return 50;

    if ( !Duik.Layer.isType(layer, Duik.Layer.Type.BONE) ) return 50;

    var opacityIndex = Duik.PseudoEffect.BONE.props['Opacity'].index;

    var effect = layer.effect( Duik.PseudoEffect.BONE.matchName );
    if (effect) return effect( opacityIndex ).value;

    var content = DuAEShapeLayer.getVectorGroupTransform( layer, 'Bone/Display');
    if (!content) return 50;
    return content.property("ADBE Vector Group Opacity").value;
}

/**
 * Sets the opacity of the bone layer
 * @param {float} opacity The opacity in %.
 * @param {Layer} [layer=DuAEComp.getSelectedLayers()] The layers. If omitted, will use all selected layers in the comp
 */
Duik.Bone.setOpacity = function( opacity, layers )
{
    layers = def(layer, DuAEComp.getSelectedLayers());
    if (layers.length == 0) return;

    for(var i = 0, n = layers.length; i < n; i++)
    {
        var layer = layers[i];

        if ( !Duik.Layer.isType(layer, Duik.Layer.Type.BONE) ) continue;

        var opacityIndex = Duik.PseudoEffect.BONE.props['Opacity'].index;
        var effect = layer.effect( Duik.PseudoEffect.BONE.matchName );
        if (effect) effect( opacityIndex ).setValue( opacity );
        var content = DuAEShapeLayer.getVectorGroupTransform( layer, 'Bone/Display');
        if (!content) continue;
        content.property("ADBE Vector Group Opacity").setValue( opacity );
    }
}

/**
 * Sets the character name of the bone layer
 * @param {string} characterName The character name.
 * @param {Layer} [layer=DuAEComp.getSelectedLayers()] The layers. If omitted, will use all selected layers in the comp
 */
Duik.Bone.setCharacterName = function( characterName, layers )
{
    layers = def( layers, Duik.Bone.get() );
    Duik.Layer.setGroupName( characterName, layers );
}

/**
 * Sets the limb name of the bone layer
 * @param {string} limbName The limb name.
 * @param {Layer} [layer=DuAEComp.getSelectedLayers()] The layers. If omitted, will use all selected layers in the comp
 */
Duik.Bone.setLimbName = function( limbName, layers )
{
    layers = def( layers, Duik.Bone.get() );
    Duik.Layer.setName( limbName, layers );
}

/**
 * Resets the transformations (rotation and scale) of the bone to 0 and 100%
 * @param {Layer} layer
 */
Duik.Bone.resetTransform = function( layer )
{
    if ( !Duik.Layer.isType( layer, Duik.Layer.Type.BONE ) ) return;
    var children = DuAELayer.getChildren( layer );
    var it = new DuList( children );
    it.do( function( child )
    {
        var locked = child.locked;
        if ( locked ) child.locked = false;
        child.parent = null;
        child.locked = locked;
    } );
    layer.transform.rotation.setValue( 0 );
    layer.transform.scale.setValue( [ 100, 100, 100 ] );
    it.do( function( child )
    {
        var locked = child.locked;
        if ( locked ) child.locked = false;
        child.parent = layer;
        child.locked = locked;
    } );
}
