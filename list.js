
// (c) Marcel Timm, RhinoDevel, 2023

/* jshint esversion: 6 */

/* global gamupet */

/** To be run during page load to augment global gamupet object with new
 *  property called list.
 */
(function() // IIFE
{
    'use strict';

    const g = gamupet, // Shortcut
        f = {},
        o = {};

    f.removeAt = function(l, i)
    {
        return g.ele.removeAt(l.ele, i);
    };
    f.insertAt = function(l, ele, i)
    {
        ele.style['background-color'] = 'lightblue'; // Hard-coded

        return g.ele.insertAt(ele, l.ele, i);
    };
    f.append = function(l, ele)
    {
        return f.insertAt(l, ele, l.ele.childNodes.length);
    };
    f.markNone = function(l)
    {
        g.ele.addStylesToChildren(
            l.ele, {'background-color': 'lightblue'}); // Hard-coded
    };
    f.markSingle = function(l, i)
    {
        f.markNone(l);  

        g.ele.addStyles(
            g.ele.getChildAt(l.ele, i), {'background-color': 'yellow'});
    };

    /**
     * - Returns the list object, NOT just the element.
     */
    f.createAndInsert = function(p)
    {
        const retVal = {};

        retVal.ele = g.ele.createAndInsert(
            'div',
            p.parentNode,
            p.flexOrder,
            'column',
            p.styles,
            p.className);

        retVal.ele.style['overflow-y'] = 'scroll';
        retVal.ele.style['background-color'] = 'lightcyan';

        g.ele.stopBubbling(retVal.ele, ['keyup', 'keydown']);

        retVal.removeAt = function(i)
        {
            return f.removeAt(retVal, i);
        };
        retVal.insertAt = function(ele, i)
        {
            return f.insertAt(retVal, ele, i);
        };
        retVal.append = function(ele)
        {
            return f.append(retVal, ele);
        };
        retVal.markNone = function()
        {
            return f.markNone(retVal);
        };
        retVal.markSingle = function(i)
        {
            return f.markSingle(retVal, i);
        };
        return retVal;
    };

    o.createAndInsert = f.createAndInsert;

    gamupet.list = o;
}());
