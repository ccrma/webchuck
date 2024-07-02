import type { Filename } from "./utils";
/**
 * WebChucK: ChucK Web Audio Node class.
 * Use **{@link init | Init}** to create a ChucK instance
 */
export default class Chuck extends window.AudioWorkletNode {
    private deferredPromises;
    private deferredPromiseCounter;
    private eventCallbacks;
    private eventCallbackCounter;
    private isReady;
    /** @internal */
    static chuckID: number;
    /** @internal */
    static chuginsToLoad: Filename[];
    private chugins;
    /**
     * Private internal constructor for a ChucK AudioWorklet Web Audio Node. Use public **{@link init| Init}** to create a ChucK instance.
     * @param preloadedFiles Array of Files to preload into ChucK's filesystem
     * @param audioContext AudioContext to connect to
     * @param wasm WebChucK WebAssembly binary
     * @param numOutChannels Number of output channels
     * @returns ChucK AudioWorklet Node
     */
    private constructor();
    /**
     * Initialize a ChucK Web Audio Node. By default, a new AudioContext is created and ChucK is connected to the AudioContext destination.
     * **Note:** Init is overloaded to allow for custom AudioContext, custom number of output channels, and custom location of `whereIsChuck`. Skip an argument by passing in `undefined`.
     *
     * @example
     * ```ts
     * // default initialization
     * theChuck = await Chuck.init([]);
     * ```
     * @example
     * ```ts
     * // Initialize ChucK with a list of files to preload
     * theChuck = await Chuck.init([{ serverFilename: "./path/filename.wav", virtualFilename: "filename.wav" }...]);
     * ```
     *
     * @example
     * ```ts
     * // Initialize ChucK with a local audioContext, connect ChucK to the context destination
     * var audioContext = new AudioContext();
     * theChuck = await Chuck.init([], audioContext));
     * theChuck.connect(audioContext.destination);
     * ```
     *
     * @example
     * ```ts
     * // Initialize ChucK using local webchuck.js and webchuck.wasm files in "./src"
     * theChuck = await Chuck.init([], undefined, undefined, "./src");
     * ```
     *
     * @param filenamesToPreload Array of auxiliary files to preload into ChucK's filesystem. These can be .wav files, .ck files, .etc. `[{serverFilename: "./path/filename.wav", virtualFilename: "filename.wav"}...]`
     * @param audioContext Optional parameter if you want to use your own AudioContext. **Note**: If an AudioContext is passed in, you will need to connect the ChucK instance to your own destination.
     * @param numOutChannels Optional custom number of output channels. Default is 2 channel stereo and the Web Audio API supports up to 32 channels.
     * @param whereIsChuck Optional custom url to your WebChucK `src` folder containing `webchuck.js` and `webchuck.wasm`. By default, `whereIsChuck` is {@link https://chuck.stanford.edu/webchuck/src | here}.
     * @returns WebChucK ChucK instance
     */
    static init(filenamesToPreload: Filename[], audioContext?: AudioContext, numOutChannels?: number, whereIsChuck?: string): Promise<Chuck>;
    /**
     * Private function for ChucK to handle execution of tasks.
     * Will create a Deferred promise that wraps a task for WebChucK to execute
     * @returns callbackID to a an action for ChucK to perform
     */
    private nextDeferID;
    /**
     * Create a virtual file in ChucK's filesystem.
     * You should first locally {@link https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch | fetch} the contents of your file, then pass the data to this method.
     * Alternatively, you can use {@link loadFile} to automatically fetch and load a file from a URL.
     * @param directory Virtual directory to create file in
     * @param filename Name of file to create
     * @param data Data to write to the file
     */
    createFile(directory: string, filename: string, data: string | ArrayBuffer): void;
    /**
     * Automatically fetch and load in a file from a URL to ChucK's virtual filesystem
     * @example
     * ```ts
     * theChuck.loadFile("./myFile.ck");
     * ```
     * @param url path or url to a file to fetch and load file
     * @returns Promise of fetch request
     */
    loadFile(url: string): Promise<void>;
    /**
     * Load a single WebChugin (.chug.wasm) via url into WebChucK.
     * A list of publicly available WebChugins to load can be found in the {@link https://chuck.stanford.edu/chugins/ | webchugins} folder.
     * **Note:** WebChugins must be loaded before `theChuck` is initialized.
     * @param url url to webchugin to load
     * @example
     * ```ts
     * Chuck.loadChugin("https://url/to/myChugin.chug.wasm");
     * theChuck = await Chuck.init([]);
     * ```
     */
    static loadChugin(url: string): void;
    /**
     * Return a list of loaded WebChugins.
     * @returns String array of loaded WebChugin names
     */
    loadedChugins(): string[];
    /**
     * Run a string of ChucK code.
     * @example theChuck.runCode("SinOsc osc => dac; 1::second => now;");
     * @param code ChucK code string to be executed
     * @returns Promise to shred ID
     */
    runCode(code: string): Promise<number>;
    /**
     * @hidden
     * Run a string of ChucK code using a different dac (unsure of functionality)
     * -tf (5/30/2023)
     * @param code ChucK code string to be executed
     * @param dacName dac for ChucK (??)
     * @returns Promise to shred ID
     */
    runCodeWithReplacementDac(code: string, dacName: string): Promise<number>;
    /**
     * Replace the last currently running shred with string of ChucK code to execute.
     * @example theChuck.replaceCode("SinOsc osc => dac; 1::second => now;");
     * @param code ChucK code string to run and replace last shred
     * @returns Promise to shred ID that is replaced
     */
    replaceCode(code: string): Promise<{
        oldShred: number;
        newShred: number;
    }>;
    /**
     * @hidden
     * Replace last running shred with string of ChucK code to execute, to another dac (??)
     * @param code ChucK code string to replace last Shred
     * @param dacName dac for ChucK (??)
     * @returns Promise to shred ID
     */
    replaceCodeWithReplacementDac(code: string, dacName: string): Promise<{
        oldShred: number;
        newShred: number;
    }>;
    /**
     * Remove the last running shred from Chuck Virtual Machine.
     * @returns Promise to the shred ID that was removed
     */
    removeLastCode(): Promise<number>;
    /**
     * Run a ChucK file that is already loaded in the WebChucK virtual file system.
     * Note that the file must already have been loaded via {@link init | filenamesToPreload}, {@link createFile}, or {@link loadFile}
     *
     * @example
     * ```ts
     * await theChuck.loadFile("./myFile.ck"); // wait for file to load
     * theChuck.runFile("myFile.ck");
     * ```
     *
     * @param filename ChucK file to be run
     * @returns Promise to running shred ID
     */
    runFile(filename: string): Promise<number>;
    /**
     * @hidden
     * Run a ChucK file that is already in the WebChucK virtual file system, on separate dac (??).
     * Note that the file must already have been loaded via {@link init | filenamesToPreload}, {@link createFile}, or {@link loadFile}
     * @param filename ChucK file to be run
     * @param dacName dac for ChucK (??)
     * @returns Promise to shred ID
     */
    runFileWithReplacementDac(filename: string, dacName: string): Promise<number>;
    /**
     * Run a ChucK file already loaded in the WebChucK virtual file system and pass in arguments.
     * e.g. Thie is the chuck command line equivalent of `chuck myFile:1:2:foo`
     * @example theChuck.runFileWithArgs("myFile.ck", "1:2:foo");
     * @param filename ChucK file to be run
     * @param colonSeparatedArgs arguments to pass to the file separated by colons
     * @returns Promise to running shred ID
     */
    runFileWithArgs(filename: string, colonSeparatedArgs: string): Promise<number>;
    /**
     * @hidden
     * Run a ChucK file that is already in the WebChucK virtual file system with arguments.
     * e.g. native equivalent of `chuck myFile:arg`
     * @param filename ChucK file to be run
     * @param colonSeparatedArgs arguments to pass to the file
     * @param dacName dac for ChucK (??)
     * @returns Promise to shred ID
     */
    runFileWithArgsWithReplacementDac(filename: string, colonSeparatedArgs: string, dacName: string): Promise<number>;
    /**
     * Replace the last currently running shred with a Chuck file to execute.
     * Note that the file must already have been loaded via {@link init | filenamesToPreload}, {@link createFile}, or {@link loadFile}
     * @param filename file to be replace last
     * @returns Promise to replaced shred ID
     */
    replaceFile(filename: string): Promise<{
        oldShred: number;
        newShred: number;
    }>;
    /**
     * @hidden
     * Replace the last running shred with a file to execute.
     * Note that the file must already have been loaded via {@link init | filenamesToPreload}, {@link createFile}, or {@link loadFile}
     * @param filename file to be replace last
     * @param dacName dac for ChucK (??)
     * @returns Promise to shred ID
     */
    replaceFileWithReplacementDac(filename: string, dacName: string): Promise<{
        oldShred: number;
        newShred: number;
    }>;
    /**
     * Replace the last running shred with a file to execute, passing arguments.
     * Note that the file must already have been loaded via {@link init | filenamesToPreload}, {@link createFile}, or {@link loadFile}
     * @param filename file to be replace last running shred
     * @param colonSeparatedArgs arguments to pass in to file
     * @returns Promise to shred ID
     */
    replaceFileWithArgs(filename: string, colonSeparatedArgs: string): Promise<{
        oldShred: number;
        newShred: number;
    }>;
    /**
     * @hidden
     * Replace the last running shred with a file to execute, passing arguments, and dac.
     * Note that the file must already have been loaded via {@link init | filenamesToPreload}, {@link createFile}, or {@link loadFile}
     * @param filename file to be replace last running shred
     * @param colonSeparatedArgs arguments to pass in to file
     * @param dacName dac for ChucK (??)
     * @returns Promise to shred ID
     */
    replaceFileWithArgsWithReplacementDac(filename: string, colonSeparatedArgs: string, dacName: string): Promise<{
        oldShred: number;
        newShred: number;
    }>;
    /**
     * Remove a shred from ChucK VM by ID
     * @param shred shred ID to be removed
     * @returns Promise to shred ID if removed successfully, otherwise "removing code failed"
     */
    removeShred(shred: number | string): Promise<number>;
    /**
     * Check if shred with ID is running in the Chuck Virtual Machine.
     * @param shred The shred ID to check
     * @returns Promise to whether shred is running, 1 if running, 0 if not
     */
    isShredActive(shred: number | string): Promise<number>;
    /**
     * Signal a ChucK event global. This will wake the first waiting Shred.
     * @param variable ChucK global event variable to be signaled
     */
    signalEvent(variable: string): void;
    /**
     * Broadcast a ChucK event to all waiting Shreds.
     * @param variable ChucK global event variable to be signaled
     */
    broadcastEvent(variable: string): void;
    /**
     * Listen for a specific ChucK event to be signaled (through either signal()
     * or broadcast()). Once signaled, the callback function is invoked. This can
     * happen at most once per call.
     * @param variable ChucK global event variable to be signaled
     * @param callback javascript callback function
     */
    listenForEventOnce(variable: string, callback: () => void): void;
    /**
     * Listen for a specific ChucK event to be signaled (through either signal()
     * or broadcast()). Each time the event is signaled, the callback function is
     * invoked. This continues until {@link stopListeningForEvent} is called on the
     * specific event.
     * @param variable ChucK global event variable to be signaled
     * @param callback javascript callback function
     * @returns javascript callback ID
     */
    startListeningForEvent(variable: string, callback: () => void): number;
    /**
     * Stop listening to a specific ChucK event, undoing the process started
     * by {@link startListeningForEvent}.
     * @param variable ChucK global event variable to be signaled
     * @param callbackID callback ID returned by {@link startListeningForEvent}
     */
    stopListeningForEvent(variable: string, callbackID: number): void;
    /**
     * Set the value of a global int variable in ChucK.
     * @example theChuck.setInt("MY_GLOBAL_INT", 5);
     * @param variable Name of int global variable
     * @param value New int value to set
     */
    setInt(variable: string, value: number): void;
    /**
     * Get the value of a global int variable in ChucK.
     * @example const myGlobalInt = await theChuck.getInt("MY_GLOBAL_INT");
     * @param variable Name of int global variable
     * @returns Promise with int value of the variable
     */
    getInt(variable: string): Promise<number>;
    /**
     * Set the value of a global float variable in ChucK.
     * @param variable Name of float global variable
     * @param value New float value to set
     */
    setFloat(variable: string, value: number): void;
    /**
     * Get the value of a global float variable in ChucK.
     * @param variable Name of float global variable
     * @returns Promise with float value of the variable
     */
    getFloat(variable: string): Promise<number>;
    /**
     * Set the value of a global string variable in ChucK.
     * @param variable Name of string global variable
     * @param value New string value to set
     */
    setString(variable: string, value: string): void;
    /**
     * Get the value of a global string variable in ChucK.
     * @param variable Name of string global variable
     * @returns Promise with string value of the variable
     */
    getString(variable: string): Promise<string>;
    /**
     * Set the values of a global int array in ChucK.
     * @param variable Name of global int array variable
     * @param values Array of numbers to set
     */
    setIntArray(variable: string, values: number[]): void;
    /**
     * Get the values of a global int array in ChucK.
     * @param variable Name of global int array variable
     * @returns Promise to array of numbers
     */
    getIntArray(variable: string): Promise<number[]>;
    /**
     * Set a single value (by index) in a global int array in ChucK.
     * @param variable Name of int array variable
     * @param index Array index to set
     * @param value Value to set
     */
    setIntArrayValue(variable: string, index: number, value: number[]): void;
    /**
     * Get a single value (by index) in a global int array in ChucK.
     * @param variable Name of int array variable
     * @param index Array index to get
     * @returns Promise to the value at the index
     */
    getIntArrayValue(variable: string, index: number): Promise<number>;
    /**
     * Set the value (by key) of an associative int array in ChucK.
     * Note that "associative array" is ChucK's version of a dictionary with string keys mapping to values (see ChucK documentation).
     * @example theChucK.setAssociativeIntArrayValue("MY_INT_ASSOCIATIVE_ARRAY", "key", 5);
     * @param variable Name of global associative int array to set
     * @param key The key index (string) of the associative array
     * @param value The new value
     */
    setAssociativeIntArrayValue(variable: string, key: string, value: number | string): void;
    /**
     * Get the value (by key) of an associative int array in ChucK.
     * e.g. theChucK.getAssociateIntArrayValue("MY_INT_ASSOCIATIVE_ARRAY", "key");
     * @param variable Name of gobal associative int arry
     * @param key The key index (string) to get
     * @returns Promise with int array value
     */
    getAssociativeIntArrayValue(variable: string, key: string): Promise<number>;
    /**
     * Set the values of a global float array in ChucK.
     * @param variable Name of global float array
     * @param values Values to set
     */
    setFloatArray(variable: string, values: number[]): void;
    /**
     * Get the values of a global float array in ChucK.
     * @example theChucK.getFloatArray("MY_FLOAT_ARRAY");
     * @param variable Name of float array
     * @returns Promise of float values
     */
    getFloatArray(variable: string): Promise<number[]>;
    /**
     * Set the float value of a global float array at particular index.
     * @param variable Name of global float array
     * @param index Index of element
     * @param value Value to set
     */
    setFloatArrayValue(variable: string, index: number, value: number): void;
    /**
     * Get the float value of a global float arry at a particular index.
     * @example theChucK.getFloatArray("MY_FLOAT_ARRAY", 1);
     * @param variable Name of global float array
     * @param index Index of element
     * @returns Promise of float value at index
     */
    getFloatArrayValue(variable: string, index: number): Promise<number>;
    /**
     * Set the value (by key) of an associative float array in ChucK.
     * Note that "associative array" is ChucK's version of a dictionary with string keys mapping to values (see ChucK documentation).
     * @example theChucK.setAssociateFloatArrayValue("MY_FLOAT_ASSOCIATIVE_ARRAY", "key", 5);
     * @param variable Name of global associative float array to set
     * @param key The key index (string) of the associative array
     * @param value Float value to set
     */
    setAssociativeFloatArrayValue(variable: string, key: string, value: number): void;
    /**
     * Get the value (by key) of an associative float array in ChucK.
     * @example theChucK.getAssociateFloatArrayValue("MY_FLOAT_ASSOCIATIVE_ARRAY", "key");
     * @param variable Name of gobal associative float array
     * @param key The key index (string) to get
     * @returns Promise with float array value
     */
    getAssociativeFloatArrayValue(variable: string, key: string): Promise<number>;
    /**
     * Set an internal ChucK VM integer parameter.
     * e.g. "SAMPLE_RATE", "INPUT_CHANNELS", "OUTPUT_CHANNELS", "IS_REAL_TIME_AUDIO_HINT", "TTY_COLOR".
     * @param name Name of VM int parameter to set
     * @param value Value to set
     */
    setParamInt(name: string, value: number): void;
    /**
     * Get an internal ChucK VM integer parameter.
     * e.g. "SAMPLE_RATE", "INPUT_CHANNELS", "OUTPUT_CHANNELS", "BUFFER_SIZE", "IS_REAL_TIME_AUDIO_HINT".
     * @param name Name of VM int parameter to get
     * @returns Promise with int value
     */
    getParamInt(name: string): Promise<number>;
    /**
     * Set an internal ChucK VM float parameter.
     * @param name Name of VM float parameter to set
     * @param value Value to set
     */
    setParamFloat(name: string, value: number): void;
    /**
     * Get an internal ChucK VM float parameter.
     * @param name Name of VM float parameter to get
     * @returns Promise with float value
     */
    getParamFloat(name: string): Promise<number>;
    /**
     * Set an internal ChucK VM string parameter.
     * @param name Name of VM string parameter to set
     * @param value Value to set
     */
    setParamString(name: string, value: string): void;
    /**
     * Get an internal ChucK VM string parameter.
     * e.g. "VERSION".
     * @param name Name of VM string parameter to get
     * @returns Promise with string value
     */
    getParamString(name: string): Promise<string>;
    /**
     * Get the current time in samples of the ChucK VM.
     * @returns Promise to current sample time in ChucK (int)
     */
    now(): Promise<number>;
    /**
     * Remove all shreds and reset the ChucK instance.
     */
    clearChuckInstance(): void;
    /**
     * Reset all global variables in ChucK.
     */
    clearGlobals(): void;
    /**
     * Callback function for Chuck to print a message string to console.
     * Override this method to redirect where ChucK console output goes. By default, Chuck prints to `console.log()`.
     * Set your own method to display ChucK output or even use ChucK output as a message passing system.
     * @example
     * ```ts
     * // Override the default print method with our own callback print method
     * theChuck.chuckPrint = (message) => { console.log("ChucK says: " + message); }
     *
     * // Now when ChucK prints, it will print to our callback method
     * theChuck.runCode(`<<< "Hello World!", "" >>>`);
     *
     * // Output: "ChucK says: Hello World!"
     * ```
     * @param message Message that ChucK will print to console
     */
    chuckPrint(message: string): void;
    /**
     * @hidden
     * Internal: Message sending from JS to ChucK
     */
    private sendMessage;
    /**
     * @hidden
     * Internal: Message receiving from ChucK to JS
     */
    private receiveMessage;
}
