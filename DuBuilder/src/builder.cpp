#include "builder.h"
#include <QtDebug>

Builder::Builder()
{
    script = nullptr;

}

void Builder::setScript(Script *s)
{
    script = s;
}

void Builder::run()
{
    QString builtScript = build(script);

    if (builtScript != "") emit built(builtScript);
}

QString Builder::build(Script *s)
{
    if (script == nullptr) return "";
    QString builtScript = "";

    QFile *scriptFile = s->file();

    //Check script file integrity
    if (!scriptFile->exists())
    {
        return builtScript;
    }
    //open file
    if (!scriptFile->open(QIODevice::ReadOnly | QIODevice::Text))
    {
        return builtScript;
    }

    //go with data
    int lineNumber = 0;
    QList<Script*> includedScripts = s->includes();
    while (!scriptFile->atEnd())
    {
        QString line = scriptFile->readLine();
        lineNumber++;
        QString trimmedLine = line.trimmed();

        //check if there's an include
        QRegularExpression reInclude("#include +");
        QRegularExpression reIncludePath("#includepath +");

        //if #include
        if (reInclude.match(trimmedLine).hasMatch())
        {
            qDebug() << "=== MATCH ===" << line ;
            //get the included script using line number
            QString includedBuild = "";
            foreach(Script *is,includedScripts)
            {
                qDebug() << lineNumber ;
                qDebug() << is->name() << is->line();
                if (is->line() == lineNumber)
                {
                    //build the script
                    includedBuild = build(is);
                    break;
                }
            }
            //TODO Use name if not found by line number
            //Needs to fix the name in the Script class

            //accept if build available
            if (includedBuild != "") line = includedBuild;
        }
        //if #includepath
        else if (reIncludePath.match(line).hasMatch())
        {
            //TODO maybe optionnaly remove it
            //right now, do nothing
        }

        //add content
        builtScript += line;
    }

    scriptFile->close();

    return builtScript;
}
