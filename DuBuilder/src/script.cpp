#include "script.h"

#ifdef QT_DEBUG
#include <QtDebug>
#endif

Script::Script()
{
    file = new QFile();
    name = "";
    existing = false;
    line = -1;
    id = 0;
}

Script::Script(QString n, QString path, int l)
{
    file = new QFile(path);
    name = n;
    existing = file->exists();
    line = l;
}

Script::Script(QString fileName, int l)
{
    file = new QFile(fileName);
    QFileInfo info(*file);
    name = info.completeBaseName();
    existing = file->exists();
    line = l;
}

Script::~Script()
{
    //empty includes
    while(includes.count() > 0)
    {
        Script *s = includes.takeAt(0);
        delete s;
    }
}

void Script::setFileName(QString fileName)
{
    file->setFileName(fileName);
    QFileInfo info(*file);
    name = info.completeBaseName();
    existing = file->exists();
}

void Script::setName(QString n)
{
    name = n;
}

void Script::setPath(QString path)
{
    file->setFileName(path);
    existing = file->exists();
}

void Script::setLine(int l)
{
    line = l;
}

void Script::setId(int i)
{
    id = i;
}

int Script::getLine()
{
    return line;
}

QString Script::getName()
{
    return name;
}

QFile* Script::getFile()
{
    return file;
}

int Script::getId()
{
    return id;
}

bool Script::exists()
{
    return existing;
}

QList<Script *> Script::getIncludes()
{
    return includes;
}

void Script::addInclude(Script *s)
{
    includes << s;
}
