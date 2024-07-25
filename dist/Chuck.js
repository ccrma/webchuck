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
import { defer, isPlaintextFile, loadWasm, preloadFiles } from "./utils";
import { InMessage, OutMessage } from "./enums";
/**
 * WebChucK: ChucK Web Audio Node class.
 * Use **{@link init | Init}** to create a ChucK instance
 */
export default class Chuck extends window.AudioWorkletNode {
    /**
     * Private internal constructor for a ChucK AudioWorklet Web Audio Node. Use public **{@link init| Init}** to create a ChucK instance.
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
        this.chugins = [];
        this.port.onmessage = this.receiveMessage.bind(this);
        this.onprocessorerror = (e) => console.error(e);
        Chuck.chuckID++;
    }
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
    static async init(filenamesToPreload, audioContext, numOutChannels = 2, whereIsChuck = "https://chuck.stanford.edu/webchuck/src/") {
        const wasm = await loadWasm(whereIsChuck);
        let defaultAudioContext = false;
        // If an audioContext is not given, create a default one
        if (audioContext === undefined) {
            audioContext = new AudioContext();
            defaultAudioContext = true;
        }
        await audioContext.audioWorklet.addModule(whereIsChuck + "webchuck.js");
        // Add Chugins to filenamesToPreload
        filenamesToPreload = filenamesToPreload.concat(Chuck.chuginsToLoad);
        const preloadedFiles = await preloadFiles(filenamesToPreload);
        const chuck = new Chuck(preloadedFiles, audioContext, wasm, numOutChannels);
        // Remember the chugins that were loaded
        chuck.chugins = Chuck.chuginsToLoad.map((chugin) => chugin.virtualFilename.split("/").pop());
        Chuck.chuginsToLoad = []; // clear
        // Connect node to default destination if using default audio context
        if (defaultAudioContext) {
            chuck.connect(audioContext.destination); // default connection source
        }
        audioContext.destination.channelCount = numOutChannels;
        await chuck.isReady.promise;
        return chuck;
    }
    /**
     * Private function for ChucK to handle execution of tasks.
     * Will create a Deferred promise that wraps a task for WebChucK to execute
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
     * You should first locally {@link https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch | fetch} the contents of your file, then pass the data to this method.
     * Alternatively, you can use {@link loadFile} to automatically fetch and load a file from a URL.
     * @param directory Virtual directory to create file in
     * @param filename Name of file to create
     * @param data Data to write to the file
     */
    createFile(directory, filename, data) {
        this.sendMessage(OutMessage.CREATE_FILE, {
            directory,
            filename,
            data,
        });
    }
    /**
     * Automatically fetch and load in a file from a URL to ChucK's virtual filesystem
     * @example
     * ```ts
     * theChuck.loadFile("./myFile.ck");
     * ```
     * @param url path or url to a file to fetch and load file
     * @returns Promise of fetch request
     */
    async loadFile(url) {
        const filename = url.split("/").pop();
        const isText = isPlaintextFile(filename);
        return fetch(url)
            .then((response) => {
            if (isText) {
                return response.text();
            }
            else {
                return response.arrayBuffer();
            }
        })
            .then((data) => {
            if (isText) {
                this.createFile("", filename, data);
            }
            else {
                this.createFile("", filename, new Uint8Array(data));
            }
        })
            .catch((err) => {
            throw new Error(err);
        });
    }
    // ================== WebChugins ================== //
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
    static loadChugin(url) {
        Chuck.chuginsToLoad.push({
            serverFilename: url,
            virtualFilename: "/chugins/" + url.split("/").pop(),
        });
    }
    /**
     * Return a list of loaded WebChugins.
     * @returns String array of loaded WebChugin names
     */
    loadedChugins() {
        return this.chugins;
    }
    // ================== Run/Replace Code ================== //
    /**
     * Run a string of ChucK code.
     * @example theChuck.runCode("SinOsc osc => dac; 1::second => now;");
     * @param code ChucK code string to be executed
     * @returns Promise to shred ID
     */
    runCode(code) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.RUN_CODE, { callback: callbackID, code });
        return this.deferredPromises[callbackID].value();
    }
    /**
     * @hidden
     * Run a string of ChucK code using a different dac (unsure of functionality)
     * -tf (5/30/2023)
     * @param code ChucK code string to be executed
     * @param dacName dac for ChucK (??)
     * @returns Promise to shred ID
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
     * Replace the last currently running shred with string of ChucK code to execute.
     * @example theChuck.replaceCode("SinOsc osc => dac; 1::second => now;");
     * @param code ChucK code string to run and replace last shred
     * @returns Promise to shred ID that is replaced
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
     * @hidden
     * Replace last running shred with string of ChucK code to execute, to another dac (??)
     * @param code ChucK code string to replace last Shred
     * @param dacName dac for ChucK (??)
     * @returns Promise to shred ID
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
     * Remove the last running shred from Chuck Virtual Machine.
     * @returns Promise to the shred ID that was removed
     */
    removeLastCode() {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.REMOVE_LAST_CODE, { callback: callbackID });
        return this.deferredPromises[callbackID].value();
    }
    // ================== Run/Replace File ================== //
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
    runFile(filename) {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.RUN_FILE, {
            callback: callbackID,
            filename,
        });
        return this.deferredPromises[callbackID].value();
    }
    /**
     * @hidden
     * Run a ChucK file that is already in the WebChucK virtual file system, on separate dac (??).
     * Note that the file must already have been loaded via {@link init | filenamesToPreload}, {@link createFile}, or {@link loadFile}
     * @param filename ChucK file to be run
     * @param dacName dac for ChucK (??)
     * @returns Promise to shred ID
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
     * Run a ChucK file already loaded in the WebChucK virtual file system and pass in arguments.
     * e.g. Thie is the chuck command line equivalent of `chuck myFile:1:2:foo`
     * @example theChuck.runFileWithArgs("myFile.ck", "1:2:foo");
     * @param filename ChucK file to be run
     * @param colonSeparatedArgs arguments to pass to the file separated by colons
     * @returns Promise to running shred ID
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
     * @hidden
     * Run a ChucK file that is already in the WebChucK virtual file system with arguments.
     * e.g. native equivalent of `chuck myFile:arg`
     * @param filename ChucK file to be run
     * @param colonSeparatedArgs arguments to pass to the file
     * @param dacName dac for ChucK (??)
     * @returns Promise to shred ID
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
     * Replace the last currently running shred with a Chuck file to execute.
     * Note that the file must already have been loaded via {@link init | filenamesToPreload}, {@link createFile}, or {@link loadFile}
     * @param filename file to be replace last
     * @returns Promise to replaced shred ID
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
     * @hidden
     * Replace the last running shred with a file to execute.
     * Note that the file must already have been loaded via {@link init | filenamesToPreload}, {@link createFile}, or {@link loadFile}
     * @param filename file to be replace last
     * @param dacName dac for ChucK (??)
     * @returns Promise to shred ID
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
     * Note that the file must already have been loaded via {@link init | filenamesToPreload}, {@link createFile}, or {@link loadFile}
     * @param filename file to be replace last running shred
     * @param colonSeparatedArgs arguments to pass in to file
     * @returns Promise to shred ID
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
     * @hidden
     * Replace the last running shred with a file to execute, passing arguments, and dac.
     * Note that the file must already have been loaded via {@link init | filenamesToPreload}, {@link createFile}, or {@link loadFile}
     * @param filename file to be replace last running shred
     * @param colonSeparatedArgs arguments to pass in to file
     * @param dacName dac for ChucK (??)
     * @returns Promise to shred ID
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
     * @returns Promise to shred ID if removed successfully, otherwise "removing code failed"
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
     * Check if shred with ID is running in the Chuck Virtual Machine.
     * @param shred The shred ID to check
     * @returns Promise to whether shred is running, 1 if running, 0 if not
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
     * Signal a ChucK event global. This will wake the first waiting Shred.
     * @param variable ChucK global event variable to be signaled
     */
    signalEvent(variable) {
        this.sendMessage(OutMessage.SIGNAL_EVENT, { variable });
    }
    /**
     * Broadcast a ChucK event to all waiting Shreds.
     * @param variable ChucK global event variable to be signaled
     */
    broadcastEvent(variable) {
        this.sendMessage(OutMessage.BROADCAST_EVENT, { variable });
    }
    /**
     * Listen for a specific ChucK event to be signaled (through either signal()
     * or broadcast()). Once signaled, the callback function is invoked. This can
     * happen at most once per call.
     * @param variable ChucK global event variable to be signaled
     * @param callback javascript callback function
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
     * Listen for a specific ChucK event to be signaled (through either signal()
     * or broadcast()). Each time the event is signaled, the callback function is
     * invoked. This continues until {@link stopListeningForEvent} is called on the
     * specific event.
     * @param variable ChucK global event variable to be signaled
     * @param callback javascript callback function
     * @returns javascript callback ID
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
     * Stop listening to a specific ChucK event, undoing the process started
     * by {@link startListeningForEvent}.
     * @param variable ChucK global event variable to be signaled
     * @param callbackID callback ID returned by {@link startListeningForEvent}
     */
    stopListeningForEvent(variable, callbackID) {
        this.sendMessage(OutMessage.STOP_LISTENING_FOR_EVENT, {
            variable,
            callback: callbackID,
        });
    }
    // ================== Int, Float, String ============= //
    /**
     * Set the value of a global int variable in ChucK.
     * @example theChuck.setInt("MY_GLOBAL_INT", 5);
     * @param variable Name of int global variable
     * @param value New int value to set
     */
    setInt(variable, value) {
        this.sendMessage(OutMessage.SET_INT, { variable, value });
    }
    /**
     * Get the value of a global int variable in ChucK.
     * @example const myGlobalInt = await theChuck.getInt("MY_GLOBAL_INT");
     * @param variable Name of int global variable
     * @returns Promise with int value of the variable
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
     * Set the value of a global float variable in ChucK.
     * @param variable Name of float global variable
     * @param value New float value to set
     */
    setFloat(variable, value) {
        this.sendMessage(OutMessage.SET_FLOAT, { variable, value });
    }
    /**
     * Get the value of a global float variable in ChucK.
     * @param variable Name of float global variable
     * @returns Promise with float value of the variable
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
     * Set the value of a global string variable in ChucK.
     * @param variable Name of string global variable
     * @param value New string value to set
     */
    setString(variable, value) {
        this.sendMessage(OutMessage.SET_STRING, { variable, value });
    }
    /**
     * Get the value of a global string variable in ChucK.
     * @param variable Name of string global variable
     * @returns Promise with string value of the variable
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
     * Set the values of a global int array in ChucK.
     * @param variable Name of global int array variable
     * @param values Array of numbers to set
     */
    setIntArray(variable, values) {
        this.sendMessage(OutMessage.SET_INT_ARRAY, { variable, values });
    }
    /**
     * Get the values of a global int array in ChucK.
     * @param variable Name of global int array variable
     * @returns Promise to array of numbers
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
     * Set a single value (by index) in a global int array in ChucK.
     * @param variable Name of int array variable
     * @param index Array index to set
     * @param value Value to set
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
     * @param variable Name of int array variable
     * @param index Array index to get
     * @returns Promise to the value at the index
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
     * @example theChucK.setAssociativeIntArrayValue("MY_INT_ASSOCIATIVE_ARRAY", "key", 5);
     * @param variable Name of global associative int array to set
     * @param key The key index (string) of the associative array
     * @param value The new value
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
     * e.g. theChucK.getAssociateIntArrayValue("MY_INT_ASSOCIATIVE_ARRAY", "key");
     * @param variable Name of gobal associative int arry
     * @param key The key index (string) to get
     * @returns Promise with int array value
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
     * Set the values of a global float array in ChucK.
     * @param variable Name of global float array
     * @param values Values to set
     */
    setFloatArray(variable, values) {
        this.sendMessage(OutMessage.SET_FLOAT_ARRAY, { variable, values });
    }
    /**
     * Get the values of a global float array in ChucK.
     * @example theChucK.getFloatArray("MY_FLOAT_ARRAY");
     * @param variable Name of float array
     * @returns Promise of float values
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
     * Set the float value of a global float array at particular index.
     * @param variable Name of global float array
     * @param index Index of element
     * @param value Value to set
     */
    setFloatArrayValue(variable, index, value) {
        this.sendMessage(OutMessage.SET_FLOAT_ARRAY_VALUE, {
            variable,
            index,
            value,
        });
    }
    /**
     * Get the float value of a global float arry at a particular index.
     * @example theChucK.getFloatArray("MY_FLOAT_ARRAY", 1);
     * @param variable Name of global float array
     * @param index Index of element
     * @returns Promise of float value at index
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
     * @example theChucK.setAssociateFloatArrayValue("MY_FLOAT_ASSOCIATIVE_ARRAY", "key", 5);
     * @param variable Name of global associative float array to set
     * @param key The key index (string) of the associative array
     * @param value Float value to set
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
     * @example theChucK.getAssociateFloatArrayValue("MY_FLOAT_ASSOCIATIVE_ARRAY", "key");
     * @param variable Name of gobal associative float array
     * @param key The key index (string) to get
     * @returns Promise with float array value
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
     * @param name Name of VM int parameter to set
     * @param value Value to set
     */
    setParamInt(name, value) {
        this.sendMessage(OutMessage.SET_PARAM_INT, { name, value });
    }
    /**
     * Get an internal ChucK VM integer parameter.
     * e.g. "SAMPLE_RATE", "INPUT_CHANNELS", "OUTPUT_CHANNELS", "BUFFER_SIZE", "IS_REAL_TIME_AUDIO_HINT".
     * @param name Name of VM int parameter to get
     * @returns Promise with int value
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
     * Set an internal ChucK VM float parameter.
     * @param name Name of VM float parameter to set
     * @param value Value to set
     */
    setParamFloat(name, value) {
        this.sendMessage(OutMessage.SET_PARAM_FLOAT, { name, value });
    }
    /**
     * Get an internal ChucK VM float parameter.
     * @param name Name of VM float parameter to get
     * @returns Promise with float value
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
     * Set an internal ChucK VM string parameter.
     * @param name Name of VM string parameter to set
     * @param value Value to set
     */
    setParamString(name, value) {
        this.sendMessage(OutMessage.SET_PARAM_STRING, { name, value });
    }
    /**
     * Get an internal ChucK VM string parameter.
     * e.g. "VERSION".
     * @param name Name of VM string parameter to get
     * @returns Promise with string value
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
     * Get the current time in samples of the ChucK VM.
     * @returns Promise to current sample time in ChucK (int)
     */
    now() {
        const callbackID = this.nextDeferID();
        this.sendMessage(OutMessage.GET_CHUCK_NOW, { callback: callbackID });
        return this.deferredPromises[callbackID].value();
    }
    // ================= Clear ====================== //
    /**
     * Remove all shreds and reset the ChucK instance.
     */
    clearChuckInstance() {
        this.sendMessage(OutMessage.CLEAR_INSTANCE);
    }
    /**
     * Reset all global variables in ChucK.
     */
    clearGlobals() {
        this.sendMessage(OutMessage.CLEAR_GLOBALS);
    }
    // ================== Print Output ================== //
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
    chuckPrint(message) {
        // Default ChucK output destination
        console.log(message);
    }
    //--------------------------------------------------------
    // Internal Message Sending Communication
    //--------------------------------------------------------
    /**
     * @hidden
     * Internal: Message sending from JS to ChucK
     */
    sendMessage(type, body) {
        const msgBody = body ? { type, ...body } : { type };
        this.port.postMessage(msgBody);
    }
    /**
     * @hidden
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
            default:
                break;
        }
    }
}
/** @internal */
Chuck.chuckID = 1;
/** @internal */
Chuck.chuginsToLoad = [];
