// this is called by server.js and and it uses the handle table from index.js (which started the server in server.js) 

function route(handle, pathname,response,request,debug) {
  console.log("About to route a request for " + pathname);
   //typeof probes the data type of handle[pathname]. So if 
   //handle[pathname] is a function (in both type and value)
   //,then run that function. 
  if (typeof handle[pathname] === 'function') {
    return handle[pathname](response,request);
  } else {
    if(debug == true){
      console.log("No request handler found for " + pathname);
    }
    response.writeHead(404, {"Content-Type": "text/plain"});
    response.write("404 Not found");
    response.end();
  }
}

exports.route = route;