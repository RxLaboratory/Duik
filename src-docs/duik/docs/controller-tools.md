# Controller Tools

## Select Controllers

Click the *Select controllers* button to select all the Controllers in the composition.

## Show / Hide Controllers

Shows or hides all (or selected) *Controllers* found in the composition.

If there is no layer selected, this will show of hide all *Conbtrollers* in the composition, or else it will use the layer selection.

## Extract Controllers

In most cases, it is easier to have rigs (for characters or other items) in their own precompositions, but this is not the most handy way to animate, especially when you have several characters in the same shot or if you need to see the background.

To avoid assembling all the rigs and the background in the same composition, you can keep the rigs in a precomposition and "*Extract*" the controllers.
This way, all the controllers are available in the same main composition, with the background if you wish, but the rigs stay precomposed. This is especially useful when there are a lot of layers for the rigs, and if you want to render proxies for character animations in order to improve performance when compositing the shot.

- Just select a precomposition layer containing a rig, and click the "***Extract Controllers***" button to copy the controllers to the current composition and be able to animate outside of the rigged precomposition.

## Edit Controllers

!!! hint
    Available in _Standard_ and _Expert_ modes only.

In the edition panel, you can adjust the appearance of the Controllers (Normal and Expert mode).

All changes made in this panel will affect all selected Controllers and the creation of all other Controllers.

- You can change the size of the Controllers, either automatically, relatively to the size of the composition (small, medium and large options), or with an absolute value (custom option).

- You can change the color of the Controllers: if you click on the colored label, a color picker will be shown, but you can also set your own hexadecimal color code in the text field. A random button will set a random color.

- You can pick the selected Controllers appearance with the "Get" button, and set the parameters to the selection with the "Set" button.

- The "Bake Appearance" button will remove all expressions used by the Controllers to set its appearance. This will improve the performance of the rig, but you will not be able to change the appearance afterwards.

- You can choose to use shape layers (with icons and visual feedback) or simpler null objects to create controllers by default when using the rigging tools.

- You can choose to use _Draft mode_ or _Best quality_ to render the controller layers by default (this can be changed at any time in After Effects). Setting _Draft mode_ can greatly improve performance by disabling anti-aliasing on these layers.
