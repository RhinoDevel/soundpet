
// (c) Marcel Timm, RhinoDevel, 2021

/** To be executed as last JavaScript file on page load.
 */
(function() // IIFE
{
    'use strict';

    var f = {};

    f.onLoad = function()
    {
        soundpet.freqPlay.init();

        soundpet.freqPlay.on(880);
    };

    window.addEventListener('load', f.onLoad);
}());
