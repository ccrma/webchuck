//-----------------------------------------------------------------------------
// name: accel.ck
// desc: interface with "deviceorientation" JS events (on web, on mobile) and read x, y, z values
//
// author: Mike Mulshine 
//-----------------------------------------------------------------------------

Accel ac;
AccelMsg msg;

0 => int device;

// open accel 
if( !ac.openAccel( device ) ) me.exit();
<<< "accel '" + ac.name() + "' ready", "" >>>;

<<< "only on mobile" >>>;

// infinite event loop
while( true )
{
    // wait on accel event
    ac => now;

    // get one or more messages
    while( ac.recv( msg ) )
    {
        // print accel values
        <<< msg.getAccelX() + " " + msg.getAccelY() + " " + msg.getAccelZ() >>>;
    }
}

