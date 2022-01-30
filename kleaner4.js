// Duik Kleaner v4

// <=== ADVANCED PARAMETERS ===>

var anticipationCustomQuantity = effect("Behaviors")(12).value;
var anticipationCustomDuration = effect("Behaviors")(13).value;
var motionInterpolationRatio = effect("Behaviors")(16).value;
var motionUseAETrajectory = effect("Behaviors")(17).value;
var customOverlap = effect("Behaviors")(20).value;
var fThroughCustomFlexibility = effect("Behaviors")(23).value;
var fThroughCustomDuration = effect("Behaviors")(24).value;
var bounce = effect("Behaviors")(25).value;
var customSoftBody = effect("Behaviors")(28).value;
var randomness = effect("Behaviors")(33).value;
var disableSimulation = effect("Behaviors")(37).value;
var timePrecision = effect("Behaviors")(45).value;
var valuePrecision = effect("Behaviors")(52).value;

// <=== VALUES ===>

var zeroVal = zeroValue();
var result = value;
var interpolationRate = 0.725;

// <=== GENERAL FUNCTIONS ===>

function zeroValue() {
  //useful zero value
  if (value instanceof Array) {
  	if (value.length == 2) return [0,0];
  	else if (value.length == 3) return [0,0,0];
  	else if (value.length == 4) return [0,0,0,0];
  }
  else return 0;
}

function addNoise( val, quantity ) {
  var randomValue = random(0.9,1.1);
  var noiseValue = noise(valueAtTime(0) * randomValue);
  noiseValue = noiseValue * (quantity / 100);
  return val * ( noiseValue + 1 );
}

function isAfterLastKey() {
if (numKeys == 0) return false;
var nKey = nearestKey(time);
return nKey.time <= time && nKey.index == numKeys;
}

function getNextKey(t, prop) {
    if (prop.numKeys == 0) return null;
    var nKey = prop.nearestKey(t);
    if (nKey.time >= t) return nKey;
    if (nKey.index < prop.numKeys) return prop.key(nKey.index + 1);
    return null;
}

function getPrevKey(t, prop) {
    if (prop.numKeys == 0) return null;
    var nKey = prop.nearestKey(t);
    if (nKey.time <= t) return nKey;
    if (nKey.index > 1) return prop.key(nKey.index - 1);
    return null;
}

function getNextStopKey(t, prop) {
  if (typeof t === 'undefined') t = time;
  if (typeof prop === 'undefined') prop = thisProperty;
  
  var k = getNextKey(t, prop);
  if (!k) return null;
  
  var i = k.index;
  while (i < prop.numKeys) {
    if (isStill( k.time + thisComp.frameDuration )) return k;
    k = key(k.index + 1);
  }
  return k;
}

function getPrevStartKey(t, prop) {
  if (typeof t === 'undefined') t = time;
  if (typeof prop === 'undefined') prop = thisProperty;
  
  var k = getPrevKey(t, prop);
  if (!k) return null;
  
  var i = k.index;
  while (i > 0) {
    if (isStill( k.time - thisComp.frameDuration )) return k;
    k = key(k.index - 1);
  }
  return k;
}

function isStill(t, threshold, axis) {
  if (typeof t === 'undefined') t = time;
  if (typeof threshold === 'undefined') threshold = 0.01;
  if (typeof axis === 'undefined') axis = -1;
  
  var d = valueAtTime(t) - valueAtTime(t + thisComp.frameDuration*.1);
  
  if (d instanceof Array) {
    // Check given axis
    if (axis >= 0) return Math.abs(d[i]) >= threshold;
    // Check all axis
    for (var i = 0; i < d.length; i++) {
      if (Math.abs(d[i]) >= threshold) return false;
    }
    return true;
  } else return Math.abs(d) < threshold;
}

function isSpatial(prop) {
  if (typeof prop === 'undefined') prop = thisProperty;
	if (!(prop.value instanceof Array)) return false;
	if (prop.value.length != 2 && prop.value.length != 3) return false;
	try { if (typeof prop.speed !== "undefined") return true; }
	catch (e) { return false; }
}

