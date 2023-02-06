// Load ChucK examples from URL
const EXAMPLES_ROOT_URL = "https://raw.githubusercontent.com/ccrma/chuck/main/";
let folderPath = ["examples"];
let moreExamplesJSON;
var exampleCode = "";
var exampleName = "";

// Load the more exemples JSON file
readJSONExamples().then(() =>
{
    renderFolderFiles();
    renderBreadcrumbs();
});

// More Examples button in Nav Bar
var moreExamplesButton = document.getElementById("moreExamplesButton");
moreExamplesButton.addEventListener("click", function () { window.location.hash = "more-examples"; });

//------------------------------------------------
// EXAMPLES FILE BROWSER 
// Handle loading of files
//------------------------------------------------
/**
 * Create a file element to display a subfolder or chuck example
 */
function createFileElement(fileName)
{
    // Create a file element
    var file = document.createElement("a");
    file.classList.add("btn", "btn-link");

    // If file is a chuck example
    if (fileName.split('.').pop() === "ck")
    {
        file.innerHTML = file.id = fileName;
        file.addEventListener("click", function ()
        {
            // Load the example to preview window
            loadExampleFromURL(createURL(fileName));
        });
    } else
    {
        file.id = fileName;
        // Make folders bold
        file.innerHTML = "<b>" + fileName + "</b>";
        file.addEventListener("click", function ()
        {
            // Update the path to the current folder
            folderPath.push(fileName);
            // Render breadcrumbs after update
            renderBreadcrumbs();
            // Render folder files after update
            renderFolderFiles();
        });
    }

    return file;
}

/**
 * Render all the contents of a folder directory to the screen
 * This is called when the folder path is updated 
 */
var exampleFolder = document.getElementById("example-folder");
function renderFolderFiles() 
{
    // reset folder contents
    exampleFolder.innerHTML = "";

    // Read in all the files in the folder from the JSON file
    var folderContents = retrieveFolderContents();
    // Split the folders and files into two lists, if .ck extension, it is a file
    var folders = folderContents["folders"];
    var files = folderContents["files"];
    // Alphabetize both lists
    folders.sort();
    files.sort();

    // Render folders list, then render files list
    for (let i = 0; i < folders.length; i++)
    {
        exampleFolder.appendChild(createFileElement(folders[i]));
    }
    for (let i = 0; i < files.length; i++)
    {
        exampleFolder.appendChild(createFileElement(files[i]));
    }
};

//---------------------------------------------------------------------
// EXAMPLES PREVIEW WINDOW FUNCTIONS
// Data functions for examples preview window
//---------------------------------------------------------------------
/**
 * Load ChucK file from URL, this loads into the preview window
 * @param {String} url 
 */
var loadExampleFromURL = function (url)
{
    // Check if URL leads to a .ck file
    if (url.split('.').pop() !== "ck")
    {
        console.log("Error: URL does not lead to a .ck file");
        return;
    }

    // Fetch ChucK file from URL
    fetch(url)
        .then(handleErrors)
        .then(res => res.text()).then(text =>
        {
            exampleCode = text;
            exampleCodePreview.innerHTML = text;
            exampleName = url.split("/").pop();
        })
        .catch(error =>
        {
            console.log("Error fetching file: ", error)
            exampleCodePreview.innerHTML = "Error fetching " + url + ": " + error;
        });
};

/**
 * Load preview window code into the editor
 * Sets the global file name to the example name
 */
var loadPreviewToEditor = function ()
{
    if (exampleCode === "")
    {
        return;
    }
    loadChuckFileFromString(exampleCode);
    localStorage['chuckCacheName'] = globalFileName = exampleName;
    printToOutputConsole("Loaded chuck example: " + exampleName);
};

// Get example code preview window
var exampleCodePreview = document.getElementById("example-code");
// Load example button
var loadPreviewButton = document.getElementById("loadPreviewButton");
loadPreviewButton.addEventListener("click", function ()
{
    loadPreviewToEditor();
    window.location.hash = "#";
});

//---------------------------------------------------------------------
// BREADCRUMB NAVIGATION FUNCTIONS
// Breadcrumb navigation and management
//---------------------------------------------------------------------
// Breadcrumb Navigation renderer from subfolder list
var breadcrumbBar = document.getElementById("examples-breadcrumb");

/**
 * Create a breadcrumb element
 * Handles the onclick event and can update the folder path 
 * @param {int} index 
 */
function createBreadcrumb(folderName, index)
{
    // Create breadcrumb
    var breadcrumb = document.createElement("li");
    breadcrumb.className = "breadcrumb-item";
    // Add link to breadcrumb
    var breadcrumbButton = document.createElement("button");
    breadcrumbButton.textContent = folderName;
    breadcrumbButton.onclick = function ()
    {
        // Update the path to the current breadcrumb folder
        cutPath(index);
        // Render breadcrumbs after update
        renderBreadcrumbs();
        // Render folder files after update
        renderFolderFiles();
    };
    breadcrumb.appendChild(breadcrumbButton);

    return breadcrumb;
}

/**
 * Populate breadcrumb navigation bar to the modal
 */
function renderBreadcrumbs()
{
    // Clear breadcrumbs
    breadcrumbBar.innerHTML = "";

    // Create breadcrumb trail for folders
    for (let i = 0; i < folderPath.length; i++)
    {
        breadcrumbBar.appendChild(createBreadcrumb(folderPath[i], i));
        // note: add this whitespace char cause weird spacing 
        breadcrumbBar.appendChild(document.createTextNode("\u00A0"));
    }
};

//---------------------------------------------------------------------
// PATH MANAGEMENT HELPER FUNCTIONS
// Retrieve file/file paths, path list management, url to path
//---------------------------------------------------------------------
/**
 * Handle errors in fetch requests 
 * @param {*} response 
 * @returns response if response is ok
 */
function handleErrors(response)
{
    if (!response.ok)
    {
        throw Error(response.statusText);
    }
    return response;
}

/**
 * Read in JSON file of example file paths 
 */
function readJSONExamples()
{
    // return a promise
    return fetch('./examples/moreExamples.json')
        .then(handleErrors)
        .then(response => response.json())
        .then(data => moreExamplesJSON = data);
}


/**
 * Use path list to retrieve list of files/folders from JSON object 
 * @returns {Object} Object with two lists, folders and files
 */
function retrieveFolderContents()
{
    // Lookup the contents of the last folder in the path
    let lookup = folderPath[folderPath.length - 1];
    let folderContents = moreExamplesJSON[lookup];

    // Split folders and files (.ck) into two lists
    let files = folderContents.filter(file => file.split('.').pop() === "ck");
    let folders = folderContents.filter(file => !files.includes(file));

    return { "folders": folders, "files": files };
}

/**
 * Append subfolder to path list 
 * @param {*} subfolder 
 */
function appendToPath(subfolder)
{
    folderPath.push(subfolder);
}

/**
 * Split path list at index, remove all subfolders after index
 * @param {int} index 
 */
function cutPath(index)
{
    folderPath = folderPath.slice(0, index + 1);
}

/**
 * Create URL to a chuck example 
 * @returns {String} URL to a chuck example
 */
function createURL(fileName)
{
    return EXAMPLES_ROOT_URL + folderPath.join("/") + "/" + fileName;
}