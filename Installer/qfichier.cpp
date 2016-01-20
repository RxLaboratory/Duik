#include "qfichier.h"
#include <QtDebug>

QFichier::QFichier(QString chemin) :
    QFile(chemin)
{

}

QFichier::QFichier(QFile file) :
    QFile(file.fileName())
{

}

QStringList QFichier::getLines(bool vides)
{
    QStringList liste;
    if (this->exists())
    {
        this->open(QIODevice::ReadOnly | QIODevice::Text);
        QTextStream in(this);

        QString ligne;
        while (!in.atEnd())
        {
            ligne = in.readLine().trimmed();
            if (vides) liste << ligne;
            else if (ligne != "") liste << ligne;
        }
        this->close();

    }
    return liste;
}

QString QFichier::getAll(bool vides)
{
    QString content;
    if (this->exists())
    {
        this->open(QIODevice::ReadOnly | QIODevice::Text);
        QTextStream in(this);

        QString ligne;
        while (!in.atEnd())
        {
            ligne = in.readLine().trimmed();
            if (vides) content += ligne;
            else if (ligne != "") content += ligne;
        }
        this->close();

    }
    return content;
}

QStringList QFichier::getLines(QString recherche, bool vides)
{
    QStringList liste;
    if (this->exists())
    {
        this->open(QIODevice::ReadOnly | QIODevice::Text);
        QTextStream in(this);
        QString ligne;
        while (!in.atEnd())
        {
            ligne = in.readLine().trimmed();
            if (ligne.startsWith(recherche))
            {
                ligne.remove(0,recherche.size());
                if (vides) liste << ligne;
                else if (ligne != "") liste << ligne;

            }
        }
        this->close();
    }
    return liste;
}

QStringList QFichier::getQuotedLines(QString nl, bool vides)
{
    QStringList liste;
    if (this->exists())
    {
        this->open(QIODevice::ReadOnly | QIODevice::Text);
        QTextStream in(this);

        QString ligne;
        while (!in.atEnd())
        {
            ligne = in.readLine().trimmed();

            //on ajoute les lignes suivantes jusqu'à avoir un nombre de guillemets pairs ou avoir atteint la fin
            while (ligne.count("\"")%2 == 1)
            {
                ligne += nl + in.readLine().trimmed();
            }

            if (vides) liste << ligne;
            else if (ligne != "") liste << ligne;
        }
        this->close();

    }
    return liste;
}

QString QFichier::getLine(QString recherche)
{
    QString result = "";
    if (this->exists())
    {
        this->open(QIODevice::ReadOnly | QIODevice::Text);
        QTextStream in(this);
        QString ligne = "";
        while (!in.atEnd())
        {
            ligne = in.readLine().trimmed();
            if (ligne.startsWith(recherche))
            {
                result = ligne.remove(0,recherche.size());
                break;
            }
        }
        this->close();
    }
    return result;
}

QString QFichier::getLine(int i)
{
    int j = 0;
    if (this->exists())
    {
        this->open(QIODevice::ReadOnly | QIODevice::Text);
        QTextStream in(this);
        QString ligne = "";
        while (!in.atEnd())
        {
            ligne = in.readLine().trimmed();
            if (j == i) break;
            j++;
        }
        this->close();
        if (j == i) return ligne;
        else return "";
    }
    else return "";
}

bool QFichier::removeLine(QString line, bool recherche)
{
    bool ok = false;
    if (this->exists())
    {
        QString ligne;
        QStringList liste;
        this->open(QIODevice::ReadOnly | QIODevice::Text);
        QTextStream in(this);
        while (!in.atEnd())
        {
            ligne = in.readLine().trimmed();
            if (recherche && !ligne.startsWith(line)) liste << ligne;
            else if (!recherche && ligne != line) liste << ligne;
        }
        this->close();
        this->open(QIODevice::WriteOnly | QIODevice::Text);
        QTextStream out(this);
        for (int i = 0; i < liste.size(); i++)
        {
            out << "\r\n" << liste[i] ;
        }
        this->close();
        ok = true;
    }
    return ok;
}

