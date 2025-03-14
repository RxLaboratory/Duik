/**
 * The animator's toolkit.
 * @namespace
 * @category Duik
 */
Duik.Animation = {};

// low-level undocumented list
// The animations which have been copied by Duik.Animation.copy()
if (typeof $.global["DUIK_DATA"].copiedAnimation === 'undefined') $.global["DUIK_DATA"].copiedAnimation = [];

/**
 * The list of animation functions
 * @namespace
 * @memberof Duik.CmdLib
 * @category Duik
 */
Duik.CmdLib['Animation'] = {};

Duik.CmdLib['Animation']["Select Keyframes"] = "Duik.Animation.selectKeyframes()";
/**
 * Selects the keyframes in the comp
 * @param {CompItem} [comp=DuAEProject.getActiveComp] The composition
 * @param {Boolean} [selectedLayers=false] Set to true to get the keyframes only on the selected layers instead of all the layers.
 * @param {Boolean} [controllersOnly=true] Set to false to get the keyframes from all types of layers instead of just the controllers.
 * @param {Number[]} [range] The time range to select the keyframes, [in, out]. If omitted, will use the work area of the composition.
 * @param {string[]|DuList} [propertyMatchNames=[]] The list of matchnames to select only keyframes of a specific type. If empty, will select all types of keyframes.
 */
Duik.Animation.selectKeyframes = function( comp, selectedLayers, controllersOnly, range, propertyMatchNames )
{
    comp = def(comp, DuAEProject.getActiveComp() );
    if(!comp) return;
    selectedLayers = def( selectedLayers, false );
    controllersOnly = def( controllersOnly, true );
    range = def( range, [comp.workAreaStart, comp.workAreaStart + comp.workAreaDuration ] );
    propertyMatchNames = def( propertyMatchNames, [
        'ADBE Position',
        'ADBE Vector Position',
        'ADBE Position_0',
        'ADBE Position_1',
        'ADBE Position_2',
        'ADBE Rotate Z',
        'ADBE Rotate Y',
        'ADBE Rotate X',
        'ADBE Orientation',
        'ADBE Vector Rotation',
        'ADBE Scale',
        'ADBE Vector Scale',
        'ADBE Opacity',
        'ADBE Vector Group Opacity',
        'ADBE Mask Parade',
        'ADBE Effect Parade'
    ]);
    var propertyMatchNameList = new DuList(propertyMatchNames);

    DuAE.beginUndoGroup( i18n._("Select Keyframes"), false);
    DuAEProject.setProgressMode(true);

    //get layers
    var layers;
    if ( !selectedLayers )
    {
        if ( !controllersOnly ) layers = comp.layers;
        else layers = Duik.Controller.get( false, comp );
    }
    else
    {
        if ( !controllersOnly ) layers = comp.selectedLayers;
        else layers = Duik.Controller.get( true, comp );
    }

    if (layers.length == 0)
    {
        DuAEProject.setProgressMode(false);
        DuAE.endUndoGroup( i18n._("Select Keyframes"));
        return;
    }

    //unselect all previously selected keyframes
	DuAEComp.unselectProperties();

    // A filter to get properties
    function filterProps( prop )
    {
        if ( propertyMatchNameList.length() == 0) return true;
        return propertyMatchNameList.indexOf( prop.matchName ) >= 0;
    }

    //get all properties
    layers = new DuList(layers);
    layers.do(function (layer)
    {
        if (layer.locked) return;
        var props = DuAEProperty.getProps(layer,filterProps);
        var propList = new DuList(props);
        propList.do(function(prop)
        {
            prop.selectKeys( range[0], range[1]);
        });
    });

    DuAEProject.setProgressMode(false);
    DuAE.endUndoGroup( i18n._("Select Keyframes"));
};

Duik.CmdLib['Animation']["Copy"] = "Duik.Animation.copy()";
/**
 * Copies the currently selected keyframes, which can then be pasted with {@link Duik.Animation.paste}.
 * @param {CompItem} [comp=DuAEProject.getActiveComp] The composition
 * @returns {DuAELayerAnimation[]} The list of animations which have been copied.
 */
Duik.Animation.copy = function( comp )
{
    comp = def(comp, DuAEProject.getActiveComp() );
    if(!comp) return;

    var layers = comp.selectedLayers;
    if (layers.length == 0) return;

    var copiedAnim = [];

    for (var i = 0 ; i < layers.length ; i++)
    {
        copiedAnim.push(DuAELayer.getAnim( layers[i],true ));
    }
    //get the first keyframe time to offset when pasting
    /// @ts-ignore We're adding the prop on the Array, sorry
    copiedAnim.firstKeyFrameTime = DuAELayer.firstKeyFrameTime(layers, true);

    $.global["DUIK_DATA"].copiedAnimation = copiedAnim;

    return copiedAnim;
};

Duik.CmdLib['Animation']["Cut"] = "Duik.Animation.cut()";
/**
 * Cuts the currently selected keyframes, which can then be pasted with {@link Duik.Animation.paste}.
 * @param {CompItem} [comp=DuAEProject.getActiveComp] The composition
 * @returns {DuAELayerAnimation[]} The list of animations which have been copied.
 */
Duik.Animation.cut = function ( comp )
{
    comp = def(comp, DuAEProject.getActiveComp() );
    if(!comp) return;

    DuAE.beginUndoGroup( i18n._("Cut animation"), false);

    var props = new DuList( DuAEComp.getSelectedProps() );
    // When modifying properties, keys are deselected. Let's keep the list.
    var selectedKeys = [];
    props.do(function(prop) {
        selectedKeys.push(prop.selectedKeys());
    });

    var animations = Duik.Animation.copy();

    // Remove selected keyframes
    props.do(function(prop) {
        var keys = selectedKeys[props.current];
        for (var i=keys.length-1; i >= 0; i--) {
            prop.removeKey(keys[i]);
        }
    });

    DuAE.endUndoGroup( i18n._("Cut animation"));
    return animations;
}

Duik.CmdLib['Animation']["Paste"] = "Duik.Animation.paste()";
Duik.CmdLib['Animation']["Paste Reversed"] = "Duik.Animation.paste( undefined, false, false, true )";
Duik.CmdLib['Animation']["Paste Offset"] = "Duik.Animation.paste( undefined, false, true )";
Duik.CmdLib['Animation']["Paste Replace"] = "Duik.Animation.paste( undefined, true )";
/**
 * Pastes the animation previously copied by {@link Duik.Animation.copy} to the selected properties.
 * @param {CompItem} [comp] The composition.
 * @param {Boolean} [replace=false] - Whether to completely erase and replace the current animation
 * @param {Boolean} [offset=false] - Whether to offset the animation from the current value
 * @param {Boolean} [reverse=false] - Whether to reverse the animation
 */
Duik.Animation.paste = function( comp, replace, offset, reverse )
{
    /// @ts-ignore DuIO is not included in the types yet
    DuIO.Animation.paste( comp, $.global["DUIK_DATA"].copiedAnimation, replace, offset, reverse );
};

Duik.CmdLib['Animation']["Interpolator"] = "Duik.Animation.interpolator()";
/**
 * Control the selected keyframes with advanced but easy-to-use keyframe interpolation driven by an effect.
 * @param {PropertyBase[]|DuList|PropertyBase} [props] The properties to interpolate. The selected properties in the active comp if omitted.
 * @param {PropertyGroup} [effect] The pseudo effect to use if it already exists.
 * @returns {PropertyGroup} The pseudo-effect
 */
