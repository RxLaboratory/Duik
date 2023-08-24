# Duik features in the API

Almost all features of Duik are available as very simple functions in the API.

As Duik comes with many features, they're sorted in *namespaces*, which actually correspond to the panels of Duik.

Of course, all these methods are fully documented; you can read the reference of [the `Duik` namespace](https://duik.rxlab.io//Duik.html) to learn all of them.

- [**`Duik.Animation`**: The animator's toolkit](https://duik.rxlab.io//Duik.Animation.html) (copy/paste animation, tween, snapKeys...)
- [**`Duik.Automation`**: The lazy animator's toolkit.](https://duik.rxlab.io//Duik.Automation.html) (NLA, motionTrail, wiggle, random, walk cycle...)
- [**`Duik.Bone`**: Bone and armatures related tools.](https://duik.rxlab.io//Duik.Bone.html) (leg, arm, bake...)
- [**`Duik.Camera`**: Camera toolkit.](https://duik.rxlab.io//Duik.Camera.html) (frame, rig, twoDCamera...)
- [**`Duik.CmdLib`**: The Duik command line library.](https://duik.rxlab.io//Duik.Camera.html) This is a specific namespace used by the *Duik Command Line* panel.
- [**`Duik.Constraint`**: Constraints for rigging bones and layers.](https://duik.rxlab.io//Duik.Constraint.html) (twoLayerIK, oneLayerIK, bezierIK, orientation, parentAcrosscomp...)
- [**`Duik.Controller`**: Controller related tools.](https://duik.rxlab.io//Duik.Controller.html) (create, bake...)
- [**`Duik.Layer`**: Layer related tools.](https://duik.rxlab.io//Duik.Layer.html) (setLimbName, setCharacterName, select, sanitizeName...)
- [**`Duik.Pin`**: Pin related tools.](https://duik.rxlab.io//Duik.Pin.html) (create, linkPathToLayers, linkPuppetPinsToLayers, addPins...)
- [**`Duik.Rig`**: (Auto)Rigging tools.](https://duik.rxlab.io//Duik.Rig.html) (auto, arm, leg, fin, wing...)
- [**`Duik.Tool`**: Miscellaneous tools.](https://duik.rxlab.io//Duik.Tool.html) (cropPrecompositions, editExpression...)

## Examples

To run the *arm* auto-rig, just run the `arm` method from the `Rig` namespace of `Duik`:

```js
    // Automatically rig the selected bones as an arm
    Duik.Rig.arm();

    // Or you can pass an array of layers to the rigging methods
    Duik.Rig.leg( someLayers );
```

As another example, you can also add a wiggle effect to the selected properties, or some properties of your choice.

The `wiggle` method is in the `Automation` namespace of `Duik`: 

```js
    // Add a Wiggle control with default options to the selected properties
    Duik.Automation.wiggle();

    // Or you can set some parameters
    // 1. Separate dimensions
    // 2. Add one control per property (instead  of a single control for all of them)
    // 3. An array of properties to setup
    Duik.Automation.wiggle( true, true, someProperties );
```

![META](authors:Nicolas "Duduf" Dufresne;license:GNU-FDL;copyright:2022-2023;updated:2023-08-24)
