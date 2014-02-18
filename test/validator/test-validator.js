exports['validate attributes'] = function (test) {

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
        },
        validator = require('../../lib/validator/validator')(resources),
        data = {
            username: 'test',
            password: 'toto'
        };

    test.expect(2);
    test.deepEqual(validator.validate('user', data), {
        valid: true,
        messages: []
    });
    

    data = {
        username: 10,
        password: 'toto'
    };

    test.deepEqual(validator.validate('user', data), {
        valid: false,
        messages: [ 'the "username" attribute must be a string' ]
    });

    

    test.done();
};

exports['validate has many'] = function (test) {
    var resources = {
            post: {
                type: "document",
                schema: {
                    attributes: {
                        title: String
                    },
                    hasMany: {
                        comments: { type: 'id', target: 'comment' },
                        comments2: { type: 'embed', target: 'comment' }
                    }
                }
            },
            comment: {
                type: "document",
                schema: {
                    attributes: {
                        message: String
                    }
                }
            },
        },
        validator = require('../../lib/validator/validator')(resources),
        data = {
            title: 'test',
            comments: [
                'id1',
                'id2',
            ],
            comments2: [
                { message: 'message' }
            ]
        };

    test.expect(3);

    test.deepEqual(validator.validate('post', data), {
        valid: true,
        messages: []
    });
    

    data = data = {
        title: 'test',
        comments: [2],
        comments2: [
            { message: 'message' }
        ]
    };

    test.deepEqual(validator.validate('post', data), {
        valid: false,
        messages: [ 'the "comments" attribute should only contain string values' ]
    });

    data = data = {
        title: 'test',
        comments: ['id'],
        comments2: [
            { message: 10}
        ]
    };

    test.deepEqual(validator.validate('post', data), {
        valid: false,
        messages: [ 'the "message" attribute must be a string' ]
    });

    test.done();
};


exports['validate has one'] = function (test) {
    var resources = {
            post: {
                type: "document",
                schema: {
                    attributes: {
                        title: String
                    },
                    hasOne: {
                        author: { type: 'id', target: 'user' },
                        author2: { type: 'embed', target: 'user' }
                    }
                }
            },
            user: {
                type: "document",
                schema: {
                    attributes: {
                        username: String
                    }
                }
            },
        },
        validator = require('../../lib/validator/validator')(resources),
        data = {
            title: 'test',
            author: 'id1',
            author2: { username: 'message' }
        };

    test.expect(3);

    test.deepEqual(validator.validate('post', data), {
        valid: true,
        messages: []
    });
    

    data = data = {
        title: 'test',
        author: 1,
        author2: { username: 'message' }
    };

    test.deepEqual(validator.validate('post', data), {
        valid: false,
        messages: [ 'the "author" attribute must be a string' ]
    });

    data = data = {
        title: 'test',
        author: 'id1',
        author2: { username: 10 }
    };

    test.deepEqual(validator.validate('post', data), {
        valid: false,
        messages: [ 'the "username" attribute must be a string' ]
    });

    test.done();
};


exports['validate user'] = function (test) {

    var resources = {
            user: {
                type: "document",
                schema: {
                    attributes: {}
                },
                user: true
            },
        },
        validator = require('../../lib/validator/validator')(resources),
        data = {
            username: 'test',
            password: 'toto'
        };

    test.expect(3);
    
    test.deepEqual(validator.validate('user', data), {
        valid: true,
        messages: []
    });
    

    data = {};
    test.deepEqual(validator.validate('user', data), {
        valid: false,
        messages: [ 'the "username" attribute must be a string' ]
    });

    data = {
        username: 'test',
        password: 1000
    };
    test.deepEqual(validator.validate('user', data), {
        valid: false,
        messages: [ 'the "password" attribute must be a string' ]
    });

    test.done();
};