Duik.Animation.interpolator = function( props, effect )
{
    props = def(props, DuAEComp.getSelectedProps() );
    var propList = new DuList(props);
    if (propList.length() == 0) return null;

    var p = propList.at(0);
    p = new DuAEProperty(p);
    var ctrlLayer = p.layer;

    DuAE.beginUndoGroup( i18n._("Interpolator"), false);

    DuAEComp.setUniqueLayerNames(undefined, ctrlLayer.containingComp);

    // Add the effect
    if (!effect)
    {
        effect = Duik.PseudoEffect.INTERPOLATOR.apply( ctrlLayer, i18n._("Interpolator") + ' | ' + p.name );
    }

    // Indices
    var i = Duik.PseudoEffect.INTERPOLATOR.props;

    // Defaults
    /// @ts-ignore This is a Property
    effect( i['Type'].index ).setValue(4);

    // The Expression
    var exp = [ DuAEExpression.Id.INTERPOLATOR,
        'var fx = thisComp.layer("' + ctrlLayer.name + '").effect("' + effect.name + '");',
        'var iType = fx(' + i['Type'].index + ').value;',
        'var iRate = fx(' + i['Rate'].index + ').value;',
        '',
        'var isIn = fx(' + i['In Extrapolation and loop']['Before keys'].index + ');',
        'var inType = fx(' + i['In Extrapolation and loop']['Type'].index + ').value;',
        'var inInStill = fx(' + i['In Extrapolation and loop']['During still parts'].index + ').value;',
        'var inNumKeyframes = fx(' + i['In Extrapolation and loop']['Number of keys'].index + ').value;',
        'var inDamping = fx(' + i['In Extrapolation and loop']['Damping'].index + ').value;',
        'var isOut = fx(' + i['Out Extrapolation and loop']['After keys'].index + ');',
        'var outType = fx(' + i['Out Extrapolation and loop']['Type'].index + ').value;',
        'var outNumKeyframes = fx(' + i['Out Extrapolation and loop']['Number of keys'].index + ').value;',
        'var outInStill = fx(' + i['Out Extrapolation and loop']['During still parts'].index + ').value;',
        'var elasticity = fx(' + i['Out Extrapolation and loop']['Elasticity'].index + ').value;',
        'var outDamping = fx(' + i['Out Extrapolation and loop']['Damping'].index + ').value;',
        'var cspace = fx(' + i['Color options']['Colorspace'].index + ').value;',
        'var extrapolationWeight = fx(' + i['Extrapolation'].index + ').value;',
        '',
        'cspace--;',
        'elasticity /= 10;',
        'outDamping /= 10;',
        'inDamping /= 10;',
        'extrapolationWeight /= 100;',
        'if (!isOut.value) outInStill = false;',
        'if (!isIn.value) inInStill = false;',
        'var isColor = value instanceof Array && value.length == 4;',
        '',
        DuAEExpression.Library.get([
            'isStill',
            'lastActiveTime',
            'nextActiveTime',
            'continueOut',
            'continueIn',
            'cycleOut',
            'cycleIn',
            'pingPongOut',
            'pingPongIn',
            'bezierInterpolation',
            'gaussianInterpolation',
            'linearExtrapolation',
            'logisticInterpolation',
            'logInterpolation',
            'expInterpolation',
            'overshoot',
            'bounce',
            'interpolateColor'
        ]),
        '',
        'var result = value;',
        '',
        'function iAtTime( t )',
        '{',
        '   // Needed keyframes',
        '	var pKey = getPrevKey(t, thisProperty);',
        '	var nKey = getNextKey(t, thisProperty);',
        '',
        '	if (!pKey || !nKey) return value;',
        '',
        '   var it = linear;',
        '',
        '	if (iType == 1) // None',
        '	{',
        '	  return valueAtTime(t);',
        '	} else if (iType == 3) // Bezier',
        '    {',
        '	  var bUseAdvanced = fx(' + i['Bezier options']['Use advanced options'].index + ').value;',
        '',
        '        if (bUseAdvanced) {',
        '      var bInI = fx(' + i['Bezier options']['Advanced']['In Influence'].index + ').value/100;',
        '      var bInV = fx(' + i['Bezier options']['Advanced']['In Velocity'].index + ').value/100;',
        '      var bOutI = fx(' + i['Bezier options']['Advanced']['Out Influence'].index + ').value/100;',
        '      var bOutV = fx(' + i['Bezier options']['Advanced']['Out Velocity'].index + ').value/100;',
        '',
        '            it  = function(t, tMin, tMax, value1, value2) {',
        '				return bezierInterpolation(',
        '					t,',
        '					tMin,',
        '					tMax,',
        '					value1,',
        '					value2,',
        '					[bInI, bInV, 1 - bOutI, 1 - bOutV]',
        '				);',
        '			}',
        '        } else {',
        '            var bRatio = fx(' + i['Bezier options']['In/Out Ratio'].index + ').value / 100;',
        '            var bIn = linear(iRate, 0, 10, 0.0, 1.0) * bRatio;',
        '            var bOut = linear(iRate, 0, 10, 0.0, 1.0) * (1 - bRatio);',
        '            bOut = 1 - bOut;',
        '',
        '            it  = function(t, tMin, tMax, value1, value2) {',
        '				return bezierInterpolation(',
        '					t,',
        '					tMin,',
        '					tMax,',
        '					value1,',
        '					value2,',
        '					[bIn, 0, bOut, 1]',
        '				);',
        '			}',
        '        }',
        '    } else if (iType == 4) // Gaussian ',
        '    {',
        '        iRate = linear(iRate, 1, 30, -1, 1);',
        '		it  = function(t, tMin, tMax, value1, value2) {',
        '			return gaussianInterpolation(',
        '				t,',
        '				tMin,',
        '				tMax,',
        '				value1,',
        '				value2,',
        '				iRate',
        '			);',
        '		}',
        '    } else if (iType == 5) // Logistic',
        '    {',
        '        var midRatio = fx(' + i['Logistic options']['Mid point'].index + ') / 100;',
        '        var mid = pKey.time + (nKey.time - pKey.time) * midRatio;',
        '		it  = function(t, tMin, tMax, value1, value2) {',
        '			return logisticInterpolation(',
        '				t,',
        '				tMin,',
        '				tMax,',
        '				value1,',
        '				value2,',
        '				iRate,',
        '				mid',
        '			);',
        '		}',
        '    } else if (iType == 6) // Logarithmic',
        '    {',
        '		it  = function(t, tMin, tMax, value1, value2) {',
        '			return logInterpolation(',
        '				t,',
        '				tMin,',
        '				tMax,',
        '				value1,',
        '				value2,',
        '				iRate',
        '			);',
        '		}',
        '    } else if (iType == 7) // Exponential ',
        '    {',
        '        iRate = linearExtrapolation(iRate, 0, 30, 0, 10);',
        '		it  = function(t, tMin, tMax, value1, value2) {',
        '			return expInterpolation(',
        '				t,',
        '				tMin,',
        '				tMax,',
        '				value1,',
        '				value2,',
        '				iRate',
        '			);',
        '		}',
        '    }',
        '',
        '	var interpolator = it;',
        '	if (isColor && cspace > 0) interpolator = function (t, tMin, tMax, value1, value2) { return interpolateColor(t, cspace, tMin, tMax, value1, value2, it); };',
        '	',
        '	return interpolator(t, pKey.time, nKey.time, pKey.value, nKey.value);',
        '}',
        '',
        'function i() {',
        '	if (numKeys < 2) return value;',
        '',
        '	// Needed keyframes',
        '	var pKey = getPrevKey(time, thisProperty);',
        '	var nKey = getNextKey(time, thisProperty);',
        '	',
        '	// Extrapolation during still parts',
        '	if ( isStill( time, 0 ) )',
        '	{',
        '	  var inVal = value;',
        '	  var outVal = value;',
        '',
        '    if (isColor && cspace > 0) {',
        '        inVal = rgbToHsl(inVal);',
        '        outVal = rgbToHsl(outVal);',
        '    }',
        '',
        '	  // In Extrapolation',
        '	  if ((inInStill || !pKey) && extrapolationWeight != 0)',
        '	  {',
        '	    var inTime = nextActiveTime(isIn, time);',
        '	    var nextKey = getNextKey(time, thisProperty);',
        '	    ',
        '	    if (inType == 3) inVal = cycleIn(inTime, inNumKeyframes, true, iAtTime, inDamping);',
        '			else if (inType == 4) inVal = cycleIn(inTime, inNumKeyframes, false, iAtTime, inDamping);',
        '			else if (inType == 5) inVal = pingPongIn(inTime, inNumKeyframes, iAtTime, inDamping);',
        '			else if (inType == 2 && isIn.value) {',
        '				if (iType == 1) inVal = continueIn(inTime, inDamping); // None',
        '				else if (iType == 2 && nextKey) // Linear ',
        '				{',
        '				    var firstVelocity = (nextKey.value - iAtTime(nextKey.time + 0.01)) * 100;',
        '  					var timeSpent = nextKey.time - time;',
        '  					var damp = Math.exp(timeSpent * inDamping);',
        '  					inVal = (timeSpent * firstVelocity)/damp + nextKey.value;',
        '				} else if (iType == 3 && nextKey) // Bezier',
        '				{',
        '					var bUseAdvanced = fx(' + i['Bezier options']['Use advanced options'].index + ').valueAtTime(nKey.time);',
        '					if (!bUseAdvanced) inVal = value;',
        '					else',
        '					{',
        '					  var bInV = fx(' + i['Bezier options']['Advanced']['In Velocity'].index + ').valueAtTime(nKey.time) / 100;',
        '  					if (bInV == 0) inVal = value;',
        '  					else ',
        '  					{',
        '  					  var firstVelocity = (iAtTime(nextKey.time + 0.01) - nextKey.value) * 100;',
        '    					var timeSpent = nextKey.time - time;',
        '    					var damp = Math.exp(timeSpent * inDamping);',
        '    					inVal = (-timeSpent * firstVelocity) / damp + nextKey.value;',
        '  					}',
        '					}',
        '				} else if (iType == 4) // Gaussian',
        '				{',
        '					inVal = value;',
        '				} else if (iType == 5 && nextKey) // Logistic',
        '				{',
        '					var previousKey = nextKey;',
        '					if (previousKey.index < numKeys)',
        '					{',
        '					  nextKey = key(previousKey.index + 1);',
        '  					var midRatio = fx(' + i['Logistic options']['Mid point'].index + ') / 100;',
        '  					var mid = previousKey.time + (nextKey.time - previousKey.time) * midRatio;',
        '  					inVal = logisticInterpolation(',
        '  						time,',
        '  						previousKey.time,',
        '  						nextKey.time,',
        '  						previousKey.value,',
        '  						nextKey.value,',
        '  						iRate,',
        '  						mid',
        '  					);',
        '  					var timeSpent = previousKey.time - time;',
        '  					var damp = Math.exp(timeSpent * inDamping);',
        '  					inVal = (inVal-value)/damp + value;',
        '					}',
        '				} else if (iType == 6) // Log',
        '				{',
        '					inVal = value;',
        '				} else if (iType == 7 && nextKey) // Exp ',
        '				{',
        '					var previousKey = nextKey;',
        '					if (previousKey.index < numKeys)',
        '					{',
        '					  var nextKey = key(previousKey.index + 1);',
        '  					inVal = expInterpolation(',
        '  						time,',
        '  						previousKey.time,',
        '  						nextKey.time,',
        '  						previousKey.value,',
        '  						nextKey.value,',
        '  						iRate',
        '  					);',
        '  					var timeSpent = previousKey.time - time;',
        '  					var damp = Math.exp(timeSpent * inDamping);',
        '  					inVal = (inVal-value)/damp + value;',
        '					}',
        '				}',
        '			}',
        '	  }',
        '	  // Out Extrapolation',
        '	  if ((outInStill || !nKey) && extrapolationWeight != 0)',
        '	  {',
        '	    var outTime = lastActiveTime(isOut, time);',
        '	    var prevKey = getPrevKey(time, thisProperty);',
        '	    ',
        '			if (outType == 3) outVal = cycleOut(outTime, outNumKeyframes, true, iAtTime, outDamping);',
        '			else if (outType == 4) outVal = cycleOut(outTime, outNumKeyframes, false, iAtTime, outDamping);',
        '			else if (outType == 5) outVal = pingPongOut(outTime, outNumKeyframes, iAtTime, outDamping);',
        '			else if (outType == 2 && isOut.value) {',
        '				if (iType == 1) outVal = continueOut(outTime, outDamping); // None',
        '				else if (iType == 2 && prevKey) // Linear ',
        '				{',
        '					var lastVelocity = (prevKey.value - iAtTime(prevKey.time - 0.01)) * 100;',
        '					var timeSpent = time - prevKey.time;',
        '					var damp = Math.exp(timeSpent * outDamping);',
        '					outVal = prevKey.value + (timeSpent * lastVelocity)/damp;',
        '				} else if (iType == 3 && prevKey) // Bezier',
        '				{',
        '					var bUseAdvanced = fx(' + i['Bezier options']['Use advanced options'].index + ').valueAtTime(pKey.time);',
        '					if (!bUseAdvanced) outVal = value;',
        '					else ',
        '					{',
        '					  var bOutV = fx(' + i['Bezier options']['Advanced']['Out Velocity'].index + ').valueAtTime(pKey.time) / 100;',
        '  					if (bOutV == 0) outVal = value;',
        '  					else',
        '  					{',
        '  					  var lastVelocity = ( prevKey.value - iAtTime(prevKey.time - 0.01)) * 100;',
        '    					var timeSpent = time - prevKey.time;',
        '    					var damp = Math.exp(timeSpent * outDamping);',
        '    					outVal = prevKey.value + (timeSpent * lastVelocity)/damp;',
        '  					}',
        '					}',
        '				} else if (iType == 4) // Gaussian',
        '				{',
        '					outVal = value;',
        '				} else if (iType == 5 && prevKey) // Logistic',
        '				{',
        '				  var nextKey = prevKey;',
        '				  if (nextKey.index > 0)',
        '				  {',
        '				    prevKey = key(nextKey.index - 1);',
        '  					var midRatio = fx(' + i['Logistic options']['Mid point'].index + ') / 100;',
        '  					var mid = prevKey.time + (nextKey.time - prevKey.time) * midRatio;',
        '  					outVal = logisticInterpolation(',
        '  						time,',
        '  						prevKey.time,',
        '  						nextKey.time,',
        '  						prevKey.value,',
        '  						nextKey.value,',
        '  						iRate,',
        '  						mid',
        '  					);',
        '  					var timeSpent = time - nextKey.time;',
        '  					var damp = Math.exp(timeSpent * outDamping);',
        '  					outVal = (outVal-value)/damp + value;',
        '				  }',
        '					',
        '				} else if (iType == 6 && prevKey) // Log',
        '				{',
        '					var nextKey = prevKey;',
        '				  if (nextKey.index > 0)',
        '				  {',
        '				    prevKey = key(nextKey.index - 1);',
        '				    outVal = logInterpolation(',
        '  						time,',
        '  						prevKey.time,',
        '  						nextKey.time,',
        '  						prevKey.value,',
        '  						nextKey.value,',
        '  						iRate',
        '  					);',
        '  					var timeSpent = time - nextKey.time;',
        '  					var damp = Math.exp(timeSpent * outDamping);',
        '  					outVal = (outVal-value)/damp + value;',
        '				  }',
        '				} else if (iType == 7 && prevKey) // Exp ',
        '				{',
        '					var nextKey = prevKey;',
        '				  if (nextKey.index > 0)',
        '				  {',
        '				    prevKey = key(nextKey.index - 1);',
        '				    outVal = expInterpolation(',
        '  						time,',
        '  						prevKey.time,',
        '  						nextKey.time,',
        '  						prevKey.value,',
        '  						nextKey.value,',
        '  						iRate',
        '  					);',
        '  					var timeSpent = time - nextKey.time;',
        '  					var damp = Math.exp(timeSpent * outDamping);',
        '  					outVal = (outVal-value)/damp + value;',
        '				  }',
        '				}',
        '			}',
        '			else if (outType == 6 && isOut.value) outVal = overShoot(time, elasticity, outDamping, iAtTime );',
        '			else if (outType == 7 && isOut.value) outVal = bounce(time, elasticity, outDamping, iAtTime );',
        '	  }',
        '',
        '		var r = value;',
        '		if (cspace > 0 && isColor) r = rgbToHsl(value);',
        '',
        '        if (!pKey) r = inVal;',
        '        else if (!nKey) r = outVal;',
        '',
        '        // Blend',
        '        else if (inInStill && outInStill) r = ease(time, pKey.time, nKey.time, outVal, inVal);',
        '        else if (inInStill) r = inVal;',
        '        else if (outInStill) r = outVal;',
        '',
        '		 if (cspace > 0 && isColor) r = hslToRgb(r);',
        '',
        '        // Weight',
        '        r = extrapolationWeight * r + value * (1-extrapolationWeight);',
        '',
        '        return r;',
        '    }',
        '',
        '	return iAtTime(time);',
        '}',
        '',
        'if (fx.enabled) result = i();',
        'result;'//*/
        ].join('\n');

    // Add expressions
    propList.do(function (prop)
    {
        prop = new DuAEProperty(prop);
        // Only for riggable props (no recursion)
        if (prop.riggable())
            prop.setExpression( exp, false );
    });

    DuAE.endUndoGroup( i18n._("Interpolator"));

    return effect;
};

