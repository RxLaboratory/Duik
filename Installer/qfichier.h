/* 
Author: Nicolas Dufresne
Date: 21 décembre 2012
copyright (c) 2012 Nicolas Dufresne



*/

#ifndef HEADER_QFICHIER
#define HEADER_QFICHIER

#include <QFile>
#include <QTextStream>
#include <QStringList>

class QFichier : public QFile
{
public:
    explicit QFichier(QString chemin);
    explicit QFichier(QFile file);
    QStringList getLines(bool vides = false);
    QStringList getLines(QString recherche,bool vides = false);
    QStringList getQuotedLines(QString nl = "", bool vides = false);
    QString getAll(bool vides = false);
    QString getLine(QString recherche);
    QString getLine(int i);
    bool removeLine(QString line, bool recherche = false);
    void appendLine(QString line);
    void appendLines(QStringList liste);
    bool prependLine(QString line);
    bool prependLines(QStringList liste);
    bool setLine(int index, QString line);
    void setLine(QString recherche, QString line);
    bool clear();

public slots:

private:
};

#endif
