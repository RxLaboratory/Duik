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
    updateCSS(":/styles/default");

    //hide tree when nothing is opened
    treeWidget->hide();

    //initilization
    scanner = new Scanner();
    builder = new Builder();
    savePath = "";

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

    scanner->setFile(currentScript->getFile()->fileName());
    scanner->setRecursive(true);
    scanner->start();
}

void MainWindow::on_treeWidget_itemDoubleClicked(QTreeWidgetItem *item, int column)
{
    //open file
    QString newPath = QFileDialog::getOpenFileName(this,"Where is " + item->text(2) + "?");
#ifdef QT_DEBUG
    qDebug() << "Update Script path ===== " + newPath;
#endif
    if (newPath.isNull() || newPath.isEmpty()) return;

    //TODO scan file

    item->setText(3,newPath);
    item->setText(0,"OK");
    //update data
    int id = item->data(0,Qt::UserRole).toInt();
    updatePath(id,currentScript,newPath);

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
    currentScript = script;
    //empty tree
    treeWidget->clear();

    //main script
    this->setWindowTitle(script->getName());

    foreach(Script *script,script->getIncludes())
    {
        treeWidget->addTopLevelItem(createIncludeItem(script));
    }

    //ready!
    actionRe_scan_script->setEnabled(true);
    actionBuild->setEnabled(true);
    actionCollect_Files->setEnabled(true);

    setWaiting(false);
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

    //status
    QString status = "MISSING";
    if (script->exists()) status = "OK";

    //path
    QFile *scriptFile = script->getFile();
    QString path = QFileInfo(*scriptFile).absoluteFilePath();

    attributes << status << QString::number(script->getLine()) << script->getName() << path;

    QTreeWidgetItem *scriptItem = new QTreeWidgetItem(attributes);
    scriptItem->setData(0,Qt::UserRole,script->getId());

    //add children
    foreach(Script *s,script->getIncludes())
    {
        scriptItem->addChild(createIncludeItem(s));
    }

    return scriptItem;
}

bool MainWindow::updatePath(int id, Script *script, QString path)
{
    //test this script
    if (script->getId() == id)
    {
        script->setFileName(path);
        return true;
    }
    //test includes
    foreach(Script *s,script->getIncludes())
    {
        if (updatePath(id, s, path)) return true;
    }
    return false;
}

// UI

void MainWindow::updateCSS(QString cssFileName)
{
    QString css = "";

    QFile cssFile(cssFileName);
    if (cssFile.exists())
    {
        cssFile.open(QFile::ReadOnly);
        css = QString(cssFile.readAll());
        cssFile.close();
    }

    qApp->setStyleSheet(css);
}

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
