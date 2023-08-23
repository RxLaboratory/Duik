# Fequently Asked Questions

These are questions which are not adressed in the documentation of Duik, because they're more general or not directly related to Duik. If you don't find the answer to your question it may be because the answer is already somewhere else in the user guide. If after searching in the guide you still can't find the solution to your problem, you're welcome to ask on [chat.rxlab.info](http://chat.rxlab.info){target="_blank}

## How can I modify the design of an already rigged (and animated) character?

When you rig a character, you should follow the standard Duik procedure (*cf. [The Rigging Process in Duik Ángela](guide/rigging.md)*).

When using bones to rig the character, the artwork is not rigged itself, all constraints and expressions are on the bones. This means you can change the design at any time by just swapping the artwork, or adding layers to be parented to the rigged bones.

This being said, a nice habit to have is to always **precompose all footages** as soon as you import them, and use the precomps instead of the footages. TThis makes it easy to adjust the design at any time, by just modifying the contents of these precompositions. This works especially well when using the puppet tool, as the pins will be on the precomposition instead of the footage itself. This way you can easily change anything you wish inside the precomposition wuthout having to redo the puppet and parenting work.

Of course, you can only change *details* on the character this way; if the location of the joints change, it's usually easier and faster to just redo the rig. Don't forget you can remove just a single limb to re-rig it, you don't need to re-rig the whole character.

## Can I use the same rig for multiple characters?

Yes, if the characters all have the same proportions (if the length of their limbs, the distance between the joints are all the same).

No in all other cases, sorry. This being said, it's quite quick to create a bunch of bones and run the Auto-Rig, not much longer than having to reposition existing bones (it may even be faster due to performance issues with rigged characters).

We could implement a tool to reposition already rigged bones, that'd be a great new feature in Duik, but it's too complicated for now and all the other great new features we have to add first.

## How can I scale a rigged character in Duik?

It is not possible to scale the rig itself yet without adjusting some expressions, but:

With the “Extract Controllers” feature, you can scale a rigged character:

1. Add the rigged comp into another comp.
2. Select the precomposition layer and, in the controllers panel of Duik, click on "Extract controllers"

You can then animate from outside of the precomp, with the extracted controllers, and you can scale the precomposition layer to scale the rig (the controllers will follow).
We think this is a good workaround, you just have to take care of the resolution as it’s a precomposition (and rasterization may not work properly with the rig), scaling up will damage it a bit, but scaling it down is ok.

## How can I use the connector to connect a single slave property to multiple master properties?

Use a [List](guide/constraints/tools/list.md)!

## The hominoid (or other meta-rigs) is facing left. I’d like it to face right.

The direction the hominoid is facing doesn’t really matter, as the Auto-Rig will adjust to the locations of the armatures at the time you’ll run it. Just move each bone to the corresponding limb of your character, one by one, and then run the Auto-Rig. Don’t forget the [Edit Mode](guide/bones/tools/edit.md) to help you move a Structure without moving its children if you need.

## When applying the walk cycle, the controllers of the hands seem to be deactivated, why’s that?

The procedural walk cycle animates the arms with Forward Kinematics (FK) and thus deactivates the Inverse Kinematics (IK). They do not need to translate anymore as the animation is on the angles of the individual FK controls.

If you want to animate/adjust the arms, you can either adjust the values in the Individual FK controls in the effects of the controllers, or you can re-enable the IK, but this will deactivate the procedural animation on the arms.

!!! Note
    You can animate the switch between IK and FK, and Duik provides a tool to ease this [IK/FK switch](guide/animation/tools/ik-fk-switch.md) process.


## Duik worked well, but it won’t start anymore. What can I do?

Sometimes, the files Duik needs to run smoothly get corrupted, especially (but not only) on Mac OS or when something like *OneDrive* or *DropBox* is messing with your documents folder. If this is the case, Duik may not even be able to start anymore, or may be showing a script alert at start. In this case, follow the procedure described in the [Troubleshooting](getting-started/troubleshoot.md) section to repair Duik.

## Where can I get help with Duik?

You're reading this guide, that's an important first step.

If you'd prefer some video tutorials, we provide lots of official free tutorials and paid comprehensive courses on [rxlaboratory.org](https://rxlaboratory.org){target="_blank"} and lots high quality free and paid tutorials are available on the internet.

Of course, we'll be happy to guide you on [chat.rxlab.info](http://chat.rxlab.info){target="_blank"}, but please, do not contact us through social networks or our contact form to get support and help with Duik or any other tool: we just can't reply to everyone everywhere.

## I can’t afford to contribute or I don’t want to donate, can I still use Duik?

**Our software is free, as in freedom**.

You have the same rights whether you make a donation or not. Not everyone can afford to give some money, and we’re fine with that. Note that we welcome any kind of contribution, there’s always something to do, like translations, fixing bugs, contributing to the doc, creating examples and tutorials…

There's always a download link available on [the official website (rxlaboratory.org)](https://rxlaboratory.org) to let you download Duik for free.

Do NOT download Duik from anywhere else! You probably won't find the latest version, and you may just end-up with a virus too.

## Why do you call your tools Free Software if I have to pay for it?

On the download page of Duik, we ask professionals to make a financial contribution before downloading Duik, because we think that's fair for them to contribute if they make money with our tool.

You have to understand the word free as in freedom or in free speech – what we call *Libre* in French – and not as in free beer. We’ve tried for more than ten years to deliver everything we do for completely free, relying only on voluntarily donations, and that just wasn’t enough for us to continue our work.

So we have to sell the software, but you’re still free to use it as you wish, redistribute it (for free if you wish), modify it, and share your modifications.

This being said, it's not actually mandatory to make a financial contribution. Yes, everyone, including professionals, can download Duik for free, if one just has the courage to click the *I don’t want to contribute and support free software.* link available on the download page.

## Do you even have the right to sell a program released under the GNU General Public License?

Yes, the right to sell copies is part of the definition of free software, and the GNU General Public License.