function isKeyTop(k, axis) {
	var prevSpeed = velocityAtTime(k.time - thisComp.frameDuration/2);
	var nextSpeed = velocityAtTime(k.time + thisComp.frameDuration/2);
	if (value instanceof Array) {
		prevSpeed = prevSpeed[axis];
		nextSpeed = nextSpeed[axis];
	}
	if (Math.abs(prevSpeed) < 0.01 || Math.abs(nextSpeed) < 0.01) return true;
	return prevSpeed * nextSpeed < 0;
}

function getPropWorldSpeed(t, prop) {
	return length(getPropWorldVelocity(t, prop));
}

function getPropWorldVelocity(t, prop) {
	return (getPropWorldValue(t + 0.005, prop) - getPropWorldValue(t - 0.005, prop)) * 100;
}

function getPropWorldValue(t, prop) {
  if (typeof t === 'undefined') t = time;
  if (typeof prop === 'undefined') prop = thisProperty;
  
  if (prop === position) return getLayerWorldPos(t, thisLayer);
  return thisLayer.toWorld(prop.valueAtTime(t), t);
}

function getLayerWorldPos(t, l) {
  if (typeof t === 'undefined') t = time;
  if (typeof l === 'undefined') l = thisLayer;
  return l.toWorld(l.anchorPoint, t);
}

function gaussianInterpolation( t, tMin, tMax, value1, value2, rate )
{
    // fix small bump at first value
    if (t != tMin)
    {
        var newValue1 = gaussianInterpolation( tMin, tMin, tMax, value1, value2, rate );
        var offset = newValue1 - value1;
        value1 = value1 - offset;
    }
	if (rate < 0) rate = rate*10;
	rate = linear(t, tMin, tMax, 0.25, rate);
	var r = ( 1 - rate );
    var fwhm = (tMax-tMin) * r;
    var center = tMax;
	if (t >= tMax) return value2;
    if (fwhm === 0 && t == center) return value2;
    else if (fwhm === 0) return value1;
	
    var exp = -4 * Math.LN2;
    exp *= Math.pow((t - center),2);
    exp *= 1/ Math.pow(fwhm, 2);
    var result = Math.pow(Math.E, exp);
	result = result * (value2-value1) + value1;
    return result;
}

function bezierInterpolation(t, tMin, tMax, value1, value2, bezierPoints) {
    if (arguments.length !== 5 && arguments.length !== 6) return (value1+value2)/2;
    var a = value2 - value1;
    var b = tMax - tMin;
    if (b == 0) return (value1+value2)/2;
    var c = clamp((t - tMin) / b, 0, 1);
    if (!(bezierPoints instanceof Array) || bezierPoints.length !== 4) bezierPoints = [0.33,0.0,0.66,1];
    return a * h(c, bezierPoints) + value1;

    function h(f, g) {
        var x = 3 * g[0];
        var j = 3 * (g[2] - g[0]) - x;
        var k = 1 - x - j;
        var l = 3 * g[1];
        var m = 3 * (g[3] - g[1]) - l;
        var n = 1 - l - m;
        var d = f;
        for (var i = 0; i < 5; i++) {
            var z = d * (x + d * (j + d * k)) - f;
            if (Math.abs(z) < 1e-3) break;
            d -= z / (x + d * (2 * j + 3 * k * d));
        }
        return d * (l + d * (m + d * n));
    }
}

function gaussianRateToBezierPoints(rate) {
  var i = 0;
  var o = 1;
  if (rate <= -.025) {
    i = linear(rate, -0.4, -0.025, 0.17, 0.415);
    o = 1-easeIn(rate, -0.4, -0.025, 1, 0.415);
  }
  else {
    i = linear(rate, -0.025, 0.7, 0.415, 1);
    o = 1-easeOut(rate, -0.025, 0.7, 0.415, 0.15);
  }
  return [i,0,o,1];
}

// <=== BEHAVIOR FUNCTIONS ===>

function weightedInterpolation(t, tMin, tMax, value1, value2, gaussianRate, bezierRate) {
  if (bezierRate >= 1) return linear(t, tMin, tMax, value1, value2);
  
  var g = gaussianInterpolation(t, tMin, tMax, value1, value2, gaussianRate );
  if (bezierRate <= 0) return g; 
  
  var b = bezierInterpolation( t, tMin, tMax, value1, value2, [1-bezierRate, 0, bezierRate, 1]);
  return linear(linearRate, 0, 1, g, b);
}

