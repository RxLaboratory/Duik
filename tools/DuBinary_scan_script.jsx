(function ()
{
	#include "../DuAEF.jsxinc"
	#include "Dutranslator.jsxinc"

     var script = File.openDialog ("Select Script");
     if (!script) return;
     script = script.absoluteURI;
     paths = DuAEF.DuBinary.parseFilePaths(script);
     if(paths == 1)
     {
        alert(tr("Unable to open the file {#}", false, script));
        return;
     }

     // Remove duplicates
     DuAEF.DuJS.Array.removeDuplicates(paths);

     var newPaths = [];
     var removedPaths = [];
     while(paths.length > 0)
     {
         var p = paths.pop();
         if(DuAEF.DuJS.Fs.fileExists(p))
             newPaths.push(p);
         else
            removedPaths.push(p);
     }
     if(removedPaths.length > 0) alert(tr("The following paths were removed because they don't exist or can't be opened.") + "\n\n" +
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
     var listBox = ui.add("listbox", undefined, newPaths, properties);
     listBox.alignment = ["fill","fill"];

    // Buttons

     // Cancel
     function cancel()
     {
            ui.hide();
     }


     function processExport(pathList)
     {
            var outputFolder = Folder.selectDialog();
            if(!outputFolder) return;
            outputFolder = outputFolder.absoluteURI;
            var debug = "";

            var scriptPrefix = "";

            for(var i = 0; i < pathList.length; ++i)
            {
                    var name = DuAEF.DuJS.Fs.getBasename(pathList[i]) + ".jsxinc";
                    var path = DuAEF.DuJS.String.pathJoin([outputFolder, name], "/");
                    debug += tr("{#} has been exported to {#}", false, [pathList[i], path]) + "\n";
                    scriptPrefix += "#include \"" + name + "\"\n";
                    DuAEF.DuBinary.convertToIncludeFile(new File(pathList[i]),  "", path);
            }

            // Get content
            var scriptFile = new File(script);
            if(!scriptFile.open('r')) return alert(tr("Unable to open the script file {#} for reading.",
                script));
            var content = scriptFile.read();
            scriptFile.close();

            // Replace paths in content
            /*
                var replacements = {};
                for(var i = 0; i < pathList.length; ++i)
                {
                        if(DuAEF.DuJS.String.endsWith(pathList[i], ".png"))
                            replacements[pathList[i]] = convertedName + "binAsString";
                        else
                            replacements[pathList[i]] = "DuAEF.DuBinary.toFile(" + convertedName + ")";
                }
                */
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
                 processExport(newPaths);
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
