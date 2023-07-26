(function() {

    var perfButton = DuScriptUI.button(ui.bottomGroup, {
        text: '',
        image: w16_performance,
        helpTip: i18n._("Performance settings and tools")
    });
    
    var perfPopup = DuScriptUI.popUp( i18n._("Performance settings and tools") );
    
    perfPopup.content.alignment = ['fill', 'fill'];
    perfPopup.content.alignChildren = ['fill', 'top'];

    var presetSelector = DuScriptUI.selector( perfPopup.content );
    presetSelector.addButton(i18n._("Best performance"));
    presetSelector.addButton(i18n._("Better performance"));
    presetSelector.addButton(i18n._("Balanced"));
    presetSelector.addButton(i18n._("More features"));
    presetSelector.setCurrentIndex( DuESF.scriptSettings.get("optimizerMode", 1));
    presetSelector.onChange = function() {
        DuESF.scriptSettings.set("optimizerMode", presetSelector.index);
        DuESF.scriptSettings.save();
    }

    var optimizeButton = DuScriptUI.button( perfPopup.content, {
        text: i18n._("Optimize!"),
        image: w16_performance,
        helpTip: i18n._("Optimizes the balance between features and performance.\nThis will change the Duik settings and some After Effects settings.\nRead the doc for more details!")
    });
    optimizeButton.onClick = function() {

        var activeViewer = app.activeViewer;
        var comp = DuAEProject.getActiveComp();

        DuAE.beginUndoGroup(i18n._("Optimize"));

        // Best perf
        if (presetSelector.index == 0) {

            // == Duik settings ==

            // Home panel
            homeButton.setChecked(true);
            homeButton.onClick();

            // Layer controls dialog
            layerControlsButton.setChecked(true);
            layerControlsButton.onClick();

            // Bone type: light
            boneTypeSelector.setCurrentIndex(1);
            // Ctrl type: raster
            controllerTypeSelector.setCurrentIndex(3);

            // == AE Stuff ==

            // fast preview
            if (activeViewer.type === ViewerType.VIEWER_COMPOSITION) {
                for(var i = 0; i < activeViewer.views.length; i++) {
                    var v = activeViewer.views[i].options;
                    v.fastPreview = FastPreviewType.FP_OFF;
                    v.fastPreview = FastPreviewType.FP_FAST_DRAFT;
                }
            }
            
            // comp optimization
            if (comp) {

                // Lower the resolution
                var limit = Math.floor( comp.width / 480 );
                var f = comp.resolutionFactor;
                if (f[0] < limit) f[0] = limit;
                if (f[1] < limit) f[1] = limit;
                comp.resolutionFactor = f;

                // Motion blur
                comp.motionBlur = false;
                // Frame blending
                comp.frameBlending  = false;

                // Adjust layers
                for(var i = 1; i <= comp.layers.length; i++) {
                    var l = comp.layer(i);

                    var locked = l.locked;
                    l.locked = false;

                    // Draft
                    if (l.quality == LayerQuality.BEST) l.quality = LayerQuality.DRAFT;
                    l.samplingQuality = LayerSamplingQuality.BILINEAR;

                    // Duik specific layers or guide layers
                    if (!Duik.Layer.isType(l, Duik.Layer.Type.BONE ) && 
                        !Duik.Layer.isType(l, Duik.Layer.Type.CONTROLLER ) &&
                        !Duik.Layer.isType(l, Duik.Layer.Type.NULL ) &&
                        !Duik.Layer.isType(l, Duik.Layer.Type.IK ) &&
                        !Duik.Layer.isType(l, Duik.Layer.Type.CONTROLLER_BG ) &&
                        !Duik.Layer.isType(l, Duik.Layer.Type.ZERO ) &&
                        !Duik.Layer.isType(l, Duik.Layer.Type.LOCATOR ) &&
                        !Duik.Layer.isType(l, Duik.Layer.Type.EFFECTOR ) &&
                        !Duik.Layer.isType(l, Duik.Layer.Type.PIN) &&
                        !l.guideLayer )
                    {
                        l.locked = locked;
                        continue;
                    }

                    // no frame blending
                    l.frameBlendingType = FrameBlendingType.NO_FRAME_BLEND;
                    l.motionBlur = false;
                    
                    l.locked = locked;
                }
            }

            app.purge(PurgeTarget.SNAPSHOT_CACHES);
            app.purge(PurgeTarget.IMAGE_CACHES);
        }
        // Better perf
        else if (presetSelector.index == 1) {
            // Duik settings
            homeButton.setChecked(true);
            homeButton.onClick();

            layerControlsButton.setChecked(true);
            layerControlsButton.onClick();

            boneTypeSelector.setCurrentIndex(1);
            controllerTypeSelector.setCurrentIndex(3);

            // Draft bones & conntrollers & pins


            // AE Stuff
            if (activeViewer.type === ViewerType.VIEWER_COMPOSITION) {
                for(var i = 0; i < activeViewer.views.length; i++) {
                    var v = activeViewer.views[i].options;
                    v.fastPreview = FastPreviewType.FP_OFF;
                    v.fastPreview = FastPreviewType.FP_FAST_DRAFT;
                }
            }
            
            if (comp) {
                // Lower the resolution
                var limit = Math.floor( comp.width / 640 );
                var f = comp.resolutionFactor;
                if (f[0] < limit) f[0] = limit;
                if (f[1] < limit) f[1] = limit;
                comp.resolutionFactor = f;

                // Motion blur
                comp.motionBlur = false;
                // Frame blending
                comp.frameBlending  = false;

                // Adjust layers
                for(var i = 1; i <= comp.layers.length; i++) {
                    var l = comp.layer(i);

                    var locked = l.locked;
                    l.locked = false;

                    // Draft
                    l.samplingQuality = LayerSamplingQuality.BILINEAR;

                    // Duik specific layers or guide layers
                    if (!Duik.Layer.isType(l, Duik.Layer.Type.BONE ) && 
                        !Duik.Layer.isType(l, Duik.Layer.Type.CONTROLLER ) &&
                        !Duik.Layer.isType(l, Duik.Layer.Type.NULL ) &&
                        !Duik.Layer.isType(l, Duik.Layer.Type.IK ) &&
                        !Duik.Layer.isType(l, Duik.Layer.Type.CONTROLLER_BG ) &&
                        !Duik.Layer.isType(l, Duik.Layer.Type.ZERO ) &&
                        !Duik.Layer.isType(l, Duik.Layer.Type.LOCATOR ) &&
                        !Duik.Layer.isType(l, Duik.Layer.Type.EFFECTOR ) &&
                        !Duik.Layer.isType(l, Duik.Layer.Type.PIN) &&
                        !l.guideLayer )
                    {
                        l.locked = locked;
                        continue;
                    }

                    // no frame blending
                    l.frameBlendingType = FrameBlendingType.NO_FRAME_BLEND;
                    l.motionBlur = false;
                    
                    l.locked = locked;
                }
            }

            app.purge(PurgeTarget.SNAPSHOT_CACHES);
            app.purge(PurgeTarget.IMAGE_CACHES);
        }
        // Balanced
        else if (presetSelector.index == 2) {
            homeButton.setChecked(true);
            homeButton.onClick();

            layerControlsButton.setChecked(true);
            layerControlsButton.onClick();

            boneTypeSelector.setCurrentIndex(0);
            controllerTypeSelector.setCurrentIndex(3);

            // AE Stuff
            if (activeViewer.type === ViewerType.VIEWER_COMPOSITION) {
                for(var i = 0; i < activeViewer.views.length; i++) {
                    var v = activeViewer.views[i].options;
                    v.fastPreview = FastPreviewType.FP_OFF;
                    v.fastPreview = FastPreviewType.FP_FAST_DRAFT;
                }
            }

            if (comp) {
                // Lower the resolution
                var limit = Math.floor( comp.width / 960 );
                var f = comp.resolutionFactor;
                if (f[0] < limit) f[0] = limit;
                if (f[1] < limit) f[1] = limit;
                comp.resolutionFactor = f;

                // Motion blur
                comp.motionBlur = false;
                // Frame blending
                comp.frameBlending  = false;

                // Adjust layers
                for(var i = 1; i <= comp.layers.length; i++) {
                    var l = comp.layer(i);

                    var locked = l.locked;
                    l.locked = false;

                    // Duik specific layers or guide layers
                    if (!Duik.Layer.isType(l, Duik.Layer.Type.BONE ) && 
                        !Duik.Layer.isType(l, Duik.Layer.Type.CONTROLLER ) &&
                        !Duik.Layer.isType(l, Duik.Layer.Type.NULL ) &&
                        !Duik.Layer.isType(l, Duik.Layer.Type.IK ) &&
                        !Duik.Layer.isType(l, Duik.Layer.Type.CONTROLLER_BG ) &&
                        !Duik.Layer.isType(l, Duik.Layer.Type.ZERO ) &&
                        !Duik.Layer.isType(l, Duik.Layer.Type.LOCATOR ) &&
                        !Duik.Layer.isType(l, Duik.Layer.Type.EFFECTOR ) &&
                        !Duik.Layer.isType(l, Duik.Layer.Type.PIN) &&
                        !l.guideLayer )
                    {
                        l.locked = locked;
                        continue;
                    }

                    // no frame blending
                    l.frameBlendingType = FrameBlendingType.NO_FRAME_BLEND;
                    if (l.guideLayer) l.motionBlur = false;
                    
                    l.locked = locked;
                }
            }

            app.purge(PurgeTarget.SNAPSHOT_CACHES);
            app.purge(PurgeTarget.IMAGE_CACHES);
        }
        // More featuures
        else {
            homeButton.setChecked(true);
            homeButton.onClick();

            layerControlsButton.setChecked(true);
            layerControlsButton.onClick();

            boneTypeSelector.setCurrentIndex(0);
            controllerTypeSelector.setCurrentIndex(1);

            // AE Stuff
            if (activeViewer.type === ViewerType.VIEWER_COMPOSITION) {
                for(var i = 0; i < activeViewer.views.length; i++) {
                    var v = activeViewer.views[i].options;
                    v.fastPreview = FastPreviewType.FP_OFF;
                }
            }
        }

        DuAE.endUndoGroup();
    };

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

