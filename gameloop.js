
// (c) Marcel Timm, RhinoDevel, 2021

/** To be run during page load to augment global gamupet object with new
 *  property called gameloop.
 */
(function() // IIFE
{
    'use strict';

    var f = {}, v = {}, o = {};

    v.last_timestamp = 0.0;
    v.fixedDelay = 0.0; // ms
    v.delta = 0.0;
    
    v.update = null;
    v.draw = null;

    f.loop = function(timestamp)
    {
        var elapsed = timestamp - v.last_timestamp; // ms

        window.requestAnimationFrame(f.loop);

        if(elapsed < v.fixedDelay)
        {
            return;
        }

        v.delta += elapsed;

        do
        {
            v.update();

            v.delta -= v.fixedDelay;
        }while(v.delta >= v.fixedDelay);

        v.last_timestamp = timestamp;

        v.draw();
    };

    f.init = function(p)
    {
        v.update = p.update;
        v.draw = p.draw;

        v.fixedDelay = 1.0 / p.freq; // s (because frequency is in Hz).
        v.fixedDelay = 1000.0 * v.fixedDelay; // ms
    };

    f.start = function()
    {
        window.requestAnimationFrame(f.loop);
    };

    o.init = f.init;
    o.start = f.start;

    gamupet.gameloop = o;
}());
 