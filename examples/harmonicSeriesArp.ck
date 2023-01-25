// Harmonic Series Arpeggiator
// Written by Terry Feng
// CHANGE ME! ADD MULTIPLE SHREDS!
220 => float baseFrequency; // starting frequency
12 => int numHarmonics; // number of harmonics to play
125::ms => dur noteDur; // note duration

// Unit Generator
SinOsc osc => dac;
osc.gain(0.5);

while (true) 
{
    // Loop through the number of harmonics
    for (0 => int i; i < numHarmonics; i++)
    {
        // Update the oscillator frequency to the next harmonic
        baseFrequency + (i * baseFrequency)  => osc.freq; 
        // Advance time to play the note
        noteDur => now;
    }
}