import DeferredPromise from "./DeferredPromise";
import type { File, Filename } from "./utils";
/**
 * WebChucK: ChucK Web Audio Node class.
 * See init() to get started
 */
export default class Chuck extends window.AudioWorkletNode {
    private deferredPromises;
    private deferredPromiseCounter;
    private eventCallbacks;
    private eventCallbackCounter;
    private isReady;
    static chuckID: number;
    /**
     * Constructor for a ChucK Web Audio Node
     * @param preloadedFiles Files to preload into ChucK's filesystem
     * @param audioContext AudioContext to connect to
     * @param wasm WebChucK WebAssembly binary
     * @param numOutChannels Number of output channels
     * @returns WebChucK ChucK instance
     */
    constructor(preloadedFiles: File[], audioContext: AudioContext, wasm: ArrayBuffer, numOutChannels?: number);
    /**
     * Quick initialize a default instance of the ChucK Web Audio Node
     * @param filenamesToPreload Files to preload into ChucK's filesystem [{serverFileName: ./path, virtualFileName: path}]
     * @param audioContext AudioContext to connect connect WebChuck node to
     * @param numOutChannels Number of output channels
     * @returns
     */
    static init(filenamesToPreload: Filename[], audioContext?: AudioContext, numOutChannels?: number): Promise<Chuck>;
    /**
     * Private function for ChucK to handle execution of tasks.
     * Will create a Deferred Promise that wraps a task for WebChucK to execute
     * @returns callbackID to a an action for ChucK to perform
     */
    private nextDeferID;
    /**
     * Create a virtual file in ChucK's filesystem.
     * You should first locally fetch() the contents of your file, then pass the data to this method.
     * @param directory Virtual directory to create file in
     * @param filename Name of file to create
     * @param data Data that you want to write to the file
     */
    createFile(directory: string, filename: string, data: string | ArrayBuffer): void;
    /**
     * Automatically fetch and load in a file from a URL to ChucK's virtual filesystem
     * @param filename URL to file to fetch and load file
     */
    loadFile(filename: string): Promise<void>;
    /**
     * Run a string of ChucK code
     * @param code ChucK code string to be executed
     * @returns promise to the shred ID
     */
    runCode(code: string): DeferredPromise<unknown>;
    /**
     * Run a string of ChucK code using a different dac (unsure of functionality)
     * -tf (5/30/2023)
     * @param code ChucK code string to be executed
     * @param dacName dac for ChucK (??)
     * @returns promise to the shred ID
     */
    runCodeWithReplacementDac(code: string, dacName: string): DeferredPromise<unknown>;
    /**
     * Replace last running shred with string of ChucK code to execute
     * @param code ChucK code string to replace last Shred
     * @returns promise to shred ID
     */
    replaceCode(code: string): DeferredPromise<unknown>;
    /**
     * Replace last running shred with string of ChucK code to execute, to another dac (??)
     * @param code ChucK code string to replace last Shred
     * @param dacName dac for ChucK (??)
     * @returns promise to shred ID
     */
    replaceCodeWithReplacementDac(code: string, dacName: string): DeferredPromise<unknown>;
    /**
     * Remove the last running shred
     * @returns promise to the shred ID that was removed
     */
    removeLastCode(): DeferredPromise<unknown>;
    /**
     * Run a ChucK file that is already in the WebChucK virtual file system.
     * Note that the file must already have been loaded via preloadedFiles[], createFile(), or loadFile()
     * @param filename ChucK file to be run
     * @returns promise to shred ID
     */
    runFile(filename: string): DeferredPromise<unknown>;
    /**
     * Run a ChucK file that is already in the WebChucK virtual file system, on separate dac (??).
     * Note that the file must already have been loaded via preloadedFiles[], createFile(), or loadFile()
     * @param filename ChucK file to be run
     * @param dacName dac for ChucK (??)
     * @returns promise to shred ID
     */
    runFileWithReplacementDac(filename: string, dacName: string): DeferredPromise<unknown>;
    /**
     * Run a ChucK file that is already in the WebChucK virtual file system with arguments.
     * e.g. native equivalent of `chuck myFile:arg`
     * @param filename ChucK file to be run
     * @param colonSeparatedArgs arguments to pass to the file
     * @returns promise to shred ID
     */
    runFileWithArgs(filename: string, colonSeparatedArgs: string): DeferredPromise<unknown>;
    /**
     * Run a ChucK file that is already in the WebChucK virtual file system with arguments.
     * e.g. native equivalent of `chuck myFile:arg`
     * @param filename ChucK file to be run
     * @param colonSeparatedArgs arguments to pass to the file
     * @param dacName dac for ChucK (??)
     * @returns promise to shred ID
     */
    runFileWithArgsWithReplacementDac(filename: string, colonSeparatedArgs: string, dacName: string): DeferredPromise<unknown>;
    /**
     * Replace the last running shred with a file to execute.
     * Note that the file must already be in the WebChucK virtual file system via preloadedFiles[], createFile(), or loadFile()
     * @param filename file to be replace last
     * @returns promise to shred ID
     */
    replaceFile(filename: string): DeferredPromise<unknown>;
    /**
     * Replace the last running shred with a file to execute.
     * Note that the file must already be in the WebChucK virtual file system via preloadedFiles[], createFile(), or loadFile()
     * @param filename file to be replace last
     * @param dacName dac for ChucK (??)
     * @returns promise to shred ID
     */
    replaceFileWithReplacementDac(filename: string, dacName: string): DeferredPromise<unknown>;
    /**
     * Replace the last running shred with a file to execute, passing arguments.
     * Note that the file must already be in the WebChucK virtual file system via preloadedFiles[], createFile(), or loadFile()
     * @param filename file to be replace last running shred
     * @param colonSeparatedArgs arguments to pass in to file
     * @returns promise to shred ID
     */
    replaceFileWithArgs(filename: string, colonSeparatedArgs: string): DeferredPromise<unknown>;
    /**
     * Replace the last running shred with a file to execute, passing arguments, and dac.
     * Note that the file must already be in the WebChucK virtual file system via preloadedFiles[], createFile(), or loadFile()
     * @param filename file to be replace last running shred
     * @param colonSeparatedArgs arguments to pass in to file
     * @param dacName dac for ChucK (??)
     * @returns promise to shred ID
     */
    replaceFileWithArgsWithReplacementDac(filename: string, colonSeparatedArgs: string, dacName: string): DeferredPromise<unknown>;
    /**
     * Remove a shred from ChucK VM by ID
     * @param shred shred ID to be removed
     * @returns promise to whether Shred was removed successfully
     */
    removeShred(shred: number | string): DeferredPromise<unknown>;
    /**
     * Check if a shred from ChucK VM is running
     * @param shred which shred ID to check
     * @returns promise to whether Shred was removed successfully
     */
    isShredActive(shred: number | string): DeferredPromise<unknown>;
    /**
     * Signal a ChucK event, will wake the first waiting Shred
     * @param variable ChucK event variable to be signaled
     */
    signalEvent(variable: string): void;
    /**
     * Broadcast a ChucK event to all
     * @param variable ChucK event variable to be signaled
     */
    broadcastEvent(variable: string): void;
    /**
     * <more information needed>
     * @param variable
     * @param callback
     */
    listenForEventOnce(variable: string, callback: () => void): void;
    /**
     * <more information needed>
     * @param variable
     * @param callback
     * @returns
     */
    startListeningForEvent(variable: string, callback: () => void): number;
    /**
     * <more informatino needed>
     * @param variable
     * @param callbackID
     */
    stopListeningForEvent(variable: string, callbackID: number): void;
    /**
     * Set the value of a global int variable in ChucK
     * @param variable name of variable
     * @param value value to set
     */
    setInt(variable: string, value: number): void;
    /**
     * Get the value of a global int variable in ChucK.
     * Resolve the deferred promise with .value().
     * e.g. theChucK.getInt("var").value();
     * @param variable name of variable
     * @returns deferred promise with value of the variable
     */
    getInt(variable: string): DeferredPromise<unknown>;
    /**
     * Set the value of a global float variable in ChucK
     * @param variable name of variable
     * @param value value to set
     */
    setFloat(variable: string, value: number): void;
    /**
     * Get the value of a global float variable in ChucK.
     * Resolve the deferred promise with .value().
     * e.g. theChucK.getFloat("var").value();
     * @param variable name of variable
     * @returns deferred promise with value of the variable
     */
    getFloat(variable: string): DeferredPromise<unknown>;
    /**
     * Set the value of a global string variable in ChucK
     * @param variable name of string variable
     * @param value new string to set
     */
    setString(variable: string, value: string): void;
    /**
     * Get the value of a global string variable in ChucK.
     * Resolve the deferred promise with .value().
     * e.g. theChucK.getString("var").value();
     * @param variable name of string variable
     * @returns deferred promise with string value
     */
    getString(variable: string): DeferredPromise<unknown>;
    /**
     * Set the values of a global int array in ChucK
     * @param variable name of int array variable
     * @param values array of numbers
     */
    setIntArray(variable: string, values: number[]): void;
    /**
     * Get the values of a global int array in ChucK.
     * Resolve the deferred promise with .value().
     * e.g. theChucK.getIntArray("var").value();
     * @param variable name of int array variable
     * @returns deferred promise of array of numbers
     */
    getIntArray(variable: string): DeferredPromise<unknown>;
    /**
     * Set a single value (by index) in a global int array in ChucK
     * @param variable name of int array variable
     * @param index array index to set
     * @param value value to set
     */
    setIntArrayValue(variable: string, index: number, value: number[]): void;
    /**
     * Get a single value (by index) in a global int array in ChucK.
     * Resolve the deferred promise with .value().
     * e.g. theChucK.getIntArrayValue("var", index).value();
     * @param variable name of int array variable
     * @param index array index to get
     * @returns deferred promise for a number
     */
    getIntArrayValue(variable: string, index: number): DeferredPromise<unknown>;
    /**
     * Set the value (by key) of an associative int array in ChucK.
     * Note that "associative array" is ChucK's version of a dictionary with string keys mapping to values (see ChucK documentation).
     * @param variable name of global associative int array to set
     * @param key the key index of the associative array
     * @param value the new value
     */
    setAssociativeIntArrayValue(variable: string, key: string, value: number | string): void;
    /**
     * Get the value (by key) of an associative int array in ChucK.
     * Resolve the deferred promise with .value().
     * e.g. theChucK.getAssociateIntArrayValue("var", "key").value();
     * @param variable name of gobal associative int arry
     * @param key the key index to get
     * @returns deferred promise with associative int array value
     */
    getAssociativeIntArrayValue(variable: string, key: string): DeferredPromise<unknown>;
    /**
     * Set the values of a global float array in ChucK
     * @param variable name of float array
     * @param values values to set
     */
    setFloatArray(variable: string, values: number[]): void;
    /**
     * Get the values of a global float array in ChucK.
     * Resolve the deferred promise with .value().
     * e.g. theChucK.getFloatArray("var").value();
     * @param variable name of float array
     * @returns deferred promise of float values
     */
    getFloatArray(variable: string): DeferredPromise<unknown>;
    /**
     * Set the float value of a global float array by index
     * @param variable name of float array
     * @param index index of element
     * @param value value to set
     */
    setFloatArrayValue(variable: string, index: number, value: number): void;
    /**
     * Get the float value of a global float arry by index.
     * Resolve the deferred promise with .value().
     * e.g. theChucK.getFloatArray("var", index).value();
     * @param variable name of float arry
     * @param index indfex of element
     * @returns deferred promise of float value
     */
    getFloatArrayValue(variable: string, index: number): DeferredPromise<unknown>;
    /**
     * Set the value (by key) of an associative float array in ChucK.
     * Note that "associative array" is ChucK's version of a dictionary with string keys mapping to values (see ChucK documentation).
     * @param variable name of global associative float array to set
     * @param key the key index of the associative array
     * @param value the new value
     */
    setAssociativeFloatArrayValue(variable: string, key: string, value: number): void;
    /**
     * Get the value (by key) of an associative float array in ChucK.
     * Resolve the deferred promise with .value().
     * e.g. theChucK.getAssociateIntArrayValue("var", "key").value();
     * @param variable name of gobal associative float arry
     * @param key the key index to get
     * @returns deferred promise with associative int array value
     */
    getAssociativeFloatArrayValue(variable: string, key: string): DeferredPromise<unknown>;
    /**
     * Remove all shreds and reset the WebChucK instance
     */
    clearChuckInstance(): void;
    /**
     * Reset all global variables in ChucK
     */
    clearGlobals(): void;
    /**
     * Override this method to redirect ChucK console output. Current default is console.log().
     * Set your own method to handle output or process it.
     * @param message Message that ChucK prints to console
     */
    chuckPrint(message: string): void;
    /**
     * Internal: Communicate via JS to WebChucK WASM
     */
    private sendMessage;
    /**
     * Internal: Communicate via JS to WebChucK WASM
     */
    private receiveMessage;
}
