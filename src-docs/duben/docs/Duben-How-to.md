# How to...

## How it works

Duben creates compositions and layers, or does some heavy computations within After Effects, and **measures the time spent for each step**. This duration is compared to arbitrary reference values, and converted to a percentage. This allows **an accurate and easy comparison against other installations**.  
**A lower value means a better performance**. If, when comparing two values from the same test, the measured value is twice the reference value, it means it's twice slower to compute.

!!! note
    The values alone do not mean anything, they are completely arbitrary. All the meaning comes from comparison between different installations of After Effects, different OS's, versions, hardware.  
    But running Duben on a single installation of After Effects still can be useful, as different methods of drawing shapes or computing effects will be compared, letting you know what would be the best choice for these specific cases.

In addition to the detailed results, the data are combined to a **total score**, a **renderer score**, and a **user experience score**.

## Usage

Usage is very simple, you just have to click the benchmark button to run the selected tests. The results will be saved in a standard CSV file which you can read with any text editor, or open as a spreadsheet with Excel/LibreOffice/Google docs for an easy comparison between different installations.

The results will be more accurate if layer controls are shown (the option is in the "View" menu of After Effects) and if the *Caps Lock* option is disabled on your keyboard, although you can try to change this to compare the results and see how these affect the performance of After Effects.

It usually takes just a few minutes to run all the tests, up to 10 minutes, during which After Effects may seem frozen. Just let it continue, unless it lasts more than 10 minutes which may mean something went wrong. In this case, just force it to quit.  
Don't worry, this script cannot break anything.
