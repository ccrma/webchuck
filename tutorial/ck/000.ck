0.5 => dac.gain;

SinOsc osc => dac;

220 => osc.freq;

while (true)
{
	1::ms => now;
}
