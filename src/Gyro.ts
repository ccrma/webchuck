import Chuck from "./Chuck";
import { Gyro_ck, GyroMsg_ck } from "./gyroCk";


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
export default class Gyro {
  // Private members
  private theChuck: Chuck;
  private _gyroActive: boolean = false;

  private boundHandleOrientation;


  /** @internal */
  constructor(theChuck: Chuck) {
    // Initialize members
    this.theChuck = theChuck;

    this.boundHandleOrientation = this.handleOrientation.bind(this);
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
    enableGyro: boolean = true
  ): Promise<Gyro> {
    const gyro = new Gyro(theChuck);
    // Add Gyro and GyroMsg classes to ChucK VM
    await gyro.theChuck.runCode(GyroMsg_ck);
    await gyro.theChuck.runCode(Gyro_ck);

    // Enable mouse and keyboard
    if (enableGyro) {
      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            DeviceOrientationEvent.requestPermission();
            gyro.enableGyro();
      } else {
        console.log("No gyroscope available.")
      }
    }
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
   * Enable Mouse HID Javascript event listeners for HID.
   * Adds a mousemove, mousedown, mouseup, and wheel listener to the document.
   * This will also disable the context menu on right click.
   * @example
   * ```ts
   * // If mouse HID is not yet enabled
   * hid.enableMouse();
   * ```
   */
  enableGyro() {
    //document.addEventListener("reading", this.boundHandleGyroReading);
    window.addEventListener("deviceorientation", this.boundHandleOrientation);

  }

  /**
   * Disable Mouse HID Javascript event listeners
   * @example
   * ```ts
   * // If mouse HID is enabled
   * hid.disableMouse();
   * ```
   */
  disableGyro() {
    window.removeEventListener("deviceorientation", this.boundHandleOrientation);
  }


  //-----------------------------------------
  // JAVASCRIPT HID EVENT HANDLERS
  //-----------------------------------------


  /** @internal */
  private handleOrientation(event: DeviceOrientationEvent) {
    this.gyroActive();
    if (this._gyroActive) {
      this.theChuck.setFloat("_gyroX", event.alpha ? event.alpha : 0.0);
      this.theChuck.setFloat("_gyroY", event.beta ? event.beta : 0.0);
      this.theChuck.setFloat("_gyroZ", event.gamma ? event.gamma : 0.0);
      this.theChuck.broadcastEvent("_gyroReading");
    }
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
