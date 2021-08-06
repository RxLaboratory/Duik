# TODO

## Duik

- [x] re-build a simple shapeToJsxinc script (ask for the var name)
- [x] include the 'shape_linker' pseudo effect as `Duik.PseudoEffect.PATH_PIN`
- [x] include the 'bone' pseudo effect as `Duik.PseudoEffect.PIN`
- [x] Re-design pin shapes, export, include
- [x] Change bone anchor to a single dot, like pins, but add a plain circle always visible in the link
- [x] Add *bake appearance* button on the top line
- [x] Options for bones:
    - Selection:
        - Side
        - Location
        - Color
        - Size
        - Opacity
        - Character name
- [ ] Prep translations (same system as Dugr)
- [ ] New type of leg: arthropod
- [ ] Other limbs:
    - Wing
    - Worm / snake spine
    - Fin
    - Hair
- [ ] Autolink on Ctrl+click (add to helptip) (also from the options panel)
- [ ] Random color on Alt+Click (add to helptip) (also from the options panel)
- [ ] Tools:
    - Layer manager (rename, character, limb, side, location...)

## DuAEF

- [x] Add random button to the color selector
- [ ] when alerting debug info, actually throw error if javascript debugging in Ae is on

## Notes

Warning: `Duik.Pin.rigPath` now returns the effects, not the layers. The layers can be retrieved from the effects.