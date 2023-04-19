SinOsc osc => ADSR adsr => dac;
adsr.set(10::ms, 400::ms, 0.0, 3::ms);

48.0 => global float fund;

[0.0, 4.0, 7.0, 11.0, 14.0] @=> global float notes[];

500 => global int period;

0 => int which;
while (true) {
    Std.mtof(fund+notes[which++]) => osc.freq;
    if (which >= notes.size()) 0 => which;
    
    adsr.keyOn();
    period::ms => now;
}