//==============================================================================
// WebChucK Test Suite
//==============================================================================
import { Chuck, HID, Gyro, Accel } from "../src/wc-bundle.js";

class Test {
  constructor(id, name, fn, options = {}) {
    this.id = id;
    this.name = name;
    this.fn = fn;
    this.options = options;
    this.teardowns = [];
  }

  // ### DOM ###
  get output() {
    return document.getElementById("output-" + this.id);
  }

  get result() {
    return document.getElementById("result-" + this.id);
  }

  renderTest() {
    const suite = document.getElementById("test-suite");

    const row = document.createElement("tr");
    row.id = `test-${this.id}`;
    row.innerHTML = `
            <td>${this.id}</td>
            <td>${this.name}</td>
            <td id="result-${this.id}">--</td>
            <td id="output-${this.id}"></td>
        `;

    suite.appendChild(row);
  }

  // ### TESTING ###
  async run() {
    this.setStatus("RUNNING", "orange");
    this.output.innerHTML = "";

    let passed = false;
    try {
      await this.fn(this);
      passed = true;
    } catch (e) {
      console.error(`Test ${this.id} failed:`, e);
      passed = false;
    } finally {
      await this.runTeardowns();
    }

    if (passed) {
      this.setStatus("PASS", "green");
    } else {
      this.setStatus("FAIL", "red");
    }

    updateTestSuiteScore(passed);
  }

  async runTeardowns() {
    for (const td of this.teardowns.reverse()) {
      await td();
    }
    this.teardowns = [];
  }

  addTeardown(fn) {
    this.teardowns.push(fn);
  }

  // ### UTILITY ###
  print(msg, append = true) {
    if (!this.output) return;

    if (append) {
      this.output.innerHTML += msg + "<br>";
    } else {
      this.output.innerHTML = msg;
    }
  }

  setChuckPrint(chuck, append = true) {
    const original = chuck.chuckPrint;
    chuck.chuckPrint = (msg) => {
      if (original) original(msg);
      this.print(msg, append);
    };
    // this.addTeardown(() => {
    //   chuck.chuckPrint = original;
    // });
  }

  /**
   * Assertion helper
   * @param {boolean} condition condition to assert
   * @param {string} message assertion failure message
   */
  assert(condition, message) {
    if (!condition) {
      console.error("Expected true but got", condition);
      throw new Error(message || "Assertion failed");
    }
  }

  /**
   * Wait for a specified amount of time
   * @param {number} ms time in milliseconds
   */
  wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Waits for a specific print output from Chuck. If a print output matches
   * checkFn, resolves to true. If timeout is reached, resolves to false.
   * @param {Chuck} chuck chuck instance
   * @param {function} triggerFn function that triggers action to test
   * @param {function} checkFn function that validates the output
   * @param {number} timeout max time to wait in ms
   * @returns true if checkFn returned true, false if timed out
   */
  waitForChuckPrint(chuck, triggerFn, checkFn, timeout = 5000) {
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        cleanup();
        resolve(false);
      }, timeout);

      const originalPrint = chuck.chuckPrint;
      function cleanup() {
        chuck.chuckPrint = originalPrint;
        clearTimeout(timer);
      }

      chuck.chuckPrint = (output) => {
        if (originalPrint) originalPrint(output);
        if (checkFn(output)) {
          cleanup();
          resolve(true);
        }
      };

      triggerFn();
    });
  }

  setStatus(text, color) {
    if (!this.result) return;

    this.result.innerHTML = text;
    this.result.style.color = color;
  }
}

class TestSuite {
  static tests = [];
  static nextId = 1;

  static test(name, fn, options = {}) {
    const test = new Test(this.nextId++, name, fn, options);
    this.tests.push(test);
    test.renderTest();
  }

  static async run(filteredIds = null, parallel = false) {
    const testsToRun = filteredIds
      ? this.tests.filter((t) => filteredIds.includes(t.id))
      : this.tests;

    if (parallel) {
      await Promise.all(testsToRun.map((t) => t.run()));
    } else {
      for (const test of testsToRun) {
        await test.run();
      }
    }
  }
}

