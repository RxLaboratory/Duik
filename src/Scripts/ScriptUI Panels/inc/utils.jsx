// UTILS

function addSetting( c, t ) {
    var settingGroup = DuScriptUI.group(c, 'row');
    settingGroup.margin = 0;
    settingGroup.spacing = 3;
    settingGroup.alignment = ['fill', 'top'];

    var checkbox = DuScriptUI.checkBox( settingGroup, {
        text: t + ':',
        localize: false
    });
    checkbox.alignment = ['left', 'center'];

    settingGroup = DuScriptUI.group(settingGroup, 'row');
    settingGroup.spacing = 0;
    settingGroup.margin = 0;
    settingGroup.alignment = ['fill', 'fill'];
    settingGroup.checked = settingGroup.enabled = false;

    settingGroup.onClick = function() {};
    
    checkbox.onClick = function() {
        settingGroup.checked = checkbox.value;
        settingGroup.enabled = checkbox.value;
        settingGroup.onClick();
    }

    return settingGroup;
}

function createCtrlButton(group, icon, helpTip, type) {
    var btn = DuScriptUI.button(
        group,
        '',
        icon,
        helpTip + '\n\n' + i18n._("[Alt]: One controller for all layers.\n[Ctrl]: Parent layers to the controllers.")
    )
    btn.onClick = function() {
        var mode = OCO.config.get('after effects/controller layer type', Duik.Controller.LayerMode.SHAPE);
        if (mode == Duik.Controller.LayerMode.NULL) OCO.config.set('after effects/controller layer type', Duik.Controller.LayerMode.RASTER);

        Duik.Controller.fromLayers(type);

        OCO.config.set('after effects/controller layer type', mode);
    };
    btn.onAltClick = function() {
        var mode = OCO.config.get('after effects/controller layer type', Duik.Controller.LayerMode.SHAPE);
        if (mode == Duik.Controller.LayerMode.NULL) OCO.config.set('after effects/controller layer type', Duik.Controller.LayerMode.RASTER);

        Duik.Controller.fromLayers(type, false, true);

        OCO.config.set('after effects/controller layer type', mode);
    };
    btn.onCtrlClick = function() {
        var mode = OCO.config.get('after effects/controller layer type', Duik.Controller.LayerMode.SHAPE);
        if (mode == Duik.Controller.LayerMode.NULL) OCO.config.set('after effects/controller layer type', Duik.Controller.LayerMode.RASTER);

        Duik.Controller.fromLayers(type, true);

        OCO.config.set('after effects/controller layer type', mode);
    };
    btn.onCtrlAltClick = function() {
        var mode = OCO.config.get('after effects/controller layer type', Duik.Controller.LayerMode.SHAPE);
        if (mode == Duik.Controller.LayerMode.NULL) OCO.config.set('after effects/controller layer type', Duik.Controller.LayerMode.RASTER);

        Duik.Controller.fromLayers(type, true, true);

        OCO.config.set('after effects/controller layer type', mode);
    };
    return btn;
}

function createSideSelector(container) {
    var sideSelector = DuScriptUI.selector(container);
    sideSelector.addButton( i18n._("None"), w16_no_side);
    sideSelector.addButton( i18n._("Left"), w16_left_hand);
    sideSelector.addButton( i18n._("Right"), w16_right_hand);
    sideSelector.setCurrentIndex(0);
    return sideSelector;
}

function createLocationSelector(container) {
    var locationSelector = DuScriptUI.selector(container);
    locationSelector.addButton( i18n._("None"), w16_no_loc);
    locationSelector.addButton( i18n._("Front"), w16_front);
    locationSelector.addButton( i18n._("Back"), w16_back);
    locationSelector.addButton( i18n._("Middle"), w16_middle);
    locationSelector.addButton( i18n._("Above"), w16_above);
    locationSelector.addButton( i18n._("Under"), w16_under);
    locationSelector.addButton( i18n._("Tail"), w16_tail_loc);
    locationSelector.setCurrentIndex(0);
    return locationSelector;
}

