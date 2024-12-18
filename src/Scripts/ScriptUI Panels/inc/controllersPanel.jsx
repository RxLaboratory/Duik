function buildControllersUI(tab, standAlone)
{
    standAlone = def(standAlone, false);

    if (!standAlone) {
        // UI

        // A Spacer
        var spacer = tab.add('group');
        spacer.margins = 0;
        spacer.spacing = 0;
        spacer.size = [-1,3];
        
        // A title
        DuScriptUI.staticText( tab, i18n._("Controllers") ).alignment = ['center', 'top'];
    }

    // tools
    var toolsGroup = DuScriptUI.toolBar( tab );

    var selectButton = toolsGroup.addButton(
        i18n._("Select controllers"),
        w12_select,
        i18n._("Select all controllers")
    );
    selectButton.onClick = Duik.Controller.select;

    var showButton = toolsGroup.addButton(
        i18n._("Show/hide ctrls"),
        w12_show,
        i18n._("Show/Hide controllers\n\n[Alt]: Only the unselected controllers.")
    );
    showButton.onClick = Duik.Controller.toggleVisibility;
    showButton.onAltClick = function( ) { Duik.Controller.toggleVisibility(undefined, true); };

    var tagButton = toolsGroup.addButton(
        i18n._("Tag as ctrls"),
        w12_tag,
        i18n._("Tag as controllers")
    );
    tagButton.onClick = Duik.Controller.tag;

    var bakeButton = toolsGroup.addButton(
        i18n._("Bake controllers"),
        w12_bake,
        i18n._("Bake controllers appearance")
    );
    bakeButton.onClick = Duik.Controller.bake;

    var editButton = toolsGroup.addButton(
        i18n._("Controller settings"),
        DuScriptUI.Icon.SETTINGS,
        i18n._("Edit selected controllers.")
    );
    editButton.onClick = function()
    {
        if (!editGroup.built) {
            function setSide()
            {
                var side = getSide(sideEditSelector);
                Duik.Controller.setSide(side);
            }

            function setLocation()
            {
                var location = getLocation(locationEditSelector);
                Duik.Controller.setLocation(location);
            }

            function setColor( allRandom )
            {
                var color = colorEditSelector.color;
                if (allRandom) color = null;
                Duik.Controller.setColor(color);
            }

            function setSize()
            {
                var size = parseInt( sizeEdit.text );
                if (isNaN(size)) return;
                Duik.Controller.setSize(size);
            }

            function setOpacity()
            {
                var opacity = parseInt( opacityEdit.text );
                if (isNaN(opacity)) return;
                Duik.Controller.setOpacity(opacity);
            }

            function setAColor( allRandom ) {
                var color = colorAEditSelector.color;
                if (allRandom) color = null;
                Duik.Controller.setAnchorColor(color);
            }

            function setASize() {
                var size = parseInt( sizeAEdit.text );
                if (isNaN(size)) return;
                Duik.Controller.setAnchorSize(size);
            }

            function setAOpacity() {
                var opacity = parseInt( opacityAEdit.text );
                if (isNaN(opacity)) return;
                Duik.Controller.setAnchorOpacity(opacity);
            }
            
            function setCharacterName()
            {
                Duik.Controller.setCharacterName( characterEdit.text );
            }

            function setLimbName()
            {
                Duik.Controller.setLimbName( limbEdit.text );
            }
            
            var titleBar = createSubPanel(
                editGroup,
                i18n._("Controller settings"),
                mainGroup,
                false
            )

            var ctrlTypeSelector = DuScriptUI.selector( editGroup );
            ctrlTypeSelector.addButton( { text: i18n._("Use AE Null Objects"), image: w16_ae_null } );
            ctrlTypeSelector.addButton( { text: i18n._("Use Shape Layers"), image: w16_controller } );
            ctrlTypeSelector.addButton( { text: i18n._("Use Shape Layers (Draft mode)"), image: w16_controller_draft } );
            ctrlTypeSelector.addButton( { text: i18n._("Use Raster Layers (PNG)"), image: w16_controller_raster } );
            ctrlTypeSelector.onChange = function() {
                var index = ctrlTypeSelector.index;
                OCO.config.set('after effects/controller layer type', index);
            };
            ctrlTypeSelector.setCurrentIndex( OCO.config.get('after effects/controller layer type', 1) );

            var scaleButton = DuScriptUI.checkBox( editGroup, {
                text: i18n._("Don't lock scale of null controllers."),
                helpTip: i18n._("The scale of null controllers, and After Effects nulls as controllers created by Duik won't be locked by default."),
            });
            scaleButton.setChecked( !DuESF.scriptSettings.get('controllers/lockNullScale', true) );
            scaleButton.onClick = function() {
                DuESF.scriptSettings.set('controllers/lockNullScale', !scaleButton.checked);
                DuESF.scriptSettings.save();
            }

            DuScriptUI.separator( editGroup, uiMode <= 1 ? i18n._("Current Selection") : '' );

            var sideEditGroup = addSetting(editGroup, i18n._("Side"));
            var sideEditSelector = createSideSelector( sideEditGroup );

            var locationEditGroup = addSetting(editGroup, i18n._("Location"));
            var locationEditSelector = createLocationSelector( locationEditGroup );

            DuScriptUI.separator( editGroup );

            var colorEditGroup = addSetting(editGroup, i18n._("Icon color"));
            var colorEditSelector = DuScriptUI.colorSelector( colorEditGroup, i18n._("Set the color of the selected controllers.\n\n[Alt]: assigns a random color for each controller.") );

            var sizeEditGroup = addSetting(editGroup, i18n._("Icon size"));
            var sizeEdit = DuScriptUI.editText( sizeEditGroup, {
                text: "100",
                placeHolder: "100",
                suffix: "%",
                helpTip: i18n._("Change the size of the controller."),
                localize: false
            });

            var opacityEditGroup = addSetting(editGroup, i18n._("Icon opacity"));
            var opacityEdit = DuScriptUI.editText(  opacityEditGroup, {
                text: "100",
                suffix: " %",
                placeHolder: "100",
                helpTip: i18n._("Change the opacity of the controllers."),
                localize: false
            });

            DuScriptUI.separator( editGroup );

            var colorAEditGroup = addSetting(editGroup, i18n._("Anchor color"));
            var colorAEditSelector = DuScriptUI.colorSelector( colorAEditGroup, i18n._("Set the color of the selected anchors.\n\n[Alt]: assigns a random color for each anchor.") );

            var sizeAEditGroup = addSetting(editGroup, i18n._("Anchor size"));
            var sizeAEdit = DuScriptUI.editText( sizeAEditGroup, {
                text: "100",
                placeHolder: "100",
                suffix: "%",
                helpTip: i18n._("Change the size of the anchor."),
                localize: false
            });

            var opacityAEditGroup = addSetting(editGroup, i18n._("Anchor opacity"));
            var opacityAEdit = DuScriptUI.editText(  opacityAEditGroup, {
                text: "100",
                suffix: " %",
                placeHolder: "100",
                helpTip: i18n._("Change the opacity of the anchors."),
                localize: false
            });

            DuScriptUI.separator( editGroup );

            var characterEditGroup = addSetting(editGroup, i18n._("Group name"));
            var characterEdit = DuScriptUI.editText( characterEditGroup, {
                text: '',
                placeHolder: i18n._("Character / Group name"),
                helpTip: i18n._("Choose the name of the character.")
            });
            characterEdit.alignment = ['fill','fill'];

            var limbEditGroup = addSetting(editGroup, i18n._("Name"));
            var limbEdit = DuScriptUI.editText( limbEditGroup, {
                text: '',
                placeHolder: i18n._("(Limb) Name"),
                helpTip: i18n._("Change the name of the limb this layer belongs to")
            });
            limbEdit.alignment = ['fill','fill'];

            DuScriptUI.separator( editGroup );

            var applyGroup = DuScriptUI.group( editGroup, 'row' );

            var pickButton = DuScriptUI.button( applyGroup, {
                text: i18n._("Pick selected layer"),
                image: DuScriptUI.Icon.EYE_DROPPER,
                alignment: 'center'
            });

            // Valid button
            var applyEditButton = DuScriptUI.button( applyGroup, {
                text: i18n._("Apply"),
                image: DuScriptUI.Icon.CHECK,
                helpTip: i18n._("Apply changes.\n\n[Alt]: assigns a random color to each layer."),
                alignment: 'center'
            });
            applyEditButton.onClick = function ()
            {
                DuAE.beginUndoGroup(i18n._("Edit Controllers"));
                if (sideEditGroup.checked) setSide();
                if (locationEditGroup.checked) setLocation();
                if (colorEditGroup.checked) setColor();
                if (sizeEditGroup.checked) setSize();
                if (opacityEditGroup.checked) setOpacity();
                if (colorAEditGroup.checked) setAColor();
                if (sizeAEditGroup.checked) setASize();
                if (opacityAEditGroup.checked) setAOpacity();
                if (characterEditGroup.checked) setCharacterName();
                if (limbEditGroup.checked) setLimbName();
                DuAE.endUndoGroup();
            };
            applyEditButton.onAltClick = function()
            {
                DuAE.beginUndoGroup(i18n._("Edit Controllers"));
                if (sideEditGroup.checked) setSide();
                if (locationEditGroup.checked) setLocation();
                if (colorEditGroup.checked) setColor(true);
                if (sizeEditGroup.checked) setSize();
                if (opacityEditGroup.checked) setOpacity();
                if (colorAEditGroup.checked) setAColor(true);
                if (sizeAEditGroup.checked) setASize();
                if (opacityAEditGroup.checked) setAOpacity();
                if (characterEditGroup.checked) setCharacterName();
                if (limbEditGroup.checked) setLimbName();
                DuAE.endUndoGroup();
            }

            editGroup.refresh = function ()
            {
                setSideSelector( sideEditSelector, Duik.Layer.side() );

                setLocationSelector( locationEditSelector, Duik.Layer.location());

                colorEditSelector.setColor( Duik.Controller.color( ) );

                sizeEdit.setText( Duik.Controller.size() );

                opacityEdit.setText( Duik.Controller.opacity() );

                colorAEditSelector.setColor( Duik.Controller.anchorColor( ) );

                sizeAEdit.setText( Duik.Controller.anchorSize() );

                opacityAEdit.setText( Duik.Controller.anchorOpacity() );

                characterEdit.setText( Duik.Layer.groupName() );

                limbEdit.setText( Duik.Layer.name() );
            };

            pickButton.onClick = editGroup.refresh;

            DuScriptUI.showUI(editGroup);
        }
        //updateEditPanel();
        mainGroup.visible = false;
        editGroup.visible = true;
    }

    // Main stack

    var stackGroup = DuScriptUI.group( tab, 'stacked');
    stackGroup.alignment = ['fill','fill'];

    // Main group
    var mainGroup = DuScriptUI.group( stackGroup, 'column');
    mainGroup.alignment = ['fill','fill'];

    // Controllers

    // A Spacer
    var spacer = mainGroup.add('group');
    spacer.margins = 0;
    spacer.spacing = 0;
    spacer.size = [-1,3];

    var line1 = DuScriptUI.group( mainGroup, 'row');
    //line1.alignment = [ 'center', 'top'];

    var rotateButton = createCtrlButton(
        line1,
        w16_rotate,
        i18n._("Create a rotation controller."),
        Duik.Controller.Type.ROTATION
        );

    var moveHButton = createCtrlButton(
        line1,
        w16_move_h,
        i18n._("Create a horizontal translation controller."),
        Duik.Controller.Type.X_POSITION
        );
    var moveVButton = createCtrlButton(
        line1,
        w16_move_v,
        i18n._("Create a vertical translation controller."),
        Duik.Controller.Type.Y_POSITION
        );
    var moveButton = createCtrlButton(
        line1,
        w16_move,
        i18n._("Create a translation controller."),
        Duik.Controller.Type.POSITION
        );
    var moveRotateButton = createCtrlButton(
        line1,
        w16_move_rotate,
        i18n._("Create a translation and rotation controller."),
        Duik.Controller.Type.TRANSFORM
        );

    var line2 = DuScriptUI.group( mainGroup, 'row');
    //line2.alignment = [ 'center', 'top'];

    var cameraButton = createCtrlButton(
        line2,
        w16_camera,
        i18n._("Create a camera controller."),
        Duik.Controller.Type.CAMERA
        );
    var sliderButton = createCtrlButton(
        line2,
        w16_slider,
        i18n._("Creates a slider controller."),
        Duik.Controller.Type.SLIDER
        );
    var slider2DButton = createCtrlButton(
        line2,
        w16_2d_slider,
        i18n._("Create a 2D slider controller."),
        Duik.Controller.Type.DOUBLE_SLIDER
        );
    var angleButton = createCtrlButton(
        line2,
        w16_angle,
        i18n._("Create an angle controller."),
        Duik.Controller.Type.ANGLE
        );
    var eyebrowButton = createCtrlButton(
        line2,
        w16_eyebrow,
        i18n._("Create an eyebrow controller."),
        Duik.Controller.Type.EYEBROW
        );

    var line3 = DuScriptUI.group( mainGroup, 'row');
    //line3.alignment = [ 'center', 'top'];

    var earButton = createCtrlButton(
        line3,
        w16_ear,
        i18n._("Creates an ear controller."),
        Duik.Controller.Type.EAR
        );
    var hairButton = createCtrlButton(
        line3,
        w16_hair,
        i18n._("Create a hair controller."),
        Duik.Controller.Type.HAIR
        );
    var mouthButton = createCtrlButton(
        line3,
        w16_mouth,
        i18n._("Create a mouth controller."),
        Duik.Controller.Type.MOUTH
        );
    var noseButton = createCtrlButton(
        line3,
        w16_nose,
        i18n._("Create a nose controller."),
        Duik.Controller.Type.NOSE
        );
    var eyeButton = createCtrlButton(
        line3,
        w16_eye,
        i18n._("Create an eye controller."),
        Duik.Controller.Type.EYE
        );

    var line4 = DuScriptUI.group( mainGroup, 'row');
    //line4.alignment = [ 'center', 'top'];

    var headButton = createCtrlButton(
        line4,
        w16_head,
        i18n._("Create a head controller."),
        Duik.Controller.Type.HEAD
        );
    var footButton = createCtrlButton(
        line4,
        w16_foot,
        i18n._("Create a foot controller."),
        Duik.Controller.Type.FOOT
        );
    var pawButton = createCtrlButton(
        line4,
        w16_digitigrade,
        i18n._("Create a paw controller."),
        Duik.Controller.Type.CLAWS
        );
    var hoofButton = createCtrlButton(
        line4,
        w16_ungulate,
        i18n._("Create a hoof controller."),
        Duik.Controller.Type.HOOF
        );
    var handButton = createCtrlButton(
        line4,
        w16_controller,
        i18n._("Create a hand controller."),
        Duik.Controller.Type.HAND
        );

    var line5 = DuScriptUI.group( mainGroup, 'row');
    //line5.alignment = [ 'center', 'top'];

    var hipsButton = createCtrlButton(
        line5,
        w16_hips,
        i18n._("Create a hips controller."),
        Duik.Controller.Type.HIPS
        );
    var bodyButto = createCtrlButton(
        line5,
        w16_body,
        i18n._("Create a body controller."),
        Duik.Controller.Type.BODY
        );
    var shouldersButton = createCtrlButton(
        line5,
        w16_shoulders,
        i18n._("Create a neck and shoulders controller."),
        Duik.Controller.Type.SHOULDERS
        );
    var torsoButton = createCtrlButton(
        line5,
        w16_torso,
        i18n._("Create a torso controller."),
        Duik.Controller.Type.TORSO
        );
    var vertebraeButton = createCtrlButton(
        line5,
        w16_vertebrae,
        i18n._("Create a vertebrae (neck or spine) controller."),
        Duik.Controller.Type.VERTEBRAE
        );

    var line6 = DuScriptUI.group( mainGroup, 'row');
    //line6.alignment = [ 'center', 'top'];

    var finButton = createCtrlButton(
        line6,
        w16_fin,
        i18n._("Create a fin controller."),
        Duik.Controller.Type.FIN
        );
    var wingButton = createCtrlButton(
        line6,
        w16_wing,
        i18n._("Create a wing controller."),
        Duik.Controller.Type.WING
        );
    var pincerButton = createCtrlButton(
        line6,
        w16_arthropod,
        i18n._("Create a pincer controller."),
        Duik.Controller.Type.PINCER
        );
    var tailButton = createCtrlButton(
        line6,
        w16_tail_ctrl,
        i18n._("Create a tail controller."),
        Duik.Controller.Type.TAIL
        );
    var hairStrandButton = createCtrlButton(
        line6,
        w16_hair_strand,
        i18n._("Create a hair strand controller."),
        Duik.Controller.Type.PONEYTAIL
        );
    var line7 = DuScriptUI.group( mainGroup, 'row');
    //line7.alignment = [ 'center', 'top'];

    var audioButton = createCtrlButton(
        line7,
        w16_audio,
        i18n._("Create an audio controller."),
        Duik.Controller.Type.AUDIO
        );
    var nullButton = createCtrlButton(
        line7,
        w16_null,
        i18n._("Create a null controller."),
        Duik.Controller.Type.NULL
        );
    var aeNullButton = createCtrlButton(
        line7,
        w16_ae_null,
        i18n._("Create an After Effects null controller."),
        Duik.Controller.Type.AE_NULL
        );

    // Tools

    DuScriptUI.separator(mainGroup);

    // Pseudo Effects
	var fxButton = DuScriptUI.multiButton(
        mainGroup,
        i18n._("Pseudo-effects"),
        w16_fx,
        i18n._("Create pre-rigged pseudo-effects.")
    );
    fxButton.build = function()
    {
        var fxEyesButton = this.addButton(
            i18n._("Eyes"),
            w16_eye,
            i18n._("Create a pre-rigged pseudo-effect to control eyes.")
        );
        fxEyesButton.onClick = function () {
            Duik.Controller.pseudoEffect( Duik.Controller.PseudoEffect.EYES );
        }
        var fxFingersButton = this.addButton(
            i18n._("Fingers"),
            w16_fingers,
            i18n._("Create a pre-rigged pseudo-effect to control fingers.")
        );
        fxFingersButton.onClick = function () {
            Duik.Controller.pseudoEffect( Duik.Controller.PseudoEffect.FINGERS );
        }
        var fxHandButton = this.addButton(
            i18n._("Hand"),
            w16_controller,
            i18n._("Create a pre-rigged pseudo-effect to control a hand and its fingers.")
        );
        fxHandButton.onClick = function () {
            Duik.Controller.pseudoEffect( Duik.Controller.PseudoEffect.HAND );
        }
        var fxHeadButton = this.addButton(
            i18n._("Head"),
            w16_head,
            i18n._("Create a pre-rigged pseudo-effect to control a head.")
        );
        fxHeadButton.onClick = function () {
            Duik.Controller.pseudoEffect( Duik.Controller.PseudoEffect.HEAD );
        }
    }
    
    var extractButton = DuScriptUI.button(
        mainGroup,
        i18n._("Extract"),
        w16_extract,
        i18n._("Extract the controllers from the selected precomposition, to animate from outside the composition."),
        true
    );
    extractButton.optionsPopup.build = function ()
    {
        var extractModeSelector = DuScriptUI.selector( extractButton.optionsPanel );
        extractModeSelector.addButton(
            i18n._("Use expressions"),
            w16_expression
        );
        extractModeSelector.addButton(
            i18n._("Use essential properties"),
            w16_essential_property
        );
        if (DuAE.version.version  < 17.0) extractModeSelector.setCurrentIndex( 0 );
        else extractModeSelector.setCurrentIndex( 1 );

        var extractBakeButton = DuScriptUI.checkBox(
            extractButton.optionsPanel,
            i18n._("Bake controllers"),
            w16_bake
        );
        extractBakeButton.setChecked( true );

        extractButton.onClick = function() {

            var useEP = extractModeSelector.index == 1;
            var bake = extractBakeButton.checked;

            Duik.Controller.extract( undefined, useEP, bake);
        }
    }
    
    // Edit Group
    var editGroup = DuScriptUI.group( stackGroup, 'column');
    editGroup.visible = false;
    editGroup.built = false;
}