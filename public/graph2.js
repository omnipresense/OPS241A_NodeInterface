var speedsToTrack=3;  // BUT we'll receive 2x numbers because Magnitude
var dataSet = new Array(speedsToTrack);
var unscaledDataSet = new Array(speedsToTrack);
var magSet = new Array(speedsToTrack);
//var unscaledMagSet = new Array(speedsToTrack);
//maybe var speedsArr_index=0;
for (var initingLoop=0; initingLoop<speedsToTrack; initingLoop++ ) {
  dataSet[initingLoop] = new Array();
  unscaledDataSet[initingLoop] = new Array();
  magSet[initingLoop] = new Array();
//  unscaledMagSet[initingLoop] = new Array();
}

function initSocketIO() {
  iosocket = io.connect();
  iosocket.on('onconnection', function(value) {
    sensorValue = value; // receive start  value from server
    initVelocity();

    // receive new values from server
    iosocket.on('updateData', function(receivedData) {
      //console.log("in updateData. received:"+receivedData);
      if (receivedData.charAt(0) != "{") {  // throw away any JSON
        var numbers = receivedData.split(',');
        handleData(numbers);
      }
    });
  });
}
function initVelocity() {
  $("#velocity").html("tbd");
  iosocket.emit('OutputFeature', 'j'); // cannot be JSON mode
  iosocket.emit('OutputFeature', 'r'); // cannot be raw mode
  iosocket.emit('OutputFeature', 'M'); // want Magnitude (which comes first)
  iosocket.emit('OutputFeature', (speedsToTrack).toString());  // x pairs, eg 2x
  console.log("setting speedsToTrack to:"+speedsToTrack.toString());
}
window.onload = function() {
  initSocketIO();
};


$(document).ready(function() {
  // Run this once after the DOM is loaded
  // if (!!window.EventSource) {
  //  // Good example on using SSE
  //  // http://www.html5rocks.com/en/tutorials/eventsource/basics/

  //  var source = new EventSource('data');
  //  source.addEventListener('message', function(e) {
  //    // e.data is the SSE data
  //    //console.log(">>", e);
  //    // e.lastEventId

  //    // We're passing the full 0-4095 value up to here, but we really
  //    // only want 0-255 in the graph
 //            handleData(parseInt(e.data) / 16);

  //  }, false);
  // }
  // else {
  //  console.log('sse not supported');
  // }
});



