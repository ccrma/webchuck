import Chuck from "./Chuck";
/**
 * Introducing Accel (accelerometer, on mobile) support for WebChucK. Accel wraps
 * JavaScript DeviceMotionEvent listeners easing access to mobile device accelerometers
 * in WebChucK code.
 *
 * To get started with Accel:
 * @example
 * ```ts
 * import { Chuck, Accel } from "webchuck";
 *
 * const theChuck = await Chuck.init([]);
 * const accel = await Accel.init(theChuck); // Initialize Accel
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
