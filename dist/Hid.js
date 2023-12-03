import { HID_ck, HidMsg_ck } from "./hidCk";
export default class HID {
    /** @internal */
    constructor(theChuck) {
        this.keysPressed = 0;
        this._mouseActive = false;
        this._kbdActive = false;
        // Initialize members
        this.theChuck = theChuck;
        this.keymap = new Array(256).fill(false);
        this.mousePos = { x: 0, y: 0 };
        this.lastPos = { x: 0, y: 0 };
        // Bind handlers
        this.boundHandleMouseMove = this.handleMouseMove.bind(this);
        this.boundHandleMouseDown = this.handleMouseDown.bind(this);
        this.boundHandleMouseUp = this.handleMouseUp.bind(this);
        this.boundHandleMouseWheel = this.handleMouseWheel.bind(this);
        this.boundHandleKeyDown = this.handleKeyDown.bind(this);
        this.boundHandleKeyUp = this.handleKeyUp.bind(this);
    }
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
    static async init(theChuck, enableMouse = true, enableKeyboard = true) {
        const hid = new HID(theChuck);
        // Add HID and HIDMsg classes to ChucK VM
        await hid.theChuck.runCode(HID_ck);
        await hid.theChuck.runCode(HidMsg_ck);
        // Enable mouse and keyboard
        if (enableMouse) {
            hid.enableMouse();
        }
        if (enableKeyboard) {
            hid.enableKeyboard();
        }
        return hid;
    }
    /**
     * @internal
     * Check if keyboard is active
     */
    async kbdActive() {
        const x = await this.theChuck.getInt("_kbdActive");
        this._kbdActive = x == 1;
    }
    /**
     * @internal
     * Check if mouse is active
     */
    async mouseActive() {
        const x = await this.theChuck.getInt("_mouseActive");
        this._mouseActive = x == 1;
    }
    /**
     * @internal
     * Get mouse position from the MouseEvent
     * @param mouseEvent Mouse event
     * @returns mouse position
     */
    getMousePos(mouseEvent) {
        return {
            x: mouseEvent.clientX,
            y: mouseEvent.clientY,
        };
    }
    /**
     * Enable Mouse HID Javascript event listeners to communicate with ChucK
     * Adds a mousemove, mousedown, mouseup, and wheel listener to the document.
     * @example
     * ```ts
     * // If mouse HID is not yet enabled
     * hid.enableMouse();
     * ```
     */
    enableMouse() {
        document.addEventListener("mousemove", this.boundHandleMouseMove);
        document.addEventListener("mousedown", this.boundHandleMouseDown);
        document.addEventListener("mouseup", this.boundHandleMouseUp);
        document.addEventListener("wheel", this.boundHandleMouseWheel);
    }
    /**
     * Disable Mouse HID Javascript event listeners
     * @example
     * ```ts
     * // If mouse HID is enabled
     * hid.disableMouse();
     * ```
     */
    disableMouse() {
        document.removeEventListener("mousemove", this.boundHandleMouseMove);
        document.removeEventListener("mousedown", this.boundHandleMouseDown);
        document.removeEventListener("mouseup", this.boundHandleMouseUp);
        document.removeEventListener("wheel", this.boundHandleMouseWheel);
    }
    /**
     * Enable keyboard HID Javascript event listeners to communicate with ChucK.
     * Adds a keydown and keyup listener to the document.
     * @example
     * ```ts
     * // If keyboard HID is not yet enabled
     * hid.enableKeyboard();
     * ```
     */
    enableKeyboard() {
        document.addEventListener("keydown", this.boundHandleKeyDown);
        document.addEventListener("keyup", this.boundHandleKeyUp);
    }
    /**
     * Disable keyboard HID javascript event listeners
     * @example
     * ```ts
     * // If keyboard HID is enabled
     * hid.disableKeyboard();
     * ```
     */
    disableKeyboard() {
        document.removeEventListener("keydown", this.boundHandleKeyDown);
        document.removeEventListener("keyup", this.boundHandleKeyUp);
    }
    //-----------------------------------------
    // JAVASCRIPT HID EVENT HANDLERS
    //-----------------------------------------
    //----------- MOUSE --------- //
    /** @internal */
    handleMouseMove(e) {
        this.mouseActive();
        if (this._mouseActive) {
            this.mousePos = this.getMousePos(e);
            if (this.lastPos.x == this.mousePos.x && this.lastPos.y == this.mousePos.y) {
                this.theChuck.setInt("_mouseMotion", 0);
            }
            else {
                this.theChuck.setInt("_mouseMotion", 1);
                this.theChuck.broadcastEvent("_hid");
                this.theChuck.setInt("_mouseX", this.mousePos.x);
                this.theChuck.setInt("_mouseY", this.mousePos.y);
                this.theChuck.setFloat("_deltaX", e.movementX);
                this.theChuck.setFloat("_deltaY", e.movementY);
                this.theChuck.setFloat("_scaledCursorX", this.mousePos.x / document.documentElement.clientWidth);
                this.theChuck.setFloat("_scaledCursorY", this.mousePos.y / document.documentElement.clientHeight);
                this.theChuck.broadcastEvent("_msg");
            }
            this.lastPos = this.mousePos;
        }
    }
    /** @internal */
    handleMouseDown(e) {
        this.mouseActive();
        if (this._mouseActive) {
            if (this.lastPos.x == this.mousePos.x && this.lastPos.y == this.mousePos.y) {
                this.theChuck.setInt("_mouseMotion", 0);
            }
            else {
                this.theChuck.setInt("_mouseMotion", 1);
            }
            this.theChuck.setInt("_mouseDown", 1);
            this.theChuck.broadcastEvent("_hid");
            this.theChuck.setInt("_hidMouse", 1);
            this.theChuck.setInt("_which", e.which);
            this.theChuck.broadcastEvent("_msg");
        }
    }
    /** @internal */
    handleMouseUp(e) {
        this.mouseActive();
        if (this._mouseActive) {
            this.theChuck.setInt("_mouseUp", 1);
            this.theChuck.broadcastEvent("_hid");
            this.theChuck.setInt("_hidMouse", 1);
            this.theChuck.setInt("_which", e.which);
            this.theChuck.broadcastEvent("_msg");
        }
    }
    /** @internal */
    handleMouseWheel(e) {
        this.mouseActive();
        if (this._mouseActive) {
            this.theChuck.setInt("_isScroll", 1);
            this.theChuck.setInt("_deltaX", clamp(e.deltaX, -1, 1));
            this.theChuck.setInt("_deltaY", clamp(e.deltaY, -1, 1));
            this.theChuck.broadcastEvent("_hid");
            this.theChuck.broadcastEvent("_msg");
        }
    }
    //----------- KEYBOARD --------- //
    /** @internal */
    handleKeyDown(e) {
        this.kbdActive();
        if (this._kbdActive && !this.keymap[e.keyCode]) {
            this.keymap[e.keyCode] = true;
            this.keysPressed++;
            this.keyPressManager(e, true);
        }
    }
    /** @internal */
    handleKeyUp(e) {
        this.kbdActive();
        if (this._kbdActive) {
            this.keymap[e.keyCode] = false;
            this.keysPressed--;
            this.keyPressManager(e, false);
        }
    }
    /**
     * @internal
     * Handle keyboard presses to send to chuck
     * @param e Keyboard event
     * @param isDown Is key down
     */
    keyPressManager(e, isDown) {
        this.theChuck.broadcastEvent("_hid");
        this.theChuck.setString("_key", e.key);
        this.theChuck.setInt("_which", e.which);
        this.theChuck.setInt("_ascii", e.keyCode);
        this.theChuck.setInt("_isDown", isDown ? 1 : 0);
        this.theChuck.setInt("_isUp", isDown ? 0 : 1);
        this.theChuck.setInt("_hidMultiple", this.keysPressed);
        this.theChuck.broadcastEvent("_msg");
    }
}
/**
 * Clamp a value between two numbers
 * @param val value to clamp
 * @param min min value
 * @param max max value
 * @returns clamp value
 */
function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
}