function createTypeSelector(container) {
    var typeSelector = DuScriptUI.selector(container);
    typeSelector.addButton( i18n._("None"), w16_layer, undefined, Duik.Layer.Type.NONE);
    typeSelector.addButton( i18n._("Bone"), w16_bone, undefined, Duik.Layer.Type.BONE);
    typeSelector.addButton( i18n._("Pin"), w16_pin, undefined, Duik.Layer.Type.PIN);
    typeSelector.addButton( i18n._("Controller"), w16_controller, undefined, Duik.Layer.Type.CONTROLLER);
    typeSelector.addButton( i18n._("Zero"), w16_zero, undefined, Duik.Layer.Type.ZERO);
    typeSelector.addButton( i18n._("Locator"), w16_locator, undefined, Duik.Layer.Type.LOCATOR);
    typeSelector.addButton( i18n._("Effector"), w16_effector, undefined, Duik.Layer.Type.EFFECTOR);
    typeSelector.addButton( i18n._("Audio"), w16_audio, undefined, Duik.Layer.Type.AUDIO);
    typeSelector.addButton( i18n._("Art"), w16_paint, undefined, Duik.Layer.Type.ART);
    typeSelector.addButton( i18n._("Null"), w16_null, undefined, Duik.Layer.Type.NULL);
    typeSelector.addButton( i18n._("Solid"), w16_solid, undefined, Duik.Layer.Type.SOLID);
    typeSelector.addButton( i18n._("Adjustment"), w16_adjustment, undefined, Duik.Layer.Type.ADJUSTMENT);
    typeSelector.setCurrentIndex(0);
    return typeSelector;
}

function createMoveAnchorPointButton(toolsGroup) {
    var moveAnchorPointButton = toolsGroup.addButton(
        i18n._("Move anchor points"),
        w12_move_anchor_point,
        i18n._("Reposition the anchor points of all selected layers.")
    );
    return moveAnchorPointButton;
}

function createBoneTypeSelector(container) {
    var boneTypeSelector = DuScriptUI.selector( container );
    boneTypeSelector.addButton( { text: i18n._("Use Full bones (with envelop and noodle)"), image: w16_bone } );
    boneTypeSelector.addButton( { text: i18n._("Use Light bones"), image: w16_bone_light } );
    boneTypeSelector.onChange = function() {
        var type = 'full';
        if (boneTypeSelector.index == 1 ) type = 'light';
        OCO.config.set('after effects/bone layer type', type);
    };
    var index = 0;
    if (OCO.config.get("after effects/bone layer type", 'full') == 'light') index = 1;
    boneTypeSelector.setCurrentIndex( index );
    return boneTypeSelector;
}

function buildMoveAnchorPointGroup(moveAnchorPointGroup, mainGroup) {

    createSubPanel(
        moveAnchorPointGroup,
        i18n._("Move anchor points"),
        mainGroup,
        false
    );

    var maskButton = DuScriptUI.checkBox(
        moveAnchorPointGroup,
        i18n._("Include masks"),
        w16_mask,
        i18n._("Use the masks too to compute the bounds of the layers when repositionning the anchor point.")
    );

    var gridGroup = DuScriptUI.group(moveAnchorPointGroup, 'row');
    gridGroup.alignment = ['center', 'top'];
    var column1 = DuScriptUI.group(gridGroup, 'column');
    var column2 = DuScriptUI.group(gridGroup, 'column');
    var column3 = DuScriptUI.group(gridGroup, 'column');

    var tlButton = DuScriptUI.button(
        column1,
        '',
        w12_move_tl
    );
    tlButton.onClick = function() {
        Duik.Constraint.moveAnchorPoint(DuMath.Location.TOP_LEFT, marginsSlider.value, maskButton.checked);
    };
    var lButton = DuScriptUI.button(
        column1,
        '',
        w12_move_l
    );
    lButton.onClick = function() {
        Duik.Constraint.moveAnchorPoint(DuMath.Location.LEFT, marginsSlider.value, maskButton.checked);
    };
    var blButton = DuScriptUI.button(
        column1,
        '',
        w12_move_bl
    );
    blButton.onClick = function() {
        Duik.Constraint.moveAnchorPoint(DuMath.Location.BOTTOM_LEFT, marginsSlider.value, maskButton.checked);
    };

    var tButton = DuScriptUI.button(
        column2,
        '',
        w12_move_t
    );
    tButton.onClick = function() {
        Duik.Constraint.moveAnchorPoint(DuMath.Location.TOP, marginsSlider.value, maskButton.checked);
    };
    var cButton = DuScriptUI.button(
        column2,
        '',
        w12_center
    );
    cButton.onClick = function() {
        Duik.Constraint.moveAnchorPoint(DuMath.Location.CENTER, marginsSlider.value, maskButton.checked);
    };
    var bButton = DuScriptUI.button(
        column2,
        '',
        w12_move_b
    );
    bButton.onClick = function() {
        Duik.Constraint.moveAnchorPoint(DuMath.Location.BOTTOM, marginsSlider.value, maskButton.checked);
    };

    var trButton = DuScriptUI.button(
        column3,
        '',
        w12_move_tr
    );
    trButton.onClick = function() {
        Duik.Constraint.moveAnchorPoint(DuMath.Location.TOP_RIGHT, marginsSlider.value, maskButton.checked);
    };
    var rButton = DuScriptUI.button(
        column3,
        '',
        w12_move_r
    );
    rButton.onClick = function() {
        Duik.Constraint.moveAnchorPoint(DuMath.Location.RIGHT, marginsSlider.value, maskButton.checked);
    };
    var brButton = DuScriptUI.button(
        column3,
        '',
        w12_move_br
    );
    brButton.onClick = function() {
        Duik.Constraint.moveAnchorPoint(DuMath.Location.BOTTOM_RIGHT, marginsSlider.value, maskButton.checked);
    };

    var marginsSlider = DuScriptUI.slider(
        moveAnchorPointGroup,
        0,
        -500,
        500,
        'column',
        false,
        i18n._("Margin") + ": ",
        ' ' + DuAE.UnitText.PIXELS
    );
    
    moveAnchorPointGroup.built = true;
    DuScriptUI.showUI(moveAnchorPointGroup);
}

