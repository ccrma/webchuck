/**
 * DeferredPromise is a utility class that enables resolving or rejecting
 * promises externally. This is particularly useful when working with async
 * communication, like with a Worker.
 *
 * @typeparam T The type of the resolved value. Defaults to any if not provided.
 */
class DeferredPromise {
    /**
     * Constructs a new DeferredPromise instance, initializing the promise
     * and setting up the resolve and reject methods.
     */
    constructor() {
        this.resolve = undefined;
        this.reject = undefined;
        // Create a new promise and store the resolve and reject methods
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }
    /**
     * Get the value from any Deferred Promise
     * @returns value from resolve/reject
     */
    async value() {
        // whether resolve or reject, return the value wrapped in a promise
        return await this.promise;
    }
}

function readAsync(url, onload, onerror) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "arraybuffer";
    xhr.onload = () => {
        if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) {
            onload(xhr.response);
        }
        else {
            onerror();
        }
    };
    xhr.onerror = onerror;
    xhr.send(null);
}
function asyncLoadFile(url, onload, onerror) {
    readAsync(url, (arrayBuffer) => {
        // TODO: do we need Uint8Array here?
        onload(new Uint8Array(arrayBuffer));
    }, () => {
        if (onerror) {
            onerror();
        }
        else {
            throw new Error(`Loading data file ${url} failed.`);
        }
    });
}
async function preloadFiles(filenamesToPreload) {
    const promises = filenamesToPreload.map((filenameToPreload) => new Promise((resolve, _reject) => {
        asyncLoadFile(filenameToPreload.serverFilename, (byteArray) => {
            resolve({
                filename: filenameToPreload.virtualFilename,
                data: byteArray,
            });
        }, () => {
            console.error(`Error fetching file: ${filenameToPreload.serverFilename}`);
        });
    }));
    return await Promise.all(promises);
}
async function loadWasm(whereIsChuck) {
    return await new Promise((resolve, reject) => {
        asyncLoadFile(whereIsChuck + "webchuck.wasm", resolve, reject);
    });
}
const defer = () => new DeferredPromise();

