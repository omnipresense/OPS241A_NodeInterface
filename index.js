var server = require("./server");
var router = require("./route");
var requestHandlers = require("./requestHandlers");
var debug = false;

var portParam="";
if (process.argv.length >= 3) {
	// ok to just launch. no need to find the port
	portParam = process.argv[2];
	launch(portParam,debug);
} else {
	var SerialPort = require('serialport');
	//was: SerialPort.list(function (err, ports) {
	SerialPort.list().then(ports => {
	  if (ports.length == 1) {
	    console.log("Usage: " + __filename + " PORT\nProceeding with only active port "+ports[0].comName+"\n");
	  	launch(ports[0].comName,debug);
	  } else {
	  	if (ports.length == 0) {
		    console.log("No USB ports active.  Please plug in a device, and try again.\nUsage: " + __filename + " PORT");
		} else {
		    console.log("Usage: " + __filename + " PORT\nActive ports:");
		    ports.forEach(function(port) {
			  console.log(port.comName);
			});
		}
		process.exit(-1);
	  }});	
}
 

function launch(port, debug) {
	var handle = {}
	handle["/"] = requestHandlers.sendInterface;
	handle["/interface"] = requestHandlers.sendInterface;
	handle["/graph"] = requestHandlers.sendGraph;
	handle["/graph2"] = requestHandlers.sendGraph2;
	handle["/control"] = requestHandlers.sendControl;

	server.start(router.route,handle,port, debug);
}
