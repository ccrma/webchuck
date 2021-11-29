pandoc index.md -o index.html
pandoc local-server.md -o local-server.html
pandoc ./tutorials/001.md -o ./tutorials/001.html
pandoc ./tutorials/002.md -o ./tutorials/002.html
osascript -e 'tell application "Google Chrome" to tell the active tab of its first window to reload'
#open -a "Google Chrome" http://localhost:$1/
open -a "Google Chrome"
