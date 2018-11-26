# ![tool Icon](img/duik-icons/tool-icon-r.png) Rigging Tools

A few tools which can be useful in the rigging process are available.

[TOC]

## ![rename Icon](img/duik-icons/rename-icon-r.png) Rename

![rename](img\duik-screenshots\S-Rigging\S-Rigging-Tools\Rename.PNG)

With the "Rename" tool you can rename as many layers, puppet pins or project items at once as you wish.

This tool is able to update the expressions after having renamed the elements, if you need it. Disabling the option if you don't need it may improve performance a little bit.

## ![search replace Icon](img/duik-icons/searchreplace-icon-r.png) Search and Replace

![search & replace](img\duik-screenshots\S-Rigging\S-Rigging-Tools\SearchReplace.PNG)

You can "Search and Replace" text in layer names, project item names, expressions or source texts of text layers.

## ![measure distance Icon](img/duik-icons/measure-icon-r.png) Measure distance

![measure distance](img\duik-screenshots\S-Rigging\S-Rigging-Tools\Measure.PNG)

When two layers are selected, click on the "Measure Distance" button to measure the distance between their anchor points, in pixels.

## ![align layers Icon](img/duik-icons/align-icon-r.png) Align Layers

![align layers](img\duik-screenshots\S-Rigging\S-Rigging-Tools\AlignLayers.PNG)

Select some layers to align them togeter. Layers will be aligned on the latest selected one.

In the additionnal panel you can choose to align the layers in *position*, *rotation*, *scale* or even *opacity*.

!!! caution
    This tool works well even if layers are parented to other layers, but if there is non-homothetic scale on the parents, they can not be properly aligned in scale, as the induced deformation can not be reproduced using only transformations.

## Toggle edit mode

![toggle](img\duik-screenshots\S-Rigging\S-Rigging-Tools\Toggle.PNG)

Un-parents and re-parents the children of a layer to be able to adjust its transformations without affecting them.

## Remove expressions

![remove expression](img\duik-screenshots\S-Rigging\S-Rigging-Tools\removeExpression.PNG)

!!! hint
    Available in _Standard_ and _Expert_ modes only. 

Select some properties with expressions to remove the expression, but keeping their current *post-expression value* instead of the *pre-expression value* like After Effects does.

## Get property info

![prop info](img\duik-screenshots\S-Rigging\S-Rigging-Tools\propInfo.PNG)

!!! hint
    Available in _Expert_ mode only.  

Select one property and click on this button to get some useful information about the property, like its index, its match name, its path in expressions...

## Scriptify expression

![scriptify](img\duik-screenshots\S-Rigging\S-Rigging-Tools\Scriptify.PNG)

!!! hint
    Available in _Expert_ mode only.  

Select a property with an expression to convert this expression to a string easy to include in a .jsx script. You can just copy and paste the generated script into your own script to quickly use the expression.
