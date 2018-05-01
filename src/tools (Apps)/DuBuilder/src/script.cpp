#include "script.h"

#ifdef QT_DEBUG
#include <QtDebug>
#endif

Script::Script(QObject *parent) :
    QObject(parent)
{
    _file = new QFile();
    _name = "";
    _existing = false;
    _line = -1;
    _id = 0;
}

Script::Script(QString n, QString path, int l, QObject *parent) :
    QObject(parent)
{
    _file = new QFile(path);
    _name = n;
    _existing = _file->exists();
    _line = l;
}

Script::Script(QString fileName, int l, QObject *parent) :
    QObject(parent)
{
    _file = new QFile(fileName);
    QFileInfo info(*_file);
    _name = info.completeBaseName();
    _existing = _file->exists();
    _line = l;
}

Script::~Script()
{
    //empty includes
    while(_includes.count() > 0)
    {
        Script *s = _includes.takeAt(0);
        delete s;
    }
}

void Script::setFileName(QString fileName)
{
    _file->setFileName(fileName);
    QFileInfo info(*_file);
    _name = info.completeBaseName();
    _existing = _file->exists();
}

void Script::setName(QString n)
{
    _name = n;
}

void Script::setPath(QString path)
{
    _file->setFileName(path);
    _existing = _file->exists();
}

void Script::setLine(int l)
{
    _line = l;
}

void Script::setId(int i)
{
    _id = i;
}

int Script::line()
{
    return _line;
}

QString Script::name()
{
    return _name;
}

QFile* Script::file()
{
    return _file;
}

int Script::id()
{
    return _id;
}

bool Script::exists()
{
    return _existing;
}

QList<Script *> Script::includes()
{
    return _includes;
}

void Script::addInclude(Script *s)
{
    s->moveToThread(QApplication::instance()->thread());
    s->setParent(this);
    _includes << s;
}

Script *Script::takeInclude(int i)
{
    return _includes.takeAt(i);
}
