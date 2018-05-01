(function ()
{
	#include "../DuAEF.jsxinc"
	#include "Dutranslator.jsxinc"

	var script = File.openDialog ("Select Script");

	if (!script) return;
	var folder = script.parent.absoluteURI;

	script = script.absoluteURI;
	var paths = DuAEF.DuBinary.parseFilePaths(script);    
	if(paths == 1)
	{
		alert(tr("Unable to open the file {#}", false, script));
		return;
	}
 
    // Remove duplicates
    DuAEF.DuJS.Array.removeDuplicates(paths);
 
	var data = {};
	// Data contains for each real path, the list of original script paths and js var name

	var removedPaths = [];
	for(var i = 0; i < paths.length; ++i)
	{
		var path = paths[i];
		var resolved = path.substring(1, path.length - 1);
		// Relative resolve
		var code = resolved.charCodeAt(0) ;
		if (resolved.charAt(1) != ':'  &&( // E:/
				(code > 47 && code < 58) || // numeric (0-9)
				(code > 64 && code < 91) || // upper alpha (A-Z)
				(code > 96 && code < 123) || // lower alpha (a-z)
				code == 46))  // .git for example
			resolved = DuAEF.DuJS.String.pathJoin([folder, resolved]);
		
		// Checks if exists
		if(!DuAEF.DuJS.Fs.fileExists(resolved))
		{
			removedPaths.push(resolved);
			continue;
		}
		
		// Define var name
		if( !(resolved in data)) 
			data[resolved] = {
				'name': "",
				'originals': []
			};
			
		if (data[resolved]['name'] == "")        
			data[resolved]['name'] = DuAEF.DuJS.Fs.getBasename(resolved);
		
		data[resolved]['originals'] .push(path);
	}
  
    
    if(removedPaths.length > 0) 
		alert(tr("The following paths were removed because they don't exist or can't be opened.") +
			"\n\n" +
			removedPaths.join("\n"));

    // Ui
    var ui = DuAEF.DuScriptUI.createUI(null, "DuBinary Scan Script");
    ui.alignChildren=["fill","top"];
    ui.spacing = 20;

    // Table
    var properties = {
        'multiselect': true,
        'name': 'DuBinaryScanScriptFileList',
        'columnWidths': [500]
    };
	
    var uiPaths = []
    for(var key in data)
    {
		uiPaths.push(key);
    }
    
	var listBox = ui.add("listbox", undefined, uiPaths, properties);
    listBox.alignment = ["fill","fill"];

    // Buttons

    // Cancel
    function cancel()
    {
		ui.hide();
    }


    function processExport(filter)
    {
        var skipFilter = false;
        if (filter === undefined || filter.length == 0) skipFilter = true;

		var outputFolder = Folder.selectDialog();
		if(!outputFolder) return;
		outputFolder = outputFolder.absoluteURI;
		var debug = "";

		var scriptPrefix = "";
		
		for(var resolved in data)
		{
			if(!skipFilter && DuAEF.DuJS.Array.indexOf(filter, resolved) != -1)
				continue;
			var name = DuAEF.DuJS.Fs.getBasename(resolved) + ".jsxinc";
			var path = DuAEF.DuJS.String.pathJoin([outputFolder, name], "/");
			debug += tr("{#} has been exported to {#}", false, [resolved, path]) + "\n";
			scriptPrefix += "#include \"" + name + "\"\n";
			DuAEF.DuBinary.convertToIncludeFile(new File(resolved),  "", path, data[resolved]["name"]);
		}

		// Get content
		var scriptFile = new File(script);
		if(!scriptFile.open('r')) return alert(tr("Unable to open the script file {#} for reading.",
			script));
		var content = scriptFile.read();
		scriptFile.close();

		// Replace paths in content
		
		var replace = "";
		for(var resolved in data)
		{                
				if(DuAEF.DuJS.String.endsWith(resolved, ".png"))
					replace = data[resolved]["name"] + ".binAsString";
				else
					replace = "DuAEF.DuBinary.toFile(" + data[resolved]["name"] + ")";
				for(var i = 0; i < data[resolved]["originals"].length; i++)
				{
					content = content.replace(data[resolved]["originals"][i], replace);
				}
		}
		// Write content

		if(!scriptFile.open('w')) return alert(tr("Unable to open the script file {#} for writting. Be sure that the file is not opened in another application.",
			script));
		if(!scriptFile.write(scriptPrefix + "\n" + content))
			return alert(tr("Unable to write {#} in the file {#}.", false, ["\n\n" + scriptPrefix + "\n\n", script]));
		scriptFile.close();

		// Feedback
		alert(
			tr("Export to {#} finished.", false, outputFolder)+
			'\n\n'+ debug + "\n\n" +
			tr("The script {#} has been updated with following lines:", false, script) +
			"\n\n" + scriptPrefix);
		ui.hide();
     }

    // convert every items
    function convertAll()
    {
		processExport([]);
    }

    // convert selected ones
    function convertSelected()
    {
	    var selectedPaths = [];
		if(listBox.selection === null || listBox.selection.length < 1) return alert(tr("Nothing is selected") + ".\n");
			for (var i = 0 ; i < listBox.selection.length ; i++)
			{
				selectedPaths.push(listBox.selection[i].text);
		    }
			processExport(selectedPaths);
    }


    var convertAllBtn = ui.add("button",undefined, tr("Convert all to Jsxinc"));
    convertAllBtn.alignment  = ["fill", "bottom"];
    convertAllBtn.onClick = convertAll;

    var convertSelectedBtn = ui.add("button",undefined, tr("Convert selected elements to Jsxinc"));
    convertSelectedBtn.alignment  = ["fill", "bottom"];
    convertSelectedBtn.onClick = convertSelected;

    var cancelBtn = ui.add("button",undefined, tr("Cancel"));
    cancelBtn.alignment  = ["fill", "bottom"];
    cancelBtn.onClick = cancel;

     // show
    DuAEF.DuScriptUI.showUI(ui);
})();
