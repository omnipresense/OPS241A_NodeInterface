Sample code for the OPS-24x (any 241 or 242) communicating with Node.js and a browser.
(A rudimentary web server is provided in server.js)

You will need the socket.io and serialPort packages.
An image of these are checked in with this repo, but they may not match your machine's architecture or node version.
(running "file node_modules/serialport/build/Release/serialport.node" indicates that I checked in a Windows binary)
Reinstall those if necessary, e.g.
npm remove socket.io serialport; npm install socket.io serialport
)


The application is run by executing index.js ("node index.js")
While it will look for an available serial port, 
you may provide a port name as the 3rd parameter if desired, for example
Linux:  node index.js /dev/ttyACM0
PC: node index.js COM3

Note that you might wish to run as root on linux or System Administrator on Windows because serial port access is often limited to privileged users.


There are currently 4 pages
localhost:1337/interface
localhost:1337/graph
localhost:1337/graph2
localhost:1337/tester
