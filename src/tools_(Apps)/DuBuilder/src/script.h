#ifndef SCRIPT_H
#define SCRIPT_H

#include <QString>
#include <QFile>
#include <QFileInfo>
#include <QObject>
#include <QApplication>

class Script : public QObject
{
public:
    Script(QObject *parent = 0);
    Script(QString n, QString path,int l = -1,QObject *parent = 0);
    Script(QString fileName, int l = -1,QObject *parent = 0);
    ~Script();
    void setFileName(QString fileName);
    void setName(QString n);
    void setPath(QString path);
    void setLine(int l);
    void setId(int i);
    int line();
    QString name();
    QFile *file();
    int id();
    bool exists();
    QList<Script*> includes();
    void addInclude(Script *s);
    Script *takeInclude(int i);

private:
    QString _name;
    QFile *_file;
    bool _existing;
    int _line;
    QList<Script*> _includes;
    int _id;
};

#endif // INCLUDEDFILE_H
