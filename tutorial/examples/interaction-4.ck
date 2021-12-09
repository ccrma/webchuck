global Event playNote;

SawOsc osc => LPF filter => ADSR env => dac;
env.set(2::ms, 500::ms, 0.0, 0::ms);
SinOsc filterMod => blackhole;
3.5 => filterMod.freq;

function void filterModProcess() {
    while (true) {
        300 + filterMod.last() * 150 => filter.freq;
        1::samp => now;
    }
}

spork ~ filterModProcess(); 

while (true) {
    playNote => now;
    0 => filterMod.phase;
    env.keyOn();
}