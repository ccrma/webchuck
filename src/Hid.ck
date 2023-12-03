global Event _msg;

global Event _hid;
global int _hidMultiple;
global int _cursorX;
global int _cursorY;

global float _deltaX;
global float _deltaY;

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

public class Hid extends Event{

    0 => int isMouseOpen;
    0 => int isKBDOpen;
    0 => int active;

    string deviceName; 

    function string name(){
        return deviceName;
    }

    // just a way to stop the interface for now
    function int openMouse(int num){
        if(num == -1){
            false => active;
        } else {
            "virtualJS mouse/trackpad" => deviceName;
            true => active;
        }
        active => isMouseOpen => _mouseActive;;
        return active;
    }

    function int openKeyboard(int num){
        if(num == -1){
            false => active => _kbdActive;
        } else {
            "virtualJS keyboard" => deviceName;
            true => active ;
        }
        active => isKBDOpen => _kbdActive;
        return active;
    }

    // Global event gets hacked by local object
    function void _hackEvent(){
        while(true){
            _hid => now;
            this.broadcast();
        }
    }
    spork~_hackEvent();

    //The argument here is just to execute older code
    function int recv(HidMsg msg){
        _msg => now;
        return 1;
    }
}