(function()
{
    var incPath = new File($.fileName).parent.parent.absoluteURI + "/inc/";
    var metarigsFolder = new Folder(incPath + 'oco');
    var metarigsIncFile = new File(incPath + 'metarigs.jsxinc');

    var metarigsFiles = metarigsFolder.getFiles('*.jsxinc');
    var metarigsIncStr = "";
    for (var i = 0; i < metarigsFiles.length; i++)
    {
        metarigsIncStr += '#include "oco/' + metarigsFiles[i].displayName + '"\n';
    }

    metarigsIncFile.encoding = 'UTF8';
    metarigsIncFile.open('w')
    metarigsIncFile.write(metarigsIncStr);
    metarigsIncFile.close();
})();