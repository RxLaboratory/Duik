(function(thisObj)
{
/**
 * JSON parser.
 * @name JSON
 * @see {@link http://www.JSON.org/js.html|Json2}
 * @license Public-Domain
 */

if(typeof JSON!=="object"){JSON={};}
(function(){"use strict";var rx_one=/^[\],:{}\s]*$/;var rx_two=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;var rx_three=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;var rx_four=/(?:^|:|,)(?:\s*\[)+/g;var rx_escapable=/[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;var rx_dangerous=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;function f(n){return n<10?"0"+n:n;}
function this_value(){return this.valueOf();}
if(typeof Date.prototype.toJSON!=="function"){Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+
f(this.getUTCMonth()+1)+"-"+
f(this.getUTCDate())+"T"+
f(this.getUTCHours())+":"+
f(this.getUTCMinutes())+":"+
f(this.getUTCSeconds())+"Z":null;};Boolean.prototype.toJSON=this_value;Number.prototype.toJSON=this_value;String.prototype.toJSON=this_value;}
var gap;var indent;var meta;var rep;function quote(string){rx_escapable.lastIndex=0;return rx_escapable.test(string)?"\""+string.replace(rx_escapable,function(a){var c=meta[a];return typeof c==="string"?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4);})+"\"":"\""+string+"\"";}
function str(key,holder){var i;var k;var v;var length;var mind=gap;var partial;var value=holder[key];if(value&&typeof value==="object"&&typeof value.toJSON==="function"){value=value.toJSON(key);}
if(typeof rep==="function"){value=rep.call(holder,key,value);}
switch(typeof value){case"string":return quote(value);case"number":return isFinite(value)?String(value):"null";case"boolean":case"null":return String(value);case"object":if(!value){return"null";}
gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==="[object Array]"){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||"null";}
v=partial.length===0?"[]":gap?"[\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"]":"["+partial.join(",")+"]";gap=mind;return v;}
if(rep&&typeof rep==="object"){length=rep.length;for(i=0;i<length;i+=1){if(typeof rep[i]==="string"){k=rep[i];v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v);}}}}else{for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v);}}}}
v=partial.length===0?"{}":gap?"{\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"}":"{"+partial.join(",")+"}";gap=mind;return v;}}
if(typeof JSON.stringify!=="function"){meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r","\"":"\\\"","\\":"\\\\"};JSON.stringify=function(value,replacer,space){var i;gap="";indent="";if(typeof space==="number"){for(i=0;i<space;i+=1){indent+=" ";}}else if(typeof space==="string"){indent=space;}
rep=replacer;if(replacer&&typeof replacer!=="function"&&(typeof replacer!=="object"||typeof replacer.length!=="number")){throw new Error("JSON.stringify");}
return str("",{"":value});};}
if(typeof JSON.parse!=="function"){JSON.parse=function(text,reviver){var j;function walk(holder,key){var k;var v;var value=holder[key];if(value&&typeof value==="object"){for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v;}else{delete value[k];}}}}
return reviver.call(holder,key,value);}
text=String(text);rx_dangerous.lastIndex=0;if(rx_dangerous.test(text)){text=text.replace(rx_dangerous,function(a){return"\\u"+
("0000"+a.charCodeAt(0).toString(16)).slice(-4);});}
if(rx_one.test(text.replace(rx_two,"@").replace(rx_three,"]").replace(rx_four,""))){j=eval("("+text+")");return(typeof reviver==="function")?walk({"":j},""):j;}
throw new SyntaxError("JSON.parse");};}}());
/**
* The general Duduf After Effects ExtendScript Framework namespace.<br />
* Provides some general tools and information.
* @namespace
* @example
* //The framework version is
* DuAEF.version; //Currently "0.0.1"
* //If you need to get the OS the script is running on
* DuAEF.mac; //true on mac
* DuAEF.win; //true on windows
*/
var DuAEF = {};
/**
* The Current DuAEF Version
* @readonly
* @memberof DuAEF
* @type {string}
*/
DuAEF.version = "0.0.4-Alpha";
/**
* Set to true and enable debug mode if you're a developper
* @memberof DuAEF
* @type {boolean}
*/
DuAEF.debug = false;

/**
* Includes binaries needed by some libraries, like pngquant for DuQuantLib or FFmpeg for DuFFmpegLib.<br />
* The binaries are available only if you include DuAEF.jsxinc or DuAEF_full.jsxinc.<br />
* If you use the DuAEF_no_bin.jsxinc version of DuAEF, this is an empty object.<br />
* @namespace
* @memberof DuAEF
*/
DuAEF.bin = {};

//Initializes DuAEF
(function ()
{
	//detect OS Version
	var mac = $.os.toLowerCase().indexOf("mac") >= 0;
	/**
	* The current OS, true if we're on Mac OS
	* @memberof DuAEF
	* @readonly
	* @type {boolean}
	*/
	DuAEF.mac = mac;
	/**
	* The current OS, true if we're on Windows
	* @memberof DuAEF
	* @readonly
	* @type {boolean}
	*/
	DuAEF.win = !mac;

	//the binaries
	DuAEF.bin.pngquant = null;
	DuAEF.bin.pngquantbatch = null

})();
/*
DuAECoreLib
Library with core After Effects tools. Contains the main class of Duduf AE Framework
Copyright (c) 2017 Nicolas Dufresne, Rainbox Productions
https://rainboxprod.coop

_Contributors:_
Nicolas Dufresne - Lead developer

This file is part of DuAEF.

DuAEF is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

DuAEF is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with DuAEF. If not, see <http://www.gnu.org/licenses/>.
*/

/**
* Constructs a new KeySpatialProperty
* @class KeySpatialProperties
* @classdesc Spatial properties of a {@linkcode KeyFrame}.
* @property {float[]|null}	  [inTangent=null]     - The incoming spatial tangent
* @property {float[]|null}    [outTangent=null]            -  The outgoing spatial tangent
* @property {boolean}      [_continuous=true]         - true if the specified keyframe has spatial continuity
* @property {boolean}	[_autoBezier=false]			- true if the specified keyframe has temporal auto-Bezier interpolation
* @property {boolean}	[_roving=false]	- true if the specified keyframe is roving
*/
function KeySpatialProperties (){
	this.inTangent = null;
	this.outTangent = null;
	this._continuous = true;
	this._autoBezier = false;
	this._roving = false;
}

/**
* Constructs a new KeyFrame
* @class KeyFrame
* @classdesc Properties of an After Effects Keyframe, as returned by {@linkcode DuAEF.DuAE.Property.getKeyFrames} or {@linkcode DuAEF.DuAE.Property.getKeyFrameAtIndex} or {@linkcode DuAEF.DuAE.Property.getKeyFrameAtTime}.
* @property {float}	  _time     - The keyframe time
* @property {null|folat[]|float|MarkerValue|int|Shape|TextDocument}    value  -  The keyframe value
* @property {KeyframeInterpolationType}   _inInterpolationType  - The incoming temporal interpolation type
* @property {KeyframeInterpolationType}	_outInterpolationType		- The outgoing temporal interpolation type
* @property {boolean}	_spatial	- true if this keyframe has a spatial value
* @property {KeySpatialProperties}	spatialProperties	- the spatial properties {@linkcode KeySpatialProperties} of this keyframe
* @property {KeyframeEase[]}	inEase	- The incoming temporal ease. The number of objects in the Array depends on the value type
* @property {KeyframeEase[]}	outEase	- The outgoing temporal ease. The number of objects in the Array depends on the value type
* @property {boolean}	_continuous	- true if the keyframe has temporal continuity
* @property {boolean}	_autoBezier	- true if the keyframe has temporal auto-Bezier interpolation
* @property {int}		_index	- The index of the keyFrame. Warning: not updated when another key frame is added on the property some time before this key._time!
*/
function KeyFrame(){
	this._time = 0;
	this.value = null;
	this._inInterpolationType = KeyframeInterpolationType.LINEAR;
	this._outInterpolationType = KeyframeInterpolationType.LINEAR;
	this._spatial = false;
	this.spatialProperties = new KeySpatialProperties();
	this.inEase = null;
	this.outEase = null;
	this._continuous = false;
	this._autoBezier = false;
	this._index = 0;
}

/**
* Constructs a new animation
* @class PropertyAnim
* @classdesc Describes the animation of an After Effects property
* @property {string}	  [_name=""]     - The property name
* @property {string}    [_matchName=""]  - The property matchName
* @property {KeyFrame[]}   [keys=[]]  - The keyframes of the animation
* @property {null|folat[]|float|MarkerValue|int|Shape|TextDocument}	[startValue=null]		- The value at the beginning of the animation
* @property {string}	[expression=""]		- The expression on the property, if any.
* @property {string}   [type="anim"]  - Read Only.
*/
function PropertyAnim()
{
	this._name = "";
	this._matchName = "";
	this.keys = [];
	this.startValue = null;
	this.type = "anim";
	this.expression = "";
	this.dimensions = 0;
}

/**
* Constructs a new group animation
* @class PropertyGroupAnim
* @classdesc Contains all PropertyAnim from an After Effects PropertyGroup
* @property {string}	  [_name=""]     - The property name
* @property {string}    [_matchName=""]  - The property matchName
* @property {PropertyAnim[]|PropertyGroupAnim[]}   [anims=[]]  - The animations in the group
* @property {string}   [type="group"]  - Read Only.
*/
function PropertyGroupAnim()
{
	this._name = "";
	this._matchName = "";
	this.anims = [];
	this.type = "group";
}

/**
* Constructs a new layer animation
* @class LayerAnim
* @classdesc Contains all PropertyGroupAnim from an After Effects Layer
* @property {string}	  [_name=""]     - The property name
* @property {int}    [_index=""]  - The index of the layer
* @property {PropertyGroupAnim[]} [anims=[]] - All the animations of the layer
* @property {float} [firstKeyFrameTime=0] - The time of the first keyframe
* @property {string}   [type="layer"]  - Read Only.
*/
function LayerAnim()
{
	this._name = "";
	this._index = 0;
	this.anims = [];
	this.type = 'layer';
}

/**
* Constructs a new PropertyInfo
* @example
* var propInfo = new PropertyInfo(property);
* layer("ADBE effect parade").addProperty("ADBE layer control"); //now the property object is broken
* property = propInfo.getProperty(); // You can retrieve the property like this, fixed if it's an effect
* @class PropertyInfo
* @classdesc Get some handy informations about a property<br />
* This class is able to "fix" effects properties which have been broken by
* the addition of another effect on the same layer, as long as the class has been
* instanciated before the effect has been broken.
* @param {PropertyBase} property - The property
* @property {int} index - The propertyIndex
* @property {boolean} isEffect - true if this is an effect (sub)property
* @property {boolean} riggable  - true if this prop can be rigged (it's a value which can set expressions)
* @property {Layer} layer - The layer containing the property
* @property {int} dimensions - The number of dimensions, 0 if this is not a dimensionnal value (ie color, text, shape...)
*/
function PropertyInfo(property)
{
	this.property = property;
	this.index = property.propertyIndex;
	this.parentIndices  = [this.index];
	this.isEffect = property.isEffect;
	var parentProp = property;
	while (parentProp.parentProperty)
	{
		// Traverse up the property tree
		parentProp = parentProp.parentProperty;
		this.isEffect = parentProp.isEffect;
		this.parentIndices.unshift(parentProp.propertyIndex);
		if (this.isEffect) break;
	}

	var riggable = true;
	if (property.propertyType != PropertyType.PROPERTY) riggable = false;
	if (!property.canVaryOverTime) riggable = false;
	if (!property.canSetExpression) riggable = false;
	if (property.elided) riggable = false;
	this.riggable = riggable;
	this.layer = DuAEF.DuAE.Property.getLayer(property);
	this.dimensions = DuAEF.DuAE.Property.getDimensions(property);
}

/**
* Gets the original Property<br />
* Always works even if this PropertyInfo represents an effect which has been broken<br />
* ---AE Hack---
* @memberof PropertyInfo
* @return {PropertyBase} The property
* @todo When returning an effect, check if the matchName corresponds too.
*/
PropertyInfo.prototype.getProperty = function()
{
	if (this.isEffect)
	{
		var parentProp = this.layer("ADBE Effect Parade");
		for (var i = 0 ; i < this.parentIndices.length ; i++)
		{
			parentProp = parentProp(this.parentIndices[i]);
		}
		this.property = parentProp;
	}
	return this.property;
}

/**
* After Effects tools
* @namespace
* @memberof DuAEF
*/
DuAEF.DuAE = {};

//init
(function ()
{
	/**
	 * The axis or channels
	 * @enum {int}
	 * @readonly
	 */
	DuAEF.DuAE.Axis =
	{
		X: 1,
		Y: 2,
		Z: 3,
		RED: 4,
		GREEN: 5,
		BLUE: 6,
		ALPHA: 7,
		HUE: 8,
		SATURATION: 9,
		VALUE: 10
	}

	/**
	 * Types of values
	 * @enum {int}
	 * @readonly
	 */
	DuAEF.DuAE.Types =
	{
		VALUE: 1,
		VELOCITY: 2
	}

	/**
	* Associative array that converts property match names to their compact English expression statements.
	* @example
	* DuAEF.DuAE.compactExpressions["ADBE Transform Group"]
	* //returns "'transform'"
	*/
	DuAEF.DuAE.compactExpressions = {
				"ADBE Transform Group":"'transform'",
				// Handle camera/light vs. AV layers
				"ADBE Anchor Point":"((prop.propertyGroup(prop.propertyDepth).property('intensity')!=null) || (prop.propertyGroup(prop.propertyDepth).property('zoom')!=null)) ? '.pointOfInterest' : '.anchorPoint'",
				"ADBE Position":"'.position'",
				"ADBE Scale":"'.scale'",
				"ADBE Orientation":"'.orientation'",
				"ADBE Rotate X":"'.xRotation'",
				"ADBE Rotate Y":"'.yRotation'",
				// Handle 3D vs. 2D layers
				"ADBE Rotate Z":"(prop.propertyGroup(prop.propertyDepth).threeDLayer || (prop.propertyGroup(prop.propertyDepth).property('intensity')!=null) || (prop.propertyGroup(prop.propertyDepth).property('zoom')!=null)) ? '.zRotation' : '.rotation'",
				"ADBE Opacity":"'.opacity'",
				"ADBE Material Options Group":"'materialOption'",
				"ADBE Casts Shadows":"'.castsShadows'",
				"ADBE Light Transmission":"'.lightTransmission'",
				"ADBE Accepts Shadows":"'.acceptsShadows'",
				"ADBE Accepts Lights":"'.acceptsLights'",
				"ADBE Ambient Coefficient":"'.ambient'",
				"ADBE Diffuse Coefficient":"'.diffuse'",
				"ADBE Specular Coefficient":"'.specular'",
				"ADBE Shininess Coefficient":"'.shininess'",
				"ADBE Metal Coefficient":"'.metal'",
				"ADBE Light Options Group":"'lightOption'",
				"ADBE Light Intensity":"'.intensity'",
				"ADBE Light Color":"'.color'",
				"ADBE Light Cone Angle":"'.coneAngle'",
				"ADBE Light Cone Feather 2":"'.coneFeather'",
				"ADBE Light Shadow Darkness":"'.shadowDarkness'",
				"ADBE Light Shadow Diffusion":"'.shadowDiffusion'",
				"ADBE Camera Options Group":"'cameraOption'",
				"ADBE Camera Zoom":"'.zoom'",
				"ADBE Camera Depth of Field":"'.depthOfField'",
				"ADBE Camera Focus Distance":"'.focusDistance'",
				"ADBE Camera Aperture":"'.aperture'",
				"ADBE Camera Blur Level":"'.blurLevel'",
				"ADBE Text Properties":"'text'",
				"ADBE Text Document":"'.sourceText'",
				"ADBE Text Path Options":"'.pathOption'",
				"ADBE Text Path":"'.path'",
				"ADBE Text Reverse Path":"'.reversePath'",
				"ADBE Text Perpendicular To Path":"'.perpendicularToPath'",
				"ADBE Text Force Align Path":"'.forceAlignment'",
				"ADBE Text First Margin":"'.firstMargin'",
				"ADBE Text Last Margin":"'.lastMargin'",
				"ADBE Text More Options":"'.moreOption'",
				"ADBE Text Anchor Point Option":"'.anchorPointGrouping'",
				"ADBE Text Anchor Point Align":"'.groupingAlignment'",
				"ADBE Text Render Order":"'.fillANdStroke'",
				"ADBE Text Character Blend Mode":"'.interCharacterBlending'",
				"ADBE Text Animators":"'.animator'",
				"ADBE Text Selectors":"'.selector'",
				"ADBE Text Percent Start":"'.start'",
				"ADBE Text Percent End":"'.end'",
				"ADBE Text Percent Offset":"'.offset'",
				"ADBE Text Index Start":"'.start'",
				"ADBE Text Index End":"'.end'",
				"ADBE Text Index Offset":"'.offset'",
				"ADBE Text Range Advanced":"'.advanced'",
				"ADBE Text Range Units":"'.units'",
				"ADBE Text Range Type2":"'.basedOn'",
				"ADBE Text Selector Mode":"'.mode'",
				"ADBE Text Selector Max Amount":"'.amount'",
				"ADBE Text Range Shape":"'.shape'",
				"ADBE Text Selector Smoothness":"'.smoothness'",
				"ADBE Text Levels Max Ease":"'.easeHigh'",
				"ADBE Text Levels Min Ease":"'.easeLow'",
				"ADBE Text Randomize Order":"'.randomizeOrder'",
				"ADBE Text Random Seed":"'.randomSeed'",
				"ADBE Text Selector Mode":"'.mode'",
				"ADBE Text Wiggly Max Amount":"'.maxAmount'",
				"ADBE Text Wiggly Min Amount":"'.minAmount'",
				"ADBE Text Range Type2":"'.basedOn'",
				"ADBE Text Temporal Freq":"'.wigglesSecond'",
				"ADBE Text Character Correlation":"'.correlation'",
				"ADBE Text Temporal Phase":"'.temporalPhase'",
				"ADBE Text Spatial Phase":"'.spatialPhase'",
				"ADBE Text Wiggly Lock Dim":"'.lockDimensions'",
				"ADBE Text Wiggly Random Seed":"'.randomSeed'",
				"ADBE Text Range Type2":"'.basedOn'",
				"ADBE Text Expressible Amount":"'.amount'",
				"ADBE Text Animator Properties":"'.property'",
				"ADBE Text Anchor Point 3D":"'.anchorPoint'",
				"ADBE Text Position 3D":"'.position'",
				"ADBE Text Scale 3D":"'.scale'",
				"ADBE Text Skew":"'.skew'",
				"ADBE Text Skew Axis":"'.skewAxis'",
				"ADBE Text Rotation X":"'.xRotation'",
				"ADBE Text Rotation Y":"'.yRotation'",
				"ADBE Text Rotation":"'.zRotation'",
				"ADBE Text Opacity":"'.opacity'",
				"ADBE Text Fill Opacity":"'.fillOpacity'",
				"ADBE Text Fill Color":"'.fillColor'",
				"ADBE Text Fill Hue":"'.fillHue'",
				"ADBE Text Fill Saturation":"'.fillSaturation'",
				"ADBE Text Fill Brightness":"'.fillBrightness'",
				"ADBE Text Stroke Opacity":"'.strokeOpacity'",
				"ADBE Text Stroke Color":"'.strokeColor'",
				"ADBE Text Stroke Hue":"'.strokeHue'",
				"ADBE Text Stroke Saturation":"'.strokeSaturation'",
				"ADBE Text Stroke Brightness":"'.strokeBrightness'",
				"ADBE Text Stroke Width":"'.strokeWidth'",
				"ADBE Text Line Anchor":"'.lineAnchor'",
				"ADBE Text Line Spacing":"'.lineSpacing'",
				"ADBE Text Track Type":"'.trackingType'",
				"ADBE Text Tracking Amount":"'.trackingAmount'",
				"ADBE Text Character Change Type":"'.characterAlignment'",
				"ADBE Text Character Range":"'.characterRange'",
				"ADBE Text Character Replace":"'.characterValue'",
				"ADBE Text Character Offset":"'.characterOffset'",
				"ADBE Text Blur":"'.blur'",
				"ADBE Mask Parade":"'mask'",
				"ADBE Mask Shape":"'.maskPath'",
				"ADBE Mask Feather":"'.maskFeather'",
				"ADBE Mask Opacity":"'.maskOpacity'",
				"ADBE Mask Offset":"'.maskExpansion'",
				"ADBE Effect Parade":"'effect'",
				"ADBE Paint Group":"'.stroke'",
				"ADBE Paint Shape":"'.path'",
				"ADBE Paint Properties":"'.strokeOption'",
				"ADBE Paint Begin":"'.start'",
				"ADBE Paint End":"'.end'",
				"ADBE Paint Color":"'.color'",
				"ADBE Paint Diameter":"'.diameter'",
				"ADBE Paint Angle":"'.angle'",
				"ADBE Paint Hardness":"'.hardness'",
				"ADBE Paint Roundness":"'.roundness'",
				"ADBE Paint Tip Spacing":"'.spacing'",
				"ADBE Paint Target Channels":"'.channels'",
				"ADBE Paint Opacity":"'.opacity'",
				"ADBE Paint Flow":"'.flow'",
				"ADBE Paint Clone Layer":"'.cloneSource'",
				"ADBE Paint Clone Position":"'.clonePosition'",
				"ADBE Paint Clone Time":"'.cloneTime'",
				"ADBE Paint Clone Time Shift":"'.cloneTimeShift'",
				"ADBE Paint Transform":"'.transform'",
				"ADBE Paint Anchor Point":"'.anchorPoint'",
				"ADBE Paint Position":"'.position'",
				"ADBE Paint Scale":"'.scale'",
				"ADBE Paint Rotation":"'.rotation'",
				"ADBE MTrackers":"'motionTracker'",
				"ADBE MTracker Pt Feature Center":"'.featureCenter'",
				"ADBE MTracker Pt Feature Size":"'.featureSize'",
				"ADBE MTracker Pt Search Ofst":"'.searchOffset'",
				"ADBE MTracker Pt Search Size":"'.searchSize'",
				"ADBE MTracker Pt Confidence":"'.confidence'",
				"ADBE MTracker Pt Attach Pt":"'.attachPoint'",
				"ADBE MTracker Pt Attach Pt Ofst":"'.attachPointOffset'",
				"ADBE Audio Group":"'audio'",
				"ADBE Audio Levels":"'.audioLevels'",
				"ADBE Time Remapping":"'timeRemap'",
				"ADBE Layer Styles":"'layerStyle'",
				"ADBE Blend Options Group":"'.blendingOption'",
					"ADBE Global Angle2":"'.globalLightAngle'",
					"ADBE Global Altitude2":"'.globalLightAltitude'",
					"ADBE Adv Blend Group":"'.advancedBlending'",
					"ADBE Layer Fill Opacity2":"'.fillOpacity'",
					"ADBE R Channel Blend":"'.red'",
					"ADBE G Channel Blend":"'.green'",
					"ADBE B Channel Blend":"'.blue'",
					"ADBE Blend Interior":"'.blendInteriorStylesAsGroup'",
					"ADBE Blend Ranges":"'.useBlendRangesFromSource'",
				"dropShadow/enabled":"'.dropShadow'",
					"dropShadow/mode2":"'.blendMode'",
					"dropShadow/color":"'.color'",
					"dropShadow/opacity":"'.opacity'",
					"dropShadow/useGlobalAngle":"'.useGlobalLight'",
					"dropShadow/localLightingAngle":"'.angle'",
					"dropShadow/distance":"'.distance'",
					"dropShadow/chokeMatte":"'.spread'",
					"dropShadow/blur":"'.size'",
					"dropShadow/noise":"'.noise'",
					"dropShadow/layerConceals":"'.layerKnocksOutDropShadow'",
				"innerShadow/enabled":"'.innerShadow'",
					"innerShadow/mode2":"'.blendMode'",
					"innerShadow/color":"'.color'",
					"innerShadow/opacity":"'.opacity'",
					"innerShadow/useGlobalAngle":"'.useGlobalLight'",
					"innerShadow/localLightingAngle":"'.angle'",
					"innerShadow/distance":"'.distance'",
					"innerShadow/chokeMatte":"'.choke'",
					"innerShadow/blur":"'.size'",
					"innerShadow/noise":"'.noise'",
				"outerGlow/enabled":"'.outerGlow'",
					"outerGlow/mode2":"'.blendMode'",
					"outerGlow/opacity":"'.opacity'",
					"outerGlow/noise":"'.noise'",
					"outerGlow/AEColorChoice":"'.colorType'",
					"outerGlow/color":"'.color'",
					"outerGlow/gradientSmoothness":"'.gradientSmoothness'",
					"outerGlow/glowTechnique":"'.technique'",
					"outerGlow/chokeMatte":"'.spread'",
					"outerGlow/blur":"'.size'",
					"outerGlow/inputRange":"'.range'",
					"outerGlow/shadingNoise":"'.jitter'",
				"innerGlow/enabled":"'.innerGlow'",
					"innerGlow/mode2":"'.blendMode'",
					"innerGlow/opacity":"'.opacity'",
					"innerGlow/noise":"'.noise'",
					"innerGlow/AEColorChoice":"'.colorType'",
					"innerGlow/color":"'.color'",
					"innerGlow/gradientSmoothness":"'.gradientSmoothness'",
					"innerGlow/glowTechnique":"'.technique'",
					"innerGlow/innerGlowSource":"'.source'",
					"innerGlow/chokeMatte":"'.choke'",
					"innerGlow/blur":"'.size'",
					"innerGlow/inputRange":"'.range'",
					"innerGlow/shadingNoise":"'.jitter'",
				"bevelEmboss/enabled":"'.bevelAndEmboss'",
					"bevelEmboss/bevelStyle":"'.style'",
					"bevelEmboss/bevelTechnique":"'.technique'",
					"bevelEmboss/strengthRatio":"'.depth'",
					"bevelEmboss/bevelDirection":"'.direction'",
					"bevelEmboss/blur":"'.size'",
					"bevelEmboss/softness":"'.soften'",
					"bevelEmboss/useGlobalAngle":"'.useGlobalLight'",
					"bevelEmboss/localLightingAngle":"'.angle'",
					"bevelEmboss/localLightingAltitude":"'.altitude'",
					"bevelEmboss/highlightMode":"'.highlightMode'",
					"bevelEmboss/highlightColor":"'.highlightColor'",
					"bevelEmboss/highlightOpacity":"'.highlightOpacity'",
					"bevelEmboss/shadowMode":"'.shadowMode'",
					"bevelEmboss/shadowColor":"'.shadowColor'",
					"bevelEmboss/shadowOpacity":"'.shadowOpacity'",
				"chromeFX/enabled":"'.satin'",
					"chromeFX/mode2":"'.blendMode'",
					"chromeFX/color":"'.color'",
					"chromeFX/opacity":"'.opacity'",
					"chromeFX/localLightingAngle":"'.angle'",
					"chromeFX/distance":"'.distance'",
					"chromeFX/blur":"'.size'",
					"chromeFX/invert":"'.invert'",
				"solidFill/enabled":"'.colorOverlay'",
					"solidFill/mode2":"'.blendMode'",
					"solidFill/color":"'.color'",
					"solidFill/opacity":"'.opacity'",
				"gradientFill/enabled":"'.gradientOverlay'",
					"gradientFill/mode2":"'.blendMode'",
					"gradientFill/opacity":"'.opacity'",
					"gradientFill/gradientSmoothness":"'.gradientSmoothness'",
					"gradientFill/angle":"'.angle'",
					"gradientFill/type":"'.style'",
					"gradientFill/reverse":"'.reverse'",
					"gradientFill/align":"'.alignWithLayer'",
					"gradientFill/scale":"'.scale'",
					"gradientFill/offset":"'.offset'",
				"patternFill/enabled":"'.patternOverlay'",
					"patternFill/mode2":"'.blendMode'",
					"patternFill/opacity":"'.opacity'",
					"patternFill/align":"'.linkWithLayer'",
					"patternFill/scale":"'.scale'",
					"patternFill/phase":"'.offset'",
				"frameFX/enabled":"'.stroke'",
					"frameFX/mode2":"'.blendMode'",
					"frameFX/color":"'.color'",
					"frameFX/size":"'.size'",
					"frameFX/opacity":"'.opacity'",
					"frameFX/style":"'.position'",
			};
})();

