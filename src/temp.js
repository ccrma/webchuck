/** All code copied straight from https://cdn.jsdelivr.net/npm/webchuck/+esm */
class e {
    constructor() {
        this.resolve = void 0,
        this.reject = void 0,
        this.promise = new Promise(( (e, t) => {
            this.resolve = e,
            this.reject = t
        }
        ))
    }
    async value() {
        return await this.promise
    }
}
function t(e, t, s) {
    !function(e, t, s) {
        const n = new XMLHttpRequest;
        n.open("GET", e, !0),
        n.responseType = "arraybuffer",
        n.onload = () => {
            200 == n.status || 0 == n.status && n.response ? t(n.response) : s()
        }
        ,
        n.onerror = s,
        n.send(null)
    }(e, (e => {
        t(new Uint8Array(e))
    }
    ), ( () => {
        if (!s)
            throw new Error(`Loading data file ${e} failed.`);
        s()
    }
    ))
}

function wasmimporttest (link, tresolve, rejection)
{
    import(link).then((res) =>
    {
        return atob(res.default);
    }, (err) =>
    {
        console.log("test");
        if (!rejection) throw new Error(`loading wasm ${link} failed.`);
        rejection();// ?
    }).then((res) =>
    {
        tresolve(new Uint8Array(res));
    }, (err) =>
    {
        console.log("error");
    });
}

