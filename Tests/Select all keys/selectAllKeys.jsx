(function()
{

    function setSelectedKeys(prop)
    {
        if (prop.propertyType == PropertyType.PROPERTY)
        {
            if (prop.PropertyValueType != PropertyValueType.NO_VALUE)
            {
                for (var i = 1 ; i <= prop.numKeys ; i++)
                {
                    prop.setSelectedAtKey(i,true);
                }
            }
        }
        else if (prop.numProperties > 0)
        {
            for (var propIndex = 1;propIndex <= prop.numProperties;propIndex++)
            {
                setSelectedKeys(prop.property(propIndex));
            }
        }
    }


    var comp = app.project.activeItem;
    if (!comp) return;
    if (!(comp instanceof CompItem)) return;

    for (var i = 1 ; i <= comp.layers.length ; i++ )
    {
        var layer = comp.layer(i);
        setSelectedKeys(layer);
    }
}());
