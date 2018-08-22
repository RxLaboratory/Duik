# How to use the framework to develop an After Effects script?

## Simple

The simplest way is to download and include the latest full build at the beginning of your script. It is a single file called _DuAEF_full.jsxinc_ located in the [/Release/](https://github.com/Rainbox-dev/DuAEF_Duik/tree/master/Release/DuAEF) folder.

    #include DuAEF_full.jsxinc

## Versatile

If you plan to make some modifications to the framework, you may prefer work with the libraries (feel free to submit pull requests here too!). In that case, you need to include _DuAEF.jsxinc_ and make the libs/ and bin/ folder available, keeping the same hierarchy. The libraries are available in the [/src/](https://github.com/Rainbox-dev/DuAEF_Duik/tree/master/src) folder.

    //must be in the same path than your script, with the /libs and /bin subfolders too.
    #include DuAEF.jsxinc

After the inclusion, all objects and methods from DuAEF will be available.

## Without binaries

If you'd like to use a smaller file, you can use DuAEF without some binaries needed only with some specific methods.
In this case, using the simple way, you can include _DuAEF_no_bin.jsxinc_ instead of _DuAEF_full.jsxinc_. If you're doing it the versatile way, just comment out the include concerning the binaries inside _DuAEF.jsxinc_.

## Comprehensive reference

The framework reference is available **[here](framework-reference.md)**.
