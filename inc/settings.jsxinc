// Settings
function buildSettingsUI( tab )
{
    // Home panel
    var homeButton = DuScriptUI.checkBox(
        tab,
        i18n._("Home panel enabled"),
        w16_home,
        i18n._("The home panel helps Duik to launch much faster.\nDisabling it may make the launch time of Duik much slower."),
        i18n._("Home panel disabled"),
        w16_no_home
    );

    var layerControlsAlertButton = DuScriptUI.checkBox(
        tab,
        i18n._("Layer controls alert enabled"),
        w16_dialog,
        i18n._("You can disable the \"Layer controls\" alert dialog which is shown before long operations."),
        i18n._("Layer controls alert disabled"),
        w16_no_dialog
    );

    ui.onResetSettings = function()
    {
        homeButton.setChecked( DuESF.scriptSettings.get("homeScreenDisabled", false ) );
        layerControlsAlertButton.setChecked( DuESF.scriptSettings.get("layerControlsDialogDisabled", false ) );
    };

    ui.onApplySettings = function()
    {
        DuESF.scriptSettings.set("homeScreenDisabled", homeButton.checked);
        DuESF.scriptSettings.set("layerControlsDialogDisabled", layerControlsAlertButton.checked);
        DuESF.scriptSettings.save();
    };
}