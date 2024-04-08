//=======================================================================
// WebChucK Test Suite
//=======================================================================
import { Chuck, HID } from '../src/wc-bundle.js';

/** WebChucK Test Class */
class Test {
    constructor(id, name, callback) {
        this.id = id;
        this.name = name;
        this.callback = callback;
        Test.addTestHTML(this.id, name);
    }

    async run() {
        // set status to running
        let result = document.getElementById("result-" + this.id);
        result.innerHTML = "RUNNING";
        result.style.color = "orange";

        this.renderTestResult(await this.callback());
    }

    static addTestHTML(id, name) {
        const suite = document.getElementById("test-suite");
        let test = document.createElement("tr");
        test.id = "test-" + id;

        let testNumber = document.createElement("td");
        testNumber.innerText = id;

        let testName = document.createElement("td");
        testName.innerText = name;

        let result = document.createElement("td");
        result.innerHTML = "--";
        result.id = "result-" + id;

        let output = document.createElement("td");
        output.id = "output-" + id;

        test.appendChild(testNumber);
        test.appendChild(testName);
        test.appendChild(result);
        test.appendChild(output);
        suite.appendChild(test);
    }

    renderTestResult(passed) {
        // update test result
        let result = document.getElementById("result-" + this.id);
        result.innerHTML = passed ? "PASSED" : "FAILED";
        result.style.color = passed ? "green" : "red";

        updateTestSuiteScore(passed)
    }
}

