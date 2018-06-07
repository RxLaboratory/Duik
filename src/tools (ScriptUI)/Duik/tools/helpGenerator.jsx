/**
This small script is used to generate the help strings used in the contextual help of Duik based on the files found in the 'help' folder.
It will overwrite the file Duik16_helpStrings.jsxinc.
Each file will be converted to a string, stored in a variable named after the filename + "Help" which can then be used in the source of Duik.
*/

(function()
{
	function getFileString(file)
	{
		var data = '';
		if (!file.open('r')) return data;
		data = file.read();
		file.close();
		//stringify
		//remove (starting and trailing whitespaces, and carriage returns
		data = data.replace(/^\s+|\r+|\s+$/g,'');
		//quotes
		data = data.replace(/"/g,'\\"');
		//line feeds
		data = data.replace(/\n/g,'\\n');

		data = '"' + data + '"';

		return data;
	}

	function isFolder(file)
	{
		return file instanceof Folder;
	}

	function isFile(file)
	{
		return file instanceof File;
	}

	var scriptFolder = new File($.fileName).parent.parent;
	var helpFolder = new Folder(scriptFolder.absoluteURI + '/help');
	var helpContent = helpFolder.getFiles(isFolder);

	var data = '';

	for (var i = 0, num = helpContent.length; i < num; i++)
	{
		var folder = helpContent[i];
		data += '// ==== ' + folder.name + ' ====\n\n';
		var files = folder.getFiles(isFile);
		for (var j = 0, numJ = files.length; j < numJ; j++)
		{
			var file = files[j];
			var re = /-/g;
			var varName = file.name.replace(re,'');
			data += 'var ' + varName + 'Help = ';
			data += getFileString(file);
			data += ';\n';
			data += 'var ' + varName + 'Link = "https://github.com/Rainbox-dev/DuAEF_Duik/wiki/' + file.name + '"\n\n';
		}
	}

	//write data

	var helpFile = new File(scriptFolder.absoluteURI + '/Duik16_helpStrings.jsxinc');
	helpFile.encoding = 'UTF-8';
	if (!helpFile.open('w'))
	{
		alert("Couldn't open helpStrings file.");
		return;
	}
	helpFile.write(data);
	helpFile.close();

	alert("helpStrings file correctly generated");
})();
