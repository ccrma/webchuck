import Chuck from "../Chuck";
/**
 * HID (Human Interface Device) support for WebChucK. HID wraps
 * JavaScript mouse/keyboard event listeners enabling mouse and keyboard
 * input via the {@link https://chuck.stanford.edu/doc/reference/io.html#Hid | HID}
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
export default class HID {
    private theChuck;
    private keymap;
    private _mouseActive;
    private _kbdActive;
    private boundHandleMouseMove;
    private boundHandleMouseDown;
    private boundHandleMouseUp;
    private boundHandleMouseWheel;
    private boundHandleKeyDown;
    private boundHandleKeyUp;
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
    static init(theChuck: Chuck, enableMouse?: boolean, enableKeyboard?: boolean): Promise<HID>;
    /**
     * @internal
     * Check if keyboard is active
     */
    kbdActive(): Promise<void>;
    /**
     * @internal
     * Check if mouse is active
     */
    mouseActive(): Promise<void>;
    /**
     * @internal
     * Get mouse position from the MouseEvent
     * @param mouseEvent Mouse event
     * @returns mouse position
     */
    getMousePos(mouseEvent: MouseEvent): {
        x: number;
        y: number;
    };
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
    enableMouse(): void;
    /**
     * Disable Mouse HID Javascript event listeners
     * @example
     * ```ts
     * // If mouse HID is enabled
     * hid.disableMouse();
     * ```
     */
    disableMouse(): void;
    /**
     * Enable keyboard HID Javascript event listeners for HID.
     * Adds a keydown and keyup listener to the document.
     * @example
     * ```ts
     * // If keyboard HID is not yet enabled
     * hid.enableKeyboard();
     * ```
     */
    enableKeyboard(): void;
    /**
     * Disable keyboard HID javascript event listeners
     * @example
     * ```ts
     * // If keyboard HID is enabled
     * hid.disableKeyboard();
     * ```
     */
    disableKeyboard(): void;
    /** @internal */
    private handleMouseMove;
    /** @internal */
    private handleMouseDown;
    /** @internal */
    private handleMouseUp;
    /** @internal */
    private handleMouseWheel;
    /** @internal */
    private static handleContextMenu;
    /** @internal */
    private handleKeyDown;
    /** @internal */
    private handleKeyUp;
    /**
     * @internal
     * Handle keyboard presses to send to chuck
     * @param e Keyboard event
     * @param isDown Is key down
     */
    private keyPressManager;
}