/**
* Checks if the param is an AE collection or an Array
* @param {Array|Collection} collection - The list to check
* @return {boolean} true if collection is a collection, false if it's an array
*/
DuAEF.DuAE.isCollection = function (collection)
{
	return collection instanceof ItemCollection || collection instanceof LayerCollection || collection instanceof OMCollection || collection instanceof RQItemCollection;
}

/**
* Gets the PropertyInfo for the properties
* @param {PropertyBase[]} props - The Properties
* @return {PropertyInfo[]} The info
*/
DuAEF.DuAE.getPropertyInfos = function (props)
{
	//convert to propinfo
	var propInfos = [];
	for (var i = 0 ; i < props.length ; i++)
	{
		var propInfo;
		if (props[i] instanceof PropertyInfo) propInfo = props[i];
		else propInfo = new PropertyInfo(props[i]);
		propInfos.push(propInfo);
	}
	return propInfos;
}

/**
* Converts an AE Collection to an Array<br />
* Should only be used in case you need an copy of the collection as an Array,<br />
* you should use an {@link Iterator} otherwise
* @param {Array|Collection} collection - The collection to convert
* @return {Array} The array
*/
DuAEF.DuAE.convertCollectionToArray = function (collection)
{
	var arr = [];
	if (DuAEF.DuAE.isCollection(collection))
	{
		for (var i = 1;i<=collection.length;i++)
		{
			arr.push(collection[i]);
		}
	}
	else
	{
		arr = collection;
	}
	return arr;
}

/**
* Application related methods
* @namespace
* @memberof DuAEF.DuAE
*/
DuAEF.DuAE.App = {};

//App Properties
(function ()
{
	//detect AE Version
	var reV = /^(\d+\.?\d*)/i;
	var v = app.version.match(reV);

	/**
	* The After Effects version
	* @memberof DuAEF.DuAE.App
	* @readonly
	* @type {float}
	*/
	DuAEF.DuAE.App.version = parseFloat(v[1]);

	/**
	 * Has scripting file and network authorization
	 * @readonly
	 * @type {boolean}
	 */
	DuAEF.DuAE.App.hasFilesAndNetworkAccess = app.preferences.getPrefAsLong("Main Pref Section","Pref_SCRIPTING_FILE_NETWORK_SECURITY") == 1;
})();

/**
* Asks the user to check the file and network security pref if not already set.
* Opens the general prefrences of After Effects.
* @memberof DuAEF.DuAE.App
* @param {boolean}	[showAlert=true]	- Wether to display an alert before opening the preferences
* @param {string}	[message=The Duduf After Effects scripting framework needs to be allowed to write files\nPlease, check the box called 'Allow Scripts to write files...' in the general preferences of After Effects.]	- The message to display in the alert.
* @return {boolean}	Wether the preference has been set
*/
DuAEF.DuAE.App.askFilesAndNetworkAccess = function(showAlert,message)
{
	if (showAlert == undefined) alert = true;
	if (message == undefined ) message = "The Duduf After Effects scripting framework needs to be allowed to write files\nPlease, check the box called 'Allow Scripts to write files...' in the general preferences of After Effects.";
	if (!DuAEF.DuAE.App.hasFilesAndNetworkAccess)
	{

		if (showAlert) alert(message);
		app.executeCommand(2359);

		DuAEF.DuAE.App.hasFilesAndNetworkAccess = app.preferences.getPrefAsLong("Main Pref Section","Pref_SCRIPTING_FILE_NETWORK_SECURITY") == 1;
	}
	return DuAEF.DuAE.App.hasFilesAndNetworkAccess;
}

/**
* Gets the public name of a version of After Effects (like CC2015.3 for version 13.8)
* @param {float}	[versionAsFloat]	- The version as a float. If not provided, will default to the current version of the running instance of After Effects.
* @return {string}	The version name.
*/
DuAEF.DuAE.App.getAEVersionName = function(versionAsFloat)
{
	if (versionAsFloat == undefined) versionAsFloat = DuAEF.DuAE.App.version;
	if (versionAsFloat < 8) return "" + versionAsFloat;
	if (versionAsFloat >= 8 && versionAsFloat < 9) return "CS3";
	if (versionAsFloat >= 9 && versionAsFloat < 10) return "CS4";
	if (versionAsFloat >= 10 && versionAsFloat < 10.5) return "CS5";
	if (versionAsFloat >= 10.5 && versionAsFloat < 11) return "CS5.5";
	if (versionAsFloat >= 11 && versionAsFloat < 12) return "CS6";
	if (versionAsFloat >= 12 && versionAsFloat < 13) return "CC";
	if (versionAsFloat >= 13 && versionAsFloat < 13.1) return "CC2014";
	if (versionAsFloat >= 13.1 && versionAsFloat < 13.2) return "CC2014.1";
	if (versionAsFloat >= 13.2 && versionAsFloat < 13.5) return "CC2014.2";
	if (versionAsFloat >= 13.5 && versionAsFloat < 13.6) return "CC2015";
	if (versionAsFloat >= 13.6 && versionAsFloat < 13.7) return "CC2015.1";
	if (versionAsFloat >= 13.7 && versionAsFloat < 13.8) return "CC2015.2";
	if (versionAsFloat >= 13.8 && versionAsFloat < 14) return "CC2015.3";
	if (versionAsFloat >= 14 && versionAsFloat < 15) return "CC2017";
	if (versionAsFloat >= 15 && versionAsFloat < 16) return "CC2018";
	else return "Unknown";
}

/**
* After Effects project methods
* @namespace
* @memberof DuAEF.DuAE
*/
DuAEF.DuAE.Project = {};

/**
* Gets the After Effects current composition
* @return {CompItem|null} The current composition or null if there's no current comp
*/
DuAEF.DuAE.Project.getActiveComp = function()
{
	var comp = app.project.activeItem;
	if (!comp) return null;
	if (!(comp instanceof CompItem)) return null;
	return comp;
}

/**
* After Effects composition methods
* @namespace
* @memberof DuAEF.DuAE
*/
DuAEF.DuAE.Comp = {};

/**
* Gets the After Effects selected properties in the current comp
* @param {PropertyType|PropertyValueType|string|function}	 [filter]	- A filter to get only a certain type, or value type, or property name or matchName.<br />
* A function which take one PropertyBase as argument can be used to filter the properties: the Property will be returned if the function returns true.
* @param {boolean}	[strict=false]	- If a string filter is provided, wether to search for the exact name/matchName or if it contains the filter.
* @param {boolean}	[caseSensitive=true]	- If a string filter is provided, and not strict is false, does the search have to be case sensitive?
* @return {PropertyInfo[]} The selected properties, an empty Array if nothing active or selected
*/
DuAEF.DuAE.Comp.getSelectedProps = function(filter,strict,caseSensitive)
{
	var props = [];
	var comp = DuAEF.DuAE.Project.getActiveComp();
	if (!comp) return props;

	//if no filter, get all using AE native API
	if (filter == undefined)
	{
		props = comp.selectedProperties;
	}
	else
	{
		var layers = comp.selectedLayers;
		if (layers.length === 0) return props;

		for (var i = 0 ; i < layers.length ; i++)
		{
			props = props.concat(DuAEF.DuAE.Layer.getSelectedProps(layers[i],filter,strict,caseSensitive));
		}
	}

	return DuAEF.DuAE.getPropertyInfos(props);
}

/**
* Deselects all properties in the current composition
*/
DuAEF.DuAE.Comp.unselectProperties = function()
{
	var comp = DuAEF.DuAE.Project.getActiveComp();
	if (!comp) return props;
	var props = comp.selectedProperties;
	for (var i = 0; i < props.length ; i++)
	{
		props[i].selected = false;
	}
}

/**
* Deselects all layers in the current composition
* @return {Layer[]} The previously selected layers.<br />
* A custom attribute, Layer.props is added on each layer object which is an array of all previously selected properties as PropertyInfo objects
*/
DuAEF.DuAE.Comp.unselectLayers = function()
{
	var comp = app.project.activeItem;

	var layers = [];

	if (!comp) return layers;
	if (!(comp instanceof CompItem)) return layers;

	layers = [];

	while (comp.selectedLayers.length > 0)
	{
		var layer = comp.selectedLayers[0];
		layer.props = DuAEF.DuAE.getPropertyInfos(layer.selectedProperties);
		layer.selected = false;
		layers.push(layer);
	}

	return layers;
}

/**
* Selects the layers
* @param {Layer[]} layers - The layers
*/
DuAEF.DuAE.Comp.selectLayers = function (layers)
{
	for (var i = 0 ; i < layers.length ; i++)
	{
		if (layers[i] == undefined) continue;
		if (layers[i] == null) continue;
		layers[i].selected = true;
	}
}

/**
* Generates a new unique name for a layer
* @param {string} newName	- The wanted new name
* @param {CompItem} comp 	- The comp
* @param {boolean} [increment=true] - true to automatically increment the new name if it already ends with a digit
* @return {string}	The unique name, with a new number at the end if needed.
*/
DuAEF.DuAE.Comp.newUniqueLayerName = function(newName, comp,increment)
{
	if (increment == undefined) increment = true;
	var layerNames = [];
	for (var i = 1 ; i <= comp.layers.length ; i++)
	{
		layerNames.push(comp.layer(i).name);
	}
	return DuAEF.DuJS.String.generateUnique(newName,layerNames,increment);
}

/**
* Creates a new Adjustment layer
* @param {CompItem} comp 	- The comp
* @return {AVLayer}	The layer.
*/
DuAEF.DuAE.Comp.addAdjustmentLayer = function(comp)
{
	if (comp == undefined) return null;
	var layer = comp.layers.addSolid([1,1,1], DuAEF.DuAE.Comp.newUniqueLayerName("Adjustment Layer",comp) , comp.width, comp.height, comp.pixelAspect, comp.duration);
	layer.adjustmentLayer = true;
	return layer;
}

/**
* After Effects layer methods
* @namespace
* @memberof DuAEF.DuAE
*/
DuAEF.DuAE.Layer = {};

/**
* Generates a new unique name for an effect
* @param {string} newName	- The wanted new name
* @param {Layer} layer 	- The layer
* @param {boolean} [increment=true] - true to automatically increment the new name if it already ends with a digit
* @return {string}	The unique name, with a new number at the end if needed.
*/
DuAEF.DuAE.Layer.newUniqueEffectName = function(newName, layer, increment)
{
	if (!layer) throw new Error("Needs a layer to generate a new unique effect name","DuAECOreLib",645);
	if (increment == undefined) increment = true;
	if (newName == undefined) return "";
	if (newName == "") return "";
	var effectNames = [];
	for (var i = 1 ; i <= layer.effect.numProperties ; i++)
	{
		effectNames.push(layer.effect(i).name);
	}
	return DuAEF.DuJS.String.generateUnique(newName,effectNames,increment);
}

/**
* Gets the After Effects selected properties in the layer
* @param {Layer}	layer	- The layer
* @param {PropertyType|PropertyValueType|string|function}	 [filter]	- A filter to get only a certain type, or value type, or property name or matchName.<br />
* A function which take one PropertyBase as argument can be used to filter the properties: the Property will be returned if the function returns true.
* @param {boolean}	[strict=false]	- If a string filter is provided, wether to search for the exact name/matchName or if it contains the filter.
* @param {boolean}	[caseSensitive=true]	- If a string filter is provided, and not strict is false, does the search have to be case sensitive?
* @return {PropertyBase[]} The selected properties, an empty Array if nothing active or selected
*/
DuAEF.DuAE.Layer.getSelectedProps = function(layer,filter,strict,caseSensitive)
{
	if (strict == undefined) strict = false;
	if (caseSensitive == undefined) caseSensitive = true;

	var props = [];

	if (!caseSensitive && typeof filter === "string") filter = filter.toLowerCase();

	var selectedProps = layer.selectedProperties;
	if (filter == undefined)
	{
		props = props.concat(selectedProps);
	}
	else
	{
		for (var j = 0 ; j < selectedProps.length ; j++)
		{
			var prop = selectedProps[j];

			var name = prop.name;
			var matchName = prop.matchName;
			if (!caseSensitive)
			{
				name = name.toLowerCase();
				matchName = matchName.toLowerCase();
			}

			if (strict && name === filter) props.push(prop);
			else if (strict && matchName === filter) props.push(prop);
			else if (typeof filter === "string")
			{
				if (name.indexOf(filter) >= 0) props.push(prop);
				else if (matchName.indexOf(filter) >= 0) props.push(prop);
			}
			else if (prop.propertyType == PropertyType.PROPERTY) if (prop.propertyValueType == filter) props.push(prop);
			else if (prop.propertyType == filter) props.push(prop);
			else if (typeof filter === "function") if (filter(prop)) props.push(prop);
		}
	}

	return DuAEF.DuAE.getPropertyInfos(props);
}

/**
* Gets all animations on the layer in the whole timeline or in the time range<br />
* The first KeyFrame._time will be adjusted relatively to the start of the time range (if provided) instead of the startTime of the composition.
* @param {Layer}	layer	- The layer.
* @param {boolean}	[selected=false]	- true to get only selected keyframes.
* @param {float[]}	[timeRange]	- The time range, an array of two time values, in seconds.
* @return {LayerAnim}	The animation.
*/
DuAEF.DuAE.Layer.getAnim = function (layer,selected,timeRange)
{
	var anim = new LayerAnim();
	anim._name = layer.name;
	anim._index = layer.index;
	anim.anims = [];
	for (var propIndex = 1;propIndex <= layer.numProperties;propIndex++)
	{
		var prop = layer.property(propIndex);
		if (prop.matchName == 'ADBE Marker') continue;

		var subAnim = DuAEF.DuAE.Property.getAnim(prop,selected,timeRange);
		if (subAnim != null) anim.anims.push(subAnim);

	}
	return anim;
}

