declare const HidMsg_ck = "\npublic class HidMsg {\n    int type;\n    int deviceType;\n    int cursorX;\n    int cursorY;\n    float deltaX;\n    float deltaY;\n    float scaledCursorX;\n    float scaledCursorY;\n    int which;\n    int ascii;\n    string key;\n\n    // type 1 message\n    function int isButtonDown() {\n        return type == 1;\n    }\n\n    // type 2 message\n    function int isButtonUp() {\n        return type == 2;\n    }\n\n    // type 5 message\n    function int isMouseMotion(){\n        return type == 5;\n    }\n\n    // type 6 message\n    function int isWheelMotion(){\n        return type == 6;\n    }\n\n    function void _copy(HidMsg localMsg) {\n        localMsg.type => type;\n        localMsg.deviceType => deviceType;\n        localMsg.cursorX => cursorX;\n        localMsg.cursorY => cursorY;\n        localMsg.deltaX => deltaX;\n        localMsg.deltaY => deltaY;\n        localMsg.scaledCursorX => scaledCursorX;\n        localMsg.scaledCursorY => scaledCursorY;\n        localMsg.which => which;\n        localMsg.ascii => ascii;\n        localMsg.key => key;\n    }\n}\n";
declare const Hid_ck = "\nglobal Event _hid;\nglobal int _type;\nglobal int _mouseActive;\nglobal int _kbdActive;\n\nglobal int _cursorX;\nglobal int _cursorY;\nglobal float _deltaX;\nglobal float _deltaY;\nglobal float _scaledCursorX;\nglobal float _scaledCursorY;\n\nglobal int _ascii;\nglobal int _which;\nglobal string _key;\n\npublic class Hid extends Event {\n\n    0 => int isMouseOpen;\n    0 => int isKBDOpen;\n    0 => int active;\n\n    string deviceName; \n    int deviceType; // mouse = 2, keyboard = 3\n\n    // HidMsg Queue\n    HidMsg _hidMsgQueue[0];\n\n    function string name() {\n        return deviceName;\n    }\n\n    function int openMouse(int num) {\n        if (num < 0) {\n            false => active;\n        } else {\n            \"virtualJS mouse/trackpad\" => deviceName;\n            2 => deviceType;\n            true => active;\n        }\n        active => isMouseOpen => _mouseActive;\n        return active;\n    }\n\n    function int openKeyboard(int num) {\n        if (num < 0) {\n            false => active;\n        } else {\n            \"virtualJS keyboard\" => deviceName;\n            3 => deviceType;\n            true => active;\n        }\n        active => isKBDOpen => _kbdActive;\n        return active;\n    }\n\n    // Pop the first HidMsg from the queue\n    // Write it to msg and return 1\n    function int recv(HidMsg msg) {\n        // is empty\n        if (_hidMsgQueue.size() <= 0) {\n            return 0;\n        }\n\n        // pop the first HidMsg to msg, return true\n        _hidMsgQueue[0] @=> HidMsg localMsg;\n        msg._copy(localMsg);    \n        _hidMsgQueue.popFront();\n        return 1;\n    }\n\n    // Hid Listener\n    // Get variables from JS and write to the HidMsg \n    function void _HidListener() {\n        HidMsg @ msg;\n        while(true){\n            new HidMsg @=> msg;\n            deviceType => msg.deviceType;\n            _hid => now;\n\n            _type => msg.type;\n            _cursorX => msg.cursorX;\n            _cursorY => msg.cursorY;\n            _deltaX => msg.deltaX;\n            _deltaY => msg.deltaY;\n            _scaledCursorX => msg.scaledCursorX;\n            _scaledCursorY => msg.scaledCursorY;\n            _which => msg.which;\n            _ascii => msg.ascii;\n            _key => msg.key;\n\n            _hidMsgQueue << msg;\n            this.broadcast();\n\n            // Clear message type\n            0 => _type;\n        }\n    }\n    spork ~ _HidListener();\n}\n";
export { HidMsg_ck, Hid_ck };