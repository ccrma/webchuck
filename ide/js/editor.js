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
var loadChuckFile = function (fileName) {
    // Check if the file is a .ck file
    if (fileName.split('.').pop() != "ck") {
        console.log(fileName + "is not a .ck file");
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
// Load default chuck file
loadChuckFile("./template/helloSine.ck");


/* Toggle vim mode */
var vimMode = false; // default state
var vimModeButton = document.getElementById("vimModeButton");
var toggleVimMode = function () {
    if (vimMode = !vimMode) {
        chuckEditor.setKeyboardHandler("ace/keyboard/vim");
        // update vim mode button text
        vimModeButton.innerHTML = "Vim Mode: On";
    } else {
        chuckEditor.setKeyboardHandler("");
        // update vim mode button text
        vimModeButton.innerHTML = "Vim Mode: Off";
    }
};
vimModeButton.addEventListener("click", toggleVimMode);


/* Toggle dark mode */
var darkMode = false; // default state
var darkModeButton = document.getElementById("darkModeButton");
var toggleDarkMode = function () {
    if (darkMode = !darkMode) {
        // Set dark mode
        darkModeButton.innerHTML = "Dark Mode: On";
        document.getElementById("ide").classList.add("dark")
        document.getElementById("editor").classList.add("dark")
        document.getElementById("chuck-nav").classList.add("dark")
    } else {
        // Set light mode
        darkModeButton.innerHTML = "Dark Mode: Off";
        document.getElementById("ide").classList.remove("dark")
        document.getElementById("editor").classList.remove("dark")
        document.getElementById("chuck-nav").classList.remove("dark")
    }
}
darkModeButton.addEventListener("click", toggleDarkMode);

/* Export editor contents to chuck file */
var exportChuckButton = document.getElementById("exportChuckButton");
var exportChuckFile = function () {
    // Create a chuck file blob
    var chuckFile = chuckEditor.getValue();
    var chuckFileBlob = new Blob([chuckFile], { type: "text/plain" });
    window.URL = window.URL || window.webkitURL;
    var chuckFileURL = window.URL.createObjectURL(chuckFileBlob);
    exportChuckButton.setAttribute("href", chuckFileURL);
    exportChuckButton.setAttribute("download", "myFile.ck");
    console.log("Exported chuck file");
}
exportChuckButton.addEventListener("click", exportChuckFile);



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