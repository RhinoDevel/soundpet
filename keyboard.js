
// (c) Marcel Timm, RhinoDevel, 2021

/** To be run during page load to augment global soundpet object with new
 *  property called keyboard.
 */
(function() // IIFE
{
    'use strict';

    var f = {}, v = {}, o = {};

    v.state = {};
    v.whitelist = null;

    f.onUp = function(e)
    {
        if(e.key in v.state)
        {
            v.state[e.key] = false;
        }
    };
    f.onDown = function(e)
    {
        if(Array.isArray(v.whitelist) && v.whitelist.indexOf(e.key) === -1)
        {
            return; // Ignore, because key is not on (existing) whitelist.
        }

        // No whitelist, or key is on whitelist.

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
    };

    /**
     * p = {
     *     whitelist: Optional array of key values leading to ignoring all other
     *                keys getting pressed/released, see:
     *                https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
     * }
     */
    f.init = function(p)
    {
        if(typeof p === 'object' && p !== null)
        {
            if(Array.isArray(p.whitelist))
            {
                v.whitelist = p.whitelist;
            }
            //
            // Otherwise: A non-existing whitelist will be ignored,
            //            an empty whitelist will work (stupid?).
        }

        window.addEventListener('keyup', f.onUp);
        window.addEventListener('keydown', f.onDown);
    };

    o.init = f.init;
    o.isPressed = f.isPressed;

    soundpet.keyboard = o;
}());
