# ![effector Icon](img\duik-icons\ruler_r.png) Expose Transform

!!! hint
    Available in _Standard_ and _Expert_ modes only.

The "Expose Transform" is an object (a controller) which will measure and **expose angles, orientations, coordinates and distances between two layers**, which can be used as a master property with the [*Connector*](connector.md) or in your own expressions.

![Expose Transform Layer](img/after-effects-screenshots/etm.png)

## Setup

Like any [Controller](controllers.md), you just have to click on the button to create it. If a layer was previously selected, the *Expose Transform* object will be created at the same location and will get the name of the layer.

By default, it will measure the transformations of the selected layer, and any relative coordinate will be measured according to the parent of the layer.

You can change this with the first 3 parameters of the effect.

- The *Target Layer* is the one which transformations are exposed.
- You can uncheck the *Use Parent* checkbox to measure relative transformations relatively to a layer other than its parent.
- The *Reference Layer* is the reference used for all relative transformations measurement.

## Effect

![](img/duik-screenshots/S-Rigging/S-Rigging-Links&Constraints/etmEffect.png)

The effect exposes all measured values which can be used in expressions or with the [*Connector*](connector.md).
