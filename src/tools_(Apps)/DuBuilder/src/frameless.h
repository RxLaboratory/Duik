//seen at https://stackoverflow.com/questions/5752408/qt-resize-borderless-widget/37507341#37507341
//posted by https://stackoverflow.com/users/5446734/iman4k

#pragma once
#include <QtWidgets/QWidget>
#include <QtWidgets/QRubberBand>
#include <QtCore/QObject>
#include <QtCore/QEvent>
#include <QtCore/QRect>
#include <QtCore/QPoint>
#include <QtCore/Qt>
#include <QtGui/QHoverEvent>
#include <QtGui/QMouseEvent>
#include <QMainWindow>

class FrameLess : public QObject {
    Q_OBJECT

public:
    enum Edge {
        None = 0x0,
        Left = 0x1,
        Top = 0x2,
        Right = 0x4,
        Bottom = 0x8,
        TopLeft = 0x10,
        TopRight = 0x20,
        BottomLeft = 0x40,
        BottomRight = 0x80,
    };
    Q_ENUM(Edge)
    Q_DECLARE_FLAGS(Edges, Edge)

    FrameLess(QMainWindow *target);

    void setBorderWidth(int w) {
        _borderWidth = w;
    }
    int borderWidth() const {
        return _borderWidth;
    }

protected:
    bool eventFilter(QObject *o, QEvent *e) override;
    void mouseHover(QHoverEvent*);
    void mouseLeave(QEvent*);
    void mousePress(QMouseEvent*);
    void mouseRealese(QMouseEvent*);
    void mouseMove(QMouseEvent*);
    void updateCursorShape(const QPoint &);
    void calculateCursorPosition(const QPoint &, const QRect &, Edges &);

private:
    QWidget *_target = nullptr;
    QRubberBand *_rubberband = nullptr;
    bool _cursorchanged;
    bool _leftButtonPressed;
    Edges _mousePress = Edge::None;
    Edges _mouseMove = Edge::None;
    int _borderWidth;

    QPoint _dragPos;
    bool _dragStart = false;
};

Q_DECLARE_OPERATORS_FOR_FLAGS(FrameLess::Edges)
