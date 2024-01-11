const HidMsg_ck = `
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
        return type == 1;
    }

    // type 2 message
    function int isButtonUp() {
        return type == 2;
    }

    // type 5 message
    function int isMouseMotion(){
        return type == 5;
    }

    // type 6 message
    function int isWheelMotion(){
        return type == 6;
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
global Event _kbHid;
global Event _mouseHid;
global int _type;
global int _mouseActive;
global int _kbdActive;

global int _cursorX;
global int _cursorY;
global float _deltaX;
global float _deltaY;
global float _scaledCursorX;
global float _scaledCursorY;

global int _ascii;
global int _which;
global string _key;

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
        spork ~ _mouseListener();
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
        spork ~ _keyboardListener();
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

    // Keyboard Hid Listener
    // Get variables from JS and write to the HidMsg 
    function void _keyboardListener() {
        HidMsg @ msg;
        while(true){
            new HidMsg @=> msg;
            deviceType => msg.deviceType;
            _kbHid => now;

            _type => msg.type;
            _which => msg.which;
            _ascii => msg.ascii;
            _key => msg.key;

            _hidMsgQueue << msg;
            this.broadcast();
        }
    }

    // Mouse Hid Listener
    // Get variables from JS and write to the HidMsg 
    function void _mouseListener() {
        HidMsg @ msg;
        while(true){
            new HidMsg @=> msg;
            deviceType => msg.deviceType;
            _mouseHid => now;

            _type => msg.type;
            _cursorX => msg.cursorX;
            _cursorY => msg.cursorY;
            _deltaX => msg.deltaX;
            _deltaY => msg.deltaY;
            _scaledCursorX => msg.scaledCursorX;
            _scaledCursorY => msg.scaledCursorY;
            _which => msg.which;

            _hidMsgQueue << msg;
            this.broadcast();
        }
    }
}
`;
export { HidMsg_ck, Hid_ck };