Duik.CmdLib['Animation']["Add roving key"] = "Duik.Animation.addRovingKey()";
/**
 * Adds a roving key to the properties at current time
 * @param {Bool} [animatedProps=true] Set to false to add a key to all selected properties, instead of all animated properties.
 * @param {Bool} [selectedLayers=true] Set to false to add a key to all layers instead of just the selection.
 */
Duik.Animation.addRovingKey = function(animatedProps, selectedLayers)
{
    animatedProps = def(animatedProps, true);
    selectedLayers = def(selectedLayers, true);

    DuAE.beginUndoGroup( i18n._("Roving"), false);

    var props;
    if (animatedProps) props = DuAEComp.getAnimatedProps(undefined, undefined, undefined, selectedLayers);
    else props = DuAEComp.getSelectedProps();
    props = new DuList(props);
    if (props.length == 0) return;

    props.do(function(prop) {
        if (prop.isGroup()) return;
        prop.addKey('roving');
    });

    DuAE.endUndoGroup( i18n._("Roving"));
};

Duik.CmdLib['Animation']["Set roving"] = "Duik.Animation.setRoving()";
/**
 * Sets the selected keyframes to roving
 */
Duik.Animation.setRoving = function() {
    var props = DuAEComp.getSelectedProps();
    props = new DuList(props);
    if (props.length == 0) return;

    DuAE.beginUndoGroup( i18n._("Roving"), false);

    props.do(function(prop) {
        if (prop.isGroup()) return;
        prop.setInterpolation('roving', undefined, undefined, undefined, true);
    });

    DuAE.endUndoGroup( i18n._("Roving"));
};

Duik.CmdLib['Animation']["Add linear key"] = "Duik.Animation.addLinearKey()";
/**
 * Adds a linear key to the properties at current time
 * @param {Bool} [animatedProps=true] Set to false to add a key to all selected properties, instead of all animated properties.
 * @param {Bool} [selectedLayers=true] Set to false to add a key to all layers instead of just the selection.
 */
Duik.Animation.addLinearKey = function(animatedProps, selectedLayers)
{
    animatedProps = def(animatedProps, true);
    selectedLayers = def(selectedLayers, true);

    DuAE.beginUndoGroup( i18n._("Linear"), false);

    var props;
    if (animatedProps) props = DuAEComp.getAnimatedProps(undefined, undefined, undefined, selectedLayers);
    else props = DuAEComp.getSelectedProps();
    props = new DuList(props);
    if (props.length == 0) return;

    props.do(function(prop) {
        if (prop.isGroup()) return;
        prop.addKey(KeyframeInterpolationType.LINEAR);
    });

    DuAE.endUndoGroup( i18n._("Linear"));
};

Duik.CmdLib['Animation']["Set linear"] = "Duik.Animation.setLinear()";
/**
 * Sets the selected keyframes to linear
 */
Duik.Animation.setLinear = function() {
    var props = DuAEComp.getSelectedProps();
    props = new DuList(props);
    if (props.length == 0) return;

    DuAE.beginUndoGroup( i18n._("Linear"), false);

    props.do(function(prop) {
        if (prop.isGroup()) return;
        prop.setInterpolation(KeyframeInterpolationType.LINEAR, undefined, undefined, undefined, true);
    });

    DuAE.endUndoGroup( i18n._("Linear"));
};

Duik.CmdLib['Animation']["Add Ease In key"] = "Duik.Animation.addEaseInKey()";
/**
 * Adds an Ease In key to the properties at current time
 * @param {Bool} [animatedProps=true] Set to false to add a key to all selected properties, instead of all animated properties.
 * @param {Bool} [selectedLayers=true] Set to false to add a key to all layers instead of just the selection.
 * @param {int} [ease=33] The ease influence.
 */
Duik.Animation.addEaseInKey = function(animatedProps, selectedLayers, ease)
{
    animatedProps = def(animatedProps, true);
    selectedLayers = def(selectedLayers, true);
    ease = def(ease, 33);

    DuAE.beginUndoGroup( i18n._("Ease In"), false);

    var props;
    if (animatedProps) props = DuAEComp.getAnimatedProps(undefined, undefined, undefined, selectedLayers);
    else props = DuAEComp.getSelectedProps();
    props = new DuList(props);
    if (props.length == 0) return;

    props.do(function(prop) {
        if (prop.isGroup()) return;
        prop.addKey(KeyframeInterpolationType.BEZIER, KeyframeInterpolationType.LINEAR, undefined, ease );
    });

    DuAE.endUndoGroup( i18n._("Ease In"));
};

Duik.CmdLib['Animation']["Set ease in"] = "Duik.Animation.setEaseIn()";
/**
 * Sets the selected keyframes to ease in
 * @param {int} [ease=33] The ease influence.
 */
Duik.Animation.setEaseIn = function( ease ) {
    ease = def(ease, 33);

    var props = DuAEComp.getSelectedProps();
    props = new DuList(props);
    if (props.length == 0) return;

    DuAE.beginUndoGroup( i18n._("Ease In"), false);

    props.do(function(prop) {
        if (prop.isGroup()) return;
        prop.setInterpolation(KeyframeInterpolationType.BEZIER, KeyframeInterpolationType.LINEAR, ease, undefined, true);
    });

    DuAE.endUndoGroup( i18n._("Ease In"));
};

Duik.CmdLib['Animation']["Add Ease Out key"] = "Duik.Animation.addEaseOutKey()";
/**
 * Adds an Ease Out key to the properties at current time
 * @param {Bool} [animatedProps=true] Set to false to add a key to all selected properties, instead of all animated properties.
 * @param {Bool} [selectedLayers=true] Set to false to add a key to all layers instead of just the selection.
 * @param {int} [ease=33] The ease influence.
 */
Duik.Animation.addEaseOutKey = function(animatedProps, selectedLayers, ease)
{
    animatedProps = def(animatedProps, true);
    selectedLayers = def(selectedLayers, true);
    ease = def(ease, 33);

    DuAE.beginUndoGroup( i18n._("Ease Out"), false);

    var props;
    if (animatedProps) props = DuAEComp.getAnimatedProps(undefined, undefined, undefined, selectedLayers);
    else props = DuAEComp.getSelectedProps();
    props = new DuList(props);
    if (props.length == 0) return;

    props.do(function(prop) {
        if (prop.isGroup()) return;
        prop.addKey(KeyframeInterpolationType.LINEAR, KeyframeInterpolationType.BEZIER, undefined, undefined, ease );
    });

    DuAE.endUndoGroup( i18n._("Ease Out"));
};

Duik.CmdLib['Animation']["Set ease out"] = "Duik.Animation.setEaseOut()";
/**
 * Sets the selected keyframes to ease out
 * @param {int} [ease=33] The ease influence.
 */
Duik.Animation.setEaseOut = function( ease ) {
    ease = def(ease, 33);

    var props = DuAEComp.getSelectedProps();
    props = new DuList(props);
    if (props.length == 0) return;

    DuAE.beginUndoGroup( i18n._("Ease Out"), false);

    props.do(function(prop) {
        if (prop.isGroup()) return;
        prop.setInterpolation(KeyframeInterpolationType.LINEAR, KeyframeInterpolationType.BEZIER, undefined, ease, true);
    });

    DuAE.endUndoGroup( i18n._("Ease Out"));
};

Duik.CmdLib['Animation']["Add Easy Ease key"] = "Duik.Animation.addEasyEaseKey()";
/**
 * Adds an Easy Ease key to the properties at current time
 * @param {Bool} [animatedProps=true] Set to false to add a key to all selected properties, instead of all animated properties.
 * @param {Bool} [selectedLayers=true] Set to false to add a key to all layers instead of just the selection.
 * @param {int} [easeIn=33] The ease in influence.
 * @param {int} [easeOut=33] The ease out influence.
 */
