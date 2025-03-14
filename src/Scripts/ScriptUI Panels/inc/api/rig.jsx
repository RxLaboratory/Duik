/**
 * (Auto)Rigging tools.
 * @namespace
 * @category Duik
 */
Duik.Rig = {};

/**
 * The list of (auto)rigging functions
 * @namespace
 */
Duik.CmdLib['Auto-rig'] = {};


Duik.CmdLib['Auto-rig']['Rig'] = 'Duik.Rig.auto()';
/**
 * The auto-rig for everything
 * @param {Boolean} [bakeBones=true] Whether to bake bones
 * @param {Boolean} [bakeEnvelops=true] Whether to bake envelops
 * @param {Boolean} [bakeNoodles=true] Whether to remove deactivated noodles
 * @param {Duik.Constraint.IKType} [longChainMode=Duik.Constraint.IKType.FK] Set to true if you prefer using Bézier IK than FK with overlap for tails and other chains consisting of more than 3 layers.
 * @param {Duik.Constraint.IKType} [threeLayerMode=Duik.Constraint.IKType.ONE_TWO] The type of IK to use with custom 3-layer chains.
 * @param {Layer[]|DuList.<Layer>} [layers] - The layers to rig. All selected layers by default.
 * @param {Boolean} [createMaster=false] Set to true to add a master/root controller which controls all other controllers
 * @return {Layer[]} The controllers which are used in the rig
 */
Duik.Rig.auto = function ( bakeBones, bakeEnvelops, bakeNoodles, longChainMode, threeLayerMode, layers, createMaster )
{
    bakeBones = def( bakeBones, true );
    bakeEnvelops = def( bakeEnvelops, true );
    bakeNoodles = def( bakeNoodles, true );
    threeLayerMode = def( threeLayerMode, Duik.Constraint.IKType.ONE_TWO );
    longChainMode = def( longChainMode , Duik.Constraint.IKType.FK );
    createMaster = def(createMaster, false);

    layers = def(layers, DuAEComp.unselectLayers() );
    layers = new DuList(layers);
    if( layers.isEmpty() ) return;

    var comp = layers.first().containingComp;

    //check if there are 3D Layers
    for (var i = 0, n = layers.length(); i < n; i++)
    {
        if (layers.at(i).threeDLayer)
        {
            alert( i18n._("Some layers are 3D layers, that's a problem...") +
                '\n' + i18n._("This can't be rigged, sorry."));
            return;
        }
    }

    DuAE.beginUndoGroup( i18n._("Auto-rig"), false );
    DuAEProject.setProgressMode( true );

    // Progress
    DuScriptUI.progressBar.stg( i18n._("Auto-rig"));
    DuScriptUI.progressBar.msg( i18n._("Sorting layers...") );

    // Sort layers
    var bones = [];
    var customControllers = [];
    var otherLayers = [];
    layers.do(function( layer )
    {
        // It's already rigged, ignore
        if (Duik.Bone.isRigged(layer)) return;

        // It's a bone
        if ( Duik.Layer.isType( layer, Duik.Layer.Type.BONE ) )
            bones.push(layer);
        // It's a controller
        else if ( Duik.Layer.isType( layer, Duik.Layer.Type.CONTROLLER ) )
            customControllers.push(layer);
        // It's something else
        else otherLayers.push(layer);
    });

    // No bones, standard IK
    if (bones.length == 0) {
        var ctrl = null;
        if (customControllers.length > 0) ctrl = customControllers[0];
        Duik.Constraint.ik(threeLayerMode, false, otherLayers, ctrl, longChainMode == Duik.Constraint.IKType.BEZIER_FK );
    }

    // Create OCO Doc from bones
    var ocoDoc = OCODoc.fromComp('', comp, bones );

    // Start by baking (improves perf and optionaly keeps envelops)
    Duik.Bone.bake(bakeBones, bakeEnvelops, bakeNoodles, bones, false);
    DuAEComp.unselectLayers();
    
    // Rig all limbs
    DuScriptUI.progressBar.addMax( ocoDoc.numLimbs() * 4 ); // 4 steps per limb
    

    for (var i  = 0, ni = ocoDoc.limbs.length; i < ni; i++ )
        Duik.Rig.limb( ocoDoc.limbs[i], customControllers, longChainMode, threeLayerMode );

    // Try to parent limbs which weren't parented.
    var spine = ocoDoc.getSpine();
    if (spine != null)
    {
        var spineLayers = spine.getLayers();
        if (spineLayers.length > 0)
        {
            for (var i  = 0, ni = ocoDoc.limbs.length; i < ni; i++ )
            {
                var limb = ocoDoc.limbs[i];
                // If it's a spine, ignore
                if (limb.limb == OCO.Limb.SPINE || limb.limb == OCO.Limb.FISH_SPINE)
                    continue;

                if (limb.armature.length == 0)
                    continue;

                // Find the parent bone
                var parentBone = null;
                var rootBone = limb.armature[0];
                if (!rootBone.layer) continue;

                // If it's a leg -> parent to the hips no matter what!
                if (limb.limb == OCO.Limb.LEG)
                    parentBone = spineLayers[0];
                else
                    parentBone = Duik.Rig.getSpineAttach(
                        DuAELayer.getWorldPos(rootBone.layer),
                        spineLayers
                    );

                Duik.Rig.parentLimb(limb, parentBone);
            }
        }
    }

    var ctrls = [];
    var limbs = ocoDoc.getLimbs();
    for (var i  = 0, ni = limbs.length; i < ni; i++ )
    {
        ctrls = ctrls.concat( limbs[i].ctrls );
    }

    var masterCtrl = null;
    if (createMaster)
    {
        for (var i  = 0, ni = ctrls.length; i < ni; i++ )
        {
            var ctrl = ctrls[i];
            if (ctrl.parent) continue;
            if (!masterCtrl) {
                DuAEComp.unselectLayers();
                DuAEComp.selectLayers(ctrls);
                masterCtrl = Duik.Controller.fromLayers( Duik.Controller.Type.NULL, false, true )[0];
                break;
            }
        }
    }

    if (masterCtrl) {
        /* @ts-ignore */
        masterCtrl.transform.position.setValue( [masterCtrl.transform.position.value[0], comp.height - comp.height * .05] );
        Duik.Layer.setName(i18n._("Root"), masterCtrl); /// TRANSLATORS: The name of a controller which controls all other controllers.
        DuAELayer.parent(ctrls, masterCtrl, true, false);
    }
    else {
        // Select the controllers
        DuAEComp.unselectLayers();
        DuAEComp.selectLayers(ctrls);
    }

    // If controllers are nulls, move them to the top of the comp
    var ctrlType = OCO.config.get('after effects/controller layer type', Duik.Controller.LayerMode.SHAPE);
    if ( ctrlType == Duik.Controller.LayerMode.NULL ) {
        for (var i = 0; i < ctrls.length; i++) {
            ctrls[i].moveBefore( comp.layer(1)
        ); };
    };

    DuAEProject.setProgressMode( false );
    DuAE.endUndoGroup( i18n._("Auto-rig") );
}

/**
 * Parents a rigged limb (i.e. the bones and controllers) to a bone.<br/>
 * The limb must have been rigged with {@link Duik.Rig.limb}, or must have a <code>.ctrls</code> attribute, which is an array of Layer containing the controllers.
 * @param {OCOLimb} limb The limb to parent
 * @param {OCOBone} bone The parent bone
 */
Duik.Rig.parentLimb = function(limb, parentLayer)
{
    // Parent root bones
    for (var i = 0, ni = limb.armature.length; i < ni; i++)
    {
        var rootBone = limb.armature[i];
        if (rootBone.layer)
        {
            var rootParent = rootBone.layer.parent;
            if (rootParent == null)
                rootBone.layer.parent = parentLayer;
            else if (rootParent.parent == null)
                rootParent.parent = parentLayer;
        }
    }

    // For some limbs, we need to parent controllers too
    if (limb.limb == OCO.Limb.TAIL)
    {
        // Ctrls should follow the parent
        for (var i = 0, ni = limb.ctrls.length; i < ni; i++)
        {
            var ctrl = limb.ctrls[i];
            if (ctrl.parent == null) ctrl.parent = parentLayer;
        }
    }
    else if (limb.limb == OCO.Limb.WING)
    {
        var ctrl = limb.ctrls[0];
        if (ctrl.parent == null) ctrl.parent = parentLayer;
    }
    else if (limb.limb == OCO.Limb.HAIR)
    {
        var ctrl = limb.ctrls[0];
        if (ctrl.parent == null) ctrl.parent = parentLayer;
    }
    else if (limb.limb == OCO.Limb.FIN)
    {
        var ctrl = limb.ctrls[0];
        if (ctrl.parent == null) ctrl.parent = parentLayer;
    }
    else if (limb.limb == OCO.Limb.CUSTOM)
    {
        // Ctrls follow the parent by default (?)
        for (var i = 0, ni = limb.ctrls.length; i < ni; i++)
        {
            var ctrl = limb.ctrls[i];
            if (ctrl.parent == null) ctrl.parent = parentLayer;
        }
    }
}

/**
 * Auto-rigs an OCOLimb if it exists in the comp
 * @param {OCOLimb} limb The limb to rig
 * @param {Layer[]|DuList.<Layer>} [customControllers] - Existing custom controllers to use
 * @param {Duik.Constraint.IKType} [longChainMode=Duik.Constraint.IKType.FK] How to rig tails and other chains consisting of more than 3 layers.
 * @param {Duik.Constraint.IKType} [threeLayerMode=Duik.Constraint.IKType.ONE_TWO] How to rig 3-layer chains.
 */
Duik.Rig.limb = function (limb, customControllers, longChainMode, threeLayerMode)
{

    // Bake the armature data in case it's not, to fix reparenting issues with noodles & envelops
    var layers = limb.getLayers();
    Duik.Bone.bakeArmatureData( limb.getLayers() );

    // Check the type of the limb
    if (limb.limb == OCO.Limb.SPINE)
    {
        limb.ctrls = Duik.Rig.spine( layers, customControllers );
    }
    else if (limb.limb == OCO.Limb.ARM)
    {
        limb.ctrls = [ Duik.Rig.arm( layers, customControllers ) ];
    }
    else if (limb.limb == OCO.Limb.LEG)
    {
        limb.ctrls = [ Duik.Rig.leg( layers, customControllers ) ];
    }
    else if (limb.limb == OCO.Limb.TAIL)
    {
        limb.ctrls = Duik.Rig.tail( layers, longChainMode, customControllers );
    }
    else if (limb.limb == OCO.Limb.WING)
    {
        limb.ctrls = [ Duik.Rig.wing( layers, customControllers ) ];
    }
    else if (limb.limb == OCO.Limb.HAIR)
    {
        limb.ctrls = Duik.Rig.hair( layers, customControllers );
    }
    else if (limb.limb == OCO.Limb.SNAKE_SPINE)
    {
        // Not implemented yet
    }
    else if (limb.limb == OCO.Limb.FISH_SPINE)
    {
        limb.ctrls = Duik.Rig.fishSpine( layers, longChainMode, customControllers );
    }
    else if (limb.limb == OCO.Limb.FIN)
    {
        limb.ctrls = [ Duik.Rig.fin( layers, customControllers ) ];
    }
    else if (limb.limb == OCO.Limb.CUSTOM)
    {
        limb.ctrls = Duik.Rig.custom( layers, longChainMode, threeLayerMode, customControllers );
    }

    // Rig child limbs (and parent them)
    function rigChildLimbs(bone)
    {
        for (var j = 0, nj = bone.limbs.length; j < nj; j++)
        {
            var childLimb = bone.limbs[j];
            if (childLimb.armature.length == 0) continue;
            Duik.Rig.limb(childLimb, customControllers, longChainMode, threeLayerMode);
            Duik.Rig.parentLimb(childLimb, bone.layer);
        }
        for (var j = 0, nj = bone.children.length; j < nj; j++)
        {
            rigChildLimbs(bone.children[j]);
        }
    }
    for (var i = 0, ni = limb.armature.length; i < ni; i++)
    {
        var bone = limb.armature[i];
        rigChildLimbs(bone);
    }
}

/**
 * Rigs a spine.
 * @param {Layer[]|DuList.<Layer>} [layers] - The layers to rig
 * @param {Layer[]|DuList.<Layer>} [customControllers] - Existing custom controllers to use
 * @returns {Layer[]} The controllers for the spine.
 */
