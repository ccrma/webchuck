//-----------------------------------------------------------------------------
// name: gyro.ck
// desc: initialize Gyroscope (on web, on mobile) and read x, y, z values
//
// author: Mike Mulshine 
//-----------------------------------------------------------------------------


Gyro gy;
GyroMsg msg;

SinOsc osc => dac;
0.1 => osc.gain;

0 => int device;

// open gyro 
if( !gy.openGyro( device ) ) me.exit();
<<< "gyro '" + gy.name() + "' ready", "" >>>;

// infinite event loop
while( true )
{
    // wait on gyro event
    gy => now;

    // get one or more messages
    while( gy.recv( msg ) )
    {
        // check for action type
        ///<<<"yo">>>;
        <<< msg.getGyroX() + " " + msg.getGyroY() + " " + msg.getGyroZ() >>>;
        (msg.getGyroY() / 360.0) * 1000.0 + 100.0 => osc.freq;

    }
}

