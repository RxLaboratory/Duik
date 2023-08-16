# Fequently Asked Questions

## How can I modify the design of an already rigged (and animated) character?

When you rig a character, you should follow the standard Duik procedure (*cf. [The Rigging Process in Duik Ángela](guide/rigging.md)*).

When using bones to rig the character, the artwork is not rigged itself, all constraints and expressions are on the bones. This means you can change the design at any time by just swapping the artwork, or adding layers to be parented to the rigged bones.

This being said, a nice habit to have is to always **precompose all footages** as soon as you import them, and use the precomps instead of the footages. TThis makes it easy to adjust the design at any time, by just modifying the contents of these precompositions. This works especially well when using the puppet tool, as the pins will be on the precomposition instead of the footage itself. This way you can easily change anything you wish inside the precomposition wuthout having to redo the puppet and parenting work.

Of course, you can only change *details* on the character this way; if the location of the joints change, it's usually easier and faster to just redo the rig. Don't forget you can remove just a single limb to re-rig it, you don't need to re-rig the whole character.
