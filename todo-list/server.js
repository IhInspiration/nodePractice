var http = require('http');
var mime = require('mime');
var path = require('path');
var fs = require('fs');
var urlUtil = require('url');
var qs = require('querystring');
var mysql = require('mysql');
var items = [];
var cache = {};
var toList = [];


var db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'jackwang'
});

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
        db.query(
            "INSERT INTO work (title) " + 
            "VALUES (?)",
            [curItem],
            function(err) {
                if(err) throw err;
                res.end(JSON.stringify({
                    ret: true,
                    msg: "该事项已经添加于列表当中"
                }));
            }
        );
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

        var curItemId = obj.itemId;

        res.writeHead(200, {'Content-Type': 'application/json'});
        db.query(
            "DELETE FROM work WHERE id=?",
            [curItemId],
            function(err) {
                if(err) throw err;
                res.end(JSON.stringify({
                    ret: true,
                    msg: "删除成功"
                }));
            }
        )
    })
}

function update(req, res) {
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

        var curItemId = obj.itemId,
            curItemContent = obj.itemContent;

        res.writeHead(200, {'Content-Type': 'application/json'});
        db.query(
            "UPDATE work SET title=? WHERE id=?",
            [curItemContent, curItemId],
            function(err) {
                if(err) throw err;
                res.end(JSON.stringify({
                    ret: true,
                    msg: "修改成功"
                }));
            }
        )
    })
}

function getList(res) {
    db.query(
        "SELECT * FROM work ",
        function(err, rows) {
            if(err) throw err;
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({
                ret: true,
                data: rows
            }));
        }
    )
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
    } else if(urlPath === '/update') {
        update(req, res);
    } else {
        serveStatic(res, cache, './public' + req.url);
    }
});

db.query(
    "CREATE TABLE IF NOT EXISTS work (" +
    "id INT(10) NOT NULL AUTO_INCREMENT," + 
    "title LONGTEXT," + 
    "PRIMARY KEY(id))",
    function(err) {
        if(err) throw err;
        console.log('server started...');
        server.listen(3000, function() {
            console.log("Server listening on port 3000.");
        });
    }
)