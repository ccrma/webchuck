var chuckEditors = [];
var htmlEditors = [];

function newChuckEditor(divId, readonly=false) {
    var chuckEditor = ace.edit(divId);
    chuckEditor.setTheme("ace/theme/chuck");
    chuckEditor.session.setMode("ace/mode/chuck");
    chuckEditor.setOptions({
        cursorStyle: "ace",
        useSoftTabs: true,
        showFoldWidgets: true,
        foldStyle: "markbeginend",
        maxLines: 50,
        minLines: 5,
    }); 
    chuckEditor.container.style.lineHeight = 1.25;
    chuckEditor.renderer.updateFontSize();
    chuckEditor.session.setUseWrapMode(true);
    chuckEditor.setReadOnly(readonly);
    chuckEditors.push(chuckEditor);

    return chuckEditors[chuckEditors.length - 1];
}

function newHTMLEditor(divId, readonly=true) {
    var htmlEditor = ace.edit(divId);
    htmlEditor.setTheme("ace/theme/clouds");
    htmlEditor.session.setMode("ace/mode/html");
    htmlEditor.container.style.lineHeight = 1.25;
    htmlEditor.renderer.updateFontSize();
    htmlEditor.session.setUseWrapMode(true);
    htmlEditor.setReadOnly(readonly);
    htmlEditors.push(htmlEditor);

    return htmlEditors[htmlEditors.length - 1];
}
