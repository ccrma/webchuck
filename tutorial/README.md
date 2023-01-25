# webchuck-tutorial
WebChucK Tutorials

To edit and test locally:

1. Start local server:

```
./run-server.sh [port]
```

2. Edit homepage.md (markdown)

3. Run build script

```
./build.sh [port]
```

The build script runs pandoc to generate index.html file. Then it opens Chrome at http://localhost:[port]. 
