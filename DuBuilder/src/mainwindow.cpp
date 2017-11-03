#include "mainwindow.h"

#include <QtDebug>

MainWindow::MainWindow(QWidget *parent) :
    QMainWindow(parent)
{
    setupUi(this);

    //UI

    //remove right click on toolbar
    mainToolBar->setContextMenuPolicy(Qt::PreventContextMenu);
    //populate toolbar
    ToolBarSpacer *tbs = new ToolBarSpacer();
    mainToolBar->addWidget(tbs);
    //window buttons
#ifndef Q_OS_MAC
    // Maximize and minimize only on linux and windows
    this->setWindowFlags(Qt::FramelessWindowHint);
    maximizeButton = new QPushButton(QIcon(":/icons/maximize"),"");
    minimizeButton = new QPushButton(QIcon(":/icons/minimize"),"");
    mainToolBar->addWidget(minimizeButton);
    mainToolBar->addWidget(maximizeButton);
#endif
    quitButton = new QPushButton(QIcon(":/icons/close"),"");
    mainToolBar->addWidget(quitButton);

    //drag window
    toolBarClicked = false;
    mainToolBar->installEventFilter(this);

    //set style
    QString css = RainboxUI::loadCSS(":/styles/default");
    qApp->setStyleSheet(css);

    //hide tree when nothing is opened
    treeWidget->hide();

    //initilization
    scanner = new Scanner();
    builder = new Builder();
    savePath = "";
    scanningItem = nullptr;
    currentScript = nullptr;

    //connexions
    mapEvents();
}

void MainWindow::mapEvents()
{
    connect(scanner,SIGNAL(finished(Script*)),this,SLOT(scanned(Script*)));
    connect(scanner,SIGNAL(started()),this,SLOT(setWaiting()));
    connect(builder,SIGNAL(built(QString)),this,SLOT(built(QString)));
    connect(builder,SIGNAL(started()),this,SLOT(setWaiting()));

    // Window management
#ifndef Q_OS_MAC
    // Windows and linux
    connect(maximizeButton,SIGNAL(clicked()),this,SLOT(maximize()));
    connect(minimizeButton,SIGNAL(clicked()),this,SLOT(showMinimized()));
#endif
    connect(quitButton,SIGNAL(clicked()),qApp,SLOT(quit()));
}

// ACTIONS

void MainWindow::on_actionOpen_Script_triggered()
{
    //open file
    QString scriptPath = QFileDialog::getOpenFileName(this,"Select script",QString(),"All scripts (*.jsx *.jsxinc *.js);;ExtendScript (*.jsx *.jsxinc);;JavaScript (*.js);;Text (*.txt);;All Files (*.*)");
    if (scriptPath.isNull() || scriptPath.isEmpty()) return;

    //scan
    scanningItem = nullptr;
    scanner->setFile(scriptPath);
    scanner->setRecursive(true);
    scanner->start();
}

void MainWindow::on_actionRe_scan_script_triggered()
{
    //not ready!
    treeWidget->hide();
    actionRe_scan_script->setEnabled(false);
    actionBuild->setEnabled(false);
    actionCollect_Files->setEnabled(false);
    this->setWindowTitle("Builder");
    this->repaint();

    scanningItem = nullptr;
    scanner->setFile(currentScript->file()->fileName());
    scanner->setRecursive(true);
    scanner->start();
}

void MainWindow::on_treeWidget_itemDoubleClicked(QTreeWidgetItem *item, int column)
{
    //open file
    QString newPath = QFileDialog::getOpenFileName(this,"Where is " + item->text(2) + "?");

    if (newPath.isNull() || newPath.isEmpty()) return;

    //scan file
    scanningItem = item;
    scanner->setFile(newPath);
    scanner->setRecursive(true);
    scanner->start();

}

void MainWindow::on_actionBuild_triggered()
{
    savePath = QFileDialog::getSaveFileName(this,"Select script",QString(),"All scripts (*.jsx *.jsxinc *.js);;ExtendScript (*.jsx *.jsxinc);;JavaScript (*.js);;Text (*.txt);;All Files (*.*)");
    if (savePath.isNull() || savePath.isEmpty()) return;

    //build
    builder->setScript(currentScript);
    builder->start();
}

// OTHER SLOTS

