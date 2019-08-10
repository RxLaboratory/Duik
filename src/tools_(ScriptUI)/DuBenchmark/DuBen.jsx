/*
A Benchmark for After Effects
*/

//encapsulate the script in a function to avoid global variables
(function (thisObj) {

	//================
	var version = '1.0.0';
	var scriptName = "DuBenchmark";
	//================

	#include "DuAEF.jsxinc"
	#include "outputModules/outputModules.aep.jsxinc"

	// ============= INIT =====================

	//the timer/debug
	var log = new DebugLog(Folder.myDocuments.absoluteURI + "/DuBen_log.txt",true,DuAEF.Debug.LogLevel.DEBUG,true);

	// the data collected.
	var data = {};
	data.expressions = {};
	data.effects = {};
	data.shapes = {};
	data.script = {};
	data.ui = {};
	data.output = {};

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
	data.numPasses = 2;
	data.gpuTest = true;
	data.lensBlurTest = true;

	//outpoutModules
	DuAEF.DuRenderer.loadOutputModules(DuAEF.DuBinary.toFile(outputModules));

	// ================ FUNCTIONS =============

	//UTILS
	function init()
	{
		data.emptyComp = 0;
		data.renderer = 0;
		data.ux = 0;
		data.reference = 3000;

		data.expressions.total = 0;
		data.expressions.ui = 0;

		data.effects.gaussianBlur = 0;
		data.effects.gaussianBlurGPU = 0;
		data.effects.fastBlur = 0;
		data.effects.lensBlur = 0;
		data.effects.addGrain = 0;
		data.effects.median = 0;
		data.effects.total = 0;

		data.shapes.shapeLayer = 0;
		data.shapes.solid = 0;
		data.shapes.solidCT = 0;
		data.shapes.total = 0;

		data.script.total = 0;
		data.script.compute = 0;
		data.script.ui = 0;

		data.ui.reference = 7000;
		data.ui.total = 0;

		data.output.total = 0;
		data.total = 0;
	}

	function createTestComp(width,height)
	{
		if (typeof width === 'undefined') width = 5000;
		if (typeof height === 'undefined') height = 5000;
		return app.project.items.addComp("duben", width, height, 1, 120, 60);
	}

	function createTestSolid(comp)
	{
		return comp.layers.addSolid([0,0,0], "Layer", 5000, 5000, 1);
	}

	function testEmptyComp()
	{
		var comp = createTestComp();
		data.emptyComp = render(comp,"Empty Comp",1);
	}

	function normalize(value)
	{
		return Math.round(value / data.reference * 100);
	}

	//MAIN
	function render(comp,testName,numFrames)
	{
		if (typeof numFrames === 'undefined') numFrames = 1;

		//add Comp to render queue
		var rqItem = app.project.renderQueue.items.add(comp);
		rqItem.timeSpanStart = comp.duration - (comp.frameDuration*numFrames);
		rqItem.timeSpanDuration = comp.frameDuration*numFrames;
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

		//remove rendered frames
		for (var i = 1, num = numFrames + 1; i <= num; i++)
		{
			var frameNum = comp.duration/comp.frameDuration - i;
			frameNum = DuAEF.DuJS.Number.convertToString(frameNum,5);
			outputFile = new File(Folder.myDocuments.absoluteURI + "/DuBen_renderTest_" + frameNum + ".exr");
			outputFile.remove();
		}

		rqItem.remove();

		return elapsed;
	}

	function textExpressions()
	{
		//create comp
		var comp = createTestComp();
		var layer2 = createTestSolid(comp);
		var layer1 = createTestSolid(comp);

		//test render time
		var total = 0;
		var totalui = 0;
		for (var i = 0; i < data.numPasses; i++)
		{
			log.startTimer("Ae Expressions");

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
				'result += thisComp.layer(1).position.valueAtTime(i*thisComp.frameDuration);\n' +
				'}\n' +
				'}\n' +
				'var testArray = [];\n' +
				'for (var i = 0; i < 100; i++)\n' +
				'{\n' +
				'	var str = "";\n' +
				'	for (var j = 0; j < i; j++)\n' +
				'	{\n' +
				'		str += "a";\n' +
				'	}\n' +
				'	testArray.push(str);\n' +
				'}\n' +
				'for (var i = 0; i < testArray.length; i++)\n' +
				'{\n' +
				'	try\n' +
				'	{\n' +
				'		var val = parseFloat(testArray[i]);\n' +
				'		val = 1 / val;\n' +
				'	}\n' +
				'	catch (e)\n' +
				'	{\n' +
				'		for (var j = 0; j < testArray[i].length; j++)\n' +
				'		{\n' +
				'			Math.round(i/1000);\n' +
				'		}\n' +
				'	}\n' +
				'}\n' +
				'result;';

			var current = log.checkTimer("Ae Expressions");
			totalui += current;

			current += render(comp,"Expressions | Pass " + (i+1)) - data.emptyComp;
			total += current;

			layer1.transform.position.expression = '';
			layer2.transform.position.expression = '';
		}

		data.expressions.total = total/data.numPasses;
		data.expressions.ui = totalui/data.numPasses;
		if (data.expressions.total > 0) data.expressions.total = normalize( data.expressions.total );
		if (data.expressions.ui > 0) data.expressions.ui = normalize( data.expressions.ui );

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
		var numPasses = data.numPasses;
		for (var i = 0; i < numPasses; i++)
		{
			var comp = createTestComp();

			log.startTimer("Ae Shape - Solid");

			var layer = createTestSolid(comp);
			//add mask
			var mask = layer('ADBE Mask Parade').addProperty('ADBE Mask Atom');
			mask.property('ADBE Mask Shape').setValue(shape);
			layer('ADBE Effect Parade').addProperty('ADBE Fill');
			var stroke = layer('ADBE Effect Parade').addProperty('ADBE Stroke');
			stroke('ADBE Stroke-0003').setValue(50);
			layer.transform.scale.setValue([200,200]);
			layer.transform.rotation.setValue(30);

			var current = log.checkTimer("Ae Shape - Solid");
			current += render(comp,"Shape - Solid | Pass " + i,3) - data.emptyComp;
			total += current/3;
			layer.source.remove();
			comp.remove();
		}
		data.shapes.solid = total/data.numPasses;
		if (data.shapes.solid > 0) data.shapes.solid = normalize( data.shapes.solid );

		// SOLID CT
		var total = 0;
		var numPasses = data.numPasses;
		for (var i = 0; i < numPasses; i++)
		{
			var comp = createTestComp();

			log.startTimer("Ae Shape - Solid CT");

			var layer = createTestSolid(comp);
			//add mask
			var mask = layer('ADBE Mask Parade').addProperty('ADBE Mask Atom');
			mask.property('ADBE Mask Shape').setValue(shape);
			layer('ADBE Effect Parade').addProperty('ADBE Fill');
			var stroke = layer('ADBE Effect Parade').addProperty('ADBE Stroke');
			stroke('ADBE Stroke-0003').setValue(50);
			layer.transform.scale.setValue([200,200]);
			layer.transform.rotation.setValue(30);

			layer.collapseTransformation = true;

			var current = log.checkTimer("Ae Shape - Solid CT");
			current += render(comp,"Shape - Solid w/ Collapse Transformation | Pass " + i,3) - data.emptyComp;
			total += current/3;

			layer.source.remove();
			comp.remove();
		}
		data.shapes.solidCT = total/data.numPasses;
		if (data.shapes.solidCT > 0) data.shapes.solidCT = normalize( data.shapes.solidCT );

		//Shape Layer
		var total = 0;
		var numPasses = data.numPasses;
		for (var i = 0; i < numPasses; i++)
		{
			var comp = createTestComp();

			log.startTimer("Ae Shape - Shape Layer");

			var layer = comp.layers.addShape();
			//add mask
			var group = layer('ADBE Root Vectors Group').addProperty('ADBE Vector Group');
			var mask = group.property('ADBE Vectors Group').addProperty('ADBE Vector Shape - Group');
			mask.property('ADBE Vector Shape').setValue(shape);
			group.property('ADBE Vectors Group').addProperty('ADBE Vector Graphic - Fill');
			var stroke = group.property('ADBE Vectors Group').addProperty('ADBE Vector Graphic - Stroke');
			stroke('ADBE Vector Stroke Width').setValue(50);
			layer.transform.scale.setValue([200,200]);
			layer.transform.rotation.setValue(30);

			var current = log.checkTimer("Ae Shape - Shape Layer");
			current += render(comp,"Shape - Shape Layer | Pass " + i,3) - data.emptyComp;
			total += current/3;
			comp.remove();
		}
		data.shapes.shapeLayer =total/data.numPasses;
		if (data.shapes.shapeLayer > 0) data.shapes.shapeLayer = normalize( data.shapes.shapeLayer );

		data.shapes.total = Math.round( (data.shapes.solid + data.shapes.solidCT + data.shapes.shapeLayer)/3 );

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

			var current = render(comp,"Effects - Gaussian Blur | Pass " + i) - data.emptyComp;
			total += current;
			layer.source.remove();
			comp.remove();
		}
		data.effects.gaussianBlur = total/numPasses;
		if (data.effects.gaussianBlur > 0) data.effects.gaussianBlur = normalize( data.effects.gaussianBlur );
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

			var current = render(comp,"Effects - Gaussian Blur GPU | Pass " + i) - data.emptyComp;
			total += current;
			layer.source.remove();
			comp.remove();
		}
		data.effects.gaussianBlurGPU = total/numPasses;
		if (data.effects.gaussianBlurGPU > 0) data.effects.gaussianBlurGPU = normalize( data.effects.gaussianBlurGPU );
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

			var current = render(comp,"Effects - Fast Blur | Pass " + i) - data.emptyComp;
			total += current;
			layer.source.remove();
			comp.remove();
		}
		data.effects.fastBlur = total/numPasses;
		if (data.effects.fastBlur > 0) data.effects.fastBlur = normalize( data.effects.fastBlur );
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

			var current = render(comp,"Effects - Lens Blur | Pass " + i) - data.emptyComp;
			total += current;
			layer.source.remove();
			comp.remove();
		}
		data.effects.lensBlur = total/numPasses;
		if (data.effects.lensBlur > 0) data.effects.lensBlur = normalize( data.effects.lensBlur );
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

			var current = render(comp,"Effects - Add Grain | Pass " + i) - data.emptyComp;
			total += current;
			layer.source.remove();
			comp.remove();
		}
		data.effects.addGrain = total/numPasses;
		if (data.effects.addGrain > 0) data.effects.addGrain = normalize( data.effects.addGrain );
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

			var current = render(comp,"Effects - Median | Pass " + i) - data.emptyComp;
			total += current;
			layer.source.remove();
			comp.remove();
		}
		data.effects.median = total/numPasses;
		if (data.effects.median > 0) data.effects.median = normalize( data.effects.median );
		data.effects.total += data.effects.median;

		//normalize results
		if (data.gpuTest && data.lensBlurTest) data.effects.total = data.effects.total / 6;
		else if (data.lensBlurTest) data.effects.total = data.effects.total / 5;
		else if (data.gpuTest) data.effects.total = data.effects.total / 5;
		else data.effects.total = data.effects.total / 4;
		data.effects.total = Math.round(data.effects.total);

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
		if (data.script.compute > 0) data.script.compute = normalize( data.script.compute );
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
		if (data.script.ui > 0) data.script.ui = normalize( data.script.ui );
		data.script.total += data.script.ui;
		data.script.total = Math.round(data.script.total/2);
	}

	function testUI()
	{
		var shape = new Shape();
		shape.closed = true;
		shape.vertices = [[0,0],[100,0],[100,100],[0,100]];
		shape.inTangents = [[-10,-10],[-10,-10],[-10,-10],[-10,-10]];
		shape.outTangents = [[10,10],[10,10],[10,10],[10,10]];

		log.startTimer("Ae UI");

		//run tests in the viewer

		var comp = createTestComp();
		if (DuAEF.DuAE.App.version >= 11)
		{
			comp.openInViewer();
			app.activeViewer.maximized = false;
		}

		//create one layer
		var l = comp.layers.addShape();
		var group =l("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
		var content = group("ADBE Vectors Group")
		content.addProperty("ADBE Vector Shape - Ellipse");
		content.addProperty("ADBE Vector Graphic - Stroke");

		//and duplicate to get 512 layers.
		//the duplicate command depends a lot on the UI performance
		//as Ae struggles to display the layers' handles.
		for (var i = 0; i < 9; i++)
		{
			DuAEF.DuAE.Comp.selectLayers(comp.layers);
			DuAEF.DuAE.App.duplicate();
		}

		comp.remove();

		data.ui.total = log.checkTimer("Ae UI");
		if (data.ui.total > 0) data.ui.total = normalize( data.ui.total );
	}

	function saveCSV(file)
	{
		var csvString = '"OS" , "' + data.os + '"\n' +
			'"RAM (GB)","N/A"\n' +
			'"CPU","N/A"\n' +
			'"CPU Frequency (GHz)","N/A"\n' +
			'"CPU Cores","N/A"\n' +
			'"GPU","N/A"\n' +
			'"GPU RAM (GB)","N/A"\n' +
			'"After Effects","' + data.ae.versionName + ' (' + data.ae.versionAsFloat + ')"\n' +
			'"ExtendScript Version","' + data.extendScript.version + '"\n' +
			'"",""\n' +
			'"Total Score",' + data.total + '\n' +
			'"",""\n' +
			'"Renderer Score",' + data.renderer + '\n' +
			'"" , ""\n' +
			'"UX/UI Score",' + data.ux + '\n' +
			'"" , ""\n' +
			'"Expressions",' + data.expressions.total + '\n' +
			'"" , ""\n' +
			'"Effects (Total)",' + data.effects.total + '\n' +
			'"Effects (Gaussian Blur)",' + data.effects.gaussianBlur + '\n' +
			'"Effects (Gaussian Blur - GPU)",' + data.effects.gaussianBlurGPU + '\n' +
			'"Effects (Fast Blur)",' + data.effects.fastBlur + '\n' +
			'"Effects (Lens Blur)",' + data.effects.lensBlur + '\n' +
			'"Effects (Add Grain)",' + data.effects.addGrain + '\n' +
			'"Effects (Median)",' + data.effects.median + '\n' +
			'"" , ""\n' +
			'"Shapes (Total)",' + data.shapes.total + '\n' +
			'"Shapes (Solid)",' + data.shapes.solid + '\n' +
			'"Shapes (Solid - Collapse Transformation)",' + data.shapes.solidCT + '\n' +
			'"Shapes (Shape Layer)" , ' + data.shapes.shapeLayer + '\n' +
			'"",""\n' +
			'"Scripts (Total)",' + data.script.total + '\n' +
			'"Scripts (Computation)",' + data.script.compute + '\n' +
			'"Scripts (UI)",' + data.script.ui + '\n' +
			'"",""\n' +
			'"After Effects UI",' + data.ui.total + '\n';

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
		var file = new File(Folder.myDocuments.absoluteURI + "/Ae_benchmark");
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


		var numRendererTests = 0;
		var numUXTests = 0;
		var numTests = 0;

		init();

		testEmptyComp();

		if (expressionsButton.checked)
		{
			textExpressions();
			data.total += data.expressions.total;
			data.renderer += data.expressions.total;
			data.ux += data.expressions.ui;
			numRendererTests++;
			numUXTests++;
			numTests++;
		}
		if (shapesButton.checked)
		{
			testShapes();
			data.total += data.shapes.total;
			data.renderer += data.shapes.total;
			data.ux += data.shapes.total;
			numRendererTests++;
			numUXTests++;
			numTests++;
		}
		if (effectsButton.checked)
		{
			testEffects();
			//twice, as the effects are a big part of the time spent by Ae rendering a frame.
			data.total += data.effects.total*2;
			data.renderer += data.effects.total*2;
			numRendererTests += 2;
			numTests += 2;
		}
		if (scriptsButton.checked)
		{
			testScriptComputing();
			data.total += data.script.total;
			data.ux += data.script.total;
			numUXTests++;
			numTests++;
		}
		if (uiButton.checked)
		{
			testUI();
			//twice, as the ui has a bigger impact
			data.total += data.ui.total*2;
			data.ux += data.ui.total*2;
			numUXTests += 2;
			numTests += 2;
		}

		//normalize results
		data.renderer = Math.round(data.renderer / numRendererTests);
		data.ux = Math.round(data.ux / numUXTests);
		data.total = Math.round(data.total / numTests);

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

	function helpButton_clicked()
	{
		if (!DuAEF.DuAE.App.hasFilesAndNetworkAccess) return;
		if(DuAEF.mac) system.callSystem('open https://github.com/Rainbox-dev/DuAEF_Duik/wiki/Duben');
		else system.callSystem('explorer https://github.com/Rainbox-dev/DuAEF_Duik/wiki/Duben');
	}

	// _______ UI SETUP _______
	var ui = DuAEF.DuScriptUI.createUI(thisObj,scriptName);

	// ============ UI CONTENT =================

	var runButton = DuAEF.DuScriptUI.addImageButton(ui,"Benchmark...",undefined,"Runs a bunch of tests to evaluate this System/Ae performance",undefined);

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
	var helpButton = DuAEF.DuScriptUI.addImageButton(ui,"?",undefined,"Get some help with Duben",undefined);
	helpButton.alignment = ['right','top'];

	//Connect events
	runButton.onClick = runButton_clicked;
	helpButton.onClick = helpButton_clicked;

	//Show UI
	DuAEF.DuScriptUI.showUI(ui);
})(this);
