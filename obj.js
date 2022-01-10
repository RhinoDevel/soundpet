
// (c) Marcel Timm, RhinoDevel, 2022

/** To be run during page load to augment global gamupet object with new
 *  property called obj, which is an object holding (helper) functions to handle
 *  JavaScript objects.
 */
(function() // IIFE
{
    'use strict';

    var f = {}, o = {};

    f.isObj = function(obj)
    {
        return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
    };

    /**
     * - Iterates own properties, only.
     * - Returns given object.
     */
    f.forEach = function(obj, callback)
    {
        var key = null;

        for(key in obj)
        {
            if(obj.hasOwnProperty(key))
            {
                callback(obj[key], key, obj);
            }
        }
        return obj;
    };

    o.isObj = f.isObj;

    o.forEach = f.forEach;

    gamupet.obj = o;
}());
