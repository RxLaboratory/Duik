# Rigging Tools

A few tools which can be useful in the rigging process are available.

[TOC]

## Rename

With the "Rename" tool you can rename as many layers, puppet pins or project items at once as you wish.

This tool is able to update the expressions after having renamed the elements, if you need it. Disabling the option if you don't need it may improve performance a little bit.

## Search and Replace

You can "Search and Replace" text in layer names, project item names, expressions or source texts of text layers.

## Measure distance

When two layers are selected, click on the "Measure Distance" button to measure the distance between their anchor points, in pixels.

## Align Layers

Select some layers to align them together. Layers will be aligned on the latest selected one.

In the additional panel you can choose to align the layers in *position*, *rotation*, *scale* or even *opacity*.

!!! caution
    This tool works well even if layers are parented to other layers, but if there is non-homothetic scale on the parents, they can not be properly aligned in scale, as the induced deformation can not be reproduced using only transformations.

## Toggle edit mode

Un-parents and re-parents the children of a layer to be able to adjust its transformations without affecting them.

## Remove expressions

!!! hint
    Available in _Standard_ and _Expert_ modes only. 

Select some properties with expressions to remove the expression, but keeping their current *post-expression value* instead of the *pre-expression value* like After Effects does.

## Copy Paste expressions

!!! hint
    Available in _Standard_ and _Expert_ modes only. 

This very simple tool will copy an expression from a selected property, and then allows you to paste it on several properties at once, without changing their pre-expression values or keyframes.

## Get property info

!!! hint
    Available in _Expert_ mode only.  

Select one property and click on this button to get some useful information about the property, like its index, its match name, its path in expressions...

## Scriptify expression

!!! hint
    Available in _Expert_ mode only.  

Select a property with an expression to convert this expression to a string easy to include in a .jsx script. You can just copy and paste the generated script into your own script to quickly use the expression.
