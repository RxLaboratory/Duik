/*
	DuBinary Extractor
	Small tool to extract converted binary files
	Copyright (c) 2017 Nicolas Dufresne, Rainbox Productions
	https://rainboxprod.coop
*/

(function ()
{
	#include "../libs/DuBinaryLib.jsxinc"

	var file = File.openDialog("Open include file.","Javascript files: *.jsx;*.jsxinc");
	if (!file) return;

	var obj = $.evalFile(file);

	var outputFileName = file.path + '/' + obj.category + '/' + obj.fileName;

	DuBinary.toFile(obj,outputFileName);

})();
