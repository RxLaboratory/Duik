/**
 * Constraint tools.
 * @namespace
 * @category Duik
 */
Duik.Constraint = {};

/**
 * The types of IK for three-layer chains.
 * @enum {Number}
 */
Duik.Constraint.IKType = {
    ONE_TWO: 1,
    TWO_ONE: 2,
    FK: 3,
    BEZIER_IK: 4,
    BEZIER_FK: 5
};

/**
 * The list of constraint functions
 */
Duik.CmdLib['Constraint'] = {};

Duik.CmdLib['Constraint']["List"] = "Duik.Constraint.list()";
Duik.CmdLib['Constraint']["List_with_keyframe"] = "Duik.Constraint.list(true)";
/**
 * List
 * @param {Boolean} [addKeyframe=false] Set to true to automatically add a keyframe to the second slot (which makes it quicker to find in the AE Timeline using the 'U' shortcut)
 */
Duik.Constraint.list = function(addKeyframe) {
    addKeyframe = def(addKeyframe, false);
    var props = DuAEComp.getSelectedProps();
    if (props.length == 0) return;

    DuAE.beginUndoGroup( i18n._("List"));

    var layers = DuAEComp.unselectLayers();
    for (var i = 0, n = props.length; i < n; i++) {
        Duik.Constraint.createList(props[i], addKeyframe);
    }
    DuAEComp.selectLayers(layers);

    DuAE.endUndoGroup();
}

/**
 * Adds a list on a property
 * @param {Property|DuAEProperty} prop - The Property
 * @param {Boolean} [addKeyframe=false] Set to true to automatically add a keyframe to the second slot (which makes it quicker to find in the AE Timeline using the 'U' shortcut)
 * @returns {DuAEProperty} The list effect
 */
Duik.Constraint.createList = function(prop, addKeyframe) {
    addKeyframe = def(addKeyframe, false);
    prop = new DuAEProperty(prop);
    if (!prop.riggable()) return;

    DuAE.beginUndoGroup( i18n._("Add list"), false);

    var dim = prop.dimensions();

    var layer = prop.layer;

    var internalListName = "List";
    var listName = i18n._(internalListName);
    var name = prop.getProperty().name + ' | ' + listName;
    var pe;
    if (dim == 1) {
        pe = Duik.PseudoEffect.ONED_LIST;
    }
    else if (dim == 2) {
        internalListName = "2DList";
        listName = i18n._(internalListName);
        pe = Duik.PseudoEffect.TWOD_LIST;
    }
    else if (dim == 3) {
        internalListName = "3DList";
        listName = i18n._(internalListName);
        pe = Duik.PseudoEffect.THREED_LIST;
    }
    else if (dim == 4) {
        internalListName = "Color List";
        listName = i18n._(internalListName);
        pe = Duik.PseudoEffect.COLOR_LIST;
    }
    else return null;

    var effect = pe.apply(layer, name);;

    //set animation with expression
    var anim = prop.animation(false);
    if (anim) {
        var newProp = new DuAEProperty(effect(5));
        newProp.setAnim(anim, 0, true, true, false);
    }
    prop.removeAnimation();

    if (addKeyframe) {
        var index2;
        if (dim == 4) index2 = pe.props["2"]["Color 2"].index;
        else index2 = pe.props["2"]["Value 2"].index;
        effect(index2).setValueAtTime( 0, effect(index2).value );
    }

    var expression = DuAEExpression.Id.LIST + '\n' + DuAEExpression.Library.get(['checkDuikEffect', 'zero']) + '\n';
        
    if (dim == 4) expression += DuAEExpression.Library.get(['blendColor']) + '\n';
        
    expression += [
        'var result = null',
        'for (var i = 1, n = thisLayer("Effects").numProperties; i <= n; i++) {',
        '   var fx = thisLayer.effect(i);',
        '   if (!checkDuikEffect(fx, "' + internalListName  + '")) continue;',
        '   if (!fx.name.indexOf(thisProperty.name) == 0) continue;',
        '   if (!fx.active) continue;',
        ''
    ].join('\n');

    if (dim == 4) expression += [
        '   var v1 = fx(' + pe.props["1"]["Color 1"].index + ').value;',
        '   var w1 = fx(' + pe.props["1"]["Opacity 1"].index + ').value;',
        '   var b1 = fx(' + pe.props["1"]["Blending mode 1"].index + ').value;',
        '   var v2 = fx(' + pe.props["2"]["Color 2"].index + ').value;',
        '   var w2 = fx(' + pe.props["2"]["Opacity 2"].index + ').value;',
        '   var b2 = fx(' + pe.props["2"]["Blending mode 2"].index + ').value;',
        '   var v3 = fx(' + pe.props["3"]["Color 3"].index + ').value;',
        '   var w3 = fx(' + pe.props["3"]["Opacity 3"].index + ').value;',
        '   var b3 = fx(' + pe.props["3"]["Blending mode 3"].index + ').value;',
        '   var v4 = fx(' + pe.props["4"]["Color 4"].index + ').value;',
        '   var w4 = fx(' + pe.props["4"]["Opacity 4"].index + ').value;',
        '   var b4 = fx(' + pe.props["4"]["Blending mode 4"].index + ').value;',
        '   var v5 = fx(' + pe.props["5"]["Color 5"].index + ').value;',
        '   var w5 = fx(' + pe.props["5"]["Opacity 5"].index + ').value;',
        '   var b5 = fx(' + pe.props["5"]["Blending mode 5"].index + ').value;',
        '   if (result === null) result = zero() + v1*w1/100',
        '   else result = blendColor(result, v1, w1/100, b1-1);',
        '   result = blendColor(result, v2, w2/100, b2-1);',
        '   result = blendColor(result, v3, w3/100, b3-1);',
        '   result = blendColor(result, v4, w4/100, b4-1);',
        '   result = blendColor(result, v5, w5/100, b5-1);',
        ''
    ].join('\n');
    else expression += [
        '   var v1 = fx(' + pe.props["1"]["Value 1"].index + ').value;',
        '   var w1 = fx(' + pe.props["1"]["Weight 1"].index + ').value;',
        '   var v2 = fx(' + pe.props["2"]["Value 2"].index + ').value;',
        '   var w2 = fx(' + pe.props["2"]["Weight 2"].index + ').value;',
        '   var v3 = fx(' + pe.props["3"]["Value 3"].index + ').value;',
        '   var w3 = fx(' + pe.props["3"]["Weight 3"].index + ').value;',
        '   var v4 = fx(' + pe.props["4"]["Value 4"].index + ').value;',
        '   var w4 = fx(' + pe.props["4"]["Weight 4"].index + ').value;',
        '   var v5 = fx(' + pe.props["5"]["Value 5"].index + ').value;',
        '   var w5 = fx(' + pe.props["5"]["Weight 5"].index + ').value;',
        '   if (result === null) result = zero();',
        '   result += v1*w1/100+v2*w2/100+v3*w3/100+v4*w4/100+v5*w5/100;',
        ''
    ].join('\n');

    expression += [
        '}',
        'if (result === null) result = value;',
        'result;'
    ].join('\n');

    prop.getProperty().expression = expression;

    DuAE.endUndoGroup( i18n._("Add list"));

    return prop;
}

Duik.CmdLib['Constraint']["Separate Dimensions"] = "Duik.Constraint.separateDimensions()";
/**
 * Separate Dimensions
 */
Duik.Constraint.separateDimensions = function() {
    var props = DuAEComp.getSelectedProps();
    if (props.length == 0) return;

    DuAE.beginUndoGroup( i18n._("Split values"));

    for (var i = 0, num = props.length; i < num; i++) {
        Duik.Constraint.separatePropDimensions(props[i]);
    }

    DuAE.endUndoGroup();
}

/**
 * Separates the dimensions of the properties into an effect.<br />
 * Works with 2D, 3D, and colors
 * @param {Property|DuAEProperty} prop - The property
 * @return {DuAEProperty[]} The seperated properties (or the original one if it could not be separated)
 */
Duik.Constraint.separatePropDimensions = function(prop) {
    var propInfo = new DuAEProperty(prop);
    prop = propInfo.getProperty();

    if (!propInfo.riggable()) return prop;

    var layer = propInfo.layer;
    var dim = propInfo.dimensions();

    if (dim < 2 || dim > 4) return [propInfo];

    if (prop.isSeparationLeader) {
        prop.dimensionsSeparated = true;
        var newProps = [];
        for (var i = 1; i <= dim; i++) {
            var newProp = prop.parentProperty(prop.propertyIndex + i);
            newProp = new DuAEProperty(newProp);
            newProps.push(newProp);
        }
        return newProps;
    }

    if (dim == 2) {
        var pseudo;
        if (propInfo.isScale) pseudo = Duik.PseudoEffect.TWO_DIMENSIONS_SCALE;
        else if (propInfo.isAngle()) pseudo = Duik.PseudoEffect.TWO_DIMENSIONS_ANGLE;
        else pseudo = Duik.PseudoEffect.TWO_DIMENSIONS;

        var effect = pseudo.apply(layer, propInfo.name + " XY");

        prop = propInfo.getProperty();

        var xIndex = pseudo.props['X'].index;
        var yIndex = pseudo.props['Y'].index;

        //copy values
        if (prop.numKeys == 0) {
            effect(xIndex).setValue(prop.value[0]);
            effect(yIndex).setValue(prop.value[1]);
        } else {
            for (var k = prop.numKeys; k > 0; k--) {
                var time = prop.keyTime(k);
                var value = prop.keyValue(k);
                effect(xIndex).setValueAtTime(time, value[0]);
                effect(yIndex).setValueAtTime(time, value[1]);
                prop.removeKey(k);
            }
        }

        //add expression
        prop.expression = [DuAEExpression.Id.SEPARATE_DIMENSIONS,
            'var fx = thisLayer.effect("' + effect.name + '");',
            '[fx(' + xIndex + ').value,fx(' + yIndex + ').value];'
        ].join('\n');

        //return the new props
        var xProp = new DuAEProperty(effect(xIndex));
        var yProp = new DuAEProperty(effect(yIndex));
        return [xProp, yProp];
    }

    if (dim == 3) {
        var pseudo;
        if (propInfo.isScale) pseudo = Duik.PseudoEffect.THREE_DIMENSIONS_SCALE;
        else if (propInfo.isAngle()) pseudo = Duik.PseudoEffect.THREE_DIMENSIONS_ANGLE;
        else pseudo = Duik.PseudoEffect.THREE_DIMENSIONS;

        var effect = pseudo.apply(layer, propInfo.name + " XYZ");

        prop = propInfo.getProperty();

        var xIndex = pseudo.props['X'].index;
        var yIndex = pseudo.props['Y'].index;
        var zIndex = pseudo.props['Z'].index;

        //copy values
        if (prop.numKeys == 0) {
            effect(xIndex).setValue(prop.value[0]);
            effect(yIndex).setValue(prop.value[1]);
            effect(zIndex).setValue(prop.value[2]);
        } else {
            for (var k = prop.numKeys; k > 0; k--) {
                var time = prop.keyTime(k);
                var value = prop.keyValue(k);
                effect(xIndex).setValueAtTime(time, value[0]);
                effect(yIndex).setValueAtTime(time, value[1]);
                effect(zIndex).setValueAtTime(time, value[2]);
                prop.removeKey(k);
            }
        }

        //add expression
        prop.expression = [DuAEExpression.Id.SEPARATE_DIMENSIONS,
            'var fx = thisLayer.effect("' + effect.name + '");',
            '[fx(' + xIndex + ').value,fx(' + yIndex + ').value, fx(' + zIndex + ').value];'
        ].join('\n');

        //return the new props
        var xProp = new DuAEProperty(effect(xIndex));
        var yProp = new DuAEProperty(effect(yIndex));
        var zProp = new DuAEProperty(effect(zIndex));
        return [xProp, yProp, zProp];
    }

    if (dim == 4) {
        var pseudo = Duik.PseudoEffect.COLOR;
        var effect = pseudo.apply(layer, propInfo.name + " RGB/HSL");

        var modeIndex = pseudo.props['Channels'].index;
        var rIndex = pseudo.props['R / H'].index;
        var gIndex = pseudo.props['G / S'].index;
        var bIndex = pseudo.props['B / L'].index;

        effect(modeIndex).setValue(2);
        prop = propInfo.getProperty();

        //copy values
        if (prop.numKeys == 0) {
            var color = prop.value;
            color = new DuColor(color).floatHSL();
            effect(rIndex).setValue(color[0]);
            effect(gIndex).setValue(color[1]);
            effect(bIndex).setValue(color[2]);
        } else {
            for (var k = prop.numKeys; k > 0; k--) {
                var time = prop.keyTime(k);
                var value = prop.keyValue(k);
                value = new DuColor(value).floatHSL();
                effect(rIndex).setValueAtTime(time, value[0]);
                effect(gIndex).setValueAtTime(time, value[1]);
                effect(bIndex).setValueAtTime(time, value[2]);
                prop.removeKey(k);
            }
        }

        //add expression
        prop.expression = [DuAEExpression.Id.SEPARATE_DIMENSIONS,
            'var fx = thisLayer.effect("' + effect.name + '");',
            'var color = [fx(' + rIndex + ').value,fx(' + gIndex + ').value, fx(' + bIndex + ').value, 1];',
            'if (fx(' + modeIndex + ').value == 2) hslToRgb(color);',
            'else color;'
        ].join('\n');

        //return the new props
        var xProp = new DuAEProperty(effect(rIndex));
        var yProp = new DuAEProperty(effect(gIndex));
        var zProp = new DuAEProperty(effect(bIndex));
        return [xProp, yProp, zProp];
    }
}

Duik.CmdLib['Constraint']["Lock"] = "Duik.Constraint.lock()";
/**
 * Lock propery values
 * @param {Property|DuAEProperty|Property[]|DuAeProperty[]|DuList.<Property>|DuList.<DuAEProperty>} [props] - The properties. If omitted, locks the selected properties
 */
Duik.Constraint.lock = function(props) {
    props = def(props, DuAEComp.getSelectedProps() );
    props = new DuList(props);
    if (props.length() == 0) return;

    DuAE.beginUndoGroup( i18n._("Lock properties"));

    DuAEProperty.lock(props);

    DuAE.endUndoGroup();
}

Duik.CmdLib['Constraint']["Zero"] = "Duik.Constraint.zero()";
/**
 * Zero-out selected layers
 * @param {Layer[]|LayerCollection|DuList.<Layer>|Layer} [layers=DuAEComp.getSelectedLayers()] The layer. If omitted, will use all selected layers in the comp
 * @returns {ShapeLayer[]} The zeroes
 */
Duik.Constraint.zero = function(layers) {
    layers = def(layers, DuAEComp.getSelectedLayers());
    layers = new DuList(layers);

    DuAE.beginUndoGroup( i18n._("Add zero"), false);
    DuAEProject.setProgressMode(true);

    var zeroes = [];

    layers.do(function(layer) {
        //create null object
        var zero = DuAEComp.addNull(layer.containingComp);
        var layerparent = layer.parent;
        layer.parent = null;
        zero.position.setValue(layer.position.value);
        zero.rotation.setValue(layer.rotation.value);

        Duik.Layer.copyAttributes(zero, layer, Duik.Layer.Type.ZERO);

        layer.parent = zero;
        zero.scale.setValue(layer.scale.value);
        layer.scale.setValue([100, 100, 100]);

        //parent
        zero.parent = layerparent;

        //lock and hide
        zero.moveToEnd();
        zero.shy = true;
        zero.enabled = false;
        zero.selected = false;
        zero.locked = true;
        zeroes.push(zero);
    });

    DuAEProject.setProgressMode(false);
    DuAE.endUndoGroup( i18n._("Add zero"));

    return zeroes;
}

Duik.CmdLib['Constraint']["Move Anchor Point Top"] = "Duik.Constraint.moveAnchorPoint(DuMath.Location.TOP)";
Duik.CmdLib['Constraint']["Move Anchor Point Top Right"] = "Duik.Constraint.moveAnchorPoint(DuMath.Location.TOP_RIGHT)";
Duik.CmdLib['Constraint']["Move Anchor Point Right"] = "Duik.Constraint.moveAnchorPoint(DuMath.Location.RIGHT)";
Duik.CmdLib['Constraint']["Move Anchor Point Bottom Right"] = "Duik.Constraint.moveAnchorPoint(DuMath.Location.BOTTOM_RIGHT)";
Duik.CmdLib['Constraint']["Move Anchor Point Bottom"] = "Duik.Constraint.moveAnchorPoint(DuMath.Location.BOTTOM)";
Duik.CmdLib['Constraint']["Move Anchor Point Bottom Left"] = "Duik.Constraint.moveAnchorPoint(DuMath.Location.BOTTOM_LEFT)";
Duik.CmdLib['Constraint']["Move Anchor Point Left"] = "Duik.Constraint.moveAnchorPoint(DuMath.Location.LEFT)";
Duik.CmdLib['Constraint']["Move Anchor Point Top Left"] = "Duik.Constraint.moveAnchorPoint(DuMath.Location.TOP_LEFT)";
Duik.CmdLib['Constraint']["Move Anchor Point Center"] = "Duik.Constraint.moveAnchorPoint(DuMath.Location.CENTER)";
/**
 * Repositions the anchor points of the layers
 * @param {DuMath.Location} location The new location of the anchor points relative to the layer bounds.
 * @param {Number} [m=0.0] A margin, in pixels.
 * @param {Boolean} [includeMasks=false] Use masks to compute the bounds.
 * @param {Layer[]|LayerCollection|DuList|Layer} [layers=DuAEComp.getSelectedLayers()] The layer. If omitted, will use all selected layers in the comp
 */
Duik.Constraint.moveAnchorPoint = function(location, m, includeMasks, layers) {
    layers = def(layers, DuAEComp.unselectLayers());
    layers = new DuList(layers);

    m = def(m, 0);
    includeMasks = def(includeMasks, false);

    DuAE.beginUndoGroup( i18n._("Move anchor points"), false);
    DuAEProject.setProgressMode(true);

    layers.do(function(layer) {
        // Get the current values
        var apProp = layer.transform.anchorPoint;
        var layerBounds = DuAELayer.sourceRect(layer, undefined, false, includeMasks);

        var t = layerBounds[0];
        var l = layerBounds[1];
        var w = layerBounds[2];
        var h = layerBounds[3];

        var ap = apProp.value;
        var x = ap[0];
        var y = ap[1];

        // Update
        if (location == DuMath.Location.TOP) {
            DuAELayer.repositionAnchorPoint(layer, [l + w / 2, t - m]);
        } else if (location == DuMath.Location.TOP_RIGHT) {
            DuAELayer.repositionAnchorPoint(layer, [l + w + m, t - m]);
        } else if (location == DuMath.Location.RIGHT) {
            DuAELayer.repositionAnchorPoint(layer, [l + w + m, t + h / 2]);
        } else if (location == DuMath.Location.BOTTOM_RIGHT) {
            DuAELayer.repositionAnchorPoint(layer, [l + w + m, t + h + m]);
        } else if (location == DuMath.Location.BOTTOM) {
            DuAELayer.repositionAnchorPoint(layer, [l + w / 2, t + h + m]);
        } else if (location == DuMath.Location.BOTTOM_LEFT) {
            DuAELayer.repositionAnchorPoint(layer, [l - m, t + h + m]);
        } else if (location == DuMath.Location.LEFT) {
            DuAELayer.repositionAnchorPoint(layer, [l - m, t + h / 2]);
        } else if (location == DuMath.Location.TOP_LEFT) {
            DuAELayer.repositionAnchorPoint(layer, [l - m, t - m]);
        } else if (location == DuMath.Location.CENTER) {
            DuAELayer.repositionAnchorPoint(layer, [l + w / 2, t + h / 2]);
        }
    });

    // Reselect
    DuAEComp.selectLayers(layers);

    DuAEProject.setProgressMode(false);
    DuAE.endUndoGroup( i18n._("Move anchor points"));
}

Duik.CmdLib['Constraint']["Reset Transformation"] = "Duik.Constraint.resetPRS()";
Duik.CmdLib['Constraint']["Reset Transformation and opacity"] = "Duik.Constraint.resetPRS(undefined, true)";
/**
 * Resets the transformation of the selected layers to 0.
 * @param {Layer[]|LayerCollection|DuList.<Layer>|Layer} [layers=DuAEComp.getSelectedLayers()] The layer. If omitted, will use all selected layers in the comp
 * @param {Boolean} [opacity=false] When true, also resets the opacity to 100%
 */
Duik.Constraint.resetPRS = function(layers, opacity) {
    opacity = def(opacity, false);
    layers = def(layers, DuAEComp.getSelectedLayers());
    layers = new DuList(layers);

    DuAE.beginUndoGroup(i18n._("Reset transformation"), false);
    DuAEProject.setProgressMode(true);

    layers.do(function(layer) {
        var comp = layer.containingComp;
        //is it 3D?
        var threeD = layer.threeDLayer;
        //has parent ?
        var parent = layer.parent !== null;
        if (threeD) {
            var positionValue = parent ? [0, 0, 0] : [comp.width / 2, comp.height / 2, 0];
            if (layer.transform.position.dimensionsSeparated) {
                layer.transform.xPosition.setValue(positionValue[0]);
                layer.transform.yPosition.setValue(positionValue[1]);
                layer.transform.zPosition.setValue(positionValue[2]);
            } else {
                layer.transform.position.setValue(positionValue);
            }
            layer.transform.scale.setValue([100, 100, 100]);
            layer.transform.zRotation.setValue(0);
            layer.transform.xRotation.setValue(0);
            layer.transform.yRotation.setValue(0);
            layer.transform.orientation.setValue([0, 0, 0]);
        } else {
            var positionValue = parent ? [0, 0] : [comp.width / 2, comp.height / 2];
            var position = new DuAEProperty(layer.transform.position);
            position.setValue(positionValue)
            var scale = new DuAEProperty(layer.transform.scale);
            scale.setValue([100,100]);
            var rotation = new DuAEProperty(layer.transform.rotation);
            rotation.setValue(0);
        }

        if (opacity) layer.transform.opacity.setValue(100);
    });

    DuAEProject.setProgressMode(false);
    DuAE.endUndoGroup(i18n._("Reset transformation"));
}

Duik.CmdLib['Constraint']["Align layers"] = "Duik.Constraint.alignLayers()";
/**
 * Align selected Layers to the last selected one
 * @param {Boolean} [position=true] - whether to align the position.
 * @param {Boolean} [rotation=true] - whether to align the rotation.
 * @param {Boolean} [scale=true] - whether to align the scale.
 * @param {Boolean} [opacity=true] - whether to align the opacity.
 */
Duik.Constraint.alignLayers = function(position, rotation, scale, opacity) {
    position = def(position, true);
    rotation = def(rotation, true);
    scale = def(scale, true);
    opacity = def(opacity, false);


    var layers = DuAEComp.getSelectedLayers();
    if (layers.length <= 1) return;

    var target = layers.pop();

    DuAE.beginUndoGroup( i18n._("Align layers"), false);
    DuAELayer.align(
        layers,
        target,
        position,
        rotation,
        scale,
        opacity
    );
    DuAE.endUndoGroup( i18n._("Align layers"));
}

Duik.CmdLib['Constraint']["Expose Transform"] = "Duik.Constraint.exposeTransform()";
/**
 * Expose Transform
 * @param {CompItem} [comp] The composition where to create the expose transform controller. The active composition by default.
 * @param {Layer[]|DuList} [layers] The layer with the transformation to expose. The selected layers by default. Can be an empty list too, in this case the Expose Transform controller is not set to measure any layer.
 * @return {ShapeLayer[]} The list of the new Expose Transform controllers. One per given layer.
 */
