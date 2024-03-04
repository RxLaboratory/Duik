(function() {

    var perfButton = DuScriptUI.button(ui.bottomGroup, {
        text: '',
        image: w16_performance,
        helpTip: i18n._("Performance settings and tools")
    });
    
    var perfPopup = DuScriptUI.popUp( i18n._("Performance settings and tools") );
    
    perfPopup.content.alignment = ['fill', 'fill'];
    perfPopup.content.alignChildren = ['fill', 'top'];

    var presetSelector = createPerformancePresetSelector( perfPopup.content );

    createPerformanceButton( perfPopup.content, false, function() {
        Duik.Performace.optimize(presetSelector.currentData);
        homeButton.setChecked( !DuESF.scriptSettings.get("homeScreenDisabled", false ) );
        layerControlsButton.setChecked( !DuESF.scriptSettings.get("layerControlsDialogDisabled", false ) );
        var  btype = 0;
        if (OCO.config.get('after effects/bone layer type', 'full')) btype = 1;
        boneTypeSelector.setCurrentIndex(btype);
        controllerTypeSelector.setCurrentIndex( OCO.config.get('after effects/controller layer type', 3) );
    });

    DuScriptUI.separator(perfPopup.content, i18n._("Duik Settings"));
    
    // Home panel
    var homeButton = createSettingsHomeButton( perfPopup.content );
    homeButton.onClick = function() {
        DuESF.scriptSettings.set("homeScreenDisabled", !homeButton.checked);
        DuESF.scriptSettings.save();
    };
    
    // Layer controls
    var layerControlsButton =  createSettingsLayerControlsButton( perfPopup.content );
    layerControlsButton.onClick = function() {
        DuESF.scriptSettings.set("layerControlsDialogDisabled", !layerControlsButton.checked);
        DuESF.scriptSettings.save();
    };
    
    // Bone type
    var boneTypeSelector = createBoneTypeSelector(perfPopup.content);
    
    // Controller type
    var controllerTypeSelector = createCtrlTypeSelector(perfPopup.content);
    
    DuScriptUI.separator(perfPopup.content, i18n._("Tools") );
    
    createBakeBonesButton(perfPopup.content);

    var ctrlBakeButton = DuScriptUI.button( perfPopup.content, {
        text: i18n._("Bake controllers"),
        image: w16_bake_controller,
        helpTip: i18n._("Bake controllers appearance")
    } );
    ctrlBakeButton.onClick = Duik.Controller.bake;

    createBakeExpButton(perfPopup.content);

    createBakeCompButton(perfPopup.content);
    
    perfPopup.tieTo( perfButton );
    perfPopup.pin();

})();

