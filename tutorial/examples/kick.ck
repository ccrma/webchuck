// Pseudo 808 kick synthesis
SinOsc osc => ADSR oscEnv => Gain output; 
Noise noise => BPF noiseFilter => ADSR noiseEnv => output;
Envelope freqEnv => blackhole;

400 => noiseFilter.freq;
15 => noiseFilter.Q;

oscEnv.set(1::ms, 400::ms, 0.0, 0::ms);
noiseEnv.set(1::ms, 50::ms, 0.0, 0::ms);

output => dac;

// Play kick
150 => float startFreq;
1::ms => dur riseTime;

55 => float endFreq;
100::ms => dur dropTime;

function void kick() {
    oscEnv.keyOn();
    noiseEnv.keyOn();
    
    Math.random2(350, 450) => noiseFilter.freq;
    Math.random2(10, 15) => noiseFilter.Q;
    
    startFreq => freqEnv.target;
    riseTime => freqEnv.duration;
    riseTime => now;
    
    endFreq => freqEnv.target;
    dropTime => freqEnv.duration;
    dropTime => now;
}

// Background shred to frequency modulate kick osc
function void processEnvelopes() {
    while (true) {
        freqEnv.value() => osc.freq;
        1::samp => now;
    }
}

spork ~ processEnvelopes();

130 => int bpm;
60.0 / bpm => float step;
while (true) {
    spork ~ kick();
    step::second => now;
}









