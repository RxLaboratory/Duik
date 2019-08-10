The 'Keys' panel contains all tools you may need all the time when in the process of animation.

## Select Keyframes

'Select keyframes...' is a very useful tool to quickly select a lot of keyframes together in the timeline.

- You can select keyframes at a specific time or in a time range.

- The time can be the time of the playhead or a specific time, and the time range can be either the work area or a specific range. To set specific time and time range, you can click on the eyedropper to pick the current values from the playhead or the work area.

- You can use the filters to select the keyframes of a specific type or on specific layers only.

## Interpolations

Just under the ‘Select keyframes’ button, there are several tools to quickly adjust the interpolations of the selected keyframes.

- The first line of buttons can be used to change the interpolation type of the keyframes, or add keyframes of the wanted type on the properties. With the first button on the left, you can switch between the ‘Edit’ mode and the ‘Add key’ mode.
- In Standard Mode (only), you can manage some interpolation presets, which store and reset velocity and ease.
- The two sliders and the percentage adjust the ease on the selected keyframes, while the value just below defines the velocity.

## Kleaner

The "Kleaner" is a tool to automatically clean the selected animations. It is able to remove unneeded keyframes, clean the interpolations, etc.

### Description

It works both on spatial interpolations and keyframe eases, in three default steps:

1. Fix spatial interpolation: the "Kleaner" will detect spatial tangents which should not be there, for example when two successive keyframes are exactly at the same place but with tangents between them.
2. Smooth temporal interpolations. The "Kleaner" will adjust the animation curves to make them as smooth as possible, automatically detecting the best velocities and eases. It works a bit like the "Auto-Bezier" feature in After Effects but... better.
3. The "Kleaner" will remove all unnecessary keyframes, keeping the exact same animation but with less keys.

### Use

1. Select the keyframes of the animation you want to clean.
2. Click on the "Kleaner" button.

### Additionnal Panel

The additionnal panel is divided in three sections corresponding to the three steps of the "Kleaner " process.

- Spatial Interpolations:
  The four leftmost buttons can be used to quickly change the tangents of several spatial keyframes at once.
  Check or uncheck the checkbox to activate or deactivate this step when you run the "Kleaner"
- Temporal interpolation smoothing:
  Use the two leftmost buttons to tell the "Kleaner" if the first and last keyframes of the animation have to be linear or with ease.
  Check or uncheck the checkbox to activate or deactivate this step when you run the "Kleaner"
- Remove unnecessary keyframes:
  Check or uncheck the checkbox to activate or deactivate this step when you run the "Kleaner"

## Copy / Paste animation

You can copy and paste animations from several layers at once, and from one composition to another.

By default, the Copy and Paste tools will work exactly like the default copying and pasting in After Effects (except it works on several layers at once).

If, when pasting, Duik can not find any corresponding layer to paste some properties, you will be prompted to choose (or ignore) the layers yourself. The dialog will show the names of the missing layers along with some selectors to set the layers where to paste the animations.

### Additionnal panel

Some options make this tool very powerful and more than just a standard copy and paste process.

- You can choose between pasting absolute or relative values. Absolute will paste the keyframes as they are, but Relative will offset the values before pasting, depending on the current values of the properties.

- You can reverse the keyframes in time each time you paste them, to make it easier to loop some keyframes in "ping pong" mode.

- You can automatically replace all existing keyframes, removing any pre-existing animation before pasting.
