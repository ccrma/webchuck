# What is WebChucK?

WebChucK enables Chuck to run on the web. Using WebAssembly (WASM) and the Web Audio API, you can use WebChucK to build online ChucK-powered audiovisual projects or web apps. To learn more about WebChucK and what it can do, check out: [https://chuck.stanford.edu/webchuck/](https://chuck.stanford.edu/webchuck/)

## Usage

Embedding the WebChucK JS modeule into your `index.html` with JS

```html
<button id="start">Play</button>
    
<script type="text/javascript">
    var thechuck; 
    
    // Import the WebChucK Package and connect the Audio Worklet, start the VM
    import('https://cdn.jsdelivr.net/npm/webchuck@1.1.0/+esm').then(async (module) => {
        const Chuck = module.Chuck; // Chuck class
        thechuck = await Chuck.init([]); // Create a ChucK object
    });
    
    // Button to start the code
    document.getElementById('start').addEventListener('click', () => {
        // Run your ChucK code
        thechuck.runCode(" SinOsc osc => dac; 440 => osc.freq; 1::second => now; ");
    });
</script>
```

Via npm:

```
npm install webchuck
```

```js
import { Chuck } from 'webchuck'
const chuck = await Chuck.init([]);

chuck.runCode(`
    SinOsc sin => dac;
    220 => sin.freq;
    1::week => now;
`);
```

Note that many browsers do not let audio run without a user interaction (e.g. button press).
You can check for a suspended audio context and resume like this:

```js
if (chuck.context.state === "suspended") {
  chuck.context.resume();
}
```
