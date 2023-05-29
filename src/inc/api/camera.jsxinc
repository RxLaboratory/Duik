/**
 * Camera toolkit
 * @namespace
 * @category Duik
 */
Duik.Camera = {}

/**
 * Some Camera presets
 * @enum {File}
 * @readonly
 */
Duik.Camera.Presets =
{
    FRAME: duframe.toFile()
}

/**
 * The list of camera functions
 */
Duik.CmdLib['Camera'] = [];

Duik.CmdLib['Camera']["Framing guides"] = "Duik.Camera.frame()";
/**
 * Adds framing guides to the composition
 * @param {CompItem} [comp] The composition. The active composition if omitted.
 * @return {ShapeLayer} The frame layer
 */
Duik.Camera.frame = function( comp )
{
    comp = def(comp, DuAEProject.getActiveComp());
    if (!comp) return null;

    DuAE.beginUndoGroup( i18n._("Framing guides"), false );

    //a shape layer
	var frame = comp.layers.addShape();
	frame.name = "Frame";
	DuAELayer.applyPreset(frame, Duik.Camera.Presets.FRAME);

	frame.guideLayer = true;

    DuAE.endUndoGroup( i18n._("Framing guides") );
}

Duik.CmdLib['Camera']["Scale Z-link"] = "Duik.Camera.scaleZLink()";
/**
 * Adds an inverse constraint of the scale to the depth (Z position) of the 3D layers, so that their visual size doesn't change with their depth.<br />
 * Works as a toggle: first run activates the effect, next run removes it from the selected layers.
 * @param {Layer[]|Layer|DuList.<Layer>} [layers] The layers to constrain. The selected layers if omitted.$
 * @return {int} Error code. 1: OK; 0: No camera in the comp, -1: No (selected) layers.
 */
Duik.Camera.scaleZLink = function( layers )
{
    layers = def(layers, DuAEComp.getSelectedLayers() );
    layers = new DuList(layers);
    if( layers.isEmpty() ) return -1;

    // Get the camera (in the layers if possible)
    var camera = DuAEComp.camera( layers );
    if (!camera) return 0;

    // Go!
    DuAE.beginUndoGroup( i18n._("Scale Z-Link"), false );

    // If the camera is locked, unlock it temporarilly
    var camLocked = camera.locked;
    camera.locked = false;

    layers.do( function(layer )
    {
        var currentDistance = DuAELayer.getDistance(layer,camera);
        if (currentDistance == 0) currentDistance = 1;
        var currentScale = layer.transform.scale.value;
		var alreadyLinked = false;

        var expr = layer.transform.scale.expression;
        if (expr.indexOf( DuAEExpression.Id.SCALE_Z_LINK ) === 0) alreadyLinked = true;

        if(alreadyLinked)
		{
			var scale = layer.transform.scale.value;
			layer.transform.scale.expression = '';

			var prop = layer.Effects.property('Scale Z-Link');
			if (prop != null) prop.remove();
			layer.transform.scale.setValue(scale);

			DuAETag.removeGroup(layer, 'SZL');
		}
		else
		{
			if (!layer.threeDLayer) layer.threeDLayer = true;
			if (!layer.threeDLayer) return;
			if (!layer.Effects) return;

			var effect = layer.Effects.addProperty("ADBE Slider Control");
			effect.name = 'Scale Z-Link';

			effect(1).setValue(currentScale[0]);

			layer.transform.scale.expression = [ DuAEExpression.Id.SCALE_Z_LINK,
				'var sca = effect("' + effect.name + '")(1);',
				'var C = thisComp.layer("' + camera.name + '").position;',
				'var O = thisLayer.toWorld(thisLayer.anchorPoint);',
				'var oDist = ' + currentDistance + ';',
                'var result = value;',
				'if (sca != 0) {',
				'   var factor = oDist / sca;',
				'   var dist = length(C,O);',
				'   result = dist/factor;',
				'   result = [result,result,result];',
				'} else result = [0,0,0];',
                'result;'
            ].join('\n');

            DuAETag.addGroup( layer, 'SZL' );
		}
    });


    camera.locked = camLocked;

    DuAE.endUndoGroup( i18n._("Scale Z-Link") );

    return 1;
}

Duik.CmdLib['Camera']["Camera rig"] = "Duik.Camera.rig()";
/**
 * Rigs a camera to make it easier to animate
 * @param {CameraLayer} [camera] The camera to rig. If omitted, will try to find it in selected layers or the active comp.
 * @return {ShapeLayer[]} An array of controllers: [target, cam, main], which may be empty if no camera was found or if it was a one-node camera.
 */
