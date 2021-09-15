
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
        
        var firstTimestamp = null;

        soundpet.gameloop.init(
            {
                onLoop: function(timestamp)
                {
                    if(firstTimestamp === null)
                    {
                        firstTimestamp = timestamp;
                        soundpet.freqplay.on(440);
                        return;
                    }
                    if((timestamp - firstTimestamp) / 1000.0 >= 5.0 )
                    {
                        soundpet.freqplay.on(880);
                    }
                }
            });

        soundpet.gameloop.start();
    };

    window.addEventListener('load', f.onLoad);
}());