//==============================================================================
// DEFINE WEBCHUCK TESTS!!!
//==============================================================================
TestSuite.test("[sound] Define a ChucK and runCode 220Hz 0.5 second", async (t) => {
  const aChuck = await Chuck.init([], undefined, undefined, "../src/");
  t.setChuckPrint(aChuck);

  const code = `SinOsc osc => dac; 0.5::second => now; <<< "PASSED", "" >>>;`;

  const passed = await t.waitForChuckPrint(
    aChuck,
    () => {
      aChuck.runCode(code);
    },
    (output) => output.includes("PASSED"),
    1500,
  );
  t.assert(passed, "Should have printed PASSED");
  t.addTeardown(() => aChuck.context.close());
});

TestSuite.test("[sound] Preload a server chuck file, runFile, 440Hz 1 second", async (t) => {
  const aChuck = await Chuck.init(
    [{ serverFilename: "./testFiles/test2.ck", virtualFilename: "test2.ck" }],
    undefined,
    undefined,
    "../src/",
  );
  t.setChuckPrint(aChuck);

  const passed = await t.waitForChuckPrint(
    aChuck,
    () => {
      aChuck.runFile("test2.ck");
    },
    (output) => output.includes("PASSED"),
    3000,
  );
  t.addTeardown(() => aChuck.context.close());
  t.assert(passed, "Should have printed PASSED");
});

TestSuite.test("[sound] Dynamic load in a chuck file from URL, 880Hz 1 second", async (t) => {
  const aChuck = await Chuck.init([], undefined, undefined, "../src/");
  t.setChuckPrint(aChuck);
  await aChuck.loadFile("./testFiles/test3.ck");

  const passed = await t.waitForChuckPrint(
    aChuck,
    () => {
      aChuck.runFile("test3.ck");
    },
    (output) => output.includes("PASSED"),
    3000,
  );
  t.addTeardown(() => aChuck.context.close());
  t.assert(passed, "Should have printed PASSED");
});

TestSuite.test("[sound] Dynamic load in a kick wav file from URL", async (t) => {
  const aChuck = await Chuck.init([], undefined, undefined, "../src/");
  t.setChuckPrint(aChuck);
  await aChuck.loadFile("./testFiles/kick.wav");

  const code = `
            SndBuf buf => dac;
            "kick.wav" => buf.read;
            1:: second => now;
            <<< "KICKED", "" >>>;
        `;
  const passed = await t.waitForChuckPrint(
    aChuck,
    () => {
      aChuck.runCode(code);
    },
    (output) => output === "KICKED",
    3000,
  );
  t.addTeardown(() => aChuck.context.close());
  t.assert(passed, "Should have printed KICKED");
});

TestSuite.test("Sync test set/get int and float, webchuck and js", async (t) => {
  const aChuck = await Chuck.init([], undefined, undefined, "../src/");
  t.setChuckPrint(aChuck);

  const code = `
                    1 => global int GLOBAL_INT;
                    1.0 => global float GLOBAL_FLOAT;
                    <<< "Set GLOBAL_INT:", GLOBAL_INT >>>;
                    <<< "Set GLOBAL_FLOAT:", GLOBAL_FLOAT >>>;
                    <<< "DONE", "" >>>;
                `;
  aChuck.runCode(code);
  await t.waitForChuckPrint(
    aChuck,
    () => { },
    (output) => output === "DONE",
    100,
  );
  t.assert((await aChuck.getInt("GLOBAL_INT")) === 1, "GLOBAL_INT should be 1");
  t.assert((await aChuck.getFloat("GLOBAL_FLOAT")) === 1.0, "GLOBAL_FLOAT should be 1.0");

  t.print("JS set GLOBAL_INT to 42 and GLOBAL_FLOAT to 3.14");
  await aChuck.setInt("GLOBAL_INT", 42);
  await aChuck.setFloat("GLOBAL_FLOAT", 3.14);

  const intPassed = await t.waitForChuckPrint(
    aChuck,
    () => { aChuck.runCode(`global int GLOBAL_INT; <<< "Get GLOBAL_INT:", GLOBAL_INT >>>;`); },
    (output) => output.includes("GLOBAL_INT: 42"),
    1000,
  );
  const floatPassed = await t.waitForChuckPrint(
    aChuck,
    () => { aChuck.runCode(`global float GLOBAL_FLOAT; <<< "Get GLOBAL_FLOAT:", GLOBAL_FLOAT >>>;`); },
    (output) => output.includes("GLOBAL_FLOAT: 3.14"),
    1000,
  );
  t.assert(intPassed, "Should have printed GLOBAL_INT: 42");
  t.assert(floatPassed, "Should have printed GLOBAL_FLOAT: 3.14");

  t.addTeardown(() => aChuck.context.close());
});

