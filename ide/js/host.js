/* Connect IDE buttons to WebChucK */
var startButton = document.getElementById("startChuck");
var compileButton = document.getElementById("compileButton");
var replaceButton = document.getElementById("replaceButton");
var removeButton = document.getElementById("removeButton");
var micButton = document.getElementById("micButton");

/* Connect Shreds and Console to WebChucK */
var shredsToRows = {};
var shredsTable = document.getElementById("shredsTable");
var outputConsole = document.getElementById("console");

/* File handling */
/*
var fileFormButton = document.getElementById("fileFormButton");
var fileForm = document.getElementById("fileForm");
var uploadButton = document.getElementById("fileButton");
var uploadFilename = document.getElementById("uploadFilename");
var uploadFile = document.getElementById("uploadFile");
*/
var serverFilesToPreload = serverFilesToPreload || [];

// preload files
var preloadedFilesReady = preloadFilenames(serverFilesToPreload);

// use named functions instead of anonymous ones
// so they can be replaced later if desired
var chuckCompileButton = function () {
    // send message to compile and play code
    theChuck.runCode(chuckEditor.getValue()).then(
        function (shredID) {
            addShredRow(shredID);
        },
        function (failure) { }
    );
};

var chuckReplaceButton = function () {
    // send message to replace last shred with this code
    theChuck.replaceCode(chuckEditor.getValue()).then(
        function (shreds) {
            removeShredRow(shreds.oldShred);
            addShredRow(shreds.newShred);
        },
        function (failure) { }
    );
};

var chuckRemoveButton = function () {
    // send message to remove most recent shred
    theChuck.removeLastCode().then(
        function (shred) {
            removeShredRow(shred);
        },
        function (failure) { }
    );
};

var chuckMicButton = function () {
    navigator.mediaDevices
        .getUserMedia({ audio: true, video: false })
        .then(function (stream) {
            micButton.disabled = true;
            const source = audioContext.createMediaStreamSource(stream);
            source.connect(theChuck);
        });
};

/*
var chuckUploadButton = function ()
{
  if (uploadFile.files.length == 0) {
    return;
  }
  var file = uploadFile.files[0];

  var fr = new FileReader();
  fr.onload = function ()
  {
    var data = new Uint8Array(fr.result);

    theChuck.createFile("", uploadFilename.value, data);

    uploadFile.value = "";
    uploadFilename.value = "";
  };
  fr.readAsArrayBuffer(file);
};
*/

startButton.addEventListener("click", async function () {
    startButton.disabled = true;
    await preloadedFilesReady;
    await startChuck();
});

// Button initial states
startButton.disabled = false;
compileButton.disabled = true;
replaceButton.disabled = true;
removeButton.disabled = true;
micButton.disabled = true;

compileButton.addEventListener("click", chuckCompileButton);
replaceButton.addEventListener("click", chuckReplaceButton);
removeButton.addEventListener("click", chuckRemoveButton);
micButton.addEventListener("click", chuckMicButton);
//uploadButton.addEventListener("click", chuckUploadButton);

theChuckReady.then(function () {
    compileButton.disabled = false;
    replaceButton.disabled = false;
    removeButton.disabled = false;
    micButton.disabled = false;
    //uploadButton.disabled = false;
    outputConsole.value += "WebChucK is ready!\n";
});

/*
(function ()
{
  var showingFileForm = false;
  fileFormButton.addEventListener("click", function ()
  {
    if (showingFileForm) {
      // hide file form
      fileFormButton.innerHTML = "Show File Uploader";
      fileForm.classList.add("hidden");
    } else {
      // show file form
      fileFormButton.innerHTML = "Hide File Uploader";
      fileForm.classList.remove("hidden");
    }
    showingFileForm = !showingFileForm;
  });
})();
*/

// self invoking function
chuckPrint = function () {
    if (outputConsole) outputConsole.value = ""; // clear browser cache
    return function (text) {
        if (arguments.length > 1) {
            text = Array.prototype.slice.call(arguments).join(" ");
        }

        if (outputConsole) {
            outputConsole.value += text + "\n";
            outputConsole.scrollTop = outputConsole.scrollHeight; // focus on bottom
        }
    };
}();

function addShredRow(theShred) {
    var row = shredsTable.insertRow();
    var cell0 = row.insertCell(0);
    var cell1 = row.insertCell(1);
    var cell2 = row.insertCell(2);
    var cell3 = row.insertCell(3);

    shredsToRows[theShred] = row;

    cell0.innerHTML = "" + theShred;
    cell1.innerHTML = chuckEditor.getValue().substring(0, 20) + "...";
    (function (cell, myShred) {
        var getTime = function () {
            return Math.floor(Date.now() / 1000);
        };
        var formatTime = function (i) {
            // add zero in front of numbers < 10
            if (i < 10) {
                i = "0" + i;
            }
            return i;
        };

        var startTime = getTime();
        var removed = false;
        function updateTime() {
            var now = getTime();
            var elapsed = now - startTime;
            var m = Math.floor(elapsed / 60);
            var s = Math.floor(elapsed % 60);

            // piggyback off time keeper to remove row
            // if it stops running
            if (!(myShred in shredsToRows)) {
                removed = true;
            }
            theChuck.isShredActive(myShred).then(function (result) {
                if (!result && !removed) {
                    removed = true;
                    removeShredRow(myShred);
                    return;
                }
            });

            // only keep updating time if row still exists
            if (!removed && document.contains(cell)) {
                cell.innerHTML = formatTime(m) + ":" + formatTime(s);
                setTimeout(updateTime, 1000);
            }
        }
        updateTime();
    })(cell2, theShred);
    /* Create a remove button for the shread */
    /*
    var removeButton = document.createElement("BUTTON");
    removeButton.innerHTML = "Remove";
    cell3.appendChild(removeButton);
    */
    var removeButton = document.createElement("INPUT");
    removeButton.setAttribute("type", "image"); 
    removeButton.setAttribute("src", "./assets/icons/remove.png");
    removeButton.classList.add("chuckButton");
    removeButton.setAttribute("alt", "remove button");
    cell3.appendChild(removeButton);

    removeButton.addEventListener(
        "click",
        (function (shredID) {
            return function () {
                theChuck.removeShred(shredID).then(
                    function (removedShred) {
                        removeShredRow(theShred);
                    },
                    function (failure) {
                        console.log(failure);
                    }
                );
            };
        })(theShred)
    );
}

function removeShredRow(theShred) {
    if (theShred in shredsToRows) {
        shredsToRows[theShred].parentNode.removeChild(shredsToRows[theShred]);
        delete shredsToRows[theShred];
    }
}
