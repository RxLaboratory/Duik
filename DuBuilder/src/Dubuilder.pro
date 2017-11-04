#-------------------------------------------------
#
# Project created by QtCreator 2017-09-22T09:46:47
#
#-------------------------------------------------

QT       += core gui

greaterThan(QT_MAJOR_VERSION, 4): QT += widgets

DEFINES += APPVERSION=\\\"0.0.1-Alpha\\\"

TARGET = Dubuilder
TEMPLATE = app


SOURCES += main.cpp\
        mainwindow.cpp \
    scanner.cpp \
    script.cpp \
    scriptwidget.cpp \
    toolbarspacer.cpp \
    builder.cpp \
    frameless.cpp \
    rainboxui.cpp

HEADERS  += mainwindow.h \
    scanner.h \
    script.h \
    scriptwidget.h \
    toolbarspacer.h \
    builder.h \
    frameless.h \
    rainboxui.h

FORMS    += mainwindow.ui \
    scriptwidget.ui \
    toolbarspacer.ui

RESOURCES += \
    resources.qrc
