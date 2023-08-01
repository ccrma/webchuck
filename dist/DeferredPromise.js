/**
 * DeferredPromise is a utility class that enables resolving or rejecting
 * promises externally. This is particularly useful when working with asynchronous
 * communication, like with a Worker or in this case WebChuck.
 *
 * @typeparam `T` The type of the resolved value. Defaults to any if not provided.
 */
export default class DeferredPromise {
    /**
     * Constructs a new DeferredPromise instance, initializing the promise
     * and setting up the resolve and reject methods.
     */
    constructor() {
        this.resolve = undefined;
        this.reject = undefined;
        // Create a new promise and store the resolve and reject methods
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }
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
    async value() {
        // whether resolve or reject, return the value wrapped in this.promise
        return await this.promise;
    }
}
