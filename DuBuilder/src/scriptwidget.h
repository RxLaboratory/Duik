#ifndef SCRIPTWIDGET_H
#define SCRIPTWIDGET_H

#include "ui_scriptwidget.h"

class ScriptWidget : public QWidget, private Ui::ScriptWidget
{
    Q_OBJECT

public:
    explicit ScriptWidget(QWidget *parent = 0);
};

#endif // SCRIPTWIDGET_H
