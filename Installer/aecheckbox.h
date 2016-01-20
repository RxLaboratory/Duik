#ifndef AECHECKBOX_H
#define AECHECKBOX_H

#include <QCheckBox>
#include <QDir>
#include <QFile>


class AECheckBox : public QCheckBox
{
    Q_OBJECT
public:
    explicit AECheckBox(QWidget *parent = 0);
    AECheckBox(QString text,QWidget *parent = 0);
    void setPresetEffects(QString fileName);
    void setScriptUI(QString sui);
    void setVersion(QString v);

signals:
    void chosen(QString,QString,QString version,bool);

public slots:

private slots:
    void choice(bool checked);


private:
    QString scriptUI;
    QString presetsXML;
    QString version;
};

#endif // AECHECKBOX_H
