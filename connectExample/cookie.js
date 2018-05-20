var connect = require('connect');
var Cookies = require('cookies');
var keysgrip = require('keygrip');
var bodyParser = require('body-parser');
var formidable = require("formidable");

function cookieParser() {
    var keys = new keysgrip(["test2"]);

    return function(req, res, next) {
        var cookies = new Cookies(req, res, {keys: keys});

        if(req.url == '/set') {
            cookies.set("bar", "baz", {signed: true})
            .set("jack", "wang");
        }
        console.log(req.headers);
        console.log(cookies.get("bar", {signed: true}));
        
        next();
    }
}

var app = connect()
    .use(bodyParser.raw())
    // .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: false }))
    // .use(cookieParser())
    .use(function(req, res, next) {

        // var form = new formidable.IncomingForm();
        // form.parse(req, function(err, fileds, files) {
        //     console.log(files);
        // })

        console.log(req.body);
        console.log(req.files);
        // console.log(req.signedCookies);
        next();
        
    }).use(function(err, req, res, next){console.log(err);res.end('hello\n');}).listen(3000);

