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

import DeferredPromise from "./DeferredPromise";
import { defer, loadWasm, preloadFiles } from "./utils";
import type { File, Filename } from "./utils";
import { InMessage, OutMessage } from "./enums";

// Create a Record type for deferredPromises and eventCallbacks
type DeferredPromisesMap = Record<number, DeferredPromise<unknown>>;
type EventCallbacksMap = Record<number, () => void>;

export default class Chuck extends window.AudioWorkletNode {
    private deferredPromises: DeferredPromisesMap = {};
    private deferredPromiseCounter: number = 0;
    private eventCallbacks: EventCallbacksMap = {};
    private eventCallbackCounter: number = 0;
    private isReady: DeferredPromise<void> = defer();

    static chuckID: number = 1;

    constructor(
        preloadedFiles: File[],
        audioContext: AudioContext,
        wasm: ArrayBuffer,
        numOutChannels: number = 2
    ) {
        super(
            audioContext,
            `theChuck-${Chuck.chuckID}`,
            {
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
            }
        );
        this.port.onmessage = this.receiveMessage.bind(this);
        this.onprocessorerror = (e) => console.error(e);
        Chuck.chuckID++;
    }

    static async init(filenamesToPreload: Filename[], audioContext?: AudioContext): Promise<Chuck> {
        const wasm = await loadWasm();

        if (typeof audioContext === "undefined") {
            audioContext = new AudioContext();
        }

        if (audioContext.state === "suspended") {
            await audioContext.resume();
        }

        await audioContext.audioWorklet.addModule(
            "https://chuck.stanford.edu/webchuck/src/webchuck.js"
        );
        const preloadedFiles = await preloadFiles(filenamesToPreload);
        const chuck = new Chuck(preloadedFiles, audioContext, wasm);
        await chuck.isReady.promise;
        return chuck;
    }

    private nextDeferID(): number {
        const callbackID = this.deferredPromiseCounter++;
        this.deferredPromises[callbackID] = defer();
        return callbackID;
    }

    // ================== Filesystem ===================== //
    public createFile(directory: string, filename: string, data: string) {
        this.sendMessage(OutMessage.LOAD_FILE, {
            directory,
            filename,
            data,
        });
    }

