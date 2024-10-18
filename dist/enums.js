export var OutMessage;
(function (OutMessage) {
    OutMessage["CREATE_FILE"] = "createFile";
    OutMessage["CREATE_DIRECTORY"] = "createDirectory";
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
    OutMessage["LISTEN_FOR_EVENT_ONCE"] = "listenForChuckEventOnce";
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
export var InMessage;
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
