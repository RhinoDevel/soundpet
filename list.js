
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

    c.class = {};
    c.class.entry = 'li_entry';

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
        g.ele.addClass(ele, c.class.entry);

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
    f.setEnabled = function(l, r, isEnabled)
    {
        g.ele.setNodesEnabled(r.childNodes, isEnabled);

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
        let curOnFlexOrderChanged = null,
            curOnDrop = null,
            curOnClick = null,
            curIsEnabled = true; // Is enabled by default.

        listEle.addEventListener(
            'click',
            function(event)
            {
                let entryEle = null;

                if(curOnClick === null)
                {
                    return;
                }

                event.stopPropagation();
                event.preventDefault();

                if(!curIsEnabled)
                {
                    return;
                }

                entryEle = event.target.closest('.' + c.class.entry);
                if(entryEle === null)
                {
                    return;
                }

                curOnClick(parseInt(entryEle.style.order, 10));
            });

        divEle.addEventListener(
            'drop',
            function(event)
            {
                if(curOnDrop === null)
                {
                    return;
                }

                event.stopPropagation();
                event.preventDefault();

                if(!curIsEnabled)
                {
                    return;
                }

                curOnDrop(event);
            });
        divEle.addEventListener(
            'dragenter',
            function(event)
            {
                event.stopPropagation();
                event.preventDefault();
            });
        divEle.addEventListener(
            'dragover',
            function(event)
            {
                event.stopPropagation();
                event.preventDefault();
            });

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
            curIsEnabled = isEnabled;

            return f.setEnabled(listEle, topRowEle, isEnabled);
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
        retVal.setOnDrop = function(onDrop)
        {
            if(typeof onDrop === 'function')
            {
                curOnDrop = onDrop;
                return;
            }
            curOnDrop = null;
        };
        retVal.setOnClick = function(onClick)
        {
            if(typeof onClick === 'function')
            {
                curOnClick = onClick;
                return;
            }
            curOnClick = null;
        };
        return retVal;
    };

    o.createAndInsert = f.createAndInsert;

    gamupet.list = o;
}());
