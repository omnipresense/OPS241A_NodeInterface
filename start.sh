echo off
echo Simplified launch of OmniPresense server.
echo The preferred way to run the server is to run directly with node index.js
echo For linux, you want to provide the port, like /dev/ttyACM0 or /dev/ttyS3
echo if Windows WSL, sudo node index.js /dev/ttyS3 
echo COM3 is /dev/ttyS3 in WSL and needs sudo for permission
echo
echo http://localhost:8080/graph is particularly useful
echo use a browser like chromium-browser to browse to, say, http://localhost:8080/graph
node index.js /dev/ttyACM0
