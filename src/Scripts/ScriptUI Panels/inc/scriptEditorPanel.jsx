function buildScriptEditorUI( container ) {
    container.editText = container.add('edittext', undefined, "", {
        multiline: true
    });
    container.editText.alignment = ['fill', 'fill'];

    var content = DuESF.scriptSettings.get("scriptEditorContent",
        "/* Write your script here!\n\n" + 
        "   Note that you can use the Duik API inside this editor,\n" + 
        "   Its comprehensive reference is available at http://duik.rxlab.io\n*/ \n\n" + 
        "// Opens the donation page for RxLab to support us:\n" + 
        "DuSystem.openURL( DuESF.donateURL );\n\n" + 
        "// Opens the API comprehensive reference:\n" + 
        "DuSystem.openURL( 'http://duik.rxlab.io' );\n\n");

    container.editText.text = content;

    DuScriptUI.separator( container ).alignment = ['fill', 'bottom'];

    var runButton = DuScriptUI.button(
        container,
        i18n._("Run script"),
        w12_automation,
        i18n._("Run script"),
        false,
        'row',
        'center'
    );
    runButton.alignment = ['fill', 'bottom'];
    runButton.onClick = function() {
        var theScript = container.editText.text;
        // Save script to settings
        DuESF.scriptSettings.set("scriptEditorContent", theScript);
        DuESF.scriptSettings.save();
        DuDebug.safeRun(theScript);
    }

    DuScriptUI.showUI(container);
}