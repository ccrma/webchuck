//-----------------------------------------------------------------------------
// Version Updater
//-----------------------------------------------------------------------------
// fetch the version from package.json and update the version number in the footer
fetch('./package.json').then(response => response.json()).then(data => {
  const version = data.version;
  const versionElement = document.getElementById('version-id');
  versionElement.textContent = version;
  versionElement.href = `https://github.com/ccrma/webchuck/releases/tag/v` + version;
});

//-----------------------------------------------------------------------------
// WebChucK TRY ME!
//-----------------------------------------------------------------------------
var code;
fetch("blit2.ck").then((response) => response.text()).then((text) => {
    code = text;
});

var Chuck; // Class
var theChuck; // instance

const tryButton = document.getElementById('try');

var typeWriterCallback;
function typeWriterAnimation(element, text, delay) {
  let charIndex = 0;
  function type() {
    if (charIndex < text.length) {
      element.textContent += text.charAt(charIndex);
      charIndex++;
      typeWriterCallback = setTimeout(type, delay);
    }
  }

  type();
}
function stopTypeWriterAnimation() {
  clearTimeout(typeWriterCallback);
}

// Button to run ChucK code
async function runChuckCode() {
    // Create ChucK object if it doesn't exist
    if (!theChuck) return;
    theChuck.runCode(code); // Run ChucK code
};

var play = false;
tryButton.addEventListener("click", function() {
  const animationContainer = document.getElementById("animationContainer");
  if (play) {   
    animationContainer.textContent = "";
    theChuck.removeLastCode();
    tryButton.textContent = "Try Me!";
    stopTypeWriterAnimation();
  } else {
    const delay = 10; // Delay between each character typing (in milliseconds)
    typeWriterAnimation(animationContainer, code, delay);
    runChuckCode();
    tryButton.textContent = "Stop";
  }
  play = !play;
});

window.addEventListener('load', async () => {
  import('https://cdn.jsdelivr.net/npm/webchuck/+esm').then(async (module) => {
      Chuck = module.Chuck; // Chuck class
      theChuck = await Chuck.init([]); // Create Chuck object
      tryButton.disabled = false;
      tryButton.innerText = "Try Me!";

  });
});
    

//-----------------------------------------------------------------------------
// Build WebChucK Bundle Zipper
//-----------------------------------------------------------------------------
const downloadZipButton = document.getElementById('downloadZipButton');

async function downloadSrc(event) {
  event.preventDefault();
  downloadZipButton.innerText = 'Downloading...';

  const zip = new JSZip();

  const fileUrls = [
    './src/wc-bundle.js',
    './src/webchuck.js',
    './src/webchuck.wasm'
  ];

  // Fetch each file and add it to the zip
  for (const url of fileUrls) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}`);
    }
    if (url.endsWith(".js")) {
        const content = await response.text();
        zip.file(url.split('/').pop(), content);
    } else {
        const content = await response.arrayBuffer();
        zip.file(url.split('/').pop(), content, { binary: true });
    }
  }

  // Generate the zip file and trigger the download
  zip.generateAsync({ type: 'blob' }).then(function(content) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(content);
    a.download = 'webchuck.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }).catch(function(err) {
    console.error('Failed to generate zip', err);
  }).then(function() {
    downloadZipButton.innerText = 'Download';
  });
}

document.getElementById('downloadZip').addEventListener('click', downloadSrc);
downloadZipButton.addEventListener('click', downloadSrc);

/* MISC. */
hljs.highlightAll();