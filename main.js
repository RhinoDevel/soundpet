
// (c) Marcel Timm, RhinoDevel, 2021

/** To be executed as last JavaScript file on page load.
 */
(function() // IIFE
{
    'use strict';

    var f = {};

    f.onLoad = function()
    {
        var pressedBefore = [],
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
                    var pressed = soundpet.keyboard.getPressed(2 + 1),
                        buf = -1;

                    if(pressed.length === 0
                        || pressed.length > 2) // By definition also stop
                                               // playing, if more than two
                                               // buttons are pressed.
                    {
                        soundpet.noteplay.off();
                        pressedBefore = [];
                        return;
                    }

                    // One or two keys are pressed.

                    if(pressed.length === 1)
                    {
                        soundpet.noteplay.on(
                            buttons[pressed[0]][0],
                            buttons[pressed[0]][1],
                            buttons[pressed[0]][2]);
                        pressedBefore = pressed;
                        return;
                    }

                    // Exactly two keys are pressed.

                    if(pressedBefore.length === 0)
                    {
                        // Interpreting both keys to be pressed simultaneously,
                        // just picking one of them (the first):

                        soundpet.noteplay.on(
                            buttons[pressed[0]][0],
                            buttons[pressed[0]][1],
                            buttons[pressed[0]][2]);
                        pressedBefore = pressed;
                        return;
                    }
                    if(pressedBefore.length === 1)
                    {
                        buf = pressed.indexOf(pressedBefore[0]);
                        if(buf !== -1)
                        {
                            // The single key's note pressed before and still
                            // pressed should currently be playing,
                            // change to new key's note:
                            
                            buf = 1 - buf;
                            soundpet.noteplay.on(
                                buttons[pressed[buf]][0],
                                buttons[pressed[buf]][1],
                                buttons[pressed[buf]][2]);
                            pressedBefore = pressed;
                            return;
                        }

                        // Both keys were not pressed before,
                        // as we are interpreting both keys to be pressed
                        // simultaneously, just picking one of them (the first):

                        soundpet.noteplay.on(
                            buttons[pressed[0]][0],
                            buttons[pressed[0]][1],
                            buttons[pressed[0]][2]);
                        pressedBefore = pressed;
                        return;
                    }

                    // There were exactly two keys pressed before, one of them
                    // should still be playing.
                    
                    if(pressed.indexOf(pressedBefore[0]) !== -1
                        || pressed.indexOf(pressedBefore[1] !== -1))
                    {
                        // The note of one of the keys pressed before and still
                        // pressed should currently be playing, do nothing and
                        // return:
                        
                        pressedBefore = pressed;
                        return;
                    }

                    // Both pressed keys were not pressed before,
                    // as we are interpreting both keys to be pressed
                    // simultaneously, just picking one of them (the first):

                    soundpet.noteplay.on(
                        buttons[pressed[0]][0],
                        buttons[pressed[0]][1],
                        buttons[pressed[0]][2]);
                    pressedBefore = pressed;
                }
            });

        soundpet.keyboard.init({whitelist: keys});

        soundpet.gameloop.start();
    };

    window.addEventListener('load', f.onLoad);
}());
