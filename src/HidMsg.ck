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