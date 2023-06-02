# WebChucK
[site](https://chuck.stanford.edu/webchuck/) | [docs](./docs/classes/Chuck.md) | [npm](https://www.npmjs.com/package/webchuck)

WebChucK brings [ChucK](https://chuck.stanford.edu), a strongly-timed audio programming language, to 
the web! ChucK's C++ source code has been compiled down to WebAssembly (WASM) and runs via the 
`AudioWorkletNode` interface of the Web Audio API. With near-native performance, WebChucK runs on 
modern desktop browsers as well as tablets and mobile devices! Bring together ChucK's real-time 
sound synthesis engine and the interconnectivity of the web to create new experiences and develop 
creative workflows. Use WebChucK to build online audiovisual experiences, immersive multi-channel 
audio web apps, online musical instruments, simply by embedding WebChucK into any website! To learn 
more about WebChucK and what it can do, check out [https://chuck.stanford.edu/webchuck/](https://chuck.stanford.edu/webchuck/)

Try out WebChucK in action through [WebChucK IDE](https://chuck.stanford.edu/ide/)!

## Usage

### NPM

Install WebChucK via npm. This can also be used with TypeScript (example below)

```
npm install webchuck
```

```js
import { Chuck } from 'webchuck'
const theChuck = await Chuck.init([]);

theChuck.runCode(`
    SinOsc sin => dac;
    440 => sin.freq;
    1::second => now;
`);
```

Note that many browsers do not let audio run without a user interaction (e.g. button press).
You can check for a suspended audio context and resume like this:

```js
if (chuck.context.state === "suspended") {
    chuck.context.resume();
}
```

### CDN 

Embed WebChucK as a JS module into your `index.html`

```html
<button id="webchuck">Start WebChucK</button>
<button id="start">Play</button>
    
<script type="text/javascript">
    var thechuck; 
    
    // Import the WebChucK Package and connect the Audio Worklet, start the VM
    document.getElementById('webchuck').addEventListener('click', () => {
        import('https://cdn.jsdelivr.net/npm/webchuck/+esm').then(async (module) => {
            const Chuck = module.Chuck; // Chuck class
            thechuck = await Chuck.init([]); // Create a ChucK object
        });
    });
    
    // Button to run ChucK code
    document.getElementById('start').addEventListener('click', () => {
        thechuck.runCode(" SinOsc osc => dac; 440 => osc.freq; 1::second => now; ");
    });
</script>
```

## Documentation

Check out WebChucK's full documentation [here](https://github.com/ccrma/webchuck/blob/main/docs/classes/Chuck.md)
