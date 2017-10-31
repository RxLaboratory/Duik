#ifndef SCRIPT_H
#define SCRIPT_H

#include <QString>
#include <QFile>
#include <QFileInfo>

class Script
{
public:
    Script();
    Script(QString n, QString path,int l = -1);
    Script(QString fileName, int l = -1);
    ~Script();
    void setFileName(QString fileName);
    void setName(QString n);
    void setPath(QString path);
    void setLine(int l);
    void setId(int i);
    int getLine();
    QString getName();
    QFile *getFile();
    int getId();
    bool exists();
    QList<Script*> getIncludes();
    void addInclude(Script *s);

private:
    QString name;
    QFile *file;
    bool existing;
    int line;
    QList<Script*> includes;
    int id;
};

#endif // INCLUDEDFILE_H
