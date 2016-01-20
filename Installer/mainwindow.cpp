#include "mainwindow.h"

MainWindow::MainWindow(QWidget *parent) :
    QMainWindow(parent)
{
    setupUi(this);
    logEdit->hide();
    //find AE
    bool found = false;
#ifdef Q_OS_WIN
    found = findAeVersions("C:\\Program Files\\Adobe\\");
    bool found2 = findAeVersions("C:\\Program Files (x86)\\Adobe\\");
    if (!found) found = found2;
#endif
#ifdef Q_OS_MAC
    found = findAeVersions("/Applications");
#endif

    if (!found)
    {
        label->setText("The installer could not find any valid installation of After Effects.\nPlease select the folder where it is installed.");
        //add custom path
        CustomPathWidget *cpw = new CustomPathWidget;
        versionsLayout->addWidget(cpw);
        connect(cpw,SIGNAL(chosen(QString,QString,QString,bool)),this,SLOT(aeCheckBox_clicked(QString,QString,QString,bool)));
    }



    versionsLayout->addStretch();
}

bool MainWindow::findAeVersions(QString dir)
{
    QStringList filters("Adobe After Effects *");

    QDir adobeDir(dir);

    adobeDir.setNameFilters(filters);
    adobeDir.setFilter(QDir::Dirs);

    QFileInfoList versionPaths = adobeDir.entryInfoList();

    bool found = false;

    foreach(QFileInfo path,versionPaths)
    {
        QDir aePath(path.absoluteFilePath());

        #ifdef Q_OS_WIN
        QFile presetEffectsFile(path.absoluteFilePath() + "/Support Files/PresetEffects.xml");
        QDir scriptUI(path.absoluteFilePath() + "/Support Files/Scripts/ScriptUI Panels/");
        #endif
        #ifdef Q_OS_MAC
        QFile presetEffectsFile(aePath.absolutePath() + "/" + aePath.dirName() + ".app/Contents/Resources/PresetEffects.xml");
        QDir scriptUI(path.absoluteFilePath() + "/Scripts/ScriptUI Panels/");
        #endif

        if (presetEffectsFile.exists() && scriptUI.exists())
        {
            AECheckBox *aeButton = new AECheckBox(aePath.dirName());
            aeButton->setVersion(aePath.dirName());
            aeButton->setPresetEffects(presetEffectsFile.fileName());
            aeButton->setScriptUI(scriptUI.absolutePath());
            versionsLayout->addWidget(aeButton);
            connect(aeButton,SIGNAL(chosen(QString,QString,QString,bool)),this,SLOT(aeCheckBox_clicked(QString,QString,QString,bool)));
            found = true;
        }
    }
    return found;
}

void MainWindow::on_installButton_clicked()
{
    installButton->hide();
    cancelButton->setEnabled(false);
    logEdit->show();
    versionsArea->hide();
    this->repaint();
    qApp->processEvents();
    ok = true;
    log("# Beginning installation");
    if (versionsToInstall.size() > 0)
    {
        InstallPseudoEffects *install = new InstallPseudoEffects();
        install->setVersion(versionsToInstall[0]);
        versionsToInstall.removeFirst();
        connect(install,SIGNAL(log(QString)),this,SLOT(log(QString)));
        connect(install,SIGNAL(finished(bool)),this,SLOT(finished(bool)));
        install->run();
    }
}

void MainWindow::on_cancelButton_clicked()
{
    qApp->quit();
}

void MainWindow::aeCheckBox_clicked(QString pe, QString sui, QString ver, bool checked)
{
    if (checked)
    {
        QStringList v;
        v << pe << sui << ver;
        versionsToInstall << v;
    }
    else
    {
        for(int i = versionsToInstall.length()-1; i >= 0 ;i--)
        {
            QStringList v = versionsToInstall[i];
            if (v[0] == pe)
            {
                versionsToInstall.removeAt(i);
            }
        }
    }
    if (versionsToInstall.length()) installButton->setEnabled(true);
    else installButton->setEnabled(false);
}

void MainWindow::log(QString l)
{
    logEdit->setText(logEdit->toPlainText() + l + "\n");
    logEdit->verticalScrollBar()->setValue( logEdit->verticalScrollBar()->maximum() );
    this->repaint();
    qApp->processEvents();
}

void MainWindow::finished(bool o)
{
    if (ok) ok = o;

    if (versionsToInstall.size() > 0)
    {
        InstallPseudoEffects *install = new InstallPseudoEffects();
        install->setVersion(versionsToInstall[0]);
        versionsToInstall.removeFirst();
        connect(install,SIGNAL(log(QString)),this,SLOT(log(QString)));
        connect(install,SIGNAL(finished(bool)),this,SLOT(finished(bool)));
        install->run();
    }
    else
    {
        if (ok)
        {
            log("\n# Duik successfully installed.\nMay the gods of animation be with you!");
        }
        else
        {
            log("\n# Installation complete with some errors. See this log for more information.\nYou may need to manually install Duik.\nGo to http://www.duduf.net to get help.");
        }

        cancelButton->setText("Close");
        cancelButton->setEnabled(true);
    }


}