function buildEffectorMapGroup(effectorMapGroup, mainGroup) {

    var titleBar = createSubPanel(
        effectorMapGroup,
        i18n._("Pick texture"),
        mainGroup,
        false
    );

    var mapLabel = effectorMapGroup.add('statictext', undefined, i18n._("Select the layer (texture/map)") + ':');
    mapLabel.enabled = false;
    effectorMapGroup.layerSelector = DuScriptUI.layerSelector( effectorMapGroup, i18n._("Select the layer (texture) to use as an effector.") );

    var connectButton = DuScriptUI.button(
        effectorMapGroup,
        i18n._("Connect properties"),
        w16_props,
        i18n._("Connects the selected properties to the control you've just set."),
        false,
        'column',
        'center'
    );
    connectButton.onClick = function() {
        var comp = DuAEProject.getActiveComp();
        if (!comp) return;

        var layerIndex = effectorMapGroup.layerSelector.index;
        if (layerIndex < 1 || layerIndex > comp.numLayers) return;

        DuAE.beginUndoGroup( i18n._("Effector map"));

        var props = DuAEComp.getSelectedProps();

        Duik.Automation.effectorMap( comp.layer(layerIndex), props);

        DuAE.endUndoGroup();
    }

    effectorMapGroup.built = true;
    DuScriptUI.showUI(effectorMapGroup);
}

function createAlignButton(container) {
    var alignButton = container.addButton(
        i18n._("Align layers"),
        w12_h_align,
        i18n._("Align layers.") + '\n' +
            i18n._("All selected layers will be aligned\nto the last selected one."),
        true
    );
    alignButton.optionsPopup.build = function() {
        var posButton = DuScriptUI.checkBox(
            alignButton.optionsPanel,
            i18n._("Position"),
            w16_move
        );
        var rotButton = DuScriptUI.checkBox(
            alignButton.optionsPanel,
            i18n._("Rotation"),
            w16_rotate
        );
        var scaButton = DuScriptUI.checkBox(
            alignButton.optionsPanel,
            i18n._("Scale"),
            w16_scale
        );
        var opaButton = DuScriptUI.checkBox(
            alignButton.optionsPanel,
            i18n._("Opacity"),
            w16_opacity
        );

        posButton.setChecked(true);
        rotButton.setChecked(true);
        scaButton.setChecked(true);

        DuScriptUI.staticText(alignButton.optionsPanel, i18n._("All selected layers will be aligned\nto the last selected one."));

        alignButton.onClick = function() {
            Duik.Constraint.alignLayers(
                posButton.checked,
                rotButton.checked,
                scaButton.checked,
                opaButton.checked
            )
        }
    }
}

