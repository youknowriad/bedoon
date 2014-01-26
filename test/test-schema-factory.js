var resources = {
        user: {
            type: "document",
            schema: {
                attributes: {
                    username: String,
                    password: String
                }
            }
        },

        group: {
            type: "document",
            schema: {
                attributes: {
                    name: String
                },
                hasMany: {
                    users:  { type: 'id', target: 'user' },
                    users2: { type: 'embed', target: 'user' }
                }
            }
        },

        friend: {
            type: "document",
            schema: {
                attributes: {
                    name: String
                },
                hasOne: {
                    user:  { type: 'id', target: 'user' },
                    user2: { type: 'embed', target: 'user' }
                }
            }
        }
    },
    mongoose = require('mongoose'),
    schemaFactory = require('../lib/schema-factory')(resources, mongoose);

exports['simple model'] = function(test) {
    test.expect(1);

    test.deepEqual(schemaFactory.getSchemaAttributes('user'), {
        username: String,
        password: String
    });

    test.done();
};

exports['has many model'] = function(test) {
    test.expect(1);

    test.deepEqual(schemaFactory.getSchemaAttributes('group'), {
        name: String,
        users: [{type: mongoose.Schema.Types.ObjectId, ref: 'user'}],
        users2: [new mongoose.Schema({
            username: String,
            password: String
        })]
    });

    test.done();
};

exports['has one model'] = function(test) {
    test.expect(1);

    test.deepEqual(schemaFactory.getSchemaAttributes('friend'), {
        name: String,
        user: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
        user2: {
            username: String,
            password: String
        }
    });

    test.done();
};

exports['user model'] = function(test) {
    test.expect(1);

    var userResources = {
        user: {
            type: "document",
            user: true,
            schema: {
                attributes: {
                    name: String
                }
            }
        },
    },
    mongoose = require('mongoose'),
    userSchemaFactory = require('../lib/schema-factory')(userResources, mongoose)


    test.deepEqual(userSchemaFactory.getSchemaAttributes('user'), {
        username: String,
        password: String,
        name: String
    });

    test.done();
};
