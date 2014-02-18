var Bedoon = function (config) {

    var express = require("express"),
        mongoose = require('mongoose'),
        passport = require('passport'),
        schemaFactory = require('./schema-factory')(config.resources, mongoose),
        passwordHandler = require('./password-handler'),
        responseHandler = require('./utils/response-handler'),
        serializer = require('./serializer')(config.resources, passwordHandler),
        models = {},
        app = express(),
        userResourceName,
        prefix = config.prefix ? '/' + config.prefix : '';

    // Configuring the database
    console.log('Configuring database');
    mongoose.connect(config.db);

    // Loading models
    console.log('Loading resource models');
    Object.keys(config.resources).forEach(function (name) {
        var resource = config.resources[name];
        if (resource.type === 'document') {
            models[name] = mongoose.model(name, schemaFactory.getSchema(name));
        }
    });

    // Configuration of express app
    console.log('Configuring express app');
    app.configure(function () {
        app.use(express.cookieParser());
        app.use(express.json());
        app.use(express.urlencoded());
        app.use(express.session({ secret: 'bedoon' }));
        app.use(passport.initialize());
        app.use(passport.session());
        app.use(app.router);
    });


    // Authentication configuration
    console.log('Configuring authentication');
    Object.keys(config.resources).forEach(function (name) {
        if (config.resources[name].user) {
            userResourceName = name;
        }
    });
    if (userResourceName) {
        var LocalStrategy = require('passport-local').Strategy,
            sercurityControllers = require('./controller/security-controller')(serializer, userResourceName, responseHandler);
        passport.use(new LocalStrategy(
            function (username, password, done) {
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

        passport.serializeUser(function (user, done) {
            done(null, user._id);
        });
        passport.deserializeUser(function (id, done) {
            models[userResourceName].findById(id, function (err, user) {
                done(err, user);
            });
        });

        app.post(prefix + '/auth/login', passport.authenticate('local', { successRedirect: prefix + '/auth/loggedin',
                                                    failureRedirect: prefix + '/auth/failed' }));
        app.get(prefix + '/auth/loggedin', sercurityControllers.isAuthenticated, sercurityControllers.loggedinUser);
        app.get(prefix + '/auth/failed', sercurityControllers.authenticationFailed);
        app.get(prefix + '/auth/logout', sercurityControllers.logout);
    }


    // Adding resource controllers
    console.log('Configuring Resource APIs');
    var resourceController = require('./controller/resource-controller')(models, serializer, responseHandler);
    app.get(prefix + '/:name', resourceController.checkName, resourceController.findAll);
    app.get(prefix + '/:name/:id', resourceController.checkName, resourceController.findOne);
    app.post(prefix + '/:name', resourceController.checkName, resourceController.create);
    app.put(prefix + '/:name/:id', resourceController.checkName, resourceController.update);
    app.delete(prefix + '/:name/:id', resourceController.checkName, resourceController.remove);

    return {
        app: app
    };
};

module.exports = exports = Bedoon;
