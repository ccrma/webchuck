<!-- 
	WebChucK Tutorials, by Mike Mulshine et al

	Praise be to Jack Atherton for making ChucK work on the web... As well as getting Ace to work as a miniAudicle like IDE. WOW.
	
	Praise be to Matt Wright for suggesting the use of pandoc = markdown to html converter, in which we can embed html/js as well.

	Praise of course to Ge Wang for writing ChucK. 

	<3 

	here we go...
-->

<head>
	<meta charset="utf-8">
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <link rel="stylesheet" href="./css/editor.css">
</head>


<!---
Include the ACE and ChucK stuff
-->
<script type="text/javascript" src="./js/ace.js" charset="utf-8"></script>
<script type="text/javascript" src="./js/editor.js"></script>
<script type="text/javascript" src="./js/defer.js"></script>
<script type="text/javascript" src="./js/webchuck_host.js"></script>

# WebChucK 

WebChucK brings the strongly-timed audio programming language, [ChucK](https://chuck.stanford.edu/), to your web browser. 

## What is WebChucK?

WebChucK wraps a web-assembly compiled version of ChucK\'s [virtual machine](https://chuck.cs.princeton.edu/doc/program/vm.html) in a javascript API that enables communication between the browser UI and underlying ChucK [shreds](https://chuck.cs.princeton.edu/doc/language/spork.html). 

## Compatible Browsers

* Chrome and other [Chromium](https://en.wikipedia.org/wiki/Chromium_(web_browser))-based browsers
* Firefox
* Edge
* Opera
* *NOT* Safari ([yet]())

## Demo

Here is a simple ChucK program that plays a sine wave for 1 second at 220Hz. Click <q>Run Code</q> to run this ChucK program and hear the resulting sound. If you don\'t hear anything, check out our  [troubleshooting guide](). 

<pre><div id="editor1" class="ace_editor ace_hidpi ace-chuck" style="font-size: 13px; font-family: Monaco; line-height: 1.25; height: 150px;">// Sine oscillator at 220Hz
SinOsc osc => dac;\
220 => osc.freq;\
1::second => now;\
</div></pre>
<input id="run1" type="button" value="Run Code" />
<br/><br/>

Let\'s do something more complicated. 

<pre><div id="editor2" class="ace_editor ace_hidpi ace-chuck" style="font-size: 13px; font-family: Monaco; line-height: 1.25; height: 150px;">// Something a little more complicated
SinOsc osc => dac;\
330 => osc.freq;\
0.5 => osc.gain;\
1::second => now;\
</div></pre>
<input id="run2" type="button" value="Run Code" />
<br/><br/>


## Tutorials

* [Tutorial 1](./tutorials/001.html): Getting Started - Running ChucK on a Web Page 
* [Tutorial 2](./tutorials/002.html): Interfacing with ChucK - Updating Variables + Events
* [Tutorial 3](./tutorials/002.html): Interfacing with ChucK - Listening for Variables + Events

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
</script>
