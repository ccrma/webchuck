import Chuck from "../Chuck";
/**
 * Introducing Gyro (gyroscope, on mobile) support for WebChucK. Gyro wraps
 * JavaScript `DeviceOrientationEvent` listeners easing access to mobile device
 * gyroscope in WebChucK code.
 *
 * To get started with Gyro:
 *
 * ```ts
 * import { Chuck, Gyro } from "webchuck";
 *
 * const theChuck = await Chuck.init([]);
 * const gyro = await Gyro.init(theChuck); // Initialize Gyro
 * ```
 *
 * The `deviceorientation` event gives motion of the device around the three
 * axes (x, y, and z) represented in degrees from 0 to 360. More on the
 * `deviceorientation` event can be found online
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/Window/deviceorientation_event | here }.
 *
 * iOS devices require that the web developer ask permission from the user
 * to access sensors after a button push. This looks like:
 *
 * ```ts
 * let runButton = document.getElementById("run");
 *
 * runButton.addEventListener("click", async () => {
 *   // Request iOS gyroscope permission
 *   if (typeof DeviceOrientationEvent.requestPermission === 'function') {
 *     await DeviceOrientationEvent.requestPermission();
 *   }
 *
 *   await theChuck.loadFile("./yourChuckCode.ck");
 *   theChuck.runFile("yourChuckCode.ck");
 * });
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
     * Gyrscope event (DeviceOrientationEvent) listeners are added if `enableGyro`
     * is true (default).
     *
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
     * Enable Javascript event (DeviceOrientationEvent) listeners for Gyro
     * @example
     * ```ts
     * // If gyro is not yet enabled
     * gyro.enableGyro();
     * ```
     */
    enableGyro(): void;
    /**
     * Disable Javascript event (DeviceOrientationEvent) listeners for Gyro
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
