global Event _msg;

global Event _hid;
global int _hidMultiple;
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
        if (num <= 0) {
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
        if (num <= 0) {
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
        _hidMsgQueue[0] @=> msg;
        _hidMsgQueue.erase(0); // TODO: update this to popFront();
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