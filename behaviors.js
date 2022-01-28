// Duik Kleaner v4

// <=== MAIN PARAMETERS ===>

var size = effect("Behaviors")(3).value;
var weight = effect("Behaviors")(4).value;
var strength = effect("Behaviors")(5).value;
var will = effect("Behaviors")(6).value;
var flexibility = effect("Behaviors")(7).value;
var friction = effect("Behaviors")(8).value;

// <=== ADVANCED PARAMETERS ===>

var anticipationCustomQuantity = effect("Behaviors")(12).value;
var anticipationCustomDuration = effect("Behaviors")(13).value;
var fThroughCustomFlexibility = effect("Behaviors")(19).value;
var fThroughCustomDuration = effect("Behaviors")(20).value;
var bounce = effect("Behaviors")(21).value;

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

function isStill(t, threshold) {
var d = valueAtTime(t) - valueAtTime(t + framesToTime(1));
if (d instanceof Array) {
for (var i = 0; i < d.length; i++) {
d[i] = Math.abs(d[i]);
if (d[i] >= threshold) {
return false;
}
}
return true;
} else {
d = Math.abs(d);
return d < threshold;
}
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

function mean( values )
{
    var num = values.length;
    var result = 0;
    for (var i = 0; i < num; i++)
    {
        result += values[i];
    }
    return result / num;
}

function logistic( value, midValue, min, max, rate)
{
    var exp = -rate*(value - midValue);
    var result = 1 / (1 + Math.pow(Math.E, exp));
    return result * (max-min) + min;
}

function inverseLogistic ( v, midValue, min, max, rate)
{
    if (v == min) return 0;
    
    return midValue - Math.log( (max-min)/(v-min) - 1) / rate;
}

function gaussian( value, min, max, center, fwhm)
{
    if (fwhm === 0 && value == center) return max;
    else if (fwhm === 0) return 0;

    var exp = -4 * Math.LN2;
    exp *= Math.pow((value - center),2);
    exp *= 1/ Math.pow(fwhm, 2);
    var result = Math.pow(Math.E, exp);
    return result * (max-min) + min;
}

function inverseGaussian ( v, min, max, center, fwhm)
{
    if (v == 1) return [center, center];
    if (v === 0) return [center + fwhm/2, center - fwhm/2];
    if (fwhm === 0) return [center, center];

    var result = (v-min)/(max-min);
    result = Math.log( result ) * Math.pow(fwhm,2);
    result = result / ( -4 * Math.LN2 );
    result = Math.sqrt( result );
    return [ result + center, -result + center ];
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

// <=== FUZZY LOGIC ===>

function FuzzySet( name, valueNot, valueIS, shape, shapeAbove, plateauMin, plateauMax)
{
    var min;
    var max;
    if (valueNot > valueIS){
        max = valueNot;
        min = valueNot - (valueNot - valueIS) * 2;
    }
    else
    {
        min = valueNot;
        max = valueNot + (valueIS - valueNot) * 2;
    }

    if (typeof shape === "undefined") shape = "linear";
    if (typeof shapeAbove === "undefined") shapeAbove = shape;
    if (typeof plateauMin === "undefined") plateauMin = mean([min, max]);
    if (typeof plateauMax === "undefined") plateauMax = mean([min, max]);

    this.min = min;
    this.max = max;
    this.shapeIn = shape;
    this.shapeOut = shapeAbove;
    this.plateauMin = plateauMin;
    this.plateauMax = plateauMax;
    this.name = name;
}

FuzzySet.prototype = {
  contains: function ( v, quantifier )
  {
      var val;
      if (v instanceof FuzzyValue) val = v.crispify(false);
      else val = v;
  
      quantifier = getQuantifier(quantifier);
  
      if (val >= this.plateauMin && val <= this.plateauMax)
      {
          return quantifier(1);
      }
      else if (val < this.plateauMin)
      {
          if (this.shapeIn === "constant")
          {
              return quantifier(1);
          }
          else if (this.shapeIn === "square")
          {
              var min = mean(this.plateauMin, this.min);
              if (val >= min) return quantifier(1);
              else return quantifier(0);
          }
          else if (this.shapeIn === "linear")
          {
              if (val < this.min) return quantifier(0);
              else return quantifier( (val-this.min) / (this.plateauMin - this.min) );
              //return (val-this.min) / (this.plateauMin - this.min);
          }
          else if (this.shapeIn === "sigmoid")
          {
              var mid = (this.plateauMin + this.min) / 2;
              var rate = 6 / (this.plateauMin - this.min);
              return quantifier(logistic(val, mid, 0, 1, rate));
          }
          else if (this.shapeIn === "gaussian")
          {
              var width = this.plateauMin - this.min;
              return quantifier( gaussian( val, 0, 1, this.plateauMin, width));
          }
          else return quantifier(0);
      }
      else
      {
          if (this.shapeOut === "constant")
          {
              return quantifier(1);
          }
          else if (this.shapeOut === "square")
          {
              var max = mean(this.plateauMax, this.max);
              if (val <= max) return quantifier(1);
              else return quantifier(0);
          }
          else if (this.shapeOut === "linear")
          {
              if (val > this.max) return quantifier(0);
              else return quantifier (1 - ((val - this.plateauMax ) / (this.max - this.plateauMax) ));
          }
          else if (this.shapeOut === "sigmoid")
          {
              var mid = (this.plateauMax + this.max) / 2;
              var rate = 6 / (this.max - this.plateauMax);
              return quantifier( 1 - logistic(val, mid, 0, 1, rate));
          }
          else if (this.shapeOut === "gaussian")
          {
              var width = this.max - this.plateauMax;
              return quantifier( gaussian( val, 0, 1, this.plateauMax, width) );
          }
          else return quantifier(0);
      } 
  },
  
  getValues: function ( veracity )
  {
      if (typeof veracity === "undefined") veracity = 0.5;
      if (veracity instanceof FuzzyVeracity) veracity = veracity.veracity;
  
      var defaultValue = mean( [this.plateauMin, this.plateauMax] );
  
      if ( this.shapeIn === "constant" && this.shapeOut === "constant" ) return [ this.min, this.plateauMin, defaultValue, this.plateauMax, this.max];
      
      var crisp = [];
      
      if (veracity >= 1) crisp = [this.plateauMin, defaultValue, this.plateauMax];
  
      // below
      if (this.shapeIn === "constant" && veracity == 1)
      {
          crisp.push(this.min);
      }
      else if (this.shapeIn === "square")
      {
          if (veracity >= 0.5) crisp.push( this.plateauMin );
          else crisp.push( this.min );
      }
      else if (this.shapeIn === "linear")
      {
          range = this.plateauMin - this.min;
  
          crisp.push( this.min + range * veracity );
      }
      else if (this.shapeIn === "sigmoid")
      {
          mid = (this.plateauMin + this.min) / 2;
          crisp.push( inverseLogistic(veracity, mid, 0, 1, 1) );
      }
      else if (this.shapeIn === "gaussian")
      {
          var width = this.plateauMin - this.min;
          var g = inverseGaussian( veracity, 0, 1, this.plateauMin, width);
          crisp.push( g[0] );
      }
  
      //above
      if (this.shapeOut === "constant" && veracity == 1)
      {
          crisp.push(this.max);
      }
      if (this.shapeOut === "square")
      {
          if (veracity >= 0.5) crisp.push( this.plateauMax );
          else crisp.push( this.max );
      }
      else if (this.shapeOut === "linear")
      {
          range = this.max - this.plateauMax;
  
          crisp.push( this.max + 1 - (range * veracity) );
      }
      else if (this.shapeOut === "sigmoid")
      {
          mid = (this.plateauMax + this.max) / 2;
          crisp.push( inverseLogistic( 1-veracity, mid, 0, 1, 1 ) );
      }
      else if (this.shapeOut === "gaussian")
      {
          width = this.max - this.plateauMax;
          var g = inverseGaussian( 1-veracity, 0, 1, this.plateauMax, width);
          crisp.push( g[1] );
      }
  
      // Clamp
      for(var i = 0, num = crisp.length; i < num; i++)
      {
          if ( crisp[i] > this.max ) crisp[i] = this.max;
          if ( crisp[i] < this.min ) crisp[i] = this.min;
      }
  
      return crisp.sort();
  },
  
  crispify: function ( quantifier, veracity )
  {
      quantifier = getQuantifier(quantifier);
      var v;
      if (typeof veracity === "undefined") v = quantifier();
      else if (veracity instanceof FuzzyVeracity) v = veracity.veracity;
      else v = veracity;
  
      v = quantifier(v, true).veracity;
      return this.getValues( v );
  }
};

function FuzzyValue( val )
{
    if (typeof unit === "undefined") unit = "";
    if (typeof val === "undefined") val = 0;
    this.val = val;
    this.sets = [];

    this.report = [];
    this.reportEnabled = false;
    this.numRules = 0;
}

FuzzyValue.prototype = {
  IS: function(fuzzyset, quantifier)
  {
      var v = fuzzyset.contains( this, quantifier );
      return v;
  },
  
  IS_NOT: function (fuzzyset, quantifier)
  {
      var x = fuzzyset.contains( this.val, quantifier );
      return x.NEGATE();
  },
  
  SET: function ( fuzzyset,  quantifier, v )
  {
      if (typeof v === "undefined") v = new FuzzyVeracity(1);
      
      quantifier = getQuantifier(quantifier);
      
      this.numRules++;
      v.ruleNum = this.numRules;
  
      // Check if this set is already here
      for (var i = 0, num = this.sets.length; i < num; i++)
      {
          var s = this.sets[i].fuzzyset;
          if (fuzzyset.name == s.name) 
          {
              this.sets[i].quantifiers.push(quantifier);
              this.sets[i].veracities.push(v);
              return;
          }
      }
  
      //otherwise, add it
      var s = {};
      s.fuzzyset = fuzzyset;
      s.quantifiers = [quantifier];
      s.veracities = [v];
      this.sets.push( s );
  },
  
  crispify: function ( clearSets )
  {
      if (typeof clearSets === "undefined") clearSets = true;
  
      if (this.sets.length == 0) return this.val;
  
      var crisp = 0;
      this.report = [];
  
      function ruleSorter(a, b)
      {
          return a.number - b.number;
      }
  
      // get all average values
      // and veracities from the sets
      var sumWeights = 0;
      for (var i = 0, num = this.sets.length; i < num; i++)
      {
          var s = this.sets[i];
          for( var j = 0, numV = s.veracities.length; j < numV; j++)
          {
              // the veracity
              var v = s.veracities[j];
              var q = s.quantifiers[j];
              // the corresponding values
              var vals = s.fuzzyset.crispify( q, v );
              var val;
              var ver;
  
              val = mean(vals);
              crisp += val * v.veracity;
              ver = v.veracity;
  
              sumWeights += ver;
              
  
              // generate report
              if (this.reportEnabled)
              {
                  for (var iVals = 0, numVals = vals.length; iVals < numVals; iVals++)
                  {
                      vals[iVals] = Math.round(vals[iVals]*1000)/1000;
                  }
  
                  var reportRule = [];
                  reportRule.push( "Rule #" + v.ruleNum +": Set " + fuzzyset.toString() + " (" + q.toString() + ")" );
                  reportRule.push( "Gives val: " + Math.round(val*1000)/1000 + " from these values: [ " + vals.join(", ") + " ]");
                  reportRule.push( "With a veracity of: " + Math.round(ver*1000)/1000 );
                  reportRule.number = v.ruleNum;
                  this.report.push( reportRule );
              }
          }
      }
              
      if (sumWeights != 0) crisp = crisp / sumWeights;
  
  
      //sort the report
      if (this.reportEnabled) this.report.sort(ruleSorter);
  
      if (clearSets)
      {
          // freeze all
          this.val = crisp;
          //reset sets
          this.sets = [];
      }
  
      return crisp;
  },
  
  toNumber: this.crispify,
  toFloat: this.crispify,
  defuzzify: this.crispify
};

function FuzzyVeracity( veracity )
{
    if (typeof above === "undefined") above = false;
    this.veracity = veracity;
}

FuzzyVeracity.prototype = {
  NEGATE: function()
  {
      return new FuzzyVeracity( 1 - this.veracity );
  },
  
  AND: function( other )
  {
      var x = this.veracity;
      var y = other.veracity;
  
      var v = 0;
      v = Math.min(x, y);
  
      return new FuzzyVeracity( v );
  },
  
  OR: function( other )
  {
      var x = this.veracity;
      var y = other.veracity;
  
      var v = 0;
      v = Math.max(x, y);
  
      return new FuzzyVeracity( v );
  },
  
  XOR: function( other )
  {
      var x = this.veracity;
      var y = other.veracity;
  
      var v = 0;
      v = x+y - 2*Math.min(x,y);
  
      return new FuzzyVeracity( v );
  },
  
  IS_NOT: this.XOR,
  
  DIFFERENT: this.XOR,
  
  NXR: function( other )
  {
      var x = this.veracity;
      var y = other.veracity;
  
      var v = 0;
      v = 1-x-y + 2*Math.min(x,y);
  
      return new FuzzyVeracity( v );
  },
  
  IS: this.NXR,
  
  EQUALS: this.NXR,
  
  IMPLIES: function( other )
  {
      var x = this.veracity;
      var y = other.veracity;
  
      var v = 0;
      v = 1-Math.min(x, 1-y);
  
      return new FuzzyVeracity( v );
  },
  
  WITH: this.IMPLIES,
  
  HAS: this.IMPLIES,
  
  DOES_NOT_IMPLY: function( other )
  {
      var x = this.veracity;
      var y = other.veracity;
  
      var v = 0;
      v = Math.min(x, 1-y);
  
      return new FuzzyVeracity( v );
  },
  
  WITHOUT: this.DOES_NOT_IMPLY,
  
  DOES_NOT_HAVE: this.DOES_NOT_IMPLY,
  
  NAND: function( other )
  {
      var x = this.veracity;
      var y = other.veracity;
  
      var v = 0;
       v = 1 - Math.min(x, y);
  
       return new FuzzyVeracity( v );
  },
  
  NOT_BOTH: this.NAND,
  
  NOR: function( other )
  {
      var x = this.veracity;
      var y = other.veracity;
  
      var v = 0;
      v = 1 - Math.max(x, y);
  
      return new FuzzyVeracity( v );
  },
  
  NONE: this.NOR,
  
  WEIGHTED: function( other, weight )
  {
      var x = this.veracity;
      var y = other.veracity;
  
      var v = (1-w)*x +  w*y;
  
      return new FuzzyVeracity( v );
  }
};

function FuzzyLogic( )
{
    this.veracity = new FuzzyVeracity(0);
    this.sets = [];
}

FuzzyLogic.prototype = {
  
  newValue: function (val, unit)
  {
      return new FuzzyValue( val, unit );
  },
  
  newVeracity: function (veracity)
  {
      return new FuzzyVeracity(veracity);
  },
  
  newSet: function ( name, extremeValue, referenceValue, shape, shapeAbove, plateauMin, plateauMax)
  {
      return new FuzzySet(name, extremeValue, referenceValue, shape, shapeAbove, plateauMin, plateauMax);
  },
  
  IF: function ( veracity )
  {
      this.veracity = veracity;
      return veracity;
  },
  
  THEN: function ( val, fuzzyset, quantifier )
  {
      val.SET(fuzzyset, quantifier, this.veracity);
  }
  
};

// ====== LOW-LEVEL UTILS =====

function getQuantifier( name )
{
    if (typeof name === "undefined") name = "moderately";
  
    if (name == "not" || name == "less") {
        function qObj (v, inverse) {
            if (typeof v === "undefined") return 0;
            var p = inverse ? 0 : 1;
            return new FuzzyVeracity( p );
        }
        return qObj;
    }

    if (name == "slightly") return createQuantifier( 1/3 );
    if (name == "somewhat") return createQuantifier( 0.5 );
    if (name == "moderately") return createQuantifier( 1 );
    if (name == "very") return createQuantifier( 2 );
    if (name == "extremely") return createQuantifier( 3 );

    function qObj (v, inverse) {
        if (typeof v === "undefined") return 1;
        var p = inverse ? 1 : 0;
        return new FuzzyVeracity( p );
    }
    return qObj;

}

function createQuantifier( q )
{
    function qObj (v, inverse) {
        if (typeof v === "undefined") return Math.pow( 0.5, 1/q);
        var p = inverse ? 1/q : q;
        return new FuzzyVeracity( Math.pow(v, p) );
    }
    return qObj;
}

// <=== BEHAVIOR FUNCTIONS ===>

function weightedInterpolation(t, tMin, tMax, value1, value2, gaussianRate, bezierRate) {
  if (bezierRate >= 1) return linear(t, tMin, tMax, value1, value2);
  
  var g = gaussianInterpolation(t, tMin, tMax, value1, value2, gaussianRate );
  if (bezierRate <= 0) return g; 
  
  var b = bezierInterpolation( t, tMin, tMax, value1, value2, [1-bezierRate, 0, bezierRate, 1]);
  return linear(linearRate, 0, 1, g, b);
}

function mainMotion(t, gaussianRate, bezierRate, slowDown) {
  if (numKeys < 2) return zeroVal;
  var nKey = getNextKey(t, thisProperty);
  if (!nKey) return zeroVal;
  var pKey = getPrevKey(t, thisProperty);
  if (!pKey) return zeroVal;
  // 4 cases : both keys are a summit, or each one is, or none.
  var pKeyTop = isKeyTop(pKey);
  var nKeyTop = isKeyTop(nKey);
  var nLastKey = slowDown >= 1;
  if (!nLastKey) {
    nLastKey = nKey.index == numKeys;
    // Check if we stop after the next keyframe
    if (!nLastKey && Math.abs(velocityAtTime(nKey.time + thisComp.frameDuration)) < .001) nLastKey = true;
  }
  if (pKeyTop && nKeyTop) {
    if (slowDown == 1 || !nLastKey) return weightedInterpolation(t, pKey.time, nKey.time, pKey.value, nKey.value, gaussianRate, bezierRate) - value;
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
		var pVal = prevKey.value;
		sOV = (pKey.value - pVal) / (nKey.value - pVal);
		sO = .33;
	}
	if (!nKeyTop) {
	  var nextKey = key(nKey.index + 1);
		var nVal = nextKey.value;
		sIV = (nKey.value - pKey.value) / (nVal - pKey.value);
		sI = .66;
	}
	else if (nLastKey) {
	  // end speed
	  sIV = slowDown/2+.5;
	}
	return bezierInterpolation(t, pKey.time, nKey.time, pKey.value, nKey.value, [sO, sOV, sI, sIV]) - value;
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
	if (!isStill(anticipationKey.time - 0.1, 0.1)) {
		anticipationKey = getPrevKey(time, thisProperty);
		if (!isStill(anticipationKey.time - 0.1, 0.1)) return anticipation;
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
		while (speedI < .001 && i > 0) {
			i = i - thisComp.frameDuration / moBlurPrecision;
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
			if (numEndCycles > 100 / damping && maxValue < .001) return zeroVal;
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
			fThrough = fThrough * (1 - propSpeed / .001);
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
		if (!isThisPosition) {
			fThrough = fThrough + getLayerWorldPos(time, thisLayer);
			fThrough = thisLayer.fromWorld(fThrough) - thisLayer.anchorPoint;
		} else if (thisLayer.hasParent) {
			fThrough = fThrough + getLayerWorldPos(time, thisLayer.parent);
			fThrough = thisLayer.parent.fromWorld(fThrough) - thisLayer.parent.anchorPoint;
		}
	}

	return fThrough;
}

// <=== DO IT ===>

// Use fuzzy logic to output needed values
var logic = new FuzzyLogic();

// SETS

// INPUT SETS
var tiny = logic.newSet("Tiny", 100, 0);
var small = logic.newSet("Small", 200, 0);
var big = logic.newSet("Big", 0, 200);
var huge = logic.newSet("Huge",100, 500);
var einstein = logic.newSet("Einstein", 200, 1000);

// OUTPUT SETS
// speed
var quick = logic.newSet("Quick", 0, -.85);
var slow = logic.newSet("Slow", -.3, 0);
var slowest = logic.newSet("Slowest", -.05, 0);
// ratios
var min = logic.newSet("Min", 0.5, 0);
var low = logic.newSet("Low", 1, 0);
var high = logic.newSet("High", 0, 1);
var max = logic.newSet("Max", 0.5, 1);
var double = logic.newSet("Double", 0.5, 2);
var triple = logic.newSet("Triple", 1, 3);
var quadruple = logic.newSet("Quadruple", 2, 4);
// durations
var none = logic.newSet("Short", 0.01, 0);
var planck = logic.newSet("Short", 0.2, 0);
var short = logic.newSet("Short", 0.4, 0);
var mediumD = logic.newSet("Medium Duration", 0.2, 0.4);
var long = logic.newSet("Long", 0.05, .6);
var veryLong = logic.newSet("Very Long", 0.2, 1.2);

// INPUT VALUES 
var linearRate = (100-weight)/100;
size = logic.newValue(size);
weight = logic.newValue(weight);
strength = logic.newValue(strength);
will = logic.newValue(will);
flexibility = logic.newValue(flexibility);
friction = logic.newValue(friction);

// OUTPUT VALUES
var interpolationRate = logic.newValue(0);
var anticipationDuration = logic.newValue(0);
var anticipationQuantity = logic.newValue(0);
var fThroughFlexibility = logic.newValue(flexibility.val/100);
var fThroughDuration = logic.newValue(0);
var slowDown = logic.newValue(0);

// RULES

// Size 
logic.IF( size.IS( small ));
logic.THEN( anticipationDuration, short );
logic.THEN( fThroughFlexibility, low );
logic.IF( size.IS( big ) );
logic.THEN( anticipationDuration, long );
logic.THEN( fThroughFlexibility, high );
logic.IF( size.IS( huge ) );
logic.THEN( anticipationDuration, veryLong );
logic.THEN( fThroughFlexibility, triple );
logic.IF( size.IS( einstein ) );
logic.THEN( fThroughFlexibility, quadruple );

// Weight
logic.IF( weight.IS( small )
  .AND( will.IS_NOT(tiny) )
  );
logic.THEN( interpolationRate, quick );
logic.THEN( fThroughDuration, long );
logic.IF( weight.IS( big ));
logic.THEN( interpolationRate, slow );
logic.THEN( fThroughDuration, short );
logic.IF( weight.IS( huge ));
logic.THEN( interpolationRate, slow );
logic.THEN( fThroughDuration, planck );
logic.IF( weight.IS( einstein ) );
logic.THEN( fThroughDuration, none );
logic.THEN( interpolationRate, slow );

// Strength
logic.IF( strength.IS( big ));
logic.THEN( interpolationRate, quick );
logic.THEN( fThroughDuration, short );
logic.THEN( slowDown, low );
logic.IF( strength.IS( small ));
logic.THEN( interpolationRate, slow );
logic.THEN( fThroughDuration, long );
logic.THEN( slowDown, high );

// Will
logic.IF( will.IS( small ));
logic.THEN( anticipationQuantity, min );
logic.THEN( interpolationRate, slow );
logic.THEN( fThroughDuration, long );
logic.THEN( slowDown, low );
logic.IF( will.IS( tiny ));
logic.THEN( anticipationQuantity, min );
logic.THEN( slowDown, min );
logic.IF( will.IS( big ));
logic.THEN( anticipationQuantity, low );
logic.IF( will.IS( huge ));
logic.THEN( anticipationQuantity, high );
logic.THEN( interpolationRate, quick );
logic.THEN( fThroughDuration, short );
logic.THEN( slowDown, max );

// Flexibility
logic.IF( flexibility.IS( tiny ));
logic.THEN( fThroughFlexibility, min );
logic.IF( flexibility.IS( small ));
logic.THEN( fThroughFlexibility, low );
logic.IF( flexibility.IS( big ));
logic.THEN( fThroughFlexibility, high );
logic.IF( flexibility.IS( huge ));
logic.THEN( fThroughFlexibility, max );
logic.IF( flexibility.IS( einstein ));
logic.THEN( fThroughFlexibility, double );

// Friction
logic.IF( friction.IS( tiny )
  .AND( will.IS_NOT(tiny) )
  );
logic.THEN( interpolationRate, quick );
logic.IF( friction.IS ( tiny ) );
logic.THEN( slowDown, min );
logic.IF( friction.IS( small ) );
logic.THEN( slowDown, low );
logic.IF( friction.IS( big ));
logic.THEN( interpolationRate, slow );
logic.THEN( fThroughDuration, planck );
logic.THEN( slowDown, high );
logic.IF( friction.IS( huge ));
logic.THEN( fThroughDuration, none );
logic.THEN( slowDown, max );//*/

// GET RESULTS 
interpolationRate = interpolationRate.crispify();
anticipationQuantity = anticipationQuantity.crispify();
anticipationDuration = anticipationDuration.crispify();
fThroughFlexibility = fThroughFlexibility.crispify();
fThroughDuration = fThroughDuration.crispify();
slowDown = slowDown.crispify();

// ADJUSTMENTS
// anticipation
var simulate = false;
anticipationQuantity = linear(will.val, 0, 20, 0, anticipationQuantity);
anticipationDuration *= anticipationCustomDuration/100;
anticipationQuantity *= anticipationCustomQuantity/100;
var overlapDuration = 0;
fThroughFlexibility *= fThroughCustomFlexibility/100;
fThroughDuration *= fThroughCustomDuration/100;
if (fThroughFlexibility < .01) fThroughFlexibility = 0;
if (fThroughDuration < .01) fThroughDuration = 0;
if (fThroughFlexibility == 0 || fThroughDuration == 0) slowDown = 1;
var bounce = bounce == 1;

result += mainMotion(time, interpolationRate, linearRate, slowDown);
result += anticipation(anticipationDuration, anticipationQuantity, interpolationRate, linearRate);
result += followThrough(fThroughFlexibility, fThroughDuration, slowDown, bounce, simulate, overlapDuration, anticipationDuration);
result;