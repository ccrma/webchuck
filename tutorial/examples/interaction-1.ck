SinOsc osc => dac;
220.0 => global float freq;

while (true) {
    freq => osc.freq;
    1::ms => now;
}