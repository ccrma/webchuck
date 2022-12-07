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
var loadChuckFile = function (fileName)
{
    // Check if the file is a .ck file
    if (fileName.split('.').pop() != "ck") {
        console.log(fileName + "is not a .ck file");
        return;
    }

    // Read the contents of the file into the editor
    fetch(fileName)
        .then(response => response.text())
        .then(text =>
        {
            chuckEditor.setValue(text);
            chuckEditor.clearSelection();
            chuckEditor.gotoLine(0, 0, true);
        });
};

/* Toggle vim mode */
var vimMode = false; // default state
var vimModeButton = document.getElementById("vimModeButton");
var toggleVimMode = function ()
{
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

// Run these functions on startup
loadChuckFile("./template/helloSine.ck");