
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

    f.addClass = function(ele, className)
    {
        ele.classList.add(className); // (will be ign., if class already exists)
    };

    f.createAndAppend = function(
        tagName, parentNode, flexOrder, flexDir, styles, className)
    {
        var retVal = document.createElement(tagName);

        if(typeof flexOrder === 'number')
        {
            retVal.style.order = String(flexOrder);
        }
        if(typeof flexDir === 'string')
        {
            retVal.style.display = 'flex';
            retVal.style['flex-direction'] = flexDir;
        }
        if(g.obj.isObj(styles))
        {
            f.addStyles(retVal, styles);
        }
        if(typeof className === 'string')
        {
            f.addClass(retVal, className);
        }

        parentNode.appendChild(retVal);

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
    
    o.createAndAppend = f.createAndAppend;

    o.clearContent = f.clearContent;

    o.addStyles = f.addStyles;

    o.addClass = f.addClass;

    o.setNodeEnabled = f.setNodeEnabled;

    o.setNodesEnabled = f.setNodesEnabled;

    o.stopBubbling = f.stopBubbling;

    gamupet.ele = o;
}());
