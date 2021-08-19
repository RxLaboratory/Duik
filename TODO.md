# TODO

## Duik

- [ ] controllers
    - edit panel
    - new shapes
    - pseudo effects
- [ ] constraints (including IK)
- [ ] autorig
- [ ] bone & controller tools
    - test if bake is still needed
- [ ] controllers
    - extract
- [ ] Automation panel
- [ ] Option to hide tags
- [ ] Bones Front and side wing
- [ ] Bones Autolink on Ctrl+click (add to helptip) (also from the options panel)
- [ ] Bones Random color on Alt+Click (add to helptip) (also from the options panel)
- [ ] OCO Panel
- [ ] Animation Panel
- [ ] Camera panel
- [ ] Tools:
    - copy of the layer manager in duik main panel ?
- [ ] Note editor

## DuAEF & DuESF

- [x] Add random button to the color selector
- [ ] Shift click for options on buttons with options panel; hide the options button in ui mode > expert; option to hide options button in all modes.

## Notes

Warning: `Duik.Pin.rigPath` now returns the effects, not the layers. The layers can be retrieved from the effects.

Snake rig: a standard head + tail, but with an option to select a path control (new kind of Duik controller which includes a path). When path control is selected, an option to set the snake length, a movement along path + path offset.
-> use this for tails too ?