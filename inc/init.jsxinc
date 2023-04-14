function init()
{
    // This is required
    DuAEF.init( scriptName, scriptVersion, companyName);

    var osName;
    if (DuSystem.win) osName = 'Windows';
    else osName = 'macOS';

    DuESF.bugReportURL = 'https://rxlaboratory.org/issues?rx-tool=Duik&rx-tool-version=' + scriptVersion +
        '&rx-os=' + osName +
        '&rx-os-version=' + DuString.trim( DuSystem.osVersion ) +
        '&rx-host' + DuESF.hostApplicationName +
        '&rx-host-version=' + DuESF.hostVersion.fullVersion;

    // Setting these may prove useful
    DuESF.chatURL = chatURL;
    
    DuESF.aboutURL = aboutURL;
    DuESF.docURL = docURL;
    DuESF.scriptAbout = scriptAbout;
    DuESF.companyURL = companyURL;
    DuESF.rxVersionURL = rxVersionURL;
    DuESF.isPreRelease = isPreRelease;
    DuESF.translateURL = translateURL;

    // Load the OCO Config
    var folderURI = DuESF.scriptSettings.get("ocoConfigPath", '');
    if (folderURI != '') new OCOConfig(folderURI);
    else new OCOConfig();

    language();
}

function language( )
{
    DuScriptUI.askLanguage( version, thisObj );
}

function version( )
{
    DuScriptUI.checkUpdate( buildUI, thisObj );
}

init();