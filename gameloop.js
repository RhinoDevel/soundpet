
// (c) Marcel Timm, RhinoDevel, 2021

/** To be run during page load to augment global soundpet object with new
 *  property called gameloop.
 */
(function() // IIFE
{
    'use strict';

    var f = {}, c = {}, v = {}, o = {};

    v.last_timestamp = 0;
    v.onLoop = null;

    f.getRand = function(min, max)
    {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    f.loop = function(timestamp)
    {
        // This is normally at 60 FPS/Hz:
        //
        //console.log(
        //    'FPS: '
        //        + String(
        //            Math.round(
        //                1.0 / ((timestamp - v.last_timestamp) / 1000.0))));
        
        v.last_timestamp = timestamp;

        v.onLoop(timestamp); // ms

        window.requestAnimationFrame(f.loop);
    };

    f.init = function(p)
    {
        v.onLoop = p.onLoop;
    };

    f.start = function()
    {
        window.requestAnimationFrame(f.loop);
    };

    o.init = f.init;
    o.start = f.start;

    soundpet.gameloop = o;
}());
