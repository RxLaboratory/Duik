#include "AECheckBox.h"

AECheckBox::AECheckBox(QWidget *parent) : QCheckBox (parent)
{
    scriptUI = "";
    presetsXML = "";
    connect(this,SIGNAL(clicked(bool)),this,SLOT(choice(bool)));
}

AECheckBox::AECheckBox(QString text,QWidget *parent) : QCheckBox (text,parent)
{
    scriptUI = "";
    presetsXML = "";
    connect(this,SIGNAL(clicked(bool)),this,SLOT(choice(bool)));
}

void AECheckBox::setPresetEffects(QString fileName)
{
    presetsXML = fileName;
}

void AECheckBox::setScriptUI(QString sui)
{
    scriptUI = sui;
}

void AECheckBox::setVersion(QString v)
{
    version = v;
}

void AECheckBox::choice(bool checked)
{
    emit chosen(presetsXML,scriptUI,version,checked);
}