Duik.Rig.spine = function( layers, customControllers )
{
    layers = def(layers, DuAEComp.unselectLayers() );
    layers = new DuList(layers);

    if( layers.isEmpty() ) return [];
    if( layers.length() == 1 ) return [];

    DuScriptUI.progressBar.stg( i18n._("Spine"));
    DuScriptUI.progressBar.hit(1, 'Sorting bones...');

    customControllers = new DuList(customControllers);

    var comp = layers.first().containingComp;

    // Sort

    // a sorter for spine and neck
	function sortBones(a,b)
	{
		return a.i - b.i;
	}

    // expected
    var head = null;
    var hips =  null;
    var spine = [];
    var torso = null;
    var neck = [];
    var tip = null;

    layers.do(function( layer )
    {
        var tag = DuAETag.get( layer );
        var bone = DuAETag.getValue( layer, DuAETag.Key.DUIK_BONE_TYPE, DuAETag.Type.STRING, tag );
        var boneIndex = DuAETag.getValue( layer, DuAETag.Key.DUIK_BONE_INDEX, DuAETag.Type.INT, tag );

        if ( bone == OCO.Bone.HIPS ) hips = layer;
        else if (bone == OCO.Bone.SKULL ) head = layer;
        else if (bone == OCO.Bone.TIP ) tip = layer;
        else if (bone == OCO.Bone.TORSO) torso = layer;
        else if (bone == OCO.Bone.SPINE )
        {
            var b = layer;
            b.i = boneIndex;
            spine.push(b);
        }
        else if (bone == OCO.Bone.NECK )
        {
            var b = layer;
            b.i = boneIndex;
            neck.push(b);
        }

        Duik.Bone.setRigged( layer );
    } );

    spine.sort( sortBones );
    neck.sort( sortBones );

    //find the root
	var spineRoot = null;
	if (hips) spineRoot = hips;
	else if (spine.length > 0) spineRoot = spine[0];
    else if (torso) spineRoot = torso;
	else if (neck.length > 0) spineRoot = neck[0];
	else if (head) spineRoot = head;
	else if (tip) spineRoot = tip;

    // Nothing to do
    if (spineRoot == null) return [];

    // Let's rig!

    DuScriptUI.progressBar.hit(1, 'Creating controllers...');

    // unparent everything, just to be sure
    var spineRootParent = spineRoot.parent;
    spineRoot.parent = null;
    for ( var i = 0, n = spine.length ; i < n; i++ ) spine[i].parent = null;
    if ( torso ) torso.parent = null;
    for ( var i = 0, n = neck.length ; i < n; i++ ) neck[i].parent = null;
    if ( head ) head.parent = null;
    if ( tip ) tip.parent = null;

    // Controllers
    var bodyCtrl = null;
    var hipsCtrl = null;
    var spineCtrl = null;
    var spineCurveCtrl = null;
    var torsoCtrl = null;
    var shoulderCtrl = null;
    var headCtrl = null;

    // Create hips and body controllers
    if (hips)
    {
        bodyCtrl = Duik.Controller.getCreate( hips, Duik.Controller.Type.BODY, customControllers );
        hipsCtrl = Duik.Controller.create(comp, Duik.Controller.Type.HIPS, hips);
        Duik.Layer.setName( i18n._("Hips"), hipsCtrl );
    }
    else if (spine.length > 0) bodyCtrl = Duik.Controller.getCreate( spine[0], Duik.Controller.Type.BODY, customControllers );
    else if (torso) bodyCtrl = Duik.Controller.getCreate( torso, Duik.Controller.Type.BODY, customControllers );
    else if (neck.length > 0) bodyCtrl = Duik.Controller.getCreate( neck[0], Duik.Controller.Type.BODY, customControllers );
    if (bodyCtrl) {
        Duik.Layer.setName( i18n._("Body"), bodyCtrl );
        var peCtrl = Duik.PseudoEffect.CONTROLLER;
        var ctrlEffect = bodyCtrl.effect( peCtrl.matchName );
        if (ctrlEffect) ctrlEffect.property( peCtrl.props['Icon']['Position'].index ).setValue([25, 0]);
    }


    // Spine controller
    if (spine.length > 0)
    {
        spineCtrl = Duik.Controller.getCreate( spine[0], Duik.Controller.Type.VERTEBRAE, customControllers);
        Duik.Layer.setName( i18n._("Spine"), spineCtrl );
    }

    // Torso controller
    if (torso)
    {
        torsoCtrl = Duik.Controller.getCreate( torso, Duik.Controller.Type.TORSO, customControllers);
        Duik.Layer.setName( i18n._("Torso"), torsoCtrl );
    }

    // Shoulders controller
    if (neck.length > 0)
    {
        shoulderCtrl = Duik.Controller.getCreate( neck[0], Duik.Controller.Type.SHOULDERS, customControllers);
        Duik.Layer.setName( i18n._("Shoulders & neck"), shoulderCtrl );
    }
    else if (!head && tip)
    {
        shoulderCtrl = Duik.Controller.getCreate( tip, Duik.Controller.Type.SHOULDERS, customControllers);
    }

    // Head controller
    if (head)
    {
        headCtrl = Duik.Controller.getCreate(head, Duik.Controller.Type.HEAD, customControllers);
        Duik.Layer.setName( i18n._("Head"), headCtrl );
    }

    DuScriptUI.progressBar.hit(1, 'Parenting bones...');

    // Parenting
    // parent bones
    if (hips) hips.parent = hipsCtrl;

    if (tip)
    {
        if (head) tip.parent = head;
        else if (neck.length > 0) tip.parent = neck[neck.length-1];
        else if (torso) tip.parent = torso;
        else if (spine.length > 0) tip.parent = spine[spine.length-1];
        else if (hips) tip.parent = hips;
        else
        {
            hipsCtrl = Duik.Controller.create(comp, Duik.Controller.Type.HIPS, tip);
            tip.parent = hipsCtrl;
        }
    }


    DuScriptUI.progressBar.hit(1, 'Rigging...');

    // hips
    if (hipsCtrl && bodyCtrl) {
        hipsCtrl.parent = bodyCtrl;

    }

    //spine FK
    var goal;
    if (torso) goal = torso;
    else if (neck.length > 0) goal = neck[0];
    else if (head) goal = head;
    else if (tip) goal = tip;
    var ctrl;
    if (torsoCtrl) ctrl = torsoCtrl;
    else if (shoulderCtrl) ctrl = shoulderCtrl
    else if (headCtrl) ctrl = headCtrl;

    if (ctrl || goal)
    {
        if (hips && spine.length == 0)
        {
            var backCtrl = Duik.Constraint.oneLayerIK(hips , goal, ctrl, false);
            if (!ctrl && bodyCtrl) backCtrl.parent = bodyCtrl;
        }
        else if (spine.length == 1)
        {
            var backCtrl = Duik.Constraint.oneLayerIK(spine[0], goal, ctrl, false);
            if (hips) spine[0].parent = hips;
            else spine[0].parent = spineCtrl;
            if (!ctrl && bodyCtrl) backCtrl.parent = bodyCtrl;
        }
        else if (spine.length > 1)
        {
            var ctrls = Duik.Constraint.bezierFK(spine, goal, ctrl, false, spineCtrl);
            if (ctrls.length == 5) {
                ctrls[3].locked = false;
                ctrls[4].locked = false;
                if (hipsCtrl) ctrls[3].parent = hipsCtrl;
                Duik.Layer.setType(Duik.Layer.Type.NULL, ctrls[3]);
                ctrls[3].moveAfter(spineRoot);
                ctrls[4].moveAfter(spineRoot);
                ctrls[3].locked = true;
                ctrls[4].locked = true;
                spineCurveCtrl = ctrls[0];
            }
        }
    }

    // Spine controller
    if (spineCtrl) {
        if (bodyCtrl) spineCtrl.parent = bodyCtrl;
        if (hipsCtrl) DuAEProperty.lock(spineCtrl.transform.position);
    }

    // Torso
    if (torso) {
        var goal;
        if (neck.length > 0) goal = neck[0];
        else if (head) goal = head;
        else if (tip) goal = tip;
        var ctrl;
        if (shoulderCtrl) ctrl = shoulderCtrl;
        else if (headCtrl) ctrl = headCtrl;
        ctrl =  Duik.Constraint.oneLayerIK(torso, goal, ctrl, false);
        // Without spine, we need an orientation constraint on the torso controller (a parent null)
        if (bodyCtrl && hipsCtrl && !spineCtrl) {
            var orientNull = DuAEComp.addNull( comp, undefined, torsoCtrl );
            Duik.Layer.copyAttributes( orientNull, torsoCtrl, Duik.Layer.Type.NULL );
            var orientEffect = Duik.Constraint.orientation( orientNull )[0];
            var pe = Duik.PseudoEffect.ORIENTATION;
            orientEffect( pe.props['Constraint to'].index ).setValue( bodyCtrl.index );
            orientNull.moveBefore( torso );
            
            torsoCtrl.parent = orientNull;
            orientNull.parent = hipsCtrl;

            orientNull.enabled = false;
            orientNull.shy = true;
            orientNull.locked = true;
        }
        else {
            if (spineCtrl) torsoCtrl.parent = spineCtrl;
            else if (hipsCtrl) torsoCtrl.parent = hipsCtrl;
            else if (bodyCtrl) torsoCtrl.parent = bodyCtrl;
        }

        torso.parent = torsoCtrl;
        ctrl.parent = torsoCtrl;
    }


    // Neck IK
    var goal;
    if (head) goal = head;
    else if (tip) goal = tip;
    var ctrl;
    if (headCtrl) ctrl = headCtrl;

    if (ctrl || goal)
    {
        if (neck.length == 1)
        {
            var backCtrl = Duik.Constraint.oneLayerIK(neck[0], goal, ctrl, false);
            neck[0].parent = shoulderCtrl;
            backCtrl.parent = shoulderCtrl;
        }
        else if (neck.length > 1)
        {
            var ctrls = Duik.Constraint.bezierFK(neck, goal, ctrl, false, shoulderCtrl);
            if (ctrls.length == 5) {
                ctrls[3].locked = false;
                ctrls[4].locked = false;
                Duik.Layer.setType(Duik.Layer.Type.NULL, ctrls[3]);
                ctrls[3].moveAfter(neck[0]);
                ctrls[4].moveAfter(neck[0]);
                ctrls[3].locked = true;
                ctrls[4].locked = true;
            }
        }
    }
    if (shoulderCtrl) {
        if (torsoCtrl) shoulderCtrl.parent = torsoCtrl;
        else if (spineCtrl) shoulderCtrl.parent = spineCtrl;
        else if (hipsCtrl)  shoulderCtrl.parent = hipsCtrl;
        else if (bodyCtrl) shoulderCtrl.parent = bodyCtrl;
    }

    //head
    if (head)
    {
        Duik.Constraint.simpleFK(head, headCtrl);
        head.parent = headCtrl;
        if (shoulderCtrl) headCtrl.parent = shoulderCtrl;
        else if (torsoCtrl) headCtrl.parent = torsoCtrl;
        else if (spineCtrl) headCtrl.parent = spineCtrl;
        else if (hipsCtrl)  headCtrl.parent = hipsCtrl;
        else if (bodyCtrl) headCtrl.parent = bodyCtrl;
    }
    
    var ctrls = []
    if ( bodyCtrl ) ctrls.push(bodyCtrl);
    if ( hipsCtrl ) ctrls.push(hipsCtrl);
    if ( spineCtrl ) ctrls.push(spineCtrl);
    if ( spineCurveCtrl ) ctrls.push(spineCurveCtrl);
    if ( torsoCtrl ) ctrls.push(torsoCtrl);
    if ( shoulderCtrl ) ctrls.push(shoulderCtrl);
    if ( headCtrl ) ctrls.push(headCtrl);
    DuAELayer.stack( ctrls );
    return ctrls;
}

/**
 * Rigs a tail.
 * @param {Layer[]|DuList.<Layer>} [layers] - The layers to rig
 * @param {Duik.Constraint.IKType} [tailMode=Duik.Constraint.IKType.FK] How to rig tails and other chains consisting of more than 3 layers.
 * @param {Layer[]|DuList.<Layer>} [customControllers] - Existing custom controllers to use
 * @returns {Layer[]} The controller(s) of the tail
 */
Duik.Rig.tail = function ( layers, tailMode, customControllers, isHair )
{
    layers = def(layers, DuAEComp.unselectLayers() );
    layers = new DuList(layers);
    if( layers.isEmpty() ) return [];

    isHair = def(isHair, false); // low-level undocumented method: changes the coontrol shape to a hair strand
    tailMode = def(tailMode, Duik.Constraint.IKType.FK);

    DuScriptUI.progressBar.stg( i18n._("Tail"));
    DuScriptUI.progressBar.hit(1, i18n._("Sorting bones..."));

    customControllers = new DuList(customControllers);

    var comp = layers.first().containingComp;

    // expected
    var tail = [];
    var tip = null;

    layers.do(function( layer )
    {
        var tag = DuAETag.get( layer );
        var bone = DuAETag.getValue( layer, DuAETag.Key.DUIK_BONE_TYPE, DuAETag.Type.STRING, tag );
        var boneIndex = DuAETag.getValue( layer, DuAETag.Key.DUIK_BONE_INDEX, DuAETag.Type.INT, tag );

        if ( bone == OCO.Bone.TIP ) tip = layer;
        else
        {
            var b = layer;
            b.i = boneIndex;
            tail.push(b);
        }

        Duik.Bone.setRigged( layer );
    } );

    // Sort
    // a sorter for spine and neck
	function sortBones(a,b)
	{
		return a.i - b.i;
	}

    tail.sort(sortBones);

    DuScriptUI.progressBar.hit(1, 'Creating controllers...');

    //unparent
    for (var i=1, num = tail.length ; i < num ; i++ ) tail[i].parent = null;

    if (!tip && tail.length > 1) tip = tail.pop();
    else if (tail.length == 1)
    {
        var tailCtrl = Duik.Controller.getCreate( tail[0], Duik.Controller.Type.TAIL, customControllers );
        tail[0].parent = tailCtrl;
        return [tailCtrl];
    }

    DuScriptUI.progressBar.hit(1, 'Rigging...');

    var ctrlType = Duik.Controller.Type.TAIL;
    if (isHair) ctrlType = Duik.Controller.Type.PONEYTAIL;

    //ik
    if (tailMode == Duik.Constraint.IKType.BEZIER_IK)
    {
        //controllers
        var tailCtrl = Duik.Controller.getCreate( tip, ctrlType, customControllers);

        if (tail.length > 1)
        {
            var ctrls = Duik.Constraint.bezierIK( tail, tip, tailCtrl, false);
            return ctrls;
        }
        else
        {
            Duik.Constraint.oneLayerIK( tail[0], tip, tailCtrl, false);
            return [tailCtrl];
        }
    }

    //bezier fk
    if (tailMode == Duik.Constraint.IKType.BEZIER_FK)
    {
        if (tail.length > 1)
        {
            var ctrl = Duik.Controller.getCreate( tip, ctrlType, customControllers);
            var ctrl1 = Duik.Controller.getCreate( tail[0], ctrlType, customControllers);
            var ctrls = Duik.Constraint.bezierFK( tail, tip, tailCtrl, false, ctrl1);
            return ctrls;
        }
        else
        {
            var ctrl = Duik.Controller.getCreate( tail[0], ctrlType, customControllers);
            Duik.Constraint.simpleFK( tail, ctrl);
            return [ctrl];
        }
    }

    //fk

    //controllers
    var tailCtrl = Duik.Controller.getCreate( tail[0], ctrlType, customControllers);
    tail.push(tip);

    var tailRoot = tail[0];
    Duik.Constraint.fk( tail.reverse(), tailCtrl);

    return [tailCtrl];
}

