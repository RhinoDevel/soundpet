
// (c) Marcel Timm, RhinoDevel, 2023

/* jshint esversion: 6 */

/* global gamupet */

/** To be run during page load to augment global gamupet object with new
 *  property called list.
 */
(function() // IIFE
{
    'use strict';

    const f = {}, o = {};

    /**
     * - Returns the list object, NOT just the element.
     */
    f.createAndAppend = function(p)
    {
        const retVal = {};

        retVal.ele = gamupet.ele.createAndAppend(
            'div',
            p.parentNode,
            p.flexOrder,
            'column',
            p.styles,
            p.className);

        retVal.ele.style['overflow-y'] = 'scroll';

        return retVal;
    };

    o.createAndAppend = f.createAndAppend;

    gamupet.list = o;
}());
