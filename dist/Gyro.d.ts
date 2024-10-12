import Chuck from "./Chuck";
/**
 * Introducing HID (Human Interface Device) support for WebChucK. HID wraps
 * JavaScript mouse/keyboard event listeners enabling mouse and keyboard
 * communication with the native {@link https://chuck.stanford.edu/doc/reference/io.html#Hid | HID}
 * class in ChucK.
 *
 * To get started with HID:
 * @example
 * ```ts
 * import { Chuck, HID } from "webchuck";
 *
 * const theChuck = await Chuck.init([]);
 * const hid = await HID.init(theChuck); // Initialize HID with mouse and keyboard
 * ```
 */
export default class Gyro {
    private theChuck;
    private _gyroActive;
    private boundHandleOrientation;
    /** @internal */
    constructor(theChuck: Chuck);
    /**
     * Initialize HID functionality in your WebChucK instance.
     * This adds a `Hid` and `HidMsg` class to the ChucK Virtual Machine (VM).
     * Mouse and keyboard event listeners are added if `enableMouse` and `enableKeyboard` are true (default).
     * @example
     * ```ts
     * theChuck = await Chuck.init([]);
     * hid = await HID.init(theChuck); // Initialize HID with mouse and keyboard
     * ```
     * @example
     * ```ts
     * theChuck = await Chuck.init([]);
     * hid = await HID.init(theChuck, false, true); // Initialize HID, no mouse, only keyboard
     * ```
     * @param theChuck WebChucK instance
     * @param enableMouse boolean to enable mouse HID
     * @param enableKeyboard boolean to enable keyboard HID
     */
    static init(theChuck: Chuck, enableGyro?: boolean): Promise<Gyro>;
    /**
     * @internal
     * Check if gyro is active
     */
    gyroActive(): Promise<void>;
    /**
     * Enable Mouse HID Javascript event listeners for HID.
     * Adds a mousemove, mousedown, mouseup, and wheel listener to the document.
     * This will also disable the context menu on right click.
     * @example
     * ```ts
     * // If mouse HID is not yet enabled
     * hid.enableMouse();
     * ```
     */
    enableGyro(): void;
    /**
     * Disable Mouse HID Javascript event listeners
     * @example
     * ```ts
     * // If mouse HID is enabled
     * hid.disableMouse();
     * ```
     */
    disableGyro(): void;
    /** @internal */
    private handleOrientation;
}