Duik.Animation.addEasyEaseKey = function(animatedProps, selectedLayers, easeIn, easeOut)
{
    animatedProps = def(animatedProps, true);
    selectedLayers = def(selectedLayers, true);
    easeIn = def(easeIn, 33);
    easeOut = def(easeOut, 33);
    
    DuAE.beginUndoGroup( i18n._("Easy Ease"), false);

    var props;
    if (animatedProps) props = DuAEComp.getAnimatedProps(undefined, undefined, undefined, selectedLayers);
    else props = DuAEComp.getSelectedProps();
    props = new DuList(props);
    if (props.length == 0) return;

    props.do(function(prop) {
        if (prop.isGroup()) return;
        prop.addKey(KeyframeInterpolationType.BEZIER, KeyframeInterpolationType.BEZIER, undefined, easeIn, easeOut );
    });

    DuAE.endUndoGroup( i18n._("Easy Ease"));
};

Duik.CmdLib['Animation']["Set easy ease"] = "Duik.Animation.setEasyEase()";
/**
 * Sets the selected keyframes to easy ease
 * @param {int} [easeIn=33] The ease in influence.
 * @param {int} [easeOut=33] The ease out influence.
 */
Duik.Animation.setEasyEase = function(easeIn, easeOut) {
    var props = DuAEComp.getSelectedProps();
    props = new DuList(props);
    if (props.length == 0) return;

    easeIn = def(easeIn, 33);
    easeOut = def(easeOut, 33);

    DuAE.beginUndoGroup( i18n._("Easy Ease"), false);

    props.do(function(prop) {
        if (prop.isGroup()) return;
        prop.setInterpolation(KeyframeInterpolationType.BEZIER, KeyframeInterpolationType.BEZIER, easeIn, easeOut, true);
    });

    DuAE.endUndoGroup( i18n._("Easy Ease"));
};

Duik.CmdLib['Animation']["Add Continuous key"] = "Duik.Animation.addContinuousKey()";
/**
 * Adds a Continuous key to the properties at current time
 * @param {Bool} [animatedProps=true] Set to false to add a key to all selected properties, instead of all animated properties.
 * @param {Bool} [selectedLayers=true] Set to false to add a key to all layers instead of just the selection.
 */
Duik.Animation.addContinuousKey = function(animatedProps, selectedLayers)
{
    animatedProps = def(animatedProps, true);
    selectedLayers = def(selectedLayers, true);

    DuAE.beginUndoGroup( i18n._("Continuous"), false);

    var props;
    if (animatedProps) props = DuAEComp.getAnimatedProps(undefined, undefined, undefined, selectedLayers);
    else props = DuAEComp.getSelectedProps();
    props = new DuList(props);
    if (props.length == 0) return;

    props.do(function(prop) {
        if (prop.isGroup()) return;
        prop.addKey('continuous');
    });

    DuAE.endUndoGroup( i18n._("Continuous"));
};

Duik.CmdLib['Animation']["Set continuous"] = "Duik.Animation.setContinuous()";
/**
 * Sets the selected keyframes to continuous
 */
Duik.Animation.setContinuous = function() {
    var props = DuAEComp.getSelectedProps();
    props = new DuList(props);
    if (props.length == 0) return;

    DuAE.beginUndoGroup( i18n._("Continuous"), false);

    props.do(function(prop) {
        if (prop.isGroup()) return;
        prop.setInterpolation('continuous', undefined, undefined, undefined, true);
    });

    DuAE.endUndoGroup( i18n._("Continuous"));
};

Duik.CmdLib['Animation']["Add Hold key"] = "Duik.Animation.addHoldKey()";
/**
 * Adds a Hold key to the properties at current time
 * @param {Bool} [animatedProps=true] Set to false to add a key to all selected properties, instead of all animated properties.
 * @param {Bool} [selectedLayers=true] Set to false to add a key to all layers instead of just the selection.
 */
Duik.Animation.addHoldKey = function(animatedProps, selectedLayers)
{
    animatedProps = def(animatedProps, true);
    selectedLayers = def(selectedLayers, true);

    DuAE.beginUndoGroup( i18n._("Hold"), false);

    var props;
    if (animatedProps) props = DuAEComp.getAnimatedProps(undefined, undefined, undefined, selectedLayers);
    else props = DuAEComp.getSelectedProps();
    props = new DuList(props);
    if (props.length == 0) return;

    props.do(function(prop) {
        if (prop.isGroup()) return;
        prop.addKey(KeyframeInterpolationType.HOLD);
    });

    DuAE.endUndoGroup( i18n._("Hold"));
};

Duik.CmdLib['Animation']["Set hold"] = "Duik.Animation.setHold()";
/**
 * Sets the selected keyframes to hold
 */
Duik.Animation.setHold = function() {
    var props = DuAEComp.getSelectedProps();
    props = new DuList(props);
    if (props.length == 0) return;

    DuAE.beginUndoGroup( i18n._("Hold"), false);

    props.do(function(prop) {
        if (prop.isGroup()) return;
        prop.setInterpolation(KeyframeInterpolationType.HOLD, undefined, undefined, undefined, true);
    });

    DuAE.endUndoGroup( i18n._("Hold"));
};

/**
 * Sets the ease values on the selected keyframes
 * @param {float} easeIn The in ease
 * @param {float} easeOut The out ease
 */
Duik.Animation.setEase = function( easeIn, easeOut ) {
    var props = DuAEComp.getSelectedProps();
    var propList = new DuList(props);
    if (propList.length() == 0) return;

    DuAE.beginUndoGroup( i18n._("Set ease"), false);

    propList.do(function(prop) {
        if (prop.isGroup()) return;
        prop.setEase(easeIn, easeOut);
    });

    DuAE.endUndoGroup( i18n._("Set ease"));
}

/**
 * Sets the velocity values on the selected keyframes
 * @param {float} vIn The in velocity
 * @param {float} vOut The out velocity
 */
Duik.Animation.setVelocity = function( vIn, vOut ) {
    var props = DuAEComp.getSelectedProps();
    props = new DuList(props);
    if (props.length == 0) return;

    DuAE.beginUndoGroup( i18n._("Set velocity"), false);

    props.do(function(prop) {
        if (prop.isGroup()) return;
        prop.setEase(undefined, undefined, vIn, vOut, true);
    });

    DuAE.endUndoGroup( i18n._("Set velocity"));
}

/**
 * Sets the selected keyframes spatial interpolation
 */
Duik.Animation.setSpatialInterpolation = function( inType, outType) {
    var props = DuAEComp.getSelectedProps();
    props = new DuList(props);
    if (props.length == 0) return;

    outType = def(outType, inType);

    DuAE.beginUndoGroup( i18n._("Spatial interpolation"), false);

    props.do(function(prop) {
        if (prop.isGroup()) return;
        prop.setSpatialInterpolation( inType, outType, true );
    });

    DuAE.endUndoGroup( i18n._("Spatial interpolation"));
};

Duik.CmdLib['Animation']["Set spatial linear"] = "Duik.Animation.setSpatialLinear()";
/**
 * Sets the selected keyframes spatial interpolation to linear
 */
Duik.Animation.setSpatialLinear = function() {
    Duik.Animation.setSpatialInterpolation(KeyframeInterpolationType.LINEAR);
};

Duik.CmdLib['Animation']["Set spatial bezier in"] = "Duik.Animation.setSpatialBezierIn()";
/**
 * Sets the selected keyframes spatial interpolation to linear
 */
Duik.Animation.setSpatialBezierIn = function() {
    Duik.Animation.setSpatialInterpolation(KeyframeInterpolationType.BEZIER, KeyframeInterpolationType.LINEAR);
};

Duik.CmdLib['Animation']["Set spatial bezier out"] = "Duik.Animation.setSpatialBezierOut()";
/**
 * Sets the selected keyframes spatial interpolation to linear
 */
Duik.Animation.setSpatialBezierOut = function() {
    Duik.Animation.setSpatialInterpolation(KeyframeInterpolationType.LINEAR, KeyframeInterpolationType.BEZIER);
};

Duik.CmdLib['Animation']["Set spatial bezier"] = "Duik.Animation.setSpatialBezier()";
/**
 * Sets the selected keyframes spatial interpolation to linear
 */
Duik.Animation.setSpatialBezier = function() {
    Duik.Animation.setSpatialInterpolation(KeyframeInterpolationType.BEZIER, KeyframeInterpolationType.BEZIER);
};

Duik.CmdLib['Animation']["Fix spatial interpolation"] = "Duik.Animation.fixSpatialInterpolation()";
/**
 * Sets the selected keyframes spatial interpolation to linear
 */
Duik.Animation.fixSpatialInterpolation = function() {
    var props = DuAEComp.getSelectedProps();
    props = new DuList(props);
    if (props.length == 0) return;

    DuAE.beginUndoGroup( i18n._("Spatial interpolation"), false);

    props.do(function(prop) {
        if (prop.isGroup()) return;
        prop.fixSpatialInterpolation( undefined, true );
    });

    DuAE.endUndoGroup( i18n._("Spatial interpolation"));
};

/**
 * Adds a key to the properties at current time, tweening according to the previous and next keyframe
 * @param {float} [tweenRatio=0.5] The value ratio for tweening: 0.0 is the value of the previous key, 1.0 is the value of the next key. Note that this value can be < 0 and > 1.0 if you wish.
 * @param {Bool} [animatedProps=true] Set to false to add a key to all selected properties, instead of all animated properties.
 * @param {Bool} [selectedLayers=true] Set to false to add a key to all layers instead of just the selection.
 */
Duik.Animation.tween = function(tweenRatio, animatedProps, selectedLayers) {
    tweenRatio = def(tweenRatio, 0.5);
    animatedProps = def(animatedProps, true);
    selectedLayers = def(selectedLayers, true);

    var props;
    if (animatedProps) props = DuAEComp.getAnimatedProps(undefined, undefined, undefined, selectedLayers);
    else props = DuAEComp.getSelectedProps();
    props = new DuList(props);
    if (props.length == 0) return;

    DuAE.beginUndoGroup( i18n._("Tween"), false);

    props.do(function(prop) {
        var numKeys = prop.numKeys(false);
        if (numKeys == 0) return;
        // Current time
        var time = prop.comp.time;
        // Values
        var nKey = prop.nearestKeyAtTime(time);
        var pKey;
        // There's a keyframe at the current time, remove it and try again
        if (nKey._time == time && nKey._index != 0 && nKey._index != numKeys) {
            prop.removeKey(nKey);
            nKey = prop.nearestKeyAtTime(time);
        }
        // Get the previous key
        if (nKey._time < time) {
            // It's the last one; ignore
            if (nKey._index == numKeys) return;
            pKey = nKey;
            nKey = prop.keyAtIndex(nKey._index + 1);
        }
        else {
            // It's the first one; just set a new key at current time
            if (nKey._index == 0) return;
            pKey = prop.keyAtIndex(nKey._index - 1);
        }
    
        // Interpolate the value and set the new key
        var newValue = DuMath.linear(tweenRatio, 0.0, 1.0, pKey.value, nKey.value);
        prop.setValueAtTime( newValue, time);
    });

    DuAE.endUndoGroup( i18n._("Tween"), false);
};

