global float scale; 

SinOsc car => dac;

SinOsc mod => blackhole; 
Math.PI / 4.0 => mod.phase;
0.25 => mod.freq; 

0.5 => dac.gain;

while (true) {
    
    (mod.last() + 1.0) * 0.5 => scale;
    scale * 800 + 200 => car.freq;
    
    1::samp => now;
}
