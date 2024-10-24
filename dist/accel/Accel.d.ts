import Chuck from "../Chuck";
/**
 * Introducing Accel (accelerometer, on mobile) support for WebChucK. Accel
 * wraps JavaScript `DeviceMotionEvent` listeners easing access to mobile device
 * accelerometers in WebChucK code.
 *
 * To get started with Accel:
 *
 * ```ts
 * import { Chuck, Accel } from "webchuck";
 *
 * const theChuck = await Chuck.init([]);
 * const accel = await Accel.init(theChuck); // Initialize Accel
 * ```
 *
 * The `devicemotion` event gives the acceleration of the device on the
 * three axes: x, y, and z. Acceleration is expressed in m/s².
 * More on the `devicemotion` event can be found online
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/Window/devicemotion_event | here }.
 *
 * iOS devices require that the web developer ask permission from the user to
 * access sensors after a button push. This looks like:
 *
 * ```ts
 * let runButton = document.getElementById("run");
 *
 * runButton.addEventListener("click", async () => {
 *   // Request iOS accelerometer permission
 *   if (typeof DeviceMotionEvent.requestPermission === 'function') {
 *     await DeviceMotionEvent.requestPermission();
 *   }
 *
 *   await theChuck.loadFile("./yourChuckCode.ck");
 *   theChuck.runFile("yourChuckCode.ck");
 * });
 * ```
 */
export default class Accel {
    private theChuck;
    private _accelActive;
    private boundHandleMotion;
    /** @internal */
    constructor(theChuck: Chuck);
    /**
     * Initialize Accel functionality in your WebChucK instance.
     * This adds a `Accel` and `AccelMsg` class to the ChucK Virtual Machine (VM).
     * Accelerometer event (DeviceMotionEvent) listeners are added if `enableAccel` is true (default).
     * @example
     * ```ts
     * theChuck = await Chuck.init([]);
     * accel = await Accel.init(theChuck); // Initialize Accel
     */
    static init(theChuck: Chuck, enableAccel?: boolean): Promise<Accel>;
    /**
     * @internal
     * Check if accel is active
     */
    accelActive(): Promise<void>;
    /**
     * Enable Javascript event (DeviceMotionEvent) listeners for Accel
     * @example
     * ```ts
     * // If accel is not yet enabled
     * accel.enableAccel();
     * ```
     */
    enableAccel(): void;
    /**
     * Disable Javascript event (DeviceMotionEvent) listeners for Accel
     * @example
     * ```ts
     * // If accel is enabled
     * accel.disableAccel();
     * ```
     */
    disableAccel(): void;
    /** @internal */
    private handleMotion;
}
