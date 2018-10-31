// functions that will be executed when 
// typeoff handle[pathname] === a function in requestHandlers.
// the handle and function are discribed in index.js

var fs = require('fs'),
server = require('./server');

function sendInterface(response) {
  console.log("Request handler 'interface' was called.");
  response.writeHead(200, {"Content-Type": "text/html"});
  var html = fs.readFileSync(__dirname + "/public/interface.html")
  response.end(html);
}

exports.sendInterface = sendInterface;

function sendGraph(response) {
  console.log("Request handler 'graph' was called.");
  response.writeHead(200, {"Content-Type": "text/html"});
  var html = fs.readFileSync(__dirname + "/public/graph.html")
  response.end(html);
}

exports.sendGraph = sendGraph;

function sendGraph2(response) {
  console.log("Request handler 'graph2' was called.");
  response.writeHead(200, {"Content-Type": "text/html"});
  var html = fs.readFileSync(__dirname + "/public/graph2.html")
  response.end(html);
}

exports.sendGraph2 = sendGraph2;

function sendControl(response) {
  console.log("Request handler 'control' was called.");
  response.writeHead(200, {"Content-Type": "text/html"});
  var html = fs.readFileSync(__dirname + "/public/control.html")
  response.end(html);
}

exports.sendControl = sendControl;
