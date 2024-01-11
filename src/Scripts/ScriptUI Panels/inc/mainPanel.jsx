function buildMainPanelUI( tab )
{
    var mainTabPanel = DuScriptUI.tabPanel( tab );
    DuScriptUI.setBackgroundColor(mainTabPanel.buttonsGroup, DuColor.Color.DARK_GREY);

    // Add tabs
    var ocoTab = mainTabPanel.addTab(
        '',
        w12_oco,
        "OCO\nOpen Cut-Out Format\n\n" +
            i18n._("Create, import, export Meta-Rigs and templates\n\n") + 
            i18n._("[Alt]: Launches the corresponding ScriptUI Stand-Alone panel if it is installed."),
        false
    );

    var bonesTab = mainTabPanel.addTab(
        '',
        w12_bone,
        i18n._("Bones") + "\n\n" +
            i18n._("[Alt]: Launches the corresponding ScriptUI Stand-Alone panel if it is installed."),
        false
    );
    bonesTab.button.onAltClick = function() {DuAE.openScriptUIPanel( "Duik Bones.jsx" ) };

    var constraintsTab = mainTabPanel.addTab(
        '',
        w12_constraints,
        i18n._("Links and constraints") +
            "\n\n" +
            i18n._("[Alt]: Launches the corresponding ScriptUI Stand-Alone panel if it is installed."),
        false
    );
    constraintsTab.button.onAltClick = function() {DuAE.openScriptUIPanel( "Duik Constraints.jsx" ) };

    var controllersTab = mainTabPanel.addTab(
        '',
        w12_controller,
        i18n._("Controllers") +
            "\n\n" +
            i18n._("[Alt]: Launches the corresponding ScriptUI Stand-Alone panel if it is installed."),
        false
    );
    controllersTab.button.onAltClick = function() {DuAE.openScriptUIPanel( "Duik Controllers.jsx" ) };

    var automationTab = mainTabPanel.addTab(
        '',
        w12_automation,
        i18n._("Automation and expressions") +
            "\n\n" +
            i18n._("[Alt]: Launches the corresponding ScriptUI Stand-Alone panel if it is installed."),
        false
    );
    automationTab.button.onAltClick = function() {DuAE.openScriptUIPanel( "Duik Automation and expressions.jsx" ) };

    var animationTab = mainTabPanel.addTab(
        '',
        w12_animation,
        i18n._("Animation") +
            "\n\n" +
            i18n._("[Alt]: Launches the corresponding ScriptUI Stand-Alone panel if it is installed."),
        false
    );
    animationTab.button.onAltClick = function() {DuAE.openScriptUIPanel( "Duik Animation.jsx" ) };

    var cameraTab = mainTabPanel.addTab(
        '',
        w12_camera,
        i18n._("Camera") +
            "\n\n" +
            i18n._("[Alt]: Launches the corresponding ScriptUI Stand-Alone panel if it is installed."),
        false
    );
    cameraTab.button.onAltClick = function() {DuAE.openScriptUIPanel( "Duik Camera.jsx" ) };

    var toolsTab = mainTabPanel.addTab(
        '',
        w12_tools,
        i18n._("Tools")
    );

    var cmdTab = mainTabPanel.addTab(
        '',
        w12_cmd,
        i18n._("Command line") +
            "\n\n" +
            i18n._("[Alt]: Launches the corresponding ScriptUI Stand-Alone panel if it is installed."),
        false
    );
    cmdTab.button.onAltClick = function() {DuAE.openScriptUIPanel( "Duik Cmd.jsx" ) };

    // Notes
    var notesButton = DuScriptUI.button(
        mainTabPanel.buttonsGroup,
        '',
        w12_file,
        "Simple notepad, with auto-save." + "\n\n" +
            i18n._("[Alt]: Launches the corresponding ScriptUI Stand-Alone panel if it is installed.")
    );
    notesButton.alignment = ['right','center'];
    notesButton.onClick = function()
    {
        notePanel.reload();
    }
    notesButton.onAltClick = function() {DuAE.openScriptUIPanel( "Duik Notes.jsx" ) };

    // Include panels

    #include "notePanel.jsx"
    var notePanel = buildNotePanelUI();
    notePanel.tieTo(notesButton);

    #include "homePanel.jsx"
    var homePanel = buildHomePanelUI( mainTabPanel.mainGroup );

    #include "ocoPanel.jsx"
    ocoTab.build = buildOCOUI;

    #include "bonesPanel.jsx"
    bonesTab.build = buildBonesUI;

    #include "constraintsPanel.jsx"
    constraintsTab.build = buildConstraintsUI;

    #include "controllersPanel.jsx"
    controllersTab.build = buildControllersUI;

    #include "automationPanel.jsx"
    automationTab.build = buildAutomationPanelUI;

    #include "animationPanel.jsx"
    animationTab.build = buildAnimationPanelUI;

    #include "cameraPanel.jsx"
    cameraTab.build = buildCameraPanelUI;

    #include "toolsPanel.jsx"
    toolsTab.build = buildToolsPanelUI;

    #include "cmdPanel.jsx"
    cmdTab.build = buildCmdPanel;//*/
    
    // Keep current panel
    mainTabPanel.onChange = function()
    {
        homePanel.visible = false;
        DuESF.scriptSettings.set("currentPanel", mainTabPanel.index);
        DuESF.scriptSettings.save();
    }

    // Restore current panel
    if (DuESF.scriptSettings.get("homeScreenDisabled", false))
        mainTabPanel.setCurrentIndex( DuESF.scriptSettings.get("currentPanel", 0) );
}