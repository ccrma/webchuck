export enum OutMessage {
  CREATE_FILE = "createFile",
  CREATE_DIRECTORY = "createDirectory",

  // Run/Replace Code
  RUN_CODE = "runChuckCode",
  RUN_CODE_WITH_REPLACEMENT_DAC = "runChuckCodeWithReplacementDac",
  REPLACE_CODE = "replaceChuckCode",
  REPLACE_CODE_WITH_REPLACEMENT_DAC = "replaceChuckCodeWithReplacementDac",
  REMOVE_LAST_CODE = "removeLastCode",

  // Run/Replace File
  RUN_FILE = "runChuckFile",
  RUN_FILE_WITH_REPLACEMENT_DAC = "runChuckFileWithReplacementDac",
  RUN_FILE_WITH_ARGS = "runChuckFileWithArgs",
  REPLACE_FILE = "replaceChuckFile",
  REPLACE_FILE_WITH_REPLACEMENT_DAC = "replaceChuckFileWithReplacementDac",
  REPLACE_FILE_WITH_ARGS = "replaceChuckFileWithArgs",

  // SHRED
  REMOVE_SHRED = "removeShred",
  IS_SHRED_ACTIVE = "isShredActive",

  // Event
  SIGNAL_EVENT = "signalChuckEvent",
  BROADCAST_EVENT = "broadcastChuckEvent",
  LISTEN_FOR_EVENT_ONCE = "listenForChuckEventOnce",
  START_LISTENING_FOR_EVENT = "startListeningForChuckEvent",
  STOP_LISTENING_FOR_EVENT = "stopListeningForChuckEvent",

  // Int, Float, String
  SET_INT = "setChuckInt",
  GET_INT = "getChuckInt",
  SET_FLOAT = "setChuckFloat",
  GET_FLOAT = "getChuckFloat",
  SET_STRING = "setChuckString",
  GET_STRING = "getChuckString",

  // Int[]
  SET_INT_ARRAY = "setGlobalIntArray",
  GET_INT_ARRAY = "getGlobalIntArray",
  SET_INT_ARRAY_VALUE = "setGlobalIntArrayValue",
  GET_INT_ARRAY_VALUE = "getGlobalIntArrayValue",
  SET_ASSOCIATIVE_INT_ARRAY_VALUE = "setGlobalAssociativeIntArrayValue",
  GET_ASSOCIATIVE_INT_ARRAY_VALUE = "getGlobalAssociativeIntArrayValue",

  // Float[]
  SET_FLOAT_ARRAY = "setGlobalFloatArray",
  GET_FLOAT_ARRAY = "getGlobalFloatArray",
  SET_FLOAT_ARRAY_VALUE = "setGlobalFloatArrayValue",
  GET_FLOAT_ARRAY_VALUE = "getGlobalFloatArrayValue",
  SET_ASSOCIATIVE_FLOAT_ARRAY_VALUE = "setGlobalAssociativeFloatArrayValue",
  GET_ASSOCIATIVE_FLOAT_ARRAY_VALUE = "getGlobalAssociativeFloatArrayValue",

  // VM Params
  SET_PARAM_INT = "setParamInt",
  GET_PARAM_INT = "getParamInt",
  SET_PARAM_FLOAT = "setParamFloat",
  GET_PARAM_FLOAT = "getParamFloat",
  SET_PARAM_STRING = "setParamString",
  GET_PARAM_STRING = "getParamString",

  // VM
  GET_CHUCK_NOW = "getChuckNow",

  // Clear
  CLEAR_INSTANCE = "clearChuckInstance",
  CLEAR_GLOBALS = "clearGlobals",
}

export enum InMessage {
  INIT_DONE = "initCallback",
  PRINT = "console print",
  EVENT = "eventCallback",

  INT = "intCallback",
  FLOAT = "floatCallback",
  STRING = "stringCallback",
  INT_ARRAY = "intArrayCallback",
  FLOAT_ARRAY = "floatArrayCallback",

  NEW_SHRED = "newShredCallback",
  REPLACED_SHRED = "replacedShredCallback",
  REMOVED_SHRED = "removedShredCallback",
}
