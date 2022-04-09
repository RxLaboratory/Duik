(function(thisObj) {

var mainScriptFile = new File($.fileName);

#include "inc/core.jsxinc"

var mainStack = DuScriptUI.group(ui.mainGroup, 'stacked' );
mainStack.alignment = ['fill','fill'];
var libGroup = DuScriptUI.group(mainStack, 'column');
libGroup.alignment = ['fill','fill'];
var editorGroup = DuScriptUI.group(mainStack, 'column');
editorGroup.alignment = ['fill','fill'];
editorGroup.visible = false;

#include "inc/scriptLibPanel.jsxinc"
buildScriptLibPanel( libGroup, editorGroup );

#include "inc/scriptEditorPanel.jsxinc"
createSubPanel(
    editorGroup,
    DuScriptUI.String.SCRIPT_LIB,
    libGroup,
    false
);
buildScriptEditorUI( editorGroup );
editorGroup.edit = function(content) {
    editorGroup.editText.text = content;
    libGroup.visible = false;
    editorGroup.visible = true;
};

#include "inc/ui_show.jsxinc"

})(this);