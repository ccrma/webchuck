var code;
fetch("blit2.ck").then((response) => response.text()).then((text) => {
    code = text;
});

var Chuck;
import('https://cdn.jsdelivr.net/npm/webchuck/+esm').then(async (module) => {
    Chuck = module.Chuck; // Chuck class
});
    
var theChuck; 
// Button to run ChucK code
async function runChuckCode() {
    // Create ChucK object if it doesn't exist
    await Chuck;
    if (!theChuck) {
        theChuck = await Chuck.init([]);
    }
    theChuck.runCode(code); // Run ChucK code
};

const delay = 10; // Delay between each character typing (in milliseconds)
var typeCallback;
function typeWriterAnimation(element, text, delay) {
  let charIndex = 0;

  function type() {
    if (charIndex < text.length) {
      element.textContent += text.charAt(charIndex);
      charIndex++;
      typeCallback = setTimeout(type, delay);
    }
  }

  type();
}

function stopTypeWriterAnimation() {
  clearTimeout(typeCallback);
}


var play = false;
document.getElementById("try").addEventListener("click", function() {
  const animationContainer = document.getElementById("animationContainer");
  if (play) {   
    animationContainer.textContent = "";
    theChuck.removeLastCode();
    document.getElementById("try").textContent = "Try WebChucK!";
    stopTypeWriterAnimation();
  } else {
    typeWriterAnimation(animationContainer, code, delay);
    runChuckCode();
    document.getElementById("try").textContent = "Stop";
  }
  play = !play;
});