//=============================================================
// DEFINE TESTS HERE!
// 1. Create a new Test object with a unique id, name, and callback
//    - callback should return a promise that resolves to a boolean
// 2. Add the test to the testSuite array
//=============================================================
const testSuite = [

    new Test(1, "[sound] Define a ChucK and runCode 220hz 0.5 second", async () => {
        const aChuck = await Chuck.init([], undefined, undefined, "../src/");
        const outputBox = document.getElementById("output-" + 1);
        aChuck.chuckPrint = (output) => {
            outputBox.innerText = output;
        }
        aChuck.runCode(`
            SinOsc osc => dac; 0.5::second => now; <<< "PASSED", "" >>>;
        `);
        await new Promise(resolve => setTimeout(resolve, 750)); // wait 1.5x time
        return outputBox.innerText == "PASSED";
    }),

    new Test(2, "[sound] Preload a server chuck file, runFile, 440Hz 1 second", async () => {
        const aChuck = await Chuck.init([{ serverFilename: "./testFiles/test2.ck", virtualFilename: "test2.ck" }], undefined, undefined, "../src/");
        const outputBox = document.getElementById("output-" + 2);
        aChuck.chuckPrint = (output) => {
            outputBox.innerText = output;
        }
        aChuck.runFile("test2.ck");
        await new Promise(resolve => setTimeout(resolve, 1500));
        return outputBox.innerText == "PASSED";
    }),

    new Test(3, "[sound] Dynamic load in a chuck file from URL, 880Hz 1 second", async () => {
        const aChuck = await Chuck.init([], undefined, undefined, "../src/");
        const outputBox = document.getElementById("output-" + 3);
        aChuck.chuckPrint = (output) => {
            outputBox.innerText = output;
        }
        await aChuck.loadFile("./testFiles/test3.ck");
        aChuck.runFile("test3.ck");
        await new Promise(resolve => setTimeout(resolve, 1500));
        return outputBox.innerText == "PASSED";
    }),

    new Test(4, "[sound] Dynamic load in a kick wav file from URL", async () => {
        const aChuck = await Chuck.init([], undefined, undefined, "../src/");
        const outputBox = document.getElementById("output-" + 4);
        aChuck.chuckPrint = (output) => {
            outputBox.innerText = output;
        }
        await aChuck.loadFile("./testFiles/kick.wav");
        aChuck.runCode(`
            SndBuf buf => dac;
            buf.read("kick.wav");
            1::second => now;
            <<< "KICKED", "" >>>;
        `);
        await new Promise(resolve => setTimeout(resolve, 1500));
        return outputBox.innerText.includes("KICKED");
    }),

    new Test(5, "Sync test set/get int and float, webchuck and js", async () => {
        const aChuck = await Chuck.init([], undefined, undefined, "../src/");
        const outputBox = document.getElementById("output-" + 5);
        aChuck.runCode(`
            1 => global int GLOBAL_INT;
            1.0 => global float GLOBAL_FLOAT;
        `);
        await new Promise(resolve => setTimeout(resolve, 100));
        let test1 = await aChuck.getInt("GLOBAL_INT") == 1 && await aChuck.getFloat("GLOBAL_FLOAT") == 1.0;
        outputBox.innerHTML += "Get OK " + test1 + "<br>";
        aChuck.setInt("GLOBAL_INT", 2);
        aChuck.setFloat("GLOBAL_FLOAT", 2.0);
        await new Promise(resolve => setTimeout(resolve, 300));
        let test2 = await aChuck.getInt("GLOBAL_INT") == 2 && await aChuck.getFloat("GLOBAL_FLOAT") == 2.0;
        outputBox.innerHTML += "Set OK " + test2 + "<br>";
        return test1 && test2;
    }),

    new Test(6, "Test shred management, add, remove, replace", async () => {
        const aChuck = await Chuck.init([], undefined, undefined, "../src/");
        const outputBox = document.getElementById("output-" + 6);
        aChuck.chuckPrint = (output) => {
            outputBox.innerHTML += output + "<br>";
        }
        aChuck.runCode(`
            <<< "Running Shred 1", "" >>>;
            1::week => now;
        `)
        aChuck.runCode(`
            <<< "Running Shred 2", "" >>>;
            1::week => now;
        `)
        await new Promise(resolve => setTimeout(resolve, 100));
        let removed = await aChuck.removeLastCode() == 2;
        await new Promise(resolve => setTimeout(resolve, 100));
        let replaced = (await aChuck.replaceCode(`<<< "REPLACED Shred 1 with a new program\n", "" >>>; 1::second => now;`)).newShred == 1;
        await new Promise(resolve => setTimeout(resolve, 100));
        let active = await aChuck.isShredActive(1);
        await new Promise(resolve => setTimeout(resolve, 100));
        let removed2 = await aChuck.removeShred(1) == 1;
        await new Promise(resolve => setTimeout(resolve, 100));
        return removed == true &&
            replaced == true &&
            active == true &&
            removed2 == true;
    }),

    new Test(7, "Test RunFileWithArgs", async () => {
        const aChuck = await Chuck.init([], undefined, undefined, "../src/");
        const outputBox = document.getElementById("output-" + 7);
        aChuck.chuckPrint = (output) => {
            outputBox.innerHTML += output + "<br>";
        }

        outputBox.innerHTML += "Passing in arguments: 1 2 foo" + "<br>";

        await aChuck.loadFile("./testFiles/test7.ck");
        await aChuck.runFileWithArgs("test7.ck", "1:2:foo");
        await new Promise(resolve => setTimeout(resolve, 200));

        return outputBox.innerText.includes("number of arguments: 3");
    }),

    new Test(8, "Test isShredActive", async () => {
        const aChuck = await Chuck.init([], undefined, undefined, "../src/");
        const outputBox = document.getElementById("output-" + 8);
        aChuck.chuckPrint = (output) => {
            outputBox.innerHTML += output + "<br>";
        }

        outputBox.innerHTML += "Starting shred 1 for 1 second" + "<br>";

        aChuck.runCode(`1::second => now;`);
        let test1; let test2;
        await new Promise(resolve => setTimeout(resolve, 100));
        await aChuck.isShredActive(1).then((active) => {
            test1 = (active == 1);
        });
        await new Promise(resolve => setTimeout(resolve, 1000));
        await aChuck.isShredActive(1).then((active) => {
            test2 = (active == 0);
        });

        return test1 && test2;
    }),

    new Test(9, "Machine.add/replace/remove/clear", async () => {
        const aChuck = await Chuck.init([
            { serverFilename: "./testFiles/test9.ck", virtualFilename: "test9.ck" },
        ], undefined, undefined, "../src/");
        const outputBox = document.getElementById("output-" + 9);
        aChuck.chuckPrint = (output) => {
            outputBox.innerHTML += output + "<br>";
        }

        aChuck.runCode(`
            Machine.add("test9.ck") => int id;
            200::ms => now;
            Machine.replace(id, "test9.ck");
            400::ms => now;
            Machine.remove(id);
            200::ms => now;
            Machine.clearVM();
        `)
        let test1; let test2; let test3; let test4;
        await new Promise(resolve => setTimeout(resolve, 100));
        await aChuck.isShredActive(2).then((active) => {
            test1 = (active == 1);
        });
        await new Promise(resolve => setTimeout(resolve, 200));
        await aChuck.isShredActive(2).then((active) => {
            test2 = (active == 1);
        });
        await new Promise(resolve => setTimeout(resolve, 400));
        await aChuck.isShredActive(2).then((active) => {
            test3 = (active == 0);
        });
        await new Promise(resolve => setTimeout(resolve, 200));
        await aChuck.isShredActive(1).then((active) => {
            test4 = (active == 0);
        });
        return test1 && test2 && test3 && test4;
    }),

    new Test(10, "Chuck get Promise<type> returns", async () => {
        const aChuck = await Chuck.init([], undefined, undefined, "../src/");
        const outputBox = document.getElementById("output-" + 10);
        print = (output) => {
            outputBox.innerHTML += output + "<br>";
        }
        aChuck.chuckPrint = print;

        aChuck.runCode(`2::second => now;`);
        aChuck.runCode(`2::second => now;`);
        let test = true;
        await new Promise(resolve => setTimeout(resolve, 50));
        aChuck.isShredActive(1).then((active) => {
            print("isShredActive(1) returns: " + active);
            test &= active == 1;
        });
        aChuck.removeShred(1).then((removed) => {
            print("removeShred(1) returns: " + removed);
            test &= removed == 1;
        });
        aChuck.removeShred(-1).then((removed) => {
            print("removeShred(-1) returns: " + removed);
            test &= removed == 0;
        }).catch((err) => {
            print("removeShred(-1) throws: " + err);
            test &= err === "Remove code failed"
        });

        return test;
    }),

    new Test(11, "[sound] WebChugin Test, ABSaturator", async () => {
        Chuck.loadChugin("./testFiles/ABSaturator.chug.wasm")
        const aChuck = await Chuck.init([], undefined, undefined, "../src/");
        const outputBox = document.getElementById("output-" + 11);
        aChuck.chuckPrint = (output) => {
            outputBox.innerHTML += output + "<br>";
        }

        aChuck.runCode(`
        SinOsc osc => Delay d => ABSaturator sat => dac;
        20 => sat.drive;
        4 => sat.dcOffset;
        0.5::second => now;
        <<< "PASSED", "" >>>;
        `);
        await new Promise(resolve => setTimeout(resolve, 750));

        return outputBox.innerText.includes("PASSED");
    }),

    new Test(12, "HID - mouse", async () => {
        const aChuck = await Chuck.init([], undefined, undefined, "../src/");
        const outputBox = document.getElementById("output-" + 12);
        aChuck.chuckPrint = (output) => {
            outputBox.innerHTML = output + "<br>";
        }

        let hid = await HID.init(aChuck);
        await aChuck.loadFile("./testFiles/mouse.ck")
        aChuck.runFile("mouse.ck")

        return true;
    }),

    new Test(13, "HID - keyboard", async () => {
        const aChuck = await Chuck.init([], undefined, undefined, "../src/");
        const outputBox = document.getElementById("output-" + 13);
        aChuck.chuckPrint = (output) => {
            outputBox.innerHTML = output + "<br>";
        }

        let hid = await HID.init(aChuck);
        await aChuck.loadFile("./testFiles/kb.ck")
        aChuck.runFile("kb.ck")

        return true;
    }),

    new Test(14, "Use Offline Context - 10 seconds", async () => {
        const offlineContext = new OfflineAudioContext(2, 44100 * 10, 44100);
        const aChuck = await Chuck.init([], offlineContext, undefined, "../src/");
        aChuck.connect(offlineContext.destination);
        const outputBox = document.getElementById("output-" + 14);
        aChuck.chuckPrint = (output) => {
            outputBox.innerHTML = output + "<br>";
        }

        aChuck.runCode(`SinOsc osc => dac; 10::second => now; <<< "PASSED", "" >>>;`);
        await offlineContext.startRendering();
        return outputBox.innerText.includes("PASSED");
    }),

    new Test(15, "Use Local Audio Context, unconnected node", async () => {
        const audioContext = new AudioContext();
        audioContext.suspend();
        const aChuck = await Chuck.init([], audioContext, undefined, "../src/");
        audioContext.resume();
        const outputBox = document.getElementById("output-" + 15);
        aChuck.chuckPrint = (output) => {
            outputBox.innerHTML = output + "<br>";
        }

        aChuck.runCode(`<<< "PASSED", "" >>>;`);
        await new Promise(resolve => setTimeout(resolve, 750));
        return outputBox.innerText.includes("PASSED");
    }),


    new Test(99, "Chuck VM operations and parameters", async () => {
        const aChuck = await Chuck.init([], undefined, undefined, "../src/");
        const outputBox = document.getElementById("output-" + 99);
        print = (output) => {
            outputBox.innerHTML += output + "<br>";
        }
        aChuck.chuckPrint = print;

        print(await aChuck.getParamString("VERSION"));
        print("sample rate: " + await aChuck.getParamInt("SAMPLE_RATE"));
        print("input channels: " + await aChuck.getParamInt("INPUT_CHANNELS"));
        print("output channels: " + await aChuck.getParamInt("OUTPUT_CHANNELS"));
        print("now: " + await aChuck.now());

        return outputBox.innerText !== "";
    }),

]
//=============================================================
// END DEFINE TESTS!
//=============================================================


