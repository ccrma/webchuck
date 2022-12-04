pandoc ./md/index.md -o index.html
pandoc ./md/local-server.md -o local-server.html
pandoc ./md/001.md -o tutorial-01.html
pandoc ./md/002.md -o tutorial-02.html
pandoc ./md/003.md -o tutorial-03.html
osascript -e 'tell application "Google Chrome" to tell the active tab of its first window to reload'
#open -a "Google Chrome" http://localhost:$1/
open -a "Google Chrome"
