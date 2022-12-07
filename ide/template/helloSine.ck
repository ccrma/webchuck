/* Play a sine wave at 440Hz for 1 week */
SinOsc osc => dac;
440 => osc.freq;
1::week => now;