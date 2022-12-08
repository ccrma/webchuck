var chuckEditor = ace.edit("editor");
chuckEditor.setTheme("ace/theme/chuck");
chuckEditor.session.setMode("ace/mode/chuck");
chuckEditor.setOptions({
    fontSize: "14px",
    fontFamily: "Monaco, Menlo, Consolas, 'Courier New', monospace",
    cursorStyle: "ace",
    useSoftTabs: true,
    showFoldWidgets: true,
    foldStyle: "markbeginend",
});
chuckEditor.container.style.lineHeight = 1.25;
chuckEditor.renderer.updateFontSize();
chuckEditor.session.setUseWrapMode(true);


/* Load default chuck file */
var globalFileName = "untitled.ck";
var loadChuckFile = function (fileName) {
    // Check if the file is a .ck file
    if (fileName.split('.').pop() != "ck") {
        console.log(fileName + " is not a .ck file");
        return;
    }

    // Read the contents of the file into the editor
    fetch(fileName)
        .then(response => response.text())
        .then(text => {
            chuckEditor.setValue(text);
            chuckEditor.clearSelection();
            chuckEditor.gotoLine(0, 0, true);
        });
};
/* Load chuck file from string data */
var loadChuckFileFromString = function (fileData) {
    chuckEditor.setValue(fileData);
    chuckEditor.clearSelection();
    chuckEditor.gotoLine(0, 0, true);
};



/* Toggle vim mode */
var vimMode = (localStorage['vimMode'] === 'true') || false; // default state
var vimModeButton = document.getElementById("vimModeButton");
function setVimMode (vim)
{
    if (vim) {
        // Set vim mode
        vimModeButton.innerHTML = "Vim Mode: On";
        chuckEditor.setKeyboardHandler("ace/keyboard/vim");
        localStorage['vimMode'] = 'true';
    } else {
        // Set normal mode
        vimModeButton.innerHTML = "Vim Mode: Off";
        chuckEditor.setKeyboardHandler(null);
        localStorage['vimMode'] = 'false';
    }
}
var toggleVimMode = function () { setVimMode(vimMode = !vimMode); };
vimModeButton.addEventListener("click", toggleVimMode);


/* Toggle dark mode */
var darkMode = (localStorage['darkMode'] === 'true') || false; // default state
var darkModeButton = document.getElementById("darkModeButton");
function setDarkMode (dark) 
{
    if (dark) {
        // Set dark mode
        darkModeButton.innerHTML = "Dark Mode: On";
        document.getElementById("ide").classList.add("dark")
        document.getElementById("editor").classList.add("dark")
        document.getElementById("chuck-nav").classList.add("dark")
        localStorage['darkMode'] = 'true';
    } else {
        // Set light mode
        darkModeButton.innerHTML = "Dark Mode: Off";
        document.getElementById("ide").classList.remove("dark")
        document.getElementById("editor").classList.remove("dark")
        document.getElementById("chuck-nav").classList.remove("dark")
        localStorage['darkMode'] = 'false';
    }
};
var toggleDarkMode = function () { setDarkMode(darkMode = !darkMode); };
darkModeButton.addEventListener("click", toggleDarkMode);

/* Export editor contents to chuck file */
var exportChuckButton = document.getElementById("exportChuckButton");
var exportChuckFile = function () {
    // Create a chuck file blob
    var chuckFile = chuckEditor.getValue();
    var chuckFileBlob = new Blob([chuckFile], { type: "text/plain" });
    window.URL = window.URL || window.webkitURL;
    var chuckFileURL = window.URL.createObjectURL(chuckFileBlob);
    // Create invisible download link
    var downloadLink = document.createElement("a");
    downloadLink.href = chuckFileURL;
    downloadLink.download = globalFileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    console.log("Exported chuck file");
}
exportChuckButton.addEventListener("click", exportChuckFile);

// Run this on startup
loadChuckFile("./template/untitled.ck");
setDarkMode(darkMode);
setVimMode(vimMode);

/* Check if the editor has unsaved changes */
var isDirty = function () {
    var defaultFile = `/* Play a sine wave at 440Hz for 1 week */\nSinOsc osc => dac;\n440 => osc.freq;\n1::week => now;`;
    return chuckEditor.getValue() !== defaultFile;
};

/* Detect when the user is about to navigate away from the page */
/* Kinda hacky and works for now */
/* https://stackoverflow.com/questions/7317273/warn-user-before-leaving-web-page-with-unsaved-changes */
/*
window.addEventListener("beforeunload", function (e) {
    if (!isDirty()) {
        console.log("No unsaved changes")
        return undefined;
    }
    var confirmationMessage = 'It looks like you have been editing something. '
        + 'If you leave before saving, your changes will be lost.';

    (e || window.event).returnValue = confirmationMessage; //Gecko + IE
    return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
});
*/
