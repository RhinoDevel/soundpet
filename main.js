
// (c) Marcel Timm, RhinoDevel, 2021

/** To be executed as last JavaScript file on page load.
 */
(function() // IIFE
{
    'use strict';

    var f = {}, v = {};

    v.soundpetStatus = null;

    f.prepareBodyForFullScreen = function()
    {
        document.body.style.width = '100%';
        document.body.style.height = '100%';
        document.body.style.border = '0px none';
        document.body.style.padding = '0px';
        document.body.style.margin = '0px';
    };

    f.createContainer = function(width, height)
    {
        var retVal = document.createElement('div');

        retVal.style.width = String(width) + 'px';
        retVal.style.height = String(height) + 'px';
        retVal.style['background-color'] = 'lightgray';
        retVal.style.display = 'flex';
        retVal.style['justify-content'] = 'center';
        retVal.style['align-items'] = 'center';

        return retVal;
    };

    f.createEle = function()
    {
        var retVal = document.createElement('div');
        
        retVal.style.order = String(1);
        retVal.style.position = 'relative';

        return retVal;
    };

    /**
     * - Returns canvas.
     */
    f.initEles = function()
    {
        var ele = f.createEle(),
            container = null,
            outerDim = {};

        if(gamupet.c.fullscreen)
        {
            f.prepareBodyForFullScreen();

            outerDim.width = document.body.clientWidth;
            outerDim.height = document.body.clientHeight;
        }
        else
        {
            outerDim.width = 640;  // These are
            outerDim.height = 480; // sample values.
        }

        container = f.createContainer(outerDim.width, outerDim.height);

        container.appendChild(ele);
        document.body.appendChild(container);

        v.soundpetStatus = document.createElement('div');
        document.body.appendChild(v.soundpetStatus);

        return gamupet.room.init(
            {
                dim: {
                    inner: gamupet.c.dim.screen,
                    outer: outerDim
                },
                createCanvas: gamupet.ele.createCanvas,
                ele: ele,
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
        var canvas = f.initEles();

        gamupet.chardraw.init(
            {
                canvas: canvas,
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

                status: v.soundpetStatus
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
                22,
                85, 113, 114, 113, 114, 113, 114, 113, 114, 113, 114, 113, 114,
                113, 114, 64, 73,
                112,
                64, 114, 64,
                110,
            
                10,
                3,
                22,
                93, 96, 93, 96, 93, 96, 93, 96, 93, 96, 93, 96, 93, 96, 93,
                96, 93, 93, 96, 93, 96, 93,
            
                11,
                3,
                22,
                74, 64, 113, 64, 113, 64, 113, 64, 113, 64, 113, 64, 113,
                64, 113, 64, 75,
                109,
                64, 113, 64,
                125
            ],
            true);

        gamupet.gameloop.start();
    };

    window.addEventListener('load', f.onLoad);
}());
