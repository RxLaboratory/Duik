(function(thisObj) {

var mainScriptFile = new File($.fileName);

#include "inc/core.jsxinc"

#include "inc/animationLibPanel.jsxinc"
buildAnimationLibPanel( ui.mainGroup );
ui.mainGroup.refreshLib();

#include "inc/ui_show.jsxinc"

})(this);