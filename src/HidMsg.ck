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
    int cursorX;
    int cursorY;
    float deltaX;
    float deltaY;
    string key;
    int ascii;
    int which;
    float scaledCursorX;
    float scaledCursorY;

    function int isButtonDown() {
        if(_mouseActive){
            if(_isMouseDown){
                0 => _isMouseDown;
                return 1;
            }
        }
        if(_kbdActive){
            if(_isDown){
                0 => _isDown;
                return 1;
            }
        }
        return 0;
    }

    function int isButtonUp() {
        if(_mouseActive){
            if(_isMouseUp){
                0 => _isMouseUp;
                return 1;
            }
        }
        if(_kbdActive){
            if(_isUp){
                0 => _isUp;
                return 1;
            }
        }
        return 0;
    }

    function int isMouseMotion(){
        return _mouseMotion;
    }

    function int isWheelMotion(){
        return _isScroll;
    }

    function void _set(){
        while(true){
            _hid => now;
            _cursorX => cursorX;
            _cursorY => cursorY;
            _key => key;
            _ascii => ascii;
            _which => which;
            _deltaX => deltaX;
            _deltaY => deltaY;
            _scaledCursorX => scaledCursorX;
            _scaledCursorY => scaledCursorY;
        }
    }
    spork~_set();
}