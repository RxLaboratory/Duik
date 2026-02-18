function init()
{
    // This is required
    DuAEF.init( scriptName, scriptVersion, companyName);

    var osName;
    if (DuSystem.win) osName = 'Windows';
    else osName = 'macOS';

    DuESF.bugReportURL = 'https://github.com/RxLaboratory/Duik/issues';

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