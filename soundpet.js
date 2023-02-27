
// (c) Marcel Timm, RhinoDevel, 2021

/* global gamupet */

// Recording export format:
//
/*
{
    step: 20, // ms (e.g. 20ms for 50Hz/FPS).
    notes: [
        ['C', '', 4], // Note, modifier and octave.
        ['C', '#', 4],
        ['D', '', 4],
        ['D', '#', 4],
        ['E', '', 4],
        ['F', '', 4],
        ['F', '#', 4],
        ['G', '', 4],
        ['G', '#', 4],
        ['A', '', 4],
        ['A', '#', 4],
        ['B', '', 4],

        ['C', '', 4 + 1],
        ['C', '#', 4 + 1],
        ['D', '', 4 + 1],
        ['D', '#', 4 + 1],
        ['E', '', 4 + 1],
        ['F', '', 4 + 1],
        ['F', '#', 4 + 1],
        ['G', '', 4 + 1],
        ['G', '#', 4 + 1],
        ['A', '', 4 + 1],
        ['A', '#', 4 + 1],
        ['B', '', 4 + 1],

        ['C', '', 4 + 2]
    ],
    
    tune: [
        [50, 0], // Length in multiples of step and note's index (255 = pause).
        [50, 2], 
        [50, 4], 
        [50, 5], 
        [100, 7], 
        [50, 9], 
        [50, 11], 
        [100, 12]
    ]
}
*/

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
    c.pause = 255; // Pseudo-index for pause.
    c.maxNoteLength = 65535; // Maximum value for notes and pauses (2 bytes).
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
    c.defaultNote = [50, c.pause];
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
    c.keyToNotesDraw = {
        '2': [3, 4, 50], // charX, charY, screenCode
        '3': [5, 4, 51],
        '5': [9, 4, 53],
        '6': [11, 4, 54],
        '7': [13, 4, 55],

        'q': [2, 6, 17],
        'w': [4, 6, 23],
        'e': [6, 6, 5],
        'r': [8, 6, 18],
        't': [10, 6, 20],
        'z': [12, 6, 26],
        'u': [14, 6, 21],
        //
        'i': [16, 6, 9],

        's': [5, 8, 19],
        'd': [7, 8, 4],
        'g': [11, 8, 7],
        'h': [13, 8, 8],
        'j': [15, 8, 10],

        'y': [4, 10, 25],
        'x': [6, 10, 24],
        'c': [8, 10, 3],
        'v': [10, 10, 22],
        'b': [12, 10, 2],
        'n': [14, 10, 14],
        'm': [16, 10, 13],
        //
        ',': [18, 10, 44]
    };

    c.keyToCmd = {
        'o': 'rec',
        'p': 'play'
        //pause
    };
    c.keyToCmdDraw = {
        'o': [31, 3, 15], // charX, charY, screenCode
        'p': [31, 5, 16]
    };

    c.class = {};
    
    c.class.but = {};
    
    c.class.but.noteDel = 'sp_but_note_del';
    c.class.but.noteInsert = 'sp_but_note_insert';
    
    c.class.input = {};
    
    c.class.input.noteTone = 'sp_inp_note_tone';
    c.class.input.noteLen = 'sp_inp_note_len';

    // ***************************
    // *** "Static" variables: ***
    // ***************************

    v.cmdKeyStates = null; // Store current pressed-state of all command keys
                           // and if pressed-state got changed after last game
                           // loop iteration.

    v.pressed = []; // Used (and set) by f.updatePlayFromKeys().
    v.playing = null; // Set/unset by f.play() and f.stop().
                      // Read by f.updateStatus().

    v.noteplay = null;
    v.keyboard = null; // Handles keys to play notes.
    v.cmdboard = null; // Handles keys used for commands.
    v.chardraw = null;
    v.ele = null;
    v.math = null;
    
    v.status = null;
    v.lastStatusUpdate = null;
    v.lastStatusCall = null;
    
    v.tuneList = null;

    v.mode = 'practice'; // 'practice', 'rec' or 'play'.
    
    // TODO: Add tune maximum length (maybe as parameter for init.)!

    // TODO: Add note/pause maximum length (see PET/CBM)!

    v.tune = [
        [50, 0], // Length in multiples of step and note's index (255 = pause).
        [50, 2], 
        [50, 4], 
        [50, 5], 
        [100, 7],
        [50, 9], 
        [50, 11], 
        [100, 12]
    ];
    v.tuneIndex = -1;
    v.tuneSteps = 0;
    v.tuneNeedsRedraw = true;

    // ******************
    // *** Functions: ***
    // ******************

    f.getNextMode = function()
    {
        // Hard-coded usage of keys 'o' ('rec') and 'p' ('play'):

        var recPressed = v.cmdKeyStates['o'].pressed,
            playPressed = v.cmdKeyStates['p'].pressed;

        if(recPressed && playPressed)
        {
            return v.mode; // Return last mode (ignore both keys at once).
        }

        // At most one key is pressed.

        if(!recPressed && !playPressed)
        {
            return v.mode; // Return last mode (only pressed are interesting).
        }

        // Either record or play key is pressed (only one of them).

        if(v.cmdKeyStates['o'].changed)
        {
            // Record key got pressed since last loop iteration.

            if(v.mode === 'practice')
            {
                return 'rec';
            }
            if(v.mode === 'rec')
            {
                return 'practice';
            }
            return v.mode; // No change, if in play mode.
        }
        if(v.cmdKeyStates['p'].changed)
        {
            // Play key got pressed since last loop iteration.

            if(v.mode === 'practice')
            {
                return 'play';
            }
            if(v.mode === 'play')
            {
                return 'practice';
            }
            return v.mode; // No change, if in record mode.
        }

        // No key state changed since last loop iteration.

        return v.mode;
    };

    /** Play note corresponding to key given.
     */
    f.play = function(key)
    {
        gamupet.noteplay.on(
            c.keyToNotes[key][0], c.keyToNotes[key][1], c.keyToNotes[key][2]);
        
        v.playing = key;
    };

    f.getFirstKeyByNote = function(noteIndex)
    {
        var key = null,
            note = c.notes[noteIndex];

        for(key in c.keyToNotes)
        {
            if(c.keyToNotes[key] === note)
            {
                return key;
            }
        }
        throw 'Error: Key for note with given index not found!';
    };

    f.playByNote = function(noteIndex)
    {
        f.play(f.getFirstKeyByNote(noteIndex));   
    };

    f.stop = function()
    {
        gamupet.noteplay.off();

        v.playing = null;
    };

    f.updateCmd = function()
    {
        var pressedKeys = v.cmdboard.getPressed(null),
            key = null,
            curPressed = false;

        for(key in c.keyToCmd)
        {
            curPressed = pressedKeys.indexOf(key) !== -1;

            // Is current pressed-state different from last pressed state?
            //
            v.cmdKeyStates[key].changed =
                curPressed !== v.cmdKeyStates[key].pressed;

            // Update pressed state from last to current:
            //
            v.cmdKeyStates[key].pressed = curPressed;
        }
    };

    /**
     * - Calls f.play() and f.stop().
     */
    f.updatePlayFromKeys = function()
    {
        var pressed = v.keyboard.getPressed(2 + 1),
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
            timestamp = performance.now(),
            key = null,
            buf = null;

        if(v.lastStatusUpdate !== null
            && timestamp - v.lastStatusUpdate < 100.0)
        {
            v.lastStatusCall = timestamp;
            return;
        }

        buf = timestamp - v.lastStatusCall;
        str += 'Draw: ' + String(buf) + 'ms';
        str += ' ';
        str += String(Math.floor(1000.0 / buf)) + 'Hz';

        str += ' ';
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

        // Show current mode ('practice', 'play' or 'record'):
        //
        str += ' ';
        str += v.mode.toUpperCase();

        // Show all currently pressed command key's commands:
        //
        buf = '';
        for(key in c.keyToCmd)
        {
            if(v.cmdKeyStates[key].pressed)
            {
                if(buf.length > 0)
                {
                    buf += ' ';
                }
                buf += c.keyToCmd[key];
            }
        }
        if(buf.length > 0)
        {
            str += ' ' + buf;
        }

        v.status.textContent = str;
        v.lastStatusUpdate = timestamp;
        v.lastStatusCall = timestamp;
    };

    f.stopPlayMode = function()
    {
        v.tuneList.markNone();

        v.tuneIndex = -1;
        v.tuneSteps = 0;

        f.stop();
    };

    f.tryAddStep = function()
    {
        if(v.tune[v.tuneIndex][0] === c.maxNoteLength)
        {
            return; // Maximum length already reached..
        }
        ++v.tune[v.tuneIndex][0];
    };

    f.stopRecMode = function()
    {
        if(v.tuneIndex !== -1/*v.tune.length > 0*/)
        {
            if(v.tune[v.tuneIndex][1] === c.pause) // A pause.
            {
                v.tune.pop(); // Remove trailing pause (by definition).
            }
            else // A note.
            {
                f.tryAddStep(); // Avoid note length zero.
            }
            v.tuneIndex = -1;

            v.tuneNeedsRedraw = true;
        }
    };
    f.updateInRecMode = function()
    {
        var playingNoteIndex = null;

        f.updatePlayFromKeys();
        //
        // => v.playing holds currently played note's key (or one of them,
        //    some notes can be played with multiple keys).
        //
        // => v.pressed holds currently pressed key/keys.

        playingNoteIndex = v.playing === null
            ? c.pause
            : c.notes.indexOf(c.keyToNotes[v.playing]);

        if(v.tuneIndex === -1)
        {
            // Nothing recorded, yet.

            if(playingNoteIndex === c.pause)
            {
                return; // Still waiting for first note (key press).
                        // Never start with a pause (by definition).
            }

            // Not a pause, but a real note, start recording:

            ++v.tuneIndex;
            v.tune = [[0, playingNoteIndex]];
            return;
        }

        // There is at least one note recorded.

        f.tryAddStep(); // Add a recording (time) step.

        if(v.tune[v.tuneIndex][1] === playingNoteIndex)
        {
            return; // Still the same note playing as in last loop iteration.
        }

        // Another note/pause playing than last loop iteration.

        ++v.tuneIndex;
        v.tune.push([0, playingNoteIndex]);
    };

    f.updateInPlayMode = function()
    {
        if(v.tuneSteps === 0)
        {
            // Current note/pause got played to the end.

            ++v.tuneIndex; // Goes to next note/pause (if existing).
            if(v.tuneIndex === v.tune.length)
            {
                // No other note/pause in tune.

                f.stopPlayMode(); // Stop play (mode).
                v.mode = 'practice'; // Go back to practice mode.
                v.tuneList.setEnabled(true);
                return;
            }

            // Set next note/pause as current note/pause:            

            v.tuneList.markSingle(v.tuneIndex, true);

            v.tuneSteps = v.tune[v.tuneIndex][0];
            
            if(v.tune[v.tuneIndex][1] === c.pause)
            {
                f.stop(); // Just stop playback, because it is a pause.
            }
            else
            {
                // Not a pause, but a note.

                // Start playing the note:
                //
                f.playByNote(v.tune[v.tuneIndex][1]);
            }
        }
        --v.tuneSteps;
    };

    f.updateInPracticeMode = function()
    {
        f.updatePlayFromKeys();
        //
        // => v.playing holds currently played note's key (or one of them,
        //    some notes can be played with multiple keys).
        //
        // => v.pressed holds currently pressed key/keys.
    };

    f.updateMode = function()
    {
        var nextMode = f.getNextMode();

        if(nextMode === v.mode)
        {
            return;
        }
        switch(v.mode)
        {
            case 'practice':
            {
                v.tuneList.setEnabled(false);
                if(nextMode === 'play')
                {
                    break; // Nothing to do, here.
                }
                if(nextMode !== 'rec')
                {
                    throw 'Error: Invalid change from practice mode!';
                }
                break;
            }
            case 'play':
            {
                if(nextMode !== 'practice')
                {
                    throw 'Error: Invalid change from play mode!';
                }
                f.stopPlayMode();
                v.tuneList.setEnabled(true);
                break;
            }
            case 'rec':
            {
                if(nextMode !== 'practice')
                {
                    throw 'Error: Invalid change from record mode!';
                }
                f.stopRecMode();
                v.tuneList.setEnabled(true);
                break;
            }

            default:
            {
                throw 'Error: Invalid mode given!';
            }
        }
        v.mode = nextMode;
    };

    f.update = function()
    {
        f.updateCmd();

        f.updateMode();

        if(v.mode === 'play')
        {
            f.updateInPlayMode();
            return;
        }
        if(v.mode === 'practice')
        {
            f.updateInPracticeMode();
            return;
        }
        if(v.mode === 'rec')
        {
            f.updateInRecMode();
            return;
        }
    };

    f.draw = function()
    {
        var buf = null;

        for(buf in c.keyToNotesDraw)
        {
            v.chardraw.petAt(
                c.keyToNotesDraw[buf][0],
                c.keyToNotesDraw[buf][1],
                true, // Hard-coded
                c.keyToNotesDraw[buf][2]
                    + (buf === v.playing
                        ? 128 // Reverse 
                        : 0));
        }

        // Hard-coded usage of keys 'o' ('rec') and 'p' ('play'):
        //
        v.chardraw.petAt(
            c.keyToCmdDraw['o'][0],
            c.keyToCmdDraw['o'][1],
            true, // Hard-coded
            c.keyToCmdDraw['o'][2]
                + (v.mode === 'rec' 
                    ? 128 // Reverse
                    : 0));
        v.chardraw.petAt(
            c.keyToCmdDraw['p'][0],
            c.keyToCmdDraw['p'][1],
            true, // Hard-coded
            c.keyToCmdDraw['p'][2]
                + (v.mode === 'play' 
                    ? 128 // Reverse
                    : 0));

        f.updateTuneEle();

        f.updateStatus();
    };
    
    f.getNoteDescriptionTone = function(entry)
    {
        var note = entry[1] === c.pause ? ['-', '', '-'] : c.notes[entry[1]],
            retVal = '';

        retVal += note[0];
        retVal += note[1].length === 0 ? '-' : note[1];
        retVal += String(note[2]);

        return retVal;
    };
    f.getNoteDescriptionLen = function(entry)
    {
        return v.math.getHex(entry[0], 4);
    };

    f.tryGetNoteIndex = function(str)
    {
        var arr = [];

        if(typeof str !== 'string')
        {
            return -1;
        }

        arr.push(str.at(0).toUpperCase());

        if(arr[0] === '-')
        {
            return c.pause;
        }

        if(str.length < 2)
        {
            return -1;
        }

        if(str.length > 2)
        {
            arr.push(str.at(1));
            arr.push(parseInt(str.at(2), 10));
        }
        else
        {
            arr.push(parseInt(str.at(1), 10));
        }

        return c.notes.findIndex(
            function(note)
            {
                // TODO: Support flat symbol (b).

                if(note[0] !== arr[0])
                {
                    return false;
                }
                if(note[1] === '')
                {
                    if(arr[1] !== '-')
                    {
                        if(arr.length === 2 && note[2] === arr[1])
                        {
                            return true;
                        }
                        return false;
                    }
                }
                else
                {
                    if(arr.length !== 3)
                    {
                        return false;
                    }
                    if(note[1] !== arr[1])
                    {
                        return false;
                    }
                }
                if(note[2] !== arr[2])
                {
                    return false;
                }
                return true;
            });
    };
    f.tryGetNoteLen = function(str)
    {
        var val = parseInt(str, 16);

        if(isNaN(val))
        {
            return null;
        }
        if(val <= 0)
        {
            return null;
        }
        if(val > c.maxNoteLength)
        {
            return null;
        }
        return val;
    };

    /**
     * - Event listeners directly insert/delete/modify entries.
     */
    f.insertNoteEle = function(entry, i)
    {
        var lineEle = null,
            delButEle = null,
            insertButEle = null,
            toneEle = null,
            lenEle = null,
            lastToneVal = f.getNoteDescriptionTone(entry),
            lastLenVal = f.getNoteDescriptionLen(entry),
            curOrder = 0;

        lineEle = v.ele.create('div', 'row');

        insertButEle = v.ele.createAndInsert(
            'button',
            lineEle,
            curOrder++,
            null,
            {'font-family': 'inherit'},
            c.class.but.noteInsert);
        insertButEle.textContent = '+'; // Hard-coded
        insertButEle.title = 'Insert note.'; // Hard-coded
        insertButEle.tabIndex = -1;
        insertButEle.addEventListener(
            'click',
            function()
            {
                var j = parseInt(lineEle.style.order, 10) + 1;
                //
                // Not necessarily equal to i + 1 anymore.

                v.tune.splice(j, 0, c.defaultNote.slice());

                f.insertNoteEle(v.tune[j], j); // *** "RECURSION" ***
            });

        toneEle = v.ele.createAndInsert(
            'input',
            lineEle,
            curOrder++,
            null,
            {
                'background-color': 'transparent',
                'font-family': 'inherit'
            },
            c.class.input.noteTone);
        toneEle.value = lastToneVal;
        toneEle.type = 'text';
        toneEle.maxLength = 3;
        toneEle.size = 3;
        toneEle.addEventListener(
            'click',
            function()
            {
                toneEle.select();
            });
        toneEle.addEventListener(
            'blur',
            function()
            {
                var noteIndex = f.tryGetNoteIndex(toneEle.value);
                
                if(noteIndex >= 0)
                {
                    entry[1] = noteIndex;
                    lastToneVal = f.getNoteDescriptionTone(entry);
                }
                toneEle.value = lastToneVal;
            });

        lenEle = v.ele.createAndInsert(
            'input',
            lineEle,
            curOrder++,
            null,
            {
                'text-align': 'right',
                'background-color': 'transparent',
                'font-family': 'inherit'
            },
            c.class.input.noteLen);
        lenEle.value = lastLenVal;
        lenEle.type = 'text';
        lenEle.maxLength = 4;
        lenEle.size = 4;
        lenEle.addEventListener(
            'click',
            function()
            {
                lenEle.select();
            });
        lenEle.addEventListener(
            'blur',
            function()
            {
                var noteLen = f.tryGetNoteLen(lenEle.value);
                
                if(noteLen !== null)
                {
                    entry[0] = noteLen;
                    lastLenVal = f.getNoteDescriptionLen(entry);
                }
                lenEle.value = lastLenVal;
            });

        delButEle = v.ele.createAndInsert(
                'button',
                lineEle,
                curOrder++,
                null,
                {'font-family': 'inherit'},
                c.class.but.noteDel);
            delButEle.textContent = '-';
            delButEle.title = 'Delete note.';
            delButEle.tabIndex = -1;
            delButEle.addEventListener(
                'click',
                function()
                {
                    var j = parseInt(lineEle.style.order, 10);
                    //
                    // Not necessarily equal to i anymore.
    
                    v.tune.splice(j, 1);
                    
                    v.tuneList.removeAt(j);
                });

        v.tuneList.insertAt(lineEle, i);
    };
    
    f.updateTuneEle = function()
    {        
        if(!v.tuneNeedsRedraw)
        {
            return;
        }

        v.tuneList.removeAll();
        v.tune.forEach(f.insertNoteEle);

        v.tuneNeedsRedraw = false;
    };
    
    f.init = function(p)
    {
        var buf = null,
            tuneListAddButEle = null;

        v.cmdKeyStates = {};
        for(buf in c.keyToCmd)
        {
            v.cmdKeyStates[buf] = {pressed: false, changed: false};
        }

        v.noteplay = p.noteplay;
        v.keyboard = p.keyboard.create({whitelist: Object.keys(c.keyToNotes)});
        v.cmdboard = p.keyboard.create({whitelist: Object.keys(c.keyToCmd)});
        v.chardraw = p.chardraw;
        v.math = p.math;
        v.ele = p.ele;

        v.status = p.status;
        
        v.tuneList = p.tuneList;
        tuneListAddButEle = gamupet.ele.create('button');
        tuneListAddButEle.textContent = '+'; // Hard-coded
        tuneListAddButEle.title = 'Insert note.'; // Hard-coded
        tuneListAddButEle.tabIndex = -1;
        tuneListAddButEle.addEventListener(
            'click',
            function()
            {
                v.tune.push(c.defaultNote.slice());

                f.insertNoteEle(v.tune[v.tune.length - 1], v.tune.length - 1);
            });
        v.tuneList.appendToTopRow(tuneListAddButEle);
        
        v.noteplay.init(
            {
                octaveCount: 8,
                freqplay: p.freqplay
            });
    };

    o.init = f.init;
    o.update = f.update;
    o.draw = f.draw;

    gamupet.soundpet = o;
}());
