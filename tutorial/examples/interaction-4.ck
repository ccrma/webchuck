global Event step;

SinOsc osc => ADSR env => dac;
0.5 => dac.gain;

220 => osc.freq;
env.set(3::ms, 250::ms, 0.0, 0::ms);

while (true) {
    env.keyOn();
    step.broadcast();
    300::ms => now;
}
