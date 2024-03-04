// Settings
function buildSettingsUI( tab )
{
    // Home panel
    var homeButton = createSettingsHomeButton( tab );

    var layerControlsAlertButton = createSettingsLayerControlsButton( tab );

    ui.onResetSettings = function()
    {
        homeButton.setChecked( !DuESF.scriptSettings.get("homeScreenDisabled", false ) );
        layerControlsAlertButton.setChecked( !DuESF.scriptSettings.get("layerControlsDialogDisabled", false ) );
    };

    ui.onApplySettings = function()
    {
        DuESF.scriptSettings.set("homeScreenDisabled", !homeButton.checked);
        DuESF.scriptSettings.set("layerControlsDialogDisabled", !layerControlsAlertButton.checked);
        DuESF.scriptSettings.save();
    };
}