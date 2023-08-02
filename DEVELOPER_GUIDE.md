# WebChucK Developer Guide

Getting started with WebChucK development!

## Table of Contents
1. [Setup](#setup)
2. [Building](#building)
3. [Testing](#testing)
4. [Documentation](#documentation)

## Setup

Make sure you have [Git](https://git-scm.com) and [Node](https://nodejs.org) installed.

Clone the repository

```
git clone https://github.com/ccrma/webchuck.git
```

`cd` into webchuck and install npm dependencies

```
npm install
```

## Building

Build WebChucK by running: 

```
npm run build
```

This will build WebChucK and place all necessary files in the `./dist` folder. Additionally, it will build `./src/wc-bundle` which is a bundled ESM module of WebChucK (essentially all of `./dist`) for local use. 

## Testing 

After you've built WebChucK, serve this repository using your local server. Then open `./test/index.html` in your browser.

You can do this on your own or simply run

```
npm run test
```

Run the test bench in the browser, verifying tests pass and sound is made. If tests fail and need to be debugged or more tests are needed, modify `./test/chuckTest.js`.

## Documentation

Run this to generate the latest WebChucK documentation using [TypeDoc](https://typedoc.org/)

```
npm run doc
```

View the documentation at `./docs/index.html`
