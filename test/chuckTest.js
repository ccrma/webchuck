//=======================================================================
// Test Class
//=======================================================================
class Test {
    // keep track of test IDs
    static totalTests = 0;
    static testScore = 0;

    constructor(id, name, callback) {
        // increment total tests
        Test.totalTests++;

        this.id = id;
        this.name = name;
        this.callback = callback;
        Test.addTestHTML(this.id, name);
    }

    async run() {
        // set status to running
        var result = document.getElementById("result-" + this.id);
        result.innerHTML = "RUNNING";
        result.style.color = "orange";

        this.renderTestResult(await this.callback());
    }

    static addTestHTML(id, name) {
        const suite = document.getElementById("test-suite");
        var test = document.createElement("tr");
        test.id = "test-" + id;

        var testNumber = document.createElement("td");
        testNumber.innerText = id;

        var testName = document.createElement("td");
        testName.innerText = name;

        var result = document.createElement("td");
        result.innerHTML = "--";
        result.id = "result-" + id;

        var output = document.createElement("td");
        output.id = "output-" + id;

        test.appendChild(testNumber);
        test.appendChild(testName);
        test.appendChild(result);
        test.appendChild(output);
        suite.appendChild(test);
    }

    renderTestResult(passed) {
        // update test result
        var result = document.getElementById("result-" + this.id);
        result.innerHTML = passed ? "PASSED" : "FAILED";
        result.style.color = passed ? "green" : "red";

        // update score
        Test.testScore += passed ? 1 : 0;
        const score = document.getElementById("score");
        score.innerText = Test.testScore + " / " + Test.totalTests; 
    }
}

//=======================================================================
// Test Suite
//=======================================================================
var Chuck;
var devChuck; // = Chuck.init([], undefined, undefined, "../src/")


var runButton = document.getElementById("run");
    
import('../src/wc-bundle.js').then(async (module) => {
    Chuck = module.Chuck; // Import Chuck class
    runButton.disabled = false;
});