    // ================== Run/Replace Code ================== //
    public runCode(code: string) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.RUN_CODE, { callback: callbackID, code });
        return this.deferredPromises[callbackID];
    }

    public runCodeWithReplacementDac(code: string, dacName: string) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.RUN_CODE_WITH_REPLACEMENT_DAC, {
            callback: callbackID,
            code,
            dac_name: dacName,
        });
        return this.deferredPromises[callbackID];
    }

    public replaceCode(code: string) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.REPLACE_CODE, {
            callback: callbackID,
            code,
        });
        return this.deferredPromises[callbackID];
    }

    public replaceCodeWithReplacementDac(code: string, dacName: string) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.REPLACE_CODE_WITH_REPLACEMENT_DAC, {
            callback: callbackID,
            code,
            dac_name: dacName,
        });
        return this.deferredPromises[callbackID];
    }

    public removeLastCode() {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.REMOVE_LAST_CODE, { callback: callbackID });
        return this.deferredPromises[callbackID];
    }

    // ================== Run/Replace File ================== //
    public runFile(filename: string) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.RUN_FILE, {
            callback: callbackID,
            filename,
        });
        return this.deferredPromises[callbackID];
    }

    public runFileWithReplacementDac(filename: string, dacName: string) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.RUN_FILE_WITH_REPLACEMENT_DAC, {
            callback: callbackID,
            dac_name: dacName,
            filename,
        });
        return this.deferredPromises[callbackID];
    }

    public runFileWithArgs(filename: string, colonSeparatedArgs: string) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.RUN_FILE_WITH_ARGS, {
            callback: callbackID,
            colon_separated_args: colonSeparatedArgs,
            filename,
        });
        return this.deferredPromises[callbackID];
    }

    public runFileWithArgsWithReplacementDac(
        filename: string,
        colonSeparatedArgs: string,
        dacName: string
    ) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.RUN_FILE_WITH_ARGS, {
            callback: callbackID,
            colon_separated_args: colonSeparatedArgs,
            dac_name: dacName,
            filename,
        });
        return this.deferredPromises[callbackID];
    }

    public replaceFile(filename: string) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.REPLACE_FILE, {
            callback: callbackID,
            filename,
        });
        return this.deferredPromises[callbackID];
    }

    public replaceFileWithReplacementDac(filename: string, dacName: string) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.REPLACE_FILE_WITH_REPLACEMENT_DAC, {
            callback: callbackID,
            dac_name: dacName,
            filename,
        });
        return this.deferredPromises[callbackID];
    }

    public replaceFileWithArgs(filename: string, colonSeparatedArgs: string) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.REPLACE_FILE_WITH_ARGS, {
            callback: callbackID,
            colon_separated_args: colonSeparatedArgs,
            filename,
        });
        return this.deferredPromises[callbackID];
    }

    public replaceFileWithArgsWithReplacementDac(
        filename: string,
        colonSeparatedArgs: string,
        dacName: string
    ) {
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
    public removeShred(shred: string) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.REMOVE_SHRED, {
            shred,
            callback: callbackID,
        });
        return this.deferredPromises[callbackID];
    }

    public isShredActive(shred: string) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.IS_SHRED_ACTIVE, {
            shred,
            callback: callbackID,
        });
        return this.deferredPromises[callbackID];
    }

    // ================== Event =================== //
    public signalEvent(variable: string) {
        this.sendMessage(OutMessage.SIGNAL_EVENT, { variable });
    }

    public broadcastEvent(variable: string) {
        this.sendMessage(OutMessage.BROADCAST_EVENT, { variable });
    }

    public listenForEventOnce(variable: string, callback: () => void) {
        const callbackID = this.eventCallbackCounter++;
        this.eventCallbacks[callbackID] = callback;
        this.sendMessage(OutMessage.LISTEN_FOR_EVENT_ONCE, {
            variable,
            callback: callbackID,
        });
    }

    public startListeningForEvent(variable: string, callback: () => void) {
        const callbackID = this.eventCallbackCounter++;
        this.eventCallbacks[callbackID] = callback;
        this.sendMessage(OutMessage.START_LISTENING_FOR_EVENT, {
            variable,
            callback: callbackID,
        });
        return callbackID;
    }

    public stopListeningForEvent(variable: string, callbackID: number) {
        this.sendMessage(OutMessage.STOP_LISTENING_FOR_EVENT, {
            variable,
            callback: callbackID,
        });
    }

    // ================== Int, Float, String ============= //
    public setInt(variable: string, value: number) {
        this.sendMessage(OutMessage.SET_INT, { variable, value });
    }

    public getInt(variable: string) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.GET_INT, {
            variable,
            callback: callbackID,
        });
        return this.deferredPromises[callbackID];
    }

    public setFloat(variable: string, value: number) {
        this.sendMessage(OutMessage.SET_FLOAT, { variable, value });
    }

    public getFloat(variable: string) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.GET_FLOAT, {
            variable,
            callback: callbackID,
        });
        return this.deferredPromises[callbackID];
    }

    public setString(variable: string, value: string) {
        this.sendMessage(OutMessage.SET_STRING, { variable, value });
    }

    public getString(variable: string) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.GET_STRING, {
            variable,
            callback: callbackID,
        });
        return this.deferredPromises[callbackID];
    }

    // ================== Int[] =================== //
    public setIntArray(variable: string, values: number[]) {
        this.sendMessage(OutMessage.SET_INT_ARRAY, { variable, values });
    }

    public getIntArray(variable: string) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.GET_INT_ARRAY, {
            variable,
            callback: callbackID,
        });
        return this.deferredPromises[callbackID];
    }

    public setIntArrayValue(variable: string, index: number, value: number[]) {
        this.sendMessage(OutMessage.SET_INT_ARRAY_VALUE, {
            variable,
            index,
            value,
        });
    }

    public getIntArrayValue(variable: string, index: number) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.GET_INT_ARRAY_VALUE, {
            variable,
            index,
            callback: callbackID,
        });
        return this.deferredPromises[callbackID];
    }

    public setAssociativeIntArrayValue(
        variable: string,
        key: string,
        value: string
    ) {
        this.sendMessage(OutMessage.SET_ASSOCIATIVE_INT_ARRAY_VALUE, {
            variable,
            key,
            value,
        });
    }

    public getAssociativeIntArrayValue(variable: string, key: string) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.GET_ASSOCIATIVE_INT_ARRAY_VALUE, {
            variable,
            key,
            callback: callbackID,
        });
        return this.deferredPromises[callbackID];
    }

    // ================== Float[] =================== //
    public setFloatArray(variable: string, values: number[]) {
        this.sendMessage(OutMessage.SET_FLOAT_ARRAY, { variable, values });
    }

    public getFloatArray(variable: string) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.GET_FLOAT_ARRAY, {
            variable,
            callback: callbackID,
        });
        return this.deferredPromises[callbackID];
    }

    public setFloatArrayValue(variable: string, index: number, value: number) {
        this.sendMessage(OutMessage.SET_FLOAT_ARRAY_VALUE, {
            variable,
            index,
            value,
        });
    }

    public getFloatArrayValue(variable: string, index: number) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.GET_FLOAT_ARRAY_VALUE, {
            variable,
            index,
            callback: callbackID,
        });
        return this.deferredPromises[callbackID];
    }

    public setAssociativeFloatArrayValue(
        variable: string,
        key: string,
        value: number
    ) {
        this.sendMessage(OutMessage.SET_ASSOCIATIVE_FLOAT_ARRAY_VALUE, {
            variable,
            key,
            value,
        });
    }

    public getAssociativeFloatArrayValue(variable: string, key: string) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.GET_ASSOCIATIVE_FLOAT_ARRAY_VALUE, {
            variable,
            key,
            callback: callbackID,
        });
        return this.deferredPromises[callbackID];
    }

    // ================= Clear ====================== //
    public clearChuckInstance() {
        this.sendMessage(OutMessage.CLEAR_INSTANCE);
    }

    public clearGlobals() {
        this.sendMessage(OutMessage.CLEAR_GLOBALS);
    }

    // ================== Print Output ================== //
    public chuckPrint(message: string) {
        // override me to handle printing, this is just a default
        console.log(message);
    }

    // Private
    private sendMessage(type: OutMessage, body?: { [prop: string]: unknown }) {
        const msgBody = body ? { type, ...body } : { type };
        this.port.postMessage(msgBody);
    }

    private receiveMessage(event: MessageEvent) {
        const type: InMessage = event.data.type;

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
                    } else {
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
                    } else {
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
                    } else {
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