TestSuite.test("Test shred management, add, remove, replace", async (t) => {
  const aChuck = await Chuck.init([], undefined, undefined, "../src/");
  t.setChuckPrint(aChuck);

  const shred1 = await aChuck.runCode(`
            <<< "Running Shred 1", "" >>>;
            1::week => now;
        `);
  const shred2 = await aChuck.runCode(`
            <<< "Running Shred 2", "" >>>;
            1::week => now;
        `);
  t.assert(typeof shred1 === "number", "shred1 should be a number");
  t.assert(typeof shred2 === "number", "shred2 should be a number");

  t.assert((await aChuck.removeLastCode()) === shred2, "removeLastCode should return shred2");

  const { oldShred, newShred } = await aChuck.replaceCode(
    `
            <<< "REPLACE Shred 1 with a new program", "" >>>;
            1::week => now;
        `,
    shred1,
  );
  t.assert(
    oldShred === shred1 && newShred === shred1,
    "replaceCode should return newShred === shred1 (1)",
  );
  t.assert(await aChuck.isShredActive(newShred), "newShred should be active");
  t.assert((await aChuck.removeShred(newShred)) === newShred, "removeShred should return newShred");

  t.addTeardown(() => aChuck.context.close());
});

TestSuite.test("RunFileWithArgs", async (t) => {
  const aChuck = await Chuck.init([], undefined, undefined, "../src/");
  t.setChuckPrint(aChuck);
  t.print("Passing in arguments: 1 2 foo");
  await aChuck.loadFile("./testFiles/test7.ck");
  const passed = await t.waitForChuckPrint(
    aChuck,
    () => {
      aChuck.runFileWithArgs("test7.ck", "1:2:foo");
    },
    (output) => output.includes("number of arguments: 3"),
    2000,
  );

  t.addTeardown(() => aChuck.context.close());
  t.assert(passed, "Should have printed number of arguments: 3");
});

TestSuite.test("Test isShredActive", async (t) => {
  const aChuck = await Chuck.init([], undefined, undefined, "../src/");
  t.setChuckPrint(aChuck);
  const code = `
            <<< "Running Shred for 1 second", "" >>>;
            1::second => now;
            <<< "1 SECOND LATER", "" >>>;
        `;
  const shred = await aChuck.runCode(code);
  console.log(shred);
  t.assert(await aChuck.isShredActive(shred), "shred should be active");
  const passed = await t.waitForChuckPrint(
    aChuck,
    () => { },
    (output) => output.includes("1 SECOND LATER"),
    2000,
  );
  t.assert(passed, "Should have printed 1 SECOND LATER");
  t.assert(!(await aChuck.isShredActive(shred)), "shred should not be active");

  t.addTeardown(() => aChuck.context.close());
});

TestSuite.test("Machine.add/replace/remove/clear", async (t) => {
  const aChuck = await Chuck.init(
    [{ serverFilename: "./testFiles/test9.ck", virtualFilename: "test9.ck" }],
    undefined,
    undefined,
    "../src/",
  );
  t.setChuckPrint(aChuck);

  // Run new shred 1, adding test9.ck (shred 2);
  const add1 = await t.waitForChuckPrint(
    aChuck,
    () => {
      aChuck.runCode(`Machine.add("test9.ck"); 2::second => now;`);
    },
    (output) => output.includes("Machine Added File"),
    1000,
  );
  t.assert(add1, "Machine.add should print 'Machine Added File'");

  // Run new shred 3, replace shred 1 with test9.ck (shred 1);
  const add2 = await t.waitForChuckPrint(
    aChuck,
    () => {
      aChuck.replaceCode(`<<< Machine.replace(1, "test9.ck") >>>; 2::second => now;`);
    },
    (output) => output.includes("Machine Added File"),
    1000,
  );
  t.assert(add2, "Machine.replace should print 'Machine Added File'");

  // Remove shred 1
  t.assert(await aChuck.isShredActive(1), "shred 1 should be active");
  await aChuck.runCode(`Machine.remove(1);`);
  await t.wait(100);
  t.assert(!(await aChuck.isShredActive(1)), "shred 1 should be removed");

  // Remove all shreds
  await aChuck.runCode(`Machine.clearVM();`);
  await t.wait(100);
  t.assert(!(await aChuck.isShredActive(1)), "shred 1 should be cleared");
  t.assert(!(await aChuck.isShredActive(2)), "shred 2 should be cleared");
  t.assert(!(await aChuck.isShredActive(3)), "shred 3 should be cleared");

  t.addTeardown(() => aChuck.context.close());
});

