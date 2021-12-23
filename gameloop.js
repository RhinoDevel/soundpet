
// (c) Marcel Timm, RhinoDevel, 2021

/** To be run during page load to augment global gamupet object with new
 *  property called gameloop.
 */
(function() // IIFE
{
    'use strict';

    var f = {}, v = {}, o = {};

    v.last_timestamp = 0.0;
    v.step = 0.0; // ms
    v.delta = 0.0;

    v.update = null;
    v.draw = null;

    f.loop = function(timestamp)
    {
        var elapsed = timestamp - v.last_timestamp; // ms

        window.requestAnimationFrame(f.loop);

        if(elapsed < v.step)
        {
            return;
        }

        v.delta += elapsed;

        do
        {
            v.update();

            v.delta -= v.step;
        }while(v.delta >= v.step);

        v.last_timestamp = timestamp;

        v.draw();
    };

    f.init = function(p)
    {
        v.update = p.update; // Called once per step.
        v.draw = p.draw; // Called, when drawing is possible and makes sense.

        v.step = 1.0 / p.freq; // s (because frequency is in Hz).
        v.step = 1000.0 * v.step; // ms
    };

    f.start = function()
    {
        window.requestAnimationFrame(f.loop);
    };

    o.init = f.init;
    o.start = f.start;

    gamupet.gameloop = o;
}());
 