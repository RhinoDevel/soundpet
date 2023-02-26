
// (c) Marcel Timm, RhinoDevel, 2021

/* global gamupet */

/** To be run during page load to augment global gamupet object with new
 *  property called ele, which is an object holding functions to create
 *  and handle HTML elements.
 * 
 *  * Needs/uses global gamupet object's 'obj' property.
 */
(function() // IIFE
{
    'use strict';

    var g = gamupet, // Shortcut
        f = {},
        o = {};

    f.createCanvas = function(t, l, w, h, cW, cH)
    {
        var retVal = document.createElement('canvas');

        if(typeof t === 'number')
        {
            retVal.style.position = 'absolute';
            retVal.style.top = String(t) + 'px';
        }
        if(typeof l === 'number')
        {
            retVal.style.position = 'absolute';
            retVal.style.left = String(l) + 'px';
        }

        if(typeof w === 'number')
        {
            retVal.style.width = String(w) + 'px';
        }
        if(typeof h === 'number')
        {
            retVal.style.height = String(h) + 'px';
        }

        if(typeof cW === 'number')
        {
            retVal.width = cW;
        }
        if(typeof cH === 'number')
        {
            retVal.height = cH;
        }

        return retVal;
    };

    /**
     * - Returns given element.
     */
    f.addStyles = function(ele, styles)
    {
        g.obj.forEach(
            styles,
            function(val, key)
            {
                ele.style[key] = val;
            });
        return ele;
    };

    f.addStylesToChildren = function(ele, styles)
    {
        var i = -1;

        while(++i < ele.childNodes.length)
        {
            f.addStyles(ele.childNodes[i], styles);
        }
    };

    f.addClass = function(ele, className)
    {
        ele.classList.add(className); // (will be ign., if class already exists)
    };

    f.addToChildrenFlexOrders = function(ele, firstFlexOrder, val)
    {
        var i = -1, n = -1;

        while(++i < ele.childNodes.length)
        {
            // The flex order does not equal the actual child node order.

            n = parseInt(ele.childNodes[i].style.order, 10);
            if(isNaN(n))
            {
                continue;
            }
            if(n < firstFlexOrder)
            {
                continue;
            }
            ele.childNodes[i].style.order = String(n + val);
        }
    };
    f.incrChildrenFlexOrders = function(ele, firstFlexOrder)
    {
        return f.addToChildrenFlexOrders(ele, firstFlexOrder, 1);
    };
    f.decrChildrenFlexOrders = function(ele, firstFlexOrder)
    {
        return f.addToChildrenFlexOrders(ele, firstFlexOrder, -1);
    };

    f.getChildAt = function(ele, flexOrder)
    {
        var i = -1, n = -1;

        while(++i < ele.childNodes.length)
        {
            // The flex order does not equal the actual child node order.

            n = parseInt(ele.childNodes[i].style.order, 10);
            if(isNaN(n))
            {
                continue;
            }
            if(n === flexOrder)
            {
                return ele.childNodes[i];
                //
                // (assuming all flex order nrs. to be unique..)
            }
        }
        return null;
    };

    f.removeAt = function(ele, flexOrder)
    {
        var i = -1, n = -1;

        while(++i < ele.childNodes.length)
        {
            // The flex order does not equal the actual child node order.

            n = parseInt(ele.childNodes[i].style.order, 10);
            if(isNaN(n))
            {
                continue;
            }
            if(n === flexOrder)
            {
                ele.childNodes[i].remove();
                f.decrChildrenFlexOrders(ele, n + 1);
                return; // (assuming all flex order nrs. to be unique..)
            }
        }
    };

    f.append = function(ele, parentNode, flexOrder)
    {
        if(typeof flexOrder === 'number')
        {
            ele.style.order = String(flexOrder);

            f.incrChildrenFlexOrders(parentNode, flexOrder);
        }
        parentNode.appendChild(ele);
    };

    f.insertAt = function(ele, parentNode, flexOrder)
    {
        if(flexOrder < 0)
        {
            throw 'ele.insertAt : Error: Exp. i to be greater or eq. to 0!';
        }
        if(flexOrder > parentNode.childNodes.length)
        {
            throw 'ele.insertAt : Error: Exp. i to be smaller or equal to cur. children count!';
        }
        if(!parentNode.hasChildNodes && flexOrder !== 0)
        {
            throw 'ele.insertAt : Error: Exp. given i to be 0 for insertion in node w/o children!';
        }

        f.append(ele, parentNode, flexOrder);
        //
        // Actual ordering of entries is done via flexbox.
    };

    f.create = function(tagName, flexDir, styles, className)
    {
        var retVal = document.createElement(tagName);

        if(g.obj.isObj(styles))
        {
            f.addStyles(retVal, styles);
        }
        if(typeof className === 'string')
        {
            f.addClass(retVal, className);
        }
        if(typeof flexDir === 'string')
        {
            retVal.style.display = 'flex';
            retVal.style['flex-direction'] = flexDir;
        }
        return retVal;
    };

    f.createAndInsert = function(
        tagName, parentNode, flexOrder, flexDir, styles, className)
    {
        var retVal = f.create(tagName, flexDir, styles, className);

        f.insertAt(retVal, parentNode, flexOrder);
        return retVal;
    };
    
    f.clearContent = function(node)
    {
        while(node.firstChild !== null)
        {
            node.removeChild(node.firstChild);
        }
    };

    f.setNodeEnabled = function(node, isEnabled)
    {
        node.disabled = !isEnabled;
    };

    f.setNodesEnabled = function(nodes, areEnabled)
    {
        var i = -1;

        while(++i < nodes.length)
        {
            f.setNodeEnabled(nodes[i], areEnabled);
        }
    };

    f.stopBubblingHelper = function(ele, eventStr)
    {
        ele.addEventListener(
            eventStr,
            function(event)
            {
                event.stopPropagation();
            });
    };
    f.stopBubbling = function(ele, eventStrOrArr)
    {
        var arr = Array.isArray(eventStrOrArr)
                    ? eventStrOrArr : [eventStrOrArr];

        arr.forEach(
            function(eventStr)
            {
                f.stopBubblingHelper(ele, eventStr);
            });
    };

    o.createCanvas = f.createCanvas;
    
    o.create = f.create;

    o.getChildAt = f.getChildAt;

    o.removeAt = f.removeAt;

    o.append = f.append;

    o.insertAt = f.insertAt;

    o.createAndInsert = f.createAndInsert;

    o.clearContent = f.clearContent;

    o.addStyles = f.addStyles;

    o.addStylesToChildren = f.addStylesToChildren;

    o.addClass = f.addClass;

    o.setNodeEnabled = f.setNodeEnabled;

    o.setNodesEnabled = f.setNodesEnabled;

    o.stopBubbling = f.stopBubbling;

    gamupet.ele = o;
}());
