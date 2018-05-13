/*
A Benchmark for After Effects
*/

//encapsulate the script in a function to avoid global variables
(function (thisObj) {

	//================
	var version = '0.0.1';
	var scriptName = "DuBenchmark";
	//================

	#include "DuAEF.jsxinc"
	#include "outputModules/outputModules.aep.jsxinc"

	// ============= INIT =====================

	//the timer/debug
	var log = new DebugLog(Folder.myDocuments.absoluteURI + "/DuBen_log.txt",true,DuAEF.Debug.LogLevel.DEBUG,true);

	// the data collected.
	var data = {};
	data.renderer = 0;
	data.ux = 0;
	data.expressions = {};
	data.expressions.total = 0;
	data.effects = {};
	data.effects.gaussianBlur = 0;
	data.effects.gaussianBlurGPU = 0;
	data.effects.fastBlur = 0;
	data.effects.lensBlur = 0;
	data.effects.addGrain = 0;
	data.effects.median = 0;
	data.effects.total = 0;
	data.shapes = {};
	data.shapes.shapeLayer = 0;
	data.shapes.solid = 0;
	data.shapes.solidCT = 0;
	data.shapes.total = 0;
	data.script = {};
	data.script.total = 0;
	data.script.compute = 0;
	data.script.ui = 0;
	data.ui = {};
	data.ui.total = 0;
	data.output = {};
	data.output.total = 0;
	data.total = 0;

	//versions
	data.ae = {};
	data.ae.versionAsFloat = DuAEF.DuAE.App.version;
	data.ae.versionName = DuAEF.DuAE.App.getAEVersionName();
	data.ae.memory = app.memoryInUse;
	data.os = $.os;
	data.win = DuAEF.win;
	data.mac = DuAEF.mac;
	data.extendScript = {};
	data.extendScript.date = $.buildDate;
	data.extendScript.version = $.version;

	//settings
	data.numPasses = 3;
	data.gpuTest = true;
	data.lensBlurTest = true;

	//outpoutModules
	DuAEF.DuRenderer.loadOutputModules(DuAEF.DuBinary.toFile(outputModules));

	// ================ FUNCTIONS =============
	//UTILS
	function createTestComp(width,height)
	{
		if (typeof width === 'undefined') width = 5000;
		if (typeof height === 'undefined') height = 5000;
		return app.project.items.addComp("duben", width, height, 1, 45, 60);
	}

	function createTestSolid(comp)
	{
		return comp.layers.addSolid([0,0,0], "Layer", 5000, 5000, 1);
	}

	//MAIN
	function render(comp,testName)
	{
		//add Comp to render queue
		var rqItem = app.project.renderQueue.items.add(comp);
		rqItem.timeSpanStart = comp.duration - comp.frameDuration;
		rqItem.timeSpanDuration = comp.frameDuration;
		//set output module
		rqItem.outputModule(1).applyTemplate('DuBen EXR');
		var outputFile = new File(Folder.myDocuments.absoluteURI + "/DuBen_renderTest_[#####].exr");
		rqItem.outputModule(1).file = outputFile;

		//purge cache
		app.purge(PurgeTarget.ALL_CACHES);

		//start timer
		log.startTimer(testName);

		//render frame
		app.project.renderQueue.render();

		//get time
		var elapsed = log.checkTimer(testName);

		var frameNum = comp.duration/comp.frameDuration -2;
		var frameNum2 = comp.duration/comp.frameDuration -1;
		frameNum = DuAEF.DuJS.Number.convertToString(frameNum,5);
		frameNum2 = DuAEF.DuJS.Number.convertToString(frameNum2,5);

		//remove outputmodule, comp and test frame
		outputFile = new File(Folder.myDocuments.absoluteURI + "/DuBen_renderTest_" + frameNum + ".exr");
		outputFile.remove();
		outputFile = new File(Folder.myDocuments.absoluteURI + "/DuBen_renderTest_" + frameNum2 + ".exr");
		outputFile.remove();
		rqItem.remove();

		return elapsed;
	}

	function textExpressions()
	{
		//create comp
		var comp = createTestComp(4,4);
		var layer2 = comp.layers.addSolid([0,0,0], "Layer2", 4, 4, 1);
		var layer1 = comp.layers.addSolid([0,0,0], "Layer1", 4, 4, 1);
		//add expressions
		layer1.transform.position.expression = 'value*time;';
		layer2.transform.position.expression = 'var result = [2,2];\n' +
			'//not optimized loop\n' +
			'for (var i = 0;  i < time/thisComp.frameDuration; i++)\n' +
			'{\n' +
			'//failing try catch\n' +
			'try { fail } catch (e)\n' +
			'{\n' +
			'//compute using previous frame value on other layer\n' +
			'result += thisComp.layer("Layer1").position.valueAtTime(i*thisComp.frameDuration);\n' +
			'}\n' +
			'}\n' +
			'result;';

		//test render time
		var total = 0;
		for (var i = 0; i < data.numPasses; i++)
		{
			total += render(comp,"Expressions | Pass " + (i+1));
		}

		data.expressions.total = Math.round(total/data.numPasses);
		data.total += data.expressions.total;
		data.renderer += data.expressions.total;

		layer1.source.remove();
		layer2.source.remove();
		comp.remove();
	}

	function testShapes()
	{
		var shape = new Shape();
		shape.closed = true;
		shape.vertices = [[0,0],[100,0],[100,100],[0,100]];
		shape.inTangents = [[-10,-10],[-10,-10],[-10,-10],[-10,-10]];
		shape.outTangents = [[10,10],[10,10],[10,10],[10,10]];

		// SOLID
		var total = 0;
		var numPasses = data.numPasses+1;
		for (var i = 0; i < numPasses; i++)
		{
			var comp = createTestComp();
			var layer = createTestSolid(comp);
			//add mask
			var mask = layer('ADBE Mask Parade').addProperty('ADBE Mask Atom');
			mask.property('ADBE Mask Shape').setValue(shape);
			layer('ADBE Effect Parade').addProperty('ADBE Fill');
			var stroke = layer('ADBE Effect Parade').addProperty('ADBE Stroke');
			stroke('ADBE Stroke-0003').setValue(100);
			layer.transform.scale.setValue([200,200]);
			layer.transform.rotation.setValue(30);

			var current = render(comp,"Shape - Solid | Pass " + i);
			total += current;
			layer.source.remove();
			comp.remove();
		}
		data.shapes.solid = Math.round(total/data.numPasses);

		// SOLID CT
		var total = 0;
		var numPasses = data.numPasses+1;
		for (var i = 0; i < numPasses; i++)
		{
			var comp = createTestComp();
			var layer = createTestSolid(comp);
			//add mask
			var mask = layer('ADBE Mask Parade').addProperty('ADBE Mask Atom');
			mask.property('ADBE Mask Shape').setValue(shape);
			layer('ADBE Effect Parade').addProperty('ADBE Fill');
			var stroke = layer('ADBE Effect Parade').addProperty('ADBE Stroke');
			stroke('ADBE Stroke-0003').setValue(100);
			layer.transform.scale.setValue([200,200]);
			layer.transform.rotation.setValue(30);

			layer.collapseTransformation = true;

			var current = render(comp,"Shape - Solid w/ Collapse Transformation | Pass " + i);
			total += current;

			layer.source.remove();
			comp.remove();
		}
		data.shapes.solidCT = Math.round(total/data.numPasses);

		//Shape Layer
		var total = 0;
		var numPasses = data.numPasses+1;
		for (var i = 0; i < numPasses; i++)
		{
			var comp = createTestComp();
			var layer = comp.layers.addShape();
			//add mask
			var group = layer('ADBE Root Vectors Group').addProperty('ADBE Vector Group');
			var mask = group.property('ADBE Vectors Group').addProperty('ADBE Vector Shape - Group');
			mask.property('ADBE Vector Shape').setValue(shape);
			group.property('ADBE Vectors Group').addProperty('ADBE Vector Graphic - Fill');
			var stroke = group.property('ADBE Vectors Group').addProperty('ADBE Vector Graphic - Stroke');
			stroke('ADBE Vector Stroke Width').setValue(100);
			layer.transform.scale.setValue([200,200]);
			layer.transform.rotation.setValue(30);

			var current = render(comp,"Shape - Shape Layer | Pass " + i);
			total += current;
			comp.remove();
		}
		data.shapes.shapeLayer = Math.round(total/data.numPasses);

		data.shapes.total = data.shapes.solid + data.shapes.solidCT + data.shapes.shapeLayer;
		data.total += data.shapes.total;
		data.renderer += data.shapes.total;
		data.ux += data.shapes.total;
	}

	function testEffects()
	{
		// Gaussian Blur
		var total = 0;
		var numPasses = data.numPasses+1;
		for (var i = 0; i < numPasses; i++)
		{
			var comp = createTestComp();
			var layer = createTestSolid(comp);
			//add effect
			var fx = layer('ADBE Effect Parade').addProperty('ADBE Gaussian Blur');
			fx('ADBE Gaussian Blur-0001').setValue(1000);

			var current = render(comp,"Effects - Gaussian Blur | Pass " + i);
			total += current;
			layer.source.remove();
			comp.remove();
		}
		data.effects.gaussianBlur = Math.round(total/data.numPasses);
		data.effects.total += data.effects.gaussianBlur;

		// Gaussian Blur (GPU)
		var total = 0;
		var numPasses = data.numPasses+1;
		for (var i = 0; i < numPasses; i++)
		{
			var comp = createTestComp();
			var layer = createTestSolid(comp);
			//add effect
			if (!layer('ADBE Effect Parade').canAddProperty('ADBE Gaussian Blur 2'))
			{
				data.gpuTest = false;
				break;
			}
			data.gpuTest = true;
			var fx = layer('ADBE Effect Parade').addProperty('ADBE Gaussian Blur 2');
			fx('ADBE Gaussian Blur 2-0001').setValue(1000);

			var current = render(comp,"Effects - Gaussian Blur GPU | Pass " + i);
			total += current;
			layer.source.remove();
			comp.remove();
		}
		data.effects.gaussianBlurGPU = Math.round(total/data.numPasses);
		data.effects.total += data.effects.gaussianBlurGPU;

		// Fast Blur
		var total = 0;
		var numPasses = data.numPasses+1;
		for (var i = 0; i < numPasses; i++)
		{
			var comp = createTestComp();
			var layer = createTestSolid(comp);
			//add effect
			var fx = layer('ADBE Effect Parade').addProperty('ADBE Fast Blur');
			fx('ADBE Fast Blur-0001').setValue(1000);

			var current = render(comp,"Effects - Fast Blur | Pass " + i);
			total += current;
			layer.source.remove();
			comp.remove();
		}
		data.effects.fastBlur = Math.round(total/data.numPasses);
		data.effects.total += data.effects.fastBlur;

		// Lens Blur
		var total = 0;
		var numPasses = data.numPasses+1;
		for (var i = 0; i < numPasses; i++)
		{
			var comp = createTestComp();
			var layer = createTestSolid(comp);
			//add effect
			if (!layer('ADBE Effect Parade').canAddProperty('ADBE Camera Lens Blur'))
			{
				data.lensBlurTest = false;
				break;
			}
			data.lensBlurTest = true;
			var fx = layer('ADBE Effect Parade').addProperty('ADBE Camera Lens Blur');
			fx('ADBE Camera Lens Blur-0001').setValue(20);

			var current = render(comp,"Effects - Lens Blur | Pass " + i);
			total += current;
			layer.source.remove();
			comp.remove();
		}
		data.effects.lensBlur = Math.round(total/data.numPasses);
		data.effects.total += data.effects.lensBlur;

		// Add Grain
		var total = 0;
		var numPasses = data.numPasses+1;
		for (var i = 0; i < numPasses; i++)
		{
			var comp = createTestComp();
			var layer = createTestSolid(comp);
			//add effect
			var fx = layer('ADBE Effect Parade').addProperty('VISINF Grain Implant');

			var current = render(comp,"Effects - Add Grain | Pass " + i);
			total += current;
			layer.source.remove();
			comp.remove();
		}
		data.effects.addGrain = Math.round(total/data.numPasses);
		data.effects.total += data.effects.addGrain;

		// median
		var total = 0;
		var numPasses = data.numPasses+1;
		for (var i = 0; i < numPasses; i++)
		{
			var comp = createTestComp();
			var layer = createTestSolid(comp);
			//add effect
			var fx = layer('ADBE Effect Parade').addProperty('ADBE Median');
			fx('ADBE Median-0001').setValue(5);

			var current = render(comp,"Effects - Median | Pass " + i);
			total += current;
			layer.source.remove();
			comp.remove();
		}
		data.effects.median = Math.round(total/data.numPasses);
		data.effects.total += data.effects.median;

		//normalize results
		if (data.gpuTest && data.lensBlurTest) data.effects.total = data.effects.total / 5;
		else if (data.gpuTest || data.lensBlurTest) data.effects.total = data.effects.total / 4;
		else data.effects.total = data.effects.total / 3;

		data.total += data.effects.total;
		data.renderer += data.effects.total;
	}

	function testScriptComputing()
	{
		log.startTimer("Script Computing");

		//create array
		var testArray = [];
		for (var i = 0; i < 2000; i++)
		{
			var str = '';
			for (var j = 0; j < i; j++)
			{
				str += 'a';
			}
			testArray.push(str);
		}
		for (var i = 0; i < testArray.length; i++)
		{
			try
			{
				var val = parseFloat(testArray[i]);
				val = 1 / val;
			}
			catch (e)
			{
				for (var j = 0; j < testArray[i].length; j++)
				{
					Math.round(i/1000);
				}
			}
		}

		data.script.compute = log.checkTimer("Script Computing");
		data.script.total += data.script.compute;

		log.startTimer("ScriptUI");

		//Create window
		var testUI = DuAEF.DuScriptUI.createUI(undefined, "Script UI Test");
		var testGroup = DuAEF.DuScriptUI.addGroup(testUI);
		testGroup.orientation = 'stack';
		//add controls
		for (var i = 0; i < 300; i++)
		{
			var group = DuAEF.DuScriptUI.addGroup(testGroup);
			var btn = DuAEF.DuScriptUI.addImageCheckBox(group,'btn');
			btn.enabled = false;
		}
		var closeBtn = testUI.add('button',undefined,"Close");
		closeBtn.onClick = function() { testUI.hide(); };

		DuAEF.DuScriptUI.showUI(testUI);
		testUI.hide();
		delete testUI;

		data.script.ui = log.checkTimer("Script UI");
		data.script.total += data.script.ui;
		data.total += data.script.total;
		data.ux += data.script.total;
	}

	function testUI()
	{
		var shape = new Shape();
		shape.closed = true;
		shape.vertices = [[0,0],[100,0],[100,100],[0,100]];
		shape.inTangents = [[-10,-10],[-10,-10],[-10,-10],[-10,-10]];
		shape.outTangents = [[10,10],[10,10],[10,10],[10,10]];

		log.startTimer("Ae UI");

		var comp = createTestComp();
		comp.openInViewer();
		app.activeViewer.maximized = false;
		for (var i = 0; i < 25; i++)
		{
			var l = comp.layers.addShape();
			var group =l("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
			var content = group("ADBE Vectors Group")
			content.addProperty("ADBE Vector Shape - Ellipse");
			content.addProperty("ADBE Vector Graphic - Stroke");
		}
		comp.remove();

		DuAEF.DuAE.Project.setProgressMode(true);

		var comp = createTestComp();
		for (var i = 0; i < 25; i++)
		{
			var l = comp.layers.addShape();
			var group =l("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
			var content = group("ADBE Vectors Group")
			content.addProperty("ADBE Vector Shape - Ellipse");
			content.addProperty("ADBE Vector Graphic - Stroke");
		}
		comp.remove();

		DuAEF.DuAE.Project.setProgressMode(false);

		data.ui.total = log.checkTimer("Ae UI");
		data.total += data.ui.total;
		data.ux += data.ui.total;
	}

	function saveCSV(file)
	{
		var csvString = '"OS" , "' + data.os + '"\n' +
			'"RAM" , "N/A"\n' +
			'"CPU" , "N/A"\n' +
			'"CPU Frequency" , "N/A"\n' +
			'"CPU Cores" , "N/A"\n' +
			'"GPU" , "N/A"\n' +
			'"GPU RAM" , "N/A"\n' +
			'"After Effects", "' + data.ae.versionName + ' (' + data.ae.versionAsFloat + ')"\n' +
			'"ExtendScript Version" , "' + data.extendScript.version + '"\n' +
			'"" , ""\n' +
			'"Total Score" , ' + data.total + '\n' +
			'"" , ""\n' +
			'"Renderer Score" , ' + data.renderer + '\n' +
			'"" , ""\n' +
			'"UX/UI Score" , ' + data.ux + '\n' +
			'"" , ""\n' +
			'"Expressions" , ' + data.expressions.total + '\n' +
			'"" , ""\n' +
			'"Effects (Total)" , ' + data.effects.total + '\n' +
			'"Effects (Gaussian Blur)" , ' + data.effects.gaussianBlur + '\n' +
			'"Effects (Gaussian Blur - GPU)" , ' + data.effects.gaussianBlurGPU + '\n' +
			'"Effects (Fast Blur)" , ' + data.effects.fastBlur + '\n' +
			'"Effects (Lens Blur)" , ' + data.effects.lensBlur + '\n' +
			'"Effects (Add Grain)" , ' + data.effects.addGrain + '\n' +
			'"Effects (Median)" , ' + data.effects.median + '\n' +
			'"" , ""\n' +
			'"Shapes (Total)" , ' + data.shapes.total + '\n' +
			'"Shapes (Solid)" , ' + data.shapes.solid + '\n' +
			'"Shapes (Solid - Collapse Transformation)" , ' + data.shapes.solidCT + '\n' +
			'"Shapes (Shape Layer)" , ' + data.shapes.shapeLayer + '\n' +
			'"" , ""\n' +
			'"Scripts (Total)" , ' + data.script.total + '\n' +
			'"Scripts (Computation)" , ' + data.script.compute + '\n' +
			'"Scripts (UI)" , ' + data.script.ui + '\n' +
			'"" , ""\n' +
			'"After Effects UI" , ' + data.ui.total + '\n';

		if (file.open('w'))
		{
			file.write(csvString);
			file.close();
		}
	}

	//UI EVENTS
	function runButton_clicked()
	{
		//ask for a file where to save results
		var file = new File(Folder.myDocuments.absoluteURI + "/Ae_benchmark.json");
		file = file.saveDlg("Where do you want to save the results?","CSV:*.csv,Json:*.json");
		if (file == null) return;

		if (DuAEF.DuJS.String.endsWith(file.absoluteURI,'.json'))
		{
			log.file = new File(file.absoluteURI.replace('.json','_log.txt'));
		}
		else
		{
			log.file = new File(file.absoluteURI.replace('.csv','_log.txt'));
		}

		if (log.file.open('w'))
		{
			log.file.write('');
			log.file.close;
		}

		app.project.close(CloseOptions.PROMPT_TO_SAVE_CHANGES);

		//set to 32bpc and linear blending
		app.project.bitsPerChannel = 32;
		app.project.linearBlending = true;

		//purge disk cache
		app.executeCommand(10200);

		//set num passes
		var numPasses = parseInt(passesEdit.text);
		if (isNaN(numPasses)) numPasses = 1;
		data.numPasses = numPasses;

		if (expressionsButton.checked) textExpressions();
		if (shapesButton.checked) testShapes();
		if (effectsButton.checked) testEffects();
		if (scriptsButton.checked) testScriptComputing();
		if (uiButton.checked) testUI();

		app.project.close(CloseOptions.DO_NOT_SAVE_CHANGES);

		if (DuAEF.DuJS.String.endsWith(file.absoluteURI,'.json'))
		{
			DuAEF.DuJS.Fs.saveJSON(data,file);
		}
		else
		{
			saveCSV(file);
		}
	}

	// _______ UI SETUP _______
	var ui = DuAEF.DuScriptUI.createUI(thisObj,scriptName);

	// ============ UI CONTENT =================

	var runButton = DuAEF.DuScriptUI.addImageButton(ui,"Run Benchmark...",undefined,"Runs a bunch of tests to evaluate this System/Ae performance",undefined);

	//options
	var expressionsButton = DuAEF.DuScriptUI.addImageCheckBox(ui,"Expressions",undefined,"Tests expressions performance",undefined);
	var shapesButton = DuAEF.DuScriptUI.addImageCheckBox(ui,"Shapes",undefined,"Tests shapes performance",undefined);
	var effectsButton = DuAEF.DuScriptUI.addImageCheckBox(ui,"Effects",undefined,"Tests effects performance",undefined);
	var scriptsButton = DuAEF.DuScriptUI.addImageCheckBox(ui,"Scripts",undefined,"Tests scripts performance",undefined);
	var uiButton = DuAEF.DuScriptUI.addImageCheckBox(ui,"After Effects UI",undefined,"Tests the performance of the user interface of After Effects",undefined);
	expressionsButton.setChecked(true);
	shapesButton.setChecked(true);
	effectsButton.setChecked(true);
	scriptsButton.setChecked(true);
	uiButton.setChecked(true);
	var passesEdit = DuAEF.DuScriptUI.addNiceEditText(ui,"3","Run "," passes","1");

	//Connect events
	runButton.onClick = runButton_clicked;

	//Show UI
	DuAEF.DuScriptUI.showUI(ui);
})(this);
