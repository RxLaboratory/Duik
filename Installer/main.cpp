#include "mainwindow.h"
#include <QApplication>
#include <QFontDatabase>

int main(int argc, char *argv[])
{
    //embed fonts
    QFile res1(":/fonts/bell-gothic-black.ttf");
    if (res1.open(QIODevice::ReadOnly))
    {
        QFontDatabase::addApplicationFontFromData(res1.readAll());
    }
    QFile res2(":/fonts/bell-gothic-bold.ttf");
    if (res2.open(QIODevice::ReadOnly))
    {
        QFontDatabase::addApplicationFontFromData(res2.readAll());
    }
    QFile res3(":/fonts/bell-gothic-light.ttf");
    if (res3.open(QIODevice::ReadOnly))
    {
        QFontDatabase::addApplicationFontFromData(res3.readAll());
    }

    QApplication a(argc, argv);

    MainWindow w;
    w.show();

    return a.exec();
}
