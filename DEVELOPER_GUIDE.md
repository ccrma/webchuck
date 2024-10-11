# WebChucK Developer Guide

How to contribute to WebChucK development!

**NOTE**: All development is done on the `dev` branch. `main` is reserved for 
release.

## Table of Contents
- [WebChucK Developer Guide](#webchuck-developer-guide)
  - [Table of Contents](#table-of-contents)
  - [Setup](#setup)
  - [Building](#building)
  - [Testing](#testing)
  - [Documentation](#documentation)
  - [Deploy and Release](#deploy-and-release)

## Setup

Make sure you have [Git](https://git-scm.com) and [Node](https://nodejs.org) installed.

Clone the repository if you haven't already. 

```
git clone https://github.com/ccrma/webchuck.git
```

In the webchuck repo, install npm dependencies

```
npm install
```

## Building

Build WebChucK by running: 

```
npm run build
```

This will build WebChucK and place all necessary files in the `./dist` folder.
Additionally, it will build `./src/wc-bundle` which is the bundled ESM module of
WebChucK (essentially all of `./dist`) for local use. 

## Testing 

After you've built WebChucK, serve this repository using your local server. Then
open `./test/index.html` in your browser.

You can do this on your own or simply run

```
npm run test
```

Run the test bench in the browser, verifying tests pass and sound is made. To
debug tests and print or write more tests, modify `./test/chuckTest.js`.

## Documentation

Run this to generate the latest WebChucK documentation using [TypeDoc](https://typedoc.org/)

```
npm run doc
```

View the documentation at `./docs/index.html`

## Deploy and Release

To package and release a new version of WebChucK, make sure all changes are PR'ed onto the `main` branch. Then from main, tag the release and publish the package to NPM using:

```
npm version patch
npm publish
```

WebChucK is published here: [https://www.npmjs.com/package/webchuck](https://www.npmjs.com/package/webchuck)

Talk to **@gewang** to update the [WebChucK](https://chuck.stanford.edu/webchuck) site.
