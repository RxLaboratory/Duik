function buildOCOUI( tab, standAlone )
{
    standAlone = def(standAlone, false);

    // The predefined metarigs
    #include "metarigs.jsx"

    // The category icons
    // English names
    var catIcons = {
        "hominoid": w16_hominoid.toFile(),
        "plantigrade": w16_bunny.toFile(),
        "digitigrade": w16_cat.toFile(),
        "ungulate": w16_horse.toFile(),
        "arthropod": w16_ant.toFile(),
        "bird": w16_bird.toFile(),
        "fish": w16_fish.toFile(),
    }
    // Translated names
    catIcons[ i18n._("Hominoid").toLowerCase() ] = w16_hominoid.toFile()
    catIcons[ i18n._("Plantigrade").toLowerCase() ] = w16_bunny.toFile()
    catIcons[ i18n._("Digitigrade").toLowerCase() ] = w16_cat.toFile()
    catIcons[ i18n._("Ungulate").toLowerCase() ] = w16_horse.toFile()
    catIcons[ i18n._("Arthropod").toLowerCase() ] = w16_ant.toFile()
    catIcons[ i18n._("Bird").toLowerCase() ] = w16_bird.toFile()
    catIcons[ i18n._("Fish").toLowerCase() ] = w16_fish.toFile()

    if (!standAlone) {
        // A Spacer
        var spacer = tab.add('group');
        spacer.margins = 0;
        spacer.spacing = 0;
        spacer.size = [-1,3];
        
        // A title
        DuScriptUI.staticText( tab, "Open Cut-Out" ).alignment = ['center', 'top'];
    }

    // Main stack

    var stackGroup = DuScriptUI.group( tab, 'stacked');
    //stackGroup.margins = 3;
    stackGroup.alignment = ['fill','fill'];

    // Main group
    var mainGroup = DuScriptUI.group( stackGroup, 'column');
    mainGroup.alignment = ['fill','fill'];
    if (uiMode >= 2) mainGroup.spacing = 3;

    // Character name
    var nameEdit = DuScriptUI.editText(
        mainGroup,
        '',
        '',
        '',
        i18n._("Character Name"),
        i18n._("Choose the name of the character.")
    );

    // The Library

    // Get the OCO library metadata
    // Get/create the OCO lib file
    var ocoLibrary = new OCOLibrary();
    var ocoSettings = new DuSettings( "OCO_library", ocoLibrary.settingsAbsoluteURI(), true );
    var folderURI = ocoLibrary.absoluteURI();
    // Prepare defaults
    if (typeof ocoSettings.data.metaRigs === 'undefined') ocoSettings.data.metaRigs = [];
    if (typeof ocoSettings.data.recent === 'undefined') ocoSettings.data.recent = [];

    // Extract the predefined meta-rigs
    // Hominoids
    gorilla.toFile(folderURI + '/' + i18n._("Hominoid") + '/' + i18n._("Gorilla.oco") );
    human_advanced.toFile(folderURI + '/' + i18n._("Hominoid") + '/' + i18n._("Human (advanced).oco") );
    human_simple.toFile(folderURI + '/' + i18n._("Hominoid") + '/' + i18n._("Human (simple).oco") );
    rabbit.toFile(folderURI + '/' + i18n._("Plantigrade") + '/' + i18n._("Rabbit.oco") );
    rooster.toFile(folderURI + '/' + i18n._("Bird") + '/' + i18n._("Rooster.oco") );
    chicken.toFile(folderURI + '/' + i18n._("Bird") + '/' + i18n._("Chicken.oco") );
    dog.toFile(folderURI + '/' + i18n._("Digitigrade") + '/' + i18n._("Dog.oco") );
    fish.toFile(folderURI + '/' + i18n._("Fish") + '/' + i18n._("Fish.oco") );
    pig.toFile(folderURI + '/' + i18n._("Ungulate") + '/' + i18n._("Pig.oco") );
    ant.toFile(folderURI + '/' + i18n._("Arthropod") + '/' + i18n._("Ant.oco") );
    cat.toFile(folderURI + '/' + i18n._("Digitigrade") + '/' + i18n._("Cat.oco") );
    cow.toFile(folderURI + '/' + i18n._("Ungulate") + '/' + i18n._("Cow.oco") );
    shark.toFile(folderURI + '/' + i18n._("Fish") + '/' + i18n._("Shark.oco") );
    horse.toFile(folderURI + '/' + i18n._("Ungulate") + '/' + i18n._("Horse.oco") );
    bear.toFile(folderURI + '/' + i18n._("Plantigrade") + '/' + i18n._("Bear.oco") );
    lemur.toFile(folderURI + '/' + i18n._("Plantigrade") + '/' + i18n._("Lemur.oco") );
    tyrannosaurus.toFile(folderURI + '/' + i18n._("Digitigrade") + '/' + i18n._("Tyrannosaurus.oco") );
    scorpion.toFile(folderURI + '/' + i18n._("Arthropod") + '/' + i18n._("Scorpion.oco") );
    whale.toFile(folderURI + '/' + i18n._("Fish") + '/' + i18n._("Whale.oco") );
    monkey.toFile(folderURI + '/' + i18n._("Plantigrade") + '/' + i18n._("Monkey.oco") );
    penguin.toFile(folderURI + '/' + i18n._("Bird") + '/' + i18n._("Penguin.oco") );

    // Utils

    function getCreateLibEntry( file ) {
        if (file instanceof File) file = file.absoluteURI;
        for (var i = 0; i < ocoSettings.data.metaRigs.length; i++) {
            var a = ocoSettings.data.metaRigs[i];
            if (a.absoluteURI == file) return a;
        }

        var a = {};
        a.absoluteURI = file;
        a.favorite = false;
        a.count = 0;
        return a;
    }

    function updateLibEntry( entry ) {
        for (var i = 0; i < ocoSettings.data.metaRigs.length; i++) {
            var a = ocoSettings.data.metaRigs[i];
            if (a.absoluteURI == entry.absoluteURI) {
                ocoSettings.data.metaRigs[i] = entry;
                ocoSettings.save();
                return;
            }
        }
        ocoSettings.data.metaRigs.push(entry);
        ocoSettings.save();
    }

    function updateEntryURI( oldURI,  newURI ){
        for (var i = 0; i < ocoSettings.data.metaRigs.length; i++) {
            var a = ocoSettings.data.metaRigs[i];
            if (a.absoluteURI == oldURI) { 
                a.absoluteURI = newURI;
                ocoSettings.data.metaRigs[i] = a;
            }
        }
        for (var i = 0; i < ocoSettings.data.recent.length; i++) {
            var a = ocoSettings.data.recent[i];
            if (a == oldURI){
                ocoSettings.data.recent[i] = a;
            }
        }
        ocoSettings.save();
    }

    function updateEntryCat( oldCat,  newCat ){
        for (var i = 0; i < ocoSettings.data.metaRigs.length; i++) {
            var a = ocoSettings.data.metaRigs[i];
            var f = new File(a.absoluteURI);
            var cat = DuPath.getName( f.parent );
            if ( cat == oldCat ) {
                var newPath = ocoLibrary.absoluteURI() + '/' + newCat + '/';
                var fName = DuPath.getName( f );
                a.absoluteURI = newPath + fName;
                ocoSettings.data.metaRigs[i] = a;
            }
        }
        for (var i = 0; i < ocoSettings.data.recent.length; i++) {
            var a = ocoSettings.data.recent[i];
            var f = new File(a);
            var cat = DuPath.getName( f.parent );
            if ( cat == oldCat ) {
                var newPath = ocoLibrary.absoluteURI() + '/' + newCat + '/';
                var fName = DuPath.getName( f );
                ocoSettings.data.recent[i] = newPath + fName;
            }
        }
        ocoSettings.save();
    }

    function cleanOCOLib() {
        for (var i = ocoSettings.data.metaRigs.length - 1; i >= 0 ; i--) {
            var a = ocoSettings.data.metaRigs[i];
            var f = new File(a.absoluteURI);
            if (!f.exists) ocoSettings.data.metaRigs.splice(i, 1);
        }
        for (var i = ocoSettings.data.recent.length - 1; i >= 0 ; i--) {
            var a = ocoSettings.data.recent[i];
            var f = new File(a);
            if (!f.exists) ocoSettings.data.recent.splice(i, 1);
        }
        ocoSettings.save();
    }

    function addToRecent( entry ) {
        var uri = entry.absoluteURI;
        // If the first is not the same
        if (ocoSettings.data.recent.length > 0 && ocoSettings.data.recent[0] == uri) return;

        // Insert
        ocoSettings.data.recent.unshift( uri );

        // Remove others
        for (var i = ocoSettings.data.recent.length -1; i > 0; i--) {
            if (ocoSettings.data.recent[i] == uri) ocoSettings.data.recent.splice(i, 1);
        }

        ocoSettings.save();
    }

    function refreshLib( category ) {
        // Clear
        DuJSObj.clear( category, ['data', 'libType', 'editableData', 'editableItem', 'icon'] );

        var catFolder;

        // Adds an OCO file to the category
        function addItem( f ) {
            var item = {};
            item.data = f;
            item.libType = 'item';
            item.editableData = false;
            item.editableItem = true;

            // Extract icon
            var icon = new File(DuPath.switchExtension(f, 'png'));
            // Extract if it doesn't exist yet
            if (!icon.exists)
                var icon = OCODoc.extractIcon( f );
            if (icon.exists)
                item.icon = icon.absoluteURI;

            category[ DuPath.getBasename(f) ] = item;
        }

        // List special categories
        if (category.data == 'rootCat') {
            catFolder = new Folder(ocoLibrary.absoluteURI());

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
            for (var i = 0; i < ocoSettings.data.metaRigs.length; i++) {
                var a = ocoSettings.data.metaRigs[i];
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
            for (var i = 0; i < ocoSettings.data.recent.length; i++) {
                var a = ocoSettings.data.recent[i];
                var f = new File(a);
                if (!f.exists) continue;
                addItem(f);
            }
            lib.sortMode = 'none';
            return;
        }
        else if (category.data == 'favorites') {
            // add items
            for (var i = 0; i < ocoSettings.data.metaRigs.length; i++) {
                var a = ocoSettings.data.metaRigs[i];
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

                // Add icons to known categories
                var icon  = catIcons[ f.displayName.toLowerCase() ];
                if (icon && icon.exists) cat.icon = icon;

                category[ "> " + DuPath.getName(f) ] = cat;
            }
            // Meta-Rig
            else if ( DuPath.getExtension(f) == 'oco' ) {
                addItem(f);
            }
        }
    }

    function runItem( f ) {
        // Add to recent and most used
        var a = getCreateLibEntry(f);
        a.count++;
        updateLibEntry(a);
        // Update recent
        addToRecent(a);
    }

    function listCategories( ) {
        return DuFolder.getFiles(new Folder(ocoLibrary.absoluteURI()), DuPath.isFolder);
    }

    // UI Popups
    var runOptionsPopup = DuScriptUI.popUp( 'Options' );
    runOptionsPopup.build = function() {

        if (runOptionsPopup.built) return;

        var boneTypeSelector = createBoneTypeSelector(runOptionsPopup.content);

        var envelopBox = DuScriptUI.checkBox(runOptionsPopup.content, {
            text: i18n._("Show envelops"),
            image: w16_envelop
        });

        var noodleBox = DuScriptUI.checkBox(runOptionsPopup.content, {
            text: i18n._("Show noodles"),
            image: w16_noodle
        });

        var compBox = DuScriptUI.checkBox(runOptionsPopup.content, {
            text: i18n._("Create new composition"),
            image: w16_composition
        });

        DuScriptUI.separator(runOptionsPopup.content);

        var applyButton = DuScriptUI.button(
            runOptionsPopup.content,
            i18n._("Create"),
            w12_check,
            i18n._("[Alt]: Create and build in a new composition.")
        );
        applyButton.onClick = lib.runItem;

        lib.onRun = function(item) {
            var doc = OCODoc.fromFile( item.data );
            if (nameEdit.text != "") doc.name = nameEdit.text;

            var createComp = compBox.checked;
            // Create a comp if there's no comp in the project yet
            if (!DuAEProject.containsComp()) createComp = true;


            if (!DuAEProject.setProgressMode(true, true, !createComp )) return;

            DuAE.beginUndoGroup( i18n._("Create OCO Meta-rig") );


            var bones = [];
            if (createComp) bones = doc.toComp( );
            else bones = doc.toComp( DuAEProject.getActiveComp() );
            Duik.Bone.setEnvelopEnabled( envelopBox.checked, bones );
            Duik.Bone.setNoodleEnabled( noodleBox.checked, bones );

            DuAEProject.setProgressMode(false);

            // Open comp
            if (bones.length > 0)
            {
                var comp = bones[0].containingComp;
                comp.openInViewer();
            }

            runItem( item.data );
 
            DuAE.endUndoGroup();
            //DuScriptUI.progressBar.close();
        };

        lib.onAltRun = function(item) {
            var doc = OCODoc.fromFile( item.data );
            if (nameEdit.text != "") doc.name = nameEdit.text;

            //DuScriptUI.progressBar.reset();
            //DuScriptUI.progressBar.show();
            DuAEProject.setProgressMode(true);

            DuAE.beginUndoGroup( i18n._("Create OCO Meta-rig") );

            var layers = doc.toComp();
            Duik.Bone.setEnvelopEnabled( envelopBox.checked, layers );
            Duik.Bone.setNoodleEnabled( noodleBox.checked, layers );

            DuAEProject.setProgressMode(false);

            // Open comp
            if (layers.length > 0)
            {
                var comp = layers[0].containingComp;
                comp.openInViewer();
            }

            runItem( item.data );

            DuAE.endUndoGroup();
            //DuScriptUI.progressBar.close();
        };       
    };

    var catNameEditor = DuScriptUI.stringPrompt(
        i18n._("Edit category name"),
        i18n._("New Category")
    );

    var ocoEditorPopup = DuScriptUI.popUp( i18n._("Animation settings.") );
    ocoEditorPopup.content.alignment = ['fill','top'];
    ocoEditorPopup.editing = null;

    // For now, can't move between categories. Just move them from their folders
    var ocoEditorCatSelector = DuScriptUI.selector(ocoEditorPopup.content);
    ocoEditorCatSelector.onChange = function () {
        if (!ocoEditorPopup.editing) return;

        // Keep prev path to update lib metadata
        var oldURI = ocoEditorPopup.editing.absoluteURI;

        var newFolder = ocoEditorCatSelector.currentData;

        if (!newFolder) return;
        // Move file and thumb to the new folder
        var newFolderPath = newFolder.absoluteURI + '/';
        var fileName = DuPath.getName( ocoEditorPopup.editing );
        var thumbPath = DuPath.switchExtension( ocoEditorPopup.editing, 'png' );
        var thumbName = DuPath.getName(thumbPath);
        // Move files
        var newFile = DuFile.move( ocoEditorPopup.editing, newFolderPath + fileName);
        DuFile.move( thumbPath, newFolderPath + thumbName);
        // Update metadata
        if (newFile) updateEntryURI( oldURI, newFile.absoluteURI);

        lib.refresh();
    };

    var ocoEditorFavButton = DuScriptUI.checkBox(
        ocoEditorPopup.content,
        i18n._("Favorite"),
        w12_fav
    );
    ocoEditorFavButton.onClick = function() {
        if (!ocoEditorPopup.editing) return;

        var a = getCreateLibEntry( ocoEditorPopup.editing );
        a.favorite = ocoEditorFavButton.checked;
        updateLibEntry(a);

        ocoEditorPopup.hide();

        lib.refresh();
    };

    ocoEditorNameEdit = DuScriptUI.editText(
        ocoEditorPopup.content,
        '',
        '',
        '',
        i18n._("Meta-Rig name")
    );

    var ocoEditorOKButton = DuScriptUI.button(
        ocoEditorPopup.content,
        i18n._("OK"),
        DuScriptUI.Icon.CHECK,
        i18n._("Meta-Rig settings."),
        false,
        'row',
        'center'
    );
    ocoEditorOKButton.onClick = ocoEditorNameEdit.onChange = function() {
        if (!ocoEditorPopup.editing) return;

        // Keep prev path to update lib metadata
        var oldURI = ocoEditorPopup.editing.absoluteURI;

        // Rename file and thumbnail
        // Get the containing folder.
        var folderPath = ocoEditorPopup.editing.parent.absoluteURI;
        // rename
        newName = DuPath.fixName(ocoEditorNameEdit.text, '_');
        imageFile = new File(DuPath.switchExtension(ocoEditorPopup.editing, 'png'));
        if (imageFile.exists) imageFile.rename(newName + '.png');
        ocoEditorPopup.editing.rename(newName + '.oco');

        // Update metadata
        updateEntryURI( oldURI, ocoEditorPopup.editing.absoluteURI);

        ocoEditorPopup.hide();

        lib.refresh();
    };

    // Set initial data
    var ocoLib = {};
    ocoLib.data = 'rootCat';
    ocoLib.libType = 'category';
    ocoLib.editableItem = true;
    refreshLib(ocoLib);

    var libOptions = {};
    libOptions.runButton = false;
    libOptions.canEditFolder = true;
    libOptions.refreshInterval = 60000;
    libOptions.itemName = i18n._("Meta-Rig");
    libOptions.runHelpTip = i18n._("Build selected Meta-Rig.") + "\n\n" +
        i18n._("[Alt]: Create and build in a new composition.") + "\n" +
        i18n._("[Shift]: More options...");
    libOptions.folderHelpTip = i18n._("Open the folder in the file explorer/finder.") +
        "\n\n" + i18n._("[Alt]: Select the library location.");
    libOptions.addItemHelpTip = i18n._("Create a new Meta-Rig from selected bones or create a new category.");
    libOptions.editItemHelpTip = i18n._("Edit the selected Meta-Rig or category.");
    libOptions.removeItemHelpTip = i18n._("Remove the selected Meta-Rig or category from library.");
    libOptions.refreshButton = true;

    var lib = DuScriptUI.library(
        mainGroup, // container
        ocoLib, // library
        libOptions
    );

    lib.onRefresh = refreshLib;
    runOptionsPopup.tieTo(lib.runButton, true);
    lib.onRun = function(item) { runOptionsPopup.build(); runOptionsPopup.built = true; lib.onRun(item); };
    lib.onAltRun = function(item) { runOptionsPopup.build(); runOptionsPopup.built = true; lib.onAltRun(item); };

    lib.onFolderOpened = function( item, category ) {
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

        var libFolder = new Folder(ocoLibrary.absoluteURI());
        if (libFolder.exists) libFolder.execute();
        else alert( i18n._("Sorry, the OCO library folder can't be found."));
    }

    lib.onFolderEdited = function() {
        var file = File.saveDialog( i18n._("Select the OCO.config file."), i18n._("OCO Config:*.config,YAML:*.yml;*.yaml,Text files:*.txt,All files:*.*"));
        if (file == null) return;

        new OCOConfig(file);
        ocoLibrary = new OCOLibrary();

        DuESF.scriptSettings.set("ocoConfigPath",OCO.config.absoluteURI());
        DuESF.scriptSettings.save();

        // Reload metadata
        ocoSettings = new DuSettings( "OCO_library", ocoLibrary.settingsAbsoluteURI(), true );
        // Prepare defaults
        if (typeof ocoSettings.data.metaRigs === 'undefined') ocoSettings.data.metaRigs = [];
        if (typeof ocoSettings.data.recent === 'undefined') ocoSettings.data.recent = [];

        // Reload categories and animations
        lib.clear();
        refreshLib(ocoLib);
    };

    lib.onAddItem = function( category ) {
        if (!exportGroup.built) {
            createSubPanel (
                exportGroup,
                i18n._("Create OCO Meta-Rig"),
                mainGroup,
                false
            );

            var layerSelector = DuScriptUI.selector( exportGroup );
            layerSelector.addButton({ text: i18n._("Selected bones"), image: w16_selected_layers});
            layerSelector.addButton({ text: i18n._("All bones"), image: w16_layers});
            layerSelector.setCurrentIndex(1);

            var iconSelector = DuScriptUI.fileSelector(
                exportGroup,
                i18n._("Icon") + ' ',
                true,
                i18n._("Choose an icon to asssicate with the new Meta-Rig"),
                undefined,
                'open',
                undefined,
                'row'
            );

            var ocoNameEdit = DuScriptUI.editText(
                exportGroup,
                '',
                '',
                '',
                i18n._("Meta-Rig Name"),
                i18n._("Choose the name of the meta-rig.")
            );

            var heightEdit = DuScriptUI.editText(
                exportGroup,
                '185',
                i18n._("Character height:") + " ",
                ' ' + i18n._("cm")
            );

            var applyGroup = DuScriptUI.group( exportGroup, 'row' );
            // Valid button
            var applyExportButton = DuScriptUI.button( applyGroup, {
                text: i18n._("Create OCO Meta-Rig"),
                image: DuScriptUI.Icon.CHECK,
                helpTip: i18n._("Export the selected armature to an OCO Meta-Rig file."),
                alignment: 'center'
            });

            applyExportButton.onClick = function ()
            {
                if (ocoNameEdit.text == "")
                {
                    alert(i18n._("Please, choose a name for the meta-rig"));
                    return;
                }

                var h = parseInt(heightEdit.text);
                if (h == 0) h = 185;
                if (isNaN(h)) h = 185;

                var bones = Duik.Bone.get(layerSelector.currentIndex == 0);

                var doc = OCODoc.fromComp(
                    undefined,
                    undefined,
                    bones,
                    undefined,
                    undefined,
                    undefined,
                    h
                );
                if (!doc) return;

                // Get the icon
                var icon = iconSelector.getFile();
                if (icon)
                {
                    doc.icon = icon.absoluteURI;
                    doc.imageEncoding = OCO.ImageEncoding.PNG_BASE64;
                }

                var folder = lib.currentCategory.data;
                if (folder == 'rootCat') folder = new Folder(ocoLibrary.absoluteURI());
                var file = new File( folder.absoluteURI + '/' + ocoNameEdit.text + ".oco" );
                if (file.exists)
                {
                    var ok = confirm( DuString.args(
                        i18n._("The file: \"{#}\" already exists.\nDo you want to overwrite this file?"),
                        [ocoNameEdit.text + ".oco"] )
                    );
                    if (!ok) return;
                }
                var f = doc.toFile( folder.absoluteURI + '/' + ocoNameEdit.text + ".oco");
                lib.refresh();
                exportGroup.visible = false;
                mainGroup.visible = true;
            };

            DuScriptUI.layout(exportGroup);
        }

        if (!(category.data instanceof Folder) && category.data != 'rootCat') {
            alert( i18n._("Sorry, we can't save an OCO file directly in the current category."));
            return;
        }

        mainGroup.visible = false;
        exportGroup.visible = true;
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
        var folderPath = ocoLibrary.absoluteURI();
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
    ocoEditorPopup.tieTo(lib.editItemButton, false, true);
    lib.onEditItem = function(item, category) {
        if (item.libType == 'item') {
            // Set name
            ocoEditorNameEdit.setText( item.text );

            // Editing
            ocoEditorPopup.editing = item.data;

            // Set categories
            var allCats = listCategories();
            var cat = DuPath.getName( item.data.parent );
            if (cat == DuPath.getName(ocoLibrary.absoluteURI())) cat = i18n._("Uncategorized");
            
            ocoEditorCatSelector.freeze = true;

            ocoEditorCatSelector.clear();
            ocoEditorCatSelector.addButton( i18n._("Uncategorized"), w12_file);
            
            for (var i = 0; i < allCats.length; i++) {
                var n = DuPath.getName( allCats[i] );
                ocoEditorCatSelector.addButton( n, w12_folder, undefined, allCats[i] );
            }
            
            ocoEditorCatSelector.setCurrentText( cat );
            
            ocoEditorCatSelector.freeze = false;

            // Set Fav
            var a = getCreateLibEntry( ocoEditorPopup.editing );
            ocoEditorFavButton.setChecked( a.favorite );

            ocoEditorPopup.show();
        }
        else if (item.data instanceof Folder) {
            catNameEditor.setText(item.text.replace('> ', ''));
            catNameEditor.edit();
            catNameEditor.show();
        }
    };

    lib.onRemoveItem = function (item, category) {
        if (item.libType == 'item') {
            var ok = confirm(DuString.args( i18n._("Are you sure you want to remove the Meta-Rig \"{#}\"?"), [item.text]));
            if (!ok) return;

            var ocoFile = item.data;
            var iconFile = new File(DuPath.switchExtension(ocoFile, 'png'));

            if (ocoFile.exists) ocoFile.remove();
            if (iconFile.exists) iconFile.remove();

            // Clean metadata
            cleanOCOLib();
            lib.refresh();
        }
        else if (item.data instanceof Folder) {
            var ok = confirm(DuString.args( i18n._("Are you sure you want to remove the category \"{#}\" and all its meta-rigs?"), [item.text]));
            if (!ok) return;
            var folder = item.data;
            DuFolder.wipeFolder(folder);
            lib.refresh();
        }
    };

    // Autorig button
    var autorigButton = createAutorigButton(mainGroup);
    autorigButton.alignment = ['fill', 'bottom'];

    var exportGroup = DuScriptUI.group( stackGroup, 'column');
    exportGroup.visible = false;
    exportGroup.built = false;

}