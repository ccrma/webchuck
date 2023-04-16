# WebChucK
[site](https://chuck.stanford.edu/webchuck/) | [docs](./docs/classes/Chuck.md) | [npm](https://www.npmjs.com/package/webchuck)

WebChucK is [ChucK](https://chuck.stanford.edu) running on the web! Recent advancements have enabled ChucK to run in any web browser with near native performance. Run ChucK on the web, on a tablet, or on your mobile device; take it wherever you go! WebChucK opens the door for new users and creative workflows. Using WebAssembly (WASM) and the Web Audio API, you can use WebChucK anywhere to build new online audiovisual experiences and web apps. To learn more about WebChucK and what it can do, check out [https://chuck.stanford.edu/webchuck/](https://chuck.stanford.edu/webchuck/)

See WebChucK in action, [WebChucK IDE](https://chuck.stanford.edu/ide/)!

## Usage

Via npm:

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

You can also embed the WebChucK JS module into your `index.html`

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

WebChucK Documentation [here](./docs/classes/Chuck.md)
