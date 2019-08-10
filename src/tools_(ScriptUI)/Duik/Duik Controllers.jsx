#include "duik_required/Duik16_header.jsxinc"

var thisScriptFile = new File($.fileName);
var standAlone = true;
#include "duik_required/Duik16_controllers.jsxinc"
ui_palette.alignChildren = ['fill','fill'];
ui_buildControllers( ui_palette );

#include "duik_required/Duik16_footer.jsxinc"

