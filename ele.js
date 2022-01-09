
// (c) Marcel Timm, RhinoDevel, 2021

/** To be run during page load to augment global gamupet object with new
 *  property called ele, which is an object holding functions to create
 *  and handle HTML elements.
 */
(function() // IIFE
{
    'use strict';

    var f = {}, o = {};

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
	
	f.createAndAppend = function(tagName, parentNode, flexOrder, flexDir)
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

    o.createCanvas = f.createCanvas;
	
	o.createAndAppend = f.createAndAppend;

    o.clearContent = f.clearContent;

    gamupet.ele = o;
}());