/** Build Test Suite */
let devChuck;
let audioContext;
let filteredTests = testSuite; // by default, display all tests
let filteredIndices = testSuite.map(test => test.id); // by default, display all tests
let testScore = 0;
let testSize = testSuite.length;
let runButton = document.getElementById("run");
let filterButton = document.getElementById("filter");

// Update test suite score
function updateTestSuiteScore(passed) {
    testScore += passed ? 1 : 0;
    const score = document.getElementById("score");
    score.innerText = testScore + " / " + testSize;
}

// filter tests
function filterTests() {
    const testFilter = document.getElementById("test-filter").value;
    filteredTests = []; // Tests here
    filteredIndices = []; // Test IDs here
    // If no filter, display all tests
    if (testFilter === "") {
        filteredTests = testSuite;
        filteredIndices = testSuite.map(test => test.id);
    } else {
        // Parse tests to filter
        const testRanges = testFilter.split(',');
        filteredIndices = [];
        testRanges.forEach(range => {
            if (range.includes('-')) {
                const [start, end] = range.split('-').map(Number);
                for (let i = start; i <= end; i++) {
                    filteredIndices.push(i);
                }
            } else {
                filteredIndices.push(Number(range));
            }
        });
        // Filter tests
        filteredTests = testSuite.filter(test => filteredIndices.includes(test.id));
    }
    filterDisplay(filteredTests);
}


