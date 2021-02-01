This repository provides sample code for the OPS-24x radar sensors (any 241, 242 or 243) communicating with Node.js,
and ultimately a browser for rendering data.
(A rudimentary web server is provided in server.js.  If you wish to put this code in production, you might consider using Express for node.js )

You will need nodejs and npm.  
Using the ubuntu 18.04 LTS repositories may prove to be not recent enough.  
The [node.js download site](https://nodejs.org/en/download/) site has downloadable packages for many platforms.   
If you get warnings from npm after installing it , use ```npm install -g npm@latest``` to upgrade to the latest version

You will need the socket.io and serialPort packages.
They should be installed via the Node Package manager.
(If you find your platform doesn't have precpmpiled binaries for serialPort, then you may need to install a compiler.  The following may help: ```sudo apt-get update && apt-get install -y --no-install-recommends make g++``` 

The code using socket.io was developed with the version 2.x era API.  You can fetch that library via   
```npm install socket.io@2.4.1```  
The code using serialport was developed with the version 7.x era API but a fix has been checked in here to use the newer list() API.  
```npm install serialport```

The list() call is only used if a port isn't specified when you run the program.
If required, only one line needs to be changed to continue to use the older (prior to version 8.0) library.  
Change the code where index.js lists available ports  
```
    SerialPort.list(function (err, ports) {
    //library ver >=8: SerialPort.list().then(ports => {
```


The application is run by executing index.js ("node index.js")
While it will look for an available serial port, 
you should provide the port name as the 3rd parameter if it doesn't succeed.  For example

Linux (including Raspberry Pi):  node index.js /dev/ttyACM0

PC: node index.js COM3

Mac: node index.js /dev/tty.usbmoodem*

Note that you might wish to run as root on linux or System Administrator on Windows because serial port access is often limited to privileged users.


There are currently 4 pages:

[Speedometer](http://localhost:8080/interface)

[Control Dashboard](http://localhost:8080/control)

[Scrolling Line Graph](http://localhost:8080/graph)

[Multi-Object View](http://localhost:8080/graph2)
