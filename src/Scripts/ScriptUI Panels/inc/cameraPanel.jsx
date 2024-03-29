function buildCameraPanelUI( tab, standAlone )
{
    standAlone = def(standAlone, false);

    if (!standAlone) {
        // A Spacer
        var spacer = tab.add('group');
        spacer.margins = 0;
        spacer.spacing = 0;
        spacer.size = [-1,3];

        // A title
        DuScriptUI.staticText( tab, i18n._("Cameras") ).alignment = ['center', 'top'];
    }

    // tools
    var toolsGroup = DuScriptUI.toolBar( tab );

    // DuFrame
    var frameButton = toolsGroup.addButton(
        i18n._("Framing guides"),
        w12_frame,
        i18n._("Add guides in the composition to help the composition of the image.\nIncludes thirds, golden ratio, and other standard guides.")
    );
    frameButton.onClick = Duik.Camera.frame;

    // Scale Z-Link
    var scaleZLinkButton = toolsGroup.addButton(
        i18n._("Scale Z-Link"),
        w12_scale_z_link,
        i18n._("Adds an inverse constraint of the scale to the depth (Z position) of the 3D layers, so that their visual size doesn't change with their depth.\nWorks as a toggle: first click activates the effect, next click removes it from the selected layers.")
    );
    scaleZLinkButton.onClick = function() {
        var result = Duik.Camera.scaleZLink();
        if (result == 0) alert( i18n._("There's no camera, please create a camera first."));
        else if (result == -1) alert( i18n._("Nothing selected. Please select a layer first."));
    }

    // A Spacer
    var spacer = tab.add('group');
    spacer.margins = 0;
    spacer.spacing = 0;
    spacer.size = [-1,3];

    // Camera Rig
    var cameraRigButton = DuScriptUI.button(
        tab,
        i18n._("Camera Rig"),
        w16_camera_rig,
        i18n._("Rig the selected camera to make it easier to animate.\nAlso includes nice behaviors like handheld camera or shoulder camera...")
    );
    cameraRigButton.onClick = function() {
        var ctrls = Duik.Camera.rig();
        if (ctrls.length == 0) alert( i18n._("There's no camera, or it's a one-node camera, but a two-node camera is needed.\nPlease, change to or create a two-node camera.") );
    }

    // 2D Camera
    var twoDCameraButton = DuScriptUI.button(
        tab,
        i18n._("2D Camera"),
        w16_2d_camera,
        i18n._("Create a fake camera, working with standard multiplane 2D Layers.\nParent the layers to the control null objects.\nDuplicate these control nulls if you need more levels.\nThis also includes nice behaviors like handheld camera or shoulder camera...")
    );
    twoDCameraButton.onClick = Duik.Camera.twoDCamera;
}