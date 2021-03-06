
// (c) Marcel Timm, RhinoDevel, 2021

/* global gamupet */

/** To be run during page load to augment global gamupet object with new
 *  property called gameloop.
 */
(function() // IIFE
{
    'use strict';

    var f = {}, v = {}, o = {};

    v.stopRequest = false;
    v.lastDrawAt = null;
    v.step = 0.0; // ms (e.g. ~16.7ms for 60 FPS).
    v.delta = 0.0; // Holds milliseconds that still need to be processed by
                   // v.update(). Is not 0.0, if wanted FPS is not dividable
                   // by .requestAnimationFrame()'s FPS without a remainder. 

    v.update = null;
    v.draw = null;

    f.stop = function()
    {
        v.stopRequest = true;
    };

    f.loop = function(timestamp)
    {
        var elapsed = 0.0;

        if(v.stopRequest)
        {
            v.lastDrawAt = null;
            v.stopRequest = false;
            return;
        }

        window.requestAnimationFrame(f.loop);

        if(v.lastDrawAt === null)
        {
            v.lastDrawAt = timestamp - v.step;
        }

        elapsed = timestamp - v.lastDrawAt; // ms
        if(elapsed < v.step)
        {
            return;
        }

        v.delta += elapsed;

        do
        {
            v.update(); // Called once per step.

            v.delta -= v.step;
        }while(v.delta >= v.step);

        v.lastDrawAt = timestamp;
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
    o.stop = f.stop;

    gamupet.gameloop = o;
}());
