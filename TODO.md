# TODO

## Duik

- [ ] Finish animation library
- [ ] Interpolations!
    - [ ] Bezier
    - [ ] Linear
    - [ ] log
    - [ ] logistic
    - [ ] Gaussian
    - [ ] and inverse

```js
function logInterpolation(t, tMin, tMax, vMin, vMax, rate)
{
	// Offset t to be in the range 1-Max
	tMax = ( tMax - tMin ) * rate + 1;
	t = ( t - tMin ) * rate + 1;
	if (t <= 1) return vMin;
	// Compute the max
	var m = Math.log(tMax);
	// Compute current value
	var v = Math.log(t);
	return linear(v, 0, m, vMin, vMax);
}
```

- [ ] Interpolation option to the NLA
- [ ] New Kleaner
- [ ] autorig
    - wings
    - hairs
    - morganimator's spine rig
    - snake
    - custom
    - options ( tail, longchains, bake/bakeenvelops/nobake )
- [ ] connector
- [ ] bone
    - select tool: alt to select limb
    - adjust spine etc according to animal with better defaults / illustations
    - forcelink on alt click
- [ ] Automation panel
- [ ] Animation panel
    - [ ] Tools:
        - IK/FK
- [ ] Option to hide tags
- [ ] Bones Front and side wing
- [ ] Bones Autolink on Ctrl+click (add to helptip) (also from the options panel)
- [ ] Bones Random color on Alt+Click (add to helptip) (also from the options panel)
- [ ] OCO Panel
- [ ] Camera panel
- [ ] Tools:
    - copy of the layer manager in duik main panel ?
- [ ] Note editor
- [ ] layer rename:
    - autofixexpressions, test again

## DuAEF & DuESF

- [x] Add random button to the color selector
- [ ] option to hide options button in all modes.

## Notes

Warning: `Duik.Pin.rigPath` now returns the effects, not the layers. The layers can be retrieved from the effects.

Snake rig: a standard head + tail, but with an option to select a path control (new kind of Duik controller which includes a path). When path control is selected, an option to set the snake length, a movement along path + path offset.
-> use this for tails too ?
