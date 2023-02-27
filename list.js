
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
        o = {},
        c = {};

    c.bgColor = {};
    c.bgColor.marked = 'yellow';
    c.bgColor.unmarked = 'lightblue';

    f.removeAt = function(l, i, onFlexOrderChanged)
    {
        return g.ele.removeAt(l, i, onFlexOrderChanged);
    };
    f.removeAll = function(l)
    {
        // NOT calling on-flex-order-changed callback, here.

        g.ele.clearContent(l);
    };
    f.insertAt = function(l, ele, i, onFlexOrderChanged)
    {
        ele.style['background-color'] = c.bgColor.unmarked;

        return g.ele.insertAt(ele, l, i, onFlexOrderChanged);
    };
    f.append = function(l, ele, onFlexOrderChanged)
    {
        return f.insertAt(l, ele, l.childNodes.length, onFlexOrderChanged);
    };
    f.markNone = function(l)
    {
        g.ele.addStylesToChildren(
            l, {'background-color': c.bgColor.unmarked});
    };
    f.markSingle = function(l, i, scrollTo)
    {
        const ele = g.ele.getChildAt(l, i);

        f.markNone(l);  

        g.ele.addStyles(ele, {'background-color': c.bgColor.marked});

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
    f.scrollIntoView = function(l, i)
    {
        g.ele.getChildAt(l, i).scrollIntoView(false);
    };
    f.insertInTopRowAt = function(r, ele, i)
    {
        g.ele.insertAt(ele, r, i, null);

        ele.style['font-family'] = 'inherit';
    };
    f.appendToTopRow = function(r, ele)
    {
        return f.insertInTopRowAt(r, ele, r.childNodes.length);
    };

    /**
     * - Returns the list object, NOT just the element.
     */
    f.createAndInsert = function(p)
    {
        const retVal = {},
            divEle = g.ele.createAndInsert(
                'div',
                p.parentNode,
                p.flexOrder,
                'column',
                p.styles,
                p.className,
                null),
            topRowEle = g.ele.createAndInsert(
                'div',
                divEle,
                0,
                'row',
                null,
                null,
                null),
            listEle = g.ele.createAndInsert(
                'div',
                divEle,
                1,
                'column',
                {
                    height: 'inherit',
                    'overflow-y': 'scroll',
                    'background-color': 'lightcyan'
                },
                null,
                null);
        let curOnFlexOrderChanged = null;

        g.ele.stopBubbling(listEle, ['keyup', 'keydown']);

        retVal.removeAt = function(i)
        {
            return f.removeAt(listEle, i, curOnFlexOrderChanged);
        };
        retVal.removeAll = function()
        {
            return f.removeAll(listEle);
        };
        retVal.insertAt = function(ele, i)
        {
            return f.insertAt(listEle, ele, i, curOnFlexOrderChanged);
        };
        retVal.append = function(ele)
        {
            return f.append(listEle, ele, curOnFlexOrderChanged);
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
        };
        retVal.scrollIntoView = function(i)
        {
            return f.scrollIntoView(listEle, i);
        };
        retVal.insertInTopRowAt = function(ele, i)
        {
            return f.insertInTopRowAt(topRowEle, ele, i);
        };
        retVal.appendToTopRow = function(ele)
        {
            return f.appendToTopRow(topRowEle, ele);
        };
        
        retVal.setOnFlexOrderChanged = function(onFlexOrderChanged)
        {
            if(typeof onFlexOrderChanged === 'function')
            {
                curOnFlexOrderChanged = onFlexOrderChanged;
                return;
            }
            curOnFlexOrderChanged = null;
        };
        return retVal;
    };

    o.createAndInsert = f.createAndInsert;

    gamupet.list = o;
}());
