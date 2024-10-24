import { Gyro_ck, GyroMsg_ck } from "./gyroCk";
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
    /** @internal */
    constructor(theChuck) {
        this._gyroActive = false;
        // Initialize members
        this.theChuck = theChuck;
        this.boundHandleOrientation = this.handleOrientation.bind(this);
    }
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
    static async init(theChuck, enableGyro = true) {
        const gyro = new Gyro(theChuck);
        // Add Gyro and GyroMsg classes to ChucK VM
        await gyro.theChuck.runCode(GyroMsg_ck);
        await gyro.theChuck.runCode(Gyro_ck);
        // Enable mouse and keyboard
        if (enableGyro)
            gyro.enableGyro();
        return gyro;
    }
    /**
     * @internal
     * Check if gyro is active
     */
    async gyroActive() {
        const x = await this.theChuck.getInt("_gyroActive");
        this._gyroActive = x == 1;
    }
    /**
     * Enable Javascript event (DeviceOrientationEvent) listeners for Gyro
     * @example
     * ```ts
     * // If gyro is not yet enabled
     * gyro.enableGyro();
     * ```
     */
    enableGyro() {
        window.addEventListener("deviceorientation", this.boundHandleOrientation);
    }
    /**
     * Disable Javascript event (DeviceOrientationEvent) listeners for Gyro
     * @example
     * ```ts
     * // If gyro is enabled
     * gyro.disableGyro();
     * ```
     */
    disableGyro() {
        window.removeEventListener("deviceorientation", this.boundHandleOrientation);
    }
    //-----------------------------------------
    // JAVASCRIPT HID EVENT HANDLERS
    //-----------------------------------------
    /** @internal */
    handleOrientation(event) {
        this.gyroActive();
        if (this._gyroActive) {
            this.theChuck.setFloat("_gyroX", event.alpha ? event.alpha : 0.0);
            this.theChuck.setFloat("_gyroY", event.beta ? event.beta : 0.0);
            this.theChuck.setFloat("_gyroZ", event.gamma ? event.gamma : 0.0);
            this.theChuck.broadcastEvent("_gyroReading");
        }
    }
}
