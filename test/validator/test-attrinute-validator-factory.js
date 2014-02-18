var factory = require('../../lib/validator/attribute-validator-factory'),
    stringValidator = require('../../lib/validator/string-validator'),
    dateValidator = require('../../lib/validator/date-validator'),
    noValidator = require('../../lib/validator/no-validator');


exports['get Validator'] = function (test) {
    test.expect(3);

    test.deepEqual(factory.getValidator(String), stringValidator);
    test.deepEqual(factory.getValidator(Date), dateValidator);
    test.deepEqual(factory.getValidator('test'), noValidator);

    test.done();
};