Duik.Camera.rig = function( camera )
{
    camera = def(camera, DuAEComp.camera());
    if (!camera) return [];

    // Check if it's a two-node camera
    try
    {
        camera.pointOfInterest.expression = '';
    }
    catch(e)
    {
        return [];
    }

    DuAE.beginUndoGroup( i18n._("Camera Rig"), false);

    camera.locked = false;

    var comp = camera.containingComp;

    //create target
	var targetCtrl = Duik.Controller.create(comp, Duik.Controller.Type.POSITION );
    Duik.Controller.setCharacterName( i18n._("Camera"), targetCtrl );
    Duik.Controller.setLimbName( i18n._("Target"), targetCtrl );
	targetCtrl.threeDLayer = true;
	targetCtrl.position.setValue(camera.transform.pointOfInterest.value);

    //create cam
	var camCtrl = Duik.Controller.create(comp, Duik.Controller.Type.POSITION );
	Duik.Controller.setCharacterName( i18n._("Camera"), camCtrl );
    Duik.Controller.setLimbName( i18n._("Cam"), camCtrl ); /// TRANSLATORS: Short for 'Camera'
	camCtrl.threeDLayer = true;
	camCtrl.position.setValue(camera.transform.position.value);

    //create main
	var mainCtrl = Duik.Controller.create(comp, Duik.Controller.Type.CAMERA);
	Duik.Controller.setCharacterName( i18n._("Camera"), mainCtrl );
    Duik.Controller.setLimbName( camera.name, mainCtrl );
	mainCtrl.threeDLayer = true;
	mainCtrl.position.setValue(camera.transform.position.value);

    camCtrl.parent = mainCtrl;
	targetCtrl.parent = mainCtrl;

    //expressions in the camera layer
	camera.position.expression = DuAEExpression.Id.CAMERA_RIG + '\nthisComp.layer("' + camCtrl.name + '").toWorld(thisComp.layer("' + camCtrl.name + '").transform.anchorPoint.value);';
	camera.pointOfInterest.expression =  DuAEExpression.Id.CAMERA_RIG + '\nthisComp.layer("' + targetCtrl.name + '").toWorld(thisComp.layer("' + targetCtrl.name + '").transform.anchorPoint.value);';
	camera.orientation.expression =  DuAEExpression.Id.CAMERA_RIG + '\nthisComp.layer("' + camCtrl.name + '").transform.orientation.value;';
	camera.xRotation.expression =  DuAEExpression.Id.CAMERA_RIG + '\nthisComp.layer("' + camCtrl.name + '").transform.xRotation.value';
	camera.yRotation.expression =  DuAEExpression.Id.CAMERA_RIG + '\nthisComp.layer("' + camCtrl.name + '").transform.yRotation.value';
	if (DuAE.version.version >= 16) camera.rotation.expression =  DuAEExpression.Id.CAMERA_RIG + '\n' + 'value + thisComp.layer("' + camCtrl.name + '").transform.zRotation.value';
	else camera.rotation.expression =  DuAEExpression.Id.CAMERA_RIG + '\n' + 'value + thisComp.layer("' + camCtrl.name + '").transform.rotation.value';

	//camera behaviour
	var behaviourPE = Duik.PseudoEffect.CAMERA_BEHAVIOUR;
	var behaviourEffect = behaviourPE.apply( mainCtrl );
	var p = behaviourPE.props;

	// To be reused in different expressions:
	var fxLink = 'var fx = thisComp.layer("' + mainCtrl.name + '").effect("' + behaviourEffect.name + '");';
	// interpolation FX
	var iTypeFX = 'var iType = fx(' + p["Type of motion"].index + ').value;';
	var iRateFX = 'var iRate = fx(' + p["Easing / Acceleration rate"].index + ').value;';
	var bUseAdvancedFX = 'var bUseAdvanced = fx(' + p["Easy-Bezier options"]["Use advanced options"].index + ').value;';
	var bInIFX = 'var bInI = fx(' + p["Easy-Bezier options"]["Advanced"]["Ease in"].index + ').value / 100;';
	var bInVFX = 'var bInV = fx(' + p["Easy-Bezier options"]["Advanced"]["Velocity in"].index + ').value / 100;';
	var bOutIFX = 'var bOutI = fx(' + p["Easy-Bezier options"]["Advanced"]["Ease out"].index + ').value / 100;';
	var bOutVFX = 'var bOutV = fx(' + p["Easy-Bezier options"]["Advanced"]["Velocity out"].index + ').value / 100;';
	var bRatioFX = 'var bRatio = fx(' + p["Easy-Bezier options"]["Ease in/Ease out Ratio"].index + ').value / 100;';
	// behaviour FX
	var gFreqFX = 'var gFreq = fx(' + p["Random motion"]["Frequency"].index + ').value;';
	var gPosAmpFX = 'var gAmp = fx(' + p["Random motion"]["Position amplitude"].index + ').value;';
	var gRotAmpFX = 'var gAmp = fx(' + p["Random motion"]["Rotation amplitude"].index + ').value;';
	var sFreqFX = 'var sFreq = fx(' + p["Camera shake"]["Frequency"].index + ').value;';
	var sPosAmpFX = 'var sAmp = fx(' + p["Camera shake"]["Position amplitude"].index + ').value;';
	var sRotAmpFX = 'var sAmp = fx(' + p["Camera shake"]["Rotation amplitude"].index + ').value;';
	var typeFX = 'var type = fx(' + p["Type of camera"].index + ').value;';
	var seedFX = 'var seed = fx(' + p["Advanced"]["Random Seed"].index + ').value;';

	// Interpolation expression body
	var iExprBody = [
		'if (iType == 2) iRate = linearExtrapolation(iRate, 0, 30, 0, 2);',
		'else if (iType == 3) iRate = linearExtrapolation(iRate, 0, 30, 0, 10);',
		'else if (iType == 1) iRate = linear(iRate, 1, 30, -1, 1);',
		'',
		DuAEExpression.Library.get([
			'isStill',
			'continueOut',
			'continueIn',
			'bezierInterpolation',
			'gaussianInterpolation',
			'linearExtrapolation',
			'logInterpolation',
			'expInterpolation',
			'getPrevKey',
			'getNextKey'
		]),
		'function iAtTime( t )',
		'{',
		'   // Needed keyframes',
		'	var pKey = getPrevKey(t, thisProperty);',
		'	var nKey = getNextKey(t, thisProperty);',
		'	',
		'	if (!pKey || !nKey) return value;',
		'	',
		'	if (iType == 6) // None',
		'	{',
		'	  return valueAtTime(t);',
		'	}',
		'	else if (iType == 5) // Linear ',
		'	{',
		'	  return linear(',
		'			t,',
		'			pKey.time,',
		'			nKey.time,',
		'			pKey.value,',
		'			nKey.value',
		'		);',
		'	}',
		'	else if (iType == 4) // Bezier',
		'	{',
		'    if (bUseAdvanced)',
		'    {',
		'      return bezierInterpolation(',
		'        t,',
		'        pKey.time,',
		'        nKey.time,',
		'        pKey.value,',
		'        nKey.value,',
		'        [bInI, bInV, 1 - bOutI, 1 - bOutV]',
		'      );',
		'    }',
		'    else',
		'    {',
		'      var bIn = linear(iRate, 0, 10, 0.0, 1.0) * bRatio;',
		'      var bOut = linear(iRate, 0, 10, 0.0, 1.0) * (1-bRatio);',
		'      bOut = 1 - bOut;',
		'      ',
		'      return bezierInterpolation(',
		'        t,',
		'        pKey.time,',
		'        nKey.time,',
		'        pKey.value,',
		'        nKey.value,',
		'        [bIn, 0, bOut, 1]',
		'      );',
		'    }',
		'	}',
		'	else if (iType == 1) // Gaussian (start\'n\'stop)',
		'	{',
		'	  return gaussianInterpolation(',
		'	    t,',
		'	    pKey.time,',
		'      nKey.time,',
		'      pKey.value,',
		'      nKey.value,',
		'      iRate',
		'	  );',
		'	}',
		'	else if (iType == 3) // Logarithmic (stop)',
		'	{',
		'	  return logInterpolation(',
		'	    t,',
		'	    pKey.time,',
		'	    nKey.time,',
		'	    pKey.value,',
		'	    nKey.value,',
		'	    iRate',
		'	  );',
		'	}',
		'	else if (iType == 2) // Exponential (start)',
		'	{',
		'	    return expInterpolation(',
		'	        t,',
		'	        pKey.time,',
		'	        nKey.time,',
		'	        pKey.value,',
		'	        nKey.value,',
		'	        iRate',
		'	    );',
		'	}',
		'	',
		'	return -1;',
		'}',
		'',
		'function i() {',
		'	if (numKeys < 2) return value;',
		'	',
		'	var inExtrapolation = iType == 2;',
		'	var outExtrapolation = iType == 3;',
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
		'	  // In Extrapolation',
		'	  if (inExtrapolation)',
		'	  {',
		'	    var inTime = time;',
		'	    var nextKey = getNextKey(time, thisProperty);',
		'	    ',
		'		if (iType == 6) inVal = continueIn(inTime, inDamping); // None',
		'		else if (iType == 5 && nextKey) // Linear ',
		'		{',
		'		    var firstVelocity = (nextKey.value - iAtTime(nextKey.time + 0.01)) * 100;',
		'  			var timeSpent = nextKey.time - time;',
		'  			var damp = Math.exp(timeSpent * inDamping);',
		'  			inVal = (timeSpent * firstVelocity)/damp + nextKey.value;',
		'		} else if (iType == 4 && nextKey) // Bezier',
		'		{',
		'			if (!bUseAdvanced) inVal = value;',
		'			else',
		'			{',
		'  				if (bInV == 0) inVal = value;',
		'  				else ',
		'  				{',
		'  					var firstVelocity = (iAtTime(nextKey.time + 0.01) - nextKey.value) * 100;',
		'    				var timeSpent = nextKey.time - time;',
		'    				var damp = Math.exp(timeSpent * inDamping);',
		'    				inVal = (-timeSpent * firstVelocity) / damp + nextKey.value;',
		'  				}',
		'			}',
		'		} else if (iType == 1) // Gaussian',
		'		{',
		'			inVal = value;',
		'		} else if (iType == 3) // Log',
		'		{',
		'			inVal = value;',
		'		} else if (iType == 2 && nextKey) // Exp ',
		'		{',
		'			var previousKey = nextKey;',
		'			if (previousKey.index < numKeys)',
		'			{',
		'				var nextKey = key(previousKey.index + 1);',
		'  				inVal = expInterpolation(',
		'  					time,',
		'  					previousKey.time,',
		'  					nextKey.time,',
		'  					previousKey.value,',
		'  					nextKey.value,',
		'  					iRate',
		'  				);',
		'			}',
		'		}',
		'	  }',
		'	  // Out Extrapolation',
		'	  if (outExtrapolation)',
		'	  {',
		'	    var outTime = time;',
		'	    var prevKey = getPrevKey(time, thisProperty);',
		'	    ',
		'		if (iType == 6) outVal = continueOut(outTime, outDamping); // None',
		'		else if (iType == 5 && prevKey) // Linear ',
		'		{',
		'			var lastVelocity = (prevKey.value - iAtTime(prevKey.time - 0.01)) * 100;',
		'			var timeSpent = time - prevKey.time;',
		'			var damp = Math.exp(timeSpent * outDamping);',
		'			outVal = prevKey.value + (timeSpent * lastVelocity)/damp;',
		'		} else if (iType == 4 && prevKey) // Bezier',
		'		{',
		'			if (!bUseAdvanced) outVal = value;',
		'			else ',
		'			{',
		'  				if (bOutV == 0) outVal = value;',
		'  				else',
		'  				{',
		'  					var lastVelocity = ( prevKey.value - iAtTime(prevKey.time - 0.01)) * 100;',
		'    				var timeSpent = time - prevKey.time;',
		'    				var damp = Math.exp(timeSpent * outDamping);',
		'    				outVal = prevKey.value + (timeSpent * lastVelocity)/damp;',
		'  				}',
		'			}',
		'		} else if (iType == 1) // Gaussian',
		'		{',
		'			outVal = value;',
		'		} else if (iType == 3 && prevKey) // Log',
		'		{',
		'			var nextKey = prevKey;',
		'			if (nextKey.index > 0)',
		'			{',
		'				prevKey = key(nextKey.index - 1);',
		'				outVal = logInterpolation(',
		'  					time,',
		'  					prevKey.time,',
		'  					nextKey.time,',
		'  					prevKey.value,',
		'  					nextKey.value,',
		'  					iRate',
		'  				);',
		'			}',
		'		} else if (iType == 2 && prevKey) // Exp ',
		'		{',
		'			var nextKey = prevKey;',
		'			if (nextKey.index > 0)',
		'			{',
		'				 prevKey = key(nextKey.index - 1);',
		'				 outVal = expInterpolation(',
		'  					time,',
		'  					prevKey.time,',
		'  					nextKey.time,',
		'  					prevKey.value,',
		'  					nextKey.value,',
		'  					iRate',
		'  				);',
		'			}',
		'		}',
		'	  }',
		'	  ',
		'	  if (!pKey) return inVal;',
		'	  if (!nKey) return outVal;',
		'	  ',
		'	  // Blend',
		'	  return ease( time, pKey.time, nKey.time, outVal, inVal);',
		'	}',
		'',
		'	return iAtTime(time);',
		'}'
	].join('\n');

	// Default interpolation expression
	var iExpr = [ DuAEExpression.Id.CAMERA_RIG,
		fxLink,
		iTypeFX,
		iRateFX,
		bUseAdvancedFX,
		bInIFX,
		bOutIFX,
		bInVFX,
		bOutVFX,
		bRatioFX,
		'',
		'var result = value;',
		'',
		iExprBody,
		'',
		'if (fx.enabled) result = i();',
		'result;'
	].join('\n');

	mainCtrl.orientation.expression = iExpr;
	camCtrl.position.expression = iExpr;
	camCtrl.orientation.expression = iExpr;
	camCtrl.xRotation.expression = iExpr;
	camCtrl.yRotation.expression = iExpr;
	targetCtrl.position.expression = iExpr;
	targetCtrl.orientation.expression = iExpr;
	targetCtrl.xRotation.expression = iExpr;
	targetCtrl.yRotation.expression = iExpr;
	if (DuAE.version.version >= 16) targetCtrl.rotation.expression = iExpr;
	else targetCtrl.rotation.expression = iExpr;

	// Position
	mainCtrl.position.expression = [ DuAEExpression.Id.CAMERA_RIG,
		fxLink,
		gFreqFX,
		gPosAmpFX,
		sFreqFX,
		sPosAmpFX,
		typeFX,
		seedFX,
		iTypeFX,
		iRateFX,
		bUseAdvancedFX,
		bInIFX,
		bOutIFX,
		bInVFX,
		bOutVFX,
		bRatioFX,
		'',
		'var result = value;',
		'',
		'function camRandomMotion()',
		'{',
		'	// Adjust values',
		'	seedRandom(seed);',
		'	var complexity = 1;',
		'	gAmp = gAmp * thisComp.width / 100;',
		'	sAmp = sAmp * thisComp.width / 1000;',
		'	if (type == 2)',
		'	{',
		'	   gAmp = gAmp/2;',
		'	   gFreq = gFreq*2;',
		'	   complexity = 3;',
		'	}',
		'	else if (type == 3)',
		'	{',
		'	   gAmp = gAmp/4;',
		'	   complexity = 2;',
		'	}',
		'	else gAmp = 0;',
		'	// Compute Wiggle',
		'	var gw = wiggle(gFreq,gAmp, complexity , 0.5);',
		'	gw -= value;',
		'	var sw = wiggle(sFreq,sAmp, complexity , 0.5);',
		'	sw -= value;',
		'	// Adjust results',
		'	if (type == 4) sw[0] /= 2;',
		'	var r = sw + gw;',
		'	// Adjust Z',
		'	if (type == 2) r[2] /= 2;',
		'	else if (type == 3) r[2] = 0;',
		'	return r;',
		'}',
		'',
		iExprBody,
		'',
		'if (fx.enabled)',
		'{',
		'	result = camRandomMotion() + i();',
		'}',
		'result;'
	].join('\n');
	// X Rotation
	mainCtrl.xRotation.expression = [ DuAEExpression.Id.CAMERA_RIG,
		fxLink,
		gFreqFX,
		gRotAmpFX,
		sFreqFX,
		sRotAmpFX,
		typeFX,
		seedFX,
		iTypeFX,
		iRateFX,
		bUseAdvancedFX,
		bInIFX,
		bOutIFX,
		bInVFX,
		bOutVFX,
		bRatioFX,
		'',
		'var result = value;',
		'',
		'function camRandomMotion()',
		'{',
		'	// Adjust values',
		'	seedRandom(seed+1);',
		'	var complexity = 1;',
		'	gAmp = gAmp * thisComp.width / 5000;',
		'	sAmp = sAmp * thisComp.width / 50000;',
		'	if (type == 2)',
		'	{',
		'	   gAmp = gAmp/2;',
		'	   gFreq = gFreq*2;',
		'	   complexity = 3;',
		'	}',
		'	else if (type == 3)',
		'	{',
		'	   gAmp = gAmp*3/4;',
		'	   sAmp = sAmp/2;',
		'	   complexity = 3;',
		'	}',
		'	else if (type == 4)',
		'	{',
		'	   gAmp = 0;',
		'	   sAmp = sAmp/2;',
		'	}',
		'	else if (type == 5)',
		'	{',
		'	   gAmp = gAmp/3;',
		'	   sAmp = sAmp/4;',
		'	}',
		'	else',
		'	{',
		'	   gAmp = 0;',
		'	   sAmp = 0;',
		'	}',
		'	// Compute Wiggle',
		'	var gw = wiggle(gFreq,gAmp, complexity , 0.7);',
		'	gw -= value;',
		'	var sw = wiggle(sFreq,sAmp, complexity, 0.7);',
		'	sw -= value;',
		'	return sw + gw;',
		'}',
		'',
		iExprBody,
		'',
		'if (fx.enabled)',
		'{',
		'	result = camRandomMotion() + i();',
		'}',
		'result;'
	].join('\n');
	// Y Rotation
	mainCtrl.yRotation.expression = [ DuAEExpression.Id.CAMERA_RIG,
		fxLink,
		gFreqFX,
		gRotAmpFX,
		sFreqFX,
		sRotAmpFX,
		typeFX,
		seedFX,
		iTypeFX,
		iRateFX,
		bUseAdvancedFX,
		bInIFX,
		bOutIFX,
		bInVFX,
		bOutVFX,
		bRatioFX,
		'',
		'var result = value;',
		'',
		'function camRandomMotion()',
		'{',
		'	// Adjust values',
		'	seedRandom(seed+2);',
		'	var complexity = 1;',
		'	gAmp = gAmp * thisComp.width / 5000;',
		'	sAmp = sAmp * thisComp.width / 50000;',
		'	if (type == 2)',
		'	{',
		'	   gAmp = gAmp/2;',
		'	   gFreq = gFreq*2;',
		'	   complexity = 3;',
		'	}',
		'	else if (type == 3)',
		'	{',
		'	   gAmp = gAmp*3/4;',
		'	   sAmp = sAmp/2;',
		'	   complexity = 3;',
		'	}',
		'	else if (type == 4)',
		'	{',
		'	   gAmp = 0;',
		'	   sAmp = sAmp/4;',
		'	}',
		'	else if (type == 5)',
		'	{',
		'	   gAmp = gAmp/3;',
		'	   sAmp = sAmp/4;',
		'	}',
		'	else',
		'	{',
		'	   gAmp = 0;',
		'	   sAmp = 0;',
		'	}',
		'	// Compute Wiggle',
		'	var gw = wiggle(gFreq,gAmp, complexity , 0.7);',
		'	gw -= value;',
		'	var sw = wiggle(sFreq,sAmp, complexity , 0.7);',
		'	sw -= value;',
		'	return sw + gw;',
		'}',
		'',
		iExprBody,
		'',
		'if (fx.enabled)',
		'{',
		'	result = camRandomMotion() + i();',
		'}',
		'result;'
	].join('\n');
	// Z Rotation (not the same controller!)
	var zExp = [ DuAEExpression.Id.CAMERA_RIG,
		fxLink,
		gFreqFX,
		gRotAmpFX,
		sFreqFX,
		sRotAmpFX,
		typeFX,
		seedFX,
		iTypeFX,
		iRateFX,
		bUseAdvancedFX,
		bInIFX,
		bOutIFX,
		bInVFX,
		bOutVFX,
		bRatioFX,
		'',
		'var result = value;',
		'',
		'function camRandomMotion()',
		'{',
		'	// Adjust values',
		'	seedRandom(seed+3);',
		'	var complexity = 1;',
		'	if (type == 2)',
		'	{',
		'	   gAmp = gAmp/5;',
		'	   sAmp = sAmp/5;',
		'	   gFreq = gFreq*2;',
		'	   complexity = 3;',
		'	}',
		'	else if (type == 3)',
		'	{',
		'	   gAmp = gAmp/15;',
		'	   sAmp = sAmp/15;',
		'	   complexity = 2;',
		'	}',
		'	else',
		'	{',
		'	   gAmp = 0;',
		'	   sAmp = 0;',
		'	}',
		'	// Compute Wiggle',
		'	var gw = wiggle(gFreq,gAmp, complexity , 0.7);',
		'	gw -= value;',
		'	var sw = wiggle(sFreq,sAmp, complexity , 0.7);',
		'	sw -= value;',
		'	return sw + gw;',
		'}',
		'',
		iExprBody,
		'',
		'if (fx.enabled)',
		'{',
		'	result = camRandomMotion() + i();',
		'}',
		'result;'
	].join('\n');
	if (DuAE.version.version >= 16) camCtrl.rotation.expression = zExp;
	else camCtrl.rotation.expression = zExp;
	
	//lock camera
	camera.locked = true;
    
    DuAE.endUndoGroup( i18n._("Camera Rig"));

	return [targetCtrl,camCtrl,mainCtrl];
}

