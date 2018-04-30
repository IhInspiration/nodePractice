var http = require('http');
var mime = require('mime');
var path = require('path');
var fs = require('fs');
var urlUtil = require('url');
var qs = require('querystring');
var items = [];
var cache = {};
var toList = [];

function notFound(response) {
    response.writeHead(404, {'Content-Type': 'text/plain'});
    response.write('Error 404: 请求失败');
    response.end();
}

function sendFile(res, filePath, fileContents) {
    res.statusCode = 200;
    res.setHeader('Content-Type', mime.getType(path.basename(filePath)));
    res.setHeader('Content-Length', Buffer.byteLength(fileContents));
    res.end(fileContents);
}

function serveStatic(response, cache, absPath) {
    if(cache[absPath]) {
        sendFile(response, absPath, cache[absPath]);
    } else {
        fs.readFile(absPath, function(err, data) {
            if(err) {
                notFound(response);
            } else {
                cache[absPath] = data;
                sendFile(response, absPath, data);
            }
        });
    }
}

function add(req, res) {
    var body = '';
    req.setEncoding('utf8');
    req.on('data', function(chunk) {
        body += chunk;
    });
    req.on('end', function() {
        var obj = qs.parse(body),
            curItem = obj.itemContent;
        res.writeHead(200, {'Content-Type': 'application/json'});
        if(items.indexOf(curItem) > -1) {
            res.end(JSON.stringify({
                ret: false,
                msg: "该事项已经存在于列表当中"
            }));
        } else {
            items.push(curItem);
            res.end(JSON.stringify({
                ret: true,
                msg: "该事项已经添加于列表当中"
            }));
        }
    })
}

function del(req, res) {
    var body = '',
        method = req.method.toUpperCase();

    req.setEncoding('utf8');
    req.on('data', function(chunk) {
        body += chunk;
    });
    req.on('end', function() {
        var obj;
        if(method === 'POST') {
            obj = qs.parse(body);
        } else if (method === 'GET') {
            obj = urlUtil.parse(req.url, true).query;
        } else {
            res.end(JSON.stringify({
                ret: false,
                msg: "不支持该类型请求"
            }));
        }

        curItem = obj.itemContent,
            curItemIndex = items.indexOf(curItem);
        res.writeHead(200, {'Content-Type': 'application/json'});
        if(curItemIndex != -1) {
            items.splice(curItemIndex, 1);
            res.end(JSON.stringify({
                ret: true,
                msg: "删除成功"
            }));
        } else {
            res.end(JSON.stringify({
                ret: false,
                msg: "列表中没有此项"
            }));
        }
    })
}

function getList(res) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({
        ret: true,
        data: items
    }));
}


var server = http.createServer(function(req, res) {
    var urlPath = urlUtil.parse(req.url).pathname
    console.log(req.url);
    if(urlPath === '/') {
        serveStatic(res, cache, './public/index.html');
    } else if(urlPath === '/getList') {
        getList(res);
    } else if(urlPath === '/add') {
        add(req, res);
    } else if(urlPath === '/del') {
        del(req, res);
    } else {
        serveStatic(res, cache, './public' + req.url);
    }
});

server.listen(3000, function() {
    console.log("Server listening on port 3000.");
});