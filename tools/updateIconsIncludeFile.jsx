(function()
{
    var incPath = new File($.fileName).parent.parent.absoluteURI + "/inc/";
    var iconsIncFile = new File(incPath + 'icons.jsxinc');

    var iconsIncStr = "";
    
    var w12Folder = new Folder(incPath + 'icons/w12');
    var iconsFiles = w12Folder.getFiles('*.jsxinc');
    for (var i = 0; i < iconsFiles.length; i++)
    {
        iconsIncStr += '#include "icons/w12/' + iconsFiles[i].displayName + '"\n';
    }
    iconsIncStr += "\n";

    var w16Folder = new Folder(incPath + 'icons/w16');
    iconsFiles = w16Folder.getFiles('*.jsxinc');
    for (var i = 0; i < iconsFiles.length; i++)
    {
        iconsIncStr += '#include "icons/w16/' + iconsFiles[i].displayName + '"\n';
    }
    iconsIncStr += "\n";

    var w128Folder = new Folder(incPath + 'icons/w128');
    iconsFiles = w128Folder.getFiles('*.jsxinc');
    for (var i = 0; i < iconsFiles.length; i++)
    {
        iconsIncStr += '#include "icons/w128/' + iconsFiles[i].displayName + '"\n';
    }

    iconsIncFile.encoding = 'UTF8';
    iconsIncFile.open('w')
    iconsIncFile.write(iconsIncStr);
    iconsIncFile.close();
})();