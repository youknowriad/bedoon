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
            res.writeHead(200, { 'Content-Type': 'application/json'});

            models[name].find(function (err, data) {
                var serials = [];
                data.forEach(function (document) {
                    serials.push(serializer.serialize(name, document));
                });

                res.end(responseHandler.getResponse(serials));
            });
        },

        findOne: function (req, res) {
            var name = req.params.name;
            console.log('get ' + name + ' : ' + req.params.id);
            res.writeHead(200, { 'Content-Type': 'application/json'});
            models[name].findById(req.params.id, function (err, document) {
                var serial = serializer.serialize(name, document);
                res.end(responseHandler.getResponse(serial));
            });
        },

        create: function (req, res) {
            var name = req.params.name,
                document,
                serial;
            console.log('creating a ' + name);
            res.writeHead(200, { 'Content-Type': 'application/json'});

            document = new models[name]();
            serializer.hydrate(name, document, req.body);
            document.save();
            serial = serializer.serialize(name, document);

            res.end(responseHandler.getResponse(serial));
        },

        update: function (req, res) {
            var name = req.params.name;
            console.log('updating ' + name + ' : ' + req.params.id);
            res.writeHead(200, { 'Content-Type': 'application/json'});
            models[name].findById(req.params.id, function (err, document) {

                serializer.hydrate(name, document, req.body);
                document.save();
                var serial = serializer.serialize(name, document);

                res.end(responseHandler.getResponse(serial));
            });
        },

        remove: function (req, res) {
            var name = req.params.name;
            console.log('deleting ' + name + ' : ' + req.params.id);
            res.writeHead(200, { 'Content-Type': 'application/json'});
            models[name].findById(req.params.id, function (err, document) {
                document.remove();
                var serial = serializer.serialize(name, document);

                res.end(responseHandler.getResponse(serial));
            });
        }

    };
};
