function buildToolsPanelUI(tab) {
    // A Spacer
    var spacer = tab.add('group');
    spacer.margins = 0;
    spacer.spacing = 0;
    spacer.size = [-1, 3];

    var toolsTabPanel = DuScriptUI.tabPanel(tab, 'column');

    var compTab = toolsTabPanel.addTab(
        uiMode == 0 ? i18n._("Composition") : '',
        w16_composition,
        i18n._("Composition tools (crop, change settings...)")
    );

    var layerTab = toolsTabPanel.addTab(
        uiMode == 0 ? i18n._("Layer") : '',
        w16_layers,
        i18n._("Layer manager")
    );

    var textTab = toolsTabPanel.addTab(
        uiMode == 0 ? i18n._("Text"): '',
        w16_text,
        i18n._("Text tools (rename, search and replace...)")
    );

    var devTab = toolsTabPanel.addTab(
        uiMode == 0 ? i18n._("Scripting") : '',
        w16_expression,
        i18n._("Scripting tools")
    );

    compTab.build = function() {
        function hideAllGroups() {
            compGroup.visible = false;
            compSettingsGroup.visible = false;
        }

        var mainGroup = DuScriptUI.group(this, 'stacked');
        mainGroup.alignment = ['fill', 'fill'];

        var compGroup = DuScriptUI.group(mainGroup, 'column');

        var cropButton = DuScriptUI.button(
            compGroup,
            i18n._("Crop precompositions"),
            w16_crop,
            i18n._("Crops the selected precompositions using the bounds of their masks.")
        );
        cropButton.onClick = Duik.Tool.cropPrecompositions;

        var compSettingsButton = DuScriptUI.button( compGroup, {
            text: i18n._("Comp settings") + '...',
            image: w16_composition_settings,
            helpTip: i18n._("Sets the current or selected composition(s) settings, also changing the settings of all precompositions."),
            localize: false
        });
        compSettingsButton.onClick = function() {
            if (!compSettingsGroup.built) {
                createSubPanel(
                    compSettingsGroup,
                    i18n._("Comp settings"),
                    compGroup,
                    false
                );

                #include "compSettingsPanel.jsx"
                buildCompSettingsPanel( compSettingsGroup );

                DuScriptUI.showUI(compSettingsGroup);
            }

            hideAllGroups();
            compSettingsGroup.visible = true;
        };

        createPerformanceButton( compGroup, true, Duik.Performace.optimize );

        var compSettingsGroup = DuScriptUI.group(mainGroup, 'column');
        compSettingsGroup.visible = false;
        compSettingsGroup.built = false;
    };

    textTab.build = function() {
        function hideAllGroups() {
            textGroup.visible = false;
            renameGroup.visible = false;
            replaceGroup.visible = false;
        }

        var mainGroup = DuScriptUI.group(this, 'stacked');
        mainGroup.alignment = ['fill', 'fill'];

        var textGroup = DuScriptUI.group(mainGroup, 'column');
        if (uiMode >= 2) textGroup.spacing = 3;

        var renameButton = DuScriptUI.button( textGroup, {
            text: i18n._("Rename") + '...',
            helpTip: i18n._("Renames the selected items (layers, pins, project items...)"),
            image: w16_rename,
            localize: false
        });
        renameButton.onClick = function() {
            if (!renameGroup.built) {

                function generateNewName(oldName,i)
                {
                    var prefix = prefixEdit.text;
                    var suffix = suffixEdit.text;

                    var newName = nameEdit.text;
                    if (newName == '')
                    {
                        newName = oldName;
                        var removeFirst = parseInt(removeFEdit.text);
                        var removeLast = parseInt(removeLEdit.text);
                        if (removeFGroup.checked && removeFirst > 0)
                        {
                            newName = newName.substr(removeFirst);
                        }
                        if (removeLGroup.checked && removeLast > 0)
                        {
                            newName = newName.substring(0,newName.length-removeLast);
                        }
                    }
                    var newName = prefix + newName + suffix;

                    var num = parseInt(numberEdit.text);
                    if (! isNaN(num) && numberGroup.checked)
                    {
                        newName += (num + i);
                    }

                    return newName;
                }

                createSubPanel(
                    renameGroup,
                    i18n._("Rename"),
                    textGroup,
                    false
                );

                var itemSelector = DuScriptUI.selector(renameGroup);
                itemSelector.addButton({ text: i18n._("Layers"), image: w16_layers });
                itemSelector.addButton({ text: i18n._("Puppet pins"), image: w16_pin });
                itemSelector.addButton({ text: i18n._("Project items"), image: w16_items });
                itemSelector.setCurrentIndex(0);

                var expButton = DuScriptUI.checkBox(renameGroup, {
                    text: i18n._("Update expressions"),
                    image: w16_update_expression,
                    helpTip: i18n._("Automatically updates the expressions.")
                });
                expButton.setChecked(true);

                var removeFGroup = addSetting( renameGroup, i18n._("Remove the first digits"));
                var removeFEdit = DuScriptUI.editText( removeFGroup, {
                    text: '001',
                    suffix: ' ' + i18n._("digits") + '.',
                    localize: false
                });

                var removeLGroup = addSetting( renameGroup, i18n._("Remove the last digits"));
                var removeLEdit = DuScriptUI.editText( removeLGroup, {
                    text: '001',
                    suffix: ' ' + i18n._("digits") + '.',
                    localize: false
                });

                var numberGroup = addSetting( renameGroup, i18n._("Number from"));
                var numberEditGroup = DuScriptUI.group(numberGroup, 'row');
                numberEditGroup.alignment = ['fill', 'top'];
                var numberEdit = DuScriptUI.editText( numberEditGroup, {
                    text: '001'
                });
                numberEdit.alignment = ['fill', 'fill'];
                var numberReverseBox = DuScriptUI.checkBox( numberEditGroup, {
                    text: i18n._("Reverse"), /// TRANSLATORS: as in "reverse numbering / reverse order"
                    helpTip: i18n._("Number from last to first.")
                });
                numberReverseBox.alignment = ['right', 'center'];

                var newNameGroup = DuScriptUI.group(renameGroup, 'row');

                var prefixEdit = DuScriptUI.editText( newNameGroup, {
                    text: '',
                    placeHolder: i18n._("Prefix") + '_',
                    localize: false
                });
                prefixEdit.alignment = ['fill', 'fill'];

                var nameEdit = DuScriptUI.editText( newNameGroup, {
                    text: '',
                    placeHolder: i18n._("Name")
                });
                nameEdit.alignment = ['fill', 'fill'];

                var suffixEdit = DuScriptUI.editText( newNameGroup, {
                    text: '',
                    placeHolder: '_' + i18n._("Suffix"),
                    localize: false
                });
                suffixEdit.alignment = ['fill', 'fill'];

                var validButton = DuScriptUI.button( renameGroup, {
                    text: i18n._("Rename"),
                    image: w16_rename,
                    helpTip: i18n._("Renames the selected items (layers, pins, project items...)"),
                    orientation: 'row',
                    alignment: 'center'
                });
                validButton.alignment = ['fill', 'top'];
                validButton.onClick = function() {
                    // Layers
                    if (itemSelector.index == 0) {
                        var comp = DuAEProject.getActiveComp();
                        if (!comp) return;
                        var layers = comp.selectedLayers;
                        if (layers.length == 0) return;

                        DuAE.beginUndoGroup( i18n._("Rename"));
                        app.beginSuppressDialogs();

                        layers = new DuList(layers);
                        layers.do(function (layer) {
                            var oldName = layer.name;
                            var i = layers.current;
                            if ( numberReverseBox.checked) i = layers.length() - i - 1;
                            var newName = generateNewName(oldName, i);

                            layer.name = newName;
                            if (expButton.checked) app.project.autoFixExpressions(oldName,newName);
                        });

                        app.endSuppressDialogs(false);
                        DuAE.endUndoGroup();
                    }
                    // Pins
                    else if (itemSelector.index == 1) {
                        var props = DuAEComp.getSelectedProps('ADBE FreePin3 PosPin Atom');
                        if (props.length == 0) {
                            // Try to find puppet pins on the first selected layer, if single
                            var layers = DuAEComp.getSelectedLayers();
                            if (layers.length != 1) return;
                            var layer = layers[0];
                            // Find puppet effects
                            var effects = layer.property('ADBE Effect Parade');
                            for(var i = 1; i <= effects.numProperties; i++) {
                                var effect = effects.property(i);
                                if (effect.matchName != 'ADBE FreePin3') continue;
                                var meshGroup = effect.property("ADBE FreePin3 ARAP Group").property("ADBE FreePin3 Mesh Group");
                                for (var j = 1; j <= meshGroup.numProperties; j++) {
                                    var pins = meshGroup.property(j).property("ADBE FreePin3 PosPins");
                                    for (var k = 1; k <= pins.numProperties; k++) {
                                        props.push(new DuAEProperty(pins.property(k)));
                                    }
                                }
                            }
                        }

                        DuAE.beginUndoGroup( i18n._("Rename"));
                        app.beginSuppressDialogs();

                        props = new DuList(props);
                        props.do(function(prop) {
                            var oldName = prop.getProperty().name;
                            var i = props.current;
                            if ( numberReverseBox.checked) i = props.length() - i - 1;
                            var newName = generateNewName(oldName,i);
                            prop.getProperty().name = newName;
                            if (expButton.checked) app.project.autoFixExpressions(oldName,newName);
                        });

                        app.endSuppressDialogs(false);
                        DuAE.endUndoGroup();
                    }
                    // Project Items
                    else {
                        var items = app.project.selection;
                        if (items.length == 0) return;

                        DuAE.beginUndoGroup( i18n._("Rename"));
                        app.beginSuppressDialogs();

                        items = new DuList(items);
                        items.do(function (item)
                        {
                            var oldName = item.name;
                            var i = items.current;
                            if ( numberReverseBox.checked) i = items.length() - i - 1;
                            var newName = generateNewName(oldName,i);
                            item.name = newName;
                            if (expButton.checked) app.project.autoFixExpressions(oldName,newName);
                        });

                        app.endSuppressDialogs(false);
                        DuAE.endUndoGroup();
                    }
                };

                DuScriptUI.showUI(renameGroup);
            }
            hideAllGroups();
            renameGroup.visible = true;
        };

        var replaceButton = DuScriptUI.button( textGroup, {
            text: i18n._("Search and replace") + '...',
            helpTip: i18n._("Searches and replaces text in the project."),
            image: w16_search_replace,
            localize: false
        });
        replaceButton.onClick = function() {
            if (!replaceGroup.built) {
                createSubPanel(
                    replaceGroup,
                    i18n._("Search and replace"),
                    textGroup,
                    false
                );

                var itemSelector = DuScriptUI.selector(replaceGroup);
                itemSelector.addButton({ text: i18n._("Expressions"), image: w16_expression });
                itemSelector.addButton({ text: i18n._("Texts"), image: w16_text });
                itemSelector.addButton({ text: i18n._("Effects"), image: w16_fx });
                itemSelector.addButton({ text: i18n._("Layers"), image: w16_layers });
                itemSelector.addButton({ text: i18n._("Project items"), image: w16_items });
                itemSelector.setCurrentIndex(0);
                itemSelector.onChange = function() {
                    expButton.visible = itemSelector.index == 2 || itemSelector.index == 3 || itemSelector.index == 4;
                    compItemGroup.visible = itemSelector.index != 4;
                    projectItemsGroup.visible = !compItemGroup.visible;
                };

                var itemMainGroup = DuScriptUI.group( replaceGroup, 'stacked');

                var compItemGroup = DuScriptUI.group(itemMainGroup, 'column');
                
                var compSelector = DuScriptUI.selector( compItemGroup );
                compSelector.addButton({ text: i18n._("Active composition"), image: w16_composition });
                compSelector.addButton({ text: i18n._("All Compositions"), image: w16_compositions });
                compSelector.setCurrentIndex(0);
                compSelector.onChange = function() {
                    layerSelector.visible = compSelector.index == 0;
                };

                var layerSelector = DuScriptUI.selector( compItemGroup );
                layerSelector.addButton({ text: i18n._("Selected layers"), image: w16_selected_layers});
                layerSelector.addButton({ text: i18n._("All layers"), image: w16_layers});
                layerSelector.setCurrentIndex(1);

                var projectItemsGroup = DuScriptUI.group( itemMainGroup, 'column');
                projectItemsGroup.visible = false;

                var itemTypeGroup = DuScriptUI.group( projectItemsGroup, 'row' );

                var compButton = DuScriptUI.checkBox( itemTypeGroup, {
                    text: '',
                    image: w16_composition,
                    helpTip: i18n._("Compositions")
                });
                compButton.alignment = ['left', 'top'];
                compButton.setChecked(true);

                var footageButton = DuScriptUI.checkBox( itemTypeGroup, {
                    text: '',
                    image: w16_footage,
                    helpTip: i18n._("Footages")
                });
                footageButton.alignment = ['left', 'top'];
                footageButton.setChecked(true);

                var folderButton = DuScriptUI.checkBox( itemTypeGroup, {
                    text: '',
                    image: w16_folder,
                    helpTip: i18n._("Folders")
                });
                folderButton.alignment = ['left', 'top'];
                folderButton.setChecked(true);

                var projectIemsSelector = DuScriptUI.selector( projectItemsGroup );
                projectIemsSelector.addButton({ text: i18n._("All items"), image: w16_items });
                projectIemsSelector.addButton({ text: i18n._("Selected items"), image: w16_selected_items });
                projectIemsSelector.setCurrentIndex(0);

                var caseButton = DuScriptUI.checkBox( replaceGroup, {
                    text: i18n._("Case sensitive"),
                    image: w16_case
                });
                caseButton.setChecked(true);

                var expButton = DuScriptUI.checkBox(replaceGroup, {
                    text: i18n._("Update expressions"),
                    image: w16_update_expression,
                    helpTip: i18n._("Automatically updates the expressions.")
                });
                expButton.setChecked(true);
                expButton.visible = false;

                var searchEdit = DuScriptUI.editText( replaceGroup, {
                    text: '',
                    placeHolder: i18n._("Search")
                });
                searchEdit.alignment = ['fill', 'top'];

                var replaceEdit = DuScriptUI.editText( replaceGroup, {
                    text: '',
                    placeHolder: i18n._("Replace")
                });
                replaceEdit.alignment = ['fill', 'top'];

                var validButton = DuScriptUI.button( replaceGroup, {
                    text: i18n._("Search and replace"),
                    image: w16_search_replace,
                    helpTip: i18n._("Search and replace text in the project."),
                    orientation: 'row',
                    alignment: 'center'
                });
                validButton.alignment = ['fill', 'top'];
                validButton.onClick = function() {
                    var search = searchEdit.text;
                    var replace = replaceEdit.text;
                    if (search == replace) return;

                    DuAE.beginUndoGroup( i18n._("Search and replace") );
                    app.beginSuppressDialogs();

                    // Expressions
                    if (itemSelector.index == 0) {
                        // All comps
                        if (compSelector.index == 1) {
                            DuAEProject.replaceInExpressions( search, replace, caseButton.checked );
                        }
                        // Active comp
                        else {
                            DuAEComp.replaceInExpressions( search, replace, caseButton.checked, layerSelector.index == 0 )
                        }
                    }
                    // Texts
                    else if (itemSelector.index == 1) {
                        // All comps
                        if (compSelector.index == 1) {
                            var items = new DuList(app.project.items);
                            items.do(function(item) {
                                if (!(item instanceof CompItem)) return;
                                var layers = new DuList(item.layers);
                                layers.do(function(layer) {
                                    if (layer.locked) return;
                                    if (!(layer instanceof TextLayer)) return;
                                    var source = layer.sourceText.value;
                                    source.text = DuString.replace( source.text, search, replace, caseButton.checked);
                                    layer.sourceText.setValue(source);
                                });
                            });
                        }
                        // Active comp
                        else {
                            var comp = DuAEProject.getActiveComp();
                            if (comp) {
                                var layers = [];
                                if (layerSelector.index == 0) layers = comp.selectedLayers;
                                else layers = comp.layers;
                                layers = new DuList(layers);
                                layers.do(function(layer) {
                                    if (layer.locked) return;
                                    if (!(layer instanceof TextLayer)) return;
                                    var source = layer.sourceText.value;
                                    source.text = DuString.replace( source.text, search, replace, caseButton.checked);
                                    layer.sourceText.setValue(source);
                                });
                            }
                        }
                    }
                    // Effects
                    else if (itemSelector.index == 2) {
                        // All comps
                        if (compSelector.index == 1) {
                            var items = new DuList(app.project.items);
                            items.do(function (comp) {
                                if (!(comp instanceof CompItem)) return;
                                var layers = new DuList(comp.layers);
                                layers.do(function(layer) {
                                    if (layer.locked) return;
                                    for (var i = 1, n = layer.property('ADBE Effect Parade').numProperties; i <= n; i++) {
                                        var oldName = layer.effect(i).name;
                                        layer.effect(i).name = DuString.replace(oldName, search, replace, caseButton.checked);
                                        if (expButton.checked) app.project.autoFixExpressions(oldName,layer.effect(i).name);
                                    }
                                });
                            });
                        }
                        // Active comp
                        else {
                            var comp = DuAEProject.getActiveComp();
                            if (comp) {
                                var layers = [];
                                if (layerSelector.index == 0) layers = comp.selectedLayers;
                                else layers = comp.layers;
                                layers = new DuList(layers);
                                layers.do(function(layer) {
                                    if (layer.locked) return;
                                    for (var i = 1, n = layer.property('ADBE Effect Parade').numProperties; i <= n; i++) {
                                        var oldName = layer.effect(i).name;
                                        layer.effect(i).name = DuString.replace(oldName, search, replace, caseButton.checked);
                                        if (expButton.checked) app.project.autoFixExpressions(oldName,layer.effect(i).name);
                                    }
                                });
                            }
                        }
                    }
                    // Layers
                    else if (itemSelector.index == 3) {
                        // All comps
                        if (compSelector.index == 1) {
                            var items = new DuList(app.project.items);
                            items.do(function (comp) {
                                if (!(comp instanceof CompItem)) return;
                                var layers = new DuList(comp.layers);
                                layers.do(function(layer) {
                                    if (layer.locked) return;
                                    var oldName = layer.name;
                                    layer.name = DuString.replace(oldName, search, replace, caseButton.checked);
                                    if (expButton.checked) app.project.autoFixExpressions(oldName,layer.name);
                                });
                            });
                        }
                        // Active comp
                        else {
                            var comp = DuAEProject.getActiveComp();
                            if (comp) {
                                var layers = [];
                                if (layerSelector.index == 0) layers = comp.selectedLayers;
                                else layers = comp.layers;
                                layers = new DuList(layers);
                                layers.do(function(layer) {
                                    if (layer.locked) return;
                                    var oldName = layer.name;
                                    layer.name = DuString.replace(oldName, search, replace, caseButton.checked);
                                    if (expButton.checked) app.project.autoFixExpressions(oldName,layer.name);
                                });
                            }
                        }
                    }
                    // Items
                    else if (itemSelector.index == 4) {
                        var items = [];
                        if (projectIemsSelector.index == 0) items = app.project.items;
                        else items = app.project.selection;
                        items = new DuList(items);
                        
                        items.do(function(item) {
                            if (item instanceof CompItem && !compButton.checked) return;
                            if (item instanceof FolderItem && !folderButton.checked) return;
                            if (item instanceof FootageItem && !footageButton.checked) return;

                            var oldName = item.name;
                            item.name = DuString.replace(oldName, search, replace, caseButton.checked);
                            if (expButton.checked) app.project.autoFixExpressions(oldName,item.name);
                        });
                    }


                    app.endSuppressDialogs(false);
                    DuAE.endUndoGroup();
                };

                DuScriptUI.showUI(replaceGroup);
            }
            hideAllGroups();
            replaceGroup.visible = true;
        };

        var renameGroup = DuScriptUI.group(mainGroup, 'column');
        renameGroup.visible = false;
        renameGroup.built = false;

        var replaceGroup = DuScriptUI.group(mainGroup, 'column');
        replaceGroup.visible = false;
        replaceGroup.built = false;
    }

    devTab.build = function() {

        function hideAllGroups() {
            scriptifyGroup.visible = false;
            scriptLibGroup.visible = false;
            scriptEditorGroup.visible = false;
            devGroup.visible = false;
        }

        var mainGroup = DuScriptUI.group(this, 'stacked');
        mainGroup.alignment = ['fill', 'fill'];

        var devGroup = DuScriptUI.group(mainGroup, 'column');
        if (uiMode >= 2) devGroup.spacing = 3;

        var scriptLibButton = DuScriptUI.button(
            devGroup,
            i18n._("Script library") + '...',
            w16_library,
            i18n._("Quickly access and run all your scripts and panels.")
        );
        scriptLibButton.onClick = function() {
            if (!scriptLibGroup.built) {
                createSubPanel(
                    scriptLibGroup,
                    i18n._("Script library"),
                    devGroup,
                    false
                );

                #include "scriptLibPanel.jsx"
                buildScriptLibPanel( scriptLibGroup, scriptEditorGroup );

                DuScriptUI.showUI(scriptLibGroup);
            }

            hideAllGroups();
            scriptLibGroup.visible = true;
        };

        var scriptifyButton = DuScriptUI.button(
            devGroup,
            i18n._("Scriptify expression"),
            w16_scriptify_expression,
            i18n._("Generate a handy ExtendScript code to easily include the selected expression into a script.")
        );
        scriptifyButton.onClick = function() {
            if (!scriptifyGroup.built) {

                createSubPanel(
                    scriptifyGroup,
                    i18n._("Scriptify expression"),
                    devGroup,
                    false
                );

                scriptifyGroup.edit = scriptifyGroup.add('edittext', undefined, "", {
                    multiline: true
                });
                scriptifyGroup.edit.alignment = ['fill', 'fill'];

                DuScriptUI.separator( scriptifyGroup ).alignment = ['fill', 'bottom'];

                var validButton = DuScriptUI.button(
                    scriptifyGroup,
                    i18n._("Scriptify expression"),
                    w16_scriptify_expression,
                    i18n._("Generate a handy ExtendScript code to easily include the selected expression into a script."),
                    false,
                    'row',
                    'center'
                );
                validButton.alignment = ['center', 'bottom'];
                validButton.onClick = function() {
                    var props = DuAEComp.getSelectedProps();
                    if (props.length == 0) return;
                    prop = props.pop();
                    scriptifyGroup.edit.text = DuAEExpression.scriptifyExpression(prop, prop.name + "Exp");
                };

                scriptifyGroup.refresh = validButton.onClick;

                scriptifyGroup.built = true;
                DuScriptUI.showUI(scriptifyGroup);
            }

            scriptifyGroup.refresh();
            hideAllGroups();
            scriptifyGroup.visible = true;
        };

        var scriptEditorButton = DuScriptUI.button(
            devGroup,
            i18n._("Script editor"),
            w16_script,
            i18n._("A quick editor for editing and running simple scripts and snippets.")
        );
        scriptEditorButton.onClick = function() {
            if (!scriptEditorGroup.built) {
                createSubPanel(
                    scriptEditorGroup,
                    i18n._("Script editor"),
                    devGroup,
                    false
                );

                #include "scriptEditorPanel.jsx"
                buildScriptEditorUI( scriptEditorGroup );
            }
            hideAllGroups();
            scriptEditorGroup.visible = true;
        }

        var editExpressionButton = DuScriptUI.button(
            devGroup,
            i18n._("Edit expression"),
            w16_expression_file,
            i18n._( "Use an external editor to edit the selected expression.\n\n[Ctrl]: Reloads the expressions from the external editor."),
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
                else DuESF.scriptSettings.set("expression/expressionEditor", "");
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

        var scriptifyGroup = DuScriptUI.group(mainGroup, 'column');
        scriptifyGroup.visible = false;
        scriptifyGroup.built = false;

        var scriptLibGroup = DuScriptUI.group(mainGroup, 'column');
        scriptLibGroup.visible = false;
        scriptLibGroup.built = false;

        var scriptEditorGroup = DuScriptUI.group(mainGroup, 'column');
        scriptEditorGroup.visible = false;
        scriptEditorGroup.built = false;
        scriptEditorGroup.edit = function( content ) {
            scriptEditorButton.onClick();
            scriptEditorGroup.editText.text = content;
        };
    };

    #include "layerManager.jsx"
    layerTab.build = buildLayerManagerUI;

    toolsTabPanel.buttonsGroup.alignment = ['center', 'top'];

}