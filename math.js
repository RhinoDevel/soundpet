
// (c) Marcel Timm, RhinoDevel, 2021

/* global gamupet */

/** To be run during page load to augment global gamupet object with new
 *  property called math, which is an object holding functions related to
 *  mathematics.
 */
(function() // IIFE
{
    'use strict';

    var f = {}, o = {};

    f.getRand = function(min, max)
    {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    f.getHex = function(val, minDigits)
    {
        var retVal = val.toString(16).toUpperCase();

        while(retVal.length < minDigits)
        {
            retVal = '0' + retVal;
        }
        return retVal;
    };

    o.getRand = f.getRand;
    o.getHex = f.getHex;

    gamupet.math = o;
}());
