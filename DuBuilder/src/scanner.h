#ifndef SCANNER_H
#define SCANNER_H

#include <QObject>
#include <QFile>
#include <QRegularExpressionMatch>
#include <QThread>

#include "script.h"

class Scanner : public QThread
{
    Q_OBJECT

public:
    Scanner();
    void setFile(QString fileName);
    void setRecursive(bool r);
    void run();

signals:
    void finished(Script*);
    void openFailed();
    void invalidFile();

private:
    Script *script;
    bool recursive;
    QString checkIncludePath(QString path, QStringList includePaths);
    QString addPathSlash(QString path);
    bool scan(Script *s);
    int currentId;
};

#endif // SCANNER_H
