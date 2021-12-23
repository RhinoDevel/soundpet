
// (c) Marcel Timm, RhinoDevel, 2021

/** To be run during page load to augment global gamupet object with new
 *  property called gameloop.
 */
(function() // IIFE
{
    'use strict';

    var f = {}, v = {}, o = {};

    v.last_timestamp = 0.0;
    v.fixedDelay = null; // ms
    v.onLoop = null;

    f.loop = function(timestamp)
    {
        var elapsed = timestamp - v.last_timestamp; // ms

        window.requestAnimationFrame(f.loop);

        if(v.fixedDelay !== null && elapsed < v.fixedDelay)
        {
            return;
        }
        
        // Getting exactly 50Hz, 60Hz or other wanted values is not always
        // possible, depends on elapsed time between two calls of the loop
        // function which itself depends on hardware and OS:
        //
        // console.log(
        // 'Elapsed: ' + String(elapsed)
        // + ' '
        // + 'FPS: '
        //     + String(
        //         Math.round(
        //             1.0 / (elapsed / 1000.0))));
        
        v.last_timestamp = timestamp;

        v.onLoop(timestamp, elapsed); // ms
    };

    f.init = function(p)
    {
        v.onLoop = p.onLoop;

        if(typeof p.freq === 'number')
        {
            v.fixedDelay = 1.0 / p.freq; // s (because frequency is in Hz).
            v.fixedDelay = 1000.0 * v.fixedDelay; // ms
        }
    };

    f.start = function()
    {
        window.requestAnimationFrame(f.loop);
    };

    o.init = f.init;
    o.start = f.start;

    gamupet.gameloop = o;
}());
 