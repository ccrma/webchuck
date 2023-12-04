const HidMsg_ck = `
global Event _msg;
            
global Event _hid;
global int _hidMultiple;
0 => global int _cursorX;
0 => global int _cursorY;

0 => global float _deltaX;
0 => global float _deltaY;

global string _key;
global int _isDown;
global int _isUp;
global int _isMouseDown;
global int _isMouseUp;
global int _isScroll;
global int _ascii;
global int _which;
global int _mouseActive;
global int _kbdActive;
global int _mouseMotion;
global float _scaledCursorX;
global float _scaledCursorY;

public class HidMsg {
    int type;
    int deviceType;
    int cursorX;
    int cursorY;
    float deltaX;
    float deltaY;
    float scaledCursorX;
    float scaledCursorY;
    int which;
    int ascii;
    string key;

    // type 1 message
    function int isButtonDown() {
        if (type == 1) { return 1; }
        return 0;
    }

    // type 2 message
    function int isButtonUp() {
        if (type == 2) { return 1; }
        return 0;
    }

    // type 5 message
    function int isMouseMotion(){
        if (type == 5) { return 1; }
        return 0;
    }

    // type 6 message
    function int isWheelMotion(){
        if (type == 6) { return 1; }
        return 0;
    }

    function void _copy(HidMsg localMsg) {
        localMsg.type => type;
        localMsg.deviceType => deviceType;
        localMsg.cursorX => cursorX;
        localMsg.cursorY => cursorY;
        localMsg.deltaX => deltaX;
        localMsg.deltaY => deltaY;
        localMsg.scaledCursorX => scaledCursorX;
        localMsg.scaledCursorY => scaledCursorY;
        localMsg.which => which;
        localMsg.ascii => ascii;
        localMsg.key => key;
    }
}
`;

const Hid_ck = `
global Event _msg;

global Event _hid;
global int _cursorX;
global int _cursorY;

global float _deltaX;
global float _deltaY;

global int _type;
global string _key;
global int _isDown;
global int _isUp;
global int _isMouseDown;
global int _isMouseUp;
global int _isScroll;
global int _ascii;
global int _which;
global int _mouseActive;
global int _kbdActive;
global int _mouseMotion;
global float _scaledCursorX;
global float _scaledCursorY;

public class Hid extends Event {

    0 => int isMouseOpen;
    0 => int isKBDOpen;
    0 => int active;

    string deviceName; 
    int deviceType; // mouse = 2, keyboard = 3

    // HidMsg Queue
    HidMsg _hidMsgQueue[0];

    function string name() {
        return deviceName;
    }

    function int openMouse(int num) {
        if (num < 0) {
            false => active;
        } else {
            "virtualJS mouse/trackpad" => deviceName;
            2 => deviceType;
            true => active;
        }
        active => isMouseOpen => _mouseActive;
        return active;
    }

    function int openKeyboard(int num) {
        if (num < 0) {
            false => active;
        } else {
            "virtualJS keyboard" => deviceName;
            3 => deviceType;
            true => active;
        }
        active => isKBDOpen => _kbdActive;
        return active;
    }

    // Pop the first HidMsg from the queue
    // Write it to msg and return 1
    function int recv(HidMsg msg) {
        // is empty
        if (_hidMsgQueue.size() <= 0) {
            return 0;
        }

        // pop the first HidMsg to msg, return true
        _hidMsgQueue[0] @=> HidMsg localMsg;
        msg._copy(localMsg);    
        _hidMsgQueue.popFront();
        return 1;
    }

    // Hid Listener
    // Get variables from JS and write to the HidMsg 
    function void _HidListener() {
        HidMsg @ msg;
        while(true){
            new HidMsg @=> msg;
            deviceType => msg.deviceType;
            _hid => now;

            _type => msg.type;
            _cursorX => msg.cursorX;
            _cursorY => msg.cursorY;
            _deltaX => msg.deltaX;
            _deltaY => msg.deltaY;
            _scaledCursorX => msg.scaledCursorX;
            _scaledCursorY => msg.scaledCursorY;
            _which => msg.which;
            _ascii => msg.ascii;
            _key => msg.key;

            _hidMsgQueue << msg;
            this.broadcast();
        }
    }
    spork ~ _HidListener();
}
`;

export { HidMsg_ck, Hid_ck };