function mainMotion(t, gaussianRate, bezierRate, slowDown, useAETrajectory) {
  if (numKeys < 2) return zeroVal;
  var nKey = getNextKey(t, thisProperty);
  if (!nKey) return zeroVal;
  var pKey = getPrevKey(t, thisProperty);
  if (!pKey) return zeroVal;

  if (useAETrajectory && isSpatial()) return mainTrajectoryInterpolation(t, gaussianRate, bezierRate, slowDown);
  
  return mainValueInterpolation(t, gaussianRate, bezierRate, slowDown);
}

function mainValueInterpolation(t, gaussianRate, bezierRate, slowDown) {
  
  var nKey = getNextKey(t, thisProperty);
  var pKey = getPrevKey(t, thisProperty);
  
  // For each axis
  var r = value;
  var m = r instanceof Array;
  if (!m) r = [r];
  
  for ( var axis = 0; axis < r.length; axis++ ) {
    
    // Values
    var currentValue = value;
    var nValue = nKey.value;
    var pValue = pKey.value;
    if (m) {
      currentValue = currentValue[axis];
      nValue = nValue[axis];
      pValue = pValue[axis];
    }
    
    // Times
    var nTime = nKey.time;
    var pTime = pKey.time;
    
    // 4 cases : both keys are a summit, or each one is, or none.
    var pKeyTop = isKeyTop(pKey, axis);
    var nKeyTop = isKeyTop(nKey, axis);
    
    // Check if we can stop (we're still moving after the next key)
    // i.e. there's no follow through later
    var stop = slowDown >= 1;
    if (!stop) stop = nKey.index < numKeys && !isStill(nKey.time + thisComp.frameDuration, threshold = .01, axis);

    if (stop && nKeyTop && pKeyTop) {
      r[axis] = weightedInterpolation(t, pTime, nTime, pValue, nValue, gaussianRate, bezierRate) - currentValue;
      continue;
    }
    
    // Prepare bezier values for continuous keyframes
    // Try to be as close as possible to the gaussian interpolation
    var bPoints = gaussianRateToBezierPoints( gaussianRate );
    var sO = bPoints[0];
  	var sOV = bPoints[1];
    var sI = bPoints[2];
  	var sIV = bPoints[3];
  	if (!pKeyTop) {
  	  var prevKey = key(pKey.index - 1);
  		var prevVal = prevKey.value;
  		if (m) prevVal = prevVal[axis];
  		sOV = (pValue - prevVal) / (nValue - prevVal);
  		sO = .33;
  	}
  	if (!nKeyTop) {
  	  var nextKey = key(nKey.index + 1);
  		var nextVal = nextKey.value;
  		if (m) nextVal = nextVal[axis];
  		sIV = (nValue - nValue) / (nextVal - nValue);
  		sI = .66;
  	}
  	else if (!stop) {
  	  // end speed
  	  sIV = slowDown/2+.5;
  	}
  	r[axis] = bezierInterpolation(t, pTime, nTime, pValue, nValue, [sO, sOV, sI, sIV]) - currentValue;
  }

  if (m) return r;
  else return r[0];
}

function mainTrajectoryInterpolation(t, gaussianRate, bezierRate, slowDown) {
  if (isStill(t)) return zeroVal;
  
  var sKey = getPrevStartKey(t);
  var eKey = getNextStopKey(t);
  
  var stop = slowDown >= 1;
  
  if (stop) return valueAtTime(
    weightedInterpolation(t, sKey.time, eKey.time, sKey.time, eKey.time, gaussianRate, bezierRate)
    ) - value;
    
  // Try to be as close as possible to the gaussian interpolation
  var bPoints = gaussianRateToBezierPoints( gaussianRate );
  bPoints[3] = slowDown/2+.5;
  return valueAtTime(
    bezierInterpolation(t, sKey.time, eKey.time, sKey.time, eKey.time, bPoints)
    ) - value;
}