/**
 * Rigs a leg.
 * @param {Layer[]|DuList.<Layer>} [layers] - The layers to rig
 * @param {Layer[]|DuList.<Layer>} [customControllers] - Existing custom controllers to use
 * @returns {Layer} The controller leg
 */
Duik.Rig.leg = function ( layers, customControllers )
{
    layers = def(layers, DuAEComp.unselectLayers() );
    layers = new DuList(layers);
    if( layers.isEmpty() ) return [];

    DuScriptUI.progressBar.stg( i18n._("Leg"));
    DuScriptUI.progressBar.hit(1, 'Sorting bones...');

    customControllers = new DuList(customControllers);

    var comp = layers.first().containingComp;

    // expected
    var femur = null;
    var tibia = null;
    var foot = null;
    var toes = null;
    var tip = null;
    var heel = null;

    var side = OCO.Side.NONE;
    var type = OCO.LimbType.CUSTOM;

    // get'em all
    layers.do(function(layer) {
        var tag = DuAETag.get( layer );
        var bone = DuAETag.getValue( layer, DuAETag.Key.DUIK_BONE_TYPE, DuAETag.Type.STRING, tag );

        if (bone == OCO.Bone.FEMUR) femur = layer;
        else if (bone == OCO.Bone.TIBIA) tibia = layer;
        else if (bone == OCO.Bone.TARSUS) foot = layer;
        else if (bone == OCO.Bone.TOE) toes = layer;
        else if (bone == OCO.Bone.TIP) tip = layer;
        else if (bone == OCO.Bone.HEEL) heel = layer;

        if ( side == OCO.Side.NONE ) side = Duik.Layer.side(layer);
        if ( type == OCO.LimbType.CUSTOM ) type = DuAETag.getValue( layer, DuAETag.Key.DUIK_LIMB_TYPE, DuAETag.Type.STRING, tag );

        Duik.Bone.setRigged( layer );
    });

    //unparent
    if (tibia && femur) tibia.parent = null;
    if (foot && (tibia || femur)) foot.parent = null;
    if (toes  && (foot || tibia || femur)) toes.parent = null;
    if (tip) tip.parent = null;
    if (heel) heel.parent = null;

    //reset transformations
    if (femur) Duik.Bone.resetTransform(femur);
    if (tibia) Duik.Bone.resetTransform(tibia);
    if (foot) Duik.Bone.resetTransform(foot);
    if (toes) Duik.Bone.resetTransform(toes);
    if (tip) Duik.Bone.resetTransform(tip);
    if (heel) Duik.Bone.resetTransform(heel);

    //adjust/fix what we got! We're very friendly...
    /* @ts-ignore */
    if (type == OCO.LimbType.UNGULATE)
    {
        // We need toes (hoof)
        if (!toes)
        {
            if (tip)
            {
                toes = tip;
                tip = null;
            }
            else if (foot)
            {
                toes = foot;
                foot = null;
            }
            else if (tibia)
            {
                toes = tibia;
                tibia = null;
            }
            else if (femur)
            {
                toes = femur;
                femur = null;
            }
        }
        // No foot without both femur and tibia
        if ( (!femur || !tibia) && foot)
        {
            if (femur)
            {
                tibia = foot;
                foot = null;
            }
            else if (tibia)
            {
                femur = tibia;
                tibia = foot;
                foot = null;
            }
            else
            {
                femur = foot;
                foot = null;
            }
        }
        // No tibia without femur
        if ( tibia && !femur )
        {
            femur = tibia;
            tibia = null;
        }
    }

    DuScriptUI.progressBar.hit(1, 'Creating controllers...');

    //add nulls and controllers for the footRoll
    var toesNull, footNull;
    //the foot roll needs all parts
    /* @ts-ignore */
    if ((toes || tip) && foot && tibia && femur && type != OCO.LimbType.UNGULATE)
    {
        if (!toes)
        {
            toes = tip;
            tip = null;
        }

        //claws
        toesNull = DuAEComp.addNull(comp, 20, toes);
        Duik.Layer.copyAttributes( toesNull, toes, Duik.Layer.Type.IK );

        var footSize = toes.transform.position.value[0] - foot.transform.position.value[0];
        //tiptoe
        if (!tip)
        {
            tip = DuAEComp.addNull(comp, 20, toes);
            Duik.Layer.copyAttributes( tip, toes, Duik.Layer.Type.NULL );
            Duik.Layer.setName( Duik.Layer.name(toes) + '_Tip', tip );
            //tip.transform.position.setValue([toesNull.transform.position.value[0] + footSize/2,toesNull.transform.position.value[1]]);

            tip.enabled = false;
            tip.shy = true;
        }

        if (!heel && (type == OCO.LimbType.PLANTIGRADE || type == OCO.LimbType.HOMINOID) )
        {
            heel = DuAEComp.addNull(comp, 20, toes);
            Duik.Layer.copyAttributes( heel, foot, Duik.Layer.Type.NULL );
            Duik.Layer.setName( i18n._("Heel"), heel );
            var footLength = DuAELayer.getDistance( foot, toesNull );
            var tipLocation = DuAELayer.relativeLocation( toesNull, foot );
            if (DuMath.isLocationRight(tipLocation))
                heel.transform.position.setValue([foot.transform.position.value[0] - footLength * .25,toesNull.transform.position.value[1]]);
            else
                heel.transform.position.setValue([foot.transform.position.value[0] + footLength * .25,toesNull.transform.position.value[1]]);

            heel.enabled = false;
            heel.shy = true;
        }

        //foot
        footNull = DuAEComp.addNull(comp, 20, foot);
        Duik.Layer.copyAttributes( footNull, foot, Duik.Layer.Type.IK );
    }

    //Controller for the leg
    var ctrlType = Duik.Controller.Type.FOOT;
    /* @ts-ignore */
    if (type == OCO.LimbType.DIGITIGRADE) ctrlType = Duik.Controller.Type.CLAWS;
    /* @ts-ignore */
    if (type == OCO.LimbType.UNGULATE) ctrlType = Duik.Controller.Type.HOOF;
	
    var ctrl = null;
    /* @ts-ignore */
    if (type == OCO.LimbType.UNGULATE) ctrl = Duik.Controller.getCreate(toes, ctrlType, customControllers);
    /* @ts-ignore */
    else if (type == OCO.LimbType.DIGITIGRADE)
    {
        if (foot && ((femur || tibia) || (!toes && !tip))) ctrl = Duik.Controller.getCreate(toes, ctrlType, customControllers);
        else if (toes && ((femur || tibia) || !tip)) ctrl = Duik.Controller.getCreate(toes, ctrlType, customControllers);
        else if (tip) ctrl = Duik.Controller.getCreate(tip, ctrlType, customControllers);
        else if (heel) ctrl = Duik.Controller.getCreate(heel, ctrlType, customControllers);
        else if (tibia) ctrl = Duik.Controller.getCreate(tibia, ctrlType, customControllers);
        else if (femur) ctrl = Duik.Controller.getCreate(femur, ctrlType, customControllers);
    }
    else
    {
        if (foot && ((femur || tibia) || (!toes && !tip))) ctrl = Duik.Controller.getCreate(foot, ctrlType, customControllers);
        else if (toes && ((femur || tibia) || !tip)) ctrl = Duik.Controller.getCreate(toes, ctrlType, customControllers);
        else if (tip) ctrl = Duik.Controller.getCreate(tip, ctrlType, customControllers);
        else if (heel) ctrl = Duik.Controller.getCreate(heel, ctrlType, customControllers);
        else if (tibia) ctrl = Duik.Controller.getCreate(tibia, ctrlType, customControllers);
        else if (femur) ctrl = Duik.Controller.getCreate(femur, ctrlType, customControllers);
    }

    // Rename controller
    Duik.Layer.setName( i18n._("Leg"), ctrl);

    DuScriptUI.progressBar.hit(1, 'Parenting...');
    
    // parenting
    var spineRoot = null;
    if (toes && !footNull)
    {
        if (foot) toes.parent = foot;
        else if (tibia) toes.parent = tibia;
        else if (femur) toes.parent = femur;
        else if (tip || heel ) toes.parent = spineRoot;
        else
        {
            toes.parent = ctrl;
            ctrl.parent = spineRoot;
        }
    }
    if (foot)
    {
        if (tibia) foot.parent = tibia;
        else if (femur) foot.parent = femur;
        else if (toes || tip || heel ) foot.parent = spineRoot;
        else
        {
            foot.parent = ctrl;
            ctrl.parent = spineRoot;
        }
    }
    if (tibia)
    {
        if (femur) tibia.parent = femur;
        else if (foot || toes || heel) tibia.parent = spineRoot;
        else
        {
            tibia.parent = ctrl;
            ctrl.parent = spineRoot;
        }
    }
    if (femur)
    {
        if (tibia || foot || toes || heel) femur.parent = spineRoot;
        else
        {
            femur.parent = ctrl;
            if (spineRoot) ctrl.parent = spineRoot;
        }
    }
    if (tip)
    {
        if (heel) tip.parent = heel;
        else if (toes) tip.parent = toes;
        else if (foot) tip.parent = foot;
        else if (tibia) tip.parent = tibia;
        else if (femur) tip.parent = femur;
    }
    if (footNull)
    {
        tip.parent = null;
        toes.parent = null;
        toesNull.parent = null;
        footNull.parent = null;
        if(heel) heel.parent = null;
        foot.parent = null;
        toes.parent = tip;
        toesNull.parent = tip;
        footNull.parent = toesNull;
        foot.parent = toesNull;
        if (type == OCO.LimbType.PLANTIGRADE || type == OCO.LimbType.HOMINOID) {
            tip.parent = heel;
            heel.parent = ctrl;
        }
        else if (type == OCO.LimbType.DIGITIGRADE) tip.parent = ctrl;//*/
    }

    // Rig!
    DuScriptUI.progressBar.hit(1, 'Rigging...');

    /* @ts-ignore */
    if (type == OCO.LimbType.UNGULATE)
    {
        if (femur && tibia && foot)
        {
            Duik.Constraint.twoOneLayerIK(femur, tibia, foot, toes, ctrl, false);
            // Rename effects
            var footIK = DuAELayer.lastEffect( ctrl, Duik.PseudoEffect.ONE_LAYER_IK.matchName );
            DuAEProperty.rename( footIK, i18n._("IK") +
                ' | ' + i18n._("Foot"));
            var legIK = DuAELayer.lastEffect( ctrl, Duik.PseudoEffect.TWO_LAYER_IK.matchName );
            DuAEProperty.rename( legIK, i18n._("IK") +
                ' | ' + i18n._("Leg"));
            var hoofAngle = DuAELayer.lastEffect( ctrl, 'ADBE Angle Control' );
            DuAEProperty.rename( hoofAngle, i18n._("Hoof"));
        }
        else if (femur && tibia) Duik.Constraint.twoLayerIK(femur, tibia, toes, ctrl, false);
        else if (femur) Duik.Constraint.oneLayerIK(femur, toes, ctrl, false);
    }
    else if (footNull)
    {
        //leg
        Duik.Constraint.twoLayerIK(femur,tibia,undefined,footNull, false);

        //add an IK effect on the controller
        var pe2 = Duik.PseudoEffect.TWO_LAYER_IK;
        var ikCtrl = pe2.apply(ctrl);
        //the effect on the null of the foot
        var ikEffect = footNull.effect(pe2.matchName);
        ikCtrl.name = ikEffect.name;
        //Set the "side" property and keep its expression
        ikCtrl( pe2.props["Side"].index ).setValue(ikEffect( pe2.props["Side"].index ).value);
        var sideExpression = ikEffect( pe2.props["Side"].index ).expression;
        var ikEffectProp = new DuAEProperty( ikEffect );
        ikEffectProp.linkProperties(ikCtrl,true);
        ikCtrl( pe2.props["Side"].index ).expression = sideExpression;
        //and re-setup the layers & needed data
        ikCtrl( pe2.props["Data"]["Layers"]["Upper"].index ).setValue(ikEffect( pe2.props["Data"]["Layers"]["Upper"].index ).value);
        ikCtrl( pe2.props["Data"]["Layers"]["Lower"].index ).setValue(ikEffect( pe2.props["Data"]["Layers"]["Lower"].index ).value);
        ikCtrl( pe2.props["Data"]["Layers"]["Goal"].index ).setValue(ikEffect( pe2.props["Data"]["Layers"]["Goal"].index ).value);
        var lowerPos = new DuAEProperty( ikCtrl( pe2.props["Data"]["Base values"]["Lower relative position"].index ) );
        lowerPos.pickWhip( ikEffect( pe2.props["Data"]["Base values"]["Lower relative position"].index ));
        var goalPos = new DuAEProperty( ikCtrl( pe2.props["Data"]["Base values"]["Goal relative position"].index ) );
        goalPos.pickWhip( ikEffect( pe2.props["Data"]["Base values"]["Goal relative position"].index ));

        //tiptoe, heel and footroll
        if (type == OCO.LimbType.PLANTIGRADE || type == OCO.LimbType.HOMINOID)
        {
            //detect right or left, depending on the toes position
            var right = false;
            if (toes && foot)
            {
                var toesPos = DuAELayer.getWorldPos(toes);
                var footPos = DuAELayer.getWorldPos(foot);
                right = (toesPos[0] - footPos[0]) > 0;
            }

            var pe = Duik.PseudoEffect.FOOT_ROLL;
            var footCtrl = pe.apply(ctrl);

            // Toes rotation
            toes.transform.rotation.expression = DuAEExpression.Id.FOOT_ROLL + "\nthisComp.layer(\"" + ctrl.name + "\").effect(\"" + footCtrl.name + "\")(" + pe.props["Toes"].index + ").value;";
            // Tiptoe rotation            
            tip.transform.rotation.expression = DuAEExpression.Id.FOOT_ROLL + "\nthisComp.layer(\"" + ctrl.name + "\").effect(\"" + footCtrl.name + "\")(" + pe.props["Tiptoe"].index + ");";
            // Heel rotation
            var op  = right ? "<" : ">";
            heel.transform.rotation.expression = DuAEExpression.Id.FOOT_ROLL + "\n" +
                "var ctrl = thisComp.layer(\"" + ctrl.name + "\").effect(\"" + footCtrl.name + "\")(" + pe.props["Heel"].index + ");\n" +
                "var roll = thisComp.layer(\"" + ctrl.name + "\").effect(\"" + footCtrl.name + "\")(" + pe.props["Foot roll"].index + ");\n" +
                "roll " + op + " 0 ? roll+ctrl : ctrl;";
            // Foot roll
            op = right ? ">" : "<";
            toesNull.transform.rotation.expression = DuAEExpression.Id.FOOT_ROLL + "\n" +
                "var ctrl = thisComp.layer(\"" + ctrl.name + "\").effect(\"" + footCtrl.name + "\")(" + pe.props["Foot roll"].index + ");\n" +
                "ctrl " + op + " 0 ? ctrl : 0;";
        }
        else if (type == OCO.LimbType.DIGITIGRADE)
        {
            var pe = Duik.PseudoEffect.DIGI_FOOT_ROLL;
            var footCtrl = pe.apply(ctrl);
            tip.transform.rotation.expression = DuAEExpression.Id.FOOT_ROLL + "\nthisComp.layer(\"" + ctrl.name + "\").effect(\"" + footCtrl.name + "\")(1);";
            toesNull.transform.rotation.expression = DuAEExpression.Id.FOOT_ROLL + "\n" +
                "var ctrl = thisComp.layer(\"" + ctrl.name + "\").effect(\"" + footCtrl.name + "\")(3);\n" +
                "var tiptoe = thisComp.layer(\"" + ctrl.name + "\").effect(\"" + footCtrl.name + "\")(1);\n" +
                "ctrl-tiptoe;";
            // Toes rotation
            toes.transform.rotation.expression = DuAEExpression.Id.FOOT_ROLL + "\nthisComp.layer(\"" + ctrl.name + "\").effect(\"" + footCtrl.name + "\")(" + pe.props["Claws"].index + ").value;";
        }

        // hide and lock
        toesNull.enabled = false;
        toesNull.shy = true;
        toesNull.locked = true;
        footNull.enabled = false;
        footNull.shy = true;
        footNull.locked = true;
    }
    else
    {
        if (foot)
        {
            if (femur && tibia) Duik.Constraint.twoLayerIK(femur,tibia,foot,ctrl, false);
            else if (femur) Duik.Constraint.oneLayerIK(femur,foot,ctrl, false);
            else if (tibia) Duik.Constraint.oneLayerIK(tibia,foot,ctrl, false);
            else if (toes) Duik.Constraint.oneLayerIK(foot,toes,ctrl, false);
            else if (tip) Duik.Constraint.oneLayerIK(foot,tip,ctrl, false);
        }
        else if (toes)
        {
            if (femur && tibia) Duik.Constraint.twoLayerIK(femur,tibia,letoes,ctrl, false);
            else if (femur) Duik.Constraint.oneLayerIK(femur,toes,ctrl, false);
            else if (tibia) Duik.Constraint.oneLayerIK(tibia,toes,ctrl, false);
            else if (tip) Duik.Constraint.oneLayerIK(toes,tip,ctrl, false);
        }
        else if (tip)
        {
            if (femur && tibia) Duik.Constraint.twoLayerIK(femur,tibia,tip,ctrl, false);
            else if (femur) Duik.Constraint.oneLayerIK(femur,tip,ctrl, false);
            else if (tibia) Duik.Constraint.oneLayerIK(tibia,tip,ctrl, false);
        }
        else if (heel)
        {
            if (femur && tibia) Duik.Constraint.twoLayerIK(femur,tibia,heel,ctrl, false);
            else if (femur) Duik.Constraint.oneLayerIK(femur,heel,ctrl, false);
            else if (tibia) Duik.Constraint.oneLayerIK(tibia,heel,ctrl, false);
        }
        else if (femur && tibia) Duik.Constraint.oneLayerIK(femur,tibia,ctrl, false);
    }

    return ctrl;
}

