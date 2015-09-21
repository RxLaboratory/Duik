#include "installpseudoeffects.h"
#include "qfichier.h"
#include <QDirIterator>

InstallPseudoEffects::InstallPseudoEffects(QObject *parent): QThread(parent)
{

}

void InstallPseudoEffects::run()
{
    QString ver = version[2];
    emit log("\n\n# " + ver);

    bool ok = true;

    //update presetEffects.xml
    emit  log("\n# Adding pseudo-effects to After Effects.");
    if (!updatePresetEffects(version[0]))
    {
        ok = false;
        emit log("\n========= WARNING ===========");
        emit log("The pseudo effects needed by Duik could not be automatically installed in " + ver);
    }

    //copy duik to ScriptUI Panels
    emit log("\n# Copying Duik.");
    if (!updateDuik(version[1]))
    {
        ok = false;
        emit log("\n========= WARNING ===========");
        emit log("Duik could not be automatically copied to " + ver);
    }

    emit finished(ok);
}

bool InstallPseudoEffects::updatePresetEffects(QString presetsFileName)
{
     emit log("# Backuping 'PresetEffects.xml' to 'PresetEffects.xml.bak");
     QFichier xmlDestination(presetsFileName);
     if (!xmlDestination.exists()) return false;
     //backup file
     QFichier backupFile(presetsFileName + ".bak");
     if (backupFile.exists()) backupFile.remove();
     QFile::copy(presetsFileName,presetsFileName + ".bak");
     if (!backupFile.exists()) return false;

     emit log("# Searching for older version of Duik");
     //find Duik, if exists, remove
     QStringList xml = xmlDestination.getLines(false);
     bool inDuik = false;
     for(int i = xml.size()-1;i>=0;i--)
     {
         QString line = xml[i];
         if (line.trimmed().startsWith("<!-- END DUIK"))
         {
             inDuik = true;
         }
         if (inDuik) xml.removeAt(i);
         if (line.trimmed().startsWith("<!-- BEGIN DUIK"))
         {
             inDuik = false;
         }
     }

     emit log("# Loading new version of Duik");
     //load Duik xml </effects>
     QFichier xmlSource(":/duik/xml");
     QStringList xmlDuik = xmlSource.getLines();

     emit log("# Writing new 'PresetEffects.xml'");
     //write new file
     if (!xmlDestination.open(QIODevice::WriteOnly | QIODevice::Text))
     {
         return false;
     }
     QTextStream out(&xmlDestination);
     QString nextLine = "";
     for(int i = 0 ; i < xml.size();i++)
     {
         QString line = xml[i];
         if (i < xml.size()-1) nextLine = xml[i+1];
         else nextLine = "";
         out << line << endl;
         if (nextLine.trimmed().toLower().startsWith("</effects>"))
         {
             foreach(QString duikLine,xmlDuik)
             {
                 out << duikLine << endl;
             }
         }
     }
     xmlDestination.close();

     emit log("# 'PresetEffects.xml' succesfully patched");

     return true;
}

bool InstallPseudoEffects::updateDuik(QString scriptUIpath)
{
    //remove existing Duik
    QDirIterator it(":/duikjsx");
    while (it.hasNext()) {
        it.next();
        QString name = it.fileName();
        QFile old(scriptUIpath + "/" + name);
        QFichier newFile(it.filePath());
        QStringList newLines = newFile.getLines(true);
        if (old.exists()) old.remove();

        if (!old.open(QIODevice::WriteOnly | QIODevice::Text))
        {
            emit log("# Could not open "+ name + " for update");
            return false;
        }
        emit log("# Updating " + name);
        QTextStream out(&old);
        foreach(QString line, newLines)
        {
            out << line << endl;
        }
        old.close();

    }
    return true;
}


void InstallPseudoEffects::setVersion(QStringList v)
{
    version  = v;
}