// filter display
function filterDisplay(filteredTests) {
    const suite = document.getElementById("test-suite");
    // Remove all but first row
    while (suite.rows.length > 1) {
        suite.deleteRow(1);
    }
    filteredTests.forEach(test => {
        Test.addTestHTML(test.id, test.name);
    });
}

// init when the page loads
async function init() {
    audioContext = new AudioContext();
    audioContext.suspend();

    // Uncomment me to have a global chuck object for debugging
    devChuck = await Chuck.init([], audioContext, undefined, "../src/");
    devChuck.connect(audioContext.destination);
    window.audioContext = audioContext;
    window.devChuck = devChuck;

    runButton.disabled = false;
}

// run all tests
async function runTestSuite() {
    // Reset
    testScore = 0;
    testSize = filteredTests.length;

    // clear all output boxes and results
    for (const test of testSuite) {
        let outputBox = document.getElementById("output-" + test.id);
        let result = document.getElementById("result-" + test.id);
        if (outputBox) {
            outputBox.innerHTML = "";
        }
        if (result) {
            result.innerHTML = "--";
            result.style.color = "black";
        }
    }

    const parallelize = document.getElementById("parallelize").checked;

    for (const test of filteredTests) {
        console.log("Running test " + test.id)

        if (parallelize) {
            test.run();
        } else {
            await test.run();
        }
    }
}

// MAIN
window.addEventListener("load", init);

filterButton.addEventListener("click", (e) => {
    e.preventDefault();
    filterTests()
});

runButton.addEventListener("click", () => {
    audioContext.resume();
    runTestSuite()
});
