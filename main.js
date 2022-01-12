
// (c) Marcel Timm, RhinoDevel, 2021

/** To be executed as last JavaScript file on page load.
 */
(function() // IIFE
{
    'use strict';

    var f = {}, v = {};

    v.ele = {};

    v.ele.screen = null;
	v.ele.tune = null;
    v.ele.status = null;

    f.initEles = function()
    {
        var mainEle = null,
            screenInner = null,
            screenOuter = null,
            outerDim = {width: 480, height: 300}, // These are sample values.
            tuneDim = {width: '38ch', height: '48ch'}; // These are sample values.

        mainEle = gamupet.ele.createAndAppend(
            'div',
            document.body,
            null,
            'row',
            {'flex-wrap': 'wrap'});

        screenOuter = gamupet.ele.createAndAppend(
            'div',
            mainEle,
            1,
            'column'/*'row'*/,
            {
                width: String(outerDim.width) + 'px',
                height: String(outerDim.height) + 'px',
                'background-color': 'lightgray',
                'justify-content': 'center',
                'align-items': 'center',
                'margin-right': '0.4ch',
                'margin-bottom': '0.4ch'
            });

        screenInner = gamupet.ele.createAndAppend(
            'div',
            screenOuter,
            1,
            null,
            {position: 'relative'});

        mainEle.appendChild(screenOuter);

		v.ele.tune = gamupet.ele.createAndAppend(
            'div',
            mainEle,
            2,
            'column',
            {
                border: '1px solid black',
		        'overflow-y': 'scroll',
		        'font-family': 'monospace',
		        width: tuneDim.width,
		        height: tuneDim.height,
                'margin-right': '0.4ch',
                'margin-bottom': '0.4ch'
            });

        v.ele.status = gamupet.ele.createAndAppend(
            'div', mainEle, 3, null, null);

        v.ele.screen = gamupet.room.init(
            {
                dim: {
                    inner: gamupet.c.dim.screen,
                    outer: outerDim
                },
                createCanvas: gamupet.ele.createCanvas,
                ele: screenInner,
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
        f.initEles();

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

                status: v.ele.status,
				tuneEle: v.ele.tune
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
