
// Data samples are stored here
var dataSet = [];
var unscaledDataSet = [];

function initSocketIO() {
  iosocket = io.connect();
  iosocket.on('onconnection', function(value) {
    sensorValue = value; // receive start  value from server
    initVelocity();
    iosocket.emit('OutputFeature', 'r'); // cannot be raw mode
    iosocket.emit('OutputFeature', 'm'); // cannot have magnitude
    iosocket.emit('OutputFeature', "1"); // one result (top) only
    iosocket.emit('Units', "C");
    iosocket.emit('Format', "0");

    // receive changed values from server
    iosocket.on('updateData', function(receivedData) {
      $("#velocity").html( ""+receivedData);
      handleData(receivedData);
      //animation code tbd
    });
  });
}
function initVelocity() {
  $("#velocity").html("tbd");
  // anything for the graphical version (bar, needle)
}
window.onload = function() {
  initSocketIO();
};


$(document).ready(function() {
	// Run this once after the DOM is loaded
	// if (!!window.EventSource) {
	// 	// Good example on using SSE
	// 	// http://www.html5rocks.com/en/tutorials/eventsource/basics/

	// 	var source = new EventSource('data');
	// 	source.addEventListener('message', function(e) {
	// 		// e.data is the SSE data
	// 		//console.log(">>", e);
	// 		// e.lastEventId

	// 		// We're passing the full 0-4095 value up to here, but we really
	// 		// only want 0-255 in the graph
	// 		handleData(parseInt(e.data) / 16);
	// 	}, false);
	// }
	// else {
	// 	console.log('sse not supported');
	// }
});


var scaleRangeMax = 255;
var X_SCALE=4;
function handleData(data) {
	// data is a number value (currently 0 - 255)

	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	var height = canvas.height-1;
	//console.log(data);

	// Add to the data set, 
	unscaledDataSet.push(data);

	var reset=false;
	// if > than our range, reset  max 
	if (data > scaleRangeMax) {
		if (reset)  {
			scaleRangeMax = data;
			dataSet = [];
			for (var ii = 0; ii < unscaledDataSet.length; ii++) {
				dataSet.push( Math.floor(Math.abs(height * unscaledDataSet[ii] / (scaleRangeMax))) );
			} 
		} else {
			// clip
			data = scaleRangeMax;
		}
	}

	// remove from the left if it gets wider than the canvas
	dataSet.push(Math.floor(Math.abs(height* (data / scaleRangeMax)))) ;

	if (dataSet.length > ((canvas.width/X_SCALE) - 1)) {
		unscaledDataSet.shift();
		dataSet.shift();
	}

	// Erase
	ctx.fillStyle = "#cccccc";
	ctx.fillRect(0, 0, canvas.width, canvas.height);	

	// Draw samples
	ctx.fillStyle = "#333333";

	for (var ii = 0; ii < dataSet.length; ii++) {
		// The canvas coordinate space increases going down the page, but the graph
		// makes more sense flipped the other way so subtract the value from the 
		// maximum value
		var yy = 255 - dataSet[ii];

		ctx.fillRect(ii*X_SCALE, yy, X_SCALE, X_SCALE);
	}
}
