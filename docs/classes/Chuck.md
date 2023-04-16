# Class: Chuck

## Table of contents

### Constructors

- [constructor](Chuck.md#constructor)

### Properties

- [audioWorkletNode](Chuck.md#audioworkletnode)
- [deferredPromiseCounter](Chuck.md#deferredpromisecounter)
- [deferredPromises](Chuck.md#deferredpromises)
- [eventCallbackCounter](Chuck.md#eventcallbackcounter)
- [eventCallbacks](Chuck.md#eventcallbacks)
- [isReady](Chuck.md#isready)

### Accessors

- [context](Chuck.md#context)
- [numberOfInputs](Chuck.md#numberofinputs)
- [numberOfOutputs](Chuck.md#numberofoutputs)

### Methods

- [broadcastEvent](Chuck.md#broadcastevent)
- [clearChuckInstance](Chuck.md#clearchuckinstance)
- [clearGlobals](Chuck.md#clearglobals)
- [createFile](Chuck.md#createfile)
- [getAssociativeFloatArrayValue](Chuck.md#getassociativefloatarrayvalue)
- [getAssociativeIntArrayValue](Chuck.md#getassociativeintarrayvalue)
- [getFloat](Chuck.md#getfloat)
- [getFloatArray](Chuck.md#getfloatarray)
- [getFloatArrayValue](Chuck.md#getfloatarrayvalue)
- [getInt](Chuck.md#getint)
- [getIntArray](Chuck.md#getintarray)
- [getIntArrayValue](Chuck.md#getintarrayvalue)
- [getString](Chuck.md#getstring)
- [isShredActive](Chuck.md#isshredactive)
- [listenForEventOnce](Chuck.md#listenforeventonce)
- [nextDeferID](Chuck.md#nextdeferid)
- [receiveMessage](Chuck.md#receivemessage)
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
- [setString](Chuck.md#setstring)
- [signalEvent](Chuck.md#signalevent)
- [startListeningForEvent](Chuck.md#startlisteningforevent)
- [stopListeningForEvent](Chuck.md#stoplisteningforevent)
- [init](Chuck.md#init)

## Constructors

### constructor

• **new Chuck**(`preloadedFiles`, `audioContext`, `wasm`, `chuckID?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `preloadedFiles` | `File`[] | `undefined` |
| `audioContext` | `AudioContext` | `undefined` |
| `wasm` | `ArrayBuffer` | `undefined` |
| `chuckID` | `number` | `1` |

## Properties

### audioWorkletNode

• `Private` **audioWorkletNode**: `AudioWorkletNode`

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

## Accessors

### context

• `get` **context**(): `BaseAudioContext`

#### Returns

`BaseAudioContext`

___

### numberOfInputs

• `get` **numberOfInputs**(): `number`

#### Returns

`number`

___

### numberOfOutputs

• `get` **numberOfOutputs**(): `number`

#### Returns

`number`

## Methods

### broadcastEvent

▸ **broadcastEvent**(`variable`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `variable` | `string` |

#### Returns

`void`

___

### clearChuckInstance

▸ **clearChuckInstance**(): `void`

#### Returns

`void`

___

### clearGlobals

▸ **clearGlobals**(): `void`

#### Returns

`void`

___

### createFile

▸ **createFile**(`directory`, `filename`, `data`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `directory` | `string` |
| `filename` | `string` |
| `data` | `string` |

#### Returns

`void`

___

### getAssociativeFloatArrayValue

▸ **getAssociativeFloatArrayValue**(`variable`, `key`): [`DeferredPromise`](DeferredPromise.md)<`unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `variable` | `string` |
| `key` | `string` |

#### Returns

[`DeferredPromise`](DeferredPromise.md)<`unknown`\>

___

### getAssociativeIntArrayValue

▸ **getAssociativeIntArrayValue**(`variable`, `key`): [`DeferredPromise`](DeferredPromise.md)<`unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `variable` | `string` |
| `key` | `string` |

#### Returns

[`DeferredPromise`](DeferredPromise.md)<`unknown`\>

___

### getFloat

▸ **getFloat**(`variable`): [`DeferredPromise`](DeferredPromise.md)<`unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `variable` | `string` |

#### Returns

[`DeferredPromise`](DeferredPromise.md)<`unknown`\>

___

### getFloatArray

▸ **getFloatArray**(`variable`): [`DeferredPromise`](DeferredPromise.md)<`unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `variable` | `string` |

#### Returns

[`DeferredPromise`](DeferredPromise.md)<`unknown`\>

___

### getFloatArrayValue

▸ **getFloatArrayValue**(`variable`, `index`): [`DeferredPromise`](DeferredPromise.md)<`unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `variable` | `string` |
| `index` | `number` |

#### Returns

[`DeferredPromise`](DeferredPromise.md)<`unknown`\>

___

### getInt

▸ **getInt**(`variable`): [`DeferredPromise`](DeferredPromise.md)<`unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `variable` | `string` |

#### Returns

[`DeferredPromise`](DeferredPromise.md)<`unknown`\>

___

### getIntArray

▸ **getIntArray**(`variable`): [`DeferredPromise`](DeferredPromise.md)<`unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `variable` | `string` |

#### Returns

[`DeferredPromise`](DeferredPromise.md)<`unknown`\>

___

### getIntArrayValue

▸ **getIntArrayValue**(`variable`, `index`): [`DeferredPromise`](DeferredPromise.md)<`unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `variable` | `string` |
| `index` | `number` |

#### Returns

[`DeferredPromise`](DeferredPromise.md)<`unknown`\>

___

### getString

▸ **getString**(`variable`): [`DeferredPromise`](DeferredPromise.md)<`unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `variable` | `string` |

#### Returns

[`DeferredPromise`](DeferredPromise.md)<`unknown`\>

___

### isShredActive

▸ **isShredActive**(`shred`): [`DeferredPromise`](DeferredPromise.md)<`unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `shred` | `string` |

#### Returns

[`DeferredPromise`](DeferredPromise.md)<`unknown`\>

___

### listenForEventOnce

▸ **listenForEventOnce**(`variable`, `callback`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `variable` | `string` |
| `callback` | () => `void` |

#### Returns

`void`

___

### nextDeferID

▸ `Private` **nextDeferID**(): `number`

#### Returns

`number`

___

### receiveMessage

▸ `Private` **receiveMessage**(`event`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `MessageEvent`<`any`\> |

#### Returns

`any`

___

### removeLastCode

▸ **removeLastCode**(): [`DeferredPromise`](DeferredPromise.md)<`unknown`\>

#### Returns

[`DeferredPromise`](DeferredPromise.md)<`unknown`\>

___

### removeShred

▸ **removeShred**(`shred`): [`DeferredPromise`](DeferredPromise.md)<`unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `shred` | `string` |

#### Returns

[`DeferredPromise`](DeferredPromise.md)<`unknown`\>

___

### replaceCode

▸ **replaceCode**(`code`): [`DeferredPromise`](DeferredPromise.md)<`unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `code` | `string` |

#### Returns

[`DeferredPromise`](DeferredPromise.md)<`unknown`\>

___

### replaceCodeWithReplacementDac

▸ **replaceCodeWithReplacementDac**(`code`, `dacName`): [`DeferredPromise`](DeferredPromise.md)<`unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `code` | `string` |
| `dacName` | `string` |

#### Returns

[`DeferredPromise`](DeferredPromise.md)<`unknown`\>

___

### replaceFile

▸ **replaceFile**(`filename`): [`DeferredPromise`](DeferredPromise.md)<`unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `filename` | `string` |

#### Returns

[`DeferredPromise`](DeferredPromise.md)<`unknown`\>

___

### replaceFileWithArgs

▸ **replaceFileWithArgs**(`filename`, `colonSeparatedArgs`): [`DeferredPromise`](DeferredPromise.md)<`unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `filename` | `string` |
| `colonSeparatedArgs` | `string` |

#### Returns

[`DeferredPromise`](DeferredPromise.md)<`unknown`\>

___

### replaceFileWithArgsWithReplacementDac

▸ **replaceFileWithArgsWithReplacementDac**(`filename`, `colonSeparatedArgs`, `dacName`): [`DeferredPromise`](DeferredPromise.md)<`unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `filename` | `string` |
| `colonSeparatedArgs` | `string` |
| `dacName` | `string` |

#### Returns

[`DeferredPromise`](DeferredPromise.md)<`unknown`\>

___

### replaceFileWithReplacementDac

▸ **replaceFileWithReplacementDac**(`filename`, `dacName`): [`DeferredPromise`](DeferredPromise.md)<`unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `filename` | `string` |
| `dacName` | `string` |

#### Returns

[`DeferredPromise`](DeferredPromise.md)<`unknown`\>

___

### runCode

▸ **runCode**(`code`): [`DeferredPromise`](DeferredPromise.md)<`unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `code` | `string` |

#### Returns

[`DeferredPromise`](DeferredPromise.md)<`unknown`\>

___

### runCodeWithReplacementDac

▸ **runCodeWithReplacementDac**(`code`, `dacName`): [`DeferredPromise`](DeferredPromise.md)<`unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `code` | `string` |
| `dacName` | `string` |

#### Returns

[`DeferredPromise`](DeferredPromise.md)<`unknown`\>

___

### runFile

▸ **runFile**(`filename`): [`DeferredPromise`](DeferredPromise.md)<`unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `filename` | `string` |

#### Returns

[`DeferredPromise`](DeferredPromise.md)<`unknown`\>

___

### runFileWithArgs

▸ **runFileWithArgs**(`filename`, `colonSeparatedArgs`): [`DeferredPromise`](DeferredPromise.md)<`unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `filename` | `string` |
| `colonSeparatedArgs` | `string` |

#### Returns

[`DeferredPromise`](DeferredPromise.md)<`unknown`\>

___

### runFileWithArgsWithReplacementDac

▸ **runFileWithArgsWithReplacementDac**(`filename`, `colonSeparatedArgs`, `dacName`): [`DeferredPromise`](DeferredPromise.md)<`unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `filename` | `string` |
| `colonSeparatedArgs` | `string` |
| `dacName` | `string` |

#### Returns

[`DeferredPromise`](DeferredPromise.md)<`unknown`\>

___

### runFileWithReplacementDac

▸ **runFileWithReplacementDac**(`filename`, `dacName`): [`DeferredPromise`](DeferredPromise.md)<`unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `filename` | `string` |
| `dacName` | `string` |

#### Returns

[`DeferredPromise`](DeferredPromise.md)<`unknown`\>

___

### sendMessage

▸ `Private` **sendMessage**(`type`, `body?`): `void`

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

#### Parameters

| Name | Type |
| :------ | :------ |
| `variable` | `string` |
| `key` | `string` |
| `value` | `number` |

#### Returns

`void`

___

### setAssociativeIntArrayValue

▸ **setAssociativeIntArrayValue**(`variable`, `key`, `value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `variable` | `string` |
| `key` | `string` |
| `value` | `string` |

#### Returns

`void`

___

### setFloat

▸ **setFloat**(`variable`, `value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `variable` | `string` |
| `value` | `number` |

#### Returns

`void`

___

### setFloatArray

▸ **setFloatArray**(`variable`, `values`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `variable` | `string` |
| `values` | `number`[] |

#### Returns

`void`

___

### setFloatArrayValue

▸ **setFloatArrayValue**(`variable`, `index`, `value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `variable` | `string` |
| `index` | `number` |
| `value` | `number` |

#### Returns

`void`

___

### setInt

▸ **setInt**(`variable`, `value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `variable` | `string` |
| `value` | `number` |

#### Returns

`void`

___

### setIntArray

▸ **setIntArray**(`variable`, `values`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `variable` | `string` |
| `values` | `number`[] |

#### Returns

`void`

___

### setIntArrayValue

▸ **setIntArrayValue**(`variable`, `index`, `value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `variable` | `string` |
| `index` | `number` |
| `value` | `number`[] |

#### Returns

`void`

___

### setString

▸ **setString**(`variable`, `value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `variable` | `string` |
| `value` | `string` |

#### Returns

`void`

___

### signalEvent

▸ **signalEvent**(`variable`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `variable` | `string` |

#### Returns

`void`

___

### startListeningForEvent

▸ **startListeningForEvent**(`variable`, `callback`): `number`

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

#### Parameters

| Name | Type |
| :------ | :------ |
| `variable` | `string` |
| `callbackID` | `number` |

#### Returns

`void`

___

### init

▸ `Static` **init**(`filenamesToPreload`): `Promise`<[`Chuck`](Chuck.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `filenamesToPreload` | `Filename`[] |

#### Returns

`Promise`<[`Chuck`](Chuck.md)\>
