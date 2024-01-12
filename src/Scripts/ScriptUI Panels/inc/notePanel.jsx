function buildNotePanelUI( container )
{
    var noteFile;

    // UTILS
    function reload()
    {
        var type = DuESF.scriptSettings.get("noteType", 0);

        fileGroup.visible = false;
        labelGroup.visible = false;

        if( type == 2 )
        {
            fileGroup.visible = true;
            loadFile();
        }
        else if (type == 1)
        {
            labelGroup.visible = true;
            loadComposition();
        }
        else
        {
            labelGroup.visible = true;
            loadProject();
        }

        return type;
    }

    function loadFile()
    {
        noteFile = new File(DuESF.scriptSettings.get("noteFile", Folder.myDocuments.absoluteURI + "/Duik_notes.txt"));
        if (noteFile.open('r'))
        {
            noteEdit.text = noteFile.read();
            noteFile.close();
        }
    }

    function loadComposition()
    {
        noteEdit.text = "No active composition.";
        var comp = DuAEProject.getActiveComp();
        if (!comp) return;
        noteEdit.text = comp.comment;
        label.setText(comp.name);
    }

    function loadProject()
    {
        noteEdit.text = "Project is not saved.";
        noteEdit.enabled = false;
        label.setText( DuAEProject.name() );
        if (!app.project.file) return;
        var text = DuAEProjectXMP.getPropertyValue('duik_note', "Project notes");
        if (text === null) {
            noteEdit.text = "XMP Metadata can't be loaded.\n" +
                "This is a rare issue with After Effects.\n" + 
                "You can try to re-install or update After Effects to make it work.";
        }
        else {
            noteEdit.enabled = true;
            noteEdit.text = text;
        }
        
    }

    function save()
    {
        var type = DuESF.scriptSettings.get("noteType", 0);
		
        if (type == 2 && noteFile.open('w') )
		{
			noteFile.write(noteEdit.text);
			noteFile.close();
		}
        else if (type == 1)
        {
            var comp = DuAEProject.getActiveComp();
            if (!comp) return;
            comp.comment = noteEdit.text;
        }
        else 
        {
            if (!app.project.file)
            {
                alert( i18n._("The project needs to be saved first."));
                return;
            }

            DuAEProjectXMP.setPropertyValue('duik_note', noteEdit.text);
        }
    }

    var notePanel;
    var contentGroup;
    if (!container) {
        notePanel = DuScriptUI.popUp( "Notes", ['fill','fill'] );
        contentGroup = notePanel.content;
    }
    else {
        notePanel = container;
        contentGroup = container;
    }
    notePanel.reload = reload;

    var topGroup = DuScriptUI.group( contentGroup, 'row' );

    var noteSelector = DuScriptUI.selector( topGroup );
    noteSelector.addButton(
        i18n._("Project"),
        w16_project,
        i18n._("Set a note for the current project")
    );
    noteSelector.addButton(
        i18n._("Composition"),
        w16_composition,
        i18n._("Set a note for the current composition")
    );
    noteSelector.addButton(
        i18n._("Text file"),
        w16_file,
        i18n._("Select the file where to save the notes.")
    );
    noteSelector.onChange = function()
    {
        DuESF.scriptSettings.set("noteType", noteSelector.index);
        DuESF.scriptSettings.save();
        reload();
    }

    var refreshButton = DuScriptUI.button(
        topGroup,
        '',
        DuScriptUI.Icon.UPDATE,
        i18n._("Reloads the note")
    );
    refreshButton.alignment = ['right', 'center'];
    refreshButton.onClick = reload;

    var noteEdit = contentGroup.add('edittext', undefined, '', {multiline: true});
    noteEdit.helpTip = i18n._("New line: Ctrl/Cmd + Enter");
    noteEdit.alignment = ['fill','fill'];
    noteEdit.minimumSize = [200, 300];

    var noteBottomGroup = DuScriptUI.group( contentGroup, 'row');
    noteBottomGroup.alignment = ['fill','bottom'];

    var typeGroup = DuScriptUI.group( noteBottomGroup, 'stacked' );
    typeGroup.alignment = ['fill', 'fill'];

    var labelGroup = DuScriptUI.group( typeGroup, 'row' );

    var label = DuScriptUI.staticText( labelGroup, '' );
    label.alignment = ['fill', 'fill'];

    var fileGroup =  DuScriptUI.group( typeGroup, 'row' );
    
    var fileButton = DuScriptUI.button(
        fileGroup,
        i18n._p("file", "Open..."),
        w16_file,
        i18n._("Select the file where to save the notes."),
        false,
        undefined,
        undefined,
        false // Don't localize (already localized)
    );
    fileButton.alignment = ['left', 'bottom'];
    fileButton.onClick = function()
	{
		//Ask
		var file = File.openDialog("Select the file to open.","Text Files:*.txt,All files:*.*");
		if (file != null)
		{
			noteFile = file;
			DuESF.scriptSettings.set("noteFile", noteFile.absoluteURI);
			DuESF.scriptSettings.save();
            loadFile();
		}
	};

    var saveAsButton = DuScriptUI.button(
        fileGroup,
        i18n._p("file", "Save as..."),
        w16_file,
        i18n._("Select the file where to save the notes."),
        false,
        undefined,
        undefined,
        false // Don't localize (already localized)
    );
    saveAsButton.alignment = ['left', 'bottom'];
    saveAsButton.onClick = function()
	{
		//Ask
		var file = noteFile.saveDlg("Select the file to save.","Text Files:*.txt,All files:*.*");
		if (file != null)
		{
			noteFile = file;
			DuESF.scriptSettings.set("noteFile", noteFile.absoluteURI);
			DuESF.scriptSettings.save();
            save();
		}
	};

    //get back the saved text
	noteSelector.setCurrentIndex( reload() );

    //when text edited
	noteEdit.onChange = save;
    
    notePanel.built = true;
    return notePanel;//*/
}