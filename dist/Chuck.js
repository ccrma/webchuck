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
import { defer, loadWasm, preloadFiles } from "./utils";
import { InMessage, OutMessage } from "./enums";
export default class Chuck extends window.AudioWorkletNode {
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
    static async init(filenamesToPreload, audioContext, numOutChannels = 2) {
        const wasm = await loadWasm();
        if (typeof audioContext === "undefined") {
            audioContext = new AudioContext();
        }
        if (audioContext.state === "suspended") {
            await audioContext.resume();
        }
        await audioContext.audioWorklet.addModule("https://chuck.stanford.edu/webchuck/src/webchuck.js");
        const preloadedFiles = await preloadFiles(filenamesToPreload);
        const chuck = new Chuck(preloadedFiles, audioContext, wasm, numOutChannels);
        chuck.connect(audioContext.destination);
        await chuck.isReady.promise;
        return chuck;
    }
    nextDeferID() {
        const callbackID = this.deferredPromiseCounter++;
        this.deferredPromises[callbackID] = defer();
        return callbackID;
    }
    // ================== Filesystem ===================== //
    createFile(directory, filename, data) {
        this.sendMessage(OutMessage.LOAD_FILE, {
            directory,
            filename,
            data,
        });
    }
    // ================== Run/Replace Code ================== //
    runCode(code) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.RUN_CODE, { callback: callbackID, code });
        return this.deferredPromises[callbackID];
    }
    runCodeWithReplacementDac(code, dacName) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.RUN_CODE_WITH_REPLACEMENT_DAC, {
            callback: callbackID,
            code,
            dac_name: dacName,
        });
        return this.deferredPromises[callbackID];
    }
    replaceCode(code) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.REPLACE_CODE, {
            callback: callbackID,
            code,
        });
        return this.deferredPromises[callbackID];
    }
    replaceCodeWithReplacementDac(code, dacName) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.REPLACE_CODE_WITH_REPLACEMENT_DAC, {
            callback: callbackID,
            code,
            dac_name: dacName,
        });
        return this.deferredPromises[callbackID];
    }
    removeLastCode() {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.REMOVE_LAST_CODE, { callback: callbackID });
        return this.deferredPromises[callbackID];
    }
    // ================== Run/Replace File ================== //
    runFile(filename) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.RUN_FILE, {
            callback: callbackID,
            filename,
        });
        return this.deferredPromises[callbackID];
    }
    runFileWithReplacementDac(filename, dacName) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.RUN_FILE_WITH_REPLACEMENT_DAC, {
            callback: callbackID,
            dac_name: dacName,
            filename,
        });
        return this.deferredPromises[callbackID];
    }
    runFileWithArgs(filename, colonSeparatedArgs) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.RUN_FILE_WITH_ARGS, {
            callback: callbackID,
            colon_separated_args: colonSeparatedArgs,
            filename,
        });
        return this.deferredPromises[callbackID];
    }
    runFileWithArgsWithReplacementDac(filename, colonSeparatedArgs, dacName) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.RUN_FILE_WITH_ARGS, {
            callback: callbackID,
            colon_separated_args: colonSeparatedArgs,
            dac_name: dacName,
            filename,
        });
        return this.deferredPromises[callbackID];
    }
    replaceFile(filename) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.REPLACE_FILE, {
            callback: callbackID,
            filename,
        });
        return this.deferredPromises[callbackID];
    }
    replaceFileWithReplacementDac(filename, dacName) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.REPLACE_FILE_WITH_REPLACEMENT_DAC, {
            callback: callbackID,
            dac_name: dacName,
            filename,
        });
        return this.deferredPromises[callbackID];
    }
    replaceFileWithArgs(filename, colonSeparatedArgs) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.REPLACE_FILE_WITH_ARGS, {
            callback: callbackID,
            colon_separated_args: colonSeparatedArgs,
            filename,
        });
        return this.deferredPromises[callbackID];
    }
    replaceFileWithArgsWithReplacementDac(filename, colonSeparatedArgs, dacName) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.REPLACE_FILE_WITH_ARGS, {
            callback: callbackID,
            colon_separated_args: colonSeparatedArgs,
            dac_name: dacName,
            filename,
        });
        return this.deferredPromises[callbackID];
    }
    // ================== Shred =================== //
    removeShred(shred) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.REMOVE_SHRED, {
            shred,
            callback: callbackID,
        });
        return this.deferredPromises[callbackID];
    }
    isShredActive(shred) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.IS_SHRED_ACTIVE, {
            shred,
            callback: callbackID,
        });
        return this.deferredPromises[callbackID];
    }
    // ================== Event =================== //
    signalEvent(variable) {
        this.sendMessage(OutMessage.SIGNAL_EVENT, { variable });
    }
    broadcastEvent(variable) {
        this.sendMessage(OutMessage.BROADCAST_EVENT, { variable });
    }
    listenForEventOnce(variable, callback) {
        const callbackID = this.eventCallbackCounter++;
        this.eventCallbacks[callbackID] = callback;
        this.sendMessage(OutMessage.LISTEN_FOR_EVENT_ONCE, {
            variable,
            callback: callbackID,
        });
    }
    startListeningForEvent(variable, callback) {
        const callbackID = this.eventCallbackCounter++;
        this.eventCallbacks[callbackID] = callback;
        this.sendMessage(OutMessage.START_LISTENING_FOR_EVENT, {
            variable,
            callback: callbackID,
        });
        return callbackID;
    }
    stopListeningForEvent(variable, callbackID) {
        this.sendMessage(OutMessage.STOP_LISTENING_FOR_EVENT, {
            variable,
            callback: callbackID,
        });
    }
    // ================== Int, Float, String ============= //
    setInt(variable, value) {
        this.sendMessage(OutMessage.SET_INT, { variable, value });
    }
    getInt(variable) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.GET_INT, {
            variable,
            callback: callbackID,
        });
        return this.deferredPromises[callbackID];
    }
    setFloat(variable, value) {
        this.sendMessage(OutMessage.SET_FLOAT, { variable, value });
    }
    getFloat(variable) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.GET_FLOAT, {
            variable,
            callback: callbackID,
        });
        return this.deferredPromises[callbackID];
    }
    setString(variable, value) {
        this.sendMessage(OutMessage.SET_STRING, { variable, value });
    }
    getString(variable) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.GET_STRING, {
            variable,
            callback: callbackID,
        });
        return this.deferredPromises[callbackID];
    }
    // ================== Int[] =================== //
    setIntArray(variable, values) {
        this.sendMessage(OutMessage.SET_INT_ARRAY, { variable, values });
    }
    getIntArray(variable) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.GET_INT_ARRAY, {
            variable,
            callback: callbackID,
        });
        return this.deferredPromises[callbackID];
    }
    setIntArrayValue(variable, index, value) {
        this.sendMessage(OutMessage.SET_INT_ARRAY_VALUE, {
            variable,
            index,
            value,
        });
    }
    getIntArrayValue(variable, index) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.GET_INT_ARRAY_VALUE, {
            variable,
            index,
            callback: callbackID,
        });
        return this.deferredPromises[callbackID];
    }
    setAssociativeIntArrayValue(variable, key, value) {
        this.sendMessage(OutMessage.SET_ASSOCIATIVE_INT_ARRAY_VALUE, {
            variable,
            key,
            value,
        });
    }
    getAssociativeIntArrayValue(variable, key) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.GET_ASSOCIATIVE_INT_ARRAY_VALUE, {
            variable,
            key,
            callback: callbackID,
        });
        return this.deferredPromises[callbackID];
    }
    // ================== Float[] =================== //
    setFloatArray(variable, values) {
        this.sendMessage(OutMessage.SET_FLOAT_ARRAY, { variable, values });
    }
    getFloatArray(variable) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.GET_FLOAT_ARRAY, {
            variable,
            callback: callbackID,
        });
        return this.deferredPromises[callbackID];
    }
    setFloatArrayValue(variable, index, value) {
        this.sendMessage(OutMessage.SET_FLOAT_ARRAY_VALUE, {
            variable,
            index,
            value,
        });
    }
    getFloatArrayValue(variable, index) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.GET_FLOAT_ARRAY_VALUE, {
            variable,
            index,
            callback: callbackID,
        });
        return this.deferredPromises[callbackID];
    }
    setAssociativeFloatArrayValue(variable, key, value) {
        this.sendMessage(OutMessage.SET_ASSOCIATIVE_FLOAT_ARRAY_VALUE, {
            variable,
            key,
            value,
        });
    }
    getAssociativeFloatArrayValue(variable, key) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.GET_ASSOCIATIVE_FLOAT_ARRAY_VALUE, {
            variable,
            key,
            callback: callbackID,
        });
        return this.deferredPromises[callbackID];
    }
    // ================= Clear ====================== //
    clearChuckInstance() {
        this.sendMessage(OutMessage.CLEAR_INSTANCE);
    }
    clearGlobals() {
        this.sendMessage(OutMessage.CLEAR_GLOBALS);
    }
    // ================== Print Output ================== //
    chuckPrint(message) {
        // override me to handle printing, this is just a default
        console.log(message);
    }
    // Private
    sendMessage(type, body) {
        const msgBody = body ? { type, ...body } : { type };
        this.port.postMessage(msgBody);
    }
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
            default:
                break;
        }
    }
}
Chuck.chuckID = 1;
