import Chuck from "./Chuck";
import { Gyro_ck, GyroMsg_ck } from "./gyroCk";


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
   * Initialize Gyro functionality in your WebChucK instance.
   * This adds a `Gyro` and `GyroMsg` class to the ChucK Virtual Machine (VM).
   * Gyroerometer event (DeviceMotionEvent) listeners are added if `enableGyro` is true (default).
   * @example
   * ```ts
   * theChuck = await Chuck.init([]);
   * gyro = await Gyro.init(theChuck); // Initialize Gyro 
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
    /*
    if (enableGyro) {
      // If iOS, request permission
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        if (permission === 'granted') {
          gyro.enableGyro();
        } else {
          console.log("Gyroscope permission denied.");
        }
      } else {
        // just try to enable
        gyro.enableGyro();
      }
    }
    */
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
   * Enable Javascript event (DeviceMotionEvent) listeners for Gyro
   * @example
   * ```ts
   * // If gyro is not yet enabled
   * gyro.enableGyro();
   * ```
   */
  enableGyro() {
    // consider using "deviceorientationabsolute" 
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/deviceorientationabsolute_event 
    window.addEventListener("deviceorientation", this.boundHandleOrientation);
  }

   /**
   * Disable Javascript event (DeviceMotionEvent) listeners for Gyro
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
