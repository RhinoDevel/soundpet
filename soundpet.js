
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

    c.startOctave = 4;
    c.notes = [
        ['C', '', c.startOctave],
        ['C', '#', c.startOctave],
        ['D', '', c.startOctave],
        ['D', '#', c.startOctave],
        ['E', '', c.startOctave],
        ['F', '', c.startOctave],
        ['F', '#', c.startOctave],
        ['G', '', c.startOctave],
        ['G', '#', c.startOctave],
        ['A', '', c.startOctave],
        ['A', '#', c.startOctave],
        ['B', '', c.startOctave],

        ['C', '', c.startOctave + 1],
        ['C', '#', c.startOctave + 1],
        ['D', '', c.startOctave + 1],
        ['D', '#', c.startOctave + 1],
        ['E', '', c.startOctave + 1],
        ['F', '', c.startOctave + 1],
        ['F', '#', c.startOctave + 1],
        ['G', '', c.startOctave + 1],
        ['G', '#', c.startOctave + 1],
        ['A', '', c.startOctave + 1],
        ['A', '#', c.startOctave + 1],
        ['B', '', c.startOctave + 1],

        ['C', '', c.startOctave + 2]
    ];
    c.keyToNotes = { // Hard-coded to german keyboard layout.
        '2': c.notes[1 * 12 +  1],
        '3': c.notes[1 * 12 +  3],
        '5': c.notes[1 * 12 +  6],
        '6': c.notes[1 * 12 +  8],
        '7': c.notes[1 * 12 + 10],

        'q': c.notes[1 * 12 +  0],
        'w': c.notes[1 * 12 +  2],
        'e': c.notes[1 * 12 +  4],
        'r': c.notes[1 * 12 +  5],
        't': c.notes[1 * 12 +  7],
        'z': c.notes[1 * 12 +  9],
        'u': c.notes[1 * 12 + 11],
        //
        'i': c.notes[2 * 12 +  0],

        's': c.notes[0 * 12 +  1],
        'd': c.notes[0 * 12 +  3],
        'g': c.notes[0 * 12 +  6],
        'h': c.notes[0 * 12 +  8],
        'j': c.notes[0 * 12 + 10],

        'y': c.notes[0 * 12 +  0],
        'x': c.notes[0 * 12 +  2],
        'c': c.notes[0 * 12 +  4],
        'v': c.notes[0 * 12 +  5],
        'b': c.notes[0 * 12 +  7],
        'n': c.notes[0 * 12 +  9],
        'm': c.notes[0 * 12 + 11],
        //
        ',': c.notes[1 * 12 +  0],
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
    v.lastStatusUpdate = null;
    
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

    f.updateStatus = function()
    {
        var str = '',
            timestamp = performance.now();

        if(v.lastStatusUpdate !== null
            && timestamp - v.lastStatusUpdate < 100.0)
        {
            return;
        }

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
        v.lastStatusUpdate = timestamp;
    };

    f.update = function()
    {
        f.updatePlaying();
        //
        // => v.playing holds currently played note's key (or one of them, some
        //    notes can be played with multiple keys).
        //
        // => v.pressed holds currently pressed key/keys.
    };

    f.draw = function()
    {
        f.updateStatus();
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
    o.update = f.update;
    o.draw = f.draw;

    gamupet.soundpet = o;
}());
