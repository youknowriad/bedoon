var Bedoon = function(config) {

    // Loading Express
    var express = require("express"),
        mongoose = require('mongoose'),
        passport = require('passport'),
        schemaFactory = require('./schema-factory')(config.resources, mongoose),
        passwordHandler = require('./password-handler'),
        serializer = require('./serializer')(config.resources, passwordHandler);

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
    app.configure(function() {
        app.use(express.cookieParser());
        app.use(express.json());
        app.use(express.urlencoded());
        app.use(allowCrossDomain);
        app.use(express.session({ secret: 'bedoon' }));
        app.use(passport.initialize());
        app.use(passport.session());
        app.use(app.router);
    });

    // Adding resource controllers
    console.log('Configuring Resource APIs');
    var resourceControllersFactory = require('./resource-controllers-factory')(models, serializer);
    Object.keys(models).forEach(function(name) {
        resourceControllersFactory.addResourceControllers(app, name);
    });

    // Authentication configuration
    console.log('Configuring authentication');
    var userResourceName;
    Object.keys(config.resources).forEach(function(name) {
        if (config.resources[name].user) {
            userResourceName = name;
        }
    });
    if (userResourceName) {
        var LocalStrategy = require('passport-local').Strategy;
        passport.use(new LocalStrategy(
            function(username, password, done) {
                console.log(username, password);
                models[userResourceName].findOne({ username: username }, function (err, user) {
                    if (err) { return done(err); }
                    if (!user) {
                        return done(null, false, { message: 'Incorrect username.' });
                    }
                    if (passwordHandler.compare(user.password, password)) {
                        return done(null, false, { message: 'Incorrect password.' });
                    }
                    return done(null, user);
                });
            }
        ));

        passport.serializeUser(function(user, done) {
            done(null, user._id);
        });
        passport.deserializeUser(function(id, done) {
            models[userResourceName].findById(id, function(err, user) {
                done(err, user);
            });
        });

        app.post('/login', passport.authenticate('local', { successRedirect: '/',
                                                    failureRedirect: '/login' }));
        app.get('/', function(req, res){
            res.end(JSON.stringify(req.user));
        });
        app.get('/login', function(req, res){
            res.end('erreur');
        });
    }

    return {
        app: app
    }
}


module.exports = exports = Bedoon;
