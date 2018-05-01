var connect = require('connect');

function logger(req, res, next) {
    console.log('%s %s', req.method, req.url);
    next();
}

function hello(req, res, next) {
    if(req.url.match(/^\/hello/)) {
        res.end("Hello Word\n");
    } else {
        next();
    }
}

var db = {
    users: [
        {name: 'a'},
        {name: 'b'},
        {name: 'c'}
    ]
}

function users(req, res, next) {
    var match = req.url.match(/^\/user\/(.+)/);
    if(match) {
        var user = match[1];
        var isExists = db.users.some(function(v) {
            return v.name === user;
        })
        if(isExists) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(user));
        } else {
            var err = new Error('User not found');
            err.notFound = true;
            next(err);
        }
    } else {
        next();
    }
}

function pets(req, res, next) {
    if(req.url.match(/^\/pet\/(.+)/)) {
        foo();
    } else {
        next();
    }
}

function errorHandler(err, req, res, next) {
    console.error(err.stack);
    res.setHeader('Content-Type', 'application/json');
    if(err.notFound) {
        res.statusCode = 404;
        res.end(JSON.stringify({error: err.message}));
    } else {
        res.statusCode = 500;
        res.end(JSON.stringify({error: 'Internal Server Error'}));
    }
}

function errorPage(err, req, res, next) {
    console.error(err.stack);
    if(err) {
        res.end(JSON.stringify({error: "请求失败"}))
    }
}

var api = connect().use(users).use(pets).use(errorHandler);
var app = connect().use(hello).use('/api', api).use(errorPage).listen(3000);