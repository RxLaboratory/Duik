/*
	DuBinary Converter
  Small tool to convert binary files in a folder (and subfolders) to include files .jsxinc
	Copyright (c) 2017 Nicolas Dufresne, Rainbox Productions
	https://rainboxprod.coop
*/

(function ()
{

  #include "../DuAEF.jsxinc"

  var folder = Folder.selectDialog ("Select Folder");
  if (!folder) return;

  //recursive method to convert all files in a folder (replacing (and ignoring) previous jsxinc files)
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
        if (file.name.lastIndexOf('.jsxinc') == file.name.length - 7) continue;
        var outputFileName = folder.absoluteURI + '/' + file.name + '.jsxinc';
        var category = '';
        if (folder !== f) category = f.name;
        DuAEF.DuBinary.convertToIncludeFile(file,f.name,outputFileName);
      }
    }
  }

  convertFolder(folder);


})();
