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
    passwordHandler = require('../../lib/security/password-handler'),
    serializer = require('../../lib/serializer/serializer')(resources, passwordHandler);

exports['serialize'] = function(test) {
    test.expect(2);

    var document = {
        username: 'test',
        password: 'toto',
        _id: 1
    };

    test.deepEqual(serializer.serialize('user', document), {
        _id: 1,
        username: 'test',
        password: 'toto'
    });

    test.deepEqual(serializer.serialize('user', document, false), {
        username: 'test',
        password: 'toto'
    });

    test.done();
};



exports['serializeHasMany'] = function(test) {
    test.expect(2);

    var documentGroup = {
        name: "name",
        users: ["1", "2"],
        users2: []
    };

    test.deepEqual(serializer.serialize('group', documentGroup, false), {
        name: 'name',
        users: ["1", "2"],
        users2: []
    });

    documentGroup = {
        name: "name",
        users: [],
        users2: [{
            username: 'test',
            password: 'toto'
        }]
    };

    test.deepEqual(serializer.serialize('group', documentGroup, false), {
        name: "name",
        users: [],
        users2: [{
            username: 'test',
            password: 'toto'
        }]
    });

    test.done();
};

exports['serializeHasOne'] = function(test) {
    test.expect(1);

    var documentFriend = {
        name: "name",
        user: "2",
        user2: {
            username: 'test',
            password: 'toto'
        }
    };

    test.deepEqual(serializer.serialize('friend', documentFriend, false), {
        name: 'name',
        user: "2",
        user2: {
            username: 'test',
            password: 'toto'
        }
    });

    test.done();
};

exports['serialize user'] = function(test) {
    test.expect(1);

        var userResources = {
            user: {
                type: "document",
                schema: {},
                user: true
            }
        },
        userSerializer = require('../../lib/serializer/serializer')(userResources, passwordHandler);

    var documentUser = {
        username: 'test',
        password: 'aaa'
    };

    test.deepEqual(userSerializer.serialize('user', documentUser, false), {
        username: 'test'
    });

    test.done();
};

exports['hydrate user'] = function(test) {
    test.expect(1);

        var userResources = {
            user: {
                type: "document",
                schema: {},
                user: true
            }
        },
        userSerializer = require('../../lib/serializer/serializer')(userResources, passwordHandler);

    var dataUser = {
        username: 'test',
        password: 'aaa'
    };

    var document = {};
    userSerializer.hydrate('user', document, dataUser)

    test.deepEqual(document, {
        username: 'test',
        password: 'aaa'
    });

    test.done();
};