var scaleRangeMax = 2.0;
var scaleRangeMin = 0.0;
var X_SCALE=5;
function handleData(data_arr) {
  // data_arr is an ARRAY of number values
  data = data_arr[0];


  var canvas = document.getElementById("canvas1");
  var ctx = canvas.getContext("2d");
  var canvasMag = document.getElementById("canvas2");
  var ctxMag = canvasMag.getContext("2d");
  var height = canvasMag.height-1;

  var canvasHeat = document.getElementById("heatmap");
  var ctxHeat = canvasHeat.getContext("2d");

  var rescaleFeatureOn=true;

  var i=0,j=0; // indexer var, hoisted here

  // Add to the data set, (always looking for the highest)
  var highest=0;
  var lowest=0;
  var numbersIn = [];
  var dataToShow = [];
  var highestMag=255;
  var lowest=0;
  var magnitudesIn = [];
  var magToShow = [];
  for (i=0; i < speedsToTrack; i++) {
    magnitudesIn[i] = Number(data_arr[(i*2)]);
    numbersIn[i] = Number(data_arr[(i*2)+1]);
    if (! isNaN(magnitudesIn[i])) {
      magToShow[i] = magnitudesIn[i]; // post NaN check
    }
    if (! isNaN(numbersIn[i])) {
      dataToShow[i] = numbersIn[i]; // post NaN check
      unscaledDataSet[i].push(numbersIn[i]);
      if (highest < numbersIn[i]) {
        highest = numbersIn[i];
      }
      if (lowest > numbersIn[i]) {
        lowest = numbersIn[i];
      }
    } else {
      unscaledDataSet[i].push(0);
    }
/* not tonight
    if (! isNaN(magnitudesIn[i])) {
      unscaledDataSet[i].push(magnitudesIn[i]);
      if (highestMag < magnitudesIn[i]) {
        highestMag = magnitudesIn[i];
      }
      if (lowest > magnitudesIn[i]) {
        lowestMag = magnitudesIn[i];
      }
    } else {
      unscaledMagSet[i].push(0);
    }
*/    
  }

  $("#current").html( dataToShow.join(","));
  $("#magnitudes").html( magToShow.join(","));
  ctxHeat.fillStyle = "#000000";
  ctxHeat.fillRect(0, 0, canvasHeat.width, canvasHeat.height);
  for (i=0; i< dataToShow.length; i++) {
      switch (i) {
        case 0: ctxHeat.fillStyle = "#ffff33"; break;
        case 1: ctxHeat.fillStyle = "#33ff33"; break;
        case 2: ctxHeat.fillStyle = "#3333ff"; break;
        case 3: ctxHeat.fillStyle = "#999933"; break;
        case 4: ctxHeat.fillStyle = "#339999"; break;
        case 5: ctxHeat.fillStyle = "#993399"; break;
      }
      var padding = X_SCALE;
      var heat_x = padding + Math.abs(dataToShow[i]) * 50 ;  // 0 to 2 mps
      if (heat_x > canvasHeat.width-padding)
        heat_x = canvasHeat.width-padding;
      var heat_y = canvasHeat.height- (padding +  magToShow[i] / 10); // 1000 -> 100
      if (heat_y > canvasHeat.height-padding)
        heat_y = canvasHeat.height-padding;
      ctxHeat.fillRect(heat_x, heat_y, 7,7);    
  }
  // checkpoint: numbersIn is the numeric representation of data_arr 
  // unscaledDataSet set has all the real data, as numbers, now
  // or it has 0's in their place.


  var reRender=false;
  // if > or <  than our range, reset  max or min and re-render
  if (highest > scaleRangeMax || lowest < scaleRangeMin) {
    if (rescaleFeatureOn)  {
      if (highest > scaleRangeMax)
        scaleRangeMax = highest;
      if (lowest < scaleRangeMin)
        scaleRangeMin = lowest;
      reRender=true;
      for (i=0; i < speedsToTrack; i++) {
        dataSet[i] = [];
        for (j = 0; j < unscaledDataSet[i].length; j++) {
          dataSet[i].push( Math.floor(height * (unscaledDataSet[i][j]-scaleRangeMin) / (scaleRangeMax-scaleRangeMin)) );
        }
      }
    } 
  } else {
    for (i=0; i < speedsToTrack; i++) {
    // clip
    if (numbersIn[i] > scaleRangeMax)
      dataSet[i].push(height);
    else if (numbersIn[i] < scaleRangeMin)
      dataSet[i].push(0);
    else // normal
      dataSet[i].push( Math.floor(height * (numbersIn[i]-scaleRangeMin) / (scaleRangeMax-scaleRangeMin)) );
  }

  // for tonight, punt on rescaling magnitude
  for (i=0; i < speedsToTrack; i++) {
    magSet[i].push(magnitudesIn[i]);
  }

  $("#maximum").html( scaleRangeMax );
  $("#minimum").html( scaleRangeMin );

  // what is this for?
  // for (i=0; i < speedsToTrack; i++) {
  //    dataSet[i].push(Math.floor(Math.abs(height* (data_arr[i] / scaleRangeMax-0)))) ;
  //  } else {
  //    dataSet[i].push(Math.floor(Math.abs(height)));
  //  }

  // remove from the left/oldest if it gets wider than the canvas
  if (dataSet[0].length > ((canvas.width/X_SCALE) - 1)) {
    for (i=0; i < speedsToTrack; i++) {
      unscaledDataSet[i].shift();
      dataSet[i].shift();
    }
  }
  if (magSet[0].length > ((canvas.width/X_SCALE) - 1)) {
    for (i=0; i < speedsToTrack; i++) {
//      unscaledMagSet[i].shift();
      magSet[i].shift();
    }
  }

  // Erase
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctxMag.fillStyle = "#000000";
  ctxMag.fillRect(0, 0, canvas.width, canvas.height);

  // Draw samples
  for (i=0; i < speedsToTrack; i++) {

    for(j = 0; j < dataSet[i].length; j++) {
      // The canvas coordinate space increases going down the page, but the graph
      // makes more sense flipped the other way so subtract the value from the
      // maximum value

      // quick, draw the origin (y=0) line at ...
      ctx.fillStyle = "#ffffff  ";
      var zeroYpos = (scaleRangeMax / (scaleRangeMax-scaleRangeMin))*255;
      ctx.fillRect(j*X_SCALE, zeroYpos, X_SCALE, 1);

      var yy = 255 - dataSet[i][j];

      switch (i) {
        case 0: ctx.fillStyle = "#ffff33"; break;
        case 1: ctx.fillStyle = "#33ff33"; break;
        case 2: ctx.fillStyle = "#3333ff"; break;
        case 3: ctx.fillStyle = "#999933"; break;
        case 4: ctx.fillStyle = "#339999"; break;
        case 5: ctx.fillStyle = "#993399"; break;
      }

      ctx.fillRect(j*X_SCALE, yy, X_SCALE/(i+1), X_SCALE/(i+1));
    }
    for(j = 0; j < magSet[i].length; j++) {
      // The canvas coordinate space increases going down the page, but the graph
      // makes more sense flipped the other way so subtract the value from the
      // maximum value

      // quick, draw the origin (y=0) line at ...
      ctxMag.fillStyle = "#000000";

      var yy = 255 - (magSet[i][j]/4);  // magnitudes top out around 1000/  div by 4 to fit in 255

      switch (i) {
        case 0: ctxMag.fillStyle = "#ffff33"; break;
        case 1: ctxMag.fillStyle = "#11aa11"; break;
        case 2: ctxMag.fillStyle = "#3333ff"; break;
        case 3: ctxMag.fillStyle = "#999933"; break;
        case 4: ctxMag.fillStyle = "#339999"; break;
        case 5: ctxMag.fillStyle = "#993399"; break;
      }

      ctxMag.fillRect(j*X_SCALE, yy, X_SCALE/(i+1), 255-yy);
    }
  }

// running average stuff.
  // var running_maxlength=5;
  // var running_sum=0.0;
  // var running_count=0;
  // var average=0;
  // i = unscaledDataSet[0].length-running_maxlength;
  // if (i < 0)
  //   i=0;
  // while (i < unscaledDataSet[0].length) {
  //   running_count ++;
  //   running_sum += (1*unscaledDataSet[0][i]);
  //   i++;
  // }
  // average = running_sum/running_count;
  // if (average.toPrecision)  // won't pass if ver < JS1.5
  //  $("#running").html( ""+average.toPrecision(2));

}
}
