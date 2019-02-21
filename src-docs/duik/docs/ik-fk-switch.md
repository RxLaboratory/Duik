# ![Constraints Icon](img/duik-icons/ikfk-icon-r.png) IK/FK Switch

*IK/FK Switch* is an easy way to switch between IK and FK during the animation, if the layers have been rigged by Duik Bassel.

## Use

1. Select the controller of an IK made with Duik
2. Duik will detect if it need to be switched to IK or FK and set needed keyframes at the current time to make the switch.

The switch happens in two steps:

1. Duik snaps the FK to the IK or the opposite, depending on the switch, and adds keyframes to keep the value at the current frame.
2. Duik actually switches between the IK and the FK, adding keyframes at the current time.

## Additionnal Panel

![animation tool panel](img\duik-screenshots\S-Animation\S-Animation-Tools\Ikfk-additionnalpanel.PNG)

In the additionnal panel, you can manually snap FK on the IK or the inverse, without actually switching between IK and FK, if ever you need it.
