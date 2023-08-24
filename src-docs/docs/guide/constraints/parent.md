# ![](../../img/duik/icons/parent.svg){style="width:1em;"} Parent Constraints

With a few parenting[*](../../misc/glossary.md) tools and constraints, Duik can improve the concept of layer parenting in After Effects.

With the **parent constraint**, you can animate and weigh[*](../../misc/glossary.md) the link between layers; you can also **parent layers across (pre)compositions**, and **quickly parent selected layers** together.

![](../../img/illustration/Artificial_limbs_Ambroise_Pare_Wellcome_M0013408.png){style="max-height:720px;"}  
*Artificial limbs  
Ambroise Paré, 1585  
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.en){target="_blank"}, [Wellcome Library](http://wellcomeimages.org/), London.*{style="font-size:0.8em;"}

Select the layers, then click the ![](../../img/duik/icons/parent.svg){style="width:1em;"} ***Parent...*** button to select the constraint to apply to the selection.

![](../../img/duik/constraints/parent.png)

## ![](../../img/duik/icons/auto_parent.svg){style="width:1em;"} Auto-Parent

Auto-parent is a quick way to parent the selected layers. It is very handy with compositions with a lot of layers; instead of using the After Effects pickwhip or scrolling through a too-long list of layers, click this button to parent all selected layers to the last-selected one.

1. **Select the child layers**.
2. **Add the parent** to the selection.
3. Click the ![](../../img/duik/icons/auto_parent.svg){style="width:1em;"} ***Auto-Parent*** button to parent the children to the parent.  
    - `[Alt] + [Click]` to parent only the orphans (the layer which don't have no parent yet).
    - `[Ctrl] + [Click]` to parent the selected layers as a chain[*](../../misc/glossary.md), from ancestor to child, in the order of the selection.

!!! tip
    This feature is available as a scriptlet[^1], which makes it easy to assign a keyboard shortcut to it (like the recommended `[Ctrl] + [P]`).

## ![](../../img/duik/icons/parent.svg){style="width:1em;"} Parent Constraint

The Parent Constraint works like standard After Effects parenting, except that the parenting can be animated, so that a child layer can change its parent (or combine multiple parents) at any time. This is very useful to temporarilly parent an object to the hand of a character for example.

1. **Select the child** layer.
2. Click the ![](../../img/duik/icons/parent.svg){style="width:1em;"} ***Parent Constraint*** button.
3. **Select the parent** layer in the *Parent Constraint* effect on the child layer.

You can use the effect to adjust and animate the parent constraint.

![](../../img/duik/constraints/parent-constraint-effect.png)

!!! note
    You won’t see the effect of the parent constraint unless there already are some keyframes (or expressions), the tool needs actual animation to compute the constraint.

You can select the **parent layer**, but this is not animatable. To change the parent, you have to **duplicate the effect** to have **one effect per parent**, and then animate the ***Weights*** to switch between parents, or mix them.

You can also choose to **inherit only the position** or **only the rotation**.

!!! note
    Due to After Effects limitations, child layers can't inherit the scale for now.

You can increase the ***Motion Blur Precision*** if you notice motion blur artefacts, but be careful as this may have a very bad impact on performance.

The transformation of the child layer is computed depending on the weights and the transformations of its parent layers from the beginning of the composition. When adding a new parent link, you may set a first keyframe on its weight to 0% and only raise the weight when you need the child to follow the parent.

!!! warning
    This constraint must use complex expressions, especially if you need to inherit both the position and rotation. This is a problem regarding the performance; the longer the composition, the longer the time needed to compute the expressions: you should try to use this constraint only in short compositions.

    If you can, you should use the [position or orientation constraints](transform.md)&nbsp;[^2] instead, which are much lighter, or deactivate the inheritance of the position or the rotation.

    Don't forget you can also just duplicate the child layer to have it parented to different layers and animate their opacities, without using Duik at all. For simple cases, this is much better in terms of performance.

!!! tip
    To improve performance, you can [bake the expressions](../automation/tools/bake.md)&nbsp;[^3] in the position and rotation properties of the child layer once you're done with the animation.

As this constraint relies on all previous movements to compute the current position and orientation of the child layer, changing any value at a specific time changes all the following values too. This is also true when moving keyframes in time. This may seem counter-intuitive, compared to the standard After Effects parenting, where you don't have to worry before changing a parent, because without parenting animation, After Effects can instantly adjust the values for all the times. That's not possible if what you need is precisely to animate this parenting like with the Duik Parent Constraint.

To ease the animation of the parent constraint, it's better to always animate following the time of the composition, and try to never add, move or edit keyframes *before* existing keyframes.

Most of the time, it's also easier to animate the weight using the *Hold* interpolation, and setting either `0 %` or `100 %` only.

!!! tip
    You may have trouble to *unparent* the constrained layer during the animation. Instead, you can create a null layer and parent the constrained layer to it; this will fix any issue you may have when all weights are set to `0 %`.

## ![](../../img/duik/icons/parent_across_comp.svg){style="width:1em;"} Parent across compositions

Pre-compositions are great! They improve performance, they help you keep the compositions and timeline tidy by limiting the number of layers in the same composition. But using them when rigging characters, or for any complex setup can become really complicated especially because of parenting. In After Effects, you can't precompose layers without losing parenting if the parent or child is not included in the new precomp.

With this *Parent across compositions* feature, you can now parent a child layer from a precomposition to a parent layer in the containing composition, and vice versa.

1. **Select** the child layers.
2. Click the ![](../../img/duik/icons/parent_across_comp.svg){style="width:1em;"} ***Parent across comps*** button.  
    Duik lets you choose the composition containing the parent layer and select it.  
    ![](../../img/duik/constraints/parent-across-comps.png)  
    1. ***Select the composition*** first. It can be any precomposition used in the same composition as the child layer, or any of its containing composition.  
        You can click the ![](../../img/duik/icons/eye_dropper.svg){style="width:1em;"} eye dropper button to pick the current composition.
    2. ***Select the parent layer***, contained in the composition chosen before.  
        You can click the ![](../../img/duik/icons/eye_dropper.svg){style="width:1em;"} eye dropper button to pick the selected layer.
3. Click the ![](../../img/duik/icons/check.svg){style="width:1em;"} ***Parent  across comps*** button.

!!! tip
    Duik lets you parent only from and to precompositions directly contained in another composition, without intermediate precompositions. If there are intermediate compositions, there may be different *paths* (different *chains* of precompositions) ending with the same containing comp and precomp. In this case, Duik can't know which path to take, and this is important because of nested transformations which may be different.

    For this specific case, you can parent across all nested compositions manually, by repeating the parenting process through all the chain of precompositions.

Duik creates a *Locator*[*](../../misc/glossary.md)&nbsp;[^4] in each composition, used to compute the actual parenting using expressions (and essential properties when parenting to a precomposition). They're in shy mode and at the bottom of the layer stack so you may not even notice them, but if you need to parent another layer to the same parent, instead of redoing the whole process (and multiplying locators), you just have to parent the layer to the existing locator.

[^1]: *cf.* *[Getting Started / Installation](../../getting-started/install.md)* and *[Advanced / The Duik API / Keyboard Shortcuts](../../advanced/api/shortcuts.md)*.

[^2]: *cf.* *[Constraints / Transform](transform.md)*

[^3]: *cf.* *[Automation / Toools / Bake expressions](../automation/tools/bake.md)*

[^4]: *cf.* *[Constraints / Tools / Locator](tools/locator.md)*

![META](authors:Nicolas "Duduf" Dufresne;license:GNU-FDL;copyright:2022-2023;updated:2023-08-24)
