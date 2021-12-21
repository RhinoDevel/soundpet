
// (c) Marcel Timm, RhinoDevel, 2021

/** To be executed as last JavaScript file on page load.
 */
(function() // IIFE
{
    'use strict';

    var f = {}, c = {}, v = {};

    // ********************
    // *** "Constants": ***
    // ********************

    c.keyToNotes = { // Hard-coded to german keyboard layout.
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
    };

    // ***************************
    // *** "Static" variables: ***
    // ***************************

    v.pressedBefore = [];

    // ******************
    // *** Functions: ***
    // ******************

    /** Play note corresponding to key given.
     */
    f.play = function(key)
    {
        soundpet.noteplay.on(
            c.keyToNotes[key][0], c.keyToNotes[key][1], c.keyToNotes[key][2]);
        
        document.body.textContent = // TODO: Hack (1/2)!
            key 
                + ' ' + c.keyToNotes[key][0] + c.keyToNotes[key][1]
                + ' ' + c.keyToNotes[key][2];
    };

    f.stop = function()
    {
        soundpet.noteplay.off();

        document.body.textContent = '- - -'; // TODO: Hack (2/2)!
    };

    f.onLoop = function(/*timestamp*/)
    {
        var pressed = soundpet.keyboard.getPressed(2 + 1),
            buf = -1;

        if(pressed.length === 0
            || pressed.length > 2) // By definition also stop
                                   // playing, if more than two
                                   // buttons are pressed.
        {
            f.stop();
            v.pressedBefore = [];
            return;
        }

        // One or two keys are pressed.

        if(pressed.length === 1)
        {
            // Just one key is pressed.

            f.play(pressed[0]);
            v.pressedBefore = pressed;
            return;
        }

        // Exactly two keys are pressed.

        if(v.pressedBefore.length === 0)
        {
            // Interpreting both keys to be pressed simultaneously,
            // just picking one of them (the first):

            f.play(pressed[0]);
            v.pressedBefore = pressed;
            return;
        }
        if(v.pressedBefore.length === 1)
        {
            buf = pressed.indexOf(v.pressedBefore[0]);
            if(buf !== -1)
            {
                // The single key's note pressed before and still
                // pressed should currently be playing,
                // change to new key's note:
                
                f.play(pressed[1 - buf]);
                v.pressedBefore = pressed;
                return;
            }

            // Both keys were not pressed before,
            // as we are interpreting both keys to be pressed
            // simultaneously, just picking one of them (the first):

            f.play(pressed[0]);
            v.pressedBefore = pressed;
            return;
        }

        // There were exactly two keys pressed before, one of them
        // should still be playing.
        
        if(pressed.indexOf(v.pressedBefore[0]) !== -1
            || pressed.indexOf(v.pressedBefore[1] !== -1))
        {
            // The note of one of the keys pressed before and still
            // pressed should currently be playing, do nothing and
            // return:
            
            v.pressedBefore = pressed;
            return;
        }

        // Both pressed keys were not pressed before,
        // as we are interpreting both keys to be pressed
        // simultaneously, just picking one of them (the first):

        f.play(pressed[0]);
        v.pressedBefore = pressed;
    };
    
    f.init = function()
    {
        soundpet.freqplay.init();

        soundpet.noteplay.init(
            {
                octaveCount: 8,
                freqplay: soundpet.freqplay
            });

        soundpet.gameloop.init(
            {
                onLoop: f.onLoop
            });

        soundpet.keyboard.init(
            {
                whitelist: Object.keys(c.keyToNotes)
            });

        soundpet.gameloop.start();
    };

    window.addEventListener('load', f.init);
}());