function anticipation(duration, quantity, rate, linearRate) {
  var anticipation = zeroVal;
  // Check values
  if (duration == 0) return anticipation;
  if (quantity == 0) return anticipation;
  // We need at least two keyframes, and can't be after the last one
	if (isAfterLastKey()) return anticipation;
	if (numKeys < 2) return anticipation;

  // Check if an anticipation is needed
	var nextKey = getNextKey(time, thisProperty);
	var anticipationKey = nextKey;
	if (!isStill(anticipationKey.time - 0.1, valuePrecision)) {
		anticipationKey = getPrevKey(time, thisProperty);
		if (!isStill(anticipationKey.time - 0.1, valuePrecision)) return anticipation;
	}
	if (anticipationKey.index == numKeys) return anticipation;

	var anticipationMiddle = anticipationKey.time;
	var anticipationStart = anticipationMiddle - anticipationDuration;
	var anticipationEnd = key(anticipationKey.index + 1).time;
	var startValue = anticipation;
	var midValue = (-valueAtTime(anticipationMiddle + anticipationDuration) + anticipationKey.value) * anticipationQuantity / 2;
	var endValue = anticipation;

	if (time < anticipationStart) {
		return anticipation;
	} else if (time < anticipationMiddle) {
		if (value instanceof Array) {
			for (var i = 0; i < value.length; i++) {
				anticipation[i] = weightedInterpolation(time, anticipationStart, anticipationMiddle, startValue[i], midValue[i], rate, linearRate);
			}
			return anticipation;
		} else {
			return weightedInterpolation(time, anticipationStart, anticipationMiddle, startValue, midValue, rate, linearRate);
		}
	} else if (time <= anticipationEnd) {
		if (value instanceof Array) {
			for (var i = 0; i < value.length; i++) {
				anticipation[i] = weightedInterpolation(time, anticipationMiddle, anticipationEnd, midValue[i], endValue[i], rate, linearRate);
			}
			return anticipation;
		} else {
			return weightedInterpolation(time, anticipationMiddle, anticipationEnd, midValue, endValue, rate, linearRate);
		}
	} else {
		return anticipation;
	}
}

function followThrough(flexibility, duration, slowDown, bounce, simulate, overlapDuration, anticipationDuration) {
  
  var propSpeed = length(velocity);
  if (simulate) propSpeed = getPropWorldSpeed(time - overlapDuration, thisProperty);
	if (propSpeed < .001) return followThroughAtTime(time - overlapDuration, flexibility, duration, slowDown, bounce, simulate);
	
	//need to get back in time get the last follow-through value to fade it
	var fThrough = zeroVal;

	var t = time;
	while (t > 0) {
		t = t - thisComp.frameDuration;
		if (simulate) propSpeed = getPropWorldSpeed(t - overlapDuration, thisProperty);
		else propSpeed = length(velocityAtTime(t));
		if (propSpeed < .001) {
			fThrough = followThroughAtTime(t - overlapDuration, flexibility, duration, slowDown, bounce, simulate);
			break;
		}
	}

	return easeIn(time, t, t + anticipationDuration * 2, fThrough, zeroVal);
}

