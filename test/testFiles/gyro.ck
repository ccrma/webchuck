//-----------------------------------------------------------------------------
// name: gyro.ck
// desc: interface with "deviceorientation" JS events (on web, on mobile) and read x, y, z values
//
// author: Mike Mulshine 
//-----------------------------------------------------------------------------

Gyro gy;
GyroMsg msg;

0 => int device;

// open gyro 
if( !gy.openGyro( device ) ) me.exit();
<<< "gyro '" + gy.name() + "' ready", "" >>>;

// infinite event loop
while( now < end )
{
    // wait on gyro event

    <<< "only on mobile" >>>;

    gy => now;

    // get one or more messages
    while( gy.recv( msg ) )
    {
        // print gyro values
        <<< msg.getGyroX() + " " + msg.getGyroY() + " " + msg.getGyroZ() >>>;
    }
}

