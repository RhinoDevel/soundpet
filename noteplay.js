
// (c) Marcel Timm, RhinoDevel, 2021

/** To be run during page load to augment global gamupet object with new
 *  property called noteplay.
 */
(function() // IIFE
{
    'use strict';

    var f = {}, v = {}, o = {}, c = {};

    c.f0 = 440.0; // Hz (A4).

    v.octaveCount = -1;
    v.frequencies = null;
    v.freqplay = null;

    /**
     *  n: Half-steps/semitones away from frequency zero (A4).
     */
    f.getFn = function(n)
    {
        return c.f0 * Math.pow(2.0, n / 12.0); // Using equal-tempered scale.
    };

    /**
     *  | 0| 2| 4| 5| 7| 9|11|
     *  |C |D |E |F |G |A |B |
     */
    f.getNoteIndex = function(note)
    {
        switch(note)
        {
            case 'C': return 0;
            case 'D': return 2;
            case 'E': return 4;
            case 'F': return 5;
            case 'G': return 7;
            case 'A': return 9;
            case 'B': return 11;
            
            default: throw 'Error: Invalid note value given!';
        }
    };

    /** 
     *  | 0| 1| 2| 3| 4| 5| 6| 7| 8| 9|10|11|
     *  |--|--|--|--|--|--|--|--|--|--|--|--|
     *  |C |C#|D |D#|E |F |F#|G |G#|A |A#|B |
     *  |B#|Db|  |Eb|Fb|E#|Gb|  |Ab|  |Bb|Cb|
     * 
     */
    f.getNoteModIndex = function(note, mod)
    {
        var noteIndex = f.getNoteIndex(note);

        switch(mod)
        {
            case '': return noteIndex;
            case 'b': return (noteIndex - 1 + 12) % 12;
            case '#': return (noteIndex + 1) % 12;

            default: throw 'Error: Invalid modificator value given!';
        }
    };

    f.getOctaveIndex = function(octave)
    {
        if(octave < 0 || octave >= v.octaveCount)
        {
            throw 'Error: Invalid octave value given!';
        }
        return octave - 1;
    };

    /**
     *  note:   'C', 'D', 'E', 'F', 'G', 'A' or 'B'.
     *  mod:    '', '#' or 'b'.
     *  octave: 
     */
    f.getFreq = function(note, mod, octave)
    {
        var octaveIndex = f.getOctaveIndex(octave),
            noteModIndex = f.getNoteModIndex(note, mod);

        return v.frequencies[octaveIndex][noteModIndex];
    };

    f.on = function(note, mod, octave)
    {
        v.freqplay.on(f.getFreq(note, mod, octave));
    };
    f.off = function()
    {
        v.freqplay.off();
    };

    f.init = function(p)
    {
        var i = -1, j = -1, octaveOffset = -1,
            f0NoteModIndex = -1;

        if(p.octaveCount < 4) // TODO: Start with octave 4!
        {
            throw 'Error: Octave count must be at least four!';
        }

        f0NoteModIndex = f.getNoteModIndex('A', ''); // => 9.

        v.octaveCount = p.octaveCount;
        v.freqplay = p.freqplay;

        v.frequencies = [];
        for(i = 0;i < p.octaveCount;++i)
        {
            v.frequencies.push([])

            octaveOffset = 12 * (i - (4 - 1)); // 4 = Octave of frequency zero.

            for(j = 0;j < 12;++j)
            {
                v.frequencies[i][j] = 
                    f.getFn(octaveOffset + j - f0NoteModIndex);
            }
        }
    };

    o.on = f.on;
    o.off = f.off;
    o.init = f.init;

    gamupet.noteplay = o;
}());
