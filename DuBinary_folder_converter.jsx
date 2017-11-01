/*
	DuBinary Converter
  Small tool to convert binary files in a folder (and subfolders) to include files .jsxinc
	Copyright (c) 2017 Nicolas Dufresne, Rainbox Productions
	https://rainboxprod.coop
*/

(function ()
{

  #include "libs/DuBinaryLib.jsxinc"

  var folder = Folder.selectDialog ("Select Folder");
  if (!folder) return;

  //recursive method to convert all files in a folder
  function convertFolder(f)
  {
    var files = f.getFiles();
    for (var i = 0 ; i < files.length ; i++)
    {
      var file = files[i];
      if (file instanceof Folder)
      {
        convertFolder(file);
      }
      else
      {
        var outputFileName = folder.absoluteURI + '/' + file.name + '.jsxinc';
        var category = '';
        if (folder !== f) category = f.name;
        DuBinary.convertToIncludeFile(file,f.name,outputFileName);
      }
    }
  }

  convertFolder(folder);


})();
