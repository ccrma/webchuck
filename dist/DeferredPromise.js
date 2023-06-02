/**
 * DeferredPromise is a utility class that enables resolving or rejecting
 * promises externally. This is particularly useful when working with async
 * communication, like with a Worker.
 *
 * @typeparam T The type of the resolved value. Defaults to any if not provided.
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
     * Get the value from any Deferred Promise
     * @returns value from resolve/reject
     */
    async value() {
        // whether resolve or reject, return the value in the promise
        return await this.promise;
    }
}
