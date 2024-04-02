var win = new Window("palette", "test");
win.txt = win.add('statictext', undefined, "Hello World!");
win.layout.resize();

// This should change the txt color
// It works in non-beta
var g = win.txt.graphics;
var color = [1,0,0,1]; // RED!
var textPen = g.newPen( g.PenType.SOLID_COLOR, color, 1 );
g.foregroundColor = textPen;

win.show();