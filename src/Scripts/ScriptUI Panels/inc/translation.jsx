#include "config/translations.jsxinc"

DuESF.preInitMethods.push(function ()
    {
        // Extract translations
        var outputFolder = DuESF.scriptSettings.file.parent.absoluteURI + '/';

        Duik_de_DE.toFile( outputFolder + 'Duik_de.json', false );
        Duik_eo_UY.toFile( outputFolder + 'Duik_eo.json', false );
        Duik_es_ES.toFile( outputFolder + 'Duik_es.json', false );
        Duik_fr_FR.toFile( outputFolder + 'Duik_fr.json', false );
        Duik_ru_RU.toFile( outputFolder + 'Duik_ru.json', false );
        Duik_zh_CN.toFile( outputFolder + 'Duik_zh.json', false );
        Duik_zh_TW.toFile( outputFolder + 'Duik_zh_TW.json', false );
    }
);