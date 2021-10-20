<!-- 
	WebChucK Tutorials, by Mike Mulshine et al

	Praise be to Jack Atherton for making ChucK work on the web... As well as getting Ace to work as a miniAudicle like IDE. WOW.
	
	Praise be to Matt Wright for suggesting the use of pandoc = markdown to html converter, in which we can embed html/js as well.

	Praise of course to Ge Wang for writing ChucK. 

	<3 

	here we go...
-->

<!---
Include the ACE and ChucK stuff
-->
<script type="text/javascript" src="./js/ace.js" charset="utf-8"></script>
<script type="text/javascript" src="./js/editor.js"></script>
<script type="text/javascript" src="./js/defer.js"></script>
<script type="text/javascript" src="./js/webchuck_host.js"></script>

# WebChucK Tutorials\
#### by Mike Mulshine\
So many thanks to Ge Wang, Jack Atherton, Matt Wright. 

Go ahead. Make some sound on the web. 



### Editor 1
<div id="editor1" class="ace_editor ace_hidpi ace-chuck" style="font-size: 13px; font-family: Monaco; line-height: 1.25; height: 150px;">
SinOsc osc => dac;
220 => osc.freq;
0.5 => osc.gain;
1::second => now;
</div>
<input id="run1" type="button" value="Run Code" />
<br/><br/>

### Editor 2
<div id="editor2" class="ace_editor ace_hidpi ace-chuck" style="font-size: 13px; font-family: Monaco; line-height: 1.25; height: 150px;">
SinOsc osc => dac;\
330 => osc.freq;\
0.5 => osc.gain;\
1::second => now;\
</div>
<input id="run2" type="button" value="Run Code" />
<br/><br/>

## Running WebChucK on Your Site

### 1. Download WebChucK 

Download the WebChucK javascript and web assembly dependencies **[here](./webchuck-src.zip)**. 

### 2. Setup Your Site

Make a **project** folder.\

Unzip **webchuck-src.zip**.\

Copy **webchuck.wasm**, **webchuck.js**, and **webchuck_host.js** in to a new folder called **js**.\

### 3. Make a simple webpage (or add to your own)

This can be **index.html** or whatever you'd like as long as it is in your **project** folder.

<div id="htmlEditor1" class="ace_editor ace_hidpi ace-html" style="font-size: 13px; height:200px">
	<!DOCTYPE html>
	<html>
	<body>

	<h1>Hello WebChucK</h1>

	</body>
	</html>
</div>

### 3. Link WebChucK

Link **webchuck_host.js** via the script tag.

<div id="htmlEditor2" class="ace_editor ace_hidpi ace-html" style="font-size: 13px; height:200px">
	<!DOCTYPE html>
	<html>
	<body>

	<script type="text/javascript" src="./js/webchuck_host.js"></script>

	<h1>Hello WebChucK</h1>

	</body>
	</html>
</div>

### 4. Start WebChucK

WebAudio AudioContext cannot be started without user interaction on most browsers. So, we will start WebChucK with a button click.

Also, you will need to [run a local server](#toserver) to start WebChucK and test locally. 

<div id="htmlEditor3" class="ace_editor ace_hidpi ace-html" style="font-size: 13px; height:350px">
	<!DOCTYPE html>
	<html>
	<body>

	<script type="text/javascript" src="./js/webchuck_host.js"></script>

	<h1>Hello WebChucK</h1>

	<input id="startChucKButton" type="button" value="Start ChucK" />

	<script>
	    var startChucKButton = document.getElementById( "startChucKButton" );
	    runButton.addEventListener( "click", async function() {
	    	await startChuck();
	        await theChuckReady;
	    });
	</script>
	</body>
	</html>
</div>

### 5. Run some ChucK Code:

You can pass ChucK code in a string to WebChucK runCode() function.

<div id="htmlEditor4" class="ace_editor ace_hidpi ace-html" style="font-size: 13px; height:425px">
	<!DOCTYPE html>
	<html>
	<body>

	<script type="text/javascript" src="./js/webchuck_host.js"></script>

	<h1>Hello WebChucK</h1>

	<input id="startButton" type="button" value="Start ChucK" />

	<script>
	    var startButton = document.getElementById( "startButton" );
	    startButton.addEventListener( "click", async function() {
	    	await startChuck();
	        await theChuckReady;
	        await theChuck.runCode("\
	        	SinOsc osc => dac;\
	        	330 => osc.freq;\
	        	1::second => now;\
	        ");
	    });
	</script>
	</body>
	</html>
</div>

Your webpage should look and function like [this](./basic.html).

## Appendix: Setting up a local server <a name="toserver"></a>


### 1. Open terminal

### 2. Navigate to **project** directory

### 3. Run this command:

python -m SimpleHTTPServer `[port`]

`[port`] is usually something like 8000 or 8080

### 4. Open this URL in a browser:

http://localhost:`[port`]




<script>
	async function prep() {
		//await preloadFilenames( serverFilesToPreload );
        await startChuck();
        await theChuckReady;
        theChuck.removeLastCode();
	}

	var editor1 = newChuckEditor("editor1");
    var run1 = document.getElementById( "run1" );
    run1.addEventListener( "click", async function() {
    	await prep();
        await theChuck.runCode(editor1.getValue());
    });

    var editor2 = newChuckEditor("editor2");
    var run2 = document.getElementById( "run2" );
    run2.addEventListener( "click", async function() {
    	await prep();
        await theChuck.runCode(editor2.getValue());
    });

    var htmlEditor1 = newHTMLEditor("htmlEditor1", true);
    var htmlEditor2 = newHTMLEditor("htmlEditor2", true);
    var htmlEditor2 = newHTMLEditor("htmlEditor3", true);
    var htmlEditor2 = newHTMLEditor("htmlEditor4", true);

</script>

Here is some more text that should show up at the bottom of the tutorial.\