void MainWindow::scanned(Script *script)
{
#ifdef QT_DEBUG
    qDebug() << "Got new script ===== " + script->name();
#endif

    if (scanningItem == nullptr)
    {
        delete currentScript;
        currentScript = script;
        currentScript->setParent(this);
        //empty tree
        treeWidget->clear();

        //main script
        this->setWindowTitle(script->name());

        foreach(Script *s,script->includes())
        {
            treeWidget->addTopLevelItem(createIncludeItem(s));
        }

        //ready!
        actionRe_scan_script->setEnabled(true);
        actionBuild->setEnabled(true);
        actionCollect_Files->setEnabled(true);

        setWaiting(false);
    }
    else
    {
        //update display of item
        scanningItem->setText(3,script->file()->fileName());
        scanningItem->setIcon(0,QIcon(":/icons/ok"));
        //remove old childs
        QList<QTreeWidgetItem *> items = scanningItem->takeChildren();
        while(items.count() > 0)
        {
            QTreeWidgetItem *item = items.takeAt(0);
            delete item;
        }
        //update includes list of currentScript
        script->setId(scanningItem->data(0,Qt::UserRole).toInt());
        script->setLine(scanningItem->text(1).toInt());

        updateScript(currentScript,script);

        foreach(Script *s,script->includes())
        {
            scanningItem->addChild(createIncludeItem(s));
        }
        setWaiting(false);
    }

}

void MainWindow::built(QString builtScript)
{
    if (builtScript == "")
    {
        //TODO Display Error
        return;
    }

    QFile saveFile(savePath);
    if ( !saveFile.open(QIODevice::WriteOnly | QIODevice::Text) )
    {
       //TODO Display Error
        return;
    }
    saveFile.write(builtScript.toUtf8());
    saveFile.close();
    builtScript = "";

    setWaiting(false);
}

// METHODS

QTreeWidgetItem *MainWindow::createIncludeItem(Script *script)
{
    QStringList attributes;

    //path
    QFile *scriptFile = script->file();
    QString path = QFileInfo(*scriptFile).absoluteFilePath();

    attributes << "" << QString::number(script->line()) << script->name() << path;

    QTreeWidgetItem *scriptItem = new QTreeWidgetItem(attributes);
    if (script->exists()) scriptItem->setIcon(0,QIcon(":/icons/ok"));
    else scriptItem->setIcon(0,QIcon(":/icons/warning"));
    scriptItem->setData(0,Qt::UserRole,script->id());

    //add children
    foreach(Script *s,script->includes())
    {
        scriptItem->addChild(createIncludeItem(s));
    }

    return scriptItem;
}

bool MainWindow::updateScript(Script *containingScript, Script *newScript)
{

    for( int i = 0 ; i <  containingScript->includes().count() ; i++)
    {
        Script *s = containingScript->includes().at(i);
        if (s == nullptr) continue;
        if (s->id() == newScript->id())
        {
            Script *oldScript = containingScript->takeInclude(i);
            delete oldScript;
            containingScript->addInclude(newScript);
            return true;
        }
        else
        {
            if (updateScript(s,newScript)) return true;
        }
    }
    return false;
}

// UI

void MainWindow::setWaiting(bool wait)
{

    if (wait)
    {
        setCursor(Qt::BusyCursor);
        mainToolBar->setEnabled(false);
        treeWidget->hide();
    }
    else
    {
        setCursor(Qt::ArrowCursor);
        mainToolBar->setEnabled(true);
        treeWidget->show();
    }
    repaint();
}

#ifndef Q_OS_MAC
void MainWindow::maximize()
{

    if (this->isMaximized())
    {
        maximizeButton->setIcon(QIcon(":/icons/maximize"));
        this->showNormal();
    }
    else
    {
        maximizeButton->setIcon(QIcon(":/icons/unmaximize"));
        this->showMaximized();
    }

}
#endif

// EVENTS

bool MainWindow::eventFilter(QObject *obj, QEvent *event)
{
  if (event->type() == QEvent::MouseButtonPress)
  {
      QMouseEvent *mouseEvent = (QMouseEvent*)event;
      if (mouseEvent->button() == Qt::LeftButton)
      {
        toolBarClicked = true;
        dragPosition = mouseEvent->globalPos() - this->frameGeometry().topLeft();
        event->accept();
      }
      return true;
  }
  else if (event->type() == QEvent::MouseMove)
  {
    QMouseEvent *mouseEvent = (QMouseEvent*)event;
    if (mouseEvent->buttons() & Qt::LeftButton && toolBarClicked)
    {
        if (this->isMaximized()) this->showNormal();
        this->move(mouseEvent->globalPos() - dragPosition);
        event->accept();
    }
    return true;
  }
  else if (event->type() == QEvent::MouseButtonRelease)
  {
      toolBarClicked = false;
      return true;
  }
#ifndef Q_OS_MAC
  else if (event->type() == QEvent::MouseButtonDblClick)
  {
      maximize();
      event->accept();
      return true;
  }
#endif
  else
  {
      // standard event processing
      return QObject::eventFilter(obj, event);
  }
}