Duik.CmdLib['Animation']["Split keys"] = "Duik.Animation.splitKeys()";
/**
 * Splits the selected keyframes into couple of keyframes with the same values
 * @param {int} [duration=2] The number of frames between the two keyframes.
 * @param {DuAE.TimeAlignment} [alignment = DuAE.TimeAlignment.CENTER] How to align the new keyframes according to the current time.
 */
Duik.Animation.splitKeys = function( duration, alignment ) {
    var props = DuAEComp.getSelectedProps();
    props = new DuList(props);
    if (props.length == 0) return;

    alignment = def(alignment, DuAE.TimeAlignment.CENTER);
    duration = def(duration, 2);

    if (isNaN(duration)) duration  = 2;
    if (duration < 1) duration = 1;
    duration = Math.abs(duration);

    DuAE.beginUndoGroup( i18n._("Split"), false);

    // When modifying properties, keys are deselected. Let's keep the list.
    var selectedKeys = [];
    props.do(function(prop) {
        selectedKeys.push(prop.selectedKeys());
    });

    props.do(function(prop) {
        if (prop.isGroup()) return;
        var d = prop.comp.frameDuration * duration;
        // For each selected keyframe
        var keys = selectedKeys[props.current];
        for (var i=keys.length-1; i >= 0; i--) {
            var key = prop.keyAtIndex(keys[i]);

            var pKey, nKey;

            if (alignment == DuAE.TimeAlignment.CENTER) {
                prop.removeKey(key);

                var pD = -d/2;
                var nD = d/2;
                // Snap!
                if (duration % 2 == 1) {
                    pD += prop.comp.frameDuration / 2;
                    nD += prop.comp.frameDuration / 2;
                }

                pKey = key._clone();
                pKey._time += pD;
                prop.setKey(pKey, 0);

                nKey = key._clone();
                nKey._time += nD;

                prop.setKey(nKey, 0);
            }
            else if (alignment == DuAE.TimeAlignment.IN_POINT) {
                nKey = key._clone();
                nKey._time += d;
                prop.setKey(nKey, 0);

                pKey = key._clone();
            }
            else {
                nKey = key._clone();
                pKey = key._clone();
                pKey._time -= d;
                prop.setKey(pKey, 0);
            }

            // Adjust spatial interpolation
            prop.setSpatialTangentsAtKey( pKey, prop.keyInSpatialTangent(pKey), [0,0]);
            prop.setSpatialTangentsAtKey( nKey, [0,0], prop.keyOutSpatialTangent(nKey));
        }
    });

    DuAE.endUndoGroup( i18n._("Split"));
};

Duik.CmdLib['Animation']["Freeze pose"] = "Duik.Animation.freezePose()";
/**
 * Freezes the pose; copies the previous keyframe to the current time.
 * @param {Bool} [animatedProps=true] Set to false to add a key to all selected properties, instead of all animated properties.
 * @param {Bool} [selectedLayers=true] Set to false to add a key to all layers instead of just the selection.
 * @param {Bool} [useNextPose=false] If true, will freeze the next pose instead of the previous one (copies the next keyframe to the current time).
 */
Duik.Animation.freezePose = function(animatedProps, selectedLayers, useNextPose) {
    useNextPose = def(useNextPose, false);
    animatedProps = def(animatedProps, true);
    selectedLayers = def(selectedLayers, true);

    var props;
    if (animatedProps) props = DuAEComp.getAnimatedProps(undefined, undefined, undefined, selectedLayers);
    else props = DuAEComp.getSelectedProps();
    props = new DuList(props);
    if (props.length() == 0) return;

    DuAE.beginUndoGroup( i18n._("Freeze"), false);

    props.do(function(prop) {
        if (prop.isGroup()) return;
        if (prop.dimensionsSeparated()) return;
        // Get the previous keyframe (or next)
        var time = prop.comp.time;
        var key = prop.nearestKeyAtTime( time );
        // Adjust
        if (useNextPose && key._time <= time) {
            if (key._index == prop.numKeys()) return;
            key = prop.keyAtIndex( key._index + 1);
        }
        else if (!useNextPose && key._time >= time) {
            if (key._index == 1) return;
            key = prop.keyAtIndex( key._index - 1);
        }
        key._time = 0;
        // Select the key (needed to fix spatial interpolation, and better for user feedback)
        prop.setSelectedAtKey(key);
        var copiedIndex = key._index;
        // Set new key
        if (!prop.setKey(key, time)) return;
        var newIndex = key._index;
        // Adjust spatial interpolation
        if (useNextPose) {
            prop.setSpatialTangentsAtKey( newIndex, prop.keyInSpatialTangent(newIndex), [0,0]);
            prop.setSpatialTangentsAtKey( copiedIndex, [0,0], prop.keyOutSpatialTangent(copiedIndex));
        }
        else {
            prop.setSpatialTangentsAtKey( copiedIndex, prop.keyInSpatialTangent(copiedIndex), [0,0]);
            prop.setSpatialTangentsAtKey( newIndex, [0,0], prop.keyOutSpatialTangent(newIndex));
        }

        // Fix spatial tangents
        if (prop.isSpatial()) {
            prop.fixSpatialInterpolation(2, true);
        }
    });
    
    DuAE.endUndoGroup( i18n._("Freeze"));
};

Duik.CmdLib['Animation']["Cel onion skin"] = "Duik.Animation.celOnionSkin()";
/**
 * (De)activates or updates the onion skin of a Duik cel animation comp.
 * @param {Boolean} [enabled=true] If omitted, will try to get it from the existing cels.
 * @param {int} [frames=5] The duration (in frames) of the onion skin. If omitted, will try to get it from the existing cels.
 * @param {int} [exposure=2] The animation exposure. If omitted, will try to get it from the existing cels.
 * @param {float} [inOpacity=50] The in opacity. If omitted, will try to get it from the existing cels.
 * @param {float} [outOpacity=50] The out opacity. If omitted, will try to get it from the existing cels.
 */
