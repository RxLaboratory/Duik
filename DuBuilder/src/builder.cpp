#include "builder.h"

Builder::Builder()
{
    script = new Script();

}

void Builder::setScript(Script *s)
{
    script = s;
}

void Builder::run()
{
    QString builtScript = build(script);

    emit built(builtScript);
}

QString Builder::build(Script *s)
{
    QString builtScript = "";

    QFile *scriptFile = s->getFile();

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
    QList<Script*> includedScripts = s->getIncludes();
    while (!scriptFile->atEnd())
    {
        QString line = scriptFile->readLine();
        lineNumber++;
        QString trimmedLine = line.trimmed();

        //check if there's an include
        QRegularExpression reInclude("^#include +");
        QRegularExpression reIncludePath("^#includepath +");

        //if #include
        if (reInclude.match(trimmedLine).hasMatch())
        {
            //get the included script using line number
            QString includedBuild = "";
            foreach(Script *is,includedScripts)
            {
                if (is->getLine() == lineNumber)
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
