#include "duik_required/Duik16_header.jsxinc"

var thisScriptFile = new File($.fileName);
var standAlone = true;
#include "duik_required/Duik16_automations.jsxinc"
ui_palette.alignChildren = ['fill','fill'];
ui_buildAutomations( ui_palette );

#include "duik_required/Duik16_footer.jsxinc"

