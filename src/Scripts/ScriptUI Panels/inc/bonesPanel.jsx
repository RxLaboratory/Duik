function buildBonesUI( tab, standAlone )
{
    standAlone = def(standAlone, false);

    if (!standAlone) {
        // A Spacer
        var spacer = tab.add('group');
        spacer.margins = 0;
        spacer.spacing = 0;
        spacer.size = [-1,3];
        
        // A title
        DuScriptUI.staticText( tab, i18n._("Bones") ).alignment = ['center', 'top'];
    }

    // Prop buttons

    var toolsGroup = DuScriptUI.toolBar( tab );

    var selectButton = toolsGroup.addButton(
        i18n._("Select bones"),
        w12_select,
        i18n._("Select all bones")
    );
    selectButton.onClick = Duik.Bone.select;

    var showButton = toolsGroup.addButton(
        i18n._("Show/hide bones"),
        w12_show,
        i18n._("Show/Hide all the bones.\n\n[Alt]: Only the unselected bones.")
    );
    showButton.onClick = Duik.Bone.toggleVisibility;
    showButton.onAltClick = function( ) { Duik.Bone.toggleVisibility(undefined, true); };

    var duplicateButton = toolsGroup.addButton(
        i18n._("Duplicate bones"),
        w12_duplicate,
        i18n._("Duplicate the selected bones"),
    );
    duplicateButton.onClick = Duik.Bone.duplicate;

    var linkArtButton = toolsGroup.addButton(
        i18n._("Link art"),
        w12_link_to_bone,
        i18n._("Automatically (try to) link the artwork layers to their corresponding bones.") + "\n\n" +
        i18n._("By default, bones and artworks are matched using the layer names.") + "\n\n" +
        i18n._("[Alt]: Use the distance between the layers (using the anchor points of the layers) instead of their names.")
    );
    linkArtButton.onClick = function() {
        DuScriptUI.progressBar.reset();
        DuScriptUI.progressBar.show();
        Duik.Bone.autoParent(undefined, undefined, true);
        
        DuScriptUI.progressBar.close();
    };
    linkArtButton.onAltClick = function() {
        DuScriptUI.progressBar.reset();
        DuScriptUI.progressBar.show();
        Duik.Bone.autoParent();
        DuScriptUI.progressBar.close();
    };

    var unlinkButton = toolsGroup.addButton(
        i18n._("Edit mode"),
        w12_unlink,
        i18n._("Toggle edit mode")
    );
    unlinkButton.onClick = Duik.Bone.unlink;

    var bakeButton = toolsGroup.addButton(
        i18n._("Bake bones"),
        w12_bake,
        i18n._("Bake bone appearances.\n\n[Alt]: Keep envelops.\n[Ctrl]: Keep deactivated noodles."),
    );
    bakeButton.onClick = function() {
        if (!DuAEProject.setProgressMode(true, true, true, [bakeButton.screenX, bakeButton.screenY] )) return;
        Duik.Bone.bake();
        DuAEProject.setProgressMode(false);
    }
    bakeButton.onAltClick = function () {
        if (!DuAEProject.setProgressMode(true, true, true, [bakeButton.screenX, bakeButton.screenY] )) return;
        Duik.Bone.bake(true, false);
        DuAEProject.setProgressMode(false);
    };
    bakeButton.onCtrlClick = function () {
        if (!DuAEProject.setProgressMode(true, true, true, [bakeButton.screenX, bakeButton.screenY] )) return;
        Duik.Bone.bake(true, true, false);
        DuAEProject.setProgressMode(false);
    };
    bakeButton.onCtrlAltClick = function () {
        if (!DuAEProject.setProgressMode(true, true, true, [bakeButton.screenX, bakeButton.screenY] )) return;
        Duik.Bone.bake(true, false, false);
        DuAEProject.setProgressMode(false);
    };

    var editButton = toolsGroup.addButton(
        i18n._("Bone settings"),
        DuScriptUI.Icon.SETTINGS,
        i18n._("Edit selected bones")
    );
    editButton.onClick = function()
    {
        if (!editGroup.built) {
            function setSide()
            {
                var side = getSide(sideEditSelector);
                Duik.Bone.setSide(side);
            }

            function setLocation()
            {
                var location = getLocation(locationEditSelector);
                Duik.Bone.setLocation(location);
            }

            function setColor( allRandom )
            {
                var color = colorEditSelector.color;
                if (allRandom) color = null;
                Duik.Bone.setColor(color);
            }

            function setSize()
            {
                var size = parseInt( sizeEdit.text );
                if (isNaN(size)) return;
                Duik.Bone.setSize(size);
            }

            function setOpacity()
            {
                var opacity = parseInt( opacityEdit.text );
                if (isNaN(opacity)) return;
                Duik.Bone.setOpacity(opacity);
            }

            function setCharacterName()
            {
                Duik.Bone.setCharacterName( characterEdit.text );
            }

            function setLimbName()
            {
                Duik.Bone.setLimbName( limbEdit.text );
            }

            function setEnvelopEnabled()
            {
                Duik.Bone.setEnvelopEnabled( envelopBox.checked );
            }

            function setNoodleEnabled()
            {
                Duik.Bone.setNoodleEnabled( noodleBox.checked );
            }

            function setEnvelopOpacity()
            {
                var opacity = parseInt( envelopOpacityEdit.text );
                if (isNaN(opacity)) return;
                Duik.Bone.setEnvelopOpacity( opacity );
            }

            function setEnvelopColor()
            {
                Duik.Bone.setEnvelopColor( envelopColorSelector.color );
            }

            function setEnvelopStrokeSize()
            {
                var size = parseInt( envelopStrokeSizeEdit.text );
                if (isNaN(size)) return;
                Duik.Bone.setEnvelopStrokeSize( size );
            }

            function setEnvelopStrokeColor()
            {
                Duik.Bone.setEnvelopStrokeColor( envelopStrokeColorSelector.color );
            }

            function setNoodleColor()
            {
                Duik.Bone.setNoodleColor( noodleColorSelector.color );
            }

            createSubPanel (
                editGroup,
                i18n._("Bone settings"),
                mainGroup,
                false
            );

            var boneTypeSelector = createBoneTypeSelector(editGroup);

            DuScriptUI.separator( editGroup, uiMode <= 1 ? i18n._("Current Selection") : '' );

            var sideEditGroup = addSetting(editGroup, i18n._("Side"));
            var sideEditSelector = createSideSelector( sideEditGroup );

            var locationEditGroup = addSetting(editGroup, i18n._("Location"));
            var locationEditSelector = createLocationSelector( locationEditGroup );

            var colorEditGroup = addSetting(editGroup, i18n._("Color"));
            var colorEditSelector = DuScriptUI.colorSelector( colorEditGroup, i18n._("Set the color of the selected layers.") );

            var sizeEditGroup = addSetting(editGroup, i18n._("Size"));
            var sizeEdit = DuScriptUI.editText( sizeEditGroup, {
                text: "100",
                placeHolder: "100",
                suffix: " %",
                helpTip: i18n._("Change the size of the layer."),
                localize: false
            });

            var opacityEditGroup = addSetting(editGroup, i18n._("Opacity"));
            var opacityEdit = DuScriptUI.editText(  opacityEditGroup, {
                text: "100",
                suffix: " %",
                placeHolder: "100",
                helpTip: i18n._("Change the opacity of the bones."),
                localize: false
            });

            var characterEditGroup = addSetting(editGroup, i18n._("Group name"));
            var characterEdit = DuScriptUI.editText( characterEditGroup, {
                text: '',
                placeHolder: i18n._("Character / Group name"),
                helpTip: i18n._("Choose the name of the character.")
            });
            characterEdit.alignment = ['fill', 'fill'];

            var limbEditGroup = addSetting(editGroup, i18n._("Name"));
            var limbEdit = DuScriptUI.editText( limbEditGroup, {
                text: '',
                placeHolder: i18n._("(Limb) Name"),
                helpTip: i18n._("Change the name of the limb this layer belongs to")
            });
            limbEdit.alignment = ['fill', 'fill'];
            
            var envelopBoxGroup = addSetting(editGroup, i18n._("Envelop"));
            var envelopBox = DuScriptUI.checkBox(envelopBoxGroup, {
                text: i18n._("Enabled"),
                helpTip: i18n._("Toggle the envelops of the selected bones")
            });

            var envelopOpacityGroup = addSetting(editGroup, i18n._("Envelop opacity"));
            var envelopOpacityEdit = DuScriptUI.editText( envelopOpacityGroup, {
                text: "50",
                placeHolder: "50",
                suffix: " %",
                helpTip: i18n._("Change the opacity of the envelop."),
                localize: false
            });

            var envelopColorGroup = addSetting(editGroup, i18n._("Envelop color"));
            var envelopColorSelector = DuScriptUI.colorSelector( envelopColorGroup, i18n._("Set the color of the selected envelops.") );

            var envelopStrokeSizeGroup = addSetting(editGroup, i18n._("Envelop stroke size"));
            var envelopStrokeSizeEdit = DuScriptUI.editText( envelopStrokeSizeGroup, {
                text: "4",
                placeHolder: "4",
                suffix: " px",
                helpTip: i18n._("Change the size of the envelop stroke."),
                localize: false
            });

            var envelopStrokeColorGroup = addSetting(editGroup, i18n._("Envelop stroke color"));
            var envelopStrokeColorSelector = DuScriptUI.colorSelector( envelopStrokeColorGroup, i18n._("Set the color of the selected envelops strokes.") );

            var noodleBoxGroup = addSetting(editGroup, i18n._("Noodle"));
            var noodleBox = DuScriptUI.checkBox(noodleBoxGroup, {
                text: i18n._("Enabled"),
                helpTip: i18n._("Toggle the noodles of the selected bones")
            });

            var noodleColorGroup = addSetting(editGroup, i18n._("Noodle color"));
            var noodleColorSelector = DuScriptUI.colorSelector( noodleColorGroup, i18n._("Set the color of the selected noodles.") );

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
                helpTip: i18n._("Apply changes.\n\n[Alt]: assigns a random color to each bone."),
                alignment: 'center'
            });
            applyEditButton.onClick = function ()
            {
                DuAE.beginUndoGroup(i18n._("Edit bones"));
                if (sideEditGroup.checked) setSide();
                if (locationEditGroup.checked) setLocation();
                if (colorEditGroup.checked) setColor();
                if (sizeEditGroup.checked) setSize();
                if (opacityEditGroup.checked) setOpacity();
                if (characterEditGroup.checked) setCharacterName();
                if (limbEditGroup.checked) setLimbName();
                if (envelopBoxGroup.checked) setEnvelopEnabled();
                if (noodleBoxGroup.checked) setNoodleEnabled();
                if (envelopOpacityGroup.checked) setEnvelopOpacity();
                if (envelopColorGroup.checked) setEnvelopColor();
                if (envelopStrokeSizeGroup.checked) setEnvelopStrokeSize();
                if (envelopStrokeColorGroup.checked) setEnvelopStrokeColor();
                if (noodleColorGroup.checked) setNoodleColor();
                DuAE.endUndoGroup();
            };
            applyEditButton.onAltClick = function()
            {
                DuAE.beginUndoGroup(i18n._("Edit bones"));
                if (sideEditGroup.checked) setSide();
                if (locationEditGroup.checked) setLocation();
                if (colorEditGroup.checked) setColor(true);
                if (sizeEditGroup.checked) setSize();
                if (opacityEditGroup.checked) setOpacity();
                if (characterEditGroup.checked) setCharacterName();
                if (limbEditGroup.checked) setLimbName();
                if (envelopBoxGroup.checked) setEnvelopEnabled();
                if (noodleBoxGroup.checked) setNoodleEnabled();
                if (envelopOpacityGroup.checked) setEnvelopOpacity();
                if (envelopColorGroup.checked) setEnvelopColor();
                if (envelopStrokeSizeGroup.checked) setEnvelopStrokeSize();
                if (envelopStrokeColorGroup.checked) setEnvelopStrokeColor();
                if (noodleColorGroup.checked) setNoodleColor();
                DuAE.endUndoGroup();
            }

            editGroup.refresh = function ()
            {
                setSideSelector( sideEditSelector, Duik.Layer.side() );

                setLocationSelector( locationEditSelector, Duik.Layer.location());

                colorEditSelector.setColor( Duik.Bone.color( ) );

                sizeEdit.setText( Duik.Bone.size() );

                opacityEdit.setText( Duik.Bone.opacity() );

                characterEdit.setText( Duik.Layer.groupName() );

                limbEdit.setText( Duik.Layer.name() );

                envelopBox.setChecked( Duik.Bone.hasEnvelop() );

                envelopOpacityEdit.setText( Duik.Bone.envelopOpacity() );

                envelopColorSelector.setColor( Duik.Bone.envelopColor() );

                envelopStrokeSizeEdit.setText( Duik.Bone.envelopStrokeSize() );

                envelopStrokeColorSelector.setColor( Duik.Bone.envelopStrokeColor() );

                noodleBox.setChecked( Duik.Bone.hasNoodle() );

                noodleColorSelector.setColor( Duik.Bone.noodleColor() );
            }

            pickButton.onClick = editGroup.refresh;

            DuScriptUI.showUI(editGroup);
        }
        editGroup.refresh();
        mainGroup.visible = false;
        editGroup.visible = true;
    }

    // Main stack

    var stackGroup = DuScriptUI.group( tab, 'stacked');
    //stackGroup.margins = 3;
    stackGroup.alignment = ['fill','fill'];

    // Main group
    var mainGroup = DuScriptUI.group( stackGroup, 'column');
    mainGroup.alignment = ['fill','fill'];
    if (uiMode >= 2) mainGroup.spacing = 3;

    // Character name
    var nameEdit = DuScriptUI.editText(
        mainGroup,
        '',
        '',
        '',
        i18n._("Character Name"),
        i18n._("Choose the name of the character.")
    );
    
    // Limbs

    function createArmButton( group, type )
    {
        var buttonName = i18n._("Front leg");
        if (type == 'hominoid') buttonName = i18n._("Arm");
        else if (type == 'arthropod') buttonName = i18n._("Leg");
        var armButton = group.addButton(
            buttonName,
            w16_arm,
            i18n._("Add an armature for an arm") + '\n\n' +
                i18n._("[Ctrl]: Auto-parent the selection to the new bones.\n[Alt]: Assign a random color to the new limb."),
            true, // Options
            false, // localize
            undefined, // optionsWithoutButton
            i18n._("Create") // optionsButtonText
        );

        armButton.optionsPopup.build = function ()
        {
            function createArm(forceLink, randomColor) {
                forceLink = def(forceLink, false);
                randomColor = def(randomColor, false);

                DuAE.beginUndoGroup( i18n._("Create arm"));

                DuScriptUI.progressBar.reset();
                DuScriptUI.progressBar.show();

                // Get options
                var characterName = nameEdit.text;
                var  t = OCO.LimbType.HOMINOID;
                if (type == 'digitigrade') t = OCO.LimbType.DIGITIGRADE;
                else if (type == 'plantigrade') t = OCO.LimbType.PLANTIGRADE;
                else if (type == 'ungulate') t = OCO.LimbType.UNGULATE;
                else if (type == 'arthropod') t = OCO.LimbType.ARTHROPOD;

                var side = getSide(armSideSelector);
                var location = getLocation(armLocationSelector);

                var bones = Duik.Bone.arm(
                    characterName,
                    t,
                    side,
                    armShoulderButton.checked,
                    armArmButton.checked,
                    armForearmButton.checked,
                    armHandButton.checked,
                    armClawsButton.checked,
                    location,
                    forceLink
                );

                // Set the color
                if (randomColor) {
                    Duik.Bone.setColor( DuColor.random(), bones );
                };

                // Set the side to the other for the next limb
                if (side == OCO.Side.LEFT) armSideSelector.setCurrentIndex( 2 );
                else if (side == OCO.Side.RIGHT) armSideSelector.setCurrentIndex( 1 );

                DuScriptUI.progressBar.close();

                DuAE.endUndoGroup();
            };
            
            var illustration;
            if (type == 'hominoid')
            {
                illustration = armButton.optionsPanel.add('image', undefined, w128_human_arm.binAsString );
            }
            else if (type == 'plantigrade')
            {
                illustration = armButton.optionsPanel.add('image', undefined, w128_bear_arm.binAsString );
            }
            else if (type == 'digitigrade')
            {
                illustration = armButton.optionsPanel.add('image', undefined, w128_digitigrade_arm.binAsString );
            }
            else if (type == 'ungulate')
            {
                illustration = armButton.optionsPanel.add('image', undefined, w128_ungulate_arm.binAsString );
            }
            else if (type == 'arthropod')
            {
                illustration = armButton.optionsPanel.add('image', undefined, w128_arthropod_arm.binAsString );
            }
            illustration.alignment = ['center', 'top'];

            var armLocationSelector = createLocationSelector( armButton.optionsPanel );
            armLocationSelector.setCurrentIndex(1);
            var armSideSelector = createSideSelector( armButton.optionsPanel );
            armSideSelector.setCurrentIndex(1);

            var armShoulderButton = DuScriptUI.checkBox(
                armButton.optionsPanel, 
                i18n._("Shoulder") );
            armShoulderButton.textColor = DuColor.Color.RAINBOX_RED;
            armShoulderButton.dim();

            var armArmButton = DuScriptUI.checkBox(
                armButton.optionsPanel, 
                i18n._("Arm") );
            armArmButton.textColor = DuColor.Color.ORANGE;
            armArmButton.setChecked(true);
            armArmButton.dim();

            var armForearmButton = DuScriptUI.checkBox(
                armButton.optionsPanel, 
                i18n._("Forearm") );
            armForearmButton.textColor = DuColor.Color.YELLOW;
            armForearmButton.setChecked(true);
            armForearmButton.dim();

            var armHandButton = DuScriptUI.checkBox(
                armButton.optionsPanel, 
                i18n._("Hand") );
            armHandButton.textColor = DuColor.Color.LIGHT_BLUE;
            armHandButton.setChecked(true);
            armHandButton.dim();

            var clawsName = i18n._("Claws");
            if (type == 'ungulate') clawsName = i18n._("Hoof");
            var armClawsButton = DuScriptUI.checkBox(
                armButton.optionsPanel, 
                clawsName );
            armClawsButton.textColor = DuColor.Color.LIGHT_PURPLE;
            armClawsButton.dim();
            if (type == 'hominoid') armClawsButton.visible = false;

            armButton.onClick = createArm;
            armButton.onAltClick = function() { createArm(false, true); };
            armButton.onCtrlClick = function() { createArm(true, false); };
            armButton.onCtrlAltClick = function() { createArm(true, true); };
        }
    }

    function createLegButton( group, type)
    {
        var legButton = group.addButton(
            i18n._("Leg"),
            w16_leg,
            i18n._("Add an armature for a leg") + '\n\n' +
                i18n._("[Ctrl]: Auto-parent the selection to the new bones.\n[Alt]: Assign a random color to the new limb."),
            true, // Options
            undefined, // localize
            undefined, // optionsWithoutButton
            i18n._("Create") // optionsButtonText
        );

        legButton.optionsPopup.build = function ()
        {
            function createLeg(forceLink, randomColor) {
                forceLink = def(forceLink, false);
                randomColor = def(randomColor, false);

                DuAE.beginUndoGroup( i18n._("Create leg"));

                DuScriptUI.progressBar.reset();
                DuScriptUI.progressBar.show();

                // Get options
                var characterName = nameEdit.text;
                var t = OCO.LimbType.HOMINOID;
                if (type == 'plantigrade') t = OCO.LimbType.PLANTIGRADE;
                if (type == 'digitigrade') t = OCO.LimbType.DIGITIGRADE;
                else if (type == 'ungulate') t = OCO.LimbType.UNGULATE;
                var side = getSide(legSideSelector);
                var location = getLocation(legLocationSelector);

                var bones = Duik.Bone.leg(
                    characterName,
                    t,
                    side,
                    legThighButton.checked,
                    legCalfButton.checked,
                    legFootButton.checked,
                    legClawsButton.checked,
                    location,
                    forceLink
                );

                // Set the color
                if (randomColor) {
                    Duik.Bone.setColor( DuColor.random(), bones );
                };

                // Set the side to the other for the next limb
                if (side == OCO.Side.LEFT) legSideSelector.setCurrentIndex( 2 );
                else if (side == OCO.Side.RIGHT) legSideSelector.setCurrentIndex( 1 );

                DuScriptUI.progressBar.close();

                DuAE.endUndoGroup();
            };

            var illustration;
            if (type == 'hominoid')
            {
                illustration = legButton.optionsPanel.add('image', undefined, w128_human_leg.binAsString );
            }
            else if (type == 'plantigrade')
            {
                illustration = legButton.optionsPanel.add('image', undefined, w128_human_leg.binAsString );
            }
            else if (type == 'digitigrade')
            {
                illustration = legButton.optionsPanel.add('image', undefined, w128_digitigrade_leg.binAsString );
            }
            else if (type == 'ungulate')
            {
                illustration = legButton.optionsPanel.add('image', undefined, w128_ungulate_leg.binAsString );
            }
            illustration.alignment = ['center', 'top'];

            var legLocationSelector = createLocationSelector( legButton.optionsPanel );
            legLocationSelector.setCurrentIndex(2);
            var legSideSelector = createSideSelector( legButton.optionsPanel );
            legSideSelector.setCurrentIndex(1);

            var legThighButton = DuScriptUI.checkBox(
                legButton.optionsPanel, 
                i18n._("Thigh") );
            legThighButton.textColor = DuColor.Color.ORANGE;
            legThighButton.setChecked(true);
            legThighButton.dim();

            var legCalfButton = DuScriptUI.checkBox(
                legButton.optionsPanel, 
                i18n._("Calf") );
            legCalfButton.textColor = DuColor.Color.YELLOW;
            legCalfButton.setChecked(true);
            legCalfButton.dim();

            var legFootButton = DuScriptUI.checkBox(
                legButton.optionsPanel, 
                i18n._("Foot") );
            legFootButton.textColor = DuColor.Color.LIGHT_BLUE;
            legFootButton.setChecked(true);
            legFootButton.dim();

            var clawsName = i18n._("Claws");
            if (type == 'hominoid') clawsName = i18n._("Toes");
            else if (type == 'ungulate') clawsName = i18n._("Hoof");
            var legClawsButton = DuScriptUI.checkBox(
                legButton.optionsPanel, 
                clawsName );
            legClawsButton.textColor = DuColor.Color.LIGHT_PURPLE;
            legClawsButton.dim();

            legButton.onClick = createLeg;
            legButton.onAltClick = function() { createLeg(false, true); };
            legButton.onCtrlClick = function() { createLeg(true, false); };
            legButton.onCtrlAltClick = function() { createLeg(true, true); };
        }   
    }

    function createSpineButton( group, numNeck, numSpine, hips )
    {
        numNeck = def(numNeck, 1);
        numSpine = def(numSpine, 3);
        hips = def(hips, true);

        var spineButton = group.addButton(
            i18n._("Spine"),
            w16_spine,
            i18n._("Add an armature for a spine (including the hips and head)") + '\n\n' +
                i18n._("[Ctrl]: Auto-parent the selection to the new bones.\n[Alt]: Assign a random color to the new limb."),
            true, // Options
            undefined, // localize
            undefined, // optionsWithoutButton
            i18n._("Create") // optionsButtonText
        );

        spineButton.optionsPopup.build = function ()
        {
            function createSpine(forceLink, randomColor) {
                forceLink = def(forceLink, false);
                randomColor = def(randomColor, false);

                DuAE.beginUndoGroup( i18n._("Create spine"));

                DuScriptUI.progressBar.reset();
                DuScriptUI.progressBar.show();

                // Get options
                var characterName = nameEdit.text;

                var neck = parseInt(spineNeckEdit.text);
                if (isNaN(neck)) neck = numNeck;
                var spine = parseInt(spineNumEdit.text);
                if (isNaN(spine)) spine = numSpine;

                var bones = Duik.Bone.spine(
                    characterName,
                    spineHeadButton.checked,
                    neck,
                    spine,
                    spineHipsButton.checked, 
                    forceLink
                );

                // Set the color
                if (randomColor) {
                    Duik.Bone.setColor( DuColor.random(), bones );
                };

                DuScriptUI.progressBar.close();

                DuAE.endUndoGroup();
            }

            var spineIllu = spineButton.optionsPanel.add('image', undefined, w128_human_spine.binAsString);
            spineIllu.alignment = ['center', 'top'];

            var spineHeadButton = DuScriptUI.checkBox(
                spineButton.optionsPanel, 
                i18n._("Head") );
            spineHeadButton.textColor = DuColor.Color.LIGHT_BLUE;
            spineHeadButton.setChecked(true);
            spineHeadButton.dim();

            var spineNeckEdit = DuScriptUI.editText(
                spineButton.optionsPanel,
                '',
                i18n._("Neck") + ': ',
                ' ' + i18n._("Layers").toLowerCase(),
                "00" + numNeck,
                '',
                false
            );
            spineNeckEdit.textColor = DuColor.Color.YELLOW;
            spineNeckEdit.changed();

            var spineNumEdit = DuScriptUI.editText(
                spineButton.optionsPanel,
                '',
                i18n._("Spine") + ': ',
                ' ' + i18n._("Layers").toLowerCase(),
                "00" + numSpine,
                '',
                false
            );
            spineNumEdit.textColor = DuColor.Color.ORANGE;
            spineNumEdit.changed();

            var spineHipsButton = DuScriptUI.checkBox(
                spineButton.optionsPanel, 
                i18n._("Hips") );
            spineHipsButton.textColor = DuColor.Color.RAINBOX_RED;
            spineHipsButton.setChecked(hips);
            spineHipsButton.dim();

            spineButton.onClick = createSpine;
            spineButton.onAltClick = function() { createSpine(false, true); };
            spineButton.onCtrlClick = function() { createSpine(true, false); };
            spineButton.onCtrlAltClick = function() { createSpine(true, true); };
        }
    }

    function createHairButton( group )
    {
        
        var hairButton = group.addButton(
            i18n._("Hair"),
            w16_hair_strand,
            i18n._("Add an armature for a hair strand.") + '\n\n' +
                i18n._("[Ctrl]: Auto-parent the selection to the new bones.\n[Alt]: Assign a random color to the new limb."),
            true, // Options
            undefined, // localize
            undefined, // optionsWithoutButton
            i18n._("Create") // optionsButtonText
        );

        hairButton.optionsPopup.build = function ()
        {
            function createHair(forceLink, randomColor) {
                forceLink = def(forceLink, false);
                randomColor = def(randomColor, false);

                DuAE.beginUndoGroup( i18n._("Create hair strand"));

                DuScriptUI.progressBar.reset();
                DuScriptUI.progressBar.show();

                // Get options
                var characterName = nameEdit.text;

                var num = parseInt(hairEdit.text);
                if (isNaN(num)) num = 3;

                var bones = Duik.Bone.hair(
                    characterName,
                    num,
                    forceLink
                );

                // Set the color
                if (randomColor) {
                    Duik.Bone.setColor( DuColor.random(), bones );
                };

                DuScriptUI.progressBar.close();

                DuAE.endUndoGroup();
                
            }

            var hairEdit = DuScriptUI.editText(
                hairButton.optionsPanel,
                '',
                i18n._("Hair:") + ' ',
                ' ' + i18n._("layers"),
                "003",
                '',
                false
            );

            hairButton.onClick = createHair;
            hairButton.onAltClick = function() { createHair(false, true); };
            hairButton.onCtrlClick = function() { createHair(true, false); };
            hairButton.onCtrlAltClick = function() { createHair(true, true); };
        }
    }

    function createTailButton( group )
    {
        var tailButton = group.addButton(
            i18n._("Tail"),
            w16_tail,
            "Add an armature for a tail.",
            true, // Options
            undefined, // localize
            undefined, // optionsWithoutButton
            i18n._("Create") // optionsButtonText
        );

        tailButton.optionsPopup.build = function ()
        {
            function createTail(forceLink, randomColor) {
                forceLink = def(forceLink, false);
                randomColor = def(randomColor, false);

                DuAE.beginUndoGroup( i18n._("Create tail"));

                DuScriptUI.progressBar.reset();
                DuScriptUI.progressBar.show();

                // Get options
                var characterName = nameEdit.text;

                var num = parseInt(tailEdit.text);
                if (isNaN(num)) num = 3;

                var bones = Duik.Bone.tail(
                    characterName,
                    num,
                    forceLink
                );

                // Set the color
                if (randomColor) {
                    Duik.Bone.setColor( DuColor.random(), bones );
                };

                DuScriptUI.progressBar.close();

                DuAE.endUndoGroup();
            }

            var tailIllu = tailButton.optionsPanel.add('image', undefined, w128_tail.binAsString);
            tailIllu.alignment = ['center', 'top'];

            var tailEdit = DuScriptUI.editText(
                tailButton.optionsPanel,
                '',
                i18n._("Tail:") + ' ',
                ' ' + i18n._("layers"),
                "003",
                '',
                false
            );

            tailButton.onClick = createTail;
            tailButton.onAltClick = function() { createTail(false, true); };
            tailButton.onCtrlClick = function() { createTail(true, false); };
            tailButton.onCtrlAltClick = function() { createTail(true, true); };
        }
    }

    function createWingButton( group )
    {
        var wingButton = group.addButton(
            i18n._("Wing"),
            w16_wing,
            i18n._("Add an armature for a wing."),
            true, // Options
            undefined, // localize
            undefined, // optionsWithoutButton
            i18n._("Create") // optionsButtonText
        );

        wingButton.optionsPopup.build = function ()
        {
            function createWing(forceLink, randomColor) {
                forceLink = def(forceLink, false);
                randomColor = def(randomColor, false);

                DuAE.beginUndoGroup( i18n._("Create wing"));

                DuScriptUI.progressBar.reset();
                DuScriptUI.progressBar.show();

                // Get options
                var characterName = nameEdit.text;

                var side = getSide( wingSideSelector );

                var num = parseInt(wingFeathersEdit.text);
                if (isNaN(num)) num = 5;

                var bones = Duik.Bone.wing(
                    characterName,
                    side,
                    wingArmButton.checked,
                    wingForearmButton.checked,
                    wingHandButton.checked,
                    num,
                    forceLink
                );

                // Set the color
                if (randomColor) {
                    Duik.Bone.setColor( DuColor.random(), bones );
                };

                // Set the side to the other for the next limb
                if (side == OCO.Side.LEFT) wingSideSelector.setCurrentIndex( 2 );
                else if (side == OCO.Side.RIGHT) wingSideSelector.setCurrentIndex( 1 );

                DuScriptUI.progressBar.close();

                DuAE.endUndoGroup();
            };

            var wingIllu = wingButton.optionsPanel.add('image', undefined, w128_wing.binAsString);
            wingIllu.alignment = ['center', 'top'];

            var wingSideSelector = createSideSelector( wingButton.optionsPanel );
            wingSideSelector.setCurrentIndex(1);

            var wingArmButton = DuScriptUI.checkBox(
                wingButton.optionsPanel, 
                i18n._("Arm") );
            wingArmButton.textColor = DuColor.Color.ORANGE;
            wingArmButton.setChecked(true);
            wingArmButton.dim();

            var wingForearmButton = DuScriptUI.checkBox(
                wingButton.optionsPanel, 
                i18n._("Forearm") );
            wingForearmButton.textColor = DuColor.Color.YELLOW;
            wingForearmButton.setChecked(true);
            wingForearmButton.dim();

            var wingHandButton = DuScriptUI.checkBox(
                wingButton.optionsPanel, 
                i18n._("Hand") );
            wingHandButton.textColor = DuColor.Color.LIGHT_BLUE;
            wingHandButton.setChecked(true);
            wingHandButton.dim();

            var wingFeathersEdit = DuScriptUI.editText(
            wingButton.optionsPanel,
            '',
            i18n._("Feathers:") + ' ',
            ' ' + i18n._("layers"),
            "005",
            '',
            false
            );
            wingFeathersEdit.textColor = DuColor.Color.LIGHT_PURPLE;
            wingFeathersEdit.changed();

            wingButton.onClick = createWing;
            wingButton.onAltClick = function() { createWing(false, true); };
            wingButton.onCtrlClick = function() { createWing(true, false); };
            wingButton.onCtrlAltClick = function() { createWing(true, true); };
        }
    }

    function createFishSpineButton( group )
    {
        var fishSpineButton = group.addButton(
            i18n._("Fish spine"),
            w16_fish_spine,
            i18n._("Add an armature for the spine of a fish."),
            true, // Options
            undefined, // localize
            undefined, // optionsWithoutButton
            i18n._("Create") // optionsButtonText
        );

        fishSpineButton.optionsPopup.build = function ()
        {
            function createFishSpine(forceLink, randomColor) {
                forceLink = def(forceLink, false);
                randomColor = def(randomColor, false);

                DuAE.beginUndoGroup( i18n._("Create fish spine"));

                DuScriptUI.progressBar.reset();
                DuScriptUI.progressBar.show();

                // Get options
                var characterName = nameEdit.text;

                var num = parseInt(fishEdit.text);
                if (isNaN(num)) num = 3;

                var bones =Duik.Bone.fishSpine(
                    characterName,
                    fishHeadButton.checked,
                    num,
                    forceLink
                );

                // Set the color
                if (randomColor) {
                    Duik.Bone.setColor( DuColor.random(), bones );
                };

                DuScriptUI.progressBar.close();

                DuAE.endUndoGroup();
            };

            var fishHeadButton = DuScriptUI.checkBox(
                fishSpineButton.optionsPanel, 
                i18n._("Head")
            );
            fishHeadButton.textColor = DuColor.Color.LIGHT_BLUE;
            fishHeadButton.setChecked(true);
            fishHeadButton.dim();
            
            var fishEdit = DuScriptUI.editText(
                fishSpineButton.optionsPanel,
                '',
                i18n._("Spine:") + ' ',
                ' ' + i18n._("layers"),
                "003",
                '',
                false
            );

            fishSpineButton.onClick = createFishSpine;
            fishSpineButton.onAltClick = function() { createFishSpine(false, true); };
            fishSpineButton.onCtrlClick = function() { createFishSpine(true, false); };
            fishSpineButton.onCtrlAltClick = function() { createFishSpine(true, true); };
        };
    }

    function createFinButton( group )
    {
        var finButton = group.addButton(
            i18n._("Fin"),
            w16_fin,
            i18n._("Add an armature for a fin."),
            true, // Options
            undefined, // localize
            undefined, // optionsWithoutButton
            i18n._("Create") // optionsButtonText
        );

        finButton.optionsPopup.build = function ()
        {
            function createFin(forceLink, randomColor) {
                forceLink = def(forceLink, false);
                randomColor = def(randomColor, false);

                DuAE.beginUndoGroup( i18n._("Create fin"));

                DuScriptUI.progressBar.reset();
                DuScriptUI.progressBar.show();

                // Get options
                var characterName = nameEdit.text;

                var num = parseInt(finEdit.text);
                if (isNaN(num)) num = 5;

                var bones = Duik.Bone.fin(
                    characterName,
                    OCO.Side.NONE,
                    num,
                    forceLink
                );

                // Set the color
                if (randomColor) {
                    Duik.Bone.setColor( DuColor.random(), bones );
                };

                DuScriptUI.progressBar.close();

                DuAE.endUndoGroup();
            };

            var finIllu = finButton.optionsPanel.add('image', undefined, w128_fin.binAsString);
            finIllu.alignment = ['center', 'top'];

            var finEdit = DuScriptUI.editText(
                finButton.optionsPanel,
                '',
                i18n._("Fishbones:") + ' ',
                ' ' + i18n._("layers"),
                "005",
                '',
                false
            );

            finButton.onClick = createFin;
            finButton.onAltClick = function() { createFin(false, true); };
            finButton.onCtrlClick = function() { createFin(true, false); };
            finButton.onCtrlAltClick = function() { createFin(true, true); };
        }       
    }

    var line1 = DuScriptUI.group( mainGroup , uiMode >= 2 ? 'row' : 'column');

    var hominoidGroup = DuScriptUI.multiButton(
        line1,
        i18n._("Hominoid"),
        w16_hominoid,
        i18n._("Create limbs for an hominoid (Humans and apes).")
    );
    hominoidGroup.build = function() 
    {
        createArmButton( this, 'hominoid' );
        createLegButton( this, 'hominoid' );
        createSpineButton( this, 1, 3 );
        createHairButton( this );
    }

    var plantigradeGroup = DuScriptUI.multiButton(
        line1,
        i18n._("Plantigrade"),
        w16_bunny,
        i18n._("Create limbs for a plantigrade (primates, bears, rabbits...).")
    );
    plantigradeGroup.build = function() 
    {
        createArmButton( this, 'plantigrade' );
        createLegButton( this, 'plantigrade' );
        createSpineButton( this, 1, 3 );
        createTailButton( this );
        createHairButton( this );
    }

    var digitigradeGroup = DuScriptUI.multiButton(
        line1,
        i18n._("Digitigrade"),
        w16_cat,
        i18n._("Create limbs for a digitigrade (dogs, cats, dinosaurs...).")
    );
    digitigradeGroup.build = function() 
    {
        createArmButton( this, 'digitigrade' );
        createLegButton( this, 'digitigrade' );
        createSpineButton( this, 2, 3 );
        createTailButton( this );
        createHairButton( this );
    }

    var ungulateGroup = DuScriptUI.multiButton(
        line1,
        i18n._("Ungulate"),
        w16_horse,
        i18n._("Create limbs for an ungulate (horses, cattle, giraffes, pigs, deers, camels, hippopotamuses...).")
    );
    ungulateGroup.build = function() 
    {
        createArmButton( this, 'ungulate' );
        createLegButton( this, 'ungulate' );
        createSpineButton( this, 2, 3 );
        createTailButton( this );
        createHairButton( this );
    }

    var arthropodGroup = DuScriptUI.multiButton(
        line1,
        i18n._("Arthropod"),
        w16_ant,
        i18n._("Create limbs for an arthropod (insects, spiders, scorpions, crabs, shrimps...)")
    );
    arthropodGroup.build = function() 
    {
        createArmButton( this, 'arthropod' );
        createSpineButton( this, 0, 1, false );
        createTailButton( this );
    }

    var line2 = DuScriptUI.group( mainGroup , uiMode >= 2 ? 'row' : 'column');

    var birdGroup = DuScriptUI.multiButton(
        line2,
        i18n._("Bird"),
        w16_bird,
        i18n._("Create limbs for a cute flying beast.")
    );
    birdGroup.build = function() 
    {
        createLegButton( this, 'digitigrade' );
        createSpineButton( this, 1, 1 );
        createWingButton( this );
        createTailButton( this );
    }

    var fishGroup = DuScriptUI.multiButton(
        line2,
        i18n._("Fish"),
        w16_fish,
        i18n._("Create limbs for weird swimming beasts.")
    );
    fishGroup.build = function() 
    {
        createFishSpineButton( this );
        createFinButton( this );
    }

    // Snake deactivated for now, still needs work
    /*var snakeButton = DuScriptUI.button(
        line2,
        i18n._("Snake"),
        w16_snake_spine,
        "Add an armature for a snake / worm with a head.",
        true, // Options
        undefined, // localize
        undefined, // optionsWithoutButton
        i18n._("Create") // optionsButtonText
    );
    snakeButton.optionsPopup.build = function ()
    {
        var snakeIllu = snakeButton.optionsPanel.add('image', undefined, w128_snake_spine.binAsString);
        snakeIllu.alignment = ['center', 'top'];

        var snakeHeadButton = DuScriptUI.checkBox(
            snakeButton.optionsPanel, 
            i18n._("Head") );
        snakeHeadButton.textColor = DuColor.Color.LIGHT_BLUE;
        snakeHeadButton.setChecked(true);
        snakeHeadButton.dim();

        snakeEdit = DuScriptUI.editText(
            snakeButton.optionsPanel,
            '',
            i18n._("Spine") + ': ',
            ' ' + i18n._("Layers").toLowerCase(),
            "005",
            '',
            false
        );

        snakeButton.onClick = function() 
        {
            // Get options
            var characterName = nameEdit.text;

            var num = parseInt(snakeEdit.text);
            if (isNaN(num)) num = 5;

            Duik.Bone.snakeSpine(
                characterName,
                snakeHeadButton.checked,
                num
            );
        };
    }//*/

    var customButton = DuScriptUI.button(
        line2,
        i18n._("Custom"),
        w16_custom,
        i18n._("Add a custom armature.")+
        "\n\n"+
        i18n._("[Ctrl]: Automatically parent the selected items (layers, path vertices or puppet pins) to the new bones."),
        true, // Options
        undefined, // localize
        undefined, // optionsWithoutButton
        i18n._("Create") // optionsButtonText
    );
    customButton.optionsPopup.build = function ()
    {
        function createCustom(forceLink, randomColor) {
            forceLink = def(forceLink, false);
            randomColor = def(randomColor, false);

            DuAE.beginUndoGroup( i18n._("Create custom armature"));

            DuScriptUI.progressBar.reset();
            DuScriptUI.progressBar.show();

            // Get options
            var num = parseInt( numCustomEdit.text );
            if (isNaN(num)) num = 2;
            if (num < 1) num = 1;
            
            var name = customNameEdit.text;
            var characterName = nameEdit.text;
            var side = getSide(customSideSelector);
            var location = getLocation(customLocationSelector);

            var bones = Duik.Bone.customLimb(num, name, characterName, side, location, forceLink);

            // Set the color
            if (randomColor) {
                Duik.Bone.setColor( DuColor.random(), bones );
            };

            DuScriptUI.progressBar.close();

            DuAE.endUndoGroup();
        };
            

        var customLocationSelector = createLocationSelector( customButton.optionsPanel );
        var customSideSelector = createSideSelector( customButton.optionsPanel );
        var numCustomGroup = DuScriptUI.group( customButton.optionsPanel );
        DuScriptUI.staticText(
            numCustomGroup,
            i18n._("Number of bones:")
        );
        var numCustomEdit = DuScriptUI.editText(
            numCustomGroup,
            '',
            '',
            '',
            "002"
        );
        var customNameEdit = DuScriptUI.editText(
            customButton.optionsPanel,
            '',
            '',
            '',
            i18n._("Limb name")
        );

        customButton.onClick = createCustom;
        customButton.onAltClick = function() { createCustom(false, true); };
        customButton.onCtrlClick = function() { createCustom(true, false); };
        customButton.onCtrlAltClick = function() { createCustom(true, true); };
    }

    // Auto-Rig

    var sep = DuScriptUI.separator(mainGroup);

    createAutorigButton(mainGroup);

    // Edit Group
    var editGroup = DuScriptUI.group( stackGroup, 'column');
    editGroup.visible = false;
    editGroup.built = false;

    
}