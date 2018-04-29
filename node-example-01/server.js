var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var chatServer = require('./lib/chat_server.js');
var cache = {};

function send404(response) {
    response.writeHead(404, {'Content-Type': 'text/plain'});
    response.write('Error 404: resource not found');
    response.end();
}

function sendFile(response, filePath, fileContents) {
    response.writeHead(
        200,
        {"Content-Type": mime.getType(path.basename(filePath))}
    );
    response.end(fileContents);
}

function serveStatic(response, cache, absPath) {
    if(cache[absPath]) {
        sendFile(response, absPath, cache[absPath]);
    } else {
        fs.readFile(absPath, function(err, data) {
            console.log(process.cwd())
            if(err) {
                send404(response);
            } else {
                cache[absPath] = data;
                sendFile(response, absPath, data);
            }
        });
    }
}

var server = http.createServer(function(request, response) {
    var filePath = false;

    console.log(request.url);
    if(request.url === '/') {
        filePath = 'public/index.html';
    } else {
        filePath = 'public' + request.url;
    }

    var absPath = './' + filePath;
    serveStatic(response, cache, absPath);
});

server.listen(3000, function() {
    console.log("Server listening on port 3000.");
});

chatServer.listen(server);