// DEFINE ALL TESTS!!!
const testSuite = [
    /*

    new Test(1, "[sound] Define a ChucK and runCode 220hz 0.5 second", async () => {
        var aChuck = await Chuck.init([], undefined, undefined, "../src/");
        var outputBox = document.getElementById("output-" + 1);
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
        var aChuck = await Chuck.init([{serverFilename: "./testFiles/test2.ck", virtualFilename: "test2.ck"}], undefined, undefined, "../src/");
        var outputBox = document.getElementById("output-" + 2);
        aChuck.chuckPrint = (output) => {
            outputBox.innerText = output;
        }
        aChuck.runFile("test2.ck");
        await new Promise(resolve => setTimeout(resolve, 1500)); 
        return outputBox.innerText == "PASSED";
    }),

    new Test(3, "[sound] Dynamic load in a chuck file from URL, 880Hz 1 second", async () => {
        var aChuck = await Chuck.init([], undefined, undefined, "../src/");
        var outputBox = document.getElementById("output-" + 3);
        aChuck.chuckPrint = (output) => {
            outputBox.innerText = output;
        }
        await aChuck.loadFile("./testFiles/test3.ck");
        aChuck.runFile("test3.ck");
        await new Promise(resolve => setTimeout(resolve, 1500)); 
        return outputBox.innerText == "PASSED";
    }),

    new Test(4, "[sound] Dynamic load in a kick wav file from URL", async () => {
        var aChuck = await Chuck.init([], undefined, undefined, "../src/");
        var outputBox = document.getElementById("output-" + 4);
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
        var outputBox = document.getElementById("output-" + 5);
        devChuck.runCode(`
            1 => global int GLOBAL_INT;
            1.0 => global float GLOBAL_FLOAT;
        `);
        await new Promise(resolve => setTimeout(resolve, 100));
        test1 = await devChuck.getInt("GLOBAL_INT") == 1 && await devChuck.getFloat("GLOBAL_FLOAT") == 1.0;
        outputBox.innerHTML += "Get OK " + test1 + "<br>";
        devChuck.setInt("GLOBAL_INT", 2);
        devChuck.setFloat("GLOBAL_FLOAT", 2.0);
        await new Promise(resolve => setTimeout(resolve, 300));
        test2 = await devChuck.getInt("GLOBAL_INT") == 2 && await devChuck.getFloat("GLOBAL_FLOAT") == 2.0;
        outputBox.innerHTML += "Set OK " + test2 + "<br>";
        return test1 && test2;
    }),

    new Test(6, "Test shred management, add, remove, replace", async () => {
        var aChuck = await Chuck.init([], undefined, undefined, "../src/");
        var outputBox = document.getElementById("output-" + 6);
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
        var removed = await aChuck.removeLastCode() == 2;
        await new Promise(resolve => setTimeout(resolve, 100));
        var replaced = (await aChuck.replaceCode(`<<< "REPLACED Shred 1 with a new program\n", "" >>>; 1::second => now;`)).newShred == 1;
        await new Promise(resolve => setTimeout(resolve, 100));
        var active = await aChuck.isShredActive(1);
        await new Promise(resolve => setTimeout(resolve, 100));
        var removed2 = await aChuck.removeShred(1) == 1;
        await new Promise(resolve => setTimeout(resolve, 100));
        return removed == true &&
               replaced == true && 
               active == true && 
               removed2 == true;
    }),

    new Test(7, "Test RunFileWithArgs", async () => {
        var aChuck = await Chuck.init([], undefined, undefined, "../src/");
        var outputBox = document.getElementById("output-" + 7);

        // print lambda
        print = (output) => {
            outputBox.innerHTML += output + "<br>";
        }
        aChuck.chuckPrint = print;
        outputBox.innerHTML += "Passing in arguments: 1 2 foo" + "<br>";

        await aChuck.loadFile("./testFiles/test7.ck");
        await aChuck.runFileWithArgs("test7.ck", "1:2:foo");
        await new Promise(resolve => setTimeout(resolve, 100));

        return outputBox.innerText.includes("number of arguments: 3");
    }),
    
    new Test(8, "Test isShredActive", async () => {
        var aChuck = await Chuck.init([], undefined, undefined, "../src/");
        var outputBox = document.getElementById("output-" + 8);

        // print lambda
        print = (output) => {
            outputBox.innerHTML += output + "<br>";
        }
        aChuck.chuckPrint = print;
        outputBox.innerHTML += "Starting shred 1 for 1 second" + "<br>";

        aChuck.runCode(`1::second => now;`);
        await new Promise(resolve => setTimeout(resolve, 100));
        var test1; var test2;
        await aChuck.isShredActive(1).then((active) => {
            print("@100ms - Shred 1 is active: " + active);
            test1 = active == 1
        });
        await new Promise(resolve => setTimeout(resolve, 1000));
        await aChuck.isShredActive(1).then((active) => {
            print("@1s - Shred 1 is active: " + active);
            test2 = active == 0
        });

        return test1 && test2;
    }),
    */

    new Test(9, "Machine add/replace/remove/clear", async () => {
        var aChuck = await Chuck.init([
            {serverFilename: "./testFiles/test9.ck", virtualFilename: "test9.ck"},
        ], undefined, undefined, "../src/");
        var outputBox = document.getElementById("output-" + 9);

        // print lambda
        print = (output) => {
            outputBox.innerHTML += output + "<br>";
        }
        aChuck.chuckPrint = print;

        aChuck.runCode(`
            Machine.add("test9.ck") => int id;
            100::ms => now;
            Machine.replace(id, "test9.ck");
            500::ms => now;
            Machine.remove(id);
            100::ms => now;
            Machine.clearVM();
        `)
        await new Promise(resolve => setTimeout(resolve, 50));
        var test1; var test2; var test3;
        await aChuck.isShredActive(2).then((active) => {
            print("@50ms - Shred 2 is added: " + active);
            test1 = active == 1
        });
        await new Promise(resolve => setTimeout(resolve, 100));
        await aChuck.isShredActive(2).then((active) => {
            print("@150ms - Shred 2 is replaced: " + active);
            test2 = active == 1
        });
        await new Promise(resolve => setTimeout(resolve, 700));
        await aChuck.isShredActive(1).then((active) => {
            print("@750ms - VM is clear: " + (active == 0))
            test3 = active == 0
        });
        return test1 && test2 && test3;
    }),


    new Test(99, "Chuck VM operations and parameters", async () => {
        var aChuck = await Chuck.init([], undefined, undefined, "../src/");
        var outputBox = document.getElementById("output-" + 99);

        // print lambda
        print = (output) => {
            outputBox.innerHTML += output + "<br>";
        }
        aChuck.chuckPrint = print;

        print( await aChuck.getParamString("VERSION") );
        print( "sample rate: " + await aChuck.getParamInt("SAMPLE_RATE") );
        print( "input channels: " + await aChuck.getParamInt("INPUT_CHANNELS") );
        print( "output channels: " + await aChuck.getParamInt("OUTPUT_CHANNELS") );
        print( "now: " + await aChuck.now() );

        return outputBox.innerText !== "";
    }),


]

// run all tests
async function runTestSuite() {
    // Reset
    Test.testScore = 0;
    // clear all output boxes and results
    for(const test of testSuite) {
        var outputBox = document.getElementById("output-" + test.id);
        outputBox.innerText = "";
        var result = document.getElementById("result-" + test.id);
        result.innerHTML = "--";
        result.style.color = "black";
    }

    parallelize = document.getElementById("parallelize").checked;

    devChuck = await Chuck.init([], undefined, undefined, "../src/");

    for(const test of testSuite) {
        console.log("Running test " + test.id)

        if (parallelize) {
            test.run(); 
        } else {
            await test.run();
        }
    }
}

runButton.addEventListener("click", runTestSuite);
    