/**
* Sets the property animation on the property
* @param {Layer}	layer	- The layer.
* @param {PropertyAnim} anims	- The animation
* @param {float}	[time=comp.time]	- The time where to begin the animation
* @param {boolean}	[ignoreName=false]	- true to set the anim even if name of the property do not match the animation.
* @param {boolean}	[setExpression=false]	- Set the expression on the property
* @return {boolean} true if the anim was actually set.
*/
DuAEF.DuAE.Layer.setAnim = function(layer,anim,time,ignoreName,setExpression)
{
	if (time == undefined) time = layer.containingComp.time;
	if (ignoreName == undefined) ignoreName = false;
	if (setExpression == undefined) setExpression = false;

	for (var i = 0 ; i < anim.anims.length ; i++)
	{
		var subAnim = anim.anims[i];
		for (var propIndex = 1;propIndex <= layer.numProperties;propIndex++)
		{
			var subProp = layer.property(propIndex);
			if (subProp == null) continue;
			if (subProp.matchName == subAnim._matchName && subProp.matchName != 'ADBE Marker')
			{
				var ok = DuAEF.DuAE.Property.setGroupAnim(subProp,subAnim,time,ignoreName,setExpression);
				if (ok) break;
			}
		}
	}
}

/**
* Gets the children of a layer
* @param {Layer}	layer	- The layer.
* @return {Layer[]} All the children of the layer
*/
DuAEF.DuAE.Layer.getChildren = function(layer)
{
	var comp = layer.containingComp;
	var children = [];
	for (var i = 1 ; i <= comp.layers.length ; i++)
	{
		var l = comp.layer(i);
		if (l.index == layer.index) continue;
		if (l.parent == null) continue;
		if (l.parent.index == layer.index) children.push(l);
	}
	return children;
}

/**
* Measures the distance between two layers
* @param {Layer} layer1 - The first layer
* @param {Layer} layer2 - The second layer
* @return {int} The distance (in pixels)
*/
DuAEF.DuAE.Layer.getDistance = function (layer1,layer2)
{
	//parents
	var layer1Parent = layer1.parent;
	var layer2Parent = layer2.parent;
	//unlink
	layer1.parent = null;
	layer2.parent = null;
	var O = layer1.transform.position.value;
	var A = layer2.transform.position.value;
	var OA = DuAEF.DuJS.Math.getLength(O,A);
	//re-link
	layer1.parent = layer1Parent;
	layer2.parent = layer2Parent;
	return Math.round(OA);
}

/**
* Gets the world position of the layer
* @param {Layer} layer - The layer
* @return {float[]} The world coordinates of the layer
*/
DuAEF.DuAE.Layer.getWorldPos = function (layer)
{
	//parents
	var layerParent = layer.parent;
	//unlink
	layer.parent = null;
	var pos = layer.transform.position.value;
	//re-link
	layer.parent = layerParent;
	return pos;
}

/**
* This method is a workaround to AE API method layer.applyPreset to work like addProperty when adding pseudoEffects
* @param {Layer} layer - The layer
* @param {File} preset - The preset file
* @param {string} matchName - The pseudo Effect matchName.
* @param {string} [name] - The name to set on the effect
* @return {PropertyGroup|null} The effect or null if anything went wrong
*/
DuAEF.DuAE.Layer.addPseudoEffect = function (layer,preset,matchName,name)
{
	if (!preset.exists) throw new Error("The pseudo effect file does not exist");
	if (layer == undefined) return null;
	if (preset == undefined) return null;
	if (matchName == undefined) return null;

	var effects = layer("ADBE Effect Parade");
	//add the preset to a temp comp if not available as an effect
	if (!effects.canAddProperty(matchName) || DuAEF.debug)
	{
		//create comp
		var comp = app.project.items.addComp("DuAEF Temp", 10, 10, 1, 1, 24);
		//add null
		var n = comp.layers.addNull();
		//apply preset
		n.applyPreset(preset);
		//remove all
		var nullSource = n.source;
		n.remove();
		nullSource.remove();
		comp.remove();
	}

	if (!effects.canAddProperty(matchName))
	{
		throw new Error("Invalid pseudo effect file or match name");
	}

	//add the pseudoEffect as a property
	var newEffectName = '';
	newEffectName = DuAEF.DuAE.Layer.newUniqueEffectName(name,layer);
	var effect = effects.addProperty(matchName);
	if (newEffectName != '') effect.name = newEffectName;
	return effect;
}

/**
* Checks if the layers have some selected keyframes
* @param {Layer[]|LayerCollection} layers - The layers
* @return {boolean} true if the layers have at least one selected keyframe
*/
DuAEF.DuAE.Layer.haveSelectedKeys = function (layers)
{
	var it = new Iterator(layers);
	if (it.length == 0) return;
	for (var i = it.min ; i <= it.max ; i++)
	{
		if (DuAEF.DuAE.Property.hasSelectedKeys(layers[i]))
		{
			return true;
		}
	}
	return false;
}

/**
* Gets the time of the first keyFrame
* @param {Layer[]|LayerCollection} layer - The layer
* @param {boolean} selected - true to check selected keyframes only
* @return {float|null} The keyframe time or null if there are no keyframe
*/
DuAEF.DuAE.Layer.firstKeyFrameTime = function (layers,selected)
{
	var it =  new Iterator(layers);
	var time = null;
	for (var i = it.min ; i <= it.max ; i++)
	{
		var test = DuAEF.DuAE.Property.firstKeyFrameTime(layers[i],selected);
		if (time == null) time = test;
		else if (test != null) { if (time > test) time = test; }
	}
	return time;
}

/**
* Sort the layers by their parenting (root at first index 0)
* @param {Layer[]|Collection} layers - The layers to sort
* @return {Layer[]} The sorted array
*/
DuAEF.DuAE.Layer.sortByParent = function (layers)
{
	var sortedLayers = [];
	var layersToSort = DuAEF.DuAE.convertCollectionToArray(layers);

	//add layers with no parents
	for (var i = layersToSort.length - 1 ; i >= 0 ; i--)
	{
		var l = layersToSort[i];
		if (l.parent == null)
		{
			sortedLayers.push(l);
			layersToSort.splice(i,1);
		}
	}

	//add layers with a parent outside
	//those with a parent outside of the selection
	for (var i = layersToSort.length - 1 ; i >= 0 ; i--)
	{
		var l = layersToSort[i];
		var parent = l.parent;
		var isParentOutside = true;
		for (var j = 0 ; j < layersToSort.length ; j++ )
		{
			if (parent.index == layersToSort[j].index)
			{
				isParentOutside = false;
				break;
			}
		}
		if (isParentOutside)
		{
			sortedLayers.push(l);
			layersToSort.splice(i,1);
		}
	}

	//sort the rest
	while (layersToSort.length > 0)
	{
		for (var i = layersToSort.length - 1 ; i >= 0 ; i--)
		{
			var l = layersToSort[i];
			for (var j = 0 ; j < sortedLayers.length ; j++ )
			{
				var sL = sortedLayers[j];
				if (l.parent.index == sL.index)
				{
					sortedLayers.push(l);
					layersToSort.splice(i,1);
					break;
				}
			}
		}
	}
	return sortedLayers;

}

/**
* Parents all the layers together beginning by the end of the array
* @param {Layer[]} layers - The layers to parent
*/
DuAEF.DuAE.Layer.parentChain = function (layers)
{
	//unparent  all but the first
	var layersUnparent = [];
	for (var i = 1 ; i < layers.length ; i++)
	{
		layersUnparent.push(layers[i]);
	}
	DuAEF.DuAE.Layer.unparent(layersUnparent);

	for (var i = layers.length -1 ; i >= 1 ; i--)
	{
		layers[i].parent = layers[i-1];
	}
}

/**
* Un-parents all the layers
* @param {Layer[]} layers - The layers
*/
DuAEF.DuAE.Layer.unparent = function (layers)
{
	for (var i = layers.length -1 ; i >= 0 ; i--)
	{
		layers[i].parent = null;
	}
}

/**
* Creates a sequence with the layers, but using opacities.
* This enables more possibilities to rig them, like with the Connector
* @param {Layer[]|LayerCollection} layers - The layers
* @param {string} [expr] - An expression to add to the opacity of the layers
*/
DuAEF.DuAE.Layer.sequence = function (layers,expr)
{
	if (layers.length == 0) return;
	if (expr == undefined) expr = '';
	var comp = layers[0].containingComp;
	var it = new Iterator(layers);
	it.do(function (layer)
	{
		while (layer.transform.opacity.numKeys > 0)
		{
			layer.transform.opacity.removeKey(layer.transform.opacity.numKeys);
		}
		var i = it.current;
		var t = i*comp.frameDuration;
		var endTime = (layers.length-1)*comp.frameDuration;
		layer.transform.opacity.setValueAtTime(0,0);
		layer.transform.opacity.setValueAtTime(endTime,0);
		layer.transform.opacity.setValueAtTime(t,100);
		if (i < layers.length -1 ) layer.transform.opacity.setValueAtTime(t+comp.frameDuration,0);
		for (var keyIndex = 1;keyIndex <= layer.transform.opacity.numKeys;keyIndex++)
		{
			layer.transform.opacity.setInterpolationTypeAtKey(keyIndex,KeyframeInterpolationType.HOLD,KeyframeInterpolationType.HOLD);
		}
		layer.transform.opacity.expression = expr;
	});
}

/**
* After Effects properties methods
* @namespace
* @memberof DuAEF.DuAE
*/
DuAEF.DuAE.Property = {};

/**
* Gets the After Effects  properties in the property
* @param {PropertyBase|PropertyInfo}	property	- The layer
* @param {PropertyType|PropertyValueType|string|function}	 [filter]	- A filter to get only a certain type, or value type, or property name or matchName.<br />
* A function which take one PropertyBase as argument can be used to filter the properties: the Property will be returned if the function returns true.
* @param {boolean}	[strict=false]	- If a string filter is provided, wether to search for the exact name/matchName or if it contains the filter.
* @param {boolean}	[caseSensitive=true]	- If a string filter is provided, and not strict is false, does the search have to be case sensitive?
* @return {PropertyInfo[]} The selected properties, an empty Array if nothing found
*/
DuAEF.DuAE.Property.getProps = function(property,filter,strict,caseSensitive)
{
	if (strict == undefined) strict = false;
	if (caseSensitive == undefined) caseSensitive = true;
	var prop;
	if (property instanceof PropertyInfo) prop = property.getProperty();
	else prop = property;

	var props = [];

	if (!caseSensitive && typeof filter === "string") filter = filter.toLowerCase();

	var name = prop.name;
	var matchName = prop.matchName;
	if (!caseSensitive)
	{
		name = name.toLowerCase();
		matchName = matchName.toLowerCase();
	}

	if (strict && name === filter) props.push(prop);
	else if (strict && matchName === filter) props.push(prop);
	else if (typeof filter === "string")
	{
		if (name.indexOf(filter) >= 0) props.push(prop);
		else if (matchName.indexOf(filter) >= 0) props.push(prop);
	}
	else if (typeof filter === "function") if (filter(prop)) props.push(prop);
	else if (prop.propertyType == PropertyType.PROPERTY) if (prop.propertyValueType == filter) props.push(prop);
	else if (prop.propertyType == filter) props.push(prop);

	if (prop.numProperties > 0)
	{
		for (var k = 1 ; k <= prop.numProperties ; k++)
		{
			props = props.concat(DuAEF.DuAE.Property.getProps(prop.property(k),filter,strict,caseSensitive));
		}
	}

	return DuAEF.DuAE.getPropertyInfos(props);
}

/**
* Gets the layer containing the property
* @param {PropertyBase|PropertyInfo}	prop	- The After Effects Property
* @return {Layer}	The layer
*/
DuAEF.DuAE.Property.getLayer = function (prop)
{
	if (prop == undefined) throw "You must provide a property.";
	if (prop instanceof PropertyInfo) prop = prop.getProperty();
	var parentProp = prop;
	while (parentProp.parentProperty !== null)
	{
		// Traverse up the property tree
		parentProp = parentProp.parentProperty;
	}
	return parentProp;
}

/**
* Gets the composition containing the property
* @param {PropertyBase|PropertyInfo}	prop	- The After Effects Property
* @return {CompItem}	The composition
*/
DuAEF.DuAE.Property.getComp = function (prop)
{
	var layer = DuAEF.DuAE.Property.getLayer(prop);
	return layer.containingComp;
}

/**
* Gets the number of dimensions of a property
* @param {Property|PropertyInfo}	prop	- The After Effects Property
* @return {int}	The number of dimensions, 0 if this is not a dimensionnal value (ie color, text, shape...)
*/
DuAEF.DuAE.Property.getDimensions = function (prop)
{
	if (prop instanceof PropertyInfo) prop = prop.getProperty();
	var dimensions = 0;
	if (prop.propertyValueType == PropertyValueType.ThreeD_SPATIAL || prop.propertyValueType == PropertyValueType.ThreeD)
	{
		//if this is a position or scale and the layer is not 3D, AFX uses a 3D value in the position (with 0 as Z position), but the expression must return a 2D value.......
		if ((prop.matchName == "ADBE Scale" || prop.matchName == "ADBE Position") && !DuAEF.DuAE.Property.getLayer(prop).threeDLayer)
		{
			dimensions = 2;
		}
		else
		{
			dimensions = 3;
		}
	}
	else if (prop.propertyValueType == PropertyValueType.TwoD_SPATIAL || prop.propertyValueType == PropertyValueType.TwoD)
	{
		dimensions = 2;
	}
	else if (prop.propertyValueType == PropertyValueType.OneD)
	{
		dimensions = 1;
	}
	else if (prop.propertyValueType == PropertyValueType.COLOR)
	{
		dimensions = 4;
	}
	return dimensions;
}

/**
* Gets the key at a given index on a property
* @param {Property|PropertyInfo}	prop	- The property.
* @param {int}	keyIndex	- The index of the key to retrieve. If the index is negative, it is counted from the end i.e. to retrieve the keyframe before the last one, use -2 (-1 is the last)
* @return {KeyFrame}	The keyframe, or null if incorrect index
*/
DuAEF.DuAE.Property.getKeyFrameAtIndex = function (prop,keyIndex)
{
	if (prop instanceof PropertyInfo) prop = prop.getProperty();
	if (Math.abs(keyIndex) > prop.numKeys || keyIndex == 0)
	{
		return null;
	}
	if (keyIndex < 0)
	{
		keyIndex = prop.numKeys - keyIndex + 1;
	}

	var key = new KeyFrame();
	key._time = prop.keyTime(keyIndex);
	key.value = prop.keyValue(keyIndex);
	key._inInterpolationType = prop.keyInInterpolationType(keyIndex);
	key._outInterpolationType = prop.keyOutInterpolationType(keyIndex);
	if ( prop.propertyValueType == PropertyValueType.ThreeD_SPATIAL || prop.propertyValueType == PropertyValueType.TwoD_SPATIAL )
	{
		key._spatial = true;
		key.spatialProperties.inTangent = prop.keyInSpatialTangent(keyIndex);
		key.spatialProperties.outTangent  = prop.keyOutSpatialTangent(keyIndex);
		key.spatialProperties._continuous = prop.keySpatialContinuous(keyIndex);
		key.spatialProperties._autoBezier = prop.keySpatialAutoBezier(keyIndex);
		key.spatialProperties._roving = prop.keyRoving(keyIndex);
	}
	key.inEase = prop.keyInTemporalEase(keyIndex);
	key.outEase = prop.keyOutTemporalEase(keyIndex);
	key._continuous = prop.keyTemporalContinuous(keyIndex);
	key._autoBezier = prop.keyTemporalAutoBezier(keyIndex);
	key._index = keyIndex;

	return key;
}

/**
* Gets the nearest key at a given time on a property
* @param {Property|PropertyInfo}	prop	- The property.
* @param {float}	time	- The time of the key to retrieve.
* @return {KeyFrame}	The keyframe, or null if incorrect time or not found
*/
DuAEF.DuAE.Property.getNearestKeyFrameAtTime = function (prop,time)
{
	if (prop instanceof PropertyInfo) prop = prop.getProperty();
	return DuAEF.DuAE.Property.getKeyFrameAtIndex(prop.nearestKeyIndex(time));
}

/**
* Gets the key at an exactly given time on a property
* @param {Property|PropertyInfo}	prop	- The property.
* @param {float}	time	- The time of the key to retrieve.
* @return {KeyFrame}	The keyframe, or null if incorrect time
*/
DuAEF.DuAE.Property.getKeyFrameAtTime = function (prop,time)
{
	if (prop instanceof PropertyInfo) prop = prop.getProperty();
	if (!prop.canVaryOverTime) return null;
	if (prop.numKeys == 0) return null;
	var key = DuAEF.DuAE.Property.getKeyFrameAtIndex(prop,prop.nearestKeyIndex(time));
	if (key === null) return key;
	if (key._time == time) return key;
	else return null;
}

/**
* Gets the property keyframes in the whole timeline or in the time range<br />
* The KeyFrame._time will be adjusted relatively to the start of the time range instead of the startTime of the composition.
* @param {Property|PropertyInfo}	prop	- The property.
* @param {boolean}	[selected=false]	- true to get only selected keyframes.
* @param {float[]}	[timeRange]	- The time range, an array of two time values, in seconds. If not provided, will use the comp time range.<br />
* Ignored if selected is true;
* @return {KeyFrame[]}	The keyframes, or null of this property is of type PropertyValueType.NO_VALUE or PropertyValueType.CUSTOM_VALUE
*/
DuAEF.DuAE.Property.getKeyFrames = function(prop,selected,timeRange)
{
	if (prop instanceof PropertyInfo) prop = prop.getProperty();
	if (prop.propertyValueType == PropertyValueType.NO_VALUE) return null;
	if (prop.propertyValueType == PropertyValueType.CUSTOM_VALUE) return null;

	var comp = DuAEF.DuAE.Property.getComp(prop);
	if (timeRange == undefined) timeRange = [0,comp.duration];
	if (selected == undefined) selected = false;

	var keyFrames = [];

	if (prop.elided) return keyFrames;

	if (prop.isTimeVarying)
	{
		if (selected)
		{
			for (var keyIndex = 0; keyIndex < prop.selectedKeys.length ; keyIndex++)
			{
				var key = DuAEF.DuAE.Property.getKeyFrameAtIndex(prop,prop.selectedKeys[keyIndex]);
				if (key._time >= timeRange[0] && key._time <= timeRange[1])
				{
					key._time = key._time - timeRange[0];
					keyFrames.push(key);
				}
			}
		}
		else if (prop.numKeys > 0)
		{
			for (var keyIndex = 1; keyIndex <= prop.numKeys ; keyIndex++)
			{
				var key = DuAEF.DuAE.Property.getKeyFrameAtIndex(prop,keyIndex);
				if (key._time >= timeRange[0] && key._time <= timeRange[1])
				{
					key._time = key._time - timeRange[0];
					keyFrames.push(key);
				}
			}
		}
	}
	return keyFrames;
}

/**
* Gets all animations in the group in the whole timeline or in the time range<br />
* The first KeyFrame._time will be adjusted relatively to the start of the time range (if provided) instead of the startTime of the composition.
* @param {PropertyGroup|PropertyInfo}	prop	- The property.
* @param {boolean}	[selected=false]	- true to get only selected keyframes.
* @param {float[]}	[timeRange]	- The time range, an array of two time values, in seconds. If not provided, will use the comp time range.
* @return {PropertyGroupAnim|PropertyAnim}	The animations. A PropertyAnim if prop is a Property, a PopertyGroupAnim if it is a PropertyGroup
*/
DuAEF.DuAE.Property.getAnim = function (prop,selected,timeRange)
{
	var comp = DuAEF.DuAE.Property.getComp(prop);
	if (timeRange == undefined) timeRange = [0,comp.duration];
	if (selected == undefined) selected = false;

	if (prop instanceof PropertyInfo) prop = prop.getProperty();
	if (prop.propertyType === PropertyType.PROPERTY)
	{
		if (prop.propertyValueType == PropertyValueType.NO_VALUE) return null;
		if (prop.elided) return null;
		if (!prop.canVaryOverTime) return null;
		if (prop.selectedKeys.length == 0 && selected) return null;
		var anim = new PropertyAnim();
		anim._name = prop.name;
		anim._matchName = prop.matchName;
		anim.startValue = prop.valueAtTime(timeRange[0],true);
		anim.keys = DuAEF.DuAE.Property.getKeyFrames(prop,selected,timeRange);
		anim.dimensions = DuAEF.DuAE.Property.getDimensions(prop);
		if (prop.canSetExpression) anim.expression = prop.expression;
		return anim;
	}
	else if (prop.numProperties > 0)
	{
		var groupAnim = new PropertyGroupAnim();
		groupAnim._name = prop.name;
		groupAnim._matchName = prop.matchName;

		for (var propIndex = 1;propIndex <= prop.numProperties;propIndex++)
		{
			var anim = DuAEF.DuAE.Property.getAnim(prop.property(propIndex),selected,timeRange);
			if (anim != null) groupAnim.anims.push(anim);
		}
		return groupAnim;
	}
	return null;
}

