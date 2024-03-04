#include "config/version.jsxinc"

// Setup!
#include "modules/setup.jsxinc";
if (!askFilesAndNetworkAccess( scriptName ))
{
    alert("Sorry, " + scriptName + " can't run without accessing the files and/or the network.");
    return;
}
