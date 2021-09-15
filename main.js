
// (c) Marcel Timm, RhinoDevel, 2021

/** To be executed as last JavaScript file on page load.
 */
(function() // IIFE
{
    'use strict';

    var f = {};

    f.onLoad = function()
    {
        soundpet.freqplay.init();

        soundpet.gameloop.init(
            {
                onLoop: function(timestamp)
                {
                    if(soundpet.keyboard.isPressed('a'))
                    {
                        soundpet.freqplay.on(440);
                    }
                    if(soundpet.keyboard.isPressed('b'))
                    {
                        soundpet.freqplay.on(880);
                    }
                    
                    if(soundpet.keyboard.isPressed('c'))
                    {
                        soundpet.freqplay.off();
                    }
                }
            });

        soundpet.keyboard.init();

        soundpet.gameloop.start();
    };

    window.addEventListener('load', f.onLoad);
}());
