module.exports = function (models, serializer, responseHandler) {

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
                serial;
            console.log('creating a ' + name);
            document = new models[name]();
            serializer.hydrate(name, document, req.body);
            document.save();
            serial = serializer.serialize(name, document);
            res.send(responseHandler.getResponse(serial));
        },

        update: function (req, res) {
            var name = req.params.name;
            console.log('updating ' + name + ' : ' + req.params.id);
            models[name].findById(req.params.id, function (err, document) {
                if (!document) {
                    return res.send(404, responseHandler.getErrorResponse(404, req.params.name + ' "' + req.params.id + '" not found'));
                }
                serializer.hydrate(name, document, req.body);
                document.save();
                var serial = serializer.serialize(name, document);
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