var OutMessage;
(function (OutMessage) {
    // Filesystem
    OutMessage["LOAD_FILE"] = "loadFile";
    // Run/Replace Code
    OutMessage["RUN_CODE"] = "runChuckCode";
    OutMessage["RUN_CODE_WITH_REPLACEMENT_DAC"] = "runChuckCodeWithReplacementDac";
    OutMessage["REPLACE_CODE"] = "replaceChuckCode";
    OutMessage["REPLACE_CODE_WITH_REPLACEMENT_DAC"] = "replaceChuckCodeWithReplacementDac";
    OutMessage["REMOVE_LAST_CODE"] = "removeLastCode";
    // Run/Replace File
    OutMessage["RUN_FILE"] = "runChuckFile";
    OutMessage["RUN_FILE_WITH_REPLACEMENT_DAC"] = "runChuckFileWithReplacementDac";
    OutMessage["RUN_FILE_WITH_ARGS"] = "runChuckFileWithArgs";
    OutMessage["REPLACE_FILE"] = "replaceChuckFile";
    OutMessage["REPLACE_FILE_WITH_REPLACEMENT_DAC"] = "replaceChuckFileWithReplacementDac";
    OutMessage["REPLACE_FILE_WITH_ARGS"] = "replaceChuckFileWithArgs";
    // SHRED
    OutMessage["REMOVE_SHRED"] = "removeShred";
    OutMessage["IS_SHRED_ACTIVE"] = "isShredActive";
    // Event
    OutMessage["SIGNAL_EVENT"] = "signalChuckEvent";
    OutMessage["BROADCAST_EVENT"] = "broadcastChuckEvent";
    OutMessage["LISTEN_FOR_EVENT_ONCE"] = "listenForEventOnce";
    OutMessage["START_LISTENING_FOR_EVENT"] = "startListeningForChuckEvent";
    OutMessage["STOP_LISTENING_FOR_EVENT"] = "stopListeningForChuckEvent";
    // Int, Float, String
    OutMessage["SET_INT"] = "setChuckInt";
    OutMessage["GET_INT"] = "getChuckInt";
    OutMessage["SET_FLOAT"] = "setChuckFloat";
    OutMessage["GET_FLOAT"] = "getChuckFloat";
    OutMessage["SET_STRING"] = "setChuckString";
    OutMessage["GET_STRING"] = "getChuckString";
    // Int[]
    OutMessage["SET_INT_ARRAY"] = "setGlobalIntArray";
    OutMessage["GET_INT_ARRAY"] = "getGlobalIntArray";
    OutMessage["SET_INT_ARRAY_VALUE"] = "setGlobalIntArrayValue";
    OutMessage["GET_INT_ARRAY_VALUE"] = "getGlobalIntArrayValue";
    OutMessage["SET_ASSOCIATIVE_INT_ARRAY_VALUE"] = "setGlobalAssociativeIntArrayValue";
    OutMessage["GET_ASSOCIATIVE_INT_ARRAY_VALUE"] = "getGlobalAssociativeIntArrayValue";
    // Float[]
    OutMessage["SET_FLOAT_ARRAY"] = "setGlobalFloatArray";
    OutMessage["GET_FLOAT_ARRAY"] = "getGlobalFloatArray";
    OutMessage["SET_FLOAT_ARRAY_VALUE"] = "setGlobalFloatArrayValue";
    OutMessage["GET_FLOAT_ARRAY_VALUE"] = "getGlobalFloatArrayValue";
    OutMessage["SET_ASSOCIATIVE_FLOAT_ARRAY_VALUE"] = "setGlobalAssociativeFloatArrayValue";
    OutMessage["GET_ASSOCIATIVE_FLOAT_ARRAY_VALUE"] = "getGlobalAssociativeFloatArrayValue";
    // VM Params
    OutMessage["SET_PARAM_INT"] = "setParamInt";
    OutMessage["GET_PARAM_INT"] = "getParamInt";
    OutMessage["SET_PARAM_FLOAT"] = "setParamFloat";
    OutMessage["GET_PARAM_FLOAT"] = "getParamFloat";
    OutMessage["SET_PARAM_STRING"] = "setParamString";
    OutMessage["GET_PARAM_STRING"] = "getParamString";
    // VM
    OutMessage["GET_CHUCK_NOW"] = "getChuckNow";
    // Clear
    OutMessage["CLEAR_INSTANCE"] = "clearChuckInstance";
    OutMessage["CLEAR_GLOBALS"] = "clearGlobals";
})(OutMessage || (OutMessage = {}));
var InMessage;
(function (InMessage) {
    InMessage["INIT_DONE"] = "initCallback";
    InMessage["PRINT"] = "console print";
    InMessage["EVENT"] = "eventCallback";
    InMessage["INT"] = "intCallback";
    InMessage["FLOAT"] = "floatCallback";
    InMessage["STRING"] = "stringCallback";
    InMessage["INT_ARRAY"] = "intArrayCallback";
    InMessage["FLOAT_ARRAY"] = "floatArrayCallback";
    InMessage["NEW_SHRED"] = "newShredCallback";
    InMessage["REPLACED_SHRED"] = "replacedShredCallback";
    InMessage["REMOVED_SHRED"] = "removedShredCallback";
})(InMessage || (InMessage = {}));

/*
 * Here's a brief overview of the main components of the Chuck class:
 *  - Constructor: The constructor takes preloaded files, an AudioContext, and a WebAssembly (Wasm) binary as input. It initializes the AudioWorkletNode and sets up the necessary event listeners and error handlers.
 *  - init: A static method that initializes a new instance of the Chuck class. It loads the Wasm binary, creates an AudioContext, adds the AudioWorklet module, preloads files, and connects the instance to the audio context's destination.
 *  - AudioWorkletNode: Methods that expose the AudioWorkletNode, or properties of it.
 *  - Filesystem: Methods like createFile and preloadFiles help manage files within the ChucK environment.
 *  - Run/Replace Code: Methods like runCode, runCodeWithReplacementDac, replaceCode, and replaceCodeWithReplacementDac allow running and replacing ChucK code with or without a specified DAC (Digital-to-Analog Converter).
 *  - Run/Replace File: Methods like runFile, runFileWithReplacementDac, replaceFile, and replaceFileWithReplacementDac allow running and replacing ChucK files with or without a specified DAC.
 *  - Shred: Methods like removeShred and isShredActive allow managing ChucK shreds (concurrent threads of execution in ChucK).
 *  - Event: Methods like signalEvent, broadcastEvent, listenForEventOnce, startListeningForEvent, and stopListeningForEvent allow managing ChucK events.
 *  - Int, Float, String: Methods like setInt, getInt, setFloat, getFloat, setString, and getString allow setting and getting integer, float, and string variables in ChucK.
 *  - Int[], Float[]: Methods like setIntArray, getIntArray, setFloatArray, and getFloatArray allow managing integer and float arrays in ChucK.
 *  - Clear: Methods like clearChuckInstance and clearGlobals allow clearing the ChucK instance and its global state.
 *  - Private: Private methods like sendMessage and receiveMessage handle messaging between the Chuck class and the AudioWorklet.
 */
