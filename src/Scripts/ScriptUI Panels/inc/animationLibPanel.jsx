function buildAnimationLibPanel( animationLibGroup ) {

    // Init the folder
    var folderURI = DuESF.scriptSettings.get("animationLibFolder", DuESF.scriptSettings.file.parent.absoluteURI + '/' + i18n._("Animation library"));
    var libFolder = new Folder(folderURI);
    if (!libFolder.exists) libFolder.create();

    // Get the anim library metadata
    // Get/create the anim lib file
    var animLib = new DuSettings( "Duik_animation_library", libFolder.absoluteURI + "/Duik_animation_library.json", true );
    // Prepare defaults
    if (typeof animLib.data.anims === 'undefined') animLib.data.anims = [];
    if (typeof animLib.data.recent === 'undefined') animLib.data.recent = [];

    // Utils
    function getCreateLibEntry( file ) {
        if (file instanceof File) file = file.absoluteURI;
        for (var i = 0; i < animLib.data.anims.length; i++) {
            var a = animLib.data.anims[i];
            if (a.absoluteURI == file) return a;
        }

        var a = {};
        a.absoluteURI = file;
        a.favorite = false;
        a.count = 0;
        return a;
    }

    function updateLibEntry( entry ) {
        for (var i = 0; i < animLib.data.anims.length; i++) {
            var a = animLib.data.anims[i];
            if (a.absoluteURI == entry.absoluteURI) {
                animLib.data.anims[i] = entry;
                animLib.save();
                return;
            }
        }
        animLib.data.anims.push(entry);
        animLib.save();
    }

    function updateEntryURI( oldURI,  newURI ){
        for (var i = 0; i < animLib.data.anims.length; i++) {
            var a = animLib.data.anims[i];
            if (a.absoluteURI == oldURI) { 
                a.absoluteURI = newURI;
                animLib.data.anims[i] = a;
            }
        }
        for (var i = 0; i < animLib.data.recent.length; i++) {
            var a = animLib.data.recent[i];
            if (a == oldURI){
                animLib.data.recent[i] = a;
            }
        }
        animLib.save();
    }

    function updateEntryCat( oldCat,  newCat ){
        for (var i = 0; i < animLib.data.anims.length; i++) {
            var a = animLib.data.anims[i];
            var f = new File(a.absoluteURI);
            var cat = DuPath.getName( f.parent );
            if ( cat == oldCat ) {
                var newPath = libFolder.absoluteURI + '/' + newCat + '/';
                var fName = DuPath.getName( f );
                a.absoluteURI = newPath + fName;
                animLib.data.anims[i] = a;
            }
        }
        for (var i = 0; i < animLib.data.recent.length; i++) {
            var a = animLib.data.recent[i];
            var f = new File(a);
            var cat = DuPath.getName( f.parent );
            if ( cat == oldCat ) {
                var newPath = libFolder.absoluteURI + '/' + newCat + '/';
                var fName = DuPath.getName( f );
                animLib.data.recent[i] = newPath + fName;
            }
        }
        animLib.save();
    }

    function cleanAnimLib() {
        for (var i = animLib.data.anims.length - 1; i >= 0 ; i--) {
            var a = animLib.data.anims[i];
            var f = new File(a.absoluteURI);
            if (!f.exists) animLib.data.anims.splice(i, 1);
        }
        for (var i = animLib.data.recent.length - 1; i >= 0 ; i--) {
            var a = animLib.data.recent[i];
            var f = new File(a);
            if (!f.exists) animLib.data.recent.splice(i, 1);
        }
        animLib.save();
    }

    function addToRecent( entry ) {
        var uri = entry.absoluteURI;
        // If the first is not the same
        if (animLib.data.recent.length > 0 && animLib.data.recent[0] == uri) return;

        // Insert
        animLib.data.recent.unshift( uri );

        // Remove others
        for (var i = animLib.data.recent.length -1; i > 0; i--) {
            if (animLib.data.recent[i] == uri) animLib.data.recent.splice(i, 1);
        }

        animLib.save();
    }
    
    function refreshLib( category ) {
        // Clear
        DuJSObj.clear( category, ['data', 'libType', 'editableData', 'editableItem', 'icon'] );

        var catFolder;

        // Adds an anim file to the category
        function addItem( f ) {
            var item = {};
            item.data = f;
            item.libType = 'item';
            item.editableData = false;
            item.editableItem = true;

            var icon = new File(DuPath.switchExtension(f, 'png'));
            if (icon.exists) item.icon = icon.absoluteURI;

            category[ DuPath.getBasename(f) ] = item;
        }

        // List special categories
        if (category.data == 'rootCat') {
            catFolder = libFolder;

            // Most used
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
        }
        else if (category.data == 'mostUsed') {
            for (var i = 0; i < animLib.data.anims.length; i++) {
                var a = animLib.data.anims[i];
                if (a.count >= 1) {
                    var f = new File(a.absoluteURI);
                    if (!f.exists) continue;
                    addItem(f);
                }
            }
            lib.sortMode = 'none';
            return;
        }
        else if (category.data == 'recent') {
            // add items
            for (var i = 0; i < animLib.data.recent.length; i++) {
                var a = animLib.data.recent[i];
                var f = new File(a);
                if (!f.exists) continue;
                addItem(f);
            }
            lib.sortMode = 'none';
            return;
        }
        else if (category.data == 'favorites') {
            // add items
            for (var i = 0; i < animLib.data.anims.length; i++) {
                var a = animLib.data.anims[i];
                if (a.favorite) {
                    var f = new File(a.absoluteURI);
                    if (!f.exists) continue;
                    addItem(f);
                }
            }
            return;
        }
        else {
            catFolder = category.data;
        }

        // List subfolders (categories)
        if (!catFolder) return; 
        if (!catFolder.exists) return;

        var subFiles = catFolder.getFiles();
        for (var i = 0, n = subFiles.length; i < n; i++) {
            var f = subFiles[i];
            // Cat
            if (f instanceof Folder) {
                // Add the folder category
                var cat = {};
                cat.data = f;
                cat.libType = 'category';
                cat.editableData = false;
                cat.editableItem = true;

                category[ "> " + DuPath.getName(f) ] = cat;
            }
            // Anim
            else if ( DuPath.getExtension(f) == 'duio' ) {
                addItem(f);
            }
        }
    }

    function listCategories( ) {
        return DuFolder.getFiles(libFolder, DuPath.isFolder);
    }

    // UI Popups
    var runOptionsPopup = DuScriptUI.popUp( 'Options' );
    runOptionsPopup.build = function() {
        if (runOptionsPopup.built) return;

        var settingsKeysSelector = DuScriptUI.selector(runOptionsPopup.content);
        settingsKeysSelector.addButton(
            i18n._("All properties"),
            w16_props
        );
        settingsKeysSelector.addButton(
            i18n._("Keyframes only"),
            w16_keyframe
        );
        settingsKeysSelector.setCurrentIndex(0);

        var propsGroup = DuScriptUI.group(runOptionsPopup.content, 'row');
        propsGroup.alignment = ['center', 'top'];

        var posButton = DuScriptUI.checkBox(
            propsGroup,
            '',
            w16_move,
            i18n._("Position")
        );
        posButton.setChecked(true);

        var rotButton = DuScriptUI.checkBox(
            propsGroup,
            '',
            w16_rotate,
            i18n._("Rotation")
        );
        rotButton.setChecked(true);

        var scaButton = DuScriptUI.checkBox(
            propsGroup,
            '',
            w16_scale,
            i18n._("Scale")
        );
        scaButton.setChecked(true);

        var opaButton = DuScriptUI.checkBox(
            propsGroup,
            '',
            w16_opacity,
            i18n._("Opacity")
        );
        opaButton.setChecked(true);

        var masksButton = DuScriptUI.checkBox(
            propsGroup,
            '',
            w16_mask,
            i18n._("Masks")
        );
        masksButton.setChecked(true);

        var fxButton = DuScriptUI.checkBox(
            propsGroup,
            '',
            w16_fx,
            i18n._("Effects")
        );
        fxButton.setChecked(true);

        var allPropsButton = DuScriptUI.checkBox(
            propsGroup,
            '',
            w16_props,
            i18n._("All properties")
        );
        allPropsButton.setChecked(true);

        allPropsButton.onClick = function() {
            var checked = allPropsButton.checked;
            posButton.setChecked(checked);
            rotButton.setChecked(checked);
            scaButton.setChecked(checked);
            opaButton.setChecked(checked);
            masksButton.setChecked(checked);
            fxButton.setChecked(checked);
        };

        function getMatchNames() {
            var props = [];
            if (!allPropsButton.checked) {
                if (posButton.checked) {
                    props.push('ADBE Position');
                    props.push('ADBE Vector Position');
                    props.push('ADBE Position_0');
                    props.push('ADBE Position_1');
                    props.push('ADBE Position_2');
                }
                if (rotButton.checked) {
                    props.push('ADBE Rotate Z');
                    props.push('ADBE Rotate Y');
                    props.push('ADBE Rotate X');
                    props.push('ADBE Orientation');
                    props.push('ADBE Vector Rotation');
                }
                if (scaButton.checked) {
                    props.push('ADBE Scale');
                    props.push('ADBE Vector Scale');
                }
                if (opaButton.checked) {
                    props.push('ADBE Opacity');
                    props.push('ADBE Vector Group Opacity');
                }
                if (masksButton.checked) {
                    props.push('ADBE Mask Parade');
                }
                if (fxButton.checked) {
                    props.push('ADBE Effect Parade');
                }
            }
            return props;
        }

        var offsetSelector = DuScriptUI.selector(runOptionsPopup.content);
        offsetSelector.addButton(
            i18n._("Offset values"),
            w16_offset,
            i18n._("Offset current values.")
        );
        offsetSelector.addButton(
            i18n._("Absolute"),
            w16_locator,
            i18n._("Absolute values (replaces current values).")
        );
        offsetSelector.setCurrentIndex(1);

        var reverseButton = DuScriptUI.checkBox(
            runOptionsPopup.content,
            i18n._("Reverse keyframes"),
            undefined,
            i18n._("Reverses the animation in time.")
        );

        DuScriptUI.separator(runOptionsPopup.content);

        var applyButton = DuScriptUI.button(
            runOptionsPopup.content,
            i18n._("Apply"),
            w12_check,
            ''
        );

        applyButton.onClick = lib.runItem;

        function getMatchNames() {
            var props = [];
            if (!allPropsButton.checked) {
                if (posButton.checked) {
                    props.push('ADBE Position');
                    props.push('ADBE Vector Position');
                    props.push('ADBE Position_0');
                    props.push('ADBE Position_1');
                    props.push('ADBE Position_2');
                }
                if (rotButton.checked) {
                    props.push('ADBE Rotate Z');
                    props.push('ADBE Rotate Y');
                    props.push('ADBE Rotate X');
                    props.push('ADBE Orientation');
                    props.push('ADBE Vector Rotation');
                }
                if (scaButton.checked) {
                    props.push('ADBE Scale');
                    props.push('ADBE Vector Scale');
                }
                if (opaButton.checked) {
                    props.push('ADBE Opacity');
                    props.push('ADBE Vector Group Opacity');
                }
                if (masksButton.checked) {
                    props.push('ADBE Mask Parade');
                }
                if (fxButton.checked) {
                    props.push('ADBE Effect Parade');
                }
            }
            return props;
        }

        function runItem( f ) {
            // Add to recent and most used
            var a = getCreateLibEntry(f);
            a.count++;
            updateLibEntry(a);
            // Update recent
            addToRecent(a);
        }

        lib.onRun = function (item) {
            // Build matchname list
            var props = getMatchNames();

            // Load animation
            DuIO.Animation.fromJson(
                item.data,
                undefined,
                settingsKeysSelector.index == 1,
                props,
                offsetSelector.index == 0,
                reverseButton.checked
            );
            runItem(item.data);
        };

        lib.onCtrlRun = function (item) {
            // Build matchname list
            var props = getMatchNames();

            DuIO.Animation.fromJson(
                item.data,
                undefined,
                settingsKeysSelector.index == 1,
                props,
                true,
                reverseButton.checked
            );

            runItem(item.data);
        };

        lib.onAltRun = function (item) {
            // Build matchname list
            var props = getMatchNames();

            DuIO.Animation.fromJson(
                item.data,
                undefined,
                settingsKeysSelector.index == 1,
                props,
                offsetSelector.index == 0,
                true
            );

            runItem(item.data);
        };

        lib.onCtrlAltRun = function (item) {
            // Build matchname list
            var props = getMatchNames();

            DuIO.Animation.fromJson(
                item.data,
                undefined,
                settingsKeysSelector.index == 1,
                props,
                true,
                true
            );

            runItem(item.data);
        };
    };

    var catNameEditor = DuScriptUI.stringPrompt(
        i18n._("Edit category name"),
        i18n._("New Category")
    );

    var animCreateEditor = DuScriptUI.popUp( i18n._("Create animation") );
    animCreateEditor.content.alignment = ['fill', 'top'];

    var animCreateBakeButton = DuScriptUI.checkBox( animCreateEditor.content, {
        text: i18n._("Bake Expressions"),
        image: w12_expression_baker
    });

    animCreateNameEdit = DuScriptUI.editText(
        animCreateEditor.content,
        '',
        '',
        '',
        i18n._("Animation name")
    );

    var animCreateOKButton = DuScriptUI.button(
        animCreateEditor.content,
        i18n._("OK"),
        DuScriptUI.Icon.CHECK,
        i18n._("Save animation."),
        false,
        'row',
        'center'
    );
    animCreateOKButton.onClick = function() {
        var newName = animCreateNameEdit.text;
        if (newName == '') return;

        var comp = DuAEProject.getActiveComp();
        if (!comp) return;

        // Create
        // Get the containing folder.
        var cat = lib.currentCategory;
        var folderPath = libFolder.absoluteURI;
        if (cat.data instanceof Folder) folderPath = cat.data.absoluteURI;
        
        // The file
        newName = DuPath.fixName(newName, '_');
        var saveFile = new File(folderPath + '/' + newName + '.duio');
        var ok = true;
        if (saveFile.exists) ok = confirm(i18n._("This animation already exists.\nDo you want to overwrite it?"));
        if (!ok) return;

        // Bake expressions
        var props = DuAEComp.getSelectedProps();
        if (animCreateBakeButton.checked) {
            for (var i = 0, n = props.length; i < n; i++) {
                var p = new DuAEProperty(props[i]);
                p.bakeExpressions(DuAEExpression.BakeAlgorithm.PRECISE, 1.0);
            }
            for (var i = 0, n = props.length; i < n; i++) {
                var p = new DuAEProperty(props[i]);
                p.selectKeys(0, comp.duration);
            }
        }
        DuIO.Animation.toJson(saveFile);

        // Save thumbnail
        var thumbnailFile = new File(folderPath + '/' + newName + '.png');
        DuAEComp.thumbnail(thumbnailFile, [32, 32]);

        animCreateEditor.hide();

        lib.refresh();
    };

    var animEditorPopup = DuScriptUI.popUp( i18n._("Animation settings.") );
    animEditorPopup.content.alignment = ['fill','top'];
    animEditorPopup.editing = null;

    var animEditorButtonsGroup = DuScriptUI.toolBar(animEditorPopup.content);

    var animEditorUpdateThumbButton = animEditorButtonsGroup.addButton(
        i18n._("Update thumbnail"),
        w16_update_thumbnail,
        i18n._("Updates the thumbnail for the selected item.")
    );
    animEditorUpdateThumbButton.alignment = ['center', 'top'];
    animEditorUpdateThumbButton.onClick = function() {
        if (!animEditorPopup.editing) return;
        var folderPath = animEditorPopup.editing.parent.absoluteURI;
        var fileName = DuPath.getBasename( animEditorPopup.editing );
        // Save thumbnail
        var thumbnailFile = new File(folderPath + '/' + fileName + '.png');
        DuAEComp.thumbnail(thumbnailFile, [32, 32]);

        animEditorPopup.hide();
        // Update list
        lib.refresh();
    };
    
    var animEditorUpdateAnimButton = animEditorButtonsGroup.addButton(
        i18n._("Update animation"),
        w16_update_anim,
        i18n._("Updates the current animation.")
    );
    animEditorUpdateAnimButton.alignment = ['center', 'top'];
    animEditorUpdateAnimButton.onClick = function() {
        if (!animEditorPopup.editing) return;
        DuIO.Animation.toJson(animEditorPopup.editing);

        animEditorPopup.hide();
    };

    // For now, can't move between categories. Just move them from their folders
    var animEditorCatSelector = DuScriptUI.selector(animEditorPopup.content);
    animEditorCatSelector.onChange = function () {
        if (!animEditorPopup.editing) return;

        // Keep prev path to update lib metadata
        var oldURI = animEditorPopup.editing.absoluteURI;

        var newFolder = animEditorCatSelector.currentData;
        if (!newFolder) return;
        // Move file and thumb to the new folder
        var newFolderPath = newFolder.absoluteURI + '/';
        var fileName = DuPath.getName( animEditorPopup.editing );
        var thumbPath = DuPath.switchExtension( animEditorPopup.editing, 'png' );
        var thumbName = DuPath.getName(thumbPath);
        // Move files
        var newFile = DuFile.move( animEditorPopup.editing, newFolderPath + fileName);
        DuFile.move( thumbPath, newFolderPath + thumbName);
        // Update metadata
        if (newFile) updateEntryURI( oldURI, newFile.absoluteURI);

        lib.refresh();
    };

    var animEditorFavButton = DuScriptUI.checkBox(
        animEditorPopup.content,
        i18n._("Favorite"),
        w12_fav
    );
    animEditorFavButton.onClick = function() {
        if (!animEditorPopup.editing) return;

        var a = getCreateLibEntry( animEditorPopup.editing );
        a.favorite = animEditorFavButton.checked;
        updateLibEntry(a);

        animEditorPopup.hide();

        lib.refresh();
    };

    animEditorNameEdit = DuScriptUI.editText(
        animEditorPopup.content,
        '',
        '',
        '',
        i18n._("Animation name")
    );

    var animEditorOKButton = DuScriptUI.button(
        animEditorPopup.content,
        i18n._("OK"),
        DuScriptUI.Icon.CHECK,
        i18n._("Animation settings."),
        false,
        'row',
        'center'
    );
    animEditorOKButton.onClick = animEditorNameEdit.onChange = function() {
        if (!animEditorPopup.editing) return;

        // Keep prev path to update lib metadata
        var oldURI = animEditorPopup.editing.absoluteURI;

        // Rename file and thumbnail
        // Get the containing folder.
        var folderPath = animEditorPopup.editing.parent.absoluteURI;
        // rename
        newName = DuPath.fixName(animEditorNameEdit.text, '_');
        imageFile = new File(DuPath.switchExtension(animEditorPopup.editing, 'png'));
        if (imageFile.exists) imageFile.rename(newName + '.png');
        animEditorPopup.editing.rename(newName + '.duio');

        // Update metadata
        updateEntryURI( oldURI, animEditorPopup.editing.absoluteURI);

        animEditorPopup.hide();

        lib.refresh();
    };

    // Set initial data
    var animationLib = {};
    animationLib.data = 'rootCat';
    animationLib.libType = 'category';
    animationLib.editableItem = true;
    refreshLib(animationLib);

    var libOptions = {};
    libOptions.runButton = false;
    libOptions.canEditFolder = true;
    libOptions.refreshInterval = 20000;
    libOptions.itemName = i18n._("Animation");
    libOptions.runHelpTip = i18n._("Apply selected animation.") + "\n\n" +
        i18n._("[Shift]: More options...");
    libOptions.folderHelpTip = i18n._("Open the folder in the file explorer/finder.") +
        "\n\n" + i18n._("[Alt]: Select the library location.");
    libOptions.addItemHelpTip = i18n._("Add selected animation to library or create new category.");
    libOptions.editItemHelpTip = i18n._("Edit the selected animation or category.");
    libOptions.removeItemHelpTip = i18n._("Remove the selected animation or category from library.");
    libOptions.refreshButton = true;
   
    var lib = DuScriptUI.library(
        animationLibGroup, // container
        animationLib, // library
        libOptions
    );

    lib.onRefresh = refreshLib;
    runOptionsPopup.tieTo(lib.runButton, true);
    lib.onRun = function(item) { runOptionsPopup.build(); runOptionsPopup.built = true; lib.onRun(item); };
    lib.onAltRun = function(item) { runOptionsPopup.build(); runOptionsPopup.built = true; lib.onAltRun(item); };
    lib.onCtrlRun = function(item) { runOptionsPopup.build(); runOptionsPopup.built = true; lib.onCtrlRun(item); };
    lib.onCtrlAltRun = function(item) { runOptionsPopup.build(); runOptionsPopup.built = true; lib.onCtrlAltRun(item); };

    lib.onFolderOpened = function(item, category) {
        if (item) {
            if (item.libType == 'item' || item.libType == 'category') {
                var f = item.data;
                if (f instanceof File || f instanceof Folder) {
                    f.parent.execute();
                    return;
                }  
            }
        }
        else {
            var f = category.data;
            if (f instanceof Folder) {
                f.execute();
                return;
            }  
        }

        if (libFolder.exists) libFolder.execute();
        else alert( i18n._("Sorry, the animation library folder can't be found."));
    };

    lib.onFolderEdited = function() {
        var folder = Folder.selectDialog( i18n._("Select the folder containing the animation library."));
        if (folder == null) return;
        libFolder = folder;
        if (!libFolder.exists) libFolder.create();
        DuESF.scriptSettings.set("animationLibFolder",folder.absoluteURI);
        DuESF.scriptSettings.save();

        // Reload metadata
        animLib = new DuSettings( "Duik_animation_library", libFolder.absoluteURI + "/Duik_animation_library.json", true );
        // Prepare defaults
        if (typeof animLib.data.anims === 'undefined') animLib.data.anims = [];
        if (typeof animLib.data.recent === 'undefined') animLib.data.recent = [];

        // Reload categories and animations
        lib.clear();
        lib.clear();
        refreshLib(animationLib);
    };

    animCreateEditor.tieTo(lib.addItemButton, false, true);
    lib.onAddItem = function( category ) {
        if (!(category.data instanceof Folder) && category.data != 'rootCat') {
            animCreateEditor.block = true;
            alert( i18n._("Sorry, we can't save an animation directly in the current category."));
            return;
        }
        animCreateNameEdit.setText("");
        animCreateEditor.show();
    };

    catNameEditor.tieTo(lib.addCategoryButton);
    lib.onAddCategory = function( category ) {
        if (!(category.data instanceof Folder) && category.data != 'rootCat' ) {
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

        // Get the containing folder.
        var cat = lib.currentCategory;
        var folderPath = libFolder.absoluteURI;
        if (cat.data instanceof Folder) folderPath = cat.data.absoluteURI;

        // Create
        if (catNameEditor.previousString == '') {
            var folder = new Folder(folderPath + '/' + newName);
            if (folder.exists) return;
            folder.create();
        }
        // Rename
        else {
            // Get the current name
            var folder = new Folder(folderPath + '/' + catNameEditor.previousString);
            if (!folder.exists) return;
            folder.rename(newName);
            updateEntryCat( catNameEditor.previousString, newName );
        }

        // Refresh list
        lib.refresh();
    };

    catNameEditor.tieTo(lib.editItemButton, false, true);
    animEditorPopup.tieTo(lib.editItemButton, false, true);
    lib.onEditItem = function(item, category) {
        if (item.libType == 'item') {
            // Set name
            animEditorNameEdit.setText( item.text );

            // Editing
            animEditorPopup.editing = item.data;

            // Set categories
            var allCats = listCategories();
            var cat = DuPath.getName( item.data.parent );
            if (cat == DuPath.getName(libFolder)) cat = i18n._("Uncategorized");
            
            animEditorCatSelector.freeze = true;

            animEditorCatSelector.clear();
            animEditorCatSelector.addButton( i18n._("Uncategorized"), w12_file);
            
            for (var i = 0; i < allCats.length; i++) {
                var n = DuPath.getName( allCats[i] );
                animEditorCatSelector.addButton( n, w12_folder, undefined, allCats[i] );
            }
            
            animEditorCatSelector.setCurrentText( cat );
            
            animEditorCatSelector.freeze = false;

            // Set Fav
            var a = getCreateLibEntry( animEditorPopup.editing );
            animEditorFavButton.setChecked( a.favorite );

            animEditorPopup.show();
        }
        else if (item.data instanceof Folder) {
            catNameEditor.setText(item.text);
            catNameEditor.edit();
            catNameEditor.show();
        }
    };

    lib.onRemoveItem = function (item, category) {
        if (item.libType == 'item') {
            var ok = confirm(DuString.args( i18n._("Are you sure you want to remove the animation \"{#}\"?"), [item.text]));
            if (!ok) return;

            var animFile = item.data;
            var iconFile = new File(DuPath.switchExtension(animFile, 'png'));

            if (animFile.exists) animFile.remove();
            if (iconFile.exists) iconFile.remove();

            // Clean metadata
            cleanAnimLib();
            lib.refresh();
        }
        else if (item.data instanceof Folder) {
            var ok = confirm(DuString.args( i18n._("Are you sure you want to remove the category \"{#}\" and all its animations?"), [item.text]));
            if (!ok) return;
            var folder = item.data;
            DuFolder.wipeFolder(folder);
            lib.refresh();
        }
    };
}