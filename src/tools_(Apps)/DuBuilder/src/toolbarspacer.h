#ifndef TOOLBARSPACER_H
#define TOOLBARSPACER_H

#include "ui_toolbarspacer.h"

class ToolBarSpacer : public QWidget, private Ui::ToolBarSpacer
{
    Q_OBJECT

public:
    explicit ToolBarSpacer(QWidget *parent = 0);
};

#endif // TOOLBARSPACER_H
