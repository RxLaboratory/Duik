#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include "ui_mainwindow.h"

#include <QFileDialog>
#include <QFile>
#include <QMouseEvent>

#include "scanner.h"
#include "builder.h"
#include "scriptwidget.h"
#include "toolbarspacer.h"
#include "rainboxui.h"

class MainWindow : public QMainWindow, private Ui::MainWindow
{
    Q_OBJECT

public:
    explicit MainWindow(QWidget *parent = 0);

private slots:
    void scanned(Script *script);
    void built(QString builtScript);
    //actions
    void on_actionOpen_Script_triggered();
    void on_actionRe_scan_script_triggered();
    void on_treeWidget_itemDoubleClicked(QTreeWidgetItem *item, int column);
    void on_actionBuild_triggered();

    //UI
    void maximize();
    /**
     * @brief Sets the UI in waiting mode, when long operations are going on
     * @param wait False to stop waiting mode
     */
    void setWaiting(bool wait = true);

private:

    //WORKER THREADS

    Scanner *scanner;
    Builder *builder;

    //CURRENT

    /**
     * @brief The script currently opened
     */
    Script *currentScript;
    /**
     * @brief The path of the script currently building
     * This is the file where it will be written in the built() slot
     */
    QString savePath;
    /**
     * @brief scanningItem The item being scanned. nullptr if root
     */
    QTreeWidgetItem *scanningItem;


    //METHODS

    void mapEvents();
    bool updateScript(Script *containingScript, Script *newScript);
    QTreeWidgetItem *createIncludeItem(Script *script);

    //UI
#ifndef Q_OS_MAC
    QPushButton *maximizeButton;
    QPushButton *minimizeButton;
#endif
    QPushButton *quitButton;

    /**
     * @brief Is the tool bar currently clicked or not
     */
    bool toolBarClicked;

    /**
     * @brief Drag position
     * Used for drag n drop feature
     */
    QPoint dragPosition;

protected:
    bool eventFilter(QObject *obj, QEvent *event);
};

#endif // MAINWINDOW_H