Duik.CmdLib['Camera']["2D Camera"] = "Duik.Camera.twoDCamera()";
/**
 * Creates a 2D Multiplane Camera
 * @param {Layer[]|Layer|DuList.<Layer>} [layers] Some layers to parent to the new camera.
 * @return {ShapeLayer[]} The camera layer and its levels (camera is the first layer in the Array).
 */
Duik.Camera.twoDCamera = function( layers )
{
    layers = def(layers, DuAEComp.getSelectedLayers() );
    layers = new DuList(layers);

    var numLayers = 3;

    DuAE.beginUndoGroup( i18n._("2D Camera"), false);

    // Get comp and sort layers
    var comp;
    if (layers.isEmpty()) comp = DuAEProject.getActiveComp();
    else
    {
        layers = DuAELayer.sortByIndex( layers );
        numLayers = layers.length;
        comp = layers[0].containingComp;
    }

    // Create camera control
    var camCtrl = Duik.Controller.create( comp, Duik.Controller.Type.CAMERA );
    Duik.Controller.setCharacterName( i18n._("2D Camera"), camCtrl );
    Duik.Controller.setLimbName( i18n._("Camera"), camCtrl );
    var camZero = Duik.Constraint.zero( camCtrl )[0];

    // Add effect
    var pe = Duik.PseudoEffect.TWO_D_CAMERA;
    var effect = pe.apply( camCtrl );

	// Prepare expressions
	var fxLink = 'var fx = thisComp.layer("' + camCtrl.name + '").effect("' + effect.name + '");';
	// Transform
	var trackFX = 'var track = fx(' + pe.props["Track left/right"].index + ').value;';
	var pedestalFX = 'var pedestal = fx(' + pe.props["Pedestal up/down"].index + ').value;';
	var rollFX = 'var roll = fx(' + pe.props["Roll"].index + ').value;';
	var zoomFX = 'var zoom = fx(' + pe.props["Zoom in/out"].index + ').value;';
	var dollyFX = 'var dolly = fx(' + pe.props["Dolly in/out"].index + ').value;';
	var panFX = 'var pan = fx(' + pe.props["Pan left/right"].index + ').value;';
	var tiltFX = 'var tilt = fx(' + pe.props["Tilt up/down"].index + ').value;';
	// Random motion
	var gFreqFX = 'var gFreq = fx(' + pe.props["Random motion"]["Frequency"].index + ').value;';
	var gAmpFX = 'var gAmp = fx(' + pe.props["Random motion"]["Amplitude"].index + ').value;';
	var sFreqFX = 'var sFreq = fx(' + pe.props["Camera shake"]["Frequency"].index + ').value;';
	var sAmpFX = 'var sAmp = fx(' + pe.props["Camera shake"]["Amplitude"].index + ').value;';
	var camTypeFX = 'var camType = fx(' + pe.props["Type of camera"].index + ').value;';
	var seedFX = 'var seed = fx(' + pe.props["Advanced"]["Random Seed"].index + ').value;';
	// Interpolation
	var iTypeFX = 'var iType = fx(' + pe.props["Type of motion"].index + ').value;';
	var iRateFX = 'var iRate = fx(' + pe.props["Easing / Acceleration rate"].index + ').value;';
	var bUseAdvancedFX = 'var bUseAdvanced = fx(' + pe.props["Easy-Bezier options"]["Use advanced options"].index + ').value;';
	var bInIFX = 'var bInI = fx(' + pe.props["Easy-Bezier options"]["Advanced"]["Ease in"].index + ').value / 100;';
	var bInVFX = 'var bInV = fx(' + pe.props["Easy-Bezier options"]["Advanced"]["Velocity in"].index + ').value / 100;';
	var bOutIFX = 'var bOutI = fx(' + pe.props["Easy-Bezier options"]["Advanced"]["Ease out"].index + ').value / 100;';
	var bOutVFX = 'var bOutV = fx(' + pe.props["Easy-Bezier options"]["Advanced"]["Velocity out"].index + ').value / 100;';
	var bRatioFX = 'var bRatio = fx(' + pe.props["Easy-Bezier options"]["Ease in/Ease out Ratio"].index + ').value / 100;';

	// Interpolation expression body
	var iExprBody = [
		'if (iType == 2) iRate = linearExtrapolation(iRate, 0, 30, 0, 2);',
		'else if (iType == 3) iRate = linearExtrapolation(iRate, 0, 30, 0, 10);',
		'else if (iType == 1) iRate = linear(iRate, 1, 30, -1, 1);',
		'',
		DuAEExpression.Library.get([
			'isStill',
			'continueOut',
			'continueIn',
			'bezierInterpolation',
			'gaussianInterpolation',
			'linearExtrapolation',
			'logInterpolation',
			'expInterpolation',
			'getPrevKey',
			'getNextKey'
		]),
		'function iAtTime( t )',
		'{',
		'   // Needed keyframes',
		'	var pKey = getPrevKey(t, thisProperty);',
		'	var nKey = getNextKey(t, thisProperty);',
		'	',
		'	if (!pKey || !nKey) return value;',
		'	',
		'	if (iType == 6) // None',
		'	{',
		'	  return valueAtTime(t);',
		'	}',
		'	else if (iType == 5) // Linear ',
		'	{',
		'	  return linear(',
		'			t,',
		'			pKey.time,',
		'			nKey.time,',
		'			pKey.value,',
		'			nKey.value',
		'		);',
		'	}',
		'	else if (iType == 4) // Bezier',
		'	{',
		'    if (bUseAdvanced)',
		'    {',
		'      return bezierInterpolation(',
		'        t,',
		'        pKey.time,',
		'        nKey.time,',
		'        pKey.value,',
		'        nKey.value,',
		'        [bInI, bInV, 1 - bOutI, 1 - bOutV]',
		'      );',
		'    }',
		'    else',
		'    {',
		'      var bIn = linear(iRate, 0, 10, 0.0, 1.0) * bRatio;',
		'      var bOut = linear(iRate, 0, 10, 0.0, 1.0) * (1-bRatio);',
		'      bOut = 1 - bOut;',
		'      ',
		'      return bezierInterpolation(',
		'        t,',
		'        pKey.time,',
		'        nKey.time,',
		'        pKey.value,',
		'        nKey.value,',
		'        [bIn, 0, bOut, 1]',
		'      );',
		'    }',
		'	}',
		'	else if (iType == 1) // Gaussian (start\'n\'stop)',
		'	{',
		'	  return gaussianInterpolation(',
		'	    t,',
		'	    pKey.time,',
		'      nKey.time,',
		'      pKey.value,',
		'      nKey.value,',
		'      iRate',
		'	  );',
		'	}',
		'	else if (iType == 3) // Logarithmic (stop)',
		'	{',
		'	  return logInterpolation(',
		'	    t,',
		'	    pKey.time,',
		'	    nKey.time,',
		'	    pKey.value,',
		'	    nKey.value,',
		'	    iRate',
		'	  );',
		'	}',
		'	else if (iType == 2) // Exponential (start)',
		'	{',
		'	    return expInterpolation(',
		'	        t,',
		'	        pKey.time,',
		'	        nKey.time,',
		'	        pKey.value,',
		'	        nKey.value,',
		'	        iRate',
		'	    );',
		'	}',
		'	',
		'	return -1;',
		'}',
		'',
		'function i() {',
		'	if (numKeys < 2) return value;',
		'	',
		'	var inExtrapolation = iType == 2;',
		'	var outExtrapolation = iType == 3;',
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
		'	  // In Extrapolation',
		'	  if (inExtrapolation)',
		'	  {',
		'	    var inTime = time;',
		'	    var nextKey = getNextKey(time, thisProperty);',
		'	    ',
		'		if (iType == 6) inVal = continueIn(inTime, inDamping); // None',
		'		else if (iType == 5 && nextKey) // Linear ',
		'		{',
		'		    var firstVelocity = (nextKey.value - iAtTime(nextKey.time + 0.01)) * 100;',
		'  			var timeSpent = nextKey.time - time;',
		'  			var damp = Math.exp(timeSpent * inDamping);',
		'  			inVal = (timeSpent * firstVelocity)/damp + nextKey.value;',
		'		} else if (iType == 4 && nextKey) // Bezier',
		'		{',
		'			if (!bUseAdvanced) inVal = value;',
		'			else',
		'			{',
		'  				if (bInV == 0) inVal = value;',
		'  				else ',
		'  				{',
		'  					var firstVelocity = (iAtTime(nextKey.time + 0.01) - nextKey.value) * 100;',
		'    				var timeSpent = nextKey.time - time;',
		'    				var damp = Math.exp(timeSpent * inDamping);',
		'    				inVal = (-timeSpent * firstVelocity) / damp + nextKey.value;',
		'  				}',
		'			}',
		'		} else if (iType == 1) // Gaussian',
		'		{',
		'			inVal = value;',
		'		} else if (iType == 3) // Log',
		'		{',
		'			inVal = value;',
		'		} else if (iType == 2 && nextKey) // Exp ',
		'		{',
		'			var previousKey = nextKey;',
		'			if (previousKey.index < numKeys)',
		'			{',
		'				var nextKey = key(previousKey.index + 1);',
		'  				inVal = expInterpolation(',
		'  					time,',
		'  					previousKey.time,',
		'  					nextKey.time,',
		'  					previousKey.value,',
		'  					nextKey.value,',
		'  					iRate',
		'  				);',
		'			}',
		'		}',
		'	  }',
		'	  // Out Extrapolation',
		'	  if (outExtrapolation)',
		'	  {',
		'	    var outTime = time;',
		'	    var prevKey = getPrevKey(time, thisProperty);',
		'	    ',
		'		if (iType == 6) outVal = continueOut(outTime, outDamping); // None',
		'		else if (iType == 5 && prevKey) // Linear ',
		'		{',
		'			var lastVelocity = (prevKey.value - iAtTime(prevKey.time - 0.01)) * 100;',
		'			var timeSpent = time - prevKey.time;',
		'			var damp = Math.exp(timeSpent * outDamping);',
		'			outVal = prevKey.value + (timeSpent * lastVelocity)/damp;',
		'		} else if (iType == 4 && prevKey) // Bezier',
		'		{',
		'			if (!bUseAdvanced) outVal = value;',
		'			else ',
		'			{',
		'  				if (bOutV == 0) outVal = value;',
		'  				else',
		'  				{',
		'  					var lastVelocity = ( prevKey.value - iAtTime(prevKey.time - 0.01)) * 100;',
		'    				var timeSpent = time - prevKey.time;',
		'    				var damp = Math.exp(timeSpent * outDamping);',
		'    				outVal = prevKey.value + (timeSpent * lastVelocity)/damp;',
		'  				}',
		'			}',
		'		} else if (iType == 1) // Gaussian',
		'		{',
		'			outVal = value;',
		'		} else if (iType == 3 && prevKey) // Log',
		'		{',
		'			var nextKey = prevKey;',
		'			if (nextKey.index > 0)',
		'			{',
		'				prevKey = key(nextKey.index - 1);',
		'				outVal = logInterpolation(',
		'  					time,',
		'  					prevKey.time,',
		'  					nextKey.time,',
		'  					prevKey.value,',
		'  					nextKey.value,',
		'  					iRate',
		'  				);',
		'			}',
		'		} else if (iType == 2 && prevKey) // Exp ',
		'		{',
		'			var nextKey = prevKey;',
		'			if (nextKey.index > 0)',
		'			{',
		'				 prevKey = key(nextKey.index - 1);',
		'				 outVal = expInterpolation(',
		'  					time,',
		'  					prevKey.time,',
		'  					nextKey.time,',
		'  					prevKey.value,',
		'  					nextKey.value,',
		'  					iRate',
		'  				);',
		'			}',
		'		}',
		'	  }',
		'	  ',
		'	  if (!pKey) return inVal;',
		'	  if (!nKey) return outVal;',
		'	  ',
		'	  // Blend',
		'	  return ease( time, pKey.time, nKey.time, outVal, inVal);',
		'	}',
		'',
		'	return iAtTime(time);',
		'}'
	].join('\n');

	var iExpr = [ DuAEExpression.Id.CAMERA_RIG,
		fxLink,
		iTypeFX,
		iRateFX,
		bUseAdvancedFX,
		bInIFX,
		bOutIFX,
		bInVFX,
		bOutVFX,
		bRatioFX,
		'',
		'var result = value;',
		'',
		iExprBody,
		'',
		'if (fx.enabled) result = i();',
		'result;'
	].join('\n');

	var rollExpr = [ DuAEExpression.Id.TWO_D_CAMERA,
	    fxLink,
		rollFX,
		'roll;'
    ].join('\n');

	var panExpr = [ DuAEExpression.Id.TWO_D_CAMERA,
		fxLink,
		panFX,
		tiltFX,
		'[ pan, tilt ] + [ thisComp.width/2, thisComp.height/2 ];'
    ].join('\n');

    // Rig camera
    // Tilt
	camZero.transform.rotation.expression = rollExpr;
	//zoom & truck in/out
	camZero.transform.scale.expression = [ DuAEExpression.Id.TWO_D_CAMERA,
        fxLink,
		zoomFX,
		dollyFX,
        'value + [zoom,zoom] + [dolly,dolly];'
    ].join('\n');
	//pan
	camZero.transform.position.expression = panExpr;
	//track
	camCtrl.transform.position.expression = [ DuAEExpression.Id.TWO_D_CAMERA,
		fxLink,
		gFreqFX,
		gAmpFX,
		sFreqFX,
		sAmpFX,
		camTypeFX,
		seedFX,
		trackFX,
		pedestalFX,
		'seedRandom(seed+3);',
		'complexity = 1;',
		'gAmp = gAmp * thisComp.width / 100;',
		'sAmp = sAmp * thisComp.width / 1000;',
		'if (camType == 2)',
		'{',
		'   gAmp = gAmp/2;',
		'   gFreq = gFreq*2;',
		'   complexity = 3;',
		'}',
		'else if (camType == 3)',
		'{',
		'   gAmp = gAmp/4;',
		'   complexity = 2;',
		'}',
		'else gAmp = 0;',
		'gw = wiggle(gFreq,gAmp, complexity , 0.5);',
		'sw = wiggle(sFreq,sAmp, complexity , 0.5);',
		'if (camType == 4) sw = [sw[0]/2,sw[1]];',
		'result = sw + gw - value + [track, pedestal];',
		'result;',
    ].join('\n');

    //behaviors
	effect( pe.props["Track left/right"].index ).expression = iExpr;
	effect( pe.props["Pedestal up/down"].index ).expression = iExpr;
	effect( pe.props["Dolly in/out"].index ).expression = iExpr;

    effect( pe.props["Pan left/right"].index ).expression = [ DuAEExpression.Id.TWO_D_CAMERA,
		fxLink,
		gFreqFX,
		gAmpFX,
		sFreqFX,
		sAmpFX,
		camTypeFX,
		seedFX,
		iTypeFX,
		iRateFX,
		bUseAdvancedFX,
		bInIFX,
		bOutIFX,
		bInVFX,
		bOutVFX,
		bRatioFX,
		'',
		'var result = value;',
		'',
		'function camRandomMotion()',
		'{',
		'	seedRandom(seed);',
		'	var complexity = 1;',
		'	gAmp = gAmp * thisComp.width / 100;',
		'	sAmp = sAmp * thisComp.width / 1000;',
		'	if (camType == 2)',
		'	{',
		'	   gAmp = gAmp/2;',
		'	   gFreq = gFreq*2;',
		'	   complexity = 3;',
		'	}',
		'	else if (camType == 3)',
		'	{',
		'	   gAmp = gAmp*3/4;',
		'	   sAmp = sAmp/2;',
		'	   complexity = 3;',
		'	}',
		'	else if (camType == 4)',
		'	{',
		'	   gAmp = 0;',
		'	   sAmp = sAmp/4;',
		'	}',
		'	else if (camType == 5)',
		'	{',
		'	   gAmp = gAmp/3;',
		'	   sAmp = sAmp/4;',
		'	}',
		'	else',
		'	{',
		'	   gAmp = 0;',
		'	   sAmp = 0;',
		'	}',
		'	var gw = wiggle(gFreq,gAmp, complexity , 0.7);',
		'	gw -= value;',
		'	var sw = wiggle(sFreq,sAmp, complexity , 0.7);',
		'	sw -= value;',
		'	return sw + gw;',
		'}',
		'',
		iExprBody,
		'',
		'if (fx.enabled)',
		'{',
		'	result = camRandomMotion() + i();',
		'}',
		'result;'
    ].join('\n');

	effect( pe.props["Tilt up/down"].index ).expression = [ DuAEExpression.Id.TWO_D_CAMERA,
		fxLink,
		gFreqFX,
		gAmpFX,
		sFreqFX,
		sAmpFX,
		camTypeFX,
		seedFX,
		iTypeFX,
		iRateFX,
		bUseAdvancedFX,
		bInIFX,
		bOutIFX,
		bInVFX,
		bOutVFX,
		bRatioFX,
		'',
		'var result = value;',
		'',
		'function camRandomMotion()',
		'{',
		'	seedRandom(seed+1);',
		'	var complexity = 1;',
		'	gAmp = gAmp * thisComp.width / 100;',
		'	sAmp = sAmp * thisComp.width / 1000;',
		'	if (camType == 2)',
		'	{',
		'	   gAmp = gAmp/2;',
		'	   gFreq = gFreq*2;',
		'	   complexity = 3;',
		'	}',
		'	else if (camType == 3)',
		'	{',
		'	   gAmp = gAmp*3/4;',
		'	   sAmp = sAmp/2;',
		' 	  complexity = 3;',
		'	}',
		'	else if (camType == 4)',
		'	{',
		'	   gAmp = 0;',
		'	   sAmp = sAmp/2;',
		'	}',
		'	else if (camType == 5)',
		'	{',
		'	   gAmp = gAmp/3;',
		'	   sAmp = sAmp/4;',
		'	}',
		'	else',
		'	{',
		'	   gAmp = 0;',
		'	   sAmp = 0;',
		'	}',
		'	var gw = wiggle(gFreq,gAmp, complexity , 0.7);',
		'	gw -= value;',
		'	var sw = wiggle(sFreq,sAmp, complexity, 0.7);',
		'	sw -= value;',
		'	return sw + gw;',
		'}',
		'',
		iExprBody,
		'',
		'if (fx.enabled)',
		'{',
		'	result = camRandomMotion() + i();',
		'}',
		'result;'
    ].join('\n');

	effect( pe.props["Roll"].index ).expression = [ DuAEExpression.Id.TWO_D_CAMERA,
		fxLink,
		gFreqFX,
		gAmpFX,
		sFreqFX,
		sAmpFX,
		camTypeFX,
		seedFX,
		iTypeFX,
		iRateFX,
		bUseAdvancedFX,
		bInIFX,
		bOutIFX,
		bInVFX,
		bOutVFX,
		bRatioFX,
		'',
		'var result = value;',
		'',
		'function camRandomMotion()',
		'{',
		'	seedRandom(seed+2);',
		'	var complexity = 1;',
		'	if (camType == 2)',
		'	{',
		'	   gAmp = gAmp/5;',
		'	   sAmp = sAmp/5;',
		'	   gFreq = gFreq*2;',
		'	   complexity = 3;',
		'	}',
		'	else if (camType == 3)',
		'	{',
		'	   gAmp = gAmp/15;',
		'	   sAmp = sAmp/15;',
		'	   complexity = 2;',
		'	}',
		'	else',
		'	{',
		'	   gAmp = 0;',
		'	   sAmp = 0;',
		'	}',
		'	var gw = wiggle(gFreq,gAmp, complexity , 0.7);',
		'	gw -= value;',
		'	var sw = wiggle(sFreq,sAmp, complexity , 0.7);',
		'	sw -= value;',
		'	return sw + gw;',
		'}',
		'',
		iExprBody,
		'',
		'if (fx.enabled)',
		'{',
		'	result = camRandomMotion() + i();',
		'}',
		'result;'
    ].join('\n');

    // Create levels
	var ctrls = [camCtrl];
    for (var i = 1; i <= numLayers; i++)
    {
        var ctrl = DuAEComp.addNull( comp );

        var name = 'Level ' + DuNumber.toString(i, 2);
        if (layers.length > 0)
        {
            var l = layers[layers.length-i];
            name = name + ' ~ ' + l.name;
            l.parent = ctrl;
        }

		Duik.Layer.setAttributes( ctrl,
			Duik.Layer.Type.CONTROLLER,
			name,
			OCO.Side.NONE,
			OCO.Location.NONE,
			i18n._("2D Camera")
			);

        ctrl.shy = true;
        ctrl.moveAfter(camCtrl);

        // Add slider and default value
        var slider = ctrl.Effects.addProperty('ADBE Slider Control');
        slider.name = i18n._("Camera influence");

		var half = Math.floor(numLayers / 2);
        if ( i <= half )
		{
			var step = 100 / (half+1);
			slider(1).setValue( step*i );
		}
        else
		{
			var step = 50;
			slider(1).setValue( 100 + step * (i-half-1) );
		}

        //truck
        ctrl.transform.anchorPoint.expression = DuAEExpression.Id.TWO_D_CAMERA + '\nvar camPosition = thisComp.layer("' + camCtrl.name + '").transform.position.value;\nvalueAtTime(0) - camPosition * effect("' + slider.name + '")(1) / 100';

        //tilt
        ctrl.transform.rotation.expression = rollExpr;

        //zoom & truck in/out
        ctrl.transform.scale.expression = [ DuAEExpression.Id.TWO_D_CAMERA + '\n',
            fxLink,
			zoomFX,
			dollyFX,
            'var infl = effect("' + slider.name + '")(1);',
            'value + [zoom,zoom] + [dolly,dolly] * infl/100;'
		].join('\n');

        //pan
        ctrl.transform.position.expression = panExpr;

		ctrls.push(ctrl);
    }

    DuAEComp.unselectLayers();
    camCtrl.selected = true;

    DuAE.endUndoGroup( i18n._("2D Camera"));

    // Return
	return ctrls;
}