(function()
{
    var incPath = new File($.fileName).parent.parent.absoluteURI + "/inc/";
    var presetsFolder = new Folder(incPath + 'presets');
    var presetsIncFile = new File(incPath + 'api/presets.jsxinc');

    var presetsFiles = presetsFolder.getFiles('*.jsxinc');
    var presetsIncStr = "";
    for (var i = 0; i < presetsFiles.length; i++)
    {
        presetsIncStr += '#include "../presets/' + presetsFiles[i].displayName + '"\n';
    }

    presetsFiles.encoding = 'UTF8';
    presetsIncFile.open('w')
    presetsIncFile.write(presetsIncStr);
    presetsIncFile.close();
})();