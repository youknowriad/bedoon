var validator = require('../../lib/validator/string-validator');

exports['validate'] = function (test) {
    test.expect(3);
    test.deepEqual(validator.validate('field', null), ['the "field" attribute must be a string']);
    test.deepEqual(validator.validate('field', null, true), ['the "field" attribute should only contain string values']);
    test.deepEqual(validator.validate('field', "test"), []);
    test.done();
};

