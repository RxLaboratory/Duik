Almost all Duik features are now very easy to include and use in your own scripts, thanks to the Duik Application Programming Interface (API).

The idea is just to include the API at the beginning of your script: `#include 'Duik16_api.jsxinc` to get an easy access to all Duik features, as very simple functions.  

Here's a very simple example showing how to create a Structure for a hominoid in the current composition:

    //encapsulate everything to avoid global variables !important!
    (function(thisObj) {

        //include the API
        #include 'Duik16_api.jsxinc'
        
        // Create a hominoid structure
        // The whole API is contained in the 'Duik' object
        // but the DuAEF framework is also made available in its own object
        Duik.structures.mammal();

    })(this);


You can [download the latest version of the API on Github](https://github.com/Rainbox-dev/DuAEF_Duik/tree/master/Release/Duik-API).

This API has a [comprehensive documentation available here](http://duik-api.rainboxlab.org).

The Duik API only has high-level methods, most of them working without needing any parameter, which makes it very easy to use. All methods adjust their behaviour according to the After Effects context and work with the active composition, the selected layers, the selected properties... If you need a lower-level access to what can be achieved with Duik (for example to rig specific layers, build an advanced autorig, add IK on specific layers, etc.), you can use the [Duduf After Effects Framework (DuAEF)](duaef.md) which Duik is based on, and which includes much more tools.