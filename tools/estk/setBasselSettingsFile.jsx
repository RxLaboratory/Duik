(function() {

    var settingsFile = File.saveDialog("Save Duik settings to...", "JSON: *.json");
    if (!settingsFile) return;
    app.settings.saveSetting( 'Duik Bassel.2',"settingsFile", settingsFile.absoluteURI );

})();