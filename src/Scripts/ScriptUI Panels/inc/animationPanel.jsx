﻿function buildAnimationPanelUI(tab, standAlone) {
    standAlone = def(standAlone, false);

    // Utils

    function hideAllGroups() {
        animationGroup.visible = false;
        animationLibGroup.visible = false;
        moveAnchorPointGroup.visible = false;
        celAnimationGroup.visible = false;
        sequenceGroup.visible = false;
    }

    if (!standAlone) {
        // A Spacer
        var spacer = tab.add('group');
        spacer.margins = 0;
        spacer.spacing = 0;
        spacer.size = [-1, 3];

        // A title
        DuScriptUI.staticText(tab, i18n._("Animation")).alignment = ['center', 'top'];
    }
    
    // tools
    var toolsGroup = DuScriptUI.toolBar(tab);

    var selectButton = toolsGroup.addButton(
        i18n._("Select Keyframes"),
        w12_select,
        i18n._("Select keyframes."),
        true
    );
    selectButton.optionsPopup.build = function() {
        var selectMethodSelector = DuScriptUI.selector(
            selectButton.optionsPanel
        );

        selectMethodSelector.addButton(
            i18n._("Time"),
            w16_time,
            i18n._("Select at a precise time.")
        );

        selectMethodSelector.addButton(
            i18n._("Range"),
            w16_range,
            i18n._("Select from a given range.")
        );

        selectMethodSelector.setCurrentIndex(1);

        selectMethodSelector.onChange = function() {
            outEdit.enabled = selectMethodSelector.index == 1;
        };

        var currentTimeButton = DuScriptUI.checkBox(
            selectButton.optionsPanel,
            i18n._("Current time")
        );
        currentTimeButton.setChecked(true);

        currentTimeButton.onClick = function() {
            rangeGroup.visible = !currentTimeButton.checked;
        };

        var rangeGroup = DuScriptUI.group(selectButton.optionsPanel, 'row');

        var inEdit = DuScriptUI.editText(
            rangeGroup,
            '',
            i18n._("time", "In") + ' ', /// TRANSLATORS: In time (incoming)
            '',
            '00:00:00:00',
            '',
            false
        );
        inEdit.alignment = ['fill', 'fill'];

        var outEdit = DuScriptUI.editText(
            rangeGroup,
            '',
            i18n._p("time", "Out") + ' ', /// TRANSLATORS: Out time (outgoing)
            '',
            '00:00:00:00',
            '',
            false
        );
        outEdit.alignment = ['fill', 'fill'];

        rangeGroup.visible = false;

        var pickRangeButton = DuScriptUI.button(
            rangeGroup,
            '',
            DuScriptUI.Icon.EYE_DROPPER
        );
        pickRangeButton.alignment = ['right', 'center'];

        pickRangeButton.onClick = function() {
            var comp = DuAEProject.getActiveComp();
            if (!comp) return;

            if (selectMethodSelector.index == 0) {
                inEdit.setText(timeToCurrentFormat(comp.time + comp.displayStartTime, 1 / comp.frameDuration));
            } else {
                inEdit.setText(timeToCurrentFormat(comp.workAreaStart + comp.displayStartTime, 1 / comp.frameDuration));
                outEdit.setText(timeToCurrentFormat(comp.workAreaStart + comp.workAreaDuration + comp.displayStartTime, 1 / comp.frameDuration));
            }
        }

        var layerSelectionSelector = DuScriptUI.selector(
            selectButton.optionsPanel
        );

        layerSelectionSelector.addButton(
            i18n._("Selected layers"),
            w16_selected_layers
        );
        layerSelectionSelector.addButton(
            i18n._("All layers"),
            w16_layers
        );

        layerSelectionSelector.setCurrentIndex(1);

        var layerTypeSelector = DuScriptUI.selector(
            selectButton.optionsPanel
        );

        layerTypeSelector.addButton(
            i18n._("Controllers"),
            w16_controller
        );
        layerTypeSelector.addButton(
            i18n._("All layers"),
            w16_layers
        );

        layerTypeSelector.setCurrentIndex(0);

        var propsGroup = DuScriptUI.group(selectButton.optionsPanel, 'row');

        var posButton = DuScriptUI.checkBox(
            propsGroup,
            '',
            w16_move,
            i18n._("Position")
        );
        posButton.alignment = ['center', 'top'];
        posButton.setChecked(true);

        var rotButton = DuScriptUI.checkBox(
            propsGroup,
            '',
            w16_rotate,
            i18n._("Rotation")
        );
        rotButton.alignment = ['center', 'top'];
        rotButton.setChecked(true);

        var scaButton = DuScriptUI.checkBox(
            propsGroup,
            '',
            w16_scale,
            i18n._("Scale")
        );
        scaButton.alignment = ['center', 'top'];
        scaButton.setChecked(true);

        var opaButton = DuScriptUI.checkBox(
            propsGroup,
            '',
            w16_opacity,
            i18n._("Opacity")
        );
        opaButton.alignment = ['center', 'top'];
        opaButton.setChecked(true);

        var masksButton = DuScriptUI.checkBox(
            propsGroup,
            '',
            w16_mask,
            i18n._("Masks")
        );
        masksButton.alignment = ['center', 'top'];
        masksButton.setChecked(true);

        var fxButton = DuScriptUI.checkBox(
            propsGroup,
            '',
            w16_fx,
            i18n._("Effects")
        );
        fxButton.alignment = ['center', 'top'];
        fxButton.setChecked(true);

        var allPropsButton = DuScriptUI.checkBox(
            propsGroup,
            '',
            w16_props,
            i18n._("All properties")
        );
        allPropsButton.alignment = ['center', 'top'];

        allPropsButton.onClick = function() {
            var checked = allPropsButton.checked;
            posButton.setChecked(checked);
            rotButton.setChecked(checked);
            scaButton.setChecked(checked);
            opaButton.setChecked(checked);
            masksButton.setChecked(checked);
            fxButton.setChecked(checked);
        };

        selectButton.onClick = function() {
            var comp = DuAEProject.getActiveComp();
            if (!comp) return;
            // Get range
            var inTime = comp.time;
            var outTime = comp.time;
            if (currentTimeButton.checked) {
                if (selectMethodSelector.index == 1) {
                    inTime = comp.workAreaStart;
                    outTime = comp.workAreaStart + comp.workAreaDuration;
                }
            } else {
                inTime = currentFormatToTime(inEdit.text, 1 / comp.frameDuration) - comp.displayStartTime;
                if (selectMethodSelector.index == 1) outTime = currentFormatToTime(outEdit.text, 1 / comp.frameDuration) - comp.displayStartTime;
                else outTime = inTime;
            }

            // Get property types
            var props = [];
            if (!allPropsButton.checked) {
                if (posButton.checked) {
                    props.push('ADBE Position');
                    props.push('ADBE Vector Position');
                    props.push('ADBE Position_0');
                    props.push('ADBE Position_1');
                    props.push('ADBE Position_2');
                }
                if (rotButton.checked) {
                    props.push('ADBE Rotate Z');
                    props.push('ADBE Rotate Y');
                    props.push('ADBE Rotate X');
                    props.push('ADBE Orientation');
                    props.push('ADBE Vector Rotation');
                }
                if (scaButton.checked) {
                    props.push('ADBE Scale');
                    props.push('ADBE Vector Scale');
                }
                if (opaButton.checked) {
                    props.push('ADBE Opacity');
                    props.push('ADBE Vector Group Opacity');
                }
                if (masksButton.checked) {
                    props.push('ADBE Mask Parade');
                }
                if (fxButton.checked) {
                    props.push('ADBE Effect Parade');
                }
            }

            Duik.Animation.selectKeyframes(
                comp,
                layerSelectionSelector.index == 0,
                layerTypeSelector.index == 0,
                [inTime, outTime],
                props);
        };
    };

    var copyButton = toolsGroup.addButton(
        i18n._("Copy animation"),
        w12_copy,
        i18n._("Copies selected keyframes.\n\n[Alt]: Cuts the selected keyframes.")
    );
    copyButton.onClick = Duik.Animation.copy;
    copyButton.onAltClick = Duik.Animation.cut;

    var pasteButton = toolsGroup.addButton(
        i18n._("Paste animation"),
        w12_paste,
        i18n._("Paste keyframes.\n\n[Ctrl]: Offset from current values.\n[Alt]: Reverses the keyframes in time."),
        true
    );
    pasteButton.optionsPopup.build = function() {

        var offsetSelector = DuScriptUI.selector(pasteButton.optionsPanel);
        offsetSelector.addButton(
            i18n._("Offset values"),
            w16_offset,
            i18n._("Offset current values.")
        );
        offsetSelector.addButton(
            i18n._("Absolute"),
            w16_locator,
            i18n._("Absolute values (replaces current values).")
        );
        offsetSelector.setCurrentIndex(1);

        var reverseButton = DuScriptUI.checkBox(
            pasteButton.optionsPanel,
            i18n._("Reverse keyframes"),
            undefined,
            i18n._("Reverses the animation in time.")
        );

        var replaceButton = DuScriptUI.checkBox(
            pasteButton.optionsPanel,
            i18n._("Replace existing keyframes"),
            undefined,
            DuScriptUI.StringREPLACE_KEYFRAMES_TIP
        );

        pasteButton.onClick = function() {
            DuAE.beginUndoGroup(i18n._("Paste animation"));
            Duik.Animation.paste(
                undefined,
                replaceButton.checked,
                offsetSelector.index == 0,
                reverseButton.checked
            );
            DuAE.endUndoGroup();
        };
        pasteButton.onCtrlClick = function() {
            DuAE.beginUndoGroup(i18n._("Paste animation"));
            Duik.Animation.paste(undefined, false, true);
            DuAE.endUndoGroup();
        };
        pasteButton.onAltClick = function() {
            DuAE.beginUndoGroup(i18n._("Paste animation"));
            Duik.Animation.paste(undefined, false, false, true);
            DuAE.endUndoGroup();
        };
        pasteButton.onCtrlAltClick = function() {
            DuAE.beginUndoGroup(i18n._("Paste animation"));
            Duik.Animation.paste(undefined, false, true, true);
            DuAE.endUndoGroup();
        };
    };

    var interpolatorButton = toolsGroup.addButton(
        i18n._("Interpolator"),
        w12_interpolator,
        i18n._("Control the selected keyframes with advanced but easy-to-use keyframe interpolation driven by an effect.")
    );
    interpolatorButton.onClick = Duik.Animation.interpolator;

    var moveAnchorPointButton = createMoveAnchorPointButton(toolsGroup, mainGroup, hideAllGroups);
    moveAnchorPointButton.onClick = function() {

        if (!moveAnchorPointGroup.built) {
            buildMoveAnchorPointGroup(moveAnchorPointGroup, animationGroup);
        }

        hideAllGroups();
        moveAnchorPointGroup.visible = true;
    };

    createAlignButton(toolsGroup);

    var snapButton = toolsGroup.addButton(
        i18n._("Snap keys"),
        w12_snap,
        i18n._("Snaps selected (or all) keyframes to the closest frames if they're in between.")
    );
    snapButton.onClick = Duik.Animation.snapKeys;

    var motionTrailButton = toolsGroup.addButton(
        i18n._("Motion trail"),
        w12_motion_trail,
        i18n._("Draws a trail following the selected layers.\n\n[Alt]: Creates a new shape layer for each trail.")
    );
    motionTrailButton.onClick = Duik.Automation.motionTrail;
    motionTrailButton.onAltClick = function() { Duik.Automation.motionTrail(true) };

    var ikFkButton = toolsGroup.addButton({
        text: i18n._("IK/FK Switch"),
        helpTip: i18n._("Switches the selected controller between IK and FK.\nAutomatically adds the needed keyframes at current time."),
        image: w16_ik_fk_switch,
        options: true
    });
    ikFkButton.optionsPopup.build = function() {
        var snapIKButton = DuScriptUI.button( ikFkButton.optionsPanel, {
            text: i18n._("Snap IK"),
            helpTip: i18n._("Snaps the IK to the FK values"),
            image: w16_snap_ik
        });
        snapIKButton.onClick = Duik.Animation.snapIK;
        var snapFKButton = DuScriptUI.button( ikFkButton.optionsPanel, {
            text: i18n._("Snap FK"),
            helpTip: i18n._("Snaps the FK to the IK values"),
            image: w16_snap_fk
        });
        snapFKButton.onClick = Duik.Animation.snapFK;
        ikFkButton.onClick = Duik.Animation.switchIKFK;
    }
    

    var mainGroup = DuScriptUI.group(tab, 'stacked');
    //mainGroup.margins = 3;
    mainGroup.alignment = ['fill', 'fill'];

    var animationGroup = DuScriptUI.group(mainGroup, 'column');
    if (uiMode >= 2) animationGroup.spacing = 3;

    if (uiMode < 2) DuScriptUI.separator( animationGroup, uiMode <= 1 ? i18n._("Tweening") : ''  );

    var tweenTools = DuScriptUI.toolBar(animationGroup, 4);

    var splitKeyButton = tweenTools.addButton(
        i18n._("Split"),
        w16_split_keyframe,
        i18n._("Split the selected keyframes into couples of keyframes with the same value."),
        true
    );
    splitKeyButton.optionsPopup.build = function() {
        var splitKeyDurationEdit = DuScriptUI.editText(
            splitKeyButton.optionsPanel,
            '2',
            i18n._("Duration") + ': ',
            i18n._p("video image", "Frames"), /// TRANSLATORS: as in video frames/images
            '',
            ' ' + i18n._("Set the duration between two split keys."),
            false
        );

        var splitKeyAlignmentSelector = DuScriptUI.selector(splitKeyButton.optionsPanel);
        splitKeyAlignmentSelector.addButton(
            i18n._("Center"),
            w16_align_center,
            i18n._("Align around the current time.")
        );
        splitKeyAlignmentSelector.addButton(
            i18n._("After"),
            w16_align_in,
            i18n._("Add the new key after the current one.")
        );
        splitKeyAlignmentSelector.addButton(
            i18n._("Before"),
            w16_align_out,
            i18n._("Add the new key before the current one.")
        );
        splitKeyAlignmentSelector.setCurrentIndex(0);

        splitKeyButton.onClick = function() {
            var alignment = DuAE.TimeAlignment.CENTER;
            if (splitKeyAlignmentSelector.index == 1) alignment = DuAE.TimeAlignment.IN_POINT;
            else if (splitKeyAlignmentSelector.index == 2) alignment = DuAE.TimeAlignment.OUT_POINT;

            var duration = parseInt(splitKeyDurationEdit.text);

            Duik.Animation.splitKeys(duration, alignment);
        };
    };

    var freezePoseButton = tweenTools.addButton(
        i18n._("Freeze"),
        w16_freeze_pose,
        i18n._("Freezes the pose; copies the previous keyframe to the current time.\n\n[Alt]: Freezes the next pose (copies the next keyframe to the current time)."),
        true
    );
    freezePoseButton.optionsPopup.build = function() {
        var propsSelector = DuScriptUI.selector( freezePoseButton.optionsPanel );
        propsSelector.addButton( i18n._("Animated properties"), w16_animated_prop );
        propsSelector.addButton( i18n._("Selected properties"), w16_selected_props );
        propsSelector.setCurrentIndex(0);
        var layersSelector = DuScriptUI.selector( freezePoseButton.optionsPanel );
        layersSelector.addButton( i18n._("Selected layers"), w16_selected_layers );
        layersSelector.addButton( i18n._("All layers"), w16_layers );
        layersSelector.setCurrentIndex(0);

        freezePoseButton.onClick = function() {
            var animatedProps = propsSelector.index == 0;
            var selectedLayers = layersSelector.index == 0;
            Duik.Animation.freezePose(animatedProps, selectedLayers);
        };
        freezePoseButton.onAltClick = function() {
            var animatedProps = propsSelector.index == 0;
            var selectedLayers = layersSelector.index == 0;
            Duik.Animation.freezePose(animatedProps, selectedLayers, true);
        };
    };

    var syncKeysButton = tweenTools.addButton(
        i18n._("Sync"),
        w16_sync_keys,
        i18n._("Synchronize the selected keyframes; moves them to the current time.\nIf multiple keyframes are selected for the same property, they're offset to the current time, keeping the animation.\n\n[Alt]: Syncs using the last keyframe instead of the first.")
    );
    syncKeysButton.onClick = Duik.Animation.syncKeys; 
    syncKeysButton.onAltClick = function () { Duik.Animation.syncKeys(true); };

    var cleanKeysButton = tweenTools.addButton(
        i18n._("Clean"),
        w16_kleaner,
        i18n._("Remove unneeded keyframes.")
    );
    cleanKeysButton.onClick = Duik.Animation.cleanKeyframes;

    var tweenGroup = DuScriptUI.group( animationGroup, 'row' );

    var tweenSettingsButton = DuScriptUI.button(
        tweenGroup,
        '',
        DuScriptUI.Icon.OPTIONS,
        i18n._("Tweening options")
    );
    tweenSettingsButton.alignment = ['left', 'fill'];
    var tweenOptionsPopup = DuScriptUI.popUp( i18n._("Tweening options") );
    var tweenPropsSelector = DuScriptUI.selector( tweenOptionsPopup.content );
    tweenPropsSelector.addButton( i18n._("Animated properties"), w16_animated_prop );
    tweenPropsSelector.addButton( i18n._("Selected properties"), w16_selected_props );
    tweenPropsSelector.setCurrentIndex(0);
    var tweenLayersSelector = DuScriptUI.selector( tweenOptionsPopup.content );
    tweenLayersSelector.addButton( i18n._("Selected layers"), w16_selected_layers );
    tweenLayersSelector.addButton( i18n._("All layers"), w16_layers );
    tweenLayersSelector.setCurrentIndex(0);
    tweenOptionsPopup.tieTo(tweenSettingsButton);

    var tweenSlider = DuScriptUI.slider(tweenGroup,50,0,100,'column',false,'','%','left',[0,25,33,50,66,75,100]);
    tweenSlider.onChange = function() {
        var animatedProps = tweenPropsSelector.index == 0;
        var selectedLayers = tweenLayersSelector.index == 0;
        Duik.Animation.tween( tweenSlider.value / 100, animatedProps, selectedLayers);
    };

    DuScriptUI.separator( animationGroup, uiMode <= 1 ? i18n._("Temporal interpolation") : '' );

    var keyEditGroup = DuScriptUI.group( animationGroup, 'row' );
    var ksettingsButton = DuScriptUI.button(
        keyEditGroup,
        '',
        DuScriptUI.Icon.OPTIONS,
        i18n._("Set key options")
    );
    ksettingsButton.alignment = ['left', 'fill'];
    var krovingButton = DuScriptUI.button( 
        keyEditGroup,
        '',
        w12_kroving,
        i18n._("Roving")
    );
    krovingButton.onClick = function() {
        if (keyEditModeSelector.index == 0) {
            var animatedProps = keyEditPropsSelector.index == 0;
            var selectedLayers = keyEditLayersSelector.index == 0;
            Duik.Animation.addRovingKey(animatedProps, selectedLayers);
        }
        else 
        {
            Duik.Animation.setRoving();
        }
    };
    var klinButton = DuScriptUI.button( 
        keyEditGroup,
        '',
        w12_klin,
        i18n._("Linear")
    );
    klinButton.onClick = function() {
        if (keyEditModeSelector.index == 0) {
            var animatedProps = keyEditPropsSelector.index == 0;
            var selectedLayers = keyEditLayersSelector.index == 0;
            Duik.Animation.addLinearKey(animatedProps, selectedLayers);
        }
        else 
        {
            Duik.Animation.setLinear();
        }
    };
    var kinbezButton = DuScriptUI.button( 
        keyEditGroup,
        '',
        w12_kinbez,
        i18n._("Ease In")
    );
    kinbezButton.onClick = function() {
        if (keyEditModeSelector.index == 0) {
            var animatedProps = keyEditPropsSelector.index == 0;
            var selectedLayers = keyEditLayersSelector.index == 0;
            Duik.Animation.addEaseInKey(animatedProps, selectedLayers, easeInSlider.value);
        }
        else 
        {
            Duik.Animation.setEaseIn(easeInSlider.value);
        }
    };
    var koutbezButton = DuScriptUI.button( 
        keyEditGroup,
        '',
        w12_koutbez,
        i18n._("Ease Out")
    );
    koutbezButton.onClick = function() {
        if (keyEditModeSelector.index == 0) {
            var animatedProps = keyEditPropsSelector.index == 0;
            var selectedLayers = keyEditLayersSelector.index == 0;
            Duik.Animation.addEaseOutKey(animatedProps, selectedLayers, easeOutSlider.value);
        }
        else 
        {
            Duik.Animation.setEaseOut(easeOutSlider.value);
        }
    };
    var kbezButton = DuScriptUI.button( 
        keyEditGroup,
        '',
        w12_kbez,
        i18n._("Easy Ease")
    );
    kbezButton.onClick = function() {
        if (keyEditModeSelector.index == 0) {
            var animatedProps = keyEditPropsSelector.index == 0;
            var selectedLayers = keyEditLayersSelector.index == 0;
            Duik.Animation.addEasyEaseKey(animatedProps, selectedLayers, easeInSlider.value, easeOutSlider.value);
        }
        else 
        {
            Duik.Animation.setEasyEase(easeInSlider.value, easeOutSlider.value);
        }
    };
    var kautoButton = DuScriptUI.button( 
        keyEditGroup,
        '',
        w12_kauto,
        i18n._("Continuous")
    );
    kautoButton.onClick = function() {
        if (keyEditModeSelector.index == 0) {
            var animatedProps = keyEditPropsSelector.index == 0;
            var selectedLayers = keyEditLayersSelector.index == 0;
            Duik.Animation.addContinuousKey(animatedProps, selectedLayers);
        }
        else 
        {
            Duik.Animation.setContinuous();
        }
    };
    var kholdButton = DuScriptUI.button( 
        keyEditGroup,
        '',
        w12_khold,
        i18n._("Hold")
    );
    kholdButton.onClick = function() {
        if (keyEditModeSelector.index == 0) {
            var animatedProps = keyEditPropsSelector.index == 0;
            var selectedLayers = keyEditLayersSelector.index == 0;
            Duik.Animation.addHoldKey(animatedProps, selectedLayers);
        }
        else 
        {
            Duik.Animation.setHold();
        }
    };

    var keyEditOptionsPopup = DuScriptUI.popUp( i18n._("Keyframe options") );
    var keyEditModeSelector = DuScriptUI.selector( keyEditOptionsPopup.content );
    keyEditModeSelector.addButton( i18n._("Add keyframes"), w12_add );
    keyEditModeSelector.addButton( i18n._("Edit selected keyframes"), w12_edit );
    keyEditModeSelector.setCurrentIndex(1);
    keyEditModeSelector.onChange = function() {
        var i = keyEditModeSelector.index == 0;
        keyEditPropsSelector.enabled = i;
        keyEditLayersSelector.enabled = i;
    }
    var keyEditPropsSelector = DuScriptUI.selector( keyEditOptionsPopup.content );
    keyEditPropsSelector.addButton( i18n._("Animated properties"), w16_animated_prop );
    keyEditPropsSelector.addButton( i18n._("Selected properties"), w16_selected_props );
    keyEditPropsSelector.enabled = false;
    keyEditPropsSelector.setCurrentIndex(0);

    var keyEditLayersSelector = DuScriptUI.selector( keyEditOptionsPopup.content );
    keyEditLayersSelector.addButton( i18n._("Selected layers"), w16_selected_layers );
    keyEditLayersSelector.addButton( i18n._("All layers"), w16_layers );
    keyEditLayersSelector.enabled = false;
    keyEditLayersSelector.setCurrentIndex(0);

    keyEditOptionsPopup.tieTo( ksettingsButton );

    var easePresetsGroup = DuScriptUI.group( animationGroup );
    var easePresetSettingsButton = DuScriptUI.button(
        easePresetsGroup,
        '',
        DuScriptUI.Icon.OPTIONS,
        i18n._("Set key options")
    );
    easePresetSettingsButton.alignment = ['left', 'fill'];
    var easeOptionsPopup = DuScriptUI.popUp( i18n._("Ease options") );
    var easeResetListButton = DuScriptUI.button(
        easeOptionsPopup.content,
        i18n._("Reset preset list"),
        w16_reset,
        i18n._("Resets the preset list to the default values.")
    );
    easeResetListButton.onClick = function() {
        easePresetList.removeAll();
        for(var i = 0; i < defaultEasePresets.length; i++) {
            easePresetList.add('item', defaultEasePresets[i]);
        };
        easePresetList.selection = 0;
        DuESF.scriptSettings.set("easePresets", defaultEasePresets);
        DuESF.scriptSettings.save();
        easeOptionsPopup.hide();
    };
    easeOptionsPopup.tieTo(easePresetSettingsButton);
    var defaultEasePresets = [ i18n._("Ease presets"),
        "25/75 | 0/0", "33/33 | 0/0", "33/33 | 100/100", "33/66 | 0/0", "50/50 | 0/0", "50/50 | 100/100", "66/33 | 0/0", "75/25 | 0/0", "80/80 | 0/0"
    ];
    var presets = DuESF.scriptSettings.get("easePresets", defaultEasePresets);
    var easePresetList = easePresetsGroup.add('dropdownlist',undefined,presets);
    easePresetList.alignment = ['fill', 'top'];
    easePresetList.selection = 0;
    easePresetList.onChange = function() {
        if (!easePresetList.selection) return;
        if (easePresetList.selection.index == 0) return;
        var preset = easePresetList.selection.text;
        var rePreset = /(\d+)\/(\d+) \| (-?\d+)\/(-?\d+)/i;
        var vals = preset.match(rePreset);
        if (vals == null) return;
        if (vals.length != 5) return;
        easeInSlider.setValue( parseInt(vals[1]) );
        easeOutSlider.setValue( parseInt(vals[2]) );
        velocityInSlider.setValue( vals[3] );
        velocityOutSlider.setValue( vals[4] );
        easeLinkButton.setChecked(vals[1] != vals[2]);
        velocityLinkButton.setChecked(vals[3] != vals[4]);
        easeApplyAllButton.onClick();
    }
    var easePresetAddButton = DuScriptUI.button( 
        easePresetsGroup,
        '',
        w12_add,
        i18n._("Add new ease preset")
    );
    easePresetAddButton.alignment = ['right', 'fill'];
    easePresetAddButton.onClick = function() {
        var presets = [];
        for (var i = 1 ; i < easePresetList.items.length ; i++)
        {
            presets.push(easePresetList.items[i].text);
        }
        presets.push(easeInSlider.value + '/' + easeOutSlider.value + ' | ' + velocityInSlider.value + '/' + velocityOutSlider.value);
        presets.sort();
        presets.unshift('Ease presets');
        easePresetList.removeAll();
        for (var i=0;i<presets.length;i++)
        {
            easePresetList.add('item',presets[i]);
        }
        DuESF.scriptSettings.set("easePresets", presets);
        DuESF.scriptSettings.save();
        easePresetList.selection = 0;
    };
    var easePresetRemoveButton = DuScriptUI.button(
        easePresetsGroup,
        '',
        w12_remove,
        i18n._("Remove selected ease preset")
    );
    easePresetRemoveButton.alignment = ['right', 'fill'];
    easePresetRemoveButton.onClick = function() {
        if (!easePresetList.selection) return;
        if (easePresetList.selection.index == 0) return;
        easePresetList.remove(easePresetList.selection);
        var presets = [];
        for (var i = 0 ; i < easePresetList.items.length ; i++)
        {
            presets.push(easePresetList.items[i].text);
        }
        DuESF.scriptSettings.set("easePresets", presets);
        DuESF.scriptSettings.save();
        easePresetList.selection = 0;
    };
    var easePickButton = DuScriptUI.button(
        easePresetsGroup,
        '',
        DuScriptUI.Icon.EYE_DROPPER,
        i18n._("Pick ease and velocity from selected key.")
    );
    easePickButton.alignment = ['right', 'fill'];
    easePickButton.onClick = function() {
        var props = DuAEComp.getSelectedProps();
        var propList = new DuList(props);
        if (props.length == 0) return;

        var propInfo;
        while(propInfo = propList.next()) {
            if (propInfo.isGroup()) continue;
            var prop = propInfo.getProperty();
			if (prop.selectedKeys.length == 0) continue;
			var speed = propInfo.velocityToPercent(prop.selectedKeys[0]);
			var speedIn = speed[0];
			var speedOut = speed[1];
			var easeIn = prop.keyInTemporalEase(prop.selectedKeys[0])[0].influence;
			var easeOut = prop.keyOutTemporalEase(prop.selectedKeys[0])[0].influence;
			easeInSlider.setValue(easeIn);
			easeOutSlider.setValue(easeOut);
			velocityInSlider.setValue(speedIn);
			velocityOutSlider.setValue(speedOut);
			easeLinkButton.setChecked(easeIn != easeOut);
			velocityLinkButton.setChecked(speedIn != speedOut);
			break;
        }
    };
    var easeApplyAllButton = DuScriptUI.button(
        easePresetsGroup,
        '',
        DuScriptUI.Icon.CHECK,
        i18n._("Apply ease and velocity to selected keyframes.")
    );
    easeApplyAllButton.alignment = ['right', 'fill'];
    easeApplyAllButton.onClick = function() {
        DuAE.beginUndoGroup( i18n._("Set ease"));
        easeApplyButton.onClick();
        velocityApplyButton.onClick();
        DuAE.endUndoGroup();
    };

    var easeGroup = DuScriptUI.group(animationGroup, 'row');
    var easeInSlider = DuScriptUI.slider(easeGroup,33,1,100,'column',true,'','%','right',[75,50,33]);
    easeInSlider.onChange = function() {
        easeInSlider.lastModified = true;
		easeOutSlider.lastModified = false;

		if (!easeLinkButton.checked) {
            easeOutSlider.setValue(easeInSlider.value);
            Duik.Animation.setEase( easeInSlider.value, easeOutSlider.value );
        }
        else {
            Duik.Animation.setEase( easeInSlider.value );
        }
    };
    easeInSlider.onChanging = function() {
        if (!easeLinkButton.checked) easeOutSlider.setValue(easeInSlider.value);
    };
    var easeButtonGroup = DuScriptUI.group( easeGroup, 'column' );
    easeButtonGroup.alignment = ['center', 'fill'];
    var easeSwitchButton = DuScriptUI.button(
        easeButtonGroup,
        '',
        w12_switch,
        i18n._("Switches in and out eases.")
    );
    easeSwitchButton.onClick = function() {
        var inVal = easeInSlider.value;
		easeInSlider.setValue(easeOutSlider.value);
		easeOutSlider.setValue(inVal);
		easeApplyButton.onClick();
    };
    var easeLinkButton = DuScriptUI.checkBox(
        easeButtonGroup,
        '',
        w12_constraints,
        '',
        '',
        w12_unlink_chain
    );
    easeLinkButton.onClick = function() {
        if (easeInSlider.lastModified)
		{
			easeOutSlider.setValue(easeInSlider.value);
		}
		else
		{
			easeInSlider.setValue(easeOutSlider.value);
		}
    };
    var easeOutSlider = DuScriptUI.slider(easeGroup,33,1,100,'column',false,'','%','left',[33,50,75]);
    easeOutSlider.onChange = function() {
        easeInSlider.lastModified = false;
		easeOutSlider.lastModified = true;

		if (!easeLinkButton.checked) {
            easeInSlider.setValue(easeOutSlider.value);
            Duik.Animation.setEase( easeInSlider.value, easeOutSlider.value );
        }
        else {
            Duik.Animation.setEase( undefined, easeOutSlider.value );
        }
    };
    easeOutSlider.onChanging = function() {
        if (!easeLinkButton.checked) easeInSlider.setValue(easeOutSlider.value);
    };
    var easeApplyButton = DuScriptUI.button(
        easeGroup,
        '',
        DuScriptUI.Icon.CHECK,
        i18n._("Apply ease to selected keyframes.")
    );
    easeApplyButton.alignment = ['right', 'fill'];
    easeApplyButton.onClick =  function() {
        Duik.Animation.setEase( easeInSlider.value, easeOutSlider.value );
    };

    var velocityGroup = DuScriptUI.group(animationGroup,'row');
    var velocityInSlider = DuScriptUI.slider(velocityGroup,0,-400,400,'column',true,'','%','right',[200,100,0]);
    velocityInSlider.onChange = function() {
        velocityInSlider.lastModified = true;
		velocityOutSlider.lastModified = false;

        if (!velocityLinkButton.checked) {
            velocityOutSlider.setValue(velocityInSlider.value);
            Duik.Animation.setVelocity( velocityInSlider.value, velocityOutSlider.value );
        }
        else {
            Duik.Animation.setVelocity( velocityInSlider.value );
        }
    };
    velocityInSlider.onChanging = function() {
        if (!velocityLinkButton.checked) velocityOutSlider.setValue(velocityInSlider.value);
    };
    var velocityButtonGroup = DuScriptUI.group( velocityGroup, 'column' );
    velocityButtonGroup.alignment = ['center', 'fill'];
    var velocitySwitchButton = DuScriptUI.button(
        velocityButtonGroup,
        '',
        w12_switch,
        i18n._("Switches in and out velocities.")
    );
    velocitySwitchButton.onClick = function() {
        var inVal = velocityInSlider.value;
		velocityInSlider.setValue(velocityOutSlider.value);
		velocityOutSlider.setValue(inVal);
		velocityApplyButton.onClick();
    }
    var velocityLinkButton = DuScriptUI.checkBox(
        velocityButtonGroup,
        '',
        w12_constraints,
        '',
        '',
        w12_unlink_chain
    );
    velocityLinkButton.onClick = function() {
        if (velocityInSlider.lastModified)
		{
			velocityOutSlider.setValue(velocityInSlider.value);
		}
		else
		{
			velocityInSlider.setValue(velocityOutSlider.value);
		}
    };
    var velocityOutSlider = DuScriptUI.slider(velocityGroup,0,-400,400,'column',false,'','%','left',[0, 100, 200]);
    velocityOutSlider.onChange = function() {
        velocityInSlider.lastModified = false;
		velocityOutSlider.lastModified = true;

        if (!velocityLinkButton.checked) {
            velocityInSlider.setValue(velocityOutSlider.value);
            Duik.Animation.setVelocity( velocityInSlider.value, velocityOutSlider.value );
        }
        else {
            Duik.Animation.setVelocity( undefined, velocityOutSlider.value );
        }
    };
    velocityOutSlider.onChanging = function() {
        if (!velocityLinkButton.checked) velocityInSlider.setValue(velocityOutSlider.value);
    };
    var velocityApplyButton = DuScriptUI.button(
        velocityGroup,
        '',
        DuScriptUI.Icon.CHECK,
        i18n._("Apply velocity to selected keyframes.")
    );
    velocityApplyButton.alignment = ['right', 'fill'];
    velocityApplyButton.onClick = function() {
        Duik.Animation.setVelocity( velocityInSlider.value, velocityOutSlider.value );
    };

    DuScriptUI.separator( animationGroup, uiMode <= 1 ? i18n._("Spatial interpolation") : '' );

    var spatialInterpolationGroup = DuScriptUI.group( animationGroup, 'row' );

    var spatialLinButton = DuScriptUI.button(
        spatialInterpolationGroup,
        '',
        w16_linear,
        i18n._("Set the spatial interpolation to linear for selected keyframes.")
    );
    spatialLinButton.onClick = Duik.Animation.setSpatialLinear;
    var spatialBezierInOutButton = DuScriptUI.button(
        spatialInterpolationGroup,
        '',
        w16_bezier_in_out,
        i18n._("Set the spatial interpolation to B\u00e9zier for selected keyframes.")
    );
    spatialBezierInOutButton.onClick = Duik.Animation.setSpatialBezier;
    var spatialBezierOutButton = DuScriptUI.button(
        spatialInterpolationGroup,
        '',
        w16_bezier_out,
        i18n._("Set the spatial interpolation to B\u00e9zier Out for selected keyframes.")
    );
    spatialBezierOutButton.onClick = Duik.Animation.setSpatialBezierOut;
    var spatialBezierInButton = DuScriptUI.button(
        spatialInterpolationGroup,
        '',
        w16_bezier_in,
        i18n._("Set the spatial interpolation to B\u00e9zier In for selected keyframes.")
    );
    spatialBezierInButton.onClick = Duik.Animation.setSpatialBezierIn;
    var spatialAutoButton = DuScriptUI.button(
        spatialInterpolationGroup,
        uiMode >= 2 ? '': i18n._("Fix"),
        w16_autorig,
        i18n._("Automatically fix spatial interpolation for selected keyframes.")
    );
    spatialAutoButton.onClick = Duik.Animation.fixSpatialInterpolation;

    DuScriptUI.separator( animationGroup );

    var line1 = DuScriptUI.group(animationGroup, uiMode >= 2 ? 'row' : 'column');

    var animationLibButton = DuScriptUI.button(
        line1,
        i18n._("Animation library") + '...',
        w16_library,
        i18n._("Quickly save, export, import and apply animations from predefined folders.")
    );
    animationLibButton.onClick = function() {
        var folderURI = DuESF.scriptSettings.get("animationLibFolder", DuESF.scriptSettings.file.parent.absoluteURI + '/' + i18n._("Animation library"));
        var libFolder = new Folder(folderURI);
        if (!libFolder.exists) libFolder.create();

        if (!animationLibGroup.built) {
            createSubPanel(
                animationLibGroup,
                i18n._("Animation library"),
                animationGroup,
                false
            );

            #include "animationLibPanel.jsx"
            buildAnimationLibPanel( animationLibGroup );

            DuScriptUI.showUI(animationLibGroup);
        }

        hideAllGroups();
        animationLibGroup.visible = true;
    }

    createKleanerButton( line1 );

    var sequenceButton = DuScriptUI.button(
        line1,
        i18n._("Sequence"),
        w16_sequencer,
        i18n._("Sequence layers or keyframes.\n\n[Ctrl]: Sequence keyframes instead of layers\n[Alt]: Reverse"),
        true, // option panel
        undefined, // orientation
        undefined, // alignment
        undefined, // localize
        undefined, // ingore ui mode
        undefined, // options without button
        undefined, // options button text
        true // options without panel
    );
    sequenceButton.onOptions = function(showUI) {
        showUI = def(showUI, true);

        if (!sequenceGroup.built){
            createSubPanel(
                sequenceGroup,
                i18n._("Sequence"),
                animationGroup,
                false
            );

            var layerKeySelector = DuScriptUI.selector( sequenceGroup );
            layerKeySelector.addButton(
                i18n._("Layers"),
                w16_layers
            );
            layerKeySelector.addButton(
                i18n._("Keyframes"),
                w16_keyframe
            );
            layerKeySelector.setCurrentIndex(0);
            layerKeySelector.onChange = function() {
                layerModeSelector.visible = layerKeySelector.index == 0;
            };

            var layerModeSelector = DuScriptUI.selector( sequenceGroup );

            layerModeSelector.addButton(
                i18n._("Times"),
                w16_sequencer_times
            );
            layerModeSelector.addButton(
                i18n._("In points"),
                w16_sequencer
            );
            layerModeSelector.addButton(
                i18n._("Out points"),
                w16_sequencer_out
            );
            layerModeSelector.setCurrentIndex(0);

            var shapeSelector = DuScriptUI.selector( sequenceGroup );
            shapeSelector.addButton(
                i18n._("Linear"),
                w16_linear_interpolation
            );
            shapeSelector.addButton(
                i18n._("Ease - Sigmoid (logistic)"),
                w16_interpolator
            );
            shapeSelector.addButton(
                i18n._("Natural - Bell (gaussian)"),
                w16_gaussian_interpolation
            );
            shapeSelector.addButton(
                i18n._("Ease In (logarithmic)"),
                w16_logarithmic_interpolation
            );
            shapeSelector.addButton(
                i18n._("Ease Out (exponential)"),
                w16_exponential_interpolation
            );
            shapeSelector.setCurrentIndex(2);

            var durationEdit = DuScriptUI.editText(
                sequenceGroup,
                '24',
                i18n._n("Duration:") + ' ',
                ' ' + i18n._p("video image", "Frames"), /// TRANSLATORS: as in video frames/images
                '',
                '',
                false
            );

            var rateSlider = DuScriptUI.slider(
                sequenceGroup,
                30,
                0,
                100,
                'row',
                false,
                i18n._p("interpolation", "Rate") /// TRANSLATORS: a rate used in an interpolation, how fast/slow is the interpolation
            );

            DuScriptUI.separator(sequenceGroup);

            var okButton = DuScriptUI.button(
                sequenceGroup,
                i18n._("Sequence"),
                DuScriptUI.Icon.CHECK,
                i18n._("Sequence layers or keyframes.\n\n[Ctrl]: Sequence keyframes instead of layers\n[Alt]: Reverse"),
                false,
                'row',
                'center'
            );
            okButton.onClick = function() {
                var moveLayers = layerModeSelector.index == 0;
                var inPoints = layerModeSelector.index == 1;

                var duration = parseInt(durationEdit.text);
                if (isNaN(duration)) duration = 24;

                if (layerKeySelector.index == 0) Duik.Animation.sequenceLayers(duration, moveLayers, inPoints, false, getInterpolation());
                else Duik.Animation.sequenceKeys(duration, false, getInterpolation());
            };
            sequenceButton.onClick = function() {
                var moveLayers = layerModeSelector.index == 0;
                var inPoints = layerModeSelector.index == 1;

                var duration = parseInt(durationEdit.text);
                if (isNaN(duration)) duration = 24;

                Duik.Animation.sequenceLayers(duration, moveLayers, inPoints, false, getInterpolation());
            };
            okButton.onAltClick = function() {
                var moveLayers = layerModeSelector.index == 0;
                var inPoints = layerModeSelector.index == 1;

                var duration = parseInt(durationEdit.text);
                if (isNaN(duration)) duration = 24;

                if (layerKeySelector.index == 0) Duik.Animation.sequenceLayers(duration, moveLayers, inPoints, true, getInterpolation());
                else Duik.Animation.sequenceKeys(duration, true, getInterpolation());
            };
            sequenceButton.onAltClick = function() {
                var moveLayers = layerModeSelector.index == 0;
                var inPoints = layerModeSelector.index == 1;

                var duration = parseInt(durationEdit.text);
                if (isNaN(duration)) duration = 24;

                Duik.Animation.sequenceLayers(duration, moveLayers, inPoints, true, getInterpolation());
            };

            sequenceButton.onCtrlClick = okButton.onCtrlClick = function() {
                var moveLayers = layerModeSelector.index == 0;
                var inPoints = layerModeSelector.index == 1;

                var duration = parseInt(durationEdit.text);
                if (isNaN(duration)) duration = 24;

                Duik.Animation.sequenceKeys(duration, false, getInterpolation());
            };
            sequenceButton.onCtrlAltClick = okButton.onCtrlAltClick = function() {
                var moveLayers = layerModeSelector.index == 0;
                var inPoints = layerModeSelector.index == 1;

                var duration = parseInt(durationEdit.text);
                if (isNaN(duration)) duration = 24;

                Duik.Animation.sequenceKeys(duration, true, getInterpolation());
            };

            function getInterpolation() {

                // For now, approximate with a Bezier function
                var rate = rateSlider.value / 100;
                var s = shapeSelector.index;
                if (s == 0) return DuInterpolation.linear;

                if (s == 1) { // S
                    return function(t, tm, tM, vm, vM) {
                        return DuInterpolation.bezier(t, tm, tM, vm, vM, [0, rate, 1, 1-rate]);
                    };
                }
                if (s == 2) { // B
                    //var outRate = 
                    return function(t, tm, tM, vm, vM) {
                        return DuInterpolation.bezier(t, tm, tM, vm, vM, [0, rate, 1, rate]);
                    };
                }
                if (s == 3) { // Log
                    //var outRate = 
                    return function(t, tm, tM, vm, vM) {
                        return DuInterpolation.bezier(t, tm, tM, vm, vM, [0, 0, 1, 1-rate]);
                    };
                }
                if (s == 4) { // exp
                    //var outRate = 
                    return function(t, tm, tM, vm, vM) {
                        return DuInterpolation.bezier(t, tm, tM, vm, vM, [0, rate, 1, 1]);
                    };
                }

                /*
                if (s == 1) {
                    rate = DuInterpolation.linear(rate, 0, 20, 0, 1);
                    return function(t, tm, tM, vm, vM) { return DuInterpolation.logistic(t, tm, tM, vm, vM, rate); };
                }
                if (s == 2) return DuInterpolation.inverseGaussian;
                if (s == 3) return DuInterpolation.logarithmic;
                if (s == 4) return DuInterpolation.exponential;
                return DuInterpolation.gaussian;*/
            }

            DuScriptUI.showUI(sequenceGroup);
        }
        if (showUI) {
            hideAllGroups();
            sequenceGroup.visible = true;
        }
    }

    createXSheetButton( line1 );

    var nlaButton = DuScriptUI.button( line1,
        {
            text: i18n._("Non-linear animation"),
            image: w16_nla,
            helpTip: i18n._("Edit animations together."),
            addOptionsPanel: true,
            options: true,
            optionsWithoutButton: true
        }
    );
    nlaButton.onClick = Duik.Automation.setupNLA;
    nlaButton.optionsPopup.build = function() {
        var clipButton = DuScriptUI.button(
            nlaButton.optionsPanel,
            i18n._("Add new clip"),
            w12_add,
            i18n._("Create a new clip from the original comp and adds it to the 'NLA.Edit' comp.")
        );
        clipButton.onClick = Duik.Automation.addNLAClip;
    }

    var celAnimationButton = DuScriptUI.button(
        line1,
        i18n._("Cel animation..."), /// TRANSLATORS: i.e. traditional animation
        w16_cel_animation,
        i18n._("Tools to help traditionnal animation using After Effects' paint effect with the brush tool."),
    );
    celAnimationButton.onClick = function() {
        if (!celAnimationGroup.built) {
            createSubPanel(
                celAnimationGroup,
                i18n._("Cel animation"), /// TRANSLATORS: i.e. traditional animation
                animationGroup,
                false
            );

            var newCelButton = DuScriptUI.button(
                celAnimationGroup,
                i18n._("New Cel."), /// TRANSLATORS: a (transparent) layer/celluloid in a traditional animation
                w16_new_cel,
                i18n._("Create a new animation cel.\n\n[Alt]: Creates on the selected layer instead of adding a new layer.") /// TRANSLATORS: Cel. is a (transparent) layer/celluloid in a traditional animation
            );
            newCelButton.onClick = Duik.Animation.newCel;
            newCelButton.onAltClick = function() { Duik.Animation.newCel(true) };

            DuScriptUI.separator(celAnimationGroup);

            var onionSkinGroup = DuScriptUI.group( celAnimationGroup, 'row');

            var onionSkinButton = DuScriptUI.checkBox(
                onionSkinGroup,
                i18n._("Onion skin"),
                w16_onion_skin,
                i18n._("Shows the previous and next frames with a reduced opacity.")
            );
            onionSkinButton.alignment = ['left', 'fill'];
            onionSkinButton.setChecked(true);
            onionSkinButton.onClick = function() {
                if (onionSkinButton.checked) {
                    onionInGroup.enabled = true;
                    onionOutGroup.enabled = true;
                    onionSkinEdit.enabled = true;
                }
                else {
                    onionInGroup.enabled = false;
                    onionOutGroup.enabled = false
                    onionSkinEdit.enabled = false;
                }

                var i = onionInSlider.value;
                var o = onionOutSlider.value;
                if (!onionInButton.checked) i = 0;
                if (!onionOutButton.checked) o = 0;

                var f = parseInt( onionSkinEdit.text );
                var e = parseInt( frameEditButton.text );

                Duik.Animation.celOnionSkin( onionSkinButton.checked, f, e, i, o);
            };
            
            var onionSkinEdit = DuScriptUI.editText(
                onionSkinGroup,
                '5',
                '',
                ' ' + i18n._p("video image", "Frames"), /// TRANSLATORS: as in video frames/images
                '',
                '',
                false
            );
            onionSkinEdit.onChange = onionSkinButton.onClick;

            var onionInGroup = DuScriptUI.group( celAnimationGroup, 'row');

            var onionInButton = DuScriptUI.checkBox(
                onionInGroup,
                i18n._p("time", "In")
            );
            onionInButton.setChecked(true);
            onionInButton.alignment = ['left', 'fill'];
            onionInButton.onClick = function() {
                onionInSlider.enabled = onionInButton.checked;
                onionSkinButton.onClick();
            };

            var onionInSlider = DuScriptUI.slider(
                onionInGroup,
                50,
                0,
                100,
                'row',
                undefined,
                '',
                '%'
            );
            onionInSlider.onChange = onionSkinButton.onClick;

            var onionOutGroup = DuScriptUI.group( celAnimationGroup, 'row');

            var onionOutButton = DuScriptUI.checkBox(
                onionOutGroup,
                i18n._p("time", "Out")
            );
            onionOutButton.setChecked(true);
            onionOutButton.alignment = ['left', 'fill'];
            onionOutButton.onClick = function() {
                onionOutSlider.enabled = onionOutButton.checked;
                onionSkinButton.onClick();
            };

            var onionOutSlider = DuScriptUI.slider(
                onionOutGroup,
                50,
                0,
                100,
                'row',
                undefined,
                '',
                '%'
            );
            onionOutSlider.onChange = onionSkinButton.onClick;

            DuScriptUI.separator(celAnimationGroup);

            var celFrameGroup = DuScriptUI.group( celAnimationGroup, 'row');

            var prevFrameButton = DuScriptUI.button(
                celFrameGroup,
                '',
                w16_previous_frame,
                i18n._("Go to the previous frame")
            );
            prevFrameButton.onClick = function() {
                var e = parseInt( frameEditButton.text );
                Duik.Animation.previousCel(e);
            };

            var frameEditButton = DuScriptUI.editText(
                celFrameGroup,
                '2',
                i18n._p("animation", "Exposure:") + ' ', /// TRANSLATORS: animation exposure (the duration of each frame)
                ' ' + i18n._p("video image", "Frames"),
                '',
                i18n._("Changes the exposure of the animation (the frames per second)."),
                false
            );

            var nextFrameButton = DuScriptUI.button(
                celFrameGroup,
                '',
                w16_next_frame,
                i18n._("Go to the next frame.")
            );
            nextFrameButton.onClick = function() {
                var e = parseInt( frameEditButton.text );
                Duik.Animation.nextCel(e);
            };

            DuScriptUI.showUI(celAnimationGroup);
        }

        hideAllGroups();
        celAnimationGroup.visible = true;
    };

    var animationLibGroup = DuScriptUI.group(mainGroup, 'column');
    animationLibGroup.visible = false;
    animationLibGroup.built = false;

    var moveAnchorPointGroup = DuScriptUI.group(mainGroup, 'column');
    moveAnchorPointGroup.visible = false;
    moveAnchorPointGroup.built = false;

    var celAnimationGroup = DuScriptUI.group(mainGroup, 'column');
    celAnimationGroup.visible = false;
    celAnimationGroup.built = false;

    var sequenceGroup = DuScriptUI.group(mainGroup, 'column');
    sequenceGroup.visible = false;
    sequenceGroup.built = false;
    //*/
}