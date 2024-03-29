function buildLayerManagerUI( tab )
{
    tab = def(tab, this);
    var creationGroup = DuScriptUI.group(tab, 'row');
    DuScriptUI.setBackgroundColor( creationGroup, DuColor.Color.DARK_GREY );

    var nullButton = DuScriptUI.button(
        creationGroup,
        '',
        w16_null,
        i18n._("Create a null object.")
    );
    nullButton.alignment = ['left', 'top'];
    nullButton.onClick = function() {
        DuAE.beginUndoGroup( i18n._("Null") );
        DuAEProject.setProgressMode( true );
        DuAEComp.addNull();
        DuAEProject.setProgressMode( false );
        DuAE.endUndoGroup();
    };

    var solidButton = DuScriptUI.button(
        creationGroup,
        '',
        w16_solid,
        i18n._("Create a solid layer.")
    );
    solidButton.alignment = ['left', 'top'];
    solidButton.onClick = function() {
        DuAE.beginUndoGroup( i18n._("Solid") );
        DuAEProject.setProgressMode( true );
        DuAEComp.addSolid();
        DuAEProject.setProgressMode( false );
        DuAE.endUndoGroup();
    };

    var adjustmentButton = DuScriptUI.button(
        creationGroup,
        '',
        w16_adjustment,
        i18n._("Create an adjustment layer.")
    );
    adjustmentButton.alignment = ['left', 'top'];
    adjustmentButton.onClick = function() {
        DuAE.beginUndoGroup( i18n._("Adjustment layer") );
        DuAEProject.setProgressMode( true );
        DuAEComp.addAdjustmentLayer();
        DuAEProject.setProgressMode( false );
        DuAE.endUndoGroup();
    };

    DuScriptUI.separator( creationGroup );

    var circleButton = DuScriptUI.button(
        creationGroup,
        '',
        w16_circle,
        i18n._("Create a shape layer.")
    );
    circleButton.alignment = ['left', 'top'];
    circleButton.onClick = function() {
        DuAE.beginUndoGroup( i18n._("Circle") );
        DuAEProject.setProgressMode( true );
        DuAEComp.addShape(DuAEShapeLayer.Primitive.CIRCLE);
        DuAEProject.setProgressMode( false );
        DuAE.endUndoGroup();
    };

    var squareButton = DuScriptUI.button(
        creationGroup,
        '',
        w16_square,
        i18n._("Create a shape layer.")
    );
    squareButton.alignment = ['left', 'top'];
    squareButton.onClick = function() {
        DuAE.beginUndoGroup( i18n._("Square") );
        DuAEProject.setProgressMode( true );
        DuAEComp.addShape(DuAEShapeLayer.Primitive.SQUARE);
        DuAEProject.setProgressMode( false );
        DuAE.endUndoGroup();
    };

    var rounded_squareButton = DuScriptUI.button(
        creationGroup,
        '',
        w16_rounded_square,
        i18n._("Create a shape layer.")
    );
    rounded_squareButton.alignment = ['left', 'top'];
    rounded_squareButton.onClick = function() {
        DuAE.beginUndoGroup( i18n._("Rounded square") );
        DuAEProject.setProgressMode( true );
        DuAEComp.addShape(DuAEShapeLayer.Primitive.ROUNDED_SQUARE);
        DuAEProject.setProgressMode( false );
        DuAE.endUndoGroup();
    };

    var polyButton = DuScriptUI.button(
        creationGroup,
        '',
        w16_polygon,
        i18n._("Create a shape layer.")
    );
    polyButton.alignment = ['left', 'top'];
    polyButton.onClick = function() {
        DuAE.beginUndoGroup( i18n._("Polygon") );
        DuAEProject.setProgressMode( true );
        DuAEComp.addShape(DuAEShapeLayer.Primitive.POLYGON);
        DuAEProject.setProgressMode( false );
        DuAE.endUndoGroup();
    };

    var starButton = DuScriptUI.button(
        creationGroup,
        '',
        w16_star,
        i18n._("Create a shape layer.")
    );
    starButton.alignment = ['left', 'top'];
    starButton.onClick = function() {
        DuAE.beginUndoGroup( i18n._("Star") );
        DuAEProject.setProgressMode( true );
        DuAEComp.addShape(DuAEShapeLayer.Primitive.STAR);
        DuAEProject.setProgressMode( false );
        DuAE.endUndoGroup();
    };

    DuScriptUI.separator( creationGroup );

    var boneButton = DuScriptUI.button(
        creationGroup,
        '',
        w16_bone,
        i18n._("Add a custom armature.")
    );
    boneButton.alignment = ['left', 'top'];
    boneButton.onClick = function() {
        DuAE.beginUndoGroup( i18n._("Star") );
        DuAEProject.setProgressMode( true );
        Duik.Bone.customLimb(2, "Bones", "Character", OCO.Side.NONE, OCO.Location.NONE);
        DuAEProject.setProgressMode( false );
        DuAE.endUndoGroup();
    };

    var moveRotateButton = createCtrlButton(
        creationGroup,
        w16_move_rotate,
        i18n._("Create a translation and rotation controller."),
        Duik.Controller.Type.TRANSFORM
    );
    moveRotateButton.alignment = ['left', 'top'];

    var zeroButton = DuScriptUI.button(
        creationGroup,
        '',
        w16_zero,
        i18n._("Zero out the selected layers transformation.\n[Alt]: Reset the transformation of the selected layers to 0.\n[Ctrl] + [Alt]: Also resets the opacity to 100 %.")
    );
    zeroButton.alignment = ['left', 'top'];
    zeroButton.onClick = Duik.Constraint.zero;
    zeroButton.onAltClick = Duik.Constraint.resetPRS;
    zeroButton.onCtrlAltClick = function () { Duik.Constraint.resetPRS(undefined, true); };

    var locatorButton = DuScriptUI.button(
        creationGroup,
        '',
        w16_locator,
        i18n._("Create locator.")
    );
    locatorButton.alignment = ['left', 'top'];
    locatorButton.onClick = Duik.Constraint.locator;

    DuScriptUI.separator(tab);

    var sanitizeButton = DuScriptUI.button( tab, {
        text: i18n._("Auto-Rename & Tag"),
        image: w16_autorig,
        helpTip: i18n._("Automagically renames, tags and groups the selected layers (or all of them if there's no selection)")
    });
    sanitizeButton.onClick = function() {
        DuAE.beginUndoGroup(i18n._("Auto-Rename & Tag"));
        Duik.Layer.sanitize();
        DuAE.endUndoGroup();
    }
    
    DuScriptUI.separator(tab);

    var typeGroup = addSetting(tab, i18n._("Type"));
    var typeSelector = createTypeSelector( typeGroup );

    var locationEditGroup = addSetting(tab, i18n._("Location"));
    var locationEditSelector = createLocationSelector( locationEditGroup );

    var sideEditGroup = addSetting(tab, i18n._("Side"));
    var sideEditSelector = createSideSelector( sideEditGroup );

    var characterEditGroup = addSetting(tab, i18n._("Group name"));
    var characterEdit = DuScriptUI.editText( characterEditGroup, {
        text: '',
        placeHolder: i18n._("Character / Group name")
    });
    characterEdit.alignment = ['fill', 'fill'];

    var limbEditGroup = addSetting(tab, i18n._("Name"));
    var limbEdit = DuScriptUI.editText( limbEditGroup, {
        text: '',
        placeHolder: i18n._("(Limb) Name")
    });
    limbEdit.alignment = ['fill', 'fill'];

    var buttonsGroup = DuScriptUI.group( tab, 'row' );

    var pickButton = DuScriptUI.button( buttonsGroup, {
        text: i18n._("Pick selected layer"),
        image: DuScriptUI.Icon.EYE_DROPPER,
        alignment: 'center'
    });

    var applyAllButton = DuScriptUI.button(  buttonsGroup, {
                text: i18n._("Apply"),
                image: DuScriptUI.Icon.CHECK,
                alignment: 'center'
    } );

    pickButton.onClick = function()
    {
        Duik.Layer.sanitize();
        typeSelector.freeze = true;
        sideEditSelector.freeze = true;
        locationEditSelector.freeze = true;
        characterEdit.freeze = true;
        limbEdit.freeze = true;
        typeSelector.setCurrentData( Duik.Layer.type() );
        setSideSelector( sideEditSelector, Duik.Layer.side() );
        setLocationSelector( locationEditSelector, Duik.Layer.location());
        characterEdit.setText( Duik.Layer.groupName() );
        limbEdit.setText( Duik.Layer.name() );
        typeSelector.freeze = false;
        sideEditSelector.freeze = false;
        locationEditSelector.freeze = false;
        characterEdit.freeze = false;
        limbEdit.freeze = false;
    }

    applyAllButton.onClick = function()
    {
        DuAE.beginUndoGroup( i18n._("Layer manager") ); 
        DuAEProject.setProgressMode(true);
        DuScriptUI.progressBar.setMax(5);
        DuScriptUI.progressBar.hit(1, i18n._("Setting layers type..."));
        if (typeGroup.checked) Duik.Layer.setType( typeSelector.currentData );
        DuScriptUI.progressBar.hit(1, i18n._("Setting layers location..."));
        if (locationEditGroup.checked) Duik.Layer.setLocation( getLocation(locationEditSelector) );
        DuScriptUI.progressBar.hit(1, i18n._("Setting layers side..."));
        if (sideEditGroup.checked) Duik.Layer.setSide( getSide(sideEditSelector) );
        DuScriptUI.progressBar.hit(1, i18n._("Setting layers group name..."));
        if (characterEditGroup.checked) Duik.Layer.setGroupName( characterEdit.text );
        DuScriptUI.progressBar.hit(1, i18n._("Setting layers name..."));
        if (limbEditGroup.checked) Duik.Layer.setName( limbEdit.text );
        DuAEProject.setProgressMode(false);
        DuAE.endUndoGroup();
    }
}