import Chuck from "../Chuck";
import { Accel_ck, AccelMsg_ck } from "./accelCk";


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
 * 
 * The "devicemotion" event gives acceleration of the device on the three axes: x, y, and z. Acceleration is expressed in m/s².
 * More on the "devicemotion" event can be found online {@link https://developer.mozilla.org/en-US/docs/Web/API/Window/devicemotion_event | here }.
 * 
 * iOS devices require that the web developer ask permission from the user to access sensors after a button push. For example: 
 * 
 * ```ts
 * import { Chuck, Accel } from "webchuck";
 * 
 * let theChuck = await Chuck.init([]); // context suspended
 * let accel = await Accel.init(theChuck);
 * 
 * let runButton = document.getElementById("run");
 * runButton.disabled = false;
 * 
 * runButton.addEventListener("click", async () => {
 *   if (typeof DeviceMotionEvent.requestPermission === 'function') {
 *     await DeviceMotionEvent.requestPermission();
 *   } 
 * 
 *   await theChuck.loadFile("./yourChuckCode.ck");
 *   theChuck.runFile("yourChuckCode.ck");
 * 
 * });
 * ```
 */
export default class Accel {
  // Private members
  private theChuck: Chuck;
  private _accelActive: boolean = false;

  private boundHandleMotion;


  /** @internal */
  constructor(theChuck: Chuck) {
    // Initialize members
    this.theChuck = theChuck;

    this.boundHandleMotion = this.handleMotion.bind(this);
  }

  /**
   * Initialize Accel functionality in your WebChucK instance.
   * This adds a `Accel` and `AccelMsg` class to the ChucK Virtual Machine (VM).
   * Accelerometer event (DeviceMotionEvent) listeners are added if `enableAccel` is true (default).
   * @example
   * ```ts
   * theChuck = await Chuck.init([]);
   * accel = await Accel.init(theChuck); // Initialize Accel 
   */
  static async init(
    theChuck: Chuck,
    enableAccel: boolean = true
  ): Promise<Accel> {
    const accel = new Accel(theChuck);
    // Add Accel and AccelMsg classes to ChucK VM
    await accel.theChuck.runCode(AccelMsg_ck);
    await accel.theChuck.runCode(Accel_ck);

    // Enable mouse and keyboard
    if (enableAccel) accel.enableAccel();
    return accel;
  }



  /**
   * @internal
   * Check if accel is active
   */
  async accelActive() {
    const x = await this.theChuck.getInt("_accelActive");
    this._accelActive = x == 1;
  }

  /**
   * Enable Javascript event (DeviceMotionEvent) listeners for Accel
   * @example
   * ```ts
   * // If accel is not yet enabled
   * accel.enableAccel();
   * ```
   */
  enableAccel() {
    // consider using "deviceorientationabsolute" 
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/deviceorientationabsolute_event 
    window.addEventListener("devicemotion", this.boundHandleMotion);
  }

   /**
   * Disable Javascript event (DeviceMotionEvent) listeners for Accel
   * @example
   * ```ts
   * // If accel is enabled
   * accel.disableAccel();
   * ```
   */
  disableAccel() {
    window.removeEventListener("devicemotion", this.boundHandleMotion);
  }


  //-----------------------------------------
  // JAVASCRIPT HID EVENT HANDLERS
  //-----------------------------------------


  /** @internal */
  private handleMotion(event: DeviceMotionEvent) {
    this.accelActive();
    if (this._accelActive) {
      if (event.acceleration != null) {
        this.theChuck.setFloat("_accelX", event.acceleration.x ? event.acceleration.x : 0.0);
        this.theChuck.setFloat("_accelY", event.acceleration.y ? event.acceleration.y : 0.0);
        this.theChuck.setFloat("_accelZ", event.acceleration.z ? event.acceleration.z : 0.0);
        this.theChuck.broadcastEvent("_accelReading");
      }
    }
  }
}
