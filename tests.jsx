(function() {

    #include "inc/api_all.jsxinc"
    DuAEF.init("Duik tests", "RxLaboratory", "0.0.0");

    var maskPathExp = ['/*== Duik: Connector ==*/',
	'var ctrlLayer = thisComp.layer("Ctrl |  | Slider");',
	'var ctrlValue = ctrlLayer.effect("Slider")(16);',
	'var ctrlEffect = ctrlLayer.effect("Connector Value");',
	'var ctrlMin = ctrlEffect(2).value;',
	'var ctrlMax = ctrlEffect(3).value;',
	'var ctrlType = ctrlEffect(1).value;',
	'var result = value;',
	'if (numKeys >= 2 && ctrlEffect.active)',
	'{',
	'if (ctrlType == 2) ctrlValue = ctrlValue.speed;',
	'else if (ctrlType == 3) ctrlValue = ctrlValue.velocity;',
	'else ctrlValue = ctrlValue.value;var t = 0;',
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

    var prop = app.project.activeItem.selectedProperties.pop();
    prop = new DuAEProperty(prop);
    //var p = prop.getProperty();
    //var comp = prop.comp;
    //var originalValue = p.valueAtTime(comp.time, false);
   //p.expression = maskPathExp;
    prop.setExpression(maskPathExp, false);
})();


