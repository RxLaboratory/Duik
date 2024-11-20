(function()
{
    #include "../DuAEF/DuAEF.jsxinc"

    // Ask var name
    var folder = new Folder('D:/DEV_SRC/RxOT/DuAEF/DuAEF_Duik/inc/shapes');

    var comp = DuAEProject.getActiveComp();
    if (!comp)
    {
        alert("Nothing found, please select the path to export.");
        return;
    }

    var props = comp.selectedProperties;
    if (props.length == 0)
    {
        alert("Nothing found, please select the path to export.");
        return;
    }

    names = new DuList();

    for (var i = 0, n = props.length; i < n; i++)
    {
        var path = new DuAEProperty( props.pop() );
        var pathProp = path.pathProperty();
        
        var name = pathProp.getProperty().parentProperty.name;
        if ( names.indexOf(name) >= 0 ) continue;
        names.push(name);

        var file = new File(folder.absoluteURI + '/' + name + ".jsxinc");

        path.exportPathToJsxinc( file, false, false, name );
    }

    alert ("Exported:\n\n" + names.join('\n'));

})();