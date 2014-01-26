module.exports = function(models, serializer) {
    
    return {
        
        addResourceControllers: function(app, name) {
            
            // Find all resources
            app.get('/' + name , function(req, res){
                console.log('get all '+ name + 's');
                res.writeHead(200, { 'Content-Type': 'application/json'});
    
                models[name].find(function (err, data) {
                    var serials = [];
                    data.forEach(function(document) {
                        serials.push(serializer.serialize(name, document)) ;
                    });
    
                    res.end(JSON.stringify(serials));
                });
            });
    
            // Find one resource
            app.get('/' + name + '/:id', function(req, res) {
                console.log('get '+ name + ' : ' + req.params.id);
                res.writeHead(200, { 'Content-Type': 'application/json'});
                models[name].findById(req.params.id, function (err, document) {
                    var serial = serializer.serialize(name, document);
                    res.end(JSON.stringify(serial));
                });
            });
    
            // Create a resource
            app.post('/' + name, function(req, res) {
                console.log('creating a '+ name);
                res.writeHead(200, { 'Content-Type': 'application/json'});
    
                var document = new models[name]();
                serializer.hydrate(name, document, req.body);
                document.save();
                var serial = serializer.serialize(name, document);
    
                res.end(JSON.stringify(serial));
            });
    
            // Update a resource
            app.put('/' + name + '/:id', function(req, res) {
                console.log('updating '+ name + ' : ' + req.params.id);
                res.writeHead(200, { 'Content-Type': 'application/json'});
                models[name].findById(req.params.id, function (err, document) {
    
                    serializer.hydrate(name, document, req.body);
                    document.save();
                    var serial = serializer.serialize(name, document);
    
                    res.end(JSON.stringify(serial));
                });
            });
    
            // delete a resource
            app.delete('/' + name + '/:id', function(req, res) {
                console.log('deleting '+ name + ' : ' + req.params.id);
                res.writeHead(200, { 'Content-Type': 'application/json'});
                models[name].findById(req.params.id, function (err, document) {
                    document.remove();
                    var serial = serializer.serialize(name, document);
    
                    res.end(JSON.stringify(serial));
                });
            });
            
        }
        
    }
    
    
};
