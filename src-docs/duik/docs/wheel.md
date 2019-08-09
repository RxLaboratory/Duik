# ![wheel Icon](img\duik-icons\automation\wheel-icon-r.png) Wheel

![Wheel panel](img\duik-screenshots\S-Rigging\S-Rigging-Automations\Wheel.PNG)

The "Wheel" automates the rotation of the layer depending on its translations.

## Setup

1. Select the layer
2. Click on the "Wheel" button

You can adjust the parameters of the wheel in the effects of the layer.

## Effect

![Wheel effects example](img\duik-screenshots\S-Rigging\S-Rigging-Automations\Wheel-effects.PNG)
![Wheel example](img\duik-screenshots\S-Rigging\S-Rigging-Automations\automation-illustration\wheel-example.png)

Duik will try to autodetect the radius of the wheel, but in some cases it is not possible. You can set it, in pixels. If you do not know the exact radius, you can add a null object on the border of the layer and use the [measure distance](rigging-tools.md) tool (in the rigging panel).

The reverse button can be used if the wheel rolls on the roof... Who knows? This can be useful in *some* cases.

There are two ways to compute the rotation: if the trajectory is "horizontal", it is faster to compute, but if the wheel follows a curve, you have to adjust the setting, and it's a bit heavier for After Effects to compute.

When the trajectory is set to "curved" and you need some motion blur on the layer, you'll have to raise a bit the "Motion Blur Precision", but keep in mind that it has a (very) bad impact on performance.