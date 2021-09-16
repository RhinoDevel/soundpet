
// (c) Marcel Timm, RhinoDevel, 2021

/** To be executed as last JavaScript file on page load.
 */
(function() // IIFE
{
    'use strict';

    var f = {};

    f.onLoad = function()
    {
        var playing = null,
            buttons = [
                ['2', 'C', '#', 5],
                ['3', 'D', '#', 5],
                ['5', 'F', '#', 5],
                ['6', 'G', '#', 5],
                ['7', 'A', '#', 5],

                ['q', 'C', '', 5],
                ['w', 'D', '', 5],
                ['e', 'E', '', 5],
                ['r', 'F', '', 5],
                ['t', 'G', '', 5],
                ['z', 'A', '', 5],
                ['u', 'B', '', 5],
                ['i', 'C', '', 6],

                ['s', 'C', '#', 4],
                ['d', 'D', '#', 4],
                ['g', 'F', '#', 4],
                ['h', 'G', '#', 4],
                ['j', 'A', '#', 4],

                ['y', 'C', '', 4],
                ['x', 'D', '', 4],
                ['c', 'E', '', 4],
                ['v', 'F', '', 4],
                ['b', 'G', '', 4],
                ['n', 'A', '', 4],
                ['m', 'B', '', 4],
                [',', 'C', '', 5]
            ];

        soundpet.freqplay.init();

        soundpet.noteplay.init(
            {
                octaveCount: 8,
                freqplay: soundpet.freqplay
            });

        soundpet.gameloop.init(
            {
                onLoop: function(timestamp)
                {
                    // TODO: Stop unwanted "vibrato"!

                    var i = -1;

                    if(playing !== null)
                    {
                        if(!soundpet.keyboard.isPressed(playing))
                        {
                            soundpet.noteplay.off();
                            playing = null;
                        }
                    }

                    for(i = 0;i < buttons.length; ++i)
                    {
                        if(soundpet.keyboard.isPressed(buttons[i][0]) 
                            && playing !== buttons[i][0])
                        {
                            soundpet.noteplay.on(
                                buttons[i][1], buttons[i][2], buttons[i][3]);
                            playing = buttons[i][0];
                            return;
                        }
                    }
                }
            });

        soundpet.keyboard.init();

        soundpet.gameloop.start();
    };

    window.addEventListener('load', f.onLoad);
}());
