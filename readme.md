Sample code for the OPS-24x (any 241 or 242) communicating with Node.js and a browser.
(A rudimentary web server is provided in server.js)

You will need the socket.io and serialPort packages.
They can be installed via Node Package manager.  
```npm install socket.io serialport```


The application is run by executing index.js ("node index.js")
While it will look for an available serial port, 
you may provide a port name as the 3rd parameter if desired, for example
Linux:  node index.js /dev/ttyACM0
PC: node index.js COM3

Note that you might wish to run as root on linux or System Administrator on Windows because serial port access is often limited to privileged users.


There are currently 4 pages:

[Speedometer](http://localhost:8080/interface)

[Control Dashboard](http://localhost:8080/control)

[Scrolling Line Graph](http://localhost:8080/graph)

[Multi-Object View](http://localhost:8080/graph2)