TestSuite.test("WebChucK get deferred Promise<type> returns", async (t) => {
  const aChuck = await Chuck.init([], undefined, undefined, "../src/");
  t.setChuckPrint(aChuck);

  await aChuck.runCode(`2::second => now;`);

  let result1 = false;
  let response1 = aChuck
    .isShredActive(1)
    .then((result) => {
      result1 = result === 1; // TODO: fix this to boolean check
    })
    .catch((err) => {
      result1 = false;
    });
  await response1;
  t.assert(result1, "isShredActive(1) should have resolved to true");

  let result2 = false;
  let response2 = aChuck
    .removeShred(1)
    .then((result) => {
      result2 = result === 1;
    })
    .catch((err) => {
      result2 = false;
    });
  await response2;
  t.assert(result2, "removeShred(1) should have resolved to 1");

  let result3 = false;
  let response3 = aChuck
    .removeShred(-1)
    .then((result) => {
      result3 = false;
    })
    .catch((err) => {
      result3 = err === "Removing code failed";
    });
  await response3;
  t.assert(result3, "removeShred(-1) should have rejected");
  t.print("Passed all Promise return tests");

  t.addTeardown(() => aChuck.context.close());
});

TestSuite.test("[sound] WebChugin Test, ABSaturator", async (t) => {
  const aChuck = await Chuck.init([], undefined, undefined, "../src/");
  t.setChuckPrint(aChuck);
  const code = `SinOsc osc => Delay d => ABSaturator sat => dac;
            20 => sat.drive;
            4 => sat.dcOffset;
            0.5::second => now;
            <<< "PASSED", "" >>>;
        `;

  const passed = await t.waitForChuckPrint(
    aChuck,
    () => {
      aChuck.runCode(code);
    },
    (output) => output.includes("PASSED"),
    2000,
  );
  t.assert(passed, "ABSaturator should have printed PASSED");

  t.addTeardown(() => aChuck.context.close());
});

TestSuite.test("HID - mouse", async (t) => {
  const aChuck = await Chuck.init([], undefined, undefined, "../src/");
  t.setChuckPrint(aChuck, false);

  const hid = await HID.init(aChuck);
  await aChuck.loadFile("./testFiles/mouse.ck");
  aChuck.runFile("mouse.ck");
  const inputReceived = await t.waitForChuckPrint(
    aChuck,
    () => { },
    (output) => output.includes("ready"), // mouse was moved
    5000,
  );
  t.assert(inputReceived, "Should have received mouse input");
  // t.addTeardown(() => aChuck.context.close());
});

TestSuite.test("HID - keyboard", async (t) => {
  const aChuck = await Chuck.init([], undefined, undefined, "../src/");
  t.setChuckPrint(aChuck, false);

  const hid = await HID.init(aChuck);
  await aChuck.loadFile("./testFiles/keyboard.ck");
  aChuck.runFile("keyboard.ck");
  const inputReceived = await t.waitForChuckPrint(
    aChuck,
    () => { },
    (output) => output.includes("ready"), // key was pressed
    5000,
  );
  t.assert(inputReceived, "Should have received keyboard input");
  // t.addTeardown(() => aChuck.context.close());
});

TestSuite.test("Use Offline Context - 10 second", async (t) => {
  const offlineContext = new OfflineAudioContext(2, 44100 * 10, 44100);
  const aChuck = await Chuck.init([], offlineContext, undefined, "../src/");
  aChuck.connect(offlineContext.destination);
  t.setChuckPrint(aChuck);

  const code = `
            SinOsc osc => dac;
            10::second => now;
            <<< "PASSED", "" >>>;
        `;
  const passed = await t.waitForChuckPrint(
    aChuck,
    () => {
      aChuck.runCode(code);
      offlineContext.startRendering();
    },
    (output) => output.includes("PASSED"),
    1000,
  );
  t.assert(passed, "Should have printed PASSED");
});

