#include "custompathwidget.h"
#include <QtDebug>

CustomPathWidget::CustomPathWidget(QWidget *parent) :
    QWidget(parent)
{
    setupUi(this);
    version = "Adobe After Effects (Custom path)";
}

void CustomPathWidget::on_pathEdit_editingFinished()
{
   detectAe(pathEdit->text());
}

void CustomPathWidget::on_pushButton_clicked()
{
#ifdef Q_OS_WIN
    QString pf = "C:/Program Files/";
#endif

#ifdef Q_OS_MAC
    QString pf = "/Aplpications/";
#endif
    QString dir = QFileDialog::getExistingDirectory(0, "Please select the directory where After Effects is installed", pf);

    if (dir == "") return;

    //look for presetEffects.xml
    detectAe(dir);
}

bool CustomPathWidget::detectAe(QString dir)
{
#ifdef Q_OS_WIN
    QFile pe(dir + "/PresetEffects.xml");
    if (!pe.exists())
    {
        dir += "/Support Files/";
        pe.setFileName(dir + "PresetEffects.xml");
    }

    if (pe.exists())
    {
        presetsXML = pe.fileName();
        scriptUI = dir + "/Scripts/ScriptUI Panels";
        pathEdit->setText(dir);
        checkBox->setChecked(true);
        emit chosen(presetsXML,scriptUI,version,true);
        return true;
    }
    else
    {
        QMessageBox::warning(0,"Invalid folder","Sorry, this folder does not contain a valid installation of After Effects");
        pathEdit->setText("");
        checkBox->setChecked(false);
        emit chosen(presetsXML,scriptUI,version,false);
        return false;
    }
#endif

#ifdef Q_OS_MAC
    QDir test(dir);
    QString aeName = test.dirName();
    QFile pe(dir + "/" + aeName + ".app/Contents/Resources/PresetEffects.xml");
    qDebug() << pe.fileName();

    if (pe.exists())
    {
        presetsXML = pe.fileName();
        scriptUI = dir + "/Scripts/ScriptUI Panels";
        pathEdit->setText(dir);
        checkBox->setChecked(true);
        emit chosen(presetsXML,scriptUI,version,true);
        return true;
    }
    else
    {
        QMessageBox::warning(0,"Invalid folder","Sorry, this folder does not contain a valid installation of After Effects");
        pathEdit->setText("");
        checkBox->setChecked(false);
        emit chosen(presetsXML,scriptUI,version,false);
        return false;
    }
#endif
}

void CustomPathWidget::on_checkBox_clicked(bool checked)
{
    if (checked)
    {
        detectAe(pathEdit->text());
    }
    else
    {
        emit chosen(presetsXML,scriptUI,version,false);
    }
}