function setSideSelector(selector, side) {
    if (side == OCO.Side.NONE) selector.setCurrentIndex(0);
    else if (side == OCO.Side.LEFT) selector.setCurrentIndex(1);
    else if (side == OCO.Side.RIGHT) selector.setCurrentIndex(2);

}

function setLocationSelector(selector, location) {
    if (location == OCO.Location.NONE) selector.setCurrentIndex(0);
    else if (location == OCO.Location.FRONT) selector.setCurrentIndex(1);
    else if (location == OCO.Location.BACK) selector.setCurrentIndex(2);
    else if (location == OCO.Location.MIDDLE) selector.setCurrentIndex(3);
    else if (location == OCO.Location.ABOVE) selector.setCurrentIndex(4);
    else if (location == OCO.Location.UNDER) selector.setCurrentIndex(5);
    else if (location == OCO.Location.TAIL) selector.setCurrentIndex(6);

}

function getSide(selector) {
    var side = OCO.Side.NONE;
    if (selector.index == 1) side = OCO.Side.LEFT;
    else if (selector.index == 2) side = OCO.Side.RIGHT;
    return side;
}

function getLocation(selector) {
    var location = OCO.Location.NONE;
    if (selector.index == 1) location = OCO.Location.FRONT;
    else if (selector.index == 2) location = OCO.Location.BACK;
    else if (selector.index == 3) location = OCO.Location.MIDDLE;
    else if (selector.index == 4) location = OCO.Location.ABOVE;
    else if (selector.index == 5) location = OCO.Location.UNDER;
    else if (selector.index == 6) location = OCO.Location.TAIL;
    return location;
}