TestSuite.test("Use Local Audio Context", async (t) => {
  const audioContext = new AudioContext();
  audioContext.suspend();
  const aChuck = await Chuck.init([], audioContext, undefined, "../src/");
  audioContext.resume();
  t.setChuckPrint(aChuck);
  const passed = await t.waitForChuckPrint(
    aChuck,
    () => {
      aChuck.runCode(`<<< "PASSED", "" >>>;`);
    },
    (output) => output.includes("PASSED"),
    1000,
  );
  t.assert(passed, "Should have printed PASSED");
  t.addTeardown(() => aChuck.context.close());
});

TestSuite.test("Gyro - Gyroscope", async (t) => {
  const aChuck = await Chuck.init([], undefined, undefined, "../src/");
  t.setChuckPrint(aChuck, false);

  const gyro = await Gyro.init(aChuck);
  await aChuck.loadFile("./testFiles/gyro.ck");
  // Always pass for now, as we cannot guarantee device has gyro
  t.assert(true, "Gyro test passed (no input check)");
  const passed = await t.waitForChuckPrint(
    aChuck,
    () => { aChuck.runFile("gyro.ck"); },
    (output) => output.includes("ready"), // gyro data received
    5000,
  );
  t.assert(passed, "Should have received gyro input");
  // t.addTeardown(() => aChuck.context.close());
});

TestSuite.test("Accel - Accelerometer", async (t) => {
  const aChuck = await Chuck.init([], undefined, undefined, "../src/");
  t.setChuckPrint(aChuck, false);

  const accel = await Accel.init(aChuck);
  await aChuck.loadFile("./testFiles/accel.ck");
  // Always pass for now, as we cannot guarantee device has accel
  t.assert(true, "Accel test passed (no input check)");
  const passed = await t.waitForChuckPrint(
    aChuck,
    () => { aChuck.runFile("accel.ck"); },
    (output) => output.includes("ready"), // accel data received
    5000,
  );
  t.assert(passed, "Should have received accel input");
  // t.addTeardown(() => aChuck.context.close());
});

TestSuite.test("ChucK VM operations, parameters, and version", async (t) => {
  const aChuck = await Chuck.init([], undefined, undefined, "../src/");

  t.print(await aChuck.getParamString("VERSION"));
  t.print("sample rate: " + (await aChuck.getParamInt("SAMPLE_RATE")));
  t.print("input channels: " + (await aChuck.getParamInt("INPUT_CHANNELS")));
  t.print("output channels: " + (await aChuck.getParamInt("OUTPUT_CHANNELS")));
  t.print("now: " + (await aChuck.now()));
});



//==============================================================================
// WebChucK Test Suite Main
//==============================================================================
let testScore = 0;
let testSize = TestSuite.tests.length;
let filteredIndices = TestSuite.tests.map((t) => t.id);

const runButton = document.getElementById("run");
const filterButton = document.getElementById("filter");

// Update score
function updateTestSuiteScore(passed) {
  testScore += passed ? 1 : 0;
  const score = document.getElementById("score");
  if (score) score.innerText = `${testScore} / ${testSize}`;
}

// Filter tests
function filterTests() {
  const testFilter = document.getElementById("test-filter").value;
  const suite = document.getElementById("test-suite");

  while (suite.rows.length > 1) suite.deleteRow(1);

  if (!testFilter) {
    filteredIndices = TestSuite.tests.map((t) => t.id);
  } else {
    filteredIndices = [];
    testFilter.split(",").forEach((range) => {
      if (range.includes("-")) {
        const [a, b] = range.split("-").map(Number);
        for (let i = a; i <= b; i++) filteredIndices.push(i);
      } else {
        filteredIndices.push(Number(range));
      }
    });
  }

  TestSuite.tests.filter((t) => filteredIndices.includes(t.id)).forEach((t) => t.renderTest());
}

// Run suite
async function runTestSuite() {
  testScore = 0;
  testSize = filteredIndices.length;

  const parallel = document.getElementById("parallelize")?.checked;

  await TestSuite.run(filteredIndices, parallel);
}

// SETUP
window.addEventListener("load", async () => {
  runButton.disabled = false;
});

filterButton.addEventListener("click", (e) => {
  e.preventDefault();
  filterTests();
});

runButton.addEventListener("click", async () => {
  if (typeof DeviceMotionEvent?.requestPermission === "function") {
    await DeviceMotionEvent.requestPermission();
  }
  if (typeof DeviceOrientationEvent?.requestPermission === "function") {
    await DeviceOrientationEvent.requestPermission();
  }
  runTestSuite();
});
