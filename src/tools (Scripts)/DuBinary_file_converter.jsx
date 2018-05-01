/*
	DuBinary Converter
  Small tool to convert binary files in a folder (and subfolders) to include files .jsxinc
	Copyright (c) 2017 Nicolas Dufresne, Rainbox Productions
	https://rainboxprod.coop
*/

(function ()
{

  #include "../DuAEF.jsxinc"

  var file = File.openDialog ("Select File(s)",undefined,true);
  if (!file) return;

for (var i = 0 ; i < file.length ; i++)
{
DuAEF.DuBinary.convertToIncludeFile(file[i]);
}


})();
