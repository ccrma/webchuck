const AccelMsg_ck = `
public class AccelMsg {
    float accelX;
    float accelY;
    float accelZ;

    function float getAccelX() {
        return accelX;
    }

    function float getAccelY() {
        return accelY;
    }

    function float getAccelZ() {
        return accelZ;
    }

    function void _copy(AccelMsg localMsg) {
        localMsg.accelX => accelX;
        localMsg.accelY => accelY;
        localMsg.accelZ => accelZ;
    }
}
`;
const Accel_ck = `
global Event _accelReading;
global int _accelActive;

global float _accelX;
global float _accelY;
global float _accelZ;

public class Accel extends Event {

    0 => int isAccelOpen;
    0 => int active;

    string deviceName; 

    // AccelMsg Queue
    AccelMsg _accelMsgQueue[0];

    function string name() {
        return deviceName;
    }

    function int openAccel(int num) {
        if (num < 0) {
            false => active;
        } else {
            "js DeviceMotionEvent" => deviceName;
            true => active;
        }
        active => isAccelOpen => _accelActive;
        spork ~ _accelListener();
        return active;
    }


    // Pop the first AccelMsg from the queue
    // Write it to msg and return 1
    function int recv(AccelMsg msg) {
        // is empty
        if (_accelMsgQueue.size() <= 0) {
            return 0;
        }

        // pop the first AccelMsg to msg, return true
        _accelMsgQueue[0] @=> AccelMsg localMsg;
        msg._copy(localMsg);    
        _accelMsgQueue.popFront();
        return 1;
    }

    // Accel Listener
    // Get variables from JS and write to the AccelMsg 
    function void _accelListener() {
        AccelMsg @ msg;
        while(true){
            new AccelMsg @=> msg;
            _accelReading => now;

            _accelX => msg.accelX;
            _accelY => msg.accelY;
            _accelZ => msg.accelZ;

            _accelMsgQueue << msg;
            this.broadcast();
        }
    }
}
`;
export { AccelMsg_ck, Accel_ck };
