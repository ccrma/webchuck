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

## Setup a Local Server


### 1. Open the command line application of your choice (Terminal, Command Prompt, etc)

### 2. Navigate to directory for your project

### 3. Run this command:

	python -m SimpleHTTPServer 8080

*Note: The port number doesn\'t have to be 8080.*

### 4. Open this URL in a browser:

	http://localhost:8080

You are now running a server locally on port 8080. 

If you have a file named index.html in your project directory, it should load by default. 

To open other pages on your site, append their path relative to the project directory to the URL, like *http://localhost:8080/otherpage.html*.






