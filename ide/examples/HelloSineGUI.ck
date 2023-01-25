/* Play a sine wave at 440Hz forever and control the frecuency with the GUI */

/*
1. Go to Edit/Generate GUI

2. Start WebChucK

3. Add the code to the VM using the green play button

4. Go to View/GUI and play with the slider

*/

SinOsc osc => dac;

0 => global float f;

while(samp => now){
    (f * 440)+220 => osc.freq;
}