const s = ["ck", "txt", "csv", "json", "xml", "html", "js"];
const n = () => new e;
var a, i;
!function(e) {
    e.CREATE_FILE = "createFile",
    e.RUN_CODE = "runChuckCode",
    e.RUN_CODE_WITH_REPLACEMENT_DAC = "runChuckCodeWithReplacementDac",
    e.REPLACE_CODE = "replaceChuckCode",
    e.REPLACE_CODE_WITH_REPLACEMENT_DAC = "replaceChuckCodeWithReplacementDac",
    e.REMOVE_LAST_CODE = "removeLastCode",
    e.RUN_FILE = "runChuckFile",
    e.RUN_FILE_WITH_REPLACEMENT_DAC = "runChuckFileWithReplacementDac",
    e.RUN_FILE_WITH_ARGS = "runChuckFileWithArgs",
    e.REPLACE_FILE = "replaceChuckFile",
    e.REPLACE_FILE_WITH_REPLACEMENT_DAC = "replaceChuckFileWithReplacementDac",
    e.REPLACE_FILE_WITH_ARGS = "replaceChuckFileWithArgs",
    e.REMOVE_SHRED = "removeShred",
    e.IS_SHRED_ACTIVE = "isShredActive",
    e.SIGNAL_EVENT = "signalChuckEvent",
    e.BROADCAST_EVENT = "broadcastChuckEvent",
    e.LISTEN_FOR_EVENT_ONCE = "listenForChuckEventOnce",
    e.START_LISTENING_FOR_EVENT = "startListeningForChuckEvent",
    e.STOP_LISTENING_FOR_EVENT = "stopListeningForChuckEvent",
    e.SET_INT = "setChuckInt",
    e.GET_INT = "getChuckInt",
    e.SET_FLOAT = "setChuckFloat",
    e.GET_FLOAT = "getChuckFloat",
    e.SET_STRING = "setChuckString",
    e.GET_STRING = "getChuckString",
    e.SET_INT_ARRAY = "setGlobalIntArray",
    e.GET_INT_ARRAY = "getGlobalIntArray",
    e.SET_INT_ARRAY_VALUE = "setGlobalIntArrayValue",
    e.GET_INT_ARRAY_VALUE = "getGlobalIntArrayValue",
    e.SET_ASSOCIATIVE_INT_ARRAY_VALUE = "setGlobalAssociativeIntArrayValue",
    e.GET_ASSOCIATIVE_INT_ARRAY_VALUE = "getGlobalAssociativeIntArrayValue",
    e.SET_FLOAT_ARRAY = "setGlobalFloatArray",
    e.GET_FLOAT_ARRAY = "getGlobalFloatArray",
    e.SET_FLOAT_ARRAY_VALUE = "setGlobalFloatArrayValue",
    e.GET_FLOAT_ARRAY_VALUE = "getGlobalFloatArrayValue",
    e.SET_ASSOCIATIVE_FLOAT_ARRAY_VALUE = "setGlobalAssociativeFloatArrayValue",
    e.GET_ASSOCIATIVE_FLOAT_ARRAY_VALUE = "getGlobalAssociativeFloatArrayValue",
    e.SET_PARAM_INT = "setParamInt",
    e.GET_PARAM_INT = "getParamInt",
    e.SET_PARAM_FLOAT = "setParamFloat",
    e.GET_PARAM_FLOAT = "getParamFloat",
    e.SET_PARAM_STRING = "setParamString",
    e.GET_PARAM_STRING = "getParamString",
    e.GET_CHUCK_NOW = "getChuckNow",
    e.CLEAR_INSTANCE = "clearChuckInstance",
    e.CLEAR_GLOBALS = "clearGlobals"
}(a || (a = {})),
function(e) {
    e.INIT_DONE = "initCallback",
    e.PRINT = "console print",
    e.EVENT = "eventCallback",
    e.INT = "intCallback",
    e.FLOAT = "floatCallback",
    e.STRING = "stringCallback",
    e.INT_ARRAY = "intArrayCallback",
    e.FLOAT_ARRAY = "floatArrayCallback",
    e.NEW_SHRED = "newShredCallback",
    e.REPLACED_SHRED = "replacedShredCallback",
    e.REMOVED_SHRED = "removedShredCallback"
}(i || (i = {}));
class r extends window.AudioWorkletNode {
    constructor(e, t, s, a=2) {
        super(t, "chuck-node", {
            numberOfInputs: 1,
            numberOfOutputs: 1,
            outputChannelCount: [a],
            processorOptions: {
                chuckID: r.chuckID,
                srate: t.sampleRate,
                preloadedFiles: e,
                wasm: s
            }
        }),
        this.deferredPromises = {},
        this.deferredPromiseCounter = 0,
        this.eventCallbacks = {},
        this.eventCallbackCounter = 0,
        this.isReady = n(),
        this.chugins = [],
        this.port.onmessage = this.receiveMessage.bind(this),
        this.onprocessorerror = e => console.error(e),
        r.chuckID++
    }
    static async init(e, s, n=2, a="https://chuck.stanford.edu/webchuck/src/") {
        const i = await async function(e) {
            return await new Promise(( (s, n) => {
                wasmimporttest("./webchuck_wasm_b64.js", s, n);
            }
            ))
        }(a);
        let o = !1;
        void 0 === s && (s = new AudioContext,
        o = !0),
        await s.audioWorklet.addModule(a + "webchuck.js"),
        e = e.concat(r.chuginsToLoad);
        const l = await async function(e) {
            const s = e.map((e => new Promise(( (s, n) => {
                t(e.serverFilename, (t => {
                    s({
                        filename: e.virtualFilename,
                        data: t
                    })
                }
                ), ( () => {
                    console.error(`Error fetching file: ${e.serverFilename}`)
                }
                ))
            }
            ))));
            return await Promise.all(s)
        }(e)
          , c = new r(l,s,i,n);
        return c.chugins = r.chuginsToLoad.map((e => e.virtualFilename.split("/").pop())),
        r.chuginsToLoad = [],
        o && c.connect(s.destination),
        s.destination.channelCount = n,
        await c.isReady.promise,
        c
    }
    nextDeferID() {
        const e = this.deferredPromiseCounter++;
        return this.deferredPromises[e] = n(),
        e
    }
    createFile(e, t, s) {
        this.sendMessage(a.CREATE_FILE, {
            directory: e,
            filename: t,
            data: s
        })
    }
    async loadFile(e) {
        const t = e.split("/").pop()
          , n = function(e) {
            const t = e.split(".").pop();
            return s.includes(t)
        }(t);
        return fetch(e).then((e => n ? e.text() : e.arrayBuffer())).then((e => {
            n ? this.createFile("", t, e) : this.createFile("", t, new Uint8Array(e))
        }
        )).catch((e => {
            throw new Error(e)
        }
        ))
    }
    static loadChugin(e) {
        r.chuginsToLoad.push({
            serverFilename: e,
            virtualFilename: "/chugins/" + e.split("/").pop()
        })
    }
    loadedChugins() {
        return this.chugins
    }
    runCode(e) {
        const t = this.nextDeferID();
        return this.sendMessage(a.RUN_CODE, {
            callback: t,
            code: e
        }),
        this.deferredPromises[t].value()
    }
    runCodeWithReplacementDac(e, t) {
        const s = this.nextDeferID();
        return this.sendMessage(a.RUN_CODE_WITH_REPLACEMENT_DAC, {
            callback: s,
            code: e,
            dac_name: t
        }),
        this.deferredPromises[s].value()
    }
    replaceCode(e) {
        const t = this.nextDeferID();
        return this.sendMessage(a.REPLACE_CODE, {
            callback: t,
            code: e
        }),
        this.deferredPromises[t].value()
    }
    replaceCodeWithReplacementDac(e, t) {
        const s = this.nextDeferID();
        return this.sendMessage(a.REPLACE_CODE_WITH_REPLACEMENT_DAC, {
            callback: s,
            code: e,
            dac_name: t
        }),
        this.deferredPromises[s].value()
    }
    removeLastCode() {
        const e = this.nextDeferID();
        return this.sendMessage(a.REMOVE_LAST_CODE, {
            callback: e
        }),
        this.deferredPromises[e].value()
    }
    runFile(e) {
        const t = this.nextDeferID();
        return this.sendMessage(a.RUN_FILE, {
            callback: t,
            filename: e
        }),
        this.deferredPromises[t].value()
    }
    runFileWithReplacementDac(e, t) {
        const s = this.nextDeferID();
        return this.sendMessage(a.RUN_FILE_WITH_REPLACEMENT_DAC, {
            callback: s,
            dac_name: t,
            filename: e
        }),
        this.deferredPromises[s].value()
    }
    runFileWithArgs(e, t) {
        const s = this.nextDeferID();
        return this.sendMessage(a.RUN_FILE_WITH_ARGS, {
            callback: s,
            colon_separated_args: t,
            filename: e
        }),
        this.deferredPromises[s].value()
    }
    runFileWithArgsWithReplacementDac(e, t, s) {
        const n = this.nextDeferID();
        return this.sendMessage(a.RUN_FILE_WITH_ARGS, {
            callback: n,
            colon_separated_args: t,
            dac_name: s,
            filename: e
        }),
        this.deferredPromises[n].value()
    }
    replaceFile(e) {
        const t = this.nextDeferID();
        return this.sendMessage(a.REPLACE_FILE, {
            callback: t,
            filename: e
        }),
        this.deferredPromises[t].value()
    }
    replaceFileWithReplacementDac(e, t) {
        const s = this.nextDeferID();
        return this.sendMessage(a.REPLACE_FILE_WITH_REPLACEMENT_DAC, {
            callback: s,
            dac_name: t,
            filename: e
        }),
        this.deferredPromises[s].value()
    }
    replaceFileWithArgs(e, t) {
        const s = this.nextDeferID();
        return this.sendMessage(a.REPLACE_FILE_WITH_ARGS, {
            callback: s,
            colon_separated_args: t,
            filename: e
        }),
        this.deferredPromises[s].value()
    }
    replaceFileWithArgsWithReplacementDac(e, t, s) {
        const n = this.nextDeferID();
        return this.sendMessage(a.REPLACE_FILE_WITH_ARGS, {
            callback: n,
            colon_separated_args: t,
            dac_name: s,
            filename: e
        }),
        this.deferredPromises[n].value()
    }
    removeShred(e) {
        const t = this.nextDeferID();
        return this.sendMessage(a.REMOVE_SHRED, {
            shred: e,
            callback: t
        }),
        this.deferredPromises[t].value()
    }
    isShredActive(e) {
        const t = this.nextDeferID();
        return this.sendMessage(a.IS_SHRED_ACTIVE, {
            shred: e,
            callback: t
        }),
        this.deferredPromises[t].value()
    }
    signalEvent(e) {
        this.sendMessage(a.SIGNAL_EVENT, {
            variable: e
        })
    }
    broadcastEvent(e) {
        this.sendMessage(a.BROADCAST_EVENT, {
            variable: e
        })
    }
    listenForEventOnce(e, t) {
        const s = this.eventCallbackCounter++;
        this.eventCallbacks[s] = t,
        this.sendMessage(a.LISTEN_FOR_EVENT_ONCE, {
            variable: e,
            callback: s
        })
    }
    startListeningForEvent(e, t) {
        const s = this.eventCallbackCounter++;
        return this.eventCallbacks[s] = t,
        this.sendMessage(a.START_LISTENING_FOR_EVENT, {
            variable: e,
            callback: s
        }),
        s
    }
    stopListeningForEvent(e, t) {
        this.sendMessage(a.STOP_LISTENING_FOR_EVENT, {
            variable: e,
            callback: t
        })
    }
    setInt(e, t) {
        this.sendMessage(a.SET_INT, {
            variable: e,
            value: t
        })
    }
    getInt(e) {
        const t = this.nextDeferID();
        return this.sendMessage(a.GET_INT, {
            variable: e,
            callback: t
        }),
        this.deferredPromises[t].value()
    }
    setFloat(e, t) {
        this.sendMessage(a.SET_FLOAT, {
            variable: e,
            value: t
        })
    }
    getFloat(e) {
        const t = this.nextDeferID();
        return this.sendMessage(a.GET_FLOAT, {
            variable: e,
            callback: t
        }),
        this.deferredPromises[t].value()
    }
    setString(e, t) {
        this.sendMessage(a.SET_STRING, {
            variable: e,
            value: t
        })
    }
    getString(e) {
        const t = this.nextDeferID();
        return this.sendMessage(a.GET_STRING, {
            variable: e,
            callback: t
        }),
        this.deferredPromises[t].value()
    }
    setIntArray(e, t) {
        this.sendMessage(a.SET_INT_ARRAY, {
            variable: e,
            values: t
        })
    }
    getIntArray(e) {
        const t = this.nextDeferID();
        return this.sendMessage(a.GET_INT_ARRAY, {
            variable: e,
            callback: t
        }),
        this.deferredPromises[t].value()
    }
    setIntArrayValue(e, t, s) {
        this.sendMessage(a.SET_INT_ARRAY_VALUE, {
            variable: e,
            index: t,
            value: s
        })
    }
    getIntArrayValue(e, t) {
        const s = this.nextDeferID();
        return this.sendMessage(a.GET_INT_ARRAY_VALUE, {
            variable: e,
            index: t,
            callback: s
        }),
        this.deferredPromises[s].value()
    }
    setAssociativeIntArrayValue(e, t, s) {
        this.sendMessage(a.SET_ASSOCIATIVE_INT_ARRAY_VALUE, {
            variable: e,
            key: t,
            value: s
        })
    }
    getAssociativeIntArrayValue(e, t) {
        const s = this.nextDeferID();
        return this.sendMessage(a.GET_ASSOCIATIVE_INT_ARRAY_VALUE, {
            variable: e,
            key: t,
            callback: s
        }),
        this.deferredPromises[s].value()
    }
    setFloatArray(e, t) {
        this.sendMessage(a.SET_FLOAT_ARRAY, {
            variable: e,
            values: t
        })
    }
    getFloatArray(e) {
        const t = this.nextDeferID();
        return this.sendMessage(a.GET_FLOAT_ARRAY, {
            variable: e,
            callback: t
        }),
        this.deferredPromises[t].value()
    }
    setFloatArrayValue(e, t, s) {
        this.sendMessage(a.SET_FLOAT_ARRAY_VALUE, {
            variable: e,
            index: t,
            value: s
        })
    }
    getFloatArrayValue(e, t) {
        const s = this.nextDeferID();
        return this.sendMessage(a.GET_FLOAT_ARRAY_VALUE, {
            variable: e,
            index: t,
            callback: s
        }),
        this.deferredPromises[s].value()
    }
    setAssociativeFloatArrayValue(e, t, s) {
        this.sendMessage(a.SET_ASSOCIATIVE_FLOAT_ARRAY_VALUE, {
            variable: e,
            key: t,
            value: s
        })
    }
    getAssociativeFloatArrayValue(e, t) {
        const s = this.nextDeferID();
        return this.sendMessage(a.GET_ASSOCIATIVE_FLOAT_ARRAY_VALUE, {
            variable: e,
            key: t,
            callback: s
        }),
        this.deferredPromises[s].value()
    }
    setParamInt(e, t) {
        this.sendMessage(a.SET_PARAM_INT, {
            name: e,
            value: t
        })
    }
    getParamInt(e) {
        const t = this.nextDeferID();
        return this.sendMessage(a.GET_PARAM_INT, {
            name: e,
            callback: t
        }),
        this.deferredPromises[t].value()
    }
    setParamFloat(e, t) {
        this.sendMessage(a.SET_PARAM_FLOAT, {
            name: e,
            value: t
        })
    }
    getParamFloat(e) {
        const t = this.nextDeferID();
        return this.sendMessage(a.GET_PARAM_FLOAT, {
            name: e,
            callback: t
        }),
        this.deferredPromises[t].value()
    }
    setParamString(e, t) {
        this.sendMessage(a.SET_PARAM_STRING, {
            name: e,
            value: t
        })
    }
    getParamString(e) {
        const t = this.nextDeferID();
        return this.sendMessage(a.GET_PARAM_STRING, {
            name: e,
            callback: t
        }),
        this.deferredPromises[t].value()
    }
    now() {
        const e = this.nextDeferID();
        return this.sendMessage(a.GET_CHUCK_NOW, {
            callback: e
        }),
        this.deferredPromises[e].value()
    }
    clearChuckInstance() {
        this.sendMessage(a.CLEAR_INSTANCE)
    }
    clearGlobals() {
        this.sendMessage(a.CLEAR_GLOBALS)
    }
    chuckPrint(e) {
        console.log(e)
    }
    sendMessage(e, t) {
        const s = t ? {
            type: e,
            ...t
        } : {
            type: e
        };
        this.port.postMessage(s)
    }
    receiveMessage(e) {
        switch (e.data.type) {
        case i.INIT_DONE:
            this.isReady && this.isReady.resolve && this.isReady.resolve();
            break;
        case i.PRINT:
            this.chuckPrint(e.data.message);
            break;
        case i.EVENT:
            if (e.data.callback in this.eventCallbacks) {
                (0,
                this.eventCallbacks[e.data.callback])()
            }
            break;
        case i.INT:
        case i.FLOAT:
        case i.STRING:
        case i.INT_ARRAY:
        case i.FLOAT_ARRAY:
            if (e.data.callback in this.deferredPromises) {
                const t = this.deferredPromises[e.data.callback];
                t.resolve && t.resolve(e.data.result),
                delete this.deferredPromises[e.data.callback]
            }
            break;
        case i.NEW_SHRED:
            if (e.data.callback in this.deferredPromises) {
                const t = this.deferredPromises[e.data.callback];
                e.data.shred > 0 ? t.resolve && t.resolve(e.data.shred) : t.reject && t.reject("Running code failed")
            }
            break;
        case i.REPLACED_SHRED:
            if (e.data.callback in this.deferredPromises) {
                const t = this.deferredPromises[e.data.callback];
                e.data.newShred > 0 ? t.resolve && t.resolve({
                    newShred: e.data.newShred,
                    oldShred: e.data.oldShred
                }) : t.reject && t.reject("Replacing code failed")
            }
            break;
        case i.REMOVED_SHRED:
            if (e.data.callback in this.deferredPromises) {
                const t = this.deferredPromises[e.data.callback];
                e.data.shred > 0 ? t.resolve && t.resolve(e.data.shred) : t.reject && t.reject("Removing code failed")
            }
        }
    }
}
r.chuckID = 1,
r.chuginsToLoad = [];
var o;
!function(e) {
    e[e.BUTTON_DOWN = 1] = "BUTTON_DOWN",
    e[e.BUTTON_UP = 2] = "BUTTON_UP",
    e[e.MOUSE_MOTION = 5] = "MOUSE_MOTION",
    e[e.WHEEL_MOTION = 6] = "WHEEL_MOTION"
}(o || (o = {}));
class l {
    constructor(e) {
        this._mouseActive = !1,
        this._kbdActive = !1,
        this.theChuck = e,
        this.keymap = new Array(256).fill(!1),
        this.boundHandleMouseMove = this.handleMouseMove.bind(this),
        this.boundHandleMouseDown = this.handleMouseDown.bind(this),
        this.boundHandleMouseUp = this.handleMouseUp.bind(this),
        this.boundHandleMouseWheel = this.handleMouseWheel.bind(this),
        this.boundHandleKeyDown = this.handleKeyDown.bind(this),
        this.boundHandleKeyUp = this.handleKeyUp.bind(this)
    }
    static async init(e, t=!0, s=!0) {
        const n = new l(e);
        return await n.theChuck.runCode("\npublic class HidMsg {\n    int type;\n    int deviceType;\n    int cursorX;\n    int cursorY;\n    float deltaX;\n    float deltaY;\n    float scaledCursorX;\n    float scaledCursorY;\n    int which;\n    int ascii;\n    string key;\n\n    // type 1 message\n    function int isButtonDown() {\n        return type == 1;\n    }\n\n    // type 2 message\n    function int isButtonUp() {\n        return type == 2;\n    }\n\n    // type 5 message\n    function int isMouseMotion(){\n        return type == 5;\n    }\n\n    // type 6 message\n    function int isWheelMotion(){\n        return type == 6;\n    }\n\n    function void _copy(HidMsg localMsg) {\n        localMsg.type => type;\n        localMsg.deviceType => deviceType;\n        localMsg.cursorX => cursorX;\n        localMsg.cursorY => cursorY;\n        localMsg.deltaX => deltaX;\n        localMsg.deltaY => deltaY;\n        localMsg.scaledCursorX => scaledCursorX;\n        localMsg.scaledCursorY => scaledCursorY;\n        localMsg.which => which;\n        localMsg.ascii => ascii;\n        localMsg.key => key;\n    }\n}\n"),
        await n.theChuck.runCode('\nglobal Event _kbHid;\nglobal Event _mouseHid;\nglobal int _type;\nglobal int _mouseActive;\nglobal int _kbdActive;\n\nglobal int _cursorX;\nglobal int _cursorY;\nglobal float _deltaX;\nglobal float _deltaY;\nglobal float _scaledCursorX;\nglobal float _scaledCursorY;\n\nglobal int _ascii;\nglobal int _which;\nglobal string _key;\n\npublic class Hid extends Event {\n\n    0 => int isMouseOpen;\n    0 => int isKBDOpen;\n    0 => int active;\n\n    string deviceName; \n    int deviceType; // mouse = 2, keyboard = 3\n\n    // HidMsg Queue\n    HidMsg _hidMsgQueue[0];\n\n    function string name() {\n        return deviceName;\n    }\n\n    function int openMouse(int num) {\n        if (num < 0) {\n            false => active;\n        } else {\n            "virtualJS mouse/trackpad" => deviceName;\n            2 => deviceType;\n            true => active;\n        }\n        active => isMouseOpen => _mouseActive;\n        spork ~ _mouseListener();\n        return active;\n    }\n\n    function int openKeyboard(int num) {\n        if (num < 0) {\n            false => active;\n        } else {\n            "virtualJS keyboard" => deviceName;\n            3 => deviceType;\n            true => active;\n        }\n        active => isKBDOpen => _kbdActive;\n        spork ~ _keyboardListener();\n        return active;\n    }\n\n    // Pop the first HidMsg from the queue\n    // Write it to msg and return 1\n    function int recv(HidMsg msg) {\n        // is empty\n        if (_hidMsgQueue.size() <= 0) {\n            return 0;\n        }\n\n        // pop the first HidMsg to msg, return true\n        _hidMsgQueue[0] @=> HidMsg localMsg;\n        msg._copy(localMsg);    \n        _hidMsgQueue.popFront();\n        return 1;\n    }\n\n    // Keyboard Hid Listener\n    // Get variables from JS and write to the HidMsg \n    function void _keyboardListener() {\n        HidMsg @ msg;\n        while(true){\n            new HidMsg @=> msg;\n            deviceType => msg.deviceType;\n            _kbHid => now;\n\n            _type => msg.type;\n            _which => msg.which;\n            _ascii => msg.ascii;\n            _key => msg.key;\n\n            _hidMsgQueue << msg;\n            this.broadcast();\n        }\n    }\n\n    // Mouse Hid Listener\n    // Get variables from JS and write to the HidMsg \n    function void _mouseListener() {\n        HidMsg @ msg;\n        while(true){\n            new HidMsg @=> msg;\n            deviceType => msg.deviceType;\n            _mouseHid => now;\n\n            _type => msg.type;\n            _cursorX => msg.cursorX;\n            _cursorY => msg.cursorY;\n            _deltaX => msg.deltaX;\n            _deltaY => msg.deltaY;\n            _scaledCursorX => msg.scaledCursorX;\n            _scaledCursorY => msg.scaledCursorY;\n            _which => msg.which;\n\n            _hidMsgQueue << msg;\n            this.broadcast();\n        }\n    }\n}\n'),
        t && n.enableMouse(),
        s && n.enableKeyboard(),
        n
    }
    async kbdActive() {
        const e = await this.theChuck.getInt("_kbdActive");
        this._kbdActive = 1 == e
    }
    async mouseActive() {
        const e = await this.theChuck.getInt("_mouseActive");
        this._mouseActive = 1 == e
    }
    getMousePos(e) {
        return {
            x: e.clientX,
            y: e.clientY
        }
    }
    enableMouse() {
        document.addEventListener("mousemove", this.boundHandleMouseMove),
        document.addEventListener("mousedown", this.boundHandleMouseDown),
        document.addEventListener("mouseup", this.boundHandleMouseUp),
        document.addEventListener("wheel", this.boundHandleMouseWheel),
        document.addEventListener("contextmenu", l.handleContextMenu)
    }
    disableMouse() {
        document.removeEventListener("mousemove", this.boundHandleMouseMove),
        document.removeEventListener("mousedown", this.boundHandleMouseDown),
        document.removeEventListener("mouseup", this.boundHandleMouseUp),
        document.removeEventListener("wheel", this.boundHandleMouseWheel),
        document.removeEventListener("contextmenu", l.handleContextMenu)
    }
    enableKeyboard() {
        document.addEventListener("keydown", this.boundHandleKeyDown),
        document.addEventListener("keyup", this.boundHandleKeyUp)
    }
    disableKeyboard() {
        document.removeEventListener("keydown", this.boundHandleKeyDown),
        document.removeEventListener("keyup", this.boundHandleKeyUp)
    }
    handleMouseMove(e) {
        if (this.mouseActive(),
        this._mouseActive) {
            const t = this.getMousePos(e);
            this.theChuck.setInt("_cursorX", t.x),
            this.theChuck.setInt("_cursorY", t.y),
            this.theChuck.setFloat("_deltaX", e.movementX),
            this.theChuck.setFloat("_deltaY", e.movementY),
            this.theChuck.setFloat("_scaledCursorX", t.x / document.documentElement.clientWidth),
            this.theChuck.setFloat("_scaledCursorY", t.y / document.documentElement.clientHeight),
            this.theChuck.setInt("_type", o.MOUSE_MOTION),
            this.theChuck.broadcastEvent("_mouseHid")
        }
    }
    handleMouseDown(e) {
        this.mouseActive(),
        this._mouseActive && (this.theChuck.setInt("_which", e.which),
        this.theChuck.setInt("_type", o.BUTTON_DOWN),
        this.theChuck.broadcastEvent("_mouseHid"))
    }
    handleMouseUp(e) {
        this.mouseActive(),
        this._mouseActive && (this.theChuck.setInt("_which", e.which),
        this.theChuck.setInt("_type", o.BUTTON_UP),
        this.theChuck.broadcastEvent("_mouseHid"))
    }
    handleMouseWheel(e) {
        this.mouseActive(),
        this._mouseActive && (this.theChuck.setFloat("_deltaX", c(e.deltaX, -1, 1)),
        this.theChuck.setFloat("_deltaY", c(e.deltaY, -1, 1)),
        this.theChuck.setInt("_type", o.WHEEL_MOTION),
        this.theChuck.broadcastEvent("_mouseHid"))
    }
    static handleContextMenu(e) {
        e.preventDefault()
    }
    handleKeyDown(e) {
        this.kbdActive(),
        this._kbdActive && !this.keymap[e.keyCode] && (this.keymap[e.keyCode] = !0,
        this.keyPressManager(e, !0))
    }
    handleKeyUp(e) {
        this.kbdActive(),
        this._kbdActive && (this.keymap[e.keyCode] = !1,
        this.keyPressManager(e, !1))
    }
    keyPressManager(e, t) {
        this.theChuck.setString("_key", e.key),
        this.theChuck.setInt("_which", e.which),
        this.theChuck.setInt("_ascii", e.keyCode),
        this.theChuck.setInt("_type", t ? o.BUTTON_DOWN : o.BUTTON_UP),
        this.theChuck.broadcastEvent("_kbHid")
    }
}
function c(e, t, s) {
    return Math.min(Math.max(e, t), s)
}
export {r as Chuck, e as DeferredPromise, l as HID};
export default null;
//# sourceMappingURL=/sm/0005fb8d351fcab244254513d46a8db1238c716b35162196a325e0e2855a0ed0.map
