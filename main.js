
// (c) Marcel Timm, RhinoDevel, 2021

/* global gamupet */

/** To be executed as last JavaScript file on page load.
 */
(function() // IIFE
{
    'use strict';

    var f = {}, v = {};

    v.ele = {};

    v.ele.screen = null;
    v.ele.status = null;

    v.list = {};

    v.list.tune = null;

    f.init = function()
    {
        var mainEle = null,
            screenInnerEle = null,
            screenOuterEle = null,
            statusAndLoopBut = null,
            loopButEle = null;

        mainEle = gamupet.ele.createAndInsert(
            'div',
            document.body,
            null,
            'row',
            {'flex-wrap': 'wrap'});

        screenOuterEle = gamupet.ele.createAndInsert(
            'div',
            mainEle,
            0,
            'column'/*'row'*/,
            {
                width: String(gamupet.c.dim.screenOuter.width) + 'px',
                height: String(gamupet.c.dim.screenOuter.height) + 'px',
                'background-color': 'lightgray',
                'justify-content': 'center',
                'align-items': 'center',
                'margin-right': gamupet.c.margin,
                'margin-bottom': gamupet.c.margin
            });

        screenInnerEle = gamupet.ele.createAndInsert(
            'div',
            screenOuterEle,
            0,
            null,
            {position: 'relative'});

        mainEle.appendChild(screenOuterEle);

        v.list.tune = gamupet.list.createAndInsert(
            {
                parentNode: mainEle,
                flexOrder: 1,
                styles: {
                    border: '1px solid black',
                    'font-family': 'monospace',
                    width: gamupet.c.dim.tune.width,
                    height: gamupet.c.dim.tune.height,
                    'margin-right': gamupet.c.margin,
                    'margin-bottom': gamupet.c.margin
                }
            });

        statusAndLoopBut = gamupet.ele.createAndInsert(
            'div', mainEle, 2, null, null);

        loopButEle = gamupet.ele.createAndInsert(
            'input', statusAndLoopBut, null, null, null);
        loopButEle.type = 'checkbox';
        loopButEle.checked = true;
        loopButEle.title = 'Start/stop processing loop.';
        loopButEle.addEventListener(
            'input',
            function()
            {
                if(loopButEle.checked)
                {
                    gamupet.gameloop.start();
                    return;
                }
                gamupet.gameloop.stop();
            });

        v.ele.status = gamupet.ele.createAndInsert(
            'span', statusAndLoopBut, null, null, null);

        v.ele.screen = gamupet.room.init(
            {
                dim: {
                    inner: gamupet.c.dim.screen,
                    outer: gamupet.c.dim.screenOuter
                },
                createCanvas: gamupet.ele.createCanvas,
                ele: screenInnerEle,
                backgroundColor: 'rgba('
                        + String(gamupet.c.pix.off.r)
                        + ',' + String(gamupet.c.pix.off.g)
                        + ',' + String(gamupet.c.pix.off.b)
                        + ',' + String(gamupet.c.pix.off.a)
                    + ')'
            });
    };

    f.onLoad = function()
    {
        f.init();

        gamupet.chardraw.init(
            {
                canvas: v.ele.screen,
                dim: {
                    char: gamupet.c.dim.char
                },
                pix: {
                    on: gamupet.c.pix.on,
                    off: gamupet.c.pix.off
                },
                chars: gamupet.c.chars
            });

        gamupet.freqplay.init();

        // (noteplay and keyboard will be initialised by soundpet)

        gamupet.soundpet.init(
            {
                // dim: {
                //     width: gamupet.c.dim.screen.width
                //             / gamupet.c.dim.char.width,
                //     height: gamupet.c.dim.screen.height
                //             / gamupet.c.dim.char.height
                // },
                // charCount: gamupet.c.charCount,
                //
                // drawPetAt: gamupet.chardraw.petAt,
                //getRand: gamupet.math.getRand,

                freqplay: gamupet.freqplay,
                noteplay: gamupet.noteplay,
                keyboard: gamupet.keyboard,
                chardraw: gamupet.chardraw,
                ele: gamupet.ele,
                math: gamupet.math,

                status: v.ele.status,
                tuneList: v.list.tune
            });

        gamupet.gameloop.init(
            {
                freq: gamupet.c.freq,
                update: gamupet.soundpet.update,
                draw: gamupet.soundpet.draw
            });

        // TODO: Clean this up:
        //
        gamupet.chardraw.petMask(
            [
                3,
                33,
                6,
                61, 96, 18, 5, 3, 46,
       
                5,
                33,
                6,
                61, 96, 16, 12, 1, 25,

                3,
                2,
                13,
                85,
                64,
                114,
                64,
                73,
                96,
                85, 64, 114, 64, 114, 64, 73,
            
                4,
                2,
                13,
                93,
                96, 93, 96, 93,96, 93,96, 93,96, 93,96, 93,
            
                5,
                1,
                17,
                85,
                113,
                114, 113, 114, 113, 114, 113, 114, 113, 114, 113, 114, 113, 114,
                64, 73,
            
                6,
                1,
                17,
                93, 96, 93, 96, 93, 96, 93, 96, 93, 96, 93, 96, 93, 96, 93,
                96, 93,
            
                7,
                1,
                17,
                74,
                64, 113, 114, 113, 114, 113, 114, 113, 114, 113, 114, 113, 114,
                113, 114,
                75,
            
                8,
                4,
                13,
                93, 96, 93, 96, 93, 96, 93, 96, 93, 96, 93, 96, 93,
            
                9,
                3,
                17,
                85, 113, 114, 113, 114, 113, 114, 113, 114, 113, 114, 113, 114,
                113, 114, 64, 73,
            
                10,
                3,
                17,
                93, 96, 93, 96, 93, 96, 93, 96, 93, 96, 93, 96, 93, 96, 93,
                96, 93,
            
                11,
                3,
                17,
                74, 64, 113, 64, 113, 64, 113, 64, 113, 64, 113, 64, 113,
                64, 113, 64, 75
            ],
            true);

        gamupet.gameloop.start();
    };

    window.addEventListener('load', f.onLoad);
}());
