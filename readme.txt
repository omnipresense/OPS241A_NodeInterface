Sample code for the OPS-241A communicating with Node.js and a browser.
(A rudimentary web server is provided in server.js)

You will need to download the socket.io and serialPort
modules in the node_modules folder.  (If you download these with this repo, 
they may not match your machine's architecture.  Reinstall if necessary, e.g.
npm install serialport
)


The application is run by executing index.js ("node index.js")
While it will look for an available serial port, 
you may provide a port name as the 3rd parameter if desired, for example
Linux:  node index.js /dev/ttyACM0
PC: node index.js COM3


There are currently 3 pages
localhost:1337/interface
localhost:1337/graph
localhost:1337/tester
