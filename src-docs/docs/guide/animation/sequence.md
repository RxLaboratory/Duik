# ![](../../img/duik/icons/sequencer.svg){style="width:1em;"} Sequence

The *Sequence* tool distributes layers or keyframes in time.

![](../../img/duik/animation/sequence-linear.png)

1. **Select** some layers or keyframes
2. Click the ![](../../img/duik/icons/sequencer.svg){style="width:1em;"} ***Sequence*** button.  
    `[Shift] + [Click]` the button to access some options

![](../../img/duik/animation/sequence.png)

You can sequence either the selected **layers** or the selected **keyframes**.

When sequencing the layers, you can choose to either **move** them (***Times***) or **cut** them (***In points*** or ***Out points***).

There are several interpolation[*](../../misc/glossary.md) algorithms available, which define the shape of the sequenced layers or keyframes.

- **Linear**

![](../../img/duik/animation/sequence-linear.png)

- **Ease** - Sigmoid (logistic)

![](../../img/duik/animation/sequence-sigmoid.png)

- **Natural** - Bell (gaussian)

![](../../img/duik/animation/sequence-gaussian.png)

- **Ease In** (logarithmic)

![](../../img/duik/animation/sequence-easin.png)

- **Ease Out** (exponential)

![](../../img/duik/animation/sequence-easout.png)

For all but the *linear* interpolations, you can adjust the shape with the ***rate*** slider.

Of course, you can also set the duration of the sequence, in frames.