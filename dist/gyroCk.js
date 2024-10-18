const GyroMsg_ck = `
public class GyroMsg {
    float gyroX;
    float gyroY;
    float gyroZ;

    function float getGyroX() {
        return gyroX;
    }

    function float getGyroY() {
        return gyroY;
    }

    function float getGyroZ() {
        return gyroZ;
    }

    function void _copy(GyroMsg localMsg) {
        localMsg.gyroX => gyroX;
        localMsg.gyroY => gyroY;
        localMsg.gyroZ => gyroZ;
    }
}
`;
const Gyro_ck = `
global Event _gyroReading;
global int _gyroActive;

global float _gyroX;
global float _gyroY;
global float _gyroZ;

public class Gyro extends Event {

    0 => int isGyroOpen;
    0 => int active;

    string deviceName; 

    // GyroMsg Queue
    GyroMsg _gyroMsgQueue[0];

    function string name() {
        return deviceName;
    }

    function int openGyro(int num) {
        if (num < 0) {
            false => active;
        } else {
            "js DeviceOrientationEvent" => deviceName;
            true => active;
        }
        active => isGyroOpen => _gyroActive;
        spork ~ _gyroListener();
        return active;
    }


    // Pop the first GyroMsg from the queue
    // Write it to msg and return 1
    function int recv(GyroMsg msg) {
        // is empty
        if (_gyroMsgQueue.size() <= 0) {
            return 0;
        }

        // pop the first GyroMsg to msg, return true
        _gyroMsgQueue[0] @=> GyroMsg localMsg;
        msg._copy(localMsg);    
        _gyroMsgQueue.popFront();
        return 1;
    }

    // Gyro Listener
    // Get variables from JS and write to the GyroMsg 
    function void _gyroListener() {
        GyroMsg @ msg;
        while(true){
            new GyroMsg @=> msg;
            _gyroReading => now;

            _gyroX => msg.gyroX;
            _gyroY => msg.gyroY;
            _gyroZ => msg.gyroZ;

            _gyroMsgQueue << msg;
            this.broadcast();
        }
    }
}
`;
export { GyroMsg_ck, Gyro_ck };
