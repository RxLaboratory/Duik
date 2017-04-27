/**
 * The whole script is encapsulated to avoid global variables
 * @property {object}	obj		- The 'this' of the script itself, either a ScriptUI Panel or undefined
 */
(function (obj) {
	
	// ============================= INIT =============================================
	
	/**
	 * This block initializes the script
	 */
	{
		var version = "1.0.5";
	}
	
	// ============================= FUNCTIONS ========================================
	
	/**
	 * This block contains all needed functions
	 */
	{
		/**
		 * Detects animation exposure in all precomposition layers inside a given composition
		 * @param {CompItem}	composition		- The composition in which the exposures have to be detected
		 */
		function detectExpoInComp(composition)
		{
			for (var j = 1;j<= composition.numLayers;j++)
			{
				//get layer
				precompLayer = composition.layer(j);
				var comp = precompLayer.source;
				
				//if not a precomp, skip
				if (!(comp instanceof CompItem)) continue;
				
				//add slider
				var slider = precompLayer.Effects.addProperty("ADBE Slider Control");
				slider.name = "Detected Exposure";

				//detect exposure
				for (var i = 1 ; i <= comp.numLayers ; i++)
				{
					var layer = comp.layer(i);
					slider(1).setValueAtTime(precompLayer.startTime + layer.inPoint,layer.inPoint);
					slider(1).setInterpolationTypeAtKey(slider(1).numKeys,KeyframeInterpolationType.HOLD,KeyframeInterpolationType.HOLD);
				}
			}
		}
		
		/**
		 * Sets the blending mode of a layer using the blending mode name from TVPaint
		 * @param {LayerItem}	layer		- The layer
		 * @param {string}		blendName	- The TVPaint blending mode name
		 */
		function layer_setBlendMode(layer,blendName)
		{
			switch (blendName)
			{
				case "Color":
					layer.blendingMode = BlendingMode.NORMAL;
				  break;
				case "Add":
				 layer.blendingMode =  BlendingMode.ADD;
				case "Screen":
				  layer.blendingMode =  BlendingMode.SCREEN;
				  break;
				case "Multiply":
					layer.blendingMode =  BlendingMode.MULTIPLY;
				  break;
				case "Overlay":
				  layer.blendingMode =  BlendingMode.OVERLAY;
				  break;

				default:
				  layer.blendingMode = BlendingMode.NORMAL;
			}			
		}
		
		/**
		 * A filter function to find folders into a File list.
		 * @param {File or Folder}	theFolder	- The File or Folder object to test
		 * @return {bool}	Wether the tested object is a Folder or not
		 */
		function folders_find(theFolder)
		{
			try
			{
				if(theFolder instanceof Folder)
				{
					return true;
				}else{
					return false;
				}
			}catch(e){
				alert(e.line+":"+e.message);
			}
		}

		/**
		 * Gets all the subfolders inside a folder
		 * @param {Folder}	theFolder	- The folder to search in
		 * @return {Array}	The found subfolders
		 */
		function folders_get(theFolder){
			try{
				
				var folderItems = theFolder.getFiles(folders_find);
				return folderItems;
			}catch(e){
				alert(e.line+":"+e.message);
			}
		}
		
		/**
		 * Gets the number of a frame from an image sequence
		 * The number must be right before the extension,
		 * the extension must only be three-character long
		 * TODO reimplement using regular expressions to remove this limitation
		 * @param {string}	path	- The path of the frame
		 */
		function filepath_getNumber(path)
		{
			// TODO Reimplement using regular expressions
			
			var string_noExt = path.substring(0,path.length-4);
			var numberi = 0;
			var namei = 0;
			for(var i = string_noExt.length-1;i>=0;i--)
			{
				if(isNaN(parseInt(string_noExt.charAt(i))))
				{
					numberi = i+1;
					break;
				}
			}
			number = string_noExt.substring(numberi,string_noExt.length);
			return number;
		}
	}
	
	// ============================= UI EVENTS ========================================
	
	/**
	 * This block contains functions connected to UI events
	 */
	{
		/**
		 * Shows a folder selection dialog then launch the import from selected folder
		 */
		function on_btnImport_clicked()
		{
			tvpFile = File.openDialog("Select a PNG from the TVPaint clip export",'PNG files:*.png',false);
			if (!tvpFile) return;
			
			//get path and infos file
			clipFolder = tvpFile.parent.parent;
			clipInfopath= clipFolder.absoluteURI+"/clipinfo.txt";
			clipInfo = new File(clipInfopath);
			
			if (!clipInfo.exists)
			{
				alert("'clipinfo.txt' do not exists in clipfolder. Please re-export from TVPaint");
				return;
			}

			//get infos
			clipInfo.open('r');

			var framerate = clipInfo.readln();
			framerate = framerate.split(";");
			framerate = framerate[1];

			var clipduration = clipInfo.readln();
			clipduration = clipduration.split(";");
			clipduration = clipduration[1];
			
			var bgcolor = clipInfo.readln();
			bgcolor = bgcolor.split(";");
			bgcolor = bgcolor[1];
			bgcolor = bgcolor.split(",");
			bgcolor = new Array(bgcolor[0],bgcolor[1],bgcolor[2]);
			clipInfo.close();
			
			//get layers
			projClipFolder = app.project.items.addFolder(clipFolder.displayName);
			myNewCompositions = new Array();
			var folders = folders_get(clipFolder);
			for(var i = 0; i < folders.length; i++)
			{
				var curLayerFolder = folders[i];
				var folderName = curLayerFolder.displayName;
				var itemArray = curLayerFolder.getFiles("*.png");
				if(itemArray.length > 0)
				{
					itemArray.sort();
				}
				
				projLayerFolder = app.project.items.addFolder(folderName);
				projLayerFolder.parentFolder = projClipFolder;
				projFramesFolder = app.project.items.addFolder(folderName + "_frames");
				projFramesFolder.parentFolder = projLayerFolder;
				
				
				
				//Importing
				var footage = new Array();
				var files = new Array();
				for(var j = 0; j < itemArray.length;j++)
				{
					var curFile = new File(itemArray[j]);
					var ioRef = new ImportOptions(curFile);
					ioRef.importAs = ImportAsType.FOOTAGE;
					var footageRef = app.project.importFile(ioRef);
					footageRef.parentFolder = projFramesFolder;

					footage[j] = footageRef;
				}
				
				// read layerinfo
				layerInfopath= curLayerFolder.absoluteURI+"/layerinfo.txt";
				layerInfo = new File(layerInfopath);

				if (layerInfo.exists)
				{
				   layerInfo.open();

					var layerIN = layerInfo.readln();
					layerIN = layerIN.split(";");
					layerIN = layerIN[1];
					
					 var layerOUT = layerInfo.readln();
					layerOUT = layerOUT.split(";");
					layerOUT = layerOUT[1];
					
					var layerBlendmode = layerInfo.readln();
					layerBlendmode = layerBlendmode.split(";");
					layerBlendmode = layerBlendmode[1];
						
					var layerOpacity = layerInfo.readln();
						layerOpacity = layerOpacity.split(";");
						layerOpacity = layerOpacity[1];
					try
					{							
						var layerLabel = layerInfo.readln();
						layerLabel = layerLabel.split(";");
						layerLabel = layerLabel[1]*1;
					}
					catch(e)
					{
						layerLabel = 0;
					}
					
				 
					layerInfo.close();
				}
				else
				{
					layerIN = 1
					layerOUT = layerIN+clipduration
					layerBlendmode ="COLOR";
				}
				 
				layerDuration = layerOUT-layerIN+1
				layerDuration=layerDuration*(1/framerate)
				  
				//Creating Composition
				curComp = app.project.items.addComp(folderName,footageRef.width,footageRef.height,1,layerDuration,framerate);
				curComp.parentFolder = projLayerFolder;
				var compStats=new Array(curComp,layerIN,layerOUT,layerBlendmode,layerOpacity,layerLabel);
				myNewCompositions.push(compStats);
				
				//Timing layers
				for(k=0;k<footage.length;k++)
				{
					curImage = footage[k];
					path = curImage.file.absoluteURI;
					imageNUM =  filepath_getNumber(path)*1;

					//frame duration
					var imageIN = imageNUM/framerate-layerIN/framerate;

					if(k==footage.length-1)
					{
						var imageDuration =  curComp.duration-imageIN;
					}
					else
					{
						nextImage = footage[k+1];
						path = nextImage.file.absoluteURI;
						nextNUM =  filepath_getNumber(path)*1;
						var deltaFrame = nextNUM-imageNUM;
						var imageDuration = deltaFrame/framerate;
					}

					//finding file
					try
					{
						mylayers = curComp.layers.add(curImage);
						mylayers.inPoint = imageIN;
						mylayers.outPoint = imageIN+imageDuration;
					}
					catch(e)
					{
						alert("Cant Add Frame "+xsht_file+"\nof "+nameMain+"\n Probably because the footage wasnt imported because there is a write failue in the File");
					}
				}
			}
			
			//collect Layers In animation Comp
			var collectComp = app.project.items.addComp(clipFolder.displayName,myNewCompositions[0][0].width,myNewCompositions[0][0].height,1,clipduration/framerate,framerate);
			collectComp.parentFolder = projClipFolder;

			collectComp.bgColor =bgcolor;
			for(var p = myNewCompositions.length;p>0 ;p--)
			{
				var curCompStats = myNewCompositions[p-1];
				var curComp=curCompStats[0];
				var curIN=curCompStats[1];
				var curOUT=curCompStats[2];
				var curBLEND=curCompStats[3];
				var curOPACITY=curCompStats[4];
				var curLABEL=curCompStats[5];
				var curLayer = collectComp.layers.add(curComp);
				layer_setBlendMode(curLayer,curBLEND);
				curLayer.startTime =(curIN-1)/framerate;
				curLayer.opacity.setValue(curOPACITY);

				try
				{
						curLayer.label=curLABEL*1;
				}
				catch(e)
				{
						curLayer.label=15;
				}
			}
		
			detectExpoInComp(collectComp);
		}	
	}

	
	// ============================= UI ===============================================
	
	/**
	 * Constructs and shows the User Interface
	 * @property {object}	thisObj			- The 'this' of the script itself, either a ScriptUI Panel or undefined
	 */
	function UI(thisObj)
	{		
		var  myPal = null;
		thisObj instanceof Panel ? myPal = thisObj : myPal = new Window('palette',"TVPaint Import",undefined, {resizeable:true});
		
		if (myPal == null) throw "Failed to create User Interface.";
		
		// Margins and alignment
		myPal.alignChildren = ['fill','top'];
		myPal.margins = 5;
		myPal.spacing = 2;
		
		var btnImport = myPal.add('button',undefined,"Import");
		btnImport.onClick = on_btnImport_clicked;
		var labelImport = myPal.add('statictext',undefined,"Select a PNG from the TVPaint export to import the corresponding clip in After Effects",{multiline:true});
		labelImport.alignment = ['fill','fill'];
		
		myPal.layout.layout(true);
		myPal.layout.resize();
		myPal.onResizing = myPal.onResize = function () {this.layout.resize();}
		
		// If it's a Window, it needs to be shown
		if (myPal instanceof Window) {
			//ui.center();
			myPal.show();
		}
	}

	// Create UI
	UI(obj);
	
})(this);
