import type { Filename } from "./utils";
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
     * Internal constructor for a ChucK AudioWorklet Web Audio Node
     * @param preloadedFiles Array of Files to preload into ChucK's filesystem
     * @param audioContext AudioContext to connect to
     * @param wasm WebChucK WebAssembly binary
     * @param numOutChannels Number of output channels
     * @returns ChucK AudioWorklet Node
     */
    private constructor();
    /**
     * Call me to initialize a ChucK Web Audio Node. Generally you only need one instance of this.
     * @example theChuck = await Chuck.init([]); // initialize ChucK with no preloaded files
     * @example theChuck = await Chuck.init([{serverFilename: "./filename.ck", virtualFilename: "filename.ck"}...]); // initialize ChucK with preloaded files
     * @param filenamesToPreload Array of Files to preload into ChucK's filesystem [{serverFilename: "./filename", virtualFilename: "filename"}...]
     * @param audioContext Optional parameter if you want to use your own AudioContext. Otherwise, a new one will be created and the node will be connected to the output destination.
     * @param numOutChannels Optional number of output channels. Default is 2 and Web Audio supports up to 32.
     * @param whereIsChuck Optional url to your src folder containing webchuck.js and webchuck.wasm
     * @returns WebChucK ChucK instance
     */
    static init(filenamesToPreload: Filename[], audioContext?: AudioContext, numOutChannels?: number, whereIsChuck?: string): Promise<Chuck>;
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
     * @param url URL to a file to fetch and load file
     */
    loadFile(url: string): Promise<void>;
    /**
     * Run a string of ChucK code
     * @param code ChucK code string to be executed
     * @returns promise to the shred ID
     */
    runCode(code: string): Promise<unknown>;
    /**
     * Run a string of ChucK code using a different dac (unsure of functionality)
     * -tf (5/30/2023)
     * @param code ChucK code string to be executed
     * @param dacName dac for ChucK (??)
     * @returns promise to the shred ID
     */
    runCodeWithReplacementDac(code: string, dacName: string): Promise<unknown>;
    /**
     * Replace last running shred with string of ChucK code to execute
     * @param code ChucK code string to replace last Shred
     * @returns promise to shred ID that is removed
     */
    replaceCode(code: string): Promise<unknown>;
    /**
     * Replace last running shred with string of ChucK code to execute, to another dac (??)
     * @param code ChucK code string to replace last Shred
     * @param dacName dac for ChucK (??)
     * @returns promise to shred ID
     */
    replaceCodeWithReplacementDac(code: string, dacName: string): Promise<unknown>;
    /**
     * Remove the last running shred
     * @returns promise to the shred ID that was removed
     */
    removeLastCode(): Promise<unknown>;
    /**
     * Run a ChucK file that is already in the WebChucK virtual file system.
     * Note that the file must already have been loaded via preloadedFiles[], createFile(), or loadFile()
     * @param filename ChucK file to be run
     * @returns promise to shred ID
     */
    runFile(filename: string): Promise<unknown>;
    /**
     * Run a ChucK file that is already in the WebChucK virtual file system, on separate dac (??).
     * Note that the file must already have been loaded via preloadedFiles[], createFile(), or loadFile()
     * @param filename ChucK file to be run
     * @param dacName dac for ChucK (??)
     * @returns promise to shred ID
     */
    runFileWithReplacementDac(filename: string, dacName: string): Promise<unknown>;
    /**
     * Run a ChucK file that is already in the WebChucK virtual file system with arguments.
     * e.g. native equivalent of `chuck myFile:arg`
     * @param filename ChucK file to be run
     * @param colonSeparatedArgs arguments to pass to the file
     * @returns promise to shred ID
     */
    runFileWithArgs(filename: string, colonSeparatedArgs: string): Promise<unknown>;
    /**
     * Run a ChucK file that is already in the WebChucK virtual file system with arguments.
     * e.g. native equivalent of `chuck myFile:arg`
     * @param filename ChucK file to be run
     * @param colonSeparatedArgs arguments to pass to the file
     * @param dacName dac for ChucK (??)
     * @returns promise to shred ID
     */
    runFileWithArgsWithReplacementDac(filename: string, colonSeparatedArgs: string, dacName: string): Promise<unknown>;
    /**
     * Replace the last running shred with a file to execute.
     * Note that the file must already be in the WebChucK virtual file system via preloadedFiles[], createFile(), or loadFile()
     * @param filename file to be replace last
     * @returns promise to shred ID
     */
    replaceFile(filename: string): Promise<unknown>;
    /**
     * Replace the last running shred with a file to execute.
     * Note that the file must already be in the WebChucK virtual file system via preloadedFiles[], createFile(), or loadFile()
     * @param filename file to be replace last
     * @param dacName dac for ChucK (??)
     * @returns promise to shred ID
     */
    replaceFileWithReplacementDac(filename: string, dacName: string): Promise<unknown>;
    /**
     * Replace the last running shred with a file to execute, passing arguments.
     * Note that the file must already be in the WebChucK virtual file system via preloadedFiles[], createFile(), or loadFile()
     * @param filename file to be replace last running shred
     * @param colonSeparatedArgs arguments to pass in to file
     * @returns promise to shred ID
     */
    replaceFileWithArgs(filename: string, colonSeparatedArgs: string): Promise<unknown>;
    /**
     * Replace the last running shred with a file to execute, passing arguments, and dac.
     * Note that the file must already be in the WebChucK virtual file system via preloadedFiles[], createFile(), or loadFile()
     * @param filename file to be replace last running shred
     * @param colonSeparatedArgs arguments to pass in to file
     * @param dacName dac for ChucK (??)
     * @returns promise to shred ID
     */
    replaceFileWithArgsWithReplacementDac(filename: string, colonSeparatedArgs: string, dacName: string): Promise<unknown>;
    /**
     * Remove a shred from ChucK VM by ID
     * @param shred shred ID to be removed
     * @returns promise to whether Shred was removed successfully
     */
    removeShred(shred: number | string): Promise<unknown>;
    /**
     * Check if a shred from ChucK VM is running
     * @param shred which shred ID to check
     * @returns promise to whether Shred was is running
     */
    isShredActive(shred: number | string): Promise<unknown>;
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
     * <more information needed>
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
     * @param variable name of variable
     * @returns promise with value of the variable
     */
    getInt(variable: string): Promise<unknown>;
    /**
     * Set the value of a global float variable in ChucK
     * @param variable name of variable
     * @param value value to set
     */
    setFloat(variable: string, value: number): void;
    /**
     * Get the value of a global float variable in ChucK.
     * @param variable name of variable
     * @returns promise with value of the variable
     */
    getFloat(variable: string): Promise<unknown>;
    /**
     * Set the value of a global string variable in ChucK
     * @param variable name of string variable
     * @param value new string to set
     */
    setString(variable: string, value: string): void;
    /**
     * Get the value of a global string variable in ChucK.
     * @param variable name of string variable
     * @returns promise with string value
     */
    getString(variable: string): Promise<unknown>;
    /**
     * Set the values of a global int array in ChucK
     * @param variable name of int array variable
     * @param values array of numbers
     */
    setIntArray(variable: string, values: number[]): void;
    /**
     * Get the values of a global int array in ChucK.
     * @param variable name of int array variable
     * @returns promise to array of numbers
     */
    getIntArray(variable: string): Promise<unknown>;
    /**
     * Set a single value (by index) in a global int array in ChucK
     * @param variable name of int array variable
     * @param index array index to set
     * @param value value to set
     */
    setIntArrayValue(variable: string, index: number, value: number[]): void;
    /**
     * Get a single value (by index) in a global int array in ChucK.
     * @param variable name of int array variable
     * @param index array index to get
     * @returns promise to the value
     */
    getIntArrayValue(variable: string, index: number): Promise<unknown>;
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
     * e.g. theChucK.getAssociateIntArrayValue("var", "key");
     * @param variable name of gobal associative int arry
     * @param key the key index to get
     * @returns deferred promise with associative int array value
     */
    getAssociativeIntArrayValue(variable: string, key: string): Promise<unknown>;
    /**
     * Set the values of a global float array in ChucK
     * @param variable name of float array
     * @param values values to set
     */
    setFloatArray(variable: string, values: number[]): void;
    /**
     * Get the values of a global float array in ChucK.
     * e.g. theChucK.getFloatArray("var");
     * @param variable name of float array
     * @returns deferred promise of float values
     */
    getFloatArray(variable: string): Promise<unknown>;
    /**
     * Set the float value of a global float array by index
     * @param variable name of float array
     * @param index index of element
     * @param value value to set
     */
    setFloatArrayValue(variable: string, index: number, value: number): void;
    /**
     * Get the float value of a global float arry by index.
     * e.g. theChucK.getFloatArray("var", index);
     * @param variable name of float arry
     * @param index indfex of element
     * @returns deferred promise of float value
     */
    getFloatArrayValue(variable: string, index: number): Promise<unknown>;
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
     * e.g. theChucK.getAssociateIntArrayValue("var", "key");
     * @param variable name of gobal associative float array
     * @param key the key index to get
     * @returns deferred promise with associative int array value
     */
    getAssociativeFloatArrayValue(variable: string, key: string): Promise<unknown>;
    /**
     * Set an internal ChucK VM integer parameter.
     * e.g. "SAMPLE_RATE", "INPUT_CHANNELS", "OUTPUT_CHANNELS", "IS_REAL_TIME_AUDIO_HINT", "TTY_COLOR".
     * @param name name of value to set
     * @param value value to set
     */
    setParamInt(name: string, value: number): void;
    /**
     * Get an internal ChucK VM integer parameter
     * e.g. "SAMPLE_RATE", "INPUT_CHANNELS", "OUTPUT_CHANNELS", "BUFFER_SIZE", "IS_REAL_TIME_AUDIO_HINT".
     * @param name name of value to get
     * @returns deferred promise with int value
     */
    getParamInt(name: string): Promise<unknown>;
    /**
     * Set an internal ChucK VM float parameter
     * @param name name of value to set
     * @param value value to set
     */
    setParamFloat(name: string, value: number): void;
    /**
     * Get an internal ChucK VM float parameter
     * @param name name of value to get
     * @returns deferred promise with float value
     */
    getParamFloat(name: string): Promise<unknown>;
    /**
     * Set an internal ChucK VM string parameter
     * @param name name of value to set
     * @param value value to set
     */
    setParamString(name: string, value: string): void;
    /**
     * Get an internal ChucK VM string parameter
     * e.g. "VERSION"
     * @param name name of value to get e.g. ("VERSION")
     * @returns promise with string value
     */
    getParamString(name: string): Promise<unknown>;
    /**
     * Get the current time of the ChucK VM
     * @returns promise to current Chuck time in samples
     */
    now(): Promise<unknown>;
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
     * Internal: Message sending from JS to ChucK
     */
    private sendMessage;
    /**
     * Internal: Message receiving from ChucK to JS
     */
    private receiveMessage;
}
