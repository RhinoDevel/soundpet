
// (c) Marcel Timm, RhinoDevel, 2021

/** To be executed as last JavaScript file on page load.
 */
(function() // IIFE
{
    'use strict';

    var f = {};

    f.onLoad = function()
    {
        var ctx = new AudioContext(),//webkitAudioContext
            osciParams = {
                type: 'square',
                channelCount: 1,
                channelCountMode: 'explicit',
                frequency: 440 // Hz
                //detune
                // ...
            },
            osci = new OscillatorNode(ctx, osciParams);
            
        osci.connect(ctx.destination);
        osci.start();
        osci.frequency.setValueAtTime(880, ctx.currentTime + 3);
    };

    window.addEventListener('load', f.onLoad);
}());
