(function translatorImporter()
{
	var script = null;
	
	//======= UTILS ==========
	function arrayRemoveDuplicates (arr)
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
	
	// ESCAPE REGEXP
	function escapeRegExp (string)
	{
		return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
	}
	// REPLACE TEXT
	function replaceAll (string, find, replace, caseSensitive)
	{
		if (caseSensitive == undefined) caseSensitive = true;
		var re = new RegExp(escapeRegExp(find),caseSensitive ? 'g' : 'gi');
		return string.replace(re, replace);
	}
	
	
	//======= FUNCTIONS ======
	function importClicked()
	{
		//get script file
		script = File.openDialog("Please select the script you want to translate");
		if (!script) return;
		
		//get all strings
		var reStrings = /\"([^\"\\]*(?:\\.[^\"\\]*)*?)\"/g;
		script.open("r");
		var scriptString = script.read();
		script.close;
		//find double quotes
		var stringsFound = scriptString.match(reStrings);
		if (!stringsFound)
		{
			alert("No string was found in this script");
			return;
		}
		if (!stringsFound.length)
		{
			alert("No string was found in this script");
			return;
		}
		
		exportButton.enabled = true;
		yesNoGroup.enabled = true;
		importButton.enabled = false;
			
		//remove duplicates & sort
		arrayRemoveDuplicates(stringsFound);
		stringsFound.sort();
		
		//populate table
		for (var i = 1 ; i < stringsFound.length;i++)
		{
			var item = table.add('item','Yes');
			item.subItems[0].text = stringsFound[i];
			//item.subItems[0].text = eval(stringsFound[i]);
		}

	}
	
	function yesClicked()
	{
		for (var i = 0 ; i < table.selection.length ; i++)
		{
			table.selection[i].text = "Yes";
		}
	}
	
	function noClicked()
	{
		for (var i = 0 ; i < table.selection.length ; i++)
		{
			table.selection[i].text = "No";
		}
	}
	
	function doubleClicked()
	{
		table.selection[0].text == "Yes" ? table.selection[0].text = "No" : table.selection[0].text = "Yes";
	}
	
	function exportClicked()
	{
		//construct baseStrings array
		var baseStrings = [];
		for (var i = 0 ; i < table.items.length ; i++)
		{
			var item = table.items[i];
			if (item.text == "Yes")
			{
				baseStrings.push(item.subItems[0].text);
			}
		}
		
		//new file
		var exportFile = new File(script.path + "/" + script.name.substring(0,script.name.lastIndexOf(".")) + "_translations.jsxinc");
		exportFile.open("w");
		
		exportFile.writeln("var Dutranslator = {};");
		exportFile.writeln("Dutranslator.current = '';");
		exportFile.writeln("Dutranslator.languages = [];");	
		exportFile.writeln("Dutranslator.localizedStrings = [];");
		exportFile.writeln("Dutranslator.getAvailable = function () {");
		exportFile.writeln("thisScriptFile = new File($.fileName);");
		exportFile.writeln("thisFolder = new Folder(thisScriptFile.path);");
		exportFile.writeln("thisName = thisScriptFile.name.substring(0,thisScriptFile.name.lastIndexOf('.'));");
		exportFile.writeln("languageFiles = thisFolder.getFiles(thisName + '_*.jsxinc');");
		exportFile.writeln("for (var i = 0 ; i < languageFiles.length ; i++) {");
		exportFile.writeln("$.evalFile(languageFiles[i]);");
		exportFile.writeln("}");
		exportFile.writeln("}");
		exportFile.writeln("Dutranslator.setLanguage = function (languageId) {");
		exportFile.writeln("for (var i = 0 ; i < Dutranslator.languages.length ; i++){");
		exportFile.writeln("if (Dutranslator.languages[i][0] == languageId){");
		exportFile.writeln("Dutranslator.current = languageId;");
		exportFile.writeln("return;");
		exportFile.writeln("}");
		exportFile.writeln("}");
		exportFile.writeln("}");
		exportFile.writeln("function tr(s) {");
		exportFile.writeln("var languageNumber = -1;");
		exportFile.writeln("for (var i = 0 ; i < Dutranslator.languages.length ; i++){");
		exportFile.writeln("if (Dutranslator.languages[i][0] == Dutranslator.current){");
		exportFile.writeln("languageNumber =i;");
		exportFile.writeln("break;");
		exportFile.writeln("}");
		exportFile.writeln("}");
		exportFile.writeln("if (languageNumber < 0) return s;");
		exportFile.writeln("var stringNumber = -1;");
		exportFile.writeln("for (var i = 0 ; i < Dutranslator.baseStrings.length ; i++){");
		exportFile.writeln("if (Dutranslator.baseStrings[i] == s){");
		exportFile.writeln("stringNumber =i;");
		exportFile.writeln("break;");
		exportFile.writeln("}");
		exportFile.writeln("}");
		exportFile.writeln("if (stringNumber < 0) throw 'String to translate not found in base strings';");
		exportFile.writeln("return Dutranslator.languageStrings[languageNumber-1,stringNumber];");
		exportFile.writeln("}");
		
		exportFile.close();

		var backupName = script.name.substring(0,script.name.lastIndexOf(".")) + "_old" + script.name.substring(script.name.lastIndexOf("."));
		
		if (!confirm(exportFile.name + ' correctly written\n\nDo you want to update ' + script.name + '?\nThe original file will be copied as ' + backupName)) return;
		
		//backup script
		script.copy(script.path + "/" + backupName);
		
		//update script
		script.open('r');
		var newString = script.read();
		script.close();
		for (var i = 0 ; i < baseStrings.length ; i++)
		{
			var re = new RegExp("(" + escapeRegExp(baseStrings[i]) + ")",'g');
			newString = newString.replace(re, "tr($1)");
		}
		var scriptString = '#include \'' + exportFile.name + '\'\r\n' + newString;
		
		script.open('w');
		script.write(scriptString);
		script.close();
		palette.hide();
	}
	
	//create window
	var palette = new Window ("dialog", "Dutranslator Importer",undefined, {resizeable:true});
	palette.alignChildren=["fill","top"];
	palette.spacing = 2;
	var importButton = palette.add("button",undefined,"Import Script...");
	importButton.onClick = importClicked;
	var yesNoGroup = palette.add("group");
	yesNoGroup.spacing = 2;
	yesNoGroup.alignChildren=["fill","top"];
	yesNoGroup.enabled = false;
	var yesButton = yesNoGroup.add("button",undefined,"Yes");
	yesButton.onClick = yesClicked;
	var noButton = yesNoGroup.add("button",undefined,"No");
	noButton.onClick = noClicked;
	var table = palette.add("listbox",undefined,"Translations",{multiselect: true, numberOfColumns: 2, showHeaders: true, columnTitles: ['Translate', 'String']});
	table.alignment = ["fill","fill"];
	table.onDoubleClick = doubleClicked;
	var exportButton = palette.add("button",undefined,"Export");
	exportButton.alignment = ["fill","bottom"];
	exportButton.enabled = false;
	exportButton.onClick = exportClicked;
	
	//show table
	palette.layout.layout(true);
	palette.size = [600,900];
	palette.onResizing = palette.onResize = function () {this.layout.resize()};
	palette.show();

})();
