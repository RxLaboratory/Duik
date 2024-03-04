function buildScriptLibPanel( scriptLibGroup, scriptEditorGroup ) {

    // Default icons
    var defaultIcons = {};
    defaultIcons["Duik Angela"] = w16_move_rotate.binAsString;
    defaultIcons["Duik Animation"] = w16_animation.binAsString;
    defaultIcons["Duik Animation Library"] = w16_library.binAsString;
    defaultIcons["Duik Constraints"] = w16_constraint.binAsString;
    defaultIcons["Duik Cmd"] = w12_cmd.binAsString;
    defaultIcons["Duik Layer Manager"] = w16_layers.binAsString;
    defaultIcons["Duik Notes"] = w16_file.binAsString;
    defaultIcons["Duik Rigging"] = w16_bone.binAsString;
    defaultIcons["Duik Script Library"] = w16_library.binAsString;
    defaultIcons["DuGR"] = w16_dugr.binAsString;
    defaultIcons["Create Nulls From Paths"] = w16_null_path.binAsString;
    defaultIcons["VR Comp Editor"] = w16_vr.binAsString;

    // Get the script library
    // Same folder as the settings file
    var duikSettingsFolder = DuESF.scriptSettings.file.parent;
    // Get/create the script lib file
    var scriptLib = new DuSettings( "Duik_script_library", duikSettingsFolder.absoluteURI + "/Duik_script_library.json", true );
    // Prepare defaults
    if (typeof scriptLib.data.categories === 'undefined') scriptLib.data.categories = [];
    if (typeof scriptLib.data.scripts === 'undefined') scriptLib.data.scripts = [];
    if (typeof scriptLib.data.recent === 'undefined') scriptLib.data.recent = [];

    // Utils
    function getCreateLibEntry( file ) {
        if (file instanceof File) file = file.absoluteURI;
        for (var i = 0; i < scriptLib.data.scripts.length; i++) {
            var s = scriptLib.data.scripts[i];
            if (s.absoluteURI == file) {
                // Update defaults
                s.favorite = def(s.favorite, false);
                s.count = def(s.count, 0);
                return s;
            }
        }

        var s = {};
        s.absoluteURI = file;
        s.favorite = false;
        s.count = 0;
        s.name = DuPath.getBasename(file);
        s.icon = '';
        s.category = '';
        return s;
    }

    function entryRun( file ){
        // Count uses
        var a = getCreateLibEntry(file);
        a.count++;
        updateLibEntry(a);

        // Update recent
        addToRecent(a);
    }

    function addToRecent( entry ) {
        var uri = entry.absoluteURI;
        // If the first is not the same
        if (scriptLib.data.recent.length > 0 && scriptLib.data.recent[0] == uri) return;

        // Insert
        scriptLib.data.recent.unshift( uri );

        // Remove others
        for (var i = scriptLib.data.recent.length -1; i > 0; i--) {
            if (scriptLib.data.recent[i] == uri) scriptLib.data.recent.splice(i, 1);
        }

        scriptLib.save();
    }

    function updateLibEntry( entry ) {
        for (var i = 0; i < scriptLib.data.scripts.length; i++) {
            var a = scriptLib.data.scripts[i];
            if (a.absoluteURI == entry.absoluteURI) {
                scriptLib.data.scripts[i] = entry;
                scriptLib.save();
                return;
            }
        }
        scriptLib.data.scripts.push(entry);
        scriptLib.save();
    }

    function removeLibEntry( entry ) {
        for (var i = scriptLib.data.scripts.length - 1; i >= 0; i--) {
            var script = scriptLib.data.scripts[i];
            if (script.absoluteURI == entry.absoluteURI) {
                // Remove from recent list
                for (var j = scriptLib.data.recent.length - 1; j >= 0; j--) {
                    if (scriptLib.data.recent[j] == script.absoluteURI) scriptLib.data.recent.splice(j, 1);
                }
                // Remove from script list
                scriptLib.data.scripts.splice(i, 1);
            }
        }

        scriptLib.save();
    }

    function listCategories( containingCatName, recursive ) {
        recursive = def(recursive, false);
        var cats = [];
        for(var i = 0; i < scriptLib.data.categories.length; i++) {
            var cat = scriptLib.data.categories[i];
            if (cat == containingCatName) continue;
            if (containingCatName == '') {
                if (recursive) {
                    cats.push(cat);
                    continue;
                }
                var test = cat.split('/');
                if (test.length > 1) continue;
                cats.push(cat);
                continue;
            }
            if (cat.indexOf(containingCatName) == 0) {
                if (recursive) {
                    cats.push(cat);
                    continue;
                }
                var test = cat.replace(containingCatName, '');
                test = cat.split('/');
                if (test.length > 2) continue;
                cats.push(cat);
            }
        }
        return cats;
    }

    function removeCatEntry( catName ) {
        // Remove from categories list
        for (var i = scriptLib.data.categories.length-1; i >= 0; i--) {
            var cat = scriptLib.data.categories[i];
            if (cat.indexOf(catName) == 0) {
                scriptLib.data.categories.splice(i, 1);
            }
        }

        for (var i = scriptLib.data.scripts.length - 1; i >= 0; i--) {
            var script = scriptLib.data.scripts[i];
            if (script.category.indexOf(catName) == 0) {
                // Remove from recent list
                for (var j = scriptLib.data.recent.length - 1; j >= 0; j--) {
                    if (scriptLib.data.recent[j] == script.absoluteURI) scriptLib.data.recent.splice(j, 1);
                }
                // Remove from script list
                scriptLib.data.scripts.splice(i, 1);
            }
        }

        scriptLib.save();
    }

    function refreshLib( category ) {
        // Clear
        DuJSObj.clear(category, ['data', 'libType', 'editableData', 'editableItem', 'icon'] );

        // UTILS
        function addItem( entry ) {
            var f = new File(entry.absoluteURI);
            if (!f.exists) return;

            var item = {};
            item.data = f;
            item.libType = 'item';
            item.editableData = true;
            item.editableItem = true;
            
            // Get the default icon
            var icon = '';
            var iconFile = new File(entry.icon);
            if (iconFile.exists) 
                icon = entry.icon;
            else if (defaultIcons[entry.name] !== undefined)
                icon = defaultIcons[entry.name];
            
            if (icon != '') item.icon = icon;

            category[ entry.name ] = item;
        }

        function listScripts(folder) {
            var files = folder.getFiles();
            for (var i = 0, n = files.length; i < n; i++) {
                var f = files[i];
                var ext = DuPath.getExtension(f);
                if (ext != 'jsx' && ext != 'jsxbin') continue;
                // get icon and name from settings
                var icon = "";
                var name = "";
                for (var j = 0; j < scriptLib.data.scripts.length; j++)
                {
                    var script = scriptLib.data.scripts[j];
                    if (script.absoluteURI == f.absoluteURI) {
                        if (script.name) name = script.name;
                        if (script.icon) icon = script.icon;
                        break;
                    }
                }
                if (name == "") name = DuPath.getBasename(f);
                // Get the default icon
                if (icon == "" && defaultIcons[name] !== undefined) {
                    icon = defaultIcons[name]; 
                }

                var item = {};
                item.data = f;
                item.libType = 'item';
                item.editableData = true;
                item.editableItem = true;
                item.icon = icon;
                category[ name ] = item;
            }
        }

        function addCats( cats ) {
            for (var i = 0; i < cats.length; i++) {
                var cat = {};
                cat.data = cats[i];
                cat.libType = 'category';
                cat.editableData = false;
                cat.editableItem = true;
                var name = cats[i].split('/');
                name = name[name.length-1];
                category[ name ] = cat;
            }
        }

        // LOAD
        if (category.data == 'rootCat') {
            // List special categories

            var mostUsed = {};
            mostUsed.data = 'mostUsed';
            mostUsed.libType = 'category';
            mostUsed.editableData = false;
            mostUsed.editableItem = false;
            mostUsed.icon = w12_count.binAsString;
            category[ '* ' + i18n._("Most used") ] = mostUsed;

            // Recent
            var recent = {};
            recent.data = 'recent';
            recent.libType = 'category';
            recent.editableData = false;
            recent.editableItem = false;
            recent.icon = w12_recent.binAsString;
            category[ '* ' + i18n._("Recent") ] = recent;

            // Favorites
            var favs = {};
            favs.data = 'favorites';
            favs.libType = 'category';
            favs.editableData = false;
            favs.editableItem = false;
            favs.icon = w12_fav.binAsString;
            category[ '* ' + i18n._("Favorites") ] = favs;

            // All
            var allCats = {};
            allCats.data = 'all';
            allCats.libType = 'category';
            allCats.editableData = false;
            allCats.editableItem = false;
            allCats.icon = w12_library.binAsString;
            category[ '* ' + i18n._("All categories") ] = allCats;

            // Uncategorized
            /*var uncat = {};
            uncat.data = 'uncategorized';
            uncat.libType = 'category';
            uncat.editableData = false;
            uncat.editableItem = false;
            uncat.icon = w12_file.binAsString;
            category[ '* ' + i18n._("Uncategorized") ] = uncat;*/

            // Dockable
            var dockable = {};
            dockable.data = 'dockable';
            dockable.libType = 'category';
            dockable.editableData = false;
            dockable.editableItem = false;
            dockable.icon = w12_dock.binAsString;
            category[ '* ' + i18n._("Dockable Scripts") ] = dockable;

            // AE
            var ae = {};
            ae.data = 'ae';
            ae.libType = 'category';
            ae.editableData = false;
            ae.editableItem = false;
            ae.icon = w12_script.binAsString;
            category[ '* ' + i18n._("Ae Scripts") ] = ae;

            // Startup
            var startup = {};
            startup.data = 'startup';
            startup.libType = 'category';
            startup.editableData = false;
            startup.editableItem = false;
            startup.icon = w12_startup.binAsString;
            category[ '* ' + i18n._("Startup Scripts") ] = startup;

            // Shutdown
            var shutdown = {};
            shutdown.data = 'shutdown';
            shutdown.libType = 'category';
            shutdown.editableData = false;
            shutdown.editableItem = false;
            shutdown.icon = w12_shutdown.binAsString;
            category[ '* ' + i18n._("Shutdown Scripts") ] = shutdown;

            // Other categories
            var cats = listCategories('');
            addCats(cats);

            // Uncategorized
            for (var i = 0; i < scriptLib.data.scripts.length; i++) {
                var script = scriptLib.data.scripts[i];
                if (script.category == "") addItem(script);
            }
        }
        else if (category.data == 'mostUsed') {
            // add
            for (var i = 0; i < scriptLib.data.scripts.length; i++) {
                var script = scriptLib.data.scripts[i];
                if (script.count > 0) addItem( script );
            }
            lib.sortMode = 'none';
        }
        else if (category.data == 'recent') {
            for (var i = 0; i < scriptLib.data.recent.length; i++) {
                var s = scriptLib.data.recent[i];
                var f = new File(s);
                if (!f.exists) continue;
                s = getCreateLibEntry(f);
                addItem( s );
            }
            lib.sortMode = 'none';
        }
        else if (category.data == 'favorites') {
            // add items
            for (var i = 0; i < scriptLib.data.scripts.length; i++) {
                var s = scriptLib.data.scripts[i];
                if (s.favorite) addItem(s);
            }
        }
        else if (category.data == 'all') {
            // Categories
            for (var i = 0; i < scriptLib.data.scripts.length; i++) {
                var script = scriptLib.data.scripts[i];
                addItem(script);
            }
            // ScriptUI
            var folders = DuAE.scriptFolders("ScriptUI Panels");
            for (var i = 0; i < folders.length; i++) {
                listScripts(folders[i]);
            }
            // Scripts
            var folders = DuAE.scriptFolders("");
            for (var i = 0; i < folders.length; i++) {
                listScripts(folders[i]);
            }
            // Startup
            var folders = DuAE.scriptFolders("Startup");
            for (var i = 0; i < folders.length; i++) {
                listScripts(folders[i]);
            }
            // Shutdown
            var folders = DuAE.scriptFolders("Shutdown");
            for (var i = 0; i < folders.length; i++) {
                listScripts(folders[i]);
            }
        }
        else if (category.data == 'dockable') {
            var folders = DuAE.scriptFolders("ScriptUI Panels");
            for (var i = 0; i < folders.length; i++) {
                listScripts(folders[i]);
            }
        }
        else if (category.data == 'ae') {
            var folders = DuAE.scriptFolders("");
            for (var i = 0; i < folders.length; i++) {
                listScripts(folders[i]);
            }
        }
        else if (category.data == 'startup') {
            var folders = DuAE.scriptFolders("Startup");
            for (var i = 0; i < folders.length; i++) {
                listScripts(folders[i]);
            }
        }
        else if (category.data == 'shutdown') {
            var folders = DuAE.scriptFolders("Shutdown");
            for (var i = 0; i < folders.length; i++) {
                listScripts(folders[i]);
            }
        }
        else {
            var catName = category.data;
            // Sub categories
            var cats = listCategories(catName);
            addCats(cats);
            // Scripts
            for (var i = 0; i < scriptLib.data.scripts.length; i++) {
                var script = scriptLib.data.scripts[i];
                if (script.category == catName) addItem(script);
            }
        }
    }

    // Popups
    var catNameEditor = DuScriptUI.stringPrompt(
        i18n._("Edit category name"),
        i18n._("New Category")
    );

    var scriptSettingsEditor = DuScriptUI.popUp( i18n._("Script settings") );
    scriptSettingsEditor.content.alignment = ['fill','top'];
    scriptSettingsEditor.editing = null;
    var scriptSettingsCatSelector = DuScriptUI.selector(scriptSettingsEditor.content);
    scriptSettingsCatSelector.onChange = function() {
        if (!scriptSettingsEditor.editing) return;

        var f = scriptSettingsEditor.editing;

        var catName = "";
        if (scriptSettingsCatSelector.index > 0) catName = scriptSettingsCatSelector.text;

        // set cat in settings
        var ok = false;
        for(var i = 0; i < scriptLib.data.scripts.length; i++) {
            var s = scriptLib.data.scripts[i];
            if (s.absoluteURI == f.absoluteURI) {
                s.category = catName;
                ok = true;
            }
            scriptLib.data.scripts[i] = s;
        }
        if (!ok) {
            var s = {};
            s.name = DuPath.getBasename(f);
            s.category = catName;
            s.icon = "";
            s.absoluteURI = f.absoluteURI;
            scriptLib.data.scripts.push(s);
        }
        scriptLib.save();

        // Refresh list
        lib.refresh();
    };
    var scriptSettingsIconSelector = DuScriptUI.fileSelector(
        scriptSettingsEditor.content,
        i18n._("Select icon") + "...",
        false,
        '',
        undefined,
        'open',
        "Portable Network Graphics: *.png, All Files: *.*",
    );
    scriptSettingsIconSelector.onChange = function() {
        if (!scriptSettingsEditor.editing) return;
        var iconFile = scriptSettingsIconSelector.getFile();
        if (!iconFile) return;

        var f = scriptSettingsEditor.editing;

        // set icon in settings
        var ok = false;
        for(var i = 0; i < scriptLib.data.scripts.length; i++) {
            var s = scriptLib.data.scripts[i];
            if (s.absoluteURI == f.absoluteURI) {
                s.icon = iconFile.absoluteURI;
                ok = true;
            }
            scriptLib.data.scripts[i] = s;
        }
        if (!ok) {
            var s = {};
            s.name = DuPath.getBasename(f);
            s.category = "";
            s.icon = iconFile.absoluteURI;
            s.absoluteURI = f.absoluteURI;
            scriptLib.data.scripts.push(s);
        }
        scriptLib.save();

        // Refresh list
        lib.refresh();
    };
    var scriptSettingsFavButton = DuScriptUI.checkBox(
        scriptSettingsEditor.content,
        i18n._("Favorite"),
        w12_fav
    );
    scriptSettingsFavButton.onClick = function() {
        if (!scriptSettingsEditor.editing) return;

        var s = getCreateLibEntry( scriptSettingsEditor.editing );
        s.favorite = scriptSettingsFavButton.checked;
        updateLibEntry(s);

        if (!scriptSettingsEditor.pinned) scriptSettingsEditor.hide();

        lib.refresh();
    };
    scriptSettingsNameEditor = DuScriptUI.editText(
        scriptSettingsEditor.content,
        '',
        '',
        '',
        i18n._("Script name")
    );
    var scriptSettingsOKButton = DuScriptUI.button(
        scriptSettingsEditor.content,
        i18n._("OK"),
        DuScriptUI.Icon.CHECK,
        i18n._("Script settings"),
        false,
        'row',
        'center'
    );
    scriptSettingsOKButton.onClick = scriptSettingsNameEditor.onChange = function() {
        if (!scriptSettingsEditor.editing) return;

        var f = scriptSettingsEditor.editing;

        // Rename in settings
        var ok = false;
        for(var i = 0; i < scriptLib.data.scripts.length; i++) {
            var s = scriptLib.data.scripts[i];
            if (s.absoluteURI == f.absoluteURI) {
                s.name = scriptSettingsNameEditor.text;
                ok = true;
            }
            scriptLib.data.scripts[i] = s;
        }
        if (!ok) {
            var s = {};
            s.name = scriptSettingsNameEditor.text;
            s.category = "";
            s.icon = "";
            s.absoluteURI = f.absoluteURI;
            scriptLib.data.scripts.push(s);
        }
        scriptLib.save();

        // Refresh list
        lib.refresh();

        if (!scriptSettingsEditor.pinned) {
            scriptSettingsEditor.editing = null;
            scriptSettingsEditor.hide();
        }
    }

    // setting to change the external editor
    var editOptionsPopup = DuScriptUI.popUp( 'Options' );
    var editorSelector = DuScriptUI.fileSelector(
        editOptionsPopup.content,
        i18n._("Open scripts with..."),
        true,
        i18n._("Select an application to open the scripts.\nLeave the field empty to use the system default."), /// TRANSLATORS: "System" stands for Operating System here.
        undefined,
        'open',
        undefined,
        'column'
    );
    editorSelector.onChange = function() {
        var f = editorSelector.getFile();
        if (!f && editorSelector.editText.text != "") return;
        if (f) DuESF.scriptSettings.set("scriptLib/scriptEditor", f.absoluteURI);
        else DuESF.scriptSettings.set("scriptLib/scriptEditor", "");
        DuESF.scriptSettings.save();
    }
    editorSelector.setPath( DuESF.scriptSettings.get("scriptLib/scriptEditor","" ) );
    editorSelector.setPlaceholder( i18n._("System default") );

    // Checkbox to use the Duik quick editor by default
    var useDuikButton = DuScriptUI.checkBox(
        editOptionsPopup.content,
        i18n._("Use the Duik quick editor."),
        undefined,
        i18n._("Use the Duik quick script editor to edit the selected script.")
    );
    useDuikButton.onClick = function() {
        DuESF.scriptSettings.set("scriptLib/useDuikEditor", useDuikButton.checked);
        DuESF.scriptSettings.save();
    };
    useDuikButton.setChecked( DuESF.scriptSettings.get("scriptLib/useDuikEditor", true ) );

    DuScriptUI.separator(editOptionsPopup.content);

    var editApplyButton = DuScriptUI.button(
        editOptionsPopup.content,
        '',
        w12_check,
        ''
    );
    editApplyButton.onClick = function() { lib.editDataButton.onClick(); editOptionsPopup.hide(); };

    // Set initial data
    var sLib = {};
    sLib.data = 'rootCat';
    sLib.libType = 'category';
    sLib.editableItem = true;
    refreshLib(sLib);

    var libOptions = {};
    libOptions.runHelpTip = i18n._("Run the selected script.\n\n[Alt]: Run the script as a standard script even if it's a dockable ScriptUI panel.");
    libOptions.addItemHelpTip = i18n._("Add a new script or a category to the library.");
    libOptions.editItemHelpTip = i18n._("Script settings");
    libOptions.removeItemHelpTip = i18n._("Removes the selected script or category from the library.");
    libOptions.editDataHelpTip = i18n._("Edit the selected script.\n\n[Alt]: Use the Duik quick editor.");
    libOptions.editDataButton = true;
    libOptions.defaultItemIcon = w12_script.binAsString;

    var lib = DuScriptUI.library(scriptLibGroup, sLib, libOptions);

    lib.onRefresh = refreshLib;

    lib.onRun = function(item) {
        var f = item.data;
        if (!f.exists) {
            alert( i18n._("Script not found") + ":\n\n" + f.fsName);
            return;
        }

        if (DuPath.getName( f.parent) == "ScriptUI Panels") DuAE.openScriptUIPanel( DuPath.getName( f ) );
        else $.evalFile(f.absoluteURI);

        entryRun( f );
    };

    lib.onAltRun = function(item) {
        var f = item.data;
        if (!f.exists) {
            alert( i18n._("Script not found") + ":\n\n" + f.fsName);
            return;
        }

        $.evalFile(f.absoluteURI);

        entryRun( f );
    };

    editOptionsPopup.tieTo(lib.editDataButton, true);
    lib.onEditData = function(item) {
        var f = item.data;

        if (!useDuikButton.checked) {
            // Check if an editor is selected and exists
            var editor = editorSelector.getFile();
            if (editor) DuProcess.run(editor, [f.fsName]);
            else f.execute();
        }
        else lib.onAltEditData(item);
    };
    lib.onAltEditData = function(item) {
        var f = item.data;

        var content = DuFile.read(f);
        scriptEditorGroup.edit(content);
    };

    lib.onFolderOpened = function(item, category) {
        var f = item.data;
        if (f && f.exists) f.parent.execute();
    };

    lib.onAddItem = function( category ) {
        // Can't add in some categories
        var catName = category.data;
        if (catName == 'rootCat' || catName == 'all') catName = '';
        else if (catName == 'mostUsed' ||
            catName == 'recent' ||
            catName == 'favorites' ||
            catName == 'dockable' ||
            catName == 'ae' ||
            catName == 'startup' ||
            catName == 'shutdown'
            )
        {
            alert( i18n._("Sorry, we can't save a script directly in the current category."));
            return;
        }
        // Select files
        var files = File.openDialog( i18n._("Add new scripts to the library."), "All Files: *.*", true);
        if (!files) return;
        // Add to settings and refresh
        for (var i = 0; i < files.length; i++) {
            var f = files[i];
            var s = getCreateLibEntry( f );
            s.category = catName;
            updateLibEntry(s);
        }
        lib.refresh();
    };

    catNameEditor.tieTo(lib.addCategoryButton);
    lib.onAddCategory = function( category ) {
        // Can't add in some categories
        var catName = category.data;
        if (catName == 'rootCat' || catName == 'all') catName = '';
        else if (catName == 'mostUsed' ||
            catName == 'recent' ||
            catName == 'favorites' ||
            catName == 'dockable' ||
            catName == 'ae' ||
            catName == 'startup' ||
            catName == 'shutdown'
            )
        {
            catNameEditor.block = true;
            alert( i18n._("Sorry, we can't create a sub-category in the current category."));
            return;
        }
        catNameEditor.setText('');
        catNameEditor.edit();
        catNameEditor.show();
    };
    catNameEditor.onAccept = function(newName) {
        if (newName == '') return;

        var containingName = lib.currentCategory.data + '/';
        if (containingName == 'rootCat/') containingName = '';

        newName = containingName + newName;
        var prevName = containingName + catNameEditor.previousString;

        // Create
        if (catNameEditor.previousString == '') {
            scriptLib.data.categories.push(newName);
        }
        // Rename
        else {
            // rename in settings and in all scripts in settings
            for (var i = 0; i < scriptLib.data.categories.length; i++) {
                if (scriptLib.data.categories[i] == prevName) scriptLib.data.categories[i] = newName;
            }
            for (var i = 0; i < scriptLib.data.scripts.length; i++) {
                if (scriptLib.data.scripts[i].category == prevName) scriptLib.data.scripts[i].category = newName;
            }
        }

        scriptLib.save();

        // Refresh list
        lib.refresh();
    };

    scriptSettingsEditor.tieTo(lib.editItemButton, false, true);
    catNameEditor.tieTo(lib.editItemButton, false, true);
    lib.onEditItem = function(item, category) {
        if (item.libType == 'item') {
            // Set name
            scriptSettingsNameEditor.setText(item.text);

            // Editing
            var f = item.data;
            scriptSettingsEditor.editing = f;

            var s = getCreateLibEntry(f);

            // Set category
            scriptSettingsCatSelector.clear();
            scriptSettingsCatSelector.addButton("Uncategorized", w12_file );
            var cats = listCategories( '', true );
            for (var i = 0; i < cats.length; i++ ) {
                scriptSettingsCatSelector.addButton(cats[i], w12_folder);
            }

            if (s.category == "") scriptSettingsCatSelector.setCurrentIndex(0);
            else scriptSettingsCatSelector.setCurrentText(s.category);

            // Set fav
            scriptSettingsFavButton.setChecked( s.favorite );

            scriptSettingsEditor.show();
        }
        else if (item.data != 'rootCat' &&
            item.data != 'all' &&
            item.data != 'mostUsed' &&
            item.data != 'recent' &&
            item.data != 'favorites' &&
            item.data != 'dockable' &&
            item.data != 'ae' &&
            item.data != 'startup' &&
            item.data != 'shutdown'
            )
        {
            catNameEditor.setText(item.text);
            catNameEditor.edit();
            catNameEditor.show();
        }
    }

    lib.onRemoveItem = function (item, category) {
        if (item.libType == 'item') {
            var f = item.data;
            removeLibEntry( getCreateLibEntry(f) );
            lib.refresh();
        }
        else if (item.data != 'rootCat' &&
            item.data != 'all' &&
            item.data != 'mostUsed' &&
            item.data != 'recent' &&
            item.data != 'favorites' &&
            item.data != 'dockable' &&
            item.data != 'ae' &&
            item.data != 'startup' &&
            item.data != 'shutdown'
            )
        {
            var catName = item.data;
            var ok = confirm( i18n._p("Are you sure you want to remove the category %1 and all its scripts?\nThe files will not be removed from disk.", catName));
            if (!ok) return;
            
            removeCatEntry( catName );

            lib.refresh();
        }
    };
}