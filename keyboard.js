
// (c) Marcel Timm, RhinoDevel, 2021

/** To be run during page load to augment global soundpet object with new
 *  property called keyboard.
 */
(function() // IIFE
{
    'use strict';

    var f = {}, v = {}, o = {};

    v.state = [];

    f.onUp = function(e)
    {
        v.state[e.key] = false;
    };
    f.onDown = function(e)
    {
        v.state[e.key] = true;
    };

    f.isPressed = function(key)
    {
        // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key

        if(!(key in v.state))
        {
            return false;
        }
        return v.state[key];
    }

    f.init = function()
    {
        window.addEventListener('keyup', f.onUp);
        window.addEventListener('keydown', f.onDown);
    };

    o.init = f.init;
    o.isPressed = f.isPressed;

    soundpet.keyboard = o;
}());
