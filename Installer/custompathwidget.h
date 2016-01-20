#ifndef CUSTOMPATHWIDGET_H
#define CUSTOMPATHWIDGET_H

#include "ui_custompathwidget.h"
#include <QFileDialog>
#include <QMessageBox>

class CustomPathWidget : public QWidget, private Ui::CustomPathWidget
{
    Q_OBJECT

public:
    explicit CustomPathWidget(QWidget *parent = 0);
signals:
     void chosen(QString,QString,QString version,bool);
private slots:
    void on_pathEdit_editingFinished();
    void on_pushButton_clicked();
    void on_checkBox_clicked(bool checked);

private:
    bool detectAe(QString dir);
    QString presetsXML;
    QString scriptUI;
    QString version;
};

#endif // CUSTOMPATHWIDGET_H
