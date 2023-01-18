// Play and loop 'were slammin' by takeo
// Use the SndBuf2 class for playing WAV files in stereo
SndBuf2 buf => dac;
buf.read("./were_slammin.wav"); // Read in our WAV file
1 => buf.loop; // Set our track to loop

<<< "Looping this slammin beat for 1 week" >>>;
1::week => now;