/**
 * DeferredPromise is a utility class that enables resolving or rejecting
 * promises externally. This is particularly useful when working with asynchronous
 * communication, like with a Worker or in this case WebChuck.
 *
 * @typeparam `T` The type of the resolved value. Defaults to any if not provided.
 */
export default class DeferredPromise<T = any> {
    readonly promise: Promise<T>;
    resolve: undefined | ((value: T) => void);
    reject: undefined | ((msg: string) => void);
    /**
     * Constructs a new DeferredPromise instance, initializing the promise
     * and setting up the resolve and reject methods.
     */
    constructor();
    /**
     * Returns the Promise to value `T` from the DeferredPromise. WebChucK occasionally returns a DeferredPromise and the value can be accessed in the following way:
     *
     * @example
     * ```ts
     * const deferredPromise = new DeferredPromise();
     * const value = await deferredPromise.value(); // await the Promise to value `T`
     * ```
     * @returns Promise to value `T`. If resolved, the value is returned. If rejected, the error is thrown.
     */
    value(): Promise<T>;
}
