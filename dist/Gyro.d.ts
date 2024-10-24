import Chuck from "./Chuck";
/**
 * Introducing Gyro (gyroerometer, on mobile) support for WebChucK. Gyro wraps
 * JavaScript DeviceMotionEvent listeners easing access to mobile device gyroerometers
 * in WebChucK code.
 *
 * To get started with Gyro:
 * @example
 * ```ts
 * import { Chuck, Gyro } from "webchuck";
 *
 * const theChuck = await Chuck.init([]);
 * const gyro = await Gyro.init(theChuck); // Initialize Gyro
 * ```
 */
export default class Gyro {
    private theChuck;
    private _gyroActive;
    private boundHandleOrientation;
    /** @internal */
    constructor(theChuck: Chuck);
    /**
     * Initialize Gyro functionality in your WebChucK instance.
     * This adds a `Gyro` and `GyroMsg` class to the ChucK Virtual Machine (VM).
     * Gyroerometer event (DeviceMotionEvent) listeners are added if `enableGyro` is true (default).
     * @example
     * ```ts
     * theChuck = await Chuck.init([]);
     * gyro = await Gyro.init(theChuck); // Initialize Gyro
     */
    static init(theChuck: Chuck, enableGyro?: boolean): Promise<Gyro>;
    /**
     * @internal
     * Check if gyro is active
     */
    gyroActive(): Promise<void>;
    /**
     * Enable Javascript event (DeviceMotionEvent) listeners for Gyro
     * @example
     * ```ts
     * // If gyro is not yet enabled
     * gyro.enableGyro();
     * ```
     */
    enableGyro(): void;
    /**
    * Disable Javascript event (DeviceMotionEvent) listeners for Gyro
    * @example
    * ```ts
    * // If gyro is enabled
    * gyro.disableGyro();
    * ```
    */
    disableGyro(): void;
    /** @internal */
    private handleOrientation;
}