/**
* Gets the time of the first keyFrame
* @param {PropertyBase[]|PropertyInfo[]} props - The properties
* @param {boolean} selected - true to check selected keyframes only
* @return {float|null} The keyframe time or null if there are no keyframe
*/
DuAEF.DuAE.Property.firstKeyFrameTime = function (prop,selected)
{
	var time = null;

	if (prop instanceof PropertyInfo) prop = prop.getProperty();
	if (prop.propertyType == PropertyType.PROPERTY)
	{
		if (!prop.canVaryOverTime) return null;
		if (selected)
		{
			if (prop.selectedKeys.length == 0) return null;
			for (var keyIndex = 0; keyIndex < prop.selectedKeys.length ; keyIndex++)
			{
				var key = DuAEF.DuAE.Property.getKeyFrameAtIndex(prop,prop.selectedKeys[keyIndex]);
				if (time == null) time = key._time;
				else if (time > key._time) time = key._time;
			}
		}
		else
		{
			if (prop.numKeys == 0) return null;
			for (var keyIndex = 1; keyIndex <= prop.numKeys ; keyIndex++)
			{
				var key = DuAEF.DuAE.Property.getKeyFrameAtIndex(prop,keyIndex);
				if (time == null) time = key._time;
				else if (time > key._time) time = key._time;
			}
		}
	}
	else if (prop.numProperties > 0)
	{
		for (var propIndex = 1;propIndex <= prop.numProperties;propIndex++)
		{
			var test = DuAEF.DuAE.Property.firstKeyFrameTime(prop.property(propIndex),selected);
			if (time == null) time = test;
			else if (test != null) { if (time > test) time = test; }
		}
	}

	return time;
}

/**
* Sets a {@linkcode KeyFrame} on a property
* @param {Property|PropertyInfo}	prop	- The property.
* @param {KeyFrame}	key	- The KeyFrame.
* @param {float}	[timeOffset=comp.time]	- The time offset (added to KeyFrame._time) where to add the key frame.
*/
DuAEF.DuAE.Property.setKey = function (prop,key,timeOffset)
{
	if (prop instanceof PropertyInfo) prop = prop.getProperty();
	if (prop.elided) return;
	if (!prop.propertyType === PropertyType.PROPERTY) throw "Can not set a key on a group property";
	if (!prop.canVaryOverTime) return;

	if (timeOffset == undefined) timeOffset = DuAEF.DuAE.Property.getPropertyComp(prop).time;
	var time = key._time + timeOffset;
	var propDimensions = DuAEF.DuAE.Property.getDimensions(prop);
	var val = key.value;

	if (propDimensions > 1 && !(val instanceof Array))
	{
		val = [val];
	}

	//adjust dimensions
	if (val instanceof Array)
	{
		while (val.length < propDimensions)
		{
			val.push(0);
		}
		while (val.length > propDimensions)
		{
			val.pop();
		}
	}

	try
	{
		prop.setValueAtTime(time,val);

		//get the index of the created key
		var index = prop.nearestKeyIndex(time);

		//set interpolations
		if (key._spatial && (prop.propertyValueType == PropertyValueType.ThreeD_SPATIAL || prop.propertyValueType == PropertyValueType.TwoD_SPATIAL))
		{
			try{
				prop.setSpatialContinuousAtKey(index,key.spatialProperties._continuous);
				prop.setSpatialAutoBezierAtKey(index,key.spatialProperties._autoBezier);
				prop.setRovingAtKey(index,key.spatialProperties._roving);
				prop.setSpatialTangentsAtKey(index,key.spatialProperties.inTangent,key.spatialProperties.outTangent);
			}
			catch(err)
			{
				alert(err.description);
			};
		}

		try
		{
			prop.setTemporalContinuousAtKey(index,key._continuous);
			prop.setTemporalAutoBezierAtKey(index,key._autoBezier);
			prop.setTemporalEaseAtKey(index,key.inEase,key.outEase);
			prop.setInterpolationTypeAtKey(index,key._inInterpolationType,key._outInterpolationType);
		}
		catch(err)
		{
			alert(err.description);
		}

	}
	catch (err)
	{
		alert(err.description);
	}
}

/**
* Sets the property animation on the property.<br />
* Use this method only to force the animation onto the property without checks.<br />
* Must be used on a Property (not a group) with a PropertyAnim (not a PropertyGroupAnim).<br />
* To easily set an animation on a property with automatic compatibility checks, you should use setGroupAnim().
* @param {Property|PropertyInfo}	prop	- The property.
* @param {PropertyAnim} anims	- The animation
* @param {float}	[time=comp.time]	- The time where to begin the animation
* @param {boolean}	[ignoreName=false]	- true to set the anim even if name of the property do not match the animation.
* @param {boolean}	[setExpression=false]	- Sets the expression too
* @param {boolean}	[ignoreMatchName=false]	- true to set the anim even if matchName of the property do not match the animation.
* @return {boolean} true if the anim was actually set.
*/
DuAEF.DuAE.Property.setAnim = function(prop,anim,time,setExpression)
{
	if (prop instanceof PropertyInfo) prop = prop.getProperty();
	if (time == undefined) time = DuAEF.DuAE.Property.getPropertyComp(prop).time;
	if (setExpression == undefined) setExpression = false;

	var dimensions = anim.dimensions;

	var ok = false;

	if (anim == null) return true;
	if (anim.type == 'group') return false;

	//find the property with the same name and matchname
	if (prop.propertyType === PropertyType.PROPERTY && !prop.elided && prop.canVaryOverTime)
	{
		//if there are keys, set them
		if (anim.keys.length > 0)
		{
			for (var iclef = 0; iclef < anim.keys.length;iclef++)
			{
				DuAEF.DuAE.Property.setKey(prop,anim.keys[iclef],time);
				ok = true;
			}
		}
		else //set the start value
		{
			try
			{
				var value = anim.startValue;
				if (value instanceof Array)
				{
					while (value.length < dimensions)
					{
						value.push(0);
					}
					while (value.length > dimensions)
					{
						value.pop();
					}
				}
				if (anim.startValue != null) prop.setValue(anim.startValue);
				ok = true;
			} catch (err) {};
		}
		//set the expression
		if (prop.canSetExpression && setExpression)
		{
			prop.expression = anim.expression;
		}
	}

	return ok;
}

/**
* Sets all animations on a Property or a PropertyGroup.
* @param {PropertyGroup|PropertyInfo}	prop	- The property group.
* @param {PropertyAnim} anims	- The animation
* @param {float}	[time=comp.time]	- The time where to begin the animation
* @param {boolean}	[ignoreName=false]	- true to set the anim even if name of the property do not match the animation.
* @param {boolean}	[setExpression=false]	- Sets the expression too
* @return {boolean} true if the anim was actually set.
*/
DuAEF.DuAE.Property.setGroupAnim = function(prop,anim,time,ignoreName,setExpression)
{
	if (prop instanceof PropertyInfo) prop = prop.getProperty();
	if (time == undefined) time = DuAEF.DuAE.Property.getPropertyComp(prop).time;
	if (ignoreName == undefined) ignoreName = false;
	if (setExpression == undefined) setExpression = false;

	var ok = false;

	if (anim == null) return true;

	if (anim.type == 'anim')
	{
		if (prop.matchName == anim._matchName && (!ignoreName && prop.name == anim._name || ignoreName))
		{
			return DuAEF.DuAE.Property.setAnim(prop,anim,time,setExpression);
		}
	}
	else
	{
		for (var i = 0 ; i < anim.anims.length ; i++)
		{
			var propAnim = anim.anims[i];
			//find the property with the same name and matchname
			for (var j = 1 ; j <= prop.numProperties ; j++)
			{
				var subProp = prop.property(j);
				if (subProp.matchName == propAnim._matchName && (!ignoreName && subProp.name == propAnim._name || ignoreName))
				{
					ok = DuAEF.DuAE.Property.setGroupAnim(subProp,propAnim,time,ignoreName,setExpression);
					break;
				}
			}
		}
	}

	return ok;
}

/**
* Removes the animation from the property
* @param {Property|PropertyInfo} prop -The property
* @param {boolean} [removeExpression=false] - Set to true to remove the expression too
*/
DuAEF.DuAE.Property.removeAnim = function(prop,removeExpression)
{
	if (prop instanceof PropertyInfo) prop = prop.getProperty();
	while (prop.numKeys > 0)
	{
		prop.removeKey(1);
	}
	if (removeExpression && prop.canSetExpression)
	{
		prop.expression = '';
	}
}

/**
* Selects the keyframes in the propoerty.<br />
* Selects all nested keyframes if the property is a group.
* @param {PropertyBase|PropertyInfo} property - The property
* @param {float} [inTime=0] - The time at which to select the keyframes
* @param {float} [outTime=inTime] - The end time
*/
DuAEF.DuAE.Property.selectKeyFrames = function(property,inTime,outTime)
{
	if (inTime == undefined) inTime = 0;
	if (outTime == undefined) outTime = inTime;
	var prop;
	if (property instanceof PropertyInfo) prop = property.getProperty();
	else prop = property;

	if (prop.propertyType == PropertyType.PROPERTY)
	{
		if (inTime == outTime)
		{
			//get key
			var key = DuAEF.DuAE.Property.getKeyFrameAtTime(prop,inTime);
			if (key) prop.setSelectedAtKey(key._index,true);
		}
		else
		{
			//get keys
			var keys = DuAEF.DuAE.Property.getKeyFrames(prop,false,[inTime,outTime]);
			if (!keys) return;
			for (var i = 0 ; i < keys.length ; i++)
			{
				prop.setSelectedAtKey(keys[i]._index,true);
			}
		}
	}
	else if (prop.numProperties > 0)
	{
		for (var i = 1 ; i <= prop.numProperties ; i++)
		{
			DuAEF.DuAE.Property.selectKeyFrames(prop.property(i),inTime,outTime);
		}
	}
}

/**
 * Gets an expression link to the property
 * @memberof DuAEF.DuAE.Property
 * @param {Property|PropertyInfo}	prop			- The property
 * @param {bool}		[useThisComp]		- Wether to begin the expression by 'thisComp' or 'comp("name")'
 * @param {bool}		[fromLayer=true]		- Wether to begin the expression by comp.layer or directly from the first prop of the layer
 * @return {str}		The expression link to the property
 */
DuAEF.DuAE.Property.getExpressionLink = function (prop,useThisComp,fromLayer)
{
	if (prop instanceof PropertyInfo) prop = prop.getProperty();
	if (useThisComp == undefined) useThisComp = false;
	if (fromLayer == undefined) fromLayer = true;

	//get compact expression from matchName, if available
	function getCompactExpression(matchName, name)
	{
		var translatedName = DuAEF.DuAE.compactExpressions[matchName];

		if (translatedName !== undefined)
			return eval(translatedName);
		else
			return ("(" + name + ")");
	}

	var exprCode = "";
	var name;
	while (prop.parentProperty !== null)
	{
		if (prop.propertyType == PropertyType.PROPERTY ) name = prop.propertyIndex;
		else if (prop.parentProperty.propertyType == PropertyType.INDEXED_GROUP)
		{
			name = "\"" + prop.name + "\"";
		}
		else name =  "\"" + prop.matchName + "\"";
		compactName = getCompactExpression(prop.matchName, name);
		exprCode = compactName + exprCode;

		// Traverse up the property tree
		prop = prop.parentProperty;
	}

	if (exprCode.indexOf("(") != 0) exprCode = '.' + exprCode;

	if (fromLayer)
	{
		var comp = prop.containingComp;
		// Prefix the layer reference
		name = "\"" + prop.name + "\"";
		exprCode = "layer(" + name + ")" + exprCode;
		// Prefix the comp reference
		if (useThisComp) exprCode = "thisComp." + exprCode;
		else exprCode = "comp(\"" + comp.name + "\")." + exprCode;
	}

	return exprCode;
}

/**
* Sets a value on a property, adjusting the dimensions if needed
* @param {Property|PropertyInfo} prop - The property
* @param {any} value - The value to set
*/
DuAEF.DuAE.Property.setValue = function(prop,value)
{
	var dimensions = 0;
	if (prop instanceof PropertyInfo)
	{
		dimensions = prop.dimensions;
		prop = prop.getProperty();
	}
	else
	{
		dimensions = DuAEF.DuAE.Property.getDimensions(prop);
	}
	if (dimensions == 0 || dimensions == 1)
	{
		if (value instanceof Array) value = value[0];
		prop.setValue(value);
	}

	else
	{
		if (!(value instanceof Array)) value = [value];
		while (value.length < dimensions)
		{
			value.push(0);
		}
		while (value.length > dimensions)
		{
			value.pop();
		}
		prop.setValue(value);
	}
}

/**
* Changes the interpolation type on selected keyframes, or sets a new key at current time if there are no keyframes selected.
* @param {Layer[]|LayerCollection} layers - The layers containing the properties
* @param {PropertyBase[]|PropertyInfo[]} props - The properties
* @param {KeyframeInterpolationType|string} typeIn - The in interpolation type (see AE API) or the string "roving" or "continuous"
* @param {KeyframeInterpolationType|string} [typeOut=typeIn] - The out interpolation type (see AE API)
* @param {int[]|int} [easeInValue=33] - The in interpolation ease value (used if typeIn is KeyframeInterpolationType.BEZIER)
* @param {int[]|int} [easeOutValue=easeInValue] - The out interpolation ease value (used if typeOut is KeyframeInterpolationType.BEZIER)
*/
DuAEF.DuAE.Property.setInterpolationType = function(layers,props,typeIn,typeOut,easeInValue,easeOutValue)
{
	if (typeOut == undefined) typeOut = typeIn;
	if (easeInValue == undefined) easeInValue = 33;
	if (isNaN(easeInValue)) easeInValue = 33;
	if (easeOutValue == undefined) easeOutValue = easeInValue;
	if (isNaN(easeOutValue)) easeOutValue = 33;

	easeInValue = new KeyframeEase(0,easeInValue);
	easeOutValue = new KeyframeEase(0,easeOutValue);

	if (!DuAEF.DuAE.Layer.haveSelectedKeys(layers))
	{
		for (var i=0;i<props.length;i++)
		{
			var propInfo = props[i];
			var prop = props[i];
			if (!(propInfo instanceof PropertyInfo)) propInfo = new PropertyInfo(prop);
			prop = props[i].getProperty();

			if (prop.canVaryOverTime)
			{
				var key = prop.addKey(comp.time);
				if (typeIn == "roving") prop.setRovingAtKey(key,true);
				else if (typeIn == "continuous")
				{
					prop.setInterpolationTypeAtKey(key,KeyframeInterpolationType.BEZIER);
					prop.setTemporalContinuousAtKey(key, true);
					prop.setTemporalAutoBezierAtKey(key, true);
				}
				else
				{
					//influences
					if (!prop.isSpatial && prop.value.length == 3) { prop.setTemporalEaseAtKey(key,[easeInValue,easeInValue,easeInValue],[easeOutValue,easeOutValue,easeOutValue]); }
					else if (!prop.isSpatial && prop.value.length == 2) { prop.setTemporalEaseAtKey(key,[easeInValue,easeInValue],[easeOutValue,easeOutValue]); }
					else { prop.setTemporalEaseAtKey(key,[easeInValue],[easeOutValue]); }
					prop.setInterpolationTypeAtKey(key,typeIn,typeOut);
					//not continuous
					prop.setTemporalContinuousAtKey(key, false);
				}
			}
		}
	}
	else
	{
		for (var i=0;i<props.length;i++)
		{
			var propInfo = props[i];
			var prop = props[i];
			if (!(propInfo instanceof PropertyInfo)) propInfo = new PropertyInfo(prop);
			prop = props[i].getProperty();

			if (prop.canVaryOverTime)
			{
				//for keys
				for (var k=0;k<prop.selectedKeys.length;k++)
				{
					if (typeIn == "roving") {if(prop.isSpatial) prop.setRovingAtKey(prop.selectedKeys[k],true);}
					else if (typeIn == "continuous")
					{
						prop.setInterpolationTypeAtKey(prop.selectedKeys[k],KeyframeInterpolationType.BEZIER);
						prop.setTemporalContinuousAtKey(prop.selectedKeys[k], true);
						prop.setTemporalAutoBezierAtKey(prop.selectedKeys[k], true);
						//not roving
						try { prop.setRovingAtKey(prop.selectedKeys[k],false); } catch(e){}
					}
					else
					{
						//influences
						if (!prop.isSpatial && prop.value.length == 3) { prop.setTemporalEaseAtKey(prop.selectedKeys[k],[easeInValue,easeInValue,easeInValue],[easeOutValue,easeOutValue,easeOutValue]); }
						else if (!prop.isSpatial && prop.value.length == 2) { prop.setTemporalEaseAtKey(prop.selectedKeys[k],[easeInValue,easeInValue],[easeOutValue,easeOutValue]); }
						else { prop.setTemporalEaseAtKey(prop.selectedKeys[k],[easeInValue],[easeOutValue]); }
						//type
						prop.setInterpolationTypeAtKey(prop.selectedKeys[k],typeIn,typeOut);
						//not roving
						try { prop.setRovingAtKey(prop.selectedKeys[k],false); } catch(e){}
						//not continuous
						prop.setTemporalContinuousAtKey(prop.selectedKeys[k], false);
					}
				}
			}
		}
	}
}

/**
* Changes the ease influences of the selected keys
* @param {PropertyBase[]|PropertyInfo[]} props - The properties
* @param {int[]|int} [easeInValue] - The in interpolation ease value. Will be ignored if undefined.
* @param {int[]|int} [easeOutValue] - The out interpolation ease value. Will be ignored if undefined.
* @param {int[]|int} [velocityInValue] - The out interpolation ease value. Will be ignored if undefined.
* @param {int[]|int} [velocityOutValue] - The out interpolation ease value. Will be ignored if undefined.
*/
DuAEF.DuAE.Property.setEase = function(props,easeInValue,easeOutValue,velocityInValue,velocityOutValue)
{
	if (isNaN(easeInValue) && easeInValue != undefined) easeInValue = 33;
	if (isNaN(easeOutValue) && easeOutValue != undefined) easeOutValue = 33;
	if (isNaN(velocityInValue) && velocityInValue != undefined) velocityInValue = 0;
	if (isNaN(velocityOutValue) && velocityOutValue != undefined) velocityOutValue = 0;

	for (var i = 0; i < props.length ; i++)
	{
		var propInfo = props[i];
		var prop = props[i];
		if (!(propInfo instanceof PropertyInfo)) propInfo = new PropertyInfo(prop);
		prop = propInfo.getProperty();

		if (prop.canVaryOverTime)
		{
			for (var k=0 ; k < prop.selectedKeys.length ; k++)
			{
				var key = prop.selectedKeys[k];
				var easeIn =  [ new KeyframeEase(velocityInValue != undefined ? velocityInValue : prop.keyInTemporalEase(key)[0].speed, easeInValue != undefined ? easeInValue : prop.keyInTemporalEase(key)[0].influence) ];
				var easeOut = [ new KeyframeEase(velocityOutValue != undefined ? velocityOutValue : prop.keyOutTemporalEase(key)[0].speed, easeOutValue != undefined ? easeOutValue : prop.keyOutTemporalEase(key)[0].influence) ];
				if (!prop.isSpatial)
				{
					for (var j = 1;j < prop.keyInTemporalEase(prop.selectedKeys[k]).length ; j++)
					{
						easeIn.push( new KeyframeEase(velocityInValue != undefined ? velocityInValue : prop.keyInTemporalEase(key)[j].speed, easeInValue != undefined ? easeInValue : prop.keyInTemporalEase(key)[j].influence) );
						easeOut.push( new KeyframeEase(velocityOutValue != undefined ? velocityOutValue : prop.keyOutTemporalEase(key)[j].speed, easeOutValue != undefined ? easeOutValue : prop.keyOutTemporalEase(key)[j].influence) );
					}
				}
				prop.setTemporalEaseAtKey(key,easeIn,easeOut);
			}
		}
	}
}

/**
* Checks if the property has some selected keyframes.<br />
* The property can be either a Property or a PropertyGroup.
* @param {PropertyBase} prop - The property
* @return {boolean} true if the property have at least one selected keyframe
*/
DuAEF.DuAE.Property.hasSelectedKeys = function (prop)
{
	var yes = false;

	if (prop.propertyType == PropertyType.PROPERTY)
	{
		if (prop.selectedKeys.length >0)
		{
			yes = true;
		}
	}
	else if (prop.numProperties > 0)
	{
		for (var propIndex = 1;propIndex <= prop.numProperties;propIndex++)
		{
			yes = DuAEF.DuAE.Property.hasSelectedKeys(prop.property(propIndex));
			if (yes) break;
		}
	}
	return yes;
}

