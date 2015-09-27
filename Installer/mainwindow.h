#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include "ui_mainwindow.h"
#include <QFileDialog>
#include "qfichier.h"
#include "aecheckbox.h"
#include <QtDebug>
#include <QStandardPaths>
#include <QCheckBox>
#include <QMessageBox>
#include <QDirIterator>
#include <installpseudoeffects.h>
#include <QScrollBar>
#include "custompathwidget.h"


class MainWindow : public QMainWindow, private Ui::MainWindow
{
    Q_OBJECT

public:
    explicit MainWindow(QWidget *parent = 0);

private slots:
    void on_installButton_clicked();
    void on_cancelButton_clicked();
    void aeCheckBox_clicked(QString pe, QString sui, QString ver, bool checked);
    void log(QString l);
    void finished(bool o);

private:
    bool findAeVersions(QString dir);
    bool updatePresetEffects(QString presetsFileName);
    bool updateDuik(QString scriptUIpath);
    QList<QStringList> versionsToInstall;
    bool ok;
};

#endif // MAINWINDOW_H