function followThroughAtTime(t, flexibility, duration, slowDown, bounce, simulate) {
	var fThrough = zeroVal;

	//checks
	if (flexibility == 0) return fThrough;
	var elasticity = 1/flexibility;
	if (duration == 0) return fThrough;
	var damping = 1/duration;
	if (slowDown == 1) return fThrough;
	
	var propSpeed;
	
	if (!simulate) {
		if (numKeys < 2) return fThrough;
		if (nearestKey(t).index == 1) return fThrough;
		propSpeed = length(velocityAtTime(t));
		if (propSpeed >= .001) return fThrough;
	} else {
		propSpeed = getPropWorldSpeed(t, thisProperty);
		if (propSpeed >= .001) return fThrough;
	}

	//check state and time
	var fThroughStart = 0;
	var fThroughTime = 0;

	if (simulate) {
		var speedI = getPropWorldSpeed(t, thisProperty);
		var i = t;
		//search for the time when the layer last moved
		while (speedI < valuePrecision && i > 0) {
			i = i - thisComp.frameDuration / timePrecision;
			speedI = getPropWorldSpeed(i, thisProperty);
		}
		fThroughStart = i;
	} else {
		//follow through starts at previous key
		var fThroughKey = getPrevKey(t, thisProperty);
		fThroughStart = fThroughKey.time;
	}

	if (fThroughStart == 0) return fThrough;

	fThroughTime = t - fThroughStart;

	//from velocity
	if (simulate) fThrough = getPropWorldVelocity(fThroughStart - thisComp.frameDuration, thisProperty ) / 2;
	else {
	  
	  fThrough = velocityAtTime(fThroughStart - thisComp.frameDuration) / 2;
	  fThrough *= 1-Math.cbrt(slowDown);
	}


	if (bounce) {
		var cycleDamp = Math.exp(fThroughTime * damping * .1);
		var damp = Math.exp(fThroughTime * damping) / (elasticity / 2);
		var cycleDuration = 1 / (elasticity * 2);
		//round to whole frames for better animation
		cycleDuration = Math.round(timeToFrames(cycleDuration));
		cycleDuration = framesToTime(cycleDuration);
		var midDuration = cycleDuration / 2;
		var maxValue = fThrough * midDuration;
		//check which cycle it is and cycvarime
		var cycvarime = fThroughTime;
		// the number of cycles where we "cheat" which are rounded to two frames
		var numEndCycles = 1;
		while (cycvarime > cycleDuration) {
			cycvarime = cycvarime - cycleDuration;
			cycleDuration = cycleDuration / cycleDamp;
			//round everything to whole frames for better animation
			cycleDuration = Math.round(timeToFrames(cycleDuration));
			//this is where we cheat to continue to bounce on cycles < 2 frames
			if (cycleDuration < 2) {
				cycleDuration = 2;
				numEndCycles++;
			}
			cycleDuration = framesToTime(cycleDuration);
			midDuration = cycleDuration / 2;
			maxValue = fThrough * midDuration / damp;
			if (numEndCycles > 100 / damping && maxValue < valuePrecision) return zeroVal;
		}

		if (cycvarime < midDuration) fThrough = bezierInterpolation(cycvarime, 0, midDuration, 0, maxValue, [0, .1, .33, 1]);
		else fThrough = bezierInterpolation(cycvarime, midDuration, cycleDuration, maxValue, 0, [1 - .33, 0, 1, .9]);
	} else {
		// damping ratio
		var damp = Math.exp(fThroughTime * damping);
		// sinus evolution 
		var sinus = elasticity * fThroughTime * 2 * Math.PI;
		//sinus
		sinus = Math.sin(sinus);
		// elasticity
		sinus = .3 / elasticity * sinus;
		// damping
		sinus = sinus / damp;
		if (Math.abs(sinus) < .001 / 100) return 0;
		// result
		fThrough = fThrough * sinus;

		if (.001 > 0) {
			fThrough = fThrough * (1 - propSpeed / valuePrecision);
		}
	}

	if (bounce) {
		var prevValue = valueAtTime(fThroughStart - thisComp.frameDuration);
		var startValue = valueAtTime(fThroughStart);
		if (value instanceof Array) {
			for (var i = 0; i < prevValue.length; i++) {
				if (prevValue[i] > startValue[i]) fThrough[i] = Math.abs(fThrough[i]);
				if (prevValue[i] < startValue[i]) fThrough[i] = -Math.abs(fThrough[i]);
			}
		} else {
			if (prevValue > startValue) fThrough = Math.abs(fThrough);
			if (prevValue < startValue) fThrough = -Math.abs(fThrough);
		}
	}

	if (simulate) {
		if (thisProperty !== position) {
			fThrough = fThrough + getLayerWorldPos(time, thisLayer);
			fThrough = thisLayer.fromWorld(fThrough) - thisLayer.anchorPoint;
		} else if (thisLayer.hasParent) {
			fThrough = fThrough + getLayerWorldPos(time, thisLayer.parent);
			fThrough = thisLayer.parent.fromWorld(fThrough) - thisLayer.parent.anchorPoint;
		}
	}

	return fThrough;
}

function overlap(overlapDuration, flexibility, t) {

	var isThisPosition = thisProperty === position;
	
	if (isThisPosition && !hasParent) return zeroVal;
	
	if (typeof t === 'undefined') t = time;
	
	// The position before overlapDuration
	var ol = getPropWorldValue(t - overlapDuration, thisProperty);
	
	// A ratio : velocity of the motion / distance between parent
	var motionRatio = 1;
	var originalDistance = length(valueAtTime(0));
	var motionVelocity = length(getPropWorldValue(t-thisComp.frameDuration/timePrecision, thisProperty), getPropWorldValue(t, thisProperty));
	motionRatio = ease(motionVelocity, 0, originalDistance, 1, 1-flexibility);

	//pull towards the anchor position (or the parent for the position)
  if (isThisPosition) {
  	var prevParentWorldPos = getLayerWorldPos(t - overlapDuration, parent);
  	ol = (ol - prevParentWorldPos) * motionRatio + prevParentWorldPos;
  }
	else {
	  var prevAnchorWorldPos = getPropWorldValue(t - overlapDuration, anchorPoint);
	  ol = (ol - prevAnchorWorldPos) * motionRatio + prevAnchorWorldPos;
	}
	
	
	// Convert back to local coordinates
	if (isThisPosition) ol = parent.fromWorld(ol);
	else ol = thisLayer.fromWorld(ol);

	return ol - value;
}

