/**
 * Pin related tools.
 * @namespace
 * @category Duik
 */
Duik.Pin = {}

/**
 * The shapes/type/icon of the pins
 * @enum {int}
 * @readonly
*/
Duik.Pin.Type = {
    PIN: 1,
	VERTEX: 2,
	TANGENT: 3,
	BEND_PIN: 4,
	ADVANCED_PIN: 5,
	STANDARD: 6
}

/**
	* Creates a stand alone pin in the comp
	* @param {CompItem} [comp=DuAEProject.getActiveComp()] - The containing composition
	* @param {Duik.Pin.Type} [type=Duik.Pin.Type.PIN] - The type
	* @return {ShapeLayer} The pin
*/
Duik.Pin.create = function( comp, type )
{
	comp = def(comp, DuAEProject.getActiveComp());
	if (!comp) return;
	type = def(type, Duik.Pin.Type.PIN);
	
	//create
	var pinLayer = comp.layers.addShape();
    var tag = DuAETag.set( pinLayer );
    DuAETag.addGroup( pinLayer, i18n._p( "duik", "Pin" ), tag );
	if (type == Duik.Pin.Type.TANGENT) DuAETag.addGroup( pinLayer, i18n._p( "duik", "Tangent" ), tag );
    DuAETag.setValue( pinLayer, DuAETag.Key.DUIK_TYPE, Duik.Layer.Type.PIN, tag );
	//add effect
    var effect = Duik.PseudoEffect.PIN.apply( pinLayer );

	function createIcon()
	{
		var iconGroup = pinLayer("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
		iconGroup.name = 'Icon';
		iconGroup.transform.opacity.expression = 'effect("' + effect.name + '")(3).value;';
		iconContent = iconGroup.property("ADBE Vectors Group");

		if (type == Duik.Pin.Type.PIN)
		{
			var shape1 = iconContent.addProperty("ADBE Vector Shape - Group");
			#include "../shapes/pinTop.jsxinc"
			shape1('ADBE Vector Shape').setValue(pinTop);
			var shape2 = iconContent.addProperty("ADBE Vector Shape - Group");
			#include "../shapes/pinNeedle.jsxinc"
			shape2('ADBE Vector Shape').setValue(pinNeedle);
			var fill = iconContent.addProperty("ADBE Vector Graphic - Fill");
			fill("ADBE Vector Fill Color").expression = 'effect("' + effect.name + '")(1).value';

			iconGroup.transform.scale.expression = '[75,75] * effect("' + effect.name + '")(2).value / 100';
		}
		else if (type == Duik.Pin.Type.VERTEX)
		{
			var rect = iconContent.addProperty("ADBE Vector Shape - Rect");
			rect("ADBE Vector Rect Size").expression = '[20,20] * effect("' + effect.name + '")(2).value / 100';
			var stroke = iconContent.addProperty("ADBE Vector Graphic - Stroke");
			stroke.property("Color").expression = 'effect("' + effect.name + '")(1)';
			stroke.property("Stroke Width").setValue(2);

			pinLayer.transform.scale.expression = '[value[0],value[0]];';
			pinLayer.label = 11;
		}
		else if (type == Duik.Pin.Type.TANGENT)
		{
			var circle = iconContent.addProperty("ADBE Vector Shape - Ellipse");
			circle("ADBE Vector Ellipse Size").expression = '[12,12] * effect("' + effect.name + '")(2).value/100';

			var line = iconContent.addProperty("ADBE Vector Shape - Group");
			line('ADBE Vector Shape').expression = "if (active && hasParent) createPath([[0,0], -transform.position], [[0,0],[0,0]], [[0,0],[0,0]], false); else value;";
			var pathStroke = iconContent.addProperty("ADBE Vector Graphic - Stroke");
			pathStroke.property("Color").expression = 'effect("' + effect.name + '")(1)-[0.2,0.2,0.2,0]';
			pathStroke.property("Stroke Width").setValue(2);
			pathStroke.property('Stroke Width').expression = '2 * effect("' + effect.name + '")(2).value/100';
			var fill = iconContent.addProperty("ADBE Vector Graphic - Fill");
			fill("ADBE Vector Fill Color").expression = 'effect("' + effect.name + '")(1)-[0.2,0.2,0.2,0]';

			pinLayer.label = 14;
		}
		else if (type == Duik.Pin.Type.STANDARD)
		{
			var circle = iconContent.addProperty("ADBE Vector Shape - Ellipse");
			circle("ADBE Vector Ellipse Size").expression = '[20,20] * effect("' + effect.name + '")(2).value / 100';
			var stroke = iconContent.addProperty("ADBE Vector Graphic - Stroke");
			stroke.property("Color").expression = 'effect("' + effect.name + '")(1)';
			stroke.property("Stroke Width").expression = '2 * effect("' + effect.name + '")(2).value / 100';
		}
		else if (type == Duik.Pin.Type.BEND_PIN)
		{
			var shape1 = iconContent.addProperty("ADBE Vector Shape - Group");
			#include "../shapes/bendPin.jsxinc"
			shape1('ADBE Vector Shape').setValue(bendPin);
			var fill = iconContent.addProperty("ADBE Vector Graphic - Fill");
			fill("ADBE Vector Fill Color").expression = 'effect("' + effect.name + '")(1).value';

			iconGroup.transform.scale.expression = '[75,75] * effect("' + effect.name + '")(2).value / 100';
		}
		else if (type == Duik.Pin.Type.ADVANCED_PIN)
		{
			var shape1 = iconContent.addProperty("ADBE Vector Shape - Group");
			#include "../shapes/advencedPin.jsxinc"
			shape1('ADBE Vector Shape').setValue(advancedPin);
			var fill = iconContent.addProperty("ADBE Vector Graphic - Fill");
			fill("ADBE Vector Fill Color").expression = 'effect("' + effect.name + '")(1).value';

			iconGroup.transform.scale.expression = '[75,75] * effect("' + effect.name + '")(2).value / 100';
		}
	}

	function createAnchor()
	{
		var anchorGroup = pinLayer("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
		anchorGroup.name = 'Anchor';
		var anchorContent = anchorGroup.property("ADBE Vectors Group");

		var centerCircle = anchorContent.addProperty("ADBE Vector Shape - Ellipse");
		centerCircle("ADBE Vector Ellipse Size").setValue([4,4]);
		var fill = anchorContent.addProperty("ADBE Vector Graphic - Fill");
		fill("ADBE Vector Fill Color").setValue([0,0,0,1]);
	}

	if (type == Duik.Pin.Type.VERTEX) createAnchor();
	createIcon();
	if (type == Duik.Pin.Type.PIN || type == Duik.Pin.Type.BEND_PIN || type == Duik.Pin.Type.ADVANCED_PIN || type == Duik.Pin.Type.STANDARD) createAnchor();

	pinLayer.guideLayer = true;
	pinLayer.quality = LayerQuality.DRAFT;

	effect(1).setValue( DuColor.Color.APP_HIGHLIGHT_COLOR.floatRGBA() );
	return pinLayer;
}

/**
 * Links the property to a pin. This will automatically detect the type of the property to create the corresponding pins.
 * @param {Property|DuAEProperty} prop - The property
 * @param {Boolean} [tangents=true] - True to create pins for the tangents if prop is a Shape
 * @return {ShapeLayer[]} The pins created.
 */
Duik.Pin.add = function ( prop, tangents )
{
	var pins = [];

	tangents = def(tangents, true);

	if (!Object.isValid(prop)) return pins;

	var propInfo = new DuAEProperty(prop);
	var prop = propInfo.getProperty();

	//Check the type of the property to create the bone 
	if (prop.matchName == 'ADBE FreePin3 PosPin Position') return pins; 
	if (prop.matchName == 'ADBE FreePin3 PosPin Rotation') return pins; 
	if (prop.matchName == 'ADBE FreePin3 PosPin Scale') return pins; 

	//Puppet Pin
	if (prop.matchName == 'ADBE FreePin3 PosPin Atom') if (DuAEPuppet.riggable(prop) )
	{
		var pin = Duik.Pin.addPuppetPin( prop );
		if (pin != null) pins.push(pin);
		return pins;
	}

	//Shape
	if (prop.propertyValueType == PropertyValueType.SHAPE)
	{
		if ( DuAE.version.version < 15) return pins;
		return Duik.Pin.rigPath( prop, tangents, true);
	}

	//If not multi-dimensionnal, ignore
	if (prop.propertyValueType != PropertyValueType.TwoD_SPATIAL && prop.propertyValueType != PropertyValueType.ThreeD_SPATIAL && prop.propertyValueType != PropertyValueType.ThreeD  && prop.propertyValueType != PropertyValueType.TwoD)
	{
		return pins;
	}

	//Shape controller Effect
	var parentProp = prop.parentProperty;
	if (parentProp.matchName == Duik.PseudoEffect.PATH_PIN.matchName)
	{
		var pin = Duik.Pin.addShapePin(prop);
		pins.push(pin);
		return pins;
	}

	//Any other multi-dimensionnal property 
	var pin = Duik.Pin.addPositionPin(prop);
	pins.push(pin);
	return pins;
}

/**
	* Links the spatial child properties to pins
	* @param {PropertyGroup|DuAEProperty} prop - The property
	* @param {Boolean} [tangents=true] - True to create pins for the tangents if prop is a Shape
	* @return {ShapeLayer[]} The pins created.
*/
Duik.Pin.addPins = function ( prop, tangents )
{
	var propInfo = new DuAEProperty(prop);
	var p = propInfo.getProperty();

	var pins = [];

	if (p.matchName == 'ADBE FreePin3 PosPin Atom') return Duik.Pin.addPuppetPin(p);
	if (p.matchName == 'ADBE FreePin3 PosPin Position') return pins; 
	if (p.matchName == 'ADBE FreePin3 PosPin Rotation') return pins; 
	if (p.matchName == 'ADBE FreePin3 PosPin Scale') return pins; 

	if (p.propertyType == PropertyType.PROPERTY)
	{
		pins.push(Duik.Pin.add(p,tangents));
	}
	else
	{
		for (var i = 1, num = p.numProperties; i <= num; i++)
		{
			if (Object.isValid(p))
			{
				var subp = p.property(i);
				pins = pins.concat( Duik.Pin.addPins(subp,tangents) );
			}
			p = propInfo.getProperty();
		}
	}
	
	return pins;
}

/**
 * Adds a pin on a puppet pin
 * @param {PropertyGroup} prop - The puppet pin
 * @return {ShapeLayer} The new pin.
*/
Duik.Pin.addPuppetPin = function ( puppetPinProp )
{
	var propInfo = new DuAEProperty( puppetPinProp );
	var prop = propInfo.getProperty();
	if ( !prop ) return null;

	var layer = propInfo.layer;
	var comp = propInfo.comp;

	//check pin type
	var type = Duik.Pin.Type.PIN;
	if ( prop.position )
	{
		if (!prop.position.canSetExpression) type = Duik.Pin.Type.BEND_PIN;
		else if (prop.property('ADBE FreePin3 PosPin Rotation')) { if (prop.property('ADBE FreePin3 PosPin Rotation').canSetExpression) type = Duik.Pin.Type.ADVANCED_PIN; }
	}

	//create pin
	var pin = Duik.Pin.create( comp,  type);
	pin.moveBefore(layer);
	//rename pin
	Duik.Layer.copyAttributes( pin, layer, Duik.Layer.Type.PIN );
	var limbName = Duik.Layer.name( layer );
	if (prop.parentProperty != undefined)  limbName += " - " + prop.name;
	if (limbName.length > 80 && prop.parentProperty != undefined) limbName = prop.name;
	Duik.Layer.setName( limbName, pin );

	//link properties 
	var effect = Duik.Pin.linkPositionToPin(prop.position, pin, false);
	//fix prop
	prop = propInfo.getProperty();

	if (type == Duik.Pin.Type.ADVANCED_PIN || type == Duik.Pin.Type.BEND_PIN)
	{
		if (type == Duik.Pin.Type.BEND_PIN && !effect)
		{
			effect = Duik.Pin.createPinControl( prop.rotation );
			//fix prop
			prop = propInfo.getProperty();
			var layerIndex = Duik.PseudoEffect.POS_PIN.props["Layer"].index;
			effect( layerIndex ).setValue( pin.index );
		}
		
		prop.property('ADBE FreePin3 PosPin Rotation').expression = DuAEExpression.Id.PIN + '\n' +
			'var l = null;\n' +
			'try {l = effect("' + effect.name + '")(1)} catch (e) {};\n' +
			'var result = value;\n' +
			DuAEExpression.Library.get(['isLayerFlipped']) +
			'if (l != null) {\n' +
			'result = result + l.transform.rotation.value;\n' +
			'while(l.hasParent)\n' +
			'{\n' +
			'l = l.parent;\n' +
			'result = result + l.transform.rotation.value;\n' +
			'}\n' +
			'}\n' +
			'if (isLayerFlipped()) result = -result;\n' +
			'result;';
		prop.property('ADBE FreePin3 PosPin Scale').expression = DuAEExpression.Id.PIN + '\n' +
			'var l = null;\n' +
			'function getAverageScale(layer)\n' +
			'{\n' +
			'var s = layer.transform.scale.value;\n' +
			'return (s[0]+s[1])/200;\n' +
			'}\n' +
			'try {l = effect("' + effect.name + '")(1)} catch (e) {};\n' +
			'var result = value;\n' +
			'if (l != null) {\n' +
			'result = result * getAverageScale(l);\n' +
			'while(l.hasParent)\n' +
			'{\n' +
			'l = l.parent;\n' +
			'result = result * getAverageScale(l);\n' +
			'}\n' +
			'}\n' +
			'result;';
	}

	return pin;
}

Duik.Pin.addShapePin = function ( puppetPinProp )
{
	var propInfo = new DuAEProperty( puppetPinProp );
	var prop = propInfo.getProperty();

	var layer = propInfo.layer;
	var comp = propInfo.comp;

	var parentProp = prop.parentProperty;

	//create bone
	var pin;
	var pe = Duik.PseudoEffect.PATH_PIN;
	var p = pe.props;

	if (prop.propertyIndex == p["Tangents"]["In tangent"].index || prop.propertyIndex == p["Tangents"]["Out tangent"].index)
	{
		pin = Duik.Pin.create(comp, Duik.Pin.Type.TANGENT);
	}
	else
	{
		pin = Duik.Pin.create(comp, Duik.Pin.Type.VERTEX);
	}

	//position
	if (layer instanceof ShapeLayer) pin.transform.position.setValue( prop.valueAtTime(0, false) );
	else pin.transform.position.setValue( DuAELayer.getWorldPos( layer, prop.valueAtTime(0, false) ) );

	Duik.Layer.copyAttributes( pin, layer, Duik.Layer.Type.PIN );
	var limbName = Duik.Layer.name( layer );
	limbName += ' - ' + parentProp.name;

	if (prop.propertyIndex == p["Vertex"].index)
	{
		parentProp( p["Control Layers"]["Vertex"].index ).setValue( pin.index );
		Duik.Pin.createPathVertexControl(layer, parentProp.name, true);
		Duik.Layer.setName( limbName, pin );
	}
	else if (prop.propertyIndex == p["Tangents"]["In tangent"].index)
	{
		parentProp( p["Control Layers"]["In Tangent"].index ).setValue( pin.index );
		Duik.Pin.createPathVertexControl(layer, parentProp.name, false, true);
		Duik.Layer.setName( limbName + '_In', pin );
		// Parent
		var vertexLayer = parentProp( p['Control Layers']['Vertex'].index ).value;
		if (vertexLayer > 0) {
			vertexLayer = comp.layer(vertexLayer);
			pin.parent = vertexLayer;
			pin.moveAfter(vertexLayer);
		}	
	}
	else if (prop.propertyIndex == p["Tangents"]["Out tangent"].index)
	{
		parentProp( p["Control Layers"]["Out Tangent"].index ).setValue( pin.index );
		Duik.Pin.createPathVertexControl(layer, parentProp.name, false, false, true);
		Duik.Layer.setName( limbName + '_Out', pin );
		// Parent
		var vertexLayer = parentProp( p['Control Layers']['Vertex'].index ).value;
		if (vertexLayer > 0) {
			vertexLayer = comp.layer(vertexLayer);
			pin.parent = vertexLayer;
			// Check lock effect
			var lockEffect = null;
			var vertexEffects = vertexLayer.property('ADBE Effect Parade');
			for (var j = 1; j <= vertexEffects.numProperties; j++) {
				var fx = vertexEffects.property(j);
				if (fx.matchName == 'ADBE Checkbox Control' && fx.name.indexOf( i18n._("Lock tangents")) >= 0) {
					lockEffect = fx;
					break;
				}
			}
			if (lockEffect)
				pin.transform.position.expression = [ DuAEExpression.Id.PIN,
					'var result = value;',
					'// The parent should be the vertex',
					'if (hasParent) {',
					'	var locked = parent.effect("' + lockEffect.name + '")(1).value;',
					'	// The other pin must be the layer just above',
					'	if (locked && index > 2 && parent.index != index - 1) {',
					'		var other = thisComp.layer(index - 1);',
					'		if (other.hasParent && other.parent.index == parent.index)',
					'			result = -other.transform.position;',
					'	}',
					'}',
					'result;'
					].join('\n');

			// Move after the in tangent if it exists
			var inLayer = parentProp( p['Control Layers']['In Tangent'].index ).value;
			if (inLayer > 0)
				pin.moveAfter( comp.layer(inLayer) );
			else
				pin.moveAfter(vertexLayer);
		}
	}

	return pin;
}

Duik.Pin.addPositionPin = function ( prop )
{
	var propInfo = new DuAEProperty( prop );
	var prop = propInfo.getProperty();

	var layer = propInfo.layer;
	var comp = propInfo.comp;

	var parentProp = prop.parentProperty;

	//create pin
	var pin = Duik.Pin.create(comp, Duik.Pin.Type.STANDARD);
	pin.moveBefore(layer);
	//rename pin
	Duik.Layer.copyAttributes( pin, layer, Duik.Layer.Type.PIN );
	var limbName = Duik.Layer.name( layer );
	if (prop.parentProperty != undefined)  limbName += " - " + prop.parentProperty.name;
	if (limbName.length > 80 && prop.parentProperty != undefined) limbName = prop.parentProperty.name;
	Duik.Layer.setName( limbName, pin );

	//link the property to the bone 
	Duik.Pin.linkPositionToPin(prop, pin, false);

	return pin;
}

//low-level undocumented function
//Creates or gets the existing effect to link a property to a bone.
Duik.Pin.createPinControl = function ( prop )
{
	var propInfo = new DuAEProperty( prop );
	var prop = propInfo.getProperty();

	var name = 'P ~ ' + prop.parentProperty.name + ' - ' + prop.propertyIndex;
	var layer = propInfo.layer;

	//check if an effect already exists
	var effect = null;

	for (var i = 1, n = layer('ADBE Effect Parade').numProperties; i <= n ; i++)
	{
		var fx = layer('ADBE Effect Parade').property(i);
		if (fx.matchName == Duik.PseudoEffect.POS_PIN.matchName && fx.name == name)
		{
			effect = fx;
			break;
		}
	}

	if (effect == null)
	{
		effect = Duik.PseudoEffect.POS_PIN.apply(layer);
		effect.name = name;
	}

	return effect;
}

//low-level undocumented function
//creates an effect to control a shape vertex and tangents
Duik.Pin.createPathVertexControl = function( layer, name, fixVertex, fixIn, fixOut)
{
    fixVertex = def(fixVertex, false);
    fixIn = def(fixIn, false);
    fixOut = def(fixOut, false);

    var vertexLayerIndex = Duik.PseudoEffect.PATH_PIN.props["Control Layers"]["Vertex"].index;
    var inTangentLayerIndex = Duik.PseudoEffect.PATH_PIN.props["Control Layers"]["In Tangent"].index;
    var outTangentLayerIndex = Duik.PseudoEffect.PATH_PIN.props["Control Layers"]["Out Tangent"].index;
    var vertexIndex = Duik.PseudoEffect.PATH_PIN.props["Vertex"].index;
    var inTangentIndex = Duik.PseudoEffect.PATH_PIN.props["Tangents"]["In tangent"].index;
    var outTangentIndex = Duik.PseudoEffect.PATH_PIN.props["Tangents"]["Out tangent"].index;

    var vertexExp = [ DuAEExpression.Id.PIN,
        'var l = null;',
		'try {l = thisProperty.propertyGroup()(' + vertexLayerIndex + ')} catch (e) {};',
		'var result = value;',
		'if (l != null) {',
		'result = l.toWorld(l.anchorPoint);'
    ].join('\n');
	if (!(layer instanceof ShapeLayer)) vertexExp += 'result = fromWorld(result);\n';
	vertexExp +='}\nresult;'

	var inExp = [ DuAEExpression.Id.PIN,
		'var l = null;',
		'var fx = thisProperty.propertyGroup();',
		'var result = value + fx(' + vertexIndex + ');',
		'try {',
		'	l = fx(' + inTangentLayerIndex + ');',
		'	result = l.toWorld(l.anchorPoint);',
		'} catch (e) {};',
		'if (!l) try {',
		'	l = fx(' + vertexLayerIndex + ');',
		'	result = l.toWorld(l.anchorPoint + value);',
		'} catch (e) {};'
	].join('\n');
	if (!(layer instanceof ShapeLayer)) inExp += 'result = fromWorld(result);\n';
	inExp +='\nresult;'

	var outExp = [ DuAEExpression.Id.PIN,
		'var l = null;',
		'var fx = thisProperty.propertyGroup();',
		'var result = value + fx(' + vertexIndex + ');',
		'try {',
		'	l = fx(' + outTangentLayerIndex + ');',
		'	result = l.toWorld(l.anchorPoint);',
		'} catch (e) {};',
		'if (!l) try {',
		'	l = fx(' + vertexLayerIndex + ');',
		'	result = l.toWorld(l.anchorPoint + value);',
		'} catch (e) {};'
    ].join('\n');
	if (!(layer instanceof ShapeLayer)) outExp += 'result = fromWorld(result);\n';
	outExp +='\nresult;';

	//check if an effect already exists
	var effect = null;

	for (var i = 1, n = layer('ADBE Effect Parade').numProperties; i <= n ; i++)
	{
		var fx = layer('ADBE Effect Parade').property(i);
		if (fx.matchName == Duik.PseudoEffect.PATH_PIN.matchName && fx.name == name)
		{
			effect = fx;
			if (fixVertex) effect( vertexIndex ).expression = vertexExp;
			if (fixIn) effect( inTangentIndex ).expression = inExp;
			if (fixOut) effect( outTangentIndex ).expression = outExp;
			break;
		}
	}
	if (effect == null)
	{
		effect =Duik.PseudoEffect.PATH_PIN.apply(layer);
		//expressions
		effect( vertexIndex ).expression = vertexExp;

		effect( inTangentIndex ).expression = inExp;

		effect( outTangentIndex ).expression = outExp;

		effect.name = name;
	}
	return effect;
}

/**
 * Gets a Pin layer in the comp or the selection.
 * @param {CompItem}	comp	- The composition where to get the bones
 * @param {string} name - A name filter
 * @param {Boolean} [selectedOnly=false] - Selected layers only
 * @return {Layer|null}	The pin layer.
 */
Duik.Pin.getByName = function (comp,name,selectedOnly)
{
    selectedOnly = def(selectedOnly, false);

	var layers = [];
	if (selectedOnly) layers = comp.selectedLayers;
	else layers = comp.layers;

	if (layers.length == 0) return null;

	var it = new DuList(layers);

	it.do( function (layer)
	{
		if ( Duik.Layer.isType( layer, Duik.Layer.Type.PIN ) )
		{
			if (name == layer.name) return layer;
		}
	});

	return null;
}

/**
	* Links the path to pins<br />
	* Works with After Effects CC2018 (15.0) and newer only
	* @param {Property|DuAEProperty} prop - The path property
	* @param {bool} [tangents=true] - True to create bones for the tangents
	* @param {bool} [createPinLayers=true] - True to create layers, false to only create a controller effect
	* @return {DuAEProperty[]} The pin effects created.
*/
Duik.Pin.rigPath = function( pathProp, tangents, createPinLayers )
{
    var pins = [];

    tangents = def(tangents, true);
    createPinLayers = def(createPinLayers, true);

    if (DuAE.version.version < 15) return pins;

    // Gets the path
    pathProp = new DuAEProperty( pathProp ).pathProperty();
    if (!pathProp) return pins;
    var prop = pathProp.getProperty();

    var layer = pathProp.layer;
    var comp = pathProp.comp;

    var vertices = pathProp.verticesToComp();
    var inTangents = prop.value.inTangents;
    var outTangents = prop.value.outTangents;

    // Indices of the effect we're going to need
    var vertexLayerIndex = Duik.PseudoEffect.PATH_PIN.props["Control Layers"]["Vertex"].index;
    var inTangentLayerIndex = Duik.PseudoEffect.PATH_PIN.props["Control Layers"]["In Tangent"].index;
    var outTangentLayerIndex = Duik.PseudoEffect.PATH_PIN.props["Control Layers"]["Out Tangent"].index;
    var vertexIndex = Duik.PseudoEffect.PATH_PIN.props["Vertex"].index;
    var inTangentIndex = Duik.PseudoEffect.PATH_PIN.props["Tangents"]["In tangent"].index;
    var outTangentIndex = Duik.PseudoEffect.PATH_PIN.props["Tangents"]["Out tangent"].index;

    // For each vertex
    for (var i = 0, n = vertices.length; i < n; i++)
    {
        var pinName = Duik.Layer.generateName(Duik.Layer.Type.PIN, "", layer.name + " ~ " + prop.parentProperty.name + " ~ " + i);

        // Add effect
        var effectName = Duik.Layer.Type.PIN + ' ~ ' + prop.parentProperty.name + " ~ " + i;
        var effect = Duik.Pin.createPathVertexControl(layer, effectName);
        effect( vertexIndex ).setValue([vertices[i][0],vertices[i][1]]);
		effect( outTangentIndex ).setValue(outTangents[i]);
		effect( inTangentIndex ).setValue(inTangents[i]);

        pins.push( new DuAEProperty(effect) );

        if (createPinLayers)
        {
            var pinLayer = Duik.Pin.getByName( comp, pinName);

            // Create
            if (pinLayer == null)
            {
                pinLayer = Duik.Pin.create( comp, Duik.Pin.Type.VERTEX );
                pinLayer.name = pinName;
				pinLayer.moveBefore(layer);
            }

			// Check if there's a lock tangent effect
			var effects = pinLayer.property('ADBE Effect Parade');
			var lockEffect = null;
			for (var j = 1; j <= effects.numProperties; j++) {
				var fx = effects.property(j);
				if (fx.matchName == 'ADBE Checkbox Control' && fx.name.indexOf( i18n._("Lock tangents")) >= 0) {
					lockEffect = fx;
					break;
				}
			}

			if (lockEffect == null) {
				lockEffect = effects.addProperty('ADBE Checkbox Control');
				lockEffect.name = i18n._("Lock tangents");
				//lockEffect(1).setValue(1);
			}
            
            effect( vertexLayerIndex ).setValue(pinLayer.index);
			pinLayer.position.setValue(vertices[i]);

			if (tangents)
			{
				var pinNameIn = Duik.Layer.generateName(Duik.Layer.Type.PIN, "", layer.name + " ~ " + prop.parentProperty.name + " ~ In_" + i);
				var pinNameOut = Duik.Layer.generateName(Duik.Layer.Type.PIN, "", layer.name + " ~ " + prop.parentProperty.name + " ~ Out_" + i);

				var pinLayerIn = Duik.Pin.getByName(comp,pinNameIn);
				var pinLayerOut = Duik.Pin.getByName(comp,pinNameOut);

				if (pinLayerOut === null)
				{
					var pinLayerOut = Duik.Pin.create(comp, Duik.Pin.Type.TANGENT, true);
					pinLayerOut.parent = pinLayer;
					pinLayerOut.name = pinNameOut;
					pinLayerOut.position.setValue(outTangents[i]);

					// Add the position expression
					pinLayerOut.transform.position.expression = [ DuAEExpression.Id.PIN,
						'var result = value;',
						'// The parent should be the vertex',
						'if (hasParent) {',
						'	var locked = parent.effect("' + lockEffect.name + '")(1).value;',
						'	// The other pin must be the layer just above',
						'	if (locked && index > 2 && parent.index != index - 1) {',
						'		var other = thisComp.layer(index - 1);',
						'		if (other.hasParent && other.parent.index == parent.index)',
						'			result = -other.transform.position;',
						'	}',
						'}',
						'result;'
						].join('\n');
					pinLayerOut.transform.opacity.expression = [ DuAEExpression.Id.PIN,
						'var result = value;',
						'// The parent should be the vertex',
						'if (hasParent) {',
						'	var locked = parent.effect("' + lockEffect.name + '")(1).value;',
						'	// The other pin must be the layer just above',
						'	if (locked && index > 2 && parent.index != index - 1) {',
						'		var other = thisComp.layer(index - 1);',
						'		if (other.hasParent && other.parent.index == parent.index)',
						'			result = 0;',
						'	}',
						'}',
						'result;'
						].join('\n');
				}

				if (pinLayerIn === null)
				{
					var pinLayerIn = Duik.Pin.create(comp, Duik.Pin.Type.TANGENT);
					pinLayerIn.parent = pinLayer;
					pinLayerIn.name = pinNameIn;
					
					pinLayerIn.position.setValue(inTangents[i]);
				}

				pinLayerIn.moveBefore(layer);
				pinLayerOut.moveBefore(layer);
				pinLayer.moveBefore(pinLayerIn);

				effect( inTangentLayerIndex ).setValue(pinLayerIn.index);
				effect( outTangentLayerIndex ).setValue(pinLayerOut.index);
			}
        }
    }

    var exp = "";

	if (layer instanceof ShapeLayer) exp = [ DuAEExpression.Id.PIN,
		'var origPath = thisProperty;',
		'var origPoints = origPath.points();',
		'var origInTang = origPath.inTangents();',
		'var origOutTang = origPath.outTangents();',
		'var closed = origPath.isClosed();',
		'var fxName = "P ~ " + origPath.propertyGroup().name;',
		'var numPoints = 0;',
		DuAEExpression.Library.get(['Matrix','isLayer','getGroupTransformMatrix']),
		'var matrix = getGroupTransformMatrix( thisProperty ).inverse();',
		'',
		'for (var i = 1, num = thisLayer("Effects").numProperties ; i <= num; i++)',
		'{',
		'    var fx = effect(i);',
		'    if (fx.name.indexOf(fxName) == 0)',
		'    {',
		'        origPoints[numPoints] = matrix.applyToPoint( fromWorld(fx( ' + vertexIndex + ' )) );',
		'        origInTang[numPoints] = fx( ' + inTangentIndex + ' )-fx( ' + vertexIndex + ' );',
		'        origOutTang[numPoints] = fx( ' + outTangentIndex + ' )-fx( ' + vertexIndex + ' );',
		'        numPoints++;',
		'    }',
		'}',
		'createPath(origPoints,origInTang,origOutTang,closed);'
	].join('\n');

	else exp = [ DuAEExpression.Id.PIN,
		'var origPath = thisProperty;',
		'var origPoints = origPath.points();',
		'var origInTang = origPath.inTangents();',
		'var origOutTang = origPath.outTangents();',
		'var closed = origPath.isClosed();',
		'var fxName = "P ~ " + origPath.propertyGroup().name;',
		'var numPoints = 0;',
		'for (var i = 1, num = thisLayer("Effects").numProperties ; i <= num; i++)',
		'{',
		'var fx = effect(i);',
		'if (fx.name.indexOf(fxName) == 0)',
		'{',
		'origPoints[numPoints] = fx(' + vertexIndex + ');',
		'origInTang[numPoints] = fx(' + inTangentIndex + ')-fx(1);',
		'origOutTang[numPoints] = fx(' + outTangentIndex + ')-fx(1);',
		'numPoints++;',
		'}',
		'}',
		'createPath(origPoints,origInTang,origOutTang,closed);'
	].join('\n');

	prop.expression = exp;

	return pins;
}

/**
 * Links the path to the given layers.
 * @param {PropertyGroup|DuAEProperty} pathProp The path property (either an "ADBE Vector Shape - Group" or an "ADBE Mask Atom")
 * @param {Layer[]} layers The layers to link
 */
Duik.Pin.linkPathToLayers = function ( pathProp, layers )
{
    // Only >= CC2018
    if ( DuAE.version.version < 15 ) return;

    // Add the controls to the path
    var pins = Duik.Pin.rigPath( pathProp, true, false );

    // The FX indices we're going to need
    var vertexLayerIndex = Duik.PseudoEffect.PATH_PIN.props["Control Layers"]["Vertex"].index;

    // Link the controls to the layers
    for (var i = 0, n = pins.length; i < n; i++ )
    {
        // Finished, we don't have any more layer to link!
        if (layers.length == i) return;

        var fx = pins[i].getProperty();
        fx( vertexLayerIndex ).setValue( layers[i].index );
    }
}

/**
 * Links the puppet pins to the given layers.
 * @param {Property[]|DuAEProperty[]} pins The path property (either an "ADBE FreePin3 PosPin Atom" or an "ADBE FreePin3 PosPin Position")
 * @param {Layer[]} layers The layers to link
 */
Duik.Pin.linkPuppetPinsToLayers = function ( pins, layers )
{
	for (var i = 0, n = pins.length; i < n; i++)
    {
		// Finished, we don't have any more layer to link!
        if (layers.length == i) return;

		var pin = new DuAEProperty( pins[i] );
        var pinProp = pin.getProperty();

		if ( pinProp.matchName == "ADBE FreePin3 PosPin Atom" )
        {
            pinProp = pinProp.property( "ADBE FreePin3 PosPin Position" );
        }

		Duik.Pin.linkPositionToPin( pinProp, layers[i], false );
	}
}

/**
	* Links a spatial property to a layer
	* @param {Property|DuAEProperty} prop - The property to link
	* @param {Layer} boneLayer - The parent layer
	* @param {bool} [keepOffset=true] - True to not move the parent layer to the position of the property
	* @return {PropertyGroup} The effect created to link the bone.
*/
Duik.Pin.linkPositionToPin = function (prop, pinLayer, keepOffset)
{
	var propInfo = new DuAEProperty(prop);
	prop = propInfo.getProperty();
	keepOffset = def(keepOffset, true);

	if (prop.propertyValueType != PropertyValueType.TwoD_SPATIAL && prop.propertyValueType != PropertyValueType.ThreeD_SPATIAL && prop.propertyValueType != PropertyValueType.ThreeD  && prop.propertyValueType != PropertyValueType.TwoD)
	{
		return;
	}

	if (!propInfo.riggable()) return;

	var layer = propInfo.layer;
	var comp = propInfo.comp;

	//add effect
	var effect = Duik.Pin.createPinControl( propInfo );

	//fix property
	prop = propInfo.getProperty();

	var originalPos = DuAELayer.getWorldPos(pinLayer);

	//move the layer to the prop
	if (!keepOffset) DuAELayer.moveLayerToProperty(pinLayer, prop);

	var layerIndex = Duik.PseudoEffect.POS_PIN.props["Layer"].index;
	effect( layerIndex ).setValue( pinLayer.index );

	//build expression
	var dim = propInfo.dimensions();
	var posExp = '';
	if (layer instanceof ShapeLayer)
	{
		posExp = [ DuAEExpression.Id.PIN,
			'var l = null;',
			'try {l = effect("' + effect.name + '")(' + layerIndex + ')} catch (e) {};',
			'var result = value;',
			'if (l != null) {',
			dim == 2 ? 'result = l.toComp(l.anchorPoint);' : 'result = l.toWorld(l.anchorPoint);\n'
		].join('\n');

		if (keepOffset) posExp += 'result = result - ' + originalPos.toSource() + ';\n';

		posExp += '}\nresult;';
	}
	else
	{
		posExp = [ DuAEExpression.Id.PIN,
			'var l = null;',
			'try {l = effect("' + effect.name + '")(' + layerIndex + ')} catch (e) {};',
			'var result = value;',
			'if (l != null) {',
			dim == 2 ? 'result = l.toComp(l.anchorPoint);' : 'result = l.toWorld(l.anchorPoint);\n'
		].join('\n');

		if (keepOffset) posExp += 'result = result - ' + originalPos.toSource() + ';\n';

		posExp += dim == 2 ? 'result = fromComp(result);\n}\nresult;' : 'result = fromWorld(result);\n}\nresult';
	}

	prop.expression = posExp;

	return effect;
}

/**
 * Gets the pins in the comp
 * @param {Boolean} [selectedOnly=true] Whether to get only the selected layers or all of them
 * @param {CompItem} [comp=DuAEProject.getActiveComp()] The comp
 * @returns {ShapeLayer[]} The bones
 */
Duik.Pin.get = function ( selectedOnly, comp )
{
    return Duik.Layer.get( Duik.Layer.Type.PIN, selectedOnly, comp );
}

/**
 * Checks the color of the pin layer
 * @param {Layer} [layer=DuAEComp.getActiveLayer] The layer. If omitted, will check the first selected pin of the current comp
 * @returns {DuColor}
 */
Duik.Pin.color = function( layer )
{
    layer = def(layer, DuAEComp.getActiveLayer());
    if (!layer) return new DuColor();

    if ( !Duik.Layer.isType(layer, Duik.Layer.Type.PIN) ) return new DuColor();

    var colorIndex = Duik.PseudoEffect.PIN.props['Color'].index;

    var effect = layer.effect( Duik.PseudoEffect.PIN.matchName );
    if (!effect) return new DuColor();

    return new DuColor( effect( colorIndex ).value );
}

/**
 * Sets the color of the pin layers
 * @param {DuColor} color The color
 * @param {Layer|LayerCollection|Layer[]|DuList.<Layer>} [layers=DuAEComp.getSelectedLayers()] The layers. If omitted, will use all selected layers in the comp
 * @returns {DuColor}
 */
Duik.Pin.setColor = function( color, layers )
{
    layers = def(layers, DuAEComp.getSelectedLayers());
    layers = new DuList(layers);
    if (layers.length() == 0) return;

    for(var i = 0, n = layers.length(); i < n; i++)
    {
        var layer = layers.at(i);

        if ( !Duik.Layer.isType(layer, Duik.Layer.Type.PIN) ) continue;

        var colorIndex = Duik.PseudoEffect.PIN.props['Color'].index;
        var effect = layer.effect( Duik.PseudoEffect.PIN.matchName );
        if (!effect) continue;
        effect( colorIndex ).setValue( color.floatRGBA() );
    }
}


/**
 * Checks the size of the pin layer
 * @param {Layer} [layer=DuAEComp.getActiveLayer] The layer. If omitted, will check the first selected pin of the current comp
 * @returns {float}
 */
Duik.Pin.size = function( layer )
{
    layer = def(layer, DuAEComp.getActiveLayer());
    if (!layer) return 100;

    if ( !Duik.Layer.isType(layer, Duik.Layer.Type.PIN) ) return 100;

    var sizeIndex = Duik.PseudoEffect.PIN.props['Size'].index;

    var effect = layer.effect( Duik.PseudoEffect.PIN.matchName );
    if (!effect) return 100;

    return effect( sizeIndex ).value;
}

/**
 * Sets the size of the pin layer
 * @param {float} size The size in %.
 * @param {Layer} [layer=DuAEComp.getSelectedLayers()] The layers. If omitted, will use all selected layers in the comp
 */
Duik.Pin.setSize = function( size, layers )
{
    layers = def(layers, DuAEComp.getSelectedLayers());
    if (layers.length == 0) return;

    for(var i = 0, n = layers.length; i < n; i++)
    {
        var layer = layers[i];

        if ( !Duik.Layer.isType(layer, Duik.Layer.Type.PIN) ) continue;

        var sizeIndex = Duik.PseudoEffect.PIN.props['Size'].index;
        var effect = layer.effect( Duik.PseudoEffect.PIN.matchName );
        if (!effect) continue;
        effect( sizeIndex ).setValue( size );
    }
}

/**
 * Checks the opacity of the pin layer
 * @param {Layer} [layer=DuAEComp.getActiveLayer] The layer. If omitted, will check the first selected bone of the current comp
 * @returns {float}
 */
Duik.Pin.opacity = function(layer)
{
	layer = def(layer, DuAEComp.getActiveLayer());
    if (!layer) return 75;

	if ( !Duik.Layer.isType(layer, Duik.Layer.Type.PIN) ) return 75;

	 var opaIndex = Duik.PseudoEffect.PIN.props['Opacity'].index;

    var effect = layer.effect( Duik.PseudoEffect.PIN.matchName );
    if (!effect) return 75;

    return effect( opaIndex ).value;
}

/**
 * Sets the opacity of the pin layer
 * @param {float} opacity The opacity in %.
 * @param {Layer} [layer=DuAEComp.getSelectedLayers()] The layers. If omitted, will use all selected layers in the comp
 * @returns {float}
 */
Duik.Pin.setOpacity = function(opacity, layers)
{
	layers = def(layers, DuAEComp.getSelectedLayers());
    if (layers.length == 0) return;

    for(var i = 0, n = layers.length; i < n; i++)
    {
        var layer = layers[i];

        if ( !Duik.Layer.isType(layer, Duik.Layer.Type.PIN) ) continue;

        var opaIndex = Duik.PseudoEffect.PIN.props['Opacity'].index;
        var effect = layer.effect( Duik.PseudoEffect.PIN.matchName );
        if (!effect) continue;
        effect( opaIndex ).setValue( opacity );
    }
}


/**
 * Sets the side of the layer
 * @param {OCO.Side} side The side
 * @param {Layer[]} [layers=DuAEComp.getSelectedLayers()] The layer. If omitted, will use all selected layers in the comp
 */
Duik.Pin.setSide = function( side, layers )
{
    layers = def( layers, Duik.Pin.get() );
    Duik.Layer.setSide( side, layers );
}

/**
 * Sets the location of the layer
 * @param {OCO.Side} side The side
 * @param {Layer[]} [layers=DuAEComp.getSelectedLayers()] The layers. If omitted, will use all selected layers in the comp
 */
Duik.Pin.setLocation = function( location, layers )
{
    layers = def( layers, Duik.Pin.get() );
    Duik.Layer.setLocation( location, layers );
}

/**
 * Sets the character name of the bone layer
 * @param {string} characterName The character name.
 * @param {Layer} [layer=DuAEComp.getSelectedLayers()] The layers. If omitted, will use all selected layers in the comp
 */
Duik.Pin.setCharacterName = function( characterName, layers )
{
    layers = def( layers, Duik.Pin.get() );
    Duik.Layer.setGroupName( characterName, layers );
}

/**
 * Sets the limb name of the bone layer
 * @param {string} limbName The limb name.
 * @param {Layer} [layer=DuAEComp.getSelectedLayers()] The layers. If omitted, will use all selected layers in the comp
 */
Duik.Pin.setLimbName = function( limbName, layers )
{
    layers = def( layers, Duik.Pin.get() );
    Duik.Layer.setName( limbName, layers );
}