/**
* Sets the spatial interpolation of the selected keyframes on the property
* @param {Property|PropertyInfo} prop - The property
* @param {KeyframeInterpolationType} typeIn - The in interpolation type (see AE API)
* @param {KeyframeInterpolationType} [typeOut=typeIn] - The in interpolation type (see AE API)
*/
DuAEF.DuAE.Property.setSpatialInterpolation = function (prop,typeIn,typeOut)
{
	if (prop instanceof PropertyInfo) prop = prop.getProperty();
	if (typeOut == undefined) typeOut = typeIn;
	if (!prop.isSpatial) return;
		if (prop.selectedKeys.length == 0) return;
	for (var k=0;k<prop.selectedKeys.length;k++)
	{
		if (typeIn == KeyframeInterpolationType.BEZIER && typeOut == KeyframeInterpolationType.BEZIER)
		{
			prop.setSpatialAutoBezierAtKey(prop.selectedKeys[k],true);
		}
		else if (typeIn == KeyframeInterpolationType.LINEAR && typeOut == KeyframeInterpolationType.LINEAR)
		{
			prop.setSpatialContinuousAtKey(prop.selectedKeys[k],false);
			prop.setSpatialAutoBezierAtKey(prop.selectedKeys[k],false);
			if (prop.propertyValueType == PropertyValueType.ThreeD_SPATIAL)
			{
				prop.setSpatialTangentsAtKey(prop.selectedKeys[k],[0,0,0],[0,0,0]);
    		}
    		else if (prop.propertyValueType == PropertyValueType.TwoD_SPATIAL)
    		{
    		    prop.setSpatialTangentsAtKey(prop.selectedKeys[k],[0,0],[0,0]);
    		}
		}
		else if (typeIn == KeyframeInterpolationType.BEZIER)
		{
			prop.setSpatialContinuousAtKey(prop.selectedKeys[k],false);
            prop.setSpatialAutoBezierAtKey(prop.selectedKeys[k],false);
            var keyIndex = prop.selectedKeys[k];
            if (prop.propertyValueType == PropertyValueType.ThreeD_SPATIAL)
            {
                if (prop.keyInSpatialTangent(keyIndex)[0] == 0 && prop.keyInSpatialTangent(keyIndex)[1] == 0 && prop.keyInSpatialTangent(keyIndex)[2] == 0)
                {
                    prop.setSpatialAutoBezierAtKey(prop.selectedKeys[k],true);
                }
                prop.setSpatialTangentsAtKey(keyIndex,prop.keyInSpatialTangent(keyIndex),[0,0,0]);
            }
            else if (prop.propertyValueType == PropertyValueType.TwoD_SPATIAL)
            {
                if (prop.keyInSpatialTangent(keyIndex)[0] == 0 && prop.keyInSpatialTangent(keyIndex)[1] == 0)
                {
                    prop.setSpatialAutoBezierAtKey(prop.selectedKeys[k],true);
                }
                prop.setSpatialTangentsAtKey(keyIndex,prop.keyInSpatialTangent(keyIndex),[0,0]);
            }
		}
		else if (typeIn == KeyframeInterpolationType.LINEAR)
		{
			prop.setSpatialContinuousAtKey(prop.selectedKeys[k],false);
            prop.setSpatialAutoBezierAtKey(prop.selectedKeys[k],false);
            var keyIndex = prop.selectedKeys[k];
            if (prop.propertyValueType == PropertyValueType.ThreeD_SPATIAL)
            {
                if (prop.keyOutSpatialTangent(keyIndex)[0] == 0 && prop.keyOutSpatialTangent(keyIndex)[1] == 0 && prop.keyOutSpatialTangent(keyIndex)[2] == 0)
                {
                    prop.setSpatialAutoBezierAtKey(prop.selectedKeys[k],true);
                }
                prop.setSpatialTangentsAtKey(keyIndex,[0,0,0],prop.keyOutSpatialTangent(keyIndex));
            }
            else if (prop.propertyValueType == PropertyValueType.TwoD_SPATIAL)
            {
                if (prop.keyOutSpatialTangent(keyIndex)[0] == 0 && prop.keyOutSpatialTangent(keyIndex)[1] == 0)
                {
                    prop.setSpatialAutoBezierAtKey(prop.selectedKeys[k],true);
                }
                prop.setSpatialTangentsAtKey(keyIndex,[0,0],prop.keyOutSpatialTangent(keyIndex));
            }
		}
	}
}

/**
* Fixes the spatial interpolation of the selected keys.<br />
* Sets the interpolation to linear when the property does not move between keyframes
* @param {Property|PropertyInfo} prop - The property
*/
DuAEF.DuAE.Property.fixSpatialInterpolation = function(prop)
{
	if (prop instanceof PropertyInfo) prop = prop.getProperty();

	if (!prop.isSpatial) return;
    if (!prop.canVaryOverTime) return;

    var keyIndices = prop.selectedKeys;
    if (keyIndices.length < 2) return;

	for (var k=0;k<keyIndices.length-1;k++)
	{
	    var key = keyIndices[k];
	    var nextKey = keyIndices[k+1]
	    //get this key value
	    var keyValue = prop.valueAtTime(prop.keyTime(key),true);
	    //get next key value
	    var nextKeyValue = prop.valueAtTime(prop.keyTime(key+1),true);

	    //compare and set
	    if (prop.propertyValueType == PropertyValueType.ThreeD_SPATIAL)
	    {
	        if (keyValue[0] == nextKeyValue[0] && keyValue[1] == nextKeyValue[1] && keyValue[2] == nextKeyValue[2])
	        {
	            prop.setSpatialTangentsAtKey(key,prop.keyInSpatialTangent(key),[0,0,0]);
	            prop.setSpatialTangentsAtKey(nextKey,[0,0,0],prop.keyOutSpatialTangent(nextKey));
	        }
	    }
	    else if (prop.propertyValueType == PropertyValueType.TwoD_SPATIAL)
	    {
	        if (keyValue[0] == nextKeyValue[0] && keyValue[1] == nextKeyValue[1])
	        {
	            prop.setSpatialTangentsAtKey(key,prop.keyInSpatialTangent(key),[0,0]);
	            prop.setSpatialTangentsAtKey(nextKey,[0,0],prop.keyOutSpatialTangent(nextKey));
	        }
	    }
	}
}

/**
* Removes all unneeded keyframes from the property.< br/>
* Also checks the interpolation values to reset the correct display as linear/smooth.
* @param {Property|PropertyInfo} property - The property
*/
DuAEF.DuAE.Property.cleanKeyframes = function(property)
{
	var prop = property;
	if (prop instanceof PropertyInfo) prop = property.getProperty();

	var numKeys = prop.numKeys;
	if (numKeys == 0) return;
	if (numKeys == 1)
	{
		prop.removeKey(1);
		return;
	}

	for (var i = numKeys ; i > 0 ; i--)
	{
		var currentKey = DuAEF.DuAE.Property.getKeyFrameAtIndex(prop,i);

		if (i > 1) var prevKey = DuAEF.DuAE.Property.getKeyFrameAtIndex(prop,i-1);
		if (i < prop.numKeys) var nextKey = DuAEF.DuAE.Property.getKeyFrameAtIndex(prop,i+1);

		//check values
		if (i > 1 && !DuAEF.DuJS.Array.compare(currentKey.value,prevKey.value,3)) continue;
		if (i < prop.numKeys && !DuAEF.DuJS.Array.compare(currentKey.value,nextKey.value,3)) continue;
		//check velocities
		var remove = false;
		for (var j = 0 ; j < currentKey.inEase.length ; j++)
		{
			remove = false
			if (i > 1 && !DuAEF.DuJS.Math.compare(prevKey.outEase[j].speed,0,4)) break;
			if (i > 1 && !DuAEF.DuJS.Math.compare(currentKey.inEase[j].speed,0,4)) break;
			if (i < prop.numKeys && !DuAEF.DuJS.Math.compare(currentKey.outEase[j].speed,0,4)) break;
			if (i < prop.numKeys && !DuAEF.DuJS.Math.compare(nextKey.inEase[j].speed,0,4)) break;
			remove = true;
		}
		//remove key
		if (remove) prop.removeKey(i);
	}
}

/**
* Gets the average speed of the animated propreties
* @param {Property[]|PropertyInfo[]} props - The Properties
* @return {float} The average speed
*/
DuAEF.DuAE.Property.getAverageSpeed = function(props)
{
	var averageSpeed = 0;
	var count = 0;

	for (var i = 0 ; i < props.length ; i++)
	{
		var prop = props[i];
		if (prop instanceof PropertyInfo) prop = prop.getProperty();
		if (prop.propertyType != PropertyType.PROPERTY) continue;
		if (!prop.canVaryOverTime) continue;
		if (prop.numKeys < 1) continue;

		var comp = DuAEF.DuAE.Property.getComp(prop);
		var frames = comp.duration / comp.frameDuration ;
		var lastTime = prop.keyTime(prop.numKeys);
		var firstTime = prop.keyTime(1);
		var lastFrame = lastTime/comp.frameDuration ;
		var firstFrame = firstTime/comp.frameDuration ;
		if (lastFrame > frames) lastFrames = frames;
		if (firstFrame < 1) firstFrame = 1;
		var sum = 0;
		for (var frame = firstFrame ; frame < lastFrame ; frame++)
		{
			var time = frame*comp.frameDuration;
			sum += DuAEF.DuAE.Property.getSpeed(prop,time);
		}
		var speed = sum/(lastFrame-firstFrame);

		if (speed > 0)
		{
			averageSpeed += speed;
			count++;
		}
	}

	averageSpeed = averageSpeed/count;
	return averageSpeed;
}

/**
* Gets the speed of a property at a given time
* @param {Property|PropertyInfo} prop - The property
* @param {float} [time=composition.time] - The time.
* @return {float} The speed
*/
DuAEF.DuAE.Property.getSpeed = function (prop,time)
{
	if (prop instanceof PropertyInfo) prop = prop.getProperty();
	if (prop.propertyType != PropertyType.PROPERTY) return 0;
	if (prop.numKeys == 0) return 0;
	var comp = DuAEF.DuAE.Property.getComp(prop);
	if (time == undefined) time = comp.time;

	var speed = DuAEF.DuJS.Math.getLength(prop.valueAtTime(time+comp.frameDuration,false),prop.valueAtTime(time-comp.frameDuration,false));
	return speed;
}

/**
* Sets an expression to a property.<br />
* Tries to keep the original value of the property by resetting it after.
* @param {Property|PropertyInfo} prop - The property
* @param {string} expr - The expression
*/
DuAEF.DuAE.Property.setExpression = function (prop,expr)
{
	if (!prop.canSetExpression) return;
	var originalValue = prop.value;
	//remove current expression
	prop.expression = "";
	prop.setValue(originalValue);
	//set new expression
	prop.expression = expr;
	prop.setValue( 2*originalValue - prop.value);
}

/**
* Replaces text in Expressions
* @param {PropertyBase|PropertyInfo} prop - The property (can be a group)
* @param {string} oldString - The string to replace
* @param {string} newString - The new string
* @param {boolean} [caseSensitive=true] - Wether the search has to be case sensitive
*/
DuAEF.DuAE.Property.replaceInExpressions = function (prop,oldString,newString,caseSensitive)
{
	if (caseSensitive == undefined) caseSensitive = true;

	if (prop.propertyType == PropertyType.PROPERTY)
	{
		if (prop.canSetExpression)
		{
			try {prop.expression = DuAEF.DuJS.String.replace(prop.expression,oldString,newString,caseSensitive);}
			catch(e){};
		}
	}
	else if (prop.numProperties > 0)
	{
		for (var propertyIndex = 1;propertyIndex <= prop.numProperties;propertyIndex++)
		{
			DuAEF.DuAE.Property.replaceInExpressions(prop.property(propertyIndex),oldString,newString,caseSensitive);
		}
	}
}

/**
* Bezier Paths methods
* @namespace
* @memberof DuAEF.DuAE.Property
*/
DuAEF.DuAE.Property.Shape = {};

/**
* Export the given shape property to the given file <br/>
* The file name in the given path will be used to name the shape in the jsx code
* @example
* var props = DuAEF.DuAE.Comp.getSelectedProps(PropertyValueType.SHAPE);
* var prop = props[0].getProperty();
* var out = DuAEF.DuAE.Property.Shape.exportToJsxinc(prop, "D:/shape.test");
* @param {Property}	 [shapeProp]	- The path property to export
* @param {String}	     [file]	- The path to where the jsxinc shape will be written
* @param {boolean}	[offsetToCenter=false]	- If true, offset the path to the center
* @return {int} A status code. [0: success, ...]
*/
DuAEF.DuAE.Property.Shape.exportToJsxinc = function(shapeProp, file, offsetToCenter)
{
    if (shapeProp.propertyType !== PropertyType.PROPERTY) throw "Expected a shape property, got a group.";
    if (shapeProp.propertyValueType !== PropertyValueType.SHAPE) throw "Expected a shape property, got another type of value.";
    if(typeof(offsetToCenter) === 'undefined') offsetToCenter = false;

    var shape = shapeProp.value;
    var vertices = shape.vertices;

    if (offsetToCenter)
    {
        //get center and offset
        var sum = [0,0];
        for (var i = 0 ; i < vertices.length ; i++)
        {
            sum[0] += vertices[i][0];
            sum[1] += vertices[i][1];
        }
        var center = sum/vertices.length;
        //adjust values
        for (var i = 0 ; i < vertices.length ; i++)
        {
            vertices[i][0] -= center[0];
            vertices[i][1] -= center[1];
        }
    }

    var verticesStr = vertices.toSource();
    var inTangentsStr = shape.inTangents.toSource();
    var outTangentsStr = shape.outTangents.toSource();
    var closedStr = shape.closed ? 'true' : 'false';

    var file = new File(file);
    if(!file.open("w")) return 3
    var name = DuAEF.DuJS.Fs.getBasename(file);

    file.writeln('var ' + name + ' = new Shape();');
    file.writeln(name + '.vertices = ' + verticesStr + ';');
    file.writeln(name + '.inTangents = ' + inTangentsStr + ';');
    file.writeln(name + '.outTangents = ' + outTangentsStr + ';');
    file.writeln(name + '.closed = ' + closedStr + ';');
    file.close();
    return 0;
}

/**
* Makes a horizontal symetry transformation on the path.
* @param {Property}	pathProperty	- The After Effects Property containing the path to symetrize
*/
DuAEF.DuAE.Property.Shape.horizontalSymetry = function(pathProperty)
{
	if (pathProperty.propertyType !== PropertyType.PROPERTY) throw "Expected a shape property, got a group.";
	if (pathProperty.propertyValueType !== PropertyValueType.SHAPE) throw "Expected a shape property, got another type of value.";

	var shape = pathProperty.value;
	var vertices = shape.vertices;
	var inTangents = shape.inTangents;
	var outTangents = shape.outTangents;

	//get the horizontal center.
	var center = 0;
	for (var i = 0 ; i < vertices.length; i++)
	{
		center += vertices[i][0];
	}
	center = center / vertices.length;

	//twice the value for computing symetry
	center = center*2;

	//compute
	for (var i = 0 ; i < vertices.length; i++)
	{
		vertices[i][0] = center - vertices[i][0];
		inTangents[i][0] = -inTangents[i][0];
		outTangents[i][0] = -outTangents[i][0];
	}

	//set
	shape.vertices = vertices;
	shape.inTangents = inTangents;
	shape.outTangents = outTangents;
	if (pathProperty.numKeys > 0)
	{
		pathProperty.setValueAtTime(DuAEF.DuAE.Property.getPropertyComp(pathProperty).time,shape);
	}
	else
	{
		pathProperty.setValue(shape);
	}
}

/**
* Makes a horizontal symetry transformation on the paths, using the same axis of symetry for all shapes (shapes must be on the same layer).
* @param {Property[]}	pathProperties	- The After Effects Properties containing the paths to symetrize
*/
DuAEF.DuAE.Property.Shape.horizontalSymetries = function(pathProperties)
{
	var shapes = [];
	//get shapes and center
	var center = 0;
	var verticesCount = 0;
	for (var i = 0 ; i < pathProperties.length ; i++)
	{
		var shape = pathProperties[i].value;
		shapes.push(shape);
		for (var j = 0 ; j < shape.vertices.length; j++)
		{
			verticesCount++;
			center += shape.vertices[j][0];
		}
	}
	center = center / verticesCount;
	center = center *2;

	//compute
	for (var i = 0 ; i < shapes.length; i++)
	{
		var shape = shapes[i];
		var vertices = shape.vertices;
		var inTangents = shape.inTangents;
		var outTangents = shape.outTangents;
		for (var j = 0 ; j < shape.vertices.length ; j++)
		{
			vertices[j][0] = center - vertices[j][0];
			inTangents[j][0] = -inTangents[j][0];
			outTangents[j][0] = -outTangents[j][0];
		}
		shape.vertices = vertices;
		shape.inTangents = inTangents;
		shape.outTangents = outTangents;
		if (pathProperties[i].numKeys > 0)
		{
			pathProperties[i].setValueAtTime(DuAEF.DuAE.Property.getPropertyComp(pathProperties[i]).time,shape);
		}
		else
		{
			pathProperties[i].setValue(shape);
		}
	}
}

/**
* Makes a vertical symetry transformation on the path.
* @param {Property}	pathProperty	- The After Effects Property containing the path to symetrize
*/
DuAEF.DuAE.Property.Shape.verticalSymetry = function(pathProperty)
{
	if (pathProperty.propertyType !== PropertyType.PROPERTY) throw "Expected a shape property, got a group.";
	if (pathProperty.propertyValueType !== PropertyValueType.SHAPE) throw "Expected a shape property, got another type of value.";

	var shape = pathProperty.value;
	var vertices = shape.vertices;
	var inTangents = shape.inTangents;
	var outTangents = shape.outTangents;

	//get the horizontal center.
	var center = 0;
	for (var i = 0 ; i < vertices.length; i++)
	{
		center += vertices[i][1];
	}
	center = center / vertices.length;

	//twice the value for computing symetry
	center = center*2;

	//compute
	for (var i = 0 ; i < vertices.length; i++)
	{
		vertices[i][1] = center - vertices[i][1];
		inTangents[i][1] = -inTangents[i][1];
		outTangents[i][1] = -outTangents[i][1];
	}

	//set
	shape.vertices = vertices;
	shape.inTangents = inTangents;
	shape.outTangents = outTangents;
	if (pathProperty.numKeys > 0)
	{
		pathProperty.setValueAtTime(DuAEF.DuAE.Property.getPropertyComp(pathProperty).time,shape);
	}
	else
	{
		pathProperty.setValue(shape);
	}
}

/**
* Makes a vertical symetry transformation on the paths, using the same axis of symetry for all shapes (shapes must be on the same layer).
* @param {Property[]}	pathProperties	- The After Effects Properties containing the paths to symetrize
*/
DuAEF.DuAE.Property.Shape.verticalSymetries = function(pathProperties)
{
	var shapes = [];
	//get shapes and center
	var center = 0;
	var verticesCount = 0;
	for (var i = 0 ; i < pathProperties.length ; i++)
	{
		var shape = pathProperties[i].value;
		shapes.push(shape);
		for (var j = 0 ; j < shape.vertices.length; j++)
		{
			verticesCount++;
			center += shape.vertices[j][1];
		}
	}
	center = center / verticesCount;
	center = center *2;

	//compute
	for (var i = 0 ; i < shapes.length; i++)
	{
		var shape = shapes[i];
		var vertices = shape.vertices;
		var inTangents = shape.inTangents;
		var outTangents = shape.outTangents;
		for (var j = 0 ; j < shape.vertices.length ; j++)
		{
			vertices[j][1] = center - vertices[j][1];
			inTangents[j][1] = -inTangents[j][1];
			outTangents[j][1] = -outTangents[j][1];
		}
		shape.vertices = vertices;
		shape.inTangents = inTangents;
		shape.outTangents = outTangents;
		if (pathProperties[i].numKeys > 0)
		{
			pathProperties[i].setValueAtTime(DuAEF.DuAE.Property.getPropertyComp(pathProperties[i]).time,shape);
		}
		else
		{
			pathProperties[i].setValue(shape);
		}
	}
}
/*
DuJSLib
Library javascript tools
Copyright (c) 2017 Nicolas Dufresne, Rainbox Productions
https://rainboxprod.coop

_Contributors:_
Nicolas Dufresne - Lead developer

This file is part of DuAEF.

DuAEF is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

DuAEF is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with DuAEF. If not, see <http://www.gnu.org/licenses/>.
*/