/**
 * Rigs a shoulder (an FK and an auto-position effect)
 * @param {Layer} shoulder The shoulder bone
 * @param {Layer} ctrl The controller
 */
Duik.Rig.shoulder = function( shoulder, ctrl )
{
    var rotVal = shoulder.transform.rotation.value;

    Duik.Constraint.oneLayerIK(shoulder, undefined, ctrl, false);
    // Rename effect
    var pe = Duik.PseudoEffect.ONE_LAYER_IK;
    var shoulderIK = DuAELayer.lastEffect( ctrl, pe.matchName );
    DuAEProperty.rename( shoulderIK, i18n._("IK") +
        ' | ' + i18n._("Shoulder"));
    // Adjust values
    shoulderIK( pe.props["Weight"].index ).setValue(20);
    shoulderIK( pe.props["Advanced"]["Parent rotation"].index ).setValue(1);
    shoulderIK( pe.props["FK"].index ).setValue( -shoulder.transform.rotation.value + rotVal*2);

    // Rig position
    var pe = Duik.PseudoEffect.SHOULDER;
    var shoulderCtrl = pe.apply(ctrl);
    // 10 % auto by default
    shoulderCtrl( pe.props["Auto"].index ).setValue(10);

    // Deactivate the arm parent rotation inheritance
    var pe2 = Duik.PseudoEffect.TWO_LAYER_IK;
    var ikEffect = DuAELayer.lastEffect( ctrl, pe2.matchName );
    if(ikEffect) ikEffect( pe2.props["FK"]["Parent rotation"].index).setValue(0);

    // Set position expression
    shoulder.transform.position.expression = DuAEExpression.Id.AUTORIG_SHOULDER + '\n' +
        'var c = thisComp.layer("' + ctrl.name + '");\n' +
        'var fx =  c.effect("' + shoulderCtrl.name + '");\n' +
        'var a = fx(14).value;\n' +
        'if (thisLayer.hasParent) a = thisLayer.parent.fromWorld(a) - thisLayer.parent.fromWorld([0,0]);\n' +
        'var result = value + a;\n' +
        'var cp = c.toWorld(c.anchorPoint);\n' +
        'if (thisLayer.hasParent) cp = thisLayer.parent.fromWorld(cp);\n' +
        'cp0 = c.toWorld(c.anchorPoint,0);\n' +
        'if (thisLayer.hasParent) cp0 = thisLayer.parent.fromWorld(cp0);\n' +
        'cp -= cp0;\n' +
        'result += cp*(fx(9).value/100);\n' +
        'result;';

    Duik.Bone.setRigged( shoulder );
}

/**
 * Returns the bone from the spine bones the closest to the location, where child bones at that location can be attached 
 * @param {float[]} location The location where to attach bones, in comp coordinates
 * @param {Layer[]} spineBones The bones of the spine, sorted from root (hips) to tip
 * @returns {Layer|null} The corresponding spine bone or null if the list of spine bones is empty
 */
Duik.Rig.getSpineAttach = function ( location, spineBones)
{
    spineAttach = null;

    if (spineBones.length == 0) return spineAttach;
    if (spineBones.length == 1) return spineBones[0];

    // The bone needs to be the one just before, no matter the orientation: check the distance between hips & shoulder
    // on the furthest axis
    var rootPos = DuAELayer.getWorldPos( spineBones[0] );
    var endPos = DuAELayer.getWorldPos( spineBones[spineBones.length-1] );
    var x = endPos[0] - rootPos[0];
    var y = endPos[1] - rootPos[1];
    var axis = 1;
    var sign = DuMath.sign( y );
    if ( Math.abs( x ) > Math.abs( y ) )
    {
        axis = 0;
        sign = DuMath.sign( x );
    }

    for (var i = 0, n = spineBones.length; i < n; i++)
    {
        var b = spineBones[i];
        var bPos = DuAELayer.getWorldPos( b );
        var l = location[axis] - bPos[axis];
        if (l == 0) return b;
        var s = DuMath.sign(l);
        // too far, we're ready
        if ( s != sign && i == 0 ) return b;
        if ( s != sign ) return spineAttach;
        spineAttach = b;
    }

    return spineAttach;

}

/**
 * Rigs an arm/front leg.
 * @param {Layer[]|DuList.<Layer>} [layers] - The layers to rig
 * @param {Layer[]|DuList.<Layer>} [customControllers] - Existing custom controllers to use
 * @returns {Layer} The controller of the arm
 */
