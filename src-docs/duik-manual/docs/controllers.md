## ![Controller Icon](img/duik-icons/controller-hand-icon-r.png) Controllers

Using the autorig, and a set of constraints, what you end with are controllers to drive the animation. **You animate the controllers, they drive the structures through the constraints, _et voilà!_ Your character moves**.

As the controllers are going to be the interface between the animator and the character, they have to be intuitive and easy to manipulate. That’s why Duik Bassel not only introduces new shapes to make them easier to recognize, but there is also visual feeadback on the controllers to see what the controllers are doing! And of course, they can be easily personnalized, you can change their colors and shapes as you wish.

![Controllers GIF](https://rainboxprod.coop/rainbox/wp-content/uploads/controllers.gif)

## Panel

![controllers pannel](img/duik-screenshots/S-Rigging/S-Rigging-Controllers/Controllers-pannel.PNG)  
This is the Controllers panel in *Normal* mode.

The controller panel consists of the list of controllers shapes you can use in your rigs (or which are created with the tools like the Auto-rig), and some useful tools related to controllers.

## Create controllers

Just click on the desired shape to create a controller.
If some layers were selected, one controller will be created for each layer, otherwise only one controller will be created at the center of the composition.

Hold the [Alt] button to create only one controller at the average center of the selected layers.

Hold the [Ctrl] / [Cmd] button to parent the layers to the newly created controller(s).

Ajouter ici une capture d'un effet de controller

You can use the effect on the controller to adjust its appearance (color, position, size...).

!!! hint
    Controllers are standard shape layers. You can draw anything you want in the content of a controller, therefore using custom shapes is possible.

## _Slider_, _2D Slider_ and _Angle_ controller

![special Controller Icon](img/duik-icons/special-controller/specialcontroller-icon-r.png)

There are 3 special shapes: the slider, the 2D slider and the angle controllers. They are not meant to be used like other controllers - with parenting or IKs, etc. - but with the "Connector" or expressions: it is easy to get and connect their value to any other property and control almost anything you want with them, in a very visual and easy way.

These controllers are made of two layers: the actual controller (the handle) on the top, and a shape in the background. The handle is parented to the background shape, so you can move the background layer to move the whole controller.

ajouter ici capture des trois effets de ces controleurs

In effects of these controllers, the _Handle_ section controls the appearance of the handle and the _Slider_ section controls the appearance of the shape in the background.
The effect exposes the value of the slider, in percentage for sliders and 2D-sliders, and in degrees for angles. This value ranges from -100% to 100% no matter what the actual size (and position value) of the controller is.

You can animate the posiion (or rotation) of the controller, but use the value in the effects in your custom expressions using these controllers, for easy expression creation.

If you use them with the _Connector_ tool of Duik, the controller is automatically recognised and the value is picked automatically, you can just select the layer and don't have to pick the actual value property.