/**
* Constructs an iterator
* @example
* var it = new Iterator(layers);
* while (!it.next())
* {
* 	var layer = layers[it.current];
*	//do something with the layer
* }
* @example
* var it = new Iterator(layers);
* it.do(function doSomething(layer) {
* layer.name = something;
* });
* @class Iterator
* @classdesc An iterator object to use for easier loops
* @property {Array|Collection} list - An array or an After Effects Collection
* @param {Array|Collection} list - An array or an After Effects Collection
* @property {int} min - The minimum value (inclusive)
* @property {int} max - The maximum (inclusive)
* @property {int} length - The number of items
* @property {int} current - The current item number
* @property {boolean} atEnd - true if the iterator has reached the end
* @property {boolean} atStart - true if the iterator is at the start
* @property {boolean} valid - true if the iterator is between min and max. false until next() or previous() has been called at least once
* @property {boolean} isCollection - true if the list is a Collection, false if it's a controller
*/
function Iterator(list)
{
	this.min = 0;
	this.max = list.length -1;
	this.length = list.length;
	if (list.length == 0) return;
	this.isCollection = false;
	if (DuAEF.DuAE.isCollection(list))
	{
		this.min = 1;
		this.max = this.length;
		this.isCollection = true;
	}
	this.current = -1;
	this.atStart = false;
	this.atEnd = false;
	this.valid = false;
	this.list = list;
}

/**
* Increments the Iterator<br />
* Must be called at least once to validate the iterator
*/
Iterator.prototype.next = function ()
{
	if (this.length == 0) return false;

	if (!this.valid)
	{
		this.goToStart();
		return true;
	}

	if (this.current < this.max)
	{
		this.goTo(this.current + 1);
		return true;
	}

	return false;
}

/**
* Decrements the Iterator
* if it's called while valid is false, goes to the end
*/
Iterator.prototype.previous = function ()
{
	if (this.length == 0) return;
	if (!this.valid)
	{
		this.goToEnd();
	}
	else
	{
		if (this.current > this.min) this.goTo(this.current - 1);
	}
}

/**
* Goes to the end of the Iterator
*/
Iterator.prototype.goToEnd = function ()
{
	if (this.length == 0) return;
	this.goTo(this.max);
}

/**
* Goes to the start of the Iterator
*/
Iterator.prototype.goToStart = function ()
{
	if (this.length == 0) return;
	this.goTo(this.min);
}

/**
* Sets the iterator on the index
* @param {int} index - The index
*/
Iterator.prototype.goTo = function(index)
{
	if (this.length == 0) return;
	this.current = index;
	if (this.current < this.min || this.current > this.max) this.valid = false;
	else this.valid = true;
	if (this.current == this.min) this.atStart = true;
	else this.atStart = false;
	if (this.current == this.max) this.atEnd = true;
	else this.atEnd = false;
}

/**
* Executes a function on each item of the List
* @param {function} callBack - The function to execute, which takes one parameter: an item of the list
*/
Iterator.prototype.do = function (callBack)
{
	if (this.length == 0) return;
	var current = this.current;

	for (var i = this.min ; i <= this.max ; i++)
	{
		this.valid = true;
		this.current = i;
		callBack(this.list[i]);
	}

	this.goTo(current);
}

/**
* Useful JavaScript tools
* @namespace
* @memberof DuAEF
*/
DuAEF.DuJS = {};

/**
* JavaScript Array related methods
* @namespace
* @memberof DuAEF.DuJS
*/
DuAEF.DuJS.Array = {};

/**
* Checks if this is an Array or an After Effects collection type
* @memberof DuAEF.DuJS.Array
* @param {Array|Collection} list - The list to check
* @return {boolean} true if this is a Cllection or an Array
*/
DuAEF.DuJS.Array.isList = function (list)
{
	return (list instanceof Array || DuAEF.DuAE.isCollection(list));
}

/**
* Gets the first index of a value in an Array, or -1 if not found
* @memberof DuAEF.DuJS.Array
* @param {Array}	arr	- The array
* @param {*}	value	- The value to find. Must be compatible with the == operand
* @return {int}	The index of value, -1 if not found
*/
DuAEF.DuJS.Array.indexOf = function (arr,value)
{
	if (value == undefined) throw "Value can not be undefined";

	for (var i = 0;i<arr.length;i++)
	{
	if (arr[i] == value) return i;
	}
	return -1;
}

/**
* Checks if the array has duplicate values
* @memberof DuAEF.DuJS.Array
* @param {Array}	arr	- The array
* @return {boolean}	true if the array has duplicate values
*/
DuAEF.DuJS.Array.hasDuplicates = function (arr)
{
	for (var i = 0;i<arr.length-1;i++) {
	for (var j=i+1;j<arr.length;j++) {
	if (arr[i] === arr[j]) return true;
	}
	}
	return false;
}

/**
* Returns all duplicated values found in the array
* @memberof DuAEF.DuJS.Array
* @param {Array}	arr	- The array
* @return {Array}	The duplicated values
*/
DuAEF.DuJS.Array.getDuplicates = function (arr)
{
	var duplicates = [];
	for (var i = 0;i<arr.length-1;i++) {
	for (var j=i+1;j<arr.length;j++) {
	if (arr[i] === arr[j]) duplicates.push(arr[j]);
	}
	}
	DuAEF.DuJS.Array.removeDuplicates(duplicates);
	return duplicates;
}

/**
* Removes all duplicated values from the Array, and returns them
* @memberof DuAEF.DuJS.Array
* @param {Array}	arr	- The array
* @return {Array}	The duplicated (and removed) values
*/
DuAEF.DuJS.Array.removeDuplicates = function (arr)
{
	var removed = [];
	for (var i = 0;i<arr.length-1;i++) {
        for (var j=i+1;j<arr.length;j++) {
            if (arr[i] === arr[j]) {
                removed = removed.concat(arr.splice(j,1));
            }
        }
	}
	return removed;
}

/**
* Compares two arrays.<br />
* The items in the arrays must be compatible with the == operand
* @memberof DuAEF.DuJS.Array
* @param {Array|Collection} array1 - The array
* @param {Array|Collection} array2 - The array
* @param {int} [floatPrecision=-1] - The precision for (float) number comparison, number of decimals. Set to -1 to not use.
* @return {boolean} true if the two arrays contain the same values
*/
DuAEF.DuJS.Array.compare = function (array1,array2,floatPrecision)
{
	if (!DuAEF.DuJS.Array.isList(array1) && !DuAEF.DuJS.Array.isList(array2))
	{
		if (typeof array1 == 'number' && typeof array2 == 'number')
		{
			return DuAEF.DuJS.Math.compare(array1,array2,floatPrecision)
		}
		else return array1 == array2;
	}
	if (DuAEF.DuJS.Array.isList(array1) && !DuAEF.DuJS.Array.isList(array2)) return false;
	if (!DuAEF.DuJS.Array.isList(array1) && DuAEF.DuJS.Array.isList(array2)) return false;
	if (array1.length != array2.length) return false;

	var it = new Iterator(array1);
	var ok = true;
	it.do(function (item1)
	{
		var item2 = array2[it.current];
		if (!DuAEF.DuJS.Array.compare(item1,item2,floatPrecision))
		{
			ok = false;
			return;
		}
	});

	return ok;
}

/**
* JavaScript File System related methods
* @namespace
* @memberof DuAEF.DuJS
*/
DuAEF.DuJS.Fs = {};

/**
* Recursively gets all files in a folder using a name filter
* Returns an array of File objects.
* @memberof DuAEF.DuJS.Fs
* @param {Folder}	folder	- The Folder
* @param {string|function}	[filter=*]	- A search mask for file names, specified as a string or a function.
* A mask string can contain question mark (?) and asterisk (*) wild cards. Default is "*", which matches all file names.
* Can also be the name of a function that takes a File or Folder object as its argument. It is called for each file or folder found in the search; if it returns true, the object is added to the return array.
* @return {Array}	The files found.
*/
DuAEF.DuJS.Fs.getFilesInFolder = function (folder,filter)
{
	if (folder === undefined) return [];
	if (!(folder instanceof Folder)) return [];

	var files = folder.getFiles(filter);
	if (files === null) files = [];

	var folders = folder.getFiles(DuJS.fs.isFolder);

	for (var i = 0 ; i < folders.length ; i++)
	{
		files = files.concat(DuJS.fs.getFilesInFolder(folders[i],filter));
	}
	return files;
}

/**
* Checks if an object is a Folder
* @memberof DuAEF.DuJS.Fs
* @param {*}	file	- The object to check
* @return {boolean}	true if this object is an instance of Folder
*/
DuAEF.DuJS.Fs.isFolder = function (file)
{
	return file instanceof Folder;
}

/**
* Returns the basename of the given path or file
* @memberof DuAEF.DuJS.Fs
* @example
* DuAEF.DuJS.Fs.getBasename(new File("D:/code/open/Duik/shape.test")) // "shape"
* DuAEF.DuJS.Fs.getBasename("D:/code/open/Duik/shape.test") // "shape"
* @param {String|File}	 [pathOrFile]	- The file or the path
* @return {String} The basename
*/
DuAEF.DuJS.Fs.getBasename = function(pathOrFile)
{
    if (pathOrFile instanceof File) pathOrFile = pathOrFile.absoluteURI;
    var name = pathOrFile.split("/").pop();
    name = name.split("\\").pop();
    if(name.lastIndexOf(".") > 0) return name.slice(0, name.lastIndexOf("."));
    return name;
}

/**
* Switch the extension of the given path. Create a new path from a given path and a given extension.
* @memberof DuAEF.DuJS.Fs
* @param {String|File}	 [pathOrFile]	- The file or the path
* @param {String}	     [newExtension]	- The new extension
* @return {String}  The new path
*/
DuAEF.DuJS.Fs.switchExtension = function(pathOrFile, newExtension)
{
    if (pathOrFile instanceof File) pathOrFile = pathOrFile.absoluteURI;
    var point = pathOrFile.lastIndexOf(".");
    if(point == -1) return pathOrFile;
    return pathOrFile.slice(0, point) + "." + newExtension;
}

/**
* Checks if the given path exists
* @memberof DuAEF.DuJS.Fs
* @param {String}	 [path]	- The file path
* @return {boolean} True or false
*/
DuAEF.DuJS.Fs.fileExists = function(path)
{
    var file = new File(path);
    return file.exists;
}

/**
* JavaScript Math related methods
* @namespace
* @memberof DuAEF.DuJS
*/
DuAEF.DuJS.Math = {};

/**
* Generates a random integer between minimum and maximum
* @memberof DuAEF.DuJS.Math
* @param {int}	[min=0]	- The minimum value
* @param {int}	[max=1]	- The maximum value
* @return {int}	The randomly generated integer
*/
DuAEF.DuJS.Math.random = function (min, max)
{
	if (min == undefined) min = 0;
	if (max == undefined) max = 1;
	var rng = null;
	$.sleep(1);
	var date = new Date();
	var rng = new Math.seedrandom(date.getTime())();
	//rng = Math.random();

	if (!rng) return 0;
	return rng * (max - min) + min;
}

/**
* Measures the vector length between two points
* @param {int[]} value1 - The first value
* @param {int[]} value2 - The second value
* @return {float} The length
*/
DuAEF.DuJS.Math.getLength = function (value1,value2)
{
	if (typeof value1 !== typeof value2)
	{
		return null;
	}
	if (value1.length > 0)
	{
		var result = 0;
		for (var dim = 0;dim<value1.length;dim++)
		{
			result += (value1[dim]-value2[dim])*(value1[dim]-value2[dim]);
		}
		result = Math.sqrt(result);
		return result;
	}
	else return Math.abs(value1 - value2) ;
}

/**
* Compares two numbers
* @memberof DuAEF.DuJS.Array
* @param {Number} value1 - The first value
* @param {Number} value2 - The second value
* @param {int} [floatPrecision=-1] - The precision for (float) number comparison, number of decimals. Set to -1 to not use.
* @return {boolean} true if the two values are equal
*/
DuAEF.DuJS.Math.compare = function (value1,value2,floatPrecision)
{
	if (typeof value1 != 'number') return false;
	if (typeof value2 != 'number') return false;
	if (floatPrecision >= 0)
	{
		var mul = Math.pow(10,floatPrecision);
		var num1 = Math.round(value1*mul)/mul;
		var num2 = Math.round(value2*mul)/mul;
		return num1 == num2;
	}
	else return value1 == value2;
}

/**
* JavaScript Regular Expression related methods
* @namespace
* @memberof DuAEF.DuJS
*/
DuAEF.DuJS.RegExp = {};