/**
 * WebChucK: ChucK Web Audio Node class.
 * See init() to get started
 */
class Chuck extends window.AudioWorkletNode {
    /**
     * Internal constructor for a ChucK AudioWorklet Web Audio Node
     * @param preloadedFiles Array of Files to preload into ChucK's filesystem
     * @param audioContext AudioContext to connect to
     * @param wasm WebChucK WebAssembly binary
     * @param numOutChannels Number of output channels
     * @returns ChucK AudioWorklet Node
     */
    constructor(preloadedFiles, audioContext, wasm, numOutChannels = 2) {
        super(audioContext, "chuck-node", {
            numberOfInputs: 1,
            numberOfOutputs: 1,
            // important: "number of inputs / outputs" is like an aggregate source
            // most of the time, you only want one input source and one output
            // source, but each one has multiple channels
            outputChannelCount: [numOutChannels],
            processorOptions: {
                chuckID: Chuck.chuckID,
                srate: audioContext.sampleRate,
                preloadedFiles,
                wasm,
            },
        });
        this.deferredPromises = {};
        this.deferredPromiseCounter = 0;
        this.eventCallbacks = {};
        this.eventCallbackCounter = 0;
        this.isReady = defer();
        this.port.onmessage = this.receiveMessage.bind(this);
        this.onprocessorerror = (e) => console.error(e);
        Chuck.chuckID++;
    }
    /**
     * Call me to initialize a ChucK Web Audio Node. Generally you only need one instance of this.
     * @example theChuck = await Chuck.init([]); // initialize ChucK with no preloaded files
     * @example theChuck = await Chuck.init([{serverFileName: "./filename", virtualFileName: "filename"}]); // initialize ChucK with preloaded files
     * @param filenamesToPreload Array of Files to preload into ChucK's filesystem [{serverFileName: "./filename", virtualFileName: "filename"}...]
     * @param audioContext Optional parameter if you want to use your own AudioContext. Otherwise, a new one will be created and the node will be connected to the output destination.
     * @param numOutChannels Optional number of output channels. Default is 2 and Web Audio supports up to 32.
     * @param whereIsChuck Optional url to your src folder containing webchuck.js and webchuck.wasm
     * @returns WebChucK ChucK instance
     */
    static async init(filenamesToPreload, audioContext, numOutChannels = 2, whereIsChuck = "https://chuck.stanford.edu/webchuck/src/") {
        const wasm = await loadWasm(whereIsChuck);
        let defaultAudioContext = false;
        // If an audioContext is not given, create a default one
        if (audioContext === undefined) {
            audioContext = new AudioContext();
            defaultAudioContext = true;
        }
        if (audioContext.state === "suspended") {
            await audioContext.resume();
        }
        await audioContext.audioWorklet.addModule(whereIsChuck + "webchuck.js");
        const preloadedFiles = await preloadFiles(filenamesToPreload);
        const chuck = new Chuck(preloadedFiles, audioContext, wasm, numOutChannels);
        // connect node to default destination if using default audio context
        if (defaultAudioContext) {
            chuck.connect(audioContext.destination); // default connection source
        }
        await chuck.isReady.promise;
        return chuck;
    }
    /**
     * Private function for ChucK to handle execution of tasks.
     * Will create a Deferred Promise that wraps a task for WebChucK to execute
     * @returns callbackID to a an action for ChucK to perform
     */
    nextDeferID() {
        const callbackID = this.deferredPromiseCounter++;
        this.deferredPromises[callbackID] = defer();
        return callbackID;
    }
    // ================== Filesystem ===================== //
    /**
     * Create a virtual file in ChucK's filesystem.
     * You should first locally fetch() the contents of your file, then pass the data to this method.
     * @param directory Virtual directory to create file in
     * @param filename Name of file to create
     * @param data Data that you want to write to the file
     */
    createFile(directory, filename, data) {
        this.sendMessage(OutMessage.LOAD_FILE, {
            directory,
            filename,
            data,
        });
    }
    /**
     * Automatically fetch and load in a file from a URL to ChucK's virtual filesystem
     * @param url URL to a file to fetch and load file
     */
    async loadFile(url) {
        const filename = url.split("/").pop();
        if (url.endsWith(".ck")) {
            return fetch(url).then((response) => response.text()).then((text) => {
                this.createFile("", filename, text);
            });
        }
        else {
            return fetch(url).then((response) => response.arrayBuffer()).then((buffer) => {
                this.createFile("", filename, new Uint8Array(buffer));
            });
        }
    }
    // ================== Run/Replace Code ================== //
    /**
     * Run a string of ChucK code
     * @param code ChucK code string to be executed
     * @returns promise to the shred ID
     */
    runCode(code) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.RUN_CODE, { callback: callbackID, code });
        return this.deferredPromises[callbackID].value();
    }
    /**
     * Run a string of ChucK code using a different dac (unsure of functionality)
     * -tf (5/30/2023)
     * @param code ChucK code string to be executed
     * @param dacName dac for ChucK (??)
     * @returns promise to the shred ID
     */
    runCodeWithReplacementDac(code, dacName) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.RUN_CODE_WITH_REPLACEMENT_DAC, {
            callback: callbackID,
            code,
            dac_name: dacName,
        });
        return this.deferredPromises[callbackID].value();
    }
    /**
     * Replace last running shred with string of ChucK code to execute
     * @param code ChucK code string to replace last Shred
     * @returns promise to shred ID that is removed
     */
    replaceCode(code) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.REPLACE_CODE, {
            callback: callbackID,
            code,
        });
        return this.deferredPromises[callbackID].value();
    }
    /**
     * Replace last running shred with string of ChucK code to execute, to another dac (??)
     * @param code ChucK code string to replace last Shred
     * @param dacName dac for ChucK (??)
     * @returns promise to shred ID
     */
    replaceCodeWithReplacementDac(code, dacName) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.REPLACE_CODE_WITH_REPLACEMENT_DAC, {
            callback: callbackID,
            code,
            dac_name: dacName,
        });
        return this.deferredPromises[callbackID].value();
    }
    /**
     * Remove the last running shred
     * @returns promise to the shred ID that was removed
     */
    removeLastCode() {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.REMOVE_LAST_CODE, { callback: callbackID });
        return this.deferredPromises[callbackID].value();
    }
    // ================== Run/Replace File ================== //
    /**
     * Run a ChucK file that is already in the WebChucK virtual file system.
     * Note that the file must already have been loaded via preloadedFiles[], createFile(), or loadFile()
     * @param filename ChucK file to be run
     * @returns promise to shred ID
     */
    runFile(filename) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.RUN_FILE, {
            callback: callbackID,
            filename,
        });
        return this.deferredPromises[callbackID].value();
    }
    /**
     * Run a ChucK file that is already in the WebChucK virtual file system, on separate dac (??).
     * Note that the file must already have been loaded via preloadedFiles[], createFile(), or loadFile()
     * @param filename ChucK file to be run
     * @param dacName dac for ChucK (??)
     * @returns promise to shred ID
     */
    runFileWithReplacementDac(filename, dacName) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.RUN_FILE_WITH_REPLACEMENT_DAC, {
            callback: callbackID,
            dac_name: dacName,
            filename,
        });
        return this.deferredPromises[callbackID].value();
    }
    /**
     * Run a ChucK file that is already in the WebChucK virtual file system with arguments.
     * e.g. native equivalent of `chuck myFile:arg`
     * @param filename ChucK file to be run
     * @param colonSeparatedArgs arguments to pass to the file
     * @returns promise to shred ID
     */
    runFileWithArgs(filename, colonSeparatedArgs) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.RUN_FILE_WITH_ARGS, {
            callback: callbackID,
            colon_separated_args: colonSeparatedArgs,
            filename,
        });
        return this.deferredPromises[callbackID].value();
    }
    /**
     * Run a ChucK file that is already in the WebChucK virtual file system with arguments.
     * e.g. native equivalent of `chuck myFile:arg`
     * @param filename ChucK file to be run
     * @param colonSeparatedArgs arguments to pass to the file
     * @param dacName dac for ChucK (??)
     * @returns promise to shred ID
     */
    runFileWithArgsWithReplacementDac(filename, colonSeparatedArgs, dacName) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.RUN_FILE_WITH_ARGS, {
            callback: callbackID,
            colon_separated_args: colonSeparatedArgs,
            dac_name: dacName,
            filename,
        });
        return this.deferredPromises[callbackID].value();
    }
    /**
     * Replace the last running shred with a file to execute.
     * Note that the file must already be in the WebChucK virtual file system via preloadedFiles[], createFile(), or loadFile()
     * @param filename file to be replace last
     * @returns promise to shred ID
     */
    replaceFile(filename) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.REPLACE_FILE, {
            callback: callbackID,
            filename,
        });
        return this.deferredPromises[callbackID].value();
    }
    /**
     * Replace the last running shred with a file to execute.
     * Note that the file must already be in the WebChucK virtual file system via preloadedFiles[], createFile(), or loadFile()
     * @param filename file to be replace last
     * @param dacName dac for ChucK (??)
     * @returns promise to shred ID
     */
    replaceFileWithReplacementDac(filename, dacName) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.REPLACE_FILE_WITH_REPLACEMENT_DAC, {
            callback: callbackID,
            dac_name: dacName,
            filename,
        });
        return this.deferredPromises[callbackID].value();
    }
    /**
     * Replace the last running shred with a file to execute, passing arguments.
     * Note that the file must already be in the WebChucK virtual file system via preloadedFiles[], createFile(), or loadFile()
     * @param filename file to be replace last running shred
     * @param colonSeparatedArgs arguments to pass in to file
     * @returns promise to shred ID
     */
    replaceFileWithArgs(filename, colonSeparatedArgs) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.REPLACE_FILE_WITH_ARGS, {
            callback: callbackID,
            colon_separated_args: colonSeparatedArgs,
            filename,
        });
        return this.deferredPromises[callbackID].value();
    }
    /**
     * Replace the last running shred with a file to execute, passing arguments, and dac.
     * Note that the file must already be in the WebChucK virtual file system via preloadedFiles[], createFile(), or loadFile()
     * @param filename file to be replace last running shred
     * @param colonSeparatedArgs arguments to pass in to file
     * @param dacName dac for ChucK (??)
     * @returns promise to shred ID
     */
    replaceFileWithArgsWithReplacementDac(filename, colonSeparatedArgs, dacName) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.REPLACE_FILE_WITH_ARGS, {
            callback: callbackID,
            colon_separated_args: colonSeparatedArgs,
            dac_name: dacName,
            filename,
        });
        return this.deferredPromises[callbackID].value();
    }
    // ================== Shred =================== //
    /**
     * Remove a shred from ChucK VM by ID
     * @param shred shred ID to be removed
     * @returns promise to whether Shred was removed successfully
     */
    removeShred(shred) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.REMOVE_SHRED, {
            shred,
            callback: callbackID,
        });
        return this.deferredPromises[callbackID].value();
    }
    /**
     * Check if a shred from ChucK VM is running
     * @param shred which shred ID to check
     * @returns promise to whether Shred was is running
     */
    isShredActive(shred) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.IS_SHRED_ACTIVE, {
            shred,
            callback: callbackID,
        });
        return this.deferredPromises[callbackID].value();
    }
    // ================== Event =================== //
    /**
     * Signal a ChucK event, will wake the first waiting Shred
     * @param variable ChucK event variable to be signaled
     */
    signalEvent(variable) {
        this.sendMessage(OutMessage.SIGNAL_EVENT, { variable });
    }
    /**
     * Broadcast a ChucK event to all
     * @param variable ChucK event variable to be signaled
     */
    broadcastEvent(variable) {
        this.sendMessage(OutMessage.BROADCAST_EVENT, { variable });
    }
    /**
     * <more information needed>
     * @param variable
     * @param callback
     */
    listenForEventOnce(variable, callback) {
        const callbackID = this.eventCallbackCounter++;
        this.eventCallbacks[callbackID] = callback;
        this.sendMessage(OutMessage.LISTEN_FOR_EVENT_ONCE, {
            variable,
            callback: callbackID,
        });
    }
    /**
     * <more information needed>
     * @param variable
     * @param callback
     * @returns
     */
    startListeningForEvent(variable, callback) {
        const callbackID = this.eventCallbackCounter++;
        this.eventCallbacks[callbackID] = callback;
        this.sendMessage(OutMessage.START_LISTENING_FOR_EVENT, {
            variable,
            callback: callbackID,
        });
        return callbackID;
    }
    /**
     * <more information needed>
     * @param variable
     * @param callbackID
     */
    stopListeningForEvent(variable, callbackID) {
        this.sendMessage(OutMessage.STOP_LISTENING_FOR_EVENT, {
            variable,
            callback: callbackID,
        });
    }
    // ================== Int, Float, String ============= //
    /**
     * Set the value of a global int variable in ChucK
     * @param variable name of variable
     * @param value value to set
     */
    setInt(variable, value) {
        this.sendMessage(OutMessage.SET_INT, { variable, value });
    }
    /**
     * Get the value of a global int variable in ChucK.
     * @param variable name of variable
     * @returns promise with value of the variable
     */
    getInt(variable) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.GET_INT, {
            variable,
            callback: callbackID,
        });
        return this.deferredPromises[callbackID].value();
    }
    /**
     * Set the value of a global float variable in ChucK
     * @param variable name of variable
     * @param value value to set
     */
    setFloat(variable, value) {
        this.sendMessage(OutMessage.SET_FLOAT, { variable, value });
    }
    /**
     * Get the value of a global float variable in ChucK.
     * @param variable name of variable
     * @returns promise with value of the variable
     */
    getFloat(variable) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.GET_FLOAT, {
            variable,
            callback: callbackID,
        });
        return this.deferredPromises[callbackID].value();
    }
    /**
     * Set the value of a global string variable in ChucK
     * @param variable name of string variable
     * @param value new string to set
     */
    setString(variable, value) {
        this.sendMessage(OutMessage.SET_STRING, { variable, value });
    }
    /**
     * Get the value of a global string variable in ChucK.
     * @param variable name of string variable
     * @returns promise with string value
     */
    getString(variable) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.GET_STRING, {
            variable,
            callback: callbackID,
        });
        return this.deferredPromises[callbackID].value();
    }
    // ================== Int[] =================== //
    /**
     * Set the values of a global int array in ChucK
     * @param variable name of int array variable
     * @param values array of numbers
     */
    setIntArray(variable, values) {
        this.sendMessage(OutMessage.SET_INT_ARRAY, { variable, values });
    }
    /**
     * Get the values of a global int array in ChucK.
     * @param variable name of int array variable
     * @returns promise to array of numbers
     */
    getIntArray(variable) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.GET_INT_ARRAY, {
            variable,
            callback: callbackID,
        });
        return this.deferredPromises[callbackID].value();
    }
    /**
     * Set a single value (by index) in a global int array in ChucK
     * @param variable name of int array variable
     * @param index array index to set
     * @param value value to set
     */
    setIntArrayValue(variable, index, value) {
        this.sendMessage(OutMessage.SET_INT_ARRAY_VALUE, {
            variable,
            index,
            value,
        });
    }
    /**
     * Get a single value (by index) in a global int array in ChucK.
     * @param variable name of int array variable
     * @param index array index to get
     * @returns promise to the value
     */
    getIntArrayValue(variable, index) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.GET_INT_ARRAY_VALUE, {
            variable,
            index,
            callback: callbackID,
        });
        return this.deferredPromises[callbackID].value();
    }
    /**
     * Set the value (by key) of an associative int array in ChucK.
     * Note that "associative array" is ChucK's version of a dictionary with string keys mapping to values (see ChucK documentation).
     * @param variable name of global associative int array to set
     * @param key the key index of the associative array
     * @param value the new value
     */
    setAssociativeIntArrayValue(variable, key, value) {
        this.sendMessage(OutMessage.SET_ASSOCIATIVE_INT_ARRAY_VALUE, {
            variable,
            key,
            value,
        });
    }
    /**
     * Get the value (by key) of an associative int array in ChucK.
     * e.g. theChucK.getAssociateIntArrayValue("var", "key");
     * @param variable name of gobal associative int arry
     * @param key the key index to get
     * @returns deferred promise with associative int array value
     */
    getAssociativeIntArrayValue(variable, key) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.GET_ASSOCIATIVE_INT_ARRAY_VALUE, {
            variable,
            key,
            callback: callbackID,
        });
        return this.deferredPromises[callbackID].value();
    }
    // ================== Float[] =================== //
    /**
     * Set the values of a global float array in ChucK
     * @param variable name of float array
     * @param values values to set
     */
    setFloatArray(variable, values) {
        this.sendMessage(OutMessage.SET_FLOAT_ARRAY, { variable, values });
    }
    /**
     * Get the values of a global float array in ChucK.
     * e.g. theChucK.getFloatArray("var");
     * @param variable name of float array
     * @returns deferred promise of float values
     */
    getFloatArray(variable) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.GET_FLOAT_ARRAY, {
            variable,
            callback: callbackID,
        });
        return this.deferredPromises[callbackID].value();
    }
    /**
     * Set the float value of a global float array by index
     * @param variable name of float array
     * @param index index of element
     * @param value value to set
     */
    setFloatArrayValue(variable, index, value) {
        this.sendMessage(OutMessage.SET_FLOAT_ARRAY_VALUE, {
            variable,
            index,
            value,
        });
    }
    /**
     * Get the float value of a global float arry by index.
     * e.g. theChucK.getFloatArray("var", index);
     * @param variable name of float arry
     * @param index indfex of element
     * @returns deferred promise of float value
     */
    getFloatArrayValue(variable, index) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.GET_FLOAT_ARRAY_VALUE, {
            variable,
            index,
            callback: callbackID,
        });
        return this.deferredPromises[callbackID].value();
    }
    /**
     * Set the value (by key) of an associative float array in ChucK.
     * Note that "associative array" is ChucK's version of a dictionary with string keys mapping to values (see ChucK documentation).
     * @param variable name of global associative float array to set
     * @param key the key index of the associative array
     * @param value the new value
     */
    setAssociativeFloatArrayValue(variable, key, value) {
        this.sendMessage(OutMessage.SET_ASSOCIATIVE_FLOAT_ARRAY_VALUE, {
            variable,
            key,
            value,
        });
    }
    /**
     * Get the value (by key) of an associative float array in ChucK.
     * e.g. theChucK.getAssociateIntArrayValue("var", "key");
     * @param variable name of gobal associative float array
     * @param key the key index to get
     * @returns deferred promise with associative int array value
     */
    getAssociativeFloatArrayValue(variable, key) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.GET_ASSOCIATIVE_FLOAT_ARRAY_VALUE, {
            variable,
            key,
            callback: callbackID,
        });
        return this.deferredPromises[callbackID].value();
    }
    // ================== ChucK VM parameters =================== //
    /**
     * Set an internal ChucK VM integer parameter.
     * e.g. "SAMPLE_RATE", "INPUT_CHANNELS", "OUTPUT_CHANNELS", "IS_REAL_TIME_AUDIO_HINT", "TTY_COLOR".
     * @param name name of value to set
     * @param value value to set
     */
    setParamInt(name, value) {
        this.sendMessage(OutMessage.SET_PARAM_INT, { name, value });
    }
    /**
     * Get an internal ChucK VM integer parameter
     * e.g. "SAMPLE_RATE", "INPUT_CHANNELS", "OUTPUT_CHANNELS", "BUFFER_SIZE", "IS_REAL_TIME_AUDIO_HINT".
     * @param name name of value to get
     * @returns deferred promise with int value
     */
    getParamInt(name) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.GET_PARAM_INT, {
            name,
            callback: callbackID,
        });
        return this.deferredPromises[callbackID].value();
    }
    /**
     * Set an internal ChucK VM float parameter
     * @param name name of value to set
     * @param value value to set
     */
    setParamFloat(name, value) {
        this.sendMessage(OutMessage.SET_PARAM_FLOAT, { name, value });
    }
    /**
     * Get an internal ChucK VM float parameter
     * @param name name of value to get
     * @returns deferred promise with float value
     */
    getParamFloat(name) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.GET_PARAM_FLOAT, {
            name,
            callback: callbackID,
        });
        return this.deferredPromises[callbackID].value();
    }
    /**
     * Set an internal ChucK VM string parameter
     * @param name name of value to set
     * @param value value to set
     */
    setParamString(name, value) {
        this.sendMessage(OutMessage.SET_PARAM_STRING, { name, value });
    }
    /**
     * Get an internal ChucK VM string parameter
     * e.g. "VERSION"
     * @param name name of value to get e.g. ("VERSION")
     * @returns promise with string value
     */
    getParamString(name) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.GET_PARAM_STRING, {
            name,
            callback: callbackID,
        });
        return this.deferredPromises[callbackID].value();
    }
    // ================== ChucK VM =================== //
    /**
     * Get the current time of the ChucK VM
     * @returns promise to current Chuck time in samples
     */
    now() {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.GET_CHUCK_NOW, { callback: callbackID });
        return this.deferredPromises[callbackID].value();
    }
    // ================= Clear ====================== //
    /**
     * Remove all shreds and reset the WebChucK instance
     */
    clearChuckInstance() {
        this.sendMessage(OutMessage.CLEAR_INSTANCE);
    }
    /**
     * Reset all global variables in ChucK
     */
    clearGlobals() {
        this.sendMessage(OutMessage.CLEAR_GLOBALS);
    }
    // ================== Print Output ================== //
    /**
     * Override this method to redirect ChucK console output. Current default is console.log().
     * Set your own method to handle output or process it.
     * @param message Message that ChucK prints to console
     */
    chuckPrint(message) {
        // Default ChucK output destination
        console.log(message);
    }
    //--------------------------------------------------------
    // Internal Message Sending Communication
    //--------------------------------------------------------
    /**
     * Internal: Message sending from JS to ChucK
     */
    sendMessage(type, body) {
        const msgBody = body ? { type, ...body } : { type };
        this.port.postMessage(msgBody);
    }
    /**
     * Internal: Message receiving from ChucK to JS
     */
    receiveMessage(event) {
        const type = event.data.type;
        switch (type) {
            case InMessage.INIT_DONE:
                if (this.isReady && this.isReady.resolve) {
                    this.isReady.resolve();
                }
                break;
            case InMessage.PRINT:
                this.chuckPrint(event.data.message);
                break;
            case InMessage.EVENT:
                if (event.data.callback in this.eventCallbacks) {
                    const callback = this.eventCallbacks[event.data.callback];
                    callback();
                }
                break;
            case InMessage.INT:
            case InMessage.FLOAT:
            case InMessage.STRING:
            case InMessage.INT_ARRAY:
            case InMessage.FLOAT_ARRAY:
                if (event.data.callback in this.deferredPromises) {
                    const promise = this.deferredPromises[event.data.callback];
                    if (promise.resolve) {
                        promise.resolve(event.data.result);
                    }
                    delete this.deferredPromises[event.data.callback];
                }
                break;
            case InMessage.NEW_SHRED:
                if (event.data.callback in this.deferredPromises) {
                    const promise = this.deferredPromises[event.data.callback];
                    if (event.data.shred > 0) {
                        if (promise.resolve) {
                            promise.resolve(event.data.shred);
                        }
                    }
                    else {
                        if (promise.reject) {
                            promise.reject("Running code failed");
                        }
                    }
                }
                break;
            case InMessage.REPLACED_SHRED:
                if (event.data.callback in this.deferredPromises) {
                    const promise = this.deferredPromises[event.data.callback];
                    if (event.data.newShred > 0) {
                        if (promise.resolve) {
                            promise.resolve({
                                newShred: event.data.newShred,
                                oldShred: event.data.oldShred,
                            });
                        }
                    }
                    else {
                        if (promise.reject) {
                            promise.reject("Replacing code failed");
                        }
                    }
                }
                break;
            case InMessage.REMOVED_SHRED:
                if (event.data.callback in this.deferredPromises) {
                    const promise = this.deferredPromises[event.data.callback];
                    if (event.data.shred > 0) {
                        if (promise.resolve) {
                            promise.resolve(event.data.shred);
                        }
                    }
                    else {
                        if (promise.reject) {
                            promise.reject("Removing code failed");
                        }
                    }
                }
                break;
        }
    }
}
Chuck.chuckID = 1;

export { Chuck, DeferredPromise };
