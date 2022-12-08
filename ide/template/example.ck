// Harmonic Series Arpeggiator
// Written by Terry Feng
12 => int numHarmonics; // number of harmonics to traverse
125::ms => dur noteDur; // note duration

// Unit Generator
SinOsc osc => dac;
220 => int baseFrequency;

while (true) 
{
    // Loop through the number of Harmonics
    for (0 => int i; i < numHarmonics; i++)
    {
        // Compute the next harmonic
        baseFrequency + (i * baseFrequency)  => osc.freq; 
        // Advance time to play the note
        noteDur => now;
    }
}