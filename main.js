
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
            playingBefore = null,
            buttons = {
                '2': ['C', '#', 5],
                '3': ['D', '#', 5],
                '5': ['F', '#', 5],
                '6': ['G', '#', 5],
                '7': ['A', '#', 5],

                'q': ['C', '', 5],
                'w': ['D', '', 5],
                'e': ['E', '', 5],
                'r': ['F', '', 5],
                't': ['G', '', 5],
                'z': ['A', '', 5],
                'u': ['B', '', 5],
                'i': ['C', '', 6],

                's': ['C', '#', 4],
                'd': ['D', '#', 4],
                'g': ['F', '#', 4],
                'h': ['G', '#', 4],
                'j': ['A', '#', 4],

                'y': ['C', '', 4],
                'x': ['D', '', 4],
                'c': ['E', '', 4],
                'v': ['F', '', 4],
                'b': ['G', '', 4],
                'n': ['A', '', 4],
                'm': ['B', '', 4],
                ',': ['C', '', 5]
            },
            keys = Object.keys(buttons);

        soundpet.freqplay.init();

        soundpet.noteplay.init(
            {
                octaveCount: 8,
                freqplay: soundpet.freqplay
            });

        soundpet.gameloop.init(
            {
                onLoop: function(/*timestamp*/)
                {
                    // TODO: Stop unwanted "vibrato"!

                    keys.some(
                        function(key)
                        {
                            var isPlaying = playing === key;

                            if(!soundpet.keyboard.isPressed(key))
                            {
                                // Current key is not pressed.

                                if(isPlaying)
                                {
                                    // Not pressed, but playing. => Disable.

                                    soundpet.noteplay.off();
                                    playing = null;
                                }
                                return false; // Next.
                            }

                            // Current key is pressed.

                            if(isPlaying)
                            {
                                return false; // Pressed and playing. => Next.
                            }

                            // Current key is pressed, but not playing:
                
                            soundpet.noteplay.on(
                                buttons[key][0],
                                buttons[key][1],
                                buttons[key][2]);
                            playing = key;
                            return true;
                        });
                }
            });

        soundpet.keyboard.init({whitelist: keys});

        soundpet.gameloop.start();
    };

    window.addEventListener('load', f.onLoad);
}());
