// Load ChucK file from URL
const exampleRoot = "https://raw.githubusercontent.com/ccrma/chuck/main/examples/";
const folders = 'basic/'
var examplePreviewText = "";

// More Examples button in Nav Bar
var moreExamplesButton = document.getElementById("moreExamplesButton");
moreExamplesButton.addEventListener("click", function () { window.location.hash = "more-examples"; });

// Step 1: Fetch ChucK Example into Preview
var loadExampleFromURL = function (url)
{
    fetch(url).then(res => res.text()).then(text =>
    {
        examplePreviewText = text;
        examplePreview.innerHTML = text;
        exampleName = url.split("/").pop();
    });
}
// Step 2: Load Preview Code into Editor
var loadChuckExample = function () {
    loadChuckFileFromString(examplePreview);
    // global file name
    localStorage['chuckCacheName'] = globalFileName = exampleName;
}

/* EXAMPLES MODAL */ 
// Example File Explorer
// TODO: Fix this
var alarm = document.getElementById("alarm.ck");
loadExampleFromURL(exampleRoot + folders + "alarm.ck");
// Preview Examples
var examplePreview = document.getElementById("example-preview");
// Load Preview Button
var loadPreviewButton = document.getElementById("loadPreviewButton");
loadPreviewButton.addEventListener("click", function() {
    loadChuckExample();
    window.location.hash = "#"
});
