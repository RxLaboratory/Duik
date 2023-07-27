/**
 * Performance tools
 * @namespace
 * @category Duik
 */
Duik.Performace = {}

/**
 * The list of performance functions
 */
Duik.CmdLib['Performance'] = {};

/**
 * The performance level for the optimizer
 * @enum {Number}
 * @readonly
 * @ts-ignore */
Duik.Performace.Level = {
    BEST: 1,
	BETTER: 2,
	BALANCED: 3,
	FEATURES: 4
}

/**
 * Optimizes the performance by changing some settings and comp and layer switches. Read the Duik doc for more details.
 * @param {Duik.Performace.Level} [level=Duik.Performace.Level.BETTER] The level of optimization 
 */
Duik.Performace.optimize = function(level) {
    level = def(level, Duik.Performace.Level.BETTER);

    var activeViewer = app.activeViewer;
    var comp = DuAEProject.getActiveComp();

    DuAE.beginUndoGroup(i18n._("Optimize"));

    if (level == Duik.Performace.Level.BEST) {

        // == Duik settings ==

        // Home panel
        DuESF.scriptSettings.set("homeScreenDisabled", false);
        DuESF.scriptSettings.save();

        // Layer controls dialog
        DuESF.scriptSettings.set("layerControlsDialogDisabled", false);
        DuESF.scriptSettings.save();

        // Bone type: light
        OCO.config.set('after effects/bone layer type', 'light');
        // Ctrl type: raster
        OCO.config.set('after effects/controller layer type', 3);

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
    else if (level == Duik.Performace.Level.BETTER) {

        // == Duik settings ==

        // Home panel
        DuESF.scriptSettings.set("homeScreenDisabled", false);
        DuESF.scriptSettings.save();

        // Layer controls dialog
        DuESF.scriptSettings.set("layerControlsDialogDisabled", false);
        DuESF.scriptSettings.save();

        // Bone type: light
        OCO.config.set('after effects/bone layer type', 'light');
        // Ctrl type: raster
        OCO.config.set('after effects/controller layer type', 3);

        // == AE Stuff ==

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

                // guide layers
                if (!l.guideLayer )
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
    else if (level == Duik.Performace.Level.BALANCED) {

        // == Duik settings ==

        // Home panel
        DuESF.scriptSettings.set("homeScreenDisabled", false);
        DuESF.scriptSettings.save();

        // Layer controls dialog
        DuESF.scriptSettings.set("layerControlsDialogDisabled", false);
        DuESF.scriptSettings.save();

        // Bone type: light
        OCO.config.set('after effects/bone layer type', 'full');
        // Ctrl type: raster
        OCO.config.set('after effects/controller layer type', 3);

        // == AE Stuff ==

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
                if ( !l.guideLayer )
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
    else {

        // == Duik settings ==

        // Home panel
        DuESF.scriptSettings.set("homeScreenDisabled", false);
        DuESF.scriptSettings.save();

        // Layer controls dialog
        DuESF.scriptSettings.set("layerControlsDialogDisabled", false);
        DuESF.scriptSettings.save();

        // Bone type: light
        OCO.config.set('after effects/bone layer type', 'full');
        // Ctrl type: raster
        OCO.config.set('after effects/controller layer type', 2);

        // == AE Stuff ==

        if (activeViewer.type === ViewerType.VIEWER_COMPOSITION) {
            for(var i = 0; i < activeViewer.views.length; i++) {
                var v = activeViewer.views[i].options;
                v.fastPreview = FastPreviewType.FP_OFF;
            }
        }
    }

    DuAE.endUndoGroup();
}