function buildRiggingPanelUI( tab )
{
    // A Spacer
    var spacer = tab.add('group');
    spacer.margins = 0;
    spacer.spacing = 0;
    spacer.size = [-1,3];

    var riggingTabPanel = DuScriptUI.tabPanel( tab, 'column' );

    // Add tabs
    /*var ocoTab = riggingTabPanel.addTab(
        "OCO",
        w16_oco,
        "Import Open Cut-Out file"
    );*/

    var bonesTab = riggingTabPanel.addTab(
        uiMode == 0 ? i18n._("Bones") : "",
        w16_bones,
        "Create bone structures"
    );

    var constraintsTab = riggingTabPanel.addTab(
        uiMode == 0 ? i18n._("Links and constraints") : "",
        w16_constraint,
        "Links and constraints"
    );

    var controllersTab = riggingTabPanel.addTab(
        uiMode == 0 ? i18n._("Controllers") : "",
        w16_controller,
        "Create controllers"
    );

    riggingTabPanel.buttonsGroup.alignment = ['center', 'top'];

    // Keep current panel
    riggingTabPanel.onChange = function()
    {
        DuESF.scriptSettings.set("currentRiggingPanel", riggingTabPanel.index);
        DuESF.scriptSettings.save();
    }

    /*#include "ocoPanel.jsx"
    ocoTab.build = buildOCOUI;*/

    #include "bonesPanel.jsx"
    bonesTab.build = buildBonesUI;

    #include "constraintsPanel.jsx"
    constraintsTab.build = buildConstraintsUI;

    #include "controllersPanel.jsx"
    controllersTab.build = buildControllersUI;

    // Restore current panel
    riggingTabPanel.setCurrentIndex( DuESF.scriptSettings.get("currentRiggingPanel", 0) );
}