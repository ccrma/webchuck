var chuckEditors = [];
var htmlEditors = [];
var jsEditors = [];

function newChuckEditor(divId, readonly=false) {
    var editor = ace.edit(divId);
    editor.setTheme("ace/theme/chuck");
    editor.session.setMode("ace/mode/chuck");
    editor.setOptions({
        fontSize: "13px",
        fontFamily: "Monaco",
        cursorStyle: "ace",
        useSoftTabs: true,
        showFoldWidgets: true,
        foldStyle: "markbeginend",
        maxLines: 50,
        minLines: 5,
    }); 
    editor.container.style.lineHeight = 1.25;
    editor.renderer.updateFontSize();
    editor.session.setUseWrapMode(true);
    editor.setReadOnly(readonly);
    chuckEditors.push(editor);

    return chuckEditors[chuckEditors.length - 1];
}

function newHTMLEditor(divId, readonly=true) {
    var editor = ace.edit(divId);
    editor.setTheme("ace/theme/dreamweaver");
    editor.session.setMode("ace/mode/html");
    editor.setOptions({
        useSoftTabs: true,
        showFoldWidgets: true,
        foldStyle: "markbeginend",
        maxLines: 100,
        minLines: 5,
    }); 
    editor.container.style.lineHeight = 1.25;
    editor.renderer.updateFontSize();
    editor.session.setUseWrapMode(true);
    editor.setReadOnly(readonly);
    htmlEditors.push(editor);

    return htmlEditors[htmlEditors.length - 1];
}

function newJSEditor(divId, readonly=true) {
    var editor = ace.edit(divId);
    editor.setTheme("ace/theme/chrome");
    editor.session.setMode("ace/mode/javascript");
    editor.container.style.lineHeight = 1.25;
    editor.renderer.updateFontSize();
    editor.session.setUseWrapMode(true);
    editor.setReadOnly(readonly);
    jsEditors.push(editor);

    return jsEditors[jsEditors.length - 1];
}
