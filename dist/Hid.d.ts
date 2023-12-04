import Chuck from "./Chuck";
export default class HID {
    private theChuck;
    private keymap;
    private mousePos;
    private lastPos;
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
     * theChuck = await Chuck.init(); // Initialize WebChucK
     * hid = await HID.init(theChuck); // Initialize HID with mouse and keyboard
     * ```
     * @example
     * ```ts
     * theChuck = await Chuck.init(); // Initialize WebChucK
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
     * Enable Mouse HID Javascript event listeners to communicate with ChucK
     * Adds a mousemove, mousedown, mouseup, and wheel listener to the document.
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
     * Enable keyboard HID Javascript event listeners to communicate with ChucK.
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
    handleMouseMove(e: MouseEvent): void;
    /** @internal */
    handleMouseDown(e: MouseEvent): void;
    /** @internal */
    handleMouseUp(e: MouseEvent): void;
    /** @internal */
    handleMouseWheel(e: WheelEvent): void;
    /** @internal */
    handleKeyDown(e: KeyboardEvent): void;
    /** @internal */
    handleKeyUp(e: KeyboardEvent): void;
    /**
     * @internal
     * Handle keyboard presses to send to chuck
     * @param e Keyboard event
     * @param isDown Is key down
     */
    keyPressManager(e: KeyboardEvent, isDown: boolean): void;
}
