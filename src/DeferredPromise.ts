/**
 * DeferredPromise is a utility class that enables resolving or rejecting
 * promises externally. This is particularly useful when working with async
 * communication, like with a Worker.
 *
 * @typeparam T The type of the resolved value. Defaults to any if not provided.
 */
export default class DeferredPromise<T = any> {
  // The promise instance that will be resolved or rejected externally
  public readonly promise: Promise<T>;

  // A method for resolving the promise with a value of type T
  public resolve: undefined | ((value: T) => void);

  // A method for rejecting the promise
  public reject: undefined | ((msg: string) => void);

  /**
   * Constructs a new DeferredPromise instance, initializing the promise
   * and setting up the resolve and reject methods.
   */
  public constructor() {
    this.resolve = undefined;
    this.reject = undefined;

    // Create a new promise and store the resolve and reject methods
    this.promise = new Promise<T>((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }

  /**
   * Get the value from any Deferred Promise
   * @returns value from resolve/reject
   */
  public async value() {
    // whether resolve or reject, return the value in the promise
    return await this.promise;
  }
}
