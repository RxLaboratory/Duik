/**
 * The lazy animator's toolkit.
 * @namespace
 * @category Duik
 */
Duik.Automation = {};

/**
 * The types of the comps in an NLA
 * @enum {number}
 * @readonly
 * @ts-ignore */
Duik.Automation.NLACompType = {
    NONE: 0,
    ORIGINAL: 1,
    RENDER: 2,
    CLIP: 3,
    EDIT: 4
}

/**
 * The prefixes for the NLA comp & folder names.<br />
 * These may be localized, don't use the actual strings!
 * @enum {string}
 * @readonly
 * @ts-ignore */
Duik.Automation.NLAPrefixes = {
    FOLDER: "NLA" + '::',
    ORIGINAL: "NLA" + '.Original::',
    RENDER: "NLA" + '.Render::',
    CLIP: "NLA" + '.Clip::',
    EDIT: "NLA" + '.Edit::'
}

/**
 * Checks if the given comp is part of an NLA
 * @return {Duik.Automation.NLACompType} The type of the comp; Duik.Automation.NLACompType.NONE if it's not part of an NLA.
 */
Duik.Automation.NLAType = function(comp) {
    // It must be in an NLA folder
    var nlaFolder = comp.parentFolder;
    if (nlaFolder.name.indexOf(Duik.Automation.NLAPrefixes.FOLDER) != 0) return Duik.Automation.NLACompType.NONE;

    var name = comp.name;
    if (name.indexOf(Duik.Automation.NLAPrefixes.ORIGINAL) == 0) return Duik.Automation.NLACompType.ORIGINAL;
    if (name.indexOf(Duik.Automation.NLAPrefixes.RENDER) == 0) return Duik.Automation.NLACompType.RENDER;
    if (name.indexOf(Duik.Automation.NLAPrefixes.CLIP) == 0) return Duik.Automation.NLACompType.CLIP;
    if (name.indexOf(Duik.Automation.NLAPrefixes.EDIT) == 0) return Duik.Automation.NLACompType.EDIT;
    return Duik.Automation.NLACompType.NONE;
}

/**
 * Gets the folder containing the NLA Compositions like the given comp.
 * @param {CompItem} comp The comp
 * @return {FolderItem|null} The folder or null if the comp is not part of an NLA
 */
Duik.Automation.getNLAFolder = function(comp) {
    var nlaFolder = comp.parentFolder;
    if (nlaFolder.name.indexOf(Duik.Automation.NLAPrefixes.FOLDER) != 0) return null;
    return nlaFolder;
}

/**
 * Gets the render, original and edit comps for this NLA
 * @param {FolderItem} nlaFolder The NLA Folder
 * @return {CompItem[]} The compositions in this order: [Original, Edit, Render]. Note that if one is not found, null is returned.
 */
Duik.Automation.getNLAComps = function(nlaFolder) {
    var originalComp = null;
    var editComp = null;
    var renderComp = null;
    for (var i = 1, n = nlaFolder.numItems; i <= n; i++) {
        var c = nlaFolder.item(i);
        if (!(c instanceof CompItem)) continue;
        if (c.name.indexOf(Duik.Automation.NLAPrefixes.ORIGINAL) == 0) {
            originalComp = c;
        }
        if (c.name.indexOf(Duik.Automation.NLAPrefixes.EDIT) == 0) {
            editComp = c;
        }
        if (c.name.indexOf(Duik.Automation.NLAPrefixes.RENDER) == 0) {
            renderComp = c;
        }
        // Got'em all
        if (originalComp && editComp && renderComp) break;
    }
    return [originalComp, editComp, renderComp];
}

/**
 * The list of automation functions
 * @namespace
 */
Duik.CmdLib['Automation'] = {};

Duik.CmdLib['Automation']["NLA"] = "Duik.Automation.setupNLA()";
/**
 * Sets up a non-linear animation comp.
 * @param {CompItem} [comp] The composition to set up. The active composition if omitted.
 * @param {Boolean} [selectedProps=true] Use only currently selected properties if true, all properties (according to the other options) if false.
 * @param {Boolean} [transformProps] If true, filters only properties in the transform group of the layers. Ignored if selectedProps is true.
 * @param {Boolean} [effectProps] If true, filters only properties in effects. Ignored if selectedProps is true.
 * @param {Duik.Layer.Type[]} [layerTypes=[Duik.Layer.Type.CONTROLLER]] The types of layer to setup if there's no selected layer; if empty, will setup all layers.
 * @param {PropertyBase[]|DuList|DuAEProperty[]} [props] A list of properties to set up. In case this parameter is provided, all other parameters are ignored.
 */
Duik.Automation.setupNLA = function(comp, selectedProps, transformProps, effectProps, layerTypes, props) {
    comp = def(comp, DuAEProject.getActiveComp());

    DuAE.beginUndoGroup( i18n._("Non-linear animation"), false);

    DuAEComp.setUniqueLayerNames(comp.layers, comp);

    var doGroups = false;

    if (typeof props === 'undefined') {
        selectedProps = def(selectedProps, true);
        transformProps = def(transformProps, true);
        effectProps = def(effectProps, false);
        layerTypes = def(layerTypes, [Duik.Layer.Type.CONTROLLER]);

        // List properties according to the filters

        if (selectedProps) {
            props = DuAEComp.getSelectedProps();
            if (props.length == 0) selectedProps = false;
        }

        if (!selectedProps) {
            // Get the layers
            var layers = [];
            props = [];
            var selectedLayers = comp.selectedLayers;
            if (layerTypes.length > 0 && selectedLayers.length == 0) {
                for (var i = 1, n = comp.numLayers; i <= n; i++) {
                    var l = comp.layer(i);
                    for (var j = 0, nt = layerTypes.length; j < nt; j++) {
                        if (Duik.Layer.isType(l, layerTypes[j])) {
                            layers.push(l);
                            break;
                        }
                    }
                }
            }
            else layers = selectedLayers;
            if (layers.length == 0) layers = comp.layers;

            doGroups = true;

            layers = new DuList(layers);
            layers.do(function(layer) {
                if (transformProps) props.push(new DuAEProperty(layer.transform));
                var isCtrl = Duik.Layer.isType(layer, Duik.Layer.Type.CONTROLLER);
                //if (typeof effectProps === 'undefined' && isCtrl) props.push(new DuAEProperty(layer.property('ADBE Effect Parade')));
                if (effectProps) props.push(new DuAEProperty(layer.property('ADBE Effect Parade')));
            });
        }
    }

    props = new DuList(props);

    if (props.length() == 0) {
        DuAE.endUndoGroup( i18n._("Non-linear animation"));
        return;
    }

    DuAEProject.setProgressMode(true);
    DuScriptUI.progressBar.setMax(props.length() + 6);

    var compName = comp.name;
    var editComp;

    // Check if it's already an NLA; in this case don't create, just add the properties.
    DuScriptUI.progressBar.hit(1, "Checking if we're updating an existing NLA...");
    var create = true;
    if (Duik.Automation.NLAType(comp) != Duik.Automation.NLACompType.NONE) {
        var nlaFolder = Duik.Automation.getNLAFolder(comp);
        if (nlaFolder) {
            create = false;
            var nlaComps = Duik.Automation.getNLAComps(nlaFolder);
            var renderComp = nlaComps[2];
            editComp = nlaComps[1];
            // Find the same properties in the render comp
            if (renderComp) {
                DuScriptUI.progressBar.addMax(props.length());
                DuScriptUI.progressBar.hit(1, "Preparing properties to be added...");
                var renderProps = [];
                props.do(function(prop) {
                    DuScriptUI.progressBar.hit();
                    renderProp = prop.findInComp(renderComp);
                    if (renderProp) renderProps.push(renderProp);
                });
                // Replace props with the ones from the render comp
                props = new DuList(renderProps);
                DuScriptUI.progressBar.hit(4);
            }
        }
    }

    clipPrecomp = null;
    weightEffectName = "NLA::" + i18n._("Weight"); /// TRANSLATORS: weight as the multiplicator of a value, a % or a ratio.

    if (create) {
        // Create folderitem NLA::compName
        DuScriptUI.progressBar.hit(1, "Creating NLA Folder...");
        var parentFolder = comp.parentFolder;
        var nlaFolder = app.project.items.addFolder(Duik.Automation.NLAPrefixes.FOLDER + compName);
        nlaFolder.parentFolder = parentFolder;
        comp.parentFolder = nlaFolder;
        var renderComp = comp;

        // Duplicate comp twice
        // One will be NLA.Render::compName
        DuScriptUI.progressBar.hit(1, "Saving original composition...");
        var oComp = renderComp.duplicate();
        oComp.name = Duik.Automation.NLAPrefixes.ORIGINAL + compName;
        // Other NLA.Clip::compName
        DuScriptUI.progressBar.hit(1, "Creating the first clip...");
        var clipComp = renderComp.duplicate();
        clipComp.name = Duik.Automation.NLAPrefixes.CLIP + compName;
        // and keep NLA.Original::compName
        DuScriptUI.progressBar.hit(1, "Creating the render composition...");
        var originalCompName = renderComp.name;
        renderComp.name = Duik.Automation.NLAPrefixes.RENDER + compName;
        // Create NLA.Edit::compName
        DuScriptUI.progressBar.hit(1, "Creating the edit composition...");
        var editComp = nlaFolder.items.addComp(
            Duik.Automation.NLAPrefixes.EDIT + compName,
            renderComp.width, renderComp.height, renderComp.pixelAspect, renderComp.duration, renderComp.frameRate
        );

        // Add NLA.Clip
        var clipPrecomp = editComp.layers.add(clipComp);
        clipPrecomp.enabled = false;
        clipPrecomp.guideLayer = false;

        // Add a weight slider
        var weightEffect = clipPrecomp.property('ADBE Effect Parade').addProperty('ADBE Slider Control');
        weightEffect.name = weightEffectName;
        weightEffect(1).setValue(100);

        // Add NLA.Render
        editComp.layers.add(comp);

        // Fix expressions (the comp name has changed)
        app.project.autoFixExpressions(originalCompName, renderComp.name);
    }

    DuScriptUI.progressBar.hit(1, "Adding expressions...");

    // Setup properties in NLA.Render

    var exp = [DuAEExpression.Id.NLA,
        'var editComp = comp("' + editComp.name + '");',
        '',
        'var result = value;',
        'var weights = 0;',
        '',
        DuAEExpression.Library.get(['getSameProp', 'isZero']),
        '',
        'for (var i = 1, n = editComp.numLayers; i <= n; i++)',
        '{',
        '	var l = editComp.layer(i);',
        '	if (l.name == thisComp.name) continue;',
        '   if (l.name.indexOf("' + Duik.Automation.NLAPrefixes.CLIP + '") != 0) continue;',
        '	if (time >= l.inPoint && time < l.outPoint)',
        '	{',
        '	    var precomp = l.source;',
        '	    try { var c = precomp.layer(thisLayer.name); }',
        '        catch(e) { continue; }',
        '        var weight = l.opacity.value/100;',
        '        try { weight *= l.effect("' + weightEffectName + '")(1).value/100; }',
        '        catch(e) {}',
        '        var t = time;',
        '        try { t = l.timeRemap.value; }',
        '        catch(e) { t = time - l.startTime; }',
        '        var dif = getSameProp(c).valueAtTime(t) - value;',
        '        if (isZero(dif)) continue;',
        '        weights += weight;',
        '        result += dif * weight;',
        '	}',
        '}',
        'result;'
    ].join('\n');

    props.do(function(prop) {
        if (prop.isGroup() && !doGroups) return;
        DuScriptUI.progressBar.hit();
        prop.setExpression(exp, false);
    });

    // Open edit comp
    DuScriptUI.progressBar.hit(undefined, "Ready!");
    editComp.openInViewer();

    // Open clip comp
    if (clipPrecomp) clipPrecomp.openInViewer();

    DuAEProject.setProgressMode(false);
    DuAE.endUndoGroup( i18n._("Non-linear animation"));

}

Duik.CmdLib['Automation']["NLA Clip"] = "Duik.Automation.addNLAClip()";
/**
 * Creates a clip and adds it to the NLA
 * @param {CompItem} [nlaComp] A comp belonging to an NLA, the active comp if omitted.
 * @returns {int} Success code: 1 if the clip could be created, 0 if the original comp is not found, -1 if the NLA is invalid/not found
 */
Duik.Automation.addNLAClip = function(nlaComp) {
    nlaComp = def(nlaComp, DuAEProject.getActiveComp());
    if (!nlaComp) return -1;

    var nlaFolder = Duik.Automation.getNLAFolder(nlaComp);
    if (!nlaFolder) return -1;

    var nlaName = nlaFolder.name.replace('NLA::', '');

    // Get the original comp
    var nlaComps = Duik.Automation.getNLAComps(nlaFolder);
    var originalComp = nlaComps[0];
    var editComp = nlaComps[1];

    if (!originalComp) return 0;

    // Duplicate
    var newClip = originalComp.duplicate();

    // Rename
    newClip.name = originalComp.name.replace('NLA.Original', 'NLA.Clip') + '-newClip';

    // Add to edit
    if (editComp) {
        var clipLayer = editComp.layers.add(newClip);
        clipLayer.enabled = false;
        if (editComp.numLayers >= 2) clipLayer.moveAfter(editComp.layer(2));

        // Add a weight slider
        var weightEffect = clipLayer.property('ADBE Effect Parade').addProperty('ADBE Slider Control');
        weightEffect.name = "NLA::" + i18n._("Weight"); /// TRANSLATORS: weight as the multiplicator of a value, a % or a ratio.
        weightEffect(1).setValue(100);
    }

    // Open clip
    newClip.openInViewer();

    return 1;
}

Duik.CmdLib['Automation']["Looper"] = "Duik.Automation.looper()";
/**
 * Adds a loop expression and pseudo effect with more options than the loopOut and loopIn expressions.
 * @param {PropertyBase[]|DuList.<PropertyBase>|PropertyBase} [props] The properties to loop. The selected properties in the active comp if omitted.
 * @param {PropertyGroup} [effect] The pseudo effect to use if it already exists.
 * @returns {PropertyGroup} The pseudo-effect
 */
Duik.Automation.looper = function(props, effect) {
    effect = Duik.Animation.interpolator(props, effect);
    if (!effect) return null;

    DuAE.beginUndoGroup( i18n._("Looper"), false);

    var i = Duik.PseudoEffect.INTERPOLATOR.props;

    // Set interpolation to none
    effect(i['Type'].index).setValue(1);
    // Set extrapolation to 100%
    effect(i['Extrapolation'].index).setValue(100);
    // Set cycles
    effect(i['In Extrapolation and loop']['Type'].index).setValue(4);
    effect(i['Out Extrapolation and loop']['Type'].index).setValue(4);
    // Activate
    effect(i['In Extrapolation and loop']['Before keys'].index).setValue(1);
    effect(i['Out Extrapolation and loop']['After keys'].index).setValue(1);

    return effect;
}

Duik.Automation.copiedExpression = '';
Duik.CmdLib['Automation']["Copy Expression"] = "Duik.Automation.copyExpression()";
/**
 * Copies the expression from the property, which can be pasted in multiple properties with {@link Duik.Automation.pasteExpression}.
 * @param {Property|DuAEProperty} [prop] The property, the selected/active property if omitted.
 * @returns {string} The expression.
 */
Duik.Automation.copyExpression = function(prop) {
    if (typeof prop === 'undefined') {
        var props = DuAEComp.getSelectedProps();
        if (props.length == 0) return Duik.Automation.copiedExpression;
        prop = props.pop();
    }

    prop = new DuAEProperty(prop);
    if (prop.riggable()) {
        prop = prop.getProperty();
        Duik.Automation.copiedExpression = prop.expression;
    }

    return Duik.Automation.copiedExpression;
}

Duik.CmdLib['Automation']["Paste Expression"] = "Duik.Automation.pasteExpression()";
/**
 * Pastes the expression previously copied with {@link Duik.Automation.copyExpression}.
 * @param {Property[]|DuAEProperty[]} [props] The properties where to paste the expression, the selecte properties if omitted.
 * @param {string} [expression] A specific expression to paste.
 */
Duik.Automation.pasteExpression = function(props, expression) {
    props = def(props, DuAEComp.getSelectedProps());
    if (props.length == 0) return;
    expression = def(expression, Duik.Automation.copiedExpression);

    DuAE.beginUndoGroup( i18n._("Paste expression"), false);

    var i = new DuList(props);
    i.do(function(prop) {
        prop = new DuAEProperty(prop);
        // Only for true props and not groups
        if (prop.riggable())
            prop.setExpression( expression, false );
    });

    DuAE.endUndoGroup( i18n._("Paste expression"));
}

Duik.CmdLib['Automation']["Remove Expressions"] = "Duik.Automation.removeExpressions()";
/**
 * Removes the expressions from the properties.
 * @param {Boolean} [keepPostExpressionValue=true]  Set to false to just remove the expressions and get back the pre expression value.
 * @param {Property[]|DuAEProperty[]} [props] The properties, the selected properties if omitted (or the selected layers).
 */
Duik.Automation.removeExpressions = function(keepPostExpressionValue, props) {
    keepPostExpressionValue = def(keepPostExpressionValue, true);
    props = def(props, DuAEComp.getSelectedProps());
    if (props.length == 0) props = DuAEComp.getSelectedLayers();
    if (props.length == 0) return;

    DuAE.beginUndoGroup( i18n._("Remove expressions"), false);

    for (var i = 0, num = props.length; i < num; i++) {
        var p = new DuAEProperty(props[i]);
        // Only for true props and not groups
        if (p.riggable())
            p.removeExpressions(undefined, keepPostExpressionValue);
    }

    DuAE.endUndoGroup( i18n._("Remove expressions"));

}

Duik.CmdLib['Automation']["Disable Expressions"] = "Duik.Automation.disableExpressions()";
/**
 * Disables the expressions from the properties.
 * @param {Property[]|DuAEProperty[]} [props] The properties, the selected properties if omitted (or the selected layers).
 */
Duik.Automation.toggleExpressions = function(props) {
    props = def(props, DuAEComp.getSelectedProps());
    if (props.length == 0) props = DuAEComp.getSelectedLayers();
    if (props.length == 0) return;

    DuAE.beginUndoGroup( i18n._("Toggle expressions"), false);

    var enabled = null;
    for (var i = 0, num = props.length; i < num; i++) {
        var p = new DuAEProperty(props[i]);
        // Only for true props and not groups
        if (p.riggable()) {
            if (enabled === null) {
                enabled = !p.expressionEnabled();
            }
            p.enableExpressions(enabled);
        }
    }

    DuAE.endUndoGroup( i18n._("Toggle expressions"));

}

Duik.CmdLib['Automation']["Bake Expressions"] = "Duik.Automation.bakeExpressions()";
/**
 * Bakes the expressions to keyframes
 * @param {DuAEExpression.BakeAlgorithm} [mode=DuAEExpression.BakeAlgorithm.SMART] The algorithm to use for baking the expressions.
 * @param {float} [frameStep=1.0] By default, checks one value per keyframe. A lower value increases the precision and allows for sub-frame sampling. A higher value is faster but less precise.
 * @param {Duik.SelectionMode} [selectionMode=DuAE.SelectionMode.SELECTED_PROPERTIES] The expressions to bake
 */
