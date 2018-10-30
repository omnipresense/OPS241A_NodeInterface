var fs = require('fs'),
	http = require('http'),
	socketio = require('socket.io'),
	url = require("url"),
	SerialPort = require("serialport"),
	path = require('path');

var socketServer;
var serialPort;
var sendData = "";

function startServer(route, handle, port, debug) {
	// on request event
	function onRequest(request, response) {
		// parse the requested url into pathname. pathname will be compared
		// in route.js to handle (var content), if it matches the a page will 
		// come up. Otherwise a 404 will be given. 
		var pathname = url.parse(request.url).pathname;
		console.log("Request for " + pathname + " received");

		// rudimentary security.
		if (pathname.indexOf('..')>0) {
			response.writeHead(400);
			response.end('Sorry, error in pathname ..\n');
			response.end(); 
		}

		// if there's a dot, then assume it's a file.  find it & serve it
		if (pathname.indexOf('.')>0) {
		    var extname = path.extname(pathname);
		    var contentType = 'text/html';
		    switch (extname) {
		        case '.js':
		            contentType = 'text/javascript';
		            break;
		        case '.css':
		            contentType = 'text/css';
		            break;
		        case '.map':
		            contentType = 'text/map';
		            break;
		        case '.json':
		            contentType = 'application/json';
		            break;
		        case '.png':
		            contentType = 'image/png';
		            break;      
		        case '.jpg':
		            contentType = 'image/jpg';
		            break;
		        case '.svg':
		            contentType = 'image/svg';
		            break;
		        case '.ttf':
		            contentType = 'application/x-font-ttf';
		            break;
		        case '.woff':
		            contentType = 'application/x-font-woff';
		            break;
		        case '.woff2':
		            contentType = 'application/x-font-woff2';
		            break;
		        case '.eot':
		            contentType = 'application/x-font-eot';
		            break;
		        case '.wav':
		            contentType = 'audio/wav';
		            break;
		    }

		    fs.readFile("public/"+pathname, function(error, content) {
		        if (error) {
		            if(error.code == 'ENOENT'){
		                fs.readFile('./404.html', function(error, content) {
		                    response.writeHead(200, { 'Content-Type': contentType });
		                    response.end(content, 'utf-8');
		                });
		            }
		            else {
		                response.writeHead(500);
		                response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
		                response.end(); 
		            }
		        }
		        else {
		            response.writeHead(200, { 'Content-Type': contentType });
		            response.end(content, 'utf-8');
		        }
		    });
		} else {
			// So, run code.  (BTW,  index.js/route.js limits the routes) 
			var content = route(handle, pathname, response, request, debug);
		}
	}

	var httpServer = http.createServer(onRequest).listen(8080, function() {
		console.log("Listening at: http://localhost:8080");
		console.log("Server is up");
	});

	serialListener(port,debug);
	initSocketIO(httpServer, debug);
}

function initSocketIO(httpServer, debug) {
	socketServer = socketio.listen(httpServer);
	// if (debug == false) {
	// 	socketServer.set('log level', 1); // socket IO debug off
	// }
	socketServer.on('connection', function(socket) {
		console.log("user connected");
		socket.emit('onconnection', {
			value: sendData
		});
		socketServer.on('update', function(data) {
			socket.emit('updateData', {
				value: data
			});
		});
		socket.on('Debug', function(data) {
			console.log("Debug command!");
		 	serialPort.write("D"+data);
		});
		socket.on('Query', function(data) {
			console.log("Query command!");
		 	serialPort.write("?"+data);
		});
		socket.on('PowerMode', function(data) {
		 	serialPort.write("P"+data);
		});
		socket.on('IdleWait', function(data) {
		 	serialPort.write("Z"+data);
		});
		socket.on('Units', function(data) {
		 	serialPort.write("U"+data);
		});
		socket.on('Format', function(data) {
		 	serialPort.write("F"+data);
		});
		socket.on('SampleRate', function(data) {
		 	serialPort.write("S"+data);
		});
		socket.on('Squelch', function(data) {
		 	serialPort.write("Q"+data);
		});
		socket.on('Clock', function(data) {
		 	serialPort.write("C"+data);
		});
		socket.on('OutputFeature', function(data) {
		 	serialPort.write("O"+data);
		});
		socket.on('DebugMode', function(data) {
		 	serialPort.write("D"+data);
		});
		socket.on('LEDTest', function(data) {
		 	serialPort.write("^"+data);
		});
	});
}

// Listen to serial port
function serialListener(port, debug) {
	Readline = SerialPort.parsers.Readline
	serialPort = new SerialPort(port, {
		baudRate: 9600,
		dataBits: 8,
		parity: 'none',
		stopBits: 1,
		flowControl: false,
	})
	parser = new Readline(({ delimiter: '\r\n' }))
	serialPort.pipe(parser)

	parser.on("open", function() {
		console.log('open serial communication');
	});

	// Listens to incoming data
	parser.on('data', function(data) {
		console.log("Received data:" + data);
		// send the incoming data to browser with websockets.
		// to quash JSON: if (data[0] != '{') {}
		sendData = data;
		socketServer.emit('updateData', sendData);
		// }
	});
}

exports.start = startServer;
