# WebChucK

[![Node.js Build](https://github.com/ccrma/webchuck/actions/workflows/deploy.yml/badge.svg)](https://github.com/ccrma/webchuck/actions/workflows/deploy.yml)
[![](https://data.jsdelivr.com/v1/package/npm/webchuck/badge)](https://www.jsdelivr.com/package/npm/webchuck)

[site](https://chuck.stanford.edu/webchuck/) | [docs](https://chuck.stanford.edu/webchuck/docs) | [npm](https://www.npmjs.com/package/webchuck)

WebChucK brings [ChucK](https://chuck.stanford.edu), a strongly-timed audio programming language, to 
the web! ChucK's C++ source code has been compiled with [Emscripten](https://emscripten.org) and 
targets WebAssembly (WASM) to run via the `AudioWorkletNode` interface of the Web Audio API. 
With near-native performance, WebChucK runs on modern desktop browsers as well as tablets and mobile 
devices! Bring together ChucK's real-time sound synthesis engine and web tools to create new 
experiences and develop creative workflows. Embed WebChucK into any website to build online audiovisual 
experiences, immersive multi-channel audio web apps, or shareable musical instruments! To learn more 
about WebChucK and what it can do, check out [https://chuck.stanford.edu/webchuck/](https://chuck.stanford.edu/webchuck/)

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

You can also embed WebChucK as a JS module into your `index.html`. 

```html
<html>
  <head>
    <script type="module" defer>
      import { Chuck } from 'https://cdn.jsdelivr.net/npm/webchuck/+esm';

      document.getElementById('action').addEventListener('click', async () => {
        // Initialize default ChucK object, if not already initialized
        window.theChuck ??= await Chuck.init([]);
        // Run ChucK code
        theChuck.runCode(`
          SinOsc sin => dac;
          440 => sin.freq;
          1::second => now;
        `);
      });
    </script>
  </head>
  <body>
    <button id="action">Start and Play</button>
  </body>
</html>
```

You now have a WebChucK instance in the global variable `theChuck`. Read the [API reference](https://chuck.stanford.edu/webchuck/docs) to see how to communicate between JS and ChucK e.g. removing shreds, syncing variables, monitoring the VM etc.

## Documentation

WebChucK full documentation and API reference: [here](https://chuck.stanford.edu/webchuck/docs)

## For Developers

If you are a developer, check out the [Developer Guide](https://github.com/ccrma/webchuck/blob/main/DEVELOPER_GUIDE.md) to get started.

