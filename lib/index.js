var Bedoon = function (config) {

    var express = require("express"),
        mongoose = require('mongoose'),
        passport = require('passport'),
        schemaFactory = require('./schema/schema-factory')(config.resources, mongoose),
        passwordHandler = require('./security/password-handler'),
        responseHandler = require('./http/response-handler'),
        serializer = require('./serializer/serializer')(config.resources, passwordHandler),
        validator = require('./validator/validator')(config.resources),
        models = {},
        app = express(),
        userResourceName,
        prefix = config.prefix ? '/' + config.prefix : '',
        histo = config.histo ? config.histo : false,
        LocalStrategy = require('passport-local').Strategy,
        sercurityControllers;

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
    
    // History Middelware
    var historyMiddleware = function (req, res, next) {
        if (histo) {
            var document = new models[histo]();
            document.resource = req.params.name;
            document.primary_key = req.params.id ? req.params.id : null;
            document.content = JSON.stringify(req.body);
            document.action = req.method;
            document.date = new Date();
            if (req.user) {
                document.username = req.user.username;
            }

            document.save();
        }

        next();
    };

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

    return {

        app: app,
        models: models,
        run: function (portHttp) {
            var server = require('http').createServer(app),
                io = require('socket.io').listen(server, { log: false });

            server.listen(portHttp);

            // Authentication configuration
            console.log('Configuring authentication');
            Object.keys(config.resources).forEach(function (name) {
                if (config.resources[name].user) {
                    userResourceName = name;
                }
            });
            if (userResourceName) {
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
            var authenticationMiddleware = userResourceName ? sercurityControllers.isAuthenticated : function (req, res, next) { next(); },
                resourceController = require('./controller/resource-controller')(io, models, serializer, responseHandler, validator);
            app.get(prefix + '/:name', authenticationMiddleware, resourceController.checkName, resourceController.findAll);
            app.get(prefix + '/:name/:id', authenticationMiddleware, resourceController.checkName, resourceController.findOne);
            app.post(prefix + '/:name', authenticationMiddleware, historyMiddleware, resourceController.checkName, resourceController.create);
            app.put(prefix + '/:name/:id', authenticationMiddleware, historyMiddleware, resourceController.checkName, resourceController.update);
            app.delete(prefix + '/:name/:id', authenticationMiddleware, historyMiddleware, resourceController.checkName, resourceController.remove);
        }

    };
};

module.exports = exports = Bedoon;
