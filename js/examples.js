// Load ChucK file from URL
const examplesURL = "https://raw.githubusercontent.com/ccrma/chuck/main/";
const subfolders = ["examples", "basic"];
var exampleCode = "";
var exampleName = "";

// More Examples button in Nav Bar
var moreExamplesButton = document.getElementById("moreExamplesButton");
moreExamplesButton.addEventListener("click", function () { window.location.hash = "more-examples"; });

/* LOADING EXAMPLE VIA URL */
// Step 1: Fetch ChucK Example into Preview Window
var loadExampleFromURL = function (url)
{
    // Check if URL leads to a .ck file
    if (url.split('.').pop() !== "ck") {
        console.log("Error: URL does not lead to a .ck file");
        return;
    }

    // Fetch ChucK file from URL
    fetch(url).then(res => res.text()).then(text =>
    {
        exampleCode = text;
        exampleCodePreview.innerHTML = text;
        exampleName = url.split("/").pop();
    });
};
// Step 2: Load Preview Window Code into Editor
var loadChuckExample = function ()
{
    loadChuckFileFromString(exampleCode);
    localStorage['chuckCacheName'] = globalFileName = exampleName;
    printToOutputConsole("Loaded chuck example: " + exampleName);
};
// Preview Code Example Load Button
var exampleCodePreview = document.getElementById("example-code");
var loadPreviewButton = document.getElementById("loadPreviewButton");
loadPreviewButton.addEventListener("click", function ()
{
    loadChuckExample();
    window.location.hash = "#";
});

// Create url with file name
var createURL = function (fileName)
{
    return examplesURL + subfolders.join("/") + "/" + fileName;
};

/*------------------------------------------------*/
/* EXAMPLES FILE BROWSER */
/*------------------------------------------------*/
// Breadcrumb Navigation renderer from subfolder list
var examplesBreadcrumb = document.getElementById("examples-breadcrumb");
var renderBreadcrumbs = function ()
{
    // Clear breadcrumbs
    examplesBreadcrumb.innerHTML = "";

    // Create folder breadcrumbs
    for (let i = 0; i < subfolders.length; i++) {
        var breadcrumb = document.createElement("li");
        breadcrumb.className = "breadcrumb-item";
        // Add link to breadcrumb
        var breadcrumbLink = document.createElement("a");
        breadcrumbLink.href = ""; // TODO: LINKS DON'T WORK YET
        breadcrumbLink.innerHTML = subfolders[i];
        breadcrumb.appendChild(breadcrumbLink);
        // Add breadcrumb to breadcrumb list
        examplesBreadcrumb.appendChild(breadcrumb);
        examplesBreadcrumb.appendChild(document.createTextNode("\u00A0"));
    }
};
renderBreadcrumbs();

// TESTING ONLY
// TODO: temporary way to load files...need to implement a file browser
// only basic examples, I hate this rn
basic = ['adc.ck', 'comb.ck', 'envelope.ck',
    'infnan.ck', 'rec.ck', 'whole.ck',
    'adsr.ck', 'curly++.ck', 'fm.ck',
    'larry++.ck', 'ring.ck', 'wind.ck',
    'alarm.ck', 'curly.ck', 'fm2.ck',
    'larry.ck', 'sndbuf.ck', 'wind2.ck',
    'args.ck', 'delay.ck', 'fm3.ck',
    'lfo.ck', 'step.ck', 'zerox.ck',
    'bar.ck', 'demo0.ck', 'foo.ck',
    'moe++.ck', 'tick.ck', 'blit.ck',
    'demo1.ck', 'foo2.ck', 'moe.ck',
    'tick2.ck', 'blit2.ck', 'demo2.ck',
    'func.ck', 'oscillatronx.ck', 'unchuck.ck',
    'chirp.ck', 'demo3.ck', 'i-robot.ck',
    'rec-auto-stereo.ck', 'valueat.ck', 'chirp2.ck',
    'echo.ck', 'imp.ck', 'rec-auto.ck',
    'whirl.ck'];

var exampleFolder = document.getElementById("example-folder");
var renderFolderFiles = function ()
{
    // Clear folder
    exampleFolder.innerHTML = "";

    // Render folder files from basic list
    for (let i = 0; i < basic.length; i++) {
        var file = document.createElement("a");
        file.classList.add("btn");
        file.classList.add("btn-link");
        file.id = basic[i];
        file.innerHTML = basic[i];

        file.addEventListener("click", function ()
        {
            loadExampleFromURL(createURL(this.id));
        });

        exampleFolder.appendChild(file);
    }
};
renderFolderFiles();