/**
* Escape reg exp reserved characters from a string to build a regular expression compatible string
* @memberof DuAEF.DuJS.RegExp
* @param {string}	string		- The string to escape
* @return	{string}	The escaped string
*/
DuAEF.DuJS.RegExp.escapeRegExp = function (string)
{
	return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

/**
* JavaScript String related methods
* @namespace
* @memberof DuAEF.DuJS
*/
DuAEF.DuJS.String = {};

/**
* Replaces all occurences of a substring by another and returns the new string.
* @memberof DuAEF.DuJS.String
* @param {string}	string			- The original string
* @param {string}	find			- The substring to replace
* @param {string}	replace			- The new substring to insert
* @param {boolean}	[caseSensitive=true]	- Optionnal. Do a case sensitive search of substring.
* @return	{string}	The new string
*/
DuAEF.DuJS.String.replace = function (string, find, replace, caseSensitive)
{
	if (caseSensitive == undefined) caseSensitive = true;
	var re = new RegExp(DuAEF.DuJS.RegExp.escapeRegExp(find),caseSensitive ? 'g' : 'gi');
	return string.replace(re, replace);
}

/**
 * Checks if a string ends with a given suffix
 * @memberof DuAEF.DuJS.String
 * @param {string}	str 	The string to check
 * @param {string}	suffix	The suffix
 * @return {bool}	Wether the string ends with the given suffix or not
 */
DuAEF.DuJS.String.endsWith = function (str, suffix)
{
	return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

/**
 * Generates a new unique string (numbered)
 * @param {string} newString	- The wanted new string
 * @param {string[]} stringList 	- The list of strings where the new one must be generateUnique
 * @param {boolean} [increment=true] - true to automatically increment the new name if it already ends with a digit
 * @return {string}	The unique string, with a new number at the end if needed.
 */
DuAEF.DuJS.String.generateUnique = function ( newString , stringList , increment )
{
	if (increment == undefined) increment = true;
	if (!increment) newString += ' ';

    //detect digits
    var reg = "( *)(\\d+)([.,]?\\d*)$";
    //clean input
    var regexClean = new RegExp(reg);
    newString = newString.replace(regexClean,"");
    //go!
    var regex = new RegExp( DuAEF.DuJS.RegExp.escapeRegExp(newString) + reg);
    //The greatest number found
    var greatestNumber = 0;
    //The number of digits for the number as string
    var numDigits = 0;
    var spaceString = "";
    for ( var i =0 ; i < stringList.length ; i ++)
    {
        var currentNumberMatch = stringList[i].match(regex);
        if (stringList[i] === newString && greatestNumber == 0) greatestNumber++;
        else if (currentNumberMatch !== null)
        {
            //if its a decimal number, keep only the integer part
            var numberAsString = currentNumberMatch[2];
            //convert to int
            var numberAsInt = parseInt(currentNumberMatch[2],10);
			if (isNaN(numberAsInt)) continue;
            if(numberAsInt >= greatestNumber ){
                greatestNumber = numberAsInt  + 1;
                spaceString = currentNumberMatch[1];
            }
            //check if there are zeroes before the number, count the digits
            if(numberAsInt.toString().length < numberAsString.length && numDigits < numberAsString.length) numDigits = numberAsString.length;
        }
    }

    //add leading 0 if needed
    if (greatestNumber > 0)
    {
            //convert to string with leading zeroes
            if (greatestNumber == 1) {
                greatestNumber++;
                spaceString = " ";
            }
            newString += spaceString;
            greatestNumber = DuAEF.DuJS.Number.convertToString(greatestNumber,numDigits);
            newString += greatestNumber;
    }

	if (!increment) newString = newString.substr(0,newString.length-1);

    return newString;
}

/**
* Join multiple paths togetther.
* @param {string[]}	 [parts]	- The parts to join togehter
* @param {String}	[sep=/]	- The separator to use. If not defined, will look for the first sep in the path.
* @return {String} The final path
*/
DuAEF.DuJS.String.pathJoin = function(parts, sep){
   var separator = sep || false;
   if(!separator)
   {
       // Find first /
       if(parts[0].indexOf('/') != -1) separator = '/';
       if(parts[0].indexOf('\\') != -1) separator = '\\';
   }
   if(!separator) separator = '/';
   var replace   = new RegExp(separator+'{1,}', 'g');  // Replace ///// with /
   return parts.join(separator).replace(replace, separator);
}

/**
* Number related methods
* @namespace
* @memberof DuAEF.DuJS
*/
DuAEF.DuJS.Number = {};

/**
 * Converts a number to a string, adding optionnal leading zeroes
 * @param {Number} num	- The number
 * @param {int} numDigits 	- The number of digits in the string. Adds leading zeroes
 * @param {int} [base=10]	- The conversion base
 * @return {string}	The number as a string
 */
DuAEF.DuJS.Number.convertToString = function (num, numDigits, base)
{
	if (base == undefined) base = 10;
	var result = num.toString(base);
    while(numDigits > result .length)
    {
        result  = "0"+ result ;
    }
    return result;
}

/**
* Color related methods
* @namespace
* @memberof DuAEF.DuJS
*/
DuAEF.DuJS.Color = {};

//Initialize
(function ()
{
	/**
	 * Enum for predefined colors.
	 * @readonly
	 * @enum {float[]}
	 */
	DuAEF.DuJS.Color.Colors =
	{
		BLACK: [0,0,0,1],
		DARK_GREY: [.262,.262,.262,1],
		LIGHT_GREY: [.7,.7,.7,1],
		RAINBOX_RED: [.925,.094,.094,1],
		ORANGE: [.925,.471,.094,1],
		YELLOW: [.925,.839,.094,1],
		GREEN: [.094,.925,.094],
		LIGHT_BLUE: [.471,.839,.925,1],
		LIGHT_PURPLE: [.471,.471,.925,1],
		AFTER_EFFECTS_BLUE: [.439,.722,1,1],
		RANDOM: [-1,-1,-1,-1]
	};

})();

/**
* Generates a random color
* @memberof DuAEF.DuJS.Color
* @return {float[]}	The color as an [R,G,B,A] Array with float values between 0.0 and 1.0
*/
DuAEF.DuJS.Color.random = function ()
{
	var color = [0,0,0,1];
	for (var i = 0 ; i < 3 ; i++)
	{
		color[i] = DuAEF.DuJS.Math.random();
		$.sleep(10);
	}
	return color;
}

/**
* Converts an hexadecimal color to an RVB Array
* @memberof DuAEF.DuJS.Color
* @param {string|int[]} hexColor	- The hexadecimal color
* @param {boolean}	[isString=true] 	- Whether hexColor is a string or an Array of int of base 16
* @return {float[]}	The color as an [R,G,B,A] Array with float values between 0.0 and 1.0
*/
DuAEF.DuJS.Color.hexToRGB = function (hexColor,isString)
{
		if (isString == undefined) isString = true;
		if (isString)
		{
			if (hexColor.indexOf("#") == 0) hexColor = hexColor.replace("#","");
			var red = parseInt(hexColor.substr(0,2),16)/255.0;
			var green = parseInt(hexColor.substr(2,2),16)/255.0;
			var blue = parseInt(hexColor.substr(4,2),16)/255.0;
			return [red,green,blue];
		}
		else
		{
			var r = hexColor >> 16;
			var g = (hexColor & 0x00ff00) >> 8;
			var b = hexColor & 0xff;
			return [r/255,g/255,b/255,1];
		}
	}

/**
* Converts an RGB color to a hex string
* @memberof DuAEF.DuJS.Color
* @param {float[]} rgbColor	- The rgb color
* @return {string}	The color as an hex string
*/
DuAEF.DuJS.Color.rgbToHex = function (rgbColor)
{
	var red = rgbColor[0]*255;
	var green = rgbColor[1]*255;
	var blue = rgbColor[2]*255;
	var hexR = red.toString(16)
	var hexG = green.toString(16)
	var hexB = blue.toString(16);
	if (hexR.length == 1) hexR = "0" + hexR;
	if (hexG.length == 1) hexG = "0" + hexG;
	if (hexB.length == 1) hexB = "0" + hexB;
	var hex = hexR+hexG+hexB;
	return hex;
}
/*
DuScriptUILib
Library with ScriptUI tools.
Copyright (c) 2017 Nicolas Dufresne, Rainbox Productions
https://rainboxprod.coop

_Contributors:_
Nicolas Dufresne - Lead developer

This file is part of DuAEF.

DuAEF is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

DuAEF is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with DuAEF. If not, see <http://www.gnu.org/licenses/>.
*/

/**
* ScriptUI tools
* @namespace
* @memberof DuAEF
*/
DuAEF.DuScriptUI = {};

/**
 * An image button
 * @typedef {Object} ImageButton
 * @property {string} standardImage - The path to the image (or a PNG as a string representation)
 * @property {string} imageOver - The path to the image (or a PNG as a string representation) to display when mouseover
 * @property {function} onClick - The function to execute on mouse click
 * @property {ScriptUIImage}	image	- The scriptui object representing the image
 * @property {StaticText}	label	- The label
 * @property {Group}	group 	- The group containing the image and the label
 */

/**
* An image checkbox
* @typedef {Object} ImageCheckBox
* @property {string} standardImage - The path to the image (or a PNG as a string representation)
* @property {string} imageOver - The path to the image (or a PNG as a string representation) to display when mouseover
* @property {string} imageChecked - The path to the image (or a PNG as a string representation) to display when the button is checked
* @property {function} onClick - The function to execute on mouse click
* @property {ScriptUIImage}	image	- The scriptui object representing the image
* @property {StaticText}	label	- The label
* @property {Group}	group 	- The group containing the image and the label
* @property {boolean}	checked 	- The checked state of the button
*/

/**
* A form
* @typedef {Object} Form
* @property {Group} labels - The left vertical group
* @property {Group} buttons - The right vertical group
*/

/**
* A nice Check box
* @typedef {Object} NiceCheckBox
* @property {StaticText} label - The statictext used as a label
* @property {CheckBox} checkbox - The box
* @property {float[]} color - The color [R,G,B,A]
* @property {event} onClick - Function to execute when clicked
*/

/**
* A nice Edit Text
* @typedef {Object} NiceEditText
* @property {string} text - The text displayed
* @property {event} onActivate - Function to execute when activated
* @property {event} onDeactivate - Function to execute when deactivated
* @property {event} onChange - Function to execute when text changed
* @property {method} setText - Call this method to change the text
*/

/**
* A nice Slider
* @typedef {Object} NiceSlider
* @property {int} value - The current value
* @property {event} onChanging - Function to execute when changing
* @property {event} onChange - Function to execute when changed
* @property {method} setValue - Call this method to change the value
*/

/**
* A Separator
* @typedef {Object} Separator
* @property {StaticText|CheckBox} label - the label
* @property {Panel} separator - the separator
* @property {boolean} checkable @readonly - true if a checkbox is displayed
*/

//initilization
(function ()
{
	/**
	* The default alignment of children of containers with "column" orientation
	* @memberof DuAEF.DuScriptUI
	* @type {String[]}
	* @default ["fill","top"]
	*/
	DuAEF.DuScriptUI.defaultColumnAlignment = ["fill","top"];
	/**
	* The default alignment of children of containers with "row" orientation
	* @memberof DuAEF.DuScriptUI
	* @type {String[]}
	* @default ["left","center"]
	*/
	DuAEF.DuScriptUI.defaultRowAlignment = ["left","center"];
	/**
	* The default alignment of children of containers with "stack" orientation
	* @memberof DuAEF.DuScriptUI
	* @type {String[]}
	* @default ["fill","top"]
	*/
	DuAEF.DuScriptUI.defaultStackAlignment = ["fill","top"];
	/**
	* The default spacing of containers
	* @memberof DuAEF.DuScriptUI
	* @type {int}
	* @default 2
	*/
	DuAEF.DuScriptUI.defaultSpacing = 2;
	/**
	* The default mqrgins of containers
	* @memberof DuAEF.DuScriptUI
	* @type {int}
	* @default 2
	*/
	DuAEF.DuScriptUI.defaultMargins = 2;
})();

/**
 * Changes the color of the text of a ScriptUI Object
 * @memberof DuAEF.DuScriptUI
 * @param {ScriptUI}		text	- The ScriptUI Object
 * @param {Array}				color	- The new color [R,V,B,A] Array
 */
DuAEF.DuScriptUI.setTextColor = function (text,color)
{
	if (!text) throw "You must provide a ScriptUI Control to change the color of the text";
	var g = text.graphics;
	var textPen = g.newPen(g.PenType.SOLID_COLOR,color,1);
	g.foregroundColor = textPen;
}

/**
 * Creates the main panel of a script
 * @memberof DuAEF.DuScriptUI
 * @param {Panel|null}		container	- The container ('this' in the root of the calling script), either a Panel (when launched from the 'Window' menu) or null (when launched from 'file/scripts/run...')
 * @param {string}	scriptName	- A name for this UI
 * @return {Panel|Window}	The panel created, either a ScriptUI Panel or a ScriptUI Window
 */
DuAEF.DuScriptUI.createUI = function (container, scriptName)
{
	if (!scriptName) scriptName = '';

	var  myPal = null;
	container instanceof Panel ? myPal = container : myPal = new Window('palette',scriptName,undefined, {resizeable:true});

	if (myPal == null) throw "Failed to create User Interface.";

	// Margins and alignment
	myPal.margins = DuAEF.DuScriptUI.defaultMargins;
	myPal.spacing = DuAEF.DuScriptUI.defaultSpacing;
	myPal.alignChildren = DuAEF.DuScriptUI.defaultColumnAlignment;
	myPal.orientation = "column";

	return myPal;
}

/**
 * Resizes and shows the main panel of a script
 * @memberof DuAEF.DuScriptUI
 * @param {Panel|Window}		ui	- The UI created by Duik.ui.createUI
 */
DuAEF.DuScriptUI.showUI = function (ui)
{
	ui.layout.layout(true);
	ui.layout.resize();
	ui.onResizing = ui.onResize = function () {this.layout.resize();}

	// If it's a Window, it needs to be shown
	if (ui instanceof Window) {
		//ui.center();
		ui.show();
	}
}

/**
 * Adds a group in a container, using  DuAEF.DuScriptUI default alignments, and DuAEF.DuScriptUI.defaultSpacing. Margins are set to 0.
 * @memberof DuAEF.DuScriptUI
 * @param {Panel|Window|Group}		container	- Where to create the group
 * @param {string}					[orientation] - The orientation to use. One of "column", "row" or "stack". By default, "column" if added in a row, "row" if added in a column.
 * @return {Group}	The group created
 */
DuAEF.DuScriptUI.addGroup = function (container,orientation)
{
	var group = container.add("group");
	group.spacing = 2;
	group.margins = 0;
	if (orientation !== undefined) group.orientation = orientation;
	if(group.orientation === "row")
	{
		group.alignChildren = DuAEF.DuScriptUI.defaultRowAlignment;
	}
	else if (group.orientation === "column")
	{
		group.alignChildren = DuAEF.DuScriptUI.defaultColumnAlignment;
	}
	else
	{
		group.alignChildren = DuAEF.DuScriptUI.defaultStackAlignment;
	}

	return group;
}

/**
 * Adds separator with an optionnal name in the group
 * @memberof DuAEF.DuScriptUI
 * @param {Panel|Window|Group} container - Where to create the separator
 * @param {string} [name] - The name displayed
 * @param {boolean} [checkable=false] - When true, adds a checkbox to the separator
 * @return {Separator} The separator
 */
DuAEF.DuScriptUI.addSeparator = function (container,name,checkable)
{
	if (name == undefined) name = "";
	if (checkable == undefined) checkable = false;
	var separator = DuAEF.DuScriptUI.addGroup(container,"row");
	separator.margins = DuAEF.DuScriptUI.defaultMargins;
	separator.margins.bottom = DuAEF.DuScriptUI.defaultMargins*2;
	separator.alignment = ['fill','top'];
	separator.checkable = checkable;

	separator.label = null;
	if (name != '' || checkable)
	{
		if (checkable) separator.label = separator.add('checkbox',undefined,name);
		else separator.label = separator.add('statictext',undefined,name);
		separator.label.alignment = ['left','bottom'];
	}

	separator.separator = separator.add('panel',undefined);
	separator.separator.alignment = ['fill','center'];
	separator.separator.height = 0;

	return separator;
}

/**
 * Creates a button with an optionnal icon. Must have at least an icon or a text, or both.
 * @memberof DuAEF.DuScriptUI
 * @param {Panel|Window|Group}			container	- The ScriptUI Object which will contain and display the button.
 * @param {string}					[text]		- The label of the button. Default: empty string
 * @param {string}					[image]		- The path to the icon. Default: empty string
 * @param {string}					[helpTip]		- The helptip. Default: empty string
 * @param {string}					[imageOver=image]	- The path to an icon displayed when the mouse is over the button.
 * @return {ImageButton}			The image button created.
 */
DuAEF.DuScriptUI.addImageButton = function (container,text,image,helpTip,imageOver)
{
	if (!text) text = '';
	if (!image) image = '';
	if (!helpTip) helpTip = '';
	if (!imageOver) imageOver = '';

	if (text == '' && image == '') throw "You must provide either a text or an icon to create the button";

	var imageButton = {};

	imageButton.standardImage = image;
	imageButton.imageOver = imageOver;
	imageButton.onClick = function(){};
	imageButton.image = null;
	imageButton.label = null;

	//create a group
	var group = container.add('group');
	group.orientation = 'row';
	group.margins = 0;
	group.spacing = 5;
	imageButton.group = group;

	if (image != '')
	{
		if (!DuAEF.DuJS.Fs.fileExists(image)) throw new Error("Image does not exists: " + image);
		var icon = group.add('image',undefined,image);
		icon.alignment = ['center','center'];
		icon.helpTip = helpTip;
		imageButton.image = icon;
	}
	if (imageOver != '')
	{
		if (!DuAEF.DuJS.Fs.fileExists(imageOver)) throw new Error("Image does not exists: " + imageOver);
	}

	if (text != '')
	{
		var label = group.add('statictext',undefined,text);
		label.helpTip = helpTip;
		label.alignment = ['left','center'];
		imageButton.label = label;
	}

	//events
	imageButton.clicked = function (e)
	{
		try { imageButton.onClick(); } catch (e) { if (DuAEF.debug) alert('An error has occured in file at line ' + e.line + '\n\n' + e.description); }
	}

	imageButton.mouseOver = function (e)
	{
		if (icon) if (imageButton.imageOver != '') icon.image = imageButton.imageOver;
		if (label) DuAEF.DuScriptUI.setTextColor(imageButton.label,DuAEF.DuJS.Color.Colors.RAINBOX_RED);
	}

	imageButton.mouseOut = function (e)
	{
		if (icon) if (imageButton.standardImage != '') icon.image = imageButton.standardImage;
		if (label) DuAEF.DuScriptUI.setTextColor(imageButton.label,DuAEF.DuJS.Color.Colors.LIGHT_GREY);
	}

	//add events
	group.addEventListener("mousedown",imageButton.clicked,true);
	// Hack - CS6 Bug on mouseover with images
	if (DuAEF.DuAE.App.version >= 11 && DuAEF.DuAE.App.version < 12)
	{
		if (label) imageButton.label.addEventListener("mouseover",imageButton.mouseOver);
		if (label) imageButton.label.addEventListener("mouseout",imageButton.mouseOut);
	}
	else
	{
		group.addEventListener("mouseover",imageButton.mouseOver);
		group.addEventListener("mouseout",imageButton.mouseOut);
	}


	return imageButton;
}

/**
 * Creates a checkbox with an optionnal icon. Must have at least an icon or a text, or both.
 * @memberof DuAEF.DuScriptUI
 * @param {Panel|Window|Group}			container		- The ScriptUI Object which will contain and display the button.
 * @param {string}					text			- The label of the button. Default: empty string
 * @param {string}					image			- The path to the icon. Default: empty string
 * @param {string}					helpTip			- The helptip. Default: empty string
 * @param {string}					imageChecked	- The path to an icon displayed when the button is checked. Default: empty string
 * @param {string}					imageOver		- The path to an icon displayed when the mouse is over the button. Default: same as imageChecked
 * @param {string}					[textChecked]			- The label of the button displayed when it is checked.
 * @return {ImageCheckBox}					The image checkbox created.
 */
DuAEF.DuScriptUI.addImageCheckBox = function (container,text,image,helpTip,imageChecked,imageOver,textChecked)
{
	if (!container) return null;
	if (!text) text = '';
	if (!image) image = '';
	if (!helpTip) helpTip = '';
	if (!imageChecked) imageChecked = '';
	if (!imageOver) imageOver = imageChecked;
	if (textChecked == undefined) textChecked = '';

	if (text == '' && image == '') throw "You must provide either a text or an icon to create the checkbox";

	var imageButton = {};

	imageButton.standardImage = image;
	imageButton.imageOver = imageOver;
	imageButton.imageChecked = imageChecked;
	imageButton.onClick = function () {};
	imageButton.checked = imageButton.value = false;
	imageButton.textChecked = textChecked;
	imageButton.defaultText = text;

	var group = container.add('group');
	group.orientation = 'row';
	group.margins = 0;
	group.spacing =5;
	imageButton.group = group;

	if (image != '')
	{
		if (!DuAEF.DuJS.Fs.fileExists(image)) throw new Error("Image does not exists: " + image);
		var icon = group.add('image',undefined,image);
		icon.alignment = ['center','center'];
		icon.helpTip = helpTip;
		imageButton.image = icon;
	}
	if (imageOver != '')
	{
		if (!DuAEF.DuJS.Fs.fileExists(imageOver)) throw new Error("Image does not exists: " + imageOver);
	}
	if (imageChecked != '')
	{
		if (!DuAEF.DuJS.Fs.fileExists(imageChecked)) throw new Error("Image does not exists: " + imageChecked);
	}

	if (text != '')
	{
		if (image != '')
		{
			var label = group.add('statictext',undefined,text);
			label.helpTip = helpTip;
			label.alignment = ['center','center'];
			imageButton.label = label;
		}
		else
		{
			var label = group.add('checkbox',undefined,text);
			label.helpTip = helpTip;
			label.alignment = ['center','center'];
			imageButton.label = label;
			imageButton.box = true;
		}
		if (text.length < textChecked.length) imageButton.label.minimumSize.width = textChecked.length*7;
		else imageButton.label.minimumSize.width = text.length*7;

	}

	/**
	* Checks or unchecks the button
	* @memberof ImageCheckBox
	* @param {boolean} c	- The checked state
	*/
	imageButton.setChecked = function (c)
	{
		imageButton.checked = imageButton.value = c;
		if (imageButton.imageChecked != '')
		{
			if (imageButton.checked)
			{
				if (imageButton.textChecked != '' && imageButton.label) imageButton.label.text = imageButton.textChecked;
				if (imageButton.image) if (imageButton.imageChecked != '') icon.image = imageButton.imageChecked;
				if (imageButton.label) DuAEF.DuScriptUI.setTextColor(imageButton.label,DuAEF.DuJS.Color.Colors.RAINBOX_RED);
			}
			else
			{
				if (imageButton.label) imageButton.label.text = imageButton.defaultText;
				if (imageButton.image) if (imageButton.standardImage != '') icon.image = imageButton.standardImage;
				if (imageButton.label) DuAEF.DuScriptUI.setTextColor(imageButton.label,DuAEF.DuJS.Color.Colors.LIGHT_GREY);
			}
		}
	}

	imageButton.clicked = function (e)
	{
		imageButton.setChecked(!imageButton.checked);
		try { imageButton.onClick(); } catch (e) { if (DuAEF.debug) alert('An error has occured at line ' + e.line + '\n\n' + e.description); }
	}

	imageButton.mouseOver = function (e)
	{
		if (icon) if (imageButton.imageOver != '') icon.image = imageButton.imageOver;
		if (label) DuAEF.DuScriptUI.setTextColor(imageButton.label,DuAEF.DuJS.Color.Colors.RAINBOX_RED);
	}

	imageButton.mouseOut = function (e)
	{
		if (imageButton.checked)
		{
			if (icon) if (imageButton.imageChecked != '') icon.image = imageButton.imageChecked;
			if (label) DuAEF.DuScriptUI.setTextColor(imageButton.label,DuAEF.DuJS.Color.Colors.RAINBOX_RED);
		}
		else
		{
			if (icon) if (imageButton.standardImage != '') icon.image = imageButton.standardImage;
			if (label) DuAEF.DuScriptUI.setTextColor(imageButton.label,DuAEF.DuJS.Color.Colors.LIGHT_GREY);
		}
	}

	imageButton.group.addEventListener("mousedown",imageButton.clicked,true);
	// Hack - CS6 Bug on mouseover with images
	if (DuAEF.DuAE.App.version >= 11 && DuAEF.DuAE.App.version < 12)
	{
		if (label) imageButton.label.addEventListener("mouseover",imageButton.mouseOver);
		if (label) imageButton.label.addEventListener("mouseout",imageButton.mouseOut);
	}
	else
	{
		imageButton.group.addEventListener("mouseover",imageButton.mouseOver);
		imageButton.group.addEventListener("mouseout",imageButton.mouseOut);
	}

	return imageButton;
}

/**
 * Creates a checkbox which can be colored, and changes color on hover
 * @memberof DuAEF.DuScriptUI
 * @param {Panel|Window|Group}		container		- The ScriptUI Object which will contain and display the button.
 * @param {string}					[text]			- The label of the button.
 * @param {string}					[helpTip]			- The helptip.
 * @param {color}					[color=DuAEF.DuJS.Color.Colors.LIGHT_GREY]			- The color of the text
 * @return {ImageCheckBox}					The image checkbox created.
 */
DuAEF.DuScriptUI.addNiceCheckBox = function (container,text,helpTip,color)
{
	if (color == undefined) color = DuAEF.DuJS.Color.Colors.LIGHT_GREY;
	if (helpTip == undefined) helpTip = '';
	if (text == undefined) text = '';

	var niceCheckBox = container.add('group');
	niceCheckBox.orientation = 'row';
	niceCheckBox.alignChildren = ['left','center'];
	niceCheckBox.spacing = DuAEF.DuScriptUI.defaultSpacing;
	niceCheckBox.margins = 0;
	niceCheckBox.checkBox = niceCheckBox.add('checkbox',undefined,'');
	niceCheckBox.label = niceCheckBox.add('statictext',undefined,text);
	niceCheckBox.onClick = function () {};
	niceCheckBox.checked = niceCheckBox.value = false;
	niceCheckBox.color = color;

	niceCheckBox.checkBox.helpTip = helpTip;
	niceCheckBox.label.helpTip = helpTip;

	DuAEF.DuScriptUI.setTextColor(niceCheckBox.label,niceCheckBox.color);

	/**
	* Checks or unchecks the button
	* @memberof NiceCheckBox
	* @param {boolean} c	- The checked state
	*/
	niceCheckBox.setChecked = function (c)
	{
		niceCheckBox.checked = niceCheckBox.value = c;
		niceCheckBox.checkBox.value = c;
	}

	niceCheckBox.labelClicked = function (e)
	{
		niceCheckBox.setChecked(!niceCheckBox.checked);
		try { niceCheckBox.onClick(); } catch (e) { if (DuAEF.debug) alert('An error has occured at line ' + e.line + '\n\n' + e.description); }
	}

	niceCheckBox.checkBoxClicked = function (e)
	{
		niceCheckBox.checked = niceCheckBox.value = niceCheckBox.checkBox.value;
		try { niceCheckBox.onClick(); } catch (e) { if (DuAEF.debug) alert('An error has occured at line ' + e.line + '\n\n' + e.description); }
	}

	niceCheckBox.mouseOver = function (e)
	{
		DuAEF.DuScriptUI.setTextColor(niceCheckBox.label,DuAEF.DuJS.Color.Colors.RAINBOX_RED);
	}

	niceCheckBox.mouseOut = function (e)
	{
		DuAEF.DuScriptUI.setTextColor(niceCheckBox.label,niceCheckBox.color);
	}

	niceCheckBox.label.addEventListener("mousedown",niceCheckBox.labelClicked,false);
	niceCheckBox.checkBox.onClick = niceCheckBox.checkBoxClicked;
	niceCheckBox.addEventListener("mouseover",niceCheckBox.mouseOver);
	niceCheckBox.addEventListener("mouseout",niceCheckBox.mouseOut);

	return niceCheckBox;
}

/**
 * Creates a layout to add forms to a UI, using ScriptUI groups.<br />
 * The object returned is a custom group with two attributes:<br />
 * form.labels is a vertical group on the left<br />
 * form.buttons is a vertical group on the right<br />
 * You can easily add controls/fields to this form using Duik.ui.addFormField
 * @memberof DuAEF.DuScriptUI
 * @param {Window|Panel|Group}	container		- The ScriptUI Object which will contain and display the form.
 * @return {Form}		The custom Group containing the form.
 */
DuAEF.DuScriptUI.addForm = function (container)
{
	var mainGroup = container.add('group');
	mainGroup.orientation = 'row';
	mainGroup.margins = 0;
	mainGroup.spacing = DuAEF.DuScriptUI.defaultSpacing;

	var labelsGroup = mainGroup.add('group');
	labelsGroup.alignment = ['left','top'];
	labelsGroup.orientation = 'column';
	labelsGroup.alignChildren = ['left','bottom'];
	labelsGroup.spacing = DuAEF.DuScriptUI.defaultSpacing;

	var buttonsGroup = mainGroup.add('group');
	buttonsGroup.alignment = ['fill','top'];
	buttonsGroup.orientation = 'column';
	buttonsGroup.alignChildren = ['fill','fill'];
	buttonsGroup.spacing = DuAEF.DuScriptUI.defaultSpacing;

	mainGroup.labels = labelsGroup;
	mainGroup.buttons = buttonsGroup;

	return mainGroup;
}

/**
 * Adds a field to a form
 * example: Duik.ui.addFormField(form,'Composition:','dropdownlist',['Composition1','Composition2'],'Select a composition')
 * @memberof Duik.ui
 * @param {Form}			form		- A custom ScriptUI group as returned by DuAEF.DuScriptUI.addForm
 * @param {string}			label		- The label text.
 * @param {string}			type		- The type of ScriptUI object to add (like 'button','edittext', etc.).
 * @param {object}			[value]		- The default value or content of the field added, depends on the type.
 * @param {string}			[helpTip]		- The helpTip of the form control.
 * @return {ScriptUI[]}		An array with at 0 the StaticText label, and at 1 the ScriptUI object of the type type, added to the form
 */
DuAEF.DuScriptUI.addFormField = function (form,label,type,value,helpTip)
{
	if (helpTip == undefined) helpTip = '';
	var control = null;
	var height = 20;
	if (type == "ImageButton")
	{
		control = DuAEF.DuScriptUI.addImageButton(form.buttons,'',value[0],helpTip,value[1]);
		height = control.image.preferredSize[1];
	}
	else
	{
		control = form.buttons.add(type,undefined,value);
		control.helpTip = helpTip;
		height = control.preferredSize[1];
	}

	var l = form.labels.add('statictext',undefined,label);
	l.helpTip = helpTip;

	l.minimumSize.height = l.maximumSize.height = height;
	return [l,control];
}

/**
 * Creates a nice edittext where the edit text is shown only on click.
 * @memberof DuAEF.DuScriptUI
 * @param {Window|Panel|Group}	container		- The ScriptUI Object which will contain and display the nice edit text.
 * @param {string}	text		- The initial text in the edit.
 * @param {string}	[prefix]		- A text prefix to display.
 * @param {string}	[suffix]		- A text suffix to display.
 * @param {string}	[placeHolder]	- A place holder default text.
 * @return {NiceEditText}	The custom Group containing the edit text.
 * @todo implement helpTip
 */
DuAEF.DuScriptUI.addNiceEditText = function(container,text,prefix,suffix,placeHolder)
{
	if (prefix == undefined) prefix = '';
	if (suffix == undefined) suffix = '';
	if (placeHolder == undefined) placeHolder = '';
	var niceEditText = container.add('group');
	niceEditText.orientation = 'stack';
	niceEditText.margins = 0;
	niceEditText.alignChildren = ['fill','fill'];
	niceEditText.placeHolder = placeHolder;
	var staticText = text;
	if (text == "" && placeHolder != "") staticText = placeHolder;
	niceEditText.static = niceEditText.add('statictext',undefined,prefix + staticText + suffix);
	niceEditText.static.alignment = ['fill','center'];
	if (text == "" && placeHolder != "") DuAEF.DuScriptUI.setTextColor(niceEditText.static,DuAEF.DuJS.Color.Colors.LIGHT_GREY);
	else DuAEF.DuScriptUI.setTextColor(niceEditText.static,DuAEF.DuJS.Color.Colors.AFTER_EFFECTS_BLUE);
	niceEditText.edit = niceEditText.add('edittext',undefined,text);
	niceEditText.edit.visible = false;
	niceEditText.prefix = prefix;
	niceEditText.suffix = suffix;

	niceEditText.text = text;
	niceEditText.editing = false;

	niceEditText.onActivate = function(){};
	niceEditText.onDeactivate = function(){};
	niceEditText.onChange = function(){};
	niceEditText.onChanging = function(){};

	niceEditText.clicked = function()
	{
		if (niceEditText.editing) return;
		else
		{
			niceEditText.static.visible = false;
			niceEditText.edit.visible = true;
			niceEditText.editing = true;
			niceEditText.edit.active = true;
		}
	}

	niceEditText.changed = function()
	{
		niceEditText.editing = false;
		var staticText = '';
		if (niceEditText.edit.text == '' && niceEditText.placeHolder != '')
		{
			DuAEF.DuScriptUI.setTextColor(niceEditText.static,DuAEF.DuJS.Color.Colors.LIGHT_GREY);
			staticText = niceEditText.placeHolder;
		}
		else
		{
			if (niceEditText.placeHolder != '') DuAEF.DuScriptUI.setTextColor(niceEditText.static,DuAEF.DuJS.Color.Colors.AFTER_EFFECTS_BLUE);
			staticText = niceEditText.edit.text;
		}
		niceEditText.static.text = niceEditText.prefix + staticText + niceEditText.suffix;
		niceEditText.text = niceEditText.edit.text ;
		niceEditText.edit.visible = false;
		niceEditText.static.visible = true;
		niceEditText.edit.active = false;
		niceEditText.onChange();
	}
	niceEditText.changing = function()
	{
		niceEditText.text = niceEditText.edit.text ;
		niceEditText.onChanging();
	}

	niceEditText.setText = function (text)
	{
		niceEditText.edit.text = niceEditText.text = text;
		niceEditText.static.text = niceEditText.prefix + text + niceEditText.suffix;
	}


	niceEditText.edit.onActivate = function()
	{
		niceEditText.onActivate();
	}
	niceEditText.edit.onDeactivate = function ()
	{
		niceEditText.changed();
		niceEditText.onDeactivate();
	}
	niceEditText.edit.onChange = niceEditText.changed;
	niceEditText.edit.onChanging = niceEditText.changing;
	niceEditText.addEventListener("mousedown",niceEditText.clicked,true);

	return niceEditText;
}

/**
 * Creates a nice edittext where the edit text is shown only on click.
 * @memberof DuAEF.DuScriptUI
 * @param {Window|Panel|Group}	container		- The ScriptUI Object which will contain and display the nice edit text.
 * @param {int}	[defaultValue=0]		- The initial value.
 * @param {int}	[min=0]		- The minimal value.
 * @param {int}	[max=100]		- The maximal value.
 * @param {string}	[orientation='column']		- Either 'row' or 'column'
 * @param {boolean}	[invertedAppearance]		- Revert the slider with max value on the left
 * @param {string}	[prefix]		- A text prefix to display.
 * @param {string}	[suffix]		- A text suffix to display.
 * @return {NiceSlider}	The custom Group containing the slider.
 * @todo implement helpTip
 */
DuAEF.DuScriptUI.addNiceSlider = function(container,defaultValue,min,max,orientation,invertedAppearance,prefix,suffix)
{
	if (prefix == undefined) prefix = '';
	if (suffix == undefined) suffix = '';
	if (min == undefined) min = 0;
	if (max == undefined) max = 100;
	if (defaultValue == undefined) defaultValue = 0;
	if (orientation != 'row') orientation = 'column';

	var niceSlider = container.add('group');
	niceSlider.orientation = orientation;
	niceSlider.spacing = DuAEF.DuScriptUI.defaultSpacing;
	niceSlider.alignment = ['fill','top'];
	niceSlider.alignChildren = ['fill','center'];

	niceSlider.value = defaultValue;
	niceSlider.invertedAppearance = invertedAppearance;

	var sliderValue = defaultValue;
	if (niceSlider.invertedAppearance) sliderValue = max-defaultValue+min;

	niceSlider.slider = niceSlider.add('slider',undefined,sliderValue,min,max);
	niceSlider.edit = DuAEF.DuScriptUI.addNiceEditText(niceSlider,defaultValue.toString(),prefix,suffix);
	niceSlider.edit.minimumSize.width = max.toString().length*7+7;
	if (orientation == 'row')
	{
		niceSlider.edit.alignment = ['right','center'];
	}
	else
	{
		niceSlider.edit.alignment = ['center','center'];
	}
	niceSlider.onChanging = function () {};
	niceSlider.onChange = function () {};

	niceSlider.setValue = function (val)
	{
		niceSlider.value = val;
		niceSlider.edit.setText(niceSlider.value);
		if (niceSlider.invertedAppearance) niceSlider.slider.value = niceSlider.slider.maxvalue - val + niceSlider.slider.minvalue;
		else niceSlider.slider.value = val;
	}

	//events
	niceSlider.slider.onChanging = function ()
	{
		if (niceSlider.invertedAppearance) niceSlider.value = Math.round(niceSlider.slider.maxvalue - niceSlider.slider.value + niceSlider.slider.minvalue);
		else niceSlider.value = Math.round(niceSlider.slider.value);
		niceSlider.edit.setText(niceSlider.value);
		niceSlider.onChanging();
	}
	niceSlider.slider.onChange = function ()
	{
		niceSlider.onChange();
	}
	niceSlider.edit.onChanging = function ()
	{
		var val = parseInt(niceSlider.edit.text);
		if (isNaN(val)) return;
		niceSlider.value = val;
		if (niceSlider.invertedAppearance) niceSlider.slider.value = niceSlider.slider.maxvalue-val+niceSlider.slider.minvalue;
		else niceSlider.slider.value = val;
		niceSlider.onChanging();
	}
	niceSlider.edit.onChange = function ()
	{
		var val = parseInt(niceSlider.edit.text);
		if (isNaN(val)) return;
		if (val < niceSlider.slider.minvalue) val = niceSlider.slider.minvalue;
		if (val > niceSlider.slider.maxvalue) val = niceSlider.slider.maxvalue;
		niceSlider.value = val;
		if (niceSlider.invertedAppearance) niceSlider.slider.value = niceSlider.slider.maxvalue-val+niceSlider.slider.minvalue;
		else niceSlider.slider.value = val;
		niceSlider.onChange();
	}

	return niceSlider;
}
/*
DuStoryboarderLib
Library for interchange with Wonderunit Storyboarder
Copyright (c) 2017-2018 Nicolas Dufresne, Rainbox Productions
https://rainboxprod.coop

__Contributors:__

	Nicolas Dufresne - Lead developer
	Kevin Masson - Developer

__Thanks to:__

	Dan Ebberts - Writing the first IK Expressions
	Eric Epstein - making the IK's work with 3D Layers
	Kevin Schires – Including images in the script
	Matias Poggini – Bezier IK feature
	Eric Epstein - Making the IK's work with 3D Layers
	Assia Chioukh and Quentin Saint-Georges – User Guides composition
	Motion Cafe – Ideas and feedback
	Fous d’anim – Ideas and feedback
	All 258 Duik 15 indiegogo backers for making this libDuik possible!


This file is part of DuAEF.

DuAEF is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

DuAEF is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with DuAEF. If not, see <http://www.gnu.org/licenses/>.
*/

/**
* A complete storyboard, as returned by DuAEF.WUStoryboarder.loadStoryboard
* @typedef {Object} WUStoryboard
* @property {string} version - The version of Storyboarder used to create this storyboard
* @property {string} aspectRatio - The format of the board
* @property {number} fps - The fps of the project
* @property {int} defaultBoardTiming - The default board duration
* @property {WUBoard[]} boards - The boards
*/

/**
* A board
* @typedef {Object} WUBoard
* @property {string} uid - A unique identifier for this board
* @property {string} url - The file name of the main layer image
* @property {boolean} newShot - Wether this board is a new shot or the next board of the previous shot
* @property {string} shot - The name of the board
* @property {int} number - The index of the board
* @property {int} time - The time of the board, in ms
* @property {int} duration - The duration of this board, in ms
*/

/**
* Wonderunit Storyboarder interchange tools<br />
* Dependencies: JSON.jsxinc; DuAEFLib.jsxinc; DuJSLib.jsxinc
* @namespace
* @memberof DuAEF
*/
DuAEF.WUStoryboarder = {};

/**
 * Loads a Storyboarder file
 * @memberof DuAEF.WUStoryboarder
 * @param {File} file - The .storyboarder JSON file
 * @return {WUStoryboard|null} The storyboard or null if the file could not be parsed or opened
 */
DuAEF.WUStoryboarder.loadStoryboard = function(file)
{
	//open and parse file
	if (!file.open('r')) return null;
	var data = file.read();
	file.close();
	data = JSON.parse(data);

	//check boards count
	if (!data.boards) return null;

	//update board durations
	var it = new Iterator(data.boards);
	it.do( function(board) {
		if (!board.duration) board.duration = data.defaultBoardTiming;
	});

	return data;
}

/**
 * Imports a .storyboard file with all boards
 * @memberof DuAEF.WUStoryboarder
 * @param {File} file - The .storyboard file to import. Boards as png files must be in an 'images' subfolder
 * @param {boolean} [overlayInfo = false] - True to display text information on top of the image, false to display it under the image
 * @param {boolean} [precompShots = true] - True to precompose the layers and boards for each shots
 * @return {int} Error code: -2: invalid file or data,<br/>
 * -1: images not found or invalid,<br/>
 * 0: no board to import in the file,<br/>
 * 1: ok
 */
DuAEF.WUStoryboarder.import = function (file,overlayInfo,precompShots)
{
	if (overlayInfo === undefined) overlayInfo = false;
	if (precompShots === undefined) precompShots = true;

	var storyboard = DuAEF.WUStoryboarder.loadStoryboard(file);

	if (!storyboard) return -2;
	var boards = storyboard.boards;
	var numBoards = boards.length;
	if (numBoards == 0) return 0;

	//check images
	var imagesPath = file.path + '/images/';
	var imagesFolder = new Folder(imagesPath);
	if (!imagesFolder.exists) return -1;
	//first board
	var firstImageFile = new File(imagesPath + boards[0].url);
	if (!firstImageFile.exists) return -1;
	//size
	//import first image to check size
	var item = app.project.importFile(new ImportOptions(firstImageFile));
	width = item.width;
	height = overlayInfo ? item.height : item.height+200;
	item.remove();

	//storyboard name
	var name = file.name.replace('.storyboarder','');
	//duration
	var lastBoard = boards[numBoards-1];
	var duration = lastBoard.time + lastBoard.duration;

	//create comp
	var comp = app.project.items.addComp(name + " Animatic", width, height, 1, duration/1000, storyboard.fps);

	//create Folder item
	var imageFolder = app.project.items.addFolder(name + " Boards");
	var precompFolder = null;
	if (precompShots) precompFolder = app.project.items.addFolder(name + " Shots");

	//import boards
	var shotComp = comp;
	var boardTime = 0;
	for (var i = 0 ; i < numBoards ; i++)
	{
		var board = boards[i];

		//create shot comp
		if ((i == 0 || board.newShot) && precompShots)
		{
			//background
			if (!overlayInfo && i != 0)
			{
				var solid = shotComp.layers.addSolid([0,0,0], "Background", width, 200, 1);
				solid.transform.position.setValue([width/2,height-100]);
				solid.moveToEnd();
			}

			//get shot duration
			var shotDuration = board.duration/1000;
			for (var j = i+1 ; j <  numBoards ; j++ )
			{
				var nextBoard = boards[j];
				if (nextBoard.newShot) break;
				shotDuration = shotDuration + nextBoard.duration/1000;
			}
			shotComp = app.project.items.addComp("Shot " + board.shot.replace('A',''), width, height, 1, shotDuration, storyboard.fps);

			shotComp.parentFolder = precompFolder;
			//add to comp
			var shotCompLayer = comp.layers.add(shotComp);
			shotCompLayer.startTime = board.time/1000;
			shotCompLayer.moveToEnd();
			boardTime = 0;
		}

		//import
		var mainFile = new File(imagesPath + board.url);
		var mainItem = app.project.importFile(new ImportOptions(mainFile));
		mainItem.parentFolder = imageFolder;
		//add to comp
		var shotLayer = shotComp.layers.add(mainItem,board.duration/1000);
		shotLayer.label = 16;
		shotLayer.name = board.shot;
		shotLayer.startTime = boardTime;
		if (!overlayInfo) shotLayer.transform.position.setValue([width/2,mainItem.height/2]);
		shotLayer.moveToEnd();

		//add dialog
		if (board.dialogue)
		{
			dialogueLayer = shotComp.layers.addText(board.dialogue);
			var textDocument = dialogueLayer.sourceText.value;
			textDocument.resetCharStyle();
			textDocument.resetParagraphStyle();
			textDocument.fontSize = 50;
			textDocument.fillColor = overlayInfo ? [0,0,0] : [1,1,1];
			textDocument.strokeColor = [1,1,1];
			textDocument.strokeWidth = 4;
			textDocument.font = "Arial";
			textDocument.strokeOverFill = false;
			textDocument.applyStroke = overlayInfo;
			textDocument.applyFill = true;
			textDocument.justification = ParagraphJustification.CENTER_JUSTIFY;
			dialogueLayer.sourceText.setValue(textDocument);
			dialogueLayer.name = board.shot + " | Action";
			dialogueLayer.startTime = boardTime;
			dialogueLayer.outPoint = board.duration/1000 + boardTime;
			dialogueLayer.moveBefore(shotLayer);
			dialogueLayer.transform.position.setValue([width/2,height-150]);
		}

		//add action
		if (board.action)
		{
			actionLayer = shotComp.layers.addText(board.action);
			var textDocument = actionLayer.sourceText.value;
			textDocument.resetCharStyle();
			textDocument.resetParagraphStyle();
			textDocument.fontSize = 50;
			textDocument.fillColor = [1,0,0];
			textDocument.strokeColor = [1,1,1];
			textDocument.strokeWidth = 4;
			textDocument.font = "Arial";
			textDocument.strokeOverFill = false;
			textDocument.applyStroke = overlayInfo;
			textDocument.applyFill = true;
			textDocument.justification = ParagraphJustification.CENTER_JUSTIFY;
			actionLayer.sourceText.setValue(textDocument);
			actionLayer.name = board.shot + " | Dialogue";
			actionLayer.startTime = boardTime;
			actionLayer.outPoint = board.duration/1000 + boardTime;
			actionLayer.moveBefore(shotLayer);
			actionLayer.transform.position.setValue([width/2,height-87]);
		}

		//add notes
		if (board.notes)
		{
			notesLayer = shotComp.layers.addText(board.notes);
			var textDocument = notesLayer.sourceText.value;
			textDocument.resetCharStyle();
			textDocument.resetParagraphStyle();
			textDocument.fontSize = 50;
			textDocument.fillColor = [0,1,0];
			textDocument.strokeColor = [1,1,1];
			textDocument.strokeWidth = 4;
			textDocument.font = "Arial";
			textDocument.strokeOverFill = false;
			textDocument.applyStroke = overlayInfo;
			textDocument.applyFill = true;
			textDocument.justification = ParagraphJustification.CENTER_JUSTIFY;
			notesLayer.sourceText.setValue(textDocument);
			notesLayer.name = board.shot + " | Notes";
			notesLayer.startTime = boardTime;
			notesLayer.outPoint = board.duration/1000 + boardTime;
			notesLayer.moveBefore(shotLayer);
			notesLayer.transform.position.setValue([width/2,height-25]);
		}

		//add notes layer
		if (board.layers.notes !== undefined)
		{
			var notesFile = new File(imagesPath + board.layers.notes.url);
			var notesItem = app.project.importFile(new ImportOptions(notesFile));
			notesItem.parentFolder = imageFolder;
			var notesLayer = shotComp.layers.add(notesItem,board.duration/1000);
			notesLayer.label = 14;
			notesLayer.name = board.shot + " | Notes";
			notesLayer.startTime = boardTime;
			if (!overlayInfo) notesLayer.transform.position.setValue([width/2,mainItem.height/2]);
			notesLayer.moveBefore(shotLayer);
		}

		//add reference layer
		if (board.layers.reference !== undefined)
		{
			var referenceFile = new File(imagesPath + board.layers.reference.url);
			var referenceItem = app.project.importFile(new ImportOptions(referenceFile));
			referenceItem.parentFolder = imageFolder;
			var referenceLayer = shotComp.layers.add(referenceItem,board.duration/1000);
			referenceLayer.label = 12;
			referenceLayer.name = board.shot + " | Reference";
			referenceLayer.startTime = boardTime;
			referenceLayer.transform.opacity.setValue(board.layers.reference.opacity*100);
			if (!overlayInfo) referenceLayer.transform.position.setValue([width/2,mainItem.height/2]);
			referenceLayer.moveAfter(shotLayer);
		}

		//set new time
		boardTime = boardTime + board.duration/1000;
	}

	//background
	if (!overlayInfo && i != 0)
	{
		var solid = shotComp.layers.addSolid([0,0,0], "Background", width, 200, 1);
		solid.transform.position.setValue([width/2,height-100]);
		solid.moveToEnd();
	}

	return 1;
}

	//====== EVENTS ===============

	function fileButton_clicked()
	{
		//select file
		var file = File.openDialog("Select the .storyboarder file.","Storyboarder:*.storyboarder,JSON:*.json,All files:*.*",false);
		if (!file) return;

		app.beginUndoGroup("Import Storyboarder file");

		DuAEF.WUStoryboarder.import(file,overlayButton.value,precompButton.value);

		app.endUndoGroup();
	}

	//========= UI ================

	var palette = DuAEF.DuScriptUI.createUI(thisObj,"WUStoryboarder");

	var fileButton = palette.add('button',undefined,"Select .storyboarder file...");
	var overlayButton = palette.add('checkbox',undefined,"Overlay text information");
	var precompButton = palette.add('checkbox',undefined,"Precompose shots");
	precompButton.value = true;

	//=========== CONNECT EVENTS ==========
	fileButton.onClick = fileButton_clicked;

	DuAEF.DuScriptUI.showUI(palette);

})(this);