Duik.Rig.arm = function ( layers, customControllers )
{
    layers = def(layers, DuAEComp.unselectLayers() );
    layers = new DuList(layers);
    if( layers.isEmpty() ) return [];

    DuScriptUI.progressBar.stg( i18n._("Arm"));
    DuScriptUI.progressBar.hit(1, 'Sorting bones...');

    customControllers = new DuList(customControllers);

    var comp = layers.first().containingComp;

    // expected
    var shoulder = null;
    var humerus = null;
    var radius = null;
    var hand = null;
    var claws = null;
    var tip = null;
    var palm = null;

    var side = OCO.Side.NONE;
    var type = OCO.LimbType.CUSTOM;

    // get'em all
    layers.do(function(layer) {
        var tag = DuAETag.get( layer );
        var bone = DuAETag.getValue( layer, DuAETag.Key.DUIK_BONE_TYPE, DuAETag.Type.STRING, tag );

        if (bone == OCO.Bone.CLAVICLE) shoulder = layer;
        else if (bone == OCO.Bone.HUMERUS) humerus = layer;
        else if (bone == OCO.Bone.RADIUS) radius = layer;
        else if (bone == OCO.Bone.CARPUS) hand = layer;
        else if (bone == OCO.Bone.FINGER) claws = layer;
        else if (bone == OCO.Bone.TIP) tip = layer;
        else if (bone == OCO.Bone.HEEL) palm = layer;

        if ( side == OCO.Side.NONE ) side = Duik.Layer.side(layer);
        if ( type == OCO.LimbType.CUSTOM ) type = DuAETag.getValue( layer, DuAETag.Key.DUIK_LIMB_TYPE, DuAETag.Type.STRING, tag );

        Duik.Bone.setRigged( layer );
    });

    //unparent
    if (humerus && shoulder) humerus.parent = null;
    if (radius && (humerus || shoulder)) radius.parent = null;
    if (hand && (radius || humerus)) hand.parent = null;
    if (claws  && (hand || radius || humerus)) claws.parent = null;
    if (tip) tip.parent = null;
    if (palm) palm.parent = null;

    //reset transformations
    if (humerus) Duik.Bone.resetTransform(humerus);
    if (shoulder) Duik.Bone.resetTransform(shoulder);
    if (radius) Duik.Bone.resetTransform(radius);
    if (hand) Duik.Bone.resetTransform(hand);
    if (claws) Duik.Bone.resetTransform(claws);
    if (tip) Duik.Bone.resetTransform(tip);
    if (palm) Duik.Bone.resetTransform(palm);

    //adjust/fix what we got! We're very friendly...
    // No shoulder without both humerus and radius
    if ( shoulder && (!humerus || !radius) )
    {
        if (humerus)
        {
            radius = humerus;
            humerus = shoulder;
            shoulder = null;
        }
        else if (radius)
        {
            humerus = shoulder;
            shoulder = null;
        }
        else
        {
            humerus = shoulder;
            shoulder = null;
        }
    }
    // Ungulate adjustments
    if (type == OCO.LimbType.UNGULATE || type == OCO.LimbType.ARTHROPOD)
    {
        // We need claws (hoof)
        if (!claws)
        {
            if (tip)
            {
                claws = tip;
                tip = null;
            }
            else if (hand)
            {
                claws = hand;
                hand = null;
            }
            else if (radius)
            {
                claws = radius;
                radius = null;
            }
            else if (humerus)
            {
                claws = humerus;
                humerus = null;
            }
            else if (shoulder)
            {
                claws = shoulder;
                shoulder = null;
            }
        }
        // No hand without both humerus and radius
        if ( hand && (!humerus || !radius) )
        {
            if ( humerus )
            {
                radius = hand;
                hand = null;
            }
            else if ( radius )
            {
                humerus = radius;
                radius = hand;
                hand = null;
            }
            else
            {
                humerus = hand;
                hand = null;
            }
        }
        // No radius without humerus
        if ( radius && !humerus )
        {
            humerus = radius;
            radius = null;
        }
    }

    DuScriptUI.progressBar.hit(1, 'Creating controllers...');

    //add nulls and controllers for the footRoll
    var clawsNull, handNull;
    //the foot roll needs all parts
    if ( (claws || tip) && hand && ((radius && humerus) || (radius && shoulder) || (humerus && shoulder)) && type != OCO.LimbType.UNGULATE && type != OCO.LimbType.ARTHROPOD && type != OCO.LimbType.HOMINOID)
    {
        if (!claws)
        {
            claws = tip;
            tip = null;
        }
        //claws
        clawsNull = DuAEComp.addNull(comp, 20, claws);
        Duik.Layer.copyAttributes( clawsNull, claws, Duik.Layer.Type.IK );

        var handSize = claws.transform.position.value[0] - hand.transform.position.value[0];
        //tiptoe
        if (!tip)
        {
            tip = DuAEComp.addNull(comp, 20, claws);
            Duik.Layer.copyAttributes( tip, claws, Duik.Layer.Type.NULL );
            Duik.Layer.setName( Duik.Layer.name(claws) + '_Tip', tip );
            tip.transform.position.setValue([clawsNull.transform.position.value[0] + handSize/2,clawsNull.transform.position.value[1]]);
        }

        if (!palm && type == OCO.LimbType.PLANTIGRADE)
        {
            palm = DuAEComp.addNull(comp, 20, claws);
            Duik.Layer.copyAttributes( palm, hand, Duik.Layer.Type.NULL );
            Duik.Layer.setName( i18n._("Heel"), palm );
            palm.transform.position.setValue([hand.transform.position.value[0],clawsNull.transform.position.value[1]]);
        }

        //hand
        handNull = DuAEComp.addNull(comp, 20, hand);
        Duik.Layer.copyAttributes( handNull, hand, Duik.Layer.Type.IK );
    }

    //Controller for the arm
    var ctrlType = Duik.Controller.Type.HAND;
    if (handNull && type == OCO.LimbType.PLANTIGRADE) ctrlType = Duik.Controller.Type.FOOT;
    else if (type == OCO.LimbType.DIGITIGRADE) ctrlType = Duik.Controller.Type.CLAWS;
    else if (type == OCO.LimbType.UNGULATE) ctrlType = Duik.Controller.Type.HOOF;
    else if (type == OCO.LimbType.ARTHROPOD) ctrlType = Duik.Controller.Type.PINCER;

    var ctrl = null;
    if (type == OCO.LimbType.UNGULATE || type == OCO.LimbType.ARTHROPOD) ctrl = Duik.Controller.getCreate(claws, ctrlType, customControllers);
    else if (type == OCO.LimbType.DIGITIGRADE)
    {
        if (hand && ((humerus || radius || shoulder) || (!claws && !tip))) {
            ctrl = Duik.Controller.getCreate(claws, ctrlType, customControllers);
        }
        else if (claws && ((humerus || radius || shoulder) || !tip)) {
            ctrl = Duik.Controller.getCreate(claws, ctrlType, customControllers);
        }
        else if (tip) {
            ctrl = Duik.Controller.getCreate(tip, ctrlType, customControllers);
        }
        else if (palm) {
            ctrl = Duik.Controller.getCreate(palm, ctrlType, customControllers);
        }
        else if (radius) {
            ctrl = Duik.Controller.getCreate(radius, ctrlType, customControllers);
        }
        else if (humerus) {
            ctrl = Duik.Controller.getCreate(humerus, ctrlType, customControllers);
        }
        else if (shoulder) {
            ctrl = Duik.Controller.getCreate(shoulder, ctrlType, customControllers);
        }
    }
    else {
        if (hand && ((humerus || radius || shoulder) || (!claws && !tip))) {
            ctrl = Duik.Controller.getCreate(hand, ctrlType, customControllers);
        }
        else if (claws && ((humerus || radius || shoulder) || !tip)) {
            ctrl = Duik.Controller.getCreate(claws, ctrlType, customControllers);
        }
        else if (tip) {
            ctrl = Duik.Controller.getCreate(tip, ctrlType, customControllers);
        }
        else if (palm) {
            ctrl = Duik.Controller.getCreate(palm, ctrlType, customControllers);
        }
        else if (radius) {
            ctrl = Duik.Controller.getCreate(radius, ctrlType, customControllers);
        }
        else if (humerus) {
            ctrl = Duik.Controller.getCreate(humerus, ctrlType, customControllers);
        }
        else if (shoulder) {
            ctrl = Duik.Controller.getCreate(shoulder, ctrlType, customControllers);
        }
    }

    // Rename controller
    if(type == OCO.LimbType.HOMINOID) Duik.Layer.setName( i18n._("Arm"), ctrl);
    else Duik.Layer.setName( i18n._("Front leg"), ctrl);

    DuScriptUI.progressBar.hit(1, 'Parenting...');
    
    // Find the torso for parenting (the closest bone before the shoulder)
    var shoulderPos;
    if (shoulder) shoulderPos = DuAELayer.getWorldPos(shoulder);
    else if (humerus) shoulderPos = DuAELayer.getWorldPos(humerus);
    else if (radius) shoulderPos = DuAELayer.getWorldPos(radius);
    else if (hand) shoulderPos = DuAELayer.getWorldPos(hand);
    else if (claws) shoulderPos = DuAELayer.getWorldPos(claws);
    else if (tip) shoulderPos = DuAELayer.getWorldPos(tip);
    else if (palm) shoulderPos = DuAELayer.getWorldPos(palm);

    var spineTorso = null;

    //parenting
    if (claws)
    {
        if (hand) claws.parent = hand;
        else if (radius) claws.parent = radius;
        else if (humerus) claws.parent = humerus;
        else if (shoulder) claws.parent = shoulder;
        else if (tip || palm) claws.parent = spineTorso;
        else
        {
            claws.parent = ctrl;
            ctrl.parent = spineTorso;
        }
    }
    if (hand)
    {
        if (radius) hand.parent = radius;
        else if (humerus) hand.parent = humerus;
        else if (shoulder) hand.parent = shoulder;
        else if (claws || tip || palm) hand.parent = spineTorso;
        else
        {
            hand.parent = ctrl;
            ctrl.parent = spineTorso;
        }
    }
    if (radius)
    {
        if (humerus) radius.parent = humerus;
        else if (shoulder) radius.parent = shoulder;
        else if (hand || claws || tip || palm) radius.parent = spineTorso;
        else
        {
            radius.parent = ctrl;
            ctrl.parent = spineTorso;
        }
    }
    if (humerus)
    {
        if (shoulder) humerus.parent = shoulder;
        else if (radius || hand || claws || palm || tip) humerus.parent = spineTorso;
        else
        {
            humerus.parent = ctrl;
            if (spineTorso) ctrl.parent = spineTorso;
        }
    }
    if (shoulder)
    {
        if (humerus || radius || hand || claws || palm  || tip) shoulder.parent = spineTorso;
        else
        {
            shoulder.parent = ctrl;
            if (spineTorso) ctrl.parent = spineTorso;
        }
    }
    if (tip)
    {
        if (palm) tip.parent = palm;
        else if (claws) tip.parent = claws;
        else if (hand) tip.parent = hand;
        else if (radius) tip.parent = radius;
        else if (humerus) tip.parent = humerus;
        else if (shoulder) tip.parent = shoulder;
    }
    if (handNull)
    {
        handNull.parent = clawsNull;
        clawsNull.parent = tip;
        if (type == OCO.LimbType.PLANTIGRADE) palm.parent = ctrl;
        else if(type == OCO.LimbType.DIGITIGRADE) tip.parent = ctrl;
    }

    // Rig!
    DuScriptUI.progressBar.hit(1, 'Rigging...');

    if (type == OCO.LimbType.UNGULATE || type == OCO.LimbType.ARTHROPOD)
    {
        if (humerus && radius && hand)
        {
            Duik.Constraint.twoOneLayerIK(humerus, radius, hand, claws, ctrl, false);
            // Rename effects
            var footIK = DuAELayer.lastEffect( ctrl, Duik.PseudoEffect.ONE_LAYER_IK.matchName );
            DuAEProperty.rename( footIK, i18n._("IK") +
                ' | ' + i18n._("Foot"));
            var legIK = DuAELayer.lastEffect( ctrl, Duik.PseudoEffect.TWO_LAYER_IK.matchName );
            DuAEProperty.rename( legIK, i18n._("IK") +
                ' | ' + i18n._("Leg"));
            var hoofAngle = DuAELayer.lastEffect( ctrl, 'ADBE Angle Control' );
            DuAEProperty.rename( hoofAngle, i18n._("Hoof"));
        }
        else if (femur && tibia)
        {
            Duik.Constraint.twoLayerIK(femur, tibia, toes, ctrl, false);
            // Rename effects
            var legIK = DuAELayer.lastEffect( ctrl, Duik.PseudoEffect.TWO_LAYER_IK.matchName );
            DuAEProperty.rename( legIK, i18n._("IK") +
                ' | ' + i18n._("Leg"));
        }
        else if (femur)
        {
            Duik.Constraint.oneLayerIK(femur, toes, ctrl, false);
            // Rename effects
            var legIK = DuAELayer.lastEffect( ctrl, Duik.PseudoEffect.ONE_LAYER_IK.matchName );
            DuAEProperty.rename( legIK, i18n._("IK") +
                ' | ' + i18n._("Leg"));
        }
    }
    else if (handNull)
    {
        //claws
        Duik.Constraint.oneLayerIK( claws, undefined, tip, false);
        //arm
        if (humerus && radius) Duik.Constraint.twoLayerIK(humerus,radius,hand,handNull, false);
        //hand
        Duik.Constraint.oneLayerIK(hand, undefined, clawsNull, false);

        var pe2 = Duik.PseudoEffect.TWO_LAYER_IK;
        var pe1 = Duik.PseudoEffect.ONE_LAYER_IK;

        //add an IK effect on the controller
        var ikCtrl = pe2.apply(ctrl);

        //the effect on the null of the hand
        var ikEffect = handNull.effect( pe2.matchName);
        var ikHand = clawsNull.effect(pe1.matchName);
        var ikToes = tip.effect(pe1.matchName);
        ikCtrl.name = ikEffect.name;

        //link the properties
        ikCtrl( pe2.props["Side"].index ).setValue( ikEffect( pe2.props["Side"].index ).value );
        var ikEffectProp = new DuAEProperty( ikEffect );
        ikEffectProp.linkProperties(ikCtrl);

        //the IK/FK Switches
        var ikHandProp = new DuAEProperty( ikHand(pe1.props["IK"].index ) );
        var ikGoalProp = new DuAEProperty( ikCtrl(pe2.props["FK"]["End"].index ) );
        var ikToesProp = new DuAEProperty( ikToes(pe1.props["IK"].index) );
        ikHandProp.linkProperties( ikCtrl(pe2.props["IK / FK"].index),true);
        var fkExp = 'if (effect("' + ikHand.name + '")(' + pe1.props["IK"].index + ').value) value;\n';
        fkExp += 'else ';
        fkExp += ikGoalProp.expressionLink(true);
        fkExp += ';';
        ikHand( pe1.props["FK"].index ).expression = fkExp;
        ikToesProp.linkProperties( ikCtrl(pe2.props["IK / FK"].index), true );
        //and re-setup the layers & needed data
        ikCtrl( pe2.props["Data"]["Layers"]["Upper"].index ).setValue( ikEffect( pe2.props["Data"]["Layers"]["Upper"].index ).value );
        ikCtrl( pe2.props["Data"]["Layers"]["Lower"].index ).setValue(ikEffect( pe2.props["Data"]["Layers"]["Lower"].index ).value);
        ikCtrl( pe2.props["Data"]["Layers"]["Goal"].index ).setValue(ikEffect( pe2.props["Data"]["Layers"]["Goal"].index ).value);
        var lowerPosProp = new DuAEProperty( ikCtrl( pe2.props["Data"]["Base values"]["Lower relative position"].index  ) );
        var goalPosProp = new DuAEProperty( ikCtrl( pe2.props["Data"]["Base values"]["Goal relative position"].index  ) );  
        lowerPosProp.pickWhip(ikEffect(pe2.props["Data"]["Base values"]["Lower relative position"].index));
        goalPosProp.pickWhip(ikEffect(pe2.props["Data"]["Base values"]["Goal relative position"].index));

        //tiptoe, heel and footroll
        if (type == OCO.LimbType.PLANTIGRADE)
        {
            //detect right or left, depending on the toes position
            var right = false;
            if (claws && hand)
            {
                var clawsPos = DuAELayer.getWorldPos(claws);
                var handPos = DuAELayer.getWorldPos(hand);
                right = (clawsPos[0] - handPos[0]) > 0;
            }
            
            var peFR = Duik.PseudoEffect.FOOT_ROLL;
            var handCtrl = peFR.apply(ctrl);
            tip.transform.rotation.expression = DuAEExpression.Id.FOOT_ROLL + "\nthisComp.layer(\"" + ctrl.name + "\").effect(\"" + handCtrl.name + "\")(" + peFR.props["Tiptoe"].index + ");";
            var op  = right ? "<" : ">";
            palm.transform.rotation.expression = DuAEExpression.Id.FOOT_ROLL + "\n" +
                "var ctrl = thisComp.layer(\"" + ctrl.name + "\").effect(\"" + handCtrl.name + "\")(" + peFR.props["Heel"].index + ");\n" +
                "var roll = thisComp.layer(\"" + ctrl.name + "\").effect(\"" + handCtrl.name + "\")(" + peFR.props["Foot roll"].index + ");\n" +
                "roll " + op + " 0 ? roll+ctrl : ctrl;";
            op = right ? ">" : "<";
            clawsNull.transform.rotation.expression = DuAEExpression.Id.FOOT_ROLL + "\n" +
                "var ctrl = thisComp.layer(\"" + ctrl.name + "\").effect(\"" + handCtrl.name + "\")(" + peFR.props["Foot roll"].index + ");\n" +
                "ctrl " + op + " 0 ? ctrl : 0;";
            var ikToesEffect = tip.effect(pe1.matchName);
            ikToesEffect( pe1.props["FK"].index ).expression = DuAEExpression.Id.FOOT_ROLL + "\nthisComp.layer(\"" + ctrl.name + "\").effect(\"" + handCtrl.name + "\")(" + peFR.props["Toes"].index + ");";
        }
        else if (type == OCO.LimbType.DIGITIGRADE)
        {
            var pe = Duik.PseudoEffect.DIGI_FOOT_ROLL;
            var handCtrl = pe.apply(ctrl);
            tip.transform.rotation.expression = DuAEExpression.Id.FOOT_ROLL + "\nthisComp.layer(\"" + ctrl.name + "\").effect(\"" + handCtrl.name + "\")(1);";
            clawsNull.transform.rotation.expression = DuAEExpression.Id.FOOT_ROLL + "\n" +
                "var ctrl = thisComp.layer(\"" + ctrl.name + "\").effect(\"" + handCtrl.name + "\")(3);\n" +
                "var tiptoe = thisComp.layer(\"" + ctrl.name + "\").effect(\"" + handCtrl.name + "\")(1);\n" +
                "ctrl-tiptoe;";
            tip.effect(pe1.matchName)( pe1.props["FK"].index ).expression = DuAEExpression.Id.FOOT_ROLL + "\nthisComp.layer(\"" + ctrl.name + "\").effect(\"" + handCtrl.name + "\")(2);";
        }

        //hide and lock
        clawsNull.enabled = false;
        clawsNull.shy = true;
        clawsNull.locked = true;
        handNull.enabled = false;
        handNull.shy = true;
        handNull.locked = true;
    }
    else
    {
        if (hand)
        {
            if (humerus && radius) Duik.Constraint.twoLayerIK(humerus,radius,hand,ctrl, false);
            else if (humerus) Duik.Constraint.oneLayerIK(humerus,hand,ctrl, false);
            else if (radius) Duik.Constraint.oneLayerIK(radius,hand,ctrl, false);
            else if (claws) Duik.Constraint.oneLayerIK(hand,claws,ctrl, false);
            else if (tip) Duik.Constraint.oneLayerIK(hand,tip,ctrl, false);
        }
        else if (claws)
        {
            if (humerus && radius) Duik.Constraint.twoLayerIK(humerus,radius,claws,ctrl, false);
            else if (humerus) Duik.Constraint.oneLayerIK(humerus,claws,ctrl, false);
            else if (radius) Duik.Constraint.oneLayerIK(radius,claws,ctrl, false);
            else if (tip) Duik.Constraint.oneLayerIK(claws,tip,ctrl, false);
        }
        else if (tip)
        {
            if (humerus && radius) Duik.Constraint.twoLayerIK(humerus,radius,tip,ctrl, false);
            else if (humerus) Duik.Constraint.oneLayerIK(humerus,tip,ctrl, false);
            else if (radius) Duik.Constraint.oneLayerIK(radius,tip,ctrl, false);
        }
        else if (palm)
        {
            if (humerus && radius) Duik.Constraint.twoLayerIK(humerus,radius,palm,ctrl, false);
            else if (humerus) Duik.Constraint.oneLayerIK(humerus,palm,ctrl, false);
            else if (radius) Duik.Constraint.oneLayerIK(radius,palm,ctrl, false);
        }
        else if (humerus && radius) Duik.Constraint.oneLayerIK(humerus,radius,ctrl, false);
    }

    // Rig shoulder
    if (shoulder)
    {
        Duik.Rig.shoulder(shoulder, ctrl);
        // If hominoid, no auto-position
        if (type == OCO.LimbType.HOMINOID)
        {
            var pe = Duik.PseudoEffect.SHOULDER;
            var shoulderCtrl = DuAELayer.lastEffect( ctrl, pe.matchName );
            shoulderCtrl( pe.props["Auto"].index ).setValue(0);
        }
    }

    return ctrl;
}