void QFichier::appendLine(QString line)
{
        this->open(QIODevice::ReadWrite | QIODevice::Text);
        QTextStream out(this);
        out.seek(0);
        out.readAll();
        if (out.pos() != 0) { out << "\r\n"; }
        out << line;
        this->close();
}

void QFichier::appendLines(QStringList liste)
{
        this->open(QIODevice::ReadWrite | QIODevice::Text);
        QTextStream out(this);
        out.seek(0);
        out.readAll();
        if (out.pos() != 0) { out << "\r\n"; }
        for (int i = 0;i<liste.count();i++)
        {
            QString line = liste[i];
            out << line;
            if (i+1 != liste.count()) out << "\r\n";
        }
        this->close();
}

bool QFichier::prependLine(QString line)
{
    bool ok = false;
    if (this->exists())
    {
        QString ligne;
        QStringList liste;
        this->open(QIODevice::ReadOnly | QIODevice::Text);
        QTextStream in(this);
        liste << line;
        while (!in.atEnd())
        {
            ligne = in.readLine().trimmed();
            liste << ligne;
        }
        this->close();
        this->open(QIODevice::WriteOnly | QIODevice::Text);
        QTextStream out(this);
        for (int i = 0; i < liste.size(); i++)
        {
            out << liste[i];
            if (i+1 != liste.size()) out << "\r\n";
        }
        this->close();
        ok = true;
    }
    return ok;
}

bool QFichier::prependLines(QStringList liste)
{
    bool ok = false;
    if (this->exists())
    {
        this->open(QIODevice::ReadOnly | QIODevice::Text);
        QString ligne;
        QTextStream in(this);
        while (!in.atEnd())
        {
            ligne = in.readLine().trimmed();
            liste << ligne;
        }
        this->close();
        this->open(QIODevice::WriteOnly | QIODevice::Text);
        QTextStream out(this);
        for (int i = 0; i < liste.size(); i++)
        {
            out << liste[i];
            if (i+1 != liste.size()) out << "\r\n";
        }
        this->close();
        ok = true;
    }
    return ok;
}

bool QFichier::setLine(int index, QString line)
{
    bool ok = false;
    if (this->exists())
    {
        QString ligne;
        QStringList liste;
        this->open(QIODevice::ReadOnly | QIODevice::Text);
        QTextStream in(this);
        while (!in.atEnd())
        {
            ligne = in.readLine().trimmed();
            liste << ligne;
        }
        this->close();
        liste[index] = line;
        this->open(QIODevice::WriteOnly | QIODevice::Text);
        QTextStream out(this);
        for (int i = 0; i < liste.size(); i++)
        {
            if ((i+1) != liste.size()) out << liste[i] + "\r\n";
            else out << liste[i];
        }
        this->close();
        ok = true;
    }
    return ok;
}

void QFichier::setLine(QString recherche, QString line)
{
        QString ligne;
        QStringList liste;
        bool found = false;
        this->open(QIODevice::ReadOnly | QIODevice::Text);
        QTextStream in(this);
        while (!in.atEnd())
        {
            ligne = in.readLine().trimmed();
            liste << ligne;
        }
        this->close();
        for (int i = 0;i<liste.count();i++)
        {
            if (liste[i].trimmed().startsWith(recherche))
            {
                liste[i] = recherche + line;
                found = true;
            }
        }
        if (found)
        {
            this->open(QIODevice::WriteOnly | QIODevice::Text);
            QTextStream out(this);
            for (int i = 0; i < liste.size(); i++)
            {
                if (liste[i] != "")
                {
                    if ((i+1) != liste.size()) out << liste[i] + "\r\n";
                    else out << liste[i];
                }
            }
            this->close();
        }
        else appendLine(recherche + line);
}

bool QFichier::clear()
{
    bool ok = false;
    if (this->exists())
    {
        this->open(QIODevice::WriteOnly | QIODevice::Text);
        QTextStream out(this);
        out << "";
        this->close();
        ok = true;
    }
    return ok;
}


