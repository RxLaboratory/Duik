function buildHomePanelUI( tab )
{
    var homePanel = DuScriptUI.group( tab, 'column' );

    var line1 = DuScriptUI.group(homePanel, uiMode >= 2 ? 'row' : 'column');
    line1.alignment = ['fill','fill'];

    var ocoButton = DuScriptUI.button(
        line1,
        i18n._("OCO Meta-rig"),
        w16_oco,
        i18n._("Create, import, export Meta-Rigs and templates")
    );
    ocoButton.alignment = ['fill','fill'];

    var bonesButton = DuScriptUI.button(
        line1,
        i18n._("Bones"),
        w16_bones,
        i18n._("The bones and armatures panel")
    );
    bonesButton.alignment = ['fill','fill'];

    var constraintsButton = DuScriptUI.button(
        line1,
        i18n._("Links & constraints"),
        w16_constraint,
        i18n._("Links & constraints")
    );
    constraintsButton.alignment = ['fill','fill'];

    var controllersButton = DuScriptUI.button(
        line1,
        i18n._("Controllers"),
        w16_controller,
        i18n._("Controllers")
    );
    controllersButton.alignment = ['fill','fill'];

    var line2 = DuScriptUI.group(homePanel, uiMode >= 2 ? 'row' : 'column');
    line2.alignment = ['fill','fill'];

    var automationButton = DuScriptUI.button(
        line2,
        i18n._("Automation & expressions"),
        w16_automation,
        i18n._("Automation & expressions")
    );
    automationButton.alignment = ['fill','fill'];

    var animationButton = DuScriptUI.button(
        line2,
        i18n._("Animation"),
        w16_animation,
        i18n._("Animation")
    );
    animationButton.alignment = ['fill','fill'];

    var cameraButton = DuScriptUI.button(
        line2,
        i18n._("Camera"),
        w16_camera,
        i18n._("Camera")
    );
    cameraButton.alignment = ['fill','fill'];

    var line3 = DuScriptUI.group(homePanel, uiMode >= 2 ? 'row' : 'column');
    line3.alignment = ['fill','fill'];

    var toolsButton = DuScriptUI.button(
        line3,
        i18n._("Tools"),
        w16_tools,
        i18n._("Tools")
    );
    toolsButton.alignment = ['fill','fill'];

    var helpButton = DuScriptUI.button(
        line3,
        i18n._("Get help"),
        w16_help,
        i18n._("Read the doc!")
    );
    helpButton.alignment = ['fill','fill'];

    var donateButton = DuScriptUI.button(
        line3,
        "I \u2665 Duik",
        w16_heart,
        i18n._("Support %1 if you love it!", "Duik")
    );
    donateButton.alignment = ['fill','fill'];

    ocoButton.onClick = function()
    {
        mainTabPanel.setCurrentIndex(0);
    }

    bonesButton.onClick = function()
    {
        mainTabPanel.setCurrentIndex(1);
    }

    constraintsButton.onClick = function()
    {
        mainTabPanel.setCurrentIndex(2);
    }

    controllersButton.onClick = function()
    {
        mainTabPanel.setCurrentIndex(3);
    }

    automationButton.onClick = function()
    {
        mainTabPanel.setCurrentIndex(4);
    }

    animationButton.onClick = function()
    {
        mainTabPanel.setCurrentIndex(5);
    }

    cameraButton.onClick = function()
    {
        mainTabPanel.setCurrentIndex(6);
    }

    toolsButton.onClick = function()
    {
        mainTabPanel.setCurrentIndex(7);
    }

    helpButton.onClick = function()
    {
        DuSystem.openURL( DuESF.docURL );
    }

    donateButton.onClick = function()
    {
        DuSystem.openURL( DuESF.donateURL );
    }


    return homePanel;
}