Duik.Animation.celOnionSkin = function( enabled, frames, exposure, inOpacity, outOpacity) {

    frames = def(frames, -1);
    exposure = def(exposure, -1);
    inOpacity = def(inOpacity, -1);
    outOpacity = def(outOpacity, -1);

    if (isNaN(frames)) frames = 5;

    if (isNaN(exposure)) exposure = 2;

    if (inOpacity == 0 && outOpacity == 0) enabled = false;

    var comp = DuAEProject.getActiveComp();
    if (!comp) return;

    var layers = comp.selectedLayers;
    if (layers.length == 0) layers = comp.layers;
    layers = new DuList(layers);

    DuAE.beginUndoGroup( i18n._("Onion skin"), false);
    
    // TODO Get/Set settings to the layer if enabled
    layers.do(function(layer) {

        var tag = DuAETag.get(layer);

        // Try to get parameters from the layer tags
        if (typeof enabled === 'undefined') enabled = DuAETag.getValue( layer, DuAETag.Key.DUIK_CEL_ONION_SKIN_ENABLED, DuAETag.Type.BOOL, tag );
        if (enabled === null) enabled = true;

        if (frames < 1) frames = DuAETag.getValue( layer, DuAETag.Key.DUIK_CEL_ONION_SKIN_FRAMES, DuAETag.Type.INT, tag );
        if (frames === null) frames = 5;

        if (exposure < 1) exposure = DuAETag.getValue( layer, DuAETag.Key.DUIK_CEL_EXPOSURE, DuAETag.Type.INT, tag );
        if (exposure === null) exposure = 2;

        if (inOpacity < 0) inOpacity = DuAETag.getValue( layer, DuAETag.Key.DUIK_CEL_ONION_SKIN_IN, DuAETag.Type.FLOAT, tag );
        if (inOpacity === null) inOpacity = 50;

        if (outOpacity < 0) outOpacity = DuAETag.getValue( layer, DuAETag.Key.DUIK_CEL_ONION_SKIN_OUT, DuAETag.Type.FLOAT, tag );
        if (outOpacity === null) outOpacity = 50;

        for (var i = 1 ; i <= layer.Effects.numProperties ; i++)
        {
            var paint = layer.effect(i);
            if (!paint) continue;
            if (paint.matchName != "ADBE Paint") continue;
            if (paint.name.indexOf( i18n._("Celluloid")) < 0) continue;
            for (var j = 1 ; j <= paint.property("ADBE Paint Group").numProperties ; j++)
            {
                var stroke = paint.property("ADBE Paint Group")(j);
                if (stroke.matchName != "ADBE Paint Atom") continue;

                var inPoint = stroke.property("ADBE Paint Duration").value[0];
                var duration = stroke.property("ADBE Paint Duration").value[1];

                //adjust exposure
                if (stroke.name.indexOf("#Duik") < 0)
                {
                    duration = exposure*comp.frameDuration;
                    stroke.property("ADBE Paint Duration").setValue([inPoint,duration]);
                    stroke.name = stroke.name + " #Duik";
                }

                DuAETag.setValue( layer, DuAETag.Key.DUIK_CEL_ONION_SKIN_ENABLED, enabled, tag );

                if (enabled)
                {
                    //stroke.property("ADBE Paint Transfer Mode") : blending mode
                    var outPoint = duration + inPoint;
                    var opacity = stroke.property("ADBE Paint Properties").property("ADBE Paint Opacity");
                    //if keyframes (already activated)
                    if (opacity.numKeys > 0)
                    {
                        if (stroke.name.indexOf("#Out") >= 0 && stroke.name.indexOf("#In") < 0)
                        {
                            outPoint = opacity.keyTime(2) - layer.startTime;
                        }
                        else if (stroke.name.indexOf("#Out") < 0 && stroke.name.indexOf("#In") >= 0)
                        {
                            inPoint = opacity.keyTime(3) - layer.startTime;
                        }
                        else if (stroke.name.indexOf("#Out") >= 0 && stroke.name.indexOf("#In") >= 0)
                        {
                            inPoint = opacity.keyTime(3) - layer.startTime;
                            outPoint = opacity.keyTime(5) - layer.startTime;
                        }

                        //remove keys
                        while (opacity.numKeys>0)
                        {
                            opacity.removeKey(1);
                        }
                        opacity.setValue(100);
                        stroke.name = stroke.name.replace(/ #Out/g,"");
                        stroke.name = stroke.name.replace(/ #In/g,"");

                        // Set tags
                        DuAETag.setValue( layer, DuAETag.Key.DUIK_CEL_ONION_SKIN_FRAMES, frames, tag );
                        DuAETag.setValue( layer, DuAETag.Key.DUIK_CEL_EXPOSURE, exposure, tag );
                        DuAETag.setValue( layer, DuAETag.Key.DUIK_CEL_ONION_SKIN_IN, inOpacity, tag );
                        DuAETag.setValue( layer, DuAETag.Key.DUIK_CEL_ONION_SKIN_OUT, outOpacity, tag );
                    }

                    //set duration
                    if (outOpacity > 0 && inOpacity <= 0)
                    {
                        duration = outPoint - inPoint + frames*comp.frameDuration;
                        stroke.property("ADBE Paint Duration").setValue([inPoint,duration]);
                    }
                    else if (outOpacity <= 0 && inOpacity > 0)
                    {
                        duration = outPoint - inPoint + frames*comp.frameDuration;
                        stroke.property("ADBE Paint Duration").setValue([inPoint-frames*comp.frameDuration,duration]);
                    }
                    else
                    {
                        duration = outPoint - inPoint + 2*frames*comp.frameDuration;
                        stroke.property("ADBE Paint Duration").setValue([inPoint-frames*comp.frameDuration,duration]);
                    }


                    //add keyframes
                    if (outOpacity > 0)
                    {
                        opacity.setValueAtTime(outPoint-comp.frameDuration+layer.startTime,100);
                        opacity.setValueAtTime(outPoint+layer.startTime,outOpacity);
                        opacity.setValueAtTime(outPoint + frames*comp.frameDuration+layer.startTime,0);
                        stroke.name = stroke.name + " #Out";
                    }
                    if (inOpacity > 0)
                    {
                        opacity.setValueAtTime(inPoint+layer.startTime,100);
                        opacity.setValueAtTime(inPoint-frames*comp.frameDuration+layer.startTime,0);
                        opacity.setValueAtTime(inPoint-comp.frameDuration+layer.startTime,inOpacity);
                        stroke.name = stroke.name + " #In";
                    }

                }
                else
                {
                    var opacity = stroke.property("ADBE Paint Properties").property("ADBE Paint Opacity");
                    if (opacity.numKeys > 0)
                    {
                        inPoint = 0;
                        outPoint = 1;
                        if (stroke.name.indexOf("#Out") >= 0 && stroke.name.indexOf("#In") < 0)
                        {
                            inPoint = stroke.property("ADBE Paint Duration").value[0];
                            outPoint = opacity.keyTime(2);
                        }
                        else if (stroke.name.indexOf("#Out") < 0 && stroke.name.indexOf("#In") >= 0)
                        {
                            outPoint = stroke.property("ADBE Paint Duration").value[0] + stroke.property("ADBE Paint Duration").value[1];
                            inPoint = opacity.keyTime(3);
                        }
                        else if (stroke.name.indexOf("#Out") >= 0 && stroke.name.indexOf("#In") >= 0)
                        {
                            inPoint = opacity.keyTime(3);
                            outPoint = opacity.keyTime(5);
                        }


                        while (opacity.numKeys>0)
                        {
                            opacity.removeKey(1);
                        }
                        opacity.setValue(100);
                        //set duration
                        var o = outPoint-inPoint;
                        var i = inPoint;
                        if (stroke.name.indexOf("#Out") >= 0 && stroke.name.indexOf("#In") < 0) o = o-layer.startTime;
                        else if (stroke.name.indexOf("#Out") < 0) o = o + layer.startTime;
                        if (stroke.name.indexOf("#In") >= 0) i = i-layer.startTime;

                        stroke.property("ADBE Paint Duration").setValue([i,o]);

                        stroke.name = stroke.name.replace(/ #In/g,"");
                        stroke.name = stroke.name.replace(/ #Out/g,"");
                    }
                }
            }
        }

        //deselect
        while(layer.selectedProperties.length > 0)
        {
            layer.selectedProperties[0].selected = false;
        }
    });

    DuAE.endUndoGroup( i18n._("Onion skin"));
};

Duik.CmdLib['Animation']["New Cel"] = "Duik.Animation.newCel()";
/**
 * Creates a new cel for a Duik cel animation
 * @param {Boolean} [createNewLayer=false] Set to true to create the cel on a new layer
 */
Duik.Animation.newCel = function( createNewLayer ) {
    var comp = DuAEProject.getActiveComp();
    if (!comp) return;

    createNewLayer = def(createNewLayer, false);

    var layer = null;

    if (!createNewLayer) {
        layer = Duik.Layer.get( Duik.Layer.Type.CEL, true, comp );
        if (layer.length == 0) layer = Duik.Layer.get( Duik.Layer.Type.CEL, false, comp );
        if (layer.length > 0) layer = layer[0];
        else layer = null;
    }

    DuAE.beginUndoGroup( i18n._("New Cel."), false);

    if (!layer) {
        layer = comp.layers.addSolid( [0,0,0], i18n._("Celluloid"), comp.width, comp.height, comp.pixelAspect, comp.duration );
        Duik.Layer.setType(Duik.Layer.Type.CEL, layer);
    }

    var first = true;
	for (var i = 1 ; i <= layer('ADBE Effect Parade').numProperties ; i++)
	{
		if (layer.effect(i).matchName == 'ADBE Paint')
		{
			first = false;
			break;
		}
	}

	var newName = DuAELayer.newUniqueEffectName( i18n._("Celluloid"),layer);
	var paint = layer('ADBE Effect Parade').addProperty('ADBE Paint');
	paint.name = newName;

	if (first) paint.property('ADBE Paint On Transparent').setValue(true);

    DuAE.endUndoGroup( i18n._("New Cel."));
};

Duik.CmdLib['Animation']["Previous Cel"] = "Duik.Animation.previousCel()";
/**
 * Goes to the previous frame in a Duik cel animation
 * @param {int} [exposure=2] The animation exposure
 */
Duik.Animation.previousCel = function(exposure) {
    var comp = DuAEProject.getActiveComp();
    if (!comp) return;

    exposure = def(exposure,2);
    if (isNaN(exposure)) exposure = 2;
    if (exposure < 1) exposure = 1;

    comp.time = comp.time - comp.frameDuration * exposure;

    Duik.Animation.celOnionSkin();
};

Duik.CmdLib['Animation']["Next Cel"] = "Duik.Animation.nextCel()";
/**
 * Goes to the next frame in a Duik cel animation
 * @param {int} [exposure=2] The animation exposure
 */
Duik.Animation.nextCel = function(exposure) {
    var comp = DuAEProject.getActiveComp();
    if (!comp) return;

    exposure = def(exposure,2);
    if (isNaN(exposure)) exposure = 2;
    if (exposure < 1) exposure = 1;

    comp.time = comp.time + comp.frameDuration * exposure;

    Duik.Animation.celOnionSkin();
};

Duik.CmdLib['Animation']["Snap keys"] = "Duik.Animation.snapKeys()";
/**
 * Snaps selected (or all) keyframes to the closest frames if they're in between.
 */
Duik.Animation.snapKeys = function() {
    var props = DuAEComp.getSelectedProps();
    var propList = new DuList(props);
    var selected = true;
    if (propList.length() == 0) {
        var comp = DuAEProject.getActiveComp();
        if (!comp) return;
        if (comp.selectedLayers.length > 0) propList = new DuList(comp.selectedLayers);
        else propList = new DuList(comp.layers);
        selected = false;
    }

    if (propList.length() == 0) return;

    DuAE.beginUndoGroup( i18n._("Snap keys"), false);

    // When modifying properties, keys are deselected. Let's keep the list.
    var selectedKeys = [];
    if (selected) {
        propList.do(function(prop) {
            selectedKeys.push(prop.selectedKeys());
        });
    }

    propList.do(function(prop) {
        prop = new DuAEProperty(prop);
        prop.snapKeys(selectedKeys[propList.current]);
    });

    DuAE.endUndoGroup( i18n._("Snap keys"));
};

Duik.CmdLib['Animation']["Sync keys"] = "Duik.Animation.syncKeys()";
Duik.CmdLib['Animation']["Sync keys on last one"] = "Duik.Animation.syncKeys(true)";
/**
 * Syncs the selected keyframes; moves them to the current time.< br />
 * If multiple keyframes are selected for the same property, they're offset to the current time, keeping the animation.
 * @param {Boolean} [onLast=false] If true, syncs using the last keyframe instead of the first
 */
Duik.Animation.syncKeys = function( onLast ) {
    onLast = def(onLast, false);
    var props = DuAEComp.getSelectedProps();
    props = new DuList(props);
    if (props.length() == 0) return;

    DuAE.beginUndoGroup( i18n._("Sync"), false);

    // When modifying properties, keys are deselected. Let's keep the list.
    var selectedKeys = [];
    props.do(function(prop) {
        selectedKeys.push(prop.selectedKeys(true));
    });

    props.do(function(prop) {
        if (prop.isGroup()) return;
        var keys = selectedKeys[props.current];
        if (keys.length == 0) return;
        // Get offset
        var offset;
        if (onLast) offset = keys[keys.length-1]._time - prop.comp.time;
        else offset = keys[0]._time - prop.comp.time;
        // Move key
        for (var k = keys.length-1; k >= 0; k--) {
            var key = keys[k];
            prop.removeKey( key );
        }
        for (var k = 0; k < keys.length; k++) {
            var key = keys[k];
            prop.setKey(key, -offset);
        }
    });

    DuAE.endUndoGroup( i18n._("Sync"));
};

Duik.CmdLib['Animation']["Sequence layers"] = "Duik.Animation.sequenceLayers()";
/**
 * Sequences selected layers.
 * @param {int} [duration=24] The transition duration, in frames
 * @param {Bool} [moveLayers=true] If set to false, the layer are not moved, and the in or out points are changed instead (layers are "cut")
 * @param {Bool} [useInPoints=true] If moveLayers is false, setting this to false changes the out points instead of the in points (cuts the end instead of the start).
 * @param {Bool} [reverse=false] Set to true to reverse the order.
 * @param {function} [interpolation=DuInterpolation.linear] An interpolation function, taking 4 arguments in the form <code>i(value, min, max, targetMin, targetMax)</code>
 */
Duik.Animation.sequenceLayers = function(duration, moveLayers, useInPoints, reverse, interpolation) {
    var comp = DuAEProject.getActiveComp();
    if (!comp) return;
    var layers = comp.selectedLayers;
    if (layers.length == 0) layers = comp.layers;
    layers = new DuList(layers);
    if (layers.length() == 0) return;

    duration = def(duration, 24);
    moveLayers = def(moveLayers, true);
    useInPoints = def(useInPoints, true);
    reverse = def(reverse, false);
    interpolation = def(interpolation, DuMath.linear);

    DuAE.beginUndoGroup( i18n._("Sequence"), false);

    var n = layers.length();
    var startTime = comp.time;
    duration = duration * comp.frameDuration;
    var endTime = startTime + duration;

    for (var i = 0; i < n; i++) {
        var layer = layers.at(i);
        var s = reverse ? 0 : n-1;
        var e = reverse ? n-1 : 0;
        newTime = interpolation(i, s, e, startTime, endTime);
        if (moveLayers) layer.startTime = newTime - (layer.inPoint - layer.startTime);
        else if (useInPoints) {
            var out = layer.outPoint;
            if (newTime >= layer.outPoint) newTime = layer.outPoint - comp.frameDuration;
            layer.inPoint = newTime;
            layer.outPoint = out;
        }
        else {
            if (newTime <= layer.inPoint) newTime = layer.inPoint + comp.frameDuration;
            layer.outPoint = newTime;
        }
    }//*/

    DuAE.endUndoGroup( i18n._("Sequence"));
};

Duik.CmdLib['Animation']["Sequence keys"] = "Duik.Animation.sequenceKeys()";
/**
 * Sequences selected keyframes.
 * @param {int} [duration=24] The transition duration, in frames
 * @param {Bool} [reverse=false] Set to true to reverse the order.
 * @param {function} [interpolation=DuInterpolation.linear] An interpolation function, taking 4 arguments in the form <code>i(value, min, max, targetMin, targetMax)</code>
 */
Duik.Animation.sequenceKeys = function(duration, reverse, interpolation) {
    var props = DuAEComp.getSelectedProps();
    var propList = new DuList(props);
    if (propList.length() == 0) return;

    DuAE.beginUndoGroup( i18n._("Sequence"), false);

    var comp = propList.at(0).comp;

    // Get animations
    var selectedKeys = [];
    // To fix order, group by category
    var contentKeys = [];
    var maskKeys = [];
    var effectKeys = [];
    var transformKeys = [];
    var geoKeys = [];
    var matKeys = [];
    var styleKeys = [];

    var currentLayerIndex = propList.first().layer.index;

    propList.do(function(prop) {

        // New layer
        if (currentLayerIndex != prop.layer.index) {
            // Concat in the right order
            selectedKeys = selectedKeys.concat(contentKeys);
            selectedKeys = selectedKeys.concat(maskKeys);
            selectedKeys = selectedKeys.concat(effectKeys);
            selectedKeys = selectedKeys.concat(transformKeys);
            selectedKeys = selectedKeys.concat(geoKeys);
            selectedKeys = selectedKeys.concat(matKeys);
            selectedKeys = selectedKeys.concat(styleKeys);

            contentKeys = [];
            maskKeys = [];
            effectKeys = [];
            transformKeys = [];
            geoKeys = [];
            matKeys = [];
            styleKeys = [];

            currentLayerIndex = prop.layer.index;
        }
        
        var keys = prop.selectedKeys();
        if (keys.length == 0) return;
        var p = {};
        p.prop = prop;
        p.anim = prop.animation(true);

        var root = prop.rootPropertyGroup();
        if (root.matchName == 'ADBE Root Vectors Group') contentKeys.push(p);
        else if (root.matchName == 'ADBE Mask Parade') maskKeys.push(p);
        else if (root.matchName == 'ADBE Effect Parade') effectKeys.push(p);
        else if (root.matchName == 'ADBE Transform Group') transformKeys.push(p);
        else if (root.matchName == 'ADBE Extrsn Options Group') geoKeys.push(p);
        else if (root.matchName == 'ADBE Material Options Group') matKeys.push(p);
        else if (root.matchName == 'ADBE Layer Styles') styleKeys.push(p);
        else selectedKeys.push(p);
    });

    // Concat in the right order
    selectedKeys = selectedKeys.concat(contentKeys);
    selectedKeys = selectedKeys.concat(maskKeys);
    selectedKeys = selectedKeys.concat(effectKeys);
    selectedKeys = selectedKeys.concat(transformKeys);
    selectedKeys = selectedKeys.concat(geoKeys);
    selectedKeys = selectedKeys.concat(matKeys);
    selectedKeys = selectedKeys.concat(styleKeys);

    var n = selectedKeys.length;
    var startTime = comp.time;
    duration = duration * comp.frameDuration;
    var endTime = startTime + duration;

    for (var i = 0; i < n; i++) {
        var prop = selectedKeys[i].prop;
        var anim = selectedKeys[i].anim;
        var s = reverse ? 0 : n-1;
        var e = reverse ? n-1 : 0;

        // New time
        var newTime = interpolation(i, s, e, startTime, endTime);
        var offset = newTime - anim.startTime;

        // remove keyframes
        for (var k = anim.keys.length -1; k >= 0; k--)
        {
            prop.removeKey( anim.keys[k] );
        }
        
        prop.setAnim(anim, offset);
    }

    DuAE.endUndoGroup( i18n._("Sequence"));
};

Duik.CmdLib['Animation']["X-Sheet"] = "Duik.Animation.xSheet()";
/**
 * Adjusts the exposure of the animation.
 * @param {Bool} [autoCompute=false] (Try to) auto-compute the best values..
 */
Duik.Animation.xSheet = function( autoCompute ) {
    var comp = DuAEProject.getActiveComp();
    if (!comp) return;

    autoCompute = def(autoCompute, false);

    var props = DuAEComp.getSelectedProps();
    props = new DuList(props);

    DuAE.beginUndoGroup( i18n._("X-Sheet"), false);

    DuAEComp.setUniqueLayerNames(undefined, comp);

    var ok = false;
    var pe = Duik.PseudoEffect.X_SHEET;
    var exp = "";

    if (props.length() > 0) {
        var effect = null;
        props.do(function(prop) {
            if (!prop.riggable()) return;
            var layer = prop.layer;

            // add effect
            if (effect == null) {
                effect = pe.apply(layer);
                exp = [ DuAEExpression.Id.X_SHEET,
                    'var fx = thisComp.layer("' + layer.name + '").effect("' + effect.name + '");',
                    'var mode = fx(' + pe.props['Mode'].index + ');',
                    'var frameDuration = fx(' + pe.props['Frame duration'].index + ').value;',
                    'var xSheet = fx(' + pe.props['X-sheet'].index + ');',
                    'var result = value;',
                    'function getValAtKey(prop)',
                    '{',
                    'if (prop.numKeys > 0)',
                    '{',
                    'var k = prop.nearestKey(time);',
                    'if (k.time > time && k.index > 1) k = prop.key(k.index-1);',
                    'return valueAtTime(k.time);',
                    '}',
                    'else return value;',
                    '}',
                    'if (mode == 1)',
                    '{',
                    'frameDuration = Math.round(frameDuration);',
                    'timef = timeToFrames(time);',
                    'result = valueAtTime(framesToTime( timef - timef%frameDuration ))',
                    '}',
                    'else if (mode == 2) result = getValAtKey(xSheet);',
                    'else if (mode == 3) result = getValAtKey(thisLayer.marker);',
                    'else result = getValAtKey(thisComp.marker);',
                    'result;'
                ].join('\n');
            }
            prop.setExpression(exp, false);
            ok = true;
        });
    }
    if (!ok) {
        var newName = DuAEComp.newUniqueLayerName( i18n._("X-Sheet"),comp);
        var layer = DuAEComp.addAdjustmentLayer(comp);
		layer.name = newName;
        Duik.Layer.setType(Duik.Layer.Type.X_SHEET, layer);

        effect = pe.apply(layer);
        var effectName = effect.name;

        var timeWarp = layer('ADBE Effect Parade').addProperty('ADBE Timewarp');
		timeWarp(1).setValue(1);
		timeWarp(2).setValue(2);
        timeWarp(4).expression = [ DuAEExpression.Id.X_SHEET,
            'var fx = effect("' + effectName + '")',
            'var mode = fx(' + pe.props['Mode'].index + ');',
            'var frameDuration = fx(' + pe.props['Frame duration'].index + ').value;',
            'var xSheet = fx(' + pe.props['X-sheet'].index + ');',
            'var result = timeToFrames(time);',
            'function getValAtKey(prop)',
            '{',
            'if (prop.numKeys > 0)',
            '{',
            'var k = prop.nearestKey(time);',
            'if (k.time > time && k.index > 1) k = prop.key(k.index-1);',
            'return timeToFrames(k.time);',
            '}',
            'else return timeToFrames(time);',
            '}',
            'if (mode == 1)',
            '{',
            'frameDuration = Math.round(frameDuration);',
            'timef = timeToFrames(time);',
            'result = timef - timef%frameDuration;',
            '}',
            'else if (mode == 2) result = getValAtKey(xSheet);',
            'else if (mode == 3) result = getValAtKey(thisLayer.marker);',
            'else result = getValAtKey(thisComp.marker);',
            'result;'
        ].join('\n');
    }

    if (autoCompute && props.length() > 0) {
        //detect limit
        var averageSpeed = DuAEProperty.getAverageSpeed(props);
        if (averageSpeed > 0)
        {
            var precision = averageSpeed*2.5;
            var frames = comp.duration / comp.frameDuration;
            //set Keyframes
            var step = 0;
            effect(pe.props['X-sheet'].index).addKey(0);
            for (var frame = 0 ; frame < frames ; frame++)
            {
                var time = frame * comp.frameDuration;

                var maxSpeed = 0;
                props.do(function(prop) {
                    var speedTest = prop.speedAtTime(time);
                    if (speedTest > maxSpeed) maxSpeed = speedTest;
                });

                step += maxSpeed;

                if (step >= precision && averageSpeed > 0)
                {
                    step = 0;
                    effect(pe.props['X-sheet'].index).addKey(time);
                }
            }
            effect(pe.props['Mode'].index).setValue(2);
        }
    }

    DuAE.endUndoGroup( i18n._("X-Sheet"));
};

Duik.CmdLib['Animation']["Snap IK"] = "Duik.Animation.snapIK()";
/**
 * Snaps the IK to the FK values.
 * @param {Layer[]|DuList.<Layer>} [ctrls] The controllers to snap.
 */
Duik.Animation.snapIK = function( ctrls ) {
    ctrls = def( ctrls, Duik.Controller.get());
    ctrls = new DuList(ctrls);
    if (ctrls.length() == 0) ctrls = new DuList( Duik.Controller.get(false) );
    if (ctrls.length() == 0) return;

    DuAE.beginUndoGroup( i18n._("Snap IK"), false);

    // Find IKs
    var pe = Duik.PseudoEffect.TWO_LAYER_IK;
    var p = pe.props;
    ctrls.do(function(ctrl) {
        var effect = ctrl.effect( pe.matchName );
        // Handle the two layer IK first, if any
        if (effect) {
            // Already IK
            if ( effect(p['IK / FK'].index).value == 1) return;

            var comp = ctrl.containingComp;

            // Get the layers
            var lowerIndex = effect( p['Data']['Layers']['Lower'].index ).value;
            var upperIndex = effect( p['Data']['Layers']['Upper'].index ).value;
            // can't do
            if (!lowerIndex || !upperIndex) return;

            // Position of the controller
            var goalIndex = effect( p['Data']['Layers']['Goal'].index ).value;
            if (goalIndex) {
                var goal = comp.layer(goalIndex);
                var pos = DuAELayer.getWorldPos( goal );
                // Set the position of the controller
                var parent = ctrl.parent;
                ctrl.parent = null;
                var posProp = ctrl.transform.position;
                if (posProp.dimensionsSeparated) {
                    var xpos = new DuAEProperty(ctrl.transform.property('ADBE Position_0'));
                    xpos.setValue(pos[0]);
                    var ypos = new DuAEProperty(ctrl.transform.property('ADBE Position_1'));
                    ypos.setValue(pos[1]);
                }
                else {
                    posProp = new DuAEProperty(posProp);
                    posProp.setValue(pos);
                }
                ctrl.parent = parent;
                //fix goal rotation
                var rot = goal.transform.rotation.value;
                var goalParent = goal.parent;
                while(goalParent) {
                    rot += goalParent.transform.rotation.value;
                    goalParent = goalParent.parent;
                }
                var rotProp = new DuAEProperty( ctrl.transform.rotation );
                rotProp.setValue(rot);
            }
            else {
                var lower = comp.layer(lowerIndex);
                var pos = effect( p['Data']['Stretch data']['FK Goal relative position'].index ).value;
                var parent = ctrl.parent;
                ctrl.parent = lower;
                var posProp = ctrl.transform.position;
                if (posProp.dimensionsSeparated) {
                    var xpos = new DuAEProperty(ctrl.transform.property('ADBE Position_0'));
                    xpos.setValue(pos[0]);
                    var ypos = new DuAEProperty(ctrl.transform.property('ADBE Position_1'));
                    ypos.setValue(pos[1]);
                }
                else {
                    posProp = new DuAEProperty(posProp);
                    posProp.setValue(pos);
                }
                ctrl.parent = parent;
            }

            // Adjust side
            var lowerFK = effect(p['FK']['Lower'].index).value;
            var sideFX = new DuAEProperty( effect( p['Side'].index ) );
            if (lowerFK < 0) sideFX.setValue(100);
            else sideFX.setValue(-100);
        }
    });

    DuAE.endUndoGroup( i18n._("Snap IK"));
};

Duik.CmdLib['Animation']["Snap FK"] = "Duik.Animation.snapFK()";
/**
 * Snaps the FK to the IK values.
 * @param {Layer[]|DuList.<Layer>} [ctrls] The controllers to snap.
 */
Duik.Animation.snapFK = function( ctrls ) {
    ctrls = def( ctrls, Duik.Controller.get());
    ctrls = new DuList(ctrls);
    if (ctrls.length() == 0) ctrls = new DuList( Duik.Controller.get(false) );
    if (ctrls.length() == 0) return;

    DuAE.beginUndoGroup( i18n._("Snap FK"), false);

    // Find a 2-layer IK
    var pe = Duik.PseudoEffect.TWO_LAYER_IK;
    var p = pe.props;
    ctrls.do(function(ctrl) {
        var effect = ctrl.effect( pe.matchName );
        if (!effect) return;
        // Already FK
        var ikfkProp = effect(p['IK / FK'].index);
        if ( ikfkProp.value == 0) return;

        var comp = ctrl.containingComp;

        var ikRot = effect(p['Data']['Angles']['Upper angle'].index).value;

        // Temporarilly set FK to get the offset on the upper part
        var removeKey = false;
        if (ikfkProp.numKeys > 0) {
            removeKey = true;
            if (ikfkProp.keyTime( ikfkProp.nearestKeyIndex(comp.time) ) == comp.time) removeKey = false;
            ikfkProp.setValueAtTime( comp.time, 0);
        }
        else ikfkProp.setValue(0);

        var fkRot = effect(p['Data']['Angles']['Upper angle'].index).value;

        if (removeKey) ikfkProp.removeKey( ikfkProp.nearestKeyIndex(comp.time) );
        else ikfkProp.setValue(1);

        var newRot = fkRot - ikRot;

        // Get the IK values, and set them to IK
        var upperProp = new DuAEProperty( effect( p['FK']['Upper'].index ) );
        var lowerProp = new DuAEProperty( effect( p['FK']['Lower'].index ) );
        var endProp = new DuAEProperty( effect( p['FK']['End'].index ) );
        upperProp.setValue( upperProp.value() - newRot );
        lowerProp.setValue( effect(p['Data']['Angles']['Lower angle'].index ).value );
        endProp.setValue( effect(p['Data']['Angles']['Goal angle'].index ).value );
    });

    DuAE.endUndoGroup( i18n._("Snap FK"));
};

Duik.CmdLib['Animation']["Switch IK/FK"] = "Duik.Animation.switchIKFK()";
/**
 * Switches between IK and FK.
 * @param {Layer[]|DuList.<Layer>} [ctrls] The controllers to switch.
 * @param {bool} [addKeyframes=true] Whether to add keyframes on FK and IK properties to keep the switch at the current frame.
 */
Duik.Animation.switchIKFK = function( ctrls, addKeyframes ) {
    addKeyframes = def(addKeyframes, true);
    ctrls = def( ctrls, Duik.Controller.get());
    ctrls = new DuList(ctrls);
    if (ctrls.length() == 0) ctrls = new DuList( Duik.Controller.get(false) );
    if (ctrls.length() == 0) return;

    DuAE.beginUndoGroup( i18n._("IK/FK Switch"), false);

    // the IK effects
    var pe2 = Duik.PseudoEffect.TWO_LAYER_IK;
    var pe1 = Duik.PseudoEffect.ONE_LAYER_IK;
    var p2 = pe2.props;
    var p1 = pe1.props;
    ctrls.do(function(ctrl) {
        // Check if we're IK or FK
        var effect = ctrl.effect(pe2.matchName);
        var ik;
        if (effect) ik = effect( p2['IK / FK'].index ).value;
        else {
            effect = ctrl.effect(pe1.matchName);
            if (effect) ik = effect( p1['IK'].index ).value;
            else return;
        } 
        
        if (ik == 1) Duik.Animation.snapFK(ctrl);
        else Duik.Animation.snapIK(ctrl);

        // Switch all
        var comp = ctrl.containingComp;
        var effects = ctrl.property('ADBE Effect Parade');

        // Start with 2-layer IK
        var two = false;
        for (var i = 1; i <= effects.numProperties; i++) {
            var effect = effects(i);
            if (effect.matchName != pe2.matchName) continue;
            var ikfkProp = new DuAEProperty( effect( p2['IK / FK'].index ));
            if (ikfkProp.value() != ik ) continue;
            two = true;
            ikfkProp.setValue( 1-ik );

            if (addKeyframes) {
                // If there's no keyframe before time, we need one
                if (ikfkProp.numKeys() == 0) ikfkProp.setValueAtTime( ik, 0 );
                else if (ikfkProp.keyTime(1) >= comp.time ) ikfkProp.setValueAtTime(ik, 0 );
                // Add the current key
                ikfkProp.setValueAtTime( 1-ik, comp.time );

                if (ik == 0) {
                    var sideFX = effect( p2['Side'].index );
                    sideFX.setValueAtTime( comp.time, sideFX.value );

                    var rot = ctrl.transform.rotation;
                    rot.setValueAtTime(comp.time, rot.value);

                    var pos = ctrl.transform.position;
                    if (pos.dimensionsSeparated) {
                        var xpos = ctrl.transform.property('ADBE Position_0');
                        var ypos = ctrl.transform.property('ADBE Position_1');
                        xpos.setValueAtTime(comp.time, xpos.value);
                        ypos.setValueAtTime(comp.time, ypos.value);
                    }
                    else {
                        pos.setValueAtTime(comp.time, pos.value);
                    }
                }
                else {
                    effect( p2['FK']['Upper'].index ).setValueAtTime(comp.time,effect( p2['FK']['Upper'].index ).value );
                    effect( p2['FK']['Lower'].index ).setValueAtTime(comp.time, effect( p2['FK']['Lower'].index ).value );
                    effect( p2['FK']['End'].index ).setValueAtTime(comp.time, effect( p2['FK']['End'].index ).value );
                }
            }
        }

        // And adjust 1-layer IK
        var moved = false;
        for (var i = 1; i <= effects.numProperties; i++) {
            var effect = effects(i);
            if (effect.matchName != pe1.matchName) continue;
            var ikfkProp = new DuAEProperty( effect( p1['IK'].index ) );
            if ( ikfkProp.value() != ik ) continue;
            var layerIndex = effect( p1['Data']['Layer'].index ).value;
            if (!layerIndex) continue;
            var layer = comp.layer(layerIndex);
            // Snap it !
            // Keep the original rotation
            var fkRot = layer.transform.rotation.value;

            if (addKeyframes) ikfkProp.setValue( 1-ik );
            else ikfkProp.setValueAtTime(1-ik, comp.time );

            // Get the new rotation
            var ikRot = layer.transform.rotation.value;

            // We can't move the controller anymore,
            // So adjust the FK value instead.
            if (two || moved || ik == 1) {
                var fkProp = new DuAEProperty( effect( p1['FK'].index ) );
                if (addKeyframes) fkProp.setValueAtTime( fkProp.value() - ikRot + fkRot, comp.time );
                else fkProp.setValue( fkProp.value() - ikRot + fkRot );
                
            }
            else if (ik == 0) {
                // Use a null to get the new coordinates
                var no = DuAEComp.addNull( comp, 20, layer );
                var n = DuAEComp.addNull( comp, 20, ctrl );
                n.parent = no;
                no.transform.rotation.setValue( fkRot - ikRot );
                n.parent = ctrl.parent;
                var pos = ctrl.transform.position;
                var newPos = n.transform.position.value;
                if (pos.dimensionsSeparated) {
                    var xpos = new DuAEProperty( ctrl.transform.property('ADBE Position_0') );
                    var ypos = new DuAEProperty( ctrl.transform.property('ADBE Position_1') );
                    if (addKeyframes) {
                        xpos.setValueAtTime(newPos[0], comp.time);
                        ypos.setValueAtTime(newPos[1], comp.time);
                    }
                    else {
                        xpos.setValue(newPos[0]);
                        ypos.setValue(newPos[1]);
                    }
                }
                else {
                    pos = new DuAEProperty(pos);
                    if (addKeyframes) pos.setValueAtTime(newPos, comp.time);
                    else pos.setValue( newPos );
                }
                no.remove();
                n.remove();
                moved = true;
            }
        }
    });

    DuAE.endUndoGroup( i18n._("IK/FK Switch"));
};

Duik.CmdLib['Animation']["Clean Keyframes"] = "Duik.Animation.cleanKeyframes()";
/**
 * Removes all unneeded keyframes
 * @param {Property|DuAEProperty|Property[]|DuAEProperty[]|DuList} [props=DuAEComp.getSelectedProps()] The properties 
 */
Duik.Animation.cleanKeyframes = function( props ) {
    if (!isdef(props))
        props = DuAEComp.getSelectedProps();

    props = new DuList(props);
    if (props.length() == 0) return;

    DuAE.beginUndoGroup(i18n._("Clean keyframes"), false);

    props.do(function (prop)
    {
        prop.cleanKeyframes();
    });

    DuAE.endUndoGroup(i18n._("Clean keyframes"));
};