/**
 * Rigs a fin.
 * @param {Layer[]|DuList.<Layer>} [layers] - The layers to rig
 * @param {Layer[]|DuList.<Layer>} [customControllers] - Existing custom controllers to use
 * @returns {Layer} The controller of the fin
 */
Duik.Rig.fin = function( layers, customControllers )
{
    layers = def(layers, DuAEComp.unselectLayers() );
    layers = new DuList(layers);
    if( layers.isEmpty() ) return [];

    DuScriptUI.progressBar.stg( i18n._("Fin"));
    DuScriptUI.progressBar.hit(1, i18n._("Sorting bones..."));

    customControllers = new DuList(customControllers);

    var comp = layers.first().containingComp;

    // expected
    var arm = null;
    var fins = [];

    var side = OCO.Side.NONE;
    var type = OCO.LimbType.CUSTOM;

    // get'em all
    layers.do(function(layer) {
        var tag = DuAETag.get( layer );
        var bone = DuAETag.getValue( layer, DuAETag.Key.DUIK_BONE_TYPE, DuAETag.Type.STRING, tag );

        if (bone == OCO.Bone.FIN) arm = layer;
        else if (bone == OCO.Bone.FIN_FISHBONE) fins.push( layer );

        if ( side == OCO.Side.NONE ) side = Duik.Layer.side(layer);
        if ( type == OCO.LimbType.CUSTOM ) type = DuAETag.getValue( layer, DuAETag.Key.DUIK_LIMB_TYPE, DuAETag.Type.STRING, tag );

        Duik.Bone.setRigged( layer );
    });

    var nfins = fins.length;

    // unparent & reset transform
    if (arm)
    {
        arm.parent = null;
        Duik.Bone.resetTransform(arm);
    }
    for (var i = 0; i < nfins; i++)
    {
        var f = fins[i];
        f.parent = null;
        Duik.Bone.resetTransform(f);
    }

    // adjust/fix what we got! We're very friendly...
    // we need an arm
    if (!arm)
    {
        if (fins.length == 1) arm = fins.pop();
        else if (fins.length > 0)
        {
            // Create a null at the average position
            var pos = [0,0];
            for(var i = 0; i<nfins; i++)
            {
                // they've been unparented, just take the position
                pos += fins[i].transform.position;
            }
            pos /= nfins;
            arm = DuAEComp.addNull(comp, 20);
            arm.transform.position.setValue( pos );
            Duik.Layer.copyAttributes( arm, fins[0], Duik.Layer.Type.NULL );
            Duik.Layer.setName( i18n._("Fin"), arm );
        }
    }

    DuScriptUI.progressBar.hit(1, i18n._("Creating controllers"));

    var fkNull = DuAEComp.addNull(comp, 20, arm);
    Duik.Layer.copyAttributes( fkNull, arm, Duik.Layer.Type.NULL );
    var ctrl = Duik.Controller.getCreate(arm, Duik.Controller.Type.FIN, customControllers);

    DuScriptUI.progressBar.hit(1, i18n._("Parenting..."));

    // We also need to get the max distance between a fin and the arm
    var maxFinDistance = 0;
    for(var i = 0; i<nfins; i++)
    {
        var f = fins[i];
        f.parent = arm;
        var d = DuMath.length( [0,0], f.transform.position.value );
        if (d > maxFinDistance) maxFinDistance = d;
    }

    // arm's been unparented, just use the position
    var spineAttach = null;
    arm.parent = ctrl;
    ctrl.parent = spineAttach;
    fkNull.parent = ctrl;

    // Rig!
    DuScriptUI.progressBar.hit(1, 'Rigging...');

    // Add control
    var pe = Duik.PseudoEffect.FIN;
    var ctrlEffect = pe.apply( ctrl );
    var ctrlInfo = new DuAEProperty( ctrlEffect );
    ctrlEffect.name = i18n._("Fin");

    // FK Control for each fin
    var peFK = Duik.PseudoEffect.FK;

    for(var i = 0; i<nfins; i++)
    {
        var f = fins[i];
        Duik.Constraint.fk( [arm, f], fkNull );

        // Remove arm ctrl duplicate
        if (i != nfins-1)
        {
            var armEffect = DuAELayer.lastEffect( fkNull, 'ADBE Angle Control', 1);
            if (armEffect) armEffect.remove();
        }

        // Copy fishbone control
        var boneEffect = DuAELayer.lastEffect( fkNull, 'ADBE Angle Control');
        if (boneEffect)
        {
            var boneCtrl = ctrl('ADBE Effect Parade').addProperty('ADBE Angle Control');
            boneCtrl.name = boneEffect.name;
            // link
            boneEffect(1).expression = [ DuAEExpression.Id.AUTORIG_FIN,
                'thisComp.layer("' + ctrl.name + '").effect("' + boneCtrl.name + '")(1).value;'
            ].join('\n');

            // fix invalid object (another AE workaround)
            ctrlEffect = ctrlInfo.getProperty();
        }

        // Link Resistance
        var fkEffect = DuAELayer.lastEffect( fkNull, peFK.matchName );
        fkEffect( peFK.props["Resistance"].index ).expression = [ DuAEExpression.Id.AUTORIG_FIN,
            'var fx = thisComp.layer("' + ctrl.name + '").effect("' + ctrlEffect.name + '");',
            'var result = fx(' + pe.props["Overlap"]["Resistance"].index + ').value;',
            'var rdm = fx(' + pe.props["Overlap"]["Randomness"].index + ').value;',
            'seedRandom(0, true);',
            DuAEExpression.Library.get(['addNoise']),
            'result = addNoise( result, rdm );',
            'result;'
        ].join('\n');

        // need the layer position for the ratio
        var lpos = f.transform.position.value;

        // Link Curve
        fkEffect( peFK.props["Curve"].index ).expression = [ DuAEExpression.Id.AUTORIG_FIN,
            'var fx = thisComp.layer("' + ctrl.name + '").effect("' + ctrlEffect.name + '");',
            'var curve = fx(' + pe.props["Curve"].index + ').value;',
            'var maxDistance = ' + maxFinDistance + ';',
            'var layerPos = ' + lpos.toSource() + ';',
            'var d = length( [0,0], layerPos);',
            'linear(d, 0, maxDistance, curve*.2, curve);'
        ].join('\n');

        // Link Flexibility
        fkEffect( peFK.props["Flexibility"].index ).expression = [ DuAEExpression.Id.AUTORIG_FIN,
            'var fx = thisComp.layer("' + ctrl.name + '").effect("' + ctrlEffect.name + '");',
            'var flexMax = fx(' + pe.props["Overlap"]["Max. flexibility"].index + ').value;',
            'var flexMin = fx(' + pe.props["Overlap"]["Min. flexibility"].index + ').value;',
            'var rdm = fx(' + pe.props["Overlap"]["Randomness"].index + ').value;',
            'var maxDistance = ' + maxFinDistance + ';',
            'var layerPos = ' + lpos.toSource() + ';',
            'var d = length( [0,0], layerPos);',
            'seedRandom(0, true);',
            DuAEExpression.Library.get(['addNoise']),
            'var result = linear(d, 0, maxDistance, flexMin, flexMax);',
            'result = addNoise( result, rdm );',
            'result;'
        ].join('\n');
    }

    // Link rotation
    var fkRot = new DuAEProperty( fkNull.transform.rotation );
    fkRot.pickWhip( ctrl.transform.rotation );

    return ctrl;
}

/**
 * Rigs the spine of a fish (head + tail).
 * @param {Layer[]|DuList.<Layer>} [layers] - The layers to rig
 * @param {Duik.Constraint.IKType} [rigMode=Duik.Constraint.IKType.FK] How to rig tails and other chains consisting of more than 3 layers.
 * @param {Layer[]|DuList.<Layer>} [customControllers] - Existing custom controllers to use
 * @returns {Object} An object with two Arrays: bones and controllers.
 */
Duik.Rig.fishSpine = function( layers, rigMode, customControllers )
{
    layers = def(layers, DuAEComp.unselectLayers() );
    layers = new DuList(layers);
    if( layers.isEmpty() ) return [];
    fishIK = rigMode != Duik.Constraint.IKType.FK;

    var fs = {};
    fs.bones = [];
    fs.controllers = [];

    DuScriptUI.progressBar.stg( i18n._("Fish spine"));
    DuScriptUI.progressBar.hit(1, 'Sorting bones...');

    customControllers = new DuList(customControllers);

    var comp = layers.first().containingComp;

    // expected
    var head = null;
    var spine = [];
    var tip = null;
    var headTip = null;

    // get'em all
    layers.do(function(layer) {
        var tag = DuAETag.get( layer );
        var bone = DuAETag.getValue( layer, DuAETag.Key.DUIK_BONE_TYPE, DuAETag.Type.STRING, tag );
        var boneIndex = DuAETag.getValue( layer, DuAETag.Key.DUIK_BONE_INDEX, DuAETag.Type.INT, tag );

        if (bone == OCO.Bone.SKULL) head = layer;
        else if (bone == OCO.Bone.SKULL_TIP) headTip = layer;
        else if (bone == OCO.Bone.TIP) tip = layer;
        else
        {
            var b = layer;
            b.i = boneIndex;
            spine.push(b);
        }

        Duik.Bone.setRigged( layer );
    });

    // Sort
    // a sorter for spine and neck
	function sortBones(a,b)
	{
		return a.i - b.i;
	}

    spine.sort(sortBones);

    DuScriptUI.progressBar.hit(1, 'Creating controllers...');

    //unparent & reset transform
    for (var i=0, num = spine.length ; i < num ; i++ )
    {
        var s = spine[i];
        s.parent = null;
        Duik.Bone.resetTransform(s);
    }
    if (head)
    {
        head.parent = null;
        Duik.Bone.resetTransform(head);
    }
    if (tip)
    {
        tip.parent = null;
        Duik.Bone.resetTransform(tip);
    }
    if (headTip)
    {
        headTip.parent = null;
        Duik.Bone.resetTransform(headTip);
    }

    // adjust/fix what we got! We're very friendly...
    // we need a head
    if(!head)
    {
        if (spine.length > 0)
        {
            head = DuAEComp.addNull( comp, 20, spine[0] );
            Duik.Layer.copyAttributes( head, spine[0], duik.Layer.Type.NULL );
            Duik.Layer.setName( i18n._("Head"), head );
        }
        else return fs;
    }
    // spine
    if(spine.length == 0 && tip)
    {
        spine = [tip];
        tip = null;
    }

    if (spine.length == 0)
    {
        var ctrl = Duik.Controller.getCreate(head, Duik.Controller.Type.HEAD, customControllers );
        head.parent = ctrl;
        if(headTip) headTip.parent = head;
        return fs;
    }

    var bodyCtrl = Duik.Controller.getCreate(spine[0], Duik.Controller.Type.HIPS, customControllers );
    var headCtrl = Duik.Controller.getCreate(head, Duik.Controller.Type.HEAD, customControllers );

    DuScriptUI.progressBar.hit(1, 'Parenting...');

    headCtrl.parent = bodyCtrl;

    head.parent = spine[0];
    if (headTip) headTip.parent = head;

    spine[0].parent = bodyCtrl;
    for (var i = 1, n = spine.length; i < n; i++)
    {
        spine[i].parent = spine[i-1];
    }
    if( tip ) tip.parent = spine[spine.length-1];

    DuScriptUI.progressBar.hit(1, 'Rigging...');

    // Head FK
    Duik.Constraint.simpleFK( head, headCtrl );

    // Single layer tail
    if (spine.length == 1)
    {
        spine[0].parent = bodyCtrl;
        fs.bones = spine;
        fs.controllers = bodyCtrl;
        return fs;
    }

    // Tail IK
    if (fishIK)
    {
        // we need a tip
        if (!tip) tip = spine.pop();

        var tailCtrl = Duik.Controller.getCreate( tip, Duik.Controller.Type.TAIL, customControllers);

        if (spine.length > 1)
        {
            var ctrls = Duik.Constraint.bezierIK( spine, tip, tailCtrl, false);
            //parent
            ctrls[0].parent = bodyCtrl;
            ctrls[1].parent = bodyCtrl;
            spine[0].parent = bodyCtrl;
            fs.controllers = ctrls;
        }
        else
        {
            Duik.Constraint.oneLayerIK( spine[0], tip, tailCtrl, false);
            //parent
            tailCtrl.parent = bodyCtrl;
            spine[0].parent = bodyCtrl;
        }
        fs.bones = spine;
        fs.controllers.push(tailCtrl);
        return fs;
    }

    // Tail FK
    spine.push(tip);

    var reversedSpine = [];
    for (var i = spine.length -1; i >= 0; i--) reversedSpine.push(spine[i] );

    Duik.Constraint.fk( reversedSpine, bodyCtrl );
    //parent
    spine[0].parent = bodyCtrl;
    // disable parent rotation inheritance
    var pe = Duik.PseudoEffect.FK;
    bodyCtrl.effect( pe.matchName )( pe.props["Parent rotation"].index).setValue(0);

    fs.bones = spine;
    fs.controllers.push(bodyCtrl);
    return fs;
}

