0.5 => dac.gain;

SinOsc osc => dac;

global float freq;
220.0 => freq;

while (true)
{
	freq => osc.freq;
	1::ms => now;
}
