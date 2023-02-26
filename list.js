
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
        return g.ele.removeAt(l, i);
    };
    f.removeAll = function(l)
    {
        g.ele.clearContent(l);
    };
    f.insertAt = function(l, ele, i)
    {
        ele.style['background-color'] = 'lightblue'; // Hard-coded

        return g.ele.insertAt(ele, l, i);
    };
    f.append = function(l, ele)
    {
        return f.insertAt(l, ele, l.childNodes.length);
    };
    f.markNone = function(l)
    {
        g.ele.addStylesToChildren(
            l, {'background-color': 'lightblue'}); // Hard-coded
    };
    f.markSingle = function(l, i, scrollTo)
    {
        const ele = g.ele.getChildAt(l, i);

        f.markNone(l);  

        g.ele.addStyles(ele, {'background-color': 'yellow'});

        if(scrollTo)
        {
            ele.scrollIntoView(false);
        }
    };
    f.setEnabled = function(l, isEnabled)
    {
        for(let i = 0;i < l.childNodes.length; ++i)
        {
            g.ele.setNodesEnabled(l.childNodes[i].childNodes, isEnabled);
        }
    };

    /**
     * - Returns the list object, NOT just the element.
     */
    f.createAndInsert = function(p)
    {
        const retVal = {},
            listEle = g.ele.createAndInsert(
                'div',
                p.parentNode,
                p.flexOrder,
                'column',
                p.styles,
                p.className);

        listEle.style['overflow-y'] = 'scroll';
        listEle.style['background-color'] = 'lightcyan';

        g.ele.stopBubbling(listEle, ['keyup', 'keydown']);

        retVal.removeAt = function(i)
        {
            return f.removeAt(listEle, i);
        };
        retVal.removeAll = function()
        {
            return f.removeAll(listEle);
        };
        retVal.insertAt = function(ele, i)
        {
            return f.insertAt(listEle, ele, i);
        };
        retVal.append = function(ele)
        {
            return f.append(listEle, ele);
        };
        retVal.markNone = function()
        {
            return f.markNone(listEle);
        };
        retVal.markSingle = function(i, scrollTo)
        {
            return f.markSingle(listEle, i, scrollTo);
        };
        retVal.setEnabled = function(isEnabled)
        {
            return f.setEnabled(listEle, isEnabled);
        }
        return retVal;
    };

    o.createAndInsert = f.createAndInsert;

    gamupet.list = o;
}());
