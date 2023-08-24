# ![](../../../img/duik/icons/comp_baker.svg){style="width:1em;"} Bake Composition

The *Bake Composition* tool simplifies the whole composition as much as possible, to make it the lightest possible without compromise on the animation, and makes it better suitable for specific exports like HTML/JS/CSS animation, such  as Lottie/Bodymovin.

- It **removes all parenting** from the layers.  
    But keeps the same animation, adding necessary keyframes on the layers for them to keep the exact same motion.
- It **removes all expressions** from the layers.  
    According to the mode set in the options (*Smart* or *Precise*).
- It **removes all non-renderable layers**.  
    These layers can be: null layers, empty shape layers, adjustment layers without effects, guide layers (including Duik controllers, bones and pins) or layers with `0 %` opacity during the whole composition.

The result is a composition without any extra layer, without any parenting, and without expressions.

The *Bake Composition* tool has the same options as the *Bake Expressions* tool.


![META](authors:Nicolas "Duduf" Dufresne;license:GNU-FDL;copyright:2022-2023;updated:2023-08-16)
