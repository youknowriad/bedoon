var Bedoon = require('../lib/index');

var config = {
    db: 'mongodb://localhost/mydatabase',
    resources: {

        post: {
            type: 'document',
            schema: {
                attributes: {
                    title: String,
                    content: String
                }
            }
        }

    }
}

var bedoon = new Bedoon(config);
var port = 3700;
bedoon.run(port);
console.log('Server running on port %s', port);
