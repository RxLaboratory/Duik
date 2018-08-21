# **DuFrame**: framing grids and guides.

**Duframe is a very simple tool which creates different types of grids and guides on a Shape Layer, which you can extensively configure, to help the composition of the image.**

![DuFrame GIF](https://rainboxprod.coop/rainbox/wp-content/uploads/frame.gif)

It is available as a preset (_*.ffx_) which you can apply to an empty Shape Layer via the menu "Animation/Apply Preset..." in After Effects.  
It is also available in the camera panel of [Duik Bassel](https://github.com/Rainbox-dev/DuAEF_Duik/wiki/Duik).

![Default Frame](https://raw.githubusercontent.com/Rainbox-dev/DuAEF_Duik/master/docs/media/wiki/screenshots/duframe/example1.PNG)

This is the default frame and guides added when you apply the preset.

## Frame

The first effect added to the layer lets you configure the frame.

![Frame Effect](https://raw.githubusercontent.com/Rainbox-dev/DuAEF_Duik/master/docs/media/wiki/screenshots/duframe/frameFX.PNG)

* **Format presets**  
   1. *Custom* lets you specify the format using the _Format_ value.
   2. *Composition* will compute the current aspect ratio of the composition, so you can know what it is in the _Format_ value.
   3. The other formats in the list are relatively common formats (some older, some more recent) which can be useful. The current standard for video is *16/9*, and for digital cinema they are *DCP Flat* and *DCP Scope*.
* **Format**  
This value lets you read the format of the selected preset, or set your own format if you've set the preset to *Custom*.
* **Appearance**  
The values in this group are used to adjust the appearance of the frame.
* **Computed Size** (Read only)  
This is the size of the resulting frame, in pixels.

## Grids

The other effects are used to adjust the grids and guides.

You can have as many guides as you want, you just have to duplicate a grid effect to add a new one. The only limitation is that you cannot have twice the same type of grid or guide, but you can always duplicate the layer itself if you need.

You can temporarily hide a specific grid or guide by disabling the corresponding effect.

![Grid Effect](https://raw.githubusercontent.com/Rainbox-dev/DuAEF_Duik/master/docs/media/wiki/screenshots/duframe/gridFX.PNG)

There are a lot of different grids, and if you need another type, just [ask for it](https://github.com/Rainbox-dev/DuAEF_Duik/wiki/Contributing-Guide) ;)

* **Safe Frames** displays standard "action" and "title" safe frames, which represents resepectively 80% and 90% of the surface of the entire frame.
* **Digital Frames** shows the standard digital formats (*4/3*, *16/9*, *1.85*, *2.35*) contained in the current frame. This way you can make sure your composition works even if the image is later cropped to another format.
* **Golden Rectangle** divides the image using the [golden ratio](https://en.wikipedia.org/wiki/Golden_ratio).
* **Golden Fibonacci** draws the famous [Fibonacci spiral](https://en.wikipedia.org/wiki/Fibonacci_number), but adjusted using the golden ratio to fit the entire image.
* **Real Fibonacci** draws the true Fibonacci spiral, with its accurate proportions.
* **Isometric** draws an isometric guide very helpful when designing... isometric perspectives.

![Isometric Grid](https://raw.githubusercontent.com/Rainbox-dev/DuAEF_Duik/master/docs/media/wiki/screenshots/duframe/example2.PNG)  
Isometric Grid

![Golden rectangle and Golden Fibonacci](https://raw.githubusercontent.com/Rainbox-dev/DuAEF_Duik/master/docs/media/wiki/screenshots/duframe/example3.PNG)  
Golden rectangle and Golden Fibonacci guides

# Credits

Many thanks to all those who contributed to the making of DuFrame!

- **Lead Developper**: Nicolas Dufresne @[Rainbox](https://rainboxprod.coop)
- **Many thanks to**: Ana Arce, Mickaël Carton, [Motion Café](https://www.motion-cafe.com/)
- **Crowdfunding & Financial supporters**: Adam Pope, Alen Vukovic, Alex MEAUX, Alexandre Bruno, Alice Four, Ana Vicente, Andrea Schmitz, Andrey Stifeev, Angelrebirth, Anne Balança, Antoine Bieber, Antoine Masson, Aurélien malagoli, AUTRET Claude, Benjamin Nelan, BIGNOZ, Bran Dougherty-Johnson, Brendan Cox, Brian Earl V. Paje, Brian MacDonald, BruceChen, Bruno Quintin, Chadley Muller, Charles Moniere, chebah, Chris, chris, Clémentine Courcelle, Coleen Lochabay, Constantinos Kilaris, Crolinde, Cédric Daudon, Cédric Villain, D. Israel Peralta, Damien Bracciotti, Daniel Arce, David Baril, Didier DELBOS, Domenico Lombardo, Doodles, Dou Cheng, Eder Pesina, Erich J. Reimers, Fabio, Fiona, Florentin Joannes, Franck Dion, Franck HAEGELI, French School of CG, fuchs & bär, gael roda, guillaume Viemont, Gwénaël Sérieys, harold hernandez, Hasan Wajahat Jafri, Hervé Dumont, Jacques Dupont, Jaime Martinez, Jake Bartlett, Jane English, Jean Legault, Jens Willads Ullerup, Jeremy Andrus, Jesse Kerman, Jonas Hummelstrand, Jonathan Trueblood, Julian Pinzon, Julien Pilipczuk, Juliette Ray, Justin Lawrence, Keely mills, Keri Rainock, Kezia Paigee Tee, kharon, Killian, Koen Rollé, Konstantin Sinitsin, laurent quero, Lionel Richerand, Maimiti Chave, Mair Perkins, maral, Mark Fish, Matias Poggini, Matthew Creed, Max Armax, Maxime Baridon, Meliha Cicak, Meriau louis, Michael Szalapski, Mikhail Terentev, MIKIMO Studio, MONNET, MotionZ, Mysteropodes Drouin, natan moura, Nathanael brun, Nekosan3, Nico Troti, nicolas matelot, Noodle, Olivier Beaugrand, Orangewedge, Painn Liao, Pascal Fuerst, Paul, Paul Biller, Paul Delissen, Pedro Hernan Romero, Philippe, Philippe Desfretier, Pierre Gelas, Pierre Lhuillery, Pierre-Yves Mansour, Refracted Color, René Andritsch, Ricardo Arce, Rich Seemueller, Rogerio Stravino, Ronny Khalil, Ruben, Rusty Hein, Ryan Summers, Ryan Thurber, RyanBear, Salih, Sean Dunn, Sean Kimber, Sebastian Rasche, Shawn Encarnacion, Shin Ooi, Shing Yuan, Skan Triki, sofatutor.com, Stephanie Lantry, Suzanne Hemphill, Sébastien Périer, Tamas Leisz, Tang huijing, Taylor Cox, Thor Guldager, Traci Brinling, Tran Tien Tho, Veronica Tolentino, Vitaliy Movsha, Vivian Demaurex, Vladislav Yastrebov, Warren Meurisse, XN Yang, Yevgeniy Astrakhantsev, Yves Paradis, Zeeshan Parwez, Игорь Махотин, 景賀 張