Duik.Automation.bakeExpressions = function(mode, frameStep, selectionMode) {
    // Defaults
    mode = def(mode, DuAEExpression.BakeAlgorithm.SMART);
    frameStep = def(frameStep, 1);
    selectionMode = def(selectionMode, DuAE.SelectionMode.SELECTED_PROPERTIES);

    DuAE.beginUndoGroup( i18n._("Bake expressions"), false);
    DuAEProject.setProgressMode(true, false); // For some reason the progress bar keeps poping up...

    //DuScriptUI.progressBar.stg("Baking expressions to keyframes");

    if (selectionMode == DuAE.SelectionMode.ALL_COMPOSITIONS)
        DuAEProject.bakeExpressions(mode, frameStep);
    else if (selectionMode == DuAE.SelectionMode.SELECTED_COMPOSITIONS) {
        var comps = DuAEProject.getSelectedComps();
        for (var i = 0, n = comps.length; i < n; i++) {
            DuAEComp.bakeExpressions(mode, frameStep, comps[i]);
        }
    }
    else if (selectionMode == DuAE.SelectionMode.ACTIVE_COMPOSITION)
        DuAEComp.bakeExpressions(mode, frameStep);
    else if (selectionMode == DuAE.SelectionMode.SELECTED_LAYERS) {
        var layers = DuAEComp.getSelectedLayers();
        for (var i = 0, n = layers.length; i < n; i++) {
            var p = new DuAEProperty(layers[i]);
            p.bakeExpressions(mode, frameStep);
        }
    }
    else {
        var props = DuAEComp.getSelectedProps(PropertyType.PROPERTY);
        for (var i = 0, n = props.length; i < n; i++) {
            var p = new DuAEProperty(props[i]);
            p.bakeExpressions(mode, frameStep);
        }
    }

    DuAEProject.setProgressMode(false);
    DuAE.endUndoGroup( i18n._("Bake expressions"));
}

Duik.CmdLib['Automation']["Bake Composition"] = "Duik.Automation.bakeComposition()";
/**
 * Bakes the expressions to keyframes, and remove all non-renderable layers
 * @param {DuAEExpression.BakeAlgorithm} [mode=DuAEExpression.BakeAlgorithm.SMART] The algorithm to use for baking the expressions.
 * @param {float} [frameStep=1.0] By default, checks one value per keyframe. A lower value increases the precision and allows for sub-frame sampling. A higher value is faster but less precise.
 */
Duik.Automation.bakeComposition = function(mode, frameStep, selectionMode) {
    // Defaults
    mode = def(mode, DuAEExpression.BakeAlgorithm.SMART);
    frameStep = def(frameStep, 1);

    DuAE.beginUndoGroup( i18n._("Bake composition"), false);
    DuAEProject.setProgressMode(true, false); // For some reason the progress bar keeps poping up...

    //DuScriptUI.progressBar.stg("Baking expressions to keyframes");

    if (selectionMode == DuAE.SelectionMode.ALL_COMPOSITIONS) DuAEProject.bakeCompositions(mode, frameStep);
    else if (selectionMode == DuAE.SelectionMode.SELECTED_COMPOSITIONS) {
        var comps = DuAEProject.getSelectedComps();
        for (var i = 0, n = comps.length; i < n; i++) {
            DuAEComp.bake(mode, frameStep, comp);
        }
    } else if (selectionMode == DuAE.SelectionMode.ACTIVE_COMPOSITION) DuAEComp.bake(mode, frameStep);
    else {
        var layers = DuAEComp.getSelectedLayers();
        for (var i = 0, n = layers.length; i < n; i++) {
            DuAELayer.bake( mode, frameStep, layers[i] );
        }
    } 

    DuAEProject.setProgressMode(false);
    DuAE.endUndoGroup( i18n._("Bake composition"));
}

Duik.CmdLib['Automation']["Effector"] = "Duik.Automation.effector()";
/**
 * Creates a spatial effector to control the selected properties.
 * @param {CompItem} [comp] The composition containing the effector. The active composition by default.
 */
