var Bedoon = function(config) {

    // Loading Express
    var express = require("express");
    var app = express();

    // Configuring express
    var allowCrossDomain = function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

        // intercept OPTIONS method
        if ('OPTIONS' == req.method) {
            res.send(200);
        }
        else {
            next();
        }
    };
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(allowCrossDomain);

    // Configuring the database
    var mongoose = require('mongoose');
    mongoose.connect(config.db);

    // Loading Resources
    var models = require("./loader/models")(config, mongoose),
        serializer = require("./loader/serializer")(config);
    require("./loader/controllers")(app, models, serializer);

    return {
        app: app
    }
}


module.exports = exports = Bedoon;