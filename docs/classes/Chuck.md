# Class: Chuck

WebChucK: ChucK Web Audio Node class.
See init() to get started

## Hierarchy

- `AudioWorkletNode`

  ↳ **`Chuck`**

## Table of contents

### Constructors

- [constructor](Chuck.md#constructor)

### Properties

- [channelCount](Chuck.md#channelcount)
- [channelCountMode](Chuck.md#channelcountmode)
- [channelInterpretation](Chuck.md#channelinterpretation)
- [context](Chuck.md#context)
- [deferredPromiseCounter](Chuck.md#deferredpromisecounter)
- [deferredPromises](Chuck.md#deferredpromises)
- [eventCallbackCounter](Chuck.md#eventcallbackcounter)
- [eventCallbacks](Chuck.md#eventcallbacks)
- [isReady](Chuck.md#isready)
- [numberOfInputs](Chuck.md#numberofinputs)
- [numberOfOutputs](Chuck.md#numberofoutputs)
- [onprocessorerror](Chuck.md#onprocessorerror)
- [parameters](Chuck.md#parameters)
- [port](Chuck.md#port)
- [chuckID](Chuck.md#chuckid)

### Methods

- [addEventListener](Chuck.md#addeventlistener)
- [broadcastEvent](Chuck.md#broadcastevent)
- [chuckPrint](Chuck.md#chuckprint)
- [clearChuckInstance](Chuck.md#clearchuckinstance)
- [clearGlobals](Chuck.md#clearglobals)
- [connect](Chuck.md#connect)
- [createFile](Chuck.md#createfile)
- [disconnect](Chuck.md#disconnect)
- [dispatchEvent](Chuck.md#dispatchevent)
- [getAssociativeFloatArrayValue](Chuck.md#getassociativefloatarrayvalue)
- [getAssociativeIntArrayValue](Chuck.md#getassociativeintarrayvalue)
- [getFloat](Chuck.md#getfloat)
- [getFloatArray](Chuck.md#getfloatarray)
- [getFloatArrayValue](Chuck.md#getfloatarrayvalue)
- [getInt](Chuck.md#getint)
- [getIntArray](Chuck.md#getintarray)
- [getIntArrayValue](Chuck.md#getintarrayvalue)
- [getParamFloat](Chuck.md#getparamfloat)
- [getParamInt](Chuck.md#getparamint)
- [getParamString](Chuck.md#getparamstring)
- [getString](Chuck.md#getstring)
- [isShredActive](Chuck.md#isshredactive)
- [listenForEventOnce](Chuck.md#listenforeventonce)
- [loadFile](Chuck.md#loadfile)
- [nextDeferID](Chuck.md#nextdeferid)
- [now](Chuck.md#now)
- [receiveMessage](Chuck.md#receivemessage)
- [removeEventListener](Chuck.md#removeeventlistener)
- [removeLastCode](Chuck.md#removelastcode)
- [removeShred](Chuck.md#removeshred)
- [replaceCode](Chuck.md#replacecode)
- [replaceCodeWithReplacementDac](Chuck.md#replacecodewithreplacementdac)
- [replaceFile](Chuck.md#replacefile)
- [replaceFileWithArgs](Chuck.md#replacefilewithargs)
- [replaceFileWithArgsWithReplacementDac](Chuck.md#replacefilewithargswithreplacementdac)
- [replaceFileWithReplacementDac](Chuck.md#replacefilewithreplacementdac)
- [runCode](Chuck.md#runcode)
- [runCodeWithReplacementDac](Chuck.md#runcodewithreplacementdac)
- [runFile](Chuck.md#runfile)
- [runFileWithArgs](Chuck.md#runfilewithargs)
- [runFileWithArgsWithReplacementDac](Chuck.md#runfilewithargswithreplacementdac)
- [runFileWithReplacementDac](Chuck.md#runfilewithreplacementdac)
- [sendMessage](Chuck.md#sendmessage)
- [setAssociativeFloatArrayValue](Chuck.md#setassociativefloatarrayvalue)
- [setAssociativeIntArrayValue](Chuck.md#setassociativeintarrayvalue)
- [setFloat](Chuck.md#setfloat)
- [setFloatArray](Chuck.md#setfloatarray)
- [setFloatArrayValue](Chuck.md#setfloatarrayvalue)
- [setInt](Chuck.md#setint)
- [setIntArray](Chuck.md#setintarray)
- [setIntArrayValue](Chuck.md#setintarrayvalue)
- [setParamFloat](Chuck.md#setparamfloat)
- [setParamInt](Chuck.md#setparamint)
- [setParamString](Chuck.md#setparamstring)
- [setString](Chuck.md#setstring)
- [signalEvent](Chuck.md#signalevent)
- [startListeningForEvent](Chuck.md#startlisteningforevent)
- [stopListeningForEvent](Chuck.md#stoplisteningforevent)
- [init](Chuck.md#init)

## Constructors

### constructor

• `Private` **new Chuck**(`preloadedFiles`, `audioContext`, `wasm`, `numOutChannels?`)

Internal constructor for a ChucK AudioWorklet Web Audio Node

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `preloadedFiles` | `File`[] | `undefined` | Array of Files to preload into ChucK's filesystem |
| `audioContext` | `AudioContext` | `undefined` | AudioContext to connect to |
| `wasm` | `ArrayBuffer` | `undefined` | WebChucK WebAssembly binary |
| `numOutChannels` | `number` | `2` | Number of output channels |

#### Overrides

window.AudioWorkletNode.constructor

## Properties

### channelCount

• **channelCount**: `number`

#### Inherited from

window.AudioWorkletNode.channelCount

___

### channelCountMode

• **channelCountMode**: `ChannelCountMode`

#### Inherited from

window.AudioWorkletNode.channelCountMode

___

### channelInterpretation

• **channelInterpretation**: `ChannelInterpretation`

#### Inherited from

window.AudioWorkletNode.channelInterpretation

___

### context

• `Readonly` **context**: `BaseAudioContext`

#### Inherited from

window.AudioWorkletNode.context

___

### deferredPromiseCounter

• `Private` **deferredPromiseCounter**: `number` = `0`

___

### deferredPromises

• `Private` **deferredPromises**: `DeferredPromisesMap` = `{}`

___

### eventCallbackCounter

• `Private` **eventCallbackCounter**: `number` = `0`

___

### eventCallbacks

• `Private` **eventCallbacks**: `EventCallbacksMap` = `{}`

___

### isReady

• `Private` **isReady**: [`DeferredPromise`](DeferredPromise.md)<`void`\>

___

### numberOfInputs

• `Readonly` **numberOfInputs**: `number`

#### Inherited from

window.AudioWorkletNode.numberOfInputs

___

### numberOfOutputs

• `Readonly` **numberOfOutputs**: `number`

#### Inherited from

window.AudioWorkletNode.numberOfOutputs

___

### onprocessorerror

• **onprocessorerror**: ``null`` \| (`this`: `AudioWorkletNode`, `ev`: `Event`) => `any`

#### Inherited from

window.AudioWorkletNode.onprocessorerror

___

### parameters

• `Readonly` **parameters**: `AudioParamMap`

#### Inherited from

window.AudioWorkletNode.parameters

___

### port

• `Readonly` **port**: `MessagePort`

#### Inherited from

window.AudioWorkletNode.port

___

### chuckID

▪ `Static` **chuckID**: `number` = `1`

## Methods

### addEventListener

▸ **addEventListener**<`K`\>(`type`, `listener`, `options?`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends ``"processorerror"`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `K` |
| `listener` | (`this`: `AudioWorkletNode`, `ev`: `AudioWorkletNodeEventMap`[`K`]) => `any` |
| `options?` | `boolean` \| `AddEventListenerOptions` |

#### Returns

`void`

#### Inherited from

window.AudioWorkletNode.addEventListener

▸ **addEventListener**(`type`, `listener`, `options?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `string` |
| `listener` | `EventListenerOrEventListenerObject` |
| `options?` | `boolean` \| `AddEventListenerOptions` |

#### Returns

`void`

#### Inherited from

window.AudioWorkletNode.addEventListener

___

### broadcastEvent

▸ **broadcastEvent**(`variable`): `void`

Broadcast a ChucK event to all

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variable` | `string` | ChucK event variable to be signaled |

#### Returns

`void`

___

### chuckPrint

▸ **chuckPrint**(`message`): `void`

Override this method to redirect ChucK console output. Current default is console.log().
Set your own method to handle output or process it.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `string` | Message that ChucK prints to console |

#### Returns

`void`

___

### clearChuckInstance

▸ **clearChuckInstance**(): `void`

Remove all shreds and reset the WebChucK instance

#### Returns

`void`

___

### clearGlobals

▸ **clearGlobals**(): `void`

Reset all global variables in ChucK

#### Returns

`void`

___

### connect

▸ **connect**(`destinationNode`, `output?`, `input?`): `AudioNode`

#### Parameters

| Name | Type |
| :------ | :------ |
| `destinationNode` | `AudioNode` |
| `output?` | `number` |
| `input?` | `number` |

#### Returns

`AudioNode`

#### Inherited from

window.AudioWorkletNode.connect

▸ **connect**(`destinationParam`, `output?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `destinationParam` | `AudioParam` |
| `output?` | `number` |

#### Returns

`void`

#### Inherited from

window.AudioWorkletNode.connect

___

### createFile

▸ **createFile**(`directory`, `filename`, `data`): `void`

Create a virtual file in ChucK's filesystem. 
You should first locally fetch() the contents of your file, then pass the data to this method.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `directory` | `string` | Virtual directory to create file in |
| `filename` | `string` | Name of file to create |
| `data` | `string` \| `ArrayBuffer` | Data that you want to write to the file |

#### Returns

`void`

___

### disconnect

▸ **disconnect**(): `void`

#### Returns

`void`

#### Inherited from

window.AudioWorkletNode.disconnect

▸ **disconnect**(`output`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `output` | `number` |

#### Returns

`void`

#### Inherited from

window.AudioWorkletNode.disconnect

▸ **disconnect**(`destinationNode`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `destinationNode` | `AudioNode` |

#### Returns

`void`

#### Inherited from

window.AudioWorkletNode.disconnect

▸ **disconnect**(`destinationNode`, `output`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `destinationNode` | `AudioNode` |
| `output` | `number` |

#### Returns

`void`

#### Inherited from

window.AudioWorkletNode.disconnect

▸ **disconnect**(`destinationNode`, `output`, `input`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `destinationNode` | `AudioNode` |
| `output` | `number` |
| `input` | `number` |

#### Returns

`void`

#### Inherited from

window.AudioWorkletNode.disconnect

▸ **disconnect**(`destinationParam`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `destinationParam` | `AudioParam` |

#### Returns

`void`

#### Inherited from

window.AudioWorkletNode.disconnect

▸ **disconnect**(`destinationParam`, `output`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `destinationParam` | `AudioParam` |
| `output` | `number` |

#### Returns

`void`

#### Inherited from

window.AudioWorkletNode.disconnect

___

### dispatchEvent

▸ **dispatchEvent**(`event`): `boolean`

Dispatches a synthetic event event to target and returns true if either event's cancelable attribute value is false or its preventDefault() method was not invoked, and false otherwise.

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `Event` |

#### Returns

`boolean`

#### Inherited from

window.AudioWorkletNode.dispatchEvent

___

### getAssociativeFloatArrayValue

▸ **getAssociativeFloatArrayValue**(`variable`, `key`): `Promise`<`unknown`\>

Get the value (by key) of an associative float array in ChucK.
e.g. theChucK.getAssociateIntArrayValue("var", "key");

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variable` | `string` | name of gobal associative float array |
| `key` | `string` | the key index to get |

#### Returns

`Promise`<`unknown`\>

deferred promise with associative int array value

___

### getAssociativeIntArrayValue

▸ **getAssociativeIntArrayValue**(`variable`, `key`): `Promise`<`unknown`\>

Get the value (by key) of an associative int array in ChucK.
e.g. theChucK.getAssociateIntArrayValue("var", "key");

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variable` | `string` | name of gobal associative int arry |
| `key` | `string` | the key index to get |

#### Returns

`Promise`<`unknown`\>

deferred promise with associative int array value

___

### getFloat

▸ **getFloat**(`variable`): `Promise`<`unknown`\>

Get the value of a global float variable in ChucK.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variable` | `string` | name of variable |

#### Returns

`Promise`<`unknown`\>

promise with value of the variable

___

### getFloatArray

▸ **getFloatArray**(`variable`): `Promise`<`unknown`\>

Get the values of a global float array in ChucK.
e.g. theChucK.getFloatArray("var");

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variable` | `string` | name of float array |

#### Returns

`Promise`<`unknown`\>

deferred promise of float values

___

### getFloatArrayValue

▸ **getFloatArrayValue**(`variable`, `index`): `Promise`<`unknown`\>

Get the float value of a global float arry by index.
e.g. theChucK.getFloatArray("var", index);

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variable` | `string` | name of float arry |
| `index` | `number` | indfex of element |

#### Returns

`Promise`<`unknown`\>

deferred promise of float value

___

### getInt

▸ **getInt**(`variable`): `Promise`<`unknown`\>

Get the value of a global int variable in ChucK.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variable` | `string` | name of variable |

#### Returns

`Promise`<`unknown`\>

promise with value of the variable

___

### getIntArray

▸ **getIntArray**(`variable`): `Promise`<`unknown`\>

Get the values of a global int array in ChucK.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variable` | `string` | name of int array variable |

#### Returns

`Promise`<`unknown`\>

promise to array of numbers

___

### getIntArrayValue

▸ **getIntArrayValue**(`variable`, `index`): `Promise`<`unknown`\>

Get a single value (by index) in a global int array in ChucK.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variable` | `string` | name of int array variable |
| `index` | `number` | array index to get |

#### Returns

`Promise`<`unknown`\>

promise to the value

___

### getParamFloat

▸ **getParamFloat**(`name`): `Promise`<`unknown`\>

Get an internal ChucK VM float parameter

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | name of value to get |

#### Returns

`Promise`<`unknown`\>

deferred promise with float value

___

### getParamInt

▸ **getParamInt**(`name`): `Promise`<`unknown`\>

Get an internal ChucK VM integer parameter
e.g. "SAMPLE_RATE", "INPUT_CHANNELS", "OUTPUT_CHANNELS", "BUFFER_SIZE", "IS_REAL_TIME_AUDIO_HINT".

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | name of value to get |

#### Returns

`Promise`<`unknown`\>

deferred promise with int value

___

### getParamString

▸ **getParamString**(`name`): `Promise`<`unknown`\>

Get an internal ChucK VM string parameter
e.g. "VERSION"

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | name of value to get e.g. ("VERSION") |

#### Returns

`Promise`<`unknown`\>

promise with string value

___

### getString

▸ **getString**(`variable`): `Promise`<`unknown`\>

Get the value of a global string variable in ChucK.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variable` | `string` | name of string variable |

#### Returns

`Promise`<`unknown`\>

promise with string value

___

### isShredActive

▸ **isShredActive**(`shred`): `Promise`<`unknown`\>

Check if a shred from ChucK VM is running

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `shred` | `string` \| `number` | which shred ID to check |

#### Returns

`Promise`<`unknown`\>

promise to whether Shred was is running

___

### listenForEventOnce

▸ **listenForEventOnce**(`variable`, `callback`): `void`

<more information needed>

#### Parameters

| Name | Type |
| :------ | :------ |
| `variable` | `string` |
| `callback` | () => `void` |

#### Returns

`void`

___

### loadFile

▸ **loadFile**(`url`): `Promise`<`void`\>

Automatically fetch and load in a file from a URL to ChucK's virtual filesystem

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `url` | `string` | URL to a file to fetch and load file |

#### Returns

`Promise`<`void`\>

___

### nextDeferID

▸ `Private` **nextDeferID**(): `number`

Private function for ChucK to handle execution of tasks. 
Will create a Deferred Promise that wraps a task for WebChucK to execute

#### Returns

`number`

callbackID to a an action for ChucK to perform

___

### now

▸ **now**(): `Promise`<`unknown`\>

Get the current time of the ChucK VM

#### Returns

`Promise`<`unknown`\>

promise to current Chuck time in samples

___

### receiveMessage

▸ `Private` **receiveMessage**(`event`): `void`

Internal: Message receiving from ChucK to JS

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `MessageEvent`<`any`\> |

#### Returns

`void`

___

### removeEventListener

▸ **removeEventListener**<`K`\>(`type`, `listener`, `options?`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends ``"processorerror"`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `K` |
| `listener` | (`this`: `AudioWorkletNode`, `ev`: `AudioWorkletNodeEventMap`[`K`]) => `any` |
| `options?` | `boolean` \| `EventListenerOptions` |

#### Returns

`void`

#### Inherited from

window.AudioWorkletNode.removeEventListener

▸ **removeEventListener**(`type`, `listener`, `options?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `string` |
| `listener` | `EventListenerOrEventListenerObject` |
| `options?` | `boolean` \| `EventListenerOptions` |

#### Returns

`void`

#### Inherited from

window.AudioWorkletNode.removeEventListener

___

### removeLastCode

▸ **removeLastCode**(): `Promise`<`unknown`\>

Remove the last running shred

#### Returns

`Promise`<`unknown`\>

promise to the shred ID that was removed

___

### removeShred

▸ **removeShred**(`shred`): `Promise`<`unknown`\>

Remove a shred from ChucK VM by ID

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `shred` | `string` \| `number` | shred ID to be removed |

#### Returns

`Promise`<`unknown`\>

promise to whether Shred was removed successfully

___

### replaceCode

▸ **replaceCode**(`code`): `Promise`<`unknown`\>

Replace last running shred with string of ChucK code to execute

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `code` | `string` | ChucK code string to replace last Shred |

#### Returns

`Promise`<`unknown`\>

promise to shred ID that is removed

___

### replaceCodeWithReplacementDac

▸ **replaceCodeWithReplacementDac**(`code`, `dacName`): `Promise`<`unknown`\>

Replace last running shred with string of ChucK code to execute, to another dac (??)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `code` | `string` | ChucK code string to replace last Shred |
| `dacName` | `string` | dac for ChucK (??) |

#### Returns

`Promise`<`unknown`\>

promise to shred ID

___

### replaceFile

▸ **replaceFile**(`filename`): `Promise`<`unknown`\>

Replace the last running shred with a file to execute.
Note that the file must already be in the WebChucK virtual file system via preloadedFiles[], createFile(), or loadFile()

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `filename` | `string` | file to be replace last |

#### Returns

`Promise`<`unknown`\>

promise to shred ID

___

### replaceFileWithArgs

▸ **replaceFileWithArgs**(`filename`, `colonSeparatedArgs`): `Promise`<`unknown`\>

Replace the last running shred with a file to execute, passing arguments.
Note that the file must already be in the WebChucK virtual file system via preloadedFiles[], createFile(), or loadFile()

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `filename` | `string` | file to be replace last running shred |
| `colonSeparatedArgs` | `string` | arguments to pass in to file |

#### Returns

`Promise`<`unknown`\>

promise to shred ID

___

### replaceFileWithArgsWithReplacementDac

▸ **replaceFileWithArgsWithReplacementDac**(`filename`, `colonSeparatedArgs`, `dacName`): `Promise`<`unknown`\>

Replace the last running shred with a file to execute, passing arguments, and dac.
Note that the file must already be in the WebChucK virtual file system via preloadedFiles[], createFile(), or loadFile()

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `filename` | `string` | file to be replace last running shred |
| `colonSeparatedArgs` | `string` | arguments to pass in to file |
| `dacName` | `string` | dac for ChucK (??) |

#### Returns

`Promise`<`unknown`\>

promise to shred ID

___

### replaceFileWithReplacementDac

▸ **replaceFileWithReplacementDac**(`filename`, `dacName`): `Promise`<`unknown`\>

Replace the last running shred with a file to execute.
Note that the file must already be in the WebChucK virtual file system via preloadedFiles[], createFile(), or loadFile()

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `filename` | `string` | file to be replace last |
| `dacName` | `string` | dac for ChucK (??) |

#### Returns

`Promise`<`unknown`\>

promise to shred ID

___

### runCode

▸ **runCode**(`code`): `Promise`<`unknown`\>

Run a string of ChucK code

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `code` | `string` | ChucK code string to be executed |

#### Returns

`Promise`<`unknown`\>

promise to the shred ID

___

### runCodeWithReplacementDac

▸ **runCodeWithReplacementDac**(`code`, `dacName`): `Promise`<`unknown`\>

Run a string of ChucK code using a different dac (unsure of functionality)
-tf (5/30/2023)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `code` | `string` | ChucK code string to be executed |
| `dacName` | `string` | dac for ChucK (??) |

#### Returns

`Promise`<`unknown`\>

promise to the shred ID

___

### runFile

▸ **runFile**(`filename`): `Promise`<`unknown`\>

Run a ChucK file that is already in the WebChucK virtual file system.
Note that the file must already have been loaded via preloadedFiles[], createFile(), or loadFile()

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `filename` | `string` | ChucK file to be run |

#### Returns

`Promise`<`unknown`\>

promise to shred ID

___

### runFileWithArgs

▸ **runFileWithArgs**(`filename`, `colonSeparatedArgs`): `Promise`<`unknown`\>

Run a ChucK file that is already in the WebChucK virtual file system with arguments.
e.g. native equivalent of `chuck myFile:arg`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `filename` | `string` | ChucK file to be run |
| `colonSeparatedArgs` | `string` | arguments to pass to the file |

#### Returns

`Promise`<`unknown`\>

promise to shred ID

___

### runFileWithArgsWithReplacementDac

▸ **runFileWithArgsWithReplacementDac**(`filename`, `colonSeparatedArgs`, `dacName`): `Promise`<`unknown`\>

Run a ChucK file that is already in the WebChucK virtual file system with arguments.
e.g. native equivalent of `chuck myFile:arg`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `filename` | `string` | ChucK file to be run |
| `colonSeparatedArgs` | `string` | arguments to pass to the file |
| `dacName` | `string` | dac for ChucK (??) |

#### Returns

`Promise`<`unknown`\>

promise to shred ID

___

### runFileWithReplacementDac

▸ **runFileWithReplacementDac**(`filename`, `dacName`): `Promise`<`unknown`\>

Run a ChucK file that is already in the WebChucK virtual file system, on separate dac (??).
Note that the file must already have been loaded via preloadedFiles[], createFile(), or loadFile()

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `filename` | `string` | ChucK file to be run |
| `dacName` | `string` | dac for ChucK (??) |

#### Returns

`Promise`<`unknown`\>

promise to shred ID

___

### sendMessage

▸ `Private` **sendMessage**(`type`, `body?`): `void`

Internal: Message sending from JS to ChucK

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `OutMessage` |
| `body?` | `Object` |

#### Returns

`void`

___

### setAssociativeFloatArrayValue

▸ **setAssociativeFloatArrayValue**(`variable`, `key`, `value`): `void`

Set the value (by key) of an associative float array in ChucK.
Note that "associative array" is ChucK's version of a dictionary with string keys mapping to values (see ChucK documentation).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variable` | `string` | name of global associative float array to set |
| `key` | `string` | the key index of the associative array |
| `value` | `number` | the new value |

#### Returns

`void`

___

### setAssociativeIntArrayValue

▸ **setAssociativeIntArrayValue**(`variable`, `key`, `value`): `void`

Set the value (by key) of an associative int array in ChucK.
Note that "associative array" is ChucK's version of a dictionary with string keys mapping to values (see ChucK documentation).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variable` | `string` | name of global associative int array to set |
| `key` | `string` | the key index of the associative array |
| `value` | `string` \| `number` | the new value |

#### Returns

`void`

___

### setFloat

▸ **setFloat**(`variable`, `value`): `void`

Set the value of a global float variable in ChucK

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variable` | `string` | name of variable |
| `value` | `number` | value to set |

#### Returns

`void`

___

### setFloatArray

▸ **setFloatArray**(`variable`, `values`): `void`

Set the values of a global float array in ChucK

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variable` | `string` | name of float array |
| `values` | `number`[] | values to set |

#### Returns

`void`

___

### setFloatArrayValue

▸ **setFloatArrayValue**(`variable`, `index`, `value`): `void`

Set the float value of a global float array by index

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variable` | `string` | name of float array |
| `index` | `number` | index of element |
| `value` | `number` | value to set |

#### Returns

`void`

___

### setInt

▸ **setInt**(`variable`, `value`): `void`

Set the value of a global int variable in ChucK

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variable` | `string` | name of variable |
| `value` | `number` | value to set |

#### Returns

`void`

___

### setIntArray

▸ **setIntArray**(`variable`, `values`): `void`

Set the values of a global int array in ChucK

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variable` | `string` | name of int array variable |
| `values` | `number`[] | array of numbers |

#### Returns

`void`

___

### setIntArrayValue

▸ **setIntArrayValue**(`variable`, `index`, `value`): `void`

Set a single value (by index) in a global int array in ChucK

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variable` | `string` | name of int array variable |
| `index` | `number` | array index to set |
| `value` | `number`[] | value to set |

#### Returns

`void`

___

### setParamFloat

▸ **setParamFloat**(`name`, `value`): `void`

Set an internal ChucK VM float parameter

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | name of value to set |
| `value` | `number` | value to set |

#### Returns

`void`

___

### setParamInt

▸ **setParamInt**(`name`, `value`): `void`

Set an internal ChucK VM integer parameter.
e.g. "SAMPLE_RATE", "INPUT_CHANNELS", "OUTPUT_CHANNELS", "IS_REAL_TIME_AUDIO_HINT", "TTY_COLOR".

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | name of value to set |
| `value` | `number` | value to set |

#### Returns

`void`

___

### setParamString

▸ **setParamString**(`name`, `value`): `void`

Set an internal ChucK VM string parameter

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | name of value to set |
| `value` | `string` | value to set |

#### Returns

`void`

___

### setString

▸ **setString**(`variable`, `value`): `void`

Set the value of a global string variable in ChucK

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variable` | `string` | name of string variable |
| `value` | `string` | new string to set |

#### Returns

`void`

___

### signalEvent

▸ **signalEvent**(`variable`): `void`

Signal a ChucK event, will wake the first waiting Shred

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variable` | `string` | ChucK event variable to be signaled |

#### Returns

`void`

___

### startListeningForEvent

▸ **startListeningForEvent**(`variable`, `callback`): `number`

<more information needed>

#### Parameters

| Name | Type |
| :------ | :------ |
| `variable` | `string` |
| `callback` | () => `void` |

#### Returns

`number`

___

### stopListeningForEvent

▸ **stopListeningForEvent**(`variable`, `callbackID`): `void`

<more information needed>

#### Parameters

| Name | Type |
| :------ | :------ |
| `variable` | `string` |
| `callbackID` | `number` |

#### Returns

`void`

___

### init

▸ `Static` **init**(`filenamesToPreload`, `audioContext?`, `numOutChannels?`, `whereIsChuck?`): `Promise`<[`Chuck`](Chuck.md)\>

Call me to initialize a ChucK Web Audio Node. Generally you only need one instance of this.

**`Example`**

```ts
theChuck = await Chuck.init([]); // initialize ChucK with no preloaded files
```

**`Example`**

```ts
theChuck = await Chuck.init([{serverFilename: "./filename.ck", virtualFilename: "filename.ck"}...]); // initialize ChucK with preloaded files
```

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `filenamesToPreload` | `Filename`[] | `undefined` | Array of Files to preload into ChucK's filesystem [{serverFilename: "./filename", virtualFilename: "filename"}...] |
| `audioContext?` | `AudioContext` | `undefined` | Optional parameter if you want to use your own AudioContext. Otherwise, a new one will be created and the node will be connected to the output destination. |
| `numOutChannels` | `number` | `2` | Optional number of output channels. Default is 2 and Web Audio supports up to 32. |
| `whereIsChuck` | `string` | `"https://chuck.stanford.edu/webchuck/src/"` | Optional url to your src folder containing webchuck.js and webchuck.wasm |

#### Returns

`Promise`<[`Chuck`](Chuck.md)\>

WebChucK ChucK instance