Duik.Automation.effector = function(comp) {
    comp = def(comp, DuAEProject.getActiveComp());
    if (!comp) return;

    DuAE.beginUndoGroup( i18n._("Effector"), false);

    var props = DuAEComp.getSelectedProps();
    var layers = DuAEComp.getSelectedLayers();

    DuAEComp.setUniqueLayerNames(undefined, comp);

    // Create the effector layer and effect
    var ctrlLayer = comp.layers.addShape();
    Duik.Layer.setAttributes(ctrlLayer, Duik.Layer.Type.EFFECTOR, i18n._("Effector"));
    //effect
    var pe = Duik.PseudoEffect.EFFECTOR;
    var innerId = pe.props['Inner limit'].index;
    var outerId = pe.props['Outer limit'].index;
    var modeId = pe.props['Mode'].index;
    var typeId = pe.props['Interpolation']['Type'].index;
    var reverseId = pe.props['Interpolation']['Reverse'].index;
    var effect = pe.apply(ctrlLayer);
    //content
    var customPathGroup = ctrlLayer("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
    customPathGroup.name = "Custom Shape";
    var customPathContent = customPathGroup.property("ADBE Vectors Group");
    var customPathPath = customPathContent.addProperty("ADBE Vector Shape - Group");
    customPathPath.name = "Path";
    var customPathShape = new Shape();
    customPathShape.closed = true;
    customPathShape.vertices = [ [-100,100], [100,100], [100,-100], [-100,-100]];
    customPathPath(2).setValue( customPathShape );
    var stroke = customPathContent.addProperty("ADBE Vector Graphic - Stroke");
    stroke("ADBE Vector Stroke Color").setValue(DuColor.Color.RAINBOX_RED.floatRGBA());
    var customPathSubGroup = customPathContent.addProperty("ADBE Vector Group");
    var customPathSubContent = customPathSubGroup.property("ADBE Vectors Group");
    var customPathSubPath = customPathSubContent.addProperty("ADBE Vector Shape - Group");
    customPathSubPath(2).expression = DuAEExpression.Id.EFFECTOR + '\ncontent("Custom Shape").content("Path").path';
    var customPathOffset = customPathSubContent.addProperty("ADBE Vector Filter - Offset");
    customPathOffset(1).expression = DuAEExpression.Id.EFFECTOR + '\neffect("' + effect.name + '")(' + innerId + ').value ';
    customPathOffset(2).setValue(2);
    stroke = customPathSubContent.addProperty("ADBE Vector Graphic - Stroke");
    stroke("ADBE Vector Stroke Color").setValue(DuColor.Color.GREEN.floatRGBA());
    customPathSubGroup.transform.position.expression = '[0,0];';
    customPathGroup.transform.opacity.expression = DuAEExpression.Id.EFFECTOR + '\n' +
        'if (effect("' + effect.name + '")(' + modeId + ').value == 3) 100; else 0;';

    var centerGroup = ctrlLayer("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
    centerGroup.name = "Center";
    var centerContent = centerGroup.property("ADBE Vectors Group");
    var centerCircle = centerContent.addProperty("ADBE Vector Shape - Ellipse");
    centerCircle("ADBE Vector Ellipse Size").setValue([4, 4]);
    var centerFill = centerContent.addProperty("ADBE Vector Graphic - Fill");
    centerFill("ADBE Vector Fill Color").setValue(DuColor.Color.BLACK.floatRGBA());
    centerFill("ADBE Vector Fill Opacity").setValue(50);

    var innerGroup = ctrlLayer("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
    innerGroup.name = "Inner (Circle)";
    var innerContent = innerGroup.property("ADBE Vectors Group");
    var innerCircle = innerContent.addProperty("ADBE Vector Shape - Ellipse");
    innerCircle("ADBE Vector Ellipse Size").expression = DuAEExpression.Id.EFFECTOR + '\n' +
        'if (effect("' + effect.name + '")(' + modeId + ').value == 1)\n' +
        '{\n' +
        'var inner = effect("' + effect.name + '")(' + innerId + ')*2;\n' +
        '[inner,inner];\n' +
        '}\n' +
        'else [0,0];';
    var innerStroke = innerContent.addProperty("ADBE Vector Graphic - Stroke");
    innerStroke("ADBE Vector Stroke Color").setValue(DuColor.Color.GREEN.floatRGBA());
    innerGroup.property('ADBE Vector Transform Group').property('ADBE Vector Group Opacity').expression = DuAEExpression.Id.EFFECTOR + '\n' +
        'if (effect("' + effect.name + '")(' + modeId + ').value == 1) 100; else 0;';

    var outerGroup = ctrlLayer("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
    outerGroup.name = "Outer (Circle)";
    var outerContent = outerGroup.property("ADBE Vectors Group");
    var outerCircle = outerContent.addProperty("ADBE Vector Shape - Ellipse");
    outerCircle("ADBE Vector Ellipse Size").expression = DuAEExpression.Id.EFFECTOR + '\n' +
        'if (effect("' + effect.name + '")(' + modeId + ').value == 1)\n' +
        '{\n' +
        'var inner = effect("' + effect.name + '")(' + outerId + ')*2;\n' +
        '[inner,inner];\n' +
        '}\n' +
        'else [0,0];';
    var outerStroke = outerContent.addProperty("ADBE Vector Graphic - Stroke");
    outerStroke("ADBE Vector Stroke Color").setValue(DuColor.Color.RAINBOX_RED.floatRGBA());
    outerGroup.property('ADBE Vector Transform Group').property('ADBE Vector Group Opacity').expression = DuAEExpression.Id.EFFECTOR + '\n' +
        'if (effect("' + effect.name + '")(' + modeId + ').value == 1) 100; else 0;';

    var innerGroupLinear = ctrlLayer("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
    innerGroupLinear.name = "Inner (Line)";
    var innerContentLinear = innerGroupLinear.property("ADBE Vectors Group");
    var innerRect = innerContentLinear.addProperty("ADBE Vector Shape - Rect");
    innerRect("ADBE Vector Rect Size").expression = DuAEExpression.Id.EFFECTOR + '\n' +
        'if (effect("' + effect.name + '")(' + modeId + ').value == 2)\n' +
        '[effect("' + effect.name + '")(' + innerId + '),thisComp.height];\n' +
        'else [0,0];';
    var innerTrim = innerContentLinear.addProperty('ADBE Vector Filter - Trim');
    innerTrim('ADBE Vector Trim Start').setValue(50);
    innerTrim('ADBE Vector Trim End').expression = DuAEExpression.Id.EFFECTOR + '\n' +
        'var w = effect("' + effect.name + '")(' + innerId + ');\n' +
        'var h = thisComp.height;\n' +
        'var l = 2*w+2*h;\n' +
        '100-w/l*100;';
    var innerStroke = innerContentLinear.addProperty("ADBE Vector Graphic - Stroke");
    innerStroke("ADBE Vector Stroke Color").setValue(DuColor.Color.GREEN.floatRGBA());
    innerGroupLinear.property('ADBE Vector Transform Group').property('ADBE Vector Group Opacity').expression = DuAEExpression.Id.EFFECTOR + '\n' +
        'if (effect("' + effect.name + '")(' + modeId + ').value == 2) 100; else 0;';

    var outerGroupLinear = ctrlLayer("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
    outerGroupLinear.name = "Outer (Line)";
    var outerContentLinear = outerGroupLinear.property("ADBE Vectors Group");
    var outerRect = outerContentLinear.addProperty("ADBE Vector Shape - Rect");
    outerRect("ADBE Vector Rect Size").expression = DuAEExpression.Id.EFFECTOR + '\n' +
        'if (effect("' + effect.name + '")(' + modeId + ').value == 2)\n' +
        '[effect("' + effect.name + '")(' + innerId + '),thisComp.height];\n' +
        'else [0,0];';
    var outerTrim = outerContentLinear.addProperty('ADBE Vector Filter - Trim');
    outerTrim('ADBE Vector Trim Start').setValue(0);
    outerTrim('ADBE Vector Trim End').expression = DuAEExpression.Id.EFFECTOR + '\n' +
        'var w = effect("' + effect.name + '")(' + innerId + ');\n' +
        'var h = thisComp.height;\n' +
        'var l = 2*w+2*h;\n' +
        '100-(h+2*w)/l*100;';
    var outerStroke = outerContentLinear.addProperty("ADBE Vector Graphic - Stroke");
    outerStroke("ADBE Vector Stroke Color").setValue(DuColor.Color.RAINBOX_RED.floatRGBA());
    outerGroupLinear.property('ADBE Vector Transform Group').property('ADBE Vector Group Opacity').expression = DuAEExpression.Id.EFFECTOR + '\n' +
        'if (effect("' + effect.name + '")(' + modeId + ').value == 2) 100; else 0;';

    // Set defaults
    // Get half the maximum distance between layers
    var distance = DuAELayer.getMaxDistance(layers) / 2;
    effect(innerId).setValue(distance * .25);
    effect(outerId).setValue(distance * .75);

    // Setup Properties
    if (props.length != 0) {
        // Setup properties
        var ctrlLink;
        var exp = [ DuAEExpression.Id.EFFECTOR,
            'var fx = null;',
            'var result = value;',
            '',
            'try',
            '{',
            '    var ctrl = effect( "{#}" )( 1 );',
            '    fx = ctrl.effect( "' + effect.name + '" );',
            '}',
            'catch ( e )',
            '{}',
            '',
            DuAEExpression.Library.get(['getScale', 'shapePointsToLayer', 'inside', 'pointsToWorld', 'getLayerWorldPos', 'distanceToLine']),
            '',
            'function effector ()',
            '{',
            '    var min = fx( ' + innerId + ' ).value;',
            '    var max = fx( ' + outerId + ' ).value;',
            '    var mode = fx( ' + modeId + ' ).value;',
            '    var type = fx( ' + typeId + ' ).value;',
            '    var reverse = fx( ' + reverseId + ' ).value;',
            '',
            '    if ( mode == 2) //line',
            '    {',
            '        max = min;',
            '        min = 0;',
            '        reverse = !reverse;',
            '    }',
            '    else if (mode == 3) // custom shape',
            '    {',
            '        max = min;',
            '        min = 0;',
            '    }',
            '',
            ' 	// Get scale values',
            '	min = min * (getScale(ctrl)[0] / 100);',
            '	max = max * (getScale(ctrl)[0] / 100);',
            '',
            '   var distance = effectorDistance( max, mode );',
            '',
            '   return effectorValue( distance, min, max, type, reverse );',
            '}',
            '',
            'function effectorDistance ( max, mode )',
            '{',
            '    var worldPos = getLayerWorldPos( );',
            '',
            '    // circle',
            '    if ( mode == 1 ) return length( worldPos, getLayerWorldPos( time, ctrl ) );',
            '    //custom shape',
            '    if ( mode == 3 )',
            '    {',
            '        var polygon = ctrl.content("Custom Shape").content("Path").path;',
            '        polygon = shapePointsToLayer( polygon );',
            '        polygon = pointsToWorld( polygon, ctrl );',
            '        var r = inside( worldPos, polygon );',
            '        if (r.inside) return 0;',
            '        if (max == 0) return 1;',
            '        var closest = r.closestVertex;',
            '        var distance1, distance2;',
            '        if ( closest == 0 ) {',
            '            distance1 = distanceToLine( worldPos, [ polygon[ closest ], polygon[ polygon.length - 1 ] ] );',
            '            distance2 = distanceToLine( worldPos, [ polygon[ closest ], polygon[ closest + 1 ] ] );',
            '        } else if ( ( closest + 1 ) == polygon.length ) {',
            '            distance1 = distanceToLine( worldPos, [ polygon[ closest ], polygon[ closest - 1 ] ] );',
            '            distance2 = distanceToLine( worldPos, [ polygon[ closest ], polygon[ 0 ] ] );',
            '        } else {',
            '            distance1 = distanceToLine( worldPos, [ polygon[ closest ], polygon[ closest - 1 ] ] );',
            '            distance2 = distanceToLine( worldPos, [ polygon[ closest ], polygon[ closest + 1 ] ] );',
            '        }',
            '',
            '',
            '        if ( distance1 < distance2 ) {',
            '            return distance1;',
            '        } else {',
            '            return distance2;',
            '        }',
            '    }',
            '    //line',
            '    if ( mode == 2 ) ',
            '    {',
            '        var coords = ctrl.fromWorld( worldPos );',
            '        return -coords[ 0 ] + max / 2;',
            '    }',
            '',
            '    return 0;',
            '}',
            '',
            'function effectorValue ( distance, min, max, type, reverse )',
            '{',
            '    var t = 0;',
            '    var beginTime = key( 1 ).time;',
            '    var endTime = key( numKeys ).time;',
            '',
            '    if ( type == 1 )',
            '    {',
            '        if ( !reverse ) t = linear( distance, min, max, endTime, beginTime );',
            '        else t = linear( distance, min, max, beginTime, endTime );',
            '    }',
            '    else',
            '    {',
            '        var mid = ( min + max ) / 2;',
            '        if ( !reverse )',
            '        {',
            '            if ( distance > mid ) t = linear( distance, mid, max, endTime, beginTime );',
            '            else t = linear( distance, min, mid, beginTime, endTime );',
            '        }',
            '        else',
            '        {',
            '            if ( distance > mid ) t = linear( distance, mid, max, beginTime, endTime );',
            '            else t = linear( distance, min, mid, endTime, beginTime );',
            '        }',
            '    }',
            '    return valueAtTime( t );',
            '}',
            '',
            'result = ( fx && numKeys >= 2 ) ? effector() : result;',
            ''
		].join('\n');
        for(var i = 0, n = props.length; i < n; i++) {
            var prop = props [i];
            // Only for true props and not groups
            if (prop.riggable())
            {
                var layer = prop.layer;
                var linkEffect = DuAELayer.getCreateLayerEffect(layer, ctrlLayer, i18n._("Effector"));
                prop.setExpression( DuString.args(exp, linkEffect.name), false );
            }
        }
    }

    DuAE.endUndoGroup( i18n._("Effector"), false);

    return ctrlLayer;
}

/**
 * Creates a map (texture) effector to control the selected properties.
 * @param {AVLayer} mapLayer The layer to use as a texture/map.
 * @param {Property[]|DuAEProperty[]} [props] The properties, the selected properties if omitted (or the selected layers).
 */
Duik.Automation.effectorMap = function( mapLayer, props ) {

    // Create effect
    var pe = Duik.PseudoEffect.EFFECTOR_MAP;
    var channelId = pe.props['Channel'].index;
    var minId = pe.props['Minimum'].index;
    var maxId = pe.props['Maximum'].index;
    var reverseId = pe.props['Reverse'].index;

    var effect = pe.apply(mapLayer);

    // Setup properties
    props = new DuList(props);
    if (props.length() == 0) return;

    DuAE.beginUndoGroup( i18n._("Effector map"), false);

    DuAEComp.setUniqueLayerNames(undefined, props.first().comp);

    // Setup properties
    var ctrlLink;
    var exp = [DuAEExpression.Id.EFFECTOR_MAP,
		'var fx = null;',
		'var ctrl = null;',
		'var result = value;',
		'',
		'try',
		'{',
		'    ctrl = effect("{#}")(1);',
		'    fx = ctrl.effect( "' + effect.name + '" );',
		'}',
		'catch ( e )',
		'{}',
        '',
        DuAEExpression.Library.get(["isShapeLayer"]),
		'',
		'// Get layer world position',
		'function p ( l )',
		'{',
		'    return l.toWorld( l.anchorPoint )',
		'}',
		'',
		'function effector ()',
		'{',
		'    var min = fx( ' + minId + ' ).value;',
		'    var max = fx( ' + maxId + ' ).value;',
		'    var reverse = fx( ' + reverseId + ' ).value;',
		'    var channel = fx( ' + channelId + ' ).value;',
		'',
		'    min = min / 100;',
		'    max = max / 100;',
		'',
		'    var distance = effectorDistance( channel );',
		'    return effectorValue( distance, min, max, reverse );',
		'',
		'}',
		'',
		'function effectorDistance ( channel )',
		'{',
		'    var distance = 0;',
		'',
		'    var colorPoint = p( thisLayer );',
		'',
		'    if ( typeof channel === "undefined" ) channel = 5;',
		'    if (!isShapeLayer(ctrl)) colorPoint = ctrl.fromWorld( colorPoint );',
		'    var color = ctrl.sampleImage( colorPoint );',
		'    if ( channel <= 3 ) distance = color[ channel-1 ];',
		'	else if (channel <= 6)',
		'	{',
		'		color = rgbToHsl(color);',
		'		distance = color[ channel - 4 ];',
		'	}',
		'    else distance = color[ 3 ];',
		'',
		'    return distance;',
		'}',
		'',
		'function effectorValue ( distance, min, max, reverse )',
		'{',
		'    var t = 0;',
		'    var beginTime = key( 1 ).time;',
		'    var endTime = key( numKeys ).time;',
		'',
		'    if ( !reverse ) t = linear( distance, min, max, beginTime, endTime );',
		'    else t = linear( distance, min, max, endTime, beginTime );',
		'',
		'    return valueAtTime( t );',
		'}',
		'',
		'result = ( fx && numKeys >= 2 ) ? effector() : result;',
		''
	].join('\n');
    props.do(function(prop) {
        // Only for true props and not groups
        prop = new DuAEProperty(prop)
        if (prop.riggable())
        {
            var layer = prop.layer;
            var linkEffect = DuAELayer.getCreateLayerEffect(layer, mapLayer, i18n._("Effector map"));
            prop.setExpression( DuString.args(exp, linkEffect.name), false);
        }
        
    });

    // Select the map only
    DuAEComp.unselectLayers();
    mapLayer.selected = true;

    DuAE.endUndoGroup( i18n._("Effector map"), false );
}

Duik.CmdLib['Automation']["Kleaner"] = "Duik.Automation.kleaner()";
/**
 * Adds the <i>Kleaner</i> effect and expression to the properties.
 * The <i>Kleaner</i> (Keyframe Cleaner) makes it quick and easy to interpolate, add anticipation, overlap and follow through to any animation.
 * @param {PropertyBase[]|DuAEProperty[]|DuList|PropertyBase|DuAEProperty} [props] The properties, the selected properties if omitted (or the selected layers).
 * @param {PropertyGroup} [effect] The pseudo effect to use if it already exists.
 * @return {PropertyGroup|null} The Kleaner effect (or null if there's no property to setup).
 */
Duik.Automation.kleaner = function(props, effect) {
    props = def(props, DuAEComp.getSelectedProps());
    props = new DuList(props);
    if (props.length() == 0) return null;

    var p = props.at(0);
    p = new DuAEProperty(p);
    var ctrlLayer = p.layer;

    DuAE.beginUndoGroup("_" + i18n._("Kleaner"), false);

    DuAEComp.setUniqueLayerNames(undefined, ctrlLayer.containingComp);

    // Add the effect
    if (!effect)
    {
        effect = Duik.PseudoEffect.KLEANER.apply( ctrlLayer, i18n._("Kleaner") + ' | ' + p.name );
    }

    // Indices
    var i = Duik.PseudoEffect.KLEANER.props;

    // Setup the expressions in the Data
    
    var fuzzyLib = DuAEExpression.Library.get(["FuzzyVeracity", "linearExtrapolation"]);

    var interpolationRateExp = [DuAEExpression.Id.KLEANER,
        '',
        '// <=== MAIN PARAMETERS ===>',
        '',
        'var fx = thisProperty.propertyGroup();',
        'var weight = fx(' + i['Weight'].index + ').value;',
        'var strength = fx(' + i['Strength'].index + ').value;',
        'var will = fx(' + i['Will'].index + ').value;',
        'var friction = fx(' + i['Friction'].index + ').value;',
        'var useFuzzyLogic = fx(' + i['Performance']['Disable general parameters'].index + ').value == 0;',
        '',
        'var result = -.187;',
        '',
        '// <=== FUNCTIONS ===>',
        '',
        fuzzyLib,
        '',
        '// <=== DO IT ===>',
        '',
        'if (useFuzzyLogic) {',
        '  weight = new FuzzyVeracity( weight / 1000 );',
        '  strength = new FuzzyVeracity( strength / 1000 );',
        '  will = new FuzzyVeracity( will / 1000 );',
        '  friction = new FuzzyVeracity( friction / 1000 );',
        '  ',
        '  // Compute ratio',
        '  var inertia = weight.OR( strength.NEGATE() );',
        '  var resistance = friction.OR( will.NEGATE() );',
        '  var rate = resistance.OR( inertia );',
        '',
        '  result = linearExtrapolation(rate.veracity, 0.3, 1, -.8, 0);',
        '}',
        'result;'
	].join('\n');

    effect(i['Data']['Interpolation rate'].index).expression = interpolationRateExp;

    var overlapExp = [DuAEExpression.Id.KLEANER,
        '',
        '// <=== MAIN PARAMETERS ===>',
        '',
        'var fx = thisProperty.propertyGroup();',
        'var weight = fx(' + i['Weight'].index + ').value;',
        'var strength = fx(' + i['Strength'].index + ').value;',
        'var will = fx(' + i['Will'].index + ').value;',
        'var flexibility = fx(' + i['Flexibility'].index + ').value;',
        'var friction = fx(' + i['Friction'].index + ').value;',
        'var useFuzzyLogic = fx(' + i['Performance']['Disable general parameters'].index + ').value == 0;',
        '',
        'var result = 0.1;',
        '',
        '// <=== FUNCTIONS ===>',
        '',
        fuzzyLib,
        '',
        '// <=== DO IT ===>',
        '',
        'if (useFuzzyLogic) {',
        '  weight = new FuzzyVeracity( weight / 1000 );',
        '  strength = new FuzzyVeracity( strength / 1000 );',
        '  will = new FuzzyVeracity( will / 1000 );',
        '  flexibility = new FuzzyVeracity( flexibility / 1000 );',
        '  friction = new FuzzyVeracity( friction / 1000 );',
        '  ',
        '  flexibility.factor = 2;',
        '  friction.factor = 2;',
        '',
        '  // Compute ratio',
        '  var inertia = weight.OR( strength.NEGATE() );',
        '  var resistance = flexibility.AND( friction );',
        '  resistance.factor = 2;',
        '  resistance = resistance.OR( will.NEGATE() );',
        '  var overlap = resistance.OR(inertia);',
        '',
        '  result = linearExtrapolation(overlap.veracity, 0.72, 1, 0, 1);',
        '}',
        'result;'
	].join('\n');

    effect(i['Data']['Overlap'].index).expression = overlapExp;

    var anticipationQuantityExp = [DuAEExpression.Id.KLEANER,
        '',
        '// <=== MAIN PARAMETERS ===>',
        '',
        'var fx = thisProperty.propertyGroup();',
        'var will = fx(' + i['Will'].index + ').value;',
        'var useFuzzyLogic = fx(' + i['Performance']['Disable general parameters'].index + ').value == 0;',
        '',
        'var result = 0.15;',
        '',
        '// <=== FUNCTIONS ===>',
        '',
        fuzzyLib,
        '',
        '// <=== DO IT ===>',
        '',
        'if (useFuzzyLogic) {',
        '  result = linearExtrapolation(will, 0, 100, 0, result);',
        '}',
        'result;'
	].join('\n');

    effect(i['Data']['Anticipation quantity'].index).expression = anticipationQuantityExp;

    var anticipationDurationExp = [DuAEExpression.Id.KLEANER,
        '',
        '// <=== MAIN PARAMETERS ===>',
        '',
        'var fx = thisProperty.propertyGroup();',
        'var size = fx(' + i['Size'].index + ').value;',
        'var useFuzzyLogic = fx(' + i['Performance']['Disable general parameters'].index + ').value == 0;',
        '',
        'var result = 0.395;',
        '',
        '// <=== FUNCTIONS ===>',
        '',
        fuzzyLib,
        '',
        '// <=== DO IT ===>',
        '',
        '// <=== DO IT ===>',
        '',
        'if (useFuzzyLogic) {',
        '  result = linearExtrapolation(size, 0, 100, 0, .2 );',
        '  result = Math.min(result, 1.2);',
        '}',
        'result;',
        ''
	].join('\n');

    effect(i['Data']['Anticipation duration'].index).expression = anticipationDurationExp;

    var followThroughFlexibilityExp = [DuAEExpression.Id.KLEANER,
        '',
        '// <=== MAIN PARAMETERS ===>',
        '',
        'var fx = thisProperty.propertyGroup();',
        'var size = fx(' + i['Size'].index + ').value;',
        'var flexibility = fx(' + i['Flexibility'].index + ').value;',
        'var useFuzzyLogic = fx(' + i['Performance']['Disable general parameters'].index + ').value == 0;',
        '',
        'var result = 0.70;',
        '',
        '// <=== FUNCTIONS ===>',
        '',
        fuzzyLib,
        '',
        '// <=== DO IT ===>',
        '',
        'if (useFuzzyLogic) {',
        '  size = new FuzzyVeracity( size / 1000 );',
        '  flexibility = new FuzzyVeracity( flexibility / 1000 );',
        '  ',
        '  flexibility.factor = 2;',
        '  ',
        '  var flex = flexibility.AND( size );',
        '  result = linearExtrapolation(flex.veracity, 0, 0.03, 0, 2);',
        '}',
        'result;',
        ''
	].join('\n');

    effect(i['Data']['Follow through flexibility'].index).expression = followThroughFlexibilityExp;

    var followThroughDurationExp = [DuAEExpression.Id.KLEANER,
        '',
        '// <=== MAIN PARAMETERS ===>',
        '',
        'var fx = thisProperty.propertyGroup();',
        'var weight = fx(' + i['Weight'].index + ').value;',
        'var strength = fx(' + i['Strength'].index + ').value;',
        'var will = fx(' + i['Will'].index + ').value;',
        'var friction = fx(' + i['Friction'].index + ').value;',
        'var useFuzzyLogic = fx(' + i['Performance']['Disable general parameters'].index + ').value == 0;',
        '',
        'var result = 0.388;',
        '',
        '// <=== FUNCTIONS ===>',
        '',
        fuzzyLib,
        '',
        '// <=== DO IT ===>',
        '',
        'if (useFuzzyLogic) {',
        '  weight = new FuzzyVeracity( weight / 1000 );',
        '  strength = new FuzzyVeracity( strength / 1000 );',
        '  will = new FuzzyVeracity( will / 1000 );',
        '  friction = new FuzzyVeracity( friction / 1000 );',
        '  ',
        '  // Compute ratio',
        '  var damping = weight.OR( strength );',
        '  var resistance = friction.OR( will );',
        '  damping = resistance.OR( damping );',
        '  var duration = damping.NEGATE();',
        '',
        '  result = linearExtrapolation(duration.veracity, 0.55, 1, 0, 1);',
        '}',
        'result;'
	].join('\n');

    effect(i['Data']['Follow through duration'].index).expression = followThroughDurationExp;
    
    var slowDownRatioExp = [DuAEExpression.Id.KLEANER,
        '',
        '// <=== MAIN PARAMETERS ===>',
        '',
        'var fx = thisProperty.propertyGroup();',
        'var weight = fx(' + i['Weight'].index + ').value;',
        'var strength = fx(' + i['Strength'].index + ').value;',
        'var will = fx(' + i['Will'].index + ').value;',
        'var flexibility = fx(' + i['Flexibility'].index + ').value;',
        'var friction = fx(' + i['Friction'].index + ').value;',
        'var bounce = fx(' + i['Follow through']['Bounce'].index  +').value == 1;',
        'var useFuzzyLogic = fx(' + i['Performance']['Disable general parameters'].index + ').value == 0;',
        '',
        'var result = 0.60;',
        '',
        '// <=== FUNCTIONS ===>',
        '',
        fuzzyLib,
        '',
        '// <=== DO IT ===>',
        '',
        'if (useFuzzyLogic && !bounce) {',
        '  weight = new FuzzyVeracity( weight / 1000 );',
        '  strength = new FuzzyVeracity( strength / 1000 );',
        '  will = new FuzzyVeracity( will / 1000 );',
        '  friction = new FuzzyVeracity( friction / 1000 );',
        '  flexibility = new FuzzyVeracity(flexibility / 1000);',
        '  ',
        '  friction.factor = 2;',
        '   will.factor = 2;',
        '   flexibility.factor = 3;',
        '  ',
        '  var strong = strength.AND( will );',
        '  var slowDown = strong.OR( friction );',
        '  slowDown = slowDown.AND( weight );',
        '  slowDown = slowDown.AND( flexibility );',
        '',
        '  result = linearExtrapolation(slowDown.veracity, 0, 1, 0, 65);',
        '}',
        'else if (bounce) result = 0;',
        'result;'
	].join('\n');

    effect(i['Data']['Slow down ratio'].index).expression = slowDownRatioExp;

    var linearizeExp = [DuAEExpression.Id.KLEANER,
        'var weight = thisProperty.propertyGroup()(' + i['Weight'].index + ').value;',
	    '(100-weight)/100;'
	].join('\n');

    effect(i['Data']['Linearize'].index).expression = linearizeExp;

    // Setup the main expression

    var exp = [DuAEExpression.Id.KLEANER,
        '',
        '// <=== ADVANCED PARAMETERS ===>',
        '',
        'var fx = thisComp.layer("' + ctrlLayer.name + '").effect("' + effect.name + '");',
        'var anticipationCustomQuantity = fx(' + i['Anticipation']['Anticipation'].index + ').value;',
        'var anticipationCustomDuration = fx(' + i['Anticipation']['Duration'].index + ').value;',
        'var motionInterpolationRatio = fx(' + i['Motion interpolation']['Motion interpolation'].index + ').value;',
        'var motionUseAETrajectory = fx(' + i['Motion interpolation']['Use Ae spatial trajectory'].index + ').value;',
        'var customOverlap = fx(' + i['Overlap']['Overlap'].index + ').value;',
        'var fThroughCustomFlexibility = fx(' + i['Follow through']['Flexibility'].index + ').value;',
        'var fThroughCustomDuration = fx(' + i['Follow through']['Duration'].index + ').value;',
        'var bounce = fx(' + i['Follow through']['Bounce'].index + ').value;',
        'var fThroughAmplification = fx(' + i['Follow through']['Amplification'].index + ').value;',
        'var customSoftBody = fx(' + i['Soft body']['Flexibility'].index + ').value;',
        'var randomness = fx(' + i['Randomness']['Randomness'].index + ').value;',
        'var disableSimulation = fx(' + i['Performance']['Always disable simulations'].index + ').value;',
        'var timePrecision = fx(' + i['Performance']['Time precision'].index + ').value;',
        'var valuePrecision = fx(' + i['Performance']['Value precision'].index + ').value;',
        'var useMinLimit = fx(' + i['Limits']['Use minimum limit'].index + ').value;',
        'var useMaxLimit = fx(' + i['Limits']['Use maximum limit'].index + ').value;',
        'var minLimit = fx(' + i['Limits']['Minimum limit'].index + ').value;',
        'var maxLimit = fx(' + i['Limits']['Maximum limit'].index + ').value;',
        'var limitSoftness = fx(' + i['Limits']['Limit softness'].index + ').value;',
        '',
        '// <=== VALUES ===>',
        '',
        'var zeroVal = zero();',
        'var result = value;',
        'var interpolationRate = 0.725;',
        '',
        '// <=== GENERAL FUNCTIONS ===>',
        '',
        DuAEExpression.Library.get([
            "cbrt",
            "zero",
            "addNoise",
            "isAfterLastKey",
            "getNextKey",
            "getPrevKey",
            "getNextStopKey",
            "getPrevStartKey",
            "isStill",
            "isSpatial",
            "isKeyTop",
            "getPropWorldSpeed",
            "getPropWorldVelocity",
            "getPropWorldValue",
            "getLayerWorldPos",
            "gaussianInterpolation",
            "bezierInterpolation",
            "gaussianRateToBezierPoints",
            "limit"
        ]),
        '',
        '// <=== BEHAVIOR FUNCTIONS ===>',
        '',
        'function weightedInterpolation(t, tMin, tMax, value1, value2, gaussianRate, bezierRate) {',
        '  if (bezierRate >= 1) return linear(t, tMin, tMax, value1, value2);',
        '  ',
        '  var g = gaussianInterpolation(t, tMin, tMax, value1, value2, gaussianRate );',
        '  if (bezierRate <= 0) return g; ',
        '  ',
        '  var b = bezierInterpolation( t, tMin, tMax, value1, value2, [1-bezierRate, 0, bezierRate, 1]);',
        '  return linear(linearRate, 0, 1, g, b);',
        '}',
        '',
        'function mainMotion(t, gaussianRate, bezierRate, slowDown, useAETrajectory) {',
        '  if (numKeys < 2) return zeroVal;',
        '  var nKey = getNextKey(t, thisProperty);',
        '  if (!nKey) return zeroVal;',
        '  var pKey = getPrevKey(t, thisProperty);',
        '  if (!pKey) return zeroVal;',
        '',
        '  if (useAETrajectory && isSpatial()) return mainTrajectoryInterpolation(t, gaussianRate, bezierRate, slowDown);',
        '  ',
        '  return mainValueInterpolation(t, gaussianRate, bezierRate, slowDown);',
        '}',
        '',
        'function mainValueInterpolation(t, gaussianRate, bezierRate, slowDown) {',
        '  ',
        '  var nKey = getNextKey(t, thisProperty);',
        '  var pKey = getPrevKey(t, thisProperty);',
        '  ',
        '  // For each axis',
        '  var r = value;',
        '  var m = r instanceof Array;',
        '  if (!m) r = [r];',
        '  ',
        '  for ( var axis = 0; axis < r.length; axis++ ) {',
        '    ',
        '    // Values',
        '    var currentValue = value;',
        '    var nValue = nKey.value;',
        '    var pValue = pKey.value;',
        '    if (m) {',
        '      currentValue = currentValue[axis];',
        '      nValue = nValue[axis];',
        '      pValue = pValue[axis];',
        '    }',
        '    ',
        '    // Times',
        '    var nTime = nKey.time;',
        '    var pTime = pKey.time;',
        '    ',
        '    // 4 cases : both keys are a summit, or each one is, or none.',
        '    var pKeyTop = isKeyTop(pKey, axis);',
        '    var nKeyTop = isKeyTop(nKey, axis);',
        '    ',
        '    // Check if we can stop (we\'re still moving after the next key)',
        '    // i.e. there\'s no follow through later',
        '    var stop = slowDown >= 1;',
        '    if (!stop) stop = nKey.index < numKeys && !isStill(nKey.time + thisComp.frameDuration, threshold = .01, axis);',
        '',
        '    if (stop && nKeyTop && pKeyTop) {',
        '      r[axis] = weightedInterpolation(t, pTime, nTime, pValue, nValue, gaussianRate, bezierRate) - currentValue;',
        '      continue;',
        '    }',
        '    ',
        '    // Prepare bezier values for continuous keyframes',
        '    // Try to be as close as possible to the gaussian interpolation',
        '    var bPoints = gaussianRateToBezierPoints( gaussianRate );',
        '    var sO = bPoints[0];',
        '  	var sOV = bPoints[1];',
        '    var sI = bPoints[2];',
        '  	var sIV = bPoints[3];',
        '  	if (!pKeyTop) {',
        '  	  var prevKey = key(pKey.index - 1);',
        '  		var prevVal = prevKey.value;',
        '  		if (m) prevVal = prevVal[axis];',
        '  		sOV = (pValue - prevVal) / (nValue - prevVal);',
        '  		sO = .33;',
        '  	}',
        '  	if (!nKeyTop) {',
        '  	  var nextKey = key(nKey.index + 1);',
        '  		var nextVal = nextKey.value;',
        '  		if (m) nextVal = nextVal[axis];',
        '  		sIV = (nValue - nValue) / (nextVal - nValue);',
        '  		sI = .66;',
        '  	}',
        '  	else if (!stop) {',
        '  	  // end speed',
        '  	  sIV = slowDown/2+.5;',
        '  	}',
        '  	r[axis] = bezierInterpolation(t, pTime, nTime, pValue, nValue, [sO, sOV, sI, sIV]) - currentValue;',
        '  }',
        '',
        '  if (m) return r;',
        '  else return r[0];',
        '}',
        '',
        'function mainTrajectoryInterpolation(t, gaussianRate, bezierRate, slowDown) {',
        '  if (isStill(t)) return zeroVal;',
        '  ',
        '  var sKey = getPrevStartKey(t);',
        '  var eKey = getNextStopKey(t);',
        '  ',
        '  var stop = slowDown >= 1;',
        '  ',
        '  if (stop) return valueAtTime(',
        '    weightedInterpolation(t, sKey.time, eKey.time, sKey.time, eKey.time, gaussianRate, bezierRate)',
        '    ) - value;',
        '    ',
        '  // Try to be as close as possible to the gaussian interpolation',
        '  var bPoints = gaussianRateToBezierPoints( gaussianRate );',
        '  bPoints[3] = slowDown/2+.5;',
        '  return valueAtTime(',
        '    bezierInterpolation(t, sKey.time, eKey.time, sKey.time, eKey.time, bPoints)',
        '    ) - value;',
        '}',
        '',
        'function anticipation(duration, quantity, rate, linearRate) {',
        '  var anticipation = zeroVal;',
        '  // Check values',
        '  if (duration == 0) return anticipation;',
        '  if (quantity == 0) return anticipation;',
        '  // We need at least two keyframes, and can\'t be after the last one',
        '	if (isAfterLastKey()) return anticipation;',
        '	if (numKeys < 2) return anticipation;',
        '',
        '  // Check if an anticipation is needed',
        '	var nextKey = getNextKey(time, thisProperty);',
        '	var anticipationKey = nextKey;',
        '	if (!isStill(anticipationKey.time - 0.1, valuePrecision)) {',
        '		anticipationKey = getPrevKey(time, thisProperty);',
        '		if (!isStill(anticipationKey.time - 0.1, valuePrecision)) return anticipation;',
        '	}',
        '	if (anticipationKey.index == numKeys) return anticipation;',
        '',
        '	var anticipationMiddle = anticipationKey.time;',
        '	var anticipationStart = anticipationMiddle - anticipationDuration;',
        '	var anticipationEnd = key(anticipationKey.index + 1).time;',
        '	var startValue = anticipation;',
        '	var midValue = (-valueAtTime(anticipationMiddle + anticipationDuration) + anticipationKey.value) * anticipationQuantity / 2;',
        '	var endValue = anticipation;',
        '',
        '	if (time < anticipationStart) {',
        '		return anticipation;',
        '	} else if (time < anticipationMiddle) {',
        '		if (value instanceof Array) {',
        '			for (var i = 0; i < value.length; i++) {',
        '				anticipation[i] = weightedInterpolation(time, anticipationStart, anticipationMiddle, startValue[i], midValue[i], rate, linearRate);',
        '			}',
        '			return anticipation;',
        '		} else {',
        '			return weightedInterpolation(time, anticipationStart, anticipationMiddle, startValue, midValue, rate, linearRate);',
        '		}',
        '	} else if (time <= anticipationEnd) {',
        '		if (value instanceof Array) {',
        '			for (var i = 0; i < value.length; i++) {',
        '				anticipation[i] = weightedInterpolation(time, anticipationMiddle, anticipationEnd, midValue[i], endValue[i], rate, linearRate);',
        '			}',
        '			return anticipation;',
        '		} else {',
        '			return weightedInterpolation(time, anticipationMiddle, anticipationEnd, midValue, endValue, rate, linearRate);',
        '		}',
        '	} else {',
        '		return anticipation;',
        '	}',
        '}',
        '',
        'function followThrough(flexibility, duration, slowDown, bounce, simulate, overlapDuration, anticipationDuration) {',
        '  ',
        '  var propSpeed = length(velocity);',
        '  if (simulate) propSpeed = getPropWorldSpeed(time - overlapDuration, thisProperty);',
        '	if (propSpeed < .001) return followThroughAtTime(time - overlapDuration, flexibility, duration, slowDown, bounce, simulate);',
        '	',
        '	//need to get back in time get the last follow-through value to fade it',
        '	var fThrough = zeroVal;',
        '',
        '	var t = time;',
        '	while (t > 0) {',
        '		t = t - thisComp.frameDuration;',
        '		if (simulate) propSpeed = getPropWorldSpeed(t - overlapDuration, thisProperty);',
        '		else propSpeed = length(velocityAtTime(t));',
        '		if (propSpeed < .001) {',
        '			fThrough = followThroughAtTime(t - overlapDuration, flexibility, duration, slowDown, bounce, simulate);',
        '			break;',
        '		}',
        '	}',
        '',
        '	return easeIn(time, t, t + anticipationDuration * 2, fThrough, zeroVal);',
        '}',
        '',
        'function followThroughAtTime(t, flexibility, duration, slowDown, bounce, simulate) {',
        '	var fThrough = zeroVal;',
        '',
        '	//checks',
        '	if (flexibility == 0) return fThrough;',
        '	var elasticity = 1/flexibility;',
        '	if (duration == 0) return fThrough;',
        '	var damping = 1/duration;',
        '	if (slowDown == 1) return fThrough;',
        '	',
        '	var propSpeed;',
        '	',
        '	if (!simulate) {',
        '		if (numKeys < 2) return fThrough;',
        '		if (nearestKey(t).index == 1) return fThrough;',
        '		propSpeed = length(velocityAtTime(t));',
        '		if (propSpeed >= .001) return fThrough;',
        '	} else {',
        '		propSpeed = getPropWorldSpeed(t, thisProperty);',
        '		if (propSpeed >= .001) return fThrough;',
        '	}',
        '',
        '	//check state and time',
        '	var fThroughStart = 0;',
        '	var fThroughTime = 0;',
        '',
        '	if (simulate) {',
        '		var speedI = getPropWorldSpeed(t, thisProperty);',
        '		var i = t;',
        '		//search for the time when the layer last moved',
        '		while (speedI < valuePrecision && i > 0) {',
        '			i = i - thisComp.frameDuration / timePrecision;',
        '			speedI = getPropWorldSpeed(i, thisProperty);',
        '		}',
        '		fThroughStart = i;',
        '	} else {',
        '		//follow through starts at previous key',
        '		var fThroughKey = getPrevKey(t, thisProperty);',
        '		fThroughStart = fThroughKey.time;',
        '	}',
        '',
        '	if (fThroughStart == 0) return fThrough;',
        '',
        '	fThroughTime = t - fThroughStart;',
        '',
        '	//from velocity',
        '	if (simulate) fThrough = getPropWorldVelocity(fThroughStart - thisComp.frameDuration, thisProperty ) / 2;',
        '	else {',
        '	  ',
        '	  fThrough = velocityAtTime(fThroughStart - thisComp.frameDuration);',
        '	  fThrough *= 1-Math.cbrt(slowDown);',
        '	}',
        '',
        '',
        '	if (bounce) {',
        '		var cycleDamp = Math.exp(fThroughTime * damping * .1);',
        '		var damp = Math.exp(fThroughTime * damping) / (elasticity / 2);',
        '		var cycleDuration = 1 / (elasticity * 2);',
        '		//round to whole frames for better animation',
        '		cycleDuration = Math.round(timeToFrames(cycleDuration));',
        '		cycleDuration = framesToTime(cycleDuration);',
        '		var midDuration = cycleDuration / 2;',
        '		var maxValue = fThrough * midDuration;',
        '		//check which cycle it is and cycvarime',
        '		var cycvarime = fThroughTime;',
        '		// the number of cycles where we "cheat" which are rounded to two frames',
        '		var numEndCycles = 1;',
        '		while (cycvarime > cycleDuration) {',
        '			cycvarime = cycvarime - cycleDuration;',
        '			cycleDuration = cycleDuration / cycleDamp;',
        '			//round everything to whole frames for better animation',
        '			cycleDuration = Math.round(timeToFrames(cycleDuration));',
        '			//this is where we cheat to continue to bounce on cycles < 2 frames',
        '			if (cycleDuration < 2) {',
        '				cycleDuration = 2;',
        '				numEndCycles++;',
        '			}',
        '			cycleDuration = framesToTime(cycleDuration);',
        '			midDuration = cycleDuration / 2;',
        '			maxValue = fThrough * midDuration / damp;',
        '			if (numEndCycles > 100 / damping && maxValue < valuePrecision) return zeroVal;',
        '		}',
        '',
        '		if (cycvarime < midDuration) fThrough = bezierInterpolation(cycvarime, 0, midDuration, 0, maxValue, [0, .1, .33, 1]);',
        '		else fThrough = bezierInterpolation(cycvarime, midDuration, cycleDuration, maxValue, 0, [1 - .33, 0, 1, .9]);',
        '	} else {',
        '		// damping ratio',
        '		var damp = Math.exp(fThroughTime * damping);',
        '		// sinus evolution ',
        '		var sinus = elasticity * fThroughTime * 2 * Math.PI;',
        '		//sinus',
        '		sinus = Math.sin(sinus);',
        '		// elasticity',
        '		sinus = .3 / elasticity * sinus;',
        '		// damping',
        '		sinus = sinus / damp;',
        '		if (Math.abs(sinus) < .001 / 100) return 0;',
        '		// result',
        '		fThrough = fThrough * sinus;',
        '',
        '		if (.001 > 0) {',
        '			fThrough = fThrough * (1 - propSpeed / valuePrecision);',
        '		}',
        '	}',
        '',
        '	if (bounce) {',
        '		var prevValue = valueAtTime(fThroughStart - thisComp.frameDuration);',
        '		var startValue = valueAtTime(fThroughStart);',
        '		if (value instanceof Array) {',
        '			for (var i = 0; i < prevValue.length; i++) {',
        '				if (prevValue[i] > startValue[i]) fThrough[i] = Math.abs(fThrough[i]);',
        '				if (prevValue[i] < startValue[i]) fThrough[i] = -Math.abs(fThrough[i]);',
        '			}',
        '		} else {',
        '			if (prevValue > startValue) fThrough = Math.abs(fThrough);',
        '			if (prevValue < startValue) fThrough = -Math.abs(fThrough);',
        '		}',
        '	}',
        '',
        '	if (simulate) {',
        '		if (thisProperty !== position) {',
        '			fThrough = fThrough + getLayerWorldPos(time, thisLayer);',
        '			fThrough = thisLayer.fromWorld(fThrough) - thisLayer.anchorPoint;',
        '		} else if (thisLayer.hasParent) {',
        '			fThrough = fThrough + getLayerWorldPos(time, thisLayer.parent);',
        '			fThrough = thisLayer.parent.fromWorld(fThrough) - thisLayer.parent.anchorPoint;',
        '		}',
        '	}',
        '',
        '	return fThrough;',
        '}',
        '',
        'function overlap(overlapDuration, flexibility, t) {',
        '',
        '	var isThisPosition = thisProperty === position;',
        '	',
        '	if (isThisPosition && !hasParent) return zeroVal;',
        '	',
        '	if (typeof t === \'undefined\') t = time;',
        '	',
        '	// The position before overlapDuration',
        '	var ol = getPropWorldValue(t - overlapDuration, thisProperty);',
        '	',
        '	// A ratio : velocity of the motion / distance between parent',
        '	var motionRatio = 1;',
        '	var originalDistance = length(valueAtTime(0));',
        '	var motionVelocity = length(getPropWorldValue(t-thisComp.frameDuration/timePrecision, thisProperty), getPropWorldValue(t, thisProperty));',
        '	motionRatio = ease(motionVelocity, 0, originalDistance, 1, 1-flexibility);',
        '',
        '	//pull towards the anchor position (or the parent for the position)',
        '  if (isThisPosition) {',
        '  	var prevParentWorldPos = getLayerWorldPos(t - overlapDuration, parent);',
        '  	ol = (ol - prevParentWorldPos) * motionRatio + prevParentWorldPos;',
        '  }',
        '	else {',
        '	  var prevAnchorWorldPos = getPropWorldValue(t - overlapDuration, anchorPoint);',
        '	  ol = (ol - prevAnchorWorldPos) * motionRatio + prevAnchorWorldPos;',
        '	}',
        '	',
        '	',
        '	// Convert back to local coordinates',
        '	if (isThisPosition) ol = parent.fromWorld(ol);',
        '	else ol = thisLayer.fromWorld(ol);',
        '',
        '	return ol - value;',
        '}',
        '',
        '// Logic results',
        '',
        'var interpolationRate = fx(' + i['Data']['Interpolation rate'].index + ').value;',
        'var overlapDuration = fx(' + i['Data']['Overlap'].index + ').value;',
        'var anticipationQuantity = fx(' + i['Data']['Anticipation quantity'].index + ').value;',
        'var anticipationDuration = fx(' + i['Data']['Anticipation duration'].index + ').value;',
        'var fThroughFlexibility = fx(' + i['Data']['Follow through flexibility'].index + ').value;',
        'var fThroughDuration = fx(' + i['Data']['Follow through duration'].index + ').value;',
        'var slowDown = fx(' + i['Data']['Slow down ratio'].index + ').value;',
        'var linearRate = fx(' + i['Data']['Linearize'].index + ').value;',
        'var softBodyFexibility = fThroughFlexibility;',
        '',
        '// ADJUSTMENTS',
        '',
        '// random!',
        'seedRandom(0, true);',
        '',
        '// anticipation',
        'anticipationDuration *= anticipationCustomDuration/100;',
        'anticipationQuantity *= anticipationCustomQuantity/100;',
        'motionInterpolationRatio /= 100;',
        'motionUseAETrajectory = motionUseAETrajectory == 1;',
        'fThroughFlexibility *= fThroughCustomFlexibility/100;',
        'fThroughFlexibility = addNoise( fThroughFlexibility, randomness );',
        'fThroughDuration *= fThroughCustomDuration/100;',
        'fThroughDuration = addNoise( fThroughDuration, randomness );',
        'if (fThroughFlexibility < .01) fThroughFlexibility = 0;',
        'if (fThroughDuration < .01) fThroughDuration = 0;',
        'var doFollowThrough = fThroughFlexibility != 0 && fThroughDuration != 0;',
        'if (!doFollowThrough) slowDown = 1;',
        'bounce = bounce == 1;',
        'fThroughAmplification /= 100;',
        'softBodyFexibility *= customSoftBody/100;',
        'var simulate = disableSimulation == 0;',
        'if (simulate)',
        '{',
        '  // Check if simulation is possible, and needed',
        '  // disable if :',
        '  // - prop is not spatial, or position has keyframes',
        '  if (!isSpatial()) simulate = false;',
        '  else if (thisProperty === position && thisProperty.numKeys > 0) simulate = false;',
        '  // - custom soft body and custom overlap are 0',
        '  else if (customSoftBody == 0 && customOverlap == 0) simulate = false;',
        '  // - overlap is 0 and (!doFollowThrough)',
        '  else if (overlapDuration == 0 && !doFollowThrough) simulate = false;',
        '  // - No parent = no simulation on the position',
        '  else if (thisProperty === position && !thisLayer.hasParent) simulate = false;',
        '  ',
        '  // Adjust the flexibility and other parameters in case of simulation',
        '  //adjust elasticity based on flexibility',
        '  if (simulate) {',
        '    ',
        '    if (thisProperty === position) overlapDuration *= customOverlap/100;',
        '    else overlapDuration *= softBodyFexibility;',
        '    ',
        '  	//get the distance from anchor ratio',
        '  	var distanceRatio = 1;',
        '  	if (thisProperty !== position)',
        '  	{',
        '  	  distanceRatio = length(valueAtTime(0), anchorPoint) / (thisLayer.width / 2);',
        '  	  //adjust with soft-body flexibility',
        '  	  distanceRatio *= softBodyFexibility;',
        '  	}',
        '  ',
        '	  fThroughFlexibility = fThroughFlexibility * distanceRatio;',
        '	  fThroughDuration = fThroughDuration * distanceRatio;',
        '	  overlapDuration = overlapDuration * distanceRatio;',
        '	  ',
        '	  overlapDuration = addNoise( overlapDuration, randomness );',
        '  }',
        '}',
        '// Disable overlap without simulation',
        'if (!simulate) overlapDuration = 0;',
        '',
        'if (motionInterpolationRatio > 0)',
        '{',
        '  result += mainMotion(time, interpolationRate, linearRate, slowDown, motionUseAETrajectory) * motionInterpolationRatio;',
        '}',
        'result += anticipation(anticipationDuration, anticipationQuantity, interpolationRate, linearRate);',
        'if (overlapDuration > 0)',
        '{',
        '  result += overlap(overlapDuration, fThroughFlexibility);',
        '}',
        'if (doFollowThrough)',
        '{',
        '    var ft = followThrough(fThroughFlexibility, fThroughDuration, slowDown, bounce, simulate, overlapDuration, anticipationDuration);',
        '    ft *= linear(motionInterpolationRatio, 0, 1, 1, 0.5);',
        '    ft *= fThroughAmplification;',
        '    result += ft;',
        '}',
        'if (!useMinLimit) minLimit = null;',
        'if (!useMaxLimit) maxLimit = null;',
        'result = limit(result, minLimit, maxLimit, limitSoftness);',
        'result;',//*/
        ''
	].join('\n');

    // Clean keyframes and Add expressions
    props.do(function (prop)
    {
        prop = new DuAEProperty(prop);
        if (prop.isProperty())
        {
            // Fix spatial interpolations
            prop.fixSpatialInterpolation();
            // Set Linear
            prop.setInterpolation(KeyframeInterpolationType.LINEAR);
            // Clean keyframes
            prop.cleanKeyframes();
            // Set auto roving
            prop.setRoving();
            // Set expression
            if (prop.riggable())
                prop.setExpression( exp, false );
        }
        
    });

    DuAE.endUndoGroup("_" + i18n._("Kleaner"));

    return effect;
}

Duik.CmdLib['Automation']["Swink"] = "Duik.Automation.swink()";
Duik.CmdLib['Automation']["Swing"] = "Duik.Automation.swink()";
Duik.CmdLib['Automation']["Blink"] = "Duik.Automation.swink(undefined, true)";
/**
 * Adds the <i>Swink</i> effect and expression to the properties.
 * The <i>Swink</i> (Swing and Blink) makes the property swing between two values, with optional controls on the interpolation.
 * @param {PropertyBase[]|DuAEProperty[]|DuList|PropertyBase|DuAEProperty} [props] The properties, the selected properties if omitted (or the selected layers).
 * @param {boolean} [blink=false] Set to true to set the interpolation to hold by default.
 * @return {DuAEProperty[]} The Swink effects.
 */
Duik.Automation.swink = function(props, blink) {
    blink = def(blink, false);
    props = def(props, DuAEComp.getSelectedProps());
    props = new DuList(props);
    if (props.length() == 0) return [];

    DuAE.beginUndoGroup( i18n._("Swink"), false);

    DuAEComp.setUniqueLayerNames(undefined, props.first().comp );

    // Apply
    var effects = [];
    var swinkName = ' | ' + i18n._("Swink");

    props.do(function(prop) {
        prop = new DuAEProperty(prop);
        if (prop.isGroup()) return;
        var layer = prop.layer;

        // Add effect
        var d = prop.dimensions();
        
        var pe = null;
        if (d == 1) pe = Duik.PseudoEffect.ONED_SWINK;
        else if (d == 2) pe = Duik.PseudoEffect.TWOD_SWINK;
        else if (d == 3) pe = Duik.PseudoEffect.THREED_SWINK;
        else if (d == 4) pe = Duik.PseudoEffect.COLOR_SWINK;
        else return;

        // The indices
        var effect = pe.apply(layer, prop.name + swinkName);
        var i = pe.props;

        // The expression
        var exp = [ 
            'var AValue = fx(' + i['A'].index + ').value;',
            'var BValue = fx(' + i['B'].index + ').value;',
            'var frequencyProp = fx(' + i['Frequency'].index + ');',
            'var interpolationValue = fx(' + i['Interpolation']['Mode'].index + ').value;',
            'var rateValue = fx(' + i['Interpolation']['Rate'].index + ').value;',
            'var offsetValue = fx(' + i['Cycle offset'].index + ').value;',
            'var ratioValue = fx(' + i['A/B Ratio'].index + ').value;',
            'var plateauValue = fx(' + i['Plateau'].index + ').value;'
        ].join('\n');

        if (d == 4) exp += [
            'var colorMode = fx(' + i['Color Mode'].index + ').value;',
            'var colorspace = fx(' + i['Interpolation']['Colorspace'].index + ').value'
        ].join('\n');

        exp += [
            '',
            'var result = value;',
            'var frequencyValue = frequencyProp.value;',
            '',
            DuAEExpression.Library.get([
                'bezierInterpolation',
                'gaussianInterpolation',
                'logInterpolation',
                'expInterpolation',
                'integrateLinearKeys',
                'interpolateColor',
                'multSets'
            ]),
            '',
            'function blink( A, B, frequency, offset, ratio, t ) {',
            '  if (typeof frequency === \'undefined\') frequency = 1.0;',
            '  if (typeof offset === \'undefined\') offset = 0.0;',
            '  if (typeof ratio === \'undefined\') ratio = 0.5;',
            '  if (typeof t === \'undefined\') t = time;',
            '',
            '  var phase = 1/frequency;',
            '  ',
            '  var currentTime = (t+offset)%phase;',
            '  var ADuration = phase*ratio;',
            '  ',
            '	if (currentTime > ADuration) return B;',
            '	return A;',
            '}',
            '',
            'function swing( A, B, frequency, offset, ratio, plateau, interpolationMethod, t ) {',
            '  if (typeof frequency === \'undefined\') frequency = 1.0;',
            '  if (typeof offset === \'undefined\') offset = 0.0;',
            '  if (typeof ratio === \'undefined\') ratio = 0.5;',
            '  if (typeof plateau === \'undefined\') plateau = 0.0;',
            '  if (typeof interpolationMethod === \'undefined\') interpolationMethod = ease;',
            '  if (typeof t === \'undefined\') t = time;',
            '  ',
            '  var phase = 1/frequency;',
            '  ',
            '  var currentTime = (t+offset)%phase;',
            '  var ADuration = phase*ratio;',
            '  var APlateau = ADuration*plateau;',
            '  var BDuration = phase*(1-ratio);',
            '  var BPlateau = BDuration*plateau;',
            '  ',
            '  // A to B',
            '  if (currentTime < ADuration-APlateau) return interpolationMethod(currentTime, 0, ADuration-APlateau, A, B);',
            '  // B plateau',
            '  if (currentTime >= ADuration-APlateau && currentTime < ADuration) return B;',
            '  // B to A',
            '  if (currentTime >= ADuration && currentTime < phase-BPlateau) return interpolationMethod(currentTime, ADuration, phase-BPlateau, B, A);',
            '  // A plateau ',
            '  return A;',
            '}',
            '',
            'if (frequencyValue > 0) {'
        ].join('\n');

        if (d == 4) exp += [
            '// Adjust color values',
            'result = [0,0,0,0];',
            'if (colorMode == 2) {',
            'AValue += value;',
            'BValue += value;',
            '}',
            'else if (colorMode == 3) {',
            'AValue = multSets(AValue, value);',
            'BValue = multSets(BValue, value);',
            '}',
            'else if (colorMode == 4) {',
            'AValue = multSets(AValue, value);',
            'BValue += value;',
            '}'
        ].join('\n');

        exp += [
            '  offsetValue = offsetValue/100/frequencyValue;',
            '  ratioValue /= 100;',
            '  plateauValue /= 100;',
            '  var t = integrateLinearKeys( frequencyProp );',
            '  // Hold (Blink)',
            '  if (interpolationValue == 1) result += blink( AValue, BValue, 1, offsetValue, ratioValue, t);',
            '  else {',
            '    var i = linear;',
            '    // Smooth',
            '    if (interpolationValue == 3) i = function (t, tMin, tMax, value1, value2) { return bezierInterpolation(t, tMin, tMax, value1, value2, [rateValue/10.0, 0.0, 1-rateValue/10.0, 1.0]); };',
            '    // Natural',
            '    if (interpolationValue == 4) i = function (t, tMin, tMax, value1, value2) { return gaussianInterpolation(t, tMin, tMax, value1, value2, linear(rateValue, 0, 10, -1, 1)); };',
            '    // Slow Down',
            '    if (interpolationValue == 5) i = function (t, tMin, tMax, value1, value2) { return logInterpolation(t, tMin, tMax, value1, value2, rateValue*50*frequencyValue); };',
            '    // Speed up',
            '    if (interpolationValue == 6) i = function (t, tMin, tMax, value1, value2) { return expInterpolation(t, tMin, tMax, value1, value2, rateValue*frequencyValue); };',
        ].join('\n');

        if (d== 4) exp += [
            'var interpolator = function(t, tMin, tMax, value1, value2) {',
            '	return interpolateColor(t, colorspace-1, tMin, tMax, value1, value2, i);',
            '}'
        ].join('\n');
        else exp += 'var interpolator = i;';


        exp += [
            '',
            '  result += swing( AValue, BValue, 1, offsetValue, ratioValue, plateauValue, interpolator, t);',
            '  }',
            '}',
            '',
            'result;'
        ].join('\n');

        prop.setExpression(
            DuAEExpression.Id.SWINK + '\nvar fx = effect("' + effect.name + '");\n' + exp,
            false
        );

        // Set values
        if (blink) effect(i['Interpolation']['Mode'].index).setValue(1);
        if (d != 4) {
            var v = prop.value( true )/4;
            effect(i['A'].index).setValue( - v );
            effect(i['B'].index).setValue( v );
        }
        else {
            var v = prop.value( true );
            effect(i['A'].index).setValue( v );
            effect(i['B'].index).setValue( v );
            effect(i['Color Mode'].index).setValue( 4 );
        }
       

        effects.push(new DuAEProperty(effect));
    });

    DuAE.endUndoGroup( i18n._("Swink"));

    return effects;
}

Duik.CmdLib['Automation']["Wiggle"] = "Duik.Automation.wiggle()";
/**
 * Adds a random but smooth animation to the selected properties.
 * @param {Bool} [separateDimensions=false] Use one value for each dimension/channel.
 * @param {Bool} [individualControls=false] Use one control for each of the properties.
 * @param {PropertyBase[]|DuAEProperty[]|DuList.<PropertyBase>|PropertyBase|DuAEProperty} [props] The properties, the selected properties if omitted (or the selected layers).
 */
Duik.Automation.wiggle = function(separateDimensions, individualControls, props) {
    props = def(props, DuAEComp.getSelectedProps());
    props = new DuList(props);
    if (props.length() == 0) return [];

    separateDimensions = def ( separateDimensions, false );
    individualControls = def ( individualControls, false );

    DuAE.beginUndoGroup( i18n._("Wiggle"), false);

    DuAEComp.setUniqueLayerNames(undefined, props.first().comp );

    var effect = null;
    var pe = null;
    var i = null;

    var layers = DuAEComp.unselectLayers();
    props.do(function(prop)
    {
        prop = new DuAEProperty(prop);
        if (prop.isGroup()) return;
        var layer = prop.layer;
        var dimensions = prop.dimensions();
        var comp = prop.comp;

        // Create effect
        if (effect == null || individualControls)
        {
            var effectName = i18n._("Wiggle");
            if (individualControls || props.length() == 1) effectName = prop.name + " | " + effectName;

            if (!separateDimensions && dimensions > 1) pe = Duik.PseudoEffect.MULTI_WIGGLE;
            else if (dimensions == 1) pe = Duik.PseudoEffect.ONED_WIGGLE;
            else if (dimensions == 2) pe = Duik.PseudoEffect.TWOD_WIGGLE;
            else if (dimensions == 3) pe = Duik.PseudoEffect.THREED_WIGGLE;
            else if (dimensions == 4) pe = Duik.PseudoEffect.COLOR_WIGGLE;
            else return;

            effect = pe.apply(layer, effectName);
            effect = new DuAEProperty(effect);

            // Set default values
            i = pe.props;
            effect.prop( i['Loop duration (s)'].index ).setValue( comp.duration );
            effect.prop( i['Details']['Random Seed'].index ).setValue( DuMath.random(0,9999) + layer.index );
        }

        // Check the comp link
        var sameComp = effect.comp.name == comp.name;

        var effectLink = "var fx = " + effect.expressionLink(sameComp);
        if (!separateDimensions && dimensions > 1)
	    {
            prop.getProperty().expression = DuAEExpression.Id.WIGGLE + '\n' + effectLink + '\n' +
				'var freq = fx(' + i['Frequency'].index + ');\n' +
				'var amp = fx(' + i['Amplitude'].index + ').value;\n' +
				'var linked = fx(' + i['Link dimensions'].index + ').value;\n' +
				'var loop = fx(' + i['Loop duration (s)'].index + ').value;\n' +
				'var complexity = fx(' + i['Details']['Complexity (octaves)'].index + ').value;\n' +
				'var multiplier = fx(' + i['Details']['Multiplier'].index + ').value;\n' +
				'var seed = fx(' + i['Details']['Random Seed'].index + ').value;\n' +
                'var layerSeed = fx(' + i['Details']['One seed per layer'].index + ').value;\n' + 
                '\n' +
                DuAEExpression.Library.get(['integrateLinearKeys']) + '\n' + 
                '\n' +
                'var result = value;\n' +
                'if (fx.active) {\n' + 
                'if (layerSeed) seed += index;\n' + 
                'seedRandom(seed);\n' + 
                'var doLoop = freq.numKeys < 2;\n' + 
                'if (loop == 0) loop = thisComp.duration;\n' + 
                'var t = time;\n' + 
                'var f = 1;\n' + 
                'if (doLoop) {\n' + 
                '    t = (time % loop)-loop;\n' + 
                '    f = freq.value;\n' + 
                '}\n' + 
                'else {\n' + 
                '    t = integrateLinearKeys( freq );\n' + 
                '}\n' + 
				'var w1 = wiggle(f, amp, complexity, multiplier, t);\n' +
				'var w2 = wiggle(f, amp, complexity, multiplier, t - loop);\n' +
				'var w = w1;\n' +
                'if (doLoop) w = ease(t, -loop,  0, w1, w2);\n' +
				'result = [];\n' +
				'if(linked) while (result.length < value.length) result.push(w[0]);\n' +
				'else result = w;\n' +
				'result += value - valueAtTime(0);\n' +
                '}\n' +
                'result;';
        }
        else if (dimensions == 4)
        {
            prop.getProperty().expression = DuAEExpression.Id.WIGGLE + '\n' + effectLink + '\n' +
				'var freq = fx(' + i['Frequency'].index + ');\n' +
				'var amp = fx(' + i['Amplitude'].index + ').value;\n' +
				'var loop = fx(' + i['Loop duration (s)'].index + ').value;\n' +
				'var complexity = fx(' + i['Details']['Complexity (octaves)'].index + ').value;\n' +
				'var multiplier = fx(' + i['Details']['Multiplier'].index + ').value;\n' +
				'var seed = fx(' + i['Details']['Random Seed'].index + ').value;\n' +
                'var layerSeed = fx(' + i['Details']['One seed per layer'].index + ').value;\n' +
                'var channel = fx(' + i['Channel'].index + ').value;\n' +
                '\n' +
                DuAEExpression.Library.get(['integrateLinearKeys']) + '\n' + 
                '\n' +
                'var result = value;\n' +
                'if (fx.active) {\n' + 
                'if (layerSeed) seed += index;\n' + 
                'seedRandom(seed);\n' + 
                'var doLoop = freq.numKeys < 2;\n' + 
                'if (loop == 0) loop = thisComp.duration;\n' + 
                'var t = time;\n' + 
                'var f = 1;\n' + 
                'if (doLoop) {\n' + 
                '    t = (time % loop)-loop;\n' + 
                '    f = freq.value;\n' + 
                '}\n' + 
                'else {\n' + 
                '    t = integrateLinearKeys( freq );\n' + 
                '}\n' + 
				'var w1 = wiggle(f, amp, complexity, multiplier, t);\n' +
				'var w2 = wiggle(f, amp, complexity, multiplier, t - loop);\n' +
				'var w = w1;\n' +
                'if (doLoop) w = ease(t, -loop,  0, w1, w2);\n' +
				'result = value;\n' +
				'if (channel >= 5) {\n' +
                '    result = rgbToHsl(result);\n' +
                '    w = rgbToHsl(w);\n' +
                '}\n' +
                '// R\n' +
                'if (channel == 1) result = [w[0], result[1], result[2], result[3]];\n' +
                '// G\n' +
                'else if (channel == 2) result = [result[0], w[1], result[2], result[3]];\n' +
                '// B\n' +
                'else if (channel == 3) result = [result[0], result[1], w[2], result[3]];\n' +
                '// A\n' +
                'else if (channel == 4) result = [result[0], result[1], result[2], w[3]];\n' +
                '// H\n' +
                'else if (channel == 5) result = [w[0], result[1], result[2], result[3]];\n' +
                '// S\n' +
                'else if (channel == 6) result = [result[0], w[1], result[2], result[3]];\n' +
                '// L\n' +
                'else if (channel == 7) result = [result[0], result[1], w[2], result[3]];\n' +
                'if (channel >= 5) {\n' +
                '    result = hslToRgb(result);\n' +
                '    w = hslToRgb(w);\n' +
                '}\n' +
				'result += value - valueAtTime(0);\n' +
                '}\n' +
                'result;';
        }
        else if (dimensions == 3)
        {
            prop.getProperty().expression = DuAEExpression.Id.WIGGLE + '\n' + effectLink + '\n' +
                    'var Xfreq = fx(' + i['X']['Frequency'].index + ');\n' +
                    'var Yfreq = fx(' + i['Y']['Frequency'].index + ');\n' +
                    'var Zfreq = fx(' + i['Z']['Frequency'].index + ');\n' +
                    'var Xamp = fx(' + i['X']['Amplitude'].index + ').value;\n' +
                    'var Yamp = fx(' + i['Y']['Amplitude'].index + ').value;\n' +
                    'var Zamp = fx(' + i['Z']['Amplitude'].index + ').value;\n' +
                    'var loop = fx(' + i['Loop duration (s)'].index + ').value;\n' +
                    'var complexity = fx(' + i['Details']['Complexity (octaves)'].index + ').value;\n' +
                    'var multiplier = fx(' + i['Details']['Multiplier'].index + ').value;\n' +
                    'var seed = fx(' + i['Details']['Random Seed'].index + ').value;\n' +
                    'var layerSeed = fx(' + i['Details']['One seed per layer'].index + ').value;\n' + 
                    '\n' +
                    DuAEExpression.Library.get(['integrateLinearKeys']) + '\n' + 
                    '\n' +
                    'var result = value;\n' +
                    'if (fx.active) {\n' + 
                    'if (layerSeed) seed += index;\n' +
                    'seedRandom(seed);\n' +
                    'var doLoop = Xfreq.numKeys < 2 && Yfreq.numKeys < 2 && Zfreq.numKeys < 2;\n' + 
                    'if (loop == 0) loop = thisComp.duration;\n' + 
                    'var tX = time;\n' + 
                    'var tY = time;\n' + 
                    'var tZ = time;\n' + 
                    'var fX = 1;\n' + 
                    'var fY = 1;\n' + 
                    'var fZ = 1;\n' + 
                    'if (doLoop) {\n' + 
                    '    tX = tY = tZ = (time % loop)-loop;\n' + 
                    '    fX = Xfreq.value;\n' + 
                    '    fY = Yfreq.value;\n' + 
                    '    fZ = Zfreq.value;\n' + 
                    '}\n' + 
                    'else {\n' + 
                    '    tX = integrateLinearKeys( Xfreq );\n' + 
                    '    tY = integrateLinearKeys( Yfreq );\n' + 
                    '    tZ = integrateLinearKeys( Zfreq );\n' + 
                    '}\n' + 
                    'var X1 = wiggle(fX,Xamp, complexity, multiplier, tX);\n' +
                    'var Y1 = wiggle(fY,Yamp, complexity, multiplier, tY);\n' +
                    'var Z1 = wiggle(fZ,Zamp, complexity, multiplier, tZ);\n' +
                    'var w1 = [X1[0],Y1[1],Z1[2]];\n' +
                    'var Y2 = wiggle(fX,Yamp, complexity, multiplier, tX - loop);\n' +
                    'var X2 = wiggle(fY,Xamp, complexity, multiplier, tY - loop);\n' +
                    'var Z2 = wiggle(fZ,Zamp, complexity, multiplier, tZ - loop);\n' +
                    'var w2 = [X2[0],Y2[1],Z2[2]];\n' +
                    'var w = w1;\n' +
                    'if (doLoop)  w = ease(tX, -loop,  0, w1, w2);\n' +
                    'result = w + value - valueAtTime(0);\n' +
                    '}\n' +
                    'result;';
        }
        else if (dimensions == 2)
        {
            prop.getProperty().expression = DuAEExpression.Id.WIGGLE + '\n' + effectLink + '\n' +
                    'var Xfreq = fx(' + i['X']['Frequency'].index + ');\n' +
                    'var Yfreq = fx(' + i['Y']['Frequency'].index + ');\n' +
                    'var Xamp = fx(' + i['X']['Amplitude'].index + ').value;\n' +
                    'var Yamp = fx(' + i['Y']['Amplitude'].index + ').value;\n' +
                    'var loop = fx(' + i['Loop duration (s)'].index + ').value;\n' +
                    'var complexity = fx(' + i['Details']['Complexity (octaves)'].index + ').value;\n' +
                    'var multiplier = fx(' + i['Details']['Multiplier'].index + ').value;\n' +
                    'var seed = fx(' + i['Details']['Random Seed'].index + ').value;\n' +
                    'var layerSeed = fx(' + i['Details']['One seed per layer'].index + ').value;\n' + 
                    '\n' +
                    DuAEExpression.Library.get(['integrateLinearKeys']) + '\n' + 
                    '\n' +
                    'var result = value;\n' +
                    'if (fx.active) {\n' + 
                    'if (layerSeed) seed += index;\n' +
                    'seedRandom(seed);\n' +
                    'var doLoop = Xfreq.numKeys < 2 && Yfreq.numKeys < 2;\n' + 
                    'if (loop == 0) loop = thisComp.duration;\n' + 
                    'var tX = time;\n' + 
                    'var tY = time;\n' + 
                    'var fX = 1;\n' + 
                    'var fY = 1;\n' + 
                    'if (doLoop) {\n' + 
                    '    tX = tY = (time % loop)-loop;\n' + 
                    '    fX = Xfreq.value;\n' + 
                    '    fY = Yfreq.value;\n' + 
                    '}\n' + 
                    'else {\n' + 
                    '    tX = integrateLinearKeys( Xfreq );\n' + 
                    '    tY = integrateLinearKeys( Yfreq );\n' + 
                    '}\n' + 
                    'var X1 = wiggle(fX,Xamp, complexity, multiplier, tX);\n' +
                    'var Y1 = wiggle(fY,Yamp, complexity, multiplier, tY);\n' +
                    'var w1 = [X1[0],Y1[1]];\n' +
                    'var X2 = wiggle(fX,Xamp, complexity, multiplier, tX - loop);\n' +
                    'var Y2 = wiggle(fY,Yamp, complexity, multiplier, tY - loop);\n' +
                    'var w2 = [X2[0],Y2[1]];\n' +
                    'var w = w1;\n' +
                    'if (doLoop)  w = ease(tX, -loop,  0, w1, w2);\n' +
                    'result = w + value - valueAtTime(0);\n' +
                    '}\n' +
                    'result;';
        }
        else if (dimensions == 1)
        {
            prop.getProperty().expression = DuAEExpression.Id.WIGGLE + '\n' + effectLink + '\n' +
                    'var freq = fx(' + i['Frequency'].index + ');\n' +
                    'var amp = fx(' + i['Amplitude'].index + ').value;\n' +
                    'var loop = fx(' + i['Loop duration (s)'].index + ').value;\n' +
                    'var complexity = fx(' + i['Details']['Complexity (octaves)'].index + ').value;\n' +
                    'var multiplier = fx(' + i['Details']['Multiplier'].index + ').value;\n' +
                    'var seed = fx(' + i['Details']['Random Seed'].index + ').value;\n' +
                    'var layerSeed = fx(' + i['Details']['One seed per layer'].index + ').value;\n' + 
                    '\n' +
                    DuAEExpression.Library.get(['integrateLinearKeys']) + '\n' + 
                    '\n' +
                    'var result = value;\n' +
                    'if (fx.active) {\n' + 
                    '   if (layerSeed) seed += index;\n' + 
                    '   seedRandom(seed);\n' + 
                    '   var doLoop = freq.numKeys < 2;\n' + 
                    '   if (loop == 0) loop = thisComp.duration;\n' + 
                    '   var t = time;\n' + 
                    '   var f = 1;\n' + 
                    '   if (doLoop) {\n' + 
                    '       t = (time % loop)-loop;\n' + 
                    '       f = freq.value;\n' + 
                    '   }\n' + 
                    '   else {\n' + 
                    '       t = integrateLinearKeys( freq );\n' + 
                    '   }\n' + 
                    '   var w1 = wiggle(f, amp, complexity, multiplier, t);\n' + 
                    '   var w2 = wiggle(f, amp, complexity, multiplier, t - loop);\n' + 
                    '   var w = w1;\n' + 
                    '   if (doLoop) w = ease(t, -loop,  0, w1, w2);\n' + 
                    '   result = w + value - valueAtTime(0);\n' +
                    '}\n' +
                    'result;';
        }
    });
    DuAEComp.selectLayers(layers);
    
    DuAE.endUndoGroup( i18n._("Wiggle"));
}

Duik.CmdLib['Automation']["Random"] = "Duik.Automation.random()";
/**
 * Adds a completely random animation to the selected properties.
 * @param {Bool} [separateDimensions=false] Use one value for each dimension/channel.
 * @param {Bool} [individualControls=false] Use one control for each of the properties.
 * @param {PropertyBase[]|DuAEProperty[]|DuList.<PropertyBase>|PropertyBase|DuAEProperty} [props] The properties, the selected properties if omitted (or the selected layers).
 */
Duik.Automation.random = function(separateDimensions, individualControls, props) {
    props = def(props, DuAEComp.getSelectedProps());
    props = new DuList(props);
    if (props.length() == 0) return [];

    separateDimensions = def ( separateDimensions, false );
    individualControls = def ( individualControls, false );

    DuAE.beginUndoGroup( i18n._("Random motion"), false);

    DuAEComp.setUniqueLayerNames(undefined, props.first().comp );

    var effect = null;
    var pe = null;
    var i = null;

    var layers = DuAEComp.unselectLayers();
    props.do(function(prop)
    {
        prop = new DuAEProperty(prop);
        if (prop.isGroup()) return;
        var layer = prop.layer;
        var dimensions = prop.dimensions();
        var comp = prop.comp;

        // Create effect
        if (effect == null || individualControls)
        {
            var effectName = i18n._("Random");
            if (individualControls) effectName = prop.name + " | " + effectName;

            if (!separateDimensions && dimensions > 1) pe = Duik.PseudoEffect.MULTI_RANDOM;
            else if (dimensions == 1) pe = Duik.PseudoEffect.ONED_RANDOM;
            else if (dimensions == 2) pe = Duik.PseudoEffect.TWOD_RANDOM;
            else if (dimensions == 3) pe = Duik.PseudoEffect.THREED_RANDOM;
            else return;

            effect = pe.apply(layer, effectName);
            effect = new DuAEProperty(effect);

            // Set default values
            i = pe.props;
            effect.prop( i['Details']['Random seed'].index ).setValue( DuMath.random(0,9999) + layer.index );
        }

        // Check the comp link
        var sameComp = effect.comp.name == comp.name;

        var effectLink = "var fx = " + effect.expressionLink(sameComp);
        if (!separateDimensions && dimensions > 1)
	    {
            prop.getProperty().expression = [ DuAEExpression.Id.RANDOM,
                effectLink + '\n',
                'var amp = fx(' + i['Amplitude'].index + ').value;',
                'var freq = fx(' + i['Frequency'].index + ').value;',
                'var animated = fx(' + i['Animated'].index + ').value;',
                'var linked = fx(' + i['Link dimensions'].index + ').value;',
                'var randomMode = fx(' + i['Details']['Mode'].index + ').value;',
                'var seed = fx(' + i['Details']['Random seed'].index + ').value;',
                'posterizeTime(freq);',
                '',
                'var result = value;',
                '',
                'if (fx.active) {',
                '',
                '   seedRandom(seed, !animated);',
                '',
                '   var rnd = 0;',
                '   amp = amp/2;',
                '',
                '	if (randomMode == 1) rnd = gaussRandom(-amp, amp);',
                '	else rnd = random(-amp, amp);',
                '	if (value instanceof Array) {',
                '		var v = [rnd];',
                '		while (v.length < value.length)',
                '		{',
                '			if (!linked)',
                '			{',
                '				if (randomMode == 1) a = gaussRandom(-amp, amp);',
                '				else a = random(-amp, amp);',
                '				v.push( a );',
                '			}',
                '			else {',
                '				v.push(rnd);',
                '			}',
                '		}',
                '		rnd = v;',
                '	}',
                '	result += rnd;',
                '}',
                '',
                'result;',
                ''
            ].join('\n');
        }
        else
        {
            prop.getProperty().expression = [ DuAEExpression.Id.RANDOM,
                effectLink + '\n',
                'var amp = fx(' + i['Amplitude'].index + ').value;',
                'var freq = fx(' + i['Frequency'].index + ').value;',
                'var animated = fx(' + i['Animated'].index + ').value;',
                'var randomMode = fx(' + i['Details']['Mode'].index + ').value;',
                'var seed = fx(' + i['Details']['Random seed'].index + ').value;',
                'posterizeTime(freq);',
                '',
                'var result = value;',
                '',
                'if (fx.active) {',
                '',
                '   seedRandom(seed, !animated);',
                '',
                '   var rnd = 0;',
                '   amp = amp/2;',
                '',
                '	if (randomMode == 1) result += gaussRandom(-amp, amp);',
                '	else result += random(-amp, amp);',
                '}',
                '',
                'result;',
                ''
            ].join('\n');
        }
    });
    DuAEComp.selectLayers(layers);
    
    DuAE.endUndoGroup( i18n._("Random motion"));
}

Duik.CmdLib['Automation']["Wheel"] = "Duik.Automation.wheel()";
/**
 * Automates the rotation of layers as wheels
 * @param {AVLayer|AVLayer[]|DuList.<AVLayer>} [layers=DuAEComp.getSelectedLayers()] The layers
 */
Duik.Automation.wheel = function( layers ) {
    layers = def(layers, DuAEComp.getSelectedLayers());
    layers = new DuList(layers);
    if (layers.length() == 0) return;

    DuAE.beginUndoGroup( i18n._("Wheel"), false);

    DuAEComp.setUniqueLayerNames(undefined, layers.first().containingComp );

    var pe = Duik.PseudoEffect.WHEEL;
    var i = pe.props;

    layers.do(function(layer) {
        var r = DuAELayer.width(layer) / 2;

        var rotProp = layer.transform.rotation;
	    if (layer.threeDLayer) rotProp = layer.transform.zRotation;

        var effect = pe.apply(layer);
        
        effect( i['Radius'].index ).setValue( r );

        rotProp.expression = [ DuAEExpression.Id.WHEEL,
            'var fx = effect("' + effect.name + '");',
            'var wheelRadius = fx(' + i['Radius'].index +  ').value;',
            'var reversed = fx(' + i['Reverse'].index +  ').value;',
            'var trajectory = fx(' + i['Trajectory'].index +  ').value;',
            'var moBlurPrecision = fx(' + i['Motion Blur Precision'].index +  ').value;',
            '',
            'var result = value;',
            '',
            'function wheel(r, type, precision) {',
            '  ',
            '  if (r == 0) return 0;',
            '  ',
            '  function p(t) {',
            '      return thisLayer.toWorld(thisLayer.anchorPoint, t);',
            '  }',
            '  ',
            '  var distance = 0;',
            '    // curved',
            '    if (type == 3) {',
            '        var start = thisLayer.inPoint > thisComp.displayStartTime ? thisLayer.inPoint : thisComp.displayStartTime;',
            '        var end = time < thisLayer.outPoint ? time : thisLayer.outPoint;',
            '        var step = framesToTime(1)/precision;',
            '        var currentTime = start;',
            '        while (currentTime <= end)',
            '        {',
            '            if (p(currentTime+step)[0] - p(step)[0] > 0) distance += length(p(currentTime+step), p(currentTime));',
            '            else distance -= length(p(currentTime+step), p(currentTime));',
            '            currentTime += step;',
            '        }',
            '    } else if (type == 2) {',
            '        distance = length(p(time), p(0));',
            '    }',
            '    else {',
            '        distance = p(time)[0];',
            '    }',
            '    return radiansToDegrees(distance / r);',
            '}',
            '',
            'if (reversed) result -= wheel( wheelRadius, trajectory, moBlurPrecision );',
            'else result += wheel( wheelRadius, trajectory, moBlurPrecision );',
            '',
            'result;'
        ].join('\n');
    });

    DuAE.endUndoGroup( i18n._("Wheel"));
}

Duik.CmdLib['Automation']["Move away"] = "Duik.Automation.moveAway()";
/**
 * Adds a control to move the layers away from their parent.
 * @param {AVLayer|AVLayer[]|DuList.<AVLayer>} [layers=DuAEComp.getSelectedLayers()] The layers
 */
Duik.Automation.moveAway = function(layers) {
    layers = def(layers, DuAEComp.getSelectedLayers());
    layers = new DuList(layers);
    if (layers.length() == 0) return;

    DuAE.beginUndoGroup( i18n._("Move away"), false);

    DuAEComp.setUniqueLayerNames(undefined, layers.first().containingComp );
    
    layers.do(function(layer)
    {
        // add control
        var effect = layer.property("ADBE Effect Parade").addProperty("ADBE Slider Control");
        effect.name = DuAELayer.newUniqueEffectName( i18n._("Move away"), layer);
        // add expression
        layer.transform.position.expression = [ DuAEExpression.Id.MOVE_AWAY,
            'var result = value;',
            'if (thisLayer.hasParent && (value[0] != 0 || value[1] != 0))',
            '{',
            '	thisWorldPos = thisLayer.toWorld(thisLayer.anchorPoint);',
            '	parentWorldPos = thisLayer.parent.toWorld(thisLayer.parent.anchorPoint);',
            '	depl = effect("' + effect.name + '")(1).value;',
            '	dist = length(parentWorldPos ,thisWorldPos )',
            '	coef = (dist+depl)/dist',
            '	newWorldPos = (thisWorldPos-parentWorldPos)*coef+parentWorldPos',
            '	result = thisLayer.parent.fromWorld(newWorldPos)',
            '}',
            'result;'
        ].join('\n');
    });
    
    DuAE.endUndoGroup( i18n._("Adds a control effect to move the selected layers away from their parents."));

}

/**
 * Assigns random values to the properties at the current time.<br/>
 * This method creates keyframes if the properties are animated.
 * @param {float} [xMin] The minimum X Value
 * @param {float} [xMax] The maximum X Value
 * @param {float} [yMin] The minimum Y Value
 * @param {float} [yMax] The maximum Y Value
 * @param {float} [zMin] The minimum Z Value
 * @param {float} [zMax] The maximum Z Value
 * @param {Boolean} [offset=true] If true, offsets the current values. If false, sets absolute values.
 * @param {Boolean} [separate=true] If true, sets a different value for all axis. If false, use the same value for all axis, ignore Y and Z values.
 * @param {Boolean} [gaussian=true] If true, uses random values with a gaussian distribution instead of true random values.
 * @param {PropertyBase[]|DuAEProperty[]|DuList.<PropertyBase>|PropertyBase|DuAEProperty} [props] The properties, the selected properties if omitted (or the selected layers).
 */
Duik.Automation.randomizeValues = function(xMin, xMax, yMin, yMax, zMin, zMax, offset, separate, gaussian, props) {
    props = def(props, DuAEComp.getSelectedProps());
    props = new DuList(props);
    if (props.length() == 0) return;

    DuAE.beginUndoGroup( i18n._("Randomize"), false);
    DuAEProject.setProgressMode(true);

    var x = (typeof xMin !== 'undefined' && typeof xMax !== 'undefined' && !isNaN(xMin) && !isNaN(xMax));
	var y = (typeof yMin !== 'undefined'&& typeof yMax !== 'undefined' && !isNaN(yMin) && !isNaN(yMax));
	var z = (typeof zMin !== 'undefined' && typeof zMax !== 'undefined' && !isNaN(zMin) && !isNaN(zMax));

    offset = def(offset, true);
    separate = def(separate, true);
    gaussian = def(gaussian, true);

    var rnd;
    if (gaussian) rnd = DuMath.gaussRandom;
    else rnd = DuMath.random;

    props.do(function(propInfo) {
        propInfo = new DuAEProperty(propInfo);
        if (propInfo.isGroup()) return;
        var prop = propInfo.getProperty();
        var dim = propInfo.dimensions();
        var xVal = 0;
        var yVal = 0;
        var zVal = 0;

        // Random

        if (x) xVal = rnd(xMin, xMax);

        if (dim > 1 && y) yVal = rnd(yMin, yMax);
        
        if (dim > 2 && z) zVal = rnd(zMin, zMax);

        // Set new value
        var val;
        if (dim == 1) val = xVal;
        else if (separate) {
            val = [xVal, yVal];
            if (dim > 2) val.push(zVal);
            while (dim > val.length) val.push(0);
        }
        else {
            val = [xVal];
            while (dim > val.length) val.push(xVal);
        }

        if (offset) val = val + prop.value;
        var comp = propInfo.comp;
        prop.numKeys > 0 ? prop.setValueAtTime( comp.time, val) : prop.setValue(val);
    });

    DuAEProject.setProgressMode(false);
    DuAE.endUndoGroup( i18n._("Randomize"));
}

/**
 * Shuffles the layer start times (moves them in time).
 * @param {int} min The minimum value, in frames.
 * @param {int} max The maximum value, in frames.
 * @param {Boolean} [offset=true] If true, offsets the current values. If false, sets absolute values.
 * @param {Boolean} [gaussian=true] If true, uses random values with a gaussian distribution instead of true random values.
 * @param {AVLayer|AVLayer[]|DuList.<AVLayer>} [layers=DuAEComp.getSelectedLayers()] The layers
 */
Duik.Automation.randomizeLayerTimes = function(min, max, offset, gaussian, layers) {
    layers = def(layers, DuAEComp.getSelectedLayers());
    layers = new DuList(layers);
    if (layers.length() == 0) return;

    offset = def(offset, true);
    gaussian = def(gaussian, true);

    var rnd;
    if (gaussian) rnd = DuMath.gaussRandom;
    else rnd = DuMath.random;

    DuAE.beginUndoGroup( i18n._("Randomize"), false);
    DuAEProject.setProgressMode(true);

    layers.do(function(layer) {
        var comp = layer.containingComp;
        var startTime = rnd(min, max) * comp.frameDuration;
        if (offset) layer.startTime = layer.startTime + startTime;
        else layer.startTime = startTime - (layer.inPoint - layer.startTime);
    });

    DuAEProject.setProgressMode(false);
    DuAE.endUndoGroup( i18n._("Randomize"));
}

/**
 * Shuffles the layer indices (their position in the layer stack).
 * @param {int} min The minimum value, in frames.
 * @param {int} max The maximum value, in frames.
 * @param {Boolean} [offset=true] If true, offsets the current values. If false, sets absolute values.
 * @param {Boolean} [gaussian=true] If true, uses random values with a gaussian distribution instead of true random values.
 * @param {AVLayer|AVLayer[]|DuList.<AVLayer>} [layers=DuAEComp.getSelectedLayers()] The layers
 */
Duik.Automation.randomizeLayerIndices = function(min, max, offset, gaussian, layers) {
    layers = def(layers, DuAEComp.getSelectedLayers());
    layers = new DuList(layers);
    if (layers.length() == 0) return;

    offset = def(offset, true);
    gaussian = def(gaussian, true);

    var rnd;
    if (gaussian) rnd = DuMath.gaussRandom;
    else rnd = DuMath.random;

    DuAE.beginUndoGroup( i18n._("Randomize"), false);
    DuAEProject.setProgressMode(true);

    layers.do(function(layer) {
        var comp = layer.containingComp;
        var index = parseInt(rnd(min,max));
        if (offset) index = layer.index + index;
        if (index == layer.index) return;
        if (index >= comp.numLayers) layer.moveToEnd();
		else if (index < 2) layer.moveToBeginning();
		else layer.moveBefore(comp.layer(index));
    });

    DuAEProject.setProgressMode(false);
    DuAE.endUndoGroup( i18n._("Randomize"));
}

/**
 * Shuffles the layer in points.
 * @param {int} min The minimum value, in frames.
 * @param {int} max The maximum value, in frames.
 * @param {Boolean} [offset=true] If true, offsets the current values. If false, sets absolute values.
 * @param {Boolean} [gaussian=true] If true, uses random values with a gaussian distribution instead of true random values.
 * @param {AVLayer|AVLayer[]|DuList.<AVLayer>} [layers=DuAEComp.getSelectedLayers()] The layers
 */
Duik.Automation.randomizeLayerInPoints = function(min, max, offset, gaussian, layers) {
    layers = def(layers, DuAEComp.getSelectedLayers());
    layers = new DuList(layers);
    if (layers.length() == 0) return;

    offset = def(offset, true);
    gaussian = def(gaussian, true);

    var rnd;
    if (gaussian) rnd = DuMath.gaussRandom;
    else rnd = DuMath.random;

    DuAE.beginUndoGroup( i18n._("Randomize"), false);
    DuAEProject.setProgressMode(true);

    layers.do(function(layer) {
        var comp = layer.containingComp;
        var inPoint = rnd(min, max) * comp.frameDuration;
        // We need to reset the out point, because Ae...
        var out = layer.outPoint;
        if (offset) inPoint = layer.inPoint + inPoint;
        if (inPoint >= layer.outPoint) inPoint = layer.outPoint - comp.frameDuration;
        layer.inPoint = inPoint;
        layer.outPoint = out;
    });

    DuAEProject.setProgressMode(false);
    DuAE.endUndoGroup( i18n._("Randomize"));
}

/**
 * Shuffles the layer out points.
 * @param {int} min The minimum value, in frames.
 * @param {int} max The maximum value, in frames.
 * @param {Boolean} [offset=true] If true, offsets the current values. If false, sets absolute values.
 * @param {Boolean} [gaussian=true] If true, uses random values with a gaussian distribution instead of true random values.
 * @param {AVLayer|AVLayer[]|DuList.<AVLayer>} [layers=DuAEComp.getSelectedLayers()] The layers
 */
Duik.Automation.randomizeLayerOutPoints = function(min, max, offset, gaussian, layers) {
    layers = def(layers, DuAEComp.getSelectedLayers());
    layers = new DuList(layers);
    if (layers.length() == 0) return;

    offset = def(offset, true);
    gaussian = def(gaussian, true);

    var rnd;
    if (gaussian) rnd = DuMath.gaussRandom;
    else rnd = DuMath.random;

    DuAE.beginUndoGroup( i18n._("Randomize"), false);
    DuAEProject.setProgressMode(true);

    layers.do(function(layer) {
        var comp = layer.containingComp;
        var outPoint = rnd(min, max) * comp.frameDuration;
        if (offset) outPoint = layer.outPoint + outPoint;
        if (outPoint <= layer.inPoint) outPoint = layer.inPoint + comp.frameDuration;
        layer.outPoint = outPoint;
    });

    DuAEProject.setProgressMode(false);
    DuAE.endUndoGroup( i18n._("Randomize"));
}

/**
 * Shuffles the key times (moves them in time).
 * @param {int} min The minimum value, in frames.
 * @param {int} max The maximum value, in frames.
 * @param {Boolean} [offset=true] If true, offsets the current values. If false, sets absolute values.
 * @param {Boolean} [gaussian=true] If true, uses random values with a gaussian distribution instead of true random values.
 * @param {PropertyBase[]|DuAEProperty[]|DuList.<PropertyBase>|PropertyBase|DuAEProperty} [props] The properties, the selected properties if omitted (or the selected layers).
 */
Duik.Automation.randomizeKeyTimes = function (min, max, offset, gaussian, props) {
    props = def(props, DuAEComp.getSelectedProps());
    props = new DuList(props);
    if (props.length() == 0) return;

    DuAE.beginUndoGroup( i18n._("Randomize"), false);
    DuAEProject.setProgressMode(true);

    offset = def(offset, true);
    gaussian = def(gaussian, true);

    var rnd;
    if (gaussian) rnd = DuMath.gaussRandom;
    else rnd = DuMath.random;

    //array to list keys to be removed
	var krKeys = [];
    //array  to list keys to be added
    var newKeys = [];

    props.do(function(prop) {
        prop = new DuAEProperty(prop);
        if (prop.isGroup()) return;

        var krK = [];
        var newK = [];

        var comp = prop.comp;

        //loop through selected keyframes
        var selectedKeys = prop.selectedKeys();
        for (var j = 0 ; j < selectedKeys.length; j++)
        {
            var key = selectedKeys[j];
            var t = rnd(min,max)*comp.frameDuration;
            // SET VALUE
            var oldKey = prop.keyAtIndex(key);
            krK.push(prop.keyTime(key));
            if (offset) oldKey._time += t;
            else oldKey._time = t;
            newK.push(oldKey);
        }
        krKeys.push(krK);
        newKeys.push(newK);
    });

    // Delete and set keyframes
    props.do(function(prop) {
        prop = new DuAEProperty(prop);
        if (prop.isGroup()) return;

        for (var j = 0 ; j < krKeys[props.current].length ; j++)
		{
			prop.removeKey(prop.nearestKeyIndex(krKeys[props.current][j]));
		}

        for (var j = 0; j < newKeys[props.current].length; j++)
        {
            prop.setKey(newKeys[props.current][j], 0);
        }
    });

    // Re-Select
    props.do(function(prop) {
        prop = new DuAEProperty(prop);

        for (var j = 0; j < newKeys[props.current].length; j++)
        {
            prop.setSelectedAtKey( newKeys[props.current][j] );
        }
    });

    DuAEProject.setProgressMode(false);
    DuAE.endUndoGroup( i18n._("Randomize"));
}

/**
 * Assigns random values to the values of the selected keyframes.
 * @param {float} [xMin] The minimum X Value
 * @param {float} [xMax] The maximum X Value
 * @param {float} [yMin] The minimum Y Value
 * @param {float} [yMax] The maximum Y Value
 * @param {float} [zMin] The minimum Z Value
 * @param {float} [zMax] The maximum Z Value
 * @param {Boolean} [offset=true] If true, offsets the current values. If false, sets absolute values.
 * @param {Boolean} [separate=true] If true, sets a different value for all axis. If false, use the same value for all axis, ignore Y and Z values.
 * @param {Boolean} [gaussian=true] If true, uses random values with a gaussian distribution instead of true random values.
 * @param {PropertyBase[]|DuAEProperty[]|DuList.<PropertyBase>|PropertyBase|DuAEProperty} [props] The properties, the selected properties if omitted (or the selected layers).
 */
Duik.Automation.randomizeKeyValues = function (xMin, xMax, yMin, yMax, zMin, zMax, offset, separate, gaussian, props) {
    props = def(props, DuAEComp.getSelectedProps());
    props = new DuList(props);
    if (props.length() == 0) return;

    DuAE.beginUndoGroup( i18n._("Randomize"), false);
    DuAEProject.setProgressMode(true);

    var x = (typeof xMin !== 'undefined' && typeof xMax !== 'undefined' && !isNaN(xMin) && !isNaN(xMax));
	var y = (typeof yMin !== 'undefined'&& typeof yMax !== 'undefined' && !isNaN(yMin) && !isNaN(yMax));
	var z = (typeof zMin !== 'undefined' && typeof zMax !== 'undefined' && !isNaN(zMin) && !isNaN(zMax));

    offset = def(offset, true);
    separate = def(separate, true);
    gaussian = def(gaussian, true);

    var rnd;
    if (gaussian) rnd = DuMath.gaussRandom;
    else rnd = DuMath.random;

    props.do(function(prop) {
        prop = new DuAEProperty(prop);
        if (prop.isGroup()) return;
        //Get containing comp and dimensions
        var comp = prop.comp;
        var dim = prop.dimensions();
        //loop through selected keyframes
        var selectedKeys = prop.selectedKeys();
        for (var j = 0 ; j < selectedKeys.length; j++)
        {
            var key = selectedKeys[j];
            var xval = 0;
            var yval = 0;
            var zval = 0;
            //X
            if (x) xVal = rnd(xMin,xMax);
            //Y
            if (dim > 1 && y) yVal = rnd(yMin,yMax);
            //Z
            if (dim > 2 && z) zVal = rnd(zMin,zMax);

            var val;
            if (dim == 1) val = xVal;
            else if (separate) {
                val = [xVal, yVal];
                if (dim > 2) val.push(zVal);
                while (dim > val.length) val.push(0);
            }
            else {
                val = [xVal];
                while (dim > val.length) val.push(xVal);
            }
            //SET VALUE
            if (offset) val += prop.keyValue(key);
            prop.setValueAtKey(val,key);
        }
    });

    DuAEProject.setProgressMode(false);
    DuAE.endUndoGroup( i18n._("Randomize"));
}

Duik.CmdLib['Automation']["Motion trail"] = "Duik.Automation.motionTrail()";
/**
 * Draws a trail following the selected layers.
 * @param {Boolean} [createNewLayer = false] Option to create a new layer for each trail.
 * @param {AVLayer|AVLayer[]|DuList.<AVLayer>} [layers=DuAEComp.getSelectedLayers()] The layers
 */
Duik.Automation.motionTrail = function( createNewLayer, layers) {
    layers = def(layers, DuAEComp.getSelectedLayers());
    layers = new DuList(layers);
    
    // Get comp
    var comp;
    if (layers.length() == 0) comp = DuAEProject.getActiveComp();
    else comp = layers.at(0).containingComp;
    if (!comp) return;

    DuAE.beginUndoGroup( i18n._("Motion trail"), false);
    DuAEProject.setProgressMode(true);

    DuAEComp.setUniqueLayerNames(undefined, layers.first().containingComp );

    createNewLayer = def(createNewLayer, false);

    // Get existing trail layer
    var trailLayer;
    if (!createNewLayer) {
        var trailLayers = Duik.Layer.get( Duik.Layer.Type.MOTION_TRAIL, false, comp );
        if (trailLayers.length == 0) createNewLayer = true;
        else trailLayer = trailLayers[0];
    }

    if (createNewLayer) {
        trailLayer = comp.layers.addShape();
        Duik.Layer.setType(Duik.Layer.Type.MOTION_TRAIL, trailLayer);
        trailLayer.name = DuAEComp.newUniqueLayerName( i18n._("Motion trails"), comp );
    }

    var pe = Duik.PseudoEffect.MOTION_TRAIL;
    var p = pe.props;

    function createTrail(layer) {
        var effect = pe.apply( trailLayer, i18n._("Motion trail") );

        // Create shape
        var trailGroup = trailLayer("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
        trailGroup.name = effect.name;

        var trailPath = trailGroup("ADBE Vectors Group").addProperty("ADBE Vector Shape - Group");
        trailPath = trailPath.property("ADBE Vector Shape");
        trailPath.expression = [ DuAEExpression.Id.MOTION_TRAIL,
            'var fx = effect("' + effect.name + '");',
            '//parameters',
            'var trailLayer = getEffectLayer(fx, ' + p['Motion source'].index + ');',
            'var inFrame = fx(' + p['Start (frames)'].index + ').value;',
            'var outFrame = fx(' + p['End (frames)'].index + ').value;',
            'var trailStrokeWidth = fx(' + p['Width'].index + ').value;',
            'var useAutoWidth = fx(' + p['Advanced: auto-width'].index + ').value;',
            'var pathOffset = fx(' + p['Path offset'].index + ').value;',
            'var taperStartLength = fx(' + p['Taper']['Start length'].index + ').value;',
            'var taperEndLength = fx(' + p['Taper']['End length'].index + ').value;',
            'var taperEaseStart = fx(' + p['Taper']['Start ease'].index + ').value;',
            'var taperEaseEnd = fx(' + p['Taper']['End ease'].index + ').value;',
            'var trailMode = fx(' + p['Mode'].index + ').value;',
            'var sampleMethod = fx(' + p['Sampling']['Method'].index + ').value;',
            'var samples = fx(' + p['Sampling']['Samples'].index + ').value;',
            '',
            DuAEExpression.Library.get([
                'bezierInterpolation',
                'getEffectLayer',
                'getCompScale'
            ]),
            '',
            'if (trailLayer != null && fx.active) {',
            '',
            '	//adjust parameters',
            '	taperStartLength /= 100;',
            '	taperEndLength /= 100;',
            '	taperEaseStart /= 100;',
            '	taperEaseEnd /= 100;',
            '',
            '	//will store the path points and the values for the taper',
            '	var trailPoints = [];',
            '	var taperValues = [];',
            '',
            '	//compute time range',
            '	var currentFrame = timeToFrames(time);',
            '	if (inFrame > outFrame) inFrame = -inFrame;',
            '	else if (inFrame == outFrame) inFrame = -1;',
            '	var autoSampleLimit = 1 / (samples * 5);',
            '	var startFrame = currentFrame + inFrame;',
            '	var endFrame = currentFrame + outFrame;',
            '	var sTime = framesToTime(startFrame);',
            '	var eTime = framesToTime(endFrame);',
            '',
            '	// for each frame starting from the end',
            '	for (var i = endFrame; i >= startFrame; i--) {',
            '',
            '		var t = framesToTime(i);',
            '		var pT = framesToTime(i - 1);',
            '		var nT = framesToTime(i + 1);',
            '		var pos = trailLayer.toComp(trailLayer.anchorPoint, t);',
            '		if (pos.length == 3) pos.pop();',
            '		var prevPos = trailLayer.toComp(trailLayer.anchorPoint, pT);',
            '		if (prevPos.length == 3) prevPos.pop();',
            '		var nextPos = trailLayer.toComp(trailLayer.anchorPoint, nT);',
            '		if (nextPos.length == 3) nextPos.pop();',
            '',
            '		if (pos == prevPos) continue;',
            '',
            '		//compute samples',
            '		if (sampleMethod == 1) {',
            '			try {',
            '				var vec = normalize(nextPos - pos);',
            '				var prevVec = normalize(pos - prevPos);',
            '				var step = length(prevVec, vec);',
            '				var stepRatio = step / autoSampleLimit;',
            '				if (stepRatio > 1) samples = Math.floor(stepRatio);',
            '				else samples = 1;',
            '			} catch (e) {}',
            '		}',
            '',
            '		//build path and store taper values',
            '		var step = thisComp.frameDuration / samples;',
            '		for (var sub = t + thisComp.frameDuration - step; sub >= t; sub -= step) {',
            '',
            '			var subPos = trailLayer.toComp(trailLayer.anchorPoint, sub);',
            '			if (subPos.length == 3) subPos.pop();',
            '',
            '			subPos = subPos - position;',
            '			trailPoints.push(subPos);',
            '',
            '			if (trailMode == 2) {',
            '				var w = trailStrokeWidth;',
            '',
            '				var duration = eTime - sTime;',
            '				var elapsed = sub - sTime;',
            '				var tRatio = elapsed / duration;',
            '',
            '				if (tRatio > 1 - taperStartLength) {',
            '					w = bezierInterpolation(sub, eTime - duration * taperStartLength, eTime, w, 0, [taperEaseStart, 0, 1 - taperEaseStart, 0]);',
            '				}',
            '',
            '				if (tRatio < taperEndLength) {',
            '					w = bezierInterpolation(tRatio, 0, taperEndLength, 0, w, [1 - taperEaseEnd, 1, taperEaseEnd, 1]);',
            '				}',
            '',
            '				if (useAutoWidth) {',
            '					var ratio = getCompScale(trailLayer, t);',
            '					w = w * ratio;',
            '				}',
            '',
            '				taperValues.push(w);',
            '			}',
            '		}',
            '',
            '	}',
            '',
            '	//offset',
            '	if (trailPoints.length > 1) {',
            '		//compute offset',
            '		var rightSidePoints = [];',
            '		var leftSidePoints = [];',
            '		for (var i = 1, num = trailPoints.length; i < num; i++) {',
            '			var w = [0, 0];',
            '			var o = [0, 0];',
            '',
            '			var vec = normalize(trailPoints[i - 1] - trailPoints[i]);',
            '			var normal = [-vec[1], vec[0]];',
            '',
            '			//width & taper',
            '			if (trailMode == 2) {',
            '				try {',
            '					w = normal * taperValues[i - 1] / 2;',
            '				} catch (e) {}',
            '			}',
            '',
            '			//offset',
            '			try {',
            '				o = normal * pathOffset;',
            '			} catch (e) {}',
            '',
            '			if (trailMode == 2) {',
            '				rightSidePoints[i - 1] = trailPoints[i - 1] + w + o;',
            '				leftSidePoints[i - 1] = trailPoints[i - 1] - w + o;',
            '			} else {',
            '				trailPoints[i - 1] = trailPoints[i - 1] + o;',
            '			}',
            '		}',
            '		if (trailMode == 2) trailPoints = rightSidePoints.concat(leftSidePoints.reverse());',
            '		else trailPoints.pop();',
            '	}',
            '',
            '	if (trailPoints.length > 1) createPath(trailPoints, [], [], useAutoWidth);',
            '	else value;',
            '} else value;'
        ].join('\n');

        var trailStroke = trailGroup("ADBE Vectors Group").addProperty("ADBE Vector Graphic - Stroke");
        trailStroke('ADBE Vector Stroke Color').expression= [ DuAEExpression.Id.MOTION_TRAIL,
            'var fx = effect( "' + effect.name + '" );',
            'fx(' + p['Color'].index + ').value;'
        ].join('\n');

        trailStroke('ADBE Vector Stroke Opacity').expression = [ DuAEExpression.Id.MOTION_TRAIL,
            'var fx = effect( "' + effect.name + '" );',
            'var trailOpacity = fx(' + p['Opacity'].index + ').value;',
            'var trailMode = fx(' + p['Mode'].index + ').value;',
            'if ( trailMode == 2 ) 0;',
            'else trailOpacity;'
        ].join('\n');

        trailStroke('ADBE Vector Stroke Width').expression = [ DuAEExpression.Id.MOTION_TRAIL,
            'var fx = effect( "' + effect.name + '" );',
            'fx(' + p['Width'].index + ').value;'
            ].join('\n');

        // Taper for Ae >= 17.1
        if (DuAE.version.version >= 17.0) {
            var taper = trailStroke('ADBE Vector Stroke Taper');
            taper('ADBE Vector Taper Start Length').expression = [ DuAEExpression.Id.MOTION_TRAIL,
                'var fx = effect(  "' + effect.name + '" );',
                'fx(' + p['Taper']['Start length'].index + ').value;'
            ].join('\n');
            taper('ADBE Vector Taper End Length').expression = [ DuAEExpression.Id.MOTION_TRAIL,
                'var fx = effect(  "' + effect.name + '" );',
                'fx(' + p['Taper']['End length'].index + ').value;'
            ].join('\n');
            taper('ADBE Vector Taper Start Ease').expression = [ DuAEExpression.Id.MOTION_TRAIL,
                'var fx = effect(  "' + effect.name + '" );',
                'fx(' + p['Taper']['Start ease'].index + ').value;'
            ].join('\n');
            taper('ADBE Vector Taper End Ease').expression = [ DuAEExpression.Id.MOTION_TRAIL,
                'var fx = effect(  "' + effect.name + '" );',
                'fx(' + p['Taper']['End ease'].index + ').value;'
            ].join('\n');
        }
        
        var trailFill = trailGroup("ADBE Vectors Group").addProperty("ADBE Vector Graphic - Fill");

        trailFill('ADBE Vector Fill Color').expression = [ DuAEExpression.Id.MOTION_TRAIL,
            'var fx = effect( "' + effect.name + '" );',
            'fx(' + p['Color'].index + ').value;'
        ].join('\n');

        trailFill('ADBE Vector Fill Opacity').expression = [ DuAEExpression.Id.MOTION_TRAIL,
            'var fx = effect( "' + effect.name + '" );',
            'var trailOpacity = fx(' + p['Opacity'].index + ').value;',
            'var trailMode = fx(' + p['Mode'].index + ').value;',
            'if ( trailMode == 1 ) 0;',
            'else trailOpacity;'
        ].join('\n');

        // set layer
        if (typeof layer !== 'undefined') effect( p['Motion source'].index ).setValue(layer.index);
    }

    // For each layer
    layers.do(function(layer) {
        createTrail(layer);
    });

    // If there's no layer, an empty trail
    if (layers.length() == 0) {
        createTrail();
    }

    DuAEProject.setProgressMode(false);
    DuAE.endUndoGroup( i18n._("Motion trail"));
}

Duik.CmdLib['Automation']["Time remap"] = "Duik.Automation.timeRemap()";
/**
 * Activates the time remapping on the layers, adjusts the keyframes and adds a loop effect.
 * @param {AVLayer|AVLayer[]|DuList.<AVLayer>} [layers=DuAEComp.getSelectedLayers()] The layers
 */
Duik.Automation.timeRemap = function( layers ) {
    layers = def(layers, DuAEComp.getSelectedLayers());
    layers = new DuList(layers);
    if (layers.length() == 0) return;

    DuAE.beginUndoGroup( i18n._("Time remap"), false);
    DuAEProject.setProgressMode(true);

    DuAEComp.setUniqueLayerNames(undefined, layers.first().containingComp );

    layers.do(function(layer) {
        if (!layer.canSetTimeRemapEnabled) return;
        
        var comp = layer.containingComp;
		var lastValueTime = layer.outPoint - comp.frameDuration;

		if (!layer.timeRemapEnabled) layer.timeRemapEnabled = true;

		if (layer.inPoint < lastValueTime)
		{
			layer.timeRemap.setValueAtTime(lastValueTime,layer.timeRemap.valueAtTime(lastValueTime,true));
			layer.timeRemap.removeKey(3);
			layer.timeRemap.setValueAtTime(lastValueTime + comp.frameDuration, layer.timeRemap.valueAtTime(layer.inPoint, true));
			if ( layer.inPoint > layer.timeRemap.keyTime(1))
			{
				layer.timeRemap.setValueAtTime(layer.inPoint, layer.timeRemap.valueAtTime(layer.inPoint, true));
				layer.timeRemap.removeKey(1);
			}
		}
		else
		{
			layer.timeRemap.removeKey(2);
		}

		Duik.Automation.looper(layer.timeRemap);
    });

    DuAEProject.setProgressMode(false);
    DuAE.endUndoGroup( i18n._("Time remap"));
}

Duik.CmdLib['Automation']["Paint rig"] = "Duik.Automation.paintRig()";
/**
 * Rigs paint effects and brush strokes to animate them more easily.
 * @param {AVLayer|AVLayer[]|DuList.<AVLayer>} [layers=DuAEComp.getSelectedLayers()] The layers
 */
Duik.Automation.paintRig = function( layers ) {
    layers = def(layers, DuAEComp.getSelectedLayers());
    layers = new DuList(layers);
    if (layers.length() == 0) return;

    DuAE.beginUndoGroup( i18n._("Paint Rig"), false);
    DuAEProject.setProgressMode(true);

    DuAEComp.setUniqueLayerNames(undefined, layers.first().containingComp );

    var pe = Duik.PseudoEffect.PAINT_RIG;
    var p = pe.props;

    layers.do(function(layer) {
        //if there's no paint effect
        var paintEffect = layer("ADBE Effect Parade")("ADBE Paint");
        if (paintEffect == null) return;

        //add effect
        var effect = pe.apply(layer);
        
        //need to get the paint effect again after addProperty, invalid Object blah blah blah.......
        var paintEffect = layer("Effects")("ADBE Paint");

        //the first diameter and color
        var defaultDiam = 0;
        var defaultCol = [0,0,0,0];

        //for each stroke
        var n = paintEffect.property(2).numProperties;
        for (var j=1; j<=n; j++)
        {
            var stroke = paintEffect.property(2).property(j);
            var propStart = new DuAEProperty( stroke.property(4).property('ADBE Paint Begin') );
            var propEnd = new DuAEProperty( stroke.property(4).property('ADBE Paint End') );
            var propCol = new DuAEProperty( stroke.property(4).property('ADBE Paint Color') );
            var propDiam = new DuAEProperty( stroke.property(4).property('ADBE Paint Diameter') );

            if (defaultDiam == 0)
            {
                defaultDiam = propDiam.value();
                effect( p['Diameter']['Diameter A'].index ).setValue(defaultDiam);
                effect( p['Diameter']['Diameter B'].index ).setValue(defaultDiam);
            }
            if (defaultCol[3] == 0)
            {
                defaultCol = propCol.value();
                effect( p['Color']['Color A'].index ).setValue(defaultCol);
                effect( p['Color']['Color A'].index ).setValue(defaultCol);
            }

            var startExp = DuAEExpression.Id.PAINT_RIG + '\n' +
                'var ctrl = effect("' + effect.name + '")(' + p['Start'].index + ').value;\n' +
                'var total = thisProperty.propertyGroup().propertyGroup().propertyGroup().numProperties;\n' +
                'var ind = total + 1 - thisProperty.propertyGroup().propertyGroup().propertyIndex\n' +
                'result = ctrl - ((100/total)*(ind-1));\n' +
                'result = result * total;\n' +
                'result;';
            propStart.setExpression( startExp, false );

            var endExp = DuAEExpression.Id.PAINT_RIG + '\n' +
                'var ctrl = effect("' + effect.name + '")(' + p['End'].index + ');\n' +
                'var total = thisProperty.propertyGroup().propertyGroup().propertyGroup().numProperties;\n' +
                'var ind = total + 1 - thisProperty.propertyGroup().propertyGroup().propertyIndex;\n' +
                'result = ctrl - ((100/total)*(ind-1));\n' +
                'result = result * total;\n' +
                'result;';
            propEnd.setExpression( endExp, false );

            
            var diamExp = DuAEExpression.Id.PAINT_RIG + '\n' +
                'var fx = effect("' + effect.name + '");\n' +
                'var ctrlA = fx(' + p['Diameter']['Diameter A'].index + ').value;\n' +
                'var ctrlB = fx(' + p['Diameter']['Diameter B'].index + ').value;\n' +
                'var reverse = fx(' + p['Interpolation']['Reverse'].index + ').value;\n' +
                'var interpolation =fx(' + p['Interpolation']['Ease'].index + ').value;\n' +
                'var mode = fx(' + p['Interpolation']['Mode'].index + ').value;\n' +
                'var total = thisProperty.propertyGroup().propertyGroup().propertyGroup().numProperties;\n' +
                'var ind = total + 1 - thisProperty.propertyGroup().propertyGroup().propertyIndex;\n' +
                'if (reverse)\n' +
                '{\n' +
                'var t = ctrlA;\n' +
                'ctrlA = ctrlB;\n' +
                'ctrlB = t;\n' +
                '}\n' +
                'var result = ctrlA;\n' +
                'if (mode == 2)\n' +
                '{\n' +
                'if (interpolation == 1) result = linear(ind,1,total,ctrlA,ctrlB);\n' +
                'else if (interpolation == 2) result = ease(ind,1,total,ctrlA,ctrlB);\n' +
                'else if (interpolation == 3) result = easeIn(ind,1,total,ctrlA,ctrlB);\n' +
                'else if (interpolation == 4) result = easeOut(ind,1,total,ctrlA,ctrlB);\n' +
                '}\n' +
                'else if (mode == 3)\n' +
                '{\n' +
                'if (ind < total /2)\n' +
                '{\n' +
                'if (interpolation == 1) result = linear(ind,1,total/2,ctrlA,ctrlB);\n' +
                'else if (interpolation == 2) result = ease(ind,1,total/2,ctrlA,ctrlB);\n' +
                'else if (interpolation == 3) result = easeIn(ind,1,total/2,ctrlA,ctrlB);\n' +
                'else if (interpolation == 4) result = easeOut(ind,1,total/2,ctrlA,ctrlB);\n' +
                '}\n' +
                'else\n' +
                '{\n' +
                'if (interpolation == 1) result = linear(ind,total/2,total,ctrlB,ctrlA);\n' +
                'else if (interpolation == 2) result = ease(ind,total/2,total,ctrlB,ctrlA);\n' +
                'else if (interpolation == 3) result = easeIn(ind,total/2,total,ctrlB,ctrlA);\n' +
                'else if (interpolation == 4) result = easeOut(ind,total/2,total,ctrlB,ctrlA);\n' +
                '}\n' +
                '}\n' +
                'result;';
            propDiam.setExpression( diamExp, false );

            
            var colExp = DuAEExpression.Id.PAINT_RIG + '\n' +
                'var fx = effect("' + effect.name + '");\n' +
                'var ctrlA = fx(' + p['Color']['Color A'].index + ').value;\n' +
                'var ctrlB = fx(' + p['Color']['Color B'].index + ').value;\n' +
                'var reverse = fx(' + p['Interpolation']['Reverse'].index + ').value;\n' +
                'var interpolation =fx(' + p['Interpolation']['Ease'].index + ').value;\n' +
                'var mode = fx(' + p['Interpolation']['Mode'].index + ').value;\n' +
                'var total = thisProperty.propertyGroup().propertyGroup().propertyGroup().numProperties;\n' +
                'var ind = total + 1 - thisProperty.propertyGroup().propertyGroup().propertyIndex;\n' +
                'if (reverse)\n' +
                '{\n' +
                'var t = ctrlA;\n' +
                'ctrlA = ctrlB;\n' +
                'ctrlB = t;\n' +
                '}\n' +
                'var result = ctrlA;\n' +
                'if (mode == 2)\n' +
                '{\n' +
                'if (interpolation == 1) result = linear(ind,1,total,ctrlA,ctrlB);\n' +
                'else if (interpolation == 2) result = ease(ind,1,total,ctrlA,ctrlB);\n' +
                'else if (interpolation == 3) result = easeIn(ind,1,total,ctrlA,ctrlB);\n' +
                'else if (interpolation == 4) result = easeOut(ind,1,total,ctrlA,ctrlB);\n' +
                '}\n' +
                'else if (mode == 3)\n' +
                '{\n' +
                'if (ind < total /2)\n' +
                '{\n' +
                'if (interpolation == 1) result = linear(ind,1,total/2,ctrlA,ctrlB);\n' +
                'else if (interpolation == 2) result = ease(ind,1,total/2,ctrlA,ctrlB);\n' +
                'else if (interpolation == 3) result = easeIn(ind,1,total/2,ctrlA,ctrlB);\n' +
                'else if (interpolation == 4) result = easeOut(ind,1,total/2,ctrlA,ctrlB);\n' +
                '}\n' +
                'else\n' +
                '{\n' +
                'if (interpolation == 1) result = linear(ind,total/2,total,ctrlB,ctrlA);\n' +
                'else if (interpolation == 2) result = ease(ind,total/2,total,ctrlB,ctrlA);\n' +
                'else if (interpolation == 3) result = easeIn(ind,total/2,total,ctrlB,ctrlA);\n' +
                'else if (interpolation == 4) result = easeOut(ind,total/2,total,ctrlB,ctrlA);\n' +
                '}\n' +
                '}\n' +
                'result;';
            propCol.setExpression( colExp , false );

        }
    });

    DuAEProject.setProgressMode(false);
    DuAE.endUndoGroup( i18n._("Paint Rig"));
}

Duik.CmdLib['Automation']["Walk"] = "Duik.Automation.walk()";
Duik.CmdLib['Automation']["Run"] = "Duik.Automation.walk()";
/**
 * Animates the selected character using a procedural walk or run cycle.
 * @param {Layer[]|DuList.<Layer>} [controllers] The controllers to setup. If omitted, will get the selected controllers, or all the controllers of the current comp.
 */
Duik.Automation.walk = function( controllers ) {
    var ctrls = Duik.Automation.getWalkCtrls(controllers)
    if (ctrls == null) return;

    Duik.Automation.rigWalk( ctrls );
}

// low-level undocumented method
// Gets an object containing controllers to be used with Duik.Automation.rigWalk
Duik.Automation.getWalkCtrls = function( controllers ) {
    controllers = def( controllers, Duik.Controller.get() );
    controllers = new DuList(controllers);
    if (controllers.length() == 0) controllers = new DuList( Duik.Controller.get(false) );
    if (controllers.length() == 0) return {};

    // What we expect
    var ctrls = {};

    // Sort
    controllers.do(function(ctrl) {
        var type = DuAETag.getValue(ctrl, DuAETag.Key.DUIK_CONTROLLER_TYPE, DuAETag.Type.INT);

        if (type == Duik.Controller.Type.HEAD) { ctrls.head = ctrl; return; }
        if (type == Duik.Controller.Type.SHOULDERS) { ctrls.neck = ctrl; return; }
        if (type == Duik.Controller.Type.TORSO) { ctrls.torso = ctrl; return; }
        if (type == Duik.Controller.Type.VERTEBRAE) { ctrls.spine = ctrl; return; }
        if (type == Duik.Controller.Type.HIPS) { ctrls.hips = ctrl; return; }
        if (type == Duik.Controller.Type.BODY) { ctrls.body = ctrl; return; }

        var side = Duik.Layer.side(ctrl);

        if (type == Duik.Controller.Type.FOOT ||
            type == Duik.Controller.Type.CLAWS ||
            type == Duik.Controller.Type.HOOF ||
            type == Duik.Controller.Type.PINCER  ) {
                if (side == OCO.Side.LEFT) { ctrls.lFoot = ctrl; return; }
                if (side == OCO.Side.RIGHT) { ctrls.rFoot = ctrl; return; }
                if (!ctrls.lFoot) { ctrls.lFoot = ctrl; return; }
                if (!ctrls.rFoot) { ctrls.rFoot = ctrl; return; }
            }

        if (type == Duik.Controller.Type.HAND ||
            type == Duik.Controller.Type.CLAWS ||
            type == Duik.Controller.Type.HOOF ||
            type == Duik.Controller.Type.PINCER  ) {
                if (side == OCO.Side.LEFT) { ctrls.lHand = ctrl; return; }
                if (side == OCO.Side.RIGHT) { ctrls.rHand = ctrl; return; }
                if (!ctrls.lHand) { ctrls.lHand = ctrl; return; }
                if (!ctrls.rHand) { ctrls.rHand = ctrl; return; }
            }
    });
    return ctrls;
}

/**
 * Animates the given controllers with a wolk/run cycle.
 * @param {Object} ctrls The controllers to setup. An object containing these layers:<br />
 * <code>ctrls.head</code> The head controller<br />
 * <code>ctrls.neck</code> The neck controller<br />
 * <code>ctrls.torso</code> The torso controller<br />
 * <code>ctrls.spine</code> The spine controller<br />
 * <code>ctrls.hips</code> The hips controller<br />
 * <code>ctrls.body</code> The body controller<br />
 * <code>ctrls.rHand</code> The right hand controller<br />
 * <code>ctrls.lHand</code> The left hand controller<br />
 * <code>ctrls.rFoot</code> The right foot controller<br />
 * <code>ctrls.lFoot</code> The left foot controller<br />
 * Note that some of these may be undefined/null.
 */
Duik.Automation.rigWalk = function( ctrls ) {

    DuAE.beginUndoGroup( i18n._("Walk/Run cycle"), false);

    var comp = null;
    var characterName = '';
    if (ctrls.head) { comp = ctrls.head.containingComp; characterName = Duik.Layer.groupName( ctrls.head ); }
	else if (ctrls.neck) { comp = ctrls.neck.containingComp; characterName = Duik.Layer.groupName( ctrls.neck ); }
	else if (ctrls.torso) { comp = ctrls.torso.containingComp; characterName = Duik.Layer.groupName( ctrls.torso ); }
	else if (ctrls.spine) { comp = ctrls.spine.containingComp; characterName = Duik.Layer.groupName( ctrls.spine ); }
	else if (ctrls.body) { comp = ctrls.body.containingComp; characterName = Duik.Layer.groupName( ctrls.body ); }
	else if (ctrls.hips) { comp = ctrls.hips.containingComp; characterName = Duik.Layer.groupName( ctrls.hips ); }
	else if (ctrls.rHand) { comp = ctrls.rHand.containingComp; characterName = Duik.Layer.groupName( ctrls.rHand ); }
	else if (ctrls.lHand) { comp = ctrls.lHand.containingComp; characterName = Duik.Layer.groupName( ctrls.lHand ); }
	else if (ctrls.rFoot) { comp = ctrls.rFoot.containingComp; characterName = Duik.Layer.groupName( ctrls.rFoot ); }
	else if (ctrls.lFoot) { comp = ctrls.lFoot.containingComp; characterName = Duik.Layer.groupName( ctrls.lFoot ); }

    if (!comp) comp = DuAEProject.getActiveComp();
	if (!comp) return;

    var mainController = Duik.Controller.create(comp, Duik.Controller.Type.WALK_CYCLE );
    Duik.Layer.setGroupName( characterName, mainController );
    var mainControllerName = mainController.name;

    //add effect
	var effect = DuAELayer.applyPreset(mainController, preset_walk_cycle);
	var effectName = effect.name;

    //set up
    var hips = 0;
    var foot = 0;
    var neck = 0;
    var hand = 0;
    var faceRight = true;
    var exp0 = DuAEExpression.Id.WALK_RUN_CYCLE + '\nvalue + ';
    var exp1 = 'thisComp.layer("' + mainControllerName + '").effect("' + effectName + '")("';
    var exp2 = '").value;';

    if (ctrls.body) {
        var pos = ctrls.body.transform.position;
        if (pos.dimensionsSeparated) ctrls.body.transform.property('ADBE Position_1').expression = exp0 + exp1 + 'Body Y Position' + exp2;
        else {
            pos.expression = DuAEExpression.Id.WALK_RUN_CYCLE + '\nvalue + [0,' + exp1 + 'Body Y Position").value];';
        }
        hips = DuAELayer.getWorldPos( ctrls.body );
    }

    if (ctrls.hips) {
        ctrls.hips.transform.rotation.expression = exp0 + exp1 + 'Hips rotation' + exp2;
        hips = DuAELayer.getWorldPos( ctrls.hips );
        neck = DuAELayer.getWorldPos( ctrls.hips );
    }

    if (ctrls.spine) {
        ctrls.spine.transform.rotation.expression = exp0 + exp1 + 'Spine rotation' + exp2;
        if (hips == 0) hips = DuAELayer.getWorldPos( ctrls.spine );
        neck = DuAELayer.getWorldPos( ctrls.spine );
    }

    if (ctrls.torso) {
        ctrls.torso.transform.rotation.expression = exp0 + exp1 + 'Torso rotation' + exp2;
        if (hips == 0) hips = DuAELayer.getWorldPos( ctrls.torso );
        neck = DuAELayer.getWorldPos( ctrls.torso );
    }

    if (ctrls.neck) {
        ctrls.neck.transform.rotation.expression = exp0 + exp1 + 'Neck rotation' + exp2;
        if (hips == 0) hips = DuAELayer.getWorldPos( ctrls.neck );
        neck = DuAELayer.getWorldPos( ctrls.neck );
    }

    if (ctrls.head) {
        ctrls.head.transform.rotation.expression = exp0 + exp1 + 'Head rotation' + exp2;
        if (hips == 0) hips = DuAELayer.getWorldPos( ctrls.head );
        if (neck == 0) neck = DuAELayer.getWorldPos( ctrls.head );
    }

    function rigLeg(layer, side) {
        // FOOT ROLL
        var pe = Duik.PseudoEffect.FOOT_ROLL;
        var frEffect = layer.effect( pe.matchName );
        if (!frEffect) {
            pe = Duik.PseudoEffect.DIGI_FOOT_ROLL;
            frEffect = layer.effect( pe.matchName );
        }
        if (frEffect) frEffect(pe.props['Foot roll'].index).expression = exp0 + exp1 + side + '.Foot roll' + exp2;
        // Position
        var pos = layer.transform.position;
        if (pos.dimensionsSeparated) {
            layer.transform.property('ADBE Position_0').expression = exp0 + exp1 + side + '.Foot X position' + exp2;
            layer.transform.property('ADBE Position_1').expression = exp0 + exp1 + side + '.Foot Y position' + exp2;
        }
        else {
            pos.expression = DuAEExpression.Id.WALK_RUN_CYCLE + '\nvalue + [' + exp1 + side + '.Foot X position").value, ' + exp1 + side + '.Foot Y position").value];';
        }
        // Rotation
        layer.transform.rotation.expression = exp0 + exp1 + side + '.Foot rotation' + exp2;

        if (foot == 0) foot = DuAELayer.getWorldPos( layer );

        // Detect the side
        var pe = Duik.PseudoEffect.TWO_LAYER_IK;
        var ikEffect = layer.effect(pe.matchName);
        if (ikEffect) {
            var side = ikEffect(pe.props['Side'].index).value;
            if (side > 0) faceRight = false;
        }
    }

    function rigArm(layer, side) {
        // FK
        var pe = Duik.PseudoEffect.TWO_LAYER_IK;
        var ikEffect = layer.effect(pe.matchName);
        var isIK = false;
        if (ikEffect) {
            ikEffect( pe.props['FK']['Upper'].index ).expression = exp0 + exp1 + side + '.Arm rotation' + exp2;
            ikEffect( pe.props['FK']['Lower'].index ).expression = exp0 + exp1 + side + '.Forearm rotation' + exp2;
            ikEffect( pe.props['FK']['End'].index ).expression = exp0 + exp1 + side + '.Hand rotation' + exp2;
            isIK = ikEffect( pe.props['IK / FK'].index ).value == 1;
        }
        // Shoulder
        pe = Duik.PseudoEffect.ONE_LAYER_IK;
        var ikEffect = layer.effect(pe.matchName);
        if (ikEffect) {
            ikEffect( pe.props['FK'].index ).expression = exp0 + exp1 + side + '.Shoulder rotation' + exp2;
        }

        // Set to FK
        if (isIK) Duik.Animation.switchIKFK(layer);

        if (hand == 0) hand = DuAELayer.getWorldPos( layer );
    }

    if (ctrls.lFoot) rigLeg(ctrls.lFoot, 'L');
    if (ctrls.rFoot) rigLeg(ctrls.rFoot, 'R');
    if (ctrls.lHand) rigArm(ctrls.lHand, 'L');
    if (ctrls.rHand) rigArm(ctrls.rHand, 'R');

    // compute leg size, and set
    var leg = 450;
    if (foot != 0 && hips != 0) leg = DuMath.length(hips, foot);
    else if (hand != 0 && neck != 0) leg = DuMath.length(neck, hand);
    else {
        if (foot == 0) foot = hand;
        if (hips == 0) hips = neck;
        leg = DuMath.length(hips, foot);
        if (leg == 0) leg = 450;
    }

    effect("Leg height (px)").setValue(leg);
    if (!faceRight) {
        effect("Walk speed").setValue(-100);
        effect("Run speed").setValue(-100);
    }

    DuAE.endUndoGroup( i18n._("Walk/Run cycle"));
}