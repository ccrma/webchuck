/**
 * DeferredPromise is a utility class that enables resolving or rejecting
 * promises externally. This is particularly useful when working with async
 * communication, like with a Worker.
 *
 * @typeparam T The type of the resolved value. Defaults to any if not provided.
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
     * Get the value from any Deferred Promise
     * @returns value from resolve/reject
     */
    value(): Promise<T>;
}
