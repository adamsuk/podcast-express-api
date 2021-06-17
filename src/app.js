var express = require("express");
var routes = require("./routes");

var app = express();
// parse request body as JSON
app.use(express.json())

// set routes
var router = express.Router()

router.use(function async (req, res, next) {
    console.log(`Incoming request method ${req.method} on path ${req.url}`);
    if (Object.keys(req.body).length !== 0) {
        console.log(req.body);
    };
    // attemp to get method from routes
    routes(req, res, next);
});

// mount the router on the app
app.use('/', router)

module.exports = app;
