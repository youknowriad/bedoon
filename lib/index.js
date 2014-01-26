var Bedoon = function(config) {

    // Loading Express
    var express = require("express"),
        mongoose = require('mongoose'),
        schemaFactory = require('./schema-factory')(config.resources, mongoose),
        serializer = require('./serializer')(config.resources);

    // Configuring the database
    console.log('Configuring database');
    mongoose.connect(config.db);

    // Loading models
    console.log('Loading resource models');
    var models = {};
    Object.keys(config.resources).forEach(function(name) {
        var resource = config.resources[name];
        if (resource.type === 'document') {
            models[name] = mongoose.model(name,
                schemaFactory.getSchema(name)
            );
        }
    });

    // Configuration of express app
    console.log('Configuring express app');
    var app = express();
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

    // Adding resource controllers
    console.log('Configuring Resource APIs');
    var resourceControllersFactory = require('./resource-controllers-factory')(models, serializer);
    Object.keys(models).forEach(function(name) {
        resourceControllersFactory.addResourceControllers(app, name);
    });

    return {
        app: app
    }
}


module.exports = exports = Bedoon;