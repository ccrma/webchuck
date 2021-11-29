SndBuf buf => dac;
me.sourceDir() + "my-audio.wav" => buf.read;
0 => buf.pos;
1 => buf.rate;
buf.length() / buf.rate() => now;

