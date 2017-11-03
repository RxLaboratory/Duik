#include "rainboxui.h"

#ifdef QT_DEBUG
#include <QtDebug>
#endif

RainboxUI::RainboxUI()
{

}

QString RainboxUI::loadCSS(QString cssFileName)
{
    return loadCSS(QStringList(cssFileName));
}

QString RainboxUI::loadCSS(QStringList cssFileNames)
{
    QString css = "";

    //Build a single CSS with the files
    foreach(QString file,cssFileNames)
    {
        QFile cssFile(file);
        if (cssFile.exists())
        {
            if (cssFile.open(QFile::ReadOnly))
            {
                css += QString(cssFile.readAll());
                cssFile.close();
            }
        }
    }

    //replace variables
    //find values
    QFileInfo cssInfo(cssFileNames[0]);
    QString baseName = cssInfo.path() + "/" + cssInfo.completeBaseName();
    QFile valuesFile(baseName + "-values.rui");
    if (!valuesFile.exists()) valuesFile.setFileName(baseName + "-values");
    if (!valuesFile.exists()) valuesFile.setFileName(baseName + "-values.txt");
    if (!valuesFile.exists()) valuesFile.setFileName(baseName + ".val");
    if (!valuesFile.exists()) valuesFile.setFileName(baseName + ".txt");
    if (!valuesFile.exists()) valuesFile.setFileName(baseName + ".rui");
    if (valuesFile.exists())
    {
        if (valuesFile.open(QFile::ReadOnly))
        {
            css += "\n";
            //read lines
            while(!valuesFile.atEnd())
            {
                QString line = valuesFile.readLine();

                //get value and name
                QRegularExpression re("(@\\S+) *= *(\\S+)");
                QRegularExpressionMatch match = re.match(line);
                if (match.hasMatch())
                {
                    QString name = match.captured(1);
                    QString value = match.captured(2);
                    css.replace(name,value);
                }
            }
        }
    }

#ifdef QT_DEBUG
    qDebug() << "Rainbox UI: Loading CSS";
    //qDebug() << css;
#endif

    return css;
}
