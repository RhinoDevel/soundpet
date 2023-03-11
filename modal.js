
// (c) Marcel Timm, RhinoDevel, 2023

/* jshint esversion: 6 */

/* global gamupet */

/** To be run during page load to augment global gamupet object with new
 *  property called modal, which is an object holding functions to create
 *  and handle modal dialogs.
 * 
 *  * Needs/uses global gamupet object's 'ele' property.
 */
(function() // IIFE
{
    'use strict';

    var g = gamupet, // Shortcut
        f = {},
        o = {};

    f.showOkCancel = function(msg, onOk, onCancel)
    {
        const ele = g.ele.create('dialog', 'column', null, null),
            msgEle = g.ele.createAndInsert('div', ele, 0, null, null, null),
            buttonsEle = g.ele.createAndInsert(
                'div', ele, 1, 'row', null, null),
            okButEle = g.ele.createAndInsert(
                'button', buttonsEle, 0, null, null, null),
            cancelButEle = g.ele.createAndInsert(
                'button', buttonsEle, 1, null, null, null),
                
            hideDialog = function()
            {
                ele.close();
                ele.remove();
            },
            ownOnCancel = function(/*event*/)
            {
                hideDialog();

                if(typeof onCancel === 'function')
                {
                    onCancel();
                }
            };

        okButEle.textContent = 'OK';
        okButEle.addEventListener(
            'click',
            function(/*event*/)
            {
                hideDialog();

                if(typeof onOk === 'function')
                {
                    onOk();
                }
            });

        cancelButEle.textContent = 'Cancel';
        cancelButEle.addEventListener('click', ownOnCancel);
        
        ele.addEventListener('cancel', ownOnCancel); // For Escape key support.

        msgEle.textContent = msg;

        document.body.appendChild(ele);
        ele.showModal();
    };

    o.showOkCancel = f.showOkCancel;

    g.modal = o;
}());
