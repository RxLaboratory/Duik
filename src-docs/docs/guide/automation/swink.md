# ![](../../img/duik/icons/swink.svg){style="width:1em;"} Swink

*Swink* stands for *swing or blink*[^pun]. It can be used to make a property oscillate between two values, with many options to control the interpolation[*](../../misc/glossary.md) between these values. For example, it makes it easy to animate a pendulum or a light blinking.

[^pun]: We've had a hard time translating this term in other languages, but we've found *Clignancement* for "Clignottement ou balancement" in French, and *Parpalancear* for "Parpadear o balancear" in Spanish. If you'd like to play with us and help translate Duik, come to  [translate.rxlab.io](http://translate.rxlab.io){target="_blank"}!

![](../../img/illustration/Huygens_first_pendulum_clock.png)  
*The first pendulum clock, drawing from Horologium,  
Christiaan Huygens, 1658   
Public domain.*{style="font-size:0.8em;"}

1. **Select** the properties
2. Click the ![](../../img/duik/icons/swink.svg){style="width:1em;"} ***Swink*** button  
    ![](../../img/duik/automation/swink-select.png)
3. **Choose** one of the presets

The choice between *Swing* or *Blink* just change the default values, the same effect is created in both cases.

!!! Tip
    When you’ve applied the Swink on some properties and then want to use the same Swink on other properties, you can just copy and paste the expression in the new properties.

## Effect

The Swink can be adjusted in the effects of the first selected layer.

![](../../img/duik/automation/swink-effect.png)

Duik automatically sets the two values ***A*** and ***B*** to oscillate around the current value of the selected property. You can adjust these values as you wish, or even **animate them**.

While the ***frequency*** changes the speed of the oscillation, the ***Cycle offset*** moves the whole oscillation in time to let you adjust exactly the  value from which it starts at the beginning of the composition. This offset is set as a percentage of a complete cycle.

You can use the ***A/B ratio*** to let the oscillation spend more time on one or the other value. A ratio higher than `50 %` makes the time spent on the *A* value longer than on the *B* value, and vice versa.

When the ***Plateau*** is set to `0 %`, the oscillation never stops; with a higher value, the oscillation will stop some time on both values.

Finally, you can adjust the[ ***interpolation***](../../advanced/interpolation.md)&nbsp;[^interpo] between the *A* and *B* values:

[^interpo]: *cf. Advanced / [Interpolation](../../advanced/interpolation.md)*.

- *Hold (square)* disables interpolation. The value will *blink*.
- *Linear* will result in a very simple interpoation without easing (a triangle).
- *Smooth (sigmoid)* is the smoothest interpolation, similar to a sine function but with the ability to change the *easing* with the *Rate* value.  
    This interpolation is symetrical, like a sine function.
- *Natural (gaussian)* interpolates the value using the gaussian (*bell*) function, which results in an asymetrical acceleration and deceleration. With this interpolation, the motion is more dynamic, and the object looks alive; it is great for the arms swinging during a walk cycle for example.
- *Slow down (logarithmic)* makes the motion start as fast as possible and quickly slow down when getting to the other value.
- *Speed up (exponential)*  does the opposite of *Slow down*, making the motion start very slowly and speeding up as much as possible.

With the *Smooth*, *Natural*, *Slow down* and *Speed up* interpolations, you can use the ***Rate*** value to adjust the easing (acceleration and deceleration rate) of the motion.