// Logic results

var interpolationRate = effect("Behaviors")(61).value;
var overlapDuration = effect("Behaviors")(62).value;
var anticipationQuantity = effect("Behaviors")(63).value;
var anticipationDuration = effect("Behaviors")(64).value;
var fThroughFlexibility = effect("Behaviors")(65).value;
var fThroughDuration = effect("Behaviors")(66).value;
var slowDown = effect("Behaviors")(67).value;
var linearRate = effect("Behaviors")(68).value;
var softBodyFexibility = fThroughFlexibility;

// ADJUSTMENTS

// random!
seedRandom(0, true);

// anticipation
anticipationDuration *= anticipationCustomDuration/100;
anticipationQuantity *= anticipationCustomQuantity/100;
motionInterpolationRatio /= 100;
motionUseAETrajectory = motionUseAETrajectory == 1;
fThroughFlexibility *= fThroughCustomFlexibility/100;
fThroughFlexibility = addNoise( fThroughFlexibility, randomness );
fThroughDuration *= fThroughCustomDuration/100;
fThroughDuration = addNoise( fThroughDuration, randomness );
if (fThroughFlexibility < .01) fThroughFlexibility = 0;
if (fThroughDuration < .01) fThroughDuration = 0;
var doFollowThrough = fThroughFlexibility != 0 && fThroughDuration != 0;
if (!doFollowThrough) slowDown = 1;
var bounce = bounce == 1;
softBodyFexibility *= customSoftBody/100;
var simulate = disableSimulation == 0;
if (simulate)
{
  // Check if simulation is possible, and needed
  // disable if :
  // - prop is not spatial, or position has keyframes
  if (!isSpatial()) simulate = false;
  else if (thisProperty === position && thisProperty.numKeys > 0) simulate = false;
  // - custom soft body and custom overlap are 0
  else if (customSoftBody == 0 && customOverlap == 0) simulate = false;
  // - overlap is 0 and (!doFollowThrough)
  else if (overlapDuration == 0 && !doFollowThrough) simulate = false;
  // - No parent = no simulation on the position
  else if (thisProperty === position && !thisLayer.hasParent) simulate = false;
  
  // Adjust the flexibility and other parameters in case of simulation
  //adjust elasticity based on flexibility
  if (simulate) {
    
    if (thisProperty === position) overlapDuration *= customOverlap/100;
    else overlapDuration *= softBodyFexibility;
    
  	//get the distance from anchor ratio
  	var distanceRatio = 1;
  	if (thisProperty !== position)
  	{
  	  distanceRatio = length(valueAtTime(0), anchorPoint) / (thisLayer.width / 2);
  	  //adjust with soft-body flexibility
  	  distanceRatio *= softBodyFexibility;
  	}
  
	  fThroughFlexibility = fThroughFlexibility * distanceRatio;
	  fThroughDuration = fThroughDuration * distanceRatio;
	  overlapDuration = overlapDuration * distanceRatio;
	  
	  overlapDuration = addNoise( overlapDuration, randomness );
  }
}
// Disable overlap without simulation
if (!simulate) overlapDuration = 0;

if (motionInterpolationRatio > 0)
{
  result += mainMotion(time, interpolationRate, linearRate, slowDown, motionUseAETrajectory) * motionInterpolationRatio;
}
result += anticipation(anticipationDuration, anticipationQuantity, interpolationRate, linearRate);
if (overlapDuration > 0)
{
  result += overlap(overlapDuration, fThroughFlexibility);
}
if (doFollowThrough)
{
  result += followThrough(fThroughFlexibility, fThroughDuration, slowDown, bounce, simulate, overlapDuration, anticipationDuration);
}
result;