/**
 * Rigs a wing with feathers
 * @param {Layer[]|DuList.<Layer>} [layers] - The layers to rig
 * @param {Layer[]|DuList.<Layer>} [customControllers] - Existing custom controllers to use
 * @return {Layer} The controller of the wing
 */
Duik.Rig.wing = function( layers, customControllers )
{
    layers = def(layers, DuAEComp.unselectLayers() );
    layers = new DuList(layers);
    if( layers.isEmpty() ) return [];

    customControllers = new DuList(customControllers);

    DuScriptUI.progressBar.stg( i18n._("Wing"));
    DuScriptUI.progressBar.hit(1, i18n._("Sorting bones..."));

    var comp = layers.first().containingComp;

    // expected
    var arm = null;
    var forearm = null;
    var hand = null;
    var handTip = null;
    var feathers = [];

    var side = OCO.Side.NONE;
    var type = OCO.LimbType.CUSTOM;

    // get'em all
    layers.do(function(layer) {
        var tag = DuAETag.get( layer );
        var bone = DuAETag.getValue( layer, DuAETag.Key.DUIK_BONE_TYPE, DuAETag.Type.STRING, tag );

        if (bone == OCO.Bone.HUMERUS) arm = layer;
        else if (bone == OCO.Bone.RADIUS) forearm = layer;
        else if (bone == OCO.Bone.CARPUS) hand = layer;
        else if (bone == OCO.Bone.FEATHER) feathers.push( layer );

        if ( side == OCO.Side.NONE ) side = Duik.Layer.side(layer);
        if ( type == OCO.LimbType.CUSTOM ) type = DuAETag.getValue( layer, DuAETag.Key.DUIK_LIMB_TYPE, DuAETag.Type.STRING, tag );

        Duik.Bone.setRigged( layer );
    });

    // unparent & reset transform
    if (arm)
    {
        arm.parent = null;
        Duik.Bone.resetTransform(arm);
    }
    if (forearm)
    {
        forearm.parent = null;
        Duik.Bone.resetTransform(forearm);
    }
    if (hand)
    {
        hand.parent = null;
        Duik.Bone.resetTransform(hand);
    }
    for (var i = 0; i < feathers.length; i++)
    {
        var f = feathers[i];
        var parent = f.parent;
        f.parent = null;
        Duik.Bone.resetTransform(f);
        f.parent = parent;
    }

    // adjust/fix what we got! We're very friendly...
    // we need a hand and a root
    if (!hand && !forearm && !arm) {
        // Sorry, can't do anything!
        return;
    }
    if (!hand) {
        hand = forearm;
        forearm = null;
    }
    if (!hand) {
        hand = arm;
        arm = null;
    }
    if (!forearm) {
        forearm = arm;
        arm = null;
    }
    var root = null;
    if (arm) root = arm;
    else if (forearm) root = forearm;
    else root = hand;

    // Find the hand tip
    var layer;
    while( layer = layers.next() ) {
        var tag = DuAETag.get( layer );
        var bone = DuAETag.getValue( layer, DuAETag.Key.DUIK_BONE_TYPE, DuAETag.Type.STRING, tag );

        if (bone == OCO.Bone.TIP) {
            if (layer.parent == hand) {
                handTip = layer;
                break;
            }
        }
    };

    DuScriptUI.progressBar.hit(1, i18n._("Creating controllers"));

    var ctrl = Duik.Controller.getCreate(root, Duik.Controller.Type.WING, customControllers);

    DuScriptUI.progressBar.hit(1, i18n._("Parenting..."));

    // arm's been unparented, just use the position
    var spineAttach = null;
    forearm.parent = arm;
    hand.parent = forearm;
    root.parent = ctrl;
    ctrl.parent = spineAttach;

    // Rig!
    DuScriptUI.progressBar.hit(1, i18n._("Rigging..."));

    // Add effect
    var pe = Duik.PseudoEffect.WING;
    var ctrlEffect = pe.apply( ctrl );
    var ctrlInfo = new DuAEProperty(ctrlEffect);
    ctrlEffect.name = i18n._("Wing");

    // Set effect
    var peLayers = pe.props['Data']['Layers'];
    var peLengths = pe.props['Data']['Lengths'];
    if (arm) ctrlEffect(peLayers['Arm'].index).setValue(arm.index);
    if (forearm) ctrlEffect(peLayers['Forearm'].index).setValue(forearm.index);
    if (hand) ctrlEffect(peLayers['Hand'].index).setValue(hand.index);
    if (handTip) ctrlEffect(peLayers['Tip'].index).setValue(handTip.index);

    // Add expressions
    ctrlEffect(peLengths['Arm'].index).expression = [ DuAEExpression.Id.WING,
        'var fx = thisProperty.propertyGroup();',
        'var forearm = null;',
        'try { forearm = fx(' + peLayers['Forearm'].index + '); } catch(e) {}',
        'if (forearm) length(forearm.position);',
        'else 0;'
	].join('\n');

    ctrlEffect(peLengths['Forearm'].index).expression = [ DuAEExpression.Id.WING,
        'var fx = thisProperty.propertyGroup();',
        'var hand = null;',
        'try { hand = fx(' + peLayers['Hand'].index + '); } catch(e) {}',
        'if (hand) length(hand.position);',
        'else 0;'
	].join('\n');

    ctrlEffect(peLengths['Hand'].index).expression = [ DuAEExpression.Id.WING,
        'var fx = thisProperty.propertyGroup();',
        'var tip = null;',
        'var hand = null;',
        'try { tip = fx(' + peLayers['Tip'].index + '); } catch(e) {}',
        'try { hand = fx(' + peLayers['Hand'].index + '); } catch(e) {}',
        'if (tip) length(tip.position);',
        'else if (hand) length(hand.position) * .8;',
        'else 0;'
	].join('\n');

    if (hand) {
        var linkEffectName = DuAELayer.newUniqueEffectName( i18n._("Wing"), hand );
        var linkEffect = hand.property('ADBE Effect Parade').addProperty('ADBE Layer Control');
        linkEffect.name = linkEffectName;
        linkEffect(1).setValue(ctrl.index);
        hand.transform.rotation.expression = [ DuAEExpression.Id.WING,
            'var controller = null;',
            'var fkFx =  effect("' + linkEffect.name + '");',
            'var result = value;',
            'try { controller = fkFx(1); } catch (e) {}',
            'if ( controller !=null )',
            '{',
            '   var fx = controller.effect("' + ctrlEffect.name + '");',
            '	var flapProperty = controller.rotation;',
            '	var flex = fx(' + pe.props['General parameters']['Wing flexibility'].index + ').value;',
            '	var overlap = fx(' + pe.props['General parameters']['Air resistance'].index + ').value;',
            '	var follow = fx(' + pe.props['General parameters']['Forearm orientation'].index + ').value;',
            '	var fk = fx(' + pe.props['Hand rotation'].index + ').value;',
            '	var foldProperty = fx(' + pe.props['Fold wing'].index + ');',
            '	var arm = null;',
            '	',
            '	// adjust values',
            '	overlap /= 100;',
            '	overlap *= .1; // hand multiplicator',
            '	flex /= 100;',
            '	',
            '	// flap and fold delay',
            '	var flap = flapProperty.valueAtTime(time - overlap);',
            '	var fold = -3*foldProperty.valueAtTime(time - overlap); // hand folding ',
            '',
            '	// remove current values (it is in the flap value)',
            '	result -= flapProperty.value*flex;',
            '	// add flap and fold',
            '	result += flap*flex;',
            '	result += fold;',
            '	// Flexibility based on control velocity',
            '	result -= flapProperty.velocityAtTime(time-overlap/2) * overlap;',
            '	result -= foldProperty.velocityAtTime(time-overlap/2) * overlap;',
            '',
            '	// FK control',
            '    result += fk;',
            '}',
            'result;'
        ].join('\n');
    }

    if (forearm) {
        var linkEffectName = DuAELayer.newUniqueEffectName( i18n._("Wing"), forearm );
        var linkEffect = forearm.property('ADBE Effect Parade').addProperty('ADBE Layer Control');
        linkEffect.name = linkEffectName;
        linkEffect(1).setValue(ctrl.index);
        forearm.transform.rotation.expression = [ DuAEExpression.Id.WING,
            'var controller = null;',
            'var fkFx =  effect("' + linkEffect.name + '");',
            'var result = value;',
            'try { controller = fkFx(1); } catch (e) {}',
            'if ( controller !=null )',
            '{',
            '   var fx = controller.effect("' + ctrlEffect.name + '");',
            '	var flapProperty = controller.rotation;',
            '	var flex = fx(' + pe.props['General parameters']['Wing flexibility'].index + ').value;',
            '	var overlap = fx(' + pe.props['General parameters']['Air resistance'].index + ').value;',
            '	var follow = fx(' + pe.props['General parameters']['Forearm orientation'].index + ').value;',
            '	var fk = fx(' + pe.props['Forearm rotation'].index + ').value;',
            '	var foldProperty = fx(' + pe.props['Fold wing'].index + ');',
            '	var arm = null;',
            '	try { arm = fx(' + peLayers['Arm'].index + ') } catch(e) {}',
            '	if (arm) {',
            '		var armFK = fx(' + pe.props['Arm rotation'].index + ').value;',
            '		if (!follow) result -= armFK;',
            '	}',
            '	',
            '	// adjust values',
            '	overlap /= 100;',
            '	overlap *= .05; // forearm multiplicator',
            '	flex /= 100;',
            '	',
            '	// flap and fold delay',
            '	var flap = flapProperty.valueAtTime(time - overlap);',
            '	var fold = 2*foldProperty.valueAtTime(time - overlap); // forearm folding ',
            '',
            '	// remove current values (it is in the flap value)',
            '	result -= flapProperty.value*flex;',
            '	// add flap and fold',
            '	result += flap*flex;',
            '	result += fold;',
            '	// Flexibility based on control velocity',
            '	result -= flapProperty.velocityAtTime(time-overlap/2) * overlap;',
            '	result -= foldProperty.velocityAtTime(time-overlap/2) * overlap;',
            '',
            '	// FK control',
            '    result += fk;',
            '}',
            'result;'
        ].join('\n');
    }

    if (arm) {
        var linkEffectName = DuAELayer.newUniqueEffectName( i18n._("Wing"), arm );
        var linkEffect = arm.property('ADBE Effect Parade').addProperty('ADBE Layer Control');
        linkEffect.name = linkEffectName;
        linkEffect(1).setValue(ctrl.index);
        arm.transform.rotation.expression = [ DuAEExpression.Id.WING,
            'var controller = null;',
            'var fkFx =  effect("' + linkEffect.name + '");',
            'var result = value;',
            'try { controller = fkFx(1); } catch (e) {}',
            'if ( controller !=null )',
            '{',
            '   var fx = controller.effect("' + ctrlEffect.name + '");',
            '	var fk = fx(' + pe.props['Arm rotation'].index + ').value;',
            '	var fold = -fx(' + pe.props['Fold wing'].index + ').value;',
            '	var flap = controller.rotation.value;',
            '   result += fk + fold;',
            '	if (!hasParent) result += flap ;',
            '	else if (parent != controller) result += flap;',
            '}',
            'result;'
        ].join('\n');
    }

    for (var i = 0; i < feathers.length; i++) {
        var feather = feathers[i];
        var linkEffectName = DuAELayer.newUniqueEffectName( i18n._("Wing"), feather );
        var linkEffect = feather.property('ADBE Effect Parade').addProperty('ADBE Layer Control');
        linkEffect.name = linkEffectName;
        linkEffect(1).setValue(ctrl.index);

        // Add the feather control
        var peFK = Duik.PseudoEffect.FEATHER;
        var fkEffect = peFK.apply(ctrl);
        // The ctrlEffect is now invalid, get it back
        var ctrlEffect = ctrlInfo.getProperty();

        feather.transform.rotation.expression = [ DuAEExpression.Id.WING,
            'var controller = null;',
            'try { controller = effect("' + linkEffect.name + '")(1); } catch (e) {}',
            'var fx = controller.effect("' + ctrlEffect.name + '");',
            'var fFx = controller.effect("' + fkEffect.name + '");',
            'var r = fFx(' + peFK.props['Rotation'].index + ').value;',
            'var foldedAngle = fFx(' + peFK.props['Settings']['Folded angle'].index + ').value;',
            'var overlap = fx(' + pe.props['General parameters']['Air resistance'].index + ').value;',
            'var handCustomInfluence = fx(' + pe.props['Feather parameters']['Hand rotation multiplicator'].index + ').value;',
            'var armLength = fx(' + peLengths['Arm'].index + ').value;',
            'var forearmLength = fx(' + peLengths['Forearm'].index + ').value;',
            'var handLength = fx(' + peLengths['Hand'].index + ').value;',
            'var fold = fx(' + pe.props['Fold wing'].index + ').value;',
            'var arm = null;',
            'var forearm = null;',
            'var hand = null;',
            'try { arm = fx(' + peLayers['Arm'].index + '); } catch(e) {}',
            'try { forearm = fx(' + peLayers['Forearm'].index + '); } catch(e) {}',
            'try { hand = fx(' + peLayers['Hand'].index + '); } catch(e) {}',
            DuAEExpression.Library.get([
                'getOrientation',
                'dishineritRotation',
                'getLayerDistance',
                'linearExtrapolation',
                'normalizeWeights'
            ]),
            '',
            'function featherOrientation() {',
            '  if (!hasParent) return value; // Stupid rig.',
            '	',
            '	// Prepare values',
            '	overlap /= 100;',
            '	overlap *= 0.1;',
            '	var t = time - overlap;',
            '	var armInfluence = 1;',
            '	var forearmInfluence = 1;',
            '	var handInfluence = 1;',
            '	handCustomInfluence -= 1;',
            '	',
            '  // The orientations we\'re getting from each part.',
            '  var armOrientation = 0;',
            '  var forearmOrientation = 0;',
            '  var handOrientation = 0;',
            '  ',
            '  // Adjust the layers we\'ve got...',
            '  if (!hand && !forearm && !arm) {',
            '    hand = parent;',
            '  }',
            '  else {',
            '    if (!hand) {',
            '      hand = forearm;',
            '      handLength = forearmLength;',
            '      forearm = null;',
            '    }',
            '    if (!hand) {',
            '      hand = arm;',
            '      handLength = armLength;',
            '      arm = null;',
            '    }',
            '    if (!forearm) {',
            '      forearm = arm;',
            '      forearmLength = armLength;',
            '      arm = null;',
            '    }',
            '  }',
            '',
            '  // Check where the feather is attached',
            '  var handFeather = parent == hand;',
            '  var forearmFeather = false;',
            '  if (forearm) forearmFeather = parent == forearm;',
            '  var armFeather = false;',
            '  if (arm) armFeather = parent == arm;',
            '  ',
            '  // Get distances',
            '  var handDistance = getLayerDistance(hand);',
            '  var forearmDistance = -1;',
            '  if (forearm) forearmDistance = getLayerDistance(forearm);',
            '  var armDistance = -1;',
            '  if (arm) armDistance = getLayerDistance(arm);',
            '  ',
            '    // Check if we\'re folded ',
            '    var armExtension = getLayerDistance(hand, arm);',
            '    var limbLength = armLength + forearmLength;',
            '    var folded = linear(armExtension, 0, limbLength, 1, 0);',
            '    folded *= linear(Math.abs(fold), 0, 30, 0, 1);',
            '    foldedAngle *= folded;',
            '',
            '  // Get orientations',
            '',
            '  if (armFeather) {',
            '    // Influences',
            '    forearmInfluence = linear(armDistance,',
            '      armLength*.66, armLength + forearmLength * .2,',
            '      0, forearmInfluence',
            '    );',
            '    armInfluence = linear(armDistance,',
            '      armLength*.66, armLength + forearmLength * .2,',
            '      armInfluence, 0',
            '    );',
            '    var w = normalizeWeights([armInfluence, forearmInfluence]);',
            '    // Arm orientation',
            '    armOrientation += getOrientation(arm, t);',
            '    armOrientation *= w[0];',
            '    // Forearm orientation ',
            '    forearmOrientation += getOrientation(forearm, t);',
            '    forearmOrientation *= w[1];',
            '    ',
            '    return dishineritRotation() + armOrientation + forearmOrientation + foldedAngle;',
            '  }',
            '  ',
            '  if (forearmFeather) {',
            '    // Hand influence',
            '    handInfluence = linear(forearmDistance,',
            '      forearmLength*.5, forearmLength + handLength,',
            '      0, handInfluence',
            '    );',
            '    // Hand orientation',
            '    handOrientation = getOrientation(hand, t);',
            '    ',
            '    if (!arm) {',
            '      // Forearm Influence',
            '      forearmInfluence = linear(forearmDistance,',
            '        forearmLength*.5, forearmLength + handLength*.5,',
            '        forearmInfluence, 0',
            '      );',
            '      var w = normalizeWeights([forearmInfluence, handInfluence]);',
            '      ',
            '      handOrientation *= w[1];',
            '      forearmOrientation = getOrientation(forearm, t);',
            '      forearmOrientation *= w[0];',
            '      ',
            '      return dishineritRotation() + handOrientation + forearmOrientation + foldedAngle;',
            '    }',
            '    ',
            '    // Influence of the arm',
            '    armInfluence = linear(armDistance,',
            '      armLength*.66, armLength + forearmLength * .2,',
            '      armInfluence, 0',
            '    );',
            '    // Influence of the forearm',
            '    forearmInfluence = linear( forearmDistance,',
            '      forearmLength*.5,  forearmLength + handLength,',
            '      forearmInfluence, 0',
            '    );',
            '    var w = normalizeWeights([armInfluence, forearmInfluence, handInfluence]);',
            '    armOrientation = getOrientation(arm, t);',
            '    armOrientation *= w[0];',
            '    forearmOrientation = getOrientation(forearm, t);',
            '    forearmOrientation *= w[1];',
            '    handOrientation *= w[2];',
            '    return dishineritRotation() + handOrientation + forearmOrientation + armOrientation + foldedAngle;',
            '  }',
            '',
            '  var handRotation = hand.rotation.valueAtTime(t) - hand.rotation.valueAtTime(0);',
            '  handRotation *= linearExtrapolation( handDistance,',
            '    0, handLength,',
            '    0, handCustomInfluence',
            '  );',
            '  ',
            '  if (!forearm) return value + handRotation;',
            '  // Influences',
            '  handInfluence = linear( handDistance,',
            '    0, handLength,',
            '    handInfluence*.5, handInfluence',
            '  );',
            '  forearmInfluence = linear( handDistance,',
            '    0, handLength,',
            '    forearmInfluence/2, 0',
            '  );',
            '  forearmInfluence += linear( forearmDistance,',
            '    0, forearmLength,',
            '    .4, 0',
            '  );',
            '',
            '  var w = normalizeWeights([forearmInfluence, handInfluence]);',
            '  forearmOrientation = getOrientation(forearm, t);',
            '  forearmOrientation *= w[0];',
            '  handOrientation = getOrientation(hand, t);',
            '  handOrientation *= w[1];',
            '  return dishineritRotation() + forearmOrientation + handOrientation + handRotation + foldedAngle;',
            '',
            '}',
            '',
            'var result = featherOrientation() + r;',
            'result;',
            ''
        ].join('\n');
    }

    return ctrl;
}

/**
 * Rigs hair strands
 * @param {Layer[]|DuList.<Layer>} [layers] - The layers to rig
 * @param {Layer[]|DuList.<Layer>} [customControllers] - Existing custom controllers to use
 * @return {Layer[]} The controllers for the hair
 */
Duik.Rig.hair = function( layers, customControllers )
{
    // Hair are tails :-)
    var hairCtrls = Duik.Rig.tail(layers, false, customControllers, true);
    if (hairCtrls.length == 0) return [];

    // Just set the FK control to no follow
    var pe = Duik.PseudoEffect.FK;
    var fx = hairCtrls[0].property('ADBE Effect Parade').property(pe.matchName);
    if (!fx) return;
    fx(pe.props['Parent rotation'].index).setValue(0);

    return hairCtrls;
}

/**
 * Rigs custom chains
 * @param {Layer[]|DuList.<Layer>} [layers] - The layers to rig
 * @param {Duik.Constraint.IKType} [tailMode=Duik.Constraint.IKType.FK] How to rig tails and other chains consisting of more than 3 layers.
 * @param {Duik.Constraint.IKType} [threeLayerMode=Duik.Constraint.IKType.ONE_TWO] How to rig tails and other chains consisting of more than 3 layers.
 * @param {Layer[]|DuList.<Layer>} [customControllers] - Existing custom controllers to use
 * @return {Layer[]} The controllers
 */
Duik.Rig.custom = function( layers, tailMode, threeLayerMode, customControllers ) {
    layers = def(layers, DuAEComp.unselectLayers() );
    layers = new DuList(layers);
    if( layers.isEmpty() ) return [];

    Duik.Bone.setRigged( layers );
    
    tailMode = def(tailMode, Duik.Constraint.IKType.FK);
    threeLayerMode = def(threeLayerMode, Duik.Constraint.IKType.ONE_TWO);

    customControllers = new DuList(customControllers);

    DuScriptUI.progressBar.stg( i18n._("Custom bones"));
    DuScriptUI.progressBar.hit(1, i18n._("Sorting bones..."));

    var comp = layers.first().containingComp;

    // Sort
    // a sorter for spine and neck
	function sortBones(a,b)
	{
        var ai = DuAETag.getValue( a, DuAETag.Key.DUIK_BONE_INDEX, DuAETag.Type.INT );
        var bi = DuAETag.getValue( b, DuAETag.Key.DUIK_BONE_INDEX, DuAETag.Type.INT );
		return ai - bi;
	}

    layers.sort(sortBones);
    
    var numLayers = layers.length();

    DuScriptUI.progressBar.hit(1, i18n._("Rigging..."));

    // Rig
    if (numLayers == 1) {
        var ctrl = Duik.Controller.getCreate( layers.first(), Duik.Controller.Type.TRANSFORM, customControllers );
        Duik.Constraint.simpleFK( layers, ctrl );
        return  [ctrl];
    }
    else if (numLayers == 2) {
        var ctrl = Duik.Controller.getCreate( layers.last(), Duik.Controller.Type.TRANSFORM, customControllers );
        Duik.Constraint.oneLayerIK( layers.first(), layers.last(), ctrl );
        return  [ctrl];
    }
    else if (numLayers == 3) {
        var ctrl = Duik.Controller.getCreate( layers.last(), Duik.Controller.Type.TRANSFORM, customControllers );
        Duik.Constraint.twoLayerIK( layers.first(), layers.at(1), layers.last(), ctrl );
        return  [ctrl];
    }
    else if (numLayers == 4) {
        if (threeLayerMode == Duik.Constraint.IKType.FK) {
            var ctrl = Duik.Controller.getCreate( layers.first(), Duik.Controller.Type.TRANSFORM, customControllers );
            Duik.Constraint.fk(layers, ctrl);
            return  [ctrl];
        }
        else if (threeLayerMode == Duik.Constraint.IKType.ONE_TWO) {
            var ctrl = Duik.Controller.getCreate( layers.last(), Duik.Controller.Type.TRANSFORM, customControllers );
            Duik.Constraint.oneTwoLayerIK(layers.at(0), layers.at(1), layers.at(2), layers.last(), ctrl);
            return  [ctrl];
        }
        else if (threeLayerMode == Duik.Constraint.IKType.TWO_ONE) {
            var ctrl = Duik.Controller.getCreate( layers.last(), Duik.Controller.Type.TRANSFORM, customControllers );
            Duik.Constraint.twoOneLayerIK(layers.at(0), layers.at(1), layers.at(2), layers.last(), ctrl);
            return  [ctrl];
        }
        else if (threeLayerMode == Duik.Constraint.IKType.BEZIER_IK) {
            var ctrl = Duik.Controller.getCreate( layers.last(), Duik.Controller.Type.TRANSFORM, customControllers );
            var tip = layers.pop();
            return Duik.Constraint.bezierIK(layers, tip, ctrl);
        }
        else if (threeLayerMode == Duik.Constraint.IKType.BEZIER_FK) {
            var ctrl = Duik.Controller.getCreate( layers.last(), Duik.Controller.Type.TRANSFORM, customControllers );
            var ctrl1 = Duik.Controller.getCreate( layers.first(), Duik.Controller.Type.TRANSFORM, customControllers );
            var tip = layers.pop();
            return Duik.Constraint.bezierFK(layers, tip, ctrl, undefined, ctrl1);
        }
    }
    else {
        if (tailMode == Duik.Constraint.IKType.FK) {
            var ctrl = Duik.Controller.getCreate( layers.first(), Duik.Controller.Type.TRANSFORM, customControllers );
            Duik.Constraint.fk(layers, ctrl);
            return [ctrl];
        }
        else if (tailMode == Duik.Constraint.IKType.BEZIER_IK) {
            var ctrl = Duik.Controller.getCreate( layers.last(), Duik.Controller.Type.TRANSFORM, customControllers );
            var tip = layers.pop();
            return Duik.Constraint.bezierIK(layers, tip, ctrl);
        }
        else if (tailMode == Duik.Constraint.IKType.BEZIER_FK) {
            var ctrl = Duik.Controller.getCreate( layers.last(), Duik.Controller.Type.TRANSFORM, customControllers );
            var ctrl1 = Duik.Controller.getCreate( layers.first(), Duik.Controller.Type.TRANSFORM, customControllers );
            var tip = layers.pop();
            return Duik.Constraint.bezierFK(layers, tip, ctrl, undefined, ctrl1);
        }
    }
}