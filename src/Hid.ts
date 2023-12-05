import Chuck from "./Chuck";
import { Hid_ck, HidMsg_ck } from "./hidCk";

enum HidMsgType {
  BUTTON_DOWN = 1,
  BUTTON_UP = 2,
  MOUSE_MOTION = 5,
  WHEEL_MOTION = 6,
}

//TODO: Update the latest mouse.ck and kb.ck files
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
export default class HID {
  // Private members
  private theChuck: Chuck;
  private keymap: Array<boolean>;
  private _mouseActive: boolean = false;
  private _kbdActive: boolean = false;

  // Handler Bindings
  private boundHandleMouseMove;
  private boundHandleMouseDown;
  private boundHandleMouseUp;
  private boundHandleMouseWheel;
  private boundHandleKeyDown;
  private boundHandleKeyUp;

  /** @internal */
  constructor(theChuck: Chuck) {
    // Initialize members
    this.theChuck = theChuck;
    this.keymap = new Array<boolean>(256).fill(false);

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
  static async init(
    theChuck: Chuck,
    enableMouse: boolean = true,
    enableKeyboard: boolean = true,
  ): Promise<HID> {
    const hid = new HID(theChuck);
    // Add HID and HIDMsg classes to ChucK VM
    await hid.theChuck.runCode(HidMsg_ck);
    await hid.theChuck.runCode(Hid_ck);

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
  getMousePos(mouseEvent: MouseEvent): { x: number; y: number } {
    return {
      x: mouseEvent.clientX,
      y: mouseEvent.clientY,
    };
  }

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
  enableMouse() {
    document.addEventListener("mousemove", this.boundHandleMouseMove);
    document.addEventListener("mousedown", this.boundHandleMouseDown);
    document.addEventListener("mouseup", this.boundHandleMouseUp);
    document.addEventListener("wheel", this.boundHandleMouseWheel);
    document.addEventListener("contextmenu", HID.handleContextMenu);
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
    document.removeEventListener("contextmenu", HID.handleContextMenu);
  }

  /**
   * Enable keyboard HID Javascript event listeners for HID.
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
  private handleMouseMove(e: MouseEvent) {
    this.mouseActive();
    if (this._mouseActive) {
      const mousePos = this.getMousePos(e);
      this.theChuck.setFloat("_deltaX", e.movementX);
      this.theChuck.setFloat("_deltaY", e.movementY);
      this.theChuck.setFloat("_scaledCursorX", mousePos.x / document.documentElement.clientWidth);
      this.theChuck.setFloat("_scaledCursorY", mousePos.y / document.documentElement.clientHeight);
      this.theChuck.setInt("_type", HidMsgType.MOUSE_MOTION);
      this.theChuck.broadcastEvent("_hid");
    }
  }

  /** @internal */
  private handleMouseDown(e: MouseEvent) {
    this.mouseActive();
    if (this._mouseActive) {
      this.theChuck.setInt("_which", e.which);
      this.theChuck.setInt("_type", HidMsgType.BUTTON_DOWN);
      this.theChuck.broadcastEvent("_hid");
    }
  }

  /** @internal */
  private handleMouseUp(e: MouseEvent) {
    this.mouseActive();
    if (this._mouseActive) {
      this.theChuck.setInt("_which", e.which);
      this.theChuck.setInt("_type", HidMsgType.BUTTON_UP);
      this.theChuck.broadcastEvent("_hid");
    }
  }

  /** @internal */
  private handleMouseWheel(e: WheelEvent) {
    this.mouseActive();
    if (this._mouseActive) {
      this.theChuck.setFloat("_deltaX", clamp(e.deltaX, -1, 1));
      this.theChuck.setFloat("_deltaY", clamp(e.deltaY, -1, 1));
      this.theChuck.setInt("_type", HidMsgType.WHEEL_MOTION);
      this.theChuck.broadcastEvent("_hid");
    }
  }

  /** @internal */
  private static handleContextMenu(e: MouseEvent) {
    e.preventDefault();
  }

  //----------- KEYBOARD --------- //

  /** @internal */
  private handleKeyDown(e: KeyboardEvent) {
    this.kbdActive();
    if (this._kbdActive && !this.keymap[e.keyCode]) {
      this.keymap[e.keyCode] = true;
      this.keyPressManager(e, true);
    }
  }

  /** @internal */
  private handleKeyUp(e: KeyboardEvent) {
    this.kbdActive();
    if (this._kbdActive) {
      this.keymap[e.keyCode] = false;
      this.keyPressManager(e, false);
    }
  }

  /**
   * @internal
   * Handle keyboard presses to send to chuck
   * @param e Keyboard event
   * @param isDown Is key down
   */
  private keyPressManager(e: KeyboardEvent, isDown: boolean): void {
    this.theChuck.setString("_key", e.key);
    this.theChuck.setInt("_which", e.which);
    this.theChuck.setInt("_ascii", e.keyCode);
    this.theChuck.setInt("_type", isDown ? HidMsgType.BUTTON_DOWN : HidMsgType.BUTTON_UP);
    this.theChuck.broadcastEvent("_hid");
  }
}

//-----------------------------------------------
// HELPER FUNCTIONS
//-----------------------------------------------
/**
 * Clamp a value between two numbers
 * @param val value to clamp
 * @param min min value
 * @param max max value
 * @returns clamped value
 */
function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}