function createKleanerButton( container ) {
    var kleanerGroup = DuScriptUI.multiButton(
            container,
            i18n._("Kleaner"), /// TRANSLATORS: contraction of Keyframe cLEANER. Fee free to find something funny in your language. i.e. ES: Climpiador, FR: Clétoyeur
            w16_kleaner,
            i18n._("Clean Keyframes.\nAutomates the animation process, and makes it easier to control:\n- Anticipation\n- Motion interpolation\n- Overlap\n- Follow through or Bounce\n- Soft Body simulation\n")
        );
    kleanerGroup.build = function() {
        var aliveButton = this.addButton(
            i18n._("Alive (anticipation + interpolation + follow through)"),
            undefined,
            i18n._("The default animation, with anticipation, motion interpolation and follow through.")
        );
        var inanimateButton = this.addButton(
            i18n._("Inanimate (interpolation + follow through)"),
            undefined,
            i18n._("For inanimate objects.\nDeactivate the anticipation.")
        );
        var trueStopButton = this.addButton(
            i18n._("True stop (anticipation + interpolation)"),
            undefined,
            i18n._("Deactivate the follow through animation.")
        );
        var exactButton = this.addButton(
            i18n._("Exact keyframes (interpolation only)"),
            undefined,
            i18n._("Deactivates anticipation and follow through, and use the exact keyframe values.\nGenerate only the motion interpolation.")
        );
        var springButton = this.addButton(
            i18n._("Spring (follow through only)"),
            undefined,
            i18n._("Use AE keyframe interpolation and just animate the follow through.")
        );
        var springLightButton = this.addButton(
            i18n._("Spring (no simulation)"),
            undefined,
            i18n._("A lighter version of the spring, which works only if the property has it's own keyframes.\nMotion from parent layers or the anchor point of the layer itself will be ignored.")
        );
        var bounceButton = this.addButton(
            i18n._("Bounce (follow through only)"),
            undefined,
            i18n._("Use AE keyframe interpolation and just animate a bounce at the end.")
        );
        var bounceLightButton = this.addButton(
            i18n._("Bounce (no simulation)"),
            undefined,
            i18n._("A lighter version of the spring, which works only if the property has it's own keyframes.\nMotion from parent layers or the anchor point of the layer itself will be ignored.")
        );
        var limitsButton = this.addButton(
            i18n._("Limits"),
            undefined,
            i18n._("Limit the value the property can get.")
        )

        function hasPathInSelection() {
            var props = DuAEComp.getSelectedProps()
            for(var i = 0; i < props.length; i++) {
                if (props[i].isPath()) {
                    alert("A path has been found in the selected properties, but the Kleaner can't work on path properties.\n\n"+
                        "You can add Duik Pins to rig the path though, and then use the Kleaner on with the pins."
                  );
                  return true;
                }   
            }
            return false;
        }

        aliveButton.onClick = function() {
            if (hasPathInSelection()) return;
            Duik.Automation.kleaner();
        };

        inanimateButton.onClick = function() {
            if (hasPathInSelection()) return;

            DuAE.beginUndoGroup( i18n._("Kleaner"));
            var effect = Duik.Automation.kleaner();

            var i = Duik.PseudoEffect.KLEANER.props; 
            effect(i['Will'].index).setValue(0);
            effect(i['Anticipation']['Anticipation'].index).setValue(0);
            DuAE.endUndoGroup();
        };

        trueStopButton.onClick = function() {
            if (hasPathInSelection()) return;

            DuAE.beginUndoGroup( i18n._("Kleaner"));
            var effect = Duik.Automation.kleaner();

            var i = Duik.PseudoEffect.KLEANER.props; 
            effect(i['Follow through']['Flexibility'].index).setValue(0);
            DuAE.endUndoGroup();
        };

        exactButton.onClick = function() {
            if (hasPathInSelection()) return;

            DuAE.beginUndoGroup( i18n._("Kleaner"));
            var effect = Duik.Automation.kleaner();

            var i = Duik.PseudoEffect.KLEANER.props
            effect(i['Anticipation']['Anticipation'].index).setValue(0);
            effect(i['Follow through']['Flexibility'].index).setValue(0);
            effect(i['Overlap']['Overlap'].index).setValue(0);
            effect(i['Soft body']['Flexibility'].index).setValue(0);
            DuAE.endUndoGroup();
        };

        springButton.onClick = function() {
            if (hasPathInSelection()) return;

            DuAE.beginUndoGroup( i18n._("Kleaner"));
            var effect = Duik.Automation.kleaner();

            var i = Duik.PseudoEffect.KLEANER.props; 
            effect(i['Anticipation']['Anticipation'].index).setValue(0);
            effect(i['Motion interpolation']['Motion interpolation'].index).setValue(0);
            effect(i['Overlap']['Overlap'].index).setValue(0);
            DuAE.endUndoGroup();
        };

        springLightButton.onClick = function() {
            if (hasPathInSelection()) return;

            DuAE.beginUndoGroup( i18n._("Kleaner"));
            var effect = Duik.Automation.kleaner();

            var i = Duik.PseudoEffect.KLEANER.props; 
            effect(i['Size'].index).setValue(0);
            effect(i['Weight'].index).setValue(0);
            effect(i['Strength'].index).setValue(0);
            effect(i['Will'].index).setValue(0);
            effect(i['Flexibility'].index).setValue(0);
            effect(i['Friction'].index).setValue(0);
            effect(i['Anticipation']['Anticipation'].index).setValue(0);
            effect(i['Motion interpolation']['Motion interpolation'].index).setValue(0);
            effect(i['Overlap']['Overlap'].index).setValue(0);
            effect(i['Performance']['Always disable simulations'].index).setValue(1);
            effect(i['Performance']['Disable general parameters'].index).setValue(1);
            DuAE.endUndoGroup();
        };

        bounceButton.onClick = function() {
            if (hasPathInSelection()) return;

            DuAE.beginUndoGroup( i18n._("Kleaner"));
            var effect = Duik.Automation.kleaner();

            var i = Duik.PseudoEffect.KLEANER.props; 
            effect(i['Anticipation']['Anticipation'].index).setValue(0);
            effect(i['Motion interpolation']['Motion interpolation'].index).setValue(0);
            effect(i['Overlap']['Overlap'].index).setValue(0);
            effect(i['Follow through']['Bounce'].index).setValue(1);
            DuAE.endUndoGroup();
        };

        bounceLightButton.onClick = function() {
            if (hasPathInSelection()) return;

            DuAE.beginUndoGroup( i18n._("Kleaner"));

            var effect = Duik.Automation.kleaner();

            var i = Duik.PseudoEffect.KLEANER.props; 
            effect(i['Size'].index).setValue(0);
            effect(i['Weight'].index).setValue(0);
            effect(i['Strength'].index).setValue(0);
            effect(i['Will'].index).setValue(0);
            effect(i['Flexibility'].index).setValue(0);
            effect(i['Friction'].index).setValue(0);
            effect(i['Anticipation']['Anticipation'].index).setValue(0);
            effect(i['Motion interpolation']['Motion interpolation'].index).setValue(0);
            effect(i['Overlap']['Overlap'].index).setValue(0);
            effect(i['Performance']['Always disable simulations'].index).setValue(1);
            effect(i['Performance']['Disable general parameters'].index).setValue(1);
            effect(i['Follow through']['Bounce'].index).setValue(1);

            DuAE.endUndoGroup();
        };

        limitsButton.onClick = function() {
            if (hasPathInSelection()) return;

            DuAE.beginUndoGroup( i18n._("Kleaner"));

            var effect = Duik.Automation.kleaner();

            var i = Duik.PseudoEffect.KLEANER.props; 
            effect(i['Anticipation']['Anticipation'].index).setValue(0);
            effect(i['Motion interpolation']['Motion interpolation'].index).setValue(0);
            effect(i['Follow through']['Flexibility'].index).setValue(0);
            effect(i['Overlap']['Overlap'].index).setValue(0);
            effect(i['Soft body']['Flexibility'].index).setValue(0);
            effect(i['Limits']['Use minimum limit'].index).setValue(1);
            effect(i['Limits']['Use maximum limit'].index).setValue(1);
            effect(i['Limits']['Minimum limit'].index).setValue([-100,-100,-100]);
            effect(i['Limits']['Maximum limit'].index).setValue([100,100,100]);
            effect(i['Limits']['Limit softness'].index).setValue(10);

            DuAE.endUndoGroup();
        };
    };
}

