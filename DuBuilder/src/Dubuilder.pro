#-------------------------------------------------
#
# Project created by QtCreator 2017-09-22T09:46:47
#
#-------------------------------------------------

QT       += core gui

greaterThan(QT_MAJOR_VERSION, 4): QT += widgets

TARGET = Dubuilder
TEMPLATE = app


SOURCES += main.cpp\
        mainwindow.cpp \
    scanner.cpp \
    script.cpp \
    scriptwidget.cpp \
    toolbarspacer.cpp \
    builder.cpp

HEADERS  += mainwindow.h \
    scanner.h \
    script.h \
    scriptwidget.h \
    toolbarspacer.h \
    builder.h

FORMS    += mainwindow.ui \
    scriptwidget.ui \
    toolbarspacer.ui

RESOURCES += \
    resources.qrc
