#include "mainwindow.h"
#include <QApplication>
#include "frameless.h"

int main(int argc, char *argv[])
{
    QApplication a(argc, argv);
    MainWindow w;
    FrameLess f(&w);
    w.show();

    return a.exec();
}
