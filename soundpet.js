
// (c) Marcel Timm, RhinoDevel, 2021

/** To be run during page load to augment global gamupet object with new
 *  property called soundpet.
 */
(function() // IIFE
{
    'use strict';

    var f = {}, c = {}, v = {}, o = {};

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

    v.pressed = []; // Used (and set) by f.updatePlaying().
    v.playing = null; // Set/unset by f.play() and f.stop().
                      // Read by f.updateStatus().

    v.noteplay = null;
    v.keyboard = null;
    
    v.status = null;

    // ******************
    // *** Functions: ***
    // ******************

    /** Play note corresponding to key given.
     */
    f.play = function(key)
    {
        gamupet.noteplay.on(
            c.keyToNotes[key][0], c.keyToNotes[key][1], c.keyToNotes[key][2]);
        
        v.playing = key;
    };

    f.stop = function()
    {
        gamupet.noteplay.off();

        v.playing = null;
    };

    /**
     * - Calls f.play() and f.stop().
     */
    f.updatePlaying = function()
    {
        var pressed = gamupet.keyboard.getPressed(2 + 1),
            buf = -1;

        if(pressed.length === 0
            || pressed.length > 2) // By definition also stop
                                // playing, if more than two
                                // buttons are pressed.
        {
            f.stop();
            v.pressed = [];
            return;
        }

        // One or two keys are pressed.

        if(pressed.length === 1)
        {
            // Just one key is pressed.

            f.play(pressed[0]);
            v.pressed = pressed;
            return;
        }

        // Exactly two keys are pressed.

        if(v.pressed.length === 0)
        {
            // Interpreting both keys to be pressed simultaneously,
            // just picking one of them (the first):

            f.play(pressed[0]);
            v.pressed = pressed;
            return;
        }
        if(v.pressed.length === 1)
        {
            buf = pressed.indexOf(v.pressed[0]);
            if(buf !== -1)
            {
                // The single key's note pressed before and still
                // pressed should currently be playing,
                // change to new key's note:
                
                f.play(pressed[1 - buf]);
                v.pressed = pressed;
                return;
            }

            // Both keys were not pressed before,
            // as we are interpreting both keys to be pressed
            // simultaneously, just picking one of them (the first):

            f.play(pressed[0]);
            v.pressed = pressed;
            return;
        }

        // There were exactly two keys pressed before, one of them
        // should still be playing.
        
        if(pressed.indexOf(v.pressed[0]) !== -1
            || pressed.indexOf(v.pressed[1] !== -1))
        {
            // The note of one of the keys pressed before and still
            // pressed should currently be playing, do nothing and
            // return:
            
            v.pressed = pressed;
            return;
        }

        // Both pressed keys were not pressed before,
        // as we are interpreting both keys to be pressed
        // simultaneously, just picking one of them (the first):

        f.play(pressed[0]);
        v.pressed = pressed;
    };

    f.updateStatus = function(elapsed)
    {
        var str = '';

        str += '~' + String(Math.round(elapsed)) + 'ms'
        str += ' / ';
        str += String(Math.round(1.0 / (elapsed / 1000.0))) + ' FPS';

        str += ' | ';
        if(v.playing !== null)
        {
            str += v.playing 
                    + ' ' + c.keyToNotes[v.playing][0]
                        + c.keyToNotes[v.playing][1]
                    + ' ' + c.keyToNotes[v.playing][2];
        }
        else
        {
            str += '- - -';
        }

        v.status.textContent = str;
    };

    f.onLoop = function(timestamp, elapsed)
    {
        f.updatePlaying();
        //
        // => v.playing holds currently played note's key (or one of them, some
        //    notes can be played with multiple keys).
        //
        // => v.pressed holds currently pressed key/keys.

        f.updateStatus(elapsed);
    };
    
    f.init = function(p)
    {
        v.noteplay = p.noteplay;
        v.keyboard = p.keyboard;

        v.status = p.status;

        v.noteplay.init(
            {
                octaveCount: 8,
                freqplay: p.freqplay
            });

        v.keyboard.init(
            {
                whitelist: Object.keys(c.keyToNotes)
            });
    };

    o.init = f.init;
    o.onLoop = f.onLoop;

    gamupet.soundpet = o;
}());
