# Class: DeferredPromise<T\>

DeferredPromise is a utility class that enables resolving or rejecting
promises externally. This is particularly useful when working with async
communication, like with a Worker.

**`Typeparam`**

T The type of the resolved value. Defaults to any if not provided.

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

## Table of contents

### Constructors

- [constructor](DeferredPromise.md#constructor)

### Properties

- [promise](DeferredPromise.md#promise)
- [reject](DeferredPromise.md#reject)
- [resolve](DeferredPromise.md#resolve)

## Constructors

### constructor

• **new DeferredPromise**<`T`\>()

Constructs a new DeferredPromise instance, initializing the promise
and setting up the resolve and reject methods.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

## Properties

### promise

• `Readonly` **promise**: `Promise`<`T`\>

___

### reject

• **reject**: `undefined` \| (`msg`: `string`) => `void`

___

### resolve

• **resolve**: `undefined` \| (`value`: `T`) => `void`
