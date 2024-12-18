function buildCmdPanel( container, standAlone ) {

    standAlone = def(standAlone, false);

    if (!standAlone) {
        // A Spacer
        var spacer = tab.add('group');
        spacer.margins = 0;
        spacer.spacing = 0;
        spacer.size = [-1,3];

        // A title
        DuScriptUI.staticText( tab, i18n._("Command line") ).alignment = ['center', 'top'];
    }

    // Adjust lib
    function fixLib( lib ) {
        lib.libType = 'category';
        for (i in lib) {
            if (!lib.hasOwnProperty(i)) continue;
            if (typeof lib[i] === 'string') {
                var val = {};
                val.data = lib[i];
                val.libType = 'item';
                lib[i] = val;
            }
            else fixLib( lib[i] );
        }
    }

    fixLib(Duik.CmdLib);

    var libOptions = {};
    libOptions.folderButton = false;
    libOptions.editListButtons = false;
    libOptions.defaultItemIcon = w12_cmd.binAsString;

    var lib = DuScriptUI.library(
        container,
        Duik.CmdLib,
        libOptions
    );

    lib.onRun = function(item) {
        eval(item.data);
    };
}