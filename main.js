
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

        soundpet.noteplay.init(
            {
                octaveCount: 8,
                freqplay: soundpet.freqplay
            });

        soundpet.gameloop.init(
            {
                onLoop: function(timestamp)
                {
                    if(soundpet.keyboard.isPressed('a'))
                    {
                        soundpet.noteplay.on('C', '', 4);
                    }
                    if(soundpet.keyboard.isPressed('b'))
                    {
                        soundpet.noteplay.on('D', '', 4);
                    }
                    
                    if(soundpet.keyboard.isPressed('c'))
                    {
                        soundpet.noteplay.off();
                    }
                }
            });

        soundpet.keyboard.init();

        soundpet.gameloop.start();
    };

    window.addEventListener('load', f.onLoad);
}());
