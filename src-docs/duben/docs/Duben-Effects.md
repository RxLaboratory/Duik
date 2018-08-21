# Effects

Several effects are tested, several times to take caching into account, which makes a great difference between versions of After Effects, especially for effects which are very long to compute.

Six effects are tested (if available on the version of After Effects where the script is run):

Three blurs:

- Gaussian Blur
- Gaussian Blur (GPU)
- Fast Blur

And three effects known for their heaviness, but which are used a lot:

- Add Grain
- Median
- Lens blur

For these two last effects, caching in latest versions of After Effects have greatly improved their performance, and it has a big impact on the results. But if you don't use them much, performance between different versions of After Effects do not change much.
