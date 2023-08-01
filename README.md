# WebChucK
[site](https://chuck.stanford.edu/webchuck/) | [docs](https://github.com/ccrma/webchuck/blob/main/docs/classes/Chuck.md) | [npm](https://www.npmjs.com/package/webchuck)

WebChucK brings [ChucK](https://chuck.stanford.edu), a strongly-timed audio programming language, to 
the web! ChucK's C++ source code has been compiled down to WebAssembly (WASM) and runs via the 
`AudioWorkletNode` interface of the Web Audio API. With near-native performance, WebChucK runs on 
modern desktop browsers as well as tablets and mobile devices! Bring together ChucK's real-time 
sound synthesis engine and the interconnectivity of the web to create new experiences and develop 
creative workflows. Use WebChucK to build online audiovisual experiences, immersive multi-channel 
audio web apps, online musical instruments, simply by embedding WebChucK into any website! To learn 
more about WebChucK and what it can do, check out [https://chuck.stanford.edu/webchuck/](https://chuck.stanford.edu/webchuck/)

Try out WebChucK in action through [WebChucK IDE](https://chuck.stanford.edu/ide/)!

## Getting Started

### NPM 

Install WebChucK via npm and use it with TypeScript:

```
npm install webchuck
```

```ts
import { Chuck } from 'webchuck'

// Create the default ChucK object
const theChuck = await Chuck.init([]);

// Run ChucK code
theChuck.runCode(`
    SinOsc sin => dac;
    440 => sin.freq;
    1::second => now;
`);
```

Note that many browsers do not let audio run without a user interaction (e.g. button press).
You can check for a suspended audio context and resume like this:

```ts
if (theChuck.context.state === "suspended") {
    theChuck.context.resume();
}
```

### CDN 

You can also embed WebChucK as a JS module into your `index.html`. Here's an example below in JavaScript:

```html
<button id="webchuck">Start WebChucK</button>
<button id="start">Play</button>
    
<script type="text/javascript">
    var theChuck; 
    
    // Import WebChucK and create a ChucK object 
    document.getElementById('webchuck').addEventListener('click', () => {
        import('https://cdn.jsdelivr.net/npm/webchuck/+esm').then(async (module) => {
            const Chuck = module.Chuck; // Chuck class
            theChuck = await Chuck.init([]); // Create default ChucK object
        });
    });
    
    // Button to run ChucK code
    document.getElementById('start').addEventListener('click', () => {
        theChuck.runCode(" SinOsc osc => dac; 440 => osc.freq; 1::second => now; ");
    });
</script>
```

## Building 

Clone this repository and install npm dependencies. You'll need to make sure you have [Node](https://nodejs.org) installed.

```
git clone https://github.com/ccrma/webchuck.git
npm install
```

Then build WebChucK by running

```
npm run build
```

## Testing

After you've built WebChucK, serve this repository using your local server. Then open `./test/index.html` in your browser.

You can do this on your own or simply run

```
npm run test
```

**Additionallly**: The live WebChuck Test Suite can also be found [here](https://chuck.stanford.edu/webchuck/test)

## Documentation

Check out WebChucK's full documentation [here](https://github.com/ccrma/webchuck/blob/main/docs/classes/Chuck.md)

To generate latest documentation run

```
npm run doc
```