Duik.Constraint.exposeTransform = function(comp, layers) {
    if (typeof comp === 'undefined') {
        if (typeof layer !== 'undefined') {
            comp = layer.containingComp;
        } else {
            comp = DuAEProject.getActiveComp();
        }
    }
    if (!comp) return;

    layers = def(layers, DuAEComp.unselectLayers());
    layers = new DuList(layers);

    DuAE.beginUndoGroup( i18n._("Expose transform"), false);
    DuAEProject.setProgressMode(true);

    var ctrls = [];

    // ETMs must be shape layers
    var previousCtrlLayerMode = OCO.config.get('after effects/controller layer type', Duik.Controller.LayerMode.SHAPE);
    OCO.config.set('after effects/controller layer type', Duik.Controller.LayerMode.SHAPE);

    function createETM(layer) {
        var ctrl = Duik.Controller.create(comp, Duik.Controller.Type.EXPOSE_TRANSFORM, layer);

        //add pseudo effect
        var pE = Duik.PseudoEffect.EXPOSE_TRANSFORM;
        var effect = pE.apply(ctrl);

        // indices
        var guideIndex = pE.props['Display']['Guides'].index;
        var refColorIndex = pE.props['Display']['Reference'].index;
        var targetColorIndex = pE.props['Display']['Target'].index;
        var angleColorIndex = pE.props['Display']['Angle'].index;
        var distanceColorIndex = pE.props['Display']['Distance'].index;
        var pos2DAbsIndex = pE.props['2D Position (Comp projection)']['Absolute'].index;
        var dist2DIndex = pE.props['2D Position (Comp projection)']['2D Distance'].index;
        var pos3DAbsIndex = pE.props['3D Position (World)']['Absolute'].index;
        var pos2DRelIndex = pE.props['2D Position (Comp projection)']['Relative to reference'].index;
        var pos3DRelIndex = pE.props['3D Position (World)']['Relative to reference'].index;
        var dist3DIndex = pE.props['3D Position (World)']['3D Distance'].index;
        var rotRelIndex = pE.props['2D Orientation']['Relative to reference'].index;
        var rotAbsIndex = pE.props['2D Orientation']['Absolute'].index;
        var angleIndex = pE.props['Angle (Layer-This-Reference)'].index;
        var targetIndex = pE.props['Target Layer'].index;
        var refParentIndex = pE.props['Reference'].index;
        var refIndex = pE.props['Reference Layer'].index;

        //add guides
        var guidesGroup = ctrl("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
        guidesGroup.name = 'Guides';

        var refGroup = guidesGroup("ADBE Vectors Group").addProperty("ADBE Vector Group");
        refGroup.name = 'Reference';

        var refOrientationGroup = refGroup("ADBE Vectors Group").addProperty("ADBE Vector Group");
        refOrientationGroup.name = 'Orientation';
        var refOrientation = refOrientationGroup("ADBE Vectors Group");

        var path = refOrientation.addProperty("ADBE Vector Shape - Group");
        path("ADBE Vector Shape").expression = [DuAEExpression.Id.EXPOSE_TRANSFORM,
            'var fx = effect("' + effect.name + '");',
            'if (fx(' + guideIndex + ').value)',
            '{',
            '	var A = [0,0];',
            '	var B = [ 0 , -thisComp.height/20 ];',
            '	createPath([A,B],[],[],false);',
            '}',
            'else',
            '{',
            '	value;',
            '}'
        ].join('\n');

        path = refOrientation.addProperty("ADBE Vector Shape - Ellipse");
        path("ADBE Vector Ellipse Size").expression = [DuAEExpression.Id.EXPOSE_TRANSFORM,
            'var fx = effect("' + effect.name + '");',
            'var s = thisComp.height/40;',
            'if (fx(' + guideIndex + ').value) [s,s];',
            'else [0,0];'
        ].join('\n');

        var stroke = refOrientation.addProperty("ADBE Vector Graphic - Stroke");
        stroke("ADBE Vector Stroke Color").expression = DuAEExpression.Id.EXPOSE_TRANSFORM + '\neffect("Expose Transform")(' + refColorIndex + ').value;';
        stroke("ADBE Vector Stroke Width").expression = DuAEExpression.Id.EXPOSE_TRANSFORM + '\nthisComp.height/500;';
        stroke("ADBE Vector Stroke Dashes").addProperty("ADBE Vector Stroke Dash 1");
        stroke("ADBE Vector Stroke Dashes").property('ADBE Vector Stroke Dash 1').expression = DuAEExpression.Id.EXPOSE_TRANSFORM + '\nthisComp.height/100;';
        stroke("ADBE Vector Stroke Dashes").addProperty("ADBE Vector Stroke Gap 1");
        stroke("ADBE Vector Stroke Dashes").property('ADBE Vector Stroke Gap 1').expression = DuAEExpression.Id.EXPOSE_TRANSFORM + '\nthisComp.height/500;';

        var refOrientationTransform = refOrientationGroup('ADBE Vector Transform Group');
        refOrientationTransform('ADBE Vector Position').expression = [DuAEExpression.Id.EXPOSE_TRANSFORM,
            'var fx = effect("' + effect.name + '");',
            'var P = fx(' + pos2DAbsIndex + ');',
            'var R = fx(' + pos2DAbsIndex + ') - fx(' + pos2DRelIndex + ');',
            'fromComp(R);'
        ].join('\n');
        refOrientationTransform('ADBE Vector Rotation').expression = DuAEExpression.Id.EXPOSE_TRANSFORM + '\ncontent("Guides").content("Target").transform.rotation + content("Guides").content("Target").content("Reference Orientation").transform.rotation;'

        var targetGroup = guidesGroup("ADBE Vectors Group").addProperty("ADBE Vector Group");
        targetGroup.name = 'Target';

        var targetOrientationGroup = targetGroup("ADBE Vectors Group").addProperty("ADBE Vector Group");
        targetOrientationGroup.name = 'Orientation';
        var targetOrientation = targetOrientationGroup("ADBE Vectors Group");

        path = targetOrientation.addProperty("ADBE Vector Shape - Group");
        path("ADBE Vector Shape").expression = [DuAEExpression.Id.EXPOSE_TRANSFORM,
            'var fx = effect("' + effect.name + '");',
            'if (fx(' + guideIndex + ').value)',
            '{',
            '	var A = [0,0];',
            '	var B = [ 0 , -thisComp.height/10 ];',
            '	createPath([A,B],[],[],false);',
            '}',
            'else',
            '{',
            '	value;',
            '}'
        ].join('\n');

        path = targetOrientation.addProperty("ADBE Vector Shape - Ellipse");
        path("ADBE Vector Ellipse Size").expression = [DuAEExpression.Id.EXPOSE_TRANSFORM,
            'var fx = effect("' + effect.name + '");',
            'var s = thisComp.height/20;',
            'if (fx(' + guideIndex + ').value) [s,s];',
            'else [0,0];'
        ].join('\n');

        stroke = targetOrientation.addProperty("ADBE Vector Graphic - Stroke");
        stroke("ADBE Vector Stroke Color").expression = DuAEExpression.Id.EXPOSE_TRANSFORM + '\neffect("Expose Transform")(' + targetColorIndex + ');';
        stroke("ADBE Vector Stroke Width").expression = DuAEExpression.Id.EXPOSE_TRANSFORM + '\nthisComp.height/500;';
        stroke("ADBE Vector Stroke Dashes").addProperty("ADBE Vector Stroke Dash 1");
        stroke("ADBE Vector Stroke Dashes").property('ADBE Vector Stroke Dash 1').expression = DuAEExpression.Id.EXPOSE_TRANSFORM + '\nthisComp.height/100;';
        stroke("ADBE Vector Stroke Dashes").addProperty("ADBE Vector Stroke Gap 1");
        stroke("ADBE Vector Stroke Dashes").property('ADBE Vector Stroke Gap 1').expression = DuAEExpression.Id.EXPOSE_TRANSFORM + '\nthisComp.height/500;';

        refOrientationGroup = targetGroup("ADBE Vectors Group").addProperty("ADBE Vector Group");
        refOrientationGroup.name = 'Reference Orientation';
        refOrientation = refOrientationGroup("ADBE Vectors Group");

        path = refOrientation.addProperty("ADBE Vector Shape - Group");
        path("ADBE Vector Shape").expression = [DuAEExpression.Id.EXPOSE_TRANSFORM,
            'var fx = effect("' + effect.name + '");',
            'if (fx(' + guideIndex + ').value)',
            '{',
            '	var A = [0,0];',
            '	var B = [ 0 , -thisComp.height/20 ];',
            '	createPath([A,B],[],[],false);',
            '}',
            'else',
            '{',
            '	value;',
            '}'
        ].join('\n');

        stroke = refOrientation.addProperty("ADBE Vector Graphic - Stroke");
        stroke("ADBE Vector Stroke Color").expression = DuAEExpression.Id.EXPOSE_TRANSFORM + '\neffect("Expose Transform")(' + refColorIndex + ');';
        stroke("ADBE Vector Stroke Width").expression = DuAEExpression.Id.EXPOSE_TRANSFORM + '\nthisComp.height/500;';
        stroke("ADBE Vector Stroke Dashes").addProperty("ADBE Vector Stroke Dash 1");
        stroke("ADBE Vector Stroke Dashes").property('ADBE Vector Stroke Dash 1').expression = DuAEExpression.Id.EXPOSE_TRANSFORM + '\nthisComp.height/100;';
        stroke("ADBE Vector Stroke Dashes").addProperty("ADBE Vector Stroke Gap 1");
        stroke("ADBE Vector Stroke Dashes").property('ADBE Vector Stroke Gap 1').expression = DuAEExpression.Id.EXPOSE_TRANSFORM + '\nthisComp.height/500;';

        refOrientationTransform = refOrientationGroup('ADBE Vector Transform Group');

        refOrientationTransform('ADBE Vector Rotation').expression = [DuAEExpression.Id.EXPOSE_TRANSFORM,
            'var fx = effect("' + effect.name + '");',
            '-fx(' + rotRelIndex + ');'
        ].join('\n');

        var targetTransform = targetGroup('ADBE Vector Transform Group');
        targetTransform('ADBE Vector Position').expression = [DuAEExpression.Id.EXPOSE_TRANSFORM,
            'var fx = effect("' + effect.name + '");',
            'if (fx(' + guideIndex + ').value)',
            '{',
            '	fromComp(fx(' + pos2DAbsIndex + '));',
            '}',
            'else',
            '{',
            '	value;',
            '}'
        ].join('\n');
        targetTransform('ADBE Vector Rotation').expression = [DuAEExpression.Id.EXPOSE_TRANSFORM,
            'var fx = effect("' + effect.name + '");',
            'var result = fx(' + rotAbsIndex + ');',
            'var l = thisLayer;',
            'result -= l.rotation.value;',
            'while(l.hasParent)',
            '{',
            '	l = l.parent;',
            '	result -= l.rotation.value;',
            '}',
            'result;'
        ].join('\n');

        var angleGroup = guidesGroup("ADBE Vectors Group").addProperty("ADBE Vector Group");
        angleGroup.name = 'Angle';

        var angleGroup1 = angleGroup("ADBE Vectors Group").addProperty("ADBE Vector Group");
        var angle1 = angleGroup1("ADBE Vectors Group");

        path = angle1.addProperty("ADBE Vector Shape - Group");
        path("ADBE Vector Shape").expression = [DuAEExpression.Id.EXPOSE_TRANSFORM,
            'var fx = effect("Expose Transform");',
            'if (fx(' + guideIndex + ').value)',
            '{',
            '	var A = fromComp(fx(' + pos2DAbsIndex + '));',
            '	var B = fromComp( fx(' + pos2DAbsIndex + ') - fx(' + pos2DRelIndex + ') );',
            '	createPath([A,[0,0],B],[],[],false);',
            '}',
            'else',
            '{',
            '	value;',
            '}'
        ].join('\n');

        stroke = angle1.addProperty("ADBE Vector Graphic - Stroke");
        stroke("ADBE Vector Stroke Color").expression = DuAEExpression.Id.EXPOSE_TRANSFORM + '\neffect("Expose Transform")(' + angleColorIndex + ');';
        stroke("ADBE Vector Stroke Width").expression = DuAEExpression.Id.EXPOSE_TRANSFORM + '\nthisComp.height/500;';
        stroke("ADBE Vector Stroke Dashes").addProperty("ADBE Vector Stroke Dash 1");
        stroke("ADBE Vector Stroke Dashes").property('ADBE Vector Stroke Dash 1').expression = DuAEExpression.Id.EXPOSE_TRANSFORM + '\nthisComp.height/100;';
        stroke("ADBE Vector Stroke Dashes").addProperty("ADBE Vector Stroke Gap 1");
        stroke("ADBE Vector Stroke Dashes").property('ADBE Vector Stroke Gap 1').expression = DuAEExpression.Id.EXPOSE_TRANSFORM + '\nthisComp.height/500;';

        var angleGroup2 = angleGroup("ADBE Vectors Group").addProperty("ADBE Vector Group");
        var angle2 = angleGroup2("ADBE Vectors Group");

        path = angle2.addProperty("ADBE Vector Shape - Group");
        path("ADBE Vector Shape").expression = [DuAEExpression.Id.EXPOSE_TRANSFORM,
            'var fx = effect("' + effect.name + '");',
            'if (fx(' + guideIndex + ').value)',
            '{',
            '	var A = fromComp(fx(' + pos2DAbsIndex + '));',
            '	var B = fromComp( fx(' + pos2DAbsIndex + ') - fx(' + pos2DRelIndex + ') );',
            '	var M = (A+B)/2;',
            '	var tA = [0,0];',
            '	var tB = [0,0];',
            '	var lB = length(B);',
            '	var lA = length(A);',
            '	if (lA > lB)',
            '	{',
            '		var q = 1;',
            '		if (lA != 0) q = lB/lA;',
            '		A = A/3*q;',
            '		B = B/3;',
            '		tA = M/6*q;',
            '		tB = M/6;',
            '	}',
            '	else',
            '	{',
            '		var q = 1;',
            '		if (lB != 0) q = lA/lB;',
            '		A = A/3;',
            '		B = B/3*q;',
            '		tA = M/6;',
            '		tB = M/6*q;',
            '	}',
            '	createPath([A,B],[ [0,0], tB ],[ tA, [0,0] ],false);',
            '}',
            'else',
            '{',
            '	value;',
            '}'
        ].join('\n');

        stroke = angle2.addProperty("ADBE Vector Graphic - Stroke");
        stroke("ADBE Vector Stroke Color").expression = DuAEExpression.Id.EXPOSE_TRANSFORM + '\neffect("Expose Transform")(' + angleColorIndex + ');';
        stroke("ADBE Vector Stroke Width").expression = DuAEExpression.Id.EXPOSE_TRANSFORM + '\nthisComp.height/500;';
        stroke("ADBE Vector Stroke Dashes").addProperty("ADBE Vector Stroke Dash 1");
        stroke("ADBE Vector Stroke Dashes").property('ADBE Vector Stroke Dash 1').expression = DuAEExpression.Id.EXPOSE_TRANSFORM + '\nthisComp.height/100;';
        stroke("ADBE Vector Stroke Dashes").addProperty("ADBE Vector Stroke Gap 1");
        stroke("ADBE Vector Stroke Dashes").property('ADBE Vector Stroke Gap 1').expression = DuAEExpression.Id.EXPOSE_TRANSFORM + '\nthisComp.height/500;';

        var distanceGroup = guidesGroup("ADBE Vectors Group").addProperty("ADBE Vector Group");
        distanceGroup.name = 'Distance';
        var distance = distanceGroup("ADBE Vectors Group");

        path = distance.addProperty("ADBE Vector Shape - Group");
        path("ADBE Vector Shape").expression = [DuAEExpression.Id.EXPOSE_TRANSFORM,
            'var fx = effect("' + effect.name + '");',
            'if (fx(' + guideIndex + ').value)',
            '{',
            '	var A = fromComp(fx(' + pos2DAbsIndex + '));',
            '	var B = fromComp( fx(' + pos2DAbsIndex + ') - fx(' + pos2DRelIndex + ') );',
            '	createPath([A,B],[],[],false);',
            '}',
            'else',
            '{',
            '	value;',
            '}'
        ].join('\n');

        stroke = distance.addProperty("ADBE Vector Graphic - Stroke");
        stroke("ADBE Vector Stroke Color").expression = DuAEExpression.Id.EXPOSE_TRANSFORM + '\neffect("Expose Transform")(' + distanceColorIndex + ');';
        stroke("ADBE Vector Stroke Width").expression = DuAEExpression.Id.EXPOSE_TRANSFORM + '\nthisComp.height/500;';
        stroke("ADBE Vector Stroke Dashes").addProperty("ADBE Vector Stroke Dash 1");
        stroke("ADBE Vector Stroke Dashes").property('ADBE Vector Stroke Dash 1').expression = DuAEExpression.Id.EXPOSE_TRANSFORM + '\nthisComp.height/100;';
        stroke("ADBE Vector Stroke Dashes").addProperty("ADBE Vector Stroke Gap 1");
        stroke("ADBE Vector Stroke Dashes").property('ADBE Vector Stroke Gap 1').expression = DuAEExpression.Id.EXPOSE_TRANSFORM + '\nthisComp.height/500;';

        //Effect expressions

        effect(pos2DAbsIndex).expression = [DuAEExpression.Id.EXPOSE_TRANSFORM,
            'var fx = thisProperty.propertyGroup();',
            'var l = null;',
            'try { l = fx(' + targetIndex + '); } catch (e){ }',
            'if (!l) l = thisLayer;',
            'var result = l.toComp(l.anchorPoint);',
            'result;'
        ].join('\n');

        effect(pos2DRelIndex).expression = [DuAEExpression.Id.EXPOSE_TRANSFORM,
            'var fx = thisProperty.propertyGroup();',
            'var useParent = fx(' + refParentIndex + ').value;',
            'var layerPosition = fx(' + pos2DAbsIndex + ');',
            'var referencePosition = [0,0];',
            'var rL = null;',
            'if (useParent)',
            '{',
            '   var l = null;',
            '	try { l = fx(' + targetIndex + '); } catch (e){ }',
            '   if (!l) l = thisLayer;',
            '	if (l.hasParent) rL = l.parent;',
            '	else rL = l;',
            '}',
            'else',
            '{',
            '	try { rL = fx(' + refIndex + '); } catch (e){ }',
            '   if (!rL) rL = thisLayer;',
            '}',
            'referencePosition = rL.toComp(rL.anchorPoint);',
            'var result = layerPosition - referencePosition;',
            'result;'
        ].join('\n');

        effect(dist2DIndex).expression = [DuAEExpression.Id.EXPOSE_TRANSFORM,
            'var fx = thisProperty.propertyGroup();',
            'var relativePosition = fx(' + pos2DRelIndex + ');',
            'var result = length( relativePosition );',
            'result;'
        ].join('\n');

        effect(pos3DAbsIndex).expression = [DuAEExpression.Id.EXPOSE_TRANSFORM,
            'var fx = thisProperty.propertyGroup();',
            'var l = null;',
            'try { l = fx(' + targetIndex + '); } catch (e){ }',
            'if (!l) l = thisLayer;',
            'var result = l.toWorld(l.anchorPoint);',
            'result;'
        ].join('\n');

        effect(pos3DRelIndex).expression = [DuAEExpression.Id.EXPOSE_TRANSFORM,
            'var fx = thisProperty.propertyGroup();',
            'var layerPosition = fx(' + pos3DAbsIndex + ');',
            'var useParent = fx(' + refParentIndex + ').value;',
            'var rL = null;',
            'if (useParent)',
            '{',
            '   var l = null;',
            '	try { l = fx(' + targetIndex + '); } catch (e){ }',
            '   if (!l) l = thisLayer;',
            '	if (l.hasParent) rL = l.parent;',
            '	else rL = l;',
            '}',
            'else',
            '{',
            '	try { rL = fx(' + refIndex + '); } catch (e){ }',
            '   if (!rL) rL = thisLayer;',
            '}',
            'var referencePosition = rL.toWorld(rL.anchorPoint);',
            'var result = layerPosition - referencePosition;',
            'result;'
        ].join('\n');

        effect(dist3DIndex).expression = [DuAEExpression.Id.EXPOSE_TRANSFORM,
            'var fx = thisProperty.propertyGroup();',
            'var relativePosition = fx(' + pos3DRelIndex + ');',
            'var result = length( relativePosition );',
            'result;'
        ].join('\n');

        effect(rotAbsIndex).expression = [DuAEExpression.Id.EXPOSE_TRANSFORM,
            'var fx = thisProperty.propertyGroup();',
            'var l = null;',
            'try { l = fx(' + targetIndex + ') } catch (e){ }',
            'if (!l) l = thisLayer;',
            'var result = l.rotation;',
            'if (l.position.value.length == 3) result += l.orientation[2];',
            'while(l.hasParent)',
            '{',
            '	l = l.parent;',
            '	result += l.rotation;',
            '	if (l.position.value.length == 3) result += l.orientation[2];',
            '}',
            'result;'
        ].join('\n');

        effect(rotRelIndex).expression = [DuAEExpression.Id.EXPOSE_TRANSFORM,
            'var fx = thisProperty.propertyGroup();',
            'var useParent = fx(' + refParentIndex + ').value;',
            'var rot = fx(' + rotAbsIndex + ');',
            'var result = value;',
            'var rL = null;',
            'if (useParent)',
            '{',
            '   var l = null;',
            '	try { l = fx(' + targetIndex + '); } catch (e){ }',
            '   if (!l) l = thisLayer;',
            '	if (l.hasParent) rL = l.parent;',
            '	else rL = l;',
            '}',
            'else',
            '{',
            '	try { rL = fx(' + refIndex + '); } catch (e){ }',
            '   if (!rL) rL = thisLayer;',
            '}',
            'var refRot = rL.rotation.value;',
            'if (rL.position.value.length == 3) refRot += rL.orientation.value[2];',
            'while(rL.hasParent)',
            '{',
            '	rL = rL.parent;',
            '	refRot += rL.rotation.value;',
            '	if (rL.position.value.length == 3) refRot += rL.orientation.value[2];',
            '}',
            'result = rot - refRot;',
            'result;'
        ].join('\n');

        effect(angleIndex).expression = [DuAEExpression.Id.EXPOSE_TRANSFORM,
            'var fx = thisProperty.propertyGroup();',
            'var useParent = fx(' + refParentIndex + ').value;',
            'var O = thisLayer.toComp(thisLayer.anchorPoint);',
            'var l = null;',
            'var rL = null;',
            'try { l = fx(' + targetIndex + '); } catch (e){ }',
            'if (!l) l = thisLayer;',
            'if (useParent)',
            '{',
            '	if (l.hasParent) rL = l.parent;',
            '	else rL = l;',
            '}',
            'else',
            '{',
            '	try { rL = fx(' + refIndex + '); } catch (e){ }',
            '   if (!rL) rL = thisLayer;',
            '}',
            'var A = l.toComp(l.anchorPoint);',
            'var B = rL.toComp(rL.anchorPoint);',
            'var OA = O-A;',
            'var OB = O-B;',
            'var angleA = Math.atan2(OA[1], OA[0]);',
            'var angleB = Math.atan2(OB[1], OB[0]);',
            'var result = angleA + angleB;',
            'result = radiansToDegrees(angleB-angleA);',
            'if (result < -180) result += 360;',
            'result;'
        ].join('\n');

        //set the layer as target
        if (typeof layer !== 'undefined') {
            effect(targetIndex).setValue(layer.index);
        }

        //fold
        ctrl.selected = true;
        DuAE.executeCommand(DuAE.MenuCommandID.REVEAL_EXPRESSION_ERRORS);

        return ctrl;
    }

    if (layers.length() == 0) ctrls.push(createETM());
    else {
        for (var i = 0, num = layers.length(); i < num; i++) {
            var ctrl = createETM(layers.at(i));
            ctrls.push(ctrl);
        }
    }

    // Reset original controller mode
    OCO.config.set('after effects/controller layer type', previousCtrlLayerMode);

    DuAEComp.selectLayers(ctrls);
    DuAEProject.setProgressMode(false);
    DuAE.endUndoGroup( i18n._("Expose transform"));

    return ctrls;
}

Duik.CmdLib['Constraint']["Morph Keys"] = "Duik.Constraint.morphKeys()";
/**
 * Morph Keys
 */
Duik.Constraint.morphKeys = function(props) {
    props = def(props, DuAEComp.getSelectedProps());
    if (props.length == 0) return;

    // Get layer
    var layer = new DuAEProperty(props[0]).layer;

    DuAE.beginUndoGroup( i18n._("Key Morph"), false);

    // Add key morph effect
    var peKM = Duik.PseudoEffect.KEY_MORPH;
    var peKMK = Duik.PseudoEffect.KEY_MORPH_K;
    var kmEffect = peKM.apply(layer);
    var kmEffectName = kmEffect.name;
    var kmp = peKM.props;
    var kmkp = peKMK.props;

    // number of keys expression
    kmEffect(kmp['Number of keys'].index).expression = [DuAEExpression.Id.KEY_MORPH,
        'var numK = 0;',
        '',
        'function checkDuikEffect(fx, duikMatchName) {',
        '    if (fx.numProperties  < 3) return false;',
        '    if (!!$.engineName) {',
        '        if ( fx(2).name != duikMatchName ) return false;',
        '    }',
        '    else {',
        '        try { if (fx(2).name != duikMatchName) return false; }',
        '        catch (e) { return false; }',
        '    }',
        '    return true;',
        '}',
        '',
        'for (var i = 1, n = thisLayer(\'Effects\').numProperties; i <= n; i++) {',
        '	if (!checkDuikEffect( thisLayer.effect(i), "key morph k")) continue;',
        '	numK++;',
        '}',
        '',
        'numK;'
    ].join('\n');

    // Count keyframes & add expression
    var numKeys = 1;
    for (var i = 0, n = props.length; i < n; i++) {
        var p = props[i];

        var pInfo = new DuAEProperty(p);
        p = pInfo.getProperty();

        if (!pInfo.riggable()) continue;
        var np = p.numKeys;
        if (np < 2) continue;

        // count keyframes
        if (numKeys < 2) numKeys = np;
        else if (np < numKeys) numKeys = np;

        // add expression
        p.expression = [DuAEExpression.Id.KEY_MORPH,
            'var ctrlLayer = thisComp.layer("' + layer.name + '");',
            'var cumulative = !ctrlLayer.effect("' + kmEffectName + '")(' + kmp['Weights'].index + ').value;',
            '',
            'var result = zero();',
            'var weights = [];',
            'var sumWeights = 0;',
            'var nKeys = 0;',
            'var thisIsPath = isPath(thisProperty);',
            '',
            '// If path, oVal must be a path',
            'var oVal;',
            'if (thisIsPath) oVal = getPath(0);',
            'else oVal = valueAtTime(0);',
            '',
            DuAEExpression.Library.get([
                'zero',
                'isPath',
                'getPath',
                'addPath',
                'subPath',
                'multPath',
                'multPoints',
                'addPoints',
                'subPoints',
                'checkDuikEffect',
                'normalizeWeights',
            ]),
            '',
            '// Get weights and count keys to apply',
            'var k = 0;',
            'for (var i = 1, n = ctrlLayer("Effects").numProperties; i <= n; i++) {',
            '  var fx = ctrlLayer.effect(i);',
            '  if (!checkDuikEffect(fx, "key morph k")) continue;',
            '  k++;',
            '  if (k > numKeys) break;',
            '  var weight = fx(4).value / 100;',
            '  weights.push(weight);',
            '  sumWeights += weight;',
            '  if (weight > 0) nKeys++;',
            '}',
            '',
            '// Normalize weights',
            'if (!cumulative) {',
            '  weights = normalizeWeights(weights, sumWeights);',
            '  sumWeights = 1;',
            '}',
            '',
            '// Sum values',
            'for (var i = 0, n = weights.length; i < n; i++) {',
            '  if (i > numKeys) break;',
            '  // Ignore the neutral (first) one if cumulative',
            '  if (cumulative && i == 0) continue;',
            '  var w = weights[i];',
            '  // Ignore if no weight',
            '  if (w == 0) continue;',
            '  if (thisIsPath) {',
            '    var p = getPath(key(i + 1).time);',
            '    // if cumulative, add the weighted difference',
            '    if (cumulative) {',
            '      var dif = subPath(p, oVal, 1);',
            '      result = addPath(result, dif, w);',
            '    }',
            '    else result = addPath(result, p, w);',
            '  } else {',
            '    // if cumulative, add the weighted difference',
            '    if (cumulative) {',
            '      var dif = key(i + 1).value - oVal;',
            '      result += dif * w;',
            '    }',
            '    else result += key(i + 1).value * w;',
            '  }',
            '',
            '}',
            '',
            '// Weights',
            'if (nKeys > 0) {',
            '  // If not cumulative, the sum of the weights should be 1, nothing to do.',
            '  // If cumulative, we need to add the neutral',
            '  if (cumulative) {',
            '    if (thisIsPath) result = addPath(result, oVal, 1);',
            '    else result += oVal;',
            '  }',
            '} else {',
            '  if (thisIsPath) result = getPath(0);',
            '  else result = valueAtTime(0);',
            '}',
            '',
            'if (thisIsPath) createPath(result.points, result.inTangents, result.outTangents, isClosed());',
            'else result;'
        ].join('\n');

    }

    // Add Key effects
    for (var i = 0; i < numKeys; i++) {
        var kmkFX = peKMK.apply(layer);

        // Weight expression
        kmkFX(kmkp['Weight'].index).expression = [DuAEExpression.Id.KEY_MORPH,
            'var selection = effect("' + kmEffectName + '")(' + kmp["Key Selection"].index + ');',
            'var thisIndex = thisProperty.propertyGroup(1)(' + kmkp["Key Index"].index + ').value;',
            '',
            DuAEExpression.Library.get([
                'getNextKey',
                'getPrevKey'
            ]),
            '',
            'function interpolate()',
            '{',
            '  var pK = getPrevKey(time, selection);',
            '  var nK = getNextKey(time, selection);',
            '',
            '  if (!pK && !nK && Math.round(selection.value) == thisIndex) return 100;',
            '	var nValue = 0;',
            '	var pValue = 0;',
            '	if(nK) nValue = Math.round(nK.value);',
            '	if(pK) pValue = Math.round(pK.value);',
            '  if (!pK && !nK) return 0;',
            '  if (!pK && nValue == thisIndex) return 100;',
            '  if (!pK) return 0;',
            '  if (!nK && pValue == thisIndex) return 100;',
            '  if (!nK) return 0;',
            '  if (pValue != thisIndex && nValue != thisIndex) return 0;',
            '  if (pValue == nValue) return 100;',
            '  if (pValue == thisIndex && pValue < nValue)',
            '      return linear( selection.value, nValue, pValue, 100, 0 );',
            '  if (pValue == thisIndex && pValue >= nValue)',
            '       return linear( selection.value, pValue, nValue, 0, 100 );',
            '  if (pValue < nValue)',
            '      return linear( selection.value, pValue, nValue, 0, 100 );',
            '  return linear( selection.value, pValue, nValue, 100, 0 );',
            '}',
            '',
            'var result = value + interpolate();',
            '',
            'result;'
        ].join('\n');

        kmkFX(kmkp['Key Index'].index).expression = [DuAEExpression.Id.KEY_MORPH,
            'var numK = 1;',
            '',
            DuAEExpression.Library.get([
                'checkDuikEffect'
            ]),
            '',
            'for (var i = 1, n = thisProperty.propertyGroup(1).propertyIndex; i < n; i++) {',
            '	if (!checkDuikEffect( thisLayer.effect(i), "key morph k")) continue;',
            '	numK++;',
            '}',
            '',
            'numK;'
        ].join('\n');
    }

    DuAE.endUndoGroup( i18n._("Key Morph"));
}

Duik.CmdLib['Constraint']["IK"] = "Duik.Constraint.ik()";
Duik.CmdLib['Constraint']["IK (2+1-layer)"] = "Duik.Constraint.ik(Duik.Constraint.IKType.TWO_ONE)";
Duik.CmdLib['Constraint']["IK (1+2-layer)"] = "Duik.Constraint.ik(Duik.Constraint.IKType.ONE_TWO)";
Duik.CmdLib['Constraint']["B\u00e9zier IK"] = "Duik.Constraint.ik(undefined, true)";
Duik.CmdLib['Constraint']["B\u00e9zier FK"] = "Duik.Constraint.ik(undefined, true, undefined, undefined, true)";
/**
 * Creates an IK on the layers
 * @param {Duik.IKType} [type=Duik.Constraint.IKType.ONE_TWO] The type of IK to use with three layers.
 * @param {boolean} [forceBezier=false] - force the use of a bezier IK even with two or three layers
 * @param {Layer[]|LayerCollection|DuList.<Layer>|Layer} [layers=DuAEComp.getSelectedLayers()] The layer. If omitted, will use all selected layers in the comp
 * @param {Layer} [controller] - An already existing controller.
 * @param {boolean} [bezierFK=false] - If forceBezier, adds a layer for FK Control
 * @return {Layer[]} The controller(s) of the IK.
 */
Duik.Constraint.ik = function(type, forceBezier, layers, controller, bezierFK) {
    layers = def(layers, DuAEComp.unselectLayers());
    layers = new DuList(layers);
    if (layers.length() < 1) return [];

    DuAE.beginUndoGroup( i18n._("IK"), false);

    type = def(type, Duik.Constraint.IKType.ONE_TWO)
    forceBezier = def(forceBezier, false);
    controller = def(controller, null);

    //check if there is a controller in the selection
    if (controller == null) {
        if (layers.length < 2) return [];
        for (var i = 0, n = layers.length(); i < n; i++) {
            var l = layers.at(i);
            if (Duik.Layer.isType(l, Duik.Layer.Type.CONTROLLER)) {
                controller = l;
                layers.remove(i);
                break;
            }
        }
    }

    //sort layers and parent them
    layers = DuAELayer.sortByParent(layers);

    //reset rotation and scale if structures
    layers = new DuList(layers);
    layers.do(Duik.Bone.resetTransform);
    //parent
    DuAELayer.parentChain(layers);

    //check if the last one is a goal
    var withGoal = true;
    if (controller != null) {
        var l = layers.last();
        //check position
        var distance = DuAELayer.getDistance(controller, l);
        if (distance > 10) withGoal = false;
    }
    var goal = null;
    if (withGoal) goal = layers.pop();

    if (layers.length() == 1 && !forceBezier) controller = [Duik.Constraint.oneLayerIK(layers.at(0), goal, controller)];
    else if (layers.length() == 2 && !forceBezier) controller = [Duik.Constraint.twoLayerIK(layers.at(0), layers.at(1), goal, controller)];
    else if (layers.length() == 3 && !forceBezier && type == Duik.Constraint.IKType.ONE_TWO) controller = [Duik.Constraint.oneTwoLayerIK(layers.at(0), layers.at(1), layers.at(2), goal, controller)];
    else if (layers.length() == 3 && !forceBezier && type == Duik.Constraint.IKType.TWO_ONE) controller = [Duik.Constraint.twoOneLayerIK(layers.at(0), layers.at(1), layers.at(2), goal, controller)];
    else if (layers.length() == 3 && !forceBezier && type == Duik.Constraint.IKType.THREE) controller = [Duik.Constraint.threeLayerIK(layers.at(0), layers.at(1), layers.at(2), goal, controller)];
    else if (!bezierFK) controller = Duik.Constraint.bezierIK(layers, goal, controller);
    else controller = Duik.Constraint.bezierFK(layers, goal, controller);

    DuAE.endUndoGroup( i18n._("IK"));

    return controller;
}

/**
 * Creates a one-layer-ik on the layer
 * @param {Layer} layer - The layer
 * @param {Layer|null} [goal] - The goal layer, at the end of the IK
 * @param {Layer|Controller|null} [controller] - The layer to use as a controller, can be automatically created.<br />
 * Must be provided if goal is undefined
 * @param {Boolean} [showGuides=true] - Set to false to hide guides on the controllers (and improve performance)
 * @return {Layer} The controller created
 */
Duik.Constraint.oneLayerIK = function(layer, goal, controller, showGuides) {
    goal = def(goal, null);
    controller = def(controller, null);
    if (controller == null && goal == null) throw "You must provide either a goal layer or a controller";
    var comp = layer.containingComp;

    showGuides = def(showGuides, 1);
    if (!showGuides) showGuides = 0;

    //Create controller
    if (controller == null) {
        controller = Duik.Controller.create(comp, Duik.Controller.Type.POSITION, goal);
    }

    //is right ?
    var ctrlPos = DuAELayer.getWorldPos(controller);
    var layerPos = DuAELayer.getWorldPos(layer);

    var right = (ctrlPos[0] - layerPos[0]) < 0;

    //Add Effect
    var name = Duik.Layer.name(layer);
    if (goal != null) name = Duik.Layer.name(goal);
    var pe = Duik.PseudoEffect.ONE_LAYER_IK
    var effect = pe.apply(controller, i18n._("IK") + ' | ' + name);

    //indices
    var reverseIndex = pe.props["Advanced"]["Full rotation limit"].index;
    var layerIndex = pe.props["Data"]["Layer"].index;
    var ikIndex = pe.props["IK"].index;
    var guidesIndex = pe.props["Display"]["Draw guides"].index;
    var weightIndex = pe.props["Weight"].index;
    var fkIndex = pe.props["FK"].index;
    var parentIndex = pe.props["Advanced"]["Parent rotation"].index;
    var ulIndex = pe.props["Limits"]["Upper limit"].index;
    var llIndex = pe.props["Limits"]["Lower limit"].index;
    var lsIndex = pe.props["Limits"]["Softness"].index;

    //default values
    if (right) effect(reverseIndex).setValue(1);
    effect(layerIndex).setValue(layer.index);
    effect(ulIndex).setValue(180);
    effect(llIndex).setValue(-180);
    effect(guidesIndex).setValue(showGuides);

    //guides
    if (DuAE.version.version >= 15 && controller instanceof ShapeLayer) {
        var lineGroup = controller("ADBE Root Vectors Group").property('IK Line');
        if (!lineGroup) {
            lineGroup = controller("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
            lineGroup.name = 'IK Line';
        }
        var lineContent = lineGroup.property("ADBE Vectors Group");
        var shape = lineContent.addProperty("ADBE Vector Shape - Group");
        shape('ADBE Vector Shape').expression = [DuAEExpression.Id.ONE_IK,
            'var fx = effect("' + effect.name + '");',
            'var layer1 = null;',
            'var result = [[0,0]];',
            'if (fx(' + ikIndex + ').value && fx(' + guidesIndex + ').value)',
            '{',
            '   try{ layer1 = fx(' + layerIndex + '); }catch(e){}',
            '   if (layer1!=null)',
            '   {',
            '       var l = layer1.toWorld(layer1.anchorPoint);',
            '       l = fromWorld(l);',
            '       result = [l,[0,0]];',
            '   }',
            '}',
            'createPath(result,[],[],false);'
        ].join('\n');
        var stroke = lineContent.property("ADBE Vector Graphic - Stroke");
        var ctrlEffect = controller.effect(Duik.PseudoEffect.CONTROLLER.matchName);
        if (!stroke) stroke = lineContent.addProperty("ADBE Vector Graphic - Stroke");
        if (ctrlEffect) stroke("ADBE Vector Stroke Color").expression = DuAEExpression.Id.CONTROLLER + '\neffect("' + ctrlEffect.name + '")(' + Duik.PseudoEffect.CONTROLLER.props['Icon']['Color'].index + ')-[0.2,0.2,0.2,0]';
        stroke("ADBE Vector Stroke Width").setValue(2);
        stroke("ADBE Vector Stroke Line Cap").setValue(2);
        stroke("ADBE Vector Stroke Dashes").addProperty("ADBE Vector Stroke Dash 1");
        stroke("ADBE Vector Stroke Dashes")("ADBE Vector Stroke Dash 1").setValue(5);

        var limitsGroup = controller("ADBE Root Vectors Group").property('IK Limits');
        if (!limitsGroup) {
            limitsGroup = controller("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
            limitsGroup.name = 'IK Limits';
        }
        limitsGroup.transform.position.expression = [DuAEExpression.Id.ONE_IK,
            'var fx = effect("' + effect.name + '");',
            'var l = null;',
            'try{ l = fx(' + layerIndex + '); }catch(e){}',
            'var result = value;',
            'if (l != null)',
            '{',
            '	var p = l.toWorld(l.anchorPoint);',
            '	result = fromWorld(p);',
            '}',
            'result;'
        ].join('\n');
        limitsGroup.transform.rotation.expression = DuAEExpression.Id.ONE_IK + '\n-rotation;';

        var limitLinesGroup = limitsGroup.property("ADBE Vectors Group").addProperty("ADBE Vector Group");
        limitLinesGroup.name = 'Limit Lines';
        limitLinesGroup.transform.rotation.expression = [DuAEExpression.Id.ONE_IK,
            DuAEExpression.Library.get(['getOrientation']),
            '',
            'var fx = effect("' + effect.name + '");',
            'var layer1 = null;',
            'var result = value;',
            'if (fx(' + ikIndex + ').value && fx(' + guidesIndex + ').value)',
            '{',
            '   try{ layer1 = fx(' + layerIndex + '); }catch(e){}',
            '   if (layer1 != null)',
            '   {',
            '       if (layer1.hasParent) result = getOrientation(layer1.parent);',
            '   }',
            '}',
            'result;'
        ].join('\n');

        var limitLinesContent = limitLinesGroup.property("ADBE Vectors Group");
        var lLimitGroup = limitLinesContent.addProperty("ADBE Vector Group");
        lLimitGroup.name = 'Lower Limit';
        lLimitGroup.transform.rotation.expression = [DuAEExpression.Id.ONE_IK,
            'var fx = effect("' + effect.name + '");',
            'fx(' + llIndex + ').value-180;'
        ].join('\n');

        var lLimitContent = lLimitGroup.property("ADBE Vectors Group");
        lLimitShape = lLimitContent.addProperty("ADBE Vector Shape - Group");
        lLimitShape('ADBE Vector Shape').expression = [DuAEExpression.Id.ONE_IK,
            'var fx = effect("' + effect.name + '");',
            'var layer1 = null;',
            'var result = [[0,0]];',
            'if (fx(' + ikIndex + ').value && fx(' + guidesIndex + ').value)',
            '{',
            '   try{ layer1 = fx(' + layerIndex + '); }catch(e){}',
            '   if (layer1!=null)',
            '   {',
            '       var l = layer1.toWorld(layer1.anchorPoint);',
            '       l = fromWorld(l);',
            '       l = length(l) * .5;',
            '       if (!fx(' + reverseIndex + ').value) l = -l;',
            '       result = [[l,0],[0,0]];',
            '   }',
            '}',
            'createPath(result,[],[],false);'
        ].join('\n');

        stroke = lLimitContent.addProperty("ADBE Vector Graphic - Stroke");
        if (ctrlEffect) stroke("ADBE Vector Stroke Color").expression = DuAEExpression.Id.CONTROLLER + '\neffect("' + ctrlEffect.name + '")(' + Duik.PseudoEffect.CONTROLLER.props['Icon']['Color'].index + ')-[0.2,0.2,0.2,0]';
        stroke("ADBE Vector Stroke Width").setValue(2);
        stroke("ADBE Vector Stroke Line Cap").setValue(2);

        var uLimitGroup = limitLinesContent.addProperty("ADBE Vector Group");
        uLimitGroup.name = 'Upper Limit';
        uLimitGroup.transform.rotation.expression = [DuAEExpression.Id.ONE_IK,
            'var fx = effect("' + effect.name + '");',
            'fx(' + ulIndex + ').value-180;'
        ].join('\n');

        var uLimitContent = uLimitGroup.property("ADBE Vectors Group");
        uLimitShape = uLimitContent.addProperty("ADBE Vector Shape - Group");
        uLimitShape('ADBE Vector Shape').expression = [DuAEExpression.Id.ONE_IK,
            'var fx = effect("' + effect.name + '");',
            'var layer1 = null;',
            'var result = [[0,0]];',
            'if (fx(' + ikIndex + ').value && fx(' + guidesIndex + ').value)',
            '{',
            '   try{ layer1 = fx(' + layerIndex + '); }catch(e){}',
            '   if (layer1!=null)',
            '   {',
            '       var l = layer1.toWorld(layer1.anchorPoint);',
            '       l = fromWorld(l);',
            '       l = length(l) * .5;',
            '       if (!fx(' + reverseIndex + ').value) l = -l;',
            '       result = [[l,0],[0,0]];',
            '   }',
            '}',
            'createPath(result,[],[],false);'
        ].join('\n');

        stroke = uLimitContent.addProperty("ADBE Vector Graphic - Stroke");
        if (ctrlEffect) stroke("ADBE Vector Stroke Color").expression = DuAEExpression.Id.CONTROLLER + '\neffect("' + ctrlEffect.name + '")(' + Duik.PseudoEffect.CONTROLLER.props['Icon']['Color'].index + ')-[0.2,0.2,0.2,0]';
        stroke("ADBE Vector Stroke Width").setValue(2);
        stroke("ADBE Vector Stroke Line Cap").setValue(2);

        var lSftnssGroup = limitLinesContent.addProperty("ADBE Vector Group");
        lSftnssGroup.name = 'Lower Softness';
        lSftnssGroup.transform.rotation.expression = [DuAEExpression.Id.ONE_IK,
            'var fx = effect("' + effect.name + '");',
            'fx(' + llIndex + ').value-180+fx(' + lsIndex + ').value;'
        ].join('\n');

        var lSftnssContent = lSftnssGroup.property("ADBE Vectors Group");
        lSftnssShape = lSftnssContent.addProperty("ADBE Vector Shape - Group");
        lSftnssShape('ADBE Vector Shape').expression = [DuAEExpression.Id.ONE_IK,
            'var fx = effect("' + effect.name + '");',
            'var layer1 = null;',
            'var result = [[0,0]];',
            'if (fx(' + ikIndex + ').value && fx(' + guidesIndex + ').value)',
            '{',
            '   try{ layer1 = fx(' + layerIndex + '); }catch(e){}',
            '   if (layer1!=null)',
            '   {',
            '       var l = layer1.toWorld(layer1.anchorPoint);',
            '       l = fromWorld(l);',
            '       l = length(l) * .4;',
            '       if (!fx(' + reverseIndex + ').value) l = -l;',
            '       result = [[l,0],[0,0]];',
            '   }',
            '}',
            'createPath(result,[],[],false);'
        ].join('\n');

        stroke = lSftnssContent.addProperty("ADBE Vector Graphic - Stroke");
        if (ctrlEffect) stroke("ADBE Vector Stroke Color").expression = DuAEExpression.Id.CONTROLLER + '\neffect("' + ctrlEffect.name + '")(' + Duik.PseudoEffect.CONTROLLER.props['Icon']['Color'].index + ')-[0.2,0.2,0.2,0]';
        stroke("ADBE Vector Stroke Width").setValue(2);
        stroke("ADBE Vector Stroke Line Cap").setValue(2);
        stroke("ADBE Vector Stroke Dashes").addProperty("ADBE Vector Stroke Dash 1");
        stroke("ADBE Vector Stroke Dashes")("ADBE Vector Stroke Dash 1").setValue(5);

        var uSftnssGroup = limitLinesContent.addProperty("ADBE Vector Group");
        uSftnssGroup.name = 'Upper Softness';
        uSftnssGroup.transform.rotation.expression = [DuAEExpression.Id.ONE_IK,
            'var fx = effect("' + effect.name + '");',
            'fx(' + ulIndex + ').value-180-fx(' + lsIndex + ').value;'
        ].join('\n');

        var uSftnssContent = uSftnssGroup.property("ADBE Vectors Group");
        uSftnssShape = uSftnssContent.addProperty("ADBE Vector Shape - Group");
        uSftnssShape('ADBE Vector Shape').expression = [DuAEExpression.Id.ONE_IK,
            'var fx = effect("' + effect.name + '");',
            'var layer1 = null;',
            'var result = [[0,0]];',
            'if (fx(' + ikIndex + ').value && fx(' + guidesIndex + ').value)',
            '{',
            '   try{ layer1 = fx(' + layerIndex + '); }catch(e){}',
            '   if (layer1!=null)',
            '   {',
            '       var l = layer1.toWorld(layer1.anchorPoint);',
            '       l = fromWorld(l);',
            '       l = length(l) * .4;',
            '       if (!fx(' + reverseIndex + ').value) l = -l;',
            '       result = [[l,0],[0,0]];',
            '   }',
            '}',
            'createPath(result,[],[],false);'
        ].join('\n');

        stroke = uSftnssContent.addProperty("ADBE Vector Graphic - Stroke");
        if (ctrlEffect) stroke("ADBE Vector Stroke Color").expression = DuAEExpression.Id.CONTROLLER + '\neffect("' + ctrlEffect.name + '")(' + Duik.PseudoEffect.CONTROLLER.props['Icon']['Color'].index + ')-[0.2,0.2,0.2,0]';
        stroke("ADBE Vector Stroke Width").setValue(2);
        stroke("ADBE Vector Stroke Line Cap").setValue(2);
        stroke("ADBE Vector Stroke Dashes").addProperty("ADBE Vector Stroke Dash 1");
        stroke("ADBE Vector Stroke Dashes")("ADBE Vector Stroke Dash 1").setValue(5);

        var flGroup = limitsGroup.property("ADBE Vectors Group").addProperty("ADBE Vector Group");
        flGroup.name = 'Flip Line';
        var flContent = flGroup.property("ADBE Vectors Group");
        flShape = flContent.addProperty("ADBE Vector Shape - Group");
        flShape('ADBE Vector Shape').expression = [DuAEExpression.Id.ONE_IK,
            'var fx = effect("' + effect.name + '");',
            'var layer1 = null;',
            'var result = [[0,0]];',
            'if (fx(' + ikIndex + ').value && fx(' + guidesIndex + ').value)',
            '{',
            '   try{ layer1 = fx(' + layerIndex + '); }catch(e){}',
            '   if (layer1!=null)',
            '   {',
            '       var l = layer1.toWorld(layer1.anchorPoint);',
            '       l = fromWorld(l);',
            '       l = length(l) * .3;',
            '       if (!fx(' + reverseIndex + ').value) l = -l;',
            '       result = [[l,0],[0,0]];',
            '   }',
            '}',
            'createPath(result,[],[],false);'
        ].join('\n');

        stroke = flContent.addProperty("ADBE Vector Graphic - Stroke");
        if (ctrlEffect) stroke("ADBE Vector Stroke Color").expression = DuAEExpression.Id.CONTROLLER + '\n' + DuColor.Color.RAINBOX_RED.floatRGBA().toSource();
        stroke("ADBE Vector Stroke Width").setValue(2);
        stroke("ADBE Vector Stroke Line Cap").setValue(2);

        //close controller details
        controller.selected = true;
        DuAE.executeCommand(DuAE.MenuCommandID.REVEAL_EXPRESSION_ERRORS, true);
    }

    //Add Data
    var layerData = layer('ADBE Effect Parade').addProperty('ADBE Layer Control');
    layerData.name =  DuAELayer.newUniqueEffectName( i18n._("IK"), layer );
    layerData(1).setValue(controller.index);
    //Expression
    var expr = [DuAEExpression.Id.ONE_IK,
        'var ctrl = null;',
        'var result = 0;',
        DuAEExpression.Library.get(['limit']),
        'try {',
        '	ctrl = effect("' + layerData.name + '")(1);',
        '} catch (e) {',
        '	result = value;',
        '}',
        'if (ctrl != null) {',
        '	var C = ctrl.toWorld(ctrl.anchorPoint);',
        '	var O = thisLayer.toWorld(thisLayer.anchorPoint);',
        '	var fx = ctrl.effect("' + effect.name + '");',
        '	var weight = fx(' + weightIndex + ').value / 100;',
        '	var fk = fx(' + fkIndex + ').value;',
        '	var rev = fx(' + reverseIndex + ').value;',
        '	var useIK = fx(' + ikIndex + ').value;',
        '	var parentRot = fx(' + parentIndex + ').value;',
        '	var uLimit = fx(' + ulIndex + ').value;',
        '	var lLimit = fx(' + llIndex + ').value;',
        '	var lmtSftnss = fx(' + lsIndex + ').value;',
        '	result = fk;',
        '	if (useIK) {',
        '		var vec = rev == 1 ? O - C : C - O;',
        '		var layer = thisLayer;',
        '		if (layer.hasParent && parentRot) result += layer.parent.rotation.value;',
        '		while (layer.hasParent) {',
        '			layer = layer.parent;',
        '			result = result - layer.rotation;',
        '		}',
        '		var angle = Math.atan2(vec[1], vec[0]);',
        '		angle = radiansToDegrees(angle);',
        '		angle = angle * weight;',
        '		result += angle;',
        '	}',
        '',
        '   if (result > 180) result -= 360;',
        '   else if (result < -180) result += 360;',
        '',	
        '	result = limit(result, lLimit, uLimit, lmtSftnss) + value;',
        '}',
        'result;'
    ].join('\n');

    var rotProp = new DuAEProperty(layer.transform.rotation);
    rotProp.setExpression(expr);

    if (goal != null) {
        var goalData = goal('ADBE Effect Parade').addProperty('ADBE Layer Control');
        goalData.name = i18n._("IK");
        goalData(1).setValue(controller.index);
        expr = [DuAEExpression.Id.ONE_IK,
            'var ctrl = null;',
            'var result = value;',
            'try { ctrl = effect("' + goalData.name + '")(1); } catch (e){ value };',
            'if (ctrl != null)',
            '{',
            'var goal = ctrl.effect("' + effect.name + '")(' + ikIndex + ').value;',
            'result += ctrl.rotation.value;',
            'if (goal)',
            '{',
            'var layer = thisLayer;',
            'while (layer.hasParent)',
            '{',
            'layer = layer.parent;',
            'result = result - layer.rotation;',
            '}',
            '}',
            '}',
            'result;'
        ].join('\n');

        rotProp = new DuAEProperty(goal.transform.rotation);
        rotProp.setExpression(expr);
    }

    return controller;
}

/**
 * Creates a two-layer-ik on the layer
 * @param {Layer} layer1 - The root layer
 * @param {Layer} layer2 - The end layer
 * @param {Layer|null} [goal] - The goal layer, at the end of the IK
 * @param {Layer|null} [controller] - The layer to use as a controller, can be automatically created.<br />
 * Must be provided if goal is undefined
 * @param {Boolean} [showGuides=true] - Set to false to hide guides on the controllers (and improve performance)
 * @return {Layer} The controller created
 */
Duik.Constraint.twoLayerIK = function(layer1, layer2, goal, controller, showGuides) {
    goal = def(goal, null);
    controller = def(controller, null);
    if (controller == null && goal == null) throw "You must provide either a goal layer or a controller";
    var comp = layer1.containingComp;

    showGuides = def(showGuides, true);

    //Create controller
    if (controller == null) {
        controller = Duik.Controller.create(comp, Duik.Controller.Type.TRANSFORM, goal);
        goal.parent = null;
        controller.transform.rotation.setValue(goal.transform.rotation.value);
        goal.parent = layer2;
    }

    // We do need a goal
    var lockGoal = false;
    if (goal == null) {
        goal = DuAEComp.addNull(comp, 20, controller);
        Duik.Layer.copyAttributes( goal, controller, Duik.Layer.Type.IK );
        goal.parent = layer2;
        goal.enabled = false;
        lockGoal = true;
    }

    //Check if clockwise and lengths

    //unparent
    var rootParent = layer1.parent;
    layer1.parent = null;
    var middleParent = layer2.parent;
    layer2.parent = null;
    var endParent = controller.parent;
    controller.parent = null;

    var clockwise = false;

    var l1pos = layer1.transform.position.value;
    var l2pos = layer2.transform.position.value;
    var cpos = controller.transform.position.value;
    /// @ts-ignore
    var endPos = cpos - l1pos;
    /// @ts-ignore
    var middlePos = l2pos - l1pos;
    /// @ts-ignore
    var gpos = cpos - l2pos;
    if (endPos[0] == 0 && endPos[1] > 0 && middlePos[0] > 0) clockwise = true;
    else if (endPos[0] == 0 && endPos[1] < 0 && middlePos[0] < 0) clockwise = true;
    else {
        var coef = endPos[1] / endPos[0];
        if (middlePos[1] < middlePos[0] * coef && endPos[0] > 0) clockwise = true;
        if (middlePos[1] > middlePos[0] * coef && endPos[0] < 0) clockwise = true;
    }

    // Get l2 relative position
    /// @ts-ignore
    l2pos = l2pos - l1pos;

    //reparent
    layer1.parent = rootParent;
    layer2.parent = middleParent;
    controller.parent = endParent;

    //add effect
    var name = Duik.Layer.name(layer2);
    if (goal != null) name = Duik.Layer.name(goal);
    var pe = Duik.PseudoEffect.TWO_LAYER_IK;
    var effect = pe.apply(controller, i18n._("IK") + ' | ' + name);

    // indices
    var ikIndex = pe.props["IK / FK"].index;
    var weightIndex = pe.props["Weight"].index;
    var sideIndex = pe.props["Side"].index;

    var swingIndex = pe.props["Auto swing"]["Auto swing"].index;
    var swingSftnssIndex = pe.props["Auto swing"]["Softness"].index;
    var swingLimitIndex = pe.props["Auto swing"]["Limit angle"].index;
    var swingRevIndex = pe.props["Auto swing"]["Reverse"].index;

    var pRotationIndex = pe.props["FK"]["Parent rotation"].index;
    var lFKIndex = pe.props["FK"]["Lower"].index;
    var endFKIndex = pe.props["FK"]["End"].index;

    var overlapAnimIndex = pe.props["FK Overlap"]["Animation"].index;
    var resistanceIndex = pe.props["FK Overlap"]["Resistance"].index;
    var flexibilityIndex = pe.props["FK Overlap"]["Flexibility"].index;
    var overlapIndex = pe.props["FK Overlap"]["Overlap"].index;

    var stretchIndex = pe.props["Stretch"]["Stretch"].index;
    var upperStretchIndex = pe.props["Stretch"]["Upper Stretch"].index;
    var lowerStretchIndex = pe.props["Stretch"]["Lower Stretch"].index;
    var autoStretchIndex = pe.props["Stretch"]["Auto-Stretch"].index;

    var uLayerIndex = pe.props["Data"]["Layers"]["Upper"].index;
    var lLayerIndex = pe.props["Data"]["Layers"]["Lower"].index;
    var gLayerIndex = pe.props["Data"]["Layers"]["Goal"].index;

    var uLengthIndex = pe.props["Data"]["Base values"]["Upper"].index;
    var lLengthIndex = pe.props["Data"]["Base values"]["Lower"].index;
    var limbLengthIndex = pe.props["Data"]["Base values"]["Limb"].index;
    var uWorldPosIndex = pe.props["Data"]["Base values"]["Upper world position"].index;
    var lRelativePosIndex = pe.props["Data"]["Base values"]["Lower relative position"].index;
    var goalRelativePosIndex = pe.props["Data"]["Base values"]["Goal relative position"].index;
    var ctrlWorldPosIndex = pe.props["Data"]["Base values"]["Controller world position"].index;
    var ctrlDistanceIndex = pe.props["Data"]["Base values"]["Controller distance"].index;

    var uStretchIndex = pe.props["Data"]["Stretch data"]["Upper"].index;
    var uScaleIndex = pe.props["Data"]["Stretch data"]["Upper scale"].index;
    var lStretchIndex = pe.props["Data"]["Stretch data"]["Lower"].index;
    var lScaleIndex = pe.props["Data"]["Stretch data"]["Lower scale"].index;
    var limbStretchedIndex = pe.props["Data"]["Stretch data"]["Limb"].index;
    var lRelativeStretchedIndex = pe.props["Data"]["Stretch data"]["Lower relative position"].index;
    var ikGoalPosIndex = pe.props["Data"]["Stretch data"]["IK Goal world position"].index;
    var fkGoalPosIndex = pe.props["Data"]["Stretch data"]["FK Goal relative position"].index;
    var ikGoalDistanceIndex = pe.props["Data"]["Stretch data"]["IK Goal distance"].index;
    var straightIndex = pe.props["Data"]["Stretch data"]["Straight"].index;

    var uAngleIndex = pe.props["Data"]["Angles"]["Upper angle"].index;
    var lAngleIndex = pe.props["Data"]["Angles"]["Lower angle"].index;
    var gAngleIndex = pe.props["Data"]["Angles"]["Goal angle"].index;

    var guidesIndex = pe.props["Display"]["Draw guides"].index;

    // Default values
    /// @ts-ignore
    effect(guidesIndex).setValue(showGuides ? 1 : 0);

    /// @ts-ignore
    if (clockwise) effect(sideIndex).setValue(-100);
    /// @ts-ignore
    else effect(sideIndex).setValue(100);

    //set layers
    /// @ts-ignore
    effect(uLayerIndex).setValue(layer1.index);
    /// @ts-ignore
    effect(lLayerIndex).setValue(layer2.index);
    /// @ts-ignore
    if (goal != null) effect(gLayerIndex).setValue(goal.index);

    //set initial position
    /// @ts-ignore
    effect(lRelativePosIndex).setValue([l2pos[0],l2pos[1]]);
    /// @ts-ignore
    effect(goalRelativePosIndex).setValue([gpos[0], gpos[1]]);
    DuAEProperty.lock([effect(lRelativePosIndex),  effect(goalRelativePosIndex)]);

    //add expressions

    /// @ts-ignore
    effect(sideIndex).expression = [DuAEExpression.Id.TWO_IK,
        'var fx = thisProperty.propertyGroup();',
        'var auto = fx(' + swingIndex + ').value;',
        'var result = value;',
        'if (auto)',
        '{',
        '	var reversed = fx(' + swingRevIndex + ').value;',
        '   var sftnss = fx(' + swingSftnssIndex + ').value;',
        '   var limitAngle = fx(' + swingLimitIndex + ').value;',
        '	var ctrlPos = fx(' + ctrlWorldPosIndex + ').value;',
        '	var upperPos = fx(' + uWorldPosIndex + ').value;',
        '	',
        '	var lowerLimit = limitAngle - sftnss;',
        '	var upperLimit = limitAngle + sftnss;',
        '	',
        '	var vec = ctrlPos - upperPos;',
        '	var angle = Math.atan2(vec[1], vec[0]);',
        '	angle = radiansToDegrees(angle);',
        '	angle = linear(angle, lowerLimit, upperLimit, -100, 100);',
        '	if(reversed) angle = -angle;',
        '	result = angle;',
        '}',
        '',
        'result;'
    ].join('\n');

    /// @ts-ignore
    effect(uLengthIndex).expression = [DuAEExpression.Id.TWO_IK,
        'var fx = thisProperty.propertyGroup();',
        'var lowerPos = fx(' + lRelativePosIndex + ').value;',
        'length(lowerPos);'
	].join('\n');

    /// @ts-ignore
    effect(lLengthIndex).expression = [DuAEExpression.Id.TWO_IK,
        'var fx = thisProperty.propertyGroup();',
        'var lowerPos = fx(' + goalRelativePosIndex + ').value;',
        'length(lowerPos);'
	].join('\n');

    /// @ts-ignore
    effect(limbLengthIndex).expression = [DuAEExpression.Id.TWO_IK,
        'var fx = thisProperty.propertyGroup();',
        'var upperLength = fx(' + uLengthIndex + ').value;',
        'var lowerLength = fx(' + lLengthIndex + ').value;',
        'upperLength + lowerLength;'
	].join('\n');

    /// @ts-ignore
    effect(uWorldPosIndex).expression = [DuAEExpression.Id.TWO_IK,
        'var fx = thisProperty.propertyGroup();',
        'var upperLayer = null;',
        'var result = value;',
        'function getLayerWorldPos(t, l) {',
        '	if (typeof t === \'undefined\') t = time;',
        '	if (typeof l === \'undefined\') l = thisLayer;',
        '	if (l.hasParent) return l.parent.toWorld(l.position, t);',
        '	else return l.transform.position.valueAtTime(t);',
        '}',
        'try {upperLayer = fx(' + uLayerIndex + ') } catch(e) {}',
        'if (upperLayer) {',
        '	result = getLayerWorldPos(time, upperLayer);',
        '} ',
        'result;'
	].join('\n');

    /// @ts-ignore
    effect(ctrlWorldPosIndex).expression = [DuAEExpression.Id.TWO_IK,
        'var fx = thisProperty.propertyGroup();',
        'function getLayerWorldPos(t, l) {',
        '	if (typeof t === \'undefined\') t = time;',
        '	if (typeof l === \'undefined\') l = thisLayer;',
        '	if (l.hasParent) return l.parent.toWorld(l.position, t);',
        '	return l.position.valueAtTime(t);',
        '}',
        'getLayerWorldPos();'
	].join('\n');

    /// @ts-ignore
    effect(ctrlDistanceIndex).expression = [DuAEExpression.Id.TWO_IK,
        'var fx = thisProperty.propertyGroup();',
        'var upperPos = fx(' + uWorldPosIndex + ').value;',
        'var ctrlPos = fx(' + ctrlWorldPosIndex + ').value;',
        'length(ctrlPos, upperPos);'
	].join('\n');

    /// @ts-ignore
    effect(uStretchIndex).expression = [DuAEExpression.Id.TWO_IK,
        'var fx = thisProperty.propertyGroup();',
        'var stretch = fx(' + stretchIndex + ').value;',
        'stretch += fx(' + upperStretchIndex + ').value;',
        'var limbStretch = stretch + fx(' + lowerStretchIndex + ').value;',
        'var auto = fx(' + autoStretchIndex + ').value;',
        'var ik = fx(' + ikIndex + ').value;',
        'ik *= fx(' + weightIndex + ').value;',
        'ik /= 100;',
        'var side = fx(' + sideIndex + ').value;',
        'side /= 100;',
        'side = 1 - Math.abs(side);',
        'var upperLength = fx(' + uLengthIndex + ').value;',
        'var limbLength = fx(' + limbLengthIndex + ').value;',
        'var ctrlDistance = fx(' + ctrlDistanceIndex + ').value;',
        'if (limbLength != 0) {',
        '	var stretchedLength = limbLength + limbStretch;',
        '	var ratio = upperLength / limbLength;',
        '	var maxShrink = stretchedLength * side;',
        '	var shrink = 0;',
        '	var boneStretch = 0;',
        '	if (ctrlDistance < stretchedLength) shrink = (1 - ctrlDistance / stretchedLength) * ik;',
        '	boneStretch = -linear( shrink, 0, maxShrink) * ratio;',
        '	if (ctrlDistance > stretchedLength && auto) boneStretch += ((ctrlDistance - limbLength) * ratio)*ik;',
        '	else boneStretch += stretch * ratio;',
        'boneStretch + upperLength;',
        '}',
        'else value;'
	].join('\n');

    /// @ts-ignore
    effect(uScaleIndex).expression = [DuAEExpression.Id.TWO_IK,
        'var fx = thisProperty.propertyGroup();',
        'var upperLength = fx(' + uLengthIndex + ').value;',
        'var boneStretch = fx(' + uStretchIndex + ').value;',
        'var c = 1;',
        'if (upperLength != 0) c = boneStretch / upperLength;',
        'c*100;'
	].join('\n');

    /// @ts-ignore
    effect(lStretchIndex).expression = [DuAEExpression.Id.TWO_IK,
        'var fx = thisProperty.propertyGroup();',
        'var stretch = fx(' + stretchIndex + ').value;',
        'stretch += fx(' + lowerStretchIndex + ').value;',
        'var limbStretch = stretch + fx(' + upperStretchIndex + ').value;',
        'var auto = fx(' + autoStretchIndex + ').value;',
        'var ik = fx(' + ikIndex + ').value;',
        'ik *= fx(' + weightIndex + ').value;',
        'ik /= 100;',
        'var side = fx(' + sideIndex + ').value;',
        'side /= 100;',
        'side = 1 - Math.abs(side);',
        'var lowerLength = fx(' + lLengthIndex + ').value;',
        'var limbLength = fx(' + limbLengthIndex + ').value;',
        'var ctrlDistance = fx(' + ctrlDistanceIndex + ').value;',
        'if (limbLength != 0) {',
        '	var stretchedLength = limbLength + limbStretch;',
        '	var ratio = lowerLength / limbLength;',
        '	var maxShrink = stretchedLength * side;',
        '	var shrink = 0;',
        '	var boneStretch = 0;',
        '	if (ctrlDistance < stretchedLength) shrink = (1 - ctrlDistance / stretchedLength) * ik;',
        '	boneStretch = -linear( shrink, 0, maxShrink) * ratio;',
        '	if (ctrlDistance > stretchedLength && auto) boneStretch += ((ctrlDistance - limbLength) * ratio)*ik;',
        '	else boneStretch += stretch * ratio;',
        '	boneStretch + lowerLength;',
        '}',
        'else value;',
        ''
	].join('\n');

    /// @ts-ignore
    effect(lScaleIndex).expression = [DuAEExpression.Id.TWO_IK,
        'var fx = thisProperty.propertyGroup();',
        'var lowerLength = fx(' + lLengthIndex + ').value;',
        'var boneStretch = fx(' + lStretchIndex + ').value;',
        'var c = 1;',
        'if (lowerLength != 0) c = boneStretch / lowerLength;',
        'c*100;'
	].join('\n');

    /// @ts-ignore
    effect(limbStretchedIndex).expression = [DuAEExpression.Id.TWO_IK,
        'var fx = thisProperty.propertyGroup();',
        'var upperStretchedLength = fx(' + uStretchIndex + ').value;',
        'var lowerStretchedLength = fx(' + lStretchIndex + ').value;',
        'upperStretchedLength + lowerStretchedLength;'
	].join('\n');

    /// @ts-ignore
    effect(lRelativeStretchedIndex).expression = [DuAEExpression.Id.TWO_IK,
        'var fx = thisProperty.propertyGroup();',
        'var lowerPos = fx(' + lRelativePosIndex + ').value;',
        'var upperScale = fx(' + uScaleIndex + ').value;',
        'upperScale /= 100;',
        'lowerPos * upperScale;'
	].join('\n');

    /// @ts-ignore
    effect(ikGoalPosIndex).expression = [DuAEExpression.Id.TWO_IK,
        'var fx = thisProperty.propertyGroup();',
        'var ctrlDistance = fx('  + ctrlDistanceIndex + ').value;',
        'var ctrlPos = fx('  + ctrlWorldPosIndex + ').value;',
        'var limbLength = fx('  + limbStretchedIndex + ').value;',
        'var upperPos = fx('  + uWorldPosIndex + ').value;',
        'var result = [0,0];',
        '',
        'var result = ctrlPos;',
        'if (limbLength < ctrlDistance) { ',
        '	var ratio = limbLength / ctrlDistance;',
        '	var vec = sub(ctrlPos, upperPos);',
        '	vec *= ratio;',
        '	result = upperPos + vec;',
        '}',
        '',
        'result;'
	].join('\n');

    /// @ts-ignore
    effect(fkGoalPosIndex).expression = [DuAEExpression.Id.TWO_IK,
        'var fx = thisProperty.propertyGroup();',
        'var lowerVec = fx(' + goalRelativePosIndex + ').value;',
        'var lowerScale = fx(' + lScaleIndex + ').value;',
        'lowerVec * lowerScale / 100;'
	].join('\n');

    /// @ts-ignore
    effect(ikGoalDistanceIndex).expression = [DuAEExpression.Id.TWO_IK,
        'var fx = thisProperty.propertyGroup();',
        'var goal = null;',
        'try { goal = fx(' + gLayerIndex + '); } catch (e) {}',
        'if (goal) {',
        '    var p = goal.toWorld(goal.anchorPoint);',
        '    var u = fx(' + uWorldPosIndex + ').value;',
        '    length(u, p);',
        '} else value;'
	].join('\n');

    /// @ts-ignore
    effect(straightIndex).expression = [DuAEExpression.Id.TWO_IK,
        'var fx = thisProperty.propertyGroup();',
        'var limbLength = fx(' + limbStretchedIndex + ').value;',
        'var ctrlDistance = fx(' + ctrlDistanceIndex + ').value;',
        'if (limbLength <= ctrlDistance) 1;',
        'else 0;'
	].join('\n');

    /// @ts-ignore
    effect(uAngleIndex).expression = [DuAEExpression.Id.TWO_IK,
        'var fx = thisProperty.propertyGroup();',
        'var ikfk = fx(' + ikIndex + ').value;',
        'ikfk *= fx(' + weightIndex + ').value / 100;',
        '',
        DuAEExpression.Library.get(['dishineritRotation']),
        '',
        'function ik() {',
        '	var side = fx(' + sideIndex + ').value;',
        '	var cw = side < 0;',
        '	var upperPos = fx(' + uWorldPosIndex + ').value;',
        '	var ctrlPos = fx(' + ctrlWorldPosIndex + ').value;',
        '	var a = fx(' + lStretchIndex + ').value;',
        '	var b = fx(' + ctrlDistanceIndex + ').value;',
        '	var c = fx(' + uStretchIndex + ').value;',
        '	var upperVec = fx(' + lRelativeStretchedIndex + ').value;',
        '	if (c == 0) return value;',
        '	var x = (b * b + c * c - a * a) / (2 * b);',
        '	var alpha = Math.acos(clamp(x / c, -1, 1));',
        '	var ctrlVec = ctrlPos - upperPos;',
        '	var delta = Math.atan2(ctrlVec[1], ctrlVec[0]);',
        '	var r = radiansToDegrees(delta - (cw ? 1 : -1) * alpha);',
        '	var adj1 = radiansToDegrees(Math.atan2(upperVec[1], upperVec[0]));',
        '	var IK = r - adj1 + value;',
        '	IK = IK % 360;',
        '	if (IK > 180) return IK - 360;',
        '	if (IK < -180) return IK + 360;',
        '	return IK;',
        '}',
        '',
        'function fk() {',
        'var follow = fx(11).value;',
        'var FK = fx(12).value + fx(18).value;',
        'var l = null;',
        'try { l = fx(30); } catch(e) {}',
        'if (l)',
        '{',
        '    var r = l.rotation.value;',
        '    if (follow) r -= dishineritRotation(l);',
        '    FK += r;',
        '}',
        'return FK;',
        '}',
        'result = ik() * ikfk + fk() * (1 - ikfk);',
        'result;'
	].join('\n');

    /// @ts-ignore
    effect(lAngleIndex).expression = [DuAEExpression.Id.TWO_IK,
        'var fx = thisProperty.propertyGroup();',
        'var ikfk = fx(' + ikIndex + ').value;',
        'ikfk *= fx(' + weightIndex + ').value / 100;',
        '',
        'function ik() {',
        '	var side = fx(3).value;',
        '	var cw = side < 0;',
        '	var a = fx(' + lStretchIndex + ').value;',
        '	var b = fx(' + ctrlDistanceIndex + ').value;',
        '	var c = fx(' + uStretchIndex + ').value;',
        '	if (c == 0) return value;',
        '	var x = (b * b + c * c - a * a) / (2 * b);',
        '	var alpha = Math.acos(clamp(x / c, -1, 1));',
        '	var y = b - x;',
        '	var gamma = Math.acos(clamp(y / a, -1, 1));',
        '	var r = (cw ? 1 : -1) * radiansToDegrees(gamma + alpha);',
        '	var IK = r % 360;',
        '	if (IK > 180) return IK - 360;',
        '	if (IK < -180) return IK + 360;',
        '	return IK;',
        '}',
        '',
        'function fk() {',
        '	var ctrlRot = fx(' + overlapAnimIndex + ');',
        '	var delay = fx(' + resistanceIndex + ').value;',
        '	var amp = fx(' + flexibilityIndex + ').value;',
        '	var follow = fx(' + pRotationIndex + ').value;',
        '	var ftEnabled = fx(' + overlapIndex + ').value;',
        '	var upperLayer = null;',
        '	try { upperLayer = fx(' + uLayerIndex + ') } catch(e) { return value };',
        '	if (!ftEnabled) {',
        '		amp = 0;',
        '		delay = 0;',
        '	} else {',
        '		delay = delay / 100;',
        '		amp = amp / 100;',
        '	}',
        '	FK = ctrlRot.valueAtTime(time - delay);',
        '	if (follow && hasParent) {',
        '		var cP = upperLayer;',
        '		while (cP.hasParent) {',
        '			cP = cP.parent;',
        '			FK -= cP.rotation.value - cP.rotation.valueAtTime(time - delay);',
        '		}',
        '	}',
        '	FK = FK - ctrlRot.value;',
        '	FK = FK * amp;',
        '	FK = FK - ctrlRot.velocity * (delay / 5);',
        '	FK += fx(' + lFKIndex + ').value;',
        '	return FK;',
        '}',
        'result = ik() * ikfk + fk() * (1 - ikfk);',
        '',
        'result;'
	].join('\n');

    /// @ts-ignore
    effect(gAngleIndex).expression = [DuAEExpression.Id.TWO_IK,
        'var fx = thisProperty.propertyGroup();',
        'var ikfk = fx(' + ikIndex + ').value;',
        'ikfk *= fx(' + weightIndex + ').value/100;',
        'var result = 0;',
        'var goalLayer = null;',
        'try { goalLayer = fx(' + gLayerIndex + '); } catch(e) {  }',
        'if (goalLayer) {',
        '	',
        '	function ik() {',
        '		var IK = thisLayer.rotation.value;',
        '		var layer = goalLayer;',
        '		while ( layer.hasParent ) {',
        '			layer = layer.parent;',
        '			IK = IK - layer.rotation;',
        '		}',
        '		return IK;',
        '	}',
        '',
        '	function fk() {',
        '		var FK = 0;',
        '		if (!goalLayer.hasParent) return 0;',
        '		var parentRot = goalLayer.parent.transform.rotation;',
        '		var delay = fx(' + resistanceIndex + ').value;',
        '		var amp = fx(' + flexibilityIndex + ').value;',
        '		var ftEnabled = fx(' + overlapIndex + ').value;',
        '',
        '		delay = delay / 100;',
        '		amp = amp / 100;',
        '',
        '		if (ftEnabled)',
        '		{',
        '			FK = parentRot.valueAtTime( time - delay );',
        '			FK = FK * amp;',
        '		}',
        '		',
        '		FK = FK + fx(' + endFKIndex + ');',
        '',
        '		if (ftEnabled)',
        '		{',
        '			FK = FK - parentRot.valueAtTime( 0 )',
        '		}',
        '		',
        '		return FK;',
        '	}',
        '	result = ik()*ikfk + fk()*(1-ikfk);',
        '}',
        '',
        'result;'
	].join('\n');

    //add controller visual feedback
    if (controller instanceof ShapeLayer) {
        // Will be null if baked / removed
        var peCtrl = Duik.PseudoEffect.CONTROLLER;
        var ctrlEffect = controller.effect(peCtrl.matchName);
        var iconColorIndex = peCtrl.props["Icon"]["Color"].index;
        var iconSizeIndex = peCtrl.props["Icon"]["Size"].index;
        var iconPosIndex = peCtrl.props["Icon"]["Position"].index;
        var iconOpacityIndex = peCtrl.props["Icon"]["Opacity"].index;

        // reusable expressions
        var colorExp = '';
        if (ctrlEffect) colorExp = DuAEExpression.Id.CONTROLLER + '\neffect("' + ctrlEffect.name + '")(' + iconColorIndex + ')-[0.2,0.2,0.2,0]';

        /// @ts-ignore
        var ikGroup = controller("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
        ikGroup.name = 'IK';
        var ikContent = ikGroup.property("ADBE Vectors Group");
        var shape = ikContent.addProperty("ADBE Vector Shape - Group");
        var ikShape = new Shape();
        ikShape.vertices = [
            [-8, 16],
            [8, 16]
        ];
        ikShape.inTangents = [
            [0, 0],
            [0, 0]
        ];
        ikShape.outTangents = [
            [0, 0],
            [0, 0]
        ];
        ikShape.closed = false;
        shape('ADBE Vector Shape').setValue(ikShape);
        var stroke = ikContent.addProperty("ADBE Vector Graphic - Stroke");

        if (ctrlEffect) stroke("ADBE Vector Stroke Color").expression = colorExp;
        else stroke("ADBE Vector Stroke Color").setValue(DuColor.Color.APP_HIGHLIGHT_COLOR.darker(150).floatRGBA());
        stroke("ADBE Vector Stroke Width").setValue(2);
        stroke("ADBE Vector Stroke Line Cap").setValue(2);
        stroke("ADBE Vector Stroke Opacity").expression = [DuAEExpression.Id.TWO_IK,
            'var fx = effect("' + effect.name + '");\n' +
            'if (fx(' + guidesIndex + ').value) fx(' + straightIndex + ').value*100;',
            'else 0;'
        ].join('\n');

        if (ctrlEffect) ikGroup.transform.scale.expression = DuAEExpression.Id.CONTROLLER + '\n[ effect("' + ctrlEffect.name + '")(' + iconSizeIndex + ') * 2 ,effect("' + ctrlEffect.name + '")(' + iconSizeIndex + ') * 2 ]';
        if (ctrlEffect) ikGroup.transform.position.expression = DuAEExpression.Id.CONTROLLER + '\neffect("' + ctrlEffect.name + '")(' + iconPosIndex + ')';
        if (ctrlEffect) ikGroup.transform.opacity.expression = DuAEExpression.Id.CONTROLLER + '\neffect("' + ctrlEffect.name + '")(' + iconOpacityIndex + ') * effect("' + effect.name + '")(' + weightIndex + ').value/100;';

        if (DuAE.version.version >= 15) {
            var lineGroup = controller("ADBE Root Vectors Group").property('IK Line');
            if (!lineGroup) {
                lineGroup = controller("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
                lineGroup.name = 'IK Line';
            }
            lineGroup.transform.opacity.expression = DuAEExpression.Id.TWO_IK + '\neffect("' + effect.name + '")(' + weightIndex + ').value;';
            var lineContent = lineGroup.property("ADBE Vectors Group");
            var shape = lineContent.addProperty("ADBE Vector Shape - Group");
            shape('ADBE Vector Shape').expression = [DuAEExpression.Id.TWO_IK,
                'var fx = effect("' + effect.name + '");',
                'var layer1 = null;',
                'var result = [[0,0]];',
                'if (fx(' + ikIndex + ').value && fx(' + guidesIndex + ').value)',
                '{',
                '   try{ layer1 = fx(' + uLayerIndex + '); }catch (e) {}',
                '   if (layer1!=null)',
                '   {',
                '       var l = layer1.toWorld(layer1.anchorPoint);',
                '       l = fromWorld(l);',
                '       result = [l,[0,0]];',
                '   }',
                '}',
                'createPath(result,[],[],false);'
            ].join('\n');

            var stroke = lineContent.property("ADBE Vector Graphic - Stroke");
            if (!stroke) stroke = lineContent.addProperty("ADBE Vector Graphic - Stroke");
            if (ctrlEffect) stroke("ADBE Vector Stroke Color").expression = colorExp;
            else stroke("ADBE Vector Stroke Color").setValue(DuColor.Color.APP_HIGHLIGHT_COLOR.darker(150).floatRGBA());
            stroke("ADBE Vector Stroke Width").setValue(2);
            stroke("ADBE Vector Stroke Line Cap").setValue(2);
            stroke("ADBE Vector Stroke Dashes").addProperty("ADBE Vector Stroke Dash 1");
            stroke("ADBE Vector Stroke Dashes")("ADBE Vector Stroke Dash 1").setValue(5);

            var ikSideGroup = controller("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
            ikSideGroup.name = "IK Swing";
            ikSideContent = ikSideGroup.property("ADBE Vectors Group");

            var upperLimitGroup = ikSideContent.addProperty("ADBE Vector Group");
            upperLimitGroup.name = "Upper Limit";
            var upperLimitContent = upperLimitGroup.property("ADBE Vectors Group");

            shape = upperLimitContent.addProperty("ADBE Vector Shape - Group");
            shape('ADBE Vector Shape').expression = [DuAEExpression.Id.TWO_IK,
                'var fx = effect("' + effect.name + '");',
                'var layer1 = null;',
                'var result = [[0,0]];',
                'if (fx(' + ikIndex + ').value && fx(' + guidesIndex + ').value && fx(' + swingIndex + ').value)',
                '{',
                '	try{ layer1 = fx(' + uLayerIndex + '); }catch (e) {}',
                '	if ( layer1 != null)',
                '	{',
                '		var l = layer1.toWorld( layer1.anchorPoint );',
                '		l = fromWorld(l);',
                '		l = length(l) * .5;',
                '		result = [[l,0],[0,0]];',
                '	}',
                '}',
                'createPath(result,[],[],false);'
            ].join('\n');

            stroke = upperLimitContent.addProperty("ADBE Vector Graphic - Stroke");
            if (ctrlEffect) stroke("ADBE Vector Stroke Color").expression = colorExp;
            else stroke("ADBE Vector Stroke Color").setValue(DuColor.Color.APP_HIGHLIGHT_COLOR.darker(150).floatRGBA());
            stroke("ADBE Vector Stroke Width").setValue(2);
            stroke("ADBE Vector Stroke Line Cap").setValue(2);
            stroke("ADBE Vector Stroke Dashes").addProperty("ADBE Vector Stroke Dash 1");
            stroke("ADBE Vector Stroke Dashes")("ADBE Vector Stroke Dash 1").setValue(5);

            upperLimitGroup.transform.rotation.expression = DuAEExpression.Id.TWO_IK + '\n-effect("' + effect.name + '")(' + swingSftnssIndex + ').value;';
            upperLimitGroup.transform.opacity.expression = [DuAEExpression.Id.TWO_IK,
                'var fx = effect("' + effect.name + '");',
                'if (fx(' + ikIndex + ').value && fx(' + guidesIndex + ').value && fx(' + swingIndex + ').value) 100;',
                'else 0;'
            ].join('\n');

            var lowerLimitGroup = ikSideContent.addProperty("ADBE Vector Group");
            lowerLimitGroup.name = "Lower Limit";
            var lowerLimitContent = lowerLimitGroup.property("ADBE Vectors Group");

            shape = lowerLimitContent.addProperty("ADBE Vector Shape - Group");
            shape('ADBE Vector Shape').expression = [DuAEExpression.Id.TWO_IK,
                'var fx = effect("' + effect.name + '");',
                'var layer1 = null;',
                'var result = [[0,0]];',
                'if (fx(' + ikIndex + ').value && fx(' + guidesIndex + ').value && fx(' + swingIndex + ').value)',
                '{',
                '	try{ layer1 = fx(' + uLayerIndex + '); }catch (e) {}',
                '	if ( layer1 != null)',
                '	{',
                '		var l = layer1.toWorld( layer1.anchorPoint );',
                '		l = fromWorld(l);',
                '		l = length(l) * .5;',
                '		result = [[l,0],[0,0]];',
                '	}',
                '}',
                'createPath(result,[],[],false);'
            ].join('\n');

            stroke = lowerLimitContent.addProperty("ADBE Vector Graphic - Stroke");
            if (ctrlEffect) stroke("ADBE Vector Stroke Color").expression = colorExp;
            else stroke("ADBE Vector Stroke Color").setValue(DuColor.Color.APP_HIGHLIGHT_COLOR.darker(150).floatRGBA());
            stroke("ADBE Vector Stroke Width").setValue(2);
            stroke("ADBE Vector Stroke Line Cap").setValue(2);
            stroke("ADBE Vector Stroke Dashes").addProperty("ADBE Vector Stroke Dash 1");
            stroke("ADBE Vector Stroke Dashes")("ADBE Vector Stroke Dash 1").setValue(5);

            lowerLimitGroup.transform.rotation.expression = DuAEExpression.Id.TWO_IK + '\neffect("' + effect.name + '")(' + swingSftnssIndex + ').value;';
            lowerLimitGroup.transform.opacity.expression = [DuAEExpression.Id.TWO_IK,
                'var fx = effect("' + effect.name + '");',
                'if (fx(' + ikIndex + ').value && fx(' + guidesIndex + ').value && fx(' + swingIndex + ').value) 100;',
                'else 0;'
            ].join('\n');

            var angleGroup = ikSideContent.addProperty("ADBE Vector Group");
            angleGroup.name = "Lower Limit";
            var angleContent = angleGroup.property("ADBE Vectors Group");

            shape = angleContent.addProperty("ADBE Vector Shape - Group");
            shape('ADBE Vector Shape').expression = [DuAEExpression.Id.TWO_IK,
                'var fx = effect("' + effect.name + '");',
                'var layer1 = null;',
                'var result = [[0,0]];',
                'if (fx(' + ikIndex + ').value && fx(' + guidesIndex + ').value && fx(' + swingIndex + ').value)',
                '{',
                '	try{ layer1 = fx(' + uLayerIndex + '); }catch (e) {}',
                '	if ( layer1 != null)',
                '	{',
                '		var l = layer1.toWorld( layer1.anchorPoint );',
                '		l = fromWorld(l);',
                '		l = length(l) * .8;',
                '		result = [[l,0],[0,0]];',
                '	}',
                '}',
                'createPath(result,[],[],false);'
            ].join('\n');

            stroke = angleContent.addProperty("ADBE Vector Graphic - Stroke");
            if (ctrlEffect) stroke("ADBE Vector Stroke Color").expression = colorExp;
            else stroke("ADBE Vector Stroke Color").setValue(DuColor.Color.APP_HIGHLIGHT_COLOR.darker(150).floatRGBA());
            stroke("ADBE Vector Stroke Width").setValue(2);
            stroke("ADBE Vector Stroke Line Cap").setValue(2);

            angleGroup.transform.opacity.expression = [DuAEExpression.Id.TWO_IK,
                'var fx = effect("' + effect.name + '");',
                'if (fx(' + ikIndex + ').value && fx(' + guidesIndex + ').value && fx(' + swingIndex + ').value) 100;',
                'else 0;'
            ].join('\n');

            ikSideGroup.transform.position.expression = [DuAEExpression.Id.TWO_IK,
                'var fx = effect("' + effect.name + '");',
                'var layer1 = null;',
                'var result = value;',
                'if (fx(' + ikIndex + ').value && fx(' + guidesIndex + ').value && fx(' + swingIndex + ').value)',
                '{',
                '	try{ layer1 = fx(' + uLayerIndex + '); }catch (e) {}',
                '	if ( layer1 != null)',
                '	{',
                '		var l = layer1.toWorld( layer1.anchorPoint );',
                '		result = fromWorld( l );',
                '	}',
                '}',
                'result;'
            ].join('\n');

            ikSideGroup.transform.rotation.expression = [DuAEExpression.Id.TWO_IK,
                'var fx = effect("' + effect.name + '");',
                'var layer1 = null;',
                'var result = value;',
                '',
                DuAEExpression.Library.get(['getOrientation']),
                '',
                'if (fx(' + ikIndex + ').value && fx(' + guidesIndex + ').value && fx(' + swingIndex + ').value)',
                '{',
                '	try{ layer1 = fx(' + uLayerIndex + '); }catch (e) {}',
                '	if (layer1 != null)',
                '	{',
                '       if ( layer1.hasParent ) result = getOrientation( layer1.parent );',
                '		result += fx(' + swingLimitIndex + ').value;',
                '   }',
                '}',
                'result;'
            ].join('\n');
        }

        //close controller details
        controller.selected = true;
        DuAE.executeCommand(DuAE.MenuCommandID.REVEAL_EXPRESSION_ERRORS, true);
    }

    //setup layers
    var layer1Data = layer1('ADBE Effect Parade').addProperty('ADBE Layer Control');
    layer1Data.name = DuAELayer.newUniqueEffectName( i18n._("IK"), layer1 );
    layer1Data(1).setValue(controller.index);

    var l1rot = new DuAEProperty( layer1.transform.rotation );
    l1rot.setExpression( [DuAEExpression.Id.TWO_IK,
        '// Upper Bone',
        'var fx = null;',
        'var result = value;',
        DuAEExpression.Library.get(['dishineritRotation']),
        'try { fx = effect("' + layer1Data.name + '")(1).effect("' + effect.name + '"); } catch(e) {}',
        'if (fx && fx.active) {',
        '   result = dishineritRotation() - value;',
        '	result += fx(' + uAngleIndex + ').value;',
        '}',
        'result;'
	].join('\n') );

    var layer2Data = layer2('ADBE Effect Parade').addProperty('ADBE Layer Control');
    layer2Data.name = DuAELayer.newUniqueEffectName( i18n._("IK"), layer2 );
    layer2Data(1).setValue(controller.index);

    var l2rot = new DuAEProperty( layer2.transform.rotation );
    l2rot.setExpression( [DuAEExpression.Id.TWO_IK,
        '// Lower Bone',
        'var fx = null;',
        'var result = value;',
        'try { fx = effect("' + layer2Data.name + '")(1).effect("' + effect.name + '"); } catch(e) {}',
        'if (fx && fx.active) {',
        '	result += fx(' + lAngleIndex + ').value;',
        '}',
        'result;'
	].join('\n') );

    var l2pos = new DuAEProperty( layer2.transform.position );
    l2pos.setExpression( [DuAEExpression.Id.TWO_IK,
        '// Lower Bone',
        'var fx = null;',
        'var result = value;',
        'try { fx = effect("' + layer2Data.name + '")(1).effect("' + effect.name + '"); } catch(e) {}',
        'if (fx && fx.active) result += fx(' + lRelativeStretchedIndex + ').value;',
        'result;'
	].join('\n') );

    if (goal != null) {
        var goalData = goal('ADBE Effect Parade').addProperty('ADBE Layer Control');
        goalData.name = DuAELayer.newUniqueEffectName( i18n._("IK"), goal );
        goalData(1).setValue(controller.index);

        var rotExpr = [DuAEExpression.Id.TWO_IK,
            '// Goal',
            'var fx = null;',
            'var result = value;',
            'try { fx = effect("' + goalData.name + '")(1).effect("' + effect.name + '"); } catch(e) {}',
            'if (fx && fx.active) {',
            '	result += fx(' + gAngleIndex + ').value;',
            '}',
            'result;'
        ].join('\n');

        var rotProp = new DuAEProperty(goal.transform.rotation);
        rotProp.setExpression(rotExpr);

        var gpos = new DuAEProperty(goal.transform.position);
        gpos.setExpression( [DuAEExpression.Id.TWO_IK,
            '// Goal',
            'var fx = null;',
            'var result = value;',
            'try { fx = effect("' + goalData.name + '")(1).effect("' + effect.name + '"); } catch(e) {}',
            'if (fx && fx.active) result += fx(' + fkGoalPosIndex + ').value;',
            'result;'
	    ].join('\n') );

        if (lockGoal) goal.locked = true;
    }

    return controller;
}

/**
 * Creates a 1+2-layer-ik on the layer
 * @param {Layer} layer1 - The root layer
 * @param {Layer} layer2 - The middle layer
 * @param {Layer} layer3 - The end layer
 * @param {Layer|null} [goal] - The goal layer, at the end of the IK
 * @param {Layer|null} [controller] - The layer to use as a controller, can be automatically created.<br />
 * Must be provided if goal is undefined
 * @param {Boolean} [showGuides=true] - Set to false to hide guides on the controllers (and improve performance)
 * @return {Layer} The controller created
 */
Duik.Constraint.oneTwoLayerIK = function(layer1, layer2, layer3, goal, controller, showGuides) {
    controller = Duik.Constraint.twoLayerIK(layer2, layer3, goal, controller, showGuides);
    Duik.Constraint.oneLayerIK(layer1, goal, controller, showGuides);
    var pe = Duik.PseudoEffect.ONE_LAYER_IK;
    controller.effect(pe.matchName)(pe.props["Weight"].index).setValue(50);
    controller.effect(pe.matchName)(pe.props["Limits"]["Softness"].index).setValue(160);
    return controller;
}

/**
 * Creates a 1+2-layer-ik on the layer
 * @param {Layer} layer1 - The root layer
 * @param {Layer} layer2 - The middle layer
 * @param {Layer} layer3 - The end layer
 * @param {Layer|null} [goal] - The goal layer, at the end of the IK
 * @param {Layer|null} [controller] - The layer to use as a controller, can be automatically created.<br />
 * Must be provided if goal is undefined
 * @param {Boolean} [showGuides=true] - Set to false to hide guides on the controllers (and improve performance)
 * @return {Layer} The controller created
 */
Duik.Constraint.twoOneLayerIK = function(layer1, layer2, layer3, goal, controller, showGuides) {
    var comp = layer1.containingComp;
    goal = def(goal, null);
    controller = def(controller, null);
    if (controller == null && goal == null) throw "You must provide either a goal layer or a controller";
    // Null for the IK
    var n = DuAEComp.addNull(comp, 20);
    if (typeof goal !== 'undefined') Duik.Layer.copyAttributes(n, goal, Duik.Layer.Type.IK);
    else Duik.Layer.copyAttributes(n, layer3, Duik.Layer.Type.IK);
    // Move it to the third layer
    layer3.parent = null;
    n.transform.position.setValue(layer3.transform.position.value);
    n.moveBefore(layer3);
    layer3.parent = layer2;
    // Create a 2-layer IK
    Duik.Constraint.twoLayerIK(layer1, layer2, undefined, n, showGuides);
    // Create a 1-layer IK
    // Create controller
   if (controller == null) {
        controller = Duik.Controller.create(comp, Duik.Controller.Type.TRANSFORM, goal);
    }
    Duik.Constraint.oneLayerIK(layer3, goal, controller, showGuides);
    // Move the 2-layer effect to the controller
    var pe = Duik.PseudoEffect.TWO_LAYER_IK;
    var newEffect = pe.apply(controller);
    var oldEffect = n.effect(pe.matchName);
    if (oldEffect) {
        var oldEffectProp = new DuAEProperty(oldEffect);
        // Set side
        var sideIndex = pe.props["Side"].index;
        newEffect(sideIndex).setValue(oldEffect(sideIndex).value);
        oldEffectProp.linkProperties(newEffect, true);
    }
    // fix goal
    if (goal) {
        var goalAngleEffect = controller('ADBE Effect Parade').addProperty('ADBE Angle Control');
        goalAngleEffect.name = i18n._("Tip angle");
        var ikEffect = controller.effect(Duik.PseudoEffect.ONE_LAYER_IK.matchName);
        var layerEffect = DuAELayer.lastEffect(goal, 'ADBE Layer Control');

        var rotProp = new DuAEProperty(goal.transform.rotation);
        rotProp.setExpression([DuAEExpression.Id.TWO_ONE_IK,
            'var ctrl = null;',
            'var result = value;',
            'try { ctrl = effect("' + layerEffect.name + '")(1); } catch (e){ value };',
            'if (ctrl != null)',
            '{',
            '   var goal = ctrl.effect("' + ikEffect.name + '")(1).value;',
            '   if (goal)',
            '   {',
            '       result -= ctrl.rotation.value;',
            '       result += ctrl.effect("' + goalAngleEffect.name + '")(1).value;',
            '   }',
            '}',
            'result;'
        ].join('\n'));
    }
    //parent
    n.parent = controller;
    //hide & lock
    n.enabled = false;
    n.locked = true;

    return controller;
}

/**
 * Creates a bezier ik on the layers
 * @param {Layer[]|DuList} layers - The layers, ordered from root to end
 * @param {Layer|null} [goal] - The goal layer, at the end of the IK
 * @param {Layer|null} [controller] - The layer to use as controller, can be automatically created.<br />
 * Must be provided if goal is undefined.
 * @param {Boolean} [showGuides=true] - Set to false to hide guides on the controllers (and improve performance)
 * @return {Layer[]} The controllers [curve,end,root]
 */
Duik.Constraint.bezierIK = function(layers, goal, controller, showGuides) {
    goal = def(goal, null);
    controller = def(controller, null);
    if (controller == null && goal == null) throw "You must provide either a goal layer or a controller";

    showGuides = def(showGuides, true);
    if (!showGuides) showGuides = false;

    DuAE.beginUndoGroup( i18n._("B\u00e9zier IK"), false);

    layers = new DuList(layers);

    if (layers.length() == 0) return [];
    //layers = new DuList( DuAELayer.sortByParent(layers) );
    var comp = layers.first().containingComp;

    //create controllers
    if (controller == null) {
        controller = Duik.Controller.create(comp, Duik.Controller.Type.TRANSFORM, goal);
        goal.parent = null;
        controller.transform.rotation.setValue(goal.transform.rotation.value);
    }

    // Keep the original position
    var controllerPosition = controller.transform.position.value;

    if (goal != null) goal.parent = controller;

    // Align all layers

    // Unparent children (will be reparented at the end)
    layers.do(function(layer) {
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

    // Parent them together to ease the alignment
    // And keep original positions and rotations to restore them later
    var originalPositions = [];
    var originalRotations = [];
    for(var i = 1, ni = layers.length(); i < ni; i++) {
        var layer = layers.at(i);
        layer.parent = null;
        originalPositions.push( layer.transform.position.value );
        originalRotations.push( layer.transform.rotation.value );
        layer.parent = layers.at(i-1);
    }
    // and the controller
    var ctrlRot = controller.transform.rotation.value;    
    controller.parent = layers.last();
    // Align
    for(var i = 1, ni = layers.length(); i < ni; i++) {
        // Get the angle
        var l = layers.at(i);
        var a = layers.at(i-1);
        var b = null;
        if (i != layers.length() -1) b = layers.at(i+1);
        else b = controller;
        var angle = 180 - DuAELayer.angleFromLayers(l, a, b);
        var currentRotation = l.transform.rotation.value;
        l.transform.rotation.setValue( currentRotation + angle );
    }
    // Unparent
    controller.parent = null;
    // Reset controller rotation
    controller.transform.rotation.setValue(ctrlRot);

    //add effect
    var name = Duik.Layer.name(layers.first());
    var pe = Duik.PseudoEffect.BEZIER_IK;
    var effect = pe.apply(controller, i18n._("IK") + ' | ' + name);

    var limbName = Duik.Layer.name(layers.first());

    //create curve controller
    // It has to be a shape
    var ctrlMode = OCO.config.get('after effects/controller layer type', Duik.Controller.LayerMode.SHAPE);
    if (ctrlMode == Duik.Controller.LayerMode.NULL || ctrlMode == Duik.Controller.LayerMode.RASTER)
        OCO.config.set('after effects/controller layer type', Duik.Controller.LayerMode.SHAPE);
    var curveController = Duik.Controller.create(comp, Duik.Controller.Type.POSITION, goal);
    OCO.config.set('after effects/controller layer type', ctrlMode);
    curveController.transform.scale.expression = '';
    curveController.name = curveController.name + "_Curve";
    Duik.Layer.setName(limbName + '_Curve', curveController);
    Duik.Controller.setSize(50, curveController);

    //create root controller
    var rootController = Duik.Controller.create(comp, Duik.Controller.Type.POSITION, layers.first());
    rootController.name = rootController.name + "_Root";
    Duik.Layer.setName(limbName + '_Root', rootController);
    Duik.Controller.setSize(50, rootController);

    //add effect
    var cPe = Duik.PseudoEffect.BEZIER_IK_CURVE;
    var curveEffect = cPe.apply(curveController);
    curveEffect(cPe.props["Controllers"]["Root"].index).setValue(rootController.index);
    curveEffect(cPe.props["Controllers"]["Curve"].index).setValue(curveController.index);
    curveEffect(cPe.props["Controllers"]["End"].index).setValue(controller.index);
    curveEffect(cPe.props["Draw guides"].index).setValue(showGuides ? 1 : 0);

    //useful positions
    var endPosition = DuAELayer.getWorldPos(controller);
    if (goal != null) endPosition = DuAELayer.getWorldPos(goal);
    var rootPosition = DuAELayer.getWorldPos(layers.first());
    curveController.transform.position.setValue((endPosition + rootPosition) / 2);
    var cOutPosition = (2 * endPosition + rootPosition) / 3;
    var cInPosition = (endPosition + 2 * rootPosition) / 3;

    //add handles
    var handleInGroup = curveController("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
    handleInGroup.name = 'Handle In';
    handleInContent = handleInGroup.property("ADBE Vectors Group");
    var circle = handleInContent.addProperty("ADBE Vector Shape - Ellipse");
    circle("ADBE Vector Ellipse Size").setValue([25, 25]);
    var fill = handleInContent.addProperty("ADBE Vector Graphic - Fill");

    var ctrlPe = Duik.PseudoEffect.CONTROLLER;

    var ctrlEffect = curveController.effect(ctrlPe.matchName);
    var iconColorIndex = ctrlPe.props["Icon"]["Color"].index;
    var iconSizeIndex = ctrlPe.props["Icon"]["Size"].index;

    if (ctrlEffect) fill("ADBE Vector Fill Color").expression = DuAEExpression.Id.CONTROLLER + '\neffect("' + ctrlEffect.name + '")(' + iconColorIndex + ')-[0.2,0.2,0.2,0]\n';
    else fill("ADBE Vector Fill Color").setValue(DuColor.Color.APP_HIGHLIGHT_COLOR.darker(150).floatRGBA());
    if (ctrlEffect) handleInGroup.transform.scale.expression = DuAEExpression.Id.CONTROLLER + '\n[effect("' + ctrlEffect.name + '")(' + iconSizeIndex + '),effect("' + ctrlEffect.name + '")(' + iconSizeIndex + ')]';

    handleInGroup.transform.position.expression = [DuAEExpression.Id.BEZIER_IK,
        'var fx = effect("' + curveEffect.name + '");',
        'var root = null;',
        'var curve = thisLayer;',
        'var result = value;',
        'try { root = fx(' + cPe.props["Controllers"]["Root"].index + ') ;} catch(e){}',
        'if (root != null)',
        '{',
        '   var rootPos = root.toWorld(root.anchorPoint);',
        '   rootPos = fromWorld(rootPos);',
        '   result += rootPos/2;',
        '}',
        'result;'
    ].join('\n');
    //Auto handle position disabled as it messes up the order of the evaluation of the expressions
    //DuAEF.DuAE.Property.removeExpression(handleInGroup.transform.position);

    handleInGroup.transform.opacity.expression = DuAEExpression.Id.BEZIER_IK + '\nvar fx = effect("' + curveEffect.name + '");\n' +
        'fx(' + cPe.props["Show handles"].index + ').value * 100;';

    var handleOutGroup = curveController("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
    handleOutGroup.name = 'Handle Out';
    handleOutContent = handleOutGroup.property("ADBE Vectors Group");
    var circle = handleOutContent.addProperty("ADBE Vector Shape - Ellipse");
    circle("ADBE Vector Ellipse Size").setValue([25, 25]);
    var fill = handleOutContent.addProperty("ADBE Vector Graphic - Fill");
    if (ctrlEffect) fill("ADBE Vector Fill Color").expression = DuAEExpression.Id.CONTROLLER + '\neffect("' + ctrlEffect.name + '")(' + iconColorIndex + ')-[0.2,0.2,0.2,0]\n';
    else fill("ADBE Vector Fill Color").setValue(DuColor.Color.APP_HIGHLIGHT_COLOR.darker(150).floatRGBA());
    if (ctrlEffect) handleOutGroup.transform.scale.expression = DuAEExpression.Id.CONTROLLER + '\n[effect("' + ctrlEffect.name + '")(' + iconSizeIndex + '),effect("' + ctrlEffect.name + '")(' + iconSizeIndex + ')]';

    handleOutGroup.transform.position.expression = [DuAEExpression.Id.BEZIER_IK,
        'var fx = effect("' + curveEffect.name + '");',
        'var end = null;',
        'var curve = thisLayer;',
        'var result = value;',
        'try { end = fx(' + cPe.props["Controllers"]["End"].index + '); } catch(e){}',
        'if (end != null)',
        '{',
        '   var endPos = end.toWorld(end.anchorPoint);',
        '   endPos = fromWorld(endPos);',
        '   result += endPos/2;',
        '}',
        'result;'
    ].join('\n');
    //Auto handle position disabled as it mess up the order of the evaluation of the expressions
    //DuAEF.DuAE.Property.removeExpression(handleOutGroup.transform.position);

    handleOutGroup.transform.opacity.expression = DuAEExpression.Id.BEZIER_IK + '\nvar fx = effect("' + curveEffect.name + '");\n' +
        'fx(' + cPe.props["Show handles"].index + ').value * 100;';

    //add line
    if (DuAE.version.version >= 15) {
        var lineGroup = curveController("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
        lineGroup.name = 'IK Line';
        var lineContent = lineGroup.property("ADBE Vectors Group");
        var shape = lineContent.addProperty("ADBE Vector Shape - Group");
        shape('ADBE Vector Shape').expression = [DuAEExpression.Id.BEZIER_IK,
            'var fx = effect("' + curveEffect.name + '");',
            'var root = null;',
            'var curve = thisLayer;',
            'var end = null;',
            'var result = [[0,0]];',
            'if (fx(' + cPe.props["Draw guides"].index + ').value)',
            '{',
            '   try { root = fx(' + cPe.props["Controllers"]["Root"].index + '); end = fx(' + cPe.props["Controllers"]["End"].index + ') } catch(e){}',
            '   if (root != null)',
            '   {',
            '       var r = root.toWorld(root.anchorPoint);',
            '       r = fromWorld(r);',
            '       var e = end.toWorld(end.anchorPoint);',
            '       e = fromWorld(e);',
            '       var t1 = content("Handle In").transform.position;',
            '       var t2 = content("Handle Out").transform.position;',
            '       result = [r,t1,t2,e];',
            '   }',
            '}',
            'createPath(result,[],[],false);'
        ].join('\n');

        var stroke = lineContent.addProperty("ADBE Vector Graphic - Stroke");
        if (ctrlEffect) stroke("ADBE Vector Stroke Color").expression = DuAEExpression.Id.CONTROLLER + '\neffect("' + ctrlEffect.name + '")(' + iconColorIndex + ')-[0.2,0.2,0.2,0]\n';
        else stroke("ADBE Vector Stroke Color").setValue(DuColor.Color.APP_HIGHLIGHT_COLOR.darker(150).floatRGBA());
        stroke("ADBE Vector Stroke Width").setValue(2);
        stroke("ADBE Vector Stroke Line Cap").setValue(2);
        stroke("ADBE Vector Stroke Dashes").addProperty("ADBE Vector Stroke Dash 1");
        stroke("ADBE Vector Stroke Dashes")("ADBE Vector Stroke Dash 1").setValue(5);
    }

    //close controller details
    curveController.selected = true;
    DuAE.executeCommand(DuAE.MenuCommandID.REVEAL_EXPRESSION_ERRORS, true);

    //setup layers
    var rootIndex = rootController.index;
    var endIndex = controller.index;
    var curveIndex = curveController.index;
    var totalLength = DuMath.length(rootPosition, cInPosition) + DuMath.length(cOutPosition, cInPosition) + DuMath.length(cOutPosition, endPosition);

    //un-parent
    for (var i = 0, n = layers.length(); i < n; i++) {
        layers.at(i).parent = null;
    }

    layers.first().parent = rootController;

    var lPe = Duik.PseudoEffect.BEZIER_IK_LAYER;

    for (var i = 0, n = layers.length(); i < n; i++) {
        var layer = layers.at(i);
        //add effect
        var layerEffect = lPe.apply(layer);
        layerEffect(lPe.props["Layers"]["Root"].index).setValue(rootIndex);
        layerEffect(lPe.props["Layers"]["Curve"].index).setValue(curveIndex);
        layerEffect(lPe.props["Layers"]["End"].index).setValue(endIndex);
        if (i < layers.length() - 1) layerEffect(lPe.props["Layers"]["Next"].index).setValue(layers.at(i + 1).index);
        else layerEffect(lPe.props["Layers"]["Next"].index).setValue(controller.index);

        //expressions

        //position
        if (i != 0) {
            var index = DuMath.length(endPosition, layer.transform.position.value);
            index = index / totalLength;
            var expression = [DuAEExpression.Id.BEZIER_IK,
                'var end = null;',
                'var root = null;',
                'var curve = null;',
                'var result = value;',
                'var thisFx = effect("' + layerEffect.name + '");',
                'try { end = thisFx(' + lPe.props["Layers"]["End"].index + '); curve = thisFx(' + lPe.props["Layers"]["Curve"].index + '); root = thisFx(' + lPe.props["Layers"]["Root"].index + '); }catch (e) {};',
                'if ( root != null && thisFx.active )',
                '{',
                '   var ind = ' + index + ';',
                '   var fx = end.effect("' + effect.name + '");',
                '   var offset = thisFx(' + lPe.props["Offset"].index + ')/100;',
                '   var generalOffset = fx(' + pe.props["Offset"].index + ')/100;',
                '   var endPosition = end.toComp(end.anchorPoint);',
                '   var rootPosition = root.toComp(root.anchorPoint);',
                '   var curvePosition1 = curve.toComp(curve.content("Handle Out").transform.position);',
                '   var curvePosition2 = curve.toComp(curve.content("Handle In").transform.position);',
                '   var t = ind + generalOffset + offset;',
                '   var c = 3*(curvePosition1 - endPosition);',
                '   var b = 3*(curvePosition2 - curvePosition1) - c;',
                '   var a = rootPosition - endPosition - c - b;',
                '   result += ((a*t +b )*t + c)*t + endPosition ;',
                '}',
                'else',
                '{',
                '   result += ' + originalPositions[i-1].toSource() + ';',
                '}',
                'result;'
            ].join('\n');

            var posProp = new DuAEProperty(layer.transform.position);
            posProp.setValue([0,0]);
            posProp.setExpression(expression, false);
        }

        //rotation
        var expr = [DuAEExpression.Id.BEZIER_IK,
            'var c = null;',
            'var result = value;',
            'var thisFx = effect("' + layerEffect.name + '");',
            'try{ c = thisFx(' + lPe.props["Layers"]["End"].index + ') }catch (e) {}',
            'if ( c != null && thisFx.active )',
            '{',
            '   var n = c;',
            '   try { n = thisFx(' + lPe.props["Layers"]["Next"].index + '); if (n.index == index) n = c; } catch (e) {}',
            '   var fx = c.effect("' + effect.name + '");',
            '   var autoOrient = fx(' + pe.props["Auto orient"].index + ').value;',
            '   var C = n.toWorld(n.anchorPoint);',
            '   var O =  thisLayer.toWorld(thisLayer.anchorPoint);',
            '   var vec = O-C;',
            '   var angle = Math.atan2(vec[1], vec[0]);',
            '   var ik = radiansToDegrees(angle);',
            '   if (autoOrient==1) result += ik;'
        ].join('\n');

        if (i == 0) {
            expr += 'var layer = thisLayer;\n' +
                'while(layer.hasParent)\n' +
                '{\n' +
                'layer = layer.parent;\n' +
                'result -= layer.transform.rotation;\n' +
                '}\n';
        }
        expr += '}\n' +
            'result;';

        var rotProp = new DuAEProperty(layer.transform.rotation);
        rotProp.setExpression(expr);
    }

    // Move back the controller to its original position
    // And adjust the curve controller
    var controllerOffset = controller.transform.position.value - controllerPosition;
    controller.transform.position.setValue(controllerPosition);
    curveController.transform.position.setValue(
        curveController.transform.position.value + controllerOffset / 3
    );

    // Restore the position and rotation
    for (var i = layers.length() - 1; i > 0; i--) {
        var layer = layers.at(i);
        var newPosition = layer.transform.position.value;
        var originalPosition = originalPositions[i-1];
        if (newPosition != originalPosition) {
            var offset = newPosition - originalPosition;
            layer.transform.position.setValue( layer.transform.position.valueAtTime(comp.time, true) - offset );
        }
        var newRotation = layer.transform.rotation.value;
        var originalRotation = originalRotations[i-1];
        if (newRotation != originalRotation) {
            var offset = newRotation - originalRotation;
            layer.transform.rotation.setValue( layer.transform.rotation.valueAtTime(comp.time, true) - offset );
        }
    }

    // Re-parent children
    layers.do(function(layer)
    {
        // Reparent children
        for (var i = 0, ni = layer.children.length; i < ni; i++)
        {
            var child = layer.children[i];
            // Only if it's not one of the bones
            var ok = true;
            for (var j = 0, nj = layers.length(); j < nj; j++)
            {
                if (child.index == layers.at(j).index )
                {
                    ok = false;
                    break;
                }
            }
            if (!ok) continue;
            layer.children[i].parent = layer;
            child.locked = child.wasLocked;
        }
    });

    curveController.selected = false;
    controller.moveBefore(curveController);

    // lock curve rotation
    DuAEProperty.lock(curveController.transform.rotation);

    DuAE.endUndoGroup( i18n._("B\u00e9zier IK"));

    return [curveController, controller, rootController];
    //*/
}

/**
 * Creates a bezier fk on the layers
 * @param {Layer[]|DuList.<Layer>} layers - The layers, ordered from root to end
 * @param {Layer|null} [goal] - The goal layer, at the end of the IK
 * @param {Layer|null} [controller] - The layer to use as controller, can be automatically created.<br />
 * Must be provided if goal is undefined.
 * @param {Boolean} [showGuides=true] - Set to false to hide guides on the controllers (and improve performance)
 * @param {Layer|null} [rootController] - The layer to use as root controller, can be automatically created.
 * @return {Layer[]} The controllers [curve,end,root,rootpos, rootrot]
 */
Duik.Constraint.bezierFK = function(layers, goal, controller, showGuides, rootController) {

    goal = def(goal, null);
    controller = def(controller, null);
    rootController = def(rootController, null);
    if (controller == null && goal == null) throw "You must provide either a goal layer or a controller";

    showGuides = def(showGuides, 1);
    if (!showGuides) showGuides = 0;

    DuAE.beginUndoGroup( i18n._("B\u00e9zier FK"), false);

    // Create the underlying bezier IK
    var ctrls = Duik.Constraint.bezierIK(layers, goal, controller, showGuides);

    layers = new DuList(layers);
    var comp = layers.first().containingComp;

    // Add null for the rotation
    var rotNull = DuAEComp.addNull(comp, 25, ctrls[2]);
    Duik.Layer.copyAttributes(rotNull, ctrls[2]);
    Duik.Layer.setName( i18n._("Spine") + '_RootRot', rotNull );
    Duik.Layer.setType( Duik.Layer.Type.NULL, rotNull );

    // Create new Root controller
    if (!rootController) rootController = Duik.Controller.create(comp, Duik.Controller.Type.TRANSFORM, ctrls[2]);

    ctrls[2].parent = rootController;
    ctrls[0].parent = rotNull;
    ctrls[1].parent = rootController;
    rotNull.parent = rootController;

    // Rig the root
    var autoCurveEffect = ctrls[1].property('ADBE Effect Parade').addProperty('ADBE Slider Control');
    autoCurveEffect.name = i18n._("Auto-curve");
    autoCurveEffect(1).setValue(100);
    rotNull.transform.rotation.expression = [DuAEExpression.Id.BEZIER_IK,
        'var ctrlLayer = thisComp.layer("' + ctrls[1].name + '");',
        'var rootLayer = thisComp.layer("' + rootController.name + '");',
        'var autoCurve = ctrlLayer.effect("' + autoCurveEffect.name + '")(1).value;',
        'autoCurve /= 100;',
        'autoCurve = autoCurve;',
        'var result = value;',
        '',
        DuAEExpression.Library.get([
            'dishineritRotation'
        ]),
        '',
        'var curve = - rootLayer.transform.rotation.value/2 - ctrlLayer.transform.rotation.value / 2;',
        'curve *= autoCurve;',
        'result += curve;',
        'result;'
    ].join('\n');

    ctrls[2].moveAfter(ctrls[0]);
    rotNull.moveAfter(ctrls[0]);
    rootController.moveAfter(ctrls[0]);

    ctrls[2].enabled = false;
    ctrls[2].locked = true;
    rotNull.enabled = false;
    rotNull.locked = true;

    DuAE.endUndoGroup( i18n._("B\u00e9zier FK"));

    return [ctrls[0], ctrls[1], rootController, ctrls[2], rotNull];
}

Duik.CmdLib['Constraint']["FK"] = "Duik.Constraint.fk()";
/**
 * Creates a FK with auto-overlapping and its controller on the layers.
 * @param {Layer[]|DuList.<Layer>} [layers] - The layers, already parented or ordered from root (at index 0) to end
 * @param {Layer} [controller] - An already existing controller.
 * @return {Layer} The controller of the FK.
 */
Duik.Constraint.fk = function(layers, controller) {
    controller = def(controller, null);
    layers = def(layers, DuAEComp.unselectLayers());
    layers = new DuList(layers);

    DuAE.beginUndoGroup( i18n._("FK"), false);

    var comp = layers.first().containingComp;

    //check if there is a controller in the selection
    if (controller == null) {
        for (var i = 0, num = layers.length(); i < num; i++) {
            var l = layers.at(i);
            if (Duik.Layer.isType(l, Duik.Layer.Type.CONTROLLER)) {
                controller = l;
                layers.remove(i);
                break;
            }
        }
    }

    //sort layers and parent them
    var layers = DuAELayer.sortByParent(layers);
    layers = new DuList(layers);
    //reset rotation and scale if structures
    layers.do(Duik.Bone.resetTransform);
    DuAELayer.parentChain(layers);

    //Create controller
    if (controller == null) {
        controller = Duik.Controller.create(comp, Duik.Controller.Type.ROTATION, layers.first());
    }

    var pe = Duik.PseudoEffect.FK;

    var name = Duik.Layer.name(layers.first());
    var fkEffect = pe.apply(controller);
    fkEffect(pe.props["Limits"]["Lower"].index).setValue(-180);
    fkEffect(pe.props["Flexibility"].index).setValue(100);
    fkEffect(pe.props["Resistance"].index).setValue(10);
    var fkEffectName = fkEffect.name;

    //rig layers
    var prevMAName = "";
    layers.do(function(layer) {
        //add Data
        var layerData = layer('ADBE Effect Parade').addProperty('ADBE Layer Control');
        layerData.name = i18n._("FK");
        layerData(1).setValue(controller.index);
        var layerDataName = layerData.name;

        //add FK control
        var fkControl = controller('ADBE Effect Parade').addProperty('ADBE Angle Control');
        fkControl.name = DuAELayer.newUniqueEffectName( i18n._("FK") + ' | ' + Duik.Layer.name(layer), controller);

        //add expression and move away for the stretch
        if (layers.current == 0) {
            layer.transform.rotation.expression = [DuAEExpression.Id.FK,
                'var controller = null;',
                'var result = value;',
                'try { controller = effect("' + layerDataName + '")(1); } catch (e) {}',
                'if ( controller !=null )',
                '{',
                '   var fx = controller.effect("' + fkEffectName + '");',
                '   result += controller.transform.rotation.value + fx(' + pe.props["Curve"].index + ').value;',
                '   var follow = fx(' + pe.props["Parent rotation"].index + ').value;',
                '   var p = thisLayer;',
                '   if (!follow)',
                '   {',
                '       while(p.hasParent)',
                '       {',
                '           p = p.parent;',
                '           result -= p.rotation.value;',
                '       }',
                '   }',
                '   var fk = controller.effect("' + fkControl.name + '")(1).value;',
                '   result += fk;',
                '}',
                'result;'
            ].join('\n');
        } else if (layers.current == 1) {
            layer.transform.rotation.expression = [DuAEExpression.Id.FK,
                'var controller = null;',
                'var result = value;',
                'try { controller=effect("' + layerDataName + '")(1); } catch (e) {}',
                'if (controller !=null && hasParent)',
                '{',
                '   var fx = controller.effect("' + fkEffectName + '");',
                '   var ctrlRot = controller.transform.rotation;',
                '   var delay = fx(' + pe.props["Resistance"].index + ').value;',
                '   var amp = fx(' + pe.props["Flexibility"].index + ').value;',
                '   var uLimit = fx(' + pe.props["Limits"]["Upper"].index + ').value;',
                '   var lLimit = fx(' + pe.props["Limits"]["Lower"].index + ').value;',
                '   var manual = fx(' + pe.props["Curve"].index + ').value;',
                '   var follow = fx(' + pe.props["Parent rotation"].index + ').value;',
                '   delay = delay / 100;',
                '   amp = amp / 100 ;',
                '   result = ctrlRot.valueAtTime(time-delay) + fx(' + pe.props["Curve"].index + ').valueAtTime(time-delay);',
                '   if (follow && hasParent)',
                '   {',
                '       var cP = parent;',
                '       while(cP.hasParent)',
                '       {',
                '           cP = cP.parent;',
                '           if (cP.index = controller.index) follow = false;',
                '           result -= cP.rotation.value - cP.rotation.valueAtTime(time-delay);',
                '       }',
                '   }',
                '   result = result - ctrlRot.value ;',
                '   result = result * amp;',
                '   result = result - ctrlRot.velocityAtTime(time-delay/2)*(delay/5);',
                '   if (result > uLimit) result = uLimit;',
                '   if (result < lLimit) result = lLimit;',
                '   result = result + value + manual;',
                '   if (follow) result -= parent.transform.rotation.valueAtTime(0);',
                '   var fk = controller.effect("' + fkControl.name + '")(1).value;',
                '   result += fk;',
                '}',
                'result;'
            ].join('\n');

            Duik.Automation.moveAway(layer);
            // Get the effect and set it
            var maEffect = layer.effect( layer.property('ADBE Effect Parade').numProperties );
            prevMAName = maEffect.name;
            maEffect(1).expression = [DuAEExpression.Id.FK,
                'var controller = null;',
                'var result = value;',
                'try { controller=effect("' + layerDataName + '")(1); } catch (e) {}',
                'if (controller !=null )',
                '{',
                '   var fx = controller.effect("' + fkEffectName + '");',
                '   result += fx(' + pe.props["Stretch"].index + ').value;',
                '}',
                'result;'
            ].join('\n');
        } else {
            layer.transform.rotation.expression = [DuAEExpression.Id.FK,
                'var controller = null;',
                'var result = value;',
                'try { controller=effect("' + layerDataName + '")(1); }catch (e) {}',
                'if (controller !=null && hasParent)',
                '{',
                '   var fx = controller.effect("' + fkEffectName + '");',
                '   var ctrlRot = controller.transform.rotation;',
                '   var parentRot = parent.transform.rotation ;',
                '   var delay = fx(' + pe.props["Resistance"].index + ').value;',
                '   var amp = fx(' + pe.props["Flexibility"].index + ').value;',
                '   var uLimit = fx(' + pe.props["Limits"]["Upper"].index + ').value;',
                '   var lLimit = fx(' + pe.props["Limits"]["Lower"].index + ').value;',
                '   var manual = fx(' + pe.props["Curve"].index + ').value;',
                '   delay = delay / 100;',
                '   amp = amp / 100 ;',
                '   result = parentRot.valueAtTime(time-delay);',
                '   result = result * amp;',
                '   if (result > uLimit) result = uLimit;',
                '   if (result < lLimit) result = lLimit;',
                '   result = result + value + manual - parent.transform.rotation.valueAtTime(0);',
                '   var fk = controller.effect("' + fkControl.name + '")(1).value;',
                '   result += fk;',
                '}',
                'result;'
            ].join('\n');

            Duik.Automation.moveAway(layer);
            // Get the effect and set it
            var maEffect = layer.effect( layer.property('ADBE Effect Parade').numProperties );
            maEffect(1).expression = [DuAEExpression.Id.FK,
                'var controller = null;',
                'var result = value;',
                'try { controller=effect("' + layerDataName + '")(1); } catch (e) {}',
                'if (controller !=null && hasParent)',
                '{',
                '   var fx = controller.effect("' + fkEffectName + '");',
                '   var delay = fx(' + pe.props["Resistance"].index + ').value;',
                '   delay = delay / 100;',
                '   var maEffect = parent.effect("' + prevMAName + '");',
                '   var ma = maEffect(1);',
                '   result += ma.valueAtTime(time-delay);',
                '}',
                'result;'
            ].join('\n');
            prevMAName = maEffect.name;
        }
    });

    controller.selected = true;

    DuAE.endUndoGroup( i18n._("FK"));

    return controller;
}

Duik.CmdLib['Constraint']["Auto Parent"] = "Duik.Constraint.autoParent()";
Duik.CmdLib['Constraint']["Auto Parent Orphans"] = "Duik.Constraint.autoParent( true )";
Duik.CmdLib['Constraint']["Auto by Selection"] = "Duik.Constraint.autoParent( false, undefined, true )";
/**
 * Auto-Parent. Parent selected layers to the last selected one.
 * @param {Boolean} [orphansOnly=false] - When true, parent only the orphans to the last selected layers
 * @param {Layer[]|DuList.<Layer>} [layers] - The layers
 * @param {Boolean} [selectionOrder=false] - When true, parent in the order of the selection, from ancestor to child
 */
Duik.Constraint.autoParent = function(orphansOnly, layers, selectionOrder) {
    orphansOnly = def(orphansOnly, false);
    selectionOrder = def(selectionOrder, false);

    layers = def(layers, DuAEComp.getSelectedLayers());
    layers = new DuList(layers);

    DuAE.beginUndoGroup( i18n._("Auto-parent"), false);

    if (selectionOrder) DuAELayer.parentChain(layers);
    else DuAELayer.parent(layers, undefined, orphansOnly, undefined);

    DuAE.endUndoGroup( i18n._("Auto-parent"));
}

Duik.CmdLib['Constraint']["Parent"] = "Duik.Constraint.parent()";
/**
 * Parent Constraint
 * @param {Layer[]|DuList.<Layer>} [layers] - The layers
 */
Duik.Constraint.parent = function(layers) {
    layers = def(layers, DuAEComp.unselectLayers());
    layers = new DuList(layers);

    DuAE.beginUndoGroup( i18n._("Parent constraint"), false);

    var pe = Duik.PseudoEffect.PARENT;
    var p = pe.props;

    layers.do(function(layer) {
        var effect = pe.apply(layer);

        var posExpr = [DuAEExpression.Id.PARENT_CONSTRAINT,
            DuAEExpression.Library.get(['translatePointWithLayer', 'checkDuikEffect', 'getNextKey']),
            'var result = thisLayer.position.valueAtTime( 0 );',
            'for ( var i = 1; i <= thisLayer( "Effects" ).numProperties; i++ ) {',
            '  ',
            '		var fx = effect( i );',
            '		if (!fx.active) continue;',
            '		if ( !checkDuikEffect(fx, "DUIK parentConstraint") ) continue;',
            '		if ( !fx(' + p['Inheritance']['Position'].index + ').value ) continue;',
            '		var parentLayer = null;',
            '		try {',
            '			parentLayer = fx(' + p['Layer'].index + ');',
            '		} catch ( e ) {',
            '			continue;',
            '		}',
            '		if ( !parentLayer ) continue;',
            '    if ( parentLayer.index == index ) continue;',
            '		',
            '		var cT = 0;',
            '		var mbPrecision = fx(10).value;',
            '		var step = framesToTime(1)/mbPrecision;',
            '		',
            '		while ( cT < time ) {',
            '        var nextT = cT + step;',
            '        ',
            '        var roundedFrame = Math.round( timeToFrames(nextT) );',
            '        var roundedTime = roundedFrame * thisComp.frameDuration;',
            '        if (nextT - roundedTime < 0.0001) nextT = roundedTime;',
            '        ',
            '        var wP = fx(' + p['Weight'].index + ');',
            '        var nK = wP.numKeys;',
            '        if (nK < 2) nextT = time;',
            '        else if (wP.key(1).time > time) nextT = time;',
            '        else if (wP.key(1).time > nextT) nextT = wP.key(1).time + .001;',
            '        else if (wP.key(nK).time < nextT) nextT = time;',
            '        // if the velocity is zero (keyframes on hold), jump to the next keyframe',
            '        else if (wP.velocityAtTime(nextT) == 0) {',
            '            var k = getNextKey(nextT, wP);',
            '            if (k && k.time > time) nextT = time;',
            '            else if (k) nextT = k.time + .001;',
            '        }',
            '',
            '        var weight = wP.valueAtTime( cT ) / 100;',
            '        //result = [weight, weight]*100;',
            '        if ( weight != 0 )',
            '            result += translatePointWithLayer( parentLayer, result, cT, nextT ) * weight;',
            '',
            '        if (i == 1) result += valueAtTime( nextT ) - valueAtTime( cT );',
            '',
            '        cT = nextT;',
            '    }',
            '}',
            'result;'
        ].join('\n');

        if (layer.position.dimensionsSeparated) {
            layer.transform.xPosition.expression = posExpr + '\nresult[0];';

            layer.transform.yPosition.expression = posExpr + '\nresult[1];';
            if (layer.threeDLayer) layer.transform.zPosition.expression = posExpr + '\nresult[2];';
        } else {
            layer.position.expression = posExpr;
        }

        var rotExpression = [DuAEExpression.Id.PARENT_CONSTRAINT,
            DuAEExpression.Library.get(['getOrientationAtTime', 'checkDuikEffect', 'getNextKey']),
            'var result = value;',
            'for ( var i = 1; i <= thisLayer( "Effects" ).numProperties; i++ ) {',
            '    var fx = effect( i );',
            '    if (!fx.active) continue;',
            '    if ( !checkDuikEffect(fx, "DUIK parentConstraint") ) continue;',
            '    if ( !fx(' + p['Inheritance']['Rotation'].index + ').value ) continue;',
            '    var l = null;',
            '    try {',
            '        l = fx(' + p['Layer'].index + ');',
            '    } catch ( e ) {',
            '        continue;',
            '    }',
            '    if ( !l ) continue;',
            '    if ( l.index == index ) continue;',
            '    ',
            '    var cT = 0;',
            '    var mbPrecision = fx(' + p['Motion Blur Precision'].index + ').value;',
            '    var step = framesToTime(1) / mbPrecision;',
            '	 while ( cT < time ) {',
            '        var nextT = cT + step;',
            '        ',
            '        var roundedFrame = Math.round( timeToFrames(nextT) );',
            '        var roundedTime = roundedFrame * thisComp.frameDuration;',
            '        if (nextT - roundedTime < 0.0001) nextT = roundedTime;',
            '        ',
            '        var wP = fx(' + p['Weight'].index + ');',
            '        var nK = wP.numKeys;',
            '        if (nK < 2) nextT = time;',
            '        else if (wP.key(1).time > time) nextT = time;',
            '        else if (wP.key(1).time > nextT) nextT = wP.key(1).time + .001;',
            '        else if (wP.key(nK).time < nextT) nextT = time;',
            '        // if the velocity is zero (keyframes on hold), jump to the next keyframe',
            '        else if (wP.velocityAtTime(nextT) == 0) {',
            '            var k = getNextKey(nextT, wP);',
            '            if (k && k.time > time) nextT = time;',
            '            else if (k) nextT = k.time + .001;',
            '        }',
            '',
            '        var weight = wP.valueAtTime( cT ) / 100;',
            '        if ( weight != 0 ) {',
            '            var P = getOrientationAtTime(l, nextT);',
            '             var oP = getOrientationAtTime(l, cT);',
            '             result += (P - oP) * weight;',
            '        }',
            '',
            '        cT = nextT;',
            '    }',
            '}',
            '',
            'result;'
        ].join('\n');

        layer.rotation.expression = rotExpression

        if (layer.parent != null) {
            var comp = layer.containingComp;
            var time = comp.time;
            comp.time = 0;
            var parent = layer.parent;
            layer.parent = null;
            effect(p['Layer'].index).setValue(parent.index);
            comp.time = time;
        }
    });

    DuAEComp.selectLayers(layers);

    DuAE.endUndoGroup( i18n._("Parent constraint"));
}

Duik.CmdLib['Constraint']["Locator"] = "Duik.Constraint.locator()";
/**
 * Add Locator
 * @param {Layer[]|DuList.<Layer>} [layers] - The layers
 */
Duik.Constraint.locator = function(layers) {
    layers = def(layers, DuAEComp.getSelectedLayers());
    layers = new DuList(layers);

    DuAE.beginUndoGroup( i18n._("Locator"), false);

    if (layers.length() > 0) layers.do(Duik.Constraint.createLocator);
    else Duik.Constraint.createLocator();

    DuAE.endUndoGroup( i18n._("Locator"));
}

/**
 * Creates a new locator linked to the layer
 * @param {Layer|CompItem} [layerOrComp] The layer or the containing comp
 * @returns {ShapeLayer} The locator
 */
Duik.Constraint.createLocator = function(layerOrComp) {
    return DuAELayer.createLocator( layerOrComp );
}

Duik.CmdLib['Constraint']["Extract Locators"] = "Duik.Constraint.extractLocators()";
/**
 * Extract Locators
 * @param {Boolean} [useEssentialProperties] - whether to use essential properties instead of expressions to extract the controllers. True by default if Ae >= 17.0
 * @param {Layer[]|DuList.<Layer>} [precompLayers] - The layers
 */
Duik.Constraint.extractLocators = function(useEssentialProperties, precompLayers) {
    precompLayers = def(precompLayers, DuAEComp.getSelectedLayers());
    precompLayers = new DuList(precompLayers);
    if (precompLayers.length() == 0) return;

    DuAE.beginUndoGroup( i18n._("Extract locators"), false);

    precompLayers.do(function(precompLayer) {
        var preComp = precompLayer.source;
        if (!preComp instanceof CompItem) return;

        //get locators in precomp
        var preCompLocs = Duik.Layer.get(Duik.Layer.Type.LOCATOR, false, preComp);

        var it = new DuList(preCompLocs);
        it.do(function(preCompLoc) {
            Duik.Constraint.extractLocator(preCompLoc, precompLayer, useEssentialProperties);
        });
    });

    DuAE.endUndoGroup( i18n._("Extract locators"));
}

/**
 * Extracts one locator from a precomposition
 * @param {ShapeLayer} locator - The locator to extract
 * @param {AVLayer} preCompLayer - The precomposition layer
 * @param {Boolean} [useEssentialProperties=true] - true to extract using master properties instead of expressions (ignored in Ae < 15.1, false by default if 15.1 <= Ae < 17 and true by default in Ae >= 17)
 * @return {ShapeLayer} The extracted locator
 */
Duik.Constraint.extractLocator = function(locator, preCompLayer, useEssentialProperties) {
    if (DuAE.version.version < 15.1) useEssentialProperties = false;
    if (DuAE.version.version < 17.0) useEssentialProperties = def(useEssentialProperties, false);
    else useEssentialProperties = def(useEssentialProperties, true);

    var comp = preCompLayer.containingComp;
    //comp names
    DuAEComp.setUniqueCompName(comp);
    DuAEComp.setUniqueCompName(locator.containingComp);

    //apply locator values to workaround all kind of bugs
    locator.transform.anchorPoint.setValue(locator.transform.anchorPoint.valueAtTime(0, false));
    locator.transform.position.setValue(locator.transform.position.valueAtTime(0, false));
    locator.transform.scale.setValue(locator.transform.scale.valueAtTime(0, false));
    locator.transform.rotation.setValue(locator.transform.rotation.valueAtTime(0, false));
    locator.transform.opacity.setValue(locator.transform.opacity.valueAtTime(0, false));

    //create a null in the comp
    var loc = DuAEComp.addNull(comp);
    loc.moveToEnd();
    Duik.Layer.setAttributes(loc, Duik.Layer.Type.LOCATOR, i18n._("Locator"));
    loc.parent = preCompLayer;

    var trProp = new DuAEProperty(locator.transform);

    if (useEssentialProperties) {
        trProp.addToEGP();
        // get essential properties
        var mps = DuAEProperty.getProps(preCompLayer('ADBE Layer Overrides'), PropertyType.PROPERTY);
        var it = new DuList(mps);
        //links
        it.do(function(mp) {
            var newProp = null;

            //get prop name
            var nameArray = mp.name.split(' / ');
            if (nameArray.length != 2) return;
            var pLink = nameArray[1];
            var layerName = nameArray[0];
            if (layerName != locator.name) return;

            try {
                newProp = eval('loc' + pLink);
            } catch (e) {
                return;
            }

            //link
            if (newProp) {
                var p = new DuAEProperty(newProp);
                p.pickWhip(mp, true);
            }
        });
    } else {
        new DuAEProperty(loc.transform).linkProperties(locator.transform);
    }
    return loc;
}

/**
 * Sets the current values of the locators. This fixes some bugs when unparenting layers parented to the locators.
 * @param {Layer|LayerCollection|Layer[]|DuList.<Layer>} [layers=DuAEComp.getSelectedLayers()] The layer(s). If omitted, will use all selected layers in the comp
 * @param {boolean} [disable=true] - whether to disable the expressions after having applied the values
 */
Duik.Constraint.applyLocatorValues = function(layers, disable) {
    layers = def(layer, DuAEComp.getSelectedLayers());
    layers = new DuList(layers);
    if (layers.length() == 0) return;

    disable = def(disable, true);

    for (var i = 0, n = layers.length(); i < n; i++) {
        var layer = layers.at(i);

        if (!Duik.Layer.isType(layer, Duik.Layer.Type.LOCATOR)) continue;

        var l = locator.locked;
        locator.locked = false;
        var p = new DuAEProperty(locator.transform.anchorPoint);
        p.setValue(locator.transform.anchorPoint.valueAtTime(0, false), 0);
        var p = new DuAEProperty(locator.transform.position);
        p.setValue(locator.transform.position.valueAtTime(0, false), 0);
        var p = new DuAEProperty(locator.transform.scale);
        p.setValue(locator.transform.scale.valueAtTime(0, false), 0);
        var p = new DuAEProperty(locator.transform.rotation);
        p.setValue(locator.transform.rotation.valueAtTime(0, false), 0);
        var p = new DuAEProperty(locator.transform.opacity);
        p.setValue(locator.transform.opacity.valueAtTime(0, false), 0);
        if (disable) Duik.Constraint.disableLocator(locator);
        locator.locked = l;
    }
}

/**
 * Disables the locator. Disable the transform expressions
 * @param {Layer|LayerCollection|Layer[]|DuList.<Layer>} [layers=DuAEComp.getSelectedLayers()] The layer(s). If omitted, will use all selected layers in the comp
 * @param {boolean} [disable=true]
 */
Duik.Constraint.disableLocator = function(layers, disable) {
    layers = def(layer, DuAEComp.getSelectedLayers());
    layers = new DuList(layers);
    if (layers.length() == 0) return;

    disable = def(disable, true);

    for (var i = 0, n = layers.length(); i < n; i++) {
        var layer = layers.at(i);

        if (!Duik.Layer.isType(layer, Duik.Layer.Type.LOCATOR)) continue;

        var l = locator.locked;
        locator.locked = false;
        locator.transform.anchorPoint.expressionEnabled = !disable;
        locator.transform.position.expressionEnabled = !disable;
        locator.transform.scale.expressionEnabled = !disable;
        locator.transform.rotation.expressionEnabled = !disable;
        locator.transform.opacity.expressionEnabled = !disable;
        locator.locked = l;
    }
}

/**
 * Parent the layers across compositions to the chosen layer
 * @param {Layer} parent The parent layer
 * @param {Boolean} [useEssentialProperties=true] - true to extract using master properties instead of expressions (ignored in Ae < 15.1, false by default if 15.1 <= Ae < 17 and true by default in Ae >= 17)
 * @param {Layer[]|DuList.<Layer>} [children] - The child layers
 */
Duik.Constraint.parentAcrossComp = function(parent, useEssentialProperties, children) {
    children = def(children, DuAEComp.getSelectedLayers());
    children = new DuList(children);

    DuAE.beginUndoGroup( i18n._("Parent across comps"), false);

    var parentComp = parent.containingComp;

    //create the parent locator
    var locator = Duik.Constraint.createLocator(parent);
    //the children locators
    var childLocators = [];

    new DuList(children).do(function(child) {
        var childComp = child.containingComp;

        //check if there already is a child locator
        var childLocator = null;
        for (var i = 0, num = childLocators.length; i < num; i++) {
            if (childLocators[i].containingComp.id == childComp.id) {
                childLocator = childLocators[i];
                break;
            }
        }

        //if precomp
        var precomps = DuAEComp.getPrecomps(childComp);
        var precompList = new DuList(precomps);

        if (precompList.indexOf(parentComp) >= 0) {
            //select the first precomp layer
            var precompLayer;
            for (var i = 1, num = childComp.numLayers; i <= num; i++) {
                var l = childComp.layer(i);
                if (l.source) {
                    if (l.source.id == parentComp.id) {
                        precompLayer = l;
                        break;
                    }
                }
            }

            //create the child Locator
            if (!childLocator) {
                //create a locator and extract it
                var childLocator = Duik.Constraint.extractLocator(locator, precompLayer, useEssentialProperties);
                childLocator.selected = false;
                childLocator.enabled = false;
                childLocator.shy = true;
                childLocator.locked = true;
                childLocators.push(childLocator);
            }
            var locked = child.locked;
            child.locked = false;
            child.parent = childLocator;
            child.locked = locked;
            child.selected = true;

            return;
        }

        //if parent comp
        var parentComps = DuAEComp.getParentComps(childComp);
        var parentCompList = new DuList(parentComps);
        if (parentCompList.indexOf(parentComp) >= 0) {
            //select the first precomp layer
            var precompLayer;
            for (var i = 1, num = parentComp.numLayers; i <= num; i++) {
                var l = parentComp.layer(i);
                if (l.source == childComp) {
                    precompLayer = l;
                    break;
                }
            }

            locator.parent = precompLayer;

            //create the child Locator
            if (!childLocator) {
                //create a null in the comp
                var childLocator = DuAEComp.addNull(childComp);
                childLocator.moveToEnd();
                Duik.Layer.copyAttributes(childLocator, locator, Duik.Layer.Type.LOCATOR);
                var ctr = new DuAEProperty(childLocator.transform);
                ctr.linkProperties(locator.transform, undefined, precompLayer);
                //lock and hide
                childLocator.selected = false;
                childLocator.enabled = false;
                childLocator.shy = true;
                childLocator.locked = true;
                childLocators.push(childLocator);
            }

            child.parent = childLocator;
            child.selected = true;

            return;
        }

    });

    //lock and hide
    locator.selected = false;
    locator.enabled = false;
    locator.locked = true;
    locator.shy = true;
    parent.selected = true;

    DuAE.endUndoGroup( i18n._("Parent across comps"));
}

Duik.CmdLib['Constraint']["Position"] = "Duik.Constraint.position()";
/**
 * Adds a position constraint to the layers
 * @param {Layer|Layer[]|DuList.<Layer>} [layers] - The layers
 * @return {Property[]} The effects added on the layers to control the constraint.
 */
Duik.Constraint.position = function(layers) {
    layers = def(layers, DuAEComp.unselectLayers());
    layers = new DuList(layers);

    DuAE.beginUndoGroup( i18n._("Position constraint"), false);

    var pe = Duik.PseudoEffect.POSITION;
    var effects = [];

    layers.do(function(layer) {
        var effect = pe.apply(layer);
        effects.push(effect);
        var p = pe.props;
        effect(p['Weight'].index).setValue(0);

        layer.position.expression = [DuAEExpression.Id.POSITION_CONSTRAINT,
            DuAEExpression.Library.get(['checkDuikEffect']),
            'var result = value;',
            'for ( var i = 1; i <= thisLayer( "Effects" ).numProperties; i++ ) {',
            '    var fx = effect( i );',
            '    if ( !checkDuikEffect(fx, "DUIK positionConstraint") ) continue;',
            '    var l = null;',
            '    try {',
            '        l = fx( ' + p['Constraint to'].index + ' );',
            '    } catch ( e ) {}',
            '    if ( l ) {',
            '        var cp = l.toWorld( l.anchorPoint );',
            '        if ( thisLayer.hasParent ) cp = thisLayer.parent.fromWorld( cp );',
            '        cp0 = l.toWorld( l.anchorPoint, 0 );',
            '        if ( thisLayer.hasParent ) cp0 = thisLayer.parent.fromWorld( cp0 );',
            '        cp -= cp0;',
            '        result += cp * ( fx( ' + p['Weight'].index + ' ).value / 100 );',
            '    }',
            '}',
            'result;',
            ''
        ].join('\n');

    });

    DuAEComp.selectLayers(layers);

    DuAE.endUndoGroup( i18n._("Position constraint"));

    return effects;
}

Duik.CmdLib['Constraint']["Orientation"] = "Duik.Constraint.orientation()";
/**
 * Adds an orientation constraint to the layers
 * @param {Layer|Layer[]|DuList.<Layer>} [layers] - The layers
 * @return {Property[]} The effects added on the layers to control the constraint.
 */
Duik.Constraint.orientation = function(layers) {
    layers = def(layers, DuAEComp.unselectLayers());
    layers = new DuList(layers);

    DuAE.beginUndoGroup( i18n._("Orientation constraint"), false);

    var pe = Duik.PseudoEffect.ORIENTATION;
    
    var effects = [];

    layers.do(function(layer) {
        var effect = pe.apply(layer);
        effects.push(effect);
        var p = pe.props;

        layer.rotation.expression = [DuAEExpression.Id.ORIENTATION_CONSTRAINT,
            DuAEExpression.Library.get(['sign', 'getOrientation', 'dishineritRotation', 'checkDuikEffect']),
            'var result = dishineritRotation( thisLayer );',
            'for ( var i = 1; i <= thisLayer( "Effects" ).numProperties; i++ ) {',
            '    var fx = effect( i );',
            '    if ( !checkDuikEffect(fx, "DUIK orientationConstraint") ) continue;',
            '    var l = null;',
            '    try {',
            '        l = fx(' + p['Constraint to'].index + ');',
            '    } catch ( e ) {}',
            '    if ( l ) result += getOrientation( l ) * ( fx(' + p['Weight'].index + ').value / 100 );',
            '}',
            'result;',
            ''
        ].join('\n');

    });

    DuAEComp.selectLayers(layers);

    DuAE.endUndoGroup( i18n._("Orientation constraint"));

    return effects;
}

Duik.CmdLib['Constraint']["Constraint"] = "Duik.Constraint.constraint()";
/**
 * Description
 * @param {PropertyBase|DuAEProperty} [path] - The path, taken from the layer selection if omitted
 * @param {Layer[]|DuList.<Layer>} [layers] - The layers
 * @param {boolean} [moveToPath=false] - Set to true to move the layer to the first point on the path
 * @returns {Boolean} true if a constraint could be created
 */
Duik.Constraint.path = function(path, layers, moveToPath) {

    moveToPath = def(moveToPath, false);
    layers = def(layers, DuAEComp.unselectLayers());
    layers = new DuList(layers);

    if (typeof path === 'undefined' && layers.length() < 2) return false;

    if (typeof path === 'undefined') {
        var pathLayer = layers.pop();
        var pathProps = DuAELayer.getSelectedProps(pathLayer, PropertyValueType.SHAPE)
        if (pathProps.length == 0) return false;
        path = pathProps.pop();
    }

    // Prepare the path
    path = new DuAEProperty(path);
    path = path.pathProperty();
    if (!path) return;

    DuAE.beginUndoGroup( i18n._("Path constraint"), false);

    var l = path.layer;
    var pathExpr = path.expressionLink(true);

    var pe = Duik.PseudoEffect.PATH;
    var p = pe.props;

    // Get the position of the path (let's take the first group into account)
    var pathPosition = [0,0,0];
    if (path.matchName == 'ADBE Vector Shape') {
        // Get the containing group
        var matrix = DuAEShapeLayer.getTransformMatrix(path, false);
        pathPosition = matrix.applyToPoint(pathPosition);
    }

    layers.do(function(layer) {

        var effect = pe.apply(layer);
        
        var expr = [DuAEExpression.Id.PATH_CONSTRAINT,
            'var fx = effect("' + effect.name + '");',
            'var l = thisComp.layer("' + l.name + '");',
            'var p = ' + pathExpr + ';',
            'var percent = fx(' + p['Percent along path'].index + ').value % 100 / 100;',
            'if (percent == 0) percent = 0.0001;',
            'var pathOffset = fx(' + p['Path Offset'].index + ').value;',
            '// path value',
            'var result = l.toWorld( p.pointOnPath(percent, time ) +  p.normalOnPath(percent, time) * pathOffset );',
            'if (hasParent) result = parent.fromWorld(result);',
            '//layer position',
            'result += value;'
        ].join('\n');

        var posProp = new DuAEProperty(layer.position);
        posProp.setExpression(expr);

        expr = [DuAEExpression.Id.PATH_CONSTRAINT,
            'var fx = effect("' + effect.name + '");\n' +
            'var autoOrient = fx(' + p['Orientation'].index + ').value;\n' +
            'var result = value;\n' +
            'if (autoOrient)\n' +
            '{',
            'var l = thisComp.layer("' + l.name + '");',
            'var p = ' + pathExpr + ';\n' +
            'var percent = fx(' + p['Percent along path'].index + ').value % 100 / 100;\n' +
            'var C = p.tangentOnPath(percent, time);',
            'var angle = Math.atan2(C[1], C[0]);',
            'angle = radiansToDegrees(angle);',
            'angle += l.rotation.value;',
            'result += angle;',
            '}',
            'result;'
        ].join('\n');

        var rotProp = new DuAEProperty(layer.rotation);
        rotProp.setExpression(expr);

        if (moveToPath) {
            DuAELayer.setPosition( layer, pathPosition);
            layer.transform.rotation.setValue(0);
        }
    });

    DuAEComp.selectLayers(layers);

    DuAE.endUndoGroup( i18n._("Path constraint"));
    return true;
}

Duik.CmdLib['Constraint']["Pin"] = "Duik.Constraint.pin()";
Duik.CmdLib['Constraint']["Pin without tangent"] = "Duik.Constraint.pin( false )";
/**
 * Add pins on the properties
 * @param {Boolean} [tangents=true] Set to false to ignore Bézier path tangents
 * @param {PropertyBase[]} [props] The properties to pin
 * @returns {ShapeLayer[]} The pins
 */
Duik.Constraint.pin = function(tangents, props) {
    tangents = def(tangents, true);

    var props = DuAEComp.getSelectedProps();

    DuAE.beginUndoGroup( i18n._("Add Pins"), false);

    //just create a single bone without any prop
    if (props.length == 0) {
        var pin = Duik.Pin.create();
        if (!pin) return;
        pin.selected = true;

        DuAE.endUndoGroup( i18n._("Add Pins"));
        return [pin];
    }

    DuAEProject.setProgressMode(true);

    var pins = [];
    props = new DuList(props);
    props.do(function(prop) {
        pins = pins.concat(Duik.Pin.add(prop, tangents));
    });

    //if nothing was created
    if (pins.length == 0) {
        var layers = DuAEComp.getSelectedLayers();
        layers = new DuList(layers);

        //Try to find puppet pins
        layers.do(function(layer) {
            var ps = DuAELayer.getPuppetPins(layer);
            ps = new DuList(ps);
            ps.do(function(pin) {
                pins.push(Duik.Pin.add(pin, tangents));
            });

        });
    }

    //Try any spatial property
    if (pins.length == 0) {
        props.do(function(prop) {
            pins = pins.concat(Duik.Pin.addPins(prop, tangents));
        });
    }

    DuAEComp.selectLayers(pins);

    DuAEProject.setProgressMode(false);
    DuAE.endUndoGroup( i18n._("Add Pins"));

    return pins;
}

/**
 * A very simple FK control
 * @param {Layer[]|DuList.<Layer>} [layers] - The layers, already parented or ordered from root (at index 0) to end
 * @param {Layer} [controller] - An already existing controller.
 * @return {Layer} The controller of the FK.
 */
Duik.Constraint.simpleFK = function(layers, controller) {
    controller = def(controller, null);
    layers = def(layers, DuAEComp.unselectLayers());
    layers = new DuList(layers);
    layers = DuAELayer.sortByParent(layers);
    var numLayers = layers.length;

    // create controller
    if (controller == null) {
        var l = layers[0];
        controller = Duik.Controller.create(l.containingComp, Duik.Controller.Type.ROTATION, l);
    }

    //add checkbox and data
    var effect = controller.effect.addProperty("ADBE Checkbox Control");
    effect.name = layers[0].name + " Follow";
    var effectName = effect.name;

    for (var i = 0; i < numLayers; i++) {
        var goalData = layers[i].effect.addProperty("ADBE Layer Control");
        goalData.name = "FK Controller";
        var dataName = goalData.name;
        goalData(1).setValue(controller.index);

        var exp = DuAEExpression.Id.SIMPLE_FK + "\n" +
            "var ctrl = null;\n" +
            "var result = value;\n" +
            "try { ctrl = effect(\"" + dataName + "\")(1); } catch (e){};\n" +
            "if (ctrl != null)\n" +
            "{\n" +
            "var goal = ctrl.effect(\"" + effectName + "\")(1).value;\n" +
            "result += ctrl.rotation.value/" + (numLayers / (i + 1)) + ";\n" +
            "if (!goal)\n" +
            "{\n" +
            "var layer = thisLayer;\n" +
            "while (layer.hasParent)\n" +
            "{\n" +
            "layer = layer.parent;\n" +
            "result = result - layer.rotation/" + (numLayers / (i + 1)) + ";\n" +
            "}\n" +
            "}\n" +
            "}\n" +
            "result;";

        var rotProp = new DuAEProperty(layers[i].transform.rotation);
        rotProp.setExpression(exp);
    }
}

Duik.CmdLib['Constraint']["Remove thisComp"] = "Duik.Constraint.removeThisCompInExpressions()";
/**
 * Replace all <code>thisComp</code> occurences by <code>comp("name")</code>.
 * @param {Duik.SelectionMode} [selectionMode=DuAE.SelectionMode.ACTIVE_COMPOSITION] The items where to modify the expressions.
 */
Duik.Constraint.removeThisCompInExpressions = function(selectionMode) {
    selectionMode = def(selectionMode, DuAE.SelectionMode.ACTIVE_COMPOSITION);
    DuAE.beginUndoGroup( i18n._("Remove 'thisComp'"));

    DuAEComp.removeThisCompInExpressions(selectionMode);

    DuAE.endUndoGroup();
}

Duik.CmdLib['Constraint']["Use thisComp"] = "Duik.Constraint.removeCompInExpressions()";
/**
 * Replace all <code>comp("name")</code> occurences by <code>thisComp</code>.
 * @param {Duik.SelectionMode} [selectionMode=DuAE.SelectionMode.ACTIVE_COMPOSITION] The items where to modify the expressions.
 */
Duik.Constraint.removeCompInExpressions = function(selectionMode) {
    selectionMode = def(selectionMode, DuAE.SelectionMode.ACTIVE_COMPOSITION);
    DuAE.beginUndoGroup( i18n._("Use 'thisComp'"));

    DuAEComp.removeCompInExpressions(selectionMode);

    DuAE.endUndoGroup();
}

Duik.CmdLib['Constraint']["Remove thisLayer"] = "Duik.Constraint.removeThisLayerInExpressions()";
/**
 * Replace all <code>thisLayer</code> occurences by <code>layer("name")</code>.
 * @param {Duik.SelectionMode} [selectionMode=DuAE.SelectionMode.ACTIVE_COMPOSITION] The items where to modify the expressions.
 */
Duik.Constraint.removeThisLayerInExpressions = function(selectionMode) {
    selectionMode = def(selectionMode, DuAE.SelectionMode.ACTIVE_COMPOSITION);
    DuAE.beginUndoGroup( i18n._("Remove 'thisComp'"));

    DuAEComp.removeThisLayerInExpressions(selectionMode);

    DuAE.endUndoGroup();
}

Duik.CmdLib['Constraint']["Use thisComp"] = "Duik.Constraint.removeLayerInExpressions()";
/**
 * Replace all <code>layer("name")</code> occurences by <code>thisLayer</code>.
 * @param {Duik.SelectionMode} [selectionMode=DuAE.SelectionMode.ACTIVE_COMPOSITION] The items where to modify the expressions.
 */
Duik.Constraint.removeLayerInExpressions = function(selectionMode) {
    selectionMode = def(selectionMode, DuAE.SelectionMode.ACTIVE_COMPOSITION);
    DuAE.beginUndoGroup( i18n._("Use 'thisComp'"));

    DuAEComp.removeLayerInExpressions(selectionMode);

    DuAE.endUndoGroup();
}

/**
 * Connects the properties to a master property.
 * @param {DuAEProperty[]|DuList.<DuAEProperty>} props - The child properties
 * @param {Property|DuAEProperty} masterProp - The parent property
 * @param {float} [min=0] - The minimum value
 * @param {float} [max=100] - The maximum value
 * @param {DuAE.Axis} [axis=DuAE.Axis.X] - The axis or channel to connect
 * @param {DuAE.Type} [type=DuAE.Type.VALUE] - The type
 * @param {boolean} [toKeyMorph] By default, the connector will detect Key Morphs to adjust the connection on the weight of the selected keys.<br/>
 * When set to true, it will just connect the weight of the selected key morphs (or all of them if not selected).<br/>
 * When false, it does a standard connection even if some key morphs are selected.
 * @return {PropertyGroup} The controlling effect created
 */
Duik.Constraint.connector = function(props, masterProp, min, max, axis, type, toKeyMorph) {
    min = def(min, 0);
    max = def(max, 100);
    axis = def(axis, DuAE.Axis.X);
    type = def(type, DuAE.Type.VALUE);

    var doKeyMorph = -1;
    if (typeof toKeyMorph !== 'undefined') {
        if (toKeyMorph) doKeyMorph = 1;
        else doKeyMorph = 0;
    }

    masterProp = new DuAEProperty(masterProp);

    // Adjust values
    if (isNaN(min)) min = 0;
    if (isNaN(max)) min = 100;

    var dim = masterProp.dimensions();
    if (dim == 4) {
        var bpc = app.project.bitsPerChannel;
        if (bpc == 8) {
            min /= 255;
            max /= 255;
        } else if (bpc == 16) {
            min /= 32768;
            max /= 32768;
        } else if (bpc == 32) {
            if (min < 0) min = 0;
            else if (min > 1) min = 1;
            if (max < 0) max = 0;
            else if (max > 1) max = 1;
        }
    }

    DuAEComp.setUniqueLayerNames(undefined, masterProp.comp);

    // Get layer
    var masterLayer = masterProp.layer;

    // Try to find an already existing effect
    var effect = null;
    var pe = Duik.PseudoEffect.ONED_CONNECTOR;
    if (dim == 2) pe = Duik.PseudoEffect.TWOD_CONNECTOR;
    else if (dim == 3) pe = Duik.PseudoEffect.THREED_CONNECTOR;
    else if (dim == 4) pe = Duik.PseudoEffect.COLOR_CONNECTOR;

    var modeId = pe.props['Connection mode'].index;
    var minId = pe.props['Minimum'].index
    var maxId = pe.props['Maximum'].index;
    var axisId = 4;
    if (dim > 1 && dim < 4) axisId = pe.props['Axis'].index;
    else if (dim == 4) axisId = pe.props['Channel'].index;

    var connectorEffects = DuAEProperty.getProps(masterLayer.property('ADBE Effect Parade'), pe.matchName, true);

    // Check if there is one with the same settings
    for (var i = 0, num = connectorEffects.length; i < num; i++) {
        var e = connectorEffects[i];
        if (e.prop(minId).value() != min) continue;
        if (e.prop(maxId).value() != max) continue;
        if (e.prop(modeId).value() != type) continue;
        if (dim > 1 && dim < 4) {
            if (e.prop(axisId).value() != axis) continue;
        }
        if (dim == 4) {
            if (e.prop(axisId).value() != axis - 3) continue;
        }
        //if all tests passed, this is the one!
        effect = e;
        break;
    }

    // If not found, create and set values
    if (!effect) {
        effect = pe.apply(masterLayer, i18n._("Connector") + ' ' + masterProp.name);
        effect(minId).setValue(min);
        effect(maxId).setValue(max);
        effect(modeId).setValue(type);
        if (dim == 4) effect(axisId).setValue(axis - 3);
        else if (dim > 1) effect(axisId).setValue(axis);
    }

    var peKeyMorph = Duik.PseudoEffect.KEY_MORPH_K;
    function keyMorphProp( prop ) {
        if (prop.matchName == peKeyMorph.matchName) return new DuAEProperty(prop.getProperty().property(4));
        var p = prop.getProperty().parentProperty;
        if (p.matchName == peKeyMorph.matchName) return prop;
        return null;
    }

    // Prepare the expression

    var colorValFn = 	[ 'function getColorVal(col, axis) {',
        '	if (axis == 1) return col[0];',
        '	if (axis == 2) return col[1];',
        '	if (axis == 3) return col[2];',
        '	if (axis == 4) return col[3];',
        '	var c = rgbToHsl(col);',
        '	if (axis == 5) return c[0];',
        '	if (axis == 6) return c[1];',
        '	if (axis == 4) return c[2];',
        '}',
        ''
    ].join('\n');

    var exp = [
        'var ctrlValue = ctrlLayer' + masterProp.expressionLink(false, false) + ';',
        'var ctrlEffect = ctrlLayer.effect("' + effect.name + '");',
        'var ctrlMin = ctrlEffect(' + minId + ').value;',
        'var ctrlMax = ctrlEffect(' + maxId + ').value;',
        'var ctrlType = ctrlEffect(' + modeId + ').value;',
        'var result = value;',
        'if (numKeys >= 2 && ctrlEffect.active)',
        '{',
        'if (ctrlType == 2) ctrlValue = ctrlValue.speed;',
        'else if (ctrlType == 3) ctrlValue = ctrlValue.velocity;',
        'else ctrlValue = ctrlValue.value;'
    ].join('\n');

    if (masterProp.isAngle()) {
        exp += '\nif (ctrlType == 1) ctrlValue = ctrlValue % 360;\n';
    } else if (dim == 2 || dim == 3) {
        exp += '\nif (ctrlType == 1 || ctrlType == 3) {\nvar axis = ctrlEffect(' + axisId + ').value-1;\nctrlValue = ctrlValue[axis];\n}\n'
    } else if (dim == 4) {
        exp += colorValFn +
            'var axis = ctrlEffect(' + axisId + ').value;\n' +
            'ctrlValue = getColorVal(ctrlValue, axis);\n';
    }
    exp += 'var t = 0;\n' +
        'var beginTime = key(1).time;\n' +
        'var endTime = key(numKeys).time;\n' +
        'if (ctrlMin > ctrlMax)\n' +
        '{\n' +
        't = linear(ctrlValue, ctrlMin, ctrlMax, endTime, beginTime);\n' +
        '}\n' +
        'else\n' +
        '{\n' +
        't = linear(ctrlValue, ctrlMin, ctrlMax, beginTime, endTime);\n' +
        '}\n' +
        'result = valueAtTime(t);\n' +
        '}\n' +
    'result;';

    var kmExp1 = [
        '// Connector effect',
        'var ctrlValue = ctrlLayer' + masterProp.expressionLink(false, false) + ';',
        'var ctrlEffect = ctrlLayer.effect("' + effect.name + '");',
        'var ctrlMin = ctrlEffect(' + minId + ').value;',
        'var ctrlMax = ctrlEffect(' + maxId + ').value;',
        '// Key morph values'
    ].join('\n');

    if (masterProp.isDropdown()) kmExp1 += '\nvar isMenu = true;';
    else kmExp1 += '\nvar isMenu = false;';

    var kmExp2 = [
        DuAEExpression.Library.get([
            'getNextKey',
            'getPrevKey'
        ]),
        'function interpolate()',
        '{',
        '  if (!ctrlEffect.active) return 0;',
        '  if (numMorphs == 0) return 0;',
        '',
        '  numMorphs--;',
        '  var pK = getPrevKey(time, ctrlValue);',
        '  var nK = getNextKey(time, ctrlValue);',
        '',
    ].join('\n');

    if (masterProp.isAngle()) {
        kmExp2 += '\nvar cValue = linear(ctrlValue.value % 360, ctrlMin, ctrlMax, 0, numMorphs);\n';
    } else if (dim == 2 || dim == 3) {
        kmExp2 += '\nvar axis = ctrlEffect(' + axisId + ').value-1;\nvar cValue = linear(ctrlValue.value[axis], ctrlMin, ctrlMax, 0, numMorphs);\n';
    } else if (dim == 4) {
        kmExp2 += colorValFn +
            '\nvar axis = ctrlEffect(' + axisId + ').value;\n' +
            'var cValue = getColorVal(ctrlValue.value, axis);\n' +
            'cValue = linear(cValue, ctrlMin, ctrlMax, 0, numMorphs);\n';
    }
    else {
        kmExp2 += '\nvar cValue = linear(ctrlValue.value, ctrlMin, ctrlMax, 0, numMorphs);\n';
    }

    kmExp2 += '  if (!pK || !nK) {\n' +
        '    if (Math.round(cValue) == thisIndex) return 100;\n' +
        '    else return 0;\n' +
        '  }\n' +
        '	var nValue = 0;\n' +
        '	var pValue = 0;\n' +
    '	if(nK) {';

    if (masterProp.isAngle()) {
        kmExp2 += '  nValue = linear(nK.value % 360, ctrlMin, ctrlMax, 0, numMorphs);\n';
    } else if (dim == 2 || dim == 3) {
        kmExp2 += 'nValue = linear(nK.value[axis], ctrlMin, ctrlMax, 0, numMorphs);\n';
    } else if (dim == 4) {
        kmExp2 += colorValFn +
            'nValue = getColorVal(nK.value, axis);\n' +
            'nValue = linear(nValue, ctrlMin, ctrlMax, 0, numMorphs);\n';
    }
    else {
        kmExp2 += '  nValue = linear(nK.value, ctrlMin, ctrlMax, 0, numMorphs);\n';
    }
    
    kmExp2 += '    nValue = Math.round(nValue);\n' +
        '  }\n' +
    '	if(pK) {';

    if (masterProp.isAngle()) {
        kmExp2 += '  pValue = linear(pK.value % 360, ctrlMin, ctrlMax, 0, numMorphs);\n';
    } else if (dim == 2 || dim == 3) {
        kmExp2 += 'pValue = linear(pK.value[axis], ctrlMin, ctrlMax, 0, numMorphs);\n';
    } else if (dim == 4) {
        kmExp2 += colorValFn +
            'pValue = getColorVal(pK.value, axis);\n' +
            'pValue = linear(pValue, ctrlMin, ctrlMax, 0, numMorphs);\n';
    }
    else {
        kmExp2 += '  pValue = linear(pK.value, ctrlMin, ctrlMax, 0, numMorphs);\n';
    }

    kmExp2 += '    pValue = Math.round(pValue);\n' +
        '  }\n' +
        '\n' +
        'if (isMenu) {\n' +
        '    cValue = easeOut(time, pK.time, nK.time, pValue, nValue);\n' +
        '}\n' +
        '\n' +
        '  if (pValue != thisIndex && nValue != thisIndex) return 0;\n' +
        '  if (pValue == nValue) return 100;\n' +
        '\n' +
        '  if (pValue == thisIndex && pValue < nValue)\n' +
        '      return linear( cValue, nValue, pValue, 100, 0 );\n' +
        '  if (pValue == thisIndex && pValue >= nValue)\n' +
        '       return linear( cValue, pValue, nValue, 0, 100 );\n' +
        '  if (pValue < nValue)\n' +
        '      return linear( cValue, pValue, nValue, 0, 100 );\n' +
        '  return linear( cValue, pValue, nValue, 100, 0 );\n' +
        '}\n' +
        '\n' +
        'var result = value + interpolate();\n' +
        '\n' +
    'result;';

    // Count key morphs
    props = new DuList(props);
    var kmProps = new DuList();
    if (doKeyMorph != 0)
        for (var i = props.length()-1; i >= 0; i--)
        {
            var kmP = keyMorphProp(new DuAEProperty(props.at(i)));
            if (kmP) {
                kmProps.pushUnique(undefined, kmP);
                props.remove(i);
            }
        }
    // Try to find key morphs on the layers
    if (doKeyMorph == 1 && kmProps.length() == 0) {
        var kmLayers = new DuList();
        for (var i = props.length()-1; i >= 0; i--)
        {
            var p = new DuAEProperty(props.at(i));
            var l = p.layer;
            if ( kmLayers.contains(l), function(a, b) { return a.index == b.index; } ) continue;
            for (var f = 1, nf = l.property("ADBE Effect Parade").numProperties; f <= nf; f++) {
                var fx = l.property("ADBE Effect Parade").property(f);
                var kmP = keyMorphProp(new DuAEProperty(fx));
                if (kmP) {
                    kmProps.pushUnique(undefined, kmP);
                }
            }
        }
    }

    kmProps.sort(function(a, b) {
        return a.getProperty().parentProperty.propertyIndex - b.getProperty().parentProperty.propertyIndex;
    });

    // Set to the props
    var masterComp = masterLayer.containingComp;
    var comp = 'thisComp.';

    if (doKeyMorph != 1) props.do(function(prop) {
        prop = new DuAEProperty(prop);
        if (!prop.riggable()) return;
        // check if the current comp is the same than the comp containing the masterProperty
        var childComp = prop.comp;
        if (masterComp !== childComp) comp = 'comp("' + masterComp.name + '").';
        else comp = 'thisComp.';
        prop.setExpression(
            DuAEExpression.Id.CONNECTOR + '\n' +
            'var ctrlLayer = ' + comp + 'layer("' + masterLayer.name + '");\n' +
            exp,
            false
        );
        if (prop.matchName == "ADBE Opacity") prop.layer.enabled = true;//*/
    });

    if (doKeyMorph != 0) kmProps.do(function(prop) {
        // check if the current comp is the same than the comp containing the masterProperty
        var childComp = prop.comp;
        if (masterComp !== childComp) comp = 'comp("' + masterComp.name + '").';
        else comp = 'thisComp.';

        prop.setExpression(
            DuAEExpression.Id.CONNECTOR + '\n' +
            'var ctrlLayer = ' + comp + 'layer("' + masterLayer.name + '");\n' +
            kmExp1 +
            '\nvar numMorphs = ' + kmProps.length() + ';\n' + 
            'var thisIndex = ' + kmProps.current + ';\n' + 
            kmExp2,
            false
        );
    });

    return effect;
}

Duik.CmdLib['Constraint']["Connector"] = "Duik.Constraint.quickConnector()";
/**
 * Connects the properties together to a % slider
 * @param {Property[]|DuAEProperty[]} [props] - The properties to connect. The selected properties by default.
 */
Duik.Constraint.quickConnector = function(props) {
    props = def(props, DuAEComp.getSelectedProps());
    if (props.length == 0) return;
    props = new DuList(props);

    DuAE.beginUndoGroup(i18n._("Connector"), false);

    // Create the slider
    var ctrlLayer = props.first().layer;
    var comp = props.first().comp;
    var effect = Duik.PseudoEffect.QUICK_CONNECTOR.apply(ctrlLayer);

    DuAEComp.setUniqueLayerNames(undefined, comp);

    var exp = [ DuAEExpression.Id.CONNECTOR,
        'var ctrlLayer = thisComp.layer("' + ctrlLayer.name + '");',
        'var ctrlEffect = ctrlLayer.effect("' + effect.name + '");',
        'var ctrlValue = ctrlEffect(1);',
        'var ctrlMin = 0;',
        'var ctrlMax = 100;',
        'var result = value;',
        'if (numKeys >= 2 && ctrlEffect.enabled)',
        '{',
        'ctrlValue = ctrlValue.value;',
        'var t = 0;',
        'var beginTime = key(1).time;',
        'var endTime = key(numKeys).time;',
        'if (ctrlMin > ctrlMax)',
        '{',
        't = linear(ctrlValue, ctrlMin, ctrlMax, endTime, beginTime);',
        '}',
        'else',
        '{',
        't = linear(ctrlValue, ctrlMin, ctrlMax, beginTime, endTime);',
        '}',
        'result = valueAtTime(t);',
        '}',
        'result;'
    ].join('\n');

    var firstTime = comp.duration;
    var lastTime = 0;

    props.do(function(prop) {
        prop = new DuAEProperty(prop);
        if (!prop.riggable()) return;
        // Set the expression
        prop.setExpression(exp, false);
        // Get first/last time
        var f = prop.firstKeyTime();
        if (f != null) if (f < firstTime) firstTime = f;
        var l = prop.lastKeyTime();
        if (l != null) if (l > lastTime) lastTime = l;
    });

    // Set default keyframes
    effect(1).setValuesAtTimes([firstTime, lastTime], [0,100]);

    DuAE.endUndoGroup(i18n._("Connector"));
}

/**
 * Connects a dropdown menu effect to a list of layers, using their opacities.<br />
 * Note: On After Effects < 17.0.1, the list is not updated to reflect the list of layers.
 * @param {DuAEProperty|Property} dropdown The dropdown menu property.
 * @param {Layer[]|DuList.<Layer>} [layers] The layers to control. The selected layers by default.
 */
Duik.Constraint.linkLayersToDropdown = function(dropdown, layers) {
    layers = def(layers, DuAEComp.getSelectedLayers());

    dropdown = new DuAEProperty(dropdown);
    var effect = dropdown.parentProperty();

    var masterComp = dropdown.comp;
    var masterLayer = dropdown.layer;

    var updateDropdown = DuAE.version.atLeast('17.0.1');

    layers = new DuList(layers);
    var layerNames = [];
    layers.do(function(layer) {
        // check if the current comp is the same than the comp containing the masterProperty
        var childComp = layer.containingComp;
        var comp;
        if (masterComp !== childComp) comp = 'comp("' + masterComp.name + '").';
        else comp = 'thisComp.';

        var id = layers.current + 1;

        layer.transform.opacity.expression = [DuAEExpression.Id.CONNECTOR,
            'var ctrlLayer = ' + comp + 'layer("' + masterLayer.name + '");\n' +
            'var fx = ctrlLayer.effect("' + effect.name + '");',
            'var result = 0;',
            'if (fx(1).value == ' + id + ') result = value;',
            'result;'
        ].join('\n');

        if (updateDropdown) layerNames.push(layer.name);
    });

    if (updateDropdown) dropdown.setPropertyParameters(layerNames);
}

/**
 * Prepares a visual audio controller to connect to properties
 * @param {AVLayer} [audioLayer] The layer with the audio to setup. The selected layer by default.
 * @return {DuAEProperty} The value to use with the connector
 */
Duik.Constraint.setupAudioController = function(audioLayer) {
    audioLayer = def(audioLayer, DuAEComp.getActiveLayer());
    if (!audioLayer) return;
    if (!audioLayer.hasAudio) return;

    DuAE.beginUndoGroup(i18n._("Audio connector"), false);

    // Duplicate the layer
    audioLayer.duplicate();
    // Precompose
    var comp = audioLayer.containingComp;
    var index = audioLayer.index;
    var acCompName = DuAEProject.newUniqueCompName('AC.' + i18n._("Settings") + '::' + audioLayer.name);
    var acComp = comp.layers.precompose([index], acCompName);
    // Lock and hide the precomp
    var acCompLayer = comp.layer(index);
    acCompLayer.moveToEnd();
    acCompLayer.enabled = false;
    acCompLayer.audioEnabled = false;
    acCompLayer.guideLayer = true;
    acCompLayer.shy = true;

    // Setup the controllers
    audioLayer = acComp.layer(1);

    // Add the spectrum layer
    var spectrumLayer = acComp.layers.addShape();
    Duik.Layer.setAttributes(
        spectrumLayer,
        Duik.Layer.Type.AUDIO,
        i18n._("Audio spectrum"),
        undefined,
        undefined,
        i18n._("Audio spectrum")
        );
    var solidGroup = spectrumLayer("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
    solidGroup.name = 'Solid';
    var solidContent = solidGroup.property("ADBE Vectors Group");
    var solid = solidContent.addProperty("ADBE Vector Shape - Rect");
    solid('ADBE Vector Rect Size').expression = '[thisComp.width, thisComp.height*3];';
    var fill = solidContent.addProperty("ADBE Vector Graphic - Fill");
    fill("ADBE Vector Fill Color").setValue([0,0,0,1]);

    // Add an Ear layer
    var earLayer = Duik.Controller.create(acComp, Duik.Controller.Type.EAR);
    earLayer.transform.position.setValue([acComp.width / 4, acComp.height / 2]);

    // Add the settings layer
    var settingsLayer = Duik.Controller.create(acComp, Duik.Controller.Type.AUDIO);
    Duik.Layer.setGroupName( i18n._("Audio Effector"), settingsLayer);
    // Add effect
    var pe = Duik.PseudoEffect.AUDIO_CONNECTOR;
    var ampId = pe.props['Amplitude'].index;
    var minId = pe.props['Minimum frequency (Hz)'].index;
    var maxId = pe.props['Maximum frequency (Hz)'].index;
    var easeId = pe.props['Ease'].index;
    var timeEaseId = pe.props['Time settings']['Ease (seconds)'].index;
    var offsetId = pe.props['Time settings']['Offset (seconds)'].index;
    var settingsEffect = pe.apply(settingsLayer);

    // Setup the spectrum
    var spectrumEffect = spectrumLayer.property('ADBE Effect Parade').addProperty('ADBE AudSpect');
    spectrumEffect(1).setValue(4); // Audio Layer
    spectrumEffect(2).expression = '[0,thisComp.height]'; // start point
    spectrumEffect(3).expression = '[thisComp.width,thisComp.height]'; // end point
    spectrumEffect(6).expression = 'thisComp.layer("' + settingsLayer.name + '").effect("' + settingsEffect.name + '")(' + minId + ')'; // start freq
    spectrumEffect(7).expression = 'thisComp.layer("' + settingsLayer.name + '").effect("' + settingsEffect.name + '")(' + maxId + ')'; // end freq
    spectrumEffect(9).expression = 'thisComp.height * thisComp.layer("' + settingsLayer.name + '").effect("' + settingsEffect.name + '")(' + ampId + ') / 100;'; // max height
    spectrumEffect(10).expression = '1000*( thisComp.layer("' + settingsLayer.name + '").effect("' + settingsEffect.name + '")(' + timeEaseId + ') + thisComp.frameDuration);'; // audio duration
    spectrumEffect(11).expression = '1000*thisComp.layer("' + settingsLayer.name + '").effect("' + settingsEffect.name + '")(' + offsetId + ');'; // audio offset
    spectrumEffect(12).expression = 'thisComp.width/thisProperty.propertyGroup()(8)+10;'; // thickness
    spectrumEffect(13).setValue(0); // softness
    spectrumEffect(14).setValue([1,1,1,1]); // inside color
    spectrumEffect(15).expression = 'thisProperty.propertyGroup()(14);'; // outside color
    spectrumEffect(23).setValue(1); // composite on original
    var blurEffect = spectrumLayer.property('ADBE Effect Parade').addProperty('ADBE Motion Blur');
    blurEffect(2).expression = 'thisComp.height*thisComp.layer("' + settingsLayer.name + '").effect("' + settingsEffect.name + '")(' + easeId + ')/100'; // blur length
    spectrumLayer.locked = true;

    // Setup the ear
    var earEffect = earLayer.property('ADBE Effect Parade').addProperty('ADBE Slider Control');
    earEffect.name = i18n._("Audio Effector");
    earEffect(1).expression = [ DuAEExpression.Id.AUDIO_EFFECTOR,
        'var spectrumLayer = thisComp.layer("' + spectrumLayer.name + '");',
        'var smpl = spectrumLayer.sampleImage(thisLayer.position);',
        'smpl[0]*100;'
    ].join('\n');

    DuAE.endUndoGroup(i18n._("Audio connector"));

    // OK!
    return new DuAEProperty( earEffect(1) );
}