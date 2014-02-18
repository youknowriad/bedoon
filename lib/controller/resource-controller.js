module.exports = function (models, serializer, responseHandler, validator) {

    return {

        checkName: function (req, res, next) {
            if (req.params.name && models[req.params.name]) {
                return next();
            }
            res.send(404, responseHandler.getErrorResponse(404, 'Resource ' + req.params.name + ' not found'));
        },

        findAll: function (req, res) {
            var name = req.params.name;
            console.log('get all ' + name + 's');
            models[name].find(function (err, data) {
                var serials = [];
                data.forEach(function (document) {
                    serials.push(serializer.serialize(name, document));
                });
                res.send(responseHandler.getResponse(serials));
            });
        },

        findOne: function (req, res) {
            var name = req.params.name;
            console.log('get ' + name + ' : ' + req.params.id);
            models[name].findById(req.params.id, function (err, document) {
                if (!document) {
                    return res.send(404, responseHandler.getErrorResponse(404, req.params.name + ' "' + req.params.id + '" not found'));
                }
                var serial = serializer.serialize(name, document);
                res.send(responseHandler.getResponse(serial));
            });
        },

        create: function (req, res) {
            var name = req.params.name,
                document,
                serial,
                validation;
            console.log('creating a ' + name);
            document = new models[name]();
            validation = validator.validate(name, req.body);
            if (!validation.valid) {
                return req.send(400, responseHandler.getErrorResponse(400, validation.messages.join(', ')));
            }
            serializer.hydrate(name, document, req.body);
            document.save();
            serial = serializer.serialize(name, document);
            res.send(responseHandler.getResponse(serial));
        },

        update: function (req, res) {
            var name = req.params.name,
                validation,
                serial;
            console.log('updating ' + name + ' : ' + req.params.id);
            models[name].findById(req.params.id, function (err, document) {
                if (!document) {
                    return res.send(404, responseHandler.getErrorResponse(404, req.params.name + ' "' + req.params.id + '" not found'));
                }
                validation = validator.validate(name, req.body);
                if (!validation.valid) {
                    return req.send(400, responseHandler.getErrorResponse(400, validation.messages.join(', ')));
                }
                serializer.hydrate(name, document, req.body);
                document.save();
                serial = serializer.serialize(name, document);
                res.send(responseHandler.getResponse(serial));
            });
        },

        remove: function (req, res) {
            var name = req.params.name;
            console.log('deleting ' + name + ' : ' + req.params.id);
            models[name].findById(req.params.id, function (err, document) {
                if (!document) {
                    return res.send(404, responseHandler.getErrorResponse(404, req.params.name + ' "' + req.params.id + '" not found'));
                }
                document.remove();
                var serial = serializer.serialize(name, document);
                res.send(responseHandler.getResponse(serial));
            });
        }

    };
};
