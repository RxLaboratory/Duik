(function ()
{
    //get the jsx
    var jsxFile = File.openDialog("Select the jsx file to build","ExtendScript: *.jsx;*.jsxinc,JavaScript: *.js,Text Files: *.txt,All Files: *.*",false);
    if (!jsxFile) return;
    jsxPath = jsxFile.path;
    
    //load file
    jsxFile.open('r');
    var jsx = jsxFile.read();
    jsxFile.close();
    
    //replace #include
    var includeIndex = jsx.indexOf("#include");
    while (includeIndex >=0)
    {
        //get include line
        var includeLine = jsx.substring(includeIndex,jsx.indexOf("\n",includeIndex+1));
        //get the script included
        var includeScriptName = includeLine.replace("#include","");
        //remove spaces
        while (includeScriptName.indexOf(" ") == 0)
        {
            includeScriptName = includeScriptName.substr(1);
        }
        //remove tabs
        while (includeScriptName.indexOf("\t") == 0)
        {
            includeScriptName = includeScriptName.substr(1);
        }
        
        //replace include
        includeScriptFile = new File(jsxPath + "/" + includeScriptName);
        if (!includeScriptFile.exists)
        {
                includeScriptFile = File.openDialog("Please select " + includeScriptName,"ExtendScript: *.jsx;*.jsxinc,JavaScript: *.js,Text Files: *.txt,All Files: *.*",false);
        }
        if (!includeScriptFile.exists)
        {
            return;
        }
    
        //load include script
        includeScriptFile.open('r');
        var includeScript = includeScriptFile.read();
        includeScriptFile.close();
        
        jsx = jsx.replace(includeLine,includeScript);
        includeIndex = jsx.indexOf("#include");
    }

    //save
    var extension = jsxFile.fullName.substr(jsxFile.fullName.lastIndexOf('.'));
    var newJsxName = jsxFile.fullName.substr(0,jsxFile.fullName.lastIndexOf('.'));
    newJsxName = newJsxName + "_build" + extension;
    newJsxFile = new File(newJsxName);
    newJsxFile.open('w');
    newJsxFile.write(jsx);
    newJsxFile.close();
    alert("File saved as " + newJsxFile.name);
    
})();
