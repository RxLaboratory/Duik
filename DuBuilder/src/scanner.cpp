#include "scanner.h"

#include <QtDebug>

Scanner::Scanner()
{
    script = new Script();
    currentId = 0;
}

void Scanner::setFile(QString fileName)
{
    delete script;
    script = new Script(fileName);
}

void Scanner::setRecursive(bool r)
{
    recursive = r;
}

void Scanner::run()
{
    if ( scan(script) ) emit finished(script);
}

bool Scanner::scan(Script *s)
{
    QFile *scriptFile = s->getFile();
    currentId++;
    s->setId(currentId);


    //Check script file integrity
    if (!scriptFile->exists())
    {
        emit openFailed();
        return false;
    }
    //open file
    if (!scriptFile->open(QIODevice::ReadOnly | QIODevice::Text))
    {
        emit openFailed();
        return false;
    }

    //list of include paths (if found)
    QStringList includePaths;

    //get includes
    int lineNumber = 0;
    while (!scriptFile->atEnd())
    {
        QString line = scriptFile->readLine();
        lineNumber++;
        line = line.trimmed();

        QRegularExpression reInclude("^#include +");
        QRegularExpression reIncludePath("^#includepath +");

        //#include
        if (reInclude.match(line).hasMatch())
        {
            QRegularExpression reIncludeDouble("^#include +\"(.+)\"$");
            QRegularExpressionMatch matchInclude = reIncludeDouble.match(line);
            if (!matchInclude.hasMatch())
            {
                QRegularExpression reIncludeSingle("^#include +'(.+)'$");
                matchInclude = reIncludeSingle.match(line);
            }
            if (matchInclude.hasMatch())
            {
                currentId++;
                QString name = matchInclude.captured(1);
                QString path = checkIncludePath(name,includePaths);
                Script *includedScript = new Script(name,path,lineNumber);
                includedScript->setId(currentId);
                s->addInclude(includedScript);
                //if recursive
                if (recursive && includedScript->exists())
                {
                    scan(includedScript);
                }
            }
        }
        //#includepath
        else if (reIncludePath.match(line).hasMatch())
        {
            //TODO Get paths
        }
    }

    //close file
    scriptFile->close();

    return true;
}

QString Scanner::checkIncludePath(QString name, QStringList includePaths)
{
    QFile *scriptFile = script->getFile();
    QString scriptPath = QFileInfo(*scriptFile).absolutePath();


    //#include
    QRegularExpression reAbsolutePathWin("^[a-z]{1}:");
    reAbsolutePathWin.setPatternOptions(QRegularExpression::CaseInsensitiveOption);
    QRegularExpression reAbsolutePathMac("^/");

    //absolute
    if (reAbsolutePathWin.match(name).hasMatch() || reAbsolutePathMac.match(name).hasMatch() )
    {
        return name;
    }

    //relative

    //test script path
    QString path = addPathSlash(scriptPath) + name;
    if (QFile(path).exists()) return path;

    //test includes
    foreach(QString includePath,includePaths)
    {
        path = addPathSlash(includePath) + name;
        if (QFile(path).exists()) return path;
    }

    if (QFile(name).exists()) return name;

    return scriptPath + "/" + name;
}

QString Scanner::addPathSlash(QString path)
{
    if (!path.endsWith("/") || path.endsWith("\\")) path += "/";
    return path;
}


