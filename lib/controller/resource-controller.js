module.exports = function(models, serializer) {

    return {

        checkName: function(req, res, next) {
            if (req.params.name && models[req.params.name]) {
                return next();
            }
            res.send(404, { error: 'Resource ' + req.params.name + ' not found' });
        },

        findAll: function(req, res) {
            var name = req.params.name;
            console.log('get all '+ name + 's');
            res.writeHead(200, { 'Content-Type': 'application/json'});

            models[name].find(function (err, data) {
                var serials = [];
                data.forEach(function(document) {
                    serials.push(serializer.serialize(name, document)) ;
                });

                res.end(JSON.stringify(serials));
            });
        },

        findOne: function (req, res) {
            var name = req.params.name;
            console.log('get '+ name + ' : ' + req.params.id);
            res.writeHead(200, { 'Content-Type': 'application/json'});
            models[name].findById(req.params.id, function (err, document) {
                var serial = serializer.serialize(name, document);
                res.end(JSON.stringify(serial));
            });
        },

        create: function (req, res) {
            var name = req.params.name;
            console.log('creating a '+ name);
            res.writeHead(200, { 'Content-Type': 'application/json'});

            var document = new models[name]();
            serializer.hydrate(name, document, req.body);
            document.save();
            var serial = serializer.serialize(name, document);

            res.end(JSON.stringify(serial));
        },

        update: function (req, res) {
            var name = req.params.name;
            console.log('updating '+ name + ' : ' + req.params.id);
            res.writeHead(200, { 'Content-Type': 'application/json'});
            models[name].findById(req.params.id, function (err, document) {

                serializer.hydrate(name, document, req.body);
                document.save();
                var serial = serializer.serialize(name, document);

                res.end(JSON.stringify(serial));
            });
        },

        remove: function (req, res) {
            var name = req.params.name;
            console.log('deleting '+ name + ' : ' + req.params.id);
            res.writeHead(200, { 'Content-Type': 'application/json'});
            models[name].findById(req.params.id, function (err, document) {
                document.remove();
                var serial = serializer.serialize(name, document);

                res.end(JSON.stringify(serial));
            });
        }

    };
};
