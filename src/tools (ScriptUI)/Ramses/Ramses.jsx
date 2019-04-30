/*
    Ramses - The Rainbox Asset Manager
    (c) 2019 Nicolas Dufresne & Rainbox Productions

    This file is part of Ramses.

    Ramses is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Ramses is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Ramses. If not, see <http://www.gnu.org/licenses/>.
*/

//encapsulate the script in a function to avoid global variables
( function( thisObj ) {
    //================
    var version = '0.0.0-a';
    var scriptName = "Ramses";
    //================
    #include DuAEF.jsxinc

    // ================ SETTINGs ==============

    // Restores the default settings
    //TODO move in DuAEF.DuSettings along with a function to set defaults
    function setDefaultSettings( s ) {
        s.data.debugMode = true;
        s.data.versionFolderName = '_versions';
        s.data.wipName = 'WIP';
        s.save();
    }

    // Create/load settings
    var settings = new DuSettings( "Ramses" );
    setDefaultSettings( settings );


    // temp debug mode
    DuAEF.debug = settings.data.debugMode;


    // ================ FUNCTIONS =============
    //MAIN

//TODO mark versions as WIP or Published
    function saveProject(increment, publish) {

        if (typeof increment === 'undefined') increment = false;
        if (typeof publish === 'undefined') publish = false;

        var projectFile = app.project.file;
        var projectPath = projectFile.path;
        var projectName = '';

        // == save WIP project ==

        if ( projectFile ) {
            //Adds WIP in the name if not already there
            var projectName = DuAEF.DuJS.Fs.getBasename( projectFile );
            if ( DuAEF.DuJS.String.endsWith( projectName, settings.data.wipName ) ) {
                projectName = projectName.substring( 0, projectName.length - settings.data.wipName.length - 1 );
            }
        } else {
            //todo demander destination
            return;
        }

        var saveName = projectPath + '/' + projectName;
        if (!publish) saveName += '_' + settings.data.wipName;
        saveName += '.aep';
        projectFile = new File( saveName );
        app.project.save( projectFile );

        // == Copy version ==

        var versionFolder = new Folder( projectPath + '/' + settings.data.versionFolderName );
        
        // gets current version
        var currentVersion = 0;

        if ( versionFolder.exists ) {
            // gets all exsting versions
            var projectVersionFiles = versionFolder.getFiles(projectName + "_v*" + ".aep");
            for ( var i = 0, num = projectVersionFiles.length; i < num; i++ ) {
                var f = projectVersionFiles[i];
                if (DuAEF.DuJS.Fs.isFile(f))
                {
                    var fName = DuAEF.DuJS.Fs.getBasename( f );
                    var v = fName.replace(projectName + "_v", '');
                    v = v.replace(".aepx",'');
                    v = v.replace(".aep",'');
                    v = parseInt(v, 10);
                    if (!isNaN(v))
                    {
                        if (v > currentVersion) currentVersion = v;
                    }
                }
            }
        } else {
            versionFolder.create();
        }

        // increment
        if ( increment || currentVersion == 0 ) currentVersion++;

        // copy version
        var currentVersionString = DuAEF.DuJS.Number.convertToString ( currentVersion , 3 );
        var successful = projectFile.copy(versionFolder.absoluteURI + "/" + projectName + "_v" + currentVersionString + ".aep");
        if (!successful) alert("Warning - Error writing file\nThe version could not be backed up properly.");
        return successful;
    }

//TODO clean : removes all wip versions but the highest, and main wip if a more recent final is found

    //UI EVENTS

    function ui_saveButton_clicked ()
    {
        saveProject(false);
    }

    function ui_saveIncrementalButton_clicked ()
    {
        saveProject(true);
    }

    function ui_publishButton_clicked()
    {
        saveProject(true, true);
    }


    // _______ UI SETUP _______
    var ui = DuAEF.DuScriptUI.createUI( thisObj, scriptName );

    // ============ UI CONTENT =================
    ui.contents.orientation = 'row';
    // Save
    ui_saveButton = DuAEF.DuScriptUI.addButton( ui.contents, 'S', '', 'Save project' );
    ui_saveButton.alignment = [ 'left', 'top' ];
    // Save New Version
    ui_saveIncrementalButton = DuAEF.DuScriptUI.addButton( ui.contents, 'S+', '', 'Save project and increment version' );
    ui_saveIncrementalButton.alignment = [ 'left', 'top' ];
    // Publish
    ui_publishButton = DuAEF.DuScriptUI.addButton( ui.contents, 'P', '', 'Validate and publish project' );
    ui_publishButton.alignment = [ 'left', 'top' ];
    // Clean
    ui_cleanButton = DuAEF.DuScriptUI.addButton( ui.contents, 'C', '', 'Cleans the version folder' );
    ui_cleanButton.alignment = [ 'left', 'top' ];

    // ========== CONNECT EVENTS ===============

    ui_saveButton.onClick = ui_saveButton_clicked;
    ui_saveIncrementalButton.onClick = ui_saveIncrementalButton_clicked;
    ui_publishButton.onClick = ui_publishButton_clicked;

    //Show UI
    DuAEF.DuScriptUI.showUI( ui );

} )( this );