function createSubPanel( container, title, mainGroup, pinButton ) {
    pinButton = def(pinButton, true);
    
    container.built = true;

    //DuScriptUI.separator(container);

    var titleBar = DuScriptUI.titleBar( container, title, true, pinButton);
    titleBar.onClose = function() {
        container.visible = false;
        mainGroup.visible = true;
    };

    return titleBar;
}

function addValidButton( container, title, tip, icon ) {
    icon = def(icon, DuScriptUI.Icon.CHECK);
    DuScriptUI.separator( container );
    var validButton = DuScriptUI.button(
        container,
        title,
        DuScriptUI.Icon.CHECK,
        tip,
        false,
        'row',
        'center'
    );
    return validButton;
}

function createXSheetButton( container ){
    var xSheetButton = DuScriptUI.button(
        container,
        i18n._("X-Sheet"),
        w16_x_sheet,
        i18n._("Adjusts the exposure of the animation\n(changes and animates the framerate)\n\n[Ctrl]: (Try to) auto-compute the best values.")
    );
    xSheetButton.onClick = Duik.Animation.xSheet;
    xSheetButton.onCtrlClick = function() { Duik.Animation.xSheet(true) };
}

function createAutorigButton( container ){
    var autorigButton = DuScriptUI.button(
        container,
        i18n._("Auto-rig"),
        w16_autorig,
        i18n._("Automatically rig armatures (use the Links & constraints tab for more options)."),
        true
    );
    autorigButton.optionsPopup.build = function()
    {
        DuScriptUI.staticText( autorigButton.optionsPanel, i18n._("3-Layer rig:") );
        var threeLayerSelector = DuScriptUI.selector( autorigButton.optionsPanel );
        threeLayerSelector.addButton(
            i18n._("1+2-layer IK"),
            w16_one_two_ik,
            i18n._("Create a one-layer IK combined with a two-layer IK\nto handle Z-shape limbs.")
        );
        threeLayerSelector.addButton(
            i18n._("2+1-layer IK"),
            w16_two_one_ik,
            i18n._("Create a two-layer IK combined with a one-layer IK\nto handle Z-shape limbs.")
        );
        threeLayerSelector.addButton(
            i18n._("FK"),
            w16_fk,
            i18n._("Forward Kinematics\nwith automatic overlap and follow-through.")
        );
        threeLayerSelector.addButton(
            i18n._("B\u00e9zier IK"),
            w16_bezier_ik,
            i18n._("B\u00e9zier Inverse Kinematics.")
        );
        threeLayerSelector.addButton(
            i18n._("B\u00e9zier FK"),
            w16_bezier_fk,
            i18n._("B\u00e9zier FK")
        );
        threeLayerSelector.onChange = function() {
            DuESF.scriptSettings.set("autorig/threeLayerMode", threeLayerSelector.index);
            DuESF.scriptSettings.save();
        };

        DuScriptUI.staticText( autorigButton.optionsPanel, i18n._("Long chain rig:") );
        var longSelector = DuScriptUI.selector( autorigButton.optionsPanel );
        longSelector.addButton(
            i18n._("FK"),
            w16_fk,
            i18n._("Forward Kinematics\nwith automatic overlap and follow-through.")
        );
        longSelector.addButton(
            i18n._("B\u00e9zier IK"),
            w16_bezier_ik,
            i18n._("B\u00e9zier Inverse Kinematics.")
        );
        longSelector.addButton(
            i18n._("B\u00e9zier FK"),
            w16_bezier_fk,
            i18n._("B\u00e9zier FK")
        );
        longSelector.onChange = function() {
            DuESF.scriptSettings.set("autorig/longMode", longSelector.index);
            DuESF.scriptSettings.save();
        };

        var createMasterButton = DuScriptUI.checkBox( autorigButton.optionsPanel, {
            text: i18n._("Create a root controller")
        });
        createMasterButton.onClick = function() {
            DuESF.scriptSettings.set("autorig/createMaster", createMasterButton.checked);
            DuESF.scriptSettings.save();
        };
        DuScriptUI.staticText( autorigButton.optionsPanel, i18n._("Baking:") );
        var bakeBonesButton = DuScriptUI.checkBox( autorigButton.optionsPanel, {
            text: i18n._("Bake bones")
        });
        bakeBonesButton.onClick = function() {
            DuESF.scriptSettings.set("autorig/bakeBones", bakeBonesButton.checked);
            DuESF.scriptSettings.save();
        };
        var bakeEnvelopsButton = DuScriptUI.checkBox( autorigButton.optionsPanel, {
            text: i18n._("Bake envelops")
        });
        bakeEnvelopsButton.onClick = function() {
            DuESF.scriptSettings.set("autorig/bakeEnvelops", bakeEnvelopsButton.checked);
            DuESF.scriptSettings.save();
        };
        var bakeNoodlesButton = DuScriptUI.checkBox( autorigButton.optionsPanel, {
            text: i18n._("Remove deactivated noodles.")
        });
        bakeNoodlesButton.onClick = function() {
            DuESF.scriptSettings.set("autorig/removeNoodles", bakeNoodlesButton.checked);
            DuESF.scriptSettings.save();
        };

        // Restore indices
        threeLayerSelector.setCurrentIndex( DuESF.scriptSettings.get("autorig/threeLayerMode" , 0) );
        longSelector.setCurrentIndex( DuESF.scriptSettings.get("autorig/longMode" , 0) );
        createMasterButton.setChecked( DuESF.scriptSettings.get("autorig/createMaster" , false) );
        bakeBonesButton.setChecked( DuESF.scriptSettings.get("autorig/bakeBones" , true) );
        bakeEnvelopsButton.setChecked( DuESF.scriptSettings.get("autorig/bakeEnvelops" , true) );
        bakeNoodlesButton.setChecked( DuESF.scriptSettings.get("autorig/removeNoodles" , true) );

        autorigButton.onClick = function() {
            var threeMode = threeLayerSelector.index + 1;
            var longMode = longSelector.index + 3;

            //DuScriptUI.progressBar.reset();
            //DuScriptUI.progressBar.show();

            if (!DuAEProject.setProgressMode(true, true, true, [autorigButton.screenX, autorigButton.screenY] )) return;
            DuAE.beginUndoGroup( i18n._("Auto-rig") );

            Duik.Rig.auto(bakeBonesButton.checked, bakeEnvelopsButton.checked, bakeNoodlesButton.checked, longMode, threeMode, undefined, createMasterButton.checked);

            //DuScriptUI.progressBar.close();

            DuAE.endUndoGroup( i18n._("Auto-rig") );
            DuAEProject.setProgressMode(false);
        };
    }
    
    return autorigButton;
}

function createListButton( toolbar ) {
    var listButton = toolbar.addButton(
        i18n._("Add list"),
        w12_list,
        i18n._("Add a list to the selected properties.") + "\n\n" +
        i18n._("[Alt]: Adds a keyframe to the second slot (and quickly reveal it with [U] in the timeline).")
    );
    listButton.onClick = Duik.Constraint.list;
    listButton.onAltClick = function() { Duik.Constraint.list(true); };
}