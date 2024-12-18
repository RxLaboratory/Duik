function buildAutomationPanelUI(tab, standAlone ) {
    standAlone = def(standAlone, false);

    // Some strings
    var precisionFactorTip = i18n._("A higher factor → a higher precision.\n\n• Smart mode: lower the factor to keep keyframes only for extreme values. Increasing the factor helps to get a more precise curve with inflexion keyframes.\n\n• Precise mode: A factor higher than 1.0 increases the precision to sub-frame sampling (2 → two samples per frame).\nA factor lower than 1.0 decreases the precision so that less frames are sampled (0.5 → half of the frames are sampled).\nDecrease the precision to make the process faster, increase it if you need a more precise motion-blur, for example.");

    // Useful methods
    function hideAllGroups() {
        automationGroup.visible = false;
        expressionToolsGroup.visible = false;
        effectorMapGroup.visible = false;
        randomizeGroup.visible  = false;
        walkCycleGroup.visible = false;
    }

    if (!standAlone) {
        // A Spacer
        var spacer = tab.add('group');
        spacer.margins = 0;
        spacer.spacing = 0;
        spacer.size = [-1, 3];

        // A title
        DuScriptUI.staticText(tab, i18n._("Automation and expressions")).alignment = ['center', 'top'];
    }    

    // tools
    var toolsGroup = DuScriptUI.toolBar(tab);

    createListButton( toolsGroup );

    var separateButton = toolsGroup.addButton(
        i18n._("Split values"),
        w12_separate_dimensions,
        i18n._("Separate the dimensions of the selected properties.\nAlso works with colors, separated to RGB or HSL.")
    );
    separateButton.onClick = Duik.Constraint.separateDimensions;

    var removeExpButton = toolsGroup.addButton(
        i18n._("Toggle expressions"),
        w12_disable_expression,
        i18n._("Toggle expressions, or remove them keeping the post-expression value on all selected properties.\n\n[Ctrl]: Remove expressions instead of just disabling.\n[Alt]: Remove expressions but keep the pre-expression value (After Effects default).")
    );
    removeExpButton.onClick = Duik.Automation.toggleExpressions;
    removeExpButton.onAltClick = function() {
        Duik.Automation.removeExpressions(false);
    };
    removeExpButton.onCtrlClick = Duik.Automation.removeExpressions

    var expressionToolsButton = toolsGroup.addButton(
        i18n._("Expression tools"),
        w12_expression,
        i18n._("Various tools to fix and work with expressions")
    );
    expressionToolsButton.onClick = function() {
        if (!expressionToolsGroup.built) {
            var titleBar = createSubPanel(
                expressionToolsGroup,
                i18n._("Expression tools"),
                automationGroup,
                false
            );

            var layerSelector = DuScriptUI.selectionModeSelector(expressionToolsGroup);
            layerSelector.setCurrentIndex(2);

            DuScriptUI.staticText(
                expressionToolsGroup,
                "thisComp"
            );

            var compGroup = DuScriptUI.group(expressionToolsGroup);

            var removeThisCompButton = DuScriptUI.button(
                compGroup,
                i18n._("Remove"),
                DuScriptUI.Icon.CLOSE,
                i18n._("Replace all occurences of %1 by %2.", "'thisComp'", "'comp(\"name\")'" )
            );
            removeThisCompButton.onClick = function() {
                Duik.Constraint.removeThisCompInExpressions(layerSelector.index);
            }

            var useThisCompButton = DuScriptUI.button(
                compGroup,
                i18n._("Use"),
                DuScriptUI.Icon.CHECK,
                i18n._("Replace all occurences of %1 by %2.", "'comp(\"name\")'", "'thisComp'")
            );
            useThisCompButton.onClick = function() {
                Duik.Constraint.removeCompInExpressions(layerSelector.index);
            }

            DuScriptUI.staticText(
                expressionToolsGroup,
                "thisLayer"
            );

            var layerGroup = DuScriptUI.group(expressionToolsGroup);

            var removeThisLayerButton = DuScriptUI.button(
                layerGroup,
                i18n._("Remove"),
                DuScriptUI.Icon.CLOSE,
                i18n._("Replace all occurences of %1 by %2.", "'thisLayer'", "'layer(\"name\")'")
            );
            removeThisLayerButton.onClick = function() {
                Duik.Constraint.removeThisLayerInExpressions(layerSelector.index);
            }

            var useThisLayerButton = DuScriptUI.button(
                layerGroup,
                i18n._("Use"),
                DuScriptUI.Icon.CHECK,
                i18n._("Replace all occurences of %1 by %2.", "'layer(\"name\")'", "'thisLayer'")
            );
            useThisLayerButton.onClick = function() {
                Duik.Constraint.removeLayerInExpressions(layerSelector.index);
            }

            expressionToolsGroup.built = true;

            DuScriptUI.showUI(expressionToolsGroup);
        }

        hideAllGroups();
        expressionToolsGroup.visible = true;
    }

    var copyExpButton = toolsGroup.addButton(
        i18n._("Copy expression"),
        w12_copy_expression,
        i18n._("Copy the expression from the selected property.")
    );
    copyExpButton.onClick = Duik.Automation.copyExpression;

    var pasteExpButton = toolsGroup.addButton(
        i18n._("Paste expression"),
        w12_paste_expression,
        i18n._("Paste the expression in all selected properties.")
    );
    pasteExpButton.onClick = Duik.Automation.pasteExpression;

    var editExpressionButton = toolsGroup.addButton(
        i18n._("Edit expression"),
        w12_expression_file,
        i18n._("Use an external editor to edit the selected expression.\n\n[Ctrl]: Reloads the expressions from the external editor."),
        true
    );
    editExpressionButton.optionsPopup.build = function() {

        var editorSelector = DuScriptUI.fileSelector(
            editExpressionButton.optionsPanel,
            i18n._("Open expressions with..."),
            true,
            i18n._("Select an application to open the expressions.\nLeave the field empty to use the system default for '.jsxinc' files."), /// TRANSLATORS: "System" stands for Operating System here.
            undefined,
            'open',
            undefined,
            'column'
        );
        editorSelector.onChange = function() {
            var f = editorSelector.getFile();
            if (!f && editorSelector.editText.text != "") return;
            if (f) DuESF.scriptSettings.set("expression/expressionEditor", f.absoluteURI);
            else DuESF.scriptSettings.set("expression/expressionEditor", "" );
            DuESF.scriptSettings.save();
        };

        editorSelector.setPath( DuESF.scriptSettings.get("expression/expressionEditor", "" ) );
        editorSelector.setPlaceholder( i18n._("System default") );

        editExpressionButton.onClick = function() {
            Duik.Tool.editExpression();
        };

        editExpressionButton.onCtrlClick = function() {
            Duik.Tool.reloadExpressions();
        };
    };

    var randomizeButton = toolsGroup.addButton(
        i18n._("Randomize") + "...",
        w12_randomize,
        i18n._("Set a random value to the selected properties, keyframes or layers.")
    );
    randomizeButton.onClick = function() {
        if (!randomizeGroup.built) {

            createSubPanel(
                randomizeGroup,
                i18n._("Randomize"),
                automationGroup,
                false
            );

            var attrSelector = DuScriptUI.selector( randomizeGroup );
            attrSelector.addButton(
                i18n._("Current values"),
                w16_values,
                i18n._("Values of the properties at the current time")
            );
            attrSelector.addButton(
                i18n._("Layer attributes"),
                w16_layers,
                i18n._("Attributes of the layers.")
            );
            attrSelector.addButton(
                i18n._("Keyframes"),
                w16_keyframe,
                i18n._("Keyframes (value and time).")
            );
            attrSelector.setCurrentIndex(0);
            attrSelector.onChange = function() {
                var i = attrSelector.index;
                valuesGroup.visible = i == 0;
                layersGroup.visible = i == 1;
                keysGroup.visible = i == 2;
            }

            var modeSelector = DuScriptUI.selector( randomizeGroup );
            modeSelector.addButton(
                i18n._("Natural (gaussian)"),
                w16_gaussian,
                i18n._("Uses an algorithm with a natural result (using the Gaussian bell-shaped function).\nA few values may be out of range.")
            );
            modeSelector.addButton(
                i18n._("Strict"),
                w16_strict,
                i18n._("Uses strict values.")
            );
            modeSelector.setCurrentIndex(0);

            var offsetSelector = DuScriptUI.selector( randomizeGroup );
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
            offsetSelector.setCurrentIndex(0);
            offsetSelector.onChange = function() {
                if ( offsetSelector.index == 0 ) {
                    if ( valuesSeparateSelector.index == 0 ) valuesXLabel.text = "V + ";
                    else valuesXLabel.text = "X + ";
                    valuesYLabel.text = "Y + ";
                    valuesZLabel.text = "Z + ";
                    layersVLabel.text = "V + ";
                    if ( keysSeparateSelector.index == 0 || keysSelector.index == 0 ) keysXLabel.text = "V + ";
                    else keysXLabel.text = "X + ";
                    keysYLabel.text = "Y + ";
                    keysZLabel.text = "Z + ";
                }
                else {
                    if ( valuesSeparateSelector.index == 0 ) valuesXLabel.text = "V = ";
                    else valuesXLabel.text = "X = ";
                    valuesYLabel.text = "Y = ";
                    valuesZLabel.text = "Z = ";
                    layersVLabel.text = "V = ";
                    if ( keysSeparateSelector.index == 0 || keysSelector.index == 0 ) keysXLabel.text = "V = ";
                    else keysXLabel.text = "X = ";
                    keysYLabel.text = "Y = ";
                    keysZLabel.text = "Z = ";
                }
            }

            var stack = DuScriptUI.group( randomizeGroup, 'stack');

            var valuesGroup = DuScriptUI.group(stack, 'column');

            var valuesSeparateSelector = DuScriptUI.selector(valuesGroup);
            valuesSeparateSelector.addButton(
                i18n._("Collapse dimensions"),
                w16_collapse_dimensions,
                i18n._("Controls all dimensions or channels with a single value.")
            );
            valuesSeparateSelector.addButton(
                i18n._("Split values"),
                w16_separate_dimensions,
                i18n._("Separate all dimensions or channels to control them individually.")
            );
            valuesSeparateSelector.setCurrentIndex(1);
            valuesSeparateSelector.onChange = function() {
                if ( valuesSeparateSelector.index == 0 ) {
                    valuesYGroup.visible = false;
                    valuesZGroup.visible = false;
                }
                else {
                    valuesYGroup.visible = true;
                    valuesZGroup.visible = true;
                }
                offsetSelector.onChange();
            };

            var valuesXGroup = DuScriptUI.group( valuesGroup );
            var valuesXLabel = valuesXGroup.add('statictext', undefined, "X + ");
            valuesXLabel.alignment = ['fill', 'fill'];

            var valuesXMinEdit = DuScriptUI.editText(
                valuesXGroup,
                '',
                '',
                '',
                'Min'
            );
            valuesXMinEdit.alignment = ['fill', 'fill'];
            var valuesXMaxEdit = DuScriptUI.editText(
                valuesXGroup,
                '',
                '',
                '',
                'Max'
            );
            valuesXMaxEdit.alignment = ['fill', 'fill'];

            var valuesYGroup = DuScriptUI.group( valuesGroup );
            var valuesYLabel = valuesYGroup.add('statictext', undefined, "Y + ");
            valuesYLabel.alignment = ['fill', 'fill'];

            var valuesYMinEdit = DuScriptUI.editText(
                valuesYGroup,
                '',
                '',
                '',
                'Min'
            );
            valuesYMinEdit.alignment = ['fill', 'fill'];
            var valuesYMaxEdit = DuScriptUI.editText(
                valuesYGroup,
                '',
                '',
                '',
                'Max'
            );
            valuesYMaxEdit.alignment = ['fill', 'fill'];

            var valuesZGroup = DuScriptUI.group( valuesGroup );
            var valuesZLabel = valuesZGroup.add('statictext', undefined, "Z + ");
            valuesZLabel.alignment = ['fill', 'fill'];

            var valuesZMinEdit = DuScriptUI.editText(
                valuesZGroup,
                '',
                '',
                '',
                'Min'
            );
            valuesZMinEdit.alignment = ['fill', 'fill'];
            var valuesZMaxEdit = DuScriptUI.editText(
                valuesZGroup,
                '',
                '',
                '',
                'Max'
            );
            valuesZMaxEdit.alignment = ['fill', 'fill'];

            var layersGroup = DuScriptUI.group(stack, 'column');
            layersGroup.visible = false;

            var layersIndicesButton = DuScriptUI.checkBox(
                layersGroup,
                i18n._("Indices"),
                w16_indices_random
            );

            var layersTimeButton = DuScriptUI.checkBox(
                layersGroup,
                i18n._("Times"),
                w16_times_random
            );
            layersTimeButton.setChecked(true);

            var layersInButton = DuScriptUI.checkBox(
                layersGroup,
                i18n._("In points"),
                w16_in_points_random
            );

            var layersOutButton = DuScriptUI.checkBox(
                layersGroup,
                i18n._("Out points"),
                w16_out_points_random
            );

            var layersVGroup = DuScriptUI.group( layersGroup );
            var layersVLabel = layersVGroup.add('statictext', undefined, "V + ");
            layersVLabel.alignment = ['fill', 'fill'];

            var layersVMinEdit = DuScriptUI.editText(
                layersVGroup,
                '',
                '',
                '',
                'Min'
            );
            layersVMinEdit.alignment = ['fill', 'fill'];
            var layersVMaxEdit = DuScriptUI.editText(
                layersVGroup,
                '',
                '',
                '',
                'Max'
            );
            layersVMaxEdit.alignment = ['fill', 'fill'];

            var keysGroup = DuScriptUI.group(stack, 'column');
            keysGroup.visible = false;

            var keysSelector = DuScriptUI.selector( keysGroup );

            keysSelector.addButton(
                i18n._("Times"),
                w16_keyframe_times_random
            );
            keysSelector.addButton(
                i18n._("Values"),
                w16_random
            );
            keysSelector.setCurrentIndex( 1 );
            keysSelector.onChange = function () {
                if (keysSelector.index == 0) {
                    keysYGroup.visible = false;
                    keysZGroup.visible = false;
                    keysSeparateSelector.visible = false;
                } else {
                    var i = keysSeparateSelector.index == 1;
                    keysYGroup.visible = i;
                    keysZGroup.visible = i;
                    keysSeparateSelector.visible = true;
                }
                offsetSelector.onChange();
            };

            var keysSeparateSelector = DuScriptUI.selector(keysGroup);
            keysSeparateSelector.addButton(
                i18n._("Collapse dimensions"),
                w16_collapse_dimensions,
                i18n._("Control all dimensions or channels with a single value.")
            );
            keysSeparateSelector.addButton(
                i18n._("Split values"),
                w16_separate_dimensions,
                i18n._("Separate all dimensions or channels to control them individually.")
            );
            keysSeparateSelector.setCurrentIndex(1);
            keysSeparateSelector.onChange = function() {
                if ( keysSeparateSelector.index == 0 ) {
                    keysYGroup.visible = false;
                    keysZGroup.visible = false;
                }
                else {
                    keysYGroup.visible = true;
                    keysZGroup.visible = true;
                }
                offsetSelector.onChange();
            };

            var keysXGroup = DuScriptUI.group( keysGroup );
            var keysXLabel = keysXGroup.add('statictext', undefined, "X + ");
            keysXLabel.alignment = ['fill', 'fill'];

            var keysXMinEdit = DuScriptUI.editText(
                keysXGroup,
                '',
                '',
                '',
                i18n._('Min') /// TRANSLATORS: short for Minimum
            );
            keysXMinEdit.alignment = ['fill', 'fill'];
            var keysXMaxEdit = DuScriptUI.editText(
                keysXGroup,
                '',
                '',
                '',
                i18n._('Max') /// TRANSLATORS: short for Maximum
            );
            keysXMaxEdit.alignment = ['fill', 'fill'];

            var keysYGroup = DuScriptUI.group( keysGroup );
            var keysYLabel = keysYGroup.add('statictext', undefined, "Y + ");
            keysYLabel.alignment = ['fill', 'fill'];

            var keysYMinEdit = DuScriptUI.editText(
                keysYGroup,
                '',
                '',
                '',
                i18n._('Min')
            );
            keysYMinEdit.alignment = ['fill', 'fill'];
            var keysYMaxEdit = DuScriptUI.editText(
                keysYGroup,
                '',
                '',
                '',
                i18n._('Max')
            );
            keysYMaxEdit.alignment = ['fill', 'fill'];

            var keysZGroup = DuScriptUI.group( keysGroup );
            var keysZLabel = keysZGroup.add('statictext', undefined, "Z + ");
            keysZLabel.alignment = ['fill', 'fill'];

            var keysZMinEdit = DuScriptUI.editText(
                keysZGroup,
                '',
                '',
                '',
                i18n._('Min')
            );
            keysZMinEdit.alignment = ['fill', 'fill'];
            var keysZMaxEdit = DuScriptUI.editText(
                keysZGroup,
                '',
                '',
                '',
                i18n._('Max')
            );
            keysZMaxEdit.alignment = ['fill', 'fill'];


            DuScriptUI.separator( randomizeGroup );
            var okButton = DuScriptUI.button(
                randomizeGroup,
                i18n._("Randomize"),
                w12_randomize,
                i18n._("Set a random value to the selected properties, keyframes or layers."),
                false,
                'row',
                'center'
            );
            okButton.onClick = function() {

                var offset = offsetSelector.index == 0;
                var gaussian = modeSelector.index == 0;

                if (attrSelector.index == 0) { // values
                    var xMin = parseFloat( valuesXMinEdit.text );
                    var xMax = parseFloat( valuesXMaxEdit.text );
                    var yMin = parseFloat( valuesYMinEdit.text );
                    var yMax = parseFloat( valuesYMaxEdit.text );
                    var zMin = parseFloat( valuesZMinEdit.text );
                    var zMax = parseFloat( valuesZMaxEdit.text );
                    var separate = valuesSeparateSelector.index == 1;
                    
                    Duik.Automation.randomizeValues(xMin, xMax, yMin, yMax, zMin, zMax, offset, separate, gaussian);

                } else if (attrSelector.index == 1) { // Layers
                    var min = parseFloat( layersVMinEdit.text );
                    var max = parseFloat( layersVMaxEdit.text );

                    if (isNaN(min)) return;
                    if (isNaN(max)) return;

                    if (layersTimeButton.checked) Duik.Automation.randomizeLayerTimes(min, max, offset, gaussian);
                    if (layersIndicesButton.checked) Duik.Automation.randomizeLayerIndices(min, max, offset, gaussian);
                    if (layersInButton.checked) Duik.Automation.randomizeLayerInPoints(min, max, offset, gaussian);
                    if (layersOutButton.checked) Duik.Automation.randomizeLayerOutPoints(min, max, offset, gaussian);                    
                }
                else { // keyframes
                    if (keysSelector.index == 0) { // times
                        var min = parseFloat( keysXMinEdit.text );
                        var max = parseFloat( keysXMaxEdit.text );

                        if (isNaN(min)) return;
                        if (isNaN(max)) return;

                        Duik.Automation.randomizeKeyTimes(min, max, offset, gaussian);
                    }
                    else { //values 
                        var xMin = parseFloat( keysXMinEdit.text );
                        var xMax = parseFloat( keysXMaxEdit.text );
                        var yMin = parseFloat( keysYMinEdit.text );
                        var yMax = parseFloat( keysYMaxEdit.text );
                        var zMin = parseFloat( keysZMinEdit.text );
                        var zMax = parseFloat( keysZMaxEdit.text );
                        var separate = keysSeparateSelector.index == 1;

                        Duik.Automation.randomizeKeyValues(xMin, xMax, yMin, yMax, zMin, zMax, offset, separate, gaussian);
                    }
                }
            };

            randomizeGroup.built = true;
            DuScriptUI.showUI(randomizeGroup);
        }

        hideAllGroups();
        randomizeGroup.visible = true;
    };

    var bakeExpButton = toolsGroup.addButton(
        i18n._("Bake expressions"),
        w12_expression_baker,
        i18n._("Replace expressions by keyframes.\nUse a smart algorithm to have as less keyframes as possible, and keep them easy to edit afterwards."),
        true
    );
    bakeExpButton.optionsPopup.build = function() {
        var selectionModeSelector = DuScriptUI.selectionModeSelector(bakeExpButton.optionsPanel);
        selectionModeSelector.setCurrentIndex(0);

        var bakeMethodSelector = DuScriptUI.selector(
            bakeExpButton.optionsPanel
        );
        bakeMethodSelector.addButton(
            i18n._("Smart mode"),
            w16_autorig,
            i18n._("Use a smarter algorithm which produces less keyframes.\nThe result may be easier to edit afterwards but a bit less precise than other modes")
        );
        bakeMethodSelector.addButton(
            i18n._("Precise mode"),
            w16_quick,
            i18n._("Add new keyframes for all frames.\nThis mode produces more keyframes but the result may be closer to the original animation.")
        );
        bakeMethodSelector.setCurrentIndex(0);

        var stepEdit = DuScriptUI.editText(
            bakeExpButton.optionsPanel,
            '1',
            i18n._("Precision factor") + ': ',
            '',
            "",
            precisionFactorTip
        );

        bakeExpButton.onClick = function() {
            var step = parseFloat(stepEdit.text);
            if (isNaN(step)) step = 1;
            step = 1 / step;
            Duik.Automation.bakeExpressions(bakeMethodSelector.index, step, selectionModeSelector.index);
        };
    }

    var bakeCompButton = toolsGroup.addButton(
        i18n._("Bake composition"),
        w12_comp_baker,
        i18n._("Replaces all expressions of the composition by keyframes,\nand removes all non-renderable layers.\n\nUses a smart algorithm to have as less keyframes as possible, and keep them easy to edit afterwards."),
        true
    );
    bakeCompButton.optionsPopup.build = function() {
        var selectionModeSelector = DuScriptUI.selectionModeSelector(bakeCompButton.optionsPanel, DuAE.SelectionMode.SELECTED_LAYERS);
        selectionModeSelector.setCurrentIndex(1);

        var bakeMethodSelector = DuScriptUI.selector(
            bakeCompButton.optionsPanel
        );
        bakeMethodSelector.addButton(
            i18n._("Smart mode"),
            w16_autorig,
            i18n._("Use a smarter algorithm which produces less keyframes.\nThe result may be easier to edit afterwards but a bit less precise than other modes")
        );
        bakeMethodSelector.addButton(
            i18n._("Precise mode"),
            w16_quick,
            i18n._("Add new keyframes for all frames.\nThis mode produces more keyframes but the result may be closer to the original animation.")
        );
        bakeMethodSelector.setCurrentIndex(0);

        var stepEdit = DuScriptUI.editText(
            bakeCompButton.optionsPanel,
            '1',
            i18n._("Precision factor") + ': ',
            '',
            "",
            precisionFactorTip,
            false
        );

        bakeCompButton.onClick = function() {
            var step = parseFloat(stepEdit.text);
            if (isNaN(step)) step = 1;
            step = 1 / step;
            Duik.Automation.bakeComposition(bakeMethodSelector.index, step, selectionModeSelector.index + 1);
        };
    }

    var timeRemapButton = toolsGroup.addButton(
        i18n._("Time remap"),
        w12_time_remap,
        i18n._("Activate the time remapping on the selected layers, adjusts the keyframes and adds a loop effect.")
    );
    timeRemapButton.onClick = Duik.Automation.timeRemap;

    var mainGroup = DuScriptUI.group(tab, 'stacked');
    //mainGroup.margins = 3;
    mainGroup.alignment = ['fill', 'fill'];

    var automationGroup = DuScriptUI.group(mainGroup, 'column');
    if (uiMode >= 2) automationGroup.spacing = 3;

    var line1 = DuScriptUI.group(automationGroup, uiMode >= 2 ? 'row' : 'column');

    createKleanerButton( line1 );

    var effectorButton = DuScriptUI.button(
        line1,
        i18n._("Effector"),
        w16_effector,
        i18n._("Creates a spatial effector to control properties.\n\nSelect the properties to control first, then click on this button.")
    );
    effectorButton.onClick = Duik.Automation.effector;

    var effectorMapButton = DuScriptUI.button(
        line1,
        i18n._("Effector map") + '...',
        w16_effector_map,
        i18n._("Control properties using a map (texture) layer."),
        false,
        undefined,
        undefined,
        false
    );
    effectorMapButton.onClick = function() {
        if (!effectorMapGroup.built) {
            buildEffectorMapGroup(effectorMapGroup, automationGroup);
        }

        // Set the layer
        effectorMapGroup.layerSelector.refresh();
        var layer = DuAEComp.getActiveLayer();
        if (layer) effectorMapGroup.layerSelector.setCurrentIndex(layer.index);

        hideAllGroups();
        effectorMapGroup.visible = true;
    };

    var wiggleButton = DuScriptUI.button( line1, {
        text: i18n._("Wiggle"),
        image: w16_wiggle,
        helpTip: i18n._("Add a random but smooth animation to the selected properties."),
        options: true
    });
    wiggleButton.optionsPopup.build = function() {
        var dimSelector = DuScriptUI.selector(  wiggleButton.optionsPanel );
        dimSelector.addButton(
            i18n._("Collapse dimensions"),
            w16_collapse_dimensions,
            i18n._("Control all dimensions or channels with a single value.")
        );
        dimSelector.addButton(
            i18n._("Split values"),
            w16_separate_dimensions,
            i18n._("Separate all dimensions or channels to control them individually.")
        );
        dimSelector.setCurrentIndex(0);
       
        var controlSelector = DuScriptUI.selector(  wiggleButton.optionsPanel );
        controlSelector.addButton(
            i18n._("Individual controls"),
            w16_individual_control,
            i18n._("Create one individual control for each property.")
        );
        controlSelector.addButton(
            i18n._("Unified control"),
            w16_unified_control,
            i18n._("Create a single control for all properties.\na.k.a. The One Duik To Rule Them All.")
        );
        controlSelector.setCurrentIndex(1);

        wiggleButton.onClick = function() {
        Duik.Automation.wiggle(
            dimSelector.index == 1, 
            controlSelector.index == 0
            );
        };
    };

    var randomButton = DuScriptUI.button(
        line1,
        i18n._("Random motion"),
        w16_random,
        i18n._("Add a control effect to randomize (and animate) the selected properties."),
        true
    );
    randomButton.optionsPopup.build = function() {
        var dimSelector = DuScriptUI.selector(  randomButton.optionsPanel );
        dimSelector.addButton(
            i18n._("Collapse dimensions"),
            w16_collapse_dimensions,
            i18n._("Control all dimensions or channels with a single value.")
        );
        dimSelector.addButton(
            i18n._("Split values"),
            w16_separate_dimensions,
            i18n._("Separate all dimensions or channels to control them individually.")
        );
        dimSelector.setCurrentIndex(0);
       
        var controlSelector = DuScriptUI.selector(  randomButton.optionsPanel );
        controlSelector.addButton(
            i18n._("Individual controls"),
            w16_individual_control,
            i18n._("Create one individual control for each property.")
        );
        controlSelector.addButton(
            i18n._("Unified control"),
            w16_unified_control,
            i18n._("Creates a single control for all properties.\na.k.a. The One Duik To Rule Them All.")
        );
        controlSelector.setCurrentIndex(1);

        randomButton.onClick = function() {
        Duik.Automation.random(
            dimSelector.index == 1, 
            controlSelector.index == 0
            );
        };
    };

    var line2 = DuScriptUI.group(automationGroup, uiMode >= 2 ? 'row' : 'column');
    
    var swinkButton = DuScriptUI.multiButton(
            line2,
            i18n._("Swink"), /// TRANSLATORS: contraction of "Swing" and "Blink". Feel free to find something fun in your language!
            w16_swink,
            i18n._("Swing or blink.\nAlternate between two values, going back and forth,\nwith advanced interpolation options.")
        );
    swinkButton.build = function() {
        var swingButton = this.addButton(
            i18n._("Swing"),
            undefined,
            i18n._("Smoothly go back and forth between two values.")
        );

        var blinkButton = this.addButton(
            i18n._("Blink"),
            undefined,
            i18n._("Switch between two values, without interpolation.")
        );

        swingButton.onClick = function() {
            Duik.Automation.swink();
        };

        blinkButton.onClick = function() {
            DuAE.beginUndoGroup( i18n._("Blink"));

            var effects = Duik.Automation.swink(undefined, true);

            DuAE.endUndoGroup();
        };
    };

    var wheelButton = DuScriptUI.button(
            line2,
            i18n._("Wheel"),
            w16_wheel,
            i18n._("Automates the rotation of the selected layers as wheels.")
        );
    wheelButton.onClick = Duik.Automation.wheel;

    var moveAwayButton = DuScriptUI.button(
            line2,
            i18n._("Move away"),
            w16_move_away,
            i18n._("Adds a control effect to move the selected layers away from their parents.")
        );
    moveAwayButton.onClick = Duik.Automation.moveAway;

    var looperButton = DuScriptUI.button(
        line2,
        i18n._("Looper"),
        w16_looper,
        i18n._("Add cycles to the animated properties,\n(with more features than the 'loopOut' and 'loopIn' expressions).")
    );
    looperButton.onClick = Duik.Automation.looper;

    var motionTrailButton = DuScriptUI.button(
        line2,
        i18n._("Motion trail"),
        w16_motion_trail,
        i18n._("Draws a trail following the selected layers.\n\n[Alt]: Creates a new shape layer for each trail.")
    );
    motionTrailButton.onClick = Duik.Automation.motionTrail;
    motionTrailButton.onAltClick = function() { Duik.Automation.motionTrail(true) };

    var line3 = DuScriptUI.group(automationGroup, uiMode >= 2 ? 'row' : 'column');

    var walkButton = DuScriptUI.button( line3, {
        text: i18n._("Walk/Run cycle"),
        helpTip: i18n._("Animate the selected character using a procedural walk or run cycle."),
        image: w16_walk_cycle,
        options: true,
        optionsWithoutPanel: true
    });
    walkButton.onClick = Duik.Automation.walk;
    walkButton.onOptions = function( show ) {
        if (!walkCycleGroup.built) {
            createSubPanel(
                walkCycleGroup,
                i18n._("Walk/Run cycle"),
                automationGroup,
                false
            );

            // Add the layer selectors
            var form = DuScriptUI.layerPicker(walkCycleGroup);
            walkCycleGroup.headSelector = form.addSelector( i18n._("Head"));
            walkCycleGroup.neckSelector = form.addSelector( i18n._("Neck"));
            walkCycleGroup.torsoSelector = form.addSelector( i18n._("Torso"));
            walkCycleGroup.spineSelector = form.addSelector( i18n._("Spine"));
            walkCycleGroup.hipsSelector = form.addSelector( i18n._("Hips"));
            walkCycleGroup.bodySelector = form.addSelector( i18n._("Body"));
            walkCycleGroup.rHandSelector = form.addSelector( i18n._("Right hand"));
            walkCycleGroup.lHandSelector = form.addSelector( i18n._("Left hand"));
            walkCycleGroup.rFootSelector = form.addSelector( i18n._("Right foot"));
            walkCycleGroup.lFootSelector = form.addSelector( i18n._("Left foot"));

            // Apply button
            DuScriptUI.separator( walkCycleGroup );
            var okButton = DuScriptUI.button( walkCycleGroup, {
                text: i18n._("Walk/Run cycle"),
                helpTip: i18n._("Animate the selected character using a procedural walk or run cycle."),
                image: w16_walk_cycle,
                orientation: 'row',
                alignment: 'center',
            });
            okButton.onClick = function() {
                // Get controls
                var ctrls = {};
                var comp = DuAEProject.getActiveComp();
                if (walkCycleGroup.headSelector.index) ctrls.head = comp.layer(walkCycleGroup.headSelector.index);
                if (walkCycleGroup.neckSelector.index) ctrls.neck = comp.layer(walkCycleGroup.neckSelector.index);
                if (walkCycleGroup.torsoSelector.index) ctrls.torso = comp.layer(walkCycleGroup.torsoSelector.index);
                if (walkCycleGroup.spineSelector.index) ctrls.spine = comp.layer(walkCycleGroup.spineSelector.index);
                if (walkCycleGroup.hipsSelector.index) ctrls.hips = comp.layer(walkCycleGroup.hipsSelector.index);
                if (walkCycleGroup.bodySelector.index) ctrls.body = comp.layer(walkCycleGroup.bodySelector.index);
                if (walkCycleGroup.rHandSelector.index) ctrls.rHand = comp.layer(walkCycleGroup.rHandSelector.index);
                if (walkCycleGroup.lHandSelector.index) ctrls.lHand = comp.layer(walkCycleGroup.lHandSelector.index);
                if (walkCycleGroup.rFootSelector.index) ctrls.rFoot = comp.layer(walkCycleGroup.rFootSelector.index);
                if (walkCycleGroup.lFootSelector.index) ctrls.lFoot = comp.layer(walkCycleGroup.lFootSelector.index);

                Duik.Automation.rigWalk( ctrls );
            };

            DuScriptUI.showUI(walkCycleGroup);
        }
        var ctrls = Duik.Automation.getWalkCtrls();
        if (ctrls.head) walkCycleGroup.headSelector.setCurrentIndex( ctrls.head.index );
        if (ctrls.neck)  walkCycleGroup.neckSelector.setCurrentIndex( ctrls.neck.index );
        if (ctrls.torso)  walkCycleGroup.torsoSelector.setCurrentIndex( ctrls.torso.index );
        if (ctrls.spine)  walkCycleGroup.spineSelector.setCurrentIndex( ctrls.spine.index );
        if (ctrls.body)  walkCycleGroup.bodySelector.setCurrentIndex( ctrls.body.index );
        if (ctrls.hips)  walkCycleGroup.hipsSelector.setCurrentIndex( ctrls.hips.index );
        if (ctrls.rHand)  walkCycleGroup.rHandSelector.setCurrentIndex( ctrls.rHand.index );
        if (ctrls.lHand)  walkCycleGroup.lHandSelector.setCurrentIndex( ctrls.lHand.index );
        if (ctrls.rFoot)  walkCycleGroup.rFootSelector.setCurrentIndex( ctrls.rFoot.index );
        if (ctrls.lFoot)  walkCycleGroup.lFootSelector.setCurrentIndex( ctrls.lFoot.index );
        
        if (show) {
            hideAllGroups();
            walkCycleGroup.visible = true;
        }
    };

    createXSheetButton( line3 );

    var paintRigButton = DuScriptUI.button(
        line3,
        i18n._("Paint Rig"),
        w16_paint,
        i18n._("Rig paint effects and brush strokes to animate them more easily.")
    );
    paintRigButton.onClick = Duik.Automation.paintRig;

    var expressionToolsGroup = DuScriptUI.group(mainGroup, 'column');
    expressionToolsGroup.visible = false;
    expressionToolsGroup.built = false;

    var effectorMapGroup = DuScriptUI.group(mainGroup, 'column');
    effectorMapGroup.visible = false;
    effectorMapGroup.built = false;

    var randomizeGroup = DuScriptUI.group(mainGroup, 'column');
    randomizeGroup.visible = false;
    randomizeGroup.built = false;

    var walkCycleGroup = DuScriptUI.group(mainGroup, 'column');
    walkCycleGroup.visible = false;
    walkCycleGroup.built = false